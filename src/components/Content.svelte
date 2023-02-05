<script>
	export let content;
</script>

<div class="content">
	{@html content}
</div>

<style>
	.content {
		max-width: 80ch;
	}

	.content :global(p) {
		margin: 0.5em 0 0 0;
	}

	/* Fix code blocks causing horizontal scrolling */
	.content :global(pre) {
		white-space: pre-wrap;
	}
</style>
