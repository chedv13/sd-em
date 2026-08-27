// Заменяются на строки во время сборки через webpack.DefinePlugin (см. webpack.config.js).
declare const process: {
    env: {
        API_HOST: string;
        WEB_HOST: string;
    };
};
