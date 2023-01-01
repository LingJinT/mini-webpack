import fs from "fs";

class EmitPlugin {
  constructor() {}

  createBundle(modules) {
    return `(function (modules) {
			function require(id) {
				const [mapping, fn] = modules[id]
	
				function _require(path) {
					return require(mapping[path])
				}
	
				const module = {exports:{}}
	
				fn(_require, module, module.exports)
	
				return module.exports
			}
			require(0)
		})({${modules}})`;
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync("EmitPlugin", (compilation, callback) => {
      const bundle = this.createBundle(compilation.modules);
      // 输出到dist目录下
      fs.writeFileSync(compilation.compiler.output, bundle);
      callback();
    });
  }
}

export default EmitPlugin;
