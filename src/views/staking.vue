<!--
  - Copyright (C) 2022 Do inc. - All Rights Reserved
  - Unauthorized copying of this file, via any medium is strictly prohibited
  - Proprietary and confidential
  - Written by Emanuele (ebalo) Balsamo <emanuele.balsamo@do-inc.co>
  -->

<template>
	<div class="flex flex-col overflow-hidden">
		<div class="w-full bg-gradient-to-br to-[#F9F7FA] from-[#F4F5F9] ">
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
						<shimmer :loading="!staking_ready" :text="`${bestAPY} %`"></shimmer>
						<span>
							APY on your stacked cryptocurrencies!
						</span>
						<br>
						<br>
						<span>
							Totally locked value
							<shimmer :loading="!tvl_ready" :text="`${tvl} USD`"></shimmer>
						</span>
					</h3>
				</div>
				<div class="flex justify-center items-start md:items-center">
					<img class="translate-x-7 translate-y-3/4 md:translate-y-0 md:translate-x-0 scale-150 md:scale-100"
					     src="@/assets/images/staking.png" alt="Armony Finance Stacking"
					/>
				</div>
			</div>
		</div>
		<div class="min-h-[32rem] py-12 px-2 md:px-32 text-gray-800">
			<div class="grid grid-cols-9 container mx-auto">
				<div class="hidden lg:contents col-span-9 grid grid-cols-9 px-4">
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
						Deposit
					</div>
				</div>
				<template v-if="stackable.length === 0">
					<shimmer-stacking-items/>
				</template>
				<template v-else>
					<stackable-item
						:pending="pending"
						:gmeld-daily-variation="gmeldDailyVariation"
						:is-connected="isConnected"
						:gmeld-price="gmeldPrice"
						:is-meld-variation-positive="isMeldVariationPositive"
						:price_loaded="price_loaded"
						:stackable="stackable"
						:staked_ready="staked_ready"
						:staked="staked"
						:stake-button-state="stakeButtonState"
						:withdraw-button-state="withdrawButtonState"
					/>
				</template>
			</div>
		</div>
		<modal-staking-deposit v-model:open="depositModal.isOpen"
		                       :base-currency-contract-address="depositModal.baseCurrencyContractAddress"
		                       :base-currency-ticker="depositModal.ticker"
		                       :stake-contract-address="depositModal.stakeContractAddress"
		></modal-staking-deposit>
		<modal-staking-withdraw v-model:open="withdrawModal.isOpen"
		                        :receipt-contract-address="withdrawModal.receiptContractAddress"
		                        :receipt-ticker="withdrawModal.receiptTicker"
		                        :stake-contract-address="withdrawModal.stakeContractAddress">
		</modal-staking-withdraw>

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
import TransactionOverlay from "@/components/Overlay/TransactionOverlay.vue";
import {Address} from "@/composition/address";
import {WorkerController} from "@/composition/workerController";
import {ethers} from "ethers";
import {Provider} from "@/composition/provider";
import {ContractTypes} from "@/composition/provider/types";
import {renderNumber} from "@/composition/strings";
import {Stackable, Staked} from "@/composition/staking/types";
import {Staking} from "@/composition/staking";
import Shimmer from "@/components/shimmer.vue";
import Toaster from "@/composition/toaster";
import Modal from "@/components/Overlay/Modal.vue";
import ModalStakingDeposit from "@/components/Overlay/ModalStakingDeposit.vue";
import ModalStakingWithdraw from "@/components/Overlay/ModalStakingWithdraw.vue";
import ShimmerStackingItems from "@/components/ShimmerStackableItems.vue";
import StackableItem from "@/components/StackableItem.vue";
import {Tippy} from 'vue-tippy'
import Overlay from "@/components/Overlay/Overlay.vue";

const arrow = require("../assets/images/arrow.svg")
const arrow_down = require("../assets/images/arrow-down.svg")

