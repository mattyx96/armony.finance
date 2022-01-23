/*
 * Copyright (C) 2022 Do inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Emanuele (ebalo) Balsamo <emanuele.balsamo@do-inc.co>
 */

import {State} from "./state";
import {ActionTree} from "vuex";
import {ACTIONS} from "./types";

export const actions: ActionTree<State, State> = {
	[ACTIONS.connectWallet]: async ({commit}) => {
		console.log("connectWallet")
	},
} as ActionTree<State, State>