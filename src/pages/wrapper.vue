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
					$MELD Wrapper
				</h1>
				<h3 class="text-lg font-light mt-8 text-[#696871]">
					Empower your $MELD, migrate to $gMELD.
					<br>
					Stake, buy, exchange, play & earn with $gMELD
				</h3>
			</div>
			<div class="flex flex-col items-center justify-center font-semibold">
				<h4 class="text-xl">1.00 $MELD</h4>
				<p>=</p>
				<h4 class="text-xl">1.00 $gMELD</h4>
				<small class="font-bold">Forever</small>
			</div>
		</div>
		<div class="bg-gradient-to-br to-[#947B9E33] from-[#7989B533] min-h-[32rem] py-12 px-32">
			<div class="grid grid-cols-8">
				<div class="col-start-4 col-span-2 bg-purple-200 rounded-lg flex flex-col px-6 py-8">
					<label for="meld_amount">
						MELD
					</label>
					<small class="ml-auto">
						Max {{ max_meld }} $MELD
					</small>
					<div class="flex items-center rounded-md w-full bg-blue-300 p-2">
						<small class="ml-auto"></small>
						<input id="meld_amount" v-model="meld" placeholder="0.00"
						       class="truncate w-full bg-transparent outline-none py-2 px-1">
						<div class="bg-[#5A4663] text-white rounded-sm text-sm ml-3 px-2 py-1 cursor-pointer"
						     @click="insertMaxMeld">
							Max
						</div>
					</div>
					<div class="flex items-center justify-center my-6">
						<div class="rounded-full h-10 w-10 p-2 bg-blue-300 flex items-center justify-center text-3xl">
							<i class='bx bx-chevron-down'></i>
						</div>
					</div>
					<label for="gmeld_amount">
						gMELD
					</label>
					<div class="flex items-center rounded-md w-full bg-blue-300 p-2">
						<input id="gmeld_amount" class="truncate w-full bg-transparent outline-none py-2 px-1"
						       readonly :value="meld" placeholder="0.00">
					</div>
					<div class="text-center font-semibold bg-purple-400 rounded-lg p-2 mt-4 cursor-pointer"
					     @click="actionButton.action">
						{{ actionButton.text }}
					</div>
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


export default defineComponent({
	name: "wrapper",
	components: {
		TransactionOverlay
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
	}),
	methods: {
		insertMaxMeld() {
			this.meld = this.max_meld
		},
		async load() {
			await WorkerController.init().workAsync(async () => {
				if (Object.keys(this.governance).length === 0) {
					let result = await Provider.init().loadContract(ContractTypes.melodityGovernance)
					if (result) {
						this.governance = result
					}
				}
				if (Object.keys(this.melodity).length === 0) {
					let result = await Provider.init().loadContract(ContractTypes.melodity)
					if (result) {
						this.melodity = result
					}
				}

				let amount = await this.melodity.balanceOf(this.connectedAs)
				this.max_meld = renderNumber(amount, 18, 18)

				let allowance = "0",
					required = `1${"0".repeat(40)}`
				if (this.isConnected) {
					allowance = (await this.melodity.allowance(this.connectedAs, this.governance.address)).toString()
				}
				this.approved = BigInt(allowance) >= BigInt(required)
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
						code: `${e.code}.${e.data.code}`,
						message: `${e.message.replace(".", "")}: ${e.data.message}`,
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
				} catch (e: any) {
					this.overlay.open = false
					// an error occurred, show an error message and go on
					new Toaster({
						code: `${e.code}.${e.data.code}`,
						message: `${e.message.replace(".", "")}: ${e.data.message}`,
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
	async created() {
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