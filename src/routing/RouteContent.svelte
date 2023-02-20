<script lang="ts">
	import type { ComponentType } from 'svelte';
	import Item from '../Item.svelte';
	import * as storyLists from '../lists.js';
	import Preferenes from '../Preferences.svelte';
	import { currentUrl } from './router';

	const routes: { [key: string]: ComponentType } = {
		'/': storyLists.TopStories,
		'/newest': storyLists.NewStories,
		'/best': storyLists.BestStories,
		'/ask': storyLists.AskStories,
		'/show': storyLists.ShowStories,
		'/jobs': storyLists.JobStories,
		'/info': Preferenes,
		'/item': Item,
	};

	$: routeComponent = routes[$currentUrl.pathname];

	let key = Symbol();

	$: {
		$currentUrl;
		key = Symbol();
		window.scrollTo(0, 0);
	}
</script>

{#if routeComponent}
	{#key key}
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
