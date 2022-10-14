import { app, BrowserWindow, ipcMain, dialog, nativeImage } from 'electron'
import * as path from 'path'
import * as fs from 'fs'
import { Image } from 'image-js'
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
		let image: Image
		try {
			image = await Image.load(source)
		}
		catch (Exception) {
			o.ok = false
			o.error = ErrorEnumType.cantOpenImage
			console.log(`error: cannot open image`)
			return o
		}

		// get image size
		console.log(`image size: (${image.width}, ${image.height})`)

		// reduces image size
		let w: number
		let h: number
		if (sizeEnum === SizeEnumType.percent) {
			// size as %
			w = Math.round(width * image.width / 100)
			h = Math.round(height * image.height / 100)
			console.log(`size as %, width=${w}, height=${h}`)
		} else {
			// size as fix
			w = width
			h = height
			console.log(`size as fix, width=${w}, height=${h}`)
		}

		// make thumbnail
		let thumb: Image
		try {
			thumb = image.resize({ width: w, height: h })
		}
		catch (Exception) {
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
		if (exists || retry >= 10) {
			o.ok = false
			o.error = ErrorEnumType.alreadyExists
			console.log(`error: already exists`)
			return o
		}
		o.target = filePath

		// output to file
		let saveOptions: any
		switch (extEnum) {
			case ExtEnumType.jpeg:
				saveOptions = { format: 'jpg' }
				break
			case ExtEnumType.png:
			default:
				saveOptions = { format: 'png' }
				break
		}
		try {
			await thumb.save(filePath, saveOptions)
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
