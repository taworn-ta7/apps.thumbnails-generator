const { contextBridge, ipcRenderer } = require('electron')
import { SizeEnumType, DirEnumType, ExtEnumType } from "../models/types"

contextBridge.exposeInMainWorld('bridge', {
	node: process.versions.node,
	chrome: process.versions.chrome,
	electron: process.versions.electron,

	home: () => ipcRenderer.invoke('home-dir'),
	openFilesDialog: () => ipcRenderer.invoke('open-files-dialog'),
	openDirDialog: () => ipcRenderer.invoke('open-dir-dialog'),
	getImageSize: (fileName: string) => ipcRenderer.invoke('get-image-size', fileName),

	makeThumbnail: (
		source: string,
		sizeEnum: SizeEnumType,
		width: number,
		height: number,
		dirEnum: DirEnumType,
		dir: string,
		extEnum: ExtEnumType,
		filePattern: string,
	) => ipcRenderer.invoke('make-thumbnail',
		source,
		sizeEnum,
		width,
		height,
		dirEnum,
		dir,
		extEnum,
		filePattern,
	),
})

ipcRenderer.on('open-files-dialog-result', (event, files) => {
	const e = new CustomEvent<Electron.OpenDialogReturnValue>('open-files-dialog-return', {
		detail: files,
	})
	const r = document.getElementById('files-receiver')
	if (r)
		r.dispatchEvent(e)
})

ipcRenderer.on('open-dir-dialog-result', (event, dir) => {
	const e = new CustomEvent<Electron.OpenDialogReturnValue>('open-dir-dialog-return', {
		detail: dir,
	})
	const r = document.getElementById('dir-receiver')
	if (r)
		r.dispatchEvent(e)
})

// ----------------------------------------------------------------------

function domReady(condition: DocumentReadyState[] = ['complete', 'interactive']) {
	return new Promise(resolve => {
		if (condition.includes(document.readyState)) {
			resolve(true)
		} else {
			document.addEventListener('readystatechange', () => {
				if (condition.includes(document.readyState)) {
					resolve(true)
				}
			})
		}
	})
}

const safeDOM = {
	append(parent: HTMLElement, child: HTMLElement) {
		if (!Array.from(parent.children).find(e => e === child)) {
			return parent.appendChild(child)
		}
	},
	remove(parent: HTMLElement, child: HTMLElement) {
		if (Array.from(parent.children).find(e => e === child)) {
			return parent.removeChild(child)
		}
	},
}

/**
 * https://tobiasahlin.com/spinkit
 * https://connoratherton.com/loaders
 * https://projects.lukehaas.me/css-loaders
 * https://matejkustec.github.io/SpinThatShit
 */
function useLoading() {
	const className = `loaders-css__square-spin`
	const styleContent = `
@keyframes square-spin {
25% { transform: perspective(100px) rotateX(180deg) rotateY(0); }
50% { transform: perspective(100px) rotateX(180deg) rotateY(180deg); }
75% { transform: perspective(100px) rotateX(0) rotateY(180deg); }
100% { transform: perspective(100px) rotateX(0) rotateY(0); }
}
.${className} > div {
animation-fill-mode: both;
width: 50px;
height: 50px;
background: #fff;
animation: square-spin 3s 0s cubic-bezier(0.09, 0.57, 0.49, 0.9) infinite;
}
.app-loading-wrap {
position: fixed;
top: 0;
left: 0;
width: 100vw;
height: 100vh;
display: flex;
align-items: center;
justify-content: center;
background: #282c34;
z-index: 9;
}
`
	const oStyle = document.createElement('style')
	const oDiv = document.createElement('div')

	oStyle.id = 'app-loading-style'
	oStyle.innerHTML = styleContent
	oDiv.className = 'app-loading-wrap'
	oDiv.innerHTML = `<div class="${className}"><div></div></div>`

	return {
		appendLoading() {
			safeDOM.append(document.head, oStyle)
			safeDOM.append(document.body, oDiv)
		},
		removeLoading() {
			safeDOM.remove(document.head, oStyle)
			safeDOM.remove(document.body, oDiv)
		},
	}
}

// ----------------------------------------------------------------------

const { appendLoading, removeLoading } = useLoading()
domReady().then(appendLoading)

window.onmessage = ev => {
	ev.data.payload === 'removeLoading' && removeLoading()
}

setTimeout(removeLoading, 4999)
