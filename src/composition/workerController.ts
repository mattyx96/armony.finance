/*
 * Copyright (C) 2022 Do inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Emanuele (ebalo) Balsamo <emanuele.balsamo@do-inc.co>
 */

import {ISignal, ISimpleEvent, SignalDispatcher, SimpleEventDispatcher} from "strongly-typed-events";

export enum WorkerState {
	PENDING,
	FINALIZED
}

export class WorkerController {
	private _status = WorkerState.FINALIZED
	private static _instance?: WorkerController

	private _newWorkStarted = new SignalDispatcher()
	private _workFinalized = new SignalDispatcher()
	private _workerState = new SimpleEventDispatcher<WorkerState>()

	private constructor() {
	}

	public static init(): WorkerController {
		if (this._instance === undefined) {
			this._instance = new WorkerController()
		}
		return this._instance
	}

	public work(callback: () => void): void {
		this._status = WorkerState.PENDING
		this._newWorkStarted.dispatchAsync()
		this._workerState.dispatchAsync(this._status)

		callback()

		this._status = WorkerState.FINALIZED
		this._workFinalized.dispatchAsync()
		this._workerState.dispatchAsync(this._status)
	}

	public async workAsync(callback: () => void): Promise<void> {
		this._status = WorkerState.PENDING
		this._newWorkStarted.dispatchAsync()
		this._workerState.dispatchAsync(this._status)

		await callback()

		this._status = WorkerState.FINALIZED
		this._workFinalized.dispatchAsync()
		this._workerState.dispatchAsync(this._status)
	}

	public watchState(pendingStateCallback: () => void, finalizedStateCallback: () => void):
		{
			unsubscribePending: () => void,
			unsubscribeFinalized: () => void
		} {
		const unsubscribePending = this._newWorkStarted.subscribe(pendingStateCallback)
		const unsubscribeFinalized = this._workFinalized.subscribe(finalizedStateCallback)

		return {
			unsubscribePending,
			unsubscribeFinalized
		}
	}

	public get isPending(): boolean {
		return this._status === WorkerState.PENDING
	}

	public get isFinalized(): boolean {
		return this._status === WorkerState.FINALIZED
	}

	public get status(): WorkerState {
		return this._status
	}

	public get onNewWorkStarted(): ISignal {
		return this._newWorkStarted.asEvent()
	}

	public get onWorkFinalized(): ISignal {
		return this._workFinalized.asEvent()
	}

	public get onWorkerStateChange(): ISimpleEvent<WorkerState> {
		return this._workerState.asEvent()
	}
}