/*
 * Copyright (C) 2022 Do inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Emanuele (ebalo) Balsamo <emanuele.balsamo@do-inc.co>
 */

import {State} from "./state";
import {GetterTree} from "vuex";
import {GETTERS} from "./types";

export const getters: GetterTree<State, State> = {
	[GETTERS.isConnected]: (state) => state.connected,
	[GETTERS.connectedAs]: (state, getters) => getters.isConnected ? state.address : null
} as GetterTree<State, State>