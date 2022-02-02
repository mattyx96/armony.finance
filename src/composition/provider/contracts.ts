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
		case ContractTypes.masterchef:
			return loadContract(
				import.meta.env.DEV ? "0x637f37eB10Cf22b3f35f988e56bee0ec25318AF7" : "",
				(await import("@/abi/Masterchef.json")).default,
				signer,
				provider,
				connected
			)
		case ContractTypes.melodity:
			return loadContract(
				import.meta.env.DEV ? "0x5EaA8Be0ebe73C0B6AdA8946f136B86b92128c55" : "",
				(await import("@/abi/Melodity.json")).default,
				signer,
				provider,
				connected
			)
		case ContractTypes.melodityGovernance:
			return loadContract(
				import.meta.env.DEV ? "0x02D016FDc5C64315EF9B75CDaf8cfFEB144FAb6e" : "",
				(await import("@/abi/MelodityGovernance.json")).default,
				signer,
				provider,
				connected
			)
		case ContractTypes.marketplace:
			return loadContract(
				import.meta.env.DEV ? "0x1070c8cb887124ec8871bAd67a5B3560dC7b5Ba2" : "",
				(await import("@/abi/Marketplace.json")).default,
				signer,
				provider,
				connected
			)
		case ContractTypes.stacking:
			return loadContract(
				import.meta.env.DEV ? "0xAb6735D3129e0116a29Bab1eb9A8cEEca55d91DE" : "",
				(await import("@/abi/MelodityStacking.json")).default,
				signer,
				provider,
				connected
			)
		case ContractTypes.stackingPanda:
			return loadContract(
				import.meta.env.DEV ? "0x712D12E3ff0F15f6b519bd04DBbE03fC577dac4E" : "",
				(await import("@/abi/StackingPanda.json")).default,
				signer,
				provider,
				connected
			)
		case ContractTypes.stackingReceipt:
			return loadContract(
				import.meta.env.DEV ? "0x7DE8226Ade12A2f876099A3b057630b7AA40A9a4" : "",
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