export default defineComponent({
	name: "index",
	components: {
		Overlay,
		StackableItem,
		ShimmerStackingItems,
    ModalStakingWithdraw,
    ModalStakingDeposit,
    Modal,
    Shimmer,
    TransactionOverlay,
    Tippy
	},
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
			isOpen: false,
			baseCurrencyContractAddress: "",
			ticker: "",
			stakeContractAddress: "",
		},
		withdrawModal: {
			isOpen: false,
			receiptContractAddress: "",
			receiptTicker: "",
			stakeContractAddress: "",
		},
		tvl_ready: false,
		tvl_amount: "",
		tvl: "",
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
							title: `Deposit approved!`,
							message: `You have successfully approved deposits to this staking contract.`,
							type: "success"
						})
					})
					.watchTransactionError(err => {
						this.overlay.open = false
						new Toaster(err)
					})
					.approveStakeDeposit(id)
			})
		},
		deposit(id: number) {
			this.depositModal.baseCurrencyContractAddress = this.stackable[id].baseCurrency.contract
			this.depositModal.ticker = this.stackable[id].baseCurrency.name
			this.depositModal.stakeContractAddress = this.stackable[id].contract.address
			this.depositModal.isOpen = true
		},
		withdraw(id: number) {
			this.withdrawModal.receiptContractAddress = this.staked[id].contract.address
			this.withdrawModal.receiptTicker = this.staked[id].ticker
			this.withdrawModal.stakeContractAddress = this.stackable[id].contract.address
			this.withdrawModal.isOpen = true
		},
		async approveWithdraw(id: number) {
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
						this.staked[id].withdrawAllowance = BigInt(`1${"0".repeat(70)}`)

						// send a notification stating a successful transaction
						new Toaster({
							title: `Withdraw approved!`,
							message: `You have successfully approved withdrawn from this staking contract.`,
							type: "success"
						})
					})
					.watchTransactionError(err => {
						this.overlay.open = false
						new Toaster(err)
					})
					.approveStakeWithdraw(id)
			})
		},
		async computeTvl() {
			let contract;
			for (let elem of this.stackable) {
				contract = await Provider.init().loadCustomContract(ContractTypes.stackingReceipt, elem.rewardCurrency.contract)
				if(contract) {
					let balance = await contract.balanceOf(elem.contract.address)
					let reward_pool = (await elem.contract.poolInfo())["rewardPool"]

					let amount = (+renderNumber(balance).replaceAll(",", "") -
						+renderNumber(reward_pool).replaceAll(",", "")).toFixed(6)

					this.tvl_amount = (+this.tvl + +amount).toFixed(6)
				}
			}

			if(this.gmeldPrice) {
				this.tvl = (+this.tvl_amount * +this.gmeldPrice).toFixed(6)
				this.tvl_ready = true
			}
		}
	},
	computed: {
		bestAPY() {
			return this.stackable.length > 0 ? this.stackable.reduce((previousValue, currentValue) => {
				return +previousValue.apy > +currentValue.apy ? previousValue : currentValue
			}).apy : "0.00"
		},
		isStakeApproved() {
			return this.staked.map(v => v.allowance >= BigInt(`1${"0".repeat(40)}`))
		},
		isWithdrawApproved() {
			return this.staked.map(v => v.withdrawAllowance >= BigInt(`1${"0".repeat(40)}`))
		},
		stakeButtonState() {
			return {
				text: this.stackable.map((value, index) => {
					return this.pending ? "Pending ..." : (
						this.isConnected ? (
							this.isStakeApproved[index] ? "Deposit" : "Deposit"
						) : "Connect wallet"
					)
				}),
				method: this.stackable.map((value, index) => {
					return this.pending ? () => false : (
						this.isConnected ? (
							this.isStakeApproved[index] ? () => {
								this.deposit(index)
							} : () => {
								this.approve(index)
							}
						) : () => {
							Provider.init().connectWallet()
						}
					)
				})
			}
		},
		withdrawButtonState() {
			return {
				text: this.stackable.map((value, index) => {
					return this.pending ? "Pending ..." : (
						this.isConnected ? (
							this.isWithdrawApproved[index] ? "Withdraw" : "Withdraw"
						) : "Connect wallet"
					)
				}),
				method: this.stackable.map((value, index) => {
					return this.pending ? () => false : (
						this.isConnected ? (
							this.isWithdrawApproved[index] ? () => {
								this.withdraw(index)
							} : () => {
								this.approveWithdraw(index)
							}
						) : () => {
							Provider.init().connectWallet()
						}
					)
				})
			}
		},
	},
	created() {
		Staking.init().onStackingReady.subscribe(() => {
			this.staking_ready = true
			this.stackable = Staking.init().stackable
			this.computeTvl()
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

			if(this.tvl_amount) {
				this.tvl = (+this.tvl_amount * +this.gmeldPrice).toFixed(6)
				this.tvl_ready = true
			}
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
