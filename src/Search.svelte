<script lang="ts">
	import { writable } from 'svelte/store';
	import Comment from './components/Comment.svelte';
	import Story from './components/Story.svelte';
	import { search } from './hacker-news/algolia';
	import { debouncedStore } from './utils';

	const searchQuery = writable('');
	const debouncedSearchQuery = debouncedStore(searchQuery, 350, '');

	let type: 'story' | 'comment' | null = null;
	let sort: 'popularity' | 'date' = 'popularity';

	$: searchResults = $debouncedSearchQuery
		? search($debouncedSearchQuery, {
				tags: type ? [type] : undefined,
				ordering: sort,
				hitsPerPage: 50,
		  })
		: null;
</script>

<form class="search-form" on:submit|preventDefault={() => {}}>
	<input type="search" bind:value={$searchQuery} placeholder="Search" aria-label="Search" />
	<label>
		Type
		<select bind:value={type}>
			<option value={null}>All items</option>
			<option value={'story'}>Stories</option>
			<option value={'comment'}>Comments</option>
		</select>
	</label>
	<label>
		Sort by
		<select bind:value={sort}>
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
	{:catch error}
		<code>{error}</code>
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
</style>
