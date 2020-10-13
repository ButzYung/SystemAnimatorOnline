// System object emultaion (2020-09-05)

var use_SA_system_emulation = true
var use_SA_browser_mode

var PC_count_absolute = 0

var xul_mode, webkit_mode

var HTA_use_GPU_acceleration

var oShell
var Shell_OBJ, FSO_OBJ

var is_SA_child_animation = (parent && (parent != self) && !parent.is_chrome_window)
var SA_top_window = (xul_mode && !is_SA_child_animation) ? parent : self
var absolute_screen_mode

// for all gadgets
var SA_child_animation_id = 99
var ie9_native = /Trident.[5-9]/i.test(navigator.userAgent)

var System = {
  _init: function () {
try {
  if (!Shell_OBJ)
    Shell_OBJ = new ActiveXObject("Shell.Application");
  if (!FSO_OBJ)
    FSO_OBJ = new ActiveXObject("Scripting.FileSystemObject");
  if (!oShell)
    oShell = new ActiveXObject("WScript.Shell");
}
catch (err) { alert(err.message) }

this._child_html_filename = (xul_mode) ? "SystemAnimator_xul.html" : ((webkit_mode) ? ((WallpaperEngine_CEF_mode && !browser_native_mode) ? "SystemAnimator_cef.html" : "SystemAnimator_webkit.html") : "SystemAnimator_ie.html")

this.Gadget._init()
this.Machine._init()

if (!is_SA_child_animation) {
  SA_top_window.getScreenBounds = (function () {
var last_updated = -1
var bounds
return function (x,y, force_update) {
  if (force_update || (last_updated != RAF_timestamp)) {
    last_updated = RAF_timestamp
    bounds = (webkit_electron_mode) ? webkit_electron_screen.getDisplayNearestPoint({x:~~x, y:~~y}).bounds : { x:0, y:0, width:parent.screen.width, height:parent.screen.height }
  }
  return bounds
};
  })();
}
else {
  SA_top_window.getScreenBounds = function (x,y, force_update) { return top.getScreenBounds(x,y, force_update) }
}

if (webkit_electron_mode) {
  if (!is_SA_child_animation) {
    SA_top_window.getPos = (function () {
var last_updated = -1
var pos
return function (force_update) {
  if (force_update || (last_updated != RAF_timestamp)) {
    last_updated = RAF_timestamp
    pos = webkit_window.getPosition()
  }
  return pos
};
    })();

    SA_top_window.getCursorPos = (function () {
var last_updated = -1
var pos
return function (force_update) {
  if (force_update || (last_updated != RAF_timestamp)) {
    last_updated = RAF_timestamp
    pos = webkit_electron_screen.getCursorScreenPoint()
  }
  return pos
};
    })();
  }
  else {
    SA_top_window.getPos = function (force_update) { return top.getPos(force_update) }
    SA_top_window.getCursorPos = function (force_update) { return top.getCursorPos(force_update) }
  }
}

SA_top_window.resizeToAbsolute = function (w, h) {
//console.log("resizeToAbsolute("+w+","+h+"):"+Date.now())
  this.resizeTo(w, h)
  if (absolute_screen_mode && !System._browser._window_move_timerID) {
    System._browser._window_move_timerID = setInterval(
(function () {
  var x = SA_top_window.screenLeftAbsolute
  var y = SA_top_window.screenTopAbsolute
  var loop = 0
  return function () {
var xy = SA_top_window.getPos(true)
//console.log(xy,[x,y])
if ((x != xy[0]) || (y != xy[1])) {
  DEBUG_show("(window position adjusted)", 3)
  webkit_window.setPosition(x,y)
  System._browser.moveWallpaper(x,y)
  loop = 999
}
if (++loop > 10) {
  clearInterval(System._browser._window_move_timerID)
  System._browser._window_move_timerID = null
}
  };
})(),
    100);
  }
}

SA_top_window.moveToAbsolute = function (x, y, restricted) {
//console.log("moveToAbsolute("+x+","+y+"):"+Date.now())
// make sure that x and y are integers to ensure that they work with setPosition
  if (absolute_screen_mode && !restricted) {
    webkit_window.setPosition(~~x, ~~y)
  }
  else {
    this.moveTo(x,y)
  }
}

SA_top_window.moveByAbsolute = function (x, y) {
//console.log("moveByAbsolute("+x+","+y+"):"+Date.now())
  if (absolute_screen_mode) {
    var pos = SA_top_window.getPos(true)
    webkit_window.setPosition(~~(pos[0]+x), ~~(pos[1]+y))
  }
  else {
    this.moveBy(x,y)
  }
}

Object.defineProperty(SA_top_window, "screenLeftAbsolute", {
  get: function () {
return ((absolute_screen_mode) ? SA_top_window.getPos()[0] : this.screenLeft)
  }
});

Object.defineProperty(SA_top_window, "screenTopAbsolute", {
  get: function () {
return ((absolute_screen_mode) ? SA_top_window.getPos()[1] : this.screenTop)
  }
});
/*
window.addEventListener("load", function () {
var _xy_
var _t = performance.now()
for (var i=0; i <1000; i++) {
  _xy_ = SA_top_window.getPos(true)//SA_top_window.screenLeftAbsolute+SA_top_window.screenTopAbsolute//SA_top_window.getPos()//
}
console.log(performance.now()-_t)
});
*/
  }

 ,Gadget: {
    _init: function () {
this.Settings.read  = this.Settings.readString;
this.Settings.write = this.Settings.writeString;

Object.defineProperty(this, "onSettingsClosing",
{
  get: function () {
return this._onSettingsClosing
  }

 ,set: function(func) {
this._onSettingsClosing = func
this.settings_window.onbeforeunload = function () {
  func({closeAction:!!this.returnValue, Action:{commit:true}})

  System.Gadget.settings_window.System = null
  System.Gadget.settings_window.onbeforeunload = null
  System.Gadget.settings_window = null
}
  }
});

var doc = new ActiveXObject("Microsoft.XMLDOM"); //("msxml2.DOMDocument.6.0");
doc.async = false;
doc.resolveExternals = false;
doc.validateOnParse = false;
doc.load("gadget.xml");

this.version = doc.selectSingleNode("//version").text;
    }

   ,path: (xul_mode) ? XPCOM_object._SA_root : ((use_SA_browser_mode) ? toLocalPath(self.location.href).replace(/[\/\\][^\/\\]+$/, "") : "")
   ,_path_folder: function () { return this.path.replace(/[\/\\][^\/\\]+$/, "") }

   ,document: document
   ,version: "1.0.0.0"
   ,docked: is_SA_child_animation
   ,visible: true

   ,Settings: {
      _settings_need_update: false

     ,_settings: {
/*
 Folder:"C:%5CUsers%5CUser%5CPictures%5C_%5CVocaloids%20-%20Luka%20-%20Love%20Story%20-%20EQP"
,EventToMonitor:"SOUND_ALL"
,UpdateInterval:"1"
,Display:"-1"
*/
      }

     ,_changed: {}

     ,_readString_func_readVariable: function ($0, $1, $2) { return eval($1) }
     ,readString: function (name, raw_read) {
var v = this._settings[name]
v = (v) ? ((raw_read) ? decodeURIComponent(v) : decodeURIComponent(v).replace(/\$([^\$]+)\$/g, this._readString_func_readVariable)) : (Settings_default._custom_[name] || "")

return v
      }

     ,writeString: function (name, value) {
var v_old = this._settings[name] || ""
var v_new = encodeURIComponent(value)
this._settings[name] = v_new

if (WallpaperEngine_CEF_mode) {
  var Settings_by_path = JSON.parse(localStorage.Settings_by_path)
  if (!SA_HTA_folder || !Settings_by_path[SA_HTA_folder]) {
console.error(SA_HTA_folder)
//    DEBUG_show("(ERROR: Animation path not found in localStorage)", 10)
  }
  else {
    if (Settings_by_path[SA_HTA_folder][name] != v_new) {
      Settings_by_path[SA_HTA_folder][name] = v_new
      localStorage.Settings_by_path = JSON.stringify(Settings_by_path)
    }
  }
}

if (v_old != v_new)
  this._changed[name] = this._settings_need_update = true
      }

     ,_writeSettings: function (always_write, save_settings_only) {
if (!always_write && !this._settings_need_update)
  return
this._settings_need_update = false

SystemEXT._save_settings_only = save_settings_only
try {
  this._writeSettings_CORE()
}
catch (err) {}
SystemEXT._save_settings_only = false
      }

     ,_writeSettings_CORE: function () {
var saved_settings = []

var settings = this._settings
settings._screenLeft = settings._screenTop = ""
for (var s in settings) {
  var v = System.Gadget.Settings.readString(s)
  if (!v)
    continue

  if (s == "_screenLeft") {
    v = SA_top_window.screenLeftAbsolute
  }
  else if (s == "_screenTop") {
    v = SA_top_window.screenTopAbsolute
  }

  saved_settings.push('"' + s + '":"' + encodeURIComponent(v) + '"')
}

SystemEXT.SaveLocalSettings(saved_settings)
      }
    }
  }

 ,Environment: {
    win32_env: null

   ,getEnvironmentVariable: function (name) {
return oShell.ExpandEnvironmentStrings("%" + name + "%");
    }
  }

 ,Machine: {
    _init: function () {
// Memory
this._init_memory = function () {
if (webkit_mode)
  return

if (this._WMI_obj_memory)
  return

try {
  this._WMI_obj_memory = new WMI_Refresher("Win32_PerfFormattedData_PerfOS_Memory", "EV")
  this._WMI_obj_memory.init()
}
catch (err) {}
}

Object.defineProperty(this, "availableMemory",
{
  get: function() {
if (webkit_mode)
  return SA_require('os').freemem() / (1024*1024)

this._init_memory()

var c = this._WMI_obj_memory.update()
return (c.length) ? parseInt(c[c.length-1].AvailableMBytes) : 0
  }
});

Object.defineProperty(this, "totalMemory",
{
  get: function() {
if (webkit_mode)
  return SA_require('os').totalmem() / (1024*1024)

if (!this._totalMemory) {
  try {
    var obj = new WMI_Refresher("Win32_OperatingSystem")
    obj.init()

    this._totalMemory = parseInt(obj.update()[0].TotalVisibleMemorySize) / 1024
  }
  catch (err) {}
}

return this._totalMemory
  }
});

this.totalMemory = 0

// CPUs
var CPUs = {
  _WMI_obj: null
 ,_cpu_obj: null
 ,_get_cpu_obj: null

 ,_init: function () {
if (webkit_mode) {
  if (this._get_cpu_obj)
    return

  this._cpu_obj = [{ count:-1, cpus:SA_require('os').cpus() }]
  this._get_cpu_obj = function () {
var cpus = this._cpu_obj
if (cpus[0].count != PC_count_absolute) {
  if (cpus.unshift({ count:PC_count_absolute, cpus:SA_require('os').cpus() }) == 3)
    cpus.pop()
}
return cpus
  }

  return
}

if (this._WMI_obj)
  return

try {
  this._WMI_obj = new WMI_Refresher("Win32_PerfFormattedData_PerfOS_Processor", "EV")
  this._WMI_obj.init()
}
catch (err) {}
  }

 ,item: function (index) {
if (webkit_mode) {
  var cpus = this._get_cpu_obj()

  var core_time = []
  for (var i = 0; i < 2; i++) {
    var times = cpus[i].cpus[index].times
    var total = 0
    for (var type in times)
      total += times[type]

    core_time[i] = { total:total, idle:times.idle }
  }

  var idle  = core_time[0].idle  - core_time[1].idle
  var total = core_time[0].total - core_time[1].total

  return { usagePercentage: (total) ? (1 - idle/total) * 100 : 0 }
}

//return { usagePercentage:100-parseFloat(this._WMI_obj.update()[index].PercentIdleTime) }
return { usagePercentage:parseFloat(this._WMI_obj.update()[index].PercentProcessorTime) }
  }
}

Object.defineProperty(CPUs, "count",
{
  get: function() {
if (webkit_mode) {
//DEBUG_show('core:'+this._get_cpu_obj()[0].cpus.length,0,1)
  return this._get_cpu_obj()[0].cpus.length
}

return this._WMI_obj.update().length-1
  }
});

this._CPUs = CPUs
Object.defineProperty(this, "CPUs",
{
  get: function() {
this._CPUs._init()

return this._CPUs
  }
});

// Others
var PowerStatus = {
  _WMI_obj:null

 ,_init: function () {
if (this._battery)
  return

this._battery = {
  level: 1
 ,charging: false
}

if ('getBattery' in navigator) {
  var that = this
  navigator.getBattery().then(function (b) {
DEBUG_show("Use Battery Status API", 2)
that._battery = b
  });
}

/*
if (this._WMI_obj)
  return

try {
  this._WMI_obj = new WMI_Refresher("Win32_PortableBattery")
  this._WMI_obj.init()
}
catch (err) {}
*/
  }

// ,batteryPercentRemaining: 100
// ,isPowerLineConnected: true
// ,isBatteryCharging: false
}

Object.defineProperty(PowerStatus, "batteryPercentRemaining",
{
  get: function() {
return this._battery.level * 100
//var b = this._WMI_obj.update()[0]
//return (b) ? b.EstimatedChargeRemaining : 100
  }
});

Object.defineProperty(PowerStatus, "isPowerLineConnected",
{
  get: function() {
return (this._battery.level == 1) || this._battery.charging
  }
});

Object.defineProperty(PowerStatus, "isBatteryCharging",
{
  get: function() {
return this._battery.charging
  }
});

this._PowerStatus = PowerStatus
Object.defineProperty(this, "PowerStatus",
{
  get: function() {
this._PowerStatus._init()

return this._PowerStatus
  }
});

    }
  }

 ,Shell: {
    itemFromFileDrop: function (dataTransfer, index) {
//var url = dataTransfer.getData("Text")
return { path:"" };
    }

   ,itemFromPath: function (path) {
path = toLocalPath(path)
var f = path.replace(/[\/\\][^\/\\]+$/, "")
var p = path.replace(/^.+[\/\\]/, "")
var obj = Shell_OBJ.NameSpace(f)
if (obj)
  obj = obj.ParseName(p)

return (obj) ? new this._FolderItem(obj) : null
    }

   ,execute: function (path, para) {
Shell_OBJ.ShellExecute(path, para)
    }

   ,chooseFolder: function (title, iOptions) {
var f = Shell_OBJ.BrowseForFolder(0, title, iOptions)
return (f) ? new this._FolderItem(f.Self) : null
    }

   ,_FolderItem: function (obj) {
if (!this._constructor_initialized) {
  this.constructor.prototype._constructor_initialized = true

  this.constructor.prototype.metadata = function (name) {
var meta_dim = this.obj.ExtendedProperty("Dimensions");
if (!meta_dim) {
  var f = this.obj.Path.replace(/[\/\\][^\/\\]+$/, "");
  var dir = Shell_OBJ.NameSpace(f);
  meta_dim = dir.GetDetailsOf(this.obj, 26);
}

return meta_dim
  }

  Object.defineProperty(this.constructor.prototype, "isFolder",
{
  get: function() {
return this.obj.IsFolder
  }
});

  Object.defineProperty(this.constructor.prototype, "isFileSystem",
{
  get: function() {
return ((ie9_native) ? !this.obj.IsFolder : true) && this.obj.IsFileSystem
  }
});

  Object.defineProperty(this.constructor.prototype, "isLink",
{
  get: function() {
return this.obj.IsLink
  }
});

  Object.defineProperty(this.constructor.prototype, "link",
{
  get: function() {
return new System.Shell._FolderItem(this.obj.GetLink)
  }
});

  Object.defineProperty(this.constructor.prototype, "path",
{
  get: function() {
return this.obj.Path
  }
});

  Object.defineProperty(this.constructor.prototype, "type",
{
  get: function() {
return this.obj.Type
  }
});

  Object.defineProperty(this.constructor.prototype, "SHFolder",
{
  get: function() {
return new System.Shell._Folder(this.obj.GetFolder)
  }
});
}

// main
this.obj = obj
    }

   ,_Folder: function (obj) {
if (!this._constructor_initialized) {
  this.constructor.prototype._constructor_initialized = true

  Object.defineProperty(this.constructor.prototype, "Items",
{
  get: function() {
return new System.Shell._FolderItems(this.obj.Items())
  }
});
}

// main
this.obj = obj
    }

   ,_FolderItems: function (obj) {
if (!this._constructor_initialized) {
  this.constructor.prototype._constructor_initialized = true

  this.constructor.prototype.item = function (index) {
return new System.Shell._FolderItem(this.obj.Item(index))
  }

  Object.defineProperty(this.constructor.prototype, "count",
{
  get: function() {
return this.obj.Count
  }
});
}

// main
this.obj = obj
    }
  }

 ,Debug: {
    outputString: function (str) {
//alert(str)
    }
  }


// browser mode
 ,_browser: {
    init: function () {
document.ondragstart = document.onselectstart = function (e) { return false }
document.onmousedown = function (e) { System._browser.onmousedown(e) }
document.onmouseup   = function (e) { System._browser.onmouseup(e) }
document.onmousemove = function (e) { System._browser.onmousemove(e) }
document.onkeydown   = function (e) { System._browser.onkeydown(e) }

/*
document.addEventListener("click", function (e) {
  e.preventDefault()
  e.stopPropagation()
  e.stopImmediatePropagation()
}, true)
*/
/*
document.addEventListener("mousedown", function (e) {
  System._browser.onmousedown(e)
}, false)
*/

// make mouseover and mouseout events work with browser_native_mode(child animation) / older version of XULRunner
if (!WallpaperEngine_CEF_mode || !is_SA_child_animation || browser_native_mode) {
  document.addEventListener("mouseover", function (e) {
    System._browser.onmouseover(e)
  }, false)

  document.addEventListener("mouseout", function (e) {
    System._browser.onmouseout_waiting(e)
  }, false)
}

Object.defineProperty(document, "onmouseover",
{
  set: function(v) {
System._browser.onmouseover_custom = v
  }
});

Object.defineProperty(document, "onmouseout",
{
  set: function(v) {
System._browser.onmouseout_waiting_custom = v
  }
});


var s = (w3c_mode) ? CSSStyleDeclaration.prototype : document.body.style.constructor.prototype
this.document_body_style_pixelWidth  = Object.getOwnPropertyDescriptor(s, "pixelWidth");
this.document_body_style_pixelHeight = Object.getOwnPropertyDescriptor(s, "pixelHeight");

var _set = function () {
  if (System._browser.resize_timerID)
    clearTimeout(System._browser.resize_timerID)
  if (System._browser._window_move_timerID) {
    let xy = SA_top_window.getPos()
    System._browser.resize_timerID = setInterval((function () {
      var loop = 0
      return function () {
        let _xy = SA_top_window.getPos(true)
//console.log(xy,_xy)
        if ((++loop > 10) || (xy[0] != _xy[0]) || (xy[1] != _xy[1])) {
          clearInterval(System._browser.resize_timerID)
          System._browser.resize_timerID = setTimeout("System._browser.resize()", 0)
        }
      };
    })(), 10);
  }
  else
    System._browser.resize_timerID = setTimeout("System._browser.resize()", 0)
}

// need getter to make it work on WebKit
Object.defineProperty(s, "_set",
{
  get: function () {
return _set;
  }
});

if (ie9_native) {
  Object.defineProperty(document.body.style, "pixelWidth",
{
  get: function () {
return System._browser.document_body_style_pixelWidth.get.call(this);
  }

 ,set: function(v) {
this._set()
System._browser.document_body_style_pixelWidth.set.call(this, v);
  }
});

  Object.defineProperty(document.body.style, "pixelHeight",
{
  get: function () {
return System._browser.document_body_style_pixelHeight.get.call(this);
  }

 ,set: function(v) {
this._set()
System._browser.document_body_style_pixelHeight.set.call(this, v);
  }
});
}

var child_animation_as_texture = (is_SA_child_animation && parent.MMD_SA_options && parent.MMD_SA_options.child_animation_as_texture)
if (child_animation_as_texture) {
  this.onkeydown({ keyCode:97+SA_child_animation_id })
}

var d = System.Gadget.Settings.readString("SA_docked")
if (d)
  System.Gadget.docked = !!parseInt(d)
else {
  if (child_animation_as_texture)
    System.Gadget.docked = false
}

var d = document.createElement("div")
d.id = "Ldrag_dummy"
var ds = d.style
ds.position = "absolute"
ds.posLeft = ds.posTop = 0
ds.zIndex = 999
ds.border = "1px solid rgba(128,128,128,0.5)"
ds.visibility = "hidden"
//ds.display = "none"
document.body.appendChild(d)

this.body = document.getElementById("Lbody_host") || document.body

if (w3c_mode)
  this.body.style.transition = "opacity 0.5s"

this.Opacity = 1

// if "WallpaperAsBG" is true (non-default)
var WallpaperAsBG = document.getElementById("LdesktopBG") && (!is_SA_BG_transparent)
if (WallpaperAsBG) {
  if (!self.SA_wallpaper_src) {
    var SA_wallpaper_path = System.Gadget.path + toLocalPath('\\TEMP\\SA_wallpaper_src.txt')
    if (FSO_OBJ.FileExists(SA_wallpaper_path)) {
      try {
        var f = FSO_OBJ.OpenTextFile(SA_wallpaper_path, 1);
        self.SA_wallpaper_src = f.ReadLine()
        f.Close()
      }
      catch (err) {}
    }
  }
  if (!self.SA_wallpaper_mask_src) {
    var SA_wallpaper_mask_path = System.Gadget.path + toLocalPath('\\TEMP\\SA_wallpaper_mask_src.txt')
    if (FSO_OBJ.FileExists(SA_wallpaper_mask_path)) {
      try {
        var f = FSO_OBJ.OpenTextFile(SA_wallpaper_mask_path, 1);
        self.SA_wallpaper_mask_src = f.ReadLine()
        f.Close()
      }
      catch (err) {}
    }
  }
}

if (WallpaperAsBG)
  WallpaperAsBG = (System.Gadget.Settings.readString("WallpaperAsBG") || self.SA_wallpaper_src)
var WallpaperAsBG_custom
if ((self.CANVAS_Video_Overlay && CANVAS_Video_Overlay.use_wallpaper_as_bg) || self.EQP_use_wallpaper) {
  WallpaperAsBG_custom = WallpaperAsBG = true
}

var wallpaper_mask
var s_left, s_top

this.Opacity = (is_SA_child_animation) ? parent.document.getElementById("Ichild_animation" + SA_child_animation_id).style.opacity || 1 : parseFloat(System.Gadget.Settings.readString("Opacity") || 1)

if (is_SA_child_animation && !self.SA_wallpaper_src && !WallpaperAsBG_custom) {
  // "DisableWallpaperMask" is false by default
  WallpaperAsBG = (WallpaperAsBG && parent.WMP_wallpaper_mask && parent.use_HTML5 && !parent.System.Gadget.Settings.readString("CSSTransform3D") && !System.Gadget.Settings.readString("DisableWallpaperMask"))

  if (WallpaperAsBG && self.EQP_video_options && EQP_video_options.use_canvas_video) {
    WallpaperAsBG = false
    this.C_WMP_wallpaper_mask_resized = document.createElement("canvas")
    this.C_WMP_wallpaper_mask_mixed_resized = document.createElement("canvas")
    this.WMPMask_Draw()
  }

  this.wallpaper_mask_disabled = !WallpaperAsBG
  if (WallpaperAsBG)
    wallpaper_mask = parent.WMP_wallpaper_mask
}
else {
  var use_body_opacity

  if (!is_SA_child_animation) {
    s_left = System.Gadget.Settings.readString("_screenLeft")
    s_top  = System.Gadget.Settings.readString("_screenTop")
  }
  s_left = (s_left) ? parseInt(s_left) : null
  s_top  = (s_top)  ? parseInt(s_top)  : null

  if (WallpaperAsBG) {
if (w3c_mode && self.SA_wallpaper_src && /\.(mp4|mkv|webm)$/i.test(SA_wallpaper_src)) {
  var v_bg = document.createElement("video")
  v_bg.id = "VdesktopBG"
  var vs = v_bg.style
  vs.position = "absolute"
  vs.posTop = vs.posLeft = 0
  vs.width  = parent.screen.width  + "px"
  vs.height = parent.screen.height + "px"
  vs.objectFit = "cover"
  LdesktopBG.appendChild(v_bg)

  v_bg.autoplay = v_bg.loop = true
  v_bg.src = toFileProtocol(SA_wallpaper_src)
}

// "DisableWallpaperMask" is false by default
// disabled for Wallpaper Engine CEF
this.wallpaper_mask_disabled = WallpaperEngine_CEF_mode || !!System.Gadget.Settings.readString("DisableWallpaperMask")

var desktop_reg, wallpaper, wallpaper_style
var ds = LdesktopBG.style

try {
  ds.pixelWidth  = parent.screen.width
  ds.pixelHeight = parent.screen.height

  var wcolor_reg = oShell.RegRead('HKCU\\Control Panel\\Colors\\Background')
  ds.backgroundColor = (/^\#/.test(wcolor_reg)) ? wcolor_reg : 'rgb(' + wcolor_reg.replace(/\W+/g, ",") + ')'

  desktop_reg = 'HKCU\\Control Panel\\Desktop\\'
  if (WallpaperEngine_CEF_mode)
    wallpaper = oShell.RegRead(desktop_reg + 'Wallpaper') || (self.SA_wallpaper_src && /\.(png|bpm|jpg|jpeg)$/i.test(SA_wallpaper_src) && SA_wallpaper_src)
  else
    wallpaper = (self.SA_wallpaper_src && /\.(png|bpm|jpg|jpeg)$/i.test(SA_wallpaper_src) && SA_wallpaper_src) || oShell.RegRead(desktop_reg + 'Wallpaper')

  if (wallpaper) {
    if (!this.wallpaper_mask_disabled) {
      wallpaper_mask = self.SA_wallpaper_mask_src || wallpaper.replace(/\.\w{3,4}$/, "_mask.png")
      if (!ValidatePath(wallpaper_mask))
        wallpaper_mask = null
    }
    wallpaper_style = oShell.RegRead(desktop_reg + 'WallpaperStyle')
    this.updateWallpaper(wallpaper, wallpaper_style)
  }

  this.moveWallpaper((s_left||0), (s_top ||0))

  if (!is_SA_child_animation || self.SA_wallpaper_src)
    LdesktopBG_host.style.display = "block"
}
catch (err) {
  console.error(err)
  LdesktopBG_host.style.display = "none"
}

if (wallpaper_mask) {
  if (!this.bg_mask)
    this.bg_mask = "(blank)"
}
else {
  use_body_opacity = true
}
  }
  else {
    use_body_opacity = true
  }

  if (use_body_opacity && (this.Opacity < 1) && (w3c_mode || HTA_use_GPU_acceleration)) {
    this.body.style.opacity = this.Opacity
    DEBUG_show("Opacity:" + (this.Opacity*100) + "%", 2)
  }
}

if (WallpaperAsBG_custom && !wallpaper_mask)
  this.bg_mask = "(blank)"

if (WallpaperAsBG && (wallpaper_mask || this.bg_mask)) {
  var c = document.createElement("canvas")
  c.id = "C_wallpaper_mask"
  c._WallpaperAsBG_custom = WallpaperAsBG_custom
  c.onmousedown = function () { return false }

  if (!is_SA_child_animation || WallpaperAsBG_custom) {
    try {
      var w = c.width  = parent.screen.width
      var h = c.height = parent.screen.height

      var context = c.getContext("2d")


var wallpaper_img
if (!this.wallpaper_canvas_update) {
  this.wallpaper_canvas_update = function (wallpaper, wallpaper_style) {
    context.fillStyle = ds.backgroundColor
    context.fillRect(0,0, w,h)

    if (!wallpaper) {
      if (self.CANVAS_Video_Overlay && CANVAS_Video_Overlay._canvas_wall)
        CANVAS_Video_Overlay._canvas_wall._match_str = null
      if (self.EQP_use_wallpaper) {
        EQP_ps.forEach(function (ps) {
          if (ps.is_wallpaper)
            ps.img.img_obj._match_str = null
        });
      }
      return
    }

    var wallpaper_onload
    if (wallpaper_style == "0") {
// center
      wallpaper_onload = function () {
var w = this.width
var h = this.height
var sw = parent.screen.width
var sh = parent.screen.height
var x_source,y_source,w_source,h_source, x_target,y_target,w_target,h_target
if (sw > w) {
  x_source = 0
  x_target = (sw-w)/2
  w_source = w_target = w
}
else {
  x_source = (w-sw)/2
  x_target = 0
  w_source = w_target = sw
}
if (sh > h) {
  y_source = 0
  y_target = (sh-h)/2
  h_source = h_target = h
}
else {
  y_source = (h-sh)/2
  y_target = 0
  h_source = h_target = sh
}

var context = C_wallpaper_mask.getContext("2d")
context.drawImage(this, x_source,y_source,w_source,h_source, x_target,y_target,w_target,h_target)

System._browser.BGMask_Create(!wallpaper_mask)

if (!wallpaper_mask)
  return

var mask_img = new Image()
mask_img.onload = function () {
  var context = C_wallpaper_mask.getContext("2d")
  context.globalCompositeOperation = 'destination-in'
  context.drawImage(this, x_source,y_source,w_source,h_source, x_target,y_target,w_target,h_target)

  C_wallpaper_mask.style.visibility = "inherit"
//C_wallpaper_mask.style.display="none"
  DEBUG_show("Use wallpaper mask", 2)
}
mask_img.src = toFileProtocol(wallpaper_mask)
      }
    }
    else {
      wallpaper_onload = function () {
var w = this.width
var h = this.height
var sw = parent.screen.width
var sh = parent.screen.height
var ratio, ww,hh, x,y
var context = C_wallpaper_mask.getContext("2d")
if (wallpaper_style == "6") {
  // "resized to fit the screen", Windows 7 only
  ratio = Math.max(w/sw, h/sh)
  x = Math.round((sw - (w/ratio))/2)
  y = Math.round((sh - (h/ratio))/2)
  ww = Math.round(w/ratio)
  hh = Math.round(h/ratio)
  context.drawImage(this, 0,0,w,h, x,y,ww,hh)
}
else {
  // "resized and cropped to fill the screen", Windows 7 only
  ratio = Math.min(w/sw, h/sh)
  x = Math.round((((w/ratio) - sw)/2) * ratio)
  y = Math.round((((h/ratio) - sh)/2) * ratio)
  ww = Math.round(sw * ratio)
  hh = Math.round(sh * ratio)
//console.log([x,y,ww,hh])
  context.drawImage(this, x,y,ww,hh, 0,0,C_wallpaper_mask.width,C_wallpaper_mask.height)
/*
C_wallpaper_mask.style.position="absolute"
C_wallpaper_mask.style.posTop = C_wallpaper_mask.style.posLeft = 0-9
C_wallpaper_mask.style.zIndex = 9999
C_wallpaper_mask.style.visibility = "visible"
C_wallpaper_mask.style.display = "block"
document.body.appendChild(C_wallpaper_mask)
return
*/
//DEBUG_show([C_wallpaper_mask.width,C_wallpaper_mask.height],0,1)
}

System._browser.BGMask_Create(!wallpaper_mask)

if (!wallpaper_mask)
  return

var mask_img = new Image()
mask_img.onload = function () {
  var context = C_wallpaper_mask.getContext("2d")
  context.globalCompositeOperation = 'destination-in'
  context.drawImage(this, x,y,ww,hh)

  C_wallpaper_mask.style.visibility = "inherit"
//C_wallpaper_mask.style.display="none"
  DEBUG_show("Use wallpaper mask", 2)
}
mask_img.src = toFileProtocol(wallpaper_mask)
      }
    }

    if (wallpaper_img)
      wallpaper_img.onload = null
    wallpaper_img = new Image()
    wallpaper_img.onload = wallpaper_onload
    wallpaper_img.src = toFileProtocol(wallpaper)
  }
}


      this.wallpaper_canvas_update (wallpaper, wallpaper_style)

      if (!wallpaper) {
        // no wallpaper, bg color only
        // "setTimeout" is used here so that the function is called AFTER "C_wallpaper_mask" has been appended to document body.
        setTimeout('System._browser.BGMask_Create(true)', 0)
      }
    }
    catch (err) {
    }
  }

  var cs = c.style
  cs.position = "absolute"
  cs.posLeft = -(s_left||0)
  cs.posTop  = -(s_top ||0)
  cs.zIndex  = 60
  cs.visibility = "hidden"
  document.body.appendChild(c)

  this.mouseover_hide_list.push(c)

  if (is_SA_child_animation) {
    this.C_WMP_wallpaper_mask_resized = document.createElement("canvas")
    this.C_WMP_wallpaper_mask_mixed_resized = document.createElement("canvas")
    if (this.bg_mask)
      System._browser.BGMask_Create(!wallpaper_mask)
    this.WMPMask_Draw()
  }
}

this._s_left = s_left
this._s_top  = s_top
    }

   ,updateWallpaper: function (wallpaper, wallpaper_style) {
var ds = LdesktopBG.style

var wallpaper_changed
if (wallpaper != null) {
// User-selected wallpaper on Wallpaper Engine is URI-encoded. Use decodeURIComponent here.
// Always use toFileProtocol just to be safe.
  wallpaper = decodeURIComponent(wallpaper)

  if (this._wallpaper_last != wallpaper) {
    wallpaper_changed = true
    this._wallpaper_last = wallpaper

    ds.backgroundImage = (wallpaper) ? 'url(' + toFileProtocol((/^(\/|[\w\-]+\:)/.test(wallpaper)) ? wallpaper : System.Gadget.path + '/' + wallpaper) + ')' : ''
//console.log(wallpaper+','+ds.backgroundImage)
    if (this.wallpaper_opacity)
      ds.opacity = this.wallpaper_opacity
    if (this.wallpaper_bg_color)
      LdesktopBG_host.style.backgroundColor = this.wallpaper_bg_color
  }
}
else
  wallpaper = this._wallpaper_last

var desktop_reg = 'HKCU\\Control Panel\\Desktop\\'
if (wallpaper_style == null) {
  wallpaper_style = oShell.RegRead(desktop_reg + 'WallpaperStyle')
}
if (this._wallpaper_style != wallpaper_style) {
  wallpaper_changed = true
  this._wallpaper_style = wallpaper_style
}
/*
Source - http://msdn.microsoft.com/en-us/library/bb773190%28VS.85%29.aspx
; 0:  The image is centered if TileWallpaper=0 or tiled if TileWallpaper=1
; 2:  The image is stretched to fill the screen
; 6:  The image is resized to fit the screen while maintaining the aspect 
      ratio. (Windows 7 and later)
; 10: The image is resized and cropped to fill the screen while maintaining 
      the aspect ratio. (Windows 7 and later)
*/

if (wallpaper_style == "0") {
  ds.backgroundSize = ""
  ds.backgroundPosition = "center center"
  if (oShell.RegRead(desktop_reg + 'TileWallpaper') == "0") {
    ds.backgroundRepeat = "no-repeat"
  }
  else {
    // No wallpaper mask for tile
    ds.backgroundRepeat = ""
  }
}
else if (wallpaper_style == "2") {
  ds.backgroundSize = "100% 100%"
  ds.backgroundPosition = ""
  ds.backgroundRepeat = ""
}
else if (wallpaper_style == "6") {
  // "resized to fit the screen", Windows 7 only
  ds.backgroundSize = "contain"
  ds.backgroundPosition = "center center"
  ds.backgroundRepeat = "no-repeat"
}
else {
  // "resized and cropped to fill the screen", Windows 7 only
  ds.backgroundSize = "cover"
  ds.backgroundPosition = "center center"
  ds.backgroundRepeat = "no-repeat"

  if (browser_native_mode) {
    ds.width  = "100%"
    ds.height = "100%"
  }
  else {
    ds.pixelWidth  = parent.screen.width
    ds.pixelHeight = parent.screen.height
  }

  if (windows_mode && wallpaper) {
    var dim = loadImageDim((/^(\/|[\w\-]+\:)/.test(wallpaper)) ? wallpaper : System.Gadget.path + toLocalPath('\\') + wallpaper)
    if (dim.w) {
      var desk_ar = parent.screen.width/parent.screen.height
      var desk_ar_ext = (parent.screen.width*2 -parent.screen.availWidth)/(parent.screen.height*2-parent.screen.availHeight)
      var wall_ar = dim.w / dim.h
      if (wall_ar < desk_ar) {
        ds.pixelHeight = (wall_ar < desk_ar_ext) ? parent.screen.height*2-parent.screen.availHeight : Math.round(parent.screen.width /wall_ar)
      }
      else if (wall_ar > desk_ar) {
        ds.pixelWidth  = (wall_ar > desk_ar_ext) ? parent.screen.width*2 -parent.screen.availWidth  : Math.round(parent.screen.height*wall_ar)
      }
    }
  }

}

if (this.wallpaper_canvas_update && wallpaper_changed) {
  this.wallpaper_canvas_update(wallpaper, wallpaper_style)
  DEBUG_show('(Wallpaper canvas updated)', 2)//+[wallpaper,wallpaper_style], 0,1)
}
    }

   ,WMPMask_Draw: function (c_source) {
if (!this.C_WMP_wallpaper_mask_resized)
  return

if (!c_source)
  c_source = parent.SL
if (!c_source || !c_source.width)
  return

var bs = document.body.style
var w = bs.pixelWidth
var h = bs.pixelHeight
if (!w)
  return

var x_source = 0
var y_source = 0
var w_source = c_source.width
var h_source = c_source.height

var c_wall_mask_resized = this.C_WMP_wallpaper_mask_resized
if (c_wall_mask_resized.width != w_source) {
  c_wall_mask_resized.width  = w_source
  c_wall_mask_resized.height = h_source

  var c_wall = parent.C_WMP_wallpaper_mask
  c_wall_mask_resized.getContext("2d").drawImage(c_wall, 0,0,c_wall.width,c_wall.height, 0,0,w_source,h_source)
}

var bg_mask_image_resized = this.bg_mask_image_resized
if (bg_mask_image_resized && bg_mask_image_resized.width != w) {
  bg_mask_image_resized.width  = w
  bg_mask_image_resized.height = h

  var bg_mask_image = this.bg_mask_image
  bg_mask_image_resized.getContext("2d").drawImage(bg_mask_image, 0,0,bg_mask_image.width,bg_mask_image.height, 0,0,w,h)
}

var w, h
w = (self.B_content_width)  ? B_content_width  : document.body.style.pixelWidth
h = (self.B_content_height) ? B_content_height : document.body.style.pixelHeight

var ani = parent.SA_child_animation[SA_child_animation_id]
var x = ani.x
var y = ani.y
if (is_SA_child_animation && parent.EQP_border_width) {
  x -= parent.EQP_border_width
  y -= parent.EQP_border_width
}

var x_target1 = x - x_source
var x_target2 = x_target1
if (x_target1 < 0)
  x_target1 = 0
if (x_target2 < 0)
  x_target2 = -x_target2
else
  x_target2 = 0
var y_target1 = y - y_source
var y_target2 = y_target1
if (y_target1 < 0)
  y_target1 = 0
if (y_target2 < 0)
  y_target2 = -y_target2
else
  y_target2 = 0

var w_target = (w_source + x_source) - x
if (w_target > w)
  w_target = w
var h_target = (h_source + y_source) - y
if (h_target > h)
  h_target = h

var c_wall_mask_mixed_resized = this.C_WMP_wallpaper_mask_mixed_resized
if ((c_wall_mask_mixed_resized.width != w) || (c_wall_mask_mixed_resized._x != x_target1) || (c_wall_mask_mixed_resized._y != y_target1)) {
  c_wall_mask_mixed_resized.width  = w
  c_wall_mask_mixed_resized.height = h

//DEBUG_show([x_target1,y_target1,w_target,h_target, x_target2,y_target2,w_target,h_target,w,h], 0,1)
  var context = c_wall_mask_mixed_resized.getContext("2d")
  context.drawImage(c_wall_mask_resized, x_target1,y_target1,w_target,h_target, x_target2,y_target2,w_target,h_target)
  if (bg_mask_image_resized)
    context.drawImage(bg_mask_image_resized, 0,0)

  c_wall_mask_mixed_resized._x = x_target1
  c_wall_mask_mixed_resized._y = y_target1
}

var c = document.getElementById("C_wallpaper_mask")
if (!c)
  return

c.width  = w
c.height = h

var context = c.getContext("2d")
context.globalCompositeOperation = 'copy'
//DEBUG_show([x_target1,y_target1,w_target,h_target, x_target2,y_target2,w_target,h_target,w,h], 0,1)
context.drawImage(c_source, x_target1,y_target1,w_target,h_target, x_target2,y_target2,w_target,h_target)
context.globalCompositeOperation = 'destination-in'
context.drawImage(c_wall_mask_mixed_resized, 0,0)
    }

   ,BGMask_CreateCanvas: function (bg_mask, empty_base) {
if (!bg_mask)
  return null

if (!/^\((.+)\)$/.test(bg_mask)) {
  return null
}

var paras = RegExp.$1.split("|")
var mask_name = paras[0]

var c
if (mask_name == "circle") {
  var w = parseInt(paras[1])
  var h = parseInt(paras[2])

  c = document.createElement("canvas")
  c.width  = w
  c.height = h

  var dim = (w < h) ? w : h

  var context = c.getContext("2d")
  context.beginPath()
  context.arc(w/2,h/2, dim/2, 0,Math.PI*2)

  context.fill()
}
else if (mask_name == "feather") {
  var w = parseInt(paras[1])
  var h = parseInt(paras[2])
  var feather = parseInt(paras[3])
  if (!feather)
    feather = parseInt(Math.sqrt(w*w + h*h) / 25)

  c = document.createElement("canvas")
  c.width  = w
  c.height = h

  var context = c.getContext("2d")

  var image_data
  if (empty_base)
    image_data = context.createImageData(w,h)
  else {
    context.fillRect(0,0, w,h)
    image_data = context.getImageData(0,0, w,h)
  }

  var data = image_data.data
  for (var a = 3, a_max = data.length; a < a_max; a+=4) {
    var pixel = (a - 3) / 4
    var x = pixel % w
    var y = parseInt(pixel / w)
    var f_mod = 1.2

    var mod_x = 1
    if (x < feather)
      mod_x = (x+1) / (feather+1)
    else if (x >= w - feather)
      mod_x = (w-x) / (feather+1)
    mod_x = 1 - ((1-mod_x) * f_mod)
    if (mod_x < 0)
      mod_x = 0

    var mod_y = 1
    if (y < feather)
      mod_y = (y+1) / (feather+1)
    else if (y >= h - feather)
      mod_y = (h-y) / (feather+1)
    mod_y = 1 - ((1-mod_y) * f_mod)
    if (mod_y < 0)
      mod_y = 0

    var mod = (mod_x < mod_y) ? mod_x : mod_y
    if (mod == 1)
      continue

    if ((mod_x < 1) && (mod_y < 1)) {
      var fx = 1-mod_x
      var fy = 1-mod_y
      var ff = (fx > fy) ? fy/fx : fx/fy
      var diagonal = Math.sqrt(1 + ff*ff)

      mod = 1 - ((1-mod) * diagonal)
      if (mod < 0)
        mod = 0
    }

    data[a] = (empty_base) ? Math.round(255 * (1 - mod)) : Math.round(255 * mod)
  }

  context.putImageData(image_data, 0,0)
}

return c
    }

   ,BGMask_Create: function (no_wallpaper_mask) {
var bg_mask = this.bg_mask
if (!bg_mask)
  return

if (no_wallpaper_mask) {
  this.wallpaper_canvas = C_wallpaper_mask
  C_wallpaper_mask.style.display = "none"
}
else {
  var wallpaper = this.wallpaper_canvas = document.createElement("canvas")
  if (!is_SA_child_animation) {
    wallpaper.width  = parent.screen.width
    wallpaper.height = parent.screen.height
    wallpaper.getContext("2d").drawImage(C_wallpaper_mask, 0,0)
  }
}

if (self.CANVAS_Video_Overlay && CANVAS_Video_Overlay._canvas_wall)
  CANVAS_Video_Overlay._canvas_wall._match_str = null
if (self.EQP_use_wallpaper) {
  EQP_ps.forEach(function (ps) {
    if (ps.is_wallpaper && ps.img)
      ps.img.img_obj._match_str = null
  });
}

if (/^\((.+)\)$/.test(bg_mask)) {
  this.bg_mask_image = this.BGMask_CreateCanvas(bg_mask, is_SA_child_animation)

  this.BGMask_onload()
  return
}

var mask_img = this.bg_mask_image = new Image()
mask_img.onload = this.BGMask_onload
mask_img.src = toFileProtocol(bg_mask)
    }

   ,BGMask_onload: function () {
var bg = document.getElementById("C_BG_mask")
if (!bg) {
  bg = document.createElement("canvas")
  bg.id = "C_BG_mask"
  var bs = bg.style
  bs.position = "absolute"
  bs.posTop = bs.posLeft = 0
  bs.zIndex = 60+1
  document.body.appendChild(bg)
}

if (System._browser.mouseover_hide_list.indexOf(bg) == -1)
  System._browser.mouseover_hide_list.push(bg)

if (is_SA_child_animation) {
  System._browser.bg_mask_image_resized = document.createElement("canvas")
}
else {
  System._browser.BGMask_Draw()
}
    }

   ,BGMask_Draw: function (target_canvas) {
if (is_SA_child_animation && (!document.getElementById("C_wallpaper_mask") || !C_wallpaper_mask._WallpaperAsBG_custom)) {
  this.WMPMask_Draw()
  return
}
if (!document.getElementById("C_BG_mask"))
  return

var cw, ch, w ,h
cw = w = (self.B_content_width)  ? B_content_width  : document.body.style.pixelWidth
ch = h = (self.B_content_height) ? B_content_height : document.body.style.pixelHeight
if (w > parent.screen.width)
  w = parent.screen.width
if (h > parent.screen.height)
  h = parent.screen.height

var x_source,y_source, x_target,y_target
var cs = C_wallpaper_mask.style
if (cs.posLeft > 0) {
  x_source = 0
  x_target = cs.posLeft
}
else {
  x_source = -cs.posLeft
  x_target = 0
}
if (cs.posTop > 0) {
  y_source = 0
  y_target = cs.posTop
}
else {
  y_source = -cs.posTop
  y_target = 0
}

if (target_canvas) {
  var match_str = x_source+','+y_source+','+w+','+h+','+x_target+','+y_target+','+w+','+h
  if (target_canvas._match_str == match_str)
    return
  target_canvas._match_str = match_str
//console.log(match_str)
  target_canvas.width  = cw
  target_canvas.height = ch

  var context = target_canvas.getContext("2d")
  context.globalCompositeOperation = 'copy'
  context.drawImage(this.wallpaper_canvas, x_source,y_source,w,h, x_target,y_target,w,h)
  return
}

if (!this.bg_mask_image && (this.Opacity == 1)) {
  document.getElementById("C_BG_mask").style.display = "none"
  return
}

C_BG_mask.width  = cw
C_BG_mask.height = ch

var context = C_BG_mask.getContext("2d")
context.globalCompositeOperation = 'copy'
context.globalAlpha = (this.bg_mask_image) ? 1 : 1-this.Opacity
context.drawImage(this.wallpaper_canvas, x_source,y_source,w,h, x_target,y_target,w,h)

if (this.bg_mask_image) {
  context.globalCompositeOperation = 'destination-out'
  context.globalAlpha = this.Opacity
  context.drawImage(this.bg_mask_image, 0,0,w,h)
}
else
  C_BG_mask.style.display = "block"
    }

   ,resize_timerID: null

// for checking when something can't be done during resize (eg. captuePage)
   ,resize_cooling_timestamp: 0

   ,resize: (function () {
      var resized_once = false

      function on_first_resize() {
if (!resized_once) {
  resized_once = true
  setTimeout(function () { window.dispatchEvent(new CustomEvent("SA_resized_once")); }, 0)
}
      }

      return function () {
this.resize_timerID = null

if (use_SA_browser_mode) {
  let oBody = document.body.style
  if (is_SA_child_animation) {
    let i_obj = parent.document.getElementById("Ichild_animation" + SA_child_animation_id).style
    i_obj.width  = oBody.pixelWidth  + "px"
    i_obj.height = oBody.pixelHeight + "px"
    on_first_resize()
  }
  else {
// IMPORTANT: stick to webkit_electron_mode only, as this (mainly window.resize() for mobile) is probably not needed for browsers, and it causes issues in Chrome fullscreen mode and WebXR AR mode
if (webkit_electron_mode) {
    if (webkit_electron_mode && top.System._browser.capturePage_in_process) {
      this.resize_timerID = setTimeout("System._browser.resize()", 50)
      return
    }
    if (webkit_electron_mode)
      System._browser.resize_cooling_timestamp = performance.now()
    SA_top_window.resizeToAbsolute(oBody.pixelWidth + ((xul_mode) ? SA_top_window.outerWidth - SA_top_window.innerWidth : 0), oBody.pixelHeight + ((xul_mode) ? SA_top_window.outerHeight - SA_top_window.innerHeight : 0))
//webkit_window.setSize(oBody.pixelWidth, oBody.pixelHeight)
//webkit_window.setContentSize(oBody.pixelWidth, oBody.pixelHeight)
//webkit_window.setBounds({x:0, y:0, width:oBody.pixelWidth*8, height:oBody.pixelHeight*5})
//DEBUG_show(webkit_window.getContentSize(),0,1)
}
    on_first_resize()
  }
}
      };
    })()

   ,drag_mouse_x: -1
   ,drag_mouse_y: -1
   ,drag_timerID: null
   ,is_dragging: false

   ,mouseout_timerID: null

   ,mouseover_hide_list: []

   ,onmouseover_custom: null
   ,onmouseover: function (event) {
if (webkit_electron_mode && (top.returnBoolean("IgnoreMouseEvents") || top.returnBoolean("AutoItStayOnDesktop")) && !top.webkit_IgnoreMouseEvents_disabled)
  return

if (this.onmouseover_custom && this.onmouseover_custom(event))
  return

if (this.mouseout_timerID) {
  clearTimeout(this.mouseout_timerID)
  this.mouseout_timerID = null
}

var list = this.mouseover_hide_list
for (var i = 0; i < list.length; i++)
  list[i].style.visibility = "hidden"
    }

   ,onmouseout_waiting_custom: null
   ,onmouseout_waiting: function (event) {
if (this.onmouseout_waiting_custom && this.onmouseout_waiting_custom(event))
  return

if (this.mouseout_timerID) {
  clearTimeout(this.mouseout_timerID)
  this.mouseout_timerID = null
}

var x = event.clientX
var y = event.clientY
var bs = document.body.style
var ignore_wallpaper_mask = (((x > 0) && (x < bs.pixelWidth)) && ((y > 0) && (y < bs.pixelHeight)))

if (w3c_mode)
  event.stopPropagation()
this.mouseout_timerID = setTimeout('System._browser.onmouseout(' + ignore_wallpaper_mask + ')', 200)
    }

   ,onmouseout: function (ignore_wallpaper_mask) {
this.mouseout_timerID = null

if (this.drag_timerID) {
  clearTimeout(this.drag_timerID)
  this.drag_timerID = null
}

if (this.is_dragging) {
  this.is_dragging = false
//  DEBUG_show("drag end", 1)
  ignore_wallpaper_mask = false
  this.showFocus(false)

  System.Gadget.Settings._writeSettings(true, true)
}
else if (is_SA_child_animation && parent.System._browser.is_dragging) {
  parent.System._browser.is_dragging = false
  this.showFocus(false)
}

if (ignore_wallpaper_mask)
  return

var list = this.mouseover_hide_list
for (var i = 0; i < list.length; i++)
  list[i].style.visibility = "inherit"
this.BGMask_Draw()
    }

   ,onmousedown: function (event) {
//DEBUG_show(event.target.tagName+'/'+event.target.id)
if (this.drag_timerID) {
  clearTimeout(this.drag_timerID)
  this.drag_timerID = null
}

var list = this.mouseover_hide_list
var focused = true
for (var i = 0; i < list.length; i++) {
  var ls = list[i].style
  if (ls.visibility != "hidden") {
    ls.visibility = "hidden"
    focused = false
  }
}

var has_child
if (!focused && !is_SA_child_animation && SA_child_animation_max) {
  for (var i = 0; i < SA_child_animation_max; i++) {
    if (SA_child_animation[i]) {
      has_child = true
      break
    }
  }
}
focused = !has_child

if (focused) {
//  DEBUG_show(event.target.id,0,1)
  var ex, ey
  if (WallpaperEngine_mode) {
    ex = event.x
    ey = event.y
  }
  else {
    if (absolute_screen_mode) {
      ex = SA_top_window.getCursorPos().x
      ey = SA_top_window.getCursorPos().y
    }
    else {
      ex = event.screenX
      ey = event.screenY
    }
  }
  if (!is_SA_child_animation || !parent.returnBoolean("ChildDragDisabled") ||true)
    this.drag_timerID = setTimeout('System._browser.onmousedown_dragStart(' + ex + ',' + ey + ')', 200)
}
else
  DEBUG_show("(focused)", 1)
    }

   ,showFocus: function (show, show_input_target) {
if (is_SA_child_animation) {
// to fix the dragging issue when using the right mouse button in XUL
  if (!xul_mode || !this.is_dragging)
    parent.System._browser.showFocus(show)
}

if (!show) {
  Ldrag_dummy.style.visibility = "hidden"
//  Ldrag_dummy.style.display = "none"
  return
}

var bw = document.body.style.pixelWidth
var bh = document.body.style.pixelHeight
if (bw && bh) {
  var ds = Ldrag_dummy.style
  ds.pixelWidth  = bw-2
  ds.pixelHeight = bh-2
  ds.visibility = "inherit"
//  ds.display = "block"
}

if (show_input_target)
  DEBUG_show("(selected)", 1)
    }

   ,arrangeChildZ: function (id) {
System.Gadget.Settings._settings_need_update = true

var ca = []
for (var i = 0; i < SA_child_animation_max; i++) {
  if (SA_child_animation[i])
    ca[i] = { index:i, z:SA_child_animation[i].z }
}

ca.sort(function (a, b) { return ((a.index==id) ? 1 : ((b.index==id) ? -1 : (a.z - b.z))); }).forEach(function (ani, idx) {
  SA_child_animation[ani.index].z = document.getElementById("Ichild_animation" + ani.index).style.zIndex = idx
});
    }

   ,_child_selected: null
   ,_drag_disabled: false
   ,_child_drag_disabled: false
   ,onmousedown_dragStart: function (x,y) {
this.drag_timerID = null;

if (WallpaperEngine_mode)// && !is_SA_child_animation)
  return

if (is_SA_child_animation && is_SA_child_animation_host) {
  parent.System._browser.is_dragging = true;
  parent.System._browser.drag_mouse_x = x;
  parent.System._browser.drag_mouse_y = y;
  DEBUG_show("drag start", 1)
  this.showFocus(true)
  return
}

if (!this._drag_disabled && (!is_SA_child_animation || !parent.System._browser._child_drag_disabled)) {
  this.is_dragging = true;
  this.drag_mouse_x = x;
  this.drag_mouse_y = y;
  DEBUG_show("drag start", 1)
}

this.showFocus(true)

if (is_SA_child_animation) {
  parent.System._browser.arrangeChildZ(SA_child_animation_id)
}
    }

   ,_BL_clicked: 0
   ,_BL_clicked_max: 1
   ,_BL_clicked_timerID: null
   ,onmouseup_custom: null
   ,onmouseup: function (event) {
if (this.onmouseup_custom && this.onmouseup_custom(event))
  return

this.onmouseout(true)

if (this._drag_disabled || (is_SA_child_animation && parent.System._browser._child_drag_disabled))
  this.showFocus(false)

if ((event.clientX > 20) || (event.clientY < document.body.style.pixelHeight-20))
  return

if (this._BL_clicked_timerID) {
  clearTimeout(this._BL_clicked_timerID)
  this._BL_clicked_timerID = null
}

if (++this._BL_clicked < this._BL_clicked_max) {
  this._BL_clicked_timerID = setTimeout('System._browser._BL_clicked_timerID=null; System._browser._BL_clicked=0;', 250)
  return
}

this._BL_clicked = 0

if (!WallpaperEngine_mode && (!self.Lquick_menu || !Lquick_menu._activated))
  this.confirmClose()
    }

   ,confirmClose: function (enforced) {
if (browser_native_mode) {
  if (confirm("This will reload System Animator.")) {
    top.location.reload()
  }  
  return
}

if (!enforced || xul_mode/* || WallpaperEngine_mode*/) {
  System._browser.showFocus(true, true)

  var msg_extra = (is_SA_child_animation) ? " (child" + (SA_child_animation_id+1) + ")" : ""
  if (SA_top_window.is_SA_hosted) {
    if (confirm("Close " + SystemEXT._default.gadget_name + " (XUL host)?")) {
      SA_top_window.opener.close()
      return
    }
    msg_extra += " (this animation only)"
  }

  System._browser.showFocus(false)
}

if (is_SA_child_animation) {
  if (is_SA_child_animation_host) {
    parent.System._browser.confirmClose(enforced)
  }
  else {
    parent.System.Gadget.Settings._settings_need_update = true
    parent.SA_child_animation[SA_child_animation_id] = null

    var d = parent.document.getElementById("Ichild_animation" + SA_child_animation_id)
    d.style.pixelWidth = d.style.pixelHeight = 0
    d.style.visibility = "hidden"

    d.contentWindow.location.replace("z_blank.html")
  }
}
else {
  if (WallpaperEngine_CEF_mode && !W8_or_above) {
    SA_top_window.location.reload()
  }
  else
    SA_top_window.close()
}
    }

   ,onSettings: function () {
if (!System.Gadget.settingsUI)
  return false

if (use_inline_dialog) {
  if (document.getElementById("Idialog").style.visibility == "hidden") {
    document.getElementById("Idialog").contentWindow.location.replace("settings.html")
  }
  return true
}

System._browser.showFocus(true, true)
var v = showModalDialog(System.Gadget.settingsUI, self)
v = (xul_mode) ? self.returnValue : v
System._browser.showFocus(false)

this.onSettingsClosed(v)
return true
    }

   ,onSettingsClosed: function (v) {
if (System.Gadget.onSettingsClosed)
  System.Gadget.onSettingsClosed({closeAction:!!v, Action:{commit:true}})
    }

   ,onkeydown: function (event) {
var have_child = (is_SA_child_animation || document.getElementById("Lchild_animation_parent")) && !is_SA_child_animation_host;

var k = event.keyCode
if (k == 67) {
// c
//  if (!is_SA_child_animation)
//    return false
  this.confirmClose()
  return true
}
else if (k == 69) {
// e
  return this.onSettings()
}
else if (k == 79) {
// o
  var o
  if (is_SA_child_animation) {
    var ds = parent.document.getElementById("Ichild_animation" + SA_child_animation_id).style
    o = this.Opacity
/*
    o = ds.opacity
    if (!o)
      o = 1
*/

if ("_opacity_" in event) { o = event._opacity_ }
else {
    o -= 0.25
    if (o < 0.25)
      o = 1
}

    parent.System.Gadget.Settings._settings_need_update = true;
    parent.SA_child_animation[SA_child_animation_id].opacity = o;

    ds.opacity = o
  }
  else if (this.bg_mask) {
    o = this.Opacity

if ("_opacity_" in event) { o = event._opacity_ }
else {
    o -= 0.25
    if (o < 0.25)
      o = 1
}

    System.Gadget.Settings.writeString("Opacity", o)

    this.Opacity = o
    this.BGMask_Draw()
  }
  else if (w3c_mode || HTA_use_GPU_acceleration) {
    var ds = this.body.style
    o = this.Opacity
/*
    var o = ds.opacity
    if (!o)
      o = 1
*/

if ("_opacity_" in event) { o = event._opacity_ }
else {
    o -= 0.25
    if (o < 0.25)
      o = 1
}

    System.Gadget.Settings.writeString("Opacity", o)

    ds.opacity = o
  }
  else
    return false

  this.Opacity = o

  DEBUG_show("Opacity:" + (o*100) + "%", 2)
  this.update_tray()
  return true
}
else if (k == 83) {
// s
  var f = (System.Gadget.docked) ? System.Gadget.onUndock : System.Gadget.onDock
  if (!f)
    return false

  setTimeout(System._browser.ondockundock, 0)
  return true
}
else if (have_child && ((k >= 49) && (k < 49+SA_child_animation_max))) {
  var id = k - 49

  var p = (is_SA_child_animation) ? parent : self
  var d = p.document.getElementById("Ichild_animation" + id)
  if (!d || !d.contentWindow.is_SA_child_animation) {
    DEBUG_show('(child animation ' + (id+1) + ' not found)', 2)
    return true
  }

  var cw = d.contentWindow
  var cp = cw.parent
  var cp_browser = cp.System._browser

  if (cw.System.Gadget.Settings.readString("CSSTransform3D") || cp.System.Gadget.Settings.readString("CSSTransform3D")) {
    if (cp_browser._child_selected == id) {
      cp_browser._child_selected = null
      cw.DEBUG_show("(deselected)", 2)
      cp.DEBUG_show("(child" + (id+1) + " deselected)", 2)
      return true
    }
    cp_browser._child_selected = id
  }

  cw.DEBUG_show("(selected)", 2)
  cp.DEBUG_show("(child" + (id+1) + " selected)", 2)
  cp_browser.arrangeChildZ(id)
  cw.focus()

  return true
}
else if (have_child && (k == 96)) {
  var p = (is_SA_child_animation) ? parent : self

  var ds = p.Lchild_animation_parent.style
  ds.visibility = (ds.visibility == "hidden") ? "visible" : "hidden"
  if (webkit_mode)
    ds.display = (ds.visibility == "hidden") ? "none" : "block"

  p.System._browser._child_selected = null
  return true
}
else if (have_child && ((k >= 97) && (k < 97+SA_child_animation_max))) {
// num pad 1-9 (SA_child_animation_max)
  var id = k - 97

  var p = (is_SA_child_animation) ? parent : self
  var d = p.document.getElementById("Ichild_animation" + id)
  if (!d || !d.contentWindow.is_SA_child_animation) {
    DEBUG_show('(child animation ' + (id+1) + ' not found)', 2)
    return true
  }

  var ds = d.style
  ds.visibility = (ds.visibility == "hidden") ? "visible" : "hidden"
  if (webkit_mode)
    ds.display = (ds.visibility == "hidden") ? "none" : "block"

  p.System._browser._child_selected = null

  var child_visible = false
  for (var i = 0; i < SA_child_animation_max; i++) {
    var d = p.document.getElementById("Ichild_animation" + i)
    if (d && d.contentWindow.is_SA_child_animation && (d.style.visibility != "hidden")) {
      child_visible = true
      break
    }
  }
  p.document.getElementById("Lchild_animation_parent").style.visibility = (child_visible) ? "visible" : "hidden"

  return true
}
else if ((k >= 96) && (k < 96+10)) {
// num pad 0-9
  if (self.MMD_SA && MMD_SA_options.motion_shuffle && MMD_SA.use_jThree && MMD_SA.MMD_started) {
    if (k == 96) {
      if (MMD_SA_options._motion_shuffle) {
        if (!MMD_SA_options.motion_shuffle_list_default && MMD_SA_options._motion_shuffle_list_default) {
          MMD_SA_options.motion_shuffle_list_default = MMD_SA_options._motion_shuffle_list_default.slice()
          MMD_SA._force_motion_shuffle = true
        }
        else {
          MMD_SA_options.motion_shuffle = MMD_SA_options._motion_shuffle.slice(0)
          MMD_SA_options.motion_shuffle_list_default = null
          MMD_SA._force_motion_shuffle = true
          DEBUG_show("(MMD motions shuffled)", 2)
        }
      }
    }
    else {
      var id = k - 97

      if (MMD_SA_options.motion_by_song_name) {
        if (MMD_SA_options.motion_by_song_name._loading_) {
          DEBUG_show("(music/motion loading)", 2)
          return true
        }

        let entry = Object.keys(MMD_SA_options.motion_by_song_name).find((p)=>{return MMD_SA_options.motion_by_song_name[p].key==(id+1)});
        if (entry) {
          let song_path = MMD_SA_options.motion_by_song_name[entry].song_path
          if (/\.zip\#/i.test(song_path)) {
MMD_SA_options.motion_by_song_name._loading_ = true

// zip filename only
song_path = song_path.replace(/^.+[\/\\]([^\/\\]+\.zip)/i, "$1")
let xhr = new self.XMLHttpRequestZIP;
xhr.onload = function () {
  MMD_SA_options.motion_by_song_name._loading_ = false
  let blob = this.response
  blob.name = song_path.replace(/^.+[\/\\]/, "")
  blob.isFileSystem = true
  SA_DragDropEMU(blob)
};
xhr.open( "GET", song_path, true );
xhr.responseType = "blob";
xhr.send();
          }
          else
            SA_DragDropEMU(song_path)
          return true
        }
      }

      if (id >= MMD_SA.normal_action_length) {
        DEBUG_show("(MMD motion not found)", 2)
        return true
      }
//DEBUG_show(id+'/'+MMD_SA.normal_action_length,0,1)
      if (!MMD_SA_options._motion_shuffle)
        MMD_SA_options._motion_shuffle = MMD_SA_options.motion_shuffle.slice(0)

      MMD_SA_options.motion_shuffle = [id]
      MMD_SA_options.motion_shuffle_list_default = null
      MMD_SA._force_motion_shuffle = true
      DEBUG_show("(MMD motion changed)", 2)
    }
    return true
  }
}

return false
    }

   ,ondockundock: function () {
DEBUG_show("Dock state changed", 2)

var d = !System.Gadget.docked
System.Gadget.docked = d
System.Gadget.Settings.writeString("SA_docked", ((!!d == !!is_SA_child_animation) ? "" : ((d) ? "1" : "0")));
var f = (!d) ? System.Gadget.onUndock : System.Gadget.onDock
if (!f)
  return

f()
    }

   ,onmousemove_custom: null
   ,onmousemove: function (event) {
var ex, ey
if (WallpaperEngine_mode || browser_native_mode) {
  ex = this._WE_mouse_x = event.x
  ey = this._WE_mouse_y = event.y
//DEBUG_show([ex,ey])
}

if (this.onmousemove_custom && this.onmousemove_custom(event))
  return

if (!this.is_dragging) {
  if (is_SA_child_animation && parent.System._browser.is_dragging) {
    parent.System._browser.onmousemove(event)
  }
  return
}

if (!WallpaperEngine_mode) {
  if (absolute_screen_mode) {
    ex = SA_top_window.getCursorPos().x
    ey = SA_top_window.getCursorPos().y
  }
  else {
    ex = event.screenX
    ey = event.screenY
  }
}

if (is_SA_child_animation || (this._child_selected != null)) {
  var cw, cp, id
  if (is_SA_child_animation) {
    id = SA_child_animation_id
    cw = self
    cp = parent
  }
  else {
    id = this._child_selected
    cw = document.getElementById("Ichild_animation" + id).contentWindow
    cp = self
  }

  cp.System.Gadget.Settings._settings_need_update = true

  var ani = cp.SA_child_animation[id]
  var i_obj = cp.document.getElementById("Ichild_animation" + id).style

  var oBody = cw.document.body.style
  var PBody = cp.document.body.style

  var x = ani.x + ex-this.drag_mouse_x
  var y = ani.y + ey-this.drag_mouse_y

  i_obj.posLeft = ani.x = x
  i_obj.posTop  = ani.y = y

  cw.document.getElementById("Ldebug").innerText = cp.document.getElementById("Ldebug").innerText = "(moving)"
  cw.DEBUG_hide_sec = cp.DEBUG_hide_sec = 0
  cw.DEBUG_show('('+x+','+y+')', 2)
//  cp.DEBUG_show('('+x+','+y+')', 2)
//  cp.DEBUG_show('('+event.x+','+event.y+')', 2)
//  console.log('('+this.drag_mouse_x+','+this.drag_mouse_y+')')
}
else {
  System.Gadget.Settings._settings_need_update = true
  this.moveBy(ex-this.drag_mouse_x, ey-this.drag_mouse_y, event)
}

this.moveWallpaper()

this.drag_mouse_x = ex
this.drag_mouse_y = ey
    }

   ,moveWallpaper: function (x, y) {
if (is_SA_child_animation && (!document.getElementById("C_wallpaper_mask") || !C_wallpaper_mask._WallpaperAsBG_custom))
  return

if (is_SA_child_animation || (document.getElementById("LdesktopBG") && (LdesktopBG.style.display != "none"))) {
  if (WallpaperEngine_mode) {
    x = 0
    y = 0
  }
  else {
    if (absolute_screen_mode) {
      if (x == null)
        x = SA_top_window.screenLeftAbsolute
      if (y == null)
        y = SA_top_window.screenTopAbsolute

      var b = SA_top_window.getScreenBounds(x,y)
      x = -(x - b.x)
      y = -(y - b.y)
    }
    else {
      if (x == null)
        x = SA_top_window.screenLeft
      if (y == null)
        y = SA_top_window.screenTop

      x = -(x % parent.screen.width)
      y = -(y % parent.screen.height)
    }
  }

  if (is_SA_child_animation) {
    var ani = parent.SA_child_animation[SA_child_animation_id]
    x -= ani.x
    y -= ani.y
  }
  else {
    var ds = ((is_SA_child_animation_host && Ichild_animation0.contentWindow.document.getElementById("LdesktopBG")) || LdesktopBG).style
    ds.posLeft = x
    ds.posTop  = y
  }

  if (document.getElementById("C_wallpaper_mask")) {
    var cs = C_wallpaper_mask.style
    cs.posLeft = x
    cs.posTop  = y
  }
}
    }

   ,moveBy: function (x, y, event) {
SA_top_window.moveByAbsolute(x,y)
    }

   ,update_tray: function (para) {
try {
if (!webkit_electron_mode || (IPC.active_window != self))
  return

if (this._tray_last_updated == RAF_timestamp) {
  return
}
this._tray_last_updated = RAF_timestamp

if (!para) {
  para = {
    active_window_id: IPC.active_window_id
   ,click_thru: top.returnBoolean("IgnoreMouseEvents")
   ,click_thru_partial: top.returnBoolean("IgnoreMouseEventsPartial")
   ,always_on_top: top.returnBoolean("AutoItAlwaysOnTop")
   ,stay_on_desktop: top.returnBoolean("AutoItStayOnDesktop")
   ,auto_pause: top.returnBoolean("AutoItAutoPause")
   ,opacity: ((is_SA_child_animation) ? parent.SA_child_animation[SA_child_animation_id].opacity : parseFloat(System.Gadget.Settings.readString("Opacity") || 1))
   ,opacity_on_hover: parseFloat(System.Gadget.Settings.readString("OpacityOnHover") || 1)
   ,size: (Settings.CSSTransformFullscreen) ? -1 : Settings.CSSTransformScale
   ,animation_path: Settings.f_path_folder
   ,media_control: self.SL && SL._mouse_event_main && SL._mouse_event_main()
   ,MMD: null
   ,Facebook: { enabled:!!self.use_Facebook_API }
  }

  var w_list = [true]
  for (var i = 0; i < SA_child_animation_max; i++)
    w_list.push(!!top.SA_child_animation[i])
  para.active_window = w_list

  para.lock_child_dragging = returnBoolean("ChildDragDisabled")

  var tray_menu_custom = this.tray_menu_custom
  if (tray_menu_custom) {
    para.custom_menu_para = tray_menu_custom.para
    tray_menu_custom.update_tray && tray_menu_custom.update_tray(para)
  }
  else {
    para.custom_menu_para = {}
  }

  if (self.MMD_SA && MMD_SA._tray_updatable) {
    var MME = MMD_SA_options.MME
    var _MMD = para.MMD = {
  use_webgl2: !!MMD_SA.use_webgl2
 ,look_at_camera: !!MMD_SA_options._look_at_screen
 ,look_at_mouse:  !!MMD_SA_options._look_at_mouse
 ,trackball_camera: !!returnBoolean("MMDTrackballCamera")
 ,random_camera: !!returnBoolean("MMDRandomCamera")
 ,random_camera_available: !!MMD_SA_options.use_random_camera
 ,override_default_for_external_model: !!returnBoolean("MMDOverrideDefaultForExternalModel")

 ,light: {}

 ,MME: {
    self_overlay: {}
   ,HDR: {}
   ,serious_shader: {}
   ,SAO: {}

   ,PostProcessingEffects: {}
  }
    };

//    if (MMD_SA._material_list)
    _MMD._material_list = MMD_SA._material_list || []

    if (MMD_SA._model_list) {
      _MMD._model_list = MMD_SA._model_list
      MMD_SA._model_list = null
    }

    var light = jThree( "#MMD_DirLight" ).three( 0 )
    var light_color = light.color
    _MMD.light.color = [Math.min(255, parseInt(light_color.r*256)), Math.min(255, parseInt(light_color.g*256)), Math.min(255, parseInt(light_color.b*256))]
    _MMD.light.position = light.position.clone().sub((MMD_SA_options.MMD_disabled && {x:0,y:0,z:0}) || THREE.MMD.getModels()[0].mesh.position).multiplyScalar(1/MMD_SA_options.light_position_scale).toArray()

    _MMD.shadow_darkness = MMD_SA_options.shadow_darkness

    Object.assign(_MMD.MME.self_overlay, MME.self_overlay)
    Object.assign(_MMD.MME.HDR, MME.HDR)
    Object.assign(_MMD.MME.serious_shader, MME.serious_shader)
    Object.assign(_MMD.MME.SAO, MME.SAO)

    var PPE = MMD_SA_options.MME.PostProcessingEffects
    var _PPE = _MMD.MME.PostProcessingEffects
    _PPE.enabled = returnBoolean("Use3DPPE") || !!((MMD_SA_options.PPE_disabled_on_idle) ? MMD_SA_options._PPE_enabled : PPE.enabled)
    _PPE.use_SAO = !!PPE.use_SAO
    _PPE.use_Diffusion = !!PPE.use_Diffusion
    _PPE.use_BloomPostProcess = !!PPE.use_BloomPostProcess
    _PPE.use_BloomPostProcess_blur_size = parseFloat(System.Gadget.Settings.readString("Use3DBloomPostProcessBlurSize") ||0.5)
    _PPE.use_BloomPostProcess_threshold = parseFloat(System.Gadget.Settings.readString("Use3DBloomPostProcessThreshold")||0.5)
    _PPE.use_BloomPostProcess_intensity = parseFloat(System.Gadget.Settings.readString("Use3DBloomPostProcessIntensity")||0.5)

    _MMD.MME_saved = !!MMD_SA_options.MME_saved[MMD_SA_options.model_para_obj._filename]
  }

  if (!document.getElementById("Lchild_animation_parent"))
    para.apply_to_child = null
  else
    para.apply_to_child = returnBoolean("CSSTransformToChildAnimation")
}
//console.log(para)
webkit_electron_remote.getGlobal("update_tray")(para);
} catch (err) { console.error(err) }
    }

   ,load_file: function (url, callback, responseType) {
if (!responseType)
  responseType = "blob"

var preload = !(self.MMD_SA && MMD_SA.fn)
if (preload)
  MMD_SA_options.load_length_extra = (MMD_SA_options.load_length_extra || 0) + 1;

var xhr_init
if (/\.zip\#/i.test(url) || (responseType != "blob") || (typeof callback == "function")) {
  xhr_init = function () {
var xhr = new XMLHttpRequestZIP;
xhr.onload = function () {
  if (preload) {
    MMD_SA.fn.setupUI()
  }

  if (typeof callback == "function") {
    callback(xhr)
  }
  else {
// blob assumed
    callback.src = URL.createObjectURL(this.response)
  }

  xhr = undefined
};
xhr.open("GET", toFileProtocol(url), true);
xhr.responseType = responseType;
xhr.send();
  };
}
else {
  xhr_init = function () {
if (preload) {
  var onload = function () {
    MMD_SA.fn.setupUI()
    callback.removeEventListener("load", onload)
  };
  callback.addEventListener("load", onload);
}

callback.src = toFileProtocol(url)
  };
}

if (!self.XMLHttpRequestZIP) {
  window.addEventListener("jThree_ready", function () {
    xhr_init()
  });
}
else {
  xhr_init()
}
    }

   ,on_animation_update: (function () {
var events = [[], []];
var count = 0

return {
  add: function (func, frame_delay, phase, loop) {
    events[phase].push({ func:func, frame_count:frame_delay+phase, loop:loop, index:count++ })
  }

 ,remove: function (func, phase) {
    events[phase].filter(e => (e.func == func)).forEach(e => { e.canceled=true });
  }

 ,run: function (phase) {
    var e_index_list = []
    var ep = events[phase]
    if (!ep.length)
      return

    var ep_new = []
    ep.forEach(function (e) {
      if (e.canceled) return;

      if (--e.frame_count >= 0) {
        ep_new.push(e)
      }
      else {
        e.func()
        if (e.loop && (--e.loop != 0))
          ep_new.push(e)
      }
    });

    events[phase] = ep_new;
  }
};
    })()

   ,get css_scale() {
return ((window.devicePixelRatio >= 2) ? 0.5 : 1)
    }

   ,virtual_numpad_toggle: function (visible) {
if (visible == null)
  visible = (Lnumpad_row0.style.display == "none")
Lnumpad_row0.style.display = (visible) ? "inline" : "none";
Lnumpad_rows.style.display = (visible) ? "block"  : "none";
if (visible && self.ChatboxAT)
  ChatboxAT.chatW_minimize(0, true)
    }

   ,virtual_numpad: (function () {
      var key_objs = {}

      return function (ev, e_type) {
ev.preventDefault()
ev.stopPropagation()

var combat_mode = MMD_SA_options.Dungeon && MMD_SA_options.Dungeon.character.combat_mode;

var key = ev.target.textContent
var key_obj = key_objs[key] = key_objs[key] || {}
var keyCode, shiftKey
switch (key) {
  case "S":
    keyCode = 16
    key_obj.pressed = !key_obj.pressed
    e_type = (key_obj.pressed) ? "keydown" : "keyup"
    break
  case "+":
    keyCode = 107
    if (combat_mode) {
      if (e_type == "keyup")
        return
      key_obj.pressed = !key_obj.pressed
      e_type = (key_obj.pressed) ? "keydown" : "keyup"
    }
    break
  case "-":
    keyCode = 109
    break
  case "*":
    keyCode = 106
    break
  case "/":
    keyCode = 111
    break
  case "⏎":
    keyCode = 13
    break
  case "J":
    keyCode = 32
    break
  case "↑":
    keyCode = 38
    break
  case "↓":
    keyCode = 40
    break
  case "←":
    keyCode = 37
    break
  case "→":
    keyCode = 39
    break
  default:
    keyCode = parseInt(key) + 96
}

if (key_obj.timeoutID)  clearTimeout(key_obj.timeoutID)
if (key_obj.intervalID) clearTimeout(key_obj.intervalID)
key_obj.timeoutID = key_obj.intervalID = null

let e = new KeyboardEvent(e_type, {bubbles:true, cancelable:true, key:key, keyCode:keyCode, shiftKey:(key_objs["S"] && key_objs["S"].pressed)});
document.dispatchEvent(e);
if (e_type == "keydown") {
  if (/[\+S]/.test(key) && ((key != "+") || combat_mode)) {
    ev.target.style.opacity = "0.75"
  }
  else {
    key_obj.timeoutID = setTimeout(function () {
      key_obj.intervalID = setInterval(function () {
        document.dispatchEvent(e);
      }, 100);
    }, 400);
  }
}
else {
  ev.target.style.opacity = ""
}
      };
    })()

   ,P2P_network: (function () {
var peer_default;
var peer_count = 0;

var peer_para_default = {
  events: {
    peer: {
    }
   ,connection: {
      handshake_request: function (peer, connection) {
        console.log("P2P_network: Remote Peer" + "(" + connection.peer + "/" + connection.label + "/host) responding handshake request from Peer-" + peer.index + "(" + peer.id + ")")
        connection.send({ handshake:{ request:true } })
      }
     ,handshake_respond: function (peer, connection, handshake) {
        if (handshake.request) {
// accept or reject
          connection.status = "connected"
          console.log("P2P_network: Remote Peer" + "(" + connection.peer + "/" + connection.label + "/client)'s handshake request accepted from Peer-" + peer.index + "(" + peer.id + ")")
          connection.send({ handshake:{ accepted:true } })
        }
        else if (handshake.accepted) {
          connection.status = "connected"
          console.log("P2P_network: Remote Peer" + "(" + connection.peer + "/" + connection.label + "/host) accepted handshake request from Peer-" + peer.index + "(" + peer.id + ")")
// resolve() from Peer.connect's Promise
          if (peer.para.events.connection.handshake_request_accecpted && peer.para.events.connection.handshake_request_accecpted[connection.label]) {
            peer.para.events.connection.handshake_request_accecpted[connection.label]({peer, connection, handshake})
            delete peer.para.events.connection.handshake_request_accecpted[connection.label]
          }
        }
        else {
          console.log("P2P_network: Remote Peer" + "(" + connection.peer + "/" + connection.label + "/host) rejected handshake request from Peer-" + peer.index + "(" + peer.id + ")")
// reject() from Peer.connect's Promise
          if (peer.para.events.connection.handshake_request_rejected && peer.para.events.connection.handshake_request_rejected[connection.label]) {
            peer.para.events.connection.handshake_request_rejected[connection.label]({peer, connection, handshake})
            delete peer.para.events.connection.handshake_request_rejected[connection.label]
          }
        }
      }
     ,data: function (peer, connection, data) {
      }
    }
   ,send_message: function (para) {
      if (!para.command)
        net.content_window.ChatboxAT.ChatShow([para.name + ": " + para.msg])
      return null
    }
  }
};

function P2P_Connection(peer, connection) {
  this._connection = connection
  this.status = "connecting"

  peer.connections[connection.label] = this

  var that = this
  connection.on("data", function (data) {
//console.log(data)
    if (data.handshake) {
      peer.para.events.connection.handshake_respond(peer, that, data.handshake)
    }
    else {
      peer.para.events.connection.data(peer, that, data)
    }
  });
  connection.on("close", function (data) {
    console.log("P2P_network: DataConnection" + "(" + connection.peer + "/" + connection.label + "/host) closed")
    that.close(peer)
  });
}

P2P_Connection.prototype.send = function (data) {
  this._connection.send(data)
};

P2P_Connection.prototype.close = function (peer) {
  if (!peer.connections[this.label])
    return
  if (peer.para.events.connection.close && peer.para.events.connection.close(peer, this))
    return

  delete peer.connections[this.label]

  var that = this
  setTimeout(function () {
    that._connection.close()
    that._connection = null
  }, 1000);
};

Object.defineProperty(P2P_Connection.prototype, "peer", {
  get: function () {
    return this._connection.peer
  }
});

Object.defineProperty(P2P_Connection.prototype, "label", {
  get: function () {
    return this._connection.label
  }
});

function P2P_Peer_connections() {}

Object.defineProperty(P2P_Peer_connections.prototype, "length", {
// enumerable should be false by default
  get: function () {
    return Object.keys(this).length
  }
});


function P2P_Peer(para=Object.clone(peer_para_default)) {
  this.para = para
  this.id = null

  var _peer = this._peer = new Peer()//null, { host:"9000-fef19c29-a0dd-482d-a2e3-4a858e350891.ws-us02.gitpod.io" })
  this.index = peer_count

  this.connections = new P2P_Peer_connections()

  this.status = "connecting"

  var that = this
  _peer.on("open", function (id) {
    peer_count++
    if (!peer_default)
      peer_default = that
    that.id = id
    that.status = "connected"
    console.log("P2P_network: Peer-" + that.index + "(" + id + ") connected")
    that.para.events.peer.open && that.para.events.peer.open(that)
  });
  _peer.on("error", function (err) {
    console.log("P2P_network: Peer-" + that.index + " error", err)
    if (that.para.events.peer.error_by_connection) {
      that.para.events.peer.error_by_connection(err)
      delete that.para.events.peer.error_by_connection
    }
    else
      that.para.events.peer.error && that.para.events.peer.error(that, err)
  });
  _peer.on("connection", function (connection) {
    if (para.events.peer.connection && para.events.peer.connection(that, connection))
      return
    console.log("P2P_network: Remote Peer" + "(" + connection.peer + "/" + connection.label + "/client) connecting to Peer-" + that.index + "(" + that.id + ")")
    connection.on("open", function () {
      console.log("P2P_network: Remote Peer" + "(" + connection.peer + "/" + connection.label + "/client) connected to Peer-" + that.index + "(" + that.id + ")")
      new P2P_Connection(that, connection)
    });
  });
}

P2P_Peer.prototype.connect = function (id, options) {
  var that = this
  return new Promise(function (resolve, reject) {
    var on_peer_connect = function () {
// serialization:"json" required to have cross-frame support
      var connect_options = { serialization:"json" }
      var connection = that._peer.connect(id, connect_options)

      connection.on("open", function () {
        console.log("P2P_network: Remote Peer" + "(" + connection.peer + "/" + connection.label + "/host) connecting to Peer-" + that.index + "(" + that.id + ")")
        var connection_obj = new P2P_Connection(that, connection)
        that.para.events.connection.handshake_request(that, connection_obj)

        that.para.events.connection.handshake_request_accecpted = that.para.events.connection.handshake_request_accecpted || {}
        that.para.events.connection.handshake_request_rejected  = that.para.events.connection.handshake_request_rejected  || {}
// NOTE: resolve/reject can only take 1 parameter
        that.para.events.connection.handshake_request_accecpted[connection.label] = resolve;
        that.para.events.connection.handshake_request_rejected[connection.label]  = reject;

        delete that.para.events.peer.error_by_connection
      });
      connection.on("error", function (err) {
        console.log("P2P_network: Remote connection failed", err)
        reject(err)
      });

// one-time
      that.para.events.peer.error_by_connection = reject;
    };
    switch (that.status) {
      case "connected":
        on_peer_connect()
        break
      default:
        setTimeout(function () { reject(that); }, 0)
    }
  });
};

var net = {
  peer: P2P_Peer
 ,get peer_default() { return peer_default; }

 ,status: "off"

 ,get content_window() {
return (is_SA_child_animation_host) ? document.getElementById("Ichild_animation0").contentWindow : self
  }

 ,process_message: function (msg, is_auto) {
var peer = this.peer_default
if (!peer)
  return msg

var id = this.content_window.document.getElementById("Flogin").id.value
var pass = this.content_window.document.getElementById("Flogin").pass.value
var options = this.content_window.MMD_SA_options
var name = (id || (options && options.model_para_obj.character && options.model_para_obj.character.name) || "Anonymous").substring(0, 16)

var online = peer && peer.connections.length
var return_value
if (!/^\//.test(msg)) {
  return_value = peer.para.events.send_message({ name:name, msg:msg, id:id, pass:pass })
}
else {
  var command, para1, para2
  var obj = this.content_window.ChatboxAT.checkChatCommand(msg)
  command = obj.command
  para1 = obj.para1
  para2 = obj.para2

  return_value = peer.para.events.send_message({ name:name, msg:msg, command:command, para1:para1, para2:para2, id:id, pass:pass })
}

if (!is_auto)
  this.content_window.document.getElementById("Fchat").msg.value = ""

if (return_value != null)
  return return_value
return msg
  }
};

return net;
    })()

   ,camera: (function () {
      var camera
      var face_detection, fd_worker
      var _bodyPix
      var _facemesh, fm_worker
      var snapshot

      var frame_delta_threshold = 1000/30
      var frame_delta = frame_delta_threshold
      function update_video_canvas() {
// skip frame if necessary (fps target:30)
frame_delta += RAF_timestamp_delta
if (_bodyPix.busy || ((RAF_animation_frame_unlimited && !MMD_SA.WebXR.session) && (frame_delta < frame_delta_threshold))) {
  return
}
frame_delta -= frame_delta_threshold

var video = camera.video
if (!video.videoWidth)
  return

var video_canvas = camera.video_canvas
var context = video_canvas.getContext("2d")

var DPR = window.devicePixelRatio / camera.target_devicePixelRatio
var w = window.innerWidth  * DPR
var h = window.innerHeight * DPR
if ((video_canvas.width != w) || (video_canvas.height != h)) {
  video_canvas.width  = w
  video_canvas.height = h
  video_canvas.style.width  = window.innerWidth  + "px"
  video_canvas.style.height = window.innerHeight + "px"

  context.globalCompositeOperation = 'copy'
  context.translate(w, 0)
  context.scale(-1, 1)
}

//context.save()
if ((w == video.videoWidth) && (h == video.videoHeight)) {
  context.drawImage(video, 0,0)
}
else {
  let ar = w/h
  let ar_video = video.videoWidth/video.videoHeight
  let xx, yy, ww, hh
  if (ar <= ar_video) {
    ww = video.videoHeight * ar
    xx = (video.videoWidth - ww) / 2
    hh = video.videoHeight
    yy = 0
  }
  else {
    ww = video.videoWidth
    xx = 0
    hh = video.videoWidth / ar
    yy = (video.videoHeight - hh) / 2
  }
  context.drawImage(video, xx,yy,ww,hh, 0,0,w,h)
}
//context.restore()

video_canvas.style.visibility = (!camera.visible || _bodyPix.enabled || (face_detection.initialized && face_detection.worker_initialized && !face_detection.dets)) ? "hidden" : "visible";
      }

      function video_capture() {
if (_bodyPix.enabled) {
  _bodyPix.update_frame()
}
else {
  if (_facemesh.enabled) {
    _facemesh.update_frame()
  }
  else if (face_detection.enabled) {
    face_detection.update_frame()
  }
}
      }

      var video_capture_active
      function add_video_capture() {
if (!video_capture_active && camera.initialized) {
  video_capture_active = true
  frame_delta = frame_delta_threshold
  System._browser.on_animation_update.add(update_video_canvas,0,0,-1)
  System._browser.on_animation_update.add(video_capture,2,1,-1)
}
      }

      function remove_video_capture() {
if (video_capture_active && (!camera.visible && !_facemesh.enabled)) {
  video_capture_active = false
  frame_delta = frame_delta_threshold
  System._browser.on_animation_update.remove(update_video_canvas,0)
  System._browser.on_animation_update.remove(video_capture,1)
}
      }

      var video_brightness = 100
      function adjust_video_brightness(e) {
if (!camera.visible)
  return

var keyCode = e.detail.keyCode
if (keyCode == 107)
  video_brightness += 10
else if (keyCode == 109)
  video_brightness -= 10
else
  return

video_brightness = Math.max(Math.min(video_brightness,180),20)

var context = camera.video_canvas.getContext("2d")
if (video_brightness == 1) {
  context.filter = "none"
  DEBUG_show("Brightness:100%", 2)
}
else {
  context.filter = "brightness(" + (video_brightness) + "%) contrast(" + (100+(video_brightness-100)*0.25) + "%)"
  DEBUG_show("Brightness:" + (video_brightness) + "%", 2)
}

e.detail.result.return_value = true
      }

      var target_devicePixelRatio = 0
      camera = {
  initialized: false

 ,get target_devicePixelRatio() {
return target_devicePixelRatio || window.devicePixelRatio;
  }
 ,set target_devicePixelRatio(v) {
target_devicePixelRatio = v
  }

 ,start: function () {
var AR_options = MMD_SA_options.WebXR && MMD_SA_options.WebXR.AR

if (this.initialized) {
  if (this.visible)
    this.hide()
  else
    this.show()
  DEBUG_show("User camera:" + ((this.visible && "VISIBLE") || "HIDDEN"), 2)
  return
}

/*aspectRatio:1.777777778*/
var constraints = { video:this.set_constraints() }
constraints.video.facingMode = "user"

navigator.mediaDevices.getUserMedia(constraints).then(function (stream) {
  camera.init_stream(stream)

  if (AR_options && AR_options.dom_overlay)
    AR_options.dom_overlay.use_dummy_webgl = true

  DEBUG_show("(User camera:ON)", 2)
}).catch(function (err) {
  camera.init_stream()

  camera.video.loop = true
  camera.video.src = (webkit_electron_mode) ? toFileProtocol("C:\\Users\\user\\Documents\\_.mp4") : "js/headtrackr.mp4"//"js/headtrackr.mp4"//

  DEBUG_show("(ERROR: Camera unavailable, using fallback video instead)", 3)
});
  }

 ,init_stream: function (stream) {
if (!this.video) {
  this.video = document.createElement("video")
//  this.video.playsinline = true
  this.video.autoplay = true

  let vs
  this.video_canvas = document.createElement("canvas")
  vs = this.video_canvas.style
  vs.position = "absolute"
  vs.left = "0px"
  vs.top = "0px"
  vs.zIndex = 0
  vs.visibility = "hidden"
  SL_Host.appendChild(this.video_canvas)

  this.video_canvas_bodyPix = document.createElement("canvas")
  vs = this.video_canvas_bodyPix.style
  vs.position = "absolute"
  vs.left = "0px"
  vs.top = "0px"
  vs.zIndex = 0
  vs.visibility = "hidden"
  SL_Host.appendChild(this.video_canvas_bodyPix)

  this.video_canvas_face_detection = document.createElement("canvas")
  vs = this.video_canvas_face_detection.style
  vs.position = "absolute"
  vs.left = "0px"
  vs.top = "0px"
  vs.zIndex = 0
  vs.visibility = "hidden"
  SL_Host.appendChild(this.video_canvas_face_detection)

  this.video_canvas_facemesh = document.createElement("canvas")
  vs = this.video_canvas_facemesh.style
  vs.position = "absolute"
  vs.left = "0px"
  vs.top = "0px"
  vs.zIndex = 0
  vs.visibility = "hidden"
  SL_Host.appendChild(this.video_canvas_facemesh)
}

this.initialized = true
this.show()

if (!stream) {
  return
}

this.stream = stream
this.video_track = stream.getVideoTracks()[0]
this.video.srcObject = stream

setTimeout(function () {
  let capabilities = camera.video_track.getCapabilities()
  System._browser.console.log(Object.entries(capabilities).map(s=>s[0]+':'+JSON.stringify(s[1])).join('\n'));

  let settings = camera.video_track.getSettings()
  System._browser.console.log(Object.entries(settings).map(s=>s[0]+':'+JSON.stringify(s[1])).join('\n'));
/*
  if (capabilities.iso && settings.iso) {
    camera.video_track.applyConstraints(camera.set_constraints({ iso:200 })).then(function () {
      DEBUG_show("(camera settings updated)", 2)

      settings = camera.video_track.getSettings()
      System._browser.console.log(Object.entries(settings).map(s=>s[0]+':'+JSON.stringify(s[1])).join('\n'));
    }).catch(function (err) {
      DEBUG_show("ERROR:camera settings failed to update")
    });
  }
*/
}, 2000);
/*
this.imageCapture = new ImageCapture(this.video_track)
this.imageCapture.getPhotoCapabilities().then(function (capabilities) {
  System._browser.console.log('PhotoCapabilities:\nimageHeight:'+[capabilities.imageHeight.min,capabilities.imageHeight.max,capabilities.imageHeight.step].join(',')+'\nimageWidth:'+[capabilities.imageWidth.min,capabilities.imageWidth.max,capabilities.imageWidth.step].join(','));
});
*/

window.addEventListener("resize", function () {
  camera.video_track.applyConstraints(camera.set_constraints()).then(function () {
    DEBUG_show("(camera size updated)", 2)
  }).catch(function (err) {
    DEBUG_show("ERROR:camera size failed to update")
  });
});
  }

// https://github.com/tensorflow/tfjs-models/tree/master/body-pix
 ,bodyPix: (function () {
    var net;
    var enabled = false;

    _bodyPix = {
  get enabled() {
return enabled;
  }
 ,set enabled(v) {
if (enabled == !!v)
  return
enabled = !!v

if (enabled) {
  MMD_SA._renderer.devicePixelRatio = 1
  MMD_SA._renderer.__resize(EV_width, EV_height)
  SL.style.visibility = "hidden"
}
else {
  MMD_SA._renderer.devicePixelRatio = window.devicePixelRatio
  MMD_SA._renderer.__resize(EV_width, EV_height)
  SL.style.visibility = "visible"
  camera.video_canvas_bodyPix.style.visibility = "hidden"
}
  }

 ,busy: false
 ,mask: null
 ,allPoses: null

 ,load: async function (options) {
this.enabled = true

if (net) return;

if (!this.mask) {
  this.mask = document.createElement("canvas")

  face_detection.load_face_cover()
}

net = await bodyPix.load(options || {
  architecture: 'MobileNetV1',
//internalResolution:"low",
  outputStride: 16,
  multiplier: 0.5,
  quantBytes: 2//1//
});

console.log("bodyPix loaded");
  }

 ,segmentPerson: async function (image, options) {
await this.load();

return await net.segmentPerson(image, options || {
  flipHorizontal: false,
  internalResolution: 'medium',
  segmentationThreshold: 0.7
});
  }

 ,toMask: async function (image, options_seg, options) {
const seg = await this.segmentPerson(image, options_seg);
if (!this._TEST) { this._TEST=true; console.log(seg); }

this.allPoses = seg.allPoses;

options = options || { foregroundColor:{r: 0, g: 0, b: 0, a: 255}, backgroundColor:{r: 0, g: 0, b: 0, a: 0} };
return bodyPix.toMask(seg, options.foregroundColor, options.backgroundColor);
  }

 ,update_frame: async function (image=camera.video_canvas, options_seg, options_mask, options_draw) {
if (snapshot.check_status()) {
  camera.video_canvas.style.visibility = "visible"
  camera.video_canvas_bodyPix.style.visibility = "hidden"
  SL.style.visibility = "visible"
  return
}

if (this.busy)
  return
this.busy = true

const mask = await this.toMask(image, options_seg, options_mask)
//console.log(mask)

this.busy = false
if (!this.enabled)
  return
//SL.style.visibility="visible";return;
if ((this.mask.width != mask.width) || (this.mask.height != mask.height)) {
  this.mask.width  = mask.width
  this.mask.height = mask.height
}
this.mask.getContext("2d").putImageData(mask, 0,0);

if ((camera.video_canvas_bodyPix.width != mask.width) || (camera.video_canvas_bodyPix.height != mask.height)) {
  camera.video_canvas_bodyPix.width  = mask.width
  camera.video_canvas_bodyPix.height = mask.height
  camera.video_canvas_bodyPix.style.width  = window.innerWidth  + "px"
  camera.video_canvas_bodyPix.style.height = window.innerHeight + "px"
}

let context = camera.video_canvas_bodyPix.getContext("2d")
context.globalCompositeOperation = "copy"
context.filter = "blur(" + Math.ceil(3/window.devicePixelRatio) + "px)"
context.drawImage(this.mask, 0,0)

context.globalCompositeOperation = "source-out"
context.filter = "none"
context.save()
context.translate(mask.width, 0)
context.scale(-1, 1)
context.drawImage(SL, 0,0)//,Math.min(mask.width,SL.width),Math.min(mask.height,SL.height), 0,0,mask.width,mask.height)
context.restore()

context.globalCompositeOperation = "destination-over"
context.drawImage(image, 0,0)

camera.video_canvas_bodyPix.style.visibility = "visible"
SL.style.visibility = "hidden"

//options_draw.canvas.style.visibility = "visible"
//bodyPix.drawMask(options_draw.canvas, options_draw.img||image, mask, options_draw.opacity||1, options_draw.maskBlurAmount||3, options_draw.flipHorizontal);

this.update_frame_for_face_detection()

snapshot.check_status()
  }

 ,update_frame_for_face_detection: function () {
let face_cover = face_detection.face_cover
if ((!face_detection.enabled) || !face_cover.complete)
  return

camera.video_canvas_face_detection.style.visibility = "hidden"

let cw = face_cover.width
let ch = face_cover.height

let dets = [];
this.allPoses.forEach(function (pose) {
  let keypoints = pose.keypoints;
  let nose = keypoints.find(kp=>kp.part=="nose");
  if (!nose)
    return

  let leftEye  = keypoints.find(kp=>kp.part=="leftEye");
  let rightEye = keypoints.find(kp=>kp.part=="rightEye");
  let dim;
  if (leftEye && rightEye) {
    let x_diff = leftEye.position.x - rightEye.position.x
    let y_diff = leftEye.position.y - rightEye.position.y
    dim = Math.sqrt(x_diff*x_diff + y_diff*y_diff) * 4
  }
  else {
    dim = ch
  }
  dets.push([nose.position.y, nose.position.x, Math.max(dim, ch/2), 100])
});
this.allPoses = undefined;

face_detection.update_frame_local(camera.video_canvas_bodyPix, dets);
  }
    };

    return _bodyPix;
  })()

 ,face_detection: (function () {
    var enabled = false;

    function init() {
face_detection.initialized = true

if (!self.OffscreenCanvas)
  face_detection.load_face_cover()

fd_worker = new Worker("js/pico.worker.js");

fd_worker.onmessage = function (e) {
  var data = ((typeof e.data == "string") && (e.data.charAt(0) === "{")) ? JSON.parse(e.data) : e.data;

  if (typeof data === "string") {
DEBUG_show(data, 2)
    face_detection.worker_initialized = true
    face_detection.enabled = true
  }
  else {
//DEBUG_show(Date.now()+":"+data.dets.length)
    if (data._t) DEBUG_show(data._t)
    face_detection.dets = data.dets
    face_detection.busy = false
    if (!self.OffscreenCanvas) {
      System._browser.on_animation_update.add(function() {
face_detection.update_frame_local(null, face_detection.dets)
      },0,0);
    }
  }
};
    }

    face_detection = {
      initialized: false
     ,worker_initialized: false

     ,get enabled() {
return enabled;
      }
     ,set enabled(v) {
if (enabled == !!v)
  return
enabled = !!v

if (enabled) {
// a trick to let the camera know that no face has been detected yet
  this.dets = null

  if (!this.initialized)
    init()
  else if (!this.worker_initialized)
    return
}
else {
  if (camera.initialized)
    camera.video_canvas_face_detection.style.visibility = "hidden"
}
      }

     ,load_face_cover: function () {
if (!this.face_cover) {
  this.face_cover = new Image()
  this.face_cover.src = "images/laughing_man_134x120.png"
}
      }

     ,dets: null

     ,update_frame:  function () {
if (!this.enabled || !this.worker_initialized || this.busy)
  return
this.busy = true

camera.video_canvas_face_detection.style.visibility = "visible"

let video_canvas = camera.video_canvas
let w = video_canvas.width
let h = video_canvas.height
let rgba = video_canvas.getContext("2d").getImageData(0,0,w,h).data.buffer;

let cs = camera.video_canvas_face_detection.style
if ((cs.width != video_canvas.style.width) || (cs.height != video_canvas.style.height)) {
  cs.width  = video_canvas.style.width
  cs.height = video_canvas.style.height
}

let data = { rgba:rgba, w:w, h:h };//, threshold:1 };
if (!camera.video_canvas_face_detection._offscreen && self.OffscreenCanvas) {
  data.canvas = camera.video_canvas_face_detection.transferControlToOffscreen()
  camera.video_canvas_face_detection._offscreen = true
  console.log("(Face detection: use offscreen canvas)")
}
fd_worker.postMessage(data, (data.canvas)?[data.canvas,data.rgba]:[data.rgba]);

data.rgba = rgba = undefined
data = undefined
      }

     ,update_frame_local: function (canvas, dets) {
let ww = camera.video_canvas.width
let hh = camera.video_canvas.height
let context
if (!canvas) {
  canvas = camera.video_canvas_face_detection
  if ((canvas.width != ww) || (canvas.height != hh)) {
    canvas.width  = ww
    canvas.height = hh
  }
  context = canvas.getContext("2d")
  context.clearRect(0,0,ww,hh)
}
else {
  context = canvas.getContext("2d")
}

context.globalCompositeOperation = "source-over"

let face_cover = this.face_cover
let cw = face_cover.width
let ch = face_cover.height

let h,w,x,y;
if (dets.length) {
  let scale = 1
  dets.forEach(function (det) {
    h = det[2] * scale
    w = h * cw/ch
    x = det[1] * scale - w/2
    y = det[0] * scale - h/2
    context.drawImage(face_cover, 0,0,cw,ch, x,y,w,h)
  });
}
else {
  h = Math.min(ww,hh)
  w = h * cw/ch
  x = (ww - w)/2
  y = (hh - h)/2
  context.drawImage(face_cover, 0,0,cw,ch, x,y,w,h)
}
      }

    };
    return face_detection;
  })()

 ,facemesh: (function () {
    var enabled = false;

    var calibration_timestamp = 0
    var calibrating = true

    var lips_width_average = 0
    var lips_width_data = []

    var eyebrow_data
    var eye_data

    var blink_detection = false

    function reset_calibration() {
calibration_timestamp = 0
calibrating = true

lips_width_average = 0
lips_width_data = []

eyebrow_data = {};
eye_data = {L:[],R:[]};

var eye_data_height_ref_pts = {L:[159,145], R:[386,374]};
["L","R"].forEach(function (dir) {
  for (var i = 0; i < 4; i++) {
    let data = eye_data[dir][i] = {}
    data.index = i
    data._eye_open_average = 0
    data.eye_open_average = 0
    data.eye_open_lower = 999
    data.eye_open_data = []
    data.height_ref_pts = eye_data_height_ref_pts[dir]
  }

// L eyebrow height:334,374
// R eyebrow height:105,145

  eyebrow_data[dir] = {
    _height_average: 0
   ,height_average: 0
   ,height_data: []
// NOTE: video source assumed to be mirrored
   ,height_ref_pts: (dir=="R") ? [334,374] : [105,145]
  };
});
    }

    var auto_blink_default

    var _v3 = []

    var TRIANGULATION

    var use_faceLandmarksDetection = !is_mobile

    function init() {
_facemesh.initialized = true

/*
// non-worker Facemesh TEST
facemesh.load({maxFaces:1}).then(function (model) {
  _facemesh.model = model
  _facemesh.worker_initialized = true
  _facemesh.enabled = true
});
return;
*/

fetch("js/facemesh_triangulation.json").then(response => response.json()).then(data => {TRIANGULATION=data});

for (var i = 0; i < 4; i++)
  _v3[i] = new THREE.Vector3()

var params = []
if (System._browser.use_WASM_SIMD) {
  params.push('simd=1')
}
if (use_faceLandmarksDetection || System._browser.url_search_params['use_latest_facemesh']) {
  use_faceLandmarksDetection = true
  _facemesh.blink_detection = true
  params.push('use_latest_facemesh=1')
}

fm_worker = new Worker('js/facemesh_worker.js' + ((params.length)?'?'+params.join('&'):''));

fm_worker.onmessage = function (e) {
  var data = ((typeof e.data == "string") && (e.data.charAt(0) === "{")) ? JSON.parse(e.data) : e.data;

  if (typeof data === "string") {
    if (data == "OK") {
      _facemesh.worker_initialized = true
      _facemesh.enabled = true
    }
    else {
      DEBUG_show(data, 2)
      System._browser.console.log(data)
    }
  }
  else {
let info = ""
if (data.faces.length) {
  let face = data.faces[0]

// LR:234,454
  let x_diff = face.mesh[454][0] - face.mesh[234][0]
  let y_diff = face.mesh[454][1] - face.mesh[234][1]
  let z_diff = face.mesh[454][2] - face.mesh[234][2]
  let dis = MMD_SA.TEMP_v3.fromArray(face.mesh[234]).distanceTo(MMD_SA._v3a.fromArray(face.mesh[454]))

  let y_rot = -Math.atan2(z_diff, x_diff)
  let z_rot = Math.asin(y_diff / dis)

// TB:10,152
  let y_axis = MMD_SA.TEMP_v3.fromArray(face.mesh[152]).sub(MMD_SA._v3a.fromArray(face.mesh[10]))
  let rot = new THREE.Quaternion().setFromEuler(new THREE.Vector3().set(0,-y_rot,-z_rot),"XZY")
  let x_rot = MMD_SA._v3b.set(0,1,0).angleTo(y_axis.applyQuaternion(rot).setX(0).normalize()) * ((y_axis.z > 0) ? 1 : -1)

  let sign = (camera.visible) ? 1 : -1;
  rot.setFromEuler(MMD_SA._v3a.set(x_rot, y_rot*sign, z_rot*sign),"YZX")

  let head = { absolute:true, rot:rot }
  let neck = { absolute:true, rot:new THREE.Quaternion() }
  let chest = { rot:new THREE.Quaternion().slerp(rot,0.2) }

/*
if (camera.visible) {
  let c = camera.video_canvas_face_detection
  c.width  = camera.video_canvas.width
  c.height = camera.video_canvas.height
  c.style.visibility = "visible"
  let context = c.getContext("2d")

  for (let i = 0; i < 2; i++) {
    let _eye = face.eyes[i]
    if (_eye) {
      context.beginPath();
      context.arc(_eye[0], _eye[1], 1, 0, 2*Math.PI, false);
      context.lineWidth = 3;
      context.strokeStyle = 'red';
      context.stroke();
    }
  }
}
else {
  camera.video_canvas_face_detection.style.visibility = "hidden"
}
*/
  _facemesh.frames.t_delta = data._t

  _facemesh.frames.add("skin", "頭", head)
  _facemesh.frames.add("skin", "首", neck)
  _facemesh.frames.add("skin", "上半身", chest)

// lips inner:13,14
// lips outer:0,17
// lips LR:61,291
// .faceInViewConfidence
  if (!calibration_timestamp)
    calibration_timestamp = Date.now()
  let calibration_percent = 0
  if (calibrating) {
    calibration_percent = ~~(Math.min((Date.now() - calibration_timestamp)/5000, lips_width_data.length/30, (blink_detection)?eye_data.L[0].eye_open_data.length/30:1, 1) * 100)
    calibrating = (calibration_percent < 100)
  }

  let calibration_condition = (face.faceInViewConfidence > 0.9) && (Math.abs(y_rot) < Math.PI/4);

  let lips_inner_height = MMD_SA._v3a.fromArray(face.mesh[13]).distanceTo(MMD_SA._v3b.fromArray(face.mesh[14]))
  let lips_width = MMD_SA._v3a.fromArray(face.mesh[61]).distanceTo(MMD_SA._v3b.fromArray(face.mesh[291]))

  let _lips_width_average = lips_width_average
  if (!_lips_width_average) {
    if (calibration_condition && (lips_inner_height < 2))
      lips_width_data.push(lips_width)
    if (!lips_width_data.length) {
      _lips_width_average = 0
    }
    else {
      let edge_size = parseInt(lips_width_data.length*0.3)
      _lips_width_average = lips_width_data.sort((a,b)=>a-b).slice(edge_size, lips_width_data.length-edge_size).reduce((accumulator, currentValue) => accumulator + currentValue) / (lips_width_data.length-edge_size*2)
      if (!calibrating) {
        lips_width_average = _lips_width_average
      }
    }
  }

  let mouth_open = 0;
  let mouth_wide = 0;
  let eyebrow_up = 0;
  let smile = 0;

  ["L","R"].forEach(function (dir) {
    let e = eyebrow_data[dir]
    e.height = MMD_SA._v3a.fromArray(face.mesh[e.height_ref_pts[0]]).distanceTo(MMD_SA._v3b.fromArray(face.mesh[e.height_ref_pts[1]]))

    e._height_average = e.height_average
    if (!e._height_average) {
      if (calibration_condition)
        e.height_data.push(e.height)
      if (!e.height_data.length) {
        e._height_average = e.height
      }
      else {
        let edge_size = parseInt(lips_width_data.length*0.3)
        e._height_average = e.height_data.sort((a,b)=>a-b).slice(edge_size, e.height_data.length-edge_size).reduce((accumulator, currentValue) => accumulator + currentValue) / (e.height_data.length-edge_size*2)
        if (!calibrating) {
          e.height_average = e._height_average
        }
      }
    }

    eyebrow_up += e.height/e._height_average
  });
  eyebrow_up /= 2
  eyebrow_up = Math.max(Math.min((eyebrow_up-1)/0.25*((eyebrow_up>1)?4:1), 1), -1)

  if (_lips_width_average) {
    if (lips_width > _lips_width_average*1.05) {
      mouth_wide = Math.sqrt(Math.min((lips_width-_lips_width_average*1.05) / (_lips_width_average*0.25), 1))
    }
    else if (lips_width < _lips_width_average*0.98) {
      mouth_wide = -Math.sqrt(Math.min((_lips_width_average*0.98-lips_width) / (_lips_width_average*0.2), 1))
    }
    if (lips_inner_height > 2) {
      mouth_open = Math.pow(Math.min((lips_inner_height-2) / (_lips_width_average*1/3), 1), 0.5)
      if (mouth_wide > 0.25)
        smile = (mouth_wide-0.25)/0.75 * 0.3
    }
  }

  _facemesh.frames.add("morph", "笑い", { weight:smile })
  _facemesh.frames.add("morph", "にこり", { weight:smile })

  _facemesh.frames.add("morph", "あ", { weight:mouth_open })
  _facemesh.frames.add("morph", "にやり", { weight:mouth_wide })

  _facemesh.frames.add("morph", "上", { weight:eyebrow_up })

  let rot_inv = MMD_SA.TEMP_q.setFromEuler(MMD_SA._v3a.set(x_rot,y_rot,z_rot),"YZX").conjugate()
  let L = [];
  [13,14,61,291].forEach(function(index, i){
    L[index] = _v3[i].fromArray(face.mesh[index]).applyQuaternion(rot_inv).setZ(0)
  });
  let L_center = MMD_SA._v3a.copy(L[61]).add(L[291]).multiplyScalar(0.5)
  let L_half = L[61].distanceTo(L[291])*0.5

  let m_up = Math.atan2(L[13].y-L_center.y, L_half)
  let m_down = Math.atan2(L[14].y-L_center.y, L_half)

  let mouth_up = Math.max(-(m_up+m_down)*180/Math.PI + 20*(mouth_open), 0)
  if (mouth_up)
    mouth_up = Math.min(mouth_up/20, 0.75)
  _facemesh.frames.add("morph", "∧", { weight:mouth_up })


  let blink = {L:[0],R:[0]}
  let _eye_data_order = {L:[],R:[]}

if (use_faceLandmarksDetection) {
  let _eye_x_rot = []
  let _eye_y_rot = []
  face.eyes.forEach(function (eye, i) {
    _eye_x_rot[i] = Math.max(Math.min((eye[3]*2+x_rot/(Math.PI/2))*(1-Math.abs(x_rot)/Math.PI),1),-1)
    _eye_y_rot[i] = Math.max(Math.min((eye[2]*2-y_rot/(Math.PI/2))*(1-Math.abs(y_rot)/Math.PI),1),-1)
  });

  ["L","R"].forEach(function (dir) {
    let i = 0

    blink[dir][i] = 0
    let LR = eye_data[dir][i]
    let e_data = MMD_SA._v3a.fromArray(face.mesh[LR.height_ref_pts[0]]).distanceTo(MMD_SA._v3b.fromArray(face.mesh[LR.height_ref_pts[1]]))

    let _eye_open_average = LR.eye_open_average
    if (!_eye_open_average) {
      if (calibration_condition) {
        LR.eye_open_data.push(e_data)

        let edge_size = parseInt(LR.eye_open_data.length*0.3)
        _eye_open_average = LR.eye_open_data.sort((a,b)=>a-b).slice(edge_size, LR.eye_open_data.length-edge_size).reduce((accumulator, currentValue) => accumulator + currentValue) / (LR.eye_open_data.length-edge_size*2)
        if (!calibrating) {
          LR.eye_open_average = _eye_open_average
        }
      }
      else {
        _eye_open_average = LR._eye_open_average
      }
    }
    if (calibration_condition) {
      if (LR.eye_open_lower > e_data)
        LR.eye_open_lower = e_data
    }

    LR._eye_open_average = _eye_open_average
    if (_eye_open_average) {
      if (e_data > _eye_open_average) {
        blink[dir][i] = Math.min(e_data/_eye_open_average, 1.25);
      }
      else {
        let _eye_open_lower = Math.min(LR.eye_open_lower,_eye_open_average/3);
        blink[dir][i] = Math.max((e_data-_eye_open_lower)/(_eye_open_average-_eye_open_lower), 0);
      }
    }
  });

  let rot_ratio = blink.L[0]+blink.R[0]
  if (rot_ratio)
    rot_ratio = blink.L[0]/rot_ratio
  else
    rot_ratio = 0.5
  let eye_x_rot = _eye_x_rot[0] * rot_ratio + _eye_x_rot[1] * (1-rot_ratio)
  let eye_y_rot = _eye_y_rot[0] * rot_ratio + _eye_y_rot[1] * (1-rot_ratio)
  let two_eyes = { absolute:true, rot:new THREE.Quaternion().setFromEuler(MMD_SA._v3a.set(-(eye_x_rot-0.3)*15/180*Math.PI, eye_y_rot*sign*20/180*Math.PI, 0),"YZX") }
  _facemesh.frames.add("skin", "両目", two_eyes)

  let LR_exists = (THREE.MMD.getModels()[0].pmx.morphs_index_by_name["まばたきL"] != null);
  let blink_factor = (LR_exists) ? Math.min(Math.max(Math.abs(blink.L[0]-blink.R[0])-(0.25+(1-Math.max((Math.PI/4-Math.abs(y_rot))/Math.PI/4,0))*0.75),0)/0.25, 1) : 0;
  let blink0 = Math.min(blink.L[0],blink.R[0])
  blink.L[0] = blink.L[0]*blink_factor + blink0*(1-blink_factor)
  blink.R[0] = blink.R[0]*blink_factor + blink0*(1-blink_factor)

  if (LR_exists) {
    _facemesh.frames.add("morph", "まばたきL", { weight:Math.max(Math.min(1-blink.L[0]*0.8-smile/2,1),0) })
    _facemesh.frames.add("morph", "まばたきR", { weight:Math.max(Math.min(1-blink.R[0]*0.8-smile/2,1),0) })
  }
  else {
    _facemesh.frames.add("morph", "まばたき", { weight:Math.max(Math.min(1-blink.L[0]*0.8-smile/2,1),0) })
  }
}
else {
  let eye = face.eyes[0]
  let eye_x_rot = 0
  let eye_y_rot = 0
  if (eye) {
    eye_x_rot = Math.max(Math.min((eye[3]*2+x_rot/(Math.PI/2))*(1-Math.abs(x_rot)/Math.PI),1),-1)
    eye_y_rot = Math.max(Math.min((eye[2]*2-y_rot/(Math.PI/2))*(1-Math.abs(y_rot)/Math.PI),1),-1)
  }

if (blink_detection) {
  face.eyes.forEach(function (e, idx) {
    let dir = e[4][0]
    for (let i = 0; i < 4; i++) {
      blink[dir][i] = 0
      let LR = eye_data[dir][i]
      let e_data = e[5][i]

      let _eye_open_average = LR.eye_open_average
      if (!_eye_open_average) {
        if (calibration_condition) {
          LR.eye_open_data.push(e_data)

          let edge_size = parseInt(LR.eye_open_data.length*0.3)
          _eye_open_average = LR.eye_open_data.sort((a,b)=>a-b).slice(edge_size, LR.eye_open_data.length-edge_size).reduce((accumulator, currentValue) => accumulator + currentValue) / (LR.eye_open_data.length-edge_size*2)
          if (!calibrating) {
            LR.eye_open_average = _eye_open_average
          }
        }
        else {
          _eye_open_average = LR._eye_open_average
        }
      }
      if (calibration_condition) {
        if (LR.eye_open_lower > e_data)
          LR.eye_open_lower = e_data
      }

      LR._eye_open_average = _eye_open_average
      if (_eye_open_average) {
        let b = e_data
        if (b < _eye_open_average*0.9) {
          let _eye_open_lower = Math.max(Math.min(LR.eye_open_lower, _eye_open_average*0.6), _eye_open_average*0.2)
          b = Math.min((_eye_open_average*0.9-b)/(_eye_open_lower+_eye_open_average*0),1)
          blink[dir][i] = b*b
        }
      }
    }

    let eye_data_qualified = eye_data[dir].filter(function (e) {
      if (!e._eye_open_average)
        return false
      if ((e._eye_open_average > 0.8) || (e._eye_open_average < 0.2))
        return false
      if ((e.eye_open_lower > e._eye_open_average*0.7)/* || (e.eye_open_lower < e._eye_open_average*0.1)*/)
        return false
      return true
    });

    let _blink = blink[dir]
    if (eye_data_qualified.length == 0) {
      _blink[0] = 0
    }
    else {
      eye_data_qualified.sort((a,b)=>_blink[b.index]-_blink[a.index]);
      let index = eye_data_qualified[0].index
      _eye_data_order[dir][0] = index
      let b = _blink[index]

      if (eye_data_qualified.length >= 2) {
        index = eye_data_qualified[1].index
        b = (b + _blink[index]) / 2
        _eye_data_order[dir].push(index)
      }

      _blink[0] = b
    }
  });

  let LR_exists = (THREE.MMD.getModels()[0].pmx.morphs_index_by_name["まばたきL"] != null)
  if (0) {//LR_exists && (Math.abs(blink.L[0] - blink.R[0]) > 0.75)) {
    let weight = (blink.L[0]+blink.R[0])/4
    _facemesh.frames.add("morph", "まばたきL", { weight:blink.L[0]/2+weight })
   _facemesh.frames.add("morph", "まばたきR", { weight:blink.R[0]/2+weight })
  }
  else {
    let weight = (blink.L[0]+blink.R[0])/2
    _facemesh.frames.add("morph", "まばたき", { weight:weight })
//    _facemesh.frames.add("morph", "まばたきL", { weight:weight })
//    _facemesh.frames.add("morph", "まばたきR", { weight:weight })
  }
}
else {
  let eyebrow_factor = eyebrow_up*0.25
  if (eyebrow_factor < 0)
    eyebrow_factor = Math.min(eyebrow_factor + smile, 0)
  let weight = Math.max(Math.min(0.1 - eye_x_rot*((eye_x_rot<0)?2:1)*0.2 - eyebrow_factor, 0.5), 0)
  _facemesh.frames.add("morph", "まばたき", { weight:weight })
}

  let eye_rot_confidence = 1.25 + Math.pow((blink.L[0]+blink.R[0])/2,2)*1.75
  eye_x_rot = Math.sign(eye_x_rot) * Math.pow(Math.abs(eye_x_rot), eye_rot_confidence)
  eye_y_rot = Math.sign(eye_y_rot) * Math.pow(Math.abs(eye_y_rot), eye_rot_confidence)
  let two_eyes = { absolute:true, rot:new THREE.Quaternion().setFromEuler(MMD_SA._v3a.set(-eye_x_rot*15/180*Math.PI, eye_y_rot*sign*20/180*Math.PI, 0),"YZX") }
  _facemesh.frames.add("skin", "両目", two_eyes)
}


info = info || (face.eyes.length && [((calibrating)?'Calibrating('+calibration_percent+'%):Make a calm face!':'(face data calibrated)'),/*eye_x_rot*100, eye_y_rot*100,*/(!blink_detection)?'auto blink':(_eye_data_order.L.length&&_eye_data_order.R.length)?_eye_data_order.L.join('+')+':'+~~(eye_data.L[_eye_data_order.L[0]]._eye_open_average*100)+'/'+~~(eye_data.L[_eye_data_order.L[0]].eye_open_lower*100)+'/'+_eye_data_order.R.join('+')+':'+~~(eye_data.R[_eye_data_order.R[0]]._eye_open_average*100)+'/'+~~(eye_data.R[_eye_data_order.R[0]].eye_open_lower*100):'(no blink data)'].join("\n"));
//((THREE.MMD.getModels()[0].pmx.morphs_index_by_name["まばたきL"]||0)+'/'+(THREE.MMD.getModels()[0].pmx.morphs_index_by_name["まばたきR"]||0))
//info = [(m_up)*180/Math.PI,(m_down)*180/Math.PI,mouth_up].join('\n')
//info = [y_rot*180/Math.PI, z_rot*180/Math.PI, x_rot*180/Math.PI, lips_inner_height,lips_width_average+'/'+lips_width].join('\n')
}
DEBUG_show(((info && (info+'\n'+'FPS:'+EV_sync_update.fps_last+'\n'))||'')+data._t)
self._faces_=data.faces
    _facemesh.busy = false

    if (data.faces.length && !self.OffscreenCanvas && TRIANGULATION) {
      System._browser.on_animation_update.add(function() {
draw_facemesh(data.faces, Math.round(camera.video_canvas.width/2),Math.round(camera.video_canvas.height/2))
      },0,0);
    }
  }
};
    }

    function process_bones(e) {
var mesh = e.detail.model.mesh

var skin = _facemesh.frames.skin
for (var name in skin) {
  let bone = mesh.bones_by_name[name]
  if (!bone)
    continue

  let s = skin[name]
  s[0].t_delta += RAF_timestamp_delta
  if (s[0].rot) {
    if (s[0].absolute)
      bone.quaternion.set(0,0,0,1)
    bone.quaternion.multiply(MMD_SA.TEMP_q.copy(s[1].rot).slerp(s[0].rot, Math.max(Math.min(s[0].t_delta/Math.min(_facemesh.frames.t_delta,200),1),0) ))
//DEBUG_show(s[0].t_delta/100)
  }
}
      }

    function process_morphs(e) {
var model = e.detail.model
var mesh = model.mesh
var targets = model.morph.targets
model.pmx.morphs.forEach(function (m) {
  if ((m.panel != 3))
    return
  var name = m.name
  if (!model.pmx.morphs_weight_by_name[name])
    return

  var morph_index = model.morph.target_index_by_name[name]
  if (morph_index == null)
    return

  var target = targets[morph_index]
  var key0 = target.keys[0]
  if (key0.morph_type == 1) {
    mesh.morphTargetInfluences[morph_index] = 0
  }
  else {
    let key_new = { name:name, weight:0, morph_type:key0.morph_type, morph_index:key0.morph_index }
    model.morph.onupdate(key_new, key_new, 0, morph_index)
  }
});

var facemesh_morph = MMD_SA_options.model_para_obj.facemesh_morph
var morph = _facemesh.frames.morph
for (var name in morph) {
  let m = morph[name]
  if (m.disabled)
    return
  m[0].t_delta += RAF_timestamp_delta

  let ratio = Math.max(Math.min(m[0].t_delta/Math.min(_facemesh.frames.t_delta,200),1),0)
  let weight = m[0].weight * ratio + m[1].weight * (1-ratio)

  if (weight < 0) {
    switch (name) {
      case "にやり":
        name = "ω"
        break
      case "上":
        name = "下"
        break
    }
    weight = -weight
  }

  let m_name = (facemesh_morph[name] && facemesh_morph[name].name) || name

  let morph_index = model.morph.target_index_by_name[m_name]
  if (morph_index == null)
    return

  let target = targets[morph_index]
  let key0 = target.keys[0]
  if (key0.morph_type == 1) {
    mesh.morphTargetInfluences[morph_index] = weight
  }
  else {
    let key_new = { name:m_name, weight:weight, morph_type:key0.morph_type, morph_index:key0.morph_index }
    model.morph.onupdate(key_new, key_new, 0, morph_index)
  }
}
      }

function draw_facemesh(faces, w,h) {
  var canvas = camera.video_canvas_facemesh
  var context = canvas.getContext("2d")
  var eyes = faces[0].eyes

  if ((canvas.width != w) || (canvas.height != h)) {
    canvas.width  = w
    canvas.height = h
  }

  context.clearRect(0,0,w,h)

  context.globalAlpha = 0.5
  context.fillStyle = 'black'
  context.fillRect(0,0,w,h)

  context.fillStyle = '#32EEDB';
  context.strokeStyle = '#32EEDB';
  context.lineWidth = 0.5;
  const keypoints = faces[0].scaledMesh;
  for (let i = 0, i_max=TRIANGULATION.length/3; i < i_max; i++) {
    const points = [
TRIANGULATION[i * 3], TRIANGULATION[i * 3 + 1],
TRIANGULATION[i * 3 + 2]
    ].map(index => keypoints[index]);
    drawPath(context, points, true);
  }

  eyes.forEach(function (eye) {
    var c = eye[0]/2
    var r = eye[1]/2
    context.beginPath();
    context.arc(c, r, 1, 0, 2*Math.PI, false);
    context.lineWidth = 3;
    context.strokeStyle = 'red';
    context.stroke();
  });
}

// https://github.com/tensorflow/tfjs-models/tree/master/facemesh/demo
// START

// https://github.com/tensorflow/tfjs-models/blob/master/facemesh/demo/index.js
function drawPath(ctx, points, closePath) {
  const region = new Path2D();
  region.moveTo(points[0][0]/2, points[0][1]/2);
  for (let i = 1; i < 3; i++) {
    const point = points[i];
    region.lineTo(point[0]/2, point[1]/2);
  }

  if (closePath) {
    region.closePath();
  }
  ctx.stroke(region);
}

// END

    _facemesh = {
      initialized: false
     ,worker_initialized: false

     ,get blink_detection() {
return blink_detection;
      }
     ,set blink_detection(v) {
blink_detection = v
if (enabled) {
  if (blink_detection) {
    MMD_SA_options.auto_blink = false
    reset_calibration()
  }
  else {
    MMD_SA_options.auto_blink = auto_blink_default
/*
    this.frames.remove("morph", "まばたき")
    this.frames.remove("morph", "まばたきL")
    this.frames.remove("morph", "まばたきR")
*/
  }
}
      }

     ,get use_faceLandmarksDetection() {
return use_faceLandmarksDetection;
      }

     ,set use_faceLandmarksDetection(v) {
if (!this.initialized)
  use_faceLandmarksDetection = v
      }

     ,get enabled() {
return enabled;
      }
     ,set enabled(v) {
if (enabled == !!v)
  return
enabled = !!v

if (enabled) {
  if (!this.initialized)
    init()
  else if (!this.worker_initialized)
    return

  add_video_capture()

  reset_calibration()

  auto_blink_default = MMD_SA_options.auto_blink
  if (blink_detection)
    MMD_SA_options.auto_blink = false

  this.frames.reset()

  window.addEventListener("SA_MMD_model0_process_morphs", process_morphs);
  window.addEventListener("SA_MMD_model0_process_bones", process_bones);
}
else {
  if (camera.initialized) {
    camera.video_canvas_face_detection.style.visibility = "hidden"
    camera.video_canvas_facemesh.style.visibility = "hidden"
    remove_video_capture()
  }
  MMD_SA_options.auto_blink = auto_blink_default
  window.removeEventListener("SA_MMD_model0_process_morphs", process_morphs);
  window.removeEventListener("SA_MMD_model0_process_bones", process_bones);
}
      }

     ,frames: {
  add: function (type, name, obj) {
obj.t_delta = 0

var target = this[type][name]
if (target) {
  if (obj.rot) {
    obj.rot.slerp(target[0].rot, 0.25)
  }
  if (obj.weight != null) {
    obj.weight = obj.weight * 0.75 + target[0].weight * 0.25
  }
  this[type][name] = [obj, target[0]]
}
else {
  this[type][name] = [obj, obj]
}
  }

 ,remove: function (type, name) {
delete this[type][name]
  }

 ,reset: function () {
this.skin = {}
this.morph = {}
  }

 ,skin:  {}
 ,morph: {}
      }

     ,update_frame:  function () {
if (!this.enabled || !this.worker_initialized || this.busy)
  return
this.busy = true

//camera.video_canvas.style.visibility="hidden"
/*
// non-worker Facemesh TEST
_facemesh.model.estimateFaces(camera.video_canvas).then(function (faces) {
//  DEBUG_show(faces.length+'/'+Date.now())
  self._faces_=faces
  _facemesh.busy = false
});
return;
*/

camera.video_canvas_facemesh.style.visibility = "visible"
if (camera.visible) {
}

let video_canvas = camera.video_canvas
let w = video_canvas.width
let h = video_canvas.height
let rgba = video_canvas.getContext("2d").getImageData(0,0,w,h).data.buffer;

let cs = camera.video_canvas_facemesh.style
if ((cs.pixelWidth != ~~video_canvas.style.pixelWidth/4) || (cs.pixelHeight != ~~video_canvas.style.pixelHeight/4)) {
  cs.pixelWidth  = ~~video_canvas.style.pixelWidth/4
  cs.pixelHeight = ~~video_canvas.style.pixelHeight/4
  cs.posLeft = video_canvas.style.pixelWidth - cs.pixelWidth
}

let data = { rgba:rgba, w:w, h:h, options:{draw_canvas:true, blink_detection:blink_detection} };//, threshold:1 };
if (!camera.video_canvas_facemesh._offscreen && self.OffscreenCanvas) {
  data.canvas = camera.video_canvas_facemesh.transferControlToOffscreen()
  camera.video_canvas_facemesh._offscreen = true
  console.log("(Facemesh: use offscreen canvas)")
}
fm_worker.postMessage(data, (data.canvas)?[data.canvas,data.rgba]:[data.rgba]);

data.rgba = rgba = undefined
data = undefined
      }

    };

    return _facemesh;
  })()

 ,snapshot: (function () {
    var waiting = false;
    var waiting_for_bodyPix = false;

    var time_ini;
    var countdown;
    function countdown_to_snapshot() {
var countdown_now = Math.ceil(3 - (Date.now() - time_ini)/1000)
if (countdown_now <= 0) {
  if (!camera.visible) {
    canvas_capture(SL)
    return
  }

  DEBUG_show("Capturing...")

  if (!camera.stream) {
    if (!_bodyPix.enabled) {
      draw_video_and_3D()
      return
    }

    waiting_for_bodyPix = true
  }
  else {
/*
    let w = window.innerWidth  * window.devicePixelRatio * 0.5
    let h = window.innerHeight * window.devicePixelRatio * 0.5
    let options = {}
    if (1|| w > h) {
      options.imageWidth  = w
      options.imageHeight = h
    }
    else {
      options.imageWidth  = h
      options.imageHeight = w
    }
    camera.imageCapture.takePhoto(options).then(function (blob) {
      var url = URL.createObjectURL(blob)
      window.open(url)

      clear()
    });
*/
    camera.target_devicePixelRatio = 1
    camera.video_track.applyConstraints(camera.set_constraints()).then(function () {
      System._browser.console.log("(Ready to capture)")
      System._browser.on_animation_update.add(function () {
        MMD_SA._renderer.devicePixelRatio = window.devicePixelRatio
        MMD_SA._renderer.__resize(EV_width, EV_height)

        if (!_bodyPix.enabled) {
          System._browser.on_animation_update.add(function () {
            draw_video_and_3D()
          },0,1);
          return
        }

        waiting_for_bodyPix = true
      },0,0);
    }).catch(function (err) {
      DEBUG_show("ERROR:camera size failed to update")
      clear()
    });
  }

  System._browser.on_animation_update.remove(countdown_to_snapshot,0);
}
else if (countdown != countdown_now) {
  countdown = countdown_now
  DEBUG_show(countdown)
}
    }

    function draw_video_and_3D() {
let canvas = camera.video_canvas_bodyPix
canvas.width  = SL.width
canvas.height = SL.height

let context = canvas.getContext("2d")
context.globalCompositeOperation = "source-over"
context.drawImage(camera.video_canvas, 0,0)
if (face_detection.enabled)
  context.drawImage(camera.video_canvas_face_detection, 0,0)
context.save()
context.translate(canvas.width, 0)
context.scale(-1, 1)
context.drawImage(SL, 0,0)
context.restore()

canvas_capture(canvas)
    }

    function canvas_capture(canvas) {
waiting = true

waiting_for_bodyPix = false
System._browser.on_animation_update.remove(countdown_to_snapshot,0);

canvas.toBlob(function(blob) {
  var url = URL.createObjectURL(blob)
  window.open(url)

  clear()
});
    }

    function clear() {
Ldebug.style.posLeft = Ldebug.style.posTop = 0
Ldebug.style.transform = Ldebug.style.transformOrigin = ""
DEBUG_show()

waiting_for_bodyPix = false

camera.target_devicePixelRatio = 0

waiting = false
    }

    snapshot = {
  init: function () {
if (waiting) {
  return true
}

if (MMD_SA.WebXR.session) {
  let AR_options = MMD_SA_options.WebXR && MMD_SA_options.WebXR.AR;
  if (!AR_options.dom_overlay || !AR_options.dom_overlay.use_dummy_webgl) {
    DEBUG_show("(No snapshot in AR WebGL)", 3)
    return true
  }
}

if (!camera.visible) {
  canvas_capture(SL)
}
else {
  waiting = true

  time_ini = Date.now()

  Ldebug.style.posLeft = Ldebug.style.posTop = 50
  Ldebug.style.transformOrigin = "0 0"
  Ldebug.style.transform = "scale(5,5)"
  countdown = 3
  DEBUG_show()
  DEBUG_show(countdown)

  System._browser.on_animation_update.add(countdown_to_snapshot,0,0,-1);
}
  }

 ,check_status: function () {
if (!waiting)
  return

if (waiting_for_bodyPix) {
  canvas_capture(camera.video_canvas_bodyPix)
}

return true
  }
    };

    return snapshot;
  })()

 ,show: function () {
if (!this.initialized || this.visible)
  return
this.visible = true

if (self.MMD_SA) {
  SL.style.transform = SL_2D_front.style.transform = "scaleX(-1)"
}

if (camera.target_devicePixelRatio != window.devicePixelRatio) {
  camera.target_devicePixelRatio = 0
  camera.video_track.applyConstraints(camera.set_constraints()).then(function () {
    DEBUG_show("(camera size updated)", 2)
  }).catch(function (err) {
    DEBUG_show("ERROR:camera size failed to update")
  });
}

window.addEventListener("SA_keydown", adjust_video_brightness);

add_video_capture()
  }

 ,hide: function () {
if (!this.initialized || !this.visible)
  return
this.visible = false

if (self.MMD_SA) {
  SL.style.transform = SL_2D_front.style.transform = "none"
}

this.video_canvas.style.visibility = "hidden"

face_detection.enabled = false
_bodyPix.enabled = false

var target_ratio = (is_mobile) ? 3 : 2
if (_facemesh.enabled && (camera.target_devicePixelRatio < target_ratio)) {
  camera.target_devicePixelRatio = target_ratio
  camera.video_track.applyConstraints(camera.set_constraints()).then(function () {
    DEBUG_show("(camera size updated)", 2)
  }).catch(function (err) {
    DEBUG_show("ERROR:camera size failed to update")
  });
}

window.removeEventListener("SA_keydown", adjust_video_brightness);

remove_video_capture()
  }

 ,set_constraints: function (constraints_extra) {
var constraints = {}

var DPR = window.devicePixelRatio / this.target_devicePixelRatio
var w = window.innerWidth  * DPR
var h = window.innerHeight * DPR
if (!is_mobile || !screen.orientation || /landscape/.test(screen.orientation.type)) {
  constraints.width =  w
  constraints.height = h
}
else {
  constraints.width =  h
  constraints.height = w
}

if (constraints_extra)
  constraints = Object.assign(constraints, constraints_extra)

return constraints
  }
      };
      return camera;
    })()

   ,console: {
  content_list: []

 ,log: function () {
for (var i=0; i < arguments.length; i++) {
  this.content_list.push(arguments[i])
}
  }

 ,reset: function () {
this.content_list = []
  }

 ,get output_text() {
return this.content_list.join("\n") || "(EMPTY)"
  }
    }

  }


 ,_hash_sha256: {
    _hash_cache: {}

   ,hash: function (str) {

if (webkit_electron_mode) {
  var f = webkit_electron_remote.getGlobal("HASH_SHA256")
  if (f)
    return f.hash(str)
}

var cache = this._hash_cache[str]
if (cache)
  return cache

var hash = require('crypto').createHash('sha256')
hash.update(str)
cache = this._hash_cache[str] = hash.digest('hex')

return cache
    }
  }

 ,_media_objs_paused_: []

 ,_gadget_resume: function (is_auto) {
if (is_auto && !top.EV_sync_update.RAF_auto_paused)
  return false

if (!top.EV_sync_update.RAF_paused)
  return false
top.EV_sync_update.RAF_paused = false

top.EV_sync_update.RAF_auto_paused = false

top.System._media_objs_paused_.forEach(function (v) {
  if (v.SL_MC_Play)
    v.SL_MC_Play()
  else if (v.paused)
    v.play()
});

top.System._media_objs_paused_ = []
System._browser.update_tray()
return true
  }

 ,_gadget_pause: function (is_auto) {
if (top.EV_sync_update.RAF_paused)
  return false
top.EV_sync_update.RAF_paused = true

top.EV_sync_update.RAF_auto_paused = is_auto

var _media_objs_paused_ = top.System._media_objs_paused_

var wins = [top]
for (var i = 0; i < SA_child_animation_max; i++) {
  if (top.SA_child_animation[i])
    wins.push(top.document.getElementById("Ichild_animation" + i).contentWindow)
}

var seq_count = 0
var video_count = 0
var mc_count = 0
wins.forEach(function (w_obj) {
  for (var name in w_obj.seq_items) {
    var seq = w_obj.seq_items[name]
    if (!seq._gadget_pause_disabled && !seq.paused && seq.count) {
      seq_count++
      seq.pause()
      _media_objs_paused_.push(seq)
    }
  }

  var v_list = []
  var _v
  _v = document.getElementById("VdesktopBG")
  if (_v)
    v_list.push(_v)
  _v = w_obj.CANVAS_Video_Overlay && w_obj.CANVAS_Video_Overlay._video
  if (_v)
    v_list.push(_v)
  v_list.forEach(function (v) {
    if (v && !v.paused && !v.ended) {
      video_count++
      v.pause()
      _media_objs_paused_.push(v)
    }
  });

  if (w_obj.SL && w_obj.SL._mouse_event_main && w_obj.SL._mouse_event_main()) {
    var paused
    if (w_obj.SL_MC_simple_mode)
      paused = w_obj.SL_MC_video_obj.paused
    else if (w_obj.MMD_SA)
      paused = w_obj.SL_MC_video_obj.vo.audio_obj.paused
    else if (w_obj.use_WMP && w_obj.WMP.in_use)
      paused = (w_obj.WMP.player.playState != 3)
    else
      paused = w_obj.SL_MC_video_obj && w_obj.SL_MC_video_obj.paused
//DEBUG_show(""+paused,0,1)
    if (!paused) {
      mc_count++
      w_obj.SL_MC_Play()
      _media_objs_paused_.push(w_obj)
    }
  }
});

console.log('Gadget PAUSED (Seq/Video/MC):' + [seq_count,video_count,mc_count].join('/'))
System._browser.update_tray()
return true
  }

 ,_returnRelativePath: function (path) {
if (!WallpaperEngine_CEF_mode)
  return path

//return toFileProtocol(path)
if (System.Gadget.path && (path.indexOf(System.Gadget.path) == 0))
  path = path.substr(System.Gadget.path.length)
path = (/\:/.test(path)) ? toFileProtocol(path) : path.replace(/\\/g, "/").replace(/^\//, "")
return path
  }

}

System._init();

