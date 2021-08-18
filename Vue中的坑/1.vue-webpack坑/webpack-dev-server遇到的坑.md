# 因为webpack-dev-server和webpack-cli不兼容

## 1.常规步骤

### 安装webpack-dev-server

首先`npm install --save-dev webpack-dev-server`

然后在webpack.config.js中配置服务器信息：

```js
    devServer:{
        host:'127.0.0.1',
        port:'8081',
        contentBase:'./dist',//对哪个文件设置服务器
        inline:true //实时热刷新
    },
```

### 2.发生错误

因为不兼容，所以只有用webpack serve启动，并且要加上--mode=development

在package.js中修改：

```js
 "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack",
    "dev": "webpack serve --mode=development"
  },
```

### 3.注意单次别写错了

最后使用命令npm run dev启动