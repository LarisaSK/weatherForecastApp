const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

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
    ],
  },  
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'styles.css',  // Name of the extracted CSS file
    }),
  ],

  mode: 'development',  // Use 'production' for minified output
  devtool: 'source-map',
};
