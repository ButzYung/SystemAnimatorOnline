/*

_SA.js (2023-09-29)

System Animator
(c) Butz Yung / Anime Theme. All rights reserved.
- Homepage: http://www.animetheme.com/

*/


// obsolete
var Seq_speed_delay = 1

function addZero(n, d) {
  if (!d)
    d = 2

  n += ""

  if (n.length >= d)
    return n

  n = Math.pow(10,d-n.length) + n
  return n.substring(1, n.length)
}

function random(num) {
  return Math.floor(Math.random() * num)
}


var loaded
var Silverlight_native_capable, use_Silverlight_only
var use_Silverlight = returnBoolean("UseSilverlight")

if (xul_mode)
  xul_path = SystemEXT.GetXULPath()

var xul_transparent_mode = xul_mode && ((is_SA_child_animation) ? parent : self).SA_top_window.xul_transparent_mode
var is_SA_BG_transparent = xul_transparent_mode || webkit_transparent_mode

var absolute_screen_mode = (webkit_electron_mode && !returnBoolean("MoveWithinPrimaryScreen") && !is_SA_child_animation)

var spectrum_analyser, use_full_fps, use_full_fps_registered

var use_SVG_Clock = (ie9_mode && returnBoolean("UseSVGClock"))

var use_EQP_ripple = (ie9_mode && returnBoolean("UseCanvasRipple"))
var use_EQP_fireworks = (ie9_mode && returnBoolean("UseCanvasFireworks"))

var use_WebGL = (w3c_mode)
var use_WebGL_2D// = (use_WebGL && webkit_transparent_mode && returnBoolean("UseWebGLForCanvas2D"))

var use_MatrixRain

var Canvas_Effect
var use_full_spectrum
if (use_EQP_ripple || use_EQP_fireworks) {
  use_full_spectrum = true
}

var use_HTML5 = use_SA_browser_mode//((ie9_mode && returnBoolean("UseHTML5Canvas")) || webkit_mode || xul_mode)
var use_SVG// = (ie9_mode)
// for compatibility
if (use_HTML5 || use_SVG)
  use_Silverlight = true

var use_Silverlight_only = (use_Silverlight && !use_HTML5 && !use_SVG)


