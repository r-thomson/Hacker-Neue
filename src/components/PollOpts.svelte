<script lang="ts">
	import Meter from './Meter.svelte';
	import PollOptSkeleton from './PollOptSkeleton.svelte';
	import { fetchItem } from '../hacker-news/api';
	import type { DeletedHNItem, HNPoll, HNPollOpt } from '../hacker-news/types';

	interface Props {
		poll: Exclude<HNPoll, DeletedHNItem>;
	}

	const { poll }: Props = $props();

	let pollOpts = $derived(
		Promise.all(poll.parts.map((id) => fetchItem(id) as Promise<HNPollOpt | null>)).then(
			(pollOpts) => pollOpts.filter((opt) => opt !== null),
		),
	);

	let totalScore = $derived(
		pollOpts.then((opts) => opts.reduce((sum, opt) => sum + (opt.deleted ? 0 : opt.score), 0)),
	);
</script>

{#await pollOpts}
	<ul>
		{#each { length: poll.parts.length } as _, i}
			<li style:animation-delay={`${i * 0.09}s`}>
				<PollOptSkeleton />
			</li>
		{/each}
	</ul>
{:then pollOpts}
	<ul>
		{#each pollOpts as opt}
			{#if !opt.deleted}
				<li class="option">
					<div class="details">
						<span class="label">{@html opt.text}</span>
						<span class="score">{opt.score.toLocaleString()} votes</span>
					</div>
					{#await totalScore then totalScore}
						<Meter value={opt.score} max={totalScore} --width="100%" />
					{/await}
				</li>
			{/if}
		{/each}
	</ul>
{/await}

<style>
	ul {
		margin: 0;
		padding: 0;
		list-style: none;
	}

	li + li {
		margin-top: 0.5rem;
	}

	.option {
		max-width: 24rem;
		display: flex;
		flex-direction: column;
		gap: 0.25rem;
	}

	.details {
		display: flex;
		align-items: end;
		justify-content: space-between;
		gap: 0.5rem;

		font-size: 0.876rem;
		line-height: 1.25;
	}

	.label {
		color: var(--color-primary);
		font-weight: 500;
		text-wrap: balance;
	}

	.score {
		color: var(--color-secondary);
		white-space: nowrap;
	}
</style>
