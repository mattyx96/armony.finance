/*
 * Copyright (C) 2022 Do inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Emanuele (ebalo) Balsamo <emanuele.balsamo@do-inc.co>
 */

import {ISimpleEvent, SimpleEventDispatcher} from "strongly-typed-events";

export class Address {
	// properties
	private _address?: string
	private static _instance?: Address

	// events
	private _newAddressRegistered = new SimpleEventDispatcher<string>()

	private constructor() {
	}

	public static init(): Address {
		if (this._instance === undefined) {
			this._instance = new Address()
		}
		return this._instance
	}

	public registerAddress(account: string): Address {
		this._address = account

		this._newAddressRegistered.dispatchAsync(account)

		return this
	}

	public get connectedAs(): string | false {
		return this._address !== undefined ? this._address : false
	}

	public get isConnected(): boolean {
		return this._address !== undefined
	}

	public get onNewAddressRegistered(): ISimpleEvent<string> {
		return this._newAddressRegistered.asEvent()
	}
}