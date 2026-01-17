<script lang="ts">
	import { fetchItem, fetchStoryIds } from '$lib/hacker-news/api';
	import type { HNJob, HNList, HNPoll, HNStory } from '$lib/hacker-news/types';
	import { maxStories, showCounters } from '$lib/preferences';
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';
	import Story from '$lib/components/Story.svelte';
	import StorySkeleton from '$lib/components/StorySkeleton.svelte';
	import { focus } from '$lib/utils';
	import { shortcut } from '$lib/utils.svelte';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';
	import type { ListParam } from '../../params/storylist.ts';

	function paramToHnList(param: ListParam): HNList {
		switch (param) {
			case undefined:
				return 'top';
			case 'newest':
				return 'new';
			case 'best':
				return 'best';
			case 'ask':
				return 'ask';
			case 'show':
				return 'show';
			case 'jobs':
				return 'job';
			default:
				throw Error(`Unexpected URL param ${param}`);
		}
	}

	let pageNum = $derived(Number.parseInt(page.url.searchParams.get('p') ?? '') || 1);
	let pageLen = $maxStories;

	// Indices of first and last items on the current page
	let first = $derived(pageLen * (pageNum - 1));
	let last = $derived(first + pageLen);

	let stories = $derived(
		fetchStoryIds(paramToHnList(page.params.list as ListParam))
			.then((ids) => ids.slice(first, last)) // Pagination
			.then((ids) =>
				ids.map((id) => fetchItem(id) as Promise<HNStory | HNJob | HNPoll | null>),
			)
			.then((stories) => Promise.all(stories)),
	);

	let focusIndex: number = $state(-1); // -1 == no focus

	async function setFocusIndex(value: number) {
		const numStories = (await stories).length;
		focusIndex = Math.min(Math.max(0, value), numStories - 1);
	}

	async function getFocusedStory() {
		return (await stories)[focusIndex] ?? null;
	}

	async function openFocusedStory() {
		const story = await getFocusedStory();
		if (story) {
			// TODO: implement HN link rewriting here
			if ('url' in story && story.url) {
				location.href = story.url;
			} else {
				goto(`/item?id=${story.id}`);
			}
		}
	}

	async function openFocusedStoryComments() {
		const story = await getFocusedStory();
		if (story) {
			goto(`/item?id=${story.id}`);
		}
	}

	async function openFocusedStoryAuthor() {
		const story = await getFocusedStory();
		if (story && 'by' in story) {
			goto(`/user?id=${story.by}`);
		}
	}

	shortcut('j', () => setFocusIndex(focusIndex + 1));
	shortcut('J', () => setFocusIndex(Infinity));
	shortcut('k', () => setFocusIndex(focusIndex - 1));
	shortcut('K', () => setFocusIndex(0));
	shortcut('o', () => openFocusedStory());
	shortcut('Enter', () => openFocusedStory());
	shortcut('c', () => openFocusedStoryComments());
	shortcut('u', () => openFocusedStoryAuthor());
</script>

{#await stories}
	<ol start={first + 1} class:counters={$showCounters}>
		{#each { length: 10 } as _, i}
			<li style:opacity={(10 - i) * 0.1} style:animation-delay={`${i * 0.07}s`}>
				<StorySkeleton />
			</li>
		{/each}
	</ol>
{:then stories}
	<ol start={first + 1} class:counters={$showCounters}>
		{#each stories as story, i (story?.id)}
			{#if story && !story.deleted}
				<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
				<li
					{@attach focus(focusIndex === i)}
					tabindex={focusIndex === i ? -1 : undefined}
					onblur={() => {
						if (focusIndex === i) {
							focusIndex = -1;
						}
					}}
				>
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
