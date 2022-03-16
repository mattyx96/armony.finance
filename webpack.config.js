/*
 * Copyright (C) 2022 Do inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Emanuele (ebalo) Balsamo <emanuele.balsamo@do-inc.co>
 */

const path = require('path');

module.exports = {
	resolve: {
		alias: {
			"@": path.resolve(__dirname, 'src/'),
			"store": path.resolve(__dirname, 'src/store'),
			"components": path.resolve(__dirname, 'src/components'),
			"composition": path.resolve(__dirname, 'src/composition'),
		},
		fallback: {
			"stream": require.resolve("stream-browserify"),
			"assert": require.resolve("assert/"),
			"http": require.resolve("stream-http"),
			"https": require.resolve("https-browserify"),
			"os": require.resolve("os-browserify/browser"),
			"url": require.resolve("url/")
		},
	},
};