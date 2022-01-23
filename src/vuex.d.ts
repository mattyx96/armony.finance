/*
 * Copyright (C) 2022 Do inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Emanuele (ebalo) Balsamo <emanuele.balsamo@do-inc.co>
 */

import {Store} from 'vuex'
import {State} from "store"

declare module '@vue/runtime-core' {
	// provide typings for `this.$store`
	interface ComponentCustomProperties {
		$store: Store<State>
	}
}