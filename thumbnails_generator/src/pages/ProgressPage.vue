<script setup lang="ts">
//import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

// using
const { t } = useI18n({
	messages: {
		en: {
			title: "Progress",
			start: "Start",
			restart: "Restart",
		},
		th: {
			title: "การทำงาน",
			start: "เริ่มต้น",
			restart: "เริ่มต้นอีกครั้ง",
		},
	},
})
const router = useRouter()

function onBack() {
	router.replace('/photo')
}

function onNext() {
	console.log(`next round...`)
}
</script>

<template>
	<AppBox :title="t('title')">
		<div class="wrap">
			<div class="center">
				progress...
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
