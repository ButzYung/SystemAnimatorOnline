// Windows Media Player control for Silverlight animation (v1.6.1)

var WMP_left, WMP_top, WMP_width, WMP_height
var WMP_mask, WMP_wallpaper_mask
var WMP_hidden
var WMP_func_extra

var C_WMP_wallpaper_mask

var WMP = {
   player:null
  ,div:null
  ,src:""
  ,in_use:false

  ,dragdrop_RE_array: ["wav","mp3","ogg","aac","wma","avi","mpg","rmvb","mkv","wmv","mp4"]
  ,hiding_timerID:null

  ,show: function () {
DEBUG_show('(WMP Start)', 2)

this.in_use = this.player.enabled = true
if (!WMP_hidden)
  this.div.style.visibility = "inherit"
this.resize()

//SL_Host.style.visibility = "hidden"

if (WMP_mask)
  SL_root.FindName('content_mask').ImageSource = toFileProtocol(WMP_mask)

System._browser.update_tray()

if (WMP_func_extra)
  WMP_func_extra()
   }

  ,hide: function () {
DEBUG_show('(WMP End)', 2)

try { WMP.player.controls.stop() } catch (err) {}
this.hiding_clear()
SL_root.FindName("C_media_control").Visibility = "Collapsed"

this.in_use = this.player.enabled = false
this.div.style.visibility = "hidden"
this.resize()

if (WMP_mask)
  SL_root.FindName('content_mask').ImageSource = null

if (WMP_func_extra)
  WMP_func_extra()
   }

  ,hiding: function () {
this.hiding_clear()
this.hiding_timerID = setTimeout('WMP.hiding_timerID=null; WMP.hide();', 5000)
   }

  ,hiding_clear: function () {
if (this.hiding_timerID) {
  clearTimeout(this.hiding_timerID)
  this.hiding_timerID = null
}
   }

  ,load: function (item) {
var src = item.path
this.src = src

EQP_Hide_Video()

if (this.player) {
  this.show()

  if (this.createAudioObject)
    this.createAudioObject()

  this.player.URL = src
  return
}

if (WMP_hidden) {
  WMP_left = WMP_top = 0
  WMP_width = WMP_height = 130
  WMP_mask = null
}
else {
  if (!WMP_left)
    WMP_left = 0
  if (!WMP_top)
    WMP_top = 0
  if (!WMP_width)
    WMP_width  = (self.EQP_gallery_obj_active) ? (EQP_gallery_obj_active.w_org - EQP_gallery_obj_active.x_offset*2) : EQP_SL_w
  if (!WMP_height)
    WMP_height = (self.EQP_gallery_obj_active) ? (EQP_gallery_obj_active.h_org - EQP_gallery_obj_active.y_offset*2) : EQP_SL_h
}

var div
div = this.div = document.createElement("div")
var ds = div.style
ds.position = "absolute"
ds.posLeft = 0
ds.posTop = 0
ds.zIndex = 1
ds.overflow = "hidden"
//ds.backgroundColor = "gray"
document.body.appendChild(div)

var html =
   '<object id="WMP_player" ' + ((xul_mode) ? 'type="application/x-ms-wmp"' : 'classid="CLSID:6BF52A52-394A-11d3-B153-00C04F79FAA6"') + ' '
+ 'style="position:absolute; top:0px; left:0px">\n'
+ '<PARAM name="autoStart" value="true">\n'
+ '<PARAM name="windowlessVideo" value="true">\n'
+ '<PARAM name="uiMode" value="' + ((WMP_hidden) ? "invisible" : "none") + '">\n'
+ '<PARAM name="stretchToFit" value="true">\n'
+ '<PARAM name="URL" value="' + src + '">\n'
+ '</object>'

if (w3c_mode || (WMP_hidden && use_SA_browser_mode)) {
  WMP_mask = null
  if (WMP_mask) {
    var mask_path = (EQP_parts_path) ? EQP_parts_path + '\\' : 'mask\\';
    WMP_mask = Settings.f_path + '\\' + mask_path + WMP_mask + '.png';
  }

var player = this.player = {
  audio_obj: null
 ,settings: {}
 ,controls: {}
}

var settings = player.settings
var controls = player.controls

Object.defineProperty(player, "playState", {
  get: function () {
if (this.audio_obj.paused)
  return (this.audio_obj.currentTime) ? 2 : 1
return 3
  }
})

Object.defineProperty(player, "URL", {
  get: function () { return this._URL }
 ,set: function (v) {
this._URL = v
player.audio_obj.src = toFileProtocol(v)
  }
})

Object.defineProperty(settings, "mute", {
  get: function () { return player.audio_obj.muted }
 ,set: function (v) { player.audio_obj.muted = v }
})

Object.defineProperty(settings, "volume", {
  get: function () { return player.audio_obj.volume * 100 }
 ,set: function (v) { player.audio_obj.volume = v/100 }
})

Object.defineProperty(controls, "currentPosition", {
  get: function () { return player.audio_obj.currentTime }
 ,set: function (v) { player.audio_obj.currentTime = v }
})

controls.play  = function () { player.audio_obj.play() }
controls.pause = function () { player.audio_obj.pause() }
controls.stop  = function () {
  player.audio_obj.pause()
  player.audio_obj.currentTime = 0
  WMP.PlayStateChange(1)
}

var d_dummy = document.createElement("div")
d_dummy.id = "WMP_player"
var ds = d_dummy.style
ds.position = "absolute"
ds.display = "none"
document.body.appendChild(d_dummy)

this.createAudioObject = function () {
  var ao
  if (WallpaperEngine_CEF_mode && !browser_native_mode) {
    ao = player.audio_obj = new Aurora.WebAudio()
    ao.AV_init && ao.AV_init(item.obj.obj.file)
  }
  else
    ao = player.audio_obj = document.createElement("audio")
  ao.autoplay = true

//  ao.addEventListener("loadstart", function (e) {
//  }, true)

  ao.addEventListener("canplaythrough", function (e) {
if (self.AudioFFT) {
  AudioFFT.connect(this)
}
  }, true)

  ao.addEventListener("playing", function (e) {
WMP.PlayStateChange(3)
  }, true)

  ao.addEventListener("ended", function (e) {
//1=stopped, 8=media end
WMP.PlayStateChange(8)
  }, true)

  ao.addEventListener("timeupdate", function (e) {
SL_MC_Timeupdate(this)
  }, true);

  if (!self.AudioFFT)
    this.createAudioObject = null
}

this.createAudioObject()
player.URL = src

  this.show()
  return

}
else
  div.innerHTML = html
   }

  ,resize: function () {
if (!WMP.in_use)
  return

var ws = WMP.div.style
var ss = SL_Host_Parent.style
ws.pixelWidth  = ss.pixelWidth
ws.pixelHeight = ss.pixelHeight
ws.posLeft = ss.posLeft
ws.posTop  = ss.posTop

var zoom = (SA_zoom != 1) ? SA_zoom : EQP_size_scale

var ps = WMP_player.style
ps.left = Math.round(WMP_left * zoom) + "px"
ps.top  = Math.round(WMP_top  * zoom) + "px"
ps.width  = Math.round(WMP_width  * zoom) + "px"
ps.height = Math.round(WMP_height * zoom) + "px"
   }

// events
  ,dragdrop: function(item, no_default) {
var src = item.path
if (item.isFileSystem && WMP.dragdrop_RE.test(src)) {
  if (!SL_windowless) {
    DEBUG_show('(WMP not supported in Windowed mode)', 5)
    return false
  }

  WMP.audio_child_list = null

  if (ie9_mode) {
    var audio_child_list = []
    var first_child = true
    var first_child_audio_obj
    for (var i = 0; i < SA_child_animation_max; i++) {
      if (!SA_child_animation[i])
        continue

      var w = document.getElementById("Ichild_animation" + i).contentWindow
      var vo = w.EQP_video_options
      if (!vo || !vo.BPM)
        continue

      audio_child_list.push(i)

      if (first_child) {
        first_child = false

        WMP.audio_child_starting = true

        if (!vo.audio_obj_WMP) {
          vo.audio_obj_WMP = new WMP.audio_child_WMP()
        }
        first_child_audio_obj = vo.audio_obj = vo.audio_obj_WMP

        if (!DragDrop.onDrop_finish_BPM) {
          WMP.audio_child_onDrop_finish_BPM = function (w,v,vo) {
w.DragDrop.onDrop_finish_BPM(item)
          }

         DragDrop.onDrop_finish_BPM = function (item) {
WMP.audio_child_func(WMP.audio_child_onDrop_finish_BPM)
WMP.load(item)
          }
        }

        setTimeout(function () {w.DragDrop.onDrop_finish(item, true)}, 0)
      }
      else {
        vo.audio_obj = vo.audio_obj_WMP = first_child_audio_obj
      }

      // to make "WMP.audio_child_func" work
      vo.BPM_mode = true
    }

    if (audio_child_list.length) {
      WMP.audio_child_list = audio_child_list
    }
  }

  if (!WMP.audio_child_list)
    WMP.load(item)

  return true
}

if (no_default)
  return false
DragDrop_install(item)
   }


  ,play: function () {
if (WMP.audio_child_list)
  WMP.audio_child_func(WMP.audio_child_play)

if (WMP.player.playState == 3)
  WMP.player.controls.pause()
else
  WMP.player.controls.play()
   }

  ,stop: function () {
WMP.player.controls.stop()
   }

  ,sound: function () {
if (WMP.audio_child_list)
  WMP.audio_child_func(WMP.audio_child_sound)
else
  WMP.player.settings.mute = !WMP.player.settings.mute
   }


  ,audio_child_WMP: function () {
if (!this._constructor_initialized) {
  this.constructor.prototype._constructor_initialized = true

  this.constructor.prototype.is_linked = true
  this.constructor.prototype.linked_play  = WMP.play
  this.constructor.prototype.linked_stop  = WMP.stop
  this.constructor.prototype.linked_sound = WMP.sound

  Object.defineProperty(this.constructor.prototype, "currentTime",
{
  get: function() {
return WMP.player.controls.currentPosition
  }
});
}
   }

  ,audio_child_func: function (func) {
var audio_child_list = this.audio_child_list
for (var k = 0; k < audio_child_list.length; k++) {
  var i = audio_child_list[k]
  if (!SA_child_animation[i])
    continue

  var w  = document.getElementById("Ichild_animation" + i).contentWindow
  var vo = w.EQP_video_options
  if (!vo.BPM_mode)
    continue

  var v  = w.EQP_gallery_obj_active.imgs[0].img_obj_v
  func(w,v,vo)
}
   }

  ,audio_child_onplaying: function (w,v,vo) {
if (v.paused)
  v.play()

vo.onstart_sync && vo.onstart_sync()

w.DEBUG_show("Audio:START", 2)
   }

  ,audio_child_play: function (w,v,vo) {
if (v.paused)
  v.play()
else {
  v.pause()
  vo._beat_reference_realtime = null
}
   }

  ,audio_child_stop: function (w,v,vo) {
v.pause()

if (vo.SEQ_mode && vo.SEQ_gallery)
  w.SL_MC_Seek(-1, true)
else
  v.currentTime = 0

vo.audio_onended()
vo.audio_obj = null
   }

  ,audio_child_sound: function (w,v,vo) {
w.EQP_SyncBPM_Auto(v,vo)
   }


  ,OpenStateChange: function (NewState) {
//DEBUG_show(NewState,0,1); return;
if (this.player)
  return

this.player = WMP_player
this.player.settings.volume = 100

if (WMP_mask) {
  var mask_path = (EQP_parts_path) ? EQP_parts_path + '\\' : 'mask\\';
  WMP_mask = Settings.f_path + '\\' + mask_path + WMP_mask + '.png';
}

this.show()
   }

  ,PlayStateChange: function (NewState) {
//DEBUG_show(NewState,0,1); return;
// Fixing a strange bug in IE8/9 documnt mode
if (ie8_mode)
  setTimeout('WMP.resize()', 0)

if (NewState == 1 || NewState == 8) {
  if (WMP.audio_child_list) {
    WMP.audio_child_func(WMP.audio_child_stop)
    WMP.audio_child_list = null
  }
  WMP.hiding()
}
else {
  if (NewState == 3) {
    if (WMP.audio_child_starting) {
      WMP.audio_child_func(WMP.audio_child_onplaying)
      WMP.audio_child_starting = false
    }
  }
  WMP.hiding_clear()
}
   }

  ,dragdrop_init: function () {
var dragdrop_RE_array = ["wav","mp3","ogg","aac","wma","avi","mpg","rmvb","mkv"]
DragDrop_RE = eval('/\\.(' + dragdrop_RE_array.concat(DragDrop_RE_default_array).join("|") + ')$/i')

if (self.EQP_dragdrop_target || self.EQP_dragdrop_obj)
  WMP.dragdrop_RE = eval('/\\.(' + dragdrop_RE_array.join("|") + ')$/i')
else
  DragDrop.onDrop_finish = WMP.dragdrop
   }

  ,init: function () {
this.dragdrop_RE = eval('/\\.(' + this.dragdrop_RE_array.join("|") + ')$/i')

// WMP wallpaper mask
if (!WMP_wallpaper_mask)
  WMP_wallpaper_mask = WMP_mask

if (use_HTML5 && WMP_wallpaper_mask) {
  var img = new Image()

  img.onload = function () {
var w = this.width
var h = this.height

C_WMP_wallpaper_mask = document.createElement("canvas")
C_WMP_wallpaper_mask.width  = w
C_WMP_wallpaper_mask.height = h

var context = C_WMP_wallpaper_mask.getContext("2d")
context.drawImage(this, 0,0)
/*
var image_data = context.getImageData(0,0, w,h)
var data = image_data.data
for (var a = 3, a_max = data.length; a < a_max; a+=4) {
  var alpha = 255 - data[a]

  data[a] = alpha
}
context.putImageData(image_data, 0,0)
*/
  }

  img.src = toFileProtocol(Settings.f_path + '\\' + ((EQP_parts_path) ? EQP_parts_path + '\\' : 'mask\\') + WMP_wallpaper_mask + '.png')
}
  }
}

WMP.init()
