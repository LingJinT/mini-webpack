# 前言

本文主要带大家了解 webpack 主流程，目标是手写一个 mini-webpack，主要分为以下几个阶段

- 从入口出发，构建依赖图
- 替换导入导出语句
- 作用域隔离
- 输出文件

## 从入口出发，构建依赖图

```js
// complier
export class Compiler {
  constructor(config) {
    const { entry, output } = config;
    this.entry = entry;
    this.output = output;
  }

  run() {
    // 构建依赖图
    const graph = buildModuleGraph(this.entry);
    // 替换导入导出语句

    // 输出到dist目录下
  }
}

// buildModuleGraph 通过入口，输出所有模块的依赖图
export function buildModuleGraph(entry) {
  const graph = [];
  // 根据文件路径，递归dependencies
  function deep(entry, parentEntry) {
    const _path = parentEntry
      ? path.resolve(path.dirname(parentEntry), entry)
      : entry;
    // buildModuleInfo 输入文件路径，输出模块信息
    const moduleInfo = buildModuleInfo(_path);
    graph.push(moduleInfo);
    moduleInfo.dependencies.forEach((str) => deep(str, moduleInfo.path));
  }
  deep(entry);
  return graph;
}

// 构建单个模块信息
export function buildModuleInfo(_path) {
  // 拿到文件内容
  const source = fs.readFileSync(_path, { encoding: "utf-8" });
  // 利用@babel/parser转换成ast
  const ast = babelParser.parse(source, {
    sourceType: "module",
  });
  const dependencies = [];
  // 利用@babel/traverse解析模块依赖
  traverse.default(ast, {
    ImportDeclaration: ({ node }) => {
      // 基于 import 来获取当前文件需要的依赖
      dependencies.push(node.source.value);
    },
  });

  // 利用@babel/core 把里面的 import 替换成 require
  const { code } = transformFromAst(ast, null, {
    // 需要使用 babel-preset-env
    presets: ["env"],
  });

  return {
    path: _path,
    code,
    dependencies,
  };
}
```
