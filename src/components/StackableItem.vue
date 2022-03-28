<template>
	<!--desktop-->
	<div class="hidden lg:inline-grid bg-gray-50 drop-shadow-xl rounded-xl col-span-9 my-2 grid grid-cols-9 p-4">
		<template v-for="(e, i) of stackable" :key="i">
			<div class="font-semibold col-span-3 grid grid-cols-3 gap-2">
				<div class="flex items-center justify-center relative">
					<img :src="e.baseCurrency.picture" :alt="e.baseCurrency.name"
					     class="h-16 w-16 object-contain">
					<img :src="e.rewardCurrency.picture" :alt="e.rewardCurrency.name"
					     class="h-8 w-8 object-contain absolute rounded-full bg-orange-400 -top-2 left-1/3
									-translate-x-1/2 p-1">
				</div>
				<div class="flex flex-col justify-center"
				     v-tippy="{content:`Stake ${e.baseCurrency.name} | Earn ${e.rewardCurrency.name}`, arrow: true}">
					<h4 class="font-semibold flex items-center">
						<i class='bx bxs-coin-stack mr-2'></i>
						{{ e.baseCurrency.name }}
					</h4>
					<h4 class="font-semibold text-xs text-gray-600 flex items-center">
						<i class='bx bxs-coin mr-2 mt-auto'></i>
						{{ e.rewardCurrency.name }}
					</h4>
				</div>
				<div class="relative flex flex-col"
				     :class="!price_loaded ? 'items-center justify-center' : ''">
					<template v-if="price_loaded">
						<img v-if="isMeldVariationPositive" :src="arrow" alt="arrow"
						     class="object-contain left-0 bottom-0 absolute">
						<img v-else :src="arrow_down" alt="arrow"
						     class="object-contain left-0 bottom-0 absolute">

						<div class="font-light mx-auto pl-2">{{ gmeldPrice }} $</div>
						<div class="text-xs mx-auto pl-2" :class="dailyPriceVariationClasses">
							{{ isMeldVariationPositive ? "+" : "" }}{{ gmeldDailyVariation }} %
						</div>
					</template>
					<shimmer v-else text="" :loading="!price_loaded"></shimmer>
				</div>
			</div>
			<div class="font-semibold col-span-2 text-gray-600 flex items-center justify-center">
				<shimmer :loading="!staked_ready">
					~ {{estimatedEarnings[i]}} {{e.rewardCurrency.name}}
				</shimmer>
			</div>
			<div class="font-semibold text-lg col-span-1 flex items-center justify-center text-gray-600">
				{{ e.apy }}%
			</div>
			<div class="font-semibold col-span-2 flex items-center justify-center text-gray-600">
				<shimmer class="px-0 py-1" :loading="!staked_ready">
					<div>{{staked[i]?.receiptAmount}} {{staked[i]?.ticker}}</div>
				</shimmer>
			</div>
			<div class="font-semibold text-sm col-span-1 flex items-center flex-wrap justify-center">
				<button v-if="isConnected" :disabled="pending" class="rounded-full w-full px-3 py-2 bg-green-400 m-1
						transition-all duration-500 cursor-pointer hover:shadow-lg hover:shadow-green-800/20 select-none
						mx-auto text-white text-center disabled:bg-gray-200"
				        @click="withdrawButtonState.method[i]">
					<template v-if="pending">
						<spinner></spinner>
					</template>
					<template v-else>
						{{ withdrawButtonState.text[i] }}
					</template>
				</button>
				<button class="rounded-full px-3 py-2 bg-green-400 transition-all duration-500 cursor-pointer m-1
							hover:shadow-lg hover:shadow-green-800/20 select-none mx-auto text-white text-center
							disabled:bg-gray-200 w-full"
				        @click="stakeButtonState.method[i]">
					<template v-if="pending">
						<spinner></spinner>
					</template>
					<template v-else>
						{{ stakeButtonState.text[i] }}
					</template>
				</button>
			</div>
		</template>
	</div>

	<!--mobile-->
	<div
		class="col-span-full lg:hidden w-full flex drop-shadow-xl flex-col justify-center items-center">
		<template v-for="(e, i) of stackable" :key="i">
			<!--card-->
			<div class="bg-gray-50 rounded-[3rem] my-2 px-6 py-10 shadow-lg w-11/12 mx-auto">
				<!--upper-->
				<div class="flex justify-around">
					<!--col sx-->
					<div class="flex flex-col items-center justify-between">
						<!--				logo-->
						<div class="flex self-start items-center justify-start relative">
							<img :src="e.baseCurrency.picture" :alt="e.baseCurrency.name"
							     class="h-20 w-20 object-contain">
							<img :src="e.rewardCurrency.picture" :alt="e.rewardCurrency.name"
							     class="h-10 w-10 object-contain absolute rounded-full bg-orange-400 -top-2
							        left-5-translate-x-1/2 p-1">

							<div class="flex flex-col"
							     v-tippy="{content:`Stake ${e.baseCurrency.name} | Earn ${e.rewardCurrency.name}`}">
								<h4 class="font-semibold flex items-center"
								    :title="`Stake ${e.baseCurrency.name}`">
									<i class='bx bxs-coin-stack mr-2'></i>
									{{ e.baseCurrency.name }}
								</h4>
								<h4 class="font-semibold text-xs text-gray-600 flex items-center"
								    :title="`Earn ${e.rewardCurrency.name}`">
									<i class='bx bxs-coin mr-2 mt-auto'></i>
									{{ e.rewardCurrency.name }}
								</h4>
							</div>
						</div>
						<!--					historical data-->
						<div class="flex flex-col mt-4">
							<div class="self-start font-light text-sm text-center">
								Your earnings
							</div>
							<div class="font-semibold text-gray-600 flex items-center justify-center">
								<shimmer class="px-0 py-1" :loading="!staked_ready">
									~ {{estimatedEarnings[i]}} {{e.rewardCurrency.name}}
								</shimmer>
							</div>
						</div>
					</div>
					<!--col dx-->
					<div class="flex flex-col justify-between">
						<!--stonks or not-->
						<div class="relative self-end flex flex-col h-20"
						     :class="!price_loaded ? 'items-center justify-center' : ''">
							<template v-if="price_loaded">
								<img v-if="isMeldVariationPositive" :src="arrow" alt="arrow"
								     class="object-fill left-0 top-0 scale-150 -translate-x-14 absolute translate-y-3">
								<img v-else :src="arrow_down" alt="arrow"
								     class="object-fill left-0 top-0 scale-150 -translate-x-14 absolute translate-y-3">

								<div class="font-light mx-auto pl-2">{{ gmeldPrice }} $</div>
								<div class="text-xs mx-auto pl-2" :class="dailyPriceVariationClasses">
									{{ isMeldVariationPositive ? "+" : "" }}{{ gmeldDailyVariation }} %
								</div>
							</template>
							<shimmer class="px-0 py-1" v-else text="" :loading="!price_loaded"></shimmer>
						</div>
						<!--aby-->
						<div class="flex flex-col mt-4">
							<div class="font-light text-sm text-left">
								APY
							</div>
							<div
								class="font-semibold text-lg flex items-center justify-stert text-gray-600">
								{{ e.apy }}%
							</div>
						</div>

						<!--deposited-->
						<div class="flex flex-col mt-4">
							<div class="font-light text-sm text-center self-start">
								Deposit
							</div>
							<div class="font-semibold text-gray-600 flex items-center justify-center">
								<shimmer class="px-0 py-1" :loading="!staked_ready">
									<div>{{staked[i]?.receiptAmount}} {{staked[i]?.ticker}}</div>
								</shimmer>
							</div>
						</div>
					</div>
				</div>
				<!--action buttons-->
				<div class="font-semibold flex items-center justify-center mt-10">
					<button v-if="isConnected" :disabled="pending" class="rounded-full px-3 py-2 bg-green-400 ml-auto
						transition-all duration-500 cursor-pointer hover:shadow-lg hover:shadow-green-800/20 select-none
						mx-auto text-white text-center hover:shadow-lg disabled:bg-gray-200 mr-4"
					        @click="withdrawButtonState.method[i]">
						<template v-if="pending">
							<spinner></spinner>
						</template>
						<template v-else>
							{{ withdrawButtonState.text[i] }}
						</template>
					</button>
					<!--<button class="rounded-full px-3 py-2 bg-green-400 transition-all duration-500 cursor-pointer mr-auto
								hover:shadow-lg hover:shadow-green-800/20 select-none mx-auto text-white text-center ml-4
								disabled:bg-gray-200"
					        @click="stakeButtonState.method[i]">
						<template v-if="pending">
							<spinner></spinner>
						</template>
						<template v-else>
							{{ stakeButtonState.text[i] }}
						</template>
					</button>-->
				</div>
			</div>
		</template>
	</div>
