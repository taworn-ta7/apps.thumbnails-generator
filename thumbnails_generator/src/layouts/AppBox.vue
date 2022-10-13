<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDialogStore } from '../DialogStore'
import PageHeader from './PageHeader.vue'
import PageFooter from './PageFooter.vue'
import DialobBox from './DialobBox.vue'

// props
const props = defineProps({
	'title': String,  // text to display title
})

// using
const { t } = useI18n({
	messages: {
		en: {
		},
		th: {
		},
	},
})
const dialogStore = useDialogStore()

// states
const box = ref()

// on mounting
onMounted(() => {
	dialogStore.box = box
})
</script>

<template>
	<DialobBox ref="box">
		<PageHeader :title="props.title" />
		<div id="body">
			<main id="page" :style="{ margin: 0 }">
				<slot></slot>
			</main>
		</div>
		<PageFooter />
	</DialobBox>
</template>

<style scoped>
#body {
	display: flex;
	flex: 1 0;
	flex-wrap: wrap;
	align-items: stretch;
}

#page {
	flex: 1 0;
}
</style>
