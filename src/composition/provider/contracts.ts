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
				testing ? "0xE973bdde76df7Ac163Afa2DE640F768031FD4aee" : "0x46303b92A45445F51529c6DD705FcF1A9F68E592",
				require("../../abi/Masterchef.json"),
				signer,
				provider,
				connected
			)
		case ContractTypes.melodityGovernance:
			return loadContract(
				testing ? "0x02ddca03C12A78D8351d2f17EED53BD0218F1E16" : "0xfCFE6E40B47FE7879Cf30180df157Df9e9e8AE33",
				require("../../abi/MelodityGovernance.json"),
				signer,
				provider,
				connected
			)
		case ContractTypes.stackingPanda:
			return loadContract(
				testing ? "0x40860E6F7DaF7463902895eE6a2392f0EB3e7CAe" : "0xf6Ab47885AAe4aA670EdF79C97ac39691ede5821",
				require("../../abi/StackingPanda.json"),
				signer,
				provider,
				connected
			)
		case ContractTypes.marketplace:
			return loadContract(
				testing ? "0xa95aDe87687e43465ddBB97A35147e9b0e27987C" : "0x98De6C733F86832b3E7839367A9Ca10147b607ed",
				require("../../abi/Marketplace.json"),
				signer,
				provider,
				connected
			)
		case ContractTypes.stacking:
			return loadContract(
				testing ? "0x947e2CbF833DFE306816147eF1474fBbD7062d38" : "0xBBC7f6990BD35BbB2d6970f69616998790cA5614",
				require("../../abi/MelodityStacking.json"),
				signer,
				provider,
				connected
			)
		case ContractTypes.stackingReceipt:
			return loadContract(
				process.env.NODE ? "0xcc91966B178e29B835e4F3F32a803Fe31a40fA0a" : "0x9ea087c29d489D190bd98F0F8D248d94f111dAdd",
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