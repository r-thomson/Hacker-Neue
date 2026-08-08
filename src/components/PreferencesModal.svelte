<script lang="ts">
	import {
		type FontFamily,
		type StoryLinkTarget,
		collapseLongThreads,
		fontFamily,
		highlightThreshold,
		maxStories,
		resetPreferences,
		showCounters,
		storyLinkTarget,
	} from '../preferences';
	import Modal from './Modal.svelte';

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
		<label for="fontFamilySelect">Typeface:</label>
		<select id="fontFamilySelect" bind:value={$fontFamily}>
			<option value={'sans-serif' as FontFamily}>Sans-serif</option>
			<option value={'serif' as FontFamily}>Serifed</option>
			<option value={'monospace' as FontFamily}>Monospaced</option>
		</select>

		<label>
			<input type="checkbox" bind:checked={$showCounters} />
			Show counters in story lists
		</label>

		<div class="fieldset" role="group" aria-labelledby="storyLinkTargetLegend">
			<span class="legend" id="storyLinkTargetLegend">Open story links:</span>

			<label>
				<input
					type="radio"
					bind:group={$storyLinkTarget}
					name={'storyLinkTargetRadios' as StoryLinkTarget}
					value="SameTab"
				/>
				In the same tab
			</label>
			<label>
				<input
					type="radio"
					bind:group={$storyLinkTarget}
					name={'storyLinkTargetRadios' as StoryLinkTarget}
					value="NewTab"
				/>
				In a new tab
			</label>
			<label>
				<input
					type="radio"
					bind:group={$storyLinkTarget}
					name="storyLinkTargetRadios"
					value={'NewTabWithComments' as StoryLinkTarget}
				/>
				In a new tab, and open comments
			</label>
		</div>

		<label for="maxStoriesSelect">Stories per page:</label>
		<select id="maxStoriesSelect" bind:value={$maxStories}>
			{#each [20, 30, 50, 100] as value}
				<option {value}>{value || 'Never'}</option>
			{/each}
		</select>

		<label for="highlightThresholdSelect">Highlight story scores above:</label>
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
		gap: 12px;
		align-items: first baseline;
		justify-items: start;
	}

	/*
	The year is 2026.

	Developers are at war with the HTML element known as the <fieldset>.

	We are losing.
	*/

	[role='group'] {
		grid-column: 1 / -1;
		display: grid;
		grid-template-columns: subgrid;
		row-gap: 4px;
	}

	button,
	label,
	.legend {
		font-size: var(--text-sm);
		font-weight: 500;
		line-height: 1.25;
	}

	label:has(:global(input)) {
		display: flex;
		align-items: first baseline;
		column-gap: 6px;
	}

	input[type='checkbox'],
	input[type='radio'] {
		margin: 0;
	}

	select {
		min-width: 8rem;
		font-size: var(--text-md);
	}

	.actions {
		grid-column: 1 / -1;

		display: flex;
		gap: 8px;
		margin-top: 12px;
	}

	label,
	.legend {
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
		label,
		.legend {
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
