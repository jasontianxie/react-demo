var path = require('path'),
  webpack = require('webpack'),
  NyanProgressPlugin = require('nyan-progress-webpack-plugin');

var rootPath = path.resolve(__dirname, '..'), // 项目根目录
  src = path.join(rootPath, 'src'), // 开发源码目录
  env = process.env.NODE_ENV.trim(); // 当前环境
var commonPath = {
  rootPath: rootPath,
  dist: path.join(rootPath, 'dist'), // build 后输出目录
  indexHTML: path.join(src, 'index.html'), // 入口基页
  staticDir: path.join(rootPath, 'static') // 无需处理的静态资源目录
};

module.exports = {
  commonPath: commonPath,//这个配置并不是webpack中的配置，只是为了在webpack.prod.conf.js和webpack.dev.conf.js中使用
  //因为webpack.base.conf.js是基础文件，最后会导出，供webpack.prod.conf.js和webpack.dev.conf.js使用
  entry: {
    app: path.join(src, 'app.js'),

    // ================================
    // 框架 / 类库 分离打包
    // ================================
    vendor: [
      'history',
      'lodash',
      'react',
      'react-dom',
      'react-redux',
      'react-router',
      'react-router-redux',
      'redux',
      'redux-thunk'
    ]
  },
  output: {
    path: path.join(commonPath.dist, 'static'),
    publicPath: '/static/'
  },
  resolve: {
    extensions: ['', '.js', '.jsx'],
    alias: {
      // ================================
      // 自定义路径别名
      // ================================
      ASSET: path.join(src, 'assets'),
      COMPONENT: path.join(src, 'components'),
      ACTION: path.join(src, 'redux/actions'),
      REDUCER: path.join(src, 'redux/reducers'),
      STORE: path.join(src, 'redux/store'),
      ROUTE: path.join(src, 'routes'),
      SERVICE: path.join(src, 'services'),
      UTIL: path.join(src, 'utils'),
      HOC: path.join(src, 'utils/HoC'),
      MIXIN: path.join(src, 'utils/mixins'),
      VIEW: path.join(src, 'views')
    }
  },
  resolveLoader: {
    root: path.join(rootPath, 'node_modules')
  },
  module: {
    loaders: [{
      test: /\.(js|jsx)$/,
      loaders: (function() {
        var _loaders = ['babel?' + JSON.stringify({//这里的loader名称写的babel，但是官网上推荐使用babel-loader（https://github.com/babel/babel-loader页面最后的例子）
          cacheDirectory: true,//这个是babel-loader的选项（https://github.com/babel/babel-loader中关于options的说明），其他选项都是babel的（https://babeljs.io/docs/usage/api/页面中关于options的说明）
          plugins: [//社区常用的plugins：https://www.npmjs.com/search?q=babel-plugin&page=1&ranking=optimal
            'transform-runtime',
            'transform-decorators-legacy'
          ],
          presets: ['es2015', 'react', 'stage-0'],//整个项目的presets的配置。presets和plugins：presets设置大部分的通用功能，plugins设置具体的一个功能
          //比如说，persets：es2015可以转化大部分的es6语法，但是他不转化装饰器语法，这个时候就要单独加一个plugins：transform-decorators-legacy
          //来转化装饰器。换句话说，如果plugins写了足够多的插件，那么完全可以不用谢presets了，但是这样写的plugins就太多了。
          env: {//设置在production环境变量（这个环境变量在package.json文件中配置,默认使用process.env.BABEL_ENV，
            //如果没有就使用process.env.NODE_ENV）下的presets的配置（官网中的例子：https://babeljs.io/docs/usage/babelrc/）
            production: {
              presets: ['react-optimize']//优化preset，暂时在npmjs官网上没有找到介绍。
            }
          }
        }), 'eslint'];

        // 开发环境下引入 React Hot Loader
        if (env === 'development') {
          _loaders.unshift('react-hot');
        }
        return _loaders;
      })(),
      include: src,
      exclude: /node_modules/
    }, {
      test: /\.json$/,
      loader: 'json'
    }, {
      test: /\.html$/,
      loader: 'html'
    }, {
      test: /\.(png|jpe?g|gif|svg)$/,
      loader: 'url',
      query: {
        limit: 10240, // 10KB 以下使用 base64
        name: 'img/[name]-[hash:6].[ext]'
      }
    }, {
      test: /\.(woff2?|eot|ttf|otf)$/,
      loader: 'url-loader?limit=10240&name=fonts/[name]-[hash:6].[ext]'
    }]
  },
  eslint: {//这个配置并不是webpack中的配置，只是为了在webpack.prod.conf.js和webpack.dev.conf.js中使用，但是好像并没有用到
    //因为webpack.base.conf.js是基础文件，最后会导出，供webpack.prod.conf.js和webpack.dev.conf.js使用
    formatter: require('eslint-friendly-formatter')
  },
  plugins: [
    new NyanProgressPlugin(), // 进度条
    new webpack.DefinePlugin({
      'process.env': { // 这是给 React / Redux 打包用的
        NODE_ENV: JSON.stringify('production')
      },
      // ================================
      // 配置开发全局常量
      // ================================
      __DEV__: env === 'development',
      __PROD__: env === 'production',
      __COMPONENT_DEVTOOLS__: false, // 是否使用组件形式的 Redux DevTools
      __WHY_DID_YOU_UPDATE__: false // 是否检测不必要的组件重渲染
    })
  ]
};
