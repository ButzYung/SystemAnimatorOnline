// (2023-06-27)

var IPC

(function () {
  if (!webkit_electron_mode)
    return

  IPC = {
    _active_window_id: -1

   ,get active_window_id() {
if (!is_SA_child_animation) {
  if (this._active_window_id == -1)
    return -1
  return ((SA_child_animation[this._active_window_id]) ? this._active_window_id : -1)
  
}
else
  return parent.IPC.active_window_id
    }

   ,set active_window_id(id) {
((is_SA_child_animation) ? parent : self).IPC._active_window_id = id
    }

   ,get active_window() {
var id = this.active_window_id
if (id == -1)
  return SA_topmost_window;
return SA_topmost_window.document.getElementById("Ichild_animation" + id).contentWindow
    }

   ,get active_IPC() {
return this.active_window.IPC
    }

   ,ipcRenderer_DragDrop: function (event, path) {
if (/\.zip/i.test(path)) {
  let xhr = new XMLHttpRequestZIP;
  xhr.onload = function () {
    SA_DragDropEMU(new File([this.response], path))
  };
  xhr.open("GET", toFileProtocol(path), true);
  xhr.responseType = "blob";
  xhr.send();
}
else {
  let item = new System.Shell._FolderItem(new WebKit_object["Shell.Application"]._FolderItem({path:path}))

  if (DragDrop.validate_func(item))
    DragDrop.onDrop_finish(item)
  else
    DEBUG_show("(Unsupported file type)", 5)
}
    }

   ,ipcRenderer_capturePage: function (event, message) {
  SA_topmost_window.System._browser.capturePage_in_process = false

  var para = message.split("|")
  switch (para[0]) {
    case "FAILED":
      break

    case "RESULT":
      SA_topmost_window.System._browser.capturePage_pixel = JSON.parse("[" + para[1] + "]")
//      DEBUG_show(para[1])
      break
  }
    }

   ,ipcRenderer_tray_menu: function (event, message) {
  if (!/^(.+)\:(.+)$/.test(message))
    return

  var type  = RegExp.$1
  var value = RegExp.$2
  var para = value.split("|")
//DEBUG_show(message,0,1)
//.onkeydown({ keyCode:97+SA_child_animation_id })
try {
  switch (type) {
    case "SHOW_GADGET":
      webkit_window.show()
      System._gadget_resume()
      break
    case "HIDE_GADGET":
      if (linux_mode)
        webkit_window.minimize()
      else
        webkit_window.hide()
      System._gadget_pause()
      break
    case "CLICK_THRU":
    case "CLICK_THRU_PARTIAL":
if (is_SA_child_animation) {
  DEBUG_show("(Switch to the top window to change this option.)", 5)
  System._browser.update_tray()
  return
}
if (!webkit_version_milestone["1.2.2"]) {
  DEBUG_show("(click-thru not supported)", 2)
  System._browser.update_tray()
  return
}

var IgnoreMouseEvents, IgnoreMouseEventsPartial
if (type == "CLICK_THRU_PARTIAL") {
  IgnoreMouseEvents = false
  IgnoreMouseEventsPartial = !returnBoolean("IgnoreMouseEventsPartial")
}
else {
  IgnoreMouseEvents = !returnBoolean("IgnoreMouseEvents")
  IgnoreMouseEventsPartial = false
}

System.Gadget.Settings.writeString("IgnoreMouseEvents", ((IgnoreMouseEvents)?"non_default":""))
System.Gadget.Settings.writeString("IgnoreMouseEventsPartial", ((IgnoreMouseEventsPartial)?"non_default":""))

try {
  webkit_window.setIgnoreMouseEvents(IgnoreMouseEvents)
  webkit_window.setFocusable(!IgnoreMouseEvents)
  if (type == "CLICK_THRU_PARTIAL")
    DEBUG_show("Click-thru (partial):" + ((IgnoreMouseEventsPartial)?"ON":"OFF"), 5)
  else
    DEBUG_show("Click-thru:" + ((IgnoreMouseEvents)?"ON":"OFF"), 5)
}
catch (err) {}

if (IgnoreMouseEvents) {
  SA_ClearInterface(new CustomEvent("key_TEMP"))
}

System._browser.update_tray()
      break

    case "ALWAYS_ON_TOP":
if (is_SA_child_animation) {
  DEBUG_show("(Switch to the top window to change this option.)", 5)
  System._browser.update_tray()
  return
}

System.Gadget.Settings.writeString("AutoItAlwaysOnTop", ((returnBoolean("AutoItAlwaysOnTop"))?"":"non_default"))

var AutoItAlwaysOnTop = returnBoolean("AutoItAlwaysOnTop")
try {
  webkit_window.setAlwaysOnTop(AutoItAlwaysOnTop)
  DEBUG_show("Always on top:" + ((AutoItAlwaysOnTop)?"ON":"OFF"), 5)
}
catch (err) {}
      break

    case "STAY_ON_DESKTOP":
if (is_SA_child_animation) {
  DEBUG_show("(Switch to the top window to change this option.)", 5)
  System._browser.update_tray()
  return
}

if (returnBoolean("DisableTransparency") || webkit_electron_remote.getGlobal("is_natural_opaque")) {
  System.Gadget.Settings.writeString("AutoItStayOnDesktop", ((returnBoolean("AutoItStayOnDesktop")) ? "" : "non_default"))

  var AutoItStayOnDesktop = returnBoolean("AutoItStayOnDesktop")
  if (AutoItStayOnDesktop)
    System.Gadget.Settings.writeString("IgnoreMouseEventsPartial", "")
  WebKit_object.stay_on_desktop(AutoItStayOnDesktop, function () {
    resize(null,null,null, true)
    if (AutoItStayOnDesktop) {
      SA_ClearInterface(new CustomEvent("key_TEMP"))
      if (returnBoolean("AutoItAutoPause"))
        WebKit_object.monitor_winstate.init()
      else
        WebKit_object.monitor_winstate.enabled = false
    }
    try {
      var IgnoreMouseEvents = returnBoolean("IgnoreMouseEvents")
      webkit_window.setIgnoreMouseEvents(IgnoreMouseEvents && !WallpaperEngine_mode)
      webkit_window.setFocusable(!IgnoreMouseEvents && !AutoItStayOnDesktop)
    }
    catch (err) {}
    DEBUG_show("Stay on desktop:" + ((AutoItStayOnDesktop)?"ON":"OFF"), 5)
  });

  System._browser.update_tray()
  return
}

if (!confirm("NOTE: This will restart the gadget.")) {
  System._browser.update_tray()
  return;
}

System.Gadget.Settings.writeString("AutoItStayOnDesktop", ((returnBoolean("AutoItStayOnDesktop"))?"":"non_default"))
if (returnBoolean("AutoItStayOnDesktop"))
  System.Gadget.Settings.writeString("WallpaperAsBG", "non_default")
SA_Reload_PRE(Settings.f_path, Settings.f_path_folder, true)
      break

    case "AUTO_PAUSE":
if (is_SA_child_animation) {
  DEBUG_show("(Switch to the top window to change this option.)", 5)
  System._browser.update_tray()
  return
}

System.Gadget.Settings.writeString("AutoItAutoPause", ((returnBoolean("AutoItAutoPause"))?"":"non_default"))
if (returnBoolean("AutoItAutoPause"))
  WebKit_object.monitor_winstate.init()
else {
  WebKit_object.monitor_winstate.enabled = false
  DEBUG_show("Auto pause:OFF", 2)
}
System._browser.update_tray()
      break

    case "SIZE":
switch (para[0]) {
  case "1":
    System.Gadget.Settings.writeString("CSSTransformScale", "")
    System.Gadget.Settings.writeString("CSSTransformFullscreen", "")
    Settings.CSSTransformFullscreen = false
    Settings.CSSTransformScale = SA_zoom = 1
    DEBUG_show("x1", 2)
    break
  case "1.5":
    System.Gadget.Settings.writeString("CSSTransformScale", "1.5")
    System.Gadget.Settings.writeString("CSSTransformFullscreen", "")
    Settings.CSSTransformFullscreen = false
    Settings.CSSTransformScale = SA_zoom = 1.5
    DEBUG_show("x1.5", 2)
    break
  case "2":
    System.Gadget.Settings.writeString("CSSTransformScale", "2")
    System.Gadget.Settings.writeString("CSSTransformFullscreen", "")
    Settings.CSSTransformFullscreen = false
    Settings.CSSTransformScale = SA_zoom = 2
    DEBUG_show("x2", 2)
    break
  case "fullscreen":
    System.Gadget.Settings.writeString("CSSTransformScale", "")
    System.Gadget.Settings.writeString("CSSTransformFullscreen", "non_default")
    Settings.CSSTransformFullscreen = true
    Settings.CSSTransformScale = SA_zoom = 1
    DEBUG_show("Fullscreen", 2)
    break
  default:
    System._browser.update_tray()
    return
}

if (!Settings.CSSTransformFullscreen && self.EQP_size_scale && !self.EQP_video_options) {
  EQP_size_scale = SA_zoom
  SA_zoom = 1
  resize(null, function(){EQP_resize(EQP_size_scale)})
}
else
  resize()

System._browser.update_tray()
      break

    case "OPACITY":
switch (para[0]) {
  case "opacity":
    System._browser.onkeydown({ keyCode:79, _opacity_:parseFloat(para[1]) })
    break
  case "opacity_on_hover":
    var opacity_on_hover = parseFloat(para[1])
    if (opacity_on_hover == 1)
      ((is_SA_child_animation) ? parent.document.getElementById("Ichild_animation" + SA_child_animation_id) : System._browser.body).style.opacity = System._browser.Opacity
    System.Gadget.Settings.writeString("OpacityOnHover", ((opacity_on_hover == 1) ? "" : opacity_on_hover))
    DEBUG_show((opacity_on_hover * 100) + "% opacity on hover", 3)
    break
  case "apply_to_child":
if (is_SA_child_animation) {
  DEBUG_show("(Switch to the top window to change this option.)", 5)
  System._browser.update_tray()
  return
}

var p = document.getElementById("Lchild_animation_parent")
if (!p) {
  System._browser.update_tray()
  break
}

if (!confirm("NOTE: This will restart the animation.")) {
  System._browser.update_tray()
  break
}

System.Gadget.Settings.writeString("CSSTransformToChildAnimation", ((returnBoolean("CSSTransformToChildAnimation"))?"":"non_default"))
SA_Reload_PRE(Settings.f_path, Settings.f_path_folder)
/*
if (returnBoolean("CSSTransformToChildAnimation"))
  Lbody.appendChild(document.body.removeChild(p))
else
  document.body.appendChild(Lbody.removeChild(p))
DEBUG_show("(" + ((returnBoolean("CSSTransformToChildAnimation")) ? "ENABLED" : "DISABLED") + ": Apply CSS transform/opacity to child animations)", 5)
*/
    break
}
      break

    case "ACTIVE_WINDOW":
var id = parseInt(value)
IPC.active_window_id = id
var active_window = IPC.active_window
active_window.DEBUG_show("Active window-" + (id+1), 2)
active_window.System._browser.update_tray()
      break

    case "LOCK_CHILD_DRAGGING":
var bool = !!parseInt(value)
DEBUG_show("Child dragging:" + ((bool)?"LOCKED":"OK"), 3)
System.Gadget.Settings.writeString("ChildDragDisabled", ((bool)?"non_default":""))
      break

    case "MEDIA_CONTROL":
self["SL_MC_" + value]()
      break

    case "MMD":
MMD_SA.tray_menu_func(para)
if (WallpaperEngine_mode)
  System.Gadget.Settings._writeSettings()
      break

    case "CUSTOM":
System._browser.tray_menu_custom.process_func && System._browser.tray_menu_custom.process_func(para)
      break

    case "SETTINGS":
SA_OnKeyDown({ keyCode:69 }, true)
      break

    case "PAUSE_RESUME":
if (SA_topmost_window.EV_sync_update.RAF_paused) {
  if (System._gadget_resume())
    SA_topmost_window.DEBUG_show('Gadget RESUMED', 5)
}
else {
  if (System._gadget_pause())
    SA_topmost_window.DEBUG_show('Gadget PAUSED', 5)
}
      break

    case "RESTART":
/*
System._browser.showFocus(true)

setTimeout(function () {
  if (confirm('Press OK to restart ' + ((is_SA_child_animation) ? 'child animation ' + (SA_child_animation_id+1) : 'the gadget') + '.')) {
    SA_Reload_PRE(Settings.f_path, Settings.f_path_folder, true)
  }
  else
    System._browser.showFocus(false)
}, 100);
*/
SA_Reload_PRE(Settings.f_path, Settings.f_path_folder)
return
      break

    case "CLOSE":
SA_topmost_window.System._browser.confirmClose(true)
return
      break

    default:
console.log("IPC message:" + decodeURIComponent(type))
//DEBUG_show(decodeURIComponent(type))//, parseInt(para[1]||0), parseInt(para[2]||0))
  }

  if (linux_mode)
    System._browser.update_tray()
} catch (err) { console.error(err) }
}

  }
})();