function init() {
/*
try{
var perfmon = SA_require('perfmon');
//perfmon.list('Network Interface', function(err, data) {	DEBUG_show(JSON.stringify(data),0,1); });
perfmon('\\LogicalDisk(*)\\% Disk Time', function(err, data) {	if (err) {DEBUG_show("ERROR:"+JSON.stringify(err),0,1)} else {DEBUG_show(JSON.stringify(data))}; });
//setTimeout(function () { perfmon('\\LogicalDisk(D:)\\% Disk Time', function(err, data) {	if (err) {DEBUG_show("ERROR:"+JSON.stringify(err),0,1)} else {DEBUG_show(JSON.stringify(data))}; }); }, 500)
} catch (err) { DEBUG_show("ERROR:"+err,0,1) }
*/
  loaded = true

  if (use_SVG_Clock)
    SVG_Clock.draw()

  if (xul_mode)
    XUL_onload()
  else if (webkit_mode)
    WebKit_onload()

try {
  System.Gadget.onDock = CheckDockState;
  System.Gadget.onUndock = CheckDockState;
}
catch (err) {
  DEBUG_show(err.description)
}

  System.Gadget.settingsUI = "settings.html"
  System.Gadget.onSettingsClosed = SettingsClosed;

// main
  if (!is_SA_child_animation) {
    if (use_RAF) {
      DEBUG_show('Use "requestAnimationFrame"', 2)
      setTimeout('RAF_timerID = requestAnimationFrame(Animate_RAF)', 200)
    }
    else {
      Seq.item("Animate").At(0.2, "Animate", -1, 0.1/EV_sync_update.count_to_10fps)
      Seq.item("Animate").Play()
    }
  }

  if (SEQ_mode) {
    Seq.item("SEQ").At(0, "SEQ_Animate", -1, 0.1)
    Seq.item("SEQ").use_SA_RAF = webkit_mode
    Seq.item("SEQ").Play()
  }

  if (MacFace_mode)
    VistaFace.main()

  if (!BG_dim_calculate) {
    BG_dim_calculate = function () {
      if (!self.EV_width)
        EV_width_no_init = true
      if (!self.EV_height)
        EV_height_no_init = true

      if (EV_width_no_init)
        EV_width  = ((w_max > 130) ? 130 : w_max)
      if (EV_height_no_init)
        EV_height = ((h_max > 130) ? 130 : h_max)
    }
  }

  DragDrop.init(document.body, DragDrop_install, function (item) { return (item.isFolder || (item.isFileSystem && DragDrop_RE.test(item.path))) })

  SystemEXT._default.config_folder = Settings.f_path_folder
  SystemEXT._default.config_folder_full = Settings.f_path


  if (use_SA_system_emulation) {
    var sb = System._browser
    sb.init()

    sb._onmouseover_custom = [function () {
// in SA_child_animation_host mode, hide the menu of parent window
if (is_SA_child_animation_host && !is_SA_child_animation) return

Lquick_menu.style.visibility = "inherit"
Lquick_menu._activated = true

if (this._onmouseout_waiting_custom0_timerID) {
  clearTimeout(this._onmouseout_waiting_custom0_timerID)
  this._onmouseout_waiting_custom0_timerID = null
}

if (this._drag_disabled)
  return

if ((B_content_width > 64) && (B_content_height > 64))
  LbuttonTL.style.visibility = "inherit"
if ((B_content_width > 64) && (B_content_height > 32))
  LbuttonLR.style.visibility = "inherit"
    }]

    sb._onmouseout_waiting_custom0_timerID = null
    sb._onmouseout_waiting_custom = [
(function () {
  var hide = function () { Lquick_menu.style.visibility = LbuttonTL.style.visibility = LbuttonLR.style.visibility = "hidden" }
  return function () {
if (returnBoolean("IgnoreMouseEventsPartial")) {
  if (sb._onmouseout_waiting_custom0_timerID)
    clearTimeout(sb._onmouseout_waiting_custom0_timerID)
  sb._onmouseout_waiting_custom0_timerID = setTimeout(hide, 3000)
}
else
  hide()

if (document.getElementById("SL_Host_Parent"))
  SL_Host_Parent.style.zIndex = 10
  }
})()
    ]

    sb._onmouseover_custom_all = function () {
var func = System._browser._onmouseover_custom
for (var i = 0; i < func.length; i++)
  func[i]()
    }

    sb._onmouseout_waiting_custom_all = function () {
var func = System._browser._onmouseout_waiting_custom
for (var i = 0; i < func.length; i++)
  func[i]()
    }

    if (sb.onmouseover_custom)
      sb._onmouseover_custom.push(sb.onmouseover_custom)
    if (sb.onmouseout_waiting_custom)
      sb._onmouseout_waiting_custom.push(sb.onmouseout_waiting_custom)

    Object.defineProperty(sb, "onmouseover_custom",
{
  get: function () {
return this._onmouseover_custom_all
  }

 ,set: function(func) {
this._onmouseover_custom.push(func)
  }
});

    Object.defineProperty(sb, "onmouseout_waiting_custom",
{
  get: function () {
return this._onmouseout_waiting_custom_all
  }

 ,set: function(func) {
this._onmouseout_waiting_custom.push(func)
  }
});

    if (browser_native_mode && !webkit_window && !is_SA_child_animation) {
//document.addEventListener('fullscreenerror', (e) => {DEBUG_show(9,0,1)});
      window.addEventListener("resize", function (e) {
function _resize() {
// temp fix for a WebXR dom overlay issue
//  if (self.MMD_SA && MMD_SA.WebXR.session && (parseInt(navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./)||0) > 85)) return;
//  SA_zoom = 1
  resize()
}

if (1||Settings.CSSTransformFullscreen) {
  System._browser.on_animation_update.remove(_resize, 0)
  System._browser.on_animation_update.add(_resize, (is_mobile)?10:0, 0)
}
      });
    }

    LbuttonFullscreen.addEventListener("click", async function (event) {
if (is_SA_child_animation) {
  if (is_SA_child_animation_host) {
    parent.document.getElementById("LbuttonFullscreen").click()
    LbuttonFullscreen.style.visibility = "hidden"
    LbuttonRestore.style.visibility = "inherit"
  }
  else
    DEBUG_show("(no fullscreen mode for child animation)", 2)
  return
}

if (is_mobile && (is_SA_child_animation_host || self.MMD_SA)) {
  LbuttonFullscreen.style.visibility = "hidden"
  LbuttonRestore.style.visibility = "inherit"
// Some browsers (e.g. Safari) does not return promise for requestFullscreen. Use await instead of then().
  await document.documentElement.requestFullscreen()
  DEBUG_show('Fullscreen:ON',2)
  return
}

System.Gadget.Settings.writeString("CSSTransformFullscreen", "non_default")
Settings.CSSTransformFullscreen = true
SA_zoom = 1

resize(null,null,null, true)

event.stopPropagation()
    }, true)

    LbuttonRestore.addEventListener("click", function (event) {
if (is_SA_child_animation_host && is_SA_child_animation) {
  parent.document.getElementById("LbuttonRestore").click()
  LbuttonFullscreen.style.visibility = "inherit"
  LbuttonRestore.style.visibility = "hidden"
  return
}

if (is_mobile && (is_SA_child_animation_host || self.MMD_SA)) {
  LbuttonFullscreen.style.visibility = "inherit"
  LbuttonRestore.style.visibility = "hidden"
  document.exitFullscreen().then(()=>{DEBUG_show('Fullscreen:OFF',2)});
  return
}

System.Gadget.Settings.writeString("CSSTransformFullscreen", "")
System.Gadget.Settings.writeString("CSSTransformScale", 1)
System.Gadget.Settings.writeString("CSSTransformRotate", 0)
Settings.CSSTransformFullscreen = false
Settings.CSSTransformScale  = SA_zoom   = 1
Settings.CSSTransformRotate = SA_rotate = 0

if (self.EQP_size_scale)
  EQP_size_scale = 1

resize()

event.stopPropagation()
    }, true)

    LbuttonMinimize.addEventListener("click", function (event) {
if (is_SA_child_animation) {
  if (is_SA_child_animation_host)
    parent.document.getElementById("LbuttonMinimize").click()
  else
    DEBUG_show("(not applicable for child animation)", 2)
  return
}

if (webkit_mode) {
  try {
    webkit_window.minimize()
  }
  catch (err) {}
}
else {
  if (window.minimize)
    window.minimize()
}

event.stopPropagation()
    }, true)

    LbuttonLR.addEventListener("dblclick", function (event) {
if (LbuttonResize._timerID) {
  clearTimeout(LbuttonResize._timerID)
  LbuttonResize._timerID = null
}

if (LbuttonResize.style.visibility == "hidden") {
  LbuttonResize.style.visibility = "inherit"
  LbuttonRotate.style.visibility = "hidden"
}
else {
  LbuttonResize.style.visibility = "hidden"
  LbuttonRotate.style.visibility = "inherit"
}

event.stopPropagation()
    }, true)

// resize
    LbuttonResize._timerID = null
    LbuttonResize.addEventListener("mousedown", function (event) {
if (this._timerID)
  clearTimeout(this._timerID)
this._timerID = setTimeout("LbuttonResize._resize_start()", 500)
System._browser.onmouseup_custom = this._resize_cancel

this._x = event.clientX
this._y = event.clientY

event.stopPropagation()
    }, true)

    LbuttonResize._resize_cancel = function () {
if (LbuttonResize._timerID) {
  clearTimeout(LbuttonResize._timerID)
  LbuttonResize._timerID = null
}
System._browser.onmouseup_custom = null
    }

    LbuttonResize._resize_start = function () {
this._timerID = null

var sb = System._browser
sb._drag_disabled = true
sb.onmousemove_custom = this._resize
sb.onmouseup_custom = this._resize_finish
sb.showFocus(true)

LbuttonResize._scale = 1;

DEBUG_show("(resizing)", 2)
    }

    LbuttonResize._resize = function (event) {
var x = event.clientX - LbuttonResize._x
var y = event.clientY - LbuttonResize._y

var scale_x = (B_content_width + x)  / B_content_width
var scale_y = (B_content_height + y) / B_content_height
var scale = LbuttonResize._scale = Math.max(scale_x, scale_y)

var s = document.body.style
s.pixelWidth  = parseInt(B_content_width  * scale)
s.pixelHeight = parseInt(B_content_height * scale)

System._browser.showFocus(true)
    }

    LbuttonResize._resize_finish = function () {
var sb = System._browser
sb.onmousemove_custom = sb.onmouseup_custom = null
sb._drag_disabled = false
sb.showFocus(false)

var use_EQP_size_scale = (self.EQP_size_scale && !self.EQP_video_options)
var zoom = (use_EQP_size_scale) ? EQP_size_scale : ((self.MMD_SA_options && !Settings.CSSTransformFullscreen) ? Math.max(B_content_width/MMD_SA_options.width, B_content_height/MMD_SA_options.height) : SA_zoom);

var scale = LbuttonResize._scale = Math.round(LbuttonResize._scale*zoom*1000)/1000
if (is_SA_child_animation_host && is_SA_child_animation) {
  parent.System.Gadget.Settings.writeString("CSSTransformScale", scale)
  parent.Settings.CSSTransformScale = parent.SA_zoom = scale
  parent.resize()
  resize(true)
  return
}
//DEBUG_show(zoom+'=>'+scale)
System.Gadget.Settings.writeString("CSSTransformScale", scale)
Settings.CSSTransformScale = SA_zoom = scale

if (use_EQP_size_scale) {
  EQP_size_scale = scale
  SA_zoom = 1
  resize(true, function(){EQP_resize(EQP_size_scale)})
}
else
  resize(true)
    }

// rotate
    LbuttonRotate._timerID = null
    LbuttonRotate.addEventListener("mousedown", function (event) {
if (this._timerID)
  clearTimeout(this._timerID)
this._timerID = setTimeout("LbuttonRotate._rotate_start()", 500)
System._browser.onmouseup_custom = this._rotate_cancel

var x = event.clientX - (B_content_width / 2)
var y = (B_content_height / 2) - event.clientY
LbuttonRotate._angle_base = Math.atan2(y,x)

event.stopPropagation()
    }, true)

    LbuttonRotate._rotate_cancel = function () {
if (LbuttonRotate._timerID) {
  clearTimeout(LbuttonRotate._timerID)
  LbuttonRotate._timerID = null
}
System._browser.onmouseup_custom = null
    }

    LbuttonRotate._rotate_start = function () {
this._timerID = null

var sb = System._browser
sb._drag_disabled = true
sb.onmousemove_custom = this._rotate
sb.onmouseup_custom = this._rotate_finish
sb.showFocus(true)

DEBUG_show("(rotating)", 2)
    }

    LbuttonRotate._rotate = function (event) {
var x = event.clientX - (B_content_width / 2)
var y = (B_content_height / 2) - event.clientY
var angle = Math.atan2(y,x)

LbuttonRotate._angle = LbuttonRotate._angle_base - angle
    }

    LbuttonRotate._rotate_finish = function () {
var sb = System._browser
sb.onmousemove_custom = sb.onmouseup_custom = null
sb._drag_disabled = false
sb.showFocus(false)

var angle = Math.round((LbuttonRotate._angle * 180 / Math.PI)*1000)/1000 + SA_rotate
System.Gadget.Settings.writeString("CSSTransformRotate", angle)
Settings.CSSTransformRotate = SA_rotate = angle

resize()
    }

    if (is_SA_child_animation) {
      document.addEventListener("dblclick", function (e) {
if (!parent.Lbody3D_navigation._3d_navigation_mode)
  return

var dblclickEvt = parent.document.createEvent("MouseEvents");
dblclickEvt.initEvent("dblclick");
parent.Lbody3D_control.dispatchEvent(dblclickEvt);

e.stopPropagation()
      }, true)
    }

    document.onkeydown = SA_OnKeyDown
    System.Gadget.Settings._writeSettings_CORE = Settings_writeJS
  }

  if (ie9_mode) {
    for (var i = 0; i < SA_child_animation_max; i++) {
      var d = document.getElementById("Ichild_animation" + i)
      if (d) {
        d.onmouseout = function (e) {
// check if contentWindow.System is missing for any reason
// to fix the dragging issue when using the right mouse button in XUL
if (!this.contentWindow.System || (xul_mode && this.contentWindow.System._browser.is_dragging))
  return

this.contentWindow.System._browser.onmouseout()
        }
      }
    }

    spectrum_analyser = document.getElementById("Ichild_animation99")
    if (spectrum_analyser) {
      DEBUG_show("**Spectrum Analyser loaded**", 2)
    }
  }

  if (use_SA_browser_mode) {
    self.onbeforeunload = function () {
window.dispatchEvent(new CustomEvent('SA_writeSettings'));

if (WallpaperEngine_CEF_mode)
  return

System.Gadget.Settings._writeSettings();
SA_OnBeforeUnload_Common();

if (!is_SA_child_animation) {
  if (SA_top_window.is_SA_hosted) {
    SA_top_window.opener.closeSA(SA_top_window.SA_child_animation_id);
  }

  if (webkit_electron_mode) {
    if (WebKit_object.monitor_winstate.process) {
      Seq.item("MonitorWinstateSTDIN").Stop()
      try {
        WebKit_object.monitor_winstate.process.stdin.write("KILL\n")
//        WebKit_object.monitor_winstate.process.kill()
        WebKit_object.monitor_winstate.process = null
      }
      catch (err) {}
    }
    if (WebKit_object.monitor_winamp.process) {
      Seq.item("MonitorWinampSTDIN").Stop()
      try {
        WebKit_object.monitor_winamp.process.stdin.write("KILL\n")
        WebKit_object.monitor_winamp.process = null
      }
      catch (err) {}
    }
  }
}
    }

    self.onerror = function (msg, filename, line) {
var err_msg = 'ERROR('+filename.replace(/^.+\//, "")+': L' + line + ' / ' + msg
console.error(err_msg)
//if (WallpaperEngine_CEF_mode) { DEBUG_show(err_msg,0,1) } else
DEBUG_show(err_msg)
return true
    }
  }
  else {
    document.onkeydown = SA_OnKeyDown_Gadget
//    document.onmousedown = SA_OnMouseDown

    self.onunload = function () { SA_OnBeforeUnload_Common() }
  }

  if (is_mobile) {
    if (!is_SA_child_animation) {
      Lquick_menu.style.visibility = "inherit"
      Lquick_menu._activated = true
    }
/*
    window.addEventListener('blur', function () {
Lquick_menu.style.visibility = LbuttonTL.style.visibility = LbuttonLR.style.visibility = "hidden";
    });
*/
  }

  loadMain()
}

function SA_OnKeyDown_Gadget() {
  var k = event.keyCode
/*
  if (k == 67) {
// c
    if (!SA_confirm_HTA_creation_waiting)
      SA_CreateHTA()
  }
  else if (k == 72) {
// h
    if (SA_confirm_HTA_creation_waiting)
      SA_CreateHTA()
  }
*/
  if ((k == 71) && self.use_EQP_core && use_Silverlight) {
// g
    SA_animation_append_mode = false
    EQP_gallery_append_mode = !EQP_gallery_append_mode
    DEBUG_show('Gallery Append Mode:' + ((EQP_gallery_append_mode) ? 'ON' : 'OFF'), 2)
  }
}

var EQP_gallery_append_mode = false

function SA_OnDocument() {
  if (0&&webkit_electron_mode) {
// https://github.com/electron/electron/blob/master/docs/api/dialog.md
    try {
      webkit_window.setAlwaysOnTop(false)
    }
    catch (err) {}

    webkit_electron_dialog.showOpenDialog(null, {title:"Choose an input file."}
,function (v) {
  try {
    webkit_window.setAlwaysOnTop(returnBoolean("AutoItAlwaysOnTop"))
  }
  catch (err) {}

  if (v)
    SA_DragDropEMU(v[0])
}
    );

    return
  }

  var url = "SystemAnimator_browse.html?title=" + encodeURIComponent("Choose an input file.")// + "&seed=" + Date.now()
  if (use_inline_dialog) {
    if (document.getElementById("Idialog").style.visibility == "hidden") {
      document.getElementById("Idialog").contentWindow.location.replace(url)
    }
    return
  }

  var v = showModalDialog(url)
  v = (w3c_mode) ? self.returnValue : v

  if (v)
    SA_DragDropEMU(v)
}

function SA_OnFolder(info) {
  if (!info)
    info = "Choose an input folder."

  if (webkit_electron_mode) {
// https://github.com/electron/electron/blob/master/docs/api/dialog.md
    try {
      webkit_window.setAlwaysOnTop(false)
    }
    catch (err) {}

    webkit_electron_dialog.showOpenDialog(null, {title:info, properties:["openDirectory"]}
,function (v) {
  try {
    webkit_window.setAlwaysOnTop(returnBoolean("AutoItAlwaysOnTop"))
  }
  catch (err) {}

  if (v)
    SA_DragDropEMU(v[0])
}
    );

    return true
  }

  try {
    var f = Shell_OBJ.BrowseForFolder(0, info, 0)
    if (!f)
      return false
    if (use_inline_dialog)
      return true

    SA_DragDropEMU(f.Self.Path)
  }
  catch (err) { alert(err.message); return false; }

  return true
}

function SA_OnGallery() {
  SA_animation_append_mode = false
  EQP_gallery_append_mode = true
  if (SA_OnFolder("Choose a picture folder."))
    return

  EQP_gallery_append_mode = false
  EQP_SS_path = ""
  System.Gadget.Settings.writeString("LABEL_EQP_SS_path", "")
  DEBUG_show("(reload animation to reset gallery)", 2)
}

function SA_ClearInterface(event) {
  var w = (is_SA_child_animation) ? parent : self
  var w_list = [w]
  for (var i = 0; i < SA_child_animation_max; i++) {
    if (w.SA_child_animation[i])
      w_list.push(w.document.getElementById("Ichild_animation" + i).contentWindow)
  }

  try {
    w_list.forEach(function (wo) {
      wo.System._browser.onmouseout_waiting(event)
      if (wo.SL_MC_MouseLeave) {
        wo.SL_MC_MouseLeave(10)
      }
    })
  } catch (err) { console.error(err.message) }
}

// cannot use const as it won't appear under self
var SA_OnKeyDown = (()=>{

  let shift_location, ctrl_location, alt_location;

return function (event, enforced) {
// event object used here may not be native, and thus it may not have native properties/functions.
  event.preventDefault && event.preventDefault();

  var k = event.keyCode
  if (k > 249) return

  switch (event.key) {
    case 'Control':
      ctrl_location = event.location;
      break;
    case 'Shift':
      shift_location = event.location;
      break;
    case 'Alt':
      alt_location = event.location;
      break;
  }

  const is_altKey = event.altKey;
  const is_safe_key = is_altKey || !self.MMD_SA || !MMD_SA_options.Dungeon_options || !event.preventDefault;

  var p_win = (is_SA_child_animation) ? parent : self
  if (!enforced && webkit_electron_mode && p_win.returnBoolean("AutoItStayOnDesktop") && !p_win.webkit_IgnoreMouseEvents_disabled) {
    return
  }

  System._browser.showFocus(true)

  if (webkit_electron_mode && (p_win.returnBoolean("IgnoreMouseEvents") || p_win.returnBoolean("AutoItStayOnDesktop")) && !p_win.webkit_IgnoreMouseEvents_disabled) {
    var w = IPC.active_window
    if (w != self) {
      w.SA_OnKeyDown(event, true)
      System._browser.showFocus(false)
      return
    }
  }

  var result = { return_value:null }
  window.dispatchEvent(new CustomEvent("SA_keydown", { detail:{ e:event, keyCode:k, shift_location:shift_location, ctrl_location:ctrl_location, alt_location:alt_location, result:result } }));

  var _browser_onkeydown
  if (result.return_value) {
    if (result.return_value == "nondefault")
      return
  }
  else if (browser_native_mode && !webkit_window) { _browser_onkeydown=true }
  else if (k == 73) {}
  else if (k == 65 && is_safe_key) {
// a
    if (is_SA_child_animation) {
      parent.SA_AnimationAppend_Switch(event)
      parent.focus()
    }
    else
      SA_AnimationAppend_Switch(event)
  }
  else if (k == 68 && is_safe_key) {
// d
    SA_OnDocument()
  }
  else if (k == 70 && is_safe_key) {
// f
    SA_OnFolder()
  }
  else if ((k == 71) && self.use_EQP_core && use_Silverlight && is_safe_key) {
// g
    SA_animation_append_mode = false
    EQP_gallery_append_mode = !EQP_gallery_append_mode
    DEBUG_show('Gallery Append Mode:' + ((EQP_gallery_append_mode) ? 'ON' : 'OFF'), 2)
  }
  else if (k == 72 && is_safe_key) {
// h
    if (is_SA_child_animation) {
      parent.SA_OnKeyDown(event)
      parent.focus()
    }
    else if (self.HeadTrackerAR) {
      if (HeadTrackerAR.running)
        HeadTrackerAR.stop()
      else
        HeadTrackerAR.start()
    }
  }
  else if (k == 77 && is_safe_key) {
// m
    if (use_HTML5 && self.WMP_mask) {
      CANVAS_must_redraw = true
      var mask_obj = SL_root.FindName('content_mask')
      if (!mask_obj.ImageSource) {
        var mask_path = toLocalPath((EQP_parts_path) ? EQP_parts_path + '\\' : 'mask\\');
        mask_obj.ImageSource = toFileProtocol(Settings.f_path + '\\' + mask_path + WMP_mask + '.png')
        DEBUG_show("WMP Mask:ON", 2)
      }
      else {
        mask_obj.ImageSource = null
        DEBUG_show("WMP Mask:OFF", 2)
      }
    }
  }
  else if (k == 84 && is_safe_key) {
// t
    if (Lbody3D_navigation._transformOrigin) {
      var t = Lbody3D_navigation._3d_navigation_mode = !Lbody3D_navigation._3d_navigation_mode
      Lbody3D_control.style.visibility = (t) ? "inherit" : "hidden"
      DEBUG_show("3D Navigation Mode:" + ((t) ? "ON" : "OFF"), 2)
    }
    else if (is_SA_child_animation && parent.Lbody3D_navigation._transformOrigin) {
      parent.SA_OnKeyDown(event)
      parent.focus()
    }

    var p = (is_SA_child_animation) ? parent : self
    p.System._browser._child_drag_disabled = p.document.getElementById("Lbody3D_navigation")._3d_navigation_mode
  }
  else if (k == 86 && is_safe_key) {
// v
    if (self.HeadTrackerAR && HeadTrackerAR.running)
      HeadTrackerAR.canvas_camera.style.display = (HeadTrackerAR.canvas_camera.style.display == "none") ? "block" : "none"
  }
  else if ((k >= 37) && (k <= 40) && is_safe_key) {
//left top right bottom
    if (Lbody3D_navigation._3d_navigation_mode) {
      if ((k == 38) || (k == 40)) {
        Lbody3D_navigation._translate3d[2] += (k == 38) ? 10 : -10
      }
      else {
        var r3d = Lbody3D_navigation._rotate3d
        r3d[2] = (r3d[2] + ((k == 37) ? -2 : 2)) % 360
      }
      Lbody3D_navigation._transformed = true
    }
    event.preventDefault()
  }
  else { _browser_onkeydown=true }

  if (_browser_onkeydown && !System._browser.onkeydown(event)) {
    if (!event.ctrlKey && !event.shiftKey && !is_altKey)
      DEBUG_show(k, 2)
    System._browser.showFocus(false)
    return
  }

  if (webkit_electron_mode && (p_win.returnBoolean("IgnoreMouseEvents") || p_win.returnBoolean("AutoItStayOnDesktop"))) {
    if ((k == 73) || !p_win.webkit_IgnoreMouseEvents_disabled) {
      p_win.webkit_IgnoreMouseEvents_disabled = !p_win.webkit_IgnoreMouseEvents_disabled
      try {
        if (p_win.returnBoolean("AutoItStayOnDesktop") && !WallpaperEngine_mode)
          WebKit_object.stay_on_desktop(!p_win.webkit_IgnoreMouseEvents_disabled)
        webkit_window.setIgnoreMouseEvents(!p_win.webkit_IgnoreMouseEvents_disabled)
        webkit_window.setFocusable(p_win.webkit_IgnoreMouseEvents_disabled)
      }
      catch (err) {}

      if (!p_win.webkit_IgnoreMouseEvents_disabled) {
        SA_ClearInterface(new CustomEvent("key_TEMP"))
      }
      else {
        if (is_SA_child_animation) {
          parent.System._browser.arrangeChildZ(SA_child_animation_id)
        }
      }

      p_win.DEBUG_show("Mouse event: " + ((p_win.webkit_IgnoreMouseEvents_disabled) ? "ON (press I to turn OFF)" : "OFF"), 10)
    }
  }

  System._browser.showFocus(false)
};

})();

async function SA_DragDropEMU(file) {
//if (file) DEBUG_show(file.constructor,0,1)
//DEBUG_show(self.URL.createObjectURL(file),0,1)
  var is_file = (typeof file != "string")
  var item = (is_file) ? new System.Shell._FolderItem(new WebKit_object["Shell.Application"]._FolderItem({path:(webkit_electron_mode&&file.path)||file.name, file:file})) : System.Shell.itemFromPath(file)
//console.log(item)
  if (/*WallpaperEngine_CEF_mode && */is_file) {// && DragDrop._obj_url_RE && DragDrop._obj_url_RE.test(file.name)) {
console.log("File input:", file)
    var dd = SA_topmost_window.DragDrop
    if (!dd._path_to_obj) {
      dd._path_to_obj = {}
      dd._obj_url = {}
    }
    dd._path_to_obj[file.name.replace(/^(.+)[\/\\]/, "")] = file
/*
    if (/(\.zip)$/i.test(file.name)) {
      let obj_url_zip = dd._obj_url[file.name] = SA_topmost_window.URL.createObjectURL(file)
      dd._path_to_obj[obj_url_zip+RegExp.$1] = file
    }
*/
  }
//console.log(item)
  DragDrop._no_relay = true
  if (DragDrop.validate_func(item, true)) {
    await DragDrop.onDrop_finish(item, true);
  }
  else
    DEBUG_show("(Invalid input type)")
  DragDrop._no_relay = false
}

function SA_OnBeforeUnload_Common() {
  WMI_AL_stop()
}

var SA_animation_append_mode

function SA_AnimationAppend_Switch(event) {
  var k = event.keyCode
  if (k != 65)
    return
  if (is_SA_child_animation)
    return

  EQP_gallery_append_mode = false
  SA_animation_append_mode = !SA_animation_append_mode
  DEBUG_show("Animation Append Mode:" + ((SA_animation_append_mode) ? "ON" : "OFF"), 2)
}

var SA_confirm_HTA_creation_waiting
var SA_confirm_HTA_creation_timerID

function SA_OnMouseDown() {
  if ((event.clientX > 20) || (event.clientY < document.body.style.pixelHeight-20))
    return

  SA_CreateHTA()
}

function SA_CreateHTA() {
  if (Settings.f_path.indexOf(System.Gadget.path) != -1)
    return

  if (SA_confirm_HTA_creation_waiting) {
    SA_confirm_HTA_creation_waiting = false
    if (SA_confirm_HTA_creation_timerID) {
      clearTimeout(SA_confirm_HTA_creation_timerID)
      SA_confirm_HTA_creation_timerID = null
    }

    Settings_writeJS();

    DEBUG_show('(HTA created in the animation folder)', 5)
  }
  else {
    SA_confirm_HTA_creation_waiting = true
    SA_confirm_HTA_creation_timerID = setTimeout('SA_confirm_HTA_creation_timerID=null; SA_confirm_HTA_creation_waiting=false', 5*1000)
    DEBUG_show('(' + ((event && (event.type == "keydown")) ? "Press H" : "Click again") + ' to confirm creating a HTA for this animation.)', 5)
  }
}

var DragDrop_RE_default_array = ["bmp","gif","jpg","jpeg","png","webp","wmv","webm","mp4","mkv"]
if (w3c_mode) {
  DragDrop_RE_default_array.push("pmd")
  DragDrop_RE_default_array.push("pmx")
}
var DragDrop_RE_default = eval('/\\.(' + DragDrop_RE_default_array.join("|") + ')$/i')
var DragDrop_RE = DragDrop_RE_default

function DragDrop_install(item) {
  var path = item.path
  var path_folder = (item.isFolder) ? path : path.replace(/[\/\\][^\/\\]+$/, "");

  if (/\.(pmd|pmx)$/i.test(path) && self.MMD_SA) {
    if (/\.pmd$/i.test(path)) {
      DEBUG_show('(PMD model is no longer supported. Use PMX instead.)', 3);
      return;
    }
    if (MMD_SA_options.Dungeon_options) {
      DEBUG_show('(Drop a zipped MMD model instead.)', 3);
      return;
    }

    System.Gadget.Settings.writeString("LABEL_MMD_model_path", path)

    Settings.f_path = Settings.f_path_original
    System.Gadget.Settings.writeString("Folder", Settings.f_path_original)
    SA_Reload_PRE(Settings.f_path, Settings.f_path_folder)
    return
  }

  var folder_changed = (path_folder != Settings.f_path_folder)
  if (use_SA_browser_mode) {
// folder changed/saving on different config file
    if (folder_changed || webkit_mode) {
      folder_changed = true
      Settings.f_path = Settings.f_path_original
      System.Gadget.Settings.writeString("Folder", Settings.f_path_original)
    }
    else {
// updating settings with no animation folder change, or changing images/videos inside the same folder (i.e. folder path unchanged, saving on the same config file for non-webkit mode)
      Settings.f_path = path
      System.Gadget.Settings.writeString("Folder", path)
    }

    if (EQP_gallery_append_mode) {
      if (item.isFolder) {
        if (/\.EQP\-gallery$/.test(path) || ValidatePath(path + '\\animate.js'))
          EQP_gallery_append_mode = false
      }
      else
        EQP_gallery_append_mode = false
    }
  }

  if ((use_SA_browser_mode || SA_animation_append_mode) && !EQP_gallery_append_mode) {
    var update_existing_config
    if (folder_changed) {
      if (path_demo_by_url[path_folder])
        update_existing_config = ValidatePath(System.Gadget.path + '\\TEMP\\_config_local\\' + path_folder.replace(/^.+[\/\\]/, "") + '.js')
      else if (webkit_mode && (path != path_folder))
        update_existing_config = ValidatePath(System.Gadget.path + '\\TEMP\\_config_local\\_SA_' + System._hash_sha256.hash(path) + '.js')
      else
        update_existing_config = ValidatePath(path_folder + '\\_config_local.js')
    }

    if (update_existing_config) {
      SystemEXT.SaveLocalSettings(null, path_folder, path)
    }
    else {
      var excluded_settings
      if (SA_animation_append_mode) {
        excluded_settings = {
   Opacity: true

  ,IgnoreMouseEvents: true

  ,HTALoadSpectrumAnalyser: true
  ,WallpaperAsBG: true
  ,DisableWallpaperMask: true
  ,XULTransparentBG: true

  ,CSSTransformScale: true
  ,CSSTransformRotate: true
  ,CSSTransformFullscreen: true
  ,CSSTransformFlipH: true
  ,CSSTransformFlipV: true
  ,CSSTransform3D: true
  ,CSSTransform3DBoxAnimate: true
  ,CSSTransformToChildAnimation: true
  ,CSSTransform3DBillboard: true
  ,CSSTransform3DDisabledForContent: true

  ,UseMatrixRain: true
  ,MatrixRainColor: true

  ,UseCanvasRipple: true
  ,UseCanvasFireworks: true
  ,UseSVGClock: true

  ,AutoItRunAsAU3: true
  ,AutoItAlwaysOnTop: true
  ,AutoItStayOnDesktop: true
  ,AutoItAutoPause: true
  ,AutoItWinampMode: true
        }
      }
      Settings_writeJS(path, excluded_settings)
    }
  }

  if (SA_animation_append_mode) {
    if (is_SA_child_animation) {
      DEBUG_show("(No child animation allowed inside another child animation)", 5)
      return
    }

    var child_animation_id = -1
    for (var i = 0; i < SA_child_animation_max; i++) {
      if (!SA_child_animation[i]) {
        child_animation_id = i
        break
      }
    }

    if (child_animation_id == -1) {
      DEBUG_show("(No more child animation allowed)", 5)
      return
    }

    var ani
    ani = SA_child_animation[child_animation_id] = { f:path, x:10, y:10, z:0, opacity:1 }

    // In webkit (NW.js) mode, node.js object may not be initialized in dynamically generated IFRAME. Restart the animation to fix the problem.
    if (webkit_nwjs_mode) {
      path_folder = Settings.f_path_folder
      path = Settings.f_path_original
    }
    else {
// use encodeURI instead of encodeURIComponent
      var ds = SA_Generate_IChild(child_animation_id, System._child_html_filename + "?f=" + encodeURI(path)).style
      ds.posLeft = ani.x
      ds.posTop  = ani.y
      ds.zIndex  = ani.z
      return
    }
  }

  if (EQP_gallery_append_mode) {
    System.Gadget.Settings.writeString("LABEL_EQP_SS_path", path_folder)
    path_folder = Settings.f_path_folder
    path = Settings.f_path_original
  }

  SA_Reload_PRE(path, path_folder)
}

function SA_Reload_PRE(path, path_folder, restart_app) {
  var path_to_launch = (webkit_mode) ? path : path_folder
  if (use_SA_browser_mode && !is_SA_child_animation) {
    if (SA_top_window.is_SA_hosted) {
      setTimeout(function () { SA_top_window.opener.new_animation_path = path_to_launch; SA_top_window.close(); }, 0)
    }
    else {
var args = []
var app_path = ""
var app_path_current = ""
if (webkit_mode) {
  app_path = SystemEXT.GetWebKitPath(webkit_path)
  app_path_current = webkit_path
  args = [app_path, System.Gadget.path, path_to_launch]
//System.Gadget.path + ((webkit_electron_mode) ? "\\electron_app" : "")
}
else if (xul_mode) {
  app_path = SystemEXT.GetXULPath()
  app_path_current = xul_path
  args = [app_path]
  if (/firefox.exe/i.test(args[0]))
    args.push("-app")
  args.push(System.Gadget.path + toLocalPath('\\_xul_gadget\\application.ini'), path_to_launch)
}
else {
  args = [System.Gadget.path + toLocalPath("\\SystemAnimator_ie.hta"), path_to_launch]
}

if (SystemEXT.enforce_WSH)
  args.push("wsh")

if (RAF_timerID) {
  cancelAnimationFrame(RAF_timerID)
  RAF_timerID = null
}

if (!self.oHTA) {
  if (webkit_electron_mode) {
    if (System._restart_full || (app_path != app_path_current) || WMI_perfmon.loaded || !webkit_version_milestone["1.4.11"] || (!WallpaperEngine_mode && ((!linux_mode && (path_to_launch != Settings.f_path)) || System.Gadget.Settings._changed["DisableTransparency"])) || (!WallpaperEngine_mode && System.Gadget.Settings._changed["AutoItStayOnDesktop"] && webkit_transparent_mode))
      restart_app = true

    if (WallpaperEngine_mode) {
      const fs = SA_require('fs')
      fs.writeFileSync(System.Gadget.path + '\\TEMP\\animation_path_default.txt', path_demo_by_url[path_to_launch]||path_to_launch)
    }

// a workaround for perfmon, to avoid errors on main process when reloading window to restart.
// NOTE: It seems it's better just always use relaunch for restarting, to avoid issues.
//  restart_app = true
    if (restart_app) {
      if (WallpaperEngine_mode) {
        self.onbeforeunload()
        DEBUG_show("NOTE: Please reload the wallpaper from Wallpaper Engine's panel for the changes to take effect.", 30)
      }
      else {
        webkit_electron_remote.getGlobal("relaunch")([path_to_launch], (((app_path != app_path_current) && app_path) || ""))
      }
      return
    }
  }

  const cmd_line = []
  args.forEach(function (v) {
// use encodeURI instead of encodeURIComponent
    cmd_line.push(encodeURI(v))
  })
  setTimeout(function () { self.location.replace(self.location.href.replace(/\?.+$/, "") + "?cmd_line=" + cmd_line.join("|")) }, 0)
  return
}

if (SystemEXT.enforce_WSH) {
  setTimeout(function () { Shell_OBJ.ShellExecute(System.Environment.getEnvironmentVariable("SystemRoot") + "\\System32\\WScript.exe", '"SA_launcher.js" "' + encodeURIComponent(args.join("|")) + '"', System.Gadget.path + "\\js"); setTimeout(function () { SA_top_window.close() }, 0); }, 0)
}
else {
  setTimeout(function () { Shell_OBJ.ShellExecute(System.Gadget.path + "\\js\\SA_launcher.js", encodeURIComponent(args.join("|"))); setTimeout(function () { SA_top_window.close() }, 0); }, 0)
}
    }
    return
  }

  if (!use_SA_browser_mode) {
    if (!EQP_gallery_append_mode)
      System.Gadget.Settings.writeString("Folder", path)
  }
  else if (is_SA_child_animation) {
    parent.System.Gadget.Settings._settings_need_update = true
    parent.SA_child_animation[SA_child_animation_id].f = path
// use encodeURI instead of encodeURIComponent
    setTimeout('self.location.replace(System._child_html_filename + "?f=' + encodeURI(path_to_launch) + '&id=' + SA_child_animation_id + '");', 0)
    return
  }

  SA_Reload()
}

function SA_Reload() {
// IE9 fix (RC)
  if (ie9)
    setTimeout('self.location.reload()', 0)
  else
    setTimeout('self.location.href = self.location.href', 0)
}

var Settings = {}

var WMI_ev_obj_pages

var f_path_default = path_demo[Settings_default.Folder]

var bar_color = [
  null,
  ["#51C6E2", "#0A809B"],
  ["#6DE298", "#34AA53"],
  ["#E1B775", "#DA7C0C"],
  ["#E296F6", "#CE5AD9"],
  ["#c0a0f0", "#905be5"],
  ["#6090e0", "#2b6dd5"],
  ["#f0b0c0", "#e67a96"],
  ["#31cfcc", "#249c9a"]
]

var EventToMonitor_para1

function parseEventToMonitor(str) {
  if (!str)
    str = EV_object[0].EV_string

  var ev = Settings[str]
  if (/CPU/.test(ev)) {
    EventToMonitor_para1 = (/(\d+)/.test(ev)) ? parseInt(RegExp.$1) : -1

    if (EventToMonitor_para1 == 999)
      EventToMonitor_para1 = -2

    ev = 'CPU'
  }
  else if (/NET/.test(ev)) {
    EventToMonitor_para1 = (/(\d+)/.test(ev)) ? -2 : 0
    ev = 'NET'
  }
  else if (/HDD_ALL/.test(ev)) {
    EventToMonitor_para1 = (/(\d+)/.test(ev)) ? -2 : 0
    ev = 'HDD_ALL'
  }
  else if (/SOUND/.test(ev))
    ev = 'SOUND'

  return ev
}

var EV_usage_list = [{usage:0,EV_usage:-1,EV_usage_float:-1,EV_usage_last:-1,EV_usage_last_float:-1}]

var EV_usage_sub
var Sound_EQBand_mod = 0.7
var Sound_Spectrum, Sound_classRoot

Sound_Spectrum = {
  SOUND_ALL: {
    EQ_ini:0,
    EQ_end:15,
    EQ_divider:16*1
  },

  SOUND_LOW: {
    EQ_ini:0,
    EQ_end:3,
    EQ_divider:2+4+3+1,
    EQ_factor:[2,4,3,1]
  },

  SOUND_MID: {
    EQ_ini:4,
    EQ_end:11,
    EQ_divider:1+2+3+4+4+3+2+1,
    EQ_factor:[1,2,3,4,4,3,2,1]
  },

  SOUND_HIGH: {
    EQ_ini:12,
    EQ_end:15,
    EQ_divider:1+3+4+2,
    EQ_factor:[1,3,4,2]
  }
}


function initEV(num) {
  var ev_obj = EV_object[num]

  var t = ""

  switch (ev_obj.EV_parser()) {
case "CPU":
  t = 'CPU usage (' + ((EventToMonitor_para1 > -1) ? 'core ' + (EventToMonitor_para1+1) : 'general') + ')'
  break

case "RAM":
  t = 'RAM usage'
  break

case "HDD":
case "HDD_ALL":
try {
  if ((num > 0) && /HDD/.test(EV_object[0].EV_parser()))
    ev_obj.WMI_ev_obj = EV_object[0].WMI_ev_obj
  else {
    ev_obj.WMI_ev_obj = new WMI_Refresher("Win32_PerfFormattedData_PerfDisk_LogicalDisk", "EV")
    ev_obj.WMI_ev_obj.init()
  }
}
catch (err) {}

  if (ev_obj.EV_parser() == "HDD") {
    ev_obj.drive_letter_default = ev_obj.drive_letter_system = (windows_mode) ? System.Environment.getEnvironmentVariable("SystemRoot").charAt(0).toUpperCase() : "C"
    t = 'Drive activity (' + ev_obj.drive_letter_default + ':)'
  }
  else
    t = 'Drive activity (all drives total)'
  break

case "NET":
try {
  if ((num > 0) && /NET/.test(EV_object[0].EV_parser()))
    ev_obj.WMI_ev_obj = EV_object[0].WMI_ev_obj
  else {
    ev_obj.WMI_ev_obj = new WMI_Refresher("Win32_PerfFormattedData_Tcpip_NetworkInterface", "EV")
    ev_obj.WMI_ev_obj.init()
  }
}
catch (err) {}

  ev_obj.NET = {
// assumed 10Mb/s default bandwidth
    download_peak: 1000*1000*10/8,
    upload_peak: 1000*1000*10/8
  }
  t = 'Network usage (general)'
  break

case "GPU_ENGINE":

try {
  if ((num > 0) && /GPU_ENGINE/.test(EV_object[0].EV_parser()))
    ev_obj.WMI_ev_obj = EV_object[0].WMI_ev_obj
  else {
    ev_obj.WMI_ev_obj = new WMI_Refresher("Win32_PerfFormattedData_GPUPerformanceCounters_GPUEngine", "EV")
    ev_obj.WMI_ev_obj.init()
  }
}
catch (err) {}

  t = 'GPU engine 3D usage (general)'
  break

case "SOUND":
  if (use_full_spectrum) {
    ev_obj.EV_usage_sub = EV_usage_sub_CREATE(null, "sound", 3)
    if (num == 0)
      EV_usage_sub = ev_obj.EV_usage_sub
  }

  t = "Sound output ("
  switch (Settings[ev_obj.EV_string]) {
case "SOUND_ALL":
  t += "all frequencies"
  break
case "SOUND_LOW":
  t += "bass"
  break
case "SOUND_MID":
  t += "mid-tones"
  break
case "SOUND_HIGH":
  t += "treble"
  break
  }

  t += ")"
  break

case "BATTERY_CHARGE":
  t = 'Battery Charge'
  break

case "BATTERY_REMAINING":
  t = 'Battery Charge Remaining'
  break

case "BATTERY_STATE":
  t = 'Battery State'
  break

case "BATTERY_STATE_CHARGE":
  t = 'Battery State and Charge level'
  break

case "BATTERY_STATE_REMAINING":
  t = 'Battery State and Charge remaining'
  break

case "TIMER_60_SECONDS":
  t = 'Timer (60 seconds)'
  break

case "TIMER_60_MINUTES":
  t = 'Timer (60 minutes)'
  break

case "TIMER_24_HOURS":
  t = 'Timer (24 hours)'
  break

case "FIXED_VALUE_0":
  t = 'Fixed value (0%)'
  break

case "FIXED_VALUE_50":
  t = 'Fixed value (50%)'
  break

case "FIXED_VALUE_100":
  t = 'Fixed value (100%)'
  break

case "RANDOM_VALUE":
  t = 'Random value (0-100%)'
  break
  }

  return t
}


function loadMain() {
  Settings.EventToMonitor = System.Gadget.Settings.readString("EventToMonitor")
  if (!Settings.EventToMonitor)
    Settings.EventToMonitor = Settings_default.EventToMonitor

  Settings.EventToMonitorVF = System.Gadget.Settings.readString("EventToMonitorVF")
  if (!Settings.EventToMonitorVF)
    Settings.EventToMonitorVF = Settings_default.EventToMonitorVF

  Settings.MonitorSensitivity = System.Gadget.Settings.readString("MonitorSensitivity")
  if (!Settings.MonitorSensitivity)
    Settings.MonitorSensitivity = Settings_default.MonitorSensitivity

  Settings.Monitor2Sensitivity = System.Gadget.Settings.readString("Monitor2Sensitivity")
  if (!Settings.Monitor2Sensitivity)
    Settings.Monitor2Sensitivity = Settings_default.Monitor2Sensitivity

  Settings.UpdateInterval = System.Gadget.Settings.readString("UpdateInterval")
  if (!Settings.UpdateInterval)
    Settings.UpdateInterval = Settings_default.UpdateInterval

  // Settings.Display can be pre-defined in some cases (such as simple MP4 playback)
  Settings.Display = Settings.Display || System.Gadget.Settings.readString("Display")
  if (!Settings.Display)
    Settings.Display = Settings_default.Display

  Settings.ReverseAnimation = returnBoolean("ReverseAnimation")
  Settings.UseMarkers = returnBoolean("UseMarkers")
  Settings.UseImgCache = use_gallery_img_cache = returnBoolean("UseImgCache")

  Settings.MonitorSensitivity = parseFloat(Settings.MonitorSensitivity)
  Settings.Monitor2Sensitivity = parseFloat(Settings.Monitor2Sensitivity)
  Settings.UpdateInterval = PC_count_max = parseInt(Settings.UpdateInterval)
  Settings.Display = parseInt(Settings.Display)

  Settings.CCPU = System.Gadget.Settings.readString("CCPU")
  if (!Settings.CCPU)
    Settings.CCPU = Settings_default.CCPU
  Settings.CCPU = parseInt(Settings.CCPU)

  Settings.UseAudioFFTLiveInputGain = System.Gadget.Settings.readString("UseAudioFFTLiveInputGain")
  if (!Settings.UseAudioFFTLiveInputGain)
    Settings.UseAudioFFTLiveInputGain = Settings_default.UseAudioFFTLiveInputGain
  Settings.UseAudioFFTLiveInputGain = parseFloat(Settings.UseAudioFFTLiveInputGain)

  Settings.UseCanvasNotebookDrawings = returnBoolean("UseCanvasNotebookDrawings")
  Settings.UseCanvasWatercolor = returnBoolean("UseCanvasWatercolor")
  Settings.UseCanvasVanGogh = returnBoolean("UseCanvasVanGogh")
  Settings.UseCanvasPPE = w3c_mode && self.WebGL_2D && (Settings.UseCanvasNotebookDrawings || Settings.UseCanvasWatercolor || Settings.UseCanvasVanGogh)

  Settings.UseCanvasPPEQuality = parseInt(System.Gadget.Settings.readString("UseCanvasPPEQuality") || Settings_default.UseCanvasPPEQuality)
  Settings.UseCanvasPPEContrast = parseInt(System.Gadget.Settings.readString("UseCanvasPPEContrast") || Settings_default.UseCanvasPPEContrast)
  Settings.UseCanvasPPEBrightness = parseInt(System.Gadget.Settings.readString("UseCanvasPPEBrightness") || Settings_default.UseCanvasPPEBrightness)

  Settings.CSSTransformScale = System.Gadget.Settings.readString("CSSTransformScale")
  if (!Settings.CSSTransformScale)
    Settings.CSSTransformScale = Settings_default.CSSTransformScale
  SA_zoom = parseFloat(Settings.CSSTransformScale)
  if (!SA_zoom || (SA_zoom < 0) || (SA_zoom > 3))
    SA_zoom = 1

  Settings.CSSTransformFullscreen = Settings.CSSTransformFullscreen || returnBoolean("CSSTransformFullscreen")
  if (Settings.CSSTransformFullscreen)
    SA_zoom = 1

  Settings.CSSTransformFlipH = returnBoolean("CSSTransformFlipH")
  Settings.CSSTransformFlipV = returnBoolean("CSSTransformFlipV")

  Settings.CSSTransformRotate = System.Gadget.Settings.readString("CSSTransformRotate")
  if (!Settings.CSSTransformRotate)
    Settings.CSSTransformRotate = Settings_default.CSSTransformRotate
  SA_rotate = parseFloat(Settings.CSSTransformRotate)
  if (!SA_rotate)
    SA_rotate = 0

  Settings.CSSTransform3D = System.Gadget.Settings.readString("CSSTransform3D")
  if (!Settings.CSSTransform3D || !(w3c_mode) || (!is_SA_child_animation && (!/perspective/.test(Settings.CSSTransform3D + " " + self.getComputedStyle(Lbody3D_main).msTransform) && !parseInt(self.getComputedStyle(Lbody3D).msPerspective))))
    Settings.CSSTransform3D = Settings_default.CSSTransform3D
  else if (!is_SA_child_animation) {
    if (/perspective\(\s*(\d+)/.test(Settings.CSSTransform3D)) {
      Lbody3D.style.msPerspective = RegExp.$1 + "px"
      Lbody3D._perspective = RegExp.$1
//DEBUG_show(RegExp.$1,0,1)
      Settings.CSSTransform3D = Settings.CSSTransform3D.replace(/perspective\([^\)]+\)/, "")
//DEBUG_show(Settings.CSSTransform3D,0,1)
      if (!Settings.CSSTransform3D || /^\s+$/.test(Settings.CSSTransform3D))
        Settings.CSSTransform3D = Settings_default.CSSTransform3D
    }
    else
      Lbody3D._perspective = parseInt(self.getComputedStyle(Lbody3D).msPerspective)
  }
  if (Settings.CSSTransform3D)
    Lbody._rotate3d = [0,0,0]

  Settings.CSSTransform3DBillboard = (is_SA_child_animation && returnBoolean("CSSTransform3DBillboard"))
  if (Settings.CSSTransform3DBillboard)
    parent.document.getElementById("Ichild_animation" + SA_child_animation_id)._rotate3d_billboard = [[0,0,0], [0,0,0]]

  Settings.BDSpectrumToBeat = System.Gadget.Settings.readString("BDSpectrumToBeat")
  if (!Settings.BDSpectrumToBeat)
    Settings.BDSpectrumToBeat = Settings_default.BDSpectrumToBeat

  if (returnBoolean("Use32BandSpectrum") && /SOUND/.test(Settings.EventToMonitor) && (Settings.UseAudioFFT || (is_SA_child_animation && (webkit_mode || (xul_version >= 26))))) {
    Settings.Use32BandSpectrum = true
    DEBUG_show("Use 32-band spectrum", 2)
  }

//  Settings.BPMByWebAudioAPI = returnBoolean("BPMByWebAudioAPI")
  Settings.BPMByWebAudioAPI = (w3c_mode) && !returnBoolean("AutoItBPMByBASS")

  Settings.EnableBeatDetection = returnBoolean("EnableBeatDetection")
  Settings.BDScale = System.Gadget.Settings.readString("BDScale")
  if (!Settings.BDScale)
    Settings.BDScale = Settings_default.BDScale
  Settings.BDDecay = System.Gadget.Settings.readString("BDDecay")
  if (!Settings.BDDecay)
    Settings.BDDecay =  Settings_default.BDDecay
  Settings.BDOpacity = System.Gadget.Settings.readString("BDOpacity")
  if (!Settings.BDOpacity)
    Settings.BDOpacity =  Settings_default.BDOpacity
  Settings.BDBassKick = System.Gadget.Settings.readString("BDBassKick")
  if (!Settings.BDBassKick)
    Settings.BDBassKick =  Settings_default.BDBassKick

  Settings.BDSpectrumToBeat = parseInt(Settings.BDSpectrumToBeat)
  Settings.BDScale    = parseInt(Settings.BDScale)
  Settings.BDDecay    = parseInt(Settings.BDDecay)
  Settings.BDOpacity  = parseInt(Settings.BDOpacity)
  Settings.BDBassKick = parseInt(Settings.BDBassKick)

  Settings.AllowExternalCommand = !is_SA_child_animation && returnBoolean("AllowExternalCommand")

// obsolete
/*
  Settings.HandleOversize = System.Gadget.Settings.readString("HandleOversize")
  if (!Settings.HandleOversize)
    Settings.HandleOversize = Settings_default.HandleOversize
*/

// main
  if (MacFace_mode && Settings.UseMarkers) {
    WMI_ev_obj_pages = new WMI_Refresher("Win32_PerfFormattedData_PerfOS_Memory", "EV")
    WMI_ev_obj_pages.init()
  }

  var t = initEV(0)
  initEV(1)

// sync update
if (!use_2nd_monitor && (PC_count_max == 1) && (EV_object[0].EV_parser() == "SOUND")) {
  EV_sync_update.enabled = true
}

if (self.MMD_SA_options && MMD_SA_options.WebXR) {
  RAF_animation_frame_unlimited = true
  console.log("UNLIMITED fps enforced in WebXR")
}

if (returnBoolean("UseFullFrameRate") || (use_SA_browser_mode && use_full_fps_registered)) {
  use_full_fps = true
  if (!is_SA_child_animation) {
    if (use_RAF)// && returnBoolean("Use30FPS"))
      EV_sync_update.count_to_10fps = 6
    DEBUG_show("full frame rate (" + (EV_sync_update.count_to_10fps * ((RAF_animation_frame_unlimited)?10:5)) + "fps)", 2)
    if (RAF_animation_frame_unlimited)
      console.log("UNLIMITED fps (effectively 60fps)")
  }
  else
    DEBUG_show("full frame rate", 2)
}

//  if (!webkit_electron_mode)
//    document.body.title = t

  EV_usage = EV_usage_float = EV_usage_last = EV_usage_last_float = -1

  PC_count = 1
  PC_count_absolute = 0

// main
  if (SEQ_mode && (SEQ_gallery_all.length == 1) && (!SEQ_gallery_all[0].ss_path_list || (SEQ_gallery_all[0].ss_path_list.length == 1))) {
    if (gallery_cache_obj.SS_mode)
      SEQ_gallery_all[0].gallery = gallery

    gallery_cache_obj.SS_mode = false
  }

  if (w_max && h_max) {
    gallery_dim_predefined = true

    gallery_preload_always = !!System.Gadget.Settings.readString("PreloadGalleryAlways")
    if (gallery_preload_always)
      loadImageDimALL()
    else {
      if (SEQ_mode && !gallery_cache_obj.SS_mode) {
        Seq.item("SEQ_SmartPreloading").At(0.25, "SEQ_SmartPreloading", -1, 0.25)
        Seq.item("SEQ_SmartPreloading").Play()
      }
    }
  }
  else
    loadImageDimALL()

// Give it a delay and see if it can reduce the chance of hang-up in Wallpaper Engine
// NOTE: Not suitable to have a delay here because it will break some animations.
//  setTimeout(function () {
resize()

if (!is_SA_child_animation && Lbody3D_navigation._transformOrigin) {
  SA_OnKeyDown({ keyCode:84 })
}

var _delayed_properties = (WallpaperEngine_CEF_native_mode && is_SA_child_animation && parent.wallpaperPropertyListener._delayed_properties[SA_child_animation_id])
if (_delayed_properties) {
  _delayed_properties.forEach(function (p) {
    parent.wallpaperPropertyListener.applyUserProperties(p)
  });
  delete parent.wallpaperPropertyListener._delayed_properties[SA_child_animation_id]
}
//  }, 0);


  if (webkit_electron_mode) {
    setTimeout(function () { webkit_window.show() }, 1000)
  }

// not needed in Electron anymore I suppose
/*
  if (webkit_mode && use_HTML5 && self.use_EQP_core) {
    Seq.item("WebKit_RefreshCanvas").At(10, function(){CANVAS_must_redraw=true}, -1, 10)
    Seq.item("WebKit_RefreshCanvas").Play()
  }
*/
}

var webkit_saved_screenLeft, webkit_saved_screenTop

function AutoIt_Execute(path, para, delay, callback) {
  if (non_windows_native_mode)
    return

  if (!/\.(au3|exe)$/.test(path))
    path += (returnBoolean("AutoItRunAsAU3")) ? '.au3' : '.exe'
  if (!delay)
    delay = 0

  // use setTimeout to fix some kind of unknown thread race issue
  if (webkit_mode && callback)
    setTimeout(function () {Shell_OBJ.ShellExecute(path, para, null, callback)}, delay)
  else
    setTimeout(function () {Shell_OBJ.ShellExecute(path, para)}, delay)
}

var EV_frame_offsetX, EV_frame_offsetY
var w_max_org, h_max_org
var SA_zoom_max = 2
var SA_zoom_filterType = "nearest"
var SA_zoom = 1//*1.5
var SA_rotate = 0//+90
var SA_body_offsetX, SA_body_offsetY
var SA_use_full_desktop
var SA_fullscreen_offsetX, SA_fullscreen_stretch_to_cover, SA_fullscreen_offsetY, is_SA_fullscreen_offset_custom
var B_content_width, B_content_height

// to absolutely make sure that there is no dead loop in resize
var _resize_loop_ = 0
var _resize_loop_timerID = null

function resize(no_focus, custom_resize, no_fullscreen_resize, fullscreen_adjust_position) {
// Fix some extreme cases in which resize can be run before DOM content is ready
  if (document.readyState == "loading")
    return

  if (++_resize_loop_ >= 100) {
    DEBUG_show("WARNING: dead loop in resize, possibly a bug",0,1)
    return
  }
  if (_resize_loop_timerID)
    clearTimeout(_resize_loop_timerID)
  _resize_loop_timerID = setTimeout(function(){_resize_loop_timerID=null; _resize_loop_=0;}, 100)


  var _SA_zoom = SA_zoom

  var screen_w, screen_h
  if (SA_use_full_desktop || (webkit_electron_mode && !is_SA_child_animation && returnBoolean("AutoItStayOnDesktop"))) {
    screen_w = screen.width
    screen_h = screen.height
  }
  else {
    screen_w = screen.availWidth
    screen_h = screen.availHeight
  }

// Native IMG START
if (use_native_img) {
  if (!w_max_org)
    w_max_org = w_max
  if (!h_max_org)
    h_max_org = h_max

  image_ratio = (System.Gadget.docked) ? 0.5 : 1

  BG.removeObjects()

  gallery_cache_obj.use_native_img = true
  gallery_cache_obj.clear()
  pic_last = null

  for (var i = 0; i < native_img_objs.length; i++)
    native_img_objs[i].clear()
}
// END

  if (custom_resize) {
    custom_resize()
  }
  else {
    if (self.EV_init)
      EV_init()
    if (self.EV_init2)
      EV_init2()
  }
  if (Settings.CSSTransform3DBoxAnimate && Box3D.init)
    Box3D.init()

  if (Canvas_Effect && !Canvas_Effect._initialized) {
    Canvas_Effect._initialized = true
    DEBUG_show("Use " + Canvas_Effect.name + " effect", 2)

    if (!EV_usage_sub)
      EV_usage_sub = EV_object[0].EV_usage_sub = EV_usage_sub_CREATE(null, "sound", 3)

//using absolute equality here
    if (Canvas_Effect.canvas === null) {
      Canvas_Effect._use_default_canvas = true

      var c_host = (returnBoolean("CSSTransform3DDisabledForContent")) ? document.getElementById("Lbody_host") : document.getElementById("Lbody")

      var c = Canvas_Effect.canvas = document.createElement("canvas")
      c.id = "CR"
      var cs = c.style
      cs.position = "absolute"
      cs.posLeft = cs.posTop = 0
      cs.zIndex = (Canvas_Effect.show_behind_content) ? 1 : 10
      c_host.appendChild(c)

      var c_for_hiding = c
      if (use_WebGL_2D) {
        WebGL_2D.createObject(c)
        c_for_hiding = (document.getElementById("SL")) ? null : c._WebGL_2D.canvas
      }

      // NOTE: global variable "CR" is not pointing to the CR canvas in some cases. Use direct reference to the canvas instead.
      if (use_SA_browser_mode && c_for_hiding)
        System._browser.mouseover_hide_list.push(c_for_hiding)
    }
  }

if (use_native_img) {
  w_max = w_max_org * image_ratio
  h_max = h_max_org * image_ratio
}

  if (!EV_frame_offsetX)
    EV_frame_offsetX = 0
  if (!EV_frame_offsetY)
    EV_frame_offsetY = 0

  var oBody = document.body.style

  var w_base, h_base
  if (System.Gadget.docked) {
    w_base = (w_max > 130) ? ((w_max < 140) ? w_max : 140) : 130
    h_base = 260
  }
  else {
    w_base = (w_max > 130) ? w_max : 130
    h_base = Math.max(h_max, 999)
  }

  b_width = (self.EV_b_width) ? EV_b_width : w_base
  b_height = (self.EV_b_height) ? EV_b_height : ((h_max > h_base) ? h_base : h_max)

  B_width = (self.EV_width) ? EV_width : b_width
  if (B_width < w_base)
    B_width = w_base
  B_height = (self.EV_height) ? EV_height : b_height

  if (self.EV_BG_src) {
    BG.src = EV_BG_src
//setTimeout('DEBUG_show("(BG: user defined)", 2)', 1000)
  }
  else {
    var bg_w, bg_h, bg_src
    if (self.EV_BG_src == "") {
      bg_w = BG.style.pixelWidth
      bg_h = BG.style.pixelHeight
    }
    else {
      bg_w = B_width  * SA_zoom
      bg_h = B_height * SA_zoom
    }

// IE9 fix
if (ie9) {
  if (bg_w < 130)
    bg_w = 130
}

    if (self.EV_BG_allow_dummy || (!MacFace_mode && !use_native_img && (!self.EV_init || (!self.EV_width && !self.EV_height)))) {
// IE9 fix
if (!ie9)
  bg_w = bg_h = 1

      bg_src = "images/_bg_dummy/1x1.png"
//DEBUG_show("(BG: OFF)", 2)
    }
    else {
      bg_src = "images/bg.png"
//setTimeout('DEBUG_show("(BG: default)", 2)', 1000)
    }

    BG.style.pixelWidth  = bg_w
    BG.style.pixelHeight = bg_h

    BG.src = bg_src

    // Windows 7's savior
    BG.opacity = 0
  }


  var bar_height = 8+((ie8_mode)?2:0)
  var bw = B_width
  var bh = B_height + ((Settings.Display > 0) ? bar_height*EV_usage_list.length : 0)
  var fullscreen = use_SA_browser_mode && Settings.CSSTransformFullscreen && (!is_SA_child_animation || is_SA_child_animation_host)

// Hopefully reduce the chance of random hang-ups during startup when running on Wallpaper Engine CEF
  if (WallpaperEngine_CEF_mode && self.MMD_SA && !MMD_SA_options.MMD_disabled && !MMD_SA.MMD_started && !is_SA_child_animation_host) fullscreen = false;

  if (fullscreen && !no_fullscreen_resize) {
    var w_ratio = screen_w / bw
    var h_ratio = screen_h / bh
    var zoom, stretch_to_cover
    if (SA_fullscreen_stretch_to_cover || (webkit_electron_mode && returnBoolean("AutoItStayOnDesktop"))) {
      var screen_aspect = screen_w / screen_h
      var ani_aspect = bw / bh
      if (((screen_aspect > ani_aspect) ? screen_aspect/ani_aspect : ani_aspect/screen_aspect) <= 1.25) {
        stretch_to_cover = true
        zoom = (w_ratio > h_ratio) ? w_ratio : h_ratio
      }
    }
    if (!zoom)
      zoom = (w_ratio < h_ratio) ? w_ratio : h_ratio

    // prevent dead loop due to roundup issues
    if (Math.abs(zoom - 1) > 0.05) {
      DEBUG_show("Fullscreen", 2)
      SA_zoom = zoom

if (stretch_to_cover) {
  SA_fullscreen_offsetX = (screen_w - Math.round(bw * zoom)) / 2
  SA_fullscreen_offsetY = (screen_h - Math.round(bh * zoom)) / 2
}
else {
  if (!is_SA_fullscreen_offset_custom)
    SA_fullscreen_offsetX = SA_fullscreen_offsetY = 0
}

// always disable CSS zoom for some animation types, even with child animations
      if (1 || !returnBoolean("CSSTransformToChildAnimation")) {
        if (self.EQP_size_scale && !self.EQP_video_options) {
          EQP_size_scale = zoom * EQP_size_scale
          SA_zoom = 1
          resize(true, function(){EQP_resize(EQP_size_scale)}, null,fullscreen_adjust_position)
          return
        }
        if ((self.MMD_SA && MMD_SA.use_jThree) || self.SV3D) {
          resize(null,null, true, fullscreen_adjust_position)
          return
        }
      }
    }

  }
  else {
    if (!is_SA_fullscreen_offset_custom)
      SA_fullscreen_offsetX = SA_fullscreen_offsetY = 0
  }

/*
  if ((SA_zoom != 1) && self.EQP_size_scale && use_WebGL_2D && (EQP_size_scale != SA_zoom)) {
//DEBUG_show(EQP_size_scale +','+ SA_zoom,0,1)
    EQP_size_scale = SA_zoom * EQP_size_scale
    SA_zoom = 1
    resize(null, function(){EQP_resize(EQP_size_scale)})
    return
  }
*/

  for (var i = 0, i_max = EV_usage_list.length; i < i_max; i++) {
    var id_prefix = "LCPU_main" + i
    var c = document.getElementById(id_prefix)
    if (!c)
      continue

    var cs = c.style
    if (Settings.Display > 0) {
      var color = bar_color[Settings.Display]
      document.getElementById(id_prefix + "_up").style.backgroundColor = color[0]
      document.getElementById(id_prefix + "_down").style.backgroundColor = color[1]

      if (ie8_mode) {
        document.getElementById(id_prefix + "_up").style.pixelHeight = document.getElementById(id_prefix + "_down").style.pixelHeight = document.getElementById(id_prefix + "_down").style.posTop = 4
        document.getElementById(id_prefix + "_content").style.pixelHeight = 8
      }

      if (w3c_mode && !bar_accelerate)
        document.getElementById(id_prefix + "_content").style.transition = "width " + (PC_count/10) + "s ease-out"

      cs.posTop = B_height + bar_height*i
      cs.pixelWidth = B_width - ((ie8_mode)?2:0)
      cs.visibility = "inherit"
    }
    else
      cs.visibility = "hidden"
  }

  var cs = Lmain_obj.style
  var bs = Lbody_host.style
  var x_shift = 0
  var y_shift = 0
  if (ie9_mode) {
    bs.pixelWidth  = bw
    bs.pixelHeight = bh

    var CSSTransform3D = Settings.CSSTransform3D
    if (w3c_mode && CSSTransform3D) {
      if (!is_SA_child_animation && !Lbody3D_navigation._transformOrigin) {
        if (/translateZ\(([^\)]+)\)|translate3d\([^\,]+\,[^\,]+\,([^\)]+)\)/.test(Settings.CSSTransform3D + " " + self.getComputedStyle(Lbody3D_main).msTransform))
          Lbody3D_navigation._z_view = parseFloat(RegExp.$1.trim())
        if (!Lbody3D_navigation._z_view)
          Lbody3D_navigation._z_view = 0

        Lbody3D_navigation._transformOrigin = Lbody3D_navigation.style.msTransformOrigin
        if (!Lbody3D_navigation._transformOrigin) {
          if (Settings.CSSTransform3DBoxAnimate) {
            Lbody3D_navigation._z_origin = Settings.CSSTransform3DBoxAnimate/2
          }
          else {
            Lbody3D_navigation._z_origin = -Lbody3D_navigation._z_view/2
          }
          Lbody3D_navigation.style.msTransformOrigin = Lbody3D_navigation._transformOrigin = "50% 50% " + Lbody3D_navigation._z_origin + "px"
        }
//DEBUG_show(Lbody3D_navigation._transformOrigin,0,1)

        Lbody3D_navigation._rotate3d = [0,0,0, 0]
        Lbody3D_navigation._translate3d = [0,0,0]
        Lbody3D_control.addEventListener("dblclick", function (event) {
Lbody3D_navigation.style.msTransform = ""
Lbody3D_navigation.style.msTransformOrigin = Lbody3D_navigation._transformOrigin
Lbody3D_navigation._rotate3d = [0,0,0, 0]
Lbody3D_navigation._translate3d = [0,0,0]

if (!is_SA_child_animation) {
  for (var i = 0; i < SA_child_animation_max; i++) {
    if (SA_child_animation[i])
      document.getElementById("Ichild_animation" + i).style.msBackfaceVisibility = "visible"
  }
}

DEBUG_show("(3D navigation reset)", 2)

event.stopPropagation()
        }, true)

// 3D Navigation
        Lbody3D_control._timerID = null
        Lbody3D_control.addEventListener("mousedown", function (event) {
if (this._timerID)
  clearTimeout(this._timerID)

if (event.button) return

this._timerID = setTimeout("Lbody3D_control._3d_navigation_start()", 250)
System._browser.onmouseup_custom = this._3d_navigation_cancel

this._x = event.clientX
this._y = event.clientY

event.stopPropagation()
        }, true)

        Lbody3D_control._3d_navigation_cancel = function () {
if (Lbody3D_control._timerID) {
  clearTimeout(Lbody3D_control._timerID)
  Lbody3D_control._timerID = null
}
System._browser.onmouseup_custom = null
        }

        Lbody3D_control._3d_navigation_start = function () {
this._timerID = null

var sb = System._browser
sb._drag_disabled_ORIGINAL = !!sb._drag_disabled
sb._drag_disabled = true
sb.onmousemove_custom = this._3d_navigation
sb.onmouseup_custom = this._3d_navigation_finish
sb.showFocus(true)

DEBUG_show("(3D navigation)", 2)
        }

        Lbody3D_control._3d_navigation = function (event) {
var ex = event.clientX
var ey = event.clientY

var x = ex - Lbody3D_control._x
var y = ey - Lbody3D_control._y

Lbody3D_control._x = ex
Lbody3D_control._y = ey

var rotate_y = x / B_content_width
var rotate_x = y / B_content_height

var r3d = Lbody3D_navigation._rotate3d
r3d[0] = (r3d[0] + (-rotate_x*360)) % 360
r3d[1] = (r3d[1] +  (rotate_y*360)) % 360
Lbody3D_navigation._transformed = true

System._browser.showFocus(true)
        }

        Lbody3D_control._3d_navigation_finish = function () {
var sb = System._browser
sb.onmousemove_custom = sb.onmouseup_custom = null
sb._drag_disabled = sb._drag_disabled_ORIGINAL
sb.showFocus(false)
        }

        Lbody3D_control.addEventListener(((webkit_mode)?"mousewheel":"DOMMouseScroll"), function (event) {
var rolled;
if ('wheelDelta' in event) {
  rolled = event.wheelDelta;
}
else {  // Firefox
  // The measurement units of the detail and wheelDelta properties are different.
  rolled = -40 * event.detail;
}
//DEBUG_show(rolled,0,1)
Lbody3D_navigation._translate3d[2] += rolled/12 *2
Lbody3D_navigation._transformed = true
        }, false)
      }

      var b3d = (is_SA_child_animation && returnBoolean("CSSTransformToChildAnimation")) ? parent.document.getElementById("Ichild_animation" + SA_child_animation_id) : Lbody3D_main

      if (/\{(.+)\}/.test(CSSTransform3D)) {
        var css = RegExp.$1.split(";")
        var prefix = (xul_mode) ? "Moz" : "webkit"
        for (var i = 0; i < css.length; i++) {
          if (!/^(.+)\:(.+)$/.test(css[i].trim()))
            continue

          var n = RegExp.$1.trim()
          var v = RegExp.$2.trim()
          if (/transform|perspective/i.test(n))
            n = prefix + n.charAt(0).toUpperCase() + n.substr(1)
          n = n.replace(/\-(\w)/, function (str, p1) { return p1.toUpperCase() })

          b3d.style[n] = v
        }
      }
      else {
        b3d.style.msTransformOrigin = "50% 50%"
        b3d.style.msTransform = CSSTransform3D
      }
      b3d._transform_base = b3d.style.msTransform
    }

    var transform = []

    if (SA_rotate) {
var r = SA_rotate/180 * Math.PI
var a = Math.atan2(bh, bw)
var cos = Math.cos
var sin = Math.sin
var corners = [[cos(a+r),sin(a+r)], [cos(-a+r),sin(-a+r)]]

var max_x = 0
var max_y = 0
var abs = Math.abs
for (var i = 0; i < 2; i++) {
  var c = corners[i]
  var x = abs(c[0])
  var y = abs(c[1])
  if (max_x < x)
    max_x = x
  if (max_y < y)
    max_y = y
}

var diag = Math.sqrt(bw*bw + bh*bh)
x_shift = (max_x * diag - bw)  / 2
y_shift = (max_y * diag - bh) / 2

if (fullscreen) {
  var w_ratio = screen_w / (bw * SA_zoom + x_shift*2*SA_zoom)
  var h_ratio = screen_h / (bh * SA_zoom + y_shift*2*SA_zoom)
  SA_zoom *= (w_ratio < h_ratio) ? w_ratio : h_ratio
}

      transform.push("rotate(" + r + "rad)")
    }
    if ((SA_zoom != 1) || Settings.CSSTransformFlipH || Settings.CSSTransformFlipV) {
      const mod = SA_zoom - 1;
      transform.unshift("translate(" + (bw*mod/2) + "px," + (bh*mod/2) + "px)");
      transform.push("scale(" + (SA_zoom * ((Settings.CSSTransformFlipH)?-1:1)) + "," + (SA_zoom * ((Settings.CSSTransformFlipV)?-1:1)) + ")");
    }

    x_shift *= SA_zoom
    y_shift *= SA_zoom

    if (transform.length) {
// NOTE: assigning custom property to "style" (eg. Lbody_host.style._transformed) is not reliable
      Lbody_host._transformed = true
      bs.msTransformOrigin = "50% 50%"
      bs.msTransform = transform.join(" ")
      DEBUG_show("Use CSS Transform", 2)
    }
    else if (Lbody_host._transformed) {
      bs._transformed = false
      bs.msTransform = bs.msTransformOrigin = ""
    }
  }
  else {
    cs.pixelWidth  = B_width  * SA_zoom - (cs.posLeft * 2)
    cs.pixelHeight = B_height * SA_zoom - (cs.posTop  * 2)
    cs.filter = (SA_zoom == 1) ? "" : "progid:DXImageTransform.Microsoft.Matrix(M11=" + SA_zoom + ", M22=" + SA_zoom + ", FilterType='" + SA_zoom_filterType + "')"
  }

  if (Canvas_Effect && Canvas_Effect._use_default_canvas) {
    var cw = (Canvas_Effect.width)  ? Canvas_Effect.width  : B_width
    var ch = (Canvas_Effect.height) ? Canvas_Effect.height : B_height
    var dim = Canvas_Effect.resize(cw,ch, B_width)
    // NOTE: global variable "CR" is not pointing to the CR canvas in some cases. Use direct reference to the canvas instead.
    var c = Canvas_Effect.canvas
    c.style.posLeft = dim[0]
    c.style.posTop  = dim[1]
    c.width  = dim[2]
    c.height = dim[3]
  }

  if (SA_body_offsetX)
    x_shift += SA_body_offsetX
  if (SA_body_offsetY)
    y_shift += SA_body_offsetY

  if (SA_fullscreen_offsetX)
    x_shift += parseInt(SA_fullscreen_offsetX/SA_zoom)
  if (SA_fullscreen_offsetY)
    y_shift += parseInt(SA_fullscreen_offsetY/SA_zoom)

  B_content_width  = bw * SA_zoom + x_shift*2
  B_content_height = bh * SA_zoom + y_shift*2

  if (WallpaperEngine_mode && !is_SA_child_animation) {
    if (!SA_fullscreen_offsetX && (B_content_width  < screen_w) && (!self.MMD_SA || !fullscreen)) {
      x_shift += (screen_w - B_content_width)  / 2
    }
    if (!SA_fullscreen_offsetY && (B_content_height < screen_h) && (!self.MMD_SA || !fullscreen)) {
      y_shift += (screen_h - B_content_height) / 2
    }
  }

  B_content_width  = bw * SA_zoom + x_shift*2
  B_content_height = bh * SA_zoom + y_shift*2

  bs.posLeft = x_shift
  bs.posTop  = y_shift

  oBody.pixelWidth  = B_content_width
  oBody.pixelHeight = B_content_height

  if (use_SA_system_emulation) {
    let ls = Lquick_menu.style
    let qmb_list = document.getElementsByClassName("QuickMenu_button")
    let qmb_count = 6
    if ((B_content_height > screen_h-10)/* || fullscreen*/) {
      ls.posTop = 20+4
      for (var i = 0; i < qmb_list.length; i++)
        qmb_list[i].className = "QuickMenu_button QuickMenu_button_TL"
    }
    else {
      ls.posTop = ((browser_native_mode) ? screen_h : B_content_height) - (20+4)
      for (var i = 0; i < qmb_list.length; i++)
        qmb_list[i].className = "QuickMenu_button"
    }

    LbuttonTL.style.posLeft = ((browser_native_mode) ? screen_w : Math.min(B_content_width, screen_w)) - 24 - 12
    LbuttonTL.style.posTop  = 12
    if (is_mobile && (is_SA_child_animation_host || self.MMD_SA)) {
      if (document.fullscreenElement) {
        LbuttonFullscreen.style.visibility = "hidden"
        LbuttonRestore.style.visibility = "inherit"
      }
      else {
        LbuttonFullscreen.style.visibility = "inherit"
        LbuttonRestore.style.visibility = "hidden"
      }
    }
    else if (!is_SA_child_animation_host) {
      if ((_SA_zoom == 1) && !fullscreen && !SA_rotate) {
        LbuttonFullscreen.style.visibility = "inherit"
        LbuttonRestore.style.visibility = "hidden"
      }
      else {
        LbuttonFullscreen.style.visibility = "hidden"
        LbuttonRestore.style.visibility = "inherit"
      }
    }

    LbuttonLR.style.posLeft = ((browser_native_mode) ? screen_w : Math.min(B_content_width, screen_w)) - 24
    LbuttonLR.style.posTop  = ((browser_native_mode) ? screen_h : Math.min(B_content_height, screen.availHeight)) - 24

    if (!self.EQP_dragdrop_target) {
      Lquick_menu_gallery_button.style.display = "none"
      qmb_count--
    }

    if (!self.MMD_SA_options || !MMD_SA_options.WebXR || !MMD_SA_options.WebXR.AR) {
      Lquick_menu_ar_button.style.display = "none"
      qmb_count--
    }
//    ls.visibility = "inherit"

    if (WallpaperEngine_mode) {
      ls.posLeft = Math.min(B_content_width, screen_w) - (18*5+2)
      ls.posTop  = Math.min(B_content_height, screen.availHeight) - 24
    }

    ls.pixelWidth = (18*((is_mobile)?2:1)*qmb_count+2)

    if (is_mobile) {
      Lquick_menu.style.transform = Idialog.style.transform = "scale(" + (System._browser.css_scale*2) + ")"
    }
    if (is_mobile && self.MMD_SA_options) {
      Lnumpad.style.posLeft = B_content_width - 200
      Lnumpad.style.posTop  = 64
      Lnumpad.style.visibility = "inherit"
      Lnumpad.style.transform = "scale(" + (1 + (System._browser.css_scale-1)*0.5) + ")"
    }
  }

  if (browser_native_mode && !is_SA_child_animation) {
    Lbody_host.style.posLeft = Math.max((screen_w - B_content_width) /2, 0)
    Lbody_host.style.posTop  = Math.max((screen_h - B_content_height)/2, 0)
  }

  if (use_SVG_Clock)
    SVG_Clock.resize(B_width, B_height)

  if (!image_ratio)
    image_ratio = 1

  if (is_SA_child_animation) {
    var list = System._browser.mouseover_hide_list
    for (var i = 0; i < list.length; i++)
      list[i].style.visibility = "inherit"
    System._browser.WMPMask_Draw()
  }

  if ((fullscreen && fullscreen_adjust_position) || (webkit_electron_mode && returnBoolean("AutoItStayOnDesktop"))) {
//    var sx = parseInt((screen_w - B_content_width) / 2)
//    var sy = parseInt((screen_h - B_content_height) / 2)
    var _sx, _sy
    var sx = _sx = SA_top_window.screenLeftAbsolute
    var sy = _sy = SA_top_window.screenTopAbsolute

    screen_w = screen.availWidth
    screen_h = screen.availHeight

    var b = SA_top_window.getScreenBounds(sx, sy)

    if (sx > b.x + screen_w - B_content_width)
      sx = b.x + screen_w - B_content_width
    if (sy > b.y + screen_h - B_content_height)
      sy = b.y + screen_h - B_content_height

    if (sx < 0)
      sx = 0
    if (sy < 0)
      sy = 0

    if (webkit_electron_mode && ((sx != _sx) || (sy != _sy))) {
      System._browser._s_left = System._browser._s_top = null
      if (System._browser._window_move_timerID) {
        clearTimeout(System._browser._window_move_timerID)
        System._browser._window_move_timerID = null
      }
      let xy = SA_top_window.getPos()
      if ((xy[0] != sx) || (xy[1] != sy)) {
        System._browser._window_move_timerID = setTimeout("System._browser._window_move_timerID=null; SA_top_window.moveToAbsolute(" + sx + "," + sy + "); System._browser.moveWallpaper(" + sx + "," + sy + ");", 0)
      }
    }
  }

  if ((System._browser._s_left != null) && (System._browser._s_top != null)) {
    if (System._browser._window_move_timerID) {
      clearTimeout(System._browser._window_move_timerID)
      System._browser._window_move_timerID = null
    }
    let xy = SA_top_window.getPos()
    if ((xy[0] != System._browser._s_left) || (xy[1] != System._browser._s_top)) {
      System._browser._window_move_timerID = setTimeout(function () {
System._browser._window_move_timerID = null
SA_top_window.moveToAbsolute(System._browser._s_left, System._browser._s_top)
System._browser._s_left = System._browser._s_top = null
      }, 0);
    }
  }

