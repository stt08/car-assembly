import { createRouter, createWebHistory } from 'vue-router'
import { createApp } from 'vue'
import App from './App.vue'

import QrReader from 'vue3-qr-reader';

const routes = [
  {path: '/', component: () => import('./components/HelloWorld.vue')},
  {path: '/storage', component: () => import('./components/StoragePage.vue')},
  {path: '/products', component: () => import('./components/ProductsPage.vue')},
  {path: '/assembly', component: () => import('./components/AssemblyPage.vue')},
  {path: '/admin', component: () => import('./components/AdminPage.vue')}
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})


createApp(App).use(router).use(QrReader).mount('#app')
