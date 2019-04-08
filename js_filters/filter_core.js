// Filter core v2.7.0

// System Animator core START
var EV_init
var EV_width, EV_height

var EV_animate_full, EV_AnimateFrame

function Array_swap(a,b) {
  if (a == b)
    return
  if ((b < 0) || (b >= this.length))
    return

  var obj_a = this[a]
  var obj_b = this[b]
  this[a] = obj_b
  this[b] = obj_a
}

if (ie9_mode) {
  Object.defineProperty(Array.prototype, "swap",
{
  value: Array_swap
 ,enumerable: false
});
}
else
  Array.prototype.swap = Array_swap
// System Animator core END


var use_filter = true
var use_full_spectrum = true

var use_all_filters
var use_spotlight, use_motionblur, use_matrix, use_ghosting, use_EQ_filter
var use_blank_filter = true
var use_MatrixMeter
var use_MMG


var EV_last_update_time = 0

var filter_initialized
var filter_index = 0

var filter_id
var filter_fps_fixed
var filter_objs = []

var filter_switch_index = 0
var filter_u_last = 0
var filter_mouseover, filter_mouseout

var BG_draw_func

var Filter_init_initialized

function sort_random(a,b) { return Math.random() - 0.5 }

function Filter_EV_usage_PROCESS(obj, mod) {
  if (!mod)
    mod = 1
  var u = obj.EV_usage_float / 100 * mod

// decay control
  if (this.u_decay_factor) {
    var decay_factor = (filter_fps_fixed && !this.filter_fps_varied) ? this.u_decay_factor : this.u_decay_factor*2; //this.u_decay_factor * 10/(((1000/t_diff)+SEQ_fps)/2)
    if (u + decay_factor < obj.filter_u_last)
      u = obj.filter_u_last - decay_factor
  }
  obj.filter_u_last = u

  return u
}

var Filter_init = function () {
  if (Filter_init_initialized) {
    BG_draw_func()
    return
  }
  Filter_init_initialized = true


// Filters
  if (!self.use_filter)
    return

try {
// init START
  BG_dim_calculate()

  if (use_spotlight)
    filter_objs.push(Spotlight)
  if (use_motionblur)
    filter_objs.push(Motionblur)
  if (use_matrix)
    filter_objs.push(Matrix)
  if (use_ghosting) {
    if (use_MMG || SEQ_mode) {
      filter_objs.push(Ghosting)
/*
      if (SEQ_mode && (SEQ_gallery_all[0].gallery.length > 1))
        use_blank_filter = false
*/
    }
    else
      use_ghosting = false
  }
  if (use_EQ_filter)
    filter_objs.push(EQ_Filter)

  if (filter_objs.length > 1)
    filter_objs.push(FilterRandom)

  for (var i = 0; i < filter_objs.length; i++) {
    var f = filter_objs[i]
    f.index = i
    f.init()
  }
// init END

  if (!BG_draw_func)
    BG_draw_func = BG_AddShadow

  if (use_MMG || !SEQ_mode)
    filter_fps_fixed = true
if (use_EQ_filter) filter_fps_fixed = true;

  filter_id = (use_MMG) ? "LMMG_parent" : "Lmain_animation"

  Filter_draw()
  if (document.getElementById("Lfilter_scale_mod_switch")) {
    SA_zoom = parseInt(LABEL_LoadSettings("LABEL_SA_zoom", SA_zoom));
    if (SA_zoom > 1) {
      SA_zoom_filterType = LABEL_LoadSettings("LABEL_SA_zoom_filterType", SA_zoom_filterType);
      filter_scale_mod_toggle(true)
    }
  }

  if (filter_fps_fixed) {
    EV_animate_full = function () {
		var filter_updated
		var f = filter_objs[filter_index]

		if (self.EV_animate_full2) {
			if (f.filter_name == "Ghosting") {
				f.frame()
				filter_updated = true
			}
			EV_animate_full2()
		}

		if (!filter_updated)
			f.frame()

		if (use_MMG)
			MMG_drawBG()

		if (use_ghosting && (self.EV_animate_full2 || use_MMG))
			Ghosting.frame_final()
    }
  }
  else {
    EV_AnimateFrame = function (pic, w,h) {
		if (self.EV_AnimateFrame2) {
			var pic_obj = EV_AnimateFrame2(pic, w,h)
			pic = pic_obj.pic
			w = pic_obj.w
			h = pic_obj.h
		}

		filter_objs[filter_index].frame()
		return {pic:pic, w:w, h:h}
    }
  }

  if (use_MMG && MMG_gallery.length) {
    DragDrop.init(Lmain_obj, MMG_dragdrop_gallery)
    document.body.ondblclick = MMG_ondblclick
  }
}
catch (ex) {}

}

