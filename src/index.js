import { Compiler } from "./compiler.js";
import { WebpackOptionsApply } from "./webpackOptionsApply.js";

export function webpack(config) {
  const compiler = new Compiler(config);
  config.plugins?.forEach((plugin) => {
    plugin.apply(compiler);
  });
  new WebpackOptionsApply().process(config, compiler);
  compiler.run();
}
