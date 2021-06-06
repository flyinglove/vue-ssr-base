const Vue = require('vue')
const express = require('express')
const fs = require('fs')
const { createBundleRenderer } = require('vue-server-renderer')
const setupDevServer = require('./build/setup-dev-server.js')
// const renderer = require('vue-server-renderer').createBundleRenderer(serverBundle, {
//     template,
//     clientManifest
// })

const isProd = process.env.NODE_ENV === 'production'
const server = express()

let renderer
let onReady
if (isProd) {
    const serverBundle = require('./dist/vue-ssr-server-bundle.json')
    const clientManifest = require('./dist/vue-ssr-client-manifest.json')
    const template = fs.readFileSync('./index.template.html', 'utf-8')
    renderer = createBundleRenderer(serverBundle, {
        template,
        clientManifest
    })
} else {
    // 监听打包构建， 重新生成renderer
    onReady = setupDevServer(server, (serverBundle, clientManifest, template) => {
        renderer = createBundleRenderer(serverBundle, {
            template,
            clientManifest
        })
        return render
    })
}


server.use('/dist', express.static('./dist'))


const render = async (req, res) => {
    try {
        const html = await renderer.renderToString({
            title: '拉钩',
            meta: `<meta name="description" content="拉钩" />`,
            url: req.url
        })
        res.setHeader('Content-Type', 'text/html; charset=utf8')
        res.end(html)
    }catch(e) {
        (err) => {
            res.status(500).end('Internal Server Error.')
            
        }
    }
}
server.get('*', isProd ? render : async (req, res) => {
    await onReady
    render(req, res)
})

server.listen(3000, () => {
    console.log('server running at port 3000')
})
