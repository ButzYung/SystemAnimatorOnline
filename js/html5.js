// HTML5 - Canvas
// (2021-11-23)

var use_HTML5

var CANVAS_must_redraw, WebGL_2D_must_redraw

// For Silverlight compatibility
var SL_loaded

var SL_windowless = true

var SL_PP_is_reset = true
var SL_PP_enabled

var SL_ST_enabled = true
// END


var CANVAS_obj = { _buffer: document.createElement("canvas") }
if (webkit_mode)
  CANVAS_obj._buffer2 = document.createElement("canvas")

function CANVAS_Object(img_id, ps) {
  this.img_id = img_id
  CANVAS_obj[img_id] = this

  var d
  d = this.canvas = document.createElement("canvas")
  d.id = "CANVAS_" + img_id
  d.img_id = img_id
//d.style.display="none"
/*
d.style.position="absolute"
d.style.posLeft=d.style.posTop=0
Lbody.appendChild(d)
*/

  d.canvas_parent = this
  d.Opacity = 1
  d.x_resized = d.y_resized = 0

// getter and setter work only on DOM objects (IE9 beta)
  Object.defineProperty(d, "Source",
{
  set: function(src) {
var img_obj
if (ps && ps.is_video) {
  img_obj = this.img_obj_v
  if (!img_obj || self.AudioFFT) {
    img_obj = document.createElement("video")
    img_obj.img_id = this.img_id
    img_obj.autoplay = true
    img_obj.addEventListener("canplaythrough", function (e) {
if (self.AudioFFT) {
  AudioFFT.connect(this)
}
CANVAS_SL_video_onload(e)
    }, true);
    img_obj.addEventListener("timeupdate", function (e) {
SL_MC_Timeupdate(this)
    }, true);

    if (ps.dragdrop.loop == 0) {
      img_obj.addEventListener("ended", function (e) {EQP_Hide_Video()}, true);
    }
    else
      img_obj.loop = true

    img_obj.Play  = function () { this.play() }
    img_obj.Pause = function () { this.pause() }
    img_obj.Stop  = function () { this.pause(); this.currentTime = 0; }
    Object.defineProperty(img_obj, "CanSeek",
{
  get: function () { return !this.seeking }
});

    img_obj._Position = { obj:img_obj }

    Object.defineProperty(img_obj, "Position",
{
  get: function () { return this._Position }

 ,set: function (v) {
var time = v.split(":")
this.currentTime = parseFloat(time[0])*60*60 + parseFloat(time[1])*60 + parseFloat(time[2])
  }
});

    Object.defineProperty(img_obj._Position, "Seconds",
{
  get: function () { return this.obj.currentTime }
});

    img_obj.NaturalDuration = { obj:img_obj }
    Object.defineProperty(img_obj.NaturalDuration, "Seconds",
{
  get: function () { return this.obj.duration }
});

    Object.defineProperty(img_obj, "CurrentState",
{
  get: function () { return ((this.paused) ? ((this.currentTime) ? "Paused" : "Stopped"): "Playing") }
});

    Object.defineProperty(img_obj, "IsMuted",
{
  get: function () { return this.muted }
 ,set: function (v) { this.muted = v }
});
  }
  else {
    this.canvas_parent.img_loaded = this.canvas_parent.drawn = false
  }

  this.img_obj = this.img_obj_v = img_obj
}
else {
  img_obj = this.img_obj_i
  if (!img_obj) {
    if (ps.is_canvas) {
      img_obj = document.createElement("canvas")
      img_obj.img_id = this.img_id
    }
    else {
      img_obj = new Image()
      img_obj.img_id = this.img_id
      img_obj.onload = CANVAS_SL_img_onload
    }
  }
  else {
    this.canvas_parent.img_loaded = this.canvas_parent.drawn = false
  }

  this.img_obj = this.img_obj_i = img_obj
}

if (ps.is_canvas) {
  if (ps.is_wallpaper) {
    var _this = this;
    (function () {
var that = _this
var timerID = setInterval(function () {
  if (!document.getElementById("C_BG_mask"))
    return

  clearInterval(timerID)
  timerID = null
  System._browser.BGMask_Draw(that.img_obj)
  CANVAS_SL_img_onload.call(that.img_obj)

  that.canvas_parent._drawn = false
  Object.defineProperty(that.canvas_parent, "drawn", {
    get: function () {
//return this._drawn
var drawn = that.img_obj._match_str
System._browser.BGMask_Draw(that.img_obj)

if (drawn == that.img_obj._match_str) {
// true only after canvas_parent has been actually drawn (i.e. simply checking .drawn state doesn't change this)
  if (drawn == that._match_str)
    return this._drawn
}
return false
    }
   ,set: function (v) {
this._drawn = v
    }
  });
}, 500);
    })();
  }
}
else {
  img_obj.src = src
}
  }
});

  Object.defineProperty(d, "Visibility",
{
  set: function (v) {
this._Visibility = v

if (v != "Visible")
  return

var ps = this.canvas_parent.ps
if (ps && /i$/.test(this.img_id)) {
  if (use_EQP_normal)
    ps.img = ps.img_obj_i
  else
    ps.img_obj = ps.img_obj_i
}
  }

 ,get: function () { return (this._Visibility) ? this._Visibility : "Visible" }
});

  if (ps)
    this.ps = ps
}

