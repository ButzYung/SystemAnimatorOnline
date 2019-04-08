// EQ filter v1.0.2

var EQ_Filter = {
   filter_name: "EQ Graph"
  ,filter_enabled: false
  ,filter_css: ' EQP_gallery_obj_active.main_container.style.visibility = "inherit";'

//  ,u_decay_factor: 0.2
//  ,EV_usage_PROCESS: Filter_EV_usage_PROCESS

// Misc
  ,EQP_width:  0
  ,EQP_height: 0
}


// Core
EQ_Filter.init = function () {
  use_Silverlight = false
  EQP_EV_init()
}

EQ_Filter.frame = function () {
  if (!EQ_Filter.filter_enabled)
    return

  var d = new Date()
  var t = d.getTime()
/*
  var t_diff = t - EV_last_update_time
  if (t_diff > 1000)
    t_diff = 1000
*/
  EV_last_update_time = t


// Main
  EQP_EV_animate_full()
}

EQ_Filter.onfinish = function () {
  EQP_gallery_obj_active.main_container.style.visibility = "hidden"
}


// scripts
document.write('<script language="JavaScript" src="js/EQP_gallery.js"></scr'+'ipt>')
