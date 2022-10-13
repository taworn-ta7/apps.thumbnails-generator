import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes: [
		{
			path: "/",
			name: "home",
			component: async () => await import('./pages/HomePage.vue'),
		},
		{
			path: "/location",
			name: "location",
			component: async () => await import('./pages/LocationPage.vue'),
		},
		{
			path: "/photo",
			name: "photo",
			component: async () => await import('./pages/PhotoPage.vue'),
		},
		{
			path: "/progress",
			name: "progress",
			component: async () => await import('./pages/ProgressPage.vue'),
		},
	],
})

export default router