// after all window moving/resizing timers (Electron v9+)
  if (webkit_mode)
    document.body.style._set()

  if (self.SL_MC_video_obj)
    SL_MC_Place()

// skip for HTA
  if (!ie9_native) {
    window.dispatchEvent(new CustomEvent("SA_resize"));
  }

  if (!no_focus) {
//if (!is_SA_child_animation) console.log(999)
    setTimeout('self.focus()', 250)//; if (webkit_mode) {System._browser.moveWallpaper()}', 300)
  }
}

function Settings_writeJS(f_path, excluded_settings) {
try {
  if (!f_path && ie9_mode && !is_SA_child_animation) {
    for (var i = 0; i < SA_child_animation_max; i++) {
      var ani = SA_child_animation[i]

      var v
      if (ani) {
        var f = ani.f
        var f_obj = ValidatePath(f)
        var is_folder = (!f_obj || f_obj.isFolder)
        var f_folder = (is_folder) ? f : f.replace(/[\/\\][^\/\\]+$/, "")

        if (f.indexOf(SA_HTA_folder) == 0)
          v = '$SA_HTA_folder$' + f.substr(SA_HTA_folder.length)
        else if (f.indexOf(SA_HTA_folder_parent) == 0)
          v = '$SA_HTA_folder_parent$' + f.substr(SA_HTA_folder_parent.length)
        else if (System.Gadget._path_folder() == f_folder.replace(/[\/\\][^\/\\]+$/, "")) {
          v = '$System.Gadget._path_folder()$\\' + ((is_folder) ? '' : f_folder.replace(/^.+[\/\\]/, toLocalPath("\\"))) + f.replace(/^.+[\/\\]/, "")
        }
        else
          v = f
        v += "|"+ani.x+"|"+ani.y+"|"+ani.z+"|"+ani.opacity
      }
      else
        v = ""

      System.Gadget.Settings.writeString("ChildAnimation"+i, v)
    }
  }

var animation_changed, path_obj, cf, f_path_full
if (f_path) {
  animation_changed = true

  path_obj = ValidatePath(f_path)
  cf = (path_obj.isFolder) ? f_path : f_path.replace(/[\/\\][^\/\\]+$/, "")
}
else {
  f_path = loadFolder_CORE()
  path_obj = ValidatePath(f_path)
}
var f_path_raw = f_path

f_path_full = "$SA_HTA_folder$" + ((path_obj.isFolder) ? "" : encodeURIComponent(f_path.replace(/^.+[\/\\]/, toLocalPath("\\"))))

var _settings = {}
var demo_found
demo_found = path_demo_by_url[f_path]
if (demo_found)
  _settings.Folder = demo_found
//if (!demo_found)
  f_path = f_path_full
//alert(SA_HTA_folder+','+path_obj.path)

  var q = '"'

  var saved_settings = []
  for (var i = 0; i < Setting_name_list.length; i++) {
    var s = Setting_name_list[i]
    var v = _settings[s] || System.Gadget.Settings.readString(s, true)
    if (!v || (v == Settings_default[s]))
      continue
    if (excluded_settings && excluded_settings[s])
      continue

if (animation_changed && /^ChildAnimation\d/.test(s))
  continue

v = (s == "Folder") ? ((/^demo/.test(v)) ? v : f_path) : encodeURIComponent(v);
    saved_settings.push(q + s + q + ':' + q + v + q)
  }
  for (var i = 0; i < Setting_name_list_boolean.length; i++) {
    var s = Setting_name_list_boolean[i]
    var v = returnBoolean(s)
    if (v == Settings_default[s])
      continue
    if (excluded_settings && excluded_settings[s])
      continue

    saved_settings.push(q + s + q + ':"non_default"')
  }
  saved_settings.push('"_screenLeft":"' + ((use_SA_browser_mode && !is_SA_child_animation) ? ((webkit_saved_screenLeft) ? webkit_saved_screenLeft : SA_top_window.screenLeftAbsolute) : 100) + '"')
  saved_settings.push('"_screenTop":"'  + ((use_SA_browser_mode && !is_SA_child_animation) ? ((webkit_saved_screenTop)  ? webkit_saved_screenTop  : SA_top_window.screenTopAbsolute)  : 100) + '"')

  if (use_SA_browser_mode) {
    var settings = System.Gadget.Settings._settings
    for (var s in settings) {
      if (!/^(LABEL|SA)_/.test(s))
        continue

      var v = System.Gadget.Settings.readString(s)
      if (!v)
        continue

v = (s == "LABEL_Folder") ? ((animation_changed) ? "" : f_path) : encodeURIComponent(v);
      saved_settings.push(q + s + q + ':' + q + v + q)
    }
  }
//alert(saved_settings)
  SystemEXT.SaveLocalSettings(saved_settings, cf, f_path_raw)
}
catch (err) {}
}

