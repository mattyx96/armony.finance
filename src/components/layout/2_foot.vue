<!--
  - Copyright (C) 2022 Do inc. - All Rights Reserved
  - Unauthorized copying of this file, via any medium is strictly prohibited
  - Proprietary and confidential
  - Written by Emanuele (ebalo) Balsamo <emanuele.balsamo@do-inc.co>
  -->

<template>
	<footer class="col-span-full bg-white text-white">
		<div class="md:px-48 px-4 pb-24 grid lg:grid-cols-3 md:grid-cols-2 grid-cols-1 md:gap-12 border-t">
			<div class="xl:col-span-1 col-span-full w-full flex xl:justify-start xl:items-start
					items-center justify-center my-16">
				<img src="@/assets/images/Logo-Armony.png" alt="logo" class="object-contain lg:w-2/3 w-full max-w-[60%]"/>
			</div>
			<div
				class="xl:col-span-2 col-span-full w-full md:p-8 px-3 py-6 grid lg:grid-cols-3 grid-cols-2 xl:gap-20 gap-8">
				<div v-for="(elem, id) of Object.entries(footer)" :key="id" class="xl:ml-0 lg:ml-12 lg:text-left"
				     :class="id % 2 === 0 ? 'text-right' : 'text-left'">
					<h4 class="font-semibold text-xl text-[#B5B2FF] font-poppins">
						{{ elem[0].split("_").map(v => `${v[0].toUpperCase()}${v.substr(1)}`).join(" ") }}
					</h4>
					<ul class="mt-8 font-thin font-poppins text-gray-800">
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
			<div class="col-span-full border-t pt-4 text-lg font-thin font-poppins text-center text-gray-800">
				<p>
					Copyright &copy; Do Inc. - {{ (new Date()).getFullYear() }}
				</p>
			</div>
		</div>
	</footer>
</template>

<script>
import {footer} from "@/composition/footer";
import {defineComponent} from "vue";

export default defineComponent({
	name: "l-foot",
	data: () => ({}),
	setup() {
		return {
			...footer(),
		}
	},
})
</script>

<style scoped>
.footer {
	/*	background: linear-gradient(0deg, hsla(276, 19%, 56%, 1) 0%, hsla(228, 30%, 60%, 0.9) 59%);

		background: -moz-linear-gradient(0deg, hsla(276, 19%, 56%, 1) 0%, hsla(228, 30%, 60%, 0.9) 59%);

		background: -webkit-linear-gradient(0deg, hsla(276, 19%, 56%, 1) 0%, hsla(228, 30%, 60%, 0.9) 59%);*/
}
</style>
