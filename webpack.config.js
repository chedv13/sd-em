const path = require('path');

const config1 = {
    entry: './src/index.ts',
    target: ['web', 'es5'],
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
        filename: 'index.js'
    }
};

module.exports = [
    config1
];
