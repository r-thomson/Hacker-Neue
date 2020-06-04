<script>
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'

export let comment; // For properties, see https://github.com/HackerNews/API#items

dayjs.extend(relativeTime);
const date = dayjs.unix(comment.time);
</script>

<div class="comment">
	<div class="details">
		{comment.by}
		<time datetime={date.toISOString()} title={date.format('MMM D, YYYY h:mm A')}>{date.fromNow()}</time>
	</div>
	<div class="content text-content">
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

.comment > .comment { margin-top: 0.5em; }

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
</style>
