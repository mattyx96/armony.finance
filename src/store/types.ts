/*
 * Copyright (C) 2022 Do inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Emanuele (ebalo) Balsamo <emanuele.balsamo@do-inc.co>
 */

export enum GETTERS {
	isConnected = "isConnected",
	connectedAs = "connectedAs",
	isTestnet = "isTestnet",
}

export enum MUTATIONS {
	connectionCompleted = "connectionCompleted",
	connectionLost = "connectionLost",
	registerAddress = "registerAddress",
	registerSigner = "registerSigner",
	registerProvider = "registerProvider",
}

export enum ACTIONS {
	connectWallet = "connectWallet",
}