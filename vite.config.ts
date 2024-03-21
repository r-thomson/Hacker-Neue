import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import autoprefixer from 'autoprefixer';
import type { PluginVisualizerOptions } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';

export default defineConfig(({ command, mode }) => {
	const analyze = command === 'build' && mode === 'analyze';

	return {
		plugins: [
			svelte({
				preprocess: vitePreprocess(),
			}),
			analyze &&
				visualizer({
					template: 'sunburst',
				}),
		],
		css: {
			postcss: {
				plugins: [autoprefixer()],
			},
		},
		server: {
			port: 3000,
		},
		esbuild: {
			legalComments: 'eof',
		},
	};
});

async function visualizer(options: PluginVisualizerOptions) {
	// Async import so the dependency is optional
	const { visualizer } = await import('rollup-plugin-visualizer');
	return visualizer(options);
}
