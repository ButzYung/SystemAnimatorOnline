// Mesh sorting worker (v1.1.0)

// kdtree START
/*
var THREE, kdtree_by_index
var use_kdtree = true
if (use_kdtree) {
  THREE = {};
  importScripts("../jThree/plugin/TypedArrayUtils.js");
  kdtree_by_index = [];
}
*/
// kdtree END

var mesh_by_index = []

onmessage = function(e) {
  var _buffer, _array, result

  if (e.data instanceof ArrayBuffer) {
    let buffer = new Float32Array(e.data)
    mesh_by_index[buffer[0]] = buffer
/*
    if (use_kdtree) {
kdtree_by_index[buffer[0]] = new THREE.TypedArrayUtils.Kdtree( buffer.slice(1), THREE.TypedArrayUtils._distanceFunction, 5 );
console.log(kdtree_by_index[buffer[0]])
    }
*/
    postMessage("ArrayBuffer received(" + buffer[0] + "," + buffer.length + ")")
    return
  }

  var t = performance.now()

  var para = e.data
// subject pos(0-2) + sort range(3) + object_base_index(4) + object index(5)
  var mesh = mesh_by_index[para[4]]
  if (!mesh) {
    postMessage("ERROR (worker): Mesh-" + para[4] + " does not exist.")
    return
  }

  _array = []
  var f_index = -1
  var dx, dy, dz, dd
  for (var i = 1, i_max = mesh.length; i < i_max; i += 4) {//5) {//
    f_index++

    dx = para[0] - mesh[i]
    dy = Math.min(para[1] - mesh[i+1], 0)
//dy = para[1] - mesh[i+1]
//dy = Math.min(dy,0)
    dz = para[2] - mesh[i+2]
    dd = para[3] + mesh[i+3]
    if (dx*dx + dy*dy + dz*dz < dd*dd)
      _array.push(f_index)
  }

  _buffer = new Uint32Array(_array)
//  postMessage(_buffer.buffer, [_buffer.buffer])
  result = { buffer:_buffer.buffer, t:performance.now()-t, obj_index:para[5] }
/*
if (use_kdtree) {
  t = performance.now()

  let maxDistance = para[3]
  let f_in_range = kdtree_by_index[para[4]].nearest( [para[0],para[1],para[2],0,0], 10000, maxDistance*maxDistance, THREE.TypedArrayUtils._result_func);
//console.log(_array.slice(0))
//  _array = []
//  f_in_range.forEach(function (a) { _array.push(a[0].obj[4]); })//.sort(function(a,b){return a-b;});
//console.log(_array)
//  _buffer = new Uint32Array(_array);
_buffer = new Uint32Array([para[5]].concat(f_in_range));
result.buffer = _buffer.buffer

  result.t = performance.now()-t -result.t//f_in_range.length//
}
*/
  postMessage(result, [result.buffer])

  _buffer = undefined
  _array = undefined
  result.buffer = undefined
  result = undefined
}
