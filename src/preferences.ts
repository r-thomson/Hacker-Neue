import type { Writable } from 'svelte/store';
import { writable } from 'svelte/store';

export const showCounters = persistedStore<boolean>('pref:showCounters', false);
export const maxStories = persistedStore<number>('pref:maxStories', 30);
export const highlightThreshold = persistedStore<number>('pref:highlightThreshold', 200);

/** A Svelte store that persists its value with the Web Storage API. */
function persistedStore<T>(key: string, defaultValue: T, storage = localStorage): Writable<T> {
	function loadValue(): T {
		const storedValue = storage.getItem(key);
		return storedValue === null ? defaultValue : JSON.parse(storedValue);
	}

	function saveValue(value: T) {
		storage.setItem(key, JSON.stringify(value));
	}

	const store = writable<T>(loadValue(), (set) => {
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
		update: store.update,
	};
}
