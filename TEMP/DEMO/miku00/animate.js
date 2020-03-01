var MMD_SA_options = {

  model_path: System.Gadget.path + "/TEMP/DEMO/models/Appearance Miku.zip#/Appearance Miku_BDEF_mod-v04.pmx"

 ,motion: [

//  { path:System.Gadget.path + '/MMD.js/motion/stand.vmd'}
//  { path:System.Gadget.path + '/MMD.js/motion/swing.vmd'}
  { path:System.Gadget.path + '/MMD.js/motion/motion_basic_pack01.zip#/standmix2_modified.vmd'}
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


// must-load list
// ,{ must_load:true, no_shuffle:true, path:'C:\\Users\\User\\Downloads\\MikuMikuDanceE_v739\\MikuMikuDanceE_v739\\UserFile\\Motion\\Muuubu Rin -Append-\\motion_BAL3.vmd'}
  ,{ must_load:true, no_shuffle:true, path:System.Gadget.path + '/TEMP/DEMO/motion/motion_misc.zip#/壁穴モーション/壁穴_モデルモーション_loop.vmd'}
  ]


 ,motion_shuffle_pool_size: 9
 ,motion_shuffle: [1,3,3+15, 0+15,1+15,2+15, 7+15,9,4]

//,motion_shuffle_pool_size: 9 +5
//,motion_shuffle: [0+15,1+15,2+15, 7+15,9,6, 3+15,4+15,6+15, 4,12+15,9+15,1,3]

// ,motion_shuffle_pool_size: 9
// ,motion_shuffle: [1,3,3+15, 0+15,1+15,4+15, 6,9,4]

 ,motion_shuffle_list_default: [0]

// ,motion_shuffle_list: [4,4,4,4,4,4,4,4]

 ,motion_shuffle_by_song_name: {
  }

//,random_range_disabled:true


 ,motion_para: {
    "stand" : { onended: function () { MMD_SA._no_fading=true; } }
   ,"standmix" : { onended: function () { MMD_SA._no_fading=true; } }
   ,"standmix2_modified" : { onended: function () { MMD_SA._no_fading=true; } }
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

//   ,"私の時間_short_Lat式ミク - with skirt physics" : { BPM:{rewind:true, BPM: 145, beat_frame: 603} }

//   ,"Viva Happy Motion (Imai)" : { BPM:{rewind:true, BPM: 147.98, beat_frame: 657} }
//   ,"tik tok" : { center_view:[0,0,0], loopback_fading:true, BPM:{rewind:true, BPM: 120*1.03, beat_frame: 142} }
//   ,"nekomimi_lat" : { center_view:[0,0,0], loopback_fading:true, range:[{time:[30,30+(30*(60+59)+27)]}], BPM:{rewind:true, BPM: 160, beat_frame: 1124} }
//   ,"you make me happy rea - MODIFIED" : { center_view:[0,0,0], loopback_fading:true, range:[{time:[0,0]}], BPM:{rewind:true, BPM: 124.06, beat_frame: 338} }

   ,"壁穴_モデルモーション_loop" : {
  random_range_disabled:true
 ,_cover_undies: false

 ,get look_at_screen_ratio() {
var f = THREE.MMD.getModels()[0].skin.time*30
var ratio = 1
if (f<=100)
  ratio = 0
else if ((f>100) && (f<130))
  ratio = (f-100)/30
else if ((f>184) && (f<=285))
  ratio = Math.max(1-(f-184)/16, 0)
else if ((f>285) && (f<330))
  ratio = (f-285)/45
else if ((f>625) && (f<=930))
  ratio = Math.max(1-(f-625)/55, 0)
else if ((f>930) && (f<960))
  ratio = (f-930)/30
else if ((f>1020) && (f<=1085))
  ratio = Math.max(1-(f-1020)/10, 0)
else if ((f>1085) && (f<1105))
  ratio = (f-1085)/20
else if ((f>1380) && (f<=1430))
  ratio = Math.max(1-(f-1380)/10, 0)
else if ((f>1430) && (f<1450))
  ratio = (f-1430)/20
else if (f>2015)
  ratio = Math.max(1-(f-2015)/5, 0)

return ratio
  }

 ,onended: function (loop_end) {
MMD_SA._no_fading=true;

if (!loop_end) {
  MMD_SA.WebXR._wall.visible = false
}
  }

 ,onstart: function (changed) {
if (!changed) return

var model = THREE.MMD.getModels()[0].mesh
MMD_SA.WebXR._wall.position.copy(model.position)
MMD_SA.WebXR._wall.quaternion.copy(model.quaternion)
MMD_SA.WebXR._wall.visible = true
  }
 ,adjustment_per_model: {
    _default_ : {
  skin_default: {
  "全ての親": { pos_add:{ x:0, y:0, z:1 } }
  }
    }
  }
    }
  }

 ,custom_action: [
  "cover_undies"
  ]

// ,use_CircularSpectrum: true

 ,look_at_screen: true

// ,center_view: [0,0,20]//[0,5,0]
// ,camera_position: [10,20,20]

// ,light_position: [50,50,50]

 ,edgeScale: 0.75

 ,model_para: {
    "プーさん6準標準.pmx": {
  morph_default: {}
 ,skin_default: {
    "全ての親":  { pos_add:{x:0, y:15, z:0} }
  }
 ,material_para: {
  "gras and veg": { alphaTest:0.5 }
 ,"swing": { alphaTest:0.5 }
  }
 ,_cover_undies: false
    }
  }

/*
 ,MME: {
    self_overlay: {
  enabled: true
// ,opacity: 0.5
// ,brightness: 1
    }
   ,HDR: {
  enabled: true
// ,opacity: 0.5
    }
   ,serious_shader: {
  enabled: 1
// ,shadow_opacity: 0.5
 ,material: {
    "顔": { shadow_opacity: 0.25 }
  }
 ,OverBright: 1.1
    }

// 123

  }
*/

 ,use_speech_bubble: true
 ,onstart: function () {
setTimeout(function () {MMD_SA.SpeechBubble.message(0, "Welcome to the world of System Animator~! ^o^", 4*1000)}, (2)*1000)
setTimeout(function () {MMD_SA.SpeechBubble.message(0, "Drag with the left mouse button to move camera~!", 4*1000)}, (2+5)*1000)
setTimeout(function () {MMD_SA.SpeechBubble.message(0, ((WallpaperEngine_mode) ? "Give" : "Drop") + " me a MP3 and I\'ll dance for you~! ^o^", 4*1000)}, (2+10)*1000)
  }

 ,WebXR: {
    AR: {
      onwallhit: function (e) {
var model_mesh = THREE.MMD.getModels()[0].mesh
if (!model_mesh.visible) {
  DEBUG_show("(Place the model on the ground first.)", 3)
  return true
}

var adult_mode = this._adult_mode
e.detail.result.update_obj = function (model_mesh) {
  var xr = MMD_SA.WebXR
  var axis = xr.hitMatrix_decomposed[3]

  model_mesh.quaternion.setFromEuler(MMD_SA.TEMP_v3.set(0,Math.atan2(axis.x,axis.z),0))
  MMD_SA_options.mesh_obj_by_id["CircularSpectrumMESH"] && MMD_SA_options.mesh_obj_by_id["CircularSpectrumMESH"]._obj.rotation.setEulerFromQuaternion(model_mesh.quaternion)

  var pos0
  if (adult_mode) {
    pos0 = new THREE.Vector3().copy(xr.hitMatrix_decomposed[0]).setY(xr.hit_ground_y).multiplyScalar(10);
    model_mesh.position.y = -11.5 + (xr.hitMatrix_decomposed[0].y - xr.hit_ground_y)*10

    MMD_SA_options.motion_shuffle_list_default = [MMD_SA_options.motion_index_by_name["壁穴_モデルモーション_loop"]]
    MMD_SA._force_motion_shuffle = true
  }
  else {
    pos0 = axis.clone().multiplyScalar(1/3).add(xr.hitMatrix_decomposed[0]).setY(xr.hit_ground_y).multiplyScalar(10);
  }
  xr.center_pos = model_mesh.position.clone().setY(0).sub(pos0)
};
      }

     ,ongroundhit: function (e) {
//DEBUG_show(9,0,1);return;
var model_mesh = THREE.MMD.getModels()[0].mesh
model_mesh.position.y = 0

if (MMD_SA_options.motion_shuffle_list_default && (MMD_SA_options.motion_shuffle_list_default[0] != MMD_SA_options._motion_shuffle_list_default[0])) {
  MMD_SA_options.motion_shuffle_list_default = MMD_SA_options._motion_shuffle_list_default.slice()
  MMD_SA._force_motion_shuffle = true
}
      }
    }
  }

 ,light_position: [0,1,0]

 ,use_shadowMap: true
 ,shadow_darkness: 0.1
 ,ground_shadow_only: true

// END
};

