/*
 * Copyright (C) 2022 Do inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Emanuele (ebalo) Balsamo <emanuele.balsamo@do-inc.co>
 */

import {ethers} from "ethers";

export const __PERCENT_SCALE__ = ethers.utils.parseEther("100.0").toBigInt()
export const __RETRIEVE__ = "__RETRIEVE__"

export interface StackableCurrency {
	name: string
	picture?: string
	contract: string
}

export interface Epoch {
	epochDuration: number
	currentEpoch: number
	rewardScaleFactor: BigInt
}

export interface Era {
	startingTime: number
	eraDuration: number
	currentEra: number
	eraScaleFactor: BigInt
}

export interface Stackable {
	baseCurrency: StackableCurrency
	rewardCurrency: StackableCurrency
	epoch: Epoch
	era: Era
	receiptValue: BigInt
	contract: ethers.Contract
	abi: any[]
}

export enum ABI {
	__MELODITY_STACKING__
}

export enum MagicValues {
	__RETRIEVE__
}