// System Animator core basics
// (2023-01-17)

var use_SA_browser_mode

var oShell
var Shell_OBJ, FSO_OBJ

var is_SA_child_animation
var SA_child_animation_max = 10
var SA_child_animation = []
var SA_child_animation_id

var SA_topmost_window = top


//System.Gadget.Settings
var Setting_name_list = [
  "Folder", "EventToMonitor", "EventToMonitorVF", "MonitorSensitivity", "Monitor2Sensitivity", "UpdateInterval", "Display",
  "Opacity", "OpacityOnHover",
  "CCPU",
  "UseAudioFFTLiveInputGain",
  "UseCanvasNotebookDrawings_Style",
  "UseCanvasPPEQuality", "UseCanvasPPEContrast", "UseCanvasPPEBrightness",
  "Use3DBloomPostProcessBlurSize", "Use3DBloomPostProcessThreshold", "Use3DBloomPostProcessIntensity",
  "MMDLightColor", "MMDLightPosition", "MMDShadow", "MMDEdgeScale",
  "CSSTransformScale", "CSSTransformRotate", "CSSTransform3D", "CSSTransform3DBoxAnimate",
  "BDSpectrumToBeat", "BDScale", "BDDecay", "BDOpacity", "BDBassKick"
]
var Setting_name_list_boolean = [
  "ReverseAnimation", "UseFilters", "UseMarkers", "UseImgCache", "UseFullFrameRate", "Use30FPS", "Use60FPS", "IgnoreMouseEvents", "IgnoreMouseEventsPartial",
  "HTALoadSpectrumAnalyser", "WallpaperAsBG", "DisableWallpaperMask", "XULTransparentBG", "DisableTransparency", "MoveWithinPrimaryScreen", "ChildDragDisabled",
  "CSSTransformFullscreen", "CSSTransformFlipH", "CSSTransformFlipV", "CSSTransformToChildAnimation", "CSSTransform3DBillboard", "CSSTransform3DDisabledForContent", "UseWebcamHeadtracking",
  "UseHTML5Canvas", "UseWebGLForCanvas2D", "UseMatrixRain", "MatrixRainColor", "MatrixRainPlayOnIdle", "MatrixRainMusical", "UseJustSnow", "UseJustSnowSlow",
  "UseCanvasRipple", "UseCanvasFireworks",
  "UseCanvasNotebookDrawings", "UseCanvasWatercolor", "UseCanvasVanGogh",
  "UseSVGClock", "UseAudioFFT", "UseAudioFFTLiveInput",
  "AutoItRunAsAU3", "AutoItAlwaysOnTop", "AutoItStayOnDesktop", "AutoItWinampMode", "AutoItBPMByBASS", "AutoItAutoPause",
  "Use32BandSpectrum", "EnableBeatDetection", "EnableMotionEffectForAnimatedPicture", "EnableMotionEffectForSEQVideo",
  "Use3DPPE", "Use3DSAO", "Use3DDiffusion", "Use3DBloomPostProcess", "MMDLookAtCamera", "MMDLookAtMouse", "MMDTrackballCamera", "MMDRandomCamera", "MMDOverrideDefaultForExternalModel",
  "AllowExternalCommand",

  "SwapRegistryCheck", "UseSilverlight", "UseSL_windowless", "XULSilverlightAuto", "BPMByWebAudioAPI"
]
for (var i = 0; i < SA_child_animation_max; i++)
  Setting_name_list.push("ChildAnimation" + i)

