<!--
  - Copyright (C) 2022 Do inc. - All Rights Reserved
  - Unauthorized copying of this file, via any medium is strictly prohibited
  - Proprietary and confidential
  - Written by Emanuele (ebalo) Balsamo <emanuele.balsamo@do-inc.co>
  -->

<template>
	<footer
		class="footer flex flex-col justify-center items-center items-baseline text-white select-none py-12 md:px-8 px-8">
		<div
			class="col-span-full w-full md:p-8 px-3 py-6 grid lg:grid-cols-5 md:grid-cols-3 grid-cols-1 xl:gap-20 md:gap-12">
			<div v-for="(elem, id) of Object.entries(footer)" :key="id"
			     class="xl:ml-0 lg:ml-12 lg:text-left mt-8 lg:mt-0">
				<h4 class="font-semibold text-xl font-semibold text-[#B5B2FF] font-poppins md:text-left text-center">
					{{ elem[0].split("_").map(v => `${v[0].toUpperCase()}${v.substr(1)}`).join(" ") }}
				</h4>
				<ul class="mt-8 font-thin font-poppins md:text-left text-center">
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

		<!--    FeaturedIcons-->
		<div class="md:col-span-8 md:col-start-3 col-span-full col-start-1 flex flex-col relative mx-auto">
			<div class="flex items-center justify-center flex-wrap md:flex-nowrap text-gray-800 mt-10">
				<div v-for="(elem, id) of featuredIcons" :key="id">
					<a class="rounded-full h-28 w-28 md:h-28 md:w-28 flex-col items-center justify-center px-2 md:m-2"
					   :href="elem.url" target="_blank" rel="noopener"
					   :class="['flex', elem?.bullet && elem.bullet ? 'bg-white' : '']">
						<div v-if="elem.desc" class="text-[#F9CFFF] font-poppins">
							<span>{{ elem.desc }}</span>
						</div>
						<img v-if="elem.pic" :src="elem.pic" :alt="elem.alt" class="object-contain rounded-md"/>
					</a>
				</div>
			</div>
		</div>

		<div class="mt-8 flex items-center justify-center col-span-full mx-auto">
			<a class="rounded-full px-6 py-2 bg-[#B5B6FF]" href="mailto:support@melodity.org">Support</a>
		</div>

	</footer>
</template>

<script>
import {footer} from "composition/footer";

export default {
	name: "l-foot",
	data: () => ({

	}),
	setup() {
		return {
			...footer(),
		}
	},
}
</script>

<style scoped>
.footer {
	background: linear-gradient(0deg, hsla(276, 19%, 56%, 1) 0%, hsla(228, 30%, 60%, 0.9) 59%);

	background: -moz-linear-gradient(0deg, hsla(276, 19%, 56%, 1) 0%, hsla(228, 30%, 60%, 0.9) 59%);

	background: -webkit-linear-gradient(0deg, hsla(276, 19%, 56%, 1) 0%, hsla(228, 30%, 60%, 0.9) 59%);
}
</style>
