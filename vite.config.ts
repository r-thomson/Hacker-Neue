/// <reference types="vitest/config" />
import { svelte } from '@sveltejs/vite-plugin-svelte';
import type { PluginVisualizerOptions } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';

export default defineConfig(({ command, mode }) => {
	const nodeMajor = +process.versions.node.split('.')[0];
	const analyze = command === 'build' && mode === 'analyze';

	return {
		plugins: [svelte(), analyze && visualizer({ template: 'sunburst' })],
		resolve: {
			conditions: process.env.VITEST ? ['browser'] : undefined,
		},
		css: {
			transformer: 'lightningcss',
		},
		server: {
			port: 3000,
		},
		test: {
			environment: 'happy-dom',
			execArgv: nodeMajor >= 25 ? ['--no-experimental-webstorage'] : [],
			restoreMocks: true,
		},
	};
});

async function visualizer(options: PluginVisualizerOptions) {
	// Async import so the dependency is optional
	const { visualizer } = await import('rollup-plugin-visualizer');
	return visualizer(options);
}
