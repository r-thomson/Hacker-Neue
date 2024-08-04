<script lang="ts">
	import Header from './components/Header.svelte';
	import RouteContent from './routing/RouteContent.svelte';
	import { currentUrl } from './routing/router';

	$: showOpenInHN = !['/search'].includes($currentUrl.pathname);
	$: relativeUrl = $currentUrl.href.slice($currentUrl.origin.length);

	// GoatCounter analytics. It's easier to put this in a component so we can
	// use Svelte's reactivity syntax.
	$: currentPath = $currentUrl.pathname;
	let prevPath: string | undefined = undefined;
	$: {
		if (typeof window.goatcounter?.count === 'function') {
			goatcounter.count({
				path: currentPath,
				referrer: prevPath ? new URL(prevPath, location.origin).href : undefined,
			});
		}
		prevPath = currentPath;
	}
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
