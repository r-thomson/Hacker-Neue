<script>
import { fetchStoryIDs, fetchStory } from '../hn-api.js';

export let list;

let stories = fetchStoryIDs(list)
	.then(ids => ids.map(id => fetchStory(id)))
	.then(stories => Promise.all(stories))
</script>

{#await stories}
Loading
{:then stories}
<ol>
	{#each stories as story}
		<li>{story.title}</li>
	{/each}
</ol>
{:catch error}
<code>{error}</code>
{/await}
