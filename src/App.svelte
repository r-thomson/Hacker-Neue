<script lang="ts">
	import Header from './components/Header.svelte';
	import RouteContent from './routing/RouteContent.svelte';
	import { router } from './routing/router.svelte';

	let showOpenInHN = $derived(!['/search'].includes(router.currentUrl.pathname));
	let relativeUrl = $derived(router.currentUrl.href.slice(router.currentUrl.origin.length));
</script>

<Header />
<main>
	<RouteContent />
</main>
<footer>
	{#if showOpenInHN}
		<a href="https://news.ycombinator.com{relativeUrl}">Open on Hacker News</a>
	{/if}
	<a href="https://github.com/r-thomson/Hacker-Neue">Source on GitHub</a>
</footer>

<style>
	main,
	footer {
		box-sizing: content-box;
		max-width: var(--content-max-width);
		margin: 0 auto;
		padding-left: max(16px, env(safe-area-inset-left));
		padding-right: max(16px, env(safe-area-inset-right));
	}

	main {
		min-height: calc(90vh - 10rem);
		padding-top: 1rem;
		padding-bottom: 2.5rem;
	}

	footer {
		padding-top: 1rem;
		padding-bottom: 6rem;
		display: flex;
		border-top: 1px solid var(--color-tertiary);
		color: var(--color-secondary);
		font-size: 0.875rem;
	}

	footer :last-child {
		margin-left: auto;
	}
</style>
