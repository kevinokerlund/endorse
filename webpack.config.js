const path = require('path');

module.exports = {
	entry: './src/endorse.js',
	output: {
		filename: 'endorse.js',
		path: path.resolve(__dirname, 'lib'),
		library: "Endorse",
		libraryTarget: "umd",
		libraryExport: "default"
	},
	devtool: 'source-map',
	module: {
		rules: [
			{
				test: /\.js$/,
				include: /src/,
				exclude: /node_modules/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['env']
					}
				}
			},
		]
	},
};
