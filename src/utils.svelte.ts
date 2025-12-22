import { on } from 'svelte/events';

/**
 * Registers a keyboard shortcut with automatic teardown (via `$effect`).
 * @param shortcut The `KeyboardEvent.key` to listen for
 * @param callback Function run when the key is pressed
 */
export function shortcut(shortcut: string, callback: (event: KeyboardEvent) => void) {
	function onKeydown(event: KeyboardEvent) {
		if (event.key !== shortcut) return;

		if (event.ctrlKey || event.altKey || event.metaKey || event.isComposing) return;

		// Ignore keypresses originating from form controls
		if (event.target instanceof HTMLInputElement) return;
		if (event.target instanceof HTMLTextAreaElement) return;
		if (event.target instanceof HTMLSelectElement) return;
		if (event.target instanceof HTMLElement && event.target.isContentEditable) return;

		return callback(event);
	}

	// Use $effect to automatically unregister event handlers
	$effect(() => on(window, 'keydown', onKeydown));
}
