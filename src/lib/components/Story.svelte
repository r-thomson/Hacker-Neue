<script lang="ts">
	import { fromUnixTime } from 'date-fns';
	import type { DeletedHNItem, HNJob, HNPoll, HNStory } from '../hacker-news/types';
	import { highlightThreshold } from '../preferences';
	import Content from './Content.svelte';
	import Timestamp from './Timestamp.svelte';

	interface Props {
		story: Exclude<HNStory | HNJob | HNPoll, DeletedHNItem>;
		expanded?: Boolean;
	}

	let { story, expanded = false }: Props = $props();

	const formatShortUrl = (url: string) => new URL(url).hostname.replace(/.*\.(?=.*\.)/, '');

	let date = $derived(fromUnixTime(story.time));
	let shortUrl = $derived('url' in story && story.url ? formatShortUrl(story.url) : null);
	let highlight = $derived($highlightThreshold > 0 && story.score >= $highlightThreshold);
</script>

<article class="story" id={story.id.toString()}>
	<div class="details">
		{#if story.type !== 'job'}
			<span class="score" class:highlight>
				{story.score}
				{story.score === 1 ? 'point' : 'points'}
			</span>
		{/if}
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
		<a href="user?id={story.by}" class="author">
			{story.by}
		</a>
		{#if shortUrl}
			<span class="site">
				{shortUrl}
			</span>
		{/if}
	</div>

	{#if expanded && story.text}
		<div class="story-text">
			<Content content={story.text} />
		</div>
	{/if}
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
		column-gap: 0.5rem;
		color: var(--color-secondary);
		font-size: 0.875rem;
		line-height: 1.25;
	}

	.details > :global(*) {
		flex: none;
		white-space: nowrap;
	}

	.score {
		font-weight: 500;
	}

	.score.highlight {
		color: var(--color-accent);
	}

	.author:not(:hover) {
		text-decoration: none;
	}

	.site {
		font-style: italic;
		flex: initial;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	.story-text {
		margin-top: 0.75rem;
		font-size: 0.875rem;
	}
</style>
