// XR Animator
// (2023-02-18)

var MMD_SA_options = {

  model_path: System.Gadget.path + "/jThree/model/alicia.min.zip#/Alicia_solid_v02.pmx"  //Appearance Miku.zip#/Appearance Miku_BDEF_mod-v04.pmx"//

 ,motion: [

//  { path:System.Gadget.path + '/MMD.js/motion/stand.vmd'}
//  { path:System.Gadget.path + '/MMD.js/motion/swing.vmd'}
  { must_load:true, no_shuffle:true, path:System.Gadget.path + '/MMD.js/motion/motion_basic_pack01.zip#/standmix2_modified.vmd'}
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

// must-load list
//  ,{ must_load:true, no_shuffle:true, path:'C:\\Users\\User\\Downloads\\MikuMikuDanceE_v739\\MikuMikuDanceE_v739\\UserFile\\Motion\\Muuubu Rin -Append-\\motion_BAL3.vmd'}
   ,{ must_load:true, no_shuffle:true, path:Settings.f_path + '/assets/assets.zip#/motion/model/gal_model_motion_with_legs-2_loop_v01.vmd' }
   ,{ must_load:true, no_shuffle:true, path:Settings.f_path + '/assets/motion_misc.zip#/壁穴モーション/壁穴_モデルモーション_loop.vmd'}

   ,{ must_load:true, no_shuffle:true, path:Settings.f_path + '/assets/assets.zip#/motion/emote/emote-mod_お辞儀1.vmd' }
   ,{ must_load:true, no_shuffle:true, path:Settings.f_path + '/assets/assets.zip#/motion/emote/emote-mod_お辞儀2.vmd' }
   ,{ must_load:true, no_shuffle:true, path:Settings.f_path + '/assets/assets.zip#/motion/emote/emote-mod_肯定する1.vmd' }
   ,{ must_load:true, no_shuffle:true, path:Settings.f_path + '/assets/assets.zip#/motion/emote/emote-mod_肯定する2.vmd' }

   ,{ must_load:true, no_shuffle:true, path:Settings.f_path + '/assets/assets.zip#/motion/emote/emote-mod_照れる1.vmd' }
   ,{ must_load:true, no_shuffle:true, path:Settings.f_path + '/assets/assets.zip#/motion/emote/emote-mod_照れる2.vmd' }

   ,{ must_load:true, no_shuffle:true, path:Settings.f_path + '/assets/assets.zip#/motion/surrender_v03.vmd' }
   ,{ must_load:true, no_shuffle:true, path:Settings.f_path + '/assets/assets.zip#/motion/surrender-R_v03.vmd' }

   ,{ must_load:true, no_shuffle:true, path:Settings.f_path + '/assets/assets.zip#/motion/emote/emote-mod_歓迎する1.vmd' }
   ,{ must_load:true, no_shuffle:true, path:Settings.f_path + '/assets/assets.zip#/motion/emote/emote-mod_歓迎する2.vmd' }

   ,{ must_load:true, no_shuffle:true, path:Settings.f_path + '/assets/assets.zip#/motion/emote/emote-mod_がっかり1.vmd' }
   ,{ must_load:true, no_shuffle:true, path:Settings.f_path + '/assets/assets.zip#/motion/emote/emote-mod_がっかり2.vmd' }
   ,{ must_load:true, no_shuffle:true, path:Settings.f_path + '/assets/assets.zip#/motion/emote/emote-mod_肩をすくめる1.vmd' }
   ,{ must_load:true, no_shuffle:true, path:Settings.f_path + '/assets/assets.zip#/motion/emote/emote-mod_肩をすくめる2.vmd' }

   ,{ must_load:true, no_shuffle:true, path:Settings.f_path + '/assets/assets.zip#/motion/emote/emote-mod_すねる1.vmd' }
   ,{ must_load:true, no_shuffle:true, path:Settings.f_path + '/assets/assets.zip#/motion/emote/emote-mod_すねる2.vmd' }
   ,{ must_load:true, no_shuffle:true, path:Settings.f_path + '/assets/assets.zip#/motion/emote/emote-mod_よろめく1.vmd' }
   ,{ must_load:true, no_shuffle:true, path:Settings.f_path + '/assets/assets.zip#/motion/emote/emote-mod_よろめく2.vmd' }

   ,{ must_load:true, no_shuffle:true, path:Settings.f_path + '/assets/assets.zip#/motion/emote/emote-mod_おどろく1.vmd' }

   ,{ must_load:true, no_shuffle:true, path:Settings.f_path + '/assets/assets.zip#/motion/chair_sit01_armIK.vmd' }
   ,{ must_load:true, no_shuffle:true, path:Settings.f_path + '/assets/assets.zip#/motion/i-shaped_balance/i-shaped_balance_TDA_f0-50.vmd' }
   ,{ must_load:true, no_shuffle:true, path:Settings.f_path + '/assets/assets.zip#/motion/leg_hold.vmd' }
   ,{ must_load:true, no_shuffle:true, path:Settings.f_path + '/assets/assets.zip#/stand_simple.vmd' }

   ,{ must_load:true, no_shuffle:true, path:Settings.f_path + '/assets/assets.zip#/baseball_throw/baseball_throw.vmd' }

   ,{ must_load:true, no_shuffle:true, path:Settings.f_path + '/assets/assets.zip#/motion/walk_n_run/walk_A34_f0-42.vmd' }

// roomba
//   ,{ must_load:true, no_shuffle:true, path:'F:\\Programs Portable\\node-webkit\\_TEMP\\gura_x_roomba\\data\\gura_sit_01.vmd' }
  ]


 ,motion_shuffle_pool_size: 9
 ,motion_shuffle: [1,3,3+15, 0+15,1+15,2+15, 7+15,9,4]

//,motion_shuffle_pool_size: 9 +5
//,motion_shuffle: [0+15,1+15,2+15, 7+15,9,6, 3+15,4+15,6+15, 4,12+15,9+15,1,3]

// ,motion_shuffle_pool_size: 9
// ,motion_shuffle: [1,3,3+15, 0+15,1+15,4+15, 6,9,4]

 ,motion_shuffle_list_default: [30]//[0]

// ,motion_shuffle_list: [4,4,4,4,4,4,4,4]

 ,motion_shuffle_by_song_name: {
  }

//,random_range_disabled:true


 ,motion_para: {
    "stand" : { onended: function () { MMD_SA._no_fading=true; } }
   ,"standmix" : { onended: function () { MMD_SA._no_fading=true; } }
   ,"standmix2_modified" : { onended: function () { MMD_SA._no_fading=true; }

,allows_kissing: true
,look_at_screen_bone_list: [
  { name:"首", weight_screen:0.5, weight_screen_y:0.25, weight_motion:1 }
 ,{ name:"頭", weight_screen:0.5, weight_screen_y:0.25, weight_motion:1 }
 ,{ name:"上半身",  weight_screen:0.5, weight_screen_x:0,weight_screen_y:0.75, weight_motion:1 }
 ,{ name:"上半身2", weight_screen:0.5, weight_screen_x:0,weight_screen_y:0.75, weight_motion:1 }
]

,adjustment_per_model: {
    _default_ : {
  skin_default: {
    "左足ＩＫ": { keys: [{time:0, pos:{x: 0.2, y:0, z:0}, rot:{x:0, y: 10, z:0}}] }
   ,"右足ＩＫ": { keys: [{time:0, pos:{x:-0.2, y:0, z:0}, rot:{x:0, y:-10, z:0}}] }
  }
    }
}

    }
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

 ,look_at_screen_bone_list: [
{ name:"両目", weight_screen:0.3, weight_motion:1 }
//    { name:"首", weight_screen:0.5, weight_motion:1/3 }
//   ,{ name:"頭", weight_screen:0.5, weight_motion:1/3 }
  ]

 ,onended: function (loop_end) {
MMD_SA._no_fading=true;

if (!loop_end) {
  MMD_SA.WebXR._wall.visible = false
}
  }
/*
 ,onstart: function (changed) {
if (!changed) return

var model = THREE.MMD.getModels()[0].mesh
MMD_SA.WebXR._wall.position.copy(model.position)
MMD_SA.WebXR._wall.quaternion.copy(model.quaternion)
MMD_SA.WebXR._wall.visible = true
  }
*/

// update every frame
 ,process_bones: function (model) {
if (!MMD_SA_options.WebXR.AR._adult_mode) return

var xr = MMD_SA.WebXR
var zoom_scale = xr.zoom_scale

var model_mesh = model.mesh
model_mesh.position.y = -11.5 + (xr.hitMatrix_anchor._hit_wall_y_ - xr.hit_ground_y)*10*zoom_scale;

xr._wall.position.copy(model_mesh.position)
xr._wall.quaternion.copy(model_mesh.quaternion)
xr._wall.scale.set(zoom_scale,zoom_scale,zoom_scale)
xr._wall.visible = true
  }

 ,_cover_undies: false
 ,object_click_disabled: true

 ,adjustment_per_model: {
    _default_ : {
  skin_default: {
  "全ての親": { pos_add:{ x:0, y:0, z:1 } }
  }
    }
  }
    }

   ,"gal_model_motion_with_legs-2_loop_v01" : {
  look_at_screen_angle_x_limit: [Math.PI*0.25, -Math.PI*0.5]

 ,motion_tracking_enabled: true, motion_tracking_upper_body_only: true

// ,loop:[1,1]
 ,onended: function (last_frame) { MMD_SA._no_fading=last_frame&&(!this.loop||this.loop_count); }

 ,_cover_undies: false
 ,object_click_disabled: true

// ,gravity: [0,-0.1,0]
// ,gravity_reset: [0,0.5,0]
 ,gravity: [0,0,0]
 ,gravity_reset: [0,-0.5,0]

 ,adjustment_per_model: {
    _default_ : {
  skin_default: {
    "全ての親": { keys:
  [
    {time:0, pos:{x:0, y:4, z:-10}}
   ,{time:390*0.5/30, pos:{x:0, y:6, z:-10}}
   ,{time:390/30, pos:{x:0, y:4, z:-10}}
  ]
    }
//  "全ての親": { pos_add:{ x:-6.56+4, y:0+0.25, z:-6.47-3 }, rot_add:{ x:0, y:-54.4+20, z:0 } } 
  }
 ,morph_default:{
  "あ":{weight_scale:2/3}
 ,"High Heels OFF": { weight:1 }
// ,"素足":{weight:1}
  }
    }
  }

// ,center_view: [5-1,-5-2-1.05,-10] ,center_view_lookAt: [0-1,0-2+0.75,0] ,SpeechBubble_pos_mod: [-11+8,2,7]

// ,center_view: [5-1,-5-2,-10] ,center_view_lookAt: [0-1,0-2,0],SpeechBubble_pos_mod: [-1,2,8]
// ,center_view: [0,0-2.5,-30] ,center_view_lookAt: [20,5,20] ,SpeechBubble_pos_mod: [-8,6,10-2]
//[0,10,30], [0,10,0]
//,center_view: [0,0,-20-2.5] ,center_view_lookAt: [20,0,10+2.5] ,SpeechBubble_pos_mod: [-17,0,-10]


// ,SpeechBubble_flipH: true
// ,SpeechBubble_pos_mod: [0-8,4,-2+12]
//,SpeechBubble_pos_mod: [0,3,8]

 ,get look_at_screen_ratio() {
var f = THREE.MMD.getModels()[0].skin.time*30
var ratio = 1
if (f >= 157) {
  if (f <= 180)
    ratio = (180-f)/23
  else if (f <= 210)
    ratio = 0
  else if (f <= 233)
    ratio = (f-210)/23
}

return ratio
  }

 ,get look_at_screen_bone_list() {
var f = THREE.MMD.getModels()[0].skin.time*30
var ratio = 1
if (f >= 157) {
  if (f <= 180)
    ratio = (180-f)/23
  else if (f <= 210)
    ratio = 0
  else if (f <= 233)
    ratio = (f-210)/23
}

return (System._browser.camera.facemesh.enabled) ? [
  { name:"首", weight_screen:0.5*ratio, weight_motion:1*(1-ratio) }
 ,{ name:"頭", weight_screen:0.5*ratio, weight_motion:1*(1-ratio) }
] : [
  { name:"首", weight_screen:0.4*ratio, weight_motion:1*(1-ratio) }
 ,{ name:"頭", weight_screen:0.4*ratio, weight_motion:1*(1-ratio) }
 ,{ name:"両目", weight_screen:0.2*ratio, weight_motion:1*(1-ratio), weight_screen_pow:2 }
];
  }

// ,look_at_mouse_z: -1

// ,look_at_screen_bone_list: [{ name:"両目", weight_screen:0.2, weight_motion:0}]
// ,get look_at_screen_parent_rotation() { return THREE.MMD.getModels()[0].skin.mesh.bones_by_name["頭"].quaternion.clone(); }

 ,IK_disabled: { test: function (name) { return (name.indexOf("足ＩＫ")!=-1) || (name.indexOf("つま先ＩＫ")!=-1); } }
    }

   ,"emote-mod_お辞儀1": {
  onstart: function () {
this._duration_end_ = Date.now() + (MMD_SA.MMD.motionManager._timeMax + Math.random()*3+0.5)*1000
if (MMD_SA_options.Dungeon_options.item_base.baseball._started && MMD_SA_options.Dungeon_options.item_base.baseball.action._ball_para) {
  MMD_SA.SpeechBubble.message(0, "Your score is " + MMD_SA_options.Dungeon_options.item_base.baseball.action._ball_para.hit_score + "!\nCongratulations!", 3*1000)
}
else {
  MMD_SA.SpeechBubble.message(0, "Thank you. 2 meter is what we need.", 3*1000)
}
  }
/*
 ,onended: function (loop_end) {
MMD_SA._no_fading=true; MMD_SA._ignore_physics_reset=true;
if (MMD_SA_options.Dungeon_options.item_base.social_distancing.action._social_distance_check(2,4))
  MMD_SA._freeze_onended=(Date.now()<this._duration_end_)
  }
*/

 ,freeze_onended: true
 ,onplaying: function (model_index) {
var mm = MMD_SA.MMD.motionManager
var model = THREE.MMD.getModels()[model_index]
if (model.skin.time > mm._timeMax) {
  if ((MMD_SA_options.Dungeon_options.item_base.baseball._started) ? ((Date.now() > this._duration_end_) ? !MMD_SA_options.Dungeon_options.item_base.baseball.action._distance_check()||true : false) || (Date.now() > this._duration_end_) : (Date.now() > this._duration_end_) || (MMD_SA_options.Dungeon_options.item_base.social_distancing._started && !MMD_SA_options.Dungeon_options.item_base.social_distancing.action._social_distance_check(2,4))) {
    MMD_SA._no_fading=true; MMD_SA._ignore_physics_reset=true;
    MMD_SA._force_motion_shuffle = true;
  }
}
  }

 ,auto_blink: true
 ,adjust_center_view_disabled: true
 ,get look_at_screen_parent_rotation() { return THREE.MMD.getModels()[0].mesh.quaternion; }
,look_at_screen_bone_list: [
  { name:"首", weight_screen:0.5, weight_screen_y:0.25, weight_motion:1 }
 ,{ name:"頭", weight_screen:0.5, weight_screen_y:0.25, weight_motion:1 }
 ,{ name:"上半身",  weight_screen:0.5, weight_screen_x:0,weight_screen_y:0.75, weight_motion:1 }
 ,{ name:"上半身2", weight_screen:0.5, weight_screen_x:0,weight_screen_y:0.75, weight_motion:1 }
]
    }

   ,"emote-mod_お辞儀2": {
  onstart: function () {
this._duration_end_ = Date.now() + (MMD_SA.MMD.motionManager._timeMax + Math.random()*3+0.5)*1000
if (MMD_SA_options.Dungeon_options.item_base.baseball._started && MMD_SA_options.Dungeon_options.item_base.baseball.action._ball_para) {
  MMD_SA.SpeechBubble.message(0, "Your score is " + MMD_SA_options.Dungeon_options.item_base.baseball.action._ball_para.hit_score + "!\nExcellent!", 3*1000)
}
else {
  MMD_SA.SpeechBubble.message(0, "Thank you. 2 meter is the distance we need.", 3*1000)
}
  }
/*
 ,onended: function (loop_end) {
MMD_SA._no_fading=true; MMD_SA._ignore_physics_reset=true;
if (MMD_SA_options.Dungeon_options.item_base.social_distancing.action._social_distance_check(2,4))
  MMD_SA._freeze_onended=(Date.now()<this._duration_end_)
  }
*/

 ,freeze_onended: true
 ,onplaying: function (model_index) {
var mm = MMD_SA.MMD.motionManager
var model = THREE.MMD.getModels()[model_index]
if (model.skin.time > mm._timeMax) {
  if ((MMD_SA_options.Dungeon_options.item_base.baseball._started) ? ((Date.now() > this._duration_end_) ? !MMD_SA_options.Dungeon_options.item_base.baseball.action._distance_check()||true : false) || (Date.now() > this._duration_end_) : (Date.now() > this._duration_end_) || (MMD_SA_options.Dungeon_options.item_base.social_distancing._started && !MMD_SA_options.Dungeon_options.item_base.social_distancing.action._social_distance_check(2,4))) {
    MMD_SA._no_fading=true; MMD_SA._ignore_physics_reset=true;
    MMD_SA._force_motion_shuffle = true;
  }
}
  }

 ,auto_blink: true
 ,adjust_center_view_disabled: true
 ,get look_at_screen_parent_rotation() { return THREE.MMD.getModels()[0].mesh.quaternion; }
,look_at_screen_bone_list: [
  { name:"首", weight_screen:0.5, weight_screen_y:0.25, weight_motion:1 }
 ,{ name:"頭", weight_screen:0.5, weight_screen_y:0.25, weight_motion:1 }
 ,{ name:"上半身",  weight_screen:0.5, weight_screen_x:0,weight_screen_y:0.75, weight_motion:1 }
 ,{ name:"上半身2", weight_screen:0.5, weight_screen_x:0,weight_screen_y:0.75, weight_motion:1 }
]
    }

   ,"emote-mod_肯定する1": {
  onstart: function () {
this._duration_end_ = Date.now() + (MMD_SA.MMD.motionManager._timeMax + Math.random()*3+0.5)*1000
if (MMD_SA_options.Dungeon_options.item_base.baseball._started && MMD_SA_options.Dungeon_options.item_base.baseball.action._ball_para) {
  MMD_SA.SpeechBubble.message(0, "Your score is " + MMD_SA_options.Dungeon_options.item_base.baseball.action._ball_para.hit_score + "! You are great!", 3*1000)
}
else {
  MMD_SA.SpeechBubble.message(0, "You got it, 2 meter~!", 3*1000)
}
  }
/*
 ,onended: function (loop_end) {
MMD_SA._no_fading=true; MMD_SA._ignore_physics_reset=true;
if (MMD_SA_options.Dungeon_options.item_base.social_distancing.action._social_distance_check(2,4))
  MMD_SA._freeze_onended=(Date.now()<this._duration_end_)
  }
*/

 ,freeze_onended: true
 ,onplaying: function (model_index) {
var mm = MMD_SA.MMD.motionManager
var model = THREE.MMD.getModels()[model_index]
if (model.skin.time > mm._timeMax) {
  if ((MMD_SA_options.Dungeon_options.item_base.baseball._started) ? ((Date.now() > this._duration_end_) ? !MMD_SA_options.Dungeon_options.item_base.baseball.action._distance_check()||true : false) || (Date.now() > this._duration_end_) : (Date.now() > this._duration_end_) || (MMD_SA_options.Dungeon_options.item_base.social_distancing._started && !MMD_SA_options.Dungeon_options.item_base.social_distancing.action._social_distance_check(2,4))) {
    MMD_SA._no_fading=true; MMD_SA._ignore_physics_reset=true;
    MMD_SA._force_motion_shuffle = true;
  }
}
  }

 ,auto_blink: true
 ,adjust_center_view_disabled: true
 ,get look_at_screen_parent_rotation() { return THREE.MMD.getModels()[0].mesh.quaternion; }
,look_at_screen_bone_list: [
  { name:"首", weight_screen:0.5, weight_screen_y:0.25, weight_motion:1 }
 ,{ name:"頭", weight_screen:0.5, weight_screen_y:0.25, weight_motion:1 }
 ,{ name:"上半身",  weight_screen:0.5, weight_screen_x:0,weight_screen_y:0.75, weight_motion:1 }
 ,{ name:"上半身2", weight_screen:0.5, weight_screen_x:0,weight_screen_y:0.75, weight_motion:1 }
]
    }

   ,"emote-mod_肯定する2": {
  onstart: function () {
this._duration_end_ = Date.now() + (MMD_SA.MMD.motionManager._timeMax + Math.random()*3+0.5)*1000
if (MMD_SA_options.Dungeon_options.item_base.baseball._started && MMD_SA_options.Dungeon_options.item_base.baseball.action._ball_para) {
  MMD_SA.SpeechBubble.message(0, "Your score is " + MMD_SA_options.Dungeon_options.item_base.baseball.action._ball_para.hit_score + "! Cool!", 3*1000)
}
else {
  MMD_SA.SpeechBubble.message(0, "This is it, 2 meter~!", 3*1000)
}
  }
/*
 ,onended: function (loop_end) {
MMD_SA._no_fading=true; MMD_SA._ignore_physics_reset=true;
if (MMD_SA_options.Dungeon_options.item_base.social_distancing.action._social_distance_check(2,4))
  MMD_SA._freeze_onended=(Date.now()<this._duration_end_)
  }
*/

 ,freeze_onended: true
 ,onplaying: function (model_index) {
var mm = MMD_SA.MMD.motionManager
var model = THREE.MMD.getModels()[model_index]
if (model.skin.time > mm._timeMax) {
  if ((MMD_SA_options.Dungeon_options.item_base.baseball._started) ? ((Date.now() > this._duration_end_) ? !MMD_SA_options.Dungeon_options.item_base.baseball.action._distance_check()||true : false) || (Date.now() > this._duration_end_) : (Date.now() > this._duration_end_) || (MMD_SA_options.Dungeon_options.item_base.social_distancing._started && !MMD_SA_options.Dungeon_options.item_base.social_distancing.action._social_distance_check(2,4))) {
    MMD_SA._no_fading=true; MMD_SA._ignore_physics_reset=true;
    MMD_SA._force_motion_shuffle = true;
  }
}
  }

 ,auto_blink: true
 ,adjust_center_view_disabled: true
 ,get look_at_screen_parent_rotation() { return THREE.MMD.getModels()[0].mesh.quaternion; }
,look_at_screen_bone_list: [
  { name:"首", weight_screen:0.5, weight_screen_y:0.25, weight_motion:1 }
 ,{ name:"頭", weight_screen:0.5, weight_screen_y:0.25, weight_motion:1 }
 ,{ name:"上半身",  weight_screen:0.5, weight_screen_x:0,weight_screen_y:0.75, weight_motion:1 }
 ,{ name:"上半身2", weight_screen:0.5, weight_screen_x:0,weight_screen_y:0.75, weight_motion:1 }
]
    }

   ,"emote-mod_照れる1": {
  onstart: function () {
this._duration_end_ = Date.now() + (MMD_SA.MMD.motionManager._timeMax + Math.random()*3+0.5)*1000
MMD_SA.SpeechBubble.message(0, "Hey... too close...", 3*1000)
  }
/*
 ,onended: function (loop_end) {
MMD_SA._no_fading=true; MMD_SA._ignore_physics_reset=true;
if (MMD_SA_options.Dungeon_options.item_base.social_distancing.action._social_distance_check(0.75,2))
  MMD_SA._freeze_onended=(Date.now()<this._duration_end_)
  }
*/

 ,freeze_onended: true
 ,onplaying: function (model_index) {
var mm = MMD_SA.MMD.motionManager
var model = THREE.MMD.getModels()[model_index]
if (model.skin.time > mm._timeMax) {
  if ((Date.now() > this._duration_end_) || !MMD_SA_options.Dungeon_options.item_base.social_distancing.action._social_distance_check(0.75,2)) {
    MMD_SA._no_fading=true; MMD_SA._ignore_physics_reset=true;
    MMD_SA._force_motion_shuffle = true;
  }
}
  }

 ,auto_blink: true
 ,adjust_center_view_disabled: true
 ,get look_at_screen_parent_rotation() { return THREE.MMD.getModels()[0].mesh.quaternion; }
,look_at_screen_bone_list: [
  { name:"首", weight_screen:0.5, weight_screen_y:0.25, weight_motion:1 }
 ,{ name:"頭", weight_screen:0.5, weight_screen_y:0.25, weight_motion:1 }
 ,{ name:"上半身",  weight_screen:0.5, weight_screen_x:0,weight_screen_y:0.75, weight_motion:1 }
 ,{ name:"上半身2", weight_screen:0.5, weight_screen_x:0,weight_screen_y:0.75, weight_motion:1 }
]
    }

   ,"emote-mod_照れる2": {
  onstart: function () {
this._duration_end_ = Date.now() + (MMD_SA.MMD.motionManager._timeMax + Math.random()*3+0.5)*1000
MMD_SA.SpeechBubble.message(0, "Isn't it too close...", 3*1000)
  }

/*
 ,onended: function (loop_end) {
MMD_SA._no_fading=true; MMD_SA._ignore_physics_reset=true;
if (MMD_SA_options.Dungeon_options.item_base.social_distancing.action._social_distance_check(0.75,2))
  MMD_SA._freeze_onended=(Date.now()<this._duration_end_)
  }
*/

 ,freeze_onended: true
 ,onplaying: function (model_index) {
var mm = MMD_SA.MMD.motionManager
var model = THREE.MMD.getModels()[model_index]
if (model.skin.time > mm._timeMax) {
  if ((Date.now() > this._duration_end_) || !MMD_SA_options.Dungeon_options.item_base.social_distancing.action._social_distance_check(0.75,2)) {
    MMD_SA._no_fading=true; MMD_SA._ignore_physics_reset=true;
    MMD_SA._force_motion_shuffle = true;
  }
}
  }

 ,auto_blink: true
 ,adjust_center_view_disabled: true
 ,get look_at_screen_parent_rotation() { return THREE.MMD.getModels()[0].mesh.quaternion; }
,look_at_screen_bone_list: [
  { name:"首", weight_screen:0.5, weight_screen_y:0.25, weight_motion:1 }
 ,{ name:"頭", weight_screen:0.5, weight_screen_y:0.25, weight_motion:1 }
 ,{ name:"上半身",  weight_screen:0.5, weight_screen_x:0,weight_screen_y:0.75, weight_motion:1 }
 ,{ name:"上半身2", weight_screen:0.5, weight_screen_x:0,weight_screen_y:0.75, weight_motion:1 }
]
    }

   ,"surrender_v03": {
  onstart: function () {
MMD_SA.SpeechBubble.message(0, "I surrender! Please, stay back! >_<", 3*1000)
  } 
/*
 ,onended: function (loop_end) {
MMD_SA._no_fading=true; MMD_SA._ignore_physics_reset=true;
MMD_SA._freeze_onended=MMD_SA_options.Dungeon_options.item_base.social_distancing.action._social_distance_check(0,1.5)
  }
*/

 ,freeze_onended: true
 ,onplaying: function (model_index) {
var mm = MMD_SA.MMD.motionManager
var model = THREE.MMD.getModels()[model_index]
//DEBUG_show(model.skin.time+'\n'+mm._timeMax)
if (model.skin.time > mm._timeMax) {
//MMD_SA._custom_skin = [{ key:{ name:"全ての親", pos:[Math.random(),Math.random(),Math.random()] ,rot:[0,0,0,1] ,interp:MMD_SA._skin_interp_default }, idx:model.mesh.bones_by_name["全ての親"]._index }]
  if (!MMD_SA_options.Dungeon_options.item_base.social_distancing.action._social_distance_check(0,1.5)) {
    MMD_SA._no_fading=true; MMD_SA._ignore_physics_reset=true;
    MMD_SA._force_motion_shuffle = true;
  }
  else if ((parseInt(model.skin.time) % 10 == 0) && !MMD_SA.SpeechBubble.visible) {
    MMD_SA.SpeechBubble.message(0, "I surrender! Please, stay back! >_<", 3*1000)
  }
}
  }

 ,auto_blink: false
 ,adjust_center_view_disabled: true
 ,get look_at_screen_parent_rotation() { return THREE.MMD.getModels()[0].mesh.quaternion; }
,look_at_screen_bone_list: [
  { name:"首", weight_screen:0.5, weight_screen_x:0,weight_screen_y:0.25, weight_motion:1 }
 ,{ name:"頭", weight_screen:0.5, weight_screen_x:0,weight_screen_y:0.25, weight_motion:1 }
 ,{ name:"上半身",  weight_screen:0.5, weight_screen_x:0,weight_screen_y:0.75, weight_motion:1 }
 ,{ name:"上半身2", weight_screen:0.5, weight_screen_x:0,weight_screen_y:0.75, weight_motion:1 }
]
    }

   ,"surrender-R_v03": {
  onstart: function () {} 
 ,onended: function (loop_end) {
MMD_SA._no_fading=true; MMD_SA._ignore_physics_reset=true;
MMD_SA_options.Dungeon_options.item_base.social_distancing.action._social_distance_check(999,999)
  }
 ,auto_blink: false
 ,adjust_center_view_disabled: true
 ,get look_at_screen_parent_rotation() { return THREE.MMD.getModels()[0].mesh.quaternion; }
,look_at_screen_bone_list: [
  { name:"首", weight_screen:0.5, weight_screen_x:0,weight_screen_y:0.25, weight_motion:1 }
 ,{ name:"頭", weight_screen:0.5, weight_screen_x:0,weight_screen_y:0.25, weight_motion:1 }
 ,{ name:"上半身",  weight_screen:0.5, weight_screen_x:0,weight_screen_y:0.75, weight_motion:1 }
 ,{ name:"上半身2", weight_screen:0.5, weight_screen_x:0,weight_screen_y:0.75, weight_motion:1 }
]
    }

   ,"emote-mod_歓迎する1": {
  onstart: function () {
this._duration_end_ = Date.now() + (MMD_SA.MMD.motionManager._timeMax + Math.random()*3+0.5)*1000
MMD_SA.SpeechBubble.message(0, "Hey! Come closer~!", 3*1000)
  }
/*
 ,onended: function (loop_end) {
MMD_SA._no_fading=true; MMD_SA._ignore_physics_reset=true;
if (MMD_SA_options.Dungeon_options.item_base.social_distancing.action._social_distance_check(4,6))
  MMD_SA._freeze_onended=(Date.now()<this._duration_end_)
  }
*/

 ,freeze_onended: true
 ,onplaying: function (model_index) {
var mm = MMD_SA.MMD.motionManager
var model = THREE.MMD.getModels()[model_index]
if (model.skin.time > mm._timeMax) {
  if ((Date.now() > this._duration_end_) || !MMD_SA_options.Dungeon_options.item_base.social_distancing.action._social_distance_check(4,6)) {
    MMD_SA._no_fading=true; MMD_SA._ignore_physics_reset=true;
    MMD_SA._force_motion_shuffle = true;
  }
}
  }

 ,auto_blink: true
 ,adjust_center_view_disabled: true
 ,get look_at_screen_parent_rotation() { return THREE.MMD.getModels()[0].mesh.quaternion; }
,look_at_screen_bone_list: [
  { name:"首", weight_screen:0.5, weight_screen_y:0.25, weight_motion:1 }
 ,{ name:"頭", weight_screen:0.5, weight_screen_y:0.25, weight_motion:1 }
 ,{ name:"上半身",  weight_screen:0.5, weight_screen_x:0,weight_screen_y:0.75, weight_motion:1 }
 ,{ name:"上半身2", weight_screen:0.5, weight_screen_x:0,weight_screen_y:0.75, weight_motion:1 }
]
    }

   ,"emote-mod_歓迎する2": {
  onstart: function () {
this._duration_end_ = Date.now() + (MMD_SA.MMD.motionManager._timeMax + Math.random()*3+0.5)*1000
MMD_SA.SpeechBubble.message(0, "Come on! I won't bite~!", 3*1000)
  }
/*
 ,onended: function (loop_end) {
MMD_SA._no_fading=true; MMD_SA._ignore_physics_reset=true;
if (MMD_SA_options.Dungeon_options.item_base.social_distancing.action._social_distance_check(4,6))
  MMD_SA._freeze_onended=(Date.now()<this._duration_end_)
  }
*/

 ,freeze_onended: true
 ,onplaying: function (model_index) {
var mm = MMD_SA.MMD.motionManager
var model = THREE.MMD.getModels()[model_index]
if (model.skin.time > mm._timeMax) {
  if ((Date.now() > this._duration_end_) || !MMD_SA_options.Dungeon_options.item_base.social_distancing.action._social_distance_check(4,6)) {
    MMD_SA._no_fading=true; MMD_SA._ignore_physics_reset=true;
    MMD_SA._force_motion_shuffle = true;
  }
}
  }

 ,auto_blink: true
 ,adjust_center_view_disabled: true
 ,get look_at_screen_parent_rotation() { return THREE.MMD.getModels()[0].mesh.quaternion; }
,look_at_screen_bone_list: [
  { name:"首", weight_screen:0.5, weight_screen_y:0.25, weight_motion:1 }
 ,{ name:"頭", weight_screen:0.5, weight_screen_y:0.25, weight_motion:1 }
 ,{ name:"上半身",  weight_screen:0.5, weight_screen_x:0,weight_screen_y:0.75, weight_motion:1 }
 ,{ name:"上半身2", weight_screen:0.5, weight_screen_x:0,weight_screen_y:0.75, weight_motion:1 }
]
    }

   ,"emote-mod_がっかり1": {
  onstart: function () {
this._duration_end_ = Date.now() + (MMD_SA.MMD.motionManager._timeMax + Math.random()*3+0.5)*1000
if (MMD_SA_options.Dungeon_options.item_base.baseball._started) {
  if (MMD_SA_options.Dungeon_options.item_base.baseball.action._ball_para) {
    MMD_SA.SpeechBubble.message(0, "Your score is " + MMD_SA_options.Dungeon_options.item_base.baseball.action._ball_para.hit_score + ". Not bad.", 3*1000)
  }
  else {
    MMD_SA.SpeechBubble.message(0, "It's too close to throw the ball...", 3*1000)
  }
}
else {
  MMD_SA.SpeechBubble.message(0, "That's a lot more than 2 meter...", 3*1000)
}
  }
/*
 ,onended: function (loop_end) {
MMD_SA._no_fading=true; MMD_SA._ignore_physics_reset=true;
if (MMD_SA_options.Dungeon_options.item_base.social_distancing.action._social_distance_check(6,8))
  MMD_SA._freeze_onended=(Date.now()<this._duration_end_)
  }
*/

 ,freeze_onended: true
 ,onplaying: function (model_index) {
var mm = MMD_SA.MMD.motionManager
var model = THREE.MMD.getModels()[model_index]
if (model.skin.time > mm._timeMax) {
  if ((MMD_SA_options.Dungeon_options.item_base.baseball._started) ? ((Date.now() > this._duration_end_) ? !MMD_SA_options.Dungeon_options.item_base.baseball.action._distance_check()||true : false) || (Date.now() > this._duration_end_) : (Date.now() > this._duration_end_) || (MMD_SA_options.Dungeon_options.item_base.social_distancing._started && !MMD_SA_options.Dungeon_options.item_base.social_distancing.action._social_distance_check(6,8))) {
    MMD_SA._no_fading=true; MMD_SA._ignore_physics_reset=true;
    MMD_SA._force_motion_shuffle = true;
  }
}
  }

 ,auto_blink: true
 ,adjust_center_view_disabled: true
 ,get look_at_screen_parent_rotation() { return THREE.MMD.getModels()[0].mesh.quaternion; }
,look_at_screen_bone_list: [
  { name:"首", weight_screen:0.5, weight_screen_y:0.25, weight_motion:1 }
 ,{ name:"頭", weight_screen:0.5, weight_screen_y:0.25, weight_motion:1 }
 ,{ name:"上半身",  weight_screen:0.5, weight_screen_x:0,weight_screen_y:0.75, weight_motion:1 }
 ,{ name:"上半身2", weight_screen:0.5, weight_screen_x:0,weight_screen_y:0.75, weight_motion:1 }
]
    }

   ,"emote-mod_がっかり2": {
  onstart: function () {
this._duration_end_ = Date.now() + (MMD_SA.MMD.motionManager._timeMax + Math.random()*3+0.5)*1000
if (MMD_SA_options.Dungeon_options.item_base.baseball._started) {
  if (MMD_SA_options.Dungeon_options.item_base.baseball.action._ball_para) {
    MMD_SA.SpeechBubble.message(0, "Your score is " + MMD_SA_options.Dungeon_options.item_base.baseball.action._ball_para.hit_score + ". It's ok.", 3*1000)
  }
  else {
    MMD_SA.SpeechBubble.message(0, "I need more distance...", 3*1000)
  }
}
else {
  MMD_SA.SpeechBubble.message(0, "No, not that far away...", 3*1000)
}
  }
/*
 ,onended: function (loop_end) {
MMD_SA._no_fading=true; MMD_SA._ignore_physics_reset=true;
if (MMD_SA_options.Dungeon_options.item_base.social_distancing.action._social_distance_check(6,8))
  MMD_SA._freeze_onended=(Date.now()<this._duration_end_)
  }
*/

 ,freeze_onended: true
 ,onplaying: function (model_index) {
var mm = MMD_SA.MMD.motionManager
var model = THREE.MMD.getModels()[model_index]
if (model.skin.time > mm._timeMax) {
  if ((MMD_SA_options.Dungeon_options.item_base.baseball._started) ? ((Date.now() > this._duration_end_) ? !MMD_SA_options.Dungeon_options.item_base.baseball.action._distance_check()||true : false) || (Date.now() > this._duration_end_) : (Date.now() > this._duration_end_) || (MMD_SA_options.Dungeon_options.item_base.social_distancing._started && !MMD_SA_options.Dungeon_options.item_base.social_distancing.action._social_distance_check(6,8))) {
    MMD_SA._no_fading=true; MMD_SA._ignore_physics_reset=true;
    MMD_SA._force_motion_shuffle = true;
  }
}
  }

 ,auto_blink: true
 ,adjust_center_view_disabled: true
 ,get look_at_screen_parent_rotation() { return THREE.MMD.getModels()[0].mesh.quaternion; }
,look_at_screen_bone_list: [
  { name:"首", weight_screen:0.5, weight_screen_y:0.25, weight_motion:1 }
 ,{ name:"頭", weight_screen:0.5, weight_screen_y:0.25, weight_motion:1 }
 ,{ name:"上半身",  weight_screen:0.5, weight_screen_x:0,weight_screen_y:0.75, weight_motion:1 }
 ,{ name:"上半身2", weight_screen:0.5, weight_screen_x:0,weight_screen_y:0.75, weight_motion:1 }
]
    }

   ,"emote-mod_肩をすくめる1": {
  onstart: function () {
this._duration_end_ = Date.now() + (MMD_SA.MMD.motionManager._timeMax + Math.random()*3+0.5)*1000
if (MMD_SA_options.Dungeon_options.item_base.baseball._started) {
  if (MMD_SA_options.Dungeon_options.item_base.baseball.action._ball_para) {
    MMD_SA.SpeechBubble.message(0, "Your score is " + MMD_SA_options.Dungeon_options.item_base.baseball.action._ball_para.hit_score + ". Do better next time.", 3*1000)
  }
  else {
    MMD_SA.SpeechBubble.message(0, "Isn't it too close...", 3*1000)
  }
}
else {
  MMD_SA.SpeechBubble.message(0, "What's the point to stand so far away...", 3*1000)
}
  }
/*
 ,onended: function (loop_end) {
MMD_SA._no_fading=true; MMD_SA._ignore_physics_reset=true;
if (MMD_SA_options.Dungeon_options.item_base.social_distancing.action._social_distance_check(6,8))
  MMD_SA._freeze_onended=(Date.now()<this._duration_end_)
  }
*/

 ,freeze_onended: true
 ,onplaying: function (model_index) {
var mm = MMD_SA.MMD.motionManager
var model = THREE.MMD.getModels()[model_index]
if (model.skin.time > mm._timeMax) {
  if ((MMD_SA_options.Dungeon_options.item_base.baseball._started) ? ((Date.now() > this._duration_end_) ? !MMD_SA_options.Dungeon_options.item_base.baseball.action._distance_check()||true : false) || (Date.now() > this._duration_end_) : (Date.now() > this._duration_end_) || (MMD_SA_options.Dungeon_options.item_base.social_distancing._started && !MMD_SA_options.Dungeon_options.item_base.social_distancing.action._social_distance_check(6,8))) {
    MMD_SA._no_fading=true; MMD_SA._ignore_physics_reset=true;
    MMD_SA._force_motion_shuffle = true;
  }
}
  }

 ,auto_blink: true
 ,adjust_center_view_disabled: true
 ,get look_at_screen_parent_rotation() { return THREE.MMD.getModels()[0].mesh.quaternion; }
,look_at_screen_bone_list: [
  { name:"首", weight_screen:0.5, weight_screen_y:0.25, weight_motion:1 }
 ,{ name:"頭", weight_screen:0.5, weight_screen_y:0.25, weight_motion:1 }
 ,{ name:"上半身",  weight_screen:0.5, weight_screen_x:0,weight_screen_y:0.75, weight_motion:1 }
 ,{ name:"上半身2", weight_screen:0.5, weight_screen_x:0,weight_screen_y:0.75, weight_motion:1 }
]
    }

   ,"emote-mod_肩をすくめる2": {
  onstart: function () {
this._duration_end_ = Date.now() + (MMD_SA.MMD.motionManager._timeMax + Math.random()*3+0.5)*1000
if (MMD_SA_options.Dungeon_options.item_base.baseball._started) {
  if (MMD_SA_options.Dungeon_options.item_base.baseball.action._ball_para) {
    MMD_SA.SpeechBubble.message(0, "Your score is " + MMD_SA_options.Dungeon_options.item_base.baseball.action._ball_para.hit_score + ". Still room for improvement.", 3*1000)
  }
  else {
    MMD_SA.SpeechBubble.message(0, "5 meters apart at least, please...?", 3*1000)
  }
}
else {
  MMD_SA.SpeechBubble.message(0, "Come on, not that far away...", 3*1000)
}
  }
/*
 ,onended: function (loop_end) {
MMD_SA._no_fading=true; MMD_SA._ignore_physics_reset=true;
if (MMD_SA_options.Dungeon_options.item_base.social_distancing.action._social_distance_check(6,8))
  MMD_SA._freeze_onended=(Date.now()<this._duration_end_)
  }
*/

 ,freeze_onended: true
 ,onplaying: function (model_index) {
var mm = MMD_SA.MMD.motionManager
var model = THREE.MMD.getModels()[model_index]
if (model.skin.time > mm._timeMax) {
  if ((MMD_SA_options.Dungeon_options.item_base.baseball._started) ? ((Date.now() > this._duration_end_) ? !MMD_SA_options.Dungeon_options.item_base.baseball.action._distance_check()||true : false) || (Date.now() > this._duration_end_) : (Date.now() > this._duration_end_) || (MMD_SA_options.Dungeon_options.item_base.social_distancing._started && !MMD_SA_options.Dungeon_options.item_base.social_distancing.action._social_distance_check(6,8))) {
    MMD_SA._no_fading=true; MMD_SA._ignore_physics_reset=true;
    MMD_SA._force_motion_shuffle = true;
  }
}
  }

 ,auto_blink: true
 ,adjust_center_view_disabled: true
 ,get look_at_screen_parent_rotation() { return THREE.MMD.getModels()[0].mesh.quaternion; }
,look_at_screen_bone_list: [
  { name:"首", weight_screen:0.5, weight_screen_y:0.25, weight_motion:1 }
 ,{ name:"頭", weight_screen:0.5, weight_screen_y:0.25, weight_motion:1 }
 ,{ name:"上半身",  weight_screen:0.5, weight_screen_x:0,weight_screen_y:0.75, weight_motion:1 }
 ,{ name:"上半身2", weight_screen:0.5, weight_screen_x:0,weight_screen_y:0.75, weight_motion:1 }
]
    }

   ,"emote-mod_すねる1": {
  onstart: function () {
this._duration_end_ = Date.now() + (MMD_SA.MMD.motionManager._timeMax + Math.random()*3+0.5)*1000
if (MMD_SA_options.Dungeon_options.item_base.baseball._started && MMD_SA_options.Dungeon_options.item_base.baseball.action._ball_para) {
  MMD_SA.SpeechBubble.message(0, "Your score is " + MMD_SA_options.Dungeon_options.item_base.baseball.action._ball_para.hit_score + "... oh well...", 3*1000)
}
else {
  MMD_SA.SpeechBubble.message(0, "You don't like me, do you...", 3*1000)
}
  }
/*
 ,onended: function (loop_end) {
MMD_SA._no_fading=true; MMD_SA._ignore_physics_reset=true;
if (MMD_SA_options.Dungeon_options.item_base.social_distancing.action._social_distance_check(8,999))
  MMD_SA._freeze_onended=(Date.now()<this._duration_end_)
  }
*/

 ,freeze_onended: true
 ,onplaying: function (model_index) {
var mm = MMD_SA.MMD.motionManager
var model = THREE.MMD.getModels()[model_index]
if (model.skin.time > mm._timeMax) {
  if ((MMD_SA_options.Dungeon_options.item_base.baseball._started) ? ((Date.now() > this._duration_end_) ? !MMD_SA_options.Dungeon_options.item_base.baseball.action._distance_check()||true : false) || (Date.now() > this._duration_end_) : (Date.now() > this._duration_end_) || (MMD_SA_options.Dungeon_options.item_base.social_distancing._started && !MMD_SA_options.Dungeon_options.item_base.social_distancing.action._social_distance_check(8,999))) {
    MMD_SA._no_fading=true; MMD_SA._ignore_physics_reset=true;
    MMD_SA._force_motion_shuffle = true;
  }
}
  }

 ,auto_blink: true
 ,adjust_center_view_disabled: true
 ,get look_at_screen_parent_rotation() { return THREE.MMD.getModels()[0].mesh.quaternion; }
,look_at_screen_bone_list: [
  { name:"首", weight_screen:0.5, weight_screen_y:0.25, weight_motion:1 }
 ,{ name:"頭", weight_screen:0.5, weight_screen_y:0.25, weight_motion:1 }
 ,{ name:"上半身",  weight_screen:0.5, weight_screen_x:0,weight_screen_y:0.75, weight_motion:1 }
 ,{ name:"上半身2", weight_screen:0.5, weight_screen_x:0,weight_screen_y:0.75, weight_motion:1 }
]
    }

   ,"emote-mod_すねる2": {
  onstart: function () {
this._duration_end_ = Date.now() + (MMD_SA.MMD.motionManager._timeMax + Math.random()*3+0.5)*1000
if (MMD_SA_options.Dungeon_options.item_base.baseball._started && MMD_SA_options.Dungeon_options.item_base.baseball.action._ball_para) {
  MMD_SA.SpeechBubble.message(0, "Your score is " + MMD_SA_options.Dungeon_options.item_base.baseball.action._ball_para.hit_score + "...", 3*1000)
}
else {
  MMD_SA.SpeechBubble.message(0, "This is so boring...", 3*1000)
}
  }
/*
 ,onended: function (loop_end) {
MMD_SA._no_fading=true; MMD_SA._ignore_physics_reset=true;
if (MMD_SA_options.Dungeon_options.item_base.social_distancing.action._social_distance_check(8,999))
  MMD_SA._freeze_onended=(Date.now()<this._duration_end_)
  }
*/

 ,freeze_onended: true
 ,onplaying: function (model_index) {
var mm = MMD_SA.MMD.motionManager
var model = THREE.MMD.getModels()[model_index]
if (model.skin.time > mm._timeMax) {
  if ((MMD_SA_options.Dungeon_options.item_base.baseball._started) ? ((Date.now() > this._duration_end_) ? !MMD_SA_options.Dungeon_options.item_base.baseball.action._distance_check()||true : false) || (Date.now() > this._duration_end_) : (Date.now() > this._duration_end_) || (MMD_SA_options.Dungeon_options.item_base.social_distancing._started && !MMD_SA_options.Dungeon_options.item_base.social_distancing.action._social_distance_check(8,999))) {
    MMD_SA._no_fading=true; MMD_SA._ignore_physics_reset=true;
    MMD_SA._force_motion_shuffle = true;
  }
}
  }

 ,auto_blink: true
 ,adjust_center_view_disabled: true
 ,get look_at_screen_parent_rotation() { return THREE.MMD.getModels()[0].mesh.quaternion; }
,look_at_screen_bone_list: [
  { name:"首", weight_screen:0.5, weight_screen_y:0.25, weight_motion:1 }
 ,{ name:"頭", weight_screen:0.5, weight_screen_y:0.25, weight_motion:1 }
 ,{ name:"上半身",  weight_screen:0.5, weight_screen_x:0,weight_screen_y:0.75, weight_motion:1 }
 ,{ name:"上半身2", weight_screen:0.5, weight_screen_x:0,weight_screen_y:0.75, weight_motion:1 }
]
    }

   ,"emote-mod_よろめく1": {
  onstart: function () {
this._duration_end_ = Date.now() + (MMD_SA.MMD.motionManager._timeMax + Math.random()*3+0.5)*1000
if (MMD_SA_options.Dungeon_options.item_base.baseball._started) {
  if (MMD_SA_options.Dungeon_options.item_base.baseball.action._ball_para) {
    MMD_SA.SpeechBubble.message(0, "Your score is " + MMD_SA_options.Dungeon_options.item_base.baseball.action._ball_para.hit_score + "... isn't it too bad...", 3*1000)
  }
  else {
    MMD_SA.SpeechBubble.message(0, "You think I can throw a magical curveball...?", 3*1000)
  }
}
else {
  MMD_SA.SpeechBubble.message(0, "Am I a joke to you...", 3*1000)
}
  }
/*
 ,onended: function (loop_end) {
MMD_SA._no_fading=true; MMD_SA._ignore_physics_reset=true;
if (MMD_SA_options.Dungeon_options.item_base.social_distancing.action._social_distance_check(8,999))
  MMD_SA._freeze_onended=(Date.now()<this._duration_end_)
  }
*/

 ,freeze_onended: true
 ,onplaying: function (model_index) {
var mm = MMD_SA.MMD.motionManager
var model = THREE.MMD.getModels()[model_index]
if (model.skin.time > mm._timeMax) {
  if ((MMD_SA_options.Dungeon_options.item_base.baseball._started) ? ((Date.now() > this._duration_end_) ? !MMD_SA_options.Dungeon_options.item_base.baseball.action._distance_check()||true : false) || (Date.now() > this._duration_end_) : (Date.now() > this._duration_end_) || (MMD_SA_options.Dungeon_options.item_base.social_distancing._started && !MMD_SA_options.Dungeon_options.item_base.social_distancing.action._social_distance_check(8,999))) {
    MMD_SA._no_fading=true; MMD_SA._ignore_physics_reset=true;
    MMD_SA._force_motion_shuffle = true;
  }
}
  }

 ,auto_blink: true
 ,adjust_center_view_disabled: true
 ,get look_at_screen_parent_rotation() { return THREE.MMD.getModels()[0].mesh.quaternion; }
,look_at_screen_bone_list: [
  { name:"首", weight_screen:0.5, weight_screen_y:0.25, weight_motion:1 }
 ,{ name:"頭", weight_screen:0.5, weight_screen_y:0.25, weight_motion:1 }
 ,{ name:"上半身",  weight_screen:0.5, weight_screen_x:0,weight_screen_y:0.75, weight_motion:1 }
 ,{ name:"上半身2", weight_screen:0.5, weight_screen_x:0,weight_screen_y:0.75, weight_motion:1 }
]
    }

   ,"emote-mod_よろめく2": {
  onstart: function () {
this._duration_end_ = Date.now() + (MMD_SA.MMD.motionManager._timeMax + Math.random()*3+0.5)*1000
if (MMD_SA_options.Dungeon_options.item_base.baseball._started) {
  if (MMD_SA_options.Dungeon_options.item_base.baseball.action._ball_para) {
    MMD_SA.SpeechBubble.message(0, "Your score is " + MMD_SA_options.Dungeon_options.item_base.baseball.action._ball_para.hit_score + "... oh no...", 3*1000)
  }
  else {
    MMD_SA.SpeechBubble.message(0, "Can you stand in front of me, please...", 3*1000)
  }
}
else {
  MMD_SA.SpeechBubble.message(0, "Oh my God... do you have to stand so far away...", 3*1000)
}
  }
/*
 ,onended: function (loop_end) {
MMD_SA._no_fading=true; MMD_SA._ignore_physics_reset=true;
if (MMD_SA_options.Dungeon_options.item_base.social_distancing.action._social_distance_check(8,999))
  MMD_SA._freeze_onended=(Date.now()<this._duration_end_)
  }
*/

 ,freeze_onended: true
 ,onplaying: function (model_index) {
var mm = MMD_SA.MMD.motionManager
var model = THREE.MMD.getModels()[model_index]
if (model.skin.time > mm._timeMax) {
  if ((MMD_SA_options.Dungeon_options.item_base.baseball._started) ? ((Date.now() > this._duration_end_) ? !MMD_SA_options.Dungeon_options.item_base.baseball.action._distance_check()||true : false) || (Date.now() > this._duration_end_) : (Date.now() > this._duration_end_) || (MMD_SA_options.Dungeon_options.item_base.social_distancing._started && !MMD_SA_options.Dungeon_options.item_base.social_distancing.action._social_distance_check(8,999))) {
    MMD_SA._no_fading=true; MMD_SA._ignore_physics_reset=true;
    MMD_SA._force_motion_shuffle = true;
  }
}
  }

 ,auto_blink: true
 ,adjust_center_view_disabled: true
 ,get look_at_screen_parent_rotation() { return THREE.MMD.getModels()[0].mesh.quaternion; }
,look_at_screen_bone_list: [
  { name:"首", weight_screen:0.5, weight_screen_y:0.25, weight_motion:1 }
 ,{ name:"頭", weight_screen:0.5, weight_screen_y:0.25, weight_motion:1 }
 ,{ name:"上半身",  weight_screen:0.5, weight_screen_x:0,weight_screen_y:0.75, weight_motion:1 }
 ,{ name:"上半身2", weight_screen:0.5, weight_screen_x:0,weight_screen_y:0.75, weight_motion:1 }
]
    }

   ,"emote-mod_おどろく1": {
  onended: function (loop_end) {
MMD_SA._no_fading=true; MMD_SA._ignore_physics_reset=true;
MMD_SA_options.motion_shuffle_list_default = MMD_SA_options._motion_shuffle_list_default.slice();
  }

 ,onplaying: function (model_index) {
var mm = MMD_SA.MMD.motionManager
var model = THREE.MMD.getModels()[model_index]
if (model.skin.time > 1) {
  if (MMD_SA._v3a.copy(MMD_SA.camera_position).setY(0).distanceTo(MMD_SA._v3b.copy(model.mesh.position).setY(0))/10 / MMD_SA.WebXR.zoom_scale < 1) {
    model.skin.time = 1
    model.morph.time = 1
  }
}
  }

 ,auto_blink: false//true
 ,adjust_center_view_disabled: true
/*
 ,get look_at_screen_parent_rotation() { return THREE.MMD.getModels()[0].mesh.quaternion; }
,look_at_screen_bone_list: [
  { name:"首", weight_screen:0.5, weight_screen_y:0.25, weight_motion:1 }
 ,{ name:"頭", weight_screen:0.5, weight_screen_y:0.25, weight_motion:1 }
 ,{ name:"上半身",  weight_screen:0.5, weight_screen_x:0,weight_screen_y:0.75, weight_motion:1 }
 ,{ name:"上半身2", weight_screen:0.5, weight_screen_x:0,weight_screen_y:0.75, weight_motion:1 }
]
*/
    }

   ,"baseball_throw": {
  onstart: function () {
MMD_SA_options.Dungeon_options.item_base.baseball.action._ball_para = null
MMD_SA.SpeechBubble.message(0, "Catch this~!", 1*1000)
  }

 ,onended: function (loop_end) {
MMD_SA._no_fading=true; MMD_SA._ignore_physics_reset=true;
if (!loop_end) return;

var score = MMD_SA_options.Dungeon_options.item_base.baseball.action._ball_para.hit_score
if (score > 75) {
  MMD_SA_options._motion_shuffle_list_default = [MMD_SA_options.motion_index_by_name["emote-mod_お辞儀1"], MMD_SA_options.motion_index_by_name["emote-mod_お辞儀2"], MMD_SA_options.motion_index_by_name["emote-mod_肯定する1"], MMD_SA_options.motion_index_by_name["emote-mod_肯定する2"]]
}
else if (score > 40) {
  MMD_SA_options._motion_shuffle_list_default = [MMD_SA_options.motion_index_by_name["emote-mod_がっかり1"], MMD_SA_options.motion_index_by_name["emote-mod_がっかり2"], MMD_SA_options.motion_index_by_name["emote-mod_肩をすくめる1"], MMD_SA_options.motion_index_by_name["emote-mod_肩をすくめる2"]]
}
else {
  MMD_SA_options._motion_shuffle_list_default = [MMD_SA_options.motion_index_by_name["emote-mod_すねる1"], MMD_SA_options.motion_index_by_name["emote-mod_すねる2"], MMD_SA_options.motion_index_by_name["emote-mod_よろめく1"], MMD_SA_options.motion_index_by_name["emote-mod_よろめく2"]]
}

MMD_SA_options.motion_shuffle_list_default = MMD_SA_options._motion_shuffle_list_default.slice()
MMD_SA._force_motion_shuffle = true
  }

// ,freeze_onended: true
 ,onplaying: function (model_index) {
var mm = MMD_SA.MMD.motionManager
var model = THREE.MMD.getModels()[model_index]
if (model.skin.time >= 140/30) {
  MMD_SA_options.Dungeon_options.item_base.baseball.action._ball_fly()
}
  }

 ,auto_blink: true
 ,adjust_center_view_disabled: true
 ,get look_at_screen_parent_rotation() { return THREE.MMD.getModels()[0].mesh.quaternion; }
,look_at_screen_bone_list: [
  { name:"上半身",  weight_screen:1/3, weight_motion:1 }
 ,{ name:"上半身2", weight_screen:2/3, weight_motion:1 }
]
    }

   ,"chair_sit01_armIK": (function () {
      return {
  onstart: function () {
this._ground_plane_visible = MMD_SA.WebXR.ground_plane.visible
  }

 ,onended: function (loop_end) {
MMD_SA.WebXR.ground_plane.visible = this._ground_plane_visible
MMD_SA._no_fading=true; MMD_SA._ignore_physics_reset=true;
//MMD_SA_options.motion_shuffle_list_default = MMD_SA_options._motion_shuffle_list_default.slice();
  }

 ,onplaying: function () {
MMD_SA.WebXR.ground_plane.visible = false
//var model_para = MMD_SA_options.model_para_obj
//model_para._custom_skin = [{ key:{ name:"右腕ＩＫ", pos:[0,1,0] ,rot:[0,0,0,1] ,interp:MMD_SA._skin_interp_default }, idx:mesh.bones_by_name["右腕ＩＫ"]._index }]
  }

 ,motion_tracking_enabled: true, motion_tracking_upper_body_only: true

 ,motion_tracking: {
    hand_as_foot: {
      transform_position: function (pos) {
pos.y += MMD_SA_options.model_para_obj.left_arm_to_IK_xy[1];
pos.z -= MMD_SA_options.model_para_obj.left_leg_length * 0.25
pos.multiplyScalar(1.5)
      }
    }
  }

 ,process_bones: function (model, skin) {
var mesh = model.mesh
var chair_ground_y = mesh.bones_by_name["下半身"].pmxBone.origin[1] - 8
mesh.bones_by_name["全ての親"].position.y -= chair_ground_y

var xr = MMD_SA.WebXR
if (!xr.session) {
  xr.hit_ground_y = 0
  xr.hit_ground_y_lowest = -0.1
}

var ground_y_diff = (xr.hit_ground_y - xr.hit_ground_y_lowest) * 10 * xr.zoom_scale - chair_ground_y
if (ground_y_diff >= 0)
  return

if (ground_y_diff < -chair_ground_y)
  ground_y_diff = -chair_ground_y

var posL = mesh.bones_by_name["左足ＩＫ"].position
var posR = mesh.bones_by_name["右足ＩＫ"].position
posL.y -= ground_y_diff
posL.z -= ground_y_diff
posR.y -= ground_y_diff
posR.z -= ground_y_diff

//DEBUG_show(posL.toArray().join('\n'))

if (skin.time < 1) {
  let factor = Math.min(skin.time/1,1)
  factor = (1 - factor*factor) * Math.abs(ground_y_diff/chair_ground_y)
  let leg_stretch = 5 * factor
  let ankle_rot = MMD_SA.TEMP_q.setFromEuler(MMD_SA.TEMP_v3.set(-30*Math.PI/180*factor,0,0), "YZX")
  posL.z += leg_stretch
  posR.z += leg_stretch
  mesh.bones_by_name["左足ＩＫ"].quaternion.multiply(ankle_rot)
  mesh.bones_by_name["右足ＩＫ"].quaternion.multiply(ankle_rot)
}

System._browser.camera.poseNet.enable_IK('左腕ＩＫ', true)
System._browser.camera.poseNet.enable_IK('右腕ＩＫ', true)
  }

 ,freeze_onended: true

 ,object_click_disabled: true

 ,auto_blink: true
// ,adjust_center_view_disabled: true
 ,center_view: [0,-4,0]

 ,adjustment_per_model: {
    _default_ : {
  skin_default: {
//    "両目": { rot_add:{x:-5, y:2.5, z:0} }
    "頭": { keys:[{time:0, rot:{x:-11.3,y:0,z:0}}] }
   ,"下半身": { rot_add:{x:50, y:0, z:0} }
   ,"上半身": { rot_add:{x:10, y:0, z:0} }
   ,"上半身2": { rot_add:{x:-10, y:0, z:0} }
//,'左手捩': { keys:[{time:0, rot:{x:0,y:0,z:0}}] },'右手捩': { keys:[{time:0, rot:{x:0,y:0,z:0}}] }
  }
 ,morph_default:{
//    "笑い": { weight:0.2 }
  }
    }
  }

 ,get look_at_screen_parent_rotation() { return THREE.MMD.getModels()[0].mesh.quaternion; }
,look_at_screen_bone_list: [
  { name:"首", weight_screen:0.5, weight_screen_y:0.25, weight_motion:1 }
 ,{ name:"頭", weight_screen:0.5, weight_screen_y:0.25, weight_motion:1 }
 ,{ name:"上半身2", weight_screen:0.75, weight_screen_x:0,weight_screen_y:1, weight_motion:1 }
]
      };
    })()

   ,"walk_A34_f0-42": {
motion_tracking_enabled: true, motion_tracking_upper_body_only: true
    }

   ,"stand_simple": {
  center_view_enforced: true

 ,_cover_undies: false

 ,trackball_camera_limit: { "min": { length:8 } }

 ,motion_tracking_enabled: true
 ,get motion_tracking_upper_body_only() { return this.center_view_enforced; }

 ,onstart: function () {
let model = THREE.MMD.getModels()[0]
let bones_by_name = model.mesh.bones_by_name
let head = MMD_SA._head_pos;

this.center_view = (this.center_view_enforced) ? [0, (head.y)*1.025-11.4, -20*MMD_SA_options.Dungeon_options.camera_position_z_sign] : [0,0,0];
  }

 ,object_click_disabled: true

 ,IK_disabled: { test:(name)=>false, _IK_name_list:[] }
//(name.indexOf('腕ＩＫ') != -1) && System._browser.camera.poseNet.IK_disabled

// ,get look_at_screen() { return !System._browser.camera.facemesh.enabled; }
    }

   ,"i-shaped_balance_TDA_f0-50": {
  freeze_onended: true

 ,motion_tracking_enabled: true, motion_tracking_upper_body_only: true

 ,adjustment_per_model: {
    _default_ : {
  skin_default: {
    "センター": (function () {
var scale
function get_scale() {
// 10.56958
  if (!scale) {
    let model = THREE.MMD.getModels()[0]
    let bones_by_name = model.mesh.bones_by_name
    let leg_length = MMD_SA._v3a.fromArray(bones_by_name["左足"].pmxBone.origin).distanceTo(MMD_SA._v3b.fromArray(bones_by_name["左足ＩＫ"].pmxBone.origin));
    scale = leg_length/10.56958
  }
  return scale;
}
return { keys_mod: [{ frame:50, pos:{ get x() { return 2.53*get_scale(); }, get y() { return 4.78*get_scale(); }, z:0.79 } }] };
    })()

   ,"左腕": { keys_mod: [{ frame:50, rot:{ x:8.3, y:23.7-15, z:-33.2-10 } }] }
   ,"右腕": { keys_mod: [{ frame:50, rot:{ x:8.0-3, y:2.3, z:79.6 } }] }
   ,"cover_undies": {
      "左腕": { rot:{x:-19.3, y:26.9, z:-20.6} }
     ,"左ひじ": { rot:{x:19.5+10, y:14.5, z:90.3-15} }

     ,"右腕": { rot:{x:23.1, y:-2.2, z:-66.2} }
     ,"右ひじ": { rot:{x:-1.5, y:27.8, z:-61.9} }
     ,"右手首": { rot:{x:-18.0, y:21.3, z:-23.8} }
    }
  }
    }
  }

    }

   ,"leg_hold": (function () {
      var _pos_, _rot_, _zoom_scale_;
      var cam_pos, cam_rot, cam_speed, cam_speed_rot;
      var model_speed;
      var timestamp;
      var _ground_plane_visible;
      var orgy_level, orgy_cooling, orgy_spasm;
      var orgy_morph = [
  {name:"あ",weight:0}, {name:"う",weight:0}
 ,{name:"笑い",weight:0.5}, {name:"びっくり",weight:0.5}
 ,{name:"あ２",alt:[{name:"あ",weight:1}],weight:0.75}, {name:"困る",weight:1}, {name:"涙",weight:1}, {name:"はぁと",alt:[{name:"瞳小"}],weight:1}, {name:"ぺろっ",weight:1}
      ];

      window.addEventListener("jThree_ready", function () {
cam_pos = new THREE.Vector3()
cam_rot = new THREE.Vector3()
cam_speed = new THREE.Vector3()
cam_speed_rot = new THREE.Vector3()
model_speed = new THREE.Vector3()
      });

      return {
  freeze_onended: true
// ,look_at_screen: false
 ,initial_physics_reset: true

 ,_cover_undies: false
// ,object_click_disabled: true

 ,look_at_screen_bone_list: [
    { name:"両目", weight_screen:0.3, weight_motion:1 }
  ]

 ,onstart: function () {
var model = THREE.MMD.getModels()[0].mesh
_pos_ = model.position.clone()
_rot_ = model.quaternion.clone()

_zoom_scale_ = MMD_SA.WebXR.zoom_scale
MMD_SA.WebXR.zoom_scale = 1

var camera = MMD_SA._trackball_camera.object
cam_pos.copy(camera.position)
cam_rot.setEulerFromQuaternion(MMD_SA.TEMP_q.setFromRotationMatrix(camera.matrixWorld),"YZX")
cam_speed.set(0,0,0)
cam_speed_rot.set(0,0,0)
model_speed.set(0,0,0)
timestamp = RAF_timestamp

_ground_plane_visible = MMD_SA.WebXR.ground_plane.visible

// lower the ground to prevent unexpected collisions due to .matrixWorld_physics_scale
jThree.MMD.groundLevel -= 10

orgy_level = 0
orgy_cooling = 0
orgy_spasm = 0
  }

 ,onended: function (loop_end) {
var model = THREE.MMD.getModels()[0].mesh
model.position.copy(_pos_)
model.quaternion.copy(_rot_)

MMD_SA.WebXR.zoom_scale = _zoom_scale_

MMD_SA.WebXR.ground_plane.visible = _ground_plane_visible

jThree.MMD.groundLevel = 0

MMD_SA_options.Dungeon.character.hp_add(9999)
  }

 ,onplaying: function () {
MMD_SA.WebXR.ground_plane.visible = false

var model = THREE.MMD.getModels()[0].mesh
var camera = MMD_SA._trackball_camera.object
model.position.copy(camera.position)
//model.position.y -= 11.5

var time_diff = (RAF_timestamp - timestamp) / 1000
var speed_ratio = Math.min(time_diff/0.2, 1)

var rot = MMD_SA.TEMP_v3.setEulerFromQuaternion(MMD_SA.TEMP_q.setFromRotationMatrix(camera.matrixWorld),"YZX")
var rot_speed = MMD_SA._v3a.copy(rot).sub(cam_rot).multiplyScalar(1/time_diff)
cam_speed_rot.multiplyScalar(1-speed_ratio).add(rot_speed.multiplyScalar(speed_ratio))

cam_rot.copy(rot)

rot.z = 0
rot.x = (rot.x < -0.9) ? (rot.x+0.9) : 0
//var rot_y = rot.y
//rot.y = 0
model.quaternion.setFromEuler(rot,"YZX")

var speed = MMD_SA.TEMP_v3.copy(camera.position).sub(cam_pos).multiplyScalar(1/time_diff)
cam_speed.multiplyScalar(1-speed_ratio)
cam_speed.add(speed.multiplyScalar(speed_ratio))
model_speed.copy(cam_speed).applyQuaternion(MMD_SA.TEMP_q.copy(model.quaternion).conjugate())

//model_speed.set(0,0,0)
cam_speed_rot.y = cam_speed_rot.y % (Math.PI*2);
if (cam_speed_rot.y > Math.PI)
  cam_speed_rot.y -= Math.PI*2
else if (cam_speed_rot.y < -Math.PI)
  cam_speed_rot.y += Math.PI*2
model_speed.x -= cam_speed_rot.y*3

//MMD_SA._custom_skin.push({ key:{ name:"全ての親", pos:[0,-11.5,0] ,rot:[0,0,0,1], interp:MMD_SA._skin_interp_default }, idx:model.bones_by_name["全ての親"]._index });
  }

 ,process_morphs: function (model, morph) {
var morph_name, _m_idx, _m;
var weight = model_speed.length()/5

var score = Math.min((Math.abs(model_speed.y)*3+Math.abs(model_speed.x)+Math.abs(model_speed.z))/20, 1)
var damage = (score > 0.5) ? -score : 0.1

MMD_SA_options.Dungeon.character.hp_add(damage, function (c) {
  var time_diff = (RAF_timestamp - timestamp) / 1000
  if (c.hp == 0) {
    orgy_cooling = 1
  }
  else {
// 10 sec to 0
    orgy_cooling = Math.max(orgy_cooling-time_diff/10, 0)
  }

  if (orgy_cooling) {
// 0.5 sec to max
    orgy_level = Math.min(orgy_level+time_diff*2, 1)
  }
  else {
    orgy_level = Math.max(orgy_level-time_diff*2, 0)
  }
  return {}
});

MMD_SA_options.auto_blink = !(orgy_level || (weight > 0.5));

if (orgy_level > 0.5) {
//DEBUG_show(orgy_level+'\n'+orgy_cooling)
  orgy_morph.forEach(function (m) {
    morph_name = m.name
    _m_idx = model.pmx.morphs_index_by_name[morph_name]
    if ((_m_idx == null) && m.alt) {
      m.alt.some(function (m2) {
        morph_name = m2.name
        _m_idx = model.pmx.morphs_index_by_name[morph_name]
        if (_m_idx != null) {
          if (m2.weight == null)
            m2.weight = m.weight
          m = m2
          return true
        }
      });
    }
    if (_m_idx != null) {
      _m = model.pmx.morphs[_m_idx]
      MMD_SA._custom_morph.push({ key:{ weight:m.weight, morph_type:_m.type, morph_index:_m_idx, override_weight:true }, idx:morph.target_index_by_name[morph_name] });
    }
   });

  return
}

weight = Math.min(weight, 1);

morph_name = "あ"
_m_idx = model.pmx.morphs_index_by_name[morph_name]
if (_m_idx != null) {
  _m = model.pmx.morphs[_m_idx]
  MMD_SA._custom_morph.push({ key:{ weight:0.1+weight*0.9, morph_type:_m.type, morph_index:_m_idx, override_weight:true }, idx:morph.target_index_by_name[morph_name] });
}

morph_name = "笑い"
_m_idx = model.pmx.morphs_index_by_name[morph_name]
if (_m_idx != null) {
  _m = model.pmx.morphs[_m_idx]
  MMD_SA._custom_morph.push({ key:{ weight:0.2+weight*0.2, morph_type:_m.type, morph_index:_m_idx }, idx:morph.target_index_by_name[morph_name] });
}

morph_name = "困る"
_m_idx = model.pmx.morphs_index_by_name[morph_name]
if (_m_idx != null) {
  _m = model.pmx.morphs[_m_idx]
  MMD_SA._custom_morph.push({ key:{ weight:0.5+weight*0.4, morph_type:_m.type, morph_index:_m_idx }, idx:morph.target_index_by_name[morph_name] });
}

morph_name = "涙"
_m_idx = model.pmx.morphs_index_by_name[morph_name]
if (_m_idx != null) {
  _m = model.pmx.morphs[_m_idx]
  MMD_SA._custom_morph.push({ key:{ weight:(weight>0.5)?1:0, morph_type:_m.type, morph_index:_m_idx }, idx:morph.target_index_by_name[morph_name] });
}
  }

 ,process_bones: function (model, skin) {
var mesh = model.mesh

var center = mesh.bones_by_name["センター"]
center.position.x -= Math.max(Math.min(model_speed.x/10, 2),-2)
center.position.y -= Math.max(Math.min(model_speed.y/10, 2),-2)

var rot

rot = MMD_SA.TEMP_v3.set(Math.max(Math.min(model_speed.y/50-model_speed.z/100, Math.PI/4),-Math.PI/4), 0, Math.max(Math.min(model_speed.x/100, Math.PI/4),-Math.PI/4));
if (orgy_level) {
  let time_diff = (RAF_timestamp - timestamp) / 1000
  orgy_spasm = (!orgy_spasm && (Math.random() < time_diff)) ? 2 : Math.max(orgy_spasm-time_diff*10, 0)
  let _ratio = orgy_level*orgy_level *(1+((orgy_spasm)?0.1*((orgy_spasm>1)?2-orgy_spasm:orgy_spasm):0)) *Math.PI/180
  rot.x += -30 *_ratio
  rot.z +=  15 *_ratio
}
rot = MMD_SA.TEMP_q.setFromEuler(rot.multiplyScalar(0.5), "YZX");
mesh.bones_by_name["首"].quaternion.multiply(rot)
mesh.bones_by_name["頭"].quaternion.multiply(rot)

rot = MMD_SA.TEMP_q.setFromEuler(MMD_SA.TEMP_v3.set(Math.max(Math.min(model_speed.y/100, Math.PI/8),-Math.PI/8), Math.max(Math.min(model_speed.x/100, Math.PI/8),-Math.PI/8), 0), "YZX");
mesh.bones_by_name["左肩"].quaternion.multiply(rot)
mesh.bones_by_name["右肩"].quaternion.multiply(rot)

if (orgy_level > 0.5) {
  rot = MMD_SA.TEMP_q.setFromEuler(MMD_SA.TEMP_v3.set(-10*Math.PI/180,0,0), "YZX");
  mesh.bones_by_name["両目"].quaternion.multiply(rot)
}

mesh.bones_by_name["全ての親"].position.setX(0).setY(-11.5).setZ(0)

// update at the very last (which should be process_bones)
timestamp = RAF_timestamp
cam_pos.copy(MMD_SA._trackball_camera.object.position)

//DEBUG_show(model_speed.toArray().join('\n'))
  }

 ,adjustment_per_model: {
    _default_ : {
  morph_default: {
    "涙": { weight:0 }
   ,"あ２": { weight:0 }
   ,"はぁと": { weight:0 }
   ,"ぺろっ": { weight:0 }
   ,"びっくり": { weight:0 }
  }
    }
  }


      };
    })()

  }

 ,custom_action: [
  "cover_undies"
 ,"kissing"
  ]

 ,use_CircularSpectrum: true

 ,look_at_screen: true

