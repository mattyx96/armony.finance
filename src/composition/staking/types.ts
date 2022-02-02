/*
 * Copyright (C) 2022 Do inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Emanuele (ebalo) Balsamo <emanuele.balsamo@do-inc.co>
 */

import {ethers} from "ethers";

export const __PERCENT_SCALE__ = ethers.utils.parseEther("100.0").toBigInt()
export const __EPOCH_PER_YEAR__ = 8760n
export const __RETRIEVE__ = "__RETRIEVE__"

export interface StackableCurrency {
	name: string
	picture?: string
	contract: string
}

export interface Epoch {
	epochDuration: number
	currentEpoch: number
	rewardScaleFactor: bigint
}

export interface Era {
	startingTime: number
	eraDuration: number
	currentEra: number
	eraScaleFactor: bigint
}

export interface Stackable {
	baseCurrency: StackableCurrency
	rewardCurrency: StackableCurrency
	epoch: Epoch
	era: Era
	receiptValue: bigint
	contract: ethers.Contract
	abi: any[]
	apy: string
}

export interface Staked {
	receiptAmount: string
	allowance: bigint
	boughtAtReceiptValue?: bigint
	earnings?: string
	contract: ethers.Contract
	ticker: string
}

export interface StackingPanda {
	id: number
	name: string
	picUrl: string
	bonus: {
		meldToMeld: string
		toMeld: string
	}
}

export enum ABI {
	__MELODITY_STACKING__
}

