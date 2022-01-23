/*
 * Copyright (C) 2022 Do inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Emanuele (ebalo) Balsamo <emanuele.balsamo@do-inc.co>
 */

export enum GETTERS {
	isConnected = "isConnected",
	connectedAs = "connectedAs",
}

export enum MUTATIONS {
	connectionCompleted = "connectionCompleted",
	connectionLost = "connectionLost",
	signerFound = "signerFound",
}

export enum ACTIONS {
	connectWallet = "connectWallet",
}