(function () {
  if (EQP_gallery)
    document.write('<script language="JavaScript" src="js/EQP_gallery.js"></scr'+'ipt>')

  if (use_EQP_ripple || use_EQP_fireworks) {
    document.write('<script language="JavaScript" src="js/EQP_canvas_effects_core.js"></scr'+'ipt>')
    if (!EQP_gallery && use_WebGL && !self.WebGL_2D) {
      document.write('<script language="JavaScript" src="js/html5_webgl2d.js"></scr'+'ipt>')
    }
  }

  if (use_SVG_Clock)
    document.write('<script language="JavaScript" src="js/svg_clock.js"></scr'+'ipt>')

  Settings.UseAudioFFT = ((webkit_mode || (xul_version >= 26)) && (returnBoolean("UseAudioFFT") || (self.MMD_SA_options && MMD_SA_options.use_CircularSpectrum)/* || returnBoolean("AutoItWinampMode")*/))
  Settings.UseAudioFFTLiveInput = Settings.UseAudioFFT && (returnBoolean("UseAudioFFTLiveInput") || returnBoolean("AutoItWinampMode"))
  if (Settings.UseAudioFFT)
    document.write('<script language="JavaScript" src="js/audio_fft.js"></scr'+'ipt>')

  Settings.CSSTransform3DBoxAnimate = parseInt(System.Gadget.Settings.readString("CSSTransform3DBoxAnimate"))
  if (!Settings.CSSTransform3DBoxAnimate)
    Settings.CSSTransform3DBoxAnimate = parseInt(Settings_default.CSSTransform3DBoxAnimate)
  if (Settings.CSSTransform3DBoxAnimate)
    document.write('<script language="JavaScript" src="js/box3d.js"></scr'+'ipt>')

  if (!is_SA_child_animation && returnBoolean("UseWebcamHeadtracking"))
    document.write('<script language="JavaScript" src="js/headtracker_ar.js"></scr'+'ipt>')

  if (gallery.length && !gallery_cache_obj.SS_mode) {
    var galleries = (SEQ_gallery) ? SEQ_gallery : [{gallery:gallery}]

    for (var i = 0; i < galleries.length; i++)
      galleries[i].gallery.sort(function (a,b) { return a.frame - b.frame })
  }
})();

