/*
 * Copyright (C) 2022 Do inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Emanuele (ebalo) Balsamo <emanuele.balsamo@do-inc.co>
 */

import {ContractInterface, ethers} from "ethers";
import {ContractTypes} from "composition/provider/types";

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
	switch (contract_type) {
		case ContractTypes.melodity:
			return loadContract(
				import.meta.env.DEV ? "0x5EaA8Be0ebe73C0B6AdA8946f136B86b92128c55" : "",
				(await import("@/abi/Melodity.json")).default,
				signer,
				provider,
				connected
			)
		case ContractTypes.masterchef:
			return loadContract(
				import.meta.env.DEV ? "0x0073528162cb70d95A9A4b750E1B775Ffd8B0740" : "",
				(await import("@/abi/Masterchef.json")).default,
				signer,
				provider,
				connected
			)
		case ContractTypes.melodityGovernance:
			return loadContract(
				import.meta.env.DEV ? "0xBF7aA2dFdAAB4f6746659A615E632cf46dE94764" : "",
				(await import("@/abi/MelodityGovernance.json")).default,
				signer,
				provider,
				connected
			)
		case ContractTypes.stackingPanda:
			return loadContract(
				import.meta.env.DEV ? "0x8934d232BeE00fdF0b582283A7EE3C31f8559088" : "",
				(await import("@/abi/StackingPanda.json")).default,
				signer,
				provider,
				connected
			)
		case ContractTypes.marketplace:
			return loadContract(
				import.meta.env.DEV ? "0x875e68CB55bC2f4F45f32134cBDA01F54A182Ff3" : "",
				(await import("@/abi/Marketplace.json")).default,
				signer,
				provider,
				connected
			)
		case ContractTypes.stacking:
			return loadContract(
				import.meta.env.DEV ? "0x7F4f2179F58e27eef6282069414a9e983b166B1e" : "",
				(await import("@/abi/MelodityStacking.json")).default,
				signer,
				provider,
				connected
			)
		case ContractTypes.stackingReceipt:
			return loadContract(
				import.meta.env.DEV ? "0x31d404e105c390fe3FA09A306855e7F828E7EDec" : "",
				(await import("@/abi/StackingReceipt.json")).default,
				signer,
				provider,
				connected
			)
		case ContractTypes.melodityIco:
			return loadContract(
				import.meta.env.DEV ? "0xc652b14fDe48C3d6782FA7FA70a68c52681D3B12" : "0xEde62Ac08D0Be6eF937c7bBda0C171b4c4432214",
				(await import("@/abi/MelodityIco.json")).default,
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
				(await import("@/abi/Masterchef.json")).default,
				signer,
				provider,
				connected
			)
		case ContractTypes.melodity:
			return loadContract(
				address,
				(await import("@/abi/Melodity.json")).default,
				signer,
				provider,
				connected
			)
		case ContractTypes.melodityGovernance:
			return loadContract(
				address,
				(await import("@/abi/MelodityGovernance.json")).default,
				signer,
				provider,
				connected
			)
		case ContractTypes.marketplace:
			return loadContract(
				address,
				(await import("@/abi/Marketplace.json")).default,
				signer,
				provider,
				connected
			)
		case ContractTypes.stacking:
			return loadContract(
				address,
				(await import("@/abi/MelodityStacking.json")).default,
				signer,
				provider,
				connected
			)
		case ContractTypes.stackingPanda:
			return loadContract(
				address,
				(await import("@/abi/StackingPanda.json")).default,
				signer,
				provider,
				connected
			)
		case ContractTypes.stackingReceipt:
			return loadContract(
				address,
				(await import("@/abi/StackingReceipt.json")).default,
				signer,
				provider,
				connected
			)
		case ContractTypes.melodityIco:
			return loadContract(
				address,
				(await import("@/abi/MelodityIco.json")).default,
				signer,
				provider,
				connected
			)
		default:
			return false
	}
}