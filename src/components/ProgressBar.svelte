<script>
	export let progress;
</script>

<div class="container">
	<progress value={progress}>
		Loading&hellip;
	</progress>
</div>

<style>
	.container {
		display: flex;
		justify-content: center;
	}

	progress {
		width: 180px;
		height: 3px;
		border-radius: 1px;
		overflow: hidden;
		background-color: var(--color-tertiary);

		-webkit-appearance: none;
		-moz-appearance: none;
		appearance: none;

		border: none; /* Firefox defaults */
	}

	/* Because one invalid selector invalidates the entire list, blocks need to be
		duplicated for each vendor-specific pseudo-element. */

	progress::-webkit-progress-bar {
		background: none; /* Use progress background */
	}

	progress::-webkit-progress-value {
		background-color: var(--color-secondary);
	}

	progress::-moz-progress-bar {
		background-color: var(--color-secondary);
	}
</style>
