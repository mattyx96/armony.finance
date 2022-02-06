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
				import.meta.env.DEV ? "0xE973bdde76df7Ac163Afa2DE640F768031FD4aee" : "",
				(await import("@/abi/Masterchef.json")).default,
				signer,
				provider,
				connected
			)
		case ContractTypes.melodityGovernance:
			return loadContract(
				import.meta.env.DEV ? "0x02ddca03C12A78D8351d2f17EED53BD0218F1E16" : "",
				(await import("@/abi/MelodityGovernance.json")).default,
				signer,
				provider,
				connected
			)
		case ContractTypes.stackingPanda:
			return loadContract(
				import.meta.env.DEV ? "0x40860E6F7DaF7463902895eE6a2392f0EB3e7CAe" : "",
				(await import("@/abi/StackingPanda.json")).default,
				signer,
				provider,
				connected
			)
		case ContractTypes.marketplace:
			return loadContract(
				import.meta.env.DEV ? "0xa95aDe87687e43465ddBB97A35147e9b0e27987C" : "",
				(await import("@/abi/Marketplace.json")).default,
				signer,
				provider,
				connected
			)
		case ContractTypes.stacking:
			return loadContract(
				import.meta.env.DEV ? "0x947e2CbF833DFE306816147eF1474fBbD7062d38" : "",
				(await import("@/abi/MelodityStacking.json")).default,
				signer,
				provider,
				connected
			)
		case ContractTypes.stackingReceipt:
			return loadContract(
				import.meta.env.DEV ? "0xcc91966B178e29B835e4F3F32a803Fe31a40fA0a" : "",
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