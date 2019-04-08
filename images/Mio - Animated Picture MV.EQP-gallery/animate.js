// Mio and Midnight City

Settings_default._custom_.Display = "-1"
if (use_SA_browser_mode && !is_SA_child_animation)
  Settings_default._custom_.WallpaperAsBG = "non_default"
if (use_SA_browser_mode) {
  Settings_default._custom_.EventToMonitor = "SOUND_ALL"
  Settings_default._custom_.UpdateInterval = "1"
  Settings_default._custom_.UseAudioFFT = "non_default"
  Settings_default._custom_.Use32BandSpectrum = "non_default"
}

if (use_EQP_fireworks) {
  var CanvasEffect_options = {
  start_x: -0.09
 ,start_y: -0.39
// ,chosen_gravity: 0

 ,vector_z_func: function () { return (Math.random() * -10) }

 ,icon: 1
  }
}

// zoomblur
var WebGL_2D_options = {
  zoomblur_center_x: -0.09
 ,zoomblur_center_y: -0.39
}

if (WallpaperEngine_CEF_mode)
  self.SA_wallpaper_src = "images/wood_wallpaper_flip-h.jpg"

/*
var CANVAS_Video_Overlay = {
  url: "C:\\Users\\User\\Downloads\\_DreamScene\\HyperSpeed_(720p).mp4"
 ,bg_darken_by: 1/3
}
*/