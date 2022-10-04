<script>
	import Header from './components/Header.svelte';
	import RouteContent from './routing/RouteContent.svelte';
</script>

<Header />
<main>
	<RouteContent />
</main>

<style>
	main {
		max-width: var(--content-max-width);
		margin: 0 auto;
		padding: 0.875rem var(--content-padding-x) 2rem;
	}

	/* The global styles go here as well */

	:global(*), :global(*::before), :global(::after) {
		box-sizing: border-box;
	}

	:global(body) {
		margin: 0;
		font-family: system-ui, -apple-system, sans-serif;
		line-height: 1.5;
		color-scheme: light dark;

		-webkit-font-smoothing: antialiased;

		/* Prevent mobile browsers from adjusting font size */
		-webkit-text-size-adjust: none;
		text-size-adjust: none;

		/* Always show the scrollbar to prevent jumping when content loads */
		overflow-y: scroll;
	}

	:global(a) {
		color: unset;
	}

	:global(:root) {
		--content-max-width: 50rem;
		--content-padding-x: 0.75rem;

		--color-bg: #fafaf9;
		--color-primary: #171717;
		--color-secondary: #525252;
		--color-tertiary: #d6d3d1;
		--color-accent: #f50;
	}

	@media screen and (prefers-color-scheme: dark) {
		:global(:root) {
			--color-bg: #1c1917;
			--color-primary: #fafafa;
			--color-secondary: #a3a3a3;
			--color-tertiary: #44403c;
		}
	}

	:global(body) {
		color: var(--color-primary);
		background-color: var(--color-bg);
	}


	:global(time[title]:hover) {
		text-decoration-line: underline;
		text-decoration-style: dotted;
	}
</style>
