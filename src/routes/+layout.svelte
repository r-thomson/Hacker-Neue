<script lang="ts">
	import Header from '$lib/components/Header.svelte';
	import ShortcutsModal from '$lib/components/ShortcutsModal.svelte';
	import { shortcut } from '$lib/utils.svelte';
	import '$lib/assets/global.css';
	import { goto } from '$app/navigation';
	import { page } from '$app/state';

	let showOpenInHN = $derived(!['/search'].includes(page.url.pathname));
	let relativeUrl = $derived(page.url.href.slice(page.url.origin.length));

	let shortcutsModalOpen = $state(false);

	shortcut('T', () => goto('/'));
	shortcut('N', () => goto('/newest'));
	shortcut('B', () => goto('/best'));
	shortcut('A', () => goto('/ask'));
	shortcut('S', () => goto('/show'));
	shortcut('?', () => (shortcutsModalOpen = !shortcutsModalOpen));

	let { children } = $props();
</script>

<Header />
<main>
	{@render children()}
</main>
<footer>
	{#if showOpenInHN}
		<a href="https://news.ycombinator.com{relativeUrl}">Open on Hacker News</a>
	{/if}
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
		font-size: 0.875rem;
	}
</style>
