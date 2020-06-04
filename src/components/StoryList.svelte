<script>
import { fetchStoryIDs, fetchItem } from '../hn-api.js';
import Story from './Story.svelte';

export let list;

const pageNum = Number.parseInt(new URLSearchParams(window.location.search).get('page'), 10) || 1;
const pageLength = 30;

// Indices of first and last items on the current page
const first = pageLength * (pageNum - 1);
const last = first + pageLength;

const stories = fetchStoryIDs(list)
	.then(ids => ids.slice(first, last)) // Pagination
	.then(ids => ids.map(id => fetchItem(id)))
	.then(stories => Promise.all(stories));
</script>

{#await stories}
	Loading
{:then stories}
	<ol start={first + 1}>
		{#each stories as story (story.id)}
			<li><Story story={story} /></li>
		{/each}
	</ol>
	<div>
		{#if pageNum > 1}
			<a href="?page={pageNum - 1}">Previous Page</a>
		{/if}
		<a href="?page={pageNum + 1}">Next Page</a>
	</div>
{:catch error}
	<code>{error}</code>
{/await}

<style>
ol {
	margin: 0;
	padding: 0;
	list-style: none;
}
</style>
