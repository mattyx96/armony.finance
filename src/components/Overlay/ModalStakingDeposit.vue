<!--
  - Copyright (C) 2022 Do inc. - All Rights Reserved
  - Unauthorized copying of this file, via any medium is strictly prohibited
  - Proprietary and confidential
  - Written by Emanuele (ebalo) Balsamo <emanuele.balsamo@do-inc.co>
  -->

<template>
	<modal :open="open" @update:open="close" size="lg">
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
						<shimmer class="text-xs ml-auto">

						</shimmer>
					</div>
					<div class="flex items-center justify-center">
						<input v-model="" placeholder="0.00"
						       class="p-1 border rounded-md outline-none">
					</div>
				</div>


			</template>
			<template v-else>
				with nft deposit
			</template>
		</div>
	</modal>
</template>

<script lang="ts">
import {defineComponent, PropType} from "vue";
import Modal from "components/Overlay/Modal.vue";
import Shimmer from "components/shimmer.vue";
import {ethers} from "ethers";

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
		baseCurrencyContract: {
			type: Object as any as PropType<ethers.Contract>,
			required: true
		}
	},
	data: () => ({
		isNFTDeposit: false
	}),
	methods: {
		close(ev: boolean) {
			this.$emit("update:open", ev)
		},
		switchDepositMode(withNFT: boolean) {
			this.isNFTDeposit = withNFT
		}
	},
	computed: {
		selectedTabClasses() {
			return {
				standard: !this.isNFTDeposit ? "border-b-[3px] border-blue-400" : "",
				withNFT: this.isNFTDeposit ? "border-b-[3px] border-blue-400" : ""
			}
		}
	}
})
</script>

<style scoped>

</style>