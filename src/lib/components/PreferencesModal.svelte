<script lang="ts">
	import Modal from './Modal.svelte';
	import {
		highlightThreshold,
		maxStories,
		resetPreferences,
		showCounters,
		collapseLongThreads,
	} from '../preferences';

	interface Props {
		/** Whether or not the modal is open. */
		open: boolean;
	}

	let { open = $bindable() }: Props = $props();

	function onreset(event: Event) {
		event.preventDefault();
		resetPreferences();
	}
</script>

<Modal bind:open title="Preferences">
	<form method="dialog" {onreset}>
		<label>
			<input type="checkbox" bind:checked={$showCounters} />
			Show counters in story lists
		</label>

		<label for="maxStoriesSelect">Stories per page</label>
		<select id="maxStoriesSelect" bind:value={$maxStories}>
			{#each [20, 30, 50, 100] as value}
				<option {value}>{value || 'Never'}</option>
			{/each}
		</select>

		<label for="highlightThresholdSelect">Highlight story scores above</label>
		<select id="highlightThresholdSelect" bind:value={$highlightThreshold}>
			{#each [0, 100, 150, 200, 250, 300, 350, 400, 450, 500] as value}
				<option {value}>{value || 'Never'}</option>
			{/each}
		</select>

		<label>
			<input type="checkbox" bind:checked={$collapseLongThreads} />
			Collapse long comment threads
		</label>

		<div class="actions">
			<button type="submit">Done</button>
			<button type="reset">Reset</button>
		</div>
	</form>
</Modal>

<style>
	form {
		display: grid;
		grid-template-columns: repeat(2, auto);
		gap: 8px;
		align-items: first baseline;
		justify-items: start;
	}

	button,
	label {
		font-size: 0.875rem;
		font-weight: 500;
		line-height: 1.25;
	}

	label:has(:global(input)) {
		display: flex;
		align-items: first baseline;
		column-gap: 6px;
	}

	input[type='checkbox'] {
		margin: 0;
	}

	select {
		min-width: 8rem;
		font-size: 1rem;
	}

	.actions {
		grid-column: 1 / -1;

		display: flex;
		gap: 8px;
		margin-top: 12px;
	}

	label {
		grid-column: 1 / 2;
		justify-self: end;
		text-align: end;
	}

	select,
	label:has(:global(input)) {
		grid-column: 2 / 3;
		justify-self: start;
		text-align: start;
	}

	@media (max-width: 30em) {
		label {
			justify-self: start;
			text-align: start;
		}

		select {
			justify-self: end;
			min-width: auto;
		}

		label:has(:global(input)) {
			grid-column: 1 / -1;
		}
	}
</style>
