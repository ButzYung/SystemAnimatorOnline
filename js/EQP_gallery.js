// EQP Gallery (v3.5.1)

//  SA defaults
var EV_init
var EV_width, EV_height
var EV_BG_src, EV_BG_allow_dummy
var EV_animate_full

var use_full_spectrum = true
// END


var EQP_ps
var EQP_EQ_mode, EQP_EQ_index
var EQP_decay_factor
var EQP_decay_factor2
var EQP_EQ_min = 99
var EQP_EQ_max = 0
var EQP_init_extra, EQP_animate_extra
var EQP_allow_resize
var EQP_size_scale
var EQP_size_scale_auto = true
var EQP_SS_path

var EQP_FB_EQ
var EQP_FB_rotation, EQP_FB_flipH, EQP_FB_flipV

var EQP_FB_align_center
var EQP_FB_align_center_shift
var EQP_gallery_obj = []
var EQP_gallery_obj_active
var EQP_EQ_divider
var EQP_EQ_width, EQP_EQ_height
var EQP_bg_color
var EQP_bg_filter
var EQP_bg_border, EQP_border_width
var EQP_u_reversed
var EQP_dragdrop_obj

var EQP_Pixastic_list

var EQP_use_HTML5_video, EQP_HTML5_video_onload

var EQP_canvas_group = [
  { ps:[] }
 ,{ ps:[] }
]


