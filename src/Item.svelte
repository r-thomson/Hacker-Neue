<script lang="ts">
	import Comment from './components/Comment.svelte';
	import ProgressBar from './components/ProgressBar.svelte';
	import Story from './components/Story.svelte';
	import StorySkeleton from './components/StorySkeleton.svelte';
	import { fetchItem, fetchKids } from './hacker-news/api';
	import { currentUrl } from './routing/router';
	import ErrorMessage from './components/ErrorMessage.svelte';

	const itemId = Number.parseInt($currentUrl.searchParams.get('id') ?? '');
	const item = fetchItem(itemId).then((item) => {
		if (!item) throw Error('Item does not exist');

		if ('title' in item && item.title) {
			document.title = `${item.title} - Hacker Neue`;
		}

		return item;
	});

	let commentsFetched = 0;
	const comments = item.then((item) => fetchKids(item, () => commentsFetched++));
</script>

{#await item}
	<StorySkeleton />

	<hr class="comments-divider" />
{:then item}
	{#if !item.deleted}
		{#if item.type === 'story' || item.type === 'job' || item.type === 'poll'}
			<Story story={item} expanded />
		{/if}
		<!-- TODO: support comment permalinks -->
	{/if}

	<hr class="comments-divider" />

	{#await comments}
		<div class="progress-container">
			<ProgressBar
				progress={commentsFetched / (('descendants' in item && item.descendants) || 1)}
			/>
		</div>
	{:then comments}
		<div class="story-comments">
			{#each comments as comment (comment.id)}
				{#if comment.type === 'comment' && !comment.deleted}
					<Comment {comment} collapsible />
				{/if}
			{/each}
		</div>
		<p class="empty-message">This story has no comments currently.</p>
	{:catch error}
		<ErrorMessage {error} />
	{/await}
{:catch error}
	<ErrorMessage {error} />
{/await}

<style>
	.story-comments > :global(.comment + .comment) {
		margin-top: 0.5rem;
	}

	.comments-divider {
		margin: 1.25rem 0;
		border: none;
		border-top: 1px solid var(--color-tertiary);
	}

	.progress-container {
		margin: 8rem 0 4rem;
	}

	.empty-message {
		margin: 6rem 0 4rem;
		text-align: center;
		font-size: 0.875rem;
		color: var(--color-secondary);
	}

	:not(:empty) + .empty-message {
		display: none;
	}
</style>
