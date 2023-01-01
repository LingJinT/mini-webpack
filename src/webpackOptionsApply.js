import EmitPlugin from "./plugins/EmitPlugin.js";
import EntryPlugin from "./plugins/EntryPlugin.js";
import SealPlugin from "./plugins/SealPlugin.js";

export class WebpackOptionsApply {
  constructor() {}
  process(options, compiler) {
    new EntryPlugin().apply(compiler);
    new SealPlugin().apply(compiler);
    new EmitPlugin().apply(compiler);
  }
}
