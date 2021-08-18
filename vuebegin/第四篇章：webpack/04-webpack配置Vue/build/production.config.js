const TerserPlugin = require('terser-webpack-plugin')
//导入webpack-merge
const WebpackMerge = require('webpack-merge')
const baseConfig = require('./base.config')

//生产环境是production+base，这里只有个压缩
//跟教程不相同，WebpackMerge.merge()才是合并函数
module.exports = WebpackMerge.merge(baseConfig,{
        optimization:{
            minimize:true,
            minimizer:[new TerserPlugin({
                test:/\.js$/,
                exclude:/(node_modules|bowser_component)/,
                parallel:true
            })]
        },
    }
)
