module.exports = {
    plugins: [
        ["@babel/plugin-transform-modules-umd", {
            exactGlobals: true,
            globals: {
                index: 'SD'
            }
        }]
    ],
    presets: [
        [
            '@babel/preset-env',
            {
                targets: {
                    node: 'current',
                },
            },
        ],
    ],
};
