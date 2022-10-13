import { defineStore } from 'pinia'
import { ErrorEnumType, Thumbnail } from './models/thumbnail'
import { DirEnumType, ExtEnumType, SizeEnumType } from './models/types';

/**
 * Application shared service singleton class.
 */
export const useAppStore = defineStore({

	id: 'AppStore',


	state: () => ({
		/**
		 * Image files.
		 */
		images: [],

		/**
		 * Directory usage.
		 */
		dirEnum: DirEnumType.sameAsSource,

		/**
		 * Directory name.
		 */
		dir: '',

		/**
		 * File pattern.
		 */
		filePattern: '%F-thumb%N',

		/**
		 * File extension type.
		 */
		extEnum: ExtEnumType.png,

		/**
		 * Sizing method.
		 */
		sizeEnum: SizeEnumType.percent,

		/**
		 * Width, can be % or fix
		 */
		width: 50,

		/**
		 * Height, can be % or fix
		 */
		height: 50,
	}),

	actions: {
		/**
		 * Setup dialog store.  Run once only.
		 */
		setup() {
			this.clear()
		},

		// ----------------------------------------------------------------------

		/**
		 * Clears data to initial state.
		 */
		clear(): void {
			this.images = []
		},
	},

})
