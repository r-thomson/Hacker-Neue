<script lang="ts">
	import Comment from './components/Comment.svelte';
	import ErrorMessage from './components/ErrorMessage.svelte';
	import Story from './components/Story.svelte';
	import { search } from './hacker-news/algolia';
	import { toStore } from 'svelte/store';
	import { untrack } from 'svelte';
	import { getUnixTime } from 'date-fns';
	import { debouncedStore, searchParamStore } from './utils';
	import { router } from './routing/router.svelte';

	let searchQuery = $state(router.currentUrl.searchParams.get('q') ?? '');
	let debouncedSearchQuery = debouncedStore(
		toStore(() => searchQuery),
		350,
		// svelte-ignore state_referenced_locally
		searchQuery,
	);

	$effect(() => {
		// This is like searchParamStore, but one-way
		const newUrl = new URL(untrack(() => router.currentUrl.href));
		if ($debouncedSearchQuery) {
			newUrl.searchParams.set('q', $debouncedSearchQuery);
		} else {
			newUrl.searchParams.delete('q');
		}

		router.navigate(newUrl.pathname + newUrl.search + newUrl.hash, { replace: true });
	});

	let type = searchParamStore('type');
	let sort = searchParamStore('sort', 'popularity');
	let time = searchParamStore('time');

	function isValidType(type: string): type is 'story' | 'comment' | 'show_hn' | 'ask_hn' {
		return ['story', 'comment', 'show_hn', 'ask_hn'].includes(type);
	}

	const ONE_DAY_IN_SECS = 86400;
	let time_i = $derived.by(() => {
		const unixNow = getUnixTime(new Date());
		switch ($time) {
			case 'day':
				return unixNow - ONE_DAY_IN_SECS;
			case 'week':
				return unixNow - ONE_DAY_IN_SECS * 7;
			case 'month':
				return unixNow - ONE_DAY_IN_SECS * 30;
			case 'year':
				return unixNow - ONE_DAY_IN_SECS * 365;
			case 'decade':
				return unixNow - ONE_DAY_IN_SECS * 3650;
			default:
				return undefined;
		}
	});

	let searchResults = $derived(
		$debouncedSearchQuery
			? search($debouncedSearchQuery, {
					tags: isValidType($type) ? [$type] : undefined,
					ordering: $sort === 'date' ? 'date' : 'popularity',
					numericFilters: time_i !== undefined ? `created_at_i>${time_i}` : undefined,
					hitsPerPage: 50,
				})
			: null,
	);
</script>

<form class="search-form" onsubmit={(e) => e.preventDefault()}>
	<input type="search" bind:value={searchQuery} placeholder="Search" aria-label="Search" />

	<select bind:value={$type} aria-label="Type">
		<option value={''}>All items</option>
		<option value={'story'}>Stories</option>
		<option value={'show_hn'}>Show HN</option>
		<option value={'ask_hn'}>Ask HN</option>
		<option value={'comment'}>Comments</option>
	</select>

	<select bind:value={$sort} aria-label="Sort by">
		<option value={'popularity'}>Most popular</option>
		<option value={'date'}>Most recent</option>
	</select>

	<select bind:value={$time} aria-label="Time period">
		<option value={''}>All time</option>
		<option value={'day'}>Past day</option>
		<option value={'week'}>Past week</option>
		<option value={'month'}>Past month</option>
		<option value={'year'}>Past year</option>
		<option value={'decade'}>Past decade</option>
	</select>
</form>

{#if searchResults}
	{#await searchResults then searchResults}
		<ol>
			{#each searchResults as item}
				{#if item.type === 'story' || item.type === 'job' || item.type === 'poll'}
					<li>
						<Story story={item} />
					</li>
				{:else if item.type === 'comment'}
					<li>
						<Comment comment={item} />
					</li>
				{/if}
			{/each}
		</ol>
		<p class="empty-message">There are no results for this search.</p>
	{:catch error}
		<ErrorMessage {error} />
	{/await}
{/if}

<style>
	.search-form {
		display: flex;
		align-items: center;
		row-gap: 0.25rem;
		column-gap: 0.5rem;
		margin-bottom: 1rem;
	}

	input[type='search'] {
		flex: 1;
	}

	@media (max-width: 32em) {
		.search-form {
			flex-wrap: wrap;
		}

		input[type='search'] {
			flex-basis: 100%;
		}
	}

	ol {
		margin: 0;
		padding: 0;
	}

	li {
		list-style-type: none;
	}

	li + li {
		margin-top: 0.5rem;
	}

	.empty-message {
		margin: 6rem 0 4rem;
		text-align: center;
		font-size: 0.875rem;
		color: var(--color-secondary);
	}

	:not(:empty) + .empty-message {
		display: none;
	}
</style>
