<script>
	import { format, formatISO, formatDistanceToNowStrict as formatDistance, fromUnixTime } from 'date-fns';
	import { highlightThreshold } from '../preferences';

	export let story; // For properties, see https://github.com/HackerNews/API#items

	if (!['story', 'job', 'poll'].includes(story.type)) {
		console.warn(`Item ${story.id} is not a valid story type ('${story.type}')`);
	}

	const shortURL = story.url && new URL(story.url).hostname.replace(/.*\.(?=.*\.)/, '');
	const highlight = $highlightThreshold > 0 && story.score > $highlightThreshold;

	const date = fromUnixTime(story.time);
</script>

<article class="story">
	<a href={story.url || '/item?id=' + story.id} class="title">{story.title}</a>
	{#if shortURL}
		<span class="site">{shortURL}</span>
	{/if}
	<span class="score" class:highlight aria-label={story.score === 1 ? 'point' : 'points'}>
		{story.score}
	</span>
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
			<time datetime={formatISO(date)} title={format(date, 'PP p')}>{formatDistance(date, { addSuffix: true })}</time>
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

	.score.highlight {
		color: var(--color-accent);
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

	:global(.counters) .story::after {
		content: counter(story-count);
		display: inline;
		color: var(--color-textlighter);
		font-size: 0.7857142857em;
		position: absolute;
		top: 0.4em; right: 0;
	}
</style>