// ,center_view: [0,0,20]//[0,5,0]
// ,camera_position: [10,20,20]

// ,light_position: [50,50,50]

 ,edgeScale: 0.75

 ,model_para: {
    "Alicia_solid.pmx": {
      "MME": {
"self_overlay":{"enabled":true,"opacity":0.5,"color_adjust":[1.5,0.5,0.75],"brightness":0.8},
"HDR":{"enabled":true,"opacity":0.2},
//"serious_shader":{"enabled":true,"shadow_opacity":0.3},
"SAO":{"disabled_by_material":[]}
      },
      "material_para": {
"_default_": { "transparent":true }
      },
      "facemesh_morph" : {
"mouth_narrow": { "name":"つ", "weight":0.5 }
      },
      "skin_default": {
"両目": { "rot_scale":3 }
      },
      "icon_path": "icon_v01.jpg"
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
 ,onstart: (()=>{
    var initialized;
    function cancel_intro() {
if (initialized) return;
initialized = true;

if (MMD_SA_options.Dungeon.event_mode) return;

var msg_group = MMD_SA.SpeechBubble.msg_group
var group_name_current = msg_group.group_name_current
if (group_name_current) {
  delete msg_group.group_by_name[group_name_current]
  msg_group.group_name_current = ""
}

MMD_SA.SpeechBubble.hide();
    }

    return ()=>{
MMD_SA.SpeechBubble.message(0, "Welcome to XR Animator~!", 3*1000, {group_index:0, group:{name:"onstart", loop:2}});
MMD_SA.SpeechBubble.message(0, "Drag the mouse to rotate the camera. Press and hold Ctrl key to pan.", 4*1000, {group:{name:"onstart"}});
MMD_SA.SpeechBubble.message(0, "Enable motion capture to control the avatar with your body!", 4*1000, {group:{name:"onstart"}});
MMD_SA.SpeechBubble.message(0, "Use your webcam, or drop a local pic/video instead.", 4*1000, {no_word_break:true, group:{name:"onstart"}});
MMD_SA.SpeechBubble.message(0, "Drop a VMD/FBX motion, and animate your avatar!", 4*1000, {group:{name:"onstart"}});
MMD_SA.SpeechBubble.message(0, "You can enable AR mode if you are on an Android mobile!", 4*1000, {group:{name:"onstart"}});

document.body.addEventListener('drop', cancel_intro, {once:true});
document.addEventListener('dblclick', cancel_intro, {once:true});
document.addEventListener('keydown', cancel_intro, {once:true});

window.addEventListener('SA_Dungeon_onstart', ()=>{
  System._browser.on_animation_update.add(()=>{
    window.addEventListener('MMDCameraReset_after', cancel_intro, {once:true});
  },1,0);
});
    };
  })()

 ,WebXR: {
    model_scale: (is_mobile) ? 0.9 : 1,
    AR: {
      dom_overlay: { root:"Lbody" }

     ,onwallhit: function (e) {
var model_mesh = THREE.MMD.getModels()[0].mesh
if (!model_mesh.visible) {
  DEBUG_show("(Place the model on the ground first.)", 3)
  return true
}

this._groundhit = false
this._wallhit = true
this._skip_charging_count = 10

var adult_mode = this._adult_mode
e.detail.result.update_obj = function (model_mesh, first_call) {
  var xr = MMD_SA.WebXR
  var axis = xr.hitMatrix_anchor.decomposed[3]

  model_mesh.quaternion.setFromEuler(MMD_SA.TEMP_v3.set(0,Math.atan2(axis.x,axis.z),0))
  MMD_SA_options.mesh_obj_by_id["CircularSpectrumMESH"] && MMD_SA_options.mesh_obj_by_id["CircularSpectrumMESH"]._obj.rotation.setEulerFromQuaternion(model_mesh.quaternion)

  if (adult_mode) {
// needed for .process_bones()
    xr.hitMatrix_anchor._hit_wall_y_ = xr.hitMatrix_anchor.decomposed[0].y;

    if (first_call) {
      MMD_SA_options.motion_shuffle_list_default = [MMD_SA_options.motion_index_by_name["壁穴_モデルモーション_loop"]]
      MMD_SA._force_motion_shuffle = true
    }
  }
  else {
// anchor offset away from the wall (x,z)
    xr.hitMatrix_anchor.decomposed[0].add(axis.clone().multiplyScalar(0.25).setY(0));
  }

// save some headache and always put the reference anchor on the ground
  xr.hitMatrix_anchor.decomposed[0].y = xr.hit_ground_y;
};
      }

     ,ongroundhit: function (e) {
this._groundhit = true
this._wallhit = false
this._skip_charging_count = 10

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

 ,user_camera: {
    enabled: true,
//    mirror_3D: 0,
    pixel_limit: {
//      _default_: [1280,720],//[1920,1080],//
      fixed: !is_mobile,
//      facemesh : [640,360],
      facemesh_bb_ratio: (is_mobile) ? 1 : 0.5,
    },
    display: (is_mobile) ? {} : {
//floating: true,
//floating_auto: false,
//floating_scale: 1,
video:{
//  hidden:true,
//  hidden_on_webcam: true,
  scale:0.4, top:-0.5,
//scale:0.4*2*1,top:0,left:-3,
},
wireframe:{
//  hidden:true,
//  align_with_video:true,
  top:0.5,
//top:0,left:3,
}
    },
    preference: {
      label: /OBS/
    },
    ML_models: {
      enabled: true,
//      use_holistic: false,
//      worker_disabled: true,
//      debug_hidden: true,
      facemesh: {
//        use_mediapipe: true
      },
      pose: {
//        estimate_z_depth: false,
//        auto_grounding: true,
//        use_armIK: true,
//        use_legIK: true,
//        position_offset: {x:-7.5,y:0,z:0},
        events: {
          enabled:  ()=>{ MMD_SA.WebXR.ground_plane.visible=System._browser.camera.poseNet.ground_plane_visible; },
          disabled: ()=>{ MMD_SA.WebXR.ground_plane.visible=System._browser.camera.poseNet.ground_plane_visible; },
        }
      }
    }
  }

 ,light_position: [0,1,0]

 ,use_shadowMap: true
 ,shadow_darkness: 0.1
 ,ground_shadow_only: true

 ,make_armIK: {
  }

 ,SpeechBubble_branch: {
//    confirm_keydown:true,
    RE: /^(\d)\.\s/
  }

 ,_SpeechBubble_scale_: 0
 ,get SpeechBubble_scale() { return this._SpeechBubble_scale_ || (MMD_SA.THREEX.enabled && (window.innerHeight * window.devicePixelRatio < 720)) ? 2 : 1.5; }
 ,set SpeechBubble_scale(v) { this._SpeechBubble_scale_ = v; }

 ,use_THREEX: true
 ,THREEX_options: {
    enabled_by_default: true,

//    use_MMD: true,
    use_MMDAnimationHelper: true,

//    use_VRM1: false,

    use_OutlineEffect: true,

//    model_path: 'C:\\Users\\user\\Downloads\\EL-Pr213-BosaHair\\EL-Pr213-BosaHair\\ボサ髪_v01.pmx'//'C:\\Users\\user\\Downloads\\iroha+kazama+v1.0\\iroha kazama v1.0\\model\\iroha kazama ver1.0.pmx'//System.Gadget.path + '/TEMP/DEMO/models/AvatarSample_A.vrm'
  }

// END
};

(function () {
  if (browser_native_mode && !webkit_window) {
    MMD_SA_options.width  = screen.width
    MMD_SA_options.height = screen.height
  }
  else {
    MMD_SA_options.width  = 960
    MMD_SA_options.height = 540
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

  if (!webkit_electron_mode)
    self.SA_wallpaper_src = System.Gadget.path + "/images/wood_wallpaper_flip-h.jpg";

  MMD_SA_options.WebXR.AR._adult_mode = !!System._browser.url_search_params.adult_mode || webkit_electron_mode;


// roomba
  var _s_ = 1;

  MMD_SA_options.motion_para["gura_sit_01"] = { onended: function () { MMD_SA._no_fading=true; }
// ,model_index_list: [0,2,3,4]
// ,model_name_RegExp: /Gura/
 ,adjust_center_view_disabled:false
 ,center_view:[0,-1.25,12.5]

 ,motion_tracking_enabled: true
 ,motion_tracking_upper_body_only: true
 ,adjustment_per_model: {
    _default_ : {
  skin_default: {
    "全ての親": { pos_add:{x:0, y:5.5*_s_, z:0} },
    "Start_Tail": { keys:[{ pos:{x:0, y:0.75*_s_, z:0}, rot:{x:-80-10, y:0, z:0} }] },
"センター": { pos_add:{x:0, y:-0.5*_s_, z:0.25*_s_} }
  },
    },
    "gura_xmas.pmx" : {
  skin_default: {
    "全ての親": { pos_add:{x:0, y:(5.5-0.5+5)*_s_, z:(0.25+1)*_s_} },
"左足ＩＫ":{ keys:[{ pos:{x:0, y:0, z:0} }] },
"右足ＩＫ":{ keys:[{ pos:{x:0, y:0, z:0} }] },
"Tail": { keys:[{ rot:{x:-30, y:0, z:0} }] },
  },
    }
  }
 ,skin_filter: { test: (name)=>(!/_tail/i.test(name)) }
 ,reset_rigid_body_physics_step: 20
 ,process_bones: function (model, skin) {
    var mesh = model.mesh
    if (!mesh._reset_rigid_body_physics_) return

    var bone = mesh.bones_by_name
    if (bone['スカート_0_0']) {
      bone['スカート_0_0'].quaternion.setFromEuler(MMD_SA.TEMP_v3.set(-72,  0,  0).multiplyScalar(Math.PI/180), 'YXZ')
      bone['スカート_0_7'].quaternion.setFromEuler(MMD_SA.TEMP_v3.set(-75, 45,-90).multiplyScalar(Math.PI/180), 'YXZ')
      bone['スカート_0_6'].quaternion.setFromEuler(MMD_SA.TEMP_v3.set(  0,  0,-30).multiplyScalar(Math.PI/180), 'YXZ')
      bone['スカート_0_1'].quaternion.setFromEuler(MMD_SA.TEMP_v3.set(-75,-45, 90).multiplyScalar(Math.PI/180), 'YXZ')
      bone['スカート_0_2'].quaternion.setFromEuler(MMD_SA.TEMP_v3.set(  0,  0, 30).multiplyScalar(Math.PI/180), 'YXZ')
//      bone['スカート_0_3'].quaternion.setFromEuler(MMD_SA.TEMP_v3.set( 50,  0,  0).multiplyScalar(Math.PI/180), 'YXZ')
//      bone['スカート_0_4'].quaternion.setFromEuler(MMD_SA.TEMP_v3.set( 70,  0,  0).multiplyScalar(Math.PI/180), 'YXZ')
//      bone['スカート_0_5'].quaternion.setFromEuler(MMD_SA.TEMP_v3.set( 50,  0,  0).multiplyScalar(Math.PI/180), 'YXZ')
    }

    var rot_hair = MMD_SA.TEMP_q.setFromEuler(MMD_SA.TEMP_v3.set(45,  0,  0).multiplyScalar(Math.PI/180))
    bone['中髪後２'] && bone['中髪後２'].quaternion.copy(rot_hair);
    bone['左髪後２'] && bone['左髪後２'].quaternion.copy(rot_hair);
    bone['右髪後２'] && bone['右髪後２'].quaternion.copy(rot_hair);
  }
/*
 ,onplaying: function (model_index) {
var model = THREE.MMD.getModels()[model_index]

var rot_y = Math.PI/4//(rot_y + Math.sign(pos_speed) * 60*Math.PI/180*RAF_timestamp_delta/1000) % (Math.PI*2)
model.mesh.quaternion.copy(MMD_SA.TEMP_q.setFromEuler(MMD_SA.TEMP_v3.set(0, rot_y, 0)));
  }
*/
  };

  window.addEventListener('MMDStarted', ()=>{
    if (!/_MissBigHK_\-ghost_buruma2/.test(MMD_SA_options.model_path)) return;

    System._browser.on_animation_update.add((function () {
      var canvas = document.createElement('canvas');
      canvas.width  = 512;
      canvas.height = 256;

      var context = canvas.getContext('2d');
      context.fillStyle = 'black';
      context.font = 'bold 60px "Segoe Print"';
      context.textBaseline = 'top';

      var tex = THREE.MMD.getModels()[0].mesh.material.materials.find(m=>m.name=='sweater+').map;

      var canvas_content = [];

      return function () {
var content = [];
if (System._browser.motion_control.ready) {
  const Key = System._browser.motion_control.Key;
  const key_pressed = System._browser.motion_control.key_pressed;

  let txt = '';
  if (key_pressed[Key.W]) {
    if (key_pressed[Key.A])
      txt += '⬉'
    else if (key_pressed[Key.D])
      txt += '⬈'
    else
      txt += '⬆'
  }
  else if (key_pressed[Key.S]) {
    if (key_pressed[Key.A])
      txt += '⬋'
    else if (key_pressed[Key.D])
      txt += '⬊'
    else
      txt += '⬇'
  }
  else {
    if (key_pressed[Key.A])
      txt += '⬅'
    else if (key_pressed[Key.D])
      txt += '⮕'
  }

  if (txt) txt = '🎮' + txt;
  content.push(txt);
}
else {
  content.push('#XRAnimator');//'⬆️🎯🏃Ⓐ⌨️🎮🎥');
}

var content_txt = content.join()
if (canvas_content.join() == content_txt) return;
canvas_content = content;

context.clearRect(0,0,512,256);

if (content_txt) {
  let w_max = 0, h_max = 60;
  for (let i = 0, i_length = content.length; i < i_length; i++) {
    const m = context.measureText(content[i])
    if (w_max < m.width)
      w_max = m.width
  }

  let y = (256 - content.length*(h_max+10)) / 2;
  for (let i = 0, i_length = content.length; i < i_length; i++) {
    context.fillText(content[i], (512-w_max)/2, y + i*(h_max+10))
  }
}

tex.image = canvas;
tex.needsUpdate = true;
      };
    })(), 0,0,-1)
  });

  System._browser.video_capture.trigger_on_startup_motion = true;


// dungeon options START
MMD_SA_options.Dungeon_options = {

  transparent_background: true

 ,use_octree: true

 ,use_PC_click_reaction_default: true

 ,joystick_disabled: true

 ,use_point_light: false

 ,shadow_camera_width: 32

 ,grid_material_list: [
/*
    {
  map: System.Gadget.path + "/images/_dungeon/tex/3dtextures.me/Sand 002/Sand 002_COLOR_AO.jpg"
 ,normalMap: System.Gadget.path + "/images/_dungeon/tex/3dtextures.me/Sand 002/Sand 002_NRM_c80.jpg"
 ,specularMap: System.Gadget.path + "/images/_dungeon/tex/3dtextures.me/Sand 002/Sand 002_SPEC_c80.jpg"
 ,geo_by_lvl: [[1,1]]//[[1,1],[16,16],[32,32],[128,128]]//
 ,distance_by_lvl: []//[1,2,4]//
 ,repeat_base: [64,64]
 ,instanced_drawing_by_lvl: [99]
    }
*/
  ]

 ,object_base_list: [
/*
    {
  construction: {
    build: function () {
var that = this;
window.addEventListener("GOML_ready", function () {
  let geometry = new THREE.RingGeometry(19.5, 20.5, 24, 1);
  geometry.applyMatrix(new THREE.Matrix4().makeRotationX(THREE.Math.degToRad(-90)));
  let material = new THREE.MeshBasicMaterial({ color:0xDC143C });
  let circle_2m = new THREE.Mesh(geometry, material);

  MMD_SA.scene.add(circle_2m);

  circle_2m.visible = false;

  that.mesh_obj = { id:"circle_2m", _obj:circle_2m }
  MMD_SA_options.mesh_obj.push(that.mesh_obj)
});
    }
  }
 ,placement: {
    position: {x:0, y:0.1, z:0}
   ,hidden: true
  }
 ,no_collision: true
    }
*/
// 0
    {
  path: Settings.f_path + '/assets/assets.zip#/model/baseball/baseball_v01.x'
// ,is_dummy: true
// ,construction:{castShadow:true}
 ,placement: {
    grid_id_filter: function () {
function condition(x_object, model_index) {
  var skin0 = (model_index == 0) && THREE.MMD.getModels()[0].skin
  if (skin0 && /baseball_throw/.test(MMD_SA.motion[skin0._motion_index].filename)) {
    Object.assign(this, (skin0.time < 140/30) ? this._baseball_throw : this._null);
  }
  else {
    x_object._obj_proxy.visible = false
    return false
  }

  return true
}

return [
  {
    para:{
      parent_bone: {
  model_index: 0
 ,condition: condition
 ,_null: { name:"" }
 ,_baseball_throw: { name:"右手首", position:{x:-0.5,y:-1,z:0} }
      }
    }
  }
];
    }
   ,scale: 10
  }
 ,no_collision: true
    },
/*
// roomba
// 1
    {
  path: 'F:\\Programs Portable\\node-webkit\\_TEMP\\gura_x_roomba\\data\\roomba\\roomba_v01.x'
// ,is_dummy: true
// ,construction:{castShadow:true}
 ,placement: {
    grid_id_filter: function () {
function condition(x_object, model_index) {
  var skin0 = (model_index == 0) && THREE.MMD.getModels()[0].skin
  if (skin0 && /gura_sit/.test(MMD_SA.motion[skin0._motion_index].filename)) {
    Object.assign(this, this._roomba);
  }
  else {
    x_object._obj_proxy.visible = false
    return false
  }

  return true
}

return [
  {
    para:{
      parent_bone: {
  model_index: 0
 ,condition: condition
//{ name:'センター', position:(/gura_xmas/.test(MMD_SA_options.model_path))?{x:0, y:-6.7*_s_, z:1.95*_s_}:{x:0, y:-2.7*_s_, z:0.95*_s_}, rotation:{x:-10, y:0, z:0} }
 ,_roomba: { name:'センター', position:(/gura_xmas/.test(MMD_SA_options.model_path))?{x:0, y:-6.7*_s_, z:1.95*_s_}:{x:0, y:-2.7*_s_, z:0.95*_s_}, rotation:{x:-10, y:0, z:0} }
      }
    }
  }
];
    }
   ,scale: 22*_s_ *(MMD_SA_options.WebXR.model_scale || 0.9)
  }
 ,no_collision: true
    }
*/
  ]

 ,item_base: {
    "reticle" : {
  icon_path: Settings.f_path + '/assets/assets.zip#/icon/yellow-target_64x64.png'
 ,info_short: "AR reticle"

 ,is_base_inventory: is_mobile
// NOTE: use undefined for index_default ((null >= 0) is true...)
 ,index_default: undefined
// ,get index_default() { return (is_mobile) ? undefined : MMD_SA_options.Dungeon.inventory.max_base+1; }

 ,stock_default: (is_mobile) ? 1 : 0
 ,stock_max: 1
 ,action: {
    func: function (item) {
if (!MMD_SA.WebXR.session) {
//  DEBUG_show("(AR mode only)", 3); return true;
  MMD_SA_options.Dungeon.run_event("_ENTER_AR_",0)
}
else {
//SA_AR_dblclick
  const result = { return_value:null };
  window.dispatchEvent(new CustomEvent("SA_AR_dblclick", { detail:{ e:{}, is_item:true, result:result } }));
}
    }
  }
    }

   ,"pose": (function () {
      function morph_event(e) {
var mf = morph_form[morph_form_index]
if (mf) {
  let model = e.detail.model
  for (const morph_name in mf) {
    let _m_idx = model.pmx.morphs_index_by_name[morph_name]
    let _m = model.pmx.morphs[_m_idx]
    MMD_SA._custom_morph.push({ key:{ weight:mf[morph_name], morph_type:_m.type, morph_index:_m_idx }, idx:model.morph.target_index_by_name[morph_name] })
  }
}
//DEBUG_show(Date.now()+":"+MMD_SA._custom_morph.length)
      }

      function change_motion(motion_index_absolute) {
if (!MMD_SA_options.Dungeon.event_mode) {
  MMD_SA_options.Dungeon.run_event("_POSE_",0)
  return
}
else if ((motion_index_absolute != null) && (MMD_SA_options.Dungeon._event_active.id != "_POSE_"))
  return true

var model_mesh = THREE.MMD.getModels()[0].mesh
if (!model_mesh.visible)
  return true
//DEBUG_show(MMD_SA.MMD.motionManager.filename)

if (1) {//MMD_SA_options.motion_shuffle_list_default && (MMD_SA_options.motion_shuffle_list_default.indexOf(MMD_SA.MMD.motionManager._index) != -1)) {
  if (!morph_event_registered) {
    morph_event_registered = true
    window.addEventListener("SA_MMD_model0_process_morphs", morph_event)
  }

  let motion_list_index = (System._browser.camera.poseNet.enabled) ? 1 : 0

  let motion_list = _motion_list[motion_list_index]
  if (motion_list_index != _motion_list_index) {
    motion_index = ((motion_list_index == 0) && (_motion_list_index == -1)) ? 0 : -1
  }
  _motion_list_index = motion_list_index

  if (motion_index_absolute != null)
    motion_index = motion_index_absolute
  else
    motion_index++

  if (motion_index >= motion_list.length) {
    motion_index = 0
    if (++morph_form_index == morph_form.length) morph_form_index = 0;
  }

  let motion_name = motion_list[motion_index].name
  motion_list[motion_index].action && motion_list[motion_index].action(motion_name)

  MMD_SA_options._motion_shuffle_list_default = [MMD_SA_options.motion_index_by_name[motion_name]]

  MMD_SA_options.motion_shuffle_list_default = MMD_SA_options._motion_shuffle_list_default.slice()
  MMD_SA._force_motion_shuffle = true

  MMD_SA_options.Dungeon_options.item_base.social_distancing && MMD_SA_options.Dungeon_options.item_base.social_distancing.reset()

  if (System._browser.camera.initialized) System._browser.on_animation_update.add(()=>{System._browser.camera._camera_reset = MMD_SA._trackball_camera.object.clone()},1,1)
}
else {
  return true
}
      }

      var morph_event_registered = false

      var morph_form = [null]
      var morph_form_index = 0

      var _motion_list_index = -1
      var _motion_list = []

      var motion_index

      window.addEventListener("MMDStarted", function () {
var mf = MMD_SA_options.model_para_obj.morph_form
if (mf) {
  morph_form = morph_form.concat(Object.values(mf))
}

_motion_list[0] = [
  {name:"standmix2_modified", info:"Stand relaxed"},

  {
    name:"stand_simple", info:"Stand simple (full-body mocap/F)",
    action: (name)=>{ MMD_SA_options.motion_para[name].center_view_enforced = false },
  },

  {
    name:"stand_simple", info:"Stand simple (upper-only mocap/U)",
    action: (name)=>{ MMD_SA_options.motion_para[name].center_view_enforced = true },
  },

  {name:"walk_A34_f0-42", info:"Model walk (U)"},
// roomba
//{name:"gura_sit_01"},

  {name:"i-shaped_balance_TDA_f0-50", info:"I-shaped balance (U)"},
  ((!MMD_SA.THREEX.enabled/* && MMD_SA_options.WebXR.AR._adult_mode*/) ? {name:"leg_hold", info:"???"} : null),
  {name:"gal_model_motion_with_legs-2_loop_v01", info:"Sit 01 (U)"},
  {name:"chair_sit01_armIK", info:"Sit 02 (U)"},
].filter(m=>m!=null);

_motion_list[1] = _motion_list[0].filter((m)=>MMD_SA_options.motion_para[m.name].motion_tracking_enabled);

MMD_SA_options.Dungeon_options.events_default["_POSE_"] = [
//0
      [
        {
          message: {
  get content() {
const index = (System._browser.camera.poseNet.enabled) ? 1 : 0;
this._has_custom_animation_ = (MMD_SA.THREEX.enabled && MMD_SA.THREEX.get_model(0).animation.has_clip) || (MMD_SA_options.motion.length > MMD_SA.motion_max_default);

const content =  _motion_list[index].map((m,i) => (i+1)+'. ' + (m.info||m.name)).slice(0,(this._has_custom_animation_)?7:8).join('\n')
+ ((this._has_custom_animation_) ? ('\n' + Math.min(_motion_list[index].length+1,8) + '. (Custom Motion: ' + (((this._animation_on_ != null) ? this._animation_on_ : (MMD_SA.THREEX.enabled && MMD_SA.THREEX.get_model(0).animation.enabled) || (THREE.MMD.getModels()[0].skin._motion_index >= MMD_SA.motion_max_default))?'ON':'OFF') + ') (U)') : '')
+ '\n' + Math.min(_motion_list[index].length+1+((this._has_custom_animation_)?1:0),9) + '. Done';
//DEBUG_show(''+this._animation_on_,0,1)
//MMD_SA_options.SpeechBubble_branch.confirm_keydown=false

System._browser.on_animation_update.add(()=>{this._animation_on_ = null},0,0);

return content;
  }
 ,bubble_index: 3
 ,get branch_list() {
const index = (System._browser.camera.poseNet.enabled) ? 1 : 0;
return _motion_list[index].map((m,i) => { return { key:i+1, event_id:{ func:()=>{change_motion(i)}, goto_event:{id:'_POSE_',branch_index:0} } }; }).slice(0,(this._has_custom_animation_)?7:8)
  .concat((this._has_custom_animation_)?[{ key:Math.min(_motion_list[index].length+1,8), event_id:{ func:()=>{
const animation = MMD_SA.THREEX.get_model(0).animation;
const MMD_animation_customized = MMD_SA_options.motion.length > MMD_SA.motion_max_default;
const MMD_animation_on = THREE.MMD.getModels()[0].skin._motion_index >= MMD_SA.motion_max_default;

let animation_on;

if (animation.has_clip && (!MMD_animation_customized || animation.enabled || MMD_animation_on)) {
  animation.enabled = !animation.enabled;
  animation_on = animation.enabled;
  if (animation_on) {
    if (MMD_animation_on) {
      animation._motion_index = MMD_SA_options._motion_shuffle_list_default[0];
      MMD_SA_options.motion_shuffle_list_default = MMD_SA_options._motion_shuffle_list_default.slice();
      MMD_SA._force_motion_shuffle = true;
    }
  }
  else {
    MMD_SA.THREEX.get_model(0).animation._motion_index = null;
  }
}
else if (MMD_animation_customized) {
  animation_on = !MMD_animation_on;
  if (!animation_on) {
    MMD_SA_options.motion_shuffle_list_default = MMD_SA_options._motion_shuffle_list_default.slice();
  }
  else {
    MMD_SA_options.motion_shuffle = [MMD_SA_options.motion.length-1];
    MMD_SA_options.motion_shuffle_list_default = null;
  }
  MMD_SA._force_motion_shuffle = true;
}

this._animation_on_ = animation_on;
  }, goto_event:{id:'_POSE_',branch_index:0} } }]:[], [{ key:Math.min(_motion_list[index].length+1+((this._has_custom_animation_)?1:0),9) }]
  );
  }
          }
        }
      ]
];

      });

      var pose = {
  icon_path: Settings.f_path + '/assets/assets.zip#/icon/tap-dance_64x64.png'
 ,info_short: "Pose"
// ,is_base_inventory: true
 ,stock_max: 1
 ,stock_default: 1

 ,action: {
    set _motion_list_index(v) { _motion_list_index = v; },
    func: function () { change_motion() }
//    ,muted: true
   ,anytime: true
  }
 ,reset: function () {
if (morph_event_registered) {
  morph_event_registered = false
  window.removeEventListener("SA_MMD_model0_process_morphs", morph_event)
}

MMD_SA_options._motion_shuffle_list_default = [MMD_SA_options.motion_index_by_name["standmix2_modified"]]
  }

 ,get info() {
let info = '';

if (System._browser.camera.ML_enabled) {
  info =
  '- The current pose '
+ ((MMD_SA.MMD.motionManager.para_SA.motion_tracking_enabled) ? 'supports ' + ((MMD_SA.MMD.motionManager.para_SA.motion_tracking_upper_body_only) ? 'upper-body' : 'full-body') + ' motion tracking.' : 'does not support motion tracking.') + '\n'
+ '- Double-click to change the pose of the avatar.\n'
+ '- Use numeric keys to pick a numbered option.';
}
else {
 info =
  '- Double-click to change the pose of the avatar.\n'
+ '- Choose a suitable pose depending on whether you want a full-body or upper-only mocap.\n'
+ '- Use numeric keys to pick a numbered option.';
}

return info;
  }
      };

      return pose;
    })()

   ,"selfie" : {
  icon_path: Settings.f_path + '/assets/assets.zip#/icon/' + ((is_mobile) ? 'selfie_64x64.png' : 'webcamera_64x64.png')
 ,info_short: (is_mobile) ? 'Selfie camera' : 'Webcam/Video input'
// ,is_base_inventory: true
 ,stock_max: 1
 ,stock_default: 1

 ,action: {
    func: function (item) {
if (MMD_SA.WebXR.session && !MMD_SA.WebXR.user_camera.initialized) {
  DEBUG_show("(You need to activate it before entering AR mode.)", 3)
  return true
}

if (!MMD_SA.WebXR.user_camera.initialized || !MMD_SA.WebXR.user_camera.visible) {
  if (MMD_SA_options.Dungeon.inventory.action_disabled)
    return true
  MMD_SA_options.Dungeon.run_event("_SELFIE_",0)
}
else {
  MMD_SA.WebXR.user_camera.start()
}
    }
   ,anytime: true
  }

 ,get info() {
var info = ''

if (System._browser.camera.visible) {
  if (System._browser.camera.ML_enabled) {
    info +=
  '- To hide the video input while keeping the motion capture on, double-click this item.';
  }
  else {
    info +=
  '- To turn the video input off, double-click this item.';
  }
}
else {
  info +=
  '- Double-click to choose a video input.\n'
+ '- You can use ' + ((is_mobile) ? 'selfie camera' : 'webcam') + ', or drop a local video/picture file.\n'
+ '- Use numeric keys to pick a numbered option.';
}

return info;
  }
    }

   ,"facemesh" : {
  icon_path: Settings.f_path + '/assets/assets.zip#/icon/motion-capture_64x64.png'
 ,info_short: "Motion capture"
// ,is_base_inventory: true
 ,stock_max: 1
 ,stock_default: 1

 ,action: {
    func: function (item) {
if (MMD_SA.WebXR.user_camera.bodyPix.enabled) {
  DEBUG_show("(You can't enable motion capture and Selfie Segmentation AI at the same time.)", 5)
  return true
}

if (System._browser.camera.motion_recorder.speed) {
  System._browser.camera.motion_recorder.speed = 0
}
else if (!MMD_SA.WebXR.user_camera.ML_enabled) {
  MMD_SA_options.Dungeon.run_event("_FACEMESH_",0)
}
else  {
  MMD_SA_options.Dungeon.run_event("_FACEMESH_OPTIONS_",0)
}
    }
//   ,anytime: true
  }

 ,get info() {
var info = ''

if (System._browser.camera._info) {
  info += System._browser.camera._info;
}
else if (System._browser.camera.motion_recorder.speed) {
   info +=
  '- Double-click to stop motion recording.';
}
else if (System._browser.camera.ML_enabled) {
  if (!System._browser.camera.visible) {
    info +=
  '- To choose a video input, double-click the "Selfie camera" item. You can use a webcam, or drop a local video/picture file.\n';
  }
    info +=
  '- To record motion while capturing, change options or turn it off, double-click this item.';
}
else {
    info +=
  '- Double-click to enable motion capture to control the avatar.\n'
+ '- You can track your face, full body, or something in between.\n'
+ '- Use numeric keys to pick a numbered option.';
}

return info;
  }

//'123 \\A 123 \\A 789 \\A 789 \\A 789'
/*
 ,onmouseover: function (e, index) {
var SB = MMD_SA.SpeechBubble.list[1]
SB.message(0, 'Enable motion capture to control the avatar with your body.', 4*1000, {group_index:0, group:{name:"motion_capture", loop:1}})
SB.message(0, 'You can track your face, ' + ((System._browser.camera.poseNet.use_holistic) ? 'or full body (Holistic).' : 'full body, or something in between.'), 4*1000, {group:{name:"motion_capture"}})
  }
// ,onmouseout: function (e) {}
*/
    }

   ,"baseball" : (function () {
      var baseball_started;

      var v3a, v3b;
      window.addEventListener("jThree_ready", function () {
v3a = new THREE.Vector3()
v3b = new THREE.Vector3()
      });

      var baseball = {
  icon_path: Settings.f_path + '/assets/assets.zip#/icon/baseball_64x64.png'
 ,info_short: "Baseball catcher"
// ,is_base_inventory: true

 ,index_default: undefined
// ,get index_default() { return (is_mobile) ? undefined : MMD_SA_options.Dungeon.inventory.max_base+1; }

 ,stock_max: 1
 ,stock_default: 1

 ,action: {
    func: function (item) {
var model_mesh = THREE.MMD.getModels()[0].mesh
if (!model_mesh.visible)
  return true

var d = MMD_SA_options.Dungeon
if (d.event_mode && !baseball_started)
  return true

if (baseball_started) {
  item.reset()
  DEBUG_show("Baseball catcher:OFF", 2)

  return false
}
//DEBUG_show(MMD_SA.MMD.motionManager.filename)

if (!/standmix2_modified/.test(MMD_SA.MMD.motionManager.filename))
  return true
if (MMD_SA_options.Dungeon_options.item_base.social_distancing._started)
  return

baseball_started = true

d._states.event_mode_locked = true

DEBUG_show("Baseball catcher:ON", 2)

this._ball_para = null
this._distance_check()
    }
   ,anytime: true

   ,_distance: function () {
return v3a.copy(MMD_SA.camera_position).distanceTo(v3b.copy(THREE.MMD.getModels()[0].mesh.position))/10// / MMD_SA.WebXR.zoom_scale;
    }

   ,_distance_check: function () {
this._ball_para = null

var dis = this._distance()

if (dis < 5) {
  if (MMD_SA_options._motion_shuffle_list_default[0] == MMD_SA_options.motion_index_by_name["emote-mod_がっかり1"])
    return true
  MMD_SA_options._motion_shuffle_list_default = [MMD_SA_options.motion_index_by_name["emote-mod_がっかり1"], MMD_SA_options.motion_index_by_name["emote-mod_がっかり2"], MMD_SA_options.motion_index_by_name["emote-mod_肩をすくめる1"], MMD_SA_options.motion_index_by_name["emote-mod_肩をすくめる2"]]
}
else {
  let r = MMD_SA.face_camera(MMD_SA._head_pos, THREE.MMD.getModels()[0].mesh.quaternion.clone().conjugate(), true)
//DEBUG_show(r.x+'\n'+r.y)
  if ((Math.abs(r.x) > Math.PI/3) || (Math.abs(r.y) > Math.PI/3)) {
    if (MMD_SA_options._motion_shuffle_list_default[0] == MMD_SA_options.motion_index_by_name["emote-mod_すねる1"])
      return true
    MMD_SA_options._motion_shuffle_list_default = [MMD_SA_options.motion_index_by_name["emote-mod_すねる1"], MMD_SA_options.motion_index_by_name["emote-mod_すねる2"], MMD_SA_options.motion_index_by_name["emote-mod_よろめく1"], MMD_SA_options.motion_index_by_name["emote-mod_よろめく2"]]
  }
  else {
    MMD_SA_options._motion_shuffle_list_default = [MMD_SA_options.motion_index_by_name["baseball_throw"]]
  }
}

MMD_SA_options.motion_shuffle_list_default = MMD_SA_options._motion_shuffle_list_default.slice()
MMD_SA._force_motion_shuffle = true
    }

   ,_ball_fly: function () {
var mesh = THREE.MMD.getModels()[0].mesh
var obj = MMD_SA_options.Dungeon.object_base_list[0].object_list[0]._obj

if (!this._ball_para) {
  let pos_ini = obj.position.clone()
  let pos_end = MMD_SA._trackball_camera.object.position.clone()

  let dis = pos_ini.distanceTo(pos_end)
  let f = Math.max(dis/100,1)
  let velocity = pos_end.clone().sub(pos_ini).multiplyScalar(1/f)

  let rot_ini = MMD_SA._v3a.set((Math.random()-0.5)*Math.PI/20/f, (Math.random()-0.5)*Math.PI/20/f, 0)
  let rot_end = MMD_SA._v3b.set((Math.random()-0.5)*Math.PI/10/f, (Math.random()-0.5)*Math.PI/10/f, 0)
//rot_ini.set(0,0,0);rot_end.set(0,0,0);

  this._ball_para = {
    pos_ini:pos_ini,
    pos_end:pos_end,
    velocity:velocity,
    rot_self: rot_end.clone(),
    rot_ini:new THREE.Quaternion().setFromEuler(rot_ini),
    rot_end:new THREE.Quaternion().setFromEuler(rot_end.add(rot_ini)),

    timestamp_ini:RAF_timestamp,
    timestamp:RAF_timestamp,
  };
}

var time_diff = (RAF_timestamp - this._ball_para.timestamp) / 1000
this._ball_para.timestamp = RAF_timestamp

var time = (RAF_timestamp - this._ball_para.timestamp_ini) / 1000

var v = MMD_SA._v3b.copy(this._ball_para.velocity).multiplyScalar(time_diff).applyQuaternion(MMD_SA.TEMP_q.copy(this._ball_para.rot_ini).slerp(this._ball_para.rot_end, Math.pow(Math.min(time, 1), 2)))
obj.position.add(v)
obj.quaternion.copy(MMD_SA.TEMP_q.setFromEuler(MMD_SA.TEMP_v3.copy(this._ball_para.rot_self).multiplyScalar(time*50)))

obj.matrixAutoUpdate = false
obj.updateMatrix()

var c_pos = this._ball_para.pos_ini
var c_to_camera = c_pos.distanceTo(MMD_SA._trackball_camera.object.position)
var c_to_ball = c_pos.distanceTo(obj.position)

//DEBUG_show(c_to_ball+'\n'+c_to_camera)
if (c_to_ball > c_to_camera) {
  if (this._ball_para.hit_score == null) {
    let v_path = MMD_SA._v3a_.copy(this._ball_para.ball_pos_last).sub(c_pos)
    let v_path_length = v_path.length()
    if (v_path_length < c_to_camera) {
      let v_scale = (c_to_camera-v_path_length)/v.length()
      v_path.copy(this._ball_para.ball_pos_last).add(v.multiplyScalar(v_scale)).sub(c_pos)
//DEBUG_show([c_to_camera,c_to_ball,v_path.length(),v_scale,Date.now()].join('\n'))
    }

    let v_axis = MMD_SA._v3a.copy(v_path).normalize()
    let z_axis = MMD_SA._v3b.set(0,0,1)
//    let q = MMD_SA.TEMP_q.setFromAxisAngle(MMD_SA.TEMP_v3.crossVectors(v_axis,z_axis).normalize(), v_axis.angleTo(z_axis))
    let q = MMD_SA.TEMP_q.setFromUnitVectors(v_axis,z_axis)
//DEBUG_show(v_path.clone().applyQuaternion(q).toArray().join('\n'))
    let v_path_camera = MMD_SA._v3a.copy(MMD_SA._trackball_camera.object.position).sub(c_pos)
    let v_score = MMD_SA._v3b.copy(v_path_camera).applyQuaternion(q)
    let score = Math.round(100 - Math.min(Math.max(Math.sqrt(v_score.x*v_score.x + v_score.y*v_score.y)-1, 0), 5) * 20)
//DEBUG_show(score)
//score = 100
    this._ball_para.hit_score = score

    let sprite_pos = v_path.normalize().lerp(v_path_camera.normalize(), 0.8).multiplyScalar(c_to_camera-2).add(c_pos)

    let para = { scale:1, speed:1 }
    para.pos = sprite_pos.clone()
    para.name = "hit_yellow_01"
/*
    if (score < 33) {
      para.scale *= 0.5
      para.speed *= 2
    }
    else if (score < 66) {
      para.scale *= 0.75
      para.speed *= 1.5
    }
    else {
      para.scale *= 1.5
      para.speed *= 1
    }
*/
    para.scale *= 0.1;
    para.scale *= 1.5;
    MMD_SA_options.Dungeon.sprite.animate(para.name, para)
    MMD_SA_options.Dungeon.sound.audio_object_by_name["hit-1"].play()
  }
}

this._ball_para.ball_pos_last = this._ball_para.ball_pos_last && this._ball_para.ball_pos_last.copy(obj.position) || obj.position.clone();
    }

  }
 ,reset: function () {
if (!baseball_started)
  return
baseball_started = false

MMD_SA_options.Dungeon._states.event_mode_locked = false

this.action._ball_para = null

MMD_SA_options._motion_shuffle_list_default = [MMD_SA_options.motion_index_by_name["standmix2_modified"]]
MMD_SA_options.motion_shuffle_list_default = MMD_SA_options._motion_shuffle_list_default.slice()
MMD_SA._force_motion_shuffle = true
  }

 ,get _started() { return baseball_started; }
      };

      return baseball;
    })()

   ,"body_pix" : {
  icon_path: Settings.f_path + '/assets/assets.zip#/icon/selfie_segmentation_64x64.png'
 ,info_short: "Selfie Segmentation AI"
// ,is_base_inventory: true

 ,index_default: (is_mobile) ? undefined : 5
// ,get index_default() { return (is_mobile) ? undefined : (browser_native_mode) ? 4 : 6;}//MMD_SA_options.Dungeon.inventory.max_base+4; }

 ,stock_max: 1
 ,stock_default: 1

 ,action: {
    func: (function () {
      var initialized, loading;

      var script_list;

      function load_script(idx, onFinish) {
var src = script_list[idx]
var name = src.replace(/^.+[\/\\]/, "")

let script = document.createElement('script');
script.onload = () => {
  if (++idx >= script_list.length) {
    onFinish()
  }
  else {
    load_script(idx, onFinish)
  }
};
script.src = src;
document.head.appendChild(script);

var msg = '(Loading ' + name + ')'
console.log(msg)
DEBUG_show(msg, 3)
      };

      async function init() {
if (!initialized) {
  await new Promise((resolve, reject) => {
loading = true

script_list = [];
if (MMD_SA.WebXR.user_camera.bodyPix.use_bodySegmentation) {
  script_list.push(
    'https://cdn.jsdelivr.net/npm/@mediapipe/selfie_segmentation',
    'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs',
    'https://cdn.jsdelivr.net/npm/@tensorflow-models/body-segmentation'
  );
}
else {
  script_list.push(
    'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs',
    'https://cdn.jsdelivr.net/npm/@tensorflow-models/body-pix'
  );
}

load_script(0, ()=>{
  loading = false
  initialized = true
  resolve();
});
  });
}

if (MMD_SA.WebXR.user_camera.bodyPix.enabled) {
  MMD_SA.WebXR.user_camera.bodyPix.enabled = false
  DEBUG_show("Selfie Segmentation AI:OFF", 2)
}
else {
  MMD_SA.WebXR.user_camera.bodyPix.enabled = true
  DEBUG_show("Selfie Segmentation AI:ON", 2)
}
      }

      return function (item) {
if (!MMD_SA.WebXR.user_camera.visible) {
  MMD_SA.SpeechBubble.message(0, 'You need to activate selfie camera first.', 3*1000);
  return true
}
if (MMD_SA.WebXR.user_camera.ML_enabled) {
  MMD_SA.SpeechBubble.message(0, 'You can\'t enable Selfie Segmentation AI and motion capture at the same time.', 3*1000);
  return true
}
if (loading) {
  DEBUG_show("(Selfie Segmentation AI still loading)", 2)
  return true
}

init()
      };
    })()
//   ,anytime: true
  }

 ,get info() {
    return 'Double-click to ' + ((MMD_SA.WebXR.user_camera.bodyPix.enabled) ? 'disable' : 'enable') + ' Selfie Segmentation AI. When using with a camera or video input, the 3D avatar will be displayed behind the person in the video, allowing some interesting usage such as talking a selfie with your 3D avatar.';
  }
    }

   ,"snapshot" : {
  icon_path: Settings.f_path + '/assets/assets.zip#/icon/taking-a-selfie_64x64.png'
 ,info_short: "Snapshot"
// ,is_base_inventory: true

 ,index_default: undefined

 ,stock_max: 1
 ,stock_default: (is_mobile) ? 1 : 0
 ,action: {
    func: function (item) {
return System._browser.snapshot.init();
    }
   ,anytime: true
  }
    }

   ,"rec" : (()=>{
      function snapshot(e) {
const ev = e.detail.e;
switch (ev.code) {
  case 'F12':
    System._browser.snapshot.init();
    break
  case 'F9':
    System._browser.video_capture.start();
    break
  case 'F10':
    System._browser.video_capture.stop();
    break
  default:
    return;
}

e.detail.result.return_value = true;
      }

      window.addEventListener('MMDStarted', ()=>{
        window.addEventListener('SA_keydown', snapshot);
      });

      const rec = {
  icon_path: Settings.f_path + '/assets/assets.zip#/icon/rec_64x64.png'
 ,info_short: "Media recorder"
// ,is_base_inventory: true

 ,index_default: (is_mobile) ? undefined : 6

 ,stock_max: 1
 ,stock_default: 1

 ,action: {
    func: function (item) {
MMD_SA_options.Dungeon.run_event('_MEDIA_RECORDER_OPTIONS_', 0);
    }
//   ,anytime: true
  }

 ,get info() {
var info = ''

if (System._browser.camera._info) {
  info += System._browser.camera._info;
}
else {
  info = [
  '- Press F12 to capture a still shot of the 3D content.',
  '- Press F9 to capture a video of the 3D content. Press F10 to stop and return the recorded MP4 file.',
  '- Double-click for options.',
  '- Use numeric keys to pick a numbered option.',
  ].join('\n');
}

return info;
  }
      };

      return rec;
    })()

   ,"XR_Animator_options" : {
  icon_path: Settings.f_path + '/assets/assets.zip#/icon/user-experience_64x64.png'
 ,info_short: "UI settings and other options"
// ,is_base_inventory: true

 ,index_default: (is_mobile) ? undefined : 4

 ,stock_max: 1
 ,stock_default: (is_mobile) ? 0 : 1

 ,action: {
    func: function (item) {
MMD_SA_options.Dungeon.events["_FACEMESH_OPTIONS_"][0]._show_other_options_=true;setTimeout(()=>{MMD_SA_options.Dungeon.events["_FACEMESH_OPTIONS_"][0]._show_other_options_=false},0);
MMD_SA_options.Dungeon.run_event("_FACEMESH_OPTIONS_",0);
    }
//   ,anytime: true
  }

 ,info: [
  '- Double-click for UI settings and other options.',
  '- Use numeric keys to pick a numbered option.',
  ].join('\n')
    }

   ,"VMC_protocol" : {
  icon_path: Settings.f_path + '/assets/assets.zip#/icon/vmpc_logo_64x64.png'
 ,info_short: "VMC-protocol"
// ,is_base_inventory: true

 ,index_default: (is_mobile) ? undefined : 3
 ,stock_default: (is_mobile) ? 0 : 1

 ,stock_max: 1
 ,action: {
    func: function (item) {
if (!webkit_electron_mode || !MMD_SA.THREEX.enabled) {
  MMD_SA.SpeechBubble.message(0, 'This feature is available only for Windows app version with VRM model.', 3*1000);
  return true;
}

MMD_SA_options.Dungeon.run_event("_VMC_PROTOCOL_",0);
    }
//   ,anytime: true
  }

 ,info: [
  '- Double-click to configure VMC-protocol, which allows beaming 3D motion data in real time to other supported apps, such as VSeeFace, Unity and Unreal Engine.',
  '- Use numeric keys to pick a numbered option.',
  ].join('\n')
    }

   ,"air_blower": (function () {
      function air_blower_frame() {
if (MMD_SA.ammo_proxy && MMD_SA.ammo_proxy._timeStep) return// {DEBUG_show(Date.now()); return; }

const t = Date.now();
let windPower = ( Math.sin( t * Math.PI / 3 ) + 1 ) / 2;
windPower = 0.5 + windPower*0.5;

var camera = MMD_SA._trackball_camera.object
var gravity = MMD_SA.TEMP_v3.copy(camera.position).sub(camera._lookAt).normalize().multiplyScalar((state==2) ? 2 : -2).multiplyScalar(windPower).toArray()
//DEBUG_show(gravity)
THREE.MMD.setGravity( gravity[0]*9.8*10, gravity[1]*9.8*10, gravity[2]*9.8*10 )
      }

      var state = 0
      var air_blower = {
  icon_path: Settings.f_path + '/assets/assets.zip#/icon/hair-dryer_64x64.png'
 ,info_short: "Air blower"
// ,is_base_inventory: true

 ,index_default: undefined
// ,get index_default() { return (is_mobile) ? undefined : MMD_SA_options.Dungeon.inventory.max_base+2; }

 ,stock_max: 1
 ,stock_default: 1
 ,action: {
    func: function () {
var phase = 1
if (++state <= 2) {
  if (state == 1) {
    System._browser.on_animation_update.add(air_blower_frame,0,phase,-1)
    DEBUG_show("(air blowing)", 2)
  }
  else {
    DEBUG_show("(air sucking)", 2)
  }
}
else {
  System._browser.on_animation_update.remove(air_blower_frame,phase)
  DEBUG_show("(air blower stopped)", 2)
  air_blower.reset()
}
    }
   ,anytime: true
  }
 ,reset: function () {
if (!MMD_SA.MMD_started || !state) return

state = 0
var gravity = MMD_SA.MMD.motionManager.para_SA.gravity || [0,-1,0]
THREE.MMD.setGravity( gravity[0]*9.8*10, gravity[1]*9.8*10, gravity[2]*9.8*10 )
  }
      };

      return air_blower;
    })()

   ,"social_distancing": (function () {
      var social_distancing_started;

      var v3a, v3b;
      window.addEventListener("jThree_ready", function () {
v3a = new THREE.Vector3()
v3b = new THREE.Vector3()
      });

      var social_distancing = {
  icon_path: Settings.f_path + '/assets/assets.zip#/icon/coronavirus_social_distancing_64x64.png'
 ,info_short: "Social meter"
// ,is_base_inventory: true

 ,index_default: undefined
// ,get index_default() { return (is_mobile) ? undefined : MMD_SA_options.Dungeon.inventory.max_base+3; }

 ,stock_max: 1
 ,stock_default: 1//(is_mobile) ? 1 : 0
 ,action: {
    func: function (item) {
var model_mesh = THREE.MMD.getModels()[0].mesh
if (!model_mesh.visible)
  return true

var d = MMD_SA_options.Dungeon
if (d.event_mode && !social_distancing_started)
  return true

if (social_distancing_started) {
  if (MMD_SA.WebXR._circle_2m && MMD_SA.WebXR._circle_2m.visible) {
    d.run_event("circle_2m_hide")
    DEBUG_show("Social distancing:ON / Circle:OFF", 2)
  }
  else {
    item.reset()
    DEBUG_show("Social distancing:OFF", 2)
  }
  return false
}
//DEBUG_show(MMD_SA.MMD.motionManager.filename)

var dis = this._social_distance()

if (dis < 2)
  return true
if (!/standmix2_modified/.test(MMD_SA.MMD.motionManager.filename))
  return true
if (MMD_SA_options.Dungeon_options.item_base.baseball._started)
  return true

social_distancing_started = true

d.run_event("circle_2m_show")

d._states.event_mode_locked = true

DEBUG_show("Social distancing:ON / Circle:ON", 2)

this._social_distance_check(999,999)
    }
   ,anytime: true

   ,_social_distance: function () {
return v3a.copy(MMD_SA.camera_position).setY(0).distanceTo(v3b.copy(THREE.MMD.getModels()[0].mesh.position).setY(0))/10 / MMD_SA.WebXR.zoom_scale;
    }

   ,_social_distance_check: function (min, max) {
var dis = this._social_distance()
//DEBUG_show(dis)
if ((dis > min) && (dis < max))
  return true

if (/surrender_v03/.test(MMD_SA.MMD.motionManager.filename)) {
  MMD_SA_options._motion_shuffle_list_default = [MMD_SA_options.motion_index_by_name["surrender-R_v03"]]
}
else if (dis < 0.75) {
  MMD_SA_options._motion_shuffle_list_default = [MMD_SA_options.motion_index_by_name["surrender_v03"]]
}
else if (dis < 2) {
  MMD_SA_options._motion_shuffle_list_default = [MMD_SA_options.motion_index_by_name["emote-mod_照れる1"], MMD_SA_options.motion_index_by_name["emote-mod_照れる2"]]
}
else if (dis < 4) {
  MMD_SA_options._motion_shuffle_list_default = [MMD_SA_options.motion_index_by_name["emote-mod_お辞儀1"], MMD_SA_options.motion_index_by_name["emote-mod_お辞儀2"], MMD_SA_options.motion_index_by_name["emote-mod_肯定する1"], MMD_SA_options.motion_index_by_name["emote-mod_肯定する2"]]
}
else if (dis < 6) {
  MMD_SA_options._motion_shuffle_list_default = [MMD_SA_options.motion_index_by_name["emote-mod_歓迎する1"], MMD_SA_options.motion_index_by_name["emote-mod_歓迎する2"]]
}
else if (dis < 8) {
  MMD_SA_options._motion_shuffle_list_default = [MMD_SA_options.motion_index_by_name["emote-mod_がっかり1"], MMD_SA_options.motion_index_by_name["emote-mod_がっかり2"], MMD_SA_options.motion_index_by_name["emote-mod_肩をすくめる1"], MMD_SA_options.motion_index_by_name["emote-mod_肩をすくめる2"]]
}
else {
  MMD_SA_options._motion_shuffle_list_default = [MMD_SA_options.motion_index_by_name["emote-mod_すねる1"], MMD_SA_options.motion_index_by_name["emote-mod_すねる2"], MMD_SA_options.motion_index_by_name["emote-mod_よろめく1"], MMD_SA_options.motion_index_by_name["emote-mod_よろめく2"]]
}

MMD_SA_options.motion_shuffle_list_default = MMD_SA_options._motion_shuffle_list_default.slice()
MMD_SA._force_motion_shuffle = true
    }
  }
 ,reset: function () {
if (!social_distancing_started)
  return
social_distancing_started = false

MMD_SA_options.Dungeon.run_event("circle_2m_hide")

MMD_SA_options.Dungeon._states.event_mode_locked = false

MMD_SA_options._motion_shuffle_list_default = [MMD_SA_options.motion_index_by_name["standmix2_modified"]]
MMD_SA_options.motion_shuffle_list_default = MMD_SA_options._motion_shuffle_list_default.slice()
MMD_SA._force_motion_shuffle = true
  }

 ,get _started() { return social_distancing_started; }
      };

      return social_distancing;
    })()

   ,"_map_": {
  get index_default() { return MMD_SA_options.Dungeon.inventory.max_base * MMD_SA_options.Dungeon.inventory.max_row -1; }
    }


   ,"laughing_man" : {
  icon_path: Settings.f_path + '/assets/assets.zip#/icon/laughing_man_64x64.png'
 ,info_short: "Laughing Man"
// ,is_base_inventory: true
 ,stock_max: 1
 ,stock_default: 0//1
 ,action: {
    func: function (item) {
/*
if (!MMD_SA.WebXR.user_camera.visible) {
  DEBUG_show("(You need to activate selfie AR first.)", 3)
  return true
}
*/
if (MMD_SA.WebXR.user_camera.face_detection.enabled) {
  MMD_SA.WebXR.user_camera.face_detection.enabled = false
  DEBUG_show("Laughing Man:OFF", 2)
}
else {
  MMD_SA.WebXR.user_camera.face_detection.enabled = true
  DEBUG_show("Laughing Man:ON", 2)
}
    }
   ,anytime: true
  }
    }

  }

 ,inventory: {
    UI: {
      info: {
//        scale: 3
      },
//      muted: true,
    }
  }

 ,events_default: {
    "_SELFIE_": [
//0
      [
        {
          message: {
  content: "Enable selfie camera, webcam or media file input?\n1. Yes\n2. Yes (flip video)\n3. No\n4. Options"
 ,bubble_index: 3
 ,branch_list: [
    { key:1, branch_index:1 }
   ,{ key:2, branch_index:2 }
   ,{ key:3 }
   ,{ key:4, branch_index:3 }
  ]
          }
        }
      ]
// 1
     ,[
        {
          func: function () {
MMD_SA.WebXR.user_camera.video_flipped=false;
MMD_SA.WebXR.user_camera.start((0&&webkit_electron_mode) ? toFileProtocol("C:\\Users\\user\\Documents\\_.mp4") : null);
          }
         ,ended: "_SELFIE_"
        }
      ]
// 2
     ,[
        {
          func: function () {
MMD_SA.WebXR.user_camera.video_flipped=true;
MMD_SA.WebXR.user_camera.start((0&&webkit_electron_mode) ? toFileProtocol("C:\\Users\\user\\Documents\\_.mp4") : null);
          }
         ,ended: "_SELFIE_"
        }
      ]
//3
     ,[
        {
          message: {
  get content() { return 'Choose a pixel limit (current is ' + (MMD_SA_options.user_camera.pixel_limit.current||MMD_SA_options.user_camera.pixel_limit._default_).join('x') + ').\n1. Default (' + MMD_SA_options.user_camera.pixel_limit._default_.join('x') + ')\n2. 1280x720\n3. 1920x1080\n4. Cancel'; }
 ,bubble_index: 3
 ,branch_list: [
    { key:1, branch_index:4 }
   ,{ key:2, branch_index:5 }
   ,{ key:3, branch_index:6 }
   ,{ key:4 }
  ]
          }
        }
      ]
// 4
     ,[
        {
          func: function () {
MMD_SA_options.user_camera.pixel_limit.current = null
DEBUG_show('Video pixel limit: ' + MMD_SA_options.user_camera.pixel_limit._default_.join('x'), 2)
          }
         ,ended: true
        }
      ]
// 5
     ,[
        {
          func: function () {
MMD_SA_options.user_camera.pixel_limit.current = [1280,720]
DEBUG_show('Video pixel limit: 1280x720', 2)
          }
         ,ended: true
        }
      ]
// 6
     ,[
        {
          func: function () {
MMD_SA_options.user_camera.pixel_limit.current = [1920,1080]
DEBUG_show('Video pixel limit: 1920x1080', 2)
          }
         ,ended: true
        }
      ]
    ]

   ,"_ENTER_AR_": [
//0
      [
        {
          message: {
  content: "Enter Augmented Reality (AR) mode?\n1. Yes\n2. No"
 ,bubble_index: 3
 ,branch_list: [
    { key:1, branch_index:1 }
   ,{ key:2 }
  ]
          }
        }
      ]
// 1
     ,[
        {
          func: function () {
MMD_SA.WebXR.enter_AR()
          }
         ,ended: true
        }
      ]
    ]

   ,"_FACEMESH_": [
//0
      [
        {
          message: {
  get content() { return 'Enable face and body tracking?\n1. Face only\n2. Body only\n3. Body + Hands\n4. Face + Body' + ((System._browser.camera.poseNet._use_holistic_) ? '\n5. Full body (Holistic)' : '\n5. Face + Body + Hands') + '\n6. Options/Tools\n7. Cancel'; }
 ,bubble_index: 3
 ,get branch_list() {
if (System._browser.camera.poseNet._use_holistic_) {
  return [
    { key:1, branch_index:1 }
   ,{ key:2, branch_index:2 }
   ,{ key:3, branch_index:3 }
   ,{ key:4, branch_index:4 }
   ,{ key:5, branch_index:6 }
   ,{ key:6, branch_index:7 }
   ,{ key:7 }
  ];
}
return [
    { key:1, branch_index:1 }
   ,{ key:2, branch_index:2 }
   ,{ key:3, branch_index:3 }
   ,{ key:4, branch_index:4 }
   ,{ key:5, branch_index:5 }
   ,{ key:6, branch_index:7 }
   ,{ key:7 }
];
  }
          }
        }
      ]
// NOTE: Models that need to be used should be enabled first before disabling other models.
// 1
     ,[
        {
          func: function () {
MMD_SA.WebXR.user_camera.poseNet.use_holistic = false

MMD_SA.WebXR.user_camera.facemesh.enabled = true
MMD_SA.WebXR.user_camera.poseNet.enabled = false
MMD_SA.WebXR.user_camera.handpose.enabled = false
DEBUG_show("Facemesh AI:ON", 2)
          }
         ,ended: true
        }
      ]
// 2
     ,[
        {
          func: function () {
MMD_SA.WebXR.user_camera.poseNet.use_holistic = false

MMD_SA.WebXR.user_camera.poseNet.enabled = true
MMD_SA.WebXR.user_camera.handpose.enabled = false
MMD_SA.WebXR.user_camera.facemesh.enabled = false
MMD_SA_options.Dungeon_options.item_base['pose'].action.func()
DEBUG_show("Pose AI:ON", 3)
          }
         ,ended: true
        }
      ]
// 3
     ,[
        {
          func: function () {
MMD_SA.WebXR.user_camera.poseNet.use_holistic = false

MMD_SA.WebXR.user_camera.poseNet.enabled = true
MMD_SA.WebXR.user_camera.handpose.enabled = true
MMD_SA.WebXR.user_camera.facemesh.enabled = false
MMD_SA_options.Dungeon_options.item_base['pose'].action.func()
DEBUG_show("Pose/Hands AI:ON", 3)
          }
         ,ended: true
        }
      ]
// 4
     ,[
        {
          func: function () {
MMD_SA.WebXR.user_camera.poseNet.use_holistic = false

MMD_SA.WebXR.user_camera.facemesh.enabled = true
MMD_SA.WebXR.user_camera.poseNet.enabled = true
MMD_SA.WebXR.user_camera.handpose.enabled = false
MMD_SA_options.Dungeon_options.item_base['pose'].action.func()
DEBUG_show("Facemesh/Pose AI:ON", 3)
          }
         ,ended: true
        }
      ]
// 5
     ,[
        {
          func: function () {
MMD_SA.WebXR.user_camera.poseNet.use_holistic = false

MMD_SA.WebXR.user_camera.facemesh.enabled = true
MMD_SA.WebXR.user_camera.poseNet.enabled = true
MMD_SA.WebXR.user_camera.handpose.enabled = true
MMD_SA_options.Dungeon_options.item_base['pose'].action.func()
DEBUG_show("Facemesh/Pose/Hands AI:ON", 4)
          }
         ,ended: true
        }
      ]
// 6
     ,[
        {
          func: function () {
MMD_SA.WebXR.user_camera.poseNet.use_holistic = true

MMD_SA.WebXR.user_camera.facemesh.enabled = true
MMD_SA.WebXR.user_camera.poseNet.enabled = true
MMD_SA.WebXR.user_camera.handpose.enabled = true
MMD_SA_options.Dungeon_options.item_base['pose'].action.func()
DEBUG_show("Facemesh/Pose/Hands AI:ON", 4)
          }
         ,ended: true
        }
      ]
// 7
     ,[
        {
          goto_event: { id:"_FACEMESH_OPTIONS_", branch_index:0 }
        }
      ]
    ]

   ,"_VMC_PROTOCOL_": [
//0
      [
        {
          message: {
  get content() {
return 'VMC-protocol parameters\n- port: ' + MMD_SA_options.OSC.VMC.send.port + '\n- host: ' + MMD_SA_options.OSC.VMC.send.host + '\n1. VMC-protocol: ' + ((MMD_SA.OSC.VMC.sender_enabled) ? 'ON' : 'OFF') + '\n2. VSeeFace mode: ' + ((MMD_SA.OSC.VMC.VSeeFace_mode) ? 'ON' : 'OFF') + '\n3. 3D Avatar: ' + ((MMD_SA.hide_3D_avatar) ? 'HIDDEN' : 'VISIBLE') + '\n4. Done';
  }
 ,bubble_index: 3
 ,branch_list: [
    { key:1, event_id:{ func:()=>{ MMD_SA.OSC.VMC.sender_enabled=!MMD_SA.OSC.VMC.sender_enabled; System._browser.update_tray(); }, goto_event: { id:"_VMC_PROTOCOL_", branch_index:0 } } },
    { key:2, event_id:{ func:()=>{ MMD_SA.OSC.VMC.VSeeFace_mode=!MMD_SA.OSC.VMC.VSeeFace_mode; System._browser.update_tray(); }, goto_event: { id:"_VMC_PROTOCOL_", branch_index:0 } } },
    { key:3, event_id:{ func:()=>{ MMD_SA.hide_3D_avatar=!MMD_SA.hide_3D_avatar; System._browser.update_tray(); }, goto_event: { id:"_VMC_PROTOCOL_", branch_index:0 } } },
    { key:4 },
  ]
          }
        }
      ]
    ]

   ,"_MEDIA_RECORDER_OPTIONS_": (()=>{

      return [
//0
  [
    {
       message: {
  get content() {
const vc = System._browser.video_capture;

const specs = vc.get_specs();

let type = specs.mime_type;
if (System._browser.video_capture.FFmpeg.enabled && /h264/.test(type))
  type = 'video/mp4';
console.log(specs)
type = type.replace(/\;.+$/, '');

return 'Video capture options\n(' + (specs.width+'x'+specs.height + '/' + ((specs.fps==-1)?'unlimited':specs.fps) + ' fps') + '/' + (vc.target_mime_type||type).replace(/video\//, '') + ')\n1. Target resolution: ' + ((!vc.target_width) ? 'AUTO' : vc.target_width+'x'+vc.target_height) + '\n2. Target FPS: ' + ((!vc.fps) ? 'AUTO' : (vc.fps == -1) ? 'UNLIMITED' : vc.fps) + ((webkit_electron_mode) ? '\n3. Output format: ' + (vc.target_mime_type||'AUTO') + '\n4. Done' : '\n3. Done' );
  },
  bubble_index: 3,
  get branch_list() { return [
    { key:1, branch_index:1 },
    { key:2, branch_index:2 },
  ].concat((System._browser.video_capture.FFmpeg.enabled) ? [
    { key:3, branch_index:3 },
    { key:4 },
  ] : [
    { key:3 },
  ])},
       }
    }
  ],
//1
  [
    {
      func: ()=>{
const vc = System._browser.video_capture;

let w, h;
if (!vc.target_width) {
  w = 1280;
  h = 720;
}
else if (vc.target_width == 1280) {
  w = 1920;
  h = 1080;
}

vc.target_width = w;
vc.target_height = h;
      },
      goto_branch: 0
    }
  ],
//2
  [
    {
      func: ()=>{
const vc = System._browser.video_capture;

if (!vc.fps) {
  vc.fps = -1;
}
else if (vc.fps == -1) {
  vc.fps = 30;
}
else {
  vc.fps = undefined;
}
      },
      goto_branch: 0
    }
  ],
//3
  [
    {
      func: ()=>{
const vc = System._browser.video_capture;

if (!vc.target_mime_type) {
  vc.target_mime_type = 'video/webm';
}
else {
  vc.target_mime_type = undefined;
}
      },
      goto_branch: 0
    }
  ],
      ];
    })()

   ,"_FACEMESH_OPTIONS_": (function () {
function speech_bubble2(msg, duration, para={}) {
  MMD_SA.SpeechBubble.list[1].message(3, msg, duration*1000, Object.assign({scale:0.75}, para));
}

var wallpaper_src;
function onDrop_change_wallpaper(item) {
  var src = item.path
  if (item.isFileSystem && /([^\/\\]+)\.(png|jpg|jpeg|bmp|mp4|mkv|webm)$/i.test(src)) {
    wallpaper_src = src;
    System._browser.updateWallpaper(toFileProtocol(src));
    LdesktopBG_host.style.display = 'block'
  }
  else {
    _onDrop_finish.call(DragDrop, item)
  }
}

function onDrop_change_panorama(item) {
  var src = item.path
  if (item.isFileSystem && /([^\/\\]+)\.(png|jpg|jpeg|bmp)$/i.test(src)) {
    change_panorama(0, src)
  }
  else {
    _onDrop_finish.call(DragDrop, item)
  }
}

function onDrop_change_facemesh_calibration(item) {
  var src = item.path
  if (item.isFileSystem && /([^\/\\]+)\.json$/i.test(src)) {
//console.log(item)
    fetch(toFileProtocol(src)).then((response) => response.json()).then((data) => {
if (!data.facemesh_calibration_type) {
  MMD_SA.SpeechBubble.message(0, 'This is not a valid facemesh calibration JSON file.', 3*1000);
}
else {
  System._browser.camera.facemesh.import_calibration(data);
}
MMD_SA_options.Dungeon.run_event(null,done_branch,0);
    });
  }
  else {
    _onDrop_finish.call(DragDrop, item)
  }
}

var object3d_list = [];
var object3d_index = 0;
var object3d_cache = new Map();

async function onDrop_add_object3D(item) {
  function update_model_para(url) {
    if (!item._obj_json) return;

    const model_filename = toLocalPath(url).replace(/^.+[\/\\]/, "");
    const model_filename_cleaned = model_filename.replace(/[\-\_]copy\d+\.(x|gltf|glb|bpm|jpg|jpeg|png|webp)$/, ".$1").replace(/[\-\_]v\d+\.(x|gltf|glb|bpm|jpg|jpeg|png|webp)$/, ".$1");
    const model_para = MMD_SA_options.model_para[model_filename] || MMD_SA_options.model_para[model_filename_cleaned] || {};

    MMD_SA_options.model_para[model_filename] = MMD_SA_options.model_para[model_filename_cleaned] = Object.assign(model_para, item._obj_json.model_para);
  }

  var src = item.path;
  if (item.isFileSystem && /([^\/\\]+)\.zip$/i.test(src)) {
    let zip_file = SA_topmost_window.DragDrop._path_to_obj && SA_topmost_window.DragDrop._path_to_obj[src.replace(/^(.+)[\/\\]/, "")];
    if (!zip_file) {
      const blob = await new Promise((resolve, reject) => {
const xhr = new XMLHttpRequestZIP;
xhr.onload = function () {
  resolve(this.response);
};
xhr.open( "GET", src, true );
xhr.responseType = "blob";
xhr.send();
      });

      const file = new File([blob], src);

// from SA_DragDropEMU()
      console.log("File input (emulated):", file);
      const dd = SA_topmost_window.DragDrop;
      if (!dd._path_to_obj) {
        dd._path_to_obj = {};
        dd._obj_url = {};
      }
      dd._path_to_obj[file.name.replace(/^(.+)[\/\\]/, "")] = file;

      zip_file = file;
    }

    const zip = await new self.JSZip().loadAsync(zip_file);

// will be called, even if content is corrupted

    XMLHttpRequestZIP.zip_by_url(src, zip);

    let model_list = (!MMD_SA.THREEX.enabled) ? zip.file(/\.pmx$/i) : [];
    if (!model_list.length) {
      model_list = zip.file(/\.x$/i);
      if (!model_list.length) {
        System._browser.DEBUG_show("(No PMX/X model found)");
        return;
      }
    }

    const model_filename = model_list[0].name.replace(/^.+[\/\\]/, "");
    const model_path = src + "#/" + model_list[0].name;
    console.log(src, model_filename, model_path);

    object3d_cache.set(model_path, null);

    const model_json = zip.file(/model\.json$/i);
    if (model_json.length) {
      const json = await model_json[0].async("text");
      MMD_SA_options.model_para = Object.assign(MMD_SA_options.model_para, JSON.parse(json, function (key, value) {
        if (typeof value == "string") {
          if (/^eval\((.+)\)$/.test(value)) {
            value = eval(decodeURIComponent(RegExp.$1));
          }
        }
        return value;
      }));
      console.log("(model.json updated)");
    }

    update_model_para(model_path);

    await add_object3D(model_path);

    System._browser.DEBUG_show('✅PMX/X model (' + model_filename + ')');
  }
  else if (item.isFileSystem && /([^\/\\]+)\.(gltf|glb)$/i.test(src)) {
    if (!MMD_SA.THREEX.enabled) {
      System._browser.DEBUG_show('(GLTF/GLB not available in MMD mode)');
      return;
    }

    const model_filename = src.replace(/^.+[\/\\]/, "");

    object3d_cache.set(src, null);

    update_model_para(src);

    await add_object3D(src);

    System._browser.DEBUG_show('✅GLTF model (' + model_filename + ')');
  }
  else if (item.isFileSystem && /([^\/\\]+)\.(bpm|jpg|jpeg|png|webp|mp4|mkv|webm)$/i.test(src)) {
    const file_type = RegExp.$2.toUpperCase();
    const model_filename = src.replace(/^.+[\/\\]/, "");

    object3d_cache.set(src, null);

    update_model_para(src);

    await add_object3D(src);

    System._browser.DEBUG_show('✅' + file_type + ' (' + model_filename + ')');
  }
  else {
    _onDrop_finish.call(DragDrop, item)
  }
}

const add_object3D = (function () {
  function onload_common(url, obj_all) {
const mesh = obj_all.scene;

const _THREE = MMD_SA.THREEX._THREE;
const THREE = MMD_SA.THREEX.THREE;
const THREEX = MMD_SA.THREEX.THREEX;

var model_filename = toLocalPath(url).replace(/^.+[\/\\]/, "");
var model_filename_cleaned = model_filename.replace(/[\-\_]copy\d+\.(x|gltf|glb)$/, ".$1").replace(/[\-\_]v\d+\.(x|gltf|glb)$/, ".$1");
var model_para = MMD_SA_options.model_para[model_filename] || MMD_SA_options.model_para[model_filename_cleaned] || {};

const is_X_model = /\.x/i.test(url);

let material_para = model_para.material_para || {};
material_para = material_para._default_ || {};
if (material_para.receiveShadow != false) {
  mesh.traverse(obj=>{
    if (obj.isMesh) obj.receiveShadow = true;
  });
}

if (MMD_SA.THREEX.enabled) {
}
else {
  if (model_para.instanced_drawing)
    mesh.instanced_drawing = model_para.instanced_drawing
//  mesh.instanced_drawing = 99

  mesh.useQuaternion = true
}

//model_para = { placement:{scale:5}, parent_bone: { model_index:0, name:"右手首", position:{x:0,y:0,z:0}, rotation:{x:0,y:0,z:0} } };

var placement = model_para.placement || {};
mesh.position.copy(_THREE.MMD.getModels()[0].mesh.position);
if (placement.position)
  mesh.position.add(placement.position);
if (placement.rotation)
  mesh.quaternion.setFromEuler(e1.copy(placement.rotation).multiplyScalar(Math.PI/180));
mesh.scale.setScalar(placement.scale||((is_X_model) ? 10 : 1));

var object3d = Object.assign({}, model_para);
if (!object3d.user_data) object3d.user_data = {};
object3d._obj = object3d._mesh = mesh;
object3d._obj_proxy = new MMD_SA_options.Dungeon.Object3D_proxy_base(object3d);

var model_id = model_filename;
if (object3d_cache.get(url)) {
  model_id += '(cloned)';
}
else {
  object3d_cache.set(url, object3d);
}

const obj_cached = object3d_cache.get(url);
object3d._obj_base = obj_cached._obj_base || {};

object3d.no_collision = true;
object3d.collision_by_mesh = true;
object3d.collision_by_mesh_sort_range = 1;

object3d_index = object3d_list.length;
object3d_list.push(object3d);
MMD_SA.THREEX._object3d_list_ = object3d_list;

if (object3d.parent_bone)
  MMD_SA_options.Dungeon.accessory_list.push(object3d);

object3d.user_data.id = model_id;
object3d.user_data.path = url;
object3d.user_data.obj_all = obj_all;
object3d.user_data._rotation_ = new THREE.Euler();

object3d.user_data._default_state_ = {
  position: (object3d.parent_bone) ? new THREE.Vector3() : mesh.position.clone(),
  scale: mesh.scale.x,
  parent_bone_name: (object3d.parent_bone && object3d.parent_bone.name) || '',
};

if (obj_all.animations && obj_all.animations.length) {
  object3d.user_data.animation_clip = obj_all.animations[0];
  object3d.user_data.animation_mixer = new MMD_SA.THREEX.THREE.AnimationMixer(mesh);
  object3d.user_data.animation_mixer.clipAction(object3d.user_data.animation_clip).play();
}

console.log(object3d)

if (!object3d.parent_bone) {
  System._browser.camera.poseNet.auto_grounding = true
  System._browser.camera.poseNet.ground_plane_visible = false
  MMD_SA.WebXR.ground_plane.visible = System._browser.camera.poseNet.ground_plane_visible

  System._browser.camera.display_floating = (MMD_SA_options.user_camera.display.floating || (MMD_SA_options.user_camera.display.floating_auto !== false));
}

MMD_SA.THREEX.scene.add(mesh);

build_octree(object3d);

// in explorer mode, make sure that collision is off at the beginning
//object3d.no_collision = true;
  }

  return async function (url) {
    return new Promise((resolve)=>{
      const obj_cached = object3d_cache.get(url);
      if (obj_cached) {
const obj_cloned = { scene:obj_cached.user_data.obj_all.scene.clone(), animations:obj_cached.user_data.obj_all.animations };
console.log('object3D cloned', url);

onload_common(url, obj_cloned);
resolve();
      }
      else if (/\.pmx$/i.test(url)) {

(()=>{

const model_index = THREE.MMD.getModels().length;

const model_filename_raw = url.replace(/^.+[\/\\]/, "");
const model_filename = model_filename_raw;
const model_filename_cleaned = model_filename.replace(/[\-\_]copy\d+\.pmx$/, ".pmx").replace(/[\-\_]v\d+\.pmx$/, ".pmx");

const model_para_obj = Object.assign({}, MMD_SA_options.model_para[model_filename_raw] || MMD_SA_options.model_para[model_filename] || MMD_SA_options.model_para[model_filename_cleaned] || {});
model_para_obj._filename_raw = model_filename_raw;
model_para_obj._filename = model_filename;
model_para_obj._filename_cleaned = model_filename_cleaned;

    if (!model_para_obj.skin_default)
      model_para_obj.skin_default = { _is_empty:true }
// save some headaches and make sure that every VMD has morph (at least a dummy) in "Dungeon" mode
  if (!model_para_obj.morph_default) model_para_obj.morph_default = {}//{ _is_empty:!MMD_SA_options.Dungeon }//

    if (!model_para_obj.MME)
      model_para_obj.MME = {}
    var MME_saved = MMD_SA_options.MME_saved[model_filename] || MMD_SA_options.MME_saved[model_filename_cleaned]
    if (MME_saved) {
      model_para_obj.MME.self_overlay = Object.clone(MME_saved.self_overlay)
      model_para_obj.MME.HDR = Object.clone(MME_saved.HDR)
      model_para_obj.MME.serious_shader = Object.clone(MME_saved.serious_shader)
    }
    else {
      model_para_obj.MME.self_overlay = model_para_obj.MME.self_overlay || { enabled:false }
      model_para_obj.MME.HDR = model_para_obj.MME.HDR || { enabled:false }
      model_para_obj.MME.serious_shader = model_para_obj.MME.serious_shader || { enabled:false }
    }

model_para_obj._model_index = model_para_obj._model_index_default = model_index;
model_para_obj.is_object = true;
model_para_obj.shadow_darkness = 1;
MMD_SA_options.model_para_obj_by_filename[model_filename_raw] = model_para_obj;

MMD_SA_options.model_para_obj_all.push(model_para_obj);

new THREE.MMD.PMX().load(url, (pmx)=>{
new THREE.MMD.Model( pmx ).create( {}, function( model ) {

			var mesh = model.mesh;
			mesh.material.materials.forEach( function(v) {
				v.fog = true; // use scene fog
				v.lights = true; // use scene light
			});
			THREE.MMD.addModel( model );

new MMD_SA.THREEX.MMD_dummy_obj(model_index);

const mesh_obj_id = 'mikuPmx' + model_index;
const mesh_obj = MMD_SA_options.mesh_obj_by_id['#'+mesh_obj_id] = MMD_SA_options.mesh_obj_by_id[mesh_obj_id] = {
  id: '#'+mesh_obj_id,
  scale: 1,
  _obj: mesh,
  hide: MMD_SA_options.mesh_obj_by_id['#mikuPmx0'].hide,
  show: MMD_SA_options.mesh_obj_by_id['#mikuPmx0'].show,
};
Object.defineProperty(mesh_obj, "visible", {
  get: function () {
return this._obj.visible
  }
 ,set: function (v) {
this._obj.visible = v
  }
});

const AP = MMD_SA.ammo_proxy;
if (AP) {
  const c_list = [AP.cache_by_model, AP.cache_by_model_next, AP.cache_by_model_temp];
  c_list.forEach(function (cache, idx) {
    var obj = cache.list[model_index] = { skin:{}, _skin:{} }
    obj.matrixWorld = new THREE.Matrix4()
    obj.matrixWorld_inv = new THREE.Matrix4()
    obj.q_matrixWorld_inv = new THREE.Quaternion()
  });
}

const _mesh = mesh;
mesh = new THREE.Object3D();
mesh.add(_mesh);

onload_common(url, {scene:mesh});
resolve();

System._browser.on_animation_update.add((()=>{
  const pos = mesh.position.clone();
  const rot = mesh.quaternion.clone();
  const scale = mesh.scale.clone();
//console.log(pos, rot, scale)
  return ()=>{
    mesh.position.copy(pos);
    mesh.quaternion.copy(rot);
    mesh.scale.copy(scale);
    _mesh.scale.setScalar(1);
  };
})(),0,0);

});});

})();

      }
      else if (/\.x$/i.test(url)) {
        new THREE.XLoader( url, function( mesh ) {
const THREE = MMD_SA.THREEX.THREE;

const _mesh = mesh;
mesh = new THREE.Object3D();
mesh.add(_mesh);

onload_common(url, {scene:mesh});
resolve();
        }, function() {
        });
      }
      else if (/.(gltf|glb)$/i.test(url)) {
        MMD_SA.THREEX.utils.load_GLTF(url, (gltf)=>{
onload_common(url, gltf);
resolve();
        });
      }
      else if (/.(bpm|jpg|jpeg|png|webp|mp4|mkv|webm)$/i.test(url)) {
        const is_video = /.(mp4|mkv|webm)$/i.test(url);
        const img = (is_video) ? document.createElement('video') : new Image();
        if (is_video) {
          img.autoplay = img.loop = img.muted = true;
        }

        img.addEventListener((is_video)?'loadeddata':'load', ()=>{
const THREE = MMD_SA.THREEX.THREE;

let geometry, texture, canvas;
if (is_video) {
  geometry = new THREE.PlaneGeometry( img.videoWidth/100, img.videoHeight/100 );
  if (MMD_SA.THREEX.enabled) {
    texture = new THREE.VideoTexture(img);
  }
  else {
    canvas = document.createElement('canvas');
    canvas.width = 1024;//Math.min(img.videoWidth, 1080);
    canvas.height = 1024;//Math.min(img.videoHeight, 1080);
    texture = new THREE.Texture(canvas);
//  texture.generateMipmaps = false;
    texture.needsUpdate = true;
  }
}
else {
  geometry = new THREE.PlaneGeometry( img.width/100, img.height/100 );
  texture = new THREE.Texture(img);
  texture.needsUpdate = true;
}
if (MMD_SA.THREEX.enabled && MMD_SA.THREEX.use_sRGBEncoding) texture.encoding = THREE.sRGBEncoding ;

const material = new THREE.MeshBasicMaterial( {map:texture, side:THREE.DoubleSide} );
const plane = new THREE.Mesh( geometry, material );
if (!MMD_SA.THREEX.enabled) plane.useQuaternion = true;

const obj_all = { scene:plane };

onload_common(url, obj_all);

if (is_video) {
  const obj = object3d_list[object3d_list.length-1];
  obj.user_data.video = img;
  obj.user_data.canvas = canvas;
}

resolve();
        });

        img.src = toFileProtocol(url);
      }
    });
  };
})();

function animate_object3D() {
  object3d_list.forEach(obj=>{
    const d = obj.user_data;
    if (d.animation_mixer)
      d.animation_mixer.update(RAF_timestamp_delta/1000);
    if (d.video && d.canvas) {
      const canvas = d.canvas;
      canvas.getContext('2d').drawImage(d.video, 0,0,canvas.width,canvas.height);
      obj._obj.material.map.needsUpdate = true;
    }
  });
}

const adjust_object3D = (function () {
  const parent_bone_list = ['ROOT', '頭','首', '上半身2','上半身','左腕','左ひじ','左手首','右腕','右ひじ','右手首', '左足','左ひざ','左足首','右足','右ひざ','右足首'];

  let pos_scale = 0;

  let use_avatar_as_center = false;

  return function(e) {
if (!object3d_list.length) return;

const _THREE = MMD_SA.THREEX._THREE;

const c_pos = _THREE.MMD.getModels()[0].mesh.position;

let obj = object3d_list[object3d_index];
let mesh = obj._obj;
let ds = obj.user_data._default_state_;

let p = (obj.parent_bone) ? obj.parent_bone : mesh;

let pos_inc = ((obj.parent_bone) ? 0.1 : 0.5) * Math.pow(2, pos_scale);

let rot_inc = Math.PI/90;

const sign_center = (use_avatar_as_center) ? -1 : 1;

const ev = e.detail.e;

let pos = v3a.set(0,0,0);
let rot = e1.set(0,0,0);
let scale = 1;
switch (e.detail.keyCode) {
// left
  case 37:
    if (ev.ctrlKey) {
      rot.y -= rot_inc;
    }
    else if (ev.shiftKey) {
      rot.z -= rot_inc;
    }
    else {
      pos.x -= pos_inc * sign_center;
    }
    break
// top
  case 38:
    if (ev.ctrlKey) {
      rot.x += rot_inc;
    }
    else if (ev.shiftKey) {
      pos.y += pos_inc * sign_center;
    }
    else if (ev.altKey) {
      if (explorer_mode)
        MMD_SA_options.Dungeon.para_by_grid_id[2].ground_y += pos_inc;
    }
    else {
      pos.z -= pos_inc * sign_center;
    }
    break;
// right
  case 39:
    if (ev.ctrlKey) {
      rot.y += rot_inc;
    }
    else if (ev.shiftKey) {
      rot.z += rot_inc;
    }
    else {
      pos.x += pos_inc * sign_center;
    }
    break
// down
  case 40:
    if (ev.ctrlKey) {
      rot.x -= rot_inc;
    }
    else if (ev.shiftKey) {
      pos.y -= pos_inc * sign_center;
    }
    else if (ev.altKey) {
      if (explorer_mode)
        MMD_SA_options.Dungeon.para_by_grid_id[2].ground_y -= pos_inc;
    }
    else {
      pos.z += pos_inc * sign_center;
    }
    break;
// +
  case 61:
  case 107:
    if (ev.shiftKey) {
    }
    else if (ev.ctrlKey) {
      pos_inc /= Math.pow(2, pos_scale);
      pos_scale = Math.min(pos_scale+1, 4);
      pos_inc *= Math.pow(2, pos_scale);
    }
    else {
      scale *= 1.1;
    }
    break;
// -
  case 109:
  case 173:
    if (ev.shiftKey) {
    }
    else if (ev.ctrlKey) {
      pos_inc /= Math.pow(2, pos_scale);
      pos_scale = Math.max(pos_scale-1, -4);
      pos_inc *= Math.pow(2, pos_scale);
    }
    else {
      scale *= 1/1.1;
    }
    break;
// B
  case 66:
    const parent_bone_index = (!obj.parent_bone) ? -1 : parent_bone_list.indexOf(obj.parent_bone.name);
    if (obj.parent_bone && (parent_bone_index == -1))
      parent_bone_list.push(obj.parent_bone.name);
    if ((parent_bone_index == -1) || (parent_bone_index < parent_bone_list.length-1)) {
      use_avatar_as_center = false;
      const parent_bone_name = parent_bone_list[parent_bone_index+1];
      obj.parent_bone = { model_index:0, name:parent_bone_name, position:{x:0,y:0,z:-1}, rotation:{x:0,y:0,z:0} };
      if (parent_bone_index == -1) {
        MMD_SA_options.Dungeon.accessory_list.push(obj);
      }
      p = obj.parent_bone;
    }
    else {
      delete obj.parent_bone;
      use_avatar_as_center = explorer_mode;
      MMD_SA_options.Dungeon.accessory_list = MMD_SA_options.Dungeon.accessory_list.filter(a => a !== obj);
      p = mesh;
      mesh.position.copy(c_pos);
// re-enable .matrixAutoUpdate as accessory disabled it
      mesh.matrixAutoUpdate = true;
    }
    obj.no_collision = !explorer_mode || !!obj.parent_bone;
    break;
// C
  case 67:
    if (obj.parent_bone) {
      speech_bubble2('(Center is always the object\'s center when it is attached to a bone.)', 3);
      return;
    }
    if (explorer_mode) {
      speech_bubble2('(Center is always the avatar\'s center when explorer mode is on and the object is unattached.)', 5);
      return;
    }
    use_avatar_as_center = !use_avatar_as_center;
    speech_bubble2(((use_avatar_as_center) ? 'Avatar' : 'Object') + ' as center', 2);
    break;
// O
  case 79:
    if (++object3d_index >= object3d_list.length)
      object3d_index = 0;

    obj = object3d_list[object3d_index];
    mesh = obj._obj;
    ds = obj.user_data._default_state_;

    p = (obj.parent_bone) ? obj.parent_bone : mesh;

    pos_inc = ((obj.parent_bone) ? 0.1 : 0.5) * Math.pow(2, pos_scale);
    break;
// R
  case 82:
    if (!e.detail.reset_confirmed) {
      MMD_SA_options.Dungeon.run_event({
message: {
  index: 1,
  content: 'Are you sure you want to reset this 3D object to its initial status?\n8. Yes\n9. Cancel',
  para: { scale:0.75 },
  branch_list: [
    { key:8, event_id:{ sb_index:1, func:()=>{setTimeout(()=>{adjust_object3D({detail:{reset_confirmed:true,keyCode:82,ev:{},result:{}}})},0)}, ended:true } },
    { key:9, event_id:{ sb_index:1, ended:true } },
  ]
}
      });
    }
    else {
      let p_rot;
      if (ds.parent_bone_name) {
        if (!obj.parent_bone) {
          obj.parent_bone = { model_index:0, name:ds.parent_bone_name, position:{x:0,y:0,z:-1}, rotation:{x:0,y:0,z:0} };
          MMD_SA_options.Dungeon.accessory_list.push(obj);
        }
        p = obj.parent_bone;
        p_rot = p.rotation;
      }
      else {
        if (obj.parent_bone) {
          delete obj.parent_bone;
          MMD_SA_options.Dungeon.accessory_list = MMD_SA_options.Dungeon.accessory_list.filter(a => a !== obj);
        }
        p = mesh;
        p_rot = obj.user_data._rotation_;
        p_rot.x = p_rot.y = p_rot.z = 0;
// re-enable .matrixAutoUpdate as accessory disabled it
        mesh.matrixAutoUpdate = true;
      }
      if (!obj.parent_bone) {
        mesh.position.copy(ds.position);
      }

      mesh.scale.setScalar(ds.scale);

      use_avatar_as_center = !ds.parent_bone_name && explorer_mode;

      speech_bubble2('(Reset successful)', 2);
    }
    break;
// X
  case 88:
    if (!e.detail.remove_confirmed) {
      MMD_SA_options.Dungeon.run_event({
message: {
  index: 1,
  content: 'Are you sure you want to remove this 3D object from the scene?\n8. Yes\n9. Cancel',
  para: { scale:0.75 },
  branch_list: [
    { key:8, event_id:{ sb_index:1, func:()=>{setTimeout(()=>{adjust_object3D({detail:{remove_confirmed:true,keyCode:88,ev:{},result:{}}})},0)}, ended:true } },
    { key:9, event_id:{ sb_index:1, ended:true } },
  ]
}
      });
    }
    else {
      remove_object3D(object3d_index);

      if (!object3d_index.length) {
        System._browser.DEBUG_show();
        e.detail.result.return_value = true;
        return;
      }

      obj = object3d_list[object3d_index];
      mesh = obj._obj;
      ds = obj.user_data._default_state_;

      p = (obj.parent_bone) ? obj.parent_bone : mesh;

      pos_inc = ((obj.parent_bone) ? 0.1 : 0.5) * Math.pow(2, pos_scale);
    }
    break;
  default:
    return;
}

if (use_avatar_as_center && !obj.parent_bone) {
  pos.add(v3b.copy(p.position).sub(c_pos).multiplyScalar(scale)).applyEuler(rot).add(c_pos);
}
else {
  pos.add(v3b.copy(p.position));
}

p.position.x = pos.x;
p.position.y = pos.y;
p.position.z = pos.z;

if (obj.parent_bone) {
　　rot.fromArray(rot.toArray().slice(0,3).map(v=>Math.round(v*180/Math.PI)));
  p.rotation.x += rot.x;
  p.rotation.y += rot.y;
  p.rotation.z += rot.z;
}
else {
  obj.user_data._rotation_.add(rot);
}

mesh.scale.multiplyScalar(scale);

System._browser.DEBUG_show([
  (object3d_index+1) + '/' + object3d_list.length + ': ' + obj.user_data.id,
  '',
  'Position(±' + (Math.round(pos_inc*1000)/1000) + '): ' + ((obj.parent_bone) ? v3a.copy(p.position) : v3a.copy(p.position).sub(c_pos)).toArray().map(v=>Math.round(v*10)/10),
  'Rotation(±' + (2) + '°): ' + ((obj.parent_bone) ? e1.copy(p.rotation).toArray().slice(0,3) : e1.copy(obj.user_data._rotation_).toArray().slice(0,3).map(v=>Math.round(v*180/Math.PI))),
  'Scale: ' + Math.round(mesh.scale.x*10)/10,
  '',
  'Ground Y(±' + (Math.round(pos_inc*1000)/1000) + '): ' + Math.round(MMD_SA_options.Dungeon.para_by_grid_id[2].ground_y*10)/10,
  '',
  ((obj.parent_bone) ? 'Attach to: ' + (MMD_SA.THREEX.VRM.bone_map_MMD_to_VRM[obj.parent_bone.name] || obj.parent_bone.name) : 'Center: ' + ((use_avatar_as_center) ? 'Avatar' : 'Object')),
].join('\n'));

if (!obj.parent_bone)
  mesh.quaternion.setFromEuler(obj.user_data._rotation_);

highlight_object(obj);

e.detail.result.return_value = true;
  };
})();

var explorer_mode = false;
function build_octree(object3d) {
  object3d.no_collision = !explorer_mode || !!object3d.parent_bone;

  if (!object3d.use_octree && (!explorer_mode || object3d.parent_bone)) return;

  const obj_cached = object3d_cache.get(object3d.user_data.path);
  const mesh_parent = obj_cached._obj;

  const bounding_host = MMD_SA.get_bounding_host(mesh_parent);
  if (!bounding_host.boundingBox) {
    bounding_host.boundingBox = MMD_SA.THREEX.utils.computeBoundingBox(mesh_parent);
  }
  if (!bounding_host.boundingBox_list)
    bounding_host.boundingBox_list = [bounding_host.boundingBox];
  if (!bounding_host.boundingSphere)
    bounding_host.boundingSphere = bounding_host.boundingBox.getBoundingSphere(new THREE.Sphere());

  if (!object3d._obj_base.octree) {
    const octree = new THREEX.Octree();
    octree.fromGraphNode( object3d._obj );
    object3d._obj_base.octree = octree;
    console.log('octree', object3d);
  }
}

var grid_plane;
function add_grid() {
  if (grid_plane) {
    if (!explorer_mode) {
      grid_plane.visible = true;
      grid_plane.children.forEach(c=>c.visible=true);
    }
    return;
  }

  const THREE = MMD_SA.THREEX.THREE;
  const _THREE = MMD_SA.THREEX._THREE;

  const geometry_base = new THREE.PlaneGeometry( 30*5, 30*5 );
  const geometry = new THREE.PlaneGeometry( 30*5, 30*5, 30, 30 );

  const m4 = new THREE.Matrix4().makeRotationX(THREE.Math.degToRad(-90));
  geometry_base.applyMatrix(m4);
  geometry.applyMatrix(m4);

  let line;
  if (MMD_SA.THREEX.enabled) {
    line = new THREE.GridHelper( 30*5, 30, '#000', '#000' );
    line.material.transparent = true;
  }
  else {
    const material = new THREE.MeshBasicMaterial( { color:'#000', wireframe:true, transparent:true } );
    line = new THREE.Mesh( geometry, material );
  }

  grid_plane = new THREE.Object3D();
  grid_plane.add(line);

  const material_base = new THREE.MeshBasicMaterial( { color:'#FFF', transparent:true });
  const mesh_base = new THREE.Mesh(geometry_base, material_base);
  mesh_base.position.y -= 0.05;
  grid_plane.add(mesh_base);

  if (!MMD_SA.THREEX.enabled) grid_plane.useQuaternion = true;

  grid_plane.position.copy(_THREE.MMD.getModels()[0].mesh.position);
  grid_plane.position.y += 0.1;

  MMD_SA.THREEX.scene.add(grid_plane);

// can be changed only after scene.add for _THREE
  if (grid_plane.children[1])
    grid_plane.children[1].material.opacity = 0.5;
}

window.addEventListener('SA_Dungeon_onrestart', ()=>{remove_object3D()});
function remove_object3D(index) {
  ((index == null) ? object3d_list : [object3d_list[index]]).forEach(object3d => {
    MMD_SA.THREEX.scene.remove(object3d._obj);

    if (object3d.parent_bone)
      MMD_SA_options.Dungeon.accessory_list = MMD_SA_options.Dungeon.accessory_list.filter(a => a !== object3d);

    const d = object3d.user_data;
    if (d.animation_mixer) {
      d.animation_mixer.stopAllAction();
      d.animation_mixer.uncacheClip(d.animation_clip);
    }
    if (d.video) {
      d.video.pause();
      delete d.video;
    }

    MMD_SA.THREEX.utils.dispose(object3d._obj);
    delete object3d._obj;
    delete object3d._mesh;
  });

  if (index == null) {
    object3d_list.length = 0;
  }
  else {
    const path = object3d_list[index].user_data.path;
    object3d_list = MMD_SA.THREEX._object3d_list_ = object3d_list.filter(object3d=>object3d._obj);
//    if (!object3d_list.some(object3d=>object3d.user_data.path==path)) object3d_cache.delete(path);
  }

  object3d_index = 0;

  if (!object3d_list.length) {
    object3d_cache.clear();
    delete MMD_SA.THREEX._object3d_list_;
  }
}

var panorama_loading;
var panorama_src, panorama_index;
var panorama_list = [
  '',
  System.Gadget.path + '/images/_dungeon/tex/ryntaro_nukata/blue_sky.jpg',
  System.Gadget.path + '/images/_dungeon/tex/ryntaro_nukata/angel_staircase.jpg',
  System.Gadget.path + '/images/_dungeon/tex/stars_milky_way.jpg',
];
function change_panorama(index, src) {
  function show() {
    panorama_loading = false;
    sd.texture_index = index;
    sd.texture_setup();
    System._browser.camera.display_floating = (MMD_SA_options.user_camera.display.floating || (MMD_SA_options.user_camera.display.floating_auto !== false));

    panorama_index = index;
    panorama_src = src;
  }

  var sd = MMD_SA_options.Dungeon_options.skydome
  if (panorama_loading) {
    DEBUG_show('(panorama still loading)', 2)
    return
  }
  if (index && sd.texture_cache_list[index] && sd.texture_cache_list[index].complete) {
    show()
    return
  }

  if (!src) src = panorama_list[index];

  let resolve_func;
  const promise = new Promise((resolve)=>{ resolve_func=resolve; });

  panorama_loading = true;
  var image = sd.texture_cache_list[index] = sd.texture_cache_list[index] || new Image();
  image.onload = ()=>{
    show();
    resolve_func();
  };
  image.onerror = ()=>{
    panorama_loading = false;
    resolve_func();
  };
  image.src = toFileProtocol(src);

  return promise;
}

var dome_axis_angle = 0
var dome_rotation_speed = 0
var dome_rotation = 0
function rotate_dome() {
  var axis = v3a.set(0,1,0);
  axis.applyEuler(e1.set(0, 0, dome_axis_angle/180*Math.PI));
  dome_rotation = (dome_rotation + RAF_timestamp_delta/(1000*60*10) * dome_rotation_speed * 360) % 360;

  MMD_SA_options.mesh_obj_by_id["DomeMESH"]._obj.useQuaternion = true
  MMD_SA_options.mesh_obj_by_id["DomeMESH"]._obj.quaternion.setFromAxisAngle(axis, dome_rotation/180*Math.PI)
}

const onDrop_scene_JSON = (function () {
  const RE_arm = new RegExp("^(" + toRegExp(["左","右"],"|") + ")(" + toRegExp(["腕","ひじ","手"],"|") + ")(.*)$");

  function adjust_parent_bone(p_bone, is_T_pose) {
if (RE_arm.test(p_bone.name)) {
  const pos_vector = MMD_SA.TEMP_v3.set(p_bone.position.x, p_bone.position.y, -p_bone.position.z);
  const dir = (RegExp.$1 == '左') ? 1 : -1;
  const rot_axis = MMD_SA.THREEX.rot_arm_axis[dir * ((is_T_pose) ? 1 : -1)];
  pos_vector.applyQuaternion(rot_axis);
  p_bone.position.x =  pos_vector.x;
  p_bone.position.y =  pos_vector.y;
  p_bone.position.z = -pos_vector.z;
}

const obj_rot = MMD_SA._q1.setFromEuler(MMD_SA.TEMP_v3.set(-p_bone.rotation.x, -p_bone.rotation.y, p_bone.rotation.z).multiplyScalar(Math.PI/180), 'YXZ');
if (is_T_pose) {
  obj_rot.fromArray(MMD_SA.THREEX.utils.convert_A_pose_rotation_to_T_pose(p_bone.name, obj_rot.toArray()));
}
else {
  obj_rot.fromArray(MMD_SA.THREEX.utils.convert_T_pose_rotation_to_A_pose(p_bone.name, obj_rot.toArray()));
}
const obj_rot_euler = MMD_SA.TEMP_v3.setEulerFromQuaternion(obj_rot, 'YXZ').multiplyScalar(180/Math.PI);
p_bone.rotation.x = -obj_rot_euler.x;
p_bone.rotation.y = -obj_rot_euler.y;
p_bone.rotation.z =  obj_rot_euler.z;

p_bone.is_T_pose = is_T_pose;
  }

  async function parse_scene(json, zip_path) {
    async function locate_file(zip, obj, type) {
      if (!obj || !obj.path) return false;

      if (!zip) {
        if (FSO_OBJ.FileExists(obj.path)) return true;
        show_status('❎"' + filename + '"');
        return false;
      }

      const filename = obj.path.replace(/^.+[\/\\]/, '');
      const obj_list = zip.file(new RegExp(toRegExp(filename), "i"));
      if (!obj_list.length) {
        show_status('"' + filename + '" not found');
        return false;
      }
      obj.path = zip_path + '#\\' + obj_list[0].name.replace(/\//g, '\\');
      await System._browser.update_obj_url(obj.path, type);
      return true;
    }

    async function parse_motion(motion_list) {
      if (!motion_list) return;

      let load_count = 0
      const _motion_list = [];
      for (const motion of motion_list) {
        if (await locate_file(zip, motion))
          _motion_list.push(motion);
      }

      const promise_list = [];
      _motion_list.forEach((motion)=>{
        const filename = motion.path.replace(/^.+[\/\\]/, "").replace(/\.([a-z0-9]{1,4})$/i, "");
        if (motion.para)
          MMD_SA_options.motion_para[filename] = Object.assign(MMD_SA_options.motion_para||{}, motion.para);

        promise_list.push(MMD_SA.load_external_motion(motion.path, false));
      });
      return Promise.all(promise_list);
    }

    async function parse_event(ev, event_name) {
      if (!ev) return;

      const e = ev[event_name];
      if (await locate_file(zip, e, 'text/javascript')) {
        const filename = e.path.replace(/^.+[\/\\]/, '');
        const module = await import(toFileProtocol(e.path));
        await module[event_name](event_para);
        show_status('✅Event: ' + event_name);
      }

      if (!e) return;

      if (e.motion) {
        await parse_motion(e.motion);

        MMD_SA_options._motion_shuffle_list_default = e.motion.map(motion=>MMD_SA_options.motion_index_by_name[motion.path.replace(/^.+[\/\\]/, "").replace(/\.([a-z0-9]{1,4})$/i, "")]);
        MMD_SA_options.motion_shuffle_list_default = MMD_SA_options._motion_shuffle_list_default.slice();
        MMD_SA._force_motion_shuffle = true;
      }
    }

    async function check_loaded(count=0) {
      loaded_count += count;
      if (loaded_counting || (loaded_count < loaded_count_max)) return;

      await parse_event(json.XR_Animator_scene.on, 'load');

      show_status('✅Scene loaded (' + (loaded_count + '/' + loaded_count_max) + ')', 5);
      resolve_func();
    }

    if (!json.XR_Animator_scene) {
      show_status('No scene data found');
      return;
    }

    show_status('Loading scene...', 99);

    const zip = (zip_path) ? XMLHttpRequestZIP.zip_by_url(zip_path) : null;

    let loaded_count = 0;
    let loaded_count_max = 0;
    let loaded_counting = true;
    let resolve_func;
    const promise = new Promise((resolve)=>{ resolve_func=resolve; });

    if (!json.XR_Animator_scene.on) json.XR_Animator_scene.on = {};

    const event_para = { json:json, zip:zip, zip_path:zip_path, locate_file:locate_file };

    await parse_event(json.XR_Animator_scene.on, 'init');

    const wallpaper = json.XR_Animator_scene.wallpaper;
    if (wallpaper) {
      const v_bg = document.getElementById("VdesktopBG");
      if (v_bg) {
        v_bg.pause();
        v_bg.style.visibility = 'hidden';
      }

      if (wallpaper.path) {
        if (await locate_file(zip, wallpaper))
          onDrop_change_wallpaper({ isFileSystem:true, path:wallpaper.path });
      }
      if (wallpaper.color) {
        document.body.style.backgroundColor = wallpaper.color;
        if (!wallpaper_src)
          LdesktopBG_host.style.display = "none";
      }

      show_status('✅Wallpaper');
      loaded_count++;
      loaded_count_max++;
    }

    const panorama = json.XR_Animator_scene.panorama;
    if (panorama) {
      if (panorama.path) {
        if (!await locate_file(zip, panorama))
          panorama.index = -1;
      }
      if (panorama.index >= 0) {
        loaded_count_max++;
        change_panorama(panorama.index, panorama.path).then(()=>{
          show_status('✅Panorama');
          check_loaded(1);
        });

        if (panorama.rotation_speed) {
          dome_axis_angle = panorama.axis_angle;
          dome_rotation_speed = panorama.rotation_speed;
          System._browser.on_animation_update.remove(rotate_dome,1);
          System._browser.on_animation_update.add(rotate_dome,0,1,-1);
        }
      }
    }

    const object3D_list = json.XR_Animator_scene.object3D_list;
    if (object3D_list) {
      const is_T_pose = MMD_SA.THREEX.get_model(0).is_T_pose;
      for (const obj of object3D_list) {
        if (obj.type == 'object3D') {
          if (!await locate_file(zip, obj)) continue;

          const filename = obj.path.replace(/^.+[\/\\]/, '');
          const p_bone = obj.model_para.parent_bone;
          if (p_bone && (p_bone.is_T_pose != null) && ((p_bone.is_T_pose) ? !is_T_pose : is_T_pose))
            adjust_parent_bone(p_bone, is_T_pose);

          loaded_count_max++;
          onDrop_add_object3D({ isFileSystem:true, path:obj.path, _obj_json:obj }).then(()=>{
            show_status('✅"' + filename + '"');
            check_loaded(1);
          });
        }
      }
    }

    const motion_list = json.XR_Animator_scene.motion_list;
    if (motion_list) {
      loaded_count_max++;
      await parse_motion(motion_list);
      show_status('✅Motion');
      check_loaded(1);
    }

    loaded_counting = false;
    check_loaded();

    return promise;
  }

  function show_status(msg, duration=msg_duration) {
    msg_log.push(msg.toString().substring(0,30));
    msg_duration = duration;
    if (msg_log.length > 8) {
      const ini = msg_log.length - 8;
      msg_log = msg_log.slice(ini, ini+8);
    }
    speech_bubble2(msg_log.join('\n'), msg_duration);
  };

  var msg_log = [];
  var msg_duration = 5;

  return async function (item) {
    MMD_SA_options.Dungeon.run_event({ ended:true });

    msg_log.length = 0;
    msg_duration = 0;

    var src = item.path;
    if (item.isFileSystem && /([^\/\\]+)\.zip$/i.test(src)) {
      let zip_file = SA_topmost_window.DragDrop._path_to_obj && SA_topmost_window.DragDrop._path_to_obj[src.replace(/^(.+)[\/\\]/, "")];

      const zip = await new self.JSZip().loadAsync(zip_file);

// will be called, even if content is corrupted

      XMLHttpRequestZIP.zip_by_url(src, zip);

      const scene_list = zip.file(/scene\.json$/i);
      if (!scene_list.length) {
        show_status('No scene data found');
        return;
      }

      const txt = await scene_list[0].async("text");
      const json = JSON.parse(txt);

      parse_scene(json, src);
    }
    else if (item.isFileSystem && /([^\/\\]+)\.json$/i.test(src)) {
      if (!webkit_electron_mode) {
        show_status('NOTE: In browser mode, you need to drop the zip including all assets and "scene.json".', 10);
        return;
      }

      const response = await fetch(toFileProtocol(src));
      const json = await response.json();

      parse_scene(json);
    }
    else {
      _onDrop_finish.call(DragDrop, item)
    }
  };
})();

function export_scene_JSON() {
  const scene_json = {};

  const object3D_list_json = scene_json.object3D_list = [];
  object3d_list.forEach(obj=>{
    const mesh = obj._obj;
    const ds = obj.user_data._default_state_;

    const obj_json = { type:'object3D', path:obj.user_data.path.replace(/(\.zip)\#[^\#]+$/i, '$1') }
    const model_para = obj_json.model_para = {};
    const placement = model_para.placement = { scale:mesh.scale.x };
    if (obj.parent_bone) {
      model_para.parent_bone = { model_index:0, is_T_pose:MMD_SA.THREEX.get_model(0).is_T_pose, name:obj.parent_bone.name, position:obj.parent_bone.position, rotation:obj.parent_bone.rotation };
    }
    else {
      const c_pos = MMD_SA.THREEX._THREE.MMD.getModels()[0].mesh.position;
      const pos = v3a.copy(mesh.position).sub(c_pos);
      placement.position = { x:pos.x, y:pos.y, z:pos.z };

      const rot = e1.copy(obj.user_data._rotation_).multiplyScalar(180/Math.PI);
      placement.rotation = { x:Math.round(rot.x), y:Math.round(rot.y), z:Math.round(rot.z) };
    }

    object3D_list_json.push(obj_json);
  });

  if (wallpaper_src) {
    scene_json.wallpaper = { path:wallpaper_src, color:document.body.style.backgroundColor };
  }
  else if (LdesktopBG_host.style.display == 'none') {
    scene_json.wallpaper = { color:document.body.style.backgroundColor };
  }

  if (panorama_index != null) {
    scene_json.panorama = {
      index: panorama_index,
      axis_angle: dome_axis_angle,
      rotation_speed: dome_rotation_speed,
    };
    if (panorama_index == 0)
      scene_json.panorama.path = panorama_src;
  }

  System._browser.save_file('scene.json', JSON.stringify({ XR_Animator_scene:scene_json }, null, '\t'), 'application/json');
}

var v3a, v3b;
var e1, e2;
var q1, q2;
window.addEventListener('jThree_ready', ()=>{
  const THREE = MMD_SA.THREEX.THREE;
  v3a = new THREE.Vector3();
  v3b = new THREE.Vector3();
  e1 = new THREE.Euler();
  e2 = new THREE.Euler();
  q1 = new THREE.Quaternion();
  q2 = new THREE.Quaternion();

  MMD_SA.THREEX.utils.camera_auto_targeting({
    id:'face',
    enabled: MMD_SA_options.camera_face_locking,
    condition: ()=>{
return !explorer_mode && MMD_SA_options.Dungeon.started && (MMD_SA_options.mesh_obj_by_id["DomeMESH"]._obj.visible || object3d_list.some(obj=>!obj.parent_bone)) && !MMD_SA.THREEX._THREE.MMD.getCameraMotion().length;
    },
  });
});


function ML_off() {
  MMD_SA.WebXR.user_camera.facemesh.enabled = false
  MMD_SA.WebXR.user_camera.poseNet.enabled = false
  MMD_SA.WebXR.user_camera.handpose.enabled = false
  MMD_SA_options.Dungeon_options.item_base['pose'].action._motion_list_index = -1
  MMD_SA_options.Dungeon_options.item_base['pose'].action.func()
}

function mirror_3D_off() {
  if (MMD_SA_options.user_camera.mirror_3D) {
    System._browser.camera.hide()
    MMD_SA_options.user_camera.mirror_3D = 0
    System._browser.camera.show()
  }
}

var bg_state_default, bg_color_default, bg_wallpaper_default, webcam_as_bg_default;
var _onDrop_finish;

window.addEventListener('jThree_ready', (e)=>{
  bg_state_default = LdesktopBG_host.style.display;
  bg_color_default = document.body.style.backgroundColor;
  bg_wallpaper_default = LdesktopBG.style.backgroundImage;
  webcam_as_bg_default = !!MMD_SA_options.user_camera.display.webcam_as_bg;

  _onDrop_finish = DragDrop._ondrop_finish;
});

function reset_scene_explorer() {
  explorer_mode = false;
  MMD_SA_options.Dungeon._states.action_allowed_in_event_mode = false;
  MMD_SA_options.Dungeon_options.character_movement_disabled = true;

  if (MMD_SA_options.Dungeon_options.camera_position_z_sign != 1) {
    MMD_SA_options.Dungeon_options.camera_position_z_sign = 1;
    MMD_SA_options.Dungeon.update_camera_position_base();

    const c = MMD_SA_options.Dungeon.character;
    if (c.about_turn) {
      c.about_turn = false;
      c.rot.y += Math.PI;
    }
    c.pos_update();
  }

  MMD_SA_options.Dungeon.para_by_grid_id[2].ground_y = THREE.MMD.getModels()[0].mesh.position.y;//.ground_y_visible

  object3d_list.forEach(object3d=>{
    object3d.no_collision = true;
  });
}

var outline_para = {
  thickness: 0.01,
  color: [ 1, 1, 1 ],
  alpha: 0.8,
  visible: true,
};

function highlight_object(obj) {
  if (!MMD_SA.THREEX.enabled) return;

  MMD_SA.THREEX.use_OutlineEffect = true;

  clear_highlight();

  if (obj.user_data.highlighted) return;
  obj.user_data.highlighted = true;

  obj._obj.traverseVisible(obj=>{
    if (obj.isMesh) {
      obj.userData.outlineParameters = { visible:true };
      if (Array.isArray(obj.material)) {
        obj.material.forEach(m=>{
          m.userData.outlineParameters = outline_para;
        });
      }
      else {
        obj.material.userData.outlineParameters = outline_para;
      }
    }
  });
}

function clear_highlight() {
  if (!MMD_SA.THREEX.enabled) return;

  object3d_list.forEach(obj=>{
    if (!obj.user_data.highlighted) return;
    obj.user_data.highlighted = false;

    obj._obj.traverseVisible(obj=>{
      if (obj.isMesh && obj.userData.outlineParameters)
        obj.userData.outlineParameters.visible = false;
    });
  });
}

function reset_scene_UI() {
  reset_scene_explorer();

  clear_highlight();
  MMD_SA.THREEX.use_OutlineEffect = false;

  DragDrop.onDrop_finish = _onDrop_finish;
  window.removeEventListener('SA_keydown', adjust_object3D);
  System._browser.camera._info = '';
  Ldebug.style.transformOrigin = Ldebug.style.transform = '';
  DEBUG_show();
  if (grid_plane) {
    grid_plane.visible = false;
    grid_plane.children.forEach(c=>c.visible=false);
  }
}

var _overlay_mode = -1;

var bg_branch = 5;
var done_branch = bg_branch + 6;//11
var panorama_branch = done_branch + 1;//12
var object3D_branch = panorama_branch + 6;//18
var about_branch = object3D_branch + 3;//21
var export_motion_branch = about_branch + 1;//22
var other_options_branch = export_motion_branch + 1;//23
var record_motion_branch = export_motion_branch + 3;//25
var mocap_options_branch = record_motion_branch + 4;//29
var facemesh_options_branch = mocap_options_branch + 5;//34
var motion_control_branch = facemesh_options_branch + 6;//40

return [
//0
      [
        {
          _show_other_options_: false,

          message: {
  get content() { this._motion_for_export_ = /\.(bvh|fbx)$/i.test(MMD_SA.vmd_by_filename[MMD_SA.MMD.motionManager.filename].url) || System._browser.camera.motion_recorder.vmd; return (!MMD_SA_options.Dungeon.events["_FACEMESH_OPTIONS_"][0]._show_other_options_ && System._browser.camera.ML_enabled) ? ((this._motion_for_export_) ? '1. Export motion to file\n2. Record motion\n3. Mocap options\n4. Mocap OFF' : '1. Record motion\n2. Mocap options\n3. Mocap OFF\n4. Enable motion control') + '\n5. Other options\n6. Cancel' : '1. Overlay & UI\n2. BG/Scene/3D\n3. Miscellaneous Options\n4. Export motion to file\n5. About XR Animator\n6. Cancel'; }
 ,bubble_index: 3
 ,get branch_list() {
return (!MMD_SA_options.Dungeon.events["_FACEMESH_OPTIONS_"][0]._show_other_options_ && System._browser.camera.ML_enabled) ? ((this._motion_for_export_) ? [
  { key:1, branch_index:export_motion_branch },
  { key:2, branch_index:record_motion_branch },
  { key:3, branch_index:mocap_options_branch },
  { key:4, branch_index:2 },
  { key:5, event_id:{ func:()=>{MMD_SA_options.Dungeon.events["_FACEMESH_OPTIONS_"][0]._show_other_options_=true;setTimeout(()=>{MMD_SA_options.Dungeon.events["_FACEMESH_OPTIONS_"][0]._show_other_options_=false},0);}, goto_event: { id:"_FACEMESH_OPTIONS_", branch_index:0 } } },
  { key:6 }
] : [
  { key:1, branch_index:record_motion_branch },
  { key:2, branch_index:mocap_options_branch },
  { key:3, branch_index:2 },
  { key:4, branch_index:motion_control_branch },
  { key:5, event_id:{ func:()=>{MMD_SA_options.Dungeon.events["_FACEMESH_OPTIONS_"][0]._show_other_options_=true;setTimeout(()=>{MMD_SA_options.Dungeon.events["_FACEMESH_OPTIONS_"][0]._show_other_options_=false},0);}, goto_event: { id:"_FACEMESH_OPTIONS_", branch_index:0 } } },
  { key:6 }
]) : [
  { key:1, branch_index:1 },
  { key:2, branch_index:3 },
  { key:3, branch_index:other_options_branch },
  { key:4, branch_index:export_motion_branch },
  { key:5, branch_index:about_branch },
  { key:6 }
];
  }
          }
        }
      ]

     ,[
        {
          goto_event: { id:"_SETTINGS_", branch_index:11 }
        }
      ]

     ,[
        {
          func: function () {
ML_off()
          }
         ,ended: true
        }
      ]

     ,[
        {
          func: function () {
DragDrop.onDrop_finish = onDrop_scene_JSON;

window.removeEventListener('SA_MMD_before_render', animate_object3D);
window.addEventListener('SA_MMD_before_render', animate_object3D);
          }
         ,message: {
  get content() { return 'Choose a feature to change, or drop a scene JSON ' + ((webkit_electron_mode) ? '' : 'zipped with all required models ') + 'to change everything at once.\n1. Background image\n2. 3D panorama\n3. 3D object\n4. Export scene JSON\n5. Back to default\n6. Cancel'; }
 ,bubble_index: 3
 ,branch_list: [
    { key:1, branch_index:bg_branch }
   ,{ key:2, branch_index:panorama_branch }
   ,{ key:3, branch_index:object3D_branch }
   ,{ key:4, event_id:{
        func:()=>{ export_scene_JSON(); }
       ,goto_event: { id:"_FACEMESH_OPTIONS_", branch_index:done_branch }
      }
    }
   ,{ key:5, branch_index:4 }//keep_dialogue_branch_list:true, 
   ,{ key:6 }
  ]
          }
        }
      ]

     ,[
        {
          message: {
//  index: 1,
//  para: { scale:0.75 },
  content: 'Are you sure you want to reset the whole scene back to the default status?\n1. Yes\n2. Cancel',
  para: { no_word_break:true },
  branch_list: [
//    { key:8, event_index:1 },
//    { key:9, event_id:{ sb_index:1, ended:true } },
    { key:1, event_index:1 },
    { key:2, event_index:999 },
  ]
          }
        },
        {
          func: function () {
const v_bg = document.getElementById("VdesktopBG");
if (v_bg) {
  v_bg.pause();
  v_bg.style.visibility = 'hidden';
}

LdesktopBG_host.style.display = bg_state_default
document.body.style.backgroundColor = bg_color_default
LdesktopBG.style.backgroundImage = bg_wallpaper_default
MMD_SA_options.user_camera.display.webcam_as_bg = webcam_as_bg_default

MMD_SA_options.mesh_obj_by_id["DomeMESH"]._obj.visible = false
dome_axis_angle = 0
dome_rotation = 0
dome_rotation_speed = 0
System._browser.on_animation_update.remove(rotate_dome,1)

remove_object3D();

System._browser.camera.display_floating = false
          }
         ,goto_event: { id:"_FACEMESH_OPTIONS_", branch_index:done_branch }
        }
      ]
//5
     ,[
        {
          func: function () {
DragDrop.onDrop_finish = onDrop_change_wallpaper;
          }
         ,message: {
  content: 'Choose a BG option below, or drop an image/video file to change wallpaper.\n1. Default\n2. Black\n3. White\n4. Green\n5. Webcam as BG\n6. Done'
 ,bubble_index: 3
 ,branch_list: [
    { key:1, branch_index:bg_branch+1 }
   ,{ key:2, branch_index:bg_branch+2 }
   ,{ key:3, branch_index:bg_branch+3 }
   ,{ key:4, branch_index:bg_branch+4 }
   ,{ key:5, branch_index:bg_branch+5 }
   ,{ key:6, branch_index:bg_branch+6 }
  ]
          }
        }
      ]

     ,[
        {
          func: function () {
const v_bg = document.getElementById("VdesktopBG");
if (v_bg) {
  v_bg.pause();
  v_bg.style.visibility = 'hidden';
}

LdesktopBG_host.style.display = bg_state_default
document.body.style.backgroundColor = bg_color_default
LdesktopBG.style.backgroundImage = bg_wallpaper_default
MMD_SA_options.user_camera.display.webcam_as_bg = webcam_as_bg_default
          }
         ,goto_branch: bg_branch
        }
      ]

     ,[
        {
          func: function () {
const v_bg = document.getElementById("VdesktopBG");
if (v_bg) {
  v_bg.pause();
  v_bg.style.visibility = 'hidden';
}

LdesktopBG_host.style.display = "none"
document.body.style.backgroundColor = "#000000"
          }
         ,goto_branch: bg_branch
        }
      ]

     ,[
        {
          func: function () {
const v_bg = document.getElementById("VdesktopBG");
if (v_bg) {
  v_bg.pause();
  v_bg.style.visibility = 'hidden';
}

LdesktopBG_host.style.display = "none"
document.body.style.backgroundColor = "#FFFFFF"
          }
         ,goto_branch: bg_branch
        }
      ]

     ,[
        {
          func: function () {
const v_bg = document.getElementById("VdesktopBG");
if (v_bg) {
  v_bg.pause();
  v_bg.style.visibility = 'hidden';
}

LdesktopBG_host.style.display = "none"
document.body.style.backgroundColor = "#00FF00"
          }
         ,goto_branch: bg_branch
        }
      ]
// 10
     ,[
        {
          func: function () {
const v_bg = document.getElementById("VdesktopBG");
if (v_bg) {
  v_bg.pause();
  v_bg.style.visibility = 'hidden';
}

MMD_SA_options.user_camera.display.webcam_as_bg = true
DEBUG_show('(Use webcam as BG)', 2)
          }
         ,goto_branch: bg_branch
        }
      ]

     ,[
        {
          func: function () {
reset_scene_UI();
          }
         ,ended: true
        }
      ]

     ,[
        {
          func: function () {
DragDrop.onDrop_finish = onDrop_change_panorama;
          }
         ,message: {
  content: 'Choose a 3D panorama, or drop a panorama image file.\n1. Blue sky\n2. Angel\'s staircase\n3. Stars & Milky Way\n4. >> Rotation speed+\n5. >> Rotation angle+\n6. Done'
 ,bubble_index: 3
 ,branch_list: [
    { key:1, branch_index:panorama_branch+1 }
   ,{ key:2, branch_index:panorama_branch+2 }
   ,{ key:3, branch_index:panorama_branch+3 }
   ,{ key:4, branch_index:panorama_branch+4 }
   ,{ key:5, branch_index:panorama_branch+5 }
   ,{ key:6, branch_index:done_branch }
  ]
          }
        }
      ]

     ,[
        {
          func: function () {
change_panorama(1);
          }
         ,goto_branch: panorama_branch
        }
      ]

     ,[
        {
          func: function () {
change_panorama(2);
          }
         ,goto_branch: panorama_branch
        }
      ]
// 15
     ,[
        {
          func: function () {
change_panorama(3);
          }
         ,goto_branch: panorama_branch
        }
      ]
// 16
     ,[
        {
          func: function () {
if (!MMD_SA_options.mesh_obj_by_id["DomeMESH"]._obj.visible) {
  DEBUG_show('(Dome panorama not visible)', 2)
  return
}

if (dome_rotation_speed)
  dome_rotation_speed *= 2
else {
  dome_rotation_speed = 1
  System._browser.on_animation_update.add(rotate_dome,0,1,-1)
}
if (dome_rotation_speed > 16) {
  dome_rotation_speed = 0
  System._browser.on_animation_update.remove(rotate_dome,1)
}
DEBUG_show('Dome rotation speed: x' + dome_rotation_speed, 2)
          }
         ,goto_branch: panorama_branch
        }
      ]
// 17
     ,[
        {
          func: function () {
if (!MMD_SA_options.mesh_obj_by_id["DomeMESH"]._obj.visible) {
  DEBUG_show('(Dome panorama not visible)', 2)
  return
}

dome_axis_angle = (dome_axis_angle + 18) % 360;
DEBUG_show('Dome rotation angle: ' + dome_axis_angle + '°', 2)
          }
         ,goto_branch: panorama_branch
        }
      ]
// 18
     ,[
        {
          func: function () {
if (_overlay_mode > -1)
  System._browser.overlay_mode = _overlay_mode;
_overlay_mode = -1;

DragDrop.onDrop_finish = onDrop_add_object3D;

add_grid();

Ldebug.style.transformOrigin = "0 0";
Ldebug.style.transform = "scale(1.5,1.5)";

window.removeEventListener('SA_keydown', adjust_object3D);
window.addEventListener('SA_keydown', adjust_object3D);
          }
         ,message: {
  get content() { return 'Drop a ' + ((MMD_SA.THREEX.enabled) ? 'GLB model, ' : '') + 'zipped .X model or image/video file as 3D object. Info about the active object is on the top left corner. Use keyboard for controls.\n1. Show keyboard controls\n2. Hide UI\n3. Export scene JSON\n4. Explorer mode: ' + ((explorer_mode)?'ON':'OFF\n5. Done'); }
 ,bubble_index: 3
 ,get branch_list() { return [
    { key:1, event_id:[[
        {
          message: {
  content: '・⬆️⬇️⬅️➡️ to move horizontally\n・Shift+⬆️⬇️ to move vertically\n・Shift+️⬅️➡️ to rotate Z\n・Ctrl+️⬆️⬇️⬅️➡️ to rotate XY\n・➕➖ to scale\n・Ctrl+➕➖ to adjust movement unit\n1. Next'
 ,bubble_index: 3
 ,branch_list: [
    { key:1, event_index:1 }
  ]
          }
        },
        {
          message: {
  get content() { return '・O to switch 3D object\n・B to attach 3D object to avatar\'s bone\n・C to change center\n・R to reset 3D object\n・X to remove 3D object' + ((explorer_mode) ? '\n1. Next' : '\n1. Back'); }
 ,bubble_index: 3
 ,get branch_list() { return (explorer_mode) ? [
    { key:1, event_index:2 },
  ] : [
    { key:1, event_id:'_FACEMESH_OPTIONS_', branch_index:object3D_branch }
  ]; },
          }
        },
        {
          message: {
  content: 'Explorer mode controls:\n・WASD to move\n・SPACE to jump (+Shift for super jump)\n・Alt+⬆️⬇️ to adjust ground Y\n1. Back'
 ,bubble_index: 3
 ,branch_list: [
    { key:1, event_id:'_FACEMESH_OPTIONS_', branch_index:object3D_branch }
  ]
          }
        },
      ]]
    },
    { key:2, branch_index:object3D_branch+1 },
    { key:3, event_id:{
        func:()=>{ export_scene_JSON(); }
       ,goto_event: { id:"_FACEMESH_OPTIONS_", branch_index:object3D_branch }
      }
    },
    { key:4, branch_index:object3D_branch+2 },
  ].concat((explorer_mode) ? [] : [{ key:5, branch_index:done_branch }]); }
          }
        }
      ]
// 19
     ,[
        {
          func: function () {
if (System._browser.overlay_mode == 0) {
  _overlay_mode = 0;
  System._browser.overlay_mode = 1;
}

DEBUG_show();
DEBUG_show((object3d_list.length) ? (object3d_index+1) + ': ' + object3d_list[object3d_index].user_data.id : '(Drag and drop a 3D object file to begin.)');
          }
         ,message: {
  content: 'Press 1 to restore UI.'
 ,duration: 3
 ,bubble_index: 3
 ,branch_list: [
    { key:1, branch_index:object3D_branch }
  ]
          }
        }
      ]

// 20
     ,[
        {
          func: ()=>{
if (explorer_mode) {
  reset_scene_explorer();
  MMD_SA.reset_camera(true);

  MMD_SA_options.Dungeon.run_event("_FACEMESH_OPTIONS_", object3D_branch, 0);
  return;
}

if (!object3d_cache.size) {
  speech_bubble2('There is no 3D object in this scene.', 3, { no_word_break:true });
  MMD_SA_options.Dungeon.run_event("_FACEMESH_OPTIONS_", object3D_branch, 0);
  return;
}

let obj_count = 0;
for (const value of object3d_cache.values()) {
  if (!value) {
    speech_bubble2('Please wait until all 3D objects are fully loaded.', 3);
    MMD_SA_options.Dungeon.run_event("_FACEMESH_OPTIONS_", object3D_branch, 0);
    return;
  }
  if (!value.parent_bone) obj_count++;
}

if (!obj_count) {
  speech_bubble2('There is no explorable 3D object in this scene.', 3);
  MMD_SA_options.Dungeon.run_event("_FACEMESH_OPTIONS_", object3D_branch, 0);
  return;
}

MMD_SA_options.Dungeon.run_event();
          }
        },
        {
         　message: {
  content: 'Explorer mode allows you to control your avatar to move through your 3D scene.\n1. START\n2. Cancel'
 ,bubble_index: 3
 ,branch_list: [
    { key:1, event_index:2 },
    { key:2, branch_index:object3D_branch }
  ]
          }
        },
        {
          func: function () {
reset_scene_UI();

explorer_mode = true;

use_avatar_as_center = true;

System._browser.on_animation_update.add(()=>{MMD_SA_options.Dungeon.run_event()},2*30,1);
          },
          next_step:{}
        },
        {
          message: {
  content: 'Building an explorable scene...\nNOTE: Depending on the complexity of the 3D scene, it may take more than a few seconds.'
 ,bubble_index: 3
 ,branch_list: [
    { key:1, event_index:3 },
  ]
          }
        },
        {
          func: function () {
object3d_list.forEach(object3d=>{
  build_octree(object3d);
});

window.addEventListener('SA_keydown', adjust_object3D);

MMD_SA_options.Dungeon._states.action_allowed_in_event_mode = true;
MMD_SA_options.Dungeon_options.character_movement_disabled = false;

MMD_SA_options.Dungeon_options.camera_position_z_sign = -1;
MMD_SA_options.Dungeon.update_camera_position_base();
          }
         ,goto_event: { id:"_FACEMESH_OPTIONS_", branch_index:object3D_branch }
        },
      ]

// 21
     ,[
        {
          message: {
  content: 'XR Animator (v0.3.0)\n1. Video demo\n2. Readme\n3. Download app version\n4. ❤️Sponsor️\n5. Cancel'
 ,bubble_index: 3
 ,branch_list: [
    { key:1, event_id: {
        func: function () {
var url = 'https://youtube.com/playlist?list=PLLpwhHMvOCSt3i7NQcyJq1fFhoMiSmm5H'
if (webkit_electron_mode)
  webkit_electron_remote.shell.openExternal(url)
else
  window.open(url)
        }
       ,ended: true
      }
    }
   ,{ key:2, event_id: {
        func: function () {
var url = self._readme_url_ || System.Gadget.path + '/readme.txt'
if (webkit_electron_mode)
  webkit_electron_remote.shell.openExternal(url)
else
  window.open(url)
        }
       ,ended: true
      }
    }
   ,{ key:3, event_id: {
        func:()=>{
var url = 'https://github.com/ButzYung/SystemAnimatorOnline/releases'
if (webkit_electron_mode)
  webkit_electron_remote.shell.openExternal(url)
else
  window.open(url)
        }
       ,ended: true
      }
    }
   ,{ key:4, event_index:1 }
   ,{ key:5, event_index:99 }
  ]
          }
        },
        {
          message: {
  get content() { return 'If you like XR Animator, please consider making a donation and help keep this project running🙏\n1. 🤝PayPal.Me' + ((webkit_electron_mode) ? '\n2. 🟡Bitcoin\n3. Cancel' : '\n2. Cancel'); }
 ,bubble_index: 3
 ,get branch_list() { return [
    { key:1, event_id: {
        func:()=>{
var url = 'https://www.paypal.me/AnimeThemeGadgets'
if (webkit_electron_mode)
  webkit_electron_remote.shell.openExternal(url)
else
  window.open(url)
        }
       ,ended: true
      }
    }
  ].concat((webkit_electron_mode) ? [
    { key:2, event_id: {
        func:()=>{
navigator.clipboard.writeText('1KkHVxgn4tusMhXNt1qFqSpiCiDRcqUh8p').then(()=>{
  speech_bubble2('The following BTC address has been copied to the clipboard. Thanks in advance for any amount you will be sending!🙏\n・1KkHVxgn4tusMhXNt1qFqSpiCiDRcqUh8p', 10, { scale:1, no_word_break:true });
});
        }
       ,ended: true
      }
    },
    { key:3 }
  ] : [
    { key:2 }
  ]); }
          }
        }
      ]
// 22
     ,[
        {
          func: function () {
if (/\.(bvh|fbx)$/i.test(MMD_SA.vmd_by_filename[MMD_SA.MMD.motionManager.filename].url) || System._browser.camera.motion_recorder.vmd) return true;
          }
         ,message: {
  get content() { return 'There is no motion to export. Enable motion capture and record the motion, or drop a BVH' + ((MMD_SA.THREEX.enabled) ? '' : '/FBX') + ' motion file.'; },
  duration: 5
          }
         ,ended: true
        },
        {
          func: function () {
          }
         ,message: {
  get content() { return 'Choose a motion format to export.\n1. VMD\n2. Cancel'; } 
 ,bubble_index: 3
 ,get branch_list() {
return [
  { key:1, event_index:2 }
].concat((0) ? [
  { key:2, event_index:3 }
 ,{ key:3 }
] : [
  { key:2 }
]);
  }
          }
        },
        {
          func: function () {
var filename;
var vmd = System._browser.camera.motion_recorder.vmd;
if (vmd) {
  filename = 'motion.vmd'
}
else {
  vmd = System._browser.camera.motion_recorder.vmd || MMD_SA.vmd_by_filename[MMD_SA.MMD.motionManager.filename];
  filename = MMD_SA.MMD.motionManager.filename + '.vmd'
}

setTimeout(()=>{
  MMD_SA.VMD_FileWriter().then(()=>{
    VMD_FileWriter(filename, vmd.boneKeys,vmd.morphKeys);
    System._browser.camera.motion_recorder.vmd = null
  });
}, 0);
          }
         ,message: {
  content: 'Please wait while the file is being generated for saving.'
 ,duration: 3
          }
         ,ended: true
        }

      ]
// 23
     ,[
        {
          message: {
  get content() { return 'Miscellaneous Options\n1. Camera face-locking:' + ((MMD_SA_options.camera_face_locking==null)?'Auto':(MMD_SA_options.camera_face_locking)?'ON':'OFF') + '\n2. Audio visualizer:' + ((MMD_SA_options.use_CircularSpectrum) ? 'ON' : 'OFF') + '\n3. Done'; },
  bubble_index: 3,
  branch_list: [
    { key:1, event_index:1 },
    { key:2, event_index:2 },
    { key:3, event_index:99 },
  ],
          }
        },
        {
          func: ()=>{
if (MMD_SA_options.camera_face_locking == null) {
  MMD_SA_options.camera_face_locking = true;
}
else if (MMD_SA_options.camera_face_locking) {
  MMD_SA_options.camera_face_locking = false;
}
else {
  MMD_SA_options.camera_face_locking = null;
}
MMD_SA.THREEX.utils.camera_auto_targeting({ id:'face', enabled:MMD_SA_options.camera_face_locking });
          },
          goto_event: { event_index:0 },
        },
        {
          func: ()=>{
MMD_SA_options.use_CircularSpectrum = !MMD_SA_options.use_CircularSpectrum;
          },
          goto_event: { event_index:0 },
        }
      ]
// 24
     ,[
      ]
// 25
     ,[
        {
          func: function () {
if (System._browser.camera.initialized) {
  if (!System._browser.camera.ML_warmed_up) {
    MMD_SA.SpeechBubble.message(0, 'Mocap AI models are still warming up. Try again in a few seconds.', 3*1000)
    MMD_SA_options.Dungeon.run_event(null,done_branch,0)
  }
  else {
    MMD_SA_options.Dungeon.run_event()
  }
}
else {
  MMD_SA.SpeechBubble.message(0, 'Choose a video input for motion capture first before you can record motion.', 3*1000)
  MMD_SA_options.Dungeon.run_event(null,done_branch,0)
}
          }
        },
        {
          func: function () {
System._browser.camera._info =
  '- Recording allows motion to be exported to a file later.\n'
+ '- If your PC is slow, choose a slower speed to ensure that you can capture all the frames.\n'
+ '- Live camera will always be recorded at normal speed.';
          }
         ,message: {
  content: 'Choose a speed to record motion.\n1. x 1\n2. x 0.5\n3. x 0.25\n4. Cancel'
 ,bubble_index: 3
 ,branch_list: [
  { key:1, branch_index:record_motion_branch+1 },
  { key:2, branch_index:record_motion_branch+2 },
  { key:3, branch_index:record_motion_branch+3 },
  { key:4, branch_index:done_branch }
  ]
          }
        }
      ]
// 26
     ,[
        {
          func: function () {
mirror_3D_off()
System._browser.camera.motion_recorder.speed = 1
System._browser.camera._info = ''
DEBUG_show('(Motion recording STARTED / x1 speed)', 3)
          }
         ,ended: true
        }
      ]
// 27
     ,[
        {
          func: function () {
mirror_3D_off()
System._browser.camera.motion_recorder.speed = 0.5
System._browser.camera._info = ''
DEBUG_show('(Motion recording STARTED / x0.5 speed)', 3)
          }
         ,ended: true
        }
      ]
// 28
     ,[
        {
          func: function () {
mirror_3D_off()
System._browser.camera.motion_recorder.speed = 0.25
System._browser.camera._info = ''
DEBUG_show('(Motion recording STARTED / x0.25 speed)', 3)
          }
         ,ended: true
        }
      ]
// 29
     ,[
        {
          func: function () {
System._browser.camera._info =
  '- Enable "Leg IK" to record motion in VMD with leg IK output.\n'
+ '- "Leg scale adjustment" adjust rotations by adapting the leg length difference between source and 3D model.\n'
+ '- Turn auto-grounding on if the target person is always grounding with a fixed horizontal camera angle.'
          }
         ,message: {
  get content() { return '1. Leg IK: ' + ((MMD_SA_options.user_camera.ML_models.pose.use_legIK)?'ON':'OFF') + '\n2. Leg scale adjustment: ' + ((!System._browser.camera.poseNet.leg_scale_adjustment)?'OFF':((System._browser.camera.poseNet.leg_scale_adjustment>0 && '+')||'')+System._browser.camera.poseNet.leg_scale_adjustment) + '\n3. Auto-grounding: ' + ((!System._browser.camera.poseNet.auto_grounding)?'OFF':'ON') + '\n4. Clear bounding box\n5. Facemesh options\n6. Done'; }
 ,bubble_index: 3
 ,branch_list: [
  { key:1, branch_index:mocap_options_branch+1 },
  { key:2, branch_index:mocap_options_branch+2 },
  { key:3, branch_index:mocap_options_branch+3 },
  { key:4, branch_index:mocap_options_branch+4 },
  { key:5, branch_index:facemesh_options_branch },
  { key:6, branch_index:done_branch }
  ]
          }
        }
      ]
// 30
     ,[
        {
          func: function () {
MMD_SA_options.user_camera.ML_models.pose.use_legIK = !MMD_SA_options.user_camera.ML_models.pose.use_legIK;
if (MMD_SA_options.user_camera.ML_models.pose.use_legIK) {
  System._browser.camera.poseNet.frames.remove('skin', '左ひざ');
  System._browser.camera.poseNet.frames.remove('skin', '右ひざ');
}
          }
         ,goto_branch: mocap_options_branch
        }
      ]
// 31
     ,[
        {
          func: function () {
if (++System._browser.camera.poseNet.leg_scale_adjustment > 5) System._browser.camera.poseNet.leg_scale_adjustment = -5;
          }
         ,goto_branch: mocap_options_branch
        }
      ]
// 32
     ,[
        {
          func: function () {
System._browser.camera.poseNet.auto_grounding = !System._browser.camera.poseNet.auto_grounding;
          }
         ,goto_branch: mocap_options_branch
        }
      ]
// 33
     ,[
        {
          func: function () {
const camera = System._browser.camera;
if (!camera.poseNet.enabled) {
  DEBUG_show('(Body mocap only)', 2);
  return;
}
if (!camera.video || (camera.video.pause && !camera.video.paused)) {
  DEBUG_show('(Paused video input required)', 2);
  return;
}
if (!camera.poseNet._bb) {
  DEBUG_show('(No bounding box to clear)', 2);
  return;
}

System._browser.camera.poseNet.bb_clear = 15
          }
         ,goto_branch: mocap_options_branch
        }
      ]

// 34
     ,[
        {
          message: {
  get content() {
const camera = System._browser.camera;

return '\n1. Eyeblink LR sync: ' + ((!System._browser.camera.facemesh.blink_sync)?'OFF':'ON') + '\n2. Eye tracking: ' + ((!System._browser.camera.facemesh.eye_tracking)?'OFF':'ON') + ((camera.facemesh.enabled && camera.video) ? '\n3. Reset calibration\n4. Import calibration\n5. Export calibration\n6. Done' : '\n3. Done');
  }
 ,bubble_index: 3
 ,get branch_list() {
const camera = System._browser.camera;

return (camera.facemesh.enabled && camera.video) ? [
  { key:1, branch_index:facemesh_options_branch+1 },
  { key:2, branch_index:facemesh_options_branch+2 },
  { key:3, branch_index:facemesh_options_branch+3 },
  { key:4, branch_index:facemesh_options_branch+4 },
  { key:5, branch_index:facemesh_options_branch+5 },
  { key:6, branch_index:done_branch }
    ] : [
  { key:1, branch_index:facemesh_options_branch+1 },
  { key:2, branch_index:facemesh_options_branch+2 },
  { key:3, branch_index:done_branch }
];
  }
          }
        }
      ]
// 35
     ,[
        {
          func: function () {
System._browser.camera.facemesh.blink_sync = !System._browser.camera.facemesh.blink_sync;
          }
         ,goto_branch: facemesh_options_branch
        }
      ]
// 36
     ,[
        {
          func: function () {
System._browser.camera.facemesh.eye_tracking = !System._browser.camera.facemesh.eye_tracking;
          }
         ,goto_branch: facemesh_options_branch
        }
      ]
// 37
     ,[
        {
          func: function () {
System._browser.camera.facemesh.reset_calibration(true);
MMD_SA_options.Dungeon.run_event(null,done_branch,0);
          }
        }
      ]
// 38
     ,[
        {
          func: function () {
DragDrop.onDrop_finish = onDrop_change_facemesh_calibration;
          }
         ,message: {
  content: 'Drop a JSON file containing the facemesh calibration data.\n1. Cancel'
 ,bubble_index: 3
 ,branch_list: [
    { key:1, branch_index:done_branch }
  ]
          }
        }
      ]
// 39
     ,[
        {
          func: function () {
const facemesh = System._browser.camera.facemesh;

if (!facemesh.calibrated) {
  MMD_SA.SpeechBubble.message(0, 'Calibration needs to be complete before it can be exported.', 3*1000);
}
else {
  facemesh.export_calibration();
}
MMD_SA_options.Dungeon.run_event(null,done_branch,0);
          }
        }
      ]

// 40
     ,[
        {
          func: function () {
if (1) {
  MMD_SA.SpeechBubble.message(0, '(🚧 Work in progress 🚧)', 3*1000)
  MMD_SA_options.Dungeon.run_event(null,done_branch,0)
}
else if (!webkit_electron_mode) {
  MMD_SA.SpeechBubble.message(0, 'This option is for native app mode only.', 3*1000)
  MMD_SA_options.Dungeon.run_event(null,done_branch,0)
}
else {
  MMD_SA_options.Dungeon.run_event()
}
          }
        }
       ,{
          message: {
  content: '1. Virtual mouse\n2. Game 01 (PSO2NGS) \n3. Cancel'
 ,bubble_index: 3
 ,branch_list: [
  { key:1, branch_index:motion_control_branch+1 },
  { key:2, branch_index:motion_control_branch+2 },
  { key:3, branch_index:done_branch }
  ]
          }
        }
      ]
// 41
     ,[
        {
          func: function () {
System._browser.motion_control.virtual_mouse.enabled = true
System._browser.motion_control.enabled = true
MMD_SA.SpeechBubble.message(0, 'Hold an index-up gesture for 1 second to start, flipped backward for 1 second to end.', 3*1000)
          }
         ,ended: true
        }
      ]
// 42
     ,[
        {
          func: function () {
System._browser.motion_control.game01.enabled = true
System._browser.motion_control.enabled = true
MMD_SA.SpeechBubble.message(0, 'Hold an index-up gesture for 1 second to start, flipped backward for 1 second to end.', 3*1000)
          }
         ,ended: true
        }
      ]

];
    })()

  }

 ,skydome: {
    texture_path_list: [
//  System.Gadget.path + "/images/_dungeon/tex/ryntaro_nukata/angel_staircase.jpg"
//  System.Gadget.path + "/images/_dungeon/tex/ryntaro_nukata/blue_sky.jpg"
//  System.Gadget.path + "/images/_dungeon/tex/ryntaro_nukata/unknown_planet_v00_c95.jpg"

// ,'F:\\MMD\\stages\\Sky Dome\\スカイドームF2配布データVer1.3\\Skydome_F2_Ver1.3\\F201.jpg'
    ]
//   ,fog: {}
  }

 ,options_by_area_id: {
    "start": {

  RDG_options: {

    width:  1
   ,height: 1
   ,grid_array: [[2]]

/*
    width:  50,
    height: 50,
    minRoomSize: 3,
    maxRoomSize: 10
,DG_room_count: 10
*/
  }

 ,grid_size: 64 *10 *5

 ,floor_material_index_default: -1
 ,wall_material_index_default: -1
 ,ceil_material_index_default: -1

 ,ambient_light_color: "#FFF"
 ,light_color: '#606060'

 ,skydome: {
    visible: false
  }

// ,no_camera_collision: true
 ,camera_y_default_non_negative: false

 ,object_list: [
    {object_index:0},
// roomba
//    {object_index:1}
  ]

 ,events: {
    "onstart": [
      [
        {
          func: function () {
MMD_SA_options.Dungeon_options.character_movement_disabled = true
return true
          }
        }
/*
       ,{
  objects: {
    "object0_0": { hidden:false }
  }
 ,next_step: {}
        }
*/
/*
       ,{
  follow_PC: {
    "object0_0": {pos_base:{x:0,y:5,z:0}}
  }
 ,next_step: {}
        }
       ,{
          func: function () {
MMD_SA_options.Dungeon.character.pos_update()
MMD_SA_options.Dungeon.object_base_list[0].object_list[0]._obj.updateMatrix()
return true
          }
        }
*/
      ]
    ]

   ,"circle_2m_show": [
      [
/*
        {
  objects: {
    "object0_0": {
  placement: { hidden:false }
 ,func: function (obj) {
obj._zoom_scale_update_ = function () {
  var circle_2m = obj._obj
  var zoom_scale = MMD_SA.WebXR.zoom_scale
  circle_2m.scale.set(zoom_scale,1,zoom_scale)
  circle_2m.updateMatrix()
};
window.addEventListener("SA_AR_zoom_scale_update", obj._zoom_scale_update_);
  }
    }
  }
 ,next_step: {}
        }
*/

        {
          func: function () {
var circle_2m = MMD_SA.WebXR._circle_2m
circle_2m.position.copy(THREE.MMD.getModels()[0].mesh.position).y += 0.1
circle_2m.visible = true

circle_2m._zoom_scale_update_ = function () {
  var zoom_scale = MMD_SA.WebXR.zoom_scale
  circle_2m.scale.set(zoom_scale,1,zoom_scale)
//  circle_2m.updateMatrix()
};
window.addEventListener("SA_AR_zoom_scale_update", circle_2m._zoom_scale_update_);
return true;
          }
        }

      ]
    ]

   ,"circle_2m_hide": [
      [
/*
        {
  objects: {
    "object0_0": {
  placement: { hidden:true }
 ,func: function (obj) {
window.removeEventListener("SA_AR_zoom_scale_update", obj._zoom_scale_update_);
  }
    }
  }
 ,next_step: {}
        }
*/

        {
          func: function () {
var circle_2m = MMD_SA.WebXR._circle_2m
circle_2m.visible = false

window.removeEventListener("SA_AR_zoom_scale_update", MMD_SA.WebXR._circle_2m._zoom_scale_update_);
window.addEventListener("SA_AR_zoom_scale_update", circle_2m._zoom_scale_update_);
return true;
          }
        }

      ]
    ]

  }

    }
  }

};

MMD_SA_options.Dungeon_options.options_by_area_id.start.floor_material_index_default = MMD_SA_options.Dungeon_options.grid_material_list.length-1;
MMD_SA_options.Dungeon_options.options_by_area_id.start.wall_material_index_default = MMD_SA_options.Dungeon_options.grid_material_list.length-1;
MMD_SA_options.Dungeon_options.options_by_area_id.start.ceil_material_index_default = MMD_SA_options.Dungeon_options.grid_material_list.length-1;

MMD_SA_options.Dungeon_options.options_by_area_id.start.para_by_grid_id = { '2':{ ground_y:0, ground_y_visible:0 } };

//MMD_SA_options.Dungeon_options = null;
// END


  window.addEventListener("MMDStarted", function () {
MMD_SA.custom_action_default["cover_undies"].action._condition = function (is_bone_action, objs, _default) {
  if (/i\-shaped_balance/.test(MMD_SA.MMD.motionManager.filename) && (MMD_SA._ry > 1)) return true;

  return _default;
};

const use_THREEX = MMD_SA.THREEX.enabled;
const THREE = MMD_SA.THREEX.THREE;

let geometry = new THREE.PlaneGeometry(MMD_SA_options.Dungeon_options.options_by_area_id.start.grid_size*2, MMD_SA_options.Dungeon_options.options_by_area_id.start.grid_size*2);
/*
let tex = document.createElement("canvas")
tex.width = tex.height = 1
//let tex_context = tex.getContext("2d")
//tex_context.fillStyle = "rgba(0,0,0,0)"
//tex_context.fillRect(0,0,1,1)
tex = new THREE.Texture(tex)
tex.needsUpdate = true
*/
let material = (use_THREEX) ? new THREE.ShadowMaterial() : new THREE.MeshBasicMaterial({ color: 0x000000, transparent:true });//false });//
geometry.applyMatrix(new THREE.Matrix4().makeRotationX(THREE.Math.degToRad(-90)));
let ground = MMD_SA.WebXR.ground_plane = new THREE.Mesh(geometry, material);
ground.receiveShadow = true;
if (!use_THREEX) ground.receiveShadowAlpha = true;
MMD_SA.THREEX.scene.add(ground)

let wall_geo = new THREE.BoxGeometry(30,30,30);
wall_geo.applyMatrix(new THREE.Matrix4().makeTranslation(0,10,-15));
let wall = MMD_SA.WebXR._wall = new THREE.Mesh(wall_geo, material);
wall.receiveShadow = true;
if (!use_THREEX) {
  wall.useQuaternion = true;
  wall.receiveShadowAlpha = true;
}
MMD_SA.THREEX.scene.add(wall)

window.addEventListener("SA_MMD_toggle_shadowMap", function () {
  ground.receiveShadow = wall.receiveShadow = MMD_SA_options.use_shadowMap;
  if (!use_THREEX) ground.receiveShadowAlpha = wall.receiveShadowAlpha = MMD_SA_options.use_shadowMap;
  material.opacity = (MMD_SA_options.use_shadowMap) ? 0.5 : 0
  material.needsUpdate = true
});

// can be updated only AFTER scene.add
wall.visible = false
material.opacity = 0.5

let circle_2m_geometry = new THREE.RingGeometry(19.5, 20.5, 24, 1);
circle_2m_geometry.applyMatrix(new THREE.Matrix4().makeRotationX(THREE.Math.degToRad(-90)));
let circle_2m_material = new THREE.MeshBasicMaterial({ color:0xDC143C });
let circle_2m = MMD_SA.WebXR._circle_2m = new THREE.Mesh(circle_2m_geometry, circle_2m_material);
MMD_SA.THREEX.scene.add(circle_2m);
circle_2m_material.opacity = 0.5;
circle_2m.visible = false;


MMD_SA_options.WebXR.AR.item_reticle_id = "reticle"
Object.defineProperty(MMD_SA.WebXR, "_item_reticle", {
  get: function () {
    let item_reticle_id = MMD_SA_options.WebXR.AR.item_reticle_id
    return MMD_SA_options.Dungeon.inventory.list.find((item)=>item.item_id==item_reticle_id);
  }
});

window.addEventListener("SA_Dungeon_onstart", function () {

const THREE = self.THREE;

let v3a = new THREE.Vector3()
let v3b = new THREE.Vector3()
let v3c = new THREE.Vector3()

let _camera_position = new THREE.Vector3()
let _timestamp

window.addEventListener("SA_MMD_model0_onmotionplaying", function (e) {
  var model_mesh = THREE.MMD.getModels()[0].mesh
  if (!model_mesh.visible)
    return

  var mm = MMD_SA.MMD.motionManager
  if (!/standmix2_modified/.test(mm.filename))
    return

  if (MMD_SA.WebXR.user_camera.visible)
    return

  if (!MMD_SA.WebXR.session)
    return;

  var AR_options = MMD_SA_options.WebXR.AR
  var d = MMD_SA_options.Dungeon;
  var dis = v3a.copy(MMD_SA.camera_position).setY(0).distanceTo(v3b.copy(model_mesh.position).setY(0))/10 / MMD_SA.WebXR.zoom_scale;
  var speed = 0, cam_mov;
  if (_camera_position) {
    speed = (_camera_position.distanceTo(v3a)/10 / MMD_SA.WebXR.zoom_scale) / ((RAF_timestamp - _timestamp)/1000);
//DEBUG_show(speed)
    cam_mov = v3c.copy(_camera_position).sub(v3a);
  }

  _camera_position.copy(v3a)
  _timestamp = RAF_timestamp

  if (AR_options._skip_charging_count && --AR_options._skip_charging_count) return;
  if ((dis > 0.75) || (speed < 1)) return;

  var cam_dir = v3a.sub(v3b)
//  speed && cam_mov && DEBUG_show(cam_mov.angleTo(cam_dir));return;
  if (Math.abs(cam_mov.angleTo(cam_dir)) > Math.PI/4) return;

  if (AR_options._wallhit) {
    MMD_SA_options._motion_shuffle_list = [MMD_SA_options.motion_index_by_name["emote-mod_おどろく1"]]
    MMD_SA_options.motion_shuffle_list_default = null
    MMD_SA._force_motion_shuffle = true
    d.sound.audio_object_by_name["anime_wow"].play(model_mesh)
    return
  }

  var angle_y = Math.atan2(cam_dir.x,cam_dir.z) - v3b.setEulerFromQuaternion(model_mesh.quaternion).y

  if (Math.abs(angle_y) < Math.PI/2) {
    // use ._motion_shuffle_list instead, because we have multiple motions running in order, but .motion_shuffle_list_default can be shuffled.
    MMD_SA_options._motion_shuffle_list = [MMD_SA_options.motion_index_by_name["w01_すべって尻もち"], MMD_SA_options.motion_index_by_name["女の子座り→立ち上がる_gumi_v01"]]
    MMD_SA_options.motion_shuffle_list_default = null
    MMD_SA._force_motion_shuffle = true
  }
  else {
    // use ._motion_shuffle_list instead, because we have multiple motions running in order, but .motion_shuffle_list_default can be shuffled.
    MMD_SA_options._motion_shuffle_list = [MMD_SA_options.motion_index_by_name["r01_普通に転ぶ"], MMD_SA_options.motion_index_by_name["OTL→立ち上がり"]]
    MMD_SA_options.motion_shuffle_list_default = null
    MMD_SA._force_motion_shuffle = true
  }

  d.sound.audio_object_by_name["hit-3"].play(model_mesh)
});

if (MMD_SA.WebXR._item_reticle)
  document.getElementById("Ldungeon_inventory_item" + MMD_SA.WebXR._item_reticle.index + "_icon").style.opacity = 1;

window.addEventListener("SA_AR_onSessionStarted", function (e) {
  let item_reticle = MMD_SA.WebXR._item_reticle
  item_reticle._opacity_mod_ = -0.025
  document.getElementById("Ldungeon_inventory_item" + item_reticle.index + "_icon").style.opacity = 1
});

window.addEventListener("SA_AR_onSessionEnd", function (e) {
  document.getElementById("Ldungeon_inventory_item" + MMD_SA.WebXR._item_reticle.index + "_icon").style.opacity = 1
});

window.addEventListener("SA_AR_onARFrame", (function () {
  var timerID

  function item_reticle_flash() {
    timerID = null
    if (!MMD_SA.WebXR.session)
      return

    let item_reticle = MMD_SA.WebXR._item_reticle
    let icon = document.getElementById("Ldungeon_inventory_item" + MMD_SA.WebXR._item_reticle.index + "_icon").style
    let opacity = parseFloat(icon.opacity) + item_reticle._opacity_mod_
    icon.opacity = opacity
    if (opacity >= 1)
      item_reticle._opacity_mod_ = -Math.abs(item_reticle._opacity_mod_)
    else if (opacity <= 0.25)
      item_reticle._opacity_mod_ =  Math.abs(item_reticle._opacity_mod_)
//DEBUG_show(opacity+'/'+item_reticle._opacity_mod_)
  }

  return function (e) {
//    if (!MMD_SA.WebXR.session.domOverlayState) return
    if (!timerID)
      timerID = requestAnimationFrame(item_reticle_flash)
  };
})());

});

//console.log(ground,material)
  });

  EV_sync_update.fps_control = (function () {
    var update_frame = false
    var cooling_count = 0
    return function () {
      var camera = System._browser.camera;

// when backgroundThrottling is disabled and the app is hidden (i.e. System._browser.hidden), every requestAnimationFrame must be called and drawn (with dummy stuff in this case) to prevent the frames from halting
      if (System._browser.hidden || (RAF_timestamp_delta > 25) || MMD_SA_options.user_camera.ML_models.worker_disabled || !camera.initialized || camera._needs_RAF || !camera.ML_busy || (!is_mobile && ((camera.ML_fps > ((camera.poseNet.enabled && camera.poseNet.use_holistic)?15:20)) || (cooling_count=10)) && (!camera.video.paused && (--cooling_count < 0))) || (!(camera.facemesh.enabled && camera.facemesh.use_mediapipe) && !camera.poseNet.enabled)) {
        camera._needs_RAF = false
        update_frame = true
      }
      else {
        update_frame = !update_frame
      }

      RAF_timestamp_delta_accumulated = (update_frame) ? 0 : RAF_timestamp_delta_accumulated + RAF_timestamp_delta;

      System._browser.motion_control.setMousePosition();

      return update_frame
    };
  })();

/*
window.addEventListener('jThree_ready', ()=>{
  if (!MMD_SA.THREEX.enabled) return;

  const THREE = MMD_SA.THREEX.THREE;

  const renderer = MMD_SA.THREEX.renderer.obj;

  const pmremGenerator = new THREE.PMREMGenerator(renderer);
  pmremGenerator.compileEquirectangularShader();

  new THREE.TextureLoader().load( toFileProtocol('C:\\Users\\user\\Downloads\\equirectangular.png'), function ( texture ) {

					texture.mapping = THREE.EquirectangularReflectionMapping;
					texture.encoding = THREE.sRGBEncoding;

					MMD_SA.THREEX.scene.environment = pmremGenerator.fromEquirectangular( texture ).texture;
console.log(999,'TEST');
				} );

});
*/

})();


if (webkit_electron_mode) document.write('<script language="JavaScript" src="' + toFileProtocol(Settings.f_path + '/animate_customized.js') + '"></scr'+'ipt>');;

// main js
if (MMD_SA_options.Dungeon_options)
  document.write('<script language="JavaScript" src="js/dungeon.js"></scr'+'ipt>');
document.write('<script language="JavaScript" src="MMD.js/MMD_SA.js"></scr'+'ipt>');
