/*
 * Copyright (C) 2022 Do inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Emanuele (ebalo) Balsamo <emanuele.balsamo@do-inc.co>
 */

import {defineConfig} from 'vite'
import vue from '@vitejs/plugin-vue'
import Pages from "vite-plugin-pages";

const path = require('path');


// https://vitejs.dev/config/
export default defineConfig({
	plugins: [
		vue(),
		Pages(),
	],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, 'src/'),
			"store": path.resolve(__dirname, 'src/store'),
			"components": path.resolve(__dirname, 'src/components'),
		},
		extensions: [
			'.mjs', '.js', '.ts', '.jsx', '.tsx', '.json', '.vue'
		]
	},
})