var Settings_default = {
   _custom_: {}
  ,_excluded_: {}

  ,Folder: "demo1"

//  ,EventToMonitor: (ie9) ? "FIXED_VALUE_50" : "CPU"
  ,EventToMonitorVF: ""
  ,MonitorSensitivity: "1"
  ,Monitor2Sensitivity: "1"
  ,UpdateInterval: "10"
  ,Display: "1"

  ,Opacity: "1"
  ,OpacityOnHover: ""

  ,ReverseAnimation: false
  ,UseFilters: false
  ,UseMarkers: false
  ,UseImgCache: false
  ,UseFullFrameRate: false
  ,Use60FPS: false
  ,IgnoreMouseEvents: false
  ,IgnoreMouseEventsPartial: false
  ,ChildDragDisabled: false

  ,CCPU: "1"

  ,BDSpectrumToBeat: "0"
  ,Use32BandSpectrum: false
  ,EnableBeatDetection: true
  ,EnableMotionEffectForAnimatedPicture: false
  ,EnableMotionEffectForSEQVideo: true
  ,BDScale: "1"
  ,BDDecay: "1"
  ,BDOpacity: "1"
  ,BDBassKick: "1"

  ,HTAUseGPUAcceleration: false
  ,HTALoadSpectrumAnalyser: false
  ,WallpaperAsBG: false
  ,DisableWallpaperMask: false
  ,XULTransparentBG: false
  ,DisableTransparency: false
  ,DisableBackgroundThrottling: false
  ,MoveWithinPrimaryScreen: false

  ,CSSTransformScale: "1"
  ,CSSTransformRotate: "0"
  ,CSSTransformFullscreen: false
  ,CSSTransformFlipH: false
  ,CSSTransformFlipV: false
  ,CSSTransform3D: ""
  ,CSSTransform3DBoxAnimate: "0"
  ,CSSTransformToChildAnimation: false
  ,CSSTransform3DBillboard: false
  ,CSSTransform3DDisabledForContent: false
  ,UseWebcamHeadtracking: false

  ,UseHTML5Canvas: false
  ,UseWebGLForCanvas2D: true
  ,UseMatrixRain: false
  ,MatrixRainColor: true
  ,MatrixRainPlayOnIdle: false
  ,MatrixRainMusical: false
  ,UseJustSnow: false
  ,UseJustSnowSlow: false

  ,UseCanvasRipple: false
  ,UseCanvasFireworks: false

  ,UseCanvasNotebookDrawings: false
  ,UseCanvasNotebookDrawings_Style: "1"
  ,UseCanvasWatercolor: false
  ,UseCanvasVanGogh: false
  ,UseCanvasPPEQuality: "50"
  ,UseCanvasPPEContrast: "0"
  ,UseCanvasPPEBrightness: "0"

  ,UseSVGClock: false
  ,UseAudioFFT: false
  ,UseAudioFFTLiveInput: false
  ,UseAudioFFTLiveInputGain: "1"

  ,AutoItRunAsAU3: false
  ,AutoItAlwaysOnTop: false
  ,AutoItStayOnDesktop: false
  ,AutoItAutoPause: false
  ,AutoItWinampMode: false
  ,AutoItBPMByBASS: false

  ,AllowExternalCommand: false

  ,Use3DPPE: false
  ,Use3DSAO: false
  ,Use3DDiffusion: false
  ,Use3DBloomPostProcess: false
  ,Use3DBloomPostProcessBlurSize:  "0.5"
  ,Use3DBloomPostProcessThreshold: "0.5"
  ,Use3DBloomPostProcessIntensity: "0.5"
  ,MMDLookAtCamera: true
  ,MMDLookAtMouse: true
  ,MMDTrackballCamera: true
  ,MMDRandomCamera: true
  ,MMDOverrideDefaultForExternalModel: true
  ,MMDEdgeScale: "1.5"

// obsolete
  ,SwapRegistryCheck: false
  ,XULSilverlightAuto: true
  ,UseSilverlight: true
  ,UseSL_windowless: true
  ,BPMByWebAudioAPI: false
  ,Use30FPS: false
//  ,IncludeSubfolders: false
//  ,HandleOversize: "crop"
}
// END


function returnBoolean(name) {
  return ((!System.Gadget.Settings.readString(name)) ? Settings_default[name] : !Settings_default[name])
}

