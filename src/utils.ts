import { derived, type Readable } from 'svelte/store';

/**
 * A derived store that updates after a delay since the latest change
 * @param store Input store
 * @param delay Minimum delay in milliseconds
 * @param initialValue Initial value of the store
 */
export function debouncedStore<T>(store: Readable<T>, delay: number, initialValue?: T) {
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
		initialValue
	);
}
