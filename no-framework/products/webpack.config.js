const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin')

module.exports = {
    mode: 'development',
    devServer: {
        port: 8081
    },
    plugins: [
        // DEPENDENCY
        new ModuleFederationPlugin({
            name: 'nameOfTheProductsProject',
            filename: 'remoteEntry.js',
            exposes: {
                './AliasForExposedIndexFileFromProducts': './src/fileNameToExposeInProducts'
            },
            shared: ['faker']
        }),
        new HtmlWebpackPlugin({
            template: './public/index.html'
        })
    ]
}