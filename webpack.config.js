const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: [{
                    loader: 'ts-loader',
                    options: {
                        configFile: "tsconfig.json"
                    }
                }],
                exclude: /node_modules/,
            }
        ],
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env.API_HOST': JSON.stringify(process.env.API_HOST || 'api.entd.tech'),
            'process.env.WEB_HOST': JSON.stringify(process.env.WEB_HOST || 'entd.tech'),
        }),
    ],
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    output: {
        globalObject: 'this',
        filename: 'index.js',
        library: {
            type: 'umd',
            umdNamedDefine: true,
        },
        path: path.resolve(__dirname, 'dist'),
    },
    target: ['web', 'es5', 'es6'],
};
