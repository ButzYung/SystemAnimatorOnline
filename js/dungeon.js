// (2024-05-18)

MMD_SA_options.Dungeon = (function () {

class Object3D_proxy_base {
  constructor(_parent) {
    this._parent = _parent;
  }

  get #bounding_host() {
return MMD_SA.get_bounding_host(this._parent._obj);
  }

  get boundingSphere() {
return this.#bounding_host.boundingSphere;
  }

  get boundingBox() {
return this.#bounding_host.boundingBox;
  }

  get boundingBox_list() {
return this.#bounding_host.boundingBox_list;
  }
}

function CombatStats(stats) {
  Object.assign(this, stats)

  if (!this.weapon)
    this.weapon = {}
  if (!this.weapon.combo_type_RE)
    this.weapon.combo_type_RE = /bare\-handed|kick/

  if (!this.attack)
    this.attack = {}
  if (this.attack.scale == null)
    this.attack.scale = 1

  if (!this.defense)
    this.defense = {}
  if (this.defense.scale == null)
    this.defense.scale = 1
}

function _jump_physics(s, frame) {
  var t = frame/30

// s = v*t + 0.5*(a)*t^2
// s = v*t + 0.5*(-v/t)*t^2
// s = v*t + 0.5*-v*t
// s/t/0.5 = v
  v =  s/t/0.5
  a = -v/t

  return {v:v, a:a}
}

function AreaDataSaved() {
  this.object_by_index = {}
}

var _bb_xz_factor_ = 0.5

return {
  _bb_xz_factor_:_bb_xz_factor_

 ,Object3D_proxy_base: Object3D_proxy_base

 ,get use_octree() { return true; }//MMD_SA_options.Dungeon_options.use_octree; }

//https://github.com/Matthew-Burfield/random-dungeon-generator
 ,RDG: (function () {
/*
if (xul_mode) {
  var module
//  R("dungeon-generator", function (err, m) {
  R("index.umd", function (err, m) {
    module = m;
  });
console.log(module)
  return module;
}
*/
//return require("index.umd.js");

// https://www.npmjs.com/package/dungeon-generator
return {
//  DG: require("dungeon-generator")
  get DG() { return Dungeon }
 ,dungeon: null
 ,NewDungeon: function (options) {
this.dungeon = new this.DG({
    "size": [options.width, options.height],
    "rooms": {
        "initial": {
            "min_size": [options.minRoomSize, options.minRoomSize],
            "max_size": [options.minRoomSize, options.minRoomSize],
            "max_exits": 1
        },
        "any": {
            "min_size": [options.minRoomSize, options.minRoomSize],
            "max_size": [options.maxRoomSize, options.maxRoomSize],
            "max_exits": 4
        }
    },
    "max_corridor_length": 6,
    "min_corridor_length": 2,
    "corridor_density": 0.5,
    "symmetric_rooms": false,
    "interconnects": 1,
    "max_interconnect_length": 10,
    "room_count": options.DG_room_count || Math.round(Math.sqrt(options.width * options.height) * 0.5)
});

this.dungeon.generate()
console.log(this.dungeon)

var g = []
for (var y = 0, y_max = options.height; y < y_max; y++) {
  g[y] = []
  for (var x = 0, x_max = options.width; x < x_max; x++) {
    g[y][x] = (this.dungeon.walls.get([x,y])) ? 1 : 0
  }
}

var room_index = 2
this.dungeon.children.forEach(function (c, idx) {
  var pos = c.position
  if (c.tag) {
    for (var y = pos[1]+1, y_max = pos[1] + c.size[1]-1; y < y_max; y++) {
      for (var x = pos[0]+1, x_max = pos[0] + c.size[0]-1; x < x_max; x++) {
        g[y][x] = room_index
      }
    }
    room_index++
  }
});

return g
  }
};
  })()

 ,area_id: ""

 ,battle_model_index_list: []

 ,character: {
    pos: null
   ,rot: null
   ,inertia: null
   ,about_turn: false
   ,xy: [-1,-1]
   ,ground_y: 0
   ,ground_normal: null
   ,grounded: false
   ,camera_position_base_default: null
   ,camera_position_base: null
   ,speed_scale: 1
//   ,boundingBox_scale: {x:2, y:1, z:2}

   ,TPS_camera_lookAt_: null

   ,mass: 1

   ,bb_translate: {
      x:0, y:0, z:0.5
     ,_default: {x:0, y:0, z:0.5}
     ,update: function () {
var mesh = THREE.MMD.getModels()[0].mesh
this.z = 0.5 + (MMD_SA.get_bone_position(mesh, (mesh.bones_by_name["上半身2"] && "上半身2") || "上半身", mesh).z - MMD_SA.get_bone_position(mesh, "センター", mesh).z) / (mesh.geometry.boundingSphere.radius * (Math.max(mesh.scale.x, mesh.scale.y, mesh.scale.z) || 1))

var para_SA = MMD_SA.MMD.motionManager.para_SA
if (para_SA.bb_translate && para_SA.bb_translate.limit) {
  if (para_SA.bb_translate.limit.max)
    this.z = Math.min(this.z, para_SA.bb_translate.limit.max.z)
  if (para_SA.bb_translate.limit.min)
    this.z = Math.max(this.z, para_SA.bb_translate.limit.min.z)
}
//DEBUG_show(this.z)
      }
    }

// mainly for .check_collision()
   ,get _obj()  { return THREE.MMD.getModels()[0].mesh; }
   ,get _mesh() { return THREE.MMD.getModels()[0].mesh; }
   ,character_index: 0
   ,_index: -1

   ,TPS_mode: false

   ,_combat_mode: false
   ,get combat_mode() { return this._combat_mode }
   ,set combat_mode(bool) {
bool = !!bool
if (bool == this._combat_mode)
  return

this._combat_mode = bool
var d = MMD_SA_options.Dungeon
if (bool) {
  MMD_SA_options.motion_shuffle_list_default  = MMD_SA_options.Dungeon._motion_shuffle_list_default_combat.slice()
  MMD_SA_options._motion_shuffle_list_default = MMD_SA_options.motion_shuffle_list_default.slice()
  d.key_map_swap(d.key_map_combat)
  MMD_SA._force_motion_shuffle = true

  MMD_SA_options.look_at_screen = false

  if (this.boundingBox_scale)
    this.update_boundingBox(new THREE.Vector3().set(1.0, 1, 1.0).divide(this.boundingBox_scale))
}
else {
  if (d._states.combat) {
    d._states.combat.event_obj.ended_timestamp = Date.now()
    d._states.combat = null
    this.TPS_camera_lookAt_ = null
  }

// If temporary check point is in use, restore the original check points.
  if (d._check_points) {
    d.check_points = d._check_points;
    d._check_points = null;
  }

  MMD_SA_options.motion_shuffle_list_default  = MMD_SA_options.Dungeon._motion_shuffle_list_default.slice()
  MMD_SA_options._motion_shuffle_list_default = MMD_SA_options.motion_shuffle_list_default.slice()
  d.key_map_swap(d.key_map_default)

  MMD_SA_options.look_at_screen = true

  if (this.boundingBox_scale)
    this.update_boundingBox()

  MMD_SA.reset_camera(true)
}
    }

   ,states: {}

   ,pos_update: function () {
var that = this
var d = MMD_SA_options.Dungeon

var model_mesh = THREE.MMD.getModels()[0].mesh
var moved = !model_mesh.position.equals(this.pos)
model_mesh.position.copy(this.pos)

this.rot.set(this.rot.x % (Math.PI*2), this.rot.y % (Math.PI*2), this.rot.z % (Math.PI*2));

for (var i = 1, i_max = d.PC_light_max; i < i_max; i++) {
  var light = MMD_SA.light_list[i]
  light.obj.position.copy(light._pos_base).add(this.pos)

  if (light.obj.target) {
    light.obj.target.position.copy(light._target_pos_base).add(this.pos)
  }
}

d.PC_follower_list.forEach(function (para) {
  var id = para.id
  var obj = para.obj
  if (!obj)
    return

  if (obj.rot_base) {
    obj._obj.rotation.copy(MMD_SA.TEMP_v3.copy(obj.rot_base)).multiplyScalar(Math.PI/180).add(that.rot)
    if (that.about_turn)
      obj._obj.rotation.add(MMD_SA.TEMP_v3.set(0,Math.PI,0))
    obj._obj.quaternion.setFromEuler(obj._obj.rotation)
    if (that.ground_normal && obj.follow_PC_ground_normal) {
      if (!obj._ground_normal)
        obj._ground_normal = new THREE.Vector3(0,1,0)
      if (MMD_SA.TEMP_v3.crossVectors(obj._ground_normal, that.ground_normal).lengthSq() > 0.2*0.2) {
        if (moved)
          obj._ground_normal.lerp(that.ground_normal, 0.1)
      }
      else
        obj._ground_normal.copy(that.ground_normal)
      const ground_q = new THREE.Quaternion().setFromRotationMatrix(MMD_SA.TEMP_m4.lookAt(MMD_SA.TEMP_v3.set(0,0,0), MMD_SA._v3a.set(0,0,-1), obj._ground_normal))

      MMD_SA.TEMP_q.copy(obj._obj.quaternion)
      obj._obj.quaternion.copy(ground_q).multiply(MMD_SA.TEMP_q)
    }
    else
      obj._ground_normal = null
  }

  var pos = obj._obj.position
  para._pos_old = pos.clone()
  pos.copy(obj.pos_base)
  if (obj.rot_base) {
    pos.applyQuaternion(obj._obj.quaternion)
  }
  pos.add(that.pos)
  if (para.grounded) {
    const x = ~~(pos.x/d.grid_size)
    const y = ~~(pos.z/d.grid_size)
    pos.y = d.get_para(x,y,true).ground_y || 0
  }

  para.onupdate && para.onupdate()
});

this.camera_update()
    }

   ,camera_TPS_mode: false
   ,camera_TPS_rot: null
   ,camera_update: (function () {
      var c
      window.addEventListener("MMDStarted", function (e) {
c = MMD_SA_options.Dungeon.character
c.camera_TPS_rot = new THREE.Vector3()
      });

      window.addEventListener("MMDCameraReset", function (e) {
if (!e.detail.enforced) return;

c.camera_TPS_rot.set(0, c.rot.y, 0)
c.camera_update()
      });

      return function () {
var d = MMD_SA_options.Dungeon

var pos = MMD_SA._v3a.copy(this.pos)
if (d.camera_y_default_non_negative)
  pos.y = Math.max(this.pos.y,0)

MMD_SA.TEMP_v3.fromArray(this.camera_position_base)

if (this.camera_TPS_mode) {
  MMD_SA.TEMP_v3.applyEuler(this.camera_TPS_rot)
}
else {
  this.camera_TPS_rot.set(0,0,0)
  MMD_SA.TEMP_v3.applyEuler(this.rot)
}

MMD_SA.TEMP_v3.add(pos)
var blocked = d.check_grid_blocking(MMD_SA.TEMP_v3, d.grid_blocking_camera_offset)

MMD_SA_options.camera_position = pos.toArray()

MMD_SA.TEMP_v3.sub(pos)
MMD_SA_options.camera_position[0] += MMD_SA.TEMP_v3.x
MMD_SA_options.camera_position[1] += MMD_SA.TEMP_v3.y
MMD_SA_options.camera_position[2] += MMD_SA.TEMP_v3.z
//DEBUG_show(MMD_SA_options.camera_position,0,1)

if (blocked) {
  MMD_SA.reset_camera()
}
      };
    })()

   ,hp: 100
   ,hp_max: 100
   ,hp_add: function (num, check_hp) {
if (!num)
  return

var hp_last = this.hp
this.hp += num
if (num > 0) {
  if (this.hp > this.hp_max) {
    this.hp = this.hp_max
  }
}
else {
  if (this.hp <= 0) {
    this.hp = 0
  }
}
MMD_SA_options.Dungeon.update_status_bar()

if (check_hp && check_hp(this))
  return

// default events here
    }

   ,mount_para: null
   ,mount: function (para) {
var d = MMD_SA_options.Dungeon
this.dismount()

this.mount_para = para
if (para.onmount) {
  d.run_event(para.onmount)
}

var target = para.target._obj
d.PC_follower_list.push({
  obj: {
    _obj: target
   ,pos_base: new THREE.Vector3()
   ,rot_base: new THREE.Vector3()
   ,follow_PC_ground_normal: (para.target.use_PC_ground_normal_when_following !== false)
  }
 ,onupdate: para.onupdate
 ,onidle: para.onidle
});

if (para.PC_hidden)
  MMD_SA._skip_render_list.push("#mikuPmx0")
//if (para.speed_scale) this.speed_scale = para.speed_scale;
if (para.camera_position_base)
  this.camera_position_base = para.camera_position_base.slice()
if (para.camera_target_offset)
  MMD_SA.center_view_lookAt_offset = para.camera_target_offset
if (para.mount_position || para.mount_rotation) {
  this._mount_position = function (e) {
    var mesh = e.detail.model.mesh
// use a dummy morph_index (0)
    mesh._bone_morph["全ての親"] = { 0:{ pos_v3:para.mount_position||new THREE.Vector3(), rot_q:(para.mount_rotation && new THREE.Quaternion().setFromEuler(MMD_SA.TEMP_v3.copy(para.mount_rotation).multiplyScalar(Math.PI/180)))||new THREE.Quaternion() } }
  };
  window.addEventListener("SA_MMD_model0_process_bones", this._mount_position);
}

this.pos.copy(target.position)
this.pos_update()
MMD_SA.reset_camera()
    }

   ,dismount: function () {
var para = this.mount_para
if (!para)
  return

var d = MMD_SA_options.Dungeon

if (para.ondismount) {
  d.run_event(para.ondismount)
}

var target = para.target._obj
d.PC_follower_list = d.PC_follower_list.filter(function (p) {
  return (p.obj._obj != target)
});

if (para.PC_hidden) {
  MMD_SA._skip_render_list = MMD_SA._skip_render_list.filter(function (p) {
    return (p != "#mikuPmx0")
  });
}
//if (para.speed_scale) this.speed_scale = 1;
if (para.camera_position_base)
  this.camera_position_base = this.camera_position_base_default.slice()
if (para.camera_target_offset)
  MMD_SA.center_view_lookAt_offset = null
if (para.mount_position || para.mount_rotation) {
  window.removeEventListener("SA_MMD_model0_process_bones", this._mount_position);
  this._mount_position = null
}
if (para.dismount_position) {
  this.pos.add(MMD_SA.TEMP_v3.copy(para.dismount_position).applyQuaternion(THREE.MMD.getModels()[0].mesh.quaternion))
  this.pos_update()
}
MMD_SA.reset_camera()

var saved = MMD_SA_options.Dungeon_options.options_by_area_id[d.area_id]._saved.object_by_index
saved = saved[para.target._index] = saved[para.target._index] || {}
if (!saved.position)
  saved.position = {}
if (!saved.rotation)
  saved.rotation = {}

this.mount_para = null
    }

   ,update_boundingBox: function (scale) {
var model_mesh = THREE.MMD.getModels()[0].mesh
if (!this.boundingBox)
  this.boundingBox = (MMD_SA_options.model_para_obj.boundingBox && new THREE.Box3().set(MMD_SA_options.model_para_obj.boundingBox.min, MMD_SA_options.model_para_obj.boundingBox.max)) || model_mesh.geometry.boundingBox.clone()
model_mesh.geometry.boundingBox = new THREE.Box3().set(this.boundingBox.min, this.boundingBox.max)
model_mesh.geometry.boundingBox_list = [model_mesh.geometry.boundingBox]

if (!scale)
  scale = MMD_SA._v3a.set(1,1,1)
var bb_scale = this.boundingBox_scale || MMD_SA._v3b.set(1,1,1)
var size = this.boundingBox.size(MMD_SA.TEMP_v3)
model_mesh.geometry.boundingBox.expandByVector(new THREE.Vector3(size.x*(bb_scale.x*scale.x-1)*0.5, size.y*(bb_scale.y*scale.y-1)*0.5, size.z*(bb_scale.z*scale.z-1)*0.5))
    }

   ,swap_character: function (character) {
if (character) {
  let is_NPC = (character.object_index != null)

  if (character.character_index != 0) {
    THREE.MMD.swapModels(0, character.character_index, function () {
      if (!is_NPC)
        return

// hide the old mesh
      character._obj_proxy.visible = false
// show the new mesh
      character._obj_proxy.visible = true
    });
  }
}

var para_SA = MMD_SA_options.model_para_obj

if (para_SA.is_PC_candidate) {
  if (!para_SA.character.combat_stats)
    para_SA.character.combat_stats = new CombatStats(para_SA.character.combat_stats_base)
  this.combat_stats_base = para_SA.character.combat_stats_base
  this.combat_stats = para_SA.character.combat_stats

  this.states = {}

  this.assign_keys()
}

if (para_SA._icon_canvas)
  this.icon.getContext("2d").drawImage(para_SA._icon_canvas, 0,0)
MMD_SA_options.Dungeon.update_status_bar(true)

this.update_boundingBox()
    }

   ,assign_keys: function () {
var d = MMD_SA_options.Dungeon;

if (MMD_SA_options.Dungeon_options.combat_mode_enabled) {
  const key_map_new = {};
  Object.keys(d.key_map).filter((k)=>k<10000).forEach((k)=>{key_map_new[k]=d.key_map[k]});
  d.key_map = key_map_new;

  MMD_SA_options.Dungeon_options.attack_combo_list.forEach(function (combo) {
    combo._RE = new RegExp("(^|\\,)" + combo.combo_RE.replace(/\,/g, "\\,") + "(\\,|$)");
    combo._RE_simple = new RegExp("(^|\\,)" + ((/^(123|456|789)$/.test(combo.combo_RE)) ? combo.combo_RE.replace(/123/, "3\\,3").replace(/456/, "6\\,6").replace(/789/, "9\\,9") : combo.combo_RE.replace(/\,/g, "\\,").replace(/[123]+/g, "[123]").replace(/[456]+/g, "[456]").replace(/[789]+/g, "[789]")) + "(\\,|$)");
    d.key_map[combo.keyCode] = { order:combo.keyCode, id:"combo-"+combo.keyCode, type_combat:true, keyCode:combo.keyCode
     ,motion_id: combo.motion_id
    };
  });
}

Object.keys(d.key_map).map((key)=>d.key_map[key]).concat(d.key_map_combat||[]).concat(d.key_map_parry||[]).forEach((function () {
  var p_to_sync = ["combat_para", "mov_speed", "keyCode", "motion_duration"];
  var modes = ["", "TPS_mode"]

  return function (key_map) {
    modes.forEach(function (mode) {
var km = (mode) ? key_map[mode] : key_map;
if (!km)
  return

if (!('motion_filename' in km))
  Object.defineProperty(km, 'motion_filename', { get:function () { return this.motion_id && MMD_SA_options.Dungeon.motion_filename_by_id[this.motion_id]; } });

var para = km.motion_id && d.motion[km.motion_id].para
if (para) {
  para.motion_id = km.motion_id

  if (para.motion_duration_by_combo) {
    para.motion_duration_by_combo.forEach(function (combo) {
      if (combo.combo_RE) {
        combo._RE = new RegExp("^" + combo.combo_RE.replace(/\,/g, "\\,") + "(\\,|$)")
        combo._RE_simple = new RegExp("^" + combo.combo_RE.replace(/\,/g, "\\,").replace(/\d+/g, "\\d") + "(\\,|$)")
      }
    });
  }

  p_to_sync.forEach(function (p) {
    km[p] = para[p] = km[p] || para[p] || key_map[p];
  });

  if (km.motion_duration) {
    para.duration = 10
    para.duration_NPC = km.motion_duration
  }
}
    });
  };
})());

d.key_map_reset()
    }

   ,reset: function () {
if (!this._obj_proxy) this._obj_proxy = new Object3D_proxy_base(this);

this.dismount()

this.ground_obj = null
this.grounded = false
this.floating = false
this.xy = [-1,-1]
this.ground_y = 0
this.ground_normal = null
this.camera_position_base = this.camera_position_base_default.slice()
this.pos = new THREE.Vector3()
this.rot = new THREE.Vector3()
this.inertia = new THREE.Vector3()
this.about_turn = false
this.speed_scale = 1

this.combat_mode = false
this.hp_add(this.hp_max)
this.combat_stats_base = this.combat_stats_base || {}
this.combat_stats = new CombatStats(this.combat_stats_base)

this.states = {}

var model_mesh = THREE.MMD.getModels()[0].mesh
model_mesh.position.set(0,0,0)
model_mesh.quaternion.set(0,0,0,1)

this.update_boundingBox()

for (var i = 1, i_max = MMD_SA_options.Dungeon.PC_light_max; i < i_max; i++) {
  var light = MMD_SA.light_list[i]
  if (!light._pos_base || !(light.obj instanceof THREE.DirectionalLight))
    light._pos_base = light.obj.position.clone()

  if (light.obj.target) {
    if (!light._target_pos_base)
      light._target_pos_base = light.obj.target.position.clone()
//console.log(light._target_pos_base)
  }
}

MMD_SA_options.Dungeon.PC_follower_list.forEach(function (para) {
  var id = para.id
  var obj = para.obj
  if (!obj) {
    obj = para.obj = MMD_SA_options.mesh_obj_by_id[id.substr(1)]
  }
  if (!obj)
    return
  if (!obj.pos_base)
    obj.pos_base = obj._obj.position.clone()
//DEBUG_show(id+':'+obj.pos_base.toArray(),0,1)
});
    }
  }

 ,inventory: (function () {
var inventory;

var INV = function (index, page_index) {
  this.index = index
  this.page_index = page_index

  this.item_id = ""
  this.item = null
  this.stock = 0
};

INV.prototype = {
  constructor: INV

 ,add: function (item_id, stock, swap_if_necessary) {
var item_id_old, stock_old;
if (swap_if_necessary && this.item_id) {
  if (this.item_id != item_id) {
    item_id_old = this.item_id
    stock_old = this.stock
  }
}

this.item = MMD_SA_options.Dungeon.item_base[item_id]
var stock_ini = (this.item_id == item_id) ? this.stock : 0
var stock_added = (this.item.stock_max && (stock + stock_ini > this.item.stock_max)) ? this.item.stock_max - stock_ini : stock
this.stock = stock_ini + stock_added
this.item_id = item_id

if (stock_added)
  this.update_UI()

if (item_id_old) {
  inventory.add(item_id_old, stock_old)
}

return stock - stock_added
  }

 ,clear: function () {
this.item_id = ""
this.item = MMD_SA_options.Dungeon.item_base._empty_
this.stock = 0

this.update_UI()
  }

 ,stock_add: function (num) {
  }

 ,update_info: function (info, display, page_index=inventory.get_page_index(this.index), index) {
if ((page_index > -1) && (page_index != inventory.page_index)) return;

if (index == null)
  index = inventory.get_UI_index(this.index);

const d = document.getElementById("Ldungeon_inventory_item" + index);

let className;
if (info) {
  inventory._item_updated = this;
  className = (display) ? 'Dungeon_inventory_item_info_display' : 'Dungeon_inventory_item_info';
  d.setAttribute("data-info", info);
}
else {
  inventory._item_updated = null;
// not accessing .info directly as it may be a getter function
  if ("info" in this.item) {
    className = 'Dungeon_inventory_item_info';
    d.setAttribute("data-info", this.item.info_short + ':\n' + this.item.info);
  }
  else {
    className = 'Dungeon_inventory_item_info_short';
  }
}
d.setAttribute("data-info_short", this.item.info_short||("Item"+index));

d.className = className;
  }

 ,update_UI: function () {
const page_index = inventory.get_page_index(this.index);
if ((page_index > -1) && (page_index != inventory.page_index)) return;

var index = inventory.get_UI_index(this.index);

var icon = document.getElementById("Ldungeon_inventory_item" + index + "_icon")
icon.src = this.item.icon.src
icon.style.opacity = 1

document.getElementById("Ldungeon_inventory_item" + index + "_border").src = item_border[this.item.rarity].src

var d_stock = document.getElementById("Ldungeon_inventory_item" + index + "_stock")
d_stock.textContent = this.stock
d_stock.style.visibility = (this.stock && (this.item.stock_max != 1)) ? "inherit" : "hidden"

const d = document.getElementById("Ldungeon_inventory_item" + index)

this.update_info(null, false, page_index,index);

d.style.visibility = (this.item.is_always_visible) ? "visible" : "inherit"
  }

 ,action_check: (function () {
    var sound_item_deny = { name:"interface_item_deny" };
    return async function () {
var action = this.item.action
if (!action) {
  MMD_SA_options.Dungeon.sound.audio_object_by_name[((this.item.sound && this.item.sound.find(function(i){return i.is_no_action})) || sound_item_deny).name].play()
  return false
}

if (!action.anytime && inventory.action_disabled) {
  const branch = MMD_SA_options.Dungeon.dialogue_branch_mode?.find(b=>b.is_closing_event);
  if (!branch) {
    MMD_SA_options.Dungeon.sound.audio_object_by_name[sound_item_deny.name].play();
    return false;
  }

  const key = (Array.isArray(branch.key)) ? branch.key[0] : branch.key;
  let code, keyCode;
  if (typeof key == 'number') {
    keyCode = key + 96;
  }
  else if (key == 'Esc') {
    code = 'Escape';
  }
  else {
    code = 'Key' + key;
  }

  document.dispatchEvent(new KeyboardEvent('keydown', { code:code, keyCode:keyCode }));

  await new Promise((resolve)=>{
    System._browser.on_animation_update.add(resolve, 0,0);
  });
}
return true;
    };
  })()
};

var item_border = {}
item_border.inactive = new Image()
System._browser.load_file(System.Gadget.path + '/images/_dungeon/item_icon.zip#/inventory/RarityBorders/mono_L-50_V11.png', item_border.inactive)
item_border.normal = new Image()
System._browser.load_file(System.Gadget.path + '/images/_dungeon/item_icon.zip#/inventory/RarityBorders/monoV11.png', item_border.normal)

var UI_muted;

inventory = {
  max_row: 4
 ,max_base: 8
 ,max_page: 3
 ,list: []

 ,page_index: 0

 ,UI: {
    info: {
      scale: 1.5
    },

    get _muted() { return UI_muted; },
    get muted() { return UI_muted || System._browser.overlay_mode; },
    set muted(v) { UI_muted = v; },
  }

 ,get_UI_index: function (idx) {
return (idx < this.max_base) ? idx : this.max_base + (idx - this.max_base) % (this.max_base*(this.max_row-1));
  }

 ,get_inventory_index: function (idx) {
return ((idx < this.max_base) || (idx > this.max_base * this.max_row)) ? idx : idx + this.page_index * this.max_base * (this.max_row-1);
  }

 ,get_page_index: function (idx) {
return (idx < this.max_base) ? -1 : Math.floor((idx - this.max_base) / (this.max_base*(this.max_row-1)));
  }

// for mobile
 ,_item_selected_index: null
 ,get item_selected_index()  { return this._item_selected_index }
 ,set item_selected_index(v) {
if (!is_mobile)
  return

if (typeof this._item_selected_index === 'number')
  document.getElementById("Ldungeon_inventory_item" + this.get_UI_index(this._item_selected_index)).style.opacity = 1;

if (v)
  v = parseInt(v)
this._item_selected_index = v

if (typeof v === 'number')
  document.getElementById("Ldungeon_inventory_item" + this.get_UI_index(v)).style.opacity = 0.75;
  }

 ,get action_disabled() { return (MMD_SA_options.Dungeon.event_mode); }

 ,initialize: function () {
let count = 0;
for (let i = 0; i < this.max_base; i++)
  this.list.push(new INV(count++, 0))

for (let p = 0; p < this.max_page; p++) {
  for (let r = 1; r < this.max_row; r++) {
    for (let i = 0; i < this.max_base; i++) {
      this.list.push(new INV(count++, p))
    }
  }
}
  }

 ,add: (function () {
var item_id

function filter(inv) {
  return !inv.item_id || (inv.item_id == item_id)
}

function sort(a, b) {
  var a_is_item = (a.item_id == item_id)
  var b_is_item = (b.item_id == item_id)
  if (a_is_item && !b_is_item)
    return -1
  if (!a_is_item && b_is_item)
    return 1
  return a.index - b.index
}

return function (id, stock) {
  item_id = id
  var success = this.list.filter(filter).sort(sort).some(function (inv, idx) {
    stock = inv.add(item_id, stock)
    if (!stock)
      return true
  });
  return success
};
  })()

 ,find: function (item_id, page_index) {
const inv = MMD_SA_options.Dungeon.inventory.list;
const page_size = this.max_base * (this.max_row-1);

let ini, end;
if (page_index == -1) {
  ini = 0;
  end = this.max_base;
}
else if (page_index != null) {
  ini = this.max_base + page_index * page_size;
  end = ini + page_size;
}
else {
  ini = 0;
  end = this.max_base + this.max_page * page_size;
}

for (let i = ini; i < end; i++) {
  if (inv[i].item_id == item_id)
    return inv[i];
}

return null;
  }

 ,unshift: function (source_index, page_index, forced) {
const inv = MMD_SA_options.Dungeon.inventory.list;
const page_size = this.max_base * (this.max_row-1);

let ini, end;
if (page_index == -1) {
  ini = 0;
  end = this.max_base;
}
else if (page_index != null) {
  ini = this.max_base + page_index * page_size;
  end = ini + page_size;
}
else {
  ini = 0;
  end = this.max_base + this.max_page * page_size;
}

let target_index;
for (let i = ini; i < end; i++) {
  if (!inv[i].item_id) {
    target_index = i;
    break;
  }
}

if (target_index != null) {
  this.swap(source_index, target_index);
  return inv[target_index];
}

if (forced)
  return this.unshift(source_index);
  }

 ,copy: function (source_index, target_index) {
this.swap(source_index, target_index, true);
  }

 ,swap: function (source_index, target_index, copy) {
var inv = MMD_SA_options.Dungeon.inventory.list

var inv_source = inv[source_index]
var inv_target = inv[target_index]
var _item_id = inv_source.item_id
var _item = inv_source.item
var _stock = inv_source.stock
if (!copy) {
  inv_source.item_id = inv_target.item_id;
  inv_source.item = inv_target.item;
  inv_source.stock = inv_target.stock;
}

inv_target.item_id = _item_id
inv_target.item = _item
inv_target.stock = _stock

if (!copy)
  inv_source.update_UI();
inv_target.update_UI();
  }

 ,update_page: function (page_index) {
if (this.page_index == page_index) return;
this.page_index = page_index;

var ini = this.max_base + page_index * this.max_base * (this.max_row-1);
var end = ini + this.max_base * (this.max_row-1);
//DEBUG_show(ini+'/'+end,0,1)
for (let i = ini; i < end; i++)
  this.list[i].update_UI();
  }

 ,reset: function () {
var that = this

this.item_selected_index = null

this.list.forEach(function (inv) {
  inv.clear()
});

for (var id in MMD_SA_options.Dungeon.item_base) {
  var item = MMD_SA_options.Dungeon.item_base[id]
  item.reset && item.reset()
  if (item.index_default >= 0) {
    this.list[item.index_default].add(id, item.stock_default||1, true)
  }
  else if (item.stock_default) {
    this.add(id, item.stock_default)
  }
}

var options = MMD_SA_options.Dungeon_options
if (options.inventory && options.inventory.list) {
  options.inventory.list.forEach(function (item) {
if (item.index == null)
  that.add(item.item_id, item.stock)
else
  that.list[item.index].add(item.item_id, item.stock)
  });
}
  }
};

return inventory;
  })()


 ,grid_blocking_camera_offset: 2
 ,grid_blocking_character_offset: 4//3//
 ,check_grid_blocking: (function () {
    var blk_v3
    window.addEventListener("MMDStarted", function () {
blk_v3 = new THREE.Vector3()
    });
    return function (pos, offset, dir) {
var grid_size = this.grid_size

if ((this.ceil_material_index_default != -1) && (pos.y > this.ceil_height - 20)) {
  return true//{ limited:{y:1} }
}
var is_camera = (offset == this.grid_blocking_camera_offset)
var no_ceil_camera_high = (this.ceil_material_index_default == -1) && is_camera && (pos.y > this.ceil_height)

var _x = Math.floor((pos.x) / grid_size)
var _y = Math.floor((pos.z) / grid_size)

var X = {}
var Y = {}
X[_x] = true
Y[_y] = true
X[Math.floor((pos.x+offset) / grid_size)] = true
Y[Math.floor((pos.z+offset) / grid_size)] = true
X[Math.floor((pos.x-offset) / grid_size)] = true
Y[Math.floor((pos.z-offset) / grid_size)] = true

for (var x in X) {
  for (var y in Y) {
    if ((x < 0) || (x >= this.RDG_options.width) || (y < 0) || (y >= this.RDG_options.height) || (!no_ceil_camera_high && (this.grid_array[y][x] == 1))) {
      if (!dir)
        return true
//DEBUG_show(blk_v3.set(_x-x,0,_y-y).dot(dir))
      if (blk_v3.set(_x-x,0,_y-y).dot(dir) < 0)
        return true
    }
    else if (!is_camera && (this.get_ground_y({x:(x*grid_size), y:0, z:(y*grid_size)}, -999) > pos.y+10)) {
//DEBUG_show(pos.y)
      return true// { limited:{y:-1} }
    }
  }
}
    };
  })()

// GOML_dungeon_blocks START
 ,GOML_dungeon_blocks: function () {
var grid_size = this.grid_size
var d_options = this.RDG_options

var geo_dim = {}
var tex_head = ""
var mtl_head = ""
var mesh_scene = ""

var tex_list = [];
var mtl_list = [];
var mesh_scene_list = [];
var geo_list = [];

var use_waveNoiseTexture

var txr_map_id = {}
var txr_normalMap_id = {}
var txr_specularMap_id = {}
var txr_displacementMap_id = {}

var terrain_height_map = {}

var p = this.grid_material_list
for (var i = 0, i_max = p.length; i < i_max; i++) {
  var p_obj = p[i]
  if (p_obj.disabled)
    continue

  if (p_obj.waveBaseSpeed!=null)
    use_waveNoiseTexture = true

//  var repeat = "1 1";//(p_obj.repeat || [1,1]).join(" ");//
  p_obj.map_id = p_obj.map && txr_map_id[p_obj.map]
  if (p_obj.map && (p_obj.map_id == null)) {
    p_obj.map_id = txr_map_id[p_obj.map] = i
//    tex_head +=
//  '<txr id="DungeonPlane'+i+'TXR" src="' + toFileProtocol(p_obj.map) + '" param="repeat:' + repeat + ';" />\n';

    tex_list.push({ tag:'txr', id:'DungeonPlane'+i+'TXR', src:p_obj.map, para:{ repeat:[1,1] } });
  }
  p_obj.normalMap_id = p_obj.normalMap && txr_normalMap_id[p_obj.normalMap];
  if (p_obj.normalMap && (txr_normalMap_id[p_obj.normalMap] == null)) {
    p_obj.normalMap_id = txr_normalMap_id[p_obj.normalMap] = i
//    tex_head +=
//  '<txr id="DungeonPlane'+i+'TXR_N" src="' + toFileProtocol(p_obj.normalMap) + '" param="repeat:' + repeat + ';" />\n';

    tex_list.push({ tag:'txr', id:'DungeonPlane'+i+'TXR_N', src:p_obj.normalMap, para:{ repeat:[1,1] } });
  }
  p_obj.specularMap_id = p_obj.specularMap && txr_specularMap_id[p_obj.specularMap];
  if (p_obj.specularMap && (txr_specularMap_id[p_obj.specularMap] == null)) {
    p_obj.specularMap_id = txr_specularMap_id[p_obj.specularMap] = i
//    tex_head +=
//  '<txr id="DungeonPlane'+i+'TXR_S" src="' + toFileProtocol(p_obj.specularMap) + '" param="repeat:' + repeat + ';" />\n';

    tex_list.push({ tag:'txr', id:'DungeonPlane'+i+'TXR_S', src:p_obj.specularMap, para:{ repeat:[1,1] } });
  }

  if ((p_obj.mirrorTextureIndex!=null) && (!MMD_SA_options.mirror_obj || !MMD_SA_options.mirror_obj[p_obj.mirrorTextureIndex])) {
    console.log("(Mirror-" + p_obj.mirrorTextureIndex + " not found)")
    p_obj.mirrorTextureIndex = null
  }
/*
  var mtl_param_common = ((p_obj.opacity == null)?'transparent:false;':'') + ((p_obj.renderDepth != null)?'renderDepth:'+p_obj.renderDepth+';':'') + ((p_obj.side)?'side:'+p_obj.side+';':'')
+ ((p_obj.map)?'map:#DungeonPlane'+p_obj.map_id+'TXR;':'') + ((p_obj.normalMap)?'normalMap:#DungeonPlane'+p_obj.normalMap_id+'TXR_N;':'') + ((p_obj.ambient)?'ambient:'+p_obj.ambient+';':'')
+ ((p_obj.specularMap)?'specularMap:#DungeonPlane'+p_obj.specularMap_id+'TXR_S;specular:#FFFFFF;':((p_obj.specular)?'specular:'+p_obj.specular+';':'')) + ((p_obj.emissive)?'emissive:'+p_obj.emissive+';':'')
+ ((p_obj.mirrorTextureIndex!=null)?'mirrorTextureIndex:'+(p_obj.mirrorTextureIndex)+';':'') + ((p_obj.waveBaseSpeed!=null)?'waveBaseSpeed:'+(p_obj.waveBaseSpeed)+';':'')
+ ((typeof p_obj.uniTexture=='object')?'uniTexture:{'+encodeURIComponent(JSON.stringify(p_obj.uniTexture).replace(/^\{/,'').replace(/\}$/,''))+'};':'');
*/
  var mtl_param_common = {};
  if (p_obj.opacity == null) mtl_param_common.transparent = false;
//'renderOrder' : 'renderDepth'
  if (p_obj.renderDepth != null) mtl_param_common.renderDepth = p_obj.renderDepth;
  if (p_obj.side) mtl_param_common.side = p_obj.side;
  if (p_obj.map) mtl_param_common.map = 'DungeonPlane'+p_obj.map_id+'TXR';
  if (p_obj.normalMap) mtl_param_common.normalMap = 'DungeonPlane'+p_obj.normalMap_id+'TXR_N';
//'color' : 'ambient'
  if (p_obj.ambient) mtl_param_common.ambient = p_obj.ambient;
  if (p_obj.specularMap) {
    mtl_param_common.specularMap = 'DungeonPlane'+p_obj.specularMap_id+'TXR_S';
    mtl_param_common.specular = '#FFFFFF';
  }
  else {
    if (p_obj.specular) mtl_param_common.specular = p_obj.specular;
  }
  if (p_obj.emissive) mtl_param_common.emissive = p_obj.emissive;

  var mtl_param_common_extra = {};
  if (p_obj.mirrorTextureIndex!=null) mtl_param_common_extra.mirrorTextureIndex = p_obj.mirrorTextureIndex;
  if (p_obj.waveBaseSpeed!=null) mtl_param_common_extra.waveBaseSpeed = p_obj.waveBaseSpeed;
  if (typeof p_obj.uniTexture=='object') mtl_param_common_extra.uniTexture = p_obj.uniTexture;

  if (p_obj.displacementMap || p_obj.random_terrain) {
    var d_map_id, d_map_draw
    if (p_obj.random_terrain) {
      d_map_id = p_obj.random_terrain.id
      var t_map = terrain_height_map[d_map_id]
      if (!t_map) {
var w = p_obj.random_terrain.width
var h = p_obj.random_terrain.height
var terrain = generateTerrain(w-1, h-1, p_obj.random_terrain.smoothness||1)
//console.log(terrain)
var z_min = 1
var z_max = -1
terrain.forEach(function (x) {
  x.forEach(function (z) {
    z_min = Math.min(z, z_min)
    z_max = Math.max(z, z_max)
  });
});
var z_scale = z_max - z_min
//console.log(z_min+'/'+z_max + '/' + z_scale)
var canvas = document.createElement("canvas")
canvas.width  = w
canvas.height = h
var ctx = canvas.getContext("2d")
var image_data = ctx.getImageData(0,0,w,h)//ctx.createImageData(w,h)
var data = image_data.data
for (var y = 0; y < h; y++) {
  for (var x = 0; x < w; x++) {
    var index = (y*w + x) * 4
    data[index+0] = data[index+1] = data[index+2] = ~~((terrain[y][x] - z_min) / z_scale * 255)//random(256)//
    data[index+3] = 255
  }
}
//console.log(image_data)
ctx.putImageData(image_data, 0,0)
//console.log(ctx.getImageData(0,0,w,h))

var canvas_d = canvas
/*
canvas_d = document.createElement("canvas")
canvas_d.width  = w*2
canvas_d.height = h*2
var ctx_d = canvas_d.getContext("2d")

ctx_d.drawImage(canvas, 0,0)

ctx_d.save();
ctx_d.scale(-1, 1);
ctx_d.drawImage(canvas, -w*2,0);
ctx_d.scale( 1, -1);
ctx_d.drawImage(canvas, -w*2,-h*2);
ctx_d.scale(-1, 1);
ctx_d.drawImage(canvas,    0,-h*2);
ctx_d.restore();

image_data = ctx_d.getImageData(0,0,canvas_d.width,canvas_d.height);
*/
t_map = terrain_height_map[d_map_id] = {
  image_data: image_data
}

d_map_draw = true
p_obj.displacementMap = canvas_d.toDataURL()
      }
      else {
// dummy
        p_obj.displacementMap = d_map_id
      }

      p_obj.random_terrain.image_data = t_map.image_data

      p_obj.uDisplacementCustomUVScale = 1 / (p_obj.random_terrain.divider||1)
      p_obj.uDisplacementBias =  p_obj.random_terrain.height_bias  || -32
      p_obj.uDisplacementScale = p_obj.random_terrain.height_scale || 64
    }
    else {
      d_map_id = txr_displacementMap_id[p_obj.displacementMap]
      if (!d_map_id) {
        d_map_id = txr_displacementMap_id[p_obj.displacementMap] = i
        d_map_draw = true
      }
    }

    p_obj.displacementMap_id = d_map_id
    if (d_map_draw) {
//      tex_head +=
//  '<txr id="DungeonPlane'+d_map_id+'TXR_D" src="' + toFileProtocol(p_obj.displacementMap) + '" param="repeat:' + repeat + ';" />\n';
      tex_list.push({ tag:'txr', id:'DungeonPlane'+d_map_id+'TXR_D', src:p_obj.displacementMap, para:{ repeat:[1,1] } });
    }
//    mtl_head +=
//  '<mtl id="DungeonPlane'+i+'MTL_D" type="MeshPhong" param="'
// + mtl_param_common + ('displacementMap:#DungeonPlane'+d_map_id+'TXR_D;uDisplacementScale:'+(p_obj.uDisplacementScale||1)+';uDisplacementBias:'+(p_obj.uDisplacementBias||0)+';uDisplacementCustomUVScale:'+(p_obj.uDisplacementCustomUVScale||0)+';')+ '" />\n';
    const mtl_para = Object.assign({ displacementMap:'DungeonPlane'+d_map_id+'TXR_D', uDisplacementScale:p_obj.uDisplacementScale||1, uDisplacementBias:p_obj.uDisplacementBias||0 }, mtl_param_common);
    const mtl_para_extra = Object.assign({ uDisplacementCustomUVScale:p_obj.uDisplacementCustomUVScale||0 }, mtl_param_common_extra);
    mtl_list.push({ tag:'mtl', id:'DungeonPlane'+i+'MTL_D', type:'MeshPhong', para:mtl_para, para_extra:mtl_para_extra });
  }

//  mtl_head +=
//  '<mtl id="DungeonPlane'+i+'MTL" type="MeshPhong" param="' + mtl_param_common + '" />\n';
  mtl_list.push({ tag:'mtl', id:'DungeonPlane'+i+'MTL', type:'MeshPhong', para:mtl_param_common, para_extra:mtl_param_common_extra });

  for (var lvl = 0, lvl_max = p_obj.geo_by_lvl.length; lvl < lvl_max; lvl++) {
    var geo = p_obj.geo_by_lvl[lvl]
    var geo_id = geo[0]+"x"+geo[1]
    geo_dim[geo_id] = true
    var instanced_drawing = (p_obj.instanced_drawing_by_lvl && p_obj.instanced_drawing_by_lvl[lvl]) || 0;
//    mesh_scene +=
//  '<mesh id="DungeonPlane'+i+'MESH_LV'+lvl+'" geo="#DungeonGEO_'+geo_id+'" mtl="#DungeonPlane'+i+'MTL' + ((p_obj.displacementMap && (geo_id != "1x1"))?'_D':'') + '" '
//+ ((instanced_drawing)?'instanced_drawing="'+instanced_drawing+'" ':'') + 'style="scale:0;' + ((p_obj.opacity != null)?'opacity:'+p_obj.opacity+';':'') + '" />\n';
    mesh_scene_list.push({ tag:'mesh', id:'DungeonPlane'+i+'MESH_LV'+lvl, geo:'DungeonGEO_'+geo_id, mtl:'DungeonPlane'+i+'MTL' + ((p_obj.displacementMap && (geo_id != "1x1"))?'_D':''), instanced_drawing:instanced_drawing||null, style:{ scale:0, opacity:p_obj.opacity||null } });
    MMD_SA_options.mesh_obj.push( { id:'DungeonPlane'+i+'MESH_LV'+lvl } );
  }
}

if (use_waveNoiseTexture) {
//    tex_head +=
//  '<txr id="waveNoiseTexture" src="' + toFileProtocol(System.Gadget.path + "/images/watershader_cloud.png") + '" />\n';
    tex_list.push({ tag:'txr', id:'waveNoiseTexture', src:System.Gadget.path + "/images/watershader_cloud.png", para:{} });
}

for (var geo in geo_dim) {
  if (/^(\d+)x(\d+)$/.test(geo)) {
//    MMD_SA_options.GOML_head +=
//  '<geo id="DungeonGEO_' + (geo) + '" type="Plane" param="' + [1,1, parseInt(RegExp.$1),parseInt(RegExp.$2)].join(" ") + '" />\n';
    geo_list.push({ tag:'geo', id:'DungeonGEO_' + (geo), type:'Plane', para:[1,1, parseInt(RegExp.$1),parseInt(RegExp.$2)] });
  }
}

MMD_SA_options.GOML_head +=
  tex_head
+ mtl_head;

MMD_SA_options.GOML_scene +=
  ((MMD_SA_options.Dungeon_options.use_point_light==false) ? '' : '<light id="pointlight_main" type="Poi" style="lightIntensity: 1.0; lightDistance: ' + (0) + '; position: ' + ([0,0,0].join(" ")) + '; lightColor:#ffffff;" />\n')
+ mesh_scene;

MMD_SA_options.GOML_head_list = (MMD_SA_options.GOML_head_list||[]).concat(tex_list, geo_list, mtl_list);
MMD_SA_options.GOML_scene_list = (MMD_SA_options.GOML_scene_list||[]).concat(mesh_scene_list);

//console.log(MMD_SA_options.GOML_head)
//console.log(MMD_SA_options.GOML_scene)
  }

 ,get_ground_y: (function () {
// http://strauss.pas.nu/js-bilinear-interpolation.html

    // compute vector index from matrix one
    function ivect(ix, iy, w) {
        // byte array, r,g,b,a
        return((ix + w * iy) * 4);
    }

    function bilinear(srcImg, destImg, scale) {
        // c.f.: wikipedia english article on bilinear interpolation
        // taking the unit square, the inner loop looks like this
        // note: there's a function call inside the double loop to this one
        // maybe a performance killer, optimize this whole code as you need
        function inner(f00, f10, f01, f11, x, y) {
            var un_x = 1.0 - x; var un_y = 1.0 - y;
            return (f00 * un_x * un_y + f10 * x * un_y + f01 * un_x * y + f11 * x * y);
        }
        var i, j;
        var iyv, iy0, iy1, ixv, ix0, ix1;
        var idxD, idxS00, idxS10, idxS01, idxS11;
        var dx, dy;
        var r, g, b, a;
        for (i = destImg.y; i < destImg.y+10; ++i) {
            iyv = i / scale;
            iy0 = Math.floor(iyv);
            // Math.ceil can go over bounds
            iy1 = ( Math.ceil(iyv) > (srcImg.height-1) ? (srcImg.height-1) : Math.ceil(iyv) );
            for (j = destImg.x; j < destImg.x+10; ++j) {
                ixv = j / scale;
                ix0 = Math.floor(ixv);
                // Math.ceil can go over bounds
                ix1 = ( Math.ceil(ixv) > (srcImg.width-1) ? (srcImg.width-1) : Math.ceil(ixv) );
                idxD = ivect(j-destImg.x, i-destImg.y, destImg.width);
                // matrix to vector indices
                idxS00 = ivect(ix0, iy0, srcImg.width);
                idxS10 = ivect(ix1, iy0, srcImg.width);
                idxS01 = ivect(ix0, iy1, srcImg.width);
                idxS11 = ivect(ix1, iy1, srcImg.width);
                // overall coordinates to unit square
                dx = ixv - ix0; dy = iyv - iy0;
                // I let the r, g, b, a on purpose for debugging
                r = inner(srcImg.data[idxS00], srcImg.data[idxS10],
                    srcImg.data[idxS01], srcImg.data[idxS11], dx, dy);
                destImg.data[idxD] = r;
/*
                g = inner(srcImg.data[idxS00+1], srcImg.data[idxS10+1],
                    srcImg.data[idxS01+1], srcImg.data[idxS11+1], dx, dy);
                destImg.data[idxD+1] = g;

                b = inner(srcImg.data[idxS00+2], srcImg.data[idxS10+2],
                    srcImg.data[idxS01+2], srcImg.data[idxS11+2], dx, dy);
                destImg.data[idxD+2] = b;

                a = inner(srcImg.data[idxS00+3], srcImg.data[idxS10+3],
                    srcImg.data[idxS01+3], srcImg.data[idxS11+3], dx, dy);
                destImg.data[idxD+3] = a;
*/
            }
        }
    }

    var dummy_destImg = { width:10, height:10, data:[] }

    return function (pos, fixed_value_for_random_terrain) {
var x = ~~(pos.x/this.grid_size)
var y = ~~(pos.z/this.grid_size)
var grid_para = this.get_para(x,y, true)

var ground_y = grid_para.ground_y || 0

var material_id = grid_para.floor_material_index
if (material_id == null)
  material_id = this.floor_material_index_default
if (material_id == -1)
  return ground_y

var p_obj = this.grid_material_list[material_id]
if (!p_obj.random_terrain)
  return ground_y

if (fixed_value_for_random_terrain != null)
  return fixed_value_for_random_terrain

var image_data = p_obj.random_terrain.image_data
var xx =                   (((x % p_obj.random_terrain.divider) + ((pos.x - x*this.grid_size)/this.grid_size))*p_obj.uDisplacementCustomUVScale * image_data.width)//    - 0.5
// y inverted
var yy_offset = p_obj.random_terrain.divider-(y % p_obj.random_terrain.divider)
// clumsy, but it works lol
if (yy_offset == p_obj.random_terrain.divider)
  yy_offset = 0
var yy = image_data.height-((yy_offset + (1-(pos.z - y*this.grid_size)/this.grid_size))*p_obj.uDisplacementCustomUVScale * image_data.height)// - 0.5
/*
if (yy < 0) {
DEBUG_show(y + "/" + (pos.z/this.grid_size) + "/" + (yy/image_data.height) + " - " + Date.now());
yy+=image_data.height;
//yy = Math.abs(yy);
}
else {
DEBUG_show(y + "/" + (pos.z/this.grid_size) + "/" + (yy/image_data.height) + " - " + Date.now());
}
*/
dummy_destImg.x = (~~xx)*10
dummy_destImg.y = (~~yy)*10
bilinear(image_data, dummy_destImg, 10)
var height = dummy_destImg.data[(~~((yy%1)*10)*10+(~~((xx%1)*10)))*4]
//DEBUG_show([x,y]+'\n'+[xx+0.5,yy+0.5]+'\n'+[(pos.x - x * this.grid_size) / this.grid_size,(pos.z - y * this.grid_size) / this.grid_size]+'\n'+[height_by_x, height_by_y])
ground_y += p_obj.uDisplacementBias + (height/255) * p_obj.uDisplacementScale

return ground_y
    };
  })()

 ,get_para: (function () {
var dummy = {}
return function (x,y, full) {
  var ro = this.RDG_options
  if (x<0 || x>=ro.width || y<0 || y>= ro.height)
    return dummy

  var grid_id = this.grid_array[y][x]
  if (full) {
    return Object.assign({}, (this.para_by_map && this.para_by_map(x,y))||dummy, this.para_by_grid_id[grid_id]||dummy, this.para_by_xy[x+"x"+y]||dummy)
  }

  return this.para_by_xy[x+"x"+y] || this.para_by_grid_id[grid_id] || (this.para_by_map && this.para_by_map(x,y)) || dummy
};
  })()

 ,update_dungeon_blocks: (function () {
var that
var grid_size, c
var view_radius, radius_sq, d_options, w, h, d

// directions are "inverted" on the default camera view (i.e. looking at the character's back)
var TRBL = [
  { id:"T", id_opposite:"B", xy:[ 0,-1], rotY: Math.PI*1, posXZ:[0.5,0], curved_out:[[ 1,-1],[-1,-1]], curved_in:[1,3] }
 ,{ id:"R", id_opposite:"L", xy:[ 1, 0], rotY: Math.PI/2, posXZ:[1,0.5], curved_out:[[ 1, 1],[ 1,-1]], curved_in:[2,0] }
 ,{ id:"B", id_opposite:"T", xy:[ 0, 1], rotY: Math.PI*0, posXZ:[0.5,1], curved_out:[[-1, 1],[ 1, 1]], curved_in:[3,1] }
 ,{ id:"L", id_opposite:"R", xy:[-1, 0], rotY:-Math.PI/2, posXZ:[0,0.5], curved_out:[[-1,-1],[-1, 1]], curved_in:[0,2] }
];

TRBL.forEach(function (dir) {
  dir.rotY_q = [0,Math.sin(dir.rotY/2),0,Math.cos(dir.rotY/2)]
});

var flat_rotX_q = [Math.sin((-Math.PI/2)/2),0,0,Math.cos((-Math.PI/2)/2)]

var no_wall

function is_visible_wall(x, y) {
  if (d[y][x] == 1) {
    return true
  }

  if (1||no_wall) return false

  var is_hidden_door = false
  if (d[y][x] == 0) {
    is_hidden_door = TRBL.some(function (dir) {
      var _x = x + dir.xy[0]
      var _y = y + dir.xy[1]
      if ((_y < 0) || (_y >= h) || (_x < 0) || (_x >= w))
        return false

      var room_id = d[_y][_x]
      if (room_id > 1) {
        return true
      }
      return false
    });
  }

  return is_hidden_door
}

var v3a
window.addEventListener("MMDStarted", function () {
  v3a = new THREE.Vector3()
});

//var released_count = 0
var grid_cache = {
  xy: {}

 ,release: function (xy, visibility_kept) {
    if (!this.xy[xy])
      return

    this.xy[xy].forEach(function (cache) {
      if (!visibility_kept)
        cache.list[cache.index].visible = false
      cache.obj[(cache.list==cache.obj.list)?"reusable_list":"reusable_list_material_cloned"].push(cache.index)
//released_count++
    });

    delete this.xy[xy]
//DEBUG_show(MMD_SA.scene.children.length+'\n'+released_count+'\n'+Date.now())
  }

 ,release_outdated: function () {
    MMD_SA_options.Dungeon.grid_material_list.forEach(function (p_obj) {
      if (p_obj.disabled || (p_obj.lvl.length == 1))
        return

      p_obj.lvl.forEach(function (obj) {
        obj.reusable_list.forEach(function (index) {
          obj.list[index].visible = false
        });
        obj.reusable_list_material_cloned.forEach(function (index) {
          obj.list_material_cloned[index].visible = false
        });
      });
    });

    var timestamp
    for (var xy in this.xy) {
      timestamp = this.xy[xy][0].RAF_timestamp
      if (timestamp != RAF_timestamp)
        this.release(xy, (timestamp == -1))
    }
  }

 ,add: function (xy, obj, list, index) {
    var cache = this.xy[xy] = this.xy[xy] || [];

    cache.push({ obj:obj, list:list, index:index });

    if ((obj.lvl_max > 1) || (cache[0].RAF_timestamp == -1)) {
// invalidate this grid cache, and make the cached objects reusable after .release_outdated at the end
      cache[0].RAF_timestamp = -1
    }
    else
      this.update_timestamp(xy)
  }

 ,update_timestamp: function (xy) {
    this.xy[xy][0].RAF_timestamp = RAF_timestamp
  }
};
window.addEventListener("SA_Dungeon_after_map_generation", function () {
  grid_cache.xy = {}
});

return function (forced) {
  that = this

  c = this.character

  grid_size = this.grid_size
  view_radius = this.view_radius
  radius_sq = view_radius * view_radius

  var xx = ~~(c.pos.x/grid_size)
  var yy = ~~(c.pos.z/grid_size)

  var compass = Cdungeon_map_compass_canvas.getContext("2d")
//  compass.globalAlpha = 0.5
  compass.globalCompositeOperation = "copy";
  compass.fillStyle = "rgba(255,255,255, 0.4)";

  compass.translate(16,16)
  compass.rotate(-c.rot.y + ((!c.about_turn)?Math.PI:0))
  compass.translate(-16,-16)

  compass.beginPath()
  compass.moveTo(16,0)
  compass.lineTo(10,32-8)
  compass.lineTo(32-10,32-8)
  compass.closePath()
  compass.fill()

  compass.setTransform(1, 0, 0, 1, 0, 0);

  var map_display_scale = this.map_display_scale
  if (MMD_SA_options.Dungeon_options.multiplayer) {
    let length = view_radius * grid_size
    let lengthSq = length * length
    for (var i = 1, i_max = MMD_SA_options.Dungeon_options.multiplayer.OPC_list.length; i <= i_max; i++) {
      let ds = document.getElementById("Ldungeon_map_spot_OPC" + i).style
      let OPC_index = i-1 + MMD_SA_options.Dungeon_options.multiplayer.OPC_index0
      let OPC_mesh = THREE.MMD.getModels()[OPC_index].mesh
      if (OPC_mesh.visible) {
        ds.posLeft = 8+ ~~(OPC_mesh.position.x/grid_size)*map_display_scale + ~~(map_display_scale/4)
        ds.posTop  = 8+ ~~(OPC_mesh.position.z/grid_size)*map_display_scale + ~~(map_display_scale/4)
        ds.visibility = "inherit"
      }
      else
        ds.visibility = "hidden"

      let id = this.object_id_translated["OPC-"+(i-1)]
      if (!/^object(\d+)_(\d+)$/.test(id))
        continue
      let obj_base_index = parseInt(RegExp.$1)
      let obj_base = this.object_base_list[obj_base_index]
      let obj = obj_base.object_list[parseInt(RegExp.$2)]

      if (obj._obj_proxy.hidden)
        continue
      let cache = obj._obj
      let d_sq = cache.position.distanceToSquared(c.pos)
      obj._obj_proxy.visible = (d_sq < (lengthSq * obj.view_distance_sq))
    }
  }

  var _xx = c.xy[0]
  var _yy = c.xy[1]
  if (!forced && (_xx == xx) && (_yy == yy)) return
  c.xy = [xx, yy]

  window.dispatchEvent(new CustomEvent("SA_Dungeon_update_dungeon_blocks"));

  var grid_para_last = this.get_para(_xx, _yy, true)
  var grid_para_now  = this.get_para( xx,  yy, true)

  d = this.grid_array
  var c_grid_id = d[yy][xx]
  var grid_id_changed = (_xx == -1) || (d[_yy][_xx] != c_grid_id)
//  var grid_para_changed = grid_id_changed || (grid_para_last.id != grid_para_now.id)

  if (grid_para_last.onexit && grid_para_last.onexit({x:_xx, y:_yy, grid_id_changed:grid_id_changed})) return
  if (grid_para_now.onenter && grid_para_now.onenter({x:xx,  y:yy,  grid_id_changed:grid_id_changed})) return

  d_options = this.RDG_options
  w = d_options.width
  h = d_options.height

  var p = this.grid_material_list
  var m = this.map_grid_drawn
  var context = Cdungeon_map_canvas.getContext("2d")

  Ldungeon_map_spot.style.posLeft = 8+ xx*map_display_scale + ~~(map_display_scale/4)
  Ldungeon_map_spot.style.posTop  = 8+ yy*map_display_scale + ~~(map_display_scale/4)

  Cdungeon_map_compass_canvas.style.posLeft = Ldungeon_map_spot.style.posLeft - 16 + (Ldungeon_map_spot.style.pixelWidth  - 1) * 0.5
  Cdungeon_map_compass_canvas.style.posTop  = Ldungeon_map_spot.style.posTop  - 16 + (Ldungeon_map_spot.style.pixelHeight - 1) * 0.5

  no_wall = this.para_by_grid_id[1] && this.para_by_grid_id[1].hidden_on_map
//DEBUG_show(c.xy+'/'+no_wall+'\n'+(this.get_para(xx,yy,true).map_grid_color||""))
  var mirror_active = {}

//var grid_cache_hit = 0
  for (var y = yy - view_radius, y_max = yy + view_radius; y < y_max; y++) {
    if ((y < -1) || (y >= h+1))
      continue

    for (var x = xx - view_radius, x_max = xx + view_radius; x < x_max; x++) {
      if ((x < -1) || (x >= w+1))
        continue
      var xy = x + "x" + y
      if ((x-xx)*(x-xx)+(y-yy)*(y-yy) > radius_sq) {
//p[material_id].lvl[lvl]
        grid_cache.release(xy)
        continue
      }

      var grid_id = ((y>=0) && (y<h) && (x>=0) && (x<w)) ? d[y][x] : 1
      if ((y>=0) && (y<h) && (x>=0) && (x<w) && !m[y][x]) {
        var is_hidden_door = ((grid_id == 0) && is_visible_wall(x,y))
        if (no_wall || (grid_id == c_grid_id) || ((grid_id == 0) && !is_hidden_door)) {
          var draw_grid = false
          if (!no_wall && (grid_id == 0) && (Math.abs(x-xx)+Math.abs(y-yy) > 1)) {
            draw_grid = TRBL.some(function (dir, idx) {
              var _x = x + dir.xy[0]
              var _y = y + dir.xy[1]
              if ((_y < 0) || (_y >= h) || (_x < 0) || (_x >= w) || (d[_y][_x] != c_grid_id) || (d[_y][_x] == 0))
                return false
              return true
            });
          }
          else
            draw_grid = true

          if (draw_grid) {
            m[y][x] = true
            if (!is_hidden_door) {
              context.fillStyle = this.get_para(x,y,true).map_grid_color || "green"
              context.fillRect(x*map_display_scale,y*map_display_scale, map_display_scale,map_display_scale)
            }
          }
        }
      }

      if (grid_cache.xy[xy]) {
//grid_cache_hit++
//DEBUG_show(xy,0,1)
        grid_cache.update_timestamp(xy)
        continue
      }

      var p_obj
      var obj_y_extended
      var ground_y = this.get_para(x,y,true).ground_y || 0
      var ground_y_visible = this.get_para(x,y,true).ground_y_visible || 0
      if ((y < 0) || (y >= h) || (x < 0) || (x >= w) || (is_visible_wall(x,y) && (x!=xx || y!=yy))) {
        var has_visible_plane
        var _TRBL = []
        var _TRBL_grid_para = []
        TRBL.forEach(function (dir, idx) {
          var _x = x + dir.xy[0]
          var _y = y + dir.xy[1]
          if ((_y < 0) || (_y >= h) || (_x < 0) || (_x >= w) || (d[_y][_x]==1))//is_visible_wall(_x,_y))//
            return

          var grid_para = _TRBL_grid_para[idx] = that.get_para(_x, _y)
          if (grid_para.no_wall && (grid_para.no_wall.all || grid_para.no_wall[dir.id_opposite])) {
            return
          }

          _TRBL[idx] = has_visible_plane = true
        });
        if (!has_visible_plane)
          continue

        var lvl_by_material_id = []
        var dis = Math.max(Math.abs(x-xx), Math.abs(y-yy))

        TRBL.forEach(function (dir, idx) {
          if (!_TRBL[idx])
            return
//if (idx > 1) return
          var _x, _y

          var grid_para = _TRBL_grid_para[idx]
          var material_id = grid_para.wall_material_index
          if (material_id == null)
            material_id = that.wall_material_index_default
          if (material_id == -1)
            return

          p_obj = p[material_id].init()

          var lvl = lvl_by_material_id[material_id]
//          if (lvl == null) lvl = grid_para.geo_lvl
          if (lvl == null) {
            lvl = p_obj.geo_by_lvl.length-1
            for (var i = 0, i_max = p_obj.distance_by_lvl.length; i < i_max; i++) {
              if (dis <= p_obj.distance_by_lvl[i])
                break
              lvl--
            }
            lvl_by_material_id[material_id] = lvl
          }
//DEBUG_show(material_id+'/'+lvl,0,1)
//curved_in, curved_out
var L_curved, R_curved, cout_xy
var geo_by_lvl = p_obj.geo_by_lvl[lvl]
if ((geo_by_lvl[0] > 1) || (geo_by_lvl[1] > 1)) {
  cout_xy = dir.curved_out[0]
  _x = x + cout_xy[0]
  _y = y + cout_xy[1]
  if ((_y < 0) || (_y >= h) || (_x < 0) || (_x >= w) || is_visible_wall(_x,_y)) {
    L_curved = -Math.PI/4
//if (xx==0&&yy==0) DEBUG_show("L-out-"+dir.id+":"+[x,y],0,1)
  }
  else if (_TRBL[dir.curved_in[0]]) {
    L_curved = Math.PI/4
//DEBUG_show("L-in-"+dir.id+":"+[x,y],0,1)
  }

  cout_xy = dir.curved_out[1]
  _x = x + cout_xy[0]
  _y = y + cout_xy[1]
  if ((_y < 0) || (_y >= h) || (_x < 0) || (_x >= w) || is_visible_wall(_x,_y)) {
    R_curved = Math.PI/4
//if (xx==0&&yy==0) DEBUG_show("R-out-"+dir.id+":"+[x,y],0,1)
  }
  else if (_TRBL[dir.curved_in[1]]) {
    R_curved = -Math.PI/4
//DEBUG_show("R-in-"+dir.id+":"+[x,y],0,1)
  }
}

          var obj = p_obj.lvl[lvl]
          var plane
          if ((L_curved || R_curved) && (p_obj.geo_by_lvl[lvl] != "1x1")) {
            plane = obj.get_obj(obj.list_material_cloned)
            grid_cache.add(xy, obj, obj.list_material_cloned, plane[1])
            plane = plane[0]
          }
          else {
            plane = obj.get_obj(obj.list)
            grid_cache.add(xy, obj, obj.list, plane[1])
            plane = plane[0]
          }

          plane.scale.set(grid_size,grid_size,grid_size)
          plane.position.set((x+dir.posXZ[0])*grid_size, grid_size*0.5, (y+dir.posXZ[1])*grid_size)
//          plane.rotation.set(0,dir.rotY,0)
          plane.quaternion.fromArray(dir.rotY_q)
          plane.material.edgeRotateDisplacementL = L_curved || 0
          plane.material.edgeRotateDisplacementR = R_curved || 0
          plane.material.edgeScaleDisplacementU  = (that.ceil_material_index_default != -1) ? 1 : 0
          plane.material.uDisplacementScale = (p_obj.uDisplacementScale||1)/grid_size
          plane.material.uDisplacementBias  = (p_obj.uDisplacementBias ||0)/grid_size
//var dis = c.pos.distanceTo(plane.position)
//plane.material.opacity = (dis > (view_radius-1)*grid_size) ? Math.max(((view_radius)*grid_size-dis)/grid_size,0): 1
          plane.visible = true

          if (!plane.matrixAutoUpdate) plane.updateMatrix()

          if (p_obj.mirrorTextureIndex != null)
            mirror_active[p_obj.mirrorTextureIndex] = true

          if (!obj_y_extended)
            obj_y_extended = {}
          obj_y_extended[idx] = { obj:p_obj.lvl[0], ground_y:ground_y_visible, ceil_height:that.ceil_height }
        });

        if ((this.ceil_material_index_default == -1) && (this.wall_material_index_default != -1)) {
          p_obj = p[this.wall_material_index_default].init()

          var obj = p_obj.lvl[0]
          var plane = obj.get_obj(obj.list)
          grid_cache.add(xy, obj, obj.list, plane[1])
          plane = plane[0]

          plane.scale.set(grid_size,grid_size,1)
          plane.position.set((x+0.5)*grid_size, grid_size, (y+0.5)*grid_size)
//          plane.rotation.set(-Math.PI/2,0,0)
          plane.quaternion.fromArray(flat_rotX_q)
          plane.visible = true

          if (!plane.matrixAutoUpdate) plane.updateMatrix()

          if (p_obj.mirrorTextureIndex != null)
            mirror_active[p_obj.mirrorTextureIndex] = true
        }
      }
      else {
        var grid_para = this.get_para(x, y)
        var material_id = grid_para.floor_material_index
        if (material_id == null)
          material_id = this.floor_material_index_default
        if (material_id == -1)
          continue

        let p_obj0 = p[material_id].init()

        var material_id_ground = -1
        if ((ground_y_visible != ground_y) && (p_obj0.opacity < 1)) {
          material_id_ground = grid_para.floor_material_index_ground
          if (material_id_ground == null)
            material_id_ground = this.floor_material_index_default
        }

        let p_obj1
        if (material_id_ground != -1) {
          p_obj1 = p[material_id_ground].init()
        }

        var p_obj_list = [p_obj0, p_obj1]

        var ground_y_list = [ground_y_visible, ground_y]
        p_obj_list.forEach(function (_p_obj, idx) {
p_obj = _p_obj
if (!p_obj)
  return
var _ground_y = ground_y_list[idx]

        var dis = Math.max(Math.abs(x-xx), Math.abs(y-yy))
        var lvl// = grid_para.geo_lvl
//        if (lvl == null) {
          lvl = p_obj.geo_by_lvl.length-1
          for (var i = 0, i_max = p_obj.distance_by_lvl.length; i < i_max; i++) {
            if (dis <= p_obj.distance_by_lvl[i])
              break
            lvl--
          }
//        }

        var obj = p_obj.lvl[lvl]
        var plane
        if (p_obj.random_terrain && (p_obj.uDisplacementCustomUVScale < 1) && (p_obj.geo_by_lvl[lvl] != "1x1")) {
          plane = obj.get_obj(obj.list_material_cloned)
          grid_cache.add(xy, obj, obj.list_material_cloned, plane[1])
          plane = plane[0]

          plane.material.uDisplacementCustomUVScale = p_obj.uDisplacementCustomUVScale
// y inverted
          plane.material.uDisplacementCustomUVOffset.set((x % p_obj.random_terrain.divider), p_obj.random_terrain.divider-(y % p_obj.random_terrain.divider)).multiplyScalar(p_obj.uDisplacementCustomUVScale)
        }
        else {
          plane = obj.get_obj(obj.list)
          grid_cache.add(xy, obj, obj.list, plane[1])
          plane = plane[0]
        }
        plane.scale.set(grid_size,grid_size,1)
        plane.position.set((x+0.5)*grid_size, _ground_y, (y+0.5)*grid_size)
//        plane.rotation.set(-Math.PI/2,0,0)
        plane.quaternion.fromArray(flat_rotX_q)
//        plane.material.uDisplacementScale = (p_obj.uDisplacementScale||1)/grid_size
//        plane.material.uDisplacementBias  = (p_obj.uDisplacementBias ||0)/grid_size
//        plane.material.waveBumpScale = (p_obj.waveBumpScale||5)/grid_size
        plane.visible = true

        if (!plane.matrixAutoUpdate) plane.updateMatrix()

        if (p_obj.mirrorTextureIndex != null)
          mirror_active[p_obj.mirrorTextureIndex] = true

// no need to check pitfall for material on ground_y_visible (e.g. water)
        if (!p_obj1 || (idx == 1))
          obj_y_extended = { 0:{ obj:p_obj.lvl[0], ground_y:_ground_y } }

        });
      }

      if (!obj_y_extended)// && ((this.ceil_material_index_default != -1) || (this.wall_material_index_default != -1)))
        continue

      TRBL.forEach(function (dir, idx) {
        var _x = x + dir.xy[0]
        var _y = y + dir.xy[1]
        if ((_y < 0) || (_y >= h) || (_x < 0) || (_x >= w) || is_visible_wall(_x,_y))
          return

        var _obj = obj_y_extended[idx] || obj_y_extended[0];
        if (!_obj) return

        var obj = _obj.obj
        var obj_ground_y = _obj.ground_y

        var _ground_y = that.get_para(_x,_y,true).ground_y || 0
        if (obj_ground_y > _ground_y) {
          var pitfall_y = obj_ground_y - _ground_y
          for (var i = 0, i_max = Math.ceil(pitfall_y/grid_size); i < i_max; i++) {
            var plane = obj.get_obj(obj.list)
            grid_cache.add(xy, obj, obj.list, plane[1])
            plane = plane[0]

            plane.scale.set(grid_size,grid_size,grid_size)
            plane.position.set((x+dir.posXZ[0])*grid_size, -grid_size*(i+0.5)+obj_ground_y, (y+dir.posXZ[1])*grid_size)
//          plane.rotation.set(0,dir.rotY,0)
            plane.quaternion.fromArray(dir.rotY_q)
            plane.visible = true

            if (!plane.matrixAutoUpdate) plane.updateMatrix()
          }
        }

        if (_obj.ceil_height && (_obj.ceil_height > grid_size) && (this.ceil_material_index_default != -1)) {
          for (var i = 1, i_max = Math.ceil(_obj.ceil_height/grid_size); i < i_max; i++) {
            var plane = obj.get_obj(obj.list)
            grid_cache.add(xy, obj, obj.list, plane[1])
            plane = plane[0]

            plane.scale.set(grid_size,grid_size,grid_size)
            plane.position.set((x+dir.posXZ[0])*grid_size, grid_size*(i+0.5), (y+dir.posXZ[1])*grid_size)
//          plane.rotation.set(0,dir.rotY,0)
            plane.quaternion.fromArray(dir.rotY_q)
            plane.visible = true

            if (!plane.matrixAutoUpdate) plane.updateMatrix()
          }
        }
      });
    }
  }
//DEBUG_show(grid_cache_hit+'/'+Date.now())

  grid_cache.release_outdated()
/*
var _msg_ = []
  MMD_SA_options.Dungeon.grid_material_list.forEach(function (p_obj, idx) {
if (!p_obj.lvl) return
    for (var lvl = 0, lvl_max = p_obj.geo_by_lvl.length; lvl < lvl_max; lvl++) {
      var obj = p_obj.lvl[lvl]
_msg_.push(idx+'/'+lvl+':'+(obj.reusable_list.length+obj.reusable_list_material_cloned.length)+'/'+(obj.list.length+obj.list_material_cloned.length))
    }
  });
DEBUG_show(_msg_.join('\n')+'\n'+Date.now())
*/
  MMD_SA._THREE_mirror.forEach(function (mirror, idx) {
    mirror.visible = MMD_SA_options.mesh_obj_by_id["Mirror" + idx + "MESH"]._obj.visible = !!mirror_active[idx]
//DEBUG_show(MMD_SA_options.mesh_obj_by_id["Mirror" + idx + "MESH"]._obj.scale.toArray()+'/'+Date.now())
//console.log("B:"+MMD_SA_options.mesh_obj_by_id["Mirror" + 0 + "MESH"].visible+'/'+MMD_SA_options.mesh_obj_by_id["Mirror" + 0 + "MESH"]._obj.visible)
//console.log(mirror)
//console.log(MMD_SA_options.mesh_obj_by_id["Mirror" + 0 + "MESH"]._obj)
  });

  var length = view_radius * grid_size
  var lengthSq = length * length
  var lengthFarSq = lengthSq * (3 * 3)
  this.object_list.forEach(function (obj) {
    if (obj.is_dummy)
      return
// faster than .hidden getter
    if (obj._obj_proxy._hidden)
      return
    var cache = obj._obj
    d_sq = cache.position.distanceToSquared(c.pos)
    var v = obj._obj_proxy.visible = (d_sq < (lengthSq * obj.view_distance_sq))
    if (obj._obj_LOD_far)
      obj._obj_LOD_far_proxy.visible = !v && (d_sq < lengthFarSq)
  });

  this.object_list_in_view = this.object_list.filter(function (obj) {
if (obj.is_dummy)
  return false

if (obj.no_collision)
  return false

return obj._obj.visible
  });
  this.object_list_in_view = this.object_list_in_view.concat(this.grid_blocks.objs);

};
  })()
// GOML_dungeon_blocks END

 ,restart: (function () {
    class Object3D_proxy extends Object3D_proxy_base {
      constructor (_parent, _cache) {
super(_parent);

this._cache = _cache
this._cache_index = -1
this._obj_name = (!_cache.is_LOD_far) ? "_obj" : "_obj_LOD_far"

// dummy
this.children = []

// to indicate the visibility of mesh/proxy/proxy_far as a whole
// not linked to .visible to avoid some issues (and therefore you need to change both .hidden and .visible for visibility)
this._hidden = false

this.position = new THREE.Vector3()
this.rotation = new THREE.Vector3()
this.quaternion = new THREE.Quaternion()
this.scale = new THREE.Vector3()
    }

      is_Object3D_proxy = true;

      get hidden() {
return this._hidden;
      }
      set hidden(v) {
this._hidden = v;
if (v) {
  MMD_SA_options.Dungeon.sound.detach_positional_audio(this._parent._obj);
}
      }

      get useQuaternion() {
return this._cache.list[0].useQuaternion;
      }

      get visible() { return false; }
      set visible(v) {
var p = this._parent
var cache = this._cache
var cache0 = cache.list[0]
var obj_source = p._obj
var obj_mesh
cache.init()
if (v) {
  if (!p[this._obj_name].is_Object3D_proxy)
    return

  if (cache.reusable_list.length) {
    this._cache_index = cache.reusable_list.shift()
    obj_mesh = p[this._obj_name] = cache.list[this._cache_index]
//console.log("object cache reused:"+this._cache_index+'/'+cache.list.length+'|'+!cache.is_LOD_far+'/'+!!obj_mesh)
  }
  else {
    this._cache_index = ++cache.index
    obj_mesh = p[this._obj_name] = cache.list[this._cache_index]
    if (!obj_mesh) {
      obj_mesh = p[this._obj_name] = cache.list[this._cache_index] = cache0.clone()

      if (obj_mesh.bones) {
        obj_mesh._mesh_parent = cache0
        if (!cache0._RAF_timestamp_) cache0._RAF_timestamp_ = -1
        obj_mesh.updateMatrixWorld = (function () {
var updateMatrixWorld = obj_mesh._mesh_parent.updateMatrixWorld
return function () {
  updateMatrixWorld.call(this)
  this.boneMatrices.set(this._mesh_parent.boneMatrices)
  if (this.useVertexTexture) {
    this.boneTexture.needsUpdate = true;
  }
};
        })();
      }

      if (!cache.is_LOD_far) {
        MMD_SA.get_bounding_host(obj_mesh).boundingBox_list = MMD_SA.get_bounding_host(cache0).boundingBox_list;
      }

      MMD_SA.THREEX.scene.add(obj_mesh)
    }
  }

  if (!cache.is_LOD_far) {
    p.cache_index = this._cache_index
// .mesh is obsolete. In most cases, just use ._obj instead if you need to get the 3D object
    p._mesh = (obj_mesh.geometry || obj_mesh.isObject3D) ? obj_mesh : obj_mesh.children[0];
    if (p.cache_index == 0)
      MMD_SA_options.Dungeon.object_base_list[p.object_index]._obj.scale = obj_source.scale.x
  }

  obj_mesh.position.copy(obj_source.position)
  obj_mesh.rotation.copy(obj_source.rotation)
  obj_mesh.quaternion.copy(obj_source.quaternion)
  obj_mesh.scale.copy(obj_source.scale)

  if (cache.is_LOD_far)
    obj_mesh.position.add(MMD_SA.TEMP_v3.copy(cache.obj_base.LOD_far.center).multiply(obj_source.scale))

  if (!p.matrixAutoUpdate) {
    obj_mesh.matrixAutoUpdate = false
    obj_mesh.updateMatrix()
  }
}
else {
  if (p[this._obj_name].is_Object3D_proxy) {
//if (this._cache_index != -1) DEBUG_show(this._cache_index,0,1)
    return
  }

  obj_mesh = p[this._obj_name]

  this.position.copy(obj_source.position)
  this.rotation.copy(obj_source.rotation)
  this.quaternion.copy(obj_source.quaternion)
  this.scale.copy(obj_source.scale)

  cache.reusable_list.push(this._cache_index)
  this._cache_index = -1

  p[this._obj_name] = this
  if (!cache.is_LOD_far)
    p._mesh = this
}

obj_mesh.visible = v;
if (!MMD_SA.THREEX.enabled) obj_mesh.children.forEach(function (c) { c.visible = v; });
  }
    }

    var animate_combat_default = function () {
var that = this

var d = MMD_SA_options.Dungeon
var c = d.character
var npc = this._obj
if (!npc.visible)
  return
if (!c.combat_mode || d.event_mode)
  return

var npc_model = THREE.MMD.getModels()[this.character_index]
var npc_motion_para = MMD_SA.motion[npc_model.skin._motion_index].para_SA
var model_para = MMD_SA_options.model_para_obj_all[this.character_index]
if (npc_motion_para.NPC_motion_command_disabled || npc_motion_para.motion_command_disabled) {
//DEBUG_show(Date.now())
  this.motion = null

  if (npc_motion_para.duration_NPC && (npc_model.skin.time > npc_motion_para.duration_NPC)) {
    model_para._motion_name_next = model_para.motion_name_default_combat
  }

  var mov = new THREE.Vector3()
  if (npc_motion_para.mov_speed)
    mov.copy(d._mov_delta(npc_model, npc_motion_para, Math.max(npc_model.skin.time-(this._skin_time_last||0), 0)))
  this._skin_time_last = npc_model.skin.time
//DEBUG_show(mov.toArray().join("\n"))
  var pos_delta = (npc_motion_para.bone_to_position) ? npc._bone_to_position_last.pos_delta : null
  if (pos_delta) {
//DEBUG_show(pos_delta.toArray().join("\n")+'\n'+Date.now())
    mov.add(pos_delta)
  }

  if (npc_motion_para.combat_para) {
//console.log(npc_motion_para)
    d.combat_para_process({ obj:this, mass:this.mass }, npc_motion_para, npc_model.skin.time*30);
  }

  d._mov[this._index] = (mov.x || mov.y || mov.z) ? mov.applyQuaternion(npc.quaternion) : mov

  return
}

if (this.motion && !this.motion.paused)
  return


var motion_prefix = "NPC-" + this.character_index + " "
var pc = THREE.MMD.getModels()[0].mesh
var dis = npc.position.distanceTo(pc.position)

MMD_SA.TEMP_v3.set(0, Math.PI/2 - Math.atan2((pc.position.z-npc.position.z), (pc.position.x-npc.position.x)), 0)
npc.quaternion.setFromEuler(MMD_SA.TEMP_v3)
var rot = new THREE.Vector3().setEulerFromQuaternion(npc.quaternion)

//DEBUG_show(Date.now())
var zm = this.zone_of_movement
var inside_zone = zm.containsPoint(npc.position)
//DEBUG_show(npc.position.toArray()+"/"+inside_zone+'\n'+JSON.stringify(zm))

var action_obj = this.combat.action_check(this)

if (action_obj.type == "STAY") {
  var duration = 0.5 + Math.random()

  this.motion = {
    path: [
      {
  pos: npc.position.clone()
 ,rot: rot
 ,duration: duration
      }
     ,{
  pos: npc.position.clone()
 ,rot: rot
      }
    ]
   ,loop: false
  };
  this.motion = new d.PathMotion(this)
  model_para._motion_name_next = model_para.motion_name_default_combat
}
else if ((action_obj.type == "MOVE") || !inside_zone) {
  var duration = 0.5 + Math.random()
  var mov_scale = duration*10

  var dir
  if (inside_zone) {
    let grid_size = d.grid_size
    let x_npc = ~~(npc.position.x / grid_size)
    let y_npc = ~~(npc.position.z / grid_size)
    let x_pc = ~~(pc.position.x / grid_size)
    let y_pc = ~~(pc.position.z / grid_size)
// space station
let avoid_obstacle// = true
    if (avoid_obstacle && (dis > grid_size*0.5) && ((x_npc != x_pc) || (y_npc != y_pc))) {
      let x_diff = x_pc - x_npc;
      let y_diff = y_pc - y_npc;
      let dir_list = [(Math.abs(x_diff) > Math.abs(y_diff)) ? [((x_diff>0)?1:-1), 0] : [0, ((y_diff>0)?1:-1)]].concat([[0,1],[-1,0],[0,-1,],[1,0]]);

      let d_options = d.RDG_options
      let w = d_options.width
      let h = d_options.height
      let grid = d.grid_array
      let dir_final = dir_list.find(function (xy) {
        var x = x_npc + xy[0]
        var y = y_npc + xy[1]
        return ((x >= 0) && (x < w) && (y >= 0) && (y < h) && (grid[y][x] != 1))
      });

      if (dir_final[0]) {
        let y_center_offset = grid_size*0.5 - (npc.position.z % grid_size)
        if (Math.abs(y_center_offset) > mov_scale)
          dir_final = [0, ((y_center_offset > 0)?1:-1)]
      }
      else {
        let x_center_offset = grid_size*0.5 - (npc.position.x % grid_size)
        if (Math.abs(x_center_offset) > mov_scale)
          dir_final = [((x_center_offset > 0)?1:-1), 0]
      }

      let x_target = (x_npc + dir_final[0]*0.5 + 0.5) * grid_size
      let y_target = (y_npc + dir_final[1]*0.5 + 0.5) * grid_size

MMD_SA.TEMP_v3.set(0, Math.PI/2 - Math.atan2((y_target-npc.position.z), (x_target-npc.position.x)), 0)
npc.quaternion.setFromEuler(MMD_SA.TEMP_v3)
rot.setEulerFromQuaternion(npc.quaternion)

      dir = ["U"]
    }
    else {
      if (dis > 64)
        dir = ["U"]
      else if (dis > 32)
        dir = ["U","L","R"]
      else if (dis < 8)
        dir = ["D","L","R"]
    }
  }
  if (!dir)
    dir = ["U","D","L","R"]

  var dir_letter = dir[random(dir.length)]
  var v3_dir = new THREE.Vector3()
  var motion_name
  switch (dir_letter) {
    case "U":
      v3_dir.set( 0, 0, 1)
      motion_name = motion_prefix + "combat movement forward"
      break
    case "D":
      v3_dir.set( 0, 0,-1)
      motion_name = motion_prefix + "combat movement backward"
      break
    case "L":
      v3_dir.set(-1, 0, 0)
      motion_name = motion_prefix + "combat movement left"
      break
    case "R":
      v3_dir.set( 1, 0, 0)
      motion_name = motion_prefix + "combat movement right"
      break
  }

  var end_pt = npc.position.clone().add(v3_dir.multiplyScalar(mov_scale).applyQuaternion(npc.quaternion));

  ["x","z"].forEach(function (p) {
    if (end_pt[p] < zm.min[p])
      end_pt[p] = zm.min[p]
    else if (end_pt[p] > zm.max[p])
      end_pt[p] = zm.max[p]
  });
//DEBUG_show(end_pt.toArray())
  this.motion = {
    path: [
      {
  pos: npc.position.clone()
 ,rot: rot
 ,duration: duration
      }
     ,{
  pos: end_pt.clone()
 ,rot: rot
      }
    ]
   ,loop: false
   ,check_collision: true
  };
  this.motion = new d.PathMotion(this)
  model_para._motion_name_next = d.motion[motion_name].name
//DEBUG_show(motion_name+'/'+Date.now())
}
else {
  var motion_id = action_obj.motion_id
  model_para._motion_name_next = d.motion[motion_id].name
}
    };

    var hp_add = function (num) {
if (!num)
  return

var hp_last = this.hp
this.hp += num
if (num > 0) {
  if (this.hp > this.hp_max) {
    this.hp = this.hp_max
  }
}
else {
  if (this.hp <= 0) {
    this.hp = 0
  }
}
    };

    var id_for_save = ["map_grid_drawn", "event_flag"]

    return function (area_id, refresh_state) {
if (!refresh_state)
  refresh_state = 0

this.character.dismount()

var that = this

// options default START
var options_base  = MMD_SA_options.Dungeon_options
var options_start = MMD_SA_options.Dungeon_options.options_by_area_id["start"]
var options

if (this.area_id) {
// unload
  options = MMD_SA_options.Dungeon_options.options_by_area_id[this.area_id]
  if (options.event_listener) {
    for (var event_id in options.event_listener) {
      var e = options.event_listener[event_id]
      var target = e.target || window
      target.removeEventListener(event_id, e.func)
    }
  }
  if (this.ceil_material_index_default != -1) {
    var ceil = this.grid_material_list[this.ceil_material_index_default].lvl[0].list[1]
    if (ceil)
      ceil.visible = false
  }
  // save current area data
  for (var index in options._saved.object_by_index) {
    var saved = options._saved.object_by_index[index]
    var obj = this.object_list[index]
    for (var p in saved) {
      if (p == "position") {
        saved.position.data = obj._obj.position.clone()
      }
      if (p == "rotation") {
        saved.rotation.data = obj._obj[(obj._obj.useQuaternion)?"quaternion":"rotation"].clone()
      }
    }
  }

// refresh state
  if (refresh_state == 0) {
// total refresh
    for (var id in MMD_SA_options.Dungeon_options.options_by_area_id) {
      var area_options = MMD_SA_options.Dungeon_options.options_by_area_id[id]
      area_options._random_seed = null
    }
  }
  if (refresh_state <= 1) {
// clear saved
    for (var id in MMD_SA_options.Dungeon_options.options_by_area_id) {
      var area_options = MMD_SA_options.Dungeon_options.options_by_area_id[id]
      area_options._saved = new AreaDataSaved()
    }
  }
  else {
// save stuff
    id_for_save.forEach(function (id) {
      options._saved[id] = that[id]
    });
  }
console.log("RESTART - state:" + refresh_state)
}

if (refresh_state <= 1) {
  Object.assign(this.key_map, this.key_map_default)
  this.key_map_reset()
}

if (!this.area_id)
  area_id = "start"

if (area_id)
  this.area_id = area_id

options = MMD_SA_options.Dungeon_options.options_by_area_id[this.area_id]

if (!options._random_seed) {
  options._random_seed = this.generate_seed()
}
MT = new MersenneTwister(options._random_seed)

if (options.event_listener) {
  for (var event_id in options.event_listener) {
    var e = options.event_listener[event_id]
    var target = e.target || window
    target.addEventListener(event_id, e.func)
  }
}

this.RDG_options = options.RDG_options || {
  width: 50,
  height: 50,
  minRoomSize: 5,
  maxRoomSize: 20
};

this.no_camera_collision = options.no_camera_collision
this.camera_y_default_non_negative = (options.camera_y_default_non_negative !== false)

this.para_by_grid_id = (options.para_by_grid_id && Object.clone(options.para_by_grid_id)) || {};
this.para_by_xy = (options.para_by_xy && Object.clone(options.para_by_xy)) || {};
this.para_by_map = options.para_by_map && Object.clone(options.para_by_map)
/*
for (var p in this.para_by_grid_id)
  this.para_by_grid_id[p].id = "grid_id-" + p
for (var p in this.para_by_xy)
  this.para_by_grid_id[p].id = "xy-" + p
if (this.para_by_map)
  this.para_by_map.id = "map"
*/
this.ceil_material_index_default  = (options.ceil_material_index_default != null)  ? options.ceil_material_index_default  : 0;
this.floor_material_index_default = (options.floor_material_index_default != null) ? options.floor_material_index_default : 1;
this.wall_material_index_default  = (options.wall_material_index_default != null)  ? options.wall_material_index_default  : 2;


var d_options = this.RDG_options
var grid_array = this.grid_array = (this.RDG_options.grid_array && this.RDG_options.grid_array.map(function (x) { return x.slice() })) || this.RDG.NewDungeon(d_options);
//console.log(this.grid_array)


this.grid_size   = options.grid_size   || options_start.grid_size   || 64;
this.view_radius = options.view_radius || options_start.view_radius || 8;

this.ceil_height = options.ceil_height || this.grid_size;

MMD_SA_options.trackball_camera_limit.max.length = this.grid_size * 3

this.grid_material_list.forEach(function (m, idx) {
  var x, y
  if (m.repeat_base) {
    x = that.grid_size / m.repeat_base[0]
    y = that.grid_size / m.repeat_base[1]
  }
  else {
    x = y = 1
  }
// save tons of headaches by using material.repeat hack
  m.lvl.forEach(function (m2) {
    var mtl = m2.list[0].material//jThree("#DungeonPlane" + idx + "MTL").three(0)//
    if (MMD_SA.THREEX.enabled) {
      mtl.map.repeat.set(x,y);
    }
    else {
      mtl.offset = mtl.map.offset.clone()
      mtl.repeat = mtl.map.repeat.clone().set(x,y)
    }
  });
});

/*
var DG = require("dungeon-generator")
let _dungeon = new DG(
{
    "size": [100, 100],
    "rooms": {
        "initial": {
            "min_size": [3, 3],
            "max_size": [3, 3],
            "max_exits": 1
        },
        "any": {
            "min_size": [3, 3],
            "max_size": [20, 20],
            "max_exits": 4
        }
    },
    "max_corridor_length": 6,
    "min_corridor_length": 2,
    "corridor_density": 0.5,
    "symmetric_rooms": false,
    "interconnects": 1,
    "max_interconnect_length": 10,
    "room_count": 50
}
);
_dungeon.generate()
console.log(_dungeon)
*/

this.room_max_default = 0
for (var y = 0, y_max = d_options.height; y < y_max; y++) {
  for (var x = 0, x_max = d_options.width; x < x_max; x++) {
    this.room_max_default = Math.max(this.room_max_default, grid_array[y][x])
  }
}

this.grid_by_index = []
this.room_info = []
if (this.para_by_grid_id[1] && this.para_by_grid_id[1].hidden_on_map) {
  var para_new_room = this.para_by_grid_id[this.room_max_default]
  if (!para_new_room) {
    para_new_room = this.para_by_grid_id[this.room_max_default] = Object.clone(this.para_by_grid_id[1])
  }
  this.grid_by_index[1] = []
  this.room_info[1] = { x_min:999, x_max:-1, y_min:999, y_max:-1 }
}

this.map_grid_drawn = []
this.grid_array_free = []
var map_str = ""
for (var y = 0, y_max = d_options.height; y < y_max; y++) {
  this.map_grid_drawn[y] = []
  this.grid_array_free[y] = []
  for (var x = 0, x_max = d_options.width; x < x_max; x++) {
    this.grid_array_free[y][x] = true

    var para = this.get_para(x,y)
    if ((grid_array[y][x] == 1) && para.hidden_on_map) {
      grid_array[y][x] = this.room_max_default
    }
    para.grid_setup && para.grid_setup(x,y)
    var index = grid_array[y][x]

    if (!this.grid_by_index[index]) {
      this.grid_by_index[index] = []
      this.room_info[index] = { x_min:999, x_max:-1, y_min:999, y_max:-1 }
    }
    this.grid_by_index[index].push([x,y])
    var room = this.room_info[index]
    room.x_min = Math.min(room.x_min, x)
    room.y_min = Math.min(room.y_min, y)
    room.x_max = Math.max(room.x_max, x)
    room.y_max = Math.max(room.y_max, y)
    map_str += (index < 10) ? index : String.fromCharCode(65+(index-10))
  }
  map_str += "\n"
}

if (options._saved.map_grid_drawn) {
  this.map_grid_drawn = options._saved.map_grid_drawn
}

for (var id in this.para_by_grid_id) {
  if (/^room_max_default([\+\-])(\d+)$/.test(id))
    this.para_by_grid_id[this.room_max_default + ((RegExp.$1=="+")?1:-1) * parseInt(RegExp.$2)] = this.para_by_grid_id[id]
}

console.log(map_str)

for (var index in this.room_info) {
  var room = this.room_info[index]
  room.width  = (room.x_max - room.x_min) + 1
  room.height = (room.y_max - room.y_min) + 1
}

for (var id in this.para_by_grid_id) {
  if (/^\d+$/.test(id)) {
    let para = this.para_by_grid_id[id]
    if (para.para_by_xy) {
      let room = this.room_info[id]
      para.para_by_xy.forEach(function (para_xy) {
        let x = ~~(Math.min(para_xy.x, 0.9999) * room.width)  + room.x_min
        let y = ~~(Math.min(para_xy.y, 0.9999) * room.height) + room.y_min
        that.para_by_xy[x+"x"+y] = Object.assign(that.para_by_xy[x+"x"+y]||{}, para_xy.para)
//console.log(x,y, para_xy, that.para_by_xy[x+"x"+y])
      });
    }
  }
}

this.grid_by_index_free = []
this.grid_by_index.forEach(function (g) {
  that.grid_by_index_free.push(g.slice())
});

// ensure proper map redraw
this.map_display_scale = 0

MMD_SA_options.trackball_camera_limit.max.length = this.grid_size * 3 * (options.camera_limit_scale||1)


window.dispatchEvent(new CustomEvent("SA_Dungeon_after_map_generation", { detail:{ refresh_state:refresh_state, options:options } }));


this.PC_light_max = Math.min((options.PC_light_max || options_base.PC_light_max || 3), MMD_SA.light_list.length)

MMD_SA_options.ambient_light_color = options.ambient_light_color || MMD_SA_options.ambient_light_color;
jThree("#MMD_AmbLight").three(0).color = new THREE.Color(MMD_SA_options.ambient_light_color);

var dir_light = jThree("#MMD_DirLight").three(0)
MMD_SA_options.light_color = options.light_color || MMD_SA_options.light_color;
dir_light.color = new THREE.Color(MMD_SA_options.light_color);
MMD_SA_options.light_position = options.light_position || options_base.light_position || MMD_SA_options._light_position
dir_light.position.fromArray(MMD_SA_options.light_position)
MMD_SA.light_list.find(function (light) { return (light.obj == dir_light); })._pos_base = null

var point_light = jThree("#pointlight_main").three(0)
if (point_light) {
  point_light.intensity = (options.point_light && options.point_light.intensity) || 1
  point_light.color = new THREE.Color((options.point_light && options.point_light.color) || "#ffffff")
  point_light.distance = (options.point_light && options.point_light.distance) || this.grid_size*2
  point_light.position.copy((options.point_light && options.point_light.position) || { x:0, y:this.grid_size*0.5, z:0 })
}

this._event_active = {}
this.event_flag = {}
// not cloning events for now, saving some headaches for getters/setters
this.events = options.events||{}//(options.events && Object.clone(options.events)) || {}
Object.assign(this.events, MMD_SA_options.Dungeon.events_default, options_base.events_default||{})

if (options.object_list && !options._object_list_initialized) {
  options._object_list_initialized = true
  options.object_list = options.object_list.map(function (obj) { return ((obj._constructor && obj._constructor()) || obj); });
}
this.object_list = (options.object_list && Object.clone(options.object_list)) || []
//console.log(options.object_list)
// options default END

var fog = this.fog = options.fog || MMD_SA_options.fog
if (fog) {
// update the old THREE scene fog (THREEX version will copy it)
  const scene = MMD_SA.scene;

  if (scene.fog instanceof THREE.Fog) {
    scene.fog.near = fog.near || this.grid_size * this.view_radius * (fog.near_ratio||0.5)
    scene.fog.far  = fog.far  || this.grid_size * this.view_radius * (fog.far_ratio ||0.9)
  }

  scene.fog.color = new THREE.Color(fog.color||"#000")
  if (use_MatrixRain && MMD_SA.matrix_rain.greenness) {
    let gray = 0.3 * scene.fog.color.r + 0.59 * scene.fog.color.g + 0.11 * scene.fog.color.b;
    scene.fog.color.setRGB(scene.fog.color.r*(1-MMD_SA.matrix_rain.greenness), gray*MMD_SA.matrix_rain.greenness + scene.fog.color.g*(1-MMD_SA.matrix_rain.greenness), scene.fog.color.b*(1-MMD_SA.matrix_rain.greenness));
  }
console.log("Fog:"+ ((scene.fog instanceof THREE.Fog) ? scene.fog.near+'/'+scene.fog.far : 'EXP2') +'/'+scene.fog.color.getHexString())

  this.object_base_list.forEach(function (obj) {
    if (obj.is_dummy) return

    if (obj.cache_LOD_far.list.length)
      obj.cache_LOD_far.list[0].material.color.copy(scene.fog.color)
  });
}

if (options_base.skydome) {
  let dome_obj = MMD_SA_options.mesh_obj_by_id["DomeMESH"]
  if (options.skydome) {
    dome_obj.scale = MMD_SA._trackball_camera.object.far*0.5/(64*4)//(this.grid_size * (this.view_radius * 4)) / (64*4)
    this.ceil_material_index_default = options.ceil_material_index_default = -1
    if (use_MatrixRain) {
      dome_obj._obj._uniTexture_fadeout = 0.5 + ((options.skydome.fog && options.skydome.fog.height)||0.025);
      dome_obj._obj._uniTexture_scale = 10
    }

    if (!options.skydome.texture_setup)
      options.skydome.texture_setup = options_base.skydome.texture_setup

    if (options.skydome.visible !== false) {
      dome_obj._obj.visible = true
      options.skydome.texture_setup()
    }
    else {
      dome_obj._obj.visible = false
    }
  }
  else {
    dome_obj._obj.visible = false
  }
}
  
if (this.ceil_material_index_default != -1) {
  const THREE = MMD_SA.THREEX.THREE;

  var p = this.grid_material_list
  var ceil = p[this.ceil_material_index_default].lvl[0].list[1]
  if (ceil) {
    ceil.visible = true
  }
  else {
    var w = this.RDG_options.width
    var h = this.RDG_options.height
    var grid_size = this.grid_size

// disable hiding when updaing dungeon blocks
    p[this.ceil_material_index_default].disabled = true

    var ceil0 = p[this.ceil_material_index_default].lvl[0].list[0]//MMD_SA_options.mesh_obj_by_id['DungeonPlane'+this.ceil_material_index_default+'MESH_LV'+0]._obj
    var ceil  = p[this.ceil_material_index_default].lvl[0].list[1] = ceil0.clone(new THREE.Mesh(ceil0.geometry, ceil0.material.clone()));
    if (MMD_SA.THREEX.enabled) {
      ceil.material.map.repeat.set(w,h);
    }
    else {
      ceil.material.offset = ceil.material.map.offset.clone();
      ceil.material.repeat = ceil.material.map.repeat.clone().set(w,h);
    }
/*
    ["map", "normalMap", "displacementMap"].forEach(function (tex) {
      texture = ceil.material[tex]
      if (texture) {
        texture.repeat.x = w
        texture.repeat.y = h
      }
    });
*/
    ceil.position.set(w*grid_size*0.5, this.ceil_height, h*grid_size*0.5)
//    ceil.rotation.x = Math.PI/2
    ceil.quaternion.set(Math.sin((Math.PI/2)/2),0,0,Math.cos((Math.PI/2)/2))
    ceil.scale.set(w*grid_size, h*grid_size, 1)
    MMD_SA.THREEX.scene.add(ceil)
    ceil.visible = true
//    console.log(ceil)

    var obj = this.grid_blocks.objs[this.grid_blocks.objs.length-1]._obj
    var geo = obj.geometry
    obj.position.copy(ceil.position)
    geo.boundingBox.set(MMD_SA._v3a.set(-w*grid_size*0.5, 0, -h*grid_size*0.5), MMD_SA._v3b.set(w*grid_size*0.5, 999, h*grid_size*0.5))
// it will be updated in .check_collision() as a boundingSphere-hit object
//      obj.updateMatrixWorld()
  }
}


if (options._saved.event_flag) {
  this.event_flag = options._saved.event_flag
}
else {
  for (var event_id in this.events) {
    this.event_flag[event_id] = 0
  }
}

this.grid_material_list.forEach(function (p_obj) {
  p_obj.reset()
});

this.object_base_list.forEach(function (obj, idx) {
  if (obj.is_dummy) return

  obj.cache.reset()
  obj.cache_LOD_far.reset()
  obj.object_list = []
});

var d = this

var _object_list = this.object_list.map(function (obj) { return [obj] });

if (MMD_SA_options.Dungeon_options.multiplayer) {
  for (var i = 0, i_max = MMD_SA_options.Dungeon_options.multiplayer.OPC_list.length; i < i_max; i++) {
    _object_list.push([{ object_id:"OPC-"+i }]);
  }
}

var _object_list_child = []
d.object_base_list.forEach(function (obj_base, obj_index) {
  if (obj_base.parent_object_list && !_object_list.some((obj)=>(obj_index==obj[0].object_index)||(obj_base.id && obj_base.id==obj[0].object_id))) {
    obj_base.parent_object_list.some(function (p) {
      if (p != "PC") {
        let p_index, p_id;
        if (typeof p == 'string') {
          p_id = p
          p_index = d.object_base_index_by_id[p_id]
        }
        else {
          p_index = p
          let p_obj = d.object_base_list[p_index]
          p_id = p_obj.id
        }
        if (!_object_list.some((obj)=>(p_index==obj[0].object_index)||(p_id && p_id==obj[0].object_id)))
          return false
      }

      _object_list_child.push([{object_index:obj_index}])
      return true
    });
  }
});
_object_list = _object_list.concat(_object_list_child)
//console.log(_object_list.slice())

_object_list.forEach(function (obj_list, i) {
  var obj = obj_list[0]
  var obj_index = obj.object_index = (obj.object_id) ? d.object_base_index_by_id[obj.object_id] : obj.object_index
  var obj_base  = d.object_base_list[obj_index]

  var placement = obj.placement || obj_base.placement || {}
  var clone_list = placement.grid_id_filter && placement.grid_id_filter(_object_list, i)
  if (clone_list) {
    clone_list.forEach(function (para, idx) {
      var clone = Object.clone(obj)
      clone._clone_index = idx
      if (!clone.placement)
        clone.placement = Object.clone(placement)
      clone.placement.grid_id = para.grid_id
      if (para.para) {
        for (var name in para.para) {
          if (name == "placement") {
            for (var p_name in para.para.placement) {
              clone.placement[p_name] = para.para.placement[p_name]
//console.log(clone.placement[p_name])
            }
          }
          else {
            clone[name] = para.para[name]
          }
        }
      }
//console.log(clone)
      obj_list[idx] = clone
    });
  }
});

this.object_list = []
_object_list.forEach(function (obj_list) {
  obj_list.forEach(function (obj) {
    d.object_list.push(obj)
  });
});


this.accessory_list = []
this.object_id_translated = {}

this.object_id_translated[(MMD_SA_options.model_para_obj.character && MMD_SA_options.model_para_obj.character.name) || 'PC'] = 'PC';

this.object_list.forEach(function (obj, idx) {
  obj._index = idx
  var obj_index = obj.object_index
  var obj_base  = d.object_base_list[obj_index]
  if (obj_base.is_dummy) {
    obj.is_dummy = true
    return
  }

  var id = "object" + obj_index + "_" + obj_base.object_list.length
  if (!obj.id && obj_base.id && (obj_base.object_list.length == 0))
    obj.id = obj_base.id
  if (obj.id) {
    that.object_id_translated[obj.id] = id
  }
  else {
    obj.id = id
  }
  obj_base.object_list.push(obj)

  obj.path = obj_base.path
  obj.character_index = obj_base.character_index

  if (obj.character_index) {
    const c = MMD_SA_options.model_para_obj_all[obj.character_index].character;
    if (c && c.name)
      that.object_id_translated[c.name] = id;
  }

  if (obj._clone_index == null)
    obj._clone_index = -1

  obj.is_OPC = obj_base.is_OPC

  var obj_mesh, obj_LOD_far_mesh
  obj_mesh = obj._obj = obj._mesh = obj._obj_proxy = new Object3D_proxy(obj, obj_base.cache)
  if (obj_base.LOD_far)
    obj_LOD_far_mesh = obj._obj_LOD_far = obj._obj_LOD_far_proxy = new Object3D_proxy(obj, obj_base.cache_LOD_far)

  var placement = obj.placement = obj.placement || (obj_base.placement && Object.clone(obj_base.placement)) || {}
  if (!placement.position)
    placement.position = {x:0,y:0,z:0}

  obj_mesh.scale.x = obj_mesh.scale.y = obj_mesh.scale.z = obj.placement.scale = obj_base._obj.scale = placement.scale || ((obj_base.path) ? 10 : 1)

//console.log(obj_mesh)

  obj.view_distance = obj_base.view_distance || obj.view_distance || 1
  obj.view_distance_sq = obj.view_distance * obj.view_distance

  var pos = [0,0]
  var grid_occupied = placement.grid_occupied
  if ((placement.setup && placement.setup(obj)) || placement.grid_pos_absolute) {
    pos = placement.grid_pos_absolute.slice()
  }
  else if (placement.grid_id != null) {
    if (placement.grid_xy) {
      var room = d.room_info[placement.grid_id]
      pos[0] = ~~(Math.min(placement.grid_xy[0], 0.9999) * room.width)  + room.x_min
      pos[1] = ~~(Math.min(placement.grid_xy[1], 0.9999) * room.height) + room.y_min
    }
    else {
      d._object_active_ = obj
      var grid_list = d.grid_by_index_free[placement.grid_id]
      if (placement.grid_filter) {
        grid_list = d.grid_by_index_free[placement.grid_id].filter(placement.grid_filter).shuffleMT()
      }
      if (placement.grid_sort) {
        grid_list.sort(placement.grid_sort)
      }
      if (!grid_list.length) {
        console.error("object index:" + obj_index + " / gird sorting failed")
        grid_list = d.grid_by_index_free[placement.grid_id]
      }
      pos = grid_list[Math.floor(MT.random()*grid_list.length)].slice()
    }
    placement.grid_pos_absolute = pos.slice()
    if (!grid_occupied && !placement.can_overlap)
      grid_occupied = [[0,0]]
  }
  else {
    placement.grid_pos_absolute = [0,0]
  }

  placement.onposition && placement.onposition(obj)

  var rot
  if (placement.rotation) {
    rot = {}
    rot.x = placement.rotation.x
    rot.y = placement.rotation.y
    rot.z = placement.rotation.z
    for (var dir in rot) {
      if (rot[dir] == null)
        rot[dir] = MT.random()*360
    }
    obj_mesh.rotation.copy(rot).multiplyScalar(Math.PI/180)
    obj_mesh.quaternion.setFromEuler(obj_mesh.rotation)
  }
  else {
// always reset clone rotation
    obj_mesh.rotation.set(0,0,0)
    obj_mesh.quaternion.set(0,0,0,1)
  }

  if (grid_occupied) {
    if (rot) {
      var rot_q = MMD_SA.TEMP_q.setFromEuler(MMD_SA.TEMP_v3.copy(rot).multiplyScalar(Math.PI/180))
      grid_occupied = grid_occupied.map(function (xy) {
        if (xy[0] || xy[1]) {
          MMD_SA.TEMP_v3.set(xy[0], 0, xy[1]).applyQuaternion(rot_q)
          return [Math.round(MMD_SA.TEMP_v3.x), Math.round(MMD_SA.TEMP_v3.z)]
        }
        return xy
      });
    }

//var _i = d.grid_by_index_free[placement.grid_id].length
    var x = pos[0]
    var y = pos[1]
    d.grid_by_index_free[placement.grid_id] = d.grid_by_index_free[placement.grid_id].filter(function (xy) {
var occupied = grid_occupied.some(function (xy_mod) {
//if (grid_occupied.length>1 && !i0 && !i1) console.log(xy.join(",")+'/'+xy_mod.join(",")+'/'+x+','+y)
  var hit = ((xy[0] == x+xy_mod[0]) && (xy[1] == y+xy_mod[1]))
  if (hit)
    d.grid_array_free[xy[1]][xy[0]] = false
  return hit
});
return !occupied
    });
//if (grid_occupied.length>1) console.log(_i-d.grid_by_index_free[placement.grid_id].length)
  }

  obj._grid_xy = pos.slice()
  obj._zone_of_movement = obj.zone_of_movement || obj_base.zone_of_movement
  if (obj._zone_of_movement) {
    if (obj.zone_of_movement.min.y == obj.zone_of_movement.max.y) {
      obj.zone_of_movement.min.y -= 10
      obj.zone_of_movement.max.y += 10
    }
    obj.zone_of_movement = new THREE.Box3().copy(obj._zone_of_movement).translate(MMD_SA.TEMP_v3.set((pos[0]+0.5)*d.grid_size, 0, (pos[1]+0.5)*d.grid_size))
  }

  pos[0] *= d.grid_size
  pos[1] *= d.grid_size
  obj_mesh.position.set(pos[0],0,pos[1]).add(MMD_SA.TEMP_v3.set(d.grid_size/2+placement.position.x, placement.position.y, d.grid_size/2+placement.position.z))
  obj_mesh.position.y += (placement.grounded) ? d.get_ground_y(obj_mesh.position) : Math.max(d.get_para(~~pos[0],~~pos[1],true).ground_y||0, 0)

  if (placement.hidden) {
    obj_mesh.hidden = true
  }

  if (!obj.onclick)
    obj.onclick = obj_base.onclick && Object.clone(obj_base.onclick)
  if (obj.onclick) {
    obj.onclick.forEach(function (e) {
      var _clone_index = (e.clone_event_by_index) ? obj_base.object_list.length-1 : obj._clone_index
      if (_clone_index == -1)
        return

      if (e.event_id) {
        if (typeof e.event_id == 'string') {
          e.event_id += "_" + _clone_index
        }
        else {
          for (var bb_index in e.event_id)
            e.event_id[bb_index] += "_" + _clone_index
        }
      }
    });
  }

  obj.use_PC_ground_normal_when_following = obj_base.use_PC_ground_normal_when_following
  if (obj.mass == null)
    obj.mass = obj_base.mass

  if (obj.hp == null)
    obj.hp = obj_base.hp
  if (obj.hp_max == null)
    obj.hp_max = obj_base.hp_max
  if (obj.hp) {
    if (!obj.hp_max)
      obj.hp_max = obj.hp
  }
  else {
    obj.hp = obj.hp_max
  }
  if (obj.hp) {
    obj.combat_stats = new CombatStats(Object.assign({}, obj_base.combat_stats, obj.combat_stats))
    obj.hp_add = hp_add
  }

  if (obj.no_collision == null)
    obj.no_collision = obj_base.no_collision
  if (obj.no_camera_collision == null)
    obj.no_camera_collision = obj_base.no_camera_collision
  obj.collision_by_mesh = obj_base.collision_by_mesh
  obj.collision_by_mesh_material_index_max = obj_base.collision_by_mesh_material_index_max
  obj.collision_by_mesh_enforced = obj_base.collision_by_mesh_enforced
  obj.collision_by_mesh_face_grounded = obj_base.collision_by_mesh_face_grounded
  obj.collision_by_mesh_sort_range = obj_base.collision_by_mesh_sort_range
  obj.collision_by_mesh_drop_limit = obj_base.collision_by_mesh_drop_limit
  obj.collision_by_mesh_ground_limit = obj_base.collision_by_mesh_ground_limit
  if (obj.collision_by_mesh_sort_range) {
//    obj.collision_by_mesh_sort_range /= placement.scale
    obj.mesh_sorted_list = {}
    obj.mesh_sorted = null//{ position:null, index_list:null }
  }

// this seems to fix a glitch when collision detection is done on the top-most point of the boundingBox, which may override mesh collision
  if (obj.collision_by_mesh) {
    const bb_host = MMD_SA.get_bounding_host(obj_base.cache.list[0]);
    if (!bb_host._boundingBox) bb_host._boundingBox = bb_host.boundingBox.clone();
    bb_host.boundingBox.max.y = bb_host._boundingBox.max.y + 1;
  }

  obj.oncreate = obj.oncreate || obj_base.oncreate
  obj.oncreate && obj.oncreate()

  obj.oncollisioncheck = obj.oncollisioncheck || obj_base.oncollisioncheck

  obj.motion = obj.motion || obj_base.motion
  if (obj.motion)
    obj.motion = new d.PathMotion(obj)

  obj.animate = obj.animate || obj_base.animate
  if (obj.animate && (typeof obj.animate == "string") && (obj.animate == "combat_default"))
    obj.animate = animate_combat_default

  if (obj.combat == null)
    obj.combat = obj_base.combat && Object.clone(obj_base.combat)

  obj.matrixAutoUpdate = !!(obj.matrixAutoUpdate || obj_base.matrixAutoUpdate || (obj.character_index != null) || obj.motion || obj.animate)

  if (obj.parent_bone) {
    d.accessory_list.push(obj)
  }

  obj.user_data = obj.user_data || (obj_base.user_data && Object.clone(obj_base.user_data)) || {}

  obj.data_to_save = obj.data_to_save || obj_base.data_to_save
  if (obj.data_to_save) {
    var saved = options._saved.object_by_index
    saved = saved[idx] = saved[idx] || {}
    for (var p in obj.data_to_save) {
      if (!saved[p])
        saved[p] = {}
    }
  }
});

this.object_list_click = this.object_list.filter(obj => obj.onclick);

//console.log(this.accessory_list)

for (var index in options._saved.object_by_index) {
  var para = options._saved.object_by_index[index]
  var obj = this.object_list[index]
  if (para.position && para.position.data)
    obj._obj.position.copy(para.position.data)
  if (para.rotation && para.rotation.data) {
    obj._obj[(obj._obj.useQuaternion)?"quaternion":"rotation"].copy(para.rotation.data)
  }
}


window.dispatchEvent(new CustomEvent("SA_Dungeon_after_object_placement"));


if (options.sound) {
  options.sound.forEach(function (sound) {
    d.sound.load(sound)
  });
}

d.check_points = options.check_points || []
d.check_points.forEach(function (cp) {
  cp.range.forEach(function (r) {
    r._entered = false
  });
});
// clear temporary check points
d._check_points = null

this._states = {}
this.inventory.reset()

var pos = options._saved.starting_position || options.starting_position
var rot = options._saved.starting_rotation || options.starting_rotation
if (!pos) {
  pos = new THREE.Vector3()
  if (options.starting_position_full) {
    let xy = null
    if (options.starting_position_full.grid_id)
      xy = this.grid_by_index[options.starting_position_full.grid_id][0]
    else if (options.starting_position_full.grid_xy)
      xy = options.starting_position_full.grid_xy
    if (xy) {
      let ground_y = d.get_para(xy[0],xy[1],true).ground_y||0
      if (!options.starting_position_full.grounded)
        ground_y = Math.max(ground_y, 0)
      pos.set((xy[0]+0.5)*this.grid_size, ground_y, (xy[1]+0.5)*this.grid_size)
    }

    if (options.starting_position_full.position)
      pos.add(options.starting_position_full.position)

    if (options.starting_position_full.rotation)
      rot = options.starting_position_full.rotation
  }
  else {
    let x = this.grid_by_index[2][0][0]
    let y = this.grid_by_index[2][0][1]
    pos = pos.set((x+0.5)*this.grid_size, Math.max(d.get_para(x,y,true).ground_y||0, 0), (y+0.5)*this.grid_size)
  }
}

var c = this.character
Object.assign(c, options.character||options_base.character||{})
c.reset()
c.swap_character()

c.pos.copy(pos)
if (!rot && (MMD_SA_options.WebXR && MMD_SA_options.WebXR.AR)) {
//  c.TPS_mode = true
}
if (rot) {
  c.TPS_mode = true
  c.pos_update()

  rot = new THREE.Vector3().copy(rot).multiplyScalar(Math.PI/180)
  c.rot.add(rot)
  THREE.MMD.getModels()[0].mesh.quaternion.multiply(MMD_SA.TEMP_q.setFromEuler(rot))
}
else
  c.pos_update()

THREE.MMD.getModels()[0].resetMotion()
MMD_SA_options.motion_shuffle_list_default = MMD_SA_options._motion_shuffle_list_default.slice()
MMD_SA._force_motion_shuffle = true
//console.log(MMD_SA_options.motion_shuffle_list_default)
this.shadow_camera_width = options.shadow_camera_width || options_base.shadow_camera_width || 64*4
this.update_shadow_para()

//console.log(d.object_base_list.filter(function (obj_base) { return obj_base.cache.reusable_list.some(function (idx) { return obj_base.cache.list[idx].visible; }); }))


window.dispatchEvent(new CustomEvent("SA_Dungeon_onrestart"));
this.update_dungeon_blocks()


//console.log(d.object_base_list.filter(function (obj_base) { return obj_base.cache.reusable_list.some(function (idx) { return obj_base.cache.list[idx].visible; }); }))
//d.object_base_list.forEach(function (obj_base) { if (obj_base.is_dummy) return; obj_base.cache.reusable_list.forEach(function (idx) { obj_base.cache.list[idx].visible=false; }); })
//console.log(d.object_base_list)

MMD_SA.reset_camera()
//MMD_SA._trackball_camera.SA_adjust()


// avoid some issues by running this after a few frame skips
var frame_to_skip = 2
if (MMD_SA_options.model_para_obj._icon_canvas) {
/*
// drawn in c.swap_character() already
  MMD_SA_options.Dungeon.character.icon.getContext("2d").drawImage(MMD_SA_options.model_para_obj._icon_canvas, 0,0)
  MMD_SA_options.Dungeon.update_status_bar(true)
*/
}
else if (MMD_SA.THREEX.enabled && (MMD_SA.THREEX.get_model(0).type == 'VRM') && ((MMD_SA.THREEX.get_model(0).is_VRM1) ? MMD_SA.THREEX.get_model(0).model.meta.thumbnailImage : MMD_SA.THREEX.get_model(0).model.meta.texture)) {
  const model = MMD_SA.THREEX.get_model(0);
  const para_SAX = model.model_para;
  const para_SA = MMD_SA_options.model_para_obj;

  const canvas = MMD_SA_options.Dungeon.character.icon;
  const ctx = canvas.getContext("2d");
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage((model.is_VRM1)?model.model.meta.thumbnailImage:model.model.meta.texture.source.data, 0,0,64,64);

  const icon_canvas = para_SA._icon_canvas = para_SAX._icon_canvas = document.createElement("canvas");
  icon_canvas.width = icon_canvas.height = 64;
  icon_canvas.getContext("2d").drawImage(canvas, 0,0);

  MMD_SA_options.Dungeon.update_status_bar(true);
}
else {
//  SL_Host.style.visibility = "hidden"

  let dir_light = jThree("#MMD_DirLight").three(0)
  let _dir_light_pos = dir_light.position.clone()

  let _look_at_screen = MMD_SA_options._look_at_screen
  let _look_at_mouse  = MMD_SA_options._look_at_mouse

  MMD_SA_options.look_at_screen = MMD_SA_options.look_at_mouse = false

  System._browser.on_animation_update.add(function () {
jThree("#MMD_AmbLight").three(0).color = new THREE.Color("#FFF")

dir_light.color = new THREE.Color('#606060')
dir_light.position.set(1,1,1).multiplyScalar(MMD_SA_options.light_position_scale).add(c.pos)

var point_light = jThree("#pointlight_main").three(0)
if (point_light) {
  point_light.color = new THREE.Color("#000")
}

var mesh = THREE.MMD.getModels()[0].mesh
mesh.geometry.boundingBox.expandByScalar(20)
mesh.geometry.boundingSphere.radius += 20

// .get_bone_position_by_MMD_name() not working (bone.matrixWorld not updated with mesh position yet?)
var head_pos_absolute = MMD_SA.get_bone_position(0, "頭");//MMD_SA.THREEX.get_model(0).get_bone_position_by_MMD_name("頭");//
var head_pos = MMD_SA._v3a.copy(head_pos_absolute).sub(mesh.position);
//DEBUG_show(head_pos.toArray())

var camera_obj = MMD_SA._trackball_camera.object
camera_obj.position.set(head_pos_absolute.x, head_pos_absolute.y-0.25, head_pos_absolute.z+4+12);
//camera_obj.up.set(0, 1, 0);
//console.log(head_pos)
camera_obj.lookAt(MMD_SA.TEMP_v3.set(head_pos_absolute.x, head_pos_absolute.y-0.25+1, head_pos_absolute.z));
  }, (frame_to_skip-1), 0);

  System._browser.on_animation_update.add(function () {
const SL = MMD_SA.THREEX.SL;
var d_min = Math.min(SL.width, SL.height) * 0.2
var canvas = MMD_SA_options.Dungeon.character.icon
var ctx = canvas.getContext("2d")
ctx.imageSmoothingQuality = "high"
ctx.drawImage(SL, (SL.width-d_min)/2,(SL.height-d_min)/2,d_min,d_min, 0,0,canvas.width,canvas.height);

// sharpen
//https://gist.github.com/mikecao/65d9fc92dc7197cb8a7c
(function () {
  var w = canvas.width
  var h = canvas.height
  var mix = 0.2//0.4

    var x, sx, sy, r, g, b, a, dstOff, srcOff, wt, cx, cy, scy, scx,
        weights = [0, -1, 0, -1, 5, -1, 0, -1, 0],
        katet = Math.round(Math.sqrt(weights.length)),
        half = (katet * 0.5) | 0,
        dstData = ctx.createImageData(w, h),
        dstBuff = dstData.data,
        srcBuff = ctx.getImageData(0, 0, w, h).data,
        y = h;

    while (y--) {
        x = w;
        while (x--) {
            sy = y;
            sx = x;
            dstOff = (y * w + x) * 4;
            r = 0;
            g = 0;
            b = 0;
//            a = 0;

            for (cy = 0; cy < katet; cy++) {
                for (cx = 0; cx < katet; cx++) {
                    scy = sy + cy - half;
                    scx = sx + cx - half;

                    if (scy >= 0 && scy < h && scx >= 0 && scx < w) {
                        srcOff = (scy * w + scx) * 4;
                        wt = weights[cy * katet + cx];

                        r += srcBuff[srcOff] * wt;
                        g += srcBuff[srcOff + 1] * wt;
                        b += srcBuff[srcOff + 2] * wt;
//                        a += srcBuff[srcOff + 3] * wt;
                    }
                }
            }

            dstBuff[dstOff] = r * mix + srcBuff[dstOff] * (1 - mix);
            dstBuff[dstOff + 1] = g * mix + srcBuff[dstOff + 1] * (1 - mix);
            dstBuff[dstOff + 2] = b * mix + srcBuff[dstOff + 2] * (1 - mix);
            dstBuff[dstOff + 3] = srcBuff[dstOff + 3];
        }
    }

    ctx.putImageData(dstData, 0, 0);
})();

MMD_SA_options.model_para_obj._icon_canvas = document.createElement("canvas")
MMD_SA_options.model_para_obj._icon_canvas.width = MMD_SA_options.model_para_obj._icon_canvas.height = 64
MMD_SA_options.model_para_obj._icon_canvas.getContext("2d").drawImage(canvas, 0,0)

MMD_SA_options.Dungeon.update_status_bar(true)

jThree("#MMD_AmbLight").three(0).color = new THREE.Color(MMD_SA_options.ambient_light_color);

var dir_light = jThree("#MMD_DirLight").three(0)
dir_light.color = new THREE.Color(MMD_SA_options.light_color);
dir_light.position.copy(_dir_light_pos)

var point_light = jThree("#pointlight_main").three(0)
if (point_light) {
  point_light.color = new THREE.Color((options.point_light && options.point_light.color) || "#ffffff")
}

var mesh = THREE.MMD.getModels()[0].mesh
mesh.geometry.boundingBox.expandByScalar(-20)
mesh.geometry.boundingSphere.radius -= 20

MMD_SA_options.look_at_screen = _look_at_screen
MMD_SA_options.look_at_mouse  = _look_at_mouse

MMD_SA.reset_camera()

//System._browser.on_animation_update.add(function () { SL_Host.style.visibility = "inherit"; }, 0, 0);
  }, (frame_to_skip-1), 1);
}

SL_Host.style.visibility = "hidden";

MMD_SA_options.Dungeon.event_mode = true
System._browser.on_animation_update.add(function () {
  if (!MMD_SA_options.Dungeon.started)
    window.dispatchEvent(new CustomEvent("SA_Dungeon_onstart"));
  MMD_SA_options.Dungeon.started = true

  THREE.MMD.getModels().forEach((model) => {
    model.resetPhysics(60)
  });

  MMD_SA_options.Dungeon.event_mode = false
  MMD_SA_options.Dungeon.run_event("onstart")

  options._startup_position_ = c.pos.clone();

  SL_Host.style.visibility = "inherit";
}, frame_to_skip+3, 0);
    };
  })()

 ,update_shadow_para: function () {
var shadow_camera_width = this.shadow_camera_width || 64*4

MMD_SA_options.shadow_para.shadowCameraLeft   = -shadow_camera_width;
MMD_SA_options.shadow_para.shadowCameraRight  =  shadow_camera_width;
MMD_SA_options.shadow_para.shadowCameraBottom = -shadow_camera_width;
MMD_SA_options.shadow_para.shadowCameraTop    =  shadow_camera_width;
MMD_SA_options.shadow_para.shadowCameraFar    =  MMD_SA_options.light_position_scale*3;//shadow_camera_width*1.5;//
//console.log(shadow_camera_width+'/'+MMD_SA_options.shadow_para.shadowCameraFar )
for (var i = 1, i_max = MMD_SA.light_list.length; i < i_max; i++) {
  var light = MMD_SA.light_list[i].obj
  if (light instanceof THREE.PointLight)
    continue

  for (var p in MMD_SA_options.shadow_para)
    light[p] = MMD_SA_options.shadow_para[p]

  if (light.shadowCamera instanceof THREE.OrthographicCamera) {
// left, right, top, bottom, near, far
    light.shadowCamera.left   = light.shadowCameraLeft
    light.shadowCamera.right  = light.shadowCameraRight
    light.shadowCamera.top    = light.shadowCameraTop
    light.shadowCamera.bottom = light.shadowCameraBottom
    light.shadowCamera.near   = light.shadowCameraNear
    light.shadowCamera.far    = light.shadowCameraFar
    light.shadowCamera.updateProjectionMatrix()
//DEBUG_show(light.position.toArray(),0,1)
  }

// AT: cascaded shadow map
  else if (light.shadowCascadeArray) {
    light.shadowCascadeArray.forEach(function (_light) {
      _light.shadowCamera.far = light.shadowCameraFar
    });
//DEBUG_show(light.position.toArray(),0,1)
  }

}
  }

 ,init: function () {
var that = this

System._browser.translation.dictionary = {
	"Dungeon": {
		"UI": {
			"backpack": {
				"_translation_": {
					"_default_": "Backpack",
					"ja": "バックパック",
					"zh": "背包"
				}
			},
			"tome": {
				"settings": {
					"UI_and_overlays": {
						"user_interface": {
							"_translation_": {
								"_default_": "User interface",
								"ja": "ユーザーインターフェース",
								"zh": "使用者介面"
							},
							"UI_off": {
								"_translation_": {
									"_default_": "User interface is now OFF. Press Esc to toggle the bottom menu display.",
									"ja": "ユーザーインターフェースはオフになりました。 Esc キーを押すと、下部のメニュー表示が切り替わります。",
									"zh": "使用者介面現已關閉。 按 Esc 鍵切換下方介面的顯示。"
								},
								"green_screen": {
									"_translation_": {
										"_default_": "green screen",
										"ja": "グリーンスクリーン",
										"zh": "綠幕"
									}
								}
							}
						},
						"camera_display": {
							"_translation_": {
								"_default_": "Video input display",
								"ja": "ビデオ入力表示",
								"zh": "影像輸入顯示"
							},
							"non_webcam": {
								"_translation_": {
									"_default_": "Non-webcam",
									"ja": "非ウェブカメラ",
									"zh": "非網路攝影機"
								}
							}
						},
						"wireframe_display": {
							"_translation_": {
								"_default_": "Wireframe display",
								"ja": "ワイヤーフレーム表示",
								"zh": "線框顯示"
							}
						},
						"mocap_debug_display": {
							"_translation_": {
								"_default_": "Mocap debug display",
								"ja": "モーキャプのデバッグ表示",
								"zh": "動捕偵錯顯示"
							}
						},
						"UI_sound_effects": {
							"_translation_": {
								"_default_": "UI sound effects",
								"ja": "UI音響効果",
								"zh": "介面聲效"
							}
						},
						"UI_language": {
							"_translation_": {
								"_default_": "UI language",
								"ja": "UI言語",
								"zh": "介面語言"
							}
						}
					}
				}
			}
		}
	},
	"Misc": {
		"done": {
			"_translation_": {
				"_default_": "Done",
				"ja": "終了",
				"zh": "結束"
			}
		},
		"finish": {
			"_translation_": {
				"_default_": "Finish",
				"ja": "終了",
				"zh": "完成"
			}
		},
		"cancel": {
			"_translation_": {
				"_default_": "Cancel",
				"ja": "キャンセル",
				"zh": "取消"
			}
		},
		"default": {
			"_translation_": {
				"_default_": "Default",
				"ja": "デフォルト",
				"zh": "預設"
			}
		},
		"none": {
			"_translation_": {
				"_default_": "None",
				"ja": "なし",
				"zh": "沒有"
			}
		},
		"full": {
			"_translation_": {
				"_default_": "Full",
				"ja": "フル",
				"zh": "完全"
			}
		},
		"Full": {
			"_translation_": {
				"_default_": "Full",
				"ja": "フル",
				"zh": "完全"
			}
		},
		"yes": {
			"_translation_": {
				"_default_": "Yes",
				"ja": "はい",
				"zh": "是"
			}
		},
		"no": {
			"_translation_": {
				"_default_": "No",
				"ja": "いいえ",
				"zh": "否"
			}
		},
		"others": {
			"_translation_": {
				"_default_": "Others",
				"ja": "その他",
				"zh": "其他"
			}
		},
		"auto": {
			"_translation_": {
				"_default_": "Auto",
				"ja": "自動",
				"zh": "自動"
			}
		},
		"Normal": {
			"_translation_": {
				"_default_": "Normal",
				"ja": "普通",
				"zh": "普通"
			}
		},
		"Medium": {
			"_translation_": {
				"_default_": "Medium",
				"ja": "中",
				"zh": "中"
			}
		},
		"Low": {
			"_translation_": {
				"_default_": "Low",
				"ja": "低",
				"zh": "低"
			}
		},
		"High": {
			"_translation_": {
				"_default_": "High",
				"ja": "高",
				"zh": "高"
			}
		},
		"Very high": {
			"_translation_": {
				"_default_": "Very high",
				"ja": "とても高い",
				"zh": "非常高"
			}
		},
		"Max": {
			"_translation_": {
				"_default_": "Max",
				"ja": "最大",
				"zh": "最大"
			}
		},
		"Min": {
			"_translation_": {
				"_default_": "Min",
				"ja": "最小",
				"zh": "最小"
			}
		},
		"Best": {
			"_translation_": {
				"_default_": "Best",
				"ja": "最高",
				"zh": "最佳"
			}
		},
		"Small": {
			"_translation_": {
				"_default_": "Small",
				"ja": "小",
				"zh": "小"
			}
		},
		"Large": {
			"_translation_": {
				"_default_": "Large",
				"ja": "大",
				"zh": "大"
			}
		}
	}
};

// Dungeon
var options = MMD_SA_options.Dungeon_options// && Object.clone(MMD_SA_options.Dungeon_options)
if (!options)
  options = MMD_SA_options.Dungeon_options = {}

if (use_SA_browser_mode && (!is_SA_child_animation && (!webkit_electron_mode || !options.transparent_background))) {
//  Settings_default._custom_.WallpaperAsBG = "non_default"
  Settings_default._custom_.DisableTransparency = "non_default"
}

if (browser_native_mode && !webkit_window) {
  Settings_default._custom_.CSSTransformFullscreen = "non_default"
}

SA_fullscreen_stretch_to_cover = true

document.addEventListener("DOMContentLoaded", function(e) {
//  if (Settings_default._custom_.DisableTransparency == "non_default") document.body.style.backgroundColor = "black";

  var d = MMD_SA_options.Dungeon
  for (var item_name in d.item_base) {
//console.log(item_name)
    var item = d.item_base[item_name]
    if (item.sound) {
      item.sound.forEach(function (sound) {
        if (options.sound.findIndex(function(s){return (s.url==sound.url)}) == -1) {
          options.sound.push({
  url: sound.url
 ,name: sound.name
 ,channel: sound.channel || "SFX"
 ,can_spawn: !!sound.can_spawn
          });
        }
      });
    }
  }

  if (options.NPC_physics_disabled) {
    for (var i = 1, i_max = MMD_SA_options.model_para_obj_all.length; i < i_max; i++)
      MMD_SA_options.model_para_obj_all[i].physics_disabled = true
    console.log("NPC physics OFF")
  }

  if (is_mobile && !options.joystick_disabled)
    Ljoystick.style.visibility = "inherit"
});

window.addEventListener("jThree_ready", function () {
  var c = MMD_SA_options.Dungeon.character.icon = document.createElement("canvas")
  c.width = c.height = 64

  MMD_SA_options.model_para_obj_all.forEach(function (para_SA, idx) {
    if (para_SA.is_PC_candidate || (idx == 0)) {
      para_SA.is_PC_candidate = true
      if (!para_SA.character)
        para_SA.character = {}
      if (!para_SA.character.combat_stats_base)
        para_SA.character.combat_stats_base = (idx == 0) ? MMD_SA_options.Dungeon.character.combat_stats_base||{} : {}
      if (!para_SA.character.combat_stats_base.attack_combo_list)
        para_SA.character.combat_stats_base.attack_combo_list = MMD_SA_options.Dungeon_options._attack_combo_list
    }

    const para_SAX = MMD_SA.THREEX.get_model(idx).model_para;
    if (!para_SAX.icon_path)
      return
//System.Gadget.path + '\\icon_SA_512x512.png'

    if (!/^\w+\:/.test(para_SAX.icon_path))
      para_SAX.icon_path = MMD_SA.THREEX.get_model(idx).model_path.replace(/[^\/\\]+$/, "") + para_SAX.icon_path

    var icon_canvas = para_SA._icon_canvas = para_SAX._icon_canvas = document.createElement("canvas")
    icon_canvas.width = icon_canvas.height = 64
    System._browser.load_file(para_SAX.icon_path, async function (xhr) {
      const bitmap = await createImageBitmap(xhr.response);//, { resizeWidth:64, resizeHeight:64, resizeQuality:'high' });
      const ctx = icon_canvas.getContext("2d")
      ctx.imageSmoothingQuality = "high"
      ctx.drawImage(bitmap, 0,0,64,64);
      bitmap.close()
    }, 'blob', true);
  });

  MMD_SA_options.Dungeon.character.combat_stats_base = MMD_SA_options.model_para_obj.character.combat_stats_base
});

window.addEventListener("SA_Dungeon_onstart", function () {
//https://github.com/yoannmoinet/nipplejs
  if (Ljoystick.style.visibility == "hidden")
    return

  var d = MMD_SA_options.Dungeon;

  (function () {
    var css_scale = System._browser.css_scale

    function keyboard_event(e_type, key_id) {
var keyCode = d.key_map_by_id[key_id].keyCode
if ((e_type == "keyup") && !d._key_pressed[keyCode])
  return

var e = new KeyboardEvent(e_type, {bubbles:true, cancelable:true, keyCode:keyCode});
document.dispatchEvent(e);
    }

    function joystick_resize() {
Ljoystick.style.posLeft = 16
Ljoystick.style.posTop  = B_content_height - (Ljoystick.style.pixelWidth+32)
//Ljoystick.style.transform = "scale(" + css_scale + ")"
Ljoystick.style.visibility = "inherit"
    }

    Ljoystick.style.pixelWidth = Ljoystick.style.pixelHeight = 256 * css_scale

    var nipple_radius = 64 * css_scale
    d.nipplejs_manager = nipplejs.create({
      zone: Ljoystick
     ,color: "black"
//     ,mode: "static"
     ,size: nipple_radius*2
     ,position: { top:"50%", left:"50%" }
//,dynamicPage:true
     ,fadeTime: 10
    });

    d.nipplejs_manager.on("move", function (ev, data) {
//DEBUG_show(d.key_map_by_id.up.keyCode)
//DEBUG_show(JSON.stringify(data))
var key_pressed = {up:0, down:0, left:0, right:0}
var xy = data.instance.frontPosition
var x = xy.x
var y = xy.y
//DEBUG_show(JSON.stringify(xy))
var dis = Math.sqrt(x*x + y*y)
if (dis > nipple_radius/10) {
  var scale
  var threshold = (d.character.TPS_mode) ? 0 : nipple_radius/10
  var x_abs = Math.abs(x)
  var y_abs = Math.abs(y)
  if (x_abs > threshold) {
    scale = (d.character.TPS_mode) ? x_abs/dis * Math.min(dis/nipple_radius*2, 1) : (x_abs/nipple_radius-0.1)/0.9
    if (x > 0)
      key_pressed.right = scale
    else
      key_pressed.left  = scale
  }
  if (y_abs > threshold) {
    scale = (d.character.TPS_mode) ? y_abs/dis * Math.min(dis/nipple_radius*2, 1) : Math.min(y_abs/nipple_radius*2, 1)
    if (y > 0)
      key_pressed.down = scale
    else
      key_pressed.up   = scale
  }
}

for (var key_id in key_pressed) {
  var v = key_pressed[key_id]
  if (v) {
    var key_map = d.key_map_by_id[key_id]
    var key_data = key_map._data = key_map._data || {}
    key_data.scale = v
    keyboard_event("keydown", key_id)
  }
  else
    keyboard_event("keyup", key_id)
}
    });

    d.nipplejs_manager.on("end", function (ev) {
var key_pressed = {up:0, down:0, left:0, right:0}
for (var key_id in key_pressed)
  keyboard_event("keyup", key_id)
    });

    joystick_resize()
    window.addEventListener("resize", function (e) {
joystick_resize()
    });
  })();
});


// defaults for MMD_SA_options START
if (!MMD_SA_options.GOML_head)
  MMD_SA_options.GOML_head = ""
if (!MMD_SA_options.GOML_scene)
  MMD_SA_options.GOML_scene = ""
if (!MMD_SA_options.mesh_obj)
  MMD_SA_options.mesh_obj = []
if (!MMD_SA_options.mesh_obj_preload_list)
  MMD_SA_options.mesh_obj_preload_list = []

if (MMD_SA_options.hidden_before_start == null)
  MMD_SA_options.hidden_before_start = true
//MMD_SA_options.hidden_on_start = true

MMD_SA_options.use_speech_bubble = true

if (!MMD_SA_options.mirror_motion_from_first_model)
  MMD_SA_options.mirror_motion_from_first_model = 0

if (!MMD_SA_options.light_position_scale)
  MMD_SA_options.light_position_scale = 64*2;

if (!MMD_SA_options.shadow_para)
  MMD_SA_options.shadow_para = {};
if (!MMD_SA_options.shadow_para.shadowCameraLeft)
  MMD_SA_options.shadow_para.shadowCameraLeft = -64*4;
if (!MMD_SA_options.shadow_para.shadowCameraRight)
  MMD_SA_options.shadow_para.shadowCameraRight = 64*4;
if (!MMD_SA_options.shadow_para.shadowCameraBottom)
  MMD_SA_options.shadow_para.shadowCameraBottom = -64*4;
if (!MMD_SA_options.shadow_para.shadowCameraTop)
  MMD_SA_options.shadow_para.shadowCameraTop = 64*4;

// use default fog para unless in AR mode
if (!MMD_SA_options.fog && (!MMD_SA_options.WebXR || !MMD_SA_options.WebXR.AR))
  MMD_SA_options.fog = options.fog || {}

if (!MMD_SA_options.light_position)
  MMD_SA_options.light_position = [0,1,0]

if (MMD_SA_options.light_color == null)
  MMD_SA_options.light_color = "#202020"
if (MMD_SA_options.ambient_light_color == null)
  MMD_SA_options.ambient_light_color = "#404040"
if (MMD_SA_options.ground_shadow_only == null)
  MMD_SA_options.ground_shadow_only = true

if (!MMD_SA_options.camera_param)
  MMD_SA_options.camera_param = "far:" + (128*16*8) + ";"

if (MMD_SA_options.meter_motion_disabled == null)
  MMD_SA_options.meter_motion_disabled = true
// defaults for MMD_SA_options END


if (!options.game_id)
  options.game_id = Settings.f_path.replace(/^.+[\/\\]/, "")
if (!options.game_version)
  options.game_version = "1.0"
if (!options.chapter_id)
  options.chapter_id = "1"


if (!options.sound)
  options.sound = []

if (!options.sound.some(function(s){return(s.name=="interface_item_access")})) {
  options.sound.push({
    url: System.Gadget.path + "/sound/SFX_pack01.zip#/RPG Sound Pack/interface/interface1.aac"
   ,name: "interface_item_access"
   ,channel: "SFX"
  });
}
if (!options.sound.some(function(s){return(s.name=="interface_item_deny")})) {
  options.sound.push({
    url: System.Gadget.path + "/sound/SFX_pack01.zip#/RPG Sound Pack/interface/interface6.aac"
   ,name: "interface_item_deny"
   ,channel: "SFX"
  });
}
if (!options.sound.some(function(s){return(s.name=="interface_item_drop")})) {
  options.sound.push({
    url: System.Gadget.path + "/sound/SFX_pack01.zip#/RPG Sound Pack/interface/interface3.aac"
   ,name: "interface_item_drop"
   ,channel: "SFX"
  });
}

if (!options.sound.some(function(s){return(s.name=="footstep_default")})) {
  options.sound.push({
    url: System.Gadget.path + "/sound/SFX_pack01.zip#/251788__vkproduktion__footstep-01-mono.aac"
   ,name: "footstep_default"
   ,channel: "SFX"
   ,can_spawn: true
  });
}
if (!options.sound.some(function(s){return(s.name=="footstep_water")})) {
  options.sound.push({
    url: System.Gadget.path + "/sound/SFX_pack01.zip#/270429__littlerobotsoundfactory__footstep-water-03.aac"
   ,name: "footstep_water"
   ,channel: "SFX"
   ,can_spawn: true
  });
}
if (!options.sound.some(function(s){return(s.name=="footstep_grass")})) {
  options.sound.push({
    url: System.Gadget.path + "/sound/SFX_pack01.zip#/456273__soundfx-studio__footsteps-grass.aac"
   ,name: "footstep_grass"
   ,channel: "SFX"
   ,can_spawn: true
  });
}
if (!options.sound.some(function(s){return(s.name=="footstep_sand")})) {
  options.sound.push({
    url: System.Gadget.path + "/sound/SFX_pack01.zip#/456273__soundfx-studio__footsteps-sand.aac"
   ,name: "footstep_sand"
   ,channel: "SFX"
   ,can_spawn: true
  });
}
if (!options.sound.some(function(s){return(s.name=="car_engine01")})) {
  options.sound.push({
    url: System.Gadget.path + "/sound/SFX_pack01.zip#/car_engine_loop_5x5.aac"
   ,name: "car_engine01"
   ,channel: "SFX"
   ,can_spawn: true
   ,loop: true
  });
}


// PC click reaction default START
if (options.use_PC_click_reaction_default) {

  if (!options.sound.some(function(s){return(s.name=="hit-1")})) {
    options.sound.push({
      url: System.Gadget.path + "/sound/SFX_pack01.zip#/162370__lewisisminted__punch-1.aac"
     ,name: "hit-1"
     ,channel: "SFX"
     ,can_spawn: true
    });
  }
  if (!options.sound.some(function(s){return(s.name=="hit-3")})) {
    options.sound.push({
      url: System.Gadget.path + "/sound/SFX_pack01.zip#/104183__ekokubza123__punch.aac"
     ,name: "hit-3"
     ,channel: "SFX"
     ,can_spawn: true
    });
  }
  if (!options.sound.some(function(s){return(s.name=="anime_wow")})) {
    options.sound.push({
      url: System.Gadget.path + "/sound/SFX_pack01.zip#/Anime_Wow_Sound.oga"
     ,name: "anime_wow"
     ,channel: "SFX"
//     ,can_spawn: true
    });
  }

MMD_SA_options.custom_default = function () {
  var custom_action_new = []
  if (!MMD_SA_options.custom_action || (MMD_SA_options.custom_action.indexOf("cover_undies") == -1)) custom_action_new.push("cover_undies")

  var _hit_head = {
    action: {
      condition: function (is_bone_action, objs) {
if (objs._model_index) return false

return MMD_SA._hit_head_;
      }

     ,onFinish: function () {
MMD_SA._hit_head_=false;
MMD_SA_options.Dungeon._states.object_click_disabled = false
      }

     ,get look_at_screen_ratio() {
return ((this.frame >= 27) ? 0 : (27 - this.frame)/27)
      }
    }

   ,motion: {path:'MMD.js/motion/motion_rpg_pack01.zip#/hit/h01_何かにぶつかる小.vmd', match:{skin_jThree:{ test: function(name) { return !((name=='センター') || (name=='上半身') || (name=='下半身') || (name.indexOf("ＩＫ") != -1) || (/^(\u5DE6|\u53F3)(\u8DB3|\u3072\u3056)/.test(name))); } }, morph_jThree:{test:function(name){ return (name!="瞳小") }} }}

   ,animation_check: MMD_SA.custom_action_default["cover_undies"].animation_check
  }
  custom_action_new.push(_hit_head)

  var _cover_chest = {
    action: {
      condition: function (is_bone_action, objs) {
if (objs._model_index) return false

if (MMD_SA._hit_chest_ || this._cover_chest_) {
  if (is_bone_action && !this.frame) {
    MMD_SA.copy_first_bone_frame(this.motion_index, objs, {bone_group:["腕"], skin_jThree:/^(\u5DE6|\u53F3)(\u80A9|\u8155|\u3072\u3058|\u624B\u9996|\u624B\u6369)/})
  }
  this._cover_chest_ = true
}

return this._cover_chest_;
      }

     ,onFinish: function () {
if (!MMD_SA._hit_body_but_chest_)
  MMD_SA_options.Dungeon._states.object_click_disabled = false

if (MMD_SA._hit_chest_) {
  this.frame=10
} else {
  this._cover_chest_=false
}
     }
   }

   ,motion: {path:'MMD.js/motion/motion_basic_pack01.zip#/cover_chest_v02b.vmd', match:{bone_group:["腕","指"], all_morphs:true, skin_jThree:/^(\u5DE6|\u53F3)(\u80A9|\u8155|\u3072\u3058|\u624B\u9996|\u624B\u6369|.\u6307.)/, morph_jThree:true}}

   ,animation_check: MMD_SA.custom_action_default["cover_undies"].animation_check
  }
  custom_action_new.push(_cover_chest)

  MMD_SA_options.custom_action = (MMD_SA_options.custom_action) ? custom_action_new.concat(MMD_SA_options.custom_action) : custom_action_new

  MMD_SA._hit_body_defined_ = true
  Object.defineProperty(MMD_SA, "_hit_body_", {
  get: function ()  { return (MMD_SA._hit_head_ || MMD_SA._hit_chest_ || MMD_SA._hit_hip_ || MMD_SA._hit_legs_) }
 ,set: function (v) { MMD_SA._hit_head_ = MMD_SA._hit_chest_ = MMD_SA._hit_hip_ = MMD_SA._hit_hip_ = v }
  });
  Object.defineProperty(MMD_SA, "_hit_body_but_chest_", {
  get: function ()  { return (MMD_SA._hit_head_ || MMD_SA._hit_hip_ || MMD_SA._hit_legs_) }
  });
  Object.defineProperty(MMD_SA, "_hit_body_but_hip_", {
  get: function ()  { return (MMD_SA._hit_head_ || MMD_SA._hit_chest_ || MMD_SA._hit_legs_) }
  });


  var _key_pressed_when_character_clicked = {}
  document.addEventListener('keydown', function (e) {
if (!_key_pressed_when_character_clicked[e.keyCode]) {
  MMD_SA._hit_chest_ = false
  MMD_SA._hit_hip_   = false
}
  });

  var _cursor_timerID
  window.addEventListener('SA_Dungeon_character_clicked', function (e) {
if (MMD_SA.music_mode || System._browser.camera.ML_enabled) return false;

var d = MMD_SA_options.Dungeon
var intersected = e.detail.intersected.sub(d.character.pos)

//DEBUG_show(intersected.sub(d.character.pos).toArray()+'/'+Date.now())
MMD_SA._hit_body_ = false

var pressed, moving
_key_pressed_when_character_clicked = {}
for (var i = 0, i_max = d.key_map_list.length; i < i_max; i++) {
  var k = d.key_map_list[i]
  var key_map = d.key_map[k.keyCode]
  var id = k.id
  if (key_map.down && !/^(up|left|down|right)$/.test(id))
    return

  if (key_map.down) {
    pressed = true
    _key_pressed_when_character_clicked[k.keyCode] = true
    if (/^(up|down)$/.test(id))
      moving = true
  }
}

var mesh = THREE.MMD.getModels()[0].mesh
var bb_max_y = mesh.geometry.boundingBox.max.y

if (intersected.y > bb_max_y*0.8) {
  MMD_SA._hit_head_ = true
  d.sound.audio_object_by_name["hit-3"].play(mesh)
}
else if (intersected.y > bb_max_y*0.6) {
  MMD_SA._hit_chest_ = true
  d.sound.audio_object_by_name["anime_wow"].play(mesh)
}
else if (intersected.y > bb_max_y*0.4){
  MMD_SA._hit_hip_ = true
  d.sound.audio_object_by_name["anime_wow"].play(mesh)
//  MMD_SA._gravity_ = [0,1,0]
//  MMD_SA._gravity_factor = 1
}
else if (intersected.y < bb_max_y*0.2) {
  if (!pressed) {
    MMD_SA._hit_legs_ = true
    d.character_movement_disabled = true
    // use ._motion_shuffle_list instead, because we have multiple motions running in order, but .motion_shuffle_list_default can be shuffled.
    MMD_SA_options._motion_shuffle_list = [MMD_SA_options.motion_index_by_name["w01_すべって尻もち"], MMD_SA_options.motion_index_by_name["女の子座り→立ち上がる_gumi_v01"]]
    MMD_SA_options.motion_shuffle_list_default = null
    MMD_SA._force_motion_shuffle = true
  }
  else if (moving) {
    MMD_SA._hit_legs_ = true
    d.character_movement_disabled = true
    // use ._motion_shuffle_list instead, because we have multiple motions running in order, but .motion_shuffle_list_default can be shuffled.
    MMD_SA_options._motion_shuffle_list = [MMD_SA_options.motion_index_by_name["r01_普通に転ぶ"], MMD_SA_options.motion_index_by_name["OTL→立ち上がり"]]
    MMD_SA_options.motion_shuffle_list_default = null
    MMD_SA._force_motion_shuffle = true
  }
  else {
    return
  }
  d.sound.audio_object_by_name["hit-3"].play(mesh)
}
else
  return

d._states.object_click_disabled = true

if (_cursor_timerID)
  clearTimeout(_cursor_timerID)
e.detail.target.style.cursor = ((webkit_mode)?"-webkit-":"")+"grab"
_cursor_timerID = setTimeout(function () {
  e.detail.target.style.cursor = ((webkit_mode)?"-webkit-":"")+"grabbing"
  _cursor_timerID = setTimeout(function () {
    _cursor_timerID = null
    e.detail.target.style.cursor = "auto"
  }, 1000);
}, 200);
  });

//if (EV_sync_update.fps_last) DEBUG_show('FPS:' + EV_sync_update.fps_last);
}

}
// PC click reaction default END


if (options.combat_mode_enabled) {
  if (options.simple_combat_input_mode_enabled == null)
    options.simple_combat_input_mode_enabled = is_mobile

  if (!options.sound.some(function(s){return(s.name=="hit-1")})) {
    options.sound.push({
      url: System.Gadget.path + "/sound/SFX_pack01.zip#/162370__lewisisminted__punch-1.aac"
     ,name: "hit-1"
     ,channel: "SFX"
     ,can_spawn: true
    });
  }
  if (!options.sound.some(function(s){return(s.name=="hit-2")})) {
    options.sound.push({
      url: System.Gadget.path + "/sound/SFX_pack01.zip#/216198__rsilveira-88__cartoon-punch-02.aac"
     ,name: "hit-2"
     ,channel: "SFX"
     ,can_spawn: true
    });
  }
  if (!options.sound.some(function(s){return(s.name=="hit-3")})) {
    options.sound.push({
      url: System.Gadget.path + "/sound/SFX_pack01.zip#/104183__ekokubza123__punch.aac"
     ,name: "hit-3"
     ,channel: "SFX"
     ,can_spawn: true
    });
  }
  if (!options.sound.some(function(s){return(s.name=="swing")})) {
    options.sound.push({
      url: System.Gadget.path + "/sound/SFX_pack01.zip#/RPG Sound Pack/battle/swing.aac"
     ,name: "swing"
     ,channel: "SFX"
     ,can_spawn: true
    });
  }
  if (!options.sound.some(function(s){return(s.name=="hit_slash")})) {
    options.sound.push({
      url: System.Gadget.path + "/sound/SFX_pack01.zip#/35213__abyssmal__slashkut.aac"
     ,name: "hit_slash"
     ,channel: "SFX"
     ,can_spawn: true
    });
  }
}


const sd = this.skydome = options.skydome;
if (sd) {
  if (!sd.texture_path_list)
    sd.texture_path_list = [System.Gadget.path + "/images/_dungeon/tex/ryntaro_nukata/angel_staircase.jpg"]
  sd.texture_cache_list = []
// NOTE: There is little to no reason to use too many polygons for depth-enabled skybox, as fewer polygons sometimes actually look smoother
  if (!sd.width_segments)
    sd.width_segments  = 64*2;
  if (!sd.height_segments)
    sd.height_segments = 64*2;

  sd.texture_path_list.forEach(function (path, idx) {
    var img = new Image()
    sd.texture_cache_list.push(img)
    System._browser.load_file(path, img)
  });

  if (!sd.texture_setup) {
    sd.texture_setup = (function () {
// https://stackoverflow.com/questions/5623838/rgb-to-hex-and-hex-to-rgb
function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
parseInt(result[1], 16),
parseInt(result[2], 16),
parseInt(result[3], 16)
    ] : [0,0,0];
}
      return function () {
const THREE = MMD_SA.THREEX.THREE;

var dome_tex = MMD_SA.THREEX.mesh_obj.get_three('DomeMESH').material.map;
if (MMD_SA.THREEX.enabled && MMD_SA.THREEX.use_sRGBEncoding) dome_tex.colorSpace = THREE.SRGBColorSpace;
dome_tex.needsUpdate = true

var img = MMD_SA_options.Dungeon_options.skydome.texture_cache_list[this.texture_index||0]
var canvas = dome_tex.image;
// Note: After the initial use of a texture, its dimensions, format, and type cannot be changed. (r135)
// https://threejs.org/docs/index.html#api/en/textures/Texture
// https://discourse.threejs.org/t/gl-invalid-value-offset-overflows-texture-dimensions/35561
var cw = (is_mobile) ? 2048 : 4096;
var ch = 2048;
if ((canvas.width != cw) || (canvas.height != ch)) {
  canvas.width  = cw
  canvas.height = ch
}

var context = canvas.getContext("2d")
context.globalAlpha = 1
context.clearRect(0,0,cw,ch)
context.drawImage(img, 0,0,img.width,img.height, 0,0,cw,ch)

MMD_SA_options.mesh_obj_by_id["DomeMESH"]._obj.visible = true

var fog = this.fog
if (!fog)
  return

context.globalAlpha = fog.opacity || 1
var fill_color = fog.color || (MMD_SA_options.Dungeon.fog && MMD_SA_options.Dungeon.fog.color) || "#000000"
context.fillStyle = fill_color
var h = Math.round(ch * (0.5 + (fog.height||0.025)))
context.fillRect(0,(ch-h), cw,h)

var h_gradient = Math.round(ch * 0.0125)
var gradient = context.createLinearGradient(0,(ch-h-h_gradient), 0,(ch-h));
gradient.addColorStop(0,"rgba(" + hexToRgb(fill_color).join(",") + ",0)");
gradient.addColorStop(1,fill_color);
context.fillStyle = gradient
context.fillRect(0,(ch-h-h_gradient), cw,h_gradient)
      };
    })();
  }

  MMD_SA_options.mesh_obj_preload_list.push({ id:"DomeMESH", create:function () {
const THREE = MMD_SA.THREEX.THREE;

return new THREE.Mesh(
  new THREE.SphereGeometry( 64*4, 64,64 ),
  new THREE.MeshBasicMaterial( { map:new THREE.Texture(document.createElement('canvas')), side:THREE.BackSide, fog:false } )
);
  } });

  MMD_SA_options.mesh_obj.push({ id:"DomeMESH", scale:1 });

  window.addEventListener("MMDStarted", function () { MMD_SA_options.mesh_obj_by_id["DomeMESH"]._obj.renderDepth = 99999; })

  if (!options.PC_follower_list)
    options.PC_follower_list = []
  options.PC_follower_list.push({id:"#DomeMESH"});
/*
MMD_SA_options.GOML_scene += [
  '<obj id="TEST_LIGHT" style="position:0 0 0; scale:1;">'
 ,'<light id="MuzzleFlash0LIGHT" type="Poi" style="lightIntensity: 1.0; lightDistance: ' + (32) + '; position: ' + ([0,16,0].join(" ")) + '; lightColor:#ffffff;" />'
 ,'</obj>'
].join("\n");
MMD_SA_options.mesh_obj.push({ id:"TEST_LIGHT", scale:1 });
options.PC_follower_list.push({id:"#MuzzleFlash0LIGHT"});
*/
}

if (MMD_SA_options.use_CircularSpectrum) {
  if (!options.PC_follower_list)
    options.PC_follower_list = []
  options.PC_follower_list.push({id:"#CircularSpectrumMESH"});
}

// dungeon general options default START
this.grid_material_list = options.grid_material_list || [
// ceil
  {
  map: System.Gadget.path + "\\images\\_dungeon\\tex\\3dtextures.me\\Stone Wall 002\\Stone_Wall_002_COLOR_AO.jpg"
 ,normalMap: System.Gadget.path + "\\images\\_dungeon\\tex\\3dtextures.me\\Stone Wall 002\\Stone_Wall_002_NRM.jpg"
 ,geo_by_lvl: [[1,1]]
 ,distance_by_lvl: []
  }
// floor
 ,{
  map: System.Gadget.path + "/images/_dungeon/tex/3dtextures.me/Stone Floor 003/Pavement_006_COLOR_AO-50.jpg"
 ,normalMap: System.Gadget.path + "/images/_dungeon/tex/3dtextures.me/Stone Floor 003/Pavement_006_NRM_c80.jpg"
 ,specularMap: System.Gadget.path + "/images/_dungeon/tex/3dtextures.me/Stone Floor 003/Pavement_006_SPEC_c80.jpg"
// ,displacementMap: System.Gadget.path + "/images/_dungeon/tex/3dtextures.me/Stone Floor 003/Pavement_006_DISP_256x256.png"
// ,uDisplacementBias: -0.5
 ,geo_by_lvl: [[1,1]]// [[1,1],[16,16],[32,32],[128,128]]//
 ,distance_by_lvl: []// [1,2,4]//
  }
// wall
 ,{
  map: System.Gadget.path + "/images/_dungeon/tex/3dtextures.me/Stone Wall 004/Wall Stone 004_COLOR_AO.jpg"
 ,normalMap: System.Gadget.path + "/images/_dungeon/tex/3dtextures.me/Stone Wall 004/Wall Stone 004_NRM_c80.jpg"
 ,specularMap: System.Gadget.path + "/images/_dungeon/tex/3dtextures.me/Stone Wall 004/Wall Stone 004_SPEC_c90.jpg"
// ,displacementMap: System.Gadget.path + "/images/_dungeon/tex/3dtextures.me/Stone Wall 004/Wall Stone 004_DISP_256x256.png"
// ,uDisplacementScale: 3
 ,geo_by_lvl: [[1,1]]// [[1,1],[16,16],[32,32],[128,128]]//
 ,distance_by_lvl: []// [1,3,5]//
  }
];

if (options.inventory) {
  if (options.inventory.max_base)
    this.inventory.max_base = options.inventory.max_base
  if (options.inventory.max_row)
    this.inventory.max_row  = options.inventory.max_row
  if (options.inventory.UI) {
    if (options.inventory.UI.info)
      Object.assign(this.inventory.UI.info, options.inventory.UI.info);
    this.inventory.UI.muted = options.inventory.UI.muted;
  }
}
this.inventory.initialize()

this.item_base = options.item_base || {}

this.item_base._empty_ = Object.assign({
  icon_path: System.Gadget.path + '/images/_dungeon/item_icon.zip#/empty.gif'
 ,rarity: "inactive"
 ,info_short: "Empty"
}, this.item_base._empty_||{});

this.item_base._backpack_ = Object.assign({
  icon_path: System.Gadget.path + '/images/_dungeon/item_icon.zip#/fantasy_icon/backpack_64x64.png'
 ,get info_short() { return System._browser.translation.get('Dungeon.UI.backpack'); }
 ,index_default: MMD_SA_options.Dungeon.inventory.max_base-1
 ,is_base_inventory: true
// ,is_always_visible: true
 ,stock_max: 1
 ,sound: [
    {
  url: System.Gadget.path + "/sound/SFX_pack01.zip#/RPG Sound Pack/interface/interface2.aac"
 ,name: "item_backpack"
 ,is_drag: true
    }
  ]
 ,action: {
    func: function () {
if (System._browser.overlay_mode) {
  if (Ldungeon_inventory.style.visibility == "hidden")
    Ldungeon_inventory.style.visibility = "inherit"
  else if (Ldungeon_inventory_backpack.style.visibility != "hidden")
    Ldungeon_inventory.style.visibility = Ldungeon_inventory_backpack.style.visibility = "hidden"
  else
    Ldungeon_inventory_backpack.style.visibility = "inherit"
}
else {
  Ldungeon_inventory_backpack.style.visibility = (Ldungeon_inventory_backpack.style.visibility != "hidden") ? "hidden" : "inherit"
}

if (Ldungeon_inventory_backpack.style.visibility != 'hidden') {
  MMD_SA_options.Dungeon.inventory.update_page(0);
}

//Ldungeon_inventory.style.posLeft = Ldungeon_inventory_backpack.style.posLeft = (B_content_width - (MMD_SA_options.Dungeon.inventory.max_base)*64) * ((System._browser.overlay_mode && (Ldungeon_inventory.style.visibility == "hidden")) ? 1 : 0.5);

if (MMD_SA_options.Dungeon.nipplejs_manager)
  Ljoystick.style.visibility = ((Ldungeon_inventory_backpack.style.visibility != "hidden") || options.joystick_disabled) ? "hidden" : "inherit"
    }
   ,anytime: true
  }
}, this.item_base._backpack_||{});

const Bag = (()=>{
  function clone(inv) {
const page_index = this._page_index;

const inventory = MMD_SA_options.Dungeon.inventory;
const _inv = inventory.find('bag'+addZero(page_index), page_index)
//DEBUG_show(_inv?.index||-1,0,1)
if (!_inv) {
  inventory.copy(inv.index, inventory.max_base + page_index * inventory.max_base * (inventory.max_row-1));
}
  }

  function action(item, inv) {
const page_index = this._page_index;

clone.call(this, inv);

Ldungeon_inventory_backpack.style.visibility = 'inherit';

const inventory = MMD_SA_options.Dungeon.inventory;
if (inventory.page_index != page_index) {
  this._page_index_ = inventory.get_page_index(inv.index);
  MMD_SA_options.Dungeon.inventory.update_page(page_index);
}
else {
  MMD_SA_options.Dungeon.inventory.update_page(Math.max(this._page_index_,0));
}
  }

  const Bag = function (page_index) {
this._page_index = page_index;

this.icon_path = System.Gadget.path + '/images/_dungeon/item_icon.zip#/misc_icon/bag_64x64.png';
this.info_short = "Bag";
//   ,index_default: MMD_SA_options.Dungeon.inventory.max_base
this.stock_max = 1;
this.sound = [{
  url: System.Gadget.path + "/sound/SFX_pack01.zip#/RPG Sound Pack/interface/interface2.aac",
  name: "item_backpack",
  is_drag: true,
}];

this.action = {
  func: (item, inv)=>{ return action.call(this, item, inv); },
  anytime: true,
}
  };

  Bag.prototype.on_drop = function (item, inv) {
const page_index = this._page_index;

clone.call(this, inv);

const inventory = MMD_SA_options.Dungeon.inventory;
inventory.unshift(inv.index, (inventory.page_index != page_index) ? page_index : this._page_index_);
/*
System._browser.on_animation_update.add(()=>{
  item.update_UI();
  inv.update_UI();
},0,0);
*/
  };

  return Bag;
})();

this.item_base.bag01 = Object.assign(new Bag(1), this.item_base.bag01||{});
this.item_base.bag02 = Object.assign(new Bag(2), this.item_base.bag02||{});

this.item_base._map_ = Object.assign({
  icon_path: System.Gadget.path + '/images/_dungeon/item_icon.zip#/fantasy_icon/map_64x64.png'
 ,info_short: "Map"
 ,index_default: MMD_SA_options.Dungeon.inventory.max_base-2
 ,stock_max: 1
 ,action: {
    func: function () {
Ldungeon_map.style.visibility = (Ldungeon_map.style.visibility != "hidden") ? "hidden" : "inherit"
    }
   ,anytime: true
  }
}, this.item_base._map_||{});

this.item_base.menu = Object.assign({
  icon_path: System.Gadget.path + '/images/_dungeon/item_icon.zip#/fantasy_icon/tome_64x64.png'
 ,info_short: "Tome (Menu)"
 ,index_default: MMD_SA_options.Dungeon.inventory.max_base
 ,stock_max: 1
 ,sound: [
    {
  url: System.Gadget.path + "/sound/SFX_pack01.zip#/RPGsounds_Kenney/bookOpen.ogg"
 ,name: "item_book_open"
 ,is_drag: true
    }
  ]
 ,action: {
    func: function () { MMD_SA_options.Dungeon.run_event("_MENU_",0); }
// ,anytime: true
  }
}, this.item_base.menu||{});
this.events_default["_MENU_"] = [
//0
      [
        {
          message: {
  content: "1. Restart\n2. Player Manual\n3. Settings\n4. Misc\n5. Cancel"
 ,bubble_index: 3
 ,branch_list: [
    { key:1, branch_index:1 }
   ,{ key:2, branch_index:6 }
   ,{ key:3, branch_index:7 }
   ,{ key:4, branch_index:8 }
   ,{ key:5 }
  ]
          }
        }
      ]
//1
     ,[
        {
          message: {
  content: "1. Restart\n2. Restart (full)\n3. Cancel"
 ,bubble_index: 3
 ,branch_list: [
    { key:1, branch_index:2 }
   ,{ key:2, branch_index:4 }
   ,{ key:3 }
  ]
          }
        }
      ]
//2
     ,[
        {
          message: {
  content: "This will restart the game, preserving all procedurally generated maps and content.\n1. OK\n2. Cancel"
 ,bubble_index: 3
 ,para: { scale:1.5, font_scale:1 }
 ,branch_list: [
    { key:1, branch_index:3 }
   ,{ key:2 }
  ]
          }
        }
      ]
//3
     ,[
        {
          load_area: { id:'start', refresh_state:1 }
        }
      ]
//4
     ,[
        {
          message: {
  content: "This will restart the game, resetting all procedurally generated maps and content.\n1. OK\n2. Cancel"
 ,bubble_index: 3
 ,para: { scale:1.5, font_scale:1 }
 ,branch_list: [
    { key:1, branch_index:5 }
   ,{ key:2 }
  ]
          }
        }
      ]
//5
     ,[
        {
          load_area: { id:'start', refresh_state:0 }
        }
      ]
//6
     ,[
        {
          goto_event: { id:"_PLAYER_MANUAL_", branch_index:0 }
        }
      ]
//7
     ,[
        {
          goto_event: { id:"_SETTINGS_", branch_index:0 }
        }
      ]
//8
     ,[
        {
          goto_event: { id:"_MISC_", branch_index:0 }
        }
      ]
];

if (!this.item_base.coin) {
  this.item_base.coin = {
    icon_path: System.Gadget.path + '/images/_dungeon/item_icon.zip#/fantasy_icon/coin_64x64.png'
   ,info_short: "Gold Coin"
   ,stock_max: 999999
   ,sound: [
      {
  url: System.Gadget.path + "/sound/SFX_pack01.zip#/RPG Sound Pack/inventory/coin3.aac"
 ,name: "item_coin"
 ,is_drag: true
 ,is_no_action: true
      }
    ]
  };
}

if (!this.item_base.potion_hp_50) {
  this.item_base.potion_hp_50 = {
    icon_path: System.Gadget.path + '/images/_dungeon/item_icon.zip#/potions/pt1_64x64.png'
   ,info_short: "HP Potion (M)"
   ,stock_max: 9
   ,sound: [
      {
  url: System.Gadget.path + "/sound/SFX_pack01.zip#/RPG Sound Pack/inventory/bubble2.aac"
 ,name: "item_potion_drink01"
      }
     ,{
  url: System.Gadget.path + "/sound/SFX_pack01.zip#/RPG Sound Pack/inventory/bottle.aac"
 ,name: "item_potion01"
 ,is_drag: true
      }
    ]
   ,action: {
  func: function () {
var c = MMD_SA_options.Dungeon.character
if (c.hp == c.hp_max)
  return true
c.hp_add(c.hp_max/2)
  }
    }
  };
}

[
  System.Gadget.path + '/images/_dungeon/item_icon.zip#/inventory/BlankSlot.png'
].forEach(function (url) {
  MMD_SA_options.Dungeon.blob_url.set(url)
});

// arrow function use parent's this
// https://betterprogramming.pub/difference-between-regular-functions-and-arrow-functions-f65639aba256
window.addEventListener("jThree_ready", () => {
  for (var id in this.item_base) {
    let item = this.item_base[id]
    if (!item.rarity)
      item.rarity = "normal"
    item.icon = new Image()
    System._browser.load_file(item.icon_path, item.icon)
  }
});
// dungeon general options default END

if (!MMD_SA_options.trackball_camera_limit)
  MMD_SA_options.trackball_camera_limit = { max:{ length:64*3 }, min:{} }
MMD_SA_options.trackball_camera_limit.min.y = -9

window.addEventListener("SA_MMD_trackball_camera_limit_adjust", (function () {
  var para = {
    filter: function (obj) {
      return obj.no_camera_collision
    }
  };
  return function (e) {
var eye = e.detail.eye

var d = MMD_SA_options.Dungeon
var camera_limit_scale = MMD_SA_options.Dungeon_options.options_by_area_id[d.area_id].camera_limit_scale || 1

// feel less glitchy than using MMD_SA.camera_position
var camera_pos = MMD_SA._v3a_.copy(d.character.pos); camera_pos.y += 10;//MMD_SA.camera_position;
var rv = ((d.ceil_material_index_default != -1) && (eye.y > d.ceil_height*camera_limit_scale*0.8)) || d.check_grid_blocking(MMD_SA.TEMP_v3.copy(eye).add(d.character.pos), d.grid_blocking_camera_offset) || (!d.no_camera_collision && d.check_ray_intersection(camera_pos, eye, para));
if (rv) {
//DEBUG_show(d.check_grid_blocking(MMD_SA.TEMP_v3.copy(eye).add(d.character.pos), d.grid_blocking_camera_offset)+'/'+Date.now())
  e.detail.result.return_value = rv
}
  };
})() );


window.addEventListener("MMDStarted", function (e) {

// UI START
(function () {
var ss = document.createElement('style')
ss.id = 'CSSdungeon'
document.head.appendChild(ss)

ss.sheet.insertRule([
  '.Dungeon_inventory_item_info_short:hover:after{'
// ,'background: #333;'
 ,'background: rgba(0,0,0,.8);'
 ,'border-radius: 5px;'
 ,'color: #fff;'
 ,'padding: 5px 5px;'
 ,'position: absolute;'
 ,'top:  -' + (5+5+12*1) + 'px;'
 ,'left: -16px;'
 ,'z-index: 999;'
 ,'width: 80px;'
 ,'height: ' + (5+5+12*1) + 'px;'
 ,'font-size:10px;'
 ,'content: attr(data-info_short);'
 ,'}'
].join('\n'), 0);

ss.sheet.insertRule([
  '.Dungeon_inventory_item_info:hover:after{'
// ,'background: #333;'
 ,'background: rgba(0,0,0,.8);'
 ,'border-radius: 5px;'
 ,'color: #fff;'
 ,'padding: 5px 5px;'
 ,'position: absolute;'
 ,'top:  -' + (5+5+12*7) + 'px;'
 ,'left: -16px;'
 ,'z-index: 999;'
 ,'width: 280px;'
 ,'height: ' + (5+5+12*7) + 'px;'
 ,'font-size: 10px;'
 ,'content: attr(data-info);'//"' + this.item.info + '";'//
// https://www.digitalocean.com/community/tutorials/css-line-break-content-property
// https://developer.mozilla.org/en-US/docs/Web/CSS/white-space
 ,'white-space: pre-wrap;'

 ,'transform-origin: bottom center;'
 ,'transform: scale(' + MMD_SA_options.Dungeon.inventory.UI.info.scale + ');'
 ,'}'
].join('\n'), 0);

ss.sheet.insertRule([
  '.Dungeon_inventory_item_info_display::after{'
// ,'background: #333;'
 ,'background: rgba(0,0,0,.8);'
 ,'border-radius: 5px;'
 ,'color: #fff;'
 ,'padding: 5px 5px;'
 ,'position: absolute;'
 ,'top: ' + ((is_mobile) ? -(5+5+12*7) : 'calc(-50vh + ' + (5+5+12*7 +50) + 'px)') + ';'
 ,'left: -16px;'
 ,'z-index: 999;'
 ,'width: 280px;'
 ,'height: ' + (5+5+12*7) + 'px;'
 ,'font-size: 10px;'
 ,'content: attr(data-info);'//"' + this.item.info + '";'//
// https://www.digitalocean.com/community/tutorials/css-line-break-content-property
// https://developer.mozilla.org/en-US/docs/Web/CSS/white-space
 ,'white-space: pre-wrap;'

 ,'transform-origin: bottom center;'
 ,'transform: scale(' + MMD_SA_options.Dungeon.inventory.UI.info.scale + ');'
 ,'}'
].join('\n'), 0);


const SB_tooltip = document.createElement('div');
SB_tooltip.id = 'SB_tooltip';
const _s = SB_tooltip.style;
_s.background = 'rgba(0,0,0,.8)';
_s.borderRadius = '5px';
_s.color = '#fff';
_s.padding = '5px 5px';
_s.position = 'absolute';
_s.zIndex = 999;
_s.width = '280px';
_s.height = (5+5+12*7) + 'px';
_s.fontSize = '10px';
_s.whiteSpace = 'pre-wrap';
_s.visibility = 'hidden';

_s.transformOrigin = 'top center';
_s.transform = 'scale(' + MMD_SA_options.Dungeon.inventory.UI.info.scale + ')';

document.getElementById('SL_Host').appendChild(SB_tooltip);


var d, ds;

var dungeon_UI = d = document.createElement("div")
ds = d.style
d.id = "Ldungeon_UI"
ds.position = "absolute"
ds.left = ds.top = '0px'
ds.zIndex = 2
ds.visibility = "inherit"
SL_Host.appendChild(d)

d = document.createElement("div")
ds = d.style
d.id = "Ldungeon_map"
ds.position = "absolute"
ds.backgroundColor = "rgba(0,0,0, 0.5)"
ds.zIndex = 2
ds.opacity = 0.75
ds.transformOrigin = "100% 100%"
dungeon_UI.appendChild(d)

d = document.createElement("canvas")
ds = d.style
d.id = "Cdungeon_map_canvas"
ds.position = "absolute"
ds.posLeft = ds.posTop = 8
ds.zIndex = 1
Ldungeon_map.appendChild(d)

d = document.createElement("canvas")
ds = d.style
d.id = "Cdungeon_map_compass_canvas"
d.width = d.height = 33
ds.position = "absolute"
ds.zIndex = 2
Ldungeon_map.appendChild(d)

if (MMD_SA_options.Dungeon_options.multiplayer) {
  for (var i = 1, i_max = MMD_SA_options.Dungeon_options.multiplayer.OPC_list.length; i <= i_max; i++) {
    d = document.createElement("div")
    ds = d.style
    d.id = "Ldungeon_map_spot_OPC" + i
    ds.position = "absolute"
    ds.backgroundColor = "yellow"
    ds.zIndex = 3
    Ldungeon_map.appendChild(d)
  }
}

d = document.createElement("div")
ds = d.style
d.id = "Ldungeon_map_spot"
ds.position = "absolute"
ds.backgroundColor = "white"
ds.zIndex = 3
Ldungeon_map.appendChild(d)

d = document.createElement("canvas")
ds = d.style
d.id = "Cdungeon_status_bar"
ds.position = "absolute"
ds.posLeft = 8
ds.posTop = 24+22+4
ds.zIndex = 3
ds.transformOrigin = "0% 0%"
dungeon_UI.appendChild(d)

d = document.createElement("div")
ds = d.style
d.id = "Ldungeon_inventory"
ds.position = "absolute"
ds.zIndex = 4
ds.transformOrigin = "50% 100%"
SL_Host.appendChild(d)

d = document.createElement("div")
ds = d.style
d.id = "Ldungeon_inventory_backpack"
ds.position = "absolute"
ds.zIndex = 3
ds.visibility = "hidden"
ds.transformOrigin = "50% 100%"
SL_Host.appendChild(d)

var inv = MMD_SA_options.Dungeon.inventory

var drop_item = function (index_source, index) {
  if (index_source == index) return

  var inv_source = inv.list[index_source]
  if (inv_source.item.is_base_inventory && (index >= inv.max_base)) {
    if (!MMD_SA_options.Dungeon.inventory.UI.muted)
      MMD_SA_options.Dungeon.sound.audio_object_by_name["interface_item_deny"].play();
    return
  }

  var inv_target = inv.list[index]
  if (inv_target.item.is_base_inventory && (index_source >= inv.max_base)) {
    if (!MMD_SA_options.Dungeon.inventory.UI.muted)
      MMD_SA_options.Dungeon.sound.audio_object_by_name["interface_item_deny"].play();
    return
  }

  if (!MMD_SA_options.Dungeon.inventory.UI.muted)
    MMD_SA_options.Dungeon.sound.audio_object_by_name[((inv_source.item.sound && inv_source.item.sound.find(function(i){return i.is_drag})) || {name:"interface_item_drop"}).name].play();

  if (inv_target.item?.on_drop) {
    inv_target.item.on_drop(inv_target, inv_source);
  }
  else {
    inv.swap(index_source, index);
  }
};

var _touchstart;
for (let r = 0, r_max = inv.max_row; r < r_max; r++) {
for (let i = 0, i_max = inv.max_base; i < i_max; i++) {
  let idx = r * i_max + i

  var d_inv = d = document.createElement("div")
  ds = d.style
  d.id = "Ldungeon_inventory_item" + idx
  d.className = "Dungeon_inventory_item_info_short"
  ds.position = "absolute"
  ds.posLeft = i * 64
  ds.posTop  = (r) ? (r-1)*64 : 0
  ds.width = ds.height = "64px"
  ds.backgroundImage = "url(" + MMD_SA_options.Dungeon.blob_url.get("BlankSlot.png") + ")"

  d.addEventListener("mouseover", function (e) {
const _idx = inv.get_inventory_index(idx);
var inv_item = inv.list[_idx]
inv_item.item.onmouseover && inv_item.item.onmouseover(e, _idx);

// not accessing .info directly as it may be a getter function
if ("info" in inv_item.item) {
  this.className = (System._browser.overlay_mode) ? 'Dungeon_inventory_item_info_short' : 'Dungeon_inventory_item_info';
  this.setAttribute("data-info", inv_item.item.info_short + ':\n' + inv_item.item.info);
}
  }, true);
  d.addEventListener("mouseout", function (e) {
const _idx = inv.get_inventory_index(idx);
var inv_item = inv.list[_idx]
inv_item.item.onmouseout && inv_item.item.onmouseout(e, _idx);
  }, true);

  d.draggable  = true
  d.addEventListener("mousedown", function (e) {
const _idx = inv.get_inventory_index(idx);
e.stopPropagation();
if (is_mobile) {
  e.preventDefault()
/*
  if (inv.item_selected_index != null) {
    if (Date.now() > _touchstart+500) {
      drop_item(inv.item_selected_index, _idx)
      inv.item_selected_index = null
    }
  }
  else if (inv.list[_idx].item_id) {
    inv.item_selected_index = _idx
    _touchstart = Date.now()
  }
*/
}
  }, true);
  d.addEventListener("dblclick", async function (e) {
const _idx = inv.get_inventory_index(idx);
e.stopPropagation();

inv.item_selected_index = null

var inv_item = inv.list[_idx]
if (!await inv_item.action_check()) {
  return
}

if (inv_item.item.action.func(inv_item.item, inv_item)) {
  if (!MMD_SA_options.Dungeon.inventory.UI.muted)
    MMD_SA_options.Dungeon.sound.audio_object_by_name["interface_item_deny"].play();
  return;
}

if (!MMD_SA_options.Dungeon.inventory.UI.muted && !inv_item.item.action.muted)
  MMD_SA_options.Dungeon.sound.audio_object_by_name[((inv_item.item.sound && inv_item.item.sound[0]) || {name:"interface_item_access"}).name].play();

if (inv_item.item.stock_max != 1) {
  if (--inv_item.stock == 0)
    inv_item.clear()
  else
    document.getElementById("Ldungeon_inventory_item" + idx + "_stock").textContent = inv_item.stock
}
  }, true);
/*
  if (is_mobile) {
    d.addEventListener("touchstart", (e)=>{});
    d.addEventListener("drag", (e)=>{});
// https://github.com/timruffles/mobile-drag-drop#polyfill-requires-dragenter-listener
    d.addEventListener("dragenter", (e)=>{ e.preventDefault(); });
  }
*/
  d.addEventListener("dragstart", function (e) {
const _idx = inv.get_inventory_index(idx);
if (!inv.list[_idx].item_id)
  return
e.stopPropagation();
e.dataTransfer.clearData();
e.dataTransfer.setData("text/plain", _idx);
e.dataTransfer.setDragImage(inv.list[_idx].item.icon, 30,30);
e.dataTransfer.dropEffect = "move";
  }, true);
  d.addEventListener("dragover", function (e) {
e.preventDefault();
e.dataTransfer.dropEffect = "move"
  });
  d.addEventListener("drop", function (e) {
const _idx = inv.get_inventory_index(idx);
e.stopPropagation();
e.preventDefault();
var index_source = e.dataTransfer.getData("text");
if (!index_source)
  return
//DEBUG_show(index_source,0,1)
drop_item(index_source, _idx);
  });

  if (r)
    Ldungeon_inventory_backpack.appendChild(d)
  else
    Ldungeon_inventory.appendChild(d)

  var img_icon = d = document.createElement("img")
  ds = d.style
  d.id = "Ldungeon_inventory_item" + idx + "_icon"
  ds.position = "absolute"
  ds.posLeft = ds.posTop = 0
  ds.zIndex = 1

  var img_border = d = document.createElement("img")
  ds = d.style
  d.id = "Ldungeon_inventory_item" + idx + "_border"
  ds.position = "absolute"
  ds.posLeft = ds.posTop = 0
  ds.zIndex = 2

  var d_stock = d = document.createElement("div")
  ds = d.style
  d.id = "Ldungeon_inventory_item" + idx + "_stock"
  ds.position = "absolute"
  ds.posLeft = 0
  ds.posTop = 64-10-8
  ds.pixelWidth = 64-8
  ds.textAlign = "right"
  ds.fontFamily = "Segoe Print,Segoe UI,Arial"
  ds.fontSize = "10px"
  ds.fontWeight = "bold"
  ds.color = "gold"
  ds.textShadow = "black 0px 0px 4px"
  ds.zIndex = 3

  d_inv.appendChild(img_icon)
  d_inv.appendChild(img_border)
  d_inv.appendChild(d_stock)
}
}

var draw_dungeon_map = function (e) {
  var d = MMD_SA_options.Dungeon

  var scale = Math.min(B_content_width, B_content_height) / (Math.max(d.RDG_options.width, d.RDG_options.height)*2)
  if (scale >= 8)
    scale = 8
  else if (scale >= 4)
    scale = 4
  else
    scale = 2

  if (d.map_display_scale != scale) {
    d.map_display_scale = scale

    Cdungeon_map_canvas.width  = d.RDG_options.width  * scale
    Cdungeon_map_canvas.height = d.RDG_options.height * scale

    var context = Cdungeon_map_canvas.getContext("2d")
    context.clearRect(0,0,Cdungeon_map_canvas.width,Cdungeon_map_canvas.height)
    for (var y = 0, y_max = d.RDG_options.height; y < y_max; y++) {
      for (var x = 0, x_max = d.RDG_options.width; x < x_max; x++) {
        if (d.get_para(x,y,true).hidden_on_map) {
          d.map_grid_drawn[y][x] = true
        }
        else if (d.map_grid_drawn[y][x]) {
          context.fillStyle = d.get_para(x,y,true).map_grid_color || "green"
          context.fillRect(x*scale,y*scale, scale,scale)
        }
      }
    }
  }

  var ds = Ldungeon_map.style
  var w = Cdungeon_map_canvas.width  + 16
  var h = Cdungeon_map_canvas.height + 16
  ds.pixelWidth  = w
  ds.pixelHeight = h
  ds.posLeft = B_content_width  - w - 8
  ds.posTop  = B_content_height - h - 8

  var spot_size = Math.min(scale/2, 2)
  Ldungeon_map_spot.style.pixelWidth = Ldungeon_map_spot.style.pixelHeight = spot_size
  if (MMD_SA_options.Dungeon_options.multiplayer) {
    for (var i = 1, i_max = MMD_SA_options.Dungeon_options.multiplayer.OPC_list.length; i <= i_max; i++) {
      ds = document.getElementById("Ldungeon_map_spot_OPC" + i).style
      ds.pixelWidth = ds.pixelHeight = spot_size
    }
  }
};

MMD_SA_options.Dungeon.update_status_bar = (function () {
  var canvas_status_bar = document.createElement("canvas")
  canvas_status_bar.width  = 256
  canvas_status_bar.height = 72

  var hp_width = 0

  var update_status_bar = function (always_update) {
var c = MMD_SA_options.Dungeon.character

var _hp_width = Math.round((256-56-2) * c.hp/c.hp_max)
if (!always_update && (hp_width == _hp_width))
  return
hp_width = _hp_width

var ctx = Cdungeon_status_bar.getContext("2d")

ctx.globalCompositeOperation = "copy";
ctx.drawImage(canvas_status_bar, 0,0);

if (!MMD_SA_options.Dungeon_options.combat_mode_enabled) return;

let hp_bar_color;
if (c.hp > 75) {
  hp_bar_color = "rgb(0,255,0)";
}
else {
  const g = (c.hp > 50) ? 255 : Math.round(64 + (c.hp/50)*(255-64));
  const r = Math.round(Math.pow((75-c.hp)/75,0.5)*255);
  hp_bar_color = "rgb("+r+","+g+",0)";
}

ctx.globalCompositeOperation = "destination-over";
ctx.fillStyle = hp_bar_color;
ctx.fillRect(56,56, hp_width,8);
ctx.fillStyle = "rgba(0,0,0, 0.5)";
ctx.fillRect(56,56, hp_width,8);
  }

  return function (always_update) {
if (!always_update) {
  update_status_bar()
  return
}

Cdungeon_status_bar.width  = 256
Cdungeon_status_bar.height = 72

var ctx = canvas_status_bar.getContext("2d")

ctx.globalCompositeOperation = "copy";
ctx.fillStyle = "white";
ctx.beginPath();
ctx.arc(36,36, 32, 0, 2*Math.PI);
ctx.fill();

ctx.globalCompositeOperation = "source-in";
var icon = MMD_SA_options.Dungeon.character.icon
ctx.drawImage(icon, 0,0,icon.width,icon.height, 4,4,64,64)

ctx.globalCompositeOperation = "destination-over";
ctx.fillStyle = "white";
ctx.beginPath();
ctx.arc(36,36, 36, 0, 2*Math.PI);
ctx.fill();

if (MMD_SA_options.Dungeon_options.combat_mode_enabled) {
  const gradient = ctx.createLinearGradient(0,0,(256-36),0);
  gradient.addColorStop(0,"white");
  gradient.addColorStop(0.5,"white");
  gradient.addColorStop(1,"rgba(255,255,255,0)");

  ctx.fillStyle = gradient; 
  ctx.fillRect(36,68,(256-36),4);
  ctx.fillRect(36,48,(256-36),4);

  ctx.fillStyle = "rgba(0,0,0, 0.75)";
  ctx.fillRect(56,64, (256-56),2);
  ctx.fillRect(56,54, (256-56),2);
  ctx.fillRect((256-2),56, 2,8);
}

update_status_bar(true)
  };
})();

var place_inventory = function (e) {
  Ldungeon_inventory.style.posLeft = Ldungeon_inventory_backpack.style.posLeft = (B_content_width - (inv.max_base)*64) * ((System._browser.overlay_mode && (Ldungeon_inventory.style.visibility == "hidden")) ? 1 : 0.5);
  Ldungeon_inventory.style.posTop  = B_content_height - 64 - 4
  Ldungeon_inventory.style.pixelWidth  = (inv.max_base)*64
  Ldungeon_inventory.style.pixelHeight = 64

  Ldungeon_inventory_backpack.style.posTop = B_content_height - (inv.max_row)*64 - 4
  Ldungeon_inventory_backpack.style.pixelWidth  = (inv.max_base)*64
  Ldungeon_inventory_backpack.style.pixelHeight = (inv.max_row)*64
}

var draw_UI = function (e) {
  draw_dungeon_map(e)
  place_inventory(e)
  MMD_SA_options.Dungeon.update_status_bar(true)
  Ldungeon_map.style.transform = Ldungeon_inventory.style.transform = Ldungeon_inventory_backpack.style.transform = Cdungeon_status_bar.style.transform = "scale(" + System._browser.css_scale + ")"
}

window.addEventListener("SA_Dungeon_after_map_generation", function (e) { draw_UI(); });
window.addEventListener("SA_resize", function (e) { draw_UI(); if (MMD_SA_options.Dungeon.started) MMD_SA_options.Dungeon.update_dungeon_blocks(true); });

})();
// UI END

// object motion START
(function () {
var Motion = function (obj, para) {
  this.obj = obj
  this.para = (obj.motion && Object.clone(obj.motion)) || para

  this.t_ini = 0
  this.path_index = 0
  this.path_alpha = 0
  this.pos_last  = new THREE.Vector3()
  this.mov_delta = new THREE.Vector3()
  this.rot_last  = new THREE.Vector3()
  this.rot_delta = new THREE.Vector3()
  this._paused = false

  if (this.para.path) {
    this.para.path.forEach(function (pt) {
if (pt.pos && !(pt.pos instanceof THREE.Vector3))
  pt.pos = new THREE.Vector3(pt.pos.x, pt.pos.y, pt.pos.z)
if (pt.rot && !(pt.rot instanceof THREE.Vector3))
  pt.rot = new THREE.Vector3(pt.rot.x, pt.rot.y, pt.rot.z)
    });
  }
}

Motion.prototype = {
  constructor: Motion

 ,get paused() {
return this._paused
  }

 ,set paused(v) {
v = !!v
if (this._paused == v)
  return
this._paused = v

if (v) {
  this._t_diff_paused = this._t - this.t_ini
}
else {
  this.t_ini = this._t - this._t_diff_paused
}
  }

 ,play: (function () {
var _v3 = new THREE.Vector3()
var _q  = new THREE.Quaternion()

var d = MMD_SA_options.Dungeon
var c = d.character

return function (t) {
  var that = this

  if (!t)
    t = performance.now()
  this._t = t

  if (this.paused) {
    this.para.onframestart && this.para.onframestart(this)
    return
  }

  var pt_ini = this.para.path[this.path_index]
  var pt_end = this.para.path[this.path_index+1]

  if (!this.t_ini) {
    this.t_ini = t
    if (pt_ini.pos)
      this.pos_last.copy(pt_ini.pos)
    if (pt_ini.rot)
      this.rot_last.copy(pt_ini.rot)
    return
  }

  if (this.ending_delay) {
    if ((t - this.t_ini) / 1000 < this.ending_delay)
      return
  }
  else {
    var mesh_obj = this.obj._obj
// the first frame of a new point
    if (!this.path_alpha) {
      if (!this.para.is_relative_path) {
        if (pt_ini.pos)
          mesh_obj.position.copy(pt_ini.pos)
        if (pt_ini.rot) {
          mesh_obj.rotation.copy(pt_ini.rot)
// no need to update quaternion here since path motion operates on rotation
//          if (mesh_obj.useQuaternion) mesh_obj.quaternion.setFromEuler(mesh_obj.rotation)
        }
      }
      pt_ini.onstart && pt_ini.onstart(this)
    }

    this.para.onframestart && this.para.onframestart(this)

    this.path_alpha = Math.min((t - this.t_ini) / 1000 / pt_ini.duration, 1)
    if (!pt_ini.animate || !pt_ini.animate(this)) {
      this.path_alpha_position = this.path_alpha_rotation = this.path_alpha
    }

    if (pt_ini.pos) {
      _v3.copy(pt_ini.pos).lerp(pt_end.pos, this.path_alpha_position)
      this.mov_delta.copy(_v3).sub(this.pos_last)
      this.pos_last.copy(_v3)
    }

    if (pt_ini.rot) {
      _v3.copy(pt_ini.rot).lerp(pt_end.rot, this.path_alpha_rotation)
      this.rot_delta.copy(_v3).sub(this.rot_last).multiplyScalar(Math.PI/180)
      this.rot_last.copy(_v3)
    }

//console.log(pt_ini.pos.toArray().join(",")+'/'+pt_end.pos.toArray().join(",")+'/'+mov_delta.toArray().join(","))
//console.log(mesh_obj.position.toArray().join(",")+'/'+mov_delta.toArray().join(","))
    if (this.para.check_collision) {
      d._mov[this.obj._index] = this.mov_delta.clone()
    }
    else {
      mesh_obj.position.add(this.mov_delta)
    }

    mesh_obj.rotation.add(this.rot_delta)
    if (this.obj.is_PC) {
      THREE.MMD.getModels()[0].mesh.quaternion.setFromEuler(mesh_obj.rotation)
      c.about_turn = false
      c.pos_update()
      MMD_SA._trackball_camera.SA_adjust(this.mov_delta)//, this.rot_delta)
    }
    else if (mesh_obj.useQuaternion) {
      mesh_obj.quaternion.setFromEuler(mesh_obj.rotation)
    }

    if (this.para.mounted_list) {
      this.para.mounted_list.forEach(function (mounted) {
        if (mounted == "PC") {
          if (c.ground_obj && (c.ground_obj.obj == that.obj)) {
            c.ground_obj.mov = that.mov_delta.clone()
          }
        }
        else {
          mounted._obj.position.add(that.mov_delta)
          mounted._obj.rotation.add(that.rot_delta)
          if (mounted._obj.useQuaternion)
            mounted._obj.quaternion.multiply(_q.setFromEuler(that.rot_delta))
        }
      });
    }

    this.para.onframefinish && this.para.onframefinish(this)
  }

  if (this.path_alpha == 1) {
    this.t_ini = t
    if (this.ending_delay)
      this.ending_delay = 0
    else if (pt_ini.ending_delay) {
      this.ending_delay = pt_ini.ending_delay
      this.mov_delta.set(0,0,0)
      this.rot_delta.set(0,0,0)
      if (this.para.mounted_list && (this.para.mounted_list.indexOf("PC") != -1)) {
        if (c.ground_obj && (c.ground_obj.obj == this.obj)) {
          c.ground_obj.mov = this.mov_delta.clone()
        }
      }
      return
    }

    this.path_alpha = 0
    pt_ini.onended && pt_ini.onended(this)
    if (++this.path_index == this.para.path.length-1) {
      this.path_index = 0
      if (this.para.loop == false) {
        this.paused = true
        if (this.obj.is_PC) {
          MMD_SA_options.Dungeon.character.path_motion = null
          MMD_SA_options.Dungeon.character.ground_obj = null
          MMD_SA.reset_camera()
        }
      }
    }
  }
};
  })()
}

MMD_SA_options.Dungeon.PathMotion = Motion;
})();
// object motion END


  window.addEventListener("SA_camera_adjust", function (e) {
if (MMD_SA_options.Dungeon.check_grid_blocking(MMD_SA.TEMP_v3.copy(e.detail.pos_v3).add(MMD_SA_options.Dungeon.character.pos), MMD_SA_options.Dungeon.grid_blocking_camera_offset)) {
  e.detail.result.return_value = true
}
else {
  var rot_delta = e.detail.rot_delta
  MMD_SA_options.camera_rotation[0] += rot_delta.x
  MMD_SA_options.camera_rotation[1] += rot_delta.y
  MMD_SA_options.camera_rotation[2] += rot_delta.z
}
  });

  var d = MMD_SA_options.Dungeon;

  d.check_collision = (function () {
var subject_bs, object_bs
var s, d, c, p, a, i, intersection, normal
var moved_final, _moved_final, moved_before_bb_check
var _v3, _v3a, _v3b, _v3c, _v3d, _v3e
var _q, _q2

subject_bs = new THREE.Sphere()
object_bs  = new THREE.Sphere()
s = new THREE.Vector3()
d = new THREE.Vector3()
c = new THREE.Vector3()
p = new THREE.Vector3()
a = new THREE.Vector3()
i = new THREE.Vector3()
intersection = new THREE.Vector3()
normal = new THREE.Vector3()
moved_final = new THREE.Vector3()
_moved_final = new THREE.Vector3()
moved_before_bb_check = new THREE.Vector3()
_v3  = new THREE.Vector3()
_v3a = new THREE.Vector3()
_v3b = new THREE.Vector3()
_v3c = new THREE.Vector3()
_v3d = new THREE.Vector3()
_v3e = new THREE.Vector3()
_q  = new THREE.Quaternion()
_q2 = new THREE.Quaternion()

var subject_bb, object_bb, ray, ray_normal, subject_bb_moved
var _m4, _bb, _c, _d, intersection2, s_bb, s_bb_moved
subject_bb = new THREE.Box3()
object_bb  = new THREE.Box3()
ray = new THREE.Ray()
ray_normal = new THREE.Ray()
subject_bb_moved = new THREE.Box3()

_bb = new THREE.Box3()
_m4 = new THREE.Matrix4()
_c = new THREE.Vector3()
_d = new THREE.Vector3()
s_bb = new THREE.Vector3()
s_bb_moved = new THREE.Vector3()

var character = MMD_SA_options.Dungeon.character
var bb_translate_offset = new THREE.Vector3()

var local_mesh_sorting_range_buffer = 8

return function (_subject, mov_delta, skip_ground_obj_check, para={}) {
  function center_rotate(q, inversed, restored) {
    var identity = (para.collision_centered) ? !inversed : inversed;
    identity = (restored) ? !identity : identity;
    if (identity) {
      return _q.set(0,0,0,1)
    }

    _q.copy(q)
    if (inversed)
      _q.conjugate()

    return _q
  }

  para._subject = _subject

  var use_bb_translate_offset
  var subject_is_PC = (_subject.obj == character)
  if (subject_is_PC) {
    if (!para.bb_translate)
      para.bb_translate = character.bb_translate
// bb_translate offset for mesh collision
    if (para.bb_translate && para.bb_translate._default) {
      use_bb_translate_offset = true
      bb_translate_offset.copy(para.bb_translate._default).sub(para.bb_translate)
    }
//DEBUG_show([para.bb_translate.x,para.bb_translate.y,para.bb_translate.z].join("\n")+"\n\n"+ bb_translate_offset.toArray().join("\n")+"\n\n"+ Date.now())
  }

  var that = this

  var subject = _subject.obj._obj

  subject_bs.copy(subject.geometry.boundingSphere)
  subject_bs.radius *= Math.max(subject.scale.x, subject.scale.y, subject.scale.z)
  var bb_translate
  if (para.bb_translate) {
    bb_translate = _v3a.set(subject_bs.radius,subject_bs.radius,subject_bs.radius).multiply(para.bb_translate).applyQuaternion(center_rotate(subject.quaternion))
    bb_translate.add(subject.position)
  }
  else {
    bb_translate = subject.position
  }
//var XYZ = bb_translate.clone()
//var DEF = subject_bs.center.clone()
  subject_bs.center.add(bb_translate)
//var ABC = subject_bs.center.clone()
  if (para.bb_expand) {
    subject_bs.radius *= Math.max(para.bb_expand.x, para.bb_expand.y, para.bb_expand.z) + 1
  }

  var null_move
  var mov_delta_length, moved_dis_max

// https://gamedev.stackexchange.com/questions/96459/fast-ray-sphere-collision-code
// s: the start point of the ray
  s.copy(subject_bs.center)
// d: a unit vector in the direction of the ray. 
  d.copy(mov_delta).normalize()

  var collision = false
  var collision_by_mesh_checked = false
  var collision_by_mesh_failed = false
  var obj_hit, ground_obj
  moved_final.copy(mov_delta).applyQuaternion(center_rotate(subject.quaternion, true))

  subject_bb.copy(subject.geometry.boundingBox)

// save some headache for octree intersect
  if (subject_bb.min.y < 0) subject_bb.min.y = 0;

/*
// save some headaches by setting xz center as (0,0), with equal xz size
  subject_bb.size(_v3)
  var _xz = (_v3.x+_v3.z)*0.5
  subject_bb.min.x = subject_bb.min.z = -_xz
  subject_bb.max.x = subject_bb.max.z =  _xz
*/

  subject_bb.size(_v3)
  if (para.bb_translate) {
    bb_translate = _v3a.copy(_v3).multiply(para.bb_translate).applyQuaternion(center_rotate(subject.quaternion))
    bb_translate.add(subject.position)
  }
  else
    bb_translate = subject.position
  if (para.bb_expand) {
    subject_bb.expandByVector(_v3b.copy(_v3).multiply(para.bb_expand).multiplyScalar(0.5))
//DEBUG_show(subject_bb.size(_v3).toArray())
  }

  if (use_bb_translate_offset) {
    if (para.bb_expand)
      bb_translate_offset.multiply(_v3a.copy(para.bb_expand).addScalar(1))
    bb_translate_offset.multiply(_v3).applyQuaternion(center_rotate(subject.quaternion))
//DEBUG_show(bb_translate_offset.toArray()+'n'+Date.now())
  }

// updating from .quaternion/.position instead of .matrixWorld should be more updated
  subject_bb.applyMatrix4(_m4.makeRotationFromQuaternion(center_rotate(subject.quaternion)))//subject.matrixWorld)//
  subject_bb.translate(bb_translate)
//  var b_center = subject.bones_by_name["センター"]
//  subject_bb.translate(_v3.copy(subject.position).add(b_center.position).sub(_v3a.fromArray(b_center.pmxBone.origin)))
  subject_bb.center(s_bb)


  ray_normal.set(_v3.copy(s_bb).add(_v3a.copy(d).multiplyScalar(-999)), d);

  var obj_base_dummy = { character_index:0 }
  var followed = {}
  if (subject_is_PC) {
    this.PC_follower_list.forEach(function (follower) {
      if (follower.obj && (follower.obj._obj.id != null))
        followed[follower.obj._obj.id] = true
    });
  }

  var obj_list
  if (para.object_list) {
    obj_list = para.object_list
  }
  if (MMD_SA.THREEX._object3d_list_) {
    obj_list = (obj_list||[]).concat(MMD_SA.THREEX._object3d_list_);
  }
  if (!obj_list || para.check_grid_blocks) {
    obj_list = (obj_list && obj_list.concat(this.grid_blocks.objs)) || this.object_list_in_view
    this.grid_blocks.update(subject.position)
  }

  obj_list.forEach(function (obj, idx) {
if (obj.is_dummy)
  return

if (obj._mesh == subject)
  return

if (obj.no_collision || MMD_SA_options.Dungeon.no_collision)
  return

var cache = obj._obj
if (!cache.visible)
  return

if (para.collision_by_mesh_disabled && obj.collision_by_mesh_enforced)
  return

if (subject_is_PC && (cache.id != null) && followed[cache.id])
  return

if (obj.oncollisioncheck && obj.oncollisioncheck(subject))
  return

var obj_base = obj._obj_base || that.object_base_list[obj.object_index] || obj_base_dummy;

object_bs.copy(obj._obj_proxy.boundingSphere)
object_bs.center.add(cache.position)

var object_scale = Math.max(cache.scale.x, cache.scale.y, cache.scale.z)
object_bs.radius *= object_scale * ((obj_base.construction && obj_base.construction.boundingSphere_radius_scale) || 1)//((obj_base.character_index != null) ? 0.5 : 1))

// c: the center point of the sphere
c.copy(object_bs.center)
// r: its radius
var r = object_bs.radius

null_move = !moved_final.x && !moved_final.y && !moved_final.z
mov_delta_length = moved_final.length()
moved_dis_max = subject_bs.radius + mov_delta_length

subject_bb_moved.copy(subject_bb).translate(moved_final).center(s_bb_moved)

var dis = s.distanceTo(c)
//if (para.filter_obj) DEBUG_show((ABC.distanceTo(subject.position)+'/'+XYZ.distanceTo(subject.position))+'\n'+dis+'\n'+subject.position.distanceTo(cache.position)+'\n'+(dis-subject.position.distanceTo(cache.position))+'\n'+s.length()+'\n'+c.length()+'\n'+Date.now())

// NOTE: _dis (distance between mesh sorted position and subject's current position) is scaled by obj's scale (object_scale).
var _dis = 0
var _collision_by_mesh_sort_range = 0
if (dis < (moved_dis_max + r) + ((that.use_local_mesh_sorting && local_mesh_sorting_range_buffer) || Math.min((obj.collision_by_mesh_sort_range||64)*0.5, r))) {
  cache.updateMatrixWorld()
  if (!that.use_octree && obj.collision_by_mesh_sort_range && !para.collision_by_mesh_disabled) {
    _v3.copy(s_bb).applyMatrix4(_m4.getInverse(cache.matrixWorld))
    let _index = (_subject.obj._index != null) ? _subject.obj._index+1 : 0;
    let mesh_sorted = obj.mesh_sorted = obj.mesh_sorted_list[_index] = obj.mesh_sorted_list[_index] || {};
if (that.use_local_mesh_sorting) {
  _dis = (mesh_sorted.position) ? Math.sqrt(Math.pow(mesh_sorted.position.x-_v3.x,2)+Math.pow(mesh_sorted.position.z-_v3.z,2)) + mov_delta_length/object_scale : 9999
  if (_dis > local_mesh_sorting_range_buffer/object_scale) {
    _collision_by_mesh_sort_range = Math.max(Math.min(Math.ceil(subject_bs.radius||10 + Math.sqrt(moved_final.x*moved_final.x+moved_final.z*moved_final.z)), obj.collision_by_mesh_sort_range) + local_mesh_sorting_range_buffer, 8) / object_scale
    mesh_sorted.position = _v3.clone()

    if (that.use_octree) {}
    else {
//    let _t = performance.now()

      mesh_sorted.index_list = that.mesh_sorting_worker.tree[obj.object_index].search({
minX: _v3.x-_collision_by_mesh_sort_range,
minY: _v3.z-_collision_by_mesh_sort_range,
maxX: _v3.x+_collision_by_mesh_sort_range,
maxY: _v3.z+_collision_by_mesh_sort_range
      }).map(function (a) { return a.index; });

//    console.log("Mesh sorted:" + obj._index + "," + mesh_sorted.index_list.length + "/" + (_collision_by_mesh_sort_range) + "-" + Math.round(performance.now()-_t) + "ms/" + Date.now())
    }
  }
}
else {
}
  }
}

if (dis > moved_dis_max+r) {
//if (obj.character_index == 0) DEBUG_show(dis+'/'+(moved_dis_max+r),0,1)
//if (obj.character_index==0 && para.filter_obj) DEBUG_show(dis+'/'+(moved_dis_max+r),0,1)
  return
}


if (obj._obj_proxy.boundingBox) {

  let move_blocked
  moved_before_bb_check.copy(moved_final)

  let hit_moved_once
  let collision_by_mesh = !para.collision_by_mesh_disabled && obj.collision_by_mesh

let skip_bb_index_list = []
obj._obj_proxy.boundingBox_list.some(function (bb, bb_idx) {
  if (skip_bb_index_list.indexOf(bb_idx) != -1)
    return

  if (para.filter_obj && !para.filter_obj(obj, bb, true)) {
    return
  }

  var _skip_ground_obj_check = skip_ground_obj_check || obj.skip_ground_obj_check

  if (!para.collision_centered) {
    object_bb.copy(bb).applyMatrix4(cache.matrixWorld)
  }
  else {
    _q.copy(center_rotate(subject.quaternion, true))
    object_bb.copy(bb).applyMatrix4(_m4.makeRotationFromQuaternion(_q2.copy(cache.quaternion).multiply(_q))).translate(_v3a.copy(subject.position).add(_v3.copy(cache.position).sub(subject.position).applyQuaternion(_q)))
  }
  object_bb.center(_c)

  var hit_moved = subject_bb_moved.isIntersectionBox(object_bb)
  if (hit_moved) {
    _bb.copy(subject_bb_moved).intersect(object_bb).size(_v3);
     if (_subject.mass && !null_move && obj.mass) {
      let feedback = 1 - obj.mass / (obj.mass + _subject.mass)
//feedback = 0.1
//if (subject._model_index > 0) DEBUG_show(feedback+'/'+Date.now())
/*
      var fb_x = Math.abs(moved_final.x) * feedback
      var fb_z = Math.abs(moved_final.z) * feedback
      feedback = Math.min(Math.min(fb_x,_v3.x)/fb_x, Math.min(fb_z,_v3.z)/fb_z)
*/
      _v3a.copy(moved_final).multiply(_v3b.set(feedback,1,feedback))
      object_bb.translate(_v3a)
      _c.add(_v3a)
      cache.position.add(_v3a.setY(0).applyQuaternion(center_rotate(subject.quaternion, false, true)))

      hit_moved = subject_bb_moved.isIntersectionBox(object_bb)
    }
  }

  if (!_skip_ground_obj_check && ((character.ground_obj && (character.ground_obj.obj == obj) && character.ground_obj.bb_y_scale[bb_idx]) || (Math.abs(subject_bb.min.y - object_bb.max.y) < 1))) {
    ray.set(_v3.copy(s_bb).setY(999), _v3a.set(0,-1,0))
    if (ray.intersectBox(object_bb, intersection)) {
      collision = true
      if (!ground_obj)
        ground_obj = character.ground_obj
      if (!ground_obj || (ground_obj.obj != obj))
        ground_obj = { obj:obj, bb_y_scale:{} }
      if (!ground_obj.bb_y_scale[bb_idx])
        ground_obj.bb_y_scale[bb_idx] = 1
    }
    else {
      if (character.ground_obj && (character.ground_obj.obj == obj))
        delete character.ground_obj.bb_y_scale[bb_idx]
    }
  }

// for simplicity
  if (!hit_moved) {
    if (bb.onaway) {
      let result = bb.onaway()
      if (result.blocked) {
collision = true
obj_hit = obj
moved_final.copy(_c).sub(s_bb).setY(0).normalize()
moved_before_bb_check.copy(moved_final)
subject_bb_moved.copy(subject_bb).translate(moved_final)
//collision_by_mesh = false
//DEBUG_show(moved_final.toArray())//,0,1)
move_blocked = true
return true
      }
    }
    return
  }
  else {
    hit_moved_once = true
    if (collision_by_mesh && !bb.oncollide && !bb.onaway)
      return
  }

  var hit = subject_bb.isIntersectionBox(object_bb)
//if (hit) DEBUG_show(Date.now())
//  _bb.copy(subject_bb).intersect(object_bb).size(_v3)
//  if (_v3.x<0.1 || _v3.y<0.1 || _v3.z<0.1) hit = false;

// intersected == intersection
  var intersected
  intersected = ray_normal.intersectBox(object_bb, intersection)
  if (!intersected) {
    ray.set(_v3.copy(_c).add(_v3a.copy(d).multiplyScalar(999)), _v3a.copy(d).negate())
    intersected = ray.intersectBox(subject_bb, intersection)
    if (intersected && !hit)
      object_bb.clampPoint(intersected,intersected)
  }

  if (!hit && !hit_moved && !intersected)
    return

  if (!intersected) {
    _d.copy(_c).sub(s_bb).normalize()
    ray.set(_v3.copy(s_bb).add(_v3a.copy(_d).multiplyScalar(-999)), _d)
    intersected = ray.intersectBox(object_bb, intersection)
  }

  if (!intersected)
    return

  if (!hit) {
    if (subject_bb.distanceToPoint(intersected) > mov_delta_length)
      return
  }

  _moved_final.copy(moved_final)
  if (bb.oncollide) {
    if (bb.skip_bb_index_list)
      skip_bb_index_list = skip_bb_index_list.concat(bb.skip_bb_index_list)

    let result = bb.oncollide({subject:subject, mov_delta:moved_final, null_move:null_move, skip_ground_obj_check:_skip_ground_obj_check, obj:obj, object_bb:object_bb, bb_idx:bb_idx, intersected:intersected, _moved_final:_moved_final, ground_obj:ground_obj})
    if (result) {
      if (result.returnValue != null) {
//DEBUG_show(Date.now())
        return result.returnValue
      }
      if (result.ground_obj)
        ground_obj = result.ground_obj
    }
  }
  else if ((!ground_obj || (ground_obj.obj == obj)) && (Math.abs(intersection.y - object_bb.max.y) < 0.001) && (intersection.y <= subject_bb.min.y + _moved_final.y + 2)) {
//console.log(intersection.y+'/'+object_bb.max.y)
    if (!_skip_ground_obj_check) {
      if (!ground_obj || (ground_obj.obj != obj))
        ground_obj = { obj:obj, bb_y_scale:{} }
      ground_obj.bb_y_scale[bb_idx] = 1
//console.log(bb_idx)
    }
  }
  else if (hit) {
    _bb.copy(subject_bb).intersect(object_bb)
    let y_diff = _bb.max.y - _bb.min.y

    let ground = ground_obj || character.ground_obj
    if (ground && (ground.obj == obj) && object_bb.containsPoint(_v3.copy(c).setY(_c.y))) {
      _moved_final.y = y_diff
    }
    else {
// push character back
      _moved_final.copy(s_bb).sub(_c)//.normalize().multiplyScalar(mov_delta_length)

      let xz = Math.sqrt(_moved_final.x*_moved_final.x + _moved_final.z*_moved_final.z)
      if (_bb.max.x - _bb.min.x < _bb.max.z - _bb.min.z) {
        _moved_final.x = (_moved_final.x) ? ((_moved_final.x>0)?1:-1)*xz : 0
        _moved_final.z = 0
      }
      else {
        _moved_final.z = (_moved_final.z) ? ((_moved_final.z>0)?1:-1)*xz : 0
        _moved_final.x = 0
      }
      if ((y_diff > (subject_bb.max.y - subject_bb.min.y)/2) || (y_diff > (object_bb.max.y - object_bb.min.y)/2))
        _moved_final.y = 0
      _moved_final.normalize().multiplyScalar(Math.max(mov_delta_length,1))
    }
  }
  else {
    _moved_final.copy(intersected).sub(_bb.copy(subject_bb).clampPoint(intersected, _v3)).multiplyScalar(0.75)
    if (_bb.translate(_moved_final).isIntersectionBox(object_bb) || (mov_delta_length/4 > _moved_final.length())) {
// blocked, for simplicity
      _moved_final.set(0,0,0)
    }
  }

  if (para.filter_obj && !para.filter_obj(obj, bb)) {
    return
  }

  collision = true
  obj_hit = obj
  moved_final.copy(_moved_final)
});

if (collision_by_mesh) {// && hit_moved_once) {
  collision_by_mesh_checked = true

// NOTE: I give up changing the mesh collision system to work with x/z rotation of the object (for now at least). It requires too many changes on existing codes, especially the part to get ground_y.
  let _t_ = performance.now();
  let result

  let subject_bb_MS = subject_bb
  let moved_before_bb_check_MS = moved_before_bb_check
  if (use_bb_translate_offset) {
    subject_bb_MS = subject_bb.clone().translate(bb_translate_offset)
    moved_before_bb_check_MS = moved_before_bb_check.clone().sub(bb_translate_offset)
  }


  null_move = !moved_before_bb_check_MS.x && !moved_before_bb_check_MS.y && !moved_before_bb_check_MS.z;
  const subject_bb_to_collide = (null_move) ? subject_bb_MS : subject_bb_moved;
  let mov_octree, result_octree, ground_octree;
  if (that.use_octree) {
// https://github.com/mrdoob/three.js/blob/master/examples/games_fps.html
    const THREEX = MMD_SA.THREEX.THREEX;

    const obj_m4_inv = _m4.getInverse(cache.matrixWorld);

    const height = subject_bb_to_collide.max.y - subject_bb_to_collide.min.y;
    const radius = height/8 * (obj_base.octree_collider_radius||1) *1.5;

    const pos = new THREE.Vector3();
    subject_bb_to_collide.center(pos);
    pos.y = subject_bb_to_collide.min.y;

    const c = new THREEX.Capsule( new THREEX.Vector3( 0, radius, 0 ), new THREEX.Vector3( 0, Math.max(height-radius*2, radius), 0 ), radius );
    c.translate(pos);

    c.start.applyMatrix4(obj_m4_inv);
    c.end.applyMatrix4(obj_m4_inv);
    c.radius /= object_scale;

    const mov_extended = _v3.copy(moved_before_bb_check_MS).add(cache.position).applyMatrix4(obj_m4_inv).setY(0).normalize();

    const octree = obj_base.octree;

    const ground_upper_limit = height/2;

    const ray_origin = _v3a.copy(pos);
    ray_origin.y += ground_upper_limit;
    const ray = new THREEX.Ray(ray_origin, new THREEX.Vector3(0,-1,0)).applyMatrix4(obj_m4_inv);

    const grounds = [];
    ground_octree = octree.rayIntersect(ray);
    grounds.push(ground_octree);

    ray_origin.copy(pos).add(mov_extended.multiplyScalar(radius));
    ray_origin.y += ground_upper_limit;
    grounds.push(octree.rayIntersect(ray));

    pos.applyMatrix4(obj_m4_inv).applyQuaternion(cache.quaternion);

    let ground_y = -9999;
    const grounded = [];
    grounds.forEach(g=>{
      if (!g) return;

      g.position.applyQuaternion(cache.quaternion);

      const y = g.position.y//+0.1;
      if (y - pos.y > ground_upper_limit) return;

      g.triangle.getNormal(_v3).applyQuaternion(cache.quaternion);
      if (_v3.y < 0.5) return;

      grounded.push(g);

      if (y < pos.y) return;

      ground_y = Math.max(y, ground_y);
    });

    const mov_offset = _v3b.set(0,0,0);
    if (ground_y > -9999) {
//DEBUG_show((ground_y - pos.y)+'/'+Date.now())
      mov_offset.y += ground_y - pos.y;
      c.translate(mov_offset);
      moved_before_bb_check.add(mov_offset.multiply(cache.scale));
    }

    result_octree = octree.capsuleIntersect(c);

    mov_octree = _v3a.set(0,0,0);
    if (result_octree) {
      mov_octree.add( result_octree.normal.multiplyScalar( result_octree.depth ) );
//DEBUG_show(mov_octree.toArray().join('\n'))
      if (!grounded.length) {
//applyMatrix4(obj_m4_inv)
        const face_v3 = MMD_SA.TEMP_v3.set(0,0,1).applyQuaternion(subject.quaternion).applyQuaternion(MMD_SA.TEMP_q.copy(cache.quaternion).conjugate()).normalize().multiplyScalar(result_octree.depth*1.5).negate();
        mov_octree.add(face_v3);
//DEBUG_show(result_octree.depth,0,1);
      }
	}

    result = {
      updated: !!result_octree,
      ground_y: (ground_octree) ? ground_octree.position.y : -9999,
    };
//DEBUG_show(result.updated+'/'+(result_octree.depth||0)+'/'+result.ground_y+'\n'+pos.toArray().join('\n'))
  }
  else {
    result = subject_bb_to_collide.intersectObject(obj, subject_bb_MS);
  }


  let pos_in_obj = new THREE.Vector3().copy(subject.position).applyMatrix4(_m4.getInverse(cache.matrixWorld));

  let ground_y;
  if (result.ground_y > -999) {
    ground_y = result.ground_y * object_scale + cache.position.y;

    let ground_y_current = ground_obj || character.ground_obj
    ground_y_current = ground_y_current && ground_y_current.bb_y_scale.mesh
//DEBUG_show(ground_y_current+'/'+Date.now())

// prevent big drop in height
    if ((ground_y_current != null) && (ground_y_current > ground_y+(obj.collision_by_mesh_drop_limit||999))) {
      result.bb_static_collided = result.updated = false
    }
// cancel drop if the ground is below certain limit
    else if ((obj.collision_by_mesh_ground_limit != null) && (ground_y < obj.collision_by_mesh_ground_limit)) {
      result.bb_static_collided = result.updated = false
    }
// ground_y+ fixes some possible glitches in ground level changes
    else if (!ground_obj || (ground_obj.bb_y_scale.mesh == null) || (ground_obj.bb_y_scale.mesh < ground_y+3)) {
//if (ground_obj && ground_obj.bb_y_scale.mesh > ground_y) DEBUG_show(ground_y_current+'/'+ground_obj.bb_y_scale.mesh+'/'+ground_y+'/'+Date.now())
      ground_obj = { obj:obj, bb_y_scale:{ mesh:ground_y } }
      collision = true
//DEBUG_show(ground_obj.bb_y_scale.mesh+'/'+Date.now())
    }
    else {
      ground_y = null
    }
  }

  if (that.use_octree) {
    if (result_octree && result.updated) {
      collision = true;
      obj_hit = obj;

      mov_octree.applyQuaternion(cache.quaternion).multiply(cache.scale);
      moved_final.copy(moved_before_bb_check).add(mov_octree);
//console.log(moved_final.toArray(), ground_y);
      if (ground_y) {
        that.character.ground_normal = (that.character.ground_normal || new THREE.Vector3(0,1,0)).lerp(ground_octree.triangle.getNormal(_v3).applyQuaternion(cache.quaternion), 0.5);
      }
    }
    else {
      moved_final.copy(moved_before_bb_check);
    }
    return;
  }

// old collision 01

}

  return;
}


// Calculate ray start's offset from the sphere center
//float3 p = s - c;
p.copy(s).sub(c);

//float rSquared = r * r;
//float p_d = dot(p, d);
var rSquared// = r * r;
var p_d = p.dot(d);

// The sphere is behind or surrounding the start point.
//if(p_d > 0 || dot(p, p) < rSquared)
// return NO_COLLISION;
if (p_d > 0)// || p.dot(p) < rSquared)
  return

if (subject_bs.intersectsSphere(object_bs)) {
  collision = true
  obj_hit = obj
  moved_final.copy(p).normalize().multiplyScalar(((r+subject_bs.radius)-dis)*0.95)
  return
}

// Flatten p into the plane passing through c perpendicular to the ray.
// This gives the closest approach of the ray to the center.
//float3 a = p - p_d * d;
a.copy(p).sub(_v3.copy(d).multiplyScalar(p_d));

//float aSquared = dot(a, a);
var aSquared = a.dot(a);

// AT: adding radius of both, since this case is a moving sphere instead of just a line
rSquared = r+subject_bs.radius;
rSquared *= rSquared;

//DEBUG_show(["s:"+s.toArray(),"d:"+d.toArray(),"c:"+c.toArray(),"r:"+r,"p:"+p.toArray(),"p_d:"+p_d,"a:"+a.toArray(),aSquared,rSquared].join("\n"))

// Closest approach is outside the sphere.
//if(aSquared > rSquared)
//  return NO_COLLISION;
if (aSquared > rSquared)
  return

// Calculate distance from plane where ray enters/exits the sphere.    
//float h = sqrt(rSquared - aSquared);
var h = Math.sqrt(rSquared - aSquared);

// Calculate intersection point relative to sphere center.
//float3 i = a - h * d;
i.copy(d).multiplyScalar(-h).sub(a);

//float3 intersection = c + i;
//float3 normal = i/r;
intersection.copy(c).add(i);
//normal.copy(i).multiplyScalar(1/r);

// We've taken a shortcut here to avoid a second square root.
// Note numerical errors can make the normal have length slightly different from 1.
// If you need higher precision, you may need to perform a conventional normalization.
//return (intersection, normal);

dis = intersection.distanceTo(s)
if (dis > moved_dis_max)
  return

collision = true
obj_hit = obj
moved_final.copy(intersection.sub(s))
  });

  this.grid_blocks.hide()

  if (!ground_obj || !ground_obj.bb_y_scale.mesh)
    this.character.ground_normal = null

//if (collision && obj_hit) console.log(mov_delta.toArray()+'\n'+moved_final.toArray())
  return ((collision) ? { moved_final:moved_final.applyQuaternion(center_rotate(subject.quaternion, false, true)), obj_hit:!!obj_hit, ground_obj:ground_obj, collision_by_mesh_checked:collision_by_mesh_checked, collision_by_mesh_failed:collision_by_mesh_failed } : { collision_by_mesh_checked:collision_by_mesh_checked, collision_by_mesh_failed:collision_by_mesh_failed });
};
  })();

  d.check_ray_intersection = (function () {
const THREEX = MMD_SA.THREEX.THREEX;

var object_bs  = new THREE.Sphere();
var object_bb  = new THREE.Box3();

var c = new THREE.Vector3();

var ray = new THREE.Ray();
var intersection = new THREE.Vector3();

var rayX = new THREEX.Ray();
var _m4 = new THREEX.Matrix4()

var _v3 = new THREE.Vector3();

return function (s, dir, para) {
  if (!para)
    para = {}

  var that = this

  var dis = dir.length()
  ray.set(s, _v3.copy(dir).normalize())

  var intersected = []
  var nearest = { distance:999999 }

  this.object_list.concat(MMD_SA.THREEX._object3d_list_||[]).forEach(function (obj, idx) {
if (obj.is_dummy)
  return

var cache = obj._obj
if (!cache.visible)
  return

if (obj.no_collision)
  return

if (para.filter && para.filter(obj))
  return

var obj_base = obj._obj_base || MMD_SA_options.Dungeon.object_base_list[obj.object_index];

object_bs.copy(obj._obj_proxy.boundingSphere)
object_bs.center.add(cache.position)
object_bs.radius *= Math.max(cache.scale.x, cache.scale.y, cache.scale.z) * ((obj_base.construction && obj_base.construction.boundingSphere_radius_scale) || ((obj_base.character_index) ? 0.5 : 1))

// c: the center point of the sphere
c.copy(object_bs.center)
// r: its radius
var r = object_bs.radius

if (s.distanceTo(c) > dis+r)
  return

if (!obj._obj_proxy.boundingBox)
  return

var skip_bb_index_list = [];
obj._obj_proxy.boundingBox_list.forEach(function (bb, bb_idx) {
  if (obj_base.construction && obj_base.construction.boundingBox_list && obj_base.construction.boundingBox_list[bb_idx] && obj_base.construction.boundingBox_list[bb_idx].no_camera_collision)
    return

  if (skip_bb_index_list.indexOf(bb_idx) != -1)
    return

  object_bb.copy(bb).applyMatrix4(cache.matrixWorld)
  if (!ray.intersectBox(object_bb, intersection))
    return

  var i_dis = s.distanceTo(intersection)
  if (i_dis > dis)
    return

  if (bb.skip_bb_index_list)
    skip_bb_index_list = skip_bb_index_list.concat(bb.skip_bb_index_list)

  const i_obj = { distance:i_dis, obj:obj, bb_index:bb_idx, oncollide:!!bb.oncollide }
  intersected.push(i_obj)
  if (nearest.distance > i_dis)
    nearest = i_obj
});

if (!obj_base.octree) return;

rayX.copy(ray);
rayX.applyMatrix4(_m4.copy(cache.matrixWorld).invert());
const octree_result = obj_base.octree.rayIntersect(rayX, true);
if (octree_result) {
  const i_dis = s.distanceTo(octree_result.position.applyMatrix4(cache.matrixWorld));
  if (i_dis > dis)
    return;

  const i_obj = { distance:i_dis, obj:obj };
  intersected.push(i_obj);
  if (nearest.distance > i_dis)
    nearest = i_obj;
}
  });

  return ((intersected.length && !nearest.oncollide) ? { nearest:nearest, intersected:intersected } : null)
};
  })();

  d.check_mouse_on_object = (function () {
var vectorMouse = new THREE.Vector3();

var bs = new THREE.Sphere()
var s, d, c, p, a, i, intersection, normal
s = new THREE.Vector3()
d = new THREE.Vector3()
c = new THREE.Vector3()
p = new THREE.Vector3()
a = new THREE.Vector3()
//i = new THREE.Vector3()
intersection = new THREE.Vector3()
//normal = new THREE.Vector3()

var ray = new THREE.Ray()
var bb = new THREE.Box3()

var _v3  = new THREE.Vector3()
var _v3a = new THREE.Vector3()

return function (e, obj_list) {
  var list_all_clickable;
  if (!e) {
    list_all_clickable = true
    e = { button:0 }
  }

  if (e.button !== 0) return;

  var that = this

  var camera = MMD_SA._trackball_camera.object

  if (list_all_clickable) {
    vectorMouse.set(0, 0, 0.5);
  }
  else {
// https://github.com/mrdoob/three.js/issues/5587
    vectorMouse.set(
   (e.clientX/B_content_width)  * 2 - 1
 ,-(e.clientY/B_content_height) * 2 + 1
 ,0.5
    );
    vectorMouse.unproject(camera).sub(camera.position).normalize();
//DEBUG_show(vectorMouse.toArray())
  }

  var obj_sorted = []
  var click_range_default = this.grid_size * this.view_radius * 0.5

  if (!obj_list)
    obj_list = this.object_list_click

  var is_dblclick = (e.type == "dblclick")

  var PC_pos = this.character.pos

  obj_list.forEach(function (obj) {
if (!obj.onclick)
  return

var cache = obj._obj
if (!cache.visible)
  return

var click_range = []
obj.onclick.forEach(function (click) {
  click_range.push((!list_all_clickable && (is_dblclick != !!click.is_dblclick)) ? 0 : (click.click_range || click_range_default) + ((click.boundingSphere_included) ? obj._obj_proxy.boundingSphere.radius*Math.max(cache.scale.x,cache.scale.y,cache.scale.z) : 0))
});

obj._click_index = -1
var dis = PC_pos.distanceToSquared(_v3.copy(obj._obj_proxy.boundingSphere.center).multiply(cache.scale).add(cache.position))
for (var i = 0, i_max = click_range.length; i < i_max; i++) {
  if (dis <= click_range[i]*click_range[i]) {
    obj._click_index = i
    break
  }
}
//console.log(obj,dis,click_range)
if (obj._click_index == -1)
  return

obj_sorted.push(obj)
obj._dis_from_PC = dis
  });

  if (!obj_sorted.length) {
//DEBUG_show("(no object clickable)")
    return
  }

  if (!list_all_clickable) {
    obj_sorted.sort(function (a,b) { return (a._sort_weight || b._sort_weight) ? (b._sort_weight||0)-(a._sort_weight||0): a._dis_from_PC - b._dis_from_PC; });
  }

// https://gamedev.stackexchange.com/questions/96459/fast-ray-sphere-collision-code
// s: the start point of the ray
  s.copy(camera.position)
// d: a unit vector in the direction of the ray. 
  d.copy(vectorMouse)
//console.log(camera)
//console.log([s.toArray(), vectorMouse.toArray(), camera.up.toArray()].join("\n"))

  var obj_clicked_list = []

  for (var k = 0, k_max = obj_sorted.length; k < k_max; k++) {
let obj = obj_sorted[k]
let cache = obj._obj

intersection.set(0,0,0)
if (obj._obj_proxy.boundingBox) {
  let bb_list = obj._obj_proxy.boundingBox_list || [obj._obj_proxy.boundingBox];

  let click = obj.onclick[obj._click_index]
  bb_list.some(function (b3, bb_idx) {
    if (bb_idx) {
      if (!click.func && !click.event_id && (!click.events || !click.events[bb_idx]))
        return
    }

    bb.copy(b3)
    if (obj._mesh.bones) {
      let _mesh = obj._mesh._mesh_parent || obj._mesh
      let b_center = _mesh.bones_by_name["センター"]
      if (b_center.pmxBone)
        bb.translate(_v3.copy(b_center.position).sub(_v3a.fromArray(b_center.pmxBone.origin)))
    }
    bb.applyMatrix4(cache.matrixWorld)
//console.log(bb)
    let e = click.events && click.events[bb_idx]
    if (e) {
      if ((e.is_dblclick != null) && (is_dblclick != e.is_dblclick))
        return
      let click_range = e.click_range
      if (click_range && (bb.center(_v3).distanceToSquared(PC_pos) > click_range*click_range))
        return
    }

    ray.set(s,d)
    if (list_all_clickable || ray.intersectBox(bb, intersection)) {
      let _obj = {}
      _obj.obj = obj
      if (bb_list.length > 1)
        _obj.bb_index = bb_idx
      obj_clicked_list.push(_obj)

      if (list_all_clickable) {
         bb.center(_v3)
         _v3.y = bb.min.y + Math.min(bb.max.y+3, 25)
        _obj.pos = _v3.clone()
      }
      else
        return true
    }
  });

  if (!list_all_clickable && obj_clicked_list.length)
    break
}
else if (list_all_clickable) {
  obj_clicked_list.push({obj:obj})
}
else {
  bs.copy(obj._obj_proxy.boundingSphere)
  bs.center.add(cache.position)
  bs.radius *= Math.max(cache.scale.x, cache.scale.y, cache.scale.z)

// collision detetcion START
// c: the center point of the sphere
  c.copy(bs.center)
// r: its radius
  let r = bs.radius

// Calculate ray start's offset from the sphere center
//float3 p = s - c;
  p.copy(s).sub(c);

//float rSquared = r * r;
//float p_d = dot(p, d);
  let rSquared = r * r;
  let p_d = p.dot(d);

// The sphere is behind or surrounding the start point.
//if(p_d > 0 || dot(p, p) < rSquared)
// return NO_COLLISION;
  if (p_d > 0 || p.dot(p) < rSquared)
    continue

// Flatten p into the plane passing through c perpendicular to the ray.
// This gives the closest approach of the ray to the center.
//float3 a = p - p_d * d;
  a.copy(p).sub(_v3.copy(d).multiplyScalar(p_d));

//float aSquared = dot(a, a);
  let aSquared = a.dot(a);

// Closest approach is outside the sphere.
//if(aSquared > rSquared)
//  return NO_COLLISION;
  if (aSquared > rSquared)
    continue

  obj_clicked_list.push({obj:obj})
  break

// Calculate distance from plane where ray enters/exits the sphere.    
//float h = sqrt(rSquared - aSquared);
//var h = Math.sqrt(rSquared - aSquared);

// Calculate intersection point relative to sphere center.
//float3 i = a - h * d;
//i.copy(d).multiplyScalar(-h).sub(a);

//float3 intersection = c + i;
//float3 normal = i/r;
//intersection.copy(c).add(i);
//normal.copy(i).multiplyScalar(1/r);

// We've taken a shortcut here to avoid a second square root.
// Note numerical errors can make the normal have length slightly different from 1.
// If you need higher precision, you may need to perform a conventional normalization.
//return (intersection, normal);
// collision detection END
}
  }

  if (list_all_clickable) {
    return obj_clicked_list
  }

  if (!obj_clicked_list.length)
    return

  var obj_clicked = obj_clicked_list[0].obj
  var bb_index_clicked = obj_clicked_list[0].bb_index

//  if (obj_clicked)
//    DEBUG_show(obj_clicked.object_index)
//  else
//    DEBUG_show("(nothing clicked)")

  var click = obj_clicked.onclick[obj_clicked._click_index]
  if (click.func) {
    click.func(e, intersection, bb_index_clicked)
  }
  else {
    this._event_active.obj = obj_clicked
    this.run_event((click.events && click.events[bb_index_clicked] && click.events[bb_index_clicked].id) || click.event_id)
  }

  return true
};
  })();


  (function () {
var d = MMD_SA_options.Dungeon

var obj_character = {
  _sort_weight:-99
 ,onclick:[{ is_dblclick:true, click_range:320, func:function (e, intersected) {
    if (!MMD_SA.MMD.motionManager.para_SA.object_click_disabled)
      window.dispatchEvent(new CustomEvent('SA_Dungeon_character_clicked', { detail:{ target:e.target, intersected:intersected } }));
  }}]
};
obj_character._obj_proxy = new Object3D_proxy_base(obj_character);

var _boundingBox_expand
var _v3 = new THREE.Vector3()

var e_func = function (e) {
  if (d.object_click_disabled) {
    return
  }

  var is_dblclick = (e.type == "dblclick")

  var obj_list
  if ((is_dblclick == obj_character.onclick[0].is_dblclick) && !MMD_SA.MMD.motionManager.para_SA.click_disabled) {
    obj_list = d.object_list_click.slice()

    const c_mesh = THREE.MMD.getModels()[0].mesh;
    obj_character._obj = obj_character._mesh = c_mesh;
    obj_list.push(obj_character);
  }
  else {
    obj_list = d.object_list_click
  }

  var clicked = d.check_mouse_on_object(e, obj_list)

  return clicked
};

var c_host = (returnBoolean("CSSTransform3DDisabledForContent")) ? document.getElementById("Lbody_host") : document.getElementById("Lbody")

var _mousedown_timestamp = 0

c_host.addEventListener( 'dblclick', function (e) {
  _mousedown_timestamp = 0
  if (e_func(e)) {
    e.stopPropagation();
    e.stopImmediatePropagation();
    e.preventDefault();
  }
});

c_host.addEventListener( 'mousedown', function (e) {
  _mousedown_timestamp = performance.now()
//  e_func(e)
});
c_host.addEventListener( 'click', function (e) {
  if (performance.now()-_mousedown_timestamp < 500)
    e_func(e)
  _mousedown_timestamp = 0
});

if (c_host.ondblclick) {
  c_host._ondblclick = c_host.ondblclick
  c_host.addEventListener( 'dblclick', c_host.ondblclick)
  c_host.ondblclick = null
}

  })();


//SA_MMD_model_all_process_bones
//SA_MMD_model0_process_bones
window.addEventListener("SA_MMD_model_all_process_bones", (function () {

var d = MMD_SA_options.Dungeon
var c = d.character
var movement_v3 = new THREE.Vector3()
var rotation_v3 = new THREE.Vector3()
var _movement_v3 = new THREE.Vector3()
var movement_extra_v3 = new THREE.Vector3()
var _v3a = new THREE.Vector3()
var _v3b = new THREE.Vector3()
var _v3c = new THREE.Vector3()
var _q = new THREE.Quaternion()
var _b3 = new THREE.Box3()

var dir_block = [null, ["x"],["z"],["y"], ["x","z"],["x","y"],["z","y"]];

var mov_delta = d._mov_delta = (function () {

  function DataLast() {
    this.by_motion = {}
  }
  DataLast.prototype.init = function (para) {
    var m = this.by_motion[para._index]
    if (!m) {
      m = this.by_motion[para._index] = { acceleration_mov_last:[], t:9999 }
      for (var i = 0, i_max = para.mov_speed.length; i < i_max; i++)
        m.acceleration_mov_last[i] = new THREE.Vector3()
    }
    return this
  };
  DataLast.prototype.reset = function (para) {
    this.by_motion[para._index].acceleration_mov_last.forEach(function (v3) { v3.set(0,0,0); });
  };

  var data_last = []
  window.addEventListener("SA_Dungeon_onrestart", function () {
    for (var i = 0, i_max = MMD_SA_options.model_para_obj_all.length; i < i_max; i++) {
      data_last[i] = new DataLast()
    }
  });

  return function (model, para, t_diff, t) {
var mov_speed = para.mov_speed
if (typeof mov_speed == "number")
  return movement_v3.set(0,0,t_diff*para.mov_speed)

/*
var motion_id = para.motion_id
if (d.motion[para.motion_id])
  motion_id = d.motion[para.motion_id].name
//(MMD_SA.motion[model.skin._motion_index].filename == motion_id)
*/
if (t == null)
  t = (MMD_SA.motion[model.skin._motion_index].para_SA == para) ? model.skin.time - t_diff : 0
if (t < 0)
  t = 0

var d_last = data_last[model._model_index].init(para)
var m = d_last.by_motion[para._index]
if (t + t_diff < m.t) {
//DEBUG_show(para._index+':'+t+'/'+m.t,0,1)
  d_last.reset(para)
}
m.t = t + t_diff

var y_accelerated
var t_diff_remaining = t_diff
for (var i = 0, i_max = mov_speed.length; i < i_max; i++) {
  var _t = t
  var obj = mov_speed[i]
  var t_start = obj.frame/30

  var mov_delta_finished
  if (t >= t_start) {
    mov_delta_finished = true
  }
  else if (t + t_diff >= t_start) {
    t_diff = (t + t_diff) - t_start
    _t = t_start
  }
  else
    continue

  if (obj.acceleration) {
    var _t_diff = (_t + t_diff) - t_start
    movement_v3.copy(obj.speed).multiplyScalar(_t_diff).add(_v3a.copy(obj.acceleration).multiplyScalar(0.5*_t_diff*_t_diff))

    _v3b.copy(movement_v3)
    movement_v3.sub(m.acceleration_mov_last[i])
    m.acceleration_mov_last[i].copy(_v3b)

    if (obj.acceleration.y)
      y_accelerated = true
  }
  else {
    movement_v3.copy(obj.speed).multiplyScalar(t_diff)
  }

  if (mov_delta_finished)
    break

  t_diff = t_diff_remaining - t_diff
}

// if y has been accelerated, make sure y is non-zero as a "trick" to indicate it's a floating motion
if (y_accelerated && !movement_v3.y)
  movement_v3.y = Number.MIN_VALUE
//DEBUG_show(movement_v3.y,0,1)
//DEBUG_show(t+'/'+t_diff,0,1)
return movement_v3
  };
})();


// key events START
  d._key_pressed = {}

  document.addEventListener("keyup", function (e) {
var k = e.keyCode
d._key_pressed[k] = 0

var key_map = d.key_map[k]
if (!key_map) {
  return
}
key_map.is_down = 0
key_map._data = null

if (key_map.onkeyup && key_map.onkeyup())
  return

if (key_map.motion_duration) return

if (key_map.type_combat && d.character_combat_locked) {
  if (d.character_combat_locked == key_map.id) {
    return
  }
}

key_map.down = 0
  });

  d.SA_keydown = function (e) {
const k = e.detail.keyCode;
const _e = e.detail.e;
const k_code = _e.code;

const result = {};
window.dispatchEvent(new CustomEvent("SA_Dungeon_keydown", { detail:{ e:_e, result:result } }));
if (result.return_value) {
  e.detail.result.return_value = true;
  return;
}

// use RAF_timestamp instead, making it easier to track if a key is pressed in the same frame
var t = RAF_timestamp//performance.now()
// Raw key press data. Avoid altering it besides keyboard events.
if (!d._key_pressed[k]) d._key_pressed[k] = t

var msg_branch_list = d.dialogue_branch_mode
if (msg_branch_list) {
// save some headaches and ignore alpha keys for now as it may affect movement and action
  if (!d._states.action_allowed_in_event_mode || ((k >= 96) && (k <= 96+9)) || ((k >= 48) && (k <= 48+9)))// || /Key[A-Z]/.test(k_code))
    e.detail.result.return_value = true;
  for (var i = 0, i_max = msg_branch_list.length; i < i_max; i++) {
    const branch = msg_branch_list[i]
    const sb_index = branch.sb_index || 0;
    const sb = MMD_SA.SpeechBubble.list[sb_index];

    if (branch.key == 'any') {
      const result = branch.func(e.detail.e);
      if (result) {
        e.detail.result.return_value = true;
        break;
      }
    }

    if (!is_mobile && (_e.ctrlKey || _e.shiftKey || _e.altKey)) break;

    const keys = (Array.isArray(branch.key)) ? branch.key : [branch.key];
    if (branch.is_closing_event) keys.push('Esc');

    const key_matched = keys.find(key=>{
if (typeof key == 'number') return (k == 96+key) || (k == 48+key);
if (key == 'Esc') return k_code == 'Escape';
return k_code == 'Key'+branch.key;
    });

    if (key_matched != null) {
      e.detail.result.return_value = true;

      if (MMD_SA_options.SpeechBubble_branch && MMD_SA_options.SpeechBubble_branch.confirm_keydown && (key_matched != sb._branch_key_) && (sb.msg_line.some(msg=>MMD_SA_options.SpeechBubble_branch.RE.test(msg)&&(RegExp.$1==key_matched)))) {
        sb._branch_key_ = key_matched
        sb._update_placement(true)
      }
      else {
        sb._branch_key_ = null;
        if (!branch.keep_dialogue_branch_list)
          d.dialogue_branch_mode = sb_index;

        branch.func?.();
        if ((branch.event_id != null) || (branch.branch_index != null) || (branch.event_index != null))
          d.run_event(branch.event_id, branch.branch_index, branch.event_index||0)
        else
          d.run_event()
      }
      break
    }
  }

  if (e.detail.result.return_value)
    return;
}
else {
  if (k_code == 'Escape') {
    if (System._browser.overlay_mode == 0) {
      System._browser.overlay_mode = System._browser.overlay_mode_TEMP = 1;
    }
    else if (System._browser.overlay_mode_TEMP) {
      System._browser.overlay_mode = System._browser.overlay_mode_TEMP = 0;
    }
    else {
      document.getElementById('Ldungeon_inventory').style.visibility = (document.getElementById('Ldungeon_inventory').style.visibility == 'hidden') ? 'inherit' : 'hidden';
    }
    e.detail.result.return_value = true;
    return;
  }
}

var key_map = d.key_map[k]
if (d._states.dialogue_mode && !msg_branch_list && (!key_map || !/^(up|left|down|right)$/.test(key_map.id))) {
  d.run_event()
  e.detail.result.return_value = true
  return
}

if (!key_map) {
//  DEBUG_show(k,0,1)
  return
}

_keydown(e, key_map, t)
  };

  window.addEventListener("SA_keydown", d.SA_keydown);

  var _keydown = (function () {
    var e_dummy = {detail:{result:{}}};
    return function (e, key_map, t) {
if (!e)
  e = e_dummy

var first_press
if (!key_map.is_down) {
  first_press = true
  key_map.is_down = t
}

if ((key_map.type_movement && (d.character_movement_disabled || e.detail.e?.altKey || e.detail.e?.ctrlKey)) || (key_map.type_combat && d.character_combat_locked)) {
  e.detail.result.return_value = true
  return
}

if (key_map.ondown && key_map.ondown(e))
  return

if (!key_map.down) {
  if (!d.character.grounded && (key_map.type_movement || key_map.type_combat) && !key_map.motion_can_float) {
// save some headaches and prevent unnecessary motion change/etc from the default keydown events
    e.detail.result.return_value = true
    return
  }
  key_map.down = t
  if (first_press && key_map.onfirstpress && key_map.onfirstpress(e))
    return
}

e.detail.result.return_value = true
    };
  })();

/*
function reset_key_map(id_list) {
  var keys
  if (id_list) {
    keys = []
    id_list.forEach(function (id) {
      keys.push(d.key_map_by_id[id])
    });
  }
  else
    keys = d.key_map_list

  keys.forEach(function (key_map) {
    key_map.down = 0
  });
}
*/
// key events END

var combat_para_default = (function () {
  var _v3a_cp = new THREE.Vector3()
  var _v3a = new THREE.Vector3()

  return {
  collision_by_mesh_disabled: true

 ,collision_centered: true

 ,filter_obj: function (obj, bb, simple_mode) {
    if (!obj.mass || !obj.hp)
      return false

    if (simple_mode)
      return true

    var attacker_index = this.combat_para.attacker.obj._index
    var attacker_combat_stats = this.combat_para.attacker.obj.combat_stats
// enforce PC (attack_index == -1) vs NPC (and vice versa)
//    if ((attacker_index == -1) ? false : (obj.character_index > 0)) return true

    var hit_obj = (bb.hp == null) ? obj : bb
    if (!hit_obj._combat_hit)
      hit_obj._combat_hit = {}

    var t = Date.now()
    var _hit = hit_obj._combat_hit[attacker_index] || {}
    var timestamp = _hit.timestamp || 0
// assuming no combat action hit range (same combat action index) is longer than 500ms
    var attack_ignored = _hit.combat_para && ((this.combat_para.para == _hit.combat_para.para) ? ((this.combat_para.index <= _hit.combat_para.index) && (t < timestamp+500)) : 0)//(t < timestamp+500))
//if (_hit.combat_para) DEBUG_show(JSON.stringify(this.combat_para.para)+'/'+Date.now()+'\n'+this.combat_para.index +','+ _hit.combat_para.index)
    if (!attack_ignored) {
      _hit = { combat_para:this.combat_para, timestamp:t }

      if (obj.character_index != null) {
        let vfx

        let combat_para = this.combat_para.para[this.combat_para.index]
        let hit_level = combat_para.hit_level || 1
        let model = THREE.MMD.getModels()[obj.character_index]
        let model_para = MMD_SA_options.model_para_obj_all[obj.character_index]
        let motion_para = MMD_SA.motion[model.skin._motion_index].para_SA

        let motion_prefix = (obj.character_index == 0) ? "PC " : "NPC-" + obj.character_index + " "

        let super_armor_level = (motion_para.super_armor && motion_para.super_armor.level) || 0

        let hit_motion, parried_level
        if (motion_para.combat_para) {
          if (d._combat_para.some(function(p){return(p.attacker.obj==obj);})) {
//DEBUG_show("Double HIT!",0,1)
//            hit_motion = "PC combat parry broken"
          }
          else {
            let frame_before_end = (combat_para.frame_range[1]-1) - this.combat_para.frame
            if (frame_before_end > 0) {
              let motion_frame = model.skin.time * 30 + Math.min(frame_before_end, 3)
              if (motion_para.combat_para.some(function(hit){return((motion_frame >= hit.frame_range[0]) && (motion_frame <= hit.frame_range[1]));})) {
//DEBUG_show("Double HITING!(" + (attacker_index+"vs"+obj._index) + ")",0,1)
                return false
              }
            }
          }
        }

        hit_obj._combat_hit[attacker_index] = _hit

        let super_armor_hit = (super_armor_level >= hit_level)

if (!super_armor_hit) {
        hit_motion = hit_motion || combat_para.hit_motion
        parried_level = motion_para.parry_level
        let NPC_parried_level = (obj.character_index != 0) && (obj.combat && obj.combat.parry_check(obj, this.combat_para))
        if (!parried_level) {
          if (obj.character_index == 0) {
            parried_level = motion_para.PC_parry_level
          }
          else {
            parried_level = ((motion_para.PC_parry_level || (!motion_para.motion_command_disabled && !motion_para.NPC_motion_command_disabled)) && NPC_parried_level) || 0
          }
        }
        if (parried_level) {
          if (parried_level >= hit_level) {
            hit_motion = motion_prefix + "combat parrying"
            vfx = "blocked"
          }
          else if (parried_level == hit_level - 1) {
            hit_motion = motion_prefix + "combat parry broken"
            vfx = "blocked"
          }
          else
            parried_level = 0
        }
}

        if (!parried_level) {
// damage
          if (d._states.combat) {
let damage = combat_para.damage
if (damage == null) {
  damage = (d._states.combat.enemy_list.length) ? Math.min(hit_level * 5, 20) * Math.min(1 + this.combat_para.index*0.2, 2) : 0
}
damage *= attacker_combat_stats.attack.scale * obj.combat_stats.defense.scale * ((super_armor_hit) ? (motion_para.super_armor.damage_scale || 0) : 1)
obj.hp_add(-damage)
//DEBUG_show(damage+'/'+Date.now())
if (damage && (obj.hp == 0)) {
  hit_motion = "PC combat hit down"
}
if ((damage > 0) || (!super_armor_hit && (damage == 0)))
  vfx = "hit"
          }
        }

        if (combat_para.SFX) {
          if (vfx) {
let para = { scale:1, speed:1, depth:1 }
if (combat_para.SFX.bone_to_pos) {
  let bone_to_pos = MMD_SA.get_bone_position(this.combat_para.attacker.obj._mesh, combat_para.SFX.bone_to_pos)
//console.log(bone_to_pos)
  _v3a_cp.copy(bone_to_pos)
  _v3a.copy(bone_to_pos).sub(obj._obj.position).setY(0)
  let radius = _v3a.length()
  _v3a_cp.sub(_v3a.normalize().multiplyScalar(Math.max(radius/2, radius-obj._obj.geometry.boundingSphere.radius)))

  para.pos = _v3a_cp.clone()
  if (combat_para.SFX.pos_offset)
    para.pos.add(combat_para.SFX.pos_offset)
}

let SFX_para = {}

if (combat_para.SFX.visual && combat_para.SFX.visual[vfx]) {
  if (combat_para.SFX.visual[vfx].sprite) {
    SFX_para.sprite = []
    combat_para.SFX.visual[vfx].sprite.forEach((s) => {
      SFX_para.sprite.push(Object.assign({}, para, s))
    });
  }
}
else {
  para.depth = null

  if (obj.combat_stats.hurt_vfx) {
    Object.assign(para, obj.combat_stats.hurt_vfx)
  }
  else {
    switch (vfx) {
      case "hit":
        para.name = "blood_01"
        break
      case "blocked":
        para.name = "hit_yellow_01"
        break
    }
  }
//  para.name = "blood_01"//"explosion_purple_01"//"hit_yellow_01"//
  if (hit_level == 1) {
    para.scale *= 0.5
    para.speed *= 2
  }
  else if (hit_level == 2) {
    para.scale *= 0.75
    para.speed *= 1.5
  }
  else if (hit_level > 3) {
    para.scale *= 1.5
    para.speed *= 1
  }

  SFX_para.sprite = [para];
}

model_para._SFX_one_time = model_para._SFX_one_time||[];
model_para._SFX_one_time.push(SFX_para);
//d.sprite.animate(para.name, para)
//console.log(_v3a_cp.clone())

if (combat_para.SFX.sound) {
  let sound = combat_para.SFX.sound[vfx]
  if (!sound)
    sound = { name:"hit-1" }
  let ao = d.sound.audio_object_by_name[sound.name]
  let mesh = this.combat_para.attacker.obj._mesh
  let spawn_id = sound.name + RAF_timestamp
  let po = ao.get_player_obj(mesh, spawn_id)
  if (!po) {
    ao.play(mesh, spawn_id)
  }
}
          }
        }

        if (super_armor_hit && !hit_motion)
          return

        if (!hit_motion) {
          switch (hit_level) {
case 1:
  hit_motion = motion_prefix + "combat hit small"
  break
case 2:
  hit_motion = motion_prefix + "combat hit medium"
  break
default:
  hit_motion = motion_prefix + "combat hit down"
          }
        }

        if (obj.character_index == 0) {
          this._attacker_list.push({ attacker:this._subject, hit_level:hit_level, motion_id:(d.motion[hit_motion] && d.motion[hit_motion].name) });
//DEBUG_show(hit_motion,0,1)
        }
        else {
          model_para._motion_name_next = (d.motion[hit_motion] && d.motion[hit_motion].name) || model_para.motion_name_default_combat
        }
      }
    }
    return true
  }

// ,_bb_expand: {x:0.5, y:0, z:0.5}
// ,_bb_translate: {x:0, y:0, z:0.5}
 ,_bb_expand: {x:(1+0.5)/_bb_xz_factor_-1, y:0, z:(1+0.5)/_bb_xz_factor_-1}
 ,_bb_translate: {x:0, y:0, z:0.5/_bb_xz_factor_}
  };
})();

if (MMD_SA_options.Dungeon_options.combat_para_default) {
  Object.assign(combat_para_default, MMD_SA_options.Dungeon_options.combat_para_default)
}

d.combat_para_process = function (attacker, combat_para_parent, frame) {
  combat_para_parent.combat_para.some(function (hit, idx) {
if ((frame >= hit.frame_range[0]) && (frame <= hit.frame_range[1])) {
  let hit_level = ((hit.hit_level && Math.min(hit.hit_level,3))||1)
  let sound_name = hit.sound_name || ("hit-" + hit_level)
  let ao = d.sound.audio_object_by_name[sound_name]
  if (!ao) {
    sound_name = "hit-1"
    ao = d.sound.audio_object_by_name[sound_name]
  }
  let mesh = attacker.obj._obj
  let spawn_id = sound_name+idx
  let po = ao.get_player_obj(mesh, spawn_id)
  if (!po || (Date.now() > po.timestamp+500)) {
    ao.play(mesh, spawn_id)
  }

  if (mesh._model_index == 0) {
    if ((hit_level > 1) && (frame > hit.frame_range[0] + Math.min(~~(hit.frame_range[1]-hit.frame_range[0])/2, 3))) {
      let model_para = MMD_SA_options.model_para_obj;
      model_para._SFX_one_time = model_para._SFX_one_time||[];
      model_para._SFX_one_time.push({ id:'cs'+idx, camera_shake:{magnitude:hit_level*0.2,duration:250} });
//DEBUG_show('cs'+idx,0,1)
    }
  }

  d._combat_para.push({ attacker:attacker, para:combat_para_parent.combat_para, motion_id:combat_para_parent.motion_id, index:idx, frame:frame })
  return true
}
  });
};

var time_last, time_diff, gravity_obj
var time_falling
/*
// a "hack" to make target-locking camera works
var rot_camera = {
  ini_count: 0
 ,ini_count_max: 2
 ,get enabled () { return (this.ini_count > this.ini_count_max); }
 ,v3: new THREE.Vector3()
}
d._rot_camera = rot_camera
*/
window.addEventListener("SA_Dungeon_onrestart", function () {
  time_last = 0
  gravity_obj = { y:0, mov_y_last:0, time:1/30 }

//  rot_camera.ini_count = 0

  time_falling = -10
});

var key_pressed_stats = {}

return function (e) {
//  var model = e.detail.model
  var model = THREE.MMD.getModels()[0]

  var grid_para = d.get_para(c.xy[0], c.xy[1])
  if (grid_para.onstay && grid_para.onstay())
    return

  if (d.check_states())
    return

// use performance.now() from topmost window (the same window where RAF_timestamp comes from), as this value can be different among different child windows
  var t = SA_topmost_window.performance.now()

  time_diff = Math.min((time_last) ? (t - time_last)/1000 : 1/30, 1/20)
  time_last = t

// a trick to simulate a keydown event on every physically pressed key (since the usual keydown event can't detect multiple keys pressed at the same time)
  d.key_map_list.forEach(function (key_map) {
if (key_map.is_down && !key_map.down) {
  _keydown(null, key_map, t)
}
  });

  d._combat_para = []
  d._mov = []
  d.object_list.forEach(function (obj) {
    obj.animate && obj.animate(t)
    obj.motion && obj.motion.play(t)
  });
  window.dispatchEvent(new CustomEvent("SA_Dungeon_object_animation"));

  if (c.path_motion) {
    c.path_motion.play(t)
    return
  }

//DEBUG_show(model.mesh.position.toArray())
//DEBUG_show(MMD_SA_options.Dungeon.character.pos)

  var mov, rot, about_turn, motion_id, can_lock_target
  var rot_absolute, rot_absolute_with_camera
  var motion_reset = []
  var mm = MMD_SA.MMD.motionManager

  var model_para = MMD_SA_options.model_para_obj_all[model._model_index]
  var para_SA = MMD_SA.MMD.motionManager.para_SA//(MMD_SA.motion[(model.skin||model.morph||{})._motion_index] || MMD_SA.MMD.motionManager).para_SA
  var pos_delta = MMD_SA.bone_to_position.call(model, para_SA)

  var key_motion_disabled = c.mount_para

  var TPS_mode = c.TPS_mode, TPS_mode_in_action, TPS_character_rotated, TPS_use_last_rot, TPS_camera_ry, TPS_camera_lookAt, TPS_camera_lookAt_
//TPS_mode = true
  if (c.combat_mode) {
    let combat = d._states.combat
    let target_enemy_index = combat._target_enemy_index
    if (target_enemy_index >= 0) {
      let enemy = combat.enemy_list[target_enemy_index]
      if (enemy.hp) {
        TPS_mode = true
        TPS_camera_lookAt_ = enemy._obj.position
      }
      else {
        do {
          if (++target_enemy_index >= combat.enemy_list.length)
            target_enemy_index = 0
          enemy = combat.enemy_list[target_enemy_index]
          if (enemy.hp)
            break
        } while (target_enemy_index != combat._target_enemy_index);
        if (target_enemy_index == combat._target_enemy_index) {
          combat._target_enemy_index = -1
        }
        else {
          combat._target_enemy_index = target_enemy_index
          TPS_mode = true
          TPS_camera_lookAt_ = enemy._obj.position
        }
      }
    }
  }
  c.TPS_camera_lookAt_ = TPS_camera_lookAt_

  var key_para  = { t:t }

// check if the upcoming motion change is .motion_command_disabled
if (MMD_SA._force_motion_shuffle) DEBUG_show(Date.now())
  var motion_command_disabled = para_SA.motion_command_disabled
  if (TPS_mode && !motion_command_disabled && MMD_SA._force_motion_shuffle && MMD_SA_options.motion_shuffle_list_default) {
    motion_command_disabled = MMD_SA.motion[MMD_SA_options.motion_shuffle_list_default[0]].para_SA.motion_command_disabled
DEBUG_show(MMD_SA_options.motion_shuffle_list_default[0]+'/'+Date.now())
  }

  var PC = { obj:c, mass:c.mass }
  var key_used = {}
  var any_key_down
  d.key_map_list.forEach(function (k) {
    var key_map = k//d.key_map[k.keyCode]
// prevent dummy keys from running
    if (key_used[k.keyCode]) {
//DEBUG_show(k.keyCode_default,0,1)
      return
    }
    key_used[k.keyCode] = true

    var id = k.id

    if (para_SA.motion_command_disabled) {
      key_map.down = 0
    }

    var key_motion_running
    var motion_time = 0
    if (key_motion_disabled) {
      if (key_map.down && key_map.motion_id) {
        var _motion_index = MMD_SA_options.motion_index_by_name[d.motion[key_map.motion_id].name]
        var _mm = MMD_SA.motion[_motion_index]
        key_motion_running =  !key_map._motion_time || (key_map._motion_time < _mm.lastFrame_/30)
      }
      if (key_motion_running) {
        if (!key_map._motion_time)
          key_map._motion_time = 0
        key_map._motion_time += (t - key_map.down)/1000
        motion_time = key_map._motion_time
      }
      else
        key_map._motion_time = 0
    }
    else {
      key_motion_running = (mm.filename == key_map.motion_filename)
      if (key_motion_running) {// && (!key_map.type_movement || !d.character_movement_disabled)) {
        motion_time = model.skin.time
      }
    }

// For one-time motion (ie. key_map.motion_duration, eg. jump), let it finish naturally
    if (key_map.down && (!key_map.motion_duration || !key_motion_running)) {
      if (key_map.type_movement && d.character_movement_disabled) {
        key_map.down = 0
      }
      if (key_map.type_combat && (!d.character.combat_mode || (d.character_combat_locked && (d.character_combat_locked != key_map.id))) ) {
        key_map.down = 0
      }
    }

    var key_map_by_mode

    if (TPS_mode)
      key_map_by_mode = key_map.TPS_mode
    if (!key_map_by_mode)
      key_map_by_mode = key_map

    if (key_map_by_mode.motion_filename && key_map.down) {
let _k = key_pressed_stats[k.keyCode] = key_pressed_stats[k.keyCode] || { first_press:0, pressed:0 };
if (mm.filename != key_map_by_mode.motion_filename) {
  _k.first_press = key_map.is_down
}
if (key_map.is_down) {
  if (_k.first_press)
    _k.pressed = t - _k.first_press
}
else {
// reset first_press to prevent repeated presses
  _k.first_press = 0
}
key_para.pressed = _k.pressed
//if (/jump/i.test(key_map_by_mode.motion_filename)) DEBUG_show(_k.pressed)
    }

    var t_diff, motion_duration, t2, motion_para
    var result
    if (key_map.onupdate) {
      if (key_map.down) {
        motion_para = key_map_by_mode.motion_id && d.motion[key_map_by_mode.motion_id].para
        t_diff = Math.min((t - key_map.down)/1000, time_diff) * ((motion_para && motion_para.playbackRate_by_model_index && motion_para.playbackRate_by_model_index[0]) || 1)
        key_para.t_diff = t_diff
      }
      result = key_map.onupdate(key_para)
    }
    if (result) {
      if (result.TPS_mode != null) {
        if (!result.TPS_mode)
          key_map_by_mode = key_map
      }
      if (result.return_value)
        return
    }

    var key_map_data = key_map._data || {}

    if (key_map.down) {
      any_key_down = true
      motion_para = key_map_by_mode.motion_id && d.motion[key_map_by_mode.motion_id].para
      t_diff = Math.min((t - key_map.down)/1000, time_diff) * ((motion_para && motion_para.playbackRate_by_model_index && motion_para.playbackRate_by_model_index[0]) || 1)
// always define .motion_duration for non-looping motion
      motion_duration = key_map_by_mode.motion_duration// || (46/30)
      if (motion_duration) {
//DEBUG_show((key_map==d.key_map[para_SA.keyCode])+'/'+para_SA.keyCode,0,1)
        t2 = ((key_motion_running) ? motion_time - t_diff: 0) + ((result && result.t2_extended) || 0)
//if (t2 < motion_duration) t_diff = Math.min(t_diff, motion_duration-t2)
        if (t2 < 0) { t_diff -= t2; t2 = 0; }
//DEBUG_show(t2+'/'+t_diff+'/'+motion_time,0,1)
//DEBUG_show(t2+t_diff,0,1)
      }

      if (key_map_by_mode.motion_id) {
        motion_id = key_map_by_mode.motion_filename
      }

      if (!motion_duration || (t2 < motion_duration)) {
// not sure if it may be better to use a local variable (let _TPS_mode_in_action) here
        TPS_mode_in_action = TPS_mode_in_action || (key_map_by_mode == key_map.TPS_mode)

        if (key_map_by_mode.mov_speed) {
          let _mov = (mov) ? _movement_v3.copy(mov) : null
// .mov_speed can change among modes, safer to reassign it
          motion_para.mov_speed = key_map_by_mode.mov_speed
          mov = mov_delta(model, motion_para, t_diff, t2).multiplyScalar(key_map_data.scale||1)
          if (_mov) {
            let mov_length = mov.length()
            mov.lerp(_mov, 0.5).normalize().multiplyScalar(Math.max(_mov.length(), mov_length))
          }
        }

        if (pos_delta && key_motion_running)
          mov = (mov) ? mov.add(pos_delta) : movement_v3.copy(pos_delta)

//if (pos_delta && key_map.keyCode==105) { DEBUG_show(key_map.keyCode+'/'+Date.now()); console.log(key_map); }
        if (key_map_by_mode.rot_speed) {
          rot = rotation_v3.copy(key_map_by_mode.rot_speed).multiplyScalar(t_diff * (key_map_data.scale||1))
        }

        if (TPS_mode_in_action) {
          if (!TPS_camera_lookAt_) {
            let camera = MMD_SA._trackball_camera
            TPS_camera_ry = Math.PI/2 - Math.atan2((camera.target.z-camera.object.position.z), (camera.target.x-camera.object.position.x))
            c.camera_TPS_rot.set(0,TPS_camera_ry,0)
          }
          else {
            TPS_camera_ry = c.camera_rotation_from_preset.y// + c.camera_TPS_rot.y
            c.camera_TPS_rot.set(0,0,0)
          }
//TPS_camera_ry=0

//TPS_character_rotated = key_map_by_mode.mov_to_rot_absolute
// case: use mov direction as rotation
          if (key_map_by_mode.mov_to_rot_absolute && (mov && (mov.x || mov.z))) {
            TPS_character_rotated = true
            rot = rotation_v3.set(0, Math.PI/2 - Math.atan2(mov.z, mov.x), 0)
            if (!TPS_camera_lookAt_) {
              let cy = (c.rot.y - TPS_camera_ry) % (Math.PI*2)
              let r_diff = (cy - rot.y) % (Math.PI*2)
              if (Math.abs(r_diff) > Math.PI)
                r_diff = r_diff + Math.PI*2 * ((r_diff>0)?-1:1)
              let r_max = Math.PI/8 * time_diff*30
              if (Math.abs(r_diff) > r_max) {
                rot.y = cy + r_max * ((r_diff>0)?-1:1)
              }
            }
//DEBUG_show(rot.y*180/Math.PI+'\n'+TPS_camera_ry*180/Math.PI+'\n'+Date.now())
          }
// case: no rotation from mov
          else if (key_map_by_mode.no_rotation) {
// if TPS_camera_lookAt_ exists (e.g. combat mode with target locked), use TPS_camera_lookAt_ rotation (will be added to rot later)
            if (TPS_camera_lookAt_) {
              rot = rotation_v3.set(0,0,0)
            }
// otherwise, use PC's current rotation (minus TPS_camera_ry which will be added to rot later)
            else {
              rot = rotation_v3.copy(c.rot)
              rot.y -= TPS_camera_ry
              if (motion_id && (motion_id == key_map_by_mode.motion_filename) && /^(.+)(forward|right|backward|left)$/.test(key_map_by_mode.motion_id)) {
                let dir = ["forward","right","backward","left"]
                let dir_index = Math.round(dir.indexOf(RegExp.$2) - (-rot.y / (Math.PI/2))) % 4
                if (dir_index < 0) dir_index += 4
                let motion = d.motion[RegExp.$1 + dir[dir_index]]
                if (motion)
                  motion_id = motion.name
//DEBUG_show(motion_id + '\n' + rot.y*(180/Math.PI)+'\n'+Date.now())
              }
            }
          }
          else {
            TPS_use_last_rot = true
//            rot = rotation_v3.set(0,0,0)
            rot = rotation_v3.copy(c.rot)
//            rot.y -= TPS_camera_ry
            if (mov)
              mov.applyEuler(rot)
          }
        }

        if (key_map_by_mode.about_turn != null) {
          if (c.about_turn == !key_map_by_mode.about_turn) {
            c.about_turn = key_map_by_mode.about_turn
            about_turn = true
          }
        }

        if (key_map.type_combat) {
          if (!d.character_combat_locked) {
            d.character_combat_locked = id
            can_lock_target = true
          }
          if (t2 && key_map_by_mode.combat_para) {
            d.combat_para_process(PC, key_map_by_mode, t2*30)
          }
        }

        if (key_map_by_mode.key_id_cancel_list) {
          key_map_by_mode.key_id_cancel_list.forEach(function (kc_id) {
            if (d.key_map_by_id[kc_id])
              d.key_map_by_id[kc_id].down = 0
          });
        }

        key_map.down = t
      }
      else {
        if (key_map_by_mode.motion_id)
          motion_reset.push(key_map_by_mode)

        var key_id_cancel_list = (key_map_by_mode.key_id_cancel_list) ? key_map_by_mode.key_id_cancel_list.slice() : []
        if (key_map.type_combat) {
          if (d.character_combat_locked == id) {
            d.character_combat_locked = null
            key_id_cancel_list.push("up","down","left","right")
          }
        }

        key_id_cancel_list.forEach(function (kc_id) {
          var km = d.key_map_by_id[kc_id]
          if (!d.character_movement_disabled && km.type_movement) {
            if (km.is_down)
              km.down = t
          }
        });

        key_map.down = 0
      }
    }
    else {
      if (key_map_by_mode.motion_id && (!key_map.type_movement || !d.character_movement_disabled)) {
        motion_reset.push(key_map_by_mode);
      }

      if (key_map.type_combat) {
        if (d.character_combat_locked == id) {
          d.character_combat_locked = null
        }
      }
    }
  });


  var reset_motion = !mov// || (!mov.x && !mov.y && !mov.z)
//if (reset_motion) DEBUG_show(Date.now())

//  var use_rot_camera
  c.camera_TPS_mode = TPS_mode//TPS_mode_in_action
//if (TPS_mode) DEBUG_show(Date.now())
  if (TPS_mode_in_action) {
    if (!mov)
      mov = movement_v3.set(0,0,0)
    c.about_turn = about_turn = false

    let rot_self = _v3b.set(0,0,0)
    TPS_camera_lookAt = TPS_camera_lookAt_
    if (TPS_use_last_rot) {
      TPS_camera_lookAt = TPS_camera_lookAt_ = null
    }
    else if (TPS_camera_lookAt) {
let cy = Math.PI/2 - Math.atan2((TPS_camera_lookAt.z-c.pos.z), (TPS_camera_lookAt.x-c.pos.x))
mov.applyEuler(_v3a.set(0,TPS_camera_ry+cy,0))

if (TPS_character_rotated) {
  rot.y += TPS_camera_ry
  rot_self.copy(rot)
}
rot.copy(_v3a.set(0,cy,0))

/*
if (++rot_camera.ini_count <= rot_camera.ini_count_max+1) {
  rot_camera.v3.set(0,0,0)
  MMD_SA.reset_camera()
}
use_rot_camera = true
*/
// always reset when not using rot_camera
MMD_SA.reset_camera()
    }
    else if (TPS_camera_ry) {
      _v3a.set(0,TPS_camera_ry,0)
      mov.applyEuler(_v3a)
      rot.add(_v3a)
    }

    c.rot.copy(rot_self)
    model.mesh.quaternion.setFromEuler(rot_self)
  }
//if (rot) DEBUG_show(rot.y*180/Math.PI+'\n'+c.rot.y*180/Math.PI+'\n'+TPS_mode_in_action+'\n'+(d.key_map_list.map(function(k){return((k.down)?k.id:0)}))+'\n'+para_SA._path+'\n'+Date.now())
//  if (!use_rot_camera && (mov || rot)) rot_camera.ini_count = 0;

  if (mov)
    mov.multiplyScalar((c.mount_para && c.mount_para.speed_scale) || c.speed_scale)

// check ground movement START
  var ground_y = d.get_ground_y(c.pos)
  if (c.ground_obj) {
    const g = c.ground_obj.obj;
    const g_obj = g._obj;
    for (var index in c.ground_obj.bb_y_scale) {
      ground_y = (index == "mesh") ? Math.max(((c.ground_obj.obj.collision_by_mesh_enforced)?-999:ground_y), c.ground_obj.bb_y_scale.mesh) : Math.max(ground_y, g._obj_proxy.boundingBox_list[index].max.y * g_obj.scale.y * c.ground_obj.bb_y_scale[index] + g_obj.position.y)
    }
  }
  var ground_y_delta = 0
  var floating = c.floating || (mov && mov.y)// || d.key_map[32].down
  var gravity_y = 0
  var time_to_ground
  const falling_height_threshold = MMD_SA_options.Dungeon_options.falling_height_threshold || 10;
  if (!floating) {
    let v = (gravity_obj.y + gravity_obj.mov_y_last) / gravity_obj.time
// downward is positive
    gravity_y = v * time_diff + 0.5 * (98*1.5) * time_diff * time_diff
//DEBUG_show(gravity_y+'/'+Date.now()+'\n'+gravity_obj.y +','+ gravity_obj.mov_y_last)
//if (gravity_y > 3) DEBUG_show(gravity_y,0,1)
//gravity_y=3
    if (c.pos.y > ground_y+falling_height_threshold) {
// http://www.math.com/students/calculators/source/quadratic.htm
      let _a = 0.5 * (98*1.5)
      let _b = v
      let _c = -(c.pos.y - ground_y)
      let _x0 = Math.pow(Math.pow(_b,2)-4*_a*_c,0.5)/2/_a;
      time_to_ground = -_b/2/_a + _x0
      if (!(time_to_ground > 0))
        time_to_ground = -_b/2/_a - _x0
    }
  }
  if (!floating || (c.pos.y < ground_y)) {
    ground_y_delta = (c.pos.y > ground_y + gravity_y) ? -gravity_y : ground_y - c.pos.y
// if ground_obj.mov and not free falling (up or down)
    if (c.ground_obj && c.ground_obj.mov && ((Math.abs(ground_y_delta) != Math.abs(gravity_y)) || (gravity_y < 0.1))) {
      if (!mov)
        mov = movement_v3.set(0,0,0)
      mov.add(_v3a.copy(c.ground_obj.mov).applyQuaternion(_q.copy(model.mesh.quaternion).conjugate()))
    }
  }
//if (mov) DEBUG_show(!!floating + '\n' + mov.y+'\n'+ground_y+'/'+Date.now())
//if (c.ground_obj) console.log(JSON.stringify(c.ground_obj.bb_y_scale)+'/'+ground_y+'/'+ground_y_delta)

// downward movement only for simplicity
  gravity_obj.mov_y_last = (mov && (mov.y < 0)) ? -mov.y : 0
  gravity_obj.time = time_diff
  if (!floating)
    gravity_obj.y = gravity_y
  else
    gravity_obj.y = 0
// check ground movement END

  if (rot) {
    c.rot.add(rot)
    model.mesh.quaternion.multiply(MMD_SA.TEMP_q.setFromEuler(rot))
  }

// always initialize mov, to check collision against moving objects
  if (!mov)
    mov = movement_v3.set(0,0,0)
  var null_mov = !mov.x && !mov.y && !mov.z

  var moved
  if (c.about_turn) {
    mov.x = -mov.x
    mov.z = -mov.z
  }
  _v3a.copy(mov)
  if (!TPS_mode_in_action)
    _v3a.applyEuler(c.rot)

// check falling
//MMD_SA.playbackRate = 1
  model_para._playbackRate = 1
// time_falling is negative on map restart, to prevent false falling scenario on startup when the character is grounded even though initial ground_y is negative (usually when stage object is used).
  if (time_falling < 0) {
    time_falling++
  }
  else {
    let landing = (mm.filename == d.motion["PC landing"].name)
    let falling = (!key_motion_disabled && (ground_y_delta < 0) && (c.pos.y > ground_y+falling_height_threshold))
    if (falling || (landing && !c.grounded)) {
      if (!landing) {
        d.key_map_list.forEach(function (key_map) {
          if (mm.filename == key_map.motion_filename) {
            key_map.down = 0
            if (key_map.type_combat) {
              if (d.character_combat_locked == key_map.id) {
                d.character_combat_locked = null
              }
            }
          }
        });
        time_falling = 0
      }
      else {
        time_falling += time_diff
      }

      motion_id = null
      mov.copy(c.inertia).multiplyScalar(time_diff * Math.pow(0.95, time_diff*30))
      null_mov = !mov.x && !mov.y && !mov.z
      if (about_turn) {
        c.about_turn = !c.about_turn
        about_turn = false
      }
//d.character_movement_disabled = true
    }
//else if (landing) d.character_movement_disabled = false

    if (falling) {
      if (time_to_ground > 5/30) {
//DEBUG_show(time_to_ground,0,1)
        if (!landing) {
          MMD_SA_options.motion_shuffle_list_default = [MMD_SA_options.motion_index_by_name[d.motion["PC landing"].name]]
          MMD_SA._force_motion_shuffle = true
        }
        model_para._playbackRate = 0.001

// "dummy" motion_id as if it's a key with motion
        motion_id = d.motion["PC landing"].name
// not needed anymore
        reset_motion = false
      }
    }
    else if (landing && (time_falling > 0.8)) {
//DEBUG_show(time_falling)
      if (!d.event_mode)
        d.character_movement_disabled = true
      if ((time_falling > 1.2) && c.grounded) {
d.sound.audio_object_by_name["hit-3"].play(model.mesh)
MMD_SA_options._motion_shuffle_list = [MMD_SA_options.motion_index_by_name["r01_普通に転ぶ"], MMD_SA_options.motion_index_by_name["OTL→立ち上がり"]]
MMD_SA_options.motion_shuffle_list_default = null
MMD_SA._force_motion_shuffle = true
      }
    }
    else {
      time_falling = 0
    }
  }

// combat_para START
  var _pos_restored = []
  movement_extra_v3.copy(model.mesh.position)

// check hit-box collision among combat characters
  combat_para_default._attacker_list = []
  d._combat_para.forEach(function (para) {
    combat_para_default.combat_para = para
    var attacker = para.attacker
    if (attacker != PC) {
      combat_para_default.object_list = [c]
      let mesh = attacker.obj._obj
// reset the position that has been modified in jThree.MMD.js
      if (mesh._bone_to_position_last) {
        mesh.position.sub(mesh._bone_to_position_last.pos_delta_rotated)
        _pos_restored[attacker.obj._index] = true
      }
    }
    else
      combat_para_default.object_list = null

// ,_bb_expand: {x:0.5, y:0, z:0.5}
// ,_bb_translate: {x:0, y:0, z:0.5}
    var para_hit = para.para[para.index]
    combat_para_default.bb_expand    = para_hit.bb_expand    || combat_para_default._bb_expand//{x:0,y:0,z:99}//
    combat_para_default.bb_translate = para_hit.bb_translate || combat_para_default._bb_translate

    d.check_collision(attacker, ((attacker != PC)?(d._mov[attacker.obj._index]||new THREE.Vector3()):_v3a), true, combat_para_default);
  });
  var motion_id_enforced = combat_para_default._attacker_list.length

  if (motion_id_enforced) {
    var hit_para = combat_para_default._attacker_list.sort(function (a,b) { return a.hit_level-b.hit_level; }).pop()
    motion_id = hit_para.motion_id
//DEBUG_show(motion_id,0,1)
    rot_absolute = new THREE.Vector3().set(0, Math.PI/2 - Math.atan2((hit_para.attacker.obj._obj.position.z-c.pos.z), (hit_para.attacker.obj._obj.position.x-c.pos.x)), 0)
  }
// combat_para END
//DEBUG_show(Math.round(performance.now()-t)+'\n'+Date.now())
// use TPS_camera_lookAt_ instead of TPS_camera_lookAt
  if (!rot_absolute && c.combat_mode && can_lock_target && TPS_camera_lookAt_) {
    rot_absolute = new THREE.Vector3().set(0, Math.PI/2 - Math.atan2((TPS_camera_lookAt_.z-c.pos.z), (TPS_camera_lookAt_.x-c.pos.x)), 0)
  }

  if (!TPS_mode) {
    rot_absolute_with_camera = rot_absolute;
    rot_absolute = null;
  }

  var combat = d._states.combat

// general collision check for all moving objects (objects with .motion and para .check_collision=true, basically just combat members for now)
  var _object_list
  d.object_list.forEach(function (obj, idx) {
    var _mov = d._mov[idx]
    if (!_mov)
      return

// for performance reason, we need an optimized object list for collision test. Just use PC, combat characters and grid blocks (check_grid_blocks:true) as the collision check targets for now.
    if (!_object_list) _object_list = [c].concat((combat && combat.enemy_list) || [])//.concat(d.object_list)//

    var mesh = obj._obj
    if (mesh._bone_to_position_last && !_pos_restored[idx]) {
// reset the position that has been modified in jThree.MMD.js
      mesh.position.sub(mesh._bone_to_position_last.pos_delta_rotated)
    }

    var result = d.check_collision({ obj:obj, mass:obj.mass }, _mov, true, { collision_by_mesh_disabled:true, check_grid_blocks:true, object_list:_object_list })

    if (result.obj_hit) {
      var _y = _mov.y
      _mov.copy(result.moved_final).setY(_y)
    }
    mesh.position.add(_mov)
  });
//DEBUG_show(Math.round(performance.now()-t)+'\n'+Date.now())
// ground combat NPCs
  if (combat) {
    combat.enemy_list.forEach(function (enemy) {
      var mesh = enemy._obj
      if (mesh.visible) {
        mesh.position.y = d.get_ground_y(mesh.position)
      }
    });
  }

  movement_extra_v3.sub(model.mesh.position).negate()
  if (movement_extra_v3.x || movement_extra_v3.y || movement_extra_v3.z) {
//DEBUG_show(8,0,1)
    model.mesh.position.add(movement_extra_v3)
    mov = _v3a.add(movement_extra_v3)
    null_mov = false
    movement_extra_v3.set(0,0,0)
  }
// use the following line instead of the above block to possibly save some calculations, at the expense of some accuracy in collision checks.
//  c.pos.add(movement_extra_v3)

  if (!motion_id && pos_delta) {
    mov = _v3a.add(model.mesh._bone_to_position_last.pos_delta_rotated)
    null_mov = false
  }

  var ground_obj_checked, collision_by_mesh_failed
  for (var i = 0, i_max = dir_block.length; i < i_max; i++) {
    _v3b.copy(_v3a)
    var b_list = dir_block[i]
    if (b_list) {
      b_list.forEach(function (b) {
        _v3b[b] = 0
      });
      if (!null_mov && (!_v3b.x && !_v3b.y && !_v3b.z))
        continue
    }
    if (true) {//!d.check_grid_blocking(_v3c.copy(_v3b).add(c.pos), d.grid_blocking_character_offset, (null_mov)?null:_v3b)) {//
//let _t = performance.now()
      var result = d.check_collision(PC, _v3b, ground_obj_checked)
//DEBUG_show(Math.round(performance.now()-_t))
      collision_by_mesh_failed = result.collision_by_mesh_failed

      if (!ground_obj_checked) {
        ground_obj_checked = true
        c.ground_obj = result.ground_obj
      }

      if (result.obj_hit) {
        _v3b.copy(result.moved_final)
      }
      else if (null_mov)
        break

      if (_v3b.x || _v3b.y || _v3b.z) {
        mov.copy(_v3b)
        moved = true
        break
      }

      if (result.collision_by_mesh_checked)
        break
    }
    if (moved)
      break
  }

  if (reset_motion) {
    motion_reset.some(function (key_map) {
//      reset_key_map([key_map.id])
      if (mm.filename == key_map.motion_filename) {
        MMD_SA_options.motion_shuffle_list_default = MMD_SA_options._motion_shuffle_list_default.slice()
        MMD_SA._force_motion_shuffle = true
        return true
      }
    });
  }

// check ground movement START
  ground_y = (collision_by_mesh_failed) ? c.pos.y : d.get_ground_y(c.pos)
  if (c.ground_obj) {
    const g = c.ground_obj.obj;
    const g_obj = g._obj
    for (var index in c.ground_obj.bb_y_scale) {
      ground_y = (index == "mesh") ? Math.max(((c.ground_obj.obj.collision_by_mesh_enforced)?-999:ground_y), c.ground_obj.bb_y_scale.mesh) : Math.max(ground_y, g._obj_proxy.boundingBox_list[index].max.y * g_obj.scale.y * c.ground_obj.bb_y_scale[index] + g_obj.position.y)
    }
  }
  var reset_camera// = (d.camera_y_default_non_negative && (c.ground_y != ground_y) && ((c.ground_y < 0) || (ground_y < 0)))
  c.ground_y = ground_y
  c.grounded = false
  if (!floating || (c.pos.y < ground_y)) {
    ground_y_delta = (c.pos.y > ground_y + gravity_y) ? -gravity_y : ground_y - c.pos.y
    c.grounded = ground_y_delta > -0.5
  }
//if (c.ground_obj) console.log(JSON.stringify(c.ground_obj.bb_y_scale)+'/'+ground_y+'/'+ground_y_delta)

  if (c.pos.y - ground_y < gravity_obj.y + gravity_obj.mov_y_last)
    gravity_obj.y = gravity_obj.mov_y_last = 0
// check ground movement END

  var change_motion = motion_id_enforced
/*
  if (!change_motion && (ground_y_delta < 0) && (c.pos.y > ground_y+10)) {
//    MMD_SA.playbackRate = 0.5
//    model_para._playbackRate = 0.5
  }
  else {
//    MMD_SA.playbackRate = 1
//    model_para._playbackRate = 1
    if (motion_id && !key_motion_disabled && (mm.filename != motion_id))
      change_motion = true
  }
*/
  if (motion_id && !key_motion_disabled && (mm.filename != motion_id))
    change_motion = true
  if (change_motion) {
    MMD_SA_options.motion_shuffle_list_default = [MMD_SA_options.motion_index_by_name[motion_id]]
    MMD_SA._force_motion_shuffle = true
  }

  if (!moved && ground_y_delta) {
    moved = true
  }

  if (collision_by_mesh_failed) {
    moved = false
  }

  var camera_y_offset = 0
  if (movement_extra_v3.x || movement_extra_v3.y || movement_extra_v3.z)
    moved = true
  if (moved) {
    if (!mov)
      mov = movement_v3.set(0,0,0)
    mov.y += ground_y_delta
    if (c.pos.y + mov.y < ground_y)
      mov.y = ground_y - c.pos.y

    var _y = c.pos.y
    c.pos.add(mov)
    if (d.camera_y_default_non_negative && (c.pos.y < 0))
      camera_y_offset = (mov.y < 0) ? Math.min(_y, 0) - c.pos.y : 0
    else
      camera_y_offset = -MMD_SA._camera_y_offset_
    MMD_SA._camera_y_offset_ += camera_y_offset
  }
  else
    mov = null

  if (mov) {
// per second
    c.inertia.copy(mov).setY(0).multiplyScalar(1/time_diff)
  }
  else {
    c.inertia.set(0,0,0)
  }

  var update_dungeon_blocks
  if (mov || rot) {
    c.pos_update()
    let _mov_camera
    if (mov) {
      _mov_camera = _v3a.copy(mov.add(movement_extra_v3))
      _mov_camera.y += camera_y_offset
      _mov_camera = [_mov_camera, mov]
    }
    let _rot_camera = (TPS_mode_in_action && !TPS_camera_lookAt) ? null : rot;//(rot_camera.enabled && rot && rot_camera.v3.negate().add(rot))||rot;
    MMD_SA._trackball_camera.SA_adjust(_mov_camera, _rot_camera)
/*
    if (rot_camera.enabled && rot) {
//DEBUG_show(_rot_camera.clone().multiplyScalar(180/Math.PI).toArray().concat(Date.now()).join('\n'))
      rot_camera.v3.copy(rot)
    }
*/
    update_dungeon_blocks = true
  }
  else {
    d.PC_follower_list.forEach(function (para) {
var id = para.id
var obj = para.obj
if (!obj)
  return

para.onidle && para.onidle()
    });
  }

  if (about_turn) {
    model.mesh.quaternion.multiply(MMD_SA.TEMP_q.setFromEuler(MMD_SA.TEMP_v3.set(0,Math.PI,0)))
  }

  if (rot_absolute || rot_absolute_with_camera) {
    if (!rot_absolute)
      rot_absolute = _v3b.set(0,0,0)
    if (rot_absolute_with_camera) {
      rot_absolute.add(rot_absolute_with_camera)
      rot_absolute_with_camera = _v3a.copy(rot_absolute_with_camera).sub(c.rot)
    }
    c.about_turn = false
    c.rot.copy(rot_absolute)
    model.mesh.quaternion.setFromEuler(rot_absolute)
    if (rot_absolute_with_camera)
      MMD_SA._trackball_camera.SA_adjust(null, rot_absolute_with_camera)
  }

  if (update_dungeon_blocks)
    d.update_dungeon_blocks()

  if (reset_camera) {
    MMD_SA.reset_camera()
  }


  var cp_events = []
  d.check_points.forEach(function (cp) {
    var pos
    if (cp.position)
      pos = _v3a.copy(cp.position)
    if (cp.object_index != null)
      pos.add(d.object_list[cp.object_index]._obj.position)
    cp.range.forEach(function (r) {
      var is_inside
      if (r.distance) {
        is_inside = (c.pos.distanceTo(pos) < r.distance)
      }
      else {
        is_inside = _b3.copy(r.zone).containsPoint(c.pos)
//DEBUG_show(is_inside+'/'+c.pos.toArray()+'\n'+_b3.min.toArray()+'/'+_b3.max.toArray())
      }

      if (is_inside) {
        if (r.onenter && !r._entered)
          cp_events.push(r.onenter)
        if (r.onstay)
          cp_events.push(r.onstay)
        r._entered = true
        if (r.onexit)
          r.onexit._pos_last = c.pos.clone()
      }
      else {
        if (r.onexit && r.onexit.condition && !r.onexit.condition()) {
//return
          _v3b.copy(r.onexit._pos_last).sub(c.pos)
          c.pos.copy(r.onexit._pos_last)

          c.pos_update()
          MMD_SA._trackball_camera.SA_adjust(_v3b)

//          MMD_SA.reset_camera()
          return
        }
        if (r.onexit && r._entered)
          cp_events.push(r.onexit)
        r._entered = false
      }
    });
  });
  cp_events.forEach(function (ev) {
    d.run_event(ev.event_id)
  });

//DEBUG_show(Math.round(performance.now()-t)+'\n'+Date.now())
//  model.mesh.bones_by_name["針回転"].quaternion=new THREE.Quaternion().setFromEuler(MMD_SA.TEMP_v3.set(0*Math.PI/180, -((d.getHours()+d.getMinutes()/60+(d.getSeconds()+d.getMilliseconds()/1000)/(60*60))/24*720)*Math.PI/180, 0*Math.PI/180));
};

  })() );

(function () {
  var _reset = function () {
if (this.disabled)
  return

this._initialized = false

for (var lvl = 0, lvl_max = this.geo_by_lvl.length; lvl < lvl_max; lvl++) {
  var lvl_obj = this.lvl[lvl]
// set .index to 0 effectively means the first obj is just for cloning and is never displayed
  lvl_obj.index = 0//-1
  lvl_obj.index_material_cloned = -1
  lvl_obj.list.concat(lvl_obj.list_material_cloned).forEach(function (obj) {
    obj.visible = false
    MMD_SA.THREEX.scene.remove(obj)
  });

  var i, i_max

  lvl_obj.reusable_list = []
  for (i = lvl_obj.index+1, i_max = lvl_obj.list.length; i < i_max; i++)
    lvl_obj.reusable_list.push(i)
  lvl_obj.index = Math.max(i_max-1, lvl_obj.index)

  lvl_obj.reusable_list_material_cloned = []
  for (i = lvl_obj.index_material_cloned+1, i_max = lvl_obj.list_material_cloned.length; i < i_max; i++)
    lvl_obj.reusable_list_material_cloned.push(i)
  lvl_obj.index_material_cloned = Math.max(i_max-1, lvl_obj.index_material_cloned)
}
  }

  var _get_obj = function (list) {
const THREE = MMD_SA.THREEX.THREE;

var plane0 = this.list[0]

var index, reusable_list
if (list == this.list) {
  index = "index"
  reusable_list = "reusable_list"
}
else {
  index = "index_material_cloned"
  reusable_list = "reusable_list_material_cloned"
}

var plane
var index_used = this[reusable_list].pop()
if (index_used != null) {
  plane = list[index_used]
}
else {
  index_used = ++this[index]
  plane = list[index_used]
  if (!plane) {
    plane = list[index_used] = (list == this.list) ? plane0.clone() : plane0.clone(new THREE.Mesh(plane0.geometry, plane0.material.clone()))
    plane.matrixAutoUpdate = false
    MMD_SA.THREEX.scene.add(plane)
  }
}

return [plane, index_used]
  }

  var _init = function () {
if (this.disabled || this._initialized)
  return this
this._initialized = true

for (var lvl = 0, lvl_max = this.geo_by_lvl.length; lvl < lvl_max; lvl++) {
  var lvl_obj = this.lvl[lvl]
  lvl_obj.list.concat(lvl_obj.list_material_cloned).forEach(function (obj) {
// NOTE: scene.add must come first, or .visible will always be reset to true.
    MMD_SA.THREEX.scene.add(obj)
    obj.visible = false
//    obj.renderDepth = 999999
  });
}

return this
  }

  MMD_SA_options.Dungeon.grid_material_list.forEach(function (p_obj, idx) {
    p_obj.reset = _reset
    p_obj.init  = _init

    if (p_obj.disabled)
      return

    p_obj.lvl = []
    for (var lvl = 0, lvl_max = p_obj.geo_by_lvl.length; lvl < lvl_max; lvl++) {
      var mesh_obj = MMD_SA_options.mesh_obj_by_id['DungeonPlane'+idx+'MESH_LV'+lvl]._obj;
      mesh_obj.useQuaternion = true
      mesh_obj.quaternion.setFromEuler(mesh_obj.rotation)
      p_obj.lvl[lvl] = {
  lvl: lvl
 ,lvl_max: lvl_max
 ,list:[mesh_obj]
 ,list_material_cloned:[]
 ,reusable_list:[]
 ,reusable_list_material_cloned:[]
 ,get_obj:_get_obj
      };
    }
  });
})();

(function () {
  var _init = function () {
if (this._initialized)
  return
this._initialized = true

var that = this

this.list.forEach(function (cache) {
// NOTE: scene.add must come first, or .visible will always be reset to true.
  if (!cache.parent)
    MMD_SA.THREEX.scene.add(cache)
  cache.visible = false;
  if (!MMD_SA.THREEX.enabled) cache.children.forEach(function (c) { c.visible=false; });
});
  }

  var _reset = function () {
var that = this
this._initialized = false

var stay_on_scene = this.obj_base.stay_on_scene && MMD_SA_options.Dungeon.object_list.some(function (obj) { return obj.object_index==that.obj_base.index; });
this.index = this.list.length - 1
this.reusable_list = []
this.list.forEach(function (cache, idx) {
  that.reusable_list.push(idx)
  cache.visible = false;
  if (!MMD_SA.THREEX.enabled) cache.children.forEach(function (c) { c.visible=false; });
  if (!stay_on_scene)
    MMD_SA.THREEX.scene.remove(cache)
});
  }

  d.object_base_list.forEach(function (obj, idx) {
    if (obj.is_dummy) return

    var mesh
    if (obj.construction && !obj.path) {
      obj._mesh_id = (obj.character_index != null) ? "mikuPmx"+obj.character_index : obj.construction.mesh_obj.id
      obj._obj = MMD_SA_options.mesh_obj_by_id[obj._mesh_id]
      mesh = obj._obj._obj

      var geo_list = []
      if (mesh.geometry) {
        geo_list.push(mesh.geometry)
      }
      else {
        mesh.children.forEach(function (mesh_child) {
          if (mesh_child.geometry)
            geo_list.push(mesh_child.geometry)
        });
      }
      geo_list.forEach(function (geo) {
        if (obj.construction.boundingBox_list) {
          geo.boundingBox_list = []
          obj.construction.boundingBox_list.forEach(function (bb) {
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
          if (geo.boundingBox_list.length == 1)
            geo.boundingBox = geo.boundingBox_list[0]
        }
        if (!geo.boundingBox) {
          geo.computeBoundingBox();
        }
        if (!geo.boundingSphere) {
          geo.boundingSphere = geo.boundingBox.getBoundingSphere(new THREE.Sphere());
        }
//console.log(geo.boundingBox)
      });
    }
    else {
      if (obj.path) {
        obj._obj = MMD_SA_options.x_object_by_name[obj.path.replace(/^.+[\/\\]/, "").replace(/\.x$/i, "")]
      }
      else {
        obj._mesh_id = "mikuPmx"+obj.character_index
        obj._obj = MMD_SA_options.mesh_obj_by_id[obj._mesh_id]
      }
      mesh = obj._obj._obj
    }

// to get bounding host
    obj._obj._obj_proxy = new Object3D_proxy_base(obj._obj);

    if (!mesh.useQuaternion) mesh.quaternion.setFromEuler(mesh.rotation)
    mesh.useQuaternion = true
    mesh.children.forEach(function (mesh_child) {
      if (!mesh_child.useQuaternion) mesh_child.quaternion.setFromEuler(mesh_child.rotation)
      mesh_child.useQuaternion = true
    });

    var geo = mesh.geometry || mesh.children[0].geometry
    if (obj.collision_by_mesh && !obj.collision_by_mesh_sort_range && MMD_SA_options.Dungeon.use_octree) {
      obj.collision_by_mesh_sort_range = 1;
    }

    if (obj.collision_by_mesh_sort_range) {
      if (!d.mesh_sorting_worker) {
d.use_local_mesh_sorting = true;
if (d.use_local_mesh_sorting) {
  d.mesh_sorting_worker = {
    tree: {}
  };
}
else {
}
      }

      let a, b, c, index, _array;
      let vertices = geo.vertices;
      let collision_by_mesh_material_index_max = obj.collision_by_mesh_material_index_max || 999;
// https://0fps.net/2015/01/23/collision-detection-part-3-benchmarks/
if (d.use_local_mesh_sorting) {
  if (MMD_SA_options.Dungeon.use_octree) {
    const THREEX = MMD_SA.THREEX.THREEX;
    const octree = new THREEX.Octree();
    octree.fromGraphNode( mesh );
    obj.octree = octree;
    console.log('octree', obj);

    d.mesh_sorting_worker.tree[idx] = {};
  }

  if (!d.use_octree) {
// compute face normal when necessary (mainly for PMX model)
    if (!geo.faces[0].normal.lengthSq()) geo.computeFaceNormals();

// https://github.com/mourner/rbush
    let tree = rbush();

    _array = [];
    for (let f = 0, fl = geo.faces.length; f < fl; f++) {
      const face = geo.faces[f];
      if (face.materialIndex >= collision_by_mesh_material_index_max) break;

      a = vertices[face.a];
      b = vertices[face.b];
      c = vertices[face.c];

      _array.push({
minX: Math.min(a.x, b.x, c.x),
minY: Math.min(a.z, b.z, c.z),
maxX: Math.max(a.x, b.x, c.x),
maxY: Math.max(a.z, b.z, c.z),
index: f
      });
    }

    tree.load(_array);
    d.mesh_sorting_worker.tree[idx] = tree;
  }
}
else {
}

      _array = undefined
    }

    obj.cache = {
  obj_base: obj
 ,index: -1
 ,reusable_list: []
 ,list: [mesh]

 ,_initialized: false
 ,init: _init
 ,reset: _reset
    };

// PC swap ready
    if (obj.character_index != null) {
Object.defineProperty(obj.cache.list, "0", {
  get: function () {
//console.log(Date.now())
    return MMD_SA_options.mesh_obj_by_id[obj._mesh_id]._obj
  }
});
    }

    if (obj.character_index != null) {
      THREE.MMD.getModels()[obj.character_index]._clone_cache = obj.cache
    }

    obj.cache_LOD_far = {
  obj_base: obj
 ,is_LOD_far: true
 ,index: -1
 ,reusable_list: []
 ,list: []

 ,_initialized: false
 ,init: _init
 ,reset: _reset
    };

    if (obj.LOD_far) {
      const THREE = MMD_SA.THREEX.THREE;

      obj.LOD_far.boundingBox = geo.boundingBox
      obj.LOD_far.center = geo.boundingBox.center()
      obj.LOD_far.size = geo.boundingBox.size()
      let mesh_far = new THREE.Mesh(new THREE.CubeGeometry(obj.LOD_far.size.x, obj.LOD_far.size.y, obj.LOD_far.size.z), new THREE.MeshBasicMaterial( { color:'#'+MMD_SA.THREEX.scene.fog.color.getHexString() } ));
      mesh_far.visible = false
      MMD_SA.THREEX.scene.add(mesh_far)

      mesh_far.useQuaternion = true

      obj.cache_LOD_far.list.push(mesh_far)
    }
  });
})();

  MMD_SA.SpeechBubble.list.forEach(m=>{ m.renderDepth = 9999999 * ((!MMD_SA.THREEX.enabled) ? -1 : 1); });
  MMD_SA.SpeechBubble.list.forEach(b=>b.bubbles.forEach(b=>{
    b.pos_mod = [0,-2.5,0]
  }));

  d.grid_blocks = {
    objs: []
   ,xy: []

   ,hide: function () {
this.objs.forEach(function (obj) {
  obj._obj.visible = false
});
    }

   ,update: (function () {
//var xy = []
//var area_id = ""
var xy_list = [
[-1,-1], [ 0,-1], [ 1,-1],
[-1, 0],          [ 1, 0],
[-1, 1], [ 0, 1], [ 1, 1]
];
var pos_grid = { x:0, y:0, z:0 }

var v3a, v3b, v3c
v3a = new THREE.Vector3()
v3b = new THREE.Vector3()
v3c = new THREE.Vector3()

return function (pos) {
  var d = MMD_SA_options.Dungeon
  var grid_size = d.grid_size
  var gs_half = grid_size/2
  var map_w_max = d.RDG_options.width
  var map_h_max = d.RDG_options.height

  d.grid_blocks.objs[d.grid_blocks.objs.length-1]._obj.visible = (d.ceil_material_index_default != -1)

  var _x = Math.floor((pos.x) / grid_size)
  var _y = Math.floor((pos.z) / grid_size)
/*
  var xy_unchanged = (area_id == d.area_id) && (_x == xy[0]) && (_y == xy[1])
  area_id = d.area_id
  xy[0] = _x
  xy[1] = _y
*/
  xy_list.forEach(function (_xy, idx) {
    var x = _xy[0] + _x
    var y = _xy[1] + _y
    var c = v3a.set((x+0.5)*grid_size, 0, (y+0.5)*grid_size)
    var ground_y = 999

    var obj = d.grid_blocks.objs[idx]._obj
    var geo = obj.geometry

    var update
    if ((x < 0) || (x >= map_w_max) || (y < 0) || (y >= map_h_max) || (d.grid_array[y][x] == 1)) {
      update = true
    }
    else {
      ground_y = d.get_ground_y({x:(x*grid_size), y:0, z:(y*grid_size)}, -999)
      if (ground_y > pos.y+10) {
        update = true
      }
    }

    if (update) {
      obj.position.copy(c)
      geo.boundingBox.set(v3b.set(-gs_half, -999, -gs_half), v3c.set(gs_half, ground_y, gs_half))
// it will be updated in .check_collision() as a boundingSphere-hit object
//      obj.updateMatrixWorld()
      obj.visible = true
    }
    else {
      obj.visible = false
    }
  });
};
    })()

  };

  for (var i = 0; i < 8+1; i++) {
    var block = new THREE.Object3D()
    block.useQuaternion = true
    block.geometry = {
      boundingSphere: new THREE.Sphere()
     ,boundingBox: new THREE.Box3()
    };
    block.geometry.boundingSphere.radius = 999
    block.geometry.boundingBox_list = [block.geometry.boundingBox]

    var obj = {
      _mesh: block
     ,_obj: block
     ,skip_ground_obj_check: true
// dummy
     ,_obj_base: {}
    };
    obj._obj_proxy = new Object3D_proxy_base(obj);

    d.grid_blocks.objs[i] = obj
  }

  for (var id in MMD_SA_options.Dungeon_options.options_by_area_id) {
    MMD_SA_options.Dungeon_options.options_by_area_id[id]._saved = new AreaDataSaved()
  }

  d.restart()
});


window.addEventListener("SA_MMD_toggle_shadowMap", function (e) {
  var enabled = !!MMD_SA_options.use_shadowMap

  var p = MMD_SA_options.Dungeon.grid_material_list
  for (var i = 0, i_max = p.length; i < i_max; i++) {
    var p_obj = p[i]
    if (p_obj.disabled)
      continue

    for (var lvl = 0, lvl_max = p_obj.geo_by_lvl.length; lvl < lvl_max; lvl++) {
      p_obj.lvl[lvl].list.concat(p_obj.lvl[lvl].list_material_cloned).forEach(function (mesh_obj) {
mesh_obj.receiveShadow = enabled;
mesh_obj.material.needsUpdate = true;
      });
    }
  }

  MMD_SA_options.Dungeon.object_base_list.forEach(function (obj) {
    if (obj.is_dummy) return

    var construction = obj.construction
    var c = obj.cache.list
    var has_child = (obj.character_index == null) && c[0].children.length

    var castShadow, receiveShadow
    var updated0
    if (obj.character_index != null) {
//      updated0 = true

      const model_para = MMD_SA_options.model_para_obj_all[obj.character_index];
      const material_para = (model_para.material_para && model_para.material_para._default_) || {};

      castShadow =    enabled && ((material_para.castShadow != null)    ? !!material_para.castShadow : ((construction && (construction.castShadow != null)) ? construction.castShadow : true));
      receiveShadow = enabled && ((material_para.receiveShadow != null) ? !!material_para.receiveShadow : model_para.is_object || !MMD_SA_options.ground_shadow_only);
    }
    else {
      updated0 = !!obj.path

      const x_obj = (obj.path) ? MMD_SA_options.x_object_by_name[obj.path.replace(/^.+[\/\\]/, "").replace(/\.x$/i, "")] : MMD_SA_options.mesh_obj_by_id[construction.mesh_obj.id];
      castShadow =    enabled && !!x_obj.castShadow;
      receiveShadow = enabled && !!x_obj.receiveShadow;
    }

    for (var i = 0, i_max = c.length; i < i_max; i++) {
      if ((i == 0) && updated0)
        continue

      var cache = c[i]
      var mesh_list = (has_child) ? cache.children : [cache]
      mesh_list.forEach(function (mesh) {
        mesh.castShadow    = castShadow
        mesh.receiveShadow = receiveShadow

// no need to update materials for clones
        if (i)
          return
// non-mesh (e.g. light)
        if (!mesh.material)
          return

        if (mesh.material.materials) {
          mesh.material.materials.forEach(function (m) {
            m.needsUpdate = true
          });
        }
        else {
          mesh.material.needsUpdate = true
        }
      });
    }
  });
});


this.GOML_dungeon_blocks()

this.object_base_list = options.object_base_list || []

if (MMD_SA_options.model_path_extra) {
  var _model_path = LABEL_LoadSettings("LABEL_MMD_model_path", "")
  if (_model_path) {
    var index = MMD_SA_options.model_path_extra.indexOf(_model_path)
    if (index != -1)
      MMD_SA_options.model_path_extra[index] = System.Gadget.path + "\\jThree\\model\\Appearance Miku\\Appearance Miku_BDEF_mod-v04.pmx"
  }
}

if (options.multiplayer) {
  if (!MMD_SA_options.model_para)
    MMD_SA_options.model_para = {}
  if (!MMD_SA_options.model_path_extra)
    MMD_SA_options.model_path_extra = []

  let that = this
  let OPC_index = options.multiplayer.OPC_index0 = 1 + MMD_SA_options.model_path_extra.length
  options.multiplayer.OPC_list.forEach(function (opc, idx) {
    MMD_SA_options.model_path_extra.push(opc.path)

    var path = toLocalPath(opc.path)
    var model_filename_raw = path.replace(/^.+[\/\\]/, "")
    var para = MMD_SA_options.model_para[model_filename_raw] = opc.para || MMD_SA_options.model_para[model_filename_raw] || {}
    para.is_PC_candidate = true
    para.is_OPC = true

    that.object_base_list.push({
  character_index: OPC_index++
 ,is_OPC: true
 ,id: "OPC-" + idx
 ,placement: {
    grid_id: 2
   ,can_overlap: true
   ,hidden: true
  }
 ,no_collision: true
    });
  });
}

if (options.character) {
  Object.assign(this.character, options.character)
}


// dungeon motion START
this.motion_by_name = {}
this.motion = options.motion || {}

this.motion["PC default"] = Object.assign({
  path:System.Gadget.path + '/MMD.js/motion/motion_rpg_pack01.zip#/tsuna/tsuna_standby.vmd',
  para: { adjust_center_view_disabled:true, loop_on_blending:true, onended: function () { MMD_SA._no_fading=true; },
  }
}, this.motion["PC default"]||{});
Object.assign(this.motion["PC default"].para, this.motion["PC default"].para_SA||{});
delete this.motion["PC default"].para_SA;

this.motion["PC movement forward"] = Object.assign({
  path:System.Gadget.path + '/MMD.js/motion/motion_rpg_pack01.zip#/walk_n_run/run_H57_f0-20.vmd',
  para: { adjust_center_view_disabled:true, loop_on_blending:true, onended: function () { MMD_SA._no_fading=true; },
motion_tracking_enabled:true,
motion_tracking_upper_body_only:true,

// h01: 2000/1800
// h16: 1474.79/1800
// h26: 2700/1800
// h45: 2500/1800
// h46: 2500/3600
// h57: 2700/3600
// A34: 360/1800
  _speed: 2700/1800 *30,

  SFX: [
    { frame:2,  sound:{} },
    { frame:12, sound:{} },
  ],

  adjustment_per_model: {
    _default_ : {
  skin_default: {}
 ,morph_default:{
  "あ":{weight:0.13}
 ,"い":{weight:0.27}

// ,"なごみ":{weight:0.29*0.5}
// ,"はぅ":{weight:0.15}
 ,"じと目":{weight:0.25}

 ,"困る":{weight:0.23}
 ,"下":{weight:0.64}
  }
// ,skin_filter: { test:function(name){ return ((name.indexOf("スカート")==-1) && (name.indexOf("パーカー")==-1) && (name.indexOf("胸")==-1) && (name.indexOf("乳")==-1)) } }
    }
   ,"TdaHaku_Bikini_TypeB.pmx" : {
  skin_default: {}
 ,morph_default:{
  "あ":{weight:0.13}
 ,"い":{weight:0.27}

// ,"なごみ":{weight:0.29*0.5}
// ,"はぅ":{weight:0.15}
 ,"じと目":{weight:0.25}

 ,"困る":{weight:0.23}
 ,"下":{weight:0.64}
  }
 ,skin_filter: { test:function(name){ return ((name.indexOf("前髪")==-1)) } }
    }
   ,"TdaRin_Bikini_TypeDS_SauWai.pmx" : {
  skin_default: {}
 ,morph_default:{
  "あ":{weight:0.13}
 ,"い":{weight:0.27}

// ,"なごみ":{weight:0.29*0.5}
// ,"はぅ":{weight:0.15}
 ,"じと目":{weight:0.25}

 ,"困る":{weight:0.23}
 ,"下":{weight:0.64}
  }
    }

  },
    }
}, this.motion["PC movement forward"]||{});
console.log(Object.assign({}, this.motion["PC movement forward"]));
Object.assign(this.motion["PC movement forward"].para, this.motion["PC movement forward"].para_SA||{});
delete this.motion["PC movement forward"].para_SA;
/*
  this.motion["PC movement forward"] = { path:System.Gadget.path + '/MMD.js/motion/walk_n_run/run_H45_f0-360.vmd',
    para: { adjust_center_view_disabled:true, onended: function () { MMD_SA._no_fading=true; }
 ,adjustment_per_model: {
    _default_ : {
  skin_default: {}
 ,morph_default:{
  "なごみ":{weight:0.28}
 ,"はぅ":{weight:0.15}
 ,"ω□":{weight:0.55}
 ,"困る":{weight:0.48}
 ,"下":{weight:1}
  }
    }
  }
    }
  };
*/

if (!this.motion["PC forward jump"]) {
  this.motion["PC forward jump"] = { path:System.Gadget.path + '/MMD.js/motion/motion_rpg_pack01.zip#/tsuna/tsuna_small_jump.vmd',
    para: { adjust_center_view_disabled:true, motion_duration:(46-12)/30, onended: function () { MMD_SA._no_fading=true; }
 ,adjustment_per_model: {
    _default_ : {
//  skin_filter: { test:function(name){ return ((name.indexOf("スカート")==-1) && (name.indexOf("パーカー")==-1) && (name.indexOf("胸")==-1) && (name.indexOf("乳")==-1)) } }
    }
   ,"TdaHaku_Bikini_TypeB.pmx" : {
//  skin_filter: { test:function(name){ return ((name.indexOf("前髪")==-1) && (name.indexOf("胸")==-1)) } }
    }
  }
 ,mov_speed: (function () {
var va = _jump_physics((15+10), 11)
return [
  { frame:34, speed:{x:0, y:0,     z:22.8/12*30}}
 ,{ frame:12, speed:{x:0, y:va.v,  z:41/22*30}, acceleration:{x:0, y:va.a, z:0}}
 ,{ frame:3,  speed:{x:0, y:0.001, z:22.8/12*30}}
 ,{ frame:0,  speed:{x:0, y:0,     z:22.8/12*30}}
];
  })()
 ,SFX: [
    { frame:6+1, sound:{} },
    {
      frame:34,
      condition: (model) => ((model.mesh._model_index != 0) || (model.mesh.position.y < MMD_SA_options.Dungeon.character.ground_y+5)),
      sound:{},
    },
  ]
 ,range:[{time:[6,0]}]
 ,playbackRate_by_model_index: {}
 ,bb_translate: { limit:{ max:{x:0, y:0, z:0.75} } }
    }
  };
}

if (!this.motion["PC high jump"]) {
  this.motion["PC high jump"] = { path:System.Gadget.path + '/MMD.js/motion/motion_rpg_pack01.zip#/landing/05_magical_jump_v01.vmd',
    para: { adjust_center_view_disabled:true, motion_duration:(162)/30, onended: function () { MMD_SA._no_fading=true; }
 ,look_at_screen:false
 ,range:[{time:[10,0]}]
 ,adjustment_per_model: {
    _default_ : {
//  skin_filter: { test:function(name){ return ((name.indexOf("胸")==-1) && (name.indexOf("乳")==-1)) } }
    }
  }

 ,motion_blending: {
    fadein: {}
   ,fadeout: { condition:()=>false }
  }

 ,bone_to_position: [{ name:"センター", frame_range:[[23,89]], scale:{x:0,y:1,z:0}, position_disabled:true }]
 ,mov_speed: (function () {
var va_y1 = _jump_physics((100), 28)
var va_y2 = _jump_physics((100), 38)
var va_z2 = _jump_physics((20) , 38)
return [
  { frame:128, speed:{x:0, y:0,       z: 0}}
 ,{ frame:89,  speed:{x:0, y:0.001,   z: 0}}
//20-38-56
 ,{ frame:51,  speed:{x:0, y:0.001,   z:va_z2.v}, acceleration:{x:0, y:va_y2.a, z:va_z2.a}}
 ,{ frame:23,  speed:{x:0, y:va_y1.v, z: 0},      acceleration:{x:0, y:va_y1.a, z:0}}
 ,{ frame:0,   speed:{x:0, y:0,       z: 0}}
];
  })()
 ,SFX: [
    { frame:23, sound:{} },
    {
      frame:128,
      condition: (model) => ((model.mesh._model_index != 0) || (model.mesh.position.y < MMD_SA_options.Dungeon.character.ground_y+5)),
      sound:{},
    },
  ]
    }
  };
}
if (!this.motion["PC landing"]) {
  this.motion["PC landing"] = { path:System.Gadget.path + '/MMD.js/motion/motion_rpg_pack01.zip#/landing/04_deep_landing.vmd',
    para: { adjust_center_view_disabled:true, duration:(57)/30
 ,onended: function (loop_end) {
MMD_SA._no_fading=true;
if (loop_end) {
  MMD_SA_options.motion_shuffle_list_default = MMD_SA_options._motion_shuffle_list_default.slice();
  if (!MMD_SA_options.Dungeon._states.event_mode) {
    MMD_SA_options.Dungeon.character_movement_disabled = false;
  }
}
  }
 ,look_at_screen:false
 ,range:[{time:[11,0]}]
 ,adjustment_per_model: {
    _default_ : {
//  skin_filter: { test:function(name){ return ((name.indexOf("胸")==-1) && (name.indexOf("乳")==-1)) } },
  skin_default: {
    "全ての親": { pos_add:{x:0, y:0, z:4} }
  }
    }
  }
 ,SFX: [
    { frame:16, sound:{} }
   ,{ frame:20, sound:{} }
  ]
 ,bone_to_position: [{ name:"センター", frame_range:[[0,16]], scale:{x:0,y:1,z:0}, position_disabled:true }]
// ,bb_translate: { limit:{ min:{x:0, y:0, z:0.75} } }
    }
  };
}

if (!this.motion["NPC talk A"]) {
  this.motion["NPC talk A"] = { path:System.Gadget.path + '/MMD.js/motion/motion_rpg_pack01.zip#/talk/xs-talk8-west-negotiate.vmd'
   ,para: {
  onended: function () { MMD_SA._no_fading=true; }
 ,adjustment_per_model: {
    _default_ : {
  skin_default: {
    "全ての親": { keys:[{ pos:{x:1.05, y:0, z:-8.72}, rot:{x:0, y:89, z:0} }] }
  }
    }
  }
    }
  };
}
if (!this.motion["NPC walk A"]) {
  this.motion["NPC walk A"] = { path:System.Gadget.path + '/MMD.js/motion/motion_rpg_pack01.zip#/walk_n_run/walk_A01_f0-40_s9.85.vmd' };
}
if (!this.motion["PC fall on ass"]) {
  this.motion["PC fall on ass"] = { path:'MMD.js/motion/motion_rpg_pack01.zip#/hit/w01_すべって尻もち.vmd'
   ,para:{
  adjust_center_view_disabled:true, get look_at_screen_ratio() { var t=THREE.MMD.getModels()[0].skin.time; return ((t>1)?0:1-t); }
 ,super_armor: { level:99 }
 ,SFX: [ { frame:21, sound:{} } ]
 ,onended: function () {
MMD_SA._ignore_physics_reset=true; MMD_SA._no_fading=true;
  }

 ,auto_blink: false
 ,freeze_onended: true
 ,onplaying: function (model_index) {
var mm = MMD_SA.MMD.motionManager
var model = THREE.MMD.getModels()[model_index]
if (model.skin.time > mm._timeMax) {
  if (MMD_SA_options.WebXR) {
    let dis = MMD_SA._v3a.copy(MMD_SA.camera_position).setY(0).distanceTo(MMD_SA._v3b.copy(THREE.MMD.getModels()[0].mesh.position).setY(0))/10 / MMD_SA.WebXR.zoom_scale;
    if (dis < 1)
      return
  }
}
else {
  return
}
// cannot use MMD_SA._force_motion_shuffle here
// will trigger .onended afterwards
if (!this._freeze_onended)
  model.skin.time = mm.lastFrame_/30;
  }

 ,adjustment_per_model: {
    _default_ : {
  morph_default: {"瞳小": { weight_scale:0.75 }}
    }
  }
    }
  };
}
if (!this.motion["PC stand up from ass"]) {
  this.motion["PC stand up from ass"] = { path:'MMD.js/motion/motion_rpg_pack01.zip#/casual/女の子座り→立ち上がる_gumi_v01.vmd'
   ,para: {
  adjust_center_view_disabled:true, get look_at_screen_ratio() { var t=THREE.MMD.getModels()[0].skin.time; return ((t>1)?1:t); }
 ,super_armor: { level:99 }
 ,onended: function () {
MMD_SA._hit_legs_=false; MMD_SA._no_fading=true;
MMD_SA_options.motion_shuffle_list_default = MMD_SA_options._motion_shuffle_list_default.slice();
if (!MMD_SA_options.Dungeon._states.event_mode) {
  MMD_SA_options.Dungeon.character_movement_disabled = false;
  MMD_SA_options.Dungeon._states.object_click_disabled = false;
}
  }
 ,adjustment_per_model: {
    _default_ : {
  skin_default: {
  "右足ＩＫ": { keys_mod:[{ frame:0, pos:{x:-2.33-0.5, y:-0.4, z:1.3} }, { frame:7,  pos:{x:-2.33-0.5, y:-0.4, z:1.3} }] }
 ,"左足ＩＫ": { keys_mod:[{ frame:0, pos:{x: 2.33+0.5, y:-0.4, z:1.3} }, { frame:47, pos:{x: 2.33+0.5, y:-0.4, z:1.3} }] }
//がくっぽいどver.2.11.pmd
 ,"センター": { pos_scale:{ auto_adjust:{ref_length:11.69667} } }
  }
    }
   ,"TdaMeiko_Bikini_TypeA.pmx" : {
  skin_default: {
  "右足ＩＫ": { keys_mod:[{ frame:0, pos:{x:-2.33-1, y:-0.4, z:1.3} }, { frame:7,  pos:{x:-2.33-1, y:-0.4, z:1.3} }] }
 ,"左足ＩＫ": { keys_mod:[{ frame:0, pos:{x: 2.33+1, y:-0.4, z:1.3} }, { frame:47, pos:{x: 2.33+1, y:-0.4, z:1.3} }] }
//がくっぽいどver.2.11.pmd
 ,"センター": { pos_scale:{ auto_adjust:{ref_length:11.69667} } }
  }
    }
  }

     ,motion_blending: {
        fadein: { duration:10/30 }
      }
    }
  };
}

if (!this.motion["PC fall from trip"]) {
  this.motion["PC fall from trip"] = { path:'MMD.js/motion/motion_rpg_pack01.zip#/hit/r01_普通に転ぶ.vmd'
   ,para: { adjust_center_view_disabled:true, get look_at_screen_ratio() { var f=THREE.MMD.getModels()[0].skin.time*30; return ((f>10)?0:(10-f)/10); }
     ,super_armor: { level:99 }
     ,SFX: [ { frame:19, sound:{} } ]
     ,onended: function () {
MMD_SA._ignore_physics_reset=true; MMD_SA._no_fading=true;
      }

 ,auto_blink: false
 ,freeze_onended: true
 ,onplaying: function (model_index) {
var mm = MMD_SA.MMD.motionManager
var model = THREE.MMD.getModels()[model_index]
if (model.skin.time > mm._timeMax) {
  if (MMD_SA_options.WebXR) {
    let dis = MMD_SA._v3a.copy(MMD_SA.camera_position).setY(0).distanceTo(MMD_SA._v3b.copy(THREE.MMD.getModels()[0].mesh.position).setY(0))/10 / MMD_SA.WebXR.zoom_scale;
    if (dis < 2)
      return
  }
}
else {
  return
}
// cannot use MMD_SA._force_motion_shuffle here
// will trigger .onended afterwards
if (!this._freeze_onended)
  model.skin.time = mm.lastFrame_/30;
  }

     ,adjustment_per_model: {
        _default_ : {
      skin_default: {
  "全ての親": { keys:[{ time:0/30, pos:{x:0, y:0, z:0} }, { time:19/30, pos:{x:0, y:1.5, z:-8}, rot:{x:-5, y:0, z:0} }] }
      }
     ,morph_default: {"瞳小": { weight_scale:0.75 }}
        },

        'Amelia Watson_MMD_ver 1.0.pmx': {
      skin_default: {
  "全ての親": { keys:[{ time:0/30, pos:{x:0, y:0, z:0} }, { time:19/30, pos:{x:0, y:1.5, z:-8}, rot:{x:-5, y:0, z:0} }] },
  "センター": { keys_mod:[{ frame:23, pos:{x:-0.65, y:-6.06-1.5, z:0.67} }, { frame:30,  pos:{x:-1.19, y:-5.02-1.5, z:-0.13-1} }, { frame:39,  pos:{x:-1.19, y:-5.17-1.5, z:0.28-2} }, { frame:68,  pos:{x:-1.19, y:-5.17-1.5, z:0.28-2} }] },
      },
      morph_default: {"瞳小": { weight_scale:0.75 }},
        },

      }
    }
  };
}

if (!this.motion["PC stand up from face down"]) {
  this.motion["PC stand up from face down"] = { path:'MMD.js/motion/motion_rpg_pack01.zip#/casual/OTL→立ち上がり.vmd'
   ,para: { adjust_center_view_disabled:true, get look_at_screen_ratio() { var f=THREE.MMD.getModels()[0].skin.time*30; return ((f<29)?0:((f>47)?1:(f-29)/18)); }
     ,super_armor: { level:99 }
     ,onended: function () {
MMD_SA._hit_legs_=false; MMD_SA._no_fading=true;
MMD_SA_options.motion_shuffle_list_default = MMD_SA_options._motion_shuffle_list_default.slice();
MMD_SA_options.Dungeon.character_movement_disabled = false;
MMD_SA_options.Dungeon._states.object_click_disabled = false;
      }
     ,adjustment_per_model: {
        _default_ : {
      skin_default: {
  "全ての親": { pos_add:{x:0, y:0, z:3} }
      }
        }
      }

     ,motion_blending: {
        fadein: { duration:10/30 }
      }
    }
  };
}

if (!this.motion["PC down"]) {
  this.motion["PC down"] = { path:'MMD.js\\motion\\motion_rpg_pack01.zip#\\粗製のモーション３\\ナイトミク\\k.miku-down_modified.vmd',
    para: { adjust_center_view_disabled:true
     ,duration: 2
     ,auto_blink: false
     ,super_armor: { level:99 }
     ,motion_command_disabled: true, look_at_screen: false
     ,model_index_list:[0], NPC_turns_to_you:true
     ,onended_NPC: function (model_index) {
var d = MMD_SA_options.Dungeon
if (d._states.combat && d._states.combat.ondefeated(model_index)) {
  return
}

//var model_para = MMD_SA_options.model_para_obj_all[model_index]
//model_para._motion_name_next = that.motion["NPC-" + model_index + " combat get up"].name
        }
       ,onended: function (natural_end) {
MMD_SA._no_fading = true
if (!natural_end)
  return

MMD_SA._freeze_onended = true

var d = MMD_SA_options.Dungeon
if (d._states.combat && d._states.combat.ondefeated(0)) {
  return
}

if (d._event_active.id != "_onplayerdefeated_default_")
  d.run_event("_onplayerdefeated_default_")
      }
    }
  };
}


var NPC_motion_list = []

if (options.combat_mode_enabled) {

  this.battle_model_index_list.push(0);

  (function () {
function basic_check(model_index, x_object) {
  if (!x_object._obj.visible)
    return false
  var p_bone = x_object.parent_bone
  if (!p_bone)
    return false
  if (model_index != (p_bone.model_index||0))
    return false
  return true
}

function two_handed_weapon_equipped(model_index) {
  function _two_handed_weapon_equipped(x_object) {
if (!basic_check(model_index, x_object))
  return false
return (x_object.user_data.weapon && (x_object.user_data.weapon.type == "2-handed"))
  }

  return MMD_SA_options.Dungeon.accessory_list.some(_two_handed_weapon_equipped);
}

function one_handed_weapon_equipped(model_index) {
  function _one_handed_weapon_equipped(x_object) {
if (!basic_check(model_index, x_object))
  return false
return (x_object.user_data.weapon && (x_object.user_data.weapon.type == "1-handed"))
  }

  return MMD_SA_options.Dungeon.accessory_list.some(_one_handed_weapon_equipped);
}

function twin_weapon_equipped(model_index) {
  function _twin_weapon_equipped(x_object) {
if (!basic_check(model_index, x_object))
  return false
return (x_object.user_data.weapon && (x_object.user_data.weapon.type == "twin"))
  }

  return MMD_SA_options.Dungeon.accessory_list.some(_twin_weapon_equipped);
}

// /^(\u5DE6|\u53F3)(\u80A9|\u8155|\u3072\u3058|\u624B\u9996|\u624B\u6369|.\u6307.)/
var RE_skin_jThree = new RegExp("^(" + toRegExp(["左","右"],"|") + ")(" + toRegExp(["肩","腕","ひじ","手首","手捩","ダミー"],"|") + "|." + toRegExp("指") + ".)");
var RE_skin_jThree_one_handed_guard = new RegExp(toRegExp(["上半身","両目"],"|"));
var RE_skin_jThree_hand_R = new RegExp("^" + toRegExp("右") + "(" + toRegExp("ダミー") + "|." + toRegExp("指") + ".)");

//var RE_arms = new RegExp(toRegExp(["待機","構え歩","怯み"],"|") + "|jump|^run");
var RE_arms  = /^(PC movement forward|PC.+jump|PC combat default|PC combat movement|PC combat hit small|PC combat hit medium)/
var RE_parry = /^PC combat (parry|parrying)$/

if (!MMD_SA_options.custom_action)
  MMD_SA_options.custom_action = [];

MMD_SA_options.custom_action.push(
  {
    action: {
      condition: function (is_bone_action, objs) {
var skin = THREE.MMD.getModels()[objs._model_index].skin
var motion_id = MMD_SA_options.Dungeon.motion_id_by_filename[MMD_SA.motion[skin._motion_index].filename] || ""
return RE_arms.test(motion_id) && two_handed_weapon_equipped(objs._model_index);
      }

     ,onFinish: function () {}
   }

// bone_group is possibly useful only if .copy_first_bone_frame is used
//bone_group:["腕","指"]
   ,motion: {path:'MMD.js/motion/motion_rpg_pack01.zip#/粗製のモーション３/2-handed_weapon_arms.vmd', match:{skin_jThree:RE_skin_jThree, morph_jThree:false}, para_SA:{model_index_list:MMD_SA_options.Dungeon.battle_model_index_list}}
  }
 ,{
    action: {
      condition: function (is_bone_action, objs) {
var skin = THREE.MMD.getModels()[objs._model_index].skin
var motion_id = MMD_SA_options.Dungeon.motion_id_by_filename[MMD_SA.motion[skin._motion_index].filename] || ""
return RE_parry.test(motion_id) && two_handed_weapon_equipped(objs._model_index);
      }

     ,onFinish: function () {}
   }

   ,motion: {path:'MMD.js/motion/motion_rpg_pack01.zip#/粗製のモーション３/2-handed_weapon_guard.vmd', match:{skin_jThree:{ test: function(name) { return ((name=='上半身') || RE_skin_jThree.test(name)); } }, morph_jThree:false}, para_SA:{model_index_list:MMD_SA_options.Dungeon.battle_model_index_list}}
  }

 ,{
    action: {
      condition: function (is_bone_action, objs) {
var skin = THREE.MMD.getModels()[objs._model_index].skin
var motion_id = MMD_SA_options.Dungeon.motion_id_by_filename[MMD_SA.motion[skin._motion_index].filename] || ""
return RE_arms.test(motion_id) && one_handed_weapon_equipped(objs._model_index);
      }

     ,onFinish: function () {}
   }

// bone_group is possibly useful only if .copy_first_bone_frame is used
//bone_group:["腕","指"]
   ,motion: {path:'MMD.js/motion/motion_rpg_pack01.zip#/粗製のモーション５/1-handed_weapon_arms.vmd', match:{skin_jThree:RE_skin_jThree, morph_jThree:false}, para_SA:{model_index_list:MMD_SA_options.Dungeon.battle_model_index_list}}
  }
 ,{
    action: {
      condition: function (is_bone_action, objs) {
var skin = THREE.MMD.getModels()[objs._model_index].skin
var motion_id = MMD_SA_options.Dungeon.motion_id_by_filename[MMD_SA.motion[skin._motion_index].filename] || ""
return RE_parry.test(motion_id) && one_handed_weapon_equipped(objs._model_index);
      }

     ,onFinish: function () {}
   }

   ,motion: {path:'MMD.js/motion/motion_rpg_pack01.zip#/粗製のモーション５/1-handed_weapon_guard.vmd', match:{skin_jThree:{ test: function(name) { return (RE_skin_jThree_one_handed_guard.test(name) || RE_skin_jThree.test(name)); } }, morph_jThree:false}, para_SA:{model_index_list:MMD_SA_options.Dungeon.battle_model_index_list}}
  }

 ,{
    action: {
      condition: function (is_bone_action, objs) {
var skin = THREE.MMD.getModels()[objs._model_index].skin
var motion_id = MMD_SA_options.Dungeon.motion_id_by_filename[MMD_SA.motion[skin._motion_index].filename] || ""
return MMD_SA_options.Dungeon.character.combat_mode && RE_arms.test(motion_id) && twin_weapon_equipped(objs._model_index);
      }
     ,onFinish: function () {}
   }
   ,motion: {path:'MMD.js/motion/motion_rpg_pack01.zip#/粗製のモーション４/twin_weapon_arms.vmd', match:{skin_jThree:RE_skin_jThree, morph_jThree:false}, para_SA:{model_index_list:MMD_SA_options.Dungeon.battle_model_index_list}}
  }
 ,{
    action: {
      condition: function (is_bone_action, objs) {
var skin = THREE.MMD.getModels()[objs._model_index].skin
var motion_id = MMD_SA_options.Dungeon.motion_id_by_filename[MMD_SA.motion[skin._motion_index].filename] || ""
return RE_parry.test(motion_id) && twin_weapon_equipped(objs._model_index);
      }
     ,onFinish: function () {}
   }
   ,motion: {path:'MMD.js/motion/motion_rpg_pack01.zip#/粗製のモーション４/twin_weapon_guard.vmd', match:{skin_jThree:{ test: function(name) { return ((name=='上半身') || RE_skin_jThree.test(name)); } }, morph_jThree:false}, para_SA:{model_index_list:MMD_SA_options.Dungeon.battle_model_index_list}}
  }

 ,{
    action: {
      condition: function (is_bone_action, objs) {
return one_handed_weapon_equipped(objs._model_index);
      }

     ,onFinish: function () {}
   }

   ,motion: {path:'MMD.js/motion/motion_rpg_pack01.zip#/粗製のモーション５/hand_R_weapon_hold.vmd', match:{skin_jThree:RE_skin_jThree_hand_R, morph_jThree:false}, para_SA:{model_index_list:MMD_SA_options.Dungeon.battle_model_index_list}}
  }
);
  })();

  if (!this.motion["PC combat default"]) {
    this.motion["PC combat default"] = { path:'MMD.js\\motion\\motion_rpg_pack01.zip#\\攻撃配布用\\咲夜　待機.vmd',
      para: { adjust_center_view_disabled:true, loop_on_blending:true, onended: function () { MMD_SA._no_fading=true; }
       ,model_index_list:[0]
      }
    };
    NPC_motion_list.push("PC combat default");
  }
  if (!this.motion["PC combat movement forward"]) {
    this.motion["PC combat movement forward"] = { path:'MMD.js\\motion\\motion_rpg_pack01.zip#\\攻撃配布用\\咲夜　構え歩き前進.vmd',
      para: { adjust_center_view_disabled:true, loop_on_blending:true, onended: function () { MMD_SA._no_fading=true; }
       ,model_index_list: [0]
       ,PC_parry_level: 3
      }
    };
    NPC_motion_list.push("PC combat movement forward");
  }
  if (!this.motion["PC combat movement backward"]) {
    this.motion["PC combat movement backward"] = { path:'MMD.js\\motion\\motion_rpg_pack01.zip#\\攻撃配布用\\咲夜　構え歩きバック.vmd',
      para: { adjust_center_view_disabled:true, loop_on_blending:true, onended: function () { MMD_SA._no_fading=true; }
       ,model_index_list: [0]
       ,PC_parry_level: 3
      }
    };
    NPC_motion_list.push("PC combat movement backward");
  }
  if (!this.motion["PC combat movement left"]) {
    this.motion["PC combat movement left"] = { path:'MMD.js\\motion\\motion_rpg_pack01.zip#\\攻撃配布用\\咲夜　構え歩き左.vmd',
      para: { adjust_center_view_disabled:true, loop_on_blending:true, onended: function () { MMD_SA._no_fading=true; }
       ,model_index_list: [0]
       ,PC_parry_level: 3
      }
    };
    NPC_motion_list.push("PC combat movement left");
  }
  if (!this.motion["PC combat movement right"]) {
    this.motion["PC combat movement right"] = { path:'MMD.js\\motion\\motion_rpg_pack01.zip#\\攻撃配布用\\咲夜　構え歩き右.vmd',
      para: { adjust_center_view_disabled:true, loop_on_blending:true, onended: function () { MMD_SA._no_fading=true; }
       ,model_index_list: [0]
       ,PC_parry_level: 3
      }
    };
    NPC_motion_list.push("PC combat movement right");
  }
  if (!this.motion["PC combat parry"]) {
    this.motion["PC combat parry"] = { path:'MMD.js\\motion\\motion_rpg_pack01.zip#\\攻撃配布用\\咲夜　ガード.vmd',
      para: { adjust_center_view_disabled:true, onended: function () { MMD_SA._no_fading=true; }
       ,duration: 1
       ,PC_parry_level: 3
      }
    };
  }
  if (!this.motion["PC combat parrying"]) {
    this.motion["PC combat parrying"] = { path:'MMD.js\\motion\\motion_rpg_pack01.zip#\\攻撃配布用\\咲夜　ガードヒット.vmd',
      para: { adjust_center_view_disabled:true
       ,PC_parry_level: 3
       ,motion_command_disabled: true
       ,model_index_list:[0], NPC_turns_to_you:true
       ,onended_NPC: function (model_index) {
var model_para = MMD_SA_options.model_para_obj_all[model_index]
model_para._motion_name_next = model_para.motion_name_default_combat
        }
       ,onended: function (natural_end) {
MMD_SA._no_fading = true
if (!natural_end)
  return
MMD_SA_options.motion_shuffle_list_default = MMD_SA_options._motion_shuffle_list_default.slice()
MMD_SA._force_motion_shuffle = true
        }
      }
    };
    NPC_motion_list.push("PC combat parrying");
  }
  if (!this.motion["PC combat parry broken"]) {
    this.motion["PC combat parry broken"] = { path:'MMD.js\\motion\\motion_rpg_pack01.zip#\\格闘簡易作成用モーション\\格闘シーン簡易作成用モーション２．１\\ktntk-albert-2.1\\Albert-guard-broken.vmd',
      para: { adjust_center_view_disabled:true
       ,motion_command_disabled: true
       ,model_index_list:[0], NPC_turns_to_you:true
       ,onended_NPC: function (model_index) {
var model_para = MMD_SA_options.model_para_obj_all[model_index]
model_para._motion_name_next = model_para.motion_name_default_combat
        }
       ,onended: function (natural_end) {
MMD_SA._no_fading = true
if (!natural_end)
  return
MMD_SA_options.motion_shuffle_list_default = MMD_SA_options._motion_shuffle_list_default.slice()
MMD_SA._force_motion_shuffle = true
        }
      }
    };
    NPC_motion_list.push("PC combat parry broken");
  }
  if (!this.motion["PC combat hit small"]) {
    this.motion["PC combat hit small"] = { path:'MMD.js\\motion\\motion_rpg_pack01.zip#\\攻撃配布用\\怯み弱.vmd',
      para: { adjust_center_view_disabled:true
       ,adjustment_per_model: {
  _default_ : {
    morph_default: {
  "じと目": { weight:1 }
 ,"え": { weight:1 }
 ,"困る": { weight:1 }
 ,"涙": { weight:1 }
    }
  }
        }
       ,motion_command_disabled: true
       ,model_index_list:[0], NPC_turns_to_you:true
       ,onended_NPC: function (model_index) {
var model_para = MMD_SA_options.model_para_obj_all[model_index]
model_para._motion_name_next = model_para.motion_name_default_combat
        }
       ,onended: function (natural_end) {
MMD_SA._no_fading = true
if (!natural_end)
  return
MMD_SA_options.motion_shuffle_list_default = MMD_SA_options._motion_shuffle_list_default.slice()
MMD_SA._force_motion_shuffle = true
        }
      }
    };
    NPC_motion_list.push("PC combat hit small");
  }
  if (!this.motion["PC combat hit medium"]) {
    this.motion["PC combat hit medium"] = { path:'MMD.js\\motion\\motion_rpg_pack01.zip#\\攻撃配布用\\怯み中.vmd',
      para: { adjust_center_view_disabled:true
       ,bone_to_position: [{ name:"全ての親" }]
       ,adjustment_per_model: {
  _default_ : {
    skin_default: {
  "全ての親": { keys:[{ time:0/30, pos:{x:0, y:0, z:0} }, { time:10/30, pos:{x:0, y:0, z:3} }] }
    }
   ,morph_default: {
  "じと目": { weight:1 }
 ,"え": { weight:1 }
 ,"困る": { weight:1 }
 ,"涙": { weight:1 }
    }
  }
        }
       ,motion_command_disabled: true
       ,model_index_list:[0], NPC_turns_to_you:true
       ,onended_NPC: function (model_index) {
var model_para = MMD_SA_options.model_para_obj_all[model_index]
model_para._motion_name_next = model_para.motion_name_default_combat
        }
       ,onended: function (natural_end) {
MMD_SA._no_fading = true
if (!natural_end)
  return
MMD_SA_options.motion_shuffle_list_default = MMD_SA_options._motion_shuffle_list_default.slice()
MMD_SA._force_motion_shuffle = true
        }
      }
    };
    NPC_motion_list.push("PC combat hit medium");
  }
  if (!this.motion["PC combat hit down"]) {
    this.motion["PC combat hit down"] = { path:'MMD.js\\motion\\motion_rpg_pack01.zip#\\攻撃配布用\\ふっとび　全親無し.vmd',
      para: { adjust_center_view_disabled:true
       ,duration: 2
       ,auto_blink: false
       ,super_armor: { level:99 }
       ,bone_to_position: [{ name:"全ての親" }]
       ,adjustment_per_model: {
  _default_ : {
    skin_default: {
  "全ての親": { keys:[{ time:0/30, pos:{x:0, y:0, z:0} }, { time:37/30, pos:{x:0, y:0, z:20} }] }
// ,"左足ＩＫ": { rot_scale:{x:1, y:0, z:0} }
// ,"右足ＩＫ": { rot_scale:{x:1, y:0, z:0} }
    }
   ,morph_default: {
  "はぅ": { weight:1 }
 ,"え": { weight:1 }
 ,"困る": { weight:1 }
    }
  }
 ,"yukari_mob_v04_x2.8_arm-z-35.pmx" : {
    skin_default: {
  "全ての親": { keys:[{ time:0/30, pos:{x:0, y:0, z:0} }, { time:37/30, pos:{x:0, y:0, z:20} }] }
 ,"グルーブ": { keys_mod: [
   { frame:18, pos:{x:0, y:-12.65+1.5, z:0} }
  ,{ frame:23, pos:{x:0, y:-12.00+1.5, z:0} }
  ,{ frame:27, pos:{x:0, y:-12.65+1.5, z:0} }
  ,{ frame:30, pos:{x:0, y:-12.30+1.5, z:0} }
  ,{ frame:33, pos:{x:0, y:-12.65+1.5, z:0} }
    ]
  }
// ,"左足ＩＫ": { rot_scale:{x:1, y:0, z:0} }
// ,"右足ＩＫ": { rot_scale:{x:1, y:0, z:0} }
    }
   ,morph_default: {
  "はぅ": { weight:1 }
 ,"え": { weight:1 }
 ,"困る": { weight:1 }
    }
  }
        }
       ,motion_command_disabled: true, look_at_screen: false
       ,model_index_list:[0], NPC_turns_to_you:true
       ,onended_NPC: function (model_index) {
var d = MMD_SA_options.Dungeon
if (d._states.combat && d._states.combat.ondefeated(model_index)) {
  return
}

var model_para = MMD_SA_options.model_para_obj_all[model_index]
model_para._motion_name_next = that.motion["NPC-" + model_index + " combat get up"].name
        }
       ,onended: function (natural_end) {
MMD_SA._no_fading = true
if (!natural_end)
  return

var d = MMD_SA_options.Dungeon
if (d._states.combat && d._states.combat.ondefeated(0)) {
  MMD_SA._freeze_onended = true
  return
}

MMD_SA_options.motion_shuffle_list_default = [MMD_SA_options.motion_index_by_name[that.motion["PC combat get up"].name]]
MMD_SA._force_motion_shuffle = true
        }
      }
    };
    NPC_motion_list.push("PC combat hit down");
  }
  if (!this.motion["PC combat get up"]) {
    this.motion["PC combat get up"] = { path:'MMD.js\\motion\\motion_rpg_pack01.zip#\\攻撃配布用\\起き上がり.vmd',
      para: { adjust_center_view_disabled:true
       ,motion_command_disabled: true
       ,super_armor: { level:99 }
       ,adjustment_per_model: {
  _default_ : {
    skin_default: {
//  "左足ＩＫ": { keys_mod:[{frame:0, rot:{x:64.3, y:0, z:0}}] }
// ,"右足ＩＫ": { keys_mod:[{frame:0, rot:{x:64.3, y:0, z:0}}] }
    }
   ,morph_default: {
  "じと目": { weight:0.5 }
 ,"真面目": { weight:1 }
    }
  }
 ,"yukari_mob_v04_x2.8_arm-z-35.pmx" : {
    skin_default: {
  "グルーブ": { keys_mod: [
   { frame: 0, pos:{x:0, y:-12.65+1.5, z:0} }
  ,{ frame:26, pos:{x:0, y:-12.65+1.5, z:0} }
  ,{ frame:40, pos:{x:0, y:-12.65+1.5, z:0} }
    ]
  }
// ,"左足ＩＫ": { keys_mod:[{frame:0, rot:{x:64.3, y:0, z:0}}] }
// ,"右足ＩＫ": { keys_mod:[{frame:0, rot:{x:64.3, y:0, z:0}}] }
    }
   ,morph_default: {
  "じと目": { weight:0.5 }
 ,"真面目": { weight:1 }
    }
  }

        }
       ,model_index_list:[0]
       ,onended_NPC: function (model_index) {
var model_para = MMD_SA_options.model_para_obj_all[model_index]
model_para._motion_name_next = model_para.motion_name_default_combat
        }
       ,onended: function (natural_end) {
MMD_SA._no_fading = true
if (!natural_end)
  return
MMD_SA_options.motion_shuffle_list_default = MMD_SA_options._motion_shuffle_list_default.slice()
MMD_SA._force_motion_shuffle = true
        }
      }
    };
    NPC_motion_list.push("PC combat get up");
  }
  if (!this.motion["PC combat victory"]) {
    this.motion["PC combat victory"] = { path:'MMD.js\\motion\\motion_rpg_pack01.zip#\\emote\\happy1.vmd',
      para: { adjust_center_view_disabled:true
       ,motion_command_disabled: true
       ,onended: function (natural_end) {
MMD_SA._no_fading = true
MMD_SA_options.motion_shuffle_list_default = MMD_SA_options._motion_shuffle_list_default.slice()
MMD_SA._force_motion_shuffle = true

MMD_SA_options.Dungeon.character.combat_mode = false
        }
      }
    };
//    NPC_motion_list.push("PC combat victory");
  }

  if (!this.motion["PC combat attack 01"]) {
    this.motion["PC combat attack 01"] = {
//+8,5,9
      path:'MMD.js\\motion\\motion_rpg_pack01.zip#\\FIGHT - モコキッカーのクソモーション詰め合わせ★13杯\\+-+-+通常、必殺技BOX\\ともみ【3RP LK LP】.vmd'
     ,para: { adjust_center_view_disabled:true, onended: function () { MMD_SA._no_fading=true; }
       ,model_index_list: [0]
       ,bone_to_position: [{ name:"センター", scale:{x:0,y:0,z:1} }]
//       ,motion_command_disabled: true
       ,NPC_motion_command_disabled: true
       ,combat_para: [
  { frame_range:[ 4, 6], hit_level:2, SFX:{ bone_to_pos:"右手首" } }
 ,{ frame_range:[15,18], hit_level:2, SFX:{ bone_to_pos:"左足首" } }
 ,{ frame_range:[29,35], hit_level:3, SFX:{ bone_to_pos:"左手首" } }
        ]
       ,motion_duration: 37/30
       ,motion_duration_by_combo: [
  { combo_RE: "9", motion_duration:37/30 }
// ,{ combo_RE: "5",  motion_duration:22/30 }
 ,{ motion_duration:22/30 }//9/30 }
        ]
      }
    };
    NPC_motion_list.push("PC combat attack 01");
  }
  if (!this.motion["PC combat attack 02"]) {
    this.motion["PC combat attack 02"] = {
//4,4,4,5
      path:'MMD.js\\motion\\motion_rpg_pack01.zip#\\FIGHT - モコキッカーのクソモーション詰め合わせ★13杯\\+-+-+通常、必殺技BOX\\RED白【鬼哭連脚】.vmd'
     ,para: { adjust_center_view_disabled:true, onended: function () { MMD_SA._no_fading=true; }
       ,model_index_list: [0]
       ,mov_speed: [{ frame:0, speed:{x:0, y:0, z: 0.25*30} }]
//       ,motion_command_disabled: true
       ,NPC_motion_command_disabled: true
       ,adjustment_per_model: {
  _default_ : {
    skin_default: {
//RS白_冬期軽装型_v011-Bk-R.pmx
  "センター": { pos_scale:{ auto_adjust:{ref_length:11.65455} } }
 ,"左足ＩＫ": { pos_scale:{ auto_adjust:{ref_length:11.65455-1.78831, scale:0.5} } }
 ,"右足ＩＫ": { pos_scale:{ auto_adjust:{ref_length:11.65455-1.78831, scale:0.5} } }
    }
  }
        }
       ,combat_para: [
  { frame_range:[ 4, 6], hit_level:1, SFX:{ bone_to_pos:"左足首" } }
 ,{ frame_range:[ 7, 9], hit_level:1, SFX:{ bone_to_pos:"左足首" } }
 ,{ frame_range:[10,12], hit_level:1, SFX:{ bone_to_pos:"左足首" } }
 ,{ frame_range:[13,15], hit_level:1, SFX:{ bone_to_pos:"左足首" } }
 ,{ frame_range:[16,20], hit_level:2, SFX:{ bone_to_pos:"左足首" } }
        ]
       ,motion_duration: 28/30
       ,motion_duration_by_combo: [
  { combo_RE: "4,5", motion_duration:28/30 }
 ,{ combo_RE: "4",   motion_duration:15.5/30 }
 ,{ motion_duration:9.5/30 }
        ]
      }
    };
    NPC_motion_list.push("PC combat attack 02");
  }
  if (!this.motion["PC combat attack 03"]) {
    this.motion["PC combat attack 03"] = {
//7,7,8
      path:'MMD.js\\motion\\motion_rpg_pack01.zip#\\FIGHT - モコキッカーのクソモーション詰め合わせ★13杯\\+-+-+通常、必殺技BOX\\RED黒【鬼哭連拳】.vmd'
     ,para: { adjust_center_view_disabled:true, onended: function () { MMD_SA._no_fading=true; }
       ,model_index_list: [0]
       ,bone_to_position: [{ name:"センター", scale:{x:0,y:0,z:1} }]
//       ,motion_command_disabled: true
       ,NPC_motion_command_disabled: true
       ,combat_para: [
  { frame_range:[ 2, 4], hit_level:1, SFX:{ bone_to_pos:"左手首" } }
 ,{ frame_range:[ 5, 7], hit_level:1, SFX:{ bone_to_pos:"右手首" } }
 ,{ frame_range:[10,13], hit_level:2, SFX:{ bone_to_pos:"右手首" } }
        ]
       ,motion_duration: 20/30
       ,motion_duration_by_combo: [
  { combo_RE: "8", motion_duration:20/30 }
 ,{ motion_duration:8/30 }
        ]
      }
    };
    NPC_motion_list.push("PC combat attack 03");
  }
  if (!this.motion["PC combat attack 04"]) {
    this.motion["PC combat attack 04"] = {
//45,45
      path:'MMD.js\\motion\\motion_rpg_pack01.zip#\\FIGHT - モコキッカーのクソモーション詰め合わせ★13杯\\+-+-+通常、必殺技BOX\\まこと【立ち中K-中K】.vmd'
     ,para: { adjust_center_view_disabled:true, onended: function () { MMD_SA._no_fading=true; }
       ,model_index_list: [0]
       ,bone_to_position: [{ name:"センター", scale:{x:0,y:0,z:1} }]
       ,adjustment_per_model: {
  _default_ : {
    skin_default: {
//菊地真カジュアル Ver2.0a_簡易版.pmx
  "センター": { pos_scale:{ auto_adjust:{ref_length:11.03743} } }
 ,"左足ＩＫ": { pos_scale:{ auto_adjust:{ref_length:11.03743-1.3733, scale:0.5} } }
 ,"右足ＩＫ": { pos_scale:{ auto_adjust:{ref_length:11.03743-1.3733, scale:0.5} } }
    }
  }
        }
//       ,motion_command_disabled: true
       ,NPC_motion_command_disabled: true
       ,combat_para: [
  { frame_range:[ 3, 6], hit_level:2, SFX:{ bone_to_pos:"左足首" } }
 ,{ frame_range:[12,16], hit_level:2, SFX:{ bone_to_pos:"左足首" } }
        ]
       ,motion_duration: 28/30
      }
    };
    NPC_motion_list.push("PC combat attack 04");
  }
  if (!this.motion["PC combat attack 05"]) {
    this.motion["PC combat attack 05"] = {
//5,5,4,6
      path:'MMD.js\\motion\\motion_rpg_pack01.zip#\\FIGHT - モコキッカーのクソモーション詰め合わせ★13杯\\+-+-+通常、必殺技BOX\\千早【LF～ストンピングダブルニー～左構え】.vmd'
     ,para: { adjust_center_view_disabled:true, onended: function () { MMD_SA._no_fading=true; }
       ,model_index_list: [0]
       ,bone_to_position: [{ name:"全ての親", scale:{x:1,y:0,z:1} }, { name:"センター", scale:{x:0,y:0,z:1} }]
       ,adjustment_per_model: {
  _default_ : {
    skin_default: {
  "全ての親": { pos_add:{x:15.6, y:0, z:0}, rot_add:{x:0, y:90, z:0} }
//如月千早カジュアル Ver.2.0a_簡易版.pmx
 ,"センター": { pos_scale:{ auto_adjust:{ref_length:11.57427} } }
 ,"左足ＩＫ": { pos_scale:{ auto_adjust:{ref_length:11.57427-1.5702, scale:0.5} } }
 ,"右足ＩＫ": { pos_scale:{ auto_adjust:{ref_length:11.57427-1.5702, scale:0.5} } }
    }
  }
        }
//       ,motion_command_disabled: true
       ,NPC_motion_command_disabled: true
       ,combat_para: [
  { frame_range:[ 5,10], hit_level:2, SFX:{ bone_to_pos:"左足首" } }
 ,{ frame_range:[18,21], hit_level:1, SFX:{ bone_to_pos:"右ひざ" } }
 ,{ frame_range:[23,28], hit_level:3, SFX:{ bone_to_pos:"左ひざ" } }
        ]
       ,motion_duration: 44/30
       ,motion_duration_by_combo: [
  { combo_RE: "4,6", motion_duration:44/30 }
 ,{ motion_duration:15/30 }
        ]
      }
    };
    NPC_motion_list.push("PC combat attack 05");
  }
  if (!this.motion["PC combat attack 06"]) {
    this.motion["PC combat attack 06"] = {
//5,4,5,6
      path:'MMD.js\\motion\\motion_rpg_pack01.zip#\\FIGHT - モコキッカーのクソモーション詰め合わせ★13杯\\+-+-+通常、必殺技BOX\\千早【RF~アサルトラッシュ～ブルーサンダー～RF】.vmd'
     ,para: { adjust_center_view_disabled:true, onended: function () { MMD_SA._no_fading=true; }
       ,model_index_list: [0]
       ,mov_speed: [{ frame:0, speed:{x:0, y:0, z: 0.25*30} }]
       ,bone_to_position: [{ name:"全ての親", scale:{x:1,y:0,z:1} }, { name:"センター", scale:{x:0,y:0,z:1} }]
       ,adjustment_per_model: {
  _default_ : {
    skin_default: {
  "全ての親": { pos_add:{x:-2.4, y:0, z:0}, rot_add:{x:0, y:90, z:0} }
//如月千早カジュアル Ver.2.0a_簡易版.pmx
 ,"センター": { pos_scale:{ auto_adjust:{ref_length:11.57427} } }
 ,"左足ＩＫ": { pos_scale:{ auto_adjust:{ref_length:11.57427-1.5702, scale:0.5} } }
 ,"右足ＩＫ": { pos_scale:{ auto_adjust:{ref_length:11.57427-1.5702, scale:0.5} } }
    }
  }
        }
//       ,motion_command_disabled: true
       ,NPC_motion_command_disabled: true
       ,combat_para: [
  { frame_range:[ 2, 5], hit_level:2, SFX:{ bone_to_pos:"右足首" } }
 ,{ frame_range:[ 9,11], hit_level:1, SFX:{ bone_to_pos:"右足首" } }
 ,{ frame_range:[20,24], hit_level:2, SFX:{ bone_to_pos:"右足首" } }
 ,{ frame_range:[38,43], hit_level:3, SFX:{ bone_to_pos:"右足首" } }
        ]
       ,motion_duration: 62/30
       ,motion_duration_by_combo: [
  { combo_RE: "5,6", motion_duration:62/30 }
 ,{ combo_RE: "5",   motion_duration:30/30 }
 ,{ motion_duration:12/30 }
        ]
      }
    };
    NPC_motion_list.push("PC combat attack 06");
  }
  if (!this.motion["PC combat attack 07"]) {
    this.motion["PC combat attack 07"] = {
//+8,7,9
      path:'MMD.js\\motion\\motion_rpg_pack01.zip#\\FIGHT - モコキッカーのクソモーション詰め合わせ★13杯\\+-+-+通常、必殺技BOX\\千早【RF～マッハコンビネーション】.vmd'
     ,para: { adjust_center_view_disabled:true, onended: function () { MMD_SA._no_fading=true; }
       ,model_index_list: [0]
       ,bone_to_position: [{ name:"全ての親", scale:{x:1,y:0,z:1} }, { name:"センター", scale:{x:0,y:0,z:1} }]
       ,adjustment_per_model: {
  _default_ : {
    skin_default: {
  "全ての親": { pos_add:{x:28.35, y:0, z:0}, rot_add:{x:0, y:90, z:0} }
    }
  }
        }
//       ,motion_command_disabled: true
       ,NPC_motion_command_disabled: true
       ,combat_para: [
  { frame_range:[ 6,10], hit_level:2, SFX:{ bone_to_pos:"左手首" } }
 ,{ frame_range:[18,21], hit_level:1, SFX:{ bone_to_pos:"右手首" } }
 ,{ frame_range:[27,35], hit_level:3, SFX:{ bone_to_pos:"右手首" } }
        ]
       ,motion_duration: 60/30
       ,motion_duration_by_combo: [
  { combo_RE: "9", motion_duration:60/30 }
 ,{ motion_duration:25/30 }
        ]
      }
    };
    NPC_motion_list.push("PC combat attack 07");
  }
  if (!this.motion["PC combat attack 08"]) {
    this.motion["PC combat attack 08"] = {
//45,56
      path:'MMD.js\\motion\\motion_rpg_pack01.zip#\\FIGHT - モコキッカーのクソモーション詰め合わせ★13杯\\+-+-+通常、必殺技BOX\\千早【左構え～ステップキックソバット～LF】.vmd'
     ,para: { adjust_center_view_disabled:true, onended: function () { MMD_SA._no_fading=true; }
       ,model_index_list: [0]
       ,bone_to_position: [{ name:"全ての親", scale:{x:1,y:0,z:1} }, { name:"センター", scale:{x:0,y:0,z:1} }]
       ,adjustment_per_model: {
  _default_ : {
    skin_default: {
  "全ての親": { pos_add:{x:-8.5, y:0, z:0}, rot_add:{x:0, y:90, z:0} }
//如月千早カジュアル Ver.2.0a_簡易版.pmx
 ,"センター": { pos_scale:{ auto_adjust:{ref_length:11.57427} } }
 ,"左足ＩＫ": { pos_scale:{ auto_adjust:{ref_length:11.57427-1.5702, scale:0.5} } }
 ,"右足ＩＫ": { pos_scale:{ auto_adjust:{ref_length:11.57427-1.5702, scale:0.5} } }
    }
  }
        }
//       ,motion_command_disabled: true
       ,NPC_motion_command_disabled: true
       ,combat_para: [
  { frame_range:[ 8,11], hit_level:2, SFX:{ bone_to_pos:"右足首" } }
 ,{ frame_range:[21,26], hit_level:3, SFX:{ bone_to_pos:"左足首" } }
        ]
       ,motion_duration: 41/30
      }
    };
    NPC_motion_list.push("PC combat attack 08");
  }
  if (!this.motion["PC combat attack 09"]) {
    this.motion["PC combat attack 09"] = {
//+4,8,8,9
      path:'MMD.js\\motion\\motion_rpg_pack01.zip#\\FIGHT - モコキッカーのクソモーション詰め合わせ★13杯\\+-+-+通常、必殺技BOX\\千早【左構え～ブラストコンビネーション】.vmd'
     ,para: { adjust_center_view_disabled:true, onended: function () { MMD_SA._no_fading=true; }
       ,model_index_list: [0]
       ,bone_to_position: [{ name:"全ての親", scale:{x:1,y:0,z:1} }, { name:"センター", scale:{x:0,y:0,z:1} }]
       ,adjustment_per_model: {
  _default_ : {
    skin_default: {
  "全ての親": { pos_add:{x:-28.7, y:0, z:0}, rot_add:{x:0, y:90, z:0} }
    }
  }
        }
//       ,motion_command_disabled: true
       ,NPC_motion_command_disabled: true
       ,combat_para: [
  { frame_range:[ 4, 7], hit_level:1, SFX:{ bone_to_pos:"左足首" } }
 ,{ frame_range:[12,15], hit_level:2, SFX:{ bone_to_pos:"左手首" } }
 ,{ frame_range:[22,25], hit_level:2, SFX:{ bone_to_pos:"右手首" } }
 ,{ frame_range:[29,32], hit_level:3, SFX:{ bone_to_pos:"左手首" } }
        ]
       ,motion_duration: 60/30
       ,motion_duration_by_combo: [
  { combo_RE: "8,9", motion_duration:60/30 }
 ,{ combo_RE: "8",   motion_duration:27/30 }
 ,{ motion_duration:20/30 }
        ]
      }
    };
    NPC_motion_list.push("PC combat attack 09");
  }
  if (!this.motion["PC combat attack 10"]) {
    this.motion["PC combat attack 10"] = {
//8,7,7,5
      path:'MMD.js\\motion\\motion_rpg_pack01.zip#\\FIGHT - モコキッカーのクソモーション詰め合わせ★13杯\\+-+-+通常、必殺技BOX\\千早【左構え～ラピッドフィストロー～RF】.vmd'
     ,para: { adjust_center_view_disabled:true, onended: function () { MMD_SA._no_fading=true; }
       ,model_index_list: [0]
       ,bone_to_position: [{ name:"全ての親", scale:{x:1,y:0,z:1} }, { name:"センター", scale:{x:0,y:0,z:1} }]
       ,adjustment_per_model: {
  _default_ : {
    skin_default: {
  "全ての親": { pos_add:{x:-8.5, y:0, z:0}, rot_add:{x:0, y:90, z:0} }
    }
  }
        }
//       ,motion_command_disabled: true
       ,NPC_motion_command_disabled: true
       ,combat_para: [
  { frame_range:[ 7,10], hit_level:2, SFX:{ bone_to_pos:"右手首" } }
 ,{ frame_range:[15,18], hit_level:1, SFX:{ bone_to_pos:"左手首" } }
 ,{ frame_range:[21,24], hit_level:1, SFX:{ bone_to_pos:"左手首" } }
 ,{ frame_range:[29,32], hit_level:2, SFX:{ bone_to_pos:"右足首" } }
        ]
       ,motion_duration: 47/30
       ,motion_duration_by_combo: [
  { combo_RE: "7,5", motion_duration:47/30 }
 ,{ combo_RE: "7",   motion_duration:26/30 }
 ,{ motion_duration:19/30 }
        ]
      }
    };
    NPC_motion_list.push("PC combat attack 10");
  }
  if (!this.motion["PC combat attack 11"]) {
    this.motion["PC combat attack 11"] = {
//456
      path:'MMD.js\\motion\\motion_rpg_pack01.zip#\\FIGHT - モコキッカーのクソモーション詰め合わせ★13杯\\+-+-+通常、必殺技BOX\\日高舞『踵斧』.vmd'
     ,para: { adjust_center_view_disabled:true, onended: function () { MMD_SA._no_fading=true; }
       ,model_index_list: [0]
//       ,mov_speed: [{ frame:0, speed:{x:0, y:0, z: 0.05*30} }]
       ,adjustment_per_model: {
  _default_ : {
    skin_default: {
  "全ての親": { rot_add:{x:0, y:-90, z:0} }
//日高舞.pmx
 ,"センター": { pos_scale:{ auto_adjust:{ref_length:11.67395} } }
 ,"左足ＩＫ": { pos_scale:{ auto_adjust:{ref_length:11.67395-1.750509, scale:0.5} } }
 ,"右足ＩＫ": { pos_scale:{ auto_adjust:{ref_length:11.67395-1.750509, scale:0.5} } }
    }
  }
        }
//       ,motion_command_disabled: true
       ,NPC_motion_command_disabled: true
       ,super_armor: { level:2, damage_scale:0.5 }
       ,combat_para: [
  { frame_range:[41,50], hit_level:5, SFX:{ bone_to_pos:"左足首", pos_offset:{x:0, y:10, z:0}, visual:{ hit:{ sprite:[{name:"explosion_red_01", scale:2}] } } }, bb_expand:{x:0.5*3, y:0, z:0.5*3} }
        ]
       ,motion_duration: 95/30

,SFX: [{frame_range:[41,999], sprite:[{bone_ref:"左足首",name:"explosion_sinestesia-01_03",scale:3,depth:5}]/*, camera_shake:{magnitude:0.2,duration:500}*/}]
      }
    };
    NPC_motion_list.push("PC combat attack 11");
  }
  if (!this.motion["PC combat attack 12"]) {
    this.motion["PC combat attack 12"] = {
//7,8,7,8,9
      path:'MMD.js\\motion\\motion_rpg_pack01.zip#\\FIGHT - モコキッカーのクソモーション詰め合わせ★13杯\\+-+-+通常、必殺技BOX\\狂気フラン【TC-弱P弱P中P強P強P】.vmd'
     ,para: { adjust_center_view_disabled:true, onended: function () { MMD_SA._no_fading=true; }
       ,model_index_list: [0]
       ,bone_to_position: [{ name:"センター", scale:{x:1,y:0,z:0} }]
       ,adjustment_per_model: {
  _default_ : {
    skin_default: {
  "全ての親": { rot_add:{x:0, y:-90, z:0} }
    }
  }
        }
//       ,motion_command_disabled: true
       ,NPC_motion_command_disabled: true
       ,combat_para: [
  { frame_range:[ 1, 3], hit_level:1, SFX:{ bone_to_pos:"右手首" } }
 ,{ frame_range:[ 9,11], hit_level:2, SFX:{ bone_to_pos:"左手首" } }
 ,{ frame_range:[19,21], hit_level:1, SFX:{ bone_to_pos:"左手首" } }
 ,{ frame_range:[31,35], hit_level:2, SFX:{ bone_to_pos:"左手首" } }
 ,{ frame_range:[38,43], hit_level:3, SFX:{ bone_to_pos:"左手首", pos_offset:{x:0, y:-5, z:0} } }
        ]
       ,motion_duration: 47/30
       ,motion_duration_by_combo: [
  { combo_RE: "7,8,9", motion_duration:47/30 }
 ,{ combo_RE: "7,8",   motion_duration:36/30 }
 ,{ combo_RE: "7",     motion_duration:25/30 }
 ,{ motion_duration:17/30 }
        ]
      }
    };
    NPC_motion_list.push("PC combat attack 12");
  }
  if (!this.motion["PC combat attack 13"]) {
    this.motion["PC combat attack 13"] = {
//4,7,8
      path:'MMD.js\\motion\\motion_rpg_pack01.zip#\\FIGHT - モコキッカーのクソモーション詰め合わせ★13杯\\+-+-+通常、必殺技BOX\\東豪寺麗華【修羅覇王靠華山】.vmd'
     ,para: { adjust_center_view_disabled:true, onended: function () { MMD_SA._no_fading=true; }
       ,model_index_list: [0]
       ,bone_to_position: [{ name:"センター", scale:{x:0,y:0,z:1} }]
//       ,motion_command_disabled: true
       ,NPC_motion_command_disabled: true
       ,combat_para: [
  { frame_range:[ 2, 4], hit_level:1, SFX:{ bone_to_pos:"右足首" } }
 ,{ frame_range:[10,12], hit_level:1, SFX:{ bone_to_pos:"左手首" } }
 ,{ frame_range:[16,19], hit_level:2, SFX:{ bone_to_pos:"右ひじ" } }
        ]
       ,motion_duration: 29/30
       ,motion_duration_by_combo: [
  { combo_RE: "8", motion_duration:29/30 }
 ,{ motion_duration:13/30 }
        ]
      }
    };
    NPC_motion_list.push("PC combat attack 13");
  }
  if (!this.motion["PC combat attack 14"]) {
    this.motion["PC combat attack 14"] = {
//+7,5,6
      path:'MMD.js\\motion\\motion_rpg_pack01.zip#\\FIGHT - モコキッカーのクソモーション詰め合わせ★13杯\\+-+-+通常、必殺技BOX\\美心【背向け-RPRKWK-ダークナイトコンビネーション】.vmd'
     ,para: { adjust_center_view_disabled:true, onended: function () { MMD_SA._no_fading=true; }
       ,model_index_list: [0]
       ,bone_to_position: [{ name:"センター", scale:{x:0,y:0,z:1} }]
//       ,motion_command_disabled: true
       ,NPC_motion_command_disabled: true
       ,combat_para: [
  { frame_range:[ 5, 7], hit_level:1, SFX:{ bone_to_pos:"右手首" } }
 ,{ frame_range:[14,17], hit_level:2, SFX:{ bone_to_pos:"右足首" } }
 ,{ frame_range:[31,34], hit_level:3, SFX:{ bone_to_pos:"右足首" } }
        ]
       ,motion_duration: 45/30
       ,motion_duration_by_combo: [
  { combo_RE: "6", motion_duration:45/30 }
 ,{ motion_duration:23/30 }
        ]
      }
    };
    NPC_motion_list.push("PC combat attack 14");
  }
  if (!this.motion["PC combat attack 15"]) {
    this.motion["PC combat attack 15"] = {
//78,78,8,9
      path:'MMD.js\\motion\\motion_rpg_pack01.zip#\\FIGHT - モコキッカーのクソモーション詰め合わせ★13杯\\+-+-+通常、必殺技BOX\\渋谷凛【サラマンダーコンビネーション】.vmd'
     ,para: { adjust_center_view_disabled:true, onended: function () { MMD_SA._no_fading=true; }
       ,model_index_list: [0]
       ,bone_to_position: [{ name:"センター", scale:{x:0,y:0,z:1} }]
//       ,motion_command_disabled: true
       ,NPC_motion_command_disabled: true
       ,combat_para: [
  { frame_range:[ 4, 7], hit_level:2, SFX:{ bone_to_pos:"右手首" } }
 ,{ frame_range:[12,14], hit_level:1, SFX:{ bone_to_pos:"左手首" } }
 ,{ frame_range:[18,20], hit_level:1, SFX:{ bone_to_pos:"左手首" } }
 ,{ frame_range:[24,26], hit_level:2, SFX:{ bone_to_pos:"左手首" } }
 ,{ frame_range:[37,41], hit_level:3, SFX:{ bone_to_pos:"左手首" } }
        ]
       ,motion_duration: 43/30
       ,motion_duration_by_combo: [
  { combo_RE: "8,9", motion_duration:43/30 }
 ,{ combo_RE: "8",   motion_duration:28/30 }
 ,{ motion_duration:22/30 }
        ]
      }
    };
    NPC_motion_list.push("PC combat attack 15");
  }
  if (!this.motion["PC combat attack 16"]) {
    this.motion["PC combat attack 16"] = {
//+7,7,8,9
      path:'MMD.js\\motion\\motion_rpg_pack01.zip#\\FIGHT - モコキッカーのクソモーション詰め合わせ★13杯\\+-+-+通常、必殺技BOX\\渋谷凛【フラッシュアサルトコンボ-ターンイン-ボディストレート】.vmd'
     ,para: { adjust_center_view_disabled:true, onended: function () { MMD_SA._no_fading=true; }
       ,model_index_list: [0]
       ,bone_to_position: [{ name:"センター", scale:{x:0,y:0,z:1} }]
//       ,motion_command_disabled: true
       ,NPC_motion_command_disabled: true
       ,combat_para: [
  { frame_range:[ 2, 4], hit_level:1, SFX:{ bone_to_pos:"左手首" } }
 ,{ frame_range:[ 5, 7], hit_level:1, SFX:{ bone_to_pos:"左手首" } }
 ,{ frame_range:[ 8,11], hit_level:1, SFX:{ bone_to_pos:"左手首" } }
 ,{ frame_range:[13,16], hit_level:2, SFX:{ bone_to_pos:"右手首" } }
 ,{ frame_range:[27,30], hit_level:3, SFX:{ bone_to_pos:"右手首" } }
        ]
       ,motion_duration: 35/30
       ,motion_duration_by_combo: [
  { combo_RE: "8,9", motion_duration:35/30 }
 ,{ combo_RE: "8",   motion_duration:18/30 }
 ,{ motion_duration:12/30 }
        ]
      }
    };
    NPC_motion_list.push("PC combat attack 16");
  }
  if (!this.motion["PC combat attack 17"]) {
    this.motion["PC combat attack 17"] = {
//8,8,7,6
      path:'MMD.js\\motion\\motion_rpg_pack01.zip#\\攻撃配布用\\咲夜　基本攻撃.vmd'
     ,para: { adjust_center_view_disabled:true, onended: function () { MMD_SA._no_fading=true; }
       ,model_index_list: [0]
       ,mov_speed: [{ frame:0, speed:{x:0, y:0, z: 0.25*30} }]
//       ,motion_command_disabled: true
       ,NPC_motion_command_disabled: true
       ,combat_para: [
  { frame_range:[ 2, 5], hit_level:2, SFX:{ bone_to_pos:"左手首" } }
 ,{ frame_range:[13,15], hit_level:2, SFX:{ bone_to_pos:"右手首" } }
 ,{ frame_range:[25,28], hit_level:1, SFX:{ bone_to_pos:"左手首" } }
 ,{ frame_range:[36,40], hit_level:3, SFX:{ bone_to_pos:"右足首" } }
        ]
       ,motion_duration: 53/30
       ,motion_duration_by_combo: [
  { combo_RE: "7,6", motion_duration:53/30 }
 ,{ combo_RE: "7",   motion_duration:30/30 }
 ,{ motion_duration:18/30 }
        ]
      }
    };
    NPC_motion_list.push("PC combat attack 17");
  }
  if (!this.motion["PC combat attack 18"]) {
    this.motion["PC combat attack 18"] = {
//+4,5,8,9
      path:'MMD.js\\motion\\motion_rpg_pack01.zip#\\格闘簡易作成用モーション\\格闘シーン簡易作成用モーション\\格闘簡易作成用モーション\\Albert-combo6.vmd'
     ,para: { adjust_center_view_disabled:true, onended: function () { MMD_SA._no_fading=true; }
       ,model_index_list: [0]
       ,mov_speed: [{ frame:0, speed:{x:0, y:0, z: 0.5*30} }]
//       ,motion_command_disabled: true
       ,NPC_motion_command_disabled: true
       ,combat_para: [
  { frame_range:[ 7, 9], hit_level:1, SFX:{ bone_to_pos:"右足首" } }
 ,{ frame_range:[13,16], hit_level:2, SFX:{ bone_to_pos:"左足首" } }
 ,{ frame_range:[23,26], hit_level:2, SFX:{ bone_to_pos:"左手首" } }
 ,{ frame_range:[33,37], hit_level:3, SFX:{ bone_to_pos:"右手首" } }
        ]
       ,motion_duration: 54/30
       ,motion_duration_by_combo: [
  { combo_RE: "8,9", motion_duration:53/30 }
 ,{ combo_RE: "8",   motion_duration:31/30 }
 ,{ motion_duration:22/30 }
        ]
      }
    };
    NPC_motion_list.push("PC combat attack 18");
  }
  if (!this.motion["PC combat attack 19"]) {
    this.motion["PC combat attack 19"] = {
//56,56
      path:'MMD.js\\motion\\motion_rpg_pack01.zip#\\格闘簡易作成用モーション\\格闘シーン簡易作成用モーション\\格闘簡易作成用モーション\\Albert-somersault-kick.vmd'
     ,para: { adjust_center_view_disabled:true, onended: function () { MMD_SA._no_fading=true; }
       ,model_index_list: [0]
       ,mov_speed: [{ frame:0, speed:{x:0, y:0, z: 0.25*30} }]
//       ,motion_command_disabled: true
       ,NPC_motion_command_disabled: true
       ,combat_para: [
  { frame_range:[ 9,12], hit_level:2, SFX:{ bone_to_pos:"左足首" } }
 ,{ frame_range:[15,18], hit_level:3, SFX:{ bone_to_pos:"右足首" } }
        ]
       ,motion_duration: 38/30
      }
    };
    NPC_motion_list.push("PC combat attack 19");
  }

  if (!this.motion["PC combat attack 2-handed weapon 01"]) {
    this.motion["PC combat attack 2-handed weapon 01"] = {
      path:'MMD.js\\motion\\motion_rpg_pack01.zip#\\粗製のモーション３\\ナイトミク\\k.miku-2hand-Claymore（全親追従）.vmd'
     ,para: { adjust_center_view_disabled:true, onended: function () { MMD_SA._no_fading=true; }
       ,model_index_list: [0]
       ,bone_to_position: [{ name:"全ての親", scale:{x:1,y:0,z:1} }]
//       ,motion_command_disabled: true
       ,NPC_motion_command_disabled: true
       ,super_armor: { level:2, damage_scale:0.5 }
       ,combat_para: [
  { frame_range:[12,14], hit_level:2, SFX:{ bone_to_pos:"右手首" }, bb_expand:{x:0.5*2, y:0, z:0.5*2}, bb_translate:{x:0, y:0, z:0.5*2} }
 ,{ frame_range:[41,43], hit_level:3, SFX:{ bone_to_pos:"右手首" }, bb_expand:{x:0.5*2, y:0, z:0.5*2}, bb_translate:{x:0, y:0, z:0.5*2} }
        ]
       ,motion_duration: 88/30
//       ,duration: 88/30+10
//       ,duration_NPC: 88/30
      }
    };
    NPC_motion_list.push("PC combat attack 2-handed weapon 01");
  }

  if (!this.motion["PC combat attack twin weapon 01"]) {
    this.motion["PC combat attack twin weapon 01"] = {
// 2,2
      path:'MMD.js\\motion\\motion_rpg_pack01.zip#\\粗製のモーション４\\astora\\2sword\\astora-2sword-handaxe1（全親追従）.vmd'
     ,para: { adjust_center_view_disabled:true, onended: function () { MMD_SA._no_fading=true; }
       ,model_index_list: [0]
       ,bone_to_position: [{ name:"全ての親", scale:{x:1,y:0,z:1} }]
//       ,motion_command_disabled: true
       ,NPC_motion_command_disabled: true
       ,super_armor: { level:1, damage_scale:0.5 }
       ,combat_para: [
  { frame_range:[18,20], hit_level:2, SFX:{ bone_to_pos:"右手首", sound:{hit:{ name:"hit_slash"}} }, bb_expand:{x:0.5*2, y:0, z:0.5*2}, bb_translate:{x:0, y:0, z:0.5*2}, sound_name:"swing" }
 ,{ frame_range:[43,45], hit_level:3, SFX:{ bone_to_pos:"右手首", sound:{hit:{ name:"hit_slash"}} }, bb_expand:{x:0.5*2, y:0, z:0.5*2}, bb_translate:{x:0, y:0, z:0.5*2}, sound_name:"swing" }
        ]
       ,motion_duration: 76/30
       ,motion_duration_by_combo: [
  { combo_RE: "3",   motion_duration:76/30 }
 ,{ motion_duration: 28/30 }
        ]
       ,playbackRate_by_model_index: {"0":1.5}
      }
    };
    NPC_motion_list.push("PC combat attack twin weapon 01");
  }
  if (!this.motion["PC combat attack twin weapon 02"]) {
    this.motion["PC combat attack twin weapon 02"] = {
// 2,1
      path:'MMD.js\\motion\\motion_rpg_pack01.zip#\\粗製のモーション４\\astora\\2sword\\astora-2sword-handaxe2（全親追従）.vmd'
     ,para: { adjust_center_view_disabled:true, onended: function () { MMD_SA._no_fading=true; }
       ,model_index_list: [0]
       ,bone_to_position: [{ name:"全ての親", scale:{x:1,y:0,z:1} }]
//       ,motion_command_disabled: true
       ,NPC_motion_command_disabled: true
       ,super_armor: { level:1, damage_scale:0.5 }
       ,combat_para: [
  { frame_range:[23,26], hit_level:2, SFX:{ bone_to_pos:"右手首", sound:{hit:{ name:"hit_slash"}} }, bb_expand:{x:0.5*2, y:0, z:0.5*2}, bb_translate:{x:0, y:0, z:0.5*2}, sound_name:"swing" }
 ,{ frame_range:[28,30], hit_level:1, SFX:{ bone_to_pos:"左手首", sound:{hit:{ name:"hit_slash"}} }, bb_expand:{x:0.5*2, y:0, z:0.5*2}, bb_translate:{x:0, y:0, z:0.5*2}, sound_name:"swing" }
 ,{ frame_range:[47,50], hit_level:3, SFX:{ bone_to_pos:"右手首", sound:{hit:{ name:"hit_slash"}} }, bb_expand:{x:0.5*2, y:0, z:0.5*2}, bb_translate:{x:0, y:0, z:0.5*2}, sound_name:"swing" }
        ]
       ,motion_duration: 78/30
       ,motion_duration_by_combo: [
  { combo_RE: "3",   motion_duration:78/30 }
 ,{ motion_duration: 34/30 }
        ]
       ,playbackRate_by_model_index: {"0":1.5}
      }
    };
    NPC_motion_list.push("PC combat attack twin weapon 02");
  }
  if (!this.motion["PC combat attack twin weapon 03"]) {
    this.motion["PC combat attack twin weapon 03"] = {
// 12,12
      path:'MMD.js\\motion\\motion_rpg_pack01.zip#\\粗製のモーション４\\astora\\2sword\\astora-2sword-longsword1（全親追従）.vmd'
     ,para: { adjust_center_view_disabled:true, onended: function () { MMD_SA._no_fading=true; }
       ,model_index_list: [0]
       ,bone_to_position: [{ name:"全ての親", scale:{x:1,y:0,z:1} }]
//       ,motion_command_disabled: true
       ,NPC_motion_command_disabled: true
       ,super_armor: { level:1, damage_scale:0.5 }
       ,combat_para: [
  { frame_range:[13,15], hit_level:2, SFX:{ bone_to_pos:"右手首", sound:{hit:{ name:"hit_slash"}} }, bb_expand:{x:0.5*2, y:0, z:0.5*2}, bb_translate:{x:0, y:0, z:0.5*2}, sound_name:"swing" }
 ,{ frame_range:[36,38], hit_level:3, SFX:{ bone_to_pos:"右手首", sound:{hit:{ name:"hit_slash"}} }, bb_expand:{x:0.5*2, y:0, z:0.5*2}, bb_translate:{x:0, y:0, z:0.5*2}, sound_name:"swing" }
        ]
       ,motion_duration: 64/30
       ,motion_duration_by_combo: [
  { combo_RE: "3",   motion_duration:64/30 }
 ,{ motion_duration: 22/30 }
        ]
       ,playbackRate_by_model_index: {"0":1.5}
      }
    };
    NPC_motion_list.push("PC combat attack twin weapon 03");
  }
  if (!this.motion["PC combat attack twin weapon 04"]) {
    this.motion["PC combat attack twin weapon 04"] = {
// 23,23
      path:'MMD.js\\motion\\motion_rpg_pack01.zip#\\粗製のモーション４\\astora\\2sword\\astora-2sword-longsword2（全親追従）.vmd'
     ,para: { adjust_center_view_disabled:true, onended: function () { MMD_SA._no_fading=true; }
       ,model_index_list: [0]
       ,bone_to_position: [{ name:"全ての親", scale:{x:1,y:0,z:1} }]
//       ,motion_command_disabled: true
       ,NPC_motion_command_disabled: true
//       ,super_armor: { level:1, damage_scale:0.5 }
       ,combat_para: [
  { frame_range:[21,24], hit_level:3, SFX:{ bone_to_pos:"右手首", sound:{hit:{ name:"hit_slash"}} }, bb_expand:{x:0.5*3, y:0, z:0.5*3}, bb_translate:{x:0, y:0, z:0.5*1}, sound_name:"swing" }
        ]
       ,motion_duration: 60/30
       ,playbackRate_by_model_index: {"0":1.5}
      }
    };
    NPC_motion_list.push("PC combat attack twin weapon 04");
  }
  if (!this.motion["PC combat attack twin weapon 05"]) {
    this.motion["PC combat attack twin weapon 05"] = {
// +2,2
      path:'MMD.js\\motion\\motion_rpg_pack01.zip#\\粗製のモーション４\\astora\\2sword\\astora-2sword-rapier1（全親追従）.vmd'
     ,para: { adjust_center_view_disabled:true, onended: function () { MMD_SA._no_fading=true; }
       ,model_index_list: [0]
       ,bone_to_position: [{ name:"全ての親", scale:{x:1,y:0,z:1} }]
//       ,motion_command_disabled: true
       ,NPC_motion_command_disabled: true
       ,super_armor: { level:1, damage_scale:0.5 }
       ,combat_para: [
  { frame_range:[12,15], hit_level:2, SFX:{ bone_to_pos:"右手首", sound:{hit:{ name:"hit_slash"}} }, bb_expand:{x:0.5*1, y:0, z:0.5*1}, bb_translate:{x:0, y:0, z:0.5*3}, sound_name:"swing" }
 ,{ frame_range:[36,39], hit_level:3, SFX:{ bone_to_pos:"右手首", sound:{hit:{ name:"hit_slash"}} }, bb_expand:{x:0.5*1, y:0, z:0.5*1}, bb_translate:{x:0, y:0, z:0.5*3}, sound_name:"swing" }
        ]
       ,motion_duration: 66/30
       ,motion_duration_by_combo: [
  { combo_RE: "3",   motion_duration:66/30 }
 ,{ motion_duration: 22/30 }
        ]
       ,playbackRate_by_model_index: {"0":1.5}
      }
    };
    NPC_motion_list.push("PC combat attack twin weapon 05");
  }
  if (!this.motion["PC combat attack twin weapon 06"]) {
    this.motion["PC combat attack twin weapon 06"] = {
// +23,23
      path:'MMD.js\\motion\\motion_rpg_pack01.zip#\\粗製のモーション４\\astora\\2sword\\astora-2sword-rapier2（全親追従）.vmd'
     ,para: { adjust_center_view_disabled:true, onended: function () { MMD_SA._no_fading=true; }
       ,model_index_list: [0]
       ,bone_to_position: [{ name:"全ての親", scale:{x:1,y:0,z:1} }]
//       ,motion_command_disabled: true
       ,NPC_motion_command_disabled: true
//       ,super_armor: { level:1, damage_scale:0.5 }
       ,combat_para: [
  { frame_range:[16,19], hit_level:3, SFX:{ bone_to_pos:"右手首", sound:{hit:{ name:"hit_slash"}} }, bb_expand:{x:0.5*1, y:0, z:0.5*1}, bb_translate:{x:0, y:0, z:0.5*3}, sound_name:"swing" }
        ]
       ,motion_duration: 50/30
       ,playbackRate_by_model_index: {"0":1.5}
      }
    };
    NPC_motion_list.push("PC combat attack twin weapon 06");
  }
  if (!this.motion["PC combat attack twin weapon 07"]) {
    this.motion["PC combat attack twin weapon 07"] = {
// 1,2
      path:'MMD.js\\motion\\motion_rpg_pack01.zip#\\粗製のモーション４\\astora\\2sword\\astora-2sword-scimitar1（全親追従）.vmd'
     ,para: { adjust_center_view_disabled:true, onended: function () { MMD_SA._no_fading=true; }
       ,model_index_list: [0]
       ,bone_to_position: [{ name:"全ての親", scale:{x:1,y:0,z:1} }]
//       ,motion_command_disabled: true
       ,NPC_motion_command_disabled: true
       ,super_armor: { level:1, damage_scale:0.5 }
       ,combat_para: [
  { frame_range:[15,18], hit_level:1, SFX:{ bone_to_pos:"右手首", sound:{hit:{ name:"hit_slash"}} }, bb_expand:{x:0.5*2, y:0, z:0.5*2}, bb_translate:{x:0, y:0, z:0.5*2}, sound_name:"swing" }
 ,{ frame_range:[25,28], hit_level:2, SFX:{ bone_to_pos:"左手首", sound:{hit:{ name:"hit_slash"}} }, bb_expand:{x:0.5*2, y:0, z:0.5*2}, bb_translate:{x:0, y:0, z:0.5*2}, sound_name:"swing" }
 ,{ frame_range:[47,50], hit_level:1, SFX:{ bone_to_pos:"左手首", sound:{hit:{ name:"hit_slash"}} }, bb_expand:{x:0.5*2, y:0, z:0.5*2}, bb_translate:{x:0, y:0, z:0.5*2}, sound_name:"swing" }
 ,{ frame_range:[58,62], hit_level:3, SFX:{ bone_to_pos:"右手首", sound:{hit:{ name:"hit_slash"}} }, bb_expand:{x:0.5*2, y:0, z:0.5*2}, bb_translate:{x:0, y:0, z:0.5*2}, sound_name:"swing" }
        ]
       ,motion_duration: 90/30
       ,motion_duration_by_combo: [
  { combo_RE: "1,3", motion_duration:90/30 }
 ,{ combo_RE: "1",   motion_duration:52/30 }
 ,{ motion_duration: 36/30 }
        ]
       ,playbackRate_by_model_index: {"0":1.5}
      }
    };
    NPC_motion_list.push("PC combat attack twin weapon 07");
  }
  if (!this.motion["PC combat attack twin weapon 08"]) {
    this.motion["PC combat attack twin weapon 08"] = {
// 123
      path:'MMD.js\\motion\\motion_rpg_pack01.zip#\\粗製のモーション４\\astora\\2sword\\astora-2sword-scimitar2（全親追従）.vmd'
     ,para: { adjust_center_view_disabled:true, onended: function () { MMD_SA._no_fading=true; }
       ,model_index_list: [0]
       ,bone_to_position: [{ name:"全ての親", scale:{x:1,y:0,z:1} }]
//       ,motion_command_disabled: true
       ,NPC_motion_command_disabled: true
//       ,super_armor: { level:1, damage_scale:0.5 }
       ,combat_para: [
  { frame_range:[20,24], hit_level:3, SFX:{ bone_to_pos:"右手首", sound:{hit:{ name:"hit_slash"}} }, bb_expand:{x:0.5*3, y:0, z:0.5*3}, bb_translate:{x:0, y:0, z:0.5*1}, sound_name:"swing" }
        ]
       ,motion_duration: 54/30
       ,playbackRate_by_model_index: {"0":1.5}
      }
    };
    NPC_motion_list.push("PC combat attack twin weapon 08");
  }

  if (!this.motion["PC combat attack 1-handed weapon 01"]) {
    this.motion["PC combat attack 1-handed weapon 01"] = {
// 1,2
      path:'MMD.js\\motion\\motion_rpg_pack01.zip#\\粗製のモーション５\\astorias\\astora-astorias-attack3_v01.vmd'
     ,para: { adjust_center_view_disabled:true, onended: function () { MMD_SA._no_fading=true; }
       ,model_index_list: [0]
       ,bone_to_position: [{ name:"全ての親", scale:{x:1,y:0,z:1} }]
//       ,motion_command_disabled: true
       ,NPC_motion_command_disabled: true
       ,super_armor: { level:1, damage_scale:0.5 }
       ,combat_para: [
  { frame_range:[13,16], hit_level:1, SFX:{ bone_to_pos:"右手首", sound:{hit:{ name:"hit_slash"}} }, bb_expand:{x:0.5*2, y:0, z:0.5*2}, bb_translate:{x:0, y:0, z:0.5*2}, sound_name:"swing" }
 ,{ frame_range:[36,39], hit_level:2, SFX:{ bone_to_pos:"右手首", sound:{hit:{ name:"hit_slash"}} }, bb_expand:{x:0.5*2, y:0, z:0.5*2}, bb_translate:{x:0, y:0, z:0.5*2}, sound_name:"swing" }
 ,{ frame_range:[72,75], hit_level:3, SFX:{ bone_to_pos:"右手首", sound:{hit:{ name:"hit_slash"}} }, bb_expand:{x:0.5*2, y:0, z:0.5*2}, bb_translate:{x:0, y:0, z:0.5*2}, sound_name:"swing" }
        ]
       ,motion_duration: 118/30
       ,motion_duration_by_combo: [
  { combo_RE: "2,3", motion_duration:(90+28*0)/30 }
 ,{ combo_RE: "2",   motion_duration:58/30 }
 ,{ motion_duration: 24/30 }
        ]
       ,playbackRate_by_model_index: {"0":1.5}
      }
    };
    NPC_motion_list.push("PC combat attack 1-handed weapon 01");
  }
  if (!this.motion["PC combat attack 1-handed weapon 02"]) {
    this.motion["PC combat attack 1-handed weapon 02"] = {
// 12,12
      path:'MMD.js\\motion\\motion_rpg_pack01.zip#\\粗製のモーション５\\astorias\\astora-astorias-attack9-10_v01.vmd'
     ,para: { adjust_center_view_disabled:true, onended: function () { MMD_SA._no_fading=true; }
       ,model_index_list: [0]
       ,bone_to_position: [{ name:"全ての親", scale:{x:1,y:0,z:1} }]
//       ,motion_command_disabled: true
       ,NPC_motion_command_disabled: true
//       ,super_armor: { level:1, damage_scale:0.5 }
       ,combat_para: [
  { frame_range:[22,28], hit_level:2, SFX:{ bone_to_pos:"右手首", sound:{hit:{ name:"hit_slash"}} }, bb_expand:{x:0.5*3, y:0, z:0.5*3}, sound_name:"swing" },
  { frame_range:[32,38], hit_level:2, SFX:{ bone_to_pos:"右手首", sound:{hit:{ name:"hit_slash"}} }, bb_expand:{x:0.5*3, y:0, z:0.5*3}, sound_name:"swing" },
  { frame_range:[66,82], hit_level:1, SFX:{ bone_to_pos:"右手首", sound:{hit:{ name:"hit_slash"}} }, bb_expand:{x:0.5*1, y:0, z:0.5*1} },
  { frame_range:[87,90], hit_level:3, SFX:{ bone_to_pos:"右手首", sound:{hit:{ name:"hit_slash"}} }, bb_expand:{x:0.5*2, y:0, z:0.5*2}, bb_translate:{x:0, y:0, z:0.5*3}, sound_name:"swing" },
        ]
       ,range:[{time:[8,0]}]
       ,motion_duration: 128/30
       ,motion_duration_by_combo: [
  { combo_RE: "2,13", motion_duration:128/30 },
  { combo_RE: "2",  motion_duration:58/30 },
  { motion_duration: 32/30 },
        ]
       ,playbackRate_by_model_index: {"0":1.25}
      }
    };
    NPC_motion_list.push("PC combat attack 1-handed weapon 02");
  }
/*
  if (!this.motion["PC combat attack 1-handed weapon 03"]) {
    this.motion["PC combat attack 1-handed weapon 03"] = {
// 12,2
      path:'MMD.js\\motion\\motion_rpg_pack01.zip#\\粗製のモーション５\\astorias\\astora-astorias-attack8-10_v01.vmd'
     ,para: { adjust_center_view_disabled:true, onended: function () { MMD_SA._no_fading=true; }
       ,model_index_list: [0]
       ,bone_to_position: [{ name:"全ての親", scale:{x:1,y:0,z:1} }]
//       ,motion_command_disabled: true
       ,NPC_motion_command_disabled: true
//       ,super_armor: { level:1, damage_scale:0.5 }
       ,combat_para: [
  { frame_range:[13,16], hit_level:2, SFX:{ bone_to_pos:"右手首", sound:{hit:{ name:"hit_slash"}} }, bb_expand:{x:0.5*2, y:0, z:0.5*2}, bb_translate:{x:0, y:0, z:0.5*2}, sound_name:"swing" }
 ,{ frame_range:[75,78], hit_level:3, SFX:{ bone_to_pos:"右手首", sound:{hit:{ name:"hit_slash"}} }, bb_expand:{x:0.5*2, y:0, z:0.5*2}, bb_translate:{x:0, y:0, z:0.5*3}, sound_name:"swing" }
        ]
       ,motion_duration: 117/30
       ,motion_duration_by_combo: [
  { combo_RE: "23", motion_duration:(101+16*0)/30 }
 ,{ motion_duration: 42/30 }
        ]
//       ,playbackRate_by_model_index: {"0":1.5}
      }
    };
    NPC_motion_list.push("PC combat attack 1-handed weapon 03");
  }
*/
}
/*
if (!this.motion["DUMMY"]) {
  this.motion["DUMMY"] = {
    path: "MMD.js/motion/motion_basic_pack01.zip#/center_dummy.vmd"
   ,para: {
      model_name_RegExp: {
        test: function (model_filename) {
var model_filename_cleaned = model_filename.replace(/[\-\_]copy\d+\.pmx$/, ".pmx").replace(/[\-\_]v\d+\.pmx$/, ".pmx")
var model_para = MMD_SA_options.model_para[model_filename] || MMD_SA_options.model_para[model_filename_cleaned]
if (model_para && model_para.is_object && (!model_para.motion_name_default || !MMD_SA_options.motion_para[model_para.motion_name_default])) {
//  model_para.motion_name_default = "center_dummy"
  return true
}
return false
        }
      }
    }
  }
}
*/
this.motion_filename_by_id = {}
this.motion_id_by_filename = {}

window.addEventListener("SA_MMD_init", function (e) {

for (var name in that.motion) {
  let motion = that.motion[name]
  motion.name = decodeURIComponent(((motion.path)?motion:MMD_SA_options.motion[motion.index]).path.replace(/^.+[\/\\]/, "").replace(/\.vmd$/i, ""))

  that.motion_filename_by_id[name] = motion.name
  that.motion_id_by_filename[motion.name] = name

  if (motion.index != null) {
    if (motion.path) {
      MMD_SA_options.motion[motion.index] = { must_load:true, no_shuffle:true, path:motion.path }
    }
  }
  else {
    let index = MMD_SA_options.motion.findIndex(function (obj) { return (!obj || (obj.path == motion.path)) })
    if ((index == -1) || (!MMD_SA_options.motion[index])) {
      motion.index = (index == -1) ? MMD_SA_options.motion.length : index
      MMD_SA_options.motion[motion.index] = { must_load:true, no_shuffle:true, path:motion.path }
    }
    else
      motion.index = index
  }

  let para = motion.para
  if (para) {
    if (para.combat_para) {
      if (para.look_at_screen == null)
        para.look_at_screen = false

// define combat motion.duration to prevent looping
      if (para.motion_duration && !para.duration) {
        para.duration = Math.max(10,para.motion_duration) + (para.duration_NPC||0)
      }

      let xz = ["x","z"]
      para.combat_para.forEach(function (p) {
        if (p.bb_expand) {
          xz.forEach(function (_xz) {
            p.bb_expand[_xz] = (1+p.bb_expand[_xz])/_bb_xz_factor_ - 1
          });
        }
        if (p.bb_translate) {
          xz.forEach(function (_xz) {
            if (p.bb_translate[_xz])
              p.bb_translate[_xz] = p.bb_translate[_xz]/_bb_xz_factor_
          });
        }
      });
    }
    MMD_SA_options.motion_para[motion.name] = para
  }
  else {
    para = MMD_SA_options.motion_para[motion.name]
  }

  if (para && !para.motion_blending) {
    para.motion_blending = {
      fadein: {}
    };
  }

  if (name == "PC default") {
    if (!MMD_SA_options.motion_shuffle_list_default) {
      MMD_SA_options.motion_shuffle_list_default = [motion.index]
    }
  }
}
if (MMD_SA_options.model_path_extra) {
  let motion_PC_default = that.motion["PC default"]

  MMD_SA_options.model_path_extra.forEach(function (path, idx) {
    var model_filename = path.replace(/^.+[\/\\]/, "")
    var model_filename_cleaned = model_filename.replace(/[\-\_]copy\d+\.pmx$/, ".pmx").replace(/[\-\_]v\d+\.pmx$/, ".pmx")
    var model_para = MMD_SA_options.model_para[model_filename] || MMD_SA_options.model_para[model_filename_cleaned]
    if (!model_para)
      model_para = MMD_SA_options.model_para[model_filename] = {}

    if (motion_PC_default) {
      if (!model_para.motion_name_default)
        model_para.motion_name_default = motion_PC_default.name
    }

// backward compatibility (.motion_includes)
    model_para.motion_included = model_para.motion_included || model_para.motion_includes

    if (model_para.motion_included) {
//console.log(model_para.motion_included)
      for (var name in that.motion) {
        var motion = that.motion[name]
        if ((model_para.motion_included.indexOf(name) != -1) || (model_para.motion_included.indexOf(motion.name) != -1)) {
          var motion_para = MMD_SA_options.motion_para[motion.name]
          if (!motion_para.model_index_list)
            motion_para.model_index_list = []
          if (motion_para.model_index_list.indexOf(idx+1) == -1)
            motion_para.model_index_list.push(idx+1)
        }
      }
    }

    model_para.look_at_character = (model_para.look_at_character == -1) ? null : (model_para.look_at_character || 0)
//    if (!model_para.rigid_filter) model_para.rigid_filter = /^DISABLED$/
  });
}

NPC_motion_list.forEach(function (motion_name) {
  that.object_base_list.forEach(function (obj_base) {
    if ((obj_base.character_index == null) || !obj_base.use_combat_motion)
      return

    that.battle_model_index_list.push(obj_base.character_index)

    var path = MMD_SA_options.model_path_extra[obj_base.character_index-1]
    var model_filename = path.replace(/^.+[\/\\]/, "")
    var model_filename_cleaned = model_filename.replace(/[\-\_]copy\d+\.pmx$/, ".pmx").replace(/[\-\_]v\d+\.pmx$/, ".pmx")
    var model_para = MMD_SA_options.model_para[model_filename] || MMD_SA_options.model_para[model_filename_cleaned]

    var NPC_motion_name = motion_name.replace(/^PC/, "NPC-" + obj_base.character_index)
    var NPC_motion_name_translated = (that.motion[NPC_motion_name] && NPC_motion_name) || (model_para.motion_map && model_para.motion_map[NPC_motion_name]) || motion_name
    that.motion[NPC_motion_name] = that.motion[NPC_motion_name_translated]

    if (!that.motion[NPC_motion_name].para.model_index_list)
      that.motion[NPC_motion_name].para.model_index_list = []
    that.motion[NPC_motion_name].para.model_index_list.push(obj_base.character_index)

// PC doesn't need .motion_name_default/.motion_name_default_combat
    if (/combat default/.test(NPC_motion_name)) {
      model_para.motion_name_default_combat = model_para.motion_name_default_combat || that.motion[NPC_motion_name].path.replace(/^.+[\/\\]/, "").replace(/\.vmd$/i, "")
      model_para.motion_name_default        = model_para.motion_name_default        || model_para.motion_name_default_combat
    }
  });
});

window.addEventListener("MMDStarted", function (e) {
  var d = MMD_SA_options.Dungeon
  d._motion_shuffle_list_default = MMD_SA_options.motion_shuffle_list_default.slice()
  d._motion_shuffle_list_default_combat = (d.motion["PC combat default"]) ? [MMD_SA_options.motion_index_by_name[d.motion["PC combat default"].name || "PC combat default"]] : null
  d._motion_shuffle_list_default_parry  = (d.motion["PC combat parry"])   ? [MMD_SA_options.motion_index_by_name[d.motion["PC combat parry"].name   || "PC combat parry"]]   : null
});

});

this.key_map = options.key_map || {};

var ULDR_indexd = []
//WASD
var ULDR_keyCode = [87,65,83,68]
var ULDR_id = ["up","left","down","right"]

for (var key in this.key_map) {
  var id = this.key_map[key].id
  var index = id && ULDR_id.indexOf(id)
  if (index >= 0)
    ULDR_indexd[index] = true
}

ULDR_id.forEach((id, idx)=>{
  if (ULDR_indexd[idx])
    return

  var key_map = that.key_map[ULDR_keyCode[idx]] = { order:1000+idx, id:id, type_movement:true };

  switch (id) {
    case "up":
      key_map.about_turn = false
      key_map.key_id_cancel_list = ["down"]
      key_map.motion_id = "PC movement forward"
      Object.defineProperty(key_map, 'mov_speed', { get:()=>this.motion["PC movement forward"].para._speed, });
      key_map.motion_can_float = true
      key_map.TPS_mode = {
  mov_to_rot_absolute: true
 ,key_id_cancel_list: ["down"]
 ,motion_id: "PC movement forward"
 ,mov_speed: [{ frame:0, speed:{x:0, y:0, get z() { return MMD_SA_options.Dungeon.motion["PC movement forward"].para._speed; }} }]
      }
      break
    case "down":
      key_map.about_turn = true
      key_map.key_id_cancel_list = ["up"]
      key_map.motion_id = "PC movement forward"
      Object.defineProperty(key_map, 'mov_speed', { get:()=>this.motion["PC movement forward"].para._speed, });
      key_map.motion_can_float = true
      key_map.TPS_mode = {
  mov_to_rot_absolute: true
 ,key_id_cancel_list: ["up"]
 ,motion_id: "PC movement forward"
 ,mov_speed: [{ frame:0, speed:{x:0, y:0, get z() { return -MMD_SA_options.Dungeon.motion["PC movement forward"].para._speed; }} }]
      }
      break
    case "left":
      key_map.rot_speed = {x:0, y: Math.PI*0.75, z:0}
      key_map.key_id_cancel_list = ["right"]
//      key_map.motion_id = "PC movement forward"
      key_map.motion_can_float = true
      key_map.TPS_mode = {
  mov_to_rot_absolute: true
 ,key_id_cancel_list: ["right"]
 ,motion_id: "PC movement forward"
 ,mov_speed: [{ frame:0, speed:{get x() { return MMD_SA_options.Dungeon.motion["PC movement forward"].para._speed; }, y:0, z:0 } }]
      }
      break
    case "right":
      key_map.rot_speed = {x:0, y:-Math.PI*0.75, z:0}
      key_map.key_id_cancel_list = ["left"]
//      key_map.motion_id = "PC movement forward"
      key_map.motion_can_float = true
      key_map.TPS_mode = {
  mov_to_rot_absolute: true
 ,key_id_cancel_list: ["left"]
 ,motion_id: "PC movement forward"
 ,mov_speed: [{ frame:0, speed:{get x() { return -MMD_SA_options.Dungeon.motion["PC movement forward"].para._speed; }, y:0, z:0 } }]
      }
      break
  }
});

if (!this.key_map[38]) {
  this.key_map[38] = { order:838, id:"camera_preset_switch", keyCode:38
   ,onfirstpress: (function () {
var d = MMD_SA_options.Dungeon;
var c = d.character;

let v3a;
const camera_position_preset_length = 3;
function camera_position_preset(index) {
  const dc = MMD_SA_options.camera_position_base;
  switch (index) {
    case 1:
      return v3a.set(dc[0]*2, dc[1]*2+10, dc[2]*2*MMD_SA_options.Dungeon_options.camera_position_z_sign).toArray();
    case 2:
      return v3a.set(dc[0]*3, dc[1]*3+15, dc[2]*4*MMD_SA_options.Dungeon_options.camera_position_z_sign).toArray();
    default:
      return v3a.set(dc[0], dc[1], dc[2]*MMD_SA_options.Dungeon_options.camera_position_z_sign).toArray();;
  }
}

d.update_camera_position_base = function (pos) {
  if (pos) MMD_SA_options.camera_position_base = pos;

  d.key_map[38].camera_position_preset_index = 0;
  c.camera_position_base_default = camera_position_preset(0);
  c.camera_position_base = c.camera_position_base_default.slice();

  MMD_SA.reset_camera(true);
};

window.addEventListener("jThree_ready", function () {
  v3a = new THREE.Vector3();

  d.key_map[38].camera_position_preset_index = 0;

  c.camera_rotation_from_preset = new THREE.Vector3();
});

window.addEventListener("SA_Dungeon_onrestart", function () {
  if (c.mount_para) return;

  c.camera_position_base_default = camera_position_preset(d.key_map[38].camera_position_preset_index);
  c.camera_position_base = c.camera_position_base_default.slice();
});

return function () {
  if (d.event_mode) return;
  if (c.mout_para) return;

  if (++this.camera_position_preset_index >= camera_position_preset_length)
    this.camera_position_preset_index = 0;

  c.camera_position_base_default = camera_position_preset(this.camera_position_preset_index);
  c.camera_position_base = c.camera_position_base_default.slice();

  c.rot.set(0,0,0);
  THREE.MMD.getModels()[0].mesh.quaternion.set(0,0,0,1);

  c.about_turn = false;
  c.camera_TPS_rot.set(0,0,0);
  c.camera_update();

//  if (c.TPS_camera_lookAt_) d._rot_camera.v3.set(0,0,0);

  MMD_SA.reset_camera();

  var tc = MMD_SA._trackball_camera;
  c.camera_rotation_from_preset.y = Math.PI/2 - Math.atan2((tc.target.z-tc.object.position.z), (tc.target.x-tc.object.position.x));

  DEBUG_show("Camera preset:" + (this.camera_position_preset_index+1)+'/'+camera_position_preset_length, 2);
};
    })()
  };
}
if (!this.key_map[40]) {
  this.key_map[40] = { order:840, id:"TPS_mode_toggle", keyCode:40
   ,onfirstpress: function () {
if (MMD_SA_options.Dungeon.event_mode) return;
/*
var look_at_screen = MMD_SA_options._look_at_screen
MMD_SA_options.look_at_screen = MMD_SA_options.look_at_mouse = !look_at_screen
MMD_SA.reset_camera()

DEBUG_show("Look at screen:" + ((!look_at_screen)?"ON":"OFF"), 2)
*/

var c = that.character;
var combat = c.combat_mode && that._states.combat;
if (combat && (combat._target_enemy_index >= 0)) {
  combat._target_enemy_index = -1
  if (!c.TPS_mode)
    MMD_SA.reset_camera(true)
}
else {
  c.TPS_mode = !c.TPS_mode
  MMD_SA.reset_camera(true)
  DEBUG_show("TPS control mode:" + ((c.TPS_mode)?"ON":"OFF"), 2)
}
    }
  };
}

(function () {

  function select_target(counter) {
var c = that.character
if (!c.combat_mode)
  return

var combat = that._states.combat
if (!combat.enemy_list.some(function (enemy) { return enemy.hp; }))
  return

var target_enemy_index = (combat._target_enemy_index == null) ? -1 : combat._target_enemy_index
var enemy
while (true) {
  target_enemy_index += counter
  if (target_enemy_index >= combat.enemy_list.length)
    target_enemy_index = 0
  else if (target_enemy_index < 0)
    target_enemy_index = combat.enemy_list.length - 1

  enemy = combat.enemy_list[target_enemy_index]
  if (!enemy.hp)
    continue

  combat._target_enemy_index = target_enemy_index
  break
}

//c.rot.y = Math.PI/2 - Math.atan2((enemy._obj.position.z-c.pos.z), (enemy._obj.position.x-c.pos.x))
//THREE.MMD.getModels()[0].mesh.quaternion.setFromEuler(c.rot)
  }

  if (!that.key_map[37]) {
    that.key_map[37] = { order:837, id:"target_select_L", keyCode:37
     ,onfirstpress: function () {
select_target(-1)
      }
    };
  }
  if (!that.key_map[39]) {
    that.key_map[39] = { order:839, id:"target_select_R", keyCode:39
     ,onfirstpress: function () {
select_target(1)
      }
    };
  }

})();

this.key_map_reset = function () {
  this.key_map_by_id = {}
  this.key_map_list = []
  for (var key in this.key_map) {
    var k = this.key_map[key]
    k.keyCode_default = k.keyCode_default || k.keyCode
    k.keyCode = key
    k.id_default = k.id_default || k.id
    this.key_map_by_id[k.id_default||key] = this.key_map_by_id[k.id||key] = k
    this.key_map_list.push(k)
  }
  this.key_map_list.sort(function(a,b){return a.order-b.order})
};

this.key_map_reset()
if (!this.key_map[32] && !this.key_map_by_id["jump"]) {
  let _onfirstpress = function (e) {
    var keyCode = (that.key_map_by_id["up"].down || that.key_map_by_id["down"].down || that.key_map_by_id["left"].down || that.key_map_by_id["right"].down || !e.detail.e.shiftKey) ? 1320 : 1321

    var key_map = that.key_map[32] = that.key_map_by_id["jump"] = that.key_map[keyCode]
    key_map.keyCode = 32
    key_map.id = "jump"
    key_map.is_down = this.is_down
    key_map.down = this.down
    if (this != key_map) {
      this.keyCode = this.keyCode_default
      this.id = this.id_default
      this.is_down = 0
      this.down = 0
    }
//DEBUG_show(keyCode,0,1)
  };
  let _onupdate = (function () {
    var va_default = _jump_physics((15+10), 11);
    return function (para) {
if (!this.down)
  return

var model = THREE.MMD.getModels()[0]
var motion_para = MMD_SA_options.Dungeon.motion[this.motion_id].para

var scale = 0.25 + Math.min(para.pressed,250)/250*0.75

var t_diff = para.t_diff
var frame = model.skin.time*30
var frame_base = frame - t_diff*30

var result = {}
var va
if ((frame >= 12) && (frame < 12+22)) {
  let playbackRate_last = motion_para.playbackRate_by_model_index[0] || 1
  let _t_diff = (frame_base >= 12) ? t_diff : (frame - 12)/30
//if (_t_diff != t_diff) DEBUG_show((t_diff-_t_diff)/t_diff,0,1)
  let playbackRate = motion_para.playbackRate_by_model_index[0] = (t_diff-_t_diff)/t_diff*playbackRate_last + _t_diff/t_diff*1/scale
  if (playbackRate_last != playbackRate) {
    result.t2_extended = (playbackRate - playbackRate_last) * t_diff
  }
  va = _jump_physics((15+10)*scale, 11)
}
else {
  motion_para.playbackRate_by_model_index[0] = 1
  va = va_default
}
motion_para.mov_speed[1] = { frame:12, speed:{x:0, y:va.v, z:41/22*30*scale}, acceleration:{x:0, y:va.a, z:0}}

return result
/*
 ,mov_speed: (function () {
var va = _jump_physics((15+10), 11)
return [
  { frame:34, speed:{x:0, y:0,    z:22.8/12*30}}
 ,{ frame:12, speed:{x:0, y:va.v, z:41/22*30}, acceleration:{x:0, y:va.a, z:0}}
 ,{ frame:0,  speed:{x:0, y:0,    z:22.8/12*30}}
];
  })()
*/
    };
  })();
  let _ondown = function (e) {
var c = MMD_SA_options.Dungeon.character
if (c.mount_para && !c.mount_para.can_jump)
  return true
  };
  this.key_map[1320] = { order:999, id:"jump_forward", type_movement:true, keyCode:1320, onkeyup:function(){}, motion_id:"PC forward jump", key_id_cancel_list:["up","down"]
   ,onfirstpress: _onfirstpress
   ,ondown: _ondown
   ,onupdate: _onupdate
   ,TPS_mode: {
      motion_id:"PC forward jump"
     ,key_id_cancel_list:["up","down","left","right"]
    }
  };
  this.key_map[1321] = { order:999, id:"jump_high", type_movement:true, keyCode:1321, onkeyup:function(){}, motion_id:"PC high jump", key_id_cancel_list:["up","down"]
   ,onfirstpress: _onfirstpress
   ,ondown: _ondown
//   ,onupdate: _onupdate
   ,TPS_mode: {
      motion_id:"PC high jump"
     ,key_id_cancel_list:["up","down","left","right"]
    }
  };
  this.key_map[32] = this.key_map[1320]
}

this.key_map_default = {}
Object.assign(this.key_map_default, this.key_map)

// initialize to assign .duration for all necessary motions (BEFORE .generateSkinAnimation()) to prevent looping
window.addEventListener("SA_MMD_init", ()=>{
  MMD_SA_options.Dungeon.character.assign_keys()
});

if (options.combat_mode_enabled) {
  (function () {
    var d = MMD_SA_options.Dungeon
    var c = d.character
    var combo_str = ""
    var combo_timestamp = 0

    if (!MMD_SA_options.Dungeon_options.attack_combo_list) {
      MMD_SA_options.Dungeon_options.attack_combo_list = [
  { keyCode:20085, combo_RE:"8,5", motion_id:"PC combat attack 01", plus_down:true }
 ,{ keyCode:10044, combo_RE:"4,4", motion_id:"PC combat attack 02", combo_type:"kick" }
 ,{ keyCode:10077, combo_RE:"7,7", motion_id:"PC combat attack 03" }
 ,{ keyCode:14545, combo_RE:"45,45", motion_id:"PC combat attack 04", combo_type:"kick" }
 ,{ keyCode:10055, combo_RE:"5,5", motion_id:"PC combat attack 05", combo_type:"kick" }
 ,{ keyCode:10054, combo_RE:"5,4", motion_id:"PC combat attack 06", combo_type:"kick" }
 ,{ keyCode:20087, combo_RE:"8,7", motion_id:"PC combat attack 07", plus_down:true }
 ,{ keyCode:14556, combo_RE:"45,56", motion_id:"PC combat attack 08", combo_type:"kick" }
 ,{ keyCode:20048, combo_RE:"4,8", motion_id:"PC combat attack 09", plus_down:true }
 ,{ keyCode:10087, combo_RE:"8,7", motion_id:"PC combat attack 10" }
 ,{ keyCode:10456, combo_RE:"456", motion_id:"PC combat attack 11", combo_type:"kick" }
 ,{ keyCode:10078, combo_RE:"7,8", motion_id:"PC combat attack 12" }
 ,{ keyCode:10047, combo_RE:"4,7", motion_id:"PC combat attack 13" }
 ,{ keyCode:20075, combo_RE:"7,5", motion_id:"PC combat attack 14", plus_down:true }
 ,{ keyCode:17878, combo_RE:"78,78", motion_id:"PC combat attack 15" }
 ,{ keyCode:20077, combo_RE:"7,7", motion_id:"PC combat attack 16", plus_down:true }
 ,{ keyCode:10088, combo_RE:"8,8", motion_id:"PC combat attack 17" }
 ,{ keyCode:20045, combo_RE:"4,5", motion_id:"PC combat attack 18", plus_down:true }
 ,{ keyCode:15656, combo_RE:"56,56", motion_id:"PC combat attack 19", combo_type:"kick" }

 ,{ keyCode:50000, combo_RE:"5,5", motion_id:"PC combat attack 2-handed weapon 01", combo_type:"2-handed" }

 ,{ keyCode:10022, combo_RE:"2,2", motion_id:"PC combat attack twin weapon 01", combo_type:"twin" }
 ,{ keyCode:10021, combo_RE:"2,1", motion_id:"PC combat attack twin weapon 02", combo_type:"twin" }
 ,{ keyCode:11212, combo_RE:"12,12", motion_id:"PC combat attack twin weapon 03", combo_type:"twin" }
 ,{ keyCode:12323, combo_RE:"23,23", motion_id:"PC combat attack twin weapon 04", combo_type:"twin" }
 ,{ keyCode:20022, combo_RE:"2,2", motion_id:"PC combat attack twin weapon 05", plus_down:true, combo_type:"twin" }
 ,{ keyCode:22323, combo_RE:"23,23", motion_id:"PC combat attack twin weapon 06", plus_down:true, combo_type:"twin" }
 ,{ keyCode:10012, combo_RE:"1,2", motion_id:"PC combat attack twin weapon 07", combo_type:"twin" }
 ,{ keyCode:10123, combo_RE:"123", motion_id:"PC combat attack twin weapon 08", combo_type:"twin" }

 ,{ keyCode:30012, combo_RE:"1,2", motion_id:"PC combat attack 1-handed weapon 01", combo_type:"1-handed slash" }
 ,{ keyCode:31212, combo_RE:"12,12", motion_id:"PC combat attack 1-handed weapon 02", combo_type:"1-handed slash" }
// ,{ keyCode:30212, combo_RE:"2,12", motion_id:"PC combat attack 1-handed weapon 03", combo_type:"1-handed slash" }
      ];
    }

    MMD_SA_options.Dungeon_options._attack_combo_list = MMD_SA_options.Dungeon_options.attack_combo_list
    Object.defineProperty(MMD_SA_options.Dungeon_options, "attack_combo_list", {
      get: function () {
        return (MMD_SA_options.Dungeon.character.combat_stats_base && MMD_SA_options.Dungeon.character.combat_stats_base.attack_combo_list) || MMD_SA_options.Dungeon_options._attack_combo_list;
      }
    });

    window.addEventListener("jThree_ready", ()=>{
      MMD_SA_options.Dungeon_options._attack_combo_list.forEach((c)=>{
        c.combo_type = c.combo_type || "bare-handed"
        d.motion[c.motion_id].para.attack_combo_para = c
      });
    });

    var combo_onfirstpress = function (e) {
var that = this

var t = performance.now()
if (t > combo_timestamp + 300) {
  combo_str = ""
}
combo_timestamp = t

var c_str = this.keyCode - 96

if (combo_str.length) {
  var c_last = /(\d+)$/.test(combo_str) && RegExp.$1;
  var c_last_array = []
  for (var i = 0; i < c_last.length; i++)
    c_last_array[i] = parseInt(c_last.charAt(i))

  if (c_last_array.indexOf(c_str) != -1)
    combo_str += "," + c_str
  else if (c_last_array.some(function (digit) { return !d.key_map[digit + 96].is_down; }))
    combo_str += "," + c_str
  else {
    combo_str += c_str
    c_last_array.push(c_str)
    combo_str = combo_str.replace(/\d+$/, c_last_array.sort().join(""))
  }
}
else
  combo_str += c_str

while (combo_str.length > 20) {
  combo_str = combo_str.replace(/^\d+\,/, "")
}

var para_SA = MMD_SA.MMD.motionManager.para_SA
if (MMD_SA._force_motion_shuffle) {
  para_SA = MMD_SA.motion[MMD_SA_options.motion_shuffle_list_default[0]].para_SA
}

if (!para_SA.motion_duration_by_combo) {
  let combos = MMD_SA_options.Dungeon_options.attack_combo_list.filter(function (combo) {
    if ((combo.combo_type != "free") && !c.combat_stats.weapon.combo_type_RE.test(combo.combo_type))
      return false

    let _RE = (MMD_SA_options.Dungeon_options.simple_combat_input_mode_enabled) ? combo._RE_simple : combo._RE
    let index = combo_str.search(_RE)
    if (index == -1)
      return false
    if (!MMD_SA_options.Dungeon_options.simple_combat_input_mode_enabled && ((combo.plus_down) ? !d.key_map[107].is_down : d.key_map[107].is_down))
      return false

    combo._index_ = index + RegExp.lastMatch.length
    return true
  });

  if (combos.length) {
    let combo = combos.shuffle()[0]

    let key_map = d.key_map[combo.keyCode]
    key_map.down = t

    combo_str = combo_str.substr(combo._index_)

    let motion_index = MMD_SA_options.motion_index_by_name[d.motion[key_map.motion_id].name]
    let motion_para = MMD_SA.motion[motion_index].para_SA
    if (motion_para.motion_duration_by_combo) {
      key_map.motion_duration = motion_para.motion_duration = motion_para.motion_duration_by_combo[motion_para.motion_duration_by_combo.length-1].motion_duration
//DEBUG_show(combo.keyCode+'/'+that.motion_duration,0,1)
    }

    if (!key_map.type_combat || !d.character_combat_locked) {
      if (!para_SA.motion_command_disabled) {
        para_SA = motion_para
        MMD_SA_options.motion_shuffle_list_default = [motion_index]
        MMD_SA._force_motion_shuffle = true
//DEBUG_show(combo.keyCode,0,1)
      }
    }
  }
}
//DEBUG_show(combo_str)

if (!para_SA.motion_duration_by_combo || !combo_str.length)
  return

var key_map = d.key_map[para_SA.keyCode]
var motion_duration = para_SA.motion_duration
para_SA.motion_duration_by_combo.some(function (combo) {
  let _RE = (MMD_SA_options.Dungeon_options.simple_combat_input_mode_enabled) ? combo._RE_simple : combo._RE
  if (!_RE || (combo_str.search(_RE) == 0)) {
    if (combo.motion_duration > motion_duration) {
      key_map.motion_duration = para_SA.motion_duration = combo.motion_duration
//DEBUG_show(combo_str+'/'+combo.motion_duration+'/'+para_SA.keyCode,0,1)
    }
    return true
  }
});
    };

/*
107: +
97-105: 1-9
*/
    var combo_keys = [107]
    for (var k = 97; k < 96+10; k++)
      combo_keys.push(k)
    combo_keys.forEach(function (k) {
      if (!d.key_map[k]) {
        d.key_map[k] = { order:700+k, id:"k"+k, keyCode:k
         ,ondown: function (e) {
if (!MMD_SA_options.Dungeon.character.combat_mode)
  return true
          }
         ,onfirstpress: (k != 107) ? combo_onfirstpress : null
         ,onupdate: function () { return { return_vale:true }; }
        };
      }
    });
  })();

  this.key_map_combat = options.key_map_combat || []
  this.key_map_parry  = options.key_map_parry  || []

  if (!this.key_map[96] && !this.key_map_by_id["combat_parry"]) {
    this.key_map[96] = this.key_map_combat[this.key_map_combat.length] = { order:950, id:"combat_parry", type_movement:true, keyCode:96, TPS_mode:{ no_rotation:true }
     ,key_id_cancel_list: ["jump"]
     ,onupdate: function () {
var d = MMD_SA_options.Dungeon
var parry_mode = (d.key_map[87].motion_id == "PC combat movement forward")

var TPS_mode

if (this.is_down) {
  if (!d.character.combat_mode)
    MMD_SA.reset_camera()
  if (!parry_mode && d.can_parry) {
    MMD_SA_options.motion_shuffle_list_default  = MMD_SA_options.Dungeon._motion_shuffle_list_default_parry.slice()
    MMD_SA_options._motion_shuffle_list_default = MMD_SA_options.motion_shuffle_list_default.slice()
    d.key_map_swap(d.key_map_parry)
    MMD_SA._force_motion_shuffle = true
//    MMD_SA.reset_camera()
  }
}
else {
  if (parry_mode && (!d.character.combat_mode || d.can_parry)) {
    MMD_SA_options.motion_shuffle_list_default  = MMD_SA_options.Dungeon._motion_shuffle_list_default_combat.slice()
    MMD_SA_options._motion_shuffle_list_default = MMD_SA_options.motion_shuffle_list_default.slice()
    d.key_map_swap(d.key_map_combat)
    MMD_SA._force_motion_shuffle = true
  }
}

return { TPS_mode:TPS_mode }
      }
    };
  }

  ULDR_id.forEach(function (id, idx) {
    var keyCode = ULDR_keyCode[idx]
    if (that.key_map_parry.some(function (kmc) { return kmc.keyCode==keyCode; }))
      return

    that.key_map_combat[that.key_map_combat.length] = that.key_map_by_id[id]

    var key_map = that.key_map_parry[that.key_map_parry.length] = { order:1000+idx, id:id, keyCode:keyCode, about_turn:false, type_movement:true, TPS_mode:{ no_rotation:true } };

    switch (id) {
      case "up":
        key_map.motion_id = key_map.TPS_mode.motion_id = "PC combat movement forward"
        that.motion[key_map.motion_id].para.mov_speed = [{ frame:0, speed:{x:0, y:0, z: 0.5*30} }]
        break
      case "down":
        key_map.motion_id = key_map.TPS_mode.motion_id = "PC combat movement backward"
        that.motion[key_map.motion_id].para.mov_speed = [{ frame:0, speed:{x:0, y:0, z:-0.5*30} }]
        break
      case "left":
        key_map.motion_id = key_map.TPS_mode.motion_id = "PC combat movement left"
        that.motion[key_map.motion_id].para.mov_speed = [{ frame:0, speed:{x: 0.5*30, y:0, z:0} }]
        break
      case "right":
        key_map.motion_id = key_map.TPS_mode.motion_id = "PC combat movement right"
        that.motion[key_map.motion_id].para.mov_speed = [{ frame:0, speed:{x:-0.5*30, y:0, z:0} }]
        break
    }
  });
}

this.key_map_swap = function (key_map) {
  if (!Array.isArray(key_map)) {
    key_map = Object.keys(key_map).map(function (name) { return key_map[name]; });
  }

  var that = this
  key_map.forEach(function (k) {
    var key_replaced, key_new
    if (typeof k == "number") {
      if (k < 0) {
        delete that.key_map[-k]
      }
      else if (that.key_map_default[k]) {
        key_replaced = that.key_map[k]
        key_new = that.key_map_default[k]
        that.key_map[k] = key_new
      }
    }
    else {
      key_replaced = that.key_map[k.keyCode]
      key_new = k
      that.key_map[k.keyCode] = key_new
    }

    if (key_replaced && (key_replaced != key_new)) {
      key_replaced.is_down = 0
      key_replaced.down = 0
    }
  });

  this.key_map_reset()
};
// dungeon motion END


this.PC_follower_list = options.PC_follower_list || []
this.PC_follower_list_default = this.PC_follower_list.slice()

if (!MMD_SA_options.x_object)
  MMD_SA_options.x_object = []

if (!MMD_SA_options.model_path_extra)
  MMD_SA_options.model_path_extra = []

this.object_base_index_by_id = {}
this.object_base_list.forEach(function (obj, idx) {
  if (obj.is_dummy) return

  var c = obj.construction

  obj.index = idx

  if (obj.id)
    MMD_SA_options.Dungeon.object_base_index_by_id[obj.id] = idx

  if (obj.path && /\.pmx[^\/\\]*$/i.test(obj.path)) {
    MMD_SA_options.model_path_extra.push(obj.path);
    obj.character_index = MMD_SA_options.model_path_extra.length;
  }

  if (obj.character_index) {
    if (obj.model_scale) {
      window.addEventListener("jThree_ready", function () {
        MMD_SA_options.model_para_obj_all[obj.character_index].model_scale = obj.model_scale
      });
    }
    if (obj.path) {
      if (c && c.model_para) {
        const model_filename_cleaned = obj.path.replace(/^.+[\/\\]/, "").replace(/\#clone(\d+)\.pmx$/, ".pmx").replace(/[\-\_]copy\d+\.pmx$/, ".pmx").replace(/[\-\_]v\d+\.pmx$/, ".pmx");
        MMD_SA_options.model_para[model_filename_cleaned] = c.model_para;
      }
      delete obj.path;
    }
    return
  }

  if (c && !obj.path) {
    if (c.GOML_head)
      MMD_SA_options.GOML_head  += c.GOML_head
    if (c.GOML_scene)
      MMD_SA_options.GOML_scene += c.GOML_scene
    if (c.mesh_obj)
      MMD_SA_options.mesh_obj.push(c.mesh_obj)
//console.log(MMD_SA_options.GOML_head)
//console.log(MMD_SA_options.GOML_scene)
    c.build && c.build();
    return
  }

  if (c && c.model_para && obj.path) {
    let model_filename_cleaned = obj.path.replace(/^.+[\/\\]/, "").replace(/[\-\_]copy\d+\.x$/, ".x").replace(/[\-\_]v\d+\.x$/, ".x")
    MMD_SA_options.model_para[model_filename_cleaned] = c.model_para
//console.log(999, model_filename_cleaned, c.model_para)
  }

  MMD_SA_options.x_object.push(
    {
  path: obj.path
 ,style: 'scale:0;'
// ,scale: (obj.placement && obj.placement.scale) || 10
 ,boundingBox_list: c && c.boundingBox_list
 ,castShadow:    c && c.castShadow
 ,receiveShadow: c && c.receiveShadow
 ,bb_adjust: (obj.collision_by_mesh_enforced) ? { min:{x:0, y:-10, z:0} } : null
    }
  );
});
  }


 ,_states: {}

 ,get event_mode() { return (this._states.event_mode_locked || this._states.event_mode || this._states.dialogue_mode); }
 ,set event_mode(v) { this._states.event_mode = v; }

 ,get dialogue_branch_mode() { return this._states.dialogue_branch_mode; }
 ,set dialogue_branch_mode(v) {
    let v_current = this._states.dialogue_branch_mode;
    if (Array.isArray(v_current) && Array.isArray(v)) {
      const sb_index = {};
      v.forEach(k=>sb_index[k.sb_index||0]=true);
      for (const i in sb_index)
        v_current = v_current.filter(k=>(k.sb_index||0) != i);

      const v_append = [];
      v.forEach(k=>{
        const index = v_current.findIndex(k0=>{
const keys0 = (Array.isArray(k0.key)) ? k0.key : [k0.key];
const keys1 = (Array.isArray(k.key))  ? k.key  : [k.key];
return keys0.some(kk0=>keys1.indexOf(kk0) != -1);
        });
        if (index > -1) {
          v_current[index] = k;
        }
        else {
          v_append.push(k);
        }
      });
      v = v_current.concat(v_append);
    }
    else if (typeof v == 'number') {
      if (Array.isArray(v_current)) {
        v = v_current.filter(k=>(k.sb_index||0) != v);
        if (!v.length)
          v = null;
      }
      else {
        v = null;
      }
    }
    this._states.dialogue_branch_mode = v;
  }

 ,get character_movement_disabled() { return (this._states.character_movement_disabled || (this.event_mode && !this._states.action_allowed_in_event_mode) || this.character_combat_locked || MMD_SA_options.Dungeon_options.character_movement_disabled); }
 ,set character_movement_disabled(v) { this._states.character_movement_disabled = v; }

 ,get can_parry() {
if (!this.character.combat_mode)
  return false
if (this.character_combat_locked)
  return false

var para_SA = MMD_SA.MMD.motionManager.para_SA
return (!para_SA.super_armor && (!para_SA.motion_command_disabled));
  }

 ,get character_combat_locked()  {
if (this.event_mode && !this._states.action_allowed_in_event_mode)
  return "<ALL>"

return (this._states.character_combat_locked);
  }
 ,set character_combat_locked(v) { this._states.character_combat_locked = v; }

 ,get object_click_disabled() { return (this._states.object_click_disabled || this.event_mode || (MMD_SA.WebXR.reticle && MMD_SA.WebXR.reticle.visible)); }
 ,set object_click_disabled(v) { this._states.object_click_disabled = v; }

 ,check_states: (function () {
    function check_hp(c) {
if (c.hp == 0) {
  let d = MMD_SA_options.Dungeon
  let motion_id = d.motion_id_by_filename[MMD_SA.MMD.motionManager.filename] || ""
  if (!/^(PC combat hit down|PC down)$/.test(motion_id)) {
    MMD_SA_options.motion_shuffle_list_default = [MMD_SA_options.motion_index_by_name[d.motion["PC down"].name]]
    MMD_SA._force_motion_shuffle = true
    return true
  }
}
    }

    return function () {
var s = this._states
var t = Date.now()
if (s.auto_damage && !s.dialogue_mode) {
  var damage = Math.min((s.auto_damage.t||t) - t, 100) / 1000 * s.auto_damage.damage
  s.auto_damage.t = t
  this.character.hp_add(damage, check_hp)
  return (this.character.hp == 0)
}

for (let name in this.character.states) {
  let state = this.character.states[name]
  if (state.action) {
    state.action()
  }
}
    };
  })()


// events START
 ,events_default: {
    "_PLAYER_MANUAL_": [
//0
      [
        {
          message: {
  content: "1. Basic Control\n2. Battle Control\n3. Cancel"
 ,bubble_index: 3
 ,branch_list: [
    { key:1, branch_index:1 }
   ,{ key:2, branch_index:2 }
   ,{ key:3 }
  ]
          }
        }
      ]
//1
     ,[
        {
          message: {
  content: "Keyboard Control:\n* Move: WASD\n* Jump: SPACE\n* Change Camera: ↑\n* Toggle \"TPS Control Mode\" (*): ↓\n* Dialog/Event Branch: Numpad 1-9"
 ,bubble_index: 3
 ,para: { scale:1.5, font_scale:1 }
          }
        }
       ,{
          message: {
  content: "(*) - In default control mode, move the player character (PC) with WS keys, and rotate (PC and camera) with AD keys. In \"TPS Control Mode\", all WASD keys move PC with camera angle fixed. To change movement direction and camera angle, drag the mouse pointer."
 ,bubble_index: 3
 ,para: { scale:1.5, font_scale:1 }
          }
        }
       ,{
          message: {
  content: "Mouse Control:\n* Camera:\n - Drag/Wheel to rotate/zoom\n - Ctrl+Drag to pan\n - Double-click to reset\n* Item:\n - Double-click to use\n - Drag to re-position\n* PC/NPC/Object:\n  - Single/Double-click to interact"
 ,bubble_index: 3
 ,para: { scale:1.5, row_max:10, text_offset:{y:-10} }
          }
        }
      ]
//2
     ,[
        {
          message: {
  content: "Keyboard Combat Control:\n* Move: WASD\n* Jump: SPACE\n* Lock/Select Target: ←→\n* Unlock Target: ↓\n* Attack Combo (*): Numpad 4-9,+\n* Parry (Movable): Numpad 0"
 ,bubble_index: 3
 ,para: { scale:1.5 }
          }
        }
       ,{
          message: {
  content: "(*) - Attacks are combinations of different Numpad keys.\nExample: 5,5,4,6\nSome attack combos required the + key pressed.\nExample: +8,5,9"
 ,bubble_index: 3
 ,para: { scale:1.5 }
          }
        }
       ,{
          message: {
  content: "1. Full combo list\n2. End"
 ,bubble_index: 3
 ,branch_list: [
    { key:1, branch_index:3 }
   ,{ key:2 }
  ]
          }
        }
      ]
//3
     ,[
        {
          message: {
  content: "1) +8,5,9 (3RP LK LP)\n2) 4,4,4,5 (鬼哭連脚)\n3) 7,7,8 (鬼哭連拳)\n4) 45,45 (立ち中K-中K)\n5) 5,5,4,6 (ストンピングダブルニー)"
 ,bubble_index: 3
 ,para: { scale:1.5 }
          }
        }
       ,{
          message: {
  content: "6) 5,4,5,6 (アサルトラッシュ～ブルーサンダー)\n7) +8,7,9 (マッハコンビネーション)\n8) 45,56 (ステップキックソバット)\n9) +4,8,8,9 (ブラストコンビネーション)\n10) 8,7,7,5 (ラピッドフィストロー)"
 ,bubble_index: 3
 ,para: { scale:1.5 }
          }
        }
       ,{
          message: {
  content: "11) 456 (踵斧)\n12) 7,8,7,8,9 (弱P弱P中P強P強P)\n13) 4,7,8 (修羅覇王靠華山)\n14) +7,5,6 (ダークナイトコンビネーション)\n15) 78,78,8,9 (サラマンダーコンビネーション)"
 ,bubble_index: 3
 ,para: { scale:1.5 }
          }
        }
       ,{
          message: {
  content: "16) +7,7,8,9 (フラッシュアサルトコンボ-ターンイン-ボディストレート)\n17) 8,8,7,6 (基本攻撃)\n18) +4,5,8,9 (Albert-combo6)\n19) 56,56 (Albert-somersault-kick)"
 ,bubble_index: 3
 ,para: { scale:1.5 }
          }
        }
      ]
    ]

   ,"_SETTINGS_": [
//0
      [
        {
          message: {
  content: "1. Graphics Presets (PC)\n2. Graphics Effects (Scene)\n3. WebXR Options\n4. UI and Overlays\n5. Cancel"
 ,bubble_index: 3
 ,branch_list: [
    { key:1, branch_index:1 }
   ,{ key:2, branch_index:6 }
   ,{ key:3, branch_index:10 }
   ,{ key:4, branch_index:11 }
   ,{ key:5 }
  ]
          }
        }
      ]
// 1
     ,[
        {
          message: {
  content: "1. MMD Default (i.e. MME effects OFF)\n2. Imported Model Default (SO4/HDR2)\n3. Adult-A (SO2B+/HDR2/AdultS2B+)\n4. Adult-B (SO5B+/HDR5/AdultS2)\n5. Cancel"
 ,bubble_index: 3
 ,branch_list: [
    { key:1, branch_index:1+1 }
   ,{ key:2, branch_index:1+2 }
   ,{ key:3, branch_index:1+3 }
   ,{ key:4, branch_index:1+4 }
   ,{ key:5 }
  ]
          }
        }
      ]
// 2
     ,[
        {
  func: function () {
MMD_SA_options.MME.self_overlay = { enabled:false }
MMD_SA_options.MME.HDR = { enabled:false }
MMD_SA_options.MME.serious_shader = { enabled:false }
//MMD_SA_options.MME.SAO = { disabled_by_material:[] }
MMD_SA._MME_uniforms_updated_ = Date.now()
System._browser.update_tray()
  }
 ,ended: true
        }
      ]
// 3
     ,[
        {
  func: function () {
MMD_SA_options.MME.self_overlay = { enabled:true, opacity:0.4 }
MMD_SA_options.MME.HDR = { enabled:true, opacity:0.2 }
MMD_SA_options.MME.serious_shader = { enabled:false }
//MMD_SA_options.MME.SAO = { disabled_by_material:[] }
MMD_SA._MME_uniforms_updated_ = Date.now()
System._browser.update_tray()
  }
 ,ended: true
        }
      ]
// 4
     ,[
        {
  func: function () {
MMD_SA_options.MME.self_overlay = { enabled:true, opacity:0.2, brightness:1 }
MMD_SA_options.MME.HDR = { enabled:true, opacity:0.2 }
MMD_SA_options.MME.serious_shader = { enabled:true, type:"AdultShaderS2", OverBright:1.3, shadow_opacity:0.4 }
//MMD_SA_options.MME.SAO = { disabled_by_material:[] }
MMD_SA._MME_uniforms_updated_ = Date.now()
System._browser.update_tray()
  }
 ,ended: true
        }
      ]
// 5
     ,[
        {
  func: function () {
MMD_SA_options.MME.self_overlay = { enabled:true, opacity:0.5, brightness:1 }
MMD_SA_options.MME.HDR = { enabled:true, opacity:0.5 }
MMD_SA_options.MME.serious_shader = { enabled:true, type:"AdultShaderS2" }
//MMD_SA_options.MME.SAO = { disabled_by_material:[] }
MMD_SA._MME_uniforms_updated_ = Date.now()
System._browser.update_tray()
  }
 ,ended: true
        }
      ]

// 6
     ,[
        {
          message: {
  content: "1. Shadow\n2. Model Outline\n3. 3D Resolution\n4. Cancel"
 ,bubble_index: 3
 ,branch_list: [
    { key:1, branch_index:6+1 }
   ,{ key:2, branch_index:6+2 }
   ,{ key:3, branch_index:6+3 }
   ,{ key:4 }
  ]
          }
        }
      ]
// 7
     ,[
        {
  func: function () {
MMD_SA_options.use_shadowMap = !MMD_SA_options.use_shadowMap
MMD_SA.toggle_shadowMap()
DEBUG_show("Shadow:" + ((MMD_SA_options.use_shadowMap && "ON")||"OFF"), 3)
  }
 ,ended: true
        }
      ]
// 8
     ,[
        {
  func: (function () {
    var edgeScale_default = 0
    return function () {
var edgeScale = jThree.MMD.edgeScale
if (edgeScale) {
  edgeScale_default = edgeScale
  edgeScale = 0
}
else
  edgeScale = edgeScale_default
jThree.MMD.edgeScale = edgeScale
DEBUG_show("Model Outline:" + ((edgeScale && "ON")||"OFF"), 3)
    };
  })()
 ,ended: true
        }
      ]
// 9
     ,[
        {
  func: function () {
var is_default_res = (MMD_SA._renderer.devicePixelRatio == window.devicePixelRatio)
MMD_SA._renderer.devicePixelRatio = (is_default_res) ? ((window.devicePixelRatio > 1) ? 1 : 0.5) : window.devicePixelRatio
MMD_SA._renderer.__resize(EV_width, EV_height)
DEBUG_show("3D Resolution:" + (((is_default_res) && (Math.round(MMD_SA._renderer.devicePixelRatio/window.devicePixelRatio*100)+"%")) || "100%"), 3)
  }
 ,ended: true
        }
      ]
// 10
     ,[
        {
          goto_event: { id:"_WEBXR_OPTIONS_", branch_index:0 }
        }
      ]
// 11
     ,[
        {
          message: {
  get content() {
if (System._browser.overlay_mode)
  return System._browser.translation.get('Dungeon.UI.tome.settings.UI_and_overlays.user_interface.UI_off') + '\n1. ' + ((System._browser.overlay_mode == 2) ? 'UI: OFF + ' + System._browser.translation.get('Dungeon.UI.tome.settings.UI_and_overlays.user_interface.UI_off.green_screen') : System._browser.translation.get('Dungeon.UI.tome.settings.UI_and_overlays.user_interface') + ': OFF') + '\n2. ' + System._browser.translation.get('Misc.done');
return '1. ' + System._browser.translation.get('Dungeon.UI.tome.settings.UI_and_overlays.user_interface') + ': ON' + ((MMD_SA_options.user_camera.ML_models.enabled && (System._browser.overlay_mode == 0)) ? '\n2. ' + System._browser.translation.get('Dungeon.UI.tome.settings.UI_and_overlays.camera_display') + ': ' + ((MMD_SA_options.user_camera.display.video.hidden) ? 'OFF' : ((MMD_SA_options.user_camera.display.video.hidden == null) ? System._browser.translation.get('Dungeon.UI.tome.settings.UI_and_overlays.camera_display.non_webcam') : 'ON')) + '\n3. ' + System._browser.translation.get('Dungeon.UI.tome.settings.UI_and_overlays.wireframe_display') + ': ' + ((MMD_SA_options.user_camera.display.wireframe.hidden) ? 'OFF' : 'ON') + '\n4. ' + System._browser.translation.get('Dungeon.UI.tome.settings.UI_and_overlays.mocap_debug_display') + ': ' + ((MMD_SA_options.user_camera.ML_models.debug_hidden) ? 'OFF' : 'ON') + '\n5. ' + System._browser.translation.get('Dungeon.UI.tome.settings.UI_and_overlays.UI_sound_effects') + ': ' + ((MMD_SA_options.Dungeon.inventory.UI.muted)?'OFF':'ON') + '\n6. ' + System._browser.translation.get('Dungeon.UI.tome.settings.UI_and_overlays.UI_language') + ': ' + System._browser.translation.language_info + '\n7. ' + System._browser.translation.get('Misc.done') : '\n2. ' + System._browser.translation.get('Misc.done'));
  }
 ,para: { no_word_break:true }
 ,bubble_index: 3
 ,get branch_list() {
return [
  { key:1, branch_index:12 },
].concat((MMD_SA_options.user_camera.ML_models.enabled && (System._browser.overlay_mode == 0)) ? [
  { key:2, branch_index:13 },
  { key:3, branch_index:14 },
  { key:4, branch_index:15 },
  { key:5, branch_index:16 },
  { key:6, branch_index:17 },
  { key:7, is_closing_event:true }
] : [
  { key:2, is_closing_event:true }
]);
  }
          }
        }
      ]
// 12
     ,[
        {
  func: function () {
let mode = System._browser.overlay_mode
if (++mode > 2)
  mode = 0;
System._browser.overlay_mode = mode;
  }
 ,goto_branch: 11
        }
      ]
// 13
     ,[
        {
  func: function () {
MMD_SA_options.user_camera.display.video.hidden = (MMD_SA_options.user_camera.display.video.hidden == null) ? false : ((MMD_SA_options.user_camera.display.video.hidden) ? null : true);
  }
 ,goto_branch: 11
        }
      ]
// 14
     ,[
        {
  func: function () {
MMD_SA_options.user_camera.display.wireframe.hidden = !MMD_SA_options.user_camera.display.wireframe.hidden;
  }
 ,goto_branch: 11
        }
      ]
// 15
     ,[
        {
  func: function () {
MMD_SA_options.user_camera.ML_models.debug_hidden = !MMD_SA_options.user_camera.ML_models.debug_hidden;
DEBUG_show();
  }
 ,goto_branch: 11
        }
      ]
// 16
     ,[
        {
  func: function () {
MMD_SA_options.Dungeon.inventory.UI.muted = !MMD_SA_options.Dungeon.inventory.UI.muted;
  }
 ,goto_branch: 11
        }
      ]
// 17
     ,[
        {
  func: function () {
const language = ['', 'en', 'ja', 'zh'];
let index = language.indexOf(System._browser.translation.language_full);
if (index == -1) {
  index = 1;
}
else if (++index >= language.length) {
  index = 0;
}

System._browser.translation.language = language[index];
  }
 ,goto_branch: 11
        }
      ]
    ]

   ,"_WEBXR_OPTIONS_": [
//0
      [
        {
          message: {
  content: "1. DOM Overlay\n2. Light Estimation\n3. Anchors\n4. Framebuffer Scale\n5. Check Status\n6. DEBUG TEST\n7. Cancel"
 ,bubble_index: 3
 ,branch_list: [
    { key:1, branch_index:1 }
   ,{ key:2, branch_index:2 }
   ,{ key:3, branch_index:3 }
   ,{ key:4, branch_index:4 }
   ,{ key:5, branch_index:8 }
   ,{ key:6, branch_index:10 }
   ,{ key:7 }
  ]
          }
        }
      ]
// 1
     ,[
        {
  func: function () {
var AR_options = MMD_SA_options.WebXR && MMD_SA_options.WebXR.AR;
if (!AR_options || !AR_options.dom_overlay) {
  DEBUG_show("(No WebXR mode available)", 3)
  return
}
var xr = MMD_SA.WebXR;
if (xr.session) {
  DEBUG_show("(This option cannot be changed during WebXR mode.)", 3)
  return
}

AR_options.dom_overlay.enabled = (AR_options.dom_overlay.enabled !== false) ? false : true;
DEBUG_show("DOM Overlay:" + ((AR_options.dom_overlay.enabled && "ON")||"OFF"), 3)
  }
 ,ended: true
        }
      ]
// 2
     ,[
        {
  func: function () {
var AR_options = MMD_SA_options.WebXR && MMD_SA_options.WebXR.AR;
if (!AR_options) {
  DEBUG_show("(No WebXR mode available)", 3)
  return
}
var xr = MMD_SA.WebXR;
if (xr.session) {
  DEBUG_show("(This option cannot be changed during WebXR mode.)", 3)
  return
}

AR_options.light_estimation_enabled = (AR_options.light_estimation_enabled !== false) ? false : true;
DEBUG_show("Light Estimation:" + ((AR_options.light_estimation_enabled && "ON")||"OFF"), 3)
  }
 ,ended: true
        }
      ]
// 3
     ,[
        {
  func: function () {
var AR_options = MMD_SA_options.WebXR && MMD_SA_options.WebXR.AR;
if (!AR_options) {
  DEBUG_show("(No WebXR mode available)", 3)
  return
}
var xr = MMD_SA.WebXR;
if (xr.session) {
  DEBUG_show("(This option cannot be changed during WebXR mode.)", 3)
  return
}

AR_options.anchors_enabled = (AR_options.anchors_enabled !== false) ? false : true;
DEBUG_show("Anchors:" + ((AR_options.anchors_enabled && "ON")||"OFF"), 3)
  }
 ,ended: true
        }
      ]
// 4
     ,[
        {
          message: {
  content: "1. Default\n2. x0.5\n3. x0.25\n4. Cancel"
 ,bubble_index: 3
 ,branch_list: [
    { key:1, branch_index:4+1 }
   ,{ key:2, branch_index:4+2 }
   ,{ key:3, branch_index:4+3 }
   ,{ key:4 }
  ]
          }
        }
      ]
// 5
     ,[
        {
  func: function () {
var AR_options = MMD_SA_options.WebXR && MMD_SA_options.WebXR.AR;
if (!AR_options) {
  DEBUG_show("(No WebXR mode available)", 3)
  return
}
var xr = MMD_SA.WebXR;
if (xr.session) {
  DEBUG_show("(This option cannot be changed during WebXR mode.)", 3)
  return
}

AR_options.framebufferScaleFactor = 0;
DEBUG_show("Framebuffer Scale:x" + (System._browser.url_search_params.xr_fb_scale||1), 3)
  }
 ,ended: true
        }
      ]
// 6
     ,[
        {
  func: function () {
var AR_options = MMD_SA_options.WebXR && MMD_SA_options.WebXR.AR;
if (!AR_options) {
  DEBUG_show("(No WebXR mode available)", 3)
  return
}
var xr = MMD_SA.WebXR;
if (xr.session) {
  DEBUG_show("(This option cannot be changed during WebXR mode.)", 3)
  return
}

AR_options.framebufferScaleFactor = 0.5;
DEBUG_show("Framebuffer Scale:x0.5", 3)
  }
 ,ended: true
        }
      ]
// 7
     ,[
        {
  func: function () {
var AR_options = MMD_SA_options.WebXR && MMD_SA_options.WebXR.AR;
if (!AR_options) {
  DEBUG_show("(No WebXR mode available)", 3)
  return
}
var xr = MMD_SA.WebXR;
if (xr.session) {
  DEBUG_show("(This option cannot be changed during WebXR mode.)", 3)
  return
}

AR_options.framebufferScaleFactor = 0.25;
DEBUG_show("Framebuffer Scale:x0.25", 3)
  }
 ,ended: true
        }
      ]
// 8
     ,[
        {
  func: (function () {
    var show_fps = false
    var timerID = null

    function fps() {
timerID = requestAnimationFrame(fps)
if (EV_sync_update.fps_last && !System._browser.camera.facemesh.enabled) {
  DEBUG_show(EV_sync_update.fps_last)
  EV_sync_update.fps_last = 0
}
    }

    return function () {
show_fps = !show_fps
if (show_fps) {
  if (!timerID)
    timerID = requestAnimationFrame(fps)
}
else {
  DEBUG_show("(FPS counter:hidden)", 2)
  if (timerID) {
    cancelAnimationFrame(timerID)
    timerID = null
  }
}
    };
  })(),
          message: {
  content: "1. DOM Overlay:{{(!self.XRSession||!('domOverlayState' in XRSession.prototype))?'NOT SUPPORTED':((MMD_SA_options.WebXR && MMD_SA_options.WebXR.AR && MMD_SA_options.WebXR.AR.dom_overlay && (MMD_SA_options.WebXR.AR.dom_overlay.enabled!==false) && 'ON')||'OFF')}}\n2. Light Estimation:{{(!self.XRSession||!('updateWorldTrackingState' in XRSession.prototype))?'NOT SUPPORTED':((MMD_SA_options.WebXR && MMD_SA_options.WebXR.AR && (MMD_SA_options.WebXR.AR.light_estimation_enabled!==false) && 'ON')||'OFF')}}\n3. Anchors:{{(!self.XRHitTestResult||!('createAnchor' in XRHitTestResult.prototype))?'NOT SUPPORTED':((MMD_SA_options.WebXR && MMD_SA_options.WebXR.AR && (MMD_SA_options.WebXR.AR.anchors_enabled!==false) && 'ON')||'OFF')}}\n4. Framebuffer Scale:x{{((MMD_SA_options.WebXR && MMD_SA_options.WebXR.AR && MMD_SA_options.WebXR.AR.framebufferScaleFactor)||System._browser.url_search_params.xr_fb_scale||1)}}\n5. Dummy WebGL Layer:{{(MMD_SA_options.WebXR && MMD_SA_options.WebXR.AR && MMD_SA_options.WebXR.AR.dom_overlay && MMD_SA_options.WebXR.AR.dom_overlay.use_dummy_webgl && 'ON')||'OFF'}}\n6. User Camera:{{(MMD_SA.WebXR.user_camera.video && (MMD_SA.WebXR.user_camera.video.videoWidth+'x'+MMD_SA.WebXR.user_camera.video.videoHeight+'/'+MMD_SA.WebXR.user_camera.video_canvas.width+'x'+MMD_SA.WebXR.user_camera.video_canvas.height+'/'+window.devicePixelRatio))||'NOT IN USE'}}"
 ,bubble_index: 3
          }
        }
      ]
// 9
     ,[
        {
  ended: true
        }
      ]
// 10
     ,[
        {
          message: {
  content: "1. Dummy WebGL Layer\n2. Cancel"
 ,bubble_index: 3
 ,branch_list: [
    { key:1, branch_index:11 }
   ,{ key:2 }
  ]
          }
        }
      ]
// 11
     ,[
        {
  func: function () {
var AR_options = MMD_SA_options.WebXR && MMD_SA_options.WebXR.AR;
if (!AR_options || !AR_options.dom_overlay) {
  DEBUG_show("(No WebXR mode available)", 3)
  return
}
var xr = MMD_SA.WebXR;
if (xr.session) {
  DEBUG_show("(This option cannot be changed during WebXR mode.)", 3)
  return
}

AR_options.dom_overlay.use_dummy_webgl = !AR_options.dom_overlay.use_dummy_webgl;
DEBUG_show("Dummy WebGL Layer:" + ((AR_options.dom_overlay.use_dummy_webgl && "ON")||"OFF"), 3)
  }
 ,ended: true
        }
      ]

    ]

   ,"_MISC_": [
//0
      [
        {
          message: {
  content: "1. Character form\n2. Use WASM-SIMD\n3. Debug Log\n4. Cancel"
 ,bubble_index: 3
 ,branch_list: [
    { key:1, branch_index:1 }
   ,{ key:2, branch_index:2 }
   ,{ key:3, branch_index:3 }
   ,{ key:4 }
  ]
          }
        }
      ]
//1
     ,[
        {
  func: (function () {
    function morph_event(e) {
var mf = morph_form[morph_form_index]
if (mf) {
  let model = e.detail.model
  for (const morph_name in mf) {
    let _m_idx = model.pmx.morphs_index_by_name[morph_name]
    if (_m_idx != null) {
      let _m = model.pmx.morphs[_m_idx]
      MMD_SA._custom_morph.push({ key:{ weight:mf[morph_name], morph_type:_m.type, morph_index:_m_idx }, idx:model.morph.target_index_by_name[morph_name] })
    }
  }
}
//DEBUG_show(Date.now()+":"+MMD_SA._custom_morph.length)
    }

    var morph_event_registered = false

    var morph_form = [null]
    var morph_form_index = 0

    return function () {
var mf = MMD_SA_options.model_para_obj.morph_form
if (!mf) {
  DEBUG_show("(No other character form available)", 3)
  return
}

morph_form = [null].concat(Object.values(mf))

if (++morph_form_index >= morph_form.length) {
  morph_form_index = 0;
  morph_event_registered = false;
  window.removeEventListener("SA_MMD_model0_process_morphs", morph_event);
  DEBUG_show("Character form:DEFAULT", 3);
}
else {
  if (!morph_event_registered) {
    morph_event_registered = true
    window.addEventListener("SA_MMD_model0_process_morphs", morph_event)
  }
  DEBUG_show("Character form:" + morph_form_index, 3)
}
    };
  })()
 ,ended: true
        }
      ]
//2
     ,[
        {
  func: function () {
System._browser.use_WASM_SIMD = !System._browser.use_WASM_SIMD
DEBUG_show('WASM-SIMD:' + ((System._browser.use_WASM_SIMD)?'ON':'OFF'), 3)
  }
 ,ended: true
        }
      ]
//3
     ,[
        {
  func: function () {
DEBUG_show(System._browser.console.output_text, 60)
  }
 ,ended: true
        }
      ]
    ]

   ,"_onplayerdefeated_default_": [
//0
      [
        {
          message: {
  content: "You are defeated...\n1. Restart\n2. Cancel"
 ,para: { pos_mod:[0,15,0] }
 ,bubble_index: 3
 ,branch_list: [
    { key:1, branch_index:1 }
   ,{ key:2 }
  ]
          }
        }
      ]
//1
     ,[
        {
          load_area: { id:'start', refresh_state:1 }
        }
      ]
    ]
  }

 ,_event_active: {}

 ,run_event: (function () {
    function statement(statement_obj) {
if (statement_obj._if) {
  if (condition.call(this, statement_obj._if)) {
    if (statement_obj._then)
      statement.call(this, statement_obj._then)
  }
  else {
    if (statement_obj._else)
      statement.call(this, statement_obj._else)
  }
}

event_main.call(this, statement_obj)
    }

    function condition(condition_obj) {
var bool

var c = condition_obj.condition
if (c) {
  var e
  if ((typeof c[0] == "string") || (c[0][1] == this.area_id)) {
    e = this.event_flag[c[0]]
  }
  else {
// array [0:area_id, 1:event_id]
    var event_flag = MMD_SA_options.Dungeon_options.options_by_area_id[c[0][0]]._saved.event_flag || {}
    e = event_flag[c[0][1]]
  }
  switch (c[1]) {
    case "===":
      bool = (e === c[2])
      break
    case "==":
      bool = (e == c[2])
      break
    case ">=":
      bool = (e >= c[2])
      break
    case "<=":
      bool = (e <= c[2])
      break
    case ">":
      bool = (e > c[2])
      break
    case "<":
      bool = (e < c[2])
      break
  }
}
else if (condition_obj._and) {
  bool = true
  for (var i = 0, i_max = condition_obj._and.length; i < i_max; i++) {
    if (!condition.call(this, condition_obj._and[i])) {
      bool = false
      break
    }
  }
}

return bool
    }

    function Combat(combat) {
Object.assign(this, combat)

this.event_obj = combat
this.enemy_list = []
    }
    Combat.prototype.ondefeated = (function () {
      function onenemyalldefeated_default() {
MMD_SA._force_motion_shuffle = true;
// override the current moion .onended event
window.addEventListener("SA_MMD_model0_onmotionended", onmotionended);
      }

      function onmotionended(e) {
MMD_SA_options.motion_shuffle_list_default = [MMD_SA_options.motion_index_by_name[MMD_SA_options.Dungeon.motion["PC combat victory"].name]]
MMD_SA._no_fading = true
e.detail.result.return_value = true
window.removeEventListener("SA_MMD_model0_onmotionended", onmotionended);
      }

      return function (character_index) {
// backward compatibility
if (!this.enemy_list.length)
  return false

var d = MMD_SA_options.Dungeon

if (character_index == 0) {
  if (d.character.hp == 0) {
    if (this.onplayerdefeated && this.onplayerdefeated())
      return true
    if (d.character.ondefeated && d.character.ondefeated())
      return true
    if (!d._states.event_mode)
      d.run_event("_onplayerdefeated_default_")
    return true
  }
  return false
}

var c = d.object_base_list.find(function (obj_base) { return (obj_base.character_index==character_index); }).object_list[0];

var defeated
if (c && (c.hp == 0)) {
  if (c.ondefeated) {
    if (c.ondefeated())
      return true
  }
  else if (this.onenemydefeated) {
    if (this.onenemydefeated(c))
      return true
  }
  defeated = true
  c._obj_proxy.hidden = true
  c._obj.visible = false
  var model_para = MMD_SA_options.model_para_obj_all[character_index]
  model_para._motion_name_next = model_para.motion_name_default_combat
}

if (this.enemy_list.every(function (enemy) { return enemy.hp==0; })) {
  defeated = true
  if (this.onenemyalldefeated && this.onenemyalldefeated(onenemyalldefeated_default)) {
    return true
  }
  onenemyalldefeated_default()
//  MMD_SA_options.Dungeon.character.combat_mode = false
}

return defeated
      };
    })();

    function event_main(e) {
var that = this
var obj = this._event_active.obj

var sb_index = e.sb_index || 0;
var sb = MMD_SA.SpeechBubble.list[sb_index];
if (sb.visible && sb.msg_timerID && this._states.dialogue_mode) {
  sb.hide();
  if (sb_index == 0)
    that._states.dialogue_mode = false;
}

if (e.func && e.func()) {
  this.run_event()
  return
}

var c = this.character

if (e.message) {
  (function () {
const msg = e.message;
const _obj = obj;

const index = msg.index || 0;

const func = function () {
  if (msg.content) {
    const bubble_index = msg.bubble_index || 0;
    let para = msg.para || {};
    if (System._browser.camera.initialized)
      para.always_update = true;
    const duration = (msg.duration) ? msg.duration * 1000 : 0

    if (c.mount_para && c.mount_para.msg_para) {
      para = Object.clone(para)
      para.scale = (c.mount_para.msg_para.scale || 1) * (para.scale || 1);
      const _pos_mod = (c.mount_para.msg_para.pos_mod || [0,0,0])
      para.pos_mod = (para.pos_mod) ? para.pos_mod.map(function(v,idx){return v+_pos_mod[idx]}) : _pos_mod
    }

    if (msg.NPC) {
      para.head_pos = (_obj && _obj._obj.position.clone()) || THREE.MMD.getModels()[msg.NPC].mesh.position.clone()
      para.head_pos.y += 20
    }

    if (msg.branch_list) {
      msg.branch_list.forEach(b=>{ if (b.sb_index==null) b.sb_index=index; });
      that.dialogue_branch_mode = msg.branch_list;
    }

    MMD_SA.SpeechBubble.list[index].message(bubble_index, msg.content, duration, para)

    if ((index == 0) && !duration) {
      if (Lnumpad.style.visibility != "hidden")
        System._browser.virtual_numpad_toggle(true)
      that._states.dialogue_mode = true
    }
  }
  else {
    MMD_SA.SpeechBubble.list[index].hide();
    if (index == 0)
      that._states.dialogue_mode = false;
  }
};

const delay = (msg.delay) ? msg.delay * 1000 : 0;
if (delay) {
  setTimeout(function () { func() }, delay);
}
else {
  func();
}
  })();
}

if (e.turn_to_character) {
  var target_pos = (obj && obj._obj.position && (typeof e.turn_to_character != "number")) || THREE.MMD.getModels()[e.turn_to_character].mesh.position
  c.rot.y = Math.PI/2 - Math.atan2((target_pos.z-c.pos.z), (target_pos.x-c.pos.x))
  c.about_turn = false
  THREE.MMD.getModels()[0].mesh.quaternion.setFromEuler(c.rot)
  c.pos_update()
}

if (e.look_at_character) {
  MMD_SA._mouse_pos_3D = []
  if (obj && obj.cache_index && (typeof e.look_at_character != "number")) {
    MMD_SA_options.model_para_obj_all[0].look_at_target = (function () {
var target = obj
return function () {
  var pos = obj._obj.position.clone()
  pos.y += 15
  return pos
};
    })();
  }
  else
    MMD_SA_options.model_para_obj_all[0].look_at_character = e.look_at_character
}

if (e.NPC_turns_to_you) {
  var npc = (obj && obj._obj && (typeof e.NPC_turns_to_you != "number")) || THREE.MMD.getModels()[e.NPC_turns_to_you].mesh
  this._event_active._NPC_turns_back = { npc:npc, quat:npc.quaternion.clone() }
  MMD_SA.TEMP_v3.set(0, Math.PI/2 - Math.atan2((c.pos.z-npc.position.z), (c.pos.x-npc.position.x)), 0)
  npc.quaternion.setFromEuler(MMD_SA.TEMP_v3)
}

if (e.swap_PC) {
  if (typeof swap_PC == "number") {
    c.swap_character({character_index:e.swap_PC})
  }
  else {
    let id = this.object_id_translated[e.swap_PC] || e.swap_PC
    if (/^object(\d+)_(\d+)$/.test(id)) {
      c.swap_character(this.object_base_list[parseInt(RegExp.$1)].object_list[parseInt(RegExp.$2)])
    }
    else {
    }
  }
}

if (e.set_starting_position) {
  var area_id = e.set_starting_position.area_id || this.area_id
  var area_saved = MMD_SA_options.Dungeon_options.options_by_area_id[area_id]._saved
  var starting_position = e.set_starting_position.position
  if (!starting_position)
    area_saved.starting_position = null
  else if (typeof starting_position == "string")
    area_saved.starting_position = c.pos.clone()
  else
    area_saved.starting_position = starting_position
}

if (e.follow_PC) {
  for (var id in e.follow_PC) {
    var follower = e.follow_PC[id]

    var mesh, obj_base_index, obj_base
    id = this.object_id_translated[id] || id
    if (/^object(\d+)_(\d+)$/.test(id)) {
      obj_base_index = parseInt(RegExp.$1)
      obj_base = this.object_base_list[obj_base_index]
      mesh = obj_base.object_list[parseInt(RegExp.$2)]
      if (!mesh)
        continue
// trigger real object
      mesh._obj_proxy.hidden = false
      mesh._obj_proxy.visible = true

      mesh = mesh._obj
    }
    else {
    }

    this.PC_follower_list = this.PC_follower_list.filter(function (p) {
      return (p.obj._obj != mesh)
    });

    this.PC_follower_list.push({
  obj: {
    _obj: mesh
   ,pos_base: follower.pos_base
   ,rot_base: follower.rot_base
   ,follow_PC_ground_normal: obj_base && obj_base.use_PC_ground_normal_when_following
  }
    });
  }
}
if (e.unfollow_PC) {
  e.unfollow_PC.forEach(function (id) {
    var mesh
    id = that.object_id_translated[id] || id
    if (/^object(\d+)_(\d+)$/.test(id)) {
      var obj_base_index = parseInt(RegExp.$1)
      var obj_base = that.object_base_list[obj_base_index]
      mesh = obj_base.object_list[parseInt(RegExp.$2)]
      if (!mesh)
        return
// real object assumed
      mesh = mesh._obj
    }
    else {
    }

    that.PC_follower_list = that.PC_follower_list.filter(function (p) {
      return (p.obj._obj != mesh)
    });
  });
}

var objects = e.objects || {}
// backward compatibility
if (e.placement) {
  for (var id in e.placement) {
    objects[id] = { placement:e.placement[id] }
  }
  e.placement = null
}
if (objects) {
  var enemy_index = -1
  for (var id in objects) {
    var obj = objects[id]
    var p = obj.placement

    var character_index
    var mesh, _obj
    id = this.object_id_translated[id] || id
    if (id == "PC") {
      character_index = 0
      _obj = c
      mesh = THREE.MMD.getModels()[0].mesh
    }
    else if (/^object(\d+)_(\d+)$/.test(id)) {
      var obj_base_index = parseInt(RegExp.$1)
      var obj_base = this.object_base_list[obj_base_index]
      character_index = obj_base.character_index
      _obj = obj_base.object_list[parseInt(RegExp.$2)]
      if (!_obj)
        continue
      _obj._obj_proxy.hidden = p && p.hidden
      mesh = _obj._obj
    }
    else {
console.error("event error: invalid e.placement")
continue
    }

    var rot_mod, pos_center, center_mesh
    if (p) {
      if (p.position) {
        var pos = Object.assign(new THREE.Vector3(), p.position)
        if (pos.grid) {
          if (pos.grid.x == null) {
            pos.grid.x = ~~(mesh.position.x/this.grid_size)
            pos.grid.y = ~~(mesh.position.z/this.grid_size)
          }
          pos.add(new THREE.Vector3((pos.grid.x+0.5) * this.grid_size, 0, (pos.grid.y+0.5) * this.grid_size).add(pos))
        }
        if (pos.center) {
          let center_id = this.object_id_translated[pos.center.id] || pos.center.id
          if (center_id == "PC")
            center_mesh = THREE.MMD.getModels()[0].mesh
          else if (/^object(\d+)_(\d+)$/.test(center_id))
            center_mesh = this.object_base_list[parseInt(RegExp.$1)].object_list[parseInt(RegExp.$2)]._obj
          if (pos.center.offset) {
            let offset = MMD_SA.TEMP_v3.copy(pos.center.offset)
            if (pos.center.offset_rotation) {
              if (center_mesh.useQuaternion)
                offset.applyQuaternion(center_mesh.quaternion)
              else
                offset.applyEuler(center_mesh.rotation)
              offset.applyEuler(MMD_SA._v3b.copy(pos.center.offset_rotation).multiplyScalar(Math.PI/180))
            }
            pos_center = center_mesh.position.clone().add(offset)
          }
        }
        if (pos_center)
          pos.add(pos_center)
        if (p.behind_camera) {
          var camera = MMD_SA._trackball_camera
          MMD_SA.TEMP_v3.copy(camera.object.position).sub(camera.target).setY(0)
          var a = -Math.atan2(MMD_SA.TEMP_v3.z, MMD_SA.TEMP_v3.x) + Math.PI/2
//console.log(MMD_SA.TEMP_v3.toArray().join(",")+"/"+a)
          rot_mod = MMD_SA._v3a.set(0,a,0)
          Object.assign(pos, MMD_SA.TEMP_v3.set(pos.x,0,pos.z).applyEuler(rot_mod).add(camera.object.position))
        }
        if (pos.grounded) {
          var x = ~~(pos.x/this.grid_size)
          var y = ~~(pos.z/this.grid_size)
          pos.y = this.get_ground_y(pos)//this.get_para(x,y).ground_y || 0
        }
        if (character_index == 0) {
          c.pos.copy(pos)
        }
        else {
          mesh.position.copy(pos)
        }
      }
      if (p.rotation) {
        var rot = MMD_SA.TEMP_v3.copy(p.rotation).multiplyScalar(Math.PI/180)
        if (center_mesh) {
          if (center_mesh.useQuaternion) {
//            rot.add(MMD_SA._v3b.setEulerFromQuaternion(center_mesh.quaternion))
          }
          else
            rot.add(center_mesh.rotation)
        }
        if (rot_mod)
          rot.add(rot_mod)
        if (character_index == 0) {
          c.about_turn = false
          c.rot.copy(rot)
          mesh.quaternion.setFromEuler(rot)
        }
        else {
          if (mesh.useQuaternion)
            mesh.quaternion.setFromEuler(rot)
          else
            mesh.rotation.copy(rot)
        }
// avoid some conversion issue from Quaternion to Euler
if (mesh.useQuaternion && center_mesh && center_mesh.useQuaternion) mesh.quaternion.multiply(center_mesh.quaternion)
//if (p.rotation.y==90) DEBUG_show(rot.y*180/Math.PI+'\n\n'+MMD_SA.TEMP_v3.setEulerFromQuaternion(mesh.quaternion).multiplyScalar(180/Math.PI).toArray().join("\n"))
      }
      var vis = (p.hidden) ? false : true;
      mesh.visible = vis;
// update mesh reference after .visible update
      if (id != "PC")
        mesh = _obj._obj
      if (!MMD_SA.THREEX.enabled) mesh.children.forEach(function (c) { c.visible=vis; });
      if (character_index == 0) {
        c.pos_update()
        MMD_SA.reset_camera()
      }
    }

    if ((obj.hp != null) && _obj.hp_max) {
      _obj.hp = Math.min(obj.hp, _obj.hp_max)
    }

    var zom = obj.zone_of_movement || _obj._zone_of_movement
    if (zom) {
      if (!_obj.zone_of_movement)
        _obj.zone_of_movement = new THREE.Box3()
      _obj.zone_of_movement.copy(zom).translate(zom.center_position || pos_center || mesh.position)
    }

    if (obj.combat_stats) {
      Object.append(_obj.combat_stats, obj.combat_stats)
    }

    if (this._states.combat && (id != "PC") && (_obj.hp > 0) && (this._states.combat.enemy_list.indexOf(_obj) == -1)) {
      this._states.combat.enemy_list.push(_obj)
      if (this._states.combat.show_HP_bar) {
this.sprite.display(new this.sprite.TextureObject_HP_bar(++enemy_index), {
  pos_target: {
    mesh: mesh
   ,offset: new THREE.Vector3(0,mesh.geometry.boundingBox.max.y*mesh.scale.y+2,0)
  }
 ,get_value: (function () {
    var obj = _obj;
    var para = { index:enemy_index, border_color_default:"black" };
    return function () {
para.v = obj.hp/obj.hp_max
var combat = MMD_SA_options.Dungeon._states.combat
if (combat)
  para.border_color = (para.index == combat._target_enemy_index) ? "white" : "black"
return para;
    };
  })()
})
      }
    }

    obj.func && obj.func(_obj)
  }
  this.update_dungeon_blocks(true)
}

if (e.motion) {
  for (var index in e.motion) {
    index = parseInt(index)
    var motion = e.motion[index]
    if (index == 0) {
      if (!(motion instanceof Array))
        motion = [motion]
      var motion_name0 = motion[0].name
      var loop = motion[0].loop
      if (motion_name0 && ((this.motion[motion_name0] && this.motion[motion_name0].name) || MMD_SA_options.motion_index_by_name[motion_name0])) {
var motion_list = motion.map(function (m, idx) {
  var motion_name = motion[idx].name
  return MMD_SA_options.motion_index_by_name[(that.motion[motion_name] && that.motion[motion_name].name) || motion_name];
});
if (loop) {
  MMD_SA_options.motion_shuffle_list_default = motion_list
}
else {
//        MMD_SA_options.motion_shuffle_list_default = [MMD_SA_options.motion_index_by_name[motion_id]]
// use ._motion_shuffle_list instead, because we have multiple motions running in order, but .motion_shuffle_list_default can be shuffled.
  MMD_SA_options._motion_shuffle_list = motion_list
  MMD_SA_options.motion_shuffle_list_default = null
}
      }
      else {
        MMD_SA_options.motion_shuffle_list_default = MMD_SA_options._motion_shuffle_list_default.slice()
      }
      MMD_SA._force_motion_shuffle = true
    }
    else {
      var model_para = MMD_SA_options.model_para_obj_all[index]
      if (model_para)
        model_para._motion_name_next = (motion.name && ((this.motion[motion.name] && this.motion[motion.name].name) || motion.name)) || model_para.motion_name_default
//DEBUG_show(index+":"+motion.name+"/"+model_para._motion_name_next,0,1)
    }
  }
}

if ((e.object_motion_paused != null) && (obj && obj.motion)) {
  obj.motion.paused = e.object_motion_paused
}

if (e.inventory) {
  var inv = e.inventory
  if (!this.inventory.add(inv.item_id, inv.stock)) {
    MMD_SA.SpeechBubble.message(3, "Your inventory is full.", 0)
    this._states.dialogue_mode = true
    if (inv.onfailure) {
      inv.onfailure(e)
    }
    else {
      this.event_flag[this._event_active.id] = 0
      this._event_active.index = 999
    }
    return
  }

  if (inv.onsuccess) {
    inv.onsuccess(e)
  }
  else {
    MMD_SA.SpeechBubble.message(3, 'You found "' + this.item_base[inv.item_id].info_short + '" x' + inv.stock + '.', 0)
    var bi = ++this.event_flag[this._event_active.id]
    if (!this.events[this._event_active.id][bi])
      this.events[this._event_active.id][bi] = [{ message:{ bubble_index:3, content:"You found nothing." } }]
    this._event_active.index = 999
    this._states.dialogue_mode = true
  }
}

if (e.mount) {
  if (e.mount.target) {
    let id = this.object_id_translated[e.mount.target] || e.mount.target
    if (/^object(\d+)_(\d+)$/.test(id)) {
      e.mount.target = this.object_base_list[parseInt(RegExp.$1)].object_list[parseInt(RegExp.$2)]
    }
  }
  else
    e.mount.target = obj
  c.mount(e.mount)
}
if (e.dismount) {
  c.dismount()
}

if (e.sound) {
  var sound = e.sound
  var obj_parent
  if (sound.object_parent == "PC") {
    obj_parent = c._obj
  }
  var player_obj
  switch (sound.action) {
    case "play":
      player_obj = this.sound.audio_object_by_name[sound.name].play(obj_parent, sound.spawn_id)
      break
    case "pause":
      player_obj = this.sound.audio_object_by_name[sound.name].get_player_obj(obj_parent, sound.spawn_id)
      if (player_obj)
        player_obj.player.pause()
      break
  }
  if (player_obj) {
    if (sound.volume)
      player_obj.player.volume = sound.volume
  }
}

// backward compatibility
if (e.combat_mode) {
//  c.combat_mode = e.combat_mode
  e.combat = {
    enabled:true
  };
  delete e.combat_mode
}

if (e.combat) {
  if (e.combat.enabled != null) {
//if (e.combat.enabled) DEBUG_show((e.combat.ended_timestamp||0) + "/" + (Date.now() + e.combat.cooling_time),0,1)
    if ((e.combat.enabled != c.combat_mode) && (!e.combat.enabled || !e.combat.cooling_time || !e.combat.ended_timestamp || (Date.now() > e.combat.ended_timestamp+e.combat.cooling_time*1000))) {
      if (e.combat.enabled) {
        this._states.combat = new Combat(e.combat)
      }
      if (e.combat.onstatechange) {
        event_main.call(this, e.combat.onstatechange)
      }
      c.combat_mode = e.combat.enabled
    }
    else {
      event_main.call(this, e.combat.onstateunchange || { ended:true })
    }
  }
}

if (e.camera_focus) {
// for TPS camera
  MMD_SA.reset_camera(true)

  c.rot.y = Math.PI/2 - Math.atan2((e.camera_focus.z-c.pos.z), (e.camera_focus.x-c.pos.x))
  THREE.MMD.getModels()[0].mesh.quaternion.setFromEuler(c.rot)
  c.about_turn = false
  MMD_SA.reset_camera(true)
}

if (e.statement) {
  statement.call(this, e.statement)
}

if (e.set_event_flag) {
  if (e.set_event_flag.area_id && (e.set_event_flag.area_id != this.area_id)) {
    var _saved = MMD_SA_options.Dungeon_options.options_by_area_id[e.set_event_flag.area_id]._saved
    _saved.event_flag = _saved.event_flag || {}
    _saved.event_flag[e.set_event_flag.id||this._event_active.id] = e.set_event_flag.branch_index
  }
  else
    this.event_flag[e.set_event_flag.id||this._event_active.id] = e.set_event_flag.branch_index
}

if (e.load_area) {
  this.restart(e.load_area.id, ((e.load_area.refresh_state != null) ? e.load_area.refresh_state : 2))
}

if (e.goto_branch != null) {
  this.run_event(null, e.goto_branch, 0)
}

if (e.goto_event) {
  this.run_event(e.goto_event.id, e.goto_event.branch_index, e.goto_event.step||e.goto_event.event_index||0)
}

// backward compatibility
if (e.next_event) {
  e.next_step = e.next_event
  delete e.next_event
}
if (e.next_step) {
  if (e.next_step.delay != null)
    setTimeout(function () { MMD_SA_options.Dungeon.run_event() }, e.next_step.delay*1000)
  else
    this.run_event()
}

if (e.ended) {
  if ((typeof e.ended == 'string') && (e.ended != this._event_active.id)) return;

  document.getElementById('SB_tooltip').style.visibility = 'hidden';
//  MMD_SA_options.Dungeon.inventory._item_updated?.update_info(null, true);

  const sb_index = e.sb_index || 0;
  if (sb_index == 0) {
    MMD_SA.SpeechBubble.list.forEach(sb=>{
      if (sb.visible && !sb.msg_timerID)
        sb.hide();
    });

    if (this._event_active._NPC_turns_back)
      this._event_active._NPC_turns_back.npc.quaternion.copy(this._event_active._NPC_turns_back.quat)

    this._states.event_mode = this._states.dialogue_mode = this.dialogue_branch_mode = false
    this._event_active = {}

    MMD_SA._mouse_pos_3D = []
    MMD_SA_options.model_para_obj_all[0].look_at_character = null
    MMD_SA_options.model_para_obj_all[0].look_at_target = null

    MMD_SA.reset_camera()
  }
  else {
    const sb = MMD_SA.SpeechBubble.list[sb_index];
    if (sb.visible && !sb.msg_timerID)
      sb.hide();
  }
}
    }

    return function (event_id, branch_index, event_index) {
if (!event_id)
  event_id = this._event_active.id
else if (Array.isArray(event_id)) {
  this.events["_ONETIME_"] = event_id
  event_id = "_ONETIME_"
  if (branch_index == null)
    branch_index = 0
  if (event_index == null)
    event_index = 0
}
else if (event_id instanceof Object) {
  event_main.call(this, event_id)
  return
}

var events = this.events[event_id]
if (!events) {
  if (/^(.+)\_\d+$/.test(event_id)) {
    event_id_parent = RegExp.$1
    events = this.events[event_id_parent]
    if (events) {
      events = this.events[event_id] = Object.clone(events)
    }
    else
      return
  }
  else
    return
}

if (branch_index == null)
  branch_index = this.event_flag[event_id]
var e_branch = events[branch_index]
if (!e_branch) {
  branch_index = 0
  e_branch = events[0]
}

if (event_index == null)
  event_index = this._event_active.index || 0
//DEBUG_show([event_id, branch_index, event_index],0,1)

this._event_active.id     = event_id
this.event_flag[event_id] = branch_index
this._event_active.index  = event_index+1

var e = e_branch[event_index] || { ended:true }
this._states.event_mode = true
event_main.call(this, e)
    };
  })()
// events END


 ,SFX_check: (function () {
    var footstep_sound_default = { name:"footstep_default" };

    return function (model, para_SA, animation, dt) {
if (!para_SA.SFX)
  return

var that = this

var frame0 = animation.time
var frame1 = frame0 + dt
frame0 *= 30
frame1 *= 30

para_SA.SFX.some(function (obj) {
//DEBUG_show([frame0, frame1, Date.now()].join("\n"))
  if (!((obj.frame > frame0) && (obj.frame <= frame1)))
    return false

  if (obj.condition && !obj.condition(model, para_SA, animation, dt))
    return false

  var model_para = MMD_SA_options.model_para_obj_all[model._model_index]

  var sound = obj.sound
  if (sound) {
    let name = sound.name
    if (!name) {
      let x = ~~(model.mesh.position.x / that.grid_size)
      let y = ~~(model.mesh.position.z / that.grid_size)
      let footstep_sound = that.get_para(x,y,true).footstep_sound || model_para.footstep_sound || footstep_sound_default
      name = footstep_sound && footstep_sound.name
    }
    if (name)
      that.sound.audio_object_by_name[name].play(model.mesh, true)
  }

  return true
});
    };
  })()


 ,get sound() { return MMD_SA.Audio3D; }

 ,get sprite() { return MMD_SA.Sprite; }


 ,multiplayer: (function () {
    var enabled;

    var net = System._browser.P2P_network
    var d_options = MMD_SA_options.Dungeon_options

    if (self.ChatboxAT && !Chatbox_intro_msg) {
      Chatbox_intro_msg =
  '<p>Anime Theme World Online 3D - Chatbox Mini (' + ChatboxAT.Chatbox_version + ')</p>\n'
+ '<p>New comer? <a href="readme_multiplayer.txt" target="_blank" class=AutoChatCommand>Click here</a> to know more about this game.</p>\n'
+ '<p>Not a member? <a href="http://www.animetheme.com/cgi-bin/ikonboard/register.cgi" target="_blank" class=AutoChatCommand>Register now!</a></p>';
    }

    var online_data_cache_default = { data:{ OPC:{} } };
    var online_data_cache = Object.clone(online_data_cache_default);

    var PC_data = {
  game: {
    chapter_id: ""
   ,area_id: ""
  }
 ,motion: {
    name: ""
   ,changed: false
   ,time: 0
   ,playbackRate: 1
  }
 ,model: {
    position: []
   ,quaternion: []
  }
    };

    var _init_func;
    var peer_para_default = {
  events: {
    peer: {
      open: function (peer) {
ChatboxAT.smallMsg("(P2P network: Peer initialized successfully)")

if (parent.System._browser.url_search_params.host_peer_id) {
  MMD_SA_options.Dungeon.multiplayer.connect(parent.System._browser.url_search_params.host_peer_id, { onconnect:_init_func, onerror:_init_func })
}
else {
  _init_func()
}
      }
     ,error: function (peer, err) {
ChatboxAT.smallMsg("(P2P network: Peer error / " + (err.type) + ")")
      }
    }
   ,connection: {
      handshake_request: function (peer, connection) {
console.log("P2P_network: Remote Peer" + "(" + connection.peer + "/" + connection.label + "/host) responding handshake request from Peer-" + peer.index + "(" + peer.id + ")")
ChatboxAT.smallMsg("(P2P network: Connecting to host...)")
connection.send({ handshake:{ request:true, para:{ game_id:d_options.game_id, game_version:d_options.game_version, chapter_id:d_options.chapter_id } } })
      }
     ,handshake_respond: function (peer, connection, handshake) {
var mp = MMD_SA_options.Dungeon.multiplayer
if (handshake.request) {
// accept or reject
  var console_msg_rejected = "P2P_network: Remote Peer" + "(" + connection.peer + "/" + connection.label + "/host) rejected handshake request from Peer-" + peer.index + "(" + peer.id + ")"

  if (!handshake.para || (d_options.game_id != handshake.para.game_id) || (d_options.game_version != handshake.para.game_version) || (d_options.chapter_id != handshake.para.chapter_id)) {
    console.log(console_msg_rejected+'/'+"incompatible game", handshake.para)
    connection.send({ handshake:{ rejected:true, para:{ msg:"incompatible game" } } })
    connection.close(peer)
    return
  }

  if (mp.is_client) {
    console.log(console_msg_rejected+'/'+"not host", handshake.para)
    connection.send({ handshake:{ rejected:true, para:{ msg:"not host" } } })
    connection.close(peer)
    return
  }

  var connection_count = peer.connections.length
  var connection_max = d_options.multiplayer.OPC_list.length
  if (connection_count > connection_max) {
    console.log(console_msg_rejected+'/'+"host full", handshake.para)
    connection.send({ handshake:{ rejected:true, para:{ msg:"host full" } } })
    connection.close(peer)
    return
  }

  mp.is_host = true

  mp.online = true
  connection.status = "connected"
  console.log("P2P_network: Remote Peer" + "(" + connection.peer + "/" + connection.label + "/client)'s handshake request accepted from Peer-" + peer.index + "(" + peer.id + ")")

  var OPC_index_used = {}
  for (var id in peer.connections) {
    var connection = peer.connections[id]
    if (connection._para && connection._para.OPC_index)
      OPC_index_used[connection._para.OPC_index] = true
  }
  var OPC_index
  for (var i = 1; i < connection_max+1; i++) {
    if (!OPC_index_used[i]) {
      OPC_index = i
      break
    }
  }

  connection._para = { OPC_index:OPC_index }
  var para = {
    OPC_index:OPC_index
  };
  connection.send({ handshake:{ accepted:true, para:para } })

//  ChatboxAT.smallMsg("(P2P network: Remote Peer" + "(" + (handshake.para.name || (connection.peer + "/" + connection.label)) + ") connected (" + (connection_count+1) + "/" + (connection_max+1) + ")")
  var msg = "Player-" + (OPC_index+1) + " has joined the game (" + (connection_count+1) + "/" + (connection_max+1) + ")."
  ChatboxAT.smallMsg(msg)
  online_data_cache.data.msg_out = (online_data_cache.data.msg_out || []).concat(['<p class=Msg_Default>' + msg + '</p>'])
}
else if (handshake.accepted) {
  mp.is_client = true

  mp.online = true
  connection.status = "connected"
  console.log("P2P_network: Remote Peer" + "(" + connection.peer + "/" + connection.label + "/host) accepted handshake request from Peer-" + peer.index + "(" + peer.id + ")")
// resolve() from Peer.connect's Promise
  if (peer.para.events.connection.handshake_request_accecpted && peer.para.events.connection.handshake_request_accecpted[connection.label]) {
    peer.para.events.connection.handshake_request_accecpted[connection.label]({peer, connection, handshake})
    delete peer.para.events.connection.handshake_request_accecpted[connection.label]
  }
}
else {
  console.log("P2P_network: Remote Peer" + "(" + connection.peer + "/" + connection.label + "/host) rejected handshake request from Peer-" + peer.index + "(" + peer.id + ")")
// reject() from Peer.connect's Promise
  if (peer.para.events.connection.handshake_request_rejected && peer.para.events.connection.handshake_request_rejected[connection.label]) {
    let return_value = peer.para.events.connection.handshake_request_rejected[connection.label]({peer, connection, handshake})
    delete peer.para.events.connection.handshake_request_rejected[connection.label]
    if (return_value)
      return
  }
  connection.close(peer)
}
      }
     ,data: (function () {
        var send_data_timestamp = 0;
        return function (peer, connection, data) {
if (!data.data)
  return

var time = Date.now()

if (data.data.msg) {
  online_data_cache.data.msg = (online_data_cache.data.msg || []).concat(data.data.msg)
}

var OPC_data_all = data.data.OPC
if (OPC_data_all) {
  var OPC_data_cache = online_data_cache.data.OPC

  Object.keys(OPC_data_all).forEach(function (index) {
    var OPC_data = OPC_data_all[index]
    var cache = OPC_data_cache[index]
// ignore "dummy" data if cache exists
    if (!OPC_data.game && cache)
      delete OPC_data_all[index]
    else {
// motion.changed is reset if only it has been processed
      if (OPC_data.motion && cache && cache.motion && cache.motion.changed)
        OPC_data.motion.changed = true
    }
  });
  Object.append(OPC_data_cache, OPC_data_all)
}

// to counter background throttling, by utilizing the network events from other peers as "timer" (i.e. events of connection.send())
if (document.hidden) {
  if (time > send_data_timestamp + 1000/30) {
    MMD_SA_options.Dungeon.multiplayer.process_remote_online_data()
    MMD_SA_options.Dungeon.multiplayer.update_online_data()
    send_data_timestamp = time
  }
}
        };
      })()
     ,close: function (peer, connection) {
var mp = MMD_SA_options.Dungeon.multiplayer
if (connection._para) {
  if (connection._para.OPC_index != null) {
    var msg = "Player-" + (connection._para.OPC_index+1) + " has left the game."
    ChatboxAT.smallMsg(msg)
    online_data_cache.data.msg_out = (online_data_cache.data.msg_out || []).concat(['<p class=Msg_Default>' + msg + '</p>'])
    delete online_data_cache.data.OPC[connection._para.OPC_index]
  }
}
if (peer.connections.length <= 1) {
// clear OPC
  online_data_cache = Object.clone(online_data_cache_default)
  mp.process_remote_online_data()

  mp.online = false
  mp.is_host = false
  mp.is_client = false

  console.log("(No connected player)")
  ChatboxAT.smallMsg("(No connected player)")
}
      }
    }
   ,send_message: (function () {
      var host_command_timestamp = 0;
      var host_command_timerID;
      return function (para) {
/*
return
- "": send no message
- null: send original message
- custom: send customized message
*/
var mp = MMD_SA_options.Dungeon.multiplayer
if (!para.command) {
  if (para.id && para.pass)
    return null

  var name = para.name
  if (!mp.online) {
    name += "(offline)"
  }
  else {
    name += "(PC-" + (mp.OPC_index[0]+1) + ")"
  }

  var msg = name + ": " + para.msg
  if (!mp.online || mp.is_host)
    ChatboxAT.ChatShow([msg])
  if (mp.online)
    online_data_cache.data.msg_out = (online_data_cache.data.msg_out || []).concat([msg])
}
else {
  var peer = net.peer_default
  switch (para.command) {
    case "host":
      if (mp.is_client) {
        ChatboxAT.smallMsg("You cannot host a game in client mode.")
        break
      }

      var time = Date.now()
      if (time < host_command_timestamp + 30*1000) {
        ChatboxAT.smallMsg("No repeated host command in " + Math.round(30 - (time - host_command_timestamp) / 1000) + " second(s)")
        break
      }
      host_command_timestamp = time

      mp.is_host = true

      if (!para.para1) {
        if (!ChatboxAT.Chatbox_online_mode()) {
          try {
            setTimeout(function () {
Fchat_msg.value = peer.id
Fchat_msg.select()
document.execCommand("copy")
            }, 100);
          }
          catch (err) {}
        }

        if (host_command_timerID) clearInterval(host_command_timerID);
        host_command_timerID = setInterval(function () {
ChatboxAT.SendData_ChatSend([System._browser.P2P_network.process_message('/host auto', true)])
// every 3 minutes
        }, 3*60*1000);
      }
      else {
// auto update
      }

//($game_id, $game_path, $connection_count, $connection_max)
      var path_local = Settings.f_path
      if (path_local.indexOf(System.Gadget.path) == 0)
        path_local = path_local.substring(System.Gadget.path.length).replace(/\\/g, "/").replace(/^\/+/, "/")
      return "/host [" + peer.id + "] " + encodeURIComponent([d_options.game_id+"/v"+(d_options.game_version), path_local, peer.connections.length, d_options.multiplayer.OPC_list.length].join("|"))
    case "connect":
      if (!para.para1)
        ChatboxAT.smallMsg("No host peer ID specified")
      else
        mp.connect(para.para1)
      break
    default:
      return null
  }
}

return ""
      };
    })()
  }
    };

    var v3a, q1

    return {
  online: false

 ,get online_data_cache() { return online_data_cache; }

 ,init: function (init_func) {
if (!SA_project_JSON || !SA_project_JSON.P2P_network)
  delete d_options.multiplayer

var enabled = !!d_options.multiplayer
if (!enabled) {
  init_func()
  return 
}

System._browser.on_animation_update.add(function () {
  MMD_SA_options.Dungeon.multiplayer.process_remote_online_data()
},0,0, -1);

System._browser.on_animation_update.add(function () {
  MMD_SA_options.Dungeon.multiplayer.update_online_data()
},0,1, -1);

for (var i = 0, i_max = d_options.multiplayer.OPC_list.length; i <= i_max; i++)
  this.OPC_index[i] = i

this.OPC_index.forEach(function (idx) {
  var model_para = MMD_SA_options.model_para_obj_all[(idx == 0) ? 0 : idx-1 + d_options.multiplayer.OPC_index0]
  model_para.OPC_index = idx
  if (idx > 0) {
    model_para.look_at_character = null
    model_para.look_at_target = null
    model_para.look_at_screen = false
  }
});

//MMD_SA_options.look_at_screen = false
//MMD_SA_options.look_at_mouse = false

window.addEventListener("jThree_ready", function () {
v3a = new THREE.Vector3()
q1 = new THREE.Quaternion()

// temp
//MMD_SA_options.Dungeon.multiplayer.online = true
//MMD_SA_options.Dungeon.multiplayer.arrange_OPC([1,0])
});

_init_func = init_func

if (net.status != "off") {
  init_func()
  return
}

ChatboxAT.smallMsg("(P2P network: Initializing peer...)")
new net.peer(peer_para_default)
  }

 ,connect: function (peer_id, para_connect={}) {
if (!net.peer_default) {
  ChatboxAT.smallMsg("(P2P network: Peer not initialized yet)")
  return
}
if (net.peer_default.status == "connecting") {
  ChatboxAT.smallMsg("(P2P network: Still connecting)")
  return
}
if (this.is_host) {
  ChatboxAT.smallMsg("You cannot join another game in host mode.")
  return
}
if (net.peer_default.connections.length) {
  ChatboxAT.smallMsg("You have joined a game already.")
  return
}

var that = this
net.peer_default.connect(peer_id).then(function (para) {
// peer, connection, handshake
  var peer = para.peer
  var connection = para.connection
  var handshake = para.handshake

  var list = [handshake.para.OPC_index]
  for (var i = 1, i_max = d_options.multiplayer.OPC_list.length; i <= i_max; i++) {
    list.push((handshake.para.OPC_index == i) ? 0 : i)
  }
  that.arrange_OPC(list)
//console.log(list)
  ChatboxAT.smallMsg("(P2P network: Host connected / Player " + (handshake.para.OPC_index+1) + "/" + (d_options.multiplayer.OPC_list.length+1) + ")")

  net.peer_default.status = "connected"
  para_connect.onconnect && para_connect.onconnect(para)
//}).catch(function () {
}).catch(function (err) {
//  if (err && err.type)
  ChatboxAT.smallMsg("(P2P network: Remote connection failed, check console for details)")

  net.peer_default.status = "connected"
  para_connect.onerror && para_connect.onerror()
});

// to prevent simultaneous connection attempts
net.peer_default.status = "connecting"
  }

 ,OPC_index: []
 ,arrange_OPC: function (list) {
var that = this

var path_list = [MMD_SA_options.model_path].concat(MMD_SA_options.model_path_extra)
var swapped_index = []
list.forEach(function (OPC_index, idx) {
  var c_index_OLD = (idx == 0) ? 0 : idx-1 + d_options.multiplayer.OPC_index0
  if (swapped_index[c_index_OLD])
    return
  swapped_index[c_index_OLD] = true

  var c_index_NEW = (OPC_index == 0) ? 0 : OPC_index-1 + d_options.multiplayer.OPC_index0
  if (swapped_index[c_index_NEW])
    return
  swapped_index[c_index_NEW] = true

  var model_para_obj_OLD = MMD_SA_options.model_para_obj_all[c_index_OLD]
  var model_para_obj_NEW = MMD_SA_options.model_para_obj_all[c_index_NEW]
  MMD_SA_options.model_para_obj_all[c_index_OLD] = model_para_obj_NEW
  MMD_SA_options.model_para_obj_all[c_index_NEW] = model_para_obj_OLD
  model_para_obj_OLD._model_index = c_index_NEW
  model_para_obj_NEW._model_index = c_index_OLD
  if (c_index_OLD == 0) {
    MMD_SA_options.model_para_obj = model_para_obj_NEW
    MMD_SA_options.model_para_obj.is_OPC = false
    if (!MMD_SA_options.MME.PostProcessingEffects)
      MMD_SA_options.MME.PostProcessingEffects = (model_para_obj_OLD.MME && model_para_obj_OLD.MME.PostProcessingEffects) || MMD_SA_options._MME.PostProcessingEffects
    model_para_obj_OLD.is_OPC = true
    model_para_obj_OLD.is_PC_candidate = true
  }
  else {
    model_para_obj_NEW.is_OPC = true
    model_para_obj_NEW.is_PC_candidate = true
  }

  var path_OLD = path_list[c_index_OLD]
  var path_NEW = path_list[c_index_NEW]
  path_list[c_index_OLD] = path_NEW
  path_list[c_index_NEW] = path_OLD
});

list.forEach(function (OPC_index, idx) {
  var model_para = MMD_SA_options.model_para_obj_all[(idx == 0) ? 0 : idx-1 + d_options.multiplayer.OPC_index0]
  model_para.OPC_index = idx
  model_para.look_at_screen = (idx == 0) ? null : false
});

var clone_list = {}
path_list.forEach(function (path) {
  var filename = path.replace(/^.+[\/\\]/, "").replace(/\.pmx$/i, "")
  var clone_index = 0
  if (/^(.+)\#clone(\d+)/.test(filename)) {
    filename = RegExp.$1
    clone_index = RegExp.$2
  }
  var path_obj = path_list[filename] = path_list[filename] || { clone_max:0 }
  path_obj.clone_max = Math.max(clone_index, path_obj.clone_max)
});
path_list.forEach(function (path, idx) {
  var filename = path.replace(/^.+[\/\\]/, "").replace(/\.pmx$/i, "")
  var clone_index = 0
  if (/^(.+)\#clone(\d+)/.test(filename)) {
    filename = RegExp.$1
    clone_index = RegExp.$2
  }
  var path_obj = path_list[filename]
  if (path_obj.clone_max) {
    if (!path_obj._index)
      path = path.replace(/\#clone(\d+)/, "")
    else
      path = path.replace(/\#clone(\d+)/, "").replace(/\.pmx$/i, "") + "#clone" + path_obj._index + ".pmx"
    path_obj._index = (path_obj._index||0) + 1
  }
  path_list[idx] = path
});

MMD_SA_options.model_path = path_list[0]
MMD_SA_options.model_path_extra = path_list.slice(1)

this.OPC_index = list
  }

 ,update_online_data: (function () {
    var last_updated = 0

    return function () {
var d = MMD_SA_options.Dungeon
if (!this.online)
  return

var time = Date.now()
//30fps
if (time - last_updated < 1000/30) return
last_updated = time

if (d.started) {
  var mm = MMD_SA.MMD.motionManager
  var model = THREE.MMD.getModels()[0]
  var model_para = MMD_SA_options.model_para_obj
  var mesh = model.mesh

  PC_data.game.chapter_id = d.chapter_id
  PC_data.game.area_id = d.area_id

  PC_data.motion.changed = (PC_data.motion.name != mm.filename) || (mm.para_SA.BPM && (Math.abs(PC_data.motion.time - model.skin.time) > 1))// || ((model_para._playbackRate_OPC_ || 1) != PC_data.motion.playbackRate)
  PC_data.motion.time = model.skin.time
  PC_data.motion.name = mm.filename
  PC_data.motion.playbackRate = model_para._playbackRate_OPC_ || 1

  PC_data.model.position = mesh.position.toArray()
  PC_data.model.quaternion = mesh.quaternion.toArray()
}

this.send_online_data()
    };
  })()

 ,send_online_data: function () {
var d = MMD_SA_options.Dungeon
if (!this.online)
  return

// inline version of online_data_cache_default (faster)
var online_data = { data:{ OPC:{} } };//Object.clone(online_data_cache_default)

var need_update
if (online_data_cache.data.msg_out) {
  need_update = true
  online_data.data.msg = online_data_cache.data.msg_out
  delete online_data_cache.data.msg_out
}

if (d.started) {
  need_update = true
  online_data.data.OPC[this.OPC_index[0]] = PC_data;

  var OPC_data_cache = online_data_cache.data.OPC
  if (this.is_host) {
    for (var index in OPC_data_cache) {
      var OPC_data = OPC_data_cache[index]
      online_data.data.OPC[index] = Object.assign({}, OPC_data)
    }
  }
  for (var index in OPC_data_cache) {
    var OPC_data = OPC_data_cache[index]
// sent cache can be safely cleared after processed
    OPC_data._sent = true
  }
}

// send dummy data even when there is no update, to counter background throttling, by providing the network events as "timer" for peers in background (i.e. events of connection.send())
//if (!need_update) return

for (var id in net.peer_default.connections) {
  var c = net.peer_default.connections[id]
  c.send(online_data)
}

// temp (simulate the event when online data is received from remote
/*
online_data.data.OPC[0] = online_data.data.OPC[1]
delete online_data.data.OPC[1]
System._browser.on_animation_update.add(function () {
  MMD_SA_options.Dungeon.multiplayer.process_remote_online_data(online_data)
},0,0);
*/
  }

 ,process_remote_online_data: function (online_data) {
var d = MMD_SA_options.Dungeon
if (!this.online)
  return

var that = this

if (!online_data)
  online_data = online_data_cache

if (online_data.data.msg) {
  ChatboxAT.ChatShow(online_data.data.msg)
  if (this.is_host)
    online_data_cache.data.msg_out = (online_data_cache.data.msg_out || []).concat(online_data_cache.data.msg)
  delete online_data.data.msg
}

var OPC_data_all = online_data.data.OPC
this.OPC_index.forEach(function (OPC_index, idx) {
// ignore index for PC
  if (OPC_index == 0)
    return
  OPC_index--

  var id, obj_base_index, obj_base, character_index, _obj
  if (d.started) {
    id = d.object_id_translated["OPC-"+OPC_index]
    if (/^object(\d+)_(\d+)$/.test(id)) {
      obj_base_index = parseInt(RegExp.$1)
      obj_base = d.object_base_list[obj_base_index]
      character_index = obj_base.character_index
      _obj = obj_base.object_list[parseInt(RegExp.$2)]
    }
  }

  var OPC_data = OPC_data_all[idx]
// offline/unused OPC
  if (!OPC_data) {
    if (_obj) {
      _obj._obj_proxy.hidden = true
      _obj._obj_proxy.visible = false
    }
    return
  }

// no update
  if (!OPC_data.game)
    return

// game not started yet
  if (!_obj || !d.started)
    return

// not in the same chapter/area
  if ((OPC_data.game.chapter_id != d.chapter_id) || (OPC_data.game.area_id != d.area_id)) {
    _obj._obj_proxy.hidden = true
    _obj._obj_proxy.visible = false
    return
  }

// Set .visible to true if model is current hidden. Otherwise, let the game decide whether the model should be shown (by view distance, etc).
  var reset_visible = _obj._obj_proxy.hidden
  _obj._obj_proxy.hidden = false
  if (reset_visible)
    _obj._obj_proxy.visible = true

  var npc_model = THREE.MMD.getModels()[character_index]
// use _obj._obj because it works with ._obj_proxy
  var mesh = _obj._obj//npc_model.mesh

  if (OPC_data.motion) {
    var npc_motion = MMD_SA.motion[npc_model.skin._motion_index]
    var model_para = MMD_SA_options.model_para_obj_all[character_index]
    if (OPC_data.motion.changed/* || (npc_motion.filename != OPC_data.motion.name)*/) {
      var npc_motion_para = MMD_SA.motion[npc_model.skin._motion_index].para_SA
      model_para._motion_name_next = OPC_data.motion.name
      model_para._firstFrame_ = OPC_data.motion.time*30
//DEBUG_show(Date.now())
    }
    model_para._playbackRate_OPC_ = OPC_data.motion.playbackRate
  }

  if (OPC_data.model) {
    mesh.position.fromArray(OPC_data.model.position)
// temp
//mesh.position.x+=10
    mesh.quaternion.fromArray(OPC_data.model.quaternion)
//DEBUG_show(Date.now())
  }

// cache can be safely reset if it has been sent
  if (OPC_data._sent)
    OPC_data_all[idx] = {}
});
  }
    };
  })()


 ,blob_url: (function () {
    var cache = {}

    return {
  set: function (url) {
System._browser.load_file(url, function (xhr) {
  cache[url.replace(/^.+[\/\\]/, "")] = URL.createObjectURL(xhr.response)
});
  }

 ,get: function (name) {
return cache[name]
  }
    };
  })()

 ,seed_base: Date.now()
 ,generate_seed: function (str_list) {
var d_options = MMD_SA_options.Dungeon_options
if (!str_list) {
  str_list = [d_options.game_id, d_options.game_version, d_options.chapter_id, this.area_id]
}

var _this = str_list.join("|") + "|" + this.seed_base + "|" + Math.random()
//https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript
var hash = 0, i, chr;
if (_this.length === 0) return hash;
for (i = 0; i < _this.length; i++) {
  chr   = _this.charCodeAt(i);
  hash  = ((hash << 5) - hash) + chr;
  hash |= 0; // Convert to 32bit integer
}
//_random_seed
console.log("seed", _this, hash)
return hash;
  }

 ,utils: {

    create_combat_character: function (object_index, para) {
if (!para)
  para = {}

var d = MMD_SA_options.Dungeon

var combat = {
  combat_seed: para.combat_seed || 4
 ,parry_level: para.parry_level || 3

 ,action_check: (function () {
    var combat_action = para.combat_action || [
  "PC combat attack 01"
 ,"PC combat attack 02"
 ,"PC combat attack 03"
 ,"PC combat attack 04"
 ,"PC combat attack 05"
 ,"PC combat attack 06"
 ,"PC combat attack 07"
 ,"PC combat attack 08"
 ,"PC combat attack 09"
 ,"PC combat attack 10"
 ,"PC combat attack 11"
 ,"PC combat attack 12"
 ,"PC combat attack 13"
 ,"PC combat attack 14"
 ,"PC combat attack 15"
 ,"PC combat attack 16"
 ,"PC combat attack 17"
 ,"PC combat attack 18"
 ,"PC combat attack 19"
    ];

    return function (attacker) {
var action_obj = {}
var seed_max = (d._combat_seed_ != null) ? d._combat_seed_ : Math.max(combat.combat_seed, 2)
var seed = random(seed_max)

var dis = attacker._obj.position.distanceTo(d.character.pos)

if (0&& (seed_max > 2) && (seed == seed_max-1) && (dis < 48)) {
  action_obj.motion_id = combat_action[random(combat_action.length)]//"PC combat attack 12"//
}
else if ((seed % 2 == 0) && (dis < 64)) {
  action_obj.type = "STAY"
}
else {
  action_obj.type = "MOVE"
}
//action_obj = { type:"MOVE" }
return action_obj
    };
  })()

 ,parry_check: function (def, atk_para) {
var t = Date.now()

if (!def._parry_mod_)
  def._parry_mod_ = {}
var p = def._parry_mod_[atk_para.motion_id]
if (!p)
  p = def._parry_mod_[atk_para.motion_id] = { lvl:0, time:t }

p.lvl = Math.max(p.lvl - (t - p.time)/(1000*30), 0)
p.time = t

var combat_para = atk_para.para[atk_para.index]
var hit_level = combat_para.hit_level || 1
p.lvl = Math.min(p.lvl + hit_level/(10), 3)
//console.log(def)
//DEBUG_show(atk_para.motion_id+'/'+p.lvl)

return Math.floor(Math.random() * (((d._parry_level_ != null) ? d._parry_level_ : combat.parry_level) || 1) + p.lvl)
  }
};

var obj = {
  placement: {
    can_overlap: true
   ,hidden: true
  }
 ,no_camera_collision: true
 ,view_distance: 999

 ,mass: para.mass || 1
 ,hp: para.hp || 100
 ,combat: combat
 ,animate: "combat_default"
};

if (typeof object_index == 'number')
  obj.object_index = object_index
else
  obj.object_id = object_index

if (para.p_to_assign) {
  obj = Object.assign(obj, para.p_to_assign)
}

return obj;
    }

   ,create_combat_event: (function () {
      var ray, box3, dir_v3, origin_v3, v3a, v3b, v3c;
      var center_rot_y = [0, 45, -45, 90, -90, 135, -135, 180].map(function (ry) { return ry/180*Math.PI; });
      window.addEventListener("MMDStarted", function () {
ray = new THREE.Ray()
box3 = new THREE.Box3()
dir_v3 = new THREE.Vector3()
origin_v3 = new THREE.Vector3()
v3a = new THREE.Vector3()
v3b = new THREE.Vector3()
v3c = new THREE.Vector3()
      });

      return function (x, y, para) {
if (!para.grid_id_excluded)
  para.grid_id_excluded = []
para.grid_id_excluded.push(1)

var d = MMD_SA_options.Dungeon
var d_options = d.RDG_options

var c_grid_id = d.grid_array[y][x]
//if (c_grid_id != 3) return null

function condition(x,y) {
  return ((para.zone_condition) ? para.zone_condition(x,y) : (d.grid_array_free[y][x] && (para.grid_id_excluded.indexOf(d.grid_array[y][x]) == -1)))
}

//.grid_array[y][x]
//.grid_array_free[y][x]
if (d.character.combat_mode || d._check_points || d.event_mode) {
//console.log(999)
  return null
}

if (!condition(x,y))
  return null

var dis_min = (para.dis_min != null) ? para.dis_min : 1

// move along the x/y-axis, and find the min/max x/y from the starting point with no obstacle along the paths
var min_y
for (var i = y, i_min = Math.max(0, y-(para.dis_max||3)); i >= i_min; i--) {
  if (condition(x,i))
    min_y = i
  else
    break
}

var max_y
for (var i = y, i_max = Math.min(d_options.height-1, y+(para.dis_max||3)); i <= i_max; i++) {
  if (condition(x,i))
    max_y = i
  else
    break
}

if (max_y - min_y < dis_min)
  return null

var min_x
for (var i = x, i_min = Math.max(0, x-(para.dis_max||3)); i >= i_min; i--) {
  if (condition(i,y))
    min_x = i
  else
    break
}

var max_x
for (var i = x, i_max = Math.min(d_options.width-1, x+(para.dis_max||3)); i <= i_max; i++) {
  if (condition(i,y))
    max_x = i
  else
    break
}

if (max_x - min_x < dis_min)
  return null

var box = { area:0, center_factor:0, min:{}, max:{} }
// move along the y-axis, from starting point to min_y (top side)
for (var y0 = y; y0 >= min_y; y0--) {
// find the min/max x for each y0
  var min_x0
  for (var x0 = x; x0 >= min_x; x0--) {
    if (condition(x0,y0))
      min_x0 = x0
    else
      break
  }

  var max_x0
  for (var x0 = x; x0 <= max_x; x0++) {
    if (condition(x0,y0))
      max_x0 = x0
    else
      break
  }

  if (max_x0 - min_x0 < dis_min)
    continue

// move along the x-axis and find the max_y (bottom side) along each x1
  var max_y1 = {}
  for (var x1 = min_x0; x1 <= max_x0; x1++) {
    for (var y1 = y0; y1 <= max_y; y1++) {
      if (condition(x1,y1))
        max_y1[x1] = y1
      else
        break
    }
  }

// min_x0 to x (left side)
  for (var x1 = min_x0; x1 <= x; x1++) {
    var y1 = max_y1[x1]
// no max_y on the left side of x1 should be bigger than the current max_y
    for (var x2 = min_x0; x2 < x1; x2++)
      max_y1[x2] = Math.min(max_y1[x2], y1)
  }
// max_x0 to x (right side)
  for (var x1 = max_x0; x1 >= x; x1--) {
    var y1 = max_y1[x1]
// no max_y on the right side of x1 should be bigger than the current max_y
    for (var x2 = max_x0; x2 > x1; x2--)
      max_y1[x2] = Math.min(max_y1[x2], y1)
  }

// Pick a point from each side along the x-axis, find the common (i.e. smallest) max_y between them, and then we have the box.
  for (var x1 = min_x0; x1 <= x; x1++) {
    if (max_y1[x1] < y)
      continue

    for (var x2 = max_x0; x2 >= x; x2--) {
      var length_x = x2 - x1
      if (length_x < dis_min)
        continue

      var max_y0 = Math.min(max_y1[x1], max_y1[x2])
      if (max_y0 < y)
        continue

      var length_y = max_y0 - y0
      if (length_y < dis_min)
        continue

      var area = (length_x+1) * (length_y+1)
      if (area < box.area)
        continue

      var center_factor = (x2-x) * (x-x1) * (max_y0-y) * (y-y0)
      if ((area == box.area) && (center_factor < box.center_factor))
        continue

      box.area = area
      box.center_factor = center_factor
      box.min.x = x1
      box.min.y = y0
      box.max.x = x2
      box.max.y = max_y0
    }
  }
}

if (box.area < (para.area||3))
  return null

box3.set(v3a.set(box.min.x, -999, box.min.y), v3b.set(box.max.x+1, 999, box.max.y+1))

var rot_y = 0
if (para.rotation !== false) {
  origin_v3.set(x+0.5, 0, y+0.5)

  var ry_list = []
  var is_best_ry = center_rot_y.some(function (ry) {
    rot_y = d.character.rot.y + ry
    dir_v3.set(0,0,1).applyEuler(v3a.set(0,rot_y,0))

// cast outside the box in the opposite direction
    ray.set(v3a.copy(origin_v3).add(v3b.copy(dir_v3).multiplyScalar(9999)), v3c.copy(dir_v3).negate())

    var intersection = ray.intersectBox(box3, v3a)
    box.encounter_center = origin_v3.clone().add(intersection).multiplyScalar(0.5)

    if (box.area == 1)
      return true

    var dis = origin_v3.distanceToSquared(box.encounter_center)
    if (dis > 1)
      return true

    ry_list.push({ dis:dis, rot_y:rot_y, encounter_center:box.encounter_center })
  });

  if (!is_best_ry) {
    var best_ry = ry_list.sort(function (a,b) { return a-b; }).pop();
    rot_y = best_ry.rot_y
    box.encounter_center = best_ry.encounter_center
  }
}

//return box

var grid_size = d.grid_size
var event_id = "_COMBAT_AUTO_"

box3.max.multiplyScalar(grid_size)
box3.min.multiplyScalar(grid_size)
var center_v3 = box3.center()

box.encounter_center = (box.encounter_center && box.encounter_center.multiplyScalar(grid_size)) || center_v3.clone()

var zone_of_movement = box3.clone().translate(v3a.copy(center_v3).negate())
zone_of_movement.center_position = center_v3.clone()

var check_point = {
  position: center_v3.clone()
 ,range: [
    {
      zone: box3.clone()
     ,onenter: { event_id: event_id + "_onenter0" }
     ,onexit:  { event_id: event_id + "_onexit0", condition: function () { return !d.character.combat_mode; } }
    }
  ]
};

var objs_enter = {}
var objs_exit = {}
para.enemy_list.forEach(function (enemy, idx) {
  var pos_offset = enemy.pos_offset
  if (pos_offset)
    pos_offset = v3a.copy(pos_offset)
  else {
    if (idx % 2 == 0) {
      pos_offset = v3a.set(-idx/2    *grid_size*0.25, 0, 0)
    }
    else {
      pos_offset = v3a.set((idx+1)/2 *grid_size*0.25, 0, 0)
    }
  }

  if (rot_y)
    pos_offset.applyEuler(v3b.set(0,rot_y,0))
//console.log(d.character.rot.y, rot_y)
  var pos = box.encounter_center.clone().add(pos_offset)
  pos.y = d.get_ground_y(pos)

  var obj = {
    placement: {
      position: pos
    }
   ,hp: enemy.hp || 100
   ,zone_of_movement: zone_of_movement
  };

  var obj_id = (enemy.index != null) ? "object" + enemy.index + "_0" : d.object_id_translated[enemy.id];
  objs_enter[obj_id] = obj;

  objs_exit[obj_id] = { placement:{hidden:true} };
});


if (!para.events)
  para.events = {}
var e = para.events

var onplayerdefeated, onenemyalldefeated
if (e.onplayerdefeated) {
  onplayerdefeated = function () {
  }
}
if (e.onenemyalldefeated) {
  onenemyalldefeated = function (onenemyalldefeated_default) {
    var events = e.onenemyalldefeated.slice().concat([{func:onenemyalldefeated_default, ended:true}])
    d.run_event([events])
    return true
  }
}

d.events[event_id + "_onenter0"] = [
//0
      [
        {
          combat: {
  enabled:true
// ,cooling_time: 99999
 ,show_HP_bar: true
 ,onplayerdefeated:   onplayerdefeated
 ,onenemyalldefeated: onenemyalldefeated
 ,onstatechange: {
    goto_branch: 1
  }
          }
        }
      ]

// 1
     ,(function () { var events = (e.onbeforecombatstart && e.onbeforecombatstart.slice()) || []; events.push({goto_branch:2}); return events; })()

//2
     ,[
        {
          objects: objs_enter
         ,camera_focus: box.encounter_center
         ,goto_branch: 3
        }
      ]

// 3
     ,(function () { var events = (e.onaftercombatstart && e.onaftercombatstart.slice()) || []; events.push({set_event_flag:{branch_index:0}, ended:true}); return events; })()

];

d.events[event_id + "_onexit0"] = [
      [
        {
          combat: {
  enabled:false
 ,onstatechange: {
    objects: objs_exit
  }
          }
         ,ended: true
        }
      ]
];

d._check_points = d.check_points
d.check_points = [check_point]

console.log(check_point)

return box;

      };
    })()

   ,grid_array_by_object: function (RDG_options, para) {
if (RDG_options._grid_array_by_object)
  return RDG_options._grid_array_by_object

var d = MMD_SA_options.Dungeon

var obj_base = d.object_base_list[para.object_index]
var mesh = obj_base._obj._obj
var bb = obj_base._obj._obj_proxy.boundingBox;
var scale = para.scale || (obj_base.placement && obj_base.placement.scale) || 10

var w = Math.max(Math.abs(bb.min.x), Math.abs(bb.max.x)) * scale * 2
var h = Math.max(Math.abs(bb.min.z), Math.abs(bb.max.z)) * scale * 2

var area_options = MMD_SA_options.Dungeon_options.options_by_area_id[d.area_id]
var grid_size
if (!area_options.grid_size) {
  grid_size = Math.max(w,h) / 100
  grid_size = area_options.grid_size = (grid_size <= 64) ? 64 : Math.pow(2, Math.ceil(Math.log2(grid_size)))
}
if (!area_options.view_radius)
  area_options.view_radius = Math.max(Math.round(512/grid_size), 4)

w = Math.ceil(w/grid_size)
h = Math.ceil(h/grid_size)
if (w % 2 == 0) w++
if (h % 2 == 0) h++

RDG_options.width  = w
RDG_options.height = h

var _grid_array = RDG_options._grid_array_by_object = []
for (var y = 0, y_max = h+2; y <= y_max; y++) {
  _grid_array[y] = []
  for (var x = 0, x_max = w+2; x <= x_max; x++)
    _grid_array[y][x] = (y==0 || y==y_max || x==0 || x==x_max) ? 1 : 0
}
_grid_array[~~(h/2)+1][~~(w/2)+1] = 2

return _grid_array
    }

   ,adjust_boundingBox: function (geo, model_para={}) {
if (!model_para.is_object && !model_para.use_default_boundingBox) {
  const THREE = MMD_SA.THREEX.THREE;

// save some headaches by setting xz center as (0,0), with equal xz size (z no bigger than x)
  const _v3 = geo.boundingBox.size()
  const _xz = (_v3.x + ((_v3.z > _v3.x) ? _v3.x : _v3.z))*0.5 *0.5 *(MMD_SA_options.Dungeon._bb_xz_factor_||1)
  geo.boundingBox.min.x = geo.boundingBox.min.z = -_xz
  geo.boundingBox.max.x = geo.boundingBox.max.z =  _xz

  geo.boundingSphere = geo.boundingBox.getBoundingSphere(new THREE.Sphere())
  geo.boundingSphere.radius *= 0.5
}
    }

   ,tooltip: (()=>{
      let scale;
      return function (x,y, content) {
const SB_tooltip = document.getElementById('SB_tooltip');
if (content)
  SB_tooltip.textContent = content;

let _scale = MMD_SA_options.Dungeon.inventory.UI.info.scale / window.devicePixelRatio;
if (scale != _scale) {
  scale = _scale;
  SB_tooltip.style.transform = 'scale(' + scale + ')';
}

const w = 280+5+5;
SB_tooltip.style.left = ((x > MMD_SA.THREEX.SL.width/2) ? x/window.devicePixelRatio - 40 - w * (1+(scale-1)/2) : x/window.devicePixelRatio + 40 + w * (scale-1)/2) + 'px';
SB_tooltip.style.top  = (y/window.devicePixelRatio + 40) + 'px';
SB_tooltip.style.visibility = 'inherit';
      };
    })()

  }
};
})();


// mersenne-twister.js
var MT;

Array.prototype.shuffleMT = function () {
  var i = this.length, j, temp;
  if ( i == 0 ) return this;
  while ( --i ) {
    j = Math.floor( MT.random() * ( i + 1 ) );
    temp = this[i];
    this[i] = this[j];
    this[j] = temp;
  }

  return this;
};

if (self._js_min_mode_ || (browser_native_mode && !webkit_window && !localhost_mode)) {
  console.log("dungeon.core.min.js")
  document.write('<script language="JavaScript" src="js/dungeon.core.min.js"></scr'+'ipt>');
}
else {
  document.write('<script language="JavaScript" src="js/mersenne-twister.js"></scr'+'ipt>');
  document.write('<script language="JavaScript" src="js/dungeon-generator.js"></scr'+'ipt>');
  document.write('<script language="JavaScript" src="js/terrain.js"></scr'+'ipt>');

  document.write('<script language="JavaScript" src="js/rbush.min.js"></scr'+'ipt>');
//document.write('<script language="JavaScript" src="node_modules/box-intersect.js"></scr'+'ipt>');

  document.write('<script language="JavaScript" src="js/nipplejs.js"></scr'+'ipt>');
}

document.write('<script>MMD_SA_options.Dungeon.init();</scr'+'ipt>');
