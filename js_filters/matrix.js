/*

Matrix Rain CORE (v3.3.4)
Homepage: http://www.animetheme.com/

*/

// System Animator core START
var EV_init2

var EV_frame
//var EV_adjust_timer = true
var EV_last_update_time = 0

var EV_timerID
var EV_ms_last = 0
var EV_fps_ini = 1
var EV_fps_end = 30
// System Animator core END


// Matrix filter START

var Matrix = {
   filter_name: "Matrix"
  ,filter_css: ' Lmatrix_rain.style.visibility="inherit"; if (use_MMG) { MMG_BG_opacity_base=40 } else { if (ie9_mode) {document.getElementById(filter_id).style.opacity=0.4} else { document.getElementById(filter_id).style.filter="progid:DXImageTransform.Microsoft.Alpha(opacity=40)"; document.getElementById(filter_id).filters.item("DXImageTransform.Microsoft.Alpha").enabled=1 }}; if (Matrix.matrix_fps_fixed) { Seq.item("MatrixDigitalRain").Play() }'
  ,filter_enabled: false

  ,u_decay_factor: 0.2
  ,EV_usage_PROCESS_core: Filter_EV_usage_PROCESS
  ,EV_usage_PROCESS: function (u, mod) {
    if (!mod)
      mod = 1
    u = this.EV_usage_PROCESS_core(u, mod)

    var median = 0.5
    if (u > median)
      u = Math.pow((u-median)/(1-median), 0.415) * (1-median) + median
    else
      u = Math.pow(u/median, 2) * median

    return u
  }

  ,frame: function () {}
  ,onfinish: function () {
if (Matrix.matrix_fps_fixed)
  Seq.item("MatrixDigitalRain").Pause()
MMG_BG_opacity_base=100
  }

//misc
  ,matrix_fps_fixed: true
  ,x_move_remainder: []

  ,filter_fps_varied: true
  ,use_full_spectrum: true
}

Matrix.dim_calculate = function () {
  if (use_MMG) {
    if (!matrix_width)
      matrix_width = matrix_x_max * matrix_grid_dim + matrix_x_split
    if (!matrix_height)
      matrix_height = matrix_y_max * matrix_grid_dim
  }
  else {
    if (!matrix_width) {
      matrix_width = w_max
      matrix_x_max = parseInt(matrix_width / matrix_grid_dim)
    }
    if (!matrix_height) {
      matrix_height = h_max
      matrix_y_max = parseInt(matrix_height / matrix_grid_dim)
    }
  }

  if (!self.EV_width)
    EV_width_no_init = true
  if (!self.EV_height)
    EV_height_no_init = true

  if (EV_width_no_init)
    EV_width = matrix_width + matrix_content_x*2
  if (EV_height_no_init)
    EV_height = matrix_height + matrix_content_y*2
}

if (!BG_dim_calculate)
  BG_dim_calculate = Matrix.dim_calculate

Matrix.init = function () {
  var matrix_msg_c = []
  for (var i = 0; i < matrix_msg.length; i++)
    matrix_msg_c[i] = matrix_msg.charAt(i)

  for (var x = 0; x < matrix_x_max; x++) {
    var c = matrix_msg_c.sort(sort_random)

    var msg = ''
    var c_count = 0
    while (msg.length < matrix_y_max)
      msg += (matrix_phrase.length && (Math.random() < 0.2)) ? '*' + matrix_phrase[Math.floor(Math.random() * matrix_phrase.length)] + '*' : c[c_count++]

    var grid = []
    for (var i = 0; i < msg.length; i++)
      grid[i] = msg.charAt(i)

    matrix_grid[x] = grid
    matrix_rain[x] = Math.floor(Math.random() * (matrix_y_max + (matrix_trail+2))) - (matrix_trail+2)
  }

  if (Matrix.filter_enabled && !BG_draw_func)
    BG_draw_func = BG_AddBlackhole

  EV_frame = Matrix.animate_frame

  if (self.MM_init)
    MM_init()


  if (Matrix.matrix_fps_fixed) {
    if (!Seq.item("MatrixDigitalRain").initialized)
      Seq.item("MatrixDigitalRain").At(0.05, "EV_frame", -1, 1/30*Seq_speed_delay)
  }
  else {
    try {
      if (EV_timerID)
        clearTimeout(EV_timerID)
    }
    catch (ex) {}
    EV_timerID = setTimeout('EV_frame()', 50)
  }
}

