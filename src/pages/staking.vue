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
					Put your crypto at work.
					<br>
					With Armony you receive up to {{ best_apy }}% APY on your stacked cryptocurrencies!
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
import TransactionOverlay from "components/TransactionOverlay.vue";
import {Address} from "composition/address";
import {WorkerController} from "composition/workerController";
import {ethers} from "ethers";
import {Provider} from "composition/provider";
import {ContractTypes} from "composition/provider/types";
import {renderNumber} from "composition/strings";
import {Stackable} from "composition/staking/types";
import {Staking} from "composition/staking";

export default defineComponent({
	name: "index",
	components: {TransactionOverlay},
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
		stackable: [] as Stackable[],
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
	computed: {},
	async created() {
		let s: Staking = new Staking()
		s.onStackingReady.subscribe(() => {
			console.log("stacking ready")
			console.log(s)
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