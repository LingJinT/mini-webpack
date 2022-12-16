import babelParser from "@babel/parser";
import { transformFromAst } from "@babel/core";
import traverse from "@babel/traverse";
import path from "path";
import fs from "fs";

let ID = 0

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
    id: ID++, // 模块id
    mapping: {} // 子模块路径和id的映射关系
  };
}

export function buildModuleGraph(entry) {
  const graph = [];
  // 根据文件路径，递归dependencies
  function deep(entry, parentModuleInfo) {
    const _path = parentModuleInfo
      ? path.resolve(path.dirname(parentModuleInfo.path), entry)
      : entry;
    // buildModuleInfo 输入文件路径，输出模块信息
    const moduleInfo = buildModuleInfo(_path);
    if(parentModuleInfo) {
      // 给父模块加上依赖项的映射，方便后面替换require
      parentModuleInfo.mapping[entry] = moduleInfo.id
    }
    graph.push(moduleInfo);
    moduleInfo.dependencies.forEach((str) => deep(str, moduleInfo));
  }
  deep(entry);
  return graph;
}

export function createBundle(modules) {
  console.log('modules:',modules);
  return `(function (modules) {
    function require(id) {
      const {fn, mapping} = modules[id]

      function _require(path) {
        return require(mapping[path])
      }

      const module = {exports:{}}

      fn(_require, module, module.exports)
    }
    require(0)
  })(${modules})`
}
