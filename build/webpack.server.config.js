const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base.config')
const VueSSRServerPlugin = require('vue-server-renderer/server-plugin')
const nodeExternals = require('webpack-node-externals')


module.exports = merge(baseConfig, {
    entry: './src/entry-server.js',
    target: 'node',
    output: {
        filename: 'server-bundle.js',
        libraryTarget: 'commonjs2'
    },
    externals: [nodeExternals({
        allowlist: [/\.css$/] 
    })],
    plugins: [
        new VueSSRServerPlugin()
    ]
})