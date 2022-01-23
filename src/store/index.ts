/*
 * Copyright (C) 2022 Do inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Emanuele (ebalo) Balsamo <emanuele.balsamo@do-inc.co>
 */

import {InjectionKey} from 'vue'
import {createStore, useStore as baseUseStore, Store} from 'vuex'
import {State} from "./state";
import {getters} from "./getters"
import {mutations} from "./mutations";
import {actions} from "./actions";

export const key: InjectionKey<Store<State>> = Symbol()

export const index = createStore<State>({
	state: {
		address: "",
		connected: false
	},
	// computed properties (can return functions to make them parametrized)
	getters,
	// synchronous
	mutations,
	// asynchronous
	actions
})

// define your own `useStore` composition function
export function useStore() {
	return baseUseStore(key)
}