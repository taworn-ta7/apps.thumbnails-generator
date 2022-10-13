import { createApp } from 'vue'
import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import th from './locales/th.json'
import App from './App.vue'

/**
 * If you enables use of Node.js API in the Renderer-process
 * ```
 * npm i -D vite-plugin-electron-renderer
 * ```
 * @see - https://github.com/electron-vite/vite-plugin-electron/tree/main/packages/electron-renderer#electron-renderervite-serve
 */
// import './samples/node-api'

const messages = {
	en,
	th,
}

const i18n = createI18n({
	legacy: false,
	locale: 'en',
	fallbackLocale: 'en',
	messages,
})

createApp(App)
	.use(i18n)
	.mount('#app')
	.$nextTick(() => {
		postMessage({ payload: 'removeLoading' }, '*')
	})
