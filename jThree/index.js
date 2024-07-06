// (2024-05-08)

MMD_SA.fn = {
/*
+1 for the "dummy" place reserved for external motion
+1 for "motion_blending_model0"
*/
	length: 1+1,

	load_length_extra: MMD_SA_options.load_length_extra||0,

    _ready_for_model_creation: [],
    _model_creation_timerID: [],

	setupUI: function(para) {
this.length++;

var load_length = MMD_SA_options.motion.length + (MMD_SA_options.x_object.length + MMD_SA.GOML_head_list.length) +1 + this.load_length_extra;
//console.log(MMD_SA_options.motion.length,MMD_SA_options.x_object.length +1,this.load_length_extra)
// extra model
load_length += MMD_SA_options.model_path_extra.length

// FBX motions need to wait until model load
if (!this._ready_for_model_creation[0])
  load_length -= MMD_SA_options.motion.filter(m=>/\.fbx$/i.test(m.path)).length;

if (this.length < load_length) {
  DEBUG_show('(' + parseInt(this.length/load_length*100) + '% loaded)')
}
else if (this.length == load_length) {
  this._ready_for_model_creation[0] = true
  DEBUG_show('(100% loaded, processing model...)')
}
else if (this.length == load_length +1) {
//  DEBUG_show('(100% loaded, processing model and first motion...)')
}
else if (this.length <  load_length +2 +MMD_SA_options.model_path_extra.length*2) {
  var idx = parseInt((this.length - (load_length +2))/2) +1
  this._ready_for_model_creation[idx] = true
  DEBUG_show('(100% loaded, processing extra model (#' + (idx) + ')...)')
}
else if (this.length == load_length +2 +MMD_SA_options.model_path_extra.length*2) {
// delay to avoid a random crash on Electron
  setTimeout(function () { MMD_SA.fn.init() }, 200)
  DEBUG_show("(MMD starting...)",2)
}
else {
  if (this.length > load_length +2) {
    DEBUG_show("loading error(?)",0,1)
    console.log("loading error(?)", this.length+'/'+load_length)
  }
}
//if (para) console.log(para)
//console.log(999, this.length+'/'+load_length)
    }

   ,x_object_init: (function () {
      function _x_object_show(forced) {
if (!MMD_SA._x_object_displayed_once)
  return
if (!this.visible || forced) {
  this.visible = true
//  var obj = this._obj
//  obj.scale.x = obj.scale.y = obj.scale.z = this.scale
  if (!/^\#mikuPmx/.test(this.id)) {
    MMD_SA.THREEX.mesh_obj.get(this.id).show()
    return true
  }
}
      }

      function _x_object_hide(forced) {
if (!MMD_SA._x_object_displayed_once)
  return
if (this.visible || forced) {
  this.visible = false
//  var obj = this._obj
//  obj.scale.x = obj.scale.y = obj.scale.z = 0
  if (!/^\#mikuPmx/.test(this.id)) {
    MMD_SA.THREEX.mesh_obj.get(this.id).hide()
    return true
  }
}
      }

      return function () {
  MMD_SA_options.x_object.forEach(function (x_object, idx) {
MMD_SA_options.x_object_by_name[x_object.path.replace(/^.+[\/\\]/, "").replace(/\.x$/i, "")] = x_object
x_object.id = x_object.id || "#x_object" + idx;
x_object.show = _x_object_show
x_object.hide = _x_object_hide

x_object._obj = MMD_SA.THREEX.mesh_obj.get_three(x_object.id)
// no need to update shadow here for .x objects
/*
var mesh = x_object._obj.children[0]
if (x_object.castShadow) {
  mesh.castShadow = true
}
if (x_object.receiveShadow) {
  mesh.receiveShadow = true
}
*/
if (x_object.boundingBox_list != null) {
  const bb_host = MMD_SA.get_bounding_host(x_object._obj);
  bb_host.boundingBox_list = []
  x_object.boundingBox_list.forEach(function (bb) {
    if (bb == null) {
      bb_host.boundingBox_list.push(bb_host.boundingBox)
    }
    else {
      var b3 = new THREE.Box3().set(bb.min, bb.max)
      b3.oncollide = bb.oncollide
      b3.onaway = bb.onaway
      bb_host.boundingBox_list.push(b3)
    }
  });

// mainly to allow low-angle camera for mesh that needs collision enforced, to make sure that camera is within bounding box
  if (x_object.bb_adjust) {
    bb_host.boundingBox_list.forEach(function (bb) {
      if (x_object.bb_adjust.min)
        bb.min.add(x_object.bb_adjust.min)
    });
  }
}

if (x_object.scale == null)
  x_object.scale = (x_object._obj.scale.x == 0) ? 0 : 1
x_object.visible = (x_object.hidden_on_start) ? false : (x_object._obj.scale.x > 0)
  })

  MMD_SA_options.mesh_obj.forEach(function (x_object, idx) {
//console.log(x_object)
MMD_SA_options.mesh_obj_by_id[x_object.id] = MMD_SA_options.mesh_obj_by_id["#"+x_object.id] = x_object
x_object.id = "#" + x_object.id
x_object.show = _x_object_show
x_object.hide = _x_object_hide

if (/^\#mikuPmx(\d+)$/.test(x_object.id)) {
  x_object._obj = THREE.MMD.getModels()[parseInt(RegExp.$1)].mesh
  Object.defineProperty(x_object, "visible", {
    get: function () {
return this._obj.visible
    }
   ,set: function (v) {
this._obj.visible = v
    }
  });

  if (x_object.scale == null)
    x_object.scale = 1
  x_object.visible = true
}
else {
  if (!x_object._obj)
    x_object._obj = MMD_SA.THREEX.mesh_obj.get_three(x_object.id)

  var mesh = (x_object._obj.children.length) ? x_object._obj.children[0] : x_object._obj
  if (x_object.castShadow) {
    mesh.castShadow = true
  }
  if (x_object.receiveShadow) {
    mesh.receiveShadow = true
  }

  if (x_object.scale == null)
    x_object.scale = (x_object._obj.scale.x == 0) ? 0 : 1
  x_object.visible = (x_object.hidden_on_start) ? false : (x_object._obj.scale.x > 0)
}
  })

  MMD_SA_options.mesh_obj_all = MMD_SA_options.x_object.concat(MMD_SA_options.mesh_obj)
    }
    })()

   ,init: function () {
// main START
var $ = jThree;

this.x_object_init()

var fn = this
var model = THREE.MMD.getModels()[0]

var _material_list = []
model.pmx.materials.forEach(function (m) {
  _material_list.push(m.name)
});
MMD_SA._material_list = _material_list

var _model_list = [{ path:MMD_SA_options.model_path_default }]
for (var model_name in MMD_SA_options.MME_saved) {
  var model_obj = MMD_SA_options.MME_saved[model_name]
  if (model_obj.path_full)
    _model_list.push({ path:toLocalPath(model_obj.path_full) })
}
_model_list.forEach(function (obj) {
  var model_path = obj.path
  if (!/^(\w+\:|\/)/.test(model_path))
    model_path = System.Gadget.path + toLocalPath("\\" + model_path)
  obj.in_use = (model_path == MMD_SA_options.model_path) || (MMD_SA_options.model_path_extra.indexOf(model_path) != -1)
});
//DEBUG_show(_model_list+'/'+_model_list.length,0,1)
MMD_SA._model_list = _model_list

//  var RE = [/^(\u5DE6|\u53F3)(\u80A9|\u8155|\u3072\u3058|\u624B\u9996|\u624B\u6369|.\u6307.)/] //cover undies
//[/^(\u5DE6)(\u80A9|\u8155|\u3072\u3058|\u624B\u9996|\u624B\u6369|.\u6307.)/] //meter motion
THREE.MMD.getModels().forEach(function (_model) {
// index 0 reserved for "motion_blending" custom action
  _model.skin_MMD_SA_extra = [MMD_SA.Animation_dummy]
  _model.morph_MMD_SA_extra = [MMD_SA.Animation_dummy]
});

MMD_SA.MMD = {
  MotionManager: function () {
    this._model_index = 0
  }

 ,setFrameNumber: function () {}

 ,play: function () { jThree.MMD.play() }
 ,pause: function () { jThree.MMD.pause() }
}

Object.defineProperty(MMD_SA.MMD.MotionManager.prototype, "lastFrame",
{
  get: function () {
var obj = THREE.MMD.getModels()[this._model_index]._MMD_SA_cache[this.para_SA._path]
//DEBUG_show(MMD_SA_options.motion[this._index].path,0,1)
return obj.skin.duration * 30
  }
});

Object.defineProperty(MMD_SA.MMD.MotionManager.prototype, "_timeMax",
{
  get: function () {
var obj = THREE.MMD.getModels()[this._model_index]._MMD_SA_cache[this.para_SA._path]
//DEBUG_show(MMD_SA_options.motion[this._index].path,0,1)
return obj.skin._timeMax
  }
});

// mainly for cases of multi-model motions
Object.defineProperty(MMD_SA.MMD.MotionManager.prototype, "lastFrame_",
{
  get: function () {
if (this._lastFrame_ != null)
  return this._lastFrame_

var m0 = MMD_SA.MMD.motionManager
return ((m0.para_SA.multi_model_motion_list && (m0.para_SA.multi_model_motion_list.indexOf(this.filename) != -1)) ? m0._lastFrame_ : this.lastFrame)
  }

 ,set: function (v) {
this._lastFrame_ = v
  }
});
Object.defineProperty(MMD_SA.MMD.MotionManager.prototype, "firstFrame_",
{
  get: function () {
if (this._firstFrame_ != null)
  return this._firstFrame_

var m0 = MMD_SA.MMD.motionManager
return ((m0.para_SA.multi_model_motion_list && (m0.para_SA.multi_model_motion_list.indexOf(this.filename) != -1)) ? m0._firstFrame_ : 0)
  }

 ,set: function (v) {
this._firstFrame_ = v
  }
});


MMD_SA.motion = []

var motion_default = (MMD_SA_options.motion_shuffle_list_default && MMD_SA_options.motion_shuffle_list_default[0]) || 0

window.dispatchEvent(new CustomEvent("SA_MMD_before_motion_init"));

for (var i = 0, len = MMD_SA_options.motion.length; i < len; i++) {
  var motion = MMD_SA_options.motion[i]
  if (!motion.path) {
// "dummy" motion reserved for external load / "motion_blending" custom action
    MMD_SA.motion.push(new MMD_SA.MMD.MotionManager())
    continue
  }

  var filename = decodeURIComponent(motion.path.replace(/^.+[\/\\]/, "").replace(/\.([a-z0-9]{1,4})$/i, ""))
  var para_SA = MMD_SA_options.motion_para[filename] || {}

  var vmd = MMD_SA.vmd_by_filename[filename]//(jThree.getReferent) ? jThree.getReferent("#vmd" + i).three(0) : MMD_SA.vmd_by_filename[filename]
  vmd._index = i

  if (motion.is_vmd_component) {
    MMD_SA.motion.push({})
    continue
  }

  if (motion.morph_component_by_filename) {
    vmd._morph_component = MMD_SA.vmd_by_filename[motion.morph_component_by_filename]
    vmd._morph_component.url = vmd.url
  }

  THREE.MMD.getModels().forEach(function (model, idx) {
    var para, obj, skin, morph, model_para

    obj = model._MMD_SA_cache[motion.path]
    // in case of preloaded motion with the model
    if (obj) {
      model._MMD_SA_cache_current = obj

      skin = obj.skin
      morph = obj.morph

      if (skin) {
        skin._model_index  = model._model_index
        skin._motion_index = i
      }
      if (morph) {
        morph._model_index  = model._model_index
        morph._motion_index = i
      }
    }
    else {
      model_para = MMD_SA_options.model_para_obj_all[idx]
      para = motion.jThree_para

      var motion_skipped = false
      if (para_SA.model_name_RegExp || para_SA.model_index_list) {
        if (para_SA.model_name_RegExp)
          motion_skipped = !para_SA.model_name_RegExp.test(model_para._filename)
        if (para_SA.model_index_list && (!para_SA.model_name_RegExp || motion_skipped)) {
          motion_skipped = (para_SA.model_index_list.indexOf(idx) == -1)
          if (motion_skipped && (para_SA.model_index_list.indexOf(0) != -1) && model_para.is_PC_candidate)
            motion_skipped = false
        }
//if (!motion_skipped) DEBUG_show(filename+'/'+idx,0,1)
      }
      else if ((idx > 0) && !model_para.is_PC_candidate && (para || !model_para.mirror_motion_from_first_model)) {
        motion_skipped = true
      }

      if (model_para.motion_name_default == filename) {
        motion_skipped = false
      }

      if (motion_skipped) {
// create a dummy just in case the motion is not used by any model
        if ((idx == MMD_SA_options.model_para_obj_all.length-1) && (!MMD_SA.motion.length || (MMD_SA.motion[MMD_SA.motion.length-1].filename != filename)))
          MMD_SA.motion.push({})
        return
      }

      obj = model.setupMotion_MMD_SA(vmd, motion.match, para)
// new para_SA could have been generated after setupMotion_MMD_SA if it didn't exist beforehand
      para_SA = MMD_SA_options.motion_para[filename] || para_SA;

      skin = obj.skin
      morph = obj.morph
//if (i==1) DEBUG_show(vmd.url+','+!!skin._is_dummy+','+!!morph._is_dummy)

      if (para) {
        skin._is_MMD_SA_custom_animation = morph._is_MMD_SA_custom_animation = (MMD_SA.custom_action_index && (i >= MMD_SA.custom_action_index) && (i < MMD_SA.motion_number_meter_index))

        skin._is_MMD_SA_animation = true
        skin._is_skin = true
        skin._MMD_SA_disabled = true
        skin.freeze_onended = true
        if (model.skin_MMD_SA_extra) {
          skin._motion_index_extra = model.skin_MMD_SA_extra.length
          model.skin_MMD_SA_extra.push(skin)
//if (idx > 0) console.log("TEST", idx + ":" + model.skin_MMD_SA_extra.length)
        }

        morph._is_MMD_SA_animation = true
        morph._is_morph = true
        morph._MMD_SA_disabled = true
        morph.freeze_onended = true
        if (model.morph_MMD_SA_extra) {
          morph._motion_index_extra = model.morph_MMD_SA_extra.length
          model.morph_MMD_SA_extra.push(morph)
        }

        skin._MMD_SA_animation_check = morph._MMD_SA_animation_check = para.animation_check
      }
    }

    if (!para || skin._is_MMD_SA_custom_animation) {
      model._MMD_SA_cache[motion.path] = obj
      if (!MMD_SA.motion.length || (MMD_SA.motion[MMD_SA.motion.length-1].filename != filename)) {
        var mm = new MMD_SA.MMD.MotionManager()
        mm.filename = filename
        mm.para_SA = para_SA
        mm.para_SA._path = motion.path
        mm._index = mm.para_SA._index = MMD_SA.motion.length
        mm._model_index = idx
        MMD_SA.motion.push(mm)
      }
    }

    if (!model.skin || (i == motion_default) || (model_para.motion_name_default == filename)) {
//console.log(idx)
      if (!model_para.motion_name_default) {
        if (idx == 0) {
          if (i == motion_default)
            model_para.motion_name_default = filename
        }
        else if ((idx > 0) && !model_para.mirror_motion_from_first_model)
          model_para.motion_name_default = filename
      }
      model._MMD_SA_cache_current = obj
      model.skin  = skin
      model.morph = morph
      THREE.MMD.adjustMotionDuration()
    }
  });
}

MMD_SA.motion_max_default = MMD_SA_options.motion.length;

MMD_SA.MMD.motionManager = MMD_SA.motion[0]
//console.log(MMD_SA_options.motion);console.log(MMD_SA.motion);

// speech bubble
if (MMD_SA_options.use_speech_bubble) {
  MMD_SA.SpeechBubble.onload()
//setInterval(function(){jThree( "#SpeechBubbleMESH" ).three( 0 ).position.y-=1;}, 1000)
}

//var _v3 = new THREE.Vector3().setEulerFromQuaternion(new THREE.Quaternion().setFromEuler(new THREE.Vector3(-25*Math.PI/180,-50*Math.PI/180,75*Math.PI/180)))
//DEBUG_show([_v3.x*180/Math.PI, _v3.y*180/Math.PI, _v3.z*180/Math.PI],0,1)

//setInterval(function () { jThree.MMD.groundLevel += 0.1 }, 100)
// END


//MMD_SA.physicsHelper = new THREE.MMDPhysicsHelper( THREE.MMD.getModels()[0].mesh ); MMD_SA.scene.add( MMD_SA.physicsHelper );


MMD_SA._tray_updatable = true
System._browser.update_tray()

setTimeout(function () {
  MMD_SA.MMD_started = true
//console.log(THREE.MMD.getModels()[0])
  resize();
  $.MMD.cameraMotion = true;

  MMD_SA._head_pos = new THREE.Vector3(0,15,0)

  MMD_SA_options.model_para_obj.onMotionChange && MMD_SA_options.model_para_obj.onMotionChange();


var simulateCallback = (()=>{
  const rot_filter = {};
  const rot_filter_para = { minCutOff:1, beta:1, dCutOff:1 };

  const bone_ext_filter = {};
  const bone_ext_filter_para = { minCutOff:0.25, beta:0.1, dCutOff:0.25 };

return function () {
// AT: process x_object with parent_bone
  var that = this
  var mesh = this.mesh

  var accessory_list = (MMD_SA_options.Dungeon && MMD_SA_options.Dungeon.accessory_list) || MMD_SA_options.mesh_obj_all
  accessory_list.forEach(function (x_object) {
var p_bone = x_object.parent_bone
if (!p_bone)
  return

var model_index = p_bone.model_index || 0
if (that._model_index != model_index)
  return

const obj = x_object._obj;

if (MMD_SA_options.Dungeon) {
  if (!mesh.visible || p_bone.disabled) {
    if (!mesh.visible) {
      if (!p_bone.disabled)
        p_bone._avatar_hidden_ = true;

      x_object._obj_proxy.hidden = true;
      x_object._obj_proxy.visible = false;
    }
    else {
// Unhide object if avatar was previously hidden when the object was active. Otherwise, keep the current display status.
      if (p_bone._avatar_hidden_) {
        x_object._obj_proxy.hidden = false;
        x_object._obj_proxy.visible = true;
      }

      if (x_object.placement?.position) {
        if (!p_bone._detached_) p_bone._detached_ = { pos:new THREE.Vector3(), rot: new THREE.Quaternion() };

        if (p_bone.attached) {
          p_bone.attached = false;
          obj.matrixAutoUpdate = true;

          x_object._obj_proxy.hidden = false;
          x_object._obj_proxy.visible = true;

          obj.position.copy(p_bone._detached_.pos);
          obj.quaternion.copy(p_bone._detached_.rot);
        }
        else {
          p_bone._detached_.pos.copy(obj.position);
          p_bone._detached_.rot.copy(obj.quaternion);
        }
      }

      p_bone._avatar_hidden_ = false;
    }
    return;
  }

  x_object._obj_proxy.hidden = false;
  x_object._obj_proxy.visible = true;
}

if (p_bone.condition && !p_bone.condition(x_object, model_index))
  return

var para_SA = MMD_SA.motion[that.skin._motion_index].para_SA
var x_para
x_para = para_SA.adjustment_per_model && (para_SA.adjustment_per_model[MMD_SA_options.model_para_obj._filename] || para_SA.adjustment_per_model[MMD_SA_options.model_para_obj._filename_cleaned])
x_para = x_para && x_para.accessory_default && x_para.accessory_default[x_object.path.replace(/^.+[\/\\]/, "")]
if (x_para)
  p_bone = x_para.parent_bone

var is_root = p_bone.name == 'ROOT';

var bone;
if (!is_root) {
  bone = mesh.bones_by_name[p_bone.name];
  if (!bone)
    return;
}

p_bone.attached = true;

var pos, rot;
var model_mesh, modelX;
modelX = MMD_SA.THREEX.get_model(model_index);
if (is_root) {
  model_mesh = MMD_SA.THREEX._THREE.MMD.getModels()[model_index].mesh;
  rot = MMD_SA._q2.copy(model_mesh.bones_by_name['全ての親'].quaternion);
}

if (MMD_SA.THREEX.enabled) {
  if (is_root) {
    const hips = modelX.getBoneNode('hips');
    pos = MMD_SA.THREEX.v1.copy(hips.position);//.setX(0).setZ(0);
    if (!p_bone.hips_as_root) {
      pos.y = 0;
    }
    pos = modelX.process_position(pos).multiplyScalar(MMD_SA.THREEX.VRM.vrm_scale);
  }
  else {
    const boneX = modelX.get_bone_by_MMD_name(p_bone.name);
    if (!boneX) return;
//console.log(boneX)

    pos = MMD_SA.THREEX.v1;
    rot = MMD_SA.THREEX.q1;
    boneX.matrixWorld.decompose(MMD_SA.THREEX.v1, MMD_SA.THREEX.q1, MMD_SA.THREEX.v2);

// to local
    const mesh_rot_inv = MMD_SA.THREEX.q2.copy(modelX.mesh.quaternion).conjugate();
    pos.sub(modelX.mesh.position).applyQuaternion(mesh_rot_inv);
    rot.premultiply(mesh_rot_inv);

    if ((modelX.type == 'VRM') && !modelX.is_VRM1) {
      rot.premultiply(MMD_SA.THREEX.q2.set(0,1,0,0));
      rot.x *= -1;
      rot.z *= -1;
    }
//console.log(MMD_SA.THREEX.e1.setFromQuaternion(rot, 'ZYX').multiplyScalar(180/Math.PI).toArray(), MMD_SA.THREEX.e2.setFromQuaternion(boneX.quaternion, 'ZYX').multiplyScalar(180/Math.PI).toArray(), new THREE.Vector3().setFromQuaternion(bone.skinMatrix.decompose()[1], 'ZYX').multiplyScalar(180/Math.PI).toArray())
  }
}
else {
  obj.useQuaternion = true

  if (is_root) {
    bone = mesh.bones_by_name['センター'];
  }
// This is after updateMatrixWorld. The skinMatrix should be the latest.
  bone_objs = bone.skinMatrix.decompose();
  pos = bone_objs[0];

  if (is_root) {
    if (p_bone.hips_as_root) {
      pos.y = MMD_SA.TEMP_v3.setFromMatrixPosition(mesh.bones_by_name['下半身'].skinMatrix).y;
    }
    else {
      pos.y = 0;
    }
  }

  if (!rot)
    rot = bone_objs[1];
/*
  pos = MMD_SA.get_bone_position(mesh, p_bone.name, mesh)
  rot = MMD_SA.get_bone_rotation(mesh, p_bone.name, mesh)
//DEBUG_show(pos.toArray()+'\n'+new THREE.Vector3().setEulerFromQuaternion(rot).toArray())
*/
}

obj.position.copy(pos);
if (p_bone.position) {
  const obj_pos_offset = MMD_SA.TEMP_v3.set(p_bone.position.x, p_bone.position.y, -p_bone.position.z);
  if (p_bone.position.scale_base)
    obj_pos_offset.multiply(obj.scale).multiplyScalar(1/p_bone.position.scale_base);
  if (is_root && System._browser.camera.poseNet.enabled && System._browser.camera.poseNet.frames.skin['センター']?.[0]._hip_adjustment_offset) {
    obj_pos_offset.sub(MMD_SA._v3a.copy(System._browser.camera.poseNet.frames.skin['センター'][0]._hip_adjustment_offset).setY(0));
  }
  obj_pos_offset.applyQuaternion(rot);
  obj.position.add(obj_pos_offset);
}

obj.quaternion.copy(rot);
let obj_rot;
if (p_bone.rotation) {
  if (p_bone.rotation.fixed) {
    obj.quaternion.set(0,0,0,1);
    obj_rot = MMD_SA._q1.setFromEuler(MMD_SA.TEMP_v3.set(-p_bone.rotation.fixed.x, -p_bone.rotation.fixed.y, p_bone.rotation.fixed.z).multiplyScalar(Math.PI/180), 'YXZ');
  }
  else {
    obj_rot = MMD_SA._q1.setFromEuler(MMD_SA.TEMP_v3.set(-p_bone.rotation.x, -p_bone.rotation.y, p_bone.rotation.z).multiplyScalar(Math.PI/180), 'YXZ');
  }
  obj.quaternion.multiply(obj_rot);
}

var m4_objs = MMD_SA.TEMP_m4.makeFromPositionQuaternionScale( obj.position, obj.quaternion, obj.scale ).multiplyMatrices(mesh.matrixWorld, MMD_SA.TEMP_m4).decompose()
obj.position.copy(m4_objs[0])
obj.quaternion.copy(m4_objs[1])

if (p_bone.rotation) {
  let transfer_to_parent_bone;
  const rot_adjust = p_bone.rotation.align_with_external_point;
  if (rot_adjust)
    x_object.user_data._rot_default_ = (x_object.user_data._rot_default_ || new THREE.Quaternion()).copy(obj.quaternion);
  if (rot_adjust && (!rot_adjust.mocap_only || (System._browser.camera.poseNet.enabled && System._browser.camera.ML_warmed_up))) {
    const rot_original = MMD_SA._q2.copy(obj.quaternion);

    transfer_to_parent_bone = rot_adjust.transfer_to_parent_bone && (System._browser.camera.poseNet.enabled && System._browser.camera.ML_warmed_up);

    if (transfer_to_parent_bone) {
      const aa = obj_rot.toAxisAngle();
      obj.quaternion.setFromAxisAngle(aa[0].applyQuaternion(MMD_SA.TEMP_q.copy(MMD_SA_options.model_para_obj.rot_hand_adjust_base[(p_bone.name.charAt(0)=="左")?1:-1]).conjugate() ), -aa[1]);
    }
    else if (rot_adjust.reset_rotation) {
      if (rot_adjust.reset_rotation === true) {
        obj.quaternion.set(0,0,0,1);
      }
      else {
        obj.quaternion.copy(modelX.get_bone_rotation_by_MMD_name(rot_adjust.reset_rotation.name));
      }
    }

    let reference_origin = MMD_SA._v3b_.set(0,0,0);
    let axis_origin = MMD_SA._v3a_.copy(obj.position);
    if (rot_adjust.reference_origin) {
      if (rot_adjust.reference_origin == 'parent_bone') {
//        reference_origin.set(p_bone.position.x, p_bone.position.y, -p_bone.position.z).multiply(MMD_SA.TEMP_v3.set(1/x_object._mesh.scale.x, 1/x_object._mesh.scale.y, 1/x_object._mesh.scale.z)).applyQuaternion(obj_rot)//.negate();
        axis_origin = modelX.get_bone_position_by_MMD_name(p_bone.name);
      }
      else {
        const a = MMD_SA._v3a.copy(rot_adjust.reference_origin);
        const m = MMD_SA._v3b.copy(rot_adjust.reference_point);
        m.sub(a);

        const t = (0 - (a.x*m.x + a.y*m.y + a.z*m.z)) / m.lengthSq();
        reference_origin.set(a.x + m.x*t, a.y + m.y*t, a.z + m.z*t);
//System._browser.camera.DEBUG_show(reference_origin.toArray().join('\n'))
        axis_origin.copy(reference_origin).multiply(x_object._mesh.scale).applyQuaternion(obj.quaternion).add(obj.position);
      }
    }

    let axis_ext, bone_rot, d;
    if (rot_adjust.external_point.type == 'bone') {
      d = (rot_adjust.external_point.name.indexOf('left') != -1) ? '左' : ((rot_adjust.external_point.name.indexOf('right') != -1) ? '右' : '');
      let bone_pos;
      let bone_ext;
      if (rot_adjust.external_point.name.indexOf('hand') != -1) {
        if ((rot_adjust.mocap_only === false) || (System._browser.camera.poseNet.enabled && (!MMD_SA.MMD.motionManager.para_SA.motion_tracking_upper_body_only || !System._browser.camera.poseNet.frames.get_blend_default_motion('skin', d+'腕ＩＫ')))) {
          bone_pos = modelX.get_bone_position_by_MMD_name(d+'手首');
          bone_ext = MMD_SA.TEMP_v3.set(0,0,0);//((d=='左')?1:-1)*0.5, 0, 0);
          if (rot_adjust.external_point.offset)
            bone_ext.add(rot_adjust.external_point.offset);
          bone_rot = modelX.get_bone_rotation_by_MMD_name(d+'手首');
          bone_ext.applyQuaternion(MMD_SA_options.model_para_obj.rot_arm_adjust[d+'腕'].axis_rot).applyQuaternion(bone_rot);
        }
      }
      else if (rot_adjust.external_point.name.indexOf('arm') != -1) {
        bone_pos = modelX.get_bone_position_by_MMD_name(d+'腕');
        bone_ext = MMD_SA.TEMP_v3.set(0,0,0);
        if (rot_adjust.external_point.offset)
          bone_ext.add(rot_adjust.external_point.offset);
        bone_rot = modelX.get_bone_rotation_by_MMD_name((!rot_adjust.external_point.offset?.ignore_local_rotation) ? d+'腕' : '上半身2');
        bone_ext.applyQuaternion(bone_rot);
      }
      else if (rot_adjust.external_point.name == 'head') {
        bone_pos = modelX.get_bone_position_by_MMD_name('頭');
        bone_ext = MMD_SA.TEMP_v3.set(0,0,0);
        if (rot_adjust.external_point.offset)
          bone_ext.add(rot_adjust.external_point.offset);
        bone_rot = modelX.get_bone_rotation_by_MMD_name('頭')
        bone_ext.applyQuaternion(bone_rot);
      }

      if (bone_pos) {
        if (bone_ext) {
          if (rot_adjust.external_point.use_filter) {
            let _bone_ext_filter = bone_ext_filter[rot_adjust.external_point.name];
            if (!_bone_ext_filter)
              _bone_ext_filter = bone_ext_filter[rot_adjust.external_point.name] = new System._browser.data_filter([{ type:'one_euro', id:rot_adjust.external_point.name+'_bone_ext', para:[30, 1,1,1, 3] }]);
            Object.assign(_bone_ext_filter.filters[0].filter, bone_ext_filter_para);
            bone_ext.fromArray(_bone_ext_filter.filter(bone_ext.toArray()));
          }
          bone_pos.add(bone_ext);
        }
        axis_ext = bone_pos;
      }
    }
    else if (rot_adjust.external_point.type == 'object3D') {
      const object3d = MMD_SA.THREEX._XR_Animator_scene_?.object3D_list.find(obj=>obj.id==rot_adjust.external_point.name);
      if (object3d) {
        const _x_object = MMD_SA.THREEX._object3d_list_.find(obj=>obj.uuid==object3d._object3d_uuid);
        axis_ext = MMD_SA._v3b.copy(rot_adjust.external_point.reference_point).multiply(_x_object._mesh.scale).applyQuaternion(_x_object._mesh.quaternion).add(_x_object._mesh.position);
      }
    }

    if (axis_ext) {
      let weight = 1;
      if (rot_adjust.weight_by_distance) {
        const v_ref = MMD_SA._v3a.copy(rot_adjust.reference_point).multiply(x_object._mesh.scale).applyQuaternion(rot_original).add(obj.position).sub(axis_ext);
        let v_ext = MMD_SA.THREEX.v3.copy(rot_adjust.external_point.normal||{x:0,y:0,z:1});
        if (bone_rot)
          v_ext.applyQuaternion(bone_rot);

        let dis = v_ref.length();

        let power = 1 - (rot_adjust.weight_by_distance.power||0);
        let v_dot = v_ref.normalize().dot(v_ext);
        if (v_dot < 0) {
          power *= 1 - Math.min(-v_dot*2, 1);
        }

        let dis_ratio = 1 - dis/rot_adjust.weight_by_distance.radius;
        if (power) {
          weight = (dis_ratio < 0) ? 0 : Math.pow(dis_ratio, power);
        }

        axis_ext.sub(axis_origin);
        if (transfer_to_parent_bone) {
          let v_dot2 = MMD_SA.TEMP_v3.copy(axis_ext).normalize().dot(v_ext);
          let dis2 = axis_ext.length();
//System._browser.camera.DEBUG_show(axis_ext.clone().normalize().toArray().join('\n'));
/*
          let ratio = 0;
          if ((dis2 < 1) || (v_dot2 > 0)) {
            ratio = (v_dot2 > 0) ? 1 : 1-dis/1;
            let axis_length = axis_ext.length();
            axis_ext.lerp(axis_ext.clone().add(axis_origin).sub(modelX.get_bone_position_by_MMD_name(d+'手首')), ratio).normalize().multiplyScalar(axis_length);
          }
*/
//System._browser.camera.DEBUG_show('dis2:'+dis2+'\n'+'dot2:'+v_dot2);
        }

//System._browser.camera.DEBUG_show('dis:'+dis+'\n'+'dot:'+v_dot+'\n'+'weight:'+weight);
      }
      else {
        axis_ext.sub(axis_origin);
      }

      let axis_ref = MMD_SA._v3a.copy(rot_adjust.reference_point).sub(reference_origin);
      axis_ref.normalize().applyQuaternion(obj.quaternion);
      axis_ref.multiplyScalar(axis_ext.length()).add(axis_origin).sub(obj.position);

      axis_ext = axis_ext.add(axis_origin).sub(obj.position);
//System._browser.camera.DEBUG_show('axis_ext.length:'+axis_ext.length());
      axis_ref.normalize();
      axis_ext.normalize();
      const obj_rot_aligned = MMD_SA.TEMP_q.setFromUnitVectors(axis_ref, axis_ext);
//      obj_rot_aligned.setFromEuler(MMD_SA.TEMP_v3.setEulerFromQuaternion(obj_rot_aligned, 'YZX').setX(0), 'YZX');

//      const rot_base = MMD_SA._q1.copy(obj.quaternion);
      obj.quaternion.premultiply(obj_rot_aligned);

      if (transfer_to_parent_bone) {
//        obj.quaternion.copy(obj_rot_aligned.multiply(rot_base));
        x_object._rot_aligned_ = obj_rot_aligned.clone();
        x_object._rot_aligned_weight_ = weight;
        obj.quaternion.copy(rot_original);

      }
    }
  }

  const data_filter = p_bone.rotation.data_filter;
  if (data_filter) {
    if (!x_object.uuid)
      x_object.uuid = THREE.Math.generateUUID();
    let _rot_filter = rot_filter[x_object.uuid];
    if (!_rot_filter)
      _rot_filter = rot_filter[x_object.uuid] = new System._browser.data_filter([{ type:'one_euro', id:x_object.uuid+'_rot', para:[30, 1,1,1, 4] }]);
    Object.assign(_rot_filter.filters[0].filter, rot_filter_para, data_filter);

    if (transfer_to_parent_bone && x_object._rot_aligned_) {
      x_object._rot_aligned_.fromArray(_rot_filter.filter(x_object._rot_aligned_.toArray()));
    }
    else {
      obj.quaternion.fromArray(_rot_filter.filter(obj.quaternion.toArray()));
    }
  }
}

//DEBUG_show(obj.position.toArray())
// Object3D_Proxy has no updateMatrix function
if (obj.updateMatrix) {
  obj.matrixAutoUpdate = false;
  obj.updateMatrix();
}
  });
};

})();

THREE.MMD.getModels().forEach(function (_model, idx) {
  _model.simulateCallback = simulateCallback
});


  var PPE = MMD_SA_options.MME.PostProcessingEffects
  MMD_SA_options._PPE_enabled = PPE.enabled
  if (MMD_SA_options.PPE_disabled_on_idle) {
    if (MMD_SA_options._PPE_enabled) {
      PPE.enabled = false
//      System._browser.update_tray()
    }
  }

// a trick to "warm up" fadeout on startup
  MMD_SA.fadeout_opacity = 0.95
  MMD_SA.fadeout_canvas.width  = SL.width
  MMD_SA.fadeout_canvas.height = SL.height
  var context = MMD_SA.fadeout_canvas.getContext("2d")
  context.globalCompositeOperation = 'copy'
  context.globalAlpha = 0.01
  context.fillRect(0,0,SL.width,SL.height)
  context.globalAlpha = 1

  MMD_SA_options.model_para_obj_all.forEach(function (model_para, idx) {
    var mesh = THREE.MMD.getModels()[idx].mesh
// reset temp positioning if necessary
    if (model_para.position_loading || model_para.bone_connection || mesh.bones_by_name["全ての親"])
      mesh.position.set(0,0,0)
    if (model_para.scale)
      mesh.scale.set(model_para.scale,model_para.scale,model_para.scale)
  });

  THREE.MMD.getModels().forEach((function () {
    function matrixWorld_physics(mesh) {
this.mesh = mesh

this.m4 = new THREE.Matrix4()
this.pos = new THREE.Vector3()
this.pos_world = new THREE.Vector3()

this.reset()
    }

    matrixWorld_physics.prototype.reset = function () {
this.pos.set(0,0,0)
this.pos_world.set(0,0,0)
    }

    matrixWorld_physics.prototype.update = function () {
this.m4.copy(this.mesh.matrixWorld)

_v3a.getPositionFromMatrix(this.m4)
_v3b.copy(_v3a).sub(this.pos_world)
_v3b.multiplyScalar(MMD_SA_options.matrixWorld_physics_scale)

this.pos.add(_v3b)
this.pos_world.copy(_v3a)
//if (this.mesh._model_index==0) DEBUG_show(this.pos_world.toArray().join("\n")+"\n"+this.pos.toArray().join("\n"))

// a trick to prevent physics of different models from affecting each other
_v3b.y += this.mesh._model_index * 25
this.m4.setPosition(_v3b)
    }

    var _v3a = new THREE.Vector3()
    var _v3b = new THREE.Vector3()

    return function (_model) {
let mesh = _model.mesh
mesh.matrixWorld_physics = new matrixWorld_physics(mesh)
    };
  })());

  MMD_SA_options.onstart && MMD_SA_options.onstart();
  window.dispatchEvent(new CustomEvent("MMDStarted"));
//console.log(THREE.MMD.getModels()[0])
  MMD_SA.toggle_shadowMap()
//setTimeout(function () {MMD_SA_options.shadow_darkness=0.5;MMD_SA.toggle_shadowMap(true);DEBUG_show(999,0,1);}, 5000)

  $.MMD.play(true);
  DEBUG_show("(MMD started)",2);

  if (MMD_SA.use_webgl2)
    DEBUG_show("Use WebGL2", 2)
  if (MMD_SA.use_MSAA_FBO)
    DEBUG_show("Use MSAA FBO", 2)
//webkit_electron_remote.getGlobal("FB_login")();
}, 0)

if (jThree.Trackball) jThree.trackball = jThree.Trackball;
$.trackball();
if (!returnBoolean("MMDTrackballCamera"))
  MMD_SA._trackball_camera.stop()

MMD_SA_options.edgeScale = (MMD_SA_options.model_para_obj.edgeScale >= 0) ? MMD_SA_options.model_para_obj.edgeScale : ((MMD_SA_options.edgeScale >= 0) ? MMD_SA_options.edgeScale : 1);
$.MMD.edgeScale = parseFloat(System.Gadget.Settings.readString("MMDEdgeScale") || Settings_default.MMDEdgeScale) * MMD_SA_options.edgeScale;

/*
		( function() {
			$( "mesh:first" ).animate( { rotateY: "-=3.14" }, 30000, "linear", arguments.callee );
		} )();
*/

jQuery( "canvas" ).on( "mousedown mousewheel DOMMouseScroll", function() {
	$.MMD.cameraMotion = false;
}).dblclick( function() {
	$.MMD.cameraMotion = true;
});

/*
		var audio = document.getElementById('audio'),
			delay = $( ".delay" ),
			input = jQuery( "input" ),
			info = jQuery("#info"),
			camera = $( "camera" );


		audio.volume = 0.5;
//		jQuery("#loading").hide();
		jQuery("#button").show();
		jQuery("button").show();
		info.show();

		jQuery( audio ).one( "play", function() {
			$.MMD.cameraMotion = true;
		})
		.on( "ended", function() {
			jThree.MMD.pause();
			jQuery( "#partner" ).show();
			setTimeout( function() {
				camera.lookAtY( 15 );
			},0);
		} )
		.on( "play", function() {
			jQuery( "#partner" ).hide();
			$.MMD.play(true);
		} )
		.on( "pause", $.MMD.pause )
		.on( "timeupdate", function() {
//			$.MMD.seek( audio.currentTime );
		});
*/
	}

};


