<script lang="ts">
	let props = $props();
</script>

<svg
	xmlns="http://www.w3.org/2000/svg"
	width="20"
	height="20"
	viewBox="0 0 20 20"
	display="block"
	{...props}
>
	<path d="m19 1h-18v18h18z" fill="none" stroke="currentColor" stroke-width="2" />
	<path
		d="m4 17v-14h2l3.75 5h-2.5l-1.25-1.65v2.65h8v-6h2v14h-2l-3.65-5h2.4l1.25 1.5v-2.5h-8v6z"
		fill="currentColor"
	/>
</svg>
