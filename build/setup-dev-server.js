const fs = require('fs')
const path = require('path')
const chokidar = require('chokidar')
const webpack = require('webpack')
const devMiddleware = require('webpack-dev-middleware')
const hotMiddleware = require('webpack-hot-middleware')

const resolve = (file) => {
    return path.resolve(__dirname, file)
}
module.exports = (server, callback) => {
    let ready
    const onReady = new Promise(r => {
        ready = r
    })
    let template
    let serverBundle
    let clientManifest

    const update = () => {
        console.log('update', !!template, !!serverBundle, !!clientManifest)
        if (template && serverBundle && clientManifest) {
            ready()
            callback(serverBundle, clientManifest, template)
        }
    }
    const templatePath = path.resolve(__dirname, '../index.template.html')
    template = fs.readFileSync(templatePath, 'utf-8')
    update()
    chokidar.watch(templatePath).on('change', () => {
        template = fs.readFileSync(templatePath, 'utf-8')
        update()
    })
    const serverConfig = require('./webpack.server.config')
    const serverCompiler = webpack(serverConfig)
    const serverDevMiddleware = devMiddleware(serverCompiler, {
        logLevel: 'silent'
    })
    serverCompiler.hooks.done.tap('server', () => {
        serverBundle = JSON.parse(
            serverDevMiddleware.fileSystem.readFileSync(resolve('../dist/vue-ssr-server-bundle.json'), 'utf-8')
        )
        update()
    })
    // serverCompiler.watch({}, (err, stats) => {
    //     if (err) throw err
    //     if (stats.hasErrors()) return
    //     console.log('success')
    //     serverBundle = JSON.parse(fs.readFileSync(resolve('../dist/vue-ssr-server-bundle.json'), 'utf-8'))
    //     update()
    // })

    const clientConfig = require('./webpack.client.config')
    clientConfig.plugins.push(
        new webpack.HotModuleReplacementPlugin()
    )
    clientConfig.entry.app = ['webpack-hot-middleware/client?quiet=true&reload=true', clientConfig.entry.app]
    clientConfig.output.filename = '[name].js'
    const clientCompiler = webpack(clientConfig)
    const clientDevMiddleware = devMiddleware(clientCompiler, {
        publicPath: clientConfig.output.publicPath,
        logLevel: 'silent'
    })
    clientCompiler.hooks.done.tap('client', () => {
        console.log('client-bundle-start')
        // console.log(clientDevMiddleware.fileSystem.readFileSync('../dist/vue-ssr-server-bundle.json', 'utf-8'))
        clientManifest = JSON.parse(
            clientDevMiddleware.fileSystem.readFileSync(resolve('../dist/vue-ssr-client-manifest.json'), 'utf-8')
        )

        update()
    })

    server.use(clientDevMiddleware)
    server.use(hotMiddleware(clientCompiler, {
        log: false
    }))
    return onReady
}