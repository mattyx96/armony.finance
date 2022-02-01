<!--
  - Copyright (C) 2022 Do inc. - All Rights Reserved
  - Unauthorized copying of this file, via any medium is strictly prohibited
  - Proprietary and confidential
  - Written by Emanuele (ebalo) Balsamo <emanuele.balsamo@do-inc.co>
  -->

<template>
	<div class="flex flex-col">
		<div class="px-12 md:px-32 py-24 grid grid-cols-1 md:grid-cols-2">
			<div>
				<h1 class="text-6xl xl:mt-4 font-bold text-[#19191B]">
					Armony
					<br>
					staking
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
			<div class="flex flex-col font-semibold bg-gradient-to-bl from-[#414A65] to-[#5A4663]
			    backdrop-filter backdrop-blur py-8 px-4 md:py-8 md:px-4 xl:p-12 w-full xl:w-8/12 mx-auto rounded-[3rem]
			    text-white mt-8 md:mt-0font-poppins shadow-lg">
				<p class="text-center text-lg">Total interest earned to date</p>
				<div class="border-2 py-3 px-6 pt-10 rounded-[2rem] border-gray-400 flex flex-col justify-center
				        items-start mt-6">
					<p class="text-[#47D680] font-semibold text-5xl">$6,000.00</p>
					<span class="self-end font-semibold">MELD</span>
				</div>
				<a class="rounded-full h-12 w-full text-gray-700 flex justify-center items-center bg-white
					   transition-all duration-300 cursor-pointer mt-6
					   select-none whitespace-nowrap mx-0.5 px-4">
					View balances
				</a>
			</div>
		</div>
		<div class="bg-gradient-to-br to-[#947B9E33] from-[#7989B533] min-h-[32rem] py-12 px-2 md:px-32 text-gray-800">
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
				<template v-if="stackable.length === 0">
					<div v-for="(e, i) of Array.from({length: 3}, (v, k) => k)" :key="i"
					     class="bg-gray-50 rounded-xl col-span-9 my-2 grid grid-cols-9 p-4">
						<div class="font-semibold col-span-3 grid grid-cols-3 gap-2">
							<div class="flex items-center justify-center relative">
								<shimmer text="" :loading="stackable.length === 0"
								         class="h-16 w-16 rounded-full"></shimmer>
								<shimmer text="" :loading="stackable.length === 0"
								         class="h-8 w-8 absolute rounded-full -top-2 left-1/3 -translate-x-1/2"></shimmer>
							</div>
							<div class="flex flex-col items-center justify-center">
								<shimmer text="" :loading="stackable.length === 0"></shimmer>
							</div>
							<div class="relative flex flex-col items-center justify-center">
								<shimmer text="" :loading="stackable.length === 0" class="font-light mx-auto"></shimmer>
							</div>
						</div>
						<div class="font-semibold col-span-2 text-gray-600 flex items-center justify-center">
							<shimmer :loading="stackable.length === 0" text=""></shimmer>
						</div>
						<div class="font-semibold text-lg col-span-1 flex items-center justify-center text-gray-600">
							<shimmer :loading="stackable.length === 0" text=""></shimmer>
						</div>
						<div class="font-semibold col-span-2 flex items-center justify-center text-gray-600">
							<shimmer :loading="stackable.length === 0" text=""></shimmer>
						</div>
						<div class="font-semibold col-span-1"></div>
					</div>
				</template>
				<div v-else class="bg-gray-50 rounded-xl col-span-9 my-2 grid grid-cols-9 p-4">
					<template v-for="(e, i) of stackable" :key="i">
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
							<template v-if="!staked_ready || staked[i]?.earnings !== undefined">
								<shimmer :loading="!staked_ready"
								         :text="`${staked[i]?.earnings} ${e.rewardCurrency.name}`"></shimmer>
							</template>
							<template v-else>
								Historical data not found
							</template>
						</div>
						<div class="font-semibold text-lg col-span-1 flex items-center justify-center text-gray-600">
							{{ e.apy }}%
						</div>
						<div class="font-semibold col-span-2 flex items-center justify-center text-gray-600">
							<shimmer :loading="!staked_ready"
							         :text="`${staked[i]?.receiptAmount} ${staked[i]?.ticker}`"></shimmer>
						</div>
						<div class="font-semibold col-span-1 flex items-center justify-center">
							<div class="rounded-lg px-3 py-2 bg-green-400 transition-all duration-500 cursor-pointer
								hover:shadow-lg hover:shadow-green-800/20 select-none"
							     @click="stakeButtonState.method[i]">
								{{ stakeButtonState.text[i] }}
							</div>
						</div>
					</template>
				</div>
			</div>
		</div>
		<modal-staking-deposit v-model:open="depositModal.isOpen"></modal-staking-deposit>

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
import arrow_down from "@/assets/images/arrow-down.svg"
import Shimmer from "components/shimmer.vue";
import Toaster from "composition/toaster";
import Modal from "components/Overlay/Modal.vue";
import ModalStakingDeposit from "components/Overlay/ModalStakingDeposit.vue";

export default defineComponent({
	name: "index",
	components: {ModalStakingDeposit, Modal, Shimmer, TransactionOverlay},
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
		arrow_down,
		staked_ready: false,
		staked: [] as Staked[],
		price_loaded: false,
		gmeldPrice: "",
		gmeldDailyVariation: "",
		isMeldVariationPositive: true,
		depositModal: {
			isOpen: true
		}
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
		async approve(id: number) {
			console.log(id)
			await WorkerController.init().workAsync(async () => {
				await Staking.init()
					.watchTransactionStart(() => {
						this.overlay.confirmations = this.overlay.time = 0
						this.overlay.open = true
					})
					.watchIsReadyTransactionHash(tx => this.overlay.tx = tx)
					.watchTransactionConfirmed(() => {
						// transaction confirmed
						this.overlay.open = false
						this.staked[id].allowance = BigInt(`1${"0".repeat(70)}`)
						// send a notification stating a successful transaction
						new Toaster({
							title: `Staking contract approved!`,
							message: `You have successfully approved this staking contract.`,
							type: "success"
						})
					})
					.watchTransactionError(err => {
						this.overlay.open = false
						new Toaster(err)
					})
					.approveStake(id)
			})
		}
	},
	computed: {
		bestAPY() {
			return this.stackable.length > 0 ? this.stackable.reduce((previousValue, currentValue) => {
				return +previousValue.apy > +currentValue.apy ? previousValue : currentValue
			}).apy : "0.00"
		},
		dailyPriceVariationClasses() {
			return this.isMeldVariationPositive ? "text-green-400" : "text-red-400"
		},
		isStakeApproved() {
			return this.staked.map(v => v.allowance >= BigInt(`1${"0".repeat(40)}`))
		},
		stakeButtonState() {
			return {
				text: this.stackable.map((value, index) => {
					return this.pending ? "Pending ..." : (
						this.isConnected ? (
							this.isStakeApproved[index] ? "Deposit" : "Approve"
						) : "Connect wallet"
					)
				}),
				method: this.stackable.map((value, index) => {
					return this.pending ? () => false : (
						this.isConnected ? (
							this.isStakeApproved[index] ? () => {

							} : () => {
								this.approve(index)
							}
						) : () => {
							Provider.init().connectWallet()
						}
					)
				})
			}
		}
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
		Staking.init().onPriceDataLoaded.subscribe(({price, dailyChange}) => {
			this.price_loaded = true

			this.gmeldPrice = price.toFixed(2)
			this.gmeldDailyVariation = dailyChange.toFixed(2)
			this.isMeldVariationPositive = dailyChange >= 0
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
