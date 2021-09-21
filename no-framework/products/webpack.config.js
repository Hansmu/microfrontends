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
            filename: 'listOfFilesThatAreAvailableFromThisProjectAndDirectionsOnHowToLoadThem.js',
            exposes: {
                './AliasForExposedIndexFileFromProducts': './src/fileNameToExposeInProducts'
            }
        }),
        new HtmlWebpackPlugin({
            template: './public/index.html'
        })
    ]
}