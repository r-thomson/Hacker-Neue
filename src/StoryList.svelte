<script lang="ts">
	import { fetchItem, fetchStoryIds } from './hacker-news/api';
	import type { HNJob, HNList, HNPoll, HNStory } from './hacker-news/types';
	import { maxStories, showCounters } from './preferences';
	import { router } from './routing/router.svelte';
	import ErrorMessage from './components/ErrorMessage.svelte';
	import Story from './components/Story.svelte';
	import StorySkeleton from './components/StorySkeleton.svelte';

	interface Props {
		list: HNList;
	}

	let { list }: Props = $props();

	let pageNum = $derived(Number.parseInt(router.currentUrl.searchParams.get('p') ?? '') || 1);
	let pageLen = $maxStories;

	// Indices of first and last items on the current page
	let first = $derived(pageLen * (pageNum - 1));
	let last = $derived(first + pageLen);

	let stories = $derived(
		fetchStoryIds(list)
			.then((ids) => ids.slice(first, last)) // Pagination
			.then((ids) =>
				ids.map((id) => fetchItem(id) as Promise<HNStory | HNJob | HNPoll | null>),
			)
			.then((stories) => Promise.all(stories)),
	);
</script>

{#await stories}
	<ol start={first + 1} class:counters={$showCounters}>
		{#each { length: 10 } as _, i}
			<li style:opacity={(10 - i) * 0.1}>
				<StorySkeleton />
			</li>
		{/each}
	</ol>
{:then stories}
	<ol start={first + 1} class:counters={$showCounters}>
		{#each stories as story (story?.id)}
			{#if story && !story.deleted}
				<li>
					<Story {story} />
				</li>
			{/if}
		{/each}
	</ol>
	<div class="pagination">
		<a href="?p={pageNum + 1}">More Stories &rarr;</a>
	</div>
{:catch error}
	<ErrorMessage {error} />
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
		--counter-width: 2rem;

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
