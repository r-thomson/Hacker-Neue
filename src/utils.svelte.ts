import { on } from 'svelte/events';

/**
 * Registers a keyboard shortcut with automatic teardown (via `$effect`).
 * @param shortcut The `KeyboardEvent.key` to listen for
 * @param callback Function run when the key is pressed
 */
export function shortcut(shortcut: string, callback: (event: KeyboardEvent) => void) {
	function onKeydown(event: KeyboardEvent) {
		if (
			event.target instanceof HTMLInputElement ||
			event.target instanceof HTMLTextAreaElement ||
			event.target instanceof HTMLSelectElement ||
			(event.target instanceof HTMLElement && event.target.isContentEditable)
		) {
			event.stopPropagation();
			return;
		}

		if (event.key === shortcut) {
			return callback(event);
		}
	}

	// Use $effect to automatically unregister event handlers
	$effect(() => on(window, 'keydown', onKeydown));
}
