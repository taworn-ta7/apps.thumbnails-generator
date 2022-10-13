<script setup lang="ts">
//import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

// using
const { t } = useI18n({
	messages: {
		en: {
			title: "Photo Settings",
			size: "Sizing",
			sizeAsPercent: "Size as percent",
			sizeAsFix: "Size as fix width and height",
			width: "Width",
			height: "Height",
		},
		th: {
			title: "การเซ็ตค่ารูปภาพ",
			size: "เลือกขนาด",
			sizeAsPercent: "ขนาดเป็น %",
			sizeAsFix: "ขนาดเป็น กว้าง x ยาว",
			width: "ความกว้าง",
			height: "ความยาว",
		},
	},
})
const router = useRouter()

function onBack() {
	router.replace('/location')
}

function onNext() {
	router.replace('/progress')
}
</script>

<template>
	<AppBox :title="t('title')">
		<div class="wrap">
			<div class="center">
				photo...
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
