<script lang="ts">
	interface Props {
		value: number;
		min?: number;
		max?: number;
	}

	let { value, min = 0, max = 1 }: Props = $props();
</script>

<meter {value} {min} {max}></meter>

<style>
	meter {
		width: var(--width, 120px);
		height: 3px;
		border-radius: 1px;
		overflow: hidden;
		appearance: none;
	}

	/* Track styling */

	meter {
		background: var(--color-tertiary);
	}

	meter::-webkit-meter-bar {
		background: var(--color-tertiary);
	}

	/* Fill styling */

	meter::-moz-meter-bar {
		background: var(--color-secondary);
	}

	meter::-webkit-meter-optimum-value,
	meter::-webkit-meter-suboptimum-value,
	meter::-webkit-meter-even-less-good-value {
		background: var(--color-secondary);
	}
</style>
