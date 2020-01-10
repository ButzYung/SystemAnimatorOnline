// Settings WE (v1.1.1)

window.wallpaperPropertyListener = (function () {

  var update_LS = false
  var Settings_default_by_path

  function setSettingsDefault(v, WE_p_name, SA_p_name, settings_for_all) {
Settings_WE[WE_p_name] = v
if (!loaded)
  return

Settings_default_by_path = Settings_default_by_path || JSON.parse(localStorage.Settings_default_by_path)
var label = (settings_for_all) ? System.Gadget.path : SA_HTA_folder
if (!label) {
  DEBUG_show("(ERROR: Animation path not found in localStorage)", 10)
  return
}
// backward compatibility
if (!Settings_default_by_path[label]) {
  Settings_default_by_path[label] = {}
}

if (typeof v == 'boolean') {
  if (Settings_default[SA_p_name])
    v = (v)  ? "" : "non_default"
  else
    v = (!v) ? "" : "non_default"
}

if (Settings_default_by_path[label][SA_p_name] != v) {
  Settings_default_by_path[label][SA_p_name] = v
  update_LS = true
}
  }

  var delay_exec = (function () {
    var timerID = {}

    return function (p_name, func, delay) {
      if (timerID[p_name])
        clearTimeout(timerID[p_name])
      timerID[p_name] = setTimeout(function ()　{ timerID[p_name]=null; func(); }, ((delay==null) ? 500 : delay))
    };
  })();

  var WE_wallpaperProperty_func = {
    "SA_visualizer_scale": function (v) {
Settings_WE.SA_visualizer_scale = v
    }

   ,"SA_visualizer_sensitivity": function (v) {
Settings_WE.SA_visualizer_sensitivity = Settings_default._custom_.MonitorSensitivity = v || parseInt(Settings_default.MonitorSensitivity)
if (loaded)
  Settings.MonitorSensitivity = Settings_WE.SA_visualizer_sensitivity
    }

   ,"SA_visualizer_beat_detection": function (v) {
if (loaded)
  Settings.EnableBeatDetection = v
else
  setSettingsDefault(v, "SA_visualizer_beat_detection", "EnableBeatDetection")
    }

   ,"SA_animation_combo": function (v) {
setSettingsDefault(v, "SA_animation_combo", "animation_path_default.txt", true)
    }


   ,"SA_position_x_ratio": function (v) {
if (!self.EQP_wallpaper_mode_enabled)
  return

EQP_wallpaper_mode.x_ratio = v/100

if (!returnBoolean("CSSTransformFullscreen")) {
  System.Gadget.Settings.writeString("CSSTransformFullscreen", "non_default")
  Settings.CSSTransformFullscreen = true
  SA_zoom = 1
}

if (EQP_EV_initialized)
  delay_exec("SA_position_x_ratio", resize)
    }

   ,"SA_position_y_ratio": function (v) {
if (!self.EQP_wallpaper_mode_enabled)
  return

EQP_wallpaper_mode.y_ratio = v/100

if (!returnBoolean("CSSTransformFullscreen")) {
  System.Gadget.Settings.writeString("CSSTransformFullscreen", "non_default")
  Settings.CSSTransformFullscreen = true
  SA_zoom = 1
}

if (EQP_EV_initialized)
  delay_exec("SA_position_y_ratio", resize)
    }


   ,"SA_BG_url": function (v) {
Settings_WE.SA_BG_url = v || (self.SA_wallpaper_src && /\.(png|bpm|jpg|jpeg)$/i.test(SA_wallpaper_src) && SA_wallpaper_src) || ""
if (!self.System)
  return
delay_exec("SA_BG", function () { System._browser.updateWallpaper(Settings_WE.SA_BG_url, Settings_WE.SA_BG_style) }, 100)
    }

   ,"SA_BG_style": function (v) {
Settings_WE.SA_BG_style = v
if (!self.System)
  return
delay_exec("SA_BG", function () { System._browser.updateWallpaper(Settings_WE.SA_BG_url, Settings_WE.SA_BG_style) }, 100)
    }

   ,"SA_BG_animation_opacity": function (v) {
v /= 100

var bs = System._browser.body.style
if (loaded && ((bs.opacity || 1) != v)) {
//  DEBUG_show("Opacity:" + parseInt(v*100) + "%", 2)
  delay_exec("SA_position_x_ratio", new Function('System._browser.body.style.opacity=' + v))
}

setSettingsDefault(v, "SA_BG_animation_opacity", "Opacity")
    }


   ,"SA_video_overlay_effect_type": function (v) {
if (!self.CANVAS_Video_Overlay)
  return

// CANVAS_Video_Overlay not initialized yet
if (CANVAS_Video_Overlay.url_default == null) {
  if (v == "None")
    CANVAS_Video_Overlay.url = ""
  else if (!/^(None|Default)$/.test(v))
    CANVAS_Video_Overlay.url = System.Gadget.path + "\\TEMP\\webm\\" + v
  return
}

if (v == "None") {
  if (CANVAS_Video_Overlay.url) {
    CANVAS_Video_Overlay._video.pause()
    CANVAS_Video_Overlay.stopping = function () { return this._video.paused }
    CANVAS_must_redraw = true
  }
}
else if (v == "Default") {
  if (CANVAS_Video_Overlay.url_default) {
    if (CANVAS_Video_Overlay.url != CANVAS_Video_Overlay.url_default) {
      CANVAS_Video_Overlay.url = CANVAS_Video_Overlay.url_default
      CANVAS_Video_Overlay._video.src = toFileProtocol(CANVAS_Video_Overlay.url)
    }
    else if (CANVAS_Video_Overlay._video.paused)
      CANVAS_Video_Overlay._video.play()
    CANVAS_Video_Overlay.stopping = null
  }
  else {
    this.SA_video_overlay_effect_type("None")
  }
}
else {
  var url = System.Gadget.path + "\\TEMP\\webm\\" + v
  if (CANVAS_Video_Overlay.url != url) {
    CANVAS_Video_Overlay.url = url
    CANVAS_Video_Overlay._video.src = toFileProtocol(url)
  }
  else if (CANVAS_Video_Overlay._video.paused)
    CANVAS_Video_Overlay._video.play()
  CANVAS_Video_Overlay.stopping = null
}
    }

   ,"SA_video_overlay_effect_0_use_default": function (v) {
if (!self.CANVAS_Video_Overlay)
  return
if (v == !CANVAS_Video_Overlay._WE_customized)
  return

CANVAS_Video_Overlay._WE_customized = !v

// CANVAS_Video_Overlay not initialized yet
if (CANVAS_Video_Overlay.url_default == null)
  return

if (CANVAS_Video_Overlay._WE_customized) {
  for (var p in CANVAS_Video_Overlay._WE_custom)
    CANVAS_Video_Overlay[p] = CANVAS_Video_Overlay._WE_custom[p]
}
else {
  for (var p in CANVAS_Video_Overlay._WE_default)
    CANVAS_Video_Overlay[p] = CANVAS_Video_Overlay._WE_default[p]
}
    }

   ,"SA_video_overlay_effect_video_compositeOperation": function (v) {
if (!self.CANVAS_Video_Overlay)
  return
if (!CANVAS_Video_Overlay._WE_customized)
  return

if (v == "Default") {
  if (!CANVAS_Video_Overlay._WE_default)
    return
  v = CANVAS_Video_Overlay._WE_default.video_compositeOperation
}

CANVAS_Video_Overlay.video_compositeOperation = v
if (CANVAS_Video_Overlay._WE_custom)
  CANVAS_Video_Overlay._WE_custom.video_compositeOperation = v
    }

   ,"SA_video_overlay_effect_video_alpha": function (v) {
if (!self.CANVAS_Video_Overlay)
  return
if (!CANVAS_Video_Overlay._WE_customized)
  return

CANVAS_Video_Overlay.video_alpha = v/100
if (CANVAS_Video_Overlay._WE_custom)
  CANVAS_Video_Overlay._WE_custom.video_alpha = v/100
    }

   ,"SA_video_overlay_effect_bg_darken_by": function (v) {
if (!self.CANVAS_Video_Overlay)
  return
if (!CANVAS_Video_Overlay._WE_customized)
  return

CANVAS_Video_Overlay.bg_darken_by = v/100
if (CANVAS_Video_Overlay._WE_custom)
  CANVAS_Video_Overlay._WE_custom.bg_darken_by = v/100
    }


   ,"SA_canvas_effect_matrix_rain": function (v) {
setSettingsDefault(v, "SA_canvas_effect_matrix_rain", "UseMatrixRain")
    }

   ,"SA_canvas_effect_matrix_rain_color": function (v) {
setSettingsDefault(v, "SA_canvas_effect_matrix_rain_color", "MatrixRainColor")
    }

   ,"SA_canvas_effect_matrix_rain_play_on_idle": function (v) {
if (self.EQP_matrix_rain) {
  EQP_matrix_rain.play_on_idle = v
}

setSettingsDefault(v, "SA_canvas_effect_matrix_rain_play_on_idle", "MatrixRainPlayOnIdle")
    }

   ,"SA_canvas_effect_matrix_rain_musical": function (v) {
if (self.EQP_matrix_rain && ((EQP_matrix_rain.use_AudioFFT == null) || (!!EQP_matrix_rain.use_AudioFFT != v))) {
  EQP_matrix_rain.use_AudioFFT = v
  if (EQP_matrix_rain.canvas_matrix)
    EQP_matrix_rain.matrixCreate()
}

setSettingsDefault(v, "SA_canvas_effect_matrix_rain_musical", "MatrixRainMusical")
    }

   ,"SA_canvas_effect_fireworks_ripples": function (v) {
if (v == "None") {
  setSettingsDefault(false, "SA_canvas_effect_fireworks", "UseCanvasFireworks")
  setSettingsDefault(false, "SA_canvas_effect_ripples"  , "UseCanvasRipple")
}
else if (v == "Fireworks") {
  setSettingsDefault(true,  "SA_canvas_effect_fireworks", "UseCanvasFireworks")
  setSettingsDefault(false, "SA_canvas_effect_ripples"  , "UseCanvasRipple")
}
else if (v == "Ripples") {
  setSettingsDefault(false, "SA_canvas_effect_fireworks", "UseCanvasFireworks")
  setSettingsDefault(true,  "SA_canvas_effect_ripples"  , "UseCanvasRipple")
}
    }

   ,"SA_canvas_effect_fireworks_0_use_default": function (v) {
if (!use_EQP_fireworks)
  return
if (v == !EQP_Fireworks._WE_customized)
  return

EQP_Fireworks._WE_customized = !v

var custom_flag_list = ["vector_x_func","vector_y_func","vector_z_func", "start_x","start_y", "vector_x_mod","vector_y_mod", "chosen_gravity"]
if (EQP_Fireworks._WE_customized) {
  custom_flag_list.forEach(function (p) {
    if (EQP_Fireworks._custom_WE[p] != null)
      EQP_Fireworks[p] = EQP_Fireworks._custom_WE[p]
  });
}
else {
  custom_flag_list.forEach(function (p) {
    EQP_Fireworks[p] = EQP_Fireworks._custom_default[p]
  });
}
EQP_Fireworks.setup()
    }

   ,"SA_canvas_effect_fireworks_type": function (v) {
if (!use_EQP_fireworks || !EQP_Fireworks._WE_customized)
  return

if (v == 99) {
  if (!EQP_Fireworks.icon_set.icon[EQP_Fireworks.icon_set.icon_custom_index])
    v = 0
}
EQP_Fireworks.icon_index = v
EQP_Fireworks.setup_icon()
    }

   ,"SA_canvas_effect_fireworks_start_x": function (v) {
if (!use_EQP_fireworks || !EQP_Fireworks._WE_customized)
  return

EQP_Fireworks._custom_WE.start_x = v/100

delay_exec("SA_canvas_effect_fireworks_start_x", function () {
  var custom_flag_list = ["vector_x_func","vector_y_func","vector_z_func", "start_x","start_y", "vector_x_mod","vector_y_mod", "chosen_gravity"]
  custom_flag_list.forEach(function (p) {
    if (EQP_Fireworks._custom_WE[p] != null)
      EQP_Fireworks[p] = EQP_Fireworks._custom_WE[p]
  });
  EQP_Fireworks.setup()
});
    }

   ,"SA_canvas_effect_fireworks_start_y": function (v) {
if (!use_EQP_fireworks || !EQP_Fireworks._WE_customized)
  return

EQP_Fireworks._custom_WE.start_y = v/100

delay_exec("SA_canvas_effect_fireworks_start_x", function () {
  var custom_flag_list = ["vector_x_func","vector_y_func","vector_z_func", "start_x","start_y", "vector_x_mod","vector_y_mod", "chosen_gravity"]
  custom_flag_list.forEach(function (p) {
    if (EQP_Fireworks._custom_WE[p] != null)
      EQP_Fireworks[p] = EQP_Fireworks._custom_WE[p]
  });
  EQP_Fireworks.setup()
});
    }

   ,"SA_canvas_effect_fireworks_gravity": function (v) {
if (!use_EQP_fireworks || !EQP_Fireworks._WE_customized)
  return

EQP_Fireworks._custom_WE.chosen_gravity = v

delay_exec("SA_canvas_effect_fireworks_start_x", function () {
  var custom_flag_list = ["vector_x_func","vector_y_func","vector_z_func", "start_x","start_y", "vector_x_mod","vector_y_mod", "chosen_gravity"]
  custom_flag_list.forEach(function (p) {
    if (EQP_Fireworks._custom_WE[p] != null)
      EQP_Fireworks[p] = EQP_Fireworks._custom_WE[p]
  });
  EQP_Fireworks.setup()
});
    }

   ,"SA_canvas_effect_fireworks_bullet_shell_per_frame": function (v) {
if (!use_EQP_fireworks)
  return

delay_exec("SA_canvas_effect_fireworks_bullet_shell_per_frame", function () {
  EQP_Fireworks._new_particles_per_update = parseInt(v)
});
    }

   ,"SA_canvas_effect_fireworks_bullet_shell_by_beat": function (v) {
if (!use_EQP_fireworks)
  return

delay_exec("SA_canvas_effect_fireworks_bullet_shell_by_beat", function () {
  EQP_Fireworks._by_beat = !!v
});
    }

   ,"SA_canvas_effect_motion_blur": function (v) {
setSettingsDefault(v, "SA_canvas_effect_motion_blur", "EnableMotionEffectForAnimatedPicture")
    }

   ,"SA_canvas_effect_motion_blur_decay": function (v) {
if (loaded)
  Settings.BDDecay = v
else
  setSettingsDefault(v, "SA_canvas_effect_motion_blur_decay", "BDDecay")
    }


   ,"SA_MMD_look_at_camera": function (v) {
if (!self.MMD_SA)
  return

if (v)
  MMD_SA_options.look_at_screen = true
else
  MMD_SA_options.look_at_screen = false//MMD_SA_options.look_at_mouse = false
    }

   ,"SA_MMD_look_at_mouse": function (v) {
if (!self.MMD_SA)
  return

if (v && MMD_SA_options._look_at_screen)
  MMD_SA_options.look_at_mouse = true
else
  MMD_SA_options.look_at_mouse = false
    }

   ,"SA_MMD_trackball_camera": function (v) {
if (!self.MMD_SA)
  return

System.Gadget.Settings._settings["MMDTrackballCamera"] = (v) ? "" : "non_default"
if (MMD_SA._trackball_camera)
  MMD_SA._trackball_camera.enabled = v
if (!v && MMD_SA.MMD_started)
  MMD_SA.reset_camera()
    }

   ,"SA_MMD_random_camera": function (v) {
if (!self.MMD_SA)
  return

System.Gadget.Settings._settings["MMDRandomCamera"] = (v) ? "" : "non_default"
if (!v && MMD_SA.MMD_started)
  MMD_SA.reset_camera()
    }


   ,"SA_hide_UI": function (v) {
Lquick_menu.style.display = LbuttonTL.style.display = (v) ? "none" : "block"
    }
  };

  return {
    applyUserProperties: function(properties) {
//DEBUG_show(JSON.stringify(properties),0,1)
      for (var name in properties) {
        var p = properties[name]
        if (!p)
          continue

        var v = p.value
        if (v == null)
          continue
//DEBUG_show([name,v],0,1)
//if (name == "SA_position_x_ratio") DEBUG_show(v,0,1)
        var settings_target = !is_SA_child_animation && SA_project_JSON && SA_project_JSON.settings_target && SA_project_JSON.settings_target[name]
        if (settings_target) {
          if (settings_target.condition) {
            settings_target._value = settings_target.value
            settings_target.condition_func = new Function("v", settings_target.condition)
            settings_target.condition = null
          }

          var st = (settings_target.condition_func && settings_target.condition_func(v)) || settings_target.value

          var child
          if (st.all || (st.child === true)) {
            child = []
            for (var i = 0; i < SA_child_animation_max; i++)
              child.push(i)
          }
          else
            child = st.child

          if (child) {
            child.forEach(function (idx) {
              var w = document.getElementById("Ichild_animation" + idx)
              if (w) {
                var _properties = {}
                _properties[name] = { value:v }
                if (w.contentWindow.loaded)
                  w.contentWindow.wallpaperPropertyListener.applyUserProperties(_properties)
                else {
                  if (!window.wallpaperPropertyListener._delayed_properties[idx])
                    window.wallpaperPropertyListener._delayed_properties[idx] = []
                  window.wallpaperPropertyListener._delayed_properties[idx].push(_properties)
                }
              }
            })
          }

          if (!st.all && !st.main)
            continue
        }

        WE_wallpaperProperty_func[name] && WE_wallpaperProperty_func[name](v)
      }

      if (update_LS) {
        localStorage.Settings_default_by_path = JSON.stringify(Settings_default_by_path)
        update_LS = false
      }
    }

   ,_delayed_properties: []
  };
})();
