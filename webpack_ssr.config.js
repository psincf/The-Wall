const path = require("path");
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: "./src/frontend/index.jsx",
    //mode: "development",
    mode: "production",
    target: "node",
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: "babel-loader",
                options: { presets: ["@babel/env"] },
            },
            {
                test: /\.css$/,
                use: ["style-loader", "css-loader"],
            }
        ]
    },
    resolve: {

    },
    //externals: /node_modules/,
    externals: [nodeExternals()],
    externalsPresets: { node: true },
    output: {
        path: path.resolve(__dirname, "dist/"),
        //publicPath: "",
        library: {
            type: "commonjs2",
        },
        filename: "bundle_ssr.js"
    }
}