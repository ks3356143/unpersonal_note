# html-webpack-plugin

## 1.需求

我们打包的dist里面没有index.html文件

## 2.解决问题

### 删除webpack.config.js中的filename，因为它会自动生成

```js
module.exports = {
    mode: 'development',
    entry:'./src/main.js',
    output:{
        path:path.resolve(__dirname,'dist'), //动态获取路径
        // filename:"main.js"---因为使用了html-webpack-plugin插件
    },
```

### 但是我们需要html模板来生成dist中index.html中的<div id='app’>

直接在plugins:

```js
//根据我们原来的index.html生成dist的index.html
plugins:[
    new VueLoaderPlugin(),
    new webpack.BannerPlugin('最终版权归微小卫星所有'),
    new HtmlWebpackPlugin({
        template:'index.html'
    })
],
```

