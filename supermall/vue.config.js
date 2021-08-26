module.exports = {
    //自己会和公共配置合并
    configureWebpack:{
        resolve:{
            alias:{
                'assets':"@/assets",
                'common':'@/common',
                'components':"@/components",
                "network":"@/network",
                "views":"@/views"
            }
        }
    }
}