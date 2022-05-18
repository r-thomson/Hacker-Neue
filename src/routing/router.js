import { readable } from 'svelte/store';
import Info from '../Info.svelte';
import Item from '../Item.svelte';
import { AskStories, BestStories, JobStories, NewStories, ShowStories, TopStories } from '../lists.js';

export const routes = {
	'/': TopStories,
	'/new': NewStories,
	'/best': BestStories,
	'/ask': AskStories,
	'/show': ShowStories,
	'/jobs': JobStories,
	'/info': Info,
	'/item': Item,
};

export const currentPath = readable(window.location.pathname, (set) => {
	// Handle same-origin links
	const clickListener = (event) => {
		const tag = event.target;
		if (tag.tagName === 'A' && tag.href && event.button === 0) {
			// These checks minimize interference with the browser's default link handling
			if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) { return; }
			if (tag.target === '_blank') { return; }
			
			const destination = new URL(tag.href);
			if (window.location.origin !== destination.origin) { return; }
			
			event.preventDefault();
			window.history.pushState(null, '', tag.href);
			document.title = 'Hacker Neue'; // Until a proper reactive solution
			
			// Hack to force components to be destroyed and recreated
			set(null);
			setTimeout(() => void set(window.location.pathname), 0);
			window.scrollTo(0, 0);
		}
	};
	
	// Handle the browser's back button
	const popstateListener = () => {
		// Hack to force components to be destroyed and recreated
		set(null);
		setTimeout(() => void set(window.location.pathname), 0);
		window.scrollTo(0, 0);
	};
	
	document.addEventListener('click', clickListener);
	window.addEventListener('popstate', popstateListener);
	
	// Called when the last subscriber unsubscribes
	return () => {
		document.removeEventListener('click', clickListener);
		window.removeEventListener('popstate', popstateListener);
	};
});
