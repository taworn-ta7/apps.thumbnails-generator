<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { Thumbnail, ErrorEnumType } from '../models/thumbnail'
import { DirEnumType, ExtEnumType, SizeEnumType } from '../models/types'
//import { useDialogStore } from '../DialogStore'
import { useAppStore } from '../AppStore'

// using
const { t } = useI18n({
	messages: {
		en: {
			title: "Progress",
			wait: "please wait...",
			start: "Start",
			restart: "Restart",
		},
		th: {
			title: "การทำงาน",
			wait: "กรุณารอ...",
			start: "เริ่มต้น",
			restart: "เริ่มต้นอีกครั้ง",
		},
	},
})
const router = useRouter()
//const dialogStore = useDialogStore()
const appStore = useAppStore()

// states
const images = ref(<Thumbnail[]>[])
const started = ref(false)
const finished = ref(false)
const index = ref(0)

// on mounting
onMounted(() => {
	images.value = <Thumbnail[]>[]
	for (let i = 0; i < appStore.images.length; i++)
		images.value.push(appStore.images[i])

	console.log(`images.length: ${appStore.images.length}`)
	for (let i = 0; i < appStore.images.length; i++)
		console.log(` - ${i + 1}: ${appStore.images[i].source}`)
	console.log(`dirEnum: ${appStore.dirEnum}`)
	console.log(`dir: ${appStore.dir}`)
	console.log(`filePattern: ${appStore.filePattern}`)
	console.log(`extEnum: ${appStore.extEnum}`)
	console.log(`sizeEnum: ${appStore.sizeEnum}`)
	console.log(`width: ${appStore.width}`)
	console.log(`height: ${appStore.height}`)
})

// on unmounting
onBeforeUnmount(() => {
	appStore.clear()
})

function onBack() {
	router.replace('/photo')
}

function onNext() {
	if (!started.value) {
		started.value = true
		index.value = 0
		setTimeout(convert, 250)
		return
	}
	if (finished.value) {
		router.replace('/')
		return
	}
}

async function convert() {
	if (index.value >= appStore.images.length) {
		finished.value = true
		return
	}

	// send to main thread
	const idx = index.value
	index.value++
	// @ts-ignore
	const o = await bridge.makeThumbnail(
		images.value[idx].source,
		appStore.sizeEnum,
		appStore.width,
		appStore.height,
		appStore.dirEnum,
		appStore.dir,
		appStore.extEnum,
		appStore.filePattern,
	)

	// get result back
	const i = images.value[idx]
	i.target = o.target
	i.ok = o.ok
	i.error = o.error
	console.log(`image ${idx}: ${JSON.stringify(i, null, 2)}`)

	// next round
	setTimeout(convert, 250)
}

function errorToText(error: ErrorEnumType) {
	switch (error) {
		case ErrorEnumType.cantOpenImage:
			return 'error.cantOpenImage'
		case ErrorEnumType.cantCreateThumbImage:
			return 'error.cantCreateThumbImage'
		case ErrorEnumType.cantSaveImage:
			return 'error.cantSaveImage'
		case ErrorEnumType.alreadyExists:
			return 'error.alreadyExists'
	}
}
</script>

<template>
	<AppBox :title="t('title')">
		<div class="wrap">
			<div class="center">
				<ul>
					<li v-for="item in images">
						<div>
							<span :class="{ error: item.error }">{{ item.source }}</span>
							<div class=" subtext">{{ item.ok === null ? t('wait') :
							(item.ok ? item.target : t(errorToText(item.error!))) }}
							</div>
						</div>
						<it-icon :name="item.ok === null ? 'photo_size_select_large' : (item.ok ? 'check' : 'close')"
							outlined />
					</li>
				</ul>
			</div>

			<div style="display: flex">
				<div style="flex: 1 0">
					<it-button class="page-button" :disabled="started ? true : null"
						@click.prevent="(e: Event) => onBack()">{{ t('common.back') }}
					</it-button>
				</div>
				<div>
					<it-button type="primary" class="page-button" :disabled="started && !finished ? true : null"
						@click.prevent="(e: Event) => onNext()">{{
						!finished ? t('start') : t('restart') }}</it-button>
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
	flex: 1 0;
	align-content: stretch;
}

ul>li>div .subtext {
	margin: 0.5rem;
	font-size: 80%;
	color: #333;
}

ul>li>div .error {
	text-decoration: line-through;
}

ul>li>it-icon {
	align-self: flex-end;
}
</style>
