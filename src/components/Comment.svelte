<script>
	import Content from './Content.svelte';
	import ExpandCollapseIcon from './ExpandCollapseIcon.svelte';

	import {
		format,
		formatISO,
		formatDistanceToNowStrict as formatDistance,
		fromUnixTime,
	} from 'date-fns';
	import { mods, symbols } from '../hn-api';

	export let comment; // For properties, see https://github.com/HackerNews/API#items

	let collapsed = !!comment.dead; // Dead comments are collapsed by default
	let element;

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

	const date = fromUnixTime(comment.time);
</script>

<div bind:this={element} class="comment" class:collapsed>
	<button class="collapse-button" on:click={toggleCollapse}>
		<ExpandCollapseIcon {collapsed} />
	</button>
	<div class="details">
		<span class="author" class:mod-name={mods.has(comment.by)}>
			{comment.by}
		</span>
		{#if comment.by === comment[symbols.rootItem].by}
			<span class="badge">OP</span>
		{/if}
		<time datetime={formatISO(date)} title={format(date, 'PP p')}>
			{formatDistance(date, { addSuffix: true })}
		</time>
		{#if comment.dead}
			<span>(dead)</span>
		{/if}
	</div>
	<div class="body" hidden={collapsed}>
		<Content content={comment.text} />
	</div>
	{#if comment[symbols.resolvedKids]?.length > 1}
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

	.details > * {
		flex: none;
		white-space: nowrap;
	}

	.details > * + * {
		margin-left: 8px;
	}

	.details .author {
		font-weight: 500;
	}

	.details .author.mod-name {
		color: var(--color-accent);
	}

	.body {
		font-size: 0.875rem;
	}
</style>
