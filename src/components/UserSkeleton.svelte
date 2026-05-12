<article class="user" aria-hidden="true">
	<div class="user-name">
		<span class="skeleton-container">
			<span class="skeleton-content"></span>
		</span>
	</div>
	<div class="details">
		<span class="skeleton-container time">
			<span class="skeleton-content"></span>
		</span>
		<span class="skeleton-container karma">
			<span class="skeleton-content"></span>
		</span>
	</div>
</article>

<style>
	@keyframes pulsing {
		50% {
			opacity: 0.5;
		}
	}

	@media (prefers-reduced-motion: no-preference) {
		.user {
			animation: 1.4s ease-in-out infinite pulsing;
		}
	}

	.user-name {
		line-height: 1.125;
		margin-bottom: 0.125rem;
	}

	.details {
		display: flex;
		column-gap: 0.5rem;
		font-size: var(--text-sm);
		line-height: 1.25;
	}

	.details > :global(*) {
		flex: none;
	}

	.skeleton-container {
		background-color: var(--color-tertiary);
	}

	.skeleton-content {
		display: inline-block;
	}

	.user-name .skeleton-content {
		width: 8rem;
	}

	:is(:global(.time, .karma)) .skeleton-content {
		width: 6rem;
	}
</style>
