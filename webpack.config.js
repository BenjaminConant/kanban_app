const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const NpmInstallPlugin = require('npm-install-webpack-plugin');

const TARGET = process.env.npm_lifecycle_event;

process.env.BABEL_ENV = TARGET;

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
};

const common = {
    // Entry accepts a path or an object of entries. We'll be using the
    // latter form given it's convenient with more complex configurations.
    entry: {
      app: PATHS.app
    },

    // Add resolve.extentions
    // '' is needed to allow imports without an extentsion
    // Note the .'s before extentions as it will fail to match without it

    resolve: {
      extensions: ['', '.js', '.jsx']
    },
    output: {
      path: PATHS.build,
      filename: 'bundle.js',
    },
    module: {
      loaders: [
        {
          test: /\.css$/,
          loaders: ['style', 'css'],
          // Include accespts either a path or an array of paths.
          include: PATHS.app
        },
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
    }
};

// Default configuration
if (TARGET === 'start' || !TARGET) {
  module.exports = merge(common, {
    devtool: 'eval-source-map',
    devServer: {
      contentBase: PATHS.build,

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
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
      new NpmInstallPlugin({
        save: true // --save
      })
    ]
  });
}

if (TARGET === 'build') {
  module.exports = merge(common, {});
}

