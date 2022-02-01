<!--
  - Copyright (C) 2022 Do inc. - All Rights Reserved
  - Unauthorized copying of this file, via any medium is strictly prohibited
  - Proprietary and confidential
  - Written by Emanuele (ebalo) Balsamo <emanuele.balsamo@do-inc.co>
  -->

<template>
	<span class="p-2 rounded-md mr-2 select-none" :class="shimmer">
		{{ content }}
	</span>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import {randomString} from "composition/strings";

export default defineComponent({
	name: "shimmer",
	props: {
		loading: {
			type: Boolean as PropType<boolean>,
			default: true
		},
		text: {
			type: String as PropType<string>,
			required: true
		}
	},
	data: () => ({
		placeholder: "O".repeat(10)
	}),
	computed: {
		shimmer() {
			return this.loading ? "shimmer" : ""
		},
		content() {
			return this.loading ? this.placeholder : this.text
		}
	}
})
</script>

<style scoped>
.shimmer {
	background-image: linear-gradient(
		90deg,
		#eee 0%, #eee 40%,
		#ddd 50%, #ddd 55%,
		#eee 65%, #eee 100%
	);
	background-size: 400%;
	animation: shimmer 1.5s infinite;
	color: transparent;
}

@keyframes shimmer {
	from {
		background-position: 100% 100%;
	}
	to {
		background-position: 0 0;
	}
}
</style>