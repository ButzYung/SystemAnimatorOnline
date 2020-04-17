'use strict';

//https://github.com/kripken/ammo.js/issues/36
var memory_size = (/memory_size\=(\d+)/i.test(location.search) && parseInt(RegExp.$1)) || 1;
var Module, ammo_path;
if (/^(file|https)/i.test(location.protocol) && (memory_size <= 2)) {
  ammo_path = "__ammo_v20200227.wasm.js";
}
else {
  Module = { TOTAL_MEMORY:67108864*memory_size };//{ TOTAL_MEMORY:52428800*2 };//
  ammo_path = "__ammo_v20200227.js";//"ammo.js";//
}
console.log(ammo_path)

importScripts(ammo_path);

var v = {};
var s_map_array = [];

function vf(_v) {
  if (_v === undefined)
    return _v
  if (typeof _v === "string")
    return v[_v]
//  if (_v.op) return (vf(_v.L) | vf(_v.R))
  return _v
}

function _onmessage(e) {
  var t = performance.now()
  var data = (typeof e.data === "string") ? JSON.parse(e.data) : e.data;

//postMessage("TEST")

  if (data.s_map_array) {
    s_map_array = data.s_map_array
  }

  var command_list = data.command_list
  var i_max = data.command_count

//var t=0;//var t=performance.now();var d=JSON.parse(e.data);t=performance.now()-t;
//postMessage("TEST:"+t+"/"+i_max);postMessage({ data_id:"stepSimulation", command_processed:i_max, value_list:[] });return;

  if (data.use_text_command) {
    if (typeof command_list === "string") {
      try {
        eval(command_list)
      }
      catch (err) {
        console.error(err)
      }
    }
    else {
      for (var i = 0; i < i_max; i++) {
        try {
          eval(command_list[i])
        }
        catch (err) {
//        console.error(err)
//        console.error(i+"/"+i_max+":"+command_list[i])
console.error(i+"/"+i_max+":"+JSON.stringify(command_list[i]))
        }
      }
    }
//console.log("WORKER:"+data.data_id+'/'+i_max+'/'+performance.now())
//postMessage("MAIN:"+data.data_id+'/'+i_max);return;
  }
  else {
    var r, c, p, pl
    var buffer_index = 0
    var co, cr, cn, cf

    var _btransform, _bv, _bq, body, _tr, _r, _o
    var command_optimized_processed = 0

    for (var i = 0; i < i_max; i++) {
      try {
/*
c = command_list[i]
p = c.p
pl = p.length
*/
co = command_list[buffer_index++]

if (co > 1) {
  command_optimized_processed++
  if (co == 2) {
    _btransform = v[s_map_array[command_list[buffer_index++]]]
    _bv = v[s_map_array[command_list[buffer_index++]]]
    _bq = v[s_map_array[command_list[buffer_index++]]]
  }
  else if (co == 3) {
    body = v[s_map_array[command_list[buffer_index++]]]
    _bv.setValue( command_list[buffer_index++], command_list[buffer_index++], command_list[buffer_index++] )
    _bq.setValue( command_list[buffer_index++], command_list[buffer_index++], command_list[buffer_index++], command_list[buffer_index++] )

			_btransform.setOrigin( _bv );
			_btransform.setRotation( _bq );
// AT: From MMDPhysics
body.setCenterOfMassTransform( _btransform );
body.getMotionState().setWorldTransform( _btransform );

  }
  else if (co == 4) {
    body = v[s_map_array[command_list[buffer_index++]]]
    _bv.setValue( command_list[buffer_index++], command_list[buffer_index++], command_list[buffer_index++] )

				body.getMotionState().getWorldTransform( _btransform );
//console.log(body);//console.log(body.getMotionState());
				//body.getWorldTransform( _btransform );
				_btransform.setOrigin( _bv );
// AT: From MMDPhysics
body.setCenterOfMassTransform( _btransform );
body.getMotionState().setWorldTransform( _btransform );

  }
  else if (co == 5) {
    body = v[s_map_array[command_list[buffer_index++]]]
    _tr  = v[s_map_array[command_list[buffer_index++]]] = body.getCenterOfMassTransform();
    _r   = v[s_map_array[command_list[buffer_index++]]] = _tr.getRotation();
    v[s_map_array[command_list[buffer_index++]]] = _r.x();
    v[s_map_array[command_list[buffer_index++]]] = _r.y();
    v[s_map_array[command_list[buffer_index++]]] = _r.z();
    v[s_map_array[command_list[buffer_index++]]] = _r.w();
  }
  else if (co == 6) {
    _tr  = v[s_map_array[command_list[buffer_index++]]];
    _o   = v[s_map_array[command_list[buffer_index++]]] = _tr.getOrigin();
    v[s_map_array[command_list[buffer_index++]]] = _o.x();
    v[s_map_array[command_list[buffer_index++]]] = _o.y();
    v[s_map_array[command_list[buffer_index++]]] = _o.z();
  }
}
else if (co == 1) {

  cr = s_map_array[command_list[buffer_index++]]
  cn = s_map_array[command_list[buffer_index++]]
  pl = command_list[buffer_index++]
  p = []
  for (var j = 0; j < pl; j++)
    p[j] = (command_list[buffer_index++]) ? s_map_array[command_list[buffer_index++]] : command_list[buffer_index++]
//continue
  if (pl == 0)
    v[cr] = new Ammo[cn]()
  else if (pl == 1)
    v[cr] = new Ammo[cn](vf(p[0]))
  else if (pl == 2)
    v[cr] = new Ammo[cn](vf(p[0]),vf(p[1]))
  else if (pl == 3)
    v[cr] = new Ammo[cn](vf(p[0]),vf(p[1]),vf(p[2]))
  else if (pl == 4)
    v[cr] = new Ammo[cn](vf(p[0]),vf(p[1]),vf(p[2]),vf(p[3]))
  else
    v[cr] = new Ammo[cn](vf(p[0]),vf(p[1]),vf(p[2]),vf(p[3]),vf(c.p[4]))

//v[cr] = new Ammo[cn](vf(c.p[0]),vf(c.p[1]),vf(c.p[2]),vf(c.p[3]),vf(c.p[4]))
}
else {

  cr = s_map_array[command_list[buffer_index++]]
  cn = s_map_array[command_list[buffer_index++]]
  cf = s_map_array[command_list[buffer_index++]]
  pl = command_list[buffer_index++]
  p = []
  for (var j = 0; j < pl; j++)
    p[j] = (command_list[buffer_index++]) ? s_map_array[command_list[buffer_index++]] : command_list[buffer_index++]
//continue
  r = ((cn)?v[cn]:Ammo)
  if (pl == 0)
    r = r[cf]()
  else if (pl == 1)
    r = r[cf](vf(p[0]))
  else if (pl == 2)
    r = r[cf](vf(p[0]),vf(p[1]))
  else if (pl == 3)
    r = r[cf](vf(p[0]),vf(p[1]),vf(p[2]))
  else if (pl == 4)
    r = r[cf](vf(p[0]),vf(p[1]),vf(p[2]),vf(p[3]))
  else
    r = r[cf](vf(p[0]),vf(p[1]),vf(p[2]),vf(p[3]),vf(p[4]))

//r = ((cn)?v[cn]:Ammo)[cf](vf(c.p[0]),vf(c.p[1]),vf(c.p[2]),vf(c.p[3]),vf(c.p[4]))
  if (cr)
    v[cr] = r
}
      }
      catch (err) {
        console.error(err)
//        console.error(i+"/"+i_max+":"+command_list[i])
console.error(i+"/"+i_max+":"+[co, cr, cn, cf]+"/"+p)
      }
    }

    command_list = data.command_list = undefined
  }

  var data_result = { data_id:data.data_id, command_processed:i_max, command_optimized_processed:command_optimized_processed, t0:performance.now()-t }

  var value_list
  var ir = data.index_registered
  if (!ir.buffer) {
    value_list = []
    for (var index in ir) {
      switch (ir[index]) {
case "btVector3":
  value_list.push({ i:index, p:"_v3", v:[v[index+".x"], v[index+".y"], v[index+".z"]] })
  break
case "btQuaternion":
  value_list.push({ i:index, p:"_q",  v:[v[index+".x"], v[index+".y"], v[index+".z"], v[index+".w"]] })
  break
default:
  console.error(ir[index])
      }
    }
    data_result.value_list = value_list
    postMessage(data_result)
  }
  else {
    value_list = new Float64Array(1+ir[0]*5)
    value_list[0] = ir[0]
    let value_list_index = 0
    let v_idx
    for (var i = 1, i_max = ir[0]+1; i < i_max; i++) {
      v_idx = value_list[++value_list_index] = ir[i]
      var index = s_map_array[v_idx]
      if ((index+".w") in v) {
//btQuaternion
value_list[++value_list_index] = v[index+".x"]
value_list[++value_list_index] = v[index+".y"]
value_list[++value_list_index] = v[index+".z"]
value_list[++value_list_index] = v[index+".w"]
      }
      else {
//btVector3 (assumed for now)
value_list[++value_list_index] = v[index+".x"]
value_list[++value_list_index] = v[index+".y"]
value_list[++value_list_index] = v[index+".z"]
      }
    }
    data_result.value_list = value_list
    data_result.t = performance.now()-t
    postMessage(data_result, [data_result.value_list.buffer])
  }

  ir = data.index_registered = undefined
  data_result.value_list = value_list = undefined
  data = data_result = undefined
}

function _init() {
  onmessage = _onmessage;
  postMessage("(ammo worker initialized|" + ammo_path + "|x" + memory_size + ")");
}

if (ammo_path == "ammo.js") {
  _init();
}
else {
  Ammo(Module).then(function () {
    _init();
  });
}
