const path = require('path')
module.exports = {
    mode: 'development',
    entry:'./src/main.js',
    output:{
        path:path.resolve(__dirname,'dist'), //动态获取路径
        filename:"main.js"
    },
    module:{
        
        rules:[
            {
                test:/\.css$/,
                use:['style-loader','css-loader']
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
            }
        ]
    }
}
