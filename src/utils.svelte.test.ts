import { flushSync } from 'svelte';
import { assert, beforeEach, describe, test, vi } from 'vitest';
import { shortcut } from './utils.svelte';

describe('shortcut', () => {
	beforeEach(() => {
		document.body.innerHTML = '';
	});

	test('callback is called when key is pressed', () => {
		const callback = vi.fn();
		const cleanup = $effect.root(() => {
			shortcut('k', callback);
			flushSync();
		});

		const event = new KeyboardEvent('keydown', { key: 'k', bubbles: true });
		window.dispatchEvent(event);

		cleanup();

		assert.lengthOf(callback.mock.calls, 1);
		assert.deepEqual(callback.mock.lastCall, [event]);
	});

	test('callback is not called for different keys', () => {
		const callback = vi.fn();
		const cleanup = $effect.root(() => {
			shortcut('k', callback);
			flushSync();
		});

		const event = new KeyboardEvent('keydown', { key: 'j', bubbles: true });
		window.dispatchEvent(event);

		cleanup();

		assert.lengthOf(callback.mock.calls, 0);
	});

	test('events from <input> are ignored', () => {
		const callback = vi.fn();
		const cleanup = $effect.root(() => {
			shortcut('k', callback);
			flushSync();
		});

		const input = document.createElement('input');
		document.body.appendChild(input);

		const event = new KeyboardEvent('keydown', { key: 'k', bubbles: true });
		input.dispatchEvent(event);

		cleanup();

		assert.lengthOf(callback.mock.calls, 0);
	});

	test('listeners are cleaned up', () => {
		const callback = vi.fn();
		const cleanup = $effect.root(() => {
			shortcut('k', callback);
			flushSync();
		});

		cleanup();
		flushSync();

		const event = new KeyboardEvent('keydown', { key: 'k', bubbles: true });
		window.dispatchEvent(event);

		assert.lengthOf(callback.mock.calls, 0);
	});
});
