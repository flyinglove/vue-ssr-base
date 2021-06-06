import { createApp } from './app'

export default async context => {
    const {app, router, store} =  createApp()
    console.log(2333)
    const meta = app.$meta()
    router.push(context.url)
    context.meta = meta
    try {
        await new Promise(router.onReady.bind(router))
        context.rendered = () => {
            context.state = store.state
        }
        return app
    } catch(e) {
        throw e 
    }
}