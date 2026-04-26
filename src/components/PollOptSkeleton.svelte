<script>
	import Meter from './Meter.svelte';
</script>

<div class="option" aria-hidden="true">
	<div class="details">
		<span class="skeleton-container label">
			<span class="skeleton-content"></span>
		</span>
		<span class="skeleton-container score">
			<span class="skeleton-content"></span>
		</span>
	</div>
	<Meter value="0" --width="100%" />
</div>

<style>
	@keyframes pulsing {
		50% {
			opacity: 0.5;
		}
	}

	@media (prefers-reduced-motion: no-preference) {
		.option {
			animation: 1.4s ease-in-out infinite pulsing;
			animation-delay: inherit;
		}
	}

	.option {
		max-width: 24rem;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.details {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: 0.5rem;

		font-size: 0.876rem;
		line-height: 1.25;
	}

	.skeleton-container {
		background-color: var(--color-tertiary);
	}

	.skeleton-content {
		display: inline-block;
	}

	.label .skeleton-content {
		width: 9rem;
	}

	.score .skeleton-content {
		width: 4rem;
	}
</style>
