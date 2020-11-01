<script>
	import { format, formatISO, formatDistanceToNowStrict as formatDistance, fromUnixTime } from 'date-fns';

	export let comment; // For properties, see https://github.com/HackerNews/API#items

	let collapsed = false;
	let element;

	const toggleCollapse = () => {
		collapsed = !collapsed

		if (collapsed) {
			// Scroll up if the top of the comment is off the screen
			const top = element.getBoundingClientRect().top;
			if (top < 4) {
				scrollTo(window.scrollX, window.scrollY + top - 4);
			}
		}
	};

	const date = fromUnixTime(comment.time);
</script>

<div class="comment" class:collapsed bind:this={element}>
	<div on:click={toggleCollapse} class="collapse-button" aria-label="{collapsed ? 'Expand' : 'Collapse'} comment" role="button">
		{collapsed ? '[+]' : '[-]'}
	</div>
	<div class="details">
		{comment.by}
		<time datetime={formatISO(date)} title={format(date, 'PP p')}>{formatDistance(date, { addSuffix: true })}</time>
	</div>
	<div class="content">
		{@html comment.text}
	</div>
	{#each comment.kids || [] as childComment (childComment.id)}
		<svelte:self comment={childComment} />
	{/each}
</div>

<style>
	.comment {
		margin-top: 1.0em;
		padding: 0.2em 0.2em 0.2em 1.5em;
		position: relative;
		word-wrap: break-word;
		overflow-wrap: break-word;
	}

	.comment > :global(.comment) { margin-top: 0.5em; }

	.comment .details {
		margin-bottom: 0.2em;
		font-size: 0.8571428571rem;
		color: var(--color-textlight);
	}

	.comment :global(p) {
		margin: 0.4em 0;
		line-height: 1.3;
	}

	.comment :global(pre) {
		white-space: pre-wrap;
	}

	.collapsed .details {
		font-style: italic;
		margin-bottom: 0;
	}

	.collapsed .content, .collapsed > :global(.comment) {
		display: none;
	}

	.collapse-button {
		width: 1.5em;
		position: absolute;
		top: 0; bottom: 0; left: 0;
		padding-top: 0.2em;
		font-size: 0.7857142857rem;
		text-align: center;
		color: var(--color-textlight);
		cursor: pointer;
		user-select: none;
	}

	.collapse-button:hover { background-color: var(--color-accentlight); }
</style>
