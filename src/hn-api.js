import { initializeApp } from 'firebase/app';
import { child, get, getDatabase, ref } from 'firebase/database';

// Namespace for symbols, used to augment API-supplied JSON without name collisions
export const symbols = {
	resolvedKids: Symbol('resolvedKids'),
	rootItem: Symbol('rootItem'),
};

// Sourced from https://github.com/minimaxir/hacker-news-undocumented#moderators
export const mods = new Set(['dang', 'sctb']);

const firebaseApp = initializeApp({ databaseURL: 'https://hacker-news.firebaseio.com' });
const firebaseDbRef = ref(getDatabase(firebaseApp), 'v0');

/**
 * Retrieves an array of story IDs for a given story list
 * @async
 * @param {string} list Name of the story list (top, new, ask, etc.)
 * @returns {number[]} The story IDs for the specified list, ordered
 */
export async function fetchStoryIDs(list) {
	const snapshot = await get(child(firebaseDbRef, `${list}stories`));
	return snapshot.val();
}

/**
 * Retrieves the item with the given ID
 * @async
 * @param {number} id The item's ID (will be converted to an integer)
 * @returns {Object} The item with the specified ID
 */
export async function fetchItem(id) {
	id = Number.parseInt(id);
	if (isNaN(id) || id < 1) {
		throw TypeError(`'${id}' is not a valid story ID`);
	}

	const snapshot = await get(child(firebaseDbRef, `item/${id}`));
	return snapshot.val();
}

/**
 * Recursively retrieves the kid items of a given item
 * @async
 * @param {Object} parent The parent item (should contain a `kids` property)
 * @param {Function} onFetchItem Called whenever an item is fetched
 * @param {number} depth Tracks the current level of recursion
 */
export async function fetchKids(parent, onFetchItem = null, depth = 1) {
	if (!parent.kids) return; // Base case

	const kids = await Promise.all(
		parent.kids.map(async (id) => {
			const item = await fetchItem(id);

			if (item) {
				if (item.deleted) return null;

				// Hack to support tracking progress on the items page (dead don't count)
				if (!item.dead) {
					onFetchItem?.();
				}

				item[symbols.rootItem] = parent[symbols.rootItem] || parent;
				item[symbols.resolvedKids] = await fetchKids(item, onFetchItem, depth + 1);
			}

			return item;
		})
	);

	return kids.filter((item) => item !== null);
}
