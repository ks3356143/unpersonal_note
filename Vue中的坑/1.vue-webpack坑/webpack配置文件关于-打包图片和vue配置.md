```js
const path = require('path')
const {VueLoaderPlugin} = require('vue-loader')
module.exports = {
    mode: 'development',
    entry:'./src/main.js',
    output:{
        path:path.resolve(__dirname,'dist'), //动态获取路径
        filename:"main.js"
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js' //内部为正则表达式  vue结尾的
        }
    },
    plugins:[
        new VueLoaderPlugin()
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
    }
}
```

