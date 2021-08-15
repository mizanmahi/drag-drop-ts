const path = require('path');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
  mode: 'production',
  entry: './src/app.ts',
  output: {
    filename: 'bundle.js',
    // path.resolve() returns an absolute path from its arguments
    path: path.resolve(__dirname, 'dist'),
  },

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

  plugins: [
    new CleanWebpackPlugin(),
  ]
};
