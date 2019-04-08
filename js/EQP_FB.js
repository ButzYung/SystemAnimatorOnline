// EQP - Free BG version (v1.6.0)

var EQP_FB_width, EQP_FB_height
var EQP_FB_width_offset, EQP_FB_height_offset
var EQP_FB_x_offset, EQP_FB_y_offset
var EQP_FB_width_divider, EQP_FB_height_divider
var EQP_FB_EQ
var EQP_FB_rotation, EQP_FB_flipH, EQP_FB_flipV
var EQP_FB_o_min, EQP_FB_o_max
var EQP_FB_process_func
var EQP_FB_bg_path

var EQP_FB_use_MT

if (use_EQP_FB)
  EQP_FB_Start()

function EQP_FB_PartName(x, y) {
  return EQP_FB_bg_path + 'b' + addZero(x) + '-' + addZero(y) + '_' + (EQP_FB_width/EQP_FB_width_divider * (EQP_FB_width_divider-x) + EQP_FB_width_offset) + 'x' + (EQP_FB_height/EQP_FB_height_divider * (y+1) + EQP_FB_height_offset)
}

function EQP_FB_ProcessFunc(part, b,r) {
  part.o_min = EQP_FB_o_min
  part.o_max = EQP_FB_o_max

  part.u_min = parseInt((r / row_max) * 100)
  part.u_max = parseInt(((r+1) / row_max) * 100)

//  part.decay_factor = EQP_decay_factor + r*0.1
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

var bar_max, row_max

function EQP_FB_Start() {
  // defaults
  if (EQP_FB_width == null)
    EQP_FB_width = EV_width
  if (EQP_FB_height == null)
    EQP_FB_height = EV_height
  if (EQP_FB_width_offset == null)
    EQP_FB_width_offset = 0
  if (EQP_FB_height_offset == null)
    EQP_FB_height_offset = 0
  if (EQP_FB_width_divider == null)
    EQP_FB_width_divider = 7
  if (EQP_FB_height_divider == null)
    EQP_FB_height_divider = 7

  EQP_FB_AdjustRotation()

  if (EQP_FB_EQ == null) {
    var divider = (EQP_FB_rotation % 180) ? EQP_FB_height_divider : EQP_FB_width_divider
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

  if (EQP_FB_o_min == null)
    EQP_FB_o_min = 0
  if (EQP_FB_o_max == null)
    EQP_FB_o_max = 99

  if (EQP_FB_process_func == null)
    EQP_FB_process_func = EQP_FB_ProcessFunc

  if (EQP_FB_bg_path == null)
    EQP_FB_bg_path = ""
  EQP_FB_bg_path += "\\"
  //END


  var parts = []

  if (EQP_FB_rotation == 0) {
    bar_max = EQP_FB_width_divider
    row_max = EQP_FB_height_divider
  }
  else {
    bar_max = EQP_FB_height_divider
    row_max = EQP_FB_width_divider
  }

  for (var b = 0; b < bar_max; b++) {
    for (var r = 0; r < row_max; r++) {
      var g_EQ = EQP_FB_EQ[b]
      if (!g_EQ)
        continue

      var part = {}

      if (EQP_FB_rotation == 90)
        part.src = EQP_FB_PartName(((EQP_FB_flipH) ? (row_max - r-1) : r), ((EQP_FB_flipV) ? b : (bar_max - b-1)))
      else
        part.src = EQP_FB_PartName(((EQP_FB_flipH) ? (bar_max - b-1) : b), ((EQP_FB_flipV) ? (row_max - r-1) : r))

      part.g_EQ = [g_EQ]

      EQP_FB_process_func(part, b,r)

      if (EQP_FB_x_offset)
        part.x_offset = EQP_FB_x_offset
      if (EQP_FB_y_offset)
        part.y_offset = EQP_FB_y_offset

      parts.push(part)
    }
  }

  EQP_ps = EQP_ps_head.concat(parts, EQP_ps_tail)


// mouseover tracking
  if (!EQP_FB_use_MT)
    return

  EQP_init_extra = function () {
MT_onmouseover = function () { if (EQP_ps[0].img) EQP_ps[0].img.opacity = 100; }
MT_onmouseout  = function () { if (EQP_ps[0].img) EQP_ps[0].img.opacity = EQP_ps[0].o_min; }

EQP_animate_extra = function () { document.fireEvent("onclick") }
MT_initialized = true
MT_init()
  }
  document.write('<script language="JavaScript" src="js/mouseover_tracking.js"></script>');
}
