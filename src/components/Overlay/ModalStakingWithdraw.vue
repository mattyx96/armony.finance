<!--
  - Copyright (C) 2022 Do inc. - All Rights Reserved
  - Unauthorized copying of this file, via any medium is strictly prohibited
  - Proprietary and confidential
  - Written by Emanuele (ebalo) Balsamo <emanuele.balsamo@do-inc.co>
  -->

<template>
	<modal :open="open" @update:open="close" size="md">
		<div class="grid grid-cols-2 h-12 rounded-t-lg border-b text-gray-800">
			<div class="flex items-center justify-center font-semibold text-lg transition-all duration-300
				cursor-pointer"
			     :class="selectedTabClasses.standard"
			     @click="switchDepositMode(false)">
				Plain withdraw
			</div>
			<div class="flex items-center justify-center font-semibold text-lg transition-all duration-300
				cursor-pointer"
			     :class="selectedTabClasses.withNFT"
			     @click="switchDepositMode(true)">
				Withdraw with NFT
			</div>
		</div>
		<div class="p-4 text-gray-800">
			<template v-if="!isNFTDeposit">
				<div class="flex flex-col">
					<div class="flex items-center justify-center">
						<label class="font-bold text-sm">Withdraw amount</label>
						<shimmer class="text-xs ml-auto" :loading="isLoadingMax">
							{{ max }} {{ receiptTicker }}
						</shimmer>
					</div>
					<div class="flex items-center justify-center p-1 mt-1">
						<input v-model="depositAmount" placeholder="0.00"
						       class="p-1 border rounded-md outline-none w-full">
						<div class="bg-[#5A4663] text-white rounded-sm text-sm ml-3 px-2 py-1 cursor-pointer"
						     @click="insertMax">
							Max
						</div>
					</div>
					<div class="mx-auto px-3 py-2 mt-4 rounded-bl-3xl rounded-tr-3xl border border-green-500 transition-all
						duration-300 cursor-pointer hover:shadow-lg hover:shadow-green-800/20 hover:bg-green-500"
					     @click="withdraw">
						Withdraw
					</div>
				</div>
			</template>
			<template v-else>
				<div class="flex flex-col">
					<div class="flex items-center justify-center">
						<label class="font-bold text-sm">Withdraw amount</label>
						<shimmer class="text-xs ml-auto" :loading="isLoadingMax">
							{{ max }} {{ receiptTicker }}
						</shimmer>
					</div>
					<div class="flex items-center justify-center p-1 mt-1">
						<input v-model="depositAmount" placeholder="0.00"
						       class="p-1 border rounded-md outline-none w-full">
						<div class="bg-[#5A4663] text-white rounded-sm text-sm ml-3 px-2 py-1 cursor-pointer"
						     @click="insertMax">
							Max
						</div>
					</div>
					<div class="flex flex-col mt-4">
						<label class="font-bold text-sm mb-2">
							Withdrawable NFTs
							<sup class="text-[0.6em]">1,2</sup>
						</label>
						<div class="flex flex-col">
							<div v-for="(e, i) of depositedNFTs" :key="i"
							     class="border rounded-md shadow shadow-blue-800/20 transition-all
									duration-300 p-2 w-full flex flex-col hover:shadow-lg">
								<div class="flex flex-col items-center justify-center">
									<div class="rounded-full h-32 w-32 mx-auto flex">
										<img :src="e.picUrl" :alt="`NFT #${e.nftId} pic`" class="object-contain m-auto">
									</div>
									<div class="capitalize mt-2 mb-4">
										{{ e.name }}
									</div>
									<div class="">
										yet to withdraw with this nft: {{ e.stackedAmount }}
									</div>
								</div>
							</div>
						</div>
					</div>
					<ol class="list-decimal list-inside text-sm text-gray-500 px-2 mt-3">
						<li>
							An NFT staked can be withdrawn only once all the receipt tokens received during the staking
							gets withdrawn, multiple small part withdrawn gets cumulated.
						</li>
						<li>
							NFT will be automatically withdrawn during the withdraw of receipts via this panel.
						</li>
					</ol>

					<div class="mx-auto px-3 py-2 mt-4 rounded-tl-3xl rounded-br-3xl border border-green-500 transition-all
						duration-300 cursor-pointer hover:shadow-lg hover:shadow-green-800/20 hover:bg-green-500"
					     @click="withdrawWithNFT">
						Withdraw
					</div>
				</div>
			</template>
		</div>

		<transaction-overlay
			v-bind="overlay"
			v-model:open="overlay.open"
			v-model:time="overlay.time"
			v-model:confirmations="overlay.confirmations"
		/>
	</modal>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import Modal from "components/Overlay/Modal.vue";
