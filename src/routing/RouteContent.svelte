<script>
	import { routes, currentPath } from './router';
	$: routeComponent = routes[$currentPath];
</script>

{#if routeComponent}
	<svelte:component this={ routeComponent } />
{:else}
	<h1>404 Error</h1>
{/if}
