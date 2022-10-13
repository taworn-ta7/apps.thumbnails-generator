import { defineStore } from 'pinia'

export const useDialogStore = defineStore({

	id: 'DialogStore',

	state: () => ({
		box: <any>null,
		locale: 'en',
	}),

	actions: {
		/**
		 * Setup dialog store.  Run once only.
		 */
		setup() {
		},

		// ----------------------------------------------------------------------

		/**
		 * Opens information box.
		 */
		infoBox(message: string): void {
			this.box.infoBox(message)
			console.log(`infoBox: ${message}`)
		},

		/**
		 * Opens warning box.
		 */
		warningBox(message: string): void {
			this.box.warningBox(message)
			console.log(`warningBox: ${message}`)
		},

		/**
		 * Opens error box.
		 */
		errorBox(message: string): void {
			this.box.errorBox(message)
			console.log(`errorBox: ${message}`)
		},

		// ----------------------------------------------------------------------

		/**
		 * Opens wait box and wait for callback is finished.
		 */
		async waitBox<T>(callback: () => Promise<T>): Promise<T> {
			this.box.wait(true)
			console.log(`waitBox: open`)
			const ret = await callback()
			this.box.wait(false)
			console.log(`waitBox: close`)
			return ret
		},

		// ----------------------------------------------------------------------

		/**
		 * Changes current locale.
		 */
		changeLocale(locale: string): void {
			this.box.changeLocale(locale)
		},
	},

})
