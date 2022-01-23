<!--
  - Copyright (C) 2022 Do inc. - All Rights Reserved
  - Unauthorized copying of this file, via any medium is strictly prohibited
  - Proprietary and confidential
  - Written by Emanuele (ebalo) Balsamo <emanuele.balsamo@do-inc.co>
  -->

<template>
	<layout>
		<router-view></router-view>
	</layout>
</template>
<script lang="ts">
import Layout from "components/layout";
import {defineComponent} from "vue";

export default defineComponent({
	components: {Layout}
})
</script>