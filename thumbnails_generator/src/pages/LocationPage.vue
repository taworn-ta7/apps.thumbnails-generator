<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { DirEnumType, ExtEnumType } from '../models/types'
//import { useDialogStore } from '../DialogStore'
import { useAppStore } from '../AppStore'

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
			fileDefault: "Use Default",
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
			fileHint: "%F - ชื่อไฟล์ ไม่รวมนามสกุล%N - จำนวนครั้งที่ลอง\n%% - เครื่องหมายเปอร์เซ็นต์ (%)",
			fileDefault: "ใช้ค่ามาตรฐาน",
			type: "ชนิด",
			png: "PNG",
			jpeg: "JPEG",
		},
	},
})
const router = useRouter()
//const dialogStore = useDialogStore()
const appStore = useAppStore()

// states
const dirValue = ref(appStore.dirEnum)
const dir = ref(appStore.dir)
const filePattern = ref(appStore.filePattern)
const typeValue = ref(appStore.extEnum)

// on mounting
onMounted(() => {
})

// on unmounting
onBeforeUnmount(() => {
	appStore.dirEnum = dirValue.value
	appStore.dir = dir.value
	appStore.filePattern = filePattern.value
	appStore.extEnum = typeValue.value
})

function onChooseDir() {
	console.log(`dir: ${dir.value}`)
}

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
				<!-- directory -->
				<ul>
					<li>{{ t('directory')}}</li>
					<li>
						<div>
							<it-radio v-model="dirValue" :label="t('dirAsSame')" :value="DirEnumType.sameAsSource" />
						</div>
					</li>
					<li>
						<div>
							<it-radio v-model="dirValue" :label="t('dirAsFix')" :value="DirEnumType.chooseDir" />
						</div>
						<div>{{ dir }}</div>
						<it-icon name="more_horiz" outlined @click.prevent="(e: Event) => onChooseDir()" />
					</li>
				</ul>

				<!-- file -->
				<ul>
					<li>{{ t('file') }}</li>
					<li>
						<it-input v-model="filePattern" status="warning" :message="t('fileHint')"
							:placeholder="t('fileOutput')" />
						<it-button type="black" class="page-button"
							@click.prevent="(e: Event) => filePattern = '%F-thumb%N'">{{
							t('fileDefault')
							}}</it-button>
					</li>
				</ul>

				<!-- type -->
				<ul>
					<li>{{ t('type') }}</li>
					<li>
						<div>
							<it-radio v-model="typeValue" :label="t('png')" :value="ExtEnumType.png" />
						</div>
					</li>
					<li>
						<div>
							<it-radio v-model="typeValue" :label="t('jpeg')" :value="ExtEnumType.jpeg" />
						</div>
					</li>
				</ul>
			</div>

			<div style="display: flex">
				<div style="flex: 1 0">
					<it-button class="page-button" @click.prevent="(e: Event) => onBack()">{{ t('common.back')
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
