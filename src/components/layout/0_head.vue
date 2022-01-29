<!--
  - Copyright (C) 2022 Do inc. - All Rights Reserved
  - Unauthorized copying of this file, via any medium is strictly prohibited
  - Proprietary and confidential
  - Written by Emanuele (ebalo) Balsamo <emanuele.balsamo@do-inc.co>
  -->

<template>
	<header class="bg-gradient-to-b from-[#0B101E] to-[#18191B] text-gray-100 py-4">
		<nav class="grid grid-cols-12 gap-4 px-8">
			<div class="col-span-2 flex items-center justify-start">
				<img src="" alt="Armony.finance - logo">
			</div>
			<ul class="col-start-4 col-span-5 grid grid-cols-5 gap-4">
				<template v-for="(e, i) of urls" :key="i">
					<li v-if="!e.meta.hidden">
						<router-link :to="e.path" class="w-full h-full flex items-center justify-center cursor-pointer transition-all
							duration-300 hover:shadow-lg hover:shadow-pink-400 rounded"
						   :class="e.active ? 'bg-gray-800 hover:bg-gray-800' : 'hover:bg-gray-900'">
							{{ e.label }}
						</router-link>
					</li>
				</template>
			</ul>
			<div class="col-span-2 col-start-10 flex items-center justify-center">
				<div class="border rounded-md border-gray-900 bg-gray-800 px-3 py-2 truncate transition-all duration-300
					hover:bg-gray-700 select-none"
				     @click="connectionButton.method"
				     :class="connectionButton.classes">
					<template v-if="isConnected">
						{{ connectedAs }}
					</template>
					<template v-else>
						Connect
					</template>
				</div>
			</div>
			<div class="flex items-center justify-center">
				<div class="rounded-md bg-pink-400/60 px-3 py-2 shadow-md shadow-pink-300/25 transition-all duration-300
					hover:shadow-pink-300/50 hover:shadow-lg hover:bg-pink-400/75 cursor-pointer select-none">
					Sign in
				</div>
			</div>
		</nav>
	</header>
</template>

<script lang="ts">
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
	name: "l-head",
	data() {
		return {
			urls: [] as navigationUrl[],
			isConnected: Address.init().isConnected,
			connectedAs: Address.init().connectedAs,
		}
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
	},
	created() {
		Address.init().onNewAddressRegistered.subscribe((v: string): void => {
			this.connectedAs = !!v ? v : false
			this.isConnected = !!v
		})

		const refreshRoutes = () => {
			// reset the urls
			this.urls = []

			routes.forEach(v => {
				// push the navigation url structure to the array
				this.urls.push({
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
	},
	mounted() {
		this.connectedAs = Address.init().connectedAs
		this.isConnected = Address.init().isConnected
	}
})
</script>

<style scoped>

</style>