function CANVAS_SL_video_onload(e) {
  var sender = e.currentTarget
  SL_MC_video_obj = sender

  EV_sync_update.allow_update_between_frames = true
  CANVAS_must_redraw = true

  var d = CANVAS_obj[sender.img_id]
  d.img_loaded = true
  if (d.EQP_canvas_group_index != null)
    EQP_canvas_group[d.EQP_canvas_group_index].drawn = false

  if (/^(FIXED|RANDOM|SOUND)/.test(EV_object[0].EV_parser()))
    use_full_fps = true
}

function CANVAS_SL_img_onload() {
  CANVAS_must_redraw = true

  var d = CANVAS_obj[this.img_id]
  if (d.EQP_canvas_group_index != null) {
    var ps = d.ps
    ps.w = ps.w_org * EQP_size_scale
    ps.h = ps.h_org * EQP_size_scale
    EQP_canvas_group[d.EQP_canvas_group_index].drawn = false
  }

  var c = d.canvas
  if (c.gallery_fade) {
    var cf = c._canvas_for_fade
    if (!cf)
      cf = c._canvas_for_fade = document.createElement("canvas")
    cf.width  = c.width
    cf.height = c.height
    cf._time_ini = Date.now()

    var context = cf.getContext("2d")
    context.globalCompositeOperation = 'copy'
    context.drawImage(c, 0,0)
  }

  d.img_loaded = true
  if (d.mask_obj && !d.mask_obj.img_loaded)
    return

  d.draw(true)
}

