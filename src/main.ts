/*
 * Copyright (C) 2022 Do inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Emanuele (ebalo) Balsamo <emanuele.balsamo@do-inc.co>
 */

import {createApp} from 'vue'
import App from './App.vue'
import {router} from "./router"

import {plugin as VueTippy, roundArrow} from 'vue-tippy'
import Cleave from 'cleave.js';

import 'tippy.js/dist/tippy.css' // optional for styling
import 'tippy.js/dist/backdrop.css'
import 'tippy.js/animations/shift-away.css'
import 'tippy.js/animations/scale.css'
import 'tippy.js/animations/scale-subtle.css'
import 'tippy.js/animations/scale-extreme.css'
import 'tippy.js/dist/border.css'
import 'tippy.js/dist/svg-arrow.css'

import "@/assets/tailwind.css"
import "@/assets/pro.css"
import "@/assets/pro-v5-font-face.css"
import "@/assets/pro-v4-shims.css"
import "@/assets/pro-v4-font-face.css"


const app = createApp(App)

app.directive('cleave', {
    mounted: (el, binding) => {
        el.cleave = new Cleave(el, binding.value || {})
    },
    update: (el) => {
        const event = new Event('input', {bubbles: true});
        setTimeout(function () {
            el.value = el.cleave.properties.result
            el.dispatchEvent(event)
        }, 100);
    }
})


app.use(router)
    .use(
        VueTippy,
        // optional
        {
            directive: 'tippy', // => v-tippy
            component: 'tippy', // => <tippy/>
            componentSingleton: 'tippy-singleton', // => <tippy-singleton/>,
            defaultProps: {
                allowHTML: true,
                animateFill: true,
                interactive: true,
                inertia: true,
                /*hideOnClick: false, //debug
                trigger: 'click', //debug*/
                arrow: roundArrow,
                animation: 'fade',
                touch: true,
            }, // => Global default options * see all props
        }
    )
    .mount('#app')
