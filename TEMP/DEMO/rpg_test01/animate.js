var MMD_SA_options = {

//  model_path: System.Gadget.path + '\\TEMP\\DEMO\\models\\chung.min.zip#\\_chung_v012_CLEANED-v03.pmx'
//  model_path: System.Gadget.path + "/TEMP/DEMO/models/miss_foo.zip#/_MissFoo_v09b_for_SA-CLEANED_v01.pmx"
  model_path: System.Gadget.path + '\\TEMP\\DEMO\\models\\Appearance Miku.min.zip#\\Appearance Miku_BDEF_mod-v05.pmx'
//  model_path: 'F:\\MMD\\models\\TDA Haku Office Ver 1\\TDA Haku Office Ver 1.zip#\\TDA Haku Office Ver 1 (No Glasse)_v03.pmx'
//  model_path: 'F:\\MMD\\models\\不夜城のアサシン\\本体\\不夜城のアサシン.pmx'

 ,model_path_extra: [

 ]

 ,multi_model_position_offset: [
    [{x:0, y:0, z:0}, {x:0, y:0, z:0}]
  ]

 ,model_para: {

    _default_: {
// to make sure that every VMD has morph (at least a dummy)
  morph_default: {}

 ,morph_filter: null
    }

   ,"Appearance Miku_BDEF_mod.pmx": {
  is_PC_candidate: true
 ,character: {
    name: "Miku"
  }
     ,bone_constraint: {
  "左前スカート": { rotation:{ x:[[-20*Math.PI/180,0],[75*Math.PI/180]], y:[[-30*Math.PI/180,0],[30*Math.PI/180,0]],z:[[-30*Math.PI/180,0],[30*Math.PI/180,0]] } }
 ,"右前スカート": { rotation:{ x:[[-20*Math.PI/180,0],[75*Math.PI/180]], y:[[-30*Math.PI/180,0],[30*Math.PI/180,0]],z:[[-30*Math.PI/180,0],[30*Math.PI/180,0]] } }
 ,"左後スカート": { rotation:{ x:[[-75*Math.PI/180],[20*Math.PI/180,0]], y:[[-30*Math.PI/180,0],[30*Math.PI/180,0]],z:[[-30*Math.PI/180,0],[30*Math.PI/180,0]] } }
 ,"右後スカート": { rotation:{ x:[[-75*Math.PI/180],[20*Math.PI/180,0]], y:[[-30*Math.PI/180,0],[30*Math.PI/180,0]],z:[[-30*Math.PI/180,0],[30*Math.PI/180,0]] } }
 ,"左横スカート": { rotation:{ z:[[-20*Math.PI/180,0],[75*Math.PI/180]], y:[[-30*Math.PI/180,0],[30*Math.PI/180,0]],x:[[-30*Math.PI/180,0],[30*Math.PI/180,0]] } }
 ,"右横スカート": { rotation:{ z:[[-75*Math.PI/180],[20*Math.PI/180,0]], y:[[-30*Math.PI/180,0],[30*Math.PI/180,0]],x:[[-30*Math.PI/180,0],[30*Math.PI/180,0]] } }
      }
     ,morph_default:{ "瞳小":{weight_scale:0.5} }
 ,material_para: {
  "顔": { transparent:false }
 ,"服": { transparent:false }
 ,"服黒": { transparent:false }
 ,"服3": { transparent:false }
 ,"肌": { renderDepth:1000 }
// ,"服エッジ無": { renderDepth:1000 }
  }
 ,rigid_filter:{ test: function (name) { return (name.indexOf("ネクタイ") == -1) } }
//,rigid_filter: /^DISABLED$/
// ,icon_path: System.Gadget.path + '/images/icon_miku_64x64.png'
    }

   ,"かばんちゃん.pmx": {
  is_PC_candidate: true
 ,character: {
    name: "Kaban"
  }
// ,icon_path: Settings.f_path + '/3d/icon_kemurikusa.zip#/icon_riku.png'
 ,MME: {
    self_overlay: {
  enabled: 1
 ,opacity: 0.4
 ,brightness: 1
    }
   ,HDR: {
  enabled: 1
 ,opacity: 0.2
    }
  }
 ,skin_filter_by_motion: [
//    { motion:/gal_model_motion_with_legs-2_loop/, skin:/^DISABLED$/ }
  ]
    }

   ,"Rin_x0.95.pmx": {
  is_PC_candidate: true
 ,character: {
    name: "Rin"
  }
// ,icon_path: Settings.f_path + '/3d/icon_kemurikusa.zip#/icon_riku.png'
 ,MME: {
    self_overlay: {
  enabled: 1
 ,opacity: 0.4
 ,brightness: 1
    }
   ,HDR: {
  enabled: 1
 ,opacity: 0.2
    }
  }
 ,skin_filter_by_motion: [
//    { motion:/gal_model_motion_with_legs-2_loop/, skin:/^DISABLED$/ }
  ]
 ,morph_translate: {
  "＞＜": "はぅ"
  }
    }

   ,"yukari_mob_v04_x2.8_arm-z-35.pmx": {
  motion_includes: ["NPC talk A"]
    }

// X object START
   ,"sorairo1.52.x": {
  material_para: {
  "13": { side:2 }
 ,"37": { alphaTest:0.5 }
 ,"38": { alphaTest:0.25 }
  }
    }

   ,"ガレキ町１．4.x": {
  material_para: {
  "40": { transparent:false }
  }
    }

   ,"asian_town_x500.x": {
  material_para: {
//  "0": { side:2, transparent:false }
  }
    }

   ,"chest_v01.x": {
  material_para: {
  "0": { use_normal:true, use_normal_jpg:true, use_specular:true }
  }
    }

// X object END

   ,"セーラー服さんv1.3長袖.pmx": {
// to make sure that every VMD has morph (at least a dummy)
  morph_default: {}
 ,look_at_screen: false
 ,material_para: {
// fix the strange cloak shadow bug
//  _default_: { castShadow:false }
  }
    }

   ,"laferrari.pmx": {
  morph_default: {}
 ,motion_name_default: "(NO VMD)"
 ,is_object: true
 ,material_para: {
//  _default_: { transparent:false }
  "black": { transparent:false }
 ,"body": { transparent:false }
 ,"carbon": { transparent:false }
 ,"chrome": { transparent:false }
 ,"dark": { transparent:false }
 ,"gray": { transparent:false }
 ,"interior1": { transparent:false }
 ,"interior2": { transparent:false }
 ,"silver": { transparent:false }
  }
 ,edgeScale: 0
 ,MME: {
    self_overlay: {
  enabled: 0
    }
   ,HDR: {
  enabled: 0
    }
   ,serious_shader: {
  enabled: 1
 ,type: "AdultShaderS2"
    }
  }
 ,IK_disabled: /./
    }

   ,"batmobile-supercar.pmx": {
// to make sure that every VMD has morph (at least a dummy)
  morph_default: {}
 ,motion_name_default: "(NO VMD)"
 ,is_object: true
 ,material_para: {
  _default_: { transparent:false }
  }
 ,MME: {
    self_overlay: {
  enabled: 0
    }
   ,HDR: {
  enabled: 0
    }
   ,serious_shader: {
  enabled: 1
 ,type: "AdultShaderS2"
 ,OverBright: 1.2
    }
  }
    }

   ,"_Rudolph_full_v01.pmx": {
  morph_default: {
  "赤鼻": { weight:1 }
  }
 ,motion_name_default: "rudolph_idle"
 ,material_para: {
  "体": { transparent:false }//, castShadow:false }
 ,"瞳": { transparent:false }//, castShadow:false }
 ,"白目": { transparent:false }//, castShadow:false }
// ,_default_: { castShadow:false }
  }
 ,MME: {
    self_overlay: {
  enabled: 0
    }
   ,HDR: {
  enabled: 0
    }
   ,serious_shader: {
  enabled: 1
    }
  }
 ,IK_link_inverted: { test: function (v) { return ((v.indexOf("ひじ") != -1) || (v.indexOf("足首") != -1)); } }
    }

   ,"ワンルーム.pmx": {
// to make sure that every VMD has morph (at least a dummy)
  morph_default: {}
 ,motion_name_default: "(NO VMD)"
 ,is_object: true
 ,material_para: {
  _default_: { castShadow:false, receiveShadow:true }
 ,"部屋床": { transparent:false }
 ,"部屋壁": { transparent:false }
  }
 ,process_bones: (function () {
var y90, y90n
var initialized
var init = function () {
  initialized = true
  y90  = new THREE.Quaternion().setFromEuler(MMD_SA.TEMP_v3.set(0,Math.PI/2,0))
  y90n = new THREE.Quaternion().copy(y90).conjugate()
};

return function (model) {
  if (!initialized)
    init()

  var t = RAF_timestamp - 1000

  if (this["_リビングドア"] > t)
    model.mesh.bones_by_name["リビングドア"].quaternion.copy(y90)
  if (this["_脱衣所ドア"] > t)
    model.mesh.bones_by_name["脱衣所ドア"].quaternion.copy(y90n)
  if (this["_収納扉"]) {
    model.mesh.bones_by_name["収納扉1"].quaternion.copy(y90n)
    model.mesh.bones_by_name["収納扉2"].quaternion.copy(y90n)
    model.mesh.bones_by_name["収納扉3"].quaternion.copy(y90)
  }
};
  })()
    }

,"_chung_v012_CLEANED.pmx": {

  bone_constraint: {
  "スカート_0_0": { rotation:{ x:[[-20*Math.PI/180,0],[75*Math.PI/180]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],z:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"スカート_0_1": { rotation:{ x:[[-20*Math.PI/180,0],[75*Math.PI/180]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],z:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"スカート_0_7": { rotation:{ x:[[-20*Math.PI/180,0],[75*Math.PI/180]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],z:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"スカート_0_3": { rotation:{ x:[[-75*Math.PI/180],[20*Math.PI/180,0]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],z:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"スカート_0_4": { rotation:{ x:[[-75*Math.PI/180],[20*Math.PI/180,0]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],z:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"スカート_0_5": { rotation:{ x:[[-75*Math.PI/180],[20*Math.PI/180,0]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],z:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"スカート_0_2": { rotation:{ z:[[-20*Math.PI/180,0],[75*Math.PI/180]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],x:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"スカート_0_6": { rotation:{ z:[[-75*Math.PI/180],[20*Math.PI/180,0]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],x:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }

 ,"スカート_1_0": { rotation:{ x:[[-20*Math.PI/180,0],[75*Math.PI/180]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],z:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"スカート_1_1": { rotation:{ x:[[-20*Math.PI/180,0],[75*Math.PI/180]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],z:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"スカート_1_7": { rotation:{ x:[[-20*Math.PI/180,0],[75*Math.PI/180]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],z:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"スカート_1_3": { rotation:{ x:[[-75*Math.PI/180],[20*Math.PI/180,0]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],z:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"スカート_1_4": { rotation:{ x:[[-75*Math.PI/180],[20*Math.PI/180,0]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],z:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"スカート_1_5": { rotation:{ x:[[-75*Math.PI/180],[20*Math.PI/180,0]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],z:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"スカート_1_2": { rotation:{ z:[[-20*Math.PI/180,0],[75*Math.PI/180]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],x:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"スカート_1_6": { rotation:{ z:[[-75*Math.PI/180],[20*Math.PI/180,0]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],x:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }

 ,"スカート_2_0": { rotation:{ x:[[-20*Math.PI/180,0],[75*Math.PI/180]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],z:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"スカート_2_1": { rotation:{ x:[[-20*Math.PI/180,0],[75*Math.PI/180]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],z:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"スカート_2_7": { rotation:{ x:[[-20*Math.PI/180,0],[75*Math.PI/180]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],z:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"スカート_2_3": { rotation:{ x:[[-75*Math.PI/180],[20*Math.PI/180,0]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],z:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"スカート_2_4": { rotation:{ x:[[-75*Math.PI/180],[20*Math.PI/180,0]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],z:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"スカート_2_5": { rotation:{ x:[[-75*Math.PI/180],[20*Math.PI/180,0]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],z:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"スカート_2_2": { rotation:{ z:[[-20*Math.PI/180,0],[75*Math.PI/180]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],x:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"スカート_2_6": { rotation:{ z:[[-75*Math.PI/180],[20*Math.PI/180,0]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],x:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }

  }

// to make sure that every VMD has morph (at least a dummy)
 ,morph_default: {}
 ,material_para: {
//  _default_: { renderDepth:0 }
    "face": { transparent:false }
  }
// ,morph_filter: { test: function (name) { return (name.indexOf("照れ") == -1) } }
 ,rigid_filter: { test:function(name){return(/*name.indexOf("スカート")==-1 && */name.indexOf("リボン")==-1)} }

 ,skin_filter_by_motion: [
    { motion: { test: function (v) { return /PC combat/.test(MMD_SA_options.Dungeon.motion_id_by_filename[v]||""); } }, skin: {
  test: (function () {
var skin_list = ["左肩","左腕","左ひじ","左手首"];
return function (v) { return !(/X\-JOINT/.test(v) || (skin_list.indexOf(v) != -1)); };
  })()
    }}
  ]

 ,icon_path: System.Gadget.path + "/TEMP/DEMO/_chung_icon_64x64.png"
}

    ,"_teddygal_v012e_CLEANED.pmx": {
  morph_default:{
  "にやり":{ weight_scale:0.5 }
  }
 ,morph_translate: {
  "照れ1": "照れ"
  }
 ,material_para: {
  "body": { transparent:false }
 ,"頭": { transparent:false }
 ,"黒目": { renderDepth:500 }
 ,"白目": { transparent:false }
 ,"顔": { transparent:false }
//  "body - tatoo+": { renderDepth:1000 }
/*
 ,"黒目": { renderDepth:500 }
 ,"白目": { renderDepth:250 }
 ,"頭": { renderDepth:125 }
 ,"顔": { renderDepth:62 }
 ,"口内": { renderDepth:1 }
*/
// ,"照れ1": { renderDepth:1 }
// ,"照れ2": { renderDepth:1 }
  }
// ,morph_filter: { test: function (name) { return (name.indexOf("照れ") == -1) } }
    }

   ,"_0Ma_v06h_for_SA.pmx" : {
  morph_default: {
//  "High Heels OFF": { weight:1 }
    "Batgal": { weight:1 }
  }
 ,material_para: {
//frustumCulled:false
  "全裸": { transparent:false }
// ,"デフォルト_上着2": {}
// ,"目": { renderDepth:500 }
// ,"顔パーツ": { renderDepth:250 }
 ,"顔": { transparent:false }
 ,"ツイン0": { renderDepth:0 }
 ,"ツイン1": { renderDepth:0 }
// ,"eye_hi": { renderDepth:62 }
// ,"eye_hi2": { renderDepth:31 }
// ,"cheek": { renderDepth:1 }
// ,"マント": { castShadow:true }
// ,_default_: { castShadow:false }
  }
// ,morph_filter: { test: function (name) { return (name.indexOf("照れ") == -1) } }
 ,rigid_filter: /./
 ,icon_path: Settings.f_path + '\\images\\_ma_01_icon_64x64.png'
   }

   ,"_MissFoo_v09b_for_SA-CLEANED.pmx": {
// to make sure that every VMD has morph (at least a dummy)
  morph_default: {}
 ,material_para: {
  "顔": { transparent:false }
/*
  "目": { renderDepth:500 }
 ,"顔パーツ": { renderDepth:250 }
 ,"顔": { renderDepth:125 }
*/
  }
// ,morph_filter: { test: function (name) { return (name.indexOf("照れ") == -1) } }
    }

    ,"_Miss_Noodle_v06b_CLEANED.pmx": {
// to make sure that every VMD has morph (at least a dummy)
  morph_default: {}
 ,material_para: {
//  _default_: { renderDepth:10 }
  "肌": { transparent:false }
 ,"body - pants inner": { transparent:false }
 ,"顔": { transparent:false }
// ,"pants": { renderDepth:999999 }
  }
// ,morph_filter: { test: function (name) { return (name.indexOf("照れ") == -1) } }

// ,rigid_filter: /^DISABLED$/
// ,motion_name_default: "standby"
 ,icon_path: Settings.f_path + '\\images\\_miss_noodle_01_icon_64x64.png'
    }

    ,"天海春香セーラームーン.pmx" : {
// to make sure that every VMD has morph (at least a dummy)
  morph_default: {}
 ,material_para: {
  _default_: { castShadow:false, receiveShadow:false }
  }
    }

   ,"TdaMeiko_Bikini_TypeA.pmx" : {
// to make sure that every VMD has morph (at least a dummy)
  morph_default: {}
 ,material_para: {
  "face01": { transparent:false }
 ,"face00": { transparent:false }
 ,"face01白目": { transparent:false }
 ,"face01黒目": { transparent:false }
 ,"眉毛": { transparent:false }
 ,"まつ毛": { transparent:false }
 ,"まぶた": { transparent:false }
 ,"hair01": { transparent:false }
 ,"hair02": { transparent:false }
 ,"hair03": { transparent:false }
 ,"hair04": { transparent:false }
 ,"hair05": { transparent:false }
 ,"hair06": { transparent:false }
 ,"hair07": { transparent:false }
 ,"体": { transparent:false }
// ,"hairshadow": { renderDepth:0 }
// ,"cheek": { renderDepth:0 }
  }
 ,icon_path: Settings.f_path + '\\images\\_meiko_icon_64x64.png'
 ,boundingBox: { min: {x:-3.7866, y:-0.032, z:-0.641}, max: {x:3.7866, y:20.9321, z:1.1595} }
    }

   ,"TdaMiku_Bikini_TypeA.pmx" : {
// to make sure that every VMD has morph (at least a dummy)
  morph_default: {}
 ,material_para: {
  "face01": { transparent:false }
 ,"face00": { transparent:false }
 ,"body": { transparent:false }
 ,"bikini": { transparent:false }
 ,"eye_hi":  { ambient:[1,1,1], specular:[1,1,1] }
 ,"eye_hi2": { ambient:[1,1,1], specular:[1,1,1] }
// ,"hairshadow": { renderDepth:0 }
// ,"cheek": { renderDepth:0 }
// ,"hair01": { renderDepth:0 }
  }
    }

   ,"TdaHaku_Bikini_TypeB.pmx" : {
// to make sure that every VMD has morph (at least a dummy)
  morph_default: {}
 ,material_para: {
  "顔": { transparent:false }
 ,"体": { transparent:false }
 ,"目": { transparent:false }
 ,"まつ毛": { transparent:false }
 ,"顔パーツ": { transparent:false }
 ,"eye_hi":  { ambient:[1,1,1], specular:[1,1,1] }
 ,"eye_hi2": { ambient:[1,1,1], specular:[1,1,1] }
  }
    }

   ,"Tda式初音ミク・アペンド_Ver1.00.pmx" : {
// to make sure that every VMD has morph (at least a dummy)
  morph_default: {
   "AL未使用": { weight:1 }
  }
 ,material_para: {
  "face00": { transparent:false }
 ,"face01": { transparent:false }
 ,"hair00": { transparent:false }
 ,"skin": { transparent:false }
 ,"body00": { transparent:false }
// ,"eye_hi": { renderDepth:0 }
// ,"eye_hi": { renderDepth:0 }
// ,"hairshadow": { renderDepth:0 }
// ,"cheek": { renderDepth:0 }
  }

 ,icon_path: System.Gadget.path + '/images/icon_miku_64x64.png'
    }

   ,"Tda式改変ミク・アペンド・大人バージョンVer0.92.pmx" : {
// to make sure that every VMD has morph (at least a dummy)
  morph_default: {
   "AL未使用": { weight:1 }
  ,"巨乳": { weight:1 }
  ,"ちょっと大胆に(仮)": { weight:1 }
//  ,"更に大胆に！": { weight:1 }
  }
 ,material_para: {
  "face00": { transparent:false }
 ,"face01": { transparent:false }
 ,"eye": { transparent:false }
 ,"eyebrow": { transparent:false }
 ,"hair00": { transparent:false }
 ,"skin":  { transparent:false }
 ,"skin2": { transparent:false }
 ,"skin3": { transparent:false }
 ,"body00": { transparent:false }
 ,"body00_leg": { transparent:false }
 ,"body01a": { transparent:false }
 ,"body01b": { transparent:false }
 ,"body01c": { transparent:false }
// ,"eye_hi": { renderDepth:0 }
// ,"eye_hi": { renderDepth:0 }
// ,"hairshadow": { renderDepth:0 }
// ,"cheek": { renderDepth:0 }
  }

 ,icon_path: System.Gadget.path + '/images/icon_miku_64x64.png'
    }

   ,"鹿島(水着).pmx" : {
// to make sure that every VMD has morph (at least a dummy)
  morph_default: {}
 ,material_para: {
  "頭": { transparent:false }
 ,"顔": { transparent:false }
 ,"白目": { transparent:false }
 ,"黒目": { transparent:false }
 ,"後髪": { transparent:false }
 ,"前髪裏": { transparent:false }
 ,"ツインテ": { transparent:false }
 ,"パーカー": { transparent:false }
 ,"体": { transparent:false }
 ,"目影": { renderDepth:0 }
// ,"瞳1": { renderDepth:0 }
// ,"瞳2": { renderDepth:0 }
  }

     ,bone_constraint: {
  "左パーカー5-1": { rotation:{ x:[[-75*Math.PI/180],[20*Math.PI/180,0]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],z:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"右パーカー5-1": { rotation:{ x:[[-75*Math.PI/180],[20*Math.PI/180,0]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],z:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"左パーカー6-1": { rotation:{ x:[[-75*Math.PI/180],[20*Math.PI/180,0]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],z:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }

 ,"左パーカー5-2": { rotation:{ x:[[-75*Math.PI/180],[20*Math.PI/180,0]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],z:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"右パーカー5-2": { rotation:{ x:[[-75*Math.PI/180],[20*Math.PI/180,0]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],z:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"左パーカー6-2": { rotation:{ x:[[-75*Math.PI/180],[20*Math.PI/180,0]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],z:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }

 ,"左パーカー5-3": { rotation:{ x:[[-75*Math.PI/180],[20*Math.PI/180,0]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],z:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"右パーカー5-3": { rotation:{ x:[[-75*Math.PI/180],[20*Math.PI/180,0]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],z:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"左パーカー6-3": { rotation:{ x:[[-75*Math.PI/180],[20*Math.PI/180,0]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],z:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }

 ,"左パーカー5-4": { rotation:{ x:[[-75*Math.PI/180],[20*Math.PI/180,0]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],z:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"右パーカー5-4": { rotation:{ x:[[-75*Math.PI/180],[20*Math.PI/180,0]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],z:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"左パーカー6-4": { rotation:{ x:[[-75*Math.PI/180],[20*Math.PI/180,0]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],z:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }


 ,"左パーカー1-1": { rotation:{ z:[[-20*Math.PI/180,0],[75*Math.PI/180]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],x:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"左パーカー2-1": { rotation:{ z:[[-20*Math.PI/180,0],[75*Math.PI/180]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],x:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"左パーカー3-1": { rotation:{ z:[[-20*Math.PI/180,0],[75*Math.PI/180]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],x:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"左パーカー4-1": { rotation:{ z:[[-20*Math.PI/180,0],[75*Math.PI/180]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],x:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }

 ,"左パーカー2-2": { rotation:{ z:[[-20*Math.PI/180,0],[75*Math.PI/180]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],x:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"左パーカー3-2": { rotation:{ z:[[-20*Math.PI/180,0],[75*Math.PI/180]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],x:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"左パーカー4-2": { rotation:{ z:[[-20*Math.PI/180,0],[75*Math.PI/180]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],x:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }

 ,"左パーカー2-3": { rotation:{ z:[[-20*Math.PI/180,0],[75*Math.PI/180]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],x:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"左パーカー3-3": { rotation:{ z:[[-20*Math.PI/180,0],[75*Math.PI/180]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],x:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"左パーカー4-3": { rotation:{ z:[[-20*Math.PI/180,0],[75*Math.PI/180]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],x:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }

 ,"左パーカー2-4": { rotation:{ z:[[-20*Math.PI/180,0],[75*Math.PI/180]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],x:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"左パーカー3-4": { rotation:{ z:[[-20*Math.PI/180,0],[75*Math.PI/180]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],x:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"左パーカー4-4": { rotation:{ z:[[-20*Math.PI/180,0],[75*Math.PI/180]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],x:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }


 ,"右パーカー1-1": { rotation:{ z:[[-75*Math.PI/180],[20*Math.PI/180,0]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],x:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"右パーカー2-1": { rotation:{ z:[[-75*Math.PI/180],[20*Math.PI/180,0]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],x:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"右パーカー3-1": { rotation:{ z:[[-75*Math.PI/180],[20*Math.PI/180,0]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],x:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"右パーカー4-1": { rotation:{ z:[[-75*Math.PI/180],[20*Math.PI/180,0]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],x:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }

 ,"右パーカー2-2": { rotation:{ z:[[-75*Math.PI/180],[20*Math.PI/180,0]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],x:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"右パーカー3-2": { rotation:{ z:[[-75*Math.PI/180],[20*Math.PI/180,0]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],x:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"右パーカー4-2": { rotation:{ z:[[-75*Math.PI/180],[20*Math.PI/180,0]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],x:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }

 ,"右パーカー2-3": { rotation:{ z:[[-75*Math.PI/180],[20*Math.PI/180,0]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],x:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"右パーカー3-3": { rotation:{ z:[[-75*Math.PI/180],[20*Math.PI/180,0]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],x:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"右パーカー4-3": { rotation:{ z:[[-75*Math.PI/180],[20*Math.PI/180,0]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],x:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }

 ,"右パーカー2-4": { rotation:{ z:[[-75*Math.PI/180],[20*Math.PI/180,0]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],x:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"右パーカー3-4": { rotation:{ z:[[-75*Math.PI/180],[20*Math.PI/180,0]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],x:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"右パーカー4-4": { rotation:{ z:[[-75*Math.PI/180],[20*Math.PI/180,0]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],x:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }

/*
 ,"左パーカー1-2-1": { rotation:{ z:[[-20*Math.PI/180,0],[75*Math.PI/180]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],x:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"左パーカー1-2-2": { rotation:{ z:[[-20*Math.PI/180,0],[75*Math.PI/180]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],x:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"左パーカー1-2-3": { rotation:{ z:[[-20*Math.PI/180,0],[75*Math.PI/180]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],x:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }

 ,"右パーカー1-2-1": { rotation:{ z:[[-75*Math.PI/180],[20*Math.PI/180,0]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],x:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"右パーカー1-2-2": { rotation:{ z:[[-75*Math.PI/180],[20*Math.PI/180,0]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],x:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"右パーカー1-2-3": { rotation:{ z:[[-75*Math.PI/180],[20*Math.PI/180,0]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],x:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
*/
/*
 ,"左パーカー1-2": { rotation:{ z:[[-20*Math.PI/180,0],[75*Math.PI/180]], x:[[-20*Math.PI/180,0],[75*Math.PI/180]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"左パーカー1-3": { rotation:{ z:[[-20*Math.PI/180,0],[75*Math.PI/180]], x:[[-20*Math.PI/180,0],[75*Math.PI/180]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"左パーカー1-4": { rotation:{ z:[[-20*Math.PI/180,0],[75*Math.PI/180]], x:[[-20*Math.PI/180,0],[75*Math.PI/180]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }

 ,"右パーカー1-2": { rotation:{ z:[[-75*Math.PI/180],[20*Math.PI/180,0]], x:[[-20*Math.PI/180,0],[75*Math.PI/180]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"右パーカー1-3": { rotation:{ z:[[-75*Math.PI/180],[20*Math.PI/180,0]], x:[[-20*Math.PI/180,0],[75*Math.PI/180]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"右パーカー1-4": { rotation:{ z:[[-75*Math.PI/180],[20*Math.PI/180,0]], x:[[-20*Math.PI/180,0],[75*Math.PI/180]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
*/
      }

    }

   ,"_v05a_CLEANED.pmx" : {
// to make sure that every VMD has morph (at least a dummy)
  morph_default: {}
 ,skin_default: {
    "シャツ_8_3":  { rot:{x: 10, y:0, z:0} }
   ,"シャツ_9_3":  { rot:{x: 10, y:0, z:0} }
   ,"シャツ_10_3": { rot:{x: 10, y:0, z:0} }
   ,"シャツ_2_3":  { rot:{x:-10, y:0, z:0} }
   ,"シャツ_3_3":  { rot:{x:-10, y:0, z:0} }
   ,"シャツ_4_3":  { rot:{x:-10, y:0, z:0} }
   ,"シャツ_5_3":  { rot:{x:  0, y:0, z: 10} }
   ,"シャツ_6_3":  { rot:{x:  0, y:0, z: 10} }
   ,"シャツ_7_3":  { rot:{x:  0, y:0, z: 10} }
   ,"シャツ_11_3": { rot:{x:  0, y:0, z:-10} }
   ,"シャツ_0_3":  { rot:{x:  0, y:0, z:-10} }
   ,"シャツ_1_3":  { rot:{x:  0, y:0, z:-10} }
  }
 ,material_para: {
  "face00": { transparent:false }
 ,"face01": { transparent:false }
 ,"eye": { transparent:false }
 ,"skin": { transparent:false }
 ,"skin2": { transparent:false }
 ,"pants": { transparent:false }
 ,"hair01": { transparent:false }
 ,"hair02": { transparent:false }
 ,"hair03": { transparent:false }
 ,"hair05": { transparent:false }
 ,"hair06": { transparent:false }
 ,"hairshadow": { renderDepth:0 }
 ,"cheek": { renderDepth:0 }
 ,"eye_hi":  { ambient:[1,1,1], specular:[1,1,1] }
 ,"eye_hi2": { ambient:[1,1,1], specular:[1,1,1] }
 ,_default_: { castShadow:false }
  }
 ,rigid_filter: /^DISABLED$/
//{ test: function (v) { return (v.indexOf("シャツ") == -1); } }
// ,edgeScale: 0
 ,icon_path: Settings.f_path + '\\images\\_sauwai_icon_64x64.png'
    }

   ,"モードレッド・ペンドラゴン（私服）Ver0.93.pmx": {
// to make sure that every VMD has morph (at least a dummy)
  morph_default: {}
 ,material_para: {
  "Brow": { transparent:false }
 ,"Eyes": { transparent:false }
 ,"Face": { transparent:false }
 ,"Face_noline": { transparent:false }
  }
    }

   ,"TDA Haku Office Ver 1 (No Glasse).pmx": {
// to make sure that every VMD has morph (at least a dummy)
  morph_default: {}
 ,material_para: {
  "face00": { transparent:false }
 ,"face01": { transparent:false }
 ,"outfit01": { transparent:false }
 ,"outfit02": { transparent:false }
 ,"outfit03": { transparent:false }
 ,"outfit04": { transparent:false }
 ,"outfit05": { transparent:false }
 ,"outfit06": { transparent:false }
  }
// ,rigid_filter: { test: function (v) { return v.indexOf("胸")==-1; } }
 ,skin_filter_by_motion: [
    { motion:/run_H57_f0-20|tsuna_small_jump/, skin:{ test: function (v) { return v.indexOf("胸")==-1; } } }
  ]
    }

   ,"TdaRin_Bikini_TypeDS_SauWai.pmx" : {
// to make sure that every VMD has morph (at least a dummy)
  morph_default: {}
 ,skin_default: {
    "スカート_0_0": { rot:{x: 20, y:0, z:0} }
   ,"スカート_0_1": { rot:{x: 20, y:0, z:0} }
   ,"スカート_0_7": { rot:{x: 20, y:0, z:0} }
   ,"スカート_0_3": { rot:{x:-20, y:0, z:0} }
   ,"スカート_0_4": { rot:{x:-20, y:0, z:0} }
   ,"スカート_0_5": { rot:{x:-20, y:0, z:0} }
   ,"スカート_0_2": { rot:{x:  0, y:0, z:-10} }
   ,"スカート_0_6": { rot:{x:  0, y:0, z: 10} }
  }
 ,material_para: {
  "face00": { transparent:false }
 ,"face01": { transparent:false }
 ,"face01白目": { transparent:false }
 ,"face01黒目": { transparent:false }
 ,"身体": { transparent:false }
 ,"hair01": { transparent:false }
 ,"hair02": { transparent:false }
 ,"hair03": { transparent:false }
 ,"hair05": { transparent:false }
 ,"hair06": { transparent:false }
 ,"sスカート": { transparent:false }
 ,"sニーハイ": { transparent:false }
 ,"s手袋L": { transparent:false }
 ,"hairshadow": { renderDepth:0 }
 ,"cheek": { renderDepth:0 }
 ,"eye_hi":  { ambient:[1,1,1], specular:[1,1,1] }
 ,"eye_hi2": { ambient:[1,1,1], specular:[1,1,1] }
  }
 ,rigid_filter: { test: function (v) { return (v.indexOf("スカート") == -1); } }
// ,edgeScale: 0
 ,icon_path: Settings.f_path + '\\images\\_sauwai_icon_64x64.png'
    }

   ,"十六夜咲夜Ver2.10_Type-S(ダンス_チャイナドレス-ミニ_ハイヒールサンダル).pmx" : {
// to make sure that every VMD has morph (at least a dummy)
  morph_default: {}
 ,material_para: {
  "顔": { transparent:false }
 ,"白目": { transparent:false }
 ,"瞳": { transparent:false }
 ,"眉、まつ毛、鼻エッジ、口輪郭": { transparent:false }
 ,"髪": { transparent:false }
 ,"瞳ハイライト": { renderDepth:0 }
 ,"前髪シャドウ": { renderDepth:0 }
 ,"頬の赤、青ざめ": { renderDepth:0 }
 ,"前髪(半透明)": { renderDepth:0 }
  }
    }
  }

 ,motion: [

//  { path:System.Gadget.path + '/MMD.js/motion/stand.vmd'}
//  { path:System.Gadget.path + '/MMD.js/motion/swing.vmd'}
//  { path:System.Gadget.path + '/MMD.js/motion/standmix2_modified.vmd'}
//  { path:System.Gadget.path + '/MMD.js/motion/tsuna/standby.vmd'}
null
//  { path:Settings.f_path + '/motion/_sleep90.vmd'}

   ,{
      path:System.Gadget.path + '/MMD.js/motion/motion_demo_pack01.zip#/demo/magic_of_xyz/magic_of_xyz.vmd'
    }

   ,{
      path:System.Gadget.path + '/MMD.js/motion/demo/HeartBeats配布用.vmd'
    }

   ,{
      path:System.Gadget.path + '/MMD.js/motion/motion_demo_pack01.zip#/demo/suki_yuki_maji_magic/suki_yuki_maji_magic.vmd'
    }

   ,{
      path:System.Gadget.path + '/MMD.js/motion/motion_demo_pack01.zip#/demo/galaxias_motion/galaxias_miku_v2.vmd'
    }

   ,{
      path:System.Gadget.path + '/MMD.js/motion/demo/after_school_stride/after_school_stride.vmd'
    }

   ,{
      path:'F:\\MMD\\motions\\シューティングスター/SS_準標準ボーン必須.vmd'
    }

   ,{
      path:System.Gadget.path + '/MMD.js/motion/demo/HAL Dance.vmd'
    }

   ,{
      path:System.Gadget.path + '/MMD.js/motion/demo/恋空予報モーション.vmd'
    }

//   ,{ path:Settings.f_path + '/motion/sweetmagic-left.vmd' }
   ,{
      path:System.Gadget.path + '/MMD.js/motion/motion_demo_pack01.zip#/demo/STEP/1_step-motion1.vmd'
    }

   ,{
      path:System.Gadget.path + '/MMD.js/motion/demo/wavefile_motion/wavefile_lat.vmd'
    }

   ,{
      path:System.Gadget.path + '/MMD.js/motion/demo/HCPえりかver（Lat式用）.vmd'
    }

   ,{
      path:System.Gadget.path + '/MMD.js/motion/demo/てるてる(通常モデル用).vmd'
    }

   ,{
      path:System.Gadget.path + '/MMD.js/motion/demo/まっさらブルージーンズ.vmd'
    }

   ,{
      path:System.Gadget.path + '/MMD.js/motion/demo/love&joyお面無しver.vmd'
    }

//15

   ,{
      path:System.Gadget.path + '/MMD.js/motion/motion_demo_pack01.zip#/demo/mozuya/monstar.vmd'
    }

   ,{
      path:System.Gadget.path + '/MMD.js/motion/motion_demo_pack01.zip#/demo/mozuya/Walka_Not_A_Talka.vmd'
    }

   ,{
      path:System.Gadget.path + '/MMD.js/motion/motion_demo_pack01.zip#/demo/mozuya/louboutins.vmd'
    }

   ,{
      path:System.Gadget.path + '/MMD.js/motion/motion_demo_pack01.zip#/demo/mozuya/black_n_gold.vmd'
    }

   ,{
      path:'F:\\MMD\\motions\\百舌谷 - motion\\motion\\Ass_On_The_Floor.vmd'
    }


   ,{
      path:'F:\\MMD\\motions\\メダモーション\\メダロット・ハク.vmd'
    }

   ,{
      path:'F:\\MMD\\motions\\Circus - Britney Spears\\Circus\\circus.vmd'
    }

   ,{
      path:System.Gadget.path + '/MMD.js/motion/motion_demo_pack01.zip#/demo/lupin/lupin.vmd'
    }

   ,{
      path:'F:\\MMD\\motions\\Good Feeling\\Good Feeling - Flo Rida\\Good Feeling.vmd'
    }

   ,{
      path:'F:\\MMD\\motions\\It makes me ill - NSYNC\\It makes me ill - modified.vmd'
    }

   ,{
      path:'F:\\MMD\\motions\\Do What U Want モーションセット（配布用）\\Do What U Want モーションセット\\DoWhatUWant（ダンスモーション）.vmd'
    }

   ,{
      path:'F:\\MMD\\motions\\SlavetotheRhythm\\SlavetotheRhythmダンス.vmd'
    }

   ,{
      path:'F:\\MMD\\motions\\Bout it - Yung Joc feat. 3LW\\bout it.vmd'
    }


   ,{
      path:'F:\\MMD\\motions\\Tipsy - J-Kwon\\Tipsy.vmd'
    }

   ,{
      path:'F:\\MMD\\motions\\ゆっきゆっきゆっきダンス・ライクーP\\ゆっきゆっきゆっきダンス・ライクーP.vmd'
    }

// 30

   ,{
      path:'F:\\MMD\\motions\\Bubbletop配布用\\Bubbletopモーション.vmd'
    }

// must-load list
// ,{ must_load:true, no_shuffle:true, path:'C:\\Users\\User\\Downloads\\MikuMikuDanceE_v739\\MikuMikuDanceE_v739\\UserFile\\Motion\\Muuubu Rin -Append-\\motion_BAL3.vmd'}

  ]


// ,motion_shuffle_pool_size: 9
// ,motion_shuffle: [1,3,3+15, 0+15,1+15,2+15, 30,9,4]//7+15,9,4]

 ,motion_shuffle_pool_size: 9
 ,motion_shuffle: [1,3,3+15, 0+15,1+15,2+15, 7+15,9,4]

//,motion_shuffle_pool_size: 9 +5
//,motion_shuffle: [0+15,1+15,2+15, 7+15,9,6, 3+15,4+15,6+15, 4,12+15,9+15,1,3]

// ,motion_shuffle_pool_size: 9
// ,motion_shuffle: [1,3,3+15, 0+15,1+15,4+15, 6,9,4]

// ,motion_shuffle_list_default: [0]

// ,motion_shuffle_list: [4,4,4,4,4,4,4,4]

 ,motion_shuffle_by_song_name: {
  }

//,random_range_disabled:true


 ,motion_para: {
    "stand" : { onended: function () { MMD_SA._no_fading=true; } }
   ,"standmix" : { onended: function () { MMD_SA._no_fading=true; } }
   ,"_sleep90" : { onended: function () { MMD_SA._no_fading=true; } }

   ,"恋はきっと☆まままＧＵＭＩ用 - modified" : { loop:[1,2], range:[{time:[4079,4278]}], BPM:{rewind:true, BPM: 143, beat_frame: 13 +60/143*30} }
   ,"真ん中_0-250_v2_GUMI" : { loop:[2,2], range:[{time:[0,150+22]}], BPM:{rewind:true, BPM: 115, beat_frame: 134} }
   ,"メダロット・ハク" : { loopback_fading:true, BPM:{rewind:true, BPM: 111.87, beat_frame: 204} }
   ,"after_school_stride" : { center_view:[-2.5,0,7.5], loopback_fading:true, BPM:{rewind:true, BPM: 112.5, beat_frame: 287} }
   ,"Masked bitcH" : { loopback_fading:true, BPM:{rewind:true, BPM: 125, beat_frame: 431} }
   ,"HAL Dance" : { center_view:[0,0,2.5], range:[{time:[407,0]}], loopback_fading:true, BPM:{rewind:true, BPM: 97.54*1.5, beat_frame: 446} }
   ,"Telephoneダンスモーション" : { loopback_fading:true, BPM:{rewind:true, BPM: 122, beat_frame: 4025} }
   ,"GetLucky(MP3)" : { range:[{time:[591,0]}], BPM:{rewind:true, BPM: 117.06, beat_frame: 767} }
   ,"It makes me ill - modified" : { loopback_fading:true, BPM:{rewind:true, BPM: 104.5, beat_frame: 119} }
   ,"magic_of_xyz" : { center_view:[0,0,2.5], loopback_fading:true, BPM:{rewind:true, BPM: 130, beat_frame: 498} }
   ,"monstar" : { center_view:[0,0,20], loopback_fading:true, BPM:{rewind:true, BPM: 116.03, beat_frame: 273} }
   ,"Walka_Not_A_Talka" : { center_view:[0,0,10], loopback_fading:true, BPM:{rewind:true, BPM: 106.7, beat_frame: 696} }
   ,"Ass_On_The_Floor" : { center_view:[-10,0,10], loopback_fading:true, BPM:{rewind:true, BPM: 127.03, beat_frame: 840} }
   ,"black_n_gold" : { center_view:[-2.5,0,12.5], loopback_fading:true, BPM:{rewind:true, BPM: 136.01, beat_frame: 96} }
   ,"louboutins" : { loopback_fading:true, BPM:{rewind:true, BPM: 105.03, beat_frame: 110} }
   ,"HeartBeats配布用" : { loopback_fading:true, range:[{time:[120,120+(30*(60+54)+21)]},{time:[120+(30*(180+31)),120+(30*(300)+10)]}], BPM:{rewind:true, BPM: 128.01, beat_frame: 820} }
   ,"circus" : { center_view:[-5,0,12.5], loopback_fading:true, range:[{time:[120,0]}], BPM:{rewind:true, BPM: 115, beat_frame: 834, match_even_beats_only:true} }
   ,"matryoshka_motion_0-5151" :  { center_view:[0,0,15], loopback_fading:true, range:[{time:[210,210+(30*(120+23)+10)]}], BPM:{rewind:true, BPM: 102.48, beat_frame: 959} }
   ,"musclecar" : { center_view:[2.5,0,5], loopback_fading:true, range:[{time:[300,0]}], BPM:{rewind:true, BPM: 129.13, beat_frame: 1055} }
   ,"まっさらブルージーンズ" : { center_view:[0,0,2.5], loopback_fading:true, range:[{time:[300,0]}], BPM:{rewind:true, BPM: 154.97, beat_frame: 704} }
   ,"sweetmagic-left" : { center_view:[-10,0,0], loopback_fading:true, BPM:{rewind:true, BPM: 123, beat_frame: 884} }
   ,"てるてる(通常モデル用)" : { center_view:[0,0,2.5], loopback_fading:true, range:[{time:[300,0]}], BPM:{rewind:true, BPM: 170.02, beat_frame: 1587} }
   ,"wavefile_lat" : { loopback_fading:true, range:[{time:[30,0]}], BPM:{rewind:true, BPM: 135.01, beat_frame: 427} }
   ,"love&joyお面無しver" : { center_view:[0,0,2.5], loopback_fading:true, range:[{time:[600,600+(30*(60+46)+2)]},{time:[600+(30*(120+8)+8),7780]}], BPM:{rewind:true, BPM: 173.03, beat_frame: 1393} }
   ,"HCPえりかver（Lat式用）" : { center_view:[0,0,0], loopback_fading:true, range:[{time:[90,0]}], BPM:{rewind:true, BPM: 164.01, beat_frame: 206} }
   ,"suki_yuki_maji_magic" : { center_view:[0,0,0], loopback_fading:true, range:[{time:[0,6145]}], BPM:{rewind:true, BPM: 167.02, beat_frame: 101} }
   ,"SS_準標準ボーン必須" : { center_view:[0,0,0], loopback_fading:true, range:[{time:[12*30,(2*60+33)*30]},{time:[(2*60+44)*30,0]}], BPM:{rewind:true, BPM: 144.01, beat_frame: 652+1} }
   ,"Tipsy" : { center_view:[0,0,15], loopback_fading:true, range:[{time:[133,0]}], BPM:{rewind:true, BPM: 93*1.5, beat_frame: 193} }
   ,"bout it" : { center_view:[0,0,12.5], loopback_fading:true, BPM:{rewind:true, BPM: 100*1.5, beat_frame: 306} }
   ,"恋空予報モーション" : { center_view:[0,0,0], loopback_fading:true, BPM:{rewind:true, BPM: 132.02, beat_frame: 110} }
   ,"SlavetotheRhythmダンス" :  { center_view:[0,0,7.5], loopback_fading:true, range:[{time:[230,1635]}], BPM:{rewind:true, BPM: 128, beat_frame: 480} }
   ,"DoWhatUWant（ダンスモーション）" : { center_view:[0,0,30], loopback_fading:true, range:[{time:[524,2470]}], BPM:{rewind:true, BPM: 97.51, beat_frame: 650} }
   ,"nyan - modified" : { center_view:[0,0,0], range:[{time:[282,1093]}], BPM:{rewind:true, BPM: 142.01, beat_frame: 282} }
   ,"lupin" : { center_view:[0,0,25], loopback_fading:true, range:[{time:[90,0]}], BPM:{rewind:true, BPM: 136.01, beat_frame: 1697} }
   ,"galaxias_miku_v2" : { center_view:[0,0,5], loopback_fading:true, range:[{time:[450,0]}], BPM:{rewind:true, BPM: 122.99, beat_frame: 835} }
   ,"Good Feeling" : { center_view:[-10,0,7.5], loopback_fading:true, range:[{time:[672,0]}], BPM:{rewind:true, BPM: 128, beat_frame: 1159} }
   ,"1_step-motion1" : { loopback_fading:true, BPM:{rewind:true, BPM: 123, beat_frame: 38} }
   ,"ゆっきゆっきゆっきダンス・ライクーP" : { loopback_fading:true, BPM:{rewind:true, BPM: 125.98, beat_frame: 190} }

   ,"Bubbletopモーション": { loopback_fading:true, BPM:{rewind:true, BPM: 124, beat_frame: 582} }

//   ,"私の時間_short_Lat式ミク - with skirt physics" : { BPM:{rewind:true, BPM: 145, beat_frame: 603} }

//   ,"Viva Happy Motion (Imai)" : { BPM:{rewind:true, BPM: 147.98, beat_frame: 657} }
//   ,"tik tok" : { center_view:[0,0,0], loopback_fading:true, BPM:{rewind:true, BPM: 120*1.03, beat_frame: 142} }
//   ,"nekomimi_lat" : { center_view:[0,0,0], loopback_fading:true, range:[{time:[30,30+(30*(60+59)+27)]}], BPM:{rewind:true, BPM: 160, beat_frame: 1124} }
//   ,"you make me happy rea - MODIFIED" : { center_view:[0,0,0], loopback_fading:true, range:[{time:[0,0]}], BPM:{rewind:true, BPM: 124.06, beat_frame: 338} }

   ,"standmix2_modified" : { adjust_center_view_disabled:true, onended: function () { MMD_SA._no_fading=true; } }

   ,"_cover_undies_blush" : {
  adjustment_per_model: {
    "_Miss_Noodle_v06b_CLEANED.pmx" : {
  skin_default: {
    "左腕": { rot_add: {x:-7.5, y:0, z:0} }
   ,"右腕": { rot_add: {x:-7.5, y:0, z:0} }
  }
    }
  }
    }

   ,"run_H26_f20-60" : { adjust_center_view_disabled:true, onended: function () { MMD_SA._no_fading=true; } }
   ,"run_H16_f0-40" : { adjust_center_view_disabled:true, onended: function () { MMD_SA._no_fading=true; } }

   ,"walk_A01_f0-40_s9.85": { model_index_list:[1], adjust_center_view_disabled:true, onended: function () { MMD_SA._no_fading=true; }
 ,adjustment_per_model: {
    _default_ : {
  skin_default: {
    "センター": { pos_add: {x:0, y:0, z:1.5} }
  }
    }
  }
    }

   ,"xs-talk8-west-negotiate": { model_index_list:[1], onended: function () { MMD_SA._no_fading=true; }
 ,adjustment_per_model: {
    _default_ : {
  skin_default: {
    "全ての親": { keys:[{ pos:{x:1.05, y:0, z:-8.72}, rot:{x:0, y:89, z:0} }] }
  }
    }
  }
    }

   ,"camera_appeal03" : {
  loop:[1,1]
 ,onended: function (last_frame) { MMD_SA._no_fading=last_frame&&(!this.loop||this.loop_count); }

 ,click_disabled: true

 ,adjustment_per_model: {
    _default_ : {
  skin_default: {
  "全ての親": { pos_add:{ x:11.09-2-12, y:6.05+2+1, z:2 }, rot_add:{ x:0, y:175.3+20-45, z:0 } }

 ,"左ひじ": { rot_add:{x:0, y:0, z:-7.5}, model_filter:{test:function(v){return (v.indexOf('TdaMiku_Bikini_TypeA')==-1)}} }
 ,"右ひじ": { rot_add:{x:0, y:0, z: 7.5}, model_filter:{test:function(v){return (v.indexOf('TdaMiku_Bikini_TypeA')==-1)}} }
 ,"髪１": { rot:{ x:-90, y:0, z:0 }, model_filter:/TdaHaku_Bikini_TypeB/ }
 ,"首": { rot_add:{ get x() {
var f = this._frame_
return (((f>=308)&&(f<=658)) ? 15 : 5)
    }, y:0, z:0 } } 
  }
 ,morph_default:{
  "あ":{weight_scale:2/3}
 ,"素足":{weight:1}
 ,"Hide backhair":{weight:1}
  }
    }
   ,"TdaRin_Bikini_TypeDS_SauWai.pmx" : {
  skin_default: {
  "全ての親": { pos_add:{ x:11.09-2-12, y:6.05+2+1, z:2 }, rot_add:{ x:0, y:175.3+20-45, z:0 } }

 ,"左ひじ": { rot_add:{x:0, y:0, z:-7.5} }
 ,"右ひじ": { rot_add:{x:0, y:0, z: 7.5} }
 ,"首": { rot_add:{x:15, y:0, z:0} }
  }
 ,morph_default:{
  "あ":{weight_scale:2/3}
  }
    }
   ,"_0Ma_v06h_for_SA.pmx" : {
  skin_default: {
  "全ての親": { pos_add:{ x:11.09-2-12, y:6.05-0.25+3, z:2-2 }, rot_add:{ x:0, y:175.3+20-45, z:0 } }
 ,"左ひじ": { rot_add:{x:0, y:0, z:-2.5} }
 ,"右ひじ": { rot_add:{x:0, y:0, z: 2.5} }
 ,"首": { rot_add:{ get x() {
var f = this._frame_
return (((f>=308)&&(f<=658)) ? 25 : 10)
    }, y:0, z:0 } } 
  }
 ,morph_default:{
  "あ":{weight_scale:2/3}
 ,"High Heels OFF": { weight:1 }
  }
    }
   ,"TdaTeto_Bikini_TypeC.pmx" : {
  skin_default: {
  "全ての親": { pos_add:{ x:11.09-2-12, y:6.05+2+3, z:2 }, rot_add:{ x:0, y:175.3+20-45, z:0 } }
 ,"左ひじ": { rot_add:{x:0, y:0, z:-10} }
 ,"右ひじ": { rot_add:{x:0, y:0, z: 10} }
 ,"首": { rot_add:{ get x() {
var f = this._frame_
return (((f>=308)&&(f<=658)) ? 30 : 10)
    }, y:0, z:0 } } 
  }
 ,morph_default:{
  "あ":{weight_scale:2/3}
  }
    }
   ,"鹿島(水着).pmx" : {
  skin_default: {
  "全ての親": { pos_add:{ x:11.09-2-12, y:6.05+1+3, z:2 }, rot_add:{ x:0, y:175.3+20-45, z:0 } }
 ,"左ひじ": { rot_add:{x:0, y:0, z: 2.5} }
 ,"右ひじ": { rot_add:{x:0, y:0, z:-2.5} }
 ,"首": { rot_add:{x:-10, y:0, z:0} }
  }
 ,morph_default:{
  "あ":{weight_scale:2/3}
  }
    }
   ,"プリンツ・オイゲン（セーラー）.pmx" : {
  skin_default: {
  "全ての親": { pos_add:{ x:11.09-2-12, y:6.05+1+3, z:2 }, rot_add:{ x:0, y:175.3+20-45, z:0 } }
 ,"左ひじ": { rot_add:{x:0, y:0, z:-5} }
 ,"右ひじ": { rot_add:{x:0, y:0, z: 5} }
  }
 ,morph_default:{
  "あ":{weight_scale:2/3}
  }
    }
  }

// ,center_view: [0,0-2.5-5-1.25,-30] ,center_view_lookAt: [20,5-5+1.5,20-1.5] ,SpeechBubble_pos_mod: [-8-4,6-1,10]
// ,center_view: [0,0,-20-2.5] ,center_view_lookAt: [20,0,10+2.5] ,SpeechBubble_pos_mod: [-12,2,11]

 ,look_at_screen_bone_list: [
  { name:"両目", weight_screen:0.15, weight_motion:1 }
  ]

 ,IK_disabled: { test: function (name) { return (name.indexOf("足ＩＫ")!=-1) || (name.indexOf("つま先ＩＫ")!=-1); } }
    }

  }

 ,custom_action: [
  "cover_undies"
  ]

 ,use_CircularSpectrum: true
 ,CircularSpectrum_position: [0,15,-5]

 ,look_at_screen: true

// ,center_view: [0,0,20]//[0,5,0]
// ,camera_position: [10,20,20]

// ,light_position: [50,50,50]

 ,edgeScale: 0.75

 ,MME: {
    PostProcessingEffects: {
  enabled: 1
 ,effects: [
{name:"JustSnow", enabled:0}
  ]
    }
  }

 ,use_speech_bubble: true
 ,onstart: function () {
MMD_SA_options.custom_action[MMD_SA_options.custom_action.length-1]._onmessage = function () {
  if (MMD_SA._hit_hip_) {
  }
  else {
//    MMD_SA.SpeechBubble.message(1, "痴線! 點解我FEEL倒好似有人昅野咁架!? ><")
  }
}
  }

// ,light_position_scale:20

// ,camera_param: 'near:10; far:100;'

// END
};

(function () {
  if (browser_native_mode && !webkit_window) {
    MMD_SA_options.width  = screen.availWidth
    MMD_SA_options.height = screen.availHeight
  }
  else if (browser_native_mode) {
    MMD_SA_options.width  = 1280
    MMD_SA_options.height = 720
  }
  else {
    MMD_SA_options.width  = 1280//screen.availWidth*0.75
    MMD_SA_options.height = 720//screen.availHeight*0.75
  }

  Settings_default._custom_.EventToMonitor = "SOUND_ALL"
  Settings_default._custom_.Use30FPS = "non_default"
  if (use_SA_browser_mode && !is_SA_child_animation)
    Settings_default._custom_.WallpaperAsBG = "non_default"
  Settings_default._custom_.Display = "-1"

  if (is_SA_child_animation)
    parent.DragDrop.relay_id = SA_child_animation_id

  self.SA_wallpaper_src = System.Gadget.path + "\\TEMP\\DEMO\\bg_ATWO3D_poster00_c80.jpg"


// dungeon options START

MMD_SA_options.Dungeon_options = {

  game_id: "ATWO-beta-0.0.1"

 ,use_PC_click_reaction_default:true
 ,combat_mode_enabled:true

 ,sound: [
    {
      url: System.Gadget.path + "/TEMP/DEMO/music/stranger_things_remix.aac"
     ,channel: "BGM_ST"
     ,loop: true
    }
  ]

 ,grid_material_list: []

 ,multiplayer: {
    OPC_list: [
      {
        path: System.Gadget.path + "/TEMP/DEMO/models/Rin.aes.zip#/Rin_x0.95.pmx"
//       ,para: {}
      }
     ,{
        path: System.Gadget.path + "/TEMP/DEMO/models/kaban.aes.zip#/かばんちゃん.pmx"
//       ,para: {}
      }
    ]
  }

 ,object_base_list: [
//0
    {
//  path: "F:\\MMD\\stages\\カモメ町１．０２\\カモメ町1.02_v00.x"

// bb: x-773, z-1022
  path: System.Gadget.path + '/TEMP/DEMO/models/sorairo1.52.aes.zip#/sorairo1.52_v02.x'

//  path: 'F:\\MMD\\accessories\\SF-asian-town\\asian_town_x500_v01.zip#\\asian_town_x500_v01.x'
//  path: 'F:\\MMD\\stages\\kelorin3_forMMD_beta2.0\\kr3_v02.x'
//  path: 'F:\\MMD\\stages\\古や村\\古や村_集落セットv1.62\\古や村_雪_v1.0.x'//29
//  path: 'F:\\MMD\\stages\\MMDオークランド0.7セット\\MMD_Auckland_0.7\\MMDオークランド_0.7_メインストリート中心部_v00.x'

//  path: 'F:\\MMD\\stages\\人里ver0.77\\人里_v01.x'
//  path: 'F:\\MMD\\stages\\ガレキ町1.4forMMD\\ガレキ町1.4forMMD\\ガレキ町1.4forMMD.aes.zip#\\ガレキ町１．4_v03.x'
//path: 'F:\\MMD\\stages\\プライベートプール\\プライベートプール.x'
//  path: 'F:\\MMD\\stages\\寂れたアパート通り\\寂れたアパート通り_通常版_v00.x'

//  path: 'F:\\MMD\\stages\\モブハッタン1950ステージセット\\モブハッタン1950ステージ\\モブハッタン1950ステージ_v01.x'

 ,construction: {
    receiveShadow: true
   ,castShadow: true
  }
 ,view_distance: 999
 ,placement: {
    grid_id: 2
//寂れたアパート通り_通常版_v00.x
//,scale: 20
//,scale:0.5
   ,can_overlap: true
  }
 ,collision_by_mesh: true
 ,collision_by_mesh_sort_range: 64
 ,collision_by_mesh_enforced: true
// ,collision_by_mesh_material_index_max: 29
// ,collision_by_mesh_face_grounded: function (face, y) { return (face.normal.y > ((face.materialIndex == 7) ? 0.5 : y)); }

//sorairo1.52
 ,collision_by_mesh_ground_limit: -(8.02477-0.0001)*10

    }
//1
   ,{ character_index:1 }// ,use_combat_motion:true }
  ]

 ,item_base: {
    "jukebox": {
      icon_path: System.Gadget.path + '\\images\\_dungeon\\phonograph-icon_64x64.png'
     ,info_short: "??????"
     ,stock_max: 1
     ,stock_default: 1
     ,action: {
  func: function () {
MMD_SA_options.Dungeon.run_event("jukebox")
  }
// ,anytime: true
      }
    }
  }

 ,events_default: {
    "jukebox": [
//0
      [
        {
          func: (function () {
            var upsidedown_mode = false

            return function () {
var d = MMD_SA_options.Dungeon
if (d.area_id != "start")
  return

var options_area = MMD_SA_options.Dungeon_options.options_by_area_id[d.area_id]

var jukebox = MMD_SA_options._jukebox
var BPM_music_mode = Audio_BPM.vo.BPM_mode || Audio_BPM.vo.motion_by_song_name_mode
if (!upsidedown_mode) {//(jukebox.paused || jukebox.ended) {
  upsidedown_mode = true
  if (!BPM_music_mode) {
    MMD_SA.music_mode = true
    d.sound.pause_channel("BGM", true)
    d.sound.resume_channel("BGM_ST")
    d.sound.audio_object_by_name["stranger_things_remix"].play()
  }

//MMD_SA.scene.fog.density=0.005;
var r = 64*8//d.grid_size*d.view_radius
MMD_SA.scene.fog.near=r*0.25; MMD_SA.scene.fog.far=r*0.9; MMD_SA.scene.fog.color=new THREE.Color("#000");
jThree("#pointlight_main").three(0).intensity=1;
jThree("#pointlight_main").three(0).near = jThree("#pointlight_main").three(0).far = (r*100*4*2);
jThree("#MMD_AmbLight").three(0).color = new THREE.Color(MMD_SA_options.Dungeon_options.options_by_area_id["start"].ambient_light_color || MMD_SA_options.ambient_light_color)
jThree("#MMD_DirLight").three(0).color = new THREE.Color(MMD_SA_options.Dungeon_options.options_by_area_id["start"].light_color || MMD_SA_options.light_color)
if (options_area.skydome) {
  options_area.skydome.texture_index=0;
  options_area.skydome.texture_setup();
}
var PPE = MMD_SA_options.MME.PostProcessingEffects
PPE.use_BloomPostProcess = false
var JustSnow = PPE._effects["JustSnow"]
if (JustSnow) {
  JustSnow.enabled = true
  MMD_SA.MME_composer_disabled_check(PPE._composers_list[JustSnow._composer_index])
  MMD_SA.MME_set_renderToScreen()
}

//d.object_list[1]._obj_proxy.hidden = false
//d.object_list[1]._obj_proxy.visible = true
//setTimeout(function () { MMD_SA.SpeechBubble.message(1, ((MMD_SA_options.Dungeon.object_list[2]._obj.position.distanceTo(THREE.MMD.getModels()[0].mesh.position)<256)?"我感應倒大亨响呢個空間不遠處...":"!?!?"), 3000) }, 100)

setTimeout(function () { MMD_SA.SpeechBubble.message(1, "!?!?", 3000) }, 100)

  DEBUG_show("Jukebox:PLAYING", 3)

if (!d.event_flag["mrs_ma"])
  return
d.object_base_list[2].object_list.forEach(function (obj) {
  obj._obj_proxy.hidden = !obj.user_data.upsidedowned
  obj._obj_proxy.visible = obj.user_data.upsidedowned
});
}
else {
  upsidedown_mode = false
  if (!BPM_music_mode) {
    MMD_SA.music_mode = false
    d.sound.pause_channel("BGM_ST", true)
    d.sound.resume_channel("BGM")
  }

//MMD_SA.scene.fog.density=0;
var r = 64*8//d.grid_size*d.view_radius
MMD_SA.scene.fog.near=MMD_SA.scene.fog.far=(r*100*4*2);
MMD_SA.scene.fog.near=r*0.25*5; MMD_SA.scene.fog.far=r*0.9*20; MMD_SA.scene.fog.color=new THREE.Color("#FFF");
jThree("#pointlight_main").three(0).intensity=0;
jThree("#MMD_AmbLight").three(0).color=new THREE.Color("#FFFFFF");
jThree("#MMD_DirLight").three(0).color=new THREE.Color("#606060");
if (options_area.skydome) {
  options_area.skydome.texture_index=1;
  options_area.skydome.texture_setup();
}
var PPE = MMD_SA_options.MME.PostProcessingEffects
PPE.use_BloomPostProcess = false//true
var JustSnow = PPE._effects["JustSnow"]
if (JustSnow) {
  JustSnow.enabled = false
  MMD_SA.MME_composer_disabled_check(PPE._composers_list[JustSnow._composer_index])
  MMD_SA.MME_set_renderToScreen()
}

//d.object_list[1]._obj_proxy.hidden = true
//d.object_list[1]._obj_proxy.visible = false

  DEBUG_show("Jukebox:PAUSED", 3)

if (!d.event_flag["mrs_ma"])
  return
d.object_base_list[2].object_list.forEach(function (obj) {
  obj._obj_proxy.hidden =   obj.user_data.upsidedowned
  obj._obj_proxy.visible = !obj.user_data.upsidedowned
});
}
            };
          })()
         ,ended: true
        }
      ]
    ]
  }

 ,skydome: {
    texture_path_list: [
  System.Gadget.path + "/images/_dungeon/tex/ryntaro_nukata/angel_staircase.jpg"
 ,System.Gadget.path + "/images/_dungeon/tex/ryntaro_nukata/blue_sky.jpg"
    ]
//   ,fog: { color:"" }
  }

 ,fog: { linear:true }

// ,use_point_light: false

 ,light_position: [0.5,1,0.5]

 ,options_by_area_id: {
    "start": {

  RDG_options: {
    get grid_array() {
return MMD_SA_options.Dungeon.utils.grid_array_by_object(this, {object_index:0})
    }
  }

// ,grid_size: 256
// ,view_radius: 4

 ,sound: [
    {
      url: System.Gadget.path + "/TEMP/DEMO/music/city-city-morning-silent-03.aac"
     ,channel: "BGM"
     ,loop: true
     ,autoplay: true
    }
  ]

// ,no_camera_collision: true
 ,camera_y_default_non_negative: false

 ,skydome: { fog:{ color:"#FFF", height:0.025 }, texture_index:1 }
// ,skydome: { fog:{ color:"" } }

// ,fog: { color:"#000" }

 ,floor_material_index_default: -1
 ,wall_material_index_default: -1
 ,ceil_material_index_default: -1

 ,para_by_grid_id: {
    "0": {
      ground_y:-999
    }
   ,"2": {
      ground_y:-999
    }
  }

 ,point_light: { color:"#E0E0E0" }
// ,ambient_light_color: "#FFF"
// ,light_color: '#606060'

 ,object_list: (function () {
    var combat = {
      action_check: (function () {
        var combat_action = [
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

        return function (para) {
var d = MMD_SA_options.Dungeon

d._combat_seed_=4;d._parry_level_=3;

var action_obj = {}
var seed_max = d._combat_seed_||2
var seed = random(seed_max)
if ((seed_max > 2) && (seed == seed_max-1)) {
  action_obj.motion_id = combat_action[random(combat_action.length)]//"PC combat attack 12"//
}
else if (seed % 2 == 0) {
  action_obj.type = "STAY"
}
else {
  action_obj.type = "MOVE"
}
action_obj = { type:"STAY" }
return action_obj
        };
      })()

     ,parry_check: function (def, atk_para) {
var d = MMD_SA_options.Dungeon

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
DEBUG_show(atk_para.motion_id+'/'+p.lvl)

return Math.floor(Math.random() * (d._parry_level_||1) + p.lvl)
      }
    };

    var zom = { min:{ x:-128, y:0, z:-128 }, max:{ x:128, y:0, z:128 } };

    var npc_list = [
      {
  object_index: 1
 ,placement: {
    grid_id: 2
//   ,position: { x:-67.63087*10, y:0.13904*10, z:-85.26521*10 }
   ,can_overlap: true
   ,hidden: true
  }
 ,no_camera_collision: true
 ,view_distance: 999

 ,zone_of_movement: zom
 ,mass: 1
 ,hp: 100
 ,combat: combat
 ,animate: "combat_default"
      }
    ];

//    return [{object_index:0}].concat(npc_list);

return [
  {object_index:0}
 ,{
    object_index: 1
   ,placement: {
      grid_id: 2
     ,position: { x:20, y:1.5, z:100 }
     ,rotation: { x:0, y:180, z:0 }
     ,can_overlap: true
    }
   ,onclick: [
     {
        click_range: 32
       ,is_dblclick: true
       ,event_id: "NPC-1"
      }
    ]
  }
];

  })()

 ,events: {
    "onstart": (function () {

    function _normal_plane() {
//MMD_SA.scene.fog.density=0;
var d = MMD_SA_options.Dungeon
var r = 64*8//d.grid_size*d.view_radius
var options_area = MMD_SA_options.Dungeon_options.options_by_area_id[d.area_id]
MMD_SA.scene.fog.near=MMD_SA.scene.fog.far=(r*100*4*2);
MMD_SA.scene.fog.near=r*0.25*5; MMD_SA.scene.fog.far=r*0.9*20; MMD_SA.scene.fog.color=new THREE.Color("#FFF");
jThree("#pointlight_main").three(0).intensity=0;
jThree("#MMD_AmbLight").three(0).color=new THREE.Color("#FFFFFF");
jThree("#MMD_DirLight").three(0).color=new THREE.Color("#606060");
if (options_area.skydome) {
  options_area.skydome.texture_index=1;
  options_area.skydome.texture_setup();
}
var PPE = MMD_SA_options.MME.PostProcessingEffects
PPE.use_BloomPostProcess = false//true
var JustSnow = PPE._effects["JustSnow"]
if (JustSnow) {
  JustSnow.enabled = false
  MMD_SA.MME_composer_disabled_check(PPE._composers_list[JustSnow._composer_index])
  MMD_SA.MME_set_renderToScreen()
}
    }

    return [
//0
      [
        {
          func: function () { System._browser.on_animation_update.add(_normal_plane,0,1); }
         ,message: {
  content: "(Press any key to continue.)"
 ,bubble_index: 3
 ,para: { scale:1.5 }
          }
        }
       ,{
          message: {
  content: "What is this place...? Where am I...?"
          }
        }
       ,{
          message: {
  content: "(Keyboard control:\n* Move: WASD\n* Jump: SPACE\n* Dialog/event branch: Numpad 1-9)"
 ,bubble_index: 3
 ,para: { scale:1.5 }
          }
        }
       ,{
          message: {
  content: "(Mouse control:\n* Camera: drag to rotate, wheel to zoom in/out, double-click to reset\n* Item: double-click to use, drag to re-position\n* Object/PC/NPC interaction: double-click)"
 ,bubble_index: 3
 ,para: { scale:1.5 }
          }
        }
      ]
    ];
    })()

   ,"NPC-1": [
//0
      [
        {
          message: {
  content: 'Yukari: Hi~! Welcome to the world of Anime Theme~! ^o^'
 ,NPC: 1
          }
         ,turn_to_character: 1
         ,look_at_character: 1
         ,NPC_turns_to_you: 1

         ,motion: {
  "1": { name:"NPC talk A" }
          }
        }
       ,{
          message: {
  content: "Hello~!"
          }
        }
       ,{
          ended: true
         ,motion: { "0":{}, "1":{} }
        }
      ]

    ]

/*
   ,"check_point0_onenter0": [
//0
      [
        {
          combat: {
  enabled:true
 ,show_HP_bar: true
 ,onstatechange: {
    goto_branch: 1
  }
          }
        }
      ]
//1
     ,[
        {
          message: {
  content: "cp-0, onenter-0"
          }
         ,objects: {
  "object1_0": {
    placement: {
      position: { x:0, y:0, z:0, center:{ id:"object0_0", offset:{x:-67.63087*10, y:0.13904*10, z:-85.26521*10} } }
    }
   ,hp: 100
  }
          }
        }
       ,{
          set_event_flag: { branch_index:0 }
         ,ended: true
        }
      ]
    ]

   ,"check_point0_onexit1": [
      [
        {
          combat: {
  enabled:false
 ,onstatechange: {
    objects: {
  "object1_0": {
    placement: {
      hidden: true
    }
  }
    }
  }
          }
         ,ended: true
        }
      ]
    ]
*/
  }
/*
 ,check_points: [
    {
  object_index: 0
 ,position: { x:-67.63087*10, y:0.13904*10, z:-85.26521*10 }
 ,range: [
    {
      distance: 128
     ,onenter: { event_id: "check_point0_onenter0" }
//     ,onstay:  { event_id: "check_point0_onstay0" }
//     ,onexit:  { event_id: "check_point0_onexit0" }
    }
   ,{
      distance: 256
//     ,onenter: { event_id: "check_point0_onenter1" }
//     ,onstay:  { event_id: "check_point0_onstay1" }
     ,onexit:  { event_id: "check_point0_onexit1", condition: function () { return !MMD_SA_options.Dungeon.character.combat_mode; } }
    }
  ]
    }
  ]
*/
/*
 ,event_listener: {
    "SA_Dungeon_object_animation": {
      func: function (e) {
if (MMD_SA_options.mesh_obj_by_id["DomeMESH"])
  MMD_SA_options.mesh_obj_by_id["DomeMESH"]._obj.rotate.set(0, Math.PI * 2 * ((Date.now()/1000) % 120)/120, 0)
      }
    }
  }
*/
    }
  }
};

MMD_SA_options.model_path_extra = [
//  System.Gadget.path + "/TEMP/DEMO/models/mrs_ma.min.zip#/_0Ma_v06h_for_SA_v04.pmx"
//  System.Gadget.path + "/jThree/model/pawn.zip#/pawn_v01.pmx"
  System.Gadget.path + "/jThree/model/yukari.zip#/yukari_mob_v04_x2.8_arm-z-35_v00.pmx"
/*
 ,System.Gadget.path + "/jThree/model/pawn.zip#/pawn_v01#clone1.pmx"
 ,System.Gadget.path + "/jThree/model/pawn.zip#/pawn_v01#clone2.pmx"
 ,System.Gadget.path + "/jThree/model/pawn.zip#/pawn_v01#clone3.pmx"
 ,System.Gadget.path + "/jThree/model/pawn.zip#/pawn_v01#clone4.pmx"
 ,System.Gadget.path + "/jThree/model/pawn.zip#/pawn_v01#clone5.pmx"
 ,System.Gadget.path + "/jThree/model/pawn.zip#/pawn_v01#clone6.pmx"
 ,System.Gadget.path + "/jThree/model/pawn.zip#/pawn_v01#clone7.pmx"
 ,System.Gadget.path + "/jThree/model/pawn.zip#/pawn_v01#clone8.pmx"
 ,System.Gadget.path + "/jThree/model/pawn.zip#/pawn_v01#clone9.pmx"
*/
];

MMD_SA_options.light_position_scale = 64*2*4;
//MMD_SA_options.Dungeon_options.combat_para_default = { bb_expand: {x:2, y:0, z:2} }
MMD_SA_options.camera_param = "far:" + (64*8*100*4*2) + ";"
MMD_SA_options.ground_physics_disabled = true
//window.addEventListener("load", function (e) { MMD_SA_options.model_para_obj.material_para = null; });

/*
window.addEventListener("MMDStarted", function (e) {
return;
var proton, R, emitter1, emitter2
addProton()

	function addProton() {
        proton = new Proton();

        R = 70;
        emitter1 = createEmitter(R, 0, '#4F1500', '#0029FF');
        emitter2 = createEmitter(-R, 0, '#004CFE', '#6600FF');

        proton.addEmitter(emitter1);
        proton.addEmitter(emitter2);
        proton.addRender(new Proton.SpriteRender(MMD_SA.scene));

    }

    function createEmitter(x, y, color1, color2) {
        var emitter = new Proton.Emitter();
        emitter.rate = new Proton.Rate(new Proton.Span(5, 7), new Proton.Span(.01, .02));
        emitter.addInitialize(new Proton.Mass(1));
        emitter.addInitialize(new Proton.Life(2));
        emitter.addInitialize(new Proton.Body(createSprite()));
        emitter.addInitialize(new Proton.Radius(80));
        emitter.addInitialize(new Proton.V(200, new Proton.Vector3D(0, 0, -1), 0));


        emitter.addBehaviour(new Proton.Alpha(1, 0));
        emitter.addBehaviour(new Proton.Color(color1, color2));
        emitter.addBehaviour(new Proton.Scale(1, 0.5));
        emitter.addBehaviour(new Proton.CrossZone(new Proton.ScreenZone(MMD_SA._trackball_camera.object, MMD_SA.renderer), 'dead'));


        emitter.addBehaviour(new Proton.Force(0, 0, -20));
        // emitter.addBehaviour(new Proton.Attraction({
        //     x: 0,
        //     y: 0,
        //     z: 0
        // }, 5, 250));



        emitter.p.x = x;
        emitter.p.y = y;
        emitter.emit();

        return emitter;
    }

    function createSprite() {
        var map = THREE.ImageUtils.loadTexture(toFileProtocol(System.Gadget.path + '/images/_fireworks/dot.png'))
        var material = new THREE.SpriteMaterial({
            map: map,
            color: 0xff0000,
            blending: THREE.AdditiveBlending,
            fog: true
// AT: para
,useScreenCoordinates: false
//,depthTest: false
,sizeAttenuation: false
        });
        return new THREE.Sprite(material);
    }

window.addEventListener("SA_MMD_model_all_process_bones", function () {
  animateEmitter()
  proton.update();
//DEBUG_show(MMD_SA_options.Dungeon.character.pos.toArray().join("\n"))
});

    var ctha = 0;
    function render() {
        proton.update();
    }

    var tha = 0;

    function animateEmitter() {
        tha += .13;
        emitter1.p.x = R * Math.cos(tha);
        emitter1.p.y = R * Math.sin(tha);

        emitter2.p.x = R * Math.cos(tha + Math.PI / 2);
        emitter2.p.y = R * Math.sin(tha + Math.PI / 2);

// 1312 , 0 , 992
emitter1.p.x += 1312
emitter1.p.z = 992;
emitter2.p.x += 1312
emitter2.p.z = 992;
    }

});
*/

/*
        	particleGroup = new SPE.Group({
        		texture: {
                    value: THREE.ImageUtils.loadTexture('images/_fireworks/fireworks_electric.png')
                }
        	});

        	emitter = new SPE.Emitter({
                maxAge: 3,
        		position: {
                    value: new THREE.Vector3(0, 0, 0)
                },

                acceleration: {
                    value: new THREE.Vector3(0, -5, 0),
                    spread: new THREE.Vector3(5, 0, 5)
                },

                velocity: {
                    value: new THREE.Vector3(0, 10, 0)
                },

                color: {
                    value: [ new THREE.Color( 0.5, 0.5, 0.5 ), new THREE.Color() ],
                    spread: new THREE.Vector3(1, 1, 1),
                },
                size: {
                    value: [5, 0]
                },

        		particleCount: 1500
        	});

        	particleGroup.addEmitter( emitter );
        	MMD_SA.scene.add( particleGroup.mesh );
*/
/*
window.addEventListener("MMDStarted", function (e) {
//return;
var particleGroup, emitter
// Create particle group and emitter
        function initParticles() {

particleGroup = new ShaderParticleGroup({
	// Give the particles in this group a texture
	texture: THREE.ImageUtils.loadTexture(toFileProtocol(System.Gadget.path + '/images/_fireworks/fireworks_music_green.png')),


	// [OPTIONAL] How long should the particles live for? Measured in seconds.
	maxAge: 3,

	// [OPTIONAL] Should the particles have perspective applied when drawn?
	// Use 0 for false and 1 for true.
	hasPerspective: 1,

	// [OPTIONAL] Should the particles in this group have a color applied?
	// Use 0 for false and 1 for true
	colorize: 1,

	// [OPTIONAL] What blending style should be used?
	// THREE.NoBlending
	// THREE.NormalBlending
	// THREE.AdditiveBlending
	// THREE.SubtractiveBlending
	// THREE.MultiplyBlending
	blending: THREE.AdditiveBlending,

	// [OPTIONAL] Should transparency be applied?
	transparent: true,

	// [OPTIONAL] What threshold should be used to test the alpha channel?
	alphaTest: 0.5,

	// [OPTIONAL] Should this particle group be written to the depth buffer?
	depthWrite: false,

	// [OPTIONAL] Should a depth test be performed on this group?
	depthTest: true

});

// Create a single emitter
emitter = new ShaderParticleEmitter({
//	type: 'sphere',
	position: new THREE.Vector3(0, 0, 0),
	acceleration: new THREE.Vector3(0, -0.5, 0),
	velocity: new THREE.Vector3(0, 10, 0),
	particlesPerSecond: 1000,
	size: 5,
	sizeEnd: 0,
//	opacityStart: 1,
//	opacityEnd: 0,
	colorStart: new THREE.Color('blue'),
	colorEnd: new THREE.Color('red')
});

// Add the emitter to the group.
particleGroup.addEmitter( emitter );

// Add the particle group to the scene so it can be drawn.
MMD_SA.scene.add( particleGroup.mesh ); // Where `scene` is an instance of `THREE.Scene`.

        }

window.addEventListener("SA_MMD_model_all_process_bones", function () {
            render( 0.016 );
});


        function render( dt ) {
            particleGroup.tick( dt );
        }


var camera = MMD_SA._trackball_camera.object
var mouseX, mouseY, mouseVector = new THREE.Vector3();
        // Add mousemove listener to move the `emitter`.
        document.addEventListener( 'mousemove', function( e ) {
            mouseVector.set(
                (e.clientX / window.innerWidth) * 2 - 1,
                -(e.clientY / window.innerHeight) * 2 + 1,
                0.5
            );

            mouseVector.unproject( camera );
//emitter.position.set( mouseVector.x * camera.fov, mouseVector.y * camera.fov, 0 );
//DEBUG_show(emitter.position.toArray().join("\n"))
// 1312 , 0 , 992
emitter.position.set(1312 , 20 , 992)
        }, false );

        initParticles();

});
*/

//return


RAF_animation_frame_unlimited = true

})();


// random dungeon test
//  document.write('<script language="JavaScript" src="node_modules/index.umd.js"></scr'+'ipt>');
//if (xul_mode) document.write('<script language="JavaScript" src="js/require1k.js"></scr'+'ipt>');
document.write('<script language="JavaScript" src="js/dungeon.js"></scr'+'ipt>');


// main js
document.write('<script language="JavaScript" src="MMD.js/MMD_SA.js"></scr'+'ipt>');
