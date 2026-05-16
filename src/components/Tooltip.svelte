<script lang="ts">
	import { clamp, getRectCenter } from '../utils';
	import { type Snippet, tick } from 'svelte';

	interface Props {
		estimatedHeight?: number;
		popover: Snippet;
		children: Snippet;
	}

	let { children, popover, estimatedHeight = 1 }: Props = $props();
	const uid = $props.id();

	let targetEl: HTMLElement;
	// svelte-ignore non_reactive_update
	let popoverEl: HTMLElement;

	// To enable lazy loading, the popover isn't rendered until it's needed
	let renderPopoverEl = $state(false);

	let timeoutId: number;

	function showPopover(delay: number) {
		clearTimeout(timeoutId);
		timeoutId = setTimeout(async () => {
			renderPopoverEl = true;
			await tick();

			popoverEl?.togglePopover(true) && positionPopover();
		}, delay);
	}

	function hidePopover() {
		clearTimeout(timeoutId);
		popoverEl?.togglePopover(false);
	}

	// The popover is absolutely positioned within the initial containing block,
	// which is viewport-sized but does not scroll.
	let topPx = $state(0);
	let bottomPx = $state(0);
	let leftPx = $state(0);
	let arrowLeftPx = $state(0);

	function positionPopover() {
		if (!targetEl || !popoverEl?.matches(':popover-open')) return;

		topPx = bottomPx = leftPx = 0;

		const rootHeight = document.documentElement.clientHeight; // Initial containing block
		const viewport = window.visualViewport!;
		const bbox = targetEl.getBoundingClientRect();
		const viewportMargin = 8;

		const popoverWidth = popoverEl.offsetWidth;
		const popoverHeight = Math.max(popoverEl.offsetHeight, estimatedHeight);

		// Vertical positioning
		const fitsAbove = popoverHeight < bbox.top - viewportMargin;
		const fitsBelow = popoverHeight < viewport.height - bbox.bottom - viewportMargin;
		if (fitsBelow || !fitsAbove) {
			topPx = viewport.pageTop + bbox.bottom;
		} else {
			bottomPx = rootHeight - (viewport.pageTop + bbox.top);
		}

		// Horizontal positioning
		leftPx = clamp(
			viewport.pageLeft + viewportMargin, // Viewport-left
			viewport.pageLeft + bbox.left,
			viewport.pageLeft + viewport.width - popoverWidth - viewportMargin, // Viewport-right
		);

		// The arrow is positioned relative to the popover element
		arrowLeftPx = viewport.pageLeft + getRectCenter(bbox).x - leftPx;
	}
</script>

<svelte:window onresize={() => positionPopover()} />

<!-- svelte-ignore a11y_no_static_element_interactions -->
<span
	bind:this={targetEl}
	aria-describedby="{uid}-tooltip"
	onpointerenter={(e) => e.pointerType === 'mouse' && showPopover(350)}
	onpointerleave={(e) => e.pointerType === 'mouse' && hidePopover()}
	onfocusin={() => showPopover(150)}
	onfocusout={() => hidePopover()}
>
	{@render children()}
</span>

{#if renderPopoverEl}
	<div
		bind:this={popoverEl}
		id="{uid}-tooltip"
		popover
		role="tooltip"
		data-arrow-edge={topPx ? 'top' : 'bottom'}
		style:top={topPx ? `${topPx}px` : undefined}
		style:bottom={bottomPx ? `${bottomPx}px` : undefined}
		style:left="{leftPx}px"
		style:--arrow-left="{arrowLeftPx}px"
	>
		{@render popover()}
	</div>
{/if}

<style>
	[popover] {
		/* Base popover style reset */
		inset: unset;
		position: absolute;
		overflow: visible;

		/* Reset commonly inherited properties */
		color: var(--color-primary);
		font-size: initial;
		font-weight: initial;
		line-height: 1.5;
		white-space: initial;

		width: var(--tooltip-width, 20rem);
		padding: 8px;
		margin: 8px 0 6px;

		background-color: var(--color-bg);
		border: 1px solid var(--color-tertiary);
		border-radius: 4px;
		box-shadow:
			0 1px 4px -1px hsl(20 14% 4% / 0.1),
			0 4px 7px -2px hsl(20 14% 4% / 0.1);

		pointer-events: none;

		&::before {
			content: '';

			position: absolute;
			left: clamp(9px, var(--arrow-left, 0), calc(var(--tooltip-width, 20rem) - 9px));
			width: 7px;
			height: 7px;

			border-left: 1px solid var(--color-tertiary);
			border-top: 1px solid var(--color-tertiary);
			background: var(--color-bg);
		}

		&[data-arrow-edge='top']::before {
			transform: translate(-4px, -4px) rotate(45deg);
			top: 0;
		}

		&[data-arrow-edge='bottom']::before {
			transform: translate(-4px, 4px) rotate(225deg);
			bottom: 0;
		}
	}

	:popover-open {
		@starting-style {
			opacity: 0;
			transform: translateY(12px);
		}

		/* Close animations will require transition: overlay */
		transition:
			opacity 0.2s ease,
			transform 0.2s ease,
			display 0.2s allow-discrete;
	}
</style>
