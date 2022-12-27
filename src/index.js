import { Compiler } from "./compiler.js";

export function webpack(config) {
  const compiler = new Compiler(config);
  config.plugins.forEach((plugin) => {
    plugin.apply(compiler);
  });
  compiler.run();
}
