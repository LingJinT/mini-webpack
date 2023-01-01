(function (modules) {
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
		})({0: [{"./foo/foo.js":1}, function(require, module, exports) {
						"use strict";

var _foo = require("./foo/foo.js");
console.log("mini-webpack");
(0, _foo.foo)();
					}],1: [{"../bar.js":2}, function(require, module, exports) {
						"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.foo = foo;
var _bar = require("../bar.js");
function foo() {
  console.log("foo");
}
(0, _bar.bar)();
					}],2: [{}, function(require, module, exports) {
						"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bar = bar;
function bar() {
  console.log('bar');
}
					}],})