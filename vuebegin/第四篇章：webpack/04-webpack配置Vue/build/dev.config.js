//开发环境是dev+base，这里只有个webpack-dev-server
const baseConfig = require('./base.config')
const WebpackMerge = require('webpack-merge')

//跟教程不相同，WebpackMerge.merge()才是合并函数
module.exports = WebpackMerge.merge(baseConfig,{
    devServer:{
        host:'127.0.0.1',
        port:'8081',
        contentBase:'./dist',
        inline:true
    },
})
