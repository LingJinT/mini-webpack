# 前言

本文主要带大家了解 webpack 主流程，目标是手写一个 mini-webpack，具体请参考源码

# FAQ

1. 说一下 vite 和 webpack 对比，为什么 vite 在 dev 模式下运行速度快很多？ 工程化

webpack 是先打包后再启动开发服务器的。

vite 利用现代浏览器支持 ES Modules 的特点，是先启动开发服务器，然后再根据请求按需实时编译

2. webpack hash 策略（文件指纹）

hash 的作用：比如你们公司线上环境出现了一个 bug，需要你去修复，当你修复完重新打包构建后推送到服务器上，此时你跟用户说已经改好了，但是用户反馈没生效，原因是浏览器的缓存策略，你虽然改了文件，但是打包构建后的文件名和之前的文件名一样，浏览器会直接返回旧的文件，所以就有了 hash 这个概念，也就是让每次打包构建后的文件名都不一样。随着网络技术的发展，对用户体验的要求也越来越高，某天用户反馈，你改完 bug 后，网页加载就变得很慢，原因是所有文件的 hash 都变了，缓存失效，所有的资源都要重新请求。所以就诞生了细粒度更小的 chunkhash 和 contenthash。

hash: 某一个文件变化，所有打包出来的文件的 hash 都会发生变化。

chunkhash: 某一个文件变化，该文件所在的 chunk 的 hash 发生变化，比如把公共依赖打包到一个 chunk，那我们只要不改动公共依赖的代码，该 chunk 永远也不会发生变化。

contenthash：比如：使用 chunkhash 时，js 和 css 都会在同一个 chunk 中，当你改变了 js 中的内容，css 也会随之改变。contenthash 会把这两者分开来，当 js 内容改变时，css 文件不会发生改变。

3. webpack runtime 和 mainfest 代码的作用

runtime 用来处理连接模块之间的关系，比如 webpack 把 import 和 require 统一变成了**webpack_require**，当一个模块加载另一个模块时，会调用**webpack_require**，然后然后通过 mainfest 找到对应的模块并加载，所以 mainfest 里记录了模块的映射关系

tip：当你使用 contenthash 时，即使文件没有改变，第二次打包时 hash 可能也会不一样，这可能是因为你改变了其他的文件名或者新增（删除）了文件，导致 mainfest 发生变化，所以该 bundle 的 hash 也会发生变化，解决方法可以是利用 code-splitting 分离该 bundle 中的 runtime 代码，形成独立的 bundle

4. 主流的 JavaScript 模块化技术

commonjs: 主要应用在 node 环境中，在运行时确定依赖关系，同步加载

AMD: 主要应用在浏览器环境中，异步加载，书写较为复杂。需要将依赖的模块提前声明。

CMD: 主要应用在浏览器环境中，既可同步也可异步，是一种较为通用的模块加载方式，其最大的特点就是动态加载，只需在需要该依赖时引入即可。

UMD: 可以在 node 环境中使用 commonjs 规范，在浏览器环境中使用 AMD 规范。

esModule: 以上都是在运行时确定依赖关系，它可以在编译时就确定，并且支持动态导入。

5. webpack 构建流程

整个构建流程太复杂，其主要可以分为以下三个阶段:

make: 从 entry 构建的开始，获取模块间的依赖关系，输出依赖图

seal: 封装阶段，根据依赖图把各个模块聚合起来得到 modules

emit: 输出阶段，将 modules 放入模板中，输出文件到 output

6. loader 和 plugin 的区别

loader: 只在处理资源的时机触发，比如将图片，css，json 等文件处理成 js 后输出

plugin: 贯穿整个 webpack 流程，可以订阅不同的生命周期，做相应的操作
