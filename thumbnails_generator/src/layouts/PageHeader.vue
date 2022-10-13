<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useDialogStore } from '../DialogStore'

// props
const props = defineProps({
	'title': String,  // text to display title
})

// using
const { t } = useI18n({})
const dialogStore = useDialogStore()
</script>

<template>
	<header>
		<div id="app-bar">
			<div id="title">{{ props.title ?? t('app') }}</div>

			<button class="icon" :title="t('switchLocale.en')"
				@click.prevent="(e: Event) => dialogStore.changeLocale('en')">EN</button>
			<button class="icon" :title="t('switchLocale.th')"
				@click.prevent="(e: Event) => dialogStore.changeLocale('th')">TH</button>
		</div>
	</header>
</template>

<style scoped>
header {
	position: relative;
	display: block;
	margin: 0;
	padding: 0;
	background: #3c6;
}

#app-bar {
	display: flex;
	padding: 0.75rem 0.75rem 0.85rem;
}

#title {
	flex: 1 0;
	margin: 0 0 0 0.5rem;
	font-size: 175%;
	font-weight: bold;
	color: #333;
}

.icon {
	flex: 0 0;
	margin: 0;
	padding: 0.5rem;
}
</style>
