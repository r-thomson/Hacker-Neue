import { persistedStore } from './utils';

export const showCounters = persistedStore<boolean>('pref:showCounters', false);
export const maxStories = persistedStore<number>('pref:maxStories', 30);
export const highlightThreshold = persistedStore<number>('pref:highlightThreshold', 200);
