import { readable } from 'svelte/store';
import { TopStories, NewStories, BestStories, AskStories, ShowStories, JobStories} from '../lists.js';

export const routes = {
	'/': TopStories,
	'/new': NewStories,
	'/best': BestStories,
	'/ask': AskStories,
	'/show': ShowStories,
	'/jobs': JobStories,
	'/info': null,
	'/item': null,
};

let _setCurrentPath;
export const currentPath = readable(window.location.pathname, function start(set) {
	_setCurrentPath = set;
	window.addEventListener('popstate', () => {
		set(window.location.pathname);
	});
});