function toFileProtocol(url) {
  if (/^(blob|data)\:/i.test(url))
    return url

  var url_decoded = decodeURIComponent(url)
  if (/^(file|https?)\:/.test(url_decoded)) {
// always convert backslashes
// Encode () to avoid issues when used in CSS (eg. background-image).
    return url.replace(/\\/g, "/").replace(/\(/g, "%28").replace(/\)/g, "%29");
  }

//  if (WallpaperEngine_CEF_mode) {
    var dd = SA_topmost_window.DragDrop
    if (dd && dd._path_to_obj) {
      let obj_url = dd._obj_url[url]
      if (!obj_url) {
/*
When RegExp.$2 is excluded (i.e. no .zip in url_zip), files inside zip will effectively return in raw url (i.e. file variable will be null) instead of blob url (which should save some headaches?).
Other file types (including zip file by its own) will return in blob url.
*/
        let url_zip = (/^(.+)(\.zip)(\#[\/\\].+)$/i.test(url)) ? RegExp.$1/*+RegExp.$2*/ : url
        let file = dd._path_to_obj[url_zip]
//console.log(file,url_zip,url)
        if (file) {
          let obj_url_zip
          if (url_zip != url) {
            obj_url_zip = dd._obj_url[url_zip] = dd._obj_url[url_zip] || SA_topmost_window.URL.createObjectURL(file)
            obj_url = dd._obj_url[url] = obj_url_zip + RegExp.$2+RegExp.$3
          }
          else
            obj_url = obj_url_zip = dd._obj_url[url] = dd._obj_url[url] || SA_topmost_window.URL.createObjectURL(file)
        }
      }
      if (obj_url)
        return obj_url
    }
//  }

// http://stackoverflow.com/questions/14317861/difference-between-escape-encodeuri-encodeuricomponent
// Use encodeURI here.
// Move ":" to "|" conversion outside of encodeURI to avoid being encoded.
// Encode () to avoid issues when used in CSS (eg. background-image).
  return "file:///" + encodeURI(url_decoded.replace(/\\/g, "/")).replace(/^(\w)\:/, "$1|").replace(/\(/g, "%28").replace(/\)/g, "%29");
}

function toLocalPath(url) {
  return (/^(blob|data)\:/i.test(url)) ? url : decodeURIComponent(url.replace(/^file\:\/+/i, ((windows_mode||browser_native_mode)?"":"/")).replace(/^(\w)[\|\:]/i, "$1:").replace(/[\/\\]/g, ((windows_mode)?"\\":"/")).replace(/\?.+$/, ""));
}

function toRegExp(str, separator) {
  var str_list = (Array.isArray(str)) ? str : [str];
  str_list.forEach(function (s, idx) {
    var str_unicode = ""
    for (var i = 0, i_max = s.length; i < i_max; i++) {
      var c = s.charAt(i)
      if (/[^\x00-\x7F]/.test(c)) {
        str_unicode += "\\u" + c.codePointAt(0).toString(16).toUpperCase();
      }
      else if (/\W/.test(c)) {
        str_unicode += (/\s/.test(c)) ? "\\s" : "\\" + c;
      }
      else {
        str_unicode += c;
      }
    }
    str_list[idx] = str_unicode
  });

  return str_list.join(separator||"");
}

Array.prototype.shuffle = function () {
  var i = this.length, j, temp;
  if ( i == 0 ) return this;
  while ( --i ) {
    j = Math.floor( Math.random() * ( i + 1 ) );
    temp = this[i];
    this[i] = this[j];
    this[j] = temp;
  }

  return this;
};

if (!String.prototype.trim) {
  String.prototype.trim = function () {
    return this.replace(/^\s+|\s+$/g,'');
  };
}

if (!Date.now) {
  Date.now = function now() {
    return new Date().getTime();
  };
}

if (!Array.prototype.find) {
  Array.prototype.find = function(predicate) {
    'use strict';
    if (this == null) {
      throw new TypeError('Array.prototype.find called on null or undefined');
    }
    if (typeof predicate !== 'function') {
      throw new TypeError('predicate must be a function');
    }
    var list = Object(this);
    var length = list.length >>> 0;
    var thisArg = arguments[1];
    var value;

    for (var i = 0; i < length; i++) {
      value = list[i];
      if (predicate.call(thisArg, value, i, list)) {
        return value;
      }
    }
    return undefined;
  };
}

Object.clone = function (obj) {
  if (!obj)
    return null

  var _passthru = [];
  var obj_clone = JSON.parse(JSON.stringify(obj, function (key, value) {
if (value instanceof Function || typeof value == 'function' || value instanceof RegExp) {
  var value_passthru = "{{" + _passthru.length + "}}"
  _passthru.push(value)
  return value_passthru
}
return value
  }), function (key, value) {
if (typeof value == 'string' && /^\{\{(\d+)\}\}$/.test(value))
  return _passthru[parseInt(RegExp.$1)]
return value
  });
  _passthru = undefined;

  return obj_clone;
};

Object.append = (function () {
  function append(target, source) {
    if ((target == null) || (source == null))
      return 

    for (var key in source) {
      var value = source[key]
      if (!target.hasOwnProperty(key) || value instanceof Function || typeof value == 'function' || value instanceof RegExp || value instanceof Array || typeof value != 'object') {
        target[key] = value
      }
      else {
        append(target[key], value)
      }
    }
  }

  return function (target) {
    if (!target)
      return null

      for (var index = 1; index < arguments.length; index++) {
        var source = arguments[index];
        append(target, source)
      }
      return target;
  };
})();

if (typeof Object.assign != 'function') {
  (function () {
    Object.assign = function (target) {
      'use strict';
      // We must check against these specific cases.
      if (target === undefined || target === null) {
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var output = Object(target);
      for (var index = 1; index < arguments.length; index++) {
        var source = arguments[index];
        if (source !== undefined && source !== null) {
          for (var nextKey in source) {
            if (source.hasOwnProperty(nextKey)) {
              output[nextKey] = source[nextKey];
            }
          }
        }
      }
      return output;
    };
  })();
}

var HTA_use_GPU_acceleration
function getHTAUseGPUAcceleration() {
  //http://msdn.microsoft.com/en-us/library/ee330731(VS.85).aspx#gpu_rendering
  var reg_root = ['HKLM', 'HKCU']
  for (var i = 0; i < 2; i++) {
    var root = reg_root[i]
    try {
      HTA_use_GPU_acceleration = oShell.RegRead(root + '\\SOFTWARE\\Microsoft\\Internet Explorer\\Main\\FeatureControl\\FEATURE_GPU_RENDERING\\mshta.exe')
    }
    catch (err) {}

    if (HTA_use_GPU_acceleration <= 1)
      break
    HTA_use_GPU_acceleration = false
  }

  HTA_use_GPU_acceleration = !!HTA_use_GPU_acceleration
  return HTA_use_GPU_acceleration
}


// For debug START
var DEBUG_count = 0
var DEBUG_timerID
var DEBUG_always_visible
var DEBUG_hide_sec = 0
var DEBUG_last_display_time = 0

function DEBUG_show(msg, hide_sec, always_visible) {
  if (always_visible)
    DEBUG_always_visible = true
//DEBUG_always_visible = true
  if (hide_sec < 0)
    hide_sec = 0
  else if ((DEBUG_timerID || DEBUG_always_visible) && (msg != null))
    msg = Ldebug.innerText + " | " + msg// + '(' + DEBUG_hide_sec + ')'

  var time = Date.now()
  if (Ldebug.style.visibility != "inherit") {
    DEBUG_hide_sec = 0
    DEBUG_last_display_time = time
  }

  if (DEBUG_timerID) {
    clearTimeout(DEBUG_timerID)
    DEBUG_timerID = null

    if (hide_sec && (msg != null) && !DEBUG_always_visible) {
      DEBUG_hide_sec += hide_sec
      if (DEBUG_hide_sec > hide_sec + 1)
        DEBUG_hide_sec -= 1
      var time_diff = parseInt(DEBUG_hide_sec - (time - DEBUG_last_display_time)/1000)
      if (time_diff < hide_sec)
        time_diff = hide_sec
      hide_sec = time_diff
    }
  }

  if (msg != null) {
    Ldebug.innerText = msg
//console.log(msg)
    Ldebug.style.visibility = "inherit"

    if (hide_sec && !DEBUG_always_visible) {
      DEBUG_timerID = setTimeout('DEBUG_timerID=null; DEBUG_show()', hide_sec*1000)
    }
  }
  else {
    DEBUG_always_visible = false
    Ldebug.style.visibility = "hidden"
  }
}
// For debug END


// basics
var Vista_or_above = /Windows NT ([6-9]|1\d)/i.test(navigator.userAgent)
var W7_or_above = /Windows NT (6\.[1-9]|[7-9]|1\d)/i.test(navigator.userAgent)
var W8_or_above = /Windows NT (6\.[2-9]|[7-9]|1\d)/i.test(navigator.userAgent)

var windows_mode = Vista_or_above
var linux_mode   = /Linux/i.test(navigator.userAgent)
var non_windows_native_mode

//https://coderwall.com/p/i817wa/one-line-function-to-detect-mobile-devices-with-javascript
var is_mobile = (typeof window.orientation !== "undefined") || (navigator.userAgent.indexOf('IEMobile') !== -1);

var WallpaperEngine_mode
var WallpaperEngine_CEF_mode// = true
var WallpaperEngine_CEF_native_mode
var Settings_WE = {}

//var _js_min_mode_ = true
var localhost_mode = /localhost|192\.168\./.test(self.location.hostname)
var browser_native_mode = /^https?\:/i.test(location.href)// = true//
if (browser_native_mode) {
  WallpaperEngine_CEF_mode = true
  windows_mode = false
}

// Silverlight 5 64-bit is supported only on Windows 7 and above
var ie_64bit = (/MSIE.+Win64.+x64/i.test(navigator.userAgent) && !W7_or_above)
//ie_64bit=true

var ie9, ie9_native
var ie9_mode, ie8_mode

var xul_mode
var xul_version = 0
var xul_path

var webkit_mode
var webkit_version, webkit_version_number
var webkit_version_milestone = {}
var webkit_path, webkit_dir, webkit_transparent_mode
var webkit_nwjs_mode, webkit_electron_mode
var webkit_electron_remote
var webkit_window, webkit_electron_screen, webkit_electron_dialog
var webkit_IgnoreMouseEvents_disabled;

var is_chrome = /chrome/i.test( navigator.userAgent );

(function () {
  webkit_mode = /WebKit/i.test(navigator.userAgent)
  if (browser_native_mode && !webkit_mode) {
    non_windows_native_mode = true
    webkit_nwjs_mode = true
    ie9 = ie9_mode = ie8_mode = true

    document.write(
  '<script type="text/javascript" language="javascript" src="js/SA_webkit.js"></scr'+'ipt>\n'
 ,'<script src="js/jsmediatags.js"></scr'+'ipt>\n'
    )

Settings_default._custom_.EventToMonitor = "SOUND_ALL"
Settings_default._custom_.WallpaperAsBG = "non_default"
Settings_default._custom_.UseAudioFFT = "non_default"
Settings_default._custom_.Use30FPS = "non_default"
Settings_default._custom_.Use32BandSpectrum = "non_default"
//Object.defineProperty(Settings_default._custom_, "UseAudioFFTLiveInput", { get: function () { return this.UseAudioFFT } });
Settings_default._custom_.UpdateInterval = "1"
Settings_default._custom_.Display = "-1"
//Settings_default._custom_.UseAudioFFTLiveInput = "non_default"

    console.log("browser-native mode:ON")

    return
  }

  ie9 = ie9_native = /Trident.[5-9]/i.test(navigator.userAgent)
  if (ie9_native) {
    ie9_mode = (document.documentMode >= 9)
    ie8_mode = (document.documentMode >= 8)
    return
  }

  xul_mode = /rv\:(\d+)\.\d.+Gecko/i.test(navigator.userAgent)
  if (xul_mode) {
    xul_version = parseInt(RegExp.$1)
    ie9 = ie9_mode = ie8_mode = true
    document.write(
  '<script type="text/javascript" language="javascript" src="js/SA_xul.js"></scr'+'ipt>\n'
+ '<script type="text/javascript" language="javascript" src="js/file_io.js"></scr'+'ipt>\n'
    )
    return
  }

  if (!document.documentElement.requestFullscreen) {
    document.documentElement.requestFullscreen = function () {
if (this.webkitRequestFullscreen) {
  this.webkitRequestFullscreen()
}
else {
  console.log('(Fullscreen API not supported)')
}
    };
  }

  if (!webkit_mode)
    return

  non_windows_native_mode = WallpaperEngine_CEF_mode || linux_mode || browser_native_mode

  if (WallpaperEngine_CEF_mode) {
    webkit_nwjs_mode = true

    WallpaperEngine_mode = !browser_native_mode
// TEST mode for Electron
if (("process" in window) && process.versions['electron']) {
  webkit_electron_remote = SA_topmost_window.require('electron').remote || SA_topmost_window.require('node_modules.asar/@electron/remote');
  webkit_window = webkit_electron_remote.getCurrentWindow()
  webkit_electron_screen = SA_topmost_window.require('electron').screen
}
else {
  WallpaperEngine_CEF_native_mode = !browser_native_mode
}

    ie9 = ie9_mode = ie8_mode = true
    document.write(
  '<script type="text/javascript" language="javascript" src="js/SA_webkit.js"></scr'+'ipt>\n'
    )

Settings_default._custom_.EventToMonitor = "SOUND_ALL"
Settings_default._custom_.WallpaperAsBG = "non_default"
Settings_default._custom_.UseAudioFFT = "non_default"
Settings_default._custom_.Use30FPS = "non_default"
Settings_default._custom_.Use32BandSpectrum = "non_default"
//Object.defineProperty(Settings_default._custom_, "UseAudioFFTLiveInput", { get: function () { return this.UseAudioFFT } });
Settings_default._custom_.UpdateInterval = "1"
Settings_default._custom_.Display = "-1"
if (!browser_native_mode) {
  Settings_default._custom_.UseAudioFFTLiveInput = "non_default"
}

    if (browser_native_mode) {
      document.write(
  '<script src="js/jsmediatags.js"></scr'+'ipt>\n'
      )
      console.log("browser-native mode:ON")
      return
    }

    if (parent.Aurora) {
      self.Aurora = parent.Aurora
//      self.jsmediatags = parent.jsmediatags
    }
    else {
      document.write(
  '<script src="js/aurora.js"></scr'+'ipt>\n'
+ '<script src="js/mp3.js"></scr'+'ipt>\n'
+ '<script src="js/aac.js"></scr'+'ipt>\n'
+ '<script src="js/aurora_web_audio.js"></scr'+'ipt>\n'
+ '<script src="js/jsmediatags.js"></scr'+'ipt>\n'
//+ '<script src="js/id3.js"></scr'+'ipt>\n'
      )
    }

/*
    window.TextEncoder = window.TextDecoder = null
    document.write(
  '<script src="js/encoding-indexes.js"></scr'+'ipt>\n'
+ '<script src="js/encoding.js"></scr'+'ipt>\n'
    )
*/
    return
  }
//WallpaperEngine_CEF_mode=WallpaperEngine_mode=true

  if ("process" in window) {
    webkit_version = process.versions['node-webkit']
    if (webkit_version)
      webkit_nwjs_mode = true
    else {
      webkit_electron_mode = true
      webkit_version = process.versions['electron']
      webkit_electron_remote = SA_topmost_window.require('electron').remote || SA_topmost_window.require('node_modules.asar/@electron/remote');
      webkit_electron_screen = SA_topmost_window.require('electron').screen
      webkit_electron_dialog = {
  showOpenDialog: function (browserWindow, options, callback) {
if (webkit_version_milestone["6.0.0"]) {
  webkit_electron_remote.dialog.showOpenDialog(browserWindow, options).then(function (result) {
var v = (result.canceled) ? null : result.filePaths
callback(v)
  }).catch(function (err) { console.error(err) });
}
else
  webkit_electron_remote.dialog.showOpenDialog(browserWindow, options, callback)
  }
 ,showMessageBox: function (browserWindow, options) {
if (webkit_version_milestone["6.0.0"])
  return webkit_electron_remote.dialog.showMessageBoxSync(browserWindow, options)
return webkit_electron_remote.dialog.showMessageBox(browserWindow, options)
  }
      };
    }
    webkit_path = process.execPath
    webkit_window = (webkit_nwjs_mode) ? require('nw.gui').Window.get() : webkit_electron_remote.getCurrentWindow()
  }
  else {
    self.process = parent.process || self.dialogArguments.process
    webkit_version = parent.webkit_version || self.dialogArguments.webkit_version
    webkit_path = parent.webkit_path || self.dialogArguments.webkit_path
    webkit_window = parent.webkit_window || self.dialogArguments.webkit_window
    webkit_nwjs_mode = parent.webkit_nwjs_mode || (self.dialogArguments && self.dialogArguments.webkit_nwjs_mode)
    webkit_electron_mode = !webkit_nwjs_mode
    if (webkit_electron_mode) {
      webkit_electron_remote = SA_topmost_window.webkit_electron_remote
      webkit_electron_screen = SA_topmost_window.webkit_electron_screen
      webkit_electron_dialog = SA_topmost_window.webkit_electron_dialog
    }
  }
  webkit_dir = webkit_path.replace(/[\/\\][^\/\\]+$/, "")
  ie9 = ie9_mode = ie8_mode = true
  document.write(
  '<script type="text/javascript" language="javascript" src="js/SA_webkit.js"></scr'+'ipt>\n'
  )

  webkit_version_number = webkit_version.split(".")
  webkit_version_number.forEach(function (v, i) { webkit_version_number[i] = parseInt(v) })

  var v1 = webkit_version_number[0] * 100*100 + webkit_version_number[1] * 100 + webkit_version_number[2]
  webkit_version_milestone["1.2.2"]  = (v1 >= 10202)//('setIgnoreMouseEvents' in webkit_window)
  webkit_version_milestone["1.2.4"]  = (v1 >= 10204)//('getChildWindows' in webkit_window)
  webkit_version_milestone["1.4.11"] = (v1 >= 10411)//reload page instead of relaunch to restart the app (https://github.com/electron/electron/pull/8110)
  webkit_version_milestone["6.0.0"]  = (v1 >= 60000)//sync/promise-based version of dialog.showMessageBox, dialog.showOpenDialog, dialog.showSaveDialog

// electron v6
  webkit_electron_screen = webkit_electron_screen || webkit_electron_remote.screen

  webkit_transparent_mode = webkit_nwjs_mode || webkit_electron_remote.getGlobal("is_transparent")
})();

var w3c_mode = xul_mode || webkit_mode || browser_native_mode
var use_inline_dialog = w3c_mode


// misc
Settings_default.EventToMonitor = (ie9) ? "FIXED_VALUE_50" : "CPU"
