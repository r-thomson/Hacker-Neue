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
	padding-left: 0.5em;
}
</style>