Matrix.animate_frame = function () {
  var d = new Date()
  var t = d.getTime()
  EV_last_update_time = t

  var u = EV_usage_float / 100

  var fps = EV_fps_ini + u * (EV_fps_end - EV_fps_ini)
  var ms = parseInt(1000 / fps)
  EV_ms_last = ms

  if (!Matrix.matrix_fps_fixed) {
    try {
      if (EV_timerID)
        clearTimeout(EV_timerID)
    }
    catch (ex) {}
    EV_timerID = setTimeout('EV_frame()', ms)
  }

  if (!Matrix.filter_enabled)
    return


  var update_rain
  var use_full_EQ = (EV_usage_sub && EV_usage_sub.sound_raw && Matrix.use_full_spectrum)
  if (!use_full_EQ) {
    var f_u_last = self.filter_u_last
    u = Matrix.EV_usage_PROCESS(self)
    update_rain = (Math.abs(f_u_last - self.filter_u_last) > 0.1)
  }

  var x_max = matrix_x_max * matrix_x_max_factor
  var y_max = matrix_y_max * matrix_y_max_factor

  for (var x = 0; x < x_max; x++) {
     if (use_full_EQ) {
      var obj = EV_usage_sub.sound_raw
      obj = obj[Math.round(obj.length/x_max * x)]

      var f_u_last = obj.filter_u_last
      u = Matrix.EV_usage_PROCESS(obj, Sound_EQBand_mod)
      update_rain = (Math.abs(f_u_last - obj.filter_u_last) > 0.1)
    }

    var move_rain = true
    if (Matrix.matrix_fps_fixed) {
      var x_move = Matrix.x_move_remainder
      var xmr = x_move[x]
      if (!xmr)
        xmr = 0

      var x_fps = EV_fps_ini + u * (EV_fps_end - EV_fps_ini)
      xmr += x_fps/30
      x_move[x] = xmr
      if (xmr < 1) {
        if (!update_rain)
          continue
        move_rain = false
      }
      else
        x_move[x] -= 1
    }

    var color_u = u * (1-matrix_font_opacity_base) + matrix_font_opacity_base
    var c_white = parseInt(255 * color_u)
    var white = "rgb(" + c_white + "," + c_white + "," + c_white + ")"

    var white_marked, white_marked_base
    if (MM_enabled) {
      white_marked_base = parseInt(255*MM_grid_white_lvl)

      c_white = parseInt(c_white * (1-MM_grid_white_lvl) + white_marked_base)
      white_marked = "rgb(" + c_white + "," + c_white + "," + c_white + ")"
    }


    var rain = matrix_rain[x]
    if (move_rain) {
      if (++rain >= y_max)
        rain = -(matrix_trail+2 + Math.floor(Math.random() * matrix_trail))
      matrix_rain[x] = rain
    }

    for (var r = 0; r < matrix_trail+2; r++) {
      var y = rain + r
      if ((y < 0) || (y >= y_max))
        continue

      var grid_marked = (MM_enabled && MM_grid_mark[x][y])
      var color
      if (grid_marked)
        color = (r > matrix_trail) ? white_marked : "rgb(" + white_marked_base + "," + (parseInt((255/matrix_trail*r * color_u) * (1-MM_grid_white_lvl)) + white_marked_base) + "," + white_marked_base + ")"
      else
        color = (r > matrix_trail) ? white : "rgb(" + 0 + "," + parseInt(255/matrix_trail*r * color_u) + "," + 0 + ")"

      var s = document.getElementById("Cmatrix_" + x + "_" + y).style
      s.color = color
      s.visibility = ((r == 0) && !grid_marked) ? "hidden" : "inherit"
    }
  }

  if (MM_enabled)
    MM_show()
}

// Misc
Matrix.MM_Toggle = function (isON) {
  System.Gadget.Settings.writeString("UseMM", ((isON) ? "1" : ""))

  SA_Reload()
}


// Old vars
var matrix_phrase = []
var matrix_msg = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890~!@#$%^&*()-_=+`[]{};:?/.,<>\\|"';
var matrix_x_max, matrix_y_max
var matrix_width, matrix_height
var matrix_x_split
var matrix_trail
var matrix_content_x, matrix_content_y
var matrix_grid = []
var matrix_rain = []
var matrix_font_opacity_base = 0.4

var matrix_grid_dim = 10
var matrix_grid_fontSize = "xx-small"
var matrix_x_max_factor = 1
var matrix_y_max_factor = 1

var MM_enabled

matrix_x_max = matrix_y_max = 13
matrix_x_split = 0
matrix_trail = 4
matrix_content_x = matrix_content_y = 0


if (ValidatePath(Settings.f_path + '\\matrix_option.js'))
  document.write(SystemEXT.ReadJS(Settings.f_path + '\\matrix_option.js', true))

if (!MM_enabled && (use_MatrixMeter || (System.Gadget.Settings.readString("UseMM"))))
  document.write('<script language="JavaScript" src="js_filters/matrix_meter.js"></scr'+'ipt>')
