<script lang="ts">
	import { fromUnixTime } from 'date-fns';
	import type { DeletedHNItem, HNJob, HNPoll, HNStory } from '../hacker-news/types';
	import { highlightThreshold } from '../preferences';
	import Timestamp from './Timestamp.svelte';

	export let story: Exclude<HNStory | HNJob | HNPoll, DeletedHNItem>;

	const formatShortUrl = (url: string) => new URL(url).hostname.replace(/.*\.(?=.*\.)/, '');

	$: date = fromUnixTime(story.time);
	$: shortUrl = 'url' in story && story.url ? formatShortUrl(story.url) : null;
	$: highlight = $highlightThreshold > 0 && story.score >= $highlightThreshold;
</script>

<article class="story">
	<div class="details">
		<span class="score" class:highlight>
			{story.score}
			{story.score === 1 ? 'point' : 'points'}
		</span>
		<Timestamp {date} />
	</div>
	<div class="title">
		<a href={('url' in story && story.url) || `/item?id=${story.id}`}>
			{story.title}
		</a>
	</div>
	<div class="details">
		{#if 'descendants' in story && story.descendants !== undefined}
			<a class="comments" href="/item?id={story.id}">
				{story.descendants}
				{story.descendants === 1 ? 'comment' : 'comments'}
			</a>
		{/if}
		<span class="author">
			{story.by}
		</span>
		{#if shortUrl}
			<span class="site">
				{shortUrl}
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

	.details > :global(*) {
		flex: none;
		white-space: nowrap;
	}

	.details > :global(* + *) {
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
