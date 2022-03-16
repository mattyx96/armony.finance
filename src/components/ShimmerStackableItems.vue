<template>
	<!--	desktop-->
	<div v-for="(e, i) of Array.from({length: 3}, (v, k) => k)" :key="i"
	     class="lg:inline-grid hidden bg-gray-50 shadow-lg rounded-xl col-span-9 my-2 grid grid-cols-9 p-4">
		<div class="font-semibold col-span-3 grid grid-cols-3 gap-2">
			<div class="flex items-center justify-center relative">
				<shimmer text="" :loading="true"
				         class="h-16 w-16 rounded-full"></shimmer>
				<shimmer text="" :loading="true"
				         class="h-8 w-8 absolute rounded-full -top-2 left-1/3 -translate-x-1/2"></shimmer>
			</div>
			<div class="flex flex-col items-center justify-center">
				<shimmer text="" :loading="true"></shimmer>
			</div>
			<div class="relative flex flex-col items-center justify-center">
				<shimmer text="" :loading="true" class="font-light mx-auto"></shimmer>
			</div>
		</div>
		<div class="font-semibold col-span-2 text-gray-600 flex items-center justify-center">
			<shimmer :loading="true" text=""></shimmer>
		</div>
		<div class="font-semibold text-lg col-span-1 flex items-center justify-center text-gray-600">
			<shimmer :loading="true" text=""></shimmer>
		</div>
		<div class="font-semibold col-span-2 flex items-center justify-center text-gray-600">
			<shimmer :loading="true" text=""></shimmer>
		</div>
		<div class="font-semibold col-span-1"></div>
	</div>

	<!--	mobile-->
	<div v-for="(e, i) of Array.from({length: 3}, (v, k) => k)" :key="i"
	     class="col-span-full lg:hidden w-full flex flex-col justify-center items-center">
		<!--card-->
		<div class="bg-gray-50 rounded-[3rem] my-2 px-6 py-10 shadow-lg w-11/12 mx-auto">
			<!--upper-->
			<div class="flex justify-around">
				<!--col sx-->
				<div class="flex flex-col items-center justify-between">
					<!--				logo-->
					<div class="flex items-center justify-center relative">
						<shimmer text="" :loading="true"
						         class="h-20 w-20 rounded-full"></shimmer>
						<shimmer text="" :loading="true"
						         class="h-8 w-8 absolute rounded-full -top-2 -left-0 -translate-x-1/2"></shimmer>
					</div>
					<!--					historical data-->
					<div class="flex flex-col mt-4">
						<div class="self-start font-light text-sm text-center">
							Your earnings
						</div>
						<div class="font-semibold text-gray-600 flex items-center justify-center">
							<shimmer text="" :loading="true" class="font-light mx-auto"></shimmer>
						</div>
					</div>
				</div>
				<!--col dx-->
				<div class="flex flex-col justify-between">
					<!--stonks or not-->
					<div class="relative self-end flex flex-col h-20">
						<shimmer text="" :loading="true" class="font-light mx-auto"></shimmer>
					</div>
					<!--aby-->
					<div class="flex flex-col mt-4">
						<div class="font-light text-sm text-left">
							APY
						</div>
						<shimmer text="" :loading="true" class="font-light mx-auto"></shimmer>
					</div>

					<!--deposited-->
					<div class="flex flex-col mt-4">
						<div class="font-light text-sm text-center self-start">
							Deposited
						</div>
						<shimmer text="" :loading="true" class="font-light mx-auto"></shimmer>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import Shimmer from "@/components/shimmer.vue";

export default defineComponent({
	name: "ShimmerStackingItem",
	components: {Shimmer}
})
</script>

<style scoped>

</style>
