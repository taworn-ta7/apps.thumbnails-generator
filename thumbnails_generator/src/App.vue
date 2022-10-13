<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://vuejs.org/api/sfc-script-setup.html#script-setup
//import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
	<router-view></router-view>
</template>

<style>
*,
*::before,
*::after {
	box-sizing: border-box;
	position: relative;
	margin: 0;
	font-weight: normal;
}

body {
	font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu,
		Cantarell, 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
	font-size: 15px;
	text-rendering: optimizeLegibility;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	line-height: 1.6;
	background: var(--c-background);
	color: var(--c-color);
	min-height: 100vh;
}

html,
body,
#app {
	margin: 0;
	padding: 0;
	height: 100%;
}
</style>
