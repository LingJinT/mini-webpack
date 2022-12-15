import { buildModuleGraph } from "./utils/index.js";

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
