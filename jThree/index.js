//setTimeout('alert(jThree.getReferent("#vmd1").three(0).generateSkinAnimation)', 1000)
//THREE.MMD.getModels()

MMD_SA.fn = {
	length: 1, // 1 for the "dummy" place reserved for external motion

	load_length_extra: MMD_SA_options.load_length_extra||0,

    _ready_for_model_creation: [],
    _model_creation_timerID: [],

	setupUI: function(para) {
this.length++;

var load_length = MMD_SA_options.motion.length + MMD_SA_options.x_object.length +1 + this.load_length_extra;

// extra model
load_length += MMD_SA_options.model_path_extra.length

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

   ,x_object_init: function () {
  MMD_SA_options.x_object.forEach(function (x_object, idx) {
MMD_SA_options.x_object_by_name[x_object.path.replace(/^.+[\/\\]/, "").replace(/\.x$/i, "")] = x_object
x_object.id = "#x_object" + idx
x_object.show = MMD_SA._x_object_show
x_object.hide = MMD_SA._x_object_hide

x_object._obj = jThree(x_object.id).three(0)
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
  var geo = x_object._obj.children[0].geometry
  geo.boundingBox_list = []
  x_object.boundingBox_list.forEach(function (bb) {
    if (bb == null) {
      geo.boundingBox_list.push(geo.boundingBox)
    }
    else {
      var b3 = new THREE.Box3().set(bb.min, bb.max)
      b3.oncollide = bb.oncollide
      b3.onaway = bb.onaway
      geo.boundingBox_list.push(b3)
    }
  });

// mainly to allow low-angle camera for mesh that needs collision enforced, to make sure that camera is within bounding box
  if (x_object.bb_adjust) {
    geo.boundingBox_list.forEach(function (bb) {
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
x_object.show = MMD_SA._x_object_show
x_object.hide = MMD_SA._x_object_hide

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
  x_object._obj = jThree(x_object.id).three(0)

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
  _model.skin_MMD_SA_extra = []
  _model.morph_MMD_SA_extra = []
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

for (var i = 0, len = MMD_SA_options.motion.length; i < len; i++) {
  var motion = MMD_SA_options.motion[i]
  if (!motion.path) {
// should be the case of "dummy" motion reserved for external load
    MMD_SA.motion.push(new MMD_SA.MMD.MotionManager())
    continue
  }

  var filename = decodeURIComponent(motion.path.replace(/^.+[\/\\]/, "").replace(/\.vmd$/i, ""))
  var para_SA = MMD_SA_options.motion_para[filename] || {}

  var vmd = (jThree.getReferent) ? jThree.getReferent("#vmd" + i).three(0) : MMD_SA.vmd_by_filename[filename]
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
      if (para_SA.model_name_RegExp) {
        motion_skipped = !para_SA.model_name_RegExp.test(model_para._filename)
//if (!motion_skipped) DEBUG_show(filename+'/'+idx,0,1)
      }
      else if (para_SA.model_index_list) {
        motion_skipped = (para_SA.model_index_list.indexOf(idx) == -1)
//if (!motion_skipped) DEBUG_show(filename+'/'+idx,0,1)
      }
      else if ((idx > 0) && (para || !model_para.mirror_motion_from_first_model)) {
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
      if ((idx > 0) && !model_para.mirror_motion_from_first_model && !model_para.motion_name_default)
        model_para.motion_name_default = filename
      model._MMD_SA_cache_current = obj
      model.skin  = skin
      model.morph = morph
      THREE.MMD.adjustMotionDuration()
    }
  });
}

MMD_SA.MMD.motionManager = MMD_SA.motion[0]
//console.log(MMD_SA_options.motion);console.log(MMD_SA.motion);
/*
// Using WebGL to speeed up the "doFilter" function in JSARToolKit
if (MMD_SA_options.use_JSARToolKit && use_WebGL_2D) {
  var AR_obj = MMD_SA.AR_obj
  var raster = AR_obj.raster._canvas
  WebGL_2D.createObject(raster)

  raster._WebGL_2D.fshader_2d_var +=
  '// AT custom\n'
+ 'uniform float _threshold;\n'

  raster._WebGL_2D.fshader_2d_main +=
  'float c = gl_FragColor.r*255.0 *0.2989 + gl_FragColor.g*255.0 *0.5866 + gl_FragColor.b*255.0 *0.1145;'
//(c <= th3) ? 0xffffffff : 0xff000000;
+ 'gl_FragColor = (c <= _threshold) ? vec4(1.0,1.0,1.0,1.0) : vec4(0.0,0.0,0.0,1.0);\n'

  var canvas_buffer = raster._WebGL_2D._AR_canvas_buffer = document.createElement("canvas")
  canvas_buffer.width =  AR_obj.canvas.width
  canvas_buffer.height = AR_obj.canvas.height
}
*/

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


var simulateCallback = function () {
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

if (MMD_SA_options.Dungeon) {
  if (!mesh.visible || x_object.parent_bone.disabled) {
    x_object._obj_proxy.hidden = true
    x_object._obj_proxy.visible = false
    return
  }
  x_object._obj_proxy.hidden = false
  x_object._obj_proxy.visible = true
}

if (p_bone.condition && !p_bone.condition(x_object, model_index))
  return

var para_SA = MMD_SA.motion[that.skin._motion_index].para_SA
var x_para
x_para = para_SA.adjustment_per_model && (para_SA.adjustment_per_model[MMD_SA_options.model_para_obj._filename] || para_SA.adjustment_per_model[MMD_SA_options.model_para_obj._filename_cleaned])
x_para = x_para && x_para.accessory_default && x_para.accessory_default[x_object.path.replace(/^.+[\/\\]/, "")]
if (x_para)
  p_bone = x_para.parent_bone

var bone = mesh.bones_by_name[p_bone.name]
if (!bone)
  return

var bone_objs = bone.skinMatrix.decompose()
var pos = bone_objs[0]
var rot = bone_objs[1]
/*
var pos = MMD_SA.get_bone_position(mesh, p_bone.name)
var rot = MMD_SA.get_bone_rotation(mesh, p_bone.name)
//DEBUG_show(pos.toArray()+'\n'+new THREE.Vector3().setEulerFromQuaternion(rot).toArray())
*/
var obj = x_object._obj

obj.position.copy(pos)
if (p_bone.position) {
  obj.position.add(MMD_SA.TEMP_v3.set(p_bone.position.x, p_bone.position.y, -p_bone.position.z).applyQuaternion(rot))
}

obj.useQuaternion = true
obj.quaternion.copy(rot)
if (p_bone.rotation) {
  if (!p_bone.rotation._quaternion) {
//--+
    p_bone.rotation._quaternion = new THREE.Quaternion().setFromEuler(MMD_SA.TEMP_v3.set(-p_bone.rotation.x, -p_bone.rotation.y, p_bone.rotation.z).multiplyScalar(Math.PI/180), 'YXZ')
  }
  obj.quaternion.multiply(p_bone.rotation._quaternion)
}

var m4_objs = MMD_SA.TEMP_m4.makeFromPositionQuaternionScale( obj.position, obj.quaternion, obj.scale ).multiplyMatrices(mesh.matrixWorld, MMD_SA.TEMP_m4).decompose()
obj.position.copy(m4_objs[0])
obj.quaternion.copy(m4_objs[1])
//DEBUG_show(obj.position.toArray())
obj.matrixAutoUpdate = false
obj.updateMatrix()
  });
};
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
  var bone_rotation = MMD_SA._v3a_.setEulerFromQuaternion(bone.quaternion)//.clone.normalize())
  if (mod) {
    bone_rotation.x *= mod[0]
    bone_rotation.y *= mod[1]
    bone_rotation.z *= mod[2]
  }

  if (rotation instanceof THREE.Quaternion)
    rotation = MMD_SA._v3b_.setEulerFromQuaternion(rotation)

  bone_rotation.add(rotation)
  bone.quaternion.setFromEuler(bone_rotation)
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
  if (check_event) {
    window.dispatchEvent(new CustomEvent("MMDCameraReset", { detail:{} }));
  }

  this._camera_y_offset_ = 0

  var center_view = /*(MMD_SA_options.use_JSARToolKit && MMD_SA.AR_obj._m4) ? [0,0,0] :*/ this.center_view;
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
//  var _position0 = tc.position0.clone()
//  var _target0 = tc.target0.clone()
//  tc.reset()
//DEBUG_show(_position0.toArray()+'/'+_target0.toArray(),0,1)

//  center_view = MMD_SA.TEMP_v3.set(center_view[0], center_view[1], center_view[2]).applyEuler(MMD_SA._v3a.set(MMD_SA_options.camera_rotation[0], MMD_SA_options.camera_rotation[1], MMD_SA_options.camera_rotation[2])).toArray()
//DEBUG_show(center_view,0,1)
  tc.position0.set(camera_position[0]+center_view[0], camera_position[1]+center_view[1], camera_position[2]+center_view[2])
//DEBUG_show(camera_position+'\n'+tc.position0.toArray(),0,1)
//  var _lookAt = tc.object._lookAt
//DEBUG_show(_lookAt.toArray()+'/'+center_view_lookAt,0,1)
//  tc.target0.set(_lookAt.x+center_view_lookAt[0], _lookAt.y+center_view_lookAt[1], _lookAt.z+center_view_lookAt[2])
  tc.target0.set(model_pos.x+center_view_lookAt[0], model_pos.y+10+center_view_lookAt[1], model_pos.z+center_view_lookAt[2])
  tc.reset()

//  tc.position0 = _position0
//  tc.target0 = _target0

// reset it for proper "look_at_mouse"
  MMD_SA._mouse_pos_3D = []

  MMD_SA._trackball_camera.SA_adjust()
//  tc.object.updateMatrixWorld()

  MMD_SA._trackball_camera.rotate_with_up_fixed = MMD_SA_options.Dungeon && MMD_SA_options.Dungeon.character.TPS_mode
}

MMD_SA.Animation_dummy = {
  _is_dummy:true
 ,_MMD_SA_disabled: true
};
MMD_SA.Animation_dummy.reset = MMD_SA.Animation_dummy.seek = MMD_SA.Animation_dummy.play = MMD_SA.Animation_dummy.pause = MMD_SA.Animation_dummy.update = MMD_SA.Animation_dummy.adjustDuration = MMD_SA.Animation_dummy.onupdate = function () {};


// AT: Box3.intersectObject
THREE.Box3.prototype.intersectObject = function () {

// https://gist.github.com/yomotsu/d845f21e2e1eb49f647f
// collision START
var collision = {};

  var center = new THREE.Vector3();
  var extents = new THREE.Vector3();

  var v0 = new THREE.Vector3(),
      v1 = new THREE.Vector3(),
      v2 = new THREE.Vector3();

  // Compute edge vectors for triangle
  var f0 = new THREE.Vector3(),
      f1 = new THREE.Vector3(),
      f2 = new THREE.Vector3();

  // Test axes a00..a22 (category 3)
  var a00 = new THREE.Vector3(),
      a01 = new THREE.Vector3(),
      a02 = new THREE.Vector3(),
      a10 = new THREE.Vector3(),
      a11 = new THREE.Vector3(),
      a12 = new THREE.Vector3(),
      a20 = new THREE.Vector3(),
      a21 = new THREE.Vector3(),
      a22 = new THREE.Vector3();

  var plane = new THREE.Plane();

// aabb: <THREE.Box3>
// Plane: <THREE.Plane>
collision.isIntersectionAABBPlane = function ( aabb, Plane ) {

  center.addVectors( aabb.max, aabb.min ).multiplyScalar( 0.5 );
  extents.subVectors( aabb.max, center );

  var r = extents.x * Math.abs( Plane.normal.x ) + extents.y * Math.abs( Plane.normal.y ) + extents.z * Math.abs( Plane.normal.z );
  var s = Plane.normal.dot( center ) - Plane.constant;

  return Math.abs( s ) <= r;

}

// based on http://www.gamedev.net/topic/534655-aabb-triangleplane-intersection--distance-to-plane-is-incorrect-i-have-solved-it/
//
// a: <THREE.Vector3>, // vertex of a triangle
// b: <THREE.Vector3>, // vertex of a triangle
// c: <THREE.Vector3>, // vertex of a triangle
// aabb: <THREE.Box3>
collision.isIntersectionTriangleAABB = function ( a, b, c, aabb ) {

  var p0, p1, p2, r;
  
  // Compute box center and extents of AABoundingBox (if not already given in that format)
  center.addVectors( aabb.max, aabb.min ).multiplyScalar( 0.5 );
  extents.subVectors( aabb.max, center );

  // Translate triangle as conceptually moving AABB to origin
  v0.subVectors( a, center );
  v1.subVectors( b, center );
  v2.subVectors( c, center );

  // Compute edge vectors for triangle
  f0.subVectors( v1, v0 );
  f1.subVectors( v2, v1 );
  f2.subVectors( v0, v2 );

  // Test axes a00..a22 (category 3)
  a00.set( 0, -f0.z, f0.y );
  a01.set( 0, -f1.z, f1.y );
  a02.set( 0, -f2.z, f2.y );
  a10.set( f0.z, 0, -f0.x );
  a11.set( f1.z, 0, -f1.x );
  a12.set( f2.z, 0, -f2.x );
  a20.set( -f0.y, f0.x, 0 );
  a21.set( -f1.y, f1.x, 0 );
  a22.set( -f2.y, f2.x, 0 );

  // Test axis a00
  p0 = v0.dot( a00 );
  p1 = v1.dot( a00 );
  p2 = v2.dot( a00 );
  r = extents.y * Math.abs( f0.z ) + extents.z * Math.abs( f0.y );

  if ( Math.max( -Math.max( p0, p1, p2 ), Math.min( p0, p1, p2 ) ) > r ) {

    return false; // Axis is a separating axis

  }

  // Test axis a01
  p0 = v0.dot( a01 );
  p1 = v1.dot( a01 );
  p2 = v2.dot( a01 );
  r = extents.y * Math.abs( f1.z ) + extents.z * Math.abs( f1.y );

  if ( Math.max( -Math.max( p0, p1, p2 ), Math.min( p0, p1, p2 ) ) > r ) {

    return false; // Axis is a separating axis

  }

  // Test axis a02
  p0 = v0.dot( a02 );
  p1 = v1.dot( a02 );
  p2 = v2.dot( a02 );
  r = extents.y * Math.abs( f2.z ) + extents.z * Math.abs( f2.y );

  if ( Math.max( -Math.max( p0, p1, p2 ), Math.min( p0, p1, p2 ) ) > r ) {

    return false; // Axis is a separating axis

  }

  // Test axis a10
  p0 = v0.dot( a10 );
  p1 = v1.dot( a10 );
  p2 = v2.dot( a10 );
  r = extents.x * Math.abs( f0.z ) + extents.z * Math.abs( f0.x );
  if ( Math.max( -Math.max( p0, p1, p2 ), Math.min( p0, p1, p2 ) ) > r ) {

    return false; // Axis is a separating axis

  }

  // Test axis a11
  p0 = v0.dot( a11 );
  p1 = v1.dot( a11 );
  p2 = v2.dot( a11 );
  r = extents.x * Math.abs( f1.z ) + extents.z * Math.abs( f1.x );

  if ( Math.max( -Math.max( p0, p1, p2 ), Math.min( p0, p1, p2 ) ) > r ) {

    return false; // Axis is a separating axis

  }

  // Test axis a12
  p0 = v0.dot( a12 );
  p1 = v1.dot( a12 );
  p2 = v2.dot( a12 );
  r = extents.x * Math.abs( f2.z ) + extents.z * Math.abs( f2.x );

  if ( Math.max( -Math.max( p0, p1, p2 ), Math.min( p0, p1, p2 ) ) > r ) {

    return false; // Axis is a separating axis

  }

  // Test axis a20
  p0 = v0.dot( a20 );
  p1 = v1.dot( a20 );
  p2 = v2.dot( a20 );
  r = extents.x * Math.abs( f0.y ) + extents.y * Math.abs( f0.x );

  if ( Math.max( -Math.max( p0, p1, p2 ), Math.min( p0, p1, p2 ) ) > r ) {

    return false; // Axis is a separating axis

  }

  // Test axis a21
  p0 = v0.dot( a21 );
  p1 = v1.dot( a21 );
  p2 = v2.dot( a21 );
  r = extents.x * Math.abs( f1.y ) + extents.y * Math.abs( f1.x );

  if ( Math.max( -Math.max( p0, p1, p2 ), Math.min( p0, p1, p2 ) ) > r ) {

    return false; // Axis is a separating axis

  }

  // Test axis a22
  p0 = v0.dot( a22 );
  p1 = v1.dot( a22 );
  p2 = v2.dot( a22 );
  r = extents.x * Math.abs( f2.y ) + extents.y * Math.abs( f2.x );

  if ( Math.max( -Math.max( p0, p1, p2 ), Math.min( p0, p1, p2 ) ) > r ) {

    return false; // Axis is a separating axis

  }

  // Test the three axes corresponding to the face normals of AABB b (category 1).
  // Exit if...
  // ... [-extents.x, extents.x] and [min(v0.x,v1.x,v2.x), max(v0.x,v1.x,v2.x)] do not overlap
  if ( Math.max( v0.x, v1.x, v2.x ) < -extents.x || Math.min( v0.x, v1.x, v2.x ) > extents.x ) {

    return false;

  }
  // ... [-extents.y, extents.y] and [min(v0.y,v1.y,v2.y), max(v0.y,v1.y,v2.y)] do not overlap
  if ( Math.max( v0.y, v1.y, v2.y ) < -extents.y || Math.min( v0.y, v1.y, v2.y ) > extents.y ) {

    return false;

  }
  // ... [-extents.z, extents.z] and [min(v0.z,v1.z,v2.z), max(v0.z,v1.z,v2.z)] do not overlap
  if ( Math.max( v0.z, v1.z, v2.z ) < -extents.z || Math.min( v0.z, v1.z, v2.z ) > extents.z ) {

    return false;

  }


  // Test separating axis corresponding to triangle face normal (category 2)
  // Face Normal is -ve as Triangle is clockwise winding (and XNA uses -z for into screen)
  plane.normal.copy( f1 ).cross( f0 ).normalize();
//plane.normal.subVectors(v2,v1).cross(v0.sub(v1)).normalize()
  plane.constant = plane.normal.dot( a );
  
  return collision.isIntersectionAABBPlane( aabb, plane );
}
// collision END

var blocked_side = {
  _updated: false

 ,reset: function (obj) {
this.x_min =   { state:0, depth:[0,0], info:["",""] }
this.x_max =   { state:0, depth:[0,0], info:["",""] }
this.z_min =   { state:0, depth:[0,0], info:["",""] }
this.z_max =   { state:0, depth:[0,0], info:["",""] }
this.y_min =   { state:0, depth:[0,0], info:["",""] }
this.y_max =   { state:0, depth:[0,0], info:["",""] }
this.blocked = { state:0, depth:[0,0], info:["",""] }
this.depth_min = 0.1 / obj._obj.scale.length()
this._updated = false
  }

 ,set_state: function (state, depth, info) {
if ((depth > blocked_side.depth_min) && (this.depth[state-1] < depth)) {
  this.depth[state-1] = depth
  if (this.state < state)
    this.state = state
  this.info = info
  if ((this != blocked_side.y_min))// && (this != blocked_side.y_max))
    blocked_side._updated = true
}
  }
};

var inverseMatrix = new THREE.Matrix4();
var facePlane = new THREE.Plane();
var ray = new THREE.Ray();
var bb_static = new THREE.Box3();
var bb_moved = new THREE.Box3();
var bb_static0 = new THREE.Box3();
var bb_moved0 = new THREE.Box3();
var bb_core_static = new THREE.Box3();
var bb_core_moved = new THREE.Box3();
var bb_hit_static = new THREE.Box3();
var bb_hit_moved = new THREE.Box3();
var bb_contained = new THREE.Box3();
var bb_contained0 = new THREE.Box3();

var bb_static_center = new THREE.Vector3();
var bb_moved_center = new THREE.Vector3();
var bb_static_size = new THREE.Vector3();
var bb_moved_size = new THREE.Vector3();

var bb_plane_static = {
  x_min: new THREE.Plane()
 ,x_max: new THREE.Plane()
 ,z_min: new THREE.Plane()
 ,z_max: new THREE.Plane()
 ,y_min: new THREE.Plane()
 ,y_max: new THREE.Plane()
};

var bb_plane_moved = {
  x_min: new THREE.Plane()
 ,x_max: new THREE.Plane()
 ,z_min: new THREE.Plane()
 ,z_max: new THREE.Plane()
 ,y_min: new THREE.Plane()
 ,y_max: new THREE.Plane()
};

var bb_plane_static0 = {
  x_min: new THREE.Plane()
 ,x_max: new THREE.Plane()
 ,z_min: new THREE.Plane()
 ,z_max: new THREE.Plane()
 ,y_min: new THREE.Plane()
 ,y_max: new THREE.Plane()
};

var bb_plane_moved0 = {
  x_min: new THREE.Plane()
 ,x_max: new THREE.Plane()
 ,z_min: new THREE.Plane()
 ,z_max: new THREE.Plane()
 ,y_min: new THREE.Plane()
 ,y_max: new THREE.Plane()
};

var _v3a = new THREE.Vector3();
var _v3b = new THREE.Vector3();
var _v3c = new THREE.Vector3();

var _p0 = new THREE.Plane();

var faces;

function face_grounded(face, y) {
//  return (Math.abs(face.normal.y) > y)
  return (face.normal.y > y)
}

// https://stackoverflow.com/questions/563198/whats-the-most-efficent-way-to-calculate-where-two-line-segments-intersect
function get_line_intersection(p0_x,p0_y, p1_x,p1_y, p2_x,p2_y, p3_x,p3_y)
{
    var s02_x, s02_y, s10_x, s10_y, s32_x, s32_y, s_numer, t_numer, denom, t;
    s10_x = p1_x - p0_x;
    s10_y = p1_y - p0_y;
    s32_x = p3_x - p2_x;
    s32_y = p3_y - p2_y;

    denom = s10_x * s32_y - s32_x * s10_y;
    if (denom == 0)
        return 0; // Collinear
    var denomPositive = denom > 0;

    s02_x = p0_x - p2_x;
    s02_y = p0_y - p2_y;
    s_numer = s10_x * s02_y - s10_y * s02_x;
    if ((s_numer < 0) == denomPositive)
        return 0; // No collision

    t_numer = s32_x * s02_y - s32_y * s02_x;
    if ((t_numer < 0) == denomPositive)
        return 0; // No collision

    if (((s_numer > denom) == denomPositive) || ((t_numer > denom) == denomPositive))
        return 0; // No collision
    // Collision detected
    t = t_numer / denom;
    var i_x = p0_x + (t * s10_x);
    var i_y = p0_y + (t * s10_y);

    return [i_x, i_y];
}

return function (object_d, _bb_static) {

  var _face_grounded = object_d.collision_by_mesh_face_grounded || face_grounded

  var object_host = object_d._obj
  var object = (object_host.geometry) ? object_host : object_host.children[0];

			// Checking faces

			var geometry = object.geometry;
			var vertices = geometry.vertices;

			var isFaceMaterial = object.material instanceof THREE.MeshFaceMaterial;
			var objectMaterials = isFaceMaterial === true ? object.material.materials : null;

			var side = object.material.side;

			var a, b, c, d;

			inverseMatrix.getInverse( object_host.matrixWorld );
/*
var pqs = inverseMatrix.decompose()
//pqs[1].x = -pqs[1].x
//pqs[1].conjugate()
//pqs[1].set(0,0,0,1)
inverseMatrix.makeFromPositionQuaternionScale(pqs[0], pqs[1], pqs[2])
*/
bb_static.copy(_bb_static).applyMatrix4(inverseMatrix);
bb_moved.copy(this).applyMatrix4(inverseMatrix);

var bb_list = ((this == _bb_static) ? [bb_static] : [bb_moved, bb_static])

var bb_ground = (bb_static.min.y > bb_moved.min.y) ? bb_static : bb_moved;
var ground_y_threshold = bb_ground.min.y + (bb_ground.max.y - bb_ground.min.y) * 0.25;
var ground_y_threshold_upper = bb_ground.center(center).y;
var ground_plane_y_threshold = ((bb_static.min.y > bb_moved.min.y) ? bb_moved.min.y : bb_static.min.y) - Math.max(bb_static.max.x-bb_static.min.x, bb_static.max.z-bb_static.min.z) * 2

bb_moved.union(bb_static);

bb_static.center(bb_static_center);
bb_moved.center(bb_moved_center)

// ray from top
ray.set(_v3a.copy(bb_moved_center).setY(bb_moved.max.y), new THREE.Vector3(0,-1,0));

bb_core_static.copy(bb_static);
bb_core_static.expandByVector(_v3a.copy(bb_core_static.size(bb_static_size)).multiplyScalar(-0.25));
bb_core_static.min.y = ground_y_threshold;

bb_core_moved.copy(bb_moved);
bb_core_moved.expandByVector(_v3a.copy(bb_core_moved.size(bb_moved_size)).multiplyScalar(-0.25));
bb_core_moved.min.y = ground_y_threshold;

bb_hit_static.copy(bb_static);
bb_hit_static.expandByVector(_v3a.copy(bb_hit_static.size(bb_static_size)).multiplyScalar(-0.125));
bb_hit_static.min.y = ground_y_threshold;

bb_hit_moved.copy(bb_moved);
bb_hit_moved.expandByVector(_v3a.copy(bb_hit_moved.size(bb_moved_size)).multiplyScalar(-0.125));
bb_hit_moved.min.y = ground_y_threshold;

var bb_static_collided = false
var ground_y = -999;
//var ground_pos = new THREE.Vector3(bb_static_center.x,-999,bb_static_center.z);
bb_static0.copy(bb_static)
bb_moved0.copy(bb_moved0)
//if (object_d.collision_by_mesh_enforced) {
  bb_static.min.y = Math.min(geometry.boundingBox.min.y, bb_static.min.y)
  bb_moved.min.y  = Math.min(geometry.boundingBox.min.y, bb_moved.min.y)
//}

// TRBL
var bb_side_static = {}
var bb_side_moved = {}
var bb_side_static0 = {}
var bb_side_moved0 = {}
var _bb = [bb_static, bb_moved, bb_static0, bb_moved0]
var _bb_side = [bb_side_static, bb_side_moved, bb_side_static0, bb_side_moved0]
for (var p in bb_plane_static) {
  switch (p) {
    case "x_min":
    case "x_max":
      _bb.forEach(function (bb, idx) {
        _bb_side[idx][p] = [
  [[bb.min.z,bb.max.y], [bb.max.z,bb.max.y]]
 ,[[bb.max.z,bb.max.y], [bb.max.z,bb.min.y]]
 ,[[bb.min.z,bb.min.y], [bb.max.z,bb.min.y]]
 ,[[bb.min.z,bb.max.y], [bb.min.z,bb.min.y]]
        ];
      });
      break
    case "z_min":
    case "z_max":
      _bb.forEach(function (bb, idx) {
        _bb_side[idx][p] = [
  [[bb.min.x,bb.max.y], [bb.max.x,bb.max.y]]
 ,[[bb.max.x,bb.max.y], [bb.max.x,bb.min.y]]
 ,[[bb.min.x,bb.min.y], [bb.max.x,bb.min.y]]
 ,[[bb.min.x,bb.max.y], [bb.min.x,bb.min.y]]
        ];
      });
      break
    case "y_min":
    case "y_max":
      _bb.forEach(function (bb, idx) {
        _bb_side[idx][p] = [
  [[bb.min.x,bb.max.z], [bb.max.x,bb.max.z]]
 ,[[bb.max.x,bb.max.z], [bb.max.x,bb.min.z]]
 ,[[bb.min.x,bb.min.z], [bb.max.x,bb.min.z]]
 ,[[bb.min.x,bb.max.z], [bb.min.x,bb.min.z]]
        ];
      });
      break
  }
}

var _bb = [bb_static, bb_moved, bb_static0, bb_moved0];
[bb_plane_static, bb_plane_moved, bb_plane_static0, bb_plane_moved0].forEach(function (bb_plane, idx) {
  var bb = _bb[idx]
  bb_plane.x_min.setFromNormalAndCoplanarPoint(_v3a.set(-1,0,0), _v3b.set(bb.min.x,0,0));
  bb_plane.x_max.setFromNormalAndCoplanarPoint(_v3a.set( 1,0,0), _v3b.set(bb.max.x,0,0));
  bb_plane.z_min.setFromNormalAndCoplanarPoint(_v3a.set(0,0,-1), _v3b.set(0,0,bb.min.z));
  bb_plane.z_max.setFromNormalAndCoplanarPoint(_v3a.set(0,0, 1), _v3b.set(0,0,bb.max.z));
  bb_plane.y_min.setFromNormalAndCoplanarPoint(_v3a.set(0,-1,0), _v3b.set(0,bb.min.y,0));
  bb_plane.y_max.setFromNormalAndCoplanarPoint(_v3a.set(0, 1,0), _v3b.set(0,bb.max.y,0));
});

blocked_side.reset(object_d);

var collision_by_mesh_material_index_max = object_d.collision_by_mesh_material_index_max || 999
var collision_by_mesh_sort_range, index_list, ini
if (object_d.collision_by_mesh_sort_range) {
  collision_by_mesh_sort_range = object_d.collision_by_mesh_sort_range
  index_list = object_d.mesh_sorted.index_list
  ini = 0
} else {
  collision_by_mesh_sort_range = 0
  index_list = geometry.faces
  ini = 0
}

var face_hit = {}
var plane_pts = []
var plane_pts_by_face_index = {}
var ground_face_index = -1

			for ( var _f = ini, fl = index_list.length; _f < fl; _f ++ ) {

var f;
if (collision_by_mesh_sort_range === 0) {
  f = _f
}
else {
  f = index_list[_f]
}

				var face = geometry.faces[ f ];

if (face.materialIndex >= collision_by_mesh_material_index_max) break;

				var material = isFaceMaterial === true ? objectMaterials[ face.materialIndex ] : object.material;

				if ( material === undefined ) continue;

				a = vertices[ face.a ];
				b = vertices[ face.b ];
				c = vertices[ face.c ];

				// check if we hit the wrong side of a single sided face
				var side = material.side;
				if ( side !== THREE.DoubleSide ) {
//if (f==173784) face.normal.subVectors(b,a).cross(_v3b.subVectors(c,a)).normalize()
					var planeSign = _v3a.addVectors(a,b).add(c).multiplyScalar(1/3).sub(bb_moved_center).normalize().dot( face.normal );
//if (f==173784) DEBUG_show((planeSign>0 ? 1 : -1)+":"+_v3a.addVectors(a,b).add(c).multiplyScalar(1/3).sub(bb_moved_center).normalize().toArray()+'/'+_v3a.subVectors(b,a).cross(_v3b.subVectors(c,a)).normalize().toArray())//face.normal.toArray())
					if ( ! ( side === THREE.FrontSide ? planeSign < 0 : planeSign > 0 ) ) continue;

				}

				faces = []
				if ( face instanceof THREE.Face3 ) {

					faces.push([a,b,c]);

				} else if ( face instanceof THREE.Face4 ) {

					d = vertices[ face.d ];

					faces.push([a,b,d], [b,c,d]);
				}
				else continue

faces.forEach(function (tri) {

bb_list.some(function (bb) {
  if (!collision.isIntersectionTriangleAABB( tri[0], tri[1], tri[2], bb )) {
//if (face.materialIndex==1 && (collision.isIntersectionTriangleAABB(tri[0],tri[2],tri[1], bb) || collision.isIntersectionTriangleAABB(tri[1],tri[0],tri[2], bb) || collision.isIntersectionTriangleAABB(tri[1],tri[2],tri[0], bb) || collision.isIntersectionTriangleAABB(tri[2],tri[0],tri[1], bb) || collision.isIntersectionTriangleAABB(tri[2],tri[1],tri[0], bb))) DEBUG_show(Date.now())
    return true
  }
//if (face.materialIndex==1) { DEBUG_show(f+'/'+Date.now()); console.log(face.normal); }
  face_hit[f] = {}

  var bb0, bb_core, bb_hit, bb_side, bb_side0, bb_plane, bb_plane0, bb_center, bb_size, bb_priority
  if (bb == bb_static) {
    bb0 = bb_static0
    bb_core = bb_core_static
    bb_hit = bb_hit_static
    bb_side  = bb_side_static
    bb_side0 = bb_side_static0
    bb_plane  = bb_plane_static
    bb_plane0 = bb_plane_static0
    bb_center = bb_static_center
    bb_size = bb_static_size
    bb_priority = 1
    bb_static_collided = true
  }
  else {
    bb0 = bb_moved0
    bb_core = bb_core_moved
    bb_hit = bb_hit_moved
    bb_side  = bb_side_moved
    bb_side0 = bb_side_moved0
    bb_plane  = bb_plane_moved
    bb_plane0 = bb_plane_moved0
    bb_center = bb_moved_center
    bb_size = bb_moved_size
    bb_priority = 2
  }

  var blocked, grounded
  var is_flat = _face_grounded(face, 0.5)//0.75)
// c, a, b (correct face normal?)
  if (ray.intersectTriangle( tri[2], tri[0], tri[1], false, _v3a )) {
    if (_v3a.y > ground_y_threshold_upper) {
      if (_v3a.y > bb_core.max.y) {
        blocked_side.set_state.call(blocked_side.y_max, bb_priority, bb.max.y-_v3a.y);
      }
      else blocked = true
    }
    else {
      grounded = true
      ground_y = Math.max(ground_y, _v3a.y)
      if (ground_y == _v3a.y) {
//        ground_pos.copy(_v3a)
        ground_face_index = f
      }
    }
//console.log("A:"+f)
//if (f==173940 || f==173941 || f==173936 || f==173937) console.log("A:"+_v3a.y+','+ground_y+'/'+f)
  }


for (var i_side = 0; i_side < 2; i_side++) {
  var _bb, _bb_plane, _bb_side, _bb_contained
  if (i_side == 1) {
    _bb = bb
    _bb_plane = bb_plane
    _bb_side = bb_side
    _bb_contained = bb_contained
  }
  else {
    _bb = bb0
    _bb_plane = bb_plane0
    _bb_side = bb_side0
    _bb_contained = bb_contained0
  }

  var pts = []
  var v_outside = []
  if (!blocked) {
    tri.some(function (v, idx) {
      if (_bb.containsPoint(v)) {

        if (bb_core.containsPoint(v)) {
          blocked = true
          return true
        }

        pts.push(v.clone())
      }
      else
        v_outside[idx] = true
    });
  }

  if (blocked) {
    blocked_side.set_state.call(blocked_side.blocked, bb_priority, 1, f);
    return
  }

// for simplicity
//  if (grounded) return

  var lines = []
  if (v_outside[0] || v_outside[1])
    lines.push(new THREE.Line3(tri[0], tri[1]))
  if (v_outside[1] || v_outside[2])
    lines.push(new THREE.Line3(tri[1], tri[2]))
  if (v_outside[2] || v_outside[0])
    lines.push(new THREE.Line3(tri[2], tri[0]))

  var side = {
    x_min: []
   ,x_max: []
   ,z_min: []
   ,z_max: []
   ,y_min: []
   ,y_max: []
  };

  lines.forEach(function (line) {
    for (var p in _bb_plane) {
      var v = _bb_plane[p].intersectLine(line)
      if (v)
        side[p].push(v)
    }
  });

  for (var p in side) {
    var sp = side[p]
    if (sp.length < 2) {
      continue
    }

    var hit = 0
    var p2 = []
    sp.forEach(function (v) {
      var _hit
      switch (p) {
        case "x_min":
        case "x_max":
          _hit = (v.y >= _bb.min.y) && (v.y <= _bb.max.y) && (v.z >= _bb.min.z) && (v.z <= _bb.max.z)
          break
        case "z_min":
        case "z_max":
          _hit = (v.y >= _bb.min.y) && (v.y <= _bb.max.y) && (v.x >= _bb.min.x) && (v.x <= _bb.max.x)
          break
        case "y_min":
        case "y_max":
          _hit = (v.z >= _bb.min.z) && (v.z <= _bb.max.z) && (v.x >= _bb.min.x) && (v.x <= _bb.max.x)
          break
      }
      if (_hit) {
        hit++
        p2.push(v)
      }
    });

    if (hit < 2) {
      var xyxy
      switch (p) {
        case "x_min":
        case "x_max":
          xyxy = [sp[0].z,sp[0].y, sp[1].z,sp[1].y]
          break
        case "z_min":
        case "z_max":
          xyxy = [sp[0].x,sp[0].y, sp[1].x,sp[1].y]
          break
        case "y_min":
        case "y_max":
          xyxy = [sp[0].x,sp[0].z, sp[1].x,sp[1].z]
          break
      }

      _bb_side[p].some(function (s) {
        var xy = get_line_intersection(s[0][0],s[0][1], s[1][0],s[1][1], xyxy[0],xyxy[1], xyxy[2],xyxy[3])
        if (!xy)
          return

        var v_new
        switch (p) {
          case "x_min":
            v_new = new THREE.Vector3(_bb.min.x, xy[1], xy[0])
            break
          case "x_max":
            v_new = new THREE.Vector3(_bb.max.x, xy[1], xy[0])
            break
          case "z_min":
            v_new = new THREE.Vector3(xy[0], xy[1], _bb.min.z)
            break
          case "z_max":
            v_new = new THREE.Vector3(xy[0], xy[1], _bb.max.z)
            break
          case "y_min":
            v_new = new THREE.Vector3(xy[0], _bb.min.y, xy[1])
            break
          case "y_max":
            v_new = new THREE.Vector3(xy[0], _bb.max.y, xy[1])
            break
        }

        p2.push(v_new)
        return (++hit == 2)
      });
    }

    if (hit == 2)
      pts.push(p2[0], p2[1])
  }

  if (!pts.length) {
/*
    if (is_flat && !grounded) {
      ray.intersectPlane(_p0.setFromNormalAndCoplanarPoint(face.normal, tri[0]), _v3a)
      if (_v3a && (_v3a.y < _bb.min.y)) {
        ground_y = Math.max(ground_y, _v3a.y)
        if (ground_y == _v3a.y)
          ground_face_index = f
      }
    }
*/
//console.error(f+'/'+hit+'\n'+JSON.stringify(side))
//console.log(JSON.stringify(bb))
//console.log(tri.map(function (v) { return v.toArray().join(",") }).join("/"))
    continue
//    return
  }

  var min = _v3a.copy(pts[0])
  var max = _v3b.copy(pts[0])
  pts.forEach(function (v) {
    min.min(v)
    max.max(v)
  });
  _bb_contained.set(min, max);

// only check ground_y for extended-y bb
if (_bb == bb) {
  if (is_flat && !grounded) {
    if (_bb_contained.max.y < ground_y_threshold) {
      ground_y = Math.max(ground_y, _bb_contained.max.y)
      grounded = true
      if (ground_y == _bb_contained.max.y) {
//        ground_pos.y = ground_y
        ground_face_index = f
      }
    }
    else if (_bb_contained.min.y < ground_y_threshold) {
      ground_y = Math.max(ground_y, ground_y_threshold)
      grounded = true
      if (ground_y == ground_y_threshold)
        ground_face_index = f
    }
  }

  if (bb_priority == 1) {
    pts.forEach(function (v) {
      if ((v.y > ground_plane_y_threshold) && (is_flat || grounded)) {
        var _v = v.clone()
        plane_pts.push(_v)

        if (!plane_pts_by_face_index[f])
          plane_pts_by_face_index[f] = []
        plane_pts_by_face_index[f].push(_v)
      }
    });
  }
}

  var normal_inv = _v3c.copy(face.normal).multiplyScalar(Math.max(bb_size.x, bb_size.z)).negate()
  pts.forEach(function (v) {
    v.add(normal_inv)
    min.min(v)
    max.max(v)
  });
  _bb_contained.set(min, max).intersect(_bb);

  var fh = face_hit[f]
  fh.abc = [face.a, face.b, face.c]
  fh.bb_priority = {}
  fh.bb_priority[bb_priority] = {
    _bb_contained: _bb_contained.clone()
  }

  if (grounded)
    return
  if (_bb_contained.max.y < ground_y)
    return

  var cc
  var info = ""
  var x_contained,  y_contained,  z_contained
  var x_contained2, y_contained2, z_contained2
  var x_edge, y_edge, z_edge

  for (var k = 0; k < 2; k++) {
    if (k == 1) {
//break
      var face_connected = 0
      for (var i in face_hit) {
        fh = face_hit[i]
        var abc = fh.abc
        if (!abc || (i == f) || !fh.bb_priority[bb_priority])
          continue

        if ((abc.indexOf(face.a) == -1) && (abc.indexOf(face.b) == -1) && (abc.indexOf(face.c) == -1))
          continue

        face_connected++
        _bb_contained.union(fh.bb_priority[bb_priority]._bb_contained)
      }
//if (f==173784) console.log(face_connected)
      if (!face_connected)
        break
//      info = f + "/" + face_connected
    }
    else {
//      info = f
    }

    cc = _bb_contained.center(_v3a)
    x_contained = ((cc.x > bb_core.min.x) && (cc.x < bb_core.max.x));
    y_contained = ((cc.y > bb_core.min.y) && (cc.y < bb_core.max.y));
    z_contained = ((cc.z > bb_core.min.z) && (cc.z < bb_core.max.z));

    x_contained2 = x_contained || ((_bb_contained.min.x > bb_hit.min.x) && (_bb_contained.min.x < bb_hit.max.x)) || ((_bb_contained.max.x > bb_hit.min.x) && (_bb_contained.max.x < bb_hit.max.x));
    y_contained2 = (_bb_contained.max.y > ground_y_threshold)// && (y_contained || ((bb_contained.min.y > bb_hit.min.y) && (bb_contained.min.y < bb_hit.max.y)) || ((bb_contained.max.y > bb_hit.min.y) && (bb_contained.max.y < bb_hit.max.y)));
    z_contained2 = z_contained || ((_bb_contained.min.z > bb_hit.min.z) && (_bb_contained.min.z < bb_hit.max.z)) || ((_bb_contained.max.z > bb_hit.min.z) && (_bb_contained.max.z < bb_hit.max.z));

//x_contained2 = y_contained2 = z_contained2 = true
//x_contained2 = z_contained2 = true;

    x_edge = !x_contained// || (((bb_contained.min.x < bb_core.min.x) || (bb_contained.max.x > bb_core.max.x)) )//&& (Math.abs(face.normal.x) > 0.5))
    y_edge = !y_contained// || (((bb_contained.min.y < bb_core.min.y) || (bb_contained.max.y > bb_core.max.y)) )//&& (Math.abs(face.normal.y) > 0.5))
    z_edge = !z_contained// || (((bb_contained.min.z < bb_core.min.z) || (bb_contained.max.z > bb_core.max.z)) )//&& (Math.abs(face.normal.z) > 0.5))

    if (x_edge && y_contained2/* && z_contained2*/)
      blocked_side.set_state.call(blocked_side["x_" + ((cc.x > bb_center.x) ? "max" : "min")], bb_priority, (_bb_contained.max.x-_bb_contained.min.x), info);
    if (x_contained2 && y_edge && z_contained2)
      blocked_side.set_state.call(blocked_side["y_" + ((cc.y > bb_center.y) ? "max" : "min")], bb_priority, (_bb_contained.max.y-_bb_contained.min.y), info);
    if (/*x_contained2 && */y_contained2 && z_edge)
      blocked_side.set_state.call(blocked_side["z_" + ((cc.z > bb_center.z) ? "max" : "min")], bb_priority, (_bb_contained.max.z-_bb_contained.min.z), info);
//if (k==0 && f==3761) info += '\n' + [x_edge,y_edge,z_edge]+'\ncc:\n'+cc.toArray()+'\nbb_core:\n'+bb_core.min.toArray()+'\n'+bb_core.max.toArray()+'\nbb0:\n'+bb0.min.toArray()+'\n'+bb0.max.toArray()+'\nbb_contained0:\n'+bb_contained0.min.toArray()+'\n'+bb_contained0.max.toArray()+'\nrotation:\n'+new THREE.Vector3().setEulerFromQuaternion(THREE.MMD.getModels()[0].mesh.quaternion).multiplyScalar(180/Math.PI).toArray()+'\npts:\n'+pts.map(function(pt){return pt.toArray()}).join("\n")
  }
}
//if (f==3761) DEBUG_show(info + '\n' + Date.now())
});

});

			}

  var hit = 0;
  for (var i in face_hit) hit++;

  var ground_face_connected = []

  if ((ground_face_index != -1) && plane_pts_by_face_index[ground_face_index]) {
    var ground_face = geometry.faces[ground_face_index]
    plane_pts = plane_pts_by_face_index[ground_face_index].slice()

    for (var i in plane_pts_by_face_index) {
      fh = face_hit[i]
      var abc = fh.abc
      if (!abc || (i==ground_face_index))
        continue

      if ((abc.indexOf(ground_face.a) == -1) && (abc.indexOf(ground_face.b) == -1) && (abc.indexOf(ground_face.c) == -1))
        continue

      ground_face_connected.push(i)
      plane_pts = plane_pts.concat(plane_pts_by_face_index[i])
    }

    ground_face_connected.push(ground_face_index)
//ground_face_connected = []
  }

// functionality replaced by .collision_by_mesh_drop_limit
// ground_y below -499 for real is unlikely, passing for now
//  if (ground_y < -499) { ground_y = -999; bb_static_collided = false; }

//blocked_side.info=bb_core_static.max.y+'/'+bb_core_moved.max.y
  return {
    hit:[hit,index_list.length]
   ,updated:(blocked_side._updated || (ground_y > -999) || bb_static_collided)
   ,blocked_side:blocked_side
   ,ground_y:ground_y, ground_face_index:ground_face_index, ground_face_connected:ground_face_connected
   ,bb_static_collided:bb_static_collided
   ,plane_pts:plane_pts
  };

};
  }();

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
    }
    else
      mesh._bone_to_position_last = new BP()

    if (!para_SA.bone_to_position)
      return null

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
      if (para_SA.adjustment_per_model) {
        var motion_para = para_SA.adjustment_per_model[MMD_SA_options.model_para_obj_all[that._model_index]._filename_cleaned] || para_SA.adjustment_per_model._default_
        if (motion_para.skin_default) {
          var motion_adjust = motion_para.skin_default[bone_name] || {}
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
      }
      else {
        mesh.bones_by_name["全ての親"].position.sub((use_bone_rotated_translation) ? bone_pos.applyEuler(_v3a.copy(rot_add).multiplyScalar(Math.PI/180)) : bone_pos)
      }
//DEBUG_show(bone_pos.toArray()+'/'+Date.now())
      mesh._bone_to_position_last.pos_delta.add(pos_delta)
    });

    mesh._bone_to_position_last.pos_delta_rotated.copy(mesh._bone_to_position_last.pos_delta).applyQuaternion(mesh.quaternion)
    return mesh._bone_to_position_last.pos_delta
  };
})();


