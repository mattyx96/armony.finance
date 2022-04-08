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
                   class="py-2 px-4 border rounded-[1.8rem] outline-none w-full">
            <div class="bg-[#6e6e99] rounded-[1.8rem] text-white text-sm ml-3 px-2 py-1 cursor-pointer"
                 @click="insertMax">
              Max
            </div>
          </div>
          <button class="mx-auto px-3 py-2 mt-4 rounded-3xl bg-green-400 transition-all
						duration-300 cursor-pointer hover:shadow-lg hover:shadow-gray-900/20 text-white"
                  @click="deposit">
            Deposit
          </button>
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
                   class="py-2 px-4 border rounded-[1.8rem] outline-none w-full">
            <div class="bg-[#6e6e99] rounded-[1.8rem] text-white text-sm ml-3 px-2 py-1 cursor-pointer"
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
                   class="rounded-[1.8rem] border-2 border-gray-100 transition-all
									duration-300 w-full flex flex-col p-5">
                <div class="flex flex-col items-center justify-center">
                  <div class="rounded-full h-32 w-32 mx-auto flex">
                    <img :src="e.picUrl" :alt="`NFT #${e.id} pic`" class="object-contain m-auto">
                  </div>
                  <div class="capitalize mt-2 mb-4">
                    {{ e.name }}
                  </div>
                </div>
                <div class="text-gray-800 p-2">

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
              Paired staking will result in a higher number of receipt received for the staking of a given
              amount
              of {{ baseCurrencyTicker }}.
            </li>
            <li>
              An NFT staked can be withdrawn only once all the receipt tokens received during the staking
              gets withdrawn, multiple small part withdrawn gets cumulated.
            </li>
          </ol>

          <button class="mx-auto px-3 py-2 mt-4 rounded-3xl bg-green-400 transition-all
						duration-300 cursor-pointer hover:shadow-lg hover:shadow-gray-900/20 text-white"
                  @click="NFTDepositState.action">
            {{ NFTDepositState.text }}
          </button>
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
import Modal from "@/components/Overlay/Modal.vue";
import Shimmer from "@/components/shimmer.vue";
import {ethers} from "ethers";
import {Provider} from "@/composition/provider";
import {ContractTypes} from "@/composition/provider/types";
import {renderNumber} from "@/composition/strings";
import {Address} from "@/composition/address";
import {StackingPanda} from "@/composition/staking/types";
import {WorkerController} from "@/composition/workerController";
import Toaster from "@/composition/toaster";
import TransactionOverlay from "@/components/Overlay/TransactionOverlay.vue";

export default defineComponent({
  name: "ModalStakingDeposit",
  components: {TransactionOverlay, Shimmer, Modal},
  emits: [
    "update:open",
    "receiptUpdate",
  ],
  props: {
    open: {
      type: Boolean as PropType<boolean>,
    },
    baseCurrencyContractAddress: {
      type: String as PropType<string>,
      required: true
    },
    baseCurrencyTicker: {
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
    baseCurrency: {} as ethers.Contract,
    stakingPanda: {} as ethers.Contract,
    stake: {} as ethers.Contract,
    ownedNFT: [] as StackingPanda[],
    NFTDepositApproved: false,
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
      this.max = renderNumber(await this.baseCurrency.balanceOf(Address.init().connectedAs))
    },
    async checkNFTDepositApproved() {
      this.NFTDepositApproved = (await this.stakingPanda.getApproved(this.selectedNFT)) === this.stake.address
    },
    async syncData() {
      let receipt = await Provider.init().loadCustomContract(ContractTypes.stackingReceipt, await this.stake.stackingReceipt())
      if (receipt) {
        this.$emit("receiptUpdate", BigInt((await receipt.balanceOf(Address.init().connectedAs)).toString()))
        this.close(false)
      }
    },
    async approveNFTDeposit() {
      await WorkerController.init().workAsync(async () => {
        this.overlay.confirmations = this.overlay.time = 0
        this.overlay.open = true
        try {
          let tx: ethers.providers.TransactionResponse = await this.stakingPanda.approve(this.stake.address, this.selectedNFT)
          this.overlay.tx = tx.hash
          let receipt: ethers.providers.TransactionReceipt = await tx.wait(2)

          // transaction confirmed
          this.overlay.open = false
          // send a notification stating a successful transaction
          new Toaster({
            title: `NFT staking approved!`,
            message: `You have successfully approved the staking of your NFT #${this.selectedNFT}.`,
            type: "success"
          })
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
    async deposit() {
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
          let tx: ethers.providers.TransactionResponse = await this.stake.deposit(
              amount,
              {
                value: ethers.utils.parseEther("0.0005").toString()
              }
          )
          this.overlay.tx = tx.hash
          let receipt: ethers.providers.TransactionReceipt = await tx.wait(2)

          // transaction confirmed
          this.overlay.open = false
          // send a notification stating a successful transaction
          new Toaster({
            title: `Staking completed!`,
            message: `You have successfully staked ${this.depositAmount} $${this.baseCurrencyTicker}!`,
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
    async depositWithNFT() {
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
          let tx: ethers.providers.TransactionResponse = await this.stake.depositWithNFT(
              amount,
              this.selectedNFT,
              {
                value: ethers.utils.parseEther("0.0005").toString()
              }
          )
          this.overlay.tx = tx.hash
          let receipt: ethers.providers.TransactionReceipt = await tx.wait(2)

          // transaction confirmed
          this.overlay.open = false
          // send a notification stating a successful transaction
          new Toaster({
            title: `Staking completed!`,
            message: `You have successfully staked ${this.depositAmount} $${this.baseCurrencyTicker} + Stacking Panda #${this.selectedNFT}!`,
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
        standard: !this.isNFTDeposit ? "border-b-[3px] border-[#b7b7ff]" : "",
        withNFT: this.isNFTDeposit ? "border-b-[3px] border-[#b7b7ff]" : ""
      }
    },
    isLoadingMax() {
      return this.max === ""
    },
    NFTDepositState() {
      return this.NFTDepositApproved ? {
        text: "Deposit",
        action: () => {
          this.depositWithNFT()
        }
      } : {
        text: "Approve",
        action: () => {
          this.approveNFTDeposit()
        }
      }
    },
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

      if (this.ownedNFT.length === 0) {
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
  },
})
</script>

<style scoped>

</style>
