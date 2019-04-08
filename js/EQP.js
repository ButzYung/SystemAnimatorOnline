// EQP (v3.3.1)

//  SA defaults
var EV_init
var EV_width, EV_height
var EV_BG_src, EV_BG_allow_dummy
var EV_animate_full

var use_full_spectrum = true
// END


var use_EQP_normal = true

var EQP_use_HTML_IMG, EQP_use_HTML_IMG_FULL
if (w3c_mode) { EQP_use_HTML_IMG = EQP_use_HTML_IMG_FULL = true }

// No 'EQP_HTML_bg_color' by default since v3.7.6
var EQP_HTML_bg_color = "";

var EQP_EV_width, EQP_EV_height
var EQP_ref_width, EQP_ref_height
var EQP_BG_width, EQP_BG_height
var EQP_BG_x, EQP_BG_y
var EQP_init_extra, EQP_animate_extra
var EQP_EQ_mode, EQP_EQ_index
var EQP_EQ_min = 99
var EQP_EQ_max = 0
var EQP_o_min, EQP_o_max
var EQP_allow_resize
var EQP_size_scale
var EQP_size_scale_auto = true
var EQP_SS_path

var EQP_ps

var EQP_SL_xaml = []

/*
"EQP_decay_factor" is applied to the opacity. It's 0.2 by default (i.e. value can drop no more than 20% of the maximum value in a single update at 10fps).
"EQP_decay_factor2" is applied to the system activity value. It's 1.0 by default (i.e. value can drop fully).
Changing these values may produce some interesting results.
*/
var EQP_decay_factor
var EQP_decay_factor2

var use_EQP_FB


function EQP_resize(scale, no_msg) {
  EQP_resize_CORE(scale, no_msg)


  var scale_org = EQP_size_scale
  if ((use_Silverlight && SL_ST_enabled) || use_CSS3_2D_Transforms)
    EQP_size_scale = 1


  if (EQP_use_HTML_IMG_FULL)
    EV_BG_allow_dummy = (EQP_size_scale == 1)

  for (var i = 0, i_max = EQP_ps.length; i < i_max; i++) {
    var ps = EQP_ps[i]

if (ps.use_Silverlight) {
  if (!SL_loaded)
    continue

  var img = ps.img
  if (!img)
    continue

  if (ps.use_HTML5) {
    var c_obj = img.canvas_parent
    c_obj.drawn = false

    var mask_obj_list = c_obj.mask_obj_list
    if (mask_obj_list) {
      for (var name in mask_obj_list)
        mask_obj_list[name].drawn = false
    }
  }

  if (ps.fixed_size) {
    img.Visibility = (((EQP_size_scale == 0.5) && ps.half_size) || ((EQP_size_scale == 1) && ps.full_size)) ? "Visible" : "Collapsed";
    continue
  }

  if (ps.w_org > 0)
    img.Width  = ps.w_org * EQP_size_scale
  if (ps.h_org > 0)
    img.Height = ps.h_org * EQP_size_scale
  img["Canvas.Left"] = (ps.x_org - EQP_SL_x) * EQP_size_scale
  img["Canvas.Top"]  = (ps.y_org - EQP_SL_y) * EQP_size_scale

  if (ps.is_video) {
    var obj_v = SL_root.FindName(img.Name + "_obj")
    if (ps.w_video > 0)
      obj_v.Width  = ps.w_video
    if (ps.h_video > 0)
      obj_v.Height = ps.h_video
  }

  continue
}

    if (ps.use_HTML_IMG && !use_CSS3_2D_Transforms) {
      if (EQP_size_scale == 0.5) {
        if (ps.img_GADGET) {
          ps.img = ps.img_GADGET
          ps.img.opacity = (ps.img_HTML) ? ((ie9_mode) ? ps.img_HTML.opacity*100 : ps.img_HTML.opacity) : ps.o_min
          ps.img_obj.style.display = "none"
        }
        else {
          ps.img_obj.style.display = (ps.half_size) ? "block" : "none"
          continue
        }
      }
      else {
        if (ps.img_GADGET) {
          if (ps.img_HTML) {
            ps.img = ps.img_HTML
            ps.img.opacity = (ie9_mode) ? ps.img_GADGET.opacity/100 : ps.img_GADGET.opacity
          }
          else
            ps.img = null
          ps.img_GADGET.opacity = 0
          ps.img_obj.style.display = "block"
          continue
        }
        else {
          ps.img_obj.style.display = (ps.full_size) ? "block" : "none"
          continue
        }
      }
    }
    if (!ps.img)
      continue

    var w = ps.w_org * scale_org
    var h = ps.h_org * scale_org

    var img = ps.img
    img.left = (w - ps.w_org)/2 + ps.x_org * scale_org
    img.top  = (h - ps.h_org)/2 + ps.y_org * scale_org
    img.width  = w
    img.height = h
  }


  EQP_size_scale = scale_org

  var s = BG.style
  s.posLeft = Math.round(EQP_BG_x * EQP_size_scale)
  s.posTop  = Math.round(EQP_BG_y * EQP_size_scale)
  s.pixelWidth  = Math.round(EQP_BG_width  * EQP_size_scale)
  s.pixelHeight = Math.round(EQP_BG_height * EQP_size_scale)

  EV_width  = Math.round(EQP_EV_width  * EQP_size_scale)
  EV_height = Math.round(EQP_EV_height * EQP_size_scale)

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
    ss.pixelWidth  = Math.round(EQP_SL_w * EQP_size_scale)
    ss.pixelHeight = Math.round(EQP_SL_h * EQP_size_scale)
    ss.posLeft = Math.round(EQP_SL_x * EQP_size_scale)
    ss.posTop  = Math.round(EQP_SL_y * EQP_size_scale)

    if (use_HTML5) {
SL_object.width  = ss.pixelWidth
SL_object.height = ss.pixelHeight

SL_MC_Place(EQP_size_scale/2 + 0.5)

if (SL_mask['content_mask'] && SL_mask['content_mask'].Mask_src)
  SL_mask['content_mask'].drawn = false
    }
    else if (use_SVG) {
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

//        st.CenterX = ss.pixelWidth
//        st.CenterY = ss.pixelHeight
      }
    }
  }
}


