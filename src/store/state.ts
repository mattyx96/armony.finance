/*
 * Copyright (C) 2022 Do inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Emanuele (ebalo) Balsamo <emanuele.balsamo@do-inc.co>
 */

import {ethers} from "ethers";

export interface State {
	address: string,
	connected: boolean,
	provider: ethers.providers.Web3Provider|null,
	signer: ethers.providers.JsonRpcSigner|null,
}