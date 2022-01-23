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
				<li v-for="e of Array.from({length: 5}, (v, k) => k)"
				    class="flex items-center justify-center">
					{{ e }}
				</li>
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

export default {
	name: "l-head",
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
		connectionButton() {
			return {
				classes: !this.isConnected ? "cursor-pointer" : "",
				method: !this.isConnected ? this.connectWallet : () => {}
			}
		},
	}
}
</script>

<style scoped>

</style>