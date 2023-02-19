<script lang="ts">
	import { fromUnixTime } from 'date-fns';
	import { modNames, symbols, type FetchedKids } from '../hacker-news/api';
	import type { DeletedHNItem, HNComment } from '../hacker-news/types';
	import Content from './Content.svelte';
	import ExpandCollapseIcon from './ExpandCollapseIcon.svelte';
	import Timestamp from './Timestamp.svelte';

	export let comment: Exclude<HNComment | (HNComment & FetchedKids), DeletedHNItem>;

	$: date = fromUnixTime(comment.time);
	$: isByOp =
		symbols.rootItem in comment &&
		'by' in comment[symbols.rootItem] &&
		comment.by === comment[symbols.rootItem].by;

	let collapsed = !!comment.dead; // Dead comments are collapsed by default
	let element: HTMLElement;

	const COLLAPSE_TOP_SPACE = 4;

	const toggleCollapse = () => {
		collapsed = !collapsed;

		if (collapsed) {
			// Scroll up if the top of the comment is off the screen
			const { top } = element.getBoundingClientRect();
			if (top < COLLAPSE_TOP_SPACE) {
				scrollTo(window.scrollX, window.scrollY + top - COLLAPSE_TOP_SPACE);
			}
		}
	};
</script>

<div bind:this={element} class="comment" class:collapsed id={comment.id.toString()}>
	<button class="collapse-button" on:click={toggleCollapse}>
		<ExpandCollapseIcon {collapsed} />
	</button>
	<div class="details">
		<span class="author" class:mod-name={modNames.has(comment.by)}>
			{comment.by}
		</span>
		{#if isByOp}
			<abb class="badge" title="Original poster">OP</abb>
		{/if}
		<Timestamp {date} />
		{#if comment.dead}
			<span>(dead)</span>
		{/if}
	</div>
	<div class="body" hidden={collapsed}>
		<Content content={comment.text} />
	</div>
	{#if symbols.resolvedKids in comment && comment[symbols.resolvedKids].length > 1}
		<div class="child-comments" hidden={collapsed}>
			{#each comment[symbols.resolvedKids] as childComment (childComment.id)}
				<svelte:self comment={childComment} />
			{/each}
		</div>
	{/if}
</div>

<style>
	.comment {
		--collapse-button-width: 17px;

		position: relative;
		padding-left: calc(var(--collapse-button-width) + 4px);
	}

	.comment > :not(.collapse-button) + * {
		margin-top: 0.25rem;
	}

	:global(.comment) + .comment {
		margin-top: 1rem;
	}

	.child-comments {
		padding-top: 0.5rem;
	}

	.collapse-button {
		width: var(--collapse-button-width);
		display: flex;
		flex-direction: column;
		align-items: center;

		position: absolute;
		top: 0;
		bottom: 0;
		left: 0;

		color: var(--color-secondary);
	}

	.collapse-button :global(svg) {
		flex: none;
	}

	button.collapse-button {
		/* Button style reset */
		background: transparent;
		border: none;
		margin: 0;

		padding: 0.125rem 0;
		cursor: pointer;
	}

	button.collapse-button:hover {
		background-color: var(--color-tertiary);
	}

	.comment > :global(.comment) {
		margin-left: 16px;
	}

	.details {
		display: flex;
		font-size: 0.875rem;
		line-height: 1.25;
		color: var(--color-secondary);
	}

	.details > :global(*) {
		flex: none;
		white-space: nowrap;
	}

	.details > :global(* + *) {
		margin-left: 8px;
	}

	.details .author {
		font-weight: 500;
	}

	.details .badge {
		font-size: 0.75rem;
		padding: 0 0.125rem;
		border: 1px solid var(--color-tertiary);
		border-radius: 3px;
	}

	.details .author.mod-name {
		color: var(--color-accent);
	}

	.body {
		font-size: 0.875rem;
	}
</style>
