const path = require('path');

const config1 = {
    entry: "./src/index.ts",
    output: {
        filename: "./dist/bundle.js",
    },
    // Enable sourcemaps for debugging webpack's output.
    devtool: "source-map",
    resolve: {
        // Add '.ts' and '.tsx' as resolvable extensions.
        extensions: ["", ".webpack.js", ".web.js", ".ts", ".tsx", ".js"],
    },
    module: {
        rules: [
            // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
            {test: /\.tsx?$/, loader: "ts-loader"},
            // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
            {test: /\.js$/, loader: "source-map-loader"},
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
