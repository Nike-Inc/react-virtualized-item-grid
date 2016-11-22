const webpack = require('webpack');
const packageJson = require('./package.json');

const name = packageJson.name;

module.exports = {
  devtool: 'source-map',
  entry: packageJson.entry,
  output: {
    path: './dist',
    library: name,
    libraryTarget: 'commonjs2',
    filename: `${name}.js`,
  },
  externals: {
    react: true,
    'react-dom': true,
    'react-virtualized': true,
    'react-addons-shallow-compare': true,
  },
  plugins: [
    new webpack.NoErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV || 'development'),
      },
    }),
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
  ],
  resolve: {
    modules: ['node_modules', './src'],
    extensions: ['', '.js'],
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: [/src/, /node_modules\/react-icons/],
        loader: 'babel',
      },
    ],
  },
};
