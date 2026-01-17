import adapter from '@sveltejs/adapter-auto';
import type { Config } from '@sveltejs/kit';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config: Config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter(),
	},
	compilerOptions: {
		runes: true,
	},
};

export default config;
