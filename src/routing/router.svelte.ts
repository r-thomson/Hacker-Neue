const isSameOrigin = (destination: URL) => destination.origin === window.location.origin;

function createRouter() {
	let currentUrl = $state.frozen<URL>(new URL(window.location.href));

	window.addEventListener('popstate', () => {
		currentUrl = new URL(window.location.href);
	});

	window.addEventListener('hashchange', (event) => {
		currentUrl = new URL(event.newURL);
	});

	return {
		get currentUrl() {
			return currentUrl;
		},

		/**
		 * Navigate to a page within the app without a full page reload.
		 * @param to Root-relative path to navigate to.
		 * @param replace Prevent navigation from creating a new history entry.
		 */
		navigate(to: string, replace = false) {
			const toURL = new URL(to, window.location.origin);
			if (!isSameOrigin(toURL)) throw Error('Destination URL is not same-origin');

			// Don't create consecutive duplicate history entries
			if (toURL.href === window.location.href) {
				replace = true;
			}

			if (replace) {
				window.history.replaceState(null, '', toURL);
			} else {
				window.history.pushState(null, '', toURL);
			}

			currentUrl = toURL;
		},
	};
}

export const router = createRouter();

// Convert link clicks to in-app navigation
document.addEventListener('click', (event: MouseEvent) => {
	if (event.defaultPrevented) return;

	// Don't interfere with the browser's standard link behavior
	if (event.button !== 0 /* left click */) return;
	if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;

	const anchorTag =
		event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href]') : null;

	if (anchorTag) {
		if (!isSameOrigin(new URL(anchorTag.href, window.location.origin))) return;
		if (anchorTag.target && anchorTag.target !== '_self') return;

		event.preventDefault();
		router.navigate(anchorTag.href);
	}
});
