class SealPlugin {
  constructor() {}

  apply(compiler) {
    compiler.hooks.compilation.tap("SealPlugin", (compilation) => {
      compilation.hooks.seal.tap("SealPlugin", () => {
        // 模块集合，利用函数作用域隔离变量，把require, module, exports注入，
        const modules = compilation.graph.reduce((obj, cur) => {
          return (
            obj +
            `${cur.id}: [${JSON.stringify(
              cur.mapping
            )}, function(require, module, exports) {
						${cur.code}
					}],`
          );
        }, "");
        compilation.modules = modules;
      });
    });
  }
}

export default SealPlugin;