if (!EV_init)
  EV_init = Filter_init


var mouseout_timerID

function Filter_draw() {
  var html = ''

  if (use_MMG) {
    html +=
  '<div id="LMMG_parent" style="position:absolute; top:0px; left:0px; width:' + MMG_BG_width + 'px; height:' + MMG_BG_height + 'px; overflow:hidden; background-color:black">\n'
+ '<img id="IMMG" style="position:absolute; top:0px; left:0px;' + ((!ie9_mode) ? 'filter:progid:DXImageTransform.Microsoft.Alpha(opacity=0)' : '') + '" src="js_filters/images/empty.gif"/>\n'
+ '</div>\n'
  }

  if (use_matrix) {
    var html_matrix = ''
    html_matrix +=
  '<div id="Lmatrix_rain" style="position:absolute; top:0px; left:0px">\n'
    for (var x = 0; x < matrix_x_max; x++) {
      for (var y = 0; y < matrix_y_max; y++) {
        html_matrix +=
    '<span id=Cmatrix_' + x + '_' + y + ' style="position:absolute; left:' + (x * matrix_grid_dim + ((matrix_x_split && (x >= matrix_x_max/2)) ? matrix_x_split : 0)) + 'px; top:' + (y*matrix_grid_dim) + 'px; visibility:hidden">' + matrix_grid[x][y] + '</span>\n'
      }
    }
    html_matrix +=
  '</div>\n'

    html =
  '<div id="Lmatrix_parent" style="position:absolute; top:0px; left:0px; width:' + (matrix_width + matrix_content_x*2) + 'px; height:' + (matrix_height + matrix_content_y*2) + 'px; overflow:hidden; background-color:' + ((use_MMG) ? 'black' : 'transparent') + '">\n'
+ '<div id="Lmatrix" style="position:absolute; top:' + matrix_content_y + 'px; left:' + matrix_content_x + 'px; width:' + matrix_width + 'px; height:' + matrix_height + 'px; overflow:hidden; color:black; font-size:' + matrix_grid_fontSize + '; font-family:Courier New">\n'

+ html
+ html_matrix

+ '</div>\n'
+ '</div>'
  }

  if (html)
    L_EV_content.insertAdjacentHTML("afterBegin", html)
//DEBUG_show(L_EV_content.innerHTML,0,true)
  L_EV_content.style.zIndex = (use_MMG) ? 0 : 10

  BG_draw_func()

// Enable default filter START
  for (var i = 0; i < filter_objs.length; i++) {
    var obj = filter_objs[i]
    if (!obj.filter_enabled)
      continue

    filter_switch_index = i
    filter_status_toggle(true, true)
    break
  }
// END

  if (filter_objs.length <= 1)
    return

  var s = (ie8_mode) ? -2 : 0

  L_EV_content2.innerHTML =
  '<div id="Lfilter_parent" style="position:absolute; top:0px; left:0px; color:black; font-size:xx-small; display:none" ondblclick="event.cancelBubble=true">\n'
+ '<div id="Lfilter_name_switch" class="Filter_option" style="position:absolute; top:5px; left:' + (((w_max < 130) ? 130 : w_max) - (60 + 5)) + 'px; width:'+(60+s)+'px;" onclick="filter_name_toggle()" title="Click to switch to another visual filter."></div>\n'
+ '<div id="Lfilter_status_switch" class="Filter_option" style="position:absolute; top:25px; left:' + (((w_max < 130) ? 130 : w_max) - (30 + 5)) + 'px; width:'+(30+s)+'px;" onclick="filter_status_toggle()" title="Turn on/off the selected visual filter."></div>\n'
+ ((!SEQ_mode || use_MMG || (EV_height > 200)) ? '' : '<div id="Lfilter_scale_name_switch" class="Filter_option" style="position:absolute; top:25px; left:5px; width:'+(30+s)+'px;" onclick="filter_scale_name_toggle()" title="Click to switch between playback speed and animation zooming.">' + filter_scale_name + '</div><div id="Lfilter_scale_mod_switch" class="Filter_option" style="position:absolute; top:25px; left:40px; width:35px;" onclick="filter_scale_mod_toggle()" title="">x 1</div>\n')
+ ((EV_usage_sub && (use_spotlight || use_matrix)) ? '<div id="Lfilter_FS_switch" class="Filter_option" style="position:absolute; top:50px; left:5px; width:'+(100+s)+'px;" onclick="FullSpectrum_toggle()" title="When this option is ON, the full sound spectrum data (instead of a generalized value) is used by this visual filter to generate the effects."></div>\n' : '')
+ ((use_matrix) ? '<div id="Lfilter_MM_switch" class="Filter_option" style="position:absolute; top:115px; left:5px; width:'+(100+s)+'px;" onclick="Matrix.MM_Toggle(!self.MM_enabled)" title="Turn on/off the PC meter function inside the Matrix effect.">Matrix Meter: ' + ((self.MM_enabled) ? 'ON' : 'OFF') + '</div>\n' : '')
+ ((gallery_dim_predefined) ? '<div id="Lfilter_PreloadGallery_switch" class="Filter_option" style="position:absolute; top:115px; left:5px; width:'+(100+s)+'px;" onclick="PreloadGallery_Toggle()" title="Turn on the image preload function (requires a longer startup time) if the animation looks too choppy at the beginning.">Image Preload: ' + ((gallery_preload_always) ? 'ON' : 'OFF') + '</div>\n' : '')
+ ((self.EV_extra_option_menu) ? EV_extra_option_menu : '')
+ '</div>'

  filter_mouseover = function () {
    if (!filter_objs[filter_index].filter_enabled)
      Lmain_animation.style.backgroundColor = "gray"

    var obj = (FilterRandom.filter_enabled) ? FilterRandom : filter_objs[filter_switch_index]
    Lfilter_name_switch.innerHTML   = obj.filter_name
    Lfilter_status_switch.innerHTML = (obj.filter_enabled) ? "ON" : "OFF"
    Lfilter_name_switch.style.visibility = Lfilter_status_switch.style.visibility = "inherit"

    if (document.getElementById("Lfilter_scale_name_switch")) {
      Lfilter_scale_name_switch.style.visibility = "inherit"
      Lfilter_scale_mod_switch.style.visibility = "inherit"
    }

    if (document.getElementById("Lfilter_FS_switch")) {
      if (/^(Spotlight|Matrix)$/.test(obj.filter_name)) {
        Lfilter_FS_switch.innerHTML = 'Full Spectrum: ' + ((obj.use_full_spectrum) ? 'ON' : 'OFF')
        Lfilter_FS_switch.style.visibility = "inherit"
      }
      else
        Lfilter_FS_switch.style.visibility = "hidden"
    }

    var no_PG_switch
    var bottom = h_max
    if (!bottom || (bottom > 130))
      bottom = 130

    if (document.getElementById("Lfilter_MM_switch")) {
      if (obj.filter_name == "Matrix") {
        Lfilter_MM_switch.style.posTop = (bottom - 25)
        Lfilter_MM_switch.style.visibility = "inherit"
        no_PG_switch = true
      }
      else
        Lfilter_MM_switch.style.visibility = "hidden"
    }

    if (document.getElementById("Lfilter_PreloadGallery_switch")) {
      Lfilter_PreloadGallery_switch.style.posTop = (bottom - 25)
      Lfilter_PreloadGallery_switch.style.visibility = (no_PG_switch) ? "hidden" : "inherit"
    }

    Lfilter_parent.style.display = "block"
  }

  filter_mouseout = function() {
    if (!filter_objs[filter_index].filter_enabled)
      Lmain_animation.style.backgroundColor = "transparent"

    Lfilter_name_switch.style.visibility = Lfilter_status_switch.style.visibility = "hidden"

    if (document.getElementById("Lfilter_scale_name_switch")) {
      Lfilter_scale_name_switch.style.visibility = "hidden"
      Lfilter_scale_mod_switch.style.visibility = "hidden"
    }
    if (document.getElementById("Lfilter_FS_switch"))
      Lfilter_FS_switch.style.visibility = "hidden"
    if (document.getElementById("Lfilter_MM_switch"))
      Lfilter_MM_switch.style.visibility = "hidden"
    if (document.getElementById("Lfilter_PreloadGallery_switch"))
      Lfilter_PreloadGallery_switch.style.visibility = "hidden"

    Lfilter_parent.style.display = "none"
  }

  var mouseover = function () {
    if (mouseout_timerID) {
      clearTimeout(mouseout_timerID)
      mouseout_timerID = null
      return
    }

    SA_extra_info_on = true

    filter_mouseover()
    if (self.EV_mouseover)
      EV_mouseover()
  }

  var mouseout = function () {
    mouseout_timerID = setTimeout("SA_mouseout()", 100)
  }

  document.onmouseover = mouseover
  document.onmouseout  = mouseout
}

