import babelParser from "@babel/parser";
import { transformFromAst } from "@babel/core";
import traverse from "@babel/traverse";
import path from "path";
import fs from "fs";

let ID = 0;

class EntryPlugin {
  constructor() {}

  buildModuleInfo(compiler, compilation) {
    const { entry: _path, loaders: _loaders } = compiler;
    // 拿到文件内容
    const _source = fs.readFileSync(_path, { encoding: "utf-8" });
    // 创建loaderContext
    const loaderContext = {
      compiler,
      compilation,
    };
    // 找到对应要触发的loader
    const loaders = _loaders.find((item) => item.test(_path))?.loader;
    // 从右向左执行loader
    const source =
      loaders?.reduceRight((fileSource, loader) => {
        return loader({ resource: fileSource }, loaderContext);
      }, _source) || _source;
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
      id: ID++, // 模块id
      mapping: {}, // 子模块路径和id的映射关系
    };
  }

  buildModuleGraph(compiler, compilation) {
    const { entry } = compiler;
    const graph = [];
    // let that = this;
    // 根据文件路径，递归dependencies
    const deep = ((entry, parentModuleInfo) => {
      const _path = parentModuleInfo
        ? path.resolve(path.dirname(parentModuleInfo.path), entry)
        : entry;
      // buildModuleInfo 输入文件路径，输出模块信息
      const moduleInfo = this.buildModuleInfo(
        {
          ...compiler,
          entry: _path,
        },
        compilation
      );
      if (parentModuleInfo) {
        // 给父模块加上依赖项的映射，方便后面替换require
        parentModuleInfo.mapping[entry] = moduleInfo.id;
      }
      graph.push(moduleInfo);
      moduleInfo.dependencies.forEach((str) => deep(str, moduleInfo));
    }).bind(this);
    deep(entry);
    return graph;
  }

  apply(compiler) {
    compiler.hooks.make.tapAsync("EntryPlugin", (compilation, callback) => {
      // 构建依赖图
      const graph = this.buildModuleGraph(compiler, compilation);
      // 将图给到 compilation
      compilation.graph = graph;
      callback();
    });
  }
}

export default EntryPlugin;
