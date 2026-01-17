<script lang="ts">
	import Comment from '$lib/components/Comment.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import Story from '$lib/components/Story.svelte';
	import StorySkeleton from '$lib/components/StorySkeleton.svelte';
	import { fetchItem, fetchKids } from '$lib/hacker-news/api';
	import ErrorMessage from '$lib/components/ErrorMessage.svelte';
	import { noop } from '$lib/utils';
	import { page } from '$app/state';

	let itemId = $derived(Number.parseInt(page.url.searchParams.get('id') ?? ''));
	let item = $derived(
		fetchItem(itemId).then((item) => {
			if (!item) throw Error('Item does not exist');
			return item;
		}),
	);

	$effect(() => {
		item.then((item) => {
			if ('title' in item && item.title) {
				document.title = `${item.title} - Hacker Neue`;
			} else if (item.type === 'comment' && !item.deleted) {
				document.title = `Comment by ${item.by} - Hacker Neue`;
			}
		}).catch(noop);
	});

	let commentsFetched = $state(0);
	let comments = $derived(item.then((item) => fetchKids(item, () => commentsFetched++)));

	$effect(() => {
		item;
		commentsFetched = 0;
	});
</script>

{#await item}
	<StorySkeleton />

	<hr class="comments-divider" />
{:then item}
	{#if !item.deleted}
		{#if item.type === 'story' || item.type === 'job' || item.type === 'poll'}
			<Story story={item} expanded />
		{:else if item.type === 'comment'}
			<Comment comment={item} parentLink />
		{/if}
	{/if}

	<hr class="comments-divider" />

	{#await comments}
		<div class="progress-container">
			<ProgressBar
				progress={commentsFetched / (('descendants' in item && item.descendants) || 1)}
			/>
		</div>
	{:then comments}
		<div class="item-comments">
			{#each comments as comment (comment.id)}
				{#if comment.type === 'comment' && !comment.deleted}
					<Comment {comment} collapsible />
				{/if}
			{/each}
		</div>
		<p class="empty-message">This item has no comments currently.</p>
	{:catch error}
		<ErrorMessage {error} />
	{/await}
{:catch error}
	<ErrorMessage {error} />
{/await}

<style>
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
