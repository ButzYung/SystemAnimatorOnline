// audio player with BPM support
// (2024-05-18)

var Audio_BPM = {
  audio_obj: null
 ,audio_obj_HTML5: null
 ,audio_obj_WINAMP: null
 ,vo: {}

 ,createPlayer: function (vo, winamp_JSON) {
    var sender = vo._sender
    var ao

    if (winamp_JSON) {
      ao = this.audio_obj = this.audio_obj_WINAMP = {
  is_winamp: true
 ,_JSON: winamp_JSON
 ,autoplay: true
 ,play:  function () {}
 ,pause: function () {}
      }

      Object.defineProperty(ao, "paused",
{
  get: function () {
return !this._JSON.playing
  }
});

      Object.defineProperty(ao, "currentTime",
{
  get: function () {
var obj = this._JSON
//DEBUG_show(((obj.playing) ? Date.now() - obj.time : 0),0,1)
return (obj.pos + ((obj.playing) ? Date.now() - obj.time : 0)) / 1000
  }
});

      Object.defineProperty(ao, "src",
{
  get: function () {
return this._src
  }

 ,set: function (v) {
this._src = v
if (!v)
  return

setTimeout(function () {
// "playing" event
ao._on_playing()
}, 100)
  }
});
    }
    else {
      if (vo._ao_linked) {
ao = this.audio_obj = this.audio_obj_HTML5 = {
  _ao_linked: vo._ao_linked

 ,play:  function () {}
 ,pause: function () {}
 ,addEventListener: function (event_name, func, use_capture) {
    this._ao_linked.addEventListener(event_name, func, use_capture)
  }
}

Object.defineProperty(ao, "paused",
{
  get: function () {
return this._ao_linked.paused;
  }
});

Object.defineProperty(ao, "ended",
{
  get: function () {
return this._ao_linked.ended;
  }
});

Object.defineProperty(ao, "seeking",
{
  get: function () {
return this._ao_linked.seeking;
  }
});

Object.defineProperty(ao, "muted",
{
  get: function () {
return this._ao_linked.muted;
  }
/*
 ,set: function (v) {
this._ao_linked.muted = v;
  }
*/
});

Object.defineProperty(ao, "duration",
{
  get: function () {
return this._ao_linked.duration;
  }
});

Object.defineProperty(ao, "currentTime",
{
  get: function () {
return this._ao_linked.currentTime;
  }
/*
 ,set: function (v) {
this._video.currentTime = v;
  }
*/
});
      }
      else {
/*
if (1) {
  ao = this.audio_obj = this.audio_obj_HTML5 = new AudioCustomSource()
}
else
*/
        if (WallpaperEngine_CEF_mode && !browser_native_mode) {
          ao = this.audio_obj = this.audio_obj_HTML5 = new Aurora.WebAudio()
        }
        else
          ao = this.audio_obj = this.audio_obj_HTML5 = document.createElement("audio")
      }
      ao.autoplay = true
//ao.volume=0.25
      ao.addEventListener("canplaythrough", function (e) {
if (!this._ao_linked && self.AudioFFT) {
  AudioFFT.connect(this)
}
      }, true)

      ao.addEventListener("playing", function (e) {
DEBUG_show("\nNOW PLAYING:<<" + toLocalPath(ao.src).replace(/^.+[\/\\]/, "").replace(/\.\w+$/, "") + ">>\n", 10)
ao._on_playing(e)
      }, true)

      ao.addEventListener("ended", function (e) {
if (!this._ao_linked && Audio_BPM.play_list.play_next())
  return
vo.audio_onended(e)
      }, true)

      ao.addEventListener("timeupdate", function (e) {
SL_MC_Timeupdate(this)
      }, true)
    }

    Object.defineProperty(ao, "beat_reference",
{
  get: function () {
if (!vo.beat_reference)
  return 0

var time = ao.currentTime

var b_list = this.beat_reference_list
var t_index = ~~(this.currentTime/60)
var b_now = b_list[t_index]
var b_min = (t_index) ? b_list[t_index-1] : 99999
var b_max = (t_index < b_list.length-1) ? b_list[t_index+1] : 99999

return [b_now, b_min, b_max].sort(function (a,b) {return Math.abs(a-time) - Math.abs(b-time)})[0]
  }
});

    return ao
  }

 ,findBPM: function (vo) {
    var ao = vo.audio_obj

    if (vo.motion_by_song_name_mode) {
      ao.BPM_by_id3 = 120
      ao.beat_reference_list = [0]
      vo.BPMFinalize()
      return
    }

    ao.beat_reference_list = []

    var sender = vo._sender
    sender.busy = true

    var bpm

if (!WallpaperEngine_CEF_mode || browser_native_mode) {
    var item = DragDrop._item
    var src = item.path

    var f = src.replace(/[\/\\][^\/\\]+$/, "")
    var p = src.replace(/^.+[\/\\]/, "")

    var dir = Shell_OBJ.NameSpace(f);
    var file = dir.ParseName(p)

    try {
      bpm = file.ExtendedProperty("{56A3372E-CE9C-11D2-9F0E-006097C686F6} " + 35)
    }
    catch (err) {}
    ao.BPM_by_id3 = bpm = (bpm) ? parseFloat(bpm) : 0
//ao.BPM_by_id3 = bpm = 0
    var so = ao.song_bpm
    if (!so)
      so = ao.song_bpm = {}

    var doc
    if (!so.xml) {
      if (browser_native_mode) {
//https://stackoverflow.com/questions/14340894/create-xml-in-javascript
        doc = so.xml = document.implementation.createDocument(null, "song_list");
      }
      else {
        doc = so.xml = new ActiveXObject("Microsoft.XMLDOM"); //("msxml2.DOMDocument.6.0");
        doc.async = false;
        doc.resolveExternals = false;
        doc.validateOnParse = false;
        doc.load("TEMP/song_bpm.xml");
      }

      ao.song_bpm_save = function () {
//        if (ao.song_bpm_save_timerID)
//          clearTimeout(ao.song_bpm_save_timerID)
//        ao.song_bpm_save_timerID = setTimeout(function () {
if (!browser_native_mode)
  ao.song_bpm_save_timerID=null; so.xml.save("TEMP/song_bpm.xml"); DEBUG_show("(BPM info saved)", 2);
//        }, 2000)
      }
    }
    doc = so.xml

    so.song = null

    var song
    if (bpm)
      song = doc.selectSingleNode('/song_list/song[filename="' + p + '" and bpm=' + bpm + ']')
    if (!song)
      song = doc.selectSingleNode('/song_list/song[filename="' + p + '" and path="' + encodeURIComponent(f) + '"]')

    if (song) {
      so.song = song
      so.bpm_ref = song.selectSingleNode("bpm_ref")

      var bpm_by_xml = song.selectSingleNode("bpm").text
      if (bpm_by_xml)
        bpm_by_xml = bpm = parseFloat(bpm_by_xml)

      if (bpm) {
        var bpm_ref = so.bpm_ref.text
        if (bpm_ref)
          ao.beat_reference_list = JSON.parse("[" + bpm_ref + "]")
      }
    }
}

    if (!bpm) {
      vo._get_BPM()
    }
    else {
      ao.BPM = bpm

      if (!ao.beat_reference_list.length)
        vo._get_beat_reference()
      else
        vo.BPMFinalize()
    }
  }

 ,checkWinamp: function (vo) {
    if (!returnBoolean("AutoItWinampMode")) return

    var sender = vo._sender

// hide internal media control panel
    EV_SL_Media_MouseEnter = function (sender) {
var ao = sender.vo.audio_obj
return ao.is_winamp
    };

    this._CheckWinamp = function () {
var winamp = vo.audio_obj_WINAMP
var winamp_is_active = (vo.audio_obj && vo.audio_obj.is_winamp && !sender.busy)

var winamp_stopped

var obj = WebKit_object.monitor_winamp._json

if (!Object.keys(obj).length)
  winamp_stopped = true
else {
  if (Date.now() > obj.time + 10*1000)
    winamp_stopped = true
  else {
    obj.path = decodeURIComponent(obj.path)

    var obj_last
    if (winamp) {
      obj_last = winamp._JSON
      winamp._JSON = obj
    }

    if (!winamp || (winamp != vo.audio_obj) || (winamp_is_active && (winamp.src != toFileProtocol(obj.path)))) {
      if (!obj.playing)
        return
//DEBUG_show(obj.path,0,1)
      vo.audio_obj && vo.audio_obj.pause()
      var item = {
  path: obj.path
 ,isFileSystem: true
 ,_winamp_JSON: obj
      }

      DragDrop.onDrop_finish(item)
    }
    else if (winamp_is_active) {
      if (obj.playing) {
        if (obj_last && (Math.abs(obj_last.pos - obj.pos)/1000 > 5)) {
          if (vo.is_webgl) {
            MMD_SA.MMD.frame_time_ref = 0
            if (vo.motion_by_song_name_mode) { MMD_SA.seek_motion(vo.audio_obj.currentTime, true) }
          }
          else {
            var time_reference = (winamp.beat_reference - winamp.currentTime) * winamp.BPM/vo.BPM + sender.currentTime
            setTimeout(function () {EQP_SyncBPM_Auto(sender, vo, time_reference)}, 1000)
          }
        }

        if (winamp._winamp_paused) {
          winamp._winamp_paused = false
          if (vo.is_webgl) {
            var mmd = MMD_SA.MMD
            mmd.frame_time_ref = 0
            mmd.play()
          }
          else {
            if (sender.paused)
              SL_MC_Play()
          }
        }
      }
      else {
        if (!winamp._winamp_paused) {
          winamp._winamp_paused = true
          if (vo.is_webgl) {
            MMD_SA.MMD.pause()
          }
          else {
            if (!sender.paused)
              SL_MC_Play()
          }
        }
      }
    }
  }
}

if (winamp_stopped && winamp_is_active && !winamp.ended) {
  winamp.ended = true
  winamp.src = ""
  vo.audio_onended()
  if (vo.is_webgl)
    MMD_SA.MMD.play()
}

//DEBUG_show(obj.path+'/'+(obj.pos/1000) + '/' + (Date.now() - obj.time))
    }

    WebKit_object.monitor_winamp.init()
    DEBUG_show("(Winamp mode)", 2)
  }

 ,initBPMCounting: function (vo) {
    var ao = vo.audio_obj
    var sender = vo._sender

    Seq.item("CountBPM").At(0.5, "Audio_BPM.vo.CountBPM()", -1, 0.5)
    Seq.item("CountBeat").At(0.5, "Audio_BPM.vo.CountBeat()", -1, 0.5)

    vo.CountBPM = function () {
DEBUG_show("(Counting BPM...)")

var path = oShell.ExpandEnvironmentStrings("%TEMP%") + "\\_bpm_" + this._temp_filename + ".txt"
if (!FSO_OBJ.FileExists(path))
  return

Seq.item("CountBPM").Stop()

var file = FSO_OBJ.OpenTextFile(path, 1);
var txt = file.ReadLine()
file.Close()

try {
  FSO_OBJ.DeleteFile(path)
}
catch (err) {}

var bpm = parseFloat(txt)
if (!bpm) {
  DEBUG_show("(No BPM detected, assuming 120 BPM instead)", 2)
  this.audio_obj.BPM = this.audio_obj.BPM_by_BASS = 120
  this.audio_obj.beat_reference_list = [0]
  this.BPMFinalize()
  return
}

this.audio_obj.BPM = this.audio_obj.BPM_by_BASS = bpm

this._get_beat_reference()
    }

    vo.CountBeat = function () {
DEBUG_show("(BPM:" + Math.round(this.audio_obj.BPM*100)/100 + ") | (Counting beats...)")

var path = oShell.ExpandEnvironmentStrings("%TEMP%") + "\\_bpm_" + this._temp_filename + ".txt"
if (!FSO_OBJ.FileExists(path))
  return

Seq.item("CountBeat").Stop()

var file = FSO_OBJ.OpenTextFile(path, 1);
var txt = file.ReadAll()
file.Close()

try {
  FSO_OBJ.DeleteFile(path)
}
catch (err) {}

var beat_ref = JSON.parse(txt)
if (!beat_ref) {
  DEBUG_show("(No beat detected)", 2)
  beat_ref = [0]
}

this.audio_obj.beat_reference_list = beat_ref

this.BPMFinalize()
    }

    vo.BPMFinalize = function () {
// IE9 native WMP child animation support, somewhat obsolete
if (is_SA_child_animation && !this.audio_obj.is_winamp && (ie9_native && parent.use_WMP)) {
  parent.DragDrop.onDrop_finish_BPM(DragDrop._item)
}
else
  DragDrop.onDrop_finish_BPM(DragDrop._item)
    }

    vo._audio_BPM_detection_finished = function (beat_zone) {
var bpm, beat_ref
if (!beat_zone.length) {
  bpm = 120
  beat_ref = [0]
  DEBUG_show("(No beat detected, assuming 120 BPM instead)", 2)
}
else {
  bpm = beat_zone[0].tempo_final
  var beat_count_max_final = beat_zone[0].beat_count_max_final

  beat_ref = []
  beat_zone.forEach(function (zone) {
    beat_ref.push(((zone.beat_index == -1) || (zone.beat_count_max < beat_count_max_final * 2/3)) ? 0 : zone.beat_time)
  });

  console.log(JSON.stringify(beat_zone))
  DEBUG_show("BPM:" + bpm)
}

vo.audio_obj.BPM = vo.audio_obj.BPM_by_WebAudioAPI = bpm
vo.audio_obj.beat_reference_list = beat_ref
vo.BPMFinalize()
    }

    vo._get_BPM_WebAudioAPI_worker = function () {
// electron.remote (@electron/remote) is NOT reliable, and the need for a separate way to handle beat detection in electron is no longer necessary anyways.
/*
if (webkit_electron_mode) {
  let win_pos = SA_top_window.getPos()
  const webPreferences_default = {
    nodeIntegration: true,
    enableRemoteModule: true,
// https://www.electronjs.org/docs/breaking-changes#default-changed-contextisolation-defaults-to-true
    contextIsolation: false,
  };
  let win_options = {x:win_pos[0]+30, y:win_pos[1]+30, width:320, height:240, webPreferences:webPreferences_default, resizable:false, frame:false, transparent:true}
  if (webkit_version_milestone["1.2.4"]) {
    win_options.parent = webkit_window
  }
  else {
    win_options.alwaysOnTop = true
  }
  let win_BPM = new webkit_electron_remote.BrowserWindow(win_options)
  win_BPM.loadURL(toFileProtocol(System.Gadget.path + '\\audio_BPM_detection_portable.html') + "?file=" + encodeURIComponent(DragDrop._item.path) + ((vo.audio_obj.BPM_by_id3) ? "&BPM_by_id3=" + vo.audio_obj.BPM_by_id3 : "") + ((is_SA_child_animation) ? "&window_id=" + SA_child_animation_id: ""))

  require("@electron/remote/main").enable(win_BPM.webContents);

  win_BPM.webContents.on('crashed', function () {
//    DEBUG_show("ERROR: Audio decoding failed", 10)
    vo._BPMByWebAudioAPI_crashed_ = true
    if (!vo.audio_obj.BPM_by_id3)
      vo._get_BPM()
    else {
      vo.audio_obj.BPM = vo.audio_obj.BPM_by_id3
      vo._get_beat_reference()
    }

    win_BPM.close()
  });
}
else {
*/
  if (browser_native_mode) vo.audio_obj._file = DragDrop._item.obj.obj.file
//console.log(DragDrop._item)
  Audio_BPM_detection_portable(toFileProtocol(DragDrop._item.path), vo.audio_obj, function (data) { vo._audio_BPM_detection_finished(data) });
//}
    }

    vo._get_BPM = function () {
if (Settings.BPMByWebAudioAPI && !vo._BPMByWebAudioAPI_crashed_) {
  vo._get_BPM_WebAudioAPI_worker()
  return
}

var temp_filename = (Date.now()) + ("-" + Math.random()).replace(/0\./, "");
AutoIt_Execute(System.Gadget.path + '\\au3\\BASS\\_bpm', encodeURIComponent(DragDrop._item.path) + ' ' + temp_filename)

this._temp_filename = temp_filename
Seq.item("CountBPM").Play()
    }

    vo._get_beat_reference = function () {
if (Settings.BPMByWebAudioAPI && !vo._BPMByWebAudioAPI_crashed_) {
  vo._get_BPM_WebAudioAPI_worker()
  return
}

vo._BPMByWebAudioAPI_crashed_ = null

var temp_filename = (Date.now()) + ("-" + Math.random()).replace(/0\./, "");
AutoIt_Execute(System.Gadget.path + '\\au3\\BASS\\_beat', encodeURIComponent(DragDrop._item.path) + ' ' + temp_filename + ' ' + vo.audio_obj.BPM)

this._temp_filename = temp_filename
Seq.item("CountBeat").Play()
    }

    DragDrop.onDrop_finish_BPM = function (item) {
var img = (sender._EQP_obj || {})
var src = item.path

var ao = vo.audio_obj

var motion_index
function _onload_song_name_mode() {
  MMD_SA_options.motion_shuffle = [motion_index]
  MMD_SA_options.motion_shuffle_list_default = null
  MMD_SA._force_motion_shuffle = true

  sender.defaultPlaybackRate = sender.playbackRate = 1
  sender.busy = false
  ao.src = toFileProtocol(src)

  if (ao.is_winamp) {
    System._browser.on_animation_update.add(function () {
      MMD_SA.playbackRate = 1
      MMD_SA.seek_motion(ao.currentTime)
    }, 1,0);
  }
}

if (vo.motion_by_song_name_mode) {
  var song_name = src.replace(/^.+[\/\\]/, "").replace(/\.\w{3,4}$/, "")
  var motion_by_song_name = MMD_SA_options.motion_by_song_name[song_name]

  var motion_name = motion_by_song_name.motion_name || motion_by_song_name.motion_path.replace(/^.+[\/\\]/, "").replace(/\.vmd$/i, "")
  motion_index = MMD_SA_options.motion_index_by_name[motion_name]
  if (motion_index == null) {
    motion_index = MMD_SA_options.motion.length;
  }
  else {
// ignore custom motion that hasn't been loaded
    if (!MMD_SA.motion[motion_index]) {
      delete MMD_SA_options.motion_index_by_name[motion_name];
      motion_index = MMD_SA_options.motion.length;
    }
  }
  MMD_SA.load_external_motion(motion_by_song_name.motion_path, _onload_song_name_mode)

  vo.BPM_mode = false
  return
}

var bpm = ao.BPM

var bpm_adjusted = bpm/vo.BPM
sender.defaultPlaybackRate = sender.playbackRate = img._playbackRate = bpm_adjusted
//img._playbackRate_ = bpm_adjusted
//DEBUG_show(img._playbackRate+'/'+img._playbackRate_,0,1)
//setInterval(function () { DEBUG_show(img._playbackRate+'/'+img._playbackRate_,0,1); }, 100)

if (!WallpaperEngine_CEF_mode) {
  var f = src.replace(/[\/\\][^\/\\]+$/, "")
  var p = src.replace(/^.+[\/\\]/, "")

  var so = ao.song_bpm
  var doc = so.xml
  var song = so.song
  if (!song) {
    var doc_create = (webkit_mode) ? document.implementation.createDocument("", "", null) : doc

    song = doc_create.createElement("song")

    var song_filename = doc_create.createElement("filename")
    song_filename.appendChild(doc_create.createTextNode(p))
    var song_path = doc_create.createElement("path")
    song_path.appendChild(doc_create.createTextNode(encodeURIComponent(f)))
    var song_bpm = doc_create.createElement("bpm")
    song_bpm.appendChild(doc_create.createTextNode(bpm))
    var song_bpm_ref = doc_create.createElement("bpm_ref")
    song_bpm_ref.appendChild(doc_create.createTextNode(ao.beat_reference_list.join(",")))

    song.appendChild(song_filename)
    song.appendChild(song_path)
    song.appendChild(song_bpm)
    song.appendChild(song_bpm_ref)

    if (doc != doc_create) {
      doc_create.appendChild(song)
      song = doc_create.documentElement
    }

    var song_list = doc.documentElement
    song_list.appendChild(song)

    so.song = song
    so.bpm_ref = song.selectSingleNode("bpm_ref")

    ao.song_bpm_save()
  }
}

if (vo.beat_reference) {
  var b_list = ao.beat_reference_list
  var b_list_str = b_list.toString()
/*
  var half_beat = 0
  var ref_beat
var _temp = []
  for (var i = 0, max = b_list.length; i < max; i++) {
    var b = b_list[i]
    if (!b)
      continue

    if (!ref_beat) {
      ref_beat = b
      continue
    }

    var half_beats = (ref_beat - b) * bpm/60 *2
    _temp.push(half_beats)
    if (Math.round(half_beats) % 2)
      half_beat++
  }
DEBUG_show(_temp,0,1)
*/
  for (var i = 0, max = b_list.length; i < max; i++) {
    if (b_list[i])
      continue

    var b_min = 0
    var ii = i-1
    while (!b_min && (ii >= 0))
      b_min = b_list[ii--]

    var b_max = 0
    var ii = i+1
    while (!b_max && (ii < max))
      b_max = b_list[ii++]

    var time = i * 60
    var b_min_diff = (b_min) ? Math.abs(time - b_min) : 99999
    var b_max_diff = (b_max) ? Math.abs(time - b_max) : 99999

    b_list[i] = (b_min_diff < b_max_diff) ? b_min : b_max
  }
  console.log(b_list_str+'\n'+b_list.toString())
}

DEBUG_show('BPM:' + Math.round(bpm*100)/100, 2)

var _p
if ((w3c_mode) && !vo._ao_linked) {
  _p = (is_SA_child_animation) ? parent : self
}

if (_p) {
  var linked_list = []
  for (var i = 0; i < SA_child_animation_max; i++) {
    var ani = _p.SA_child_animation[i]
    if (!ani)
      continue

    var child = _p.document.getElementById("Ichild_animation" + i)
    if (!child || (is_SA_child_animation && (SA_child_animation_id == i)))
      continue

    var cw = child.contentWindow
    try {
      if ((cw.EQP_video_options && cw.EQP_video_options.BPM) || (cw.MMD_SA && !cw.MMD_SA_options.MMD_disabled))
        linked_list.push(cw)
    }
    catch (err) {}
  }

  if (is_SA_child_animation && ((parent.EQP_video_options && parent.EQP_video_options.BPM) || parent.MMD_SA))
    linked_list.push(parent)

  if (linked_list.length) {
    ao._ao_linked_list = linked_list
    linked_list.forEach(function (w) {
      try {
        w.Audio_BPM.vo._ao_linked = ao
        w.Audio_BPM.vo._ao_linked_window = self
        w.DragDrop.onDrop_finish(DragDrop._item, true)
      }
      catch (err) {}
    });
  }
}

sender.busy = false
ao.src = toFileProtocol(src)

vo.playbackRate_scale = 1

// NOTE: Set BPM_mode to true here, instead of in the video "playing" event, to avoid any time gap when BPM_mode is still false, causing any unexpected changes in some variables
vo.BPM_mode = true
    }
  }

 ,play_list: {
    list: null
   ,index: -1
   ,loop_max: 1
   ,loop: 0

   ,drop_folder: function (item) {
var para_obj = { RE_items:/\.(mp3|wav|aac)$/i }
Shell_ReturnItemsFromFolder(item.path, para_obj)
if (para_obj.gallery.length) {
//DEBUG_show(para_obj.gallery[0].path)
  this.play_next(para_obj.gallery)
  return false
}
DragDrop_install(item)
    }

   ,play_next: function (list) {
if (list) {
  this.list = list
  this.index = -1
  this.loop = 0
}

if (!this.list)
  return false

if ((this.index == -1) || (++this.index >= this.list.length)) {
  if (this.loop_max && (++this.loop > this.loop_max)) {
    return false
  }
  this.list.shuffle()
  this.index = 0
}

SA_DragDropEMU(toLocalPath(this.list[this.index].path))
return true
    }
  }
}


// required
document.write('<script language="JavaScript" src="js/audio_BPM_detection_portable.js"></scr'+'ipt>');
//document.write('<script language="JavaScript" src="js/audio_custom_source.js"></scr'+'ipt>');