function EQP_resize(scale, no_msg) {
  EQP_resize_CORE(scale, no_msg)


  var scale_org = EQP_size_scale
  if ((use_Silverlight && SL_ST_enabled) || self.EQ_Filter || use_CSS3_2D_Transforms)
    EQP_size_scale = 1


  var bg = EQP_gallery_obj_active.bg
  bg.x = bg.x_org * EQP_size_scale + EQP_border_width
  bg.y = bg.y_org * EQP_size_scale + EQP_border_width
  bg.w = bg.w_org * EQP_size_scale
  bg.h = bg.h_org * EQP_size_scale

  var img_new = false
  var main_c = EQP_gallery_obj_active.main_container
  if (!main_c) {
    img_new = true
    main_c = document.createElement("div")
    main_c.style.position = "absolute"
    main_c.style.posLeft = 0
    main_c.style.posTop = 0
    main_c.style.visibility = (self.EQ_Filter) ? "hidden" : "inherit"
  }

if (use_Silverlight) {
  if (SL_loaded) {
    var ps = EQP_ps[0]

var img = ps.img_obj
if (!img) {

if (use_HTML5) {
  var c_obj = new CANVAS_Object("bg", bg)
  var canvas = c_obj.canvas

  canvas['Canvas.ZIndex'] = 50
  canvas.Source = toFileProtocol((bg.is_filter) ? System.Gadget.path + '\\images\\_bg_dummy\\EQF_bars_bg0.png' : bg.src)
  canvas.Opacity = (bg.opacity) ? bg.opacity/100 : ((bg.is_filter) ? 0.5 : 1)

  img = ps.img_obj = canvas
}
else {
  var tag
  if (bg.is_video)
    tag = 'Canvas'
  else
    tag = 'Image'

  var clip =
  '<'+tag+'.Clip>\n'
+ '<PathGeometry>\n'
+ '<PathGeometry.Figures>\n'
+ '<PathFigure x:Name="bg_StartPoint" StartPoint="0,0">\n'
+ '<PathFigure.Segments>\n'
+ '<PolyLineSegment x:Name="bg_Points" Points="0,0, 0,0, 0,0" />\n'
+ '</PathFigure.Segments>\n'
+ '</PathFigure>\n'
+ '</PathGeometry.Figures>\n'
+ '</PathGeometry>\n'
+ '</'+tag+'.Clip>\n'

  var opacity = (bg.opacity == null) ? ((bg.EQP_video_options && bg.EQP_video_options.hide_EQ) ? ' Opacity="0"' : '') : ' Opacity="' + (bg.opacity/100) + '"';

  var xaml
  if (bg.is_video) {
    xaml =
  '<Canvas xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" x:Name="bg" '
+ 'Canvas.ZIndex="50"' + opacity
+ '>\n'
+ clip
+ '<MediaElement x:Name="bg_obj" '
+ 'Stretch="UniformToFill" Source="' + toFileProtocol(bg.src) + '" '
+ 'MediaOpened="SL_MediaOpened" MediaEnded="SL_MediaEnded" '
+ ((bg.use_media_control) ? 'MouseEnter="SL_Media_MouseEnter" ' : '')
+ ((bg.play_sound) ? 'Volume="1"' : 'IsMuted="true"')
+ '>\n'
+ '</MediaElement>\n'
+ '</Canvas>'
  }
  else if (bg.is_filter) {
    xaml =
  '<Image xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" x:Name="bg" '
+ 'Canvas.ZIndex="50" Opacity="0.5" Stretch="Fill" Source="' + toFileProtocol(System.Gadget.path + '\\images\\_bg_dummy\\EQF_bars_bg0.png') + '">\n'
+ clip
+ '</Image>'
  }
  else {
    xaml =
  '<Image xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" x:Name="bg" '
+ 'Canvas.ZIndex="50"' + opacity + ' Source="' + toFileProtocol(bg.src) + '">\n'
+ clip
+ '</Image>'
  }

  SL_content.children.add(SL.content.createFromXaml(xaml, false));
  img = ps.img_obj = SL_root.FindName("bg")
}

}

    if (bg.w >= 0)
      img.Width  = bg.w
    if (bg.h >= 0)
      img.Height = bg.h
    img["Canvas.Left"] = (bg.x_org - EQP_gallery_obj_active.x_offset) * EQP_size_scale
    img["Canvas.Top"]  = (bg.y_org - EQP_gallery_obj_active.y_offset) * EQP_size_scale

    if (bg.is_video) {
      var bg_v = SL_root.FindName("bg_obj")
      if (bg.w_video > 0)
        bg_v.Width  = bg.w_video
      if (bg.h_video > 0)
        bg_v.Height = bg.h_video
    }

    for (var i = 0; i < EQP_ps.length; i++)
      EQP_ps[i].o_last = -1
  }
}
else {
  for (var i = 0; i < EQP_ps.length; i++) {
    var ps = EQP_ps[i]

    var img = ps.img_obj
    if (img_new) {
      img = ps.img_obj = document.createElement("img")
      img.style.position = "absolute"
      ps.o_last = -1
    }

var w = bg.w
var h = bg.h
if (self.EQ_Filter && EQ_Filter.EQP_width) {
  w = EQ_Filter.EQP_width
  h = EQ_Filter.EQP_height
}

    var s = img.style
    s.pixelWidth  = w
    s.pixelHeight = h
    s.posLeft = bg.x
    s.posTop  = bg.y
    s.zIndex = 50
    s.visibility = (bg.EQP_video_options && bg.EQP_video_options.hide_EQ) ? "hidden" : "inherit"

    if (ie9_mode && bg.opacity)
      s.opacity = bg.opacity/100

    img.src = ((!use_SA_browser_mode && (EQP_size_scale < 1)) || EQP_gallery_obj_active.use_gimage) ? "gimage:///" + bg.src + ("?width=" + bg.w + "&height=" + bg.h) : toFileProtocol(bg.src)

    if (img_new)
      main_c.appendChild(img)
  }
//DEBUG_show(EQP_ps[0].img_obj.src)
}


  var imgs = EQP_gallery_obj_active.imgs
  for (var i = 0; i < imgs.length; i++) {
    var _img = imgs[i]

    _img.x = _img.x_org * EQP_size_scale + EQP_border_width
    _img.y = _img.y_org * EQP_size_scale + EQP_border_width
    _img.w = _img.w_org * EQP_size_scale
    _img.h = _img.h_org * EQP_size_scale

    var img = _img.img_obj

if (_img.use_GADGET_IMG) {
  if (!img)
    img = _img.img_obj = BG.addImageObject(_img.src, 0,0)
  img.left = (_img.w - _img.w_org)/2 + _img.x
  img.top  = (_img.h - _img.h_org)/2 + _img.y
  img.width  = _img.w
  img.height = _img.h
  continue
}

if (EQP_use_HTML5_video && (i == 0) && _img.is_video) {
  if (!use_Silverlight || SL_loaded) {
    var c, cs, cc, ccs
    var cp, cps
    cp = document.getElementById("V_Host_Parent")
    if (cp) {
      cps = cp.style

      c = V_Host
      cs = c.style

      cc = V_canvas
      ccs = cc.style
    }
    else {
      cp = document.createElement("div")
      cp.id = "V_Host_Parent"
      cps = cp.style
      cps.position = "absolute"
      cps.posLeft = cps.posTop = 0

      c = document.createElement("div")
      c.id = "V_Host"
      cs = c.style
      cs.position = "absolute"
      cs.posLeft = cs.posTop = 0
      cs.zIndex = 1
      cs.overflow = "hidden"
      cp.appendChild(c)

      cc = document.createElement("canvas")
      cc.id = "V_canvas"
      ccs = cc.style
      ccs.position = "absolute"
      ccs.posLeft = cs.posTop = 0
      ccs.zIndex = 1
      c.appendChild(cc)

      var host = (use_Silverlight) ? SL_Host_Parent : main_c
      host.appendChild(cp)
    }

    cps.zIndex = (((EQP_gallery_obj_active.bg_video == EQP_gallery_obj_active.bg) || (EQP_gallery_obj_active.bg.src != EQP_gallery_obj_active.imgs[0].src)) ? 0 : 3) //_img.z

    if (!img) {
      var vo = _img.EQP_video_options
      if (!vo)
        vo = _img.EQP_video_options = {}

      var v, vv
      if (vo.use_canvas_video) {
        v = document.createElement("canvas")
        vv = v._video = document.createElement("video")
        vv._canvas = v

        // ignoring "use_WebGL_2D", always use WebGL 2D in XUL and node-webkit, since WebGL is faster for processing chroma key
        if (use_WebGL) {
          WebGL_2D.createObject(v)
        }

        var cd = document.createElement("canvas")
        cd.id = "V_canvas_for_display"
        cds = cd.style
        cds.position = "absolute"
        cds.posLeft = cs.posTop = 0
        cp.appendChild(cd)

        // for using as 3D texture, canvas copy, etc
        SL._canvas_for_copy = V_canvas_for_display

        if (use_WebGL_2D) {
          WebGL_2D.createObject(V_canvas_for_display)
// commenting out for now, because copying a 2D canvas is faster and more stable than a WebGL canvas
//          SL._canvas_for_copy = V_canvas_for_display._WebGL_2D.canvas

          if (!EQP_video_options.no_BD) {
            V_canvas_for_display._WebGL_2D.use_zoomblur = !Canvas_BDDraw_disabled
            EQP_video_options.no_BD = true
          }

          V_canvas_for_display._WebGL_2D.init_custom = function () {
V_Host_Parent.onmouseover = WebGL_2D._m_.onmouseover
V_Host_Parent.onmouseout  = WebGL_2D._m_.onmouseout
this.canvas.onmouseover = WebGL_2D._m_.onmouseover
this.canvas.onmouseout  = WebGL_2D._m_.onmouseout
          }
        }

        if (vo.chroma_key)
          vo.SVG_filter = null

v.play  = function () { this._video.play() }
v.pause = function () { this._video.pause() }
v.stop  = function () { this._video.stop() }

Object.defineProperty(v, "paused",
{
  get: function () {
return this._video.paused;
  }
});

Object.defineProperty(v, "ended",
{
  get: function () {
return this._video.ended;
  }
});

Object.defineProperty(v, "seeking",
{
  get: function () {
return this._video.seeking;
  }
});

Object.defineProperty(v, "muted",
{
  get: function () {
return this._video.muted;
  }

 ,set: function (v) {
this._video.muted = v;
  }
});

Object.defineProperty(v, "duration",
{
  get: function () {
return this._video.duration;
  }
});

Object.defineProperty(v, "currentTime",
{
  get: function () {
return this._video.currentTime;
  }

 ,set: function (v) {
this._video.currentTime = v;
  }
});

Object.defineProperty(v, "playbackRate",
{
  get: function () {
return this._video.playbackRate;
  }

 ,set: function (v) {
this._video.playbackRate = v;
  }
});

Object.defineProperty(v, "defaultPlaybackRate",
{
  get: function () {
return this._video.defaultPlaybackRate;
  }

 ,set: function (v) {
this._video.defaultPlaybackRate = v;
  }
});

Object.defineProperty(v, "src",
{
  get: function () {
return this._video.src;
  }

 ,set: function (v) {
this._video.src = v;
  }
});

Object.defineProperty(v, "busy",
{
  get: function () {
return this._video.busy;
  }

 ,set: function (v) {
this._video.busy = v;
  }
});

Object.defineProperty(v, "poster_mode",
{
  get: function () {
return this._video.poster_mode;
  }

 ,set: function (v) {
this._video.poster_mode = v;
  }
});
      }
      else {
        v = vv = document.createElement("video")
        v.id = "V_video"
      }

      var vs = v.style
      vs.position = "absolute"
      vs.posTop = vs.posLeft = 0

      if (vo.SEQ_mode)
        vs.visibility = "hidden"
      else
        vv.autoplay = !vo.disable_autostart

      vv.muted = !vo.play_sound

vv.func_video_fading = function () {
  var vo = this._EQP_obj.EQP_video_options
  if (!vo || !vo.use_canvas_video)
    return false

  var cf = this.canvas_for_fade
  cf.width  = V_canvas_for_display.width
  cf.height = V_canvas_for_display.height

  var context = cf.getContext("2d")
  context.globalCompositeOperation = 'copy'
  context.drawImage(V_canvas_for_display, 0,0)

  this._canvas._loop_fade_count = vo.FPS/2 - 1
  return true
}

      if (!vo.no_loop) {
//  vv.loop = true

  vv.write_bounding_box = function () {
var v = this
var img = v._EQP_obj
var vo = img.EQP_video_options

var w = v.videoWidth
var h = v.videoHeight
var bb = vo.bounding_box
if (bb[bb.length-1][0] == w-1)
  bb[bb.length-1] = [w/2-1,h/2-1, w/2-1,h/2-1]

var f = FSO_OBJ.OpenTextFile(img.src + '.txt', 2, true);
f.Write(JSON.stringify(bb))
f.Close()

vo.bounding_box_calculation_mode = false
DEBUG_show("(Bounding Box Mode:END)", 2)
  }

  vv.addEventListener("ended", function (e) {
var v = e.currentTarget
if (v.loop || (v.duration < 10))
  return

var vo = v._EQP_obj.EQP_video_options
if (vo && vo.bounding_box_calculation_mode) {
  v.write_bounding_box()
}
else if (vo.SEQ_mode && vo.SEQ_gallery) {
  EQP_SEQ_Video_Process(true, true)
  return
}

vo.marker_index = 0

v.func_video_fading()
v.currentTime = 0
  }, true)
      }

      if (!use_Silverlight && !vo.hide_media_control)
        vv.controls = true

      if ((w3c_mode) && vo.SVG_filter)
        vv.style.filter = vo.SVG_filter()

      vv.addEventListener("timeupdate", (function () {
        var time_last = 0
        return function (e) {
if (!vo.SEQ_mode) {
  SL_MC_Timeupdate(this)

// onloop
  var v = e.currentTarget
  var ao = vo.audio_obj
  if (ao && !ao.paused && (time_last > 1) && (v.currentTime < 0.2)) {
    var time_reference = (ao.beat_reference - ao.currentTime) * ao.BPM/vo.BPM + v.currentTime
//DEBUG_show(time_reference)
    EQP_SyncBPM_Auto(v, vo, time_reference, true)
  }
  time_last = v.currentTime
}
        };
      })(), true);

      vv.addEventListener("canplaythrough", EQP_HTML5_video_onload, true);

      vv.addEventListener("seeking",
function (e) {
  var v = e.currentTarget
  var vo = v._EQP_obj.EQP_video_options
  if (!vo)
    return

  if (vo.BPM_syncing_timerID) {
    clearTimeout(vo.BPM_syncing_timerID)
    vo.BPM_syncing_timerID = vo.BPM_syncing = null
  }
  if (vo.BPM_syncing_timerID2) {
    clearTimeout(vo.BPM_syncing_timerID2)
    vo.BPM_syncing_timerID2 = vo.BPM_syncing = null
  }
},
      true);

      vv.addEventListener("seeked",
function (e) {
  var v = e.currentTarget
  var vo = v._EQP_obj.EQP_video_options
  if (!vo.use_canvas_video)
    v.style.visibility = "inherit"

  if (!vo || v.poster_mode)
    return

  var ov = v._overlay_video
  if (ov) {
    var o = vo.overlay_video
    ov.Opacity = (ov.Opacity <= o.video_opacity_min/100) ? o.video_opacity_max/100 : o.video_opacity_min/100
    v._overlay_video = null
  }

  if (vo.SEQ_mode && vo.SEQ_gallery)
    DEBUG_show('(' + (vo.SEQ_gallery_index+1) + '/' + vo.SEQ_gallery.length + ':' + vo.SEQ_gallery[vo.SEQ_gallery_index].index + ')', 2)

  if ((vo.poster_frame == -1) && !vo.BPM_mode) {
    v.poster_mode = true
    v.pause()
    return
  }

  if (vo.BPM_mode && v.paused) {
    var ao = vo.audio_obj
    var audio_bpm = ao.BPM
    var beat_reference = ao.beat_reference

    // audio beat fraction
    var beat_a = (ao.currentTime - beat_reference)/60 * audio_bpm
    beat_a = beat_a - parseInt(beat_a)
    if (beat_a < 0)
      beat_a++

    // video beat fraction
    var beat_v = (v.currentTime - vo.beat_reference)/60 * vo.BPM
    beat_v = beat_v - parseInt(beat_v)
    if (beat_v < 0)
      beat_v++

    // beat delay to sync video to audio
    var beat = beat_v - beat_a
    if (beat < 0)
      beat++

    var beat_time_mod = beat * (60/audio_bpm)

//DEBUG_show(beat_reference+'|'+beat_a+'/'+beat_v+'/'+beat+'/'+beat_time_mod,0,1)

    if (!beat_reference || (beat < 0.1) || (beat > 0.9) || (beat_time_mod < 0.05) || (60/audio_bpm - beat_time_mod < 0.05)) {
      v.play()
    }
    else {
      DEBUG_show("(+" + Math.round(beat*100)/100 + "beat)", 2)
      v.busy = true
      setTimeout(function () { v.busy=false; v.play(); }, beat_time_mod*1000)
    }
  }
},
      true);


      _img.load_video = function () {
var vo = this.EQP_video_options
if (vo && vo.use_canvas_video && !vo.disable_chroma_key) {
  var bb_path = this.src + '.txt'
  vo.bounding_box = vo.bounding_box_list[bb_path]
  if (!vo.bounding_box) {
    if (FSO_OBJ.FileExists(bb_path)) {
      try {
        var file = FSO_OBJ.OpenTextFile(bb_path, 1);
        var txt = file.ReadAll()
        file.Close()

        if (txt) {
          vo.bounding_box = vo.bounding_box_list[bb_path] = JSON.parse(txt)
          DEBUG_show("Use bounding box", 2)
        }
      }
      catch (err) {}
    }
  }
}

this.video_loaded = false
this.src_last = this.src
this.img_obj_v.src = toFileProtocol(this.src)
/*
var that = this
YoutubeVideo("Fbqija5mCzI", function (video) {
// video.title
// video.getSource("video/mp4", "medium").url
// hd720
that.img_obj_v.src = video.getSource("video/mp4", "medium").url
});
*/
      }


      // for fading
      v.canvas_for_fade = vv.canvas_for_fade = document.createElement("canvas")

      v._EQP_obj = vv._EQP_obj = _img

      img = _img.img_obj = _img.img_obj_v = v


      if (!vo.SEQ_mode || !vo.SEQ_gallery) {
        _img.load_video()
      }
      else {
        _img.src_ = _img.src

        Object.defineProperty(_img, "src",
{
  get: function() {
var src
var vo = this.EQP_video_options
if (vo.SEQ_mode && vo.SEQ_gallery && (vo.SEQ_gallery_index >= 0))
  src = vo.SEQ_gallery[vo.SEQ_gallery_index].src

if (!src)
  src = this.src_

// relative path
if (!/\:/.test(src))
  src = Settings.f_path_folder + '\\' + src.replace(/\//g, "\\")

return src
  }

 ,set: function (v) {
this.src_ = v;
  }
});

        Object.defineProperty(_img, "src_changed",
{
  get: function () {
return (this.src != this.src_last);
  }
});

      }

      if (!vo.use_canvas_video)
        c.appendChild(v)
    }

    var vo = (_img.EQP_video_options) ? _img.EQP_video_options : {}

    if (_img.w >= 0)
      img.width  = _img.w_natural * scale_org
    if (_img.h >= 0)
      img.height = _img.h_natural * scale_org

if (_img.adjust_dimension_by_scale) {
  var stretch_to_cover = webkit_electron_mode && !is_SA_child_animation && returnBoolean("AutoItStayOnDesktop")
  var screen_w, screen_h
  if (stretch_to_cover) {
    screen_w = screen.width
    screen_h = screen.height
  }
  else {
    screen_w = screen.availWidth
    screen_h = screen.availHeight
  }

  is_SA_fullscreen_offset_custom = false
  if ((scale_org == 1) && ((img.width > screen_w) || (img.height > screen_h))) {
    scale_org = ((stretch_to_cover) ? Math.max : Math.min)(screen_w/_img.w_natural, screen_h/_img.h_natural)
    var w = Math.round(_img.w_natural * scale_org)
    var h = Math.round(_img.h_natural * scale_org)
    img.width  = w
    img.height = h

    if (stretch_to_cover) {
      is_SA_fullscreen_offset_custom = true
      SA_fullscreen_offsetX = parseInt((screen_w - w) / 2)
      SA_fullscreen_offsetY = parseInt((screen_h - h) / 2)
    }
    else {
      SA_fullscreen_offsetX = SA_fullscreen_offsetY = 0
    }

    if (document.getElementById("LEQP_html_bg")) {
      LEQP_html_bg.style.border = "none"
      EQP_border_width = 0
    }
  }
  else {
    if (document.getElementById("LEQP_html_bg") && EQP_bg_border && !EQP_border_width) {
      LEQP_html_bg.style.border = EQP_bg_border
      if (/^(\d+)/.test(EQP_bg_border))
        EQP_border_width = parseInt(RegExp.$1)
    }
  }
}

    if (img.width && img.height)
      DEBUG_show('Video resized:'+img.width+'x'+img.height,2)

    var clip = (vo.clip) ? vo.clip : [0,0,0,0]

    var vs = img.style
    vs.posLeft = -clip[0] * scale_org
    vs.posTop  = -clip[1] * scale_org

    if (use_Silverlight) {
      cs.posLeft = (_img.x_org - EQP_gallery_obj_active.x_offset) * scale_org
      cs.posTop  = (_img.y_org - EQP_gallery_obj_active.y_offset) * scale_org
    }
    else {
      cs.posLeft = _img.x
      cs.posTop  = _img.y
    }

    var _scale = (use_Silverlight) ? scale_org : 1
    cs.pixelWidth  = _img.w * _scale
    cs.pixelHeight = _img.h * _scale
    if (!vo._video_src_changing) {
      cc.width  = cs.pixelWidth
      cc.height = cs.pixelHeight
    }

    if (vo.use_canvas_video) {
      img.drawn = false
    }
    else if (!vo._video_src_changing) {
      var cf = img.canvas_for_fade
      cf.width  = cc.width
      cf.height = cc.height
    }

    var cd = document.getElementById("V_canvas_for_display") 
    if (cd) {
      var cdw = Math.round((EQP_gallery_obj_active.w_org - EQP_gallery_obj_active.x_offset*2) * scale_org)
      if (cd.width != cdw)
        cd.width = cdw
      var cdh = Math.round((EQP_gallery_obj_active.h_org - EQP_gallery_obj_active.y_offset*2) * scale_org)
      if (cd.height != cdh)
        cd.height = cdh
    }

    if (!use_Silverlight_only)
      continue

// create a dummy Silverlight layer for mouse event
    img = _img.img_obj_r_dummy
    if (!img) {
      var img_id = "main" + i

      var xaml_para = 'Fill="White" Canvas.ZIndex="' + _img.z + '" Opacity="0"';

      var xaml, ext
      xaml =
  '<Rectangle xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" x:Name="' + img_id + 'r_dummy" '
+ xaml_para
+ '>\n'
+ '</Rectangle>'

      ext = "r_dummy"

      SL_content.children.add(SL.content.createFromXaml(xaml, false));
      img = _img.img_obj_r_dummy = SL_root.FindName(img_id + ext)
    }
/*
    if (_img.w >= 0)
      img.Width  = _img.w
    if (_img.h >= 0)
      img.Height = _img.h
    img["Canvas.Left"] = (_img.x_org - EQP_gallery_obj_active.x_offset) * EQP_size_scale
    img["Canvas.Top"]  = (_img.y_org - EQP_gallery_obj_active.y_offset) * EQP_size_scale
*/
    img.Width  = Math.round((EQP_gallery_obj_active.w_org - EQP_gallery_obj_active.x_offset*2) * EQP_size_scale)
    img.Height = Math.round((EQP_gallery_obj_active.h_org - EQP_gallery_obj_active.y_offset*2) * EQP_size_scale)
    img["Canvas.Left"] = 0
    img["Canvas.Top"]  = 0
  }
  continue
}
else if (use_Silverlight && !EQP_gallery_obj_active.use_filter) {
  if (SL_loaded) {
    if (!img) {

if (use_HTML5) {
  var img_id = "main" + i + "i"

  var mask = EQP_SS_init("EQP_gallery_obj_active.imgs[" + i + "]", img_id)

  var c_obj = new CANVAS_Object(img_id, _img)
  var canvas = c_obj.canvas

  canvas['Canvas.ZIndex'] = _img.z
  canvas.Opacity = (_img.opacity) ? _img.opacity/100 : 1
  if (mask)
    c_obj.load_mask(mask)
  canvas.Source = toFileProtocol(_img.src)

  c_obj.EQP_canvas_group_index = (_img.z < 50) ? 0 : 1
  EQP_canvas_group[c_obj.EQP_canvas_group_index].ps.push(_img)

  img = _img.img_obj = _img['img_obj_i'] = canvas
}
else {
  var img_id = "main" + i

  var xaml_para = 'Canvas.ZIndex="' + _img.z + '"' + ((_img.opacity == null) ? '' : ' Opacity="' + (_img.opacity/100) + '"');

  var xaml, ext
  if (_img.is_video) {
    var vo = _img.EQP_video_options
    if (!vo)
      vo = {}

    xaml =
  '<Canvas xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" x:Name="' + img_id + 'v" '
+ xaml_para
+ '>\n'
+ '<MediaElement x:Name="' + img_id + 'v_obj" '
+ 'Stretch="UniformToFill" Source="' + toFileProtocol(_img.src) + '" '
+ 'MediaOpened="SL_MediaOpened" '
+ ((vo.no_loop) ? 'MediaEnded="SL_MediaEnded" ' : '')
+ ((vo.disable_autostart) ? 'AutoPlay="false" ' : '')
+ ((_img.use_media_control) ? 'MouseEnter="SL_Media_MouseEnter" ' : '')
+ ((_img.play_sound || vo.play_sound) ? 'Volume="1"' : 'IsMuted="true"')
+ '>\n'
+ '</MediaElement>\n'
+ '</Canvas>'

    ext = 'v'

    // EQP_video_options
    if ((w3c_mode) && vo.SVG_filter)
      document.getElementById("SL_xul_window").style.filter = vo.SVG_filter()
  }
  else {
    var mask = EQP_SS_init("EQP_gallery_obj_active.imgs[" + i + "]", img_id)

    xaml =
  '<Image xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" x:Name="' + img_id + 'i" '
+ xaml_para + ' Source="' + toFileProtocol(_img.src) + '" '
+ ((mask) ? 'Stretch="UniformToFill" ' : '')
+ '>\n'
+ mask
+ '</Image>'

    ext = 'i'
  }

  SL_content.children.add(SL.content.createFromXaml(xaml, false));
  img = _img.img_obj = _img['img_obj_' + ext] = SL_root.FindName(img_id + ext)
}

    }

    if (_img.w >= 0)
      img.Width  = _img.w
    if (_img.h >= 0)
      img.Height = _img.h
    img["Canvas.Left"] = (_img.x_org - EQP_gallery_obj_active.x_offset) * EQP_size_scale
    img["Canvas.Top"]  = (_img.y_org - EQP_gallery_obj_active.y_offset) * EQP_size_scale

    if (_img.is_video) {
      var img_v = SL_root.FindName(img.Name + "_obj")
      if (_img.w_video > 0)
        img_v.Width  = _img.w_video
      if (_img.h_video > 0)
        img_v.Height = _img.h_video
    }
  }
  continue
}

    if (img_new) {
      img = _img.img_obj = document.createElement("img")
      img.style.position = "absolute"
    }

    var s = img.style
    s.pixelWidth  = _img.w
    s.pixelHeight = _img.h
    s.posLeft = _img.x
    s.posTop  = _img.y
    s.zIndex  = _img.z

    if ((i == 0) && use_Pixastic && EQP_gallery_obj_active.use_filter) {
      var canvas = _img.canvas
      if (!canvas) {
        canvas = _img.canvas = document.createElement("canvas")
        canvas.style.position = "absolute"
        main_c.appendChild(canvas)

        img.onload = function () {
//DEBUG_show(_img.w_org+'x'+_img.h_org,0,1)
if (this.drawn)
  return
this.drawn=true

var img = this
img.style.pixelWidth  = _img.w_org
img.style.pixelHeight = _img.h_org


try {
/*
var options = {radius:5, density:1.5, noise:1.0, transparent:false}
options.leaveDOM = true
Pixastic.process(img, "pointillize", options);
img = options.resultCanvas
*/
var pix
for (pix in EQP_Pixastic_list) {
  eval('var options = {' + EQP_Pixastic_list[pix] + '}')
  options.leaveDOM = true
  Pixastic.process(img, pix, options);
  img = options.resultCanvas
}
_img.canvas_source = img


canvas._draw = function () {
  canvas._draw_timer_ID = null

  var canvas_source = _img.canvas_source
  canvas.getContext("2d").drawImage(img, 0,0,canvas_source.width,canvas_source.height, 0,0,canvas.width,canvas.height)
}

Object.defineProperty(canvas.style, "pixelWidth",
{
  set: function(v) {
canvas.width = v
if (!canvas._draw_timer_ID)
  canvas._draw_timer_ID = setTimeout(canvas._draw, 10)
  }
});

Object.defineProperty(canvas.style, "pixelHeight",
{
  set: function(v) {
canvas.height = v
if (!canvas._draw_timer_ID)
  canvas._draw_timer_ID = setTimeout(canvas._draw, 10)
  }
});


_img.img_obj.style.display = "none"

canvas.style.posLeft = _img.x
canvas.style.posTop  = _img.y
canvas.style.zIndex  = _img.z
canvas.width  = _img.w
canvas.height = _img.h
canvas._draw()

_img.img_obj = canvas
}
catch (err) { DEBUG_show('(ERROR: Failed to load the image in Canvas)',0,1) }
        }
      }
    }
    else if (ie9_mode && _img.opacity)
      s.opacity = _img.opacity/100

    img.src = ((!use_SA_browser_mode && (EQP_size_scale < 1)) || EQP_gallery_obj_active.use_gimage) ? "gimage:///" + _img.src + ("?width=" + _img.w + "&height=" + _img.h) : toFileProtocol(_img.src)

    if (img_new)
      main_c.appendChild(img)
  }

  if (!use_Pixastic && EQP_gallery_obj_active.use_filter) {
    imgs[0].img_obj.style.filter = EQP_bg_filter
  }


  EQP_size_scale = scale_org

if (!self.EQ_Filter) {
  EV_width  = EQP_gallery_obj_active.w = Math.round(EQP_gallery_obj_active.w_org * EQP_size_scale + EQP_border_width*2)
  EV_height = EQP_gallery_obj_active.h = Math.round(EQP_gallery_obj_active.h_org * EQP_size_scale + EQP_border_width*2)
}

  if (use_CSS3_2D_Transforms) {
    var ids = ["Lmain_obj", "Lgimage_BG"]
    for (var i = 0; i < ids.length; i++) {
      var cs = document.getElementById(ids[i]).style
      if (EQP_size_scale == 1) {
        cs.MozTransform = cs.MozTransformOrigin = "";
      }
      else {
        cs.MozTransform = "scale(" + EQP_size_scale + ")";
        cs.MozTransformOrigin = "0% 0%";
      }
    }
  }
  else if (use_Silverlight && SL_loaded) {
    var ss = SL_Host_Parent.style
    var cp = SL_root.FindName("C_content_parent")
    ss.pixelWidth  = cp.Width  = Math.round((EQP_gallery_obj_active.w_org - EQP_gallery_obj_active.x_offset*2) * EQP_size_scale)
    ss.pixelHeight = cp.Height = Math.round((EQP_gallery_obj_active.h_org - EQP_gallery_obj_active.y_offset*2) * EQP_size_scale)
    ss.posLeft = Math.round(EQP_gallery_obj_active.x_offset * EQP_size_scale + EQP_border_width)
    ss.posTop  = Math.round(EQP_gallery_obj_active.y_offset * EQP_size_scale + EQP_border_width)

    if (use_HTML5) {
SL_object.width  = ss.pixelWidth
SL_object.height = ss.pixelHeight

for (var i = 0; i < EQP_canvas_group.length; i++) {
  var c = EQP_canvas_group[i]
  var ps = c.ps
  if (!ps.length)
    continue

  for (var k = 0; k < ps.length; k++)
    ps[k].img_obj.canvas_parent.drawn = false

  if (c.canvas)
    continue

  ps.sort(function (a,b) { return a.z - b.z })
  c.canvas = document.createElement("canvas")
}

EQP_ps[0].img_obj.canvas_parent.drawn = false

for (var i = 0; i < EQP_canvas_group.length; i++) {
  var c = EQP_canvas_group[i]
  var canvas = c.canvas
  if (!canvas)
    continue

  c.drawn = false
  canvas.width  = ss.pixelWidth
  canvas.height = ss.pixelHeight
}

SL_MC_Place(EQP_size_scale/2 + 0.5)

if (SL_mask['content_mask'] && SL_mask['content_mask'].Mask_src)
  SL_mask['content_mask'].drawn = false
    }
    else {
      SL_ArrangeButtons()

      if (SL_ST_enabled) {
        var st = SL_root.FindName("content_ST")
        var tt = SL_root.FindName("content_TT")

        var scale = EQP_size_scale * SL_fullscreen_scale

        if (EQP_flipH) {
          tt.X = -ss.pixelWidth
          st.ScaleX = -scale
        }
        else
          st.ScaleX = scale

        if (EQP_flipV) {
          tt.Y = -ss.pixelHeight
          st.ScaleY = -scale
        }
        else
          st.ScaleY = scale
      }
    }
  }

  if (EQP_bg_color) {
    var s = EQP_gallery_obj_active.html_bg.style
    s.pixelWidth  = ((use_CSS3_2D_Transforms) ? EQP_gallery_obj_active.w_org + EQP_border_width*2 : EV_width ) - ((ie9_mode) ? EQP_border_width*2 : 0)
    s.pixelHeight = ((use_CSS3_2D_Transforms) ? EQP_gallery_obj_active.h_org + EQP_border_width*2 : EV_height) - ((ie9_mode) ? EQP_border_width*2 : 0)
  }

  if (!EQP_gallery_obj_active.main_container) {
    EQP_gallery_obj_active.main_container = main_c
    L_EV_content.appendChild(main_c)
  }
}


function EQP_FB_AdjustRotation() {
  if (EQP_FB_rotation == null)
    EQP_FB_rotation = 0

  if (EQP_FB_rotation == 180) {
    EQP_FB_rotation = 0
    EQP_FB_flipV = !EQP_FB_flipV
    EQP_FB_flipH = !EQP_FB_flipH
 }
  else if (EQP_FB_rotation == 270) {
    EQP_FB_rotation = 90
    EQP_FB_flipV = !EQP_FB_flipV
    EQP_FB_flipH = !EQP_FB_flipH
  }

  if (returnBoolean("ReverseAnimation")) {
    if (EQP_FB_rotation == 0)
      EQP_FB_flipV = !EQP_FB_flipV
    else
      EQP_FB_flipH = !EQP_FB_flipH
  }
}


var EQP_EV_initialized

var EQP_EV_init = function () {
  if (EQP_EV_initialized) {
    if (EQP_allow_resize)
      EQP_resize()

    return
  }
  EQP_EV_initialized = true


// Defaults START
  var size_default = (System.Gadget.docked) ? 0.5 : 1
  if ((EQP_size_scale == null) || !use_Silverlight) {
    if (ie9_mode && !returnBoolean("CSSTransformToChildAnimation") && ((SA_zoom < 1) || (!self.EQP_video_options && (SA_zoom > 1)))) {
      EQP_size_scale = SA_zoom
      SA_zoom = 1
    }
    else {
      EQP_size_scale = parseFloat(LABEL_LoadSettings("LABEL_EQP_size_scale", size_default))
      if (EQP_size_scale % 0.25)
        EQP_size_scale = 1
    }
  }
  if (EQP_size_scale != size_default)
    EQP_size_scale_default = EQP_size_scale

  EQP_SS_path = LABEL_LoadSettings("LABEL_EQP_SS_path", "")

  if (EQP_EQ_mode == null)
    EQP_EQ_mode = true

  EV_BG_allow_dummy = true

  if (EQP_decay_factor == null)
    EQP_decay_factor = 1
  if (EQP_decay_factor2 == null)
    EQP_decay_factor2 = 0.2

  if (EQP_EQ_index == null)
    EQP_EQ_index = 0
  if (EQP_EQ_divider == null)
    EQP_EQ_divider = 14
  if (EQP_allow_resize == null)
    EQP_allow_resize = true

  if (EQP_FB_align_center_shift == null)
    EQP_FB_align_center_shift = 0.5

  if (!EQP_Pixastic_list) {
    EQP_Pixastic_list = {
  "sepia": ""
 ,"hsl": "hue:0, saturation:0, lightness:-50"
 ,"noise": "mono:true, amount:0.5, strength:0.5"
    }
  }

  EQP_FB_AdjustRotation()

  if (EQP_FB_EQ == null) {
    var divider = EQP_EQ_divider
    if (divider == 7)
      EQP_FB_EQ = [[1,2],[3,4],[5,6],[7,8],[9,10],[11,12],[13,14]]
    else if (divider == 14)
      EQP_FB_EQ = [[1],[2],[3],[4],[5],[6],[7],[8],[9],[10],[11],[12],[13],[14]]
    else {
      var EQ = [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15]

      EQP_FB_EQ = []
      for (var i = 0; i < divider; i++) {
        var mod = 16/divider
        EQP_FB_EQ.push(EQ.slice(Math.round(mod*i), Math.round(mod*(i+1))))
      }
//setTimeout('DEBUG_show(EQP_FB_EQ.join("|"))', 1000)
    }
  }

  if (Settings.Use32BandSpectrum) {
    var _EQ = []
    for (var i = 0; i < EQP_EQ_divider; i++) {
      var eq = EQP_FB_EQ[i]
      var _eq = []

      for (var j = 0, j_max = eq.length; j < j_max; j++) {
        var v = eq[j]
        _eq.push(v*2, v*2+1)
      }

      var length = _eq.length
      _EQ.push(_eq.slice(0,length/2), _eq.slice(length/2,length))
    }
    EQP_FB_EQ = _EQ

    EQP_EQ_divider *= 2

    if (EQP_EQ_width) {
      var _EQ = []
      for (var i = 0, i_max = EQP_EQ_width.length; i < i_max; i++) {
        var w = EQP_EQ_width[i]
        var w1 = parseInt(w/2)
        _EQ.push(w1, w-w1)
      }
      EQP_EQ_width = _EQ
    }

    if (EQP_EQ_height) {
      var _EQ = []
      for (var i = 0, i_max = EQP_EQ_height.length; i < i_max; i++) {
        var h = EQP_EQ_height[i]
        _EQ.push(h,h)
      }
      EQP_EQ_height = _EQ
    }
  }

  if (EQP_bg_filter == null)
    EQP_bg_filter = 'progid:DXImageTransform.Microsoft.BasicImage(grayScale=1, opacity=0.5)'
  if (EQP_bg_border == null)
    EQP_bg_border = '2px outset white'

  if (EQP_EQ_width) {
    var w = 0
    var flipped = (EQP_FB_rotation == 0) ? EQP_FB_flipH : EQP_FB_flipV
    var _EQ_width = EQP_EQ_width.slice(0)
    for (var i = 0; i < EQP_EQ_width.length; i++) {
      w += _EQ_width[((flipped) ? _EQ_width.length-i-1 : i)]
      EQP_EQ_width[i] = w
    }
  }
  if (EQP_EQ_height) {
    var h = 0
    var flipped = (EQP_FB_rotation == 0) ? EQP_FB_flipV : EQP_FB_flipH
    var _EQ_height = EQP_EQ_height.slice(0)
    for (var i = 0; i < EQP_EQ_height.length; i++) {
      h += _EQ_height[((flipped) ? _EQ_height.length-i-1 : i)]
      EQP_EQ_height[i] = h
    }
  }

  if (Canvas_Effect && use_HTML5 && !Canvas_Effect.show_behind_content) {
    Canvas_Effect.canvas = "SL"
  }
// END


  var _gallery_TEMP = []

if (self.EQ_Filter) {
  if (!EV_width)
    EV_width = 0
  if (!EV_height)
    EV_height = 0

  _gallery_TEMP['EQ01'] = {
   bg: {type:'bg',   z:0, use_Silverlight:use_Silverlight, w:EV_width, h:EV_height, src:System.Gadget.path + '\\images\\_bg_dummy\\EQF_bars_bg0_o66.png'}
,imgs:[{type:'main', z:0, use_Silverlight:use_Silverlight, w:EV_width, h:EV_height, src:System.Gadget.path + '\\images\\_bg_dummy\\1x1.png'}]
  }
}
else {
  for (var i = 0; i < EQP_gallery.length; i++) {
    var g = EQP_gallery[i]
    var name = g.replace(/\.EQP-[^\\]+\.\w+$/i, "")

    var obj = { src:g }
    if (!EQP_FilePara(obj)) {
      _gallery_TEMP[name] = { bg:obj }
      continue
    }

    var obj_parent = _gallery_TEMP[name]
    if (!obj_parent)
      obj_parent = _gallery_TEMP[name] = {}

    if (obj.type == "bg")
      obj_parent.bg = obj
    else {
      if (!obj_parent.imgs)
        obj_parent.imgs = []

      obj_parent.imgs.push(obj)
    }
  }
}

  for (var name in _gallery_TEMP) {
    var obj = _gallery_TEMP[name]
    if (!obj.bg)
      continue

    EQP_gallery_obj.push(obj)
  }


// Main
  var obj
  obj = EQP_gallery_obj_active = EQP_gallery_obj[random(EQP_gallery_obj.length)]

  var bg = obj.bg

  var bg_video
  if (obj.imgs) {
    obj.imgs.sort(function (a,b) {return a.z - b.z})

    if (obj.imgs[0].is_video)
      bg_video = obj.imgs[0]
  }
  else {
/*
    if (use_HTML5 || use_SVG) {
      use_HTML5 = use_SVG = false
      use_Silverlight = Silverlight_native_capable
    }
*/

    if (!bg.z)
      bg.z = 0
    obj.imgs = [{src:bg.src, z:bg.z}]

    if (bg.is_video) {
      bg_video = bg

      bg.is_filter = true
      bg.is_video = false
      obj.imgs[0].is_video = true
    }
    else {
      obj.use_filter = true

      if (use_Silverlight) {
        SL_ST_enabled = false
        SL_PP_enabled = false
      }
    }

    if (EQP_bg_color == null)
      EQP_bg_color = "black"
  }

// Video START
    if (bg_video) {
      EQP_gallery_obj_active.bg_video = bg_video

      var img = obj.imgs[0]

var path = bg_video.src
EQP_use_HTML5_video = (ie9_mode && /\.(webm|mp4|mkv)$/i.test(path))

if (EQP_use_HTML5_video) {
  if (self.EQP_video_options && is_SA_child_animation && !EQP_video_options.use_canvas_video && parent.MMD_SA_options && parent.MMD_SA_options.child_animation_as_texture) {
    EQP_video_options.use_canvas_video = true
    EQP_video_options.disable_chroma_key = true
  }

  if (!self.EQP_video_options || !EQP_video_options.use_canvas_video)
    use_WebGL_2D = false
}

EV_sync_update.count_to_update_playbackRate = 1
EV_sync_update.func_extra = EQP_SEQ_Video_Process

if (EQP_use_HTML5_video && use_MatrixRain && !self.EQP_video_options) {
  self.EQP_video_options = { play_sound:true }
}

if (self.EQP_video_options) {
  bg_video.EQP_video_options = img.EQP_video_options = EQP_video_options
  EQP_video_options._EQP_obj = img

  // defaults START
  if (EQP_video_options.SEQ_gallery_fade_out == null)
    EQP_video_options.SEQ_gallery_fade_out = 5
  if (EQP_video_options.SEQ_gallery_endtime_mod == null)
    EQP_video_options.SEQ_gallery_endtime_mod = (EQP_video_options.use_canvas_video) ? -3/60 : -0.1
  if (EQP_video_options.no_BD == null)
    EQP_video_options.no_BD = !returnBoolean("EnableMotionEffectForSEQVideo")
  if (EQP_use_HTML5_video && use_MatrixRain && !EQP_video_options.use_canvas_video) {
    EQP_video_options.use_canvas_video = true
    EQP_video_options.FPS = 30
    EQP_video_options.disable_chroma_key = true
  }

  EQP_video_options.bounding_box_list = []

  EQP_video_options.marker_index = 0

  EQP_video_options.on_marker = function (v) {
if (v.poster_mode)
  return

var time = v.currentTime

var marker_list = this.marker_list
if (!marker_list)
  return

var marker_index = this.marker_index
var marker = marker_list[marker_index]
if (!marker || (marker.time > time)) {
  var marker_current = this.marker_current
  if (marker_current && marker_current.duration && (marker_current.time + marker_current.duration > time))
    marker_current.func(v)
  else
    this.marker_current = null

  return
}

this.marker_current = marker
marker.func(v)
this.marker_index++
  }

  if (EQP_video_options.SEQ_mode) {
    if (EQP_video_options.SEQ_gallery) {
      var BPM_func = function() {
return (this.BPM_ || EQP_video_options.BPM_)
      }
      var beat_reference_func = function() {
return (this.beat_reference_ || EQP_video_options.beat_reference_)
      }

      var src_last, poster_frame_last
      for (var i = 0; i < EQP_video_options.SEQ_gallery.length; i++) {
        var g = EQP_video_options.SEQ_gallery[i]
        g.index = i

        if (g.src)
          src_last = g.src
        else if (src_last)
          g.src = src_last

        if (g.poster_frame)
          poster_frame_last = g.poster_frame
        else if (poster_frame_last)
          g.poster_frame = poster_frame_last

        if (g.marker_list)
          g.marker_index = 0

        g.BPM_ = g.BPM
        Object.defineProperty(g, "BPM",
{
  get: BPM_func
});

        g.beat_reference_ = g.beat_reference
        Object.defineProperty(g, "beat_reference",
{
  get: beat_reference_func
});
      }
    }

    EQP_video_options.chroma_key_ = EQP_video_options.chroma_key
    Object.defineProperty(EQP_video_options, "chroma_key",
{
  get: function() {
var chroma_key = EQP_gallery_obj_active.bg_video.chroma_key

if (!chroma_key && this.SEQ_mode) {
  if (this.bounding_box_calculation_mode) {
    if (this.SEQ_gallery_ && (this.SEQ_gallery_index_ >= 0))
      chroma_key = this.SEQ_gallery_[this.SEQ_gallery_index_].chroma_key
  }
  else {
    if (this.SEQ_gallery && (this.SEQ_gallery_index >= 0))
      chroma_key = this.SEQ_gallery[this.SEQ_gallery_index].chroma_key
  }
}

if (!chroma_key)
  chroma_key = this.chroma_key_

if (this.chroma_key_last != chroma_key) {
  this.chroma_key_last = chroma_key
  DEBUG_show("CK:" + chroma_key[0] + "," + chroma_key[1] + "," + chroma_key[2], 2)
}

return chroma_key
  }

 ,set: function (v) {
this.chroma_key_ = v
  }
});

    EQP_video_options.poster_frame_ = EQP_video_options.poster_frame
    Object.defineProperty(EQP_video_options, "poster_frame",
{
  get: function() {
if (this.poster_frame_ignored)
  return null

var poster_frame
if (this.SEQ_mode && this.SEQ_gallery && (this.SEQ_gallery_index >= 0))
  poster_frame = this.SEQ_gallery[this.SEQ_gallery_index].poster_frame

if (!poster_frame)
  poster_frame = this.poster_frame_

return poster_frame
  }

 ,set: function (v) {
this.poster_frame_ = poster_frame
  }
});

    EQP_video_options.BPM_ = EQP_video_options.BPM
    Object.defineProperty(EQP_video_options, "BPM",
{
  get: function() {
var bpm
if (this.SEQ_mode && this.SEQ_gallery && (this.SEQ_gallery_index >= 0))
  bpm = this.SEQ_gallery[this.SEQ_gallery_index].BPM

if (!bpm)
  bpm = this.BPM_

return bpm
  }

 ,set: function (v) {
this.BPM_ = v
  }
});

    Object.defineProperty(EQP_video_options, "start_time",
{
  get: function() {
var start_time = 0
if (this.SEQ_mode && this.SEQ_gallery && (this.SEQ_gallery_index >= 0))
  start_time = this.SEQ_gallery[this.SEQ_gallery_index].time_range[this.SEQ_gallery_TR_index][0]

return start_time
  }
});

    Object.defineProperty(EQP_video_options, "end_time",
{
  get: function() {
var end_time
if (this.SEQ_mode && this.SEQ_gallery && (this.SEQ_gallery_index >= 0))
  end_time = this.SEQ_gallery[this.SEQ_gallery_index].time_range[this.SEQ_gallery_TR_index][1]

if (!end_time)
  end_time = this._EQP_obj.img_obj_v.duration

return end_time
  }
});

    EQP_video_options.beat_reference_ = EQP_video_options.beat_reference
    Object.defineProperty(EQP_video_options, "beat_reference",
{
  get: function() {
var beat_reference
if (this.SEQ_mode && this.SEQ_gallery && (this.SEQ_gallery_index >= 0))
  beat_reference = this.SEQ_gallery[this.SEQ_gallery_index].beat_reference

if (!beat_reference)
  beat_reference = this.beat_reference_

return beat_reference
  }

 ,set: function (v) {
this.beat_reference_ = v
  }
});

    EQP_video_options.marker_list_ = EQP_video_options.marker_list
    Object.defineProperty(EQP_video_options, "marker_list",
{
  get: function() {
var marker_list
if (this.SEQ_mode && this.SEQ_gallery && (this.SEQ_gallery_index >= 0))
  marker_list = this.SEQ_gallery[this.SEQ_gallery_index].marker_list

if (!marker_list)
  marker_list = this.marker_list_

return marker_list
  }

 ,set: function (v) {
if (this.SEQ_mode && this.SEQ_gallery && (this.SEQ_gallery_index >= 0))
  this.SEQ_gallery[this.SEQ_gallery_index].marker_list = v
else
  this.marker_list_ = v
  }
});

    EQP_video_options.marker_index_ = EQP_video_options.marker_index
    Object.defineProperty(EQP_video_options, "marker_index",
{
  get: function() {
var marker_index
if (this.SEQ_mode && this.SEQ_gallery && (this.SEQ_gallery_index >= 0))
  marker_index = this.SEQ_gallery[this.SEQ_gallery_index].marker_index

if (marker_index == null)
  marker_index = this.marker_index_

return marker_index
  }

 ,set: function (v) {
if (this.SEQ_mode && this.SEQ_gallery && (this.SEQ_gallery_index >= 0))
  this.SEQ_gallery[this.SEQ_gallery_index].marker_index = v
else
  this.marker_index_ = v
  }
});
  }
  // END

  if (EQP_video_options.bounding_box_calculation_mode) {
    EQP_video_options.disable_autostart = true
    EQP_video_options.FPS = 30
    if (EQP_video_options.SEQ_mode) {
      EQP_video_options.SEQ_playbackRate_min = EQP_video_options.SEQ_playbackRate_max = 0.5
      EQP_video_options.SEQ_gallery_ = EQP_video_options.SEQ_gallery
      EQP_video_options.SEQ_gallery = null
      EQP_video_options.SEQ_gallery_index_ = -1

      SEQ_gallery_preset_order = null
    }
  }
}

      img.use_Silverlight = (EQP_use_HTML5_video) ? use_Silverlight : true
      img.play_sound = (bg_video.play_sound || (img.EQP_video_options && img.EQP_video_options.play_sound))
      img.use_media_control = true
      img.w = bg_video.w = (bg_video.w > 0) ? bg_video.w : 320
      img.h = bg_video.h = (bg_video.h > 0) ? bg_video.h : 240
      img.w_video = (bg_video.w_video > 0) ? bg_video.w_video : -1
      img.h_video = (bg_video.h_video > 0) ? bg_video.h_video : -1

      if (EQP_use_HTML5_video) {
        if (!use_Silverlight) {
          if (bg_video == bg)
            bg.src = System.Gadget.path + '\\images\\_bg_dummy\\EQF_bars_bg0_o50.png'
        }

        if (Canvas_Effect)
          Canvas_Effect.canvas = (Canvas_Effect.show_behind_content || EQP_video_options.width || EQP_video_options.height) ? null : "V_canvas"

        EQP_HTML5_video_onload = function (e) {
var sender = e.currentTarget
var img = sender._EQP_obj
if (img.video_loaded)
  return
img.video_loaded = true

// fix a strange bug in webkit
if (webkit_mode) {
  sender.muted = !sender.muted
  sender.muted = !sender.muted
}

var vo
vo = Audio_BPM.vo = (img.EQP_video_options || {})
vo._sender = sender

var w, h
if (img.w_video > 0) {
  w = img.w_natural = img.w_video
  h = img.h_natural = img.h_video
}
else {
  w = sender.videoWidth
  h = sender.videoHeight

  var scale = vo.size_scale
  if (!scale) {
    scale = 1
    img.adjust_dimension_by_scale = true
  }

  w = img.w_natural = parseInt(w * scale)
  h = img.h_natural = parseInt(h * scale)
}

DEBUG_show('Video:'+w+'x'+h,2)

if (vo.use_canvas_video && use_MatrixRain) {
  var matrix_rain = vo.matrix_rain
  if (!matrix_rain) {
    matrix_rain = vo.matrix_rain = new MatrixRain(w,h)
    matrix_rain._SA_idle_count_max = 0
    matrix_rain.matrixCreate()

    DEBUG_show("Use Matrix rain (Video)", 2)
  }
  else {
    var mc = matrix_rain.canvas_matrix
    if ((w > mc.width) || (h > mc.height)) {
      matrix_rain.matrixCreate(w,h)
      DEBUG_show("Matrix Reloaded (Video)", 2)
    }
  }
}

var bg = EQP_gallery_obj_active.bg_video
if (bg.BPM) {
  vo.BPM = bg.BPM
  if (bg.beat_reference != null) {
// non-zero
    vo.beat_reference = bg.beat_reference || 60/bg.BPM
  }
}
if (bg.hide_EQ != null)
  vo.hide_EQ = bg.hide_EQ

if (!vo.no_loop && (vo.loop_forever || !vo.use_canvas_video || (sender.duration < 10)))
  sender.loop = true

var clip = (img.EQP_video_options) ? img.EQP_video_options.clip : null
EQP_gallery_obj_active.w_org = bg.w_org = img.w_org = w - ((clip) ? clip[0]+clip[2] : 0)
EQP_gallery_obj_active.h_org = bg.h_org = img.h_org = h - ((clip) ? clip[1]+clip[3] : 0)

if (vo.width)
  EQP_gallery_obj_active.w_org = vo.width
if (vo.height)
  EQP_gallery_obj_active.h_org = vo.height

if (use_HTML5) {
  EQP_SL_w = (EQP_gallery_obj_active.w_org - EQP_gallery_obj_active.x_offset*2)
  EQP_SL_h = (EQP_gallery_obj_active.h_org - EQP_gallery_obj_active.y_offset*2)
}

if (!vo.v_align)
  bg.x_org = img.x_org = (EQP_gallery_obj_active.w_org - bg.w_org) / 2
if (!vo.h_align)
  bg.y_org = img.y_org = (EQP_gallery_obj_active.h_org - bg.h_org) / 2


if (!img.video_obj_initialized) {
  Object.defineProperty(sender, "busy",
{
  get: function () {
return (this._busy || this.seeking)
  }

 ,set: function (v) {
this._busy = v
  }
});

if (vo.BPM) {
  vo.audio_onended = function (e) {
vo.BPM_mode = false

sender.defaultPlaybackRate = 1
if (!vo.SEQ_mode)
  sender.playbackRate = img._playbackRate = 1

SL_MC_Place(-1)

DEBUG_show("Audio:END", 2)
  }

  Audio_BPM.checkWinamp(vo)

  DragDrop_RE = eval('/\\.(' + DragDrop_RE_default_array.concat(["mp3", "wav", "aac"]).join("|") + ')$/i')

  DragDrop.onDrop_finish = function (item, no_parent_call) {
var src = item.path
if (item.isFolder) {
  Audio_BPM.play_list.drop_folder(item)
}
else if (item.isFileSystem && /\.(mp3|wav|aac)$/i.test(src)) {
  // IE9 native WMP child animation support, somewhat obsolete
  if (!item._winamp_JSON && !no_parent_call && is_SA_child_animation && (ie9_native && parent.use_WMP)) {
    parent.DragDrop.onDrop_finish(item, true)
    return false
  }

  var ao = vo.audio_obj = (item._winamp_JSON) ? vo.audio_obj_WINAMP : ((vo.audio_obj) ? vo.audio_obj : vo.audio_obj_HTML5)
  if (ao && ((ao._ao_linked || ao._ao_linked_list) || ((ao == vo.audio_obj_HTML5) && self.AudioFFT)))
    ao = null

  if (!ao) {
    if (item._winamp_JSON) {
      ao = vo.audio_obj = vo.audio_obj_WINAMP = Audio_BPM.createPlayer(vo, item._winamp_JSON)
    }
    else {
      ao = vo.audio_obj = vo.audio_obj_HTML5 = Audio_BPM.createPlayer(vo)
    }

    ao._on_playing = function () {
if (ao.is_winamp)
  ao.ended = false

if (sender.poster_mode && (vo.poster_frame != -1)) {
  vo._gallery_change = false
  vo._gallery_loop   = true

  // need to play for a while before "playbackRate" takes effect
  sender.play()
  setTimeout(function () {sender.poster_mode = false}, 1000)
}
else {
  sender.poster_mode = false
  if (sender.paused)
    sender.play()

  var beat_ref = ao.beat_reference
  if (beat_ref) {
    var time_reference = (beat_ref - ao.currentTime) * ao.BPM/vo.BPM + sender.currentTime
    setTimeout(function () {EQP_SyncBPM_Auto(sender, vo, time_reference)}, 1000)
  }
}

DEBUG_show("Audio:START", 2)
    }
  }

  DragDrop._item = item
  Audio_BPM.findBPM(vo)

  return false
}
else {
  if (!item._winamp_JSON)
    DragDrop_install(item)
}
  }

  Audio_BPM.initBPMCounting(vo)

  DEBUG_show("Video BPM:" + vo.BPM, 2)
}

if (vo.use_canvas_video) {
  if (!vo.FPS)
    vo.FPS = EV_sync_update.count_to_10fps * 5

  var v_canvas = sender._canvas
  var v_context = v_canvas.getContext("2d")
  v_context.globalCompositeOperation = 'copy'

  sender.currentTime_last = 0

  if (vo.bounding_box_calculation_mode) {
    if (vo.bounding_box) {
      if (vo.bounding_box_calculation_mode_start_time == null)
        vo.bounding_box_calculation_mode_start_time = vo.bounding_box.length - 1
    }
    else
      vo.bounding_box = []
  }

  if (!vo.disable_chroma_key && !vo.chroma_key_func) {
var abs = Math.abs
vo.chroma_key_func = function (data, ck) {
  var ck_R = ck[0]
  var ck_G = ck[1]
  var ck_B = ck[2]
  var ckt = ck[4]
  var ckt_R = ckt[0]
  var ckt_G = ckt[1]
  var ckt_B = ckt[2]
  var ck_index = ck[5]
  var ck_ext = ck[6]

  var ct = parseInt(sender.currentTime)
  if (vo.bounding_box_calculation_mode && (vo.bounding_box_calculation_mode_end_time < ct)) {
    sender.write_bounding_box()
  }
  else if (vo.bounding_box_calculation_mode) {
var box = vo.bounding_box
var box_dim = vo._box_dim

var clip = vo._clip_resized
var clip_x0 = clip[0]
var clip_y0 = clip[1]

var w = box_dim[0]
var h = box_dim[1]
var ww = v_canvas.width
var hh = v_canvas.height

var clip = box[ct]
if (vo._bb_currentTime != ct) {
  vo._bb_currentTime = ct

  if (!clip)
    clip = box[ct] = [ww-1,hh-1, ww-1,hh-1]

  if ((ct == 0) || (ct == vo.bounding_box_calculation_mode_start_time))
    DEBUG_show("(Bounding Box Mode)", 2)
  else {
    var clip_last = box[ct-1]
    if (clip_last[0] == ww-1)
      clip_last = box[ct-1] = [ww/2-1,hh/2-1, ww/2-1,hh/2-1]

    DEBUG_show(ct-1 + ":" + (ww-(clip_last[0]+clip_last[2])) + "x" + (hh-(clip_last[1]+clip_last[3])) + ((vo.SEQ_gallery_ && (vo.SEQ_gallery_index_ != -1)) ? " / " + vo.SEQ_gallery_index_ : ""))
  }
}

var blank_check = [0, ww-1, ww*(h-1), ww*hh-1]
var blank_frame = true
for (var i = 0; i < 4; i++) {
  var pt = blank_check[i] * 4
  var R = data[pt]
  var G = data[pt+1]
  var B = data[pt+2]

  if (R || G || B) {
    blank_frame = false
    break
  }
}

if (!blank_frame) {
  if (ck_index == 2) {
var ckt_ext = ckt_B * ck_ext
for (var i = 0, data_length = data.length; i < data_length; i+=4) {
  var R = data[i]
  var G = data[i+1]
  var B = data[i+2]

  var painted = true
  if ((abs(R - ck_R) <= ckt_R) && (abs(G - ck_G) <= ckt_G)) {
    var ck_diff = abs(B - ck_B)
    if (ck_diff <= ckt_B) {
      data[i+3] = 0
      painted = false
    }
    else {
      ck_diff -= ckt_B
      if (ck_diff <= ckt_ext)
        data[i+3] = parseInt(ck_diff / ckt_ext * 255)
    }
  }

  if (!painted)
    continue

  var pixels = i/4
  var x = pixels % w + clip_x0
  var y = parseInt(pixels / w) + clip_y0
  if (clip[0] > x)
    clip[0] = x
  if (clip[2] > ww-1-x)
    clip[2] = ww-1-x
  if (clip[1] > y)
    clip[1] = y
  if (clip[3] > hh-1-y)
    clip[3] = hh-1-y
}
  }
  else {
var ckt_ext = ckt_G * ck_ext
for (var i = 0, data_length = data.length; i < data_length; i+=4) {
  var R = data[i]
  var G = data[i+1]
  var B = data[i+2]

  var painted = true
  if ((abs(R - ck_R) <= ckt_R) && (abs(B - ck_B) <= ckt_B)) {
    var ck_diff = abs(G - ck_G)
    if (ck_diff <= ckt_G) {
      data[i+3] = 0
      painted = false
    }
    else {
      ck_diff -= ckt_G
      if (ck_diff <= ckt_ext)
        data[i+3] = parseInt(ck_diff / ckt_ext * 255)
    }
  }

  if (!painted)
    continue

  var pixels = i/4
  var x = pixels % w + clip_x0
  var y = parseInt(pixels / w) + clip_y0
  if (clip[0] > x)
    clip[0] = x
  if (clip[2] > ww-1-x)
    clip[2] = ww-1-x
  if (clip[1] > y)
    clip[1] = y
  if (clip[3] > hh-1-y)
    clip[3] = hh-1-y
}
  }
}
  }
  else {
    if (ck_index == 2) {
//DEBUG_show("CK:Blue")
      var ckt_ext = ckt_B * ck_ext
      if (!data) {
        if (!v_canvas._WebGL_2D.initialized) {
          v_canvas._WebGL_2D.fshader_2d_var +=
  '// AT custom\n'
+ 'uniform float ck_R;\n'
+ 'uniform float ck_G;\n'
+ 'uniform float ck_B;\n'
+ 'uniform float ckt_R;\n'
+ 'uniform float ckt_G;\n'
+ 'uniform float ckt_B;\n'
+ 'uniform float ckt_ext;\n'

          v_canvas._WebGL_2D.fshader_2d_main +=
  '   vec4 tex = gl_FragColor;\n'
+ '   float alpha = tex.a;\n'
+ '   if ((abs(tex.r - ck_R) <= ckt_R) && (abs(tex.g - ck_G) <= ckt_G)) {\n'
+ '     float ck_diff = abs(tex.b - ck_B);\n'
+ '     if (ck_diff <= ckt_B) {\n'
+ '       alpha = 0.0;\n'
+ '     }\n'
+ '     else {\n'
+ '       ck_diff -= ckt_B;\n'
+ '       if (ck_diff <= ckt_ext) {\n'
+ '         alpha = ck_diff / ckt_ext;\n'
+ '       }\n'
+ '     }\n'
+ '   }\n'
+ '   gl_FragColor = vec4(tex.rgb, alpha);\n'

          v_canvas._WebGL_2D.init_custom = function () {
var gl = this.gl;
var program = this.program_2d;
gl.uniform1f(gl.getUniformLocation(program, "ck_R"), ck_R/255);
gl.uniform1f(gl.getUniformLocation(program, "ck_G"), ck_G/255);
gl.uniform1f(gl.getUniformLocation(program, "ck_B"), ck_B/255);
gl.uniform1f(gl.getUniformLocation(program, "ckt_R"), ckt_R/255);
gl.uniform1f(gl.getUniformLocation(program, "ckt_G"), ckt_G/255);
gl.uniform1f(gl.getUniformLocation(program, "ckt_B"), ckt_B/255);
gl.uniform1f(gl.getUniformLocation(program, "ckt_ext"), ckt_ext/255);
          }
        }
      }
      else {
for (var i = 0, data_length = data.length; i < data_length; i+=4) {
  if ((abs(data[i] - ck_R) <= ckt_R) && (abs(data[i+1] - ck_G) <= ckt_G)) {
    var ck_diff = abs(data[i+2] - ck_B)
    if (ck_diff <= ckt_B)
      data[i+3] = 0
    else {
      ck_diff -= ckt_B
      if (ck_diff <= ckt_ext)
        data[i+3] = parseInt(ck_diff / ckt_ext * 255)
    }
  }
}
      }
    }
    else if (ck_index == 1) {
//DEBUG_show("CK:Green")
var ckt_ext = ckt_G * ck_ext
for (var i = 0, data_length = data.length; i < data_length; i+=4) {
  if ((abs(data[i] - ck_R) <= ckt_R) && (abs(data[i+2] - ck_B) <= ckt_B)) {
    var ck_diff = abs(data[i+1] - ck_G)
    if (ck_diff <= ckt_G)
      data[i+3] = 0
    else {
      ck_diff -= ckt_G
      if (ck_diff <= ckt_ext)
        data[i+3] = parseInt(ck_diff / ckt_ext * 255)
    }
  }
}
    }
    else {
//DEBUG_show("CK:Default")
for (var i = 0, data_length = data.length; i < data_length; i+=4) {
  if ((abs(data[i] - ck_R) <= ckt_R) && (abs(data[i+1] - ck_G) <= ckt_G) && (abs(data[i+2] - ck_B) <= ckt_B))
    data[i+3] = 0
}
    }
  }
};
  }

  var vf = function () {
if (!sender._EQP_obj.video_loaded || sender.ended || sender.busy || (vo._gallery_seek && !sender.poster_mode))
  return

var ck = vo.chroma_key

if (!v_canvas.drawn) {
  v_canvas.drawn = true

  if (!vo.disable_chroma_key && (!ck || (ck.length==1))) {
    v_context.drawImage(sender, 5,5,1,1, 0,0,1,1)
    var TL_pixel = v_context.getImageData(0,0,1,1).data
    v_context.clearRect(0,0,1,1)
    var R = TL_pixel[0]
    var G = TL_pixel[1]
    var B = TL_pixel[2]

    if (!R && !G && !B) {
      v_canvas.drawn = false
      return
    }

    ck = vo.chroma_key = [R,G,B, (ck)?ck[0]:0]
  }

  if (vo.bounding_box_calculation_mode) {
    if (vo.bounding_box.length) {
      sender.currentTime = vo.bounding_box_calculation_mode_start_time
      return
    }
  }
}
else if ((sender.currentTime == sender.currentTime_last) || (1/(sender.currentTime-sender.currentTime_last) > vo.FPS*1.2/((img._playbackRate > 1) ? img._playbackRate : 1))) {
//DEBUG_show('frame skipped'+ ++abc)
  return
}
//EV_sync_update.fps_count_func()
if (vo.SEQ_mode && !sender.poster_mode) {
  var end_time = vo.end_time
  if (sender.currentTime > end_time + vo.SEQ_gallery_endtime_mod) {
    EQP_SEQ_Video_Process(true)
    return
  }
}


// main
SL._drawn_id = Date.now()

sender.currentTime_last = sender.currentTime

vo.on_marker(sender)

var clip
if (vo.SEQ_mode) {
  var g = (vo.bounding_box_calculation_mode) ? vo.SEQ_gallery_ : vo.SEQ_gallery
  if (g) {
    var g_current
    if (vo.bounding_box_calculation_mode) {
      g_current = g[vo.SEQ_gallery_index_]

      var t = sender.currentTime
      var f = 1/30
      var tr_index = -1
      if (g_current) {
        var tr = g_current.time_range
        for (var i = 0; i < tr.length; i++) {
          var tr_i = tr[i]
          if ((t >= tr_i[0]) && (t <= tr_i[1]+f)) {
            tr_index = i
            break
          }
        }
      }

      if (tr_index == -1) {
        vo.SEQ_gallery_index_ = -1
        for (var k = 0, k_max = g.length; k < k_max; k++) {
          g_current = g[k]
          var tr = g_current.time_range
          for (var i = 0; i < tr.length; i++) {
            var tr_i = tr[i]
            if ((t >= tr_i[0]) && (t <= tr_i[1]+f)) {
              vo.SEQ_gallery_index_ = k
              tr_index = i
              break
            }
          }
        }
      }

      ck = vo.chroma_key

      clip = vo._clip_last = (tr_index == -1) ? vo._clip_last : ((g_current.clip) ? g_current.clip[tr_index] : null)
    }
    else {
      g_current = g[vo.SEQ_gallery_index]
      if (g_current.clip)
        clip = g_current.clip[vo.SEQ_gallery_TR_index]
    }
  }
}

if (!vo.bounding_box_calculation_mode && vo.bounding_box) {
  var clip_native = vo.bounding_box[parseInt(sender.currentTime)]
  if (clip_native)
    clip = clip_native
}

if (clip)
  v_context.clearRect(0,0, v_canvas.width,v_canvas.height)
else
  clip = [0,0,0,0]

var clip_x0 = clip[0]
var clip_y0 = clip[1]
var clip_x1 = clip[2]
var clip_y1 = clip[3]

var ratio = v_canvas.width / sender.videoWidth
var clip_x0_resized = parseInt(clip_x0 * ratio)
var clip_y0_resized = parseInt(clip_y0 * ratio)
var clip_x1_resized = parseInt(clip_x1 * ratio)
var clip_y1_resized = parseInt(clip_y1 * ratio)
var clip_width_resized  = v_canvas.width  - (clip_x0_resized + clip_x1_resized)
var clip_height_resized = v_canvas.height - (clip_y0_resized + clip_y1_resized)

vo._clip = [clip_x0_resized,clip_y0_resized,clip_width_resized,clip_height_resized]

v_context.drawImage(sender, clip_x0,clip_y0,sender.videoWidth-(clip_x0+clip_x1),sender.videoHeight-(clip_y0+clip_y1), clip_x0_resized,clip_y0_resized,clip_width_resized,clip_height_resized)

if (ck && (ck[4] == null)) {
  var dummy_sorting = [{i:0, c:ck[0]}, {i:1, c:ck[1]}, {i:2, c:ck[2]}]
  dummy_sorting.sort(function (a,b) { return b.c-a.c })
  var ck_index = dummy_sorting[0]

  dummy_sorting = []
  for (var i = 0; i < 3; i++) {
    if (i != ck_index.i)
      dummy_sorting.push(ck_index.c - ck[i])
  }
  var ck_diff = (dummy_sorting[0] < dummy_sorting[1]) ? dummy_sorting[0] : dummy_sorting[1]

  if (!ck[3])
    ck[3] = (ck_index.i == 1) ? 48 : 64

  var ck_tolerance = ck[3]
  if (ck_diff < ck_tolerance/2) {
    ck[4] = [ck_tolerance,   ck_tolerance,   ck_tolerance]
    ck[5] = -1
  }
  else {
    ck[4] = [ck_tolerance/2, ck_tolerance/2, ck_tolerance/2]
    ck[4][ck_index.i] *= 2
    ck[5] = ck_index.i

    var ext = (ck_diff - ck_tolerance/2) / ck_tolerance
    if (ext > 1)
      ext = 1
    ck[6] = ext
  }
}

if (vo.bounding_box_calculation_mode) {
  vo._box_dim = [clip_width_resized,clip_height_resized]
  vo._clip_resized = [clip_x0_resized,clip_y0_resized, clip_x1_resized,clip_y1_resized]
}


var VD_context = V_canvas_for_display.getContext("2d")
var x_shift = V_Host.style.posLeft
var y_shift = V_Host.style.posTop

var x_copy, y_copy, x_dest, y_dest
x_copy = x_dest = clip_x0_resized
y_copy = y_dest = clip_y0_resized

if (x_shift < 0) {
//DEBUG_show(x_copy+','+x_dest+','+clip_width_resized,0,1)
  var _w = v_canvas.width + x_shift*2
  clip_width_resized = (_w < clip_width_resized) ? _w : clip_width_resized
  x_copy = (-x_shift > x_copy) ? -x_shift : x_copy
  x_dest = x_copy + x_shift
//DEBUG_show(x_copy+','+x_dest+','+clip_width_resized,0,1)
}
else {
  x_dest += x_shift
}

if (y_shift < 0) {
  var _h = v_canvas.height + y_shift*2
  clip_height_resized = (_h < clip_height_resized) ? _h : clip_height_resized
  y_copy = (-y_shift > y_copy) ? -y_shift : y_copy
  y_dest = y_copy + y_shift
}
else {
  y_dest += y_shift
}

var frame
if (!vo.disable_chroma_key) {
  var webgl_supported = (ck[5]==2)// || (ck[5]==1)
  if (v_canvas._WebGL_2D && !vo.bounding_box_calculation_mode && webgl_supported) {
    vo.chroma_key_func(null, ck)
    v_canvas._WebGL_2D.draw()
  }
  if (!v_canvas._WebGL_2D || vo.bounding_box_calculation_mode || !webgl_supported) {
    frame = v_context.getImageData(x_copy,y_copy,clip_width_resized,clip_height_resized)
    vo.chroma_key_func(frame.data, ck)
  }
}


VD_context.clearRect(0,0, V_canvas_for_display.width,V_canvas_for_display.height)

VD_context.globalCompositeOperation = 'copy'
if (frame) {
  VD_context.putImageData(frame, x_dest,y_dest);
}
else {
//DEBUG_show(V_canvas_for_display.width+'x'+V_canvas_for_display.height+'/'+[x_copy,y_copy,clip_width_resized,clip_height_resized, x_dest,y_dest,clip_width_resized,clip_height_resized],0,1)
  VD_context.drawImage((!vo.disable_chroma_key)?((v_canvas._WebGL_2D&&v_canvas._WebGL_2D.canvas||v_canvas)):v_canvas, x_copy,y_copy,clip_width_resized,clip_height_resized, x_dest,y_dest,clip_width_resized,clip_height_resized)
}

var c_wall_mask_mixed_resized = System._browser.C_WMP_wallpaper_mask_mixed_resized
if (c_wall_mask_mixed_resized) {
  VD_context.globalCompositeOperation = 'destination-out'
  VD_context.drawImage(c_wall_mask_mixed_resized, x_copy,y_copy,clip_width_resized,clip_height_resized, x_dest,y_dest,clip_width_resized,clip_height_resized)
  VD_context.globalCompositeOperation = 'copy'
}

if (v_canvas._loop_fade_count >= 0) {
  VD_context.globalCompositeOperation = 'source-over'
  VD_context.globalAlpha = v_canvas._loop_fade_count / (vo.FPS/2)

  VD_context.drawImage(sender.canvas_for_fade, 0,0)

  VD_context.globalCompositeOperation = 'copy'
  VD_context.globalAlpha = 1

  v_canvas._loop_fade_count--
}

var matrix_rain = vo.matrix_rain
if (matrix_rain && matrix_rain._SA_active) {
  matrix_rain.draw(V_canvas_for_display)

  VD_context.globalAlpha = 1
  VD_context.globalCompositeOperation = 'copy'
  if (Settings.UseCanvasPPE) {
    WebGL_2D._matrix_rain = matrix_rain
  }
  else
    VD_context.drawImage(matrix_rain.canvas, 0,0)
}

if (V_canvas_for_display._WebGL_2D) {
  V_canvas_for_display._WebGL_2D.draw()
}
  }

  if (vo.bounding_box_calculation_mode) {
    Seq.item("CanvasVideo").At(0.5, vf, -1, 1/100)
    Seq.item("CanvasVideo").Play()
  }
  else {
    EV_sync_update.func_extra = function () {
EQP_SEQ_Video_Process()
vf()
    }
  }
}

if (EQP_dragdrop_obj) {
  var dd = img.EQP_video_options.overlay_video.dragdrop
  if (!dd.w && !dd.w_max)
    dd.w = sender.videoWidth
  if (!dd.h && !dd.h_max)
    dd.h = sender.videoHeight
}
}

resize(true)

img.video_obj_initialized = true

if ((vo.poster_frame >= 0) && !vo._video_src_changing) {
  sender.pause()
  sender.poster_mode = true
  sender.currentTime = vo.poster_frame
}
        }
      }
      else {
        EV_SL_MediaOpened = function (sender, args) {
var img = EQP_gallery_obj_active.imgs[0]
if (img.video_loaded)
  return
img.video_loaded = true

img.img_obj_vv = sender

var scale = (img.EQP_video_options && img.EQP_video_options.size_scale) ? img.EQP_video_options.size_scale : 1
if (scale != 1) {
  img.w_video = sender.NaturalVideoWidth  * scale
  img.h_video = sender.NaturalVideoHeight * scale
}
var w = (img.w_video > 0) ? img.w_video : sender.NaturalVideoWidth
var h = (img.h_video > 0) ? img.h_video : sender.NaturalVideoHeight
if (img.w_video && img.h_video)
  sender.Stretch = "Fill"

DEBUG_show('Video:'+w+'x'+h,2)

var bg  = EQP_gallery_obj_active.bg_video
EQP_gallery_obj_active.w_org = bg.w_org = img.w_org = w
EQP_gallery_obj_active.h_org = bg.h_org = img.h_org = h

resize()
        }
      }
    }
// END

  for (var i = 0; i < obj.imgs.length; i++) {
    var oimg = obj.imgs[i]
    oimg.index = i
    oimg.load = EQP_MM_Load
  }


  EQP_ps = bg.EQP_ps = []
  for (var i = 0; i < EQP_EQ_divider; i++) {
    var ps
    ps = EQP_ps[i] = {}

// Defaults START
    ps.o_last = -1
    ps.decay = {}
    ps.decay2 = {}

    ps.decay_factor = EQP_decay_factor
    ps.decay_factor2 = EQP_decay_factor2

    ps.g_EQ = [EQP_FB_EQ[i]]

    ps.u_min = 0
    ps.u_max = 100

    ps.o_min = (EQP_u_reversed) ? 100 : 0
    ps.o_max = (EQP_u_reversed) ? 0 : 100

    ps.SL_clip = []
// END

// Find the min and max EQ bar used - START
if (ps.g_EQ || ps.g_num) {
  var g = (ps.g_EQ) ? ps.g_EQ : ps.g_num

  for (var k = 0; k < g.length; k++) {
    var v = g[k]
    var EQ_min, EQ_max

    if (ps.g_EQ) {
      EQ_min = v[0]
      EQ_max = v[v.length-1]
    }
    else {
      if (v == 0) {
        EQ_min = 0
        EQ_max = 3
      }
      else if (v == 1) {
        EQ_min = 4
        EQ_max = 11
      }
      else {
        EQ_min = 12
        EQ_max = 15
      }
    }

    if (EQP_EQ_min > EQ_min)
      EQP_EQ_min = EQ_min
    if (EQP_EQ_max < EQ_max)
      EQP_EQ_max = EQ_max
  }
}
// END
  }


// object dimension
  var w_ani = 320
  var h_ani = 240
  var ratio = 1

if (!bg.w || !bg.h) {
  var dim = loadImageDim(bg.src)
  var w = dim.w
  var h = dim.h
  if (obj.use_filter) {
    var pixels = w * h
    if (pixels > 600000) {
      obj.use_gimage = !(ie9_mode || use_SA_browser_mode)
      var ratio = Math.sqrt(480000 / pixels)

      w = parseInt(w * ratio)
      h = parseInt(h * ratio)
      if (w % 2)
        w--
      if (h % 2)
        h--
    }
  }

  bg.w = w
  bg.h = h
}

  w_ani = bg.w_org = bg.w_default = bg.w
  h_ani = bg.h_org = bg.h_default = bg.h


  var imgs = obj.imgs
  for (var i = 0; i < imgs.length; i++) {
    var img = imgs[i]

var w, h
if (!img.w || !img.h) {
  var dim = loadImageDim(img.src)
  w = dim.w
  h = dim.h
  if (ratio != 1) {
    w = parseInt(w * ratio)
    h = parseInt(h * ratio)
    if (w % 2)
      w--
    if (h % 2)
      h--
  }

  img.w = w
  img.h = h
}

    w = img.w_org = img.w_default = img.w
    h = img.h_org = img.h_default = img.h

    if (w_ani < w)
      w_ani = w
    if (h_ani < h)
      h_ani = h
  }

  obj.x_offset = obj.y_offset = 0
  if (EV_width) {
    obj.x_offset = (EV_width - w_ani) / 2
    w_ani = EV_width
  }
  if (EV_height) {
    obj.y_offset = (EV_height - h_ani) / 2
    h_ani = EV_height
  }

  obj.w = obj.w_org = w_ani
  obj.h = obj.h_org = h_ani

  if (use_HTML5 && use_MatrixRain && !EQP_use_HTML5_video) {
    if (MatrixRain_para && MatrixRain_para.content_mask)
      MatrixRain_para.content_mask = Settings.f_path_folder + '\\' + MatrixRain_para.content_mask

    EQP_matrix_rain = new MatrixRain(w_ani, h_ani, MatrixRain_para)
    EQP_matrix_rain.full_color = returnBoolean("MatrixRainColor")
    EQP_matrix_rain.matrixCreate()

    EQP_matrix_rain._SA_draw = function(skip_matrix) {
if (!this._SA_active)
  return

if (use_full_fps && !skip_matrix)
  skip_matrix = !EV_sync_update.frame_changed("matrixDraw")

this.matrixDraw(skip_matrix)

this.draw(SL)

var context = SL.getContext("2d")
context.globalAlpha = 1
context.globalCompositeOperation = 'copy'
if (Settings.UseCanvasPPE) {
  WebGL_2D._matrix_rain = this
}
else
  context.drawImage(this.canvas, 0,0)

CANVAS_must_redraw = true
    }

    DEBUG_show("Use Matrix rain (AP)", 2)
  }

  EQP_border_width = (EQP_bg_color && EQP_bg_border && /^(\d+)/.test(EQP_bg_border)) ? parseInt(RegExp.$1) : 0

// position
  if (bg.x == null)
    bg.x = parseInt((w_ani - bg.w) / 2)
  if (bg.y == null)
    bg.y = parseInt((h_ani - bg.h) / 2)
  bg.x_org = bg.x_default = bg.x
  bg.y_org = bg.y_default = bg.y

  for (var i = 0; i < imgs.length; i++) {
    var img = imgs[i]

    if (img.x == null)
      img.x = parseInt((w_ani - img.w) / 2)
    if (img.y == null)
      img.y = parseInt((h_ani - img.h) / 2)
    img.x_org = img.x_default = img.x
    img.y_org = img.y_default = img.y
  }
// END


if (self.EQP_video_options && EQP_video_options.overlay_video) {
  var ov = EQP_video_options.overlay_video
  ov.src = System.Gadget.path + "\\images\\_bg_dummy\\1x1.png"

  ov.x_default = 0
  ov.y_default = 0
  ov.x_org = 0
  ov.y_org = 0
  ov.z = 99
  ov.use_Silverlight = true

  if (ov.video_opacity_min == null)
    ov.video_opacity_min = 25
  if (ov.video_opacity_max == null)
    ov.video_opacity_max = 75

  ov.idle_count = 0
  ov.load = EQP_MM_Load

  EQP_gallery_obj_active.imgs.push(ov)

  if (!EQP_dragdrop_obj) {
    EQP_dragdrop_obj = {
  obj_str: 'EQP_video_options.overlay_video'
 ,dragdrop: { opacity:ov.video_opacity_min }
    }
  }
}

if (EQP_dragdrop_obj) {
  var obj_dragdrop = eval(EQP_dragdrop_obj.obj_str)
  obj_dragdrop.dragdrop = EQP_dragdrop_obj.dragdrop

  EQP_DragDrop_Init(obj_dragdrop)
}

if (use_HTML5) {
  EQP_SL_x = EQP_gallery_obj_active.x_offset
  EQP_SL_y = EQP_gallery_obj_active.y_offset
  EQP_SL_w = (EQP_gallery_obj_active.w_org - EQP_gallery_obj_active.x_offset*2)
  EQP_SL_h = (EQP_gallery_obj_active.h_org - EQP_gallery_obj_active.y_offset*2)
}


  if (EQP_bg_color) {
    var html_bg
    html_bg = obj.html_bg = document.createElement("div")
    html_bg.id = "LEQP_html_bg"
    html_bg.style.position = "absolute"
    html_bg.style.posLeft = 0
    html_bg.style.posTop = 0
    if (!xul_mode || !use_HTML5)
      html_bg.style.backgroundColor = EQP_bg_color
    if (EQP_bg_border)
      html_bg.style.border = EQP_bg_border

    L_EV_content.appendChild(html_bg)
  }

  EQP_Process_CanvasEffect_Mask(EQP_gallery_obj_active.w_org, EQP_gallery_obj_active.h_org)

  if (use_HTML5)
    EQP_allow_resize = true
  if ((w3c_mode) && !use_Silverlight)
    EQP_allow_resize = use_CSS3_2D_Transforms = true
  if (EQP_allow_resize && !document.body.ondblclick && !self.EQ_Filter) {
//    if (!use_Silverlight_only && !webkit_electron_mode)
//      document.body.title += ', double-click to change size'
    if (!WallpaperEngine_mode)
      document.body.ondblclick = EQP_onresize
  }

  if (!EV_usage_sub)
    EV_usage_sub = EV_object[0].EV_usage_sub = EV_usage_sub_CREATE(null, "sound", 3)

  EQP_resize(((EQP_allow_resize && !self.EQ_Filter) ? null : 1))

  if (EQP_init_extra)
    EQP_init_extra()


// Silverlight
  if (use_Silverlight) {
    if (use_HTML5)
      HTML5_Init()
    else
      SL_Init()
  }
}

if (!EV_init && !self.EQ_Filter)
  EV_init = EQP_EV_init


function EQP_SEQ_Video_Process(skipped, must_seek) {
//  if (!EQP_use_HTML5_video)
//    return

  if (!skipped) {
    if (--EV_sync_update.count_to_update_playbackRate <= 0)
      EV_sync_update.count_to_update_playbackRate = EV_sync_update.count_to_10fps * 2
    else
      skipped = true
  }

  var imgs = EQP_gallery_obj_active.imgs
  for (var i = 0; i < imgs.length; i++) {
    var img = imgs[i]
    var options = img.EQP_video_options
    if (!options || !options.SEQ_mode || ((!options.SEQ_gallery || (options.SEQ_gallery_index >= 0)) && !img.video_loaded))
      continue

    var v = (EQP_use_HTML5_video) ? img.img_obj_v : img.img_obj_vv
    if (!v || v.poster_mode)
      continue

    var muted = (EQP_use_HTML5_video) ? v.muted : v.IsMuted
    if (!muted) {
      var playbackRate = img._playbackRate
      if (!playbackRate)
        playbackRate = 1

      if (playbackRate != 1)
        v.playbackRate = 1
//      continue
    }

var g_current, g_last
var seeking = (EQP_use_HTML5_video) ? v.seeking : !v.CanSeek
if (options.SEQ_gallery && !seeking) {
  var gallery_reset, gallery_change, gallery_loop, gallery_seek
  gallery_reset = (options.SEQ_gallery_index == null)

  var tr_min, tr_max

  if (options._gallery_seek) {
    g_current = options.SEQ_gallery[options.SEQ_gallery_index]
    g_last = options._g_last
    gallery_seek = true

    if (!options.BPM_mode && !options._paused)
      v.play()

    options._gallery_seek = options._g_last = options._paused = null
  }
  else if (!gallery_reset) {
    g_current = g_last = options.SEQ_gallery[options.SEQ_gallery_index]
    var t = (EQP_use_HTML5_video) ? v.currentTime : v.Position.Seconds
    var tr = g_current.time_range[options.SEQ_gallery_TR_index]
    tr_min = tr[0]
    tr_max = tr[1]

    if (must_seek || (t < tr_min - 1) || (t > tr_max + EQP_video_options.SEQ_gallery_endtime_mod)) {
      if (EQP_use_HTML5_video && !options._video_src_changing && (options.SEQ_gallery_fade_out || g_current.fade_out) && (!options.use_canvas_video || !v._video.func_video_fading())) {
        var fade_out = (g_current.fade_out) ? g_current.fade_out[options.SEQ_gallery_TR_index] : options.SEQ_gallery_fade_out
        v._fade_max = v._fade_count = fade_out
      }

      if (options.SEQ_gallery_TR_index < g_current.time_range.length-1)
        gallery_seek = true
      else if (!options._SEQ_gallery && (--g_current.loop >= 0))
        gallery_loop = true
      else
        gallery_change = true
    }
  }

if (options._gallery_change) {
  gallery_change = true
  options._gallery_change = null
}
else if (options._gallery_loop) {
  gallery_loop = true
  options._gallery_loop = null
}

  if (gallery_change)
    gallery_reset = (options.SEQ_gallery_index == options.SEQ_gallery.length-1)

  if (gallery_reset) {
    gallery_change = true
    options.SEQ_gallery_index = -1

    if (SEQ_gallery_preset_order) {
      options._SEQ_gallery = options.SEQ_gallery

      var _gallery = []
      for (var k = 0; k < SEQ_gallery_preset_order.length; k++)
        _gallery[k] = options._SEQ_gallery[SEQ_gallery_preset_order[k]]
      options.SEQ_gallery = _gallery

      SEQ_gallery_preset_order = null
    }
    else {
      if (options._SEQ_gallery) {
        options.SEQ_gallery = options._SEQ_gallery
        options._SEQ_gallery = null
      }
      options.SEQ_gallery.shuffle()
    }
  }

  var no_fade
  if (gallery_change) {
    gallery_loop = true
    g_current = options.SEQ_gallery[++options.SEQ_gallery_index]
    g_current.loop = (!g_current.loop_max) ? 0 : g_current.loop_min + random(g_current.loop_max - g_current.loop_min + 1)

    options.marker_index = 0

//DEBUG_show("G:" + options.SEQ_gallery_index, 3)

    if (tr_max) {
      var t_diff = g_current.time_range[0][0] - tr_max
      if ((t_diff > 0) && (t_diff < 0.5)) {
//DEBUG_show('continuous', 2)
        no_fade = true
        if (EQP_use_HTML5_video)
          v._fade_count = 0
        options.SEQ_gallery_TR_index = 0
        gallery_loop = false
      }
    }
  }

  if (gallery_loop) {
    gallery_seek = true
    options.SEQ_gallery_TR_index = -1

    if (!img.video_loaded || img.src_changed) {
      // not the first video (ie. img.src_last exists)
      if (!no_fade && !options.use_canvas_video && img.src_last) {
        var fade_out = options.SEQ_gallery_fade_out
        if (!v._fade_count || (v._fade_count < fade_out)) {
          v._fade_max = v._fade_count = fade_out
        }
      }

      if (v._fade_count) {
        options._video_src_changing = true
        EQP_Draw_Video_Canvas(0, v.canvas_for_fade)
      }

      options._paused = v.paused
      options._gallery_seek = true
      options._g_last = g_last
      img.load_video()
      continue
    }
  }

  if (gallery_seek) {
    options.SEQ_gallery_TR_index++

    if (EQP_use_HTML5_video && !options._video_src_changing) {
// if fading allowed, and not the very first gallery (ie. tr_max exists)
      if (!no_fade && tr_max && g_current.fade_in) {
        var fade_in = g_current.fade_in[options.SEQ_gallery_TR_index]
        if (!v._fade_count || (v._fade_count < fade_in)) {
          v._fade_max = v._fade_count = fade_in
        }
      }

      if (v._fade_count) {
        EQP_Draw_Video_Canvas(0, v.canvas_for_fade)
      }
    }
    options._video_src_changing = null

    try {
      var tt = g_current.time_range[options.SEQ_gallery_TR_index][0]
      if (tt)
        tt += 0.001

      if (EQP_use_HTML5_video) {
        var bpm, audio_bpm

        if (options.BPM_mode) {
          bpm = g_current.BPM
          var ao = options.audio_obj
          audio_bpm = ao.BPM

          if (g_current.beat_reference)
            v.pause()
        }

        v.currentTime = tt

        if (options.BPM_mode) {
          v.defaultPlaybackRate = v.playbackRate = img._playbackRate = (audio_bpm/bpm)// * 1.50
        }
      }
      else
        v.Position = "00:01:00"
    }
    catch (err) {}

    if (options.overlay_video && options.overlay_video.is_video) {
      options.use_overlay_video = true
      v._overlay_video = options.overlay_video.img_obj
    }
    else
      options.use_overlay_video = false
  }
//DEBUG_show(options.SEQ_gallery_index+','+options.SEQ_gallery_TR_index+','+g_current.loop)
}

if (EQP_use_HTML5_video && (options.poster_frame == null) && (!v._first_seen || (v.style.visibility == "hidden")) && !v.seeking) {
  v._first_seen = true
  v.style.visibility = "inherit"
  try {
    if (!options.disable_autostart)
      v.play()
  }
  catch (err) {}
}

    if (skipped)
      continue
    if (options.BPM_mode)
      continue

//DEBUG_show(PC_count_absolute)

    var min = options.SEQ_playbackRate_min
    var max = options.SEQ_playbackRate_max
    if (g_current) {
      if (g_current.SEQ_playbackRate_min)
        min = g_current.SEQ_playbackRate_min
      if (g_current.SEQ_playbackRate_max)
        max = g_current.SEQ_playbackRate_max
    }

    var u = ((PC_count_max > 1) || (EV_usage_float > EV_usage_last_float)) ? EV_usage_float : (EV_usage_float + EV_usage_last_float) / 2

    var rate = min + (max - min) * u/100
    v.playbackRate = img._playbackRate = rate
//DEBUG_show("rate:"+rate,0,1)
  }
}


function EQP_SyncBPM(v, sec, info, song_bpm_ref) {
  if (v.paused)
    return

  var vo = v._EQP_obj.EQP_video_options
  var playbackRate = v.playbackRate// * 1.50

  vo.BPM_syncing = true
  vo.BPM_syncing_timerID2 = setTimeout(function () { vo.BPM_syncing_timerID2=vo.BPM_syncing=null; v.playbackRate=v.defaultPlaybackrate=playbackRate; }, 1000)
  v.playbackRate = v.defaultPlaybackrate = playbackRate * (1 + sec)

  if (!info)
    info = Math.abs(parseInt(sec*100)/100) + 's'
  DEBUG_show('BPM sync(' + ((sec>0)?'+':'-') + info + ')', 2)

  var ao = vo.audio_obj
  if (ao.is_linked || !vo.beat_reference || (song_bpm_ref < 0) || (info == "beat"))
    return

/*
  var so = ao.song_bpm
  var song = so.song
  var bpm_ref = so.bpm_ref

  if (!song_bpm_ref)
    song_bpm_ref = parseFloat(bpm_ref.text) - sec

  bpm_ref.replaceChild(so.xml.createTextNode(song_bpm_ref), bpm_ref.firstChild)

  ao.song_bpm_save()
*/
}

function EQP_SyncBPM_Auto(v, vo, time_reference, silent_mode) {
  if (vo.BPM_syncing || v.busy || (v.currentTime + 1 > vo.end_time))
    return

  var bpm = vo.BPM
  var beat_reference = vo.beat_reference

  var time = (time_reference) ? time_reference : v.currentTime

  var beat = (time - beat_reference)/60 * bpm
  beat -= parseInt(beat)
  if (beat < 0)
    beat++

  if (beat < 0.5)
    beat = -beat
  else
    beat = 1 - beat

  var sec = beat / (bpm/60)
  if (Math.abs(sec) > 0.05) {
    var audio_obj = vo.audio_obj
    var song_bpm_ref = (!audio_obj.is_linked && !time_reference) ? audio_obj.currentTime : -1

    var info = Math.abs(parseInt(beat * 100) / 100) + 'beat'
    EQP_SyncBPM(v, sec, info, song_bpm_ref)
  }
  else {
    if (!silent_mode)
      DEBUG_show('(BPM in sync)', 2)
  }
}


function EQP_Draw_Video_Canvas(beat, canvas_for_copy) {
  var img = EQP_gallery_obj_active.imgs[0]
  var v = img.img_obj

  var options = img.EQP_video_options
  if (options) {
    options.use_overlay_video = (options.overlay_video && options.overlay_video.is_video)
  }


var canvas = (canvas_for_copy) ? canvas_for_copy : V_canvas

var draw_bd
if (!beat || v.seeking) {
  if (!canvas_for_copy) {
    if (Canvas_Effect && (Canvas_Effect.canvas == canvas)) {
      Canvas_Effect.draw(true)
    }
    else {
      V_canvas.getContext("2d").clearRect(0,0, V_canvas.width,V_canvas.height)
    }
    return
  }
}
else
  draw_bd = true

if (draw_bd || (canvas_for_copy != V_canvas)) {
  draw_bd = true

  var vo = img.EQP_video_options
  if (!vo)
    vo = {}

  var clip = (vo.clip) ? vo.clip : [0,0,0,0]
  var cw, ch, cscale
  if ((w3c_mode) || vo.use_canvas_video) {
    cscale = EQP_size_scale
    cw = v.width  - (clip[0]+clip[2]) * cscale
    ch = v.height - (clip[1]+clip[3]) * cscale
  }
  else {
    cscale = 1
    cw = v.videoWidth  - (clip[0]+clip[2])
    ch = v.videoHeight - (clip[1]+clip[3])
  }

  var context = canvas.getContext("2d")
  context.globalCompositeOperation = 'copy'


  var bd_scale, bd_opacity
  if (canvas_for_copy) {
    bd_scale = 0
    bd_opacity = 1
  }
  else {
    bd_scale   = beat / (16 / Math.pow(2, Settings.BDScale))
    bd_opacity = 0.5 + (Settings.BDOpacity-1) * 1/6
    bd_opacity = bd_opacity*0.25 + beat*bd_opacity*0.75
  }

  var w = parseInt(cw * bd_scale)
  var h = parseInt(ch * bd_scale)

  var v_target, x_shift, y_shift
  if (vo.use_canvas_video) {
    v_target = V_canvas_for_display
    x_shift = V_Host.style.posLeft
    y_shift = V_Host.style.posTop
  }
  else {
    v_target = v
    x_shift = y_shift = 0
  }

  context.globalAlpha = bd_opacity
  context.drawImage(v_target, w/2+clip[0]*cscale+x_shift,h/2+clip[1]*cscale+y_shift,cw-w,ch-h, 0,0,canvas.width,canvas.height)
}


  if (v._fade_count) {
    if (!v.seeking && !options._video_src_changing)
      v._fade_count -= v.playbackRate

    var context = V_canvas.getContext("2d")
    if (v._fade_count <= 0) {
      v._fade_count = 0
      context.clearRect(0,0, V_canvas.width,V_canvas.height)
    }
    else {
      context.globalAlpha = v._fade_count / v._fade_max
      context.globalCompositeOperation = (draw_bd) ? 'source-in' : 'copy'
      context.drawImage(v.canvas_for_fade, 0,0)
    }
  }

  if (Canvas_Effect && (Canvas_Effect.canvas == V_canvas)) {
    Canvas_Effect.draw()
  }
}


var CANVAS_must_redraw

var EQP_EV_animate_full = function () {
//DEBUG_show(PC_count_absolute)
  if (use_Silverlight && !SL_loaded)
    return

//EQP_SEQ_Video_Process()


var bg = EQP_gallery_obj_active.bg
var is_single_image = (EQP_gallery_obj_active.imgs[0].canvas && use_HTML5)
var w = (is_single_image) ? bg.w_org : bg.w
var h = (is_single_image) ? bg.h_org : bg.h
if (!w || !h)
  return

var v_img = EQP_gallery_obj_active.imgs[0]
var beat = (EV_usage_sub && EV_usage_sub.BD) ? EV_usage_sub.BD.beat : 0

var use_V_canvas, is_fade
if (v_img.is_video && EQP_use_HTML5_video) {
  if (!v_img.img_obj)
    return

  if (v_img.img_obj._fade_count) {
    use_V_canvas = true
    is_fade = V_canvas
  }
  else if (!v_img.EQP_video_options || !v_img.EQP_video_options.no_BD)
    use_V_canvas = true
}

var vo = (EQP_gallery_obj_active.bg_video) ? EQP_gallery_obj_active.bg_video.EQP_video_options : null

var matrix_rain = (vo) ? vo.matrix_rain : null
if (matrix_rain && matrix_rain._SA_active) {
  if (EV_sync_update.frame_changed("vo.matrixDraw"))
    matrix_rain.matrixDraw()
}

if (vo && vo.hide_EQ) {
  if (use_V_canvas) {
    EQP_Draw_Video_Canvas(beat, is_fade)
  }

  if (EQP_animate_extra)
    EQP_animate_extra()

//  SL_Host.style.visibility = "hidden"
  return
}


  var sound_raw
  if (EV_usage_sub)
    sound_raw = (Settings.Use32BandSpectrum && EV_usage_sub.sound_raw32) ? EV_usage_sub.sound_raw32 : EV_usage_sub.sound_raw

  for (var i = 0; i < EQP_ps.length; i++) {
    var ps = EQP_ps[i]

    var u = -1
    if (EV_usage_sub) {
      if (EQP_EQ_mode && ps.g_EQ && ps.g_EQ[EQP_EQ_index]) {
        var EQ = ps.g_EQ[EQP_EQ_index]

        u = 0
        for (var k = 0; k < EQ.length; k++)
          u += sound_raw[EQ[k]].usage_raw * Sound_EQBand_mod
        u /= EQ.length

        u = EV_usage_PROCESS(null, u)
      }
      else if (ps.g_num && (ps.g_num[EQP_EQ_index] >= 0))
        u = EV_usage_sub.sound[ps.g_num[EQP_EQ_index]].EV_usage_float
    }

    if (u == -1)
      u = EV_usage_float

    u = EQP_EV_usage_PROCESS(ps.decay2, u, ps.decay_factor2)

    var u_min = ps.u_min
    var u_max = ps.u_max
    if (u < u_min)
      u = (u <= ps.u_min_hidden) ? -1 : 0
    else if (u >= u_max)
      u = (u >= ps.u_max_hidden) ? -1 : 100
    else
      u = (u_max == u_min) ? 100 : (u - u_min) / (u_max - u_min) * 100

    var opacity
    if (u == -1)
      opacity = 0
    else {
      u = EQP_EV_usage_PROCESS(ps.decay, u, ps.decay_factor)
      opacity = parseInt(ps.o_min + (ps.o_max - ps.o_min) * u/100)
    }

    if (ps.o_last == opacity)
      continue
    ps.o_last = opacity


opacity /= 100

if (self.EQ_Filter && EQ_Filter.EQP_width) {
  w = EQ_Filter.EQP_width
  h = EQ_Filter.EQP_height
}

var T, R, B, L
var Ti,Ri,Bi,Li
var ii
T = B = h
R = L = w
Ti = Ri = Bi = Li = -1

var dim_ref
if (EQP_FB_rotation == 0) {
  dim_ref = h

  ii = (EQP_FB_flipH) ? EQP_EQ_divider-i : i+1
  Ri = ii
  Li = ii - 1
  if (EQP_FB_align_center) {
    var hh = h * EQP_FB_align_center_shift
    T = hh * (1-opacity)
    B = hh + (h-hh) * opacity
  }
  else if (EQP_FB_flipV) {
    T = 0
    B = h * opacity
  }
  else {
    T = h * (1-opacity)
    B = h
  }
}
else {
  dim_ref = w

  ii = (EQP_FB_flipV) ? EQP_EQ_divider-i : i+1
  Ti = ii - 1
  Bi = ii
  if (EQP_FB_align_center) {
    var ww = w * (1-EQP_FB_align_center_shift)
    R = ww + (w-ww) * opacity
    L = ww * (1-opacity)
  }
  else if (EQP_FB_flipH) {
    R = w
    L = w * (1-opacity)
  }
  else {
    R = w * opacity
    L = 0
  }
}

var Z  = [T, R, B, L]
var Zi = [Ti,Ri,Bi,Li]

var scale = (use_Silverlight && SL_ST_enabled) ? 1 : EQP_size_scale

for (var k = 0; k < 4; k++) {
  var zi = Zi[k]
  if (zi == -1) {
    if (EQP_EQ_height) {
      var zz = dim_ref - Z[k]
      var h_max = EQP_EQ_height.length
      var index = parseInt(zz / (dim_ref / h_max))
      if (index > h_max)
        index = h_max

      Z[k] = dim_ref - ((index == 0) ? 0 : EQP_EQ_height[index-1])
    }
    continue
  }

  if (EQP_EQ_width) {
    if (zi == 0) {
      Z[k] = 0
      continue
    }
    if (zi >= EQP_EQ_width.length)
      continue

    Z[k] = EQP_EQ_width[zi-1] * scale
  }
  else
    Z[k] *= zi / EQP_EQ_divider
}

for (var k = 0; k < 4; k++)
  Z[k] = Math.round(Z[k])


if (use_Silverlight) {
  var TL = [Z[3],Z[0]]
  var TR = [Z[1],Z[0]]
  var BR = [Z[1],Z[2]]
  var BL = [Z[3],Z[2]]

  if (EQP_FB_rotation == 0) {
    if (EQP_FB_flipH)
      ps.SL_clip = [TR,TL, BL,BR]
    else
      ps.SL_clip = [TL,TR, BR,BL]
  }
  else {
    if (EQP_FB_flipV)
      ps.SL_clip = [BL,TL, TR,BR]
    else
      ps.SL_clip = [TL,BL, BR,TR]
  }
}
else
  ps.img_obj.style.clip = "rect(" + Z[0] + "px, " + Z[1] + "px, " + Z[2] + "px, " + Z[3] + "px)"

  }


  if (use_Silverlight) {
    var points = []
    for (var i = 0; i < EQP_ps.length; i++) {
      var clip = EQP_ps[i].SL_clip
      points.push(clip[0],clip[1])
    }
    for (var i = EQP_ps.length-1; i >= 0; i--) {
      var clip = EQP_ps[i].SL_clip
      points.push(clip[2],clip[3])
    }
    var points_str = points.toString()

    WebGL_2D_must_redraw = false
    if (use_HTML5) {
for (var i = 0; i < EQP_canvas_group.length; i++) {
  var c = EQP_canvas_group[i]
  var canvas = c.canvas
  if (!canvas)
    continue

  if (!c.drawn) {
    CANVAS_must_redraw = true

    var context = canvas.getContext("2d")
    context.clearRect(0,0, canvas.width,canvas.height)

    var ps = c.ps
    c.drawn = true
    for (var k = 0; k < ps.length; k++) {
      var cc = ps[k].img_obj

      var drawn = cc.canvas_parent.draw(true)
      if (!drawn)
        c.drawn = false

      context.globalAlpha = cc.Opacity
      context.drawImage(cc, cc.x_resized,cc.y_resized)
    }
  }
}

if (EQP_gallery_obj_active.SL_points_str != points_str) {
  EQP_gallery_obj_active.SL_points_str = points_str
  CANVAS_must_redraw = true
}

if (Canvas_Effect && (Canvas_Effect.canvas == SL) && Canvas_Effect.drawn)
  CANVAS_must_redraw = true

var context = SL.getContext("2d")
var update_WMP_wallpaper_mask = CANVAS_must_redraw
WebGL_2D_must_redraw = CANVAS_must_redraw//true
if (CANVAS_must_redraw) {
  SL._drawn_id = Date.now()

  context.clearRect(0,0,SL.width,SL.height)

  context.globalCompositeOperation = 'source-over'

  var group = [EQP_canvas_group[0], { is_bg:true, canvas:EQP_ps[0].img_obj }, EQP_canvas_group[1]]
  for (var i = 0; i < group.length; i++) {
    var c = group[i]
    var canvas = c.canvas
    if (!canvas)
      continue

    var x = 0
    var y = 0

    if (c.is_bg) {
      canvas.canvas_parent.draw(true)
      x = canvas.x_resized
      y = canvas.y_resized

      context.save()

      context.beginPath()
      context.moveTo((points[0][0]+x)*EQP_size_scale, (points[0][1]+y)*EQP_size_scale)
      for (var k = 1; k < points.length; k++) {
        var p = points[k]
        context.lineTo((p[0]+x)*EQP_size_scale, (p[1]+y)*EQP_size_scale)
      }

      context.clip()

      context.globalAlpha = canvas.Opacity
    }
    else {
      context.globalAlpha = 1
    }

    context.drawImage(canvas, x,y)

    if (c.is_bg) {
      context.restore()
    }
  }

  if (SL_mask['content_mask'] && SL_mask['content_mask'].Mask_src) {
var mask_obj = SL_mask['content_mask']
mask_obj.draw(true)

context.globalAlpha = 1
context.globalCompositeOperation = 'destination-in'
context.drawImage(mask_obj.canvas, 0,0)
  }

  CANVAS_must_redraw = false
}


if (Canvas_Effect && (Canvas_Effect.canvas == SL)) {
  Canvas_Effect.draw()
}

Canvas_BDDraw(SL, beat)

if (EQP_matrix_rain)
  EQP_matrix_rain._SA_draw()

if (update_WMP_wallpaper_mask && self.C_WMP_wallpaper_mask) {
  for (var k = 0; k < SA_child_animation_max; k++) {
    if (!SA_child_animation[k])
      continue

    document.getElementById("Ichild_animation" + k).contentWindow.System._browser.WMPMask_Draw(SL)
  }
}
    }
    else {
      if (EQP_gallery_obj_active.SL_points_str != points_str) {
        EQP_gallery_obj_active.SL_points_str = points_str
        SL_root.FindName("bg_StartPoint").StartPoint = points[0].toString()
        SL_root.FindName("bg_Points").Points = points_str
      }
    }
  }

// video canvas drawn after everything else to prevent screen corruption
  if (use_V_canvas)
    EQP_Draw_Video_Canvas(beat, is_fade)

  if (EQP_animate_extra)
    EQP_animate_extra()

  if (use_HTML5 && SL._WebGL_2D && WebGL_2D_must_redraw) {
    SL._WebGL_2D.draw()
  }
}

if (!EV_animate_full && !self.EQ_Filter)
  EV_animate_full = EQP_EV_animate_full


// CORE
document.write('<script language="JavaScript" src="js/EQP_core.js"></scr'+'ipt>');


// Pixastic
var use_Pixastic=true
if (ie9_mode && use_Pixastic) {
  document.write('<script language="JavaScript" src="js/pixastic.js"></scr'+'ipt>');
  document.write('<script language="JavaScript" src="js/pixastic_noise.js"></scr'+'ipt>');
  document.write('<script language="JavaScript" src="js/pixastic_sepia.js"></scr'+'ipt>');
//  document.write('<script language="JavaScript" src="js/pixastic_pointillize.js"></scr'+'ipt>');
  document.write('<script language="JavaScript" src="js/pixastic_hsl.js"></scr'+'ipt>');
}
else
  use_Pixastic = false


// Silverlight
var EV_SL_init = function () {
  EQP_resize(((EQP_allow_resize) ? null : 1))
}

if (use_Silverlight) {
  if (use_HTML5) {
    document.write('<script language="JavaScript" src="js/html5.js"></scr'+'ipt>');
    document.write('<script language="JavaScript" src="js/audio_BPM.js"></scr'+'ipt>');
  }
  else {
    document.write('<script language="JavaScript" src="js/Silverlight.js"></scr'+'ipt>');
    document.write('<script language="JavaScript" src="js/SA_silverlight.js"></scr'+'ipt>');
  }
}
