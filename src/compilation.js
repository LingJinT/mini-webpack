import { SyncHook } from "tapable";

class Compilation {
  constructor(compiler) {
    this.compiler = compiler;
    this.graph = []; // 模块依赖关系图
    this.modules = ""; // 各个模块
    this.hooks = {
      seal: new SyncHook(),
    };
  }

  seal(callback) {
    this.hooks.seal.call();
    callback();
  }
}

export default Compilation;
