/// <reference types="vitest/config" />
import { sveltekit } from '@sveltejs/kit/vite';
import autoprefixer from 'autoprefixer';
import type { PluginVisualizerOptions } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';

export default defineConfig(({ command, mode }) => {
	const nodeMajor = +process.versions.node.split('.')[0];
	const analyze = command === 'build' && mode === 'analyze';

	return defineConfig({
		plugins: [
			sveltekit(),
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
			execArgv: nodeMajor >= 25 ? ['--no-experimental-webstorage'] : [],
			restoreMocks: true,

			projects: [
				{
					extends: true,
					test: {
						name: 'client',
						environment: 'happy-dom',
						include: ['src/**/*.svelte.test.{js,ts}'],
						exclude: ['src/lib/server/**'],
					},
				},
				{
					extends: true,
					test: {
						name: 'server',
						environment: 'node',
						include: ['src/**/*.test.{js,ts}'],
						exclude: ['src/**/*.svelte.test.{js,ts}'],
					},
				},
			],
		},
	});
});

async function visualizer(options: PluginVisualizerOptions) {
	// Async import so the dependency is optional
	const { visualizer } = await import('rollup-plugin-visualizer');
	return visualizer(options);
}
