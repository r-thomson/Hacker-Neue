<script module lang="ts">
	const DEPTH_KEY = Symbol();
</script>

<script lang="ts">
	import { fromUnixTime } from 'date-fns';
	import { getContext, setContext } from 'svelte';
	import { symbols, type FetchedKids } from '../hacker-news/api';
	import type { DeletedHNItem, HNComment } from '../hacker-news/types';
	import { collapseLongThreads } from '../preferences';
	import CommentList from './CommentList.svelte';
	import Content from './Content.svelte';
	import ExpandCollapseIcon from './ExpandCollapseIcon.svelte';
	import Timestamp from './Timestamp.svelte';
	import UserLink from './UserLink.svelte';

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

	// svelte-ignore state_referenced_locally
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
		<span class="author">
			<UserLink userId={comment.by} />
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
				<CommentList comments={comment[symbols.resolvedKids]} />
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

	.comment.collapsible::before {
		content: '';
		position: absolute;
		inset: 21px auto 0 calc(var(--collapse-button-width) / 2 - 0.5px);
		border-left: 1px dotted var(--color-tertiary);
	}

	.comment > :not(.collapse-button) + * {
		margin-top: 0.25rem;
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
		inset: 0 auto 0 0;

		color: var(--color-secondary);

		touch-action: manipulation;
	}

	.collapse-button :global(svg) {
		flex: none;
	}

	button.collapse-button {
		/* Button style reset */
		appearance: none;
		background: none;
		border: none;

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
		font-size: var(--text-sm);
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

	.details .author :global(:any-link:not(:hover)) {
		text-decoration: none;
	}

	.details .op-badge {
		font-size: var(--text-xs);
		padding: 0 0.125rem;
		border: 1px solid var(--color-tertiary);
		border-radius: 3px;
	}

	.details .permalink {
		text-decoration: unset;
	}

	.body {
		font-size: var(--text-sm);
	}

	.more-comments {
		font-size: var(--text-sm);
	}
</style>
