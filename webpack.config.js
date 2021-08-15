const path = require('path');

module.exports = {
  mode: 'development',
  entry: './src/app.ts',
  output: {
    filename: 'bundle.js',
    // path.resolve() returns an absolute path from its arguments
    path: path.resolve(__dirname, 'dist'),
    // this is needed for webpack dev server when we run dev server of webpack, by default the bundle is created in '/' this path and we can set this by publicPath by pointing to another directory
    publicPath: '/dist/'
  },
  devtool: 'inline-source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    // specified which extension should use for the imports
    extensions: ['.ts', '.js'],
  },
};
