<!--
  - Copyright (C) 2022 Do inc. - All Rights Reserved
  - Unauthorized copying of this file, via any medium is strictly prohibited
  - Proprietary and confidential
  - Written by Emanuele (ebalo) Balsamo <emanuele.balsamo@do-inc.co>
  -->

<template>
	<div class="min-h-screen">
		<l-head></l-head>
		<l-body>
			<slot></slot>
		</l-body>
		<l-foot></l-foot>
	</div>
</template>

<script lang="ts">
import LHead from "@/components/layout/0_head";
import LBody from "@/components/layout/1_body";
import LFoot from "@/components/layout/2_foot";

export default {
	name: "layout",
	components: {LFoot, LBody, LHead},
}
</script>

<style scoped>

</style>