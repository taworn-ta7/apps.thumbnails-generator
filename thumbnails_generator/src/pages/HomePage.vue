<script setup lang="ts">
//import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

// using
const { t } = useI18n({
	messages: {
		en: {
			title: "@:app",
			addFiles: "Add File(s)...",
			clear: "Clear",
			about: "About...",
		},
		th: {
			title: "@:app",
			addFiles: "เพิ่มไฟล์...",
			clear: "ลบไฟล์ทั้งหมด",
			about: "เกี่ยวกับ...",
		},
	},
})
const router = useRouter()

function onAddFiles() {
	console.log(`on add files...`)
}

function onClear() {
	console.log(`on clear...`)
}

function onAbout() {
	console.log(`on about...`)
}

function onNext() {
	router.replace('/location')
}
</script>

<template>
	<AppBox :title="t('title')">
		<div class="wrap">
			<div style="display: flex">
				<div style="flex: 1 0">
					<button class="page-button" @click.prevent="(e: Event) => onAddFiles()">{{ t('addFiles') }}</button>
				</div>
				<div>
					<button class="page-button" @click.prevent="(e: Event) => onClear()">{{ t('clear') }}</button>
				</div>
			</div>

			<div class="center">
				home...
			</div>

			<div style="display: flex">
				<div style="flex: 1 0">
					<button class="page-button" @click.prevent="(e: Event) => onAbout()">{{ t('about') }}</button>
				</div>
				<div>
					<button class="page-button" @click.prevent="(e: Event) => onNext()">{{ t('common.next') }}</button>
				</div>
			</div>
		</div>
	</AppBox>
</template>

<style scoped>
@import "../assets/page.css";
</style>
