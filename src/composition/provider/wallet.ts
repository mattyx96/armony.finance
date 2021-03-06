/*
 * Copyright (C) 2022 Do inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Emanuele (ebalo) Balsamo <emanuele.balsamo@do-inc.co>
 */

import WalletConnectProvider from "@walletconnect/web3-provider";
const url = require("../../assets/images/binance.png");
import Web3Modal from "web3modal";
import {ethers} from "ethers";

export const connectWallet =
    async (): Promise<{ signer: ethers.providers.JsonRpcSigner, provider: ethers.providers.Web3Provider }> => {
        const testing = false;
        const provider_options = {
            walletconnect: {
                package: WalletConnectProvider, // required
                options: {
                    rpc: {
                        56: 'https://bsc-dataseed.binance.org',
                        97: "https://data-seed-prebsc-1-s1.binance.org:8545/"
                    },
                    network: 'binance',
                    chainId: testing ? 97 : 56,
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

        let chain_id = (await provider.getNetwork()).chainId
        if (testing && chain_id !== 97) {
            alert("Wrong network selected, please move to BSC testnet and reload the page")
        } else if (!testing && chain_id !== 56) {
            alert("Wrong network selected, please move to BSC and reload the page")
        }

        const signer = provider.getSigner();

        return {
            provider,
            signer
        }
    }