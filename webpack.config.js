const path = require("path");
const nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: "./src/frontend/index_web.jsx",
    mode: "development",
    //mode: "production",
    target: "web",
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
    output: {
        path: path.resolve(__dirname, "dist/"),
        filename: "bundle.js"
    }
}