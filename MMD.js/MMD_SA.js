// MMD for System Animator
// (2024-05-18)

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

if (MMD_SA_options.use_THREEX) {
  const c = document.createElement("canvas")
  c.id = "SLX"
  c.width  = self.EV_width  = MMD_SA_options.width
  c.height = self.EV_height = MMD_SA_options.height
  const cs = c.style
  cs.position = "absolute"
  cs.left = cs.top = "0px"
  cs.zIndex = 1
  SL_Host.appendChild(c)
}

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

  if (use_MatrixRain) {
    this.matrix_rain = new MatrixRain(1024,1024, MMD_SA_options.MatrixRain_options);
    this.matrix_rain.matrixCreate()

    this.matrix_rain._SA_draw = function(skip_matrix) {
if (!this._SA_active)
  return

if (use_full_fps && !skip_matrix)
  skip_matrix = !EV_sync_update.frame_changed("matrixDraw")

this.matrixDraw(skip_matrix)
if (MMD_SA_options.MatrixRain_options && MMD_SA_options.MatrixRain_options.draw_bg)
  this.draw(MMD_SA_options.MatrixRain_options.draw_bg());
    };

    window.addEventListener("MMDStarted", function () {
      System._browser.on_animation_update.add(function () {
MMD_SA.matrix_rain._SA_draw()
      },0,0, -1);
    });

    DEBUG_show("Use Matrix rain", 2)
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
    MMD_SA_options.motion_para[motion.path.replace(/^.+[\/\\]/, "").replace(/\.([a-z0-9]{1,4})$/i, "")] = motion.para_SA;
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

  if (SL_MC_video_obj && (MMD_SA.music_mode || System._browser.camera.media_control_enabled) || MMD_SA.motion_player_control.enabled) {
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
var vo = Audio_BPM.vo;
if (vo.BPM_mode) {
  const img = (this._EQP_obj || {});
  const ao = vo.audio_obj;
  const bpm = ao.BPM || 120;
  let speed = bpm/vo.BPM;
//  if (speed < 0.75) speed *= 2;
  this.defaultPlaybackRate = this._playbackRate = img._playbackRate = speed * (vo.playbackRate_scale || 1);
}

return this._playbackRate;
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

  window.dispatchEvent(new CustomEvent("SA_audio_onended"));

  DEBUG_show("Audio:END", 2)
}

Audio_BPM.checkWinamp(vo)

DragDrop_RE = eval('/\\.(' + DragDrop_RE_default_array.concat(["vmd", "bvh", "mp3", "wav", "aac", "zip", "json", "vrm", "fbx", "gltf", "glb", "exr", "hdr"]).join("|") + ')$/i')

DragDrop.onDrop_finish = async function (item) {
  function load_motion(func) {
if (MMD_SA.MMD_started) {
  func();
  return;
}

if (!System._browser.video_capture.trigger_on_startup_motion) {
  DEBUG_show('(No custom motion before start)', 2);
  return;
}

const ev = (MMD_SA_options.Dungeon_options) ? 'SA_Dungeon_onstart' : 'MMDStarted';
if (typeof System._browser.video_capture.trigger_on_startup_motion == 'function')
  window.removeEventListener(ev, System._browser.video_capture.trigger_on_startup_motion);

System._browser.video_capture.trigger_on_startup_motion = ()=>{
  System._browser.on_animation_update.add(async ()=>{
    await func();

    System._browser.on_animation_update.add(async ()=>{
      MMD_SA.seek_motion(0);
      MMD_SA.motion_player_control.pause();
      await System._browser.video_capture.start();
    }, 0,1);
  }, 10,0);
};

window.addEventListener(ev, System._browser.video_capture.trigger_on_startup_motion);

DEBUG_show('(Startup motion added)', 2);
  }

  var src = item.path
  if (item.isFileSystem && /([^\/\\]+)\.zip$/i.test(src)) {
//DEBUG_show(toFileProtocol(src))
//    if (!MMD_SA.jThree_ready) return;

    const zip_file = SA_topmost_window.DragDrop._path_to_obj[src.replace(/^(.+)[\/\\]/, "")]

const zip = await new self.JSZip().loadAsync(zip_file, {
  decodeFileName: (function () {
    const decoder = new TextDecoder('shift-jis')
    return function (bytes) {
      return decoder.decode(bytes);
    };
  })()
});

// will be called, even if content is corrupted
//console.log(999,src)

if (!MMD_SA.MMD_started) {
  SA_topmost_window.DragDrop._zip_by_url = SA_topmost_window.DragDrop._zip_by_url || {};
  SA_topmost_window.DragDrop._zip_by_url[src] = zip;
}
else {
  XMLHttpRequestZIP.zip_by_url(src, zip);
}

const motion_list = zip.file(/[^\/\\]+.vmd$/i);
const motion_set_list = motion_list.filter(motion=>{
  const motion_filename = motion.name.replace(/^.+[\/\\]/, "").replace(/\.\w+$/, "");

  let is_motion_set;

  const morph_vmd = motion_filename + '_morph';
  if (motion_list.some(m=>m.name.indexOf(morph_vmd)!=-1)) {
    is_motion_set = true;
    const para_SA = MMD_SA_options.motion_para[motion_filename] = MMD_SA_options.motion_para[motion_filename] || {};
    if (!para_SA.morph_component_by_filename)
      para_SA.morph_component_by_filename = morph_vmd;
  }

  const camera_vmd = motion_filename + '_camera';
  if (motion_list.some(m=>m.name.indexOf(camera_vmd)!=-1)) {
    is_motion_set = true;
    const para_SA = MMD_SA_options.motion_para[motion_filename] = MMD_SA_options.motion_para[motion_filename] || {};
    if (!para_SA.camera_component_by_filename)
      para_SA.camera_component_by_filename = camera_vmd;
  }

  return is_motion_set;
});

let files_added
let music_list = zip.file(/[^\/\\]+.(mp3|wav|aac)$/i)
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
    var vmd = motion_list.find(m=>m.name.indexOf(music_filename+'.')!=-1);
    if (vmd) {
      files_added = true
      let k = keys_available.shift()
      keys_used.push(k)

      const video = zip.file(new RegExp(toRegExp(music_filename) + '_video\\.(mp4|mkv|webm)$', 'i'));

      MMD_SA_options.motion_by_song_name[music_filename] = {
  motion_path: (src + "#/" + vmd.name)
 ,song_path: (src + "#/" + music.name)
 ,video_path: video.length && (src + "#/" + video[0].name)
 ,key: k
      };

      if (!MMD_SA.MMD_started && System._browser.video_capture.trigger_on_startup_motion) {
        const ev = (MMD_SA_options.Dungeon_options) ? 'SA_Dungeon_onstart' : 'MMDStarted';
        if (typeof System._browser.video_capture.trigger_on_startup_motion == 'function')
          window.removeEventListener(ev, System._browser.video_capture.trigger_on_startup_motion);

        System._browser.video_capture.trigger_on_startup_motion = ()=>{
          System._browser.on_animation_update.add(()=>{
MMD_SA_options.use_CircularSpectrum = false;

window.addEventListener('SA_motion_by_song_name_mode_onstart', (e)=>{
  const promise = new Promise((resolve)=>{
    System._browser.on_animation_update.add(async ()=>{
      await System._browser.video_capture.start();
      resolve();
    }, 0,0);
  });

  e.detail.result.promise = promise;
}, {once:true});

document.dispatchEvent(new KeyboardEvent('keydown', { keyCode:96+k }));
          }, 10,0);
        };

        window.addEventListener(ev, System._browser.video_capture.trigger_on_startup_motion);
      }
    }
  });

  if (files_added)
    DEBUG_show("Music/Motion list updated (key:" + keys_used.join(",") + ")", 3)
}
else if (motion_set_list.length) {
  System._browser.on_animation_update.add(()=>{ DragDrop.onDrop_finish({ isFileSystem:true, path:src + '#/' + motion_set_list[0].name }); }, 0,0);
}

if (!MMD_SA.jThree_ready) return;

const pmx_list = zip.file(/\.pmx$/i);
let vrm_list = [];
if (!pmx_list.length) {
  if (MMD_SA_options.use_THREEX)
    vrm_list = zip.file(/\.vrm$/i);

  files_added = files_added || !!vrm_list.length;
  if (!files_added) {
    if (!vrm_list.length)
      DEBUG_show("(No 3D model found)")
    return
  }
}

const sb = document.getElementById("LMMD_StartButton")

if (pmx_list.length) {
  MMD_SA._init_my_model = null;

  MMD_SA.THREEX.enabled = false

  const model_filename = pmx_list[0].name.replace(/^.+[\/\\]/, "")

  MMD_SA._init_my_model = function () {
    MMD_SA.init_my_model(src, pmx_list[0].name)
  };

  if (sb) {
    let info_extra = "";
    let model_json = zip.file(/model\.json$/i);
    if (model_json.length) {
      info_extra = "(+config)";
      const json = await model_json[0].async("text");
Object.assign(MMD_SA_options.model_para, JSON.parse(json, function (key, value) {
  if (typeof value == "string") {
    if (/^eval\((.+)\)$/.test(value)) {
      value = eval(decodeURIComponent(RegExp.$1))
    }
  }
  return value
}));
console.log("(model.json updated)");
    }

    sb._msg_mouseover = [
  model_filename + info_extra
 ,System._browser.translation.get('MMD.start.custom_model')
    ].join("\n");
    DEBUG_show(sb._msg_mouseover, -1);

    MMD_SA._click_to_reset = function () {
MMD_SA._init_my_model = null;
SystemAnimator_caches.delete(["/user-defined-local/my_model.zip", "/user-defined-local/my_model.vrm"]);
System.Gadget.Settings.writeString("LABEL_3D_model_path", "");
// reset THREEX.enabled to default
MMD_SA.THREEX.enabled = true
sb._msg_mouseover = sb._msg_mouseover_default;
DEBUG_show(sb._msg_mouseover, -1);
Ldebug.style.cursor = "default";
Ldebug.removeEventListener("click", MMD_SA._click_to_reset);
MMD_SA._click_to_reset = null;
};
    Ldebug.style.cursor = "pointer";
    Ldebug.addEventListener("click", MMD_SA._click_to_reset);
  }

  SystemAnimator_caches.put("/user-defined-local/my_model.zip", new Response(zip_file, {status:200, statusText:"custom_PC_model|my_model.zip"}));
  if (webkit_electron_mode)
    System.Gadget.Settings.writeString("LABEL_3D_model_path", src);
}
else if (vrm_list.length) {
  MMD_SA._init_my_model = null;

  MMD_SA.THREEX.enabled = true
  MMD_SA_options.THREEX_options.model_path = src + '#/' + vrm_list[0].name

  const model_filename = vrm_list[0].name.replace(/^.+[\/\\]/, "")

  if (sb) {
    let info_extra = ''
    let model_json = zip.file(/model\.json$/i);
    if (model_json.length) {
      info_extra = "(+config)";
      const json = await model_json[0].async("text");
Object.assign(MMD_SA_options.THREEX_options.model_para, JSON.parse(json, function (key, value) {
  if (typeof value == "string") {
    if (/^eval\((.+)\)$/.test(value)) {
      value = eval(decodeURIComponent(RegExp.$1))
    }
  }
  return value
}));
console.log("(model.json updated)");
    }

    sb._msg_mouseover = [
  model_filename + info_extra
 ,System._browser.translation.get('MMD.start.custom_model')
    ].join("\n");
    DEBUG_show(sb._msg_mouseover, -1);

    MMD_SA._click_to_reset = function () {
SystemAnimator_caches.delete(["/user-defined-local/my_model.zip", "/user-defined-local/my_model.vrm"]);
System.Gadget.Settings.writeString("LABEL_3D_model_path", "");
MMD_SA_options.THREEX_options.model_path = MMD_SA_options.THREEX_options.model_path_default;
sb._msg_mouseover = sb._msg_mouseover_default;
DEBUG_show(sb._msg_mouseover, -1);
Ldebug.style.cursor = "default";
Ldebug.removeEventListener("click", MMD_SA._click_to_reset);
MMD_SA._click_to_reset = null;
};
    Ldebug.style.cursor = "pointer";
    Ldebug.addEventListener("click", MMD_SA._click_to_reset);
  }

  SystemAnimator_caches.put("/user-defined-local/my_model.zip", new Response(zip_file, {status:200, statusText:"custom_PC_model|my_model.zip"}));
  if (webkit_electron_mode)
    System.Gadget.Settings.writeString("LABEL_3D_model_path", src);
}

//console.log(DragDrop)
  }
  else if (item.isFileSystem && /([^\/\\]+)\.(vrm)$/i.test(src)) {
    if (MMD_SA.MMD_started) {
      if (MMD_SA.THREEX.enabled) {
        MMD_SA.THREEX.VRM.load_extra(src);
      }
      return;
    }

    if (!MMD_SA_options.use_THREEX) return;
    if (!MMD_SA.jThree_ready) return;

    MMD_SA._init_my_model = null;

    MMD_SA.THREEX.enabled = true
    MMD_SA_options.THREEX_options.model_path = src

    const sb = document.getElementById("LMMD_StartButton")

    const model_filename = src.replace(/^.+[\/\\]/, "")

    if (sb) {
      let info_extra = ''
      sb._msg_mouseover = [
  model_filename + info_extra
 ,System._browser.translation.get('MMD.start.custom_model')
      ].join("\n");
      DEBUG_show(sb._msg_mouseover, -1);

      MMD_SA._click_to_reset = function () {
SystemAnimator_caches.delete(["/user-defined-local/my_model.zip", "/user-defined-local/my_model.vrm"]);
System.Gadget.Settings.writeString("LABEL_3D_model_path", "");
MMD_SA_options.THREEX_options.model_path = MMD_SA_options.THREEX_options.model_path_default;
sb._msg_mouseover = sb._msg_mouseover_default;
DEBUG_show(sb._msg_mouseover, -1);
Ldebug.style.cursor = "default";
Ldebug.removeEventListener("click", MMD_SA._click_to_reset);
MMD_SA._click_to_reset = null;
};
      Ldebug.style.cursor = "pointer";
      Ldebug.addEventListener("click", MMD_SA._click_to_reset);
    }

    if (browser_native_mode)
      SystemAnimator_caches.put("/user-defined-local/my_model.vrm", new Response(SA_topmost_window.DragDrop._path_to_obj[model_filename], {status:200, statusText:"custom_PC_model|"+model_filename}));
    if (webkit_electron_mode)
      System.Gadget.Settings.writeString("LABEL_3D_model_path", src);
  }
  else if (item.isFileSystem && /([^\/\\]+)\.(vmd|bvh)$/i.test(src) || (item.isFileSystem && /([^\/\\]+)\.(fbx|glb)$/i.test(src) && (!MMD_SA.THREEX.enabled || MMD_SA.THREEX.utils.convert_THREEX_motion_to_VMD))) {
    const filename = RegExp.$1;

    if (MMD_SA.music_mode) {
      DEBUG_show("(no external motion while music is still playing)", 2)
      return
    }
    if (MMD_SA._busy_mode1_) {
      return
    }

    load_motion(async ()=>{
      const index = MMD_SA_options.motion_index_by_name[filename];
      if ((index != null) && MMD_SA.motion[index]) {
        MMD_SA_options.motion_shuffle = [index];
        MMD_SA_options.motion_shuffle_list_default = null;
        MMD_SA._force_motion_shuffle = true;
      }
      else {
        await MMD_SA.load_external_motion(src);
      }

      if (System._browser.camera.initialized) System._browser.on_animation_update.add(()=>{ System._browser.camera._update_camera_reset(); }, 1,1);
    });
  }
  else if (item.isFileSystem && /([^\/\\]+)\.(fbx|glb)$/i.test(src)) {
    load_motion(async ()=>{
      const model = MMD_SA.THREEX.get_model(0);
      const action_index = model.animation.find_action_index(src.replace(/^.+[\/\\]/, "").replace(/\.(fbx|glb)$/i, ""));
      if (action_index != -1) {
        model.animation.play(action_index);
        model.animation.enabled = true;
      }
      else {
        DEBUG_show('(THREEX motion loading)', 2)

        // Load animation
        const clip = await MMD_SA.THREEX.utils.load_THREEX_motion( src, model );

        model.animation.add_clip(clip);
        model.animation.enabled = true;
//console.log(clip)
        MMD_SA.reset_camera();
        DEBUG_show('(THREEX motion ready)', 2)
      }
    });
  }
  else if (item.isFileSystem && /([^\/\\]+)\.(exr|hdr)$/i.test(src)) {
    MMD_SA.THREEX.utils.HDRI.load(src, true);
  }
  else if (item.isFolder) {
    Audio_BPM.play_list.drop_folder(item)
  }
  else if (item.isFileSystem && /([^\/\\]+)\.(mp3|wav|aac)$/i.test(src)) {
    if (MMD_SA_options.MMD_disabled) {
//      DEBUG_show("(music playback disabled)", 2)
if (!SL._media_player) {
  SL_MC_simple_mode = true

  SL._media_player = SL_MC_video_obj = new Audio()//document.createElement("audio")

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

    if (!THREE.MMD.motionPlaying) {
      DEBUG_show("(motion paused)", 2)
      return
    }

    var filename = RegExp.$1

    if (!MMD_SA_options.motion_shuffle) {
      if (!MMD_SA_options.motion_by_song_name) MMD_SA_options.motion_by_song_name = {}
      MMD_SA_options.motion_by_song_name[filename] = { motion_name:MMD_SA.MMD.motionManager.filename }
    }
    var motion_by_song_name = MMD_SA_options.motion_by_song_name && MMD_SA_options.motion_by_song_name[filename]

    let load_promise;
    if (motion_by_song_name) {
      vo.motion_by_song_name_mode = true
      MMD_SA.playbackRate = 0

      if (motion_by_song_name.video_path) {
        if (!vo.media_linked) vo.media_linked = [];
        let video = vo.media_linked.find(m=>m.id=='motion_bg_video');
        if (!video) {
          video = document.createElement('video');
          vo.media_linked.push(video);
          video.id = 'motion_bg_video';
          video.muted = true;
          video.autoplay = false;
          video.style.position = 'absolute';
          video.style.left = video.style.top = '0px';
          video.style.zIndex = 0;
          video.style.objectFit = "cover";
          video.style.visibility = 'hidden';
          const SL = MMD_SA.THREEX.SL;
          MMD_SA.THREEX.SL.parentElement.appendChild(video);

          video.style.width = SL.width + 'px';
          video.style.height = SL.height + 'px';
          window.addEventListener('SA_MMD_SL_resize', ()=>{
            video.style.width = SL.width + 'px';
            video.style.height = SL.height + 'px';
          });
        }
        load_promise = new Promise((resolve)=>{
          System._browser.update_obj_url(motion_by_song_name.video_path).then(()=>{
            video._src_raw = motion_by_song_name.video_path;
            video.src = toFileProtocol(motion_by_song_name.video_path);
            resolve();
          });
        });
      }
    }
    else if (MMD_SA_options.audio_to_dance_disabled) {
      return;
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

        ao.addEventListener('play', ()=>{
vo.media_linked && vo.media_linked.forEach(m=>{
  const active = m._src_raw.indexOf(filename) != -1;
  if (active) {
    if (m.currentTime)
      m.currentTime = 0;
    m.play();
    m.style.visibility = 'inherit';
  }
});
        });
        ao.addEventListener('pause', ()=>{
vo.media_linked && vo.media_linked.forEach(m=>{
  const active = m._src_raw.indexOf(filename) != -1;
  if (active) {
    m.pause();
  }
});
        });
        ao.addEventListener('seeking', ()=>{
vo.media_linked && vo.media_linked.forEach(m=>{
  const active = m._src_raw.indexOf(filename) != -1;
  if (active) {
    m.currentTime = ao.currentTime;
  }
});
        });
        window.addEventListener('SA_audio_onended', ()=>{
vo.media_linked && vo.media_linked.forEach(m=>{
  const active = (m._src_raw.indexOf(filename) != -1) && (m.style.visibility != 'hidden');
  if (active) {
    m.pause();
    m.currentTime = 0;
    m.style.visibility = 'hidden';
  }
});
        });

        ao.onplaying = async function (e) {//ontimeupdate = function (e) {//
if (ao._timed) return;
ao._timed = true;
//if (!this.currentTime) return;
//if (this.currentTime) return;

if (vo.motion_by_song_name_mode) {
  let duration = Math.max(THREE.MMD.getCameraMotion().length && THREE.MMD.getCameraMotion()[0].duration, THREE.MMD.getModels()[0].skin.duration);
  if (vo.audio_obj.duration > duration) {
    jThree.MMD.duration = duration = vo.audio_obj.duration + 0.1;
// a must when duration is changed during playback (i.e. after MMD_SA.motion_shuffle())
    MMD_SA.MMD.motionManager.lastFrame_ = null;
  }

  MMD_SA.seek_motion(this.currentTime);

  MMD_SA.playbackRate = 1;

  const result = {};
  window.dispatchEvent(new CustomEvent("SA_motion_by_song_name_mode_onstart", { detail:{ result:result } }));
  if (result.promise) {
//    this.pause();
    SL_MC_Play();
    await result.promise;
  }
}

if (this.currentTime) DEBUG_show('Audio:START(' + (parseInt(this.currentTime*1000)/1000) + 's)', 2);
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

SL_MC_video_obj = sender;
SL_MC_Place(1, 0,-64);

if (MMD_SA_options.PPE_disabled_on_idle) {
  var PPE = MMD_SA_options.MME.PostProcessingEffects
  if (MMD_SA_options._PPE_enabled && !PPE.enabled) {
    PPE.enabled = true
//    System._browser.update_tray()
  }
}
MMD_SA_options.audio_onstart && MMD_SA_options.audio_onstart()

if (!System._browser.video_capture.started) {
  MMD_SA.reset_camera();
}

if (!ao.ontimeupdate)
  DEBUG_show("Audio:START", 2)
      }
    }

    ao.AV_init && ao.AV_init(item.obj.obj.file)

    DragDrop._item = item;

    (load_promise || Promise.resolve()).then(()=>{
      Audio_BPM.findBPM(vo)
    });

    return false
  }
  else if (item.isFileSystem && /([^\/\\]+)\.(png|jpg|jpeg|bmp|webp|mp4|mkv|webm)$/i.test(src)) {
//console.log(toFileProtocol(item.path), item)
    if (MMD_SA_options.user_camera.enabled || System._browser.camera.ML_enabled) {
      if (System._browser.camera.initialized && (!System._browser.camera.stream || (System._browser.camera.ML_enabled && 1))) {
        System._browser.camera.init_stream(src)
      }
      else {
        System._browser.camera.local_src = src;
        DEBUG_show('(local media file assigned)', 3);
      }
    }
    else {
      DEBUG_show('(motion tracking required)', 3)
    }
  }
  else if (item.isFileSystem && /([^\/\\]+)\.(json)$/i.test(src)) {
    const response = fetch(toFileProtocol(src)).then(response=>{ response.json().then(json=>{
      const result = {};
      window.dispatchEvent(new CustomEvent('SA_dragdrop_JSON', { detail:{ json:json, result:result } }));

      if (json.System_Animator_motion_para) {
        for (const name in json.System_Animator_motion_para) {
          if (MMD_SA_options.motion_para[name])
            MMD_SA_options.motion_para[name] = Object.assign(MMD_SA_options.motion_para[name]||{}, json.System_Animator_motion_para[name]);
        }
        DEBUG_show('✅Motion config imported', 3);
      }
      else {
        if (!result.return_value)
          DEBUG_show('(Unsupported JSON config)', 3);
      }
    })});
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

Object.defineProperty(MMD_SA, "center_view_raw",
{
  get: function () {
if (MMD_SA_options.MMD_disabled)
  return [0,0,0]
var para_SA = this.MMD.motionManager.para_SA
var cv = (para_SA.center_view || MMD_SA_options.center_view || [0,0,0]).slice()

if (MMD_SA_options.Dungeon && !MMD_SA.music_mode) {
  if (!para_SA.center_view_enforced)
    cv[2] = -cv[2]
}

return cv
  }
});

Object.defineProperty(MMD_SA, "center_view",
{
  get: function () {
let cv = this.center_view_raw;

if (MMD_SA_options.Dungeon && !MMD_SA.music_mode) {
  let c = MMD_SA_options.Dungeon.character
  let rot = c.rot//.clone()
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
  center_view_lookAt = this.center_view_raw.slice(0,2);
  center_view_lookAt.push(0)
}
if (MMD_SA.center_view_lookAt_offset) {
  center_view_lookAt = center_view_lookAt.slice()
  for (var i = 0; i < 3; i++)
    center_view_lookAt[i] += MMD_SA.center_view_lookAt_offset[i]
}

if (MMD_SA_options.Dungeon && !MMD_SA.music_mode) {
  center_view_lookAt = MMD_SA._v3a_.fromArray(center_view_lookAt).applyEuler(MMD_SA_options.Dungeon.character.rot).toArray();
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

var use_startup_screen = !!MMD_SA_options.startup_screen || (!MMD_SA_options.MMD_disabled && ((/AT_SystemAnimator_v0001\.gadget/.test(System.Gadget.path) && !SA_topmost_window.returnBoolean("AutoItStayOnDesktop") && !SA_topmost_window.returnBoolean('IgnoreMouseEvents')) || ((MMD_SA_options.Dungeon || (browser_native_mode && !webkit_window)) && (MMD_SA_options.startup_screen !== false))));
if (use_startup_screen) {
  if (!MMD_SA_options.startup_screen)
    MMD_SA_options.startup_screen = {}
}

if (browser_native_mode || MMD_SA_options.Dungeon || use_startup_screen) {
  Ldebug.style.posLeft = Ldebug.style.posTop = 40
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

let init = async function () {
  await MMD_SA.THREEX.init()

  await MMD_SA.THREEX.GUI.init();

  if (MMD_SA._init_my_model) {
    MMD_SA._init_my_model()
    MMD_SA._init_my_model = null
  }
  Ldebug.style.cursor = "default";
  if (MMD_SA._click_to_reset) {
    Ldebug.removeEventListener("click", MMD_SA._click_to_reset);
    MMD_SA._click_to_reset = null;
  }
  if (is_mobile) document.documentElement.requestFullscreen();

  MMD_SA.MME_init()
  MMD_SA.jThree_ready()

  resize()
};

if (use_startup_screen) {
  if (MMD_SA_options.startup_screen.init) {
    MMD_SA_options.startup_screen.init(async ()=>{ await init(); });
  }
  else {
const sb_func = async function () {
    let sb = document.createElement("div")
    sb.id = "LMMD_StartButton"
    sb.className = "StartButton"
//  sb.href="#"
    sb.addEventListener("click", async function () {
      if (MMD_SA_options.Dungeon_options && MMD_SA_options.Dungeon_options.multiplayer) {
        const mp = MMD_SA_options.Dungeon.multiplayer
        if (!mp.is_host && !mp.is_client) {
          if (!confirm("You are about to start without joining a game from other players, which means you will start in \"host\" mode. In this mode, you won't be able to join other players' games, but on the other hand, other players can join yours."))
            return
          ChatboxAT.SendData_ChatSend([System._browser.P2P_network.process_message('/host')])
        }
      }
//      sb.style.display = "none"
      document.body.removeChild(sb)

      await init();
    }, true);
    sb._msg_mouseover = sb._msg_mouseover_default = System._browser.translation.get('MMD.start').replace(/\<VRM\>/, ((MMD_SA_options.use_THREEX) ? '/VRM ' : ' '));
    sb.addEventListener("mouseover", function () {
      DEBUG_show(this._msg_mouseover, -1);
    }, true);
    sb.style.zIndex = 601
    sb.textContent = "START"
    document.body.appendChild(sb)

    let path, blob;
    if (webkit_electron_mode) {
      path = LABEL_LoadSettings("LABEL_3D_model_path", "");
      if (path && FSO_OBJ.FileExists(path)) {
        const response = await fetch(toFileProtocol(path));
        if (linux_mode) {
          blob = new Blob([await response.arrayBuffer()]);
        }
        else {
          blob = await response.blob();
        }
      }
    }
    else {
      const response = await SystemAnimator_caches.match(["/user-defined-local/my_model.zip", "/user-defined-local/my_model.vrm"], {});
      if (response) {
        blob = await response.blob();
//console.log(blob)
//console.log(response)
        path = response.statusText.split('|').find(v=>/\.(zip|vrm)$/i.test(v)) || 'my_model.zip';
      }
    }

    if (blob) {
      blob.name = path;
      blob.isFileSystem = true;
      await SA_DragDropEMU(blob);
    }

    if (returnBoolean("AutoItStayOnDesktop")) {
      sb.click();
    }
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
    "motion_blending_model0": {
      action: {
        condition: function (is_bone_action, objs) {
if (objs._model_index) return false

if (objs != MMD_SA.Animation_dummy) {
  let mm = MMD_SA.motion[objs._motion_index]

  let duration = this.blending_options.duration || 5/30
  let blending_ratio = 1 - ((RAF_timestamp - this._time_ini)/1000 / duration)
  if (blending_ratio <= 0) {
    let model = THREE.MMD.getModels()[0]
    model.skin_MMD_SA_extra[0] = model.morph_MMD_SA_extra[0] = MMD_SA.Animation_dummy
    return false
  }
  objs._blending_ratio_ = blending_ratio
//DEBUG_show(mm.filename + '/'+this._delta0_from_last_loop+'/'+blending_ratio);return false;
  if (this._seek_time_ != null) {
    objs._seek_time_ = this._seek_time_
    this._seek_time_ = null
  }

  return true
}

return false
        }

       ,onFinish: function (model_index) {
        }
      }

     ,motion: {}
    }

   ,"kissing": {
      action: {
        condition: (function () {
  var motion_name;

  return function (is_bone_action, objs) {
var is_kissing
var busy = MMD_SA.use_jThree && (((MMD_SA_options.allows_kissing) ? MMD_SA.MMD.motionManager.para_SA.allows_kissing===false : !MMD_SA.MMD.motionManager.para_SA.allows_kissing) || (MMD_SA_options.Dungeon && MMD_SA_options.Dungeon.event_mode) || System._browser.camera.facemesh.enabled || MMD_SA.music_mode || MMD_SA._busy_mode1_ || MMD_SA._horse_machine_mode_)

if (MMD_SA.use_jThree && this._kissing && motion_name && (motion_name != MMD_SA.MMD.motionManager.filename))
  this.onFinish()
motion_name = MMD_SA.MMD.motionManager.filename

if (MMD_SA.use_jThree && !busy && (MMD_SA.camera_position.y > MMD_SA._head_pos.y-2) && (Math.abs(MMD_SA.camera_position.x - MMD_SA._head_pos.x) < 10) && (MMD_SA._head_pos.distanceTo(MMD_SA.camera_position) < 10)) {
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
//      head_pos.y += 1
      kiss._obj.position.copy(head_pos.add(MMD_SA._v3b.copy(MMD_SA.camera_position).sub(head_pos).multiplyScalar(0.2 + ratio*0.6)))
      kiss._obj.scale.x = kiss._obj.scale.y = kiss._obj.scale.z = 0.5 + ratio * 0.5
      kiss.show()
    }

//    if (MMD_SA_options.use_speech_bubble && (this.frame == 0)) MMD_SA.SpeechBubble.message(0, ["Here is your X'mas kiss~\n\u2661"].shuffle()[0], 5000, { pos_mod:[-3,-5,0] });
//"主人，錫錫～\u2661", "飛吻啊，主人～\u2661"
  }
}

return this._kissing
  };
        })()

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

var busy = MMD_SA._busy_mode1_ || !MMD_SA_options.look_at_screen || System._browser.camera.ML_enabled;
if (MMD_SA._hit_hip_ || ((MMD_SA_options.model_para_obj._cover_undies != false) && (MMD_SA.MMD.motionManager.para_SA._cover_undies != false) && !busy && !MMD_SA.custom_action_default.kissing.action._kissing && this._condition(is_bone_action, objs, (((MMD_SA._rx*180/Math.PI) % 360 > 45 * ((MMD_SA.use_jThree) ? 0.75 : 1)) )/* && !Audio_BPM.vo.motion_by_song_name_mode*/) )) {
  this._undies_visible = true

  if (!this._adjust(is_bone_action, objs)) {
    if (is_bone_action && MMD_SA.use_jThree) {
      MMD_SA._update_with_look_at_screen_ = { bone_list:[{name:["左肩","右肩"],ratio:1}], parent_list:["上半身2", "上半身"] }
//bone_list:[{name:["左肩","右肩"],ratio:0.2}, {name:["左腕","右腕"],ratio:0.2}, {name:["左ひじ","右ひじ"],ratio:1}, {name:["左手首"],ratio:-0.5}, {name:["右手首"],ratio:0.5}]
    }
  }

  if (!this._cover_undies) {
    this.frame = 0
    if (MMD_SA_options.use_speech_bubble)
      this._onmessage()
  }
  if (is_bone_action && !this.frame) {
    MMD_SA.copy_first_bone_frame(this.motion_index, objs, {bone_group:["腕"], skin_jThree:/^(\u5DE6|\u53F3)(\u80A9|\u8155|\u3072\u3058|\u624B\u9996|\u624B\u6369)/})
  }

  this._cover_undies = true
}
else
  this._undies_visible = false
//DEBUG_show(this.frame); 
return this._cover_undies
        }

       ,_condition: function (is_bone_action, objs, _default) {
return _default;
        }

       ,_adjust: (function () {
var skin;
var key_by_motion_name = { _default_:{} };
var key_name = "_default_";
var bone_list = ["左肩","左腕","左ひじ","左手捩","左手首", "右肩","右腕","右ひじ","右手捩","右手首"];

function assign_motion(name) {
  if (key_name == name) return;
  key_name = name

  var key = key_by_motion_name[name]
  skin.forEach(function (s) {
    var kb = key[s.keys[0].name]
    if (kb)
      s.keys.forEach(k => {k.rot=kb.rot});
  });
}

return function (is_bone_action, objs) {
  if (!is_bone_action)
    return false

  var mm = MMD_SA.MMD.motionManager
  if (key_by_motion_name[mm.filename]) {
    assign_motion(mm.filename)
    return true
  }

  var model_para_obj = MMD_SA_options.model_para_obj
  var motion_para = mm.para_SA
  var motion_sd = motion_para && motion_para.adjustment_per_model && (motion_para.adjustment_per_model[model_para_obj._filename] || motion_para.adjustment_per_model[model_para_obj._filename_cleaned] || motion_para.adjustment_per_model._default_);
  motion_sd = motion_sd && motion_sd.skin_default && motion_sd.skin_default["cover_undies"];

  if (!motion_sd) {
    assign_motion("_default_")
    return false
  }

  if (!skin) {
    let cache = THREE.MMD.getModels()[0]._MMD_SA_cache
    skin = cache[Object.keys(cache).find(e => /_cover_undies_blush/.test(e))]
    if (!skin)
      return false

    skin = skin.skin.targets.filter(s => s.keys.length && (bone_list.indexOf(s.keys[0].name) != -1));
    skin.forEach(function (s) {
      key_by_motion_name._default_[s.keys[0].name] = { rot:s.keys[0].rot } 
    });
  }

  var key = key_by_motion_name[mm.filename] = {}

  skin.forEach(function (s) {
    var name = s.keys[0].name;
    var kb = motion_sd[name];
    key[name] = { rot:(kb) ? MMD_SA.TEMP_q.setFromEuler(MMD_SA.TEMP_v3.fromArray([-kb.rot.x, kb.rot.y, -kb.rot.z].map((n,i) => n*Math.PI/180)), 'YXZ').toArray() : [0,0,0,1] };
  });

  assign_motion(mm.filename)
  return true
};
      })()

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
/*
var keys = this.targets[idx].keys
var name = keys[0].name
var model_para_obj = MMD_SA_options.model_para_obj_all[this._model_index]
var md = model_para_obj.morph_default && model_para_obj.morph_default[name]
if (md && (!md.weight_scale || md.weight)) {
  keys[0].weight = keys[1].weight = (!md.motion_filter || md.motion_filter.test(decodeURIComponent(_vmd.url))) ? ((md.weight!=null)?md.weight:1) : 0
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

this.fadeout_opacity = 1;
return motion_changed
  }

 ,load_external_motion: function (src, _onload) {
const name_new = src.replace(/^.+[\/\\]/, "").replace(/\.([a-z0-9]{1,4})$/i, "");

let index;

const model = THREE.MMD.getModels()[0];

let resolve_func;
const promise = new Promise((resolve)=>{ resolve_func=resolve; });

function _finalize() {
  MMD_SA_options.motion_index_by_name[name_new] = index
  var m = MMD_SA_options.motion[index] = { path:src }

// assigning a new MotionManager() ensures that motion change can be detected in .motion_shuffle() even if the motion index remains the same
  var mm = MMD_SA.motion[index] = new MMD_SA.MMD.MotionManager()
  mm.filename = name_new

  mm.para_SA = MMD_SA_options.motion_para[name_new] = MMD_SA_options.motion_para[name_new]||{};
  mm.para_SA.is_custom_motion = true;

  for (const p of [['look_at_screen',false], ['random_range_disabled',true], ['motion_tracking_enabled',true], ['motion_tracking_upper_body_only',true]]) {
    if (mm.para_SA[p[0]] == null)
      mm.para_SA[p[0]] = p[1];
  }

  mm._index = mm.para_SA._index = index
  mm.para_SA._path = src

  var result = { return_value:false };
  window.dispatchEvent(new CustomEvent("SA_on_external_motion_loaded", { detail:{ path:src, result:result } }));

  if (_onload) {
    _onload();
  }
  else if (!result.return_value && (_onload !== false)) {
    MMD_SA_options.motion_shuffle = [index]
    MMD_SA_options.motion_shuffle_list_default = null
    MMD_SA._force_motion_shuffle = true

    System._browser.on_animation_update.add(()=>{MMD_SA.motion_player_control.enabled = true;}, 0,1);
  }

  THREE.MMD.setupCameraMotion(model._MMD_SA_cache[src].camera)

  resolve_func();
}

function _vmd(vmd_components) {
  function _vmd_loaded( vmd ) {
    index = MMD_SA_options.motion_index_by_name[name_new] || MMD_SA_options.motion.length;
    vmd._index = index;

    vmd_components && vmd_components.forEach(_vmd=>{
      if (_vmd.morphKeys.length) {
        vmd._morph_component = _vmd;
        vmd._morph_component.url = vmd.url;
      }
      else if (_vmd.cameraKeys.length) {
        vmd._camera_component = _vmd;
        vmd._camera_component.url = vmd.url;
      }
    });

    model._MMD_SA_cache[src] = model.setupMotion_MMD_SA(vmd)

    for (var i = 1, i_max = MMD_SA_options.model_para_obj_all.length; i < i_max; i++) {
      const model_para = MMD_SA_options.model_para_obj_all[i];
      if (model_para.mirror_motion_from_first_model) {
        const _model = THREE.MMD.getModels()[i];
        _model._MMD_SA_cache[src] = _model.setupMotion_MMD_SA(vmd);
      }
    }

    _finalize();
  }

  model._VMD(src, _vmd_loaded);
}

if (MMD_SA.motion[MMD_SA_options.motion_index_by_name[name_new]]) {
  if (_onload) {
    _onload();
  }
  resolve_func();
}
//else if (MMD_SA.vmd_by_filename[name_new]) { _finalize(); }
else {
  const para_SA = MMD_SA_options.motion_para[name_new] = MMD_SA_options.motion_para[name_new] || {};

  const c_promise_list = [];
  const vmd_components = [];
  for (const c_name of ['morph_component_by_filename', 'camera_component_by_filename']) {
    const c = para_SA[c_name];
    if (c) {
      c_promise_list.push(new Promise(resolve=>{
        model._VMD(src.replace(/[^\/\\]+$/, "") + para_SA[c_name] + ".vmd", function( vmd ) { vmd_components.push(vmd); resolve(); });
      }));
    }
  }

  if (c_promise_list.length) {
    Promise.all(c_promise_list).then(()=>{
      _vmd(vmd_components);
    });
  }
  else {
    _vmd();
  }
}

return promise;
  }

 ,seek_motion: function (time, must_update) {
function model_seek_time(v, i) {
  const modelX = MMD_SA.THREEX.get_model(i);
  if (MMD_SA.THREEX.enabled && modelX.animation.enabled) {
    modelX.animation.mixer.setTime(time);
  }
  else {
    v.seekMotion( time );
  }
}

must_update = must_update && !THREE.MMD.motionPlaying;

if (must_update) jThree.MMD.play(true)

THREE.MMD.getCameraMotion().forEach( function( m ) {
  m.seek( time );
});

THREE.MMD.getModels().forEach( function( v, i ) {
  model_seek_time(v, i);
  MMD_SA.THREEX.get_model(i).resetPhysics();
});

if (must_update) {
  System._browser.on_animation_update.add(()=>{
    jThree.MMD.pause();
    THREE.MMD.getModels().forEach( function( v, i ) {
      model_seek_time(v, i);
    });
  }, 0,1);
}
  }

 ,motion_player_control: (function () {
    function time_update() {
if (MMD_SA._force_motion_shuffle || (animation_mixer_enabled != MMD_SA.THREEX.get_model(0).animation.enabled) || (motion_index != MMD_SA.THREEX.get_model(0).animation.motion_index)) {
  MMD_SA.motion_player_control.enabled = false;
  return;
}

SL_MC_Timeupdate(SL_MC_video_obj);
    }

    var motion_index = -1;
    var enabled = false;
    var animation_mixer_enabled = false;

    return {
      get enabled() { return enabled; },
      set enabled(v) {
if (v && System._browser.camera.media_control_enabled) {
  if (!System._browser.camera.video.paused || System._browser.camera.video.currentTime) return;
}

motion_index = (v) ? MMD_SA.THREEX.get_model(0).animation.motion_index : -1;

if (enabled == !!v) return;
enabled = !!v;

animation_mixer_enabled = MMD_SA.THREEX.get_model(0).animation.enabled;

if (enabled) {
  System._browser.camera.media_control_enabled = false;

  this.paused = false;
  SL_MC_simple_mode = true;
  SL_MC_video_obj = this;
  SL_MC_Place(1, 0,-64);
  System._browser.on_animation_update.add(time_update, 1,1,-1);
}
else {
  if (this.paused) this.play();
  SL_MC_Place(-1);
  System._browser.on_animation_update.remove(time_update, 1);
}
      },

      play: function () {
jThree.MMD.play(true);
this.paused = false;
      },

      pause: function () {
jThree.MMD.pause();
this.paused = true;
      },

      get currentTime() { return MMD_SA.THREEX.get_model(0).animation.time; },
      set currentTime(v) {
MMD_SA.seek_motion(v, true);
      },

      get duration() { return MMD_SA.THREEX.get_model(0).animation.duration; }
    };
  })()

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

 ,GOML_head_list: []
 ,GOML_scene_list: []

// speech bubble START
 ,SpeechBubble: (function () {
    var bb_cache = {}

    var bb_list = []

    function SB(index, para) {
this.index = index || '';

bb_list.push(this);
this.list = bb_list

this.bubble_index = -1

// this is always true now basically
this.use_sprite = true

this._canvas = null
this._txr = null
this._mesh = null
this.loaded = false

this.flipH_side = false
this.flipH_bubble = false

this.msg_group = {
  group_name_current: "",
  group_by_name: {}
};

this.msg = ""
this.msg_timerID = null

this.visible = false

this.hidden_time_ref = Date.now()

this.bubbles = [
  {
    image_url:System.Gadget.path+'/images/SB_kakukaku01.png'
   ,font: '"Segoe Print",fantasy'
   ,font_unicode: 'DFKai-SB,"Microsoft JhengHei"'
   ,font_size: 18
//   ,column_max: 50-3
//   ,column_max_unicode: 25
   ,row_max: 8
   ,auto_wrap: true

   ,bounding_box: [43-4,123-8, 452,252]
   ,left_sided: true
  },

  {
    image_url:System.Gadget.path+'/images/SB_irregular01.png'
   ,font: '"Segoe Print",fantasy'
   ,font_unicode: 'DFKai-SB,"Microsoft JhengHei"'
   ,font_size: 18
//   ,column_max: 36-3
//   ,column_max_unicode: 18
   ,row_max: 8
   ,auto_wrap: true

   ,bounding_box: [135-4,144-8, 313,221]
  },

  {
    image_url:System.Gadget.path+'/images/SB_mokumoku01.png'
   ,font: '"Segoe Print",fantasy'
   ,font_unicode: 'DFKai-SB,"Microsoft JhengHei"'
   ,font_size: 18
//   ,column_max: 42-3
//   ,column_max_unicode: 21
   ,row_max: 8
   ,auto_wrap: true

   ,bounding_box: [87-4,133-8, 373,233]
   ,left_sided: true
  },

  {
    image_url:System.Gadget.path+'/images/SB_mokumoku01a.png'
   ,font: '"Segoe Print",fantasy'
   ,font_unicode: 'DFKai-SB,"Microsoft JhengHei"'
   ,font_size: 18
//   ,column_max: 42-3
//   ,column_max_unicode: 21
   ,row_max: 8
   ,auto_wrap: true

   ,bounding_box: [87-4,133-8, 373,233]
   ,left_sided: true
  }
];

para && Object.assign(this, para);
    }

    SB.prototype.create = function (index) { return new SB(index) };

    SB.prototype.init = function () {
bb_list.forEach((b)=>{ b._init() });
    };

    SB.prototype._init = function () {
for (var i = 0, i_length = this.bubbles.length; i < i_length; i++) {
  let b = this.bubbles[i]
  let cache = bb_cache[b.image_url]
  if (!cache) {
    cache = bb_cache[b.image_url] = new Image()
    cache.src = toFileProtocol(b.image_url)
  }
  b.image = cache
}

  MMD_SA_options.mesh_obj_preload_list.push({ id:'SpeechBubbleMESH' + this.index, create:function () {
const THREE = MMD_SA.THREEX.THREE;

const material = new THREE.SpriteMaterial({
  map: new THREE.Texture(document.createElement('canvas')),
  sizeAttenuation: false,
  depthTest: false,
});

if (!MMD_SA.THREEX.enabled) {
  material.useScreenCoordinates = false;
  material.scaleByViewport = false;
}
else {
  material.map.colorSpace = THREE.SRGBColorSpace;
//  material.depthWrite = false;
}

const sprite = new THREE.Sprite( material );

if (MMD_SA.THREEX.enabled) {
  window.addEventListener('MMDStarted', ()=>{sprite.renderOrder = 999;});
  sprite.layers.enable(MMD_SA.THREEX.PPE.UnrealBloom.NO_BLOOM);
//  sprite.layers.enable(MMD_SA.THREEX.PPE.N8AO.AO_MASK);
}

return sprite;
  } });

    };

    SB.prototype.onload = function () {
bb_list.forEach((b)=>{ b._onload() });
    };

    SB.prototype._onload = function () {
this.loaded = true

for (var i = 0, i_length = this.bubbles.length; i < i_length; i++) {
  let b = this.bubbles[i]
  let bb_f = b.bounding_box_flipH = b.bounding_box.slice(0)
  bb_f[0] = b.image.width - bb_f[0] - bb_f[2]
}

this._mesh = MMD_SA.THREEX.mesh_obj.get_three('SpeechBubbleMESH' + this.index);
this._txr = this._mesh.material.map;
this._canvas = this._txr.image;
this._mesh.renderDepth = 0

this.pos_base_ref = {
  center: new THREE.Vector3()
 ,dir: new THREE.Vector3()
 ,character_pos_ref: new THREE.Vector3()
 ,_v3: new THREE.Vector3()
};
    };

    SB.prototype.get_flipH_bubble = function (msg_changed) {
var rot = this._mesh._rotation || ((this.use_sprite) ? {x:0,y:0,z:0} : this._mesh.rotation)

var flipH_bubble = (Math.PI/2 - Math.abs(rot.y) < Math.PI/20) ? ((msg_changed) ? false : ((this.flipH_side) ? !this.flipH_bubble : this.flipH_bubble)) : rot.z
if (this.flipH_side)
  flipH_bubble = !flipH_bubble

return !!flipH_bubble
    };

    SB.prototype.update_bubble = function (flipH_bubble, para) {
if (!para)
  para = this.para;
this.flipH_bubble = flipH_bubble

bubble_index = this.bubble_index
var b = this.bubbles[bubble_index]

msg = this.msg.replace(/\{\{(.+?)\}\}/g, function (match, p1) { return eval(p1) })

var canvas = this._canvas;
var context = this._context;
if (!context) {
  context = this._context = canvas.getContext('2d');
// NOTE: In THREEX, texture's dimension has to be fixed once initialized
  let w_max = 0, h_max = 0;
  this.bubbles.forEach(b=>{
    w_max = Math.max(b.image.width);
    h_max = Math.max(b.image.height);
  });
  canvas.width = w_max;
  canvas.height = h_max;
}
else {
  context.clearRect(0,0,canvas.width,canvas.height);
}

// CJK detection
// http://stackoverflow.com/questions/1366068/whats-the-complete-range-for-chinese-characters-in-unicode
// http://kourge.net/projects/regexp-unicode-block

var use_ascii = !/^(ja|zh)/.test(System._browser.translation.language) && (/^[\x00-\x7F]+$/.test(msg) || !/[^\x00-\x7F]{5}.*[^\x00-\x7F]{5}/.test(msg));
//DEBUG_show((!b.column_max_unicode && !para.column_max_unicode)+'/'+use_ascii+"",0,1)
var font = para.font || b.font
var font_size = para.font_size || b.font_size
var column_max = para.column_max || b.column_max || parseInt(b.bounding_box[2]/font_size*2)
var column_max_ascii = column_max
var row_max = para.row_max || b.row_max || 10
if (!use_ascii) {
  font = para.font_unicode || System._browser.translation.font || b.font_unicode || font;
  column_max = para.column_max_unicode || b.column_max_unicode || column_max;//Math.round(column_max*0.5);
  row_max = para.row_max_unicode || b.row_max_unicode || row_max;
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

context.globalAlpha = MMD_SA_options.SpeechBubble_opacity || ((System._browser.overlay_mode > 1) && 1) || ((Math.max(MMD_SA.THREEX.SL.width, MMD_SA.THREEX.SL.height) < 1280) ? 0.9 : 0.8);
context.font = "bold " + font_size + 'px ' + font
context.textBaseline = 'top'

context.save()

//if (para.invertH_side) flipH_bubble=!flipH_bubble
var flipH, flipV;
flipV = (MMD_SA_options.camera_type=='Ort');
flipH = !!flipH_bubble ^ flipV;
if (flipV || flipH) {
  context.translate((flipH)?canvas.width:0, (flipV)?canvas.height:0);
  context.scale((flipH)?-1:1, (flipV)?-1:1);
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
      const break_index = line.indexOf(RegExp.$1);
//DEBUG_show(break_index,0,1)
      msg_line[i] = msg.substr(ini, break_index)
      ini += break_index + RegExp.$1.length
      continue
    }
    if (/^(\s)/.test(line)) {
      const s_length = RegExp.$1.length
      ini += s_length
      end -= s_length
    }

    if (para.no_word_break && use_ascii && (ini+end < msg.length)) {
      if (/^([^\s]+)/.test(msg.substring(ini+end-1))) {
        end += RegExp.$1.length;
      }
    }

    var tail_length = 5;
    if ((ini+end < msg.length) && (end > tail_length*2)) {
      let msg_tail = msg.substr(ini+end-tail_length, tail_length);
      if (/(\s+)/.test(msg_tail)) {
        const break_index = msg_tail.indexOf(RegExp.$1) + (end-tail_length);
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

this.msg_line = msg_line

this.msg_obj = msg_line.map(msg=>{
  return {};
});

var w_max = 0, h_max = font_size
for (var i = 0, i_length = msg_line.length; i < i_length; i++) {
  const m = context.measureText(msg_line[i]);
  this.msg_obj[i].w = m.width;
  if (w_max < m.width)
    w_max = m.width;
}

var w = w_max
var h = msg_line.length * h_max + (msg_line.length-1) * 10
var bb = (flipH_bubble) ? b.bounding_box_flipH : b.bounding_box
var x = bb[0] + parseInt((bb[2] - w)/2) + ((para.text_offset && para.text_offset.x) || 0)
var y = bb[1] + parseInt((bb[3] - h)/2) + ((para.text_offset && para.text_offset.y) || 0)

context.fillStyle = "black"

context.save()

flipH = !!System._browser.camera.mirror_3D ^ flipV;
if (flipV || flipH) {
  context.translate((flipH)?canvas.width:0, (flipV)?canvas.height:0);
  context.scale((flipH)?-1:1, (flipV)?-1:1);
}

var branch_index = -1
for (var i = 0, i_length = msg_line.length; i < i_length; i++) {
  if (MMD_SA_options.SpeechBubble_branch) {
    if (MMD_SA_options.SpeechBubble_branch.RE.test(msg_line[i]))
      branch_index = RegExp.$1
    let fillStyle = (branch_index != -1) ? ((branch_index == this._drag_key_) ? 'Green' : (MMD_SA_options.SpeechBubble_branch.fillStyle || 'Navy')) : 'black';
    if ((MMD_SA_options.SpeechBubble_branch.confirm_keydown || (MMD_SA_options.SpeechBubble_branch.use_cursor !== false)) && (this._branch_key_ != null)) {
      if ((branch_index != -1) && (branch_index == this._branch_key_)) {
        fillStyle = 'red'
      }
    }
    context.fillStyle = fillStyle
  }

  const y_final = y + i*(h_max+10);
  context.fillText(msg_line[i], x, y_final);

  const msg_obj = this.msg_obj[i];
  msg_obj.branch_key = (branch_index == -1) ? null : branch_index;
  msg_obj.x = x;
  msg_obj.y = y_final;
  msg_obj.h = h_max+10;
}

context.restore()

this._txr.needsUpdate = true
    };

    SB.prototype.message = function (bubble_index, msg, duration, para) {
this._duration = duration;

if (!para)
  para = {};
this.para = para;

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

var msg_changed = (this.bubble_index != bubble_index) || (this.msg != msg) || para.always_update;
var b = this.bubbles[bubble_index]

var para_SA = MMD_SA.MMD.motionManager.para_SA

var cam = MMD_SA.camera_position

var head_pos = para.head_pos || MMD_SA._head_pos;//MMD_SA.get_bone_position(THREE.MMD.getModels()[0].mesh, "頭");//

var x_diff = cam.x - head_pos.x
var left_sided = b.left_sided
if (para.flipH)
  left_sided = !left_sided
var flipH_side = (para.flipH_side != null) ? para.flipH_side : (Math.abs(x_diff) < 2) ? ((msg_changed) ? false : this.list[0].flipH_side) : ((left_sided) ? (x_diff>0) : (x_diff<0))
if (!!para.invertH_side ^ !!this.invertH_side) {
  flipH_side = !flipH_side
}
if (para_SA.SpeechBubble_flipH)
  flipH_side = !flipH_side
this.flipH_side = !!flipH_side

var pos_mod = (para.pos_mod) || para_SA.SpeechBubble_pos_mod || b.pos_mod || ((MMD_SA_options.model_para_obj_all.length>1) ? [-2,2,-5] : [0,0,0])
var x_mod = ((flipH_side && !left_sided) || (!flipH_side && left_sided)) ? -13 : 13;
x_mod /= this.get_fov_factor(true);

this.distance_scale = (para.distance_scale || 1) * Math.min(Math.pow(MMD_SA.camera_position.distanceTo(THREE.MMD.getModels()[0].mesh.position)/30,2), 1);
this.scale = (para.scale || 1) * (MMD_SA_options.SpeechBubble_scale||1)

this.pos_base_ref.center.copy(head_pos);
this.pos_base_ref.dir.set(
  x_mod + pos_mod[0] * ((x_mod > 0) ? 1 : -1)
 ,2.5 + pos_mod[1]
 ,pos_mod[2]
);
this.pos_base_ref.character_pos_ref.copy(THREE.MMD.getModels()[0].mesh.position)

if (para.pos_fixed || MMD_SA_options.SpeechBubble_pos_fixed) {
  let pos_fixed;
  if (para.pos_fixed) {
    this._pos_fixed = para.pos_fixed;
  }
  else {
    const xy = (Array.isArray(MMD_SA_options.SpeechBubble_pos_fixed)) ? MMD_SA_options.SpeechBubble_pos_fixed : ((SL.width > SL.height)  ? [[-0.4,0.2], [0.4,0.2]] : [[-0.2,0.4], [0.2,-0.4]]);
    this._pos_fixed = xy[this.index||0];
  }
}
else {
  this._pos_fixed = null;
}

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
  let that = this
  this.msg_timerID = setTimeout(function () {
that.msg_timerID = null
that.hide()

if (our_group) {
  that.msg_timerID = setTimeout(function () {
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
    that.message(g[0], g[1], g[2], g[3])
  }, (our_group.para.interval||2000));
}
  }, duration);
}
    };

    Object.defineProperty(SB.prototype, 'pos_fixed', {
      get: function () {
return this.para?.pos_fixed || (MMD_SA_options.Dungeon?.dialogue_branch_mode && this._pos_fixed);
      }
    });

    SB.prototype.update_position = function (scale) {
if (!scale)
  scale = 1

var is_portrait, is_landscape
if (is_mobile && screen.orientation) {
  if (/landscape/.test(screen.orientation.type))
    is_landscape = true
  else
    is_portrait = true
}

if (this.pos_fixed) {
  const v3_screen = MMD_SA.TEMP_v3.set(
    this._pos_fixed[0]
   ,this._pos_fixed[1]
   ,0.5
  );

  const camera = MMD_SA._trackball_camera.object;
  v3_screen.unproject(camera).sub(camera.position).normalize();
  const v3_look_at = MMD_SA._v3a.copy(v3_screen).applyQuaternion(MMD_SA.TEMP_q.copy(camera.quaternion).conjugate());
//DEBUG_show(this.index||0+':\n'+v3_look_at.toArray().join('\n'));
  v3_screen.multiplyScalar(10/Math.abs(v3_look_at.z)).add(camera.position);

  this._mesh.position.copy(v3_screen);
}
else {
  this._mesh.position.copy(this.pos_base_ref.dir).multiplyScalar(this.distance_scale * ((is_portrait && 0.25) || 1) * scale).add(this.pos_base_ref._v3.copy(this.pos_base_ref.center).sub(this.pos_base_ref.character_pos_ref).add(THREE.MMD.getModels()[0].mesh.position));

  if (MMD_SA.THREEX.enabled && MMD_SA.THREEX._object3d_list_) {
    this._pos0 = (this._pos0||new THREE.Vector3()).copy(this._mesh.position);
    this._mesh.position.sub(MMD_SA._trackball_camera.object.position).normalize().multiplyScalar(2).add(MMD_SA._trackball_camera.object.position);
  }
}

this._mesh.scale.set(1,1,1).multiplyScalar(this.scale * scale * ((is_landscape && 1.5) || 1) * ((this.use_sprite)?1/3:1))

//this.pos_base.copy(this._mesh.position).sub(this.pos_base_ref.character_pos_ref)
   };

    SB.prototype.update_placement = function (enforced) {
function update_placement() {
  if (bb_list.some(b=>b._pos_fixed)) {
    MMD_SA._trackball_camera.object.updateMatrixWorld();
  }

  bb_list.forEach(b=>{b._update_placement(enforced)});
}

if (!MMD_SA_options.use_speech_bubble)
  return

window.removeEventListener('SA_MMD_before_render', update_placement);
window.addEventListener('SA_MMD_before_render', update_placement, {once:true});
    };

    SB.prototype._update_placement = function (enforced) {
var mesh = this._mesh
if (!mesh.visible)
  return

let scale;
if (this.pos_fixed) {
  scale = 1;
}
else {
  let dis = ((MMD_SA.THREEX.enabled && MMD_SA.THREEX._object3d_list_ && this._pos0) || this._mesh.position).distanceTo(MMD_SA._trackball_camera.object.position);
  scale = (!this.use_sprite && (dis > 32)) ? 1 + (dis-32)/64 : 1;

  if (1) {//!this.index) {
    let sight_v3 = MMD_SA._v3a.copy(MMD_SA._trackball_camera.object._lookAt).sub(MMD_SA._trackball_camera.object.position).normalize()
    let PC_v3 = MMD_SA._v3b.copy(this.pos_base_ref.center).sub(MMD_SA._trackball_camera.object.position).normalize()
    if ((dis < 20) || (sight_v3.angleTo(PC_v3) > Math.PI/4)) {
      this.pos_base_ref.center.copy(sight_v3).multiplyScalar(30+MMD_SA.center_view[2]*1).add(MMD_SA._trackball_camera.object.position);
    }
  }
}

this.update_position(scale)

mesh._rotation = MMD_SA.face_camera(this.position, null, true)
if (!this.use_sprite)
  mesh.rotation.copy(mesh._rotation)

var flipH_bubble = this.get_flipH_bubble()
if (enforced || (flipH_bubble != this.flipH_bubble)) {
  this.update_bubble(flipH_bubble)
}
    };

    Object.defineProperty(SB.prototype, 'position', {
get: function () { return this._mesh.position }
    });

    SB.prototype.show = function () {
if (!this.visible) {
  this.visible = true
  window.dispatchEvent(new CustomEvent("SA_SpeechBubble_show" + this.index));
}
MMD_SA.THREEX.mesh_obj.get( "SpeechBubbleMESH" + this.index ).show();
    };

    Object.defineProperty(SB.prototype, 'hidden_time', {
get: function () { return ((this.visible) ? 0 : Date.now() - this.hidden_time_ref) }
    });

    SB.prototype.hidden_time_check = function (duration) {
if (this.hidden_time < duration)
  return false

if (Math.random() < 0.5) {
  this.hidden_time_ref += random(duration)
  return false
}

return true
    };

    SB.prototype.hide = function () {
if (this.msg_timerID) {
  clearTimeout(this.msg_timerID)
  this.msg_timerID = null
}

if (this.visible) {
  this.msg = "";
  this._branch_key_ = this._drag_key_ = null;

  this.hidden_time_ref = Date.now()

  this.visible = false
  window.dispatchEvent(new CustomEvent("SA_SpeechBubble_hide" + this.index));
}

MMD_SA.THREEX.mesh_obj.get( "SpeechBubbleMESH" + this.index ).hide();
    };

    SB.prototype.get_fov_factor = function (enforced=MMD_SA.THREEX.enabled) {
// https://github.com/mrdoob/three.js/issues/12150
      return (enforced) ? 1 / (Math.tan(MMD_SA.THREEX.camera.obj.fov/2 * Math.PI/180)*2) : 1;
    };

    window.addEventListener('SA_MMD_model0_onmotionchange', (e)=>{
if ((e.detail.motion_old == e.detail.motion_new) && !MMD_SA._force_motion_shuffle) return;
//DEBUG_show(Date.now())

System._browser.on_animation_update.add(()=>{
  bb_list.forEach(b=>{
    if (b._mesh.visible) {
      b.message(b.bubble_index, b.msg, b._duration, b.para);
    }
  });
// delay for motion transition
}, 20,0);
    });

    new SB();

    new SB(1, {invertH_side:true});

    if (self.MMD_SA_options?.Dungeon_options && (MMD_SA_options.SpeechBubble_branch?.use_cursor !== false)) {
window.addEventListener('MMDStarted', ()=>{
  function highlight() {
    function clear_highlight(sb) {
      if (sb._branch_key_ != null) {
        sb._branch_key_ = null;
        sb._update_placement(true);
      }
    }

    let is_pointer = false;
    bb_list.forEach(sb=>{
      if (!sb.visible || (mouse_x == null)) {
        clear_highlight(sb);
        return;
      }

      const width = SL.width, height = SL.height;
      const widthHalf = width / 2, heightHalf = height / 2;

      const pos = v1.copy(sb._mesh.position).project(MMD_SA._trackball_camera.object);
      pos.x = ( pos.x * widthHalf ) + widthHalf;
      pos.y = - ( pos.y * heightHalf ) + heightHalf;

      pos.x = mouse_x - pos.x;
      pos.y = mouse_y - pos.y;

      const b = sb.bubbles[sb.bubble_index];
      const w = b.image.width;
      const h = b.image.height;

      const scale = v2.copy(sb._mesh.scale).multiplyScalar(SL.height/h * MMD_SA.SpeechBubble.get_fov_factor());//(Math.min(SL.width/w, SL.height/h));
      pos.x /= scale.x;
      pos.y /= scale.y;

      pos.x += w/2;
      pos.y += h/2;

//DEBUG_show('scale:'+scale.x+'\n'+mouse_x+','+mouse_y+'\n'+ (~~pos.x) +','+ (~~pos.y)+'\n\n'+sb.msg_obj.map((o,i)=>i+':'+ ~~o.x + 'x' + ~~o.y + '/' + ~~o.w + 'x' + ~~o.h).join('\n'))

      const sb_drag = get_target_sb('_drag_key_');
      if (sb == sb_drag) {
        if (pos.x < 0) {
          outside_menu = 'left';
        }
        else if (pos.x > w) {
          outside_menu = 'right';
        }
        else if (pos.y < 0) {
          outside_menu = 'top';
        }
        else if (pos.y > h) {
          outside_menu = 'bottom';
        }
        else {
          outside_menu = null;
        }
      }

      if ((pos.x < 0) || (pos.x > w) || (pos.y < 0) || (pos.y > h)) {
        clear_highlight(sb);
        return;
      }

      let msg_obj;
      for (let i = sb.msg_obj.length-1; i >= 0; i--) {
        const obj = sb.msg_obj[i];
        if ((pos.x > obj.x) && (pos.y > obj.y)) {
          if ((pos.x-obj.x < obj.w*1.2) && ((i < sb.msg_obj.length-1) || (pos.y-obj.y < obj.h*1.2)))
            msg_obj = sb.msg_obj[i];
          break;
        }
      }

      let mouseover = msg_obj?.branch_key != null;
      if ((msg_obj?.branch_key != null) ? sb._branch_key_ != msg_obj.branch_key : sb._branch_key_ != null) {
        sb._branch_key_ = (msg_obj?.branch_key != null) ? msg_obj.branch_key : null;
        sb._update_placement(true);

        const branch = get_target_branch(sb, sb._branch_key_);
        if (branch) {
          mouseover = branch.onmouseover;
          mouseover?.({ clientX:mouse_x, clientY:mouse_y });
        }
//DEBUG_show(Date.now())
      }

      if (!mouseover) {
        document.getElementById('SB_tooltip').style.visibility = 'hidden';
//MMD_SA_options.Dungeon.inventory._item_updated?.update_info(null, true);
      }

      is_pointer = is_pointer || (sb._branch_key_ != null);
//      DEBUG_show(pos.toArray().join('\n')+'\n\n'+((msg_obj)?msg_obj.branch_index:-1));
    });

    d_target.style.cursor = cursor || ((is_pointer) ? 'pointer' : 'auto');
  }

  function get_target_branch(sb, key) {
    if (key != null) {
      const msg_branch_list = MMD_SA_options.Dungeon.dialogue_branch_mode;
      const branch = msg_branch_list?.find(b=>((b.sb_index||0)==(sb.index||0)) && (b.key==key));
      return branch;
    }
  }

  function get_target_sb(key='_branch_key_') {
    return bb_list.slice().sort((a,b)=>a._mesh.position.distanceToSquared(MMD_SA.THREEX.camera.obj.position) - b._mesh.position.distanceToSquared(MMD_SA.THREEX.camera.obj.position)).find(sb=>sb[key]!=null);
  }

//  const THREE = MMD_SA.THREEX.THREE;
  const SL = MMD_SA.THREEX.SL;

  const v1 = new THREE.Vector3();
  const v2 = new THREE.Vector3();

  let mouse_x, mouse_y;
  let mouse_down, mouse_drag;
  let drag_target;
  let cursor;
  let outside_menu;

  const d_target = document.getElementById('SL_Host');

  const ev_mouse_move = (!is_mobile) ? 'mousemove' : 'touchmove';
  d_target.addEventListener(ev_mouse_move, (e)=>{
    let sb;
    if (!mouse_drag) {
      if (mouse_down && (mouse_down > -1) && (mouse_down < RAF_timestamp - 250)) {
        mouse_down = -1;
        sb = drag_target?.[0];
        if (sb) {
          const branch = get_target_branch(sb, drag_target[1]);
          if (branch?.on_drag) {
            mouse_drag = true;
            sb._drag_key_ = drag_target[1];
            cursor = 'grabbing';
            MMD_SA._trackball_camera.enabled = false;
          }
          else {
            cursor = 'not-allowed';
          }
        }
      }
    }
    else {
      sb = get_target_sb();
      if (sb) {
        const branch = get_target_branch(sb, sb._branch_key_);
        if (branch?.on_drop) {
          cursor = 'grabbing';
        }
        else {
          cursor = 'not-allowed';
        }
      }
      else {
        const sb_drag = get_target_sb('_drag_key_');
        const drag_branch = get_target_branch(sb_drag, sb_drag._drag_key_);
        if (drag_branch?.on_drag?.outside_menu) {
          cursor = drag_branch.on_drag.outside_menu.cursor || 'move';
        }
        else {
          cursor = 'not-allowed';
        }
      }
    }

    if (!is_mobile) {
      mouse_x = e.clientX * window.devicePixelRatio;
      mouse_y = e.clientY * window.devicePixelRatio;
    }
    else {
      if (sb) {
        mouse_x = (e.touches[0]?.clientX||0) * window.devicePixelRatio;
        mouse_y = (e.touches[0]?.clientY||0) * window.devicePixelRatio;
      }
    }
  });

  const ev_mouse_down = (!is_mobile) ? 'mousedown' : 'touchstart';
  d_target.addEventListener(ev_mouse_down, (e)=>{
    if (is_mobile) {
      mouse_x = (e.touches[0]?.clientX||0) * window.devicePixelRatio;
      mouse_y = (e.touches[0]?.clientY||0) * window.devicePixelRatio;
    }

    let sb = get_target_sb();
    if (!sb) {
      if (is_mobile) {
//DEBUG_show(mouse_x+','+mouse_y)
        highlight(); sb = get_target_sb();
        if (!sb) {
          mouse_x = mouse_y = null;
          return;
        }
      }
      else
        return;
    }

    MMD_SA._trackball_camera.enabled = false;
    e.stopPropagation();

    if (!mouse_down) {
      mouse_down = RAF_timestamp;
    }

    drag_target = [sb, sb._branch_key_];
  });

  const ev_mouse_up = (!is_mobile) ? 'click' : 'touchend';
  d_target.addEventListener(ev_mouse_up, (e)=>{
    mouse_down = null;
    cursor = null;
    drag_target = null;

    if (MMD_SA._trackball_camera.enabled != !!returnBoolean("MMDTrackballCamera")) {
      MMD_SA._trackball_camera.enabled = !!returnBoolean("MMDTrackballCamera");
      e.stopPropagation();
    }

    let sb;
    if (mouse_drag) {
      mouse_drag = null;

      const sb_drag = get_target_sb('_drag_key_');
      sb = get_target_sb();
      if (sb) {
        const branch = get_target_branch(sb, sb._branch_key_);
        if (branch?.on_drop) {
          branch.on_drop.func(sb_drag, sb);
        }
      }
      else {
        const branch = get_target_branch(sb_drag, sb_drag._drag_key_);
        if (branch.on_drag?.outside_menu) {
          branch.on_drag.outside_menu.func(sb_drag, outside_menu);
        }
      }

      sb_drag._drag_key_ = null;
      return;
    }

    if (!is_mobile && (d_target.style.cursor != 'pointer')) return;

    sb = get_target_sb();
    if (!sb) return;

/*
    if (is_mobile) {
      mouse_x = e.clientX * window.devicePixelRatio;
      mouse_y = e.clientY * window.devicePixelRatio;
      highlight();
      const sb_confirm = bb_list.find(sb=>sb._branch_key_!=null);
      if ((sb != sb_confirm) || (sb._branch_key_ != sb_confirm._branch_key_)) {
        mouse_x = mouse_y = null;
        return;
      }
    }
*/
    mouse_x = mouse_y = null;

    const ev = {};
    const num = parseInt(sb._branch_key_);
    if (num >= 0) {
      ev.keyCode = 96+num;
    }
    else {
      ev.code = 'Key'+sb._branch_key_;
    }

    SA_OnKeyDown(ev);
  });

// https://stackoverflow.com/questions/11586527/converting-world-coordinates-to-screen-coordinates-in-three-js-using-projection

  System._browser.on_animation_update.add(highlight, 0,0,-1);
});
    }

    return bb_list[0];
  })()
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
    var TEMP_m4, q1;
    window.addEventListener("jThree_ready", function () {
      TEMP_m4 = new THREE.Matrix4();
      q1 = new THREE.Quaternion();
    });

    return function (mesh, name, parent_to_stop, A_pose_enforced) {
function convert_to_A_pose(bone) {
  return (!A_pose_enforced || !is_T_pose) ? bone.quaternion : q1.fromArray(MMD_SA.THREEX.utils.convert_T_pose_rotation_to_A_pose(bone.name, bone.quaternion.toArray()));
}

var pos = new THREE.Vector3();

const mesh_by_number = typeof mesh == 'number';
const is_THREEX = (mesh_by_number) ? MMD_SA.THREEX.enabled : !!mesh.model;
const is_T_pose = MMD_SA.THREEX.get_model((mesh_by_number) ? mesh : mesh._model_index).is_T_pose;

var model, bone;
if (is_THREEX) {
  model = (mesh_by_number) ? MMD_SA.THREEX.get_model(mesh) : mesh;
  mesh = model.mesh;
  bone = model.get_bone_by_MMD_name(name);
}
else {
  if (mesh_by_number) mesh = THREE.MMD.getModels()[mesh].mesh;
  bone = (typeof name == "string") ? mesh.bones_by_name[name] : mesh.bones[name];
}

if (!bone) return pos;

// should be safe and save some headaches without the need to set A_pose_enforced manually, since MMD bones should always operate on A pose
if ((A_pose_enforced == null) && !mesh.model) A_pose_enforced = true;

if (parent_to_stop && (typeof parent_to_stop == "string")) {
  parent_to_stop = (is_THREEX) ? model.get_bone_by_MMD_name(parent_to_stop) : mesh.bones_by_name[parent_to_stop];
}

pos.copy(bone.position);
var _bone = bone;
while ((_bone.parent !== mesh) && (_bone.parent !== parent_to_stop)) {
  _bone = _bone.parent;
  pos.applyMatrix4(TEMP_m4.makeRotationFromQuaternion(convert_to_A_pose(_bone)).setPosition(_bone.position));
}
if (is_THREEX) pos.multiply(mesh.scale);
if (!parent_to_stop)
  pos.applyMatrix4(TEMP_m4.makeRotationFromQuaternion(mesh.quaternion).setPosition(mesh.position));

return pos;
    };
  })()

 ,get_bone_rotation: (()=>{
    var q1;
    window.addEventListener('jThree_ready', ()=>{
      q1 = new THREE.Quaternion();
    });

    return function (mesh, name, parent_only, parent_to_stop, A_pose_enforced) {
function convert_to_A_pose(bone) {
  return (!A_pose_enforced || !is_T_pose) ? bone.quaternion : q1.fromArray(MMD_SA.THREEX.utils.convert_T_pose_rotation_to_A_pose(bone.name, bone.quaternion.toArray()));
}

const is_T_pose = MMD_SA.THREEX.get_model(mesh._model_index).is_T_pose;

var rot = new THREE.Quaternion();
var bone = (typeof name == "string") ? mesh.bones_by_name[name] : mesh.bones[name]
if (!bone)
  return rot

if (parent_to_stop && (typeof parent_to_stop == "string"))
  parent_to_stop = mesh.bones_by_name[parent_to_stop]

if (!parent_only)
  rot.copy(convert_to_A_pose(bone));

var _bone = bone;
while ((_bone.parent !== mesh) && (_bone.parent !== parent_to_stop)) {
  _bone = _bone.parent;
// parent x self
  rot.multiplyQuaternions(convert_to_A_pose(_bone), rot)
}
if (!parent_to_stop)
  rot.multiplyQuaternions(mesh.quaternion, rot)

return rot.normalize();
    };
  })()

 ,get_bone_rotation_parent: function (mesh, name, parent_to_stop, A_pose_enforced) {
return this.get_bone_rotation(mesh, name, true, parent_to_stop, A_pose_enforced)
  }

 ,clean_axis_rotation: (function () {
    var rot_v3;
    window.addEventListener("jThree_ready", function () {
      rot_v3 = new THREE.Vector3();
    });

    return function (q, euler_order, clean_depth=1) {
rot_v3.setEulerFromQuaternion(q, euler_order)
for (var i = 3-clean_depth; i < 3; i++)
  rot_v3[euler_order.charAt(i).toLowerCase()] = 0
q.setFromEuler(rot_v3, euler_order)

return rot_v3
    };
  })()

 ,_camera_position_: null
 ,get camera_position() {
//jThree("#MMD_camera").three(0)===MMD_SA._trackball_camera.object
return this._camera_position_ || MMD_SA._trackball_camera.object.position;
  }

 ,gravity: [0,-1,0]

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

window.dispatchEvent(new CustomEvent("SA_MMD_before_render"));

if (MMD_SA_options.use_THREEX && MMD_SA.MMD_started) {
  const MMD_mesh0 = THREE.MMD.getModels()[0].mesh;
  const model0 = MMD_SA.THREEX.get_model(0);
//DEBUG_show(['頭', '上半身'].map(b=>model0.get_bone_position_by_MMD_name(b).distanceTo(MMD_SA._trackball_camera.object.position)).join('\n'))
  const avatar_visible_distance = MMD_SA_options.avatar_visible_distance || 3;
  if (MMD_mesh0.visible) {
    const check_list = ['頭', '上半身'].map(b=>model0.get_bone_position_by_MMD_name(b));
    check_list.push(MMD_SA.TEMP_v3.copy(check_list[check_list.length-1]).lerp(MMD_mesh0.position, 0.5));
    if (check_list.some(p=>p.distanceTo(MMD_SA._trackball_camera.object.position) < avatar_visible_distance)) {
      MMD_mesh0.visible = false;
      System._browser.on_animation_update.add(()=>{ MMD_mesh0.visible=true }, 0,0);
    }
  }
}

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

window.dispatchEvent(new CustomEvent("SA_MMD_after_render"));

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

  case "OSC_VMC_CLIENT":
    switch (para[1]) {
      case "enabled":
        MMD_SA.OSC.VMC.sender_enabled = !!parseInt(para[2]);
        break;
      case "send_camera_data":
        MMD_SA.OSC.VMC.send_camera_data = !!parseInt(para[2]);
        break;
      case "app_mode":
        MMD_SA.OSC.app_mode = para[2];
        break;
      case "hide_3D_avatar":
        MMD_SA.hide_3D_avatar = !!parseInt(para[2]);
        break;
    }
    break
}

if (linux_mode)
  System._browser.update_tray()
  }


 ,VMDSpectrum_EV_usage_PROCESS: function (obj, u, decay_factor) {
u /= 100
if (use_full_fps)
  decay_factor *= ((RAF_animation_frame_unlimited)?1:2)/EV_sync_update.count_to_10fps_

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

  var model_para = MMD_SA_options.model_para_obj_all[idx];
  var material_para = (model_para.material_para && model_para.material_para._default_) || {};

  var cs = !!mesh.castShadow
  var rs = !!mesh.receiveShadow
  mesh.castShadow    = enabled && ((material_para.castShadow != null)    ? !!material_para.castShadow : true);
  mesh.receiveShadow = enabled && ((material_para.receiveShadow != null) ? !!material_para.receiveShadow : model_para.is_object || !MMD_SA_options.ground_shadow_only);

  if (/*(cs != mesh.castShadow) || */(rs != mesh.receiveShadow)) {
    mesh.material.materials.forEach(function(m) {
      m.needsUpdate = true;
    });
  }
});

MMD_SA_options.x_object.forEach(function (x_object, idx) {
  var obj = x_object._obj
  var mesh = ((obj.children.length==1) && (obj.children[0].children.length==0) && obj.children[0]) || obj;

  var cs = !!mesh.castShadow
  var rs = !!mesh.receiveShadow
  obj.castShadow    = mesh.castShadow    = enabled && !!x_object.castShadow;
  obj.receiveShadow = mesh.receiveShadow = enabled && !!x_object.receiveShadow;

  if (/*(cs != mesh.castShadow) || */(rs != mesh.receiveShadow)) {
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

    var createAnchor_compatibility_mode;

    window.addEventListener("MMDStarted", function () {
      _camera = MMD_SA._trackball_camera.object.clone()

      var AR_options = MMD_SA_options.WebXR && MMD_SA_options.WebXR.AR;
      if (AR_options && AR_options.dom_overlay) {
        AR_options.dom_overlay.root = (AR_options.dom_overlay.root && document.getElementById(AR_options.dom_overlay.root)) || document.body;//document.documentElement;//
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
function init_anchor(anchor) {
//  DEBUG_show("anchor created")
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
}

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
  if (!createAnchor_compatibility_mode) {
    hit.createAnchor().then(init_anchor).catch(function (err) {
      createAnchor_compatibility_mode = true
    });
  }
  if (createAnchor_compatibility_mode) {
    hit.createAnchor(new XRRigidTransform()).then(init_anchor).catch(function (err) {
      DEBUG_show(".createAnchor ERROR:" + err)
    });
  }
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

EV_sync_update.requestAnimationFrame_auto = false
if (RAF_timerID) {
  cancelAnimationFrame(RAF_timerID)
  RAF_timerID = null
}

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
// for Chrome 80+
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

    EV_sync_update.requestAnimationFrame_auto = true
    if (RAF_timerID) {
      cancelAnimationFrame(RAF_timerID)
      RAF_timerID = null
    }
    RAF_timerID = requestAnimationFrame(Animate_RAF)
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
const THREE = MMD_SA.THREEX.THREE;

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

// abstract object (the actual render is renderer.obj)
this.renderer = MMD_SA.THREEX.renderer;
//this.renderer.autoClear = false;

this.gl = this.renderer.obj.getContext();

this.use_dummy_webgl = session.domOverlayState && AR_options.dom_overlay && AR_options.dom_overlay.use_dummy_webgl;
if (this.use_dummy_webgl) {
  DEBUG_show("Use dummy WebGL (AR)",5)
  if (!this.user_camera.initialized)
    this.gl = document.createElement("canvas").getContext("webgl2");
}

try {
  await this.gl.makeXRCompatible();

  let DPR = this.renderer.devicePixelRatio / window.devicePixelRatio
  let framebufferScaleFactor
  if (DPR != 1) {
    framebufferScaleFactor = DPR
    this.renderer.devicePixelRatio = window.devicePixelRatio
  }
  session.updateRenderState({ baseLayer: new XRWebGLLayer(session, this.gl, ((framebufferScaleFactor||AR_options.framebufferScaleFactor||System._browser.url_search_params.xr_fb_scale) && {framebufferScaleFactor:Math.max(0,Math.min(1,framebufferScaleFactor||AR_options.framebufferScaleFactor||parseFloat(System._browser.url_search_params.xr_fb_scale)||1))}) || null) });
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
  if (!MMD_SA.THREEX.enabled) this.reticle.useQuaternion = true
  this.reticle.add(reticle0)

  MMD_SA.THREEX.scene.add(this.reticle)
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
    AR_options.dom_overlay.root.addEventListener('beforexrselect', (ev) => {
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
this.camera.matrixAutoUpdate = false;

self.THREE.MMD.getModels()[0].mesh.visible = false
//document.getElementById("SL_Host").style.visibility = "hidden"

let ao = SL_MC_video_obj && SL_MC_video_obj.vo && SL_MC_video_obj.vo.audio_obj;
if (ao && !ao.paused) {
  SL_MC_Play()
}

if (1) {
  if (!this.use_dummy_webgl) {
    document.getElementById("SL").style.visibility = MMD_SA.THREEX.SL.style.visibility = "hidden"
  }
  document.getElementById("LdesktopBG_host").style.visibility = "hidden"
  document.getElementById("Lquick_menu").style.display = "none"

  Ldebug.style.posLeft = Ldebug.style.posTop = 10

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
THREE.MMD.getModels()[0].mesh.visible = true
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

EV_sync_update.requestAnimationFrame_auto = true
if (RAF_timerID) {
  cancelAnimationFrame(RAF_timerID)
  RAF_timerID = null
}
RAF_timerID = requestAnimationFrame(Animate_RAF)

if (1) {
  document.getElementById("SL").style.visibility = MMD_SA.THREEX.SL.style.visibility = "inherit"
  document.getElementById("LdesktopBG_host").style.visibility = "visible"
  document.getElementById("Lquick_menu").style.display = "block"

  Ldebug.style.posLeft = Ldebug.style.posTop = 0

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
  let framebuffer_changed = !!this.renderer.device_framebuffer;
  if (!this.use_dummy_webgl || (this.user_camera.initialized && !this.user_camera.visible)) {
    this.renderer.device_framebuffer = session.renderState.baseLayer.framebuffer;
    if (framebuffer_changed) {
      document.getElementById("SL").style.visibility = MMD_SA.THREEX.SL.style.visibility = "hidden"
    }
  }
  else {
    this.renderer.device_framebuffer = null;
    if (framebuffer_changed) {
      document.getElementById("SL").style.visibility = MMD_SA.THREEX.SL.style.visibility = "inherit"
// this works for both THREE and THREEX
      MMD_SA._renderer.__resize(EV_width, EV_height)
//      window.dispatchEvent(new Event('resize'))
    }
  }

  const DPR = ((MMD_SA.THREEX.enabled) ? 1 : this.renderer.devicePixelRatio) / window.devicePixelRatio;
  for (let view of pose.views) {
    const viewport = session.renderState.baseLayer.getViewport(view);
    this.renderer.obj.setViewport(viewport.x*DPR, viewport.y*DPR, viewport.width*DPR, viewport.height*DPR);

    this.camera.projectionMatrix.fromArray(view.projectionMatrix);
    if (MMD_SA.THREEX.enabled) MMD_SA.THREEX.data.camera.projectionMatrix.fromArray(view.projectionMatrix);
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

let pose = frame.getPose(anchor.anchorSpace, this.frameOfRef);
if (!pose)
  continue
let transform = pose.transform;
if (!transform)
  continue

let checksum = transform.matrix.reduce((n0,n1)=>n0+n1);
if (checksum == xr.hitMatrix_anchor._checksum)
  continue

xr.hitMatrix_anchor._checksum = checksum
xr.hitMatrix_anchor.obj = (xr.hitMatrix_anchor.obj||new THREE.Matrix4()).fromArray(transform.matrix);
xr.hitMatrix_anchor.decomposed = [new THREE.Vector3().copy(transform.position), new THREE.Quaternion().copy(transform.orientation), null];
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

  if (this.user_camera.visible && this.user_camera.mirror_3D) {
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
  RAF_frame_time_delayed = 999
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


 ,get_bone_axis_rotation: (function () {
    var RE_arm = new RegExp("^(" + toRegExp(["左","右"],"|") + ")(" + toRegExp(["肩","腕","ひじ","手首"],"|") + "|." + toRegExp("指") + ".)");

    return function (mesh, name_full, use_THREEX_bone) {
function bone_origin(name) {
  return (use_THREEX_bone) ? modelX.get_bone_origin_by_MMD_name(name): bones_by_name[name].pmxBone.origin;
}

var d = name_full.charAt(0)
var sign_LR = (d=="左") ? 1 : -1

var bones_by_name = mesh.bones_by_name

const modelX = MMD_SA.THREEX.get_model(mesh._model_index);
if (MMD_SA.THREEX.enabled && !bone_origin(name_full))
  use_THREEX_bone = false;

var x_axis, y_axis, z_axis;

const model_para = MMD_SA_options.model_para_obj_all[mesh._model_index];
// Not using .localCoordinate by default as it can be screwed up for some models
if (model_para.use_bone_localCoordinate && bones_by_name[name_full].pmxBone.localCoordinate) {
// z from .localCoordinate is already inverted
  x_axis = MMD_SA._v3a.fromArray(bones_by_name[name_full].pmxBone.localCoordinate[0]);
// z-axis inverted (?)
  z_axis = MMD_SA._v3b.fromArray(bones_by_name[name_full].pmxBone.localCoordinate[1])//.negate();
  if (sign_LR == -1) { x_axis.x *= -1; z_axis.x *= -1; }

  y_axis = MMD_SA.TEMP_v3.crossVectors(x_axis, z_axis).normalize().negate();
}
else {
  const axis_end = bones_by_name[name_full].pmxBone.end;
  const axis = (use_THREEX_bone || (typeof axis_end == 'number')) ? (((axis_end == -1) || !bone_origin(mesh.bones[axis_end]?.name)) ? MMD_SA._v3a.fromArray(bone_origin(name_full)).sub(MMD_SA._v3a_.fromArray(bone_origin(bones_by_name[name_full].parent.name))) : MMD_SA._v3a.fromArray(bone_origin(mesh.bones[axis_end].name)).sub(MMD_SA._v3a_.fromArray(bone_origin(name_full)))).normalize() : MMD_SA._v3a.fromArray(axis_end).normalize();

  if (RE_arm.test(name_full)) {
    x_axis = axis;
    if (sign_LR == -1) x_axis.x *= -1;

    z_axis = MMD_SA._v3b.set(0,0,1).applyQuaternion(MMD_SA._q1.setFromUnitVectors(MMD_SA._v3b_.set(1,0,0), x_axis));

    y_axis = MMD_SA.TEMP_v3.crossVectors(x_axis, z_axis).normalize().negate();
  } 
  else {
    y_axis = axis.negate();
    y_axis.z *= -1
    z_axis = MMD_SA._v3b.set(0,0,1).applyQuaternion(MMD_SA._q1.setFromUnitVectors(MMD_SA._v3b_.set(0,1,0), y_axis));
    sign_LR = 1

    x_axis = MMD_SA.TEMP_v3.crossVectors(y_axis, z_axis).normalize();
  }
}

let rot_m4 = MMD_SA.TEMP_m4.set(
    x_axis.x, x_axis.y, x_axis.z, 0,
    y_axis.x, y_axis.y, y_axis.z, 0,
    z_axis.x, z_axis.y, z_axis.z, 0,
    0,0,0,1
);

var r = new THREE.Quaternion().setFromBasis(rot_m4);

// you can only invert 2+ axes directly in quaternion by inverting the signs
// inverting .z and .y is the same as inverting .x and .w
if (sign_LR==1) { r.z *= -1; r.y *= -1; }
/*
let a = MMD_SA.TEMP_v3.setEulerFromQuaternion(r, 'ZYX')
a.z *= -1;
a.y *= -1;
r.setFromEuler(a, 'ZYX')
*/
//console.log(name_full, x_axis.clone(), y_axis.clone(), z_axis.clone(), x_axis.angleTo(z_axis))
//console.log(name_full, new THREE.Vector3().setEulerFromQuaternion(r, 'ZYX').multiplyScalar(180/Math.PI));

if (MMD_SA.THREEX.enabled && !use_THREEX_bone) {
  if (name_full.indexOf('指') != -1) {
    const r_v3 = MMD_SA.TEMP_v3.setEulerFromQuaternion(r, 'ZYX');
    r_v3.z -= Math.sign(r_v3.z) * 37.4224/180*Math.PI;
    r.setFromEuler(r_v3, 'ZYX');
  }
  else if (name_full.indexOf('足首') == -1) {
    r.set(0,0,0,1)
  }
}

return r;
    };
  })()

 ,load_texture: function (url) {
const THREE = MMD_SA.THREEX.THREE;

const canvas = document.createElement('canvas')
const texture = new THREE.Texture(canvas)

System._browser.load_file(toFileProtocol(url), async function (xhr) {
  const bitmap = await createImageBitmap(xhr.response)

  canvas.width  = bitmap.width
  canvas.height = bitmap.height
  canvas.getContext('2d').drawImage(bitmap, 0,0)
  texture.needsUpdate = true

  bitmap.close()
}, 'blob', true);

return texture;
  }

 ,BVHLoader: function () {
return System._browser.load_script(toFileProtocol(System.Gadget.path + ((localhost_mode || (webkit_electron_mode && /AT_SystemAnimator_v0001\.gadget/.test(System.Gadget.path))) ? '/_private/js/BVHLoader.js' : '/js/BVHLoader.min.js')));
  }

 ,VMD_FileWriter: function () {
return Promise.all([
  System._browser.load_script(toFileProtocol(System.Gadget.path + '/js/VMD_filewriter.js')),
  System._browser.load_script(toFileProtocol(System.Gadget.path + '/js/encoding.min.js'))
]);
  }

 ,Camera_MOD: (function () {
    let camera_mod;

    let v1, v2;
    window.addEventListener('jThree_ready', ()=>{
      v1 = new THREE.Vector3();
      v2 = new THREE.Vector3();

      camera_mod = class Camera_mod {
constructor(id) {
  this.id = id;
  this.pos_last = new THREE.Vector3();
  this.target_last = new THREE.Vector3();

  this.up_z_last = 0;

  Camera_mod.mod_list[id] = this;
}

adjust(pos, target, up_z) {
  Camera_mod.update_camera_base();

  const obj = MMD_SA._trackball_camera;

  if (pos) {
    Camera_mod.pos_last.sub(this.pos_last).add(pos);
    obj.object.position.copy(Camera_mod.c_pos).add(Camera_mod.pos_last);
    this.pos_last.copy(pos);
  }
  if (target) {
    Camera_mod.target_last.sub(this.target_last).add(target);
    obj.target.copy(Camera_mod.c_target).add(Camera_mod.target_last);
    this.target_last.copy(target);
  }
  if (up_z != null) {
    Camera_mod.up_z_last = Camera_mod.up_z_last - this.up_z_last + up_z;
    Camera_mod.rotate_up_z(obj.object.up, Camera_mod.c_up, Camera_mod.up_z_last);
    this.up_z_last = up_z;
  }
}

static update_camera_base() {
  const obj = MMD_SA._trackball_camera;

  Camera_mod.c_pos.copy(obj.object.position).sub(Camera_mod.pos_last);
  Camera_mod.c_target.copy(obj.target).sub(Camera_mod.target_last);

  if (Math.abs(Camera_mod.up_z_last) > 0.0001) {
    Camera_mod.rotate_up_z(Camera_mod.c_up, obj.object.up, -Camera_mod.up_z_last);
  }
}

static rotate_up_z(up_target, up, z) {
  const obj = MMD_SA._trackball_camera;

  const axis = Camera_mod.#v1.copy(obj.object.position).sub(obj.target).normalize();
  const up_rot = Camera_mod.#q1.setFromAxisAngle(axis, z);
  return up_target.copy(up).applyQuaternion(up_rot);
}

static #up = new THREE.Vector3(0,1,0);
static #q1 = new THREE.Quaternion();
static #q2 = new THREE.Quaternion();
static #v1 = new THREE.Vector3();
static #v2 = new THREE.Vector3();

static c_pos = new THREE.Vector3();
static c_target = new THREE.Vector3();
static pos_last = new THREE.Vector3();
static target_last = new THREE.Vector3();

static c_up = new THREE.Vector3();
static up_z_last = 0;

static mod_list = {};
static get_mod(id) {
  return Camera_mod.mod_list[id] || new Camera_mod(id);
}
      }

      window.addEventListener('MMDCameraReset_after', (e)=>{
        if (e.detail.enforced === false) return;

        System._browser.on_animation_update.add(()=>{
          var obj = MMD_SA._trackball_camera;
          obj.object.position.add(camera_mod.pos_last);
          obj.target.add(camera_mod.target_last);

          camera_mod.rotate_up_z(obj.object.up, obj.object.up, camera_mod.up_z_last);
        },0,0);
      });
    });

    return {
      get _obj() { return camera_mod; },

      adjust_camera: function (id, pos, target, up) {
if (!MMD_SA.MMD_started) return;

const c_mod = camera_mod.get_mod(id);
c_mod.adjust(pos, target, up);

return c_mod;
      },

      get_mod: function (id) {
return camera_mod.get_mod(id);
      },

      get_camera_base: function (ignore_list) {
camera_mod.update_camera_base();

const pos = v1.copy(camera_mod.c_pos);
const target = v2.copy(camera_mod.c_target);

ignore_list?.forEach(id=>{
  const c = camera_mod.mod_list[id];
  if (c) {
    pos.add(c.pos_last);
    target.add(c.target_last);
  }
});

return {
  pos:pos,
  target:target,
};
      },
    };
  })()

 ,get_bounding_host: function (obj) {
// MMD model || X || THREEX model
return obj.geometry || ((obj.children.length==1) && (obj.children[0].children.length==0) && obj.children[0].geometry) || obj;
  }

 ,mouse_to_ray: function (mirrored, clamp_dimension) {
const use_screen_data = System._browser.use_screen_data;
const _cursor = (use_screen_data && System._browser._electron_cursor_pos) || { x:System._browser._WE_mouse_x, y:System._browser._WE_mouse_y };
const _window = (use_screen_data && System._browser._electron_window_pos?.slice(0)) || [Lbody_host.style.posLeft, Lbody_host.style.posTop];
if (is_SA_child_animation) {
  const ani = parent.SA_child_animation[SA_child_animation_id]
  _window[0] += ani.x
  _window[1] += ani.y
}

const y = (_cursor.y-_window[1])/B_content_height-0.5 - ((MMD_SA_options.camera_type == 'Ort')?0.5:0);
const _pos = new THREE.Vector3(((_cursor.x-_window[0])/B_content_width-0.5)*2, -(y)*2, 0.5);
if (clamp_dimension) {
  _pos.x = THREE.Math.clamp(_pos.x, -1,1);
  _pos.y = THREE.Math.clamp(_pos.y, -1,1);
}
//DEBUG_show(_pos.toArray().join('\n'))
const camera = MMD_SA._trackball_camera.object;
_pos.unproject(camera).sub(camera.position).normalize();

if (mirrored) {
  _pos.applyQuaternion(MMD_SA._q1.copy(camera.quaternion).conjugate());
  _pos.z *= -1;
  _pos.applyQuaternion(camera.quaternion);
}

_pos.multiplyScalar(100);
//DEBUG_show(_pos.toArray().join('\n'))
_pos.add(camera.position);

return _pos;
  }

// temp stuff
 ,_readVector_scale: 1
 ,_mouse_pos_3D: []

};


MMD_SA.init_my_model = function (zip_path, path_local) {
  var model_filename = path_local.replace(/^.+[\/\\]/, "")

  var _MME_v = {};
  ["_toFloat", "_EV_usage_PROCESS", "PostProcessingEffects"].forEach(function (p) {
    _MME_v[p] = MMD_SA_options.MME[p]
  });

  MMD_SA_options.model_path_default = MMD_SA_options.model_path = zip_path + "#/" + path_local

  var model_filename_cleaned = model_filename.replace(/[\-\_]copy\d+\.pmx$/, ".pmx").replace(/[\-\_]v\d+\.pmx$/, ".pmx")
  var model_para_obj = MMD_SA_options.model_para_obj = Object.assign({}, MMD_SA_options.model_para[model_filename] || MMD_SA_options.model_para[model_filename_cleaned] || MMD_SA_options.model_para._default_ || {})
  model_para_obj._filename_raw = model_filename
  model_para_obj._filename = model_filename
  model_para_obj._filename_cleaned = model_filename_cleaned

  if (!model_para_obj.skin_default)
    model_para_obj.skin_default = { _is_empty:true }
// save some headaches and make sure that every VMD has morph (at least a dummy) in "Dungeon" mode
  if (!model_para_obj.morph_default) model_para_obj.morph_default = {}//{ _is_empty:!MMD_SA_options.Dungeon }//

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

// always use the default .character
  model_para_obj.character = MMD_SA_options.model_para_obj_all[0].character

  MMD_SA_options.model_para_obj_all[0] = MMD_SA_options.model_para_obj_by_filename[model_filename] = model_para_obj
  model_para_obj._model_index = 0
  for (var p in _MME_v) {
    MMD_SA_options.MME[p] = _MME_v[p];
  }
};


MMD_SA.Audio3D = (function () {
    var use_THREE_Audio = true

    if (MMD_SA_options.Dungeon_options) {
// before object creation
      window.addEventListener("SA_Dungeon_after_map_generation", function () { MMD_SA_options.Dungeon.sound.detach_positional_audio(); });

      window.addEventListener("jThree_ready", function () {
        MMD_SA_options.Dungeon_options.sound.forEach(function (sound) {
          MMD_SA_options.Dungeon.sound.load(sound)
        });
      });
    }

    var listener
    window.addEventListener("jThree_ready", function () {
      listener = new THREE.AudioListener();
      listener.setMasterVolume(0.5);
    });
    window.addEventListener("MMDStarted", function () { MMD_SA._trackball_camera.object.add(listener); });

    var _audio_player = []
    var _channel_locked = {}

// THREE.Audio START
    function THREE_Audio(positional) {
this.audio = (positional) ? new THREE.PositionalAudio( listener ) : new THREE.Audio(listener);
this.audio._player = this

this.events = {}
    }

    THREE_Audio.prototype = {
  constructor: THREE_Audio

 ,get loop()  { return this.audio.getLoop(); }
 ,set loop(v) { this.audio.setLoop(v);  }

 ,get volume()  { return this.audio.getVolume(); }
 ,set volume(v) { this.audio.setVolume(v);  }

 ,get paused() { return !this.audio.isPlaying; }

// ,get currentTime() { return this.audio.context.currentTime; }

 ,get autoplay()  { return this.audio.autoplay; }
 ,set autoplay(v) { this.audio.autoplay = v;  }

 ,set src(v) {
this.audio.isPlaying && this.audio.stop()
this.audio.setBuffer( v )
  }

 ,play: function () {
!this.audio.isPlaying && this.audio.play()
  }

 ,pause: function () {
this.audio.isPlaying && this.audio.pause()
  }

 ,_dispatchEvent: function (event_type) {
if (this.events[event_type]) {
  var that = this
  this.events[event_type].forEach(function (func) {
    func.call(that)
  });
}
  }

 ,addEventListener: function (event_type, func) {
if (!this.events[event_type])
  this.events[event_type] = []
this.events[event_type].push(func)
  }
    };
// THREE.Audio END

    function Audio_Player(positional) {
var that = this

// Audio player version
this.timestamp = 0
this.player = (use_THREE_Audio) ? new THREE_Audio(positional) : document.createElement("audio")

this.positional = !!positional
this.obj_parent = null
this.obj_parent_attached = null

this.player.addEventListener("playing", function (e) {
  that.attach_obj_parent()

  that.timestamp = Date.now()
  that.occupied = true
});

this.player.addEventListener("ended", function (e) {
  if (!this.loop)
    that.occupied = false
});

_audio_player.push(this)
console.log("Audio_Player count", _audio_player.length)
    }

    Audio_Player.prototype.detach_obj_parent = function () {
if (!this.positional)
  return
if (!this.obj_parent_attached)
  return

this.obj_parent_attached.remove(this.player.audio)
this.obj_parent_attached = null
console.log("Audio_Player (positional) - obj_parent DETACHED")
    };

    Audio_Player.prototype.attach_obj_parent = function () {
if (!this.positional)
  return
if (this.obj_parent_attached && (this.obj_parent_attached == this.obj_parent))
  return

this.detach_obj_parent()

var p_audio = this.player.audio
p_audio.setRefDistance( 20 )

this.obj_parent_attached = this.obj_parent
this.obj_parent_attached.add(p_audio)
p_audio.updateMatrixWorld(true)
console.log("Audio_Player (positional) - obj_parent ATTACHED")
    };


    function Audio_Object(para) {
this.para = para

this.object_url = null

if (para.channel) {
  if (para.channel === true)
    para.channel = para.name
}
    }

    Audio_Object.prototype = {
  constructor:  Audio_Object

 ,obj_parent_matched: function (obj_parent, ap) {
return ((!obj_parent && !ap.positional) || (ap.positional && (!ap.obj_parent || (obj_parent == ap.obj_parent))));
  }

 ,get_player_obj: function (obj_parent, spawn_id) {
var that = this
var para = this.para

return _audio_player.find(function (ap) {
  return (/*ap.occupied && */((para.name == ap.name) || ((/^BGM$/.test(para.channel) || para.is_exclusive_channel) && (para.channel == ap.channel))) && (!para.can_spawn || !spawn_id || (spawn_id == ap.spawn_id)) && that.obj_parent_matched(obj_parent, ap));
});
  }

 ,play: function (obj_parent, spawn_id) {
if (!this.object_url)
  return null

var that = this
var para = this.para

if (para.can_spawn) {
  if (typeof spawn_id == "boolean") {
    spawn_id = THREE.Math.generateUUID()
  }
  else if (!spawn_id)
    spawn_id = para.name
}
else {
  spawn_id = null
}

var player_obj = this.get_player_obj(obj_parent, spawn_id)
if (player_obj) {
  if (para.name == player_obj.name) {
    player_obj.obj_parent = obj_parent
    if (!player_obj.occupied || player_obj.player.paused) {
      player_obj.player.play()
    }
    return player_obj
  }
}
else {
  player_obj = _audio_player.find(function (ap) {
    return (!ap.occupied && that.obj_parent_matched(obj_parent, ap));
  });
  if (!player_obj) {
    player_obj = new Audio_Player(!!obj_parent)
  }
}

player_obj.name = para.name
player_obj.channel = para.channel
player_obj.spawn_id = spawn_id
player_obj.occupied = true
player_obj.obj_parent = obj_parent

// https://developers.google.com/web/updates/2018/11/web-audio-autoplay
// to save headaches, System Animator game will always begin with a startup screen requesting user interaction (e.g. mouse click), which should ensure that autoplay is always usable.
player_obj.player.autoplay = (!para.channel || !_channel_locked[para.channel])

player_obj.player.loop = para.loop
player_obj.player.volume = (para.volume || 1)

// https://developers.google.com/web/updates/2017/06/play-request-was-interrupted
try {
  player_obj.player.src = this.object_url
}
catch (err) {
// Uncaught (in promise) DOMException: The play() request was interrupted by a new load request.
  console.error(err.message)
}

return player_obj
  }
    };

    return {
  audio_object_by_name: {}

 ,load: function (para) {
var url = para.url
var name = para.name = para.name || url.replace(/^.+[\/\\]/, "").replace(/\.\w+$/, "")
var ao = this.audio_object_by_name[name]
// NOTE: For now, Audio_Object that requires positional support (at least the first player) should avoid using .autoplay
if (ao) {
  if (para.autoplay)
    ao.play()
  return
}

ao = this.audio_object_by_name[name] = new Audio_Object(para)

System._browser.load_file(url, function (xhr) {
  if (use_THREE_Audio) {
// https://github.com/mrdoob/three.js/blob/dev/src/loaders/AudioLoader.js
			// Create a copy of the buffer. The `decodeAudioData` method
			// detaches the buffer when complete, preventing reuse.
// NOTE: no need to reuse the source buffer at this moment
THREE.AudioContext.getContext().decodeAudioData( xhr.response/*.slice( 0 )*/, function ( audioBuffer ) {
  ao.object_url = audioBuffer;
  if (para.autoplay)
    ao.play()
});
  }
  else {
    ao.object_url = URL.createObjectURL(xhr.response)
    if (para.autoplay)
      ao.play()
  }
}, "arraybuffer");
  }

 ,pause_channel: function (channel, locked) {
if (locked)
  _channel_locked[channel] = true

_audio_player.forEach(function (ap) {
  if (ap.occupied && (ap.channel == channel))
    ap.player.pause()
});
  }

 ,resume_channel: function (channel) {
_channel_locked[channel] = null

_audio_player.forEach(function (ap) {
  if (ap.occupied && (ap.channel == channel))
    ap.player.play()
});
  }

 ,detach_positional_audio: function (obj_parent) {
_audio_player.forEach(function (ap) {
  if (ap.positional && (!obj_parent || (obj_parent == ap.obj_parent_attached)))
    ap.detach_obj_parent()
});
  }
    };
})();


MMD_SA.Sprite = (function () {
    var sprite_obj_list = []


MMD_SA_options.use_sprite=true;

(function () {

function thunder_onloop(animator) {
// .numberOfTiles_extended is a trick to delay the start of the next loop by freezing the last frame
  animator.numberOfTiles_extended = animator.numberOfTiles + 4 + random(12);
// animator.speed (undefined by default) is a trick to adjust the individual animator speed at any time (onloop)
  animator.speed = 0.5 + Math.random() * 1;

  const rot = (((Math.random() > 0.5) ? 0 : 180) + (Math.random()-0.5) * 60) * Math.PI/180;
  if (MMD_SA.THREEX.enabled) {
    animator.parent.sprite.material.rotation = rot;
  }
  else {
    animator.parent.sprite.rotation = rot;
  }
//console.log(animator.sprite.material.map.sourceFile)
}

var _hit_box_offset;
window.addEventListener("jThree_ready",() => {
  _hit_box_offset = new THREE.Vector3();
  const p = 'thunder_particle';
  MMD_SA_options._thunder_SFX_ = {
      onloop: thunder_onloop,
      sprite:[
//  {bone_ref:"頭", sticky:true, name:p, depth:3, scale:0.5},
  {bone_ref:"上半身2", sticky:true, name:p, depth:3},
  {bone_ref:"上半身", sticky:true, name:p, depth:3},
  {bone_ref:"下半身", sticky:true, name:p, depth:3},
  {bone_ref:"左腕", sticky:true, name:p, depth:3, scale:0.5},
  {bone_ref:"左ひじ", sticky:true, name:p, depth:3, scale:0.5},
  {bone_ref:"左手首", sticky:true, name:p, depth:3, scale:0.5},
  {bone_ref:"右腕", sticky:true, name:p, depth:3, scale:0.5},
  {bone_ref:"右ひじ", sticky:true, name:p, depth:3, scale:0.5},
  {bone_ref:"右手首", sticky:true, name:p, depth:3, scale:0.5},
  {bone_ref:"左足", sticky:true, name:p, depth:3, scale:0.5},
  {bone_ref:"左ひざ", sticky:true, name:p, depth:3, scale:0.5},
  {bone_ref:"左足首", sticky:true, name:p, depth:3, scale:0.5},
  {bone_ref:"右足", sticky:true, name:p, depth:3, scale:0.5},
  {bone_ref:"右ひざ", sticky:true, name:p, depth:3, scale:0.5},
  {bone_ref:"右足首", sticky:true, name:p, depth:3, scale:0.5},
      ],
  };

  MMD_SA_options.model_para_obj.SFX = [
//    MMD_SA_options._thunder_SFX_
  ];
});

if (webkit_electron_mode&& MMD_SA_options.Dungeon_options) {
  MMD_SA_options.Dungeon.motion["PC Power Up"] = {
//456
      path:'MMD.js\\motion\\motion_rpg_pack01.zip#\\misc\\this_is_power.vmd'
     ,para: { adjust_center_view_disabled:true, onended: function () { MMD_SA._no_fading=true; }
 ,onstart: function () {
MMD_SA_options.Dungeon.sound.audio_object_by_name["gura_reflect_op"].play()//THREE.MMD.getModels()[0].mesh)
  }
 ,onplaying: (function () {
    var power_SFX = {
      id: "this_is_power",
//      frame_range:[0,999],
      onloop: thunder_onloop,
      sprite:[
  {bone_ref:"頭", sticky:true, name:"thunder_particle", depth:3, scale:0.5},
  {bone_ref:"上半身2", sticky:true, name:"thunder_particle", depth:3},
  {bone_ref:"上半身", sticky:true, name:"thunder_particle", depth:3},
  {bone_ref:"下半身", sticky:true, name:"thunder_particle", depth:3},
  {bone_ref:"左腕", sticky:true, name:"thunder_particle", depth:3, scale:0.5},
  {bone_ref:"左ひじ", sticky:true, name:"thunder_particle", depth:3, scale:0.5},
  {bone_ref:"左手首", sticky:true, name:"thunder_particle", depth:3, scale:0.5},
  {bone_ref:"右腕", sticky:true, name:"thunder_particle", depth:3, scale:0.5},
  {bone_ref:"右ひじ", sticky:true, name:"thunder_particle", depth:3, scale:0.5},
  {bone_ref:"右手首", sticky:true, name:"thunder_particle", depth:3, scale:0.5},
  {bone_ref:"左足", sticky:true, name:"thunder_particle", depth:3, scale:0.5},
  {bone_ref:"左ひざ", sticky:true, name:"thunder_particle", depth:3, scale:0.5},
  {bone_ref:"左足首", sticky:true, name:"thunder_particle", depth:3, scale:0.5},
  {bone_ref:"右足", sticky:true, name:"thunder_particle", depth:3, scale:0.5},
  {bone_ref:"右ひざ", sticky:true, name:"thunder_particle", depth:3, scale:0.5},
  {bone_ref:"右足首", sticky:true, name:"thunder_particle", depth:3, scale:0.5},
      ],

      VFX:[
  {name:"aura01", sticky:true, pos_target:{ mesh:"model" }},
//  {name:"aura_ring01", sticky:true, pos_target:{ mesh:"model", offset:{x:0,y:8,z:0} }},
      ],
    };

    var SFX_action = {
  onloop: function (animator) {
animator.parent.sprite.rotation = Math.random() * Math.PI*2
  },
  sprite: [{instance_per_frame:1, name:"explosion_sinestesia-01_03", depth:1}],
    };

    var this_is_power = {
  action: function () {
var model_para = MMD_SA_options.model_para_obj;
model_para._SFX_one_time = model_para._SFX_one_time||[];
model_para._SFX_one_time.push(power_SFX);

var d = MMD_SA_options.Dungeon
if (!d.character.combat_mode) return

var para_SA = MMD_SA.MMD.motionManager.para_SA
if (!para_SA.combat_para) return

var model = THREE.MMD.getModels()[0]
var f = model.skin.time*30

var SFX;
para_SA.combat_para.some((p) => {
  if (!p.frame_range || !p.SFX || !p.SFX.bone_to_pos || (para_SA.SFX && para_SA.SFX.some(sfx => ((f >= sfx.frame_range[0]) && (f <= sfx.frame_range[1])))) || (f > p.frame_range[1]))
    return

  SFX = SFX_action;

  var sprite = SFX.sprite[0]
  sprite.bone_ref = p.SFX.bone_to_pos
  var obj = d.character.combat_stats.weapon.obj
  if (obj && (para_SA.attack_combo_para.combo_type.indexOf(obj.user_data.weapon.type) != -1)) {
    sprite.pos_offset = _hit_box_offset.copy(obj.user_data.weapon.hit_box_offset)
    sprite.pos_offset_rotated = true
  }
  else {
    sprite.pos_offset = sprite.pos_offset_rotated = null
  }

  return true
});

if (SFX) {
  model_para._SFX_one_time.push(SFX);
}

var morph_name = "Bad Gura"
var _m_idx = model.pmx.morphs_index_by_name[morph_name]
if (_m_idx != null) {
  let _m = model.pmx.morphs[_m_idx]
  MMD_SA._custom_morph.push({ key:{ weight:1, morph_type:_m.type, morph_index:_m_idx, override_weight:true }, idx:model.morph.target_index_by_name[morph_name] });
}
  },
    };

    return function (model_index) {
var mm = MMD_SA.MMD.motionManager
var model = THREE.MMD.getModels()[model_index]
if (model.skin.time > 72/30) {
  MMD_SA_options.Dungeon.character.states.this_is_power = this_is_power;
}
    };
  })()

       ,model_index_list: [0]
//       ,mov_speed: [{ frame:0, speed:{x:0, y:0, z: 0.05*30} }]
       ,adjustment_per_model: {
  _default_ : {
    morph_default: {
    }
  }
        }
//       ,motion_command_disabled: true
       ,NPC_motion_command_disabled: true
       ,super_armor: { level:99 }
       ,combat_para: [
  { frame_range:[72,80], hit_level:3, damage:1, bb_expand:{x:0.5*100, y:0, z:0.5*100} }
        ]
       ,motion_duration: 153/30

       ,SFX: [
  {frame_range:[0,10], camera_shake:{magnitude:0.2, duration:72/30*1000, graph:{reversed:true,decay_power:0.5}}},
  {
    frame_range:[72,82],
    VFX:[
  {
    name:"aura_ring01", sticky:true, pos_target:{ mesh:"model", offset:{x:0,y:8,z:0} },
    custom: {duration:500},
  },
    ],
    camera_shake:{magnitude:0.5,duration:1000},
  },
        ]
      }
  };

  if (MMD_SA_options.Dungeon_options.combat_mode_enabled) {
    MMD_SA_options.Dungeon_options.attack_combo_list.push(
      { keyCode:10369, combo_RE:"POWER", motion_id:"PC Power Up", combo_type:"item" }
    );

    MMD_SA_options.Dungeon.item_base.power_up = {
      icon_path: System.Gadget.path + '/images/_dungeon/item_icon.zip#/misc_icon/superpower_64x64.png'
     ,info_short: "????"
     ,index_default: MMD_SA_options.Dungeon.inventory.max_base-3
     ,stock_max: 1
     ,action: {
  func: function () {
var d = MMD_SA_options.Dungeon
if (!d.character.combat_mode || d.character_combat_locked)
  return true
//DEBUG_show(Date.now())
var t = performance.now()
var key_map = d.key_map[10369]
key_map.down = t

var motion_index = MMD_SA_options.motion_index_by_name[d.motion["PC Power Up"].name]
MMD_SA_options.motion_shuffle_list_default = [motion_index]
MMD_SA._force_motion_shuffle = true

//var motion_para = MMD_SA.motion[motion_index].para_SA
//console.log(motion_para)
    },
    muted: true,
      }
    };

    MMD_SA_options.Dungeon_options.sound.push({
      url: 'D:\\My Files\\Videos\\TEMP\\wav\\REFLECT - OP_v01.wav'
     ,name: "gura_reflect_op"
     ,channel: "SFX"
    });
  }
}

})();


// sprite animator START
    if (!MMD_SA_options.sprite_sheet)
      MMD_SA_options.sprite_sheet = []

    if (MMD_SA_options.Dungeon_options || MMD_SA_options.use_sprite) {
      MMD_SA_options.sprite_sheet.push(
  { name:"explosion_purple_01", url:System.Gadget.path+'/images/sprite_sheet.zip#/explosions/explosion_03_strip13_v01-min.png', col:6, row:2, frame_count:12 },
  { name:"blood_01", url:System.Gadget.path+'/images/sprite_sheet.zip#/blood/blood_hit_splash-min.png', col:4, row:4, frame_count:16, scale:20 },
  { name:"hit_yellow_01", url:System.Gadget.path+'/images/sprite_sheet.zip#/hit/hit_yellow_v00-min.png', col:4, row:4, frame_count:16, scale:20 },
  { name:"pointer_blue_01", url:System.Gadget.path+'/images/_dungeon/item_icon.zip#/misc_icon/arrow_down_blue_128x128.png', col:1, row:1, frame_count:1, scale:2 },

  { name:"explosion_red_01", url:System.Gadget.path+'/images/sprite_sheet.zip#/explosions/explosion_01_strip13_v01-min.png', col:6, row:2, frame_count:12 },
  { name:"explosion_sinestesia-01_03",  url:System.Gadget.path+'/images/sprite_sheet.zip#/explosions/explosion_sinestesia-01_03_v01-min.png', col:4, row:8, frame_count:32, scale:20, blending:"additive" },
  { name:"_explosion_sinestesia-01_03", url:System.Gadget.path+'/images/sprite_sheet.zip#/explosions/explosion_sinestesia-01_03_v01-min.png', col:4, row:8, frame_count:32, scale:20, blending:"subtractive",
texture_variant: {
  id: "BW",
  pixel_transform: function (pixels) {
    for (var i = 0, i_length = pixels.length; i < i_length; i += 4) {
//color.r * 0.2126 + color.g * 0.7152 + color.b * 0.0722
      let lightness = ~~(pixels[i]*0.2126 + pixels[i + 1]*0.7152 + pixels[i + 2]*0.0722);
      pixels[i] = lightness;
      pixels[i + 1] = lightness;
      pixels[i + 2] = lightness;
    }
  },
},
  },


  { name:"thunder_particle", url:System.Gadget.path+'/images/sprite_sheet.zip#/thunder/thunder_particle' + ((webkit_transparent_mode) ? '-transparent' : '') + '_v01-min.png', col:4, row:2, frame_count:8, scale:3, blending:(webkit_transparent_mode)?null:"additive" },

//  { name:"smoke_01", url:'C:\\Users\\user\\Downloads\\firespritesheet\\fireSheet5x5.png', col:5, row:5, frame_count:25, scale:5, blending:(webkit_transparent_mode)?null:"additive" },
      );
    }

    var sprite_sheet_by_name = {}
    var ss_texture_by_filename = {}

    MMD_SA_options.sprite_sheet.forEach(function (ss) {
ss.filename = ss.url.replace(/^.+[\/\\]/, "").replace(/\.png$/i, "")
if (!ss.name)
  ss.name = ss.filename
sprite_sheet_by_name[ss.name] = new SpriteSheet(ss)

ss_texture_by_filename[ss.filename] = {
  url: ss.url,
  variant: {},
};
    });

    if (!MMD_SA_options.GOML_head) MMD_SA_options.GOML_head = "";

    window.addEventListener('jThree_ready', ()=>{
for (let name in ss_texture_by_filename) {
  MMD_SA.THREEX.mesh_obj.set(name + '_TXR', MMD_SA.load_texture(ss_texture_by_filename[name].url), true);
}
    });

    function SpriteSheet(obj) {
Object.assign(this, obj)

if (!this.scale)
  this.scale = 10

if (!this.frame_interval)
  this.frame_interval = 1000/30
    }

// inspired by:
// https://stemkoski.github.io/Three.js/Texture-Animation.html

    function SpriteAnimator(obj) {
this.parent = obj
    }

    SpriteAnimator.prototype.reset = function (ss) {
const use_THREEX = MMD_SA.THREEX.enabled;

// NOTE: r58 sets uv offset/scale from the sprite material, not the texture.
var sprite = this.parent.sprite
var texture = sprite.material
if (use_THREEX) texture = texture.map;

var para = this.parent.para

this.sprite_sheet = ss

	// note: texture passed by reference, will be updated by the update function.
		
	this.tilesHorizontal = ss.col;
	this.tilesVertical = ss.row;
	// how many images does this spritesheet contain?
	//  usually equals tilesHoriz * tilesVert, but not necessarily,
	//  if there at blank tiles at the bottom of the spritesheet. 
	this.numberOfTiles = ss.frame_count;

this.numberOfTiles_extended = para.frame_count || ss.frame_count;

  if (use_THREEX) {
    texture.repeat.set( 1/this.tilesHorizontal, 1/this.tilesVertical );
    texture.offset.x = texture.offset.y = 0
//  texture.needsUpdate = true;
  }
  else {
    texture.uvScale.set( 1 / this.tilesHorizontal, 1 / this.tilesVertical );
    texture.uvOffset.x = texture.uvOffset.y = 0
  }

	// how long should each image be displayed?
	this.tileDisplayDuration = ss.frame_interval;

	// how long has the current image been displayed?
	this.currentDisplayTime = 0;

	// which image is currently being displayed?
	this.currentTile = 0;

sprite.rotation = 0

this.started = false
this.loop = !!para.loop

sprite.visible = true
    }

    SpriteAnimator.prototype.update = function( milliSec ) {
const use_THREEX = MMD_SA.THREEX.enabled;

//DEBUG_show(milliSec)
var sprite = this.parent.sprite
var texture = sprite.material
var offset
if (use_THREEX) {
  texture = texture.map
  offset = 'offset'
}
else {
  offset = 'uvOffset'
}

var para = this.parent.para

if (!this.started && para.onloop) {
  this.started = true
  para.onloop(this)
//console.log(sprite.material.map.sourceFile);DEBUG_show(Date.now());
}

		this.currentDisplayTime += milliSec;
		while (this.currentDisplayTime > this.tileDisplayDuration)
		{
			this.currentDisplayTime -= this.tileDisplayDuration;
			this.currentTile++;
			if (this.currentTile == this.numberOfTiles_extended) {
if (!this.loop) {
  sprite.visible = false
  break
}

				this.currentTile = 0;

if (para.onloop) {
  para.onloop(this)
//DEBUG_show(Date.now())
}
			}

var currentTile = Math.min(this.currentTile, this.numberOfTiles-1);

			var currentColumn = currentTile % this.tilesHorizontal;
//			texture.offset.x = currentColumn / this.tilesHorizontal;
texture[offset].x = currentColumn / this.tilesHorizontal;
//			var currentRow = Math.floor( currentTile / this.tilesHorizontal );
var currentRow = (this.tilesVertical-1) - Math.floor( currentTile / this.tilesHorizontal );
//			texture.offset.y = currentRow / this.tilesVertical;
//var currentRow = Math.ceil( currentTile / this.tilesHorizontal );
texture[offset].y = currentRow / this.tilesVertical;
		}
    };
// sprite animator END

    var TextureObject_HP_bar = function (index) {
this.id = "HP_bar" + index;
    };
    TextureObject_HP_bar.prototype.init = function () {
var canvas = this.canvas
canvas.width  = 32
canvas.height = 4
this._obj.drawBorder(this, "black")
//console.log(this)
    };
    TextureObject_HP_bar.prototype.drawBorder = function (that, color) {
var canvas = that.canvas
var context = canvas.getContext("2d")
context.fillStyle = color
context.fillRect(0,0, canvas.width,1)
context.fillRect(0,3, canvas.width,1)
context.fillRect(0,0, 1,canvas.height)
context.fillRect(canvas.width-1,0, 1,canvas.height)
    };
    TextureObject_HP_bar.prototype.update = function (para) {
if (!para)
  para = {}

var v = para.v
if (v == null)
  v = 1

var return_value = false
if (para.border_color_default != para.border_color) {
  para.border_color_default = para.border_color
  this._obj.drawBorder(this, para.border_color)
  return_value = true
}

var v_max = this.canvas.width - 2
v = Math.round(v * v_max)
if (this.value == v)
  return return_value
this.value == v

var canvas = this.canvas
var context = canvas.getContext("2d")
context.fillStyle = "#0F0"
context.fillRect(1,1, v,2)
if (v < v_max) {
  context.fillStyle = "#0A809B"
  context.fillRect(v+1,1, (v_max-v),2)
}

return true
    };

    var Texture_Object = (function () {
var texture_obj_list = []

function TextureObject(texture_obj) {
  const use_THREEX = MMD_SA.THREEX.enabled;
  const THREE = MMD_SA.THREEX.THREE;

  this._obj = texture_obj
  Object.assign(this, texture_obj)

  this.init = texture_obj.init
  this._update = texture_obj.update
  this.update = function (v) {
    var result = this._update(v)
    this.adjust_scale()
    return result
  }

  this.canvas = document.createElement("canvas")
  this.canvas.width = this.canvas.height = 1

  this.texture = new THREE.Texture(this.canvas)
//  if (use_THREEX) this.texture.wrapS = this.texture.wrapT = THREE.RepeatWrapping;
  if (use_THREEX && MMD_SA.THREEX.use_sRGBEncoding) this.texture.colorSpace = THREE.SRGBColorSpace;
  this.texture.needsUpdate = true
}

TextureObject.prototype.adjust_scale = function () {
  var scale = this.obj_parent.para.scale || 1
  var aspect = Math.min(this.canvas.width, this.canvas.height)
  this.obj_parent.sprite.scale.set(scale*(this.canvas.width/aspect),scale*(this.canvas.height/aspect), 1);
};

return function (texture_obj) {
  var obj = texture_obj_list.find(function (_obj) {
    return (texture_obj.id == _obj.id);
  });
  if (obj) {
    obj.value = null
    return obj
  }

  var obj = new TextureObject(texture_obj)
  texture_obj_list.push(obj)
  console.log("sprite canvas count:" + texture_obj_list.length)
  return obj
};
    })();

    function create_sprite_obj(texture) {
const use_THREEX = MMD_SA.THREEX.enabled;
const THREE = MMD_SA.THREEX.THREE;

//  console.log(explosion_texture)
var material = new THREE.SpriteMaterial({ map:texture.clone() });// , useScreenCoordinates:true /*,alignment:THREE.SpriteAlignment.topLeft*/  } );
material.depthTest = false;//true;//
material.sizeAttenuation = true;
if (!use_THREEX) {
  material.useScreenCoordinates = false;
  material.scaleByViewport = false;
}

var sprite = new THREE.Sprite( material );
//console.log(sprite)
//console.log(MMD_SA.SpeechBubble._mesh)
//sprite.renderDepth = 999999
MMD_SA.THREEX.scene.add( sprite );

var obj_free = { sprite:sprite }
sprite_obj_list.push(obj_free)
console.log("sprite object count:" + sprite_obj_list.length)
return obj_free
    }

    window.addEventListener("SA_Dungeon_after_map_generation", function () {
sprite_obj_list.concat(VFX.obj_list).forEach(function (ss) {
  ss.sprite.visible = false
});
    });

// use SA_MMD_after_updateMotion event to make sure they are added LAST after all motion updates
    window.addEventListener("MMDStarted", () => {
      window.addEventListener("SA_MMD_after_updateMotion", ()=>{
THREE.MMD.getModels().forEach((model, idx) => {
  var mesh = model.mesh

// MMD mesh is wrapped by a "dummy" Object3D
// set to false to manually update MMD/model matrixWorld, BEFORE (and skipping) the default routine of MMD mesh matrixWorld update
  mesh.parent.matrixAutoUpdate = mesh.matrixAutoUpdate = false;

  if (!mesh.matrixAutoUpdate) {
// external PMX needs updates on parent
    mesh.parent.updateMatrix();
    mesh.parent.updateMatrixWorld();

    mesh.updateMatrix();
    mesh.updateMatrixWorld();

    MMD_SA.THREEX.get_model(idx).update_model();
  }
});
      });

      window.addEventListener("SA_MMD_after_updateMotion", (function () {
function get_bone_list(_SFX) {
  var bone_list = {}

  _SFX.forEach((SFX, idx) => {
    if (SFX.sprite||SFX.VFX) {
      (SFX.sprite||[]).concat(SFX.VFX||[]).forEach((sprite, s_idx) => {
        if (sprite.bone_ref) {
          if (!bone_list[sprite.bone_ref])
            bone_list[sprite.bone_ref] = {}
          bone_list[sprite.bone_ref].pos = true
          if (sprite.pos_offset_rotated)
            bone_list[sprite.bone_ref].rot = true
        }
      });
    }
  });

  return bone_list
}

var _data = {}

var TEMP_m4 = new THREE.Matrix4();

return function (e) {
  THREE.MMD.getModels().forEach((model) => {
var skin = model.skin
if (!skin) return

var model_para = MMD_SA_options.model_para_obj_all[model._model_index]
var para_SA = MMD_SA.motion[skin._motion_index].para_SA
var _SFX = para_SA.SFX || []
if (!_SFX.length && !model_para.SFX && !model_para._SFX_one_time) return

var mesh = model.mesh

var f = skin.time*30

var data = _data[mesh._model_index]
if (!data)
  data = _data[mesh._model_index] = { bone:{}, motion:{} }

var motion_data = data.motion[skin._motion_index]
if (!motion_data) {
  motion_data = data.motion[skin._motion_index] = { SFX:{}, bone_list:get_bone_list(_SFX) }
}

var bone_list = Object.assign({}, motion_data.bone_list)

if (model_para.SFX) {
  Object.assign(bone_list, get_bone_list(model_para.SFX))
  _SFX = _SFX.concat(model_para.SFX)
}

if (model_para._SFX_one_time) {
  Object.assign(bone_list, get_bone_list(model_para._SFX_one_time))
  _SFX = _SFX.concat(model_para._SFX_one_time)
}

var bone_data = {}
Object.keys(bone_list).forEach((bone_name) => {
  bone_data[bone_name] = {}
});

const modelX = MMD_SA.THREEX.get_model(mesh._model_index);
const mesh_m4 = modelX.mesh.matrixWorld;//TEMP_m4.makeRotationFromQuaternion(mesh.quaternion).setPosition(mesh.position);//
for (let bone_name in bone_list) {
  const b = bone_list[bone_name]
  if (b.pos) {
    bone_data[bone_name].pos = modelX.get_bone_position_by_MMD_name(bone_name, true) || modelX.get_bone_position_by_MMD_name('上半身', true);//MMD_SA.get_bone_position(mesh, bone_name, mesh);//
//    if (mesh._bone_to_position_last) bone_data[bone_name].pos.sub(mesh._bone_to_position_last.bone_pos_offset);
// ignore scale
    bone_data[bone_name].pos.applyQuaternion(modelX.mesh.quaternion).add(modelX.mesh.position);//applyMatrix4(mesh_m4)
  }
  if (b.rot)
    bone_data[bone_name].rot = modelX.get_bone_rotation_by_MMD_name(bone_name);//MMD_SA.get_bone_rotation(mesh, bone_name);//
}

_SFX.forEach((SFX, idx) => {
  if (SFX.frame_range) {
    if ((f < SFX.frame_range[0]) || (f > SFX.frame_range[1]))
      return
  }

  var SFX_id = SFX.id||idx
  var motion_SFX = motion_data.SFX[SFX_id]
  if (!motion_SFX)
    motion_SFX = motion_data.SFX[SFX_id] = { sprite:[] }

  if (SFX.camera_shake && (motion_SFX._loop_timestamp != skin._loop_timestamp)) {
    MMD_SA.CameraShake.shake(SFX.camera_shake.id, SFX.camera_shake.magnitude, SFX.camera_shake.duration, SFX.camera_shake.graph);
  }

  if (SFX.sprite||SFX.VFX) {
    (SFX.sprite||[]).concat(SFX.VFX||[]).forEach((sprite, s_idx) => {
//      var is_sprite = SFX.sprite && (s_idx < SFX.sprite.length);

      var md = motion_SFX.sprite[s_idx]
      if (!md)
        md = motion_SFX.sprite[s_idx] = {_f:f, _loop_timestamp:null}

      var para = {
  name:sprite.name,
  speed:sprite.speed||1,
  scale:sprite.scale||1,
  loop: sprite.sticky && (sprite.loop !== false),

  depth:sprite.depth,

  pos_target:sprite.pos_target,

  onloop: sprite.onloop || SFX.onloop,
// not considering looping as motion end (i.e. _loop_timestamp==skin._loop_timestamp), for now at least
  onmotionended: (sprite.sticky) ? { model_index:model._model_index, motion_index:skin._motion_index, _loop_timestamp:/*md._loop_timestamp||*/skin._loop_timestamp } : null,

  custom: sprite.custom,
      };

      var sprite_list = []
      if (sprite.instance_per_frame) {
        let f_ini = md._f
        let f_delta = f - f_ini
        if (md._loop_timestamp != skin._loop_timestamp) {
          f_ini = f
          f_delta = 0
        }
        else if (SFX.frame_range && (md._f < SFX.frame_range[0])) {
          f_ini = SFX.frame_range[0]
        }

        let f_step = 1/sprite.instance_per_frame
        for (let i = 1; f_ini + (i+0.2)*f_step < f; i++) {
          let para_clone = Object.assign({}, para)
          para_clone.lerp = 1 - (f - f_ini+i*f_step) / f_delta
          sprite_list.push(para_clone)
//DEBUG_show(i,0,1)
        }
        sprite_list.push(para)
      }
      else {
        if (md._loop_timestamp == skin._loop_timestamp) {
          if (!sprite.sticky)
            return
        }

        sprite_list.push(para)
      }

      sprite_list.forEach((para, instance) => {
        if (sprite.sticky)
          para.id = [mesh._model_index, skin._motion_index, SFX_id, s_idx, instance].join("_")//, skin._loop_timestamp].join("_")

        if (sprite.bone_ref) {
          let b = bone_data[sprite.bone_ref]
          para.pos = (para.lerp) ? b.pos.clone().lerp(data.bone[sprite.bone_ref].pos, para.lerp) : b.pos

          if (sprite.pos_offset)
            para.pos.add((sprite.pos_offset_rotated) ? sprite.pos_offset.clone().applyQuaternion((para.lerp) ? b.rot.clone().slerp(data.bone[sprite.bone_ref].rot, para.lerp) : b.rot) : sprite.pos_offset)
        }
        else {
          para.pos = sprite.pos||new THREE.Vector3()
        }

        if (para.pos_target) {
          if (para.pos_target.mesh == "model")
            para.pos_target.mesh = mesh
        }

        MMD_SA.Sprite.animate(para.name, para)
      });

      md._f = f
      md._loop_timestamp = skin._loop_timestamp
    });
  }

  motion_SFX._loop_timestamp = skin._loop_timestamp;
});

Object.assign(data.bone, bone_data);

model_para._SFX_one_time = null;
  });
};
      })());

      window.addEventListener("SA_MMD_after_updateMotion", function () {
if (MMD_SA_options.Dungeon) {
  sprite_obj_list.forEach(function (ss) {
    if (ss.para.id && /^pointer_/.test(ss.para.id))
      ss.sprite.visible = false
  });

  let list = MMD_SA_options.Dungeon.check_mouse_on_object()
  if (list) {
    list.forEach(obj_clickable => {
      var obj = obj_clickable.obj
      var id = "pointer_" + obj.id
      MMD_SA.Sprite.animate("pointer_blue_01", {
        id: id,
        loop: 1,
        pos: obj_clickable.pos,
      });
    });
  }
}

/*
MMD_SA_options.Dungeon.sprite.animate("pointer_blue_01", {
  id: "PC",
  loop: 1,
  pos_target: {
    mesh: THREE.MMD.getModels()[0].mesh,
    offset: {x:0, y:20, z:0},
  },
});
*/

sprite_obj_list.concat(VFX.obj_list).forEach(function (ss, idx) {
  var sprite = ss.sprite
  if (!sprite.visible)
    return

  var para = ss.para

  if (para.onmotionended) {
    let skin = THREE.MMD.getModels()[para.onmotionended.model_index].skin
    if ((skin._motion_index != para.onmotionended.motion_index) || (skin._loop_timestamp != para.onmotionended._loop_timestamp)) {
//if (idx >= sprite_obj_list.length) DEBUG_show([RAF_timestamp].join(','))
      sprite.visible = false
      return
    }
  }

  var pos_target = para.pos_target
  if (pos_target) {
    if (pos_target.mesh) {
      if (!pos_target.mesh.visible) {
        sprite.visible = false
        return
      }
      sprite.position.copy(pos_target.mesh.position)
      if (pos_target.offset)
        sprite.position.add(pos_target.offset)
//if (idx >= sprite_obj_list.length) sprite.quaternion.copy(pos_target.mesh.quaternion)
//DEBUG_show(VFX.obj_list.map((o)=>o.sprite.visible).join(',')+'/'+RAF_timestamp)
    }
    para._pos.copy(sprite.position)
  }

  if (para.depth > 0) {
    sprite.position.copy(para._pos).add(MMD_SA.TEMP_v3.copy(MMD_SA._trackball_camera.object.position).sub(para._pos).normalize().multiplyScalar(para.depth))
  }

  if (ss.animator) {
    ss.animator.update(RAF_timestamp_delta)
  }
  else {
    if (ss.texture_obj.update(para.get_value && para.get_value()))
      sprite.material.map.needsUpdate = true
  }
});
      });
    });


// VFX START
  var VFX = (function () {
    var obj_list = {};

    return {
      FX: (function () {
        function FX(fx, mesh, para) {
this.FX = fx
this.sprite = mesh
this.para = para

this.animator = new Animator(this)
        }

        function Animator(obj) {
this.parent = obj
        }

        Animator.prototype.reset = function () {
function reset_material(obj) {
  if (obj.children) {
    obj.children.forEach((c) => {
      reset_material(c)
    });
  }
  if (obj.material) {
    obj.material.opacity = 1
  }
}

this.animation_data = { time:0 }

reset_material(this.parent.sprite)
        };

        Animator.prototype.update = function (ms) {
this.parent.FX.animate(this.parent, ms, this.animation_data)
        };

        return function (obj_name, init, _init_3D, _create, animate) {
this.obj_name = obj_name

if (!obj_list[obj_name])
  obj_list[obj_name] = []

this.obj_list = obj_list[obj_name]

this.init = init;

this.init_3D = (function () {
  var initialized = false;
  return function () {
    if (initialized) return
    initialized = true

    _init_3D.call(this)
  };
})();

this.create = function (para) {
  this.init_3D()

  var mesh = _create.call(this, para)

  if (!MMD_SA.THREEX.enabled) mesh.useQuaternion = true;

  MMD_SA.THREEX.scene.add(mesh)

  var obj = new FX(this, mesh, para);
  this.obj_list.push(obj)
//DEBUG_show(this.obj_list.length,0,1)
  return obj
};

this.animate = animate;
        };
      })(),

      init: function () {
var txr_preload_list = {}

for (let name in this.list) {
  let fx = this.list[name]
  fx.init()

  if (fx.txr_preload_list)
    Object.assign(txr_preload_list, fx.txr_preload_list)
}

window.addEventListener('jThree_ready', ()=>{
  for (let name in txr_preload_list) {
    let ss = txr_preload_list[name]
    MMD_SA.THREEX.mesh_obj.set(name, MMD_SA.load_texture(ss.url), true);
  }
});
      },

      animate: function (name, para) {
var fx = VFX.list[name]
var obj_list = fx.obj_list

var obj_free = (para.id && obj_list.find(obj => (obj.para.id == para.id))) || obj_list.find(obj => !obj.sprite.visible);

var obj_needs_reset
if (!obj_free) {
  obj_free = fx.create(para)
  obj_needs_reset = true
}
else {
  obj_needs_reset = !obj_free.sprite.visible
}

obj_free.para = para

obj_free.sprite.visible = true

if (para.pos)
  obj_free.sprite.position.copy(para.pos)
para._pos = (para._pos || new THREE.Vector3()).copy(obj_free.sprite.position)

if (obj_needs_reset) {
  obj_free.animator.reset()
}

return obj_free;
      },

      get obj_list() {
var _obj_list = []
for (let name in obj_list) {
  _obj_list = _obj_list.concat(obj_list[name])
}

return _obj_list
      },
    };
  })();

  VFX.list = (function () {
    return {
      "aura01": new VFX.FX(
        "aura01",
// init
        function () {
this.txr_preload_list = {
  "aura01_TXR": { url:System.Gadget.path + '/images/sprite_sheet.zip#/texture/shockwave' + ((webkit_transparent_mode) ? '-transparent' : '') + '_min.png' },
};
        },
// init_3D
        function () {
const THREE = MMD_SA.THREEX.THREE;

// THREE.CylinderGeometry = function ( radiusTop, radiusBottom, height, radiusSegments, heightSegments, openEnded )
this.geo = new THREE.CylinderGeometry( 15, 10, 5, 8*2, 1, true );
this.geo.applyMatrix(new THREE.Matrix4().setPosition(new THREE.Vector3().set(0, 2.5, 0)));
/*
this.geo.faceVertexUvs[ 0 ].forEach((v) => {
  v.forEach((uv) => {
    uv.x *= 80
  });
});
*/
this.tex = MMD_SA.THREEX.mesh_obj.get_three("aura01_TXR");
this.tex_repeat_x = 4
        },
// create
        function () {
const THREE = MMD_SA.THREEX.THREE;

var tex = this.tex.clone()
tex.repeat.x = this.tex_repeat_x
tex.wrapS = THREE.RepeatWrapping;
//tex.wrapT =
tex.needsUpdate = true

var mesh = new THREE.Mesh(this.geo, new THREE.MeshBasicMaterial({
  map:tex,
  blending: (webkit_transparent_mode) ? THREE.NormalBlending : THREE.AdditiveBlending,
//  side:/*THREE.BackSide*/THREE.DoubleSide,
  transparent:true,
}));

if (!MMD_SA.THREEX.enabled) mesh.useQuaternion = true;

//console.log(mesh)
//return mesh

mesh.material.side = THREE.BackSide
var mesh2 = new THREE.Mesh(this.geo, new THREE.MeshBasicMaterial({
  map:tex,
  blending: (webkit_transparent_mode) ? THREE.NormalBlending : THREE.AdditiveBlending,
//  side:/*THREE.BackSide*/THREE.DoubleSide,
  transparent:true,
}));

if (!MMD_SA.THREEX.enabled) mesh2.useQuaternion = true;

mesh2.scale.set(1.001,1,1.001);

Object.defineProperty(mesh, "visible", (function () {
  var visible = mesh.visible;
  return {
    get: function () {
      return visible && this.parent.visible;
    },
    set: function (v) { visible = v; },
  };
})());

Object.defineProperty(mesh2, "visible", (function () {
  var visible = mesh2.visible;
  return {
    get: function () {
      return visible && this.parent.visible;
    },
    set: function (v) { visible = v; },
  };
})());

var obj = new THREE.Object3D();

if (!MMD_SA.THREEX.enabled) obj.useQuaternion = true;

obj.add(mesh);
obj.add(mesh2);
return obj;
        },
// animate
        function (obj, ms, data) {
//DEBUG_show(ms)

if (!data.mod) {
  data.mod = 1
  data.uv_y = 0.5
  data.uv_y_limit = 1
}

data.time += ms

data.uv_y += ms/1000 *2 * data.mod
var condition = (data.mod > 0) ? (data.uv_y >= data.uv_y_limit) : (data.uv_y <= data.uv_y_limit);
if (condition) {
  data.uv_y = data.uv_y_limit
  data.mod = -data.mod
  data.uv_y_limit = (data.mod > 0) ? 1 - Math.random()*0.1 : 0.4 + Math.random()*0.1;
}

var tex = obj.sprite.children[0].material.map
tex.repeat.set(this.tex_repeat_x, 1/data.uv_y)
//tex.offset.set(0,(1-data.uv_y))

obj.sprite.quaternion.setFromEuler(MMD_SA.TEMP_v3.set(0, (data.time/1000*0.5)%1, 0).multiplyScalar(Math.PI*2))
        },
      ),

      "aura_ring01": new VFX.FX(
        "aura_ring01",
// init
        function () {
this.txr_preload_list = {
  "aura01_TXR": { url:System.Gadget.path + '/images/sprite_sheet.zip#/texture/shockwave' + ((webkit_transparent_mode) ? '-transparent' : '') + '_min.png' },
};
        },
// init_3D
        function () {
const THREE = MMD_SA.THREEX.THREE;

// THREE.RingGeometry = function ( innerRadius, outerRadius, thetaSegments, phiSegments, thetaStart, thetaLength )
this.geo = new THREE.RingGeometry( 5, 10, 8*2, 1 );
this.geo.applyMatrix(new THREE.Matrix4().makeRotationFromEuler(new THREE.Vector3().set(-Math.PI/2, 0, 0)));

this.tex = MMD_SA.THREEX.mesh_obj.get_three("aura01_TXR");
this.tex_repeat_x = 8
        },
// create
        function () {
var tex = this.tex.clone()
tex.repeat.x = this.tex_repeat_x
tex.wrapS = THREE.RepeatWrapping;
//tex.wrapT = 
tex.needsUpdate = true

var mesh = new THREE.Mesh(this.geo, new THREE.MeshBasicMaterial({
  map:tex,
  blending: (webkit_transparent_mode) ? THREE.NormalBlending : THREE.AdditiveBlending,
//  side:THREE.BackSide,//THREE.DoubleSide,
  transparent:true,
}));

if (!MMD_SA.THREEX.enabled) mesh.useQuaternion = true;

//console.log(mesh)
return mesh
        },
// animate
        function (obj, ms, data) {
//DEBUG_show(ms)

if (!data.duration) {
  let p = obj.para.custom || {}
  data.duration = p.duration || 1000*10
  data.scale_min = p.scale_min || 1
  data.scale_max = p.scale_max || 30
//DEBUG_show(data.duration,0,1)
}

data.time += ms
//return

var t = (data.duration - data.time) / data.duration
if (t <= 0) {
  obj.sprite.visible = false
  return
}

var scale = data.scale_min + (1-t)*(data.scale_max-data.scale_min)
obj.sprite.scale.set(scale,scale,scale)

var opacity = 0.25 + Math.pow(t, 0.5)*0.75
var material = obj.sprite.material
material.opacity = opacity

var tex = material.map
tex.repeat.set(this.tex_repeat_x, 1)
//tex.offset.set(0,(1-data.uv_y))
        },
      ),
    };
  })();

  VFX.init();
// VFX END


    return {
  animate: function (name, para) {
var ss = sprite_sheet_by_name[name]
if (!ss) {
  VFX.animate(name, para)
  return
}

const THREE = MMD_SA.THREEX.THREE;

var texture = MMD_SA.THREEX.mesh_obj.get_three(ss.filename + "_TXR");
if (ss.texture_variant) {
  let variant = ss_texture_by_filename[ss.filename].variant
  if (variant[ss.texture_variant.id]) {
    texture = variant[ss.texture_variant.id]
  }
  else {
    let tex = texture.clone()

    let canvas = document.createElement("canvas")
    canvas.width  = tex.image.width
    canvas.height = tex.image.height
    let ctx = canvas.getContext("2d")
    ctx.drawImage(tex.image,0,0)
    let imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
    let pixels = imgData.data;
    ss.texture_variant.pixel_transform(pixels)
    ctx.putImageData(imgData, 0, 0);

    tex.image = canvas
    tex.needsUpdate = true
    texture = variant[ss.texture_variant.id] = tex
//console.log(texture, tex)
  }
/*
texture_variant: {
  id: "BW",
  pixel_transform: function (pixels) {
*/
}

var obj_free = (para.id && sprite_obj_list.find(obj => (obj.para.id == para.id))) || sprite_obj_list.find(obj => !obj.sprite.visible);

var obj_needs_reset
if (!obj_free) {
  obj_free = create_sprite_obj(texture)
  obj_needs_reset = true
}
else {
  obj_needs_reset = !obj_free.sprite.visible
}

obj_free.para = para
// clear it, just in case it was a HP bar or something that didn't animate
obj_free.texture_obj = null

if (ss.blending) {
  if ((ss.blending == 'additive') && MMD_SA.THREEX.enabled) {
// https://threejs.org/docs/index.html#api/en/constants/CustomBlendingEquations
    obj_free.sprite.material.blending = THREE.CustomBlending;
    obj_free.sprite.material.blendEquation = THREE.MaxEquation;
//obj_free.sprite.material.blendSrc = THREE.SrcAlphaFactor;
//obj_free.sprite.material.blendDst = THREE.OneMinusSrcAlphaFactor;
  }
  else {
    obj_free.sprite.material.blending = THREE[ss.blending.charAt(0).toUpperCase() + ss.blending.substring(1).toLowerCase() + 'Blending'];
  }
}
else {
  obj_free.sprite.material.blending = THREE.NormalBlending;
}

obj_free.sprite.material.depthTest = (para.depth != null)
obj_free.sprite.material.map = texture

if (para.pos)
  obj_free.sprite.position.copy(para.pos)
para._pos = (para._pos || new THREE.Vector3()).copy(obj_free.sprite.position)

var scale = ss.scale * (para.scale || 1)
obj_free.sprite.scale.set(scale,scale, 1);

if (obj_needs_reset) {
  if (!obj_free.animator)
    obj_free.animator = new SpriteAnimator(obj_free)
  obj_free.animator.reset(ss)
}
obj_free.animator.tileDisplayDuration = para.frame_interval || (ss.frame_interval / (obj_free.animator.speed || para.speed || 1));

return obj_free
  }

 ,display: function (texture_obj, para) {
const use_THREEX = MMD_SA.THREEX.enabled;
const THREE = MMD_SA.THREEX.THREE;

texture_obj = Texture_Object(texture_obj)
var texture = texture_obj.texture

var obj_free = sprite_obj_list.find(function (obj) {
  return !obj.sprite.visible;
});

if (!obj_free) {
  obj_free = create_sprite_obj(texture)
}

obj_free.para = para
obj_free.animator = null

obj_free.texture_obj = texture_obj
texture_obj.obj_parent = obj_free
texture_obj.init()
texture_obj.update()

obj_free.sprite.material.blending = (para.blending) ? THREE[ss.blending.charAt(0).toUpperCase() + ss.blending.substring(1).toLowerCase() + 'Blending'] : THREE.NormalBlending
obj_free.sprite.material.depthTest = false
obj_free.sprite.material.map = texture
if (use_THREEX) {
  texture.repeat.set(1,1)
  texture.offset.set(0,0)
}
else {
  obj_free.sprite.material.uvScale.set(1,1)
  obj_free.sprite.material.uvOffset.set(0,0)
}

if (para.pos)
  obj_free.sprite.position.copy(para.pos)
para._pos = obj_free.sprite.position.clone()

obj_free.sprite.rotation = 0

obj_free.sprite.visible = true
  }

 ,get_obj_by_id: function (id) {
return sprite_obj_list.find(function (obj) { return obj.texture_obj && (obj.texture_obj.id == id); });
  }

 ,TextureObject_HP_bar:TextureObject_HP_bar
    };
  })();


MMD_SA.CameraShake = (function () {

  var CS_offset_pos;
  window.addEventListener("jThree_ready", (e) => {
    CS_offset_pos = new THREE.Vector3()
  });

  var CS_offset_angle = 0
  var CS_frame_interval = 1000/30
  var CS_frame_time = CS_frame_interval

  var CS = function (id, magnitude, duration, graph={}) {
    this.id = id
    this.magnitude = magnitude
    this.duration = duration

    graph.decay_power = graph.decay_power||2
    this.graph = graph

    this.time = 0
  };

  var CS_list = []

  window.addEventListener("MMDStarted", (e) => {
//MMD_SA.CameraShake.shake("", 0.1, 3*1000, 0)

    window.addEventListener("SA_MMD_before_render", (e) => {
var CS_magnitude = 0
CS_list = CS_list.filter((cs) => {
  if (cs.started) {
    cs.time += RAF_timestamp_delta
    if (cs.time > cs.duration)
      return false
  }
  cs.started = true

  var magnitude = cs.magnitude
  if (cs.graph.func) {
    magnitude *= cs.graph.func(cs)
  }
  else {
    let t = (cs.duration - cs.time) / cs.duration
    if (cs.graph.reversed)
      t = 1-t
    magnitude *= Math.pow(t, cs.graph.decay_power)
  }
  if (CS_magnitude < magnitude)
    CS_magnitude = magnitude

  return true
});

if (CS_magnitude) {
  CS_frame_time += RAF_timestamp_delta
  if (CS_frame_time > CS_frame_interval) {
    CS_frame_time = CS_frame_time % CS_frame_interval
    CS_offset_angle = (CS_offset_angle + Math.PI/2 + Math.random() * Math.PI) % (Math.PI*2)
    CS_offset_pos.set(Math.cos(CS_offset_angle), Math.sin(CS_offset_angle), 0).multiplyScalar(CS_magnitude).applyQuaternion(MMD_SA._trackball_camera.object.quaternion)
  }
  MMD_SA._trackball_camera.object.position.add(CS_offset_pos)
}
else {
  CS_offset_pos.set(0,0,0)
  CS_offset_angle = 0
  CS_frame_time = CS_frame_interval
}
    });

    window.addEventListener("SA_MMD_after_render", (e) => {
MMD_SA._trackball_camera.object.position.sub(CS_offset_pos);
    });
  });

  return {
    shake: function (id, magnitude, duration, graph) {
var cs = new CS(id, magnitude, duration, graph)

if (cs.id) {
  let index = CS_list.findIndex((_cs)=>(cs.id==_cs.id))
  if (index != -1)
    CS_list[index] = cs
}
else
  CS_list.push(cs)
    },
  };

})();


MMD_SA.THREEX = (function () {

  function init() {
data.scene = new THREE.Scene();
data.renderer = new THREE.WebGLRenderer({
  canvas: SLX,
  alpha: true,
  antialias: true,
  stencil: false,
  preserveDrawingBuffer: true
});

//data.renderer.outputColorSpace = THREE.SRGBColorSpace;//LinearSRGBColorSpace;//

data.renderer.setPixelRatio(window.devicePixelRatio);

GLTF_loader = new THREE.GLTFLoader();

if (MMD_SA_options.use_shadowMap) {
  data.renderer.shadowMap.enabled = true;
  data.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
}

if (THREE.OutlineEffect) {
  data.OutlineEffect = new THREE.OutlineEffect( data.renderer, {
defaultThickness: 0.001,
defaultColor: [ 0.25, 0.25, 0.25 ],
defaultAlpha: 0.5,
//defaultKeepAlive: true // keeps outline material in cache even if material is removed from scene
  });
}

init_common();

window.addEventListener("MMDStarted", ()=>{
  init_on_MMDStarted();
});

if (1) {
  MMD_SA.init_my_model(System.Gadget.path + '/jThree/model/DUMMY.zip', 'DUMMY_v01.pmx')
}

if (MMD_SA_options.THREEX_options.use_MMD) {
  MMD.init()
//F:\\MMD\\models\\Tda式初音ミク・アペンドVer1.00\\Tda式初音ミク・アペンド_Ver1.00.pmx
//F:\\MMD\\models\\--\\H35\\H35a11_v05.pmx
//F:\\MMD\\models\\YYB Hatsune Miku_NT\\YYB Hatsune Miku_NT_1.0ver.pmx
//F:\\MMD\\stages\\体育館\\体育館.pmx
  MMD.load((/\.pmx$/i.test(MMD_SA_options.THREEX_options.model_path) && MMD_SA_options.THREEX_options.model_path)||'F:\\MMD\\models\\--\\H35\\H35a11_v05.pmx', {
    pmx_index: 0,

    get_parent: function () {
      if (!MMD_SA.MMD_started) return null

      this.parent_data = _THREE.MMD.getModels()[0]
      return this.parent_data.mesh;
    },

    update: function () {}
  });
}
else {
  VRM.init()

  VRM.load(MMD_SA_options.THREEX_options.model_path, {
    vrm_index: 0,

    get_parent: function () {
      if (!MMD_SA.MMD_started) return null

      this.parent_data = _THREE.MMD.getModels()[0]
      return this.parent_data.mesh;
    },

    update: function () {}
  });
}
  }

  const init_common = (function () {
    var initialized;
    return function () {
if (initialized) return;
initialized = true;

const THREE = MMD_SA.THREEX.THREEX;

v1 = new THREE.Vector3();
v2 = new THREE.Vector3();
v3 = new THREE.Vector3();
v4 = new THREE.Vector3();

q1 = new THREE.Quaternion();
q2 = new THREE.Quaternion();
q3 = new THREE.Quaternion();
q4 = new THREE.Quaternion();

e1 = new THREE.Euler();
e2 = new THREE.Euler();
e3 = new THREE.Euler();
e4 = new THREE.Euler();

m1 = new THREE.Matrix4();
m2 = new THREE.Matrix4();
m3 = new THREE.Matrix4();
m4 = new THREE.Matrix4();

p1 = new THREE.Plane();
l1 = new THREE.Line3();

// 37.4224, 35
rot_arm_axis[ 1] = new THREE.Quaternion().setFromEuler(e1.set(0,0,37.4224/180*Math.PI));
rot_arm_axis[-1] = rot_arm_axis[ 1].clone().conjugate();

// 14.3594, 12.5
const shoulder_mod = (threeX.enabled) ? 0.5 : 1;
// convert_T_pose_rotation_to_A_pose
rot_shoulder_axis[0] = {};
rot_shoulder_axis[0][ 1] = new THREE.Quaternion().setFromEuler(e1.set(0,0,12.5*shoulder_mod/180*Math.PI));
rot_shoulder_axis[0][-1] = rot_shoulder_axis[0][ 1].clone().conjugate();
// convert_A_pose_rotation_to_T_pose
if (!rot_shoulder_axis[1]) {
  rot_shoulder_axis[1] = {};
  rot_shoulder_axis[1][ 1] = new THREE.Quaternion().setFromEuler(e1.set(0,0,12.5*shoulder_mod/180*Math.PI));
  rot_shoulder_axis[1][-1] = rot_shoulder_axis[1][ 1].clone().conjugate();
}
    };
  })();

  const init_on_MMDStarted = (function () {
    var initialized;
    return function () {
if (initialized) return;
initialized = true;

const THREE = MMD_SA.THREEX.THREEX;

_THREE.MMD.getModels().forEach((model,i)=>{
  var bones_by_name = model.mesh.bones_by_name
  var model_para = MMD_SA_options.model_para_obj_all[i]

  model_para._hip_pos = v1.fromArray(bones_by_name['上半身'].pmxBone.origin).add(v2.fromArray(bones_by_name['下半身'].pmxBone.origin)).multiplyScalar(0.5).toArray();
  model_para._hip_offset = {};
  model_para._hip_offset['センター'] = v1.fromArray(model_para._hip_pos).sub(v2.fromArray(bones_by_name['センター'].pmxBone.origin)).toArray();
  model_para._hip_offset['グルーブ'] = v1.fromArray(model_para._hip_pos).sub(v2.fromArray(bones_by_name['グルーブ'].pmxBone.origin)).toArray();
  model_para._hip_offset['腰'] = v1.fromArray(model_para._hip_pos).sub(v2.fromArray(bones_by_name['腰'].pmxBone.origin)).toArray();
});
    };
  })();

  const Model_obj = (function () {
    class Animation {
      #_enabled = false;

      #_mixer;

      clips = [];
      actions = [];

      get enabled() {
return this.#_enabled;
      }

      set enabled(v) {
this.#_enabled = !!v;

const THREE = MMD_SA.THREEX.THREE;

if (v) {
  this._motion_index = _THREE.MMD.getModels()[this.model.index].skin._motion_index;
  this.play();

  System._browser.on_animation_update.add(()=>{MMD_SA.motion_player_control.enabled = true;}, 0,1);
}
else {
  this.stop();
}
      }

      get mixer() {
const THREE = MMD_SA.THREEX.THREE;

if (!this.#_mixer) {
  this.#_mixer = new THREE.AnimationMixer(this.model.mesh);
}
return this.#_mixer;
      }

      get has_clip() { return this.clips.length; }

      get action() { return this.actions[this.action_index]; }

      get motion_index() {
return (this.enabled) ? this.action_index : _THREE.MMD.getModels()[this.model.index].skin._motion_index;
      }

      get time() {
return (this.enabled) ? this.action.time : _THREE.MMD.getModels()[this.model.index].skin.time;
      }

      get duration() {
return (this.enabled) ? this.action.getClip().duration : _THREE.MMD.getModels()[this.model.index].skin.duration;
      }

      add_clip(clip)  {
this.stop();

const action = this.mixer.clipAction( clip );
if (this.actions.indexOf(action) == -1) {
  this.action_index = this.actions.length;
  this.actions.push(action);
}
if (this.clips.indexOf(clip) == -1) this.clips.push(clip);

this.play();
      }

      action_index = -1;
      find_action_index(name) {
//this.mixer.existingAction(name)
return this.actions.findIndex(action=>action._clip.name==name);
      }

      play(index = this.action_index) {
if (index > -1) {
  this.action_index = index;
  this.actions[index].paused = false;
  this.actions[index].play();
}
      }

      pause(index = this.action_index) {
//  this.actions.forEach(action=>{ action.play(); });
if (index > -1) {
  this.action_index = index;
  this.actions[index].paused = true;
}
      }

      stop(index = this.action_index) {
if (index > -1) {
  this.actions[index].stop();
}
else {
  this.mixer.stopAllAction();
}
      }

      clear() {
var mixer = this.mixer;

mixer.stopAllAction();
this.action_index = -1;
this.clips.forEach(clip=>{ mixer.uncacheClip(clip); });
this.clips = [];
this.actions = [];
      }

      constructor(model) {
this.model = model;
      }
    }

    return function (index, model, para) {
this.index = this.index_default = index;

if (model)
  this.model = model;
if (para)
  this.para = para;

this.animation = new Animation(this);

/*
 define the following properties on each inherited class
.mesh
.is_T_pose
.use_tongue_out
.get_bone_by_MMD_name()
.update_model()
*/

models[index] = this
    };
  })();

  const MMD_dummy_obj = function (index) {
Model_obj.call(this, index);
  };

// three-vrm 1.0
  const use_VRM1 = !MMD_SA_options.THREEX_options || (MMD_SA_options.THREEX_options.use_VRM1 !== false);

  var GLTF_loader;

  Model_obj.prototype = {
    constructor: Model_obj,

    get model_scale() {
return this.mesh.scale.y;
    },

    get model_para() {
if (!threeX.enabled) return MMD_SA_options.model_para_obj_all[this.index];

return MMD_SA_options.THREEX_options.model_para[this.model_path.replace(/^.+[\/\\]/, '')] || {};
    },

    get model_path() {
if (!threeX.enabled) {
  return decodeURIComponent((MMD_SA.MMD_started) ? this.model.pmx.url : ((this.index == 0) ? MMD_SA_options.model_path : MMD_SA_options.model_path_extra[this.index-1]));
}

return decodeURIComponent((MMD_SA.MMD_started) ? this.para.url : ((this.index == 0) ? MMD_SA_options.THREEX_options.model_path : MMD_SA_options.THREEX_options.model_path_extra[this.index-1]));
    },

    para: (()=>{
      const handler = {
        get(obj, prop) {
return MMD_SA_options.model_para_obj[prop];
        },
      };

      return new Proxy({}, handler);
    })(),

    get_bone_origin_by_MMD_name: function (name) {
return (threeX.enabled) ? this.para.pos0[VRM.bone_map_MMD_to_VRM[name]]?.slice().map(v=>v*this.model_scale) : this.get_bone_by_MMD_name(name)?.pmxBone.origin;
    },

    get_bone_position_by_MMD_name: function (name, local_only) {
var bone = this.get_bone_by_MMD_name(name);
if (!bone) return null;

const is_MMD_dummy = (this.type=='MMD_dummy');
const bone_matrix = (is_MMD_dummy) ? bone.skinMatrix : bone.matrixWorld;

const pos = new THREE.Vector3().setFromMatrixPosition(bone_matrix);

if (local_only) {
  if (!is_MMD_dummy)
    pos.sub(this.mesh.position).applyQuaternion(q1.copy(this.mesh.quaternion).conjugate());
}
else {
  if (is_MMD_dummy)
    pos.applyQuaternion(this.mesh.quaternion).add(this.mesh.position);
}

return pos;
    },

    get_bone_rotation_by_MMD_name: (function () {
      var _m1, _q1;
      window.addEventListener('jThree_ready', ()=>{
const THREE = MMD_SA.THREEX.THREE;
_m1 = new THREE.Matrix4();
_q1 = new THREE.Quaternion();
      });

      return function (name, local_only) {
var bone = this.get_bone_by_MMD_name(name);
if (!bone) return null;

const is_MMD_dummy = (this.type=='MMD_dummy');
//if (parent_only) bone = bone.parent;
const bone_matrix = (is_MMD_dummy) ? bone.skinMatrix : bone.matrixWorld;

const rot = new THREE.Quaternion().setFromRotationMatrix(_m1.extractRotation(bone_matrix));
// multiply, instead of premultiply
if (!is_MMD_dummy && !this.is_VRM1) rot.multiply(_q1.set(0,-1,0,0));

if (local_only) {
  if (!is_MMD_dummy)
    rot.premultiply(_q1.copy(this.mesh.quaternion.conjugate()))
}
else {
  if (is_MMD_dummy)
    rot.premultiply(this.mesh.quaternion)
}

return rot;
      };
    })(),

    get_MMD_bone_parent: (function () {
const MMD_bone_tree = { name:'センター', children: [
  { name:'上半身', children: [
    { name:'上半身2', children: [
      { name:'上半身3', children: [
        { name:'首', children: [
          { name:'頭', children: [
            { name:'目', children: [
            ]},
          ]},
        ]},
        { name:'肩', children: [
          { name:'腕', children: [
            { name:'ひじ', children: [
              { name:'手首', children: [
                { name:'親指０', children: [
                  { name:'親指１', children: [
                    { name:'親指２', children: [
                    ]},
                  ]},
                ]},
                { name:'人指１', children: [
                  { name:'人指２', children: [
                    { name:'人指３', children: [
                    ]},
                  ]},
                ]},
                { name:'中指１', children: [
                  { name:'中指２', children: [
                    { name:'中指３', children: [
                    ]},
                  ]},
                ]},
                { name:'薬指１', children: [
                  { name:'薬指２', children: [
                    { name:'薬指３', children: [
                    ]},
                  ]},
                ]},
                { name:'小指１', children: [
                  { name:'小指２', children: [
                    { name:'小指３', children: [
                    ]},
                  ]},
                ]},
              ]},
            ]},
          ]},
        ]},
      ]},
    ]},
  ]},
  { name:'足', children: [
    { name:'ひざ', children: [
      { name:'足首', children: [
        { name:'足先EX', children: [
        ]},
      ]},
    ]},
  ]},
]};

function find_bone(name, tree=MMD_bone_tree, tree_parent) {
  if (name) {
    if (tree.name == name)
      return tree;
  }
  else {
    if (tree_parent)
      tree.parent = tree_parent;
  }

  for (const tree_child of tree.children) {
    const _tree = find_bone(name, tree_child, tree);
    if (_tree)
      return _tree;
  }
}

find_bone();

      return function (name) {
let dir = name.charAt(0);
if (dir == '左' || dir == '右') {
  name = name.substring(1, name.length);
}
else {
  dir = '';
}

let bone_parent = find_bone(name);

const b = this.mesh.bones_by_name;

do {
  bone_parent = bone_parent.parent;
}
while (bone_parent && !b[bone_parent.name] && !b[dir+bone_parent.name]);

// console.log(name, bone_parent && bone_parent.name, bone_parent && (b[bone_parent.name] || b[dir+bone_parent.name]))
return bone_parent && (b[bone_parent.name] || b[dir+bone_parent.name]);
      };
    })(),

    resetPhysics: function () {
if (threeX.enabled) {
//  if (this.type == 'VRM') {}
}
else {
  this.model.resetPhysics();
}
    },

    update_model: function () {}
  };

  MMD_dummy_obj.prototype = Object.create( Model_obj.prototype );

  Object.defineProperties(MMD_dummy_obj.prototype, {
    type: {
      value: 'MMD_dummy'
    },

    is_T_pose: {
      value: false
    },

    use_tongue_out: {
      get: function () { return (MMD_SA_options.model_para_obj.facemesh_morph['ぺろっ']?.name in this.model.pmx.morphs_index_by_name); },
    },

    model: {
      get: function () { return _THREE.MMD.getModels()[this.index]; }
    },

    mesh: {
      get: function () { return this.model.mesh; }
    },

    getBoneNode: {
      get: function () { return this.get_bone_by_MMD_name; }
    },

    get_bone_by_MMD_name: {
      value: function (name) { return this.mesh.bones_by_name[name]; }
    }
  });


// MMD START
  const MMD = (function () {

    function init() {
      if (THREE.MMDAnimationHelper) {
        data.MMDAnimationHelper = new THREE.MMDAnimationHelper();
        data.MMDAnimationHelper_clock = new THREE.Clock();
      }
    }

    function PMX_object(index, pmx, para) {
Model_obj.call(this, index, pmx, para);
this.mesh = pmx;

if (!MMD_SA.MMD_started)
  pmx_list.push(this)
    }

    PMX_object.prototype = Object.create( Model_obj.prototype );

    Object.defineProperties(PMX_object.prototype, {
      type: {
        value: 'PMX'
      },

      is_T_pose: {
        value: false
      },

      getBoneNode: {
        get: function () { return this.get_bone_by_MMD_name; }
      },

      get_bone_by_MMD_name : {
        value: function (name) {
return this.bones_by_name[name];
        }
      },

      update_model: {
        value: function () {
var mesh = this.mesh
//mesh.matrixAutoUpdate = false

// bone START

var mesh_MMD = _THREE.MMD.getModels()[0].mesh
var bones_by_name = mesh_MMD.bones_by_name

mesh.position.copy(mesh_MMD.position);
mesh.quaternion.copy(mesh_MMD.quaternion);

data.MMDAnimationHelper && data.MMDAnimationHelper.update(data.MMDAnimationHelper_clock.getDelta());
        }
      }
    });

    var pmx_list = [];

    return {
      get pmx_list() { return pmx_list; },
      set pmx_list(v) { pmx_list = v; },

      init: init,

      load: async function (url, para) {
MMD_SA.fn.load_length_extra++

var url_raw = url;
var model_filename = url.replace(/^.+[\/\\]/, '')

var object_url;
await new Promise((resolve) => {
  if (!/\.zip\#/i.test(url)) {
    url = toFileProtocol(url)
    resolve()
    return
  }

  System._browser.load_file(url, function(xhr) {
    object_url = url = URL.createObjectURL(xhr.response);
    resolve();
  }, 'blob', true);
});

const loader = new THREE.MMDLoader();

loader.loadWithAnimation(

  // URL of the PMX you want to load
  url,
System.Gadget.path + '/MMD.js/motion/demo/after_school_stride/after_school_stride.vmd',

  function ( mmd ) {
const mesh = mmd.mesh

data.MMDAnimationHelper && data.MMDAnimationHelper.add( mmd.mesh, { animation:mmd.animation, physics:false } );

if (MMD_SA_options.use_shadowMap) {
  mesh.castShadow = true
}

data.scene.add( mesh );
console.log(mesh)

var pmx_obj = new PMX_object(para.pmx_index, mesh, { url:url_raw });

var bones_by_name = {}
mesh.skeleton.bones.forEach(b=>{
  bones_by_name[b.name] = b;
});

pmx_obj.bones_by_name = bones_by_name;

var obj = Object.assign({
  data: pmx_obj,
  obj: mesh,
  get parent() { return this.get_parent(); },

  no_scale: true,
}, para);//, MMD_SA_options.THREEX_options.model_para[model_filename]||{});

obj_list.push(obj)

if (object_url) {
  URL.revokeObjectURL(object_url)
}

MMD_SA.fn.setupUI()

  },

  // called while loading is progressing
  (progress) => {},

  // called when loading has errors
  (error) => console.error(error)

);
      },

    };
  })();
// MMD END


// VRM START
  const VRM = (function () {
    function init() {

// three-vrm 1.0
if (use_VRM1) {
// https://github.com/pixiv/three-vrm/blob/dev/docs/migration-guide-1.0.md
// In VRM1.0, linear workflow is explicitly recommended, as GLTFLoader recommends.
// https://github.com/mrdoob/three.js/wiki/Migration-Guide#151--152
// WebGLRenderer.outputEncoding has been replaced with WebGLRenderer.outputColorSpace with THREE.SRGBColorSpace as the default value.
//  data.renderer.outputEncoding = THREEX.sRGBEncoding;

// https://threejs.org/docs/#manual/en/introduction/Color-management
// r149 => r150
// https://github.com/mrdoob/three.js/wiki/Migration-Guide#r149--r150
//  THREEX.ColorManagement.legacyMode = false;
  THREEX.ColorManagement.enabled = true;

// Install GLTFLoader plugin
  GLTF_loader.register((parser) => {
    return new THREEX.VRMLoaderPlugin(parser);
//    const helperRoot = new THREE.Group(); helperRoot.renderOrder = 10000; data.scene.add(helperRoot); return new THREEX.VRMLoaderPlugin(parser, { helperRoot });
  });

// backward compatibility
// /three-vrm-core/types/humanoid/VRMHumanBoneName.d.ts
  THREE.VRMSchema = VRM.VRMSchema;
}

      window.addEventListener('jThree_ready', ()=>{
rot_parent_upper_body_inv = new THREE.Quaternion();
      });

      window.addEventListener("MMDStarted", ()=>{
//        vrm_list.sort((a,b)=>a.index-b.index);

        vrm_list.forEach(vrm=>{
vrm.boundingBox = threeX.utils.computeBoundingBox(vrm.model.scene);
vrm.boundingBox.min.multiplyScalar(vrm_scale);
vrm.boundingBox.max.multiplyScalar(vrm_scale);

vrm.boundingSphere = vrm.boundingBox.getBoundingSphere(new THREE.Sphere());
if (MMD_SA_options.Dungeon)
  MMD_SA_options.Dungeon.utils.adjust_boundingBox(vrm);

const MMD_geo = _THREE.MMD.getModels()[vrm.index].mesh.geometry;
MMD_geo.boundingBox = new _THREE.Box3().copy(vrm.boundingBox);
MMD_geo.boundingBox_list = [MMD_geo.boundingBox];
MMD_geo.boundingSphere = new _THREE.Sphere().copy(vrm.boundingSphere);

if (MMD_SA_options.Dungeon)
  MMD_SA_options.Dungeon.character.boundingBox = MMD_geo.boundingBox.clone();

//console.log(vrm, MMD_geo)
        });
      });
    }

    function get_MMD_bone_pos(mesh, bone, v) {
return v.fromArray(mesh.geometry.bones[bone._index].pos).negate().add(bone.position);
    }

    function VRM_object(index, vrm, para) {
this.is_VRM1 = (parseInt(vrm.meta.metaVersion) > 0);

var para = Object.assign({ pos0:{}, q0:{}, name_parent0:{} }, para);
var humanBones = vrm.humanoid.humanBones;
var bone_three_to_vrm_name = this.bone_three_to_vrm_name = {};
var bone_vrm_to_three_name = this.bone_vrm_to_three_name = {};
for (const name in humanBones) {
  let bone_array = humanBones[name];
// three-vrm 1.0
  if (!use_VRM1) bone_array = bone_array[0];

  if (!bone_array) continue;

  let bone =  bone_array.node;
  bone_three_to_vrm_name[bone.name] = name;
  bone_vrm_to_three_name[name] = bone.name;
  const pos = v1.set(0,0,0);
  const q = q1.set(0,0,0,1);

  while (bone.type == 'Bone') {
    q.premultiply(bone.quaternion);
// three-vrm 1.0 normalized
//    if (use_VRM1 && this.is_VRM1) q.premultiply(bone.quaternion);
    bone = bone.parent;
  }
  para.q0[name] = para.q0[bone_array.node.name] = q.toArray();

  bone =  bone_array.node;
  while (bone.type == 'Bone') {
    if (para.q0[bone.name]) q2.fromArray(para.q0[bone.name]);
    pos.add(v2.copy(bone.position).applyQuaternion(q2));

    bone = bone.parent;
  }
  para.pos0[name] = this.process_position(pos).toArray();

}

for (const name in humanBones) {
  let bone_array = humanBones[name];
// three-vrm 1.0
  if (!use_VRM1) bone_array = bone_array[0];

  if (!bone_array) continue;

  let bone =  bone_array.node;
  while (bone.type == 'Bone') {
    const name_parent = bone_three_to_vrm_name[bone.parent.name];
    if (!name_parent) {
      bone = bone.parent;
    }
    else {
      para.name_parent0[name] = name_parent;
      break
    }
  }
}

para.shoulder_width = (para.pos0['leftUpperArm'][0] - para.pos0['rightUpperArm'][0]) * vrm_scale;;
para.left_arm_length = v1.fromArray(para.pos0['leftUpperArm']).distanceTo(v2.fromArray(para.pos0['leftHand'])) * vrm_scale;
para.left_leg_length = ((para.pos0['leftUpperLeg'][1] - para.pos0['leftLowerLeg'][1]) + (para.pos0['leftLowerLeg'][1] - para.pos0['leftFoot'][1])) * vrm_scale;
para.spine_length = (para.pos0['neck'][1] - para.pos0['leftUpperLeg'][1]) * vrm_scale;

//para.left_heel_height = para.pos0['leftFoot'][1] * vrm_scale;
para.hip_center = new THREE.Vector3().fromArray(para.pos0['leftUpperLeg']).setX(0).multiplyScalar(vrm_scale);
para.hip_center_offset = new THREE.Vector3().fromArray(para.pos0['hips']).multiplyScalar(vrm_scale).sub(para.hip_center);

para.lower_arm_fixedAxis = {};
for (const d of ['左','右']) {
  const dir = (d=='左') ? 'left' : 'right';
  para.lower_arm_fixedAxis[d] = v1.fromArray(para.pos0[dir+'Hand']).sub(v2.fromArray(para.pos0[dir+'LowerArm'])).normalize().toArray();
}

para.bone_dummy = {};
para.spine_to_hips_ratio = (para.pos0['chest']) ? 0 : 1 - THREE.Math.clamp((para.pos0['neck'][1] - para.pos0['spine'][1]) / (para.pos0['neck'][1] - para.pos0['hips'][1]) * 2, 0,1);

Model_obj.call(this, index, vrm, para);
this.mesh = vrm.scene;

this._joints_settings = [];
vrm.springBoneManager.joints.forEach( e => {
  this._joints_settings.push(Object.assign({}, e.settings));
});

if (!MMD_SA.MMD_started)
  vrm_list.push(this)
    }

    VRM_object.prototype = Object.create( Model_obj.prototype );

    Object.defineProperties(VRM_object.prototype, {
      type: {
        value: 'VRM'
      },

      is_T_pose: {
        value: true
      },

      use_faceBlendshapes: {
        get: function () { return this._use_faceBlendshapes && !this._disable_faceBlendshapes; },
        set: function (v) { this._use_faceBlendshapes=v; },
      },

      use_tongue_out: {
        get: function () { return this.use_faceBlendshapes; },
      },

      bone_map_MMD_to_VRM: {
        get: ()=>{ return bone_map_MMD_to_VRM; }
      },

      get_bone_by_MMD_name : {
        value: function (name) {
name = bone_map_MMD_to_VRM[name];
return (!name) ? null : this.getBoneNode(name);
        }
      },

// three-vrm
      getBoneNode: {
        value: function (name, normalized) {
// three-vrm 1.0 normalized
// AT: in three-vrm v0.6, vrm.humanoid.getBoneNode returns error when the bone of name doesn't exist
return (!use_VRM1) ? (THREE.VRMSchema.HumanoidBoneName[name.charAt(0).toUpperCase()+name.substring(1)] &&  this.model.humanoid.getBoneNode(name)) : ((normalized || ((normalized == null) && this.model.humanoid.autoUpdateHumanBones)) ? this.model.humanoid.getNormalizedBoneNode(name) : this.model.humanoid.getRawBoneNode(name));
        }
      },

      resetPhysics: {
        value: function () {
// three-vrm 1.0 (TEST)
//if (!use_VRM1) return;

if (this.index > 0) return;

const restrict_physics = MMD_SA.motion[_THREE.MMD.getModels()[this.index].skin._motion_index].para_SA.mov_speed;
const settings_default = this._joints_settings;
// Set has no index
let i = 0;
this.model.springBoneManager.joints.forEach( e => {
//  e.settings.dragForce = 1
  e.settings.stiffness = settings_default[i].stiffness * ((restrict_physics) ? 10 : 1) * vrm_scale;
  i++;
});

this.model.springBoneManager.reset();
//this.model.springBoneManager.setInitState();
        }
      },

      build_blendshape_map_name: {
        value: function (map0, map1) {
this._map_to_v = [{}, {}];
for (const name in map0) {
  this._map_to_v[1][map0[name]] = map1[name];
  this._map_to_v[0][map1[name]] = map0[name];
}
        }
      },

      blendshape_map_name: {
        value: function (name, is_VRM1) {
const v = (is_VRM1) ? 1 : 0;
return this._map_to_v[v][name] || name;
        }
      },

      scale: {
        value: function (scale) {
// fix bugs in VRM physics/MToon material outline when the mesh is scaled
const mesh_obj = this.mesh;
if (mesh_obj.scale.x == scale) return;

mesh_obj.scale.set(scale, scale, scale);

const vrm = this.model;
const model_para = this.para;

if (vrm.springBoneManager) {
  if (!use_VRM1) {
    vrm.springBoneManager.setCenter(mesh_obj);
  }
  else {
    if (!model_para._joints)
      model_para._joints = {};
// scale joints
    let i = 0;
    for ( const joint of vrm.springBoneManager.joints ) {
      let j = model_para._joints[i];
      if (!j)
        j = model_para._joints[i] = { settings:{ stiffness:joint.settings.stiffness, hitRadius:joint.settings.hitRadius } };
      i++;

      joint.settings.stiffness = j.settings.stiffness * scale;
      joint.settings.hitRadius = j.settings.hitRadius * scale;
    }

    if (!model_para._colliders)
      model_para._colliders = {};
// scale colliders
    i = 0;
    for ( const collider of vrm.springBoneManager.colliders ) {
      const shape = collider.shape;

      let c = model_para._colliders[i];
      if (!c)
        c = model_para._colliders[i] = { shape:{ radius:shape.radius, tail:shape.tail?.clone() } };
      i++;

      if ( shape instanceof THREE.VRMSpringBoneColliderShapeCapsule ) {
        shape.radius = c.shape.radius * scale;
        shape.tail.copy(c.shape.tail).multiplyScalar( scale );
      } else if ( shape instanceof THREE.VRMSpringBoneColliderShapeSphere ) {
        shape.radius = c.shape.radius * scale;
      }
    }
  }
}

if (!model_para._materials)
  model_para._materials = {};

const _model_para = this.model_para;
vrm.materials.forEach((m,i)=>{
  const outlineWidthFactor = (_model_para?.material_para?.[i] || _model_para?.material_para?.[m.name])?.outlineWidthFactor;
  if (outlineWidthFactor != null) {
    m.outlineWidthFactor = outlineWidthFactor;
  }
  else {
    let _m = model_para._materials[i];
    if (!_m)
      _m = model_para._materials[i] = { outlineWidthFactor:m.outlineWidthFactor };

    if (m.isMToonMaterial && (m.outlineWidthMode != 'screenCoordinates') && m.outlineWidthFactor != null)
      m.outlineWidthFactor = _m.outlineWidthFactor * scale;
  }
});
        }
      },

      process_rotation: (function () {
// three-vrm 1.0 normalized
/*
        var _q;
        window.addEventListener('jThree_ready', ()=>{
const THREE = MMD_SA.THREEX.THREE;
_q = new THREE.Quaternion();
        });
*/
        return {
          value: function (rot, name) {
if (!this.is_VRM1) {
  rot.x *= -1;
  rot.z *= -1;
}
else if (use_VRM1) {
// three-vrm 1.0 normalized
//  rot.premultiply(_q.fromArray(this.para.q0[name]));
}
return rot;
          }
        };
      })(),

      process_position: {
        value: function (pos) {
if (!this.is_VRM1) {
  pos.x *= -1;
  pos.z *= -1;
}
return pos
        }
      },

      update_model: {
        value: function () {
const that = this;

const is_VRM1 = this.is_VRM1; 
const mesh = this.mesh
mesh.matrixAutoUpdate = false

const vrm = this.model
const VRMSchema = THREE.VRMSchema

if (this.animation._motion_index != null) {
  if (this.animation.enabled) {
    if (this.animation._motion_index != _THREE.MMD.getModels()[this.index].skin._motion_index)
      this.animation.enabled = false;
  }
  else {
    if (this.animation._motion_index == _THREE.MMD.getModels()[this.index].skin._motion_index)
      this.animation.enabled = true;
  }
}

const animation_enabled = this.animation.enabled;

// three-vrm 1.0 normalized
vrm.humanoid.autoUpdateHumanBones = use_VRM1 && (this.is_VRM1 || animation_enabled);

if (vrm.humanoid.autoUpdateHumanBones) {
  vrm.humanoid.resetNormalizedPose();
}
else {
  if (use_VRM1) {
    vrm.humanoid.resetRawPose();
  }
  else {
    vrm.humanoid.resetPose();
  }
}

const time_delta = RAF_timestamp_delta/1000;

if (this.reset_pose) {
//  mesh.position.set(0,0,0);
//  mesh.quaternion.set(0,0,0,1);
//  if (!is_VRM1) mesh.quaternion.premultiply(q1.set(0,1,0,0));

  this.scale(1);

  if (MMD_SA.hide_3D_avatar) { vrm._update_core(time_delta) } else
  vrm.update(time_delta);

  if (!mesh.matrixAutoUpdate) {
    mesh.updateMatrix()
    mesh.updateMatrixWorld()
  }
  return;
}
this.scale(vrm_scale);

if (!is_VRM1) mesh.quaternion.multiplyQuaternions(q1.set(0,1,0,0), mesh.quaternion);

if (animation_enabled) {
  this.animation.mixer.update(time_delta);
/*
vrm.update(time_delta);
if (!mesh.matrixAutoUpdate) {
  mesh.updateMatrix()
  mesh.updateMatrixWorld()
}
DEBUG_show(Date.now())
return;
*/
  rot_parent_upper_body_inv.set(0,0,0,1);
  for (const name of ["Hips", "Spine", "Chest", "UpperChest"]) {
    const bone_name = VRMSchema.HumanoidBoneName[name];
    if (!bone_name) continue;

    const bone = this.getBoneNode(bone_name);
    if (!bone) continue;

    rot_parent_upper_body_inv.multiply(bone.quaternion);
  }
  rot_parent_upper_body_inv.conjugate();

// probably need to redo for animation.mixer to support look_at_screen
  if (System._browser.camera.poseNet.enabled) {
    const frames = System._browser.camera.poseNet.frames;
    rot_parent_upper_body_inv.multiply(frames._rot_camera_offset);
// not used yet (needs updates anyways)
    frames.upper_body_rotation_limiter(rot_parent_upper_body_inv);
  }
}

// bone START

var mesh_MMD = _THREE.MMD.getModels()[0].mesh
var bones_by_name = mesh_MMD.bones_by_name
MMD_bone_list.forEach(MMD_name=>{
  let bone = this.get_bone_by_MMD_name(MMD_name);

  let bone_linked, MMD_name_linked;
  if (!bone) {
// special and simplified case for 上半身2, need to be reworked for other missing bone cases
    if (MMD_name == '上半身2') {
      MMD_name_linked = '上半身';
      bone_linked = this.get_bone_by_MMD_name(MMD_name_linked);
      if (!bone_linked) return;

      bone = this.para.bone_dummy[MMD_name];
      if (!bone)
        bone = this.para.bone_dummy[MMD_name] = { quaternion:new THREE.Quaternion() };
    }
    else
      return;
  }

  const bone_MMD = bones_by_name[MMD_name];
  if (!bone_MMD) return;

  const vrm_bone_name = bone_map_MMD_to_VRM[MMD_name];
  q1.copy(bone_MMD.quaternion);
  this.process_rotation(q1, vrm_bone_name);

  if (!animation_enabled || (System._browser.camera.ML_enabled && !is_MMD_bone_motion_skipped.test(MMD_name))) {
    if (animation_enabled && System._browser.camera.poseNet.enabled && is_MMD_bone_motion_mixed.test(MMD_name)) {
      if (this.animation._single_frame && this.animation._single_frame[vrm_bone_name]) bone.quaternion.fromArray(this.animation._single_frame[vrm_bone_name]);
      bone.quaternion.multiply(q1);
    }
    else {
      if (animation_enabled && System._browser.camera.ML_enabled && is_MMD_bone_motion_parent_limited.test(MMD_name)) {
        if (/(left|right)/.test(vrm_bone_name)) {
          if (!System._browser.camera.poseNet.enabled) return;

          const d = RegExp.$1;
          q2.copy(rot_parent_upper_body_inv).conjugate();
          const shoulder_name = VRMSchema.HumanoidBoneName[d.charAt(0).toUpperCase() + d.substring(1) + 'Shoulder'];
          if (shoulder_name) {
            const shoulder = this.getBoneNode(shoulder_name);
            if (shoulder)
              q2.multiply(shoulder.quaternion);
          }
          bone.quaternion.copy(q2.conjugate()).multiply(q1);
        }
        else {
          bone.quaternion.copy(rot_parent_upper_body_inv).multiply(q1);
        }
      }
      else {
        if (!animation_enabled || !System._browser.camera.ML_enabled || System._browser.camera.poseNet.enabled || is_MMD_bone_motion_face.test(MMD_name))
          bone.quaternion.copy(q1);
      }
    }
  }

  if (bone_linked) {
    bone_linked.quaternion.multiply(bone.quaternion);
  }
});

var MMD_model_para = MMD_SA_options.model_para_obj_all[this.index];
var model_scale = 1/vrm_scale * this.para.left_leg_length / MMD_model_para.left_leg_length;

const center_bone_pos = v1.set(0,0,0);
const hips_rot = q1.set(0,0,0,1);

if (!animation_enabled) {
  ['センター', 'グルーブ', '腰'].forEach(hip_name => {
    const hip_bone = bones_by_name[hip_name];
    const hip_bone_pos = get_MMD_bone_pos(mesh_MMD, hip_bone, v4);
    const hip_bone_offset = v2.fromArray(MMD_model_para._hip_offset[hip_name]);
    hip_bone_pos.add(v3.copy(hip_bone_offset).applyQuaternion(hip_bone.quaternion).sub(hip_bone_offset).applyQuaternion(hips_rot));
    center_bone_pos.add(hip_bone_pos);

    hips_rot.multiply(hip_bone.quaternion);
  });
}

if (!animation_enabled) {
  const root_bone = bones_by_name['全ての親'];
  const root_bone_pos = get_MMD_bone_pos(mesh_MMD, root_bone, v2);
  center_bone_pos.add(root_bone_pos).applyQuaternion(root_bone.quaternion);

  center_bone_pos.multiplyScalar(model_scale);
  this.getBoneNode('hips').position.fromArray(this.para.pos0['hips']).add(this.process_position(center_bone_pos));

  hips_rot.premultiply(root_bone.quaternion);
}

if (!animation_enabled) {
  const upper_body_bone = bones_by_name['上半身'];
  const lower_body_bone = bones_by_name['下半身'];

  hips_rot.multiply(lower_body_bone.quaternion);

  const spine_rot = q2.set(0,0,0,1);
  spine_rot.copy(lower_body_bone.quaternion).conjugate();
  spine_rot.multiply(upper_body_bone.quaternion);

  this.getBoneNode('spine').quaternion.copy(this.process_rotation(spine_rot, 'spine'));
}

if (!animation_enabled) {
  this.getBoneNode('hips').quaternion.copy(this.process_rotation(hips_rot, 'hips'));
}
else {
  this.getBoneNode('hips').quaternion.multiply(this.process_rotation(hips_rot, 'hips'));
}

if (this.para.bone_dummy['上半身2'])
  this.getBoneNode('spine').quaternion.multiply(this.para.bone_dummy['上半身2'].quaternion);

if (this.para.spine_to_hips_ratio) {
  const spine_rot = q2.set(0,0,0,1).slerp(this.getBoneNode('spine').quaternion, this.para.spine_to_hips_ratio);
  const spine_rot_inv = q3.copy(spine_rot).conjugate();

  this.getBoneNode('hips').quaternion.multiply(spine_rot);
  this.getBoneNode('leftUpperLeg').quaternion.premultiply(spine_rot_inv);
  this.getBoneNode('rightUpperLeg').quaternion.premultiply(spine_rot_inv);
  this.getBoneNode('spine').quaternion.premultiply(spine_rot_inv);
//DEBUG_show(this.para.spine_to_hips_ratio+'/'+Date.now())
}

if (!animation_enabled || System._browser.camera.poseNet.enabled) {
  ['左','右'].forEach((LR,d)=>{['腕','手'].forEach((b_name,b_i)=>{
    const bone = bones_by_name[LR + b_name + '捩']
    if (!bone) return

    const [axis, angle] = bone.quaternion.toAxisAngle();
    if (angle) {
      const dir = (d == 0) ? 1 : -1;
      const sign = (Math.sign(axis.x) == dir) ? 1 : -1;
      const name = ((dir==1)?'left':'right') + ((b_i==0)?'Upper':'Lower') + 'Arm';
      this.getBoneNode(name).quaternion.multiply(this.process_rotation(q1.setFromAxisAngle(v1.set(dir*sign,0,0), angle), name));
//DEBUG_show(Date.now()+'/'+angle)
    }
  })});
}

// bone END


// morph START

const blendshape_weight = {};

const MMD_morph_weight = mesh_MMD.geometry.morphs_weight_by_name;
this.MMD_morph_list.forEach(name => {
  const w = MMD_morph_weight[name]
  if (w == null) return

  const blendshape_name = this.blendshape_map_by_MMD_name[name]
  blendshape_weight[blendshape_name] = Math.max(blendshape_weight[blendshape_name]||0, w)
});

const name_blink = this.blendshape_map_name('blink', use_VRM1);
const name_blink_l = this.blendshape_map_name('blink_l', use_VRM1);
const name_blink_r = this.blendshape_map_name('blink_r', use_VRM1);

const blink = blendshape_weight[name_blink] || 0;
const blink_factor = 1 - (blendshape_weight[this.blendshape_map_name('fun', use_VRM1)]||0) * 0.25;
blendshape_weight[name_blink_l] = Math.max(blendshape_weight[name_blink_l]||0, blink) * blink_factor;
blendshape_weight[name_blink_r] = Math.max(blendshape_weight[name_blink_r]||0, blink) * blink_factor;
blendshape_weight[name_blink] = 0;

//じと目
if (MMD_morph_weight['じと目']) {
  const w = MMD_morph_weight['じと目'] * (1 - Math.max(blendshape_weight[name_blink_l], blendshape_weight[name_blink_r])) * 0.3;
  blendshape_weight[name_blink] = w;
}

// びっくり
if (MMD_morph_weight['びっくり']) {
  const w = 1 + MMD_morph_weight['びっくり'] * 2;
  blendshape_weight[name_blink_l] = Math.pow(blendshape_weight[name_blink_l], w);
  blendshape_weight[name_blink_r] = Math.pow(blendshape_weight[name_blink_r], w);
  blendshape_weight[name_blink] = Math.pow(blendshape_weight[name_blink], w);
}

// にやり, ω
const mouth_open = Math.max(
  blendshape_weight[this.blendshape_map_name('a', use_VRM1)]||0,
  blendshape_weight[this.blendshape_map_name('i', use_VRM1)]||0,
  blendshape_weight[this.blendshape_map_name('u', use_VRM1)]||0,
  blendshape_weight[this.blendshape_map_name('e', use_VRM1)]||0,
  blendshape_weight[this.blendshape_map_name('o', use_VRM1)]||0
);
[{n:'e', w:MMD_morph_weight['にやり']}, {n:'u', w:MMD_morph_weight['ω']}].forEach(obj => {
  if (!obj.w) return

  const name = this.blendshape_map_name(obj.n, use_VRM1);
  const w = blendshape_weight[name] || 0;
  blendshape_weight[name] = w + (1-w) * obj.w * (mouth_open*0.8 + (1-mouth_open)*0.2);
//System._browser.camera.DEBUG_show(name+','+obj.n+':'+blendshape_weight[name]);
});

// should be safe to reset geometry.morphs_weight_by_name after blendshape update, when MMD is not used
for (const name in MMD_morph_weight) {
  MMD_morph_weight[name] = 0
}

// three-vrm
const expressionManager = (use_VRM1) ? vrm.expressionManager : vrm.blendShapeProxy;

let use_faceBlendshapes;
const facemesh = System._browser.camera.facemesh;
if (this.use_faceBlendshapes && facemesh.enabled) {
  use_faceBlendshapes = facemesh.use_faceBlendshapes && System._browser.camera.initialized;
  if (use_faceBlendshapes) {
    const f = facemesh.frames;

    if (facemesh.auto_blink || !facemesh.eye_tracking) {
      for (const b of [
'EyeBlinkLeft',
'EyeBlinkRight',
])
      {
        if (f.morph[b]) f.morph[b][0].weight = Math.max(f.morph[b][0].weight, blendshape_weight[(b=='EyeBlinkLeft')?name_blink_l:name_blink_r]);
      }
    }

    for (const name in blendshape_weight) {
      if (this.emotion_list.indexOf(name) == -1) {
        blendshape_weight[name] = 0;
      }
    }

    if (facemesh.auto_look_at_camera) {
      for (const b of [
'EyeLookUpLeft',
'EyeLookUpRight',
'EyeLookDownLeft',
'EyeLookDownRight',
'EyeLookInLeft',
'EyeLookInRight',
'EyeLookOutLeft',
'EyeLookOutRight',
])
      {
        if (f.morph[b]) f.morph[b][0].weight = 0;
      }
    }

    facemesh.faceBlendshapes_list.forEach(b=>{
      blendshape_weight[this.faceBlendshapes_map[b]] = (use_faceBlendshapes && f.morph[b]) ? f.morph[b][0].weight : 0;
    });
//this.getBoneNode('leftEye' ).quaternion.set(0,0,0,1);
//this.getBoneNode('rightEye').quaternion.set(0,0,0,1);
//vrm.lookAt.autoUpdate = false;
  }
}

for (const name in blendshape_weight) {
//if (name == name_blink) {DEBUG_show(Date.now())} else
  expressionManager.setValue(name, blendshape_weight[name])
}

// morph END

//両目
// skip when using ARKit blendshapes
if (!use_faceBlendshapes) {// || System._browser.camera.facemesh.auto_look_at_camera) {
  const eye_bone = bones_by_name['両目'];
  const lookAt = vrm.lookAt;
  if (System._browser.camera.facemesh.auto_look_at_camera) {
    lookAt.lookAt(MMD_SA._trackball_camera.object.position);
  }
  else {
    const eye_aa = eye_bone.quaternion.toAxisAngle();
    lookAt.lookAt(lookAt.getLookAtWorldPosition(v1).add( v2.set(0,0,100).applyQuaternion(this.get_bone_rotation_by_MMD_name('頭').multiply(q1.setFromAxisAngle(eye_aa[0], eye_aa[1]*5))) ));
  }
}


// update BEFORE VMC (especially for lookAt)
if (this._reset_physics_) { delete this._reset_physics_; this.resetPhysics(); }

if (MMD_SA.hide_3D_avatar) { vrm._update_core(time_delta) } else
vrm.update(time_delta);


if (MMD_SA.OSC.VMC.sender_enabled && MMD_SA.OSC.VMC.ready) {
  const model_pos_scale = 1/vrm_scale;

  const model_position0 = MMD_SA_options.Dungeon_options.options_by_area_id[MMD_SA_options.Dungeon.area_id]._startup_position_;
  const model_position_offset = v4.copy(mesh.position).sub(model_position0).multiplyScalar(model_pos_scale);

  const warudo_mode = MMD_SA.OSC.app_mode == 'Warudo';
  const VNyan_mode = MMD_SA.OSC.app_mode && (MMD_SA.OSC.app_mode.indexOf('VNyan') != -1);
  const VSeeFace_mode = (MMD_SA.OSC.app_mode == 'VSeeFace') && MMD_SA.OSC.VMC.send_camera_data;

  let root_turned_around = warudo_mode || (MMD_SA.OSC.app_mode === 'VNyan(+Z)');
  let model_turned_around = MMD_SA.OSC.VMC.send_camera_data && (MMD_SA.OSC.app_mode === 'VNyan');

  const model_rot = q4.copy(mesh.quaternion);
  if (!model_turned_around ^ !!this.is_VRM1) model_rot.premultiply(q2.set(0,1,0,0));
//DEBUG_show(mesh.quaternion.toArray())

  const pos_msgs = [
'root',
...((VSeeFace_mode) ? ((System._browser.camera.poseNet.enabled && MMD_SA.MMD.motionManager.para_SA.motion_tracking_upper_body_only && MMD_SA.MMD.motionManager.para_SA.center_view_enforced) ? [0,0,-5/10] : [0, 5/10, -60/10]) : [model_position_offset.x*((root_turned_around)?-1:1), model_position_offset.y, -model_position_offset.z*((root_turned_around)?-1:1)]),
-model_rot.x, -model_rot.y, model_rot.z, model_rot.w,
  ];

  const bone_msgs = [];
  for (let name_VMC in VRMSchema.HumanoidBoneName) {
    const name = VRMSchema.HumanoidBoneName[name_VMC];
    const bone = this.getBoneNode(name);
    if (!bone) continue;

    let b_pos, b_rot;
    if (this.is_VRM1 && VNyan_mode) {
      b_pos = v1.copy(bone.position);
      b_pos.x *= -1;
      b_pos.z *= -1;
      b_rot = q1.copy(bone.quaternion);
      b_rot.x *= -1;
      b_rot.z *= -1;
    }
    else {
      b_pos = bone.position;
      b_rot = bone.quaternion;
    }

    bone_msgs.push([
(this.is_VRM1 && !VNyan_mode)?name_VMC:bone_map_VRM0[name_VMC],
b_pos.x, b_pos.y, -b_pos.z,
-b_rot.x, -b_rot.y, b_rot.z, b_rot.w,
    ]);
  }

  const morph_msgs = [];
  for (const name of ['lookUp', 'lookDown', 'lookLeft', 'lookRight']) {
    const v = expressionManager.getValue(name);
    if (v != null)
      blendshape_weight[name] = v;
  }

  for (const name in blendshape_weight) {
    const name_for_blendshapes = (use_faceBlendshapes && this.faceBlendshapes_map_reversed[name]) || name;
    morph_msgs.push([
// three-vrm 1.0
// use VRM0 name unless VRM1 model is used (with VNyan mode)
this.blendshape_map_name(name_for_blendshapes, this.is_VRM1 && VNyan_mode),

blendshape_weight[name],
    ]);
  }


  let camera_msgs;
  if (MMD_SA.OSC.VMC.send_camera_data && !VSeeFace_mode) {
    const camera = MMD_SA.THREEX.camera.obj;
    const camera_pos = v1.copy(camera.position).sub(mesh.position).multiplyScalar(model_pos_scale);

    const camera_rot = q1.copy(camera.quaternion);
    if (!model_turned_around) camera_rot.premultiply(q2.set(0,1,0,0));

    camera_pos.add(model_position_offset);

    camera_msgs = [
'Camera',
camera_pos.x*((!model_turned_around)?-1:1), camera_pos.y, -camera_pos.z*((!model_turned_around)?-1:1),
-camera_rot.x, -camera_rot.y, camera_rot.z, camera_rot.w,
//0,0,0,
//0,1,0,0,
camera.fov,
    ];
//DEBUG_show(camera_rot.toArray().join('\n')+'\n'+camera.fov);
  }

  let tracker_msgs = [];
  let tracker_index = 0;
  MMD_SA.THREEX._object3d_list_?.forEach(x_object=>{
    const p_bone = x_object.parent_bone;
    if (p_bone) {
      const obj = x_object._mesh;
      const obj_pos = (p_bone.disabled) ? v1.set(0,-999,0) : v1.copy(obj.position).sub(mesh.position).multiplyScalar(model_pos_scale);

      const obj_rot = q1.copy(obj.quaternion);
      let sign = 1;
      if (!model_turned_around) {//warudo_mode) {
        sign = -1;
        obj_rot.multiply(q2.set(0,1,0,0));
      }

      tracker_msgs.push([
'XRAnimator-tracker-' + ((x_object.VMC_tracker_index != null) ? x_object.VMC_tracker_index : tracker_index),
obj_pos.x*sign, obj_pos.y, -obj_pos.z*sign,
-obj_rot.x*sign, -obj_rot.y, obj_rot.z*sign, obj_rot.w,
      ]);

      tracker_index++;
    }
  });

setTimeout(()=>{
//let _t=performance.now()
  MMD_SA.OSC.VMC.ready = false;

  MMD_SA.OSC.VMC.send(MMD_SA.OSC.VMC.Message("/VMC/Ext/Root/Pos",
    pos_msgs,
    'sfffffff'
  ));

  MMD_SA.OSC.VMC.send(MMD_SA.OSC.VMC.Bundle(
    ...bone_msgs.map(msg=>MMD_SA.OSC.VMC.Message(
"/VMC/Ext/Bone/Pos",
msg,
'sfffffff'
    ))
  ));

  MMD_SA.OSC.VMC.send(MMD_SA.OSC.VMC.Bundle(
    ...morph_msgs.map(msg=>MMD_SA.OSC.VMC.Message(
"/VMC/Ext/Blend/Val",
msg,
'sf'
    )),
    MMD_SA.OSC.VMC.Message("/VMC/Ext/Blend/Apply")
  ));

  if (camera_msgs) {
    MMD_SA.OSC.VMC_camera.send(MMD_SA.OSC.VMC_camera.Message("/VMC/Ext/Cam",
      camera_msgs,
      'sffffffff'
    ));
  }

  if (tracker_msgs.length) {
    MMD_SA.OSC.VMC_misc.send(MMD_SA.OSC.VMC_misc.Bundle(
      ...tracker_msgs.map(msg=>MMD_SA.OSC.VMC_misc.Message(
"/VMC/Ext/Tra/Pos",
msg,
'sfffffff'
      ))
    ));
  }

  MMD_SA.OSC.VMC.send(MMD_SA.OSC.VMC.Message("/VMC/Ext/OK", [1], 'i'));

//  MMD_SA.OSC.VMC.send(MMD_SA.OSC.VMC.Message("/VMC/Ext/T", [Date.now()], 't'));

  MMD_SA.OSC.VMC.ready = true;
//System._browser.camera.DEBUG_show(performance.now()-_t);
}, 0);

}


if (!mesh.matrixAutoUpdate) {
  mesh.updateMatrix()
  mesh.updateMatrixWorld()
}
        }
      }
    });

    const vrm_scale = 11;

    let vrm_list = [];

    let rot_parent_upper_body_inv;

    const is_MMD_bone_motion_mixed = new RegExp(toRegExp(['上半身','肩'],'|'));
    const is_MMD_bone_motion_skipped = new RegExp(toRegExp(['センター','下半身','足','ひざ'],'|'));
    const is_MMD_bone_motion_parent_limited = new RegExp('^'+toRegExp(['首','腕'],'|'));
    const is_MMD_bone_motion_face = new RegExp(toRegExp(['頭','目'],'|'));

    let bone_map_MMD_to_VRM, bone_map_VRM_to_MMD;
    const bone_map_VRM0 = {};

    let MMD_bone_list = [];
    window.addEventListener('jThree_ready', ()=>{
      bone_map_MMD_to_VRM = VRM.fix_rig_map({
センター:"hips",
上半身:"spine",
上半身2:"chest",
上半身3:"upperChest",
首:"neck",
頭:"head",
右肩:"rightShoulder",
右腕:"rightUpperArm",
右ひじ:"rightLowerArm",
右手首:"rightHand",
右親指０:"rightThumbMetacarpal",
右親指１:"rightThumbProximal",
右親指２:"rightThumbDistal",
右小指１:"rightLittleProximal",
右小指２:"rightLittleIntermediate",
右小指３:"rightLittleDistal",
右薬指１:"rightRingProximal",
右薬指２:"rightRingIntermediate",
右薬指３:"rightRingDistal",
右中指１:"rightMiddleProximal",
右中指２:"rightMiddleIntermediate",
右中指３:"rightMiddleDistal",
右人指１:"rightIndexProximal",
右人指２:"rightIndexIntermediate",
右人指３:"rightIndexDistal",
左肩:"leftShoulder",
左腕:"leftUpperArm",
左ひじ:"leftLowerArm",
左手首:"leftHand",
左親指０:"leftThumbMetacarpal",
左親指１:"leftThumbProximal",
左親指２:"leftThumbDistal",
左小指１:"leftLittleProximal",
左小指２:"leftLittleIntermediate",
左小指３:"leftLittleDistal",
左薬指１:"leftRingProximal",
左薬指２:"leftRingIntermediate",
左薬指３:"leftRingDistal",
左中指１:"leftMiddleProximal",
左中指２:"leftMiddleIntermediate",
左中指３:"leftMiddleDistal",
左人指１:"leftIndexProximal",
左人指２:"leftIndexIntermediate",
左人指３:"leftIndexDistal",
右目:"rightEye",
左目:"leftEye",
右足:"rightUpperLeg",
右ひざ:"rightLowerLeg",
右足首:"rightFoot",
右足先EX:"rightToes",
左足:"leftUpperLeg",
左ひざ:"leftLowerLeg",
左足首:"leftFoot",
左足先EX:"leftToes",
      });

      bone_map_VRM_to_MMD = {};
      Object.entries(bone_map_MMD_to_VRM).forEach(([MMD_name, VRM_name])=>{ bone_map_VRM_to_MMD[VRM_name] = MMD_name; });

      MMD_bone_list = Object.keys(bone_map_MMD_to_VRM);

      for (let name_VMC in VRM.VRMSchema.HumanoidBoneName) {
        bone_map_VRM0[name_VMC] = name_VMC.replace(/ThumbProximal/, 'ThumbIntermediate').replace(/ThumbMetacarpal/, 'ThumbProximal');
      }
    });

// three-vrm 1.0
// https://pixiv.github.io/three-vrm/packages/three-vrm/docs/classes/VRMExpressionManager.html#presetExpressionMap
// https://protocol.vmc.info/english (VRM0 vs VRM1 Incompatibility Warning)
    const blendshape_map_by_MMD_name_VRM1 = {
"あ": "aa",
"あ２": "aa",

"い": "ih",

"う": "ou",
//"ω"

"え": "ee",
//"にやり"

"お": "oh",

"まばたき": "blink",

"まばたきL": "blinkLeft",
"ウィンク": "blinkLeft",
"ウィンク２": "blinkLeft",

"まばたきR": "blinkRight",
"ウィンク右": "blinkRight",
"ｳｨﾝｸ２右": "blinkRight",

"にこり": "relaxed",
"困る": "sad",
"怒り": "angry",
"笑い": "happy",
//"びっくり": "Surprise",
    };

    const blendshape_map_by_MMD_name_VRM0 = {
"あ": "a",
"あ２": "a",

"い": "i",

"う": "u",
//"ω"

"え": "e",
//"にやり"

"お": "o",

"まばたき": "blink",

"まばたきL": "blink_l",
"ウィンク": "blink_l",
"ウィンク２": "blink_l",

"まばたきR": "blink_r",
"ウィンク右": "blink_r",
"ｳｨﾝｸ２右": "blink_r",

"にこり": "fun",
"困る": "sorrow",
"怒り": "angry",
"笑い": "joy",
//"びっくり": "Surprise",
    };

    const finger_list = {"親":0, "人":1, "中":2, "薬":3, "小":4};
    const finger_list_en = ["Thumb", "Index", "Middle", "Ring", "Little"];
    const nj_list = ["０","１","２","３"];

    return {
      get list() { return vrm_list; },
      set list(v) { vrm_list = v; },

      get vrm_scale() { return vrm_scale; },

      get bone_map_MMD_to_VRM() { return bone_map_MMD_to_VRM; },
      get bone_map_VRM_to_MMD() { return bone_map_VRM_to_MMD; },

      get blendshape_map_by_MMD_name_VRM0() { return blendshape_map_by_MMD_name_VRM1; },
      get blendshape_map_by_MMD_name_VRM1() { return blendshape_map_by_MMD_name_VRM1; },

      get is_MMD_bone_motion_mixed() { return is_MMD_bone_motion_mixed; },

      VRMSchema: { HumanoidBoneName:{
Hips: "hips",
Spine: "spine",
Chest: "chest",
UpperChest: "upperChest",
Neck: "neck",
Head: "head",
LeftEye: "leftEye",
RightEye: "rightEye",
Jaw: "jaw",
LeftUpperLeg: "leftUpperLeg",
LeftLowerLeg: "leftLowerLeg",
LeftFoot: "leftFoot",
LeftToes: "leftToes",
RightUpperLeg: "rightUpperLeg",
RightLowerLeg: "rightLowerLeg",
RightFoot: "rightFoot",
RightToes: "rightToes",
LeftShoulder: "leftShoulder",
LeftUpperArm: "leftUpperArm",
LeftLowerArm: "leftLowerArm",
LeftHand: "leftHand",
RightShoulder: "rightShoulder",
RightUpperArm: "rightUpperArm",
RightLowerArm: "rightLowerArm",
RightHand: "rightHand",
LeftThumbMetacarpal: "leftThumbMetacarpal",
LeftThumbProximal: "leftThumbProximal",
LeftThumbDistal: "leftThumbDistal",
LeftIndexProximal: "leftIndexProximal",
LeftIndexIntermediate: "leftIndexIntermediate",
LeftIndexDistal: "leftIndexDistal",
LeftMiddleProximal: "leftMiddleProximal",
LeftMiddleIntermediate: "leftMiddleIntermediate",
LeftMiddleDistal: "leftMiddleDistal",
LeftRingProximal: "leftRingProximal",
LeftRingIntermediate: "leftRingIntermediate",
LeftRingDistal: "leftRingDistal",
LeftLittleProximal: "leftLittleProximal",
LeftLittleIntermediate: "leftLittleIntermediate",
LeftLittleDistal: "leftLittleDistal",
RightThumbMetacarpal: "rightThumbMetacarpal",
RightThumbProximal: "rightThumbProximal",
RightThumbDistal: "rightThumbDistal",
RightIndexProximal: "rightIndexProximal",
RightIndexIntermediate: "rightIndexIntermediate",
RightIndexDistal: "rightIndexDistal",
RightMiddleProximal: "rightMiddleProximal",
RightMiddleIntermediate: "rightMiddleIntermediate",
RightMiddleDistal: "rightMiddleDistal",
RightRingProximal: "rightRingProximal",
RightRingIntermediate: "rightRingIntermediate",
RightRingDistal: "rightRingDistal",
RightLittleProximal: "rightLittleProximal",
RightLittleIntermediate: "rightLittleIntermediate",
RightLittleDistal: "rightLittleDistal",
      }},

      init: init,

      fix_rig_map: function (rig_map) {
if (use_VRM1) return rig_map;

Object.keys(rig_map).forEach(name=>{
  switch (rig_map[name]) {
    case "rightThumbMetacarpal":
      rig_map[name] = "rightThumbProximal";
      break;
    case "rightThumbProximal":
      rig_map[name] = "rightThumbIntermediate";
      break;
    case "leftThumbMetacarpal":
      rig_map[name] = "leftThumbProximal";
      break;
    case "leftThumbProximal":
      rig_map[name] = "leftThumbIntermediate";
      break;
  }
});

return rig_map;
      },

      load: async function (url, para) {
if (!MMD_SA.MMD_started)
  MMD_SA.fn.load_length_extra++

var url_raw = url;
var model_filename = url.replace(/^.+[\/\\]/, '')

var object_url;
await new Promise((resolve) => {
  if (!/\.zip\#/i.test(url)) {
    url = toFileProtocol(url)
    resolve()
    return
  }

  System._browser.load_file(url, function(xhr) {
    object_url = url = URL.createObjectURL(xhr.response);
    resolve();
  }, 'blob', true);
});

await new Promise((resolve) => {

GLTF_loader.load(

  // URL of the VRM you want to load
  url,

  // called when the resource is loaded
  (function () {
    function main(vrm) {
console.log(vrm);

const mesh_obj = vrm.scene
if (MMD_SA_options.use_shadowMap) {
  mesh_obj.traverseVisible(obj=>{
    if (obj.isMesh) obj.castShadow = true;
  });
}

mesh_obj.traverse( ( obj ) => {
// Disable frustum culling, saving some headaches in some situations when the model should be displayed but is frustumCulled
  obj.frustumCulled = false;
  obj.layers.enable(MMD_SA.THREEX.PPE.N8AO.AO_MASK);
} );

if (!MMD_SA.MMD_started)
  data.scene.add(mesh_obj);

var vrm_obj = new VRM_object(para.vrm_index, vrm, { url:url_raw });

vrm_obj.faceBlendshapes_map = {};
if (vrm.expressionManager.customExpressionMap['CheekPuff']) {
  vrm_obj.use_faceBlendshapes = true;
  System._browser.camera.facemesh.faceBlendshapes_list.map(b=>{
    vrm_obj.faceBlendshapes_map[b] = b;
  });
}
else if (vrm.expressionManager.customExpressionMap['BlendShape.CheekPuff']) {
  vrm_obj.use_faceBlendshapes = true;
  System._browser.camera.facemesh.faceBlendshapes_list.map(b=>{
    vrm_obj.faceBlendshapes_map[b] = 'BlendShape.' + b;
  });
}
else if (vrm.expressionManager.customExpressionMap['cheekPuff']) {
  vrm_obj.use_faceBlendshapes = true;
  System._browser.camera.facemesh.faceBlendshapes_list.map(b=>{
    vrm_obj.faceBlendshapes_map[b] = b.charAt(0).toLowerCase() + b.substring(1);
  });
}

if (vrm_obj.use_faceBlendshapes) {
  vrm_obj.faceBlendshapes_map_reversed = {};
  Object.entries(vrm_obj.faceBlendshapes_map).forEach(e=>{
    vrm_obj.faceBlendshapes_map_reversed[e[1]] = e[0];
  });
}

vrm_obj.emotion_list = (use_VRM1) ? ['relaxed','happy','sad','angry'] : ['fun','joy','sorrow','angry'];
const _blendshape_map_by_MMD_name = {};
for (const name in vrm.expressionManager.customExpressionMap) {
  if (/surprise/i.test(name)) {
    _blendshape_map_by_MMD_name['びっくり'] = name;
    vrm_obj.emotion_list.push(name);
  }
  else if (/blush|shy/i.test(name)) {
    _blendshape_map_by_MMD_name['照れ'] = name;
    vrm_obj.emotion_list.push(name);
  }
  else if (!/tongueout/i.test(name) && /tongue|scornful/i.test(name)) {
    _blendshape_map_by_MMD_name['ぺろっ'] = name;
    vrm_obj.emotion_list.push(name);
  }
}
const blendshape_map_by_MMD_name = (use_VRM1) ? blendshape_map_by_MMD_name_VRM1 : blendshape_map_by_MMD_name_VRM0;
vrm_obj.blendshape_map_by_MMD_name = Object.assign({}, blendshape_map_by_MMD_name, _blendshape_map_by_MMD_name);
vrm_obj.MMD_morph_list = Object.keys(vrm_obj.blendshape_map_by_MMD_name);
vrm_obj.build_blendshape_map_name(Object.assign({}, blendshape_map_by_MMD_name_VRM0, _blendshape_map_by_MMD_name), Object.assign({}, blendshape_map_by_MMD_name_VRM1, _blendshape_map_by_MMD_name));
console.log(vrm_obj.emotion_list, vrm_obj.MMD_morph_list);

if (!vrm_obj.is_VRM1) mesh_obj.quaternion.set(0,1,0,0);

if (data.OutlineEffect && VRM.use_OutlineEffect) {
  mesh_obj.traverseVisible(obj=>{
    if (obj.isMesh) obj.userData.outlineParameters = { visible: true };
  });
}

vrm._update_core = function (delta) {
// https://github.com/pixiv/three-vrm/blob/3cfe3003a55e2617e9f1767934ac0aaa01c6f775/packages/three-vrm-core/src/VRMCore.ts
  this.humanoid.update();

  if (this.lookAt) {
    this.lookAt.update(delta);
  }

  if (this.expressionManager) {
    this.expressionManager.update();
  }
};

vrm_obj.scale(vrm_scale);

var obj = Object.assign({
  data: vrm_obj,
  obj: mesh_obj,
  get parent() { return this.get_parent(); },

  no_scale: true,
}, para);//, MMD_SA_options.THREEX_options.model_para[model_filename]||{});

obj_list[para.vrm_index] = obj;

if (object_url) {
  URL.revokeObjectURL(object_url)
}

if (!MMD_SA.MMD_started)
  MMD_SA.fn.setupUI();

resolve();
    }

    return function (gltf) {
// https://pixiv.github.io/three-vrm/packages/three-vrm/examples/basic.html
// calling these functions greatly improves the performance
THREE.VRMUtils.removeUnnecessaryVertices( gltf.scene );
THREE.VRMUtils.removeUnnecessaryJoints( gltf.scene );

// three-vrm 1.0
if (use_VRM1) {
  // retrieve a VRM instance from gltf
  const vrm = gltf.userData.vrm;
  main(vrm);
}
else {
  // generate a VRM instance from gltf
  THREEX.VRM.from(gltf).then(main);
}
    };
  })(),

  // called while loading is progressing
  (progress) => {},//console.log('Loading model...', 100.0 * (progress.loaded / progress.total), '%'),

  // called when loading has errors
  (error) => console.error(error)

);

});
      },

      load_extra: (()=>{
        let loading;

        return async function (src) {
const filename_new = src.replace(/^.+[\/\\]/, '');
let index_new = threeX.models.findIndex(m=>filename_new == m.model_path.replace(/^.+[\/\\]/, ''));
if (index_new == 0) return;

if (loading) return;
loading = true;

if (index_new == -1) {
  index_new = threeX.models.length;

  if (!MMD_SA_options.THREEX_options.model_path_extra)
    MMD_SA_options.THREEX_options.model_path_extra;
  MMD_SA_options.THREEX_options.model_path_extra[index_new-1] = src;

  await threeX.VRM.load(src, {
vrm_index: index_new,

get_parent: function () {
  this.parent_data = threeX._THREE.MMD.getModels()[0];
  return this.parent_data.mesh;
},

update: function () {}
  });
}

loading = false;

this.swap_model(index_new);
        };
      })(),

      swap_model: (()=>{
        let loading = false;
        return function (index_new) {
if ((index_new >= threeX.models.length) || (index_new == 0)) return;

if (loading) return;
loading = true;

System._browser.on_animation_update.add(()=>{
  if (index_new > 3) {
    const index_last = threeX.models.findIndex(m=>m.index_default==3);

    const model_now = threeX.models[index_last];
    const model_new = threeX.models[index_new];

    threeX.utils.dispose(model_now.model.scene);
    threeX.scene.remove(model_now.model.scene);

    model_new.index_default = 3;
    model_new.index = index_last;
    threeX.models[index_last] = model_new;
    threeX.models.length--;
    obj_list.length--;

    index_new = index_last;
  }

  const model_now = threeX.models[0];
  const model_new = threeX.models[index_new];

  model_new.index = 0;
  model_now.index = index_new;
  threeX.models.sort((a,b)=>a.index-b.index);
  obj_list.sort((a,b)=>a.data.index-b.data.index);

//  threeX.utils.dispose(model_now.model.scene);
  threeX.scene.remove(model_now.model.scene);
//  threeX.models.length = 1; obj_list.length = 1;

  threeX.scene.add(model_new.model.scene);

  const canvas = MMD_SA_options.Dungeon.character.icon;
  const ctx = canvas.getContext("2d");
  ctx.drawImage((model_new.is_VRM1)?model_new.model.meta.thumbnailImage:model_new.model.meta.texture.source.data, 0,0,64,64);
  MMD_SA_options.Dungeon.update_status_bar(true);

  MMD_SA._force_motion_shuffle = true;

  loading = false;
}, 0,0);
        };
      })(),

    };
  })();
// VRM END


  var enabled = true;
  var loaded, loading, resolve_loading;

  var THREE, _THREE;
  var data = {};
  var obj_list = [];
  var models = [];
  var models_dummy = [];

  var v1, v2, v3, v4;
  var q1, q2, q3, q4;
  var e1, e2, e3, e4;
  var m1, m2, m3, m4;

  var p1, p2;
  var l1, l2;

  var rot_arm_axis = {};
  var rot_shoulder_axis = {};

  var use_OutlineEffect;

  var threeX  = {

    three_filename: (webkit_electron_mode) ? 'three.module.js' : 'three.module.min.js',

    data: data,

    get v1(){return v1},get v2(){return v2},get v3(){return v3},get v4(){return v4},
    get q1(){return q1},get q2(){return q2},get q3(){return q3},get q4(){return q4},
    get e1(){return e1},get e2(){return e2},get e3(){return e3},get e4(){return e4},
    get m1(){return m1},get m2(){return m2},get m3(){return m3},get m4(){return m4},

    get p1(){return p1},
    get l1(){return l1},

    get enabled() { return MMD_SA_options.use_THREEX && enabled; },
    set enabled(v) {
if (!MMD_SA_options.use_THREEX) return;
enabled = !!v;
// save some headaches to not change SL's visibility here as other features (e.g. mouse events) may require it to be visible
//SL.style.visibility  = (!enabled) ? 'inherit' : 'hidden'
SLX.style.visibility = ( enabled) ? 'inherit' : 'hidden';
    },

    get THREE() { return (this.enabled) ? THREE : self.THREE; },

    get _THREE() { return (this.enabled) ? _THREE : self.THREE; },

    get THREEX() { return THREE; },

    get obj_list() { return obj_list; },
    set obj_list(v) { obj_list = v; },

    get SL() { return document.getElementById((this.enabled) ? "SLX" : "SL"); },

    get scene() { return (this.enabled) ? data.scene : MMD_SA.scene; },

    get use_VRM1() { return use_VRM1; },

    get use_sRGBEncoding() { return use_VRM1; },

    get use_OutlineEffect() { return data.OutlineEffect && (use_OutlineEffect || VRM.use_OutlineEffect); },
    set use_OutlineEffect(v) { use_OutlineEffect = v; },

    get _rot_shoulder_axis() { return rot_shoulder_axis; },

    get models() { return models; },
    get models_dummy() { return models_dummy; },

    get_model: function (index) { return models[index]; },

    rot_arm_axis: rot_arm_axis,

    MMD_dummy_obj: MMD_dummy_obj,

    init: function () {
// common init START
THREE = _THREE = self.THREE;

for (let i = 0; i < MMD_SA_options.model_path_extra.length+1; i++) {
  models_dummy[i] = models[i] = new MMD_dummy_obj(i);
}
// common init END

if (loaded) {
  init();
  return Promise.resolve();
}

if ((MMD_SA_options.model_path != MMD_SA_options.model_path_default) || (!MMD_SA_options.THREEX_options.model_path && !MMD_SA_options.THREEX_options.enabled_by_default)) {
  this.enabled = false;
}

if (!this.enabled) {
  return (MMD_SA_options.Dungeon_options && MMD_SA_options.Dungeon.use_octree) ? this.utils.load_octree() : Promise.resolve();
}

if (!MMD_SA_options.THREEX_options.model_path) {
  MMD_SA_options.THREEX_options.model_path = System.Gadget.path + '/three.js/model/AliciaSolid.zip#/AliciaSolid.vrm'
  MMD_SA_options.THREEX_options.model_para['AliciaSolid.vrm'] = Object.assign(MMD_SA_options.THREEX_options.model_para['AliciaSolid.vrm']||{}, {
    icon_path: 'icon_v01.jpg'
  });
}

DEBUG_show('Loading THREEX...')

if (!loading) {
  MMD_SA.THREEX.load_scripts()
}

return new Promise((resolve)=>{
  resolve_loading = function () {
    init()
    resolve()
  };
});
    },

    PPE: (()=>{
      let PPE_initialized, PPE_initializing;

      let renderScene;
      let renderScene_with_depthTexture, scene_depthTexture;

      let effects_composer;

      let PPE_options_default, PPE_options;

      const PPE_list = ['DOF', 'N8AO', 'UnrealBloom'];

      const ENTIRE_SCENE = 0, NO_BLOOM = 1, AO_MASK = 2, NO_AO = 3;

      let Pass;

      let OutputPass, SMAAPass;

      function close_other_GUI(gui) {
PPE.gui.folders.forEach(f=>{
  if (f != gui)
    f.close();
});
      }

      function create_depthTexture() {
const dt = new THREE.DepthTexture(threeX.SL.width, threeX.SL.height, THREE.UnsignedIntType);
dt.format = THREE.DepthFormat;
return dt;
      }

      const PPE = {
        get enabled() { return PPE_options.enabled; },
        set enabled(v) {
PPE_options.enabled = !!v;
this.gui.controllers[0].updateDisplay();

if (v && !PPE_list.some(n=>PPE[n].enabled)) {
  PPE['UnrealBloom'].enabled = true;
}

PPE['UnrealBloom'].setup_rim_light();
        },

        get initialized() { return PPE_initialized; },

        init: async function () {
if (PPE_initialized) return;
PPE_initializing = true;

// Oct 11, 2023
const _Pass = await import(System.Gadget.path + '/three.js/postprocessing/Pass.js');
Pass = _Pass.Pass;

const EffectComposer = await import(System.Gadget.path + '/three.js/postprocessing/EffectComposer.js');

// not using commit from Aug 23, 2023 as it breaks MSAA
const RenderPass = await import(System.Gadget.path + '/three.js/postprocessing/RenderPass.js');

// May 24, 2023
const ShaderPass = await import(System.Gadget.path + '/three.js/postprocessing/ShaderPass.js');

THREE.EffectComposer = EffectComposer.EffectComposer;
THREE.RenderPass = RenderPass.RenderPass;
THREE.ShaderPass = ShaderPass.ShaderPass;

//THREE.SMAAPass = (await import(System.Gadget.path + '/three.js/postprocessing/SMAAPass.js')).SMAAPass;

// Dec 19, 2023
THREE.OutputPass = (await import(System.Gadget.path + '/three.js/postprocessing/OutputPass.js')).OutputPass;

PPE_options_default = {
  enabled: false,
};

PPE_options = Object.assign({
}, PPE_options_default);

for (const name of PPE_list) {
  const effect = this[name];
  await effect.init();
}

if (MMD_SA.MMD_started) {
  this.setup();
}
else {
  window.addEventListener('MMDStarted', ()=>{
    this.setup();
  });
}
        },

        setup: function () {
const gui = this.gui = threeX.GUI.obj.visual_effects.addFolder( 'Post-Processing Effects' );
gui.add(PPE_options, 'enabled').onChange( ( value )=>{
  this.enabled = value;
});

renderScene = new THREE.RenderPass( data.scene, data.camera );

renderScene_with_depthTexture = new THREE.RenderPass( data.scene, data.camera );
renderScene_with_depthTexture._renderTarget_with_depthTexture = new THREE.WebGLRenderTarget( threeX.SL.width, threeX.SL.height, { type:THREE.HalfFloatType, samples:4 } );
scene_depthTexture = renderScene_with_depthTexture._renderTarget_with_depthTexture.depthTexture = create_depthTexture();

OutputPass = new THREE.OutputPass();

PPE_list.forEach(name=>{
  const effect = this[name];
//effect.enabled = true;
  effect.setup();
});

effects_composer = new THREE.EffectComposer(data.renderer);
effects_composer.addPass(renderScene_with_depthTexture);
effects_composer.addPass(PPE.N8AO.pass);
effects_composer.addPass(PPE.UnrealBloom.mix_pass);
effects_composer.addPass(PPE.DOF.pass);
effects_composer.addPass(OutputPass);

//SMAAPass = new THREE.SMAAPass(SL.width, SL.height);
//effects_composer.addPass(SMAAPass);

PPE_list.map(name=>{ return { name:name, order:this[name].UI_order }; }).sort((a,b)=>a.order-b.order).forEach(obj=>{
  const effect = this[obj.name];
  effect.setup_UI();
  effect.gui.domElement.addEventListener('click', ()=>{
    close_other_GUI(effect.gui);
  });
  effect.gui.close();
});

window.addEventListener('SA_MMD_SL_resize', ()=>{
  const SL = threeX.SL;
  const width = SL.width;
  const height = SL.height;

  PPE_list.forEach(name=>{
    const effect = this[name];
    if (effect.enabled)
      effect.resize(width, height);
  });

  effects_composer.setSize( width, height );
});

PPE_initializing = false;
PPE_initialized = true;
        },

        render: function (scene, camera) {
//return false;
if (!PPE_initialized || !this.enabled) return false;

if (MMD_SA.SpeechBubble.list.some(sb=>sb.visible)) return false;

let rendered = false;
PPE_list.forEach(name=>{
  const effect = this[name];
  if (effect.enabled)
    rendered = effect.render(scene, camera) || rendered;
});

if (!rendered) return false;

//effects_composer.writeBuffer = effects_composer.renderTarget1;
//effects_composer.readBuffer  = effects_composer.renderTarget2;

if (!PPE.N8AO.enabled) {
  renderScene_with_depthTexture.enabled = true;
//  SMAAPass.enabled = false;
}
else {
  renderScene_with_depthTexture.enabled = false;
//  SMAAPass.enabled = true;
}

effects_composer.render();

return true;
        },


        DOF: (()=>{
          let postprocessing;

          let DOFPass;
          let gui_DOF;
          let effectController, effectController_default, _effectController;

          const shaderSettings = {
rings: 3,
samples: 4
          };

const matChanger = function () {
					for ( const e in effectController ) {

						if ( e in postprocessing.bokeh_uniforms ) {

							postprocessing.bokeh_uniforms[ e ].value = effectController[ e ];

						}

					}

					postprocessing.enabled = DOF.enabled = effectController.enabled;
};

function shaderUpdate() {

				postprocessing.materialBokeh.defines.RINGS = shaderSettings.rings;
				postprocessing.materialBokeh.defines.SAMPLES = shaderSettings.samples;
				postprocessing.materialBokeh.needsUpdate = true;

}

          const DOF = {
            get effectController() { return effectController || _effectController; },
            set effectController(v) {
_effectController = v;
if (PPE_initialized) {
  Object.assign(effectController, v);
  threeX.GUI.update(this.gui);
//console.log(effectController)
}
            },

            init: async function () {
const BokehShader = await import(System.Gadget.path + '/three.js/shaders/BokehShader2.js');
THREE.BokehShader = BokehShader.BokehShader;

effectController_default = {
					enabled: false,//true,
//					jsDepthCalculation: true,
					shaderFocus: true,//false,

					fstop: 2.2,
					maxblur: 2.0,//1.0,

					showFocus: false,
//					focalDepth: 2.8,
					manualdof: false,
					vignetting: false,
					depthblur: false,

					threshold: 0.5,
					gain: 1.0,//2.0,
					bias: 0.5,
					fringe: 0.7,

//					focalLength: 35,
					noise: true,
					pentagon: false,

					dithering: 0.0001,

  'focus target': 'Auto',
};

effectController = Object.assign({
  reset: function () {
    gui_DOF.controllers.forEach((c,i)=>{if (i>0) c.reset()});
  },
}, effectController_default);
            },

            setup: function () {
const renderer = data.renderer;
const SL = threeX.SL;
const w = SL.width;
const h = SL.height;

DOFPass = class extends Pass {
  constructor( obj ) {
    super();

    this.obj = obj;
  }

  render( renderer, writeBuffer, readBuffer /*, deltaTime, maskActive */ ) {
    const obj = this.obj
    const SL = threeX.SL;
    const w = SL.width;
    const h = SL.height;

    obj.bokeh_uniforms[ 'tColor' ].value = readBuffer.texture;
    obj.bokeh_uniforms[ 'tDepth' ].value = (PPE.N8AO.enabled) ? PPE.N8AO.pass._AO_mask.depthTexture : scene_depthTexture;
    obj.bokeh_uniforms[ 'textureWidth' ].value  = w;
    obj.bokeh_uniforms[ 'textureHeight' ].value = h;

    const camera = data.camera;
    obj.bokeh_uniforms[ 'znear' ].value = camera.near;
    obj.bokeh_uniforms[ 'zfar' ].value = camera.far;
    obj.bokeh_uniforms[ 'focalLength' ].value = camera.getFocalLength();

    if ( this.renderToScreen ) {
      renderer.setRenderTarget(null);
    }
    else {
      renderer.setRenderTarget( writeBuffer );
    // TODO: Avoid using autoClear properties, see https://github.com/mrdoob/three.js/pull/15571#issuecomment-465669600
      if ( this.clear ) renderer.clear( renderer.autoClearColor, renderer.autoClearDepth, renderer.autoClearStencil );
    }

    renderer.render( obj.scene, obj.camera );
  }

  dispose() {
    this.obj.materialBokeh.dispose();
    this.obj.quad.dispose();
  }
};

postprocessing = { enabled: true };


postprocessing.scene = new THREE.Scene();

postprocessing.camera = new THREE.OrthographicCamera( w / - 2, w / 2, h / 2, h / - 2, - 10000, 10000 );
postprocessing.camera.position.z = 100;

postprocessing.scene.add( postprocessing.camera );

//				postprocessing.rtTextureDepth = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight );
//				postprocessing.rtTextureColor = new THREE.WebGLRenderTarget( SL.width, SL.height );

const bokeh_shader = THREE.BokehShader;

postprocessing.bokeh_uniforms = THREE.UniformsUtils.clone( bokeh_shader.uniforms );

postprocessing.materialBokeh = new THREE.ShaderMaterial( {
	uniforms: postprocessing.bokeh_uniforms,
	vertexShader: bokeh_shader.vertexShader,
	fragmentShader: bokeh_shader.fragmentShader,
	defines: {
		RINGS: shaderSettings.rings,
		SAMPLES: shaderSettings.samples
	}
} );

postprocessing.quad_w = w;
postprocessing.quad_h = h;

//postprocessing.quad = new THREE.Mesh( new THREE.PlaneGeometry( 1, 1 ), postprocessing.materialBokeh ); postprocessing.quad.scale.set(w,h,1);
postprocessing.quad = new THREE.Mesh( new THREE.PlaneGeometry( w, h ), postprocessing.materialBokeh );
postprocessing.quad.position.z = - 500;
postprocessing.scene.add( postprocessing.quad );

DOF.pass = new DOFPass(postprocessing);
DOF.pass.enabled = this.enabled;
            },

            UI_order: 2,
            setup_UI: function () {
gui_DOF = this.gui = PPE.gui.addFolder( 'Depth of Field Parameters' );

gui_DOF.add( effectController, 'enabled' ).onChange( matChanger );
//gui_DOF.add( effectController, 'jsDepthCalculation' ).onChange( matChanger );
//gui_DOF.add( effectController, 'shaderFocus' ).onChange( matChanger );
//gui_DOF.add( effectController, 'focalDepth', 0.0, 200.0 ).listen().onChange( matChanger );

gui_DOF.add( effectController, 'fstop', 0.1, 22, 0.001 ).onChange( matChanger );
gui_DOF.add( effectController, 'maxblur', 0.0, 5.0, 0.025 ).onChange( matChanger );

gui_DOF.add( effectController, 'showFocus' ).onChange( matChanger );
gui_DOF.add( effectController, 'manualdof' ).onChange( matChanger );
gui_DOF.add( effectController, 'vignetting' ).onChange( matChanger );

gui_DOF.add( effectController, 'depthblur' ).onChange( matChanger );

gui_DOF.add( effectController, 'threshold', 0, 1, 0.001 ).onChange( matChanger );
gui_DOF.add( effectController, 'gain', 0, 100, 0.001 ).onChange( matChanger );
gui_DOF.add( effectController, 'bias', 0, 3, 0.001 ).onChange( matChanger );
gui_DOF.add( effectController, 'fringe', 0, 5, 0.001 ).onChange( matChanger );

//gui_DOF.add( effectController, 'focalLength', 16, 80, 0.001 ).onChange( matChanger );

gui_DOF.add( effectController, 'noise' ).onChange( matChanger );

gui_DOF.add( effectController, 'dithering', 0, 0.001, 0.0001 ).onChange( matChanger );

gui_DOF.add( effectController, 'pentagon' ).onChange( matChanger );

gui_DOF.add( shaderSettings, 'rings', 1, 8 ).step( 1 ).onChange( shaderUpdate );
gui_DOF.add( shaderSettings, 'samples', 1, 13 ).step( 1 ).onChange( shaderUpdate );

gui_DOF.add( effectController, 'focus target', ['Auto', 'Head', 'Chest', 'Hands', 'Feet', 'Screen center'] );

gui_DOF.add( effectController, 'reset' );

Object.assign(effectController, _effectController||{});
threeX.GUI.update(gui_DOF);
            },

            resize: function () {
const SL = threeX.SL;
const w = SL.width;
const h = SL.height;

postprocessing.camera.left = w / - 2;
postprocessing.camera.right = w / 2;
postprocessing.camera.top = h / 2;
postprocessing.camera.bottom = h / - 2;
postprocessing.camera.updateProjectionMatrix();

postprocessing.quad.geometry.scale(w/postprocessing.quad_w, h/postprocessing.quad_h, 1);
postprocessing.quad_w = w;
postprocessing.quad_h = h;
            },

            render: (()=>{
              function get_pos(t) {
let p, c;
switch (t) {
  case 'Head':
    p = modelX.get_bone_position_by_MMD_name('頭').add(v1.set(0,0.8,1).applyQuaternion(modelX.get_bone_rotation_by_MMD_name('頭')));
    break;
  case 'Chest':
    p = modelX.get_bone_position_by_MMD_name('上半身2').add(modelX.get_bone_position_by_MMD_name('首')).multiplyScalar(0.5).add(v1.set(0,0,1.5).applyQuaternion(modelX.get_bone_rotation_by_MMD_name('上半身2')));
    break;
  case 'Left hand':
    p = modelX.get_bone_position_by_MMD_name('左中指１');
    break;
  case 'Right hand':
    p = modelX.get_bone_position_by_MMD_name('右中指１');
    break;
  case 'Left foot':
    p = modelX.get_bone_position_by_MMD_name('左足首').add(v1.set(0,-0.5,1).applyQuaternion(modelX.get_bone_rotation_by_MMD_name('左足首')));
    break;
  case 'Right foot':
    p = modelX.get_bone_position_by_MMD_name('右足首').add(v1.set(0,-0.5,1).applyQuaternion(modelX.get_bone_rotation_by_MMD_name('右足首')));
    break;
}

if (p) {
  c = get_coords(p);
  if (c.some(v=>(v<0)||(v>1))) {
    p = c = null;
  }
}

return [p,c,t];
              }

              function get_coords(pos) {
const p = v1.copy(pos).project(camera);
return [p.x/2+0.5, p.y/2+0.5, p.z];
              }

              let camera, modelX;

              let target_last, distance_last;

              return function () {
camera = data.camera;

let target = effectController['focus target'];
modelX = threeX.get_model(0);

let obj, pos, coords;

if (target == 'Auto') {
  const poseNet = System._browser.camera.poseNet;
  if (poseNet.enabled) {
    const motion_para = MMD_SA.MMD.motionManager.para_SA;
    if (motion_para.motion_tracking?.arm_as_leg?.enabled && ['左','右'].some(d=>poseNet.frames.skin[d+'足首'] && poseNet.frames.get_blend_default_motion('skin', d+'足首')<1)) {
      target = 'Feet';
    }
    else {
      if (MMD_SA_options.Dungeon_options?.item_base.hand_camera?._hand_camera_active) {
        target = 'Head';
      }
      else {
        const head = get_pos('Head');
        if (head?.[0]) {
          const dim = poseNet.shoulder_width;
          const w = dim/threeX.SL.width /2 *1.1;
          const h = dim/threeX.SL.height/2 *1.1;
          obj = [get_pos('Left hand'), get_pos('Right hand')].filter(v=>v[0] && (v[1][0]>head[1][0]-w) && (v[1][0]<head[1][0]+w) && (v[1][1]>head[1][1]-h) && (v[1][1]<head[1][1]+h)).map(v=>[...v, v[0].distanceTo(camera.position)]).sort((a,b)=>a[3]-b[3])[0];
          if (obj) {
            target = '';
          }
          else {
            target = 'Head';
          }
        }
        else {
          target = 'Hands';
        }
      }
    }
  }
  else {
    target = 'Head';
  }
}

switch (target) {
  case 'Head':
  case 'Chest':
    obj = get_pos(target);
    break;
  case 'Hands':
    obj = [get_pos('Left hand'), get_pos('Right hand')].filter(v=>v[0]).map(v=>[...v, v[0].distanceTo(camera.position)]).sort((a,b)=>a[3]-b[3])[0];
    break;
  case 'Feet':
    obj = [get_pos('Left foot'), get_pos('Right foot')].filter(v=>v[0]).map(v=>[...v, v[0].distanceTo(camera.position)]).sort((a,b)=>a[3]-b[3])[0];
    break;
  default:
    target = '';
}

if (!obj && target) {
  for (const part of ['Head', 'Chest']) {
    obj = get_pos(part);
    if (obj) break;
  }
}

if (obj) {
  pos = obj[0];
  coords = obj[1];
  target = obj[2];
}

if (pos) {
  let distance = pos.distanceTo(camera.position);
  if (target_last) {
    const distance_diff = distance - distance_last;
    distance_last += Math.sign(distance_diff) * Math.min(RAF_timestamp_delta/1000 * Math.max(30, Math.abs(distance_diff)), Math.abs(distance_diff));
    distance = distance_last;
  }
  target_last = target;
  distance_last = distance;

  postprocessing.bokeh_uniforms[ 'focalDepth' ].value = distance;
  effectController[ 'focalDepth' ] = distance;
//System._browser.camera.DEBUG_show(target+'/'+distance)
}
else {
  target_last = distance_last = null;
  coords = [0.5,0.5];
}

postprocessing.bokeh_uniforms[ 'shaderFocus' ].value = !pos;
postprocessing.bokeh_uniforms[ 'focusCoords' ].value.fromArray(coords);

return true;
              };
            })(),

            get enabled() { return effectController.enabled },
            set enabled(v) {
effectController.enabled = !!v;
this.gui.controllers[0].updateDisplay();

this.pass.enabled = v;

if (v) {
  if (!PPE.enabled)
    PPE.enabled = true;
}
else {
  if (PPE_list.every(n=>!PPE[n].enabled))
    PPE.enabled = false;
}
            },
          };

          return DOF;
        })(),

        N8AO: (()=>{
          let effectController_default, effectController, _effectController;
          let effectController_vrm_default, effectController_vrm, _effectController_vrm;
          let gui_N8AO, gui_vrm;

          const N8AO = {
            AO_MASK: AO_MASK,
            NO_AO: NO_AO,

            get effectController() { return effectController || _effectController; },
            set effectController(v) {
_effectController = v;
if (PPE_initialized) {
  Object.assign(effectController, v);
  threeX.GUI.update(this.gui);
//console.log(effectController)
}
            },

            get effectController_vrm() { return effectController_vrm || _effectController_vrm; },
            set effectController_vrm(v) {
_effectController_vrm = v;
if (PPE_initialized) {
  Object.assign(effectController_vrm, v);
  threeX.GUI.update(this.gui);
//console.log(effectController_vrm)
}
            },

            init: async function () {
const N8AO = await import(System.Gadget.path + '/three.js/postprocessing/N8AO.js');
THREE.N8AOPass = N8AO.N8AOPass;

effectController_default = {
  enabled: false,//true,
  quality: 'Medium',

        aoSamples: 16.0,
        denoiseSamples: 8.0,
        denoiseRadius: 12.0,
// smaller aoRadius reduces GPU usage in some cases (e.g. zoom-in avatar with MSAA)
        aoRadius: 3.0,//5.0,
        distanceFalloff: 0.6,//1.0,
        intensity: 5.0,
        color: '#000000',
        halfRes: true,
        renderMode: "Combined",

  screenSpaceRadius: false,//true,
};

effectController = Object.assign({
  reset: function () {
    gui_N8AO.controllers.forEach((c,i)=>{if (i>0) c.reset()});
  },
}, effectController_default);

effectController_vrm_default = {
  'AO opacity': 1,
  'AO color': '#804020',
};

effectController_vrm = Object.assign({
  reset: function () {
    gui_vrm.controllers.forEach(c=>{c.reset()});
  },
}, effectController_vrm_default);
            },

            setup: function() {
const renderer = data.renderer;
const scene = data.scene;
const camera = data.camera;
const SL = threeX.SL;

this.pass = new THREE.N8AOPass(
        scene,
        camera,
        SL.width,
        SL.height
);
this.pass.enabled = this.enabled;
            },

            UI_order: 1,
            setup_UI: function () {
gui_N8AO = this.gui = PPE.gui.addFolder( 'SSAO (Selective) Parameters' );
gui_N8AO.add(effectController, 'enabled').onChange( ( value )=>{
  this.enabled = value;
});
gui_N8AO.add(effectController, "quality", ["Performance", "Low", "Medium", "High", "Ultra"]).onChange(v=>{
  this.pass.setQualityMode(v);
  for (const p of ['aoSamples', 'denoiseSamples', 'denoiseRadius']) {
    effectController[p] = this.pass.configuration[p];
    gui_N8AO.controllers.forEach(c=>{c.updateDisplay()});
  }
});
gui_N8AO.add(effectController, "aoSamples", 1.0, 64.0, 1.0);
gui_N8AO.add(effectController, "denoiseSamples", 1.0, 64.0, 1.0);
gui_N8AO.add(effectController, "denoiseRadius", 0.0, 24.0, 0.01);
gui_N8AO.add(effectController, "aoRadius", 1.0, 64.0, 0.01);
gui_N8AO.add(effectController, "distanceFalloff", 0.0, 2.0, 0.01);
gui_N8AO.add(effectController, "intensity", 0.0, 10.0, 0.01);
gui_N8AO.addColor(effectController, "color");
gui_N8AO.add(effectController, "halfRes");
gui_N8AO.add(effectController, "renderMode", ["Combined", "AO", "No AO", "Split", "Split AO"]);
gui_N8AO.add(effectController, 'reset' );

gui_vrm = this.gui_vrm = gui_N8AO.addFolder( 'VRM Specific Parameters' );
gui_vrm.add(effectController_vrm, 'AO opacity', 0.0, 1.0);
gui_vrm.addColor(effectController_vrm, 'AO color');
gui_N8AO.add(effectController_vrm, 'reset');

Object.assign(effectController, _effectController||{});
Object.assign(effectController_vrm, _effectController_vrm||{});
threeX.GUI.update(gui_N8AO);
threeX.GUI.update(gui_vrm);
            },

            resize: function (width, height) {
//this.pass.setSize(width, height);
            },

            render: function (scene, camera) {
this.pass.configuration.aoRadius = effectController.aoRadius;
this.pass.configuration.distanceFalloff = effectController.distanceFalloff;
this.pass.configuration.intensity = effectController.intensity;
this.pass.configuration.aoSamples = effectController.aoSamples;
this.pass.configuration.denoiseRadius = effectController.denoiseRadius;
this.pass.configuration.denoiseSamples = effectController.denoiseSamples;
this.pass.configuration.renderMode = ["Combined", "AO", "No AO", "Split", "Split AO"].indexOf(effectController.renderMode);
this.pass.configuration.halfRes = effectController.halfRes;
this.pass.configuration.screenSpaceRadius = effectController.screenSpaceRadius;

const color_base = this.pass._color_base_material[0].color;
color_base.set(effectController['color']);
this.pass._color_base_material.forEach(m=>{ m.color.copy(color_base); });

const color = this.pass._color_vrm_material[0].color;
color.set(effectController_vrm['AO color']);
for (const c of ['r','g','b'])
  color[c] = color[c] + (1-color[c]) * (1-effectController_vrm['AO opacity']);
this.pass._color_vrm_material.forEach(m=>{ m.color.copy(color); });

this.pass.configuration.gammaCorrection = false;//!(PPE.UnrealBloom.enabled || PPE.DOF.enabled);

return true;
            },

            get enabled() { return effectController.enabled; },
            set enabled(v) {
effectController.enabled = !!v;
this.gui.controllers[0].updateDisplay();

this.pass.enabled = v;

if (v) {
  if (!PPE.enabled)
    PPE.enabled = true;
}
else {
  if (PPE_list.every(n=>!PPE[n].enabled))
    PPE.enabled = false;
}
            },
          };

          return N8AO;
        })(),

        UnrealBloom: (()=>{
          let no_bloom_layer;
          let params_default, params, _params;
          let params_vrm_default, params_vrm, _params_vrm;
          let gui_bloom, gui_bloom_vrm;
          let darkMaterial, materials;
          let bloomComposer;
          let bloomPass;

          const vertexShader = [
'			varying vec2 vUv;',

'			void main() {',

'				vUv = uv;',

'				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );',

'			}',
          ].join('\n');

          const fragmentShader = [
'			uniform sampler2D baseTexture;',
'			uniform sampler2D bloomTexture;',

'			varying vec2 vUv;',

'			void main() {',

//'				gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );',

'vec4 base_color = texture2D(baseTexture, vUv);',
'vec4 bloom_color = texture2D(bloomTexture, vUv);',
//'gl_FragColor = base_color + bloom_color;',

'float lum = 0.21 * bloom_color.r + 0.71 * bloom_color.g + 0.07 * bloom_color.b;',
//'gl_FragColor = vec4(mix(bloom_color.rgb, base_color.rgb + bloom_color.rgb, base_color.a), max(base_color.a, lum));',
'gl_FragColor = vec4(base_color.rgb + bloom_color.rgb, max(base_color.a, lum));',

// https://discourse.threejs.org/t/srgbencoding-with-post-processing/12582/6
//'				gl_FragColor = LinearTosRGB(( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) ));',
//'gl_FragColor = LinearTosRGB(gl_FragColor);',//mix(gl_FragColor, LinearTosRGB(gl_FragColor), 0.6667);',

'			}',
          ].join('\n');

          let vrm_bloom_factor = 0.2;

          const UnrealBloom = {
            get params() { return params || _params; },
            set params(v) {
_params = v;
if (PPE_initialized) {
  Object.assign(params, v);
  threeX.GUI.update(this.gui);
//console.log(params)
}
            },

            get params_vrm() { return params_vrm || _params_vrm; },
            set params_vrm(v) {
_params_vrm = v;
if (PPE_initialized) {
  Object.assign(params_vrm, v);
  threeX.GUI.update(this.gui_vrm);
//console.log(params_vrm)
}
            },

            NO_BLOOM: NO_BLOOM,

            init: async function () {
const UnrealBloomPass = await import(System.Gadget.path + '/three.js/postprocessing/UnrealBloomPass.js');
THREE.UnrealBloomPass = UnrealBloomPass.UnrealBloomPass;

no_bloom_layer = new THREE.Layers();
no_bloom_layer.set( NO_BLOOM );

params_default = {
  enabled: false,//true,
//  exposure: 1,
  bloomStrength: 0.4,//0.8,
  bloomRadius: 0.4,
  bloomThreshold: 0.43,//0.3,
};

params = Object.assign({
  reset: function () {
    gui_bloom.controllers.forEach((c,i)=>{if (i>0) c.reset()});
  },
}, params_default);

params_vrm_default = {
/*
const p = m.userData.gltfExtensions.VRMC_materials_mtoon;
m.parametricRimFresnelPowerFactor = p.parametricRimFresnelPowerFactor * 2;
m.parametricRimLiftFactor = p.parametricRimLiftFactor * 2
//m.rimLightingMixFactor = p.rimLightingMixFactor * 2
//m.parametricRimColorFactor.set('white')
//m.matcapFactor.set('white')
*/
  bloom_factor: vrm_bloom_factor,
  RimFresnelPower: 1,
  RimLift: 1,
};

params_vrm = Object.assign({
  reset: function () {
    gui_bloom_vrm.controllers.forEach(c=>{c.reset()});
  },
}, params_vrm_default);

darkMaterial = new THREE.MeshBasicMaterial( { color: 'black' } );
materials = {};
            },

            setup: function() {
const renderer = data.renderer;
const scene = data.scene;
const camera = data.camera;
const SL = threeX.SL;

//THREEX.ColorManagement.enabled = false;
//renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
//renderer.toneMapping = THREE.ReinhardToneMapping;

bloomPass = new THREE.UnrealBloomPass( new THREE.Vector2( SL.width, SL.height ), 1.5, 0.4, 0.85 );
bloomPass.threshold = params.bloomThreshold;
bloomPass.strength = params.bloomStrength;
bloomPass.radius = params.bloomRadius;

bloomComposer = new THREE.EffectComposer( renderer );
bloomComposer.renderToScreen = false;
bloomComposer.addPass( renderScene );
bloomComposer.addPass( bloomPass );

this.mix_pass = new THREE.ShaderPass(
  new THREE.ShaderMaterial( {
    uniforms: {
      baseTexture: { value: null },
// not using bloomComposer.renderTarget2.texture since the final mix in UnrealBloom.js has been canceled (when it is not rendered to screen)
      bloomTexture: { value: bloomPass.renderTargetsHorizontal[ 0 ].texture }
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    defines: {}
  } ),
  'baseTexture'
);
this.mix_pass.needsSwap = true;
this.mix_pass.enabled = this.enabled;
            },

            UI_order: 0,
            setup_UI: function () {
gui_bloom = this.gui = PPE.gui.addFolder( 'Unreal Bloom (Selective) Parameters' );
gui_bloom.add( params, 'enabled' ).onChange( ( value )=>{
  this.enabled = value;
});

gui_bloom.add( params, 'bloomThreshold', 0.0, 1.0 ).onChange( function ( value ) {
  bloomPass.threshold = Number( value );
});

gui_bloom.add( params, 'bloomStrength', 0.0, 10.0 ).onChange( function ( value ) {
  bloomPass.strength = Number( value );
});

gui_bloom.add( params, 'bloomRadius', 0.0, 1.0 ).step( 0.01 ).onChange( function ( value ) {
  bloomPass.radius = Number( value );
});
gui_bloom.add( params, 'reset' );

gui_bloom_vrm = this.gui_vrm = gui_bloom.addFolder( 'VRM Specific Parameters' );
gui_bloom_vrm.add( params_vrm, 'bloom_factor', 0.0, 1.0 ).onChange( function ( value ) {
  vrm_bloom_factor = Number( value );
});
gui_bloom_vrm.add( params_vrm, 'RimFresnelPower', 0.0, 5.0 ).onChange( function ( value ) {
  const v = Number( value );
  MMD_SA.THREEX.get_model(0).model.materials.forEach(m=>{
    const p = m.userData.gltfExtensions.VRMC_materials_mtoon;
    m.parametricRimFresnelPowerFactor = (('parametricRimFresnelPowerFactor' in p) ? p.parametricRimFresnelPowerFactor : 5) * v;
 });
});
gui_bloom_vrm.add( params_vrm, 'RimLift', 0.0, 5.0 ).onChange( function ( value ) {
  const v = Number( value );
  MMD_SA.THREEX.get_model(0).model.materials.forEach(m=>{
    const p = m.userData.gltfExtensions.VRMC_materials_mtoon;
    m.parametricRimLiftFactor = (('parametricRimLiftFactor' in p) ? p.parametricRimLiftFactor : 0.1) * v;
 });
});
gui_bloom_vrm.add( params_vrm, 'reset' );

Object.assign(params, _params||{});
Object.assign(params_vrm, _params_vrm||{});
threeX.GUI.update(gui_bloom);
threeX.GUI.update(gui_bloom_vrm);
            },

            resize: function (width, height) {
bloomComposer.setSize( width, height );
            },

            render: function (scene, camera) {
function renderBloom( mask ) {
  const _backgroundIntensity = scene.backgroundIntensity;
  scene.backgroundIntensity *= 0.25;
  const _environmentIntensity = scene.environmentIntensity;
  scene.environmentIntensity *= 0.25;

  if ( mask === true ) {
    MMD_SA.THREEX.get_model(0).model.materials.forEach(m=>{
// assign rgb values directly instead of using *= or /= (not working probably because of its getter/setting nature)
// https://github.com/pixiv/three-vrm/blob/dev/packages/three-vrm-materials-mtoon/src/MToonMaterial.ts#L63
// should be safe to assume (1,1,1) by default
//      if (!m._color_) m._color_ = m.color.clone();

      m.color.r = vrm_bloom_factor;
      m.color.g = vrm_bloom_factor;
      m.color.b = vrm_bloom_factor;
    });

    scene.traverse( darkenNonBloomed );
    bloomComposer.render();
    scene.traverse( restoreMaterial );

    MMD_SA.THREEX.get_model(0).model.materials.forEach(m=>{
//      m.color.copy(m._color_);
      m.color.r = m.color.g = m.color.b = 1;
    });
  }
  else {
    camera.layers.set( ENTIRE_SCENE);
    bloomComposer.render();
    camera.layers.set( ENTIRE_SCENE );
  }

  scene.backgroundIntensity = _backgroundIntensity;
  scene.environmentIntensity = _environmentIntensity;
}

function darkenNonBloomed( obj ) {
  if ( (obj.isMesh || obj.isSprite) && no_bloom_layer.test( obj.layers ) === true ) {
    materials[ obj.uuid ] = obj.material;
    obj.material = darkMaterial;
  }
}

function restoreMaterial( obj ) {
  if ( materials[ obj.uuid ] ) {
    obj.material = materials[ obj.uuid ];
    delete materials[ obj.uuid ];
  }
}

//return false;

// https://github.com/mrdoob/three.js/wiki/Migration-Guide#154--155
// The inline tone mapping controlled via WebGLRenderer.toneMapping only works when rendering to screen now (similar to WebGLRenderer.outputColorSpace). In context of post processing, use OutputPass to apply tone mapping and color space conversion.
// data.renderer.toneMapping = THREE.ReinhardToneMapping;

// render scene with bloom
renderBloom( true );

data.renderer.toneMapping = THREE.NoToneMapping;//LinearToneMapping;//ACESFilmicToneMapping;//

return true;
            },

            setup_rim_light: function () {
const enabled = PPE.enabled && this.enabled;
if (enabled) {
  vrm_bloom_factor = params_vrm.bloom_factor;
  MMD_SA.THREEX.get_model(0).model.materials.forEach(m=>{
    const p = m.userData.gltfExtensions.VRMC_materials_mtoon;
    if ('parametricRimFresnelPowerFactor' in p) {
      m.parametricRimFresnelPowerFactor = p.parametricRimFresnelPowerFactor * params_vrm.RimFresnelPower;
    }
    else {
      const c = 0.25;//Math.min(threeX.light.obj.DirectionalLight[0].intensity/20, 1);
      m.parametricRimColorFactor.setRGB(c,c,c);
      m.parametricRimFresnelPowerFactor = 5 * params_vrm.RimFresnelPower;
    }

    m.parametricRimLiftFactor = (('parametricRimLiftFactor' in p) ? p.parametricRimLiftFactor : 0.1) * params_vrm.RimLift;

//m.matcapFactor.set('white')
//m.parametricRimColorFactor.setRGB(0.1,0.1,0.1)
//m.rimLightingMixFactor=1
//m.parametricRimFresnelPowerFactor=5
//m.parametricRimLiftFactor=1
  });
}
else {
  vrm_bloom_factor = params_vrm_default.bloom_factor;
  MMD_SA.THREEX.get_model(0).model.materials.forEach(m=>{
// https://github.com/pixiv/three-vrm/blob/dev/packages/three-vrm-materials-mtoon/src/MToonMaterial.ts#L411
    const p = m.userData.gltfExtensions.VRMC_materials_mtoon;
    if ('parametricRimFresnelPowerFactor' in p) {
      m.parametricRimFresnelPowerFactor =  p.parametricRimFresnelPowerFactor;
    }
    else {
      m.parametricRimColorFactor.setRGB(0,0,0);
      m.parametricRimFresnelPowerFactor = 1;
    }

    m.parametricRimLiftFactor = (('parametricRimLiftFactor' in p) ? p.parametricRimLiftFactor : 0);
  });
}
            },

            get enabled() { return params.enabled; },
            set enabled(v) {
params.enabled = !!v;
this.gui.controllers[0].updateDisplay();

this.mix_pass.enabled = v;

if (v) {
  if (!PPE.enabled)
    PPE.enabled = true;
}
else {
  if (PPE_list.every(n=>!PPE[n].enabled))
    PPE.enabled = false;
}

this.setup_rim_light();
            },

          };

          return UnrealBloom;
        })(),
      };

      return PPE;
    })(),

    GUI: {
      obj: {},

      create: function () {
const gui = new THREE.GUI();

const host = SL_Host;
host.appendChild(gui.domElement);
gui.domElement.addEventListener('mousedown', (e)=>{
//  e.preventDefault();
  e.stopPropagation();
});

gui.domElement.addEventListener('click', (e)=>{ e.stopPropagation(); });
document.addEventListener('click', (e)=>{
  let d = document.activeElement;
  while (d) {
    d = d.parentElement;
    if (d == gui.domElement) {
      document.activeElement.blur();
//DEBUG_show(Date.now())
    }
  }
});

gui.add({
  'Hide Controls': function () {
    gui.hide();
  },
}, 'Hide Controls');
console.log(gui);

gui.hide();

return gui;
      },

      update: function (gui) {
gui.controllers.forEach(c=>{
  const v = c.object[c._name];
  if (typeof c != 'function')
    c.setValue(v);
});
      },

      init: async function () {
const GUI = await import(System.Gadget.path + '/three.js/libs/lil-gui.module.min.js');
THREE.GUI = GUI.GUI;

const gui = this.obj.visual_effects = this.create();

const gui_light_and_camera = gui.addFolder( 'Light and camera' );

window.addEventListener('MMDStarted', (()=>{
  function update_tray() {
    function f() {
      System._browser.update_tray();
    }

    System._browser.on_animation_update.remove(f, 0);
    System._browser.on_animation_update.add(f, 0,0);
  }

  return ()=>{
let dir_light_pos = MMD_SA_options._light_position;
threeX.light.params_directional_light_default = {
  color: MMD_SA_options._light_color,
  x: dir_light_pos[0],
  y: dir_light_pos[1],
  z: dir_light_pos[2],
};

const params = threeX.light.params_directional_light = Object.assign({
  reset: function () {
/*
    const light = MMD_SA.light_list[1].obj;
    System.Gadget.Settings.writeString('MMDLightColor', '');
    System.Gadget.Settings.writeString('MMDLightPosition', '');
    light.color.set(MMD_SA_options.light_color);
    light.position.fromArray(MMD_SA_options.light_position).add(THREE.MMD.getModels()[0].mesh.position);
    System._browser.update_tray();
*/
    gui_directional_light.controllers.forEach(c=>{c.reset()});
  },
}, threeX.light.params_directional_light_default);

const gui_directional_light = gui_light_and_camera.addFolder( 'Directional Light Parameters' );
gui_directional_light.addColor( params, 'color' ).onChange( function ( value ) {
  const light = MMD_SA.light_list[1].obj;
  System.Gadget.Settings.writeString('MMDLightColor', value);
  light.color.set(MMD_SA_options.light_color);
  update_tray();
});
for (const d of ['x', 'y', 'z']) {
  gui_directional_light.add( params, d, -1,1 ).onChange( function ( value ) {
    const v = Number(value);
    const light = MMD_SA.light_list[1].obj;
    v1.set(params.x, params.y, params.z);
    v1[d] = v;
    System.Gadget.Settings.writeString('MMDLightPosition', '[' + v1.toArray().join(',') + ']');
    light.position.fromArray(MMD_SA_options.light_position).add(_THREE.MMD.getModels()[0].mesh.position);
    update_tray();
  });
}
gui_directional_light.add( params, 'reset' );

dir_light_pos = MMD_SA_options.light_position;
Object.assign(params, {
  color: MMD_SA_options.light_color,
  x: dir_light_pos[0]/MMD_SA_options.light_position_scale,
  y: dir_light_pos[1]/MMD_SA_options.light_position_scale,
  z: dir_light_pos[2]/MMD_SA_options.light_position_scale,
});
gui_directional_light.controllers.forEach(c=>{c.updateDisplay()});

gui_directional_light.close();

const params_camera = Object.assign({
  reset: function () {
    gui_camera.controllers.forEach(c=>{c.reset()});
  },
}, {
  'FOV (main camera)': 50,
  'FOV (hand camera)': 60,
});

const hand_camera = MMD_SA_options.Dungeon_options?.item_base.hand_camera;

const gui_camera = gui_light_and_camera.addFolder( 'Camera' );
gui_camera.add( params_camera, 'FOV (main camera)', 30, 120, 1 ).onChange( function ( value ) {
  System.Gadget.Settings.writeString('LABEL_CameraFOV', (value==50)?'':value);
  MMD_SA._trackball_camera.object.fov = value;
  MMD_SA._trackball_camera.object.updateProjectionMatrix();
});
gui_camera.add( params_camera, 'FOV (hand camera)', 30, 120, 1 ).onChange( function ( value ) {
  if (hand_camera)
    hand_camera.fov = value;
});
gui_camera.add( params_camera, 'reset' );
gui_camera.close();

if (System.Gadget.Settings.readString('LABEL_CameraFOV'))
  params_camera['FOV (main camera)'] = parseInt(System.Gadget.Settings.readString('LABEL_CameraFOV'));
if (hand_camera) {
  if (hand_camera.fov) {
    params_camera['FOV (hand camera)'] = hand_camera.fov;
  }
  else {
    hand_camera.fov = params_camera['FOV (hand camera)'];
  }
}
threeX.GUI.update(gui_camera);
  };
})());
      },
    },

    load_scripts: async function () {
loading = true

//await System._browser.load_script('./three.js/three.min.js');

const THREE_module = await import(System.Gadget.path + '/three.js/' + threeX.three_filename);
self.THREE = {};
Object.assign(self.THREE, THREE_module);

const Geometry_module = await import(System.Gadget.path + '/three.js/Geometry.js');
Object.assign(self.THREE, Geometry_module);

self.THREE.XLoader = _THREE.XLoader;

if (MMD_SA_options.THREEX_options.use_OutlineEffect) {
// Jun 10, 2023
  const OutlineEffect_module = await import(System.Gadget.path + '/three.js/effects/OutlineEffect.js');
  Object.assign(self.THREE, OutlineEffect_module);
  console.log('OutlineEffect.js loaded')
}

if (MMD_SA_options.THREEX_options.use_MMD) {
  const MMD_module = await import(System.Gadget.path + '/three.js/loaders/MMDLoader.js');
  Object.assign(self.THREE, MMD_module);
  console.log('MMDLoader.js loaded')
  if (MMD_SA_options.THREEX_options.use_MMDAnimationHelper) {
    const MMDAnimationHelper_module = await import(System.Gadget.path + '/three.js/animation/MMDAnimationHelper.js');
    Object.assign(self.THREE, MMDAnimationHelper_module);
    console.log('MMDAnimationHelper.js loaded')
  }
}

// Apr 3, 2024
const GLTFLoader_module = await import(System.Gadget.path + '/three.js/loaders/GLTFLoader.js');
Object.assign(self.THREE, GLTFLoader_module);

//const GLTFExporter_module = await import(System.Gadget.path + '/three.js/exporters/GLTFExporter.js');
//Object.assign(self.THREE, GLTFExporter_module);

//const BVHLoader_module = await import(System.Gadget.path + '/three.js/BVHLoader.js'); Object.assign(self.THREE, BVHLoader_module);

// three-vrm 1.0
if (use_VRM1) {
  await System._browser.load_script('./three.js/three-vrm.min.js');//_v1.0.5.js');//_TEST.js');//
}
else {
  await System._browser.load_script('./three.js/three-vrm.min_v0.6.11.js');
}

THREE = self.THREEX = self.THREE
self.THREE = _THREE

//await this.PPE.init();

if (MMD_SA_options.Dungeon_options && MMD_SA_options.Dungeon.use_octree) await this.utils.load_octree();


// extend three-vrm START
// three.vrm 1.0
if (use_VRM1 && !THREE.VRMSpringBoneManager.prototype.setCenter) {
// https://github.com/pixiv/three-vrm/issues/1112
// https://pixiv.github.io/three-vrm/packages/three-vrm/docs/classes/VRMSpringBoneManager.html#joints
  THREE.VRMSpringBoneManager.prototype.setCenter = function (obj3d) {
    this.joints.forEach(joint=>{
//console.log(joint.center)
      joint.center = obj3d;
    });
  };
}
// extend three-vrm END


// extend three.js START

// http://www.euclideanspace.com/maths/geometry/rotations/conversions/quaternionToAngle/
// https://github.com/mrdoob/three.js/blob/master/src/math/Vector4.js
THREE.Quaternion.prototype.toAxisAngle = function () {
  if (this.w > 1) this.normalize(); // if w>1 acos and sqrt will produce errors, this cant happen if quaternion is normalised
  var angle = 2 * Math.acos(this.w);
  var s = Math.sqrt(1-this.w*this.w); // assuming quaternion normalised then w is less than 1, so term always positive.
  if (s < 0.0001) { // test to avoid divide by zero, s is always positive due to sqrt
    // if s close to zero then direction of axis not important
    x = 1;//this.x; // if it is important that axis is normalised then replace with x=1; y=z=0;
    y = 0;//this.y;
    z = 0;//this.z;
  } else {
    x = this.x / s; // normalise axis
    y = this.y / s;
    z = this.z / s;
  }

  return [new THREE.Vector3(x,y,z), angle]
};

// backward compatibility START

THREE.Euler.prototype.multiplyScalar = THREE.Vector3.prototype.multiplyScalar;
THREE.Euler.prototype.add = THREE.Vector3.prototype.add;
THREE.Euler.prototype.setEulerFromQuaternion = THREE.Euler.prototype.setFromQuaternion;
THREE.Euler.prototype.copy = function ( euler ) {
  if (euler._order === undefined) {
    this._x = euler.x;
    this._y = euler.y;
    this._z = euler.z;
  }
  else {
    this._x = euler._x;
    this._y = euler._y;
    this._z = euler._z;
    this._order = euler._order;
  }

  this._onChangeCallback();
  return this;
};

THREE.Box3.prototype.size = function (size_v3=new THREE.Vector3()) {
  return this.getSize(size_v3);
};
THREE.Box3.prototype.center = function (center_v3=new THREE.Vector3()) {
  return this.getCenter(center_v3);
};

THREE.Vector3.prototype.getPositionFromMatrix = THREE.Vector3.prototype.setFromMatrixPosition;

THREE.Quaternion.prototype.setFromEuler = (function () {
  const setFromEuler = THREE.Quaternion.prototype.setFromEuler;

  return function (euler, order) {
    if (order) euler._order = order;
    return setFromEuler.call(this, euler);
  };
})();

THREE.Matrix4.decompose = (function () {
  const decompose = THREE.Matrix4.decompose;

  return function (position, quaternion, scale) {
    if (position) return decompose.call(this, position, quaternion, scale);

    position = new THREE.Vector3();
    quaternion = new THREE.Quaternion();
    scale = new THREE.Vector3();

    decompose.call(this, position, quaternion, scale);
    return [position, quaternion, scale];
  };
})();

THREE.BufferGeometry.prototype.applyMatrix = THREEX.BufferGeometry.prototype.applyMatrix4;

THREE.Math = THREE.MathUtils;

Object.defineProperty(THREE.Object3D.prototype, 'renderDepth', {
  get: function () { return this.renderOrder; },
  set: function (v) { this.renderOrder = v; },
});

Object.defineProperty(THREEX.Mesh.prototype, 'useQuaternion', {
  get: ()=>true,
  set: ()=>{},
});

// backward compatibility END

// extend three.js END


loading = false
loaded = true
resolve_loading && resolve_loading()
    },

    mesh_obj: (function () {
      function mesh_obj(id, obj) {
this.id = id
this._obj = obj

mesh_obj_by_id[id] = this
      }

      mesh_obj.prototype.three = function () {
return this._obj;
      };

      mesh_obj.prototype.show = function () {
this._obj.visible = true;
if (!threeX.enabled) {
  this._obj.traverse(c=>{
    if (c.isMesh) c.visible = true;
  });
}
      };

      mesh_obj.prototype.hide = function () {
this._obj.visible = false;
if (!threeX.enabled) {
  this._obj.traverse(c=>{
    if (c.isMesh) c.visible = false;
  });
}
      };

      const mesh_obj_by_id = {};

      let mesh_obj_list = [];

      window.addEventListener("jThree_ready", () => {
const THREE = threeX.THREE;

const img_dummy = (MMD_SA.THREEX.enabled) ? null : document.createElement('canvas');
if (!MMD_SA.THREEX.enabled) img_dummy.width = img_dummy.height = 1;

MMD_SA_options.x_object.forEach((x_obj, idx) => {
  if (!x_obj.path) return

// separating url and toFileProtocol(url) here, but x_obj.path is almost always a zip url, so they are effectively the same anyways (i.e. not a blob url)
  const url = x_obj.path;
  new THREE.XLoader( toFileProtocol(url), function( mesh ) {
var model_filename = toLocalPath(url).replace(/^.+[\/\\]/, "")
var model_filename_cleaned = model_filename.replace(/[\-\_]copy\d+\.x$/, ".x").replace(/[\-\_]v\d+\.x$/, ".x")
var model_para = MMD_SA_options.model_para[model_filename] || MMD_SA_options.model_para[model_filename_cleaned] || {}

const _mesh = mesh;
mesh = new THREE.Object3D()
mesh.add(_mesh)
//console.log(mesh)

let material_para = model_para.material_para || {}
material_para = material_para._default_ || {}
if (material_para.receiveShadow != false)
  mesh.receiveShadow = true

if (MMD_SA.THREEX.enabled) {
}
else {
  if (model_para.instanced_drawing)
    mesh.instanced_drawing = model_para.instanced_drawing
//  mesh.instanced_drawing = 99

  mesh.useQuaternion = true
}

threeX.mesh_obj.set("x_object" + idx, mesh)

mesh.scale.set(0,0,0)

//console.log(mesh)
MMD_SA.fn.setupUI()
  }, function() {
  });
});

MMD_SA.GOML_head_list.sort((...ab)=>{
  const score = [];
  ab.forEach((obj,i)=>{
    switch (obj.tag) {
      case 'txr':
        score[i] = -3;
        break;
      case 'geo':
        score[i] = -2;
        break;
      default:
        score[1] = 0;
    }
  });

  return score[0] - score[1];
});

var mtl_id_used = {};

MMD_SA.GOML_head_list.forEach(obj=>{
  if (obj.tag == 'txr') {
// { tag:'txr', id:'DungeonPlane'+i+'TXR', src:p_obj.map, para:{ repeat:[1,1] } }
    const tex = new THREE.Texture(img_dummy);
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    if (obj.para.repeat) tex.repeat.set(...obj.para.repeat);
    if (MMD_SA.THREEX.enabled) tex.colorSpace = THREE.SRGBColorSpace;

    const img = new Image();
    img.onload = ()=>{
      tex.image = img;
      tex.needsUpdate = true;
      MMD_SA.fn.setupUI();
    };
    img.src = toFileProtocol(obj.src);

    threeX.mesh_obj.set(obj.id, tex, true);
  }
  else if (obj.tag == 'geo') {
// { tag:'geo', id:'DungeonGEO_' + (geo), type:'Plane', para:[1,1, parseInt(RegExp.$1),parseInt(RegExp.$2)] }
    const geo = new THREE[obj.type + 'Geometry'](...obj.para);
    threeX.mesh_obj.set(obj.id, geo, true);
    MMD_SA.fn.setupUI();
  }
  else if (obj.tag == 'mtl') {
// { tag:'mtl', id:'DungeonPlane'+i+'MTL', type:'MeshPhong', para:mtl_param_common, para_extra:mtl_param_common_extra }
/*
  var mtl_param_common = {};
  if (p_obj.opacity == null) mtl_param_common.transparent = false;
//'renderOrder' : 'renderDepth'
  if (p_obj.renderDepth != null) mtl_param_common.renderDepth = p_obj.renderDepth;
  if (p_obj.side) mtl_param_common.side = p_obj.side;
  if (p_obj.map) mtl_param_common.map = 'DungeonPlane'+p_obj.map_id+'TXR';
  if (p_obj.normalMap) mtl_param_common.normalMap = 'DungeonPlane'+p_obj.normalMap_id+'TXR_N';
//'color' : 'ambient'
  if (p_obj.ambient) mtl_param_common.ambient = p_obj.ambient;
  if (p_obj.specularMap) {
    mtl_param_common.specularMap = 'DungeonPlane'+p_obj.specularMap_id+'TXR_S';
    mtl_param_common.specular = '#FFFFFF';
  }
  else {
    if (p_obj.specular) mtl_param_common.specular = p_obj.specular;
  }
  if (p_obj.emissive) mtl_param_common.emissive = p_obj.emissive;
*/
    const mtl = new THREE[obj.type + 'Material']();

    if (MMD_SA.THREEX.enabled) {
      if (obj.renderDepth) {
        obj.renderOrder = obj.renderDepth;
        delete obj.renderDepth;
      }
      if (obj.ambient) {
        obj.color = obj.ambient;
        delete obj.ambient;
      }
    }

    const mtl_id_used_count = mtl_id_used[obj.id]||0;
    mtl_id_used[obj.id] = mtl_id_used_count + 1;

    for (const map of ['map', 'normalMap', 'specularMap', 'displacementMap']) {
      if (obj.para[map])
        obj.para[map] = threeX.mesh_obj.get_three(obj.para[map]);
// a workaround for material.repeat trick in old THREE
      if (!MMD_SA.THREEX.enabled && (map == 'map') && (mtl_id_used_count > 0)) {
console.log('THREEX: Texture cloned (' + obj.id + '.' + map + ')');
        obj.para[map] = obj.para[map].clone();
      }
//if (map != 'map') delete obj.para[map];
    }

    for (const color of ['color', 'ambient', 'specular', 'emissive']) {
      if (obj.para[color]) {
        if (mtl[color] != null) {
          obj.para[color] = mtl[color].set(obj.para[color]);
        }
        else {
console.error('THREEX error: No .' + color + ' in material');
          delete obj.para[color];
        }
      }
    }

    Object.assign(mtl, obj.para, obj.para_extra);

    threeX.mesh_obj.set(obj.id, mtl, true);
    MMD_SA.fn.setupUI();
  }
});

MMD_SA.GOML_scene_list.forEach(obj=>{
  if (obj.tag == 'mesh') {
// { tag:'mesh', id:'DungeonPlane'+i+'MESH_LV'+lvl, geo:'DungeonGEO_'+geo_id, mtl:'DungeonPlane'+i+'MTL' + ((p_obj.displacementMap && (geo_id != "1x1"))?'_D':''), instanced_drawing:instanced_drawing||null, style:{ scale:0, opacity:p_obj.opacity||null } }
    const mesh = new THREE.Mesh();
    mesh.geometry = threeX.mesh_obj.get_three(obj.geo);
    mesh.material = threeX.mesh_obj.get_three(obj.mtl);
    if (obj.instanced_drawing && !MMD_SA.THREEX.enabled)
      mesh.instanced_drawing = obj.instanced_drawing;
    if (obj.style.scale != null)
      mesh.scale.setScalar(obj.style.scale);
    if (obj.style.opacity != null)
      mesh.opacity = obj.style.opacity;

    threeX.mesh_obj.set(obj.id, mesh);
  }
});
      });

      let scene_obj_waiting_list = [];

      window.addEventListener("GOML_ready", () => {
scene_obj_waiting_list.forEach(obj=>{
  threeX.scene.add(obj);
  obj.visible = false;
});
scene_obj_waiting_list.length = 0;

MMD_SA_options.mesh_obj_preload_list.forEach(obj => {
  threeX.mesh_obj.set(obj.id, obj.create())
});
      });

      return {
get: function (id) {
  id = id.replace(/^\#/, '');
  return mesh_obj_by_id[id] || jThree('#' + id);
},

get_three: function (id) {
  return this.get(id).three(0);
},

set: function (id, obj, skip_scene) {
  new mesh_obj(id, obj)

  if (!skip_scene) {
    if (threeX.scene) {
      threeX.scene.add(obj)
      obj.visible = false
    }
    else {
      scene_obj_waiting_list.push(obj);
    }
  }

  return obj
}
      };
    })(),

    renderer: (function () {
      var _device_framebuffer = null;

      window.addEventListener('jThree_ready', function () {
// a "hack" to set default framebuffer for WebXR
if (threeX.enabled) {
  const state = threeX.renderer.obj.state;
  state._bindFramebuffer = state.bindFramebuffer;
  state.bindFramebuffer = function ( target, framebuffer ) {
    return this._bindFramebuffer( target, (framebuffer === null) ? _device_framebuffer : framebuffer );
  };
}
      });

      return {
        get obj() { return (threeX.enabled) ? data.renderer : MMD_SA._renderer; },

// device framebuffer (mainly for WebXR)
        get device_framebuffer() { return _device_framebuffer; },
        set device_framebuffer(fb) {
if (fb != _device_framebuffer) {
  _device_framebuffer = fb;
  const _gl = this.obj.getContext();
  if (threeX.enabled) {
    this.obj.state.bindFramebuffer(_gl.FRAMEBUFFER, fb);
  }
  else {
    _gl.bindFramebuffer(_gl.FRAMEBUFFER, fb);
  }
}
        },

        get devicePixelRatio() { return (threeX.enabled) ? this.obj.getPixelRatio() : this.obj.devicePixelRatio; },
        set devicePixelRatio(v) {
if (!threeX.enabled) {
  this.obj.devicePixelRatio = v;
}
else {
  this.obj.setPixelRatio(v);
}
        },

        setSize: function (width, height) {
MMD_SA._renderer.setSize(width, height);
threeX.enabled && this.obj.setSize(width, height);
        },

        render: function (scene, camera) {
if (!threeX.enabled) return false

threeX.camera.update(camera)

var lights = scene.__lights
lights.forEach(light=>{
  threeX.light.update(light)
});

obj_list.forEach((obj) => {
  var mesh = obj.obj
  var p = obj.parent
  if (!p) {
    mesh.visible = false
    return
  }

  mesh.position.copy(p.position)
  mesh.quaternion.copy(p.quaternion)
  if (!obj.no_scale)
    mesh.scale.copy(p.scale)
  mesh.visible = p.visible

  obj.update && obj.update()
});

if (MMD_SA.MMD_started) {
  _THREE.MMD.getModels().forEach((m,idx)=>{
    var mesh = m.mesh

// if mesh.matrixAutoUpdate is true, update the model matrixWorld here (AFTER the default routine of MMD mesh matrixWorld update)
    if (mesh.matrixAutoUpdate) {
      MMD_SA.THREEX.get_model(idx).update_model();
    }

// MMD physics (.simulate()) has been skipped. Do the necessary stuff here.
    if (mesh._reset_rigid_body_physics_ > 0) {
      mesh._reset_rigid_body_physics_ = Math.max(mesh._reset_rigid_body_physics_ - Math.min(RAF_timestamp_delta/1000*30, 1), 0)
    }

    m.simulateCallback && m.simulateCallback();
  });
}

if (!System._browser.rendering_check()) return true;

let obj_hidden_list = [];
if (MMD_SA.hide_3D_avatar) {
  const obj_check_list = [models[0].mesh];
  if (MMD_SA_options.Dungeon) {
    obj_check_list.push(MMD_SA_options.mesh_obj_by_id["DomeMESH"]._obj);
    if (MMD_SA.THREEX._object3d_list_)
      obj_check_list.push(...MMD_SA.THREEX._object3d_list_.map(obj=>obj._obj));
  }
  obj_check_list.forEach(obj=>{
    if (obj.visible) {
      obj.visible = false;
      obj_hidden_list.push(obj);
    }
  });
}

if (threeX.use_OutlineEffect) {
//  data.renderer.autoClear = true
  data.OutlineEffect.render( data.scene, data.camera );
//  data.renderer.autoClear = false
}
else {
  if (!threeX.PPE.render(data.scene, data.camera)) {
    data.renderer.toneMapping = THREE.NoToneMapping;
    data.renderer.render(data.scene, data.camera);
  }
}

obj_hidden_list.forEach(obj=>{
  obj.visible = true;
});

//DEBUG_show(Date.now())
return true
        }
      };
    })(),

    camera: {
      get obj() { return (threeX.enabled) ? data.camera : (MMD_SA._renderer.__camera || MMD_SA._trackball_camera.object); },

      clone: function (camera) {
if (!threeX.enabled) return

// camera.near needs to be big enough to avoid flickers in N8AO
var c = new THREE.PerspectiveCamera( camera.fov, camera.aspect, Math.max(camera.near,1), camera.far )
camera._THREEX_child = c

if (!data.camera) data.camera = c
return c
      },

      update: function (camera) {
if (!threeX.enabled) return;

var c = camera._THREEX_child;
if (!c) return;

c.position.copy(camera.position)
c.quaternion.copy(camera.quaternion)
c.up.copy(camera.up)

c.matrixAutoUpdate = camera.matrixAutoUpdate
if (!c.matrixAutoUpdate) {
  c.matrix.copy(camera.matrix);
  c.matrixWorld.copy(camera.matrixWorld);
}

// always update projection matrix when necessary, as there are compatibility issues simply by copying the projection matrix from the old camera
if (c.fov != camera.fov) {
  c.fov = camera.fov;
  c.updateProjectionMatrix();
}
      },

      resize: function (width, height) {
(MMD_SA._renderer.__camera || MMD_SA._trackball_camera.object).resize(width, height);
if (threeX.enabled) {
  this.obj.aspect = width/height
  this.obj.updateProjectionMatrix()
}
      },

      control: {
        enabled: true
      }
    },

    light: (()=>{
      const obj = {
        AmbientLight: [],
        DirectionalLight: [],
      };

      return {
        obj: {
          get AmbientLight() { return (threeX.enabled) ? obj.AmbientLight : []; },
          get DirectionalLight() { return (threeX.enabled) ? obj.DirectionalLight : []; },
        },

        clone: function (light) {
if (!threeX.enabled) return

var type
if (light instanceof _THREE.DirectionalLight) {
  type = 'DirectionalLight'
}
else if (light instanceof _THREE.AmbientLight) {
  type = 'AmbientLight'
}

var l = new THREE[type]()
light._THREEX_child = l
l._THREE_parent = light;

obj[type].push(l);

// https://threejs.org/docs/#api/en/lights/DirectionalLight
if (type == 'DirectionalLight') {
  const para = MMD_SA_options.shadow_para
  l.shadow.mapSize.set(para.shadowMapWidth, para.shadowMapWidth)

  data.scene.add(l.target)
}

data.scene.add(l)
        },

        update: function (light) {
if (!threeX.enabled) return

var c, c_max;
c = light._THREEX_child;
c.position.copy(light.position);
c.color.copy(light.color);
c_max = Math.max(c.color.r, c.color.g, c.color.b);

// r149 => r150
// https://github.com/mrdoob/three.js/wiki/Migration-Guide#r149--r150
//threeX.renderer.obj.physicallyCorrectLights=true;
//if (threeX.renderer.obj.physicallyCorrectLights) c_max *= 5;

// .useLegacyLights is obsolete
//threeX.renderer.obj.useLegacyLights = false;
//if (!threeX.renderer.obj.useLegacyLights)
c_max *= 5;

if (c.type == 'DirectionalLight') {
  if (use_VRM1)
    c.intensity = light.intensity * c_max;
  c.intensity *= 3;

  const c_scale = Math.min(1/c_max);
  c.color.multiplyScalar(c_scale);

  c.target.position.copy(light.target.position)

  if (c.castShadow != light.castShadow) {
    c.castShadow = light.castShadow
    if (c.castShadow) {
      const para = light//MMD_SA_options.shadow_para
      c.shadow.camera.left = para.shadowCameraLeft
      c.shadow.camera.right = para.shadowCameraRight
      c.shadow.camera.top = para.shadowCameraTop
      c.shadow.camera.bottom = para.shadowCameraBottom
      c.shadow.camera.updateProjectionMatrix()
//console.log(para)
/*
if (!this._shadow_camera_helper) {
const helper = this._shadow_camera_helper = new THREE.CameraHelper( c.shadow.camera );
data.scene.add(helper)
}
*/
      console.log('(THREEX shadow camera enabled)')
    }
  }
}
else if (c.type == 'AmbientLight') {
  if (use_VRM1) {
    c.intensity = c_max * 0.5;
  }
  c.intensity *= 2/3;
}
        }
      };
    })(),

    VRM: VRM,

    utils: {

      load_THREEX: async function () {
if (!self.THREEX) {
  DEBUG_show('Loading THREEX...', 2)

  THREE = _THREE = self.THREE;

  const THREE_module = await System._browser.load_script(System.Gadget.path + '/three.js/' + threeX.three_filename, true);
  self.THREE = {};
  Object.assign(self.THREE, THREE_module);

  THREE = self.THREEX = self.THREE;
  self.THREE = _THREE;

  init_common();
}
      },

      computeBoundingBox: function (obj) {
const bb = new THREE.Box3();

const _pos = obj.position.clone();
const _rot = obj.quaternion.clone();
const _scale = obj.scale.clone();

obj.position.set(0,0,0);
obj.quaternion.set(0,0,0,1);
obj.scale.set(1,1,1);
obj.updateMatrix();
obj.updateMatrixWorld();

obj.traverse(c => {
  if (c.isMesh && c.geometry) {
    if (!c.geometry.boundingBox)
      c.geometry.computeBoundingBox();

    c.geometry.boundingBox.applyMatrix4(c.matrixWorld);

    bb.union(c.geometry.boundingBox);
  }
});

obj.position.copy(_pos);
obj.quaternion.copy(_rot);
obj.scale.copy(_scale);
obj.updateMatrix();
obj.updateMatrixWorld();

return bb;
      },

      convert_A_pose_rotation_to_T_pose: (function () {
//"肩",
        var RE = new RegExp("^(" + toRegExp(["左","右"],"|") + ")(" + toRegExp(["肩","腕","ひじ","手"],"|") + "|." + toRegExp("指") + ")(.*)$");

        return function (name, rot, sign_inverted) {
if (!RE.test(name)) return rot;

var dir = (RegExp.$1 == '左') ? 1 : -1;
if (sign_inverted) dir *= -1;

q1.fromArray(rot);

if (RegExp.$3.indexOf('捩') != -1) {
// It seems that 捩 bone rotation is always screwed for any modified T-pose MMD model. Just ignore it for now (you don't really need to modify it to transfer this rotation to other non-MMD model anyways).
// NOTE: May need to be calculated in the future since this may affect MMD_SA.get_bone_position()/.get_bone_position() calculations...?
}
else if (RegExp.$3.indexOf('+') == -1) {
  const rs = rot_shoulder_axis[(sign_inverted) ? 0 : 1];
  const rot_axis = (RegExp.$2 == '肩') ? rs : rot_arm_axis;//rot_arm_axis;//

// NOTE: It seems rotating the axis of rot by q is the same as (q x rot x -q)
//  const aa = q1.toAxisAngle(); q1.setFromAxisAngle(aa[0].applyQuaternion(rot_axis[dir]), aa[1])
  q1.premultiply(rot_axis[dir]).multiply(rot_axis[-dir]);

  if (RegExp.$2 == '腕') {
    q1.premultiply(rot_arm_axis[-dir]);
    if (!RegExp.$3) q1.premultiply(rs[dir]);
  }
  else if (RegExp.$2 == '肩') {
    if (!RegExp.$3) q1.premultiply(rs[-dir]);
  }
}

q1.toArray().forEach((v,i)=>{ rot[i]=v });
return rot;
        };
      })(),

      convert_T_pose_rotation_to_A_pose: function (name, rot) {
return this.convert_A_pose_rotation_to_T_pose(name, rot, true);
      },

// https://pixiv.github.io/three-vrm/packages/three-vrm/examples/humanoidAnimation/index.html
// https://pixiv.github.io/three-vrm/packages/three-vrm/examples/humanoidAnimation/loadMixamoAnimation.js

      rig_map: {
        'mixamo': {
          VRM: {
mixamorigHips:'hips',
mixamorigSpine:'spine',
mixamorigSpine1:'chest',
mixamorigSpine2:'upperChest',
mixamorigNeck:'neck',
mixamorigHead:'head',
mixamorigLeftShoulder:'leftShoulder',
mixamorigLeftArm:'leftUpperArm',
mixamorigLeftForeArm:'leftLowerArm',
mixamorigLeftHand:'leftHand',
mixamorigLeftHandThumb1:'leftThumbMetacarpal',
mixamorigLeftHandThumb2:'leftThumbProximal',
mixamorigLeftHandThumb3:'leftThumbDistal',
mixamorigLeftHandIndex1:'leftIndexProximal',
mixamorigLeftHandIndex2:'leftIndexIntermediate',
mixamorigLeftHandIndex3:'leftIndexDistal',
mixamorigLeftHandMiddle1:'leftMiddleProximal',
mixamorigLeftHandMiddle2:'leftMiddleIntermediate',
mixamorigLeftHandMiddle3:'leftMiddleDistal',
mixamorigLeftHandRing1:'leftRingProximal',
mixamorigLeftHandRing2:'leftRingIntermediate',
mixamorigLeftHandRing3:'leftRingDistal',
mixamorigLeftHandPinky1:'leftLittleProximal',
mixamorigLeftHandPinky2:'leftLittleIntermediate',
mixamorigLeftHandPinky3:'leftLittleDistal',
mixamorigRightShoulder:'rightShoulder',
mixamorigRightArm:'rightUpperArm',
mixamorigRightForeArm:'rightLowerArm',
mixamorigRightHand:'rightHand',
mixamorigRightHandPinky1:'rightLittleProximal',
mixamorigRightHandPinky2:'rightLittleIntermediate',
mixamorigRightHandPinky3:'rightLittleDistal',
mixamorigRightHandRing1:'rightRingProximal',
mixamorigRightHandRing2:'rightRingIntermediate',
mixamorigRightHandRing3:'rightRingDistal',
mixamorigRightHandMiddle1:'rightMiddleProximal',
mixamorigRightHandMiddle2:'rightMiddleIntermediate',
mixamorigRightHandMiddle3:'rightMiddleDistal',
mixamorigRightHandIndex1:'rightIndexProximal',
mixamorigRightHandIndex2:'rightIndexIntermediate',
mixamorigRightHandIndex3:'rightIndexDistal',
mixamorigRightHandThumb1:'rightThumbMetacarpal',
mixamorigRightHandThumb2:'rightThumbProximal',
mixamorigRightHandThumb3:'rightThumbDistal',
mixamorigLeftUpLeg:'leftUpperLeg',
mixamorigLeftLeg:'leftLowerLeg',
mixamorigLeftFoot:'leftFoot',
mixamorigLeftToeBase:'leftToes',
mixamorigRightUpLeg:'rightUpperLeg',
mixamorigRightLeg:'rightLowerLeg',
mixamorigRightFoot:'rightFoot',
mixamorigRightToeBase:'rightToes',
          },
        },
      },

      convert_THREEX_motion_to_VMD: true,
      load_THREEX_motion: (function () {
        var loader;
        var _interp;

        async function load_THREEX_scripts() {
await threeX.utils.load_THREEX();

if (MMD_SA.MMD_started) {
  init_on_MMDStarted();
}
else {
  window.addEventListener("MMDStarted", ()=>{
    init_on_MMDStarted();
  });
}

// Mar 14, 2024
const FBXLoader_module = await System._browser.load_script(System.Gadget.path + '/three.js/loaders/FBXLoader.js', true);
for (const name in FBXLoader_module) THREE[name] = FBXLoader_module[name];
        }

        function BoneKey(name, time, pos, rot) {
this.name = name
this.time = time
this.pos = pos
this.rot = rot
// not using .prototype as keys will be "cloned" in .generateSkinAnimation()
this.interp = _interp
        }

        function MorphKey(name, time, weight) {
this.name = name;
this.time = time;
this.weight = weight;
        }

        function THREEX_VMD(boneKeys, morphKeys, timeMax) {
this.boneKeys = boneKeys;
this.morphKeys = morphKeys;
this.timeMax = timeMax;
        }

        function init(VMD) {
if (initialized) return;
initialized = true;

_interp = new Uint8Array([20,20,20,20,20,20,20,20, 107,107,107,107,107,107,107,107]);

if (VMD) {
  THREEX_VMD.prototype = Object.create(VMD.prototype);
  THREEX_VMD.prototype.cameraKeys = [];
  THREEX_VMD.prototype.lightKeys = [];
}
        }

        function get_sub_track_value(track_main, track_sub, time_index, para) {
function frame_id(t) {
  return Math.round(t*600);
}

if (time_index == 0)
  para.time_index = 0;

const f = frame_id(track_main.times[time_index]);
while ((para.time_index < track_sub.times.length) && (f > frame_id(track_sub.times[para.time_index]))) {
  para.time_index++;
}
para.time_index = Math.min(para.time_index, track_sub.times.length-1);

const dim = (track_main instanceof THREE.QuaternionKeyframeTrack) ? 4 : 3;
const k1 = para.time_index * dim;
const value = (dim == 4) ? q1 : v1;
value.fromArray(track_sub.values.slice(k1, k1+dim));

if ((para.time_index > 0) && (f != frame_id(track_sub.times[para.time_index]))) {
  const time_max = Math.max(track_main.times[time_index], track_sub.times[para.time_index]);
  const time_delta = time_max - track_main.times[time_index];
  const time_range = time_max - track_sub.times[para.time_index-1];
  if ((time_delta > 0) && (time_range > 0)) {
    const k0 = (para.time_index-1) * dim;
    if (dim == 4) {
//if (q1.toArray().some(v=>isNaN(v))) console.log(track_sub, para.time_index+'/'+(track_sub.times.length-1), k1);
      q2.fromArray(track_sub.values.slice(k0, k0+4));
      q1.slerp(q2, time_delta/time_range);
    }
    else if (dim == 3) {
      v2.fromArray(track_sub.values.slice(k0, k0+3));
      v1.lerp(v2, time_delta/time_range);
    }
  }
}

para.time_index++;

return value.toArray();
        }

        const build_rig_map = (()=>{
function MMD_LR(name) {
  var dir;
  if (/left/i.test(name))
    dir = '左';
  else if (/right/i.test(name))
    dir = '右';
  else if (/^(l|r)_/i.test(name) || /_(l|r)$/i.test(name) || /_(l|r)_/i.test(name))
    dir = (RegExp.$1.toLowerCase() == 'r') ? '右' : '左';
  else if (/_(L|R)/.test(name))
    dir = (RegExp.$1 == 'R') ? '右' : '左';

  return dir;
}

const nj_list = ["０","１","２","３"];
function MMD_finger(name) {
  let j_index;
  var f = finger_map[RegExp.$1.toLowerCase()];
  if (f) {
    j_index = parseInt(RegExp.$2);
  }
  else if (!f && (RegExp.$1.toLowerCase() == 'finger')) {
    f = Object.values(finger_map)[RegExp.$2.charAt(0)];
    j_index = (RegExp.$2.length == 1) ? 1 : (parseInt(RegExp.$2.charAt(1))+1);
  }

  if (f == '親')
    j_index--;

  f += '指' + nj_list[j_index];
  return MMD_LR(name) + f;
}

const spine_list = ['上半身','上半身2','上半身3'];
const arm_list = ["腕","ひじ","手首"];
const leg_list = ['足','ひざ','足首','足先EX'];
const finger_map = {
  thumb:"親",
  index:"人",
  mid:"中",
  ring:"薬",
  pinky:"小",
  little:"小",
};

          return (asset)=>{
function rig(k, v) {
  if (!_rig_map[k])
    _rig_map[k] = v
}

const bone_map = [];
asset.traverse((obj)=>{
  if (obj.isBone) {
    if (bone_map.findIndex(name=>name==obj.name) == -1)
      bone_map.push(obj.name);
  }
// fingersbase
  else if (is_XRA_rig && /^(left|right)hand$/i.test(obj.name)) {
    bone_map.push(obj.name);
    console.log('XRA-rig-fix', obj.name);
  }
});

const _rig_map = {};

bone_map.forEach(name=>{
  if (/^J_(Aim|Roll|Sec)/.test(name)) return;

  if (/hip|waist|pelvis/i.test(name) && !_rig_map['センター']) {
    rig('センター', name);
  }
  else if (/waist|spine|chest/i.test(name)) {
    const spine_name = spine_list.find(s_name=>!_rig_map[s_name]);
    if (spine_name)
      rig(spine_name, name);
  }
  else if (/neck/i.test(name)) {
    rig('首', name);
  }
  else if (/head/i.test(name)) {
    rig('頭', name);
  }
  else if (/(thumb|index|mid|ring|pinky|little|finger)\D*(\d+)$/i.test(name)) {
    const name_MMD = MMD_finger(name);
    if (!/twist|share/i.test(name))
      rig(name_MMD, name);
  }
  else if (/shoulder|clavicle/i.test(name)) {
    const dir = MMD_LR(name);
    rig(dir+'肩', name);
  }
  else if (/arm|hand/i.test(name)) {
    if (!/twist|share/i.test(name)) {
      const dir = MMD_LR(name);
      const arm_name = arm_list.find(a_name=>!_rig_map[dir+a_name]);
      if (arm_name)
        rig(dir+arm_name, name);
    }
  }
  else if (/leg|thigh|calf|foot|toe/i.test(name)) {
    if (!/twist|share/i.test(name)) {
      const dir = MMD_LR(name);
      const leg_name = leg_list.find(l_name=>!_rig_map[dir+l_name]);
      if (leg_name)
        rig(dir+leg_name, name);
    }
  }
});

const rig_map = { VRM:{}, MMD:{} };
Object.entries(_rig_map).forEach(e=>{
  rig_map.MMD[e[1]] = e[0];
  rig_map.VRM[e[1]] = VRM.bone_map_MMD_to_VRM[e[0]];
});

console.log(bone_map, rig_map)
return rig_map;
          };
        })();

//"肩","腕","ひじ","手首"

        let motion_format, rig_name, is_XRA_rig, is_XRA_rig_VRM0, is_XRA_rig_VRM1;

        let initialized;

        return async function ( url, model, VMD ) {
          motion_format = (/\.fbx$/i.test(url)) ? 'FBX' : 'GLTF';

          await load_THREEX_scripts();

          init(VMD);

          const THREEX_enabled = MMD_SA.THREEX.enabled;

          loader = loader || new THREE.FBXLoader(); // A loader which loads FBX

          const q_list = [];

          const load_promise = (motion_format == 'FBX') ? loader.loadAsync( toFileProtocol(url) ) : new Promise((resolve)=>{ this.load_GLTF(toFileProtocol(url), resolve); });

          return load_promise.then( ( asset ) => {
const MMD_started = MMD_SA.MMD_started;
const to_VMD = !THREEX_enabled || !MMD_started || this.convert_THREEX_motion_to_VMD;
let VRM_mode;

let vrm;
let bones_by_name;
let model_type;

if (!to_VMD) {
  VRM_mode = true;
  vrm = model.model;
  model_type = 'VRM';
}
else {
  bones_by_name = model.mesh.bones_by_name;
  model_type = 'MMD';
}

const modelX = (!to_VMD) ? model : ((!THREEX_enabled) ? MMD_SA.THREEX.get_model(model._model_index) : MMD_SA.THREEX.models_dummy[0]);

if (!to_VMD) delete model.animation._single_frame;

let clip = THREE.AnimationClip.findByName( asset.animations, 'mixamo.com' ); // extract the AnimationClip
if (clip) {
  rig_name = 'mixamo';
}
else {
  clip = asset.animations.sort((a,b)=>b.duration-a.duration)[0];//[asset.animations.length-1];
  rig_name = clip.name;//clip.tracks[0].name.split('.')[0].substring(0,5);
}
console.log(rig_name, asset);

const rig_para = rig_name.split('|');
is_XRA_rig = rig_para[0] == 'XRAnimator';
is_XRA_rig_VRM0 = is_XRA_rig && (rig_para[1] == 'VRM0');
is_XRA_rig_VRM1 = is_XRA_rig && (rig_para[1] == 'VRM1');

if (motion_format == 'GLTF') asset = asset.scene;

let rig_map = this.rig_map[rig_name];
if (!rig_map) {
  rig_map = build_rig_map(asset);
//  return null;
}

let skeletons = [];
if (1||motion_format == 'GLTF') {
  asset.traverse((obj)=>{
    if (obj.isSkinnedMesh && obj.skeleton && (skeletons.findIndex(s=>s==obj.skeleton) == -1))
      skeletons.push(obj.skeleton);
  });
}
//skeletons.length=0;
console.log('skeletons', skeletons)

const bone_clones = {};
Object.entries(rig_map.VRM).forEach(kv=>{
  const b = asset.getObjectByName(kv[0]);
  bone_clones[kv[1]] = {
    bone: b,
    clone: b.clone()
  };
});

skeletons.forEach(s=>s.pose());

console.log('bone_clones', bone_clones)

VRM.fix_rig_map(rig_map.VRM);
if (!rig_map.MMD) {
  rig_map.MMD = {};
  for (const k in rig_map.VRM) {
    const MMD_name = VRM.bone_map_VRM_to_MMD[rig_map.VRM[k]];
    if (MMD_name)
      rig_map.MMD[k] = MMD_name;
  }
}

let tracks = []; // KeyframeTracks compatible with VRM will be added here

const restRotation = new THREE.Quaternion();
const restRotationInverse = new THREE.Quaternion();
const parentRestWorldRotation = new THREE.Quaternion();
const _quatA = new THREE.Quaternion();
const _quatB = new THREE.Quaternion();
const _vec3 = new THREE.Vector3();

let hipsPositionScale;

// Adjust with reference to hips height.
let motion_hips = asset.getObjectByName( Object.entries(rig_map.VRM).find(kv=>kv[1]=='hips')[0] );
console.log('motion_hips', motion_hips);
//let hips_q = motion_hips.quaternion.clone();//motion_hips.getWorldQuaternion(new THREE.Quaternion());

const axis_vector = { y:new THREE.Vector3(), x:new THREE.Vector3() };
Object.keys(axis_vector).forEach(dir=>{
  const axis = axis_vector[dir];
  if (dir == 'y') {
    for (const name of ['上半身','上半身2','上半身3','首']) {
      const kv = Object.entries(rig_map.MMD).find(kv=>kv[1]==name);
      if (kv) {
        const bone = asset.getObjectByName( kv[0] );
        if (bone)
          axis.add(bone.position);
      }
    }
  }
  else {
    axis.copy(asset.getObjectByName( Object.entries(rig_map.MMD).find(kv=>kv[1]=='左肩')[0] ).position).sub(asset.getObjectByName( Object.entries(rig_map.MMD).find(kv=>kv[1]=='右肩')[0] ).position);
  }
//console.log(axis.toArray())
  const max = Math.max(...axis.normalize().toArray().map(v=>Math.abs(v)));
  if (max == Math.abs(axis.x)) {
    axis.set(Math.sign(axis.x),0,0);
  }
  else if (max == Math.abs(axis.y)) {
    axis.set(0,Math.sign(axis.y),0);
  }
  else {
    axis.set(0,0,Math.sign(axis.z))
  }
});
const x_axis = axis_vector.x;
const y_axis = axis_vector.y;
const z_axis = v1.crossVectors(x_axis, y_axis);
m1.set(
  x_axis.x, x_axis.y, x_axis.z, 0,
  y_axis.x, y_axis.y, y_axis.z, 0,
  z_axis.x, z_axis.y, z_axis.z, 0,
  0,0,0,1
);
const rig_rot = new THREE.Quaternion().copy(MMD_SA._q1.setFromBasis(m1));

hips_q = motion_hips.getWorldQuaternion(new THREE.Quaternion());
//console.log(hips_q.toArray())

hips_q.conjugate().premultiply(rig_rot);
//console.log(rig_rot.toArray())

const hips_q_inv = hips_q.clone().conjugate();

console.log('rig_rot,[hips_q]', rig_rot, [hips_q.clone(), motion_hips.quaternion, motion_hips.parent.getWorldQuaternion(new THREE.Quaternion()), new THREE.Quaternion().copy(hips_q_inv).premultiply(motion_hips.quaternion).multiply(q2.copy(motion_hips.quaternion).conjugate()).multiply(hips_q)])
let _rig_rot_perpendicular = Math.abs(rig_rot.w) % 1 < 0.0001;
if (skeletons.length && (bone_clones['hips'].clone.quaternion.w != 1)) {
  if (_rig_rot_perpendicular) {
    hips_q.copy(rig_rot);
    hips_q_inv.copy(hips_q).conjugate();
  }
}

let hips_height;
// always use native model bone measuremenet if even the motion is loaded in MMD mode (e.g. loading FBX on app start)
if (THREEX_enabled) {
  const model_native = (!to_VMD) ? model : MMD_SA.THREEX.get_model(model._model_index);
  const vrmHipsY = model_native.para.pos0['hips'][1] * ((!to_VMD) ? 1 : model_native.model_scale);
  const vrmRootY = 0;//vrm.scene.getWorldPosition( _vec3 ).y;

  hips_height = Math.abs( vrmHipsY - vrmRootY );
}
else {
  hips_height = bones_by_name["左足"].pmxBone.origin[1];
}


let motionHipsHeight;
if (skeletons.length) {
  const _modelX = MMD_SA.THREEX.get_model(model._model_index);

  const _leftFoot = bone_clones['leftFoot'].bone;
  motionHipsHeight = 0;
  let _leg_node = _leftFoot;
  while (_leg_node?.position && rig_map.VRM[_leg_node.name] != 'leftUpperLeg') {
    motionHipsHeight += _leg_node.position.length();
    _leg_node = _leg_node.parent;
  }

  const _hips_height = v1.fromArray(_modelX.get_bone_origin_by_MMD_name('左足')).distanceTo(v2.fromArray(_modelX.get_bone_origin_by_MMD_name('左ひざ'))) + v2.distanceTo(v1.fromArray(_modelX.get_bone_origin_by_MMD_name('左足首')));

  hipsPositionScale = _hips_height / motionHipsHeight;
  console.log('_hips_height', _hips_height, motionHipsHeight);
}
else {
// can be negative
  motionHipsHeight = bone_clones['hips'].bone.getWorldPosition(v1).applyQuaternion(bone_clones['hips'].bone.getWorldQuaternion(q1).conjugate().premultiply(rig_rot)).y;
//  motionHipsHeight = v1.copy((motion_hips.position.lengthSq()) ? motion_hips.position : motion_hips.parent.position).applyQuaternion(q1.copy(motion_hips.quaternion).conjugate().premultiply(rig_rot)).y;
  hipsPositionScale = hips_height / motionHipsHeight;
}

console.log('hipsPositionScale', hipsPositionScale);

//hips_height = Math.abs(motionHipsHeight) * hipsPositionScale;
console.log('hips_height', hips_height,motionHipsHeight);

const morphKeys = {};

clip.tracks.forEach( ( track ) => {

  if (is_XRA_rig_VRM1)
    track.name = track.name.replace(/^Normalized_/, '');

  // Convert each tracks for VRM use, and push to `tracks`
  const trackSplitted = track.name.split( '.' );
  const mixamoRigName = trackSplitted[ 0 ];
  const propertyName = trackSplitted[trackSplitted.length-1];

  if (!/position|quaternion/.test(propertyName)) {
    if (/^VRMExpression_(.+)$/.test(mixamoRigName)) {
      const expression_name = RegExp.$1;
      const name_MMD = Object.entries((threeX.enabled) ? models[0].blendshape_map_by_MMD_name : VRM.blendshape_map_by_MMD_name_VRM1).find(kv=>kv[1]==expression_name)?.[0];
      if (name_MMD) {
        const time_max = Math.max(clip.duration, 1/30);

        let pos_index = 0;
        let f_last = -1;
        let keys = [];
        while (pos_index < track.times.length) {
          const f = Math.round(track.times[pos_index]*30);
          if (f > f_last) {
            const weight = track.values[pos_index*3];
            const key = new MorphKey(name_MMD, f/30, weight);
            keys.push(key);
            f_last = f;
          }
          pos_index++;
        }

        if (keys.length) {
          if (time_max - track.times[track.times.length-1] > 1/1000)
            keys.push(Object.assign({}, keys[keys.length-1], { time:time_max }));
          morphKeys[name_MMD] = keys;
        }
      }
    }
    return;
  }

  const vrmBoneName = rig_map[model_type][ mixamoRigName ];
  const vrmNodeName = ((vrmBoneName == '上半身3') && vrmBoneName) || modelX.getBoneNode(vrmBoneName, true)?.name;

  if ( vrmNodeName != null ) {
    const MMD_node_name = (VRM_mode && VRM.bone_map_VRM_to_MMD[vrmBoneName]) || vrmBoneName;

    const mixamoRigNode = asset.getObjectByName( mixamoRigName );

// probably need a better solution
    let adjust_center = (skeletons.length && (MMD_node_name == 'センター')) ? (_rig_rot_perpendicular && (Math.abs(q1.copy(hips_q_inv).premultiply(motion_hips.quaternion).multiply(q2.copy(motion_hips.quaternion).conjugate()).multiply(hips_q).normalize().w) < 0.999)) : false;

const b_intermediate = [];

const b = modelX.getBoneNode(vrmBoneName, false);
if (b) {
  let b_parent = b;
  let b_parent_name;
  do {
    b_parent = (VRM_mode) ? b_parent.parent : modelX.get_MMD_bone_parent(b_parent.name);
    b_parent_name = (b_parent && ((VRM_mode) ? model.bone_three_to_vrm_name[b_parent.name] : b_parent.name)) || '';
  }
  while (b_parent && b_parent.isBone && (Object.values(rig_map[model_type]).indexOf(b_parent_name) == -1));

  let rig_parent = mixamoRigNode.parent;
// in case of MMD, ignore the missing 上半身3 here and combine with 上半身2 later instead
  while (rig_parent.isBone && (!b_parent || !b_parent.isBone || (!modelX.getBoneNode(rig_map[model_type][rig_parent.name], false) && (VRM_mode || (rig_map[model_type][rig_parent.name] != '上半身3'))))) {
    b_intermediate.push(rig_parent.name);
    rig_parent = rig_parent.parent;
  }
// a simplified case (for QuickMagic) to ignore b_intermediate if b_parent_name is センター instead of the expected bone parent (may need to watch out for cases of 上半身=>センター in which there may be valid b_intermediate in between)
  if (b_intermediate.length && (b_parent_name == 'センター')) {
    console.log('b_intermediate (skipped)', vrmBoneName, b_parent_name);
    b_intermediate.length = 0;
  }
  if (b_intermediate.length) console.log('b_intermediate', vrmBoneName, b_intermediate, b_parent_name);
}


    // Store rotations of rest-pose.
    mixamoRigNode.getWorldQuaternion( restRotationInverse ).invert();
    mixamoRigNode.parent.getWorldQuaternion( parentRestWorldRotation );
    restRotation.copy(restRotationInverse).conjugate();
//if (MMD_node_name=='左腕') console.log(MMD_node_name, restRotation.toArray())


//if (MMD_node_name.indexOf('肩') != -1) console.log(MMD_node_name, mixamoRigNode.parent.name, parentRestWorldRotation.toArray())
if (b_intermediate.length) {
  b_intermediate.forEach((name, idx)=>{
    const tracks = clip.tracks.filter(t=>t.name.split('.')[0]==name);
    if (!tracks.length) {
      if (q_list[idx])
        q_list[idx].tracks = null;
      return;
    }

    const q = q_list[idx] = q_list[idx] || {
      restRotationInverse: new THREE.Quaternion(),
      parentRestWorldRotation: new THREE.Quaternion(),
      restRotation: new THREE.Quaternion(),
    };
    q.tracks = {};
    tracks.forEach(track=>{
      q.tracks[track.name.split('.')[1]] = track;
    });

    const b = asset.getObjectByName( name );
    b.getWorldQuaternion(q.restRotationInverse).invert();
    b.parent.getWorldQuaternion(q.parentRestWorldRotation);
    q.restRotation.copy(q.restRotationInverse).conjugate();
  });
}


    if ( track instanceof THREE.QuaternionKeyframeTrack ) {

      // Retarget rotation of mixamoRig to NormalizedBone.
      for ( let i = 0; i < track.values.length; i += 4 ) {

        let flatQuaternion = track.values.slice( i, i + 4 );

        _quatA.fromArray( flatQuaternion );

        // 親のレスト時ワールド回転 * トラックの回転 * レスト時ワールド回転の逆
        _quatA
          .premultiply( parentRestWorldRotation )
          .multiply( restRotationInverse );


        _quatA.premultiply(hips_q).multiply(hips_q_inv);


if (b_intermediate.length) {
  _quatB.set(0,0,0,1);
  b_intermediate.forEach((name, idx)=>{
    const q = q_list[idx];
    if (!q || !q.tracks || !q.tracks.quaternion) return;

    const q_track = q.tracks.quaternion;
    const q_flat = get_sub_track_value(track, q_track, i/4, q);
    q1.fromArray(q_flat);

    // 親のレスト時ワールド回転 * トラックの回転 * レスト時ワールド回転の逆
    q1
      .premultiply( q.parentRestWorldRotation )
      .multiply( q.restRotationInverse );

    q1.premultiply(hips_q).multiply(hips_q_inv);

    _quatB.multiply(q1);
  });

  _quatA.premultiply(_quatB);
}

        if (adjust_center) _quatA.premultiply(hips_q_inv);

        _quatA.toArray().forEach( ( v, index ) => {
          track.values[ index + i ] = v;
        } );

      }

      const _track_name = `${vrmNodeName}.${propertyName}`;
      const _track = new THREE.QuaternionKeyframeTrack(
_track_name,
track.times,
track.values.map( ( v, i ) => ( (VRM_mode && (!use_VRM1 || vrm.meta?.metaVersion === '0') && (i % 2 === 0)) ? - v : v ) ),
      );
      _track._rig_name = [mixamoRigName, vrmBoneName];

      const _track_index = tracks.findIndex(t=>(t.name||t[0].name)==_track_name);
      if (_track_index != -1) {
        if (!Array.isArray(tracks[_track_index]))
          tracks[_track_index] = [tracks[_track_index]];
        tracks[_track_index].push(_track);
      }
      else {
        tracks.push(_track);
      }

// a trick to fix animation mixing issue when the FBX animation has only one frame
if (VRM_mode && (track.times.length == 1) && VRM.is_MMD_bone_motion_mixed.test(VRM.bone_map_VRM_to_MMD[vrmBoneName])) {
  if (!model.animation._single_frame) model.animation._single_frame = {};
  model.animation._single_frame[vrmBoneName] = tracks[tracks.length-1].values.slice();
}
    }
    else if ( track instanceof THREE.VectorKeyframeTrack ) {
      if (!VRM_mode && (propertyName != 'position')) return;
      if (MMD_node_name != 'センター') return;


const vq = _quatA.copy(mixamoRigNode.quaternion).conjugate().premultiply(rig_rot);//_quatA.copy(restRotationInverse);

for ( let i = 0, i_max = track.values.length; i < i_max; i += 3 ) {
  const v_flat = track.values.slice( i, i + 3 );
  _vec3.fromArray(v_flat)

  if (propertyName == 'position') {


if (b_intermediate.length) {
  const v_offset = v4.set(0,0,0);
  b_intermediate.forEach((name, idx)=>{
    const q = q_list[idx];
    if (!q || !q.tracks || !q.tracks.position) return;

    const v_track = q.tracks.position;
    const v_flat = get_sub_track_value(track, v_track, i/3, q);

    const b = asset.getObjectByName(name);
    v_offset.add(v1.fromArray(v_flat)).applyQuaternion(q1.copy(b.quaternion).conjugate());
  });
  _vec3.add(v_offset);
}


    _vec3.applyQuaternion(vq);
//_vec3.set(0,0,0)
  }

// probably need a better solution
  if (skeletons.length && _rig_rot_perpendicular) _vec3.applyQuaternion(q4.copy(vq).conjugate());

  if (is_XRA_rig_VRM0) { _vec3.x *= -1; _vec3.z *= -1; }

  _vec3.toArray().map( ( v, idx ) => ( (VRM_mode && (propertyName == 'position') && (!use_VRM1 || vrm.meta?.metaVersion === '0') && (idx % 3 !== 1)) ?  -v : v ) * hipsPositionScale ).forEach( ( v, index ) => {
    track.values[ index + i ] = v;
  });
}
//console.log(track.values)

const _track_name = `${vrmNodeName}.${propertyName}`;
const _track = new THREE.VectorKeyframeTrack( _track_name, track.times, track.values );
_track._rig_name = [mixamoRigName, vrmBoneName];

const _track_index = tracks.findIndex(t=>(t.name||t[0].name)==_track_name);
if (_track_index != -1) {
  if (!Array.isArray(tracks[_track_index]))
    tracks[_track_index] = [tracks[_track_index]];
  tracks[_track_index].push(_track);
}
else {
  tracks.push(_track);
}


//      const value = track.values.map( ( v, i ) => ( (VRM_mode && (!use_VRM1 || vrm.meta?.metaVersion === '0') && (i % 3 !== 1)) ? - v : v ) * hipsPositionScale );
//      tracks.push( new THREE.VectorKeyframeTrack( (!VRM_mode)?vrmNodeName:`${vrmNodeName}.${propertyName}`, track.times, value ) );

    }

  }

} );

tracks = tracks.map(track=>{
  if (!Array.isArray(track)) return track;

  track.forEach(t=>{
    t._order_ = Object.keys(rig_map[model_type]).indexOf(t._rig_name[0]);
  });
  track.sort((a,b)=>a._order_-b._order_);

  const track_main = track[0];
  const [node_name, property_name] = track_main.name.split('.');
  if (property_name == 'quaternion') {
    const para_list = [];
    for (let j = 1; j < track.length; j++)
      para_list[i] = {};
    for ( let i = 0, i_max = track.values.length; i < i_max; i += 4 ) {
      const flatQuaternion = track_main.values.slice( i, i + 4 );
      _quatA.fromArray(flatQuaternion);

      for (let j = 1; j < track.length; j++) {
        const track_sub = track[j];
        const q_flat = get_sub_track_value(track_main, track_sub, i/4, para_list[j]);
        _quatA.multiply(q1.fromArray(q_flat));
      }

      _quatA.toArray().forEach( ( v, index ) => {
        track_main.values[ index + i ] = v;
      });
    }
//console.log(track_main._rig_name, track)
  }

  return track_main;
});
//console.log(tracks)

if (!VRM_mode) {
  const boneKeys = {};
  for (const name in rig_map.MMD) {
    let name_MMD = rig_map.MMD[name];
    if (!name_MMD) continue;

    const tracks_by_name = tracks.filter(t=>t.name.split('.')[0]==name_MMD);
    if (!tracks_by_name.length) continue;

    let track_pos, track_rot;
    tracks_by_name.forEach(t=>{
      if (t instanceof THREE.QuaternionKeyframeTrack) {
        track_rot = t;
      }
      else {
        track_pos = t;
      }
    });

    let pos_index = 0;
    let rot_index = 0;
    let f_last = -1;
    let keys;

    const time_max = Math.max(clip.duration, 1/30);

    if (name_MMD == 'センター') {
      pos_index = 0;
      f_last = -1;
      keys = [];
      while (track_pos && (pos_index < track_pos.times.length)) {
        const f = Math.round(track_pos.times[pos_index]*30);
        if (f > f_last) {
          const pos = [track_pos.values[pos_index*3], track_pos.values[pos_index*3+1]-hips_height, track_pos.values[pos_index*3+2]];
          const key = new BoneKey('センター', f/30, pos, [0,0,0,1]);
          keys.push(key);
          f_last = f;
        }
        pos_index++;
      }
      if (keys.length) {
        if (time_max - track_pos.times[track_pos.times.length-1] > 1/1000)
          keys.push(Object.assign({}, keys[keys.length-1], { time:time_max }));
        boneKeys['センター'] = keys;
      }

      name_MMD = '下半身';
    }

    rot_index = 0;
    f_last = -1;
    keys = [];
    while (track_rot && (rot_index < track_rot.times.length)) {
      const f = Math.round(track_rot.times[rot_index]*30);
      if (f > f_last) {
        let rot = [track_rot.values[rot_index*4], track_rot.values[rot_index*4+1], track_rot.values[rot_index*4+2], track_rot.values[rot_index*4+3]];
        const key = new BoneKey(name_MMD, f/30, [0,0,0], rot);
        keys.push(key);
        f_last = f;
      }
      rot_index++;
    }
    if (keys.length) {
      if (time_max - track_rot.times[track_rot.times.length-1] > 1/1000)
        keys.push(Object.assign({}, keys[keys.length-1], { time:time_max }));
      boneKeys[name_MMD] = keys;
    }
  }

  for (const _combo of [['上半身', '下半身','上半身'], ['上半身2', '上半身2','上半身3']]) {
    const bone_name = _combo[0];
    const combo = _combo.slice(1);

    const tracks_combo = combo.map(name=>boneKeys[name]);
    const rot_index = combo.map(name=>0);

    let f_last = -1;
    const keys = [];
    while (tracks_combo.some((t,i)=>t && (rot_index[i] < t.length))) {
      const f_rot = tracks_combo.map((t,i)=>(t) ? Math.round(t[rot_index[i]].time*30) : Infinity);

      let key;
// nearest next key
      const f = Math.min(...f_rot);
      if (f > f_last) {
        key = new BoneKey(bone_name, f/30, [0,0,0]);
        key._rot = {};
        keys.push(key);
        f_last = f;
      }
      else {
        key = keys[keys.length-1];
      }

// add rot if only there is no existing rot and the frame index is the same as the current key
      tracks_combo.forEach((t,i)=>{
        if (t && (f == f_rot[i])) {
          if (!key._rot[i])
            key._rot[i] = t[rot_index[i]].rot.slice();
          rot_index[i]++;
        }
      });
    }

    const key_next = combo.map(name=>null);
    keys.forEach((k, idx)=>{
      const rots = [];
      for (let i = 0, i_max = combo.length; i < i_max; i++) {
        if (!tracks_combo[i]) continue;

        if (k._rot[i]) {
          rots[i] = k._rot[i];
          continue;
        }

        const k_last = keys[idx-1];

        k_next = key_next[i];
        if (!k_next) {
          for (let n = idx+1, n_max = keys.length; n < n_max; n++) {
            if (keys[n]._rot[i]) {
              k_next = key_next[i] = keys[n];
              break;
            }
          }
        }
        if (!k_next) {
          rots[i] = k_last._rot[i];
          continue
        }
//if (!k_last._rot) { console.log(k_last.name); continue; }
        const q_last = q1.fromArray(k_last._rot[i]);
        const q_next = q2.fromArray(k_next._rot[i]);
        rots[i] = q_last.slerp(q_next, (k.time-k_last.time)/(k_next.time-k_last.time)).toArray();
      }

      const rot_final = q1.set(0,0,0,1);
      for (let i = 0, i_max = combo.length; i < i_max; i++) {
        if (rots[i])
          rot_final.multiply(q2.fromArray(rots[i]));
      }
      k.rot = rot_final.toArray();

      delete k._rot;
    });

    if (keys.length) boneKeys[bone_name] = keys;
  }

  delete boneKeys['上半身3'];
//console.log(boneKeys);

  const key_names = Object.keys(boneKeys);
  const vmd = new THREEX_VMD(
[...key_names.map(name=>boneKeys[name]).flat()],
[...Object.keys(morphKeys).map(name=>morphKeys[name]).flat()],
Math.max(...key_names.map(name=>boneKeys[name][boneKeys[name].length-1].time))
  );

  vmd.url = url;
  MMD_SA.vmd_by_filename[decodeURIComponent(vmd.url.replace(/^.+[\/\\]/, "").replace(/\.(fbx|glb)$/i, ""))] = vmd;

console.log(vmd);
  return vmd;
}

return new THREE.AnimationClip( decodeURIComponent(url.replace(/^.+[\/\\]/, "").replace(/\.(fbx|glb)$/i, "")), clip.duration, tracks );

          } );
        };
      })(),

      load_GLTF: (function () {
        var GLTF_loader;

        async function init() {
if (GLTF_loader) return;

if (!threeX.enabled) {
  const GLTFLoader_module = await import(System.Gadget.path + '/three.js/loaders/GLTFLoader.js');
  Object.assign(THREE, GLTFLoader_module);
}

GLTF_loader = new THREE.GLTFLoader();
        }

        return async function (url, onload) {
await init();

GLTF_loader.load(
	// resource URL
	toFileProtocol(url),
	// called when the resource is loaded
	function ( gltf ) {
/*
scene.add( gltf.scene );

gltf.animations; // Array<THREE.AnimationClip>
gltf.scene; // THREE.Group
gltf.scenes; // Array<THREE.Group>
gltf.cameras; // Array<THREE.Camera>
gltf.asset; // Object
*/
onload(gltf);
	},
	// called while loading is progressing
	function ( xhr ) {

//		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'ERROR: GLTF loading failed', url );

	}
);
        };
      })(),

      export_GLTF_motion: async function (filename, vmd) {
const model = threeX.get_model(0);
const vrm = model.model;

let time_max = 0;

const boneKeys_by_name = {};
vmd.boneKeys.forEach((k,idx)=>{
  if (!boneKeys_by_name[k.name])
    boneKeys_by_name[k.name] = { keys:[], keys_full:[] }
  boneKeys_by_name[k.name].keys.push(k);
  time_max = Math.max(time_max, k.time);
});

const morphKeys_by_name = {};
vmd.morphKeys?.forEach((k,idx)=>{
  if (!morphKeys_by_name[k.name])
    morphKeys_by_name[k.name] = { keys:[] }
  morphKeys_by_name[k.name].keys.push(k);
  time_max = Math.max(time_max, k.time);
});

const f_max = Math.round(time_max*30) + 1;

const name_sync = ['全ての親','センター','上半身','下半身'];
for (const d of ['左','右']) {
  if (boneKeys_by_name[d+'手捩']) {
    if (boneKeys_by_name[d+'ひじ'] && ((boneKeys_by_name[d+'手捩'].keys.length > 2) || boneKeys_by_name[d+'手捩'].keys.some(k=>k.rot[3]!=1))) {
      name_sync.push(d+'ひじ', d+'手捩');
    }
  }
}

for (const name of name_sync) {
  const bk = boneKeys_by_name[name];
  if (!bk) continue;

  let f = 0;
  const bk_keys = bk.keys;
  const bk_keys_full = bk.keys_full;
  bk_keys.forEach((k,idx)=>{
    const _f = Math.round(k.time*30);
    if (_f > f) {
      let k_last = bk_keys[idx-1];
      const _f_last = Math.round(k_last.time*30);
      const _f_diff = _f - _f_last;
      for (let i = 1; i < _f_diff; i++) {
        const k_new = { time:(_f_last+i)/30, pos:v1.fromArray(k_last.pos).lerp(v2.fromArray(k.pos), i/_f_diff).toArray(), rot:q1.fromArray(k_last.rot).slerp(q2.fromArray(k.rot), i/_f_diff).toArray() };
        bk_keys_full.push(k_new);
      }
    }

    bk_keys_full.push(k);
    f++;
  });

  if (bk_keys_full.length < f_max) {
    const k_last = bk_keys_full[bk_keys_full.length-1];
    for (let i = bk_keys_full.length; i < f_max; i++)
      bk_keys_full.push(k_last);
  }
}

const tracks = [];

for (const name_MMD in boneKeys_by_name) {
  const name = VRM.bone_map_MMD_to_VRM[name_MMD];

  if (name) {
    const d = (/(left|right)LowerArm/.test(name)) ? ((RegExp.$1 == 'left') ? '左' : '右') : null;
    const keys = (boneKeys_by_name[name_MMD].keys_full.length) ? boneKeys_by_name[name_MMD].keys_full : boneKeys_by_name[name_MMD].keys;

    let times = [];
    let q_values = [];
    let v_values = [];

    keys.forEach((k,f)=>{
      let q_multiply, q_premultiply;

      if (name == 'hips') {
        const pos = v1.fromArray(k.pos);
        const bone_move = boneKeys_by_name['全ての親'];
        if (bone_move) {
          pos.add(v2.fromArray(bone_move.keys_full[f].pos));
        }

        pos.multiplyScalar(1/VRM.vrm_scale);
        pos.y += model.para.pos0['hips'][1];
        v_values.push(...model.process_position(pos).toArray());

        const bone_lower_body = boneKeys_by_name['下半身'];
        if (bone_lower_body)
          q_multiply = bone_lower_body.keys_full[f].rot;
      }
      else if (name == 'spine') {
        const bone_lower_body = boneKeys_by_name['下半身'];
        if (bone_lower_body)
          q_premultiply = q1.fromArray(bone_lower_body.keys_full[f].rot).conjugate().toArray();
      }
      else if (d) {
        const bone_twist = boneKeys_by_name[d+'手捩'];
        if (bone_twist)
          q_multiply = bone_twist.keys_full[f].rot;
      }

      const q = q1.fromArray(k.rot);
      if (q_multiply)
        q.multiply(q2.fromArray(q_multiply));
      if (q_premultiply)
        q.premultiply(q2.fromArray(q_premultiply));

      q_values.push(...model.process_rotation(q).toArray());

      times.push(k.time);
    });

// need to use normalized bones, or the rotations will be transformed when exported
    const node_name = model.get_bone_by_MMD_name(name_MMD).name;//.replace(/Normalized_/, '');

    if (v_values.length)
      tracks.push(new THREE.VectorKeyframeTrack(node_name+'.position', times, v_values));

    tracks.push(new THREE.QuaternionKeyframeTrack(node_name+'.quaternion', times, q_values));
  };
}

for (const name_MMD in morphKeys_by_name) {
  const name = model.blendshape_map_by_MMD_name[name_MMD];

  if (name) {
    const keys = morphKeys_by_name[name_MMD].keys;

    let times = [];
    let m_values = [];

    keys.forEach((k,f)=>{
      m_values.push(k.weight, k.weight, k.weight);
      times.push(k.time);
    });

    const trackName = vrm.expressionManager.getExpressionTrackName(name).replace(/\.weight$/, '.scale');
    tracks.push(new THREE.VectorKeyframeTrack(trackName, times, m_values));
  }
}

const animation_clip = new THREE.AnimationClip('XRAnimator|VRM'+((model.is_VRM1)?1:0)+'|', time_max, tracks);

console.log(animation_clip);

//model.mesh.animations[0] = animation_clip;

//SA_topmost_window.EV_sync_update.RAF_paused = true;

model.reset_pose = true;

// must reset MMD pos/rot here for some unknown reasons
const mesh_MMD = threeX._THREE.MMD.getModels()[0].mesh;
const _pos = mesh_MMD.position.clone();
const _rot = mesh_MMD.quaternion.clone();
mesh_MMD.position.set(0,0,0);
mesh_MMD.quaternion.set(0,0,0,1);
if (!model.is_VRM1) mesh_MMD.quaternion.premultiply(q1.set(0,1,0,0));

System._browser.on_animation_update.add(async ()=>{
  await this.export_GLTF('motion_'+Date.now(), model.mesh, { animations:[animation_clip], onlyVisible:false });

  mesh_MMD.position.copy(_pos);
  mesh_MMD.quaternion.copy(_rot);

  model.reset_pose = false;

//  SA_topmost_window.EV_sync_update.RAF_paused = false;
}, 1,0);
      },

      export_GLTF: (()=>{
        async function init() {
if (THREE.GLTFExporter) return;

// April 27, 2024
const GLTFExporter_module = await System._browser.load_script(System.Gadget.path + '/three.js/exporters/GLTFExporter.js', true);
for (const name in GLTFExporter_module) THREE[name] = GLTFExporter_module[name];

exporter = new THREEX.GLTFExporter();
        }

        let exporter;

        return async function (filename='model', scene, options={}) {
await init();

return new Promise((resolve)=>{
setTimeout(()=>{
  exporter.parse(
	scene,
	// called when the gltf has been generated
	function ( gltf ) {

		console.log( gltf );
		System._browser.save_file(filename+'.glb', gltf, 'application/octet-stream');

		resolve();
	},
	// called when there is an error in the generation
	function ( error ) {

		console.error( error );

	},
    Object.assign({ binary:true }, options)
  );
}, 1000);
});
        };
      })(),

      camera_auto_targeting: (function () {
        function targeting() {
if (!target_current.enabled && ((target_current.enabled === false) || (target_current.condition && !target_current.condition()))) {
  MMD_SA.Camera_MOD.adjust_camera(target_current.id, null, v1.set(0,0,0));
  return;
}

var target_pos = v4.fromArray(target_data.filter(target_current.get_target_position().toArray()));//target_current.get_target_position();//
//DEBUG_show(target_pos.toArray().join('\n') + '\n' + Date.now());
MMD_SA.Camera_MOD.adjust_camera(target_current.id, null, target_pos);
        }

        var target_current;

        var target_face = {
  id: 'face',
  get_target_position: ()=>{
const model = threeX.get_model(0);
const model_MMD = MMD_SA.THREEX._THREE.MMD.getModels()[0];

var head_pos;
var pos = v3.set(0,0,0);

const head_pos_ref = v1.fromArray(model.get_bone_origin_by_MMD_name('頭')).sub(v2.fromArray(model.get_bone_origin_by_MMD_name('上半身')));
const neck_y = model.get_bone_origin_by_MMD_name('頭')[1] - model.get_bone_origin_by_MMD_name('首')[1];
head_pos_ref.y += neck_y;

const camera_lookAt = v4.fromArray(MMD_SA_options.camera_lookAt).add(v2.fromArray(MMD_SA.center_view_lookAt));

pos.add(model_MMD.mesh.position);
pos.add(camera_lookAt);
pos.add(model.get_bone_position_by_MMD_name('センター',true).setY(0).applyQuaternion(model_MMD.mesh.quaternion));

head_pos = model.get_bone_position_by_MMD_name('頭').sub(model.get_bone_position_by_MMD_name('上半身')).add(v2.set(0,neck_y,0).applyQuaternion(model.get_bone_rotation_by_MMD_name('頭')));
head_pos.sub(head_pos_ref);

const c_base = MMD_SA.Camera_MOD.get_camera_base(['camera_lock']);
pos.sub(c_base.target);

return head_pos.add(pos).multiplyScalar(0.75);
  },
        };

        var target_data;
        window.addEventListener('jThree_ready', ()=>{
target_data = new System._browser.data_filter([{ type:'one_euro', id:'camera_face_locking', transition_time:0.5, para:[30, 1,0.1/5,1, 3] }]);
        });

//window.addEventListener('MMDStarted', ()=>{ System._browser.on_animation_update.add(()=>{DEBUG_show(MMD_SA.THREEX.get_model(0).get_bone_position_by_MMD_name('上半身').toArray().join('\n')+'\n'+Date.now())},0,1,-1) });

        return function (target) {
if (!target) {
  if (!target_current) return;
  System._browser.on_animation_update.remove(targeting, 1);
  MMD_SA.Camera_MOD.adjust_camera(target_current.id, null, v1.set(0,0,0));
  target_current = null;
  return;
}

if (target_current && (target.id == target_current.id)) {
  target_current = Object.assign(target_current, target);
  return;
}

if (!target_current)
  System._browser.on_animation_update.add(targeting, 0,1,-1);

if (target.id == 'face')
  target = Object.assign(target_face, target);;

target_current = target;
        };
      })(),

      load_octree: async function () {
await threeX.utils.load_THREEX();

const Octree_module = await System._browser.load_script(System.Gadget.path + '/three.js/math/Octree.js', true);
for (const name in Octree_module) THREE[name] = Octree_module[name];
      },

      HDRI: (()=>{
        let EXRLoader, EXR_loader, RGBELoader, RGBE_loader;
        let pmremGenerator;

        let HDRI_renderTarget_last;

        let path_now, path_next;

        let load_promise;

        let initialized, loading;
        async function init() {
if (initialized) return;
initialized = true;

EXRLoader = await System._browser.load_script(System.Gadget.path + '/three.js/loaders/EXRLoader.js', true);
EXR_loader = new EXRLoader.EXRLoader();

RGBELoader = await System._browser.load_script(System.Gadget.path + '/three.js/loaders/RGBELoader.js', true);
RGBE_loader = new RGBELoader.RGBELoader();

const renderer = threeX.renderer.obj;
pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();
        }

// https://github.com/mrdoob/three.js/blob/master/examples/webgl_materials_envmaps_exr.html
        function load_core(path, set_background) {
return new Promise((resolve)=>{
  path_now = path;

  ((/\.exr$/i.test(path)) ? EXR_loader : RGBE_loader).load( toFileProtocol(path), function ( texture ) {
    texture.mapping = THREE.EquirectangularReflectionMapping;

    const exrCubeRenderTarget = pmremGenerator.fromEquirectangular( texture );

    display(exrCubeRenderTarget, set_background);

    if (HDRI_renderTarget_last)
      HDRI_renderTarget_last.dispose();
    HDRI_renderTarget_last = exrCubeRenderTarget;

console.log('HDRI', path)
    resolve();
  });
});
        }

        function display(exrCubeRenderTarget, set_background) {
threeX.scene.environment = exrCubeRenderTarget.texture;
//set_background=true
if (set_background) {
  threeX.scene.background = exrCubeRenderTarget.texture;
//threeX.scene.backgroundBlurriness = 0.5
  System._browser.camera.display_floating = (MMD_SA_options.user_camera.display.floating_auto !== false);

  if (MMD_SA_options.mesh_obj_by_id["DomeMESH"])
    MMD_SA_options.mesh_obj_by_id["DomeMESH"]._obj.visible = false;
}
        }

        let mode;

        return {
          get mode() { return (mode == null) ? 1 : mode; },
          set mode(v) {
const _mode = this.mode;
mode = v;

if ((_mode != this.mode) && (this.mode != 1)) {
  if (mode == 2) {
    if (this.path && !threeX.scene.background) {
      threeX.scene.background = HDRI_renderTarget_last.texture;
      System._browser.camera.display_floating = (MMD_SA_options.user_camera.display.floating_auto !== false);
    }
  }
  else {
    threeX.scene.background = null;
  }
}
          },

          get path() { return threeX.enabled && threeX.scene.environment && path_now; },

          load: async function (path, set_background) {
if (!threeX.enabled) return false;
if (loading) return false;

if ((set_background == null) || !this.mode)
  set_background = (!this.mode) ? false : ((this.mode == 1) ? (!MMD_SA_options.mesh_obj_by_id["DomeMESH"]?._obj.visible && (!!MMD_SA.THREEX.scene.background || !MMD_SA.THREEX._object3d_list_?.length)) : true);

if (path == this.path) {
  display(HDRI_renderTarget_last, set_background);
  return false;
}

if (load_promise) {
  path_next = path;
}
else {
  load_promise = new Promise(async (resolve)=>{
    await init();

    await load_core(path, set_background);

    resolve();
    load_promise = null;

    if (path_next && (path_now != path_next))
      load_promise = this.load(path_next);
    path_next = null;
  });
}

return load_promise;
          }
        };
      })(),

      dispose: function (obj) {
if (!threeX.enabled && (obj.children.length == 1) && (obj.children[0]._model_index != null)) {
  _THREE.MMD.removeModel(_THREE.MMD.getModels()[obj.children[0]._model_index]);
}

let geo_disposed = 0, map_disposed = 0, mtrl_disposed = 0, misc_disposed = 0;
obj.traverse(node => {
  if (!node.isMesh && !node.geometry) {
    if (node.dispose) {
      node.dispose();
      misc_disposed++;
    }
    return;
  }

  if (node.geometry) {
    node.geometry.dispose();
    geo_disposed++;
  }

  if (node.material) {
    const materials = node.material.materials || (Array.isArray(node.material) && node.material) || [node.material];
    materials.forEach(mtrl => {
      if (mtrl.map)         { mtrl.map.dispose(); map_disposed++; }
      if (mtrl.lightMap)    { mtrl.lightMap.dispose(); map_disposed++; }
      if (mtrl.bumpMap)     { mtrl.bumpMap.dispose(); map_disposed++; }
      if (mtrl.normalMap)   { mtrl.normalMap.dispose(); map_disposed++; }
      if (mtrl.specularMap) { mtrl.specularMap.dispose(); map_disposed++; }
      if (mtrl.envMap)      { mtrl.envMap.dispose(); map_disposed++; }

      mtrl.dispose();
      mtrl_disposed++;
    });
  }
});

console.log('geo_disposed:' + geo_disposed, 'map_disposed:' + map_disposed, 'mtrl_disposed:' + mtrl_disposed, 'misc_disposed:' + misc_disposed);
      },

    }

  };

  return threeX;

})();


// https://protocol.vmc.info/english
// https://ccrma.stanford.edu/groups/osc/spec-1_0.html
// https://github.com/adzialocha/osc-js

MMD_SA.OSC = (function () {

  class VMC {
    constructor(options={}) {
if (!options.plugin) {
  options.plugin = {
    open: MMD_SA_options.OSC?.VMC.open,
    send: MMD_SA_options.OSC?.VMC.send,
  };
}

this.options = options;
this.options_default = Object.clone(options);
    }

    #VMC_enabled=false;
    #VMC_initialized;
    #VMC_ready;
    #VMC_sender_enabled=false;
    #VMC_receiver_enabled=false;

    get enabled() { return this.#VMC_enabled; }
    set enabled(v) {
if (this.#VMC_enabled == !!v) return;

this.#VMC_enabled = !!v;

if (this.#VMC_enabled) {
  _OSC.enabled = true;
  this.init();
  DEBUG_show('(OSC/VMC client:ON/Port:' + this.options.plugin.send.port + ')', 5)
}
else {
  this.#VMC_sender_enabled = this.#VMC_receiver_enabled = false;
  DEBUG_show('(OSC/VMC client:OFF)', 3)
}

// Warudo mode
_OSC.VMC_camera.sender_enabled = v;
_OSC.VMC_misc.sender_enabled = v;
    }

    get sender_enabled() { return this.#VMC_sender_enabled; }
    set sender_enabled(v) {
if (this.#VMC_sender_enabled == !!v) return;

this.#VMC_sender_enabled = !!v;

if (this.#VMC_sender_enabled) {
  this.enabled = true;
}
else {
  if (!this.#VMC_receiver_enabled) this.enabled = false;
}
    }

    get ready() { return this.#VMC_enabled && this.#VMC_ready; }
    set ready(v) { this.#VMC_ready = v; }

    init() {
if (this.#VMC_initialized) return;
this.#VMC_initialized = true;

OSC_init();

this.plugin = new OSC.DatagramPlugin(this.options.plugin);
this.vmc = new OSC({ plugin:this.plugin });

this.vmc.on('open', () => {
  this.#VMC_ready = true;
//  console.log(this.#vmc);
});

this.vmc.on('*', (msg) => {
  if (!this.#VMC_receiver_enabled) return;
});

//this.vmc.open();
this.#VMC_ready = true;
    }

    Message(address, args=[], types) {
const msg = new OSC.Message(address, ...args);
if (types) msg.types = types;
return msg;
    }

    Bundle(...args) {
return new OSC.Bundle(...args);
    }

    send(...args) {
this.vmc.send(...args);
    }
  }

  function OSC_init() {
if (initialized) return;
initialized = true;

OSC = require('node_modules.asar/OSC-js/node_modules/osc-js');
//console.log(OSC)

ready = true;
  }

  var OSC;
  var enabled=false, initialized, ready;

  var _OSC = {
    get enabled() { return enabled; },
    set enabled(v) {
if (enabled == !!v) return;

enabled = !!v;

if (enabled) {
  OSC_init();
}
    },

    get ready() { return enabled && ready; },

    VMC_class: VMC,
  };

// Warudo mode
//  _OSC.app_mode = 'Warudo';

  _OSC._VMC_warudo = null;

  (()=>{
    function VMC_warudo() {
if (_OSC.app_mode == 'Warudo') {
  _OSC._VMC_warudo = _OSC._VMC_warudo || new VMC({ plugin:{ send: { port:19190, host:_OSC.VMC.options.plugin.send.host||'localhost' } } });
  if (_OSC.VMC.options.plugin.send.host && _OSC._VMC_warudo.plugin && (_OSC._VMC_warudo.plugin.options.send.host != _OSC.VMC.options.plugin.send.host))
    _OSC._VMC_warudo.plugin.options.send.host = _OSC.VMC.options.plugin.send.host
}
else {
  _OSC._VMC_warudo = _OSC.VMC;
}

return _OSC._VMC_warudo;
    }

    Object.defineProperty(_OSC, 'VMC_camera', {
      get: ()=>{
return VMC_warudo();
      }
    });

    Object.defineProperty(_OSC, 'VMC_misc', {
      get: ()=>{
return VMC_warudo();
      }
    });
  })();

  _OSC.VMC = new VMC();

  return _OSC;

})();


(function () {
// defaults START
  use_full_fps_registered = true

  if (browser_native_mode && !webkit_window)
    SA_fullscreen_stretch_to_cover = true

  if (!MMD_SA_options)
    MMD_SA_options = {}

  MMD_SA_options.custom_default && MMD_SA_options.custom_default()
  window.dispatchEvent(new CustomEvent("SA_MMD_init"))


// THREEX_options START

if (MMD_SA_options.use_THREEX !== false) MMD_SA_options.use_THREEX = true;

if (!MMD_SA_options.THREEX_options)
  MMD_SA_options.THREEX_options = {};

MMD_SA_options.THREEX_options.model_path_default = MMD_SA_options.THREEX_options.model_path || '';

if (!MMD_SA_options.THREEX_options.model_para)
  MMD_SA_options.THREEX_options.model_para = {};

// THREEX_options END


// save some headaches
  if (is_mobile && !is_SA_child_animation) {
    SA_fullscreen_stretch_to_cover = true
    Settings.CSSTransformFullscreen = true
  }
//  if (is_mobile) MMD_SA_options.texture_resolution_limit = MMD_SA_options.texture_resolution_limit_mobile || 1024;
MMD_SA_options.texture_resolution_limit=2048


// model selection START
  if (!MMD_SA_options.model_path)
    MMD_SA_options.model_path = System.Gadget.path + "\\jThree\\model\\Appearance Miku\\Appearance Miku_BDEF_mod-v04.pmx"
  MMD_SA.use_jThree = true;// /\.pmx$/i.test(MMD_SA_options.model_path);


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

  window.addEventListener("MMDStarted", ()=>{
    THREE.MMD.getModels().forEach((model,i)=>{
      var bones_by_name = model.mesh.bones_by_name
      var model_para = MMD_SA_options.model_para_obj_all[i]

      if (bones_by_name["左足"] && bones_by_name["左ひざ"] && bones_by_name["左足首"])
        model_para.left_leg_length = (bones_by_name["左足"].pmxBone.origin[1] - bones_by_name["左ひざ"].pmxBone.origin[1]) + (bones_by_name["左ひざ"].pmxBone.origin[1] - bones_by_name["左足首"].pmxBone.origin[1]);
    });
  });

  if (!MMD_SA_options.model_para_obj.skin_default)
    MMD_SA_options.model_para_obj.skin_default = { _is_empty:true }
// save some headaches and make sure that every VMD has morph (at least a dummy) in "Dungeon" mode
  if (!MMD_SA_options.model_para_obj.morph_default) MMD_SA_options.model_para_obj.morph_default = {}//{ _is_empty:!MMD_SA_options.Dungeon }//

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
  MMD_SA_options.custom_action.unshift("motion_blending_model0")
  if (!MMD_SA_options.AR_camera_mod)
    MMD_SA_options.AR_camera_mod = 1.2
  if (!MMD_SA_options.light_mod)
    MMD_SA_options.light_mod = 1
  if (MMD_SA_options.auto_blink == null)
    MMD_SA_options.auto_blink = true

  if (!MMD_SA_options.camera_position)
    MMD_SA_options.camera_position = [0,10,30];
  MMD_SA_options.camera_position_base = MMD_SA_options.camera_position.slice();
  if (!MMD_SA_options.camera_lookAt)
    MMD_SA_options.camera_lookAt = [0,MMD_SA_options.camera_position[1],0]
  if (!MMD_SA_options.camera_rotation)
    MMD_SA_options.camera_rotation = [0,0,0]
  if (!MMD_SA_options.camera_fov)
    MMD_SA_options.camera_fov = 50;
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

  if (!MMD_SA_options.user_camera)
    MMD_SA_options.user_camera = {}

  if (MMD_SA_options.user_camera.mirror_3D == null)
    MMD_SA_options.user_camera.mirror_3D = 0//1

  if (!MMD_SA_options.user_camera.pixel_limit)
    MMD_SA_options.user_camera.pixel_limit = {}
  if (!MMD_SA_options.user_camera.pixel_limit._default_)
    MMD_SA_options.user_camera.pixel_limit._default_ = (is_mobile) ? [960,540] : [1280,720];

  if (!MMD_SA_options.user_camera.display)
    MMD_SA_options.user_camera.display = {}
  if (!MMD_SA_options.user_camera.display.video)
    MMD_SA_options.user_camera.display.video = {}
  if (!MMD_SA_options.user_camera.display.wireframe)
    MMD_SA_options.user_camera.display.wireframe = {}

  if (!MMD_SA_options.user_camera.ML_models)
    MMD_SA_options.user_camera.ML_models = {};
  ['facemesh','pose','hands'].forEach((model)=>{
    var m = MMD_SA_options.user_camera.ML_models[model]
    if (!m)
      m = MMD_SA_options.user_camera.ML_models[model] = {}
    if (!m.events)
      m.events = {}
  });

  if (!MMD_SA_options.user_camera.streamer_mode)
    MMD_SA_options.user_camera.streamer_mode = {};
  if (!MMD_SA_options.user_camera.streamer_mode.camera_preference)
    MMD_SA_options.user_camera.streamer_mode.camera_preference = {};

  if (MMD_SA_options.user_camera.ML_models.facemesh.use_mediapipe == null)
    MMD_SA_options.user_camera.ML_models.facemesh.use_mediapipe = true//System._browser.url_search_params.use_mediapipe_facemesh
  if (MMD_SA_options.user_camera.ML_models.use_holistic == null)
    MMD_SA_options.user_camera.ML_models.use_holistic = !!System._browser.url_search_params.use_holistic || null
  if (MMD_SA_options.user_camera.ML_models.worker_disabled == null)
    MMD_SA_options.user_camera.ML_models.worker_disabled = (typeof OffscreenCanvas == "undefined") || System._browser.url_search_params.ML_worker_disabled

  if (MMD_SA_options.user_camera.ML_models.facemesh.use_mediapipe || MMD_SA_options.user_camera.ML_models.worker_disabled)
    System._browser.camera.facemesh.use_mediapipe = true
  if (typeof MMD_SA_options.user_camera.ML_models.use_holistic == 'boolean')
    System._browser.camera.poseNet._use_holistic_ = MMD_SA_options.user_camera.ML_models.use_holistic

  if (MMD_SA_options.user_camera.ML_models.hands.depth_adjustment_percent == null)
    MMD_SA_options.user_camera.ML_models.hands.depth_adjustment_percent = 50;
  if (MMD_SA_options.user_camera.ML_models.hands.palm_shoulder_scale_percent == null)
    MMD_SA_options.user_camera.ML_models.hands.palm_shoulder_scale_percent = 22;
  if (MMD_SA_options.user_camera.ML_models.hands.depth_scale_percent == null)
    MMD_SA_options.user_camera.ML_models.hands.depth_scale_percent = 50;

  if (!MMD_SA_options.OSC)
    MMD_SA_options.OSC = {};
  if (!MMD_SA_options.OSC.VMC)
    MMD_SA_options.OSC.VMC = {};
  if (!MMD_SA_options.OSC.VMC.send)
    MMD_SA_options.OSC.VMC.send = { port:39539 };
  if (!MMD_SA_options.OSC.VMC.open)
    MMD_SA_options.OSC.VMC.open = { port:39540 };

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
  get: function () {
    var limit = Math.max(10, length-10)
    var trackball_camera_limit = MMD_SA.MMD.motionManager.para_SA.trackball_camera_limit
    if (trackball_camera_limit && trackball_camera_limit.min && trackball_camera_limit.min.length)
      limit = Math.min(limit, trackball_camera_limit.min.length)
    return limit
  }
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

  if (MMD_SA_options.GOML_head_list)
    MMD_SA.GOML_head_list = MMD_SA.GOML_head_list.concat(MMD_SA_options.GOML_head_list);
  if (MMD_SA_options.GOML_scene_list)
    MMD_SA.GOML_scene_list = MMD_SA.GOML_scene_list.concat(MMD_SA_options.GOML_scene_list);

  if (MMD_SA_options.reset_rigid_body_physics_step == null)
    MMD_SA_options.reset_rigid_body_physics_step = 10

  if (MMD_SA_options.matrixWorld_physics_scale == null)
    MMD_SA_options.matrixWorld_physics_scale = 0.25

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


// adjust Dungeon options
  if (MMD_SA_options.Dungeon) {
    if (!MMD_SA_options.Dungeon_options.camera_position_z_sign)
      MMD_SA_options.Dungeon_options.camera_position_z_sign = (!MMD_SA_options.WebXR || !MMD_SA_options.WebXR.AR) ? -1 : 1;

    Object.defineProperty(MMD_SA_options.Dungeon.character, 'camera_position_base_default', (function () {
      function get_camera_default() {
return MMD_SA_options.camera_position_base.map((n,i)=>n*((i==2)?MMD_SA_options.Dungeon_options.camera_position_z_sign:1));
      }

      let _camera_position_base_default;
      return {
        get: ()=>{
return _camera_position_base_default || get_camera_default();
        },
        set: (v)=>{
const dc = get_camera_default();
if (v.every((n,i)=>n==dc[i])) {
  _camera_position_base_default = null;
}
else {
  console.log('camera_position_base_default', v.slice());
  _camera_position_base_default = v;
}
        },
      };
    })());
  }


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
  if (!model_para_obj.morph_default) model_para_obj.morph_default = {}//{ _is_empty:!MMD_SA_options.Dungeon }//

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
    obj._model_index = obj._model_index_default = idx
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
    MMD_SA_options.morphTargets_length_fixed = 40

  if (MMD_SA_options.physics_maxSubSteps == null)
    MMD_SA_options.physics_maxSubSteps = (MMD_SA_options.model_para_obj_all.length < 3) ? 3 : 2

  MMD_SA_options.MME._EV_usage_PROCESS = function (u, decay_factor) {
if (use_full_fps)
  decay_factor *= ((RAF_animation_frame_unlimited)?1:2)/EV_sync_update.count_to_10fps_

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
return System.Gadget.Settings.readString("MMDLightColor") || MMD_SA_options._light_color;
  },
  set: function (v) {
MMD_SA_options._light_color = v;
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

  MMD_SA_options.look_at_screen_bone_list_by_model = function (model) {
const mm = (model && (model._model_index > 0)) ? MMD_SA.motion[model.skin._motion_index] : MMD_SA.MMD.motionManager;
const para_SA = mm.para_SA;

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
  };

// somewhat obsolete
  Object.defineProperty(MMD_SA_options, "look_at_screen_bone_list",
{
  get: function () {
return this.look_at_screen_bone_list_by_model();
  }

 ,set: function (list) {
this._look_at_screen_bone_list = list;
  }
});

  if (MMD_SA_options.look_at_screen_parent_rotation)
    MMD_SA_options._look_at_screen_parent_rotation = MMD_SA_options.look_at_screen_parent_rotation

  MMD_SA_options.look_at_screen_parent_rotation_by_model = function (model) {
const mm = (model && (model._model_index > 0)) ? MMD_SA.motion[model.skin._motion_index] : MMD_SA.MMD.motionManager;
const para_SA = mm.para_SA;

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
  };

// somewhat obsolete
  Object.defineProperty(MMD_SA_options, "look_at_screen_parent_rotation",
{
  get: function () {
return this.look_at_screen_parent_rotation_by_model();
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

var mm = (model && (model._model_index > 0)) ? MMD_SA.motion[model.skin._motion_index] : MMD_SA.MMD.motionManager
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

return v && (this.look_at_screen_ratio_by_model(model) != 0);
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

  MMD_SA_options.look_at_screen_ratio_by_model = function (model) {
const mm = (model && (model._model_index > 0)) ? MMD_SA.motion[model.skin._motion_index] : MMD_SA.MMD.motionManager;
const para_SA = mm.para_SA;

if (System._browser.camera.ML_enabled && ((MMD_SA_options.user_camera.ML_models.look_at_screen === false) || (!para_SA.motion_tracking?.look_at_screen && !MMD_SA.WebXR.session))) return 0;

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
  };

// somewhat obsolete
  Object.defineProperty(MMD_SA_options, "look_at_screen_ratio",
{
  get: function () {
return this.look_at_screen_ratio_by_model();
  }

 ,set: function (v) {
this._look_at_screen_ratio = v
  }
});

  if (MMD_SA_options.user_camera.ML_models.enabled) {
    MMD_SA_options.look_at_mouse = false

    window.addEventListener("jThree_ready", function () {
MMD_SA_options.model_para_obj_all.forEach(function (model_para_obj) {
  model_para_obj.use_default_boundingBox = true
});

var facemesh_morph = {}
if (MMD_SA_options.model_para_obj.facemesh_morph) {
  for (const name in MMD_SA_options.model_para_obj.facemesh_morph) {
    let name_new;
    switch (name) {
      case "mouth_narrow":
        name_new = "ω"
        break
      default:
        name_new = name
    }
    facemesh_morph[name_new] = MMD_SA_options.model_para_obj.facemesh_morph[name]
  }
}
MMD_SA_options.model_para_obj.facemesh_morph = facemesh_morph
//console.log(facemesh_morph)
    });

    window.addEventListener("SA_MMD_before_motion_init", function () {
var morph_default = MMD_SA_options.model_para_obj.morph_default = MMD_SA_options.model_para_obj.morph_default || {};

var facemesh_morph = MMD_SA_options.model_para_obj.facemesh_morph;
var morphs_index_by_name = THREE.MMD.getModels()[0].pmx.morphs_index_by_name;

// "まばたきL", "まばたきR"
// お <==> ∧
System._browser.camera.facemesh.MMD_morph_list.forEach(function (m) {
  if (!facemesh_morph[m]) {
    const morph_alt = [];
    switch (m) {
case "びっくり":
  morph_alt.push(m, '驚き');
  break;
case "にやり":
  morph_alt.push('横伸ばし', '口幅大', m, '←→');
  break;
case "ω":
  morph_alt.push('横潰し', '口幅小', m, '→←');
  break;
case "口角上げ":
  morph_alt.push(m, '∪', 'スマイル');
  break;
case "口角下げ":
  morph_alt.push(m, '∩', 'む');
  break;
case "上":
case "下":
  morph_alt.push(m, 'まゆ'+m, '眉'+((m=='上')?'↑':'↓'));
  break
default:
  morph_alt.push(m);
    }
    morph_alt.some(ma=>{
if (morphs_index_by_name[ma] != null) {
  facemesh_morph[m] = { name:ma, weight:(morph_default[ma] && morph_default[ma].weight_scale)||1 };
  return true;
}
    });
  }

  if (facemesh_morph[m]) {
    const mm = facemesh_morph[m].name;
    if (!morph_default[mm]) morph_default[mm] = { weight:0 };
  }
});
    });
  }
  if (MMD_SA_options.WebXR) {
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

  if (!MMD_SA_options.mesh_obj_preload_list)
    MMD_SA_options.mesh_obj_preload_list = []

  if (!MMD_SA_options.MMD_disabled) {
    for (var i = 0, i_max = MMD_SA_options.model_para_obj_all.length; i < i_max; i++) {
      MMD_SA_options.mesh_obj.push({ id:"mikuPmx"+i })
    }
  }

// Circular spectrum
  if (MMD_SA_options.use_CircularSpectrum) {
    const _r = MMD_SA_options.CircularSpectrum_radius || 10
    const _divider = 128
    const _cube_size = _r * 2 * Math.PI / (_divider * 2)

    MMD_SA_options.mesh_obj_preload_list.push({ id:'CircularSpectrumMESH', create:function () {
const THREE = MMD_SA.THREEX.THREE;

const geometry = new THREE.BoxGeometry(_cube_size,_cube_size,_cube_size);
const material = new THREE.MeshBasicMaterial({ color:(MMD_SA_options.CircularSpectrum_color || '#0f0') });

const obj = new THREE.Object3D();
for (let i = 0; i < _divider; i++) {
  const _a = (i / _divider) * Math.PI * 2;
  const mesh = MMD_SA.THREEX.mesh_obj.set('CircularSpectrum' + i + 'MESH', new THREE.Mesh(geometry, material), true);
  mesh.position.set(_r*Math.sin(_a), _r*Math.cos(_a), 0);
  mesh.rotation.set(0, 0, -_a);
  obj.add(mesh);
}
obj.position.fromArray(MMD_SA_options.CircularSpectrum_position || [0,10,0]);

obj.scale.set(0,0,0)

return obj;
    } });

    MMD_SA_options.mesh_obj.push({ id:"CircularSpectrumMESH", scale:0 })
  }

// Kiss
  if (MMD_SA_options.allows_kissing && (MMD_SA_options.custom_action.indexOf("kissing") == -1))
    MMD_SA_options.custom_action.push("kissing")
  if (MMD_SA_options.custom_action.indexOf("kissing") != -1) {
    MMD_SA_options.mesh_obj_preload_list.push({ id:'KissMESH', create:function () {
const THREE = MMD_SA.THREEX.THREE;

const para = { map:MMD_SA.load_texture(System.Gadget.path + '/images/kiss_mark_red_o66.png'), depthTest:false };
if (!MMD_SA.THREEX.enabled) {
  para.useScreenCoordinates = false;
}
const material = new THREE.SpriteMaterial(para);

return new THREE.Sprite(material);
    } });
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

  if (!MMD_SA_options.width)
    MMD_SA_options.width  = AR_para.video_width  || 512
  if (!MMD_SA_options.height)
    MMD_SA_options.height = AR_para.video_height || 512

  if (MMD_SA_options.use_speech_bubble) {
    MMD_SA.SpeechBubble.init()
  }

// save some headaches for physics glitches on start
  window.addEventListener("MMDStarted", function () {
     THREE.MMD.getModels().forEach(function (m) {
if (!m.physi) return;

m.resetPhysics(30)

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

  MMD_SA_options.motion_index_by_name = {};
  for (var i = 0, i_max = MMD_SA_options.motion.length; i < i_max; i++) {
    MMD_SA_options.motion_index_by_name[MMD_SA_options.motion[i].path.replace(/^.+[\/\\]/, "").replace(/\.([a-z0-9]{1,4})$/i, "")] = i;
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
  const fullscreen = (!is_SA_child_animation || is_SA_child_animation_host) && Settings.CSSTransformFullscreen && (SA_fullscreen_stretch_to_cover || returnBoolean("AutoItStayOnDesktop"));
  let w, h;
  if (fullscreen) {
    w = EV_width  = screen.availWidth
    h = EV_height = screen.availHeight
  }
  else {
// a trick to allow custom zoom
    const zoom = (SA_zoom != 1) ? SA_zoom : (parseFloat(Settings.CSSTransformScale) || 1);//SA_zoom;//
    w = EV_width  = Math.round(MMD_SA_options.width  * zoom)
    h = EV_height = Math.round(MMD_SA_options.height * zoom)
  }

// MMD_SA.jThree_ready finished already
  if (!MMD_SA.jThree_ready)
    MMD_SA._renderer.__resize(w,h)
/*
  if (self.ChatboxAT) {
    let zoom = Math.min(w/1280, h/720)
    document.getElementById("CB_Lwindow0").style.transform = (zoom >= 1) ? "" : "scale(" + zoom + ")";
  }
*/
//DEBUG_show(SA_zoom,0,1)
  SA_zoom = 1;
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

  const js_min_mode = self._js_min_mode_ || (browser_native_mode && !webkit_window && !localhost_mode) || (webkit_electron_mode && !/AT_SystemAnimator_v0001\.gadget/.test(System.Gadget.path));

  if (js_min_mode) {
console.log("three.core.min.js")
    js.push(
  "jThree/three.core.min.js"
    );
  }
  else {
    js.push(
  "_private/js/XMLHttpRequestZIP.js"
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

// ,"jThree/three.ShaderParticles.js"
// ,"jThree/three.SPE.js"

  ,"js/one_euro_filter.js"
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
}

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

  System._browser.translation.dictionary = {
	"MMD": {
		"start": {
			"_translation_": {
				"_default_": "Press START to begin loading.\n\n- Drop a MMD model zip<VRM>to use your own 3D model.\n- Drop a VMD/FBX motion to convert 3D to simple video file.",
				"ja": "START を押してロードを開始します。\n\n- 3Dモデルを使用するには、MMDモデルのzip<VRM>をドロップします。\n- VMD/FBXモーションをドロップして3Dをビデオファイルに変換します。",
				"zh": "按 START 開始載入程序。\n\n- 拖曳ZIP壓縮的MMD模型<VRM>作為你的3D人物。\n- 拖曳VMD/FBX動作檔案以自動轉換成簡單的影像檔案。"
			},
			"custom_model": {
				"_translation_": {
					"_default_": "Press START to begin with your custom 3D model.\n\n(Click here to reset to the default model.)",
					"ja": "START を押してカスタム 3D モデルを開始します。\n\n(ここをクリックしてデフォルトのモデルにリセットします。)",
					"zh": "按 START 以你的自訂人物模型開始載入程序。\n\n(按此重置並使用預設模型。)"
				}
			}
		}
	}
  };

// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap
  const import_map = {
    'imports': {
      'three': './three.js/' + MMD_SA.THREEX.three_filename,
      './libs/': './three.js/libs/',
      './curves/': './three.js/curves/',
      './math/': './three.js/',
      './postprocessing/': './three.js/postprocessing/',
      './shaders/': './three.js/shaders/',
    }
  };

  var html = [
'<script type="importmap">',
JSON.stringify(import_map),
'</scr'+'ipt>\n',
  ].join('');

  js.forEach(function (str) {
    html += (/\;/.test(str)) ? '<script>' + str + '</scr'+'ipt>\n' : '<script language="JavaScript" src="' + str + '"></scr'+'ipt>\n';
  });

  document.write(html);

  // media control
  document.write('<script language="JavaScript" src="js/SA_media_control.js"></scr'+'ipt>');

  document.write('<script language="JavaScript" src="js/audio_BPM.js"></scr'+'ipt>');
  document.write('<script type="text/goml"></scr'+'ipt>');
})();


// Matrix rain
if (returnBoolean("UseMatrixRain") || use_MatrixRain) {
  use_MatrixRain = true
  document.write('<script language="JavaScript" src="js/canvas_matrix_rain.js"></scr'+'ipt>');
}

// WebGL 2D
var use_WebGL_2D// = false
if (use_WebGL_2D) {
  document.write('<script language="JavaScript" src="js/html5_webgl2d.js"></scr'+'ipt>');
}
