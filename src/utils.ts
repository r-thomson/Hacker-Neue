import { derived, writable, type Readable, type Updater, type Writable } from 'svelte/store';

/**
 * A derived store that updates after a delay since the latest change.
 * @param store Input store
 * @param delay Minimum delay in milliseconds
 * @param initialValue Initial value of the store
 */
export function debouncedStore<T>(
	store: Readable<T>,
	delay: number,
	initialValue?: T,
): Readable<T> {
	return derived(
		store,
		(store, set) => {
			const timeout = setTimeout(() => {
				set(store);
			}, delay);

			return () => {
				clearTimeout(timeout);
			};
		},
		initialValue,
	);
}

interface PersistedStore<T> extends Writable<T> {
	/** Remove any stored value. */
	unset(): void;
}

/**
 * A writable store that persists its value with the Web Storage API.
 * @param key Storage key
 * @param defaultValue Value to return if the key isn't found in storage
 * @param storage Either `localStorage` or `sessionStorage`
 */
export function persistedStore<T>(
	key: string,
	defaultValue: T,
	storage: Storage = localStorage,
): PersistedStore<T> {
	function loadValue(): T {
		const storedValue = storage.getItem(key);
		return storedValue === null ? defaultValue : JSON.parse(storedValue);
	}

	function saveValue(value: T) {
		storage.setItem(key, JSON.stringify(value));
	}

	function clearValue() {
		storage.removeItem(key);
	}

	const store = writable<T>(undefined, (set) => {
		set(loadValue());

		function onStorage(event: StorageEvent) {
			if (event.storageArea === storage && event.key === key) {
				set(loadValue());
			}
		}

		window.addEventListener('storage', onStorage);

		return () => {
			window.removeEventListener('storage', onStorage);
		};
	});

	return {
		subscribe: store.subscribe,
		set(value: T) {
			store.set(value);
			saveValue(value);
		},
		update(fn: Updater<T>) {
			const newValue = fn(loadValue());
			store.set(newValue);
			saveValue(newValue);
		},
		unset() {
			clearValue();
			store.set(defaultValue);
		},
	};
}