function CheckDockState() {
//  System.Gadget.beginTransition();
  resize()
//  System.Gadget.endTransition(1, 2);
}

var EV_usage, EV_usage_float, EV_usage_last, EV_usage_last_float

var PC_count_max = 10
var PC_count = 1

var bar_accelerate = true

function barPhysics(s) {
  if (!bar_accelerate || (PC_count_max == 1))
    return s

  var t = (PC_count_max - PC_count) / PC_count_max
  if (!bar_accelerate)
    return s*t

  var u = s*2
  var a = -u
  var s_final = u*t + 0.5*a*t*t

  return s_final
}

var EV_sync_update = {
  enabled: false
 ,count: 0

 ,count_to_10fps_: 4
 ,count_to_10fps: 4

 ,count_frame: 0

 ,no_update_count: 0
 ,no_animation_count: 99

 ,requestAnimationFrame_auto: true

// fps count
 ,fps_count: 0
 ,fps_count_start_time: 0
 ,fps_last: 0
 ,fps_count_func: function (inc) {
var now = Date.now()
if (this.fps_count >= 100) {
  this.fps_last = 1000 / ((now - this.fps_count_start_time) / this.fps_count)
  this.fps_count = 0
}
if (!this.fps_count)
  this.fps_count_start_time = now

this.fps_count += (inc == null) ? 1 : inc
  }

// function to detect frame change at a 10fps basis
 ,frame_changed_count: []
 ,frame_changed: function (name) {
var count = this.frame_changed_count[name]
var changed = (!count || (count != PC_count_absolute))
this.frame_changed_count[name] = PC_count_absolute

return changed
  }

// timer
 ,timer_time_min: 99999
 ,timer_time_max: 0
 ,timer_start: function () {
this.timer_time_start = Date.now()
  }
 ,timer_stop: function () {
var t = this.timer_time_start
if (!t)
  return
var t_diff = Date.now() - t
if (this.timer_time_min > t_diff)
  this.timer_time_min = t_diff
if (this.timer_time_max < t_diff)
  this.timer_time_max = t_diff
DEBUG_show(this.timer_time_min+'/'+this.timer_time_max+','+t_diff)
  }

// Seq timer RAF mode TEST
 ,Seq_func: {}

 ,RAF_func: []

// misc
 ,_beat_last1: 0
 ,_beat_last2: 0
}

