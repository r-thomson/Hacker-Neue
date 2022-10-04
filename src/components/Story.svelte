<script>
	import { format, formatISO, formatDistanceToNowStrict as formatDistance, fromUnixTime } from 'date-fns';
	import { highlightThreshold } from '../preferences';

	export let story; // For properties, see https://github.com/HackerNews/API#items

	if (!['story', 'job', 'poll'].includes(story.type)) {
		console.warn(`Item ${story.id} is not a valid story type ('${story.type}')`);
	}

	const shortURL = story.url && new URL(story.url).hostname.replace(/.*\.(?=.*\.)/, '');
	const highlight = $highlightThreshold > 0 && story.score >= $highlightThreshold;

	const date = fromUnixTime(story.time);
</script>

<article class="story">
	<div class="details">
		<span class="score" class:highlight>
			{story.score} {story.score === 1 ? 'point' : 'points'}
		</span>
		<time datetime={formatISO(date)} title={format(date, 'PP p')}>
			{formatDistance(date, { addSuffix: true })}
		</time>
	</div>
	<div class="title">
		<a href={story.url || `/item?id=${story.id}`}>
			{@html story.title}
		</a>
	</div>
	<div class="details">
		{#if story.descendants !== undefined}
			<a class="comments" href="/item?id={story.id}">
				{story.descendants} {story.descendants === 1 ? 'comment' : 'comments'}
			</a>
		{/if}
		<span class="author">
			{story.by}
		</span>
		{#if shortURL}
			<span class="site">
				{shortURL}
			</span>
		{/if}
	</div>
</article>

<style>
	.story > * + * {
		margin-top: 0.125rem;
	}

	.title {
		font-weight: 600;
		line-height: 1.125;
	}

	.title a:link {
		text-decoration: none;
	}

	.title a:visited {
		color: var(--color-secondary);
	}

	.details {
		display: flex;
		color: var(--color-secondary);
		font-size: 0.875rem;
		line-height: 1.25;
	}

	.details > * {
		flex: none;
		white-space: nowrap;
	}

	.details > * + * {
		margin-left: 0.5rem;
	}

	.score {
		font-weight: 500;
	}

	.score.highlight {
		color: var(--color-accent);
	}

	.site {
		font-style: italic;
		flex: initial;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: normal;
	}
</style>
