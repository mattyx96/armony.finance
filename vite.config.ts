/*
 * Copyright (C) 2022 Do inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Emanuele (ebalo) Balsamo <emanuele.balsamo@do-inc.co>
 */

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import Pages from "vite-plugin-pages";
// @ts-ignore
import inject from '@rollup/plugin-inject'


const path = require('path');


// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		Pages(),
	],
	resolve: {
		alias: {
			process: "process/browser",
			stream: "stream-browserify",
			zlib: "browserify-zlib",
			util: 'util',
			"@": path.resolve(__dirname, 'src/'),
			"store": path.resolve(__dirname, 'src/store'),
			"components": path.resolve(__dirname, 'src/components'),
		},
		extensions: [
			'.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'
		]
	},
	build: {
		commonjsOptions: {
			transformMixedEsModules: true,
		},
		rollupOptions: {
			plugins: [inject({Buffer: ['Buffer', 'Buffer']})],
		},
	},
	optimizeDeps: {
		exclude: [
			'web3',
		] // <= The libraries that need shimming should be excluded from dependency optimization.
	},
})
