import Vue from 'vue'
import App from './App.vue'
import { createRouter } from './router'
import VueMeta from 'vue-meta'
import { createStore } from './store'

Vue.use(VueMeta)
Vue.mixin({
    metaInfo: {
        titleTemplate: '%s - 拉钩教育'
    }
})
export function createApp() {
    let router = createRouter()
    const store = createStore()
    const app = new Vue({
        render: h => h(App),
        router,
        store
    })
    return { app, router, store }
}