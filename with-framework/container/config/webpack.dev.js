const {merge} = require('webpack-merge'); // allows us to merge Webpack configs.
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const commonConfig = require('./webpack.common');
const packageJson = require('../package.json');

const port = 8080;

const devConfig = {
    mode: 'development',
    output: {
        publicPath: `http://localhost:${port}/`
    },
    devServer: {
        port,
        historyApiFallback: {
            index: 'index.html'
        }
    },
    plugins: [
        new ModuleFederationPlugin({
            name: 'container',
            remotes: {
                marketing: 'marketing@http://localhost:8081/remoteEntry.js'
            },
            shared: packageJson.dependencies // If you want to be very specific about the modules that you are sharing,
            // then you might not necessarily want to do this, but usually this is a nice simplification.
        })
    ]
};

module.exports = merge(commonConfig, devConfig);