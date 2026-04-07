<script lang="ts">
	import Comment from './Comment.svelte';
	import type { HNItem } from '../hacker-news/types';

	interface Props {
		comments: HNItem[];
	}

	let { comments }: Props = $props();
</script>

<ul class="item-comments">
	{#each comments as comment (comment.id)}
		{#if comment.type === 'comment' && !comment.deleted}
			<li>
				<Comment {comment} collapsible />
			</li>
		{/if}
	{/each}
</ul>

<style>
	ul {
		margin: 0;
		padding: 0;
		list-style-type: none;
	}

	li + li {
		margin-top: 1rem;
	}
</style>
