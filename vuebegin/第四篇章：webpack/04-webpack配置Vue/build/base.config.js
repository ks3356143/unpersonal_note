//开发时候使用的webpack打包配置文件
const path = require('path')
const {VueLoaderPlugin} = require('vue-loader')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')

module.exports = {
    mode: 'development',
    entry:'./src/main.js',
    output:{
        path:path.resolve(__dirname,'../dist'), //动态获取路径
        // filename:"main.js"---因为使用了html-webpack-plugin插件
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js' //内部为正则表达式  vue结尾的
        }
    },
    plugins:[
        new VueLoaderPlugin(),
        new webpack.BannerPlugin('最终版权归微小卫星所有'),
        new HtmlWebpackPlugin({
            title:"学习webpack！",
            template:'index.html',
            inject:'body',
            minify:{ //压缩HTML文件
                 removeComments:true,    //移除HTML中的注释
                 collapseWhitespace:true    //删除空白符与换行符
             }
        }),
    ],
    module:{
        rules:[
            {
                test:/\.vue$/,
                use:['vue-loader']
            },
            {
                test: /\.css$/,
                use: [
                  'vue-style-loader',
                  'css-loader'
                ]
            },
            // {
            //     test: /\.(jpg|png|gif)$/,
            //     type:"asset/resource",
            //     generator:{
            //         filename:'img/[name].[hash:6][ext]'
            //     }
            // },
            // {
            //     test: /\.(jpg|png|gif)$/,
            //     type:"asset/resource",//resource直接生成base64
            //     //所以不用generator
            // },
            {
                test: /\.(jpg|png|gif)$/,
                type:"asset",
                parser:{
                    dataUrlCondition:{
                        maxSize:8134
                    }
                },
                generator:{
                    filename:'img/[name].[hash:8][ext]'
                }
            },
            //babel转换为ES5
            {
                test:/\.js$/,
                exclude:/(node_modules|bowser_component)/,
                use:{
                    loader:'babel-loader',
                    options:{
                        presets:['@babel/preset-env']
                    }
                }
            },
            {
                test: /\.less$/,
                use: [
                    {loader:'style-loader'},
                    {loader:'css-loader'},
                    {loader:'less-loader'}
                ]
            },
        ]
    },
    // devServer:{
    //     host:'127.0.0.1',
    //     port:'8081',
    //     contentBase:'./dist',
    //     inline:true
    // },
}