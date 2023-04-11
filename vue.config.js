const BundleAnalyzerPlugin = require('webpack-bundle-analyzer/lib/BundleAnalyzerPlugin');
const UnpluginAutoImport = require('unplugin-auto-import/webpack');
const UnpluginElementPlus = require('unplugin-element-plus/webpack');
const UnpluginVueComponents = require('unplugin-vue-components/webpack');
const {ElementPlusResolver} = require('unplugin-vue-components/resolvers');
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

/** @namespace webpack.IgnorePlugin */
const webpack = require('webpack');

const DEBUG_ENV = process.env.NODE_ENV === 'local';
const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  lintOnSave: false,
  runtimeCompiler: !DEBUG_ENV,
  filenameHashing: !DEBUG_ENV,
  css: {
    sourceMap: DEBUG_ENV,
    loaderOptions: {
      scss: {
        additionalData: `@use "@/design/element-plus-theme.scss" as *;`,
      }
    }
  },
  productionSourceMap: DEBUG_ENV,
  configureWebpack: {
    mode: DEBUG_ENV ? 'development' : 'production',
    entry: {app: './src/main.js'},
    optimization: DEBUG_ENV ? {} : {
      usedExports: true,
      minimizer: [
        new TerserPlugin({})
      ]
    },
    plugins: [
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      UnpluginAutoImport({
        resolvers: [ElementPlusResolver({importStyle: "sass"})],
      }),
      UnpluginVueComponents({
        resolvers: [ElementPlusResolver({importStyle: "sass"})],
      }),
      UnpluginElementPlus({
        useSource: true,
      }),
      ...((!isProd && !DEBUG_ENV) ? [new BundleAnalyzerPlugin({analyzerMode: 'static', openAnalyzer: false, generateStatsFile: true})] : []),
      ...((!isProd && !DEBUG_ENV) ? [new MiniCssExtractPlugin({filename: "css/[name].[contenthash].css"})] : []),
    ],
    ...(
      DEBUG_ENV ? {} : {output: {filename: './js/[name].[hash].js', chunkFilename: './js/[name].[hash].js',}}
    ),
    module: {
      rules: [
        {
          test: /\.svg$/,
          oneOf: [
            {
              resourceQuery: /base64/,
              loader: 'url-loader',
            },
            {
              use: [
                {
                  loader: "vue-loader"
                },
                {
                  loader: 'vue-svg-loader',
                  options: {
                    svgo: {
                      plugins: [{removeViewBox: false}, {removeUselessStrokeAndFill: false}]
                    }
                  }
                }
              ]
            }
          ]
        },
        ...(isProd ? [{test: /\.vue$/, loader: require.resolve('./no-prod-tag-stripper.js')}] : []),
        ...((!isProd && !DEBUG_ENV) ? [{test: /\.css$/i, use: [MiniCssExtractPlugin.loader, "css-loader"]}] : []),
      ]
    }
  },
  chainWebpack: config => {
    if (DEBUG_ENV) {
      config.plugins.delete('preload');
    }
    config.module.rules.delete("svg");
    config.optimization.minimizer('terser').tap((options) => {
      options[0].terserOptions.output = {
        ...options[0].terserOptions.output,
        comments: false
      };
      if (isProd) {
        options[0].terserOptions.compress.pure_funcs = ['console.log', 'console.info'];
      }
      return options;
    });
  },
  devServer: {
    before: app => {
      app.set('etag', 'strong');
      app.use((req, res, next) => {
        res.set('Cache-Control', 'must-revalidate');
        next();
      });
    }
  }
};
