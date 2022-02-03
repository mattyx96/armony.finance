<!--
  - Copyright (C) 2022 Do inc. - All Rights Reserved
  - Unauthorized copying of this file, via any medium is strictly prohibited
  - Proprietary and confidential
  - Written by Emanuele (ebalo) Balsamo <emanuele.balsamo@do-inc.co>
  -->

<template>
	<header
		class="w-full flex font-poppins transition-all duration-300 bg-black"
		:class="navAnimationClasses.wrapper">
		<nav
			class="xl:mx-10 flex items-center h-16 w-full px-6 transition-all duration-300"
			:class="navAnimationClasses.nav">

			<!--		logo-->
			<a class="flex items-center w-full md:w-auto justify-start" href="/">
				<img src="@/assets/images/logo.svg" alt="logo" class="h-12 md:h-36 object-contain w-auto"
				     :class="navAnimationClasses.logo"/>
			</a>

			<div class="md:flex w-full justify-end items-center hidden">
				<template v-for="(e, i) of local_urls" :key="i">
					<a v-if="!e.meta.hidden">
						<router-link
							:to="e.path"
							class="text-white text-center h-12 px-4 mx-0.5 font-medium flex items-center justify-center
								md:flex hidden"
							:class="e.active ?
			                'text-[#F74EFF] underline decoration-4 decoration-[#F74EFF] underline-offset-8'
			                : 'hover:bg-gray-900 hover:rounded-full'">
							{{ e.label }}
						</router-link>
					</a>
				</template>
				<template v-for="(elem, id) of urls">
					<a v-if="elem?.type && elem.type === 'button'" :key="-id" :href="elem.url"
					   :target="urlsTargets[id].target" :rel="urlsTargets[id].rel"
					   class="rounded-full h-12 w-auto text-white flex items-center bg-gray-800 shadow-md
					   transition-all duration-300 hover:shadow-fuchsia-300/50 hover:shadow-lg hover:bg-[#F74EFF]
					   cursor-pointer select-none w-min md:flex hidden whitespace-nowrap mx-0.5 px-4">
						{{ elem.label }}
					</a>
					<a v-else :key="id" :href="elem.url" :target="urlsTargets[id].target" :rel="urlsTargets[id].rel"
					   class="text-white text-center h-12 px-4 font-medium flex items-center justify-center
						md:flex hidden hover:bg-gray-900 hover:rounded-full mx-0.5">
						{{ elem.label }}
					</a>
				</template>
			</div>

			<!--	    connect button-->
			<div class="flex w-full md:w-auto md:ml-8 justify-center md:justify-end">
				<div @click="connectionButton.method"
				     class="flex justify-start items-center bg-[#47D680] hover:bg-[#37C56A] text-white rounded-full
                        tracking-wide font-semibold shadow-lg cursor-pointer transition-all ease-in duration-100
                         h-auto pr-3 group w-min hover:shadow-lg hover:shadow-green-300/50"
				     :class="connectionButton.classes">
					<div class="h-12 w-12 rounded-full text-gray-100 bg-[#2EC56A] border border-[#2EC56A] flex
						items-center justify-center group-hover:shadow-md hover:shadow-green-300/50 flex-shrink-0">
						<i class="fa-duotone fa-wallet"></i>
					</div>
					<p class="truncate font-poppins px-2 text-white">
						<template v-if="isConnected">
							{{ connectedAs }}
						</template>
						<template v-else>
							Connect
						</template>
					</p>
				</div>
			</div>

			<div
				class="text-white md:hidden flex justify-end items-center w-full h-full col-start-4 text-4xl cursor-pointer"
				@click="openMobileNav">
				<i class='bx bx-menu-alt-right'></i>
			</div>
			<div class="fixed top-0 left-0 right-0 h-screen transition-all duration-75 grid grid-rows-6 gap-0"
			     :class="navAnimationClasses.mobile.wrapper">
				<div v-for="id of Array.from({length: 3}, (v,k) => k)" :key="id"
				     class="h-full w-full bg-black transition-all duration-300"
				     :class="[navAnimationClasses.mobile.lines.common, navAnimationClasses.mobile.lines.items[id]]"></div>
				<div class="fixed z-20 top-0 left-0 right-0 h-screen flex flex-col transition-all duration-300 text-xl"
				     :class="navAnimationClasses.mobile.content">
					<div class="ml-auto p-4 cursor-pointer text-white text-4xl" @click="closeMobileNav">
						<i class='bx bx-x'></i>
					</div>
					<template v-for="(e, i) of local_urls" :key="i">
						<a v-if="!e.meta.hidden">
							<router-link
								:to="e.path"
								class="text-white p-8 font-medium flex items-center justify-center border-b"
								:class="e.active ?
			                'text-[#F74EFF] underline decoration-4 decoration-[#F74EFF] underline-offset-8'
			                : ''">
								{{ e.label }}
							</router-link>
						</a>
					</template>
					<template v-for="(elem, id) of urls">
						<a v-if="elem?.type && elem.type === 'button'" :key="-id" :href="elem.url"
						   :target="urlsTargets[id].target" :rel="urlsTargets[id].rel"
						   class="text-white font-medium rounded-full w-full bg-gray-800 border-2 border-[#F74EFF]
									via-[#f56ec6] bg-left flex items-center justify-center md:p-8 px-8 py-4 col-start-8
									md:w-1/2 mx-auto mt-6 w-2/3"
						   @click="closeMobileNav">
							{{ elem.label }}
						</a>
						<a v-else :key="id" :href="elem.url" :target="urlsTargets[id].target" :rel="urlsTargets[id].rel"
						   class="text-white p-8 font-medium flex items-center justify-center border-b"
						   @click="closeMobileNav">
							{{ elem.label }}
						</a>
					</template>
				</div>
			</div>
		</nav>
	</header>
</template>

<script lang="ts">
import {urls} from "composition/header";
import routes from "~pages"
import {defineComponent, watch} from "vue";
import {RouteMeta} from "vue-router";
import {capitalize} from "@/composition/strings";
import {Address} from "composition/address";
import {Provider} from "composition/provider";

interface navigationUrl {
	label: string,
	path: string,
	active: boolean,
	meta?: RouteMeta
}

export default defineComponent({
	name: "head2",
	data: () => ({
		scroll: {
			trigger: 100,
			animated: false,
		},
		mobile: {
			open: false,
			animate: false,
			content: false,
		},
		local_urls: [] as navigationUrl[],
		isConnected: Address.init().isConnected,
		connectedAs: Address.init().connectedAs,
	}),
	setup() {
		return {
			...urls(),
		}
	},
	methods: {
		openMobileNav() {
			this.mobile.animate = true
			setTimeout(() => {
				this.mobile.open = true
				this.mobile.content = true
			}, 1200)
		},
		closeMobileNav() {
			this.mobile.content = false
			this.mobile.animate = false
			setTimeout(() => {
				this.mobile.open = false
			}, 1200)
		},
	},
	computed: {
		connectionButton(): any {
			return {
				classes: !this.isConnected ? "cursor-pointer" : "",
				method: !this.isConnected ? () => {
					Provider.init().connectWallet()
				} : () => false
			}
		},
		navAnimationClasses() {
			return {
				wrapper: {
					"fixed z-50 h-20 bg-gray-800 bg-opacity-80 flex items-center": this.scroll.animated,
				},
				nav: {
					"my-4": this.scroll.animated,
					"my-6": !this.scroll.animated,
				},
				content: {
					"mt-64": this.scroll.animated,
					"mt-16": !this.scroll.animated,
				},
				logo: {
					"md:w-1/3 w-full": this.scroll.animated,
					"md:w-2/3 w-full": !this.scroll.animated,
				},
				mobile: {
					wrapper: {
						"z-[-1] translate-x-full": !this.mobile.open && !this.mobile.animate,
						"z-20": this.mobile.animate || this.mobile.open,
						"bg-black": this.mobile.open && this.mobile.animate
					},
					lines: {
						common: {
							"translate-x-full": !this.mobile.animate
						},
						items: [
							"delay-[150ms]",
							"delay-[300ms]",
							"delay-[450ms]",
							"delay-[600ms]",
							"delay-[750ms]",
							"delay-[900ms]",
						]
					},
					content: {
						"opacity-0": !this.mobile.content,
						"opacity-100": this.mobile.content
					}
				}
			}
		},
		urlsTargets() {
			return this.urls.map(v => ({target: v.external ? "_blank" : "", rel: v.external ? "noopener" : ""}))
		},
	},
	async created() {
		//fixed trigger
		let _this = this
		document.addEventListener('scroll', function () {
			if (window.scrollY >= _this.scroll.trigger && !_this.scroll.animated) {
				_this.scroll.animated = true
			} else if (window.scrollY < _this.scroll.trigger && _this.scroll.animated) {
				_this.scroll.animated = false
			}
		});

		//init
		Address.init().watchAddress((v: string): void => {
			this.connectedAs = !!v ? v : false
			this.isConnected = !!v
		})

		const refreshRoutes = () => {
			// reset the urls
			this.local_urls = []

			routes.forEach(v => {
				// push the navigation url structure to the array
				this.local_urls.push({
					// if the url has a label tag than use the capitalized label, otherwise use the capitalized name of
					// the route
					label: v.meta && v.meta.label ? capitalize(v.meta.label) : capitalize(v.name as string),
					path: v.path,
					active: this.$route.name === v.name || this.$route.path === v.path,
					meta: v.meta
				})
			})
		}
		// trigger a first call of the method in order to init the urls array
		refreshRoutes()

		// init a deep object watcher that triggers the route refresh each time the route changes
		watch(
			() => this.$route,
			refreshRoutes,
			{
				deep: true,
				immediate: true
			}
		)
	}
})
</script>

<style scoped>

</style>
