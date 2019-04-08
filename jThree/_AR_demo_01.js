// AR demo v1.0.1

(function () {
console.log("use AR demo")
return
  if (!MMD_SA_options)
    MMD_SA_options = {}

  if (!MMD_SA_options.motion)
    MMD_SA_options.motion = []
  if (!MMD_SA_options.motion_para)
    MMD_SA_options.motion_para = {}

  MMD_SA_options.use_speech_bubble = true

  var AR_para = MMD_SA_options.AR_para
  if (!AR_para)
    AR_para = MMD_SA_options.AR_para = {}

  var motion_HM, motion_drum
  if (MMD_SA_options._use_drum) {
    motion_drum = { must_load:true, no_shuffle:true, path:'F:\\From Vista\\Misc\\d-motion014\\drum-Miiro_full.vmd' }
    if (MMD_SA_options.motion.length)
      MMD_SA_options.motion.push(motion_drum)
  }
  if (MMD_SA_options._use_horse_machine) {
    motion_HM = { must_load:true, no_shuffle:true, path:'F:\\MMD\\motions\\乗馬セット\\HM-騎乗モーションN式向け_mod-v00.vmd' }
    if (MMD_SA_options.motion.length)
      MMD_SA_options.motion.push(motion_HM)

    MMD_SA_options.motion_para["HM-騎乗モーションN式向け_mod-v00"] = { random_range_disabled:true, meter_motion_disabled:true, loopback_fading:false, loopback_physics_reset:false, BPM:{}

 ,_range_index: 0
 ,_range: [[{time:[15,1059]}], [{time:[1095,2247], get look_at_screen_ratio() { var f=THREE.MMD.getModels()[0].skin.time*30; return ((f<1104)?1:((f>1122)?0:(1122-f)/(1122-1104))); }}], [{time:[1167,2247], look_at_screen:false}], [{time:[2247,2895], look_at_screen:false}], [{time:[2427,2895], look_at_screen:false}]]
 ,get range() {
return this._range[this._range_index]
  }

 ,onended: function (last_frame) {
if (last_frame && !MMD_SA._force_motion_shuffle) {
  if (this._range_index == 1)
    this._range_index = 2
  else if (this._range_index == 3)
    this._range_index = 4
}
this._EV_usage_sum = this._EV_usage_count = this._range_up_count = this._range_down_count = 0
  }

 ,onstart: function (motion_changed) {
//MMD_SA.SpeechBubble.message(1, "熱血．．．．．．\n救命呀．．．！？", 3000)

if (motion_changed) {
  if (MMD_SA_options.use_JSARToolKit)
    this._EV_usage_custom = this._EV_usage_last = 0
  else
    this._EV_usage_last = 50
  this._frame_checkpoint = 0
  this._checkpoint()
  return '_playbackRate = playbackRate * para._playbackRate'
}
  }

 ,_EV_usage_last: 50
 ,_EV_usage_sum: 0
 ,_EV_usage_count: 0
 ,_EV_usage_custom: null
 ,_range_up_count: 0
 ,_range_down_count: 0
 ,_frame_checkpoint: 0
 ,_checkpoint: function () {
var limit_lower, limit_upper, range_lower, range_upper
var msg, msg_upper, msg_must_load
switch (this._range_index) {
  case 0:
    limit_lower = 0
    limit_upper = 33
    range_upper = 1
    msg = [[0, "咩黎架呢部野．．．"], [0, "感覺好怪．．．"], [0, "．．．．．．"]]
    msg_upper = [[1, "搞咩…！？"]]
    break
  case 1:
  case 2:
    limit_lower = 33
    limit_upper = 66
    range_lower = 0
    range_upper = 3
    msg = [[1, "太快喇！！"], [1, "喂喂喂…！！"], [0, "慢啲呀喂！！"]]
    msg_upper = [[1, "仲加速…！？"]]
    break
  case 3:
  case 4:
    limit_lower = 66
    limit_upper = 100
    range_lower = 2
    msg = [[0, "頂唔順喇．．．"], [0, "熱血．．．救我呀．．．"], [2, "好奇怪嘅感覺湧緊上黎…啊…啊…"]]
    break
}

var v = (this._EV_usage_count) ? this._EV_usage_sum/this._EV_usage_count : this._EV_usage_last
this._EV_usage_last = v
this._EV_usage_sum = this._EV_usage_count = 0

var speed_min = 0.75
var speed_max = 1.75
this.BPM._playbackRate = speed_min + (v/100) * (speed_max-speed_min)
this.BPM._playbackRate_countdown = 1000*60

var count_max = 4
if (v < limit_lower) {
  if (++this._range_down_count >= count_max) {
    MMD_SA._force_motion_shuffle = true
    this._range_index = range_lower
  }
}
else if (v > limit_upper) {
  if (++this._range_up_count >= count_max) {
    if (msg_upper) {
      msg = msg_upper
      msg_must_load = true
    }

    MMD_SA._force_motion_shuffle = true
    this._range_index = range_upper
  }
}
else
  this._range_up_count = this._range_down_count = 0

//DEBUG_show(this._range_index+'/'+this._frame_checkpoint+'/'+parseInt(v) + '/' + this.BPM._playbackRate)

if (msg_must_load || MMD_SA.SpeechBubble.hidden_time_check(3000)) {
  msg = msg.shuffle()[0]
  MMD_SA.SpeechBubble.message(msg[0], msg[1], msg[2])
}
  }

 ,_custom_motion_shuffle: function  () {
var mm = MMD_SA.MMD.motionManager
var para_SA = mm.para_SA
if (!MMD_SA._horse_machine_mode_)
  return

para_SA._EV_usage_sum += (para_SA._EV_usage_custom != null) ? para_SA._EV_usage_custom : EV_usage_float
para_SA._EV_usage_count++ 

var checkpoint = (parseInt(MMD_SA._motion_time_ * 30) - 15) / 36
if ((checkpoint % 1 < 0.2) && (para_SA._frame_checkpoint != parseInt(checkpoint))) {
  para_SA._frame_checkpoint = parseInt(checkpoint)
  para_SA._checkpoint()
}
  }

    }

    MMD_SA_options.custom_motion_shuffle = MMD_SA_options.motion_para["HM-騎乗モーションN式向け_mod-v00"]._custom_motion_shuffle
  }

  if (!MMD_SA_options.motion.length) {
    MMD_SA_options.motion.push({ must_load:true, no_shuffle:true, path:System.Gadget.path + '/MMD.js/motion/standmix2_modified.vmd' })
    MMD_SA_options.motion.push({ must_load:true, no_shuffle:true, path:System.Gadget.path + '/MMD.js/motion/sleep/sleep01.vmd' })
    MMD_SA_options.motion.push({ must_load:true, no_shuffle:true, path:System.Gadget.path + '/MMD.js/motion/model/camera_appeal01.vmd' })
    if (motion_HM)
      MMD_SA_options.motion.push(motion_HM)
    if (motion_drum)
      MMD_SA_options.motion.push(motion_drum)
MMD_SA_options.motion.push({ must_load:true, no_shuffle:true, path:'F:\\MMD\\motions\\The_Boys\\the_boys.vmd' })
  }

  var _motion_para = {
    "standmix2_modified" : { meter_motion_disabled:true, get allows_kissing() { return !MMD_SA_options._use_xray || !MMD_SA_options.mesh_obj_by_id["XrayMESH"].visible; }
 ,onended: function (last_frame) { MMD_SA._check_sleep_(last_frame, random(10)+10); }
    }
   ,"sleep01" : { look_at_screen:false, meter_motion_disabled:true, random_range_disabled:true, gravity:[1,0,0], SpeechBubble_pos_mod: [0,7.5,0]
 ,IK_disabled: { test: function (name) { return (name.indexOf("足ＩＫ")!=-1) || (name.indexOf("つま先ＩＫ")!=-1); } }
 ,onended: function (last_frame) { MMD_SA._no_fading=true; if (last_frame) MMD_SA_options.AR_para._sleepiness-=2; }
    }
   ,"camera_appeal01" : { meter_motion_disabled:true
 ,look_at_screen_bone_list: [
  { name:"首", weight_screen:0.25, weight_motion:1 }
 ,{ name:"頭", weight_screen:0.25, weight_motion:1 }
 ,{ name:"上半身2", weight_screen:0.5, weight_motion:1 }
  ]
 ,get look_at_screen_parent_rotation() { return THREE.MMD.getModels()[0].skin.mesh.bones_by_name["全ての親"].quaternion.clone(); }
 ,onended: function () { MMD_SA._no_fading=true; }
    }
  }

  for (var motion_name in _motion_para) {
    if (!MMD_SA_options.motion_para[motion_name])
      MMD_SA_options.motion_para[motion_name] = _motion_para[motion_name]
  }

  if (!MMD_SA_options.use_JSARToolKit)
    return


// AR specific START
  var _x_object = [
    {
  path: System.Gadget.path + '/jThree/model/x/100t_hammer/100tハンマー.x'
 ,style: 'scale:0; position:0 0 0;'
 ,scale: 5
    }

   ,{
  path: System.Gadget.path + '/jThree/model/x/magnet/magnet.x'
 ,style: 'scale:0; position:0 0 0;'
 ,scale: 10
    }

   ,{
  path: System.Gadget.path + '/jThree/model/x/control_knob/control_knob.x'
 ,style: 'scale:0; position:0 0 0;'
 ,scale: 20
    }

   ,{
  path: System.Gadget.path + '/jThree/model/x/clapperboard/clapperboard.x'
 ,style: 'scale:0; position:0 0 0;'
 ,scale: 10
    }

   ,{
  path: System.Gadget.path + '/jThree/model/x/money/money.x'
 ,style: 'scale:0; position:0 0 0;'
 ,scale: 2.5
    }

   ,{
  path: System.Gadget.path + '/jThree/model/x/dumbell/dumbell.x'
 ,style: 'scale:0; position:0 0 0;'
 ,scale: 20
    }
  ]

  AR_para._marker30_options = []
  if (MMD_SA_options._use_horse_machine) {
    AR_para._marker30_options.push({
      check: function (marker) {
marker._is_drum = false
if (MMD_SA._horse_machine_mode_) {
  marker._is_horse_machine = false
}
else {
  marker._is_magnet = false
  marker._is_horse_machine = true
}
      }
    });
  }
  if (MMD_SA_options._use_drum) {
    AR_para._marker30_options.push({
      check: function (marker) {
marker._is_horse_machine = false
if (/^drum\-/.test(MMD_SA.MMD.motionManager.filename)) {
  marker._is_drum = false
}
else {
  marker._is_magnet = false
  marker._is_drum = true
}
      }
    });
  }


  AR_para._marker75_options = [
    {
  get_obj: function () { return MMD_SA_options.x_object_by_name['clapperboard'] }
 ,action: function () {
if (MMD_SA.MMD.motionManager.filename != "camera_appeal01") {
  MMD_SA_options.AR_para._motion_default = 'camera_appeal01'
  MMD_SA_options.motion_shuffle_list_default = [MMD_SA_options.motion_index_by_name['camera_appeal01']]
  MMD_SA._force_motion_shuffle = true
  MMD_SA.SpeechBubble.message(0, "要影相嗎？擺ＰＯＳＥ我在行啊～")
}
  }
    }

   ,{
  get_obj: function () { return MMD_SA_options.x_object_by_name['dumbell'] }
 ,action: function () {
if (!MMD_SA._training_) {
  MMD_SA_options.AR_para._sleepiness = 0
//  MMD_SA_options.motion_shuffle_list_default = [MMD_SA_options.motion_index_by_name['八極小架_loop'], MMD_SA_options.motion_index_by_name['金剛八式_loop']].shuffle()
  MMD_SA_options.motion_shuffle_list_default = [MMD_SA_options.motion_index_by_name['スクワット'], MMD_SA_options.motion_index_by_name['27.オーバーヘッドキック_loop'], MMD_SA_options.motion_index_by_name['28.空中回し蹴り']].shuffle()
  MMD_SA._force_motion_shuffle = true
  MMD_SA.SpeechBubble.message(0, "修行時間～！")
}
  }
    }

   ,{
  get_obj: function () { return MMD_SA_options.x_object_by_name['money'] }
 ,action: function () {
MMD_SA.SpeechBubble.message(0, '歌舞表演時間～\nＴｈｅ　Ｂｏｙｓ～')
DragDrop.onDrop_finish({ path:'F:\\MMD\\motions\\The_Boys\\The Boys.wav', isFileSystem:true })
  }
    }
  ]

  MMD_SA_options.x_object = (MMD_SA_options.x_object) ? MMD_SA_options.x_object.concat(_x_object) : _x_object

  _motion_para = {
    "w01_すべって尻もち" : { meter_motion_disabled:true, get look_at_screen_ratio() { var t=THREE.MMD.getModels()[0].skin.time; return ((t>1)?0:1-t); }, onended: function () { MMD_SA._ignore_physics_reset=true; MMD_SA._no_fading=true; } }
   ,"ネックスプリング" : { meter_motion_disabled:true, onended: function () { MMD_SA._hit_legs_=false; MMD_SA._no_fading=true; MMD_SA_options.motion_shuffle_list_default=[MMD_SA._next_motion_index_]; } }
   ,"女の子座り→立ち上がる_gumi_v01" : { meter_motion_disabled:true, get look_at_screen_ratio() { var t=THREE.MMD.getModels()[0].skin.time; return ((t>1)?1:t); }, onended: function () { MMD_SA._hit_legs_=false; MMD_SA._no_fading=true; MMD_SA_options.motion_shuffle_list_default=[MMD_SA._next_motion_index_]; } }
   ,"へなへなと座り込む_gumi" : { meter_motion_disabled:true, get look_at_screen_ratio() { var t=THREE.MMD.getModels()[0].skin.time; return ((t>1)?0:1-t); }, onended: function () { MMD_SA._hit_legs_=false; MMD_SA_options.motion_shuffle_list_default=[MMD_SA._next_motion_index_]; } }
   ,"h01_何かにぶつかる小" : { meter_motion_disabled:true, onended: function () { MMD_SA._hit_head_=false; MMD_SA._no_fading=true; MMD_SA_options.motion_shuffle_list_default=[MMD_SA_options.motion_index_by_name[MMD_SA_options.AR_para._motion_default]]; } }

   ,"八極小架_loop" : { meter_motion_disabled:true, look_at_screen:false, onended: function () { MMD_SA._no_fading=true; } }
   ,"金剛八式_loop" : { meter_motion_disabled:true, look_at_screen:false, onended: function () { MMD_SA._no_fading=true; } }
   ,"27.オーバーヘッドキック_loop" : { loop:[2,3], meter_motion_disabled:true, look_at_screen:false, onended: function (last_frame) { MMD_SA._check_sleep_(last_frame, random(4)+4); } }
   ,"28.空中回し蹴り" : { loop:[3,5], meter_motion_disabled:true, look_at_screen:false, onended: function (last_frame) { MMD_SA._check_sleep_(last_frame, 3); } }
   ,"スクワット" : { loop:[10,15], meter_motion_disabled:true, look_at_screen:false, onended:  function (last_frame) { MMD_SA._check_sleep_(last_frame, 2); } }

   ,"kidnap" : { meter_motion_disabled:true, onended: function () { MMD_SA._no_fading=true; }
 ,process_bones: function (model) {
if (MMD_SA.use_jThree) {
  var bones = model.mesh
  var b_parent = bones.bones_by_name["全ての親"]
  if (!b_parent)
    return

  var AR_obj = MMD_SA.AR_obj
  var marker = AR_obj.markers[30]
  var pos = marker.position
  b_parent.position.x += pos.x
  b_parent.position.y += pos.y - 20
  b_parent.position.z += pos.z
}
else {}
  }
    }

   ,"walk_hip" : {
  look_at_screen:false, meter_motion_disabled:true, loopback_fading:true, onended: function () { MMD_SA._no_fading=true; }, BPM:{BPM: (30/42)*60*2, beat_frame: 42}
 ,process_bones: function (model) {
if (MMD_SA.use_jThree) {
  var bones = model.mesh
  var b_parent = bones.bones_by_name["全ての親"]
  if (!b_parent)
    return

  if (!MMD_SA._marker_runner_mode_) {
    return
  }

  var marker = MMD_SA._marker_runner_marker_current;
  var marker_last = MMD_SA._marker_runner_marker_last_;

  var pos_current = marker.position
  var pos_last = marker_last.position
  var x_diff = pos_current.x - pos_last.x
  var y_diff = pos_current.y - pos_last.y
  var z_diff = pos_current.z - pos_last.z
  var r = Math.atan2(x_diff, z_diff)

  b_parent.quaternion = new THREE.Quaternion().setFromEuler(MMD_SA.TEMP_v3.set(0, r, 0))

  var duration = MMD_SA._marker_runner_duration_
  var t = ((window.performance) ? performance.now() : Date.now()) - MMD_SA._marker_runner_time_ref;

  var f = t / duration
  if (t >= duration) {
    f = 1
    MMD_SA._marker_runner_duration_ = 0
  }

  b_parent.position = new THREE.Vector3(pos_last.x + x_diff*f ,pos_last.y + y_diff*f, pos_last.z + z_diff*f)
}
else {}
  }
    }

   ,"front flip" : {
  look_at_screen:false, meter_motion_disabled:true, onended: function () { MMD_SA._no_fading=true; if (MMD_SA._marker_runner_mode_) MMD_SA._marker_runner_duration_=0; }
 ,process_bones: function (model, skin) {
if (MMD_SA.use_jThree) {
  var bones = model.mesh
  var b_parent = bones.bones_by_name["全ての親"]
  if (!b_parent)
    return

  if (!MMD_SA._marker_runner_mode_) {
    return
  }

  var marker = MMD_SA._marker_runner_marker_current;
  var marker_last = MMD_SA._marker_runner_marker_last_;

  var pos_current = marker.position
  var pos_last = marker_last.position
  var x_diff = pos_current.x - pos_last.x
  var y_diff = pos_current.y - pos_last.y
  var z_diff = pos_current.z - pos_last.z
  var r = Math.atan2(x_diff, z_diff)

  b_parent.quaternion = new THREE.Quaternion().setFromEuler(MMD_SA.TEMP_v3.set(0, r, 0))

  var frame = ((skin.time < skin.duration) ? skin.time : skin.duration) * 30

  var checkpoint = [28,46]

  var x=0, y=0, z=0
  if (frame < checkpoint[0]) {
    x = pos_last.x
    y = pos_last.y
    z = pos_last.z
  }
  else if ((frame >= checkpoint[0]) && (frame < checkpoint[1])) {
    var y_add = 10
    var y_max = Math.max(pos_current.y, pos_last.y) + y_add

    var f = (frame - checkpoint[0]) / (checkpoint[1] - checkpoint[0])
    var y_distance = (Math.abs(y_diff) + y_add*2) * f
    var y_mod = pos_last.y + y_distance
    if (y_mod > y_max)
      y_mod = y_max - (y_distance - (y_max - pos_last.y))

    x = pos_last.x + x_diff*f
    y = y_mod
    z = pos_last.z + z_diff*f
  }
  else {
    x = pos_current.x
    y = pos_current.y
    z = pos_current.z
  }

  b_parent.position = new THREE.Vector3(x, y, z)
}
else {}
  }
    }
/*
   ,"walk_happy" : {
  process_bones: function (model) {
if (MMD_SA.use_jThree) {
  var bones = model.mesh
  var b_center = bones.bones_by_name["センター"]
  if (!b_center)
    return

  var b_parent = bones.bones_by_name["全ての親"]
  if (!b_parent)
    return

  b_parent.position   = new THREE.Vector3(0,0,-b_center.position.z)
  b_parent.quaternion = new THREE.Quaternion(0,0,0,1)
}
else {
  var b_center = bones["センター"]
  if (!b_center)
    return

  bones["全ての親"] = {
  location: vec3.create([0,0,-b_center.location[2]])
 ,rotation: quat4.create([0,0,0,1])
  }
}
  }
    }
*/
  }

  for (var motion_name in _motion_para) {
    if (!MMD_SA_options.motion_para[motion_name])
      MMD_SA_options.motion_para[motion_name] = _motion_para[motion_name]
  }

// custom action START
MMD_SA_options.custom_default = function () {
  var custom_action_new = []

  var _hit_head = {
    action: {
      condition: function (is_bone_action, objs) {
return MMD_SA._hit_head_;
      }

     ,onFinish: function () {
MMD_SA._hit_head_=false;
var AR_para = MMD_SA_options.AR_para
if (AR_para._sleep_mode && !AR_para._sleepiness) {
  MMD_SA_options.motion_shuffle_list_default = [MMD_SA_options.motion_index_by_name['女の子座り→立ち上がる_gumi_v01']]
  AR_para._motion_default = AR_para._motion_default0_
  MMD_SA._next_motion_index_ = MMD_SA_options.motion_index_by_name[AR_para._motion_default]
  MMD_SA._force_motion_shuffle = true
}
      }

     ,get look_at_screen_ratio() {
return ((this.frame >= 27) ? 0 : (27 - this.frame)/27)
      }
    }

   ,motion: {path:'MMD.js/motion/hit/h01_何かにぶつかる小.vmd', match:{skin_jThree:{ test: function(name) { return !((name=='センター') || (name=='上半身') || (name=='下半身') || (name.indexOf("ＩＫ") != -1) || (/^(\u5DE6|\u53F3)(\u8DB3|\u3072\u3056)/.test(name))); } }, morph_jThree:true}}

   ,animation_check: MMD_SA.custom_action_default["cover_undies"].animation_check
  }
  custom_action_new.push(_hit_head)

  if (MMD_SA_options._use_xray) {
    var _cover_chest = {
      action: {
        condition: function (is_bone_action, objs) {
var xray = MMD_SA_options.mesh_obj_by_id["XrayMESH"]
if (xray.visible) {
  if (is_bone_action) {
    this._chest_pos = MMD_SA.get_bone_position(objs.mesh, "上半身2")
  }
  else {
    if (this._chest_pos && (this._chest_pos.distanceTo(xray._obj.position) < MMD_SA_options._xray_radius*2.5))
      this._cover_chest_ = true
  }
}
else
  this._chest_pos = null

MMD_SA._cover_chest_ = this._cover_chest_
if (this._cover_chest_ && (this.frame == 0))
  MMD_SA.SpeechBubble.message(1, "！？")

return this._cover_chest_
        }

       ,onFinish: function () {
this._cover_chest_=false;
        }
      }

     ,motion: {path:'MMD.js/motion/cover_chest_v02.vmd', match:{skin_jThree:/^(\u5DE6|\u53F3)(\u80A9|\u8155|\u3072\u3058|\u624B\u9996|\u624B\u6369|.\u6307.)/, morph_jThree:true}}
    }
    custom_action_new.push(_cover_chest)
  }

  MMD_SA_options.custom_action = (MMD_SA_options.custom_action) ? custom_action_new.concat(MMD_SA_options.custom_action) : custom_action_new

// extra GOML
  MMD_SA.GOML_head +=
  '<geo id="SignGEO" type="Plane" param="5 5" />\n'
+ '<txr id="SignLoopTXR" src="' + (toFileProtocol(System.Gadget.path + '/images/sign_loop.png')) + '" />\n'
+ '<txr id="SignConstructionTXR" src="' + (toFileProtocol(System.Gadget.path + '/images/sign_construction.png')) + '" />\n'
+ '<mtl id="SignLoopMTL" type="MeshBasic" param="map:#SignLoopTXR;" />\n'
+ '<mtl id="SignConstructionMTL" type="MeshBasic" param="map:#SignConstructionTXR;" />\n';

  MMD_SA.GOML_scene +=
  '<mesh id="SignLoopMESH" geo="#SignGEO" mtl="#SignLoopMTL" style="position:0 0 0; scale:0;" />\n'
+ '<mesh id="SignConstructionMESH" geo="#SignGEO" mtl="#SignConstructionMTL" style="position:0 0 0; scale:0;" />\n';

  if (!MMD_SA_options.mesh_obj)
    MMD_SA_options.mesh_obj = []
  MMD_SA_options.mesh_obj.push({ id:"SignLoopMESH" }, { id:"SignConstructionMESH" })

// training mode check
  Object.defineProperty(MMD_SA, "_training_",
{
  get: function () {
return (MMD_SA_options.motion_shuffle_list_default && (MMD_SA_options.motion_shuffle_list_default.indexOf(MMD_SA_options.motion_index_by_name['スクワット']) != -1));
  }
});

// check sleep
  MMD_SA._check_sleep_ = function (last_frame, sleepiness) {
MMD_SA._no_fading = true
if (last_frame && (MMD_SA_options.motion_index_by_name['sleep01'] != null)) {
  MMD_SA_options.AR_para._sleepiness += sleepiness
  if (MMD_SA_options.AR_para._sleepiness == 100) {
    MMD_SA_options.AR_para._motion_default = 'sleep01'
    MMD_SA._next_motion_index_ = MMD_SA_options.motion_index_by_name['sleep01']
    MMD_SA_options.motion_shuffle_list_default = [MMD_SA_options.motion_index_by_name['へなへなと座り込む_gumi']]
    MMD_SA._hit_legs_ = true
    MMD_SA._force_motion_shuffle = true

    MMD_SA.SpeechBubble.message(0, "好眼訓．．．等我訓陣先．．．")
  }
}
  }

// horse machine mode
  Object.defineProperty(MMD_SA, "_horse_machine_mode_",
{
  get: function () {
return (/^HM\-/.test(MMD_SA.MMD.motionManager.filename));
  }
});
}
// custom action END

  MMD_SA_options.custom_motion_shuffle = function () {
if (EV_sync_update.fps_last)
  MMD_SA._debug_msg.push('FPS(' + (EV_sync_update.count_to_10fps_*5) + 'max):' + EV_sync_update.fps_last)

MMD_SA_options._use_horse_machine && MMD_SA_options.motion_para["HM-騎乗モーションN式向け_mod-v00"]._custom_motion_shuffle();

if (!this.use_JSARToolKit)
  return

MMD_SA._debug_msg.push(['Sleepiness:' + MMD_SA_options.AR_para._sleepiness].join('/'))

var AR_obj = MMD_SA.AR_obj
if (!AR_obj._m4)
  return

var AR_para = MMD_SA_options.AR_para
var base_id = AR_para.marker_base_id
var ww = AR_para.marker_width

var SB = MMD_SA.SpeechBubble

var busy = MMD_SA._busy_mode1_
var music_mode = MMD_SA.music_mode


// marker runner mode START
var marker = AR_obj.markers[99]
var marker99_active = marker && (marker.active_counter > 0)
var marker_runner_in_action

var sign_loop_visible, sign_construction_visible
var sign_loop = MMD_SA_options.mesh_obj_by_id["SignLoopMESH"]
var sign_construction = MMD_SA_options.mesh_obj_by_id["SignConstructionMESH"]

var pos, r, clock_rotation
if (marker99_active) {
  pos = marker.position
  r = AR_obj.TEMP_v3.setEulerFromQuaternion(marker.rotation, 'XZY')
  clock_rotation = AR_obj.TEMP_v3.setEulerFromQuaternion(marker.rotation).z
}

if (marker99_active) {
  if (!music_mode && !busy) {
    marker_runner_in_action = true
    if (Math.abs(clock_rotation) > Math.PI/2)
      MMD_SA._marker_runner_mode_ = true
  }

  r = AR_obj.TEMP_v3.setEulerFromQuaternion(AR_obj.TEMP_q.copy(marker.rotation).multiply(AR_obj._q1.setFromEuler(AR_obj._v3a.set(0,0,-clock_rotation),'XZY')), 'XZY')
  if (Math.abs(clock_rotation) > Math.PI/2) {
    sign_loop_visible = true
    sign_loop._obj.rotation.set(-r.x, r.z, r.y)
    sign_loop._obj.position.set(pos.x, pos.y+2.5, pos.z)
    sign_loop.show()
  }
  else {
    sign_construction_visible = true
    sign_construction._obj.rotation.set(-r.x, r.z, r.y)
    sign_construction._obj.position.set(pos.x, pos.y+2.5, pos.z)
    sign_construction.show()
  }
}

if (MMD_SA._marker_runner_mode_)
  marker_runner_in_action = true

if (!sign_loop_visible)
  sign_loop.hide()

if (!sign_construction_visible)
  sign_construction.hide()

//MMD_SA._debug_msg = [MMD_SA_options.motion_shuffle_list_default[0]]

var m_default = MMD_SA_options.motion_index_by_name[AR_para._motion_default]

if (MMD_SA._marker_runner_mode_) {
  var order = MMD_SA._marker_runner_order
  if (!order) {
    order = MMD_SA._marker_runner_order = []
    Object.keys(AR_obj.markers).forEach(function (id) {
      if ((id == base_id) || (id == 99))
        return

      if (AR_para.marker_base_id_spare_list && (AR_para.marker_base_id_spare_list.indexOf(id) != -1))
        return

      var marker = AR_obj.markers[id]
      if (marker.active_counter <= 0)
        return

      order.push(id)
    });
    order.push(base_id)

    MMD_SA._marker_runner_index_ = -1
    MMD_SA._marker_runner_duration_ = 0
    MMD_SA._marker_runner_marker_last_ = AR_obj.markers[base_id]

    if (order.length > 1)
      SB.message(0, "唔．．．訓練嗎？")
  }

  MMD_SA._ignore_physics_reset = true

  if ((order.length <= 1) || (!MMD_SA._marker_runner_duration_ && (++MMD_SA._marker_runner_index_ >= order.length))) {
    MMD_SA._marker_runner_mode_ = MMD_SA._marker_runner_order = null
    if (MMD_SA_options.motion_shuffle_list_default[0] != m_default) {
      MMD_SA_options.motion_shuffle_list_default = [m_default]
      MMD_SA._force_motion_shuffle = true
    }
  }
  else {
    if (!MMD_SA._marker_runner_duration_) {
      if (MMD_SA._marker_runner_index_ > 0)
        MMD_SA._marker_runner_marker_last_ = MMD_SA._marker_runner_marker_current
      var marker = MMD_SA._marker_runner_marker_current = AR_obj.markers[order[MMD_SA._marker_runner_index_]]

      MMD_SA._marker_runner_time_ref = (window.performance) ? performance.now() : Date.now();

      var rz_diff = AR_obj.TEMP_v3.setEulerFromQuaternion(marker.rotation).z

      if (Math.abs(rz_diff) < Math.PI*0.75) {
        MMD_SA._marker_runner_duration_ = 3*1000

        var walk_hip = MMD_SA_options.motion_index_by_name['walk_hip']
        if (MMD_SA_options.motion_shuffle_list_default[0] != walk_hip) {
          MMD_SA_options.motion_shuffle_list_default = [walk_hip]
          MMD_SA._force_motion_shuffle = true
        }
      }
      else {
        MMD_SA._marker_runner_duration_ = 1 //dummy

        var front_flip = MMD_SA_options.motion_index_by_name['front flip']
        if (MMD_SA_options.motion_shuffle_list_default[0] != front_flip) {
          MMD_SA_options.motion_shuffle_list_default = [front_flip]
          MMD_SA._force_motion_shuffle = true
        }
      }

      if ((Math.random() < 0.5) && SB.hidden_time_check(500))
        SB.message(0, ["蠻輕鬆啊～","冇難度～"].shuffle()[0])
    }
  }
}
// marker runner mode END


var mm = MMD_SA.MMD.motionManager
var para_SA = mm.para_SA
var head_pos = MMD_SA._head_pos
var sleep_mode = AR_para._sleep_mode
var horse_machine_mode = MMD_SA._horse_machine_mode_

var hammer = MMD_SA_options.x_object_by_name['100tハンマー']
if (!AR_obj.markers[1] || (AR_obj.markers[1].active_counter <= 0) || marker_runner_in_action)
  hammer.hide()

var xray, xray_obj
if (MMD_SA_options._use_xray) {
  xray = MMD_SA_options.mesh_obj_by_id["XrayMESH"]
  xray_obj = xray._obj
  if (!AR_obj.markers[10] || (AR_obj.markers[10].active_counter <= 0) || marker_runner_in_action)
    xray.hide()
}

var magnet = MMD_SA_options.x_object_by_name['magnet']
if (!AR_obj.markers[30] || (AR_obj.markers[30].active_counter <= 0) || !AR_obj.markers[30]._is_magnet || marker_runner_in_action)
  magnet.hide()

var control_knob = MMD_SA_options.x_object_by_name['control_knob']
if (!AR_obj.markers[30] || (AR_obj.markers[30].active_counter <= 0) || !horse_machine_mode || marker_runner_in_action)
  control_knob.hide()

if (AR_obj.markers[75] && (AR_obj.markers[75]._option_index != null) && ((AR_obj.markers[75].active_counter <= 0) || marker_runner_in_action))
  AR_para._marker75_options[AR_obj.markers[75]._option_index].get_obj().hide()

if (marker_runner_in_action)
  return


var standup = '女の子座り→立ち上がる_gumi_v01'//'ネックスプリング'
Object.keys(AR_obj.markers).forEach(function (id) {
  if (id == base_id)
    return

  var marker = AR_obj.markers[id]
  if (marker.active_counter <= 0)
    return

  var pos = marker.position
  if (id == 1) {
/*
w01_すべって尻もち
ネックスプリング
女の子座り→立ち上がる_gumi_v01
h01_何かにぶつかる小
walk_hip
front flip
*/
    var hit_pos
    var hammer_obj = hammer._obj
  
    var r = AR_obj.TEMP_v3.setEulerFromQuaternion(marker.rotation, 'XZY')
//    var r = AR_obj.TEMP_v3.setEulerFromQuaternion(AR_obj.TEMP_q.copy(marker.rotation).multiply(AR_obj._q1.setFromEuler(AR_obj._v3a.set(0,0,-Math.PI/2),'XZY')), 'XZY')
    hammer_obj.rotation.set(-r.x, r.z, r.y+Math.PI/2)

    hit_pos = AR_obj._v3a.set(0,ww,0).applyEuler(hammer_obj.rotation)

    hammer_obj.position.copy(pos).sub(hit_pos)
//MMD_SA._debug_msg = [hit_pos.toArray().join(",")]
    hit_pos.add(pos)

    hammer.show()

    if (busy || (Math.abs(hit_pos.x - head_pos.x) > ww) || (Math.abs(hit_pos.z - head_pos.z) > ww) || (hit_pos.y > head_pos.y+ww))
      return

    SB.message(1, ["痛！！", "哎呀！！", "＞＿＜"].shuffle()[0])

    if (!horse_machine_mode && (music_mode || sleep_mode || (hit_pos.y > head_pos.y))) {
      MMD_SA._hit_head_ = true
//      MMD_SA_options.motion_shuffle_list_default = [MMD_SA_options.motion_index_by_name['h01_何かにぶつかる小']]
      AR_para._sleepiness -= random(20)+20
      return
    }

    MMD_SA._hit_legs_ = true

    // use ._motion_shuffle_list instead, because we have multiple motions running in order, but .motion_shuffle_list_default can be shuffled.
    MMD_SA_options._motion_shuffle_list = [MMD_SA_options.motion_index_by_name['w01_すべって尻もち'],MMD_SA_options.motion_index_by_name[standup]]
    MMD_SA_options.motion_shuffle_list_default = null

    MMD_SA._next_motion_index_ = m_default
    MMD_SA._force_motion_shuffle = true
    return
  }

  if (busy)
    return

  if (id == 10) {
    if (MMD_SA_options._use_xray) {
      var r = AR_obj.TEMP_v3.setEulerFromQuaternion(marker.rotation, 'XZY')
      xray_obj.rotation.set(-r.x, r.z, r.y)
      xray_obj.position.copy(pos).sub(AR_obj._v3a.set(0,-MMD_SA_options._xray_radius*2,0).applyEuler(xray_obj.rotation))
      if (!xray.visible)
        xray._start_time = Date.now()
      xray.show()
    }
    return
  }

  if (sleep_mode)
    return

  if (id == 30) {
    if (music_mode)
      return

    var r = AR_obj.TEMP_v3.setEulerFromQuaternion(marker.rotation, 'XZY')
    var clock_rotation = AR_obj.TEMP_v3.setEulerFromQuaternion(marker.rotation).z

    var card_laid_down = (Math.abs(r.x*180/Math.PI) < 30)
    var card_clock_rotated = (Math.abs(clock_rotation*180/Math.PI) > 60)
    var card_near_base = (Math.abs(pos.x) < ww*2) && (Math.abs(pos.z) < ww*2)

    if (horse_machine_mode) {
      if (card_laid_down) {
        marker._is_magnet = false
        marker._is_horse_machine = marker._is_drum = false
        if (!card_near_base) {
          para_SA._EV_usage_custom = Math.abs(clock_rotation) / Math.PI * 100
          control_knob._obj.rotation.set(-r.x, r.z, r.y)
          control_knob._obj.position.copy(pos)
          control_knob.show()
        }
        return
      }
      control_knob.hide()
    }
    else if (/^drum\-/.test(mm.filename)) {
      marker._is_magnet = false
      marker._is_horse_machine = marker._is_drum = false
      return
    }

    if (MMD_SA._kidnaping_ || !card_laid_down) {
      marker._is_magnet = true
      marker._is_horse_machine = marker._is_drum = false
    }

    if (!MMD_SA._kidnaping_ && card_laid_down) {
      if (pos.y > 5) {
        marker._is_horse_machine = marker._is_drum = false
      }
      else {
        var options = AR_para._marker30_options
        if (options.length) {
          var angle_range = Math.PI*2 / options.length
          var cr = (clock_rotation + angle_range/2) % (Math.PI*2)
          if (cr < 0)
            cr += Math.PI*2

          var index_new = parseInt(cr / angle_range)
          options[index_new].check(marker)
        }
      }
    }

    if (marker._is_horse_machine) {
      marker._is_magnet = false
      if (pos.y > 5) {
        marker._is_horse_machine = false
        return
      }

      if (card_near_base) {
        SB.message(1, "！？")

        marker._is_horse_machine = false
        MMD_SA_options.motion_shuffle_list_default = [MMD_SA_options.motion_index_by_name["HM-騎乗モーションN式向け_mod-v00"]]
        MMD_SA._force_motion_shuffle = true
        return
      }

      var model = THREE.MMD.getModels()[0]
      var _m_idx = model.pmx.morphs_index_by_name["Hide HM"]
      var _m = model.pmx.morphs[_m_idx]
// NOTE: "idx" for non-vertex morph is not needed. Use 0 as a dummy value.
      MMD_SA._custom_morph.push({ key:{ name:"Hide HM", weight:0, morph_type:_m.type, morph_index:_m_idx }, idx:0 })
      MMD_SA._custom_skin.push({ key:{ name:"HM全ての親", pos:pos.toArray() ,rot:[0,0,0,1] ,interp:MMD_SA._skin_interp_default }, idx:model.mesh.bones_by_name["HM全ての親"]._index })
      return
    }

    if (marker._is_drum) {
      marker._is_magnet = false
      if (pos.y > 5) {
        marker._is_drum = false
        return
      }

      if (card_near_base) {
        SB.message(0, "表演時間～")
        DragDrop.onDrop_finish({ path:'F:\\From Vista\\Misc\\d-motion014\\Miiro.mp3', isFileSystem:true })
        return
      }

      var model = THREE.MMD.getModels()[0]
      var _m_idx = model.pmx.morphs_index_by_name["Hide drum"]
      var _m = model.pmx.morphs[_m_idx]
      MMD_SA._custom_morph.push({ key:{ weight:0, morph_type:_m.type, morph_index:_m_idx }, idx:model.morph.target_index_by_name["Hide drum"] })
      MMD_SA._custom_skin.push({ key:{ pos:pos.toArray() ,rot:[0,0,0,1] ,interp:MMD_SA._skin_interp_default }, idx:model.mesh.bones_by_name["D全ての親"]._index })
      return
    }

    if (marker._is_magnet) {
      var magnet_obj = magnet._obj
      magnet_obj.rotation.set(-r.x, r.z, r.y)
      magnet_obj.position.copy(pos).sub(AR_obj._v3a.set(0,0,ww/2).applyEuler(magnet_obj.rotation))
      magnet.show()
    }
    else
      return

    if ((pos.y < 15) || !card_near_base || card_laid_down)
      return

    if (MMD_SA._kidnaping_) {
      if (!card_clock_rotated)
        return

      SB.message(1, ["痛！！", "哎呀！！", "＞＿＜"].shuffle()[0])

      marker._is_magnet = false
      MMD_SA._kidnaping_ = false
      MMD_SA._hit_legs_ = true

      // use ._motion_shuffle_list instead, because we have multiple motions running in order, but .motion_shuffle_list_default can be shuffled.
      MMD_SA_options._motion_shuffle_list = [MMD_SA_options.motion_index_by_name['w01_すべって尻もち'],MMD_SA_options.motion_index_by_name[standup]]
      MMD_SA_options.motion_shuffle_list_default = null

      MMD_SA._next_motion_index_ = m_default
    }
    else {
      if (card_clock_rotated)
        return

      SB.message(1, "！？")

      AR_para._sleepiness = 0
      AR_para._motion_default = AR_para._motion_default0_
      marker._is_magnet = true
      MMD_SA._kidnaping_ = true
      MMD_SA_options.motion_shuffle_list_default = [MMD_SA_options.motion_index_by_name['kidnap']]
//DEBUG_show(9,0,1)
    }
    MMD_SA._force_motion_shuffle = true
    return
  }

  if (id == 75) {
//    var r = AR_obj.TEMP_v3.setEulerFromQuaternion(marker.rotation, 'XZY')
    var clock_rotation = AR_obj.TEMP_v3.setEulerFromQuaternion(marker.rotation).z

    if (!marker._option_counter)
      marker._option_counter = 0
    marker._option_counter = (marker._option_counter+1) % (20*10)

    var options = AR_para._marker75_options
    var angle_range = Math.PI*2 / options.length
    var cr = (clock_rotation + angle_range/2) % (Math.PI*2)
    if (cr < 0)
      cr += Math.PI*2

    var index_new = parseInt(cr / angle_range)
    if ((marker._option_index != null) && (marker._option_index != index_new))
      options[marker._option_index].get_obj().hide()
    marker._option_index = index_new
    var option = options[marker._option_index]
    var obj = option.get_obj()
    var obj2 = obj._obj

    var r = AR_obj.TEMP_v3.setEulerFromQuaternion(AR_obj.TEMP_q.copy(marker.rotation).multiply(AR_obj._q1.setFromEuler(AR_obj._v3a.set(0,0,MMD_SA.normalize_angle((marker._option_counter/(20*10))*Math.PI*2)),'XZY')), 'XZY')
    obj2.rotation.set(-r.x, r.z, r.y)
    var ratio = Math.abs(angle_range - (cr - angle_range * marker._option_index)*2) / angle_range
    obj2.scale.x = obj2.scale.y = obj2.scale.z = obj.scale * ((1 - ratio) * 0.75 + 0.25)
    obj2.position.copy(pos)//.sub(AR_obj._v3a.set(0,-ww*ratio,0).applyEuler(obj2.rotation))
    obj.show()

    var card_near_base = (Math.abs(pos.x) < ww*2) && (Math.abs(pos.z) < ww*2)
    if (card_near_base && !music_mode) {
      option.action()
    }

//    DragDrop.onDrop_finish({ path:'C:\\Metallica Entersandman Drum Track.wav', isFileSystem:true })
  }
});

if (Audio_BPM.vo.motion_by_song_name_mode && /The Boys\./.test(decodeURIComponent(Audio_BPM.vo.audio_obj.src))) {
  var t = Audio_BPM.vo.audio_obj.currentTime
  if (t > 5.8) {
msg = [
  'P-p-p-p-punch line Queen,\nno boxer though'
 ,'Might pull up in a Porsche,\nno boxster though'
 ,'Tell a hater,\n"Yo, don\'t you got\ncocks to blow?"'
 ,'Tell \'em Kangaroo Nick,\nI\'ll box a hoe'
 ,'Shoulda shoulda said\nI got 5 in a possible'
 ,'Don\'t go against Nicki,\nImpossible'
 ,'I done came through\nwith my wrist on Popsicle'
 ,'Man these hoes couldn\'t\nball with a Testicle'
 ,'The boys always spending\nall their money on love'
 ,'They wanna touch it,\ntaste it, see it, feel it'
 ,'Bone it, own it,\nYeah yeah'
 ,'Dollar, dollar, paper chase it,\nget that money, yeah yeah'
]

var idx
if (t > 37.2) {
  idx = 11
  if (t > 41)
    SB.hide()
}
else if (t > 35.0)
  idx = 10
else if (t > 32.0)
  idx = 9
else if (t > 23.7)
  idx = 8
else if (t > 21.4)
  idx = 7
else if (t > 19.2)
  idx = 6
else if (t > 17.0)
  idx = 5
else if (t > 14.8)
  idx = 4
else if (t > 12.6)
  idx = 3
else if (t > 10.4)
  idx = 2
else if (t > 8.2)
  idx = 1
else
  idx = 0

if (AR_para._The_Boys_idx_ != idx) {
  AR_para._The_Boys_idx_ = idx
  SB.message(0, msg[idx], 10*1000, { font:'"Segoe Print"', font_size:32 })
}
  }
}

if (MMD_SA._busy_mode1_)
  return

var msg = null
if (MMD_SA._cover_chest_) {
  if (SB.hidden_time_check(3000)) {
    msg = [[0, "又搞咩奇怪玩意啊，主人．．．"], [0, "好變態呀．．．"], [0, "＞＿＜"]].shuffle()[0]
  }
}
else if (sleep_mode) {
  if (SB.hidden_time_check(5000)) {
    msg = [[2, "ZzzZzzZzzZzzZzzZzz"], [2, "熱血…唔好亂摸…喂…啊…啊…＊發開口夢＊"]].shuffle()[0]
  }
  if (SB.visible && ((SB.msg + ((msg && msg[1]) || "")).indexOf("亂摸") != -1))
    MMD_SA._custom_morph = MMD_SA._tired_face_.slice(0)
}
else if (MMD_SA._training_) {
  if (AR_para._sleepiness > 50) {
    MMD_SA._custom_morph = MMD_SA._tired_face_.slice(0)
    if (SB.hidden_time_check(3000)) {
      msg = [[0, "好攰啊．．．"], [0, "好辛苦啊，主人．．．"], [2, "仲要練幾耐架．．．"]].shuffle()[0]
    }
  }
  else {
    if (SB.hidden_time_check(3000)) {
      msg = [[0, "１．．．２．．．１．．．２．．．"], [0, "吃得苦中苦，方為人上人．．．"], [2, "其實練MMA會唔會仲好．．．？"]].shuffle()[0]
    }
  }
}
else if (/^kidnap/.test(mm.filename)) {
  if (SB.hidden_time_check(3000)) {
    if (head_pos.distanceTo(MMD_SA.camera_position) < 30) {
      msg = [0, "主人．．．你做咩伸條脷出黎．．．＞＿＜"]
    }
    else {
      msg = [[0, "我偎高呀，主人．．．"], [0, "救命呀．．．"], [0, "熱血．．．救我呀．．．"]].shuffle()[0]
    }
  }
}
else if (/^camera/.test(mm.filename)) {
  if (SB.hidden_time_check(3000)) {
    msg = [[0, "我似個模特兒嗎，主人～？"], [0, "這個ＰＯＳＥ如何～？"], [0, "記得影靚啲啊～"]].shuffle()[0]
  }
}
else if (/^stand/.test(mm.filename)) {
  if (SB.hidden_time_check(3000)) {
    msg = [[0, "大香港，早晨～！"], [0, "好悶啊，有冇咩攪作呀主人？"], [0, "唔知熱血而家做緊咩呢？"]].shuffle()[0]
  }
}

if (msg)
  SB.message(msg[0], msg[1], msg[2])
  }

  AR_para.marker_base_id_spare_list = [80,85]

  Object.defineProperty(AR_para, "_sleep_mode",
{
  get: function () {
return (MMD_SA.MMD.motionManager.filename == "sleep01")
  }
});

  AR_para._sleepiness_ = AR_para._sleepiness || 0
  Object.defineProperty(AR_para, "_sleepiness",
{
  get: function () {
return this._sleepiness_
  }

 ,set: function (v) {
this._sleepiness_ = v
if (this._sleepiness_ < 0)
  this._sleepiness_ = 0
else if (this._sleepiness_ > 100)
  this._sleepiness_ = 100
  }
});

  AR_para._motion_default0_ = MMD_SA_options.motion[0].path.replace(/^.+[\/\\]/, "").replace(/\.vmd$/i, "")
  AR_para._motion_default_  = (AR_para._motion_default) ? AR_para._motion_default : AR_para._motion_default0_

  Object.defineProperty(AR_para, "_motion_default",
{
  get: function () {
var sleep_mode = this._sleep_mode
if ((this._sleepiness == 100) || (sleep_mode && this._sleepiness)) {
  m = "sleep01"
}
else if (sleep_mode) {
// waking up
  m = AR_para._motion_default_
}
else {
  m = AR_para._motion_default_
}

if (this._motion_default_ != m) {
  this._motion_default_ = m
// update the backuped default list
  MMD_SA_options._motion_shuffle_list_default = [MMD_SA_options.motion_index_by_name[m]]
}

return m
  }

 ,set: function (m) {
AR_para._motion_default_ = m
MMD_SA_options._motion_shuffle_list_default = [MMD_SA_options.motion_index_by_name[m]]
  }
});

  MMD_SA_options.motion_shuffle_list_default = [0]
  MMD_SA_options.onstart = function () {
MMD_SA_options.motion_shuffle_list_default = [MMD_SA_options.motion_index_by_name[MMD_SA_options.AR_para._motion_default]]

// tired face custom morph
var model = THREE.MMD.getModels()[0]
var geo = model.mesh.geometry
var morph_list = [
  { name:"まばたき", weight:0.2, condition:function (model) { return (model.mesh.morphTargetInfluences[this.idx] < this.key.weight); } }
 ,{ name:"お", weight:0.4 }
 ,{ name:"困る", weight:1 }
 ,{ name:"照れ", weight:1 }
]

MMD_SA._tired_face_ = []
morph_list.forEach(function (v) {
  var _m_idx = model.pmx.morphs_index_by_name[v.name]
  if (_m_idx == null)
    return

  var _m = model.pmx.morphs[_m_idx]
  if (_m.type == 8) {
    MMD_SA._tired_face_.push({ key:{ weight:v.weight, morph_type:8, morph_index:_m_idx }, idx:_m_idx, condition:v.condition })
  }
  else {
// NOTE: vertex morphs use geo._morphTargets_index instead of pmx.morphs_index_by_name
    var idx = geo._morphTargets_index[v.name]
    if (idx != null) {
      MMD_SA._tired_face_.push({ key:{ weight:v.weight }, idx:idx, condition:v.condition })
    }
  }
})
  }

  MMD_SA_options.motion.push(
  { must_load:true, no_shuffle:true, path:System.Gadget.path + '/MMD.js/motion/hit/w01_すべって尻もち.vmd' }
// ,{ must_load:true, no_shuffle:true, path:'C:\\Users\\User\\Downloads\\MikuMikuDanceE_v739\\MikuMikuDanceE_v739\\UserFile\\Motion\\起き上がりムーブ\\ネックスプリング.vmd' }

// skipped for custom_action
// ,{ must_load:true, no_shuffle:true, path:System.Gadget.path + '/MMD.js/motion/hit/h01_何かにぶつかる小.vmd' }

 ,{ must_load:true, no_shuffle:true, path:System.Gadget.path + '/MMD.js/motion/casual/女の子座り→立ち上がる_gumi_v01.vmd' }
 ,{ must_load:true, no_shuffle:true, path:System.Gadget.path + '/MMD.js/motion/casual/へなへなと座り込む_gumi.vmd' }
 ,{ must_load:true, no_shuffle:true, path:System.Gadget.path + '/MMD.js/motion/walk_n_run/walk_hip.vmd' }
 ,{ must_load:true, no_shuffle:true, path:System.Gadget.path + '/MMD.js/motion/walk_n_run/front flip.vmd' }
 ,{ must_load:true, no_shuffle:true, path:System.Gadget.path + '/MMD.js/motion/kidnap.vmd' }

// ,{ must_load:true, no_shuffle:true, path:Settings.f_path + '/motion/八極拳モーション詰め合わせ/八極小架_loop.vmd' }
// ,{ must_load:true, no_shuffle:true, path:Settings.f_path + '/motion/八極拳モーション詰め合わせ/金剛八式_loop.vmd' }
/*
 ,{ must_load:true, no_shuffle:true, path:Settings.f_path + '/motion/ジャンプモーション集/27.オーバーヘッドキック_loop.vmd' }
 ,{ must_load:true, no_shuffle:true, path:Settings.f_path + '/motion/ジャンプモーション集/28.空中回し蹴り.vmd' }
 ,{ must_load:true, no_shuffle:true, path:Settings.f_path + '/motion/とれーにんぐもーしょん.AH/スクワット.vmd' }
*/
  )

})();

// main js
//document.write('<script language="JavaScript" src="MMD.js/MMD_SA.js"></scr'+'ipt>');
