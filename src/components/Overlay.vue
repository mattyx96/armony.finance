<!--
  - Copyright (C) 2022 Do inc. - All Rights Reserved
  - Unauthorized copying of this file, via any medium is strictly prohibited
  - Proprietary and confidential
  - Written by Emanuele (ebalo) Balsamo <emanuele.balsamo@do-inc.co>
  -->

<template>
	<div v-if="open" class="fixed inset-0 z-50 bg-gray-900 bg-opacity-75 text-white flex flex-col items-center
				justify-center"
	     :class="transactionClass.container">
		<slot></slot>
	</div>
</template>

<script lang="ts">
import {defineComponent} from 'vue'

export default defineComponent({
	name: "Overlay",
	props: {
		open: {
			type: Boolean,
			default: false,
			required: true,
		},
	},
	computed: {
		transactionClass() {
			return {
				container: this.open ? `opacity-1` : `opacity-0`
			}
		},
	},
})
</script>

<style scoped>

</style>