var SA_mouseout = function () {
  mouseout_timerID = null
  SA_extra_info_on = false

  filter_mouseout()
  if (self.EV_mouseout)
    EV_mouseout()
}

var filter_scale_name = "Zoom"

function filter_scale_name_toggle() {
  Lfilter_scale_name_switch.innerText = filter_scale_name = (filter_scale_name == "Speed") ? "Zoom" : "Speed"
  filter_scale_mod_toggle(true)
}

function filter_scale_mod_toggle(no_toggle) {
  if (filter_scale_name == "Speed") {
    if (!no_toggle) {
      if (SEQ_fps_end_factor >= 2)
        SEQ_fps_end_factor = 1
      else
        SEQ_fps_end_factor += 0.25
    }

    Lfilter_scale_mod_switch.innerText = "x" + SEQ_fps_end_factor
    Lfilter_scale_mod_switch.title = "Playback speed x" + SEQ_fps_end_factor + " (click to change)"
  }
  else {
    if (!no_toggle) {
      if (SA_zoom == 1) {
        SA_zoom = SA_zoom_max
        SA_zoom_filterType = "nearest"
      }
      else {
        if (!ie9_mode && (SA_zoom_filterType == "nearest"))
          SA_zoom_filterType = "bilinear"
        else
          SA_zoom = 1
      }
    }
    setTimeout('resize()', 0)

System.Gadget.Settings.writeString("LABEL_SA_zoom", ((SA_zoom == 1) ? "" : SA_zoom))
if (!ie9_mode)
  System.Gadget.Settings.writeString("LABEL_SA_zoom_filterType", ((SA_zoom_filterType == "bilinear") ? "bilinear" : ""))

    Lfilter_scale_mod_switch.innerText = "x" + SA_zoom + (((SA_zoom > 1) && (SA_zoom_filterType == "bilinear")) ? 'B' : '')
    Lfilter_scale_mod_switch.title = "Zoom x" + SA_zoom + ((SA_zoom_filterType == "bilinear") ? ' / Bilinear Sizing' : '') + " (click to change)"
  }
}