</template>

<script lang="ts">
import {Stackable, Staked} from "@/composition/staking/types";

const arrow = "/assets/images/arrow.svg"
const arrow_down = "/assets/images/arrow-down.svg"
import {defineComponent} from "vue";
import Shimmer from "@/components/shimmer.vue";
import Spinner from "@/components/spinner.vue";
import {directive, Tippy} from 'vue-tippy'
import {renderNumber} from "@/composition/strings";

export default defineComponent({
	name: "StackableItem",
	components: {Spinner, Shimmer, Tippy},
	directives: {
		tippy: directive,
	},
	props: {
		pending: {
			type: Boolean,
			required: true,
		},
		stackable: {
			type: Array,
			required: true,
		},
		price_loaded: {
			type: Boolean,
			required: true,
		},
		isMeldVariationPositive: {
			type: Boolean,
			required: true,
		},
		staked_ready: {
			type: Boolean,
			required: true,
		},
		gmeldPrice: {
			type: String,
			required: true,
		},
		gmeldDailyVariation: {
			type: String,
			required: true,
		},
		staked: {
			type: Object,
			required: true,
		},
		isConnected: {
			type: Boolean,
			required: true,
		},
		withdrawButtonState: {
			type: Object,
			required: true,
		},
		stakeButtonState: {
			type: Object,
			required: true,
		},
	},
	emits: ['connectWallet', ''],
	data: () => ({
		arrow,
		arrow_down,
	}),
	computed: {
		dailyPriceVariationClasses() {
			return this.isMeldVariationPositive ? "text-green-400" : "text-red-400"
		},
		estimatedEarnings() {
			return this.stackable.map((v, i) => {
				return (+renderNumber(((v as Stackable).receiptValue)).replaceAll(",", "") *
					+(this.staked[i] as Staked).receiptAmount.replaceAll(",", "")).toFixed(6)
			})
		}
	},
	created() {
	}
})
</script>

<style scoped>

</style>
