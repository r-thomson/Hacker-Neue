<script lang="ts">
	import type { ComponentType } from 'svelte';
	import Item from '../Item.svelte';
	import * as storyLists from '../lists.js';
	import Search from '../Search.svelte';
	import { currentUrl } from './router';

	const routes: { [key: string]: ComponentType } = {
		'/': storyLists.TopStories,
		'/newest': storyLists.NewStories,
		'/best': storyLists.BestStories,
		'/ask': storyLists.AskStories,
		'/show': storyLists.ShowStories,
		'/jobs': storyLists.JobStories,
		'/search': Search,
		'/item': Item,
	};

	$: routeComponent = routes[$currentUrl.pathname];

	let routeKey = Symbol();

	$: {
		// This is a hack just to make the search page work. Otherwise, every keystroke
		// would refresh the page, which sucks. To correctly fix this you'd need to make
		// Item.svelte and a few others be properly reactive when they read $currentUrl,
		// but that's easier said than done. Probably best to wait for runes.
		if ($currentUrl.pathname !== '/search') {
			routeKey = Symbol();
			document.title = 'Hacker Neue';
			window.scrollTo(0, 0);
		}
	}
</script>

{#if routeComponent}
	{#key routeKey}
		<svelte:component this={routeComponent} />
	{/key}
{:else}
	<div class="message">404 Error (not found)</div>
{/if}

<style>
	.message {
		margin-top: 15%;
		text-align: center;
		text-transform: uppercase;
	}
</style>
