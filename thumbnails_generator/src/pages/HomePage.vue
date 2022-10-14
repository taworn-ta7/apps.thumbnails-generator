<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { Thumbnail } from '../models/thumbnail'
//import { useDialogStore } from '../DialogStore'
import { useAppStore } from '../AppStore'

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
//const dialogStore = useDialogStore()
const appStore = useAppStore()

// states
const receiver = ref()
const images = ref(<Thumbnail[]>[])

// on mounting
onMounted(() => {
	for (let i = 0; i < appStore.images.length; i++)
		images.value.push(appStore.images[i])

	receiver.value = document.getElementById('files-receiver')
	receiver.value.addEventListener('open-files-dialog-return', received)
})

// on unmounting
onBeforeUnmount(() => {
	receiver.value.removeEventListener('open-files-dialog-return', received)

	appStore.images = <Thumbnail[]>[]
	for (let i = 0; i < images.value.length; i++)
		appStore.images.push(images.value[i])
})

function received(e: Event) {
	e.preventDefault()
	const ev = e as CustomEvent
	const files = ev.detail
	console.log(`files: ${JSON.stringify(files, null, 2)}`)

	if (!files.canceled) {
		for (let i = 0; i < files.filePaths.length; i++) {
			if (images.value.findIndex((element: Thumbnail) => element.source === files.filePaths[i]) < 0)
				images.value.push(new Thumbnail(files.filePaths[i]))
		}
	}
}

function onAddFiles() {
	// @ts-ignore
	bridge.openFilesDialog()
}

function onClear() {
	images.value = <Thumbnail[]>[]
}

function onRemove(item: Thumbnail) {
	const index = images.value.findIndex((element: Thumbnail) => element.source === item.source)
	if (index >= 0)
		images.value.splice(index, 1)
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
		<div id="files-receiver" hidden></div>
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
				<ul>
					<li v-for="item in images">
						<div>{{ item.source }}</div>
						<it-icon name="delete" outlined @click.prevent="(e: Event) => onRemove(item)" />
					</li>
				</ul>
			</div>

			<div style="display: flex">
				<div style="flex: 1 0">
					<it-button type="black" class="page-button" @click.prevent="(e: Event) => onAbout()">{{
					t('about')
					}}</it-button>
				</div>
				<div>
					<it-button type="primary" class="page-button" :disabled="images.length <= 0 ? true : null"
						@click.prevent="(e: Event) => onNext()">{{
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

ul>li>div {
	flex: 2 0;
	align-content: stretch;
}

ul>li>it-icon {
	align-self: flex-end;
}
</style>
