// System Animator core START
var EV_init


if (use_SA_browser_mode && !is_SA_child_animation)
  Settings_default._custom_.WallpaperAsBG = "non_default"


var EV_init_initialized

EV_init = function () {
  if (EV_init_initialized)
    return
  EV_init_initialized = true

// custom action gallery
  SEQ_gallery_by_percent = [
{index:0, SEQ_gallery:[SEQ_gallery_by_name["waking_up"]]},
{index:5, SEQ_gallery:[
SEQ_gallery_by_name["dance"]
]},
{index:90, SEQ_gallery:[SEQ_gallery_by_name["overheated"]]}
  ]
}
