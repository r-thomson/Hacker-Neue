export const API_PREFIX = 'https://hacker-news.firebaseio.com/v0/';

/**
 * Retrieves an array of story IDs for a given story list
 * @async
 * @param {string} list Name of the story list (top, new, ask, etc.)
 * @returns {number[]} The story IDs for the specified list, ordered
 */
export async function fetchStoryIDs(list) {
	const res = await fetch(`${API_PREFIX}${list}stories.json`);
	if (res.status === 200) {
		return await res.json();
	}
}

/**
 * Retrieves the item with the given ID
 * @async
 * @param {number} id The item's ID (will be converted to an integer)
 * @returns {Object} The item with the specified ID
 */
export async function fetchItem(id) {
	id = Number.parseInt(id);
	if (isNaN(id) || id < 1) { throw TypeError(`'${id}' is not a valid story ID`); }
	
	const res = await fetch(`${API_PREFIX}item/${id}.json`);
	if (res.status === 200) {
		return await res.json();
	}
}

/**
 * Recursively retrieves the kid items of a given item
 * @async
 * @param {Object} parent The parent item (should contain a `kids` property)
 * @param {number} depth Tracks the current level of recursion
 */
export async function fetchKids(parent, depth = 1) {
	if (!parent.kids) { return; } // Base case
	
	const kids = await Promise.all(parent.kids.map(async id => {
		const item = await fetchItem(id);
		if (item) {
			item.kids = await fetchKids(item, depth + 1);
		}
		return item;
	}));
	
	return kids.filter(item => item !== null);
}
