const path = require('path');

const config1 = {
    entry: './src/index.ts',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            }
        ]
    },
    resolve: {
        extensions: ['.ts'],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.js',
        library: 'SD',
        libraryTarget: 'umd'
    }
};

module.exports = [
    config1
];
