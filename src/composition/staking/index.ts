/*
 * Copyright (C) 2022 Do inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Emanuele (ebalo) Balsamo <emanuele.balsamo@do-inc.co>
 */

import {__RETRIEVE__, ABI, Stackable} from "composition/staking/types";
import STACKABLE from "@/assets/stackable.json"
import MELODITY_STACKING from "@/abi/MelodityStacking.json"
import {Provider} from "composition/provider";
import {ContractTypes} from "composition/provider/types";
import {ISignal, SignalDispatcher} from "strongly-typed-events";

export class Staking {
	private _stackable: Stackable[] = []
	private _completedParsingUnits = 0

	private _stackingReady = new SignalDispatcher()

	public constructor() {
		this.parse()
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
						stackable.era.eraDuration = +(era_info.rewardFactorPerEpoch.toString())
					}
					if (v.era.eraScaleFactor === __RETRIEVE__) {
						stackable.era.eraScaleFactor = BigInt(era_info.rewardFactorPerEpoch.toString())
					}
					if (v.era.startingTime === __RETRIEVE__) {
						stackable.era.startingTime = +(era_info.rewardFactorPerEpoch.toString())
					}
					if (v.receiptValue === __RETRIEVE__) {
						stackable.receiptValue = BigInt(era_info.rewardFactorPerEpoch.toString())
					}
					

					this._stackable.push(stackable)
				}
			} else {
				console.error("invalid record found", v)
			}

			this.checkIfReady()
		})
	}

	private checkIfReady() {
		this._completedParsingUnits++

		if (this._completedParsingUnits === STACKABLE.length) {
			this._stackingReady.dispatchAsync()
		}
	}

	public get onStackingReady(): ISignal {
		return this._stackingReady.asEvent()
	}
}