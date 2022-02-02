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
				Plain deposit
			</div>
			<div class="flex items-center justify-center font-semibold text-lg transition-all duration-300
				cursor-pointer"
			     :class="selectedTabClasses.withNFT"
			     @click="switchDepositMode(true)">
				Deposit with NFT
			</div>
		</div>
		<div class="p-4 text-gray-800">
			<template v-if="!isNFTDeposit">
				<div class="flex flex-col">
					<div class="flex items-center justify-center">
						<label class="font-bold text-sm">Deposit amount</label>
						<shimmer class="text-xs ml-auto" :loading="isLoadingMax">
							{{ max }} {{ baseCurrencyTicker }}
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
						duration-300 cursor-pointer hover:shadow-lg hover:shadow-green-800/20 hover:bg-green-500">
						Deposit
					</div>
				</div>
			</template>
			<template v-else>
				<div class="flex flex-col">
					<div class="flex items-center justify-center">
						<label class="font-bold text-sm">Deposit amount</label>
						<shimmer class="text-xs ml-auto" :loading="isLoadingMax">
							{{ max }} {{ baseCurrencyTicker }}
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
							Stakable NFTs
							<sup class="text-[0.6em]">1,2</sup>
						</label>
						<div class="flex flex-col">
							<div v-for="(e, i) of ownedNFT" :key="i"
							     class="border rounded-md shadow shadow-blue-800/20 transition-all
									duration-300 p-2 w-full flex flex-col hover:shadow-lg">
								<div class="flex flex-col items-center justify-center">
									<div class="rounded-full h-32 w-32 mx-auto flex">
										<img :src="e.picUrl" :alt="`NFT #${e.id} pic`" class="object-contain m-auto">
									</div>
									<div class="capitalize mt-2 mb-4">
										{{ e.name }}
									</div>
								</div>
								<div class="">
									Stats
									<table>
										<tbody>
										<tr>
											<td>
												gMELD staking bonus
											</td>
											<td>{{ e.bonus.meldToMeld }}</td>
										</tr>
										<tr>
											<td>
												Exotic staking bonus
											</td>
											<td>{{ e.bonus.toMeld }}</td>
										</tr>
										</tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
					<ol class="list-decimal list-inside text-sm text-gray-500 px-2 mt-3">
						<li>
							Paired staking will result in a higher number of receipt received for the staking of a given amount
							of {{ baseCurrencyTicker }}.
						</li>
						<li>
							An NFT staked can be withdrawn only once all the receipt tokens received during the staking
							gets withdrawn, multiple small part withdrawn gets cumulated.
						</li>
					</ol>

					<div class="mx-auto px-3 py-2 mt-4 rounded-tl-3xl rounded-br-3xl border border-green-500 transition-all
						duration-300 cursor-pointer hover:shadow-lg hover:shadow-green-800/20 hover:bg-green-500">
						Deposit
					</div>
				</div>
			</template>
		</div>
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
import {StackingPanda} from "composition/staking/types";

export default defineComponent({
	name: "ModalStakingDeposit",
	components: {Shimmer, Modal},
	emits: [
		"update:open",
	],
	props: {
		open: {
			type: Boolean as PropType<boolean>,
		},
		receiptValue: {
			type: null as any as PropType<bigint>,
			required: true
		},
		baseCurrencyContractAddress: {
			type: String as PropType<string>,
			required: true
		},
		baseCurrencyTicker: {
			type: String as PropType<string>,
			required: true
		}
	},
	data: () => ({
		isNFTDeposit: false,
		depositAmount: "",
		max: "",
		baseCurrency: {} as ethers.Contract,
		stakingPanda: {} as ethers.Contract,
		ownedNFT: [{
			id: 0,
			name: "test-name",
			picUrl: "https://img.search.brave.com/UtPSCPZ_rFtwL0y2xGObk_PB8FR_ZxTCgFpMI66Sc30/rs:fit:1024:696:1/g:ce/aHR0cHM6Ly9ub3Rp/emlhaW50ZXJpc3Rh/Lml0L3dwLWNvbnRl/bnQvdXBsb2Fkcy8y/MDIwLzEwL2VyYmEt/Z2F0dGEtMTAyNHg2/OTYuanBn",
			bonus: {
				meldToMeld: "1.25",
				toMeld: "0.44"
			}
		}] as StackingPanda[],
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
			this.max = renderNumber(await this.baseCurrency.balanceOf(Address.init().connectedAs))
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
		}
	},
	watch: {
		async open(n) {
			if (n) {
				let res = await Provider.init().loadCustomContract(ContractTypes.melodityGovernance, this.baseCurrencyContractAddress)
				if (res) {
					this.baseCurrency = res
					await this.retrieveMax()
				}
			}

			if (this.ownedNFT.length === 0) {
				let res = await Provider.init().loadContract(ContractTypes.stackingPanda)
				if (res) {
					this.stakingPanda = res

					for (let i = 0; i < 100; i++) {
						try {
							let addr = await this.stakingPanda.ownerOf(i)

							if (addr === Address.init().connectedAs) {
								let metadata_raw = await this.stakingPanda.metadata(i)
								this.ownedNFT.push({
									id: i,
									name: metadata_raw["name"],
									picUrl: metadata_raw["picUrl"],
									bonus: {
										toMeld: renderNumber(metadata_raw["toMeld"], 18, 2),
										meldToMeld: renderNumber(metadata_raw["meldToMeld"], 18, 2)
									}
								})
							}
						} catch (e) {
							// generates error for missing nft id (not yet generated) print it in the console and
							// continue as normal
							console.log(e)
							break
						}
					}
				}
			}
		}
	},
})
</script>

<style scoped>

</style>