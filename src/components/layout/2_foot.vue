<!--
  - Copyright (C) 2022 Do inc. - All Rights Reserved
  - Unauthorized copying of this file, via any medium is strictly prohibited
  - Proprietary and confidential
  - Written by Emanuele (ebalo) Balsamo <emanuele.balsamo@do-inc.co>
  -->

<template>
	<footer
		class="footer flex flex-col justify-center items-center items-baseline text-gray-500 select-none py-12 md:px-8 px-8">
		<div
			class="col-span-full w-full md:p-8 px-3 py-6 grid lg:grid-cols-5 md:grid-cols-3 grid-cols-1 xl:gap-20 md:gap-12
				container mx-auto">
			<div v-for="(elem, id) of Object.entries(footer)" :key="id"
			     class="xl:ml-0 lg:ml-12 lg:text-left mt-8 lg:mt-0">
				<h4 class="font-semibold text-xl font-semibold text-[#B5B2FF] font-poppins md:text-left text-center">
					{{ elem[0].split("_").map(v => `${v[0].toUpperCase()}${v.substr(1)}`).join(" ") }}
				</h4>
				<ul class="mt-8 text-gray-50 font-semibold font-poppins md:text-left text-center">
					<li v-for="(e, i) of elem[1]" :key="i">
						<a v-if="e.url" :href="e.url" target="_blank" rel="noopener">
							{{ e.label }}
						</a>
						<div v-else :onclick="e.click" class="cursor-pointer">
							{{ e.label }}
						</div>
					</li>
				</ul>
			</div>
		</div>

		<div class="mt-8 flex items-center justify-center col-span-full mx-auto text-white">
			<a class="rounded-full px-6 py-2 bg-[#B5B6FF]" href="mailto:support@melodity.org">Support</a>
		</div>

	</footer>
</template>

<script>
import {footer} from "composition/footer";
import {defineComponent} from "vue";

export default defineComponent({
	name: "l-foot",
	data: () => ({

	}),
	setup() {
		return {
			...footer(),
		}
	},
})
</script>

<style scoped>
.footer {
	background: linear-gradient(0deg, hsla(276, 19%, 56%, 1) 0%, hsla(228, 30%, 60%, 0.9) 59%);

	background: -moz-linear-gradient(0deg, hsla(276, 19%, 56%, 1) 0%, hsla(228, 30%, 60%, 0.9) 59%);

	background: -webkit-linear-gradient(0deg, hsla(276, 19%, 56%, 1) 0%, hsla(228, 30%, 60%, 0.9) 59%);
}
</style>
