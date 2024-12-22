/// <reference types="vitest" />
import { svelte, vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import autoprefixer from 'autoprefixer';
import type { PluginVisualizerOptions } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';

export default defineConfig(({ command, mode }) => {
	const analyze = command === 'build' && mode === 'analyze';

	return {
		plugins: [
			svelte({
				compilerOptions: {
					runes: true,
				},
				preprocess: vitePreprocess(),
			}),
			analyze &&
				visualizer({
					template: 'sunburst',
				}),
		],
		resolve: process.env.VITEST ? { conditions: ['browser'] } : undefined,
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
		test: {
			environment: 'happy-dom',
		},
	};
});

async function visualizer(options: PluginVisualizerOptions) {
	// Async import so the dependency is optional
	const { visualizer } = await import('rollup-plugin-visualizer');
	return visualizer(options);
}
