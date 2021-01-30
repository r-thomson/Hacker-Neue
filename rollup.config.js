/* eslint-env node */
import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import html from '@rollup/plugin-html';
import { promises as fs } from 'fs';
import copy from 'rollup-plugin-copy';

const PRODUCTION = process.env.NODE_ENV === 'production';

export default {
	input: 'src/main.js',
	output: {
		format: 'iife',
		file: 'dist/bundle.js',
		sourcemap: !PRODUCTION,
		name: 'hackerneat',
	},
	plugins: [
		svelte({
			dev: !PRODUCTION, // Enable run-time checks when not in production
			css: css => { css.write('bundle.css', !PRODUCTION); }
		}),
		
		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		resolve({
			browser: true,
			dedupe: ['svelte']
		}),
		commonjs(),
		
		html({
			meta: [],
			title: 'Hackerneat',
			template: async ({ attributes, files, title }) => {
				// Largely copy-pasted from rollup-html since these functions aren't exported
				let htmlSrc = (await fs.readFile('./src/index.html')).toString();
				htmlSrc = htmlSrc.replace('${title}', title);
				htmlSrc = htmlSrc.replace('${attributes}', html.makeHtmlAttributes(attributes.html));
				
				const scriptAttrs = html.makeHtmlAttributes(attributes.script);
				const scripts = (files.js || [])
					.map(({ fileName }) => `<script src="${fileName}" ${scriptAttrs}></script>`)
					.join('\n');
				htmlSrc = htmlSrc.replace('${scripts}', scripts);
				
				/*
				const linkAttrs = html.makeHtmlAttributes(attributes.link);
				const links = (files.css || [])
					.map(({ fileName }) => `<link href="${fileName}" rel="stylesheet" ${linkAttrs}>`)
					.join('\n');
				htmlSrc = htmlSrc.replace('${links}', links);
				*/
				
				/*
				const metas = meta
					.map((input) => `<meta ${html.makeHtmlAttributes(input)}>`)
					.join('\n');
				htmlSrc = htmlSrc.replace('${metas}', metas);
				*/
				
				return htmlSrc;
			},
		}),
		
		copy({
			targets: [
				{ src: 'static/**/*', dest: 'dist/' },
			],
		}),
		
		// If building for production, minify
		PRODUCTION && terser()
	],
	watch: {
		clearScreen: false
	}
};
