import Compilation from "./compilation";
import { AsyncParallelHook, AsyncSeriesHook, SyncHook } from "tapable";

export class Compiler {
  constructor(config) {
    const { entry, output } = config;
    this.entry = entry;
    this.output = output;
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
