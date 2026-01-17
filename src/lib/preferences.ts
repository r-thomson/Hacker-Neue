import { persistedStore } from './utils';

export const showCounters = persistedStore<boolean>('pref:showCounters', false);
export const maxStories = persistedStore<number>('pref:maxStories', 30);
export const highlightThreshold = persistedStore<number>('pref:highlightThreshold', 200);
export const collapseLongThreads = persistedStore<boolean>('pref:collapseLongThreads', true);

export function resetPreferences() {
	showCounters.unset();
	maxStories.unset();
	highlightThreshold.unset();
	collapseLongThreads.unset();
}
