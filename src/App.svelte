<script>
	import Header from './components/Header.svelte';
	import RouteContent from './routing/RouteContent.svelte';
	import { theme as prefTheme, pageWidth } from './preferences';

	const darkMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
	$: curTheme = $prefTheme === 'auto' ? (darkMediaQuery.matches ? 'dark' : 'light') : $prefTheme;
	darkMediaQuery.addListener(() => {
		darkMediaQuery.matches = darkMediaQuery.matches; // Trigger a reactive re-evaluation
	});

	$: document.body.dataset.theme = curTheme;
	$: document.body.dataset.pageWidth = $pageWidth;
</script>

<div class="page">
	<Header />
	<main>
		<RouteContent />
	</main>
</div>

<style>
	/* The global styles go here as well */

	:global(:root) {
		font-size: 0.875em;
	}

	:global(*) {
		box-sizing: border-box;
	}

	:global(body[data-theme="light"]) {
		--color-accent: hsl(22, 97%, 53%);
		--color-background: hsl(0, 0%, 92%);
		--color-page: hsl(0, 0%, 99%);
		--color-text: hsl(0, 0%, 14%);
		--color-textlight: hsl(0, 0%, 45%);
		--color-textlighter: hsl(0, 0%, 45%);
		--color-accentlight: hsl(0, 0%, 84%);
	}

	:global(body[data-theme="dark"]) {
		--color-accent: hsl(22, 93%, 47%);
		--color-background: hsl(226, 6%, 10%);
		--color-page: hsl(226, 6%, 16%);
		--color-text: hsl(0, 0%, 87%);
		--color-textlight: hsl(0, 0%, 64%);
		--color-textlighter: hsl(0, 0%, 55%);
		--color-accentlight: hsl(0, 0%, 32%);
	}

	:global(body[data-page-width="1"]) {
		--page-width: 50rem;
	}
	
	:global(body[data-page-width="2"]) {
		--page-width: 60rem;
	}
	
	:global(body[data-page-width="3"]) {
		--page-width: 75rem;
	}
	
	:global(body[data-page-width="full"]) {
		--page-width: 100%;
	}

	:global(body) {
		margin: 0;
		background-color: var(--color-background);
		font-family: "Open Sans", sans-serif;
		color: var(--color-text);
		text-size-adjust: 100%;
	}

	:global(a) {
		color: inherit;
	}

	.page {
		margin: 1.5em auto;
		padding-bottom: 1.0em;
		min-height: 90vh;
		max-width: var(--page-width);
		position: relative;
		background-color: var(--color-page);
		box-shadow: 0 0 20px 0 RGBA(0, 0, 0, 0.1);
	}

	main {
		margin: 1.0em 0;
		padding: 0 1.0em 0;
	}
</style>
