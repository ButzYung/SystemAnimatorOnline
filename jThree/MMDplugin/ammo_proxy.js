// Ammo worker "proxy" - v1.0.0

var Ammo_local;
if (self.Ammo) {
  Ammo_local = Ammo;
}

var Ammo = (function () {

  var command_list = []

  var v_counter = -1
  var v = {}
  var s_map = new Map()
  var s_map_array = []

  function v_set(obj, index) {
    obj._v_index = index || ("i" + (++v_counter));
    v[obj._v_index] = obj
    if (!s_map.has(obj._v_index))
      s_map.set(obj._v_index, s_map.size)
  }

  var v_assign = (function () {
var proxy;

var buffer_command, buffer_index;
function string_buffer(s, use_type_flag) {
  var s_index
  if (s) {
    s_index = s_map.get(s)
    if (s_index === undefined) {
      s_index = s_map.size
      s_map.set(s, s_index)
    }
  }
  else
    s_index = -1
  if (use_type_flag)
    buffer_command[buffer_index++] = 1
  buffer_command[buffer_index++] = s_index
}
function float_buffer(f) {
  buffer_command[buffer_index++] = 0
  buffer_command[buffer_index++] = f
}
function map_buffer(p) {
  if (p._v_index != null)
    string_buffer(p._v_index, true)
  else
    float_buffer(p)
}
function init_buffer() {
  var buffer_length_old = proxy.command_buffer.length
  var buffer_length = proxy.command_buffer.length
  var scale = 1
  while (buffer_length < proxy.command_buffer_index+15) {
    scale *= 1.2
    buffer_length = ~~(proxy.command_buffer_index * scale)
  }

  if (scale > 1) {
    proxy.command_buffer_size = buffer_length
    let command_buffer = new Float64Array(proxy.command_buffer_size)
    command_buffer.set(proxy.command_buffer)
    proxy.command_buffer = command_buffer
    command_buffer = undefined

    proxy.command_buffer_size_max = Math.max((proxy.command_buffer_size_max||0), proxy.command_buffer_size)
    console.log("ammo worker - command buffer extended:" + buffer_length_old + " => " + proxy.command_buffer_size + "/ x" + scale)
  }
  return proxy.command_buffer
}

function map(p) {
  if (proxy.use_text_command)
    return ((p._v_index != null) ? "v['" + Ammo_v(p._v_index) + "']" : p);
  return ((p._v_index != null) ? p._v_index : p);
}

function Ammo_v(name) {
  return (Ammo_local) ? "L."+name : name;
}

function Ammo_command(command) {
  if (!Ammo_local)
    return command

  let Ammo = Ammo_local
  try {
    eval(command)
  }
  catch (err) {
    console.error(err)
    console.error(command)
  }
  return ""
}

return function (obj, para) {
  proxy = Ammo._proxy

  if (!para)
    para = []
  para = para.filter(function (p) { return p != null; });

  var command
  var use_command = !proxy._locked && !proxy.locked && (!v_assign._para || !v_assign._para.no_command)
  if (obj._new_object) {
    v_set(obj, (v_assign._para && v_assign._para.index))
    if (use_command) {
      if (proxy.use_text_command)
        command = Ammo_command("v['" + Ammo_v(obj._v_index) + "']=new Ammo." + obj._name + "(" + para.map(map).join(",") + ")")
      else {
//        command = { o:true, r:obj._v_index, n:obj._name, p:para.map(map) }

buffer_command = init_buffer()
buffer_index = proxy.command_buffer_index
//o (true,1)
buffer_command[buffer_index++] = 1
//r
string_buffer(obj._v_index)
//n
string_buffer(obj._name)
//p
buffer_command[buffer_index++] = para.length
para.forEach(map_buffer)
// update command_buffer_index
proxy.command_buffer_index = buffer_index
proxy.command_buffer_count++

      }
    }
  }
  else {
    if (use_command) {
      if (proxy.use_text_command)
        command = Ammo_command(((obj._return_value) ? "v['" + Ammo_v(obj._return_value) + "']=" : "") + ((obj._v_index == null) ? "Ammo." : "v['" + Ammo_v(obj._v_index) + "'].") + obj._name + "(" + para.map(map).join(",") + ")")
      else if (obj.o > 1) {

buffer_command = init_buffer()
buffer_index = proxy.command_buffer_index
var o = obj.o
buffer_command[buffer_index++] = o
//o (2=init temp vars, 3=preSimulate, 4=postSimulate(rigid.type==2), 5=postSimulate(body.getCenterOfMassTransform.getRotation), 6=postSimulate(.getCenterOfMassTransform.getOrigin))
if (o == 2) {
  string_buffer(obj._btransform_v_index)
  string_buffer(obj._bv_v_index)
  string_buffer(obj._bq_v_index)
}
else if (o == 3) {
  string_buffer(obj.body_v_index)
  buffer_command[buffer_index++] = obj._v.x
  buffer_command[buffer_index++] = obj._v.y
  buffer_command[buffer_index++] = obj._v.z
  buffer_command[buffer_index++] = obj._q.x
  buffer_command[buffer_index++] = obj._q.y
  buffer_command[buffer_index++] = obj._q.z
  buffer_command[buffer_index++] = obj._q.w
}
else if (o == 4) {
  string_buffer(obj.body_v_index)
  buffer_command[buffer_index++] = obj._v.x
  buffer_command[buffer_index++] = obj._v.y
  buffer_command[buffer_index++] = obj._v.z
}
else if (o == 5) {
  string_buffer(obj.body_v_index)
  string_buffer(obj.body_v_index+".getCenterOfMassTransform")
  string_buffer(obj.body_v_index+".getCenterOfMassTransform.getRotation")
  string_buffer(obj.body_v_index+".getCenterOfMassTransform.getRotation.x")
  string_buffer(obj.body_v_index+".getCenterOfMassTransform.getRotation.y")
  string_buffer(obj.body_v_index+".getCenterOfMassTransform.getRotation.z")
  string_buffer(obj.body_v_index+".getCenterOfMassTransform.getRotation.w")
}
else if (o == 6) {
  string_buffer(obj.body_v_index+".getCenterOfMassTransform")
  string_buffer(obj.body_v_index+".getCenterOfMassTransform.getOrigin")
  string_buffer(obj.body_v_index+".getCenterOfMassTransform.getOrigin.x")
  string_buffer(obj.body_v_index+".getCenterOfMassTransform.getOrigin.y")
  string_buffer(obj.body_v_index+".getCenterOfMassTransform.getOrigin.z")
}
// update command_buffer_index
proxy.command_buffer_index = buffer_index
proxy.command_buffer_count++

      }
      else {
//        command = { r:(obj._return_value||""), n:(obj._v_index||""), f:obj._name, p:para.map(map) }

buffer_command = init_buffer()
buffer_index = proxy.command_buffer_index
//o (false,0)
buffer_command[buffer_index++] = 0
//r
string_buffer((obj._return_value||""))
//n
string_buffer((obj._v_index||""))
//f
string_buffer(obj._name)
//p
buffer_command[buffer_index++] = para.length
para.forEach(map_buffer)
// update command_buffer_index
proxy.command_buffer_index = buffer_index
proxy.command_buffer_count++

      }
    }
  }

  if (command)
    command_list.push(command)

  v_assign._para = null
};
  })();

  var btShape_prototype = {
    calculateLocalInertia: function (mass, _btVector3) {
//( mass, localInertia )
      v_assign({ _name:"calculateLocalInertia", _v_index:this._v_index }, [mass, _btVector3])
    }
  };

  return {

    _proxy: {
  use_text_command: !!Ammo_local || false//true//
 ,use_optimized_command: true//false//

 ,index_registered: {}
 ,_timeStep: 0

 ,command_list_queue: []
 ,worker_initialized: false
 ,init: function () {
var that = this

this._use_text_command = this.use_text_command
this.use_text_command = true

if (this.use_optimized_command) {
  this.add_optimized_command = function (obj) {
    v_assign(obj)
  }
}

//window.addEventListener("jThree_ready", function () {

let memory_size = (MMD_SA_options.model_para_obj.ammo_memory_size || MMD_SA_options.ammo_memory_size) || 1;
that.worker = new Worker("jThree/MMDplugin/ammo_worker.js");// + ((memory_size) ? "?memory_size="+memory_size : ""));
that.worker.onmessage = function (e) {
  var data = ((typeof e.data == "string") && (e.data.charAt(0) === "{")) ? JSON.parse(e.data) : e.data;

  if (typeof data === "string") {
    if (/^TEST/.test(data)) {
if (MMD_SA.MMD_started) {
  EV_sync_update.RAF_func.push((function () {
    var msg = data+"\n"+parseInt((performance.now()-that.t))+"\n"+Date.now()
    return function () {
      DEBUG_show(msg)
    };
  })());
}
    }
    else {
      console.log(data)
      if (!that.worker_initialized) {
        that.worker_initialized = true
        if (that.command_list_queue.length) {
          console.log("(command queue exists, sending to worker)")
          command_list = that.command_list_queue
          that.command_list_queue = []
          that.update_worker()
        }
      }
    }
  }
  else {
//if (data.t) System._browser.on_animation_update.add((function(){let _t=data.t; return function(){DEBUG_show(_t)};})(), 0,0);
    var vl = data.value_list
    var vl_length
    if (Array.isArray(vl)) {
      vl_length = vl.length
      vl.forEach(function (_v) {
v[_v.i][_v.p].fromArray(_v.v)
      });
    }
    else {
      vl_length = vl[0]
      var vl_index = 0
      for (var i = 1, i_max = vl[0]+1; i < i_max; i++) {
var _v = v[s_map_array[vl[++vl_index]]]
switch (_v._name) {
  case "btVector3":
    _v._v3.set(vl[++vl_index], vl[++vl_index], vl[++vl_index])
    break
  case "btQuaternion":
    _v._q.set(vl[++vl_index], vl[++vl_index], vl[++vl_index], vl[++vl_index])
    break
  default:
    console.error(_v._name)
}
      }
    }
    vl = data.value_list = undefined

    var t = performance.now()
    if (vl_length) {
that.cache_by_model_next.transfer_to("cache_by_model")
/*
EV_sync_update.RAF_func.push((function () {
  var msg = "ammo worker (" + (data.command_optimized_processed+"/"+data.command_processed+","+vl_length) + ") - time:" + parseInt(t-that.t);
  return function () {
    DEBUG_show(msg)
  };
})());
*/
    }
    else {
//console.log("ammo worker (" + (data.command_processed+"/"+vl_length) + ") - time:" + (t-that.t))
    }
    that.t = t

    if (data.data_id)
      that.data_id_locked[data.data_id] = false
//console.log(data.t0, data.t)
  }

  data = undefined
};

//});

var Cache = function () {
  this.enabled = false

  this.list = {}
};
Cache.prototype = {
  constructor: Cache

// shared by all Cache objects
 ,_disabled_by_model_index: {}

 ,reset: function () {
this.enabled = false
  }

 ,get_enabled: function (model_index) {
return this.enabled && !this._disabled_by_model_index[model_index]
  }

 ,set_enabled: function (model_index, enabled) {
this._disabled_by_model_index[model_index] = !enabled
  }

 ,set_matrixWorld: function (model_index, matrixWorld) {
if (Ammo._proxy.locked) return;

this.enabled = true
var obj = this.list[model_index]
obj.matrixWorld.copy(matrixWorld)
obj.matrixWorld_inv.getInverse(matrixWorld)
obj.q_matrixWorld_inv.setFromRotationMatrix(obj.matrixWorld_inv)
  }

 ,set_skin: function (model_index, bones, use_temp_skin) {
var obj = this.list[model_index]

if (use_temp_skin) {
  for (var b_index in obj._skin) {
    obj._skin[b_index].copy(bones[b_index].skinMatrix)
  }
}

if (Ammo._proxy.locked) return;

this.enabled = true
for (var b_index in obj.skin) {
  obj.skin[b_index].copy(bones[b_index].skinMatrix)
}
  }

 ,transfer_to: function (cache_name) {
var cache_target = that[cache_name]
var temp = cache_target.list
cache_target.list = this.list
this.list = temp

cache_target.enabled = true
this.reset()
  }
};

this.cache_by_model = new Cache()
this.cache_by_model_next = new Cache()
this.cache_by_model_temp = new Cache()

window.addEventListener("MMDStarted", function (e) {
  var c_list = [that.cache_by_model, that.cache_by_model_next, that.cache_by_model_temp];

  c_list.forEach(function (cache, idx) {
    for (var i = 0, i_max = MMD_SA_options.model_para_obj_all.length; i < i_max; i++) {
var obj = cache.list[i] = { skin:{}, _skin:{} }
obj.matrixWorld = new THREE.Matrix4()
obj.matrixWorld_inv = new THREE.Matrix4()
obj.q_matrixWorld_inv = new THREE.Quaternion()

var model = THREE.MMD.getModels()[i]
var mesh = model.mesh
var rigids = mesh.MMDrigids
//var rigid_index_by_bone = model.pmx.rigid_index_by_bone
rigids.forEach(function (r) {
//  if ( r.type !== 0 && r.bone >= 0 ) {
  if ( r.type == 1 && r.bone >= 0 ) {
    obj.skin[r.bone]  = new THREE.Matrix4()
    obj._skin[r.bone] = new THREE.Matrix4()
  }
});
    }
  });
});
  }

 ,reset: function () {
this.index_registered = {}
command_list = []
if (this.command_buffer) {
  this.command_buffer_index = 0
  this.command_buffer_count = 0
  if (this.index_buffer)
    this.index_buffer[0] = 0
}
  }

// temp lock for v_assign()
 ,_locked: false

 ,data_id_locked: {}
 ,lock_id: ""
 ,locked: false
 ,lock: function (lock_id) {
this.lock_id = lock_id
this.locked = this.data_id_locked[lock_id]
if (this.locked) {
  var command_length = this.command_buffer_count || command_list.length
  if (command_length) {
    this.update_worker()
    console.log("ammo worker - update before lock (" + lock_id + "/" + command_length + ")")
  }
}
  }

 ,t: 0
 ,s_map_counter: -1
 ,command_buffer_size_scale: 1.2
 ,update_worker: function (data_id) {
if (Ammo_local)
  return true

if (!this.worker_initialized) {
  this.command_list_queue = this.command_list_queue.concat(command_list)
  command_list = []
  return false
}

this.lock_id = ""
this.locked = false
if (data_id && this.data_id_locked[data_id]) return false

this.t = performance.now()

var data = {
  data_id: data_id || ""
 ,use_text_command: this.use_text_command
 ,command_count: this.command_buffer_count || command_list.length
 ,command_list: this.command_buffer || command_list//(this.use_text_command) ? [command_list.join(";")+";"] : command_list//
 ,index_registered: this.index_buffer || this.index_registered
};

if (this.s_map_counter < s_map.size) {
  s_map_array = data.s_map_array = Array.from(s_map.keys())
  this.s_map_counter = s_map.size
  console.log("ammo worker - string map updated (" + s_map.size + ")")
}

if (data_id)
  this.data_id_locked[data_id] = true

if (this.command_buffer) {
  this.worker.postMessage(data, [data.command_list.buffer, data.index_registered.buffer])
  data.command_list = data.index_registered = undefined
}
else {
//console.log(data)
  this.worker.postMessage(JSON.stringify(data))
}
///this.worker.postMessage(data)

if ((this._use_text_command !== null) && (data_id === "stepSimulation")) {
  this.use_text_command = this._use_text_command
  this._use_text_command = null
  console.log("ammo worker - use text command:" + this.use_text_command)
  console.log("ammo worker - use optimized command:" + (this.use_optimized_command && !this.use_text_command))
}
if (!this.use_text_command && (!this.command_buffer || !this.command_buffer.length)) {
  this.command_buffer_size = ((data_id === "stepSimulation") && ((this.command_buffer_index && (this.command_buffer_size_max || ~~(this.command_buffer_index*this.command_buffer_size_scale))) || ~~(data.command_count*this.command_buffer_size_scale)*15)) || this.command_buffer_size
  if ((data_id === "stepSimulation") && this.command_buffer_index)
    this.command_buffer_size_max = Math.max((this.command_buffer_size_max||0), this.command_buffer_size)
  this.command_buffer = new Float64Array(this.command_buffer_size)
//  console.log("ammo worker - Float64Array created (" + this.command_buffer_size + ")")

  if (!this.index_buffer_size) {
    var index_buffer_size = 0
    THREE.MMD.getModels().forEach(function (model) {
      model.mesh.MMDrigids.forEach(function (r) {
        if ( r.type !== 0 && r.bone >= 0 )
          index_buffer_size += 2
      });
    });
    this.index_buffer_size = 1 + index_buffer_size
    console.log("ammo worker - Float64Array index buffer size:" + this.index_buffer_size)
  }
  this.index_buffer = new Float64Array(this.index_buffer_size)
}

this.reset()

data = undefined
return true
  }

 ,register: function (obj_list) {
if (this.locked) return;

for (var i = 0, i_max = obj_list.length; i < i_max; i++) {
  var obj = obj_list[i]
  if (obj) {
    var ib = this.index_buffer
    if (ib)
      ib[++ib[0]] = s_map.get(obj._v_index)
    else
      this.index_registered[obj._v_index] = obj._name
  }
}
  }
    }

   ,destroy: function (p) {
      v_assign({ _name:"destroy" }, [p])
    }
/*
//a
   ,a: (function () {
var a = function () {
  v_assign(this)
};

a.prototype = {
  constructor: a
 ,_name: "a"
 ,_new_object: true
};

return a;
    })()
*/
//btDefaultCollisionConfiguration
   ,btDefaultCollisionConfiguration: (function () {
var btDefaultCollisionConfiguration = function () {
  v_assign(this)
};

btDefaultCollisionConfiguration.prototype = {
  constructor: btDefaultCollisionConfiguration
 ,_name: "btDefaultCollisionConfiguration"
 ,_new_object: true
};

return btDefaultCollisionConfiguration;
    })()

//btCollisionDispatcher
   ,btCollisionDispatcher: (function () {
var btCollisionDispatcher = function (_btDefaultCollisionConfiguration) {
  v_assign(this, [_btDefaultCollisionConfiguration])
};

btCollisionDispatcher.prototype = {
  constructor: btCollisionDispatcher
 ,_name: "btCollisionDispatcher"
 ,_new_object: true
};

return btCollisionDispatcher;
    })()

//btSequentialImpulseConstraintSolver
   ,btSequentialImpulseConstraintSolver: (function () {
var btSequentialImpulseConstraintSolver = function () {
  v_assign(this)
};

btSequentialImpulseConstraintSolver.prototype = {
  constructor: btSequentialImpulseConstraintSolver
 ,_name: "btSequentialImpulseConstraintSolver"
 ,_new_object: true
};

return btSequentialImpulseConstraintSolver;
    })()

//btDbvtBroadphase
   ,btDbvtBroadphase: (function () {
var btDbvtBroadphase = function () {
  v_assign(this)
};

btDbvtBroadphase.prototype = {
  constructor: btDbvtBroadphase
 ,_name: "btDbvtBroadphase"
 ,_new_object: true
};

return btDbvtBroadphase;
    })()

//btDiscreteDynamicsWorld
   ,btDiscreteDynamicsWorld: (function () {
var btDiscreteDynamicsWorld = function (_btCollisionDispatcher, _btDbvtBroadphase, _btSequentialImpulseConstraintSolver, _btDefaultCollisionConfiguration) {
  v_assign(this, [_btCollisionDispatcher, _btDbvtBroadphase, _btSequentialImpulseConstraintSolver, _btDefaultCollisionConfiguration])
};

btDiscreteDynamicsWorld.prototype = {
  constructor: btDiscreteDynamicsWorld
 ,_name: "btDiscreteDynamicsWorld"
 ,_new_object: true

 ,addRigidBody: function (_btRigidBody, group, mask) {
//(body, 1 << v.group, v.mask)
    v_assign({ _name:"addRigidBody", _v_index:this._v_index }, [_btRigidBody, group, mask])
  }

 ,removeRigidBody: function (_btRigidBody) {
//( v.body )
    v_assign({ _name:"removeRigidBody", _v_index:this._v_index }, [_btRigidBody])
  }

 ,addConstraint: function (_btGeneric6DofSpringConstraint, bool) {
//( c, true )
    v_assign({ _name:"addConstraint", _v_index:this._v_index }, [_btGeneric6DofSpringConstraint, bool])
  }

 ,removeConstraint: function (_btGeneric6DofSpringConstraint) {
//( v.constraint )
    v_assign({ _name:"removeConstraint", _v_index:this._v_index }, [_btGeneric6DofSpringConstraint])
  }

 ,setGravity: function (_btVector3) {
//( tmpBV( x,y,z ) )
    v_assign({ _name:"setGravity", _v_index:this._v_index }, [_btVector3])
  }

 ,stepSimulation: function (timeStep, maxSubSteps, fixedTimeStep) {
//( timeStep, maxSubSteps, fixedTimeStep )
    v_assign({ _name:"stepSimulation", _v_index:this._v_index }, [timeStep, maxSubSteps, fixedTimeStep])
  }
};

return btDiscreteDynamicsWorld;
    })()

//btTransform
   ,btTransform: (function () {
var btTransform = function () {
  v_assign(this)
};

btTransform.prototype = {
  constructor: btTransform
 ,_name: "btTransform"
 ,_new_object: true

 ,setIdentity: function () {
    v_assign({ _name:"setIdentity", _v_index:this._v_index })
  }

 ,setOrigin: function (_btVector3) {
//( tmpBV( x,y,z ) )
    v_assign({ _name:"setOrigin", _v_index:this._v_index }, [_btVector3])
  }

 ,setRotation: function (_btQuaternion) {
//( tmpBQ( x,y,z,w ) )
    v_assign({ _name:"setRotation", _v_index:this._v_index }, [_btQuaternion])
  }

 ,getRotation: function () {
    var _btQuaternion = v[this._v_index+".getRotation"]
    if (!_btQuaternion) {
      v_assign._para = { index:this._v_index+".getRotation", no_command:true }
      _btQuaternion = new Ammo.btQuaternion()
    }

    v_assign({ _name:"getRotation", _v_index:this._v_index, _return_value:_btQuaternion._v_index })
    return _btQuaternion
  }

 ,getOrigin: function () {
    var _btVector3 = v[this._v_index+".getOrigin"]
    if (!_btVector3) {
      v_assign._para = { index:this._v_index+".getOrigin", no_command:true }
      _btVector3 = new Ammo.btVector3()
    }

    v_assign({ _name:"getOrigin", _v_index:this._v_index, _return_value:_btVector3._v_index })
    return _btVector3
  }

 ,getBasis: function () {
    var _btMatrix3x3 = v[this._v_index+".getBasis"]
    if (!_btMatrix3x3) {
      v_assign._para = { index:this._v_index+".getBasis", no_command:true }
      _btMatrix3x3 = new Ammo.btMatrix3x3()
    }

    v_assign({ _name:"getBasis", _v_index:this._v_index, _return_value:_btMatrix3x3._v_index })
    return _btMatrix3x3
  }
};

return btTransform;
    })()

//btMatrix3x3
   ,btMatrix3x3: (function () {
var btMatrix3x3 = function () {
  v_assign(this)
};

btMatrix3x3.prototype = {
  constructor: btMatrix3x3
 ,_name: "btMatrix3x3"
 ,_new_object: true

 ,getRotation: function () {
    var _btQuaternion = v[this._v_index+".getRotation"]
    if (!_btQuaternion) {
      v_assign._para = { index:this._v_index+".getRotation", no_command:true }
      _btQuaternion = new Ammo.btQuaternion()
    }

    v_assign({ _name:"getRotation", _v_index:this._v_index, _return_value:_btQuaternion._v_index })
    return _btQuaternion
  }

 ,setEulerZYX: function (z, y, x) {
    v_assign({ _name:"setEulerZYX", _v_index:this._v_index }, [z, y, x])
  }
};

return btMatrix3x3;
    })()

//btVector3
   ,btVector3: (function () {
var btVector3 = function (x, y, z) {
  this._v3 = new THREE.Vector3()
  v_assign(this, [x, y, z])//[x||0, y||0, z||0])
};

btVector3.prototype = {
  constructor: btVector3
 ,_name: "btVector3"
 ,_new_object: true

 ,setValue: function (x, y, z) {
    v_assign({ _name:"setValue", _v_index:this._v_index }, [x, y, z])
  }

 ,x: function () {
    v_assign({ _name:"x", _v_index:this._v_index, _return_value:this._v_index+".x" })
    return (Ammo_local) ? v["L."+this._v_index].x() : this._v3.x;
  }
 ,y: function () {
    v_assign({ _name:"y", _v_index:this._v_index, _return_value:this._v_index+".y" })
    return (Ammo_local) ? v["L."+this._v_index].y() : this._v3.y;
  }
 ,z: function () {
    v_assign({ _name:"z", _v_index:this._v_index, _return_value:this._v_index+".z" })
    return (Ammo_local) ? v["L."+this._v_index].z() : this._v3.z;
  }
 ,getX: function () { return this.x(); }
 ,getY: function () { return this.y(); }
 ,getZ: function () { return this.z(); }

 ,setX: function (num) {
    v_assign({ _name:"setX", _v_index:this._v_index }, [num])
  }

 ,setY: function (num) {
    v_assign({ _name:"setY", _v_index:this._v_index }, [num])
  }

 ,setZ: function (num) {
    v_assign({ _name:"setZ", _v_index:this._v_index }, [num])
  }
};

return btVector3;
    })()

//btQuaternion
   ,btQuaternion: (function () {
var btQuaternion = function (x, y, z, w) {
  this._q = new THREE.Quaternion()
  v_assign(this, [x, y, z, w])//[x||0, y||0, z||0], w||1)
};

btQuaternion.prototype = {
  constructor: btQuaternion
 ,_name: "btQuaternion"
 ,_new_object: true

 ,setValue: function (x, y, z, w) {
    v_assign({ _name:"setValue", _v_index:this._v_index }, [x, y, z, w])
  }

 ,setEulerZYX: function (z, y, x) {
    v_assign({ _name:"setEulerZYX", _v_index:this._v_index }, [z, y, x])
  }

 ,x: function () {
    v_assign({ _name:"x", _v_index:this._v_index, _return_value:this._v_index+".x" })
    return (Ammo_local) ? v["L."+this._v_index].x() : this._q.x;
  }
 ,y: function () {
    v_assign({ _name:"y", _v_index:this._v_index, _return_value:this._v_index+".y" })
    return (Ammo_local) ? v["L."+this._v_index].y() : this._q.y;
  }
 ,z: function () {
    v_assign({ _name:"z", _v_index:this._v_index, _return_value:this._v_index+".z" })
    return (Ammo_local) ? v["L."+this._v_index].z() : this._q.z;
  }
 ,w: function () {
    v_assign({ _name:"w", _v_index:this._v_index, _return_value:this._v_index+".w" })
    return (Ammo_local) ? v["L."+this._v_index].w() : this._q.w;
  }
};

return btQuaternion;
    })()

//btSphereShape
   ,btSphereShape: (function () {
var btSphereShape = function (num) {
  v_assign(this, [num])
};

btSphereShape.prototype = {
  constructor: btSphereShape
 ,_name: "btSphereShape"
 ,_new_object: true
};

Object.assign(btSphereShape.prototype, btShape_prototype);

return btSphereShape;
    })()

//btBoxShape
   ,btBoxShape: (function () {
var btBoxShape = function (_btVector3) {
  v_assign(this, [_btVector3])
};

btBoxShape.prototype = {
  constructor: btBoxShape
 ,_name: "btBoxShape"
 ,_new_object: true
};

Object.assign(btBoxShape.prototype, btShape_prototype);

return btBoxShape;
    })()

//btCapsuleShape
   ,btCapsuleShape: (function () {
var btCapsuleShape = function (num0, num1) {
  v_assign(this, [num0, num1])
};

btCapsuleShape.prototype = {
  constructor: btCapsuleShape
 ,_name: "btCapsuleShape"
 ,_new_object: true
};

Object.assign(btCapsuleShape.prototype, btShape_prototype);

return btCapsuleShape;
    })()

//btDefaultMotionState
   ,btDefaultMotionState: (function () {
var btDefaultMotionState = function (_btTransform) {
  v_assign(this, [_btTransform])
};

btDefaultMotionState.prototype = {
  constructor: btDefaultMotionState
 ,_name: "btDefaultMotionState"
 ,_new_object: true
};

return btDefaultMotionState;
    })()

//btRigidBodyConstructionInfo
   ,btRigidBodyConstructionInfo: (function () {
var btRigidBodyConstructionInfo = function (mass, _btDefaultMotionState, _btShape, _btVector3) {
  v_assign(this, [mass, _btDefaultMotionState, _btShape, _btVector3])
};

btRigidBodyConstructionInfo.prototype = {
  constructor: btRigidBodyConstructionInfo
 ,_name: "btRigidBodyConstructionInfo"
 ,_new_object: true

 ,set_m_friction: function (friction) {
//( v.friction )
    v_assign({ _name:"set_m_friction", _v_index:this._v_index }, [friction])
  }

 ,set_m_restitution: function (restitution) {
//( v.restitution )
    v_assign({ _name:"set_m_restitution", _v_index:this._v_index }, [restitution])
  }
};

return btRigidBodyConstructionInfo;
    })()

//btRigidBody
   ,btRigidBody: (function () {
var btRigidBody = function (_btRigidBodyConstructionInfo) {
  v_assign(this, [_btRigidBodyConstructionInfo])
};
/*
var af = function (a) {
  if (Ammo._proxy.use_text_command)
    return JSON.stringify(a)
  return a
}
*/
btRigidBody.prototype = {
  constructor: btRigidBody
 ,_name: "btRigidBody"
 ,_new_object: true

 ,setCollisionFlags: function (flags) {
//( body.getCollisionFlags() | 2 )
    v_assign({ _name:"setCollisionFlags", _v_index:this._v_index }, [flags])
  }

 ,getCollisionFlags: function () {
    var flags, index
    flags = {}
    index = this._v_index+".getCollisionFlags"
    v_set(flags, index)

    v_assign({ _name:"getCollisionFlags", _v_index:this._v_index, _return_value:index  })
    return flags
  }

 ,setActivationState: function (state) {
    v_assign({ _name:"setActivationState", _v_index:this._v_index }, [state])
  }

 ,setDamping: function (posDamping, rotDamping) {
//(v.posDamping *(rigid_default.posDamping_scale||1), v.rotDamping *(rigid_default.rotDamping_scale||1))
    v_assign({ _name:"setDamping", _v_index:this._v_index }, [posDamping, rotDamping])
  }

 ,setSleepingThresholds: function (num0, num1) {
//(0, 0)
    v_assign({ _name:"setSleepingThresholds", _v_index:this._v_index }, [num0, num1])
  }

 ,getMotionState: function () {
    var _btMotionState = v[this._v_index+".getMotionState"]
    if (!_btMotionState) {
      v_assign._para = { index:this._v_index+".getMotionState", no_command:true }
      _btMotionState = new Ammo.btMotionState()
    }

    v_assign({ _name:"getMotionState", _v_index:this._v_index, _return_value:_btMotionState._v_index })
    return _btMotionState
  }

 ,setWorldTransform: function (_btTransform) {
    v_assign({ _name:"setWorldTransform", _v_index:this._v_index }, [_btTransform])
  }

 ,setLinearVelocity: function (_btVector3) {
    v_assign({ _name:"setLinearVelocity", _v_index:this._v_index }, [_btVector3])
  }
/*
 ,localOrientation: function (_array0, _array1, _array2) {
    v_assign({ _name:"localOrientation", _v_index:this._v_index }, [af(_array0), af(_array1), af(_array2)])
  }
*/
 ,setAngularVelocity: function (_btVector3, num) {
    v_assign({ _name:"setAngularVelocity", _v_index:this._v_index }, [_btVector3])
  }

 ,getCenterOfMassTransform: function (_btTransform) {
    var _return_value, para
    if (!_btTransform) {
      _btTransform = v[this._v_index+".getCenterOfMassTransform"]
      if (!_btTransform) {
        v_assign._para = { index:this._v_index+".getCenterOfMassTransform", no_command:true }
        _btTransform = new Ammo.btTransform()
      }
      _return_value = _btTransform._v_index
    }
    else {
      para = [_btTransform]
    }

    v_assign({ _name:"getCenterOfMassTransform", _v_index:this._v_index, _return_value:_return_value }, para)
    return _btTransform
  }

 ,setCenterOfMassTransform: function (_btTransform) {
    v_assign({ _name:"setCenterOfMassTransform", _v_index:this._v_index }, [_btTransform])
  }

 ,getWorldTransform: function (_btTransform) {
    var _return_value, para
    if (!_btTransform) {
      _btTransform = v[this._v_index+".getWorldTransform"]
      if (!_btTransform) {
        v_assign._para = { index:this._v_index+".getWorldTransform", no_command:true }
        _btTransform = new Ammo.btTransform()
      }
      _return_value = _btTransform._v_index
    }
    else {
      para = [_btTransform]
    }

    v_assign({ _name:"getWorldTransform", _v_index:this._v_index, _return_value:_return_value }, para)
    return _btTransform
  }
};

return btRigidBody;
    })()

//btMotionState
   ,btMotionState: (function () {
var btMotionState = function () {
  v_assign(this)
};

btMotionState.prototype = {
  constructor: btMotionState
 ,_name: "btMotionState"
 ,_new_object: true

 ,getWorldTransform: function (_btTransform) {
    var _return_value, para
    if (!_btTransform) {
      _btTransform = v[this._v_index+".getWorldTransform"]
      if (!_btTransform) {
        v_assign._para = { index:this._v_index+".getWorldTransform", no_command:true }
        _btTransform = new Ammo.btTransform()
      }
      _return_value = _btTransform._v_index
    }
    else {
      para = [_btTransform]
    }

    v_assign({ _name:"getWorldTransform", _v_index:this._v_index, _return_value:_return_value }, para)
    return _btTransform
  }

 ,setWorldTransform: function (_btTransform) {
    v_assign({ _name:"setWorldTransform", _v_index:this._v_index }, [_btTransform])
  }
};

return btMotionState;
    })()

//btGeneric6DofSpringConstraint
   ,btGeneric6DofSpringConstraint: (function () {
var btGeneric6DofSpringConstraint = function (_btRigidBody0, _btRigidBody1, _btTransform0, _btTransform1, bool) {
  v_assign(this, [_btRigidBody0, _btRigidBody1, _btTransform0, _btTransform1, bool])
};

btGeneric6DofSpringConstraint.prototype = {
  constructor: btGeneric6DofSpringConstraint
 ,_name: "btGeneric6DofSpringConstraint"
 ,_new_object: true

 ,setLinearLowerLimit: function (_btVector3) {
    v_assign({ _name:"setLinearLowerLimit", _v_index:this._v_index }, [_btVector3])
  }

 ,setLinearUpperLimit: function (_btVector3) {
    v_assign({ _name:"setLinearUpperLimit", _v_index:this._v_index }, [_btVector3])
  }

 ,setAngularLowerLimit: function (_btVector3) {
    v_assign({ _name:"setAngularLowerLimit", _v_index:this._v_index }, [_btVector3])
  }

 ,setAngularUpperLimit: function (_btVector3) {
    v_assign({ _name:"setAngularUpperLimit", _v_index:this._v_index }, [_btVector3])
  }

 ,setStiffness: function (index, pos) {
    v_assign({ _name:"setStiffness", _v_index:this._v_index }, [index, pos])
  }

 ,enableSpring: function (index, bool) {
    v_assign({ _name:"enableSpring", _v_index:this._v_index }, [index, bool])
  }
};

if (!MMD_SA_options.ammo_version) {
  btGeneric6DofSpringConstraint.prototype.setParam = function (num0, num1, num2) {
    v_assign({ _name:"setParam", _v_index:this._v_index }, [num0, num1, num2])
  };
}

return btGeneric6DofSpringConstraint;
    })()

//btStaticPlaneShape
   ,btStaticPlaneShape: (function () {
var btStaticPlaneShape = function (_btVector3, num) {
  v_assign(this, [_btVector3, num])
};

btStaticPlaneShape.prototype = {
  constructor: btStaticPlaneShape
 ,_name: "btStaticPlaneShape"
 ,_new_object: true
};

Object.assign(btStaticPlaneShape.prototype, btShape_prototype);

return btStaticPlaneShape;
    })()

  };

})();

MMD_SA.ammo_proxy = Ammo._proxy;
MMD_SA.ammo_proxy.init();
