import { writable } from 'svelte/store';

const persistentStore = (key, initialValue) => {
	const storedValue = JSON.parse(localStorage.getItem(key));
	const store = writable(storedValue !== null ? storedValue : initialValue);
	store.subscribe(newValue => localStorage.setItem(key, JSON.stringify(newValue)));
	return store;
};

export const counters = persistentStore('pref-show-counters', false);
export const maxStories = persistentStore('pref-max-stories', '30');
export const highlightThreshold = persistentStore('pref-highlight-threshold', '250');
