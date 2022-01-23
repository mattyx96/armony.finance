<template>
	<div class="min-h-screen">
		<l-head></l-head>
		<l-body>
			<slot></slot>
		</l-body>
		<l-foot></l-foot>
	</div>
</template>

<script>
import LHead from "@/components/layout/0_head";
import LBody from "@/components/layout/1_body";
import LFoot from "@/components/layout/2_foot";

export default {
	name: "layout",
	components: {LFoot, LBody, LHead}
}
</script>

<style scoped>

</style>