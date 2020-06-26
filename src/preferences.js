import { writable } from 'svelte/store';

const preferences = {
	theme: {
		localStorageKey: 'pref-theme',
		initialValue: 'auto'
	},
	pageWidth: {
		localStorageKey: 'pref-page-width',
		initialValue: '2'
	},
	counters: {
		localStorageKey: 'pref-show-counters',
		initialValue: false
	},
	maxStories: {
		localStorageKey: 'pref-max-stories',
		initialValue: '30'
	},
	highlightThreshold: {
		localStorageKey: 'pref-highlight-threshold',
		initialValue: '250'
	},
};

const store = writable(Object.keys(preferences).reduce((obj, pref) => {
	const storedValue = JSON.parse(localStorage.getItem(preferences[pref].localStorageKey));
	obj[pref] = storedValue !== null ? storedValue : preferences[pref].initialValue;
	return obj;
}, {}));

store.subscribe(newValue => {
	for (const pref in preferences) {
		localStorage.setItem(preferences[pref].localStorageKey, JSON.stringify(newValue[pref]));
	}
});

export default store;
