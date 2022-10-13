import { defineStore } from 'pinia'

/**
 * Application shared service singleton class.
 */
export const useAppStore = defineStore({

	id: 'AppStore',

	state: () => ({
	}),

	actions: {

		/**
		 * Clears data to initial state.
		 */
		clear(): void {
		},

	},

})
