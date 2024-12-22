<article class="story" aria-hidden="true">
	<div class="details">
		<span class="skeleton-container score">
			<span class="skeleton-content"></span>
		</span>
		<span class="skeleton-container time">
			<span class="skeleton-content"></span>
		</span>
	</div>
	<div class="title">
		<span class="skeleton-container">
			<span class="skeleton-content"></span>
		</span>
	</div>
	<div class="details">
		<span class="skeleton-container comments">
			<span class="skeleton-content"></span>
		</span>
		<span class="skeleton-container author">
			<span class="skeleton-content"></span>
		</span>
		<span class="skeleton-container site">
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
		.story {
			animation: 1.4s ease-in-out infinite pulsing;
		}
	}

	.story > * + * {
		margin-top: 0.125rem;
	}

	.title {
		line-height: 1.125;
	}

	.details {
		display: flex;
		font-size: 0.875rem;
		line-height: 1.25;
	}

	.details > * {
		flex: none;
	}

	.details > * + * {
		margin-left: 0.5rem;
	}

	.skeleton-container {
		background-color: var(--color-tertiary);
	}

	.skeleton-content {
		display: inline-block;
	}

	:is(:global(.score, .time)) .skeleton-content {
		width: 5rem;
	}

	.title .skeleton-content {
		width: 30rem;
		max-width: calc(100vw - 2.5rem);
	}

	:is(:global(.comments, .author, .site)) .skeleton-content {
		width: 5.5rem;
	}
</style>
