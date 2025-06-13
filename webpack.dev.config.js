'use strict';

const webpack = require('webpack');
const path = require('path');
const MergeJsonPlugin = require("merge-json-webpack-plugin");

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    performance: { hints: false },
    context: path.resolve(__dirname, 'src'),
    entry: {
        SCIM: './SCIM.js',
        'Worker/SaveParser/Read': './SaveParser/Read.js',
        'Worker/SaveParser/Write': './SaveParser/Write.js'
    },

    output: {
        path: path.resolve(__dirname, 'build'),
        filename: './[name].js'
    },

    plugins: [
        // Merge all detailed models into a single JSON file...
        new MergeJsonPlugin({
            groups: [
                { pattern: './Models/*/*.json', to: './detailedModels.json' }
            ]
        })
    ]
};