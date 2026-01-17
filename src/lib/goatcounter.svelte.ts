import { page } from '$app/state';

let currentPath = $derived(page.url.pathname);
let prevPath: string | undefined;

$effect.root(() => {
	$effect(() => {
		if (typeof window.goatcounter?.count === 'function') {
			goatcounter.count({
				path: currentPath,
				referrer: prevPath && new URL(prevPath, location.origin).href,
			});
		}

		prevPath = currentPath;
	});
});
