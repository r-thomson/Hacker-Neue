<script>
	import { fetchItem, fetchKids } from './hn-api.js';
	import Comment from './components/Comment.svelte';
	import Loader from './components/Loader.svelte';
	import Story from './components/Story.svelte';

	const itemID = new URLSearchParams(window.location.search.substring(1)).get('id');
	const item = fetchItem(itemID);
	const comments = item.then(item => fetchKids(item));
</script>

{#await item then item}
	<Story story={item} />
	<hr>
	{#await comments}
		<Loader />
	{:then comments}
		{#each comments || [] as comment (comment.id)}
			<Comment comment={comment} />
		{/each}
	{:catch error}
		<code>{error}</code>
	{/await}
{/await}

<style>
	hr {
		width: 100%;
		border: none;
		border-bottom: 1px solid var(--color-accentlight);
		margin: 1.5em auto;
	}
</style>
