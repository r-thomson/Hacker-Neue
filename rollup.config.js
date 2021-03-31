/* eslint-env node */
import commonjs from '@rollup/plugin-commonjs';
import html from '@rollup/plugin-html';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import { promises as fs } from 'fs';
import copy from 'rollup-plugin-copy';
import css from 'rollup-plugin-css-only';
import svelte from 'rollup-plugin-svelte';
import { terser } from 'rollup-plugin-terser';

const DEV = process.env.ROLLUP_WATCH;

export default {
	input: 'src/main.js',
	output: {
		format: 'iife',
		file: 'dist/bundle.js',
		sourcemap: DEV,
		name: 'hackerneat',
	},
	plugins: [
		svelte({
			compilerOptions: {
				dev: DEV, // Enable run-time checks when not in production
			},
			emitCss: !DEV, // temp workaround for css not being emitted consistently when watching
		}),
		
		css({
			output: 'bundle.css',
		}),
		
		// If you have external dependencies installed from
		// npm, you'll most likely need these plugins. In
		// some cases you'll need additional configuration -
		// consult the documentation for details:
		// https://github.com/rollup/plugins/tree/master/packages/commonjs
		nodeResolve({
			browser: true,
			dedupe: ['svelte'],
		}),
		commonjs(),
		
		html({
			template: async ({ files }) => {
				let htmlSrc = (await fs.readFile('./src/index.html')).toString();
				
				const links = (files.css || [])
					.map(({ fileName }) => `<link rel="stylesheet" href="${fileName}">`)
					.join('\n');
				htmlSrc = htmlSrc.replace('{{links}}', links);
				
				const scripts = (files.js || [])
					.map(({ fileName }) => `<script src="${fileName}"></script>`)
					.join('\n');
				htmlSrc = htmlSrc.replace('{{scripts}}', scripts);
				
				return htmlSrc;
			},
		}),
		
		copy({
			targets: [
				{ src: 'static/**/*', dest: 'dist/' },
			],
		}),
		
		// If building for production, minify
		!DEV && terser(),
		
		// When not in production, run a lightweight dev server
		DEV && serve(),
	],
	watch: {
		clearScreen: false,
	}
};

function serve() {
	let server;
	
	return {
		async writeBundle() {
			if (server) { return; }
			
			const getPort = require('get-port');
			const port = process.env.PORT || getPort.makeRange(5000, 5100);
			const hostname = process.env.HOST || 'localhost';
			
			const sirv = require('sirv')('dist', { dev: true, single: true });
			server = require('http').createServer(sirv);
			server.listen(await getPort({ host: hostname, port }), hostname, (err) => {
				if (err) { throw err; }
				
				const { address, port } = server.address();
				console.log(`Listening on ${address}:${port}`);
			});
		}
	};
}
