<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

// using
const { t } = useI18n({
	messages: {
		en: {
			addFiles: "Add File(s)...",
			clear: "Clear",
			about: "About...",
		},
		th: {
			addFiles: "เพิ่มไฟล์...",
			clear: "ลบไฟล์ทั้งหมด",
			about: "เกี่ยวกับ...",
		},
	},
})
const router = useRouter()

// states
const receiver = ref()

// on mounting
onMounted(() => {
	receiver.value = document.getElementById('receiver')
	receiver.value.addEventListener('open-files-dialog-return', received)
})

// on unmounting
onBeforeUnmount(() => {
	receiver.value.removeEventListener('open-files-dialog-return', received)
})

function received(e: Event) {
	e.preventDefault()
	const ev = e as CustomEvent
	const files = ev.detail
	console.log(`files: ${JSON.stringify(files, null, 2)}`)
}

function onAddFiles() {
	// @ts-ignore
	bridge.openFilesDialog('showOpenDialog')
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
	<AppBox :title="t('app')">
		<div id="receiver" hidden></div>
		<div class="wrap">
			<div style="display: flex">
				<div style="flex: 1 0">
					<it-button type="success" class="page-button" @click.prevent="(e: Event) => onAddFiles()">{{
					t('addFiles') }}</it-button>
				</div>
				<div>
					<it-button type="success" outlined class="page-button" @click.prevent="(e: Event) => onClear()">{{
					t('clear') }}</it-button>
				</div>
			</div>

			<div class="center">
				home...
			</div>

			<div style="display: flex">
				<div style="flex: 1 0">
					<it-button type="black" class="page-button" @click.prevent="(e: Event) => onAbout()">{{
					t('about')
					}}</it-button>
				</div>
				<div>
					<it-button type="primary" class="page-button" @click.prevent="(e: Event) => onNext()">{{
					t('common.next') }}</it-button>
				</div>
			</div>
		</div>
	</AppBox>
</template>

<style scoped>
@import "../assets/page.css";
</style>
