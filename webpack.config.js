const path = require('path');
module.exports = {
    //入口文件的配置项
    entry:{
        entry:'./src/entery.js',
        //多入口
        entry2:'./src/entery2.js'
    },
    //出口文件的配置项
    output:{
        //输出的路径
        path:path.resolve(__dirname,'dist'),
        //输出的文件的名称
        // filename:'bundle.js'
        //打包成与入口文件相同名称
        filename:'[name].js'
    },
    //模块：例如解读css，图片如何转换，压缩
    module:{},
    //插件，用于生产模板和各项功能
    plugins:[],
    //配置webpack开发服务功能
    devServer:{
        //设置基本目录结构
        contentBase:path.resolve(__dirname,'dist'),
        //服务器的ip地址，可以使用localhost
        host:'localhost',
        //服务端压缩开启
        compress:true,
        //配置服务端口
        port:1616
    }
}