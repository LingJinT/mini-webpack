import Compilation from "./compilation.js";
import { AsyncParallelHook, AsyncSeriesHook, SyncHook } from "tapable";

export class Compiler {
  constructor(config) {
    const { entry, output, module } = config;
    this.entry = entry;
    this.output = output;
    this.loaders = module?.rules || [];
    this.hooks = {
      make: new AsyncParallelHook(["compilation"]),
      compilation: new SyncHook(["compilation"]),
      emit: new AsyncSeriesHook(["compilation"]),
    };
  }

  run() {
    const compilation = new Compilation(this);
    this.hooks.compilation.call(compilation);
    this.hooks.make.callAsync(compilation, (err) => {
      if (err) {
        console.error(err);
        return;
      }
      compilation.seal(() => {
        this.hooks.emit.callAsync(compilation, (err) => {
          console.log("完成");
        });
      });
    });
  }
}
