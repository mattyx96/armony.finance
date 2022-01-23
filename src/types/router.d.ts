/*
 * Copyright (C) 2022 Do inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Emanuele (ebalo) Balsamo <emanuele.balsamo@do-inc.co>
 */

import 'vue-router';

declare module 'vue-router' {
	interface RouteMeta {
		hidden?: boolean,
		requiresAuth?: boolean,
	}
}