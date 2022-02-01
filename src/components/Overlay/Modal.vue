<!--
  - Copyright (C) 2022 Do inc. - All Rights Reserved
  - Unauthorized copying of this file, via any medium is strictly prohibited
  - Proprietary and confidential
  - Written by Emanuele (ebalo) Balsamo <emanuele.balsamo@do-inc.co>
  -->

<template>
	<overlay :open="open" @click="close">
		<div class="min-h-[4rem] m-auto" :class="[modalSize, modalRounding, background]" @click.stop>
			<slot></slot>
		</div>
	</overlay>
</template>

<script lang="ts">
import {defineComponent, PropType} from 'vue'
import Overlay from "components/Overlay/Overlay.vue";

export default defineComponent({
	name: "Modal",
	components: {Overlay},
	emits: [
		"update:open",
	],
	props: {
		open: {
			type: Boolean as PropType<boolean>,
			required: true
		},
		background: {
			type: String as PropType<string>,
			default: "bg-white"
		},
		size: {
			type: String as PropType<string>,
			default: "md",
		},
		rounded: {
			type: String as PropType<string>,
			default: "lg",
		}
	},
	methods: {
		close() {
			this.$emit("update:open", false)
		}
	},
	computed: {
		modalSize() {
			switch (this.size) {
				case "xs":
					return "w-32"
				case "sm":
					return "w-64"
				case "md":
					return "w-96"
				case "lg":
					return "w-1/3"
				case "xl":
					return "w-1/2"
				case "full":
					return "w-full"
				default:
					return this.size
			}
		},
		modalRounding() {
			switch (this.rounded) {
				case "xs":
					return "rounded-sm"
				case "sm":
					return "rounded"
				case "md":
					return "rounded-md"
				case "lg":
					return "rounded-lg"
				case "xl":
					return "rounded-xl"
				case "full":
					return "rounded-full"
				case "none":
					return "rounded-none"
				default:
					return this.rounded
			}
		},
	}
})
</script>

<style scoped>

</style>
