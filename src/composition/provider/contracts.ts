/*
 * Copyright (C) 2022 Do inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Emanuele (ebalo) Balsamo <emanuele.balsamo@do-inc.co>
 */

import {ContractInterface, ethers} from "ethers";
import {ContractTypes} from "../provider/types";

const loadContract = (
	address: string,
	abi: any,
	signer: ethers.providers.JsonRpcSigner | null,
	provider: ethers.providers.JsonRpcProvider,
	connected: boolean
): ethers.Contract => {
	if (connected && signer !== null) {
		return new ethers.Contract(address, abi as ContractInterface, signer)
	}
	return new ethers.Contract(address, abi as ContractInterface, provider)
}

export const initContractInstance = async (
	contract_type: ContractTypes,
	signer: ethers.providers.JsonRpcSigner | null,
	provider: ethers.providers.JsonRpcProvider,
	connected: boolean
): Promise<ethers.Contract | false> => {
	const testing = false
	switch (contract_type) {
		case ContractTypes.melodity:
			return loadContract(
				testing ? "0x5EaA8Be0ebe73C0B6AdA8946f136B86b92128c55" : "0x13E971De9181eeF7A4aEAEAA67552A6a4cc54f43",
				require("../../abi/Melodity.json"),
				signer,
				provider,
				connected
			)
		case ContractTypes.masterchef:
			return loadContract(
				testing ? "0x62795cB19AaD325C10F01B3Bc49986C3351ad259" : "0x46303b92A45445F51529c6DD705FcF1A9F68E592",
				require("../../abi/Masterchef.json"),
				signer,
				provider,
				connected
			)
		case ContractTypes.melodityGovernance:
			return loadContract(
				testing ? "0x5FF819523D4e53693F1453Dc927c515a15Ad3556" : "0xfCFE6E40B47FE7879Cf30180df157Df9e9e8AE33",
				require("../../abi/MelodityGovernance.json"),
				signer,
				provider,
				connected
			)
		case ContractTypes.stackingPanda:
			return loadContract(
				testing ? "0xCdE031864977009b7335c0f0cE1b792c73cCc236" : "0xf6Ab47885AAe4aA670EdF79C97ac39691ede5821",
				require("../../abi/StackingPanda.json"),
				signer,
				provider,
				connected
			)
		case ContractTypes.marketplace:
			return loadContract(
				testing ? "0x63AdC77DE9634D425F23735cDC68e0605831b039" : "0x98De6C733F86832b3E7839367A9Ca10147b607ed",
				require("../../abi/Marketplace.json"),
				signer,
				provider,
				connected
			)
		case ContractTypes.stacking:
			return loadContract(
				testing ? "0x3c4Bc1a449f7a4a54394265d77679F7526D59Bb7" : "0xEe57ca5eC122F813fB676A855aeF7aCDD323316B",
				require("../../abi/MelodityStacking.json"),
				signer,
				provider,
				connected
			)
		case ContractTypes.stackingReceipt:
			return loadContract(
				process.env.NODE ? "0x0C0CDCa22c83Dda9C7c1f1754dDa65baf9224D70" : "0x8850F61B1C37de13e663D284bF54310d80e38a1C",
				require("../../abi/StackingReceipt.json"),
				signer,
				provider,
				connected
			)
		case ContractTypes.melodityIco:
			return loadContract(
				testing ? "0xc652b14fDe48C3d6782FA7FA70a68c52681D3B12" : "0xEde62Ac08D0Be6eF937c7bBda0C171b4c4432214",
				require("../../abi/MelodityIco.json"),
				signer,
				provider,
				connected
			)
		default:
			return false
	}
}

export const initCustomContractInstance = async (
	contract_type: ContractTypes,
	address: string,
	signer: ethers.providers.JsonRpcSigner | null,
	provider: ethers.providers.JsonRpcProvider,
	connected: boolean
): Promise<ethers.Contract | false> => {
	switch (contract_type) {
		case ContractTypes.masterchef:
			return loadContract(
				address,
				require("../../abi/Masterchef.json"),
				signer,
				provider,
				connected
			)
		case ContractTypes.melodity:
			return loadContract(
				address,
				require("../../abi/Melodity.json"),
				signer,
				provider,
				connected
			)
		case ContractTypes.melodityGovernance:
			return loadContract(
				address,
				require("../../abi/MelodityGovernance.json"),
				signer,
				provider,
				connected
			)
		case ContractTypes.marketplace:
			return loadContract(
				address,
				require("../../abi/Marketplace.json"),
				signer,
				provider,
				connected
			)
		case ContractTypes.stacking:
			return loadContract(
				address,
				require("../../abi/MelodityStacking.json"),
				signer,
				provider,
				connected
			)
		case ContractTypes.stackingPanda:
			return loadContract(
				address,
				require("../../abi/StackingPanda.json"),
				signer,
				provider,
				connected
			)
		case ContractTypes.stackingReceipt:
			return loadContract(
				address,
				require("../../abi/StackingReceipt.json"),
				signer,
				provider,
				connected
			)
		case ContractTypes.melodityIco:
			return loadContract(
				address,
				require("../../abi/MelodityIco.json"),
				signer,
				provider,
				connected
			)
		default:
			return false
	}
}