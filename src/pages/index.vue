<template>
	<img alt="Vue logo" :src="logo_url"/>
	<hello-world msg="Hello Vue 3 + TypeScript + Vite"></hello-world>
</template>

<script>
import HelloWorld from "@/components/HelloWorld";
import logo_url from '@/assets/logo.png'

export default {
	name: "index",
	components: {
		HelloWorld
	},
	data: () => ({
		logo_url
	})
}
</script>

<style scoped>

</style>