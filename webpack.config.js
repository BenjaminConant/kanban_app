const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const NpmInstallPlugin = require('npm-install-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');


// Load *package.json* so we can use `dependencies` from there
const pkg = require('./package.json');



const TARGET = process.env.npm_lifecycle_event;

process.env.BABEL_ENV = TARGET;

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build'),
  style: path.join(__dirname, 'app/main.css')
};

const common = {
    // Entry accepts a path or an object of entries. We'll be using the
    // latter form given it's convenient with more complex configurations.
    entry: {
      app: PATHS.app,
      style: PATHS.style
    },

    // Add resolve.extentions
    // '' is needed to allow imports without an extentsion
    // Note the .'s before extentions as it will fail to match without it

    resolve: {
      extensions: ['', '.js', '.jsx']
    },
    output: {
      path: PATHS.build,
      // output using entry name
      filename: '[name].js',
    },
    module: {
      loaders: [
        // set up jsx. This accepts js too thanks too RegExp
        {
          test: /\.jsx?$/,
          // Enable caching for imporved performace during development
          // It uses default OS directory by defualt. If you need somthing
          // more custom pas a path to it I.e, babel?cacheDirectory=<path>
          loaders: ['babel?cacheDirectory'],
          // Parse only app files! Without this it will go through the entire project
          // In addition to being slow, this will most likely result in an error
          include: PATHS.app
        }
      ]
    },
    plugins: [
    new HtmlWebpackPlugin({
      template: 'node_modules/html-webpack-template/index.ejs',
      title: 'Kanban app',
      appMountId: 'app',
      inject: false
    })
  ]
};

// Default configuration
if (TARGET === 'start' || !TARGET) {
  module.exports = merge(common, {
    devtool: 'eval-source-map',
    devServer: {

      // Enable history API fallback so HTML5 History API based routing works.
      // This is a good defualt that will come in handy in more complicated setups
      historyApiFallback: true,
      hot: true,
      inline: true,
      progress: true,

      // Display only erros to reduce the amount of output
      stats: 'errors-only',

      // Parse host and port from env so this is easy to customize
      //
      // If you use Vagrent or Cloud9, set
      // host: process.env.HOST || '0.0.0.0';
      //
      // 0.0.0.0 is available to all network devices unlike default localhost
      host: process.env.HOST,
      port: process.env.PORT,
    },
    module: {
      loaders: [
        // Define development specific CSS setup
        {
          test: /\.css$/,
          loaders: ['style', 'css'],
          include: PATHS.app
        }
      ]
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new NpmInstallPlugin({
        save: true // --save
      })
    ]
  });
}

if (TARGET === 'build' || TARGET === 'stats') {
  module.exports = merge(common, {
    entry: {
      vendor: Object.keys(pkg.dependencies).filter(function(v) {
        // Exclude alt-utils as it won't work with this setup
        // due to the way the package has been designed
        // (no package.json main).
        return v !== 'alt-utils';
      })
    },

    output: {
      path: PATHS.build,
      filename: '[name].[chunkhash].js',
      chunkFilename: '[chunkhash].js'
    },

    module: {
      loaders: [
        // Extract CSS during build
        {
          test: /\.css$/,
          loader: ExtractTextPlugin.extract('style', 'css'),
          include: PATHS.app
        }
      ]
    },

    plugins: [

      new CleanPlugin([PATHS.build]),

      new webpack.optimize.DedupePlugin(),

      new ExtractTextPlugin('[name].[chunkhash].css'),

      // Extract vendor and manifest files
      new webpack.optimize.CommonsChunkPlugin({
        names: ['vendor', 'manifest']
      }),

      new webpack.DefinePlugin({
        'process.env.NODE_ENV': '"production"'
      }),

      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ]
  });
}

