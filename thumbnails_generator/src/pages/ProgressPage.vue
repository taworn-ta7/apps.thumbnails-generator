<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { Thumbnail } from '../models/thumbnail'
import { DirEnumType, ExtEnumType, SizeEnumType } from '../models/types'
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

function convert() {
	if (index.value >= appStore.images.length) {
		finished.value = true
		return
	}

	// get current thumbnail
	const idx = index.value
	index.value++
	const o = images.value[idx];
	console.log(`#${idx}: ${o.source}`);

	/*
	// get image source
	var sourceFile = File(o.source);
	var basename = path.basenameWithoutExtension(o.source);
	var data = await sourceFile.readAsBytes();
	Image? image;
	if (data.isNotEmpty) {
	  try {
		image = decodeImage(data);
	  } catch (ex) {
		log.warning(ex);
		image = null;
	  }
	}
	if (image == null) {
	  _errorHandle(o, ErrorEnumType.cantOpenImage);
	  log.warning("#$index: ${o.error}");
	  return;
	}
	*/

	// reduces image, get size
	let w = 0, h = 0
	if (appStore.sizeEnum === SizeEnumType.percent) {
		// size as %
		/*
		w = appStore.width * image.width / 100;
		h = appStore.height * image.height / 100;
		log.info("#$index: size as %, width=$w, height=$h");
		*/
	} else {
		// size as fix
		w = appStore.width;
		h = appStore.height;
		console.log(`#${idx}: size as fix, width=${w}, height=${h}`);
	}

	/*
	// make thumbnail
	Image ? thumbnail;
	try {
		thumbnail = copyResize(image, width: w, height: h);
	} on Exception {
		thumbnail = null;
	}
	if (thumbnail == null) {
		_errorHandle(o, ErrorEnumType.cantSaveImage);
		log.warning("#$index: ${o.error}");
		return;
	}
	*/

	// output directory
	let dir = '';
	if (appStore.dirEnum === DirEnumType.sameAsSource) {
		// same as source
		/*
		dir = sourceFile.parent.path;
		log.info("#$index: same as source, dir=$dir");
		*/
	} else {
		// directory fix
		dir = appStore.dir;
		console.log(`#${idx}: fix directory, dir=${dir}`);
	}

	// output file type
	let ext = '';
	switch (appStore.extEnum) {
		case ExtEnumType.jpeg:
			ext = 'jpeg';
			break;
		case ExtEnumType.png:
		default:
			ext = 'png';
			break;
	}

	/*
	// output file name
	let filePath = '';
	let exists = false;
	let retry = 0;
	while (true) {
		var fileName = appStore.filePattern.replaceAllMapped(re, (match) {
			switch (match[1]) {
				case 'F':
					return basename;
				case 'N':
					return retry <= 0 ? '' : retry.toString();
				case '%':
					return '%';
			}
			return '';
		});
		filePath = path.join(dir, '$fileName.$ext');
		exists = await File(filePath).exists();
		log.info("#$index: $filePath, exists=$exists");
		if (!exists) break;
		if (retry >= AppShare.maxRetry) break;
		retry++;
	}
	if (exists) {
		_errorHandle(o, ErrorEnumType.alreadyExists);
		log.warning("#$index: ${o.error}");
		return;
	}
	
	// output to file
	switch (appStore.extEnum) {
		case ExtEnumType.jpeg:
			await File(filePath).writeAsBytes(encodeJpg(thumbnail));
			break;
		case ExtEnumType.png:
		default:
			await File(filePath).writeAsBytes(encodePng(thumbnail));
			break;
	}
	
	setState(() {
		o.target = filePath;
		o.ok = true;
	});
	*/
	o.ok = true
	console.log(`#${idx}: ok :)`);
	setTimeout(convert, 250)
}
</script>

<template>
	<AppBox :title="t('title')">
		<div class="wrap">
			<div class="center">
				<ul>
					<li v-for="item in images">
						<div>{{ item.source }}</div>
						<it-icon :name="item.ok ? 'check' : 'photo_size_select_large'" outlined />
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
