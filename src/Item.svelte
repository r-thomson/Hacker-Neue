<script>
	import { fetchItem, fetchKids } from './hn-api.js';
	import Comment from './components/Comment.svelte';
	import Content from './components/Content.svelte';
	import Loader from './components/Loader.svelte';
	import Story from './components/Story.svelte';

	const itemID = new URLSearchParams(window.location.search.substring(1)).get('id');
	const item = fetchItem(itemID);
	const comments = item.then((item) => fetchKids(item));

	// Set page title manually until a proper reactive solution is implemented
	item.then((item) => {
		document.title = `${item.title} - Hacker Neue`;
	});
</script>

{#await item then item}
	<Story story={item} />

	{#if item.text}
		<div class="item-body">
			<Content content={item.text} />
		</div>
	{/if}

	<hr class="comments-divider" />

	{#await comments}
		<Loader />
	{:then comments}
		<div class="story-comments">
			{#each comments || [] as comment (comment.id)}
				<Comment {comment} />
			{/each}
		</div>
	{:catch error}
		<code>{error}</code>
	{/await}
{/await}

<style>
	.story-comments > :global(.comment + .comment) {
		margin-top: 0.5rem;
	}

	.item-body {
		margin-top: 0.75rem;
		font-size: 0.875rem;
	}

	.comments-divider {
		margin: 1.25rem 0;
		border: none;
		border-top: 1px solid var(--color-tertiary);
	}
</style>