function CANVAS_draw(first_draw) {
  if (!SL_loaded || !this.img_loaded || !SL.width)
    return false

  if (first_draw && this.drawn)
    return true


  var canvas_target = this.canvas
  var img_obj = canvas_target.img_obj

// mainly for wallpaper canvas
  this._match_str = canvas_target._match_str = img_obj._match_str

  var canvas = CANVAS_obj._buffer
  if (EQP_size_scale < 1) {
    canvas.width  = EQP_SL_w
    canvas.height = EQP_SL_h
  }
  else {
    canvas.width  = SL.width
    canvas.height = SL.height
  }

  var context = canvas.getContext("2d")
  context.globalCompositeOperation = 'copy'

  var is_image = (img_obj != canvas_target.img_obj_v)
  this.drawn = is_image

  var ps = this.ps

  var x = ps.x_org - EQP_SL_x
  var y = ps.y_org - EQP_SL_y
  var w, h

  var mp = this.mask_obj
  var mask_v
  var para = (is_image) ? ps.gallery : ps.dragdrop
  if (para) {
    if (ps.w && ps.h) {
var w_img, h_img
if (is_image) {
  w_img = img_obj.width
  h_img = img_obj.height
}
else {
  w_img = img_obj.videoWidth
  h_img = img_obj.videoHeight
}

if (mp) {
  if (!is_image && (!SL_MC_video_obj || SL_MC_video_obj.paused))
    return true

  if (!is_image && para.w_max && para.h_max) {
    var w_max = para.w_max
    var h_max = para.h_max

    var scale_w = 1
    var scale_h = 1
    var scale = 1
    if (w_img > w_max)
      scale_w = w_max / w_img
    if (h_img > h_max)
      scale_h = h_max / h_img
    scale = (scale_w < scale_h) ? scale_w : scale_h
    w_img = parseInt(w_img * scale)
    h_img = parseInt(h_img * scale)

    var x_offset = 0
    var y_offset = 0

    var video_align = para.video_align
    if (!video_align)
      video_align = "TL"
    var video_align_V = video_align.substr(0,1)
    var video_align_H = video_align.substr(1,1)
    if ((video_align_V == "T") || !h_max)
      y_offset = 0
    else if (h_max)
      y_offset = (h_max - h_img) * ((video_align_V == "B") ? 1 : 0.5)
    if ((video_align_H == "L") || !w_max)
      x_offset = 0
    else if (w_max)
      x_offset = (w_max - w_img) * ((video_align_H == "R") ? 1 : 0.5)

var x_align = para.x_align
var y_align = para.y_align
if (x_align != null) {
  if (x_align == "center")
    x = (EQP_SL_w - w_img) / 2
  else if (x_align == "right")
    x = EQP_SL_w - w_img
  else if (/^js\:(.+)/i.test(x_align))
    x = eval(x_align)
  else
    x = parseInt(x_align)

  x -= EQP_SL_x
}
if (y_align != null) {
  if (y_align == "center")
    y = (EQP_SL_h - h_img) / 2
  else if (y_align == "bottom")
    y = EQP_SL_h - h_img
  else if (/^js\:(.+)/i.test(y_align))
    y = eval(y_align)
  else
    y = parseInt(y_align)

  y -= EQP_SL_y
}

    var x_target = parseInt((x+x_offset)*EQP_size_scale)
    var y_target = parseInt((y+y_offset)*EQP_size_scale)
    w = Math.ceil(w_img*EQP_size_scale)
    h = Math.ceil(h_img*EQP_size_scale)

    var cw, ch
    if (para.mask_v) {
      if (is_image) {
        cw = img_obj.width
        ch = img_obj.height
      }
      else {
        cw = img_obj.videoWidth
        ch = img_obj.videoHeight
      }
    }
    else {
      cw = w_img
      ch = h_img
    }

    context.drawImage(img_obj, 0,0,cw,ch, x_target,y_target,w,h)

    mp.draw(true)
    w = mp.canvas.width
    h = mp.canvas.height

    if (para.mask_v) {
      mask_v = this.mask_obj_list[this.img_id + "_obj_mask"]
      mask_v.ps.w_org = w_img
      mask_v.ps.h_org = h_img
      mask_v.draw(true)
    }
  }
  else {
    var img_AR = w_img / h_img
    var target_AR = ps.w / ps.h
    var x_offset, y_offset
    if (img_AR > target_AR) {
      x_offset = parseInt((w_img - (h_img * img_AR)) / 2)
      y_offset = 0
    }
    else {
      x_offset = 0
      y_offset = parseInt((h_img - (w_img / target_AR)) / 2)
    }

    context.drawImage(img_obj, x_offset,y_offset,w_img-x_offset,h_img-y_offset, parseInt(x*EQP_size_scale),parseInt(y*EQP_size_scale),Math.ceil(ps.w*EQP_size_scale),Math.ceil(ps.h*EQP_size_scale))
  }
}
else {
  var w_ratio = ps.w / w_img
  var h_ratio = ps.h / h_img
  var ratio = (w_ratio < h_ratio) ? w_ratio : h_ratio
  var w_target = Math.round(w_img * ratio)
  var h_target = Math.round(h_img * ratio)
  var x_offset = parseInt((ps.w - w_target) / 2)
  var y_offset = parseInt((ps.h - h_target) / 2)

  context.drawImage(img_obj, 0,0,w_img,h_img, parseInt((x+x_offset)*EQP_size_scale),parseInt((y+y_offset)*EQP_size_scale),Math.ceil(w_target*EQP_size_scale),Math.ceil(h_target*EQP_size_scale))
}
    }
  }
  else {
    if (ps.w_org && ps.h_org) {
      context.drawImage(img_obj, x,y,ps.w_org,ps.h_org)
    }
    else
      context.drawImage(img_obj, x,y)

    var buffer2
    if (webkit_mode) {
      buffer2 = CANVAS_obj._buffer2
      buffer2.width  = SL.width
      buffer2.height = SL.height
      context = buffer2.getContext("2d")
      context.globalCompositeOperation = 'copy'
    }

    context.drawImage(canvas, 0,0,EQP_SL_w,EQP_SL_h, 0,0,SL.width,SL.height)

    if (buffer2)
      canvas = buffer2
  }


  x = parseInt(x * EQP_size_scale)
  y = parseInt(y * EQP_size_scale)
  if (!w)
    w = Math.ceil(ps.w_org * EQP_size_scale)
  if (w > SL.width - x)
    w = SL.width - x
  if (!h)
    h = Math.ceil(ps.h_org * EQP_size_scale)
  if (h > SL.height - y)
    h = SL.height - y

// Note that resizing the canvas will always reset the display
  canvas_target.x_resized = x
  canvas_target.y_resized = y
  canvas_target.width  = w
  canvas_target.height = h

  var context_target = canvas_target.getContext("2d")
  context_target.globalCompositeOperation = 'copy'

  context_target.drawImage(canvas, x,y,w,h, 0,0,w,h)

  var cf = canvas_target._canvas_for_fade
  if (cf && cf.width) {
    var t_ini = cf._time_ini
    var t_now = Date.now()

    var opacity = (t_now - t_ini) / (canvas_target.gallery_fade * 1000)
//DEBUG_show(opacity,0,1)
    if (opacity >= 1)
      cf.width = cf.height = 0
    else {
      this.drawn = false
      context_target.globalCompositeOperation = 'source-over'
      context_target.globalAlpha = 1-opacity
      context_target.drawImage(cf, 0,0)
      context_target.globalAlpha = 1
    }
  }

  if (mp) {
//DEBUG_show(w+'x'+h,0,1)
    mp.draw(true)

// Below is a workaround to fix a memory leak in WebKit, when some composite operations (source-in, destination-in, etc) are used too frequently.
    var mpc = mp.canvas
    var mask_v_wxh = w+'x'+h
    if (mask_v && (mp._mask_v_wxh != mask_v_wxh)) {
//DEBUG_show(mask_v_wxh,0,1)
      mp._mask_v_wxh = mask_v_wxh

      var mvc = mask_v.canvas
      w = mvc.width
      h = mvc.height

      var context_mpc = mpc.getContext("2d")
      context_mpc.globalCompositeOperation = 'destination-in'
      context_mpc.drawImage(mvc, 0,0,w,h, 0,0,Math.ceil(w * EQP_size_scale),Math.ceil(h * EQP_size_scale))
    }

    context_target.globalCompositeOperation = 'destination-in'
    context_target.drawImage(mpc, 0,0)
  }

  return this.drawn
}