function FullSpectrum_toggle() {
  filter_objs[filter_switch_index].use_full_spectrum = !filter_objs[filter_switch_index].use_full_spectrum

  if (filter_mouseover)
    filter_mouseover()
}

function Filter_onload(obj) {
  if (obj.filter_enabled)
    return

  obj.filter_enabled = true

  var css = obj.filter_css
  if (css.charAt(0) == " ") {
    Filter_onunload_core()
    eval(css)
  }
  else {
    if (document.getElementById("Lmatrix_rain"))
      Lmatrix_rain.style.visibility = "hidden"
    document.getElementById(filter_id).style.filter = css
  }

  filter_index = filter_switch_index
  filter_initialized = false
  filter_u_last = 0
}

function Filter_onunload_core() {
  var f_obj = document.getElementById(filter_id)
  if (f_obj.style.filter) {
    var f = f_obj.filters
    for (var i = 0; i < f.length; i++) {
      try {
        f_obj.filters[i].enabled = 0
      }
      catch (err) {}
    }
  }
}

function Filter_onunload(obj) {
  if (!obj.filter_enabled)
    return

  obj.filter_enabled = false

  Filter_onunload_core()

  if (document.getElementById("Lmatrix_rain")) {
    Lmatrix_rain.style.visibility = "hidden"
    if (ie9_mode)
      document.getElementById(filter_id).style.opacity = 1
  }

  obj.onfinish()
}

function PreloadGallery_Toggle() {
  System.Gadget.Settings.writeString("PreloadGalleryAlways", ((gallery_preload_always) ? "" : "1"))

  SA_Reload()
}

function filter_name_toggle() {
  if (FilterRandom.filter_enabled)
    return

  if (++filter_switch_index >= filter_objs.length)
    filter_switch_index = 0

  if (filter_mouseover)
    filter_mouseover()
}

