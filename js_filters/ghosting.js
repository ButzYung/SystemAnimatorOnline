// Ghosting (v1.0.4)

var Ghosting = {
   filter_name: "Ghosting"
  ,filter_enabled: false
  ,filter_css: "progid:DXImageTransform.Microsoft.Alpha(enabled=0) progid:DXImageTransform.Microsoft.Compositor()"

  ,u_decay_factor: 0.2
  ,EV_usage_PROCESS: Filter_EV_usage_PROCESS

// Misc
  ,opacity_max: 50
}


// Core
Ghosting.init = function () {
  Ghosting.frame_final_locked = true
  Ghosting.opacity_max = (use_MMG || (gallery.length <= 1)) ? 33 : 50
}

Ghosting.frame = function () {
  if (!Ghosting.filter_enabled)
    return

  var d = new Date()
  var t = d.getTime()
  EV_last_update_time = t


//  var u_temp = EV_usage_float
//  if (EV_usage_sub && EV_usage_sub.BD)
//    EV_usage_float = EV_usage_sub.BD.beat * 100
  var u = Ghosting.EV_usage_PROCESS(self)
//  EV_usage_float = u_temp

  // Save unnecessary CPU usage
  if (u < 0.1) {
    if (Ghosting.u_last == 0) {
      Ghosting.frame_final_locked = true
      return
    }
    // Clear any residual image
    u = 0
  }
  Ghosting.u_last = u


  var f_obj = document.getElementById(filter_id)
  var fa = f_obj.filters.item("DXImageTransform.Microsoft.Alpha")
  var fc = f_obj.filters.item("DXImageTransform.Microsoft.Compositor")

  if (!filter_initialized) {
    fc.Function = 4
    filter_initialized = true
  }

  fa.opacity = Ghosting.opacity_max * u
  fa.enabled = 1
  try {
    fc.apply()
    Ghosting.frame_final_locked = false
  }
  catch (err) {}
  fa.enabled = 0
}

Ghosting.frame_final = function () {
  if (!Ghosting.filter_enabled || Ghosting.frame_final_locked)
    return

// Prevent "Ghosting.frame_final()" from running more than once in the same update
  Ghosting.frame_final_locked = true

  try {
    document.getElementById(filter_id).filters.item('DXImageTransform.Microsoft.Compositor').play()
//setTimeout("    document.getElementById(filter_id).filters.item('DXImageTransform.Microsoft.Compositor').play() ", 0)
  }
  catch (err) {}
}

Ghosting.onfinish = function () {
  document.getElementById(filter_id).filters.item('DXImageTransform.Microsoft.Compositor').Function = 0
}
