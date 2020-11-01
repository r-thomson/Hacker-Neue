<script>
	import { routes, currentPath } from './router';
	$: routeComponent = routes[$currentPath];
</script>

{#if routeComponent}
	<svelte:component this={ routeComponent } />
{:else}
	<div class="message">404 Error (not found)</div>
{/if}

<style>
	.message {
		margin-top: 15%;
		color: var(--color-textlighter);
		text-align: center;
		text-transform: uppercase;
	}
</style>