CANVAS_Object.prototype.draw = CANVAS_draw

function CANVAS_load_mask(src, name) {
  if (!name)
    name = "mask"

  var mask_obj = CANVAS_Mask(name, this)
  mask_obj.ImageSource = toFileProtocol(src)
}

CANVAS_Object.prototype.load_mask = CANVAS_load_mask

function CANVAS_Mask(name, mask_parent) {
  var d = new Image()
  if (mask_parent) {
    d.mask_parent = mask_parent
    mask_parent.mask_obj = d

    name = mask_parent.img_id + "_" + name
    if (!mask_parent.mask_obj_list)
      mask_parent.mask_obj_list = []
    mask_parent.mask_obj_list[name] = d
  }
  d.mask_name = name
  d.draw = CANVAS_draw

  var canvas = document.createElement("canvas")
  d.canvas = canvas
  canvas.canvas_parent = canvas.img_obj = d

  Object.defineProperty(d, "ImageSource", {
    get: function () {
return this.Mask_src
    }

   ,set: function(src) {
this.Mask_src = src
if (!src) {
  CANVAS_must_redraw = true
  return
}

this.onload = CANVAS_Mask_onload
this.src = src
    }
  });

  return d
}

function CANVAS_Mask_onload() {
  CANVAS_must_redraw = true

  this.Mask_src = this.src
  this.img_loaded = true

  var ps = {}
  this.ps = ps
  if (this.mask_name == 'content_mask') {
    ps.x_org = 0;//WMP_left
    ps.y_org = 0;//WMP_top
    ps.w_org = EQP_SL_w;//WMP_width
    ps.h_org = EQP_SL_h;//WMP_height

    this.draw(true)
  }
  else {
    var para = EQP_dragdrop_target.dragdrop
    var mp = this.mask_parent
    ps.x_org = mp.ps.x_org
    ps.y_org = mp.ps.y_org
    ps.w_org = (para.w_max) ? para.w_max : para.w
    ps.h_org = (para.h_max) ? para.h_max : para.h
//DEBUG_show(ps.x_org+'x'+ps.y_org+','+ps.w_org+'x'+ps.h_org,0,1)
//    if (mp && mp.img_loaded && !mp.drawn)
//      mp.draw(true)
  }
}


// Silverlight emulation START
var SL_mask = {}

var SL_root = {
  SL_root_object: {}

 ,FindName: function (name) {
if (/mask/.test(name)) {
  if (!SL_mask[name])
    SL_mask[name] = CANVAS_Mask(name)
  return SL_mask[name]
}

var obj = this.SL_root_object[name]
if (!obj) {
  obj = {}

  if (name == "C_media_control") {
    Object.defineProperty(obj, "Visibility",
{
  get: function () {
return (C_media_control.style.visibility == "hidden") ? "Collapsed" : "Visible";
  }

 ,set: function(v) {
C_media_control.style.visibility = (v == "Collapsed") ? "hidden" : "inherit"
  }
});
  }
  else if (/^MC_/.test(name)) {
    obj.object = document.getElementById(name)
    Object.defineProperty(obj, "Text",
{
  get: function () {
return this.object.innerText;
  }

 ,set: function(v) {
this.object.innerText = v
  }
});
  }
  else if (/^(.+v)_obj$/.test(name)) {
    obj = CANVAS_obj[RegExp.$1].canvas.img_obj_v
  }

  this.SL_root_object[name] = obj
}

return obj
  }
}

// END


// canvas dummy for WebKit and XUL video
// (fixed in latest Chromium(?)) in the case of WebKit, some alpha and composition operations do not work properly when dealing with video object directly
// in the case of WebM, canavs dummy is used to cache the previous video frame, so that it can be used while the video is being seeked (to prevent blinking)
function _v_(v, w,h) {
  if ((!self.CANVAS_Video_Overlay || !CANVAS_Video_Overlay.monochrome) && (!w3c_mode || (v.tagName != 'VIDEO') || !/\.webm$/.test(v.src)))
    return v

  var v_dummy = CANVAS_obj._video_dummy
  if (!v_dummy) {
    v_dummy = CANVAS_obj._video_dummy = document.createElement("canvas")
  }

  if (v.seeking) {
//    console.log("(WebM frame restored during seeking)")
    return v_dummy
  }

  if (!w)
    w = v.videoWidth
  if (!h)
    h = v.videoHeight
  v_dummy.width  = w
  v_dummy.height = h

  var ctx = v_dummy.getContext("2d")
  if (self.CANVAS_Video_Overlay && CANVAS_Video_Overlay.monochrome) {
    ctx.fillStyle = 'white'
    ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'luminosity';
  }
  else {
    ctx.globalCompositeOperation = 'copy'
  }
  ctx.drawImage(v, 0,0,w,h)

  return v_dummy

}


