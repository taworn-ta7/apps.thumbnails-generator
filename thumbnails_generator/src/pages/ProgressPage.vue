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
//const dialogStore = useDialogStore()
const appStore = useAppStore()

// states
const images = ref(<Thumbnail[]>[])
const started = ref(false)
const finished = ref(false)

// on mounting
onMounted(() => {
	images.value = <Thumbnail[]>[]
	for (let i = 0; i < appStore.images.length; i++)
		images.value.push(appStore.images[i])
})

// on unmounting
onBeforeUnmount(() => {
	appStore.images = <Thumbnail[]>[]
	for (let i = 0; i < images.value.length; i++)
		appStore.images.push(images.value[i])
})

function onBack() {
	router.replace('/photo')
}

function onNext() {
	started.value = true
}
</script>

<template>
	<AppBox :title="t('title')">
		<div class="wrap">
			<div class="center">
				<ul>
					<li v-for="item in images">
						<div>{{ item.source }}</div>
						<it-icon name="photo_size_select_large" outlined />
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
	flex: 2 0;
	align-content: stretch;
}

ul>li>it-icon {
	align-self: flex-end;
}
</style>
