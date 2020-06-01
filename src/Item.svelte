<script>
import { fetchItem, fetchKids } from './hn-api.js';
import Comment from './components/Comment.svelte';
import Story from './components/Story.svelte';

const itemID = new URLSearchParams(window.location.search.substring(1)).get('id');
const item = fetchItem(itemID);
const comments = item.then(item => fetchKids(item));
</script>

{#await item then item}
	<Story story={item} />
	<hr>
	{#await comments}
		Loading
	{:then comments}
		{#each comments || [] as comment (comment.id)}
			<Comment comment={comment} />
		{/each}
	{:catch error}
		<code>{error}</code>
	{/await}
{/await}