if (use_SA_browser_mode) {
  Object.defineProperty(EV_sync_update, "count_to_10fps",
{
  get: function () {
if (is_SA_child_animation && parent.loaded)
  this.count_to_10fps_ = parent.EV_sync_update.count_to_10fps_
return this.count_to_10fps_
  }

 ,set: function (v) {
this.count_to_10fps_ = v
  }
});
}

var use_RAF = !!window.requestAnimationFrame
var RAF_timerID = null
var RAF_timestamp = 0
var RAF_timestamp_delta = 0
var RAF_timestamp_delta_accumulated = 0
var RAF_frame_time_delayed = 0
var RAF_frame_drop = 0

var Animate_RAF = function (timestamp) {
//EV_sync_update.fps_count_func()
  if (EV_sync_update.requestAnimationFrame_auto)
    RAF_timerID = requestAnimationFrame(Animate_RAF)
  else
    RAF_timerID = null
//RAF_timerID = setTimeout(function () { Animate_RAF(performance.now()) }, 1000/60)

  if (EV_sync_update.RAF_paused) {
    RAF_timestamp = timestamp
    return
  }

  if (RAF_timestamp) {
    RAF_timestamp_delta = timestamp - RAF_timestamp + RAF_timestamp_delta_accumulated

    let ms_per_frame = 1000 / (EV_sync_update.count_to_10fps_ * 10)
    let time_diff = RAF_timestamp_delta - ms_per_frame
    RAF_frame_time_delayed += time_diff

    if (RAF_frame_time_delayed < -ms_per_frame) {
// funny that -= or += makes no big difference as fps control (-= seems more logical though)
      RAF_frame_time_delayed -= time_diff
//DEBUG_show(~~RAF_frame_time_delayed+'/'+ ~~time_diff,0,1)
//console.log(++RAF_frame_drop)
      return
    }
    else if (RAF_frame_time_delayed > ms_per_frame) {
      RAF_frame_time_delayed = ms_per_frame
    }
  }
  RAF_timestamp = timestamp
/*
// Seq timer RAF mode TEST
  try {
    for (var name in EV_sync_update.Seq_func) {
      EV_sync_update.Seq_func[name]()
      delete EV_sync_update.Seq_func[name]
    }
  }
  catch (err) { console.error(err) }
*/
  Animate()
}

function Animate() {
//EV_sync_update.fps_count_func()
//if (!is_SA_child_animation && EV_sync_update.fps_last) { console.log('FPS:' + EV_sync_update.fps_last); EV_sync_update.fps_last=0; }
  var active_child = []
  if (ie9_mode && !is_SA_child_animation) {
    for (var i = 0; i < SA_child_animation_max; i++) {
      if (SA_child_animation[i])
        active_child.push(i)
    }
  }
  var child_loaded_max = active_child.length

  if (!EV_sync_update.loaded_synced) {
    var child_loaded = 0
    for (var i = 0; i < child_loaded_max; i++) {
      try {
        var w = document.getElementById("Ichild_animation" + active_child[i]).contentWindow
        if (w.loaded)
          child_loaded++
      }
      catch (err) {}
    }

    if (child_loaded == child_loaded_max)
      EV_sync_update.loaded_synced = true
    else
      return
  }

  Animate_core()

//var sync_label = EV_sync_update.count+"|"+EV_sync_update.no_update_count+"|"+EV_sync_update.no_animation_count
  for (var i = 0; i < child_loaded_max; i++) {
    try {
      var w = document.getElementById("Ichild_animation" + active_child[i]).contentWindow
      if (w.loaded) {
        w.RAF_timestamp = RAF_timestamp
        w.Animate()
//if (w.EV_sync_update.count+"|"+w.EV_sync_update.no_update_count+"|"+w.EV_sync_update.no_animation_count != sync_label) DEBUG_show("asynced",0,1)
      }
    }
    catch (err) {}
  }

  // for embeded Spetcurm Analyser, to avoid the effects of any possible thread racing issues
  if (EV_sync_update.count % 2) {
    if (spectrum_analyser) {
      try {
        var w = spectrum_analyser.contentWindow
        if (w.SA_update_mode && w.loaded)
          w.updateDisplay()
      }
      catch (err) {}
    }
  }
}

var RAF_animation_frame_timestamp_last = 0
var RAF_animation_frame_time_delayed = 0
var RAF_animation_frame_always_update = false
var RAF_animation_frame_unlimited = returnBoolean("Use60FPS")
//RAF_animation_frame_unlimited = true

var SA_external_command_JSON_time_ref = -1
var SA_external_command_JSON_path

