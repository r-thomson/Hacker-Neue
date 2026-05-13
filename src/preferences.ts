import { persistedStore } from './utils';

type FontFamily = 'serif' | 'sans-serif' | 'monospace';

export const fontFamily = persistedStore<FontFamily>('pref:fontFamily', 'sans-serif');
export const showCounters = persistedStore<boolean>('pref:showCounters', false);
export const maxStories = persistedStore<number>('pref:maxStories', 30);
export const highlightThreshold = persistedStore<number>('pref:highlightThreshold', 200);
export const collapseLongThreads = persistedStore<boolean>('pref:collapseLongThreads', true);

export function resetPreferences() {
	fontFamily.unset();
	showCounters.unset();
	maxStories.unset();
	highlightThreshold.unset();
	collapseLongThreads.unset();
}
