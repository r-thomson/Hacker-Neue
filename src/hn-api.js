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
 * Retrieves the story with the given ID
 * @async
 * @param {number} id The story's ID (will be converted to an integer)
 * @returns {Object} The story with the specified ID
 */
export async function fetchStory(id) {
	id = Number.parseInt(id);
	if (isNaN(id) || id < 1) { throw TypeError(`'${id}' is not a valid story ID`); }
	
	const res = await fetch(`${API_PREFIX}item/${id}.json`);
	if (res.status === 200) {
		const story = await res.json();
		
		if (!['story', 'job', 'poll'].includes(story.type)) {
			console.warn(`Item ${story.id} is not a valid story type ('${story.type}')`);
		}
		
		return story;
	}
}
