import type { HNItem, HNList, HNUser } from './types';

export namespace symbols {
	export const resolvedKids: unique symbol = Symbol('resolvedKids');
	export const rootItem: unique symbol = Symbol('rootItem');
}

/**
 * Retrieves an array of story IDs for a given story list.
 * @param list - Name of the story list (top, new, ask, etc.)
 */
export async function fetchStoryIds(list: HNList): Promise<number[]> {
	const { get, child, firebaseDbRef } = await import('./firebase');

	const snapshot = await get(child(firebaseDbRef, `${list}stories`));
	return snapshot.val();
}

/**
 * Retrieves the item with the given ID. Returns `null` if it doesn't exist.
 * @param id - The item's ID
 */
export async function fetchItem(id: number): Promise<HNItem | null> {
	const { get, child, firebaseDbRef } = await import('./firebase');

	const snapshot = await get(child(firebaseDbRef, `item/${id}`));
	const item = snapshot.val();

	// Sometimes the API returns a comment with "* * *" as the text. It's not clear why
	// this happens. These comments aren't visible on Hacker News, so we'll treat them
	// as deleted for now.
	if (item?.text === '* * *') {
		item.deleted = true;
	}

	return item;
}

/**
 * Retrieves the user with the given ID. Returns `null` if it doesn't exist.
 * @param id - The user's ID
 */
export async function fetchUser(id: string): Promise<HNUser | null> {
	const { get, child, firebaseDbRef } = await import('./firebase');

	const snapshot = await get(child(firebaseDbRef, `user/${id}`));
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
	_depth = 1,
): Promise<(HNItem & FetchedKids)[]> {
	if (!('kids' in parent) || !parent.kids) return [];

	const kidsPromises = parent.kids.map(async (itemId) => {
		const item = await fetchItem(itemId);

		if (!item) return null;

		// Hack to support tracking progress on the items page
		if (!item.deleted && !item.dead) {
			onFetchItem?.();
		}

		// We need to assign @@rootItem before recursively calling fetchKids()
		// Admittedly I am not sure how to represent this well in TypeScript
		const itemWithRoot = Object.assign(item, {
			[symbols.rootItem]: symbols.rootItem in parent ? parent[symbols.rootItem] : parent,
		} as Pick<FetchedKids, typeof symbols.rootItem>);

		return Object.assign(itemWithRoot, {
			[symbols.resolvedKids]: await fetchKids(itemWithRoot, onFetchItem, _depth + 1),
		} as Pick<FetchedKids, typeof symbols.resolvedKids>);
	});

	const kids = await Promise.all(kidsPromises);
	return kids.filter((item): item is NonNullable<typeof item> => !!item);
}

// Sourced from https://github.com/minimaxir/hacker-news-undocumented#moderators
export const modNames = Object.freeze(new Set(['dang', 'sctb']));
