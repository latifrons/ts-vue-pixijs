const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');

let path = require('path'),
  Html = require('html-webpack-plugin'),
  ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin'),
  VueLoaderPlugin = require('vue-loader/lib/plugin.js');
function resolve(dir) {
  return path.join(__dirname, '..', dir);
}
module.exports = {
  entry: './src/main.ts',
  output: {
    path: path.resolve(__dirname, './'),
    publicPath: './',
    filename: 'chunk.js',
    devtoolModuleFilenameTemplate: info => {
      // console.log(info.resourcePath);
      var $filename = 'sources://' + info.resourcePath;
      if (info.resourcePath.match(/\.vue$/) && !info.query.match(/type=script/)) {
        // js inside ts project
        if  (!info.resourcePath.match(/^src/)){
          $filename = 'webpack-generated:///' + info.resourcePath + '?' + info.hash;
        }
      }
      return $filename;
    },
    devtoolFallbackModuleFilenameTemplate: 'webpack:///[resource-path]?[hash]',
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          compilerOptions: {
            preserveWhitespace: false
          }
        }
      },
      {
        test: /\.ts(x)?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
        options: {
          appendTsSuffixTo: [/\.vue$/],
          transpileOnly: true,
          happyPackMode: false
        }
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]'
        }
      },
      {
        test: /\.(sa|sc|c)ss$/,
        resourceQuery: /\?vue/,
        use: [
          {
            loader: 'vue-style-loader',
            options: {
              sourceMap: false,
              shadowMode: false
            }
          },
          {
            loader: 'css-loader'
          },
          {
            loader: 'sass-loader'
          }
        ]
      },
      {
        test: /\.(js|vue|ts|tsx|jsx)$/,
        enforce: 'pre',
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {
          fix: false,
          extensions: ['.js', '.jsx', '.vue', '.ts', '.tsx'],
          cache: false,
          emitWarning: true,
          emitError: false
        }
      }
    ]
  },
  node: {
    setImmediate: false,
    process: 'mock',
    dgram: 'empty',
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  plugins: [
    new VueLoaderPlugin(),
    new Html({
      template: resolve('src/index.html'),
      filename: 'index.html'
    }),
    new ForkTsCheckerWebpackPlugin({
      vue: true,
      tslint: false,
      checkSyntacticErrors: true,
      // workers: ForkTsCheckerWebpackPlugin.TWO_CPUS_FREE,
    })
  ],
  resolve: {
    extensions: ['.ts', '.js', '.vue', '.json', '.jsx'],
    alias: {
      vue$: 'vue/dist/vue.esm.js',
      '@': resolve('src')
    }
  },
  devServer: {
    historyApiFallback: true,
    contentBase: [path.join(__dirname, '../')],
    hot: true,
    host: '0.0.0.0',
    compress: true,
    noInfo: false,
    quiet: false,
    disableHostCheck: true,
    publicPath: '/',
    overlay: {
      warnings: true
    }
  },
  performance: {
    hints: false
  },
  devtool: '#eval-source-map',
  optimization: {
    minimizer: [
      new ParallelUglifyPlugin({ // 多进程压缩
        cacheDir: '.cache/',
        uglifyJS: {
          output: {
            comments: false,
            beautify: false
          },
          compress: {
            warnings: false,
            drop_console: true,
            collapse_vars: true,
            reduce_vars: true
          }
        }
      }),
    ],
    minimize: false, // 开发环境不压缩
    splitChunks: {
      chunks: "async", // 共有三个值可选：initial(初始模块)、async(按需加载模块)和all(全部模块)
      minSize: 30000, // 模块超过30k自动被抽离成公共模块
      minChunks: 1, // 模块被引用>=1次，便分割
      maxAsyncRequests: 5,  // 异步加载chunk的并发请求数量<=5
      maxInitialRequests: 3, // 一个入口并发加载的chunk数量<=3
      name: true, // 默认由模块名+hash命名，名称相同时多个模块将合并为1个，可以设置为function
      automaticNameDelimiter: '~', // 命名分隔符
      cacheGroups: { // 缓存组，会继承和覆盖splitChunks的配置
        default: { // 模块缓存规则，设置为false，默认缓存组将禁用
          minChunks: 2, // 模块被引用>=2次，拆分至vendors公共模块
          priority: -20, // 优先级
          reuseExistingChunk: true, // 默认使用已有的模块
        },
        vendors: {
          test: /[\\/]node_modules[\\/]/, // 表示默认拆分node_modules中的模块
          priority: -10
        }
      }
    }
  }
};
