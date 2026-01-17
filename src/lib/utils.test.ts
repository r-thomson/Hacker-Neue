import { get, writable } from 'svelte/store';
import { afterEach, assert, beforeEach, describe, test, vi } from 'vitest';
import { debouncedStore, persistedStore } from './utils';

describe('debouncedStore', () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
	});

	test('subscribers receive default value immediately', () => {
		const innerStore = writable(0);
		const store = debouncedStore(innerStore, 100, -1);
		assert.equal(get(store), -1);
	});

	test('subscribers receive initial store value after delay', () => {
		const innerStore = writable(0);
		const subscription = vi.fn();
		debouncedStore(innerStore, 100, -1).subscribe(subscription);
		subscription.mockClear();

		vi.runAllTimers();
		assert.deepEqual(subscription.mock.lastCall, [0]);
	});

	test('set() does not notify subscribers immediately', () => {
		const innerStore = writable(0);
		const subscription = vi.fn();
		debouncedStore(innerStore, 100).subscribe(subscription);
		vi.runAllTimers();
		subscription.mockClear();

		innerStore.set(1);
		vi.advanceTimersByTime(1);
		assert.isEmpty(subscription.mock.calls);
	});

	test('set() notifies subscribers after delay', () => {
		const innerStore = writable(0);
		const subscription = vi.fn();
		debouncedStore(innerStore, 100).subscribe(subscription);
		vi.runAllTimers();
		subscription.mockClear();

		innerStore.set(1);
		vi.advanceTimersByTime(100);
		assert.deepEqual(subscription.mock.lastCall, [1]);
	});

	test('calling set() twice resets the delay', () => {
		const innerStore = writable(0);
		const subscription = vi.fn();
		debouncedStore(innerStore, 100).subscribe(subscription);
		vi.runAllTimers();
		subscription.mockClear();

		innerStore.set(1);
		vi.advanceTimersByTime(99);
		innerStore.set(2);

		vi.advanceTimersByTime(50);
		assert.isEmpty(subscription.mock.calls);
		vi.advanceTimersByTime(50);
		assert.deepEqual(subscription.mock.lastCall, [2]);
	});

	test('unsubscribing stops notifying subscribers', () => {
		const innerStore = writable(0);
		const subscription = vi.fn();
		const unsubscribe = debouncedStore(innerStore, 100).subscribe(subscription);
		vi.runAllTimers();
		subscription.mockClear();

		innerStore.set(1);
		unsubscribe();
		vi.runAllTimers();

		assert.isEmpty(subscription.mock.calls);
	});
});

describe('persistedStore', () => {
	afterEach(() => {
		localStorage.clear();
		sessionStorage.clear();
	});

	test('initial value in storage is used', () => {
		localStorage.setItem('key', JSON.stringify('value'));
		const store = persistedStore('key', '');
		assert.equal(get(store), 'value');
	});

	test('default value is used if key is not in storage', () => {
		assert.isNull(localStorage.getItem('key'));
		const store = persistedStore('key', 'default');

		assert.equal(get(store), 'default');
		assert.isNull(localStorage.getItem('key'));
	});

	test('set() sets key in storage', () => {
		const store = persistedStore('key', '');
		store.set('value');
		assert.equal(localStorage.getItem('key'), JSON.stringify('value'));
	});

	test('unset() removes key from storage', () => {
		localStorage.setItem('key', JSON.stringify('value'));
		const store = persistedStore('key', '');

		store.unset();
		assert.isNull(localStorage.getItem('key'));
	});

	test('subscribe() calls subscription function synchronously', () => {
		const subscription = vi.fn();
		persistedStore('key', 'value').subscribe(subscription);

		assert.equal(subscription.mock.calls.length, 1);
		assert.deepEqual(subscription.mock.lastCall, ['value']);
	});

	test('set() notifies subscribers', () => {
		const store = persistedStore('key', '');
		const subscription = vi.fn();
		store.subscribe(subscription);

		store.set('value');
		assert.deepEqual(subscription.mock.lastCall, ['value']);
	});

	test('storage events notify subscribers', () => {
		const subscription = vi.fn();
		persistedStore('key', '').subscribe(subscription);

		// Simulate the browser emitting a storage event
		localStorage.setItem('key', JSON.stringify('value'));
		window.dispatchEvent(
			new StorageEvent('storage', {
				storageArea: localStorage,
				key: 'key',
				newValue: JSON.stringify('value'),
			}),
		);

		assert.deepEqual(subscription.mock.lastCall, ['value']);
	});

	test('unsubscribing stops notifying subscribers', () => {
		const store = persistedStore('key', '');
		const subscription = vi.fn();
		const unsubscribe = store.subscribe(subscription);
		subscription.mockClear();

		unsubscribe();
		store.set('new value');

		assert.isEmpty(subscription.mock.calls);
	});

	test('complex values are stored and retrieved', () => {
		const object = {
			array: ['foo', 'bar', 'baz'],
			string: 'hello',
			number: 42,
			boolean: true,
			null: null,
		};
		const store = persistedStore<any>('key', undefined);

		store.set(object);
		assert.deepEqual(get(store), object);
	});

	test('storage instance is used if provided', () => {
		const store = persistedStore('key', '', sessionStorage);
		store.set('value');

		assert.equal(sessionStorage.getItem('key'), JSON.stringify('value'));
		assert.isNull(localStorage.getItem('key'));
	});
});
