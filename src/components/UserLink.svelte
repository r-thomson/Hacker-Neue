<script lang="ts">
	import { fromUnixTime } from 'date-fns';
	import { fetchUser, modNames } from '../hacker-news/api';
	import Content from './Content.svelte';
	import UserSkeleton from './UserSkeleton.svelte';
	import Timestamp from './Timestamp.svelte';
	import Tooltip from './Tooltip.svelte';

	interface Props {
		userId: string;
	}

	let { userId }: Props = $props();

	// Using $derived makes this lazy
	let user = $derived(fetchUser(userId));
</script>

<Tooltip estimatedHeight={140}>
	<a href="user?id={userId}" class:mod-name={modNames.has(userId)}>
		{userId}
	</a>

	{#snippet popover()}
		{#await user}
			<UserSkeleton />
		{:then user}
			{#if user}
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
			{/if}
		{/await}
	{/snippet}
</Tooltip>

<style>
	.mod-name {
		color: var(--color-accent);
	}

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
		margin-top: 0.5rem;
		font-size: 0.875rem;

		overflow: hidden;
		display: -webkit-box;
		-webkit-box-orient: vertical;
		-webkit-line-clamp: 7;
		line-clamp: 7;
	}
</style>