function filter_status_toggle(forced_status, forced_update) {
  var keep_status = (forced_status != null)

  var obj = (!keep_status && FilterRandom.filter_enabled) ? FilterRandom : filter_objs[filter_switch_index]
  var filter_on = (keep_status) ? forced_status : !obj.filter_enabled

  if (!keep_status && (obj.filter_name == "Random")) {
    if (filter_on) {
      FilterRandom.filter_enabled = true
      filter_mouseover()

      FilterRandom.onstart()
    }
    else {
      FilterRandom.onfinish()

      filter_switch_index = FilterRandom.index
      filter_mouseover()
    }
    return
  }

  if (filter_on) {
    if (filter_objs.length > 1)
      Lmain_animation.style.backgroundColor = "gray"

    Filter_onunload(filter_objs[filter_index])

    if (forced_update)
      obj.filter_enabled = false
    Filter_onload(obj)
  }
  else {
    if (filter_objs.length > 1)
      Lmain_animation.style.backgroundColor = "transparent"

    Filter_onunload(obj)
  }

  if (BG_draw_func == BG_Basic)
    BG_Basic()

  if (keep_status)
    return

  if (filter_mouseover)
    filter_mouseover()
}

// Random filter START
var FilterRandom = {
   filter_name:"Random"
  ,init: function () {

if (SEQ_mode)
  self.EV_SEQ_refresh = function () { FilterRandom.update() }
else if (use_MMG)
  self.EV_MMG_refresh = function () { FilterRandom.update() }
else {
  this.gallery_refresh_count = 1

  if (!EV_AnimateFrame) {
    EV_AnimateFrame = function (pic, w,h) {
if (--FilterRandom.gallery_refresh_count <= 0) {
  FilterRandom.gallery_refresh_count = 10
  FilterRandom.update()
}

return {pic:pic, w:w, h:h}
    }
  }
}

  }
  ,onfinish: function () {
FilterRandom.filter_enabled = false
filter_status_toggle(false)
  }

// misc
  ,FilterOFF: {
 filter_name:"OFF"
,index:-1
  }

  ,onstart: function () {

FilterRandom.filter_enabled = true

if (!this.filters) {
  this.filters = filter_objs.slice(0, -1)
  if (use_blank_filter)
    this.filters.push(this.FilterOFF)
}

this.filter_index = 999
this.update_count = 2 + random(3)
filter_switch_index = filter_index

  }

  ,update: function () {
if (!FilterRandom.filter_enabled)
  return
if (--this.update_count > 0)
  return

this.update_count = 2 + random(3)

if (++this.filter_index >= this.filters.length) {
  this.filters.sort(random_sorting)
  this.filter_index = 0

  if ((filter_index == this.filters[0].index) || (!filter_objs[filter_index].filter_enabled && (this.filters[0].index == -1)))
    this.filters.swap(0, 1+random(this.filters.length-1))
}

var f = this.filters[this.filter_index]
var status
if (f.filter_name == "OFF") {
  status = false
  if (filter_switch_index == FilterRandom.index)
    filter_switch_index = 0
}
else {
  status = true
  filter_switch_index = f.index
}

filter_status_toggle(status)

  }
}
// Random filter END


if (ValidatePath(Settings.f_path + '\\filter_option.js'))
  document.write(SystemEXT.ReadJS(Settings.f_path + '\\filter_option.js', true))


if (use_SA_browser_mode)
  use_spotlight = use_motionblur = use_ghosting = false
if (use_all_filters) {
  use_spotlight = (use_spotlight != false)
  use_motionblur = (use_motionblur != false)
  use_matrix = (use_matrix != false)
  use_ghosting = (use_ghosting != false)
  use_EQ_filter = (use_EQ_filter != false)
}
if (self.use_spotlight)
  document.write('<script language="JavaScript" src="js_filters/spotlight.js"></scr'+'ipt>')
if (self.use_motionblur)
  document.write('<script language="JavaScript" src="js_filters/motionblur.js"></scr'+'ipt>')
if (self.use_matrix)
  document.write('<script language="JavaScript" src="js_filters/matrix.js"></scr'+'ipt>')
if (self.use_ghosting)
  document.write('<script language="JavaScript" src="js_filters/ghosting.js"></scr'+'ipt>')
if (self.use_EQ_filter)
  document.write('<script language="JavaScript" src="js_filters/EQ.js"></scr'+'ipt>')


if (self.use_MMG)
  document.write('<script language="JavaScript" src="js_filters/mmg.js"></scr'+'ipt>')
