<script setup lang="ts">
import { useI18n } from 'vue-i18n'

// exposed
defineExpose({
	/**
	 * Opens information box.
	 */
	infoBox(message: string): void {
		//infoMessage.value = message
		//infoOpen()
		alert(message)
	},

	/**
	 * Opens warning box.
	 */
	warningBox(message: string): void {
		//warningMessage.value = message
		//warningOpen()
		alert(message)
	},

	/**
	 * Opens error box.
	 */
	errorBox(message: string): void {
		//errorMessage.value = message
		//errorOpen()
		alert(message)
	},

	// ----------------------------------------------------------------------

	/**
	 * Open/close wait box.
	 */
	wait(open: boolean): void {
		// nothings to do, for now
	},

	/**
	 * Change current locale.
	 */
	changeLocale(newLocale: string): void {
		locale.value = newLocale
		console.log(`change locale to ${newLocale}`)
		localStorage.setItem('locale', newLocale)
	},
})

// using
const { locale } = useI18n({})
</script>

<template>
	<div id="dialog-box">
		<slot></slot>
	</div>
</template>

<style scope>
#dialog-box {
	display: flex;
	flex-flow: column nowrap;
	align-items: stretch;
	height: 100%;
	min-height: 100%;
}
</style>
