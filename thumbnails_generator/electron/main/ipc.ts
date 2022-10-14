import { app, BrowserWindow, ipcMain, dialog, nativeImage } from 'electron'
import * as path from 'path'
import * as fs from 'fs'
import { SizeEnumType, DirEnumType, ExtEnumType } from '../models/types'
import { Thumbnail, ErrorEnumType } from '../models/thumbnail'

export function ipcWhenReady(win: BrowserWindow) {
	ipcMain.handle('home-dir', (event) => {
		const home = app.getPath('pictures')
		console.log(`home directory: ${home}`)
		return home
	})

	ipcMain.handle('open-files-dialog', (event) => {
		const options: Electron.OpenDialogOptions = {
			properties: ['openFile', 'multiSelections'],
			filters: [
				{ name: 'Image Files', extensions: ['png', 'jpeg', 'jpg'] },
				{ name: 'All Files', extensions: ['*'] }
			]
		}
		dialog.showOpenDialog(win, options).then((files: Electron.OpenDialogReturnValue) => {
			console.log(`files: ${JSON.stringify(files, null, 2)}`)
			event.sender.send('open-files-dialog-result', files)
		})
	})

	ipcMain.handle('open-dir-dialog', (event) => {
		const options: Electron.OpenDialogOptions = {
			properties: ['openDirectory'],
		}
		dialog.showOpenDialog(win, options).then((files: Electron.OpenDialogReturnValue) => {
			console.log(`dir: ${JSON.stringify(files, null, 2)}`)
			event.sender.send('open-dir-dialog-result', files)
		})
	})

	ipcMain.handle('get-image-size', (event, fileName) => {
		const image = nativeImage.createFromPath(fileName)
		if (image && !image.isEmpty()) {
			const size = image.getSize()
			console.log(`image size: (${size.width}, ${size.height}), path=${fileName}`)
			return size
		}
		else {
			console.log(`cannot open image, path=${fileName}`)
			return null
		}
	})

	ipcMain.handle('make-thumbnail', async (event,
		source: string,
		sizeEnum: SizeEnumType,
		width: number,
		height: number,
		dirEnum: DirEnumType,
		dir: string,
		extEnum: ExtEnumType,
		filePattern: string,
	) => {
		// prepares result
		const o = new Thumbnail(source)

		// loads image
		console.log(`load image: ${JSON.stringify(source, null, 2)}`)
		const image = nativeImage.createFromPath(source)
		if (!image || image.isEmpty()) {
			o.ok = false
			o.error = ErrorEnumType.cantOpenImage
			console.log(`error: cannot open image`)
			return o
		}

		// get size
		const size = image.getSize()
		console.log(`image size: (${size.width}, ${size.height})`)

		// reduces image size
		if (sizeEnum === SizeEnumType.percent) {
			// size as %
			size.width = Math.round(width * size.width / 100)
			size.height = Math.round(height * size.height / 100)
			console.log(`size as %, width=${size.width}, height=${size.height}`)
		} else {
			// size as fix
			size.width = width
			size.height = height
			console.log(`size as fix, width=${size.width}, height=${size.height}`)
		}

		// make thumbnail
		const thumb = await nativeImage.createThumbnailFromPath(source, size)
		if (!thumb) {
			o.ok = false
			o.error = ErrorEnumType.cantCreateThumbImage
			console.log(`error: cannot create thumbnail image`)
			return o
		}

		// output directory
		let folder = ''
		if (dirEnum === DirEnumType.sameAsSource) {
			// same as source
			const { dir } = path.parse(source)
			folder = dir
			console.log(`same as source, dir=${folder}`)
		} else {
			// directory fix
			folder = dir
			console.log(`fix directory, dir=${folder}`)
		}

		// output file type
		let ext = ''
		switch (extEnum) {
			case ExtEnumType.jpeg:
				ext = 'jpeg'
				break
			case ExtEnumType.png:
			default:
				ext = 'png'
				break
		}

		// output file name
		const { name } = path.parse(source)
		const re = /%([%FN])/g
		let filePath = ''
		let exists = false
		let retry = 0
		while (true) {
			var fileName = filePattern.replace(re, (sub: string, ...args: any[]) => {
				switch (sub) {
					case '%F':
						return name
					case '%N':
						return retry <= 0 ? '' : retry.toString()
					case '%%':
						return '%'
				}
				return ''
			})
			filePath = path.join(folder, `${fileName}.${ext}`)
			try {
				await fs.promises.access(filePath)
				exists = true
			}
			catch (ex) {
				exists = false
			}
			console.log(`${filePath}, exists=${exists}`)
			if (!exists) break
			if (retry >= 10) break
			retry++
		}
		if (exists) {
			o.ok = false
			o.error = ErrorEnumType.cantCreateThumbImage
			console.log(`error: already exists`)
			return o
		}
		o.target = filePath

		// output to file
		let buffer: Buffer
		switch (extEnum) {
			case ExtEnumType.jpeg:
				buffer = thumb.toJPEG(95)
				break
			case ExtEnumType.png:
			default:
				buffer = thumb.toPNG()
				break
		}
		try {
			await fs.promises.writeFile(filePath, buffer)
		}
		catch (Exception) {
			o.ok = false
			o.error = ErrorEnumType.cantSaveImage
			console.log(`error: cannot save image`)
			return o
		}

		o.ok = true
		console.log(`ok, ${o.target} saved :)`)
		return o
	})
}