function Animate_core() {
  var count_to_10fps = EV_sync_update.count_to_10fps
  var update, update_event, always_update_event
  if (EV_sync_update.enabled || EV_sync_update.allow_update_between_frames) {
    update = update_event = true
    // always update on the very first frame
    if (EV_sync_update.count == 0)
      always_update_event = true
  }
  else if (use_full_fps)
    update = true

  EV_sync_update.no_update_count++
  EV_sync_update.no_animation_count++
  if (--EV_sync_update.count <= 0) {
    EV_sync_update.count = count_to_10fps
    update = true

    PC_count_absolute++
    if (--PC_count <= 0) {
      PC_count = PC_count_max
      update_event = always_update_event = true
    }

    if (Settings.AllowExternalCommand) {
      if (!SA_external_command_JSON_path)
        SA_external_command_JSON_path = oShell.ExpandEnvironmentStrings("%TEMP%") + toLocalPath("\\_SA_external_command.json")

      if (FSO_OBJ.FileExists(SA_external_command_JSON_path)) {
        var f = SA_external_command_JSON_path.replace(/[\/\\][^\/\\]+$/, "")
        var p = SA_external_command_JSON_path.replace(/^.+[\/\\]/, "")

        var dir  = Shell_OBJ.NameSpace(f);
        var file = dir.ParseName(p);

        var mtime = file.ModifyDate;

        if ((SA_external_command_JSON_time_ref > -1) && (SA_external_command_JSON_time_ref < mtime)) {
          SA_external_command_JSON_time_ref = mtime
          try {
            var file = FSO_OBJ.OpenTextFile(SA_external_command_JSON_path, 1);
            var txt = file.ReadAll()
            file.Close()

            var json_command = JSON.parse(txt)
            if (json_command.command_list) {
              var delay = 0
              json_command.command_list.forEach(function (c) {
var func
switch (c.command_name) {
  case "DROP_FILE":
    func = function () { SA_DragDropEMU(c.path) }
    break
  default:
    DEBUG_show(c.command_name)
}

if (func)
  setTimeout(func, delay)
              });
            }
          }
          catch (err) {}
        }
        else {
          SA_external_command_JSON_time_ref = mtime
        }
      }
      else {
        SA_external_command_JSON_time_ref = 0
      }
    }
  }

  if (use_full_fps) {
    var ms_per_animation_frame = 1000 / (EV_sync_update.count_to_10fps_ * 5)
    if (RAF_animation_frame_unlimited || RAF_animation_frame_always_update) {
      EV_sync_update.last_frame_updated = false
      RAF_animation_frame_always_update = false
    }

    if (!EV_sync_update.last_frame_updated) {
      if (!RAF_animation_frame_timestamp_last)
        RAF_animation_frame_timestamp_last = RAF_timestamp
      else {
        var time_diff = (RAF_timestamp - RAF_animation_frame_timestamp_last) - ms_per_animation_frame
        RAF_animation_frame_time_delayed += time_diff
        if (RAF_animation_frame_time_delayed < -ms_per_animation_frame) {
          RAF_animation_frame_time_delayed = -ms_per_animation_frame
        }
        else if (RAF_animation_frame_time_delayed > ms_per_animation_frame) { // force next frame update
          RAF_animation_frame_time_delayed = ms_per_animation_frame//*0.5 //-= time_diff
//console.log(RAF_animation_frame_time_delayed)
          RAF_animation_frame_always_update = true
        }
        RAF_animation_frame_timestamp_last = RAF_timestamp
      }
    }
//RAF_animation_frame_always_update=true
  }

  // make sure there is no consecutive update, to prevent the screen from updating too fast
  if (!always_update_event && (EV_sync_update.last_frame_updated || !update)) {
    EV_sync_update.last_frame_updated = false

    if (EV_sync_update.func_extra)
      EV_sync_update.func_extra()
    return
  }

//DEBUG_show(PC_count_absolute)

  if (use_full_fps && update_event)
    always_update_event = true

  var update_bar
  if (update_event) {
    // for EV_sync_update.enabled (eg. sound monitor), make sure the animation and bar is updated at a rate of at least 10fps
    if (EV_sync_update.no_update_count >= count_to_10fps)
      always_update_event = true

    // basically for non-full-fps animations only
    if ((updateEvent(always_update_event) === false) || (EV_sync_update.allow_update_between_frames && !always_update_event && (EV_sync_update.no_update_count == count_to_10fps/2))) {
      if (EV_sync_update.func_extra)
        EV_sync_update.func_extra()
      if (EV_sync_update.no_update_count == count_to_10fps/2) {
//EV_sync_update.fps_count_func()
        if (EV_sync_update.func_extra_sub) {
          EV_sync_update.func_extra_sub()
          EV_sync_update.last_frame_updated = true
        }
      }
      return
    }

//EV_sync_update.fps_count_func()

    if (EV_sync_update.func_extra)
      EV_sync_update.func_extra()

    EV_sync_update.last_frame_updated = true
  }

  // 3D navigation START
  var r3d = Lbody3D_navigation._rotate3d
  if (Lbody3D_navigation._transformed) {
    Lbody3D_navigation._transformed = false

    var t3d = Lbody3D_navigation._translate3d

    var z = Lbody3D_navigation._z_origin + t3d[2]
    var toggle
    if (z > -Lbody3D_navigation._z_view) {
      if (!Lbody3D_navigation._backfaceHidden) {
        Lbody3D_navigation._backfaceHidden = true
        toggle = true
      }
    }
    else {
      if (Lbody3D_navigation._backfaceHidden) {
        Lbody3D_navigation._backfaceHidden = false
        toggle = true
      }
    }

    if (toggle && !is_SA_child_animation) {
      var vis = (Lbody3D_navigation._backfaceHidden) ? "hidden" : "visible"
      DEBUG_show("(backface visibility:" + vis + ")", 2)
      for (var i = 0; i < SA_child_animation_max; i++) {
        if (SA_child_animation[i])
          document.getElementById("Ichild_animation" + i).style.msBackfaceVisibility = vis
      }
    }

    Lbody3D_navigation.style.msTransformOrigin = "50% 50% " + z + "px"
    Lbody3D_navigation.style.msTransform = "rotateX(" + r3d[0] + "deg) rotateY(" + r3d[1] + "deg) rotateZ(" + r3d[2] + "deg) " + "translate3d(" + t3d[0] + "px," + t3d[1] + "px," + t3d[2] + "px)"
  }
  // END

  // HeadTracker AR START
  if (self.HeadTrackerAR && HeadTrackerAR.running) {
    HeadTrackerAR.getCameraXY()
    Lbody3D.style.msPerspectiveOrigin = HeadTrackerAR._cx + "% " + HeadTrackerAR._cy + "%"

    // draw camera
    if (HeadTrackerAR.laughing_man.complete) {
      var e = HeadTrackerAR.face_event
      var c = HeadTrackerAR.canvas_camera

      var context = c.getContext("2d")
      context.globalCompositeOperation = 'copy'
      context.save()
      context.translate(160,0)
      context.scale(-1,1)
      context.drawImage(HeadTrackerAR.video_input, 0,0,160,120)
      context.restore()

      context.globalCompositeOperation = 'source-over'
      if (e.width && e.height) {
        var h = Math.max(e.width, e.height)
        var w = h * 134/120
        var x = e.x - w/2
        var y = e.y - h/2
        context.drawImage(HeadTrackerAR.laughing_man, 0,0,134,120, x,y,w,h)

        context.translate(e.x, e.y)
        context.rotate(e.angle-(Math.PI/2));
        context.strokeStyle = "#00CC00";
        context.strokeRect((-(e.width/2)) >> 0, (-(e.height/2)) >> 0, e.width, e.height);
        context.rotate((Math.PI/2)-e.angle);
        context.translate(-e.x, -e.y);
      }
      else
        context.drawImage(HeadTrackerAR.laughing_man, (160-134)/2,0)
    }
  }
  // END

  var animation_update = (!EV_sync_update.fps_control || EV_sync_update.fps_control()) && ((use_full_fps && use_full_fps_registered) || (EV_sync_update.no_animation_count >= count_to_10fps-1))
  if (animation_update) {
    EV_sync_update.last_frame_updated = true
    EV_sync_update.count_frame++

    EV_sync_update.RAF_func.forEach(function (func) { func(); });
    EV_sync_update.RAF_func = [];

// Electron cursor/window data START
let _b, _top_b, _cursor, _window, _window_top, opacity_on_hover, IgnoreMouseEventsPartial, capture_pixel, use_screen_data
if (webkit_electron_mode) {
  _b = System._browser
  _top_b = SA_topmost_window.System._browser
  if (!SA_topmost_window.returnBoolean("AutoItStayOnDesktop")) {
    opacity_on_hover = System.Gadget.Settings.readString("OpacityOnHover")
    IgnoreMouseEventsPartial = SA_topmost_window.returnBoolean("IgnoreMouseEventsPartial")
  }
  capture_pixel = opacity_on_hover || IgnoreMouseEventsPartial;
  use_screen_data = System._browser.use_screen_data;
  _cursor = _b._electron_cursor_pos = _top_b._electron_cursor_pos = (use_screen_data) ? ((is_SA_child_animation && _top_b._electron_cursor_pos) || SA_top_window.getCursorPos()) : null;
  _window = _b._electron_window_pos = _top_b._electron_window_pos = (use_screen_data) ? ((is_SA_child_animation && _top_b._electron_window_pos) || SA_top_window.getPos()) : null;
}

if (use_screen_data) {
  _window_top = _window.slice(0)
  if (is_SA_child_animation) {
    let ani = parent.SA_child_animation[SA_child_animation_id]
    _window[0] += ani.x
    _window[1] += ani.y
  }

  let _x = _cursor.x - _window[0]
  let _y = _cursor.y - _window[1]
  let mk = _top_b._wallpaper_mousekey
  let mouse_over_old = !!_b._electron_mouse_over
  let mouse_over_new = ((_x >= 0) && (_x < B_content_width) && (_y >= 0) && (_y < B_content_height))
  if (mouse_over_new) {
    if (_top_b.capturePage_pixel && (_top_b.capturePage_pixel[3] == 0))
      mouse_over_new = false
/*
capturePage may crash the gadegt if:
- coordinates are beyond the window size (NOTE: document content size can be larger than the window, so window size must be checked)
- the window is in the process of being resized
NOTE: For performance reason, capturePage is used only when "opacity on hover" is enabled.
*/
    if (capture_pixel && (!self.MMD_SA || MMD_SA.MMD_started) && !_top_b.capturePage_in_process && !_top_b.resize_timerID) {
      if (!_top_b.resize_cooling_timestamp || (performance.now() > _top_b.resize_cooling_timestamp + 500)) {
        _top_b.capturePage_in_process = true
        _top_b.resize_cooling_timestamp = 0
        webkit_electron_remote.getGlobal("capturePage")(_cursor.x - _window_top[0], _cursor.y - _window_top[1])
      }
    }

    if (!capture_pixel && (self.MMD_SA && MMD_SA.MMD_started) && !WallpaperEngine_mode && SA_topmost_window.returnBoolean("AutoItStayOnDesktop")) {
      let evt
      if (!_b._wallpaper_mousedown || (mk && (_b._wallpaper_mousedown != mk))) {
if (mk==1 || mk==2 || mk==4) _b._wallpaper_outside_clicked = false
// mouseclick
        if (mk == 1) {
_b._wallpaper_mousedown = 1
//MMD_SA._trackball_camera.rotateSpeed = 0.01
evt = new MouseEvent("mousedown", {
  bubbles: true,
  cancelable: true,
  view: self,
  button: 0,
//  pageX:B_content_width/2, pageY:B_content_height/2, clientX:B_content_width/2, clientY:B_content_height/2
  pageX:_x, pageY:_y, clientX:_x, clientY:_y
});
Lbody_host.dispatchEvent(evt)
        }
        else if (mk == 4) {
_b._wallpaper_mousedown = 4
_b._wallpaper_mouse_deltaY_ref = _y
        }
      }
// mouseout
      else if (mk == 0) {
_b._wallpaper_mousedown = 0
evt = new MouseEvent("mouseup", {
  bubbles: true,
  cancelable: true,
  view: self,
});
document.body.dispatchEvent(evt)
      }
// mousemove
      else if ((_b._wallpaper_mouseX != _x) || (_b._wallpaper_mouseY != _y)) {
        _b._wallpaper_mouseX = _x
        _b._wallpaper_mouseY = _y
        if (mk == 1) {
evt = new MouseEvent("mousemove", {
  bubbles: true,
  cancelable: true,
  view: self,
  pageX:_x, pageY:_y, clientX:_x, clientY:_y
});
document.body.dispatchEvent(evt)
        }
        else if (mk == 4) {
evt = new WheelEvent("wheel", {
  bubbles: true,
  cancelable: true,
  view: self,
  deltaY:(_y - _b._wallpaper_mouse_deltaY_ref)
});
Lbody_host.dispatchEvent(evt)
_b._wallpaper_mouse_deltaY_ref = _y
        }
      }
    }

  }
  else {
// click outside animation (eg. taskbar)
// for some WTF unknown reasons, checking/assigning the status of ._wallpaper_mousedown to prevent repeated clicks doesn't work here
// _b._wallpaper_mousedown = 9999
    if (mk) {
      if (!_b._wallpaper_outside_clicked)
        _b._wallpaper_outside_clicked = 1
      else if (++_b._wallpaper_outside_clicked > 30) {
_b._wallpaper_outside_clicked = 1
MMD_SA.reset_camera(true)
DEBUG_show("(camera reset)", 2)
      }
    }
  }
  _b._electron_mouse_over = mouse_over_new

  if (IgnoreMouseEventsPartial && mouse_over_new && (_top_b.mouseout_timerID || _top_b._onmouseout_waiting_custom0_timerID)) {
var evt = new MouseEvent("mouseover", {
  bubbles: true,
  cancelable: true,
  view: top
});
SA_topmost_window.document.body.dispatchEvent(evt)
  }

  if (mouse_over_old != mouse_over_new) {
    if (IgnoreMouseEventsPartial) {
      webkit_window.setIgnoreMouseEvents(!mouse_over_new)
    }
    var _body = (is_SA_child_animation) ? parent.document.getElementById("Ichild_animation" + SA_child_animation_id) : _b.body
    var opacity_new = _b.Opacity * ((mouse_over_new) ? parseFloat(opacity_on_hover || 1) : 1)
    var opacity_old = parseFloat(_body.style.opacity || 1)
    if (opacity_new != opacity_old) {
      _body.style.opacity = opacity_new
//      DEBUG_show(""+mouse_over_new, 2)
    }
  }
}
// END

    if (!is_SA_child_animation && self.AudioFFT_active) {
      AudioFFT_active.process()
    }

    if (self.EV_animate_full) {
      System._browser.on_animation_update.run(0)
      EV_animate_full(RAF_timestamp)
      System._browser.on_animation_update.run(1)
    }

    if (Settings.CSSTransform3DBoxAnimate)
      Box3D.animate()

    if (use_SVG_Clock)
      SVG_Clock.update()

EV_sync_update.fps_count_func()
if (EV_sync_update.fps_last && ((is_SA_child_animation_host) ? is_SA_child_animation : !is_SA_child_animation)) { if (SA_topmost_window.EV_sync_update.fps_log) {console.log('FPS:' + EV_sync_update.fps_last); EV_sync_update.fps_last=0;} }
  }

  // 3D billboard START
  if (!is_SA_child_animation && Settings.CSSTransform3D) {
    var r = [Lbody._rotate3d, r3d]
    for (var i = 0; i < SA_child_animation_max; i++) {
      if (!SA_child_animation[i])
        continue

      var d = document.getElementById("Ichild_animation" + i)
      var w = d.contentWindow
      if (!w.loaded || !w.Settings.CSSTransform3DBillboard)
        continue

      var r_billboard = d._rotate3d_billboard
      var r_changed = false
      for (var lvl = 0; lvl < 2; lvl++) {
        for (var k = 0; k < 3; k++) {
          if (r[lvl][k] != r_billboard[lvl][k]) {
            r_changed = true
            break
          }
        }
      }
      if (!r_changed)
        continue

      for (var lvl = 0; lvl < 2; lvl++) {
        for (var k = 0; k < 3; k++) {
          r_billboard[lvl][k] = r[lvl][k]
        }
      }

      if (!d._translate3d) {
        d._translate3d = (d._transform_base && /translateZ\(([^\(]+)\)/.test(d._transform_base)) ? [0,0,parseFloat(RegExp.$1.trim())] : [0,0,0]
      }
      d.style.msTransformOrigin = "50% 50% " + d._translate3d[2] + "px"

      var t = []
      var axis = ["X", "Y", "Z"]
      for (var lvl = 0; lvl < 2; lvl++) {
        for (var k = 2; k >= 0; k--) {
          if (r[lvl][k])
            t.push('rotate' + axis[k] + '(' + (-r[lvl][k]) + 'deg)')
        }
      }
      d.style.msTransform = t.join(" ") + ((d._transform_base) ? d._transform_base : "")
    }
  }
  // END

  if (animation_update || use_full_fps) {
    if (Canvas_Effect && Canvas_Effect._use_default_canvas)
      Canvas_Effect.draw(Canvas_Effect.drawn)
//EV_sync_update.fps_count_func()
  }
  if (animation_update)
    EV_sync_update.no_animation_count = 0

  if (EV_sync_update.last_frame_updated) {
    EV_sync_update.no_update_count = 0
    update_bar = (animation_update || use_full_fps)
  }

  var needs_resize = false
  for (var i = 0, i_max = EV_usage_list.length; i < i_max; i++) {
    var ev_obj = (i_max == 1) ? self : EV_usage_list[i]

    var u = ev_obj.EV_usage
    var u_last = (ev_obj.EV_usage_last < 0) ? 0 : ev_obj.EV_usage_last
    if (Settings.ReverseAnimation) {
      u = 100 - u
      u_last = 100 - u_last
    }

    if (update_bar || (u != u_last)) {
      var id_prefix = "LCPU_main" + i
      var d = document.getElementById(id_prefix)
      if (!d) {
if (!Settings.Display)
  continue

d = document.createElement("div")
d.id = id_prefix
d.className = "CPU_bar"
d.style.zIndex = 3

var d_content = document.createElement("div")
d_content.id = id_prefix + "_content"
d_content.className = "CPU_bar_content"

var d_up = document.createElement("div")
d_up.id = id_prefix + "_up"
d_up.className = "CPU_bar_up"

var d_down = document.createElement("div")
d_down.id = id_prefix + "_down"
d_down.className = "CPU_bar_down"

d_content.appendChild(d_up)
d_content.appendChild(d_down)
d.appendChild(d_content)
document.getElementById("LCPU_main0").parentElement.appendChild(d)

needs_resize = true
      }

      var mod = barPhysics(u - u_last) + u_last
      var zoom = (ie9_mode) ? 1 : SA_zoom

      document.getElementById(id_prefix + "_content").style.pixelWidth = parseInt(mod * (B_width*zoom-2) / 100)
    }
  }

  if (needs_resize)
    resize()
}

var EQ_Emu = {
   bands_norm:[]
  ,bands:[]
  ,shuffle_count: 0
  ,v:-1
  ,v_last:-1

  ,update: function (v) {
if (v == null)
  v = EV_usage_float

this.v_last = this.v
this.v = v

if ((--this.shuffle_count <= 0) || (this.v_last < 1)) {
  var min = 40 * v/100
  var max = 80 * v/100
  for (var i = 0; i < 16; i++)
    this.bands_norm[i] = Math.random() * (max-min) + min

  this.shuffle_count = (random(10) + 10) * 10/PC_count_max
}
else {
  for (var i = 0; i < 16; i++)
    this.bands_norm[i] *= v / this.v_last
}

var range = 40 * v/100
if (range > 25)
  range = 25
for (var i = 0; i < 16; i++) {
  var b = this.bands_norm[i] + Math.random() * (range*2) - range
  if (b > 100)
    b = 100

  this.bands[i] = b
}

return this.bands
  }
}


var oShell
var Shell_OBJ, FSO_OBJ
try {
  if (!Shell_OBJ)
    Shell_OBJ = new ActiveXObject("Shell.Application");
  if (!FSO_OBJ)
    FSO_OBJ = new ActiveXObject("Scripting.FileSystemObject");
  if (!oShell)
    oShell = new ActiveXObject("WScript.Shell");
}
catch (err) {}

var regRoot = (returnBoolean("SwapRegistryCheck")) ? ["HKCU", "HKLM"] : ["HKLM", "HKCU"]
//if (returnBoolean("SwapRegistryCheck")) alert(regRoot)
var axDllClass = (Vista_or_above) ? "WASAPIlib.WASAPImain" : "EQGadget.EQ";

var AT_bass_band = 1

function EV_usage_sub_CREATE(uu, obj_name, length) {
  if (!uu)
    uu = {}

  uu[obj_name] = []

  for (var i = 0; i < length; i++) {
    var obj = {
 usage:0
,EV_usage:-1
,EV_usage_float:-1
,EV_usage_last:-1
,EV_usage_last_float:-1

//misc
,filter_u_last:0
    };

    uu[obj_name][i] = obj
  }

  return uu
}

function EV_usage_PROCESS(obj, usage) {
  if (usage < 0)
    usage = 0
  else if (usage > 100)
    usage = 100

  var pow = (obj && obj._MonitorSensitivity_) || ((!obj && use_2nd_monitor) ? Settings.Monitor2Sensitivity : Settings.MonitorSensitivity)
  if (pow != 1)
    usage = Math.pow(usage/100, pow) * 100

  if (Settings.ReverseAnimation)
    usage = 100 - usage

  if (obj) {
    obj.EV_usage_last_float = obj.EV_usage_float
    obj.EV_usage_last = obj.EV_usage

    obj.EV_usage_float = usage
    obj.EV_usage = usage = parseInt(usage)
  }
  return usage
}

var EV_object = [
  {
    EV_parser: function () { return parseEventToMonitor(this.EV_string); }
   ,EV_string:"EventToMonitor"
  }

 ,{
    EV_parser: function () { return (use_2nd_monitor) ? parseEventToMonitor(this.EV_string) : ""; }
   ,EV_string:"EventToMonitorVF"
  }
]

function processEV(num, always_update_event) {
  var ev_obj = EV_object[num]

  var ev = ev_obj.EV_parser()
  if (EV_sync_update.allow_update_between_frames && !num && !always_update_event && (ev != "SOUND")) {
    return -1
  }

  var usage = 0

  var WMI_ev_obj = ev_obj.WMI_ev_obj

  switch (ev) {
case "CPU":
  var max_core = System.Machine.CPUs.count
  var max = (Settings.CCPU == 1) ? max_core : Settings.CCPU
  var core_per_meter = max_core / max

  var ccore = []
  var CPU_meter = []
  for (var i = 0; i < max; i++) {
    var cpm = core_per_meter * i
    var c = parseInt(cpm)
    var scale = 1 - (cpm - c)
    if (scale > core_per_meter)
      scale = core_per_meter

    var u = 0
    var meter_count = core_per_meter
    while (true) {
      var v = ccore[c] = ccore[c] || System.Machine.CPUs.item(c).usagePercentage + 1
      u += v * scale

      meter_count -= scale
      if (meter_count <= 0.01)
        break

      if ((cpm - c) + scale > 0.99)
        c++
      scale = (meter_count > 1) ? 1 : meter_count
    }
    u /= core_per_meter

    CPU_meter[i] = u
    usage += u
  }

  if ((EventToMonitor_para1 == -2) && (CPU_meter.length > 1)) {
    for (var i = 0, i_max = CPU_meter.length; i < i_max; i++) {
      if (!EV_usage_list[i])
        EV_usage_list[i] = {usage:0,EV_usage:-1,EV_usage_float:-1,EV_usage_last:-1,EV_usage_last_float:-1, _MonitorSensitivity_:1}
      EV_usage_PROCESS(EV_usage_list[i], CPU_meter[i]-1)
    }
  }

  usage = (CPU_meter[EventToMonitor_para1]) ? CPU_meter[EventToMonitor_para1] : usage/max
  usage -= 1

//for (var i = 0; i < CPU_meter.length; i++) CPU_meter[i] = parseInt(CPU_meter[i])-1
//DEBUG_show(max+'\n'+CPU_meter)

// To prevent the animation from looking choppy when the usage is low and the meter sensitivity is set to "high/very high"
  if (usage <= 0.1)
    usage = 0.1
  break

case "RAM":
  usage = (1 - System.Machine.availableMemory / System.Machine.totalMemory) * 100
  break

case "HDD":

try {
  WMI_ev_obj.update()

  var dd = WMI_ev_obj.collection
  for (var d = 0; d < dd.length; d++) {
    var drive = dd[d]
    var l = drive.Name.charAt(0).toUpperCase()
    if (l != ev_obj.drive_letter_default)
      continue

    usage = parseInt(drive.PercentDiskTime)
    break
  }
}
catch (err) {}
  break

case "HDD_ALL":

try {
  WMI_ev_obj.update()

  var dd = WMI_ev_obj.collection
  var d_total = 0
  for (var i = 0, i_max = dd.length; i < i_max; i++) {
    if (dd[i].Name == "_Total") {
      d_total = i
      break
    }
  }
  usage = parseInt(dd[d_total].PercentDiskTime)

  if ((EventToMonitor_para1 == -2) && (dd.length > 2)) {
    var d_counter = 0
    for (var i = 0, i_max = dd.length; i < i_max; i++) {
      var d = dd[i]
      if (!/^\w\:$/.test(d.Name))
        continue

      if (!EV_usage_list[d_counter])
        EV_usage_list[d_counter] = {usage:0,EV_usage:-1,EV_usage_float:-1,EV_usage_last:-1,EV_usage_last_float:-1}
      EV_usage_PROCESS(EV_usage_list[d_counter], parseInt(d.PercentDiskTime))
      d_counter++
    }
  }
/*
var _list = []
dd.forEach(function(c){_list.push(c.Name)})
DEBUG_show(_list)
*/
}
catch (err) {}
  break

case "NET":

try {
  var o = WMI_ev_obj.update()
  var dl = 0
  var ul = 0
  for (var n = 0, n_max = o.length; n < n_max; n++) {
    dl = Math.max(dl, parseInt(o[n].BytesReceivedPerSec))
    ul = Math.max(ul, parseInt(o[n].BytesSentPerSec))
  }
  var dl_ul = dl + ul

  var obj = ev_obj.NET
  if (obj.download_peak < dl)
    obj.download_peak = dl
  if (obj.upload_peak < ul)
    obj.upload_peak = ul

  var dl_ratio = dl / obj.download_peak
  var ul_ratio = ul / obj.upload_peak

  if (dl_ul)
    usage = (dl_ratio * (dl / dl_ul) + ul_ratio * (ul / dl_ul)) * 100

  if (EventToMonitor_para1 == -2) {
    if (!EV_usage_list[1])
      EV_usage_list[1] = {usage:0,EV_usage:-1,EV_usage_float:-1,EV_usage_last:-1,EV_usage_last_float:-1}

    EV_usage_PROCESS(EV_usage_list[0], dl_ratio*100)
    EV_usage_PROCESS(EV_usage_list[1], ul_ratio*100)
  }
}
catch (err) {}
  break

case "GPU_ENGINE":

try {
  var o = WMI_ev_obj.update()
  for (var n = 0, n_max = o.length; n < n_max; n++) {
    usage += Math.max(parseInt(o[n].UtilizationPercentage), 0)
  }
//DEBUG_show(usage+'/'+Date.now())
}
catch (err) {}
  break

case "SOUND":
  if (!oShell)
    break

var EQBand, BD, EQBand32

var rHost = (is_SA_child_animation) ? parent : self
EQBand = rHost._rEQBand
BD = rHost._rBD
EQBand32 = rHost._rEQBand32

//DEBUG_show(BD)
//EV_sync_update.timer_stop()

if (!webkit_mode && ((EQBand == null) || (BD == null))) {
  if (Sound_classRoot) {
    try {
      EQBand = oShell.RegRead(Sound_classRoot + "EQBand\\");
      BD     = oShell.RegRead(Sound_classRoot + "BD\\");
    } catch (err) {}
  }
  else {
    for (var i = 0; i < regRoot.length; i++) {
      var classRoot = regRoot[i] + "\\Software\\Classes\\" + axDllClass + "\\";

      try {
        EQBand = oShell.RegRead(classRoot + "EQBand\\");
        BD     = oShell.RegRead(classRoot + "BD\\");
      } catch (err) {}

      if (EQBand) {
        Sound_classRoot = classRoot
        break
      }
    }
  }
}
//else DEBUG_show(EQBand)

  if (!EQBand) {
    Sound_classRoot = null
    EQBand = "[0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0]"
  }
  if (!BD)
    BD = ""

// sync update
//if ((EV_sync_update._EQBand_and_BD != EQBand + BD)) EV_sync_update.fps_count_func()
if (EV_sync_update.enabled && !num && !always_update_event && (EV_sync_update._EQBand_and_BD == EQBand + BD)) {
  return -1
}
EV_sync_update._EQBand_and_BD = EQBand + BD
// END

// "eval" causes MEMORY LEAK (IE9 RC only?). Use another workaround here.
if (ie9_mode) {
  try {
    EQBand = JSON.parse(EQBand)
  }
  catch (err) {
    EQBand = [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0]
  }
}
else {
  EQBand = EQBand.replace(/[^\d\,]/g, "").split(",")
  for (var z=0, z_max=EQBand.length; z < z_max; z++) { EQBand[z] = parseInt(EQBand[z]) }
}

var BD_obj
if (BD && (Settings.BDSpectrumToBeat || Settings.EnableBeatDetection)) {
  if (ie9_mode) {
    try {
      BD_obj = JSON.parse(BD)
    }
    catch (err) {}
  }
  else
    eval('BD_obj = ' + BD)
}
if (BD_obj) {
  BD_obj.EQBand = EQBand

  if (Settings.BDSpectrumToBeat) {
    var EQBeat = []
    for (var z=0, z_max=EQBand.length; z < z_max; z++) {
      var beat = BD_obj.vu_levels[z] / Sound_EQBand_mod
      EQBeat[z] = (Settings.BDSpectrumToBeat == 2) ? beat : (EQBand[z] + beat) / 2
    }
    EQBand = EQBeat
  }
}


  var spectrum = Sound_Spectrum[Settings[ev_obj.EV_string]]

  var EQ_total = 0
  for (var i = spectrum.EQ_ini; i <= spectrum.EQ_end; i++)
    EQ_total += EQBand[i] * ((spectrum.EQ_factor) ? spectrum.EQ_factor[i - spectrum.EQ_ini] : 1)

  EQ_total /= spectrum.EQ_divider

  usage = EQ_total

var EV_usage_sub = ev_obj.EV_usage_sub
if (EV_usage_sub) {
  if (BD_obj && Settings.EnableBeatDetection) {
    EV_usage_sub.BD = BD_obj

    var vu_factor = BD_obj.EQBand[AT_bass_band] * Sound_EQBand_mod / 100 * 2
    if (vu_factor > 1)
      vu_factor = 1
    var vu_beat = BD_obj.vu_levels[AT_bass_band] / 100 * vu_factor

    var beat
    beat = ((Settings.BDBassKick == 2) && !BD_obj.bass_kicked) ? 0 : ((Settings.BDBassKick) ? ((BD_obj.bass_kicked) ? Math.pow(vu_beat, 0.5) : vu_beat*0.75) : vu_beat)
    if (beat < 0.2)
      beat = 0
    BD_obj.beat = beat
//EV_sync_update.fps_count_func()
    for (var m = 1; m <= 2; m++) {
      var mod = (use_full_fps) ? ((RAF_animation_frame_unlimited)?1:2)/(m*EV_sync_update.count_to_10fps_) : 1/m;
      mod *= (Settings.BDDecay == 2) ? 1 : ((Settings.BDDecay == 1) ? 0.5 : 0.25);
      var beat_last = EV_sync_update["_beat_last"+m];
      BD_obj["beat"+m] = EV_sync_update["_beat_last"+m] = (beat < beat_last - mod) ? beat_last - mod : beat;
    }
  }
  else
    EV_usage_sub.BD = null

  var ss_type = ['SOUND_LOW', 'SOUND_MID', 'SOUND_HIGH']
  for (var k = 0; k < 3; k++) {
    var ss = ss_type[k]
    var obj = EV_usage_sub.sound[k]
    if (ss == Settings[ev_obj.EV_string]) {
      obj.usage = usage
      continue
    }

    var spectrum = Sound_Spectrum[ss]

    var EQ_total = 0
    for (var i = spectrum.EQ_ini; i <= spectrum.EQ_end; i++)
      EQ_total += EQBand[i] * ((spectrum.EQ_factor) ? spectrum.EQ_factor[i - spectrum.EQ_ini] : 1)

    EQ_total /= spectrum.EQ_divider

    obj.usage = EQ_total
  }

  if (!EV_usage_sub.sound_raw)
    EV_usage_sub_CREATE(EV_usage_sub, "sound_raw", EQBand.length)
  for (var i = 0, i_max = EQBand.length; i < i_max; i++) {
    EV_usage_sub.sound_raw[i].usage_raw = EQBand[i]
  }

  if (Settings.Use32BandSpectrum) {
    if (EQBand32) {
      try {
        EQBand32 = JSON.parse(EQBand32)
      }
      catch (err) {
        EQBand32 = null
      }
    }
    if (!EQBand32) {
      EQBand32 = []
      for (var i = 0, i_max = EQBand.length; i < i_max; i++) {
        var v = EQBand[i]
        EQBand32.push(v,v)
      }
    }

    if (!EV_usage_sub.sound_raw32)
      EV_usage_sub_CREATE(EV_usage_sub, "sound_raw32", EQBand32.length)
    for (var i = 0, i_max = EQBand32.length; i < i_max; i++) {
      EV_usage_sub.sound_raw32[i].usage_raw = EQBand32[i]
    }
  }
}
  break

case "BATTERY_CHARGE":
  ev_obj.usage_markermode = 1
  usage = System.Machine.PowerStatus.batteryPercentRemaining
  break

case "BATTERY_REMAINING":
  ev_obj.usage_markermode = 1
  usage = 100 - System.Machine.PowerStatus.batteryPercentRemaining
  break

case "BATTERY_STATE":
  ev_obj.usage_markermode = 1
  if (System.Machine.PowerStatus.isPowerLineConnected) {
	if (System.Machine.PowerStatus.isBatteryCharging)
		usage = 50
	else
		usage = 0
  }
  else
	usage = 100
  break

case "BATTERY_STATE_CHARGE":
  ev_obj.usage_markermode = 1
  if (System.Machine.PowerStatus.isPowerLineConnected)
	usage = 100
  else
  	usage = System.Machine.PowerStatus.batteryPercentRemaining
  break

case "BATTERY_STATE_REMAINING":
  ev_obj.usage_markermode = 1
  if (System.Machine.PowerStatus.isPowerLineConnected)
  	usage = 0
  else
  	usage = 100 - System.Machine.PowerStatus.batteryPercentRemaining
  break

case "TIMER_60_SECONDS":
  var time = new Date()
  var seconds = time.getSeconds()
  usage = seconds/60 * 100
  break

case "TIMER_60_MINUTES":
  var time = new Date()
  var minutes = time.getMinutes()
  var seconds = time.getSeconds()
  usage = (minutes + seconds/60)/60 * 100
  break

case "TIMER_24_HOURS":
  var time = new Date()
  var hours = time.getHours()
  var minutes = time.getMinutes()
  usage = (hours + minutes/60)/24 * 100
  break

case "FIXED_VALUE_0":
  usage = 0
  break

case "FIXED_VALUE_50":
  usage = 50
  break

case "FIXED_VALUE_100":
  usage = 100
  break

case "RANDOM_VALUE":
  usage = ev_obj.Random_u = ((ev_obj.Random_u_last == -1) || (PC_count_absolute % 20 == 1)) ? random(101) : ev_obj.Random_u

  if (ev_obj.Random_u_last == -1)
    ev_obj.Random_u_last = 0

  var inc = 100 * (PC_count_max * 1) / 10
  if (usage > ev_obj.Random_u_last) {
    if (usage > ev_obj.Random_u_last + inc)
      usage = ev_obj.Random_u_last + inc
  }
  else {
    if (usage < ev_obj.Random_u_last - inc)
      usage = ev_obj.Random_u_last - inc
  }
  ev_obj.Random_u_last = usage
  break

  }

  return usage
}


function updateEvent(always_update_event) {
  var usage = processEV(0, always_update_event)
  if (usage == -1)
    return false

  var usagevf = processEV(1)

  var usage_pagein = 0
  var usage_pageout = 0

//  var usage_markermode = 0
//  var usage_onbattery = 0
//  var usage_batterycharging = 0

// Moved here and changed the behaviour to allow for using markers with battery.
// If Primary Monitor is a Battery Monitor, markers will indicate charging and power loss events 

  if (MacFace_mode && Settings.UseMarkers) {
     if (EV_object[0].usage_markermode == 1) {
        if (!System.Machine.PowerStatus.isPowerLineConnected)
          usage_pagein = 1 
        if (System.Machine.PowerStatus.isBatteryCharging)
          usage_pageout = 1
     }
     else {
       try {
          var p = WMI_ev_obj_pages.update()[0]
          usage_pagein  = parseInt(p.PagesInputPerSec)
          usage_pageout = parseInt(p.PagesOutputPerSec)
          //usage_pagein = parseInt(p.PagesReadPerSec)
          //usage_pageout = parseInt(p.PagesWritePerSec)
//DEBUG_show([usage_pagein,usage_pageout])
       }
       catch (err) {}
     }
  }


// main

  usage   = EV_usage_PROCESS(self, usage)
  usagevf = EV_usage_PROCESS(null, usagevf)

  var EV_usage_sub = EV_object[0].EV_usage_sub
  if (EV_usage_sub) {

// Emulate the sound EQ object for non-sound activity - START
if (parseEventToMonitor() != "SOUND") {

  var EQBand = []
if (parseEventToMonitor() == "RANDOM_VALUE") {
//DEBUG_show(EV_usage_float)
  EQBand = EQ_Emu.update()
}
else {
  var min = (self.EQP_EQ_min != null) ? EQP_EQ_min : 0
  var max = (self.EQP_EQ_max != null) ? EQP_EQ_max : 15

  var EQ_u = usage
  // Restore the animation order
  if (Settings.ReverseAnimation)
    EQ_u = 100 - EQ_u
  EQ_u *= (max - min + 1)

  for (var i = 0; i < 16; i++) {
    if ((i < min) || (i > max))
      EQBand[i] = usage
    else {
      var u = EQ_u
      if (u > 100)
        u = 100
      else if (u < 0)
        u = 0
      EQBand[i] = u
      EQ_u -= 100
    }
  }
}

  var ss_type = ['SOUND_LOW', 'SOUND_MID', 'SOUND_HIGH']
  for (var k = 0; k < 3; k++) {
    var ss = ss_type[k]
    var obj = EV_usage_sub.sound[k]

    var spectrum = Sound_Spectrum[ss]

    var EQ_total = 0
    for (var i = spectrum.EQ_ini; i <= spectrum.EQ_end; i++)
      EQ_total += EQBand[i] * ((spectrum.EQ_factor) ? spectrum.EQ_factor[i - spectrum.EQ_ini] : 1)

    EQ_total /= spectrum.EQ_divider

    obj.usage = EQ_total
  }

  if (!EV_usage_sub.sound_raw)
    EV_usage_sub_CREATE(EV_usage_sub, "sound_raw", EQBand.length)

  for (var i = 0; i < EQBand.length; i++)
    EV_usage_sub.sound_raw[i].usage_raw = EQBand[i] / Sound_EQBand_mod
}
// END

    for (var i = 0; i < EV_usage_sub.sound.length; i++) {
      var obj = EV_usage_sub.sound[i]
      EV_usage_PROCESS(obj, obj.usage)
    }
    if (EV_usage_sub.sound_raw) {
      for (var i = 0; i < EV_usage_sub.sound_raw.length; i++) {
        var obj = EV_usage_sub.sound_raw[i]
        EV_usage_PROCESS(obj, obj.usage_raw)
      }
    }
  }

  var EV_usage_subVF = EV_object[1].EV_usage_subVF
  if (EV_usage_subVF) {
    for (var i = 0; i < EV_usage_subVF.sound.length; i++) {
      var obj = EV_usage_subVF.sound[i]
      EV_usage_PROCESS(obj, obj.usage)
    }
    if (EV_usage_subVF.sound_raw) {
      for (var i = 0; i < EV_usage_subVF.sound_raw.length; i++) {
        var obj = EV_usage_subVF.sound_raw[i]
        EV_usage_PROCESS(obj, obj.usage_raw)
      }
    }
  }


  if (MacFace_mode) {
    var usemarker1 = false
    var usemarker2 = false

    if (Settings.UseMarkers) {
       if (usage_pagein > 0)
          usemarker1 = true
       if (usage_pageout > 0)
          usemarker2 = true
    }

    if (!EV_object[1].EV_parser()) 
       usagevf = usage

    VistaFace.switchPattern(parseInt(usage/9.5),parseInt(usagevf/33.4), usemarker1, usemarker2)
  }
  else if (self.EV_adjust_timer) {
    var ms = SEQ_CalculateFPS(true)

    var ms_final = EV_AdjustTimer(ms, EV_ms_last, true)

    if (ms_final >= 0) {
      clearTimeout(EV_timerID)
      EV_timerID = setTimeout(EV_frame, ms_final)
    }
  }

  if (!gallery.length)
    return

  if (use_full_fps && !EV_sync_update.frame_changed("AnimateFrame"))
    return

// Draw pic
  if (SEQ_mode) {
    var ms = SEQ_CalculateFPS() * Seq_speed_delay

    var s = Seq.item("SEQ")
    var ms_final = EV_AdjustTimer(ms, s.interval_current)

//ms_final=-1
    if (ms_final >= 0) {
      s.Pause()
      s.timerID = setTimeout(function () { try { clearTimeout(seq_items["SEQ"].timerID) } catch (err) {}; seq_items["SEQ"].timerID=null; seq_items["SEQ"].Play(); }, ms_final)
    }
    s.interval = ms

    return
  }


if (self.EV_gallery_always_1_fps) {
  if (PC_count_absolute % 10 != 1)
    return
}

  var pic
  for (var i = gallery.length-1; i >= 0; i--) {
    var obj = gallery[i]
    var f = obj.frame
    if (f >= usage)
      continue

    pic = obj
    break
  }
  if (!pic)
    pic = gallery[0]

  AnimateFrame(pic)
}

function SEQ_CalculateFPS(isEV) {
  var fps_ini, fps_end
  if (isEV) {
    fps_ini = EV_fps_ini
    fps_end = EV_fps_end
  }
  else {
    fps_ini = SEQ_fps_ini
    fps_end = Math.round(SEQ_fps_end * SEQ_fps_end_factor)
  }

  SEQ_fps = fps_ini + EV_usage_float/100 * (fps_end - fps_ini)
//  fps_ini * Math.exp(EV_usage_float/100 * Math.log(fps_end / fps_ini))

  var fps = (SEQ_fps > 30) ? 30 : SEQ_fps
  return parseInt(1000/fps)
}

var SEQ_last_update_time = 0

var SEQ_gallery_shuffled = []
var SEQ_gallery_shuffled_count = -1

function EV_AdjustTimer(ms, ms_last, isEV) {
  if (ms+16 >= ms_last)
    return -1

  var t_diff

  var t = Date.now()
  var last_update_time = (isEV) ? EV_last_update_time : SEQ_last_update_time
  t_diff = t - last_update_time

  t_diff = ms - t_diff
  return ((t_diff < 0) ? 0 : t_diff)
}

var EV_first_idle_time = -1

var SEQ_gallery_shuffled_mode = true
var SEQ_gallery_shuffled = []
var SEQ_gallery_shuffled_count = -1
var SEQ_gallery_preset_order

function random_sorting(a,b) { return Math.random() - 0.5 }

function SEQ_gallery_restore_order(a,b) { return a.SEQ_index - b.SEQ_index }

function SEQ_Animate() {
  var t = Date.now()
  SEQ_last_update_time = t

  if (SEQ_gallery_by_percent.length) {
    var g_index = -1

    var percent_name = null
    if (SEQ_gallery_percent_name)
      percent_name = (self.EV_return_SEQ_gallery_percent_name) ? EV_return_SEQ_gallery_percent_name() : SEQ_gallery_percent_name

    for (var i = SEQ_gallery_by_percent.length-1; i >= 0; i--) {
      var obj = SEQ_gallery_by_percent[i]

      var f = obj.index
      var is_event = isNaN(f)
      if (percent_name) {
        if (is_event) {
          if (f != percent_name)
            continue
        }
        else
          break
      }
      else if (is_event || (f >= EV_usage))
        continue

      g_index = i
      break
    }
    if (g_index == -1)
      g_index = 0

if ((PC_count_max < 5) && (SEQ_gallery_percent_index != -1)) {
  if (g_index > 0)
    EV_first_idle_time = -1
  else if ((g_index == 0) && (SEQ_gallery_percent_index != g_index)) {
    if (EV_first_idle_time == -1) {
      EV_first_idle_time = t
      g_index = SEQ_gallery_percent_index
    }
    else if (t - EV_first_idle_time < 600)
      g_index = SEQ_gallery_percent_index
  }
}

    if (SEQ_gallery_percent_index != g_index) {
      SEQ_gallery_percent_name = percent_name

      SEQ_gallery_percent_index = g_index
      SEQ_gallery = SEQ_gallery_by_percent[g_index].SEQ_gallery
      SEQ_gallery_index = -1

      SEQ_gallery_shuffled_count = -1
    }
  }

  if (SEQ_gallery_index == -1) {
    if (self.EV_on_SEQ_gallery_change)
      EV_on_SEQ_gallery_change()

    if (SEQ_gallery_shuffled_mode) {
      if (SEQ_gallery_shuffled_count == -1) {
// NOTE: Array IS modified by the sorting function.
        if (SEQ_gallery_preset_order) {
          SEQ_gallery = SEQ_gallery.sort(SEQ_gallery_restore_order)

          SEQ_gallery_shuffled = []
          for (var i = 0; i < SEQ_gallery_preset_order.length; i++)
            SEQ_gallery_shuffled.push(SEQ_gallery[SEQ_gallery_preset_order[i]])
        }
        else
          SEQ_gallery_shuffled = (gallery_cache_obj.SS_mode) ? SEQ_gallery.sort(OP_gallery_sorting) : SEQ_gallery.shuffle()
        SEQ_gallery_shuffled_count = 0
      }

      SEQ_gallery_index = SEQ_gallery_shuffled[SEQ_gallery_shuffled_count].SEQ_index

      if (gallery_cache_obj.SS_mode) {
        gallery_cache_obj.SS_path_list_lvl = gallery_cache_obj.SS_path_list_index = 0
        gallery_cache_obj.SS_path_list[0] = SEQ_gallery_all[SEQ_gallery_index].ss_path_list
      }

      var SS_index = -1
      if (++SEQ_gallery_shuffled_count >= SEQ_gallery.length) {
        SEQ_gallery_shuffled_count = -1

        if (gallery_cache_obj.SS_mode)
          SS_index = OP_SEQ_index = Math.floor(Math.random() * SEQ_gallery.length)
      }
      else if (gallery_cache_obj.SS_mode)
        SS_index = SEQ_gallery_shuffled[SEQ_gallery_shuffled_count].SEQ_index

      if (SS_index != -1) {
        if (gallery_cache_obj.SS_path_list[0].length == 1) {
          gallery_cache_obj.SS_path_list_lvl = 1
          gallery_cache_obj.SS_path_list_index = -1
        }
        else {
          gallery_cache_obj.SS_path_list_lvl = 0
          gallery_cache_obj.SS_path_list_index = 0
        }

        gallery_cache_obj.SS_path_list[1] = SEQ_gallery_all[SS_index].ss_path_list
      }
    }
    else
      SEQ_gallery_index = Math.floor(Math.random() * SEQ_gallery.length)

    if (self.EV_on_after_SEQ_gallery_change)
      EV_on_after_SEQ_gallery_change()

    var gallery_obj = SEQ_gallery_all[SEQ_gallery_index]
    gallery = (gallery_obj.gallery) ? gallery_obj.gallery : SEQ_generate_gallery(gallery_obj)
    gallery_obj.count = 0

if (gallery_obj.loop_absolute)
  gallery_obj.loop = gallery_obj.loop_absolute
else {
  var loop_f = gallery.length
  if (loop_f < 10)
    loop_f = 10
  else if (loop_f > 30)
    loop_f = 30
  var loop = Math.round(loop_f * 5 * gallery_obj.loop_factor / gallery.length)
  if (!loop)
    loop = 1

  gallery_obj.loop = loop + ((gallery.length > 350) ? 0 : Math.floor(Math.random() * (loop+1)))
}

    SEQ_fps_ini = gallery_obj.SEQ_fps_ini
    SEQ_fps_end = gallery_obj.SEQ_fps_end
    if (SEQ_mode)
      Seq.item("SEQ").interval = SEQ_CalculateFPS()

    if (SEQ_ani_count_overridden) {
      SEQ_ani_count = SEQ_ani_count_overridden
      SEQ_ani_count_overridden = null
    }
    else
      SEQ_ani_count = 0

    if (self.EV_SEQ_refresh)
      EV_SEQ_refresh()
  }

  var pic = gallery[SEQ_ani_count]

  if (++SEQ_ani_count >= gallery.length) {
    SEQ_ani_count = 0

    var gallery_obj = SEQ_gallery_all[SEQ_gallery_index]
    if (++gallery_obj.count >= gallery_obj.loop) {
      SEQ_gallery_index = -1

      if (gallery_obj.onfinish)
        gallery_obj.onfinish()
    }
  }

// handle frame skipping
  if (SEQ_fps_frame_skip_mod >= 1) {
    SEQ_fps_frame_skip_mod -= 1
    SEQ_Animate()
    return
  }

  AnimateFrame(pic)

  if (SEQ_fps > 30)
    SEQ_fps_frame_skip_mod += (SEQ_fps - 30) / 30
}

var Gallery_h_align = "center"
var Gallery_v_align = "bottom"

function AnimateFrame(pic) {
  if (!pic.w && !pic.h) {
    var dim = loadImageDim(pic.path)
    pic.w = dim.w
    pic.h = dim.h
  }
  var w = pic.w
  var h = pic.h

  if (self.EV_AnimateFrame) {
    var obj = EV_AnimateFrame(pic, w,h)
    if (!obj)
      return

    pic = obj.pic
    w = obj.w
    h = obj.h
  }

  var ds = Lmain_animation.style
  ds.posLeft = EV_frame_offsetX
  ds.posTop = EV_frame_offsetY
  ds.pixelWidth = b_width
  ds.pixelHeight = b_height

  if (pic_last == pic)
    return
  pic_last = pic

  var path
  if (use_GIMAGE) {
    if (!pic.path_GIMAGE)
      pic.path_GIMAGE = "gimage:///" + pic.path + ("?width=" + w + "&height=" + h)
    path = pic.path_GIMAGE
  }
  else
    path = pic.path_file

  if (gallery_cache_obj.SS_mode && (gallery_cache_obj.SS_path != path)) {
    gallery_cache_obj.SS_path = path

    setTimeout('gallery_cache_obj.SS_preload()', 0)
//DEBUG_show('Preload => ' + SEQ_gallery_index + '/' + gallery_cache_obj.SS_path_list_lvl + ',' + gallery_cache_obj.SS_path_list_index)
  }

  if (!gallery_cache_obj.load(path)) {
    w *= image_ratio
    h *= image_ratio

    ds = img_obj.style
    ds.posLeft = (Gallery_h_align == "left") ? 0 : (b_width -  w) * ((Gallery_h_align == "center") ? 0.5 : 1)
    ds.posTop =  (Gallery_v_align == "top")  ? 0 : (b_height - h) * ((Gallery_v_align == "center") ? 0.5 : 1)

    if (use_native_img || (image_ratio != 1)) {
      ds.pixelWidth = w
      ds.pixelHeight = h
    }
    else {
      ds.width = "auto"
      ds.height = "auto"
    }

    img_obj.initialized = true

    gallery_cache_obj.styleUpdate()
  }

  if (pic.ss_mode) {
    var x = pic.ss_x
    var y = pic.ss_y

    ds = img_obj.style
    ds.posLeft = -x
    ds.posTop = -y
    ds.clip = 'rect(' + y + 'px ' + (x+w) + 'px ' + (y+h) + 'px ' + x + 'px)'

    gallery_cache_obj.styleUpdate()
  }

// filters
  if (self.use_ghosting)
    Ghosting.frame_final()
}

function SettingsClosed(event) {
  var ok = (event.closeAction == event.Action.commit)

  if (webkit_electron_mode && (!ok || is_SA_child_animation)) {
    if (SA_topmost_window.webkit_IgnoreMouseEvents_disabled) {
      SA_topmost_window.SA_OnKeyDown({ keyCode:73 }, true)
    }
  }

// User hits OK on the settings page.
  if (ok) {
if (use_SA_browser_mode) {
  SA_animation_append_mode = false
  EQP_gallery_append_mode = false
  DragDrop_install(System.Shell.itemFromPath(loadFolder_CORE()))
  return
}

if (!use_SA_browser_mode && SystemEXT._default._settings)
  Settings_writeJS()

SA_Reload()
return
  }
}


// BG
var BG_dim_calculate
var BG_img_objs
var EV_width_no_init, EV_height_no_init

function BG_Basic() {
  BG_AddShadow((!filter_objs[filter_index].filter_enabled && (SA_zoom == 1)))
}

function BG_AddShadow(basic_mode) {
  BG_dim_calculate()

  var mod = (ie9_mode) ? 1 : SA_zoom
  var w = EV_width  * mod
  var h = EV_height * mod

  var x_offset = 1
  var y_offset = 1

  var s = Lmain_obj.style
  s.posLeft = x_offset
  s.posTop  = y_offset
  s.clip = Lmain_obj.clip_org = 'rect(0px ' + (w) + 'px ' + (h) + 'px 0px)'

  w += x_offset * 2
  h += y_offset * 2

  EV_BG_src = ""
  BG.removeObjects()
  BG_img_objs = []

if (!basic_mode) {
  var bg_shadow = BG.addImageObject("js_filters/images/black.png", 0,0)
  bg_shadow.left = (w-100)/2
  bg_shadow.top = (h-100)/2
  bg_shadow.width = w
  bg_shadow.height = h
  bg_shadow.addShadow("black", 3, 75, 3,3)
  BG_img_objs.push(bg_shadow)

  s = LBG_dummy.style
  s.pixelWidth = w
  s.pixelHeight = h
//  s.backgroundColor = "white"
  s.display = "block"
}
else
  LBG_dummy.style.display = "none"

  var shadow_offset = (use_SA_browser_mode) ? 0 : 5

  EV_width  += (x_offset * 2) + shadow_offset
  EV_height += (y_offset * 2) + shadow_offset

  BG.style.pixelWidth  = EV_width  * mod
  BG.style.pixelHeight = EV_height * mod
}

function BG_AddBlackhole() {
  BG_dim_calculate()

  if (System.Gadget.docked && (EV_width <= 130)) {
    BG_AddShadow()
  }
  else {
    LBG_dummy.style.display = "none"

    EV_BG_src = ""
    BG.removeObjects()
    BG_img_objs = []

    var bg_blackhole
    var bg_choice = [Settings.f_path + toLocalPath('\\images\\bg_blackhole.png'), System.Gadget.path + toLocalPath('\\js_filters\\images\\bg_blackhole_' + EV_width + 'x' + EV_height + '.png')]
    for (var i = 0; i < bg_choice.length; i++) {
      var bg_src = ValidatePath(bg_choice[i])
      if (bg_src) {
        bg_blackhole = bg_src.path
        break
      }
    }
    if (!bg_blackhole)
      bg_blackhole = 'js_filters/images/bg_blackhole_130x130.png'

    BG_img_objs.push(BG.addImageObject(bg_blackhole, 0,0))

    var s = Lmain_obj.style
    s.posTop = 24
    s.posLeft = 24

    EV_width += 24*2
    EV_height += 24*2
  }

  BG.style.pixelWidth = EV_width
  BG.style.pixelHeight = EV_height
}

// OP selection START

var OP_SEQ_index = -1

function OP_gallery_sorting(a, b) {
  if (a.SEQ_index == OP_SEQ_index)
    return -1
  if (b.SEQ_index == OP_SEQ_index)
    return 1

  return Math.random() - 0.5
}

function OP_change() {
  if (gallery_cache_obj.SS_mode) {
    SEQ_gallery_index = -1
    return ((SEQ_gallery_shuffled_count == -1) ? OP_SEQ_index : SEQ_gallery_shuffled[SEQ_gallery_shuffled_count].SEQ_index)
  }

  if (++OP_SEQ_index >= SEQ_gallery.length)
    OP_SEQ_index = 0

  SEQ_gallery_shuffled = SEQ_gallery.sort(OP_gallery_sorting)

  SEQ_gallery_shuffled_count = 0
  SEQ_gallery_index = -1

  return OP_SEQ_index
}

var SEQ_fps_end_factor = 1
var SEQ_fps_frame_skip_mod = 0

function OP_change_event() {
  if (gallery_cache_obj.SS_mode)
    DEBUG_show((OP_change()+1)+' (=> '+((SEQ_gallery_shuffled_count == SEQ_gallery.length-1) ? 'END' : SEQ_gallery_shuffled[SEQ_gallery_shuffled_count+1].SEQ_index+1)+')', 1)
  else
    DEBUG_show((OP_change()+1)+'/'+SEQ_gallery.length, 1)
}

// END


// Gallery building START

var gallery, gallery_js, pic_last
var image_ratio
var b_width, b_height
var B_width, B_height

var w_max, h_max
// NOTE: w_max/h_max may already be initialized in some cases.
w_max = w_max || 0
h_max = h_max || 0

var gallery_dim_predefined, gallery_preload_always
var SEQ_mode, SEQ_fps, SEQ_fps_ini, SEQ_fps_end, SEQ_ani_count, SEQ_ani_count_overridden
var SEQ_gallery_all, SEQ_gallery, SEQ_gallery_by_name, SEQ_gallery_by_percent
var SEQ_gallery_index, SEQ_gallery_percent_index, SEQ_gallery_percent_name
var SEQ_gallery_memory_saving_mode
var MacFace_mode
var use_2nd_monitor
var use_GIMAGE

var EQP_gallery

var gallery_cache_obj = new imgCache_Object("img_obj", "Lmain_animation")

function ValidatePath(path) {
  var p = null
  try {
    p = System.Shell.itemFromPath(path)
  }
  catch (err) {}

  return p
}

function ItemsFromFolder(path, is_root) {
  var f = ValidatePath(path)

  if (!f && is_root) {
    if (path != f_path_default)
      ItemsFromFolder(f_path_default, true)
    return true
  }

  if (/\.mcface$/i.test(path)) {
    MacFace_mode = true
    use_2nd_monitor = true
    return
  }

  if (is_root) {
    if (!f.isFolder && f.isFileSystem) {
      var path = f.path
      Settings.f_path_folder = Settings.f_path.replace(/[\/\\][^\/\\]+$/, "")

      var animate_js = Settings.f_path_folder + toLocalPath('\\animate.js')
      if (!(is_SA_child_animation_host && !is_SA_child_animation) && ValidatePath(animate_js))
        gallery_js = animate_js

      if (/\.gif$/i.test(path)) {
        gallery = [{frame:0, path:path, path_file:toFileProtocol(path)}]

        self.EV_init = function () {
self.EV_b_width  = w_max
self.EV_b_height = h_max
        }
      }
      else if (/\.(pmd|pmx)$/i.test(path) && !gallery_js) {
        self.MMD_SA_options = { model_path: path }
      }
      else if (/_gimage\.\w+$/i.test(path)) {
        if (use_HTML5 && (returnBoolean("UseMatrixRain") || Settings.UseAudioFFT)) {
var dim = loadImageDim(path)
var w = dim.w
var h = dim.h

self.EV_width  = self.EQP_ref_width  = w
self.EV_height = self.EQP_ref_height = h
self.EQP_parts_path = "/"
self.EQP_ps = [{src:path.replace(/^.+[\/\\]/, ""), xy:w+'x'+h, o_min:-1}]

self.use_WMP = self.WMP_hidden = true

self.EQP_init_extra = function () {
  if (use_EQP_ripple) {
    if (/\.png$/i.test(path) && !EQP_Ripple.options_length) {
      var options = {
  mask: path.replace(/^.+[\/\\]/, "").replace(/\.png$/i, "")
 ,mask_alpha_base: 51
 ,mask_alpha_base_feather: -1
// ,mask_inverted: true
      }
      EQP_Ripple.load_options(options)
    }
  }
}

document.write('<script language="JavaScript" src="js/EQP.js"></scr'+'ipt>')
        }
        else {
          use_native_img = true
          gallery = [{frame:0, path:path, path_file:toFileProtocol(path)}]

          self._image_ratio = parseFloat(LABEL_LoadSettings("LABEL_image_ratio", 0));
          var image_ratio_default = (System.Gadget.docked) ? 0.5 : 1
          if (_image_ratio == image_ratio_default)
            _image_ratio = 0

          self.EV_initialized = false
          self.EV_init = function () {
if (!EV_initialized) {
  EV_initialized = true

  document.body.title += ', double-click to change size'
  document.body.ondblclick = function () {
var image_ratio_default = (System.Gadget.docked) ? 0.5 : 1
if (!_image_ratio)
  _image_ratio = image_ratio_default
if (_image_ratio <= 0.25)
  _image_ratio = 1
else
  _image_ratio -= 0.25

if (_image_ratio == image_ratio_default)
  _image_ratio = 0

resize()
  }

  var path = gallery[0].path
  if (use_EQP_ripple && /\.png$/i.test(path) && !EQP_Ripple.options_length) {
    var options = {
  mask: path.replace(/^.+[\/\\]/, "").replace(/\.png$/i, "")
 ,mask_alpha_base: 51
 ,mask_alpha_base_feather: -1
// ,mask_inverted: true
    }
    EQP_Ripple.load_options(options)
  }
}

if (_image_ratio)
  image_ratio = _image_ratio
DEBUG_show('Size:' + (image_ratio*100) + '%', 2)
System.Gadget.Settings.writeString("LABEL_image_ratio", image_ratio)
self.EV_b_width  = w_max_org * image_ratio
self.EV_b_height = h_max_org * image_ratio
          }
        }
      }
      else {
        EQP_gallery = [path]

        var js_path = path.replace(/[^\\\/]+$/, "animate.js")
        if (!(is_SA_child_animation_host && !is_SA_child_animation) && ValidatePath(js_path))
          gallery_js = js_path

        if (/\.(jpg|jpeg|png)$/i.test(path)) {
          if (use_SA_browser_mode && !use_HTML5) {
            use_HTML5 = use_Silverlight = true
            use_Silverlight_only = false
          }
        }
        else if (/\.(webm|mp4|mkv)$/i.test(path)) {
if (ie9_mode) {
  EQP_use_HTML5_video = true
  if (!gallery_js) {
    self.EQP_video_options = { play_sound:true, loop_forever:true }
    self.EQP_bg_border = "2px solid black"
    var ev = System.Gadget.Settings.readString("EventToMonitor")
    if (!ev || !/SOUND/.test(Settings_default.EventToMonitor)) {
      EQP_video_options.hide_EQ = true
      Settings.Display = "0"
    }
//EQP_video_options.use_canvas_video = EQP_video_options.disable_chroma_key = true
  }
}
else {
  use_Silverlight = true
}
        }
      }
      return
    }

    if (/\.EQP-gallery$/i.test(path))
      EQP_gallery = []
  }

  var SEQ_RE = /([^\/\\]+)\.SEQ\-(\d+)\-(\d+)$/i

  var SEQ_sub_obj = null
  if (SEQ_RE.test(path)) {
    SEQ_mode = true

    var fps_ini = parseInt(RegExp.$2)
    if (fps_ini < 1)
      fps_ini = 1
    else if (fps_ini > 30)
      fps_ini = 30

    var fps_end = parseInt(RegExp.$3)
    if (fps_end < 1)
      fps_end = 1
    else if (fps_end > 30)
      fps_end = 30

    var s_name = RegExp.$1
    if (!is_root && SEQ_gallery_by_name[s_name])
      s_name += "|" + path
    SEQ_sub_obj = { SEQ_name:s_name, SEQ_fps_ini:fps_ini, SEQ_fps_end:fps_end, loop_factor:1, count:0 }

    if (is_root) {
      SEQ_gallery_all = []
      SEQ_gallery = []
      SEQ_gallery_by_name = {}
      SEQ_gallery_by_percent = []

      SEQ_fps_ini = SEQ_fps_end = 1
      SEQ_ani_count = 0
      SEQ_gallery_index = -1
      SEQ_gallery_percent_index = -1
    }
  }
  else if (is_root)
    SEQ_mode = false

  var g = []
  var ss_frame_count = 0
  var ss_path_list = []
  var ss_w = 0
  var ss_h = 0

  var ss_path_raw_list = []
  var ss_ref_frame = {}
  var ss_frame_copy = {}

  var items = f.SHFolder.Items
//console.log(items.count)
  for (var i = 0, i_max = items.count; i < i_max; i++) {
    var item = items.item(i)

    if (item.isLink) {
      var item_linked
      try {
        item_linked = System.Shell.itemFromPath(item.link.path)
      }
      catch (err) {}

      if (!item_linked)
        continue

      item = item_linked
    }

    if (item.isFolder) {
// Settings.to_include_subfolders
      if (SEQ_mode && SEQ_RE.test(item.path)) {
        if (!ItemsFromFolder(item.path))
          return false
      }
    }
    else if (item.isFileSystem) {
      var path = item.path

      if (is_root && /animate\.js$/i.test(path)) {
        if (!(is_SA_child_animation_host && !is_SA_child_animation))
          gallery_js = path
        continue
      }

      if (EQP_gallery) {
        if (!/\.(bmp|gif|jpg|jpeg|png|wmv|webm|mp4|mkv)$/i.test(path))
          continue

        if (/\.(wmv|webm|mp4|mkv)$/i.test(path)) {
          var alt_format = null
          if (xul_mode) {
            if (/\.(wmv|mp4|mkv)$/i.test(path))
              alt_format = ["webm"]
          }
          else {
            if (/\.(webm)$/i.test(path))
              alt_format = ["wmv", "mp4", "mkv"]
          }

          if (alt_format) {
            var alt_format_found
            for (var k = 0 ; k < alt_format.length; k++) {
              if (ValidatePath(path.replace(/\.\w{3,4}$/, "." + alt_format[k]))) {
                alt_format_found = true
                break
              }
            }
            if (alt_format_found)
              continue
          }

EQP_use_HTML5_video = (ie9_mode && /\.(webm|mp4|mkv)$/i.test(path))
if (!EQP_use_HTML5_video)
  use_Silverlight = true
        }

        EQP_gallery.push(path)
        continue
      }

      if (!/\.(bmp|gif|jpg|jpeg|png)$/i.test(path))
        continue

      var frames = []
      var FO = null

      if (/[\\\/](\d+)(x\d+)?\.\w+$/i.test(path)) {
        var frame = parseInt(RegExp.$1)

        var frame_copy = 1
        if (RegExp.$2) {
          if (/x(\d+)/i.test(RegExp.$2))
            frame_copy = parseInt(RegExp.$1)
        }

        frames[0] = { frame:frame, frame_copy:frame_copy }
      }
      else if (/ss\-(\d+)x(\d+)\-(\d+)(_[x\-\d]+)?\.\w+$/i.test(path)) {
gallery_cache_obj.SS_mode = true
SEQ_gallery_memory_saving_mode = true
        var w, h
        w = ss_w = parseInt(RegExp.$1)
        h = ss_h = parseInt(RegExp.$2)
        var frames_max = parseInt(RegExp.$3)

        var frame_copy_list = []
        if (RegExp.$4) {
          var fc_str = RegExp.$4
          var fc = fc_str.replace(/^_/, "").split("-")
          for (var k = 0; k < fc.length; k++) {
            if (/(\d+)x(\d+)/i.test(fc[k]))
              frame_copy_list[RegExp.$1] = parseInt(RegExp.$2)
          }
        }

        for (var k = 0; k < frames_max; k++) {
          var x = (k % 10)
          var y = parseInt(k/10)

          var frame = ss_frame_count + k

          var frame_copy = frame_copy_list[k]
          if (frame_copy)
            ss_frame_copy[frame] = frame_copy
          else
            frame_copy = 1

          frames.push({ frame:frame, frame_copy:frame_copy,  ss_mode:true, ss_x:x*w, ss_y:y*h, w:w, h:h })
        }

        FO = FrameObject()
      }
      else
        continue

      var path_file = toFileProtocol(path)
      ss_path_raw_list.push(path)
      ss_path_list.push(path_file)

if (!SEQ_gallery_memory_saving_mode) {
  for (var k = 0, k_max = frames.length; k < k_max; k++) {
    var ff = frames[k]

    var frame = ff.frame
    var obj = (FO) ? new FO(frame) : { frame:frame }

    var is_ref_frame = (!ff.ss_mode || (frame == ss_frame_count))
    var obj_ref = obj
    if (is_ref_frame) {
      if (ff.ss_mode) {
        obj_ref = FO.prototype

        obj_ref.ss_mode = true
        obj_ref.w = ff.w
        obj_ref.h = ff.h
      }
      obj_ref.path = path
      obj_ref.path_file = path_file
    }

    if (ff.ss_mode) {
      obj.ss_x = ff.ss_x
      obj.ss_y = ff.ss_y
    }

    for (var c = 0; c < ff.frame_copy; c++)
      g.push(obj)
  }
}

      ss_ref_frame[ss_frame_count] = true

      ss_frame_count += frames_max
      if (ss_frame_count > 999)
        return false
    }
  }

  if (SEQ_sub_obj && (g.length || ss_frame_count)) {
    SEQ_sub_obj.ss_w = ss_w
    SEQ_sub_obj.ss_h = ss_h
    if (SEQ_gallery_memory_saving_mode) {
      SEQ_sub_obj.ss_frame_count = ss_frame_count
      SEQ_sub_obj.ss_path_raw_list = ss_path_raw_list
      SEQ_sub_obj.ss_frame_copy = ss_frame_copy
      SEQ_sub_obj.ss_ref_frame = ss_ref_frame
    }
    else {
      SEQ_sub_obj.gallery = g
    }

    if (ss_path_list.length)
      SEQ_sub_obj.ss_path_list = ss_path_list

    if (!is_root || !SEQ_gallery.length) {
      SEQ_sub_obj.SEQ_index = SEQ_gallery.length
      SEQ_gallery_all.push(SEQ_sub_obj)
      SEQ_gallery.push(SEQ_sub_obj)
      SEQ_gallery_by_name[SEQ_sub_obj.SEQ_name] = SEQ_sub_obj
    }
  }

  if (is_root) {
    if (SEQ_mode && SEQ_gallery.length)
      gallery = (SEQ_gallery[0].gallery) ? SEQ_gallery[0].gallery : SEQ_generate_gallery(SEQ_gallery[0])
    else
      gallery = g
  }

  return true
}

// To reduce memory usage by assigning a constructor to all frames of the same sprite sheet, and use prototyping on repeated properties
function FrameObject() {
  return (function (frame) { this.frame=frame })
}

var SEQ_gallery_ref

function SEQ_generate_gallery(g_obj) {
  var max = g_obj.ss_frame_count
  var ss_frame_copy = g_obj.ss_frame_copy
  var ss_ref_frame = g_obj.ss_ref_frame
  var w = g_obj.ss_w
  var h = g_obj.ss_h

  var path_index = 0

  var FO
  var g = []
  for (var frame = 0; frame < max; frame++) {
    var is_ref_frame = ss_ref_frame[frame]
    if (is_ref_frame)
      FO = FrameObject()

    var obj = new FO(frame)

    if (is_ref_frame) {
      var path = g_obj.ss_path_raw_list[path_index++]
      var path_file = toFileProtocol(path)

      var obj_ref = FO.prototype
      obj_ref.ss_mode = true
      obj_ref.w = w
      obj_ref.h = h
      obj_ref.path = path
      obj_ref.path_file = path_file
    }

    obj.ss_x = (frame % 10) * w
    obj.ss_y = parseInt(frame/10) * h

    var frame_copy = ss_frame_copy[frame]
    if (!frame_copy)
      frame_copy = 1

    for (var c = 0; c < frame_copy; c++)
      g.push(obj)
  }

  SEQ_gallery_ref = g
  return g
}

function loadImageDimALL() {
  if (!SEQ_mode) {
    for (var k = 0; k < gallery.length; k++) {
      var obj = gallery[k]
      var dim = loadImageDim(obj.path, obj)

      var w,h
      obj.w = w = dim.w
      obj.h = h = dim.h

      if (w_max < w)
        w_max = w
      if (h_max < h)
        h_max = h
    }
  }
  else {
    for (var i = 0; i < SEQ_gallery_all.length; i++) {
      var g_obj = SEQ_gallery_all[i]
      if (g_obj.ss_w) {
        var w = g_obj.ss_w
        var h = g_obj.ss_h

        if (w_max < w)
          w_max = w
        if (h_max < h)
          h_max = h

        continue
      }

      var g = g_obj.gallery
      for (var k = 0; k < g.length; k++) {
        var obj = g[k]
        var dim = loadImageDim(obj.path, obj)

        var w,h
        obj.w = w = dim.w
        obj.h = h = dim.h

        if (w_max < w)
          w_max = w
        if (h_max < h)
          h_max = h
      }
    }
  }

/*
  if (w_max && h_max)
    DEBUG_show(w_max + "x" + h_max, 2)
*/
}

function loadImageDim(path, obj) {
  if (obj && obj.w && obj.h)
    return { w:obj.w, h:obj.h }

  var item = ValidatePath(path)
  if (!item)
    return { w:0, h:0 }

  var w,h
  var meta_dim
  if (Vista_or_above)
    meta_dim = item.metadata("Dimensions")
  else if (Shell_OBJ) {
    try {
      var f = path.replace(/[\/\\][^\/\\]+$/, "")
      var p = path.replace(/^.+[\/\\]/, "")

      var dir = Shell_OBJ.NameSpace(f);
      var img = dir.ParseName(p);

      meta_dim = img.ExtendedProperty("Dimensions");
      if (!meta_dim)
        meta_dim = dir.GetDetailsOf(img, 26);
    }
    catch (err) {}
  }

  if (meta_dim && /(\d+)\D+(\d+)/.test(meta_dim)) {
    w = parseInt(RegExp.$1)
    h = parseInt(RegExp.$2)
  }
  else {
    w = 130
    h = 130
  }

  return { w:w, h:h }
}

var SA_extra_info_on

var SEQ_SP_gallery = []
var SEQ_SP_gallery_index = 0
var SEQ_SP_pic_index = -1
var SEQ_SP_finished

function SEQ_SmartPreloading() {
  if (EV_usage > 5)
    return

  if (!SEQ_SP_gallery.length)
    SEQ_SP_gallery = (SEQ_gallery_by_percent.length || !SEQ_gallery_shuffled.length) ? SEQ_gallery_all : SEQ_gallery_shuffled.slice(0)

  var preload_count = 10
  while ((!SEQ_SmartPreloading_Core()) && (--preload_count > 0)) {}

if (!preload_count && SA_extra_info_on)
DEBUG_show('(SP)',1)
}

function SEQ_SmartPreloading_Core() {
  if (++SEQ_SP_pic_index >= SEQ_SP_gallery[SEQ_SP_gallery_index].gallery.length) {
    SEQ_SP_pic_index = 0
    if (++SEQ_SP_gallery_index >= SEQ_SP_gallery.length) {
//DEBUG_show('(SP Finished)',2)
      SEQ_SP_finished = true
      Seq.item("SEQ_SmartPreloading").Stop()
      return true
    }
  }

  var pic = SEQ_SP_gallery[SEQ_SP_gallery_index].gallery[SEQ_SP_pic_index]
  if (pic.w && pic.h)
    return false

if (SA_extra_info_on)
DEBUG_show('(SP ' + (SEQ_SP_pic_index+1) + '/' + (SEQ_SP_gallery_index+1) + '/' + SEQ_SP_gallery.length + ')',1)
  var dim = loadImageDim(pic.path)
  pic.w = dim.w
  pic.h = dim.h
  return true
}

function LABEL_LoadSettings(name, v_default) {
  if (Settings.LABEL_matched) {
    var v = System.Gadget.Settings.readString(name)
    return ((v) ? v : v_default)
  }

  System.Gadget.Settings.writeString(name, "")
  return v_default
}

function loadFolder_CORE() {
  Settings.f_path = System.Gadget.Settings.readString("Folder")
  if (Settings.f_path) {
    if (/^demo\d+$/.test(Settings.f_path))
      Settings.f_path = path_demo[Settings.f_path]
  }
  else {
    Settings.f_path = f_path_default
  }

  return Settings.f_path
}

var Canvas_BDDraw_disabled = !returnBoolean("EnableBeatDetection") || !returnBoolean("EnableMotionEffectForAnimatedPicture")

function Canvas_BDDraw(canvas, beat) {
  var cw = canvas.width
  var ch = canvas.height
  var context
  var co = ['source-over', 'source-over']
  if (self.CANVAS_cached_layer_effect && Canvas_Effect && (Canvas_Effect.canvas == SL)) {
    if (!CANVAS_cached_layer_effect.width) {
      co[1] = 'copy'
      CANVAS_cached_layer_effect.width  = cw
      CANVAS_cached_layer_effect.height = ch
    }

    context = CANVAS_cached_layer_effect.getContext("2d")
    context.globalCompositeOperation = co[1]
    context.globalAlpha = 1
    context.drawImage(Canvas_Effect.canvas_buffer, 0,0)

    co[1] = 'source-over'
  }

  if (Canvas_BDDraw_disabled)
    return

  if (beat == null)
    beat = (EV_usage_sub && EV_usage_sub.BD) ? EV_usage_sub.BD.beat2 : 0

  if (!beat)
    return

  CANVAS_must_redraw = true

  var bd_scale   = beat / (16 / Math.pow(2, Settings.BDScale))
  var bd_opacity = 0.5 + (Settings.BDOpacity-1) * 1/6
  bd_opacity = bd_opacity*0.25 + beat*bd_opacity*0.75

  var w = parseInt(cw * bd_scale)
  var h = parseInt(ch * bd_scale)

  if (self.CANVAS_cached_layer_effect) {
    context = CANVAS_cached_layer_dummy.getContext("2d")
    context.globalCompositeOperation = 'copy'
    CANVAS_cached_layer_dummy.width  = cw
    CANVAS_cached_layer_dummy.height = ch

    if (!CANVAS_cached_layer_effect.width) {
      co[1] = 'copy'
      CANVAS_cached_layer_effect.width  = cw
      CANVAS_cached_layer_effect.height = ch
    }
  }
  else {
    context = canvas.getContext("2d")
    context.globalCompositeOperation = 'source-over'
  }

  context.globalAlpha = bd_opacity
  context.drawImage(canvas, w/2,h/2,cw-w,ch-h, 0,0,cw,ch)

  if (self.CANVAS_cached_layer_effect) {
    var layers = [canvas, CANVAS_cached_layer_effect]
    for (var i = 0; i < 2; i++) {
      context = layers[i].getContext("2d")
      context.globalCompositeOperation = co[i]
      context.globalAlpha = 1
      context.drawImage(CANVAS_cached_layer_dummy, 0,0)
    }
  }
}


// main
// "loadFolder()"
(function () {
  Settings.Folder_original = System.Gadget.Settings.readString("Folder")
  Settings.f_path_original = loadFolder_CORE()

  Settings.f_path_folder = Settings.f_path

  Settings.LABEL_f_path = System.Gadget.Settings.readString("LABEL_Folder")
  if (Settings.LABEL_f_path && (Settings.LABEL_f_path == Settings.f_path))
    Settings.LABEL_matched = true
  else
    System.Gadget.Settings.writeString("LABEL_Folder", Settings.f_path)

// obsolete
//  Settings.to_include_subfolders = returnBoolean("IncludeSubfolders")

// main
  gallery = []
  pic_last = null

  ItemsFromFolder(Settings.f_path, true)
  if (MacFace_mode) {
    document.write(
  '<script language="JavaScript" src="js/PlistXMLParser.js"></scr'+'ipt>\n'
+ '<script language="JavaScript" src="js/vistaFace.js"></scr'+'ipt>'
    )
    return
  }

  if (!(is_SA_child_animation_host && !is_SA_child_animation) && !gallery_js && !gallery.length && (!EQP_gallery || !EQP_gallery.length) && !self.MMD_SA_options) {
    EQP_gallery = null
    ItemsFromFolder(f_path_default, true)
  }

  if (gallery_js)
    document.write(SystemEXT.ReadJS(gallery_js, true))
  else if (self.MMD_SA_options)
    document.write('<script language="JavaScript" src="MMD.js/MMD_SA.js"></scr'+'ipt>')
  else if (!EQP_gallery && returnBoolean("UseFilters"))
    document.write('<script language="JavaScript" src="js_filters/animate.js"></scr'+'ipt>')
})();
