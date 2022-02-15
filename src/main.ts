/*
 * Copyright (C) 2022 Do inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Emanuele (ebalo) Balsamo <emanuele.balsamo@do-inc.co>
 */

import {createApp} from 'vue'
import App from './App.vue'
import {router} from "./router"

import { plugin as VueTippy } from 'vue-tippy'
import 'tippy.js/dist/tippy.css' // optional for styling
import 'tippy.js/dist/backdrop.css'
import 'tippy.js/animations/shift-away.css'
import 'tippy.js/animations/scale.css'
import 'tippy.js/animations/scale-subtle.css'
import 'tippy.js/animations/scale-extreme.css'
import 'tippy.js/dist/border.css'

import "@/assets/tailwind.css"
import "@/assets/pro.css"
import "@/assets/pro-v5-font-face.css"
import "@/assets/pro-v4-shims.css"
import "@/assets/pro-v4-font-face.css"


const app = createApp(App)
	.use(router)
	.use(
		VueTippy,
		// optional
		{
			directive: 'tippy', // => v-tippy
			component: 'tippy', // => <tippy/>
			componentSingleton: 'tippy-singleton', // => <tippy-singleton/>,
			defaultProps: {
				allowHTML: true,
				animation: 'shift-toward',
				animateFill: true,
				theme: "light",
				interactive: true,
				inertia: true,
			}, // => Global default options * see all props
		}
	)
	.mount('#app')
