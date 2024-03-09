<script lang="ts">
	import Header from './components/Header.svelte';
	import RouteContent from './routing/RouteContent.svelte';
	import { currentUrl } from './routing/router';

	$: showOpenInHN = !['/search'].includes($currentUrl.pathname);
	$: relativeUrl = $currentUrl.href.slice($currentUrl.origin.length);
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
		max-width: var(--content-max-width);
		margin: 0 auto;
	}

	main {
		min-height: calc(90vh - 8rem);
		padding: 1rem var(--content-padding-x) 2.5rem;
	}

	footer {
		padding: 1rem var(--content-padding-x) 6rem;
		display: flex;
		border-top: 1px solid var(--color-tertiary);
		color: var(--color-secondary);
		font-size: 0.875rem;
	}

	footer :last-child {
		margin-left: auto;
	}
</style>