// Root
(function () {

MMD_SA.TEMP_q = new THREE.Quaternion()
MMD_SA._q1 = new THREE.Quaternion()
MMD_SA._q2 = new THREE.Quaternion()

MMD_SA.TEMP_v3 = new THREE.Vector3()
MMD_SA._v3a = new THREE.Vector3()
MMD_SA._v3b = new THREE.Vector3()

MMD_SA.TEMP_m4 = new THREE.Matrix4()
MMD_SA._m4a = new THREE.Matrix4()
MMD_SA._m4b = new THREE.Matrix4()

MMD_SA.TEMP_b3 = new THREE.Box3()

// only for internal functions
MMD_SA._v3a_ = new THREE.Vector3()
MMD_SA._v3b_ = new THREE.Vector3()

MMD_SA.process_bone = function (bone, rotation, mod) {
  const euler_order = MMD_SA.MMD.motionManager.para_SA.look_at_screen_euler_order || 'XYZ';//'YXZ';//'ZXY';//
  const bone_rotation = MMD_SA._v3a_.setEulerFromQuaternion(bone.quaternion, euler_order)//.clone.normalize())
  if (mod) {
    bone_rotation.x *= mod[0]
    bone_rotation.y *= mod[1]
    bone_rotation.z *= mod[2]
  }

  if (rotation instanceof THREE.Quaternion)
    rotation = MMD_SA._v3b_.setEulerFromQuaternion(rotation, euler_order)

  bone_rotation.add(rotation)
  bone.quaternion.setFromEuler(bone_rotation, euler_order)
}

MMD_SA.copy_first_bone_frame = function (index, skin, match) {
  if (!match)
    match = MMD_SA_options.motion[index].match
  var RE = (match && match.skin_jThree) ? match.skin_jThree : null

  if (!skin._is_skin)
    skin = THREE.MMD.getModels()[0].skin_MMD_SA_extra[skin._motion_index_extra]

  var mesh = skin.mesh
  skin.targets.forEach( function(v) {
    var k0 = v.keys[0]
    if (!k0 || (RE && !RE.test(k0.name)) || k0.time) {
      return
    }

    var bone = mesh.bones_by_name[k0.name]
	var gbone = mesh.geometry.bones[bone._index]
    k0.pos[0] = bone.position.x - gbone.pos[0]
    k0.pos[1] = bone.position.y - gbone.pos[1]
    k0.pos[2] = bone.position.z - gbone.pos[2]
    k0.rot = bone.quaternion.toArray()
  })
}

MMD_SA.reset_skin = function (model_index) {
  THREE.MMD.getModels().forEach(function (model, idx) {
    if ((model_index != null) && (idx != model_index))
      return

    var s = model.skin
    if (!s || s._is_dummy) {
      return
    }

    var mesh = s.mesh
    var geom = mesh.geometry
    for (var i = 0, max = mesh.bones.length; i < max; i++) {
      var bone  = mesh.bones[i]
      var gbone = geom.bones[i]
      bone.position.set(gbone.pos[0],gbone.pos[1],gbone.pos[2])
      bone.quaternion.set(0,0,0,1)
    }
  })
}

MMD_SA.reset_morph = function (model_index) {
  THREE.MMD.getModels().forEach(function (model, idx) {
    if ((model_index != null) && (idx != model_index))
      return

    var m = model.morph
    if (m && m._is_dummy) {
//DEBUG_show(MMD_SA_options.motion[MMD_SA_options.motion_shuffle_list[MMD_SA.motion_shuffle_index]].path,0,1)
      return
    }

//    model._blink_countdown = -9999

    m = model.mesh.morphTargetInfluences
// m can be undefined for models with no morph transform
    if (m) {
      for (var i = 0, len = m.length; i < len; i++)
        m[i] = 0
    }
  })
}

MMD_SA._camera_y_offset_ = 0
MMD_SA.reset_camera = function (check_event) {
  const result = {};
  window.dispatchEvent(new CustomEvent("MMDCameraReset", { detail:{ enforced:check_event, result:result } }));
  if (result.return_value) return;

  this._camera_y_offset_ = 0

  var center_view = this.center_view;
  var center_view_lookAt = this.center_view_lookAt
//MMD_SA._debug_msg = [center_view]
//DEBUG_show(center_view,0,1)

  var model_pos = THREE.MMD.getModels()[0].mesh.position
  var camera_position = MMD_SA_options.camera_position.slice()
  if (MMD_SA_options.use_random_camera && returnBoolean("MMDRandomCamera") && (MMD_SA.MMD.motionManager.para_SA.use_random_camera || Audio_BPM.vo.BPM_mode)) {
    var rc = MMD_SA_options.random_camera
    camera_position = MMD_SA.TEMP_v3.set(camera_position[0]-model_pos.x, camera_position[1]-model_pos.y, camera_position[2]-model_pos.z).multiplyScalar(rc.distance[0]+Math.random()*(rc.distance[1]-rc.distance[0])).applyQuaternion(MMD_SA.TEMP_q.setFromEuler(MMD_SA._v3a.set((rc.rotation.x[0]+Math.random()*(rc.rotation.x[1]-rc.rotation.x[0]))*Math.PI/180, (rc.rotation.y[0]+Math.random()*(rc.rotation.y[1]-rc.rotation.y[0]))*Math.PI/180, (rc.rotation.z[0]+Math.random()*(rc.rotation.z[1]-rc.rotation.z[0]))*Math.PI/180))).add(model_pos).toArray()
//DEBUG_show(MMD_SA_options.camera_position+'/'+camera_position,0,1)
  }

  var tc = this._trackball_camera
  tc.position0.set(camera_position[0]+center_view[0], camera_position[1]+center_view[1], camera_position[2]+center_view[2])
  tc.target0.set(model_pos.x+center_view_lookAt[0]+MMD_SA_options.camera_lookAt[0], model_pos.y+center_view_lookAt[1]+MMD_SA_options.camera_lookAt[1], model_pos.z+center_view_lookAt[2]+MMD_SA_options.camera_lookAt[2])
  tc.reset()

  tc.object.updateProjectionMatrix();

//  tc.position0 = _position0
//  tc.target0 = _target0

// reset it for proper "look_at_mouse"
  MMD_SA._mouse_pos_3D = []

  MMD_SA._trackball_camera.SA_adjust()
//  tc.object.updateMatrixWorld()

  MMD_SA._trackball_camera.rotate_with_up_fixed = MMD_SA_options.Dungeon && MMD_SA_options.Dungeon.character.TPS_mode;

  window.dispatchEvent(new CustomEvent("MMDCameraReset_after", { detail:{ enforced:check_event } }));
}

MMD_SA.Animation_dummy = {
  _is_dummy:true
 ,_MMD_SA_disabled: true
};
MMD_SA.Animation_dummy.reset = MMD_SA.Animation_dummy.seek = MMD_SA.Animation_dummy.play = MMD_SA.Animation_dummy.pause = MMD_SA.Animation_dummy.update = MMD_SA.Animation_dummy.adjustDuration = MMD_SA.Animation_dummy.onupdate = function () {};


// AT: Box3.intersectObject


// AT: backported
THREE.Ray.prototype.intersectTriangle = function () {

		// Compute the offset origin, edges, and normal.
		var diff = new THREE.Vector3();
		var edge1 = new THREE.Vector3();
		var edge2 = new THREE.Vector3();
		var normal = new THREE.Vector3();

		return function intersectTriangle( a, b, c, backfaceCulling, optionalTarget ) {

			// from http://www.geometrictools.com/GTEngine/Include/Mathematics/GteIntrRay3Triangle3.h

//edge1.subVectors( c, b );
//edge2.subVectors( a, b );
			edge1.subVectors( b, a );
			edge2.subVectors( c, a );
			normal.crossVectors( edge1, edge2 );

			// Solve Q + t*D = b1*E1 + b2*E2 (Q = kDiff, D = ray direction,
			// E1 = kEdge1, E2 = kEdge2, N = Cross(E1,E2)) by
			//   |Dot(D,N)|*b1 = sign(Dot(D,N))*Dot(D,Cross(Q,E2))
			//   |Dot(D,N)|*b2 = sign(Dot(D,N))*Dot(D,Cross(E1,Q))
			//   |Dot(D,N)|*t = -sign(Dot(D,N))*Dot(Q,N)
			var DdN = this.direction.dot( normal );
			var sign;

			if ( DdN > 0 ) {

				if ( backfaceCulling ) return null;
				sign = 1;

			} else if ( DdN < 0 ) {

				sign = - 1;
				DdN = - DdN;

			} else {

				return null;

			}

			diff.subVectors( this.origin, a );
			var DdQxE2 = sign * this.direction.dot( edge2.crossVectors( diff, edge2 ) );

			// b1 < 0, no intersection
			if ( DdQxE2 < 0 ) {

				return null;

			}

			var DdE1xQ = sign * this.direction.dot( edge1.cross( diff ) );

			// b2 < 0, no intersection
			if ( DdE1xQ < 0 ) {

				return null;

			}

			// b1+b2 > 1, no intersection
			if ( DdQxE2 + DdE1xQ > DdN ) {

				return null;

			}

			// Line intersects triangle, check if ray does.
			var QdN = - sign * diff.dot( normal );

			// t < 0, no intersection
			if ( QdN < 0 ) {

				return null;

			}

			// Ray intersects triangle.
			return this.at( QdN / DdN, optionalTarget );

		};

}();

MMD_SA.bone_to_position = (function () {
  var bone_pos = new THREE.Vector3()
  var pos_delta = new THREE.Vector3()
  var bone_pos_adjusted = new THREE.Vector3()
  var _v3a = new THREE.Vector3()

  function BP() {
    this.by_bone_name = []
    this.pos_delta = new THREE.Vector3()
    this.pos_delta_rotated = new THREE.Vector3()
    this.bone_pos_offset = new THREE.Vector3()
  }

  BP.prototype.init = function (mesh, bone_name, path, motion_time) {
    var para = this.by_bone_name[bone_name]
    if (!para) {
      para = this.by_bone_name[bone_name] = { gbone:{ position:new THREE.Vector3().fromArray(mesh.geometry.bones[mesh.bones_by_name[bone_name]._index].pos) }, position:new THREE.Vector3(), quaternion:new THREE.Quaternion(), path:"", motion_time:0 }
    }
    if ((para.path != path) || (para.motion_time > motion_time)) {
      para.position.set(0,0,0)
      para.quaternion.set(0,0,0,1)
      para.path = path
    }
    para.motion_time = motion_time

    this.gbone = para.gbone
    this.position   = para.position
    this.quaternion = para.quaternion
  };

  return function (para_SA) {
    var that = this
    if (!that.skin)
      return null

    var mesh = this.mesh
    if (mesh._bone_to_position_last) {
      mesh._bone_to_position_last.pos_delta.set(0,0,0)
      mesh._bone_to_position_last.pos_delta_rotated.set(0,0,0)
      mesh._bone_to_position_last.bone_pos_offset.set(0,0,0)
    }
    else
      mesh._bone_to_position_last = new BP()

    if (!para_SA.bone_to_position)
      return null

    var motion_para = (para_SA.adjustment_per_model && (para_SA.adjustment_per_model[MMD_SA_options.model_para_obj_all[this._model_index]._filename_cleaned] || para_SA.adjustment_per_model._default_)) || {};
//    var rot_add_parent = motion_para.skin_default && motion_para.skin_default["全ての親"]; rot_add_parent = rot_add_parent.rot_add || rot_add_parent.rot;

    para_SA.bone_to_position.forEach(function (bp) {
      var bone_name  = bp.name
      var bone_scale = bp.scale || {x:1,y:1,z:1}

      var bone = mesh.bones_by_name[bone_name]

      var time = that.skin.time
      var frame = time*30
      mesh._bone_to_position_last.init(mesh, bone_name, para_SA._path, time)

      if (!bp.frame_range || bp.frame_range.some(function (r) { return (frame>=r[0] && frame<=r[1]); })) {
        bone_pos.copy(bone.position).sub(mesh._bone_to_position_last.gbone.position).multiply(bone_scale)
      }
      else {
        bone_pos.set(0,0,0)
      }

      bone_pos_adjusted.copy(bone_pos)

      var rot_add
      var use_bone_rotated_translation
      if (motion_para.skin_default) {
        let motion_adjust = motion_para.skin_default[bone_name] || {}
        rot_add = motion_adjust.rot_add || motion_adjust.rot
        if (!rot_add && !para_SA.bone_to_position.some(function (_bp) { return (_bp.name == "全ての親"); })) {
          motion_adjust = motion_para.skin_default["全ての親"] || {}
          rot_add = motion_adjust.rot_add || motion_adjust.rot
          use_bone_rotated_translation = !!rot_add
        }
        if (rot_add) {
          bone_pos_adjusted.applyEuler(_v3a.copy(rot_add).multiplyScalar(Math.PI/180))
        }
      }

      if (!bp.position_disabled) {
        pos_delta.copy(bone_pos_adjusted).sub(mesh._bone_to_position_last.position)
        mesh._bone_to_position_last.position.copy(bone_pos_adjusted)
      }
      else {
        pos_delta.set(0,0,0)
        bone_pos_adjusted.set(0,0,0)
      }

      if (bone_name == "全ての親") {
        bone.position.sub(bone_pos)
        mesh._bone_to_position_last.bone_pos_offset.add(bone_pos)
      }
      else {
        let pos_offset = (use_bone_rotated_translation) ? bone_pos.applyEuler(_v3a.copy(rot_add).multiplyScalar(Math.PI/180)) : bone_pos
        mesh.bones_by_name["全ての親"].position.sub(pos_offset)
        mesh._bone_to_position_last.bone_pos_offset.add(pos_offset)
      }

      mesh._bone_to_position_last.pos_delta.add(pos_delta)
    });

    mesh._bone_to_position_last.pos_delta_rotated.copy(mesh._bone_to_position_last.pos_delta).applyQuaternion(mesh.quaternion)
    return mesh._bone_to_position_last.pos_delta
  };
})();


if (MMD_SA.use_jThree_v1)
  jThree.goml( "index.goml" );


// borrowed from http://www20.atpages.jp/katwat/three.js_r58/examples/mytest33/menu.html
var Misc = {
	extractPathBase: function( path ) {
		var a = path.split( '/' );
		a.pop();
		return a.length === 0 ? '' : a.join( '/' ) + '/';
	},
	extractPathExt: function( path ) {
		var ext = path.split( '.' ).pop();
		if ( ext === path ) {
			return '';
		}
		return ext;
	}
}

})();


