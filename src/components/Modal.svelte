<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		children: Snippet;
		/** Whether or not the modal is open. */
		open: boolean;
		/** The title displayed in the modal. */
		title: string;
	}

	let { children, open = $bindable(), title }: Props = $props();

	let dialogEl: HTMLDialogElement | undefined = $state();

	$effect(() => {
		if (open) {
			dialogEl?.showModal();
		} else {
			dialogEl?.requestClose();
		}
	});

	function isWithinBoundingRect(event: MouseEvent, boundingRect: DOMRectReadOnly): boolean {
		return (
			event.clientY >= boundingRect.top &&
			event.clientX >= boundingRect.left &&
			event.clientY <= boundingRect.bottom &&
			event.clientX <= boundingRect.right
		);
	}

	function onclick(event: MouseEvent) {
		if (!isWithinBoundingRect(event, dialogEl!.getBoundingClientRect())) {
			dialogEl!.close();
		}
	}

	function onclose() {
		open = false;
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events, a11y_no_noninteractive_element_interactions -->
<dialog bind:this={dialogEl} {onclick} {onclose}>
	<h2>{title}</h2>

	{@render children()}
</dialog>

<style>
	dialog {
		--window-padding: 12px;

		width: var(--modal-width, 32rem);
		padding: 16px;
		max-width: calc(100% - 2 * var(--window-padding));
		max-height: calc(100% - 2 * var(--window-padding));

		background-color: var(--color-bg);
		border: 1px solid var(--color-tertiary);
		border-radius: 8px;
	}

	dialog::backdrop {
		margin: -100% -100%;
		background-color: #17171790;
	}

	h2 {
		margin: 0;
		padding-bottom: 10px;
		font-size: 1.25rem;
		font-weight: 600;
		line-height: 1.2;
	}
</style>
