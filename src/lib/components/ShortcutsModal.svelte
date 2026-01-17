<script lang="ts">
	import Modal from './Modal.svelte';

	interface Props {
		open: boolean;
	}

	let { open = $bindable() }: Props = $props();
</script>

<Modal bind:open title="Keyboard Shortcuts" --modal-width="36rem">
	<div class="container">
		<section>
			<h3>Story Lists</h3>
			<dl>
				<dt><kbd>j</kbd></dt>
				<dd>Next story</dd>

				<dt><kbd>k</kbd></dt>
				<dd>Previous story</dd>

				<dt><kbd>Shift+j</kbd></dt>
				<dd>Last story</dd>

				<dt><kbd>Shift+k</kbd></dt>
				<dd>First story</dd>

				<dt><kbd>o</kbd> <kbd>Enter</kbd></dt>
				<dd>Go to story URL</dd>

				<dt><kbd>c</kbd></dt>
				<dd>Go to comments</dd>

				<dt><kbd>u</kbd></dt>
				<dd>Go to author</dd>
			</dl>
		</section>

		<section>
			<h3>Navigation</h3>
			<dl>
				<dt><kbd>Shift+t</kbd></dt>
				<dd>Go to top stories</dd>

				<dt><kbd>Shift+n</kbd></dt>
				<dd>Go to new stories</dd>

				<dt><kbd>Shift+b</kbd></dt>
				<dd>Go to best stories</dd>

				<dt><kbd>Shift+a</kbd></dt>
				<dd>Go to Ask HN</dd>

				<dt><kbd>Shift+s</kbd></dt>
				<dd>Go to Show HN</dd>
			</dl>
		</section>

		<section>
			<h3>Miscellaneous</h3>
			<dl>
				<dt><kbd>?</kbd></dt>
				<dd>Show this modal</dd>
			</dl>
		</section>
	</div>

	<div class="actions">
		<button type="button" onclick={() => (open = false)}>Close</button>
	</div>
</Modal>

<style>
	h3 {
		margin: 0;
		padding: 8px 0 2px;
		font-size: 1rem;
		font-weight: 600;
		line-height: 1.2;
		text-align: center;
	}

	.container {
		margin-top: -8px;
		columns: 2;
		column-gap: 12px;
	}

	@media (max-width: 32em) {
		.container {
			columns: unset;
		}
	}

	.container > section {
		break-inside: avoid-column;
	}

	dl {
		margin: 0;
		display: grid;
		grid-template-columns: 2fr 3fr;
		gap: 0 8px;
		align-items: baseline;
	}

	dt {
		grid-column: 1;
		justify-self: end;
		text-align: right;
	}

	dd {
		grid-column: 2;
		font-size: 0.867rem;
		margin: 0;
		min-width: 55%;
	}

	kbd {
		display: inline-block;
		padding: 4px;
		font-size: 0.75rem;
		line-height: 1;
		font-family: ui-monospace, monospace;
		white-space: nowrap;
		background-color: var(--color-tertiary);
		box-shadow: inset 0 -1px 0 var(--color-secondary);
		border: 1px solid var(--color-secondary);
		border-radius: 5px;
		user-select: all;
	}

	.actions {
		padding-top: 12px;
	}

	button {
		font-size: 0.875rem;
		font-weight: 500;
		line-height: 1.25;
	}
</style>