// Canvas Video Overlay START
var CANVAS_Video_Overlay

function CANVAS_Video_Overlay_Init() {
  if (!CANVAS_Video_Overlay)
    return

  CANVAS_Video_Overlay.load_video_queue = function (pt) {
if (pt == null)
  pt = this.video_queue_pointer

var vq = this.video_queue
if (pt >= vq.length)
  pt = this.video_queue_pointer = 0

var obj = vq[pt]
this.url = obj.url
this.stop_counter = obj.stop_counter
  }

  // defaults START
  if (CANVAS_Video_Overlay.url && !/^\w+\:/.test(CANVAS_Video_Overlay.url))
    CANVAS_Video_Overlay.url = Settings.f_path_folder + '\\' + CANVAS_Video_Overlay.url
  CANVAS_Video_Overlay.url_default = CANVAS_Video_Overlay.url || ""

  if (!CANVAS_Video_Overlay.ini_time)
    CANVAS_Video_Overlay.ini_time = 0

  if (!CANVAS_Video_Overlay.end_time)
    CANVAS_Video_Overlay.end_time = 99999

  CANVAS_Video_Overlay._WE_default = {}
  CANVAS_Video_Overlay._WE_custom  = {}

  if (CANVAS_Video_Overlay.bg_darken_by == null)
    CANVAS_Video_Overlay.bg_darken_by = 0.5
  CANVAS_Video_Overlay._WE_default.bg_darken_by = CANVAS_Video_Overlay.bg_darken_by

  if (!CANVAS_Video_Overlay.video_alpha)
    CANVAS_Video_Overlay.video_alpha = 0.75
  CANVAS_Video_Overlay._WE_default.video_alpha = CANVAS_Video_Overlay.video_alpha

  if (!CANVAS_Video_Overlay.video_compositeOperation || !w3c_mode)
    CANVAS_Video_Overlay.video_compositeOperation = "lighter"//"hard-light"//"lighten"//"screen"//"lighter"
  CANVAS_Video_Overlay._WE_default.video_compositeOperation = CANVAS_Video_Overlay.video_compositeOperation

  if (!CANVAS_Video_Overlay.system_idle_max)
    CANVAS_Video_Overlay.system_idle_max = 5

  if (CANVAS_Video_Overlay.video_queue) {
    CANVAS_Video_Overlay.video_queue_pointer = 0
    CANVAS_Video_Overlay.load_video_queue()
  }
  // END


  CANVAS_Video_Overlay.system_idle_max *= 10*2

  Object.defineProperty(CANVAS_Video_Overlay, "stopping",
{
  get: function() {
if (!this.stop_counter)
  return false

if (typeof this.stop_counter == "number") {
  return (this.stop_counter > 0) ? --this.stop_counter : 0
}
else {
  return this.stop_counter()
}
  }

 ,set: function (v) {
this.stop_counter = v
  }
});

  if (!use_full_fps) {
    if (EV_sync_update.func_extra_sub)
      CANVAS_Video_Overlay._func_extra_sub = EV_sync_update.func_extra_sub

    EV_sync_update.func_extra_sub = function () {
if (CANVAS_Video_Overlay._func_extra_sub) {
  if (CANVAS_Video_Overlay._func_extra_sub()) {
    CANVAS_Video_Overlay.EQP_animate_extra()
    return
  }
}

CANVAS_Video_Overlay.draw()
    }
  }

  if (self.EQP_animate_extra)
    CANVAS_Video_Overlay._EQP_animate_extra = EQP_animate_extra

  self.EQP_animate_extra = function () {
if (CANVAS_Video_Overlay._EQP_animate_extra)
  CANVAS_Video_Overlay._EQP_animate_extra()

CANVAS_Video_Overlay.EQP_animate_extra()
  }


  CANVAS_Video_Overlay.draw = function () {
var v = this._video
if (!this.initialized || this.stopping || !SL.width || System._browser.is_dragging)
  return

if (v.loaded) {
  if (!v.seeking && (v.currentTime > this.end_time)) {
    this.on_ended()
    return
  }

  if (this.play_on_idle || (EV_usage_float > 0.1)) {
    v._system_idle_count = 0

    if (v.paused) {
      v.play()

      if (CANVAS_Video_Overlay.playbackRate && !v._playbackRate_set)
        setTimeout(function(){ v.playbackRate = v.defaultPlaybackrate = CANVAS_Video_Overlay.playbackRate; v._playbackRate_set = true; }, 0)
    }
  }
  else if (!v.paused && (++v._system_idle_count >= this.system_idle_max)) {
    v.pause()
    CANVAS_must_redraw = true
  }

  if (v.paused)
    return
}
else {
  if (v._system_idle_count >= this.system_idle_max)
    return
}

CANVAS_must_redraw = true

var w = SL.width
var h = SL.height

var context = SL.getContext("2d")
context.globalAlpha = 1
context.globalCompositeOperation = 'copy'
context.drawImage(this._canvas_dummy, 0,0)

if (this.bg_darken_by) {
  context.globalAlpha = this.bg_darken_by
  context.globalCompositeOperation = 'source-atop'
  context.fillStyle = "#000000"
  context.fillRect(0,0,w,h)
}

if (!v.loaded)
  return


if (CANVAS_Video_Overlay.use_wallpaper_as_bg && !is_SA_child_animation && document.getElementById("C_BG_mask")) {
  var wall = this._canvas_wall
  if (!wall)
    wall = this._canvas_wall = document.createElement("canvas")
  System._browser.BGMask_Draw(wall)

  var ss = SL_Host_Parent.style
  var ww = Math.min(wall.width,  w)
  var hh = Math.min(wall.height, h)

  var xx = ss.posLeft + Lbody_host.style.posLeft
  var yy = ss.posTop  + Lbody_host.style.posTop
  ww -= xx
  hh -= yy

  context.globalAlpha = 1
  context.globalCompositeOperation = 'destination-over'
  context.drawImage(wall, xx,yy,ww,hh, 0,0,ww,hh)
}

var v_w = (this.video_width)  ? this.video_width  * EQP_size_scale : w
var v_h = (this.video_height) ? this.video_height * EQP_size_scale : h
var v_x = (this.video_x) ? this.video_x * EQP_size_scale : 0
var v_y = (this.video_y) ? this.video_y * EQP_size_scale : 0

var mask_resized = CANVAS_Video_Overlay._mask_resized
var mask_context
if (mask_resized) {
  mask_context = mask_resized.getContext("2d")

  var wxh = v_w+'x'+v_h
  if (mask_resized._wxh != wxh) {
    mask_resized._wxh = wxh

    mask_resized.width  = v_w
    mask_resized.height = v_h

    mask_context.globalCompositeOperation = 'copy'
    mask_context.drawImage(CANVAS_Video_Overlay._mask, 0,0,v_w,v_h)
  }
  mask_context.globalCompositeOperation = 'source-in'
}

context.globalAlpha = this.video_alpha
context.globalCompositeOperation = this.video_compositeOperation

context.save()

if (CANVAS_Video_Overlay.flipH) {
  context.translate(w,0)
  context.scale(-1,1)
}

if (this.stretch_to_fit) {
  var AR  = v_w/v_h
  var vw  = v.videoWidth
  var vh  = v.videoHeight
  var vAR = vw/vh
  var sx, sy, sw, sh
  if (AR < vAR) {
    sw = parseInt(vh * AR)
    sh = vh
    sx = parseInt((vw - sw) / 2)
    sy = 0
  }
  else {
    sw = vw
    sh = parseInt(vw / AR)
    sx = 0
    sy = parseInt((vh - sh) / 2)
  }
//DEBUG_show(sx+','+sy+','+sw+','+sh)

  if (mask_resized) {
// skip the very first frame (.currentTime > 0) because during video source transition, the first frame can be empty which may "clear" the mask
//    if (v.currentTime)
      mask_context.drawImage(_v_(v), sx,sy,sw,sh, 0,0,v_w,v_h)
  }
  else
    context.drawImage(_v_(v), sx,sy,sw,sh, v_x,v_y,v_w,v_h)
}
else {
  if (mask_resized) {
//    if (v.currentTime)
      mask_context.drawImage(_v_(v), 0,0,v_w,v_h)
  }
  else
    context.drawImage(_v_(v), v_x,v_y,v_w,v_h)
}

if (mask_resized) {
  context.drawImage(mask_resized, v_x,v_y)
}

context.restore()
  }

  CANVAS_Video_Overlay.EQP_animate_extra = function () {
if (!this.initialized || !SL.width)
  return

var c = this._canvas_dummy
c.width  = SL.width
c.height = SL.height

var context = c.getContext("2d")
context.globalCompositeOperation = 'copy'
context.drawImage(SL, 0,0)

this.draw()
  }

  CANVAS_Video_Overlay.on_ended = function () {
var v = this._video

if (this.video_queue) {
  if (++this.video_queue_pointer > this.video_queue.length-1)
    this.video_queue_pointer = 0
  var obj = this.video_queue[this.video_queue_pointer]

  if (obj.url != this.url_last) {
    this.load_video_queue()

    v.loaded = false
    // delay a bit to prevent DOM Exception error
    setTimeout(function () {v.src = toFileProtocol(CANVAS_Video_Overlay.url)}, 100)
  }
}

v.currentTime = this.ini_time
  }


  var v = CANVAS_Video_Overlay._video = document.createElement("video")
  v.muted = true
/*
v.style.position = "absolute"
v.style.posLeft = v.style.posTop = 0
v.style.zIndex = 999
setTimeout(function () { SL_Host_Parent.appendChild(v) }, 1000)
*/
  v.addEventListener("canplaythrough",
function () {
  if (this.loaded)
    return
  this.loaded = true

  // fix a strange bug in webkit
  if (webkit_mode) {
    this.muted = !this.muted
    this.muted = !this.muted
  }

  if (!CANVAS_Video_Overlay.initialized) {
    CANVAS_Video_Overlay.initialized = true
    CANVAS_Video_Overlay._canvas_dummy = document.createElement("canvas")

    if (!CANVAS_Video_Overlay.use_wallpaper_as_bg)
      CANVAS_Video_Overlay.use_wallpaper_as_bg = (use_EQP_normal) ? !EQP_ps[0].use_HTML_IMG_ : /_gimage/.test(EQP_gallery_obj_active.imgs[0].src)

    if (CANVAS_Video_Overlay.mask && !/^\((.+)\)$/.test(CANVAS_Video_Overlay.mask)) {
      var img = CANVAS_Video_Overlay._mask = new Image()
      img.onload = function () {
CANVAS_Video_Overlay._mask_resized = document.createElement("canvas")
/*
var c = CANVAS_Video_Overlay._mask_resized
c.style.position = "absolute"
c.style.posLeft = v.style.posTop = 0
c.style.zIndex = 999
SL_Host_Parent.appendChild(c)
SL.style.display="none"
DEBUG_show(999,0,1)
*/
      }
      img.src = toFileProtocol(((/^\w+\:/.test(CANVAS_Video_Overlay.mask)) ? '' : Settings.f_path_folder + '\\') + CANVAS_Video_Overlay.mask)
    }
    else {
      var mask = CANVAS_Video_Overlay._mask = System._browser.BGMask_CreateCanvas(CANVAS_Video_Overlay.mask)
      if (mask)
        CANVAS_Video_Overlay._mask_resized = document.createElement("canvas")
    }

    this._system_idle_count = CANVAS_Video_Overlay.system_idle_max

    EV_sync_update.allow_update_between_frames = true

    DEBUG_show('Use HTML5 Video Overlay ' + ((/\.mp4$/i.test(v.src)) ? '(MP4)' : '(WebM)'), 2)
  }

  if (CANVAS_Video_Overlay.ini_time)
    this.currentTime = CANVAS_Video_Overlay.ini_time

  this._playbackRate_set = false

  if (CANVAS_Video_Overlay.stopping) {
    if (!this.paused)
      this.pause()
  }
}
  , true);

  v.addEventListener("ended",
function () {
  CANVAS_Video_Overlay.on_ended()
}
  , true);


  CANVAS_Video_Overlay.url_ = CANVAS_Video_Overlay.url
  Object.defineProperty(CANVAS_Video_Overlay, "url",
{
  get: function () {
var v_gallery = this.video_gallery
if (!v_gallery) {
  var url = CANVAS_Video_Overlay.url_
  var f = url && ValidatePath(url)
  if (!f)
    return ""

  if (f.isFolder) {
    v_gallery = this.video_gallery = Shell_ReturnItemsFromFolder(url, { RE_items:/\.(mp4|webm)$/i })
    if (!v_gallery.length)
      return ""
  }
  else
    v_gallery = this.video_gallery = [{path:url}]
}

var url = this.url_last = v_gallery[random(v_gallery.length)].path//.replace(/\.webm$/i, ".mp4")
return url
  }

 ,set: function (v) {
this.url_ = v
this.video_gallery = null
  }
});

  var url = CANVAS_Video_Overlay.url
  if (url) {
    v.src = toFileProtocol(url)
  }
}
//END


