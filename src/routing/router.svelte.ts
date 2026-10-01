interface NavigateOptions {
	/** Prevent navigation from creating a new history entry */
	replace?: boolean;
}

export function createRouter() {
	let currentUrl = $state(new URL(location.href));

	function onPopState(_event: PopStateEvent) {
		// popstate fires for hash changes, which we shouldn't consider a full navigation
		if (isSameDocument(currentUrl)) {
			currentUrl.hash = location.hash;
		} else {
			currentUrl = new URL(location.href);
		}
	}

	function onClick(event: MouseEvent) {
		if (event.defaultPrevented) return;

		// Don't interfere with the browser's standard link behavior
		if (event.button !== 0 /* left click */) return;
		if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;

		const anchorTag =
			event.target instanceof Element
				? event.target.closest<HTMLAnchorElement>('a[href]')
				: null;

		if (anchorTag) {
			if (!isSameOrigin(new URL(anchorTag.href, location.origin))) return;
			if (anchorTag.target && anchorTag.target !== '_self') return;

			event.preventDefault();
			navigate(anchorTag.href);
		}
	}

	// TODO: consider how we might want to clean these up side effects
	window.addEventListener('popstate', onPopState);
	window.addEventListener('click', onClick);

	/**
	 * Navigate to a page within the app without a full page reload.
	 * @param to Root-relative path to navigate to.
	 */
	function navigate(to: string, options?: NavigateOptions) {
		let { replace = false } = options ?? {};

		const toUrl = new URL(to, location.origin);
		if (!isSameOrigin(toUrl)) {
			location.href = toUrl.href;
			return;
		}

		// Don't create consecutive duplicate history entries
		if (toUrl.href === location.href) {
			replace = true;
		}

		if (isSameDocument(toUrl) && toUrl.hash) {
			currentUrl.hash = toUrl.hash;
		} else {
			currentUrl = toUrl;
		}

		if (replace) {
			history.replaceState(null, '', toUrl);
		} else {
			history.pushState(null, '', toUrl);
		}
	}

	return {
		get currentUrl(): Readonly<URL> {
			return currentUrl;
		},
		navigate,
	};
}

export const router = createRouter();

function isSameOrigin(other: URL) {
	return location.origin === other.origin;
}

function isSameDocument(other: URL) {
	return (
		location.origin === other.origin &&
		location.pathname === other.pathname &&
		location.search === other.search
	);
}