// use_JSARToolKit START

if (MMD_SA_options.use_JSARToolKit) {
  var AR_obj
  AR_obj = MMD_SA.AR_obj = {
  startup_countdown: 1

 ,TEMP_v3: new THREE.Vector3()
 ,_v3a: new THREE.Vector3()

 ,TEMP_q: new THREE.Quaternion()
 ,_q1: new THREE.Quaternion()
 ,_q2: new THREE.Quaternion()
 ,_q3: new THREE.Quaternion()

 ,TEMP_m4: new THREE.Matrix4()
 ,_m4a: new THREE.Matrix4()
 ,_m4b: new THREE.Matrix4()
  }

  var AR_para = MMD_SA_options.AR_para

// http://ianreah.com/2013/05/26/Augmented-Reality-with-JavaScript-Part-1.html
THREE.Camera.prototype.setJsArMatrix = function (jsArParameters) {
    var matrixArray = new Float32Array(16);
    jsArParameters.copyCameraMatrix(matrixArray, 10, 10000);

    return this.projectionMatrix.set(
        matrixArray[0], matrixArray[4], matrixArray[8],  matrixArray[12],
        matrixArray[1], matrixArray[5], matrixArray[9],  matrixArray[13],
        matrixArray[2], matrixArray[6], matrixArray[10], matrixArray[14],
        matrixArray[3], matrixArray[7], matrixArray[11], matrixArray[15]);
};

THREE.Matrix4.prototype.setJsArMatrix = function (jsArMatrix) {
    return this.set(
         jsArMatrix.m00,  jsArMatrix.m01, -jsArMatrix.m02,  jsArMatrix.m03,
        -jsArMatrix.m10, -jsArMatrix.m11,  jsArMatrix.m12, -jsArMatrix.m13,
         jsArMatrix.m20,  jsArMatrix.m21, -jsArMatrix.m22,  jsArMatrix.m23,
                      0,               0,               0,               1
    );
};

  AR_obj.canvas = document.createElement("canvas")
  AR_obj.canvas.width  = AR_para.video_width
  AR_obj.canvas.height = AR_para.video_height

  AR_obj.raster = new NyARRgbRaster_Canvas2D(AR_obj.canvas);
  AR_obj.param = new FLARParam(AR_obj.canvas.width, AR_obj.canvas.height, 49);
  AR_obj.detector = new FLARMultiIdMarkerDetector(AR_obj.param, AR_para.marker_width);
  AR_obj.detector.setContinueMode(true);

//  AR_obj.resultMat = new NyARTransMatResult();
  AR_obj.markers = {};

  AR_obj.compensationMatrix = new THREE.Matrix4().makeScale(1, 1, -1);  //scale in -z to swap from LH-coord to RH-coord
  AR_obj.compensationMatrix.multiply(new THREE.Matrix4().makeRotationX(THREE.Math.degToRad(90)));  //rotate 90deg in X to get Y-up;
}

// END


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
