# leaf dev
this progect used to be `limb`, by team `Königsberg`.

## Run Leaf

### 1. clone the repo
```
git clone https://github.com/chroslen/leaf.git
```


### 2. NPM install

```
$ cd leaf
$ npm install
```

### 3. start the server

use node

```
$ node index.js
```

you can use supervisor as well

```
$ supervisor --hemony index
```

### 4. ⚠️注意

如果没有运行 `mongodb`：
将 /config/default.json 中的

```javascript
/*"mongodb": "mongodb://node:node@jello.modulusmongo.net:27017/z9apyjiS"*/
"mongodb": "mongodb://localhost:27017/leaf"

```
修改为

```javascript
"mongodb": "mongodb://node:node@jello.modulusmongo.net:27017/z9apyjiS"
/*"mongodb": "mongodb://localhost:27017/leaf"*/

```
这是一个远程 `mongodb` 的数据库地址，现在好像链接不上，无法注册登陆，其他正常。

## the lastest issues

- 明文加密

## 开发框架（采取MVC模型）
- config
配置文件夹
- lib

- models
逻辑和数据（若采用了mongodb数据库的话）
- public
静态文件
- routes
路由（控制器）
- views
视图
1. 入口文件index.jade
2. components组件
3. partials局部
