<!--
  - Copyright (C) 2022 Do inc. - All Rights Reserved
  - Unauthorized copying of this file, via any medium is strictly prohibited
  - Proprietary and confidential
  - Written by Emanuele (ebalo) Balsamo <emanuele.balsamo@do-inc.co>
  -->

<template>
	<div class="flex flex-col text-white font-poppins">
		<!--above the fold-->
		<div class="grid grid-cols-1 md:grid-cols-2 px-4 md:px-32 py-24 container mx-auto">
			<div>
				<h1 class="text-5xl font-bold text-[#19191B] text-center md:text-left">
					$MELD <br/> Wrapper
				</h1>
				<h3 class="text-lg text-center md:text-left font-light mt-8 text-[#696871]">
					Empower your $MELD, migrate to $gMELD.
					<br>
					Stake, buy, exchange, play & earn with $gMELD
				</h3>
			</div>
			<div class="flex flex-col items-center justify-center text-gray-800 font-semibold mt-10 md:mt-0">
				<h4 class="text-xl">1.00 $MELD</h4>
				<p>=</p>
				<h4 class="text-xl">1.00 $gMELD</h4>
				<small class="font-bold">Forever</small>
			</div>
		</div>
		<!--pink bg-->
		<div class="bg-gradient-to-b from-[#BCADFF] to-[#FF40FF] m-4 md:mx-10 lg:mx-32 rounded-[4rem] p-2">
			<div class="grid grid-cols-4 xl:grid-cols-8 min-h-[32rem] px-4 md:px-32 py-24 container mx-auto">
				<!--card-->
				<div class="xl:col-start-3 col-span-4 flex flex-col px-6 py-8 bg-gradient-to-bl from-[#414A65] to-[#5A4663]
			    backdrop-filter backdrop-blur rounded-[3.5rem] md:rounded-[4.5rem]">
					<div class="flex justify-between w-4/5 mx-auto">
						<label class="font-semibold" for="meld_amount">
							$MELD
						</label>
						<small>
							Max {{ max_meld }} $MELD
						</small>
					</div>
					<div class="flex items-center rounded-[1.8rem] px-2 py-2 mx-auto w-full md:w-11/12 border-2
							border-[#c5c5ff] ">
						<small class="ml-4"></small>
						<input id="meld_amount" v-model="meld" placeholder="0.00"
						       class="truncate w-full bg-gray-700 rounded-lg outline-none py-2 px-1 font-semibold
						        text-2xl text-[#00DB76]"
						       v-cleave="meld_cleave">
						<div class="bg-gray-700 text-white rounded-lg text-sm mr-4 ml-3 px-2 py-1 cursor-pointer"
						     @click="insertMaxMeld">
							Max
						</div>
					</div>
					<div class="flex items-center justify-center my-3">
						<div class="rounded-full h-8 w-8 p-2 border-2 border-white flex items-center justify-center
								text-xl bg-gray-50/50">
							<i class="fas fa-chevron-down"></i>
						</div>
					</div>
					<label class="ml-8 font-semibold" for="gmeld_amount">
						$gMELD
					</label>
					<div class="flex items-center rounded-[1.8rem] mx-auto w-full md:w-11/12 border-2 border-[#c5c5ff]
							px-2 py-1">
						<input id="gmeld_amount"
						       class="truncate w-full bg-transparent outline-none py-3 px-1 text-2xl text-[#00DB76]
					        font-semibold ml-5"
						       readonly :value="meld" placeholder="0.00">
					</div>
					<button class="text-center px-6 mx-auto font-semibold bg-[#00DB76] rounded-xl py-2 mt-4 cursor-pointer
						disabled:bg-gray-200"
					        :disabled="pending"
					        @click="actionButton.action">
						<template v-if="pending">
							<spinner></spinner>
						</template>
						<template v-else>
							{{ actionButton.text }}
						</template>
					</button>
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
import {ethers} from "ethers";
import {ContractTypes} from "composition/provider/types";
import {Provider} from "composition/provider";
import {Address} from "composition/address";
import {renderNumber} from "composition/strings";
import TransactionOverlay from "components/Overlay/TransactionOverlay.vue"
import Toaster from "composition/toaster";
import {WorkerController} from "composition/workerController";
import Spinner from "components/spinner.vue";


export default defineComponent({
	name: "wrapper",
	components: {
		TransactionOverlay, Spinner
	},
	data: () => ({
		governance: {} as ethers.Contract,
		melodity: {} as ethers.Contract,
		isConnected: Address.init().isConnected,
		connectedAs: Address.init().connectedAs,
		approved: false,
		max_meld: "0.00",
		meld: "",
		overlay: {
			open: false,
			confirmations: 0,
			tx: "",
			time: 0,
			interval: -1
		},
		pending: false,
		meld_cleave: {
			numeral: true,
			numeralDecimalScale: 18
		},
	}),
	methods: {
		insertMaxMeld() {
			this.meld = this.max_meld
		},
		async load() {
			await WorkerController.init().workAsync(async () => {
				let result = await Provider.init().loadContract(ContractTypes.melodityGovernance)
				if (result) {
					this.governance = result
				}
				result = await Provider.init().loadContract(ContractTypes.melodity)
				if (result) {
					this.melodity = result
				}

				if (this.isConnected) {
					let amount = await this.melodity.balanceOf(this.connectedAs)
					this.max_meld = renderNumber(amount, 18, 18)

					let allowance = "0",
						required = `1${"0".repeat(40)}`

					allowance = (await this.melodity.allowance(this.connectedAs, this.governance.address)).toString()

					this.approved = BigInt(allowance) >= BigInt(required)
				}
			})
		},
		async wrap() {
			await WorkerController.init().workAsync(async () => {
				// parse the number
				let [integer, decimal] = this.meld.split(".")
				integer = integer.replaceAll(",", "")
				if (decimal) {
					decimal = decimal.padEnd(18, "0")
				}

				let amount = `${integer}${decimal ?? ""}`

				this.overlay.confirmations = this.overlay.time = 0
				this.overlay.open = true
				try {
					let tx: ethers.providers.TransactionResponse = await this.governance.wrap(amount)
					this.overlay.tx = tx.hash
					let receipt: ethers.providers.TransactionReceipt = await tx.wait()

					// transaction confirmed
					this.overlay.open = false
					// send a notification stating a successful transaction
					new Toaster({
						title: `Wrap completed!`,
						message: `You have successfully wrapped ${this.meld} $MELD to ${this.meld} $gMELD.`,
						type: "success"
					})

					let [integer, decimal] = this.max_meld.split(".")
					integer = integer.replaceAll(",", "")
					if (decimal) {
						decimal = decimal.padEnd(18, "0")
					}
					let max_amount = `${integer}${decimal ?? ""}`
					this.max_meld = renderNumber(max_amount)
					this.meld = ""
				} catch (e: any) {
					this.overlay.open = false
					// an error occurred, show an error message and go on
					new Toaster({
						code: `${e.code}.${e?.data?.code || 0}`,
						message: `${e.message.replace(".", "")}${e?.data?.message !== undefined ? `: ${e.data.message}` : ""}`,
					})
				}
			})
		},
		async approve() {
			await WorkerController.init().workAsync(async () => {
				let amount = `1${"0".repeat(70)}`

				this.overlay.confirmations = this.overlay.time = 0
				this.overlay.open = true
				try {
					let tx: ethers.providers.TransactionResponse = await this.melodity.approve(this.governance.address, amount)
					this.overlay.tx = tx.hash
					let receipt: ethers.providers.TransactionReceipt = await tx.wait()

					// transaction confirmed
					this.overlay.open = false
					// send a notification stating a successful transaction
					new Toaster({
						title: `Wrapper approved!`,
						message: `You have successfully approved the wrapper.`,
						type: "success"
					})
					this.approved = true
				} catch (e: any) {
					this.overlay.open = false
					// an error occurred, show an error message and go on
					new Toaster({
						code: `${e.code}.${e?.data?.code || 0}`,
						message: `${e.message.replace(".", "")}${e?.data?.message !== undefined ? `: ${e.data.message}` : ""}`,
					})
				}
			})
		},
	},
	computed: {
		actionButton() {
			return {
				action: this.pending ?
					() => false :
					(!this.isConnected ?
							() => {
								Provider.init().connectWallet()
							} :
							(
								this.approved ?
									this.wrap :
									this.approve
							)
					),
				text: this.pending ?
					"Pending ..." :
					(
						!this.isConnected ?
							"Connect wallet" :
							(
								this.approved ?
									"Wrap" :
									"Approve"
							)
					)
			}
		}
	},
	created() {
		Address.init().watchAddress((v: string): void => {
			this.connectedAs = !!v ? v : false
			this.isConnected = !!v

			this.load()
		})
		WorkerController.init().watchState(
			() => this.pending = true,
			() => this.pending = false
		)
		try {
			this.load()
		} catch (e) {
		}
	}
})
</script>

<style scoped>

</style>
