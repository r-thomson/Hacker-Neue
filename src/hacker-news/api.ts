import { initializeApp } from 'firebase/app';
import { child, get, getDatabase, ref } from 'firebase/database';
import type { HNItem, HNList } from './types';

export namespace symbols {
	export const resolvedKids: unique symbol = Symbol('resolvedKids');
	export const rootItem: unique symbol = Symbol('rootItem');
}

const firebaseApp = initializeApp({ databaseURL: 'https://hacker-news.firebaseio.com' });
const firebaseDbRef = ref(getDatabase(firebaseApp), 'v0');

/**
 * Retrieves an array of story IDs for a given story list.
 * @param list - Name of the story list (top, new, ask, etc.)
 */
export async function fetchStoryIds(list: HNList): Promise<number[]> {
	const snapshot = await get(child(firebaseDbRef, `${list}stories`));
	return snapshot.val();
}

/**
 * Retrieves the item with the given ID. Returns `null` if it doesn't exist.
 * @param id - The item's ID
 */
export async function fetchItem(id: number): Promise<HNItem | null> {
	const snapshot = await get(child(firebaseDbRef, `item/${id}`));
	return snapshot.val();
}

export type FetchedKids = {
	[symbols.resolvedKids]: (HNItem & FetchedKids)[];
	[symbols.rootItem]: HNItem;
};

/**
 * Recursively retrieves the kid items of a given item.
 * @param parent - The parent item (should contain a `kids` property)
 * @param onFetchItem - Called whenever an item is fetched
 */
export async function fetchKids(
	parent: HNItem,
	onFetchItem?: () => void,
	_depth = 1
): Promise<(HNItem & FetchedKids)[]> {
	if (!('kids' in parent) || !parent.kids) return [];

	const kidsPromises = parent.kids.map(async (itemId) => {
		const item = await fetchItem(itemId);

		if (!item) return null;

		// Hack to support tracking progress on the items page
		if (!item.deleted && !item.dead) {
			onFetchItem?.();
		}

		return Object.assign(item, {
			[symbols.rootItem]: symbols.rootItem in parent ? parent[symbols.rootItem] : parent,
			[symbols.resolvedKids]: await fetchKids(item, onFetchItem, _depth + 1),
		} as FetchedKids);
	});

	const kids = await Promise.all(kidsPromises);
	return kids.filter((item): item is NonNullable<typeof item> => !!item);
}

// Sourced from https://github.com/minimaxir/hacker-news-undocumented#moderators
export const modNames = Object.freeze(new Set(['dang', 'sctb']));
