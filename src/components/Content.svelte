<script lang="ts">
	import { afterUpdate } from 'svelte';

	/** User-generated HTML (safe subset, hopefully) to display */
	export let content: string;

	const HN_ORIGIN = 'https://news.ycombinator.com';
	const THIS_ORIGIN = location.origin;

	/** Hacker News paths that have a Hacker Neue equivalent */
	const HN_PATH_WHITELIST = new Set(['/', '/newest', '/best', '/ask', '/show', '/jobs', '/item']);

	function rewriteHNLinks(node: HTMLElement) {
		node.querySelectorAll('a').forEach((anchorEl) => {
			if (anchorEl.origin === HN_ORIGIN && HN_PATH_WHITELIST.has(anchorEl.pathname)) {
				anchorEl.href = anchorEl.href.replace(HN_ORIGIN, THIS_ORIGIN);
				anchorEl.innerText = anchorEl.innerText.replace(HN_ORIGIN, THIS_ORIGIN);
			}
		});
	}

	let containerEl: HTMLElement;

	afterUpdate(() => rewriteHNLinks(containerEl));
</script>

<div class="content" bind:this={containerEl}>
	{@html content}
</div>

<style>
	.content {
		max-width: 80ch;
		overflow-wrap: break-word;
	}

	.content :global(p) {
		margin: 0.5em 0 0 0;
	}

	/* Fix code blocks causing horizontal scrolling */
	.content :global(pre) {
		white-space: pre-wrap;
	}
</style>
