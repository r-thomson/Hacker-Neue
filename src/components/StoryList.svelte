<script>
	import { counters, maxStories } from '../preferences';
	import { fetchStoryIDs, fetchItem } from '../hn-api';
	import Loader from './Loader.svelte';
	import Story from './Story.svelte';
	import StorySkeleton from './StorySkeleton.svelte';

	export let list;

	const pageNum = Number.parseInt(new URLSearchParams(window.location.search).get('page'), 10) || 1;
	const pageLength = Number.parseInt($maxStories);

	// Indices of first and last items on the current page
	const first = pageLength * (pageNum - 1);
	const last = first + pageLength;

	const stories = fetchStoryIDs(list)
		.then((ids) => ids.slice(first, last)) // Pagination
		.then((ids) => ids.map((id) => fetchItem(id)))
		.then((stories) => Promise.all(stories))
		.then((stories) => stories.filter((story) => story != null));
	// TODO: prevent null/undefined stories from messing up story numbers
</script>

{#await stories}
	<ol start={first + 1} class:counters={$counters}>
		{#each { length: 10 } as _, i}
		<li style:opacity={(10 - i) * 0.1}>
			<StorySkeleton />
		</li>
		{/each}
	</ol>
{:then stories}
	<ol start={first + 1} class:counters={$counters}>
		{#each stories as story (story.id)}
			<li>
				<Story {story} />
			</li>
		{/each}
	</ol>
	<div class="pagination">
		<a href="?page={pageNum + 1}">More Stories &rarr;</a>
	</div>
{:catch error}
	<code>{error}</code>
{/await}

<style>
	ol {
		margin: 0;
		padding: 0;
	}

	li {
		list-style-type: none;
		position: relative;
	}

	li + li {
		margin-top: 0.5rem;
	}

	.counters li {
		--counter-width: 2.0rem;

		padding-left: var(--counter-width);
	}

	.counters li::before {
		content: counter(list-item) '.';

		position: absolute;
		top: 0;
		left: 0;
		width: var(--counter-width);
		padding-right: 0.25em;

		text-align: right;
		color: var(--color-secondary);
		font-size: 0.875rem;
		line-height: 1.25;
	}

	.pagination {
		margin-top: 0.75rem;
	}
</style>
