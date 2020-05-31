<script>
import { fetchItem } from './hn-api.js';
import Story from './components/Story.svelte';

const itemID = new URLSearchParams(window.location.search.substring(1)).get('id');
const item = fetchItem(itemID);
</script>

{#await item then item}
	<Story story={item} />
{/await}
