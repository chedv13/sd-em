const path = require('path');

const config1 = {
    entry: "./src/index.ts",
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: "index.js",
    },
    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader"
            },
            {
                test: /\.js$/,
                loader: "source-map-loader"
            },
        ],
    },
    // entry: './src/index.ts',
    // module: {
    //     rules: [
    //         {
    //             test: /\.ts$/,
    //             use: [{
    //                 loader: 'ts-loader',
    //                 options: {
    //                     configFile: "tsconfig.json"
    //                 }
    //             }],
    //             exclude: /node_modules/,
    //         }
    //     ]
    // },
    // resolve: {
    //     extensions: ['.ts'],
    // },
    // output: {
    //     path: path.resolve(__dirname, 'dist'),
    //     filename: 'index.js',
    //     library: 'SD',
    //     libraryTarget: 'umd'
    // }
};

module.exports = [
    config1
];
