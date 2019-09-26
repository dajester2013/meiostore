/* global __dirname, require, module*/
const webpack = require('webpack');
const path = require('path');
const env = require('yargs').argv.env; // use --env with webpack 2
const pkg = require('./package.json');
let libraryName = pkg.name;
let outputFile, mode;

if (env === 'build') {
	mode = 'production';
	outputFile = libraryName + '.min.js';
} else {
	mode = 'development';
	outputFile = libraryName + '.js';
}

const config = {
	mode: mode,
	entry: [ __dirname + '/src/index.js'],
	devtool: 'source-map',
	output: {
		path: __dirname + '/dist',
		filename: outputFile,
		library: libraryName,
		libraryTarget: 'umd',
		umdNamedDefine: true,
		globalObject: "typeof self !== 'undefined' ? self : this"
	},
	module: {
		rules: [{
				test: /(\.jsx|\.js)$/,
				loader: 'babel-loader',
				exclude: /(node_modules|bower_components)/,
				options: {
					// presets: [
					// 	["@babel/preset-env", {
					// 		"useBuiltIns": "entry"
					// 	}]
					// ],
					// plugins: [
					// 	"@babel/plugin-proposal-class-properties", "@babel/plugin-proposal-export-default-from"
					// ]
				}
			}
		]
	},
	resolve: {
		modules: [path.resolve('./node_modules'), path.resolve('./src')],
		extensions: ['.json', '.js']
	}
};
module.exports = config;


// var webpack = require('webpack');
// var path = require('path');
// var libraryName = 'MeioState';
// var outputFile = 'meiostate.js';

// require("babel-polyfill");

// var config = {
// 	entry: ["babel-polyfill",__dirname + '/src/index.js'],
// 	devtool: 'source-map',
// 	output: {
// 		path: __dirname + '/dist',
// 		filename: outputFile,
// 		library: libraryName,
// 		libraryTarget: 'umd',
// 		umdNamedDefine: true
// 	},
// 	module: {
// 		rules: [{
// 				test: /\.jsx?$/,
// 				loader: 'babel-loader',
// 				exclude: /(node_modules|bower_components)/
// 				,options: {
// 					presets: ["@babel/preset-env"]
// 				}
// 			}
// 		]
// 	}
// };

// module.exports = config;