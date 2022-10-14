<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { SizeEnumType } from '../models/types'
//import { useDialogStore } from '../DialogStore'
import { useAppStore } from '../AppStore'

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
//const dialogStore = useDialogStore()
const appStore = useAppStore()

// states
const sizeValue = ref(appStore.sizeEnum)
const width = ref(appStore.width)
const height = ref(appStore.height)

// on mounting
onMounted(() => {
})

// on unmounting
onBeforeUnmount(() => {
	appStore.sizeEnum = sizeValue.value
	appStore.width = width.value
	appStore.height = height.value
})

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
				<!-- size -->
				<ul>
					<li>{{ t('size')}}</li>
					<li>
						<div>
							<it-radio v-model="sizeValue" :label="t('sizeAsPercent')" :value="SizeEnumType.percent" />
						</div>
					</li>
					<li>
						<div>
							<it-radio v-model="sizeValue" :label="t('sizeAsFix')" :value="SizeEnumType.fix" />
						</div>
					</li>

					<!-- width -->
					<li>
						<div>
							<it-number-input v-model="width" :placeholder="t('width')" :min="1" :step="5" />
						</div>
						<div>
							<it-number-input v-model="height" :placeholder="t('height')" :min="1" :step="5" />
						</div>
					</li>
				</ul>

			</div>

			<div style="display: flex">
				<div style="flex: 1 0">
					<it-button class="page-button" @click.prevent="(e: Event) => onBack()">{{ t('common.back') }}
					</it-button>
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

ul {
	margin: 0;
	padding: 0;
	display: block;
	list-style-type: none;
	width: 100%;
}

ul>li {
	margin: 0;
	padding: 0.5rem;
	white-space: nowrap;
	display: flex;
	flex-wrap: nowrap;
	align-items: center;
}

ul>li:nth-of-type(odd) {
	background-color: #ccc;
}
</style>
