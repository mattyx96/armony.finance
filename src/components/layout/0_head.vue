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
						<a :href="e.path" class="w-full h-full flex items-center justify-center cursor-pointer transition-all
							duration-300 hover:shadow-lg hover:shadow-pink-400 rounded"
							:class="e.active ? 'bg-gray-800 hover:bg-gray-800' : 'hover:bg-gray-900'">
							{{ e.label }}
						</a>
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
import {mapGetters, mapActions} from "vuex";
import {ACTIONS, GETTERS} from "store/types";
import routes from "~pages"
import {defineComponent, watch} from "vue";
import {RouteMeta} from "vue-router";
import {capitalize} from "../../composition/strings";

interface navigationUrl {
	label: string,
	path: string,
	active: boolean,
	meta?: RouteMeta
}

export default defineComponent({
	name: "l-head",
	data: () => ({
		urls: [] as navigationUrl[]
	}),
	methods: {
		...mapActions({
			connectWallet: ACTIONS.connectWallet
		})
	},
	computed: {
		...mapGetters({
			connectedAs: GETTERS.connectedAs,
			isConnected: GETTERS.isConnected
		}),
		connectionButton(): any {
			return {
				classes: !this.isConnected ? "cursor-pointer" : "",
				method: !this.isConnected ? this.connectWallet : () => {
				}
			}
		},
	},
	created() {
		const refreshRoutes = () => {
			this.urls = []
			routes.forEach(v => {
				console.log(this.$route.name, v.name)
				console.log(this.$route.path, v.path)
				this.urls.push({
					label: v.meta && v.meta.label ? capitalize(v.meta.label) : capitalize(v.name as string),
					path: v.path,
					active: this.$route.name === v.name || this.$route.path === v.path,
					meta: v.meta
				})
			})
		}
		refreshRoutes()

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