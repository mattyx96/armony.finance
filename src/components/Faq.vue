<template>
	<div class="w-full bg-gradient-to-l from-[#F9F7FA] to-[#F4F5F9] font-dm">
		<div class="container mx-auto rounded-[3rem] md:p-16 p-8 pt-12 text-white lg:w-full -mb-20">
			<h2 class="text-[2.2rem] text-gray-900 leading-none tracking-wide text-center w-full font-semibold">
				Frequently asked questions
			</h2>
			<div class="grid xl:grid-cols-2 grid-cols-1 gap-8 mt-24">
				<a v-for="(elem, id) of faq" :key="id" :href="elem.url" target="_blank" rel="noopener"
				   class="w-full text-gray-900 transition-all duration-300 border-t-2 border-[#E2C7F6]">
					<div class="px-6 py-4 rounded-t-[3rem] w-full cursor-pointer text-lg font-semibold">
						{{ elem.label }}
					</div>
				</a>
			</div>
		</div>
	</div>
</template>

<script>
import {faq} from "@/composition/faq";

export default {
	name: "Faq",
	data: () => ({
		faq: [],
	}),
	setup() {
		return {
			...faq(),
		}
	},
}
</script>

<style scoped>

</style>
