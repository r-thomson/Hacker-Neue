import type { DeadHNItem, DeletedHNItem, HNItem } from './types';

interface SearchOptions {
	ordering?: 'popularity' | 'date';
	tags?: Tag[];
	numericFilters?: string;
	page?: number;
	hitsPerPage?: number;
}

type Tag =
	| 'story'
	| 'comment'
	| 'poll'
	| 'pollopt'
	| 'show_hn'
	| 'ask_hn'
	| 'front_page'
	| `author_${string}`
	| `story_${string}`;

type SearchResult = Exclude<HNItem, DeletedHNItem | DeadHNItem>;

/**
 * Perform a search with the public Algolia HN API.
 * @param query - Text to search for
 * @param options - Additional search options
 */
export async function search(query: string, options: SearchOptions = {}): Promise<SearchResult[]> {
	const url = new URL('https://hn.algolia.com/api/v1');
	url.pathname += options.ordering === 'date' ? '/search_by_date' : '/search';

	url.searchParams.set('query', query);
	if (options.tags) url.searchParams.set('tags', stringifyArray(options.tags));
	if (options.numericFilters) url.searchParams.set('numericFilters', options.numericFilters);
	if (options.page) url.searchParams.set('page', options.page.toString());
	if (options.hitsPerPage) url.searchParams.set('hitsPerPage', options.hitsPerPage.toString());

	const response = await fetch(url);
	if (response.status !== 200) throw Error(response.statusText);

	const { hits } = await response.json();
	return hits.map((hit: any) => searchItemToHNItem(hit));
}

function stringifyArray(array: Array<string | string[]>): string {
	return array.map((value) => (Array.isArray(value) ? `(${value.join(',')})` : value)).join(',');
}

function searchItemToHNItem(searchHit: any): HNItem {
	// Working off the assumption that the item's "type" is always the first tag
	const typeTags = new Set(['story', 'comment', 'poll', 'pollopt']);
	const type: string | undefined = searchHit._tags.find((tag: string) => typeTags.has(tag));

	switch (type) {
		case 'story':
			return {
				id: searchHit.objectID,
				type: 'story',
				time: searchHit.created_at_i,
				title: searchHit.title,
				url: searchHit.url,
				text: searchHit.story_text,
				by: searchHit.author,
				score: searchHit.points,
				descendants: searchHit.num_comments,
			};
		case 'comment':
			return {
				id: searchHit.objectID,
				type: 'comment',
				time: searchHit.created_at_i,
				text: searchHit.comment_text,
				by: searchHit.author,
				parent: searchHit.parent_id,
			};
		case 'poll':
			return {
				id: searchHit.objectID,
				type: 'poll',
				time: searchHit.created_at_i,
				title: searchHit.title,
				by: searchHit.author,
				score: searchHit.points,
				parts: [], // Not supported :(
				descendants: searchHit.num_comments,
			};
		case 'pollopt':
			return {
				id: searchHit.objectID,
				type: 'pollopt',
				time: searchHit.created_at_i,
				by: searchHit.author,
				text: searchHit.story_text,
				poll: searchHit.parent_id,
				score: searchHit.points,
			};
		default:
			throw Error(`Unexpected type "${type}"`);
	}
}
