<script lang="ts">
	import { cubicOut } from 'svelte/easing';
	import { type TransitionConfig } from 'svelte/transition';

	interface Props {
		value: number;
		min?: number;
		max?: number;
	}

	let { value, min = 0, max = 1 }: Props = $props();

	function animate(node: HTMLMeterElement): TransitionConfig {
		return {
			duration: 1000 * (value / max) || 1,
			easing: cubicOut,
			tick: (t) => {
				node.value = t * value;
				node.ariaBusy = t < 1 ? 'true' : 'false';
			},
		};
	}
</script>

<meter {value} {min} {max} in:animate></meter>

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
