<script lang="ts">
	import { fromUnixTime } from 'date-fns';
	import Comment from '$lib/components/Comment.svelte';
	import Content from '$lib/components/Content.svelte';
	import Story from '$lib/components/Story.svelte';
	import StorySkeleton from '$lib/components/StorySkeleton.svelte';
	import Timestamp from '$lib/components/Timestamp.svelte';
	import { fetchItem, fetchUser } from '$lib/hacker-news/api';
	import type { DeadHNItem, DeletedHNItem, HNItem } from '$lib/hacker-news/types';
	import { noop } from '$lib/utils';
	import { page } from '$app/state';

	const userId = $derived(page.url.searchParams.get('id') ?? '');
	const user = $derived(
		fetchUser(userId).then((user) => {
			if (!user) throw Error('User does not exist');
			return user;
		}),
	);

	$effect(() => {
		user.then((user) => {
			document.title = `Profile: ${user.id} - Hacker Neue`;
		}).catch(noop);
	});

	function isNotDeadOrDeleted(
		item: HNItem | null,
	): item is Exclude<HNItem, DeadHNItem | DeletedHNItem> {
		return !!item && !item.dead && !item.deleted;
	}

	const recentItems = $derived(
		user
			.then((user) => user.submitted?.slice(0, 30) ?? [])
			.then((ids) => Promise.all(ids.map((id) => fetchItem(id))))
			.then((items) => items.filter(isNotDeadOrDeleted)),
	);
</script>

{#await user}
	<StorySkeleton />
{:then user}
	<div class="user-name">{user.id}</div>
	<div class="details">
		<span>Joined <Timestamp date={fromUnixTime(user.created)} /></span>
		<span>{user.karma.toLocaleString()} karma</span>
	</div>

	{#if user.about}
		<div class="user-about">
			<Content content={user.about} />
		</div>
	{/if}
{/await}

<hr class="items-divider" />

{#await recentItems then items}
	<ol>
		{#each items as item}
			{#if item && (item.type === 'story' || item.type === 'job' || item.type === 'poll')}
				<li>
					<Story story={item} />
				</li>
			{:else if item && item.type === 'comment'}
				<li>
					<Comment comment={item} parentLink />
				</li>
			{/if}
		{/each}
	</ol>
	<p class="empty-message">This user hasn’t submitted anything.</p>
{/await}

<style>
	.user-name {
		font-weight: 600;
		line-height: 1.125;

		margin-bottom: 0.125rem;
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

	.user-about {
		margin-top: 0.75rem;
		font-size: 0.875rem;
	}

	.items-divider {
		margin: 1.25rem 0;
		border: none;
		border-top: 1px solid var(--color-tertiary);
	}

	ol {
		margin: 0;
		padding: 0;
	}

	li {
		list-style-type: none;
	}

	li + li {
		margin-top: 0.5rem;
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
