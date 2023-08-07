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
				clearInterval(timeout);
			};
		},
		initialValue,
	);
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
): Writable<T> {
	function loadValue(): T {
		const storedValue = storage.getItem(key);
		return storedValue === null ? defaultValue : JSON.parse(storedValue);
	}

	function saveValue(value: T) {
		storage.setItem(key, JSON.stringify(value));
	}

	const store = writable<T>(loadValue(), (set) => {
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
	};
}

/**
 * A Map that holds a weak reference to its values.
 */
export class WeakValueMap<K, V extends object> {
	constructor(iterable?: Iterable<[K, V]> | null) {
		const entries = iterable?.[Symbol.iterator]
			? Array.from(iterable).map(([k, v]) => [k, new WeakRef(v)] as const)
			: undefined;
		this.#innerMap = new Map(entries);
	}

	#innerMap: Map<K, WeakRef<V>>;

	get(key: K): V | undefined {
		return this.#innerMap.get(key)?.deref();
	}

	has(key: K): boolean {
		return this.get(key) !== undefined;
	}

	set(key: K, value: V): this {
		this.#innerMap.set(key, new WeakRef(value));
		return this;
	}

	delete(key: K): boolean {
		// Map.delete returns a boolean so we need to retrieve before deleting
		const existed = this.has(key);
		this.#innerMap.delete(key);
		return existed;
	}
}
