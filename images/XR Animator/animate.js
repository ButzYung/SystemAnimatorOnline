// XR Animator
// (12-20-2022)

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

 ,look_at_mouse_z: -1

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

this.center_view = (this.center_view_enforced) ? [0, (head.y)*1.025-11.4, -20] : [0,0,0]
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
 ,onstart: function () {

    MMD_SA.SpeechBubble.message(0, "Welcome to XR Animator~!", 3*1000, {group_index:0, group:{name:"onstart", loop:2}})
    MMD_SA.SpeechBubble.message(0, "Enable motion capture to control the avatar with your body!", 4*1000, {group:{name:"onstart"}})
    MMD_SA.SpeechBubble.message(0, "Use your webcam, or drop a local pic/video instead.", 4*1000, {group:{name:"onstart"}})
    MMD_SA.SpeechBubble.message(0, "You can enable AR mode if you are on an Android mobile!", 4*1000, {group:{name:"onstart"}})
    MMD_SA.SpeechBubble.message(0, "Drag the mouse to rotate the camera. Press and hold Ctrl key to pan.", 4*1000, {group:{name:"onstart"}})

  }

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
  scale:0.4,
  top:-0.5//0//
//,left:-3
},
wireframe:{
//  hidden:true,
//  align_with_video:true,
  top:0.5
//,left:3
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
 ,get SpeechBubble_scale() { return this._SpeechBubble_scale_ || (MMD_SA.THREEX.enabled && (window.innerHeight < 720)) ? 2 : 1.5; }
 ,set SpeechBubble_scale(v) { this._SpeechBubble_scale_ = v; }

 ,use_THREEX: true
 ,THREEX_options: {
    enabled_by_default: true,

//    use_MMD: true,
    use_MMDAnimationHelper: true,

//    use_VRM1: false,

//    model_path: 'C:\\Users\\user\\Downloads\\iroha+kazama+v1.0\\iroha kazama v1.0\\model\\iroha kazama ver1.0.pmx'//System.Gadget.path + '/TEMP/DEMO/models/AvatarSample_A.vrm'
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


// dungeon options START
MMD_SA_options.Dungeon_options = {

  transparent_background: true

 ,use_PC_click_reaction_default: true

 ,joystick_disabled: true

 ,use_point_light: false

 ,shadow_camera_width: 32

// ,grid_material_list: []

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
 ,is_base_inventory: true
 ,stock_max: 1
 ,stock_default: 1
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

   ,"magic_wand": (function () {
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
  MMD_SA_options.Dungeon.run_event("_MAGIC_WAND_",0)
  return
}
else if ((motion_index_absolute != null) && (MMD_SA_options.Dungeon._event_active.id != "_MAGIC_WAND_"))
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
    name:"stand_simple", info:"Stand simple (full mocap/F)",
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

MMD_SA_options.Dungeon_options.events_default["_MAGIC_WAND_"] = [
//0
      [
        {
          message: {
  get content() { const index = (System._browser.camera.poseNet.enabled) ? 1 : 0; this._has_custom_animation_ = (MMD_SA.THREEX.enabled && MMD_SA.THREEX.get_model(0).animation.has_clip); return _motion_list[index].map((m,i) => (i+1)+'. ' + (m.info||m.name)).join('\n') + ((this._has_custom_animation_) ? ('\n' + (_motion_list[index].length+1) + '. (Custom Motion:' + ((MMD_SA.THREEX.get_model(0).animation.enabled)?'ON':'OFF') + ') (U)') : '') + '\n' + (_motion_list[index].length+1+((this._has_custom_animation_)?1:0)) + '. Done'; }
 ,bubble_index: 3
 ,get branch_list() {
const index = (System._browser.camera.poseNet.enabled) ? 1 : 0;
return _motion_list[index].map((m,i) => { return { key:i+1, event_id:{ func:()=>{change_motion(i)}, goto_event:{id:'_MAGIC_WAND_',branch_index:0} } }; }).concat((this._has_custom_animation_)?[{ key:_motion_list[index].length+1, event_id:{ func:()=>{MMD_SA.THREEX.get_model(0).animation.enabled=!MMD_SA.THREEX.get_model(0).animation.enabled;}, goto_event:{id:'_MAGIC_WAND_',branch_index:0} } }]:[], [{ key:_motion_list[index].length+1+((this._has_custom_animation_)?1:0) }]);
  }
          }
        }
      ]
];

      });

      var magic_wand = {
  icon_path: Settings.f_path + '/assets/assets.zip#/icon/magic-wand_64x64.png'
 ,info_short: "Magic wand"
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
var info =
  '- Double-click to change the pose of the avatar.\n';

if (System._browser.camera.ML_enabled) {
  info +=
  '- The current pose '
+ ((MMD_SA.MMD.motionManager.para_SA.motion_tracking_enabled) ? 'supports ' + ((MMD_SA.MMD.motionManager.para_SA.motion_tracking_upper_body_only) ? 'upper-body' : 'full-body') + ' motion tracking.' : 'does not support motion tracking.');
}

return info;
  }
      };

      return magic_wand;
    })()

   ,"selfie" : {
  icon_path: Settings.f_path + '/assets/assets.zip#/icon/selfie_64x64.png'
 ,info_short: "Selfie camera"
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
+ '- You can use a webcam, or drop a local video/picture file.\n'
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
  DEBUG_show("(You can't enable motion capture and BodyPix at the same time.)", 3)
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
  icon_path: Settings.f_path + '/assets/assets.zip#/icon/people_64x64.png'
 ,info_short: "BodyPix AI"
// ,is_base_inventory: true
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
  DEBUG_show("BodyPix AI:OFF", 2)
}
else {
  MMD_SA.WebXR.user_camera.bodyPix.enabled = true
  DEBUG_show("BodyPix AI:ON", 2)
}
      }

      return function (item) {
if (!MMD_SA.WebXR.user_camera.visible) {
  DEBUG_show("(You need to activate selfie camera first.)", 3)
  return true
}
if (MMD_SA.WebXR.user_camera.ML_enabled) {
  DEBUG_show("(You can't enable BodyPix and motion capture at the same time.)", 3)
  return true
}
if (loading) {
  DEBUG_show("(BodyPix still loading)", 2)
  return true
}

init()
      };
    })()
   ,anytime: true
  }
    }

   ,"taking-a-selfie" : {
  icon_path: Settings.f_path + '/assets/assets.zip#/icon/taking-a-selfie_64x64.png'
 ,info_short: "Take a Selfie"
// ,is_base_inventory: true
 ,stock_max: 1
 ,stock_default: 1
 ,action: {
    func: function (item) {
return System._browser.camera.snapshot.init();
    }
   ,anytime: true
  }
    }


   ,"air_blower": (function () {
      function air_blower_frame() {
if (MMD_SA.ammo_proxy && MMD_SA.ammo_proxy._timeStep) return// {DEBUG_show(Date.now()); return; }

var camera = MMD_SA._trackball_camera.object
var gravity = MMD_SA.TEMP_v3.copy(camera.position).sub(camera._lookAt).normalize().multiplyScalar((state==2) ? 2 : -2).toArray()
//DEBUG_show(gravity)
THREE.MMD.setGravity( gravity[0]*9.8*10, gravity[1]*9.8*10, gravity[2]*9.8*10 )
      }

      var state = 0
      var air_blower = {
  icon_path: Settings.f_path + '/assets/assets.zip#/icon/hair-dryer_64x64.png'
 ,info_short: "Air blower"
// ,is_base_inventory: true
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
 ,stock_max: 1
 ,stock_default: 1
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
  content: "Enable selfie camera for AR/VR purpose?\n1. Yes\n2. Yes (flip video)\n3. No\n4. Options"
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
MMD_SA_options.Dungeon_options.item_base['magic_wand'].action.func()
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
MMD_SA_options.Dungeon_options.item_base['magic_wand'].action.func()
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
MMD_SA_options.Dungeon_options.item_base['magic_wand'].action.func()
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
MMD_SA_options.Dungeon_options.item_base['magic_wand'].action.func()
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
MMD_SA_options.Dungeon_options.item_base['magic_wand'].action.func()
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

   ,"_FACEMESH_OPTIONS_": (function () {
function onDrop_change_wallpaper(item) {
  var src = item.path
  if (item.isFileSystem && /([^\/\\]+)\.(png|jpg|jpeg|bmp)$/i.test(src)) {
    System._browser.updateWallpaper(src)
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

function onDrop_change_object3D(item) {
 var src = item.path
  if (item.isFileSystem && /([^\/\\]+)\.zip$/i.test(src)) {
    const zip_file = SA_topmost_window.DragDrop._path_to_obj[src.replace(/^(.+)[\/\\]/, "")]

    new self.JSZip().loadAsync(zip_file)
.then(function (zip) {
// will be called, even if content is corrupted
//console.log(999,src)

  SA_topmost_window.DragDrop._zip_by_url = SA_topmost_window.DragDrop._zip_by_url || {}
  SA_topmost_window.DragDrop._zip_by_url[src] = zip

  var object_x_list = zip.file(/\.x$/i)
  if (!object_x_list.length) {
    DEBUG_show("(No .x model found)")
    return
  }

  var model_filename = object_x_list[0].name.replace(/^.+[\/\\]/, "")
  var model_path = src + "#/" + object_x_list[0].name
  console.log(src, model_filename, model_path)

  var model_json = zip.file(/model\.json$/i)
  if (model_json.length) {
    model_json[0].async("text").then(function (json) {
MMD_SA_options.model_para = Object.assign(MMD_SA_options.model_para, JSON.parse(json, function (key, value) {
  if (typeof value == "string") {
    if (/^eval\((.+)\)$/.test(value)) {
      value = eval(decodeURIComponent(RegExp.$1))
    }
  }
  return value
}));
change_object3D(model_path)
console.log("(model.json updated)")
    });
  }
  else {
    change_object3D(model_path)
  }
});
  }
  else {
    _onDrop_finish.call(DragDrop, item)
  }
}

var object3d_list = [];
function change_object3D(url) {
  function obj_proxy(obj3d) {
Object.defineProperty(this, "visible", {
  get: function () { return obj3d._obj.visible; },
  set: function (v) { obj3d._obj.visible = v; },
});
  }

  new THREE.XLoader( url, function( mesh ) {
var model_filename = toLocalPath(url).replace(/^.+[\/\\]/, "")
var model_filename_cleaned = model_filename.replace(/[\-\_]copy\d+\.x$/, ".x").replace(/[\-\_]v\d+\.x$/, ".x")
var model_para = MMD_SA_options.model_para[model_filename] || MMD_SA_options.model_para[model_filename_cleaned] || {}

let material_para = model_para.material_para || {}
material_para = material_para._default_ || {}
if (material_para.receiveShadow != false)
  mesh.receiveShadow = true

if (MMD_SA.THREEX.enabled) {
}
else {
  if (model_para.instanced_drawing)
    mesh.instanced_drawing = model_para.instanced_drawing
//  mesh.instanced_drawing = 99

  mesh.useQuaternion = true
}

MMD_SA.THREEX.scene.add(mesh)

var placement = model_para.placement || {};
mesh.position.copy(THREE.MMD.getModels()[0].mesh.position)
if (placement.position)
  mesh.position.add(placement.position)
mesh.scale.multiplyScalar(placement.scale||10)

var object3d = Object.assign({}, model_para)
if (!object3d.user_data) object3d.user_data = {}
object3d._obj = mesh
object3d._obj_proxy = new obj_proxy(object3d)

object3d_list.push(object3d)
if (object3d.parent_bone)
  MMD_SA_options.Dungeon.accessory_list.push(object3d)

console.log(object3d)

if (!object3d.parent_bone) {
  System._browser.camera.poseNet.auto_grounding = true
  System._browser.camera.poseNet.ground_plane_visible = false
  MMD_SA.WebXR.ground_plane.visible = System._browser.camera.poseNet.ground_plane_visible

  System._browser.camera.display_floating = (MMD_SA_options.user_camera.display.floating || (MMD_SA_options.user_camera.display.floating_auto !== false));
}
  }, function() {
  });
}

var panorama_loading;
function change_panorama(index, src) {
  function show() {
    panorama_loading = false
    sd.texture_index = index
    sd.texture_setup()
    System._browser.camera.display_floating = (MMD_SA_options.user_camera.display.floating || (MMD_SA_options.user_camera.display.floating_auto !== false));
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

  panorama_loading = true
  var image = sd.texture_cache_list[index] = sd.texture_cache_list[index] || new Image();
  image.onload = function () {
    show()
  };
  image.src = toFileProtocol(src)
}

var dome_axis_angle = 0
var dome_rotation = 0
var dome_rotation_speed = 0
function rotate_dome() {
  var axis = MMD_SA.TEMP_v3.set(0,1,0)
  axis.applyEuler(MMD_SA._v3a.set(0, 0, dome_axis_angle/180*Math.PI))
  dome_rotation = (dome_rotation + RAF_timestamp_delta/(1000*60*10) * dome_rotation_speed * 360) % 360;

  MMD_SA_options.mesh_obj_by_id["DomeMESH"]._obj.useQuaternion = true
  MMD_SA_options.mesh_obj_by_id["DomeMESH"]._obj.quaternion.setFromAxisAngle(axis, dome_rotation/180*Math.PI)
}

function ML_off() {
  MMD_SA.WebXR.user_camera.facemesh.enabled = false
  MMD_SA.WebXR.user_camera.poseNet.enabled = false
  MMD_SA.WebXR.user_camera.handpose.enabled = false
  MMD_SA_options.Dungeon_options.item_base['magic_wand'].action._motion_list_index = -1
  MMD_SA_options.Dungeon_options.item_base['magic_wand'].action.func()
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

var bg_branch = 5
var panorama_branch = 12
var object3D_branch = 18
var done_branch = 11
var about_branch = 19
var export_motion_branch = 22
var record_motion_branch = 25
var mocap_options_branch = 29
var facemesh_options_branch = 34
var motion_control_branch = 40

var show_other_options = false

return [
//0
      [
        {
          message: {
  get content() { this._motion_for_export_ = /\.(bvh|fbx)$/i.test(MMD_SA.vmd_by_filename[MMD_SA.MMD.motionManager.filename].url) || System._browser.camera.motion_recorder.vmd; return (!show_other_options && System._browser.camera.ML_enabled) ? ((this._motion_for_export_) ? '1. Export motion to file\n2. Record motion\n3. Mocap options\n4. Mocap OFF' : '1. Record motion\n2. Mocap options\n3. Mocap OFF\n4. Enable motion control') + '\n5. Other options\n6. Cancel' : '1. Overlay & UI\n2. BG/Scene/3D\n3. Export motion to file\n4. About\n5. Cancel'; }
 ,bubble_index: 3
 ,get branch_list() {
return (!show_other_options && System._browser.camera.ML_enabled) ? ((this._motion_for_export_) ? [
  { key:1, branch_index:export_motion_branch },
  { key:2, branch_index:record_motion_branch },
  { key:3, branch_index:mocap_options_branch },
  { key:4, branch_index:2 },
  { key:5, event_id:{ func:()=>{show_other_options=true;setTimeout(()=>{show_other_options=false},0);}, goto_event: { id:"_FACEMESH_OPTIONS_", branch_index:0 } } },
  { key:6 }
] : [
  { key:1, branch_index:record_motion_branch },
  { key:2, branch_index:mocap_options_branch },
  { key:3, branch_index:2 },
  { key:4, branch_index:motion_control_branch },
  { key:5, event_id:{ func:()=>{show_other_options=true;setTimeout(()=>{show_other_options=false},0);}, goto_event: { id:"_FACEMESH_OPTIONS_", branch_index:0 } } },
  { key:6 }
]) : [
  { key:1, branch_index:1 },
  { key:2, branch_index:3 },
  { key:3, branch_index:export_motion_branch },
  { key:4, branch_index:about_branch },
  { key:5 }
];
  }
          }
        }
      ]
// 1
     ,[
        {
          goto_event: { id:"_SETTINGS_", branch_index:11 }
        }
      ]
// 2
     ,[
        {
          func: function () {
ML_off()
          }
         ,ended: true
        }
      ]
//3
     ,[
        {
          func: function () {
          }
         ,message: {
  content: 'Choose a feature to change.\n1. Background image\n2. 3D panorama\n3. 3D object\n4. Back to default\n5. Cancel'
 ,bubble_index: 3
 ,branch_list: [
    { key:1, branch_index:bg_branch }
   ,{ key:2, branch_index:panorama_branch }
   ,{ key:3, branch_index:object3D_branch }
   ,{ key:4, branch_index:4 }
   ,{ key:5 }
  ]
          }
        }
      ]
// 4
     ,[
        {
          func: function () {
LdesktopBG_host.style.display = bg_state_default
document.body.style.backgroundColor = bg_color_default
LdesktopBG.style.backgroundImage = bg_wallpaper_default
MMD_SA_options.user_camera.display.webcam_as_bg = webcam_as_bg_default

MMD_SA_options.mesh_obj_by_id["DomeMESH"]._obj.visible = false
dome_axis_angle = 0
dome_rotation = 0
dome_rotation_speed = 0
System._browser.on_animation_update.remove(rotate_dome,1)

object3d_list.forEach(object3d => {
  MMD_SA.scene.remove(object3d._obj);
  if (object3d.parent_bone)
    MMD_SA_options.Dungeon.accessory_list.filter(a => a !== object3d);
});
object3d_list = []
System._browser.camera.display_floating = false
          }
         ,ended: true
        }
      ]
//5
     ,[
        {
          func: function () {
DragDrop.onDrop_finish = onDrop_change_wallpaper;
          }
         ,message: {
  content: 'Choose a BG option below, or drop an image file to change the wallpaper.\n1. Default\n2. Black\n3. White\n4. Green\n5. Webcam as BG\n6. Done'
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
// 6
     ,[
        {
          func: function () {
LdesktopBG_host.style.display = bg_state_default
document.body.style.backgroundColor = bg_color_default
LdesktopBG.style.backgroundImage = bg_wallpaper_default
MMD_SA_options.user_camera.display.webcam_as_bg = webcam_as_bg_default
          }
         ,goto_branch: bg_branch
        }
      ]
// 7
     ,[
        {
          func: function () {
LdesktopBG_host.style.display = "none"
document.body.style.backgroundColor = "#000000"
          }
         ,goto_branch: bg_branch
        }
      ]
// 8
     ,[
        {
          func: function () {
LdesktopBG_host.style.display = "none"
document.body.style.backgroundColor = "#FFFFFF"
          }
         ,goto_branch: bg_branch
        }
      ]
// 9
     ,[
        {
          func: function () {
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
MMD_SA_options.user_camera.display.webcam_as_bg = true
DEBUG_show('(Use webcam as BG)', 2)
          }
         ,goto_branch: bg_branch
        }
      ]
// 11
     ,[
        {
          func: function () {
DragDrop.onDrop_finish = _onDrop_finish
System._browser.camera._info = ''
          }
         ,ended: true
        }
      ]
// 12
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
// 13
     ,[
        {
          func: function () {
change_panorama(1, System.Gadget.path + '/images/_dungeon/tex/ryntaro_nukata/blue_sky.jpg')
          }
         ,goto_branch: panorama_branch
        }
      ]
// 14
     ,[
        {
          func: function () {
change_panorama(2, System.Gadget.path + '/images/_dungeon/tex/ryntaro_nukata/angel_staircase.jpg')
          }
         ,goto_branch: panorama_branch
        }
      ]
// 15
     ,[
        {
          func: function () {
change_panorama(3, System.Gadget.path + '/images/_dungeon/tex/stars_milky_way.jpg')
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
DragDrop.onDrop_finish = onDrop_change_object3D;
          }
         ,message: {
  content: 'Drop a zip file containing one .x model file as well as all associated textures.\n1. Done'
 ,bubble_index: 3
 ,branch_list: [
    { key:1, branch_index:done_branch }
  ]
          }
        }
      ]
// 19
     ,[
        {
          message: {
  content: '1. Video demo\n2. Readme\n3. Download app version\n4. Cancel'
 ,bubble_index: 3
 ,branch_list: [
    { key:1, branch_index:about_branch+1 }
   ,{ key:2, branch_index:about_branch+2 }
   ,{ key:3, event_id:{
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
   ,{ key:4 }
  ]
          }
        }
      ]
// 20
     ,[
        {
          func: function () {
var url = 'https://youtube.com/playlist?list=PLLpwhHMvOCSt3i7NQcyJq1fFhoMiSmm5H'
if (webkit_electron_mode)
  webkit_electron_remote.shell.openExternal(url)
else
  window.open(url)
          }
         ,ended: true
        }
      ]
// 21
     ,[
        {
          func: function () {
var url = self._readme_url_ || System.Gadget.path + '/readme.txt'
if (webkit_electron_mode)
  webkit_electron_remote.shell.openExternal(url)
else
  window.open(url)
          }
         ,ended: true
        }
      ]
// 22
     ,[
        {
          func: function () {
if (/\.(bvh|fbx)$/i.test(MMD_SA.vmd_by_filename[MMD_SA.MMD.motionManager.filename].url) || System._browser.camera.motion_recorder.vmd) return true;
          }
         ,message: {
  content: 'There is no motion to export. Enable motion capture and record the motion, or drop a BVH/FBX motion file.',
  duration: 5
          }
         ,ended: true
        }
       ,{
          func: function () {
          }
         ,message: {
  get content() { return 'Choose a motion format to export.\n1. VMD\n2. Cancel'; } 
 ,bubble_index: 3
 ,get branch_list() {
return [
  { key:1, branch_index:export_motion_branch+1 }
].concat((0) ? [
  { key:2, branch_index:export_motion_branch+2 }
 ,{ key:3 }
] : [
  { key:2 }
]);
  }
          }
        }
      ]
// 23
     ,[
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
  get content() { return '1. Leg IK:' + ((MMD_SA_options.user_camera.ML_models.pose.use_legIK)?'ON':'OFF') + '\n2. Leg scale adjustment:' + ((!System._browser.camera.poseNet.leg_scale_adjustment)?'OFF':((System._browser.camera.poseNet.leg_scale_adjustment>0 && '+')||'')+System._browser.camera.poseNet.leg_scale_adjustment) + '\n3. Auto-grounding:' + ((!System._browser.camera.poseNet.auto_grounding)?'OFF':'ON') + '\n4. Clear bounding box\n5. Facemesh options\n6. Done'; }
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

return '\n1. Eyeblink LR sync:' + ((!System._browser.camera.facemesh.blink_sync)?'OFF':'ON') + '\n2. Eye tracking:' + ((!System._browser.camera.facemesh.eye_tracking)?'OFF':'ON') + ((camera.facemesh.enabled && camera.video) ? '\n3. Reset calibration\n4. Import calibration\n5. Export calibration\n6. Done' : '\n3. Done');
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
   ,grid_array: [
  [2]
    ]
  }

 ,grid_size: 64*10

 ,floor_material_index_default: -1
 ,wall_material_index_default: -1
 ,ceil_material_index_default: -1

 ,ambient_light_color: "#FFF"
 ,light_color: '#606060'

 ,skydome: {
    visible: false
  }

// ,no_camera_collision: true
// ,camera_y_default_non_negative: false

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

//MMD_SA_options.Dungeon_options = null;
// END


  window.addEventListener("MMDStarted", function () {
MMD_SA.custom_action_default["cover_undies"].action._condition = function (is_bone_action, objs, _default) {
  if (/i\-shaped_balance/.test(MMD_SA.MMD.motionManager.filename) && (MMD_SA._ry > 1)) return true;

  return _default;
};

const use_THREEX = MMD_SA.THREEX.enabled;
const THREE = MMD_SA.THREEX.THREE;

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

document.getElementById("Ldungeon_inventory_item" + MMD_SA.WebXR._item_reticle.index + "_icon").style.opacity = 1

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

})();


if (webkit_electron_mode) document.write('<script language="JavaScript" src="' + toFileProtocol(Settings.f_path + '/animate_customized.js') + '"></scr'+'ipt>');;

// main js
if (MMD_SA_options.Dungeon_options)
  document.write('<script language="JavaScript" src="js/dungeon.js"></scr'+'ipt>');
document.write('<script language="JavaScript" src="MMD.js/MMD_SA.js"></scr'+'ipt>');
