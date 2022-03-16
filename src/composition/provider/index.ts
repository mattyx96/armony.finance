/*
 * Copyright (C) 2022 Do inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Emanuele (ebalo) Balsamo <emanuele.balsamo@do-inc.co>
 */

import {ethers} from "ethers";
import {connectWallet as _connectWallet} from "./wallet"
import {Address} from "../address"
import {ContractTypes} from "./types";
import {ISignal, ISimpleEvent, SignalDispatcher, SimpleEventDispatcher} from "strongly-typed-events";
import {
	initContractInstance as _initContractInstance,
	initCustomContractInstance as _initCustomContractInstance
} from "@/composition/provider/contracts";

export class Provider {
	// properties
	private _provider?: ethers.providers.Web3Provider
	private _fallbackProvider?: ethers.providers.JsonRpcProvider
	private _testing: boolean = false
	private _signer?: ethers.providers.JsonRpcSigner
	private static _instance?: Provider

	// events
	private _newProviderRegistered: SimpleEventDispatcher<ethers.providers.Web3Provider>
	private _newSignerRegistered: SimpleEventDispatcher<ethers.providers.JsonRpcSigner>
	private _walletConnected: SignalDispatcher

	private constructor() {
		this.initFallbackProvider()
		this._newProviderRegistered = new SimpleEventDispatcher<ethers.providers.Web3Provider>()
		this._newSignerRegistered = new SimpleEventDispatcher<ethers.providers.JsonRpcSigner>()
		this._walletConnected = new SignalDispatcher()
	}

	public static init(): Provider {
		if (this._instance === undefined) {
			this._instance = new Provider()
		}
		return this._instance
	}

	private initFallbackProvider() {
		if (this._testing) {
			this._fallbackProvider = new ethers.providers.JsonRpcProvider("https://data-seed-prebsc-1-s1.binance.org:8545/", {
				chainId: 97,
				name: "binance"
			})
		} else {
			this._fallbackProvider = new ethers.providers.JsonRpcProvider("https://bsc-dataseed.binance.org", {
				chainId: 56,
				name: "binance"
			})
		}
	}

	public async registerProvider(provider: ethers.providers.Web3Provider): Promise<Provider> {
		this._provider = provider
		this._signer = provider.getSigner()
		Address.init().registerAddress(await this._signer.getAddress())

		this._newProviderRegistered.dispatchAsync(provider)
		this._newSignerRegistered.dispatchAsync(this._signer)

		return this
	}

	public async connectWallet(): Promise<Provider> {
		let {provider} = await _connectWallet()

		this._walletConnected.dispatchAsync()

		return await this.registerProvider(provider)
	}

	public async loadContract(contract_type: ContractTypes): Promise<ethers.Contract | false> {
		return await _initContractInstance(
			contract_type,
			this._signer !== undefined ? this._signer : null,
			(this._provider !== undefined ? this._provider : this._fallbackProvider) as ethers.providers.JsonRpcProvider,
			this._signer !== undefined
		)
	}

	public async loadCustomContract(contract_type: ContractTypes, address: string): Promise<ethers.Contract | false> {
		return await _initCustomContractInstance(
			contract_type,
			address,
			this._signer !== undefined ? this._signer : null,
			(this._provider !== undefined ? this._provider : this._fallbackProvider) as ethers.providers.JsonRpcProvider,
			this._signer !== undefined
		)
	}

	public get rpcProvider(): ethers.providers.JsonRpcProvider | ethers.providers.Web3Provider {
		return this._provider !== undefined ? this._provider : this._fallbackProvider as ethers.providers.JsonRpcProvider
	}

	public get signer(): ethers.providers.JsonRpcSigner | false {
		return this._signer !== undefined ? this._signer : false
	}

	public get isTesting(): boolean {
		return this._testing
	}

	public get onNewProviderRegistered(): ISimpleEvent<ethers.providers.Web3Provider> {
		return this._newProviderRegistered.asEvent()
	}

	public get onNewSignerRegistered(): ISimpleEvent<ethers.providers.JsonRpcSigner> {
		return this._newSignerRegistered.asEvent()
	}

	public get onWalletConnected(): ISignal {
		return this._walletConnected.asEvent()
	}
}