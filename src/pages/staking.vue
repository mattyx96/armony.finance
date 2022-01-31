<!--
  - Copyright (C) 2022 Do inc. - All Rights Reserved
  - Unauthorized copying of this file, via any medium is strictly prohibited
  - Proprietary and confidential
  - Written by Emanuele (ebalo) Balsamo <emanuele.balsamo@do-inc.co>
  -->

<template>
	<div class="flex flex-col">
		<div class="px-32 py-24 grid grid-cols-2">
			<div>
				<h1 class="text-5xl font-bold text-[#19191B]">
					Armony staking
				</h1>
				<h3 class="text-lg font-light mt-8 text-[#696871]">
					<span class="no">
						Put your crypto at work.
						<br>
						With Armony you receive up to
					</span>
					<shimmer :loading="!staking_ready" :text="`${bestAPY} %`"></shimmer>
					<span>
						APY on your stacked cryptocurrencies!
					</span>
				</h3>
			</div>
			<div class="flex flex-col items-center justify-center font-semibold">
				TODO
			</div>
		</div>
		<div class="bg-gradient-to-br to-[#947B9E33] from-[#7989B533] min-h-[32rem] py-12 px-32">
			<div class="grid grid-cols-9 border">
				<div class="col-span-9 grid grid-cols-9 px-4">
					<div class="font-semibold text-sm col-span-3 text-center">
						Crypto
					</div>
					<div class="font-semibold text-sm col-span-2 text-center">
						Your earnings
					</div>
					<div class="font-semibold text-sm col-span-1 text-center">
						APY
					</div>
					<div class="font-semibold text-sm col-span-2 text-center">
						Deposited
					</div>
					<div class="font-semibold text-sm col-span-1 text-center"></div>
				</div>
				<div v-for="(e, i) of stackable" :key="i"
				     class="bg-gray-50 rounded-xl col-span-9 my-2 grid grid-cols-9 p-4">
					<div class="font-semibold col-span-3 grid grid-cols-3 gap-2">
						<div class="flex items-center justify-center relative">
							<img :src="e.baseCurrency.picture" :alt="e.baseCurrency.name"
							     class="h-16 w-16 object-contain">
							<img :src="e.rewardCurrency.picture" :alt="e.rewardCurrency.name"
							     class="h-8 w-8 object-contain absolute rounded-full bg-orange-400 -top-2 left-1/3
									-translate-x-1/2 p-1">
						</div>
						<div class="flex flex-col justify-center">
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
						<div class="relative">
							<img :src="arrow" alt="arrow" class="object-contain left-0 bottom-0 absolute">
						</div>
					</div>
					<div class="font-semibold col-span-2 text-gray-600 flex items-center justify-center">
						<template v-if="!staked_ready || staked[i]?.earnings !== undefined">
							<shimmer :loading="!staked_ready"
							         :text="`${staked[i]?.earnings} ${e.rewardCurrency.name}`"></shimmer>
						</template>
						<template v-else>
							Historical values not found
						</template>
					</div>
					<div class="font-semibold text-lg col-span-1 flex items-center justify-center text-gray-600">
						{{ e.apy }}%
					</div>
					<div class="font-semibold col-span-2 flex items-center justify-center text-gray-600">
						<shimmer :loading="!staked_ready"
							:text="`${staked[i]?.receiptAmount} ${staked[i]?.ticker}`"></shimmer>
					</div>
					<div class="font-semibold col-span-1"></div>
				</div>
			</div>
		</div>

		<transaction-overlay
			v-bind="overlay"
			v-model:open="overlay.open"
			v-model:time="overlay.time"
			v-model:confirmations="overlay.confirmations"
		/>
	</div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import TransactionOverlay from "components/Overlay/TransactionOverlay.vue";
import {Address} from "composition/address";
import {WorkerController} from "composition/workerController";
import {ethers} from "ethers";
import {Provider} from "composition/provider";
import {ContractTypes} from "composition/provider/types";
import {renderNumber} from "composition/strings";
import {Stackable, Staked} from "composition/staking/types";
import {Staking} from "composition/staking";
import arrow from "@/assets/images/arrow.svg"
import Shimmer from "components/shimmer.vue";

export default defineComponent({
	name: "index",
	components: {Shimmer, TransactionOverlay},
	data: () => ({
		governance: {} as ethers.Contract,
		isConnected: Address.init().isConnected,
		connectedAs: Address.init().connectedAs,
		max_gmeld: "0.00",
		gmeld: "",
		approved: false,
		overlay: {
			open: false,
			confirmations: 0,
			tx: "",
			time: 0,
			interval: -1
		},
		pending: false,
		staking_ready: false,
		stackable: [] as Stackable[],
		arrow,
		staked_ready: false,
		staked: [] as Staked[],
	}),
	methods: {
		insertMaxMeld() {
			this.gmeld = this.max_gmeld
		},
		async load() {
			await WorkerController.init().workAsync(async () => {
				if (Object.keys(this.governance).length === 0) {
					let result = await Provider.init().loadContract(ContractTypes.melodityGovernance)
					if (result) {
						this.governance = result
					}
				}

				let amount = await this.governance.balanceOf(this.connectedAs)
				this.max_gmeld = renderNumber(amount, 18, 6)
			})
		},
	},
	computed: {
		bestAPY() {
			return this.stackable.length > 0 ? this.stackable.reduce((previousValue, currentValue) => {
				return +previousValue.apy > +currentValue.apy ? previousValue : currentValue
			}).apy : "0.00"
		},
	},
	async created() {
		Staking.init().onStackingReady.subscribe(() => {
			this.staking_ready = true
			this.stackable = Staking.init().stackable
		})
		Staking.init().onStackedDataReady.subscribe(() => {
			this.staked_ready = true
			this.staked = Staking.init().staked
		})
		Address.init().watchAddress((v: string): void => {
			this.connectedAs = !!v ? v : false
			this.isConnected = !!v


			this.load()
		})
		WorkerController.init().watchState(
			() => this.pending = true,
			() => this.pending = false
		)
	}
})
</script>

<style scoped>

</style>