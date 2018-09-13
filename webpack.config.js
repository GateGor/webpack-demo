const path = require('path');
const glob = require('glob');
const uglify = require('uglifyjs-webpack-plugin');//webpack集成
const htmlPlugin = require('html-webpack-plugin');
const extractTextPlugin = require('extract-text-webpack-plugin');
const extractTextPluginCss = new extractTextPlugin('./css/index.css');
const extractTextPluginLess = new extractTextPlugin('./css/black.css');
const PurifyCSSPlugin = require('purifycss-webpack');
const entry = require('./webpack_config/entry_webpack.js');
const webpack = require('webpack');
const copyWebpackPlugin = require('copy-webpack-plugin');
console.log(encodeURIComponent(process.env.type));

if (process.env.type == "build") {
    var website = {
        publicPath: 'http://www.gategor.com/'
    }
} else {
    var website = {
        publicPath: 'http://192.168.3.219:1616/'
    }
    console.log(website.publicPath);
}
console.log(entry.path);

module.exports = {
    devtool:'eval-source-map',
    //入口文件的配置项
    entry:{
        // entry:'./src/entery.js',
        entry:entry.path.entry,
        jquery:'jquery',
        vue:'vue',
        //多入口
        entry2:'./src/entry2.js'
    },
    //出口文件的配置项
    output:{
        //输出的路径
        path:path.resolve(__dirname,'dist'),
        //输出的文件的名称
        // filename:'bundle.js'
        //打包成与入口文件相同名称
        filename:'[name].js',
        //主要作用就是处理静态文件路径的
        publicPath:website.publicPath
    },
    //模块：例如解读css，图片如何转换，压缩
    module:{
        rules:[
            {
                //test：用于匹配处理文件的扩展名的表达式，这个选项是必须进行配置的；
                test:/\.css$/,
                //use：loader名称，就是你要使用模块的名称，这个选项也必须进行配置，否则报错；
                // use:['style-loader','css-loader']
                use:extractTextPluginCss.extract({
                    fallback:'style-loader',
                    // use:'css-loader'
                    use:[
                        {loader:'css-loader',options:{importLoaders:1}},
                        'postcss-loader'//+css前缀
                    ]
                })
            },
            // {
            //     test:/\.css$/,
            //     use:[
            //         {
            //             loader:'style-loader'
            //         },{
            //             loader:'css-loader',
            //             options:{
            //                 modules:true
            //             }
            //         },{
            //             loader:'postcss-loader'
            //         }
            //     ]
            // },
            {
                test:/\.less$/,
                // use:[
                //     {loader:"style-loader"},
                //     {loader:"css-loader"},
                //     {loader:"less-loader"}
                // ]
                //less分离
                use:extractTextPluginLess.extract({
                    use:[{
                        loader:"css-loader"
                    },{
                        loader:"less-loader"
                    }],
                    fallback:"style-loader"
                })
            },
            {
                test:/\.(png|jpg|gif)/,
                use:[{
                    loader:'url-loader',
                    options:{
                        //limit：是把小于500000B的文件打成Base64的格式，写入JS。
                        limit:500000,
                        //输出的图片放到images文件夹下
                        outputPath:'images/'
                    }
                }]
            },
            {
                test:/\.(htm|html)$/i,
                use:['html-withimg-loader']
            },
            {
                test:/\.(jsx|js)$/,
                use:{
                    loader:'babel-loader',
                    // options:{
                    //     presets:['es2015','react']
                    // }
                },
                //include/exclude:手动添加必须处理的文件（文件夹）或屏蔽不需要处理的文件（文件夹）（可选）
                exclude:/node_modules/
            }
        ]
    },
    //插件，用于生产模板和各项功能
    plugins:[
        new uglify(),
        new htmlPlugin({
            //minify：是对html文件进行压缩，removeAttrubuteQuotes是截掉属性的双引号。
            minify:{
                removeAttributeQuotes:true
            },
            //hash：为了开发中js有缓存效果，所以加入hash，这样可以有效避免缓存JS。
            hash:true,
            //template：是要打包的html模版路径和文件名称。
            template:'./src/index.html'
        }),
        extractTextPluginCss,
        extractTextPluginLess,
        new PurifyCSSPlugin({
            paths:glob.sync(path.join(__dirname,'src/*.html'))
        }),
        new webpack.ProvidePlugin({
            $:'jquery'
        }),
        new webpack.BannerPlugin('zwj的webpack'),
        new webpack.optimize.CommonsChunkPlugin({
            //name对应入口文件中的名字，我们起的是jquery
            name:['jquery','vue'],
            //把文件打包到哪里，是一个路径
            filename:'assets/js/[name].js',
            //最小打包的文件模块数，这里直接写2就好
            minChunks:2
        }),
        new copyWebpackPlugin([{
            from:__dirname + '/src/public',
            to:'./public'
        }]),
        new webpack.HotModuleReplacementPlugin()
    ],
    //配置webpack开发服务功能
    devServer:{
        //设置基本目录结构
        contentBase:path.resolve(__dirname,'dist'),
        //服务器的ip地址，可以使用localhost
        host:'192.168.3.219',
        //服务端压缩开启
        compress:true,
        //配置服务端口
        port:1616
    },
    watchOptions:{
        //检查修改的时间，以毫秒为单位
        poll:1000,
        //防止重复保存而发生重复编译错误。这里设置的500是半秒内重复保存，不进行打包操作
        aggregateTimeout:500,
        //不监听的目录
        ignored:/node_modules/
    }
}