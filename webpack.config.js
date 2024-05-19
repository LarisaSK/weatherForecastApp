const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');  // Import HtmlWebpackPlugin

module.exports = {
  entry: './src/script.ts',  // Entry point for your TypeScript file
  output: {
    filename: 'script.js',
    path: path.resolve(__dirname, 'dist'),
  },
  resolve: {
    extensions: ['.ts', '.js'],  // Resolve both TypeScript and JavaScript files
  },
  module: {
    rules: [
      {
        test: /\.ts$/,  // Match .ts files
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.scss$/,  // Match .scss files
        use: [
          MiniCssExtractPlugin.loader,  // Extract CSS into a separate file
          'css-loader',    // Turn CSS into CommonJS modules
          'sass-loader',   // Compile Sass to CSS
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,  // Match image files
        type: 'asset/resource',  // Use asset/resource to handle image files
        generator: {
          filename: 'assets/images/[name][ext]',  // Output path for images
        },
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles.css',  // Name of the extracted CSS file
    }),
    new HtmlWebpackPlugin({
      template: './src/index.html',  // Path to your source index.html
      filename: 'index.html',  // Output filename in the dist directory
    }),
  ],

  mode: 'development',  
  devtool: 'source-map',
};