// "SA_GadgetLocalConfig()"
(function () {
  try {
    if (use_SA_browser_mode || !SystemEXT._default._settings)
      return

    if (!SA_HTA_folder) {
      var f = ValidatePath(loadFolder_CORE())
      SA_HTA_folder = (f) ? ((f.isFolder) ? Settings.f_path : Settings.f_path.replace(/[\/\\][^\/\\]+$/, "")) : "";
      SA_HTA_folder_parent = SA_HTA_folder.replace(/[\/\\][^\/\\]+$/, "")
    }

    var s = SystemEXT._default._settings
    var _func = function ($0, $1, $2) { return eval($1) }
    for (var n in s) {
      var v = s[n]
      System.Gadget.Settings.writeString(n, decodeURIComponent(v).replace(/\$([^\$]+)\$/g, _func))
    }
  }
  catch (err) {setTimeout('DEBUG_show("'+err.description+'",0,1)', 1000)}
})();

(function () {
  if (!use_SA_system_emulation || is_SA_child_animation)
    return

  var AutoItAlwaysOnTop = returnBoolean("AutoItAlwaysOnTop")
  var IgnoreMouseEvents = returnBoolean("IgnoreMouseEvents")
  if (webkit_mode) {
    try {
      if (WallpaperEngine_mode) {
        System.Gadget.Settings.writeString("AutoItStayOnDesktop", "non_default")
//        System.Gadget.Settings.writeString("CSSTransformFullscreen", "non_default")
      }

      var AutoItStayOnDesktop
      if (webkit_electron_mode) {
        AutoItStayOnDesktop = returnBoolean("AutoItStayOnDesktop")
        if (AutoItStayOnDesktop && !WallpaperEngine_mode) {
          WebKit_object.stay_on_desktop(true)
          if (returnBoolean("AutoItAutoPause")) {
            WebKit_object.monitor_winstate.init()
          }
        }

var ipcRenderer = require('electron').ipcRenderer

//ipcRenderer.removeAllListeners()

ipcRenderer.on('audio_BPM_detection_finished', function (event, message) {
  var data_all = JSON.parse(message)
  var win = (data_all.window_id == -1) ? self : document.getElementById("Ichild_animation" + data_all.window_id).contentWindow
  win.Audio_BPM.vo._audio_BPM_detection_finished(data_all.data)
});

ipcRenderer.on('DragDrop', function (event, path) {
  IPC.active_IPC.ipcRenderer_DragDrop(event, path)
});

ipcRenderer.on('capturePage', function (event, message) {
  IPC.active_IPC.ipcRenderer_capturePage(event, message)
});

ipcRenderer.on('tray_menu', function (event, message) {
  IPC.active_IPC.ipcRenderer_tray_menu(event, message)
});

ipcRenderer.on('window_hidden', function (event, message) {
  System._browser.hidden = message;
});
      }

webkit_electron_mode && webkit_window.setIgnoreMouseEvents(false);
window.addEventListener("SA_resized_once", function () {
// In Electron 2.x, window has to get the focus when .setIgnoreMouseEvents() is set to true (after resizing).
  self.focus()
  if (webkit_electron_mode) {
    webkit_window.setIgnoreMouseEvents(IgnoreMouseEvents && !WallpaperEngine_mode)
    if (windows_mode || linux_mode) {
      let no_focus = IgnoreMouseEvents || AutoItStayOnDesktop;
      webkit_window.setFocusable(!no_focus)
// have to set it here AFTER focus/setFocusable in newer version of Electron
      if (!WallpaperEngine_mode && webkit_window)
        webkit_window.setAlwaysOnTop(AutoItAlwaysOnTop)
    }
  }
// TEST mode for Electron
  if (WallpaperEngine_CEF_mode && webkit_electron_remote) {
    webkit_window.setIgnoreMouseEvents(false)
  }
});

//console.log(GetImageSize("images/bg_abstract_1024x1024.jpg"))
    }
    catch (err) { console.error(err) }
  }
  else {
    if (AutoItAlwaysOnTop)
      AutoIt_Execute(System.Gadget.path + '\\au3\\always_on_top', null, 100)
  }
//  if (AutoItAlwaysOnTop)
//    DEBUG_show("always on top", 2)
/*
      else if (returnBoolean("AutoItStayOnDesktop")) {
        if (webkit_mode) {
          webkit_saved_screenLeft = System.Gadget.Settings.readString("_screenLeft")
          webkit_saved_screenTop  = System.Gadget.Settings.readString("_screenTop")
          System._browser._drag_disabled = true
        }
        AutoIt_Execute(System.Gadget.path + '\\au3\\on_desktop', null, 1000)
      }
*/
})();
