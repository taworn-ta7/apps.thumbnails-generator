<script setup lang="ts">
//import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

// using
const { t } = useI18n({
	messages: {
		en: {
			title: "Directory and File",
			directory: "Directory",
			dirAsSame: "Same as source images",
			dirAsFix: "Select directory...",
			file: "File",
			fileOutput: "File pattern",
			fileHint: "%F - Filename without extension\n%N - Number of trying\n%% - Percent (%) sign",
			type: "Type",
			png: "PNG",
			jpeg: "JPEG",
		},
		th: {
			title: "Directory และไฟล์",
			directory: "Directory",
			dirAsSame: "เหมือนกับต้นทาง",
			dirAsFix: "เลือก directory...",
			file: "ไฟล์",
			fileOutput: "รูปแบบไฟล์",
			fileHint: "%F - ชื่อไฟล์ ไม่รวมนามสกุล\n%N - จำนวนครั้งที่ลอง\n%% - เครื่องหมายเปอร์เซ็นต์ (%)",
			type: "ชนิด",
			png: "PNG",
			jpeg: "JPEG",
		},
	},
})
const router = useRouter()

function onBack() {
	router.replace('/')
}

function onNext() {
	router.replace('/photo')
}
</script>

<template>
	<AppBox :title="t('title')">
		<div class="wrap">
			<div class="center">
				location...
			</div>

			<div style="display: flex">
				<div style="flex: 1 0">
					<button class="page-button" @click.prevent="(e: Event) => onBack()">{{ t('common.back') }}</button>
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
