<script>
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime'

export let story; // For properties, see https://github.com/HackerNews/API#items

let shortURL = null;
if (story.url) {
	shortURL = new URL(story.url).hostname.replace(/.*\.(?=.*\.)/, '');
}

dayjs.extend(relativeTime);
const date = dayjs.unix(story.time);
</script>

<article class="story">
	<a href={story.url || '/item?id=' + story.id} class="title">{story.title}</a>
	{#if shortURL}
		<span>{shortURL}</span>
	{/if}
	<span class="score" aria-label={story.score === 1 ? 'point' : 'points'}>{story.score}</span>
	<div class="details">
		{#if story.descendants !== undefined}
			<span>
				<a href="/item?id={story.id}">
					{story.descendants} {story.descendants === 1 ? 'comment' : 'comments'}
				</a>
			</span>
		{/if}
		<span>
			by {story.by}
			<time datetime={date.toISOString()} title={date.format('MMM D, YYYY h:mm A')}>{date.fromNow()}</time>
		</span>
	</div>
</article>
