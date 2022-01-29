<!--
  - Copyright (C) 2022 Do inc. - All Rights Reserved
  - Unauthorized copying of this file, via any medium is strictly prohibited
  - Proprietary and confidential
  - Written by Emanuele (ebalo) Balsamo <emanuele.balsamo@do-inc.co>
  -->

<template>
	<overlay :open="open">
		<h2 class="text-2xl mb-2 text-center">
			Transaction confirmation pending,
			<br>
			please wait
		</h2>
		<div class="mb-4">
			Tx:
			<a :href="hrefTransaction" target="_blank" rel="noopener"
			   class="underline">
				{{ tx }}
			</a>
		</div>
		<h4>
			Confirmations {{ confirmations }} / 6
		</h4>
		<small v-if="time > 0" class="mt-2">
			{{ time }} seconds elapsed since submission
		</small>
	</overlay>
</template>

<script lang="ts">
import {defineComponent} from 'vue'
import Overlay from "components/Overlay.vue";

export default defineComponent({
	name: "TransactionOverlay",
	components: {Overlay},
	emits: [
		"update:open",
		"update:confirmations",
		"update:time",
	],
	props: {
		confirmations: Number,
		tx: {
			type: String,
			default: "",
		},
		time: {
			type: Number,
			default: 0,
		},
		open: {
			type: Boolean,
			required: true
		},
		noAutoAnimation: {
			type: Boolean,
			default: false
		}
	},
	data: () => ({
		interval: {} as any,
	}),
	computed: {
		hrefTransaction() {
			return `https://testnet.bscscan.com/tx/${this.tx}`
		}
	},
	watch: {
		open(newVal) {
			if (newVal) { //modal opened
				this.$emit('update:time', 0);
				this.$emit('update:confirmations', 0);

				if(!this.noAutoAnimation) {
					setTimeout(() => {
						if (this.confirmations === 0) {
							this.$emit('update:confirmations', this.confirmations + 1)
						}
					}, 5000)

					setTimeout(() => {
						if (this.confirmations === 1) {
							this.$emit('update:confirmations', this.confirmations + 1)
						}
					}, 10000)
				}

				this.interval = setInterval(() => {
					this.$emit('update:time', this.time + 1)
				}, 1000)
			} else { //modal closed
				clearInterval(this.interval)
			}
		}
	},
})
</script>

<style scoped>

</style>
