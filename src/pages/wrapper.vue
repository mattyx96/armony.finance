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

			</div>
		</div>
	</div>
</template>

<script lang="ts">
import {defineComponent} from "vue";
import {ethers} from "ethers";
import {ContractTypes} from "composition/provider/types";
import {Provider} from "composition/provider";
import {Address} from "composition/address";

export default defineComponent({
	name: "wrapper",
	data: () => ({
		governance: {} as ethers.Contract
	}),
	methods: {
	},
	computed: {
	},
	async created() {
		if(Object.keys(this.governance).length === 0) {
			let result = await Provider.init().loadContract(ContractTypes.melodityGovernance)
			if(result) {
				this.governance = result
			}
		}
		console.log(this.governance)
		this.governance.balanceOf(Address.init().connectedAs).then(console.log).catch(console.log)
	}
})
</script>

<style scoped>

</style>