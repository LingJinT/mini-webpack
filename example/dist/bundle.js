(function (modules) {
    function require(id) {
      const {fn, mapping} = modules[id]

      function _require(path) {
        return require(mapping[path])
      }

      const module = {exports:{}}

      fn(_require, module, module.exports)
    }
    require(0)
  })([object Object])