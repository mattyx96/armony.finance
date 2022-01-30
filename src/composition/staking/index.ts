/*
 * Copyright (C) 2022 Do inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Emanuele (ebalo) Balsamo <emanuele.balsamo@do-inc.co>
 */

import {__EPOCH_PER_YEAR__, __PERCENT_SCALE__, __RETRIEVE__, ABI, Stackable, Staked} from "composition/staking/types";
import STACKABLE from "@/assets/stackable.json"
import MELODITY_STACKING from "@/abi/MelodityStacking.json"
import {Provider} from "composition/provider";
import {ContractTypes} from "composition/provider/types";
import {ISignal, ISimpleEvent, SignalDispatcher, SimpleEventDispatcher} from "strongly-typed-events";
import {ethers} from "ethers";
import {Address} from "composition/address";
import {renderNumber} from "composition/strings";

export class Staking {
	private _stackable: Stackable[] = []
	private _staked: Staked[] = []
	private _completedParsingUnits = 0
	private _completedStakingUnits = 0
	private _signerSubscription?: () => void
	private static _instance?: Staking

	private _stackingReady = new SignalDispatcher()
	private _stakedReady = new SignalDispatcher()
	private _signerInjected = new SignalDispatcher()
	private _invalidStackableFound = new SimpleEventDispatcher<object>()

	private constructor() {
		if (!Provider.init().signer) {
			this._signerSubscription = Provider.init().onNewSignerRegistered.subscribe(() => {
				this.injectSigner()
			})
		}

		// no need to tell parse to inject the signer as in case the user is already logged the signer is automatically
		// injected in the contract instance
		this.parse()
	}

	public static init(): Staking {
		if (this._instance === undefined) {
			this._instance = new Staking()
		}
		return this._instance
	}

	private parse() {
		STACKABLE.forEach(async v => {
			const rex = new RegExp(/^0x[0-9a-fA-f]{40}$/)

			if (v.abi !== undefined &&
				v.baseCurrency !== undefined &&
				v.baseCurrency.contract !== undefined &&
				v.baseCurrency.name !== undefined &&
				v.baseCurrency.picture !== undefined &&
				v.contract !== undefined &&
				v.epoch !== undefined &&
				v.epoch.epochDuration !== undefined &&
				v.epoch.currentEpoch !== undefined &&
				v.epoch.rewardScaleFactor !== undefined &&
				v.era !== undefined &&
				v.era.currentEra !== undefined &&
				v.era.eraDuration !== undefined &&
				v.era.eraScaleFactor !== undefined &&
				v.receiptValue !== undefined &&
				v.rewardCurrency !== undefined &&
				v.rewardCurrency.contract !== undefined &&
				v.rewardCurrency.name !== undefined &&
				v.rewardCurrency.picture !== undefined &&

				Object.keys(ABI).includes(v.abi) &&

				rex.test(v.baseCurrency.contract) &&
				rex.test(v.contract) &&
				rex.test(v.rewardCurrency.contract)) {
				let stackable = {
					baseCurrency: {
						...v.baseCurrency,
						picture: v.baseCurrency.picture === null ? undefined : v.baseCurrency.picture
					},
					rewardCurrency: {
						...v.rewardCurrency,
						picture: v.rewardCurrency.picture === null ? undefined : v.rewardCurrency.picture
					},
					epoch: {},
					era: {},
				} as Stackable

				// @ts-ignore
				switch (ABI[v.abi]) {
					case ABI.__MELODITY_STACKING__:
						stackable.abi = MELODITY_STACKING
				}

				// retrieve the contract
				let res = await Provider.init().loadContract(ContractTypes.stacking)

				// check if the contract is actually returned
				if (res) {
					stackable.contract = res

					// retrieve options
					if (v.epoch.epochDuration === __RETRIEVE__) {
						stackable.epoch.epochDuration = +((await res._EPOCH_DURATION()).toString())
					}
					if (v.epoch.currentEpoch === __RETRIEVE__) {
						stackable.epoch.currentEpoch = +((await res.getEpochPassed()).toString())
					}
					if (v.era.currentEra === __RETRIEVE__) {
						stackable.era.currentEra = +((await res.getCurrentEra()).toString())
					}

					let era_info_raw = await res.eraInfos(stackable.era.currentEra - 1)
					let era_info = {
						startingTime: era_info_raw["startingTime"],
						eraDuration: era_info_raw["eraDuration"],
						rewardScaleFactor: era_info_raw["rewardScaleFactor"],
						eraScaleFactor: era_info_raw["eraScaleFactor"],
						rewardFactorPerEpoch: era_info_raw["rewardFactorPerEpoch"],
					}

					if (v.epoch.rewardScaleFactor === __RETRIEVE__) {
						stackable.epoch.rewardScaleFactor = BigInt(era_info.rewardFactorPerEpoch.toString())
					}
					if (v.era.eraDuration === __RETRIEVE__) {
						stackable.era.eraDuration = +(era_info.eraDuration.toString())
					}
					if (v.era.eraScaleFactor === __RETRIEVE__) {
						stackable.era.eraScaleFactor = BigInt(era_info.eraScaleFactor.toString())
					}
					if (v.era.startingTime === __RETRIEVE__) {
						stackable.era.startingTime = +(era_info.startingTime.toString())
					}
					if (v.receiptValue === __RETRIEVE__) {
						stackable.receiptValue = BigInt((await res.poolInfo())["receiptValue"].toString())
					}

					let growth_factor: bigint =
						stackable.epoch.rewardScaleFactor * stackable.receiptValue / __PERCENT_SCALE__
					let apr = growth_factor * __EPOCH_PER_YEAR__
					let daily_apr = apr / 365n
					stackable.apy = (((1 + +`0.${daily_apr.toString().padStart(18, "0")}`) ** 365 - 1) * 100).toFixed(2)

					this._stackable.push(stackable)
					this.loadStakedData().then(() => {})
				}
			} else {
				this._invalidStackableFound.dispatchAsync(v)
			}

			this.checkIfReady()
		})
	}

