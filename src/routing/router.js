import { readable } from 'svelte/store';

export const routes = {
	'/': null,
	'/new': null,
	'/best': null,
	'/ask': null,
	'/show': null,
	'/jobs': null,
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
