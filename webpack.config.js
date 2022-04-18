const path = require('path');

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
