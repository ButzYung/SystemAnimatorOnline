// Picture Frame - StickyPic (scalable)
/*
Credits:
- Some images borrowed from "StickyPic 1.1" by Wrecklaimer (shared under "Creative Commons Attribution-Noncommercial-Share Alike 3.0 Generic" license)
  http://wrecklaimer.deviantart.com/art/StickyPic-1-1-190445156
*/


// turn it on by default (for non-child animation)
EQP_gallery_append_mode = !is_SA_child_animation

Settings_default._custom_.Display = "-1"
if (use_SA_browser_mode && !is_SA_child_animation)
  Settings_default._custom_.WallpaperAsBG = "non_default"


var EV_width = 496
var EV_height = 332
var EQP_ref_width = 496
var EQP_ref_height = 332
var EQP_parts_path = 'parts'

//var EQP_allow_resize = true;
//var EQP_SS_interval = 30


var EQP_ps = [
   {src:"bg_491x316", o_min:66,o_max:66, use_HTML_IMG:use_Silverlight}

  ,{src:"_dummy_img",xy:"491x316", o_min:-1
    ,gallery:{path:Settings.f_path_folder+"\\gallery", para:{w:480,h:304, mask:"bg_491x316"
//,RE_items:/misc_wall_.+_2\.(jpg|png)$/i
     }}
    ,dragdrop:{w:480,h:304, mask:"bg_491x316"}
   }

  ,{src:"frame_T_496x332", o_min:-1}
  ,{src:"frame_L_496x300", o_min:-1}
  ,{src:"frame_B_496x32",  o_min:-1}
  ,{src:"frame_R_32x300",  o_min:-1}

  ,{src:"sticker_296x332", o_min:-1}

  ,{src:"_dummy_img", x:496-491+480/2-32, y:332-316+304/2-32, o_min:75, o_max:75 }
]


if (use_EQP_fireworks) {
  var CanvasEffect_options = {
  chosen_gravity:0

 ,vector_z_func: function () { return (Math.random() * -10) }

 ,icon: 2
  }
}

var Facebook_SA_frame_mode = true
var Facebook_SA_icon_index = 7


// Core
document.write('<script language="JavaScript" src="js/EQP.js"></scr'+'ipt>');
