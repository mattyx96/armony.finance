<!--
  - Copyright (C) 2022 Do inc. - All Rights Reserved
  - Unauthorized copying of this file, via any medium is strictly prohibited
  - Proprietary and confidential
  - Written by Emanuele (ebalo) Balsamo <emanuele.balsamo@do-inc.co>
  -->

<template>
	<div class="flex flex-col overflow-hidden md:overflow-visible">
		<div class="w-full">
			<div class="px-4 md:px-32 py-24 grid grid-cols-5 md:grid-cols-2 container mx-auto">
				<div class="flex md:hidden justify-center items-start">
					<img class="-translate-x-7 translate-y-3/4 scale-150"
					     src="@/assets/images/staking_reverse.png" alt="Armony Finance Stacking"/>
				</div>
				<div class="col-span-3 md:col-span-1">
					<h1 class="text-6xl text-center md:text-left xl:mt-4 font-semibold text-[#19191B]">
						Armony
						<br>
						staking
					</h1>
					<h3 class="text-lg text-center md:text-left font-light mt-12 md:mt-8 text-[#696871]">
					<span class="no">
						Put your crypto at work.
						<br>
						With Armony you receive up to
					</span>
						<span>
						APY on your stacked cryptocurrencies!
					</span>
					</h3>
				</div>
				<div class="flex justify-center items-start md:items-center relative">
					<img class="translate-x-7 translate-y-3/4 md:translate-y-0 md:translate-x-0 scale-150 md:scale-100
							z-10"
					     src="@/assets/images/staking.png" alt="Armony Finance Stacking"
					/>
					<img class="hidden md:block absolute xl:right-0 scale-150 xl:scale-100 top-15 xl:-top-24 z-0"
					     src="@/assets/images/waves2.png" alt="Armony waves"
					/>
				</div>
			</div>

		</div>
	</div>
	<div class="md:container md:mx-auto bg-black rounded-[1.8rem] h-80 mx-4">
	</div>

	<div class="container mx-auto mt-32 mb-32">
		<h2 class="text-[2.2rem] text-gray-900 leading-none tracking-wide text-center w-full font-semibold">
			How Armony works?
		</h2>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-8 px-10 mt-16">
			<div v-for="(elem, id) of how_armony_works" :key="id" class="col-span-1">
				<h3 class="text-[2.2rem] text-[#FF2AFF] font-semibold mb-8">
					{{elem.title}}
				</h3>
				<span>{{elem.body}}</span>
			</div>
		</div>
	</div>

	<faq class="mt-10 mb-20"></faq>
</template>

<route>
{
"meta": {
"hidden": true,
"requiresAuth": false
}
}
</route>
<script>
import {defineComponent} from "vue";
import Faq from "components/Faq";

export default defineComponent({
	name: "index",
	components: {Faq},
	methods: {},
	computed: {},
	data: () => ({
		how_armony_works:[
			{
				title: "Test",
				body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
			},
			{
				title: "Test",
				body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
			},
			{
				title: "Test",
				body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
			},
		]
	}),
})
</script>

<style scoped>

</style>
