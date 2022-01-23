/*
 * Copyright (C) 2022 Do inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Emanuele (ebalo) Balsamo <emanuele.balsamo@do-inc.co>
 */

import {State} from "./state";
import {ActionTree} from "vuex";
import {ACTIONS, GETTERS, MUTATIONS} from "./types";

import { ethers } from "ethers";
import Web3Modal from "web3modal";
import WalletConnectProvider from "@walletconnect/web3-provider";
import url from "@/assets/images/binance.png"

export const actions: ActionTree<State, State> = {
	[ACTIONS.connectWallet]: async ({commit, getters}) => {
		const provider_options = {
			walletconnect: {
				package: WalletConnectProvider, // required
				options: {
					rpc: {
						56: 'https://bsc-dataseed1.binance.org',
						97: "https://data-seed-prebsc-1-s1.binance.org:8545/"
					},
					network: 'binance',
					chainId: getters[GETTERS.isTestnet] ? 97 : 56,
				}
			},
			"custom-binancechainwallet": {
				display: {
					logo: url,
					name: "Binance Chain Wallet",
					description: "Connect to your Binance Chain Wallet"
				},
				package: true,
				connector: async () => {
					let provider = null;
					if (typeof window.BinanceChain !== 'undefined') {
						provider = window.BinanceChain;
						try {
							await provider.request({method: 'eth_requestAccounts'})
						} catch (error) {
							throw new Error("User Rejected");
						}
					} else {
						throw new Error("No Binance Chain Wallet found");
					}
					return provider;
				}
			},
		}

		const web3_modal = new Web3Modal({
			network: "binance",
			cacheProvider: false, // optional
			providerOptions: provider_options // required
		})

		const instance = await web3_modal.connect();

		const provider = new ethers.providers.Web3Provider(instance);
		const signer = provider.getSigner();

		commit(MUTATIONS.connectionCompleted)
		commit(MUTATIONS.registerAddress, {
			address: await signer.getAddress()
		})
		commit(MUTATIONS.registerSigner, {
			signer: signer
		})
		commit(MUTATIONS.registerProvider, {
			provider: provider
		})
	},
} as ActionTree<State, State>