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
				import.meta.env.DEV ? "0x5FbDB2315678afecb367f032d93F642f64180aa3" : "",
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
				import.meta.env.DEV ? "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512" : "",
				(await import("@/abi/MelodityGovernance.json")).default,
				signer,
				provider,
				connected
			)
		case ContractTypes.marketplace:
			return loadContract(
				import.meta.env.DEV ? "0xeEBe00Ac0756308ac4AaBfD76c05c4F3088B8883" : "",
				(await import("@/abi/Marketplace.json")).default,
				signer,
				provider,
				connected
			)
		case ContractTypes.stacking:
			return loadContract(
				import.meta.env.DEV ? "0xDc64a140Aa3E981100a9becA4E685f962f0cF6C9" : "",
				(await import("@/abi/MelodityStacking.json")).default,
				signer,
				provider,
				connected
			)
		case ContractTypes.stackingPanda:
			return loadContract(
				import.meta.env.DEV ? "0xB7A5bd0345EF1Cc5E66bf61BdeC17D2461fBd968" : "",
				(await import("@/abi/StackingPanda.json")).default,
				signer,
				provider,
				connected
			)
		case ContractTypes.stackingReceipt:
			return loadContract(
				import.meta.env.DEV ? "0x856e4424f806D16E8CBC702B3c0F2ede5468eae5" : "",
				(await import("@/abi/StackingReceipt.json")).default,
				signer,
				provider,
				connected
			)
		default:
			return false
	}
}