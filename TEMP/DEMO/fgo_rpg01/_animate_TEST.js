var MMD_SA_options = {

  model_path: System.Gadget.path + "/TEMP/DEMO/models/miss_noodles.zip#/_Miss_Noodle_v06b_CLEANED_v00.pmx"
//  model_path: System.Gadget.path + '\\TEMP\\DEMO\\models\\chung.min.zip#\\_chung_v012_CLEANED-v03.pmx'
//  model_path: System.Gadget.path + '\\TEMP\\DEMO\\models\\Appearance Miku.min.zip#\\Appearance Miku_BDEF_mod-v05.pmx'
//  model_path: System.Gadget.path + '\\TEMP\\DEMO\\models\\★MMD宮本武蔵.min.zip#\\■宮本武蔵霊基再臨01_v01.pmx'
//  model_path: System.Gadget.path + '\\TEMP\\DEMO\\models\\巴御前  (アチャー インフェルノ).min.zip#\\巴御前  (アチャー インフェルノ) オルタネイト_v01.pmx'

 ,model_path_extra: [
    'F:\\MMD\\models\\セーラー服さんv1.3\\セーラー服さんv1.3長袖.pmx'
//    'F:\\MMD\\models - custom\\Rin\\Tda Rin Long Pajama Shirt\\_v05a_CLEANED.pmx'
//    'F:\\MMD\\models\\三ツ矢雪花菜2017 V5.0\\雪花菜2017.pmx'
//    'F:\\MMD\\models - custom\\ルカ\\_0Ma_v06h_for_SA.pmx'
//    'F:\\MMD\\models - custom\\tda_miku_and_luka_bases_ver3_00\\Luka\\_Miss_Noodle_v06b_CLEANED.pmx'
//   ,'F:\\MMD\\models\\セーラー戦士\\天海春香セーラームーン.pmx'
   ,'F:\\MMD\\stages\\欧米風アパート ver1.00\\models\\ワンルーム.pmx'
//,'F:\\MMD\\accessories\\Ferrari_LaFerrari_v2_4\\laferrari.pmx'
//,'F:\\MMD\\accessories\\SF-batmobile-supercar\\source\\batmobile-supercar_v02.pmx'
//,'F:\\MMD\\models\\Rudolph\\_Rudolph_full_v01.pmx'
,'F:\\MMD\\accessories\\Ferrari_LaFerrari_v2_4\\laferrari_v00.pmx'
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

// X object START
   ,"sorairo1.52.x": {
  material_para: {
  "13": { side:2 }
  }
    }

   ,"ガレキ町１．4_v01.x": {
  material_para: {
  "46": { transparent:false }
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

   ,"Appearance Miku_BDEF_mod.pmx": {
      bone_constraint: {
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
    }

,"■宮本武蔵霊基再臨01.pmx": {
  bone_constraint: {
  "スカート_0_0":  { rotation:{ x:[[-0*Math.PI/180,0],[75*Math.PI/180]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],z:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"スカート_0_1":  { rotation:{ x:[[-0*Math.PI/180,0],[75*Math.PI/180]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],z:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"スカート_0_2":  { rotation:{ x:[[-0*Math.PI/180,0],[75*Math.PI/180]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],z:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"スカート_0_14": { rotation:{ x:[[-0*Math.PI/180,0],[75*Math.PI/180]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],z:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"スカート_0_15": { rotation:{ x:[[-0*Math.PI/180,0],[75*Math.PI/180]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],z:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"スカート_0_6":  { rotation:{ x:[[-75*Math.PI/180],[0*Math.PI/180,0]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],z:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"スカート_0_7":  { rotation:{ x:[[-75*Math.PI/180],[0*Math.PI/180,0]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],z:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"スカート_0_8":  { rotation:{ x:[[-75*Math.PI/180],[0*Math.PI/180,0]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],z:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"スカート_0_9":  { rotation:{ x:[[-75*Math.PI/180],[0*Math.PI/180,0]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],z:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"スカート_0_10": { rotation:{ x:[[-75*Math.PI/180],[0*Math.PI/180,0]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],z:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"スカート_0_3":  { rotation:{ z:[[-0*Math.PI/180,0],[75*Math.PI/180]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],x:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"スカート_0_4":  { rotation:{ z:[[-0*Math.PI/180,0],[75*Math.PI/180]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],x:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"スカート_0_5":  { rotation:{ z:[[-0*Math.PI/180,0],[75*Math.PI/180]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],x:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"スカート_0_11": { rotation:{ z:[[-75*Math.PI/180],[0*Math.PI/180,0]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],x:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"スカート_0_12": { rotation:{ z:[[-75*Math.PI/180],[0*Math.PI/180,0]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],x:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"スカート_0_13": { rotation:{ z:[[-75*Math.PI/180],[0*Math.PI/180,0]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],x:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }

 ,"スカート_1_0":  { rotation:{ x:[[-0*Math.PI/180,0],[75*Math.PI/180]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],z:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"スカート_1_1":  { rotation:{ x:[[-0*Math.PI/180,0],[75*Math.PI/180]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],z:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"スカート_1_2":  { rotation:{ x:[[-0*Math.PI/180,0],[75*Math.PI/180]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],z:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"スカート_1_14": { rotation:{ x:[[-0*Math.PI/180,0],[75*Math.PI/180]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],z:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"スカート_1_15": { rotation:{ x:[[-0*Math.PI/180,0],[75*Math.PI/180]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],z:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"スカート_1_6":  { rotation:{ x:[[-75*Math.PI/180],[0*Math.PI/180,0]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],z:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"スカート_1_7":  { rotation:{ x:[[-75*Math.PI/180],[0*Math.PI/180,0]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],z:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"スカート_1_8":  { rotation:{ x:[[-75*Math.PI/180],[0*Math.PI/180,0]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],z:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"スカート_1_9":  { rotation:{ x:[[-75*Math.PI/180],[0*Math.PI/180,0]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],z:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"スカート_1_10": { rotation:{ x:[[-75*Math.PI/180],[0*Math.PI/180,0]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],z:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"スカート_1_3":  { rotation:{ z:[[-0*Math.PI/180,0],[75*Math.PI/180]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],x:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"スカート_1_4":  { rotation:{ z:[[-0*Math.PI/180,0],[75*Math.PI/180]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],x:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"スカート_1_5":  { rotation:{ z:[[-0*Math.PI/180,0],[75*Math.PI/180]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],x:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"スカート_1_11": { rotation:{ z:[[-75*Math.PI/180],[0*Math.PI/180,0]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],x:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"スカート_1_12": { rotation:{ z:[[-75*Math.PI/180],[0*Math.PI/180,0]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],x:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
 ,"スカート_1_13": { rotation:{ z:[[-75*Math.PI/180],[0*Math.PI/180,0]], y:[[-45*Math.PI/180,0],[45*Math.PI/180,0]],x:[[-45*Math.PI/180,0],[45*Math.PI/180,0]] } }
  }

// to make sure that every VMD has morph (at least a dummy)
 ,morph_default: {}
 ,morph_translate: {
  "はう": "はぅ"
  }
 ,rigid_filter: { test:function(name){return((name.indexOf("胸")==-1) && (name.indexOf("SFS")==-1) && (name.indexOf("前髪")==-1))} }
 ,boundingBox: { min: {x:-8.2907, y:-0.1535, z:-3.2182}, max: {x:8.2458, y:23.42-2, z:2.4355} }

 ,icon_path: System.Gadget.path + "/TEMP/DEMO/_miyamoto_icon_64x64.png"
}

,"00_お栄": {
  motion_includes: ["NPC talk A"]
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
//    "Batgal": { weight:1 }
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
// ,icon_path: Settings.f_path + '\\images\\_miss_noodle_01_icon_64x64.png'
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
  morph_default: {}
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
  else {
    MMD_SA_options.width  = screen.availWidth*0.75
    MMD_SA_options.height = screen.availHeight*0.75
  }

  Settings_default._custom_.EventToMonitor = "SOUND_ALL"
  Settings_default._custom_.Use30FPS = "non_default"
  if (use_SA_browser_mode && !is_SA_child_animation)
    Settings_default._custom_.WallpaperAsBG = "non_default"
  Settings_default._custom_.Display = "-1"

  if (is_SA_child_animation)
    parent.DragDrop.relay_id = SA_child_animation_id

  self.SA_wallpaper_src = System.Gadget.path + "\\TEMP\\DEMO\\bg_fgo01_c50.jpg"


// dungeon options START

MMD_SA_options.Dungeon_options = {
// fixed properties across dungeon levels START
  object_base_list: [
// 0
    {
  path: "F:\\MMD\\accessories\\SF-alone-house\\textures\\alone_house_v01_no-specular.x"
 ,placement: {
    grid_id_filter: function () {
var d = MMD_SA_options.Dungeon
var clone_list = []
for (var i = 3, i_max = d.room_max_default; i < i_max; i++) {
  if (MT.random() > 1/3) continue
  var room = d.room_info[i]
  var w = room.width  - 1
  var h = room.height - 1
//  if ((w % 2) || (h % 2)) continue
  for (var x = 1, x_max = room.width; x < x_max; x+=2) {
    for (var y = 1, y_max = room.height; y < y_max; y+=2) {
      var xx = x + room.x_min
      var yy = y + room.y_min
      if (!d.grid_array_free[yy][xx])
        continue
      d.grid_array_free[yy][xx] = false

// Down
var x_dir = (x < w/2) ? x : x - w
var y_dir = (y < h/2) ? y : y - h
var ry = (Math.abs(x_dir) < Math.abs(y_dir)) ? ((x < w/2) ? -90 : 90) : ((y < h/2) ? 180 : 0)

      clone_list.push({
  grid_id:i
 ,para: {
    placement:{
      grid_pos_absolute:[xx, yy]
     ,rotation: {x:0, y:ry, z:0}
     ,position: (ry) ? new THREE.Vector3(0,0,-32).applyEuler(new THREE.Vector3(0,ry,0)) : {x:0, y:0, z:-32}
    }
  }
      });
    }
  }
  d.grid_by_index_free[i] = d.grid_by_index_free[i].filter(function (xy) {
    return d.grid_array_free[xy[1]][xy[0]]
  });
}
return clone_list
    }
   ,scale: 40
  }
 ,collision_by_mesh: true
 ,collision_by_mesh_sort_range: 32
 ,onclick: [{click_range:64*3, is_dblclick:true, event_id:"xmas_chat"}]
    }
// 1
   ,{
  path: "F:\\MMD\\accessories\\SF-house_shakiller\\textures\\house_shakiller.x"
 ,placement: {
    grid_id_filter: function () {
var d = MMD_SA_options.Dungeon

var r_index = d.room_max_default
var placement     = { grid_occupied:[[0,-1],[0,0],[0,1]] }

var clone_list = []
d.grid_by_index_free[r_index].forEach(function (xy) {
  var x = xy[0]
  var y = xy[1]
  if (!d.grid_array_free[y][x])
    return

  var p_r0, p_r90
  if ((d.grid_array[y][x+1]==0 && d.grid_array_free[y][x+1]) || (d.grid_array[y][x-1]==0 && d.grid_array_free[y][x-1])) {
    p_r0  = true
  }
  if ((d.grid_array[y+1] && d.grid_array[y+1][x]==0 && d.grid_array_free[y+1][x]) || (d.grid_array[y-1] && d.grid_array[y-1][x]==0 && d.grid_array_free[y-1][x])) {
    p_r90 = true
  }
  if ((p_r0 && p_r90) || (!p_r0 && !p_r90))
    return

  if (MT.random() > 0.5)
    return

// right
  var p = Object.assign({}, placement)
  p.rotation = (p_r0) ? {x:0, y:((d.grid_array[y][x+1]==0)?0:180), z:0} : {x:0, y:((d.grid_array[y+1] && d.grid_array[y+1][x]==0)?-90:90), z:0}

  var grid_occupied = p.grid_occupied
  if (p.rotation.y % 180) {
    var rot_q = MMD_SA.TEMP_q.setFromEuler(MMD_SA.TEMP_v3.copy(p.rotation).multiplyScalar(Math.PI/180))
    var grid_occupied = grid_occupied.map(function (xy) {
      if (xy[0] || xy[1]) {
        MMD_SA.TEMP_v3.set(xy[0], 0, xy[1]).applyQuaternion(rot_q)
        return [Math.round(MMD_SA.TEMP_v3.x), Math.round(MMD_SA.TEMP_v3.z)]
      }
      return xy
    });
  }

  var occupied = grid_occupied.some(function (g_xy) {
    var hit = !d.grid_array_free[y+g_xy[1]] || !d.grid_array_free[y+g_xy[1]][x+g_xy[0]] || (d.grid_array[y+g_xy[1]][x+g_xy[0]] != r_index)
    return hit
  });
  if (occupied)
    return

  grid_occupied.forEach(function (g_xy) {
    d.grid_array_free[y+g_xy[1]][x+g_xy[0]] = false
  });

  p.grid_pos_absolute = [x,y]
  clone_list.push({
    grid_id: r_index
   ,para: {
      placement: p
    }
  });
});

d.grid_by_index_free[r_index] = d.grid_by_index_free[r_index].filter(function (xy) {
  return d.grid_array_free[xy[1]][xy[0]]
});

return clone_list
    }

   ,scale: 25
  }
    }
// 2
   ,{
//  path: "F:\\MMD\\accessories\\SF-the-neko-stop-off-hand-painted-diorama\\source\\Diorama_v00.x"
//  path: "F:\\MMD\\accessories\\SF-big-old-house\\textures\\big_old_house.x"
//  path: "F:\\MMD\\accessories\\SF-abandoned-building\\textures\\abondoned-building_v01.x"
  path: "F:\\MMD\\accessories\\SF-old-building-no-2\\textures\\old-building-no-2_v00.x"
 ,placement: {
    grid_id_filter: function () {
var d = MMD_SA_options.Dungeon
var clone_list = []
for (var i = 3, i_max = d.room_max_default; i < i_max; i++) {
  var room = d.room_info[i]
// not this room, if [1,1] occupied
  if (!d.grid_array_free[room.y_min+1][room.x_min+1]/* || (MT.random() > 0.5)*/)
    continue
  var w = room.width  - 1
  var h = room.height - 1
  for (var x = 0, x_max = room.width; x < x_max; x++) {
    var x_not_edge = (x >= 1) && ((w-x) >= 1)
    if (x_not_edge && (MT.random() > 0.5))
      continue
    for (var y = 0, y_max = room.height; y < y_max; y++) {
      var y_not_edge = (y >= 1) && ((h-y) >= 1)
      var xx = x + room.x_min
      var yy = y + room.y_min
      if (!d.grid_array_free[yy][xx] || ((x_not_edge || y_not_edge) && (MT.random() > ((!x_not_edge||!y_not_edge)?1/3:0.5))))
        continue
      d.grid_array_free[yy][xx] = false

// Down
var x_dir = (x < w/2) ? x : x - w
var y_dir = (y < h/2) ? y : y - h
var ry = (Math.abs(x_dir) < Math.abs(y_dir)) ? ((x < w/2) ? -90 : 90) : ((y < h/2) ? 180 : 0)

      clone_list.push({
  grid_id:i
 ,para: {
    placement:{
      grid_pos_absolute:[xx, yy]
     ,rotation: {x:0, y:ry, z:0}
    }
  }
      });
    }
  }
  d.grid_by_index_free[i] = d.grid_by_index_free[i].filter(function (xy) {
    return d.grid_array_free[xy[1]][xy[0]]
  });
}
return clone_list
    }
   ,scale: 50//150//20//
  }
 ,onclick: [{click_range:64*3, is_dblclick:true, event_id:"xmas_chat"}]
    }
// 3
   ,{
//  path: "F:\\MMD\\accessories\\SF-tavern\\textures\\tavern_hand_painted01.x"
  path: "F:\\MMD\\accessories\\SF-the-drunk-troll-tavern\\textures\\the-drunk-troll-tavern_v01.x"
 ,placement: {
    grid_id_filter: function () {
var d = MMD_SA_options.Dungeon

var r_index = d.room_max_default+1
var grid_occupied = [
  [-1,-1],[ 0,-1],[ 1,-1]
 ,[-1, 0],[ 0, 0],[ 1, 0]
 ,[-1, 1],[ 0, 1],[ 1, 1]
];

var count = Math.round(Math.sqrt(d.RDG_options.width * d.RDG_options.height) / 10)

var clone_list = []
d.grid_by_index_free[r_index].slice().shuffleMT().some(function (xy) {
  var x = xy[0]
  var y = xy[1]

  var occupied = grid_occupied.some(function (g_xy) {
    var hit = !d.grid_array_free[y+g_xy[1]] || !d.grid_array_free[y+g_xy[1]][x+g_xy[0]] || (d.grid_array[y+g_xy[1]][x+g_xy[0]] != r_index)
    return hit
  });
  if (occupied)
    return

  grid_occupied.forEach(function (g_xy) {
    d.grid_array_free[y+g_xy[1]][x+g_xy[0]] = false
  });
//console.log(x+','+y)
  [[0,0]].forEach(function (g) {
    clone_list.push({
      grid_id: r_index
     ,para: {
        placement: {
          grid_pos_absolute: [x+g[0], y+g[1]]
         ,rotation: {x:0, y:Math.floor(MT.random()*4)*90, z:0}
        }
      }
    });
  });

  if (--count == 0)
    return true
});

d.grid_by_index_free[r_index] = d.grid_by_index_free[r_index].filter(function (xy) {
  return d.grid_array_free[xy[1]][xy[0]]
});

return clone_list
    }
   ,scale: 25*2
  }
 ,collision_by_mesh: true
 ,collision_by_mesh_sort_range: 32
 ,onclick: [{click_range:64*6, is_dblclick:true, event_id:"xmas_chat_frodo"}]
    }
// 4
   ,{
  character_index: 1
 ,view_distance: 0.5
 ,placement: {
    grid_id_filter: function () {
var d = MMD_SA_options.Dungeon
var w = d.RDG_options.width
var h = d.RDG_options.height
var c_count = d.room_max_default*4
var path = [
  {s:[ 0,-1], p:[[0,0],[1,0]], ry:90}
 ,{s:[ 1, 0], p:[[1,0],[1,1]], ry:0}
 ,{s:[ 0, 1], p:[[1,1],[0,1]], ry:-90}
 ,{s:[-1, 0], p:[[0,1],[0,0]], ry:180}
];

var clone_list = []
for (var i = 2, i_max = d.room_max_default; i < i_max; i++) {
  var room = d.room_info[i]
  var w = room.width  - 1
  var h = room.height - 1
  var x = room.x_min
  var y = room.y_min
  var p_list = path.shuffleMT()
  for (var k = 0; k < 4; k++) {
    var p = p_list[k]
    var _path_ = [[p.s[0]*0.45+p.p[0][0]*w+x,p.s[1]*0.45+p.p[0][1]*h+y], [p.s[0]*0.45+p.p[1][0]*w+x,p.s[1]*0.45+p.p[1][1]*h+y]]
    var _path_offset_ = [0,0]//[(MT.random()-0.5),(MT.random()-0.5)]
    clone_list.push({
  grid_id: 0
 ,para: {
    _path_: _path_
   ,_path_offset_: _path_offset_
   ,placement: {
      grid_pos_absolute:[_path_[0][0], _path_[0][1]]
     ,position: {x:_path_offset_[0]*d.grid_size, y:0, z:_path_offset_[1]*d.grid_size}
// y:d.para_by_grid_id[0].ground_y
     ,rotation: {x:0, y:p.ry, z:0}
    }
  }
    });

    if (--c_count == 0)
      break
  }

  if (c_count == 0)
    break
}
return clone_list
    }
   ,can_overlap: true
  }
 ,no_collision: true
 ,oncreate: function  () {
var d = MMD_SA_options.Dungeon
var p = this._path_
var dis = (Math.abs(p[0][0] - p[1][0]) + Math.abs(p[0][1] - p[1][1])) * d.grid_size
var duration = dis/9.85 * (0.8+MT.random()*0.4)
var pos_ini = this._obj.position.clone()
//var ry = this.placement.rotation.y

this.motion = {
  path: [
    {
  pos: pos_ini
// ,rot: {x:0, y:0, z:0}
 ,duration: duration
 ,onended: function (motion) {
var obj = motion.obj._obj
obj.rotation.y += Math.PI
//obj.quaternion.multiply(MMD_SA.TEMP_q.setFromEuler(MMD_SA.TEMP_v3.set(0,Math.PI,0)))
  }
    }
   ,{
  pos: new THREE.Vector3((p[1][0]+0.5+this._path_offset_[0])*d.grid_size, pos_ini.y, (p[1][1]+0.5+this._path_offset_[1])*d.grid_size)
// ,rot: {x:0, y:0, z:0}
 ,duration: duration
 ,onended: function (motion) {
var obj = motion.obj._obj
obj.rotation.y += Math.PI
//obj.quaternion.multiply(MMD_SA.TEMP_q.setFromEuler(MMD_SA.TEMP_v3.set(0,Math.PI,0)))
  }
    }
   ,{
  pos: pos_ini.clone()
// ,rot: {x:0, y:0, z:0}
 ,duration: duration
 ,onended: function (motion) {
var obj = motion.obj._obj
obj.rotation.y += Math.PI
//obj.quaternion.multiply(MMD_SA.TEMP_q.setFromEuler(MMD_SA.TEMP_v3.set(0,Math.PI,0)))
  }
    }
  ]
};
//console.log(this.motion)
  }

 ,onclick: [
    {
      click_range: 64
     ,event_id: "NPC_girl"
    }
  ]
    }
// 5
   ,{
  construction: {
    mesh_obj: { id:"Manhole0MESH", receiveShadow:true }
   ,GOML_head: [
  '<txr id="Manhole0TXR"   src="' + toFileProtocol('F:\\MMD\\accessories\\SF-chicago-city-electric-cover\\textures\\manhole_color.png') + '" param="repeat:1 1;" />'
+ '<txr id="Manhole0TXR_N" src="' + toFileProtocol('F:\\MMD\\accessories\\SF-chicago-city-electric-cover\\textures\\city_elec_Normal.tga.png') + '" param="repeat:1 1;" />'
+ '<txr id="Manhole0TXR_S" src="' + toFileProtocol('F:\\MMD\\accessories\\SF-chicago-city-electric-cover\\textures\\city_elec_Metallic.tga.png') + '" param="repeat:1 1;" />'
+ '<geo id="Manhole0GEO" type="Circle" param="' + [1,128].join(" ") + '" />'
+ '<mtl id="Manhole0MTL" type="MeshPhong" param="map:#Manhole0TXR; normalMap:#Manhole0TXR_N; specularMap:#Manhole0TXR_S; specular:#FFFFFF;" />'
    ].join("\n")+"\n"
   ,GOML_scene: [
  '<mesh id="Manhole0MESH" geo="#Manhole0GEO" mtl="#Manhole0MTL" style="scale:0;" />'
    ].join("\n")+"\n"
/*
   ,boundingBox_list: [
// NOTE: z value inversed from model
      { min:{x:-0.5, y:-0.5, z:-0.1}, max:{x:0.5, y:0.5,  z:0.1} }
    ]
*/
  }
 ,no_collision: true
    }
// 6
   ,{
  character_index: 2
 ,placement: {
    grid_id: 2
   ,can_overlap: true
   ,position: {x:0, y:-5.8*1.25, z:0}
   ,rotation: {x:0, y:180, z:0}
   ,scale: 1.25
  }
//,no_collision: true
 ,construction: {
    boundingBox_list: [
// NOTE: z value inversed from model
// -30.2 38 (-43.26456 to 27.13544)
//  30.2
// -16.1499 -3.5869
// 2.99881 27.47245

      { min:{x:-16.1499, y:0, z:-27.13544-2}, max:{x: -3.5869, y:38+2, z:-27.13544+2}
 ,skip_bb_index_list: [1]
 ,oncollide: function (para) {
MMD_SA_options.model_para_obj_all[2]["_リビングドア"] = RAF_timestamp
return { returnValue:true }
  }
      }
     ,{ min:{x:-30.2-2, y:0, z:-27.13544-2}, max:{x: 30.2+2, y:38+2, z:-27.13544+2} }

     ,{ min:{x: 0-2, y:0, z:/*-63*/-63.5-2},  max:{x:/*14*/30.2+2, y:38+2, z:-50.5}
 ,skip_bb_index_list: [3]
 ,oncollide: function (para) {
MMD_SA_options.model_para_obj_all[2]["_脱衣所ドア"] = RAF_timestamp
return { returnValue:true }
  }
      }
     ,{ min:{x: 0-2, y:0, z:-86.9521-2},  max:{x: 0+2, y:38+2, z:-27.13544+2} }

// cabinet
     ,{ min:{x:2.99881, y:0, z:-36.84997}, max:{x:27.47245, y:38+2, z:-27.13544+2} }

// door
     ,{ min:{x:-30.2-2, y:0, z:-86.9521-9}, max:{x: 0, y:38+2, z:-86.9521+2} }

     ,{ min:{x:-30.2-2, y:0, z:-27.13544-2}, max:{x:-30.2+2, y:38+2, z: 43.26456+2} }
     ,{ min:{x:-20-2,   y:0, z:-86.9521-2},  max:{x:-30.2+2, y:38+2, z:-27.13544+2} }
     ,{ min:{x: 30.2-2, y:0, z:-86.9521-2},  max:{x: 30.2+2, y:38+2, z: 43.26456+2} }

     ,{ min:{x: 0-2, y:0, z:-42.2-2},  max:{x: 30.2+2, y:38+2, z:-42.2+2} }
     ,{ min:{x: 14,  y:0, z:-63.5-2},  max:{x: 30.2+2, y:38+2, z:-63.5+2} }

     ,{ min:{x:-30.2-2, y:0, z: 43.26456-2}, max:{x: 30.2+2, y:38+2, z: 43.26456+2} }
     ,{ min:{x:-30.2-2, y:0, z:-86.9521-2},  max:{x: 30.2+2, y:38+2, z:-86.9521+2} }

     ,{ min:{x:-30.2-2, y:38, z:-86.9521-2}, max:{x: 30.2+2, y:38+100, z: 43.26456+2} }
    ]
   ,boundingSphere_radius_scale: 1.5
  }
 ,onclick: [
    {
      click_range: 1024
     ,events: [
  null
 ,null

 ,null
 ,null

 ,{id:"cabinet", click_range:64}
 ,{id:"door", click_range:64}
      ]
    }
  ]
    }
// 7
   ,{
  path: "F:\\MMD\\accessories\\シンプルすぎるベット\\シンプルすぎるベット_v00.x"
 ,construction: {
    receiveShadow: true
  }
 ,placement: {
    grid_id: 2
   ,can_overlap: true
   ,position: {x:15*1.25, y:0, z:-31*1.25}
   ,rotation: {x:0, y:180, z:0}
  }
 ,no_collision: true
 ,onclick: [
    {
      click_range: 32
     ,is_dblclick: true
     ,event_id: "bed"
    }
  ]
    }
// 8
   ,{
  path: "F:\\MMD\\accessories\\SF-abandoned-building\\textures\\abondoned-building_v02_no-specular.x"
//"F:\\MMD\\accessories\\SF-house_shakiller\\textures\\house_shakiller.x"
//"F:\\MMD\\accessories\\SF-kadashevskeaya-10-moscow-russia\\textures\\kadashevskeaya-10-moscow-russia_01.x"
 ,placement: {
    grid_id: 2
   ,grid_xy: [0.5,0.5]
   ,scale: 25
  }
 ,collision_by_mesh: true
 ,collision_by_mesh_sort_range: 32
 ,collision_by_mesh_material_index_max: 4
 ,onclick: [
    {
      click_range: 64*2
     ,is_dblclick: true
     ,event_id: "PassionTimes"
    }
  ]
    }
// 9
   ,{
  path: "F:\\MMD\\accessories\\SF-house_cloth_shop\\source\\House_Cloth_Shop.x"
 ,placement: {
    grid_id_filter: function () {
var d = MMD_SA_options.Dungeon
var clone_list = []
for (var i = 3, i_max = d.room_max_default; i < i_max; i++) {
  var room = d.room_info[i]
// not this room, if [0,0] free
  if (d.grid_array_free[room.y_min][room.x_min])
    continue
  var w = room.width  - 1
  var h = room.height - 1
  for (var x = 0, x_max = room.width; x < x_max; x++) {
    var x_not_edge = (x >= 1) && ((w-x) >= 1)
    for (var y = 0, y_max = room.height; y < y_max; y++) {
      var y_not_edge = (y >= 1) && ((h-y) >= 1)
      if (x_not_edge && y_not_edge)
        continue
      var xx = x + room.x_min
      var yy = y + room.y_min
      if (!d.grid_array_free[yy][xx] || (MT.random() > 0.5))
        continue
// assign 0 as a trick so that object 10 will use this grid
      d.grid_array_free[yy][xx] = 0

// Up
var x_dir = (x < w/2) ? x : x - w
var y_dir = (y < h/2) ? y : y - h
var ry = (Math.abs(x_dir) < Math.abs(y_dir)) ? ((x > w/2) ? -90 : 90) : ((y > h/2) ? 180 : 0)

      clone_list.push({
  grid_id:i
 ,para: {
    placement:{
      grid_pos_absolute:[xx, yy]
     ,position: new THREE.Vector3(-50, 0, -50).applyEuler(new THREE.Vector3(0, ry, 0).multiplyScalar(Math.PI/180))
     ,rotation: {x:0, y:ry, z:0}
    }
  }
      });
    }
  }
/*
  d.grid_by_index_free[i] = d.grid_by_index_free[i].filter(function (xy) {
    return d.grid_array_free[xy[1]][xy[0]]
  });
*/
}
return clone_list
    }
//   ,scale: 50//150//20//
  }
 ,onclick: [{click_range:64*3, is_dblclick:true, event_id:"xmas_chat"}]
    }
// 10
   ,{
  path: "F:\\MMD\\accessories\\SF-house_residential\\source\\House_Residential.x"
 ,placement: {
    grid_id_filter: function () {
var d = MMD_SA_options.Dungeon
var clone_list = []
for (var i = 3, i_max = d.room_max_default; i < i_max; i++) {
  var room = d.room_info[i]
// not this room, if [0,0] free
  if (d.grid_array_free[room.y_min][room.x_min])
    continue
  var w = room.width  - 1
  var h = room.height - 1
  for (var x = 0, x_max = room.width; x < x_max; x++) {
    var x_not_edge = (x >= 1) && ((w-x) >= 1)
    for (var y = 0, y_max = room.height; y < y_max; y++) {
      var y_not_edge = (y >= 1) && ((h-y) >= 1)
      if (x_not_edge && y_not_edge)
        continue
      var xx = x + room.x_min
      var yy = y + room.y_min
      if (d.grid_array_free[yy][xx] !== 0)
        continue
      d.grid_array_free[yy][xx] = false

// Up
var x_dir = (x < w/2) ? x : x - w
var y_dir = (y < h/2) ? y : y - h
var ry = (Math.abs(x_dir) < Math.abs(y_dir)) ? ((x > w/2) ? -90 : 90) : ((y > h/2) ? 180 : 0)

      clone_list.push({
  grid_id:i
 ,para: {
    placement:{
      grid_pos_absolute:[xx, yy]
     ,position: new THREE.Vector3(50, 0, -50).applyEuler(new THREE.Vector3(0, ry, 0).multiplyScalar(Math.PI/180))
     ,rotation: {x:0, y:ry, z:0}
    }
  }
      });
    }
  }

  d.grid_by_index_free[i] = d.grid_by_index_free[i].filter(function (xy) {
    return d.grid_array_free[xy[1]][xy[0]]
  });

}
return clone_list
    }
//   ,scale: 50//150//20//
  }
    }
// 11
   ,{
  path: "F:\\MMD\\accessories\\SF-sf-building\\textures\\sf-building_v02a.x"
 ,placement: {
    grid_id_filter: function () {
var d = MMD_SA_options.Dungeon
var clone_list = []
for (var i = 3, i_max = d.room_max_default; i < i_max; i++) {
  var room = d.room_info[i]
// not this room, if [0,0] free
  if (d.grid_array_free[room.y_min][room.x_min])
    continue
  var w = room.width  - 1
  var h = room.height - 1
  for (var x = 0, x_max = room.width; x < x_max; x++) {
    var x_not_edge = (x >= 1) && ((w-x) >= 1)
    for (var y = 0, y_max = room.height; y < y_max; y++) {
      var y_not_edge = (y >= 1) && ((h-y) >= 1)
      if (x_not_edge && y_not_edge)
        continue
      var xx = x + room.x_min
      var yy = y + room.y_min
      if (!d.grid_array_free[yy][xx])
        continue
      d.grid_array_free[yy][xx] = false

// right
var x_dir = (x < w/2) ? x : x - w
var y_dir = (y < h/2) ? y : y - h
var ry = (Math.abs(x_dir) < Math.abs(y_dir)) ? ((x > w/2) ? 0 : 180) : ((y > h/2) ? -90 : 90)

      clone_list.push({
  grid_id:i
 ,para: {
    placement:{
      grid_pos_absolute:[xx, yy]
     ,rotation: {x:0, y:ry, z:0}
    }
  }
      });
    }
  }

  d.grid_by_index_free[i] = d.grid_by_index_free[i].filter(function (xy) {
    return d.grid_array_free[xy[1]][xy[0]]
  });

}
return clone_list
    }
   ,scale: 25
  }
 ,construction: {
    boundingBox_list: [
// -15.5 0        -30.5
//  15   48.64763  30.5
  { min:{x:-1.55, y:0, z:-3.05}, max:{x:1.5, y:4.864763, z:3.05} }
    ]
  }
 ,onclick: [{click_range:64*3, is_dblclick:true, event_id:"xmas_chat_toby"}]
    }
// 12
   ,{
  path: "F:\\MMD\\accessories\\SF-kadashevskeaya-10-moscow-russia\\textures\\kadashevskeaya-10-moscow-russia_v01.x"
 ,placement: {
    grid_id_filter: function () {
var d = MMD_SA_options.Dungeon

var r_index = d.room_max_default
var placement     = { grid_occupied:[[0,0],[1,0]] }

var clone_list = []
d.grid_by_index_free[r_index].forEach(function (xy) {
  var x = xy[0]
  var y = xy[1]
  if (!d.grid_array_free[y][x])
    return

  var p_r0, p_r90
  if ((d.grid_array[y][x+1]==0 && d.grid_array_free[y][x+1]) || (d.grid_array[y][x-1]==0 && d.grid_array_free[y][x-1])) {
    p_r90  = true
  }
  if ((d.grid_array[y+1] && d.grid_array[y+1][x]==0 && d.grid_array_free[y+1][x]) || (d.grid_array[y-1] && d.grid_array[y-1][x]==0 && d.grid_array_free[y-1][x])) {
    p_r0 = true
  }
  if ((p_r0 && p_r90) || (!p_r0 && !p_r90))
    return

// down
  var p = Object.assign({}, placement)
  p.rotation = (p_r0) ? {x:0, y:((d.grid_array[y+1] && d.grid_array[y+1][x]==0)?0:180), z:0} : {x:0, y:((d.grid_array[y][x+1]==0)?90:-90), z:0}

  var grid_occupied = p.grid_occupied
  var rot_q
  if (p.rotation.y % 180) {
    rot_q = MMD_SA.TEMP_q.setFromEuler(MMD_SA.TEMP_v3.copy(p.rotation).multiplyScalar(Math.PI/180))
    var grid_occupied = grid_occupied.map(function (xy) {
      if (xy[0] || xy[1]) {
        MMD_SA.TEMP_v3.set(xy[0], 0, xy[1]).applyQuaternion(rot_q)
        return [Math.round(MMD_SA.TEMP_v3.x), Math.round(MMD_SA.TEMP_v3.z)]
      }
      return xy
    });
  }

  var occupied = grid_occupied.some(function (g_xy) {
    var hit = !d.grid_array_free[y+g_xy[1]] || !d.grid_array_free[y+g_xy[1]][x+g_xy[0]] || (d.grid_array[y+g_xy[1]][x+g_xy[0]] != r_index)
    return hit
  });
  if (occupied)
    return

  grid_occupied.forEach(function (g_xy) {
    d.grid_array_free[y+g_xy[1]][x+g_xy[0]] = false
  });

  p.position = new THREE.Vector3(d.grid_size/2, 0, 0)
  if (rot_q)
    p.position.applyQuaternion(rot_q)

  p.grid_pos_absolute = [x,y]
  clone_list.push({
    grid_id: r_index
   ,para: {
      placement: p
    }
  });
});

d.grid_by_index_free[r_index] = d.grid_by_index_free[r_index].filter(function (xy) {
  return d.grid_array_free[xy[1]][xy[0]]
});

return clone_list
    }

   ,scale: 22.5
  }
    }
// 13
   ,{
  path: "F:\\MMD\\accessories\\SF-brick-apartment-modular-building-test\\source\\apartmentbuilding1_v01_no-specular.x"
 ,LOD_far: {}
 ,placement: {
    grid_id_filter: function () {
var d = MMD_SA_options.Dungeon

var r_index = d.room_max_default
var placement     = { grid_occupied:[[0,-1],[0,0],[0,1]] }

var clone_list = []
d.grid_by_index_free[r_index].forEach(function (xy) {
  var x = xy[0]
  var y = xy[1]
  if (!d.grid_array_free[y][x])
    return

  var p_r0, p_r90
  for (var r = 1; r <= 2; r++) {
    var lvl = r*2
    var L, R, U, D
    L = R = true
    for (var _x = lvl; _x > 0; _x--) {
      if (d.grid_array[y][x+_x]!=r_index) {
        R = false
        break
      }
    }
    for (var _x = lvl; _x > 0; _x--) {
      if (d.grid_array[y][x-_x]!=r_index) {
        L = false
        break
      }
    }
    U = D = true
    for (var _y = lvl; _y > 0; _y--) {
      if (!d.grid_array[y+_y] || d.grid_array[y+_y][x]!=r_index) {
        D = false
        break
      }
    }
    for (var _y = lvl; _y > 0; _y--) {
      if (!d.grid_array[y-_y] || d.grid_array[y-_y][x]!=r_index) {
        U = false
        break
      }
    }
    if (!L && !R && !U && !D)
      continue

    lvl += 1
    if (L || R) {
      if ((R && d.grid_array[y][x+lvl]==0 && d.grid_array_free[y][x+lvl]) || (L && d.grid_array[y][x-lvl]==0 && d.grid_array_free[y][x-lvl])) {
        p_r0  = true
        break
      }
    }
    if (U || D) {
      if ((D && d.grid_array[y+lvl] && d.grid_array[y+lvl][x]==0 && d.grid_array_free[y+lvl][x]) || (U && d.grid_array[y-lvl] && d.grid_array[y-lvl][x]==0 && d.grid_array_free[y-lvl][x])) {
        p_r90 = true
        break
      }
    }
  }

  if (!p_r0 && !p_r90)
    return

// left-right
  var p = Object.assign({}, placement)
  p.rotation = (p_r0) ? {x:0, y:0, z:0} : {x:0, y:90, z:0}

  var grid_occupied = p.grid_occupied
  if (p.rotation.y % 180) {
    var rot_q = MMD_SA.TEMP_q.setFromEuler(MMD_SA.TEMP_v3.copy(p.rotation).multiplyScalar(Math.PI/180))
    var grid_occupied = grid_occupied.map(function (xy) {
      if (xy[0] || xy[1]) {
        MMD_SA.TEMP_v3.set(xy[0], 0, xy[1]).applyQuaternion(rot_q)
        return [Math.round(MMD_SA.TEMP_v3.x), Math.round(MMD_SA.TEMP_v3.z)]
      }
      return xy
    });
  }

  var occupied = grid_occupied.some(function (g_xy) {
    var hit = !d.grid_array_free[y+g_xy[1]] || !d.grid_array_free[y+g_xy[1]][x+g_xy[0]] || (d.grid_array[y+g_xy[1]][x+g_xy[0]] != r_index)
    return hit
  });
  if (occupied)
    return

  grid_occupied.forEach(function (g_xy) {
    d.grid_array_free[y+g_xy[1]][x+g_xy[0]] = false
  });
//console.log(x+','+y)
  p.grid_pos_absolute = [x,y]
  clone_list.push({
    grid_id: r_index
   ,para: {
      placement: p
    }
  });
});

d.grid_by_index_free[r_index] = d.grid_by_index_free[r_index].filter(function (xy) {
  return d.grid_array_free[xy[1]][xy[0]]
});

return clone_list
    }

   ,scale: 12.5
  }
 ,construction: {
    boundingBox_list: [
// NOTE: z value inversed from model
// -41.55045 29.58824 -12.85785
// -41.55045 29.58824 -26.11353
//  41.5505  29.58826 -12.85786
      { min:{x:-4.155045, y:0, z:1.285785}, max:{x:4.155045, y:2.958824, z:2.611353} }
     ,null
    ]
  }
 ,onclick: [
    {
      click_range: 64*2
     ,events: [{id:"apartmentbuilding1_entrance"}]
    }
  ]
    }
// 14
   ,{
  path: "F:\\MMD\\accessories\\SF-rauma-town-hall\\textures\\rauma_town_hall.x"
 ,placement: {
    grid_id_filter: function () {
var d = MMD_SA_options.Dungeon

var r_index = d.room_max_default
var p = { grid_occupied:[
/*
  [-2,-2],[-1,-2],[ 0,-2],[ 1,-2],[ 2,-2]
 ,[-2,-1],[ 2,-1]
 ,[-2, 0],[ 2, 0]
 ,[-2, 1],[ 2, 1]
 ,[-2, 2],[ 2, 2],[-1, 2],[ 0, 2],[ 1, 2]
*/
  [-1,-1],[ 0,-1],[ 1,-1]
 ,[-1, 0],[ 0, 0],[ 1, 0]
 ,[-1, 1],[ 0, 1],[ 1, 1]
] }

var count = Math.round(Math.sqrt(d.RDG_options.width * d.RDG_options.height) / 10)

var clone_list = []
d.grid_by_index_free[r_index].slice().shuffleMT().some(function (xy) {
  var x = xy[0]
  var y = xy[1]

  var occupied = p.grid_occupied.some(function (g_xy) {
    var hit = !d.grid_array_free[y+g_xy[1]] || !d.grid_array_free[y+g_xy[1]][x+g_xy[0]] || (d.grid_array[y+g_xy[1]][x+g_xy[0]] != r_index)
    return hit
  });
  if (occupied)
    return

  p = Object.assign({}, p)

  p.grid_occupied.forEach(function (g_xy) {
    d.grid_array_free[y+g_xy[1]][x+g_xy[0]] = false
  });
//console.log(x+','+y)
  p.grid_pos_absolute = [x,y]
  clone_list.push({
    grid_id: r_index
   ,para: {
      placement: p
    }
  });

  if (--count == 0)
    return true
});

d.grid_by_index_free[r_index] = d.grid_by_index_free[r_index].filter(function (xy) {
  return d.grid_array_free[xy[1]][xy[0]]
});

return clone_list
    }
   ,scale: 75
  }
 ,collision_by_mesh: true
 ,collision_by_mesh_sort_range: 32
 ,onclick: [{click_range:64*6, is_dblclick:true, event_id:"xmas_chat_tai"}]
    }
// 15
// 34.397 9.191549
// 34.397 37.9002
// F tire center: 0.00 2.78 -14.43
// B tire center: 0.00 4.14  13.01
   ,{
character_index: 3
 ,placement: {
    grid_id: 2
   ,grid_xy: [1,0]
   ,can_overlap: true
//   ,scale: 2.5
//   ,hidden: true
  }
 ,no_collision: true

 ,use_PC_ground_normal_when_following: true

 ,onclick: [
    {
      click_range: 64
     ,is_dblclick: true
     ,event_id: "batmobile"
    }
  ]

    }
// 16
   ,{
  path: "F:\\MMD\\accessories\\SF-low-poly-christmas-tree\\textures\\low-poly-christmas-tree.x"
//  path: "F:\\MMD\\accessories\\SF-low-poly-tree\\textures\\low_poly_tree_v00.x"
 ,placement: {
    grid_id_filter: function () {
var d = MMD_SA_options.Dungeon

var r_index = d.room_max_default+1
var grid_occupied = [
  [-1,-1],[ 0,-1],[ 1,-1]
 ,[-1, 0],[ 0, 0],[ 1, 0]
 ,[-1, 1],[ 0, 1],[ 1, 1]
];

var count = Math.round(Math.sqrt(d.RDG_options.width * d.RDG_options.height) / 2.5)

var clone_list = []
d.grid_by_index_free[r_index].slice().shuffleMT().some(function (xy) {
  var x = xy[0]
  var y = xy[1]

  var occupied = grid_occupied.some(function (g_xy) {
    var hit = !d.grid_array_free[y+g_xy[1]] || !d.grid_array_free[y+g_xy[1]][x+g_xy[0]] || (d.grid_array[y+g_xy[1]][x+g_xy[0]] != r_index)
    return hit
  });
  if (occupied)
    return

  grid_occupied.forEach(function (g_xy) {
    d.grid_array_free[y+g_xy[1]][x+g_xy[0]] = false
  });
//console.log(x+','+y)
  grid_occupied.forEach(function (g) {
    clone_list.push({
      grid_id: r_index
     ,para: {
        placement: {
          grid_pos_absolute: [x+g[0], y+g[1]]
         ,position: {x:MT.random()*64-32, y:0, z:MT.random()*64-32}
         ,rotation: {x:0, y:null, z:0}
         ,scale: (MT.random()*25+25)*2
        }
      }
    });
  });

  if (--count == 0)
    return true
});

d.grid_by_index_free[r_index] = d.grid_by_index_free[r_index].filter(function (xy) {
  return d.grid_array_free[xy[1]][xy[0]]
});

return clone_list
    }
  }

 ,no_collision: true
    }
// 17
   ,{ is_dummy:true }
/*
   ,{
  construction: {
    mesh_obj: { id:"MuzzleFlash0MESH" }
   ,GOML_head: [
  '<txr id="MuzzleFlash0UTXR" src="' + toFileProtocol(Settings.f_path + '\\tex\\muzzle_flash_stock01u.png') + '" />'
 ,'<txr id="MuzzleFlash0DTXR" src="' + toFileProtocol(Settings.f_path + '\\tex\\muzzle_flash_stock01d.png') + '" />'
 ,'<txr id="MuzzleFlash0BTXR" src="' + toFileProtocol(Settings.f_path + '\\tex\\muzzle_flash_stock01b.png') + '" />'
 ,'<geo id="MuzzleFlash00GEO" type="Plane" param="8 3" />'
 ,'<geo id="MuzzleFlash01GEO" type="Plane" param="3 3" />'
 ,'<mtl id="MuzzleFlash0UMTL" type="MeshBasic" param="map:#MuzzleFlash0UTXR; side:2;" />'
 ,'<mtl id="MuzzleFlash0DMTL" type="MeshBasic" param="map:#MuzzleFlash0DTXR; side:2;" />'
 ,'<mtl id="MuzzleFlash0BMTL" type="MeshBasic" param="map:#MuzzleFlash0BTXR; side:2;" />'
    ].join("\n")+"\n"
   ,GOML_scene: [
  '<obj id="MuzzleFlash0MESH" style="position:0 0 0; scale:0;">'
 ,'<mesh geo="#MuzzleFlash00GEO" mtl="#MuzzleFlash0UMTL" style="position:' + [0, 1.5,-4].join(" ") + '; rotateY:' + (Math.PI/2) + '; scale:1;" />'
 ,'<mesh geo="#MuzzleFlash00GEO" mtl="#MuzzleFlash0DMTL" style="position:' + [0,-1.5,-4].join(" ") + '; rotateY:' + (Math.PI/2) + '; scale:1;" />'
 ,'<mesh geo="#MuzzleFlash00GEO" mtl="#MuzzleFlash0UMTL" style="position:' + [ 1.5,0,-4].join(" ") + '; rotate:' + [(Math.PI/2),0,(-Math.PI/2)].join(" ") + '; scale:1;" />'
 ,'<mesh geo="#MuzzleFlash00GEO" mtl="#MuzzleFlash0DMTL" style="position:' + [-1.5,0,-4].join(" ") + '; rotate:' + [(Math.PI/2),0,(-Math.PI/2)].join(" ") + '; scale:1;" />'
 ,'<mesh geo="#MuzzleFlash01GEO" mtl="#MuzzleFlash0BMTL" style="position:' + [0,0,0].join(" ") + '; scale:1;" />'
 ,'<light id="MuzzleFlash0LIGHT" type="Poi" style="lightIntensity: 1.0; lightDistance: ' + (32*1) + '; position: ' + ([0,0,0].join(" ")) + '; lightColor:#ff8080;" />'
 ,'</obj>'
    ].join("\n")+"\n"
  }
 ,placement: {
    grid_id: 2
   ,position: {x:0, y:16, z:0}
   ,scale: 2.5
   ,can_overlap: true
   ,hidden: true
  }
 ,oncreate: function () {
var flash = MMD_SA_options.mesh_obj_by_id["#MuzzleFlash0MESH"]._obj
// NOTE: light is always the first child
for (var i = 1, i_max = flash.children.length-1; i < i_max; i++) {
  flash.children[i].renderDepth = 0
}
  }
 ,no_collision: true
 ,stay_on_scene: true
    }
*/
// 18
   ,{
  path: "F:\\MMD\\accessories\\SF-bmw-e36-low-poly\\textures\\bmw-e36-low-poly.x"
 ,construction: {
    castShadow: true
  }
 ,view_distance: 0.5
 ,placement: {
    grid_id_filter: function () {
var d = MMD_SA_options.Dungeon
var w = d.RDG_options.width
var h = d.RDG_options.height
var path = [
  {s:[ 0,-1], p:[[0,0],[1,0]], ry:90}
 ,{s:[ 1, 0], p:[[1,0],[1,1]], ry:0}
 ,{s:[ 0, 1], p:[[1,1],[0,1]], ry:-90}
 ,{s:[-1, 0], p:[[0,1],[0,0]], ry:180}
];

var clone_list = []
for (var i = 3, i_max = d.room_max_default; i < i_max; i++) {
  var room = d.room_info[i]
  var w = (room.width  - 1) +0.6*2
  var h = (room.height - 1) +0.6*2
  var x = room.x_min -0.6
  var y = room.y_min -0.6

  var path_index = Math.floor(MT.random()*4)
  var p = path[path_index]
  var ry_ini = p.ry+180
  var _path_ = [[p.p[0][0]*w+x, p.p[0][1]*h+y]]
  for (var k = 0; k < 4; k++) {
    _path_.push([p.p[1][0]*w+x, p.p[1][1]*h+y])
    if (++path_index > 3)
      path_index = 0
    p = path[path_index]
  }

  clone_list.push({
    grid_id: 0
   ,para: {
      _path_: _path_
     ,placement: {
        grid_pos_absolute:[_path_[0][0], _path_[0][1]]
       ,position: {x:0, y:d.para_by_grid_id[0].ground_y, z:0}
       ,rotation: {x:0, y:ry_ini, z:0}
       ,scale: 6
      }
    }
  });
}
return clone_list
    }
   ,can_overlap: true
  }
// ,no_collision: true
 ,oncreate: function  () {
var that = this
var d = MMD_SA_options.Dungeon
var p = this._path_
var pos_ini = this._obj.position.clone()
//var _q = new THREE.Quaternion(0,Math.sin((-Math.PI/2)/2),0, Math.cos((-Math.PI/2)/2))
var _onedned = function (motion) {
  var obj = motion.obj._obj
// path motion requires .rotation to be up-to-date, regadrless of .useQuaternion
  obj.rotation.y += -Math.PI/2
/*
  if (obj.useQuaternion) {
//    obj.quaternion.multiply(_q)
//    obj.quaternion.setFromEuler(obj.rotation)
  }
*/
};
this.motion = {
  path:[]
 ,onframestart: (function () {
    var grounded_time = 0
    return function (motion) {
var c = MMD_SA_options.Dungeon.character
if (c.ground_obj && (c.ground_obj.obj == motion.obj)) {
  if (motion.paused) {
    if (grounded_time) {
      if (RAF_timestamp > grounded_time + 1000)
        motion.paused = false
    }
    else
      grounded_time = RAF_timestamp
  }
  return
}
else
  grounded_time = 0
var disSq = motion.obj._obj.position.distanceToSquared(c.pos)
if (motion.paused) {
  if (disSq > 80*80)
    motion.paused = false
}
else {
  if (disSq <= 80*80)
    motion.paused = true
}
    };
  })()
 ,onframefinish: function (motion) {
var c = MMD_SA_options.Dungeon.character
if (c.ground_obj && (c.ground_obj.obj == motion.obj)) {
  c.ground_obj.mov = motion.mov_delta.clone()
}
  }
};
p.forEach(function (pt, idx) {
  var dis, duration, onended
  if (idx < p.length-1) {
    dis = (Math.abs(p[idx][0] - p[idx+1][0]) + Math.abs(p[idx][1] - p[idx+1][1])) * d.grid_size
    duration = dis/80 * (0.8+MT.random()*0.4)
    onended = _onedned
  }
  that.motion.path[idx] = {
    pos: (idx==0) ? pos_ini : new THREE.Vector3((p[idx][0]+0.5)*d.grid_size, pos_ini.y, (p[idx][1]+0.5)*d.grid_size)
   ,duration: duration
   ,onended: onended
  };
});
//console.log(this.motion)
  }
 ,collision_by_mesh: true
 ,onclick: [{click_range:64*2, is_dblclick:true, event_id:"xmas_chat"}]
    }
// 19
   ,{
  path: "F:\\MMD\\accessories\\SF-low-poly-abandoned-building\\textures\\LP_abandoned_building_v01.x"
 ,placement: {
    grid_id_filter: function () {
var d = MMD_SA_options.Dungeon
var clone_list = []
for (var i = 3, i_max = d.room_max_default; i < i_max; i++) {
  var room = d.room_info[i]
// not this room, if [0,0] free
  if (d.grid_array_free[room.y_min][room.x_min])
    continue
  var count = Math.round(room.width * room.height / 10)
  d.grid_by_index_free[i].slice().shuffleMT().some(function (xy) {
    d.grid_array_free[xy[1]][xy[0]] = false
    clone_list.push({
  grid_id:i
 ,para: {
    placement:{
      grid_pos_absolute: xy.slice()
     ,rotation: {x:0, y:Math.floor(MT.random()*4)*90, z:0}
    }
  }
    });
    return (--count == 0)
  });

  d.grid_by_index_free[i] = d.grid_by_index_free[i].filter(function (xy) {
    return d.grid_array_free[xy[1]][xy[0]]
  });
}
return clone_list
    }
   ,scale: 200
  }
    }
// 20
   ,{
  path: "F:\\MMD\\accessories\\SF-lowpoly-medieval-house\\textures\\lowpoly-medieval-house_v00.x"
 ,placement: {
    grid_id_filter: function () {
var d = MMD_SA_options.Dungeon

var r_index = d.room_max_default+1
var grid_occupied = [
  [-1,-1],[ 0,-1],[ 1,-1]
 ,[-1, 0],[ 0, 0],[ 1, 0]
 ,[-1, 1],[ 0, 1],[ 1, 1]
];

var count = Math.round(Math.sqrt(d.RDG_options.width * d.RDG_options.height) / 5)

var clone_list = []
d.grid_by_index_free[r_index].slice().shuffleMT().some(function (xy) {
  var x = xy[0]
  var y = xy[1]

  var occupied = grid_occupied.some(function (g_xy) {
    var hit = !d.grid_array_free[y+g_xy[1]] || !d.grid_array_free[y+g_xy[1]][x+g_xy[0]] || (d.grid_array[y+g_xy[1]][x+g_xy[0]] != r_index)
    return hit
  });
  if (occupied)
    return

  grid_occupied.forEach(function (g_xy) {
    d.grid_array_free[y+g_xy[1]][x+g_xy[0]] = false
  });
//console.log(x+','+y)
  grid_occupied.slice().shuffleMT().slice(0,4).forEach(function (g) {
    clone_list.push({
      grid_id: r_index
     ,para: {
        placement: {
          grid_pos_absolute: [x+g[0], y+g[1]]
// down
         ,rotation: {x:0, y:(g[1]<0)?180:((g[0])?90*((g[0]>0)?1:-1):0), z:0}
        }
      }
    });
  });

  if (--count == 0)
    return true
});

d.grid_by_index_free[r_index] = d.grid_by_index_free[r_index].filter(function (xy) {
  return d.grid_array_free[xy[1]][xy[0]]
});

return clone_list
    }
   ,scale: 250
  }
 ,onclick: [{click_range:64*3, is_dblclick:true, event_id:"xmas_chat"}]
    }
// 21
   ,{
  path: 'F:\\MMD\\accessories\\SF-mobile-shop\\textures\\Carrito_Dragon_Armas_v01.x'
 ,placement: {
    grid_id: 1+50+1
   ,grid_xy: [0.95,0.95]
   ,scale: 100
  }
 ,collision_by_mesh: true
 ,collision_by_mesh_sort_range: 32
 ,onclick: [
    {
      click_range: 128
     ,is_dblclick: true
     ,event_id: "SmallDragon"
    }
  ]
    }
// 22
   ,{
  path: Settings.f_path + "\\objs\\treasure_chest\\chest.x"
    }

  ]

 ,grid_material_list: [
// ceil
    {
  map: Settings.f_path + "\\tex\\3dtextures.me\\Stone Wall 002\\Stone_Wall_002_COLOR.png"
 ,normalMap: Settings.f_path + "\\tex\\3dtextures.me\\Stone Wall 002\\Stone_Wall_002_NRM.png"
 ,geo_by_lvl: [[1,1]]
 ,distance_by_lvl: []
    }
// floor
   ,{
  map: Settings.f_path + "\\tex\\TC_Snow0158_9_seamless.jpg"//"\\tex\\3dtextures.me\\Stone Floor 003\\Pavement_006_COLOR.png"//
// ,normalMap: Settings.f_path + "\\tex\\3dtextures.me\\Stone Floor 003\\Pavement_006_NRM.png"
 ,specular:'#404040'//specularMap: Settings.f_path + "\\tex\\3dtextures.me\\Stone Floor 003\\Pavement_006_SPEC.png"//
// ,displacementMap: Settings.f_path + "\\tex\\3dtextures.me\\Stone Floor 003\\Pavement_006_DISP_256x256.png"
// ,uDisplacementBias: -0.5
 ,geo_by_lvl: [[1,1]]//[[1,1],[16,16],[32,32],[128,128]]//
 ,distance_by_lvl: []//[1,2,4]//
 ,repeat_base: [64,64]
    }
/*
   ,{
  map: Settings.f_path + "\\tex\\3dtextures.me\\Stone_Floor_004\\Stone_Floor_004_COLOR.png"
 ,normalMap: Settings.f_path + "\\tex\\3dtextures.me\\Stone_Floor_004\\Stone_Floor_004_NRM.png"
 ,specularMap: Settings.f_path + "\\tex\\3dtextures.me\\Stone_Floor_004\\Stone_Floor_004_SPEC.png"
// ,displacementMap: Settings.f_path + "\\tex\\3dtextures.me\\Stone Floor 003\\Pavement_006_DISP_256x256.png"
// ,uDisplacementBias: -0.5
 ,geo_by_lvl: [[1,1]]//[[1,1],[16,16],[32,32],[128,128]]//
 ,distance_by_lvl: []//[1,2,4]//
 ,repeat_base: [64,64]
    }
*/
// wall
   ,{
  map: Settings.f_path + "\\tex\\3dtextures.me\\Stone Wall 004\\Wall Stone 004_COLOR.jpg"
 ,normalMap: Settings.f_path + "\\tex\\3dtextures.me\\Stone Wall 004\\Wall Stone 004_NRM.jpg"
// ,displacementMap: Settings.f_path + "\\tex\\3dtextures.me\\Stone Wall 004\\Wall Stone 004_DISP_256x256.png"
// ,uDisplacementScale: 3
 ,geo_by_lvl: [[1,1]]//[[1,1],[16,16],[32,32],[128,128]]//
 ,distance_by_lvl: []//[1,3,5]
 ,repeat_base: [64,64]
    }

// floor2
   ,{
  map: Settings.f_path + "\\tex\\33_asphalt snow texture-seamless.jpg"//"\\tex\\3dtextures.me\\Asphalt 001\\Asphalt_001_COLOR.jpg"//
// ,normalMap: Settings.f_path + "\\tex\\3dtextures.me\\Asphalt 001\\Asphalt_001_NRM.jpg"
 ,specular:'#404040'//specularMap: Settings.f_path + "\\tex\\3dtextures.me\\Asphalt 001\\Asphalt_001_SPEC.jpg"//
// ,displacementMap: Settings.f_path + "\\tex\\3dtextures.me\\Asphalt 001\\Asphalt_001_DISP_256x256.png"
// ,uDisplacementBias: -0.5
 ,geo_by_lvl: [[1,1]]//[[1,1],[16,16],[32,32],[128,128]]//
 ,distance_by_lvl: []//[1,2,4]//
 ,repeat_base: [64,64]
    }
// floor3 (grass)
   ,{
  map: Settings.f_path + "\\tex\\27_snow with grass texture-seamless.jpg"//"\\tex\\3dtextures.me\\Grass_001\\Grass_001_COLOR_1024x1024.png"//
// ,normalMap: Settings.f_path + "\\tex\\3dtextures.me\\Grass_001\\Grass_001_NRM_1024x1024.png"
 ,specular:'#404040'//specularMap: Settings.f_path + "\\tex\\3dtextures.me\\Grass_001\\Grass_001_SPEC.jpg"
// ,displacementMap: Settings.f_path + "\\tex\\3dtextures.me\\Stone Floor 003\\Pavement_006_DISP_256x256.png"
// ,uDisplacementBias: -0.5
 ,geo_by_lvl: [[1,1]]//[[1,1],[16,16],[32,32],[128,128]]//
 ,distance_by_lvl: []//[1,2,4]//
// ,repeat_base: [64,64]
    }
// water
   ,{
  map: System.Gadget.path + "/images/watershader_water.jpg"
 ,specular:'#404040'
 ,geo_by_lvl: [[1,1],[16,16],[32,32],[64,64]]
 ,distance_by_lvl: [1,4,99]
,mirrorTextureIndex:0
,waveBaseSpeed:0.5
,opacity:0.75
//,renderDepth:999999
//,side:2
    }
  ]

 ,motion: {
    "camera appeal 03": { path:System.Gadget.path + '/MMD.js/motion/model/camera_appeal03.vmd' }
/*
   ,"PC default": { path:System.Gadget.path + '/MMD.js/motion/tsuna/tsuna_standby.vmd', index:0, para: { adjust_center_view_disabled:true, onended: function () { MMD_SA._no_fading=true; } }}
   ,"NPC talk A": { path:System.Gadget.path + '/MMD.js/motion/talk/xs-talk8-west-negotiate.vmd' }
   ,"NPC walk A": { path:System.Gadget.path + '/MMD.js/motion/walk_n_run/walk_A01_f0-40_s9.85.vmd' }
*/
/*
   ,"PC sleigh default": { path:System.Gadget.path + '/MMD.js/motion/standmix2_modified.vmd', para: { adjust_center_view_disabled:true, onended: function () { MMD_SA._no_fading=true; }
 ,adjustment_per_model: {
    _default_ : {
  skin_filter: /^DISABLED$/
    }
  }
    }}
   ,"deer run": { path: 'F:\\MMD\\models\\Rudolph\\vmd\\run2_3780F.vmd'
     ,para: {
  model_index_list:[3]
      }
    }
   ,"deer idle": { path: 'F:\\MMD\\models\\Rudolph\\vmd\\rudolph_idle.vmd'
     ,para: {
  model_index_list:[3]
 ,use_armIK: true
      }
    }
*/
/*
   ,"PC fall on ass": { path:'MMD.js/motion/hit/w01_すべって尻もち.vmd', para:{
  adjust_center_view_disabled:true, get look_at_screen_ratio() { var t=THREE.MMD.getModels()[0].skin.time; return ((t>1)?0:1-t); }
 ,onended: function () {
MMD_SA._ignore_physics_reset=true; MMD_SA._no_fading=true;
  }
 ,adjustment_per_model: {
    _default_ : {
  morph_default: {"瞳小": { weight_scale:0.75 }}
    }
  }
    }}

   ,"PC stand up from ass": { path:'MMD.js/motion/casual/女の子座り→立ち上がる_gumi_v01.vmd', para: {
  adjust_center_view_disabled:true, get look_at_screen_ratio() { var t=THREE.MMD.getModels()[0].skin.time; return ((t>1)?1:t); }
 ,onended: function () {
MMD_SA._hit_legs_=false; MMD_SA._no_fading=true;
MMD_SA_options.motion_shuffle_list_default = MMD_SA_options._motion_shuffle_list_default.slice();
if (!MMD_SA_options.Dungeon._states.event_mode) {
  MMD_SA_options.Dungeon._states.character_movement_disabled = false;
  MMD_SA_options.Dungeon._states.object_click_disabled = false;
}
  }
 ,adjustment_per_model: {
    _default_ : {
  skin_default: {
  "右足ＩＫ": { keys_mod:[{ frame:0, pos:{x:-2.33-0.5, y:-0.4, z:1.3} }, { frame:7,  pos:{x:-2.33-0.5, y:-0.4, z:1.3} }] }
 ,"左足ＩＫ": { keys_mod:[{ frame:0, pos:{x: 2.33+0.5, y:-0.4, z:1.3} }, { frame:47, pos:{x: 2.33+0.5, y:-0.4, z:1.3} }] }
  }
    }
   ,"TdaMeiko_Bikini_TypeA.pmx" : {
  skin_default: {
  "右足ＩＫ": { keys_mod:[{ frame:0, pos:{x:-2.33-1, y:-0.4, z:1.3} }, { frame:7,  pos:{x:-2.33-1, y:-0.4, z:1.3} }] }
 ,"左足ＩＫ": { keys_mod:[{ frame:0, pos:{x: 2.33+1, y:-0.4, z:1.3} }, { frame:47, pos:{x: 2.33+1, y:-0.4, z:1.3} }] }
  }
    }
  }
    }}
*/
/*
   ,"PC catwalk": { path:System.Gadget.path + '/MMD.js/motion/walk_n_run/walk_A34_f0-42.vmd', para: { adjust_center_view_disabled:true, onended: function () { MMD_SA._no_fading=true; } }}

   ,"transform magical": {
      path:'F:\\MMD\\motions\\着地モーション2\\05_魔力的な何か.vmd'
     ,para: {
  onended: function () {
MMD_SA._no_fading=true
MMD_SA_options.Dungeon.run_event()
  }
 ,adjust_center_view_disabled: true
 ,look_at_screen: false
 ,adjustment_per_model: {
    _default_ : {
  morph_default: {
    "Batgal": {keys:[
 {time:0/30, weight:0}
,{time:36/30, weight:0}
,{time:37/30, weight:1}
    ]}
  }
    }
  }
      }
    }

   ,"transform deep": {
      path:'F:\\MMD\\motions\\着地モーション2\\03_深め.vmd'
     ,para: {
  onended: function () {
MMD_SA._no_fading=true
MMD_SA_options.Dungeon.run_event()
  }
 ,adjust_center_view_disabled: true
 ,look_at_screen: false
 ,adjustment_per_model: {
    _default_ : {
  morph_default: {
    "Batgal": {keys:[
 {time:0/30, weight:1}
,{time:36/30, weight:1}
,{time:37/30, weight:0}
    ]}
  }
    }
  }
      }
    }
*/
  }
 ,item_base: {
    "batlogo": {
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
/*
 ,item_base: {
    "batlogo": {
      icon_path: Settings.f_path + '\\images\\batman-logo-64x64.png'
     ,info_short: "????"
     ,stock_max: 1
     ,stock_default: 1
     ,action: {
  func: function () {
MMD_SA_options.Dungeon.run_event("batlogo")
  }
// ,anytime: true
      }

     ,_event_batgal: function (e) {
var model = e.detail.model
var _m_idx = model.pmx.morphs_index_by_name["Batgal"]
var _m = model.pmx.morphs[_m_idx]
MMD_SA._custom_morph.push({ key:{ weight:1, morph_type:_m.type, morph_index:_m_idx }, idx:model.morph.target_index_by_name["Batgal"] })
      }
    }
  }
*/
 ,events_default: {
    "batlogo": [
//0
      [
        {
          message: {
  content: "1. ????\n2. Leave it alone."
 ,bubble_index: 2
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
          func: function () {
/*
// 87,65,83,68
// "up","left","down","right"
var key_map = [
  { order:1000+0, keyCode:87, id:"up",    motion_id:"PC run fast", mov_speed:133/70*30 }
 ,{ order:1000+1, keyCode:65, id:"left",  motion_id:"PC run fast", mov_speed:133/70*30 }
 ,{ order:1000+2, keyCode:83, id:"down",  motion_id:"PC run fast", mov_speed:133/70*30 }
 ,{ order:1000+3, keyCode:68, id:"right", motion_id:"PC run fast", mov_speed:133/70*30 }
];
MMD_SA_options.Dungeon.key_map_swap(key_map)
*/
          }
         ,message: {}
         ,motion: {
  "0": { name:"transform magical" }
          }
        }
       ,{
          func: function () {
var e_func = MMD_SA_options.Dungeon_options.item_base.batlogo._event_batgal
window.removeEventListener("SA_MMD_model0_process_morphs", e_func)
window.addEventListener("SA_MMD_model0_process_morphs", e_func)
          }
         ,placement: {
  "object15_0": {
    position: { x:0, y:0,  z:64, grounded:true }
   ,rotation: { x:0,  y:90, z:0}
   ,behind_camera:true
  }
          }
         ,set_event_flag: { branch_index:2 }
         ,ended: true
         ,motion: { "0":{} }
        }
      ]
//2
     ,[
        {
          message: {
  content: "1. ????\n2. Leave it alone."
 ,bubble_index: 2
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
          func: function () {
var e_func = MMD_SA_options.Dungeon_options.item_base.batlogo._event_batgal
window.removeEventListener("SA_MMD_model0_process_morphs", e_func)

// 87,65,83,68
//MMD_SA_options.Dungeon.key_map_swap([87,65,83,68])
          }
         ,message: {}
         ,motion: {
  "0": { name:"transform deep" }
          }
        }
       ,{
          func: function () {
          }
         ,placement: {
  "object15_0": {
    hidden: true
  }
          }
         ,set_event_flag: { branch_index:0 }
         ,ended: true
         ,motion: { "0":{} }
        }
      ]
    ]
   ,"jukebox": [
//0
      [
        {
          func: (function () {
            var upsidedown_mode = false

            return function () {
var d = MMD_SA_options.Dungeon
if (d.area_id != "start")
  return

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
MMD_SA.scene.fog.near=64*8*0.25; MMD_SA.scene.fog.far=64*8*0.9;
jThree("#pointlight_main").three(0).intensity=1;
jThree("#pointlight_main").three(0).near = jThree("#pointlight_main").three(0).far = (64*100*4*4*2);
jThree("#MMD_AmbLight").three(0).color = new THREE.Color(MMD_SA_options.Dungeon_options.options_by_area_id["start"].ambient_light_color || MMD_SA_options.ambient_light_color)
jThree("#MMD_DirLight").three(0).color = new THREE.Color(MMD_SA_options.Dungeon_options.options_by_area_id["start"].light_color || MMD_SA_options.light_color)
if (MMD_SA_options.Dungeon.skydome) {
  MMD_SA_options.Dungeon.skydome.texture_index=0;
  MMD_SA_options.Dungeon.skydome.texture_setup();
}
var PPE = MMD_SA_options.MME.PostProcessingEffects
//PPE.use_BloomPostProcess = false
var JustSnow = PPE._effects["JustSnow"]
if (JustSnow) {
  JustSnow.enabled = true
  MMD_SA.MME_composer_disabled_check(PPE._composers_list[JustSnow._composer_index])
  MMD_SA.MME_set_renderToScreen()
}

d.object_list[1]._obj_proxy.hidden = false
d.object_list[1]._obj_proxy.visible = true
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
MMD_SA.scene.fog.near=MMD_SA.scene.fog.far=(64*100*4*4*2);
jThree("#pointlight_main").three(0).intensity=0;
jThree("#MMD_AmbLight").three(0).color=new THREE.Color("#FFFFFF");
jThree("#MMD_DirLight").three(0).color=new THREE.Color("#606060");
if (MMD_SA_options.Dungeon.skydome) {
  MMD_SA_options.Dungeon.skydome.texture_index=1;
  MMD_SA_options.Dungeon.skydome.texture_setup();
}
var PPE = MMD_SA_options.MME.PostProcessingEffects
//PPE.use_BloomPostProcess = true
var JustSnow = PPE._effects["JustSnow"]
if (JustSnow) {
  JustSnow.enabled = false
  MMD_SA.MME_composer_disabled_check(PPE._composers_list[JustSnow._composer_index])
  MMD_SA.MME_set_renderToScreen()
}

d.object_list[1]._obj_proxy.hidden = true
d.object_list[1]._obj_proxy.visible = false

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
// ,'F:\\MMD\\stages\\Sky Dome\\スカイドームF2配布データVer1.3\\Skydome_F2_Ver1.3\\F201.jpg'
    ]
//   ,fog: { color:"" }
  }
// fixed properties across dungeon levels END


 ,options_by_area_id: {
    "start": {

  RDG_options: {
    width:  110,
    height: 110,
    minRoomSize: 3,
    maxRoomSize: 10

,DG_room_count: 10*5
  }

 ,grid_size: 64*3
 ,view_radius: 12

// ,point_light: { color:"#000" }//"#E0E0E0" }
// ,ambient_light_color: "#FFF"
// ,light_color: '#606060'

// ,fog: { linear:true, color:"#FFF" }
 ,skydome: {
    fog: { color:"" }
  }

 ,para_by_grid_id: {
    "1": {
  hidden_on_map:true

 ,grid_setup: (function () {
//var grid_bound = [[0,-1], [1,0], [0,1], [-1,0]];
var grid_bound = [
  [-1,-1],[ 0,-1],[ 1,-1]
 ,[-1, 0]        ,[ 1, 0]
 ,[-1, 1],[ 0, 1],[ 1, 1]
];
return function (x, y) {
  var d = MMD_SA_options.Dungeon
  grid_bound.some(function (b) {
    var g = d.grid_array[y+b[1]]
    if (g && (g[x+b[0]] > 1) && (g[x+b[0]] < d.room_max_default)) {
      d.grid_array[y][x] = 0
      return true
    }
  });
};
  })()

    }

   ,"0": {
  map_grid_color: "black"
 ,floor_material_index: 3

 ,ground_y: -2
 ,ground_y_visible: -2

 ,grid_setup: (function () {
var grid_bound = [
  [-1,-1],[ 0,-1],[ 1,-1]
 ,[-1, 0]        ,[ 1, 0]
 ,[-1, 1],[ 0, 1],[ 1, 1]
];
var countryside = { floor_material_index:4 }
return function (x, y) {
  var d = MMD_SA_options.Dungeon
  var room_index_new = d.room_max_default + 1
  var passed = grid_bound.every(function (b) {
    var g = d.grid_array[y+b[1]]
    return g && ((g[x+b[0]] == 0) || (g[x+b[0]] == room_index_new))
  });
  if (passed) {
    d.para_by_grid_id[room_index_new] = countryside
    d.grid_array[y][x] = room_index_new
  }
};
  })()

    }

  }

 ,object_list: [
    {object_index:0}

   ,{object_index:2}
   ,{object_index:9}
   ,{object_index:10}
   ,{object_index:11}
   ,{object_index:19}

   ,{object_index:1}
   ,{object_index:12}
   ,{object_index:13}
   ,{object_index:14}
   ,{object_index:19
 ,placement: {
    grid_id_filter: function () {
var d = MMD_SA_options.Dungeon

var r_index = d.room_max_default
var grid_occupied = [
  [-1,-1],[ 0,-1],[ 1,-1]
 ,[-1, 0],[ 0, 0],[ 1, 0]
 ,[-1, 1],[ 0, 1],[ 1, 1]
];

var count = Math.round(Math.sqrt(d.RDG_options.width * d.RDG_options.height) / 10)

var clone_list = []
d.grid_by_index_free[r_index].slice().shuffleMT().some(function (xy) {
  var x = xy[0]
  var y = xy[1]

  var occupied = grid_occupied.some(function (g_xy) {
    var hit = !d.grid_array_free[y+g_xy[1]] || !d.grid_array_free[y+g_xy[1]][x+g_xy[0]] || (d.grid_array[y+g_xy[1]][x+g_xy[0]] != r_index)
    return hit
  });
  if (occupied)
    return

  grid_occupied.forEach(function (g_xy) {
    d.grid_array_free[y+g_xy[1]][x+g_xy[0]] = false
    var xy_str = (x+g_xy[0]) + "x" + (y+g_xy[1])
    if (!d.para_by_xy[xy_str])
      d.para_by_xy[xy_str] = { floor_material_index:3, hidden_on_map:true }
  });
//console.log(x+','+y)
  grid_occupied.slice().shuffleMT().slice(0,4).forEach(function (g) {
    clone_list.push({
      grid_id: r_index
     ,para: {
        placement: {
          grid_pos_absolute: [x+g[0], y+g[1]]
// up
         ,rotation: {x:0, y:(g[1]>0)?180:((g[0])?90*((g[0]>0)?-1:1):0), z:0}
        }
      }
    });
  });

  if (--count == 0)
    return true
});

d.grid_by_index_free[r_index] = d.grid_by_index_free[r_index].filter(function (xy) {
  return d.grid_array_free[xy[1]][xy[0]]
});

return clone_list
    }
   ,scale: 200
  }
    }
   ,{object_index:2
 ,placement: {
    grid_id_filter: function () {
var d = MMD_SA_options.Dungeon

var r_index = d.room_max_default
var grid_occupied = [
  [-1,-1],[ 0,-1],[ 1,-1]
 ,[-1, 0],[ 0, 0],[ 1, 0]
 ,[-1, 1],[ 0, 1],[ 1, 1]
];

var count = Math.round(Math.sqrt(d.RDG_options.width * d.RDG_options.height) / 10)

var clone_list = []
d.grid_by_index_free[r_index].slice().shuffleMT().some(function (xy) {
  var x = xy[0]
  var y = xy[1]

  var occupied = grid_occupied.some(function (g_xy) {
    var hit = !d.grid_array_free[y+g_xy[1]] || !d.grid_array_free[y+g_xy[1]][x+g_xy[0]] || (d.grid_array[y+g_xy[1]][x+g_xy[0]] != r_index)
    return hit
  });
  if (occupied)
    return

  grid_occupied.forEach(function (g_xy) {
    d.grid_array_free[y+g_xy[1]][x+g_xy[0]] = false
  });
//console.log(x+','+y)
  grid_occupied.slice().shuffleMT().slice(0,4).forEach(function (g) {
    clone_list.push({
      grid_id: r_index
     ,para: {
        placement: {
          grid_pos_absolute: [x+g[0], y+g[1]]
// down
         ,rotation: {x:0, y:(g[1]<0)?180:((g[0])?90*((g[0]>0)?1:-1):0), z:0}
        }
      }
    });
  });

  if (--count == 0)
    return true
});

d.grid_by_index_free[r_index] = d.grid_by_index_free[r_index].filter(function (xy) {
  return d.grid_array_free[xy[1]][xy[0]]
});

return clone_list
    }
   ,scale: 50
  }
    }
   ,{object_index:0
 ,placement: {
    grid_id_filter: function () {
var d = MMD_SA_options.Dungeon

var r_index = d.room_max_default
var grid_occupied = [
  [-1,-1],[ 0,-1],[ 1,-1]
 ,[-1, 0],[ 0, 0],[ 1, 0]
 ,[-1, 1],[ 0, 1],[ 1, 1]
];

var count = Math.round(Math.sqrt(d.RDG_options.width * d.RDG_options.height) / 10)

var clone_list = []
d.grid_by_index_free[r_index].slice().shuffleMT().some(function (xy) {
  var x = xy[0]
  var y = xy[1]

  var occupied = grid_occupied.some(function (g_xy) {
    var hit = !d.grid_array_free[y+g_xy[1]] || !d.grid_array_free[y+g_xy[1]][x+g_xy[0]] || (d.grid_array[y+g_xy[1]][x+g_xy[0]] != r_index)
    return hit
  });
  if (occupied)
    return

  grid_occupied.forEach(function (g_xy) {
    d.grid_array_free[y+g_xy[1]][x+g_xy[0]] = false
    var xy_str = (x+g_xy[0]) + "x" + (y+g_xy[1])
    if (!d.para_by_xy[xy_str])
      d.para_by_xy[xy_str] = { floor_material_index:4, hidden_on_map:true }
  });
//console.log(x+','+y)
  [[0,0]].forEach(function (g) {
    clone_list.push({
      grid_id: r_index
     ,para: {
        placement: {
          grid_pos_absolute: [x+g[0], y+g[1]]
         ,rotation: {x:0, y:Math.floor(MT.random()*4)*90, z:0}
        }
      }
    });
  });

  if (--count == 0)
    return true
});

d.grid_by_index_free[r_index] = d.grid_by_index_free[r_index].filter(function (xy) {
  return d.grid_array_free[xy[1]][xy[0]]
});

return clone_list
    }
   ,scale: 40
  }
    }
   ,{object_index:8
 ,placement: {
    grid_id_filter: function () {
var d = MMD_SA_options.Dungeon

var r_index = d.room_max_default
var grid_occupied = [
  [-1,-1],[ 0,-1],[ 1,-1]
 ,[-1, 0],[ 0, 0],[ 1, 0]
 ,[-1, 1],[ 0, 1],[ 1, 1]
];

var count = Math.round(Math.sqrt(d.RDG_options.width * d.RDG_options.height) / 10)

var clone_list = []
d.grid_by_index_free[r_index].slice().shuffleMT().some(function (xy) {
  var x = xy[0]
  var y = xy[1]

  var occupied = grid_occupied.some(function (g_xy) {
    var hit = !d.grid_array_free[y+g_xy[1]] || !d.grid_array_free[y+g_xy[1]][x+g_xy[0]] || (d.grid_array[y+g_xy[1]][x+g_xy[0]] != r_index)
    return hit
  });
  if (occupied)
    return

  grid_occupied.forEach(function (g_xy) {
    d.grid_array_free[y+g_xy[1]][x+g_xy[0]] = false
    var xy_str = (x+g_xy[0]) + "x" + (y+g_xy[1])
    if (!d.para_by_xy[xy_str])
      d.para_by_xy[xy_str] = { floor_material_index:3, hidden_on_map:true }
  });
//console.log(x+','+y)
  [[0,0]].forEach(function (g) {
    clone_list.push({
      grid_id: r_index
     ,para: {
        placement: {
          grid_pos_absolute: [x+g[0], y+g[1]]
         ,rotation: {x:0, y:Math.floor(MT.random()*4)*90, z:0}
        }
      }
    });
  });

  if (--count == 0)
    return true
});

d.grid_by_index_free[r_index] = d.grid_by_index_free[r_index].filter(function (xy) {
  return d.grid_array_free[xy[1]][xy[0]]
});

return clone_list
    }
   ,scale: 25
  }
    }

   ,{object_index:15}
//,{object_index:17}

   ,{object_index:8}
   ,{object_index:16
 ,placement: {
    grid_id: 2
   ,grid_xy: [1,1]
   ,scale:25*2
  }
    }
   ,{object_index:5
 ,placement: {
    grid_id: 2
   ,position: { x:  0, y:0.1, z:0 }
   ,rotation: { x:-90, y:  0, z:0 }
   ,scale: 8
  }
 ,onclick: [
    {
      click_range: 32
     ,event_id: "sewer_0"
    }
  ]
    }

   ,{object_index:21}

   ,{object_index:3}
   ,{object_index:16}
   ,{object_index:20}

   ,{object_index:4}

   ,{object_index:18}

  ]

 ,events: {
    "onstart": [
      [
        {
          message: {
  content: "Time to go Christmas carolling~!"
          }
         ,motion: {
  "1": { name:"NPC walk A" }
          }
        }
      ]
    ]

   ,"PassionTimes": [
      [
        {
          message: {
  content: "Miku and everybody, Merry Christmas~!"
          }
        }
       ,{
          message: {
  content: "Miku: Merry Christmas~!"
 ,para: { invertH_side:true  }
          }
        }
       ,{
          message: {
  content: "Hey, you guys are going Christmas carolling with me, aren't you?"
          }
        }
       ,{
          message: {
  content: 'Miku: Sorry, Meiko, we are all busy working on "System Animator 11". You have to do it alone this year...'
 ,para: { invertH_side:true  }
          }
        }
       ,{
          message: {
  content: "What!?"
 ,bubble_index: 1
          }
         ,motion: {
"0": [{ name:"PC fall on ass" }, { name:"PC stand up from ass" }]
          }
        }
       ,{
          message: {
  content: "Miku: Don't worry. We have prepared a Christmas sleigh for you. And remember to bring this jukebox."
 ,para: { invertH_side:true  }
          }
        }
       ,{
          message: {
  content: "Well, I think I can handle it."
          }
        }
       ,{
          message: {
  content: "Miku: Good luck. Bring the joy to the world~!"
 ,para: { invertH_side:true  }
          }
        }
      ]
    ]

   ,"SmallDragon": [
      [
        {
          message: {
  content: "Hey little dragon, Merry Christmas~!"
          }
        }
       ,{
          message: {
  content: "Little dragon: Merry Christmas~!"
 ,para: { invertH_side:true  }
          }
        }
      ]
    ]

   ,"NPC_girl": [
      [
        {
          message: {
  content: 'Merry Christmas~!'
 ,NPC: 1
          }
         ,turn_to_character: 1
         ,look_at_character: 1
         ,NPC_turns_to_you: 1

         ,object_motion_paused: true
        }
       ,{
          message: {
  content: 'Merry Christmas~!'
          }
        }
       ,{
          ended: true
         ,object_motion_paused: false
//         ,motion: { "0":{}, "1":{} }
        }
      ]
    ]

   ,"sewer_0": [
//0
      [
        {
          message: {
  content: "1. Enter seweage.\n2. Leave."
 ,bubble_index: 2
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
  set_event_flag: { branch_index:0 }
 ,set_starting_position: { area_id:null, position:"current" }
 ,load_area: { id:"sewer_0" }
// ,ended: true
        }
      ]
    ]

   ,"apartmentbuilding1_entrance": [
//0
      [
        {
          message: {
  content: "1. Enter building.\n2. Leave."
 ,bubble_index: 2
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
/*
  func: (function () {
var key_map = [];
var key_id = ["up","left","down","right"];
[87,65,83,68].forEach(function (keyCode, idx) {
  key_map.push({ order:1000+idx, keyCode:keyCode, id:key_id[idx], motion_id:"PC catwalk", mov_speed:360/1800*30 });
});
return function () {
  MMD_SA_options.Dungeon.key_map_swap(key_map);
};
  })()
 ,*/set_event_flag: { branch_index:0 }
 ,set_starting_position: { area_id:null, position:"current" }
 ,load_area: { id:"home" }
// ,ended: true
        }
      ]
    ]

   ,"xmas_chat": [
      [
        {
          message: {
  content: 'Merry Christmas~!'
          }
        }
       ,{
          message: {
  content: 'Citizen: Merry Christmas~!'
 ,para: { invertH_side:true  }
          }
        }
      ]
    ]

   ,"xmas_chat_frodo": [
      [
        {
          message: {
  content: 'Frodo Baggins: Merry Christmas~!'
 ,para: { invertH_side:true  }
          }
        }
       ,{
          message: {
  content: 'Merry Christmas~!'
          }
        }
      ]
    ]

   ,"xmas_chat_toby": [
      [
        {
          message: {
  content: 'Shopkeeper: Merry Christmas~!'
 ,para: { invertH_side:true  }
          }
        }
       ,{
          message: {
  content: 'Merry Christmas~!'
          }
        }
      ]
    ]

   ,"xmas_chat_tai": [
      [
        {
          message: {
  content: 'Government Official: Merry Christmas~!'
 ,para: { invertH_side:true  }
          }
        }
       ,{
          message: {
  content: 'Merry Christmas~!'
          }
        }
      ]
    ]

   ,"batmobile": [
//0
      [
        {
          message: {
  content: "1. Drive car.\n2. Stay."
 ,bubble_index: 2
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
  mount: {
    speed_scale: 5
   ,PC_hidden: true
   ,camera_position_base: [0,25,-75]
   ,msg_para: { scale:2, pos_mod:[0,10,0] }
//   ,mount_position: {x:0, y:3.75, z:-28}
   ,dismount_position: {x:32, y:0, z:0}
   ,ondismount: {
      set_event_flag: { id:"batmobile", branch_index:0 }
//     ,func: function () { MMD_SA_options.Dungeon.key_map_swap([87,65,83,68, 32]) }
//     ,unfollow_PC: ["object17_0"]
//     ,placement: { "object17_0": { hidden:true} }
    }
   ,onupdate: (function () {
var rot, rot_delta

return function () {
  if (!rot) {
    rot = new THREE.Quaternion()
    rot_delta = new THREE.Quaternion().setFromEuler(MMD_SA.TEMP_v3.set(20/180*Math.PI,0,0))
  }

  var mesh = this.obj._obj
  rot = rot.multiply(rot_delta)
//Engine_IK
//前ホイール
  MMD_SA_options.model_para_obj_all[3]._custom_skin = [
    { key:{ name:"前ホイール", pos:[0,0,0] ,rot:rot.toArray(), interp:MMD_SA._skin_interp_default }, idx:mesh.bones_by_name["前ホイール"]._index }
   ,{ key:{ name:"後ホイール", pos:[0,0,0] ,rot:rot.toArray(), interp:MMD_SA._skin_interp_default }, idx:mesh.bones_by_name["後ホイール"]._index }
  ];
//DEBUG_show(rot.toArray())
};
    })()
/*
   ,onupdate: function () {
var model = THREE.MMD.getModels()[3]
var motion_name = (model.skin && MMD_SA.motion[model.skin._motion_index].filename)
if (motion_name != "run2_3780F") {
  var model_para = MMD_SA_options.model_para_obj_all[3]
  model_para._motion_name_next = "run2_3780F"
}
    }
   ,onidle: function () {
var model = THREE.MMD.getModels()[3]
var motion_name = (model.skin && MMD_SA.motion[model.skin._motion_index].filename)
if (motion_name != "rudolph_idle") {
  var model_para = MMD_SA_options.model_para_obj_all[3]
  model_para._motion_name_next = "rudolph_idle"
}
    }
*/
/*
   ,onupdate: (function () {
var F_tire_rot_q = [0,0,0,1]
var B_tire_rot_q = [0,0,0,1]

return function () {
// F tire center: 0.00 2.78 -14.43 / 17.467255153959250405852297211034
// B tire center: 0.00 4.14  13.01 / 26.012387171723488014470687213554
  var mesh = this.obj._obj
  var dis = MMD_SA.TEMP_v3.copy(mesh.position).sub(this._pos_old).length()
  F_tire_rot_q = MMD_SA._q1.fromArray(F_tire_rot_q).multiply(MMD_SA.TEMP_q.setFromEuler(MMD_SA.TEMP_v3.set(dis/(17.467255153959250405852297211034*2.5)*Math.PI*2, 0, 0))).toArray()
  B_tire_rot_q = MMD_SA._q1.fromArray(B_tire_rot_q).multiply(MMD_SA.TEMP_q.setFromEuler(MMD_SA.TEMP_v3.set(dis/(26.012387171723488014470687213554*2.5)*Math.PI*2, 0, 0))).toArray()
  MMD_SA_options.model_para_obj_all[3]._custom_skin = [
    { key:{ name:"F-tire", pos:[0,0,0] ,rot:F_tire_rot_q, interp:MMD_SA._skin_interp_default }, idx:mesh.bones_by_name["F-tire"]._index }
   ,{ key:{ name:"B-tire", pos:[0,0,0] ,rot:B_tire_rot_q, interp:MMD_SA._skin_interp_default }, idx:mesh.bones_by_name["B-tire"]._index }
  ];

  var flash = MMD_SA_options.mesh_obj_by_id["#MuzzleFlash0MESH"]._obj
  var s = (flash.scale.x == 2.5) ? 1.25 : 2.5
  flash.scale.set(s,s,s)
  flash.visible = true
  flash.children.forEach(function(c,idx){c.visible=true})
//  console.log(flash)

};
    })()
   ,onidle: function () {
var flash = MMD_SA_options.mesh_obj_by_id["#MuzzleFlash0MESH"]._obj
flash.visible = false
flash.children.forEach(function(c,idx){c.visible=false})
    }
*/
  }
/*
 ,func: (function () {
var key_map = [-32];
var key_id = ["up","left","down","right"];
[87,65,83,68].forEach(function (keyCode, idx) {
  key_map.push({ order:1000+idx, keyCode:keyCode, id:key_id[idx], motion_id:"PC sleigh default", mov_speed:2700/1800*30 });
});
return function () {
  MMD_SA_options.Dungeon.key_map_swap(key_map);
};
  })()
*/
/*
 ,follow_PC: {
    "object17_0": {
  pos_base: {x:0, y:5.2839165*2.5, z:-(17.47313*2.5+2)}
 ,rot_base: {x:0, y:0, z:0}
    }
  }
*/
 ,set_event_flag: { branch_index:2 }
 ,ended: true

        }
      ]
//2
     ,[
        {
          message: {
  content: "1. Leave car.\n2. Stay."
 ,bubble_index: 2
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
  dismount: true
 ,ended: true
        }
      ]
    ]
  }

 ,event_listener: {
    "SA_Dungeon_object_animation": {
      func: function (e) {
  MMD_SA_options.mesh_obj_by_id["DomeMESH"]._obj.rotate.set(0, Math.PI * 2 * ((Date.now()/1000) % 120)/120, 0)
      }
    }
  }

    }

   ,"sewer_0": {

  RDG_options: {
    width:  25,
    height: 25,
    minRoomSize: 3,
    maxRoomSize: 6

,DG_room_count: 8
  }

 ,grid_size: 64
 ,view_radius: 8

 ,point_light: { color:"#E0E0E0" }

 ,object_list: [
    {object_index:5
 ,placement: {
    grid_id: 2
   ,position: { x:  0, y:63.9, z:0 }
   ,rotation: { x: 90, y:  0, z:0 }
   ,scale: 8*2
  }

 ,onclick: [
    {
      click_range: 128
     ,event_id: "exit0"
    }
  ]
    }

   ,{object_index:22
 ,placement: {
    grid_id: 8
   ,position: { x:0, y:0, z:0 }
   ,rotation: { x:0, y:null, z:0 }
  }
 ,onclick: [
    {
      click_range: 32
     ,event_id: "Toby"
    }
  ]
    }

  ]

 ,events: {
    "onstart": [
      [
        {
          message: {
  content: "......"
          }
        }
      ]
    ]

   ,"Toby": [
// 0
      [
        {
          message: {
  content: "有張字條, 係Toby留字..."
          }
        }
       ,{
          message: {
  content: "潛水中, 唔得閒做節目, 勿念."
 ,bubble_index: 3
          }
        }
       ,{
          message: {
  content: "我知大亨咩事, 營救行動預埋我, 我到時會上水, 就咁."
 ,bubble_index: 3
          }
        }
       ,{
          message: {
  content: "Toby真係呢... 不過是旦啦, 總萛揾齊人!"
          }
        }
      ]
    ]

   ,"exit0": [
//0
      [
        {
          message: {
  content: "1. Leave seweage.\n2. Stay."
 ,bubble_index: 2
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
  set_event_flag: { branch_index:0 }
 ,load_area: { id:"start" }
// ,set_starting_position: { area_id:null, position:"current" }
// ,ended: true
        }
      ]
    ]
  }

 ,para_by_grid_id: []

 ,event_listener: {
    "SA_Dungeon_after_object_placement": {
      func: function (e) {
var d = MMD_SA_options.Dungeon

for (var i = 2, i_max = d.grid_by_index.length; i < i_max; i++) {
  if (i == 1)
    continue

  d.para_by_grid_id[i] = { floor_material_index:5, ground_y:-5 }
}
      }
    }
  }
    }

   ,"home": {

  RDG_options: {
    width:  5,
    height: 5,
    grid_array: [
  [1,0,0,0,1]
 ,[0,0,0,0,0]
 ,[0,0,2,0,0]
 ,[0,0,0,0,0]
 ,[1,0,0,0,1]
    ]
  }

 ,grid_size: 64
 ,view_radius: 8

 ,point_light: { color:"#E0E0E0" }

 ,shadow_camera_width: 64

 ,skydome: { texture_index:1 }
 ,floor_material_index_default: -1
 ,wall_material_index_default: -1

 ,object_list: [
    {object_index:6}
   ,{object_index:7}
  ]

 ,events: {
    "onstart": [
      [
        {
          message: {
  content: "Home sweet home~!"
          }
        }
      ]
    ]
   ,"cabinet": [
      [
        {
  func: function () {
MMD_SA_options.model_para_obj_all[2]["_収納扉"] = !MMD_SA_options.model_para_obj_all[2]["_収納扉"]
return true
  }
        }
      ]
    ]
   ,"bed": [
      [
        {
  placement: {
    "PC": {
      position:{x:15*1.25, y:0, z:-31*1.25, grid:{x:2, y:2}}
     ,rotation:{x:0, y:90, z:0}
    }
  }
 ,motion: {
    "0": { name:"camera appeal 03" }
  }
 ,next_event: { delay:5 }
        }
       ,{
          message: {
  content: "Merry Christmas~! Seeya next time~!"
 ,bubble_index: 2
          }
        }
      ]
    ]
   ,"door": [
//0
      [
        {
          message: {
  content: "1. Leave apartment.\n2. Stay."
 ,bubble_index: 2
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
  func: function () {
//MMD_SA_options.Dungeon.key_map_swap([87,65,83,68])
  }
 ,set_event_flag: { branch_index:0 }
 ,load_area: { id:"start" }
// ,set_starting_position: { area_id:null, position:"current" }
// ,ended: true
        }
      ]
    ]
  }
    }
  }
};


MMD_SA_options.fog = { linear:true }
/*
MMD_SA_options.fog.color = "#FFFFFF"
MMD_SA_options.fog.near_ratio = 0.75
MMD_SA_options.ambient_light_color = ""
MMD_SA_options.light_color = ""
*/

// dungeon options END


// Town object TEST
if (1) {

MMD_SA_options.Dungeon_options.use_PC_click_reaction_default = true
MMD_SA_options.Dungeon_options.combat_mode_enabled = true
MMD_SA_options.Dungeon_options.sound = [
  {
    url: System.Gadget.path + "/TEMP/DEMO/music/stranger_things_remix.aac"
   ,channel: "BGM_ST"
   ,loop: true
  }
]

MMD_SA_options.Dungeon_options.grid_material_list = [
// ceil
    {
  map: System.Gadget.path + "/images/_dungeon/tex/3dtextures.me/Stone Wall 002/Stone_Wall_002_COLOR.jpg"
 ,normalMap: System.Gadget.path + "/images/_dungeon/tex/3dtextures.me/Stone Wall 002/Stone_Wall_002_NRM.jpg"
 ,geo_by_lvl: [[1,1]]
 ,distance_by_lvl: []
    }
// floor
   ,{
  map: System.Gadget.path + "/images/_dungeon/tex/3dtextures.me/Stone Floor 003/Pavement_006_COLOR.jpg"
 ,normalMap: System.Gadget.path + "/images/_dungeon/tex/3dtextures.me/Stone Floor 003/Pavement_006_NRM.jpg"
// ,specular:'#404040'//specularMap: Settings.f_path + "\\tex\\3dtextures.me\\Stone Floor 003\\Pavement_006_SPEC.png"//
// ,displacementMap: Settings.f_path + "\\tex\\3dtextures.me\\Stone Floor 003\\Pavement_006_DISP_256x256.png"
// ,uDisplacementBias: -0.5
 ,geo_by_lvl: [[1,1]]//[[1,1],[16,16],[32,32],[128,128]]//
 ,distance_by_lvl: []//[1,2,4]//
 ,repeat_base: [64,64]
    }
// wall
   ,{
  map: System.Gadget.path + "/images/_dungeon/tex/3dtextures.me/Stone Wall 004/Wall Stone 004_COLOR_c90.jpg"
 ,normalMap: System.Gadget.path + "/images/_dungeon/tex/3dtextures.me/Stone Wall 004/Wall Stone 004_NRM_c90.jpg"
// ,displacementMap: System.Gadget.path + "/images/_dungeon/tex/3dtextures.me/Stone Wall 004/Wall Stone 004_DISP_256x256.png"
// ,uDisplacementScale: 3
 ,geo_by_lvl: [[1,1]]//[[1,1],[16,16],[32,32],[128,128]]//
 ,distance_by_lvl: []//[1,3,5]//
 ,repeat_base: [64,64]
    }

// water
   ,{
  map: System.Gadget.path + "/images/watershader_water.jpg"
 ,specular:'#404040'
 ,geo_by_lvl: [[1,1],[16,16],[32,32],[64,64]]
 ,distance_by_lvl: [1,4,99]
,mirrorTextureIndex:0
,waveBaseSpeed:0.5
,opacity:0.75
//,renderDepth:999999
//,side:2
    }
];

MMD_SA_options.Dungeon_options.object_base_list = [
//0
    {
//  path: "F:\\MMD\\stages\\カモメ町１．０２\\カモメ町1.02_v00.x"
//  path: 'F:\\MMD\\stages\\空色町1.52\\sorairo1.52_v01.x'
  path: System.Gadget.path + "/TEMP/DEMO/models/asian_town_x500.zip#/asian_town_x500_v03.x"
//  path: 'F:\\MMD\\stages\\kelorin3_forMMD_beta2.0\\kr3_v02.x'
//  path: 'F:\\MMD\\stages\\古や村\\古や村_集落セットv1.62\\古や村_雪_v1.0.x'//29
//  path: 'F:\\MMD\\stages\\MMDオークランド0.7セット\\MMD_Auckland_0.7\\MMDオークランド_0.7_メインストリート中心部_v00.x'

//  path: 'F:\\MMD\\stages\\人里ver0.77\\人里_v01.x'
//  path: 'F:\\MMD\\stages\\ガレキ町1.4forMMD\\ガレキ町1.4forMMD\\ガレキ町１．4_v01.x'

 ,construction: {
    receiveShadow: true
//   ,castShadow: true

   ,boundingBox_list: [
// NOTE: z value inversed from model
      { min:{x:-5.558975-2, y:2.342474-2, z:-9.45095-2}, max:{x:-5.558975+2, y:2.342474+2, z:-9.45095+2} }
     ,{ min:{x:89.583-2, y:2.541468-2, z:43.38325-2}, max:{x:89.583+2, y:2.541468+2, z:43.38325+2} }

     ,{ min:{x:11.9412-2, y:1.436141-2, z:-4.0877-2}, max:{x:11.9412+2, y:1.436141+2, z:-4.0877+2}, no_camera_collision:true }
     ,{ min:{x:48.70001-2, y:1.436135-2, z:30.3565-2}, max:{x:48.70001+2, y:1.436135+2, z:30.3565+2}, no_camera_collision:true }
     ,{ min:{x:90.85775-2, y:1.436129-2, z:65.96875-2}, max:{x:90.85775+2, y:1.436129+2, z:65.96875+2}, no_camera_collision:true }
     ,{ min:{x:-51.59825-2, y:1.436135-2, z:31.02575-2}, max:{x:-51.59825+2, y:1.436135+2, z:31.02575+2}, no_camera_collision:true }

//15.61213 1.175536 -39.56425
//11.4664  1.175536 -39.56425
     ,{ min:{x:13.539265-5, y:1.175536-5, z:39.56425-5}, max:{x:13.539265+5, y:1.175536+5, z:39.56425+5}, no_camera_collision:true

 ,oncollide: function (para) {
if (MMD_SA_options.Dungeon._states.dialogue_mode)
  return
MMD_SA.SpeechBubble.message(0, "I can feel an evil aura around here...", 1000)
//return { returnValue:true }
  }

      }

     ,null
    ]

  }
 ,placement: {
    grid_id: 2
   ,position: {x:0, y:-4.5, z:0}
//   ,scale: 10
   ,can_overlap: true
  }
 ,collision_by_mesh: true
 ,collision_by_mesh_sort_range: 64
 ,collision_by_mesh_enforced: true
// ,collision_by_mesh_material_index_max: 29

// ,collision_by_mesh_face_grounded: function (face, y) { return (face.normal.y > ((face.materialIndex == 7) ? 0.5 : y)); }

 ,onclick: [
    {
      click_range: 64*100
     ,is_dblclick: true
     ,events: [
  {id:"noodle_cart01", click_range:96}
 ,{id:"noodle_cart01", click_range:96}

 ,{id:"misc_store01", click_range:64}
 ,{id:"misc_store02", click_range:64}
 ,{id:"misc_store03", click_range:64}
 ,{id:"misc_store04", click_range:64}

 ,{id:"police_station01", click_range:64}
      ]
    }
  ]

 ,view_distance: 999
    }

//1
   ,{
character_index: 1
 ,placement: {
    grid_id: 2
   ,position: {x:-780, y:182.5, z:538}
   ,rotation: {x:0, y:90, z:0}
   ,can_overlap: true
//   ,scale: 2.5
   ,hidden: true
  }
 ,no_collision: true

 ,onclick: [
    {
      click_range: 64
     ,is_dblclick: true
     ,event_id: "mrs_ma"
    }
  ]

// ,view_distance: 999
    }
//2
   ,{
  path: System.Gadget.path + "/images/_dungeon/x/SF-treasure_chest.zip#/chest_v01.x"
 ,construction: {
    receiveShadow: true
   ,castShadow: true
  }

 ,onclick: [
    {
      click_range: 64
     ,is_dblclick: true
     ,clone_event_by_index: true
     ,event_id: "treasure_chest01"
    }
  ]

// ,view_distance: 999
    }
//3
   ,{
  construction: {
    mesh_obj: { id:"Manhole0MESH" }//, receiveShadow:true }
   ,GOML_head: [
  '<txr id="Manhole0TXR"   src="' + toFileProtocol(System.Gadget.path + '/TEMP/DEMO/manhole_color.jpg') + '" param="repeat:1 1;" />'
//+ '<txr id="Manhole0TXR_N" src="' + toFileProtocol('F:\\MMD\\accessories\\SF-chicago-city-electric-cover\\textures\\city_elec_Normal.tga.png') + '" param="repeat:1 1;" />'
//+ '<txr id="Manhole0TXR_S" src="' + toFileProtocol('F:\\MMD\\accessories\\SF-chicago-city-electric-cover\\textures\\city_elec_Metallic.tga.png') + '" param="repeat:1 1;" />'
+ '<geo id="Manhole0GEO" type="Circle" param="' + [1,128].join(" ") + '" />'
+ '<mtl id="Manhole0MTL" type="MeshPhong" param="map:#Manhole0TXR;" />'// normalMap:#Manhole0TXR_N; specularMap:#Manhole0TXR_S; specular:#FFFFFF;" />'
    ].join("\n")+"\n"
   ,GOML_scene: [
  '<mesh id="Manhole0MESH" geo="#Manhole0GEO" mtl="#Manhole0MTL" style="scale:0;" />'
    ].join("\n")+"\n"
  }
 ,no_collision: true
    }
//4
   ,{
character_index: 2
 ,placement: {
    grid_id: 2
   ,position: {x:0, y:0, z:128}
   ,rotation: {x:0, y:180, z:0}
   ,can_overlap: true
//   ,scale: 2.5
//   ,hidden: true
  }
 ,mass: 1
 ,hp: 100
// ,no_collision: true
// ,view_distance: 999
    }
];
//MMD_SA_options.Dungeon_options.shadow_camera_width = 64*8;

MMD_SA_options.Dungeon_options.events_default["treasure_chest01"] = [
//0
      [
        {
          message: {
  content: "Hmmm... a treasure chest..."
          }
        }
       ,{
          message: {
  content: "1. Open it.\n2. Leave."
 ,bubble_index: 2
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
          message: {
  content: "(You found a fragment of Orochi's soul.)"
 ,bubble_index: 3
          }
        }
      ]
];

//MMD_SA_options.trackball_camera_limit = { max:{ length:64*3*2 } }

MMD_SA_options.Dungeon_options.options_by_area_id = {
    "start": {

  RDG_options: {
    width:  39*1,
    height: 29*1,
    grid_array: (function () {
//113*84
var _grid_array = []
for (var y = 0, y_max = 29*1+2; y <= y_max; y++) {
  _grid_array[y] = []
  for (var x = 0, x_max = 39*1+2; x <= x_max; x++)
    _grid_array[y][x] = (y==0 || y==y_max || x==0 || x==x_max) ? 1 : 0
}
_grid_array[~~(29*1/2)+1][~~(39*1/2)+1] = 2

return _grid_array
    })()
  }

 ,grid_size: 64
 ,view_radius: 8
 ,camera_limit_scale: 2

 ,sound: [
  {
    url: System.Gadget.path + "/TEMP/DEMO/music/city-city-morning-silent-03.aac"
   ,channel: "BGM"
   ,loop: true
   ,autoplay: true
  }
]

 ,point_light: { color:"#E0E0E0" }

// ,no_camera_collision: true
 ,camera_y_default_non_negative: false

 ,skydome: {}// texture_index:1 }

// ,skydome: { fog: { color:"" } }

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

 ,object_list: [
    {object_index:0}
   ,{object_index:1}
   ,{object_index:4}

   ,{object_index:2
 ,placement: {
    grid_id: 2
   ,position: {x:0, y:0, z:0}
   ,rotation: {x:0, y:0, z:0}
//   ,scale: 2.5
   ,can_overlap: true
   ,hidden: true
  }
    }

   ,{object_index:2
 ,placement: {
    grid_id: 2
   ,position: {x:-350, y:0, z:270}
   ,rotation: {x:0, y:0, z:0}
//   ,scale: 100
   ,can_overlap: true
   ,hidden: true
  }
    }

   ,{object_index:2
 ,placement: {
    grid_id: 2
   ,position: {x:470, y:102, z:-230}
   ,rotation: {x:0, y:0, z:0}
//   ,scale: 100
   ,can_overlap: true
   ,hidden: true
  }
    }

   ,{object_index:2
 ,placement: {
    grid_id: 2
   ,position: {x:-90, y:0, z:-100}
   ,rotation: {x:0, y:90, z:0}
//   ,scale: 2.5
   ,can_overlap: true
   ,hidden: true
  }
 ,user_data: { upsidedowned:true }
    }

   ,{object_index:2
 ,placement: {
    grid_id: 2
   ,position: {x:900, y:0, z:500}
   ,rotation: {x:0, y:90, z:0}
//   ,scale: 2.5
   ,can_overlap: true
   ,hidden: true
  }
 ,user_data: { upsidedowned:true }
    }

   ,{object_index:2
 ,placement: {
    grid_id: 2
   ,position: {x:760, y:183, z:-565}
   ,rotation: {x:0, y:0, z:-5}
//   ,scale: 2.5
   ,can_overlap: true
   ,hidden: true
  }
 ,user_data: { upsidedowned:true }
    }
  ]

 ,events: {
    "onstart": (function () {

    function _normal_plane() {
//MMD_SA.scene.fog.density=0;
MMD_SA.scene.fog.near=MMD_SA.scene.fog.far=(64*100*4*4*2);
jThree("#pointlight_main").three(0).intensity=0;
jThree("#MMD_AmbLight").three(0).color=new THREE.Color("#FFFFFF");
jThree("#MMD_DirLight").three(0).color=new THREE.Color("#606060");
if (MMD_SA_options.Dungeon.skydome) {
  MMD_SA_options.Dungeon.skydome.texture_index=1;
  MMD_SA_options.Dungeon.skydome.texture_setup();
}
var PPE = MMD_SA_options.MME.PostProcessingEffects
//PPE.use_BloomPostProcess = true
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
          func: _normal_plane
         ,message: {
  content: "(Press any key to continue the dialog.)"
 ,bubble_index: 3
 ,para: { scale:1.5 }
          }
        }
       ,{
          message: {
  content: "Who summoned me this time...? What is this place... Kyoto?"
          }
        }
       ,{
          message: {
  content: "(A voice far away): Hohoho~! Welcome to my floating world~!"
 ,para: { flipH:true, invertH_side:true, distance_scale:1.5 }
          }
        }
       ,{
          message: {
  content: "OK... what?"
          }
        }
       ,{
          message: {
  content: "(Keyboard control:\n* Move: WASD\n* Jump: SPACE\n* Dialog/event branch: 1-9)"
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
       ,{
          message: {
  content: "(Hints:\n1. Watch the two town towers at the corners.\n2. Look for those ramen carts and miscellaneous stores.\n3. Watch out for the police station.)"
 ,bubble_index: 3
 ,para: { scale:1.5 }
          }
        }
       ,{
          message: {
  content: "(Version 0.0.1 - First version)"
 ,bubble_index: 3
 ,para: { scale:1.5 }
          }
        }
       ,{
          message: {
  content: "(Are you ready?\nNow go and search for the master of this world~!)"
 ,bubble_index: 3
 ,para: { scale:1.5 }
          }
        }
       ,{
          set_event_flag: { branch_index:1 }
         ,ended: true
        }
      ]
//1
     ,[
        {
          func: function () {
_normal_plane()

var d = MMD_SA_options.Dungeon
d.object_base_list[2].object_list.forEach(function (obj) {
  obj._obj_proxy.hidden =   obj.user_data.upsidedowned
  obj._obj_proxy.visible = !obj.user_data.upsidedowned
});
          }

         ,ended: true
        }
      ]
    ];
    })()

   ,"police_station01": [
//0
      [
        {
          message: {
  content: "This door appears to be sealed by some kind of magic..."
          }
        }
      ]
//1
     ,[
        {
          message: {
  content: "1. Enter police station.\n2. Leave."
 ,bubble_index: 2
 ,branch_list: [
    { key:1, branch_index:2 }
   ,{ key:2 }
  ]
          }
        }
      ]
//2
     ,[
        {
  set_event_flag: { branch_index:1 }
 ,set_starting_position: { area_id:null, position:"current" }
 ,load_area: { id:"sewer_0" }
// ,ended: true
        }
      ]
    ]

   ,"mrs_ma": [
//0
      [
        {
          message: {
  content: '???: Welcome~! ^o^'
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
  content: "Who are you...? What is this place?"
          }
        }
       ,{
          message: {
  content: 'Hokusai: My name is Katsushika Hokusai, and this is my world created with my "floating world" magic.'
 ,NPC: 1
          }
        }
       ,{
          message: {
  content: "But why was I summoned here...?"
          }
        }
       ,{
          message: {
  content: 'Hokusai: Hmmm... I have no idea. Maybe your history is connected to this place in some ways? I am still learning the arts of floating world magic.'
 ,NPC: 1
          }
        }
       ,{
          message: {
  content: "I see. So... how can I leave this place?"
          }
        }
       ,{
          message: {
  content: "Hokusai: This place is still under construction, so there is no exit for now."
 ,NPC: 1
          }
        }
       ,{
          message: {
  content: "Are you kidding me...?"
          }
        }
       ,{
          message: {
  content: "Hokusai: Hohoho, don't worry~! I can build an exit quickly, but I still need some special materials. Can you find them for me? I can't leave this spot for the time being."
 ,NPC: 1
          }
        }
       ,{
          message: {
  content: "Hokusai: There are 7 treasure chests in this place containing fragments of Orochi's soul. Search carefully and collect them all."
 ,NPC: 1
          }
        }
       ,{
          message: {
  content: "Some of them can only be found on either the normal or this inverted plane. Use the jukebox to travel across two planes."
 ,NPC: 1
          }
        }
       ,{
          message: {
  content: "Hokusai: Good luck on finding the fragments. I will be here waiting for you~!"
 ,NPC: 1
          }
        }
       ,{
          func: function () {
var d = MMD_SA_options.Dungeon
d.object_base_list[2].object_list.forEach(function (obj) {
  obj._obj_proxy.hidden = !obj.user_data.upsidedowned
  obj._obj_proxy.visible = obj.user_data.upsidedowned
});
          }

         ,set_event_flag: { id:"police_station01", branch_index:1 }
         ,next_event: {}
        }
       ,{
          set_event_flag: { branch_index:1 }

         ,ended: true
         ,motion: { "0":{}, "1":{} }
        }
      ]
//1
     ,[
        {
//func: function () { console.log(MMD_SA_options.Dungeon_options.options_by_area_id["start"]._saved); console.log(MMD_SA_options.Dungeon_options.options_by_area_id["sewer_0"]._saved); },
          statement: {
  _if: { _and:
    [
  {condition:["treasure_chest01_0","==",1]}
 ,{condition:["treasure_chest01_1","==",1]}
 ,{condition:["treasure_chest01_2","==",1]}
 ,{condition:["treasure_chest01_3","==",1]}
 ,{condition:["treasure_chest01_4","==",1]}
 ,{condition:["treasure_chest01_5","==",1]}
 ,{condition:[["sewer_0","treasure_chest01_0"],"==",1]}
    ]
  }
 ,_then: { goto_branch:2 }
 ,_else: {
    message:{
  content: "Hokusai: You haven't found all the fragments yet~!"
 ,NPC: 1
    }
   ,turn_to_character: 1
   ,look_at_character: 1
   ,NPC_turns_to_you: 1
  }
          }
        }
      ]
//2
     ,[
        {
          message: {
  content: 'Hokusai: Hohoho~! It seems you have found all the fragments~! ^0^'
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
  content: "So, can I leave now?"
          }
        }
       ,{
          message: {
  content: "Hokusai: OK, OK... oh wait... it seems I still need something, but it is not available right now~!"
 ,NPC: 1
          }
        }
       ,{
          message: {
  content: "Can you feel my anger...?"
          }
        }
       ,{
          message: {
  content: "Hokusai: Hey, calm down~! Don't worry. I will figure out a way. It's just a matter of time~!"
 ,NPC: 1
          }
        }
       ,{
          message: {
  content: "......"
          }
        }
       ,{
          message: {
  content: "Hokusai: In the mean time, feel free to walk around and take a look at my masterpiece~! ^0^"
 ,NPC: 1
          }
        }
       ,{
          message: {
  content: "......"
          }
        }
       ,{
          ended: true
         ,motion: { "0":{}, "1":{} }
        }
      ]
    ]

   ,"noodle_cart01": [
//0
      [
        {
          message: {
  content: 'I want a bowl of hot ramen right now...'
          }
        }
      ]
    ]

   ,"misc_store01": [
//0
      [
        {
          message: {
  content: "A miscellaneous store ?"
          }
        }
       ,{
          message: {
  content: "1. Look around.\n2. Leave."
 ,bubble_index: 2
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
          message: {
  content: "(You found your old panties being sold for $5~!)"
 ,bubble_index: 3
          }
         ,motion: {
"0": [{ name:"PC fall on ass" }, { name:"PC stand up from ass" }]
          }
        }
       ,{
          message: {
  content: "What the...!?"
 ,bubble_index: 1
          }
        }
      ]
    ]

   ,"misc_store02": [
//0
      [
        {
          message: {
  content: "A miscellaneous store ?"
          }
        }
       ,{
          message: {
  content: "1. Look around.\n2. Leave."
 ,bubble_index: 2
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
          message: {
  content: "(You found a candid photo of yourself wearing a bikini~!)"
 ,bubble_index: 3
          }
         ,motion: {
"0": [{ name:"PC fall on ass" }, { name:"PC stand up from ass" }]
          }
        }
       ,{
          message: {
  content: "Who took this photo..."
          }
        }
      ]
    ]

   ,"misc_store03": [
//0
      [
        {
          message: {
  content: "A miscellaneous store ?"
          }
        }
       ,{
          message: {
  content: "1. Look around.\n2. Leave."
 ,bubble_index: 2
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
          message: {
  content: "(You found a photo album of Jeanne d'Arc~!)"
 ,bubble_index: 3
          }
        }
       ,{
          message: {
  content: "Hmmm... not bad..."
// ,bubble_index: 1
          }
        }
      ]
    ]

   ,"misc_store04": [
//0
      [
        {
          message: {
  content: "A miscellaneous store ?"
          }
        }
       ,{
          message: {
  content: "1. Look around.\n2. Leave."
 ,bubble_index: 2
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
          message: {
  content: "(You found a photo album of Astolfo~!)"
 ,bubble_index: 3
          }
        }
       ,{
          message: {
  content: "Wowww~! That's pretty awesome~!"
 ,bubble_index: 1
          }
        }
      ]
    ]
  }

 ,event_listener: {
    "SA_Dungeon_object_animation": {
      func: function (e) {
if (MMD_SA_options.mesh_obj_by_id["DomeMESH"] && (MMD_SA_options.Dungeon.skydome.texture_index == 0))
  MMD_SA_options.mesh_obj_by_id["DomeMESH"]._obj.rotate.set(0, Math.PI * 2 * ((Date.now()/1000) % 120)/120, 0)
      }
    }
  }
    }

   ,"sewer_0": {

  RDG_options: {
    width:  30,
    height: 30,
    minRoomSize: 3,
    maxRoomSize: 6

,DG_room_count: 16
  }

 ,grid_size: 64
 ,view_radius: 8

 ,fog: {}

 ,floor_material_index_default: 1
 ,wall_material_index_default: 2
 ,ceil_material_index_default: 0

 ,point_light: { color:"#E0E0E0" }

 ,object_list: [
    {object_index:3
 ,placement: {
    grid_id: 2
   ,position: { x:  0, y:63.9, z:0 }
   ,rotation: { x: 90, y:  0, z:0 }
   ,scale: 8*2
  }

 ,onclick: [
    {
      click_range: 128
     ,is_dblclick: true
     ,event_id: "exit0"
    }
  ]
    }

   ,{object_index:2
 ,placement: {
    grid_id: 16
   ,position: { x:0, y:0, z:0 }
   ,rotation: { x:0, y:null, z:0 }
  }
 ,view_distance: 1
    }

  ]

 ,events: {
    "onstart": [
      [
        {
          message: {
  content: "A secret sewerage under the police station...?"
          }
        }
      ]
    ]

   ,"exit0": [
//0
      [
        {
          message: {
  content: "1. Return to the ground.\n2. Stay."
 ,bubble_index: 2
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
  set_event_flag: { branch_index:0 }
 ,load_area: { id:"start" }
// ,set_starting_position: { area_id:null, position:"current" }
// ,ended: true
        }
      ]
    ]
  }

 ,para_by_grid_id: []

 ,event_listener: {
    "SA_Dungeon_after_object_placement": {
      func: function (e) {
var d = MMD_SA_options.Dungeon

for (var i = 2, i_max = d.grid_by_index.length; i < i_max; i++) {
  if (i == 1)
    continue

  d.para_by_grid_id[i] = { floor_material_index:3, ground_y:-5 }
}
      }
    }
  }
    }


};
MMD_SA_options.Dungeon_options.motion = {};
MMD_SA_options.model_path_extra = [
  System.Gadget.path + '\\TEMP\\DEMO\\models\\Yat_FGO_Hokusai_v101.min.zip#\\00_お栄_v01.pmx'
// ,'F:\\MMD\\models - mob\\セーラー服さんv1.3\\セーラー服さんv1.3長袖_v01.pmx'
// ,'F:\\MMD\\models\\gandalf\\ガンダルフ小袋物理なし版.pmx'
//  System.Gadget.path + '\\TEMP\\DEMO\\models\\Appearance Teto IS 1.0.5.min.zip#\\Appearance Teto_IS_1.0.5_v03.pmx'
//  System.Gadget.path + "/TEMP/DEMO/models/mrs_ma.min.zip#/_0Ma_v06h_for_SA_v04.pmx"
//  'F:\\MMD\\accessories\\Ferrari_LaFerrari_v2_4\\laferrari_v00.pmx'
// ,'F:\\MMD\\models - custom\\るんば式キース・グッドマンv2.13\\Tシャツモデル\\_03a.pmx'
];
MMD_SA_options.camera_param = "far:" + (64*100*4*4*2) + ";"
MMD_SA_options.ground_physics_disabled = true
//window.addEventListener("load", function (e) { MMD_SA_options.model_para_obj.material_para = null; });

//MMD_SA_options.fog = { density:0 }
MMD_SA_options.fog = { linear:true }

window.addEventListener("MMDStarted", function (e) { console.log(MMD_SA_options.Dungeon_options.PC_follower_list); })

//return

}
// Town object END


  MMD_SA_options.mirror_obj = [{
    style: 'rotateX:' + (-Math.PI/2) + '; position:0 0 0;'//position:0 0.05 0.1;'//

//0:normal reflection, 1:custom camera, 2:skip rendering
//,reflection_state: 1

,reflection_alpha: 0.6
,fade_radius: 15*2
//,fade_min: 0
//,fade_max: 0.9// +0.1

,renderDepth: 0

,plane: [1,1]

,hidden: true
//   ,skip_reflection_list: ["#mikuPmx2"]
  }];

  if (!MMD_SA_options.Dungeon_options.PC_follower_list)
    MMD_SA_options.Dungeon_options.PC_follower_list = []
  MMD_SA_options.Dungeon_options.PC_follower_list.push({id:"#Mirror0MESH", grounded:true})

//setTimeout(function(){DEBUG_show(999,0,1)},1000);

//RAF_animation_frame_unlimited = true

})();


// random dungeon test
//  document.write('<script language="JavaScript" src="node_modules/index.umd.js"></scr'+'ipt>');
if (xul_mode)
  document.write('<script language="JavaScript" src="js/require1k.js"></scr'+'ipt>');
document.write('<script language="JavaScript" src="js/dungeon.js"></scr'+'ipt>');


// main js
document.write('<script language="JavaScript" src="MMD.js/MMD_SA.js"></scr'+'ipt>');
