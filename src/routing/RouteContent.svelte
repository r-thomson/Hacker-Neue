<script lang="ts">
	import { router } from './router.svelte';
	import { routes } from './routes';

	let currentRoute = $derived(routes[router.currentUrl.pathname]);

	let routeKey = $state(Symbol());

	$effect(() => {
		// This is a hack just to make the search page work. Otherwise, every keystroke
		// would refresh the page, which sucks. To correctly fix this you'd need to make
		// Item.svelte and a few others be properly reactive when they read $currentUrl,
		// but that's easier said than done. Probably best to wait for runes.
		if (router.currentUrl.pathname !== '/search') {
			routeKey = Symbol();
			document.title = 'Hacker Neue';
			window.scrollTo(0, 0);
		}
	});
</script>

{#if currentRoute}
	{#key routeKey}
		<currentRoute.component {...currentRoute.props} />
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
