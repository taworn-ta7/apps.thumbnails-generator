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
			parameter: "Width x Height",
			width: "Width",
			height: "Height",
		},
		th: {
			title: "การเซ็ตค่ารูปภาพ",
			size: "เลือกขนาด",
			sizeAsPercent: "ขนาดเป็น %",
			sizeAsFix: "ขนาดเป็น กว้าง x ยาว",
			parameter: "กว้าง x ยาว",
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
				<div class="box">
					<h3>{{ t('size')}}</h3>
					<div class="body">
						<div class="item">
							<div class="text">
								<it-radio v-model="sizeValue" :label="t('sizeAsPercent')"
									:value="SizeEnumType.percent" />
							</div>
						</div>
						<div class="item">
							<div class="text">
								<it-radio v-model="sizeValue" :label="t('sizeAsFix')" :value="SizeEnumType.fix" />
							</div>
						</div>
					</div>
				</div>

				<!-- width and height -->
				<div class="box">
					<h3>{{ t('parameter')}}</h3>
					<div class="body">
						<div class="item">
							<div class="text">
								<it-number-input v-model="width" :placeholder="t('width')" :label-top="t('width')"
									:min="1" :step="5" />
							</div>
						</div>
						<div class="item">
							<div class="text">
								<it-number-input v-model="height" :placeholder="t('height')" :label-top="t('height')"
									:min="1" :step="5" />
							</div>
						</div>
					</div>
				</div>
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

.box {
	width: 100%;
}

.box h3 {
	padding: 0.5rem 1.0rem;
	display: block;
	background-color: #999;
	color: #fff;
}

.box .body {
	margin: 0 0 0.5rem;
}

.box .body .item {
	padding: 1.0rem 1.5rem 0;
	display: flex;
	flex-wrap: nowrap;
}

.box .body .item .text {
	flex: 1 0;
}

.box .body .item .subtext {
	margin: 0.5rem 1.0rem 0.5rem 2.0rem;
	font-size: 80%;
	color: #333;
}

.box .body .item .subtext2 {
	margin: 0.5rem;
	font-size: 80%;
	color: #333;
}

.box .body .item .icon {
	align-self: flex-start;
}
</style>
