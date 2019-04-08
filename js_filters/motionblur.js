// Motion Blur v1.4.6

var Motionblur = {
   filter_name: "Motionblur"
  ,filter_enabled: false
  ,filter_css: "progid:DXImageTransform.Microsoft.MotionBlur(direction=" + 270 + ", enabled=0)"

  ,u_decay_factor: 0.2
  ,EV_usage_PROCESS: Filter_EV_usage_PROCESS

// Misc
  ,direction: 270
  ,str_max: 20
  ,EV_frame_offsetX: -1
  ,EV_frame_offsetY: -1
}


// Core
Motionblur.init = function () {
  Lmain_obj.style.pixelWidth  = EV_width
  Lmain_obj.style.pixelHeight = EV_height
  Lmain_obj.style.overflow = "hidden"
}

Motionblur.frame = function () {
  if (!Motionblur.filter_enabled)
    return

  var d = new Date()
  var t = d.getTime()
/*
  var t_diff = t - EV_last_update_time
  if (t_diff > 1000)
    t_diff = 1000
*/
  EV_last_update_time = t


  var u_temp = EV_usage_float
  if (EV_usage_sub && EV_usage_sub.BD)
    EV_usage_float = EV_usage_sub.BD.beat * 100
  var u = Motionblur.EV_usage_PROCESS(self)
  EV_usage_float = u_temp

  var uu = (filter_fps_fixed) ? u*0.9+0.1 : (10+1)/(SEQ_fps_end+SEQ_fps_ini)


  var motionblur = document.getElementById(filter_id).filters.item("DXImageTransform.Microsoft.MotionBlur")

  if (!filter_initialized) {
    motionblur.enabled = 1
    Lmain_obj.style.backgroundColor = "black"
    if (filter_id != "Lmain_animation")
      document.getElementById(filter_id).style.backgroundColor = "black"

    filter_initialized = true
  }

  Motionblur.direction += 45 * uu
  if (Motionblur.direction >= 360)
    Motionblur.direction -= 360

  var dir = parseInt(Motionblur.direction / 45) * 45
  motionblur.direction = dir

  var x_offset, y_offset
  if (dir == 0) {
    x_offset = 0
    y_offset = -1
  }
  else if (dir == 45) {
    x_offset = 0
    y_offset = -1
  }
  else if (dir == 90) {
    x_offset = 0
    y_offset = 0
  }
  else if (dir == 135) {
    x_offset = 0
    y_offset = 0
  }
  else if (dir == 180) {
    x_offset = 0
    y_offset = 0
  }
  else if (dir == 225) {
    x_offset = -1
    y_offset = 0
  }
  else if (dir == 270) {
    x_offset = -1
    y_offset = 0
  }
  else if (dir == 315) {
    x_offset = -1
    y_offset = -1
  }

  var str = (u*1.0+0.0) * Motionblur.str_max
  if (dir % 2)
    str =  Math.sqrt(str * str / 2)
  str = Math.round(str)

  if (Motionblur.EV_frame_offsetX == -1) {
    Motionblur.EV_frame_offsetX = EV_frame_offsetX
    Motionblur.EV_frame_offsetY = EV_frame_offsetY
  }

  EV_frame_offsetX = Motionblur.EV_frame_offsetX + str * x_offset + ((x_offset && (str)) ? -x_offset : 0)
  EV_frame_offsetY = Motionblur.EV_frame_offsetY + str * y_offset + ((y_offset && (str)) ? -y_offset : 0)
  if (filter_fps_fixed) {
    var ds = document.getElementById(filter_id).style
    ds.posLeft = EV_frame_offsetX
    ds.posTop  = EV_frame_offsetY
  }

  motionblur.strength = str
}

Motionblur.onfinish = function () {
  Lmain_obj.style.backgroundColor = "transparent"

  EV_frame_offsetX = Motionblur.EV_frame_offsetX
  EV_frame_offsetY = Motionblur.EV_frame_offsetY
  if (filter_fps_fixed) {
    var ds = document.getElementById(filter_id).style
    ds.posLeft = EV_frame_offsetX
    ds.posTop  = EV_frame_offsetY
  }
}
