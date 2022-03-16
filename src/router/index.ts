import {createRouter, createWebHistory, RouteRecordRaw, RouterOptions} from 'vue-router'
import index from '../views/index.vue'

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'index',
    component: index,
    meta: {
      hidden: true,
      requiresAuth: false
    }
  } as RouteRecordRaw,
  {
    path: '/staking',
    name: 'staking',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    meta: {
      hidden: false,
      requiresAuth: false
    },
    component: () => import(/* webpackChunkName: "staking" */ '../views/staking.vue')
  } as RouteRecordRaw,
  {
    path: '/wrapper',
    name: 'wrapper',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    meta: {
      hidden: false,
      requiresAuth: false
    },
    component: () => import(/* webpackChunkName: "staking" */ '../views/wrapper.vue')
  } as RouteRecordRaw
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
} as RouterOptions)

export default router
