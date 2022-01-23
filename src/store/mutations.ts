/*
 * Copyright (C) 2022 Do inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Emanuele (ebalo) Balsamo <emanuele.balsamo@do-inc.co>
 */

import {State} from "./state";
import {MutationTree} from "vuex";
import {MUTATIONS} from "./types";

export const mutations: MutationTree<State> = {
	[MUTATIONS.connectionCompleted]: (state) => state.connected = true,
	[MUTATIONS.connectionLost]: (state) => state.connected = false,
	[MUTATIONS.signerFound]: (state, {address}) => state.address = address
} as MutationTree<State>