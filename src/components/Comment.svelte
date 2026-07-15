<script module lang="ts">
	const DEPTH_KEY = Symbol();
</script>

<script lang="ts">
	import { type FetchedKids, symbols } from '../hacker-news/api';
	import type { DeletedHNItem, HNComment } from '../hacker-news/types';
	import { collapseLongThreads } from '../preferences';
	import CommentList from './CommentList.svelte';
	import Content from './Content.svelte';
	import ExpandCollapseIcon from './ExpandCollapseIcon.svelte';
	import Timestamp from './Timestamp.svelte';
	import UserLink from './UserLink.svelte';
	import { fromUnixTime } from 'date-fns';
	import { getContext, setContext } from 'svelte';

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
	let containerEl: HTMLElement;

	const COLLAPSE_TOP_SPACE = 4;

	function toggleCollapse() {
		collapsed = !collapsed;

		if (collapsed) {
			// Scroll up if the top of the comment is off the screen
			const { top } = containerEl.getBoundingClientRect();
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

<div bind:this={containerEl} class="comment-container" data-collapsible={collapsible}>
	{#if collapsible}
		<button class="collapse-button" onclick={toggleCollapse}>
			<ExpandCollapseIcon {collapsed} />
		</button>
	{/if}

	<article class="comment" id={comment.id.toString()}>
		<div class="details">
			<span class="author">
				<UserLink userId={comment.by} />
			</span>
			{#if isByOp}
				<abbr class="op-badge" title="Original poster">OP</abbr>
			{/if}
			<a class="permalink" href="item?id={comment.id}"><Timestamp {date} /></a>
			{#if parentLink}
				<a class="parent" href="item?id={comment.parent}">parent</a>
			{/if}
			{#if comment.dead}
				<span>(dead)</span>
			{/if}
		</div>

		<div class="body" hidden={collapsible && collapsed}>
			<Content content={comment.text} />
		</div>
	</article>

	{#if symbols.resolvedKids in comment && comment[symbols.resolvedKids].length > 0}
		<div class="child-comments" hidden={collapsible && collapsed}>
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
	.comment-container {
		--collapse-button-width: 17px;
		position: relative;
	}

	.comment-container[data-collapsible='true'] {
		padding-left: calc(var(--collapse-button-width) + 4px);
	}

	.comment-container[data-collapsible='true']::before {
		content: '';
		position: absolute;
		inset: 21px auto 0 calc(var(--collapse-button-width) / 2 - 0.5px);
		border-left: 1px dotted var(--color-tertiary);
	}

	.collapse-button {
		position: absolute;
		inset: 0 auto 0 0;
		display: flex;
		flex-direction: column;
		align-items: center;
		width: var(--collapse-button-width);
		padding: 0.125rem 0;

		color: var(--color-secondary);
		cursor: pointer;

		touch-action: manipulation;

		button& {
			appearance: none;
			background: none;
			border: none;
		}

		&:hover {
			background-color: var(--color-tertiary);
		}

		:global(svg) {
			flex: none;
		}
	}

	.comment > :global(* + *) {
		margin-top: 0.25rem;
	}

	.details {
		display: flex;
		font-size: var(--text-sm);
		line-height: 1.25;
		color: var(--color-secondary);

		> :global(*) {
			flex: none;
			white-space: nowrap;
		}

		> :global(* + *) {
			margin-left: 8px;
		}

		.author {
			font-weight: 500;

			:global(:any-link:not(:hover)) {
				text-decoration: none;
			}
		}

		.op-badge {
			font-size: var(--text-xs);
			padding: 0 0.125rem;
			border-radius: 3px;
			align-self: center;
			color: var(--color-bg);
			background-color: var(--color-secondary);

			abbr& {
				text-decoration: none;
			}
		}

		.permalink {
			text-decoration: unset;
		}
	}

	.body {
		font-size: var(--text-sm);
	}

	.child-comments {
		padding-top: 0.75rem;
	}

	.more-comments {
		font-size: var(--text-sm);
	}
</style>