/*
var misc = {
	requestFullscreen: function() {
		var target = document.body;
		if (target.webkitRequestFullscreen) {
			target.webkitRequestFullscreen(); //Chrome15+, Safari5.1+, Opera15+
		} else if (target.mozRequestFullScreen) {
			target.mozRequestFullScreen(); //FF10+
		} else if (target.msRequestFullscreen) {
			target.msRequestFullscreen(); //IE11+
		} else if (target.requestFullscreen) {
			target.requestFullscreen(); // HTML5 Fullscreen API仕様
		} else {
			alert('ご利用のブラウザはフルスクリーン操作に対応していません');
			return;
		}

		fn.stats.add( fn.camCon ).delay( 2000 ).animate({ top: -50 }, 1000 ).hide( 0, function() {this.style.display="none";this.style.top="0px";} );
		fn.control = $( "#button" ).delay( 2000 ).animate({ bottom: -50 }, 1000 ).hide( 0, function() {this.style.display="none";this.style.bottom="10px";} );
		fn.screenW = document.body.clientWidth;
		fn.screenH = document.body.clientHeight;
		$( "canvas" ).mousemove( misc.slideToggle );
		fn.visible = false;
		fn.full = true;
		fn.info = jQuery( "#info" ).hide();
	},
	slideToggle: function( e ) {
		if ( e.clientX < 80 && e.clientY < 50 ) {
			fn.stats.show();
			fn.visible = true;
		} else if ( e.clientX > fn.screenW / 2 - 150 && e.clientX < fn.screenW / 2 + 150 && e.clientY > fn.screenH - 30 ) {
			fn.control.show();
			fn.visible = true;
		} else if ( fn.visible ) {
			fn.visible = false;
			fn.stats.hide();
			fn.control.hide();
		}
	},

	handleFSevent: function() {
		if( (document.webkitFullscreenElement && document.webkitFullscreenElement !== null)
		 || (document.mozFullScreenElement && document.mozFullScreenElement !== null)
		 || (document.msFullscreenElement && document.msFullscreenElement !== null)
		 || (document.fullScreenElement && document.fullScreenElement !== null) ) {
		}else{
			document.getElementsByTagName("button")[0].style.display = "block";
			$( "canvas" ).unbind( "mousemove", misc.slideToggle );
			fn.stats.add( fn.camCon ).show();
			fn.control.show();
			fn.info.show();
			fn.full = false;
		}
	}
};

document.addEventListener("webkitfullscreenchange", misc.handleFSevent, false);
document.addEventListener("mozfullscreenchange",misc. handleFSevent, false);
document.addEventListener("MSFullscreenChange", misc.handleFSevent, false);
document.addEventListener("fullscreenchange", misc.handleFSevent, false);
*/
