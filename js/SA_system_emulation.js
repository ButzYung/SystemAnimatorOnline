// System object emultaion (v3.8.1)

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
    System._browser._window_move_timerID = setTimeout(
(function () {
  var x = SA_top_window.screenLeftAbsolute
  var y = SA_top_window.screenTopAbsolute
  return function () {
System._browser._window_move_timerID = null
var xy = SA_top_window.getPos(true)
if ((x != xy[0]) || (y != xy[1])) {
  DEBUG_show("(window position adjusted)", 3)
  webkit_window.setPosition(x,y)
  System._browser.moveWallpaper(x,y)
}
  };
})(),
    0);
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
  if (System._browser.resize_timerID) {
    clearTimeout(System._browser.resize_timerID)
    System._browser.resize_timerID = null
  }
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

      return function () {
this.resize_timerID = null

if (use_SA_browser_mode) {
  var oBody = document.body.style
  if (is_SA_child_animation) {
    var i_obj = parent.document.getElementById("Ichild_animation" + SA_child_animation_id).style
    i_obj.width  = oBody.pixelWidth  + "px"
    i_obj.height = oBody.pixelHeight + "px"
  }
  else {
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

  if (!resized_once) {
    resized_once = true
    setTimeout(function () { window.dispatchEvent(new CustomEvent("SA_resized_once")); }, 0)
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
        MMD_SA_options.motion_shuffle = MMD_SA_options._motion_shuffle.slice(0)
        MMD_SA_options.motion_shuffle_list_default = null
        MMD_SA._force_motion_shuffle = true
        DEBUG_show("(MMD motions shuffled)", 2)
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

 ,run: function (phase) {
    var e_index_list = []
    var ep = events[phase]
    if (!ep.length)
      return

    ep.forEach(function (e, idx) {
      if (--e.frame_count >= 0)
        e_index_list.push(idx)
      else {
        if (e.loop && (--e.loop != 0))
          e_index_list.push(idx)
        e.func()
      }
    });

    events[phase] = e_index_list.map(function (index) { return ep[index]; });
  }
};
    })()

   ,get css_scale() {
return ((window.devicePixelRatio >= 2) ? 0.5 : 1)
    }

   ,virtual_numpad: (function () {
      var key_objs = {}

      return function (ev, e_type) {
ev.preventDefault()
ev.stopPropagation()

var key = ev.target.textContent
var key_obj = key_objs[key] = key_objs[key] || {}
var keyCode, shiftKey
switch (key) {
  case "+":
    keyCode = 107
    key_obj.pressed = !key_obj.pressed
    e_type = (key_obj.pressed) ? "keydown" : "keyup"
    break
  case "S":
    keyCode = 16
    key_obj.pressed = !key_obj.pressed
    e_type = (key_obj.pressed) ? "keydown" : "keyup"
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
  if (/[\+S]/.test(key)) {
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

  var _peer = this._peer = new Peer()
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

