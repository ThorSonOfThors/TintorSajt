import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

import HomePage from '../components/HomePage.vue'
import OrderForm from '../components/OrderForm.vue'
import EncryptDecrypt from '../components/EncryptDecrypt.vue'


const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: HomePage,
  },
  {
    path: '/orders',
    name: 'Orders',
    component: OrderForm,
  },
    {
    path: '/encrypt',
    name: 'Encrypt Messages',
    component: EncryptDecrypt,
  },
  


]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
