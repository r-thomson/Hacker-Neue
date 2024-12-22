<script lang="ts">
	import Comment from './components/Comment.svelte';
	import ErrorMessage from './components/ErrorMessage.svelte';
	import Story from './components/Story.svelte';
	import { search } from './hacker-news/algolia';
	import { debouncedStore, searchParamStore } from './utils';

	const searchQuery = searchParamStore('q');
	const debouncedSearchQuery = debouncedStore(searchQuery, 350, '');

	let type = searchParamStore('type');
	let sort = searchParamStore('sort', 'popularity');

	function isValidType(type: string): type is 'story' | 'comment' {
		return type === 'story' || type === 'comment';
	}

	let searchResults = $derived(
		$debouncedSearchQuery
			? search($debouncedSearchQuery, {
					tags: isValidType($type) ? [$type] : undefined,
					ordering: $sort === 'date' ? 'date' : 'popularity',
					hitsPerPage: 50,
				})
			: null,
	);
</script>

<form class="search-form" onsubmit={(e) => e.preventDefault()}>
	<input type="search" bind:value={$searchQuery} placeholder="Search" aria-label="Search" />
	<label>
		Type
		<select bind:value={$type}>
			<option value={''}>All items</option>
			<option value={'story'}>Stories</option>
			<option value={'comment'}>Comments</option>
		</select>
	</label>
	<label>
		Sort by
		<select bind:value={$sort}>
			<option value={'popularity'}>Popularity</option>
			<option value={'date'}>Most Recent</option>
		</select>
	</label>
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

	label {
		font-size: 0.875rem;
		white-space: nowrap;
	}

	input[type='search'] {
		flex: 1;
	}

	@media (max-width: 30em) {
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
