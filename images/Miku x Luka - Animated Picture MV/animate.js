// Vocaloids Yuri (scalable)


Settings_default._custom_.Display = "-1"
if (use_SA_browser_mode) {
  Settings_default._custom_.EventToMonitor = "SOUND_ALL"
  Settings_default._custom_.UpdateInterval = "1"
  Settings_default._custom_.UseAudioFFT = "non_default"
  if (!is_SA_child_animation) {
    Settings_default._custom_.DisableTransparency = "non_default"
  }
}


var EV_width = 720+4
var EV_height = 544+4
var EQP_ref_width = 720+2
var EQP_ref_height = 544+2
var EQP_parts_path = 'parts'

//var EQP_allow_resize = true;

var EQP_ps = [
   {src:"bg_722x546", o_min:-1, use_HTML_IMG:use_Silverlight}

  ,{src:"body_transparent_720x544"}

  ,{src:"_dummy_img",xy:"380x544", o_min:-1, dragdrop:{w:320,h:240, mask:"_video_mask2_b20_320x240", func_extra:"_AdjustAnimation()"}}

  ,{src:"tv01_313x205", g_EQ:[[1]]}
  ,{src:"tv02_114x244", g_EQ:[[2]]}
  ,{src:"tv03_204x381", g_EQ:[[3]]}
  ,{src:"tv04_204x486", g_EQ:[[4]]}

  ,{src:"tv05_98x544",  g_EQ:[[5]]}
  ,{src:"tv06_233x544", g_EQ:[[6]]}
  ,{src:"tv07_377x530", g_EQ:[[7]]}
  ,{src:"tv08_341x426", g_EQ:[[8]]}
  ,{src:"tv09_433x424", g_EQ:[[9]]}
  ,{src:"tv10_529x413", g_EQ:[[10]]}

  ,{src:"tv11_651x362", g_EQ:[[11]]}
  ,{src:"tv12_720x358", g_EQ:[[11]]}
  ,{src:"tv13_672x456", g_EQ:[[12]]}
  ,{src:"tv14_720x544", g_EQ:[[13]]}
  ,{src:"tv15_594x544", g_EQ:[[14]]}
  ,{src:"tv16_443x544", g_EQ:[[14]]}
]


// Misc

function _AdjustAnimation() {
  if (!use_Silverlight)
    return

  var img = EQP_dragdrop_target
  for (var i = 5; i < 5+6; i++) {
    var ps = EQP_ps[i]
    ps.o_max = (img.is_video) ? 66 : 100

    if (ps.img)
      ps.img.IsHitTestVisible = !img.is_video
  }
}


// WMP
var use_WMP = true
var WMP_mask = '_wmp_mask_50-10'
//var WMP_hidden = true


var SVG_Clock_scale = 0.5
var SVG_Clock_x_center = -1
var SVG_Clock_y_center = 1



/*

<Video Overlay Effect>

  Define the following "CANVAS_Video_Overlay" JavaScript object to allow displaying a video (MP4/WebM) over the Animated Picture animation as visual effect, with one or more of the following parameters. Multiple parameters are comma-separated.

- url: This defines the path to the video file/folder, in either relative path and absolute path (eg. "c:\\video\\fire.mp4"). Note that backslash are always doubled. This parameter must be user defined.

- bg_darken_by: This defines how much the Animated Picture is darken before the video effect is applied. Acceptable value is between 0 and 1 (default is 0.5).

- video_alpha: This defines the opacity of the video. Acceptable value is between 0 and 1 (default is 0.75).

- ini_time: This defines the starting position (in second) of the video. Default is 0.

- end_time: This defines the ending position (in second) of the video. When this playback position is reached, it will return to the starting position. Default is the length of the video.

- video_compositeOperation: This defines the composite operation between the video and the animation content. Default is "lighter".

  (Video demo - http://www.youtube.com/watch?v=nXK6PNDCcgc)

*/
/*
var CANVAS_Video_Overlay = {
  url: "video effects\\MULTIfire - video designed by MysticMarks_(720p).mp4"
//url: "C:\\Users\\User\\Downloads\\_DreamScene\\youtube-CNYbDCqtd38_hearts_(720p).mp4"
 ,bg_darken_by: 0.25
}
*/


// Core
document.write('<script language="JavaScript" src="js/EQP.js"></scr'+'ipt>')
