<script module lang="ts">
	const DEPTH_KEY = Symbol();
</script>

<script lang="ts">
	import Comment from './Comment.svelte';
	import { fromUnixTime } from 'date-fns';
	import { getContext, setContext } from 'svelte';
	import { modNames, symbols, type FetchedKids } from '../hacker-news/api';
	import type { DeletedHNItem, HNComment } from '../hacker-news/types';
	import { collapseLongThreads } from '../preferences';
	import Content from './Content.svelte';
	import ExpandCollapseIcon from './ExpandCollapseIcon.svelte';
	import Timestamp from './Timestamp.svelte';

	interface Props {
		comment: Exclude<HNComment | (HNComment & FetchedKids), DeletedHNItem>;
		collapsible?: boolean;
		parentLink?: boolean;
	}

	let { comment, collapsible = false, parentLink = false }: Props = $props();

	// Track how deep into <Comment> recursion we are
	const depth = getContext<number>(DEPTH_KEY) ?? 0;
	setContext(DEPTH_KEY, depth + 1);

	let date = $derived(fromUnixTime(comment.time));
	let isByOp = $derived(
		symbols.rootItem in comment &&
			'by' in comment[symbols.rootItem] &&
			comment.by === comment[symbols.rootItem].by,
	);

	let collapsed = $state(collapsible && !!comment.dead); // Dead comments are collapsed by default
	let element: HTMLElement;

	const COLLAPSE_TOP_SPACE = 4;

	function toggleCollapse() {
		collapsed = !collapsed;

		if (collapsed) {
			// Scroll up if the top of the comment is off the screen
			const { top } = element.getBoundingClientRect();
			if (top < COLLAPSE_TOP_SPACE) {
				scrollTo(window.scrollX, window.scrollY + top - COLLAPSE_TOP_SPACE);
			}
		}
	}

	function countChildComments(comment: HNComment & FetchedKids): number {
		return comment[symbols.resolvedKids]
			.filter((comment) => !comment.deleted)
			.map((comment) => 1 + countChildComments(comment as HNComment & FetchedKids))
			.reduce((a, b) => a + b, 0);
	}
</script>

<div bind:this={element} class="comment" class:collapsible id={comment.id.toString()}>
	{#if collapsible}
		<button class="collapse-button" onclick={toggleCollapse}>
			<ExpandCollapseIcon {collapsed} />
		</button>
	{/if}

	<div class="details">
		<span class="author" class:mod-name={modNames.has(comment.by)}>
			{comment.by}
		</span>
		{#if isByOp}
			<abb class="op-badge" title="Original poster">OP</abb>
		{/if}
		<a class="permalink" href={`item?id=${comment.id}`}><Timestamp {date} /></a>
		{#if parentLink}
			<a class="parent" href={`item?id=${comment.parent}`}>parent</a>
		{/if}
		{#if comment.dead}
			<span>(dead)</span>
		{/if}
	</div>

	<div class="body" hidden={collapsible && collapsed}>
		<Content content={comment.text} />
	</div>

	{#if symbols.resolvedKids in comment && comment[symbols.resolvedKids].length > 0}
		<div class="child-comments" hidden={collapsed}>
			{#if $collapseLongThreads && depth === 4 && countChildComments(comment) > 1}
				<a class="more-comments" href="item?id={comment.id}">
					{countChildComments(comment)} More Comments &rarr;
				</a>
			{:else}
				{#each comment[symbols.resolvedKids] as childComment (childComment.id)}
					{#if childComment.type === 'comment' && !childComment.deleted}
						<Comment comment={childComment} collapsible />
					{/if}
				{/each}
			{/if}
		</div>
	{/if}
</div>

<style>
	.comment {
		--collapse-button-width: 17px;

		position: relative;
	}

	.comment.collapsible {
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

		touch-action: manipulation;
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

	.details .author.mod-name {
		color: var(--color-accent);
	}

	.details .op-badge {
		font-size: 0.75rem;
		padding: 0 0.125rem;
		border: 1px solid var(--color-tertiary);
		border-radius: 3px;
	}

	.details .permalink {
		text-decoration: unset;
	}

	.body {
		font-size: 0.875rem;
	}

	.more-comments {
		font-size: 0.875rem;
	}
</style>
