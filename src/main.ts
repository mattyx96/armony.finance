/*
 * Copyright (C) 2022 Do inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Emanuele (ebalo) Balsamo <emanuele.balsamo@do-inc.co>
 */

import {createApp} from 'vue'
import App from './App.vue'
import {router} from "./router"

import "./assets/tailwind.css"
import 'boxicons/css/boxicons.min.css'

const app = createApp(App)
	.use(router)
	.mount('#app')