var EQP_meter_count = 1

var EQP_EV_initialized

var EQP_EV_init = function () {
  if (EQP_EV_initialized) {
    if (EQP_allow_resize)
      EQP_resize()

    return
  }
  EQP_EV_initialized = true

  EQP_EV_width  = EV_width
  EQP_EV_height = EV_height

  if (use_HTML5 && use_MatrixRain) {
    if (MatrixRain_para && MatrixRain_para.content_mask)
      MatrixRain_para.content_mask = (Settings.f_path_folder + '\\' + ((EQP_parts_path) ? EQP_parts_path + '\\' : '')) + MatrixRain_para.content_mask

    EQP_matrix_rain = new MatrixRain(EV_width, EV_height, MatrixRain_para)
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

    DEBUG_show("Use Matrix rain", 2)
  }


// Defaults START
  var size_default = (System.Gadget.docked) ? 0.5 : 1
  if ((EQP_size_scale == null) || !use_Silverlight) {
    if (ie9_mode && !returnBoolean("CSSTransformToChildAnimation") && (SA_zoom != 1)) {
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

  if (!EQP_ref_width)
    EQP_ref_width = EV_width
  if (!EQP_ref_height)
    EQP_ref_height = EV_height

  if (!EQP_BG_width)
    EQP_BG_width = EV_width
  if (!EQP_BG_height)
    EQP_BG_height = EV_height
  if (!EQP_BG_x)
    EQP_BG_x = 0
  if (!EQP_BG_y)
    EQP_BG_y = 0

  if (EQP_parts_path == "/")
    EQP_parts_path = ""
  else if (!EQP_parts_path)
    EQP_parts_path = "parts_" + EV_width + "x" + EV_height

  if (!EQP_use_HTML_IMG)
    EQP_use_HTML_IMG = false

  if (EQP_EQ_mode == null)
    EQP_EQ_mode = true

  if (EQP_decay_factor == null)
    EQP_decay_factor = 0.2
  if (EQP_decay_factor2 == null)
    EQP_decay_factor2 = 1

  if (EQP_o_min == null)
    EQP_o_min = 0
  if (EQP_o_max == null)
    EQP_o_max = 100

  if (EQP_EQ_index == null)
    EQP_EQ_index = 0

  if (Canvas_Effect && use_HTML5 && !Canvas_Effect.show_behind_content)
    Canvas_Effect.canvas = "SL"
// END


//  BG.removeObjects()
  var _SL_TL = []
  var _SL_LR = []

  var svg_objs = []

  var ani_path = Settings.f_path_folder + '\\' + ((EQP_parts_path) ? EQP_parts_path + '\\' : '')
  for (var i = 0, i_max = EQP_ps.length; i < i_max; i++) {
    var ps = EQP_ps[i]

// Defaults START
    ps.z = ps.index = i
    ps.src = ps.src.replace(/\//g, "\\")

    var RE = /\.(bmp|gif|jpg|jpeg|png|wmv|webm|mp4|mkv)$/i;
    ps.file_ext = (RE.test(ps.src)) ? RegExp.$1 : 'png'
    ps.is_video = /wmv|webm|mp4|mkv/i.test(ps.file_ext)

    if (ps.is_video && !use_Silverlight)
      continue

    ps.src = ps.src.replace(RE, "")
    var img_path = ani_path + ps.src + '.' + ps.file_ext

    if (ps.o_min == null)
      ps.o_min = EQP_o_min
    else if (ps.o_min == -1) {
      ps.o_min = 100
      ps.static_alpha = true
    }
    if (ps.o_max == null)
      ps.o_max = EQP_o_max
    if (ps.o_min == ps.o_max)
      ps.static_alpha = true

    if (!ps.scale)
      ps.scale = {}

    if (!ps.rotate)
      ps.rotate = {}
    if (ps.rotation)
      ps.rotate.min = ps.rotate.max = ps.rotation

    for (var j = 0; j < 3; j++) {
      var pp
      if (j == 0)
        pp = ps
      else if (j == 1)
        pp = ps.scale
      else
        pp = ps.rotate

      pp._u = 0

      if (pp.u_min == null)
        pp.u_min = ps.u_min || 0
      if (pp.u_max == null)
        pp.u_max = ps.u_max || 100
      if (pp.u_min_hidden == null)
        pp.u_min_hidden = ps.u_min_hidden || -1
      if (pp.u_max_hidden == null)
        pp.u_max_hidden = ps.u_max_hidden || 999

      pp.decay  = {}
      pp.decay2 = {}
      if (pp.decay_factor  == null)
        pp.decay_factor  = ps.decay_factor  || EQP_decay_factor
      if (pp.decay_factor2 == null)
        pp.decay_factor2 = ps.decay_factor2 || EQP_decay_factor2
    }

    ps.static_scale = (ps.scale.min == null) || (ps.scale.min == ps.scale.max)
    ps.scale._scale = (ps.static_scale && ps.scale.min) || 1

    ps.static_rotate = ((ps.rotate.min == null) || (ps.rotate.min == ps.rotate.max)) && (ps.rotate.rpm_min == null)
    ps.rotate._rotate = ps.rotate._rotate_static = (ps.static_rotate && ps.rotate.min) || 0
    ps.rotate._rotate_by_rpm = 0

    ps.static_part = ps.static_alpha && ps.static_scale && ps.static_rotate

    ps.load = EQP_MM_Load
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


    var w = -1
    var h = -1

    var x = null
    var y = null
    if (ps.x != null)
      x = ps.x
    if (ps.y != null)
      y = ps.y
    if ((x == null) && (y == null)) {
      if (/_(\d+)x(\d+)$/.test(ps.src) || (ps.xy && /^(\d+)x(\d+)$/.test(ps.xy))) {
        x = EQP_ref_width - parseInt(RegExp.$1) + ((ps.x_offset) ? ps.x_offset : 0)
        y = EQP_ref_height - parseInt(RegExp.$2) + ((ps.y_offset) ? ps.y_offset : 0)
      }
    }

    ps.use_HTML_IMG_ = ps.use_HTML_IMG
    if (ps.use_HTML_IMG || use_SA_browser_mode)
      EQP_use_HTML_IMG = true
    ps.use_HTML_IMG = EQP_use_HTML_IMG
    var use_GADGET_IMG = !EQP_use_HTML_IMG

    if (EQP_use_HTML_IMG) {
      if (w3c_mode)
        EQP_allow_resize = false

      if (i == 0) {
        EQP_use_HTML_IMG_FULL = true

        if (EQP_HTML_bg_color == null)
          EQP_HTML_bg_color = "black"
      }
      if (EQP_HTML_bg_color) {
        var bg = document.createElement("div")
        bg.style.position = "absolute"
        bg.style.posLeft = 0
        bg.style.posTop = 0
        bg.style.pixelWidth = EV_width
        bg.style.pixelHeight = EV_height
        bg.style.backgroundColor = EQP_HTML_bg_color

        L_EV_content.appendChild(bg)

        // Make sure it is used only ONCE.
        EQP_HTML_bg_color = ""
      }

      if (x == null)
        x = y = 0
      ps.x_org = x
      ps.y_org = y

      var use_alpha = ps.use_alpha = (ps.o_min < 100)

if (use_SVG) {
  ps.use_SVG = ps.use_Silverlight = true

  var img_id = "main" + i + ((ps.is_video) ? "v" : "i")

  if (ps.w != null)
    w = ps.w
  if (ps.h != null)
    h = ps.h

  var svg = SVG_Object(img_id, ps)
  svg['Canvas.ZIndex'] = i
  svg['Canvas.Left'] = x
  svg['Canvas.Top'] = y
  if (use_alpha)
    svg.Opacity = ps.o_min/100

  if (ps.is_video) {}
  else {
    if (w == -1) {
      var dim = loadImageDim(img_path)
      w = dim.w
      h = dim.h
    }

    ps.img_obj_i = svg
  }

  ps.img = svg_objs[svg_objs.length] = svg

  ps.w_org = w
  ps.h_org = h

  svg.Source = toFileProtocol(img_path)

  if (ps.dragdrop)
    EQP_DragDrop_Init(ps)
}
else if (use_HTML5) {
  ps.use_HTML5 = ps.use_Silverlight = true

  var img_id = "main" + i + ((ps.is_video) ? "v" : "i")

  var mask = EQP_SS_init("EQP_ps[" + i + "]", img_id)

  if (ps.is_wallpaper) {
    ps.is_canvas = true
  }
  else if (ps.stretch_to_fill) {
    var dim = loadImageDim(img_path)
    var _w = dim.w
    var _h = dim.h
    var _ratio = Math.max(EQP_ref_width/_w, EQP_ref_height/_h)

    ps.w = Math.round(_w * _ratio)
    ps.h = Math.round(_h * _ratio)
    x += (EQP_ref_width  - ps.w)/2
    y += (EQP_ref_height - ps.h)/2
    ps.x_org = x
    ps.y_org = y
console.log(["ps" + i, ps.w,ps.h, x,y])
  }

  if (ps.w != null)
    w = ps.w
  if (ps.h != null)
    h = ps.h

  var c_obj = new CANVAS_Object(img_id, ps)
  var canvas = c_obj.canvas
  canvas['Canvas.ZIndex'] = i
  canvas['Canvas.Left'] = x
  canvas['Canvas.Top']  = y
  if (use_alpha)
    canvas.Opacity = ps.o_min/100

  if (ps.is_video) {}
  else {
    if (w == -1) {
      if (ps.is_wallpaper) {
        w = screen.width
        h = screen.height
      }
      else {
        var dim = loadImageDim(img_path)
        w = dim.w
        h = dim.h
      }
    }

    ps.img_obj_i = canvas
  }

  ps.img = canvas

  ps.w_org = w
  ps.h_org = h

  if (mask) {
    c_obj.load_mask(mask)
  }
  canvas.Source = toFileProtocol(img_path)

  if (ps.dragdrop)
    EQP_DragDrop_Init(ps)
}
else if (use_Silverlight) {
  ps.use_Silverlight = true

  var img_id = "main" + i

  if (ps.w != null)
    w = ps.w
  if (ps.h != null)
    h = ps.h

  var xaml_para = 'Canvas.ZIndex="' + i + '" Canvas.Left="' + x + '" Canvas.Top="' + y + '"' + ((use_alpha) ? ' Opacity="' + (ps.o_min/100) + '"' : '') + ' ';
  var xaml_src  = 'Source="' + toFileProtocol(img_path) + '" ';

  var xaml
  if (ps.is_video) {
    img_id += "v"

    var mask = ''
    if (para.mask) {
      mask =
  '<Canvas.OpacityMask>\n'
+ '<ImageBrush x:Name="' + img_id + '_mask" ImageSource="' + toFileProtocol(para.mask) + '"/>\n'
+ '</Canvas.OpacityMask>\n'
    }

    var mask_v = ''
    if (para.mask_v) {
      mask_v =
  '<MediaElement.OpacityMask>\n'
+ '<ImageBrush x:Name="' + img_id + '_obj_mask" ImageSource="' + toFileProtocol(para.mask_v) + '"/>\n'
+ '</MediaElement.OpacityMask>\n'
    }

    xaml =
  '<Canvas xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" x:Name="' + img_id + '" '
+ xaml_para
+ '>\n'
+ mask
+ '<MediaElement x:Name="' + img_id + '_obj" '
+ xaml_src
+ ((w > 0) ? 'Width="' + w + '" Height="' + h + '" ' : '')
+ 'MediaOpened="SL_MediaOpened" MediaEnded="SL_MediaEnded" '
+ ((ps.use_media_control) ? 'MouseEnter="SL_Media_MouseEnter" ' : '')
+ ((ps.play_sound) ? 'Volume="1"' : 'IsMuted="true"')
+ '>\n'
+ mask_v
+ '</MediaElement>\n'
+ '</Canvas>'

    ps.w_video = w
    ps.h_video = h
  }
  else {
    img_id += "i"

    var mask = EQP_SS_init("EQP_ps[" + i + "]", img_id)

    xaml =
  '<Image xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" x:Name="' + img_id + '" '
+ xaml_para + xaml_src
+ ((mask) ? 'Stretch="UniformToFill" ' : '')
+ '>\n'
+ mask
+ '</Image>'

    if (w == -1) {
      var dim = loadImageDim(img_path)
      w = dim.w
      h = dim.h
    }
  }

  if ((i > 0) && ps.group_id) {
    var i_last = i - 1
    var ps_last = EQP_ps[i_last]
    if (ps_last.group_id == ps.group_id) {
      xaml = EQP_SL_xaml[i_last] + '\n' + xaml
      EQP_SL_xaml[i_last] = null
    }
  }

  EQP_SL_xaml[i] = xaml

  ps.img = img_id

  ps.w_org = w
  ps.h_org = h

  if (ps.dragdrop)
    EQP_DragDrop_Init(ps)
}
else {
  var img = document.createElement("img")
  img.style.position = "absolute"
  img.style.posLeft = x
  img.style.posTop = y
  img.src = toFileProtocol(img_path)
  if (use_alpha) {
    if (ie9_mode)
      img.style.opacity = ps.o_min/100
    else
      img.style.filter = "progid:DXImageTransform.Microsoft.Alpha(opacity=" + ps.o_min + ")"
  }

  L_EV_content.appendChild(img)
  ps.img_obj = img

  if (use_alpha)
    ps.img = ps.img_HTML = (ie9_mode) ? img.style : img.filters.item("DXImageTransform.Microsoft.Alpha")
}

      if (EQP_allow_resize) {
        ps.full_size = (ps.full_size == null) ? true : ps.full_size
        ps.half_size = (ps.half_size == null) ? true : ps.half_size

        if (ps.full_size && ps.half_size) {
          use_GADGET_IMG = !use_Silverlight
        }
        else
          ps.fixed_size = true
      }
    }
    else {
      if (use_Silverlight)
        SL_ST_enabled = false
    }

    if (use_GADGET_IMG) {
      if (!ps.static_alpha) {
        if (ps.o_min > 99)
          ps.o_min = 99
        if (ps.o_max > 99)
          ps.o_max = 99
      }

      var img = BG.addImageObject(img_path, 0,0)
      w = ps.w_org = img.width
      h = ps.h_org = img.height

      if (x == null) {
        x = parseInt((EQP_ref_width - img.width) / 2)
        y = parseInt((EQP_ref_height - img.height) / 2)
        if (x % 2)
          x++
        if (y % 2)
          y++
      }

      x = ps.x_org = x - EQP_BG_x
      y = ps.y_org = y - EQP_BG_y

      img.left = x
      img.top = y
      img.opacity = ps.o_min
      ps.img = ps.img_GADGET = img

      if (use_Silverlight)
        SL_PP_enabled = false
    }

var _SL_TL_x = _SL_TL[0]
if ((_SL_TL_x == null) || (_SL_TL_x > x))
  _SL_TL[0] = x
var _SL_TL_y = _SL_TL[1]
if ((_SL_TL_y == null) || (_SL_TL_y > y))
  _SL_TL[1] = y

var _SL_LR_x = _SL_LR[0]
if ((_SL_LR_x == null) || (_SL_LR_x < x+w))
  _SL_LR[0] = x+w
var _SL_LR_y = _SL_LR[1]
if ((_SL_LR_y == null) || (_SL_LR_y < y+h))
  _SL_LR[1] = y+h

    // cross-script compatibility
    ps.x_default = x
    ps.y_default = y
    ps.w_default = w
    ps.h_default = h
  }


  EQP_Process_CanvasEffect_Mask(EQP_EV_width, EQP_EV_height)

  if (use_HTML5)
    EQP_allow_resize = true
  if ((w3c_mode) && !use_Silverlight)
    EQP_allow_resize = use_CSS3_2D_Transforms = true
  if (EQP_allow_resize && !document.body.ondblclick) {
//    if (!use_Silverlight_only && !webkit_electron_mode)
//      document.body.title += ', double-click to change size'
    if (!WallpaperEngine_mode)
      document.body.ondblclick = EQP_onresize
  }

  EV_BG_src = ""

  var s = BG.style
  s.posLeft = EQP_BG_x
  s.posTop = EQP_BG_y
  s.pixelWidth = EQP_BG_width
  s.pixelHeight = EQP_BG_height

//DEBUG_show(EQP_EQ_min+'-'+EQP_EQ_max)
  if (!EV_usage_sub)
    EV_usage_sub = EV_object[0].EV_usage_sub = EV_usage_sub_CREATE(null, "sound", 3)

  if (use_Silverlight_only && !EQP_SL_xaml.length)
    use_Silverlight = false

  if (EQP_allow_resize || use_Silverlight)
    EQP_resize()
  else {
    if (EQP_use_HTML_IMG_FULL)
      EV_BG_allow_dummy = (EQP_size_scale == 1)
  }

  if (EQP_init_extra)
    EQP_init_extra()


// Silverlight
  if (use_Silverlight) {
//DEBUG_show(_SL_TL+'x'+_SL_LR,0,true)
    var x = _SL_TL[0]
    var y = _SL_TL[1]
    EQP_SL_x = x
    EQP_SL_y = y
    EQP_SL_w = _SL_LR[0] - x
    EQP_SL_h = _SL_LR[1] - y
//DEBUG_show(EQP_SL_x+','+EQP_SL_y+'/'+EQP_SL_w+'x'+EQP_SL_h,0,true)

    if (use_HTML5) {
      EQP_SL_x = EQP_SL_y = 0
      EQP_SL_w = EQP_EV_width
      EQP_SL_h = EQP_EV_height
//DEBUG_show(EQP_SL_x+','+EQP_SL_y+'/'+EQP_SL_w+'x'+EQP_SL_h,0,true)
      HTML5_Init()
    }
    else if (use_SVG)
      SVG_Init(svg_objs)
    else
      SL_Init()
  }
  else if ((w3c_mode) && use_WMP) {
// SVG filter test
  }
}

if (!EV_init)
  EV_init = EQP_EV_init


var CANVAS_must_redraw

var EQP_EV_animate_full = function () {
//DEBUG_show(PC_count_absolute)
  if (use_Silverlight && !SL_loaded)
    return

  var timestamp = performance.now()

  for (var i = 0, i_max = EQP_ps.length; i < i_max; i++) {
    var ps = EQP_ps[i]
    if (ps.use_HTML5 && !ps.img.canvas_parent.drawn && ps.img.Opacity) {
      CANVAS_must_redraw = true
    }
    if (ps.static_part)
      continue

    for (var j = 0; j < 3; j++) {
      var pp
      if (j == 0) {
        if (ps.static_alpha)
          continue
        pp = ps
      }
      else if (j == 1) {
        if (ps.static_scale)
          continue
        pp = ps.scale
      }
      else {
        if (ps.static_rotate)
          continue
        pp = ps.rotate
      }

      var u = -1
      if (EV_usage_sub) {
        var g_EQ   = pp.g_EQ
        var g_num  = pp.g_num
        var g_beat = pp.g_beat
        if (!g_EQ && !g_num && !g_beat) {
          g_EQ   = ps.g_EQ
          g_num  = ps.g_num
          g_beat = ps.g_beat
        }

        if (EQP_EQ_mode && g_EQ && g_EQ[EQP_EQ_index]) {
          var EQ = g_EQ[EQP_EQ_index]

          u = 0
          for (var k = 0, k_max = EQ.length; k < k_max; k++)
            u += EV_usage_sub.sound_raw[EQ[k]].usage_raw * Sound_EQBand_mod
          u /= EQ.length

          u = EV_usage_PROCESS(null, u)
        }
        else if (g_num && (g_num[EQP_EQ_index] >= 0))
          u = EV_usage_sub.sound[g_num[EQP_EQ_index]].EV_usage_float
        else if (g_beat && g_beat[EQP_EQ_index]) {
          u = (EV_usage_sub.BD) ? EV_usage_PROCESS(null, EV_usage_sub.BD.beat*100) : 0
        }
      }

      if (u == -1)
        u = EV_usage_float

      u = EQP_EV_usage_PROCESS(pp.decay2, u, pp.decay_factor2)

      var u_min = pp.u_min
      var u_max = pp.u_max
      if (u < u_min)
        u = (u <= pp.u_min_hidden) ? -1 : 0
      else if (u >= u_max)
        u = (u >= pp.u_max_hidden) ? -1 : 100
      else
        u = (u_max == u_min) ? 100 : (u - u_min) / (u_max - u_min) * 100

      pp._u = (u == -1) ? -1 : EQP_EV_usage_PROCESS(pp.decay, u, pp.decay_factor)
      if (pp._u_last != pp._u) {
        pp._u_last = pp._u
        pp._needs_update = true
        CANVAS_must_redraw = ps.use_HTML5
      }
    }

    if (!ps.static_alpha) {
      if (ps._needs_update) {
        var u = ps._u
        var opacity = (u == -1) ? 0 : parseInt(ps.o_min + (ps.o_max - ps.o_min) * u/100)
//if (opacity == 100) DEBUG_show(opacity+','+i)
        if (ps.use_Silverlight) {
          ps.img.Opacity = opacity / 100
          CANVAS_must_redraw = ps.use_HTML5
        }
        else
          ps.img.opacity = (ie9_mode) ? opacity/100 : opacity
        ps._needs_update = false
      }
    }

    var pp, u
    if (!ps.static_scale) {
      pp = ps.scale 
      if (pp._needs_update) {
        u = pp._u
        pp._scale = (u == -1) ? pp.min : pp.min + (pp.max - pp.min) * u/100
        pp._needs_update = false
      }
    }

    if (!ps.static_rotate) {
      pp = ps.rotate
      var u = pp._u
      if ((pp.min != null) && pp._needs_update) {
        pp._rotate_static = (u == -1) ? pp.min : pp.min + (pp.max - pp.min) * u/100
        pp._needs_update = false
      }
      if (pp.rpm_min != null) {
        if (pp._timestamp) {
          var r = (u == -1) ? pp.rpm_min : pp.rpm_min + (pp.rpm_max - pp.rpm_min) * u/100
          if (r) {
            pp._rotate_by_rpm = (pp._rotate_by_rpm + r * ((timestamp - pp._timestamp) / 1000 / 60)) % 1
            CANVAS_must_redraw = ps.use_HTML5
          }
          pp._rotate = pp._rotate_static + pp._rotate_by_rpm * 360
//DEBUG_show([r,pp._rotate,pp._rotate_static,pp._rotate_by_rpm])
        }
        pp._timestamp = timestamp
        pp._needs_update = false
      }
    }
  }

  if (use_HTML5) {
    if (Canvas_Effect && Canvas_Effect.drawn)
      CANVAS_must_redraw = true
  }

  var update_WMP_wallpaper_mask = CANVAS_must_redraw
  WebGL_2D_must_redraw = CANVAS_must_redraw
  if (CANVAS_must_redraw) {
    SL._drawn_id = Date.now()

    var context = SL.getContext("2d")
    context.globalCompositeOperation = 'copy'

    if (EQP_flipH || EQP_flipV) {
      var wxh = SL.width+'x'+SL.height
      if (SL._transformed != wxh) {
        context.translate(((EQP_flipH)?SL.width:0), ((EQP_flipV)?SL.height:0))
        context.scale(((EQP_flipH)?-1:1), ((EQP_flipV)?-1:1))
        SL._transformed = wxh
      }
    }

    var canvas_drawn = 0
    for (var i = 0, i_max = EQP_ps.length; i < i_max; i++) {
      var ps = EQP_ps[i]
      if (!ps.use_HTML5)
        continue

var canvas = ps.img
var opacity = canvas.Opacity
if (!opacity)
  continue

// make sure it is already drawn once
canvas.canvas_parent.draw(true)

if (canvas_drawn++ == 1)
  context.globalCompositeOperation = 'source-over'

context.globalAlpha = opacity
/*
if (ps.rotation) {
  var a = ps.rotation/180 * Math.PI

  context.save()

  context.translate(SL.width/2, SL.height/2)
  context.rotate(a)

  var x = -SL.width/2  + canvas.x_resized+canvas.width/2
  var y = -SL.height/2 + canvas.y_resized+canvas.height/2
  var r = Math.sqrt(x*x + y*y)
  a = Math.atan2(y,x) - a

  x = Math.cos(a) * r
  y = Math.sin(a) * r
  context.translate(x,y)

  context.drawImage(canvas, -canvas.width/2,-canvas.height/2)

  context.restore()
}
*/
if (((ps.scale._scale || 1) != 1) || ps.rotate._rotate) {
  context.save()

  var x = (ps.x_org - EQP_SL_x) * EQP_size_scale
  var y = (ps.y_org - EQP_SL_y) * EQP_size_scale
  var w = ps.w_org * EQP_size_scale
  var h = ps.h_org * EQP_size_scale

// adjust x/y rounding offset due to resized canvas, moving to the accurate resized (0,0)
  var x_resized_offset = canvas.x_resized-x
  var y_resized_offset = canvas.y_resized-y
  context.translate(x_resized_offset, y_resized_offset)

  var scale = ps.scale._scale || 1
  if (scale != 1) {
    context.scale(scale, scale)
  }

  var x_adjusted = w*(1-scale)*0.5 + x
  var y_adjusted = h*(1-scale)*0.5 + y

  var rotate = ps.rotate._rotate
  if (rotate) {
    var a = rotate/180 * Math.PI

    context.translate(w/2, h/2)
    context.rotate(a)
    context.translate(-w/2, -h/2)

    var r = Math.sqrt(x_adjusted*x_adjusted + y_adjusted*y_adjusted)
    a = Math.atan2(y_adjusted,x_adjusted) - a

    x_adjusted = Math.cos(a) * r
    y_adjusted = Math.sin(a) * r
  }

  context.translate(x_adjusted/scale, y_adjusted/scale)

//DEBUG_show(ps.w_org+'x'+ps.h_org)

  context.drawImage(canvas, 0,0)

  context.restore()
}
else {
  context.drawImage(canvas, canvas.x_resized,canvas.y_resized)
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

  if (use_HTML5) {
    if (Canvas_Effect)
      Canvas_Effect.draw()

    Canvas_BDDraw(SL)

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

  if (EQP_animate_extra)
    EQP_animate_extra()

  if (use_HTML5 && SL._WebGL_2D && WebGL_2D_must_redraw)
    SL._WebGL_2D.draw()
}

if (!EV_animate_full)
  EV_animate_full = EQP_EV_animate_full


var EQP_wallpaper_mode_enabled
var EQP_wallpaper_mode_options

var EQP_wallpaper_mode = {
  x_ratio: 0.5
 ,y_ratio: 0.5

 ,init: function () {
if (EQP_wallpaper_mode_options) {
  for (var name in EQP_wallpaper_mode_options)
    this[name] = EQP_wallpaper_mode_options[name]
}

EV_init = function () {
// support "fullscreen" child animation as well
  var fullscreen = (use_SA_browser_mode && Settings.CSSTransformFullscreen)
  if (fullscreen) {
    EV_width  = EQP_EV_width  = EQP_SL_w = Math.max(screen.availWidth,  EQP_ref_width)
    EV_height = EQP_EV_height = EQP_SL_h = Math.max(screen.availHeight, EQP_ref_height)
    SA_zoom = EQP_size_scale = 1
//    resize(true, function () { _WE_adjust_pos(1,1); EQP_resize(1); }, true,true)
  }
  else {
    EV_width  = EQP_EV_width  = EQP_SL_w = EQP_ref_width
    EV_height = EQP_EV_height = EQP_SL_h = EQP_ref_height
  }

  var first_resize = !EQP_EV_initialized
  if (!first_resize)
    EQP_wallpaper_mode.adjust_pos()

  EQP_EV_init()

  if (first_resize) {
    EQP_wallpaper_mode.adjust_pos()
    EQP_resize(EQP_size_scale)
  }
}
  }

 ,adjust_pos: function () {
    var x_ratio = this.x_ratio
    var y_ratio = this.y_ratio

    EQP_ps.forEach(function (ps) {
if (ps._x_org_ == null)
  ps._x_org_ = ps.x_org
if (ps._y_org_ == null)
  ps._y_org_ = ps.y_org

ps.x_org = ps._x_org_ + (EV_width -EQP_ref_width)  * x_ratio
ps.y_org = ps._y_org_ + (EV_height-EQP_ref_height) * y_ratio
//console.log([ps.x_org,ps.y_org])
    });

    if (use_EQP_fireworks && self.CanvasEffect_options) {
      if (CanvasEffect_options._start_x_ == null)
        CanvasEffect_options._start_x_ = CanvasEffect_options.start_x || 0
      if (CanvasEffect_options._start_y_ == null)
        CanvasEffect_options._start_y_ = CanvasEffect_options.start_y || 0

      CanvasEffect_options.start_x = (CanvasEffect_options._start_x_ * EQP_ref_width /2 + (EV_width -EQP_ref_width) /2 * (x_ratio - 0.5) * 2) / (EV_width /2)
      CanvasEffect_options.start_y = (CanvasEffect_options._start_y_ * EQP_ref_height/2 + (EV_height-EQP_ref_height)/2 * (y_ratio - 0.5) * 2) / (EV_height/2)
//console.log([CanvasEffect_options.start_x,CanvasEffect_options.start_y])
      if (self.EQP_Fireworks) {
        EQP_Fireworks.start_x = CanvasEffect_options.start_x
        EQP_Fireworks.start_y = CanvasEffect_options.start_y
      }
    }

    if (self.WebGL_2D_options) {
      if (WebGL_2D_options._zoomblur_center_x_ == null)
        WebGL_2D_options._zoomblur_center_x_ = WebGL_2D_options.zoomblur_center_x || 0
      if (WebGL_2D_options._zoomblur_center_y_ == null)
        WebGL_2D_options._zoomblur_center_y_ = WebGL_2D_options.zoomblur_center_y || 0

      WebGL_2D_options.zoomblur_center_x = (WebGL_2D_options._zoomblur_center_x_ * EQP_ref_width /2 + (EV_width -EQP_ref_width) /2 * (x_ratio - 0.5) * 2) / (EV_width /2)
      WebGL_2D_options.zoomblur_center_y = (WebGL_2D_options._zoomblur_center_y_ * EQP_ref_height/2 + (EV_height-EQP_ref_height)/2 * (y_ratio - 0.5) * 2) / (EV_height/2)
    }
  }
}

if (EQP_wallpaper_mode_enabled)
  EQP_wallpaper_mode.init()


// CORE
document.write('<script language="JavaScript" src="js/EQP_core.js"></scr'+'ipt>');


// EQP - Free BG version
if (use_EQP_FB)
  document.write('<script language="JavaScript" src="js/EQP_FB.js"></scr'+'ipt>');


// Silverlight
var EV_SL_init = function () {

try {
  var group_id
  for (var i = 0; i < EQP_SL_xaml.length; i++) {
    var xaml = EQP_SL_xaml[i]
    if (!xaml) {
      group_id = EQP_ps[i].group_id
      continue
    }

    if (group_id) {
      xaml =
  '<Canvas xmlns:x="http://schemas.microsoft.com/winfx/2006/xaml" x:Name="' + group_id + '" '
+ 'Canvas.ZIndex="' + i + '"'
+ '>\n'
+ xaml + '\n'
+ '</Canvas>'
      group_id = null
    }

    SL_content.children.add(SL.content.createFromXaml(xaml, false));
  }
}
catch (err) { DEBUG_show(err.description, 0,true) }

try {
  var i
  for (i = 0; i < EQP_ps.length; i++) {
    var ps = EQP_ps[i]

    if (!ps.use_Silverlight)
      continue

    var img = ps.img
    if (!img)
      continue

    var name = ps.img
    img = ps.img = SL_root.FindName(name)

    if (ps.is_video)
      ps.img_obj_v = img
    else
      ps.img_obj_i = img
  }
}
catch (err) { DEBUG_show(err.description + '(' + i + ')', 0,true) }

// Enforce proper resizing
resize()

}


// Silverlight scripts
if (use_Silverlight) {
  if (use_HTML5) {
    document.write('<script language="JavaScript" src="js/html5.js"></scr'+'ipt>');
  }
  else if (use_SVG) {
    document.write('<script language="JavaScript" src="js/svg.js"></scr'+'ipt>');
  }
  else {
    document.write('<script language="JavaScript" src="js/Silverlight.js"></scr'+'ipt>');
    document.write('<script language="JavaScript" src="js/SA_silverlight.js"></scr'+'ipt>');
  }
}
