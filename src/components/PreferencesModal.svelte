<script lang="ts">
	import { highlightThreshold, maxStories, resetPreferences, showCounters } from '../preferences';

	/** Whether or not the modal is open. */
	export let open: boolean;

	let dialogEl: HTMLDialogElement | undefined;

	$: {
		if (dialogEl && open) {
			dialogEl.showModal();
		}
	}

	function isWithinBoundingRect(event: MouseEvent, boundingRect: DOMRectReadOnly): boolean {
		return (
			event.clientY >= boundingRect.top &&
			event.clientX >= boundingRect.left &&
			event.clientY <= boundingRect.bottom &&
			event.clientX <= boundingRect.right
		);
	}

	function onClick(event: MouseEvent) {
		if (!isWithinBoundingRect(event, dialogEl!.getBoundingClientRect())) {
			dialogEl!.close();
		}
	}

	function onReset(_event: Event) {
		resetPreferences();
	}
</script>

<!-- svelte-ignore a11y-click-events-have-key-events a11y-no-noninteractive-element-interactions -->
<dialog bind:this={dialogEl} on:close={() => (open = false)} on:click={onClick}>
	<h2>Preferences</h2>

	<form method="dialog" on:reset|preventDefault={onReset}>
		<label id="showCountersSelect">
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

		<div class="actions">
			<button type="submit">Done</button>
			<button type="reset">Reset</button>
		</div>
	</form>
</dialog>

<style>
	dialog {
		--window-padding: 12px;

		width: 32rem;
		padding: 16px;
		max-width: calc(100% - 2 * var(--window-padding));
		max-height: calc(100% - 2 * var(--window-padding));

		background-color: var(--color-bg);
		border: 1px solid var(--color-tertiary);
		border-radius: 8px;
	}

	dialog::backdrop {
		background-color: #17171790;
	}

	h2 {
		margin: 0 0 10px;
		font-size: 1.25rem;
		font-weight: 600;
		line-height: 1.2;
	}

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

	label:has(input) {
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
	label:has(input) {
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

		label:has(input) {
			grid-column: 1 / -1;
		}
	}
</style>
