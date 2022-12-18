import { buildModuleGraph, createBundle } from "./utils/index.js";
import fs from "fs";

export class Compiler {
  constructor(config) {
    const { entry, output } = config;
    this.entry = entry;
    this.output = output;
  }

  run() {
    // 构建依赖图
    const graph = buildModuleGraph(this.entry);

    // 模块集合，利用函数作用域隔离变量，把require, module, exports注入，
    const modules = graph.reduce((obj, cur) => {
      return (
        obj +
        `${cur.id}: [${JSON.stringify(
          cur.mapping
        )}, function(require, module, exports) {
        ${cur.code}
      }],`
      );
    }, "");

    const bundle = createBundle(modules);

    // 输出到dist目录下
    fs.writeFileSync(this.output, bundle);
  }
}
