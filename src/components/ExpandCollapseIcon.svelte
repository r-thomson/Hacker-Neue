<script lang="ts">
	interface Props {
		collapsed: boolean;
	}

	let { collapsed }: Props = $props();
</script>

<svg
	width="13"
	height="13"
	viewBox="0 0 13 13"
	xmlns="http://www.w3.org/2000/svg"
	fill="currentColor"
	fill-rule="evenodd"
>
	{#if collapsed}
		<path
			d="m0 12v-11h3v1h-2v9h2v1zm10 0v-1h2v-9h-2v-1h3v11zm-4-2v-3h-3v-1h3v-3h1v3h3v1h-3v3z"
		/>
	{:else}
		<path d="m1 12v-11h3v1h-2v9h2v1zm8 0v-1h2v-9h-2v-1h3v11zm-5-5v-1h5v1z" />
	{/if}
</svg>
