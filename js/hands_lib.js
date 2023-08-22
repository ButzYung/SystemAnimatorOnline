// (2023-08-23)

var HandsAT = (function () {

  var module_common;
  var core;

  var _HandsAT = {
    type: 'HandsAT',
    init: async function init(_worker, param) {
// core START
module_common = await import('./mocap_lib_module.js');
core = new module_common.Core(_HandsAT);
// core END

await core.init(_worker, param);
    }
  };

  return _HandsAT;
})();
