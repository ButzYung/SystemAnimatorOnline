// Background

var EV_width  = screen.width
var EV_height = screen.height
var EQP_ref_width  = screen.width
var EQP_ref_height = screen.height
var EQP_parts_path = 'parts'

var EQP_use_wallpaper = true

var EQP_ps = [
//  {src:"GITS_final_by_guweiz-db1oemf.jpg", x:0,y:0, stretch_to_fill:true, o_min:-1}
  {src:"", x:0,y:0, is_wallpaper:true, o_min:-1}
]


var SA_wallpaper_src = Settings.f_path + "/parts/GITS_final_by_guweiz-db1oemf.jpg"

var CANVAS_Video_Overlay = {
  url:  Settings.f_path.replace(/[\/\\][^\/\\]+$/, "") + "/video/scan_line.mp4"
// ,use_wallpaper_as_bg: true
 ,bg_darken_by: 0
 ,video_alpha: 0.8
 ,play_on_idle: true
}


var MatrixRain_para = {
  char_list: '攻殻機動隊 GITS 幽霊 SOUL GHOST 機械 SHELL 公安九課 草薙素子 荒巻大輔 バトー 笑面男 傀儡師 義体化 人工知能 AI STAND ALONE COMPLEX SAC'
// ,grid_size: 16
// ,use_AudioFFT: true
}


if (use_EQP_fireworks) {
  var CanvasEffect_options = {
  start_x: 0
 ,start_y: 0
 ,chosen_gravity: 0

 ,vector_z_func: function () { return (Math.random() * -10) }

 ,icon: 0

 ,WMP_mask_disabled: true
  }
}


Settings_default._custom_.Display = "-1"
if (use_SA_browser_mode && !is_SA_child_animation) {
  Settings_default._custom_.WallpaperAsBG = "non_default"
//  Settings_default._custom_.DisableTransparency = "non_default"
}
if (use_SA_browser_mode) {
  Settings_default._custom_.EventToMonitor = "SOUND_ALL"
  Settings_default._custom_.UpdateInterval = "1"
  Settings_default._custom_.UseAudioFFT = "non_default"
  Settings_default._custom_.Use32BandSpectrum = "non_default"
//  Settings_default._custom_.CSSTransformFullscreen = "non_default"
//  Settings_default._custom_.UseCanvasFireworks = "non_default"
  Settings_default._custom_.UseMatrixRain = "non_default"
  Settings_default._custom_.MatrixRainMusical = "non_default"
  Settings_default._custom_.Use30FPS = "non_default"
}


// Core
document.write('<script language="JavaScript" src="js/EQP.js"></scr'+'ipt>')