var CANVAS_must_redraw

function HTML5_Init() {
  SL_loaded = true

var SL_info = []
if (self.use_WMP)
  SL_info.push('WMP')
if (self.EQP_dragdrop_target || self.EQP_dragdrop_obj) {
  SL_info.push('Gallery')
  if (use_EQP_normal)
    SL_info.push('Video')
}
DEBUG_show('Use HTML5 Canvas' + ((SL_info.length) ? '(' + SL_info.join('/') + ')': ''), 2)

  var c_host = (returnBoolean("CSSTransform3DDisabledForContent")) ? document.getElementById("Lbody_host") : document.getElementById("Lbody")

  var d = document.createElement("div")
  var ds = d.style
  d.id = "SL_Host_Parent"
  ds.position = "absolute"
  ds.posLeft = 0
  ds.posTop = 0
  ds.zIndex = 10
  c_host.appendChild(d)

  var d = document.createElement("div")
  var ds = d.style
  d.id = "SL_Host"
  ds.position = "absolute"
  ds.posLeft = 0
  ds.posTop = 0
  ds.zIndex = 2
  SL_Host_Parent.appendChild(d)

  var d = document.createElement("canvas")
  d.width = d.height = 0
  var ds = d.style
  d.id = "SL"
  ds.position = "absolute"
  ds.posLeft = 0
  ds.posTop = 0
  SL_Host.appendChild(d)

  if (!WebGL_2D_options)
    WebGL_2D_options = {}

  if (Settings.UseCanvasPPE) {
    use_WebGL_2D = true
    WebGL_2D_options.use_Shadertoy = true
    if (Settings.UseCanvasNotebookDrawings) {
      WebGL_2D_options.use_NotebookDrawings = true
      WebGL_2D_options.texture_list = [System.Gadget.path + '\\images\\ST_tex16.png']
      WebGL_2D_options.SampNum_min = 8
      WebGL_2D_options.SampNum_max = 16
    }
    else if (Settings.UseCanvasWatercolor) {
      WebGL_2D_options.use_Watercolor = true
      WebGL_2D_options.texture_list = [System.Gadget.path + '\\images\\ST_tex16.png', System.Gadget.path + '\\images\\ST_tex02.jpg']
      WebGL_2D_options.SampNum_min = 16
      WebGL_2D_options.SampNum_max = 24
    }
    else if (Settings.UseCanvasVanGogh) {
      WebGL_2D_options.use_VanGogh = true
      WebGL_2D_options.texture_list = [System.Gadget.path + '\\images\\ST_tex16.png', System.Gadget.path + '\\images\\ST_tex19.png']
      WebGL_2D_options.SampNum_min = 12
      WebGL_2D_options.SampNum_max = 16
    }

//    Canvas_BDDraw_disabled = true
  }

  if (returnBoolean("UseJustSnow")) {
    use_WebGL_2D = true
    WebGL_2D_options.use_Shadertoy = true

    WebGL_2D_options.use_JustSnow = true
    WebGL_2D_options.use_JustSnowSlow = returnBoolean("UseJustSnowSlow")
  }

  var use_zoomblur = (w3c_mode && self.use_EQP_core && !Canvas_BDDraw_disabled)
  if (use_zoomblur)
    use_WebGL_2D = true

  if (use_WebGL_2D) {
    if (self.EQP_use_HTML5_video) {
      var update_para
      if (self.EQP_video_options) {
        if (!EQP_video_options.use_canvas_video)
          update_para = true
      }
      else {
        self.EQP_video_options = {}
        update_para = true
      }

      if (update_para) {
        EQP_video_options.use_canvas_video = true
        EQP_video_options.FPS = 30
        EQP_video_options.disable_chroma_key = true
      }
    }

    WebGL_2D.createObject(SL)
    if (use_zoomblur) {
      SL._WebGL_2D.use_zoomblur = true
      Canvas_BDDraw_disabled = true
    }
  }

// media control START
SL._mouseout_timerID = null

SL._mouse_event_main = function () {
  if (SL_MC_video_obj || (self.use_WMP && WMP.in_use) || (self.EQP_use_HTML5_video && (!self.EQP_video_options || !EQP_video_options.use_overlay_video))) {
    if (SL._mouseout_timerID) {
      clearTimeout(SL._mouseout_timerID)
      SL._mouseout_timerID = null
    }
    return true
  }

  return false
}

var m = {}

SL.onmouseover = m.onmouseover = C_media_control.onmouseover = function () {
  if (!SL._mouse_event_main())
    return

  SL_Media_MouseEnter(SL_MC_video_obj)
}

SL.onmouseout = m.onmouseout = function () {
/*
  var p = document.getElementById("Lchild_animation_parent")
  if (p) {
    p.style.pointerEvents = "auto"
DEBUG_show(9,0,1)
  }
*/
  if (!SL._mouse_event_main())
    return

  SL._mouseout_timerID = setTimeout('C_media_control.style.visibility="hidden"', 500)
}

if (use_WebGL_2D) {
  WebGL_2D._m_ = m
  SL._WebGL_2D.init_custom = function () {
this.canvas.onmouseover = WebGL_2D._m_.onmouseover
this.canvas.onmouseout  = WebGL_2D._m_.onmouseout
  }
}
// END

  SL_object = SL

// WMP
if (self.WMP)
  WMP.dragdrop_init()

if (CANVAS_Video_Overlay)
  CANVAS_Video_Overlay_Init()

// Enforce proper resizing
  if (self.EQP_resize)
    EQP_resize()
}


// media control
document.write('<script language="JavaScript" src="js/SA_media_control.js"></scr'+'ipt>');

// Matrix rain
if (returnBoolean("UseMatrixRain") || use_MatrixRain) {
  use_MatrixRain = true
  document.write('<script language="JavaScript" src="js/canvas_matrix_rain.js"></scr'+'ipt>');
}

// Youtube decode
/*
document.write('<script language="JavaScript" src="js/youtube_decode.js"></scr'+'ipt>');
*/

// WebGL 2D
var use_WebGL, use_WebGL_2D
if (use_WebGL) {
  document.write('<script language="JavaScript" src="js/html5_webgl2d.js"></scr'+'ipt>');
}
