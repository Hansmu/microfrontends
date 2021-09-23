const {merge} = require('webpack-merge'); // allows us to merge Webpack configs.
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const commonConfig = require('./webpack.common');
const packageJson = require('../package.json');

const devConfig = {
    mode: 'development',
    devServer: {
        port: 8082,
        historyApiFallback: {
            index: 'index.html'
        }
    },
    plugins: [
        new ModuleFederationPlugin({
            name: 'auth',
            filename: 'remoteEntry.js',
            exposes: {
                './AuthApp': './src/app/index' // Exporting mount, because we're trying to be library agnostic
            },
            shared: packageJson.dependencies // If you want to be very specific about the modules that you are sharing,
            // then you might not necessarily want to do this, but usually this is a nice simplification.
        }),
        new HtmlWebpackPlugin({
            template: './public/index.html'
        })
    ]
};

module.exports = merge(commonConfig, devConfig);