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
		padding: 0.875rem var(--content-padding-x) 3rem;
	}
</style>