	private injectSigner() {
		this._stackable = this._stackable.map((value): Stackable => {
			value.contract.connect(Provider.init().signer as ethers.providers.JsonRpcSigner)
			return value
		})

		this._signerInjected.dispatchAsync()

		this.loadStakedData().then(() => {})
	}

	private checkIfReady() {
		this._completedParsingUnits++

		if (this._completedParsingUnits === STACKABLE.length) {
			this._stackingReady.dispatchAsync()
		}
	}

	private checkIfStakedReady() {
		this._completedStakingUnits++

		if (this._completedStakingUnits === STACKABLE.length) {
			this._stakedReady.dispatchAsync()
		}
	}

	private async loadStakedData(): Promise<void> {
		if(Provider.init().signer) {
			let current_stake = this._stackable[this._completedStakingUnits]
			let staking_receipt_address = await current_stake.contract.stackingReceipt()
			let stake = {} as Staked

			let res = await Provider.init().loadCustomContract(ContractTypes.stackingReceipt, staking_receipt_address)
			if(res) {
				stake.contract = res
				stake.receiptAmount = renderNumber(await stake.contract.balanceOf(Address.init().connectedAs))
				stake.ticker = await stake.contract.symbol()

				// TODO: off chain api needed to retrieve the earnings and the historical buying price
				this._staked.push(stake)
			}

			this.checkIfStakedReady()
		}
	}

	public get stackable(): Stackable[] {
		return this._stackable
	}

	public get staked(): Staked[] {
		return this._staked
	}

	public get onStackingReady(): ISignal {
		return this._stackingReady.asEvent()
	}

	public get onSignerInjected(): ISignal {
		return this._signerInjected.asEvent()
	}

	public get onStackedDataReady(): ISignal {
		return this._stakedReady.asEvent()
	}

	public get onInvalidStackableFound(): ISimpleEvent<object> {
		return this._invalidStackableFound.asEvent()
	}
}