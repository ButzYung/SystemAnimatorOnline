// MMD for System Animator (v3.7.1)

var use_full_spectrum = true

var MMD_SA_options

var MMD_SA = {
  initialized: false
 ,init: function () {
if (this.initialized)
  return
this.initialized = true

this.fadeout_canvas = document.createElement("canvas")
/*
this.fadeout_dummy = new Image()
this.fadeout_dummy.src = toFileProtocol(System.Gadget.path + '\\images\\laughing_man_134x120.png')
*/

var c_host = (returnBoolean("CSSTransform3DDisabledForContent")) ? document.getElementById("Lbody_host") : document.getElementById("Lbody")

MMD_SA.reset_gravity = function () {
  if (MMD_SA._gravity_)
    return

//  var gravity_default = MMD_SA.MMD.motionManager.para_SA.gravity || [0,-1,0]
  MMD_SA._gravity_ = MMD_SA.MMD.motionManager.para_SA.gravity_reset
  if (!MMD_SA._gravity_) {
    MMD_SA._gravity_ = [0,1,0]
//    MMD_SA._gravity_ = [0,0,0]
//    MMD_SA._gravity_[random(3)] = (Math.random() > 0.5) ? 2 : -2
  }
//DEBUG_show(MMD_SA._gravity_)

  MMD_SA._gravity_factor = 1

/*
    THREE.MMD.getModels().forEach(function (m) {
if (!m.physi)
  return
m.mesh._reset_rigid_body_physics_ = MMD_SA_options.reset_rigid_body_physics_step*5
//m.physi.reset()
    });
*/
};

c_host.ondblclick = function (e) {
  if (!MMD_SA.use_jThree || MMD_SA_options.MMD_disabled || !MMD_SA.MMD_started)
    return

  if (MMD_SA_options.ondblclick && MMD_SA_options.ondblclick(e))
    return

  if (!MMD_SA_options.Dungeon || !MMD_SA_options.Dungeon.character.TPS_camera_lookAt_) {
    MMD_SA.reset_camera(true)
    DEBUG_show("(camera reset)", 2)
  }

  MMD_SA.reset_gravity()
};

var d = document.createElement("div")
var ds = d.style
d.id = "SL_Host_Parent"
ds.position = "absolute"
ds.left = ds.top = "0px"
ds.zIndex = 10
c_host.appendChild(d)

var d = document.createElement("div")
var ds = d.style
d.id = "SL_Host"
ds.position = "absolute"
ds.left = ds.top = "0px"
ds.zIndex = 2
SL_Host_Parent.appendChild(d)

var c = document.createElement("canvas")
c.id = "SL"
c.width  = self.EV_width  = MMD_SA_options.width
c.height = self.EV_height = MMD_SA_options.height
var cs = c.style
cs.position = "absolute"
cs.left = cs.top = "0px"
cs.zIndex = 1
SL_Host.appendChild(c)

if (this.use_jThree) {
  // SL was "overwritten" by some unknown reason. Use the following to restore it.
  self.SL = c

  c = document.createElement("canvas")
  c.id = "SL_2D_front"
  c.width  = MMD_SA_options.width
  c.height =  MMD_SA_options.height
  cs = c.style
  cs.position = "absolute"
  cs.left = cs.top = "0px"
  cs.zIndex = 2
  cs.display = "none"
  SL_Host.appendChild(c)

  if (use_WebGL_2D)
    WebGL_2D.createObject(SL_2D_front)

  if (MMD_SA_options.use_JSARToolKit) {
    c = document.createElement("canvas")
    c.id = "SL_webcam"
    c.width  = MMD_SA_options.width
    c.height =  MMD_SA_options.height
    cs = c.style
    cs.position = "absolute"
    cs.left = cs.top = "0px"
    cs.zIndex = 0
    SL_Host.appendChild(c)

    if (use_WebGL_2D)
      WebGL_2D.createObject(SL_webcam)

    var video
    var AR_para = MMD_SA_options.AR_para

    if (AR_para.marker_base_transform) {
      var t = AR_para.marker_base_transform.translation || [0,0,0]
      var r = AR_para.marker_base_transform.rotation || [0,0,0]
      for (var i = 0; i < 3; i++)
        r[i] *= Math.PI / 180
      AR_para._marker_base_transform = new THREE.Matrix4().makeFromPositionQuaternionScale(MMD_SA.TEMP_v3.set(t[0],t[1],t[2]), MMD_SA.TEMP_q.setFromEuler(MMD_SA._v3a.set(r[0],r[1],r[2])), MMD_SA._v3b.set(1,1,1))
    }

    if (AR_para.IP_camera_url) {
      this.AR_video = video = document.createElement('img');
//video.width  = AR_para.video_width;
//video.height = AR_para.video_height;

      video.onerror = function () {
MMD_SA.AR_video = null
alert("(IP camera not found)")
      }
      video.src = AR_para.IP_camera_url
    }
    else {
this.AR_video = video = document.createElement('video');
video.autoplay = true;
//video.width  = AR_para.video_width;
//video.height = AR_para.video_height;

var getUserMedia = function(t, onsuccess, onerror) {
  if (navigator.getUserMedia) {
    return navigator.getUserMedia(t, onsuccess, onerror);
  } else if (navigator.webkitGetUserMedia) {
    return navigator.webkitGetUserMedia(t, onsuccess, onerror);
  } else if (navigator.mozGetUserMedia) {
    return navigator.mozGetUserMedia(t, onsuccess, onerror);
  } else if (navigator.msGetUserMedia) {
    return navigator.msGetUserMedia(t, onsuccess, onerror);
  } else {
    onerror(new Error("No getUserMedia implementation found."));
  }
};

var _URL = window.URL || window.webkitURL;
var createObjectURL = _URL.createObjectURL;
if (!createObjectURL) {
  throw new Error("URL.createObjectURL not found.");
}

getUserMedia({'video': true},
  function(stream) {
    var url = createObjectURL(stream);
    video.src = url;
  },
  function(error) {
    alert("Couldn't access webcam.");
  }
);

    }
  }
}

SL_Host_Parent.style.width  = MMD_SA_options.width  + "px"
SL_Host_Parent.style.Height = MMD_SA_options.height + "px"

this.custom_action_index = (MMD_SA_options.custom_action.length) ? MMD_SA_options.motion.length : 0
for (var i = 0, len = MMD_SA_options.custom_action.length; i < len; i++) {
  var ca = MMD_SA_options.custom_action[i]
  var da = (typeof ca == 'string') ? MMD_SA.custom_action_default[ca] : ca

  var index = MMD_SA_options.motion.length
  da.action.motion_index = index
  MMD_SA_options.custom_action[i] = da.action
  MMD_SA_options.motion[index] = da.motion
  da.motion.jThree_para = { animation_check: da.animation_check || null }

  da.action.para_by_model_index = {}
  for (var j = 0, j_max = MMD_SA_options.model_para_obj_all.length; j < j_max; j++)
    da.action.para_by_model_index[j] = {}
}

MMD_SA_options.motion.forEach(function (motion) {
  if (motion.para_SA)
    MMD_SA_options.motion_para[motion.path.replace(/^.+[\/\\]/, "").replace(/\.vmd$/i, "")] = motion.para_SA
});

// media control START
SL._mouseout_timerID = null

SL._mouse_event_main = function () {
  if (MMD_SA_options.MMD_disabled && (DragDrop.relay_id != null)) {
    var cw = document.getElementById("Ichild_animation" + DragDrop.relay_id).contentWindow
    if (!cw.SL._mouse_event_main()) {
      if (SL_MC_video_obj) {
// prevent stack overflow when some functions in audio_onended may run SL._mouse_event_main again
        setTimeout(function () { Audio_BPM.vo.audio_onended() }, 0)
      }
      return false
    }

    if (!SL_MC_video_obj) {
// prevent stack overflow when some functions in SL_MC_Place may run SL._mouse_event_main again
      setTimeout(function () { SL_MC_Place() }, 0)
    }

    if (!SL._media_player) {
SL_MC_simple_mode = true

var m = cw.SL_MC_video_obj||cw.WMP.player.audio_obj
SL._media_player = {
  get muted()  {
    return m && m.muted
  }
 ,set muted(v) {
    if (m)
      cw.SL_MC_Sound()
  }

 ,get currentTime() {
    return (m && m.currentTime) || 0
  }
 ,set currentTime(v) {
    if (!m)
      return

    if (v == 0)
      cw.SL_MC_Stop()
    else {
      var t = m.currentTime
      if (v > t)
        cw.SL_MC_Forward()
      else
        cw.SL_MC_Backward()
    }
  }

 ,get paused() {
    return m && m.paused
  }

 ,get play() {
    return (m && cw.SL_MC_Play) || function () {}
  }
 ,get pause() {
    return (m && cw.SL_MC_Play) || function () {}
  }
}
    }
    SL_MC_video_obj = SL._media_player
  }

  if (SL_MC_video_obj && MMD_SA.music_mode) {
    if (SL._mouseout_timerID) {
      clearTimeout(SL._mouseout_timerID)
      SL._mouseout_timerID = null
    }
    return true
  }

  return false
}

var m = {}

Lbody_host.onmouseover = m.onmouseover = C_media_control.onmouseover = function () {
  if (!SL._mouse_event_main())
    return

  SL_Media_MouseEnter(SL_MC_video_obj)
}

Lbody_host.onmouseout = m.onmouseout = function () {
  if (!SL._mouse_event_main())
    return

  SL._mouseout_timerID = setTimeout('C_media_control.style.visibility="hidden"', ((returnBoolean("IgnoreMouseEventsPartial"))?2000:100))
}
// END


  if (MMD_SA_options.use_JSARToolKit && use_MatrixRain) {
    this.matrix_rain = new MatrixRain(MMD_SA_options.width, MMD_SA_options.height)
    this.matrix_rain.full_color = returnBoolean("MatrixRainColor")
    this.matrix_rain.matrixCreate()

    this.matrix_rain._SA_draw = function(skip_matrix) {
if (!this._SA_active)
  return

if (use_full_fps && !skip_matrix)
  skip_matrix = !EV_sync_update.frame_changed("matrixDraw")

this.matrixDraw(skip_matrix)

this.draw(SL_webcam)

var context = SL_webcam.getContext("2d")
context.globalAlpha = 1
context.globalCompositeOperation = 'copy'
context.drawImage(this.canvas, 0,0)
    }

    DEBUG_show("Use Matrix rain", 2)
  }


// audio START
var sender = {
  _playbackRate: 1
 ,defaultPlaybackRate: 1
 ,pause: function () {}
 ,play: function () {}
}

Object.defineProperty(sender, "playbackRate",
{
  get: function () {
var vo = Audio_BPM.vo
if (vo.BPM_mode) {
  var img = (this._EQP_obj || {})
  var ao = vo.audio_obj
  var bpm = ao.BPM || 120
  this.defaultPlaybackRate = this._playbackRate = img._playbackRate = bpm/vo.BPM * (vo.playbackRate_scale || 1)
}

return this._playbackRate
  }
 ,set: function (v) {
this._playbackRate = v
  }
});

var vo
vo = Audio_BPM.vo = sender.vo = {
  is_webgl:true
 ,_sender: sender

 ,beat_reference: 1//dummy
}

Object.defineProperty(vo, "BPM",
{
  get: function () {
var para = MMD_SA.MMD.motionManager.para_SA
// default to 120 to avoid errors when para_SA is not predefined
return ((para.BPM) ? para.BPM.BPM : 120)
  }
});


vo.audio_onended = function (e) {
  if (!MMD_SA_options.MMD_disabled) {
    vo.BPM_mode = false
    vo.motion_by_song_name_mode = false

    sender.defaultPlaybackRate = sender.playbackRate = 1
    MMD_SA.MMD.frame_time_ref = 0

    if (MMD_SA_options._motion_shuffle_list_default) {
      MMD_SA_options.motion_shuffle = MMD_SA_options._motion_shuffle_list_default.slice(0)
      MMD_SA_options.motion_shuffle_list_default = MMD_SA_options._motion_shuffle_list_default.slice(0)
      MMD_SA._force_motion_shuffle = true
    }
  }

  SL_MC_Place(-1)

  var EC = MMD_SA_options.MME && MMD_SA_options.MME.PostProcessingEffects
  var music_canvas = EC && EC._music_canvas
  if (music_canvas) {
    EC._texture_common['[music canvas]'].needsUpdate = true
    music_canvas.getContext("2d").clearRect(0,0, 512,2)
  }

  if (MMD_SA_options.PPE_disabled_on_idle) {
    MMD_SA_options.MME.PostProcessingEffects.enabled = false
  }
  MMD_SA_options.audio_onended && MMD_SA_options.audio_onended()

  DEBUG_show("Audio:END", 2)
}

Audio_BPM.checkWinamp(vo)

DragDrop_RE = eval('/\\.(' + DragDrop_RE_default_array.concat(["vmd", "mp3", "wav", "aac", "zip"]).join("|") + ')$/i')

DragDrop.onDrop_finish = function (item) {
  var src = item.path
  if (item.isFileSystem && /([^\/\\]+)\.zip$/i.test(src)) {
//DEBUG_show(toFileProtocol(src))
//    if (!MMD_SA.jThree_ready) return;

    var zip_file = top.DragDrop._path_to_obj[src.replace(/^(.+)[\/\\]/, "")]

new self.JSZip().loadAsync(zip_file)
.then(function (zip) {
// will be called, even if content is corrupted
//console.log(999,src)

  top.DragDrop._zip_by_url = top.DragDrop._zip_by_url || {}
  top.DragDrop._zip_by_url[src] = zip

  var files_added
  var music_list = zip.file(/[^\/\\]+.(mp3|wav|aac)$/i)
  if (music_list.length) {
    if (!MMD_SA_options.motion_by_song_name)
      MMD_SA_options.motion_by_song_name = {}

    let keys_used = []
    for (let music_filename in MMD_SA_options.motion_by_song_name) {
      let k = MMD_SA_options.motion_by_song_name[music_filename].key
      if (k)
        keys_used.push(k)
    }

    let keys_available = []
    for (let i = 1; i <= 9; i++) {
      if (keys_used.indexOf(i) == -1)
        keys_available.push(i)
    } 

    keys_used = []
    music_list.slice(0,keys_available.length).forEach(function (music) {
      var music_filename = music.name.replace(/^.+[\/\\]/, "").replace(/\.\w+$/, "")
//DEBUG_show(music_filename,0,1)
      var vmd = zip.file(new RegExp(toRegExp(music_filename)+"\\.vmd"))
      if (vmd.length) {
        files_added = true
        let k = keys_available.shift()
        keys_used.push(k)

        let morph_vmd = zip.file(new RegExp(toRegExp(music_filename)+"_morph\\.vmd"))
        if (morph_vmd.length) {
          let para_SA = MMD_SA_options.motion_para[music_filename] = MMD_SA_options.motion_para[music_filename] || {}
          if (!para_SA.morph_component_by_filename)
            para_SA.morph_component_by_filename = music_filename + "_morph"
        }

        MMD_SA_options.motion_by_song_name[music_filename] = {
  motion_path: (src + "#/" + vmd[0].name)
 ,song_path: (src + "#/" + music.name)
 ,key: k
        };
//console.log(toFileProtocol(src + "#/" + vmd[0].name))
//        MMD_SA_options.motion.push({ must_load:true, no_shuffle:true, path:toFileProtocol(src + "#/" + vmd[0].name) })
      }
    });

    if (files_added)
      DEBUG_show("Music/Motion list updated (" + keys_used.join(",") + ")", 2)
  }

  if (!MMD_SA.jThree_ready) return;

  var pmx_list = zip.file(/\.pmx$/i)
  if (!pmx_list.length) {
    if (!files_added)
      DEBUG_show("(No MMD model found)")
    return
  }
//  DEBUG_show(pmx_list[0].name)

  var model_filename = pmx_list[0].name.replace(/^.+[\/\\]/, "")

MMD_SA._init_my_model = function () {
  var _MME_v = {};
  ["_toFloat", "_EV_usage_PROCESS", "PostProcessingEffects"].forEach(function (p) {
    _MME_v[p] = MMD_SA_options.MME[p]
  });

  MMD_SA_options.model_path_default = MMD_SA_options.model_path = src + "#/" + pmx_list[0].name

  var model_filename_cleaned = model_filename.replace(/[\-\_]copy\d+\.pmx$/, ".pmx").replace(/[\-\_]v\d+\.pmx$/, ".pmx")
  var model_para_obj = MMD_SA_options.model_para_obj = Object.assign({}, MMD_SA_options.model_para[model_filename] || MMD_SA_options.model_para[model_filename_cleaned] || MMD_SA_options.model_para._default_ || {})
  model_para_obj._filename_raw = model_filename
  model_para_obj._filename = model_filename
  model_para_obj._filename_cleaned = model_filename_cleaned

  if (!model_para_obj.skin_default)
    model_para_obj.skin_default = { _is_empty:true }
// save some headaches and make sure that every VMD has morph (at least a dummy) in "Dungeon" mode
  if (!model_para_obj.morph_default) model_para_obj.morph_default = { _is_empty:!MMD_SA_options.Dungeon }

  MMD_SA_options._MME = Object.clone(MMD_SA_options._MME_)
  if (Object.keys(MMD_SA_options._MME).length == 0) {
    MMD_SA_options._MME = {
      self_overlay: {
  enabled: 1
 ,opacity: 0.4
      }
     ,HDR: {
  enabled: 1
 ,opacity: 0.2
      }
     ,serious_shader: {
  enabled: 0
      }
    }
  }

//console.log(MMD_SA_options._MME)
//model_para_obj.skin_default = { "くちびる上_IK": { pos:{x:0, y:0.1, z:0} } }
//model_para_obj.morph_default = { "あ2": { weight:1 } }

  MMD_SA_options.model_para_obj_all[0] = MMD_SA_options.model_para_obj_by_filename[model_filename] = model_para_obj
  model_para_obj._model_index = 0
  for (var p in _MME_v) {
    MMD_SA_options.MME[p] = _MME_v[p];
  }
};

  var sb = document.getElementById("LMMD_StartButton")
  if (sb) {
    let info_extra = ""
    let model_json = zip.file(/model\.json$/i)
    if (model_json.length) {
      info_extra = "(+config)"
      model_json[0].async("text").then(function (json) {
MMD_SA_options.model_para = Object.assign(MMD_SA_options.model_para, JSON.parse(json, function (key, value) {
  if (typeof value == "string") {
    if (/^eval\((.+)\)$/.test(value)) {
      value = eval(decodeURIComponent(RegExp.$1))
    }
  }
  return value
}));
console.log("(model.json updated)")
      });
    }

    sb._msg_mouseover = [
  model_filename + info_extra
 ,"Press START to begin with your custom MMD model."
 ,""
 ,"(Click here to reset to the default model.)"
    ].join("\n");
    DEBUG_show(sb._msg_mouseover, -1);

    MMD_SA._click_to_reset = function () {
      MMD_SA._init_my_model = null;
      SystemAnimator_caches.delete("/user-defined-local/my_model.zip");
      sb._msg_mouseover = "Press START to begin loading.\n\n(Drop a MMD model zip to use your own model.)"
      DEBUG_show(sb._msg_mouseover, -1);
      Ldebug.style.cursor = "default";
      Ldebug.removeEventListener("click", MMD_SA._click_to_reset);
      MMD_SA._click_to_reset = null;
    };
    Ldebug.style.cursor = "pointer";
    Ldebug.addEventListener("click", MMD_SA._click_to_reset);
  }

  SystemAnimator_caches.put("/user-defined-local/my_model.zip", new Response(zip_file, {status:200, statusText:"custom_PC_model"}));
}, function (e) {
    // won't be called
  console.error("ZIP error (" + src + ")")
});

//console.log(DragDrop)
  }
  else if (item.isFileSystem && /([^\/\\]+)\.vmd$/i.test(src)) {
    var filename = RegExp.$1

    if (MMD_SA.music_mode) {
      DEBUG_show("(no external motion while music is still playing)", 2)
      return
    }
    if (MMD_SA._busy_mode1_) {
      return
    }

    var index = MMD_SA_options.motion_index_by_name[src.replace(/^.+[\/\\]/, "").replace(/\.vmd$/i, "")]
    if (index != null) {
      if (MMD_SA.use_jThree) {
        MMD_SA_options.motion_shuffle = [index]
        MMD_SA_options.motion_shuffle_list_default = null
        MMD_SA._force_motion_shuffle = true
      }
      else
        DEBUG_show("(motion already existed)", 2)
      return
    }

    if (MMD_SA.use_jThree) {
      MMD_SA.load_external_motion(src)
    }
    else {
      var motion = new MMD.Motion(src)
      motion._index = 0
      motion.load(function() {
var mm = new MMD.MotionManager()

var mmd = MMD_SA.MMD
MMD_SA.motion[this._index] = mmd.motionManager = mm
mm.addModelMotion(MMD_SA.model, this, true, 0)
mm.para_SA = (MMD_SA_options.motion_para[filename] || {})
mm.modelMotions[0].process_bones = mm.para_SA.process_bones
mmd.setFrameNumber(-1)
      })
    }
  }
  else if (item.isFolder) {
    Audio_BPM.play_list.drop_folder(item)
  }
  else if (item.isFileSystem && /([^\/\\]+)\.(mp3|wav|aac)$/i.test(src)) {
    if (!THREE.MMD.motionPlaying) {
      DEBUG_show("(motion paused)", 2)
      return
    }

    if (MMD_SA_options.MMD_disabled) {
//      DEBUG_show("(music playback disabled)", 2)
if (!SL._media_player) {
  SL_MC_simple_mode = true

  SL._media_player = SL_MC_video_obj = document.createElement("audio")

  SL_MC_video_obj.addEventListener("canplaythrough", function (e) {
SL_MC_Place()

if (self.AudioFFT) {
  AudioFFT.connect(this)
}
  }, true)

  SL_MC_video_obj.addEventListener("playing", function (e) {
// mainly to prevent timeupdate event from detecting a wrong "stop" when playing the second (and so on) music
this._started = true
  }, true)

  SL_MC_video_obj.addEventListener("ended", function (e) {
SL_MC_Place(-1)
  }, true)

  SL_MC_video_obj.addEventListener("timeupdate", function (e) {
if (this._started && this.paused && !this.currentTime)
  SL_MC_Place(-1)
else
  SL_MC_Timeupdate(this)
  }, true)

  SL_MC_video_obj.autoplay = true
}
      SL_MC_video_obj = SL._media_player
      SL_MC_video_obj._started = false
      SL_MC_video_obj.src = toFileProtocol(src)
      return  
    }

    var filename = RegExp.$1

    var motion_by_song_name = MMD_SA_options.motion_by_song_name && MMD_SA_options.motion_by_song_name[filename]
    if (motion_by_song_name) {
      vo.motion_by_song_name_mode = true
      MMD_SA.playbackRate = 0
    }
    else {
      vo.motion_by_song_name_mode = false

      if (!MMD_SA.MMD.motionManager.para_SA.BPM) {
        if (MMD_SA_options._motion_shuffle && MMD_SA.motion[MMD_SA_options._motion_shuffle[0]].para_SA.BPM) {
          MMD_SA_options._motion_shuffle_list = null
          var song_para = MMD_SA_options.motion_shuffle_by_song_name && MMD_SA_options.motion_shuffle_by_song_name[filename]
          if (song_para) {
            MMD_SA_options._motion_shuffle_list = song_para.motion_shuffle_list.slice(0)

            var EC = MMD_SA_options.MME.PostProcessingEffects
            if (song_para.MME_bg_shuffle && EC && EC.enabled && EC.effects.length) {
              var sg = EC.shuffle_group[song_para.MME_bg_shuffle.group_id]
              sg.shuffle_list = song_para.MME_bg_shuffle.shuffle_list.slice(0)
              sg.shuffle_list_index = null
            }
          }
          MMD_SA_options.motion_shuffle = MMD_SA_options._motion_shuffle.slice(0)
          MMD_SA_options.motion_shuffle_list_default = null
          MMD_SA._force_motion_shuffle = true
        }
        else
          return
      }
    }

    var ao = vo.audio_obj = (item._winamp_JSON) ? vo.audio_obj_WINAMP : ((vo.audio_obj && !vo.audio_obj.is_winamp) ? vo.audio_obj : vo.audio_obj_HTML5)
    if (ao && ((ao._ao_linked || ao._ao_linked_list) || ((ao == vo.audio_obj_HTML5) && self.AudioFFT)))
      ao = null

    if (ao) {
      ao._timed = null
    }
    else {
      if (item._winamp_JSON) {
        ao = vo.audio_obj = vo.audio_obj_WINAMP = Audio_BPM.createPlayer(vo, item._winamp_JSON)
      }
      else {
        ao = vo.audio_obj = vo.audio_obj_HTML5 = Audio_BPM.createPlayer(vo)

        ao.ontimeupdate = function (e) {
if (ao._timed || !this.currentTime)
  return
//DEBUG_show(!!MMD_SA._force_motion_shuffle,0,1)
ao._timed = true
if (vo.motion_by_song_name_mode) {
  MMD_SA.playbackRate = 1
  MMD_SA.seek_motion(this.currentTime)
}
//var _t = THREE.MMD.getModels()[0].skin.time; DEBUG_show(_t+'/'+this.currentTime,0,1);
DEBUG_show('Audio:START(' + (parseInt(this.currentTime*1000)/1000) + 's)', 2)
        }
      }

      ao._on_playing = function () {
if (ao._MMD_SA_on_playing_skipped) {
  ao._MMD_SA_on_playing_skipped = null
  return
}

if (ao.is_winamp)
  ao.ended = false

var mmd = MMD_SA.MMD
mmd.frame_time_ref = 0
if (vo.motion_by_song_name_mode) {
  if (!ao.ontimeupdate)
    MMD_SA.seek_motion(0)
}
else {
  var para = mmd.motionManager.para_SA.BPM || {}
  if (para.rewind) {
//    MMD_SA.seek_motion((mmd.motionManager.firstFrame_ + parseInt(ao.currentTime * 30 * vo._sender.playbackRate)) / 30)
  }
//DEBUG_show(ao.beat_reference,0,1)
/*
  if (ao.BPM < 110) {
    vo.playbackRate_scale = 1.50
    DEBUG_show("Playback rate x 1.5", 2)
  }
*/
}

SL_MC_video_obj = sender
SL_MC_Place()

if (MMD_SA_options.PPE_disabled_on_idle) {
  var PPE = MMD_SA_options.MME.PostProcessingEffects
  if (MMD_SA_options._PPE_enabled && !PPE.enabled) {
    PPE.enabled = true
//    System._browser.update_tray()
  }
}
MMD_SA_options.audio_onstart && MMD_SA_options.audio_onstart()

if (!ao.ontimeupdate)
  DEBUG_show("Audio:START", 2)
      }
    }

    ao.AV_init && ao.AV_init(item.obj.obj.file)

    DragDrop._item = item
    Audio_BPM.findBPM(vo)

    return false
  }
  else {
    if (!item._winamp_JSON)
      DragDrop_install(item)
  }
}

Audio_BPM.initBPMCounting(vo)
// audio END

/*
c = this.canvas_webgl = document.createElement("canvas")
c.id = "SL_WebGL"
c.width  = MMD_SA_options.width
c.height = MMD_SA_options.height
*/

Object.defineProperty(MMD_SA, "center_view",
{
  get: function () {
if (MMD_SA_options.MMD_disabled)
  return [0,0,0]
var para_SA = this.MMD.motionManager.para_SA
var cv = (para_SA.center_view || MMD_SA_options.center_view || [0,0,0]).slice()
if (MMD_SA_options.Dungeon) {
  cv[2] = -cv[2]
  var c = MMD_SA_options.Dungeon.character
  var rot = c.rot//.clone()
//  if (c.mount_para && c.mount_para.mount_rotation) rot.add(MMD_SA.TEMP_v3.copy(c.mount_para.mount_rotation).multiplyScalar(Math.PI/180))
  cv = MMD_SA._v3a_.fromArray(cv).applyEuler(rot).toArray()
}
return cv
  }
});

Object.defineProperty(MMD_SA, "center_view_lookAt",
{
  get: function () {
if (MMD_SA_options.MMD_disabled)
  return [0,0,0]
var para_SA = this.MMD.motionManager.para_SA
var center_view_lookAt = para_SA.center_view_lookAt || MMD_SA_options.center_view_lookAt
if (!center_view_lookAt) {
  center_view_lookAt = this.center_view.slice(0,2)
  center_view_lookAt.push(0)
}
if (MMD_SA.center_view_lookAt_offset) {
  center_view_lookAt = center_view_lookAt.slice()
  for (var i = 0; i < 3; i++)
    center_view_lookAt[i] += MMD_SA.center_view_lookAt_offset[i]
}
return center_view_lookAt
  }
});

if (this.use_jThree) {
// jThree START
this.motion_number_meter_index = MMD_SA_options.motion.length
for (var i = 0; i < 5; i++)
  MMD_SA_options.motion.push({path:'MMD.js/motion/motion_basic_pack01.zip#/_number_meter_' + (i+1) + '.vmd', jThree_para:{}, match:{skin_jThree:/^(\u5DE6)(\u80A9|\u8155|\u3072\u3058|\u624B\u9996|\u624B\u6369|.\u6307.)/}})
for (var i = 0; i < 5; i++)
  MMD_SA_options.motion.push({path:'MMD.js/motion/motion_basic_pack01.zip#/_number_meter_' + (i+1) + '.vmd', jThree_para:{}, match:{skin_jThree:/^(\u53F3)(\u80A9|\u8155|\u3072\u3058|\u624B\u9996|\u624B\u6369|.\u6307.)/}})

var use_startup_screen = (/AT_SystemAnimator_v0001\.gadget/.test(System.Gadget.path) && !returnBoolean("AutoItStayOnDesktop")) || ((MMD_SA_options.Dungeon || (browser_native_mode && !webkit_window)) ? (MMD_SA_options.startup_screen !== false) : !!MMD_SA_options.startup_screen);
if (use_startup_screen) {
  if (!MMD_SA_options.startup_screen)
    MMD_SA_options.startup_screen = {}
}

if (browser_native_mode || MMD_SA_options.Dungeon || use_startup_screen) {
  Ldebug.style.posLeft = Ldebug.style.posTop = 50
  Ldebug.style.transformOrigin = "0 0"
  Ldebug.style.transform = "scale(3,3)"
  window.addEventListener("MMDStarted", function (e) {
    Ldebug.style.posLeft = Ldebug.style.posTop = 0
    Ldebug.style.transform = Ldebug.style.transformOrigin = ""
    if (MMD_SA_options.Dungeon && (!MMD_SA_options.WebXR || !MMD_SA_options.WebXR.AR)) {
      LdesktopBG.style.backgroundImage = ""
      LdesktopBG.style.backgroundColor = "black"
    }
  });
}

let init = function () {
  if (MMD_SA._init_my_model) {
    MMD_SA._init_my_model()
    MMD_SA._init_my_model = null
  }
  Ldebug.style.cursor = "default";
  if (MMD_SA._click_to_reset) {
    Ldebug.removeEventListener("click", MMD_SA._click_to_reset);
    MMD_SA._click_to_reset = null;
  }
  if (is_mobile)
    document.documentElement.requestFullscreen()

  MMD_SA.MME_init()
  MMD_SA.jThree_ready()
};

if (use_startup_screen) {
/*
  MMD_SA_options.startup_screen = (function () {
    var div_p, div0, div1, yt, sb;
    return {
      init: function (ending_func) {
div_p = document.createElement("div")
div_p.style.position = "absolute"
div_p.style.width  = "100%"
div_p.style.height = "100%"
div_p.style.left = div_p.style.top = "0px"

div0 = document.createElement("div")
div0.style.position = "absolute"
div0.style.width  = "100%"
div0.style.height = "75%"
div0.style.left = div0.style.top = "0px"

div1 = document.createElement("div")
div1.style.position = "absolute"
div1.style.width  = "100%"
div1.style.height = "25%"
div1.style.left = "0px"
div1.style.top  = "75%"

sb = document.createElement("div")
sb.className = "StartButton"
sb.addEventListener("click", function () {
  MMD_SA_options.startup_screen.clear()
  ending_func()
}, true);
sb.style.zIndex = 9999
sb.textContent = "Continue"
//div1.appendChild(sb)

//div0.innerHTML = '<iframe style="position:absolute; top:50%; left:50%; z-index:9999; transform:translate(-50%,-50%);" width="60%" height="80%" src="https://www.youtube.com/embed/7HHlOOJdoNA?rel=0&amp;showinfo=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>'

var yt = document.createElement("iframe")
yt.style.position = "absolute"
yt.style.top = yt.style.left = "50%"
yt.style.zIndex = 9999
yt.style.transform = "translate(-50%,-50%)"
yt.style.width  = "60%"
yt.style.height = "80%"
yt.frameBorder = 0
yt.allow="autoplay; encrypted-media"
yt.allowFullscreen = true
yt.onload = function () {
//  yt.contentWindow.onclick = function () {
    div1.appendChild(sb)
//  }
}
yt.src = "https://www.youtube.com/embed/7HHlOOJdoNA?rel=0&amp;showinfo=0"
div0.appendChild(yt)

div_p.appendChild(div0)
div_p.appendChild(div1)
document.body.appendChild(div_p)
      }

     ,clear: function () {
document.body.removeChild(div_p)
      }
    };
  })();
*/
  if (MMD_SA_options.startup_screen.init) {
    MMD_SA_options.startup_screen.init(function () { init(); resize(); });
  }
  else {
let sb_func = function () {
    let sb = document.createElement("div")
    sb.id = "LMMD_StartButton"
    sb.className = "StartButton"
//  sb.href="#"
    sb.addEventListener("click", function () {
      if (MMD_SA_options.Dungeon_options && MMD_SA_options.Dungeon_options.multiplayer) {
        var mp = MMD_SA_options.Dungeon.multiplayer
        if (!mp.is_host && !mp.is_client) {
          if (!confirm("You are about to start without joining a game from other players, which means you will start in \"host\" mode. In this mode, you won't be able to join other players' games, but on the other hand, other players can join yours."))
            return
          ChatboxAT.SendData_ChatSend([System._browser.P2P_network.process_message('/host')])
        }
      }
//      sb.style.display = "none"
      document.body.removeChild(sb)
      init(); resize();
    }, true);
    sb._msg_mouseover = "Press START to begin loading.\n\n(Drop a MMD model zip to use your own model.)"
    sb.addEventListener("mouseover", function () {
      DEBUG_show(this._msg_mouseover, -1)
    }, true);
    sb.style.zIndex = 601
    sb.textContent = "START"
    document.body.appendChild(sb)

    SystemAnimator_caches.match("/user-defined-local/my_model.zip", {}).then(function (response) {
      response.blob().then(function (blob) {
//console.log(blob)
        blob.name = "my_model.zip"
        blob.isFileSystem = true
        SA_DragDropEMU(blob)
      });
    }).catch(function(){});
};

if (!MMD_SA_options.Dungeon)
  sb_func()
else
  MMD_SA_options.Dungeon.multiplayer.init(sb_func)
  }
}
else {
  init()
}
// jThree END
}
else {
// MMD.js START
var mmd = this.MMD = new MMD(c, c.width, c.height);
mmd.initShaders();
mmd.initParameters();
mmd.registerKeyListener(document);
mmd.registerMouseListener(c_host);

var miku = this.model = new MMD.Model(MMD_SA_options.model_path.replace(/[\/\\][^\/\\]+$/, ""), MMD_SA_options.model_path.replace(/^.+[\/\\]/, ""));

miku.load(function() {
  mmd.addModel(miku);
  mmd.initBuffers();
  mmd.start();
//DEBUG_show([miku.bones[miku.bone_table[4].index].name, miku.bone_group_names[miku.bone_table[4].group_index-1], miku.bones[miku.bones[miku.bone_table[4].index].parent_bone_index].name],0,1)
//DEBUG_show(JSON.stringify(miku.bone_table_by_name),0,1)
  self.EV_animate_full = function () {
MMD_SA.MMD.step()
  }

  MMD_SA.motion = [mmd.motionManager]
  var m_default = new MMD.Motion(MMD_SA_options.motion[0].path)
  m_default.load(function () {
    var m = MMD_SA_options.motion[0]
    mmd.addModelMotion(miku, this, true, 0, m.match)
    MMD_SA.motion[0].para_SA = (MMD_SA_options.motion_para[MMD_SA_options.motion[0].path.replace(/^.+[\/\\]/, "").replace(/\.vmd$/i, "")] || {})

    MMD_SA._motion_loaded = 1

    MMD_SA.motion_number_meter_index = MMD_SA_options.motion.length
    for (var i = 0; i < 5; i++)
      MMD_SA_options.motion.push({path:'MMD.js/motion/_number_meter_' + (i+1) + '.vmd', match:{bone_group:["腕","指"], bone_name_RE:/\u5DE6/}})
    for (var i = 0; i < 5; i++)
      MMD_SA_options.motion.push({path:'MMD.js/motion/_number_meter_' + (i+1) + '.vmd', match:{bone_group:["腕","指"], bone_name_RE:/\u53F3/}})

    for (var i = 1, len = MMD_SA_options.motion.length; i < len; i++) {
      var m = MMD_SA_options.motion[i]
      if (!m.path)
        continue

      var motion = new MMD.Motion(m.path)
      motion._index = i
      motion.load(function() {
var _index = this._index
var m = MMD_SA_options.motion[_index]
var mm = new MMD.MotionManager()
MMD_SA.motion[_index] = mm
mm.addModelMotion(miku, this, true, 0, m.match)
mm.para_SA = (MMD_SA_options.motion_para[m.path.replace(/^.+[\/\\]/, "").replace(/\.vmd$/i, "")] || {})

if (++MMD_SA._motion_loaded +1 < len)
  return

for (var k = 0; k < len; k++) {
  var _mm = MMD_SA.motion[k]
  if (!_mm)
    continue

  _mm.modelMotions[0].process_bones = (_mm.para_SA.process_bones || MMD_SA_options.motion[k].process_bones)
}
mmd.play()

MMD_SA.motion_shuffle()

//DEBUG_show('(NOTE: PMD model support in System Animator is obsolete. Please use PMX model instead.)')
      })
    }
  })
});
// MMD.js END
}

  }


// custom modes START
 ,_music_mode_: false
 ,set music_mode(v) { this._music_mode_=!!v; }
 ,get music_mode() {
if (this._music_mode_) return true;

var mode
if (MMD_SA_options.MMD_disabled) {
  if (DragDrop.relay_id != null) {
    var w_obj = document.getElementById("Ichild_animation" + DragDrop.relay_id).contentWindow
    mode = w_obj.SL && w_obj.SL._mouse_event_main && w_obj.SL._mouse_event_main()
  }
  else {
    mode = !!(SL._media_player && SL._media_player.currentTime) || (self.AudioFFT && AudioFFT.use_live_input)
  }
}
else {
  mode = Audio_BPM.vo.BPM_mode || Audio_BPM.vo.motion_by_song_name_mode
}
return mode
  }

 ,get _busy_mode1_() {
return this._marker_runner_mode_ || (this._hit_legs_ || this._hit_head_)
  }
// END


 ,process_bone: function (bones, name, rotation, mod) {
if (bones[name]) {
  var bone = { location: bones[name].location }
  var bone_rotation
  if (mod) {
    bone_rotation = quat4.toEuler(bones[name].rotation)
    bone_rotation = [bone_rotation[0] * mod[0], bone_rotation[1] * mod[1], bone_rotation[2] * mod[2]]
    if (!Array.isArray(rotation))
      rotation = quat4.toEuler(rotation)
    bone.rotation = quat4.fromEuler(rotation[0]+bone_rotation[0], rotation[1]+bone_rotation[1], rotation[2]+bone_rotation[2])
  }
  else {
    if (Array.isArray(rotation))
      rotation = quat4.fromEuler(rotation[0], rotation[1], rotation[2])
    bone.rotation = quat4.multiply(rotation, bones[name].rotation)
  }
  bones[name] = bone
}
else {
  var loc = new Float32Array(3)
  loc[0] = loc[1] = loc[2] = 0
  if (Array.isArray(rotation))
    rotation = quat4.fromEuler(rotation[0], rotation[1], rotation[2])
  bones[name] = {
    location: loc
   ,rotation: rotation
  }
}
  }

 ,match_bone: function (name, match) {
if (!match || match.all_bones || (match.bone_name && (match.bone_name.indexOf(name) != -1)) || (match.bone_group && MMD_SA.model.bone_table_by_name[name] && (match.bone_group.indexOf(MMD_SA.model.bone_table_by_name[name].group_name) != -1) && (!match.bone_name_RE || match.bone_name_RE.test(name))))
  return true
return false
  }

 ,copy_first_bone_frame: function (index, bones, match) {
var mm = MMD_SA.motion[index]
if (!match)
  match = MMD_SA_options.motion[index].match

for (var name in bones) {
  if (!MMD_SA.match_bone(name, match) || !bones[name])
    continue
  var bm = mm.modelMotions[0].boneMotions[name]
  if (!bm)
    continue

  bm[0].location = bones[name].location
  bm[0].rotation = bones[name].rotation
}
  }

 ,get_parent_bone_list: function (model, bone_name) {
var bt = model.bone_table_by_name[bone_name]
if (!bt)
  return []

var bone_index = bt.index
var bones = model.bones
var bone = bones[bone_index]
if (bone.parent_bone_name_list)
  return bone.parent_bone_name_list

var list = []
var table = model.bone_table
var p_index = bone.parent_bone_index
while (table[p_index] && (p_index != bone_index)) {
  list.push(bones[p_index].name)
  p_index = bones[p_index].parent_bone_index
}

bone.parent_bone_name_list = list
return list
  }

 ,custom_action_default: {
    "kissing": {
      action: {
        condition: function (is_bone_action, objs) {
var is_kissing
var busy = MMD_SA.use_jThree && (((MMD_SA_options.allows_kissing) ? MMD_SA.MMD.motionManager.para_SA.allows_kissing==false : !MMD_SA.MMD.motionManager.para_SA.allows_kissing) || MMD_SA.music_mode || MMD_SA._busy_mode1_ || MMD_SA._horse_machine_mode_)

if (MMD_SA.use_jThree && !busy && MMD_SA_options.use_JSARToolKit) {
  var AR_obj = MMD_SA.AR_obj
  if (AR_obj._m4) {
    var AR_para = MMD_SA_options.AR_para
    var marker = AR_obj.markers[AR_para.marker_base_id]
    var position = marker._camera_position
    var rotation = MMD_SA.TEMP_v3.setEulerFromQuaternion(marker.rotation)
//MMD_SA._debug_msg = [Math.abs(rotation.z)+','+position.length()]
    if ((Math.abs(rotation.z) < 45*Math.PI/180) && (position.y > 20) && (position.length() < 35)) {
      is_kissing = true
    }
  }
}
else if (MMD_SA.use_jThree && !busy && (MMD_SA.camera_position.y > MMD_SA._head_pos.y) && (Math.abs(MMD_SA.camera_position.x - MMD_SA._head_pos.x) < 10) && (MMD_SA._head_pos.distanceTo(MMD_SA.camera_position) < 18)) {
  is_kissing = true
}
else {
  is_kissing = self.HeadTrackerAR && HeadTrackerAR.running && (HeadTrackerAR._cz > 1+0.333*0.25);
}

if (MMD_SA.use_jThree) {
  var _vmd = MMD_SA.vmd_by_filename[MMD_SA.MMD.motionManager.filename]
  if (_vmd && _vmd.use_armIK)
    is_kissing = false
}

if (is_kissing) {
  if (!this._kissing) {
    this.frame = 0
  }
  if (is_bone_action && !this.frame)
    MMD_SA.copy_first_bone_frame(this.motion_index, objs, {bone_group:["腕"], skin_jThree:/^(\u5DE6|\u53F3)(\u80A9|\u8155|\u3072\u3058|\u624B\u9996|\u624B\u6369)/})
  this._kissing = MMD_SA.meter_motion_disabled = true
}

if (is_bone_action && this._kissing) {
  if (self.HeadTrackerAR)
    HeadTrackerAR._cz_mod = 2/HeadTrackerAR._cz

  var m = MMD_SA.motion[this.motion_index||1]
  var mod
  if (this.frame > m.lastFrame-15)
    mod = m.lastFrame - this.frame
  else if (this.frame < 15)
    mod = this.frame
  else
    mod = 15
  mod = mod*2 / 180 * Math.PI

  if (MMD_SA.use_jThree) {
    var bones = objs.mesh.bones_by_name
    var head = bones["頭"]
    var neck = bones["首"]

    var head_ry = (head) ? MMD_SA._v3a.setEulerFromQuaternion(head.quaternion).y : 0
    var neck_ry = (neck) ? MMD_SA._v3a.setEulerFromQuaternion(neck.quaternion).y : 0
//DEBUG_show(bones["上半身"])
//    MMD_SA.process_bone(bones["上半身"], [mod, head_ry+neck_ry, 0])
    MMD_SA.process_bone(head, [-mod/2, 0, 0], (head_ry)?[1,0,1]:null)
    MMD_SA.process_bone(neck, [-mod/2, 0, 0], (neck_ry)?[1,0,1]:null)

    if (this.frame >= 44) {
      var ratio = (this.frame - 44) / ((m.lastFrame-15) - 44)
      if (ratio > 1)
        ratio = 1

      var kiss = MMD_SA_options.mesh_obj_by_id["KissMESH"]
      var head_pos = MMD_SA._v3a.copy(MMD_SA._head_pos)
      head_pos.y += 1
      kiss._obj.position.copy(head_pos.add(MMD_SA._v3b.copy(MMD_SA.camera_position).sub(head_pos).multiplyScalar(0.2 + ratio*0.6)))
      kiss._obj.rotation = MMD_SA.face_camera(kiss._obj.position, null, true)
      kiss._obj.scale.x = kiss._obj.scale.y = kiss._obj.scale.z = 0.5 + ratio * 0.5
      kiss.show()
    }

    if (MMD_SA_options.use_speech_bubble && (this.frame == 0))
      MMD_SA.SpeechBubble.message(0, ["Here is your X'mas kiss~\n\u2661"].shuffle()[0], 5000, { pos_mod:[-3,-5,0] })
//"主人，錫錫～\u2661", "飛吻啊，主人～\u2661"
  }
  else {
    var head_ry = (objs["頭"]) ? quat4.toEuler(objs["頭"].rotation)[0] : 0
    var neck_ry = (objs["首"]) ? quat4.toEuler(objs["首"].rotation)[0] : 0
//DEBUG_show([mod, head_ry+neck_ry])
    MMD_SA.process_bone(objs, "上半身", [head_ry+neck_ry, 0, mod])
    MMD_SA.process_bone(objs, "頭", [0, 0, -mod/2], (head_ry)?[0,1,1]:null)
    MMD_SA.process_bone(objs, "首", [0, 0, -mod/2], (neck_ry)?[0,1,1]:null)
  }
}

return this._kissing
        }

       ,look_at_mouse_disabled: true

       ,_HeadTrackerAR_timerID: null
       ,onFinish: function () {
var that = this
if (this._HeadTrackerAR_timerID)
  clearTimeout(this._HeadTrackerAR_timerID)
this._HeadTrackerAR_timerID = setTimeout(function () { if (!that.kissing && self.HeadTrackerAR) HeadTrackerAR._cz_mod=1; }, 100)

if (MMD_SA.use_jThree)
  MMD_SA_options.mesh_obj_by_id["KissMESH"].hide()

this._kissing = MMD_SA.meter_motion_disabled = false
        }
//       ,motion_index: 1
      }

     ,motion: {path:'MMD.js/motion/motion_basic_pack01.zip#/_kiss2_blush_v02.vmd', match:{all_morphs:true, skin_jThree:true, morph_jThree:true}}
    }

   ,"cover_undies": {
      action: {
        condition: function (is_bone_action, objs) {
if (objs._model_index) return false

var busy = MMD_SA._busy_mode1_ || !MMD_SA_options.look_at_screen
if (MMD_SA._hit_hip_ || ((MMD_SA_options.model_para_obj._cover_undies != false) && (MMD_SA.MMD.motionManager.para_SA._cover_undies != false) && !busy && !MMD_SA.custom_action_default.kissing.action._kissing && (((MMD_SA._rx*180/Math.PI) % 360 > 45 * ((MMD_SA.use_jThree) ? 0.75 : 1)) || (MMD_SA.use_jThree && MMD_SA_options.use_JSARToolKit && MMD_SA.AR_obj._m4 && (MMD_SA.AR_obj.camera_position.y < 10)))/* && !Audio_BPM.vo.motion_by_song_name_mode*/)) {
  this._undies_visible = true
  if (!this._cover_undies) {
    this.frame = 0
    if (MMD_SA_options.use_speech_bubble)
      this._onmessage()
  }
  if (is_bone_action && !this.frame) {
    MMD_SA.copy_first_bone_frame(this.motion_index, objs, {bone_group:["腕"], skin_jThree:/^(\u5DE6|\u53F3)(\u80A9|\u8155|\u3072\u3058|\u624B\u9996|\u624B\u6369)/})
  }

  if (is_bone_action && MMD_SA.use_jThree) {
    MMD_SA._update_with_look_at_screen_ = { bone_list:["左肩", "右肩"], parent_list:["上半身2", "上半身"] }
  }

  this._cover_undies = true
}
else
  this._undies_visible = false
//DEBUG_show(this.frame); 
return this._cover_undies
        }

       ,_onmessage: function () {
if (MMD_SA_options.Dungeon && MMD_SA_options.Dungeon_options.use_PC_click_reaction_default) return
MMD_SA.SpeechBubble.message(((MMD_SA.music_mode)?2:0), ["Hey...\n>_<", "Where are you looking at...\n>_<"].shuffle()[0])
        }

       ,onFinish: function () {
if (MMD_SA._hit_body_defined_ && !MMD_SA._hit_body_but_hip_)
  MMD_SA_options.Dungeon._states.object_click_disabled = false

if (this._undies_visible) {
  this.frame=15
} else {
  this._cover_undies=false
}
        }
//       ,motion_index: 2
      }

     ,motion: {path:'MMD.js/motion/motion_basic_pack01.zip#/_cover_undies_blush.vmd', match:{bone_group:["腕","指"], all_morphs:true, skin_jThree:/^(\u5DE6|\u53F3)(\u80A9|\u8155|\u3072\u3058|\u624B\u9996|\u624B\u6369|.\u6307.)/, morph_jThree:true}}

     ,animation_check: function (idx) {
if (!MMD_SA.use_jThree)
  return true

var _vmd = MMD_SA.vmd_by_filename[MMD_SA.MMD.motionManager.filename];
if (this._is_skin) {
  return _vmd && !_vmd.use_armIK && !MMD_SA._horse_machine_mode_;
}

var keys = this.targets[idx].keys
var name = keys[0].name
var model_para_obj = MMD_SA_options.model_para_obj_all[this._model_index]
var md = model_para_obj.morph_default && model_para_obj.morph_default[name]
if (md && (!md.weight_scale || md.weight)) {
  keys[0].weight = keys[1].weight = (!md.motion_filter || md.motion_filter.test(decodeURIComponent(_vmd.url))) ? (md.weight||1) : 0
}
/*
//DEBUG_show(name,0,1)
if ((name=="お")) {
//DEBUG_show([keys[0].weight, keys[1].weight],0,1);
//keys[0].weight = keys[1].weight = keys[2].weight = 0.1
//return false;
}
*/
return true
      }
    }
  }

 ,vmd_by_filename: {}

 ,fadeout_opacity: null

 ,motion_shuffle_index: -1
 ,motion_shuffle_started: false
 ,motion_shuffle: function () {
var vo = Audio_BPM.vo
var ignore_para = vo.motion_by_song_name_mode

var mmd = this.MMD
var mm = mmd.motionManager
var para = (ignore_para) ? {} : mm.para_SA

var range

var motion_changed = false

var fading
// check the backup list ._motion_shuffle_list_default instead of .motion_shuffle_list_default since .motion_shuffle_list_default can be null sometimes
if (!MMD_SA_options._motion_shuffle && !MMD_SA_options._motion_shuffle_list_default) {
  fading = (this.motion_shuffle_started && para.loopback_fading)

  if (para.range) {
    mm.range_index = random(para.range.length)
    range = para.range[mm.range_index]
  }
  else
    range = { time:[0,0] }
  mm.firstFrame_ = range.time[0]
  mm.lastFrame_  = (range.time[1] || mm.lastFrame)
}
else {
  var motion_index_old = (this._force_motion_shuffle || !MMD_SA_options.motion_shuffle_list || (this.motion_shuffle_index == -1)) ? -1 : MMD_SA_options.motion_shuffle_list[this.motion_shuffle_index]
  if (this._force_motion_shuffle || (!para.loop_count && (!MMD_SA_options.motion_shuffle_list || (++this.motion_shuffle_index >= MMD_SA_options.motion_shuffle_list.length)))) {
    MMD_SA_options.motion_shuffle_list = (MMD_SA_options.motion_shuffle_list_default && MMD_SA_options.motion_shuffle_list_default.slice(0).shuffle()) || MMD_SA_options._motion_shuffle_list || MMD_SA_options.motion_shuffle.slice(0).shuffle()
//if (MMD_SA_options._motion_shuffle_list) DEBUG_show(MMD_SA_options.motion_shuffle_list,0,1)
    MMD_SA_options._motion_shuffle_list = null
    this.motion_shuffle_index = 0
  }

  var motion_index = MMD_SA_options.motion_shuffle_list[this.motion_shuffle_index]

  if ((motion_index_old != motion_index) || (MMD_SA.motion_index_for_external == motion_index)) {
    var filename_old = (this.use_jThree) ? ((this.motion_shuffle_started) ? mm.filename : "<CHANGED>") : null

    mm = mmd.motionManager = this.motion[motion_index]
    para = (ignore_para) ? {} : mm.para_SA
    para.loop_count = 0

    motion_changed = (filename_old) ? (filename_old != mm.filename) : ((motion_index_old != -1) || (motion_index != 0))
    fading = (this.motion_shuffle_started && (motion_changed || para.loopback_fading))
  }
  else {
    fading = para.loopback_fading
  }

  if (para.range) {
    mm.range_index = random(para.range.length)
    range = para.range[mm.range_index]
  }
  else
    range = { time:[0,0], random_range_disabled:ignore_para }
  mm.firstFrame_ = range.time[0]
  mm.lastFrame_  = (range.time[1] || mm.lastFrame)

  if (para.loop) {
    if (!para.loop_count) {
      para.loop_count = 0
      para.loop_max = para.loop[0] + random((para.loop[1]-para.loop[0])+1) + 1
    }
    if (++para.loop_count > para.loop_max)
      para.loop_count = 0
  }
  else {
//mm.firstFrame_ = 2000
//mmd.setFrameNumber(2000)
    var BPM = ((para.BPM && para.BPM.BPM) || 120)
    var playbackRate = (vo.BPM_mode) ? vo._sender.playbackRate : 120/BPM
    var r_base = (para.random_range_time_base || MMD_SA_options.random_range_time_base || 20)
    var r = Math.round(r_base * playbackRate)
    if (!(range.random_range_disabled || para.random_range_disabled || MMD_SA_options.random_range_disabled) && (mm.lastFrame_ - mm.firstFrame_ > (r*2+10)*30)) {
      var length = random(r*30) + r*30
      mm.firstFrame_ += random((mm.lastFrame_ - mm.firstFrame_) - length)
      mm.lastFrame_  = mm.firstFrame_ + length
    }
//DEBUG_show([mm.firstFrame_,mm.lastFrame_],0,1)
  }
//DEBUG_show(this.motion_shuffle_index+'/'+motion_index+'/'+MMD_SA_options.motion_shuffle_list+'/'+JSON.stringify(range)+'/'+parseInt(mm.lastFrame)+'/'+parseInt(THREE.MMD.getModels()[mm._model_index]._MMD_SA_cache[MMD_SA_options.motion[mm._index].path].skin.duration*30),0,1)
}

this.motion_shuffle_started = true

if (mm.firstFrame_)
  mmd.setFrameNumber(mm.firstFrame_)

if (MMD_SA._no_fading)
  fading = MMD_SA._no_fading = false
var xr = this.WebXR
this.fading = fading && (!xr.session || (xr.use_dummy_webgl && (!xr.user_camera.initialized || xr.user_camera.visible)));
if (!fading)
  return motion_changed


//return motion_changed

this.fadeout_texture_uploaded = false

var w = SL.width;
var h = SL.height;
//var ini = parseInt((w * h) * Math.random()) * 4
/*
var gl = MMD_SA.MMD.gl;
if (!MMD_SA.fadeout_image)
  MMD_SA.fadeout_image = new Uint8Array(w * h * 4);
gl.readPixels(0, 0, w, h, gl.RGBA, gl.UNSIGNED_BYTE, MMD_SA.fadeout_image);
for (var i = 0; i < 8; i++)
  DEBUG_show(MMD_SA.fadeout_image[ini + i],0,1)
*/
// for desktop and mobile
MMD_SA.fadeout_canvas.width  = SL.width
MMD_SA.fadeout_canvas.height = SL.height
var context = MMD_SA.fadeout_canvas.getContext("2d")
context.globalCompositeOperation = 'copy'
context.drawImage(SL, 0,0)
/*
var imagedata = context.getImageData(0,0,w,h).data
for (var i = 0; i < 8; i++)
  DEBUG_show(imagedata[ini + i],0,1)
*/
//DEBUG_show("(pixels read)",0,1)

this.fadeout_opacity = 0.95

return motion_changed
  }

 ,load_external_motion: function (src, _onload) {
var name_new = src.replace(/^.+[\/\\]/, "").replace(/\.vmd$/i, "")

var index = MMD_SA.motion_index_for_external
var m = MMD_SA_options.motion[index]
var path_old = m.path
var name_old = (path_old) ? m.path.replace(/^.+[\/\\]/, "").replace(/\.vmd$/i, "") : ""
if (name_old) {
  MMD_SA_options.motion_index_by_name[name_old] = null
//DEBUG_show(name_old,0,1)
}

var model = THREE.MMD.getModels()[0]

function _finalize() {
  MMD_SA_options.motion_index_by_name[name_new] = index
  var m = MMD_SA_options.motion[index] = { path:src }

// assigning a new MotionManager() ensures that motion change can be detected in .motion_shuffle() even though the motion index remains the same
  var mm = MMD_SA.motion[index] = new MMD_SA.MMD.MotionManager()
  mm.filename = name_new
  mm.para_SA = MMD_SA_options.motion_para[name_new] || { random_range_disabled:true }
  mm._index = mm.para_SA._index = index
  mm.para_SA._path = src

  if (_onload) {
    _onload()
  }
  else {
    MMD_SA_options.motion_shuffle = [index]
    MMD_SA_options.motion_shuffle_list_default = null
    MMD_SA._force_motion_shuffle = true
  }
}

function _vmd(vmd_morph) {
  model._VMD(toFileProtocol(src), function( vmd ) {
    vmd._index = MMD_SA.motion_index_for_external

    if (vmd_morph) {
      vmd._morph_component = vmd_morph
      vmd._morph_component.url = vmd.url
    }

    model._MMD_SA_cache[src] = model.setupMotion_MMD_SA(vmd)

    for (var i = 1, i_max = MMD_SA_options.model_para_obj_all.length; i < i_max; i++) {
      var model_para = MMD_SA_options.model_para_obj_all[i]
      if (model_para.mirror_motion_from_first_model) {
        var _model = THREE.MMD.getModels()[i]
        _model._MMD_SA_cache[src] = _model.setupMotion_MMD_SA(vmd)
      }
    }

    _finalize()
  });
}

if (MMD_SA.vmd_by_filename[name_new]) {
  _finalize()
}
else {
  let para_SA = MMD_SA_options.motion_para[name_new] = MMD_SA_options.motion_para[name_new] || {}
  if (para_SA.morph_component_by_filename) {
    model._VMD(toFileProtocol(src.replace(/[^\/\\]+$/, "")) + para_SA.morph_component_by_filename + ".vmd", function( vmd ) {
      _vmd(vmd)
    });
  }
  else {
    _vmd()
  }
}
  }

 ,seek_motion: function (time, must_update) {
if (this.use_jThree) {
  must_update = must_update && !THREE.MMD.motionPlaying
  if (must_update) jThree.MMD.play(true)
  THREE.MMD.getModels().forEach(function (model) {
    model.seekMotion(time)
    model.mesh._reset_rigid_body_physics_ = MMD_SA_options.reset_rigid_body_physics_step
  });
  if (must_update) jThree.MMD.pause()
}
else
  this.MMD.setFrameNumber(parseInt(time*30)-1)
  }

// getter/setter on MMD_SA.meter_motion_disabled instead of MMD_SA_options.meter_motion_disabled for backward compatibility (PMD version)
 ,get meter_motion_disabled()  {
return (MMD_SA.music_mode || MMD_SA._busy_mode1_ || this.MMD.motionManager.para_SA.meter_motion_disabled || this._meter_motion_disabled || MMD_SA_options.meter_motion_disabled || (WallpaperEngine_CEF_mode && (MMD_SA_options.meter_motion_disabled == null)))
  }
 ,set meter_motion_disabled(b) { this._meter_motion_disabled = b; }

 ,_j3_obj_by_id: {}
 ,_debug_msg: []

 ,_rx: 0
 ,_ry: 0

 ,MME_PPE_scale_getter: function (w, h) {
// return a non-zero dummy value (0.5) when MMD_SA has not been initialized
var v = (MMD_SA.initialized) ? Math.min((w * h) / (SL.width * SL.height), 1) : 0.5
//setTimeout('DEBUG_show("' + (v+'/'+SL.width +"x"+ SL.height) + '",0,1)', 1000)
return v
  }

 ,MME_PPE_init: function (effect_name, tex_list, para) {
var EC = MMD_SA_options.MME.PostProcessingEffects
if (!EC._texture_common)
  EC._texture_common = {}

this._texture_list = tex_list || []

if ((this._texture_list.indexOf('[music canvas]') != -1) && !EC._music_canvas) {
  EC._music_canvas = document.createElement("canvas")
  EC._music_canvas.width  = 512
  EC._music_canvas.height = 2
}

this._texture_list.forEach(function (src) {
  var src_para = src.split("|")
  src = src_para[0]
  var filename = src.replace(/^.+[\/\\]/, "")
//console.log(filename+'/'+src)
  if (filename == '[music canvas]') {
    if (!EC._texture_common[filename]) {
      var mc = EC._texture_common[filename] = new THREE.Texture(EC._music_canvas)
      mc.generateMipmaps = false
      mc.minFilter = mc.magFilter
      mc.needsUpdate = true
    }
  }
  else {
    var _src
    if (src_para.length==1) {
      _src = toFileProtocol(src)
    }
    else {
      if (/^(.+\_)0(\.\w{3,4})$/.test(src)) {
        _src = []
        var re1 = RegExp.$1
        var re2 = RegExp.$2
        for (var i = 0; i < 6; i++)
          _src.push(toFileProtocol(re1 + i + re2))
//console.log(_src)
      }
    }

    EC._texture_common[filename] = EC._texture_common[filename] || THREE.ImageUtils[(src_para.length==1) ? "loadTexture" : "loadTextureCube"](_src, undefined, function (tex) { tex.needsUpdate=true });
    EC._texture_common[filename].wrapS = EC._texture_common[filename].wrapT = THREE.RepeatWrapping;
  }
});

var u_para = {'iResolution':{}, 'iGlobalTime':{}}
if (para) {
  for (var u_name in para)
    u_para[u_name] = para[u_name]
}

var u = this.uniforms

u["tDiffuse"] = { type: "t", value: null }
u["SA_idle"] =  { type: "i", value: 0 }
u["SA_idle_hidden"] =  { type: "i", value: 0 }
if (u_para["iResolution"])
  u["iResolution"] =  { type: "v3", value: new THREE.Vector3(640,480,1) }
if (u_para["iGlobalTime"])
  u["iGlobalTime"] =  { type: "f", value: 0 }
if (u_para["ST_opacity"])
  u["ST_opacity"] =  { type: "f", value: 0 }

for (var i = 0, i_max = this._texture_list.length; i < i_max; i++) {
  u["iChannel" + i] = { type: "t", value: null }
}

var fs_uniforms = [
		"varying vec2 vUv;",
"uniform sampler2D tDiffuse;",
((u_para["iResolution"]) ? "uniform vec3 iResolution;"  : ""),
((u_para["iGlobalTime"]) ? "uniform float iGlobalTime;" : ""),
"uniform bool SA_idle;",
"uniform bool SA_idle_hidden;"
];

this._texture_list.forEach(function (src, i) {
  fs_uniforms.push("uniform " + ((src.split("|").length==1) ? "sampler2D" : "samplerCube") + " iChannel" + i + ";")
});

if (u_para.ST_opacity) {
  fs_uniforms.push("uniform float ST_opacity;")
}

if (/^(AbstractCorridor|Cubescape|FractalCondos|FunkyDiscoBall|RemnantX|Ribbons|SubterraneanFlyThrough)$/.test(effect_name)) {
  fs_uniforms.push('#define SOLID_BG')
}
else if (WallpaperEngine_CEF_mode) {
  if (!returnBoolean("SA_Shadertoy_transparent"))
    fs_uniforms.push('#define SOLID_BG')
}
else if (EC.use_solid_bg || (EC.effects_by_name[effect_name] && EC.effects_by_name[effect_name].use_solid_bg) || ((EC.use_solid_bg == null) && !MMD_SA_options.MMD_disabled && returnBoolean("CSSTransformFullscreen") && (returnBoolean("AutoItStayOnDesktop") || returnBoolean("DisableTransparency")))) {
  fs_uniforms.push('#define SOLID_BG')
}

this.fragmentShader = fs_uniforms.join("\n") + "\n" + this.fragmentShader
  }

 ,MME_PPE_refreshUniforms: function (effect_name, refresh_all_uniforms, para) {
var EC = MMD_SA_options.MME.PostProcessingEffects
var e = EC._effects[effect_name]

var u_para = {'iResolution':{}, 'iGlobalTime':{}}
if (para) {
  for (var u_name in para)
    u_para[u_name] = para[u_name]
}

if (refresh_all_uniforms) {
  if (u_para['iResolution'])
    e.uniforms[ 'iResolution' ].value = new THREE.Vector3(EC._width, EC._height, 1);

  this._texture_list.forEach(function (src, idx) {
    var filename = src.split("|")[0].replace(/^.+[\/\\]/, "")
    e.uniforms[ 'iChannel' + idx ].value = EC._texture_common[filename]
  });
}

var idle_effect_disabled = EC.effects_by_name[effect_name] && EC.effects_by_name[effect_name].idle_effect_disabled
e.uniforms[ 'SA_idle' ].value = (MMD_SA.music_mode) ? 0 : 1
if (EC.idle_effect_disabled || ((EC.idle_effect_disabled !== false) && (idle_effect_disabled || ((idle_effect_disabled == null) && /^(AbstractMusic|Adrenaline|AmbilightVisualization2|AudioEQCircles|AudioSurfII|DancingDots|EmbellishedAV|Ribbons)$/.test(effect_name))))) {
  e.uniforms[ 'SA_idle_hidden' ].value = e.uniforms[ 'SA_idle' ].value
}

if (u_para['iGlobalTime']) {
  e.uniforms[ 'iGlobalTime' ].value = performance.now()/1000 * (u_para['iGlobalTime'].scale||1) + (u_para['iGlobalTime'].base||0);
}

if (u_para['ST_opacity']) {
  var w_beat = (MMD_SA_options.MMD_disabled && (DragDrop.relay_id != null)) ? document.getElementById("Ichild_animation" + DragDrop.relay_id).contentWindow : self
  var beat = (w_beat.EV_usage_sub && w_beat.EV_usage_sub.BD) ? w_beat.EV_usage_sub.BD.beat : 0

  var beat_pow = u_para['ST_opacity'].pow || 1
  var beat_decay = u_para['ST_opacity'].decay || 0.2
  var beat_min = (u_para['ST_opacity'].min == null) ? 0.25 : u_para['ST_opacity'].min
  var beat_max = u_para['ST_opacity'].max || 1-beat_min
  var beat_idle = (u_para['ST_opacity'].idle == null) ? 1 : u_para['ST_opacity'].idle

  e.uniforms[ 'ST_opacity' ].value = (!MMD_SA.music_mode && (!MMD_SA_options.MMD_disabled || !(self.AudioFFT && AudioFFT.use_live_input)) && beat_idle) || beat_min + Math.pow(EC.effects_by_name[effect_name]._EV_usage_PROCESS(beat, beat_decay), beat_pow) * beat_max
}
  }

 ,MME_PPE_main: function (effect_name) {
var PPE = MMD_SA_options.MME.PostProcessingEffects || { effects_by_name:{} }
var PPE_by_name = PPE.effects_by_name[effect_name] || {}

var fg_opacity = 0.8
var effect_opacity = 1.0
var shader_color_adjust_pre = []
var shader_color_adjust_post = []
var use_simple_blending = false
var effect_on_top = false

var bg_blackhole_opacity  = 0.8
var feather_width = 0.25

var is_render_target = PPE_by_name.scale || PPE_by_name.is_render_target

switch (effect_name) {
  case "JustSnow":
    effect_on_top = true
    bg_blackhole_opacity = 0
    break
  case "AudioEQCircles":
    feather_width *= 0.5
  case "AbstractMusic":
  case "AudioSurfII":
  case "EmbellishedAV":
    effect_opacity = 0.8
  case "AudioSurfIII":
  case "NoiseAnimationFlow":
  case "NoiseAnimationElectric":
    bg_blackhole_opacity = 0
    break
  case "GalaxyOfUniverses":
//    bg_blackhole_opacity = 0.5
    shader_color_adjust_post = [
//(color.r + color.g + color.b) / 3.0
//color.r * 0.2126 + color.g * 0.7152 + color.b * 0.0722
'color.rgb = mix(vec3((color.r * 0.2126 + color.g * 0.7152 + color.b * 0.0722) * 0.5), color.rgb, ST_opacity);'
    ];
    break
  case "DeformReliefTunnel":
    bg_blackhole_opacity = 0
  case "AbstractCorridor":
  case "Cubescape":
  case "FractalCondos":
  case "RemnantX":
  case "SubterraneanFlyThrough":
  case "FunkyDiscoBall":
    fg_opacity = 0.9
  case "NV15SpaceCurvature":
    use_simple_blending = true
    break
/*
  case "BloomPostProcess":
    is_render_target = true
    feather_width = 0
    bg_blackhole_opacity = 0
    break
*/
}

if (PPE_by_name.fg_opacity)
  fg_opacity = PPE_by_name.fg_opacity

var fullscreen = returnBoolean("CSSTransformFullscreen") && returnBoolean("AutoItStayOnDesktop")
//console.log(fullscreen)
bg_blackhole_opacity = (PPE_by_name.bg_blackhole_opacity==0 || (PPE.bg_blackhole_opacity==0 && !PPE_by_name.bg_blackhole_opacity) || fullscreen) ? 0 : bg_blackhole_opacity
feather_width = (PPE_by_name.feather_width==0 || (PPE.feather_width==0 && !PPE_by_name.feather_width) || fullscreen) ? 0 : (PPE_by_name.feather_width || PPE.feather_width || feather_width)

var toFloat = MMD_SA_options.MME._toFloat

var shader_feather = [
'vec2 xy = vUv - vec2(0.5, 0.5);',
'float len = length(xy);'
];

if (feather_width) {
  shader_feather.push(
'#ifndef SOLID_BG',
'if (len > 0.0) {',
'  float scale = 0.5 / max(abs(xy.x), abs(xy.y));',
'  xy *= scale;',
'  float len_max = length(xy);',
'  color.a *= smoothstep(len_max,len_max * ' + toFloat(1-feather_width) + ', len);',
'}',
'#endif'
  );
} 

var shader_bg_blackhole = []
if (bg_blackhole_opacity) {
  shader_bg_blackhole.push(
'#ifndef SOLID_BG',
'float bg_a = smoothstep(1.0,0.5, clamp(len * 2.0, 0.0,1.0)) * ' + toFloat((is_render_target) ? Math.pow(bg_blackhole_opacity, 0.5) : bg_blackhole_opacity) + ';',//toFloat((is_render_target) ? bg_blackhole_opacity : Math.pow(bg_blackhole_opacity, 0.5)) + ';',
'if (bg_a > 0.0) {',

//(gl_FragColor.r + gl_FragColor.g + gl_FragColor.b) / 3.0
//(max(gl_FragColor.r, max(gl_FragColor.g, gl_FragColor.b)) + min(gl_FragColor.r, min(gl_FragColor.g, gl_FragColor.b))) / 2.0
//gl_FragColor.r*0.2126 + gl_FragColor.g*0.7152 + gl_FragColor.b*0.0722
//vec3(0.0), gl_FragColor.rgb, gl_FragColor.a + (1.0-gl_FragColor.a) * (1.0-pow(bg_a,0.5))
//mix(vec3(), vec3(0.0), bg_a), gl_FragColor.rgb, gl_FragColor.a

'  gl_FragColor = vec4(mix(vec3(0.0), gl_FragColor.rgb, gl_FragColor.a + (1.0-gl_FragColor.a) * (1.0-pow(bg_a,1.0/2.718281828459))), bg_a + (1.0-bg_a) * gl_FragColor.a);',//bg_a + (1.0-bg_a) * ' + ((is_render_target) ? 'gl_FragColor.a' : 'pow(gl_FragColor.a, 0.5)') + ');',

//'  gl_FragColor = vec4(mix(vec3(0.0), gl_FragColor.rgb, gl_FragColor.a), max(bg_a, gl_FragColor.a));',
'}',
'#endif'
  );
}
//else
if (!is_render_target) {
  shader_bg_blackhole.push(
'gl_FragColor.a = pow(gl_FragColor.a, 0.5);'
  );
}

var shader = [
'vec4 texel = texture2D( tDiffuse, vUv );',

'if (SA_idle_hidden) { gl_FragColor = vec4(texel.rgb, pow(texel.a, 0.5)); return; }',

'vec4 color;',
'vec2 coord = vec2(0.5) + (vUv * (iResolution.xy - vec2(1.0)));',
'mainImage(color, coord);'
];

if (is_render_target) {
  shader.push(
shader_feather.join("\n"),

'#ifdef SOLID_BG',
//'  gl_FragColor = color;',
'  gl_FragColor = vec4(mix(vec3(0.0),color.rgb,color.a), 1.0);',
'#else',
'  gl_FragColor = color;',
'#endif',

shader_bg_blackhole.join("\n")
  );
}
else {
  shader.push(
//http://entropymine.com/imageworsener/grayscale/
//http://www.johndcook.com/blog/2009/08/24/algorithms-convert-color-grayscale/
//https://en.wikipedia.org/wiki/Luma_%28video%29
//The formula for luminosity is 0.2126×Red + 0.7152×Green + 0.0722×Blue
//'color.a = (color.r + color.g + color.b) / 3.0;',
'color.rgb = clamp(color.rgb, 0.0,1.0);',

((PPE_by_name.opacity < 1) ? 'color.a *= ' + toFloat(PPE_by_name.opacity) + ';' : ''),

shader_color_adjust_pre.join("\n"),

'#ifdef SOLID_BG',

shader_color_adjust_post.join("\n"),

'gl_FragColor = vec4(texel.rgb + color.rgb * (1.0 - texel.a * ' + toFloat(fg_opacity) + '), 1.0);',
'#else',

shader_feather.join("\n")
  );

  if (use_simple_blending) {
    shader.push(
shader_color_adjust_post.join("\n"),
'gl_FragColor = vec4(texel.rgb + color.rgb * (1.0 - texel.a * ' + toFloat(fg_opacity) + '), texel.a + color.a * (1.0 - texel.a));'
    );
  }
  else {
    shader.push(
'float c_max = max(color.r, max(color.g, color.b));',

'if (c_max > 0.001) {',
'  color.rgb *= 1.0/c_max;',
'  color.a *= c_max * ' + toFloat(effect_opacity) + ';',
'}',
'else { color.a = 0.0; }',

shader_color_adjust_post.join("\n")
    );

    if (effect_on_top) {
      shader.push(
'gl_FragColor = vec4(mix(texel.rgb, color.rgb, color.a), texel.a + color.a * (1.0 - texel.a));'
      );
    }
    else {
      shader.push(
'float color_a = pow(color.a * (1.0 - texel.a*0.8), texel.a * 1.0/max(1.0+(color.a-texel.a), 0.001));',
'gl_FragColor = vec4(texel.rgb * clamp(texel.a * 1.5 / max(color_a, 0.001), 0.0,1.0) + color.rgb * color_a, texel.a + color.a * (1.0 - texel.a));'
      );
    }
  }

  shader.push(
shader_bg_blackhole.join("\n"),

'#endif'
  );
}
//console.log(shader.join("\n"))

return shader.join("\n")
  }

 ,vshader_2d:
  'attribute vec2 a_position;\n'
+ 'attribute vec2 a_texCoord;\n'
+ 'uniform vec2 u_resolution;\n'
+ 'varying vec2 v_texCoord;\n'
+ 'void main() {\n'
+ '  // convert the rectangle from pixels to 0.0 to 1.0\n'
+ '  vec2 zeroToOne = a_position / u_resolution;\n'
+ '  // convert from 0->1 to 0->2\n'
+ '  vec2 zeroToTwo = zeroToOne * 2.0;\n'
+ '  // convert from 0->2 to -1->+1 (clipspace)\n'
+ '  vec2 clipSpace = zeroToTwo - 1.0;\n'
+ '  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);\n'
+ '  // pass the texCoord to the fragment shader\n'
+ '  // The GPU will interpolate this value between points.\n'
+ '  v_texCoord = a_texCoord;\n'
+ '}\n'

 ,fshader_2d:
  'precision mediump float;\n'
+ '// our texture\n'
+ 'uniform sampler2D u_image;\n'
+ 'uniform float uAlpha;\n'
+ '// the texCoords passed in from the vertex shader.\n'
+ 'varying vec2 v_texCoord;\n'
+ 'void main() {\n'
//+ '  gl_FragColor = texture2D(u_image, v_texCoord);\n'
+ '  vec4 textureColor = texture2D(u_image, v_texCoord);\n'
+ '  gl_FragColor = vec4(textureColor.rgb, textureColor.a * uAlpha);\n'
+ '}\n'

 ,MME_shader_inline_switch_mode: true

 ,MME_shader_branch: function (name, is_open, _not_) {
if (this.MME_shader_inline_switch_mode) {
  return (is_open) ? 'if (' + ((_not_) ? '!' : '') + name + ') {\n' : '}\n'
}
else {
  return (is_open) ? '#if' + ((_not_) ? 'n' : '') + 'def ' + name + '\n' : '#endif\n'
}
  }

 ,MME_shader_fshader: {}

 ,MME_shader: function (name) {
var fvar = ""
var fshader = ""
var mme = MMD_SA_options.MME[name]
if (!(mme.enabled==null || mme.enabled)) {
  if (!this.MME_shader_inline_switch_mode)
    return { fvar:fvar, fshader:fshader }
}

if (!this.MME_shader_fshader[name]) {
  this.MME_shader_fshader[name] = {}

  var toFloat = MMD_SA_options.MME._toFloat

  fvar +=
  ((this.MME_shader_inline_switch_mode) ? 'uniform bool ' + name.toUpperCase() + ';' : '#define ' + name.toUpperCase()) + '\n'

  switch (name) {
    case "self_overlay":
// concepts borrowed from "o_SelfOverlay" MME effect for MMD, by おたもん

fvar +=
  'uniform float self_overlay_opacity;\n'
+ 'uniform float self_overlay_brightness;\n'
+ 'uniform vec3 self_overlay_color_adjust;\n'

fshader +=
  this.MME_shader_branch("SELF_OVERLAY", true)

+ 'vec4 color_temp_self_overlay = gl_FragColor;\n'
+ 'color_temp_self_overlay.rgb *= self_overlay_brightness;\n'
+ 'color_temp_self_overlay.rgb = mix(color_temp_self_overlay.rgb * self_overlay_color_adjust, color_temp_self_overlay.rgb, color_temp_self_overlay.rgb);\n'


+ 'color_temp_self_overlay.r = (gl_FragColor.r < 0.5) ? gl_FragColor.r * color_temp_self_overlay.r * 2.0 : 1.0 - 2.0 * (1.0 - gl_FragColor.r) * (1.0 - color_temp_self_overlay.r);\n'
+ 'color_temp_self_overlay.g = (gl_FragColor.g < 0.5) ? gl_FragColor.g * color_temp_self_overlay.g * 2.0 : 1.0 - 2.0 * (1.0 - gl_FragColor.g) * (1.0 - color_temp_self_overlay.g);\n'
+ 'color_temp_self_overlay.b = (gl_FragColor.b < 0.5) ? gl_FragColor.b * color_temp_self_overlay.b * 2.0 : 1.0 - 2.0 * (1.0 - gl_FragColor.b) * (1.0 - color_temp_self_overlay.b);\n'

/*
branchless test
http://stackoverflow.com/questions/4176247/efficiency-of-branching-in-shaders
- using mix to replace branch
http://stackoverflow.com/questions/20982307/glsl-hlsl-multiple-single-line-conditional-statements-as-opposed-to-single-blo
- it seems ()?: is already considered branchless in some cases?
*/
/*
+ 'color_temp_self_overlay.r = mix(gl_FragColor.r * color_temp_self_overlay.r * 2.0, 1.0 - 2.0 * (1.0 - gl_FragColor.r) * (1.0 - color_temp_self_overlay.r), float(gl_FragColor.r >= 0.5));\n'
+ 'color_temp_self_overlay.g = mix(gl_FragColor.g * color_temp_self_overlay.g * 2.0, 1.0 - 2.0 * (1.0 - gl_FragColor.g) * (1.0 - color_temp_self_overlay.g), float(gl_FragColor.g >= 0.5));\n'
+ 'color_temp_self_overlay.b = mix(gl_FragColor.b * color_temp_self_overlay.b * 2.0, 1.0 - 2.0 * (1.0 - gl_FragColor.b) * (1.0 - color_temp_self_overlay.b), float(gl_FragColor.b >= 0.5));\n'
*/

+ 'gl_FragColor.rgb = mix(gl_FragColor.rgb, color_temp_self_overlay.rgb, self_overlay_opacity);\n'

+ this.MME_shader_branch("SELF_OVERLAY", false)
break

    case "HDR":
// concepts borrowed from "o_Bleach-bypass" MME effect for MMD, by おたもん

fvar +=
  '#define HDR_GAMMA 2.2\n'
+ 'const vec3 LumiFactor = vec3(0.2126, 0.7152, 0.0722);\n'
+ 'uniform float HDR_opacity;\n'

fshader +=
  this.MME_shader_branch("HDR", true)

+ 'vec4 color_temp_HDR = gl_FragColor;\n'

+ 'vec3 negativeGray = pow(color_temp_HDR.rgb, vec3(HDR_GAMMA));\n'
+ 'negativeGray = vec3(1.0 - pow(dot(LumiFactor, negativeGray), 1.0/HDR_GAMMA));\n'

+ 'color_temp_HDR.r = (gl_FragColor.r < 0.5) ? gl_FragColor.r * negativeGray.r * 2.0 : 1.0 - 2.0 * (1.0 - gl_FragColor.r) * (1.0 - negativeGray.r);\n'
+ 'color_temp_HDR.g = (gl_FragColor.g < 0.5) ? gl_FragColor.g * negativeGray.g * 2.0 : 1.0 - 2.0 * (1.0 - gl_FragColor.g) * (1.0 - negativeGray.g);\n'
+ 'color_temp_HDR.b = (gl_FragColor.b < 0.5) ? gl_FragColor.b * negativeGray.b * 2.0 : 1.0 - 2.0 * (1.0 - gl_FragColor.b) * (1.0 - negativeGray.b);\n'

+ 'color_temp_HDR.r = (gl_FragColor.r < 0.5) ? pow(color_temp_HDR.r, 2.0 * (1.0 - gl_FragColor.r)) : pow(color_temp_HDR.r, 1.0 / (2.0 * gl_FragColor.r));\n'
+ 'color_temp_HDR.g = (gl_FragColor.g < 0.5) ? pow(color_temp_HDR.g, 2.0 * (1.0 - gl_FragColor.g)) : pow(color_temp_HDR.g, 1.0 / (2.0 * gl_FragColor.g));\n'
+ 'color_temp_HDR.b = (gl_FragColor.b < 0.5) ? pow(color_temp_HDR.b, 2.0 * (1.0 - gl_FragColor.b)) : pow(color_temp_HDR.b, 1.0 / (2.0 * gl_FragColor.b));\n'

+ 'gl_FragColor.rgb = mix(gl_FragColor.rgb, color_temp_HDR.rgb, HDR_opacity);\n'

+ this.MME_shader_branch("HDR", false)
break

    case "serious_shader":
/*
concepts borrowed from the following MME effects for MMD, by Elle/データP
- SeriousShader
- AdultShader
*/

if (!mme.type)
  mme.type = "SeriousShader"

fvar +=
  'uniform float serious_shader_shadow_opacity;\n'
+ 'uniform float OverBright;\n'
//+ '#define OverBright ' + toFloat((mme.OverBright || ((mme.type == "AdultShaderS2") ? 1.15 : 1.2)) + MMD_SA_options.SeriousShader_OverBright_adjust) + '\n'// 白飛びする危険性をおかして明るくする。
+ 'uniform float ShadowDarkness;\n'// セルフシャドウの最大暗さ
+ 'uniform float ToonPower;\n'// 影の暗さ

//if (mme.type == "SeriousShader") {
  fvar +=
  '#define UnderSkinDiffuse ' + toFloat(mme.UnderSkinDiffuse || 0.2) + '\n'// 皮下散乱
//}
//else {
  fvar +=
  '#define FresnelCoef ' + toFloat(mme.FresnelCoef || 0.08) + '\n'// フレネル項の係数
+ '#define FresnelFact ' + toFloat(mme.FresnelFact || 5) + '\n'// フレネル項
+ 'uniform float EyeLightPower;\n'// 視線方向での色合いの変化
+ 'uniform int serious_shader_mode;\n'
//}

fshader +=
  this.MME_shader_branch("SERIOUS_SHADER", true)

+ '#ifdef METAL\n'
+ '  gl_FragColor.xyz = gl_FragColor.xyz * ( emissive + totalDiffuse + ambientLightColor * ambient + totalSpecular );\n'
+ '  #ifdef MMD_TOONMAP\ngl_FragColor.xyz *= totalToon;\n#endif\n'
+ '#else\n'
//+ 'gl_FragColor.xyz = vec3(0.5); ShadowColor.xyz = vec3(0.5);\n'
+ '  gl_FragColor.xyz = gl_FragColor.xyz * ( emissive + totalDiffuse + ambientLightColor * ambient );\n'
+ '  ShadowColor.xyz = ShadowColor.xyz * ( (emissive + totalDiffuse)*(1.0-serious_shader_shadow_opacity) + ambientLightColor * ambient );\n'

// NOTE: MMD_TOONMAP is undefined when there in no toon map. However, in original MME (full.fx), no toon map merely means a full white one.
+ '  float comp = 1.0;\n'
+ '  #ifdef MMD_TOONMAP\n'
+ '    ShadowColor.rgb *= pow(totalToon, vec3(ToonPower));\n'//ToonPower);\n'
+ '  #endif\n'

+ 'if (serious_shader_mode == 0) { gl_FragColor.rgb *= OverBright; }\n'
//+ ((mme.type == "SeriousShader") ? 'gl_FragColor.rgb *= OverBright;\n' : '')//OverBright;

// NOTE: MAX_DIR_LIGHTS > 0 causes ERROR on Electron (v0.33.4) for unknown reasons
+ '  #ifdef MAX_DIR_LIGHTS\n'
+ '    comp = 0.0;\n'
+ '    for( int i = 0; i < MAX_DIR_LIGHTS; i ++ ) {\n'

+ 'comp += comp_list[i] * ((comp_list[i]>=0.0) ? (shadowColor.x-1.0)*ShadowDarkness+1.0 : ((serious_shader_mode == 0) ? ShadowDarkness-1.0 : 0.0));\n'
//+ 'comp += comp_list[i] * ((comp_list[i]>=0.0) ? (shadowColor.x-1.0)*ShadowDarkness+1.0 : ' + ((mme.type == "SeriousShader") ? 'ShadowDarkness-1.0' : '0.0') + ');\n'

+ '    }\n'
+ '    comp = clamp(comp, 0.0, 1.0);\n'
+ '  #endif\n'

// Using RGBtoYCbCr here is bugged for some unknown reasons
+ '  Y  =  0.298912 * ShadowColor.r + 0.586611 * ShadowColor.g + 0.114478 * ShadowColor.b;\n'
+ '  Cb = -0.168736 * ShadowColor.r - 0.331264 * ShadowColor.g + 0.5      * ShadowColor.b;\n'
+ '  Cr =  0.5      * ShadowColor.r - 0.418688 * ShadowColor.g - 0.081312 * ShadowColor.b;\n'
+ '  shadowColor.x = mix(1.0-MMDShadow,1.0, shadowColor.x);\n'
+ '  gl_FragColor.rgb = mix(mix(clamp(YCbCrtoRGB(Y *shadowColor.x, Cb, Cr), vec3(0.),vec3(1.)), ShadowColor.rgb *shadowColor.x, 0.5), gl_FragColor.rgb, comp);\n'
//+ '  gl_FragColor.rgb = mix(ShadowColor.rgb *shadowColor.x, gl_FragColor.rgb, comp);\n'
+ '  gl_FragColor.xyz += totalSpecular;\n'

//if (mme.type == "SeriousShader") {
  fshader +=
  'if (serious_shader_mode == 0) {\n'
+ '  float d = pow(abs(dot(normal, viewPosition)), UnderSkinDiffuse);\n'//pow(abs(dot(normalize(IN.Normal),normalize(IN.Eye))),UnderSkinDiffuse);\n'
+ '  gl_FragColor.xyz += totalSpecular * (1.0 - d);\n'
+ '}\n'
//}
//else {
  fshader +=
  'else {\n'
+ '  float EN = abs(dot(normal, viewPosition));\n'
+ '  float d = pow(EN, EyeLightPower);\n'//EyeLightPower	0.7 / 2.0
+ '  gl_FragColor.rgb *= mix(gl_FragColor.rgb, vec3(OverBright), d);\n'//OverBright
+ '  gl_FragColor.rgb = clamp(gl_FragColor.rgb, 0.0, 1.0);\n'

//  if (/AdultShaderS/.test(mme.type)) {
//    fshader +=
//+ '  if ((serious_shader_mode == 1) || (serious_shader_mode == 2)) {\n'
+ '    d = FresnelCoef * pow(1.0-EN, FresnelFact) * (comp*0.4+0.6);\n'//FresnelCoef/FresnelFact
+ '    gl_FragColor.rgb += totalSpecular * d;\n'
//+ '  }\n'
+ '}\n'
//  }
//}

fshader +=
  '#endif\n'

+ this.MME_shader_branch("SERIOUS_SHADER", false)

    default:
break
  }

  this.MME_shader_fshader[name] = { fvar:fvar, fshader:fshader }
}

return this.MME_shader_fshader[name]
  }

 ,GOML_import: ""
 ,GOML_head: ""
 ,GOML_scene: ""

// speech bubble START
 ,SpeechBubble: {
    bubble_index: -1
   ,bubbles: [
  {
    image_url:System.Gadget.path+'/images/SB_kakukaku01.png'
   ,font: '"Segoe Print",fantasy'
   ,font_unicode: 'DFKai-SB,"Microsoft JhengHei"'
   ,font_size: 18
//   ,column_max: 50-3
//   ,column_max_unicode: 25
   ,row_max: 8
   ,auto_wrap: true

   ,bounding_box: [43,123, 452,252]
   ,left_sided: true
  }

 ,{
    image_url:System.Gadget.path+'/images/SB_irregular01.png'
   ,font: '"Segoe Print",fantasy'
   ,font_unicode: 'DFKai-SB,"Microsoft JhengHei"'
   ,font_size: 18
//   ,column_max: 36-3
//   ,column_max_unicode: 18
   ,row_max: 8
   ,auto_wrap: true

   ,bounding_box: [135,144, 313,221]
  }

 ,{
    image_url:System.Gadget.path+'/images/SB_mokumoku01.png'
   ,font: '"Segoe Print",fantasy'
   ,font_unicode: 'DFKai-SB,"Microsoft JhengHei"'
   ,font_size: 18
//   ,column_max: 42-3
//   ,column_max_unicode: 21
   ,row_max: 8
   ,auto_wrap: true

   ,bounding_box: [87,133, 373,233]
   ,left_sided: true
  }

 ,{
    image_url:System.Gadget.path+'/images/SB_mokumoku01a.png'
   ,font: '"Segoe Print",fantasy'
   ,font_unicode: 'DFKai-SB,"Microsoft JhengHei"'
   ,font_size: 18
//   ,column_max: 42-3
//   ,column_max_unicode: 21
   ,row_max: 8
   ,auto_wrap: true

   ,bounding_box: [87,133, 373,233]
   ,left_sided: true
  }
    ]

   ,use_sprite: true

   ,init: function () {
for (var i = 0, i_length = this.bubbles.length; i < i_length; i++) {
  var b = this.bubbles[i]
  b.image = new Image()
  b.image.src = toFileProtocol(b.image_url)
}

MMD_SA.GOML_import +=
  '<canvas id="j3_speechCanvas"></canvas>\n'

MMD_SA.GOML_head +=
//'<txr id="SpeechBubbleTXR" canvas="canvas" animation="false" />\n'
  '<txr id="SpeechBubbleTXR" canvas="#j3_speechCanvas" animation="false" />\n'

//+ '<geo id="SpeechBubbleGEO" type="Plane" param="10 10" />\n'
+ '<mtl id="SpeechBubbleMTL" type="' + ((this.use_sprite)?"Sprite":"MeshBasic") + '" param="map:#SpeechBubbleTXR;sizeAttenuation:false;depthTest:false;" />\n';

MMD_SA.GOML_scene +=
  '<' + ((this.use_sprite)?"sprite":"mesh") + ' id="SpeechBubbleMESH" mtl="#SpeechBubbleMTL" style="position:0 0 0; scale:0;" />\n';
    }

   ,_canvas: null
   ,_txr: null
   ,_mesh: null
   ,loaded: false
   ,onload: function () {
this.loaded = true

for (var i = 0, i_length = this.bubbles.length; i < i_length; i++) {
  var b = this.bubbles[i]
  var bb_f = b.bounding_box_flipH = b.bounding_box.slice(0)
  bb_f[0] = b.image.width - bb_f[0] - bb_f[2]
}

this._canvas = jThree( "import" ).contents().find( "#j3_speechCanvas" )[0];//jThree( "import" ).contents().find( "canvas" )[ 0 ];
this._txr = jThree( "#SpeechBubbleTXR" ).three( 0 );
this._mesh = jThree( "#SpeechBubbleMESH" ).three( 0 );
this._mesh.renderDepth = 0

this.pos_base_ref = {
  center: new THREE.Vector3()
 ,dir: new THREE.Vector3()
 ,character_pos_ref: new THREE.Vector3()
 ,_v3: new THREE.Vector3()
};
    }

   ,flipH_side: false
   ,flipH_bubble: false
   ,get_flipH_bubble: function (msg_changed) {
var rot = this._mesh._rotation || ((this.use_sprite) ? {x:0,y:0,z:0} : this._mesh.rotation)

var flipH_bubble = (Math.PI/2 - Math.abs(rot.y) < Math.PI/20) ? ((msg_changed) ? false : ((this.flipH_side) ? !this.flipH_bubble : this.flipH_bubble)) : rot.z
if (this.flipH_side)
  flipH_bubble = !flipH_bubble

return !!flipH_bubble
    }

   ,update_bubble: function (flipH_bubble, para) {
if (!para)
  para = {}
this.flipH_bubble = flipH_bubble

bubble_index = this.bubble_index
var b = this.bubbles[bubble_index]

msg = this.msg.replace(/\{\{(.+?)\}\}/g, function (match, p1) { return eval(p1) })

var canvas = this._canvas
canvas.width = canvas.height = b.image.width;

// CJK detection
// http://stackoverflow.com/questions/1366068/whats-the-complete-range-for-chinese-characters-in-unicode
// http://kourge.net/projects/regexp-unicode-block

var use_ascii = /^[\x00-\x7F]+$/.test(msg) || !/[^\x00-\x7F]{5}.*[^\x00-\x7F]{5}/.test(msg)
//DEBUG_show((!b.column_max_unicode && !para.column_max_unicode)+'/'+use_ascii+"",0,1)
var font = para.font || b.font
var font_size = para.font_size || b.font_size
var column_max = para.column_max || b.column_max || parseInt(b.bounding_box[2]/font_size*2)
var column_max_ascii = column_max
var row_max = para.row_max || b.row_max || 10
if (!use_ascii) {
  font = para.font_unicode || b.font_unicode || font
  column_max = para.column_max_unicode || b.column_max_unicode || Math.round(column_max*0.5)
  row_max = para.row_max_unicode || b.row_max_unicode || row_max
}
var column_unicode_scale = column_max_ascii / column_max

var row = msg.replace(/\n+/, "\n").split("\n").length - 1
row += Math.max((msg.length - row * column_max*0.5) / column_max , 0)
var font_scale
if (para.font_scale)
  font_scale = para.font_scale
else if (row <= 2)
  font_scale = 2
else if (row <= row_max/2)
  font_scale = 1.5
else
  font_scale = 1
if (font_scale != 1) {
  font_size = parseInt(font_size * (font_scale * 0.9))
  column_max_ascii = parseInt(column_max_ascii/font_scale)
  column_max = parseInt(column_max/font_scale)
}

var context = canvas.getContext('2d');
context.globalAlpha = MMD_SA_options.SpeechBubble_opacity || ((MMD_SA_options.WebXR && 0.75) || 1)
context.font = "bold " + font_size + 'px ' + font
context.textBaseline = 'top'

context.save()

//if (para.invertH_side) flipH_bubble=!flipH_bubble
if (flipH_bubble) {
  context.translate(canvas.width, 0);
  context.scale(-1, 1);
}
context.drawImage(b.image, 0,0)

context.restore()

context.globalAlpha = 1

var msg_line
if ((msg.length > column_max) && ((para.auto_wrap || b.auto_wrap) || (msg.indexOf("\n") == -1))) {
  msg_line = []
  var ini = 0
  var end = 0
  var i = -1
  while (ini < msg.length) {
    i++

    var column_count = 0
    var char_count = 0
    while ((ini+char_count < msg.length) && (column_count < column_max_ascii)) {
      column_count += (msg.charCodeAt(ini+char_count) > 255) ? column_unicode_scale : 1
      char_count++
    }

    var bw = b.bounding_box[2] + 5
    var msg_length = msg.length - ini
    while (context.measureText(msg.substr(ini, Math.min(msg_length, char_count))).width > bw) {
      char_count--
    }

    if ((i == row_max-1) && (msg.length-ini > char_count)) {
      end = char_count - 3
      msg_line[i] = msg.substr(ini, end) + "..."
      break
    }

    end = Math.min(msg.length-ini, char_count)
    var line = msg.substr(ini, end).replace(/^\n+/, function (match) { ini += match.length; end -= match.length; return ""; })
    if (/(\n+)/.test(line)) {
      var break_index = line.indexOf(RegExp.$1)
//DEBUG_show(break_index,0,1)
      msg_line[i] = msg.substr(ini, break_index)
      ini += break_index + RegExp.$1.length
      continue
    }
    if (/^(\s)/.test(line)) {
      var s_length = RegExp.$1.length
      ini += s_length
      end -= s_length
    }

    var tail_length = 5
    if ((ini+end < msg.length) && (end > tail_length*2)) {
      var msg_tail = msg.substr(ini+end-tail_length, tail_length)
      if (/(\s+)/.test(msg_tail)) {
        var break_index = msg_tail.indexOf(RegExp.$1) + (end-tail_length)
        msg_line[i] = msg.substr(ini, break_index)
        ini += break_index + RegExp.$1.length
        continue
      }
      msg_tail += msg.charAt(ini+end)
      if (/\w{4}$/.test(msg_tail)) {
        end -= 1
        msg_line[i] = msg.substr(ini, end) + "-"
        ini += end
        continue
      }
    }

    msg_line[i] = msg.substr(ini, end)
    ini += end
  }
}
else
  msg_line = msg.split("\n")

var w_max = 0, h_max = font_size
for (var i = 0, i_length = msg_line.length; i < i_length; i++) {
  var m = context.measureText(msg_line[i])
  if (w_max < m.width)
    w_max = m.width
}

var w = w_max
var h = msg_line.length * h_max + (msg_line.length-1) * 10
var bb = (flipH_bubble) ? b.bounding_box_flipH : b.bounding_box
var x = bb[0] + parseInt((bb[2] - w)/2) + ((para.text_offset && para.text_offset.x) || 0)
var y = bb[1] + parseInt((bb[3] - h)/2) + ((para.text_offset && para.text_offset.y) || 0)

for (var i = 0, i_length = msg_line.length; i < i_length; i++) {
  context.fillText(msg_line[i], x, y + i*(h_max+10))
}

this._txr.needsUpdate = true
    }

   ,msg_group: {
  group_name_current: ""
 ,group_by_name: {}
    }

   ,msg: ""
   ,msg_timerID: null
   ,message: function (bubble_index, msg, duration, para) {
if (!para)
  para = {}

var group = para.group
var msg_group = this.msg_group
var group_name_current = msg_group.group_name_current
if (group_name_current && (!group || (group.name != group_name_current))) {
  delete msg_group.group_by_name[group_name_current]
  msg_group.group_name_current = ""
}

var our_group
if (group) {
  our_group = msg_group.group_by_name[group.name]
  if (our_group) {
    if (para.group_index == null) {
      if (!our_group.list_locked) {
        para.group_index = our_group.list.length
        our_group.list.push([bubble_index, msg, duration, para])
      }
      return
    }
    our_group.list_locked = true
    if (para.group_index != our_group.index)
      return
  }
  else {
// It is recommended that group_index (0) is always manually assigned for the first (and only the first) message in a message group.
// - to prevent repeated addition of message group list if the same message group is called more than once while it is still active
    para.group_index = 0
    msg_group.group_name_current = group.name
    our_group = msg_group.group_by_name[group.name] = { index:-1, para:group, list:[[bubble_index, msg, duration, para]] }
  }
}

if (this.msg_timerID) {
  clearTimeout(this.msg_timerID)
  this.msg_timerID = null
}

var msg_changed = (this.bubble_index != bubble_index) || (this.msg != msg)
var b = this.bubbles[bubble_index]

var para_SA = MMD_SA.MMD.motionManager.para_SA

var cam = MMD_SA.camera_position

// use the most updated head pose
var head_pos = para.head_pos || MMD_SA.get_bone_position(THREE.MMD.getModels()[0].mesh, "首")//MMD_SA._head_pos//

var x_diff = cam.x - head_pos.x
var left_sided = b.left_sided
if (para.flipH)
  left_sided = !left_sided
var flipH_side = (para.flipH_side != null) ? para.flipH_side : (Math.abs(x_diff) < 2) ? ((msg_changed) ? false : this.flipH_side) : ((left_sided) ? (x_diff>0) : (x_diff<0))
if (para.invertH_side) {
  flipH_side = !flipH_side
}
if (para_SA.SpeechBubble_flipH)
  flipH_side = !flipH_side
this.flipH_side = !!flipH_side

var pos_mod = (para.pos_mod) || para_SA.SpeechBubble_pos_mod || b.pos_mod || ((MMD_SA_options.model_para_obj_all.length>1) ? [-2,2,-5] : [0,0,0])
var x_mod = ((flipH_side && !left_sided) || (!flipH_side && left_sided)) ? -10 : 10

this.distance_scale = (para.distance_scale || 1) * Math.min(Math.pow(MMD_SA.camera_position.distanceTo(THREE.MMD.getModels()[0].mesh.position)/30,2), 1);
this.scale = para.scale || 1

this.pos_base_ref.center.copy(head_pos);
this.pos_base_ref.dir.set(
  x_mod + pos_mod[0] * ((x_mod > 0) ? 1 : -1)
 ,2.5 + pos_mod[1]
 ,pos_mod[2]
);
this.pos_base_ref.character_pos_ref.copy(THREE.MMD.getModels()[0].mesh.position)

this.update_position()

var flipH_bubble = this.get_flipH_bubble(msg_changed)

if (msg_changed || (this.flipH_bubble != flipH_bubble)) {
  this.bubble_index = bubble_index
  this.msg = msg

  this.update_bubble(flipH_bubble, para)
}

this.show()

if (duration == null)
  duration = 2000 + ((msg.length > 10) ? (msg.length - 10) * 100 : 0)
if (duration) {
  this.msg_timerID = setTimeout(function () {
MMD_SA.SpeechBubble.msg_timerID = null
MMD_SA.SpeechBubble.hide()

if (our_group) {
  MMD_SA.SpeechBubble.msg_timerID = setTimeout(function () {
    our_group.index += (our_group.index == -1) ? 2 : 1
    if (our_group.index >= our_group.list.length) {
      if (!our_group.para.loop || !(our_group.para.loop--)) {
        delete msg_group.group_by_name[group_name_current]
        msg_group.group_name_current = ""
        return
      }
      our_group.index = 0
      if (our_group.para.allow_shuffle)
        our_group.list.shuffle()
    }
    var g = our_group.list[our_group.index]
    MMD_SA.SpeechBubble.message(g[0], g[1], g[2], g[3])
  }, (our_group.para.interval||2000));
}
  }, duration);
}
    }

   ,update_position: function (scale) {
if (!scale)
  scale = 1

var is_portrait, is_landscape
if (is_mobile && screen.orientation) {
  if (/landscape/.test(screen.orientation.type))
    is_landscape = true
  else
    is_portrait = true
}

this._mesh.position.copy(this.pos_base_ref.dir).multiplyScalar(this.distance_scale * ((is_portrait && 0.25) || 1) * scale).add(this.pos_base_ref._v3.copy(this.pos_base_ref.center).sub(this.pos_base_ref.character_pos_ref).add(THREE.MMD.getModels()[0].mesh.position))
this._mesh.scale.set(1,1,1).multiplyScalar(this.scale * scale * ((is_landscape && 1.5) || 1) * ((this.use_sprite)?1/3:1))

//this.pos_base.copy(this._mesh.position).sub(this.pos_base_ref.character_pos_ref)
   }

   ,update_placement: function () {
if (!MMD_SA_options.use_speech_bubble)
  return

var mesh = this._mesh
if (!mesh.visible)
  return

var dis = this._mesh.position.distanceTo(MMD_SA._trackball_camera.object.position)
var scale = (!this.use_sprite && (dis > 32)) ? 1 + (dis-32)/64 : 1
//DEBUG_show(scale+'/'+Date.now())
this.update_position(scale)

mesh._rotation = MMD_SA.face_camera(this.position, null, true)
if (!this.use_sprite)
  mesh.rotation.copy(mesh._rotation)

var flipH_bubble = this.get_flipH_bubble()
if (flipH_bubble != this.flipH_bubble) {
  this.update_bubble(flipH_bubble)
}
/*
var dis = MMD_SA._trackball_camera.object.position.distanceTo(mesh.position)
if (dis > 128)
  mesh.scale.set(2,2,2)
*/
    }

   ,get position() {
return this._mesh.position
    }

   ,visible: false
   ,show: function () {
if (!this.visible) {
  this.visible = true
  window.dispatchEvent(new CustomEvent("SA_SpeechBubble_show"));
}
jThree( "#SpeechBubbleMESH" ).show();
    }

   ,hidden_time_ref: Date.now()
   ,get hidden_time() {
return ((this.visible) ? 0 : Date.now() - this.hidden_time_ref)
    }

   ,hidden_time_check: function (duration) {
if (this.hidden_time < duration)
  return false

if (Math.random() < 0.5) {
  this.hidden_time_ref += random(duration)
  return false
}

return true
    }

   ,hide: function () {
if (this.visible) {
  if (this.msg_timerID) {
    clearTimeout(this.msg_timerID)
    this.msg_timerID = null
  }

  this.hidden_time_ref = Date.now()

  this.visible = false
  window.dispatchEvent(new CustomEvent("SA_SpeechBubble_hide"));
}
jThree( "#SpeechBubbleMESH" ).hide();
    }
  }
// END

 ,face_camera: function (v3, q_to_apply, absolute_facing) {
var cam = MMD_SA.camera_position
var camR = cam.clone().sub(v3)
if (q_to_apply)
  camR = camR.applyQuaternion(q_to_apply)

var v3r = new THREE.Vector3()
var _divisor
var _x_diff = camR.x
var _y_diff = camR.y
var _z_diff = camR.z

_divisor = Math.sqrt(Math.pow(_x_diff,2) + Math.pow(_z_diff,2))
v3r.x = Math.atan2(-_y_diff, Math.abs(_divisor))
if (absolute_facing && (_z_diff < 0)) {
  v3r.x = MMD_SA.normalize_angle((v3r.x > 0) ? Math.PI - v3r.x : -Math.PI - v3r.x)
}

_divisor = _z_diff
v3r.y = Math.atan2(_x_diff, Math.abs(_divisor))
if (absolute_facing && (_z_diff < 0)) {
//  v3r.y = (v3r.y > 0) ? Math.PI - v3r.y : -Math.PI - v3r.y
  v3r.z = Math.PI
}
v3r.y *= Math.abs(Math.cos(v3r.x))

return v3r
  }

 ,normalize_angle: function (r) {
var circle = Math.PI * 2
r = r % circle
if (r > Math.PI)
  r -= circle
else if (r < -Math.PI)
  r += circle

return r
  }

 ,get_bone_position: (function () {
    var TEMP_m4;
    window.addEventListener("MMDStarted", function () {
      TEMP_m4 = new THREE.Matrix4();
    });

    return function (mesh, name, parent_to_stop) {
var pos = new THREE.Vector3()
var bone = (typeof name == "string") ? mesh.bones_by_name[name] : mesh.bones[name]
if (!bone)
  return pos

if (parent_to_stop && (typeof parent_to_stop == "string"))
  parent_to_stop = mesh.bones_by_name[parent_to_stop]

pos.copy(bone.position);
var _bone = bone;
while ((_bone.parent !== mesh) && (_bone.parent !== parent_to_stop)) {
  _bone = _bone.parent;
  pos.applyMatrix4(TEMP_m4.makeRotationFromQuaternion(_bone.quaternion).setPosition(_bone.position));
}
if (_bone.parent !== parent_to_stop)
  pos.applyMatrix4(TEMP_m4.makeRotationFromQuaternion(mesh.quaternion).setPosition(mesh.position));

return pos;
    };
  })()

 ,get_bone_rotation: function (mesh, name, parent_only) {
var rot = new THREE.Quaternion();
var bone = (typeof name == "string") ? mesh.bones_by_name[name] : mesh.bones[name]
if (!bone)
  return rot

if (!parent_only)
  rot.copy(bone.quaternion)

var _bone = bone;
while (_bone.parent !== mesh) {
  _bone = _bone.parent;
// parent x self (NOTE: multiply(_bone.quaternion) without the second parameter rot is self x parent, which is incorrect)
  rot.multiply(_bone.quaternion, rot)
}
rot.multiply(mesh.quaternion, rot)

return rot.normalize();
  }

 ,get_bone_rotation_parent: function (mesh, name) {
return this.get_bone_rotation(mesh, name, true)
  }

 ,_camera_position_: null
 ,get camera_position() {
//jThree("#MMD_camera").three(0)===MMD_SA._trackball_camera.object
return this._camera_position_ || ((MMD_SA_options.use_JSARToolKit && MMD_SA.AR_obj._m4) ? MMD_SA.AR_obj.camera_position : MMD_SA._trackball_camera.object.position);
  }

 ,gravity: [0,-1,0]

 ,_x_object_show: function (forced) {
if (!MMD_SA._x_object_displayed_once)
  return
if (!this.visible || forced) {
  this.visible = true
//  var obj = this._obj
//  obj.scale.x = obj.scale.y = obj.scale.z = this.scale
  if (!/^\#mikuPmx/.test(this.id)) {
    jThree(this.id).show()
    return true
  }
}
  }

 ,_x_object_hide: function (forced) {
if (!MMD_SA._x_object_displayed_once)
  return
if (this.visible || forced) {
  this.visible = false
//  var obj = this._obj
//  obj.scale.x = obj.scale.y = obj.scale.z = 0
  if (!/^\#mikuPmx/.test(this.id)) {
    jThree(this.id).hide()
    return true
  }
}
  }

 ,_skin_interp_default: new Uint8Array([20,20,20,20,20,20,20,20, 107,107,107,107,107,107,107,107])

 ,_custom_morph: []
 ,_custom_skin: []

 ,playbackRate: 1
// ._playbackRate is basically for internal use only
 ,_playbackRate: 1


// Reserve extra slots for morph targets, just in case external loading of VMD motions is needed, which may have new morph animations
 ,morphTargets_length_extra: 10


 ,MME_shuffle: function (id, e_name) {
var EC = MMD_SA_options.MME.PostProcessingEffects
if (!EC || !EC.enabled || !EC.effects.length)
  return

var id_list = []
if (id == null) {
  for (id in EC.shuffle_group)
    id_list.push(id)
}
else
  id_list.push(id)

id_list.forEach(function (id) {
  var sg = EC.shuffle_group[id]
  var sg_effect_by_name
  sg.effects.forEach(function (e) {
if (!sg_effect_by_name && e_name && (e.name == e_name))
  sg_effect_by_name = true
EC._effects[e.name].enabled = false
  });

  var e
  if (sg_effect_by_name) {
    e = EC._effects[e_name]
  } else {
    if (sg.shuffle_list_index == null)
      sg.shuffle_list_index = -1
    if (!sg.shuffle_list || (++sg.shuffle_list_index >= sg.shuffle_list.length)) {
      var list = []
      for (var i = 0, i_max = sg.effects.length; i < i_max; i++)
        list.push(i)
      sg.shuffle_list = list.shuffle()
      sg.shuffle_list_index = 0
    }
    e = EC._effects[sg.effects[sg.shuffle_list[sg.shuffle_list_index]].name]
  }

  e.enabled = true
});

this.MME_set_renderToScreen()

this.MME_check_mipmap_render_target()
  }

 ,MME_set_renderToScreen: function () {
var EC = MMD_SA_options.MME.PostProcessingEffects
if (!EC || !EC.enabled || !EC.effects.length)
  return

EC.effects.forEach(function (e) {
  e.obj.renderToScreen = false
});

for (var i = EC.effects.length-1; i >= 0; i--) {
  var e_obj = EC.effects[i].obj
  if (e_obj.enabled) {
    e_obj.renderToScreen = true
    break
  }
}
  }

 ,MME_composer_disabled_check: (function () {
var check = function (c) {
  if ((c._index == 0) || !c.passes.length)
    return

  for (var i = 0, i_max = c.passes.length; i < i_max; i++) {
  if (c.passes[i]._shuffle_group_id != null) DEBUG_show(c.passes[i]._name,0,1)
    if (c.passes[i].enabled) {
      return
    }
  }

  c._disabled = true
};

return function (c) {
  check.call(this, c)
  this.MME_check_mipmap_render_target()
};
  })()

 ,_mipmap_render_target_list: []
 ,MME_check_mipmap_render_target: function () {
var EC = MMD_SA_options.MME.PostProcessingEffects
var mipmap_render_target_list = []
var changed

var effects_to_check = ["BloomPostProcess"]
effects_to_check.forEach(function (name) {
  var e = EC.effects_by_name[name]
  var c_index = -1
  if (e.obj.enabled && /SOURCE_READBUFFER(\d+)/.test(e.obj.textureID)) {
    c_index = parseInt(RegExp.$1)
    var c = EC._composers_list[c_index]
    if (c._disabled) {
      for (var i = c_index-1; i >= 0; i--) {
        if (!EC._composers_list[i]._disabled) {
          c_index = i
          break
        }
      }
    }
  }

  changed = (e._composer_index_active != c_index)
  e._composer_index_active = c_index
  mipmap_render_target_list.push({name:name, composer_index:c_index})
});

this._mipmap_render_target_list = mipmap_render_target_list
if (MMD_SA.MMD_started && EC._initialized && changed) {
  console.log("mipmap_render_target_list:")
  console.log(mipmap_render_target_list)
// trigger render target refresh
  EC._width = EC._height = 0
}

return mipmap_render_target_list
  }

 ,render: function (renderer) {
//if (!MMD_SA.MMD_started) return true
//var _t=performance.now()
MMD_SA._mirror_rendering_ = true
MMD_SA._THREE_mirror.forEach(function (m, idx) {
  var mirror_obj = MMD_SA.mirror_obj[idx]
  if (!mirror_obj.custom_action || !mirror_obj.custom_action(m))
    m.render()
});
MMD_SA._mirror_rendering_ = false

var _visible = {}
MMD_SA._skip_render_list.forEach(function (id) {
// jThree(id).three(0) works during loading
  var obj = (/^\#(.+)$/.test(id)) ? ((MMD_SA.MMD_started) ? MMD_SA_options.mesh_obj_by_id[RegExp.$1] : jThree(id).three(0)) : MMD_SA_options.x_object_by_name[id]
  if (obj && obj.visible) {
//DEBUG_show(id+"/"+Date.now())
    _visible[id] = true
    if (MMD_SA.MMD_started)
      obj.hide()
    else
      obj.visible = false
  }
});

var EC = MMD_SA_options.MME.PostProcessingEffects
if (EC && EC.enabled && EC.effects.length)
  this.render_extra(renderer)
else
  renderer.render( renderer.__camera.userData.scene, renderer.__camera )

for (var id in _visible) {
  var obj = (/^\#(.+)$/.test(id)) ? ((MMD_SA.MMD_started) ? MMD_SA_options.mesh_obj_by_id[RegExp.$1] : jThree(id).three(0)) : MMD_SA_options.x_object_by_name[id]
  if (obj) {
    if (MMD_SA.MMD_started)
      obj.show()
    else
      obj.visible = true
  }
}
//DEBUG_show(JSON.stringify(renderer.info.render))
//DEBUG_show(Math.round(performance.now()-_t)+'\n'+Date.now())
return true
 }

 ,render_extra: function (renderer) {
var EC = MMD_SA_options.MME.PostProcessingEffects

var refresh_all_uniforms = false

if (!EC._initialized) {
refresh_all_uniforms = true

var composer, effect
//EC._composers = {}
EC._composers_list = []
//EC._render_targets = {}
EC._render_targets_list = []
EC._createRenderTarget = function (para_obj, push_render_targets_list) {
  var w, h
  if (para_obj.scale) {
     w = Math.round(this._width  * para_obj.scale)
     h = Math.round(this._height * para_obj.scale)
  }
  else {
    w = para_obj.width
    w = para_obj.height
  }
  var parameters = para_obj.para || { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat, stencilBuffer: false }
  var rt = new THREE.WebGLRenderTarget( w, h, parameters )
  if (para_obj.use_multisample)
    rt._use_multisample = 4
  if (push_render_targets_list) {
    EC._render_targets_list.push({ render_target:rt, para:para_obj, composer_index:para_obj.composer_index, onreload:para_obj.onreload })
  }
  return rt
}
EC._effects = {}
EC._width  = renderer.context.canvas.width
EC._height = renderer.context.canvas.height


// back ported to r58
renderer.getPixelRatio = function () { return this.devicePixelRatio; }
if (!THREE.PlaneBufferGeometry)
  THREE.PlaneBufferGeometry = THREE.PlaneGeometry
THREE.WebGLRenderTarget.prototype.setSize = function ( width, height ) {

		if ( this.width !== width || this.height !== height ) {

			this.width = width;
			this.height = height;

			this.dispose();

		}

};


// depth buffer START
EC._depthRenderTarget = new THREE.WebGLRenderTarget( EC._width, EC._height, { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat } );
//EC._depthMaterial = new THREE.MeshDepthMaterial();
//EC._depthMaterial.blending = THREE.NoBlending;
// depth buffer END


composer = EC._composers_list[EC._composers_list.length] = new THREE.EffectComposer( renderer, undefined, (function () { var c_index=EC._composers_list.length; return {get minFilter() { var use_mipmap=(MMD_SA._mipmap_render_target_list.some(function(r){return r.composer_index==c_index})); if (use_mipmap) { console.log("MIPMAP render target:"+c_index); return THREE.LinearMipMapLinearFilter; } else { return THREE.LinearFilter;}; }, format:THREE.RGBAFormat}; })() );
composer._index = 0
if (EC.use_FXAA) {
  composer.addPass( new THREE.RenderPass( renderer.__camera.userData.scene, renderer.__camera, null ) );
  EC._effects.FXAAShader = new THREE.ShaderPass(THREE.FXAAShader)
  composer.addPass(EC._effects.FXAAShader)
}
else {
  Object.defineProperty(composer, "_source_readBuffer", {
  get: function () {
if (this._buffer_written)
  return this.readBuffer
return this._source_readBuffer_
  }

 ,set: function (v) {
this._source_readBuffer_ = v
  }
  });

  var use_multisample = (!MMD_SA_options.MMD_disabled && MMD_SA.use_webgl2)
  MMD_SA.use_MSAA_FBO = use_multisample

  if (use_multisample && MMD_SA.MMD_started)
    DEBUG_show("Use MSAA FBO", 2)

  composer._source_readBuffer = EC._createRenderTarget({
    use_multisample:use_multisample

// mipmap check
   ,para: (function () { var c_index=0; return {get minFilter() { var use_mipmap=(MMD_SA._mipmap_render_target_list.some(function(r){return r.composer_index==c_index})); if (use_mipmap) { console.log("MIPMAP render target:"+c_index); return THREE.LinearMipMapLinearFilter; } else { return THREE.LinearFilter;}; }, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat, stencilBuffer: false }; })()

   ,scale:EC.SSAA_scale||((MMD_SA_options.MMD_disabled||use_multisample)?1:2)
   ,onreload:function (renderTarget_new) { EC._composers_list[0]._source_readBuffer=renderTarget_new; }
  }, true);
}

//composer.addPass( new THREE.BloomPass( 1, 15*2, 2, 512 ) );

//composer.readBuffer.premultiplyAlpha = composer.writeBuffer.premultiplyAlpha = false
/*
effect = new THREE.ShaderPass(THREE.CopyShader)
effect.renderToScreen = true;
composer.addPass( effect );
*/

var effect_count = {}
var composer_index_source_readBuffer = -1
var composer_index_source_readBuffer_USED = []
var source_readBuffer_effect0_group_id = null

for (var _e = 0, _e_length = EC.effects.length; _e < _e_length; _e++) {
  var e = EC.effects[_e]
  var name = e.name
  var index_sub
  var texture_id = undefined

  var e_source = EC.effects[_e + ((name == "EffectToNormalSize") ? -1 : 0)]
  if ((composer._source_readBuffer && (source_readBuffer_effect0_group_id == null)) || ((e_source.shuffle_group_id != null) && (e_source.shuffle_group_id == source_readBuffer_effect0_group_id))) {
  }
  else {
    composer_index_source_readBuffer = -1
    source_readBuffer_effect0_group_id = null
  }
  source_readBuffer_effect0_group_id = (e_source.shuffle_group_id != null) ? e_source.shuffle_group_id : "NOT_USED"
//  if (composer._source_readBuffer)
    composer_index_source_readBuffer = composer._index


  if (/^(BloomPostProcess|ChildAnimation|DiffusionX|JustSnow|SAOShader)$/.test(name) || e.create_composer) {
    composer = EC._composers_list[EC._composers_list.length] = new THREE.EffectComposer( renderer, undefined, (function () { var c_index=EC._composers_list.length; return {get minFilter() { var use_mipmap=(MMD_SA._mipmap_render_target_list.some(function(r){return r.composer_index==c_index})); if (use_mipmap) { console.log("MIPMAP render target:"+c_index); return THREE.LinearMipMapLinearFilter; } else { return THREE.LinearFilter;}; }, format:THREE.RGBAFormat}; })() );
    composer._index = EC._composers_list.length-1

Object.defineProperty(composer, "_source_readBuffer", {
  get: function () {
    if (this._buffer_written)//(this.passes[0].enabled)
      return this.readBuffer

var composer_last_active_index = 0
for (var i = this._index-1; i >= 0; i--) {
  if (!EC._composers_list[i]._disabled) {
    composer_last_active_index = i
    break
  }
}
var c = EC._composers_list[composer_last_active_index]
return c._source_readBuffer || c.readBuffer
  }
});
  }
  else if (name == "EffectToNormalSize") {
    if (!e_source.scale)
      continue

    composer = EC._composers_list[EC._composers_list.length] = new THREE.EffectComposer( renderer, undefined, (function () { var c_index=EC._composers_list.length; return {get minFilter() { var use_mipmap=(MMD_SA._mipmap_render_target_list.some(function(r){return r.composer_index==c_index})); if (use_mipmap) { console.log("MIPMAP render target:"+c_index); return THREE.LinearMipMapLinearFilter; } else { return THREE.LinearFilter;}; }, format:THREE.RGBAFormat}; })() );
    composer._index = EC._composers_list.length-1
//    texture_id = "MANUAL_ASSIGN"

    if (EC._composers_list[composer._index-1]._disabled)
      composer._disabled = true
  }
  else if (e.scale) {
    composer = EC._composers_list[EC._composers_list.length] = new THREE.EffectComposer( renderer, EC._createRenderTarget({ scale:e.scale, composer_index:EC._composers_list.length }, true), (function () { var c_index=EC._composers_list.length; return {get minFilter() { var use_mipmap=(MMD_SA._mipmap_render_target_list.some(function(r){return r.composer_index==c_index})); if (use_mipmap) { console.log("MIPMAP render target:"+c_index); return THREE.LinearMipMapLinearFilter; } else { return THREE.LinearFilter;}; }, format:null}; })() );
    composer._index = EC._composers_list.length-1
    texture_id = "MANUAL_ASSIGN"
  }

  if (!texture_id && (composer_index_source_readBuffer != -1)) {
    texture_id = "SOURCE_READBUFFER" + composer_index_source_readBuffer
    composer_index_source_readBuffer_USED[composer_index_source_readBuffer] = true
  }

  index_sub = effect_count[name] = effect_count[name] || 0
  if (index_sub)
    name += index_sub
  effect_count[name]++

  if (name == "BloomPass") {
    effect = e.obj = EC._effects[name] = new THREE.BloomPass(1*1.5, 15*2, 0.25, 512*2)
    effect.textureID = texture_id
//console.log(effect)
  }
  else
    effect = e.obj = EC._effects[name] = new THREE.ShaderPass(THREE[name], texture_id)

  effect._composer_index = composer._index
  effect._index_sub = index_sub
  effect._index = _e
  effect._name = name

  if (_e == _e_length-1)
    effect.renderToScreen = true
  composer.addPass(effect)

  effect._enabled = !!e.enabled || (e.enabled == null)
console.log(name+'/'+texture_id+'/'+effect._enabled)
  if (e.scale) {
    Object.defineProperty(effect, "enabled",
{
  get: function () {
return this._enabled
  }

 ,set: function (v) {
this._enabled = v

EC._composers_list[this._composer_index]._disabled = !v
if (EC._composers_list[this._composer_index+1])
  EC._composers_list[this._composer_index+1]._disabled = !v
  }
});
  }
  else {
    Object.defineProperty(effect, "enabled",
{
  get: function () {
return this._enabled && !EC._composers_list[this._composer_index]._disabled
  }

 ,set: function (v) {
this._enabled = v

if (v)
  EC._composers_list[this._composer_index]._disabled = false
  }
});
  }
  effect.enabled = !!effect._enabled

  if (e.shuffle_group_id != null) {
    effect.enabled = false
  }
}

EC._composers_list.forEach(function (c) {
  MMD_SA.MME_composer_disabled_check(c)
});

MMD_SA.MME_shuffle();

this.MME_check_mipmap_render_target().forEach(function (r) {
  if (r.composer_index == -1)
    return

  var c = EC._composers_list[r.composer_index]
  if (r.composer_index == 0) {
    c._source_readBuffer.minFilter = THREE.LinearMipMapLinearFilter
  }
  else {
    c.readBuffer.minFilter  = THREE.LinearMipMapLinearFilter
    c.writeBuffer.minFilter = THREE.LinearMipMapLinearFilter
  }
  console.log("Startup MIPMAP render target:"+r.composer_index)
});

// put it at the end to avoid unnecessary render target refresh during .MME_check_mipmap_render_target()
EC._initialized = true
}


var w = renderer.context.canvas.width
var h = renderer.context.canvas.height
if ((EC._width != w) || (EC._height != h)) {
  EC._width  = w
  EC._height = h

  refresh_all_uniforms = true

EC._depthRenderTarget.dispose()
EC._depthRenderTarget = new THREE.WebGLRenderTarget( EC._width, EC._height, { minFilter: THREE.NearestFilter, magFilter: THREE.NearestFilter, format: THREE.RGBAFormat } );
//EC._depthMaterial = new THREE.MeshDepthMaterial();
//EC._depthMaterial.blending = THREE.NoBlending;

  EC._render_targets_list.forEach(function (obj) {
    var rt = EC._createRenderTarget(obj.para)
    if (obj.composer_index != null) {
      EC._composers_list[obj.composer_index]._render_target_new = rt
    }
    else
      obj.render_target.dispose()
    obj.render_target = rt
  });

  EC._composers_list.forEach(function (c) {
    c.reset(c._render_target_new)
    c._render_target_new = undefined
  });

  EC._render_targets_list.forEach(function (obj) {
    if (obj.onreload)
      obj.onreload(obj.render_target)
  });

// to make sure that MMD_SA._trackball_camera has already been defined
  MMD_SA._trackball_camera && MMD_SA._trackball_camera.resize()

  DEBUG_show("(viewport resized)", 2)
}

for (var e_name in EC._effects) {
  THREE[e_name] && THREE[e_name]._refreshUniforms && THREE[e_name]._refreshUniforms(refresh_all_uniforms, EC._effects[e_name]._index_sub)
}


/*
var oldClearColor = renderer.getClearColor()
var oldClearAlpha = renderer.getClearAlpha()
renderer.setClearColor( oldClearColor, oldClearAlpha );
renderer.setClearColor( new THREE.Color("#008"), 0 );
*/


//MMD_SA._depth_render_mode_ = 1
if (!EC.use_FXAA) {
// Skip rendering after first one doesn't seem to help reduce GPU usage (maybe there is actually nothing rendered when the scene is empty), so comment out for now.
//  if (!MMD_SA_options.MMD_disabled || !EC._render_targets_list[0]._rendered) {
    renderer.render( renderer.__camera.userData.scene, renderer.__camera, EC._render_targets_list[0].render_target, true )
//    EC._render_targets_list[0]._rendered = true
//  }
}
//MMD_SA._depth_render_mode_ = 0

//return true


if (EC.use_SAO) {
  MMD_SA._depth_render_mode_ = 1
/*
var oldClearColor = renderer.getClearColor()
var oldClearAlpha = renderer.getClearAlpha()
renderer.setClearColor( new THREE.Color("#FFF"), 1 );
renderer.clearTarget(EC._depthRenderTarget)
renderer.autoClear = false
*/
/*
if (!self._depthMaterial_) {
		var depthShader = THREE.ShaderLib[ "depthRGBA" ];
		var depthUniforms = THREE.UniformsUtils.clone( depthShader.uniforms );
console.log(depthUniforms)
let _depthMaterial = self._depthMaterial_ =
//		_depthMaterial = new THREE.ShaderMaterial( { fragmentShader: depthShader.fragmentShader, vertexShader: depthShader.vertexShader, uniforms: depthUniforms } );
//		_depthMaterialMorph = new THREE.ShaderMaterial( { fragmentShader: depthShader.fragmentShader, vertexShader: depthShader.vertexShader, uniforms: depthUniforms, morphTargets: true } );
//		_depthMaterialSkin = new THREE.ShaderMaterial( { fragmentShader: depthShader.fragmentShader, vertexShader: depthShader.vertexShader, uniforms: depthUniforms, skinning: true } );
		_depthMaterialMorphSkin = new THREE.ShaderMaterial( { fragmentShader: depthShader.fragmentShader, vertexShader: depthShader.vertexShader, uniforms: depthUniforms, morphTargets: true, skinning: true } );

		_depthMaterial._shadowPass = true;
}
*/
//renderer.__camera.userData.scene.overrideMaterial = self._depthMaterial_
  renderer.render( renderer.__camera.userData.scene, renderer.__camera, EC._depthRenderTarget, true );
//renderer.__camera.userData.scene.overrideMaterial = null
/*
renderer.autoClear = true
renderer.setClearColor( oldClearColor, oldClearAlpha );
*/
  MMD_SA._depth_render_mode_ = 0
}


EC._composers_list.forEach(function (c) {
  c._buffer_written = false
  if (!c._disabled)
    c.render()
});

return true
  }

 ,camera_list: []

// depth render
 ,__depth_render_mode__: 0
 ,_depth_render_uniform_list: []
 ,get _depth_render_mode_() { return this.__depth_render_mode__ }
 ,set _depth_render_mode_(v) {
this.__depth_render_mode__ = v
var disabled_by_material = MMD_SA_options.MME.SAO.disabled_by_material
this._depth_render_uniform_list.forEach(function (obj) {
  var v_this = v
  if (v_this == 1) {
    if (disabled_by_material.indexOf(obj.name) != -1)
      v_this = 2
  }
  obj.uniform.value = v_this
});
  }


// mirrors
 ,_THREE_mirror: []
 ,_skip_render_list: []
 ,mirror_index: -1
 ,mirror_obj: []
 ,createMirror: function (para) {
if (para.created)
  return null
para.created = true

para.mirror_index = ++this.mirror_index
this.mirror_obj[this.mirror_index] = para

if (!para.plane && !para.geo_type)
  para.plane = [30,30]
if (para.plane) {
  para.geo_type  = "Plane"
  para.geo_param = para.plane
}

if (!para.baseTexture)
  para.baseTexture = System.Gadget.path + '/images/bg.png'

if (para.hidden)
  MMD_SA._skip_render_list.push('#Mirror' + this.mirror_index + 'MESH')

return {
  geo:  '<geo id="Mirror' + this.mirror_index + 'GEO" type="' + para.geo_type + '" param="' + para.geo_param.join(" ") + '" />\n'
 ,mtl:  '<mtl id="Mirror' + this.mirror_index + 'MTL" type="Mirror" param="mirror_index:' + this.mirror_index + '; mesh:#Mirror' + this.mirror_index + 'MESH; renderer:#MMD_renderer; camera:#MMD_camera; clipBias:0.003; textureWidth:' + (para.textureWidth||1024) + '; textureHeight:' + (para.textureHeight||1024) + ';' + ((para.clip_y != null) ? ' clip_y:' + para.clip_y + ';' : '') + '" />\n'
 ,mesh: '<mesh id="Mirror' + this.mirror_index + 'MESH" geo="#Mirror' + this.mirror_index + 'GEO" mtl="#Mirror' + this.mirror_index + 'MTL" style="' + para.style + '" />\n'
};
  }


// tray menu
 ,tray_menu_func: function (para) {
switch (para[0]) {
  case "MODEL":
    if (para[1] == "override_default") {
      var bool = parseInt(para[2])
      System.Gadget.Settings.writeString('MMDOverrideDefaultForExternalModel', ((!bool)?"non_default":""))
      if (!bool)
        System.Gadget.Settings.writeString('LABEL_MMD_model_path', '')
      if (linux_mode)
        System._browser.update_tray()
      return
    }

    var model_path = decodeURIComponent(para[1])
    if (!/^(\w+\:|\/)/.test(model_path))
      model_path = System.Gadget.path + toLocalPath("\\" + model_path)
    if ((model_path == MMD_SA_options.model_path) || (MMD_SA_options.model_path_extra.indexOf(model_path) != -1)) {
      DEBUG_show("(model already in use)", 2)
      System._browser.update_tray({MMD_model_path:MMD_SA_options.model_path})
      return
    }
    if (!confirm("This will restart the gadget.")) {
      System._browser.update_tray({MMD_model_path:MMD_SA_options.model_path})
      return
    }

    DragDrop_install({ path:model_path })
    return
  case "VISUAL_EFFECTS":
    var model_filename_cleaned = MMD_SA_options.model_para_obj._filename_cleaned
    switch (para[1]) {
      case "load_default":
        if (!confirm("This will load the default visual effect settings."))
          return
        MMD_SA_options.MME.self_overlay = Object.clone(MMD_SA_options.MME._self_overlay)
        MMD_SA_options.MME.HDR = Object.clone(MMD_SA_options.MME._HDR)
        MMD_SA_options.MME.serious_shader = Object.clone(MMD_SA_options.MME._serious_shader)
        MMD_SA_options.MME.SAO = Object.clone(MMD_SA_options.MME._SAO)
        MMD_SA._MME_uniforms_updated_ = Date.now()
        System._browser.update_tray()
        break
      case "save_default":
        if (!confirm("This will save the current visual effect settings as the default for the current MMD model, which will be applied to any System Animator animations that uses the same MMD model.\n\nIf this is an external model, this model path will also be added to the model list, which can be selected from the tray menu for any other System Animator MMD animations."))
          return
        var MME_saved = MMD_SA_options.MME_saved[model_filename_cleaned]
        if (!MME_saved)
          MME_saved = MMD_SA_options.MME_saved[model_filename_cleaned] = {}
        delete MMD_SA_options.MME.self_overlay.use_default
        delete MMD_SA_options.MME.HDR.use_default
        delete MMD_SA_options.MME.serious_shader.use_default
// update saved
        var model_path = MMD_SA_options.model_path
        if (model_path.indexOf(System.Gadget.path) == 0)
          model_path = model_path.substr(System.Gadget.path.length+1)
        MME_saved.path_full = model_path
        MME_saved.self_overlay = Object.clone(MMD_SA_options.MME.self_overlay)
        MME_saved.HDR = Object.clone(MMD_SA_options.MME.HDR)
        MME_saved.serious_shader = Object.clone(MMD_SA_options.MME.serious_shader)
        MME_saved.SAO = Object.clone(MMD_SA_options.MME.SAO)
// update default
        MMD_SA_options.MME._self_overlay = Object.clone(MME_saved.self_overlay)
        MMD_SA_options.MME._HDR = Object.clone(MME_saved.HDR)
        MMD_SA_options.MME._serious_shader = Object.clone(MME_saved.serious_shader)
        MMD_SA_options.MME._SAO = Object.clone(MME_saved.SAO)
        try {
          var f = FSO_OBJ.OpenTextFile(System.Gadget.path + '\\TEMP\\MMD_MME_by_model.json', 2, true);
          f.Write(JSON.stringify(MMD_SA_options.MME_saved))
          f.Close()
          DEBUG_show("(MME settings saved)", 2)
        }
        catch (err) {}
        System._browser.update_tray()
        break
      case "delete_default":
        if (!MMD_SA_options.MME_saved[model_filename_cleaned]) {
          DEBUG_show("(No saved settings exist)", 3)
          return
        }
        if (!confirm("This will delete the saved visual effect and model list settings for the current MMD model."))
          return
        delete MMD_SA_options.MME_saved[model_filename_cleaned]
        try {
          var f = FSO_OBJ.OpenTextFile(System.Gadget.path + '\\TEMP\\MMD_MME_by_model.json', 2, true);
          f.Write(JSON.stringify(MMD_SA_options.MME_saved))
          f.Close()
          DEBUG_show("(MME settings deleted)", 2)
          System._browser.update_tray()
        }
        catch (err) {}
        break
      case "reset":
        if (!confirm("This will reset all visual effect settings to the original defaults (i.e. model-based effects enabled with default parameters, post-processing effects disabled)."))
          return
        MMD_SA_options.MME.self_overlay = { enabled:true }
        MMD_SA_options.MME.HDR = { enabled:true }
        MMD_SA_options.MME.serious_shader = { enabled:true }
        MMD_SA_options.MME.SAO = { disabled_by_material:[] }
        var PPE = MMD_SA_options.MME.PostProcessingEffects
        PPE.use_SAO = PPE.use_Diffusion = PPE.use_BloomPostProcess = false
        System.Gadget.Settings.writeString('Use3DSAO', '')
        System.Gadget.Settings.writeString('Use3DDiffusion', '')
        MMD_SA._MME_uniforms_updated_ = Date.now()
        System._browser.update_tray()
        break
      case "OFF":
        if (!confirm("This will disable all visual effects, and reset lighting/shadow to its default state."))
          return
        MMD_SA_options.MME.self_overlay = { enabled:false }
        MMD_SA_options.MME.HDR = { enabled:false }
        MMD_SA_options.MME.serious_shader = { enabled:false }
        MMD_SA_options.MME.SAO = { disabled_by_material:[] }
        var PPE = MMD_SA_options.MME.PostProcessingEffects
        PPE.enabled = PPE.use_SAO = PPE.use_Diffusion = PPE.use_BloomPostProcess = false
        System.Gadget.Settings.writeString('Use3DPPE', '')
        System.Gadget.Settings.writeString('Use3DSAO', '')
        System.Gadget.Settings.writeString('Use3DDiffusion', '')
        System.Gadget.Settings.writeString('MMDLightColor', '')
        System.Gadget.Settings.writeString('MMDLightPosition', '')
        System.Gadget.Settings.writeString('MMDShadow', '')
        var light = MMD_SA.light_list[1].obj
        light.color.set(MMD_SA_options.light_color)
        light.position.fromArray(MMD_SA_options.light_position).add(THREE.MMD.getModels()[0].mesh.position)
        MMD_SA._MME_uniforms_updated_ = Date.now()
        System._browser.update_tray()
        break
      case "Shadow":
        var shadow = parseFloat(para[2])
        if (shadow < 0)
          return
        if (shadow == 0) {
          MMD_SA_options.use_shadowMap = false
          System.Gadget.Settings.writeString('MMDShadow', '')
        }
        else {
          MMD_SA_options.use_shadowMap = true
          MMD_SA_options.shadow_darkness = shadow
          System.Gadget.Settings.writeString('MMDShadow', shadow)
        }
        MMD_SA.toggle_shadowMap()
//        System._browser.update_tray()
        break
      case "Light":
        var light = MMD_SA.light_list[1].obj
        switch (para[2]) {
          case "color":
            var color = parseInt(para[4])
            if (color < 0)
              return
            var index
            switch (para[3]) {
              case "red":
                index = 0
                break
              case "green":
                index = 1
                break
              case "blue":
                index = 2
                break
            }
            var color_p = ["r", "g", "b"]
            light.color[color_p[index]] = color / 255
            var hex = '#' + light.color.getHexString()
            System.Gadget.Settings.writeString('MMDLightColor', hex)
            DEBUG_show("Light color:" + hex, 3)
            break
          case "position":
            var pos = parseFloat(para[4])
            if (pos < -1)
              return
            var index
            switch (para[3]) {
              case "X":
                index = 0
                break
              case "Y":
                index = 1
                break
              case "Z":
                index = 2
                break
            }
            var model_pos = THREE.MMD.getModels()[0].mesh.position
            var pos_p = ["x", "y", "z"]
            var p = pos_p[index]
            light.position[p] = pos * MMD_SA_options.light_position_scale + model_pos[p]
            var pos_array = MMD_SA.TEMP_v3.copy(light.position).sub(model_pos).toArray()
            for (var i = 0; i < 3; i++)
              pos_array[i] = Math.round(pos_array[i]/MMD_SA_options.light_position_scale * 10) / 10
            System.Gadget.Settings.writeString('MMDLightPosition', JSON.stringify(pos_array))
            DEBUG_show("Light position:" + pos_array, 3)
            break
          case "reset":
            if (!confirm("This will reset lighting to its default state."))
              return
            System.Gadget.Settings.writeString('MMDLightColor', '')
            System.Gadget.Settings.writeString('MMDLightPosition', '')
            light.color.set(MMD_SA_options.light_color)
            light.position.fromArray(MMD_SA_options.light_position).add(THREE.MMD.getModels()[0].mesh.position)
            System._browser.update_tray()
            break
        }
        break
      case "PPE":
        var PPE = MMD_SA_options.MME.PostProcessingEffects
        switch (para[2]) {
          case "enabled":
            PPE.enabled = MMD_SA_options._PPE_enabled = !!parseInt(para[3])
            System.Gadget.Settings.writeString('Use3DPPE', ((PPE.enabled)?"non_default":""))
            System._browser.update_tray()
            break
          case "SAO":
            switch (para[3]) {
              case "disabled_by_material":
                var m_name = para[4]
                var disabled_by_material = MMD_SA_options.MME.SAO.disabled_by_material
                if (parseInt(para[5])) {
                  if (disabled_by_material.indexOf(m_name) == -1)
                    disabled_by_material.push(m_name)
                }
                else
                  MMD_SA_options.MME.SAO.disabled_by_material = disabled_by_material.filter(function (v) { return (v != m_name) })
                System._browser.update_tray()
                DEBUG_show('(Click "Save default" to save changes.)', 5)
                break
              default:
                PPE.use_SAO = !!parseInt(para[3])
                System.Gadget.Settings.writeString('Use3DSAO', ((PPE.use_SAO)?"non_default":""))
                break
            }
            break
          case "Diffusion":
            PPE.use_Diffusion = !!parseInt(para[3])
            System.Gadget.Settings.writeString('Use3DDiffusion', ((PPE.use_Diffusion)?"non_default":""))
            break
          case "BloomPostProcess":
            switch (para[3]) {
              case "blur_size":
                var v = parseFloat(para[4])
                if (v == -1)
                  return
                PPE.effects_by_name["BloomPostProcess"].blur_size = v
                System.Gadget.Settings.writeString('Use3DBloomPostProcessBlurSize', (v==0.5)?"":v)
                break
              case "threshold":
                var v = parseFloat(para[4])
                if (v == -1)
                  return
                PPE.effects_by_name["BloomPostProcess"].threshold = v
                System.Gadget.Settings.writeString('Use3DBloomPostProcessThreshold', (v==0.5)?"":v)
                break
              case "intensity":
                var v = parseFloat(para[4])
                if (v == -1)
                  return
                PPE.effects_by_name["BloomPostProcess"].intensity = v
                System.Gadget.Settings.writeString('Use3DBloomPostProcessIntensity', (v==0.5)?"":v)
                break
              default:
                PPE.use_BloomPostProcess = !!parseInt(para[3])
                System.Gadget.Settings.writeString('Use3DBloomPostProcess', ((PPE.use_BloomPostProcess)?"non_default":""))
                System._browser.update_tray()
                break
            }
            break
        }
        break
      case "SelfOverlay":
        var mme = MMD_SA_options.MME.self_overlay
        switch (para[2]) {
          case "opacity":
            var opacity = parseFloat(para[3])
            if (opacity < 0)
              return
            if (opacity == 0)
              mme.enabled = false
            else {
              mme.enabled = true
              mme.opacity = opacity
            }
            break
          case "brightness":
            var brightness = parseFloat(para[3])
            if (brightness < 0)
              return
            mme.brightness = brightness
            break
          case "color_adjust":
            var color = parseFloat(para[4])
            if (color < 0)
              return
            var color_adjust = mme.color_adjust || [1.5,1,1]
            var index
            switch (para[3]) {
              case "red":
                index = 0
                break
              case "green":
                index = 1
                break
              case "blue":
                index = 2
                break
            }
            color_adjust[index] = color
            mme.color_adjust = color_adjust
            break
          case "use_default":
            var use_default = parseInt(para[3])
            if (use_default) {
              MMD_SA_options.MME.self_overlay = Object.clone(MMD_SA_options.MME._self_overlay)
              MMD_SA._MME_uniforms_updated_ = Date.now()
              System._browser.update_tray()
              return
            }
            break
        }
        MMD_SA._MME_uniforms_updated_ = Date.now()
        MMD_SA_options.MME.self_overlay.use_default = false
        System._browser.update_tray()
        break
      case "HDR":
        var mme = MMD_SA_options.MME.HDR
        switch (para[2]) {
          case "opacity":
            var opacity = parseFloat(para[3])
            if (opacity < 0)
              return
            if (opacity == 0)
              mme.enabled = false
            else {
              mme.enabled = true
              mme.opacity = opacity
            }
            break
          case "use_default":
            var use_default = parseInt(para[3])
            if (use_default) {
              MMD_SA_options.MME.HDR = Object.clone(MMD_SA_options.MME._HDR)
              MMD_SA._MME_uniforms_updated_ = Date.now()
              System._browser.update_tray()
              return
            }
            break
        }
        MMD_SA._MME_uniforms_updated_ = Date.now()
        MMD_SA_options.MME.HDR.use_default = false
        System._browser.update_tray()
        break
      case "SeriousShader":
        var mme = MMD_SA_options.MME.serious_shader
        switch (para[2]) {
          case "OFF":
            mme.enabled = false
            break
          case "mode":
            mme.enabled = true
            var mode = parseInt(para[3])
            if (mode == 0)
              mme.type = "SeriousShader"
            else if (mode == 1)
              mme.type = "AdultShaderS2"
            else
              mme.type = "AdultShaderS"
//            mme.OverBright = (mme.type == "AdultShaderS2") ? 1.15 : 1.2
            break
          case "shadow_opacity":
            switch (para[3]) {
              case "material_x_0.5":
                if (!mme.material)
                  mme.material = {}
                var name = MMD_SA._material_list[para[4]]
                var v = (parseInt(para[5])) ? 0.5 : 1
                if (mme.material[name])
                  mme.material[name].shadow_opacity_scale = v
                else
                  mme.material[name] = { shadow_opacity_scale:v }
                break
              default:
                var opacity = parseFloat(para[3])
                if (opacity < 0)
                  return
                mme.shadow_opacity = opacity
              break
            }
            break
          case "OverBright":
            var over_bright = parseFloat(para[3])
            if (over_bright < 0)
              return
            mme.OverBright = over_bright
            break
          case "use_default":
            var use_default = parseInt(para[3])
            if (use_default) {
              MMD_SA_options.MME.serious_shader = Object.clone(MMD_SA_options.MME._serious_shader)
              MMD_SA._MME_uniforms_updated_ = Date.now()
              System._browser.update_tray()
              return
            }
            break
        }
        MMD_SA._MME_uniforms_updated_ = Date.now()
        MMD_SA_options.MME.serious_shader.use_default = false
        System._browser.update_tray()
        break
    }
    break

  case "look_at_camera":
    var _bool = !!parseInt(para[1])
    if (_bool)
      MMD_SA_options.look_at_screen = true
    else
      MMD_SA_options.look_at_screen = MMD_SA_options.look_at_mouse = false
    System.Gadget.Settings.writeString('MMDLookAtCamera', ((!MMD_SA_options.look_at_screen)?"non_default":""))
    System.Gadget.Settings.writeString('MMDLookAtMouse',  ((!MMD_SA_options.look_at_mouse) ?"non_default":""))
    break

  case "look_at_mouse":
    var _bool = !!parseInt(para[1])
    if (_bool)
      MMD_SA_options.look_at_mouse = MMD_SA_options.look_at_screen = true
    else
      MMD_SA_options.look_at_mouse = false
    System.Gadget.Settings.writeString('MMDLookAtCamera', ((!MMD_SA_options.look_at_screen)?"non_default":""))
    System.Gadget.Settings.writeString('MMDLookAtMouse',  ((!MMD_SA_options.look_at_mouse) ?"non_default":""))
    break

  case "trackball_camera":
    MMD_SA._trackball_camera.enabled = !!parseInt(para[1])
    System.Gadget.Settings.writeString('MMDTrackballCamera', ((!MMD_SA._trackball_camera.enabled)?"non_default":""))
    break

  case "random_camera":
    System.Gadget.Settings.writeString('MMDRandomCamera', ((!parseInt(para[1]))?"non_default":""))
    MMD_SA.reset_camera()
    break
}

if (linux_mode)
  System._browser.update_tray()
  }


 ,VMDSpectrum_EV_usage_PROCESS: function (obj, u, decay_factor) {
u /= 100
if (use_full_fps)
  decay_factor *= 2 / EV_sync_update.count_to_10fps_

// decay control
if (Settings.ReverseAnimation) {
  if (u - decay_factor > obj.u_last)
    u = obj.u_last + decay_factor
}
else {
  if (u + decay_factor < obj.u_last)
    u = obj.u_last - decay_factor
}
obj.u_last = u

return u// * 100
  }

 ,VMDSpectrum_process: function (model, model_para) {
if (!model_para.VMDSpectrum_initialized) {
  model_para.VMDSpectrum_initialized = true

  if (!model_para.VMDSpectrum_band) {
    model_para.VMDSpectrum_band = []
    for (var m_name in model_para.morph_default) {
      if (/^band(\d+)$/.test(m_name))
        model_para.VMDSpectrum_band.push(parseInt(RegExp.$1))
    }
  }
  model_para._VMDSpectrum_decay = []
  model_para.VMDSpectrum_band.forEach(function (b) {
    model_para._VMDSpectrum_decay.push({})
  });
}

if (!MMD_SA.music_mode)
  return

model_para._custom_morph = []
model_para.VMDSpectrum_band.forEach(function (i, idx) {
  var v = 0
  model_para.VMDSpectrum_band16_to_band[i-1].forEach(function (band) {
    v += EV_usage_sub.sound_raw[band].usage_raw
  });
  var weight = MMD_SA.VMDSpectrum_EV_usage_PROCESS(model_para._VMDSpectrum_decay[idx], Math.min(v/model_para.VMDSpectrum_band16_to_band[i-1].length,100), 0.2)

  var m_name = "band" + i
  var _m_idx = model.pmx.morphs_index_by_name[m_name]
  var _m = model.pmx.morphs[_m_idx]
  model_para._custom_morph.push({ key:{ name:m_name, weight:weight, morph_type:_m.type, morph_index:_m_idx }, idx:model.morph.target_index_by_name[m_name] })
});
  }

// WebGL2 shader conversion
// http://www.shaderific.com/blog/2014/3/13/tutorial-how-to-update-a-shader-for-opengl-es-30
// https://webgl2fundamentals.org/webgl/lessons/webgl1-to-webgl2.html
// http://forum.playcanvas.com/t/webgl-2-0-and-engine-release-notes-v0-207-22-02-16/3445

 ,webgl2_vshader_prefix_convert: function (string) {
if (!this.use_webgl2)
  return string

string = '#version 300 es\n' + this.webgl2_vshader_main_convert(string) + '\nout vec4 SA_FragColor;\n\n'
return string
  }

 ,webgl2_fshader_prefix_convert: function (string) {
if (!this.use_webgl2)
  return string

string = '#version 300 es\n' + this.webgl2_fshader_main_convert(string) + '\nout vec4 SA_FragColor;\n\n'
return string
  }

 ,webgl2_common_convert: function (string) {
if (!this.use_webgl2)
  return string

string = string.replace(/texture([^\w\()\_])/g, "texSA$1").replace(/texture(2D|Cube)\(/g, "texture(").replace(/texture2DProj\(/g, "textureProj(").replace(/gl_FragColor/g, "SA_FragColor").replace(/\#extension GL_OES_standard_derivatives \: enable/, "")
//.replace(/gl_FragDepthEXT/g, "gl_FragDepth")
return string
  }

 ,webgl2_vshader_main_convert: function (string) {
if (!this.use_webgl2)
  return string

string = this.webgl2_common_convert(string).replace(/varying /g, "out ").replace(/attribute /g, "in ")
return string
  }

 ,webgl2_fshader_main_convert: function (string) {
if (!this.use_webgl2)
  return string

string = this.webgl2_common_convert(string).replace(/varying /g, "in ")
return string
  }

 ,webgl2_RGBA_internal: function (gl, format, type) {
// https://developer.mozilla.org/en-US/docs/Web/API/WebGLRenderingContext/texImage2D
// https://www.khronos.org/registry/webgl/specs/latest/2.0/

if (!this.use_webgl2)
  return format

if (type == gl.FLOAT) {
  return ((format == gl.RGBA) ? gl.RGBA32F : format)
}
return format//gl.RGBA8
  }

// shadowMap
 ,toggle_shadowMap: function (enabled) {
if (enabled == null)
  enabled = MMD_SA_options.use_shadowMap
else
  MMD_SA_options.use_shadowMap = enabled

enabled = !!enabled

var renderer = MMD_SA.renderer
renderer.shadowMapAutoUpdate = enabled;

//					renderer.shadowMapEnabled = true;
					//renderer.shadowMapType = THREE.BasicShadowMap;
					//renderer.shadowMapType = THREE.PCFShadowMap;
//					renderer.shadowMapType = THREE.PCFSoftShadowMap;
					//renderer.shadowMapCullFace = THREE.CullFaceBack;
//					renderer.shadowMapDebug = true;
// AT: cascaded shadow map
renderer.shadowMapCascade = MMD_SA_options.shadow_para.use_cascaded_shadow_map
//renderer.shadowMapDebug = true;

// http://learningthreejs.com/blog/2012/01/20/casting-shadows/
//var light_id = "#MMD_DirLight"//"#light_spo" //
//var light = jThree(light_id).three( 0 );

// http://www20.atpages.jp/katwat/three.js_r58/examples/mytest34/menu.html
// var lightParam = {length:40, angle:-30/180*Math.PI},

for (var i = 1, i_max = MMD_SA.light_list.length; i < i_max; i++) {
  var light = MMD_SA.light_list[i].obj
  if (light instanceof THREE.PointLight)
    continue

  light.castShadow = enabled;
  if (enabled && renderer.shadowMapCascade) {
    light.shadowCascade = true
    console.log("Use cascaded shadow map")
  }
//light.onlyShadow = true;
  for (var p in MMD_SA_options.shadow_para)
    light[p] = MMD_SA_options.shadow_para[p]
//light.shadowCameraVisible = true; // for debug

//setTimeout(function(){console.log(light)}, 3000)
}

THREE.MMD.getModels().forEach(function (model, idx) {
  var mesh = model.mesh

  var material_para = MMD_SA_options.model_para_obj_all[idx].material_para || {}
  material_para = material_para._default_ || {}

  var cs = !!mesh.castShadow
  var rs = !!mesh.receiveShadow
  mesh.castShadow    = enabled && ((material_para.castShadow != null)    ? !!material_para.castShadow : true);
  mesh.receiveShadow = enabled && ((material_para.receiveShadow != null) ? !!material_para.receiveShadow : !MMD_SA_options.ground_shadow_only);

  if (/*(cs != mesh.castShadow) || */(rs != mesh.receiveShadow)) {
    mesh.material.materials.forEach(function(m) {
      m.needsUpdate = true;
    });
  }
});

MMD_SA_options.x_object.forEach(function (x_object, idx) {
  var obj = x_object._obj
  var mesh = obj.children[0]

  var cs = !!mesh.castShadow
  var rs = !!mesh.receiveShadow
  obj.castShadow    = mesh.castShadow    = enabled && !!x_object.castShadow;
  obj.receiveShadow = mesh.receiveShadow = enabled && !!x_object.receiveShadow;

  if (/*(cs != mesh.castShadow) || */(rs != mesh.receiveShadow)) {
//DEBUG_show(idx,0,1)
    mesh.material.materials.forEach(function (m) {
      m.needsUpdate = true;
    });
  }
});

window.dispatchEvent(new CustomEvent("SA_MMD_toggle_shadowMap"));

  }

 ,light_list: []

 ,MME_init: function () {
var MME_saved = MMD_SA_options.MME_saved[MMD_SA_options.model_para_obj._filename] || MMD_SA_options.MME_saved[MMD_SA_options.model_para_obj._filename_cleaned]
if (MME_saved) {
  MMD_SA_options.MME.self_overlay = Object.clone(MME_saved.self_overlay)
  MMD_SA_options.MME.HDR = Object.clone(MME_saved.HDR)
  MMD_SA_options.MME.serious_shader = Object.clone(MME_saved.serious_shader)
  MMD_SA_options.MME.SAO = Object.clone(MME_saved.SAO)
}

MMD_SA_options.MME.self_overlay = MMD_SA_options.MME.self_overlay || { enabled:false }
MMD_SA_options.MME.HDR = MMD_SA_options.MME.HDR || { enabled:false }
MMD_SA_options.MME.serious_shader = MMD_SA_options.MME.serious_shader || { enabled:false }
MMD_SA_options.MME.SAO = MMD_SA_options.MME.SAO || { disabled_by_material:[] }

MMD_SA_options.MME._self_overlay = Object.clone(MMD_SA_options.MME.self_overlay)
MMD_SA_options.MME._HDR = Object.clone(MMD_SA_options.MME.HDR)
MMD_SA_options.MME._serious_shader = Object.clone(MMD_SA_options.MME.serious_shader)
MMD_SA_options.MME._SAO = Object.clone(MMD_SA_options.MME.SAO)
//console.log(MMD_SA_options.MME)
  }

 ,ripple_process: (function () {
    var drop_list = []
    var pos_to_track
    var _timestamp = 0
    var _timestamp_to_renew = 0

    var v3_bone, v3a

    function get_pos(mesh, bone_name, v3) {
      return (v3||v3_bone).getPositionFromMatrix(mesh.bones_by_name[bone_name].skinMatrix).applyMatrix4(mesh.matrixWorld)
    }

    function ripple_reset() {
      for (var i = 0, i_max = MMD_SA_options.ripple_max; i < i_max; i++)
        drop_list[i] = new THREE.Vector4()
      pos_to_track = {}
      _timestamp = 0
      _timestamp_to_renew = 0
    }

    window.addEventListener("MMDStarted", function () {
      v3_bone = new THREE.Vector3()
      v3a = new THREE.Vector3()
      ripple_reset()
    });

    window.addEventListener("SA_Dungeon_onrestart", function () {
      ripple_reset()
    });

    return function () {
if (!MMD_SA.MMD_started)
  return drop_list

var timestamp = RAF_timestamp
if (_timestamp == timestamp)
  return drop_list

// first frame: initialize and return
if (!_timestamp) {
  _timestamp = timestamp
//左足首//ＩＫ
//右足首
  let mesh = THREE.MMD.getModels()[0].mesh
  pos_to_track.PC = {
    timestamp:_timestamp
   ,bones: [
  { name:"左足首", pos:get_pos(mesh, "左足首").clone() }
 ,{ name:"右足首", pos:get_pos(mesh, "右足首").clone() }
    ]
  };
  return drop_list
}

var t_diff = (timestamp - _timestamp) / 1000
_timestamp = timestamp

var index_free = []
var index_spare = []
var active_drop_count = 0
drop_list.forEach(function (drop, idx) {
  if (!drop.z) {
    index_free.push(idx)
    return
  }

  drop.w += 0.1 * t_diff*60*1.5
  if (drop.w > 50) {
    drop.z = 0
    index_free.push(idx)
  }
  else {
    active_drop_count++
    index_spare.push({ idx:idx, w:drop.w })
  }
});

//DEBUG_show([active_drop_count,drop_list[0].w,Date.now()].join("\n"))

// renew drop 10 times/sec
if (_timestamp_to_renew == PC_count_absolute)
  return drop_list
_timestamp_to_renew = PC_count_absolute

var d = MMD_SA_options.Dungeon

var index_spare_sorted = false
for (var model_name in pos_to_track) {
  var model_obj = pos_to_track[model_name]
  t_diff = (timestamp - model_obj.timestamp) / 1000
  if (t_diff == 0)
    continue

  var mesh
  if (model_name == "PC") {
    mesh = THREE.MMD.getModels()[0].mesh
  }

  var pos_base = get_pos(mesh, "全ての親", v3a)
  
  if (d) {
    let x = ~~(pos_base.x/d.grid_size)
    let y = ~~(pos_base.z/d.grid_size)
    let grid_para = d.get_para(x,y)
    let material_id = grid_para.floor_material_index
    if (material_id == null)
      material_id = d.floor_material_index_default
    let p = d.grid_material_list[material_id]
    if (!p || !p.waveBaseSpeed) continue

    let ground_y_water = d.get_para(x,y,true).ground_y_visible || 0
    if (pos_base.y > ground_y_water) continue

//DEBUG_show(pos_base.toArray().join("\n") + "\n\n" + get_pos(mesh, "左足首").toArray().join("\n"))
  }

  var drop_new_list = []
  model_obj.bones.forEach(function (bone, idx) {
    var pos = get_pos(mesh, bone.name)
    var dis_in_1_sec = pos.distanceTo(bone.pos) / t_diff
//DEBUG_show(dis_in_1_sec+'\n'+Date.now())
    if (dis_in_1_sec > 10) {
      var z = dis_in_1_sec/(30*2)
      drop_new_list.push({ bone_idx:idx, z:z })
    }
    bone.pos.copy(pos)
  });

  model_obj.timestamp = timestamp
  if (drop_new_list.length) {
    drop_new_list.sort(function (a,b) { return b.z-a.z })
    var drop_new_max = Math.min(2, drop_new_list.length, MMD_SA_options.ripple_max)
    if (index_free.length < drop_new_max) {
      if (!index_spare_sorted) {
        index_spare_sorted = true
        index_spare.sort(function (a,b) { return b.w-a.w })
      }
      for (var i = 0, i_max = drop_new_max-index_free.length; i < i_max; i++)
        index_free.push(index_spare.shift().idx)
    }

    for (var i = 0; i < drop_new_max; i++) {
      var drop_new = drop_list[index_free.shift()]
      var drop_new_para = drop_new_list[i]
      pos_base = model_obj.bones[drop_new_para.bone_idx].pos
      drop_new.x = pos_base.x
      drop_new.y = pos_base.z
      drop_new.z = Math.min(drop_new_para.z, 2)
//DEBUG_show(z_max*30+'\n'+Date.now())
      drop_new.w = 0//-2//
    }
  }
}

return drop_list
    };
  })()

 ,WebXR: (function () {
    var xr;
    var _camera;

    window.addEventListener("MMDStarted", function () {
      _camera = MMD_SA._trackball_camera.object.clone()

      var AR_options = MMD_SA_options.WebXR && MMD_SA_options.WebXR.AR;
      if (AR_options && AR_options.dom_overlay) {
        AR_options.dom_overlay.root = (AR_options.dom_overlay.root && document.getElementById(AR_options.dom_overlay.root)) || document.body;
      }
    });

    window.addEventListener("SA_AR_dblclick", (function () {
      function update_obj_default(model_mesh, first_call) {
xr.hit_ground_y = xr.hitMatrix_anchor.decomposed[0].y;
xr.hit_ground_y_lowest = (xr.hit_ground_y_lowest == null) ? xr.hit_ground_y : Math.min(xr.hit_ground_y, xr.hit_ground_y_lowest);

if (first_call) {
  model_mesh.lookAt(MMD_SA.TEMP_v3.copy(model_mesh.position).add(xr.camera._pos_XR).sub(xr.hitMatrix_anchor.decomposed[0]).setY(model_mesh.position.y))
  MMD_SA_options.mesh_obj_by_id["CircularSpectrumMESH"] && MMD_SA_options.mesh_obj_by_id["CircularSpectrumMESH"]._obj.rotation.setEulerFromQuaternion(model_mesh.quaternion)
}
      }

      function update_anchor(hit, update_obj) {
const AR_options = MMD_SA_options.WebXR.AR;
let model_mesh = THREE.MMD.getModels()[0].mesh;

xr.hitMatrix_anchor = {
  obj: xr.hitMatrix.obj.clone()
 ,decomposed: xr.hitMatrix.decomposed.slice()
 ,_pos_: xr.hitMatrix.decomposed[0]
 ,game_geo: {
    position: model_mesh.position.clone().setY(0)
  }
};

if (!update_obj)
  update_obj = update_obj_default
update_obj(model_mesh, true)

if (xr.can_requestHitTestSource && hit.createAnchor && (AR_options.anchors_enabled !== false)) {
  hit.createAnchor(new XRRigidTransform()).then(function (anchor) {
//    DEBUG_show("anchor created")
    if (model_mesh._anchor) {
      if (model_mesh._anchor.delete)
        model_mesh._anchor.delete()
      else
        model_mesh._anchor.detach()
      xr.anchors.delete(model_mesh._anchor)
    }
    model_mesh._anchor = anchor

    anchor._data = {
      obj: model_mesh
     ,update: update_obj
    };
    xr.anchors.add(anchor)
  }).catch(function (err) {
    DEBUG_show(".createAnchor ERROR:" + err)
  });
}

xr.hit_found = true

try {
  xr.xrViewerSpaceHitTestSource && xr.xrViewerSpaceHitTestSource.cancel();
}
catch (err) { DEBUG_show("FAILED: xr.xrViewerSpaceHitTestSource.cancel()") }
xr.xrViewerSpaceHitTestSource = null
xr.hits_searching = false

xr.reticle.visible = false

xr.restore_scene()
MMD_SA.reset_gravity()

let ao = SL_MC_video_obj && SL_MC_video_obj.vo && SL_MC_video_obj.vo.audio_obj;
if (ao && ao.paused) {
  SL_MC_Play()
}

if (MMD_SA_options.Dungeon) {
  MMD_SA_options.Dungeon.object_click_disabled = false
}
      }

      return function (e) {
const AR_options = MMD_SA_options.WebXR.AR;
if (xr.reticle.visible) {
  e.detail.result.return_value = true

  let update_obj

  let axis = xr.hitMatrix.decomposed[3];
//DEBUG_show(axis.toArray().join("\n"))

  if (Math.abs(axis.y) < 0.5) {
//DEBUG_show("wall hit",0,1)
    if (!AR_options.onwallhit) {
      DEBUG_show("(Model cannot be placed here.)", 3)
      return
    }
    if (AR_options.onwallhit(e)) {
      return
    }
    update_obj = e.detail.result.update_obj
  }
  else {
//DEBUG_show("ground hit",0,1)
    if (AR_options.ongroundhit) {
      if (AR_options.ongroundhit(e)) {
        return
      }
      update_obj = e.detail.result.update_obj
    }
  }

  xr._update_anchor = function (hit) { update_anchor(hit, update_obj) };
}
else if (xr.hit_found && AR_options.item_reticle_id && xr.session.domOverlayState && !e.detail.is_item) {
  e.detail.result.return_value = true
  DEBUG_show("(Use item to reactivate AR reticle.)",3)
}
else if (xr.hit_found) {
  e.detail.result.return_value = true

  xr.hit_found = false
  xr.reticle.position.copy(xr.hitMatrix_anchor.game_geo.position)
  xr.reticle.visible = true
//  document.getElementById("SL_Host").style.visibility = "hidden"

  if (MMD_SA_options.Dungeon) {
    MMD_SA_options.Dungeon.object_click_disabled = true
  }
}
      };
    })());

    var zoom_scale = 1
    var _zoom_distance_last

    var e_touch = {
      touches: [
        { pageX:0, pageY:0 }
       ,{ pageX:0, pageY:0 }
      ]
    };

    function touchstart(e) {
if (e.touches.length != 2) return

var dx = e.touches[0].pageX - e.touches[1].pageX;
var dy = e.touches[0].pageY - e.touches[1].pageY;
_zoom_distance_last = Math.sqrt( dx * dx + dy * dy );
    }

    function touchmove(e) {
if (e.touches.length != 2) return

var dx = e.touches[0].pageX - e.touches[1].pageX;
var dy = e.touches[0].pageY - e.touches[1].pageY;
var dis = Math.sqrt( dx * dx + dy * dy );
xr.zoom_scale = zoom_scale * _zoom_distance_last/dis;
_zoom_distance_last = dis
    }

    function DOM_event_dblclick(e) {
e.stopPropagation();
e.stopImmediatePropagation();
e.preventDefault();
//DEBUG_show(Date.now())

//SA_AR_dblclick
var result = { return_value:null }
window.dispatchEvent(new CustomEvent("SA_AR_dblclick", { detail:{ e:e, result:result } }));
if (result.return_value) {
  return
}
    }

    xr = {
  can_AR: false

 ,enter_AR: async function () {
if (!this.can_AR) {
  DEBUG_show("(AR not supported by this device)", 2)
  return
}
if (!MMD_SA.MMD_started) {
  DEBUG_show("(AR not available before MMD loading is complete)", 3)
  return
}
if (this.session) {
  DEBUG_show("(XR session already active)", 2)
  return
}

this.user_camera.hide()

const AR_options = MMD_SA_options.WebXR.AR;
try {
// https://immersive-web.github.io/dom-overlays/
// https://klausw.github.io/three.js/examples/webvr_lorenzattractor.html
  let options = (xr.can_requestHitTestSource) ? {requiredFeatures:["hit-test"]} : {};
  if (AR_options.dom_overlay && (AR_options.dom_overlay.enabled !== false)) {
    options.domOverlay = {root:AR_options.dom_overlay.root};
    options.optionalFeatures = ["dom-overlay","dom-overlay-for-handheld-ar"];
  }
  if (AR_options.light_estimation_enabled !== false) {
    if (!options.optionalFeatures)
      options.optionalFeatures = []
    options.optionalFeatures.push("light-estimation")
  }
  if (AR_options.anchors_enabled !== false) {
    if (!options.optionalFeatures)
      options.optionalFeatures = []
    options.optionalFeatures.push("anchors")
  }
  const session = await navigator.xr.requestSession('immersive-ar', options);

  this.onSessionStart(session)
}
catch (err) {
  console.error(err)
//  DEBUG_show("(AR session failed 01)")

  try {
// for Chrome 80
    let options = {};
    if (AR_options.dom_overlay && (AR_options.dom_overlay.enabled !== false)) {
      options.optionalFeatures = ["dom-overlay","dom-overlay-for-handheld-ar"];
    }
    const session = await navigator.xr.requestSession('immersive-ar', options);

    this.onSessionStart(session)
  }
  catch (err2) {
    console.error(err2)
    DEBUG_show("(AR session failed 02)")
  }
}
  }

 ,input_event: { inputSources:[], touches:[] }

 ,get zoom_scale() { return zoom_scale; }
 ,set zoom_scale(v) {
zoom_scale = v;
window.dispatchEvent(new CustomEvent("SA_AR_zoom_scale_update"));
  }

 ,hits: []
 ,hits_searching: false
 ,hit_found: false

 ,anchors: new Set()

 ,xrViewerSpaceHitTestSource: null
 ,xrTransientInputHitTestSource: null
 ,onSessionStart: async function (session) {
this.session = session

const AR_options = MMD_SA_options.WebXR.AR;

session.addEventListener('end', this.onSessionEnd);

session.addEventListener('inputsourceschange', function (e) {
  var inputSources = e.session.inputSources;
  xr.input_event.inputSources = []
  for (var i = 0, i_max = inputSources.length; i < i_max; i++) {
    xr.input_event.inputSources[i] = inputSources[i];
  }
//DEBUG_show(xr.input_event.inputSources.length,0,1)
  xr.input_event.touches = xr.input_event.inputSources.filter(inputSource => ((inputSource.targetRayMode == "screen") && inputSource.gamepad));
});

session.addEventListener('selectstart', function (e) {
  var time = Date.now()
  xr.input_event.touchdown = time
});

session.addEventListener('selectend', function (e) {
  if (!xr.input_event.touchdown)
    return

  var result

  var time = Date.now()
  var time_diff = time - xr.input_event.touchdown
  xr.input_event.touchdown = null

  if (time_diff > 400)
    return

  if (xr.input_event.click && (time - xr.input_event.click < 400)) {
    xr.input_event.click = false

    result = { return_value:null }
    window.dispatchEvent(new CustomEvent("SA_AR_dblclick", { detail:{ e:e, result:result } }));
    if (result.return_value) {
      return
    }
  }

  result = { return_value:null }
  window.dispatchEvent(new CustomEvent("SA_AR_click", { detail:{ e:e, result:result } }));
  if (result.return_value) {
    return
  }

  xr.input_event.click = time
});

session.addEventListener('select', function (e) {
  var time = Date.now()
  if (xr.screen_clicked && (time - xr.screen_clicked < 400))
    xr.screen_dblclicked = time
  xr.screen_clicked = time
});

/*
// https://github.com/immersive-web/hit-test/blob/master/hit-testing-explainer.md
// https://storage.googleapis.com/chromium-webxr-test/r740830/proposals/phone-ar-hit-test.html
        session.requestHitTestSourceForTransientInput({
          profile : "generic-touchscreen"
        }).then(transient_input_hit_test_source => {
          console.debug("Hit test source for generic touchscreen created!");
          xrTransientInputHitTestSource = transient_input_hit_test_source;
        });
*/

let c_host = (returnBoolean("CSSTransform3DDisabledForContent")) ? document.getElementById("Lbody_host") : document.getElementById("Lbody");
xr.zoom_scale = 1;
c_host.addEventListener( 'touchstart', touchstart, false );
c_host.addEventListener( 'touchmove', touchmove, false );

this.camera = MMD_SA._trackball_camera.object

this.renderer = MMD_SA.renderer;
//this.renderer.autoClear = false;

this.gl = this.renderer.getContext();

this.use_dummy_webgl = session.domOverlayState && AR_options.dom_overlay && AR_options.dom_overlay.use_dummy_webgl;
if (this.use_dummy_webgl) {
  DEBUG_show("Use dummy WebGL (AR)",5)
  if (!this.user_camera.initialized)
    this.gl = document.createElement("canvas").getContext("webgl2");
}

try {
  await this.gl.makeXRCompatible();
  session.updateRenderState({ baseLayer: new XRWebGLLayer(session, this.gl, ((AR_options.framebufferScaleFactor||System._browser.url_search_params.xr_fb_scale) && {framebufferScaleFactor:Math.max(0,Math.min(1,AR_options.framebufferScaleFactor||parseFloat(System._browser.url_search_params.xr_fb_scale)||1))}) || null) });
  this.frameOfRef = await session.requestReferenceSpace('local');
  this.frameOfRef_viewer = await session.requestReferenceSpace('viewer');
}
catch (err) {
  session.end()
  console.error(err)
  DEBUG_show("AR session error:" + err,0,1)
  return
}

this.light_color_base = jThree("#MMD_DirLight").three(0).color.clone()
this.light_position_base = jThree("#MMD_DirLight").three(0).position.clone()
if (AR_options.light_estimation_enabled !== false) {
//DEBUG_show(".requestLightProbe:" + ("requestLightProbe" in XRSession.prototype))
  if (session.requestLightProbe) {
    try {
      this.lightProbe = await session.requestLightProbe();
//      DEBUG_show(".requestLightProbe OK")
    }
    catch (err) {
      DEBUG_show(".requestLightProbe ERROR:" + err)
    }
  }
  else if (session.updateWorldTrackingState) {
    try {
      session.updateWorldTrackingState({
// https://chromium.googlesource.com/chromium/src/+/master/third_party/blink/renderer/modules/xr/xr_world_tracking_state.idl
//        "planeDetectionState" : { "enabled" : true}
        "lightEstimationState" : { "enabled" : true}
      });
    }
    catch (err) {
      DEBUG_show("light-estimation failed to init")
    }
  }
}

if (!this.reticle) {
  let geometry = new THREE.RingGeometry(0.1, 0.11, 24, 1);
  geometry.applyMatrix(new THREE.Matrix4().makeRotationX(THREE.Math.degToRad(-90)));
  let material = new THREE.MeshBasicMaterial({ color: 0xffffff });
  let reticle0 = new THREE.Mesh(geometry, material);

  this.reticle = new THREE.Object3D()
  this.reticle.useQuaternion = true
  this.reticle.add(reticle0)

  MMD_SA.scene.add(this.reticle)
  this.reticle.scale.set(10,10,10)

  Object.defineProperty(this.reticle, "visible", {
    get: function () {
return this._visible_;
    }

   ,set: function (v) {
this._visible_ = reticle0.visible = v
if (xr.ground_plane)
  xr.ground_plane.visible = !v
    }
  });

  if (AR_options.dom_overlay && (AR_options.dom_overlay.enabled !== false)) {
    document.body.addEventListener('beforexrselect', (ev) => {
      ev.preventDefault();
    });
  }
}
this.reticle.visible = false

this.hit_ground_y = null
this.hit_ground_y_lowest = null

MMD_SA.reset_camera()
MMD_SA._reset_camera = MMD_SA.reset_camera
MMD_SA.reset_camera = function () {}
MMD_SA._trackball_camera.enabled = false
xr.camera.matrixAutoUpdate = false;

//THREE.MMD.getModels()[0].mesh.visible = false
xr.XR_objects_by_id = {}
MMD_SA.scene.__objects.forEach(function (obj, idx) {
// top-level objects/MMD models only
// Note: MMD model(SkinnedMesh) is wrapped by Object3D. Ignore that wrapper.
  if (((obj.parent != MMD_SA.scene) && !(obj instanceof THREE.SkinnedMesh)) || (obj.children[0] instanceof THREE.SkinnedMesh)) return;
//DEBUG_show(idx,0,1)
  if (!obj._XR_id)
    obj._XR_id = THREE.Math.generateUUID()
  xr.XR_objects_by_id[obj._XR_id] = {
    obj: obj
   ,visible: obj.visible
  };
  if (obj.visible)
    obj.visible = false
});
//document.getElementById("SL_Host").style.visibility = "hidden"

let ao = SL_MC_video_obj && SL_MC_video_obj.vo && SL_MC_video_obj.vo.audio_obj;
if (ao && !ao.paused) {
  SL_MC_Play()
}

if (1||!this.use_dummy_webgl) {
  EV_sync_update.requestAnimationFrame_auto = false
  if (RAF_timerID) {
    cancelAnimationFrame(RAF_timerID)
    RAF_timerID = null
  }
}

if (1) {
  if (!this.use_dummy_webgl) {
    document.getElementById("SL").style.visibility = "hidden"
  }
  document.getElementById("LdesktopBG_host").style.visibility = "hidden"
  document.getElementById("Lquick_menu").style.display = "none"

  c_host.addEventListener("dblclick", DOM_event_dblclick)
// push the .onclick AFTER the AR event handler
  if (c_host.ondblclick) {
    c_host._ondblclick = c_host.ondblclick
    c_host.addEventListener( 'dblclick', c_host.ondblclick)
    c_host.ondblclick = null
  }
  else if (c_host._ondblclick) {
    c_host.removeEventListener("dblclick", c_host._ondblclick)
    c_host.addEventListener("dblclick", c_host._ondblclick)
  }
}

window.dispatchEvent(new CustomEvent("SA_AR_onSessionStarted"));

session.requestAnimationFrame(xr.onARFrame);
  }

 ,restore_scene: function () {
MMD_SA.scene.__objects.forEach(function (obj) {
  var xr_obj = obj._XR_id && xr.XR_objects_by_id[obj._XR_id];
  if (xr_obj && xr_obj.visible)
    obj.visible = true
});
MMD_SA.SpeechBubble.hide();
//System._browser.on_animation_update.add(function () { document.getElementById("SL_Host").style.visibility = "visible"; },0,0);
  }

 ,onSessionEnd: function () {
this.frameOfRef = null
this.frameOfRef_viewer = null
this.session = null

this.xrViewerSpaceHitTestSource = null
this.xrTransientInputHitTestSource = null

this.hits = []
this.hits_searching = false
this.hit_found = false
this.hitMatrix = null
this.hitMatrix_anchor = null
this._update_anchor = null

this.hit_ground_y = null
this.hit_ground_y_lowest = null

this.reticle.visible = false

this.lightProbe = null

for (const anchor of this.anchors) {
  anchor._data.obj._anchor = null
}
this.anchors.clear()

let c_host = (returnBoolean("CSSTransform3DDisabledForContent")) ? document.getElementById("Lbody_host") : document.getElementById("Lbody");
xr.zoom_scale = 1;
c_host.removeEventListener( 'touchstart', touchstart, false );
c_host.removeEventListener( 'touchmove', touchmove, false );

jThree("#MMD_DirLight").three(0).color.copy(this.light_color_base)
jThree("#MMD_DirLight").three(0).position.copy(this.light_position_base)

this.input_event = { inputSources:[], touches:[] }

var model_mesh = THREE.MMD.getModels()[0].mesh
this.restore_scene()
this.XR_objects_by_id = null

model_mesh.position.y = 0
model_mesh.quaternion.set(0,0,0,1)
MMD_SA_options.mesh_obj_by_id["CircularSpectrumMESH"] && MMD_SA_options.mesh_obj_by_id["CircularSpectrumMESH"]._obj.rotation.set(0,0,0)

if (MMD_SA_options.motion_shuffle_list_default && (MMD_SA_options.motion_shuffle_list_default[0] != MMD_SA_options._motion_shuffle_list_default[0])) {
  MMD_SA_options.motion_shuffle_list_default = MMD_SA_options._motion_shuffle_list_default.slice()
  MMD_SA._force_motion_shuffle = true
}

MMD_SA.reset_camera = MMD_SA._reset_camera
MMD_SA.reset_camera()
MMD_SA._trackball_camera.enabled = true
this.camera.matrixAutoUpdate = true

if (1||!this.use_dummy_webgl) {
  EV_sync_update.requestAnimationFrame_auto = true
  if (RAF_timerID) {
    cancelAnimationFrame(RAF_timerID)
    RAF_timerID = null
  }
  RAF_timerID = requestAnimationFrame(Animate_RAF)
}

if (1) {
  document.getElementById("SL").style.visibility = "inherit"
  document.getElementById("LdesktopBG_host").style.visibility = "inherit"
  document.getElementById("Lquick_menu").style.display = "block"

  c_host.removeEventListener("dblclick", DOM_event_dblclick)
}

this.renderer.device_framebuffer = null;
window.dispatchEvent(new Event('resize'));

this.user_camera.hide()

window.dispatchEvent(new CustomEvent("SA_AR_onSessionEnd"));

//DEBUG_show("session ended",0,1)
  }

 ,onARFrame: function (time, frame) {
//let _now = performance.now();
let session = frame.session;
session.requestAnimationFrame(this.onARFrame);

const AR_options = MMD_SA_options.WebXR.AR;

let pose;
try {
  pose = frame.getViewerPose(this.frameOfRef);
} catch (err) { DEBUG_show("Err:no pose",0,1)}

if (pose) {
  if (!this.use_dummy_webgl || (this.user_camera.initialized && !this.user_camera.visible)) {
    this.renderer.device_framebuffer = session.renderState.baseLayer.framebuffer;
  }
  else {
    this.renderer.device_framebuffer = null;
  }

  const DPR = MMD_SA._renderer.devicePixelRatio / window.devicePixelRatio;
  for (let view of pose.views) {
    const viewport = session.renderState.baseLayer.getViewport(view);
    this.renderer.setViewport(viewport.x*DPR, viewport.y*DPR, viewport.width*DPR, viewport.height*DPR);

    this.camera.projectionMatrix.fromArray(view.projectionMatrix);
    this.camera.matrix.fromArray(view.transform.matrix);

//    this.camera.updateMatrixWorld(true);
// update .matrixWorld mnaully, to avoid repeated .updateMatrixWorld from below (to avoid issues for positional audio, etc)
if ( this.camera.parent === undefined ) {
  this.camera.matrixWorld.copy( this.camera.matrix );
}
else {
  this.camera.matrixWorld.multiplyMatrices( this.camera.parent.matrixWorld, this.camera.matrix );
}

    this.camera._pos_XR = (this.camera._pos_XR||new THREE.Vector3()).getPositionFromMatrix(this.camera.matrix);

    _camera.matrixWorld.copy(this.camera.matrixWorld);
    _camera.projectionMatrix.copy(this.camera.projectionMatrix);
  }
//DEBUG_show(parseInt(performance.now()-_now))

// https://immersive-web.github.io/webxr/#xrinputsource
// https://github.com/immersive-web/webxr-gamepads-module/blob/master/gamepads-module-explainer.md
  let is_touchstart
  let touches = xr.input_event.touches
  touches.forEach(function (touch) {
    if (!touch._initialized) {
      touch._initialized = true
      is_touchstart = true
    }
  });
  if (!session.domOverlayState && (touches.length == 2)) {
    e_touch.touches[0].pageX = touches[0].gamepad.axes[0]
    e_touch.touches[0].pageY = touches[0].gamepad.axes[1]
    e_touch.touches[1].pageX = touches[1].gamepad.axes[0]
    e_touch.touches[1].pageY = touches[1].gamepad.axes[1]
    if (is_touchstart) {
      touchstart(e_touch)
    }
    else {
      touchmove(e_touch)
    }
//DEBUG_show(Date.now()+":"+new THREE.Matrix4().fromArray(frame.getPose(touches[0].targetRaySpace, this.frameOfRef).transform.matrix).decompose()[0].toArray());
  }
//xr.input_event.touches.length && DEBUG_show('(v2)'+Date.now()+'('+xr.input_event.touches.length+'):'+xr.input_event.touches[0]._data)

  let hit_result = this.hit_test(frame)
  if (hit_result) {
    if (!this.hit_found && hit_result.hitMatrix) {
      if (this.hitMatrix_anchor) {
        this.reticle.position.copy(this.hitMatrix_anchor.game_geo.position).add(MMD_SA.TEMP_v3.copy(this.hitMatrix.decomposed[0]).sub(this.hitMatrix_anchor.decomposed[0]).multiplyScalar(10*zoom_scale));
      }
      else {
        this.reticle.position.copy(this.hitMatrix.decomposed[0]).multiplyScalar(10);
      }
      this.reticle.quaternion.copy(this.hitMatrix.decomposed[1]);

      this.reticle.visible = true;
    }
  }

  try {
    if (AR_options.light_estimation_enabled !== false) {
      let lightEstimate, li, ld
      if (this.lightProbe) {
// https://github.com/immersive-web/lighting-estimation/blob/master/lighting-estimation-explainer.md
        lightEstimate = frame.getLightEstimate(this.lightProbe)
        li = lightEstimate.primaryLightIntensity
        ld = lightEstimate.primaryLightDirection
      }
      else if (frame.worldInformation && frame.worldInformation.lightEstimation) {
// https://chromium.googlesource.com/chromium/src/+/master/third_party/blink/renderer/modules/xr/xr_world_information.idl
// https://chromium.googlesource.com/chromium/src/+/master/third_party/blink/renderer/modules/xr/xr_light_estimation.idl
// https://chromium.googlesource.com/chromium/src/+/master/third_party/blink/renderer/modules/xr/xr_light_probe.idl
        lightEstimate = frame.worldInformation.lightEstimation.lightProbe
        li = lightEstimate.mainLightIntensity
        ld = lightEstimate.mainLightDirection
      }
      if (lightEstimate) {
//DEBUG_show([ld.x, ld.y, ld.z, ld.w])
        let L = jThree("#MMD_DirLight").three(0)
//        L.position.copy(ld).multiplyScalar(MMD_SA_options.light_position_scale)
        let c = L.color
        c.copy(this.light_color_base)
        c.r *= Math.min(1.5, 0.75 * Math.sqrt(li.x))
        c.g *= Math.min(1.5, 0.75 * Math.sqrt(li.y))
        c.b *= Math.min(1.5, 0.75 * Math.sqrt(li.z))
      }
    }
  }
  catch (err) { DEBUG_show(".lightEstimation failed") }

  const trackedAnchors = frame.trackedAnchors;
  if (trackedAnchors) {
// https://github.com/immersive-web/anchors/blob/master/explainer.md
// view-source:https://storage.googleapis.com/chromium-webxr-test/r695783/proposals/phone-ar-plane-detection-anchors.html
    try {
      for (const anchor of trackedAnchors) {
//DEBUG_show(time+'\n'+JSON.stringify(frame.getPose(anchor.anchorSpace, this.frameOfRef).transform.position))
//if ((time != anchor.lastChangedTime) || !anchor._data || !anchor._data.update)
if (!xr.anchors.has(anchor) || !anchor._data || !anchor._data.update)
  continue

let transform = frame.getPose(anchor.anchorSpace, this.frameOfRef).transform;
let checksum = transform.matrix.reduce((n0,n1)=>n0+n1);
if (checksum == xr.hitMatrix_anchor._checksum)
  continue

// position/etc offset between the original hit-test result and the INITIAL anchor update
if (!xr.hitMatrix_anchor._decomposed_offset) {
  xr.hitMatrix_anchor._decomposed_offset = [xr.hitMatrix_anchor.decomposed[0].sub(transform.position)]
}

xr.hitMatrix_anchor._checksum = checksum
xr.hitMatrix_anchor.obj = (xr.hitMatrix_anchor.obj||new THREE.Matrix4()).fromArray(transform.matrix);
xr.hitMatrix_anchor.decomposed = [new THREE.Vector3().copy(transform.position).add(xr.hitMatrix_anchor._decomposed_offset[0]), new THREE.Quaternion().copy(transform.orientation), null];
xr.hitMatrix_anchor.decomposed[3] = new THREE.Vector3(0,1,0).applyQuaternion(xr.hitMatrix_anchor.decomposed[1]);

anchor._data.update(anchor._data.obj);

//DEBUG_show(time+','+xr.anchors.size+'/'+trackedAnchors.size+':anchor(v4)\n'+MMD_SA.TEMP_v3.copy(xr.hitMatrix_anchor._pos_).sub(xr.hitMatrix_anchor.decomposed[0]).toArray().join("\n"))
      }
    }
    catch (err) { DEBUG_show('AE:'+err) }
  }

// xyz
  let camera_ref = (this.hitMatrix_anchor && this.hitMatrix_anchor.decomposed) || (this.hitMatrix && this.hitMatrix.decomposed);
  if (camera_ref) {
    let camera_diff = MMD_SA.TEMP_v3.getPositionFromMatrix(this.camera.matrix).sub(camera_ref[0]);
    this.camera.matrix.elements[12] += camera_diff.x * (zoom_scale-1)
    this.camera.matrix.elements[13] += camera_diff.y * (zoom_scale-1)
    this.camera.matrix.elements[14] += camera_diff.z * (zoom_scale-1)
  }

  this.camera.matrix.elements[12] *= 10
  this.camera.matrix.elements[13] *= 10
  this.camera.matrix.elements[14] *= 10

  if (this.hitMatrix_anchor) {
    this.camera.matrix.elements[12] += this.hitMatrix_anchor.game_geo.position.x - this.hitMatrix_anchor.decomposed[0].x*10
    this.camera.matrix.elements[13] += this.hitMatrix_anchor.game_geo.position.y - this.hitMatrix_anchor.decomposed[0].y*10
    this.camera.matrix.elements[14] += this.hitMatrix_anchor.game_geo.position.z - this.hitMatrix_anchor.decomposed[0].z*10
  }

  if (this.user_camera.visible) {
    let cm_decomposed = this.camera.matrix.decompose()
    this.camera.position.copy(cm_decomposed[0])
    this.camera.matrix.makeFromPositionQuaternionScale(cm_decomposed[0], cm_decomposed[1].multiply(MMD_SA.TEMP_q.setFromAxisAngle(MMD_SA.TEMP_v3.set(0,1,0), Math.PI)), cm_decomposed[2])
  }
  else {
    this.camera.position.getPositionFromMatrix(this.camera.matrix)
  }

  this.camera.updateMatrixWorld(true);
}
//else { DEBUG_show(0,0,1) }

window.dispatchEvent(new CustomEvent("SA_AR_onARFrame"));

if (1||!this.use_dummy_webgl) {
// a trick to ensure that no frame is skipped
  RAF_timestamp = null
  Animate_RAF(time)
}
else {
  if (!RAF_timerID)
    RAF_timerID = requestAnimationFrame(Animate_RAF)
}
  }

 ,hit_test: function (frame) {
if (this.hit_found)
  return {}

// https://storage.googleapis.com/chromium-webxr-test/r740830/proposals/phone-ar-hit-test.html
if (xr.xrViewerSpaceHitTestSource) {
  this.hits = frame.getHitTestResults(xr.xrViewerSpaceHitTestSource);
//DEBUG_show(Date.now()+'/'+this.hits.length)
}

if (this.hits.length) {
  let hit = this.hits[0]
  this.hits = []
  this.hitMatrix = this.hitMatrix || {};
  this.hitMatrix.obj = this.hitMatrix.obj || new THREE.Matrix4();
  if (this.can_requestHitTestSource) {
    let transform = hit.getPose(this.frameOfRef).transform;
    this.hitMatrix.obj.fromArray(transform.matrix);
    this.hitMatrix.decomposed = [new THREE.Vector3().copy(transform.position), new THREE.Quaternion().copy(transform.orientation), null];
  }
  else {
    this.hitMatrix.obj.fromArray(hit.hitMatrix);
    this.hitMatrix.decomposed = this.hitMatrix.obj.decompose();
  }
  this.hitMatrix.decomposed[3] = new THREE.Vector3(0,1,0).applyQuaternion(this.hitMatrix.decomposed[1]);

  if (this._update_anchor) {
    this._update_anchor(hit)
    this._update_anchor = null
    return {}
  }

  return { hitMatrix:this.hitMatrix  };
}

if (!this.hits_searching) {
  this.hits_searching = true

  if (xr.can_requestHitTestSource) {
// https://storage.googleapis.com/chromium-webxr-test/r740830/proposals/phone-ar-hit-test.html
    this.session.requestHitTestSource({
      space : this.frameOfRef_viewer,
//      entityTypes : ["plane"],
          //space : xrLocalFloor, // WIP: change back to viewer
          //space : xrOffsetSpace, // WIP: change back to viewer
//      offsetRay : xrray
          //offsetRay : new XRRay(new DOMPointReadOnly(0,.5,-.5), new DOMPointReadOnly(0, -0.5, -1)) // WIP: change back to default
    }).then((hitTestSource) => {
      xr.xrViewerSpaceHitTestSource = hitTestSource;
    }).catch(error => {
//          console.error("Error when requesting hit test source", error);
      xr.hits_searching = false;
    });
  }
  else {
    this.raycaster = this.raycaster || new THREE.Raycaster();
    this.raycaster.setFromCamera({ x:0, y:0 }, _camera);
    const ray = this.raycaster.ray;

    let xrray = new XRRay(new DOMPoint(ray.origin.x, ray.origin.y, ray.origin.z), new DOMPoint(ray.direction.x, ray.direction.y, ray.direction.z));

    this.session.requestHitTest(xrray, this.frameOfRef).then(function (hits) {
      xr.hits = hits;
      xr.hits_searching = false;
    }).catch(function (err) {
      xr.hits_searching = false;
    });
  }
}

return null
  }

 ,user_camera: System._browser.camera

    };

    try {
if (navigator.xr) {
  if (navigator.xr.isSessionSupported && XRSession.prototype.requestHitTestSource) {
    navigator.xr.isSessionSupported('immersive-ar').then(()=>{
      xr.can_AR = true
      xr.can_requestHitTestSource = true
    }).catch((err)=>{});
  }
  else if (XRSession.prototype.requestHitTest) {
    navigator.xr.supportsSession('immersive-ar').then(()=>{
      xr.can_AR = true
      xr.can_requestHitTest = true
    }).catch((err)=>{});
  }
}
    } catch (err) { console.error(err) }

    xr.onSessionEnd = xr.onSessionEnd.bind(xr);
    xr.onARFrame = xr.onARFrame.bind(xr);

    return xr;
  })()

// temp stuff
 ,_readVector_scale: 1
 ,_mouse_pos_3D: []

};


(function () {
// defaults START
  use_full_fps_registered = true

  if (browser_native_mode && !webkit_window)
    SA_fullscreen_stretch_to_cover = true

  if (!MMD_SA_options)
    MMD_SA_options = {}

  MMD_SA_options.custom_default && MMD_SA_options.custom_default()

// save some headaches
  if (is_mobile && !is_SA_child_animation) {
    SA_fullscreen_stretch_to_cover = true
    Settings.CSSTransformFullscreen = true
  }
//  if (is_mobile) MMD_SA_options.texture_resolution_limit = MMD_SA_options.texture_resolution_limit_mobile || 1024;
//MMD_SA_options.texture_resolution_limit=256


// model selection START
  if (!MMD_SA_options.model_path)
    MMD_SA_options.model_path = System.Gadget.path + "\\jThree\\model\\Appearance Miku\\Appearance Miku_BDEF_mod-v04.pmx"
  MMD_SA.use_jThree = /\.pmx$/i.test(MMD_SA_options.model_path)


// use absolute path
  if (!/^((file|https?|\w)\:|\/)/i.test(MMD_SA_options.model_path))
    MMD_SA_options.model_path = System.Gadget.path + "/" + MMD_SA_options.model_path
  MMD_SA_options.model_path_default = MMD_SA_options.model_path = toLocalPath(MMD_SA_options.model_path)

//  if (!MMD_SA_options.model_path)
//    MMD_SA_options.model_path = 'MMD.js/model/m_GUMI/m_GUMI - standard bones.pmd'
  var _model_path = LABEL_LoadSettings("LABEL_MMD_model_path", "")
  if (_model_path) {
    MMD_SA_options.model_path = _model_path
    if (!returnBoolean("MMDOverrideDefaultForExternalModel"))
      System.Gadget.Settings.writeString("LABEL_MMD_model_path", "")
  }

  if (!FSO_OBJ.FileExists(MMD_SA_options.model_path))
    MMD_SA_options.model_path = MMD_SA_options.model_path_default
// END

  if (!MMD_SA_options.model_para)
    MMD_SA_options.model_para = {}

// SA demo default
  if (!MMD_SA_options.model_para["Appearance Miku_BDEF_mod.pmx"]) {
    MMD_SA_options.model_para["Appearance Miku_BDEF_mod.pmx"] = {
      morph_default:{ "瞳小":{weight_scale:0.5} }
    };
  }
  if (!MMD_SA_options.model_para["Appearance Miku_BDEF_mod.pmx"].bone_constraint) {
    MMD_SA_options.model_para["Appearance Miku_BDEF_mod.pmx"].bone_constraint = {
  "左前スカート": { rotation:{ x:[[-20*Math.PI/180,0],[75*2*Math.PI/180]] }}//,y:[[-30*Math.PI/180,0],[30*Math.PI/180,0]],z:[[-30*Math.PI/180,0],[30*Math.PI/180,0]] } }
 ,"右前スカート": { rotation:{ x:[[-20*Math.PI/180,0],[75*2*Math.PI/180]] }}//,y:[[-30*Math.PI/180,0],[30*Math.PI/180,0]],z:[[-30*Math.PI/180,0],[30*Math.PI/180,0]] } }
 ,"左後スカート": { rotation:{ x:[[-75*2*Math.PI/180],[20*Math.PI/180,0]] }}//,y:[[-30*Math.PI/180,0],[30*Math.PI/180,0]],z:[[-30*Math.PI/180,0],[30*Math.PI/180,0]] } }
 ,"右後スカート": { rotation:{ x:[[-75*2*Math.PI/180],[20*Math.PI/180,0]] }}//,y:[[-30*Math.PI/180,0],[30*Math.PI/180,0]],z:[[-30*Math.PI/180,0],[30*Math.PI/180,0]] } }
 ,"左横スカート": { rotation:{ z:[[-20*Math.PI/180,0],[75*2*Math.PI/180]] }}//,y:[[-30*Math.PI/180,0],[30*Math.PI/180,0]],x:[[-30*Math.PI/180,0],[30*Math.PI/180,0]] } }
 ,"右横スカート": { rotation:{ z:[[-75*2*Math.PI/180],[20*Math.PI/180,0]] }}//,y:[[-30*Math.PI/180,0],[30*Math.PI/180,0]],x:[[-30*Math.PI/180,0],[30*Math.PI/180,0]] } }
    };
  }

  if (!MMD_SA_options.model_para["Appearance teto_BDEF_1.6.pmx"])
    MMD_SA_options.model_para["Appearance teto_BDEF_1.6.pmx"] = Object.assign({}, MMD_SA_options.model_para["Appearance Miku_BDEF_mod.pmx"])
  if (!MMD_SA_options.model_para["Appearance Teto_IS_1.0.5.pmx"])
    MMD_SA_options.model_para["Appearance Teto_IS_1.0.5.pmx"] = Object.assign({}, MMD_SA_options.model_para["Appearance Miku_BDEF_mod.pmx"])

  var model_filename = MMD_SA_options.model_path.replace(/^.+[\/\\]/, "")
  var model_filename_cleaned = model_filename.replace(/[\-\_]copy\d+\.pmx$/, ".pmx").replace(/[\-\_]v\d+\.pmx$/, ".pmx")
  MMD_SA_options.model_para_obj = Object.assign({}, MMD_SA_options.model_para[model_filename] || MMD_SA_options.model_para[model_filename_cleaned] || MMD_SA_options.model_para._default_ || {})
  MMD_SA_options.model_para_obj._filename_raw = model_filename
  MMD_SA_options.model_para_obj._filename = model_filename
  MMD_SA_options.model_para_obj._filename_cleaned = model_filename_cleaned

  if (!MMD_SA_options.model_para_obj.skin_default)
    MMD_SA_options.model_para_obj.skin_default = { _is_empty:true }
// save some headaches and make sure that every VMD has morph (at least a dummy) in "Dungeon" mode
  if (!MMD_SA_options.model_para_obj.morph_default) MMD_SA_options.model_para_obj.morph_default = { _is_empty:!MMD_SA_options.Dungeon }

//window.addEventListener("MMDStarted", function () { console.log(MMD_SA_options.model_para_obj.motion_name_default) });
//  MMD_SA_options.model_para_obj.motion_name_default_combat = MMD_SA_options.model_para_obj.motion_name_default

  if (!MMD_SA_options.motion)
    MMD_SA_options.motion = [{path:System.Gadget.path + '/MMD.js/motion/stand.vmd'}]
  if (!MMD_SA_options.motion_para)
    MMD_SA_options.motion_para = {}

  if (!MMD_SA_options.motion_para["_cover_undies_blush"]) {
    MMD_SA_options.motion_para["_cover_undies_blush"] = { adjustment_per_model: {} }
  }
  if (!MMD_SA_options.motion_para["_cover_undies_blush"].adjustment_per_model._default_) {
    MMD_SA_options.motion_para["_cover_undies_blush"].adjustment_per_model._default_ = {
  skin_default: {
    "左腕": { rot_add: {x:-5, y:0, z:0} }
   ,"右腕": { rot_add: {x:-5, y:0, z:0} }
  }
    };
  }

//MMD_SA_options.motion = [{path:System.Gadget.path + '/MMD.js/motion/stand.vmd'}]
//MMD_SA_options.motion.motion_shuffle_pool_size = MMD_SA_options.motion_shuffle = null

  MMD_SA_options.motion.forEach(function (motion) {
    motion.path = toLocalPath(motion.path)
  });

  if (!MMD_SA_options.x_object)
    MMD_SA_options.x_object = []
  if (!MMD_SA_options.custom_action)
    MMD_SA_options.custom_action = ["kissing"]
  if (!MMD_SA_options.AR_camera_mod)
    MMD_SA_options.AR_camera_mod = 1.2
  if (!MMD_SA_options.light_mod)
    MMD_SA_options.light_mod = 1
  if (MMD_SA_options.auto_blink == null)
    MMD_SA_options.auto_blink = true

  if (!MMD_SA_options.camera_position)
    MMD_SA_options.camera_position = [0,10,30]
  if (!MMD_SA_options.camera_rotation)
    MMD_SA_options.camera_rotation = [0,0,0]
//MMD_SA_options.use_random_camera=true
  if (MMD_SA_options.use_random_camera) {
    if (!MMD_SA_options.random_camera)
      MMD_SA_options.random_camera = {}
    if (!MMD_SA_options.random_camera.distance)
      MMD_SA_options.random_camera.distance = [1,1.5]
    if (!MMD_SA_options.random_camera.rotation)
      MMD_SA_options.random_camera.rotation = {}
    if (!MMD_SA_options.random_camera.rotation.x)
      MMD_SA_options.random_camera.rotation.x = [-15,15]
    if (!MMD_SA_options.random_camera.rotation.y)
      MMD_SA_options.random_camera.rotation.y = [-40,40]
    if (!MMD_SA_options.random_camera.rotation.z)
      MMD_SA_options.random_camera.rotation.z = [0,0]
  }

  var _trackball_camera_limit_adjust = function () {}
  if (MMD_SA_options.trackball_camera_limit) {
    if (MMD_SA_options.trackball_camera_limit.adjust)
      _trackball_camera_limit_adjust = MMD_SA_options.trackball_camera_limit.adjust
  }
  else
    MMD_SA_options.trackball_camera_limit = {}

  if (!MMD_SA_options.MMD_disabled) {
    if (!MMD_SA_options.trackball_camera_limit.min)
      MMD_SA_options.trackball_camera_limit.min = {}
    if (!MMD_SA_options.trackball_camera_limit.min.length) {
      window.addEventListener("MMDStarted", function () {
var bb = THREE.MMD.getModels()[0].mesh.geometry.boundingBox
MMD_SA_options.trackball_camera_limit.min.length = (bb.max.y - bb.min.y) + 2
      });
      Object.defineProperty(MMD_SA_options.trackball_camera_limit.min, "length", (function () {
var length = 25;
return {
  get: function () { return Math.max(10, length-10); }
 ,set: function (v) { length = v; }
};
      })());
    }

    MMD_SA_options.trackball_camera_limit.adjust = function (eye) {
var result = { return_value:null }
window.dispatchEvent(new CustomEvent("SA_MMD_trackball_camera_limit_adjust", { detail:{ eye:eye, result:result } }));
if (result.return_value != null)
  return result.return_value

return _trackball_camera_limit_adjust(eye)
    }
  }

  if (MMD_SA_options.GOML_import)
    MMD_SA.GOML_import += MMD_SA_options.GOML_import
  if (MMD_SA_options.GOML_head)
    MMD_SA.GOML_head   += MMD_SA_options.GOML_head
  if (MMD_SA_options.GOML_scene)
    MMD_SA.GOML_scene  += MMD_SA_options.GOML_scene

  if (MMD_SA_options.reset_rigid_body_physics_step == null)
    MMD_SA_options.reset_rigid_body_physics_step = 10

  if (MMD_SA_options.SeriousShader_OverBright_adjust == null)
    MMD_SA_options.SeriousShader_OverBright_adjust = 0

  MMD_SA_options._MME_ = MMD_SA_options.MME || {}
  MMD_SA_options._MME  = Object.clone(MMD_SA_options._MME_)
  Object.defineProperty(MMD_SA_options, "MME",
{
  get: function () {
return this.model_para_obj.MME || this._MME
  }
});
  MMD_SA_options.model_para_obj.MME = MMD_SA_options.MME
  MMD_SA_options.model_para_obj.MME.PostProcessingEffects = MMD_SA_options.model_para_obj.MME.PostProcessingEffects || MMD_SA_options._MME.PostProcessingEffects

  try {
    var _file = FSO_OBJ.OpenTextFile(System.Gadget.path + '\\TEMP\\MMD_MME_by_model.json', 1);
    var _json = _file.ReadAll()
    _file.Close()
    MMD_SA_options.MME_saved = JSON.parse(_json)
  }
  catch (err) {
//setTimeout(function () {DEBUG_show(err,0,1)}, 2000)
    MMD_SA_options.MME_saved = {}
  }

  MMD_SA.MME_init()
  MMD_SA_options.MME._toFloat = function toFloat(v) {
    if (v.constructor === Array) {
      for (var i = 0, i_max = v.length; i < i_max; i++) {
        var _v = v[i]
        v[i] = (_v == parseInt(_v)) ? _v + ".0" : _v
      }
      return v
    }
    else {
      return (v == parseInt(v)) ? v + ".0" : v
    }
  };


// extra models START
  MMD_SA_options.model_para_obj_all = [MMD_SA_options.model_para_obj]

  if (!MMD_SA_options.model_path_extra)
    MMD_SA_options.model_path_extra = []

  for (var i = 0, i_max = MMD_SA_options.model_path_extra.length; i < i_max; i++) {
    var path = MMD_SA_options.model_path_extra[i] = toLocalPath(MMD_SA_options.model_path_extra[i])

    var model_filename_raw = path.replace(/^.+[\/\\]/, "")
    var model_filename = model_filename_raw
    var clone_index = -1
    if (/\#clone(\d+)\.pmx$/.test(model_filename)) {
      clone_index = parseInt(RegExp.$1)
      model_filename = model_filename.replace(/\#clone(\d+)\.pmx$/, ".pmx")
    }
    var model_filename_cleaned = model_filename.replace(/[\-\_]copy\d+\.pmx$/, ".pmx").replace(/[\-\_]v\d+\.pmx$/, ".pmx")
    var model_para_obj = Object.assign({}, MMD_SA_options.model_para[model_filename_raw] || MMD_SA_options.model_para[model_filename] || MMD_SA_options.model_para[model_filename_cleaned] || {})
    model_para_obj._filename_raw = model_filename_raw
    model_para_obj._filename = model_filename
    model_para_obj._filename_cleaned = model_filename_cleaned

    if (!model_para_obj.skin_default)
      model_para_obj.skin_default = { _is_empty:true }
// save some headaches and make sure that every VMD has morph (at least a dummy) in "Dungeon" mode
  if (!model_para_obj.morph_default) model_para_obj.morph_default = { _is_empty:!MMD_SA_options.Dungeon }

    if (!model_para_obj.MME)
      model_para_obj.MME = {}
    var MME_saved = MMD_SA_options.MME_saved[model_filename] || MMD_SA_options.MME_saved[model_filename_cleaned]
    if (MME_saved) {
      model_para_obj.MME.self_overlay = Object.clone(MME_saved.self_overlay)
      model_para_obj.MME.HDR = Object.clone(MME_saved.HDR)
      model_para_obj.MME.serious_shader = Object.clone(MME_saved.serious_shader)
    }
    else {
      model_para_obj.MME.self_overlay = model_para_obj.MME.self_overlay || { enabled:false }
      model_para_obj.MME.HDR = model_para_obj.MME.HDR || { enabled:false }
      model_para_obj.MME.serious_shader = model_para_obj.MME.serious_shader || { enabled:false }
    }

    MMD_SA_options.model_para_obj_all.push(model_para_obj)
  }

  if (MMD_SA_options.mirror_motion_from_first_model == null)
    MMD_SA_options.mirror_motion_from_first_model = 99

  if (!MMD_SA_options.multi_model_position_offset) {
    var _multi_model_position_offset = [
  [{x:  0, y:0, z:0}]
 ,[{x: -7, y:0, z:0}, {x:  7, y:0, z:0}]
 ,[{x:  0, y:0, z:0}, {x:-12, y:0, z:0}, {x: 12, y:0, z:0}]
 ,[{x:-12, y:0, z:0}, {x: 12, y:0, z:0}, {x: -6, y:0, z:6}, {x:  6, y:0, z:12}]
 ,[{x:  0, y:0, z:0}, {x:-12, y:0, z:0}, {x: 12, y:0, z:0}, {x: -6, y:0, z:12}, {x:  6, y:0, z:12}]
    ]

    var model_object = 0
    MMD_SA_options.multi_model_position_offset = []
    MMD_SA_options.model_para_obj_all.forEach(function (obj, idx) {
      if (obj.is_object)
        model_object += 1

      if (idx == 0)
        return

      MMD_SA_options.multi_model_position_offset.push([])
      if (idx < MMD_SA_options.model_para_obj_all.length-1)
        return

      var offset_index = idx - model_object
      if (offset_index < 0)
        offset_index = 0
      else if (offset_index > _multi_model_position_offset.length-1)
        offset_index = _multi_model_position_offset.length-1

      var _idx = 0
      var pos_offset = MMD_SA_options.multi_model_position_offset[MMD_SA_options.multi_model_position_offset.length-1]
      MMD_SA_options.model_para_obj_all.forEach(function (obj) {
        pos_offset.push((obj.is_object) ? {x:0, y:0, z:0} : (_multi_model_position_offset[offset_index][_idx++] || {x:0, y:0, z:0}))
      });
    });
  }
//console.log(MMD_SA_options.multi_model_position_offset)
//MMD_SA_options.multi_model_position_offset = []

  MMD_SA_options.model_para_obj_by_filename = {}
  var model_count = MMD_SA_options.model_para_obj_all.length
  MMD_SA_options.model_para_obj_all.forEach(function (obj, idx) {
    obj._model_index = idx
    MMD_SA_options.model_para_obj_by_filename[obj._filename_raw] = obj

    if (obj.is_object) {
      obj.mirror_motion_from_first_model = false
      if (!obj.morphTargets_length_fixed && (!obj.morph_default || obj.morph_default._is_empty || !Object.keys(obj.morph_default).length))
        obj.morphTargets_length_fixed = 0
    }

    obj._mirror_motion_from_first_model = obj.mirror_motion_from_first_model
    Object.defineProperty(obj, "mirror_motion_from_first_model", {
  get: function () {
return (this._mirror_motion_from_first_model !== false) && (this._mirror_motion_from_first_model || (MMD_SA_options.mirror_motion_from_first_model >= this._model_index))
  }
 ,set: function (v) {
this._mirror_motion_from_first_model = v
  }
    });

    if (model_count == 1)
      return
    var pos_offset = MMD_SA_options.multi_model_position_offset[model_count-2]
    if (!pos_offset)
      return

    obj.skin_default._is_empty = false
    var pos_para = obj.skin_default["全ての親"]
    if (!pos_para)
      pos_para = obj.skin_default["全ての親"] = {}
    pos_para.pos_add_absolute = {x:pos_offset[idx].x, y:pos_offset[idx].y, z:pos_offset[idx].z}
  });
// END

// save headaches for morph target stuff once and for all
  if (!MMD_SA_options.morphTargets_length_fixed)
    MMD_SA_options.morphTargets_length_fixed = 30

  if (MMD_SA_options.physics_maxSubSteps == null)
    MMD_SA_options.physics_maxSubSteps = (MMD_SA_options.model_para_obj_all.length < 3) ? 3 : 2

  MMD_SA_options.MME._EV_usage_PROCESS = function (u, decay_factor) {
if (use_full_fps)
  decay_factor *= 2 / EV_sync_update.count_to_10fps_

// decay control
if (Settings.ReverseAnimation) {
  if (u - decay_factor > this._u_last)
    u = this._u_last + decay_factor
}
else {
  if (u + decay_factor < this._u_last)
    u = this._u_last - decay_factor
}
this._u_last = u

return u
  }

  var PPE = MMD_SA_options.MME.PostProcessingEffects = MMD_SA_options.MME.PostProcessingEffects || { enabled:false }
  PPE.enabled = !!(PPE.enabled || returnBoolean("Use3DPPE"))

  PPE.effects_by_name = {}
  if (!PPE.shuffle_group)
    PPE.shuffle_group = {}
  if (!PPE.effects)
    PPE.effects = []
  if (!PPE.SeriousShader_OverBright_adjust)
    PPE.SeriousShader_OverBright_adjust = MMD_SA_options.SeriousShader_OverBright_adjust || 0.05

  if (!PPE.effects.some(function (e) { return e.name=="SAOShader" })) {
    var _enabled = !!(PPE.use_SAO || returnBoolean("Use3DSAO"))
    PPE.effects.unshift(
  { name:"SAOShader", enabled:_enabled }
, { name:"DepthLimitedBlurShaderV", enabled:_enabled }
, { name:"DepthLimitedBlurShaderH", enabled:_enabled }
    );

    if (_enabled)
      MMD_SA_options.SeriousShader_OverBright_adjust = PPE.SeriousShader_OverBright_adjust
  }

  if (!PPE.effects.some(function (e) { return e.name=="DiffusionX" })) {
    var _enabled = (PPE.use_Diffusion || returnBoolean("Use3DDiffusion")) ? [1,1,0] : [0,0,((PPE.effects.some(function (e) { return e.name=="BloomPass" }))?0:1)]
    PPE.effects.push(
  { name:"DiffusionX", enabled:_enabled[0] }
 ,{ name:"DiffusionY", enabled:_enabled[1] }
 ,{ name:"CopyShader", enabled:_enabled[2] }
    );
  }

  if (!PPE.effects.some(function (e) { return e.name=="BloomPostProcess" })) {
    var _enabled = !!(PPE.use_BloomPostProcess || returnBoolean("Use3DBloomPostProcess"))
    var difusionX_index = PPE.effects.findIndex(function (e) { return e.name=="DiffusionX" })
    PPE.effects = PPE.effects.slice(0, difusionX_index).concat({ name:"BloomPostProcess", enabled:_enabled, blur_size:parseFloat(System.Gadget.Settings.readString("Use3DBloomPostProcessBlurSize")||0.5), threshold:parseFloat(System.Gadget.Settings.readString("Use3DBloomPostProcessThreshold")||0.5), intensity:parseFloat(System.Gadget.Settings.readString("Use3DBloomPostProcessIntensity")||0.5) }, PPE.effects.slice(difusionX_index))
  }

  PPE.effects.forEach(function (effect) {
    effect.enabled = !!effect.enabled || (effect.enabled == null)

    // temp dummy
    effect.obj = effect

    PPE.effects_by_name[effect.name] = effect
    effect._EV_usage_PROCESS = MMD_SA_options.MME._EV_usage_PROCESS
    if (effect.shuffle_group_id != null) {
      var sg = PPE.shuffle_group[effect.shuffle_group_id]
      if (!sg)
        sg = PPE.shuffle_group[effect.shuffle_group_id] = {}
      if (!sg.effects)
        sg.effects = []
      sg.effects.push(effect)
    }
  });

  Object.defineProperty(PPE, "use_SAO", {
  get: function () {
return this.effects_by_name["SAOShader"].obj.enabled
  }

 ,set: function (v) {
if (!this._initialized)
  return

var SAO = []
SAO[0] = this._effects["SAOShader"]
if (!SAO[0])
  return

SAO[1] = this._effects["DepthLimitedBlurShaderV"]
SAO[2] = this._effects["DepthLimitedBlurShaderH"]

SAO.forEach(function (e) {
  if (e) {
    e.enabled = v
  }
});

MMD_SA.MME_composer_disabled_check(this._composers_list[SAO[0]._composer_index])

MMD_SA_options.SeriousShader_OverBright_adjust = (v) ? this.SeriousShader_OverBright_adjust : 0

MMD_SA.MME_set_renderToScreen()
  }
  });

  Object.defineProperty(PPE, "use_BloomPostProcess", {
  get: function () {
return this.effects_by_name["BloomPostProcess"].obj.enabled
  }

 ,set: function (v) {
if (!this._initialized)
  return

if (!MMD_SA.use_webgl2)
  return

var BloomPostProcess = this._effects["BloomPostProcess"]
if (!BloomPostProcess)
  return

BloomPostProcess.enabled = v

MMD_SA.MME_composer_disabled_check(this._composers_list[BloomPostProcess._composer_index])

MMD_SA.MME_set_renderToScreen()
  }
  });

  Object.defineProperty(PPE, "use_Diffusion", {
  get: function () {
return this.effects_by_name["DiffusionX"].obj.enabled
  }

 ,set: function (v) {
if (!this._initialized)
  return

var Diffusion = []
Diffusion[0] = this._effects["DiffusionX"]
if (!Diffusion[0])
  return

Diffusion[1] = this._effects["DiffusionY"]
Diffusion[2] = ((Diffusion[1]._index+1 < this.effects.length) && (this.effects[Diffusion[1]._index+1].name == "CopyShader")) ? this.effects[Diffusion[1]._index+1].obj : {}

var _enabled = (v) ? [1,1,0] : [0,0,1]

Diffusion.forEach(function (e, i) {
  e.enabled = _enabled[i]
});

MMD_SA.MME_composer_disabled_check(this._composers_list[Diffusion[0]._composer_index])

MMD_SA.MME_set_renderToScreen()
  }
  });

  MMD_SA_options._light_color = MMD_SA_options.light_color || '#606060'
  Object.defineProperty(MMD_SA_options, "light_color",
{
  get: function () {
return System.Gadget.Settings.readString("MMDLightColor") || MMD_SA_options.model_para_obj.light_color || MMD_SA_options._light_color
  }
});

  if (!MMD_SA_options.light_position_scale)
    MMD_SA_options.light_position_scale = 40

  if (!MMD_SA_options.shadow_para)
    MMD_SA_options.shadow_para = {}
  if (!MMD_SA_options.shadow_para.shadowBias)
    MMD_SA_options.shadow_para.shadowBias = -0.0025*1
//  if (!MMD_SA_options.shadow_para.shadowDarkness)
//    MMD_SA_options.shadow_para.shadowDarkness = 0.7;
  if (!MMD_SA_options.shadow_para.shadowMapWidth)
    MMD_SA_options.shadow_para.shadowMapWidth = 1024*2;
  if (!MMD_SA_options.shadow_para.shadowMapHeight)
    MMD_SA_options.shadow_para.shadowMapHeight = 1024*2;
  if (!MMD_SA_options.shadow_para.shadowCameraNear)
    MMD_SA_options.shadow_para.shadowCameraNear = 1;
  if (!MMD_SA_options.shadow_para.shadowCameraFar)
    MMD_SA_options.shadow_para.shadowCameraFar = MMD_SA_options.light_position_scale * 2;
  if (!MMD_SA_options.shadow_para.shadowCameraLeft)
    MMD_SA_options.shadow_para.shadowCameraLeft = -20*1;
  if (!MMD_SA_options.shadow_para.shadowCameraRight)
    MMD_SA_options.shadow_para.shadowCameraRight = 20*1;
  if (!MMD_SA_options.shadow_para.shadowCameraBottom)
    MMD_SA_options.shadow_para.shadowCameraBottom = -20*1;
  if (!MMD_SA_options.shadow_para.shadowCameraTop)
    MMD_SA_options.shadow_para.shadowCameraTop = 20*1;

  if (!MMD_SA_options.shadow_para.use_cascaded_shadow_map)
    MMD_SA_options.shadow_para.use_cascaded_shadow_map = false//!!MMD_SA_options.Dungeon
  if (!MMD_SA_options.shadow_para.shadowCascadeCount)
    MMD_SA_options.shadow_para.shadowCascadeCount = 2//3
  if (!MMD_SA_options.shadow_para.shadowCascadeBias)
    MMD_SA_options.shadow_para.shadowCascadeBias = [MMD_SA_options.shadow_para.shadowBias, MMD_SA_options.shadow_para.shadowBias, MMD_SA_options.shadow_para.shadowBias];
  if (!MMD_SA_options.shadow_para.shadowCascadeWidth)
    MMD_SA_options.shadow_para.shadowCascadeWidth = [MMD_SA_options.shadow_para.shadowMapWidth, MMD_SA_options.shadow_para.shadowMapWidth, MMD_SA_options.shadow_para.shadowMapWidth];
  if (!MMD_SA_options.shadow_para.shadowCascadeHeight)
    MMD_SA_options.shadow_para.shadowCascadeHeight = [MMD_SA_options.shadow_para.shadowMapHeight, MMD_SA_options.shadow_para.shadowMapHeight, MMD_SA_options.shadow_para.shadowMapHeight];
  if (!MMD_SA_options.shadow_para.shadowCascadeNearZ)
    MMD_SA_options.shadow_para.shadowCascadeNearZ = (MMD_SA_options.shadow_para.shadowCascadeCount == 2) ? [-0.9999, 0.9985] : [-0.9999, 0.9970, 0.9990]
  if (!MMD_SA_options.shadow_para.shadowCascadeFarZ)
    MMD_SA_options.shadow_para.shadowCascadeFarZ =  (MMD_SA_options.shadow_para.shadowCascadeCount == 2) ? [ 0.9985, 0.9999] : [ 0.9970, 0.9990, 0.9999]

  if (!MMD_SA_options.shadow_para.shadowBias_range)
    MMD_SA_options.shadow_para.shadowBias_range = (MMD_SA_options.Dungeon_options) ? [0.1, 100] : [0.1, 2]//[1,1] : [1,1]//[0.1,0.1] : [0.1,0.1]//

  if (!MMD_SA_options.ripple_max)
    MMD_SA_options.ripple_max = 20
  if (!MMD_SA_options.ripple_range)
    MMD_SA_options.ripple_range = 128
  MMD_SA_options.ripple_range = parseInt(MMD_SA_options.ripple_range)

  MMD_SA_options._light_position = MMD_SA_options.light_position || [1,1,1]
  Object.defineProperty(MMD_SA_options, "light_position",
{
  get: function () {
var light_pos = JSON.parse(System.Gadget.Settings.readString("MMDLightPosition") || "null") || MMD_SA_options.model_para_obj.light_position || MMD_SA_options._light_position
light_pos = light_pos.slice()
for (var i = 0; i < 3; i++)
  light_pos[i] *= MMD_SA_options.light_position_scale

return light_pos
  }
 ,set: function (pos) { this._light_position = pos; }
});


  if (MMD_SA_options.look_at_screen_bone_list) {
    MMD_SA_options._look_at_screen_bone_list = [MMD_SA_options.look_at_screen_bone_list, MMD_SA_options.look_at_screen_bone_list]
  }
  else {
    MMD_SA_options._look_at_screen_bone_list = [
  [
  { name:"首", weight_screen:0.5, weight_motion:0.5 }
 ,{ name:"頭", weight_screen:0.5, weight_motion:0.5 }
  ]

 ,[
  { name:"首", weight_screen:0.25, weight_motion:0.5 }
 ,{ name:"頭", weight_screen:0.25, weight_motion:0.5 }
 ,{ name:"両目", weight_screen:0.15, weight_motion:0.5 }
  ]
    ]
// ,{ name:"両目", weight_screen:0.15, weight_motion:1 }

//    MMD_SA_options._look_at_screen_bone_list = [
//  { name:"上半身2", weight_screen:0.5, weight_motion:0.5 }
// ,{ name:"上半身",  weight_screen:0.5, weight_motion:0.5 }
//    ]

  }
  Object.defineProperty(MMD_SA_options, "look_at_screen_bone_list",
{
  get: function () {
var mm = MMD_SA.MMD.motionManager
var para_SA = mm.para_SA

// cache the return value for better performance in case of getter functions
var v

var range = (para_SA.range && para_SA.range[mm.range_index])
if (range)
  v = range.look_at_screen_bone_list
if (v == null) {
  v = para_SA.look_at_screen_bone_list
  if (v == null)
    v = this._look_at_screen_bone_list
}

if (v[0] instanceof Array) {
  v = v[(MMD_SA_options.look_at_mouse)?1:0]
}

return v;
  }

 ,set: function (list) {
this._look_at_screen_bone_list = list;
  }
});

  if (MMD_SA_options.look_at_screen_parent_rotation)
    MMD_SA_options._look_at_screen_parent_rotation = MMD_SA_options.look_at_screen_parent_rotation
  Object.defineProperty(MMD_SA_options, "look_at_screen_parent_rotation",
{
  get: function () {
var mm = MMD_SA.MMD.motionManager
var para_SA = mm.para_SA

// cache the return value for better performance in case of getter functions
var v

var range = (para_SA.range && para_SA.range[mm.range_index])
if (range)
  v = range.look_at_screen_parent_rotation
if (v == null) {
  v = para_SA.look_at_screen_parent_rotation
  if (v == null)
    v = this._look_at_screen_parent_rotation
}

// clone it to avoid unexpected modification
return v && v.clone();
  }

 ,set: function (v) {
this._look_at_screen_parent_rotation = v;
  }
});

  if (MMD_SA_options.look_at_screen == null)
    MMD_SA_options.look_at_screen = returnBoolean("MMDLookAtCamera")

  if (MMD_SA_options.look_at_mouse == null)
    MMD_SA_options.look_at_mouse = returnBoolean("MMDLookAtMouse")
  if (MMD_SA_options.WebXR || is_mobile || (!webkit_electron_mode && !WallpaperEngine_CEF_mode))
    MMD_SA_options.look_at_mouse = false

  MMD_SA_options._look_at_screen = MMD_SA_options.look_at_screen;
  MMD_SA_options.look_at_screen_by_model = function (model) {
var music_mode = MMD_SA.music_mode && (this.look_at_screen_music_mode != true)

var mm = (model && (model._model_index > 0)) ? MMD_SA.motion[THREE.MMD.getModels()[model._model_index].skin._motion_index] : MMD_SA.MMD.motionManager
var para_SA = mm.para_SA

// cache the return value for better performance in case of getter functions
var v

var range = (para_SA.range && para_SA.range[mm.range_index])
if (range)
  v = range.look_at_screen
if (v == null) {
  v = para_SA.look_at_screen
  if (v == null) {
    if (music_mode)
      return false
    v = (model && (model._model_index > 0)) || this._look_at_screen
  }
}

return v && (this.look_at_screen_ratio > 0);
  };
  Object.defineProperty(MMD_SA_options, "look_at_screen",
{
  get: MMD_SA_options.look_at_screen_by_model

 ,set: function (v) {
this._look_at_screen = v
  }
});

  MMD_SA_options._look_at_mouse = MMD_SA_options.look_at_mouse;
  Object.defineProperty(MMD_SA_options, "look_at_mouse",
{
  get: function () {
var music_mode = MMD_SA.music_mode && (this.look_at_screen_music_mode != true)

var mm = MMD_SA.MMD.motionManager
var para_SA = mm.para_SA

if (!this.look_at_screen)
  return false

// cache the return value for better performance in case of getter functions
var v

var range = (para_SA.range && para_SA.range[mm.range_index])
if (range)
  v = range.look_at_mouse
if (v == null) {
  v = para_SA.look_at_mouse
  if (v == null) {
    if (music_mode)
      return false
    v = this._look_at_mouse
  }
}

return v;
  }

 ,set: function (v) {
this._look_at_mouse = v
  }
});

  if (MMD_SA_options.look_at_screen_ratio == null)
    MMD_SA_options.look_at_screen_ratio = 1

  MMD_SA_options._look_at_screen_ratio = MMD_SA_options.look_at_screen_ratio;
  Object.defineProperty(MMD_SA_options, "look_at_screen_ratio",
{
  get: function () {
var mm = MMD_SA.MMD.motionManager
var para_SA = mm.para_SA

// cache the return value for better performance in case of getter functions
var v

var range = (para_SA.range && para_SA.range[mm.range_index])
if (range)
  v = range.look_at_screen_ratio
if (v == null) {
  v = para_SA.look_at_screen_ratio
  if (v == null)
    v = this._look_at_screen_ratio
}

return v;
  }

 ,set: function (v) {
this._look_at_screen_ratio = v
  }
});


  if (MMD_SA_options.WebXR) {
    window.addEventListener("jThree_ready", function () {
MMD_SA_options.model_para_obj_all.forEach(function (model_para_obj) {
  model_para_obj.use_default_boundingBox = true
});
    });
    window.addEventListener("MMDStarted", function () {
THREE.MMD.getModels().forEach(function (model) {
  model.mesh.frustumCulled = false
});
    });
  }


  MMD_SA_options.x_object_by_name = {}

  if (!MMD_SA_options.mesh_obj)
    MMD_SA_options.mesh_obj = []
  MMD_SA_options.mesh_obj_by_id = {}

  if (!MMD_SA_options.MMD_disabled) {
    for (var i = 0, i_max = MMD_SA_options.model_para_obj_all.length; i < i_max; i++) {
      MMD_SA_options.mesh_obj.push({ id:"mikuPmx"+i })
    }
  }

// Circular spectrum
  if (MMD_SA_options.use_CircularSpectrum) {
    var _r = MMD_SA_options.CircularSpectrum_radius || 10
    var _divider = 128
    var _cube_size = _r * 2 * Math.PI / (_divider * 2)

    MMD_SA.GOML_head +=
  '<geo id="CircularSpectrumGEO" type="Cube" param="' + [_cube_size,_cube_size,_cube_size].join(" ") + '" />\n'
+ '<mtl id="CircularSpectrumMTL" type="MeshBasic" param="color:' + (MMD_SA_options.CircularSpectrum_color || '#0f0') + ';" />\n';

    MMD_SA.GOML_scene +=
  '<obj id="CircularSpectrumMESH" style="position:' + (MMD_SA_options.CircularSpectrum_position || [0,10,0]).join(" ") + '; scale:0;">\n';

    for (var i = 0; i < _divider; i++) {
      var _a = (i / _divider) * Math.PI * 2
      MMD_SA.GOML_scene +=
  '<mesh id="CircularSpectrum' + i + 'MESH" geo="#CircularSpectrumGEO" mtl="#CircularSpectrumMTL" style="position:' + [_r*Math.sin(_a),_r*Math.cos(_a),0].join(" ") + '; rotate:' + [0,0,-_a].join(" ") + ';" />\n'
    }

    MMD_SA.GOML_scene +=
  '</obj>\n';

    MMD_SA_options.mesh_obj.push({ id:"CircularSpectrumMESH", scale:0 })
  }

// Kiss
  if (MMD_SA_options.allows_kissing) {
    MMD_SA.GOML_head +=
  '<geo id="KissGEO" type="Plane" param="1 1" />\n'
+ '<txr id="KissTXR" src="' + (toFileProtocol(System.Gadget.path + '/images/kiss_mark_red_o66.png')) + '" />\n'
+ '<mtl id="KissMTL" type="MeshBasic" param="map:#KissTXR;" />\n';

    MMD_SA.GOML_scene +=
  '<mesh id="KissMESH" geo="#KissGEO" mtl="#KissMTL" style="position:0 0 0; scale:0;" />\n';

    MMD_SA_options.mesh_obj.push({ id:"KissMESH" })
  }

// X-ray START
  if (MMD_SA_options._use_xray) {
    if (!MMD_SA_options._xray_opacity)
      MMD_SA_options._xray_opacity = 0

    if (!MMD_SA_options._xray_radius)
      MMD_SA_options._xray_radius = 3
    var _r = MMD_SA_options._xray_radius

    MMD_SA.GOML_head +=
  '<geo id="XrayGEO" type="Cube" param="' + [_r*2, _r*2/100, _r*2/100].join(" ") + '" />\n'
+ '<mtl id="XrayMTL" type="MeshBasic" param="color:#000;" />\n';

    MMD_SA.GOML_scene +=
  '<obj id="XrayMESH" style="position:0 0 0; scale:0;">\n'

+ '<mesh geo="#XrayGEO" mtl="#XrayMTL" style="position:' + [ 0, _r, _r].join(" ") + ';" />\n'
+ '<mesh geo="#XrayGEO" mtl="#XrayMTL" style="position:' + [ 0,-_r, _r].join(" ") + ';" />\n'
+ '<mesh geo="#XrayGEO" mtl="#XrayMTL" style="position:' + [ 0, _r,-_r].join(" ") + ';" />\n'
+ '<mesh geo="#XrayGEO" mtl="#XrayMTL" style="position:' + [ 0,-_r,-_r].join(" ") + ';" />\n'

+ '<mesh geo="#XrayGEO" mtl="#XrayMTL" style="position:' + [ _r, _r, 0].join(" ") + '; rotateY:' + (Math.PI/2) + ';" />\n'
+ '<mesh geo="#XrayGEO" mtl="#XrayMTL" style="position:' + [-_r, _r, 0].join(" ") + '; rotateY:' + (Math.PI/2) + ';" />\n'
+ '<mesh geo="#XrayGEO" mtl="#XrayMTL" style="position:' + [ _r,-_r, 0].join(" ") + '; rotateY:' + (Math.PI/2) + ';" />\n'
+ '<mesh geo="#XrayGEO" mtl="#XrayMTL" style="position:' + [-_r,-_r, 0].join(" ") + '; rotateY:' + (Math.PI/2) + ';" />\n'

+ '<mesh geo="#XrayGEO" mtl="#XrayMTL" style="position:' + [ _r, 0, _r].join(" ") + '; rotateZ:' + (Math.PI/2) + ';" />\n'
+ '<mesh geo="#XrayGEO" mtl="#XrayMTL" style="position:' + [-_r, 0, _r].join(" ") + '; rotateZ:' + (Math.PI/2) + ';" />\n'
+ '<mesh geo="#XrayGEO" mtl="#XrayMTL" style="position:' + [ _r, 0,-_r].join(" ") + '; rotateZ:' + (Math.PI/2) + ';" />\n'
+ '<mesh geo="#XrayGEO" mtl="#XrayMTL" style="position:' + [-_r, 0,-_r].join(" ") + '; rotateZ:' + (Math.PI/2) + ';" />\n'

+ '</obj>\n';

    MMD_SA_options.mesh_obj.push({ id:"XrayMESH" })
  }
// X-ray END

// Mirrors
  if (MMD_SA_options.mirror_obj) {
    MMD_SA_options.mirror_obj.forEach(function (para, idx) {
if (para.created)
  return
var obj = MMD_SA.createMirror(para)
MMD_SA.GOML_head  += obj.geo + obj.mtl
MMD_SA.GOML_scene += obj.mesh
MMD_SA_options.mesh_obj.push({ id:"Mirror" + idx + "MESH", use_child_animation_texture:/^\#ChildAnimation/.test(para.baseTexture), scale:(para.scale||1), hidden_on_start:para.hidden })
    });
  }

// child animation as texture
  if (!is_SA_child_animation && MMD_SA_options.child_animation_as_texture) {
    if (!MMD_SA_options.child_animation_width)
      MMD_SA_options.child_animation_width = 512
    if (!MMD_SA_options.child_animation_height)
      MMD_SA_options.child_animation_height = 512
    if (!MMD_SA_options.child_animation_opacity)
      MMD_SA_options.child_animation_opacity = 1

    for (var i = 0; i < MMD_SA_options.child_animation_as_texture; i++) {
var c_id = 'j3_childAnimationCanvas' + i

MMD_SA.GOML_import +=
  '<canvas id="' + c_id + '"></canvas>\n'

MMD_SA.GOML_head +=
  '<txr id="ChildAnimation' + i + 'TXR" canvas="#' + c_id + '" animation="false" />\n'
    }
  }

  var AR_para = MMD_SA_options.AR_para = (MMD_SA_options.AR_para || {})
  if (MMD_SA_options.use_JSARToolKit) {
    if (!AR_para.marker_width)
      AR_para.marker_width = 10
    if (AR_para.marker_base_id == null)
      AR_para.marker_base_id = 64
    if (!AR_para.video_width)
      AR_para.video_width  = 640
    if (!AR_para.video_height)
      AR_para.video_height = 480
    if (!AR_para.marker_base_id_spare_list)
      AR_para.marker_base_id_spare_list = []
  }

  if (!MMD_SA_options.width)
    MMD_SA_options.width  = AR_para.video_width  || 512
  if (!MMD_SA_options.height)
    MMD_SA_options.height = AR_para.video_height || 512

  if (MMD_SA_options.use_speech_bubble)
    MMD_SA.SpeechBubble.init()

// save some headaches for physics glitches on start
  window.addEventListener("MMDStarted", function () {
     THREE.MMD.getModels().forEach(function (m) {
if (!m.physi) return;

let delay_ini = MMD_SA_options.reset_rigid_body_physics_step + ((MMD_SA_options.Dungeon) ? 90 : 30);
m.mesh._reset_rigid_body_physics_ = delay_ini;
/*
System._browser.on_animation_update.add(function () {
  m.mesh._reset_rigid_body_physics_ = MMD_SA_options.reset_rigid_body_physics_step;
}, delay_ini+30, 0);
*/
//m.physi.reset();
    });
  });

// defaults END


  var _motion_map = []
  if (MMD_SA_options.motion_by_song_name) {
    for (var song_name in MMD_SA_options.motion_by_song_name) {
      var m = MMD_SA_options.motion_by_song_name[song_name]
      var motion_index = m.motion_index
      if (motion_index != null) {
        _motion_map[motion_index] = MMD_SA_options.motion[motion_index]
      }
    }
  }

  if (MMD_SA_options.motion_shuffle_pool_size) {
    var _motion_must_load = []
    for (var k = 0, k_max = MMD_SA_options.motion.length; k < k_max; k++) {
      var m = MMD_SA_options.motion[k]
      if (m.must_load)
        _motion_map[k] = _motion_must_load[_motion_must_load.length] = m
    }
    if (MMD_SA_options.motion_shuffle_list_default) {
      for (var k = 0, k_max = MMD_SA_options.motion_shuffle_list_default.length; k < k_max; k++) {
        var motion_index = MMD_SA_options.motion_shuffle_list_default[k]
        _motion_map[motion_index] = MMD_SA_options.motion[motion_index]
      }
    }

    if (!MMD_SA_options.motion_shuffle) {
      MMD_SA_options.motion_shuffle = []
      MMD_SA_options.motion.forEach(function (motion, idx) {
        if (!motion.no_shuffle)
          MMD_SA_options.motion_shuffle.push(idx)
      });
      MMD_SA_options.motion_shuffle.shuffle().slice(0, MMD_SA_options.motion_shuffle_pool_size)
    }


    var _motion_shuffle_existed = []

    var _motion_shuffle = MMD_SA_options.motion_shuffle.slice(0)
    for (var k = 0, k_max = _motion_shuffle.length; k < k_max; k++)
      _motion_shuffle_existed[_motion_shuffle[k]] = true

    var _motion_shuffle_spare = []
    if (MMD_SA_options.motion_shuffle_list_default) {
      for (var k = 0, k_max = MMD_SA_options.motion_shuffle_list_default.length; k < k_max; k++) {
        var motion_index = MMD_SA_options.motion_shuffle_list_default[k]
        if (!_motion_shuffle_existed[motion_index]) {
          _motion_shuffle_existed[motion_index] = true
          _motion_shuffle_spare.push(motion_index)
        }
      }
    }

    var _shuffle = []
    for (var i = 0, i_max = MMD_SA_options.motion.length; i < i_max; i++) {
      if (!_motion_shuffle_existed[i] && !MMD_SA_options.motion[i].no_shuffle)
        _shuffle.push(MMD_SA_options.motion[i])
    }

    var _motion = []
    for (var k = 0, k_max = _motion_shuffle.length; k < k_max; k++)
      _motion.push(MMD_SA_options.motion[_motion_shuffle[k]])
    for (var k = 0, k_max = _motion_shuffle_spare.length; k < k_max; k++)
      _motion.push(MMD_SA_options.motion[_motion_shuffle_spare[k]])

    MMD_SA_options.motion = (MMD_SA_options.motion_shuffle_pool_size <= _motion_shuffle.length) ? _motion : _motion.concat(_shuffle.shuffle().slice(0, MMD_SA_options.motion_shuffle_pool_size-_motion_shuffle_spare.length))


    MMD_SA_options.motion_shuffle = []
    for (var i = 0, i_max = Math.min(MMD_SA_options.motion_shuffle_pool_size, MMD_SA_options.motion.length); i < i_max; i++)
      MMD_SA_options.motion_shuffle.push(i)

    // find the new motion index for "motion_shuffle_list_default"
    if (MMD_SA_options.motion_shuffle_list_default) {
      for (var k = 0, k_max = MMD_SA_options.motion_shuffle_list_default.length; k < k_max; k++) {
        var motion_index = MMD_SA_options.motion_shuffle_list_default[k]
        var m = _motion_map[motion_index]
        for (var i = 0, i_max = MMD_SA_options.motion.length; i < i_max; i++) {
          if (m == MMD_SA_options.motion[i]) {
            MMD_SA_options.motion_shuffle_list_default[k] = i
            break
          }
        }
      }
    }

    for (var k = 0, k_max = _motion_must_load.length; k < k_max; k++) {
      var motion_existed = false
      var m = _motion_must_load[k]
      for (var i = 0, i_max = MMD_SA_options.motion.length; i < i_max; i++) {
        if (m == MMD_SA_options.motion[i]) {
          motion_existed = true
          break
        }
      }

      if (!motion_existed)
        MMD_SA_options.motion.push(m)
    }
  }

  MMD_SA_options.motion_index_by_name = []
  for (var i = 0, i_max = MMD_SA_options.motion.length; i < i_max; i++) {
    MMD_SA_options.motion_index_by_name[MMD_SA_options.motion[i].path.replace(/^.+[\/\\]/, "").replace(/\.vmd$/i, "")] = i
  }

  // backup these lists for default use, just in case they are modified later
  if (MMD_SA_options.motion_shuffle)
    MMD_SA_options._motion_shuffle = MMD_SA_options.motion_shuffle.slice(0)
  if (MMD_SA_options.motion_shuffle_list_default)
    MMD_SA_options._motion_shuffle_list_default = MMD_SA_options.motion_shuffle_list_default.slice(0)

  MMD_SA_options.motion.forEach(function (m) {
    m.path = toLocalPath(m.path)
  })

  MMD_SA.normal_action_length = MMD_SA_options.motion.length

  // Reserve a place for external motion
  MMD_SA.motion_index_for_external = MMD_SA_options.motion.length
  MMD_SA_options.motion.push({})


/*
  if (!SA_body_offsetX)
    SA_body_offsetX = 24
  if (!SA_body_offsetY)
    SA_body_offsetY = 24
*/

  if (MMD_SA_options.MMD_disabled && document.getElementById("Lchild_animation_parent")) {
    DragDrop.relay_id = 0
  }

  self.EV_init = function () {
if (MMD_SA.initialized) {
// resize
//use_solid_bg
  var fullscreen = (!is_SA_child_animation || is_SA_child_animation_host) && Settings.CSSTransformFullscreen && (SA_fullscreen_stretch_to_cover || returnBoolean("AutoItStayOnDesktop"))
  var w, h
  if (fullscreen) {
    w = EV_width  = screen.availWidth
    h = EV_height = screen.availHeight
  }
  else {
    w = EV_width  = Math.round(MMD_SA_options.width  * SA_zoom)
    h = EV_height = Math.round(MMD_SA_options.height * SA_zoom)
  }

// MMD_SA.jThree_ready finished already
  if (!MMD_SA.jThree_ready)
    MMD_SA._renderer.__resize(w,h)

  if (self.ChatboxAT) {
    let zoom = Math.min(w/1280, h/720)
    document.getElementById("CB_Lwindow0").style.transform = (zoom >= 1) ? "" : "scale(" + zoom + ")";
  }

  SA_zoom = 1
  if (MMD_SA_options.use_JSARToolKit) {
    SL_webcam.width  = w
    SL_webcam.height = h
  }
}

if (MMD_SA_options.init)
  MMD_SA_options.init()
else
  MMD_SA.init()
  }

var js
var js_prefix = "v2.1.2_"
//js_prefix = ""; MMD_SA.use_jThree_v1 = true;

if (MMD_SA.use_jThree) {
//MMD_SA_options.ammo_version="2.82"
  js = [
  "jThree/script/jquery.min.js"
/*//  "jThree/script/jquery-2.1.1.min.js"*/
  ];

  if (1) {
    js.push(
//  "jThree/MMDplugin/ammo" + ((MMD_SA_options.ammo_version) ? "_v" + MMD_SA_options.ammo_version : "") + ".js",
  "jThree/MMDplugin/ammo_proxy.js"
    );
  }
  else {
//MMD_SA_options.ammo_version=30
//https://github.com/kripken/ammo.js/issues/36
self.Module = { TOTAL_MEMORY:52428800*2 };
    js.push("jThree/MMDplugin/ammo" + ((MMD_SA_options.ammo_version) ? "_v" + MMD_SA_options.ammo_version : "") + ".js");
    if (MMD_SA_options.ammo_version) {
      js.push('Ammo().then(function () { MMD_SA._ammo_async_loaded_=true; console.log("Ammo.js async loaded"); if (self.jThree && jThree._ammo_async_init_) { console.log(jThree._ammo_async_init_.length); jThree._ammo_async_init_.forEach(function (func) { func() }); jThree._ammo_async_init_=[]; } else { console.log(0); }; });')
//      js.push('MMD_SA._ammo_async_loaded_=true; console.log("Ammo.js loaded");')
    }
  }

  MMD_SA._readVector_scale = (MMD_SA_options.WebXR) ? (MMD_SA_options.WebXR.model_scale || 0.9) : 1;

  var js_min_mode = self._js_min_mode_ || (/*!MMD_SA_options.WebXR && */browser_native_mode && !webkit_window && !localhost_mode);

  if (js_min_mode) {
console.log("three.core.min.js")
    js.push(
  "jThree/three.core.min.js"
    );
  }
  else {
    let XMLHttpRequestZIP_path = ((localhost_mode || (webkit_electron_mode && FSO_OBJ.FileExists(System.Gadget.path + "/_private/js/XMLHttpRequestZIP.js"))) ? "_private/js/XMLHttpRequestZIP.js" : "js/XMLHttpRequestZIP_.js");
    console.log(XMLHttpRequestZIP_path)
    js.push(
  XMLHttpRequestZIP_path
 ,"js/jszip.js"

 ,"jThree/script/"+js_prefix+"jThree.js"
 ,"jThree/MMDplugin/"+js_prefix+"jThree.MMD.js"

 ,"jThree/plugin/CameraHelper.js"
 ,"jThree/plugin/jThree.XFile.js"
 ,"jThree/plugin/MODShadowMapPlugin.js"
 ,"jThree/plugin/three_mirror2.js"
 ,"jThree/plugin/"+js_prefix+"jThree.Trackball.js"
 ,"jThree/plugin/three.audio.js"

// ,"jThree/plugin/three.proton.js"

 ,"jThree/index.js"

// ,"jThree/plugin/TypedArrayUtils.js"

// ,"jThree/plugin/jThree.Stats.min.js"
// ,"js/utf8.js"
// ,"jThree/plugin/three_BufferGeometryUtils.js"
// ,"jThree/plugin/three_ArrowHelper.js"

// ,"jThree/three.ShaderParticles.js"
// ,"jThree/three.SPE.js"
    );
  }

  var EC = MMD_SA_options.MME && MMD_SA_options.MME.PostProcessingEffects
  if (EC && EC.effects.length) {
    if (js_min_mode) {
console.log("three.core.min.effect.js")
      js.push(
  "jThree/three.core.effect.min.js"
      );
    }
    else {
      js.push(
  "jThree/plugin/three_CopyShader.js"
 ,"jThree/plugin/three_EffectComposer.js"
 ,"jThree/plugin/three_MaskPass.js"
 ,"jThree/plugin/three_RenderPass.js"
 ,"jThree/plugin/three_ShaderPass.js"
 ,"jThree/plugin/three_TexturePass.js"
// ,"jThree/plugin/three_ConvolutionShader.js"
// ,"jThree/plugin/three_BloomPass.js"
      );
    }

//threeoctree.min.js
//console.log("threeoctree.min.js")
//js.push("jThree/plugin/Octree.js")

    if (EC.use_FXAA)
      js.push("jThree/plugin/three_FXAAShader.js")

    var _effect_loaded = { CopyShader:true }
    EC.effects.forEach(function (effect) {
      if (EC.use_solid_bg)
        effect.use_solid_bg = true
      if (!_effect_loaded[effect.name]) {
js.push("jThree/plugin/three_" + effect.name + ".js")
       }
      _effect_loaded[effect.name] = true
    });
  }

  if (MMD_SA_options.shadow_darkness == null)
    MMD_SA_options.shadow_darkness = parseFloat(System.Gadget.Settings.readString('MMDShadow') || ((MMD_SA_options.use_shadowMap && 0.5)||0))
  if (MMD_SA_options.use_shadowMap == null)
    MMD_SA_options.use_shadowMap = !!MMD_SA_options.shadow_darkness

  if (MMD_SA_options.use_JSARToolKit) {
    js.push("js/JSARToolKit.js")
  }
}
else {
  js = [
  "MMD.js/libs/gl-matrix.js"
 ,"MMD.js/libs/glMatrixUtils.js"
 ,"MMD.js/libs/sjis.js"
// ,"MMD.js/libs/DataView.js"
 ,"MMD.js/src/MMD.js"
 ,"MMD.js/src/MMD.Model.js"
 ,"MMD.js/src/MMD.Motion.js"
 ,"MMD.js/src/MMD.TextureManager.js"
 ,"MMD.js/src/MMD.ShadowMap.js"
 ,"MMD.js/src/MMD.VertexShaderSource.js"
 ,"MMD.js/src/MMD.FragmentShaderSource.js"
 ,"MMD.js/src/MMD.MotionManager.js"
 ]
}

  var html = ""
  js.forEach(function (str) {
    html += (/\;/.test(str)) ? '<script>' + str + '</scr'+'ipt>\n' : '<script language="JavaScript" src="' + str + '"></scr'+'ipt>\n';
  });

  if (!Array.prototype.shuffle) {
Array.prototype.shuffle = function () {
  var i = this.length, j, temp;
  if ( i == 0 ) return;
  while ( --i ) {
    j = Math.floor( Math.random() * ( i + 1 ) );
    temp = this[i];
    this[i] = this[j];
    this[j] = temp;
  }

  return this;
};
  }

  document.write(html);

  // media control
  document.write('<script language="JavaScript" src="js/SA_media_control.js"></scr'+'ipt>');

  document.write('<script language="JavaScript" src="js/audio_BPM.js"></scr'+'ipt>');
  document.write('<script type="text/goml"></scr'+'ipt>');
})();


// Matrix rain (AR webcam only for now)
if (MMD_SA_options.use_JSARToolKit && (returnBoolean("UseMatrixRain") || use_MatrixRain)) {
  use_MatrixRain = true
  document.write('<script language="JavaScript" src="js/canvas_matrix_rain.js"></scr'+'ipt>');
}

// WebGL 2D
var use_WebGL_2D// = false
if (use_WebGL_2D) {
  document.write('<script language="JavaScript" src="js/html5_webgl2d.js"></scr'+'ipt>');
}

// Tensorflow - BodyPix
if (MMD_SA_options.WebXR && MMD_SA_options.WebXR.AR) {
  console.log("Use BodyPix");
  document.write('<script src="https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@1.2"></scr'+'ipt>');
  document.write('<script async src="https://cdn.jsdelivr.net/npm/@tensorflow-models/body-pix@2.0"></scr'+'ipt>');
}