(function () {
  if (browser_native_mode && !webkit_window) {
    MMD_SA_options.width  = screen.width
    MMD_SA_options.height = screen.height
  }
  else {
    MMD_SA_options.width  = 800
    MMD_SA_options.height = 600
  }

//  RAF_animation_frame_unlimited = true

  Settings_default._custom_.EventToMonitor = "SOUND_ALL"
  Settings_default._custom_.Use30FPS = "non_default"
//  Settings_default._custom_.Use60FPS = "non_default"
  if (use_SA_browser_mode && !is_SA_child_animation)
    Settings_default._custom_.WallpaperAsBG = "non_default"
  Settings_default._custom_.Display = "-1"

  if (is_SA_child_animation)
    parent.DragDrop.relay_id = SA_child_animation_id

  self.SA_wallpaper_src = "TEMP/DEMO/wood_wallpaper_flip-h.jpg"

  MMD_SA_options.WebXR.AR._adult_mode = !!System._browser.url_search_params.adult_mode


// dungeon options START
MMD_SA_options.Dungeon_options = {

  use_PC_click_reaction_default: true

 ,use_point_light: false

// ,grid_material_list: []

// ,object_base_list: []

 ,options_by_area_id: {
    "start": {

  RDG_options: {
    width:  1
   ,height: 1
   ,grid_array: [
  [2]
    ]
  }

 ,grid_size: 64*3

 ,floor_material_index_default: -1
 ,wall_material_index_default: -1
 ,ceil_material_index_default: -1

 ,ambient_light_color: "#FFF"
 ,light_color: '#606060'

// ,no_camera_collision: true
// ,camera_y_default_non_negative: false

// ,object_list: []

 ,events: {
    "onstart": [
      [
        {
          func: function () {
MMD_SA_options.Dungeon_options.character_movement_disabled = true
return true
          }
        }
      ]
    ]
  }

    }
  }

};

//MMD_SA_options.Dungeon_options = null;
// END


  window.addEventListener("MMDStarted", function () {
let geometry = new THREE.PlaneGeometry(1000,1000)
/*
let tex = document.createElement("canvas")
tex.width = tex.height = 1
//let tex_context = tex.getContext("2d")
//tex_context.fillStyle = "rgba(0,0,0,0)"
//tex_context.fillRect(0,0,1,1)
tex = new THREE.Texture(tex)
tex.needsUpdate = true
*/
let material = new THREE.MeshBasicMaterial({ color: 0x000000, transparent:false });
geometry.applyMatrix(new THREE.Matrix4().makeRotationX(THREE.Math.degToRad(-90)));
let ground = MMD_SA.WebXR.ground_plane = new THREE.Mesh(geometry, material);
ground.receiveShadow = true;
ground.receiveShadowAlpha = true;
MMD_SA.scene.add(ground)

let wall_geo = new THREE.CubeGeometry(30,30,30);
wall_geo.applyMatrix(new THREE.Matrix4().makeTranslation(0,10,-15));
let wall = MMD_SA.WebXR._wall = new THREE.Mesh(wall_geo, material);
wall.useQuaternion = true
wall.receiveShadow = true;
wall.receiveShadowAlpha = true;
MMD_SA.scene.add(wall)

// can be updated only AFTER scene.add
wall.visible = false
material.opacity = 0.5

//console.log(ground,material)
  });

})();


// main js
if (MMD_SA_options.Dungeon_options)
  document.write('<script language="JavaScript" src="js/dungeon.js"></scr'+'ipt>');
document.write('<script language="JavaScript" src="MMD.js/MMD_SA.js"></scr'+'ipt>');

