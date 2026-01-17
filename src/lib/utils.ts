import type { Attachment } from 'svelte/attachments';
import { on } from 'svelte/events';
import {
	derived,
	toStore,
	writable,
	type Readable,
	type Updater,
	type Writable,
} from 'svelte/store';
import { page } from '$app/state';
import { goto } from '$app/navigation';

export const noop = (..._args: any[]) => {};

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

/**
 * An attachment for controlling element focus with reactive state.
 * @param hasFocus If the element should be currently focused.
 */
export function focus(hasFocus: boolean): Attachment {
	return (element) => {
		if (element instanceof HTMLElement) {
			if (hasFocus) {
				element.focus();
			} else {
				element.blur();
			}
		}

		const focusOff = on(element, 'focus', () => {
			if (!hasFocus && element instanceof HTMLElement) {
				element.blur();
			}
		});

		const blurOff = on(element, 'blur', () => {
			if (hasFocus && element instanceof HTMLElement) {
				element.focus();
			}
		});

		return () => {
			focusOff();
			blurOff();
		};
	};
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
		// TODO: re-implement
		// const storedValue = storage.getItem(key);
		const storedValue = null;
		return storedValue === null ? defaultValue : JSON.parse(storedValue);
	}

	function saveValue(value: T) {
		// TODO: re-implement
		// storage.setItem(key, JSON.stringify(value));
	}

	function clearValue() {
		// TODO: re-implement
		// storage.removeItem(key);
	}

	const store = writable<T>(undefined, (set) => {
		set(loadValue());

		function onStorage(event: StorageEvent) {
			if (event.storageArea === storage && event.key === key) {
				set(loadValue());
			}
		}

		// TODO: re-implement
		// window.addEventListener('storage', onStorage);

		return () => {
			// window.removeEventListener('storage', onStorage);
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

/**
 * A writable store that represents a value in the current URL's query string.
 * @param param The name of the query parameter
 * @param initialValue Fallback value if the parameter isn't present in the URL
 */
export function searchParamStore(param: string, initialValue = ''): Writable<string> {
	function getValue(params: URLSearchParams) {
		return params.get(param) ?? initialValue;
	}

	const { subscribe } = toStore(() => getValue(page.url.searchParams));

	function set(value: string) {
		const newUrl = new URL(location.href);
		if (value) {
			newUrl.searchParams.set(param, value);
		} else {
			newUrl.searchParams.delete(param);
		}

		goto(newUrl.pathname + newUrl.search + newUrl.hash, { replaceState: true });
	}

	function update(fn: Updater<string>) {
		const curValue = getValue(new URLSearchParams(location.search));
		const newValue = fn(curValue);
		set(newValue);
	}

	return { subscribe, set, update };
}
