import type { Readable } from 'svelte/store';
import { readonly, writable } from 'svelte/store';

const isSameOrigin = (destination: URL) => destination.origin === location.origin;

const _currentUrl = writable(new URL(location.href), (set) => {
	set(new URL(location.href));

	function onPopState(_event: PopStateEvent) {
		set(new URL(location.href));
	}

	function onHashChange(event: HashChangeEvent) {
		set(new URL(event.newURL));
	}

	window.addEventListener('popstate', onPopState);
	window.addEventListener('hashchange', onHashChange);

	return () => {
		window.removeEventListener('popstate', onPopState);
		window.removeEventListener('hashchange', onHashChange);
	};
});

// Read-only interface for _currentURL
export const currentUrl: Readable<URL> = readonly(_currentUrl);

/**
 * Navigate to a page within the app without a full page reload.
 * @param to Root-relative path to navigate to.
 * @param replace Prevent navigation from creating a new history entry.
 */
export function navigate(to: string, replace = false) {
	const toURL = new URL(to, location.origin);
	if (!isSameOrigin(toURL)) throw Error('Destination URL is not same-origin');

	// Don't create consecutive duplicate history entries
	if (toURL.href === location.href) {
		replace = true;
	}

	if (replace) {
		history.replaceState(null, '', toURL);
	} else {
		history.pushState(null, '', toURL);
	}

	_currentUrl.set(toURL);
}

// Convert link clicks to in-app navigation
document.addEventListener('click', (event: MouseEvent) => {
	if (event.defaultPrevented) return;

	// Don't interfere with the browser's standard link behavior
	if (event.button !== 0 /* left click */) return;
	if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;

	const anchorTag =
		event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;

	if (anchorTag) {
		if (!isSameOrigin(new URL(anchorTag.href, location.origin))) return;
		if (anchorTag.target && anchorTag.target !== '_self') return;

		event.preventDefault();
		navigate(anchorTag.href);
	}
});
