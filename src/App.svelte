<script>
import Header from './components/Header.svelte';
import RouteContent from './routing/RouteContent.svelte';
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

:global(body) {
	--color-accent: hsl(22, 97%, 53%);
	--color-background: hsl(0, 0%, 92%);
	--color-page: hsl(0, 0%, 99%);
	--color-text: hsl(0, 0%, 14%);
	--color-textlight: hsl(0, 0%, 45%);
	--color-textlighter: hsl(0, 0%, 45%);
	--color-accentlight: hsl(0, 0%, 84%);
	
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
	max-width: 60em;
	position: relative;
	background-color: var(--color-page);
	box-shadow: 0 0 20px 0 RGBA(0, 0, 0, 0.1);
}

main {
	margin: 1.0em 0;
	padding: 0 1.0em 0;
}
</style>
