<script lang="ts">
	import Header from './components/Header.svelte';
	import ShortcutsModal from './components/ShortcutsModal.svelte';
	import RouteContent from './routing/RouteContent.svelte';
	import { router } from './routing/router.svelte';
	import { fontFamily } from './preferences';
	import { shortcut } from './utils.svelte';

	let relativeUrl = $derived(router.currentUrl.href.slice(router.currentUrl.origin.length));
	let hackerNewsUrl = $derived.by(() => {
		if (router.currentUrl.pathname === '/search') return;
		return `https://news.ycombinator.com${relativeUrl}`;
	});

	let shortcutsModalOpen = $state(false);

	shortcut('T', () => router.navigate('/'));
	shortcut('N', () => router.navigate('/newest'));
	shortcut('B', () => router.navigate('/best'));
	shortcut('A', () => router.navigate('/ask'));
	shortcut('S', () => router.navigate('/show'));
	shortcut('y', () => hackerNewsUrl && open(hackerNewsUrl, '_self'));
	shortcut('Y', () => hackerNewsUrl && open(hackerNewsUrl, '_blank'));
	shortcut('?', () => (shortcutsModalOpen = true));

	$effect(() => {
		document.documentElement.dataset.fontFamily = $fontFamily;
	});
</script>

<Header />
<main>
	<RouteContent />
</main>
<footer>
	{#if hackerNewsUrl}
		<a href={hackerNewsUrl}>Open on Hacker News</a>
	{/if}
	<span>
		<kbd>?</kbd> Keyboard shortcuts
	</span>
</footer>

<ShortcutsModal bind:open={shortcutsModalOpen} />

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
		font-size: var(--text-sm);
	}

	footer :last-child {
		margin-left: auto;
	}
</style>
