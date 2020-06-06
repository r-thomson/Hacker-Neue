<script>
	import dayjs from 'dayjs';
	import relativeTime from 'dayjs/plugin/relativeTime'

	export let story; // For properties, see https://github.com/HackerNews/API#items

	if (!['story', 'job', 'poll'].includes(story.type)) {
		console.warn(`Item ${story.id} is not a valid story type ('${story.type}')`);
	}

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
		<span class="site">{shortURL}</span>
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

<style>
	.story {
		margin: 1.0em 0;
		padding: 0 0.8em 0 2.5em;
		position: relative;
		line-height: 1.1;
	}

	.title {
		font-size: 1.1428571429rem;
		font-weight: 600;
		text-decoration: none;
	}

	.title:visited {
		color: var(--color-textlight);
	}

	.site {
		padding-left: 0.5em;
		font-size: 0.7857142857rem;
		color: var(--color-textlighter);
	}

	.score {
		display: block;
		width: 2.0em;
		position: absolute;
		top: 0.1em; left: 0;
		color: var(--color-textlight);
		text-align: center;
		letter-spacing: -0.02em;
	}

	.details {
		margin-top: 0.2em;
		font-size: 0.8571428571rem;
		color: var(--color-textlight);
	}

	.details > *:not(:last-child)::after {
		content: "\2022";
		padding: 0 0.3em;
		color: var(--color-textlight);
	}
</style>