import Shimmer from "components/shimmer.vue";
import {ethers} from "ethers";
import {Provider} from "composition/provider";
import {ContractTypes} from "composition/provider/types";
import {renderNumber} from "composition/strings";
import {Address} from "composition/address";
import {StackingPanda, StakedNFT} from "composition/staking/types";
import {WorkerController} from "composition/workerController";
import Toaster from "composition/toaster";
import TransactionOverlay from "components/Overlay/TransactionOverlay.vue";

export default defineComponent({
	name: "ModalStakingWithdraw",
	components: {TransactionOverlay, Shimmer, Modal},
	emits: [
		"update:open",
		"receiptUpdate",
	],
	props: {
		open: {
			type: Boolean as PropType<boolean>,
		},
		receiptContractAddress: {
			type: String as PropType<string>,
			required: true
		},
		receiptTicker: {
			type: String as PropType<string>,
			required: true
		},
		stakeContractAddress: {
			type: String as PropType<string>,
			required: true
		}
	},
	data: () => ({
		isNFTDeposit: false,
		depositAmount: "",
		max: "",
		receipt: {} as ethers.Contract,
		stakingPanda: {} as ethers.Contract,
		stake: {} as ethers.Contract,
		depositedNFTs: [{
			nftId: 0,
			stackedAmount: "1.00",
			index: 0,
			name: "test-name",
			picUrl: "https://img.search.brave.com/UtPSCPZ_rFtwL0y2xGObk_PB8FR_ZxTCgFpMI66Sc30/rs:fit:1024:696:1/g:ce/aHR0cHM6Ly9ub3Rp/emlhaW50ZXJpc3Rh/Lml0L3dwLWNvbnRl/bnQvdXBsb2Fkcy8y/MDIwLzEwL2VyYmEt/Z2F0dGEtMTAyNHg2/OTYuanBn",
		}] as StakedNFT[],
		selectedNFT: -1,
		overlay: {
			open: false,
			confirmations: 0,
			tx: "",
			time: 0,
			interval: -1
		},
	}),
	methods: {
		close(ev: boolean) {
			this.$emit("update:open", ev)
		},
		switchDepositMode(withNFT: boolean) {
			this.isNFTDeposit = withNFT
		},
		insertMax() {
			this.depositAmount = this.max
		},
		async retrieveMax() {
			this.max = renderNumber(await this.receipt.balanceOf(Address.init().connectedAs))
		},
		async syncData() {
			let receipt = await Provider.init().loadCustomContract(ContractTypes.stackingReceipt, await this.stake.stackingReceipt())
			if(receipt) {
				this.$emit("receiptUpdate", BigInt((await receipt.balanceOf(Address.init().connectedAs)).toString()))
				this.close(false)
			}
		},
		async withdraw() {
			await WorkerController.init().workAsync(async () => {
				// parse the number
				let [integer, decimal] = this.depositAmount.split(".")
				integer = integer.replaceAll(",", "")
				if (decimal) {
					decimal = decimal.padEnd(18, "0")
				}

				let amount = `${integer}${decimal ?? ""}`

				this.overlay.confirmations = this.overlay.time = 0
				this.overlay.open = true
				try {
					let tx: ethers.providers.TransactionResponse = await this.stake.withdraw(amount)
					this.overlay.tx = tx.hash
					let receipt: ethers.providers.TransactionReceipt = await tx.wait()

					// transaction confirmed
					this.overlay.open = false
					// send a notification stating a successful transaction
					new Toaster({
						title: `Withdraw completed!`,
						message: `You have successfully withdrawn ${this.depositAmount} $${this.receiptTicker}!`,
						type: "success"
					})

					await this.retrieveMax()
					this.depositAmount = ""
					await this.syncData()
				} catch (e: any) {
					console.log(e)
					this.overlay.open = false
					// an error occurred, show an error message and go on
					new Toaster({
						code: `${e.code}.${e?.data?.code || 0}`,
						message: `${e.message.replace(".", "")}${e?.data?.message !== undefined ? `: ${e.data.message}` : ""}`,
					})
				}
			})
		},
		async withdrawWithNFT() {
			await WorkerController.init().workAsync(async () => {
				// parse the number
				let [integer, decimal] = this.depositAmount.split(".")
				integer = integer.replaceAll(",", "")
				if (decimal) {
					decimal = decimal.padEnd(18, "0")
				}

				let amount = `${integer}${decimal ?? ""}`

				this.overlay.confirmations = this.overlay.time = 0
				this.overlay.open = true
				try {
					let tx: ethers.providers.TransactionResponse = await this.stake.withdrawWithNFT(amount, this.depositedNFTs[this.selectedNFT].index)
					this.overlay.tx = tx.hash
					let receipt: ethers.providers.TransactionReceipt = await tx.wait(2)

					// transaction confirmed
					this.overlay.open = false
					// send a notification stating a successful transaction
					new Toaster({
						title: `Withdraw completed!`,
						message: `You have successfully withdrawn ${this.depositAmount} $${this.receiptTicker}!`,
						type: "success"
					})

					await this.retrieveMax()
					this.depositAmount = ""
					await this.syncData()
				} catch (e: any) {
					this.overlay.open = false
					// an error occurred, show an error message and go on
					new Toaster({
						code: `${e.code}.${e?.data?.code || 0}`,
						message: `${e.message.replace(".", "")}${e?.data?.message !== undefined ? `: ${e.data.message}` : ""}`,
					})
				}
			})
		}
	},
	computed: {
		selectedTabClasses() {
			return {
				standard: !this.isNFTDeposit ? "border-b-[3px] border-blue-400" : "",
				withNFT: this.isNFTDeposit ? "border-b-[3px] border-blue-400" : ""
			}
		},
		isLoadingMax() {
			return this.max === ""
		},
		NFTDepositState() {
			return {
				text: "Withdraw",
				action: () => {
					this.withdrawWithNFT()
				}
			}
		},
	},
	watch: {
		async open(n) {
			if (n) {
				let res = await Provider.init().loadCustomContract(ContractTypes.stackingReceipt, this.receiptContractAddress)
				if (res) {
					this.receipt = res
					await this.retrieveMax()
				}
			}
			if (n) {
				let res = await Provider.init().loadContract(ContractTypes.stacking)
				if (res) {
					this.stake = res
					await this.retrieveMax()
				}
			}

			let res = await Provider.init().loadContract(ContractTypes.stackingPanda)
			if (this.stakingPanda?.address === undefined && res) {
				this.stakingPanda = res
			}

			if (this.depositedNFTs.length === 0) {
				for (let i = 0; i < 100; i++) {
					try {
						let stackedNFT_raw = await this.stake.stackedNFTs(Address.init().connectedAs, i)
						let stakedNFT = {
							nftId: stackedNFT_raw["nftId"],
							stackedAmount: renderNumber(stackedNFT_raw["stackedAmount"]),
							index: i
						} as StakedNFT

						let metadata_raw = await this.stakingPanda.metadata(stakedNFT.nftId)
						stakedNFT.name = metadata_raw["name"]
						stakedNFT.picUrl = metadata_raw["picUrl"]
						this.depositedNFTs.push(stakedNFT)
					} catch (e) {
						// generates error for missing nft id (not yet generated) print it in the console and
						// continue as normal
						console.log(e)
						break
					}
				}
			}
		}
	},
})
</script>

<style scoped>

</style>