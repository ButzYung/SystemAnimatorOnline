// (2024-05-08)

/*!
 * jThree.MMD.js JavaScript Library v1.6.1
 * http://www.jthree.com/
 *
 * Requires jThree v2.0
 * Includes mmd.three.js v0.92 | Copyright (c) 2012-2015 katwat
 * Includes Encoding.js v1.06 | Copyright (c) 2013-2014 polygon planet
 *
 * The MIT License
 *
 * Copyright (c) 2014 Matsuda Mitsuhide, katwat and other contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 * Date: 2015-04-20
 */

jThree.MMD = jThree.mmd = {
	_onLoop: false,
	_delta: 0,
	_animate: function( delta ) {

		jThree.MMD._delta = delta = delta * 0.001;

// AT: motion shuffle, playback rate, etc START
if (self.MMD_SA) {
// visibility check for x (and other THREE) objects, to make sure that they are rendered at least once before they can be hidden
  if (MMD_SA._rendered_once && !MMD_SA._x_object_displayed_once) {
    MMD_SA._x_object_displayed_once = true
    MMD_SA_options.mesh_obj_all.forEach(function (x_object) {
//console.log(x_object)
var obj = x_object._obj

if (!x_object.use_child_animation_texture)
  obj.scale.x = obj.scale.y = obj.scale.z = x_object.scale
//console.log(x_object.id+'/'+x_object.scale)

if (MMD_SA_options.Dungeon) {
  x_object.visible = obj.visible
  return
}

x_object.visible = (x_object.hidden_on_start && !obj.visible) ? false : (obj.scale.x > 0)
if (/^\#mikuPmx(\d+)$/.test(x_object.id)) {
  var model_para = MMD_SA_options.model_para_obj_all[RegExp.$1]
  x_object.visible = !(model_para.hidden_on_start || MMD_SA_options.hidden_on_start)
}

if (x_object.visible)
  x_object.show(true)
else
  x_object.hide(true)
    })

    if (MMD_SA_options.use_speech_bubble && !MMD_SA_options.MMD_disabled) {
      const SB = MMD_SA.SpeechBubble
      SB._mesh.scale.x = SB._mesh.scale.y = SB._mesh.scale.z = 1
      if (!SB.visible)
        MMD_SA.THREEX.mesh_obj.get("SpeechBubbleMESH").hide()
    }
  }

  MMD_SA_options.model_para_obj_all.forEach(function (model_para, idx) {
    if (model_para.scale)
      THREE.MMD.getModels()[idx].mesh.scale.set(model_para.scale,model_para.scale,model_para.scale)
  });

// CircularSpectrumMESH
  let obj = MMD_SA_options.mesh_obj_by_id["CircularSpectrumMESH"]
  if (obj) {
    if (MMD_SA_options.use_CircularSpectrum && (MMD_SA.music_mode || (WallpaperEngine_CEF_mode && MMD_SA.AudioFFT && MMD_SA.AudioFFT._has_audio))) {
      if (MMD_SA.AudioFFT && MMD_SA.AudioFFT._fft128) {
        let pos_spectrum = MMD_SA_options.CircularSpectrum_position
        if (!pos_spectrum) {
          pos_spectrum = MMD_SA.center_view
          pos_spectrum[1] += 10
        }

// for Dungeon
        if (MMD_SA_options.Dungeon) {
          if (!obj.pos_base)
            obj.pos_base = obj._obj.position.clone()
          if (!obj.rot_base)
            obj.rot_base = {x:0, y:0, z:0}
          if (!obj._pos_updated_) {
            MMD_SA_options.Dungeon.character.pos_update()
            obj._pos_updated_ = true
            obj._obj.position.add(MMD_SA.TEMP_v3.fromArray(pos_spectrum))
          }
        }
        else {
          obj._obj.position.fromArray(pos_spectrum)
        }

//        var beat = (EV_usage_sub && EV_usage_sub.BD) ? EV_usage_sub.BD.beat : 0
        const scale = obj._obj.scale
        scale.x = scale.y = scale.z = 1

        obj.show()

        const _fft      = MMD_SA.AudioFFT._fft128
        const _fft_last = MMD_SA.AudioFFT._fft_last128
        for (let i = 0, i_max = _fft.length; i < i_max; i++) {
          let v = _fft[i]
          let v_last = _fft_last[i] || 0
          if (v > 100)
            v = 100
          if (v < v_last - 10)
            v = v_last - 10
          _fft_last[i] = v

          const obj = MMD_SA.THREEX.mesh_obj.get_three("CircularSpectrum" + i + "MESH")
          obj.material.opacity = MMD_SA_options.CircularSpectrum_opacity || 0.8
          obj.scale.y = 0.5 + (v/100) * 19.5
        }
      }
    }
    else {
      obj.hide()
      if (MMD_SA_options.Dungeon)
        obj._pos_updated_ = undefined
    }
  }

  MMD_SA._rendered_once = true
}

if (self.MMD_SA && !MMD_SA_options.MMD_disabled) {
  if (MMD_SA._gravity_) {
    let gravity
    if (MMD_SA._gravity_factor <= 0) {
      MMD_SA._gravity_factor = null
      MMD_SA._gravity_ = null
      gravity = MMD_SA.gravity
    }
    else {
      gravity = []
      var gravity_default = MMD_SA.MMD.motionManager.para_SA.gravity || [0,-1,0]
      for (var i = 0; i < 3; i++)
        gravity[i] = MMD_SA._gravity_[i] * MMD_SA._gravity_factor + gravity_default[i] * (1-MMD_SA._gravity_factor)
      MMD_SA._gravity_factor -= 1/60
    }

    THREE.MMD.setGravity( gravity[0]*9.8*10, gravity[1]*9.8*10, gravity[2]*9.8*10 )
//DEBUG_show(MMD_SA._gravity_+'/'+MMD_SA._gravity_factor+'\n'+gravity)

    if (MMD_SA.THREEX.enabled && gravity.every((v,i)=>v==MMD_SA.gravity[i])) {
      MMD_SA.THREEX.models.forEach(model=>{
        model.resetPhysics();
      });
    }
  }

  var _delta = delta
  var mmd = MMD_SA.MMD
  var vo = Audio_BPM.vo
  var ignore_para = vo.motion_by_song_name_mode

  var mm, para, BPM, playbackRate, _playbackRate
  mm = mmd.motionManager
  para = ((!ignore_para && mm.para_SA.BPM) || {})
  BPM = (para.BPM || 120)
  playbackRate = (vo.BPM_mode) ? vo._sender.playbackRate : 120/BPM
  _playbackRate = playbackRate * (para._playbackRate || 1) * MMD_SA.playbackRate

  jThree.MMD._delta = delta = _delta * _playbackRate

  var model = THREE.MMD.getModels()[0]
  var skin = model.skin
//DEBUG_show(mm.lastFrame_)

// mainly for temp processing by other functions (eg. onended, custom_motion_shuffle)
  MMD_SA._motion_time_ = skin.time+delta
//DEBUG_show(MMD_SA._motion_time_)
  var onended_done
  if (!MMD_SA._force_motion_shuffle && MMD_SA.motion_shuffle_started) {
    let result = { return_value:null };
    if (skin.time+delta > mm.lastFrame_/30) {
// onended has to run BEFORE custom_motion_shuffle in some cases
      window.dispatchEvent(new CustomEvent("SA_MMD_model0_onmotionended", { detail:{ is_loop:true, result:result } }));
      if (!result.return_value) {
        mm.para_SA.onended && mm.para_SA.onended(true);
      }
      if (MMD_SA._freeze_onended) {
        skin.time = mm.lastFrame_/30 - delta - (1/59)/1000
        MMD_SA._freeze_onended = null
      }
      else {
        onended_done = true
      }
    }
    else {
      window.dispatchEvent(new CustomEvent("SA_MMD_model0_onmotionplaying", { detail:{ result:result } }));
      if (!result.return_value) {
        mm.para_SA.onplaying && mm.para_SA.onplaying(0);
      }
    }
  }

// not necessarily shuffle-related, more like a normal function that runs before motion shuffle
  if (MMD_SA_options.custom_motion_shuffle)
    MMD_SA_options.custom_motion_shuffle()

  var multi_model_motion_reset_check = []
  var multi_model_motion_reset = []
  for (var i = 0, i_max = MMD_SA_options.model_para_obj_all.length; i < i_max; i++) {
    multi_model_motion_reset_check[i] = true
    multi_model_motion_reset[i] = !MMD_SA.motion_shuffle_started || MMD_SA_options.model_para_obj_all[i]._motion_name_next
  }

  var _delta0_from_last_loop = Math.max(Math.min(skin.time+delta - mm.lastFrame_/30, 0.1), 0)
  if (MMD_SA._force_motion_shuffle || multi_model_motion_reset[0] || _delta0_from_last_loop) {
    let adjust_center_view = !MMD_SA.motion_shuffle_started
    mmd.frame_time_ref = 0

    if (!onended_done) {
      let result = { return_value:null };
      window.dispatchEvent(new CustomEvent("SA_MMD_model0_onmotionended", { detail:{ result:result } }));
      if (!result.return_value) {
        mm.para_SA.onended && mm.para_SA.onended();
      }
    }

    let motion_blending_disabled = !MMD_SA.motion_shuffle_started
    let mm_old = mm

    let motion_changed = !MMD_SA.motion_shuffle_started
    if (MMD_SA.motion_shuffle())
      motion_changed = true

// general-purpose motion-end event
    MMD_SA_options.onmotionended && MMD_SA_options.onmotionended(motion_changed)

// check the backup list ._motion_shuffle_list_default instead of .motion_shuffle_list_default since .motion_shuffle_list_default can be null sometimes
    let motion_index = (MMD_SA_options.motion_shuffle || MMD_SA_options._motion_shuffle_list_default) ? MMD_SA_options.motion_shuffle_list[MMD_SA.motion_shuffle_index] : 0
    let motion = MMD_SA_options.motion[motion_index]

    window.dispatchEvent(new CustomEvent("SA_MMD_model0_onmotionchange", { detail:{ motion_old:mm_old, motion_new:mmd.motionManager } }));

    if (MMD_SA._force_motion_shuffle)
      adjust_center_view = true
    MMD_SA._force_motion_shuffle = null

// a trick for certain extra animations to avoid an extreme condition in which (Animation.time===now), which causes error
    _delta = (1/59)/1000

    let blending_options

    if (motion_changed) {
      adjust_center_view = true

      mm = mmd.motionManager
      para = ((!ignore_para && mm.para_SA.BPM) || {})
      BPM = (para.BPM || 120)
      playbackRate = (vo.BPM_mode) ? vo._sender.playbackRate : 120/BPM
      _playbackRate = playbackRate * (para._playbackRate || 1) * MMD_SA.playbackRate

      let para_SA = mm.para_SA
      let para_SA_old = mm_old.para_SA
/*
para_SA.motion_blending = {
  fadeout: {}
};
*/
      blending_options = !motion_blending_disabled && ((para_SA_old.motion_blending && para_SA_old.motion_blending.fadeout && (!para_SA_old.motion_blending.fadeout.condition || para_SA_old.motion_blending.fadeout.condition(mm_old, mm)) && (!para_SA.motion_blending || !para_SA.motion_blending.fadein || !para_SA.motion_blending.fadein.condition || para_SA.motion_blending.fadein.condition(mm_old, mm)) && para_SA_old.motion_blending.fadeout) || (para_SA.motion_blending && para_SA.motion_blending.fadein && (!para_SA.motion_blending.fadein.condition || para_SA.motion_blending.fadein.condition(mm_old, mm)) && (!para_SA_old.motion_blending || !para_SA_old.motion_blending.fadeout || !para_SA_old.motion_blending.fadeout.condition || para_SA_old.motion_blending.fadeout.condition(mm_old, mm)) && para_SA.motion_blending.fadein));

      if (blending_options) {
        let skin_blend = Object.create(model.skin)
        skin_blend._is_skin = true
        skin_blend._motion_index_MMD_SA_extra = 0
        skin_blend._is_MMD_SA_custom_animation = skin_blend._is_MMD_SA_animation = skin_blend._MMD_SA_disabled = skin_blend.freeze_onended = true
        model.skin_MMD_SA_extra[0] = skin_blend
/*
        let morph_blend = Object.create(model.morph)
        morph_blend._is_morph = true
        morph_blend._motion_index_MMD_SA_extra = 0
        morph_blend._is_MMD_SA_custom_animation = morph_blend._is_MMD_SA_animation = morph_blend._MMD_SA_disabled = morph_blend.freeze_onended = true
        model.morph_MMD_SA_extra[0] = morph_blend
*/
        let ca = MMD_SA_options.custom_action[0]
        ca.blending_options = blending_options
        ca._time_ini = RAF_timestamp
        ca._seek_time_ = (mm_old.para_SA.loop_on_blending && !mm_old.para_SA.freeze_onended && _delta0_from_last_loop && (_delta0_from_last_loop + ((mm_old.firstFrame_ && mm_old.firstFrame_/30) || 0))) || Math.min(skin_blend.time+delta, mm_old.lastFrame_/30-(1/59)/1000);
//console.log(mm_old.filename, !!mm_old.para_SA.freeze_onended, ca._seek_time_)

        MMD_SA._ignore_physics_reset = true;
      }

      let obj = model._MMD_SA_cache_current = model._MMD_SA_cache[motion.path]
      model.skin  = obj.skin
      model.morph = obj.morph
      model.camera = obj.camera
      THREE.MMD.setupCameraMotion(model.camera)

      model.resetMotion((mm.para_SA.initial_physics_reset != null) ? !mm.para_SA.initial_physics_reset : MMD_SA._ignore_physics_reset)

      MMD_SA.reset_skin(0)
      MMD_SA.reset_morph(0)
      THREE.MMD.adjustMotionDuration()

      MMD_SA_options.model_para_obj.onMotionChange && MMD_SA_options.model_para_obj.onMotionChange();

      _delta0_from_last_loop = 0

      if (MMD_SA.THREEX.enabled) MMD_SA.THREEX.get_model(0)._reset_physics_ = true;
    }
    else {
      let ignore_physics_reset = ((mm.para_SA.loopback_physics_reset == false) || ((mm.lastFrame_ == mm.lastFrame) && !mm.firstFrame_ && !mm.para_SA.loopback_fading))
      model.resetMotion(ignore_physics_reset || MMD_SA._ignore_physics_reset)
    }
//DEBUG_show(motion.path.replace(/^.+[\/\\]/, "")+"/"+mmd.motionManager.filename+'/'+(MMD_SA_options.motion[model.skin._motion_index].path.replace(/^.+[\/\\]/, ""))+'/'+parseInt(mm.lastFrame_/30)+'/'+Date.now())


    if (blending_options) {
MMD_SA.fadeout_opacity = null;
    }
    if (MMD_SA.fadeout_opacity == 1) {
MMD_SA.fadeout_texture_uploaded = false;

const w = SL.width;
const h = SL.height;
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
MMD_SA.fadeout_canvas.width  = SL.width;
MMD_SA.fadeout_canvas.height = SL.height;

const context = MMD_SA.fadeout_canvas.getContext("2d");
context.globalCompositeOperation = 'copy';
context.drawImage(MMD_SA.THREEX.SL, 0,0);
/*
var imagedata = context.getImageData(0,0,w,h).data
for (var i = 0; i < 8; i++)
  DEBUG_show(imagedata[ini + i],0,1)
*/
//DEBUG_show("(pixels read)",0,1)

MMD_SA.fadeout_opacity = 0.95;
    }


    model.skin._loop_timestamp = RAF_timestamp

    if (!blending_options) {
      model.skin_MMD_SA_extra[0] = model.morph_MMD_SA_extra[0] = MMD_SA.Animation_dummy
    }

    for (var i = 1, i_max = MMD_SA_options.model_para_obj_all.length; i < i_max; i++) {
      if (MMD_SA_options.model_para_obj_all[i].mirror_motion_from_first_model)
        multi_model_motion_reset[i] = true
    }

    mm.para_SA.onstart && mm.para_SA.onstart(motion_changed);

    if (adjust_center_view && !mm.para_SA.adjust_center_view_disabled) {
      MMD_SA.reset_camera()
    }

    jThree.MMD._delta = delta = _delta * _playbackRate

    model.playMotion()
    if (_delta0_from_last_loop || mm.firstFrame_) {
//DEBUG_show(mm.firstFrame_/30,0,1)
      model.seekMotion(_delta0_from_last_loop + ((mm.firstFrame_ && mm.firstFrame_/30) || 0))
    }
//self._TEST=true
//DEBUG_show(obj.skin.duration,0,1)
  }
  else {
    _delta0_from_last_loop = 0
  }

  for (var i = 1, i_max = THREE.MMD.getModels().length; i < i_max; i++) {
    if (!multi_model_motion_reset_check[i])
      continue

    var _model = THREE.MMD.getModels()[i]
    if (!_model.skin)
      continue

    var mm, mm0
    mm = mm0 = MMD_SA.motion[_model.skin._motion_index]
    var model_para = MMD_SA_options.model_para_obj_all[i]

// ignore frame range for online character with BPM motion (ie. use the full motion duration as lastFrame)
    var lastFrame = (model_para.is_OPC && mm.para_SA.BPM) ? mm.lastFrame : mm.lastFrame_

    var _delta_from_last_loop = Math.max(Math.min(_model.skin.time+delta - lastFrame/30, 0.1), 0)
    if (!multi_model_motion_reset[i]) {
      if (!_delta_from_last_loop)
        continue
// ignore onended_NPC for online PC (for now at least)
      !mm.para_SA.is_OPC && mm.para_SA.onended_NPC && mm.para_SA.onended_NPC(i)
    }
    else {
      _delta_from_last_loop = 0
    }

    var motion_changed = false
    var obj
    if (model_para._motion_name_next || (multi_model_motion_reset[i] && model_para.mirror_motion_from_first_model)) {
      mm0 = mmd.motionManager
      _delta_from_last_loop = _delta0_from_last_loop

      var motion_name_by_model = model_para._motion_name_next || mm0.para_SA.multi_model_motion_list && mm0.para_SA.multi_model_motion_list[i-1]
      model_para._motion_name_next = null

      var _path = ((motion_name_by_model && MMD_SA_options.motion_para[motion_name_by_model]) || mm0.para_SA)._path
//DEBUG_show(_path+'\n',0,1)
      var obj = _model._MMD_SA_cache[_path]
      motion_changed = obj && (obj.skin._motion_index != _model.skin._motion_index)
    }

    if (motion_changed) {
      _model._MMD_SA_cache_current = obj
      _model.skin  = obj.skin
      _model.morph = obj.morph

      mm = MMD_SA.motion[obj.skin._motion_index]
      if (!model_para.mirror_motion_from_first_model)
        mm0 = mm

      _model.resetMotion((mm.para_SA.initial_physics_reset != null) ? !mm.para_SA.initial_physics_reset : MMD_SA._ignore_physics_reset)

      MMD_SA.reset_skin(i)
      MMD_SA.reset_morph(i)
      THREE.MMD.adjustMotionDuration()

      model_para.onMotionChange && model_para.onMotionChange();

      if (mm.para_SA.NPC_turns_to_you) {
        var npc = _model.mesh
        var c = THREE.MMD.getModels()[0].mesh
        MMD_SA.TEMP_v3.set(0, Math.PI/2 - Math.atan2((c.position.z-npc.position.z), (c.position.x-npc.position.x)), 0)
        npc.quaternion.setFromEuler(MMD_SA.TEMP_v3)
      }
    }
    else {
      var ignore_physics_reset = _model.skin.time && ((mm.para_SA.loopback_physics_reset == false) || ((lastFrame == mm.lastFrame) && !(model_para._firstFrame_||mm.firstFrame_) && !mm.para_SA.loopback_fading))
      _model.resetMotion(ignore_physics_reset || MMD_SA._ignore_physics_reset)
    }

    _model.skin._loop_timestamp = RAF_timestamp

    mm.para_SA.onstart && mm.para_SA.onstart(motion_changed);

    _model.playMotion()
    if (_delta_from_last_loop || (model_para._firstFrame_||mm0.firstFrame_)) {
      _model.seekMotion(_delta_from_last_loop + (((model_para._firstFrame_||mm0.firstFrame_) && (model_para._firstFrame_||mm0.firstFrame_)/30) || 0))
    }

    model_para._firstFrame_ = null
  }

  MMD_SA._ignore_physics_reset = null


var t = (window.performance) ? performance.now() : Date.now();
if (mmd.frame_time_ref) {
  if (para._playbackRate) {
    var time_diff = t - mmd.frame_time_ref
    if (time_diff >= para._playbackRate_countdown) {
      var p_ratio = para._playbackRate_countdown / time_diff
      _playbackRate = playbackRate * (para._playbackRate * p_ratio + (1-p_ratio))
//DEBUG_show(_playbackRate,0,1)
      jThree.MMD._delta = delta = _delta * _playbackRate

      para._playbackRate = null
    }
    else
      para._playbackRate_countdown -= time_diff
  }
}
else if (use_SVG_Clock || vo.BPM_mode) {
  var beat_frame = para.beat_frame
  if (beat_frame != null) {
    var current_frame = (model.skin.time+delta)*30

    // use video time scale to calculate beats
    var beat_interval = 60/BPM
    var time_from_beat_to_beat = (current_frame - beat_frame)/30
//var beats0 = time_from_beat_to_beat / beat_interval
//    time_from_beat_to_beat /= playbackRate
    if (vo.BPM_mode) {
      var ao = vo.audio_obj
      time_from_beat_to_beat -= (ao.currentTime - ao.beat_reference) * playbackRate
    }

    var beat, beats
    beat = beats = time_from_beat_to_beat / beat_interval

    beat -= ~~(beat)
    if (beat < 0)
      beat++
//beat+=0.5;if(beat>1)beat--
//DEBUG_show(beat,0,1)
    if (beat < 0.5)
      beat = -beat
    else
      beat = 1 - beat

    beats = Math.round(beats + beat)
    if ((beats % 2) && (!vo.BPM_mode || para.match_even_beats_only)) {
      if (beat < 0) {
        beat++
        beats++
      }
      else {
        beat--
        beats--
      }
    }
    var beats_info = '/' + ((beats % 2)?'odd':'even')

    var sec = beat * beat_interval

    if (!vo.BPM_mode) {
      // adjust to real-time scale
      sec /= playbackRate

      var msec = new Date().getMilliseconds()/1000
      sec += msec

      if (sec > 0.5)
        sec -= 1
      else if (sec < -0.5)
        sec += 1

      // revert back to video time scale
      sec *= playbackRate

      beat = sec / beat_interval
    }

    // adjust the video time scale to match the current playbackRate
    sec /= playbackRate

//DEBUG_show(beats+'/'+msec,0,1)
    if (Math.abs(sec) > 0.05) {
      var mod = (Math.abs(beat) > 0.5) ? 2 : 1
      para._playbackRate = 1 + sec/mod
      para._playbackRate_countdown = 1000*mod
//DEBUG_show(para._playbackRate+'/'+para._playbackRate_countdown,0,1)
var info = Math.abs(~~(beat * 100) / 100) + 'beat' + beats_info
DEBUG_show('BPM sync(' + ((sec>0)?'+':'-') + info + ')', 2)
    }
    else {
//      DEBUG_show('(BPM in sync' + beats_info + ')', 2)
    }
  }
}
mmd.frame_time_ref = t

  if (MMD_SA.fadeout_opacity != null) {
    MMD_SA.fadeout_opacity -= delta

    let context = SL_2D_front.getContext("2d")
    if (MMD_SA.fadeout_opacity > 0) {
// for desktop and mobile
      let w,h, update_size
      w = MMD_SA.fadeout_canvas.width
      h = MMD_SA.fadeout_canvas.height
      if ((SL_2D_front.width != w) || (SL_2D_front.height != h)) {
        update_size = true
        SL_2D_front.width  = w
        SL_2D_front.height = h
      }
      context.globalCompositeOperation = 'copy'
      context.globalAlpha = MMD_SA.fadeout_opacity
      context.drawImage(MMD_SA.fadeout_canvas, 0,0)
      if (use_WebGL_2D) {
        if (SL_2D_front._WebGL_2D.canvas.style.display != "inline")
          SL_2D_front._WebGL_2D.canvas.style.display = "inline"
        SL_2D_front._WebGL_2D.draw()
        if (update_size) {
          SL_2D_front._WebGL_2D.canvas.style.width  = SL.style.width
          SL_2D_front._WebGL_2D.canvas.style.height = SL.style.height
        }
      }
      else {
        if (SL_2D_front.style.display != "inline")
          SL_2D_front.style.display = "inline"
        if (update_size) {
          SL_2D_front.style.width  = SL.style.width
          SL_2D_front.style.height = SL.style.height
        }
      }
//DEBUG_show(MMD_SA.fadeout_opacity,0,1)
    }
    else {
      MMD_SA.fadeout_opacity = null

      context.globalCompositeOperation = 'copy'
      context.globalAlpha = 1
      context.clearRect(0,0, SL_2D_front.width,SL_2D_front.height)
      SL_2D_front.style.display = "none"
      if (use_WebGL_2D) {
        let w2d = SL_2D_front._WebGL_2D
        w2d.gl.clear(w2d.gl.COLOR_BUFFER_BIT);
        w2d.canvas.style.display = "none"
      }
    }
  }
  else {
    SL_2D_front.style.display = "none";
  }

  MMD_SA._playbackRate = _playbackRate
//DEBUG_show(playbackRate+'/'+_playbackRate)
}

if (!is_SA_child_animation && MMD_SA_options.child_animation_as_texture) {
  var redraw
  var c_id = 0
  for (var i = 0; i < SA_child_animation_max; i++) {
    var ani = SA_child_animation[i]
    if (!ani)
      continue

var child = document.getElementById("Ichild_animation" + i)
var cw, cwSL
if (child) {
  cw = child.contentWindow
  cwSL = cw.SL
  if (!cwSL)
    continue
}
else
  continue

if (!cwSL._drawn_id || (ani._SL_drawn_id != cwSL._drawn_id)) {
//DEBUG_show(ani._SL_drawn_id + ":" + cwSL._drawn_id,0,1)
  ani._SL_drawn_id = cwSL._drawn_id
  redraw = true
}

    if (++c_id >= MMD_SA_options.child_animation_as_texture)
      break
  }

  if (redraw) {
    c_id = 0
    for (var i = 0; i < SA_child_animation_max; i++) {
      var ani = SA_child_animation[i]
      if (!ani)
        continue

var child = document.getElementById("Ichild_animation" + i)
var cw, cwSL
if (child) {
  cw = child.contentWindow
  cwSL = cw.SL
  if (!cwSL)
    continue
}
else
  continue

//DEBUG_show(ani._SL_drawn_id + ":" + cwSL._drawn_id,0,1)

var _SL = jThree( "import" ).contents().find( "#j3_childAnimationCanvas" + c_id )[0];
_SL._canvas_ready = true
_SL.width  = MMD_SA_options.child_animation_width
_SL.height = MMD_SA_options.child_animation_height

var context = _SL.getContext("2d")
context.globalCompositeOperation = 'copy'
context.globalAlpha = MMD_SA_options.child_animation_opacity

try {
  context.drawImage(cwSL._canvas_for_copy||cwSL, 0,0,_SL.width,_SL.height)
  jThree( "#ChildAnimation" + c_id + "TXR" ).three( 0 ).needsUpdate = true
}
catch (err) { DEBUG_show(err.description) }

      if (++c_id >= MMD_SA_options.child_animation_as_texture)
        break
    }
  }
}
// motion shuffle, playback rate, etc END

		THREE.MMD.updateMotion( delta );

		if ( jThree.MMD._onLoop ) {

			if ( THREE.MMD.motionLoop ) {
				jThree.MMD.onLoop && jThree.MMD.onLoop();
			} else {

				THREE.MMD.pauseMotion();
				jThree.update( arguments.callee, false );
				jThree.MMD.complete && jThree.MMD.complete();
			}

			jThree.MMD._onLoop = false;

		}

	},
// AT: Add loop
	play: function(loop) {
if ( loop !== undefined ) this.loop = loop;
		THREE.MMD.playMotion( loop );
		jThree.update( jThree.MMD._animate );
if (MMD_SA.THREEX.enabled) {
  MMD_SA.THREEX.models.forEach(model=>{ model.animation.play(); });
}
	},
	pause: function() {
		THREE.MMD.pauseMotion();
		jThree.update( jThree.MMD._animate, false );
if (MMD_SA.THREEX.enabled) {
  MMD_SA.THREEX.models.forEach(model=>{ model.animation.pause(); });
}
	},
	reset: function() {

		THREE.MMD.resetMotion();
		jThree.update( jThree.MMD._animate, false );
	},
	setup: function( hush ) {
		jThree.extend( jThree.MMD, hush );
		return this;
	},
	sync: function( selector, delay ) {

		jThree.MMD._delay = delay || 0;
		jQuery( selector ).on( "play", jThree.MMD.play )
		.on( "pause ended", jThree.MMD.pause )
		.on( "timeupdate", function() {
			jThree.MMD.seek( this.currentTime + jThree.MMD._delay );
		} );

	},
	_edgeScale: 1,
	onLoop: null,
	onStop: null,
	_camera: true,
	get cameraMotion() {
		return this._camera;
	},
	set cameraMotion( bool ) {

		this._camera = bool;
		THREE.MMD.getCameraMotion().forEach( function( m ) {
			m[ bool ? "play" : "pause" ]();
		} );

	},
	get edgeScale() {
		return this._edgeScale;
	},
	set edgeScale( scale ) {

		this._edgeScale = scale;

		THREE.MMD.getModels().forEach( function( model ) {
			model.mesh.material.materials.forEach(function(w,i) {
				var pmxMaterial = model.pmx.materials[i];
				if ((pmxMaterial.drawFlags & 0x10) !== 0) {
					w.mmdEdgeThick = pmxMaterial.edgeSize * scale;
				}
			});
		} );

	},

	_shadowDark: 0.7,
	get shadowDark() {
		return this._shadowDark;
	},
	set shadowDark( val ) {

		this._shadowDark = val;

		THREE.MMD.getModels().forEach( function( model ) {
			model.mesh.material.materials.forEach(function(w,i) {
				var pmxMaterial = model.pmx.materials[i];
				if ((pmxMaterial.drawFlags & 0x08) !== 0) {
					w.mmdShadowDark = val;
				}
			});
		} );

	},

	_duration: 0,
	get duration() {
		return this._duration;
	},
	set duration( t ) {
		this._duration = t;
		THREE.MMD.adjustMotionDuration();
	},

	get groundLevel() {
		return jThree.MMD._ground.getY();
	},
	set groundLevel( y ) {
		jThree.MMD._ground.setY( y );
	},
	/*,
	get: function( num ) {

		var arr = jThree.map( jThree( "[type='MMD']" ), function( elem ) {
			return;
		} );

		return num == null ? arr : num < 0 ? arr[ arr.length + num ] : arr[ num ];
	}*/
	toon: [
		"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAQMAAABJtOi3AAAABlBMVEX////Nzc1XNMFjAAAAD0lEQVQI12OgNvgPBFQkAPcnP8G6A9XkAAAAAElFTkSuQmCC",
		"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAQMAAABJtOi3AAAABlBMVEX////14eF2pXIGAAAAD0lEQVQI12OgNvgPBFQkAPcnP8G6A9XkAAAAAElFTkSuQmCC",
		"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAQMAAABJtOi3AAAABlBMVEX///+ampo+MvaSAAAAD0lEQVQI12OgNvgPBFQkAPcnP8G6A9XkAAAAAElFTkSuQmCC",
		"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAQMAAABJtOi3AAAABlBMVEX////47+sAKyXFAAAAD0lEQVQI12OgNvgPBFQkAPcnP8G6A9XkAAAAAElFTkSuQmCC",
		"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgBAMAAACBVGfHAAAAGFBMVEX/////5t3/6N7/7eX/+fb/9PD//Pv/8Op5dFmOAAAAQklEQVQoz2MYBRQDtjQYgAq4gEAIiEiBCIYiAEjYjaEcBIrLoSA0lMEYDTAooQEGRQgtqAgTEEQD5AgoYQggAFgOAHEkIrrgwCawAAAAAElFTkSuQmCC",
		"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAflBMVEX/7WHDrAPErQT/7mT/7mn66Fj86VvizTLJswz/8of/8Hf/73L+7F7NtxLLtQ7/7mb///z//ez//OL/+9vs2ELk0Db//vX/+L7/723o1DzRvBjFrgX/+sz/+Lr/9qzw3Uj/+tL/97b/9Jf/85D/9Z//8X//6DHFrgb/+MD/5AUNrqVlAAAAwklEQVQ4y+XO226DMAwAUG/OutmhgyQQkgYYl162///BmaoV7UPFc9XzYlu2bMNrQrhS16hyRMxVCLlSgWrNmpkPvP8lDogKutb4Qbvajc5b6xpr92071qbvTMNMPfjCdzgVoulJkx2oNW4wtulqYl8YoIkVaq1lOcB8Sy4hjk4SDHTQd+8tcLokR1jxByuO8CKybDP7uLE5y84AyrKMsaqqz4VUMUZp/AjYbcW3+FrM5VbsBJxSen8kpXSCtxVPMfAPmVcPlflaGvEAAAAASUVORK5CYII=",
		"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAQMAAABJtOi3AAAAA1BMVEX///+nxBvIAAAAC0lEQVQI12MY5AAAAKAAAfgHMzoAAAAASUVORK5CYII=",
		"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAQMAAABJtOi3AAAAA1BMVEX///+nxBvIAAAAC0lEQVQI12MY5AAAAKAAAfgHMzoAAAAASUVORK5CYII=",
		"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAQMAAABJtOi3AAAAA1BMVEX///+nxBvIAAAAC0lEQVQI12MY5AAAAKAAAfgHMzoAAAAASUVORK5CYII=",
		"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgAQMAAABJtOi3AAAAA1BMVEX///+nxBvIAAAAC0lEQVQI12MY5AAAAKAAAfgHMzoAAAAASUVORK5CYII="
	]
};

jThree.fn.MMD = jThree.fn.mmd = function( name, val ) {

	if ( typeof name === "string" ) {

		if ( name === "seek" ) {

			var objs = this.three();

			objs.forEach( function( v ) {
				if ( v.__mmd ) {
					v.__mmd.seekMotion( val );
				} else if ( v instanceof THREE.Light ) {
					var target = THREE.MMD.getLightMotion();
					target && target.seek( val );
				}
			} );

			THREE.MMD.getCameraMotion().forEach( function( m ) {
				if ( objs.indexOf( m.persepectiveCamera ) !== -1 ) {
					m.seek( val );
				}
			} );

		} else if ( name === "motion" ) {
			var cameras = this.three();
			THREE.MMD.getCameraMotion().forEach( function( m ) {
				if ( cameras.indexOf( m.persepectiveCamera ) !== -1 ) {
					m[ val ? "play" : "pause" ]();
				}
			} );
		}

	} else if ( typeof name === "object" ) {

		var that = this;

		$.each( name, function( key, value ) {
			that.MMD( key, value );
		} );

	}

	return this;
};

(function() {

var loadBuffer, EventMonitor, BinaryStream,

	// loader
	Exception,
	convV, convV2, convR, convR2,
	PMX, VMD,

	// builder, handler
	cubicBezier, Animation, cloneKey,
	MMDShader, MMDMaterial, MMDIK, MMDPhysi, MMDMorph, MMDSkin, MMDAddTrans, MMDCamera, MMDLight,
	Model,

	// physics
	btWorld, tmpBV, tmpBQ,
	fixedTimeStep = 1/60, //lastSimulateTime, lastSimulateDuration = 0,

	MMD;

loadBuffer = function( url, onload ) {
// AT: XMLHttpRequestZIP
	var xhr = new XMLHttpRequestZIP;
	xhr.onload = function() {
// AT: Ignore xhr.status, since it may be 0 for offline load.
		if ( 1 || xhr.status === 200 ) { // OK
			onload( xhr ); // see: xhr.response
		} else {
			console.error( url, xhr.statusText );
		}
		xhr = null;
	};
	xhr.open( 'GET', url, true );
	xhr.responseType = 'arraybuffer'; // set type after opened !
	xhr.send();
};

/* loadBlob = function( url, onload, onerror ) {
	load( url, 'blob', onload, onerror );
};

loadDoc = function( url, onload, onerror ) {
	load( url, 'document', onload, onerror );
};

loadJson = function( url, onload, onerror ) {
	load( url, 'json', onload, onerror );
}; */

EventMonitor = function() {
	this.count = 0;
	this.callback = null;
};
EventMonitor.prototype.add = function( callback ) {
	if ( callback ) {
		this.callback = callback;
		this.count = 0;
	}
	this.count++; // capture
};
EventMonitor.prototype.del = function() {
	this.count--; // bubble
	if ( this.count === 0 && this.callback ) {
		this.callback();
		this.callback = null;
	}
};

BinaryStream = function( buffer, littleEndian ) {
	this.dv = new DataView( buffer );
	this.offset = 0;
	this.littleEndian = littleEndian;
};
BinaryStream.prototype.readInt8 = function() {
	var begin = this.offset;
	this.offset += 1;
	return this.dv.getInt8( begin );
};
BinaryStream.prototype.readUint8 = function() {
	var begin = this.offset;
	this.offset += 1;
	return this.dv.getUint8( begin );
};
BinaryStream.prototype.readInt16 = function() {
	var begin = this.offset;
	this.offset += 2;
	return this.dv.getInt16( begin, this.littleEndian );
};
BinaryStream.prototype.readUint16 = function() {
	var begin = this.offset;
	this.offset += 2;
	return this.dv.getUint16( begin, this.littleEndian );
};
BinaryStream.prototype.readInt32 = function() {
	var begin = this.offset;
	this.offset += 4;
	return this.dv.getInt32( begin, this.littleEndian );
};
BinaryStream.prototype.readUint32 = function() {
	var begin = this.offset;
	this.offset += 4;
	return this.dv.getUint32( begin, this.littleEndian );
};
BinaryStream.prototype.readFloat32 = function() {
	var begin = this.offset;
	this.offset += 4;
	return this.dv.getFloat32( begin, this.littleEndian );
};
BinaryStream.prototype.readBytes = function( length ) {
	var begin = this.offset;
	this.offset += length;
	return (new Uint8Array( this.dv.buffer )).subarray( begin, this.offset );
};

// left to right hand
convV = function( a ) { // position or vector
	a[2] *= -1; // inverse z
	return a;
};
convV2 = function( lower, upper ) {
	var t;
	convV( lower );
	convV( upper );
	// swap
	t = lower[2];
	lower[2] = upper[2];
	upper[2] = t;
};
convR = function( a ) { // euler rotation or quaternion
	a[0] *= -1; // inverse x
	a[1] *= -1; // inverse y
	return a;
};
convR2 = function( lower, upper ) {
	var t;
	convR( lower );
	convR( upper );
	// swap
	t = lower[0];
	lower[0] = upper[0];
	upper[0] = t;
	t = lower[1];
	lower[1] = upper[1];
	upper[1] = t;
};

Exception = {
	MAGIC: 'IllegalMagicException',
	DATA: 'IllegalDataException'
};

(function() { // PMX

var Reader, Info, Skin, Vertex, Texture, Material, IKLink, IK, Bone,
	MorphVertex, MorphUV, MorphBone, MorphMaterial, MorphGroup, Morph,
	FrameItem, Frame, Rigid, Joint,

	_bdef1, _bdef2, _bdef4, _sdef; // debug

Reader = function( buffer ) { // extend BinaryStream
	BinaryStream.call( this, buffer, true ); //this.littleEndian = true;

	// read header
	if ( this.readUint32() !== 0x20584d50 ) { //  'PMX '
		throw Exception.MAGIC;
	}
	this.version = this.readFloat32();
	if ( this.version !== 2.0 ) {
		throw Exception.DATA; // not supported
	}
	if ( this.readUint8() !== 8 ) {
		throw Exception.DATA;
	}
	this.encode = this.readUint8(); // 0=UTF16_LE, 1=UTF-8
	this.additionalUvCount = this.readUint8();
	this.vertexIndexSize = this.readUint8();
	this.textureIndexSize = this.readUint8();
	this.materialIndexSize = this.readUint8();
	this.boneIndexSize = this.readUint8();
	this.morphIndexSize = this.readUint8();
	this.rigidIndexSize = this.readUint8();
};
Reader.prototype = Object.create( BinaryStream.prototype );
Reader.prototype.constructor = Reader;

Reader.prototype.readText = function() {
	var l = this.readInt32(), a, b;
	if ( l === 0 ) {
		return '';
	}
	a = [];
	if ( this.encode === 0 ) {
		// utf16_le
		l /= 2;
		while ( l-- > 0 ) {
			a.push( this.readUint16() );
		}
	} else {
		// utf8 -> utf16
		while ( l > 0 ) {
			b = this.readUint8();
			if ( ( b & 0xf0 ) === 0xe0 ) {
				// 3 bytes
				b &= 0x0f;
				b = ( b << 6 ) | ( this.readUint8() & 0x3f );
				b = ( b << 6 ) | ( this.readUint8() & 0x3f );
				l -= 3;
			} else
			if ( ( b & 0xe0 ) === 0xc0 ) {
				// 2 bytes
				b &= 0x1f;
				b = ( b << 6 ) | ( this.readUint8() & 0x3f );
				l -= 2;
			} else {
				// 1 byte
				l--;
			}
			a.push( b );
		}
	}
	return String.fromCharCode.apply( undefined, a );
};
Reader.prototype.readIndex = function( size, vertex ) {
	var i;
	if ( size === 1 ) {
		i = vertex ? this.readUint8() : this.readInt8();
	} else
	if ( size === 2 ) {
		i = vertex ? this.readUint16() : this.readInt16();
	} else
	if ( size === 4 ) {
		i = this.readInt32();
	} else {
		throw Exception.DATA;
	}
	return i;
};
Reader.prototype.readVertexIndex = function() {
	return this.readIndex( this.vertexIndexSize, true );
};
Reader.prototype.readTextureIndex = function() {
	return this.readIndex( this.textureIndexSize );
};
Reader.prototype.readMaterialIndex = function() {
	return this.readIndex( this.materialIndexSize );
};
Reader.prototype.readBoneIndex = function() {
	return this.readIndex( this.boneIndexSize );
};
Reader.prototype.readMorphIndex = function() {
	return this.readIndex( this.morphIndexSize );
};
Reader.prototype.readRigidIndex = function() {
	return this.readIndex( this.rigidIndexSize );
};
// AT: scale
Reader.prototype.readVector = function( n, scale ) {
	var v = [];
	while ( n-- > 0 ) {
		v.push( this.readFloat32() );
	}
if (scale) v=v.map(f=>f*MMD_SA._readVector_scale);
	return v;
};

Info = function( bin ) {
	this.name = bin.readText();
	this.nameEn = bin.readText();
	this.comment = bin.readText();
	this.commentEn = bin.readText();
};

Skin = function( bin ) {
	var w;
	this.type = bin.readUint8();
	switch( this.type ) {
	case 0: // BDEF1
		this.bones = [ readBoneIndex() ];
		this.weights = [ 1.0 ];
		_bdef1++; // debug
		break;
	case 1: // BDEF2
		this.bones = [ readBoneIndex(), readBoneIndex() ];
		w = bin.readFloat32();
		this.weights = [ w, 1.0 - w ];
		_bdef2++; // debug
		break;
	case 2: // BDEF4
		this.bones = [ readBoneIndex(), readBoneIndex(), readBoneIndex(), readBoneIndex() ];
		this.weights = [ bin.readFloat32(), bin.readFloat32(), bin.readFloat32(), bin.readFloat32() ];
		_bdef4++; // debug
		break;
	case 3: // SDEF
		this.bones = [ readBoneIndex(), readBoneIndex() ];
		w = bin.readFloat32();
		this.weights = [ w, 1.0 - w ];
		this.sdefC = bin.readVector( 3 );
		this.sdefR0 = bin.readVector( 3 );
		this.sdefR1 = bin.readVector( 3 );
		_sdef++; // debug
		break;
	default:
		throw Exception.DATA;
	}

	function readBoneIndex() {
		var i = bin.readBoneIndex();
		if (i < 0) { // ボーン指定無しの場合は安全のためゼロにする。当然weightはゼロのはず。
			i = 0;
		}
		return i;
	}
};

Vertex = function( bin ) {
	var n;
	this.pos = convV( bin.readVector(3,true) );
	this.normal = convV( bin.readVector( 3 ) );
	this.uv = bin.readVector( 2 );
	this.additionalUvs = [];
	n = bin.additionalUvCount;
	while ( n-- > 0 ) {
		this.additionalUvs.push( bin.readVector( 4 ) ); // x,y,z,w
	}
	this.skin = new Skin( bin );
	this.edgeScale = bin.readFloat32();
};

Texture = function( bin ) {
	this.path = bin.readText(/\\/g,'/');
};

Material = function( bin ) {
	this.name = bin.readText();
	this.nameEn = bin.readText();
	this.diffuse = bin.readVector(3);
	this.alpha = bin.readFloat32();
	this.specular = bin.readVector(3);
	this.power = bin.readFloat32();
	this.ambient = bin.readVector(3);
	this.drawFlags = bin.readUint8();
	this.edgeColor = bin.readVector(4);
	this.edgeSize = bin.readFloat32();
	this.texture = bin.readTextureIndex();
	this.sphereTexture = bin.readTextureIndex();
	this.sphereMode = bin.readUint8();
	this.sharedToon = bin.readUint8();
	if ( this.sharedToon === 0 ) {
		this.toonTexture = bin.readTextureIndex(); // -1: not apply toon
	} else {
		this.toonTexture = bin.readUint8();
	}
	this.memo = bin.readText();
	this.indexCount = bin.readInt32();

	/* // debug
	var s = this.drawFlags.toString(2);
	while ( s.length < 5 ) {
		s = '0' + s;
	}
	console.log( this.name, s ); */
};

IKLink = function( bin ) {
	this.bone = bin.readBoneIndex();
	if ( bin.readUint8() === 1 ) {
		this.limits = [ bin.readVector(3), bin.readVector(3) ];
		convR2( this.limits[0], this.limits[1] );
	}
};

IK = function( bin ) {
	var n;
	this.effector = bin.readBoneIndex();
	this.iteration = bin.readInt32();
	this.control = bin.readFloat32();
	this.links = [];
	n = bin.readInt32();
	while ( n-- > 0 ) {
		this.links.push( new IKLink( bin ) );
	}
};

Bone = function( bin ) {
	this.name = bin.readText();
	//console.log('*' + this.name);
	this.nameEn = bin.readText();
	this.origin = convV( bin.readVector(3,true) );
	this.parent = bin.readBoneIndex();
	this.deformHierachy = bin.readInt32();
	//console.log('deformHierachy ' + this.deformHierachy);
	this.flags = bin.readUint16();
	//console.log(this.flags.toString(16));
	if ( ( this.flags & 1 ) !== 0 ) {
// AT: end
this.end = bin.readBoneIndex();
//		bin.readBoneIndex(); // dummy read
		//this.end = bin.readBoneIndex();
	} else {
// AT: end
this.end = convV( bin.readVector(3) );
//		bin.readVector(3); // dummy read
		//this.end = convV( bin.readVector(3) );
	}
	/* if ( ( this.flags & 2 ) !== 0 ) {
		console.log('rotatable');
	}
	if ( ( this.flags & 4 ) !== 0 ) {
		console.log('translatable');
	}
	if ( ( this.flags & 8 ) !== 0 ) {
		console.log('visible');
	}
	if ( ( this.flags & 0x10 ) !== 0 ) {
		console.log('manipulatable');
	} */
	/* if ( ( this.flags & 0x80 ) !== 0 ) {
		//console.log('GlobalAdditionalTransform');
	} */
	if ( ( this.flags & 0x300) !== 0 ) {
		this.additionalTransform = [ bin.readBoneIndex(), bin.readFloat32() ];
		//console.log('additionalTransform(' + (this.flags & 0x300).toString(16) + ')', this.additionalTransform);
	}
	if ( ( this.flags & 0x400) !== 0 ) {
// AT: fixedAxis
this.fixedAxis = convV( bin.readVector(3) );
//		bin.readVector(3); // dummy read
		//this.fixedAxis = convV( bin.readVector(3) );
		//console.log('fixedAxis ',this.fixedAxis);
	}
	if ( ( this.flags & 0x800) !== 0 ) {
// AT: localCoordinate
this.localCoordinate = [ convV( bin.readVector(3) ), convV( bin.readVector(3) ) ];
//		bin.readVector(3); bin.readVector(3); // dummy read
		//this.localCoordinate = [ convV( bin.readVector(3) ), convV( bin.readVector(3) ) ];
		//console.log('localCoordinate ', this.localCoordinate);
	}

// AT: afterPhysics
	if ( ( this.flags & 0x1000) !== 0 ) {
if (self.MMD_SA && (MMD_SA.use_afterPhysics !== false)) MMD_SA.use_afterPhysics = true;
		this.afterPhysics = true;
//		console.log('afterPhysics');
	}

	if ( ( this.flags & 0x2000) !== 0 ) {
		this.externalDeform = bin.readInt32(); // key
		//console.log('externalDeform ', this.externalDeform);
	}
	if ( ( this.flags & 0x20) !== 0 ) {
		this.IK = new IK( bin );
		//console.log('IK');
	}
};

MorphVertex = function( bin ) {
	this.target = bin.readVertexIndex();
	this.offset = convV( bin.readVector(3,true) );
};

MorphUV = function( bin ) {
	this.target = bin.readVertexIndex();
	this.uv = bin.readVector(4);
};

MorphBone = function( bin ) {
	this.target = bin.readBoneIndex();
	this.pos = bin.readVector(3,true);
	this.rot = bin.readVector(4);
// AT: pos_v3, rot_q
if (this.pos[0] || this.pos[1] || this.pos[2]) {
// same as accessory (?)
  this.pos_v3 = new THREE.Vector3(this.pos[0],this.pos[1],-this.pos[2])
}
if (this.rot[0] || this.rot[1] || this.rot[2]) {
  this.rot_q = new THREE.Quaternion(this.rot[0],this.rot[1],this.rot[2],this.rot[3])
// same as accessory (?)
  this.rot_q = this.rot_q.setFromEuler(MMD_SA.TEMP_v3.setEulerFromQuaternion(this.rot_q).multiply(MMD_SA._v3a.set(-1,-1,1)), 'YXZ')
}
};

MorphMaterial = function( bin ) {
	this.target = bin.readMaterialIndex();
	this.operator = bin.readUint8();
	this.diffuse = bin.readVector(3);
	this.alpha = bin.readFloat32();
	this.specular = bin.readVector(3);
	this.power = bin.readFloat32();
	this.ambient = bin.readVector(3);
	this.edgeColor = bin.readVector(4);
	this.edgeSize = bin.readFloat32();
	this.texture = bin.readVector(4);
	this.sphereTexture = bin.readVector(4);
	this.toonTexture = bin.readVector(4);
};

MorphGroup = function( bin ) {
	this.target = bin.readMorphIndex(); // no group nest
	this.weight = bin.readFloat32();
};

// AT: model_para_obj
Morph = function( bin, model_para_obj ) {
	var n;
	this.name = bin.readText();
// AT: morph name translation
if (self.MMD_SA) {
  var mt = model_para_obj.morph_translate
  if (mt && mt[this.name]) {
    this.name = mt[this.name]
  }
}
	this.nameEn = bin.readText();
	this.panel = bin.readUint8();
	this.type = bin.readUint8();
	this.items = [];

	/* // debug
	if ( this.type === 0 ) {
		console.log(this.name + ' MorphGroup');
	} else
	if ( this.type === 1 ) {
		console.log(this.name + ' MorphVertex');
	} else
	if ( this.type === 2 ) {
		console.log(this.name + ' MorphBone');
	} else
	if ( this.type >= 3 && this.type <= 7 ) {
		console.log(this.name + ' MorphUV' + (this.type - 3));
	} else
	if ( this.type === 8 ) {
		console.log(this.name + ' MorphMaterial');
	} */

	n = bin.readInt32();
	while ( n-- > 0) {
		if ( this.type === 0 ) {
			this.items.push( new MorphGroup( bin ) );
		} else
		if ( this.type === 1 ) {
			this.items.push( new MorphVertex( bin ) );
		} else
		if ( this.type === 2 ) {
			this.items.push( new MorphBone( bin ) );
		} else
		if ( this.type >= 3 && this.type <= 7 ) {
			this.items.push( new MorphUV( bin ) );
		} else
		if ( this.type === 8 ) {
			this.items.push( new MorphMaterial( bin ) );
		} else {
			throw Exception.DATA;
		}
	}
};

FrameItem = function( bin ) {
	this.type = bin.readUint8();
	if ( this.type === 0 ) {
		this.index = bin.readBoneIndex();
	} else
	if ( this.type === 1 ) {
		this.index = bin.readMorphIndex();
	} else {
		throw Exception.DATA;
	}
};

Frame = function( bin ) {
	var n;
	this.name = bin.readText();
	this.nameEn = bin.readText();
	this.special = bin.readUint8();
	this.items = [];
	n = bin.readInt32();
	while (n-- > 0) {
		this.items.push( new FrameItem( bin ) );
	}
};

Rigid = function( bin ) { // rigid body
	this.name = bin.readText();
	this.nameEn = bin.readText();
	this.bone = bin.readBoneIndex();
	this.group = bin.readUint8();
	this.mask = bin.readUint16();
	this.shape = bin.readUint8();
	this.size = bin.readVector(3,true);
	this.pos = convV( bin.readVector(3,true) );
	this.rot = convR( bin.readVector(3) );
	this.mass = bin.readFloat32();
	this.posDamping = bin.readFloat32();
	this.rotDamping = bin.readFloat32();
	this.restitution = bin.readFloat32();
	this.friction = bin.readFloat32();
	this.type = bin.readUint8();
};

Joint = function( bin ) { // constraint between two rigid bodies
	this.name = bin.readText();
	this.nameEn = bin.readText();
	this.type = bin.readUint8();
	this.rigidA = bin.readRigidIndex();
	this.rigidB = bin.readRigidIndex();
	this.pos = convV( bin.readVector(3,true) );
	this.rot = convR( bin.readVector(3) );
	this.posLower = bin.readVector(3,true);
	this.posUpper = bin.readVector(3,true);
	convV2( this.posLower, this.posUpper );
	this.rotLower = bin.readVector(3);
	this.rotUpper = bin.readVector(3);
	convR2( this.rotLower, this.rotUpper );
	this.posSpring = bin.readVector(3,true);
	this.rotSpring = bin.readVector(3);
};

PMX = function() {
};
PMX.prototype.parse = function( buffer ) {
	var bin, n, bones;
//	bin = new Reader( buffer );

// AT: MMD_SA_options.model_para_obj_by_filename, clone stuff
var that = this
var model_para_obj, cloned
if (self.MMD_SA) {
//console.log(decodeURIComponent(this.url_raw.replace(/^.+[\/\\]/, "")))
  var filename_raw = decodeURIComponent(this.url_raw.replace(/^.+[\/\\]/, ""))
  model_para_obj = MMD_SA_options.model_para_obj_by_filename[filename_raw]
  this._model_index = this._model_index_default = model_para_obj._model_index

  MMD_SA._readVector_scale = (model_para_obj.model_scale||1) * ((MMD_SA_options.WebXR) ? (MMD_SA_options.WebXR.model_scale || 1.0) : 1);

  if (/\#clone(\d+)\.pmx$/.test(filename_raw)) {
    cloned = true

    var filename_parent = filename_raw.replace(/\#clone(\d+)\.pmx$/, ".pmx")
    var model_para_obj_parent = MMD_SA_options.model_para_obj_by_filename[filename_parent]
    var pmx_parent = model_para_obj_parent._clone_parent.pmx

    var obj_current = Object.assign({}, this)
// obj_current: to preserve existing properties without being overwritten by the clone parent
    Object.assign(this, pmx_parent, obj_current)

    this.rigids = this.rigids.map(function (v) {
      return Object.assign({}, v);
    });
    this.rigid_index_by_bone = pmx_parent.rigid_index_by_bone;
  }
  else {
    bin = new Reader( buffer );

    model_para_obj._clone_parent = {
  pmx:this
    }
  }
}
if (!cloned) {

	this.vertices = [];
	this.indices = [];
	this.textures = [];
	this.materials = [];
	this.bones = [];
	this.morphs = [];
	this.frames = [];
	this.rigids = [];
	this.joints = [];

	_bdef1 = _bdef2 = _bdef4 = _sdef = 0; // debug

	this.info = new Info( bin );
	//console.log(this.info.name);

	n = bin.readInt32();
	//console.log('vertices = ' + n);
	while ( n-- > 0 ) {
		this.vertices.push( new Vertex( bin ) );
	}
	//console.log('(bdef1=' + _bdef1 + ' bdef2=' + _bdef2 +' bdef4=' + _bdef4 +' sdef=' + _sdef + ')');

	n = bin.readInt32();
	//console.log('faces = ' + n/3);
	while ( n-- > 0 ) {
		this.indices.push( bin.readVertexIndex() );
	}

	n = bin.readInt32();
	//console.log('textures = ' + n);
	while ( n-- > 0 ) {
		this.textures.push( new Texture( bin ) );
	}

	n = bin.readInt32();
	//console.log('materials = ' + n);
	while ( n-- > 0 ) {
		this.materials.push( new Material( bin ) );
	}

	n = bin.readInt32();
	//console.log('bones = ' + n);
	while ( n-- > 0 ) {
		this.bones.push( new Bone( bin ) );
	}
// AT: add armIK
const make_armIK = self.MMD_SA && !model_para_obj.is_object && (model_para_obj.make_armIK || MMD_SA_options.make_armIK) && (this.bones.findIndex((b)=>(b.name=="左腕ＩＫ")) == -1);
if (make_armIK) {
//bone = f
  let bone_index = this.bones.length;
  let bones_length = this.bones.length;
  this.bones.forEach((b)=>(b.deformHierachy*=1.1));

  let LR_array = (this.bones.findIndex((b)=>(b.name=="左腕")) < this.bones.findIndex((b)=>(b.name=="右腕"))) ? ["左","右"] : ["右","左"];
  LR_array.forEach(function (LR) {
    let mask, IK_link = [];
    let bone, bone_plus;

    let bone_index_ini = that.bones.findIndex((b)=>(b.name==LR+"腕"));

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators
    mask = 0x300 | 0x100;

    bone = that.bones.find((b)=>(b.name==LR+"腕"));
    bone_plus = Object.assign({}, bone);
    bone_plus.name = bone_plus.nameEn = LR+"腕+";
    bone_plus._index_IKAT = bone_index_ini-1+0.2 -32768;
    that.bones.push(bone_plus);
    bone.flags |= mask;
    bone.additionalTransform = [ bone_index, 1 ];
// to ensure it is processed BEFORE certain IK for some complicated bone systems
    bone._index_IKAT = bone_index_ini+1 -32768;
    IK_link.unshift(bone_index);
    bone_index++;

    bone = that.bones.find((b)=>(b.name==LR+"ひじ"));
    bone_plus = Object.assign({}, bone);
    bone_plus.name = bone_plus.nameEn = LR+"ひじ+";
    bone_plus.parent = bone_index-1;
    bone_plus._index_IKAT = bone_index_ini-1+0.3 -32768;
    that.bones.push(bone_plus);
    bone.flags |= mask;
    bone.additionalTransform = [ bone_index, 1 ];
    bone._index_IKAT = bone_index_ini+2 -32768;
    IK_link.unshift(bone_index);
    bone_index++;

    bone = that.bones.find((b)=>(b.name==LR+"手首"));
    bone_plus = Object.assign({}, bone);
    bone_plus.name = bone_plus.nameEn = LR+"手首+";
    bone_plus.parent = bone_index-1;
    bone_plus._index_IKAT = bone_index_ini-1+0.4 -32768;
    that.bones.push(bone_plus);

    bone_plus = Object.assign({}, bone);
    bone_plus.name = bone_plus.nameEn = LR+"腕ＩＫ";
    bone_plus.parent = that.bones.findIndex((b)=>(b.name=="上半身2"));
    bone_plus._index_IKAT = bone_index_ini-1+0.5 -32768;
    bone_plus.IK = {
  control: 57.29578/180*Math.PI
 ,effector: bone_index
 ,iteration: 20
 ,links: IK_link.map((ik)=>({bone:ik}))
    };
    bone_plus.flags |= 0x20;
    that.bones.push(bone_plus);

// 手首
    mask = 0x300 | 0x100;
    bone.flags |= mask;
    bone.additionalTransform = [ bone_index, 1 ];
    bone._index_IKAT = bone_index_ini+3 -32768;
    bone_index+=2;

    for (let i = bone_index_ini; i < bones_length; i++) {
      that.bones[i].deformHierachy += 0.01
    }
  });

}

// AT: skin_weight
if (model_para_obj.skin_weight) {
  let skin_weight = {}
  let sw_mod = (MMD_SA_options.skin_weight_mod || ((MMD_SA_options.Dungeon) ? 0.5 : 1))
  Object.keys(model_para_obj.skin_weight).forEach(function (name) {
    let index = that.bones.findIndex(b => b.name==name)
    if (index >= 0)
      skin_weight[index] = model_para_obj.skin_weight[name] * sw_mod
  });

  this.vertices.forEach(function (v) {
    let skin = v.skin
    if (skin.weights.length <= 1)
      return

    let weights_modified
    let weights_add = []
    let def_max = skin.weights.length
    for (let i = 0; i < def_max; i++) {
      let sw = skin_weight[skin.bones[i]]
      if (sw != null) {
        weights_modified = true
        let w_mod = skin.weights[i] * (1-sw)
        let w_total = 1 - skin.weights[i]
        for (let j = 0; j < def_max; j++) {
          weights_add[j] = (weights_add[j]||0) + ((j == i) ? -w_mod : w_mod * (skin.weights[j]/w_total))
        }
      }
    }

    if (weights_modified) {
      for (let i = 0; i < def_max; i++) {
        skin.weights[i] += weights_add[i]
      }
    }
  });
}

	n = bin.readInt32();
	//console.log('morphs = ' + n);
	while ( n-- > 0 ) {
// AT: model_para_obj
		this.morphs.push( new Morph( bin, model_para_obj ) );
	}

// AT: まばたきL/R
let blink = this.morphs.find((m)=>m.name=="まばたき");
if (blink && self.MMD_SA && MMD_SA_options.user_camera.ML_models.enabled) {
  console.log("Use まばたきL/R")
  let blink_L = Object.assign({}, blink);
  let blink_R = Object.assign({}, blink);
  blink_L.name = blink_L.nameEn = "まばたきL"
  blink_R.name = blink_R.nameEn = "まばたきR"
  let blink_updated
  if (blink.type == 1) {
    blink_L.items = blink.items.filter((v)=>that.vertices[v.target].pos[0]>0);
    blink_R.items = blink.items.filter((v)=>that.vertices[v.target].pos[0]<0);
    blink_updated = true
  }
  if (blink_updated) {
    this.morphs.push(blink_L)
    this.morphs.push(blink_R)
  }
}

	n = bin.readInt32();
	//console.log('frames = ' + n);
	while ( n-- > 0 ) {
		this.frames.push( new Frame( bin ) );
	}

	n = bin.readInt32();
	//console.log('rigid bodies = ' + n);
	while ( n-- > 0 ) {
		this.rigids.push( new Rigid( bin ) );
	}

	n = bin.readInt32();
	//console.log('joints = ' + n);
	while ( n-- > 0 ) {
		this.joints.push( new Joint( bin ) );
	}

// AT: physics disabled
if (model_para_obj && model_para_obj.physics_disabled) {
  this.rigids = []
  this.joints = []
  console.log("Physics OFF: model-" + this._model_index)
}

	// ボーンに対する剛体の位置オフセットを求める。
	bones = this.bones;
	this.rigids.forEach( function( v ) {
		var o;
		if ( v.bone >= 0 ) {
			o = bones[ v.bone ].origin;
			v.ofs = [ v.pos[0] - o[0], v.pos[1] - o[1], v.pos[2] - o[2] ];
		}
	});

// AT: index
this.rigids.forEach( function( v, idx ) { v._index=idx; });

// AT: rigid_index_by_bone
this.rigid_index_by_bone = {}
this.rigids.forEach(function(v, idx) {
  that.rigid_index_by_bone[v.bone] = idx;
});

// AT: clone end
}

// AT: bone morph to skin default
if (self.MMD_SA && model_para_obj.morph_default && !model_para_obj.morph_default._is_empty) {
  for (var m_name in model_para_obj.morph_default) {
    for (var i = 0, i_max = this.morphs.length; i < i_max; i++) {
      var m = this.morphs[i]
      if (m_name != m.name)
        continue
      var bone_list = {}
      if (m.type == 0) {
        m.items.forEach(function (m_child) {
          if (that.morphs[m_child.target].type == 2)
            that.morphs[m_child.target].items.forEach(function (b) { bone_list[that.bones[b.target].name]=true })
        });
        if (!bone_list.length)
          continue
      }
      else if (m.type == 2) {
        m.items.forEach(function (b) { bone_list[that.bones[b.target].name]=true })
      }
      else
        continue

      for (var b_name in bone_list) {
        if (!model_para_obj.skin_default)
          model_para_obj.skin_default = {}
        model_para_obj.skin_default._is_empty = null
        if (!model_para_obj.skin_default[b_name]) {
          model_para_obj.skin_default[b_name] = { pos:{x:0, y:0, z:0} }
//DEBUG_show(b_name,0,1)
        }
      }
      break
    }
  }
}

};
PMX.prototype.createMesh = function( param, oncreate ) {
	var that, geo, materials, monitor, iid,
		createV, createUV, createColor, createTexture, textureDict;

	if ( !this.vertices ) {
		console.error( 'not parsed' );
		return;
	}

	that = this;

	// set default value if not defined
	if ( param.shadowDark === undefined ) {
		param.shadowDark = 0.3;
	}
	if ( param.edgeScale === undefined ) {
		param.edgeScale = 1.0;
	}
	if ( param.textureAlias === undefined ) {
		param.textureAlias = {};
	}

// AT: model para, clone stuff
var model_para, cloned
if (self.MMD_SA) {
//console.log(decodeURIComponent(this.url_raw.replace(/^.+[\/\\]/, "")))
  model_para = MMD_SA_options.model_para_obj_all[this._model_index]

  var filename_raw = decodeURIComponent(this.url_raw.replace(/^.+[\/\\]/, ""))
  if (/\#clone(\d+)\.pmx$/.test(filename_raw)) {
    cloned = true

    var filename_parent = filename_raw.replace(/\#clone(\d+)\.pmx$/, ".pmx")
    var model_para_obj_parent = MMD_SA_options.model_para_obj_by_filename[filename_parent]

    geo = model_para_obj_parent._clone_parent.geo
    materials = model_para_obj_parent._clone_parent.materials
    this.morphs_index_by_name = geo.morphs_index_by_name
    oncreate( new THREE.SkinnedMesh( geo, new THREE.MeshFaceMaterial( materials ) ) );

    return
  }
}

	geo = new THREE.Geometry();
//    geo._model_index = this._model_index
	materials = [];

// AT: clone parent
if (!cloned) {
  model_para._clone_parent.geo = geo
  model_para._clone_parent.materials = materials
}

	monitor = new EventMonitor();
	monitor.add( function() {
		oncreate( new THREE.SkinnedMesh( geo, new THREE.MeshFaceMaterial( materials ) ) );
	});

	createV = function( a ) {
		return new THREE.Vector3( a[0], a[1], a[2] );
	};
	createUV = function( a ) {
		return new THREE.Vector2( a[0], a[1] );
	};
	createColor = function( a ) {
		var c = new THREE.Color();
		c.r = a[0];
		c.g = a[1];
		c.b = a[2];
		return c;
	};
	textureDict = {};

// AT: UV bounding box
var setUVRepeat = function (texture, material) {
  if (MMD_SA.use_webgl2)
    return

  if (!material)
    return

  var uv_bbox = material._uv_bbox
  var w = uv_bbox.max.x - uv_bbox.min.x
  var h = uv_bbox.max.y - uv_bbox.min.y
  if ((w <= 1) && (h <= 1))
    return

  var image = texture.image
  var w_scale, h_scale
  if (image.width > image.height) {
    w_scale = 1
    h_scale = image.width / image.height
  }
  else {
    w_scale = image.height / image.width
    h_scale = 1
  }
  if ((w < w_scale * 1.1) && (h < h_scale * 1.1))
    return

  var image = texture.image
  var w_old = image.width
  var h_old = image.height
  if (((w_old & (w_old-1)) === 0) && ((h_old & (h_old-1)) === 0))
    return

  var w_new = Math.min(Math.pow(2, Math.round(Math.log2(image.width))),  2048)
  var h_new = Math.min(Math.pow(2, Math.round(Math.log2(image.height))), 2048)

  var c = texture.image = document.createElement("canvas")
  c.width  = w_new
  c.height = h_new
  c.getContext("2d").drawImage(image, 0,0,w_new,h_new)

console.log(material.name)
console.log([w_new, h_new])
//console.log([w,h])
//console.log([image.width, image.height])
}

// AT: onerror_func, material, para
	createTexture = function( fname, onerror_func, material, para ) {
		var ext, p, texture, onerror;

		// alias
		ext = fname.split( '.' ).pop().toLowerCase();
		for ( p in param.textureAlias ) {
			if ( p === ext ) {
				// replace ext
				ext = param.textureAlias[ p ];
				fname = fname.slice( 0, -(p.length) ) + ext;
				break;
			}
		}

		// cache
		if ( textureDict.hasOwnProperty( fname ) ) {
			return textureDict[fname];
		}

		// load
		onerror = function() {
			monitor.del();
			//console.error( fname + ' load failed' );
			//alert( that.texturePath + fname + ' load failed' );
// AT: onerror_tex_to_delete
if (onerror_func) onerror_func()
		};
		monitor.add();

// AT: adjusted path
let texturePath = that.texturePath;
if (/^\.\.[\/\\]/.test(fname)) {
  fname = fname.substring(3);
  texturePath = texturePath.replace(/[^\/\\]+\/$/, '');
}

// AT: load default toon and .dds texture START
		if ( ext === 'dds' ) {
var _fname = (!self.MMD_SA || !MMD_SA_options.flip_DDS || /^data:image/.test( fname )) ? fname : fname.replace(/[^\/\\]+$/, "flipV/$&");
			texture = THREE.ImageUtils.loadCompressedTexture( /^data:image/.test( fname ) ? _fname : toFileProtocol(texturePath + _fname), undefined,
				function( texture ) {
					// !!! format is DXT1 or DXT3 or DXT5 !!!
					texture.hasTransparency = ( texture.format !== THREE.RGB_S3TC_DXT1_Format );
					texture.minFilter = texture.magFilter = THREE.LinearFilter;
					monitor.del();
				},
				onerror);
		} else {
var _texturePath = (/^toon\d\d\.bmp$/.test(fname)) ? System.Gadget.path + '\\MMD.js\\data\\' : texturePath;
			texture = THREE.ImageUtils.loadTexture( /^data:image/.test( fname ) ? fname : toFileProtocol(_texturePath + fname), undefined,
// AT: closure for _material
(function () {
  var _material = material
  return				function(  texture  ) {
// AT: UV bounding
setUVRepeat(texture, _material)
					monitor.del();
				};//,
})(),
// AT: para
				onerror ,para);
		}
		texture.flipY = false; // DDSには flipY=true が効かないのでfalseにする。上下逆貼りに注意。
		texture.wrapS = texture.wrapT = THREE.RepeatWrapping;
		textureDict[fname] = texture;
		return texture;
	};
	// vertex, skin
	this.vertices.forEach( function( v ) {
		var skin;

		// vertex
		geo.vertices.push( createV( v.pos ) );

		// skin
		skin = v.skin;
		switch ( skin.type ) {
		case 0: // BDEF1
			geo.skinWeights.push( new THREE.Vector4( skin.weights[0], 0, 0, 0 ) );
			geo.skinIndices.push( new THREE.Vector4( skin.bones[0], 0, 0, 0 ) );
			break;
		case 1: // BDEF2
		case 3: // SDEF
			geo.skinWeights.push( new THREE.Vector4( skin.weights[0], skin.weights[1], 0, 0 ) );
			geo.skinIndices.push( new THREE.Vector4( skin.bones[0], skin.bones[1], 0, 0 ) );
			break;
		case 2: // BDEF4
			geo.skinWeights.push( new THREE.Vector4( skin.weights[0], skin.weights[1], skin.weights[2], skin.weights[3] ) );
			geo.skinIndices.push( new THREE.Vector4( skin.bones[0], skin.bones[1], skin.bones[2], skin.bones[3] ) );
			break;
		}
	});
	geo.MMDmorphs = this.morphs;
// AT: morph index by name, morph weight by name
var _morph_idx = geo.morphs_index_by_name = this.morphs_index_by_name = {}
var _morph_weight = geo.morphs_weight_by_name = this.morphs_weight_by_name = {}
this.morphs.forEach(function (m, idx) {
  _morph_idx[m.name] = idx
  _morph_weight[m.name] = 0
})

	// material, face
	iid = 0;
	geo.faceVertexUvs[ 0 ] = []; // uv layer #0
	this.materials.forEach( function( v, idx ) {
		var p, face, n, a, b, c, va, vb, vc;

		// material
		p = new MMDMaterial();
// AT: simple MorphMaterial support, X-ray support, MME Serious Shader
p.name = v.name;
p._xray_pass = self.MMD_SA && MMD_SA_options._use_xray && model_para.material_xray_pass && model_para.material_xray_pass.test(p.name)
var _uniforms = []
if (p._xray_pass) {
  _uniforms.push(
    {name:"xray_center",  value:{ type: "v3", value: new THREE.Vector3(999, 999, 999) }}
   ,{name:"xray_radius",  value:{ type: "f",  value: Math.sqrt(MMD_SA_options._xray_radius*MMD_SA_options._xray_radius*3) }}
   ,{name:"xray_opacity", value:{ type: "f",  value: MMD_SA_options._xray_opacity }}
  );
}
var mme
mme = MMD_SA_options.MME.self_overlay
_uniforms.push(
  {name:"self_overlay_opacity", value:{ type: "f",  value:1 }}
 ,{name:"self_overlay_brightness", value:{ type: "f",  value:1 }}
 ,{name:"self_overlay_color_adjust", value:{ type: "v3",  value: new THREE.Vector3(1.5, 1, 1) }}
);
mme = MMD_SA_options.MME.HDR
_uniforms.push(
  {name:"HDR_opacity", value:{ type: "f",  value:1 }}
);
mme = MMD_SA_options.MME.serious_shader
_uniforms.push(
  {name:"serious_shader_shadow_opacity", value:{ type: "f",  value:1 }}
 ,{name:"OverBright", value:{ type: "f",  value:1 }}
 ,{name:"ShadowDarkness", value:{ type: "f",  value:1 }}
 ,{name:"ToonPower", value:{ type: "f",  value:1 }}
 ,{name:"EyeLightPower", value:{ type: "f",  value:1 }}
 ,{name:"serious_shader_mode", value:{ type: "i",  value:1 }}
);
if (MMD_SA.MME_shader_inline_switch_mode) {
  ["self_overlay", "HDR", "serious_shader"].forEach(function (name) {
    mme = MMD_SA_options.MME[name]
    _uniforms.push(
  {name:name.toUpperCase(), value:{ type:"i", value:1 }}
    );
  });
}
if (_uniforms.length) {
  var _u = {}
  _uniforms.forEach(function (obj) {
    _u[obj.name] = obj.value
  });
  p.uniforms = THREE.UniformsUtils.merge([
    p.uniforms
   ,_u
  ]);
}
// AT: material_para
var material_para = model_para.material_para || {};
material_para = material_para[p.name] || material_para._default_ || {};
		p.lights = true; // use scene light
		p.skinning = true; // use bone skinning
// AT: color by para
		p.ambient = createColor( material_para.ambient || v.ambient );
		p.color = createColor( material_para.diffuse || v.diffuse );
		p.specular = createColor( material_para.specular || v.specular );
		p.shininess = v.power;
		p.opacity = v.alpha;
//		p.transparent = true; // 問題回避のために描画順は全て「奥から手前」にする。
// AT: transparent/side by para
p.transparent = (material_para.transparent != null) ? material_para.transparent : true;
//if (that._model_index==3) console.log(MMD_SA_options.model_para_obj_all[that._model_index])
if (material_para.side != null) { p.side = material_para.side } else
		if ( ( v.drawFlags & 0x01 ) !== 0 ) {
			p.side = THREE.DoubleSide;
		}
// AT: castShadow by para
		if ( ( v.drawFlags & 0x02 ) !== 0 && material_para.castShadow!=false) {
			// 地面影。
			p.castShadow = true;
			p.shadowMapCullFace = THREE.CullFaceNone; // == gl.disable( gl.CULL_FACE )
			//p.shadowMapCullFace = THREE.CullFaceFront;
			//p.shadowMapCullFace = THREE.CullFaceBack;
		} else {
			p.castShadow = false;
		}
		if ( ( v.drawFlags & 0x08 ) !== 0 ) {
			// セルフシャドウ描画。
			p.mmdShadowDark = param.shadowDark;
		}
		if ( ( v.drawFlags & 0x10 ) !== 0 ) {
			// エッジ描画。
// AT: edgeScale by para
			p.mmdEdgeThick = v.edgeSize * param.edgeScale *((model_para.edgeScale != null) ? model_para.edgeScale : 1);
			p.mmdEdgeColor = new THREE.Vector4( v.edgeColor[0], v.edgeColor[1], v.edgeColor[2], v.edgeColor[3] ); // rgba
		}
		if ( v.texture >= 0 ) {
// AT: reset texture properties on error, pass material as parameter (p)
			p.map = createTexture( that.textures[ v.texture ].path, (function(){ var _p=p; return function(){ var c=_p.map.image=document.createElement("canvas"); c.width=c.height=2; var cc=c.getContext("2d"); cc.fillStyle="white"; cc.fillRect(0,0,2,2); _p.map.needsUpdate=true; }; })(), p );
// (function(){ var _p=p; var _v=v; return function(){_p.map=null;_v.texture=-1;}; })()
		}
// AT: normal map
if (material_para.normalMap && (model_para.use_normalMap !== false)) {
  p.normalMap = createTexture(
    material_para.normalMap
   ,(function(){ var _p=p; return function(){ var c=_p.map.image=document.createElement("canvas"); c.width=c.height=2; var cc=c.getContext("2d"); cc.fillStyle="white"; cc.fillRect(0,0,2,2); _p.map.needsUpdate=true; }; })()
   ,p
   ,(material_para.normalMap_resolution_limit)?{texture_resolution_limit:material_para.normalMap_resolution_limit}:null
  );
// always us RepeatWrapping
  p.normalMap.wrapS = p.normalMap.wrapT = THREE.RepeatWrapping;
}
		a = null;
		if (v.sharedToon === 0) {
			if (v.toonTexture >= 0) {
				a = that.textures[ v.toonTexture ].path;
			}
		} else {
			//a = 'toon' + [ '01','02','03','04','05','06','07','08','09','10' ][ v.toonTexture ] + '.bmp';
			a = jThree.MMD.toon[ v.toonTexture ];//change by jThree
		}
		if (a) {
// AT: reset toon properties on error
			p.mmdToonMap = createTexture( a, (function(){ var _p=p; return function(){ var c=_p.mmdToonMap.image=document.createElement("canvas"); c.width=c.height=2; var cc=c.getContext("2d"); cc.fillStyle="white"; cc.fillRect(0,0,2,2); _p.mmdToonMap.needsUpdate=true; }; })() );
		}
		if ( v.sphereMode > 0 && v.sphereTexture >= 0 ) {
			p.mmdSphereMode = v.sphereMode;
// AT: reset sphere properties on error
			p.mmdSphereMap = createTexture( that.textures[ v.sphereTexture ].path, (function(){ var _p=p; return function(){ var c=_p.mmdSphereMap.image=document.createElement("canvas"); c.width=c.height=2; var cc=c.getContext("2d"); cc.fillStyle="black"; cc.fillRect(0,0,2,2); _p.mmdSphereMap.needsUpdate=true; }; })() );
		}
		p.setup();
		materials.push( p );

// AT: UV bounding box
var uv_bbox = p._uv_bbox = { min:{x:0, y:0}, max:{x:1, y:1}, face_ini:iid/3, face_end:(iid+v.indexCount)/3 }

		// face
		n = v.indexCount / 3; // triangles
// AT: UV morph support
if (!geo._face_index_by_vertex) { geo._face_index_by_vertex = []; }
		while ( n-- ) {
			// lett to right hand order
			a = that.indices[ iid + 2 ];
			b = that.indices[ iid + 1 ];
			c = that.indices[ iid     ];
			face = new THREE.Face3( a, b, c );
			face.materialIndex = idx;
			va = that.vertices[ a ];
			vb = that.vertices[ b ];
			vc = that.vertices[ c ];
// AT: UV morph support
[a,b,c].forEach(function (_v, _idx) {
  if (!geo._face_index_by_vertex[_v])
    geo._face_index_by_vertex[_v] = []
  geo._face_index_by_vertex[_v].push([geo.faces.length, _idx])
});
			geo.faceVertexUvs[0].push( v.texture >= 0 ? [ createUV( va.uv ), createUV( vb.uv ), createUV( vc.uv ) ] : undefined );

// AT: UV bounding box
if ((v.texture >= 0) && !MMD_SA.use_webgl2) {
  geo.faceVertexUvs[0][iid/3].forEach(function (uv) {
    if (uv.x < uv_bbox.min.x)
      uv_bbox.min.x = uv.x
    else if (uv.x > uv_bbox.max.x)
      uv_bbox.max.x = uv.x
    if (uv.y < uv_bbox.min.y)
      uv_bbox.min.y = uv.y
    else if (uv.y > uv_bbox.max.y)
      uv_bbox.max.y = uv.y
  });
}

			face.vertexNormals = [ createV( va.normal ), createV( vb.normal ), createV( vc.normal ) ];
			geo.faces.push( face );
			iid += 3;
		}

	});

	// bone, ik
	geo.MMDIKs = [];
	geo.bones = [];
	this.bones.forEach( function( v, idx ) {
		var pos, bone;
		if ( v.IK ) {
			v.IK.target = idx;
			geo.MMDIKs.push( v.IK );
		}
		if ( v.parent >= 0 ) {
			// relative position from parent
			pos = that.bones[ v.parent ].origin;
			pos = [ v.origin[0] - pos[0], v.origin[1] - pos[1], v.origin[2] - pos[2] ];
		} else {
			pos = v.origin;
		}
		bone = {};
		bone.parent = v.parent;
		bone.name = v.name;
		bone.pos = pos;
		bone.rotq = [ 0, 0, 0, 1 ];
		geo.bones.push( bone );
	});

	// rigid body, joint
// AT: bound .MMDrigids = pmx.rigids to mesh, instead of geometry
//	geo.MMDrigids = this.rigids;
	geo.MMDjoints = this.joints;

	// bounding box & sphere
	geo.computeBoundingBox();
	geo.boundingSphere = geo.boundingBox.getBoundingSphere();

// AT: adjust bb/bs for game
self.MMD_SA && MMD_SA_options.Dungeon && MMD_SA_options.Dungeon.utils.adjust_boundingBox(geo, model_para);

console.log("boundingBox/Sphere-" + that._model_index, geo.boundingBox, geo.boundingSphere)
	// done

	monitor.del();
};
PMX.prototype.load = function( url, onload ) {
	var that = this;
// AT: clone
this.url_raw = url
this._clone_index = -1
if (/\#clone(\d+)\.pmx$/.test(url)) {
  url = url.replace(/\#clone(\d+)\.pmx$/, ".pmx")
  this._clone_index = parseInt(RegExp.$1)
//console.log(this._clone_index)
}
	loadBuffer( url, function( xhr ) {
		that.url = url;
		that.texturePath = /[\/\\]/.test( url ) ? url.replace(/[^\/\\]+$/, '') : '';
		that.parse( xhr.response );
		onload( that );
	});
};

}()); // PMX

cloneKey = function( k ) {
	var o, p;
	o = {};
	for ( p in k ) {
		if ( k.hasOwnProperty( p ) ) {
			o[p] = k[p]; // shallow copy
		}
	}
	return o;
};

(function() { // VMD

var f2t, sortKeys, MAGIC, Reader, BoneKey, MorphKey, CameraKey, LightKey;

f2t = function( f ) { // frame number to time
	return f/30; // 30 fps
};

sortKeys = function( keys ) {
	keys.sort( function( a, b ) {
		return a.time - b.time;
	});
};

MAGIC = [0x56,0x6F,0x63,0x61,0x6C,0x6F,0x69,0x64,0x20,0x4D,0x6F,0x74,0x69,0x6F,0x6E,0x20,0x44,0x61,0x74,0x61,0x20,0x30,0x30,0x30,0x32]; // 'Vocaloid Motion Data 0002'

Reader = function( buffer ) { // extend BinaryStream
	var b, i;
	BinaryStream.call( this, buffer, true ); //this.littleEndian = true;
	this.stringMap = {};

	// read header
	b = this.readBytes( 30 );
	for ( i=0; i<MAGIC.length; i++ ) {
		if ( MAGIC[i] !== b[i] ) {
			throw Exception.MAGIC;
		}
	}
	this.name = this.readCString( 20 );
};
Reader.prototype = Object.create( BinaryStream.prototype );
Reader.prototype.constructor = Reader;

Reader.prototype.readCString = function( length ) {
	var b, i, text;
	b = this.readBytes( length );
	for ( i=0; i<length; i++ ) {
		if ( b[i] === 0 ) {
			break;
		}
	}
	text = String.fromCharCode.apply( undefined, THREE.MMD.Encoding.SJISToUNICODE( b.subarray( 0, i ) ) );

	// reduce string instance
	if ( this.stringMap.hasOwnProperty( text ) ) {
		text = this.stringMap[ text ];
	} else {
		this.stringMap[ text ] = text;
	}
	return text;
};
// AT: scale
Reader.prototype.readVector = function( n, scale ) {
	var v = [];
	while ( n-- > 0 ) {
		v.push( this.readFloat32() );
	}
if (scale) v=v.map(f=>f*MMD_SA._readVector_scale);
	return v;
};

BoneKey = function( bin ) {
	this.name = bin.readCString(15);
	this.time = f2t( bin.readUint32() );
	this.pos = convV( bin.readVector(3) );
	this.rot = convR( bin.readVector(4) );
	this.interp = bin.readBytes(64).subarray(0,16); // 必要なのは最初の１６個。
};

MorphKey = function( bin ) {
	this.name = bin.readCString(15);
	this.time = f2t( bin.readUint32() );
	this.weight = bin.readFloat32();
};

CameraKey = function( bin ) {
	// 扱いやすいように一部の値は符号反転しておく。
	this.time = f2t( bin.readUint32() );
	this.distance = -bin.readFloat32();
	this.target = convV( bin.readVector(3) );
	this.rot = convR( bin.readVector(3) );
	this.rot[0] *= -1;
	this.rot[1] *= -1;
	this.rot[2] *= -1;
	this.interp = bin.readBytes(24);
	this.fov = bin.readUint32();
	this.ortho = bin.readInt8();
};

LightKey = function( bin ) {
	this.time = f2t( bin.readUint32() );
	this.color = bin.readVector(3);
	this.dir = convV( bin.readVector(3) );
};

VMD = function() {
};
VMD.prototype.parse = function( buffer ) {
	var bin, n;

	bin = new Reader( buffer );

	this.timeMax = 0;
	this.boneKeys = [];
	this.morphKeys = [];
	this.cameraKeys = [];
	this.lightKeys = [];

	n = bin.readUint32();
	while ( n-- > 0 ) {
		this.boneKeys.push( new BoneKey( bin ) );
	}
	sortKeys( this.boneKeys );
	n = this.boneKeys.length;
	if ( n > 0 ) {
		// last key
		this.timeMax = Math.max( this.timeMax, this.boneKeys[ n-1 ].time );
	}

	n = bin.readUint32();
	while ( n-- > 0 ) {
		this.morphKeys.push( new MorphKey( bin ) );
	}
	sortKeys( this.morphKeys );
	n = this.morphKeys.length;
	if ( n > 0 ) {
		// last key
		this.timeMax = Math.max( this.timeMax, this.morphKeys[ n-1 ].time );
	}

// AT: fix errors in some cases (eg. morph-only motion)
if (this.boneKeys.length || this.morphKeys.length) {
  delete bin.stringMap;
  return
}

	n = bin.readUint32();
	while ( n-- > 0 ) {
		this.cameraKeys.push( new CameraKey( bin ) );
	}
	sortKeys( this.cameraKeys );
	n = this.cameraKeys.length;
	if ( n > 0 ) {
		// last key
		this.timeMax = Math.max( this.timeMax, this.cameraKeys[ n-1 ].time );
	}

	n = bin.readUint32();
	while ( n-- > 0 ) {
		this.lightKeys.push( new LightKey( bin ) );
	}
	sortKeys( this.lightKeys );
	n = this.lightKeys.length;
	if ( n > 0 ) {
		// last key
		this.timeMax = Math.max( this.timeMax, this.lightKeys[ n-1 ].time );
	}

	// done
	delete bin.stringMap;
};
VMD.prototype.load = function( url_raw, onload ) {
// AT: VMD by filename
// NOTE: url_raw is the raw path WITHOUT toFileProtocol (because this will turn the url to blob url in browser, which makes info like file type and such unrecognizable)
MMD_SA.vmd_by_filename[decodeURIComponent(url_raw.replace(/^.+[\/\\]/, "").replace(/\.([a-z0-9]{1,4})$/i, ""))] = this;
//console.log(url_raw)
// AT: BVH
if (/\.bvh$/i.test(url_raw)) {
  MMD_SA.BVHLoader().then(()=>{ BVHLoader.VMD = VMD; BVHLoader.load(url_raw).then((bones)=>{ onload(BVHLoader.toVMD(bones)); }); });
  return
}

// AT: FBX/GLTF
if (/\.(fbx|glb)$/i.test(url_raw)) {
  new Promise((resolve)=>{
    if (THREE.MMD.getModels().length) {
      resolve();
    }
    else {
      window.addEventListener('SA_MMD_model0_onload', ()=>{ resolve(); }, {once:true});
    }
  }).then(()=>{
    MMD_SA.THREEX.utils.load_THREEX_motion( url_raw, THREE.MMD.getModels()[0], VMD ).then(vmd=>{ onload(vmd); });
  });
  return
}

	var that = this;
	loadBuffer( toFileProtocol(url_raw), function( xhr ) {
		that.url = url_raw;
		that.parse( xhr.response );
		onload( that );
	});
};
// AT: Use regular expression to filter frames (RE), that = this, stuff
VMD.prototype.generateSkinAnimation = function( pmx, RE ) {
var model_para_obj = self.MMD_SA && MMD_SA_options.model_para_obj_all[pmx._model_index];

const to_T_pose = /\.vmd$/i.test(this.url) && MMD_SA.THREEX.get_model(pmx._model_index).is_T_pose;
const to_A_pose = !to_T_pose && /\.(fbx|glb)$/i.test(this.url) && !MMD_SA.THREEX.get_model(pmx._model_index).is_T_pose;
const need_pose_conversion = to_A_pose || to_T_pose;

var motion_para = self.MMD_SA && MMD_SA_options.motion_para[decodeURIComponent(this.url.replace(/^.+[\/\\]/, "").replace(/\.([a-z0-9]{1,4})$/i, ""))];
var motion_sd = motion_para && motion_para.adjustment_per_model && (motion_para.adjustment_per_model[MMD_SA.THREEX.get_model(pmx._model_index).model_path.replace(/^.+[\/\\]/, '')] || motion_para.adjustment_per_model[model_para_obj._filename_cleaned] || motion_para.adjustment_per_model._default_);
motion_sd = (motion_sd && motion_sd.skin_default) || {};
var multi_model_motion = (MMD_SA_options.model_para_obj_all.length > 1) && motion_para && (motion_para.model_index_list || motion_para.model_name_RegExp)
var that = this;
	var boneKeys, timeMax, targets;
	boneKeys = this.boneKeys;
	if ( boneKeys.length === 0 ) {
		return null;
	}
// AT: IK disabled
    var IK_disabled_RE = new RegExp("(" + toRegExp(["足ＩＫ","つま先ＩＫ"],"|") + ")$");
// AT: custom duration
var _timeMax = this.timeMax;
if (motion_para && motion_para.freeze_onended) {
  motion_para.duration = 9999
  motion_para.random_range_disabled = true
}
	timeMax = (motion_para && motion_para.duration)||this.timeMax;
	targets = [];
	pmx.bones.forEach( function( v, bone_idx ) {
// AT: Use regular expression to filter frames (RE), skin default
if (RE) {
  if (!RE.test(v.name)) {
    targets.push( { keys:[] } );
    return
  }
  //else { DEBUG_show(v.name,0,1) }
}
var model_sd = model_para_obj.skin_default[v.name]
var sd = self.MMD_SA && (motion_sd[v.name] || model_sd)
if (sd && ((sd.motion_filter && !sd.motion_filter.test(decodeURIComponent(that.url))) || (sd.model_filter && !sd.model_filter.test(model_para_obj._filename)))) {
  sd = null
}
if (need_pose_conversion) {
  if (!sd && (v.name.indexOf('肩') == v.name.length-1)) {
    sd = { pos_add:{x:0,y:0,z:0} };
  }
}
if (sd) {
  let pos_add_absolute
// (compatibility) "pos_add" of "全ての親" in multi-model para_SA is considered absolute
  if (multi_model_motion && (v.name == "全ての親") && (!model_sd || (sd != model_sd)) && sd.pos_add) {
    pos_add_absolute = sd.pos_add_absolute = sd.pos_add
    delete sd.pos_add
  }
  else {
    pos_add_absolute = sd.pos_add_absolute || (model_sd && model_sd.pos_add_absolute)
  }
  if (pos_add_absolute) {
    sd = Object.assign({}, sd)
    sd.pos_add = (!sd.pos_add) ? pos_add_absolute : {x:sd.pos_add.x+pos_add_absolute.x, y:sd.pos_add.y+pos_add_absolute.y, z:sd.pos_add.z+pos_add_absolute.z}
  }
  if (sd.rot_scale) {
    if (typeof sd.rot_scale == "number") {
      sd.rot_scale = { x:sd.rot_scale, y:sd.rot_scale, z:sd.rot_scale }
    }
  }
}
		var keys, last;
		// 一連のキーをターゲット（名前）毎に振り分ける。
		keys = [];
// AT: multi-model, model_scale
var multi_model = (MMD_SA_options.model_para_obj_all.length > 1)
var model_scale = (model_para_obj.model_scale||1) * ((MMD_SA_options.WebXR) ? (MMD_SA_options.WebXR.model_scale || 1.0) : 1);
		boneKeys.forEach( function( w ) {
			if ( v.name === w.name ) {
// AT: rot for T-pose
need_pose_conversion && ((to_T_pose) ? MMD_SA.THREEX.utils.convert_A_pose_rotation_to_T_pose(v.name, w.rot) : MMD_SA.THREEX.utils.convert_T_pose_rotation_to_A_pose(v.name, w.rot));
if ((multi_model && sd) || (model_scale != 1)) {
  w = Object.assign({}, w)
  w.rot = w.rot.slice()
  w.pos = w.pos.map(p => p * model_scale)
}
				last = w;
				keys.push( w );
// AT: skin default
if (sd) {
  if (sd.rot_slerp) {
    sd.rot_slerp._frame_ = Math.round(w.time * 30)
    var axis_angle = MMD_SA.TEMP_q.set(w.rot[0],w.rot[1],w.rot[2],w.rot[3]).toAxisAngle()
    w.rot = MMD_SA.TEMP_q.setFromAxisAngle(axis_angle[0], axis_angle[1]*sd.rot_slerp).toArray()
  }
  if (sd.rot_axis) {
    sd.rot_axis._frame_ = Math.round(w.time * 30)
    var axis = new THREE.Vector3()
    var angle
    if (sd.rot_axis.x) {
      axis.set(1,0,0)
      angle = sd.rot_axis.x
    }
    MMD_SA._q1.set(w.rot[0], w.rot[1], w.rot[2], w.rot[3])
    axis.applyQuaternion(MMD_SA._q1)
    w.rot = MMD_SA.TEMP_q.setFromAxisAngle(axis, angle*Math.PI/180).multiply(MMD_SA._q1).toArray()
  }
  if (sd.rot_scale) {
    sd.rot_scale._frame_ = Math.round(w.time * 30)
    w.rot = MMD_SA.TEMP_q.setFromEuler(MMD_SA.TEMP_v3.setEulerFromQuaternion(MMD_SA._q1.set(w.rot[0],w.rot[1],w.rot[2],w.rot[3]), 'YXZ').multiply(sd.rot_scale), 'YXZ').toArray()
  }
  if (sd.rot_add) {
    sd.rot_add._frame_ = Math.round(w.time * 30)
    var _rot = sd.rot_add
    w.rot = MMD_SA.TEMP_q.set(w.rot[0], w.rot[1], w.rot[2], w.rot[3]).multiply(MMD_SA._q1.setFromEuler(MMD_SA.TEMP_v3.set(-_rot.x, _rot.y, -_rot.z).multiplyScalar(Math.PI/180), 'YXZ')).toArray()
  }
  if (sd.pos_scale) {
    sd.pos_scale._frame_ = Math.round(w.time * 30)
    var _pos = sd.pos_scale
    if (_pos.auto_adjust) {
      var bones_by_name = THREE.MMD.getModels()[pmx._model_index].mesh.bones_by_name
      if (bones_by_name["左足"]) {
        var ref_length_by_model = model_para_obj._ref_length = model_para_obj._ref_length || {}
        var ref_length_by_bone = ref_length_by_model[w.name]
        if (!ref_length_by_bone)
          ref_length_by_bone = ref_length_by_model[w.name] = pmx.bones[bones_by_name["左足"]._index].origin[1] - (((w.name.indexOf("足ＩＫ") != -1) && bones_by_name["左足ＩＫ"]) ? pmx.bones[bones_by_name["左足ＩＫ"]._index].origin[1] : 0)
//_pos.auto_adjust.scale=1
        w.pos[1] *= ((ref_length_by_bone / _pos.auto_adjust.ref_length) - 1) * (_pos.auto_adjust.scale||1) + 1
      }
    }
    else {
      w.pos[0] *= _pos.x
      w.pos[1] *= _pos.y
      w.pos[2] *= _pos.z
    }
  }
  if (sd.pos_add) {
    sd.pos_add._frame_ = Math.round(w.time * 30)
    var _pos = sd.pos_add
    w.pos[0] += _pos.x
    w.pos[1] += _pos.y
    w.pos[2] += -_pos.z
  }
}
			}
		});
// AT: guitar special and skin keys
if (self.MMD_SA) {
  let pos_add = sd && (sd.pos_add || (model_sd && model_sd.pos_add) || {x:0,y:0,z:0})
  let rot_add = sd && (sd.rot_add || (model_sd && model_sd.rot_add) || {x:0,y:0,z:0})
  let xyz = ["x","y","z"]
  if (sd && (sd.keys || (!keys.length && (sd.pos || sd.rot || sd.pos_add || sd.rot_add)))/* && !(that._index > MMD_SA.normal_action_length)*/) {
    let sd_keys = (sd.keys) ? sd.keys : [{ pos:sd.pos, rot:sd.rot, time:sd.time, interp:sd.interp }]

    keys = []
    sd_keys.forEach(function (key) {
var _pos = key.pos
var _rot = key.rot

keys.push({
  name: v.name
 ,time: (key.time||0)
 ,pos:  ((_pos) ? [_pos.x, _pos.y, -_pos.z] : [0,0,0]).map((n,i) => n+pos_add[xyz[i]]*((i==2)?-1:1))
 ,rot:  MMD_SA.TEMP_q.setFromEuler(MMD_SA.TEMP_v3.fromArray(((_rot) ? [-_rot.x, _rot.y, -_rot.z] : [0,0,0]).map((n,i) => n*Math.PI/180+rot_add[xyz[i]]*((i==1)?1:-1))), 'YXZ').toArray()
 ,interp: new Uint8Array(key.interp || [20,20,20,20,20,20,20,20, 107,107,107,107,107,107,107,107])
});

// AT: rot for T-pose
need_pose_conversion && ((to_T_pose) ? MMD_SA.THREEX.utils.convert_A_pose_rotation_to_T_pose(v.name, keys[keys.length-1].rot) : MMD_SA.THREEX.utils.convert_T_pose_rotation_to_A_pose(v.name, keys[keys.length-1].rot));
    });
//if (sd.keys && (v.name.indexOf("ＩＫ")!=-1)) {DEBUG_show(JSON.stringify(keys),0,1);DEBUG_show(JSON.stringify(sd),0,1);}
    last = keys[keys.length-1];
  }

  if (sd && sd.keys_mod) {
    sd.keys_mod.forEach(function (key_mod) {
var key = keys.find(function (k) { return Math.round(k.time*30)==key_mod.frame })
if (!key)
  return

var _pos = key_mod.pos;
var _rot = key_mod.rot;
var _rot_add = key_mod.rot_add;
if (_rot_add)
  _rot = MMD_SA._v3a.setEulerFromQuaternion(MMD_SA._q1.set(key.rot[0],key.rot[1],key.rot[2],key.rot[3]), 'YXZ').multiply(MMD_SA._v3b.set(-1,1,-1)).multiplyScalar(180/Math.PI);
//console.log('_rot_add',_rot_add);
if (_pos)
  key.pos = [_pos.x, _pos.y, -_pos.z].map((n,i) => n+pos_add[xyz[i]]*((i==2)?-1:1))
if (_rot) {
  key.rot = MMD_SA.TEMP_q.setFromEuler(MMD_SA.TEMP_v3.fromArray([-(_rot.x+(_rot_add?.x||0)), (_rot.y+(_rot_add?.y||0)), -(_rot.z+(_rot_add?.z||0))].map((n,i) => n*Math.PI/180+rot_add[xyz[i]]*((i==1)?1:-1))), 'YXZ').toArray()
// AT: rot for T-pose
  !_rot_add && need_pose_conversion && ((to_T_pose) ? MMD_SA.THREEX.utils.convert_A_pose_rotation_to_T_pose(v.name, key.rot) : MMD_SA.THREEX.utils.convert_T_pose_rotation_to_A_pose(v.name, key.rot));
}
if (key_mod.interp)
  key.interp = new Uint8Array(key_mod.interp)
    });
  }

  if ((last && ((keys.length > 1) || (last.time < timeMax))) && /guitar|g_head|g_bridge|f_board|\u8155\uFF29\uFF2B/.test(v.name)) { that.use_armIK = true }
}

if (!MMD_SA.THREEX.enabled) {
  const para = motion_para?.adjustment_by_scale?.[v.name];
  if (para) {
    switch (v.name) {
      case 'センター':
        const scale = MMD_SA.THREEX.get_model(pmx._model_index).mesh.bones_by_name['左足'].pmxBone.origin[1]/para.reference_value;
//console.log(v.name, scale)
        keys.forEach(k=>{
          k.pos[1] *= scale;
        });
        break;
    }
  }
}

		if ( last && last.time < timeMax ) {
			last = cloneKey( last );
			last.time = timeMax;
			keys.push( last );
//if (self._k && /strap\d_IK/.test(v.name)) { var _rot=new THREE.Vector3().setEulerFromQuaternion(new THREE.Quaternion(keys[0].rot[0], keys[0].rot[1], keys[0].rot[2], keys[0].rot[3]).normalize()); DEBUG_show(JSON.stringify(keys[0]), 0,1); }
		}

// AT: IK disabled
if ((!motion_para || !motion_para.IK_disabled || motion_para.IK_disabled._IK_name_list) && IK_disabled_RE.test(v.name)) {
  let IK_disabled
  if (keys.length <= 1) {
    IK_disabled = true
  }
  else if (keys.length == 2) {
    let key_last = keys[keys.length-1]
    let p = key_last.pos
    let r = key_last.rot
    if (p[0]==0 && p[1]==0 && p[2]==0 && r[0]==0 && r[1]==0 && r[2]==0)
      IK_disabled = true
  }

  if (IK_disabled) {
    let filename = decodeURIComponent(that.url.replace(/^.+[\/\\]/, "").replace(/\.([a-z0-9]{1,4})$/i, ""))
//console.log(filename, keys)
    motion_para = MMD_SA_options.motion_para[filename] = MMD_SA_options.motion_para[filename] || {};
    motion_para.IK_disabled = motion_para.IK_disabled || {
  test: function (IK_name) {
return (this._IK_name_list.indexOf(IK_name) != -1);
  }
 ,_IK_name_list:[]
    };
    motion_para.IK_disabled._IK_name_list.push(v.name)
  }
}

// AT: skip empty keys (i:bone_idx required)
if (keys.length)
		targets.push( { keys:keys, i:bone_idx } );
	});

// AT: IK disabled
if (motion_para && motion_para.IK_disabled && motion_para.IK_disabled._IK_name_list) {
  motion_para.IK_disabled._IK_name_list = motion_para.IK_disabled._IK_name_list.filter(function (IK_name) {
    return ((IK_name.indexOf("つま先ＩＫ") != -1) ? (motion_para.IK_disabled._IK_name_list.indexOf(IK_name.charAt(0)+"足ＩＫ") != -1) : true);
  });
  if (motion_para.IK_disabled._IK_name_list.length == 0)
    delete motion_para.IK_disabled
  else
    console.log("IK disabled auto:", decodeURIComponent(that.url.replace(/^.+[\/\\]/, "").replace(/\.([a-z0-9]{1,4})$/i, "")))
}

if (motion_para) {
  if (motion_para.has_leg_IK == null) {
    motion_para.has_leg_IK = !motion_para.IK_disabled?.test('左足ＩＫ') && (targets.findIndex(t=>t.keys[0] && t.keys[0].name.indexOf('足ＩＫ')!=-1) != -1);
//if (motion_para.has_leg_IK) console.log('has_leg_IK', decodeURIComponent(that.url.replace(/^.+[\/\\]/, "").replace(/\.([a-z0-9]{1,4})$/i, "")))
  }
  if (motion_para.has_arm_IK == null) {
    motion_para.has_arm_IK = targets.findIndex(t=>t.keys[0] && t.keys[0].name.indexOf('腕ＩＫ')!=-1) != -1;
//if (motion_para.has_arm_IK) console.log('has_arm_IK', decodeURIComponent(that.url.replace(/^.+[\/\\]/, "").replace(/\.([a-z0-9]{1,4})$/i, "")))
  }
}

// AT: _timeMax
	return { _timeMax:_timeMax, duration:timeMax, targets:targets };
};
// AT: Use regular expression to filter frames (RE), stuff
VMD.prototype.generateMorphAnimation = function( pmx, RE ) {
var model_para_obj = self.MMD_SA && MMD_SA_options.model_para_obj_all[pmx._model_index]
	var morphKeys, timeMax, targets;
	morphKeys = this.morphKeys;
	if ( morphKeys.length === 0 ) {
// AT: default morph for no-morph motion
if (!self.MMD_SA || model_para_obj.morph_default._is_empty) {
		return null;
}
	}
	timeMax = this.timeMax;
	targets = [];
// AT: Use regular expression to filter frames (RE)
var _RE = self.MMD_SA && model_para_obj.morph_filter
var that = this
var targets_extra = [];
var motion_para = self.MMD_SA && MMD_SA_options.motion_para[decodeURIComponent(this.url.replace(/^.+[\/\\]/, "").replace(/\.([a-z0-9]{1,4})$/i, ""))];
var motion_md = motion_para && motion_para.adjustment_per_model && (motion_para.adjustment_per_model[MMD_SA.THREEX.get_model(pmx._model_index).model_path.replace(/^.+[\/\\]/, '')] || motion_para.adjustment_per_model[model_para_obj._filename_cleaned] || motion_para.adjustment_per_model._default_);
motion_md = (motion_md && motion_md.morph_default) || {};

// AT: custom duration
timeMax = (motion_para && motion_para.duration)||timeMax;

// morph default for childs of group morphs, and まばたき for auto blink
var morth_default = []
if (MMD_SA_options.auto_blink)
  morth_default[pmx.morphs_index_by_name["まばたき"]] = true
pmx.morphs.forEach(function(v, idx) {
  if (v.type != 0)
    return

  if ((RE && !RE.test(v.name)) || (_RE && !_RE.test(v.name))) { return; }
  var md = self.MMD_SA && (motion_md[v.name] || model_para_obj.morph_default[v.name])
  if (md && md.motion_filter && !md.motion_filter.test(decodeURIComponent(that.url))) {
    md = null
  }

  var assign_default
  if (morth_default[idx] || (md && (!md.weight_scale || md.weight || md.keys)))
    assign_default = true
  else {
    for (var i = 0, i_max = morphKeys.length; i < i_max; i++) {
      var w = morphKeys[i]
      if (v.name === w.name) {
        if (w.weight > 0) {
          assign_default = true
          break
        }
      }
    }
  }
  if (assign_default) {
    v.items.forEach(function (item) {
//DEBUG_show(pmx.morphs[item.target].name+'/'+v.name,0,1)
      morth_default[item.target] = true
    });
  }
});
// AT: simple MorphMaterial support (, idx)
	pmx.morphs.forEach( function( v , idx) {
//if (v.panel == 3) return // mouth morphs
if ((RE && !RE.test(v.name)) || (_RE && !_RE.test(v.name))) { return; }
		var keys, last;
// AT: morph default and weight_max
var weight_max = 0;
var md = self.MMD_SA && (motion_md[v.name] || model_para_obj.morph_default[v.name])
if (md && md.motion_filter && !md.motion_filter.test(decodeURIComponent(that.url))) {
  md = null
}
// AT: simple MorphMaterial support, and other non-vertex morphs
		if (1) { // vertex
			// 一連のキーをターゲット（名前）毎に振り分ける。
			keys = [];
// AT: multi-model
var multi_model = (MMD_SA_options.model_para_obj_all.length > 1)
			morphKeys.forEach( function( w ) {
				if ( v.name === w.name ) {
// always duplicate for multi model, to prevent any possible mess-up of keys between different models (properties like "morph_index" can be different among models)
if (multi_model) {// && md) {
  w = Object.assign({}, w)
}
					last = w;
					keys.push( w );
// AT: morph_type, morph_index, morph default (weight_scale), and weight_max
w.morph_type  = v.type
//if (idx>32)DEBUG_show(idx+'/'+pmx._model_index+'/'+v.name,0,1)
w.morph_index = idx
if (md && md.weight_scale)
  w.weight *= md.weight_scale
weight_max = Math.max(weight_max, w.weight);
				}
			});
// AT: weight_max, md.keys (overriding)
			if ( !weight_max || (md && md.keys) /*keys.length === 1 && last.weight === 0*/ ) {
				// omit
				keys = [];
				last = undefined;
// AT: morph default
if (md && (!md.weight_scale || md.weight || md.keys)/* && !(that._index > MMD_SA.normal_action_length)*/) {
  if (md.keys) {
    md.keys.forEach(function (key) {
      keys.push({ name:v.name, weight:key.weight, time:key.time, morph_type:v.type, morph_index:idx });
    });
  }
  else {
    keys.push({ name:v.name, weight:((md.weight===0)?0:(md.weight||1)), time:(md.time||0), morph_type:v.type, morph_index:idx });
  }
  last = keys[keys.length-1];
}
else if (morth_default[idx]) {
  keys.push({ name:v.name, weight:0, time:0, morph_type:v.type, morph_index:idx });
  last = keys[keys.length-1];
}
			}
			if ( !last ) {
				return;
			}
			if ( /* last && */ last.time < timeMax ) {
				last = cloneKey( last );
				last.time = timeMax;
				keys.push( last );
			}
// AT: simple MorphMaterial support, and other non-vertex morphs
if (v.type != 1) { targets_extra.push( { keys:keys } ) } else
			targets.push( { keys:keys } );
		}
	});
// AT: simple MorphMaterial support, and other non-vertex morphs
targets = targets.concat(targets_extra);
	if ( targets.length === 0 ) {
// AT: Skip it for now. Null morth may create problems in some cases.
//		return null;
	}
//if (targets.some(function (t) { return t.keys[0].name=="はぅ" })) console.log(targets)
	return { duration:timeMax, targets:targets };
};
VMD.prototype.generateCameraAnimation = function() {
	var cameraKeys, timeMax, keys, last;
	cameraKeys = this.cameraKeys;
	if ( cameraKeys.length === 0 ){
		return null;
	}
	timeMax = this.timeMax;
	keys = [];
	cameraKeys.forEach( function( v ) {
		last = v;
		keys.push( v );
	});
	if ( last && last.time < timeMax ) {
		last = cloneKey( last );
		last.time = timeMax;
		keys.push( last );
	}
	return { duration:timeMax, keys:keys };
};
VMD.prototype.generateLightAnimation = function() {
	var lightKeys, timeMax, keys, last;
	lightKeys = this.lightKeys;
	if ( lightKeys.length === 0 ){
		return null;
	}
	timeMax = this.timeMax;
	keys = [];
	lightKeys.forEach( function( v ) {
		last = v;
		keys.push( v );
	});
	if ( last && last.time < timeMax ) {
		last = cloneKey( last );
		last.time = timeMax;
		keys.push( last );
	}
	return { duration:timeMax, keys:keys };
};

}()); // VMD

MMDShader = { // MOD MeshPhongMaterial
	uniforms: THREE.UniformsUtils.merge( [
		THREE.UniformsLib.common,
		THREE.UniformsLib.bump,
		THREE.UniformsLib.normalmap,
		THREE.UniformsLib.fog,
		THREE.UniformsLib.lights,
		THREE.UniformsLib.shadowmap,
// AT: uniTexture
THREE.UniformsLib[ "uniTexture" ],
		{
			"ambient"  : { type: "c", value: new THREE.Color( 0xffffff ) },
			"emissive" : { type: "c", value: new THREE.Color( 0x000000 ) },
			"specular" : { type: "c", value: new THREE.Color( 0x111111 ) },
			"shininess": { type: "f", value: 30 },
			"wrapRGB"  : { type: "v3", value: new THREE.Vector3( 1, 1, 1 ) },

			// MMD
// AT: MMDShadow
"MMDShadow": { type: "f",  value:0 },
			"mmdToonMap"   : { type: "t", value: null },
			"mmdSphereMap" : { type: "t", value: null },
			"mmdEdgeThick" : { type: "f", value: 0 },
			"mmdEdgeColor" : { type: "v4", value: new THREE.Vector4( 0, 0, 0, 1 ) }, // RGBA
			"mmdShadowDark": { type: "f", value: 0 }
		}
	] ),


// AT: custom shader START
	vertexShader: '#define MMD\n#define PHONG\nvarying vec3 vViewPosition;varying vec3 vNormal;\n#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP )\nvarying vec2 vUv;uniform vec4 offsetRepeat;\n#endif\n#ifdef USE_LIGHTMAP\nvarying vec2 vUv2;\n#endif\n#if defined( USE_ENVMAP ) && ! defined( USE_BUMPMAP ) && ! defined( USE_NORMALMAP )\nvarying vec3 vReflect;uniform float refractionRatio;uniform bool useRefract;\n#endif\n#ifndef PHONG_PER_PIXEL\n#if MAX_POINT_LIGHTS > 0\nuniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];uniform float pointLightDistance[ MAX_POINT_LIGHTS ];varying vec4 vPointLight[ MAX_POINT_LIGHTS ];\n#endif\n#if MAX_SPOT_LIGHTS > 0\nuniform vec3 spotLightPosition[ MAX_SPOT_LIGHTS ];uniform float spotLightDistance[ MAX_SPOT_LIGHTS ];varying vec4 vSpotLight[ MAX_SPOT_LIGHTS ];\n#endif\n#endif\n'

// AT: uniTexture
+ THREE.ShaderChunk[ "uniTexture_pars_vertex" ] + '\n'

//  || defined(USE_XRAY_PASS)
+ '#if MAX_SPOT_LIGHTS > 0 || defined( USE_BUMPMAP ) || defined(USE_XRAY_PASS)\n'
+ 'varying vec3 vWorldPosition;\n'
+ '#endif\n'


+ '#ifdef USE_COLOR\nvarying vec3 vColor;\n#endif\n'

// AT: increase maxMorphTargets from 8 to 16, maxMorphNormals from 4 to 8
+ '#ifdef USE_MORPHTARGETS\n#ifndef USE_MORPHNORMALS\n'
+ 'uniform float morphTargetInfluences[ 8 ];\n#else\nuniform float morphTargetInfluences[ 4 ];\n'
+ '#endif\n#endif\n'

+ '#ifdef USE_SKINNING\n#ifdef BONE_TEXTURE\nuniform sampler2D boneTexture;mat4 getBoneMatrix( const in float i ) {float j = i * 4.0;float x = mod( j, N_BONE_PIXEL_X );float y = floor( j / N_BONE_PIXEL_X );const float dx = 1.0 / N_BONE_PIXEL_X;const float dy = 1.0 / N_BONE_PIXEL_Y;y = dy * ( y + 0.5 );vec4 v1 = texture2D( boneTexture, vec2( dx * ( x + 0.5 ), y ) );vec4 v2 = texture2D( boneTexture, vec2( dx * ( x + 1.5 ), y ) );vec4 v3 = texture2D( boneTexture, vec2( dx * ( x + 2.5 ), y ) );vec4 v4 = texture2D( boneTexture, vec2( dx * ( x + 3.5 ), y ) );mat4 bone = mat4( v1, v2, v3, v4 );return bone;}\n#else\nuniform mat4 boneGlobalMatrices[ MAX_BONES ];mat4 getBoneMatrix( const in float i ) {mat4 bone = boneGlobalMatrices[ int(i) ];return bone;}\n#endif\n#endif\n#ifdef USE_SHADOWMAP\n'

// AT: shadowBias by light normal (object normal untransformed)
+ 'varying vec3 normal_untransformed;'

+ 'varying vec4 vShadowCoord[ MAX_SHADOWS ];uniform mat4 shadowMatrix[ MAX_SHADOWS ];\n#endif\n#ifdef MMD\nuniform float mmdEdgeThick;\n#endif\n#ifdef MMD_SPHEREMAP\nvarying vec2 vUvSphere;\n#endif\n'

// AT: logarithmic depth buffer
//+ THREE.ShaderChunk[ "logdepthbuf_pars_vertex" ] + '\n'

+ 'void main() {\n'
+ '#ifdef USE_SKINNING\nmat4 skinMatrix;\n#ifdef MMD\nskinMatrix  = skinWeight.x * getBoneMatrix( skinIndex.x );if ( skinWeight.y > 0.0 ) {skinMatrix += skinWeight.y * getBoneMatrix( skinIndex.y );if ( skinWeight.z > 0.0 ) {skinMatrix += skinWeight.z * getBoneMatrix( skinIndex.z );skinMatrix += skinWeight.w * getBoneMatrix( skinIndex.w );}}\n#else\nskinMatrix =skinWeight.x * getBoneMatrix( skinIndex.x ) +skinWeight.y * getBoneMatrix( skinIndex.y );\n#endif\n#endif\nvec3 objectNormal = normal;\n'

// AT: increase maxMorphTargets from 8 to 16, maxMorphNormals from 4 to 8
+ '#ifdef USE_MORPHNORMALS\n'
+ (function(){ let code=''; for (let i=0;i<4;i++) code+='objectNormal += ( morphNormal'+i+' - normal ) * morphTargetInfluences[ '+i+' ];\n'; return code; })()
//+ 'objectNormal += ( morphNormal0 - normal ) * morphTargetInfluences[ 0 ];objectNormal += ( morphNormal1 - normal ) * morphTargetInfluences[ 1 ];objectNormal += ( morphNormal2 - normal ) * morphTargetInfluences[ 2 ];objectNormal += ( morphNormal3 - normal ) * morphTargetInfluences[ 3 ];\n'
+ '#endif\n'

+ '#ifdef USE_SKINNING\nobjectNormal.xyz = ( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;\n#endif\n#ifdef FLIP_SIDED\nobjectNormal = -objectNormal;\n#endif\n'

// AT: shadowBias by light normal
+ '#ifdef USE_SHADOWMAP\n'
+ '  normal_untransformed = normalize(mat3( modelMatrix[ 0 ].xyz, modelMatrix[ 1 ].xyz, modelMatrix[ 2 ].xyz ) * objectNormal);\n'
+ '#endif\n'

+ 'vNormal = normalize( normalMatrix * objectNormal );vec3 objectPosition = position;\n'

// AT: increase maxMorphTargets from 8 to 16, maxMorphNormals from 4 to 8
+ '#ifdef USE_MORPHTARGETS\n'
+ (function(){ let code=''; for (let i=0;i<8;i++) code+='objectPosition += ( morphTarget'+i+' - position ) * morphTargetInfluences[ '+i+' ];\n'; return code; })()
//+ 'objectPosition += ( morphTarget0 - position ) * morphTargetInfluences[ 0 ];objectPosition += ( morphTarget1 - position ) * morphTargetInfluences[ 1 ];objectPosition += ( morphTarget2 - position ) * morphTargetInfluences[ 2 ];objectPosition += ( morphTarget3 - position ) * morphTargetInfluences[ 3 ];\n#ifndef USE_MORPHNORMALS\nobjectPosition += ( morphTarget4 - position ) * morphTargetInfluences[ 4 ];objectPosition += ( morphTarget5 - position ) * morphTargetInfluences[ 5 ];objectPosition += ( morphTarget6 - position ) * morphTargetInfluences[ 6 ];objectPosition += ( morphTarget7 - position ) * morphTargetInfluences[ 7 ];\n'
+ '#endif\n'


// AT: uniTexture
// ignore skinning
+ '#ifdef USE_UNI_TEXTURE\n'
+ '  vec3 uniTexture_pos = objectPosition;\n'

//+ '  uniTexture_vUv = vec2(((0.+uniTexture_pos.x * abs(normalize(objectNormal.xz).y) + uniTexture_pos.z * abs(normalize(objectNormal.xz).x))) * 0.1, ((0.+uniTexture_pos.y * abs(normalize(objectNormal.yz).y) + uniTexture_pos.z * abs(normalize(objectNormal.yz).x))) * 0.1);\n'
//+ '  uniTexture_vUv = vec2(((999.+uniTexture_pos.x + uniTexture_pos.z * abs(normalize(objectNormal.xz).x))) * 0.1, ((999.+uniTexture_pos.y + uniTexture_pos.z * abs(normalize(objectNormal.yz).x))) * 0.1);\n'

//+ '  uniTexture_vUv = vec2(0.+ ((uniTexture_pos.x==0.0)?sign(uniTexture_pos.x):1.0)* length(uniTexture_pos.xz)*0.1, 0.+ ((uniTexture_pos.y==0.0)?sign(uniTexture_pos.y):1.0)* length(uniTexture_pos.yz)*0.1);\n'

//+ '  uniTexture_vUv = vec2((normalize(uniTexture_pos.xz).x * 0.5 + 0.5) * 1.0, (normalize(uniTexture_pos.yz).x * 0.5 + 0.5) * 1.0);\n'
//+ '  uniTexture_vUv = vec2(uv.x, -uv.y);\n'
+ '#endif\n'


+ '#ifdef USE_SKINNING\nobjectPosition.xyz = ( skinMatrix * vec4( objectPosition, 1.0 ) ).xyz;\n#endif\nvec4 mvPosition = modelViewMatrix * vec4( objectPosition, 1.0 );gl_Position = projectionMatrix * mvPosition;\n'

+ '#ifdef MMD\n'
+ 'if (mmdEdgeThick > 0.0) {\n'


// set vViewPosition for render pass with edge
+ '#ifdef USE_XRAY_PASS\n'
+ 'vWorldPosition = (modelMatrix * vec4( objectPosition, 1.0 )).xyz;\n'
+ '#endif\n'


+ 'vec2 offset;offset.x = vNormal.x * projectionMatrix[0][0] / projectionMatrix[1][1];offset.y = vNormal.y;gl_Position.xy += offset * gl_Position.w * mmdEdgeThick;return;}\n'
+ '#endif\n'

+ 'vViewPosition = -mvPosition.xyz;\n#if defined( USE_ENVMAP ) || defined( PHONG ) || defined( LAMBERT ) || defined ( USE_SHADOWMAP )\nvec4 worldPosition = modelMatrix * vec4( objectPosition, 1.0 );\n#endif\n#if defined( USE_ENVMAP ) && ! defined( USE_BUMPMAP ) && ! defined( USE_NORMALMAP )\nvec3 worldNormal = mat3( modelMatrix[ 0 ].xyz, modelMatrix[ 1 ].xyz, modelMatrix[ 2 ].xyz ) * objectNormal;worldNormal = normalize( worldNormal );vec3 cameraToVertex = normalize( worldPosition.xyz - cameraPosition );if ( useRefract ) {vReflect = refract( cameraToVertex, worldNormal, refractionRatio );} else {vReflect = reflect( cameraToVertex, worldNormal );}\n#endif\n#ifndef PHONG_PER_PIXEL\n#if MAX_POINT_LIGHTS > 0\nfor( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {vec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );vec3 lVector = lPosition.xyz - mvPosition.xyz;float lDistance = 1.0;if ( pointLightDistance[ i ] > 0.0 )lDistance = 1.0 - min( ( length( lVector ) / pointLightDistance[ i ] ), 1.0 );vPointLight[ i ] = vec4( lVector, lDistance );}\n#endif\n#if MAX_SPOT_LIGHTS > 0\nfor( int i = 0; i < MAX_SPOT_LIGHTS; i ++ ) {vec4 lPosition = viewMatrix * vec4( spotLightPosition[ i ], 1.0 );vec3 lVector = lPosition.xyz - mvPosition.xyz;float lDistance = 1.0;if ( spotLightDistance[ i ] > 0.0 )lDistance = 1.0 - min( ( length( lVector ) / spotLightDistance[ i ] ), 1.0 );vSpotLight[ i ] = vec4( lVector, lDistance );}\n#endif\n#endif\n'


// AT: uniTexture
+ '#ifdef USE_UNI_TEXTURE\n'
+ [

  "uniTexture_pos = uniTexture_pos - vec3(uniTexture_bs, -uniTexture_bs, uniTexture_bs) * 10.;",

  "uniTexture_MatrixRain_opacity = (uniTexture_MatrixRain_height_limit.x > 0.0) ? clamp((1.0 - (uniTexture_MatrixRain_height_limit.y + uniTexture_bs - position.y) / (uniTexture_bs * 2.0) - uniTexture_MatrixRain_height_limit.x) / (uniTexture_MatrixRain_height_limit.x*0.25), 0.0, 1.0) : 1.0;",

  "uniTexture_vUv = vec2(-length(uniTexture_pos.xz), length(uniTexture_pos.yz)) * 0.1 / uniTexture_scale;",

  "#if !(MAX_SPOT_LIGHTS > 0 || defined( USE_BUMPMAP ) || defined(USE_XRAY_PASS))",
  "  vWorldPosition = worldPosition.xyz;",
  "#endif",

  ].join("\n") + '\n'
+ '#endif\n'


//  || defined(USE_XRAY_PASS)
+ '#if MAX_SPOT_LIGHTS > 0 || defined( USE_BUMPMAP ) || defined(USE_XRAY_PASS)\n'
+ 'vWorldPosition = worldPosition.xyz;\n'
+ '#endif\n'


+ '#ifdef USE_SHADOWMAP\nfor( int i = 0; i < MAX_SHADOWS; i ++ ) {vShadowCoord[ i ] = shadowMatrix[ i ] * worldPosition;}\n#endif\n#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP )\nvUv = uv * offsetRepeat.zw + offsetRepeat.xy;\n#endif\n#ifdef USE_LIGHTMAP\nvUv2 = uv2;\n#endif\n#ifdef MMD_SPHEREMAP\nvUvSphere = vNormal.xy * 0.5 + 0.5;vUvSphere.y = 1.0 - vUvSphere.y;\n#endif\n#ifdef USE_COLOR\n#ifdef GAMMA_INPUT\nvColor = color * color;\n#else\nvColor = color;\n#endif\n#endif\n'

// AT: logarithmic depth buffer
//+ THREE.ShaderChunk[ "logdepthbuf_vertex" ] + '\n'

+ '}',


	fragmentShader:
  '#define MMD\nuniform vec3 diffuse;uniform float opacity;uniform vec3 ambient;uniform vec3 emissive;uniform vec3 specular;uniform float shininess;\n#ifdef USE_COLOR\nvarying vec3 vColor;\n#endif\n#if defined( USE_MAP ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( USE_SPECULARMAP )\nvarying vec2 vUv;\n#endif\n#ifdef USE_MAP\nuniform sampler2D map;\n#endif\n#ifdef USE_LIGHTMAP\nvarying vec2 vUv2;uniform sampler2D lightMap;\n#endif\n#ifdef USE_ENVMAP\nuniform float reflectivity;uniform samplerCube envMap;uniform float flipEnvMap;uniform int combine;\n#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP )\nuniform bool useRefract;uniform float refractionRatio;\n#else\nvarying vec3 vReflect;\n#endif\n#endif\n#ifdef USE_FOG\nuniform vec3 fogColor;\n#ifdef FOG_EXP2\nuniform float fogDensity;\n#else\nuniform float fogNear;uniform float fogFar;\n#endif\n#endif\nuniform vec3 ambientLightColor;\n#if MAX_DIR_LIGHTS > 0\nuniform vec3 directionalLightColor[ MAX_DIR_LIGHTS ];uniform vec3 directionalLightDirection[ MAX_DIR_LIGHTS ];\n#endif\n#if MAX_HEMI_LIGHTS > 0\nuniform vec3 hemisphereLightSkyColor[ MAX_HEMI_LIGHTS ];uniform vec3 hemisphereLightGroundColor[ MAX_HEMI_LIGHTS ];uniform vec3 hemisphereLightDirection[ MAX_HEMI_LIGHTS ];\n#endif\n#if MAX_POINT_LIGHTS > 0\nuniform vec3 pointLightColor[ MAX_POINT_LIGHTS ];\n#ifdef PHONG_PER_PIXEL\nuniform vec3 pointLightPosition[ MAX_POINT_LIGHTS ];uniform float pointLightDistance[ MAX_POINT_LIGHTS ];\n#else\nvarying vec4 vPointLight[ MAX_POINT_LIGHTS ];\n#endif\n#endif\n#if MAX_SPOT_LIGHTS > 0\nuniform vec3 spotLightColor[ MAX_SPOT_LIGHTS ];uniform vec3 spotLightPosition[ MAX_SPOT_LIGHTS ];uniform vec3 spotLightDirection[ MAX_SPOT_LIGHTS ];uniform float spotLightAngleCos[ MAX_SPOT_LIGHTS ];uniform float spotLightExponent[ MAX_SPOT_LIGHTS ];\n#ifdef PHONG_PER_PIXEL\nuniform float spotLightDistance[ MAX_SPOT_LIGHTS ];\n#else\nvarying vec4 vSpotLight[ MAX_SPOT_LIGHTS ];\n#endif\n#endif\n'

// AT: uniTexture
+ THREE.ShaderChunk[ "uniTexture_pars_fragment" ] + '\n'


//  || defined(USE_XRAY_PASS)
+ '#if MAX_SPOT_LIGHTS > 0 || defined( USE_BUMPMAP ) || defined(USE_XRAY_PASS)\n'
+ 'varying vec3 vWorldPosition;\n'
+ '#endif\n'

// X-ray
+ '#ifdef USE_XRAY_PASS\n'
+ 'uniform vec3 xray_center;\n'
+ 'uniform float xray_radius;\n'
+ 'uniform float xray_opacity;\n'
+ '#endif\n'

// MME shader (fvar)
+ MMD_SA.MME_shader("HDR").fvar
+ MMD_SA.MME_shader("self_overlay").fvar
+ MMD_SA.MME_shader("serious_shader").fvar


+ '#ifdef WRAP_AROUND\nuniform vec3 wrapRGB;\n#endif\nvarying vec3 vViewPosition;varying vec3 vNormal;\n#ifdef USE_SHADOWMAP\nuniform sampler2D shadowMap[ MAX_SHADOWS ];uniform vec2 shadowMapSize[ MAX_SHADOWS ];uniform float shadowDarkness[ MAX_SHADOWS ];'

// AT: shadowBias by light normal
+ 'uniform vec3 shadowBias[ MAX_SHADOWS ];'
+ 'uniform vec3 shadowPara[ MAX_SHADOWS ];'
+ 'varying vec3 normal_untransformed;'
//+ 'uniform float shadowBias[ MAX_SHADOWS ];'

+ 'varying vec4 vShadowCoord[ MAX_SHADOWS ];float unpackDepth( const in vec4 rgba_depth ) {const vec4 bit_shift = vec4( 1.0 / ( 256.0 * 256.0 * 256.0 ), 1.0 / ( 256.0 * 256.0 ), 1.0 / 256.0, 1.0 );float depth = dot( rgba_depth, bit_shift );return depth;}\n#endif\n#ifdef USE_BUMPMAP\nuniform sampler2D bumpMap;uniform float bumpScale;vec2 dHdxy_fwd() {vec2 dSTdx = dFdx( vUv );vec2 dSTdy = dFdy( vUv );float Hll = bumpScale * texture2D( bumpMap, vUv ).x;float dBx = bumpScale * texture2D( bumpMap, vUv + dSTdx ).x - Hll;float dBy = bumpScale * texture2D( bumpMap, vUv + dSTdy ).x - Hll;return vec2( dBx, dBy );}vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy ) {vec3 vSigmaX = dFdx( surf_pos );vec3 vSigmaY = dFdy( surf_pos );vec3 vN = surf_norm;vec3 R1 = cross( vSigmaY, vN );vec3 R2 = cross( vN, vSigmaX );float fDet = dot( vSigmaX, R1 );vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );return normalize( abs( fDet ) * surf_norm - vGrad );}\n#endif\n#ifdef USE_NORMALMAP\nuniform sampler2D normalMap;uniform vec2 normalScale;vec3 perturbNormal2Arb( vec3 eye_pos, vec3 surf_norm ) {vec3 q0 = dFdx( eye_pos.xyz );vec3 q1 = dFdy( eye_pos.xyz );vec2 st0 = dFdx( vUv.st );vec2 st1 = dFdy( vUv.st );vec3 S = normalize(  q0 * st1.t - q1 * st0.t );vec3 T = normalize( -q0 * st1.s + q1 * st0.s );vec3 N = normalize( surf_norm );vec3 mapN = texture2D( normalMap, vUv ).xyz * 2.0 - 1.0;mapN.xy = normalScale * mapN.xy;mat3 tsn = mat3( S, T, N );return normalize( tsn * mapN );}\n#endif\n#ifdef USE_SPECULARMAP\nuniform sampler2D specularMap;\n#endif\n'

+ '#ifdef MMD\n'
+ 'uniform float MMDShadow;'
+ 'uniform float mmdEdgeThick;uniform vec4 mmdEdgeColor;uniform float mmdShadowDark;\n'
+ '#endif\n'
+ '#ifdef MMD_TOONMAP\nuniform sampler2D mmdToonMap;\n#endif\n#ifdef MMD_SPHEREMAP\nvarying vec2 vUvSphere;uniform sampler2D mmdSphereMap;\n#endif\n'


+ THREE.ShaderChunk[ "AT_depth_render_mode_pars_fragment" ] + '\n'

+ [
/*
"void RGBtoYCbCr(vec3 rgbColor, out float Y, out float Cb, out float Cr) {",
"    Y  =  0.298912 * rgbColor.r + 0.586611 * rgbColor.g + 0.114478 * rgbColor.b;",
"    Cb = -0.168736 * rgbColor.r - 0.331264 * rgbColor.g + 0.5      * rgbColor.b;",
"    Cr =  0.5      * rgbColor.r - 0.418688 * rgbColor.g - 0.081312 * rgbColor.b;",
"}",
*/
"vec3 YCbCrtoRGB(float Y, float Cb, float Cr) {",
"    float R = Y - 0.000982 * Cb + 1.401845 * Cr;",
"    float G = Y - 0.345117 * Cb - 0.714291 * Cr;",
"    float B = Y + 1.771019 * Cb - 0.000154 * Cr;",
"    return vec3( R, G, B );",
"}"
].join('\n') + '\n'

// AT: logarithmic depth buffer
//+ THREE.ShaderChunk[ "logdepthbuf_pars_fragment" ] + '\n'

+ 'void main() {\n'

// discard for 0 opacity
//+ 'discard;\n'
//+ 'if (opacity <= 0.0) discard;\n'

// AT: logarithmic depth buffer
//+ THREE.ShaderChunk[ "logdepthbuf_fragment" ] + '\n'

+ THREE.ShaderChunk[ "AT_depth_render_mode_fragment" ] + '\n'

+ '#ifdef MMD\nif (mmdEdgeThick > 0.0) {gl_FragColor = mmdEdgeColor;} else {\n#endif\ngl_FragColor = vec4( vec3 ( 1.0 ), opacity );vec4 texelColor;\n'

+ '#ifdef USE_MAP\n'
+ 'texelColor = texture2D( map, vUv );\n'
+ '#ifdef GAMMA_INPUT\ntexelColor.xyz *= texelColor.xyz;\n#endif\n'
+ 'gl_FragColor = gl_FragColor * texelColor;\n'
+ '#endif\n'

+ '#ifdef MMD_SPHEREMAP\n'
+ 'texelColor = texture2D( mmdSphereMap, vUvSphere );\n'
+ '#ifdef GAMMA_INPUT\ntexelColor.xyz *= texelColor.xyz;\n#endif\n'
+ '#if MMD_SPHEREMAP == 1\ngl_FragColor = gl_FragColor * texelColor;\n#else\ngl_FragColor.xyz = gl_FragColor.xyz + texelColor.xyz;\n#endif\n'
+ '#endif\n'


// Serious Shader
+ 'vec4 ShadowColor;\n'
+ 'float Y, Cb, Cr;\n'

// moved from USE_SHADOWMAP
+ 'vec3 shadowColor = vec3( 1.0 );\n'

+ '#ifdef MAX_DIR_LIGHTS\n'
+ 'float comp_list[MAX_DIR_LIGHTS];\n'
+ '#endif\n'
+ MMD_SA.MME_shader_branch("SERIOUS_SHADER", true)
+ 'ShadowColor = vec4(gl_FragColor.rgb, 1.0);\n'
// NOTE: MAX_DIR_LIGHTS > 0 causes ERROR on Electron (v0.33.4) for unknown reasons
+ MMD_SA.MME_shader_branch("SERIOUS_SHADER", false)


// original
//+ '#ifdef ALPHATEST\nif ( gl_FragColor.a < ALPHATEST ) discard;\n#endif\n#ifdef MMD_TOONMAP\nfloat specularStrength;\n#ifdef USE_SPECULARMAP\nvec4 texelSpecular = texture2D( specularMap, vUv );specularStrength = texelSpecular.r;\n#else\nspecularStrength = 1.0;\n#endif\nvec3 normal = vNormal;vec3 viewPosition = normalize( vViewPosition );\n#ifdef DOUBLE_SIDED\nnormal = normal * ( -1.0 + 2.0 * float( gl_FrontFacing ) );\n#endif\n#ifdef USE_NORMALMAP\nnormal = perturbNormal2Arb( -vViewPosition, normal );\n#elif defined( USE_BUMPMAP )\nnormal = perturbNormalArb( -vViewPosition, normal, dHdxy_fwd() );\n#endif\nvec3 totalDiffuse = vec3( 0.0 );vec3 totalSpecular = vec3( 0.0 );\n#ifdef MMD_TOONMAP\nvec3 totalToon = vec3( 0.0 );\n#endif\n#if MAX_POINT_LIGHTS > 0\nfor ( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {\n#ifdef PHONG_PER_PIXEL\nvec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );vec3 lVector = lPosition.xyz + vViewPosition.xyz;float lDistance = 1.0;if ( pointLightDistance[ i ] > 0.0 )lDistance = 1.0 - min( ( length( lVector ) / pointLightDistance[ i ] ), 1.0 );lVector = normalize( lVector );\n#else\nvec3 lVector = normalize( vPointLight[ i ].xyz );float lDistance = vPointLight[ i ].w;\n#endif\nfloat dotProduct = dot( normal, lVector );\n#ifdef WRAP_AROUND\nfloat pointDiffuseWeightFull = max( dotProduct, 0.0 );float pointDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );vec3 pointDiffuseWeight = mix( vec3 ( pointDiffuseWeightFull ), vec3( pointDiffuseWeightHalf ), wrapRGB );\n#else\nfloat pointDiffuseWeight = max( dotProduct, 0.0 );\n#endif\n#ifdef MMD_TOONMAP\ntotalToon += texture2D( mmdToonMap, vec2( 0.0, 1.0 - ( 0.5 * dotProduct + 0.5 ) ) ).xyz;totalDiffuse  += diffuse * pointLightColor[ i ] * lDistance;\n#else\ntotalDiffuse  += diffuse * pointLightColor[ i ] * pointDiffuseWeight * lDistance;\n#endif\nvec3 pointHalfVector = normalize( lVector + viewPosition );float pointDotNormalHalf = max( dot( normal, pointHalfVector ), 0.0 );float pointSpecularWeight = specularStrength * pow( pointDotNormalHalf, shininess );\n#ifdef PHYSICALLY_BASED_SHADING\nfloat specularNormalization = ( shininess + 2.0001 ) / 8.0;vec3 schlick = specular + vec3( 1.0 - specular ) * pow( 1.0 - dot( lVector, pointHalfVector ), 5.0 );totalSpecular += schlick * pointLightColor[ i ] * pointSpecularWeight * pointDiffuseWeight * lDistance * specularNormalization;\n#else\ntotalSpecular += specular * pointLightColor[ i ] * pointSpecularWeight * pointDiffuseWeight * lDistance;\n#endif\n}\n#endif\n#if MAX_SPOT_LIGHTS > 0\nfor ( int i = 0; i < MAX_SPOT_LIGHTS; i ++ ) {\n#ifdef PHONG_PER_PIXEL\nvec4 lPosition = viewMatrix * vec4( spotLightPosition[ i ], 1.0 );vec3 lVector = lPosition.xyz + vViewPosition.xyz;float lDistance = 1.0;if ( spotLightDistance[ i ] > 0.0 )lDistance = 1.0 - min( ( length( lVector ) / spotLightDistance[ i ] ), 1.0 );lVector = normalize( lVector );\n#else\nvec3 lVector = normalize( vSpotLight[ i ].xyz );float lDistance = vSpotLight[ i ].w;\n#endif\nfloat spotEffect = dot( spotLightDirection[ i ], normalize( spotLightPosition[ i ] - vWorldPosition ) );if ( spotEffect > spotLightAngleCos[ i ] ) {spotEffect = max( pow( spotEffect, spotLightExponent[ i ] ), 0.0 );float dotProduct = dot( normal, lVector );\n#ifdef WRAP_AROUND\nfloat spotDiffuseWeightFull = max( dotProduct, 0.0 );float spotDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );vec3 spotDiffuseWeight = mix( vec3 ( spotDiffuseWeightFull ), vec3( spotDiffuseWeightHalf ), wrapRGB );\n#else\nfloat spotDiffuseWeight = max( dotProduct, 0.0 );\n#endif\n#ifdef MMD_TOONMAP\ntotalToon += texture2D( mmdToonMap, vec2( 0.0, 1.0 - ( 0.5 * dotProduct + 0.5 ) ) ).xyz;totalDiffuse += diffuse * spotLightColor[ i ] * lDistance * spotEffect;\n#else\ntotalDiffuse += diffuse * spotLightColor[ i ] * spotDiffuseWeight * lDistance * spotEffect;\n#endif\nvec3 spotHalfVector = normalize( lVector + viewPosition );float spotDotNormalHalf = max( dot( normal, spotHalfVector ), 0.0 );float spotSpecularWeight = specularStrength * pow( spotDotNormalHalf, shininess );\n#ifdef PHYSICALLY_BASED_SHADING\nfloat specularNormalization = ( shininess + 2.0001 ) / 8.0;vec3 schlick = specular + vec3( 1.0 - specular ) * pow( 1.0 - dot( lVector, spotHalfVector ), 5.0 );totalSpecular += schlick * spotLightColor[ i ] * spotSpecularWeight * spotDiffuseWeight * lDistance * specularNormalization * spotEffect;\n#else\ntotalSpecular += specular * spotLightColor[ i ] * spotSpecularWeight * spotDiffuseWeight * lDistance * spotEffect;\n#endif\n}}\n#endif\n#if MAX_DIR_LIGHTS > 0\nfor( int i = 0; i < MAX_DIR_LIGHTS; i ++ ) {vec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );vec3 dirVector = normalize( lDirection.xyz );float dotProduct = dot( normal, dirVector );\n#ifdef WRAP_AROUND\nfloat dirDiffuseWeightFull = max( dotProduct, 0.0 );float dirDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );vec3 dirDiffuseWeight = mix( vec3( dirDiffuseWeightFull ), vec3( dirDiffuseWeightHalf ), wrapRGB );\n#else\nfloat dirDiffuseWeight = max( dotProduct, 0.0 );\n#endif\n#ifdef MMD_TOONMAP\ntotalToon += texture2D( mmdToonMap, vec2( 0.0, 1.0 - ( 0.5 * dotProduct + 0.5 ) ) ).xyz;totalDiffuse += diffuse * directionalLightColor[ i ];\n#else\ntotalDiffuse += diffuse * directionalLightColor[ i ] * dirDiffuseWeight;\n#endif\nvec3 dirHalfVector = normalize( dirVector + viewPosition );float dirDotNormalHalf = max( dot( normal, dirHalfVector ), 0.0 );float dirSpecularWeight = specularStrength * pow( dirDotNormalHalf, shininess );\n#ifdef PHYSICALLY_BASED_SHADING\nfloat specularNormalization = ( shininess + 2.0001 ) / 8.0;vec3 schlick = specular + vec3( 1.0 - specular ) * pow( 1.0 - dot( dirVector, dirHalfVector ), 5.0 );totalSpecular += schlick * directionalLightColor[ i ] * dirSpecularWeight * dirDiffuseWeight * specularNormalization;\n#else\ntotalSpecular += specular * directionalLightColor[ i ] * dirSpecularWeight * dirDiffuseWeight;\n#endif\n}\n#endif\n#if MAX_HEMI_LIGHTS > 0\nfor( int i = 0; i < MAX_HEMI_LIGHTS; i ++ ) {vec4 lDirection = viewMatrix * vec4( hemisphereLightDirection[ i ], 0.0 );vec3 lVector = normalize( lDirection.xyz );float dotProduct = dot( normal, lVector );float hemiDiffuseWeight = 0.5 * dotProduct + 0.5;\n#ifdef MMD_TOONMAP\ntotalToon += texture2D( mmdToonMap, vec2( 0.0, 1.0 - hemiDiffuseWeight ) ).xyz;\n#endif\nvec3 hemiColor = mix( hemisphereLightGroundColor[ i ], hemisphereLightSkyColor[ i ], hemiDiffuseWeight );totalDiffuse += diffuse * hemiColor;vec3 hemiHalfVectorSky = normalize( lVector + viewPosition );float hemiDotNormalHalfSky = 0.5 * dot( normal, hemiHalfVectorSky ) + 0.5;float hemiSpecularWeightSky = specularStrength * pow( hemiDotNormalHalfSky, shininess );vec3 lVectorGround = -lVector;vec3 hemiHalfVectorGround = normalize( lVectorGround + viewPosition );float hemiDotNormalHalfGround = 0.5 * dot( normal, hemiHalfVectorGround ) + 0.5;float hemiSpecularWeightGround = specularStrength * pow( hemiDotNormalHalfGround, shininess );\n#ifdef PHYSICALLY_BASED_SHADING\nfloat dotProductGround = dot( normal, lVectorGround );float specularNormalization = ( shininess + 2.0001 ) / 8.0;vec3 schlickSky = specular + vec3( 1.0 - specular ) * pow( 1.0 - dot( lVector, hemiHalfVectorSky ), 5.0 );vec3 schlickGround = specular + vec3( 1.0 - specular ) * pow( 1.0 - dot( lVectorGround, hemiHalfVectorGround ), 5.0 );totalSpecular += hemiColor * specularNormalization * ( schlickSky * hemiSpecularWeightSky * max( dotProduct, 0.0 ) + schlickGround * hemiSpecularWeightGround * max( dotProductGround, 0.0 ) );\n#else\ntotalSpecular += specular * hemiColor * ( hemiSpecularWeightSky + hemiSpecularWeightGround ) * hemiDiffuseWeight;\n#endif\n}\n#endif\n#ifdef MMD\ntotalSpecular = max( totalSpecular, 0.0 );\n#endif\n#ifdef METAL\ngl_FragColor.xyz = gl_FragColor.xyz * ( emissive + totalDiffuse + ambientLightColor * ambient + totalSpecular );\n#else\ngl_FragColor.xyz = gl_FragColor.xyz * ( emissive + totalDiffuse + ambientLightColor * ambient ) + totalSpecular;\n#endif\n#ifdef MMD_TOONMAP\ngl_FragColor.xyz *= totalToon;\n#endif\n#endif\n'

// from mmd.three.js v0.94
//+ '#ifdef ALPHATEST\nif ( gl_FragColor.a < ALPHATEST ) discard;\n#endif\nfloat specularStrength;\n#ifdef USE_SPECULARMAP\nvec4 texelSpecular = texture2D( specularMap, vUv );specularStrength = texelSpecular.r;\n#else\nspecularStrength = 1.0;\n#endif\nvec3 normal = vNormal;vec3 viewPosition = normalize( vViewPosition );\n#ifdef DOUBLE_SIDED\nnormal = normal * ( -1.0 + 2.0 * float( gl_FrontFacing ) );\n#endif\n#ifdef USE_NORMALMAP\nnormal = perturbNormal2Arb( -vViewPosition, normal );\n#elif defined( USE_BUMPMAP )\nnormal = perturbNormalArb( -vViewPosition, normal, dHdxy_fwd() );\n#endif\nvec3 totalDiffuse = vec3( 0.0 );vec3 totalSpecular = vec3( 0.0 );\n#ifdef MMD\nvec3 totalToon = vec3( 0.0 );\n#endif\n#if MAX_POINT_LIGHTS > 0\nfor ( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {\n#ifdef PHONG_PER_PIXEL\nvec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );vec3 lVector = lPosition.xyz + vViewPosition.xyz;float lDistance = 1.0;if ( pointLightDistance[ i ] > 0.0 )lDistance = 1.0 - min( ( length( lVector ) / pointLightDistance[ i ] ), 1.0 );lVector = normalize( lVector );\n#else\nvec3 lVector = normalize( vPointLight[ i ].xyz );float lDistance = vPointLight[ i ].w;\n#endif\nfloat dotProduct = dot( normal, lVector );\n#ifdef WRAP_AROUND\nfloat pointDiffuseWeightFull = max( dotProduct, 0.0 );float pointDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );vec3 pointDiffuseWeight = mix( vec3 ( pointDiffuseWeightFull ), vec3( pointDiffuseWeightHalf ), wrapRGB );\n#else\nfloat pointDiffuseWeight = max( dotProduct, 0.0 );\n#endif\n#ifdef MMD\n#ifdef MMD_TOONMAP\ntotalToon += texture2D( mmdToonMap, vec2( 0.0, 1.0 - ( 0.5 * dotProduct + 0.5 ) ) ).xyz;\n#else\ntotalToon += vec3( 1.0 );\n#endif\ntotalDiffuse  += diffuse * pointLightColor[ i ] * lDistance;\n#else\ntotalDiffuse  += diffuse * pointLightColor[ i ] * pointDiffuseWeight * lDistance;\n#endif\nvec3 pointHalfVector = normalize( lVector + viewPosition );float pointDotNormalHalf = max( dot( normal, pointHalfVector ), 0.0 );float pointSpecularWeight = specularStrength * pow( pointDotNormalHalf, shininess );\n#ifdef PHYSICALLY_BASED_SHADING\nfloat specularNormalization = ( shininess + 2.0001 ) / 8.0;vec3 schlick = specular + vec3( 1.0 - specular ) * pow( 1.0 - dot( lVector, pointHalfVector ), 5.0 );totalSpecular += schlick * pointLightColor[ i ] * pointSpecularWeight * pointDiffuseWeight * lDistance * specularNormalization;\n#else\ntotalSpecular += specular * pointLightColor[ i ] * pointSpecularWeight * pointDiffuseWeight * lDistance;\n#endif\n}\n#endif\n#if MAX_SPOT_LIGHTS > 0\nfor ( int i = 0; i < MAX_SPOT_LIGHTS; i ++ ) {\n#ifdef PHONG_PER_PIXEL\nvec4 lPosition = viewMatrix * vec4( spotLightPosition[ i ], 1.0 );vec3 lVector = lPosition.xyz + vViewPosition.xyz;float lDistance = 1.0;if ( spotLightDistance[ i ] > 0.0 )lDistance = 1.0 - min( ( length( lVector ) / spotLightDistance[ i ] ), 1.0 );lVector = normalize( lVector );\n#else\nvec3 lVector = normalize( vSpotLight[ i ].xyz );float lDistance = vSpotLight[ i ].w;\n#endif\nfloat spotEffect = dot( spotLightDirection[ i ], normalize( spotLightPosition[ i ] - vWorldPosition ) );if ( spotEffect > spotLightAngleCos[ i ] ) {spotEffect = max( pow( spotEffect, spotLightExponent[ i ] ), 0.0 );float dotProduct = dot( normal, lVector );\n#ifdef WRAP_AROUND\nfloat spotDiffuseWeightFull = max( dotProduct, 0.0 );float spotDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );vec3 spotDiffuseWeight = mix( vec3 ( spotDiffuseWeightFull ), vec3( spotDiffuseWeightHalf ), wrapRGB );\n#else\nfloat spotDiffuseWeight = max( dotProduct, 0.0 );\n#endif\n#ifdef MMD\n#ifdef MMD_TOONMAP\ntotalToon += texture2D( mmdToonMap, vec2( 0.0, 1.0 - ( 0.5 * dotProduct + 0.5 ) ) ).xyz;\n#else\ntotalToon += vec3( 1.0 );\n#endif\ntotalDiffuse += diffuse * spotLightColor[ i ] * lDistance * spotEffect;\n#else\ntotalDiffuse += diffuse * spotLightColor[ i ] * spotDiffuseWeight * lDistance * spotEffect;\n#endif\nvec3 spotHalfVector = normalize( lVector + viewPosition );float spotDotNormalHalf = max( dot( normal, spotHalfVector ), 0.0 );float spotSpecularWeight = specularStrength * pow( spotDotNormalHalf, shininess );\n#ifdef PHYSICALLY_BASED_SHADING\nfloat specularNormalization = ( shininess + 2.0001 ) / 8.0;vec3 schlick = specular + vec3( 1.0 - specular ) * pow( 1.0 - dot( lVector, spotHalfVector ), 5.0 );totalSpecular += schlick * spotLightColor[ i ] * spotSpecularWeight * spotDiffuseWeight * lDistance * specularNormalization * spotEffect;\n#else\ntotalSpecular += specular * spotLightColor[ i ] * spotSpecularWeight * spotDiffuseWeight * lDistance * spotEffect;\n#endif\n}}\n#endif\n#if MAX_DIR_LIGHTS > 0\nfor( int i = 0; i < MAX_DIR_LIGHTS; i ++ ) {vec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );vec3 dirVector = normalize( lDirection.xyz );float dotProduct = dot( normal, dirVector );\n#ifdef WRAP_AROUND\nfloat dirDiffuseWeightFull = max( dotProduct, 0.0 );float dirDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );vec3 dirDiffuseWeight = mix( vec3( dirDiffuseWeightFull ), vec3( dirDiffuseWeightHalf ), wrapRGB );\n#else\nfloat dirDiffuseWeight = max( dotProduct, 0.0 );\n#endif\n#ifdef MMD\n#ifdef MMD_TOONMAP\ntotalToon += texture2D( mmdToonMap, vec2( 0.0, 1.0 - ( 0.5 * dotProduct + 0.5 ) ) ).xyz;\n#else\ntotalToon += vec3( 1.0 );\n#endif\ntotalDiffuse += diffuse * directionalLightColor[ i ];\n#else\ntotalDiffuse += diffuse * directionalLightColor[ i ] * dirDiffuseWeight;\n#endif\nvec3 dirHalfVector = normalize( dirVector + viewPosition );float dirDotNormalHalf = max( dot( normal, dirHalfVector ), 0.0 );float dirSpecularWeight = specularStrength * pow( dirDotNormalHalf, shininess );\n#ifdef PHYSICALLY_BASED_SHADING\nfloat specularNormalization = ( shininess + 2.0001 ) / 8.0;vec3 schlick = specular + vec3( 1.0 - specular ) * pow( 1.0 - dot( dirVector, dirHalfVector ), 5.0 );totalSpecular += schlick * directionalLightColor[ i ] * dirSpecularWeight * dirDiffuseWeight * specularNormalization;\n#else\ntotalSpecular += specular * directionalLightColor[ i ] * dirSpecularWeight * dirDiffuseWeight;\n#endif\n}\n#endif\n#if MAX_HEMI_LIGHTS > 0\nfor( int i = 0; i < MAX_HEMI_LIGHTS; i ++ ) {vec4 lDirection = viewMatrix * vec4( hemisphereLightDirection[ i ], 0.0 );vec3 lVector = normalize( lDirection.xyz );float dotProduct = dot( normal, lVector );float hemiDiffuseWeight = 0.5 * dotProduct + 0.5;\n#ifdef MMD\n#ifdef MMD_TOONMAP\ntotalToon += texture2D( mmdToonMap, vec2( 0.0, 1.0 - hemiDiffuseWeight ) ).xyz;\n#else\ntotalToon += vec3( 1.0 );\n#endif\n#endif\nvec3 hemiColor = mix( hemisphereLightGroundColor[ i ], hemisphereLightSkyColor[ i ], hemiDiffuseWeight );totalDiffuse += diffuse * hemiColor;vec3 hemiHalfVectorSky = normalize( lVector + viewPosition );float hemiDotNormalHalfSky = 0.5 * dot( normal, hemiHalfVectorSky ) + 0.5;float hemiSpecularWeightSky = specularStrength * pow( hemiDotNormalHalfSky, shininess );vec3 lVectorGround = -lVector;vec3 hemiHalfVectorGround = normalize( lVectorGround + viewPosition );float hemiDotNormalHalfGround = 0.5 * dot( normal, hemiHalfVectorGround ) + 0.5;float hemiSpecularWeightGround = specularStrength * pow( hemiDotNormalHalfGround, shininess );\n#ifdef PHYSICALLY_BASED_SHADING\nfloat dotProductGround = dot( normal, lVectorGround );float specularNormalization = ( shininess + 2.0001 ) / 8.0;vec3 schlickSky = specular + vec3( 1.0 - specular ) * pow( 1.0 - dot( lVector, hemiHalfVectorSky ), 5.0 );vec3 schlickGround = specular + vec3( 1.0 - specular ) * pow( 1.0 - dot( lVectorGround, hemiHalfVectorGround ), 5.0 );totalSpecular += hemiColor * specularNormalization * ( schlickSky * hemiSpecularWeightSky * max( dotProduct, 0.0 ) + schlickGround * hemiSpecularWeightGround * max( dotProductGround, 0.0 ) );\n#else\ntotalSpecular += specular * hemiColor * ( hemiSpecularWeightSky + hemiSpecularWeightGround ) * hemiDiffuseWeight;\n#endif\n}\n#endif\n#ifdef MMD\ntotalSpecular = max( totalSpecular, 0.0 );\n#endif\n#ifdef METAL\ngl_FragColor.xyz = gl_FragColor.xyz * ( emissive + totalDiffuse + ambientLightColor * ambient + totalSpecular );\n#else\ngl_FragColor.xyz = gl_FragColor.xyz * ( emissive + totalDiffuse + ambientLightColor * ambient ) + totalSpecular;\n#endif\n#ifdef MMD_TOONMAP\ngl_FragColor.xyz *= totalToon;\n#endif\n'


// original
//+ '#ifdef ALPHATEST\nif ( gl_FragColor.a < ALPHATEST ) discard;\n#endif\n#ifdef MMD_TOONMAP\nfloat specularStrength;\n#ifdef USE_SPECULARMAP\nvec4 texelSpecular = texture2D( specularMap, vUv );specularStrength = texelSpecular.r;\n#else\nspecularStrength = 1.0;\n#endif\nvec3 normal = vNormal;vec3 viewPosition = normalize( vViewPosition );\n#ifdef DOUBLE_SIDED\nnormal = normal * ( -1.0 + 2.0 * float( gl_FrontFacing ) );\n#endif\n#ifdef USE_NORMALMAP\nnormal = perturbNormal2Arb( -vViewPosition, normal );\n#elif defined( USE_BUMPMAP )\nnormal = perturbNormalArb( -vViewPosition, normal, dHdxy_fwd() );\n#endif\nvec3 totalDiffuse = vec3( 0.0 );vec3 totalSpecular = vec3( 0.0 );\n#ifdef MMD_TOONMAP\nvec3 totalToon = vec3( 0.0 );\n#endif\n#if MAX_POINT_LIGHTS > 0\nfor ( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {\n#ifdef PHONG_PER_PIXEL\nvec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );vec3 lVector = lPosition.xyz + vViewPosition.xyz;float lDistance = 1.0;if ( pointLightDistance[ i ] > 0.0 )lDistance = 1.0 - min( ( length( lVector ) / pointLightDistance[ i ] ), 1.0 );lVector = normalize( lVector );\n#else\nvec3 lVector = normalize( vPointLight[ i ].xyz );float lDistance = vPointLight[ i ].w;\n#endif\nfloat dotProduct = dot( normal, lVector );\n#ifdef WRAP_AROUND\nfloat pointDiffuseWeightFull = max( dotProduct, 0.0 );float pointDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );vec3 pointDiffuseWeight = mix( vec3 ( pointDiffuseWeightFull ), vec3( pointDiffuseWeightHalf ), wrapRGB );\n#else\nfloat pointDiffuseWeight = max( dotProduct, 0.0 );\n#endif\n#ifdef MMD_TOONMAP\ntotalToon += texture2D( mmdToonMap, vec2( 0.0, 1.0 - ( 0.5 * dotProduct + 0.5 ) ) ).xyz;totalDiffuse  += diffuse * pointLightColor[ i ] * lDistance;\n#else\ntotalDiffuse  += diffuse * pointLightColor[ i ] * pointDiffuseWeight * lDistance;\n#endif\nvec3 pointHalfVector = normalize( lVector + viewPosition );float pointDotNormalHalf = max( dot( normal, pointHalfVector ), 0.0 );float pointSpecularWeight = specularStrength * pow( pointDotNormalHalf, shininess );\n#ifdef PHYSICALLY_BASED_SHADING\nfloat specularNormalization = ( shininess + 2.0001 ) / 8.0;vec3 schlick = specular + vec3( 1.0 - specular ) * pow( 1.0 - dot( lVector, pointHalfVector ), 5.0 );totalSpecular += schlick * pointLightColor[ i ] * pointSpecularWeight * pointDiffuseWeight * lDistance * specularNormalization;\n#else\ntotalSpecular += specular * pointLightColor[ i ] * pointSpecularWeight * pointDiffuseWeight * lDistance;\n#endif\n}\n#endif\n#if MAX_SPOT_LIGHTS > 0\nfor ( int i = 0; i < MAX_SPOT_LIGHTS; i ++ ) {\n#ifdef PHONG_PER_PIXEL\nvec4 lPosition = viewMatrix * vec4( spotLightPosition[ i ], 1.0 );vec3 lVector = lPosition.xyz + vViewPosition.xyz;float lDistance = 1.0;if ( spotLightDistance[ i ] > 0.0 )lDistance = 1.0 - min( ( length( lVector ) / spotLightDistance[ i ] ), 1.0 );lVector = normalize( lVector );\n#else\nvec3 lVector = normalize( vSpotLight[ i ].xyz );float lDistance = vSpotLight[ i ].w;\n#endif\nfloat spotEffect = dot( spotLightDirection[ i ], normalize( spotLightPosition[ i ] - vWorldPosition ) );if ( spotEffect > spotLightAngleCos[ i ] ) {spotEffect = max( pow( spotEffect, spotLightExponent[ i ] ), 0.0 );float dotProduct = dot( normal, lVector );\n#ifdef WRAP_AROUND\nfloat spotDiffuseWeightFull = max( dotProduct, 0.0 );float spotDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );vec3 spotDiffuseWeight = mix( vec3 ( spotDiffuseWeightFull ), vec3( spotDiffuseWeightHalf ), wrapRGB );\n#else\nfloat spotDiffuseWeight = max( dotProduct, 0.0 );\n#endif\n#ifdef MMD_TOONMAP\ntotalToon += texture2D( mmdToonMap, vec2( 0.0, 1.0 - ( 0.5 * dotProduct + 0.5 ) ) ).xyz;totalDiffuse += diffuse * spotLightColor[ i ] * lDistance * spotEffect;\n#else\ntotalDiffuse += diffuse * spotLightColor[ i ] * spotDiffuseWeight * lDistance * spotEffect;\n#endif\nvec3 spotHalfVector = normalize( lVector + viewPosition );float spotDotNormalHalf = max( dot( normal, spotHalfVector ), 0.0 );float spotSpecularWeight = specularStrength * pow( spotDotNormalHalf, shininess );\n#ifdef PHYSICALLY_BASED_SHADING\nfloat specularNormalization = ( shininess + 2.0001 ) / 8.0;vec3 schlick = specular + vec3( 1.0 - specular ) * pow( 1.0 - dot( lVector, spotHalfVector ), 5.0 );totalSpecular += schlick * spotLightColor[ i ] * spotSpecularWeight * spotDiffuseWeight * lDistance * specularNormalization * spotEffect;\n#else\ntotalSpecular += specular * spotLightColor[ i ] * spotSpecularWeight * spotDiffuseWeight * lDistance * spotEffect;\n#endif\n}}\n#endif\n#if MAX_DIR_LIGHTS > 0\nfor( int i = 0; i < MAX_DIR_LIGHTS; i ++ ) {vec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );vec3 dirVector = normalize( lDirection.xyz );'
//+ 'float dotProduct = dot( normal, dirVector );\n'

// from mmd.three.js v0.94
//+ '#ifdef ALPHATEST\nif ( gl_FragColor.a < ALPHATEST ) discard;\n#endif\nfloat specularStrength;\n#ifdef USE_SPECULARMAP\nvec4 texelSpecular = texture2D( specularMap, vUv );specularStrength = texelSpecular.r;\n#else\nspecularStrength = 1.0;\n#endif\nvec3 normal = vNormal;vec3 viewPosition = normalize( vViewPosition );\n#ifdef DOUBLE_SIDED\nnormal = normal * ( -1.0 + 2.0 * float( gl_FrontFacing ) );\n#endif\n#ifdef USE_NORMALMAP\nnormal = perturbNormal2Arb( -vViewPosition, normal );\n#elif defined( USE_BUMPMAP )\nnormal = perturbNormalArb( -vViewPosition, normal, dHdxy_fwd() );\n#endif\nvec3 totalDiffuse = vec3( 0.0 );vec3 totalSpecular = vec3( 0.0 );\n#ifdef MMD\nvec3 totalToon = vec3( 0.0 );\n#endif\n#if MAX_POINT_LIGHTS > 0\nfor ( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {\n#ifdef PHONG_PER_PIXEL\nvec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );vec3 lVector = lPosition.xyz + vViewPosition.xyz;float lDistance = 1.0;if ( pointLightDistance[ i ] > 0.0 )lDistance = 1.0 - min( ( length( lVector ) / pointLightDistance[ i ] ), 1.0 );lVector = normalize( lVector );\n#else\nvec3 lVector = normalize( vPointLight[ i ].xyz );float lDistance = vPointLight[ i ].w;\n#endif\nfloat dotProduct = dot( normal, lVector );\n#ifdef WRAP_AROUND\nfloat pointDiffuseWeightFull = max( dotProduct, 0.0 );float pointDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );vec3 pointDiffuseWeight = mix( vec3 ( pointDiffuseWeightFull ), vec3( pointDiffuseWeightHalf ), wrapRGB );\n#else\nfloat pointDiffuseWeight = max( dotProduct, 0.0 );\n#endif\n#ifdef MMD\n#ifdef MMD_TOONMAP\ntotalToon += texture2D( mmdToonMap, vec2( 0.0, 1.0 - ( 0.5 * dotProduct + 0.5 ) ) ).xyz;\n#else\ntotalToon += vec3( 1.0 );\n#endif\ntotalDiffuse  += diffuse * pointLightColor[ i ] * lDistance;\n#else\ntotalDiffuse  += diffuse * pointLightColor[ i ] * pointDiffuseWeight * lDistance;\n#endif\nvec3 pointHalfVector = normalize( lVector + viewPosition );float pointDotNormalHalf = max( dot( normal, pointHalfVector ), 0.0 );float pointSpecularWeight = specularStrength * pow( pointDotNormalHalf, shininess );\n#ifdef PHYSICALLY_BASED_SHADING\nfloat specularNormalization = ( shininess + 2.0001 ) / 8.0;vec3 schlick = specular + vec3( 1.0 - specular ) * pow( 1.0 - dot( lVector, pointHalfVector ), 5.0 );totalSpecular += schlick * pointLightColor[ i ] * pointSpecularWeight * pointDiffuseWeight * lDistance * specularNormalization;\n#else\ntotalSpecular += specular * pointLightColor[ i ] * pointSpecularWeight * pointDiffuseWeight * lDistance;\n#endif\n}\n#endif\n#if MAX_SPOT_LIGHTS > 0\nfor ( int i = 0; i < MAX_SPOT_LIGHTS; i ++ ) {\n#ifdef PHONG_PER_PIXEL\nvec4 lPosition = viewMatrix * vec4( spotLightPosition[ i ], 1.0 );vec3 lVector = lPosition.xyz + vViewPosition.xyz;float lDistance = 1.0;if ( spotLightDistance[ i ] > 0.0 )lDistance = 1.0 - min( ( length( lVector ) / spotLightDistance[ i ] ), 1.0 );lVector = normalize( lVector );\n#else\nvec3 lVector = normalize( vSpotLight[ i ].xyz );float lDistance = vSpotLight[ i ].w;\n#endif\nfloat spotEffect = dot( spotLightDirection[ i ], normalize( spotLightPosition[ i ] - vWorldPosition ) );if ( spotEffect > spotLightAngleCos[ i ] ) {spotEffect = max( pow( spotEffect, spotLightExponent[ i ] ), 0.0 );float dotProduct = dot( normal, lVector );\n#ifdef WRAP_AROUND\nfloat spotDiffuseWeightFull = max( dotProduct, 0.0 );float spotDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );vec3 spotDiffuseWeight = mix( vec3 ( spotDiffuseWeightFull ), vec3( spotDiffuseWeightHalf ), wrapRGB );\n#else\nfloat spotDiffuseWeight = max( dotProduct, 0.0 );\n#endif\n#ifdef MMD\n#ifdef MMD_TOONMAP\ntotalToon += texture2D( mmdToonMap, vec2( 0.0, 1.0 - ( 0.5 * dotProduct + 0.5 ) ) ).xyz;\n#else\ntotalToon += vec3( 1.0 );\n#endif\ntotalDiffuse += diffuse * spotLightColor[ i ] * lDistance * spotEffect;\n#else\ntotalDiffuse += diffuse * spotLightColor[ i ] * spotDiffuseWeight * lDistance * spotEffect;\n#endif\nvec3 spotHalfVector = normalize( lVector + viewPosition );float spotDotNormalHalf = max( dot( normal, spotHalfVector ), 0.0 );float spotSpecularWeight = specularStrength * pow( spotDotNormalHalf, shininess );\n#ifdef PHYSICALLY_BASED_SHADING\nfloat specularNormalization = ( shininess + 2.0001 ) / 8.0;vec3 schlick = specular + vec3( 1.0 - specular ) * pow( 1.0 - dot( lVector, spotHalfVector ), 5.0 );totalSpecular += schlick * spotLightColor[ i ] * spotSpecularWeight * spotDiffuseWeight * lDistance * specularNormalization * spotEffect;\n#else\ntotalSpecular += specular * spotLightColor[ i ] * spotSpecularWeight * spotDiffuseWeight * lDistance * spotEffect;\n#endif\n}}\n#endif\n#if MAX_DIR_LIGHTS > 0\nfor( int i = 0; i < MAX_DIR_LIGHTS; i ++ ) {vec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );vec3 dirVector = normalize( lDirection.xyz );'
+ '#ifdef ALPHATEST\nif ( gl_FragColor.a < ALPHATEST ) discard;\n#endif\nfloat specularStrength;\n#ifdef USE_SPECULARMAP\nvec4 texelSpecular = texture2D( specularMap, vUv );specularStrength = texelSpecular.r;\n#else\nspecularStrength = 1.0;\n#endif\nvec3 normal = vNormal;vec3 viewPosition = normalize( vViewPosition );\n#ifdef DOUBLE_SIDED\nnormal = normal * ( -1.0 + 2.0 * float( gl_FrontFacing ) );\n#endif\n#ifdef USE_NORMALMAP\nnormal = perturbNormal2Arb( -vViewPosition, normal );\n#elif defined( USE_BUMPMAP )\nnormal = perturbNormalArb( -vViewPosition, normal, dHdxy_fwd() );\n#endif\nvec3 totalDiffuse = vec3( 0.0 );vec3 totalSpecular = vec3( 0.0 );\n#ifdef MMD\nvec3 totalToon = vec3( 0.0 );\n#endif\n#if MAX_POINT_LIGHTS > 0\nfor ( int i = 0; i < MAX_POINT_LIGHTS; i ++ ) {\n#ifdef PHONG_PER_PIXEL\nvec4 lPosition = viewMatrix * vec4( pointLightPosition[ i ], 1.0 );vec3 lVector = lPosition.xyz + vViewPosition.xyz;float lDistance = 1.0;if ( pointLightDistance[ i ] > 0.0 )lDistance = 1.0 - min( ( length( lVector ) / pointLightDistance[ i ] ), 1.0 );lVector = normalize( lVector );\n#else\nvec3 lVector = normalize( vPointLight[ i ].xyz );float lDistance = vPointLight[ i ].w;\n#endif\nfloat dotProduct = dot( normal, lVector );\n#ifdef WRAP_AROUND\nfloat pointDiffuseWeightFull = max( dotProduct, 0.0 );float pointDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );vec3 pointDiffuseWeight = mix( vec3 ( pointDiffuseWeightFull ), vec3( pointDiffuseWeightHalf ), wrapRGB );\n#else\nfloat pointDiffuseWeight = max( dotProduct, 0.0 );\n#endif\n#ifdef MMD\n#ifdef MMD_TOONMAP\ntotalToon += (1.0 - totalToon) * texture2D( mmdToonMap, vec2( 0.0, 1.0 - ( 0.5 * dotProduct + 0.5 ) ) ).xyz;\n#else\ntotalToon += (1.0 - totalToon) * vec3( 1.0 );\n#endif\ntotalDiffuse += (1.0 - totalDiffuse) * diffuse * pointLightColor[ i ] * lDistance;\n#else\ntotalDiffuse += (1.0 - totalDiffuse) * diffuse * pointLightColor[ i ] * pointDiffuseWeight * lDistance;\n#endif\nvec3 pointHalfVector = normalize( lVector + viewPosition );float pointDotNormalHalf = max( dot( normal, pointHalfVector ), 0.0 );float pointSpecularWeight = specularStrength * pow( pointDotNormalHalf, shininess );\n#ifdef PHYSICALLY_BASED_SHADING\nfloat specularNormalization = ( shininess + 2.0001 ) / 8.0;vec3 schlick = specular + vec3( 1.0 - specular ) * pow( 1.0 - dot( lVector, pointHalfVector ), 5.0 );totalSpecular += schlick * pointLightColor[ i ] * pointSpecularWeight * pointDiffuseWeight * lDistance * specularNormalization;\n#else\ntotalSpecular += specular * pointLightColor[ i ] * pointSpecularWeight * pointDiffuseWeight * lDistance;\n#endif\n}\n#endif\n#if MAX_SPOT_LIGHTS > 0\nfor ( int i = 0; i < MAX_SPOT_LIGHTS; i ++ ) {\n#ifdef PHONG_PER_PIXEL\nvec4 lPosition = viewMatrix * vec4( spotLightPosition[ i ], 1.0 );vec3 lVector = lPosition.xyz + vViewPosition.xyz;float lDistance = 1.0;if ( spotLightDistance[ i ] > 0.0 )lDistance = 1.0 - min( ( length( lVector ) / spotLightDistance[ i ] ), 1.0 );lVector = normalize( lVector );\n#else\nvec3 lVector = normalize( vSpotLight[ i ].xyz );float lDistance = vSpotLight[ i ].w;\n#endif\nfloat spotEffect = dot( spotLightDirection[ i ], normalize( spotLightPosition[ i ] - vWorldPosition ) );if ( spotEffect > spotLightAngleCos[ i ] ) {spotEffect = max( pow( spotEffect, spotLightExponent[ i ] ), 0.0 );float dotProduct = dot( normal, lVector );\n#ifdef WRAP_AROUND\nfloat spotDiffuseWeightFull = max( dotProduct, 0.0 );float spotDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );vec3 spotDiffuseWeight = mix( vec3 ( spotDiffuseWeightFull ), vec3( spotDiffuseWeightHalf ), wrapRGB );\n#else\nfloat spotDiffuseWeight = max( dotProduct, 0.0 );\n#endif\n#ifdef MMD\n#ifdef MMD_TOONMAP\ntotalToon += (1.0 - totalToon) * texture2D( mmdToonMap, vec2( 0.0, 1.0 - ( 0.5 * dotProduct + 0.5 ) ) ).xyz;\n#else\ntotalToon += (1.0 - totalToon) * vec3( 1.0 );\n#endif\ntotalDiffuse += (1.0 - totalDiffuse) * diffuse * spotLightColor[ i ] * lDistance * spotEffect;\n#else\ntotalDiffuse += (1.0 - totalDiffuse) * diffuse * spotLightColor[ i ] * spotDiffuseWeight * lDistance * spotEffect;\n#endif\nvec3 spotHalfVector = normalize( lVector + viewPosition );float spotDotNormalHalf = max( dot( normal, spotHalfVector ), 0.0 );float spotSpecularWeight = specularStrength * pow( spotDotNormalHalf, shininess );\n#ifdef PHYSICALLY_BASED_SHADING\nfloat specularNormalization = ( shininess + 2.0001 ) / 8.0;vec3 schlick = specular + vec3( 1.0 - specular ) * pow( 1.0 - dot( lVector, spotHalfVector ), 5.0 );totalSpecular += schlick * spotLightColor[ i ] * spotSpecularWeight * spotDiffuseWeight * lDistance * specularNormalization * spotEffect;\n#else\ntotalSpecular += specular * spotLightColor[ i ] * spotSpecularWeight * spotDiffuseWeight * lDistance * spotEffect;\n#endif\n}}\n#endif\n#if MAX_DIR_LIGHTS > 0\nfor( int i = 0; i < MAX_DIR_LIGHTS; i ++ ) {vec4 lDirection = viewMatrix * vec4( directionalLightDirection[ i ], 0.0 );vec3 dirVector = normalize( lDirection.xyz );'

+ 'float dotProduct = dot( normal, dirVector );\n'


// Serious Shader
// DIR_LIGHT support only, for now
+ MMD_SA.MME_shader_branch("SERIOUS_SHADER", true)
+ 'comp_list[i] = dotProduct;\n'
+ MMD_SA.MME_shader_branch("SERIOUS_SHADER", false)


// original
//+ '#ifdef WRAP_AROUND\nfloat dirDiffuseWeightFull = max( dotProduct, 0.0 );float dirDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );vec3 dirDiffuseWeight = mix( vec3( dirDiffuseWeightFull ), vec3( dirDiffuseWeightHalf ), wrapRGB );\n#else\nfloat dirDiffuseWeight = max( dotProduct, 0.0 );\n#endif\n#ifdef MMD_TOONMAP\ntotalToon += texture2D( mmdToonMap, vec2( 0.0, 1.0 - ( 0.5 * dotProduct + 0.5 ) ) ).xyz;totalDiffuse += diffuse * directionalLightColor[ i ];\n#else\ntotalDiffuse += diffuse * directionalLightColor[ i ] * dirDiffuseWeight;\n#endif\nvec3 dirHalfVector = normalize( dirVector + viewPosition );float dirDotNormalHalf = max( dot( normal, dirHalfVector ), 0.0 );float dirSpecularWeight = specularStrength * pow( dirDotNormalHalf, shininess );\n#ifdef PHYSICALLY_BASED_SHADING\nfloat specularNormalization = ( shininess + 2.0001 ) / 8.0;vec3 schlick = specular + vec3( 1.0 - specular ) * pow( 1.0 - dot( dirVector, dirHalfVector ), 5.0 );totalSpecular += schlick * directionalLightColor[ i ] * dirSpecularWeight * dirDiffuseWeight * specularNormalization;\n#else\ntotalSpecular += specular * directionalLightColor[ i ] * dirSpecularWeight * dirDiffuseWeight;\n#endif\n}\n#endif\n#if MAX_HEMI_LIGHTS > 0\nfor( int i = 0; i < MAX_HEMI_LIGHTS; i ++ ) {vec4 lDirection = viewMatrix * vec4( hemisphereLightDirection[ i ], 0.0 );vec3 lVector = normalize( lDirection.xyz );float dotProduct = dot( normal, lVector );float hemiDiffuseWeight = 0.5 * dotProduct + 0.5;\n#ifdef MMD_TOONMAP\ntotalToon += texture2D( mmdToonMap, vec2( 0.0, 1.0 - hemiDiffuseWeight ) ).xyz;\n#endif\nvec3 hemiColor = mix( hemisphereLightGroundColor[ i ], hemisphereLightSkyColor[ i ], hemiDiffuseWeight );totalDiffuse += diffuse * hemiColor;vec3 hemiHalfVectorSky = normalize( lVector + viewPosition );float hemiDotNormalHalfSky = 0.5 * dot( normal, hemiHalfVectorSky ) + 0.5;float hemiSpecularWeightSky = specularStrength * pow( hemiDotNormalHalfSky, shininess );vec3 lVectorGround = -lVector;vec3 hemiHalfVectorGround = normalize( lVectorGround + viewPosition );float hemiDotNormalHalfGround = 0.5 * dot( normal, hemiHalfVectorGround ) + 0.5;float hemiSpecularWeightGround = specularStrength * pow( hemiDotNormalHalfGround, shininess );\n#ifdef PHYSICALLY_BASED_SHADING\nfloat dotProductGround = dot( normal, lVectorGround );float specularNormalization = ( shininess + 2.0001 ) / 8.0;vec3 schlickSky = specular + vec3( 1.0 - specular ) * pow( 1.0 - dot( lVector, hemiHalfVectorSky ), 5.0 );vec3 schlickGround = specular + vec3( 1.0 - specular ) * pow( 1.0 - dot( lVectorGround, hemiHalfVectorGround ), 5.0 );totalSpecular += hemiColor * specularNormalization * ( schlickSky * hemiSpecularWeightSky * max( dotProduct, 0.0 ) + schlickGround * hemiSpecularWeightGround * max( dotProductGround, 0.0 ) );\n#else\ntotalSpecular += specular * hemiColor * ( hemiSpecularWeightSky + hemiSpecularWeightGround ) * hemiDiffuseWeight;\n#endif\n}\n#endif\n#ifdef MMD\ntotalSpecular = max( totalSpecular, 0.0 );\n#endif\n'

// from mmd.three.js v0.94
//+ '#ifdef WRAP_AROUND\nfloat dirDiffuseWeightFull = max( dotProduct, 0.0 );float dirDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );vec3 dirDiffuseWeight = mix( vec3( dirDiffuseWeightFull ), vec3( dirDiffuseWeightHalf ), wrapRGB );\n#else\nfloat dirDiffuseWeight = max( dotProduct, 0.0 );\n#endif\n#ifdef MMD\n#ifdef MMD_TOONMAP\ntotalToon += texture2D( mmdToonMap, vec2( 0.0, 1.0 - ( 0.5 * dotProduct + 0.5 ) ) ).xyz;\n#else\ntotalToon += vec3( 1.0 );\n#endif\ntotalDiffuse += diffuse * directionalLightColor[ i ];\n#else\ntotalDiffuse += diffuse * directionalLightColor[ i ] * dirDiffuseWeight;\n#endif\nvec3 dirHalfVector = normalize( dirVector + viewPosition );float dirDotNormalHalf = max( dot( normal, dirHalfVector ), 0.0 );float dirSpecularWeight = specularStrength * pow( dirDotNormalHalf, shininess );\n#ifdef PHYSICALLY_BASED_SHADING\nfloat specularNormalization = ( shininess + 2.0001 ) / 8.0;vec3 schlick = specular + vec3( 1.0 - specular ) * pow( 1.0 - dot( dirVector, dirHalfVector ), 5.0 );totalSpecular += schlick * directionalLightColor[ i ] * dirSpecularWeight * dirDiffuseWeight * specularNormalization;\n#else\ntotalSpecular += specular * directionalLightColor[ i ] * dirSpecularWeight * dirDiffuseWeight;\n#endif\n}\n#endif\n#if MAX_HEMI_LIGHTS > 0\nfor( int i = 0; i < MAX_HEMI_LIGHTS; i ++ ) {vec4 lDirection = viewMatrix * vec4( hemisphereLightDirection[ i ], 0.0 );vec3 lVector = normalize( lDirection.xyz );float dotProduct = dot( normal, lVector );float hemiDiffuseWeight = 0.5 * dotProduct + 0.5;\n#ifdef MMD\n#ifdef MMD_TOONMAP\ntotalToon += texture2D( mmdToonMap, vec2( 0.0, 1.0 - hemiDiffuseWeight ) ).xyz;\n#else\ntotalToon += vec3( 1.0 );\n#endif\n#endif\nvec3 hemiColor = mix( hemisphereLightGroundColor[ i ], hemisphereLightSkyColor[ i ], hemiDiffuseWeight );totalDiffuse += diffuse * hemiColor;vec3 hemiHalfVectorSky = normalize( lVector + viewPosition );float hemiDotNormalHalfSky = 0.5 * dot( normal, hemiHalfVectorSky ) + 0.5;float hemiSpecularWeightSky = specularStrength * pow( hemiDotNormalHalfSky, shininess );vec3 lVectorGround = -lVector;vec3 hemiHalfVectorGround = normalize( lVectorGround + viewPosition );float hemiDotNormalHalfGround = 0.5 * dot( normal, hemiHalfVectorGround ) + 0.5;float hemiSpecularWeightGround = specularStrength * pow( hemiDotNormalHalfGround, shininess );\n#ifdef PHYSICALLY_BASED_SHADING\nfloat dotProductGround = dot( normal, lVectorGround );float specularNormalization = ( shininess + 2.0001 ) / 8.0;vec3 schlickSky = specular + vec3( 1.0 - specular ) * pow( 1.0 - dot( lVector, hemiHalfVectorSky ), 5.0 );vec3 schlickGround = specular + vec3( 1.0 - specular ) * pow( 1.0 - dot( lVectorGround, hemiHalfVectorGround ), 5.0 );totalSpecular += hemiColor * specularNormalization * ( schlickSky * hemiSpecularWeightSky * max( dotProduct, 0.0 ) + schlickGround * hemiSpecularWeightGround * max( dotProductGround, 0.0 ) );\n#else\ntotalSpecular += specular * hemiColor * ( hemiSpecularWeightSky + hemiSpecularWeightGround ) * hemiDiffuseWeight;\n#endif\n}\n#endif\n#ifdef MMD\ntotalSpecular = max( totalSpecular, 0.0 );\n#endif\n'
+ '#ifdef WRAP_AROUND\nfloat dirDiffuseWeightFull = max( dotProduct, 0.0 );float dirDiffuseWeightHalf = max( 0.5 * dotProduct + 0.5, 0.0 );vec3 dirDiffuseWeight = mix( vec3( dirDiffuseWeightFull ), vec3( dirDiffuseWeightHalf ), wrapRGB );\n#else\nfloat dirDiffuseWeight = max( dotProduct, 0.0 );\n#endif\n#ifdef MMD\n#ifdef MMD_TOONMAP\ntotalToon += (1.0 - totalToon) * texture2D( mmdToonMap, vec2( 0.0, 1.0 - ( 0.5 * dotProduct + 0.5 ) ) ).xyz;\n#else\ntotalToon += (1.0 - totalToon) * vec3( 1.0 );\n#endif\ntotalDiffuse += (1.0 - totalDiffuse) * diffuse * directionalLightColor[ i ];\n#else\ntotalDiffuse += (1.0 - totalDiffuse) * diffuse * directionalLightColor[ i ] * dirDiffuseWeight;\n#endif\nvec3 dirHalfVector = normalize( dirVector + viewPosition );float dirDotNormalHalf = max( dot( normal, dirHalfVector ), 0.0 );float dirSpecularWeight = specularStrength * pow( dirDotNormalHalf, shininess );\n#ifdef PHYSICALLY_BASED_SHADING\nfloat specularNormalization = ( shininess + 2.0001 ) / 8.0;vec3 schlick = specular + vec3( 1.0 - specular ) * pow( 1.0 - dot( dirVector, dirHalfVector ), 5.0 );totalSpecular += schlick * directionalLightColor[ i ] * dirSpecularWeight * dirDiffuseWeight * specularNormalization;\n#else\ntotalSpecular += specular * directionalLightColor[ i ] * dirSpecularWeight * dirDiffuseWeight;\n#endif\n}\n#endif\n#if MAX_HEMI_LIGHTS > 0\nfor( int i = 0; i < MAX_HEMI_LIGHTS; i ++ ) {vec4 lDirection = viewMatrix * vec4( hemisphereLightDirection[ i ], 0.0 );vec3 lVector = normalize( lDirection.xyz );float dotProduct = dot( normal, lVector );float hemiDiffuseWeight = 0.5 * dotProduct + 0.5;\n#ifdef MMD\n#ifdef MMD_TOONMAP\ntotalToon += (1.0 - totalToon) * texture2D( mmdToonMap, vec2( 0.0, 1.0 - hemiDiffuseWeight ) ).xyz;\n#else\ntotalToon += (1.0 - totalToon) * vec3( 1.0 );\n#endif\n#endif\nvec3 hemiColor = mix( hemisphereLightGroundColor[ i ], hemisphereLightSkyColor[ i ], hemiDiffuseWeight );totalDiffuse += (1.0 - totalDiffuse) * diffuse * hemiColor;vec3 hemiHalfVectorSky = normalize( lVector + viewPosition );float hemiDotNormalHalfSky = 0.5 * dot( normal, hemiHalfVectorSky ) + 0.5;float hemiSpecularWeightSky = specularStrength * pow( hemiDotNormalHalfSky, shininess );vec3 lVectorGround = -lVector;vec3 hemiHalfVectorGround = normalize( lVectorGround + viewPosition );float hemiDotNormalHalfGround = 0.5 * dot( normal, hemiHalfVectorGround ) + 0.5;float hemiSpecularWeightGround = specularStrength * pow( hemiDotNormalHalfGround, shininess );\n#ifdef PHYSICALLY_BASED_SHADING\nfloat dotProductGround = dot( normal, lVectorGround );float specularNormalization = ( shininess + 2.0001 ) / 8.0;vec3 schlickSky = specular + vec3( 1.0 - specular ) * pow( 1.0 - dot( lVector, hemiHalfVectorSky ), 5.0 );vec3 schlickGround = specular + vec3( 1.0 - specular ) * pow( 1.0 - dot( lVectorGround, hemiHalfVectorGround ), 5.0 );totalSpecular += hemiColor * specularNormalization * ( schlickSky * hemiSpecularWeightSky * max( dotProduct, 0.0 ) + schlickGround * hemiSpecularWeightGround * max( dotProductGround, 0.0 ) );\n#else\ntotalSpecular += specular * hemiColor * ( hemiSpecularWeightSky + hemiSpecularWeightGround ) * hemiDiffuseWeight;\n#endif\n}\n#endif\n#ifdef MMD\ntotalSpecular = max( totalSpecular, 0.0 );\n#endif\n'

/*
// MME shader (fshader)
+ MMD_SA.MME_shader("serious_shader").fshader

// not Serious Shader (#ifndef)
+ MMD_SA.MME_shader_branch("SERIOUS_SHADER", true, true)
+ '#ifdef METAL\ngl_FragColor.xyz = gl_FragColor.xyz * ( emissive + totalDiffuse + ambientLightColor * ambient + totalSpecular );\n#else\ngl_FragColor.xyz = gl_FragColor.xyz * ( emissive + totalDiffuse + ambientLightColor * ambient ) + totalSpecular;\n#endif\n#ifdef MMD_TOONMAP\ngl_FragColor.xyz *= totalToon;\n#endif\n'
+ MMD_SA.MME_shader_branch("SERIOUS_SHADER", false)
//+ '#endif\n' //commented out for mmd.three.js v0.94
*/

+ '#ifdef USE_LIGHTMAP\ngl_FragColor = gl_FragColor * texture2D( lightMap, vUv2 );\n#endif\n#ifdef USE_COLOR\ngl_FragColor = gl_FragColor * vec4( vColor, opacity );\n#endif\n#ifdef USE_ENVMAP\nvec3 reflectVec;\n#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP )\nvec3 cameraToVertex = normalize( vWorldPosition - cameraPosition );if ( useRefract ) {reflectVec = refract( cameraToVertex, normal, refractionRatio );} else {reflectVec = reflect( cameraToVertex, normal );}\n#else\nreflectVec = vReflect;\n#endif\n#ifdef DOUBLE_SIDED\nfloat flipNormal = ( -1.0 + 2.0 * float( gl_FrontFacing ) );vec4 cubeColor = textureCube( envMap, flipNormal * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );\n#else\nvec4 cubeColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );\n#endif\n#ifdef GAMMA_INPUT\ncubeColor.xyz *= cubeColor.xyz;\n#endif\nif ( combine == 1 ) {gl_FragColor.xyz = mix( gl_FragColor.xyz, cubeColor.xyz, specularStrength * reflectivity );} else if ( combine == 2 ) {gl_FragColor.xyz += cubeColor.xyz * specularStrength * reflectivity;} else {gl_FragColor.xyz = mix( gl_FragColor.xyz, gl_FragColor.xyz * cubeColor.xyz, specularStrength * reflectivity );}\n#endif\n'
+ '#ifdef USE_SHADOWMAP\n'
//+ 'discard;\n'
+ '#ifdef MMD\nif (mmdShadowDark > 0.0) {\n#endif\n#ifdef SHADOWMAP_DEBUG\nvec3 frustumColors[3];frustumColors[0] = vec3( 1.0, 0.5, 0.0 );frustumColors[1] = vec3( 0.0, 1.0, 0.8 );frustumColors[2] = vec3( 0.0, 0.5, 1.0 );\n#endif\n#ifdef SHADOWMAP_CASCADE\nint inFrustumCount = 0;\n#endif\nfloat fDepth;'

// AT: shadowPara
+ 'vec3 SP;'

// AT: unroll_loop
+ '\n#pragma unroll_loop\n'

+ 'for( int i = 0; i < MAX_SHADOWS; i ++ ) {//LOOP_START\n'

// AT: shadowPara
+ 'SP = shadowPara[i];'

+ 'vec3 shadowCoord = vShadowCoord[ i ].xyz / vShadowCoord[ i ].w;bvec4 inFrustumVec = bvec4 ( shadowCoord.x >= 0.0, shadowCoord.x <= 1.0, shadowCoord.y >= 0.0, shadowCoord.y <= 1.0 );bool inFrustum = all( inFrustumVec );\n#ifdef SHADOWMAP_CASCADE\ninFrustumCount += int( inFrustum );bvec3 frustumTestVec = bvec3( inFrustum, inFrustumCount == 1, shadowCoord.z <= 1.0 );\n#else\nbvec2 frustumTestVec = bvec2( inFrustum, shadowCoord.z <= 1.0 );\n#endif\nbool frustumTest = all( frustumTestVec );if ( frustumTest ) {'

// AT: shadowBias by light normal
+ 'shadowCoord.z += shadowBias[ i ].x * clamp(abs(tan(acos(clamp(dot(directionalLightDirection[ int(SP.y) ], normal_untransformed), -1., 1.)))), shadowBias[ i ].y, shadowBias[ i ].z);\n'
//+ 'shadowCoord.z += shadowBias[ i ];\n'

+ '#ifdef MMD\nfloat darkness = mmdShadowDark;\n#else\nfloat darkness = shadowDarkness[ i ];\n#endif\n'

+ '#if defined( SHADOWMAP_TYPE_PCF )\nfloat shadow = 0.0;const float shadowDelta = 1.0 / 9.0;float xPixelOffset = 1.0 / shadowMapSize[ i ].x;float yPixelOffset = 1.0 / shadowMapSize[ i ].y;float dx0 = -1.25 * xPixelOffset;float dy0 = -1.25 * yPixelOffset;float dx1 = 1.25 * xPixelOffset;float dy1 = 1.25 * yPixelOffset;fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, dy0 ) ) );if ( fDepth < shadowCoord.z ) shadow += shadowDelta;fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( 0.0, dy0 ) ) );if ( fDepth < shadowCoord.z ) shadow += shadowDelta;fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, dy0 ) ) );if ( fDepth < shadowCoord.z ) shadow += shadowDelta;fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, 0.0 ) ) );if ( fDepth < shadowCoord.z ) shadow += shadowDelta;fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy ) );if ( fDepth < shadowCoord.z ) shadow += shadowDelta;fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, 0.0 ) ) );if ( fDepth < shadowCoord.z ) shadow += shadowDelta;fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, dy1 ) ) );if ( fDepth < shadowCoord.z ) shadow += shadowDelta;fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( 0.0, dy1 ) ) );if ( fDepth < shadowCoord.z ) shadow += shadowDelta;fDepth = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, dy1 ) ) );if ( fDepth < shadowCoord.z ) shadow += shadowDelta;shadowColor = shadowColor * vec3( ( 1.0 - darkness * shadow ) );\n'

//+'shadowColor.rgb=texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, dy1 ) ).rgb;\n'
//+'shadowColor=vec3( 1.0 - darkness * unpackDepth(texture2D( shadowMap[ i ], shadowCoord.xy)));\n'
//+'shadowColor = vec3((shadowCoord.z>0.)?1.:0.);\n'

+ '#elif defined( SHADOWMAP_TYPE_PCF_SOFT )\nfloat shadow = 0.0;float xPixelOffset = 1.0 / shadowMapSize[ i ].x;float yPixelOffset = 1.0 / shadowMapSize[ i ].y;float dx0 = -1.0 * xPixelOffset;float dy0 = -1.0 * yPixelOffset;float dx1 = 1.0 * xPixelOffset;float dy1 = 1.0 * yPixelOffset;mat3 shadowKernel;mat3 depthKernel;depthKernel[0][0] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, dy0 ) ) );depthKernel[0][1] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, 0.0 ) ) );depthKernel[0][2] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx0, dy1 ) ) );depthKernel[1][0] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( 0.0, dy0 ) ) );depthKernel[1][1] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy ) );depthKernel[1][2] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( 0.0, dy1 ) ) );depthKernel[2][0] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, dy0 ) ) );depthKernel[2][1] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, 0.0 ) ) );depthKernel[2][2] = unpackDepth( texture2D( shadowMap[ i ], shadowCoord.xy + vec2( dx1, dy1 ) ) );vec3 shadowZ = vec3( shadowCoord.z );shadowKernel[0] = vec3(lessThan(depthKernel[0], shadowZ ));shadowKernel[0] *= vec3(0.25);shadowKernel[1] = vec3(lessThan(depthKernel[1], shadowZ ));shadowKernel[1] *= vec3(0.25);shadowKernel[2] = vec3(lessThan(depthKernel[2], shadowZ ));shadowKernel[2] *= vec3(0.25);vec2 fractionalCoord = 1.0 - fract( shadowCoord.xy * shadowMapSize[i].xy );shadowKernel[0] = mix( shadowKernel[1], shadowKernel[0], fractionalCoord.x );shadowKernel[1] = mix( shadowKernel[2], shadowKernel[1], fractionalCoord.x );vec4 shadowValues;shadowValues.x = mix( shadowKernel[0][1], shadowKernel[0][0], fractionalCoord.y );shadowValues.y = mix( shadowKernel[0][2], shadowKernel[0][1], fractionalCoord.y );shadowValues.z = mix( shadowKernel[1][1], shadowKernel[1][0], fractionalCoord.y );shadowValues.w = mix( shadowKernel[1][2], shadowKernel[1][1], fractionalCoord.y );shadow = dot( shadowValues, vec4( 1.0 ) );shadowColor = shadowColor * vec3( ( 1.0 - darkness * shadow ) );\n'
// AT: shadow_opacity
+ [
"#ifndef SHADOWMAP_CASCADE",
  'float shadow_opacity = 1. - min(pow(length((shadowCoord.xy-0.5)*2.),4.), 1.);',
  'shadowColor = mix(vec3(1.), shadowColor, shadow_opacity);',//vec3(1.-shadow_opacity);',//
"#endif",
].join('\n') + '\n'
+ '#else\nvec4 rgbaDepth = texture2D( shadowMap[ i ], shadowCoord.xy );float fDepth = unpackDepth( rgbaDepth );if ( fDepth < shadowCoord.z )shadowColor = shadowColor * vec3( 1.0 - darkness );\n#endif\n'

+ '}//LOOP_END\n#ifdef SHADOWMAP_DEBUG\n#ifdef SHADOWMAP_CASCADE\nif ( inFrustum && inFrustumCount == 1 ) gl_FragColor.xyz *= frustumColors[ i ];\n#else\nif ( inFrustum ) gl_FragColor.xyz *= frustumColors[ i ];\n#endif\n#endif\n}\n#ifdef GAMMA_OUTPUT\nshadowColor *= shadowColor;\n#endif\n'

//+ 'gl_FragColor.xyz = gl_FragColor.xyz * shadowColor;\n'
// not Serious Shader (#ifndef)
+ MMD_SA.MME_shader_branch("SERIOUS_SHADER", true, true)
+ 'Y  =  0.298912 * gl_FragColor.r + 0.586611 * gl_FragColor.g + 0.114478 * gl_FragColor.b;\n'
+ 'Cb = -0.168736 * gl_FragColor.r - 0.331264 * gl_FragColor.g + 0.5      * gl_FragColor.b;\n'
+ 'Cr =  0.5      * gl_FragColor.r - 0.418688 * gl_FragColor.g - 0.081312 * gl_FragColor.b;\n'
+ 'shadowColor.x = mix(1.0-MMDShadow,1.0, shadowColor.x);\n'
+ 'gl_FragColor.rgb = mix(clamp(YCbCrtoRGB(Y*shadowColor.x, Cb, Cr), vec3(0.),vec3(1.)), gl_FragColor.xyz*shadowColor.x, 0.5);\n'
+ MMD_SA.MME_shader_branch("SERIOUS_SHADER", false)

+ '#ifdef MMD\n}\n#endif\n'
+ '#endif\n'


// MME shader (fshader)
+ MMD_SA.MME_shader("serious_shader").fshader

// not Serious Shader (#ifndef)
+ MMD_SA.MME_shader_branch("SERIOUS_SHADER", true, true)
+ '#ifdef METAL\ngl_FragColor.xyz = gl_FragColor.xyz * ( emissive + totalDiffuse + ambientLightColor * ambient + totalSpecular );\n#else\ngl_FragColor.xyz = gl_FragColor.xyz * ( emissive + totalDiffuse + ambientLightColor * ambient ) + totalSpecular;\n#endif\n#ifdef MMD_TOONMAP\ngl_FragColor.xyz *= totalToon;\n#endif\n'
+ MMD_SA.MME_shader_branch("SERIOUS_SHADER", false)
//+ '#endif\n' //commented out for mmd.three.js v0.94


+ '#ifdef GAMMA_OUTPUT\ngl_FragColor.xyz = sqrt( gl_FragColor.xyz );\n#endif\n#ifdef MMD\n}\n#endif\n'


// X-ray
+ '#ifdef USE_XRAY_PASS\n'
+ 'float xray_distance = distance(vWorldPosition, xray_center);\n'
+ 'if (xray_distance < xray_radius) {\n'
+ '  float xray_ratio = (1.0 - xray_distance/xray_radius) * 5.0;\n'
+ '  gl_FragColor.a *= mix(1.0, xray_opacity, ((xray_ratio>1.0)?1.0:xray_ratio));\n'
+ '}\n'
+ '#endif\n'


// MME shader (fshader)
+ MMD_SA.MME_shader("HDR").fshader
+ MMD_SA.MME_shader("self_overlay").fshader


// AT: uniTexture
+ THREE.ShaderChunk[ "uniTexture_fragment" ] + '\n'


+ '#ifdef USE_FOG\nfloat depth = gl_FragCoord.z / gl_FragCoord.w;\n#ifdef FOG_EXP2\nconst float LOG2 = 1.442695;float fogFactor = exp2( - fogDensity * fogDensity * depth * depth * LOG2 );fogFactor = 1.0 - clamp( fogFactor, 0.0, 1.0 );\n#else\nfloat fogFactor = smoothstep( fogNear, fogFar, depth );\n#endif\ngl_FragColor = mix( gl_FragColor, vec4( fogColor, gl_FragColor.w ), fogFactor );\n#endif\n'

+ '}'
// END
};

MMDMaterial = function(parameters) {
	THREE.ShaderMaterial.call(this);

	// like MeshPhongMaterial
	this.color = new THREE.Color( 0xffffff ); // diffuse
	this.ambient = new THREE.Color( 0xffffff );
	this.emissive = new THREE.Color( 0x000000 );
	this.specular = new THREE.Color( 0x111111 );
	this.shininess = 30;
	this.metal = false;
	this.perPixel = false;
	this.wrapAround = false;
	this.wrapRGB = new THREE.Vector3( 1, 1, 1 );
	this.map = null;
	this.lightMap = null;
	this.bumpMap = null;
	this.bumpScale = 1;
	this.normalMap = null;
	this.normalScale = new THREE.Vector2( 1, 1 );
	this.specularMap = null;
	this.envMap = null;
	this.combine = THREE.MultiplyOperation;
	this.reflectivity = 1;
	this.refractionRatio = 0.98;
	this.wireframeLinecap = 'round';
	this.wireframeLinejoin = 'round';

	// MMD specific
	this.castShadow = true;
	this.shadowMapCullFace = THREE.CullFaceFront;
	this.mmdToonMap = null;
	this.mmdSphereMap = null;
	this.mmdSphereMode = 0;
	this.mmdEdgeColor = new THREE.Vector4(0,0,0,1); // rgba
	this.mmdEdgeThick = 0;
	this.mmdShadowDark = 0; // これがゼロならセルフ影は描画しない。
	this.passes = 1;
	this.preRenderPass = null;
	this.postRenderPass = null;
	this.uniforms = THREE.UniformsUtils.clone(MMDShader.uniforms);
	this.vertexShader = MMDShader.vertexShader;
	this.fragmentShader = MMDShader.fragmentShader;

	this.setValues( parameters );
};
MMDMaterial.prototype = Object.create(THREE.ShaderMaterial.prototype);
MMDMaterial.prototype.constructor = MMDMaterial;

// AT: dynamic .passes (for mirror, etc)
if (self.MMD_SA) {
  MMDMaterial.prototype._passes = 1;
  Object.defineProperty(MMDMaterial.prototype, "passes", {
    get: function () { return (MMD_SA._mirror_rendering_) ? 1 : this._passes; }
   ,set: function (v) { this._passes = v; }
  });
}
// AT: shadow with opacity
MMDMaterial.prototype._castShadow = true
Object.defineProperty(MMDMaterial.prototype, "castShadow", {
  get: function () { return (this.opacity) ? this._castShadow : false; }
 ,set: function (v) { this._castShadow = v; }
});

MMDMaterial.prototype.setup = function() {
	if (this.opacity <= 0) {
		// ※ material morph 対応時は改修が必要。
		this.passes = -1; // render cancel
		this.preRenderPass = this.postRenderPass = null;
	} else
	if (this.mmdEdgeThick > 0) {
		// setup RenderPass
		this.passes = 2; // multipass
		this.preRenderPass = function(renderer, pass) { // callback in renderBuffer()
			var gl, mmdEdgeThick, renderCancel;
			//if (this.opacity <= 0) {
			//	return true; // render cancel
			//}
			gl = renderer.context;
			if (pass === 0) {
				// pass 0
				if (this.side === THREE.DoubleSide) {
					gl.disable( gl.CULL_FACE );
				} else {
					gl.enable( gl.CULL_FACE );
					gl.cullFace( gl.BACK );
				}
				mmdEdgeThick = 0;
				renderCancel = false;
			} else {
				// pass 1
				gl.enable( gl.CULL_FACE );
				gl.cullFace( gl.FRONT );
				//param = gl.getParameter( gl.VIEWPORT ); // [x,y,w,h] : int32Array
				//mmdEdgeThick = this.mmdEdgeThick * 2 / param[3];
				//glからのVIEWPORT取得は時間を要するようなのでココでやるのはマズイみたい(^_^;)
				//renderer側を改造して取得できるようにした。
				mmdEdgeThick = this.mmdEdgeThick * 2 / renderer.getViewportHeight();
				renderCancel = (mmdEdgeThick <= 0);
			}
			gl.uniform1f(this.program.uniforms.mmdEdgeThick, mmdEdgeThick);
			return renderCancel;
		};
		this.postRenderPass = function(renderer, pass) { // callback in renderBuffer()
			var gl;
			//if (this.opacity <= 0) {
			//	return;
			//}
			gl = renderer.context;
			gl.enable( gl.CULL_FACE );
			gl.cullFace( gl.BACK );
		};
	} else {
		// １パス時においても、three.js側の状況に関わらず独自にやらないとうまく行かないことがある。
		this.passes = 1;
		this.preRenderPass = function(renderer, pass) { // callback in renderBuffer()
			var gl;
			gl = renderer.context;
			if (this.side === THREE.DoubleSide) {
				gl.disable( gl.CULL_FACE );
			} else {
				gl.enable( gl.CULL_FACE );
				gl.cullFace( gl.BACK );
			}
		};
		this.postRenderPass = function(renderer, pass) { // callback in renderBuffer()
			var gl;
			gl = renderer.context;
			gl.enable( gl.CULL_FACE );
			gl.cullFace( gl.BACK );
		};
	}
	if (this.mmdToonMap) {
		this.defines.MMD_TOONMAP = ''; // #define MMD_TOONMAP
	} else {
		delete this.defines.MMD_TOONMAP;
	}
	if (this.mmdSphereMap) {
		this.defines.MMD_SPHEREMAP = this.mmdSphereMode.toString(); // #define MMD_SPHEREMAP
	} else {
		delete this.defines.MMD_SPHEREMAP;
	}
// AT: X-ray
if (this._xray_pass) this.defines.USE_XRAY_PASS = "";
	this.needsUpdate = true;
};

// renderer の setProgram() から callback される。
MMDMaterial.prototype.refreshUniforms = function(renderer) {
// AT: simple MorphMaterial support START
var that = this;
var mesh = this.mesh;
var v_org = this._original_value;

var opacity_old = this.opacity
var opacity_new

var edge_alpha
var diffuse, specular, ambient

var m_obj = mesh._material_morph[this.name]
if (m_obj) {
/*
	this.target = bin.readMaterialIndex();
	this.operator = bin.readUint8();
	this.diffuse = bin.readVector(3);
	this.alpha = bin.readFloat32();
	this.specular = bin.readVector(3);
	this.power = bin.readFloat32();
	this.ambient = bin.readVector(3);
	this.edgeColor = bin.readVector(4);
	this.edgeSize = bin.readFloat32();
	this.texture = bin.readVector(4);
	this.sphereTexture = bin.readVector(4);
	this.toonTexture = bin.readVector(4);
*/
  if (!v_org) {
    v_org = this._original_value = {}
    v_org.opacity = this.opacity
    v_org.mmdEdgeColor = this.mmdEdgeColor.clone()
    v_org.diffuse  = [this.color.r, this.color.g, this.color.b]
    v_org.specular = [this.specular.r, this.specular.g, this.specular.b]
    v_org.ambient  = [this.ambient.r, this.ambient.g, this.ambient.b]
//DEBUG_show(JSON.stringify(this.mmdEdgeColor),0,1)
  }

  opacity_new = v_org.opacity
  edge_alpha = v_org.mmdEdgeColor.w
  diffuse  = v_org.diffuse.slice(0)
  specular = v_org.specular.slice(0)
  ambient  = v_org.ambient.slice(0)

  var order = Object.keys(m_obj).sort(function(a, b){return a-b});
  order.forEach(function (idx) {
    var m = m_obj[idx]
    var weight = m.weight
    if (!weight)
      return

// a trick to reset the weight (once) in previous frame
    if (weight < 0) {
      weight = 0
//DEBUG_show(that.name,0,1)
    }

// reset it to make sure that it won't stay in next frame update, needed in some cases such as motion change
// take mirrors into account
    if (!MMD_SA._mirror_rendering_) {
      if (m.weight) {
        m.weight = -1
// to ensure that .refreshUniforms (where ._material_morph is processed) is executed once (especially when opacity is changed from 0 to other value)
        that._render_once = true
      }
      else {
        m.weight = 0
      }
    }

    var morph_obj = m.morph_obj
    var f
    if (morph_obj.operator == 0) {
      f = (weight * morph_obj.alpha) + (1-weight)
      opacity_new *= f
      edge_alpha *= f
    }
    else {
      f = (weight * morph_obj.alpha)
      opacity_new += f
      edge_alpha += f

      if (morph_obj.diffuse.find(function (v) { return !!v })) {
//DEBUG_show(v_org.diffuse+'/'+morph_obj.diffuse)
        for (var i = 0; i < 3; i++)
          diffuse[i] += morph_obj.diffuse[i] * weight
      }
      if (morph_obj.specular.find(function (v) { return !!v })) {
//DEBUG_show(v_org.specular+'/'+morph_obj.specular)
        for (var i = 0; i < 3; i++)
          specular[i] += morph_obj.specular[i] * weight
      }
      if (morph_obj.ambient.find(function (v) { return !!v })) {
//DEBUG_show(v_org.ambient+'/'+morph_obj.ambient)
        for (var i = 0; i < 3; i++)
          ambient[i] += morph_obj.ambient[i] * weight
      }
    }

    if (opacity_new > 1)
      opacity_new = 1
    else if (opacity_new < 0)
      opacity_new = 0

    if (edge_alpha > 1)
      edge_alpha = 1
    else if (edge_alpha < 0)
      edge_alpha = 0
  });

  this.opacity = opacity_new
  this.mmdEdgeColor.w = edge_alpha
  this.color.setRGB(diffuse[0], diffuse[1], diffuse[2])
  this.specular.setRGB(specular[0], specular[1], specular[2])
  this.ambient.setRGB(ambient[0], ambient[1], ambient[2])
}
else {
  if (v_org) {
    opacity_new = this.opacity = v_org.opacity
    this.mmdEdgeColor.w = v_org.mmdEdgeColor.w
    this.color.setRGB(v_org.diffuse[0], v_org.diffuse[1], v_org.diffuse[2])
    this.specular.setRGB(v_org.specular[0], v_org.specular[1], v_org.specular[2])
    this.ambient.setRGB(v_org.ambient[0], v_org.ambient[1], v_org.ambient[2])
  }
  else {
    opacity_new = opacity_old
  }
}

if (opacity_old == 0) {
  if (opacity_new > 0) {
    this.setup()
  }
}
else {
  if (opacity_new == 0) {
    this.setup()
  }
}
// simple MorphMaterial support END

	var uniforms = this.uniforms;

// --- Common ---
// based on refreshUniformsCommon() @ WebGLRenderer.js
	uniforms.opacity.value = this.opacity;

	if ( renderer.gammaInput ) {

		uniforms.diffuse.value.copyGammaToLinear( this.color );

	} else {

		uniforms.diffuse.value = this.color;

	}

	uniforms.map.value = this.map;
	uniforms.lightMap.value = this.lightMap;
	uniforms.specularMap.value = this.specularMap;

	if ( this.bumpMap ) {

		uniforms.bumpMap.value = this.bumpMap;
		uniforms.bumpScale.value = this.bumpScale;

	}

	if ( this.normalMap ) {

		uniforms.normalMap.value = this.normalMap;
		uniforms.normalScale.value.copy( this.normalScale );

	}

	// uv repeat and offset setting priorities
	//	1. color map
	//	2. specular map
	//	3. normal map
	//	4. bump map

	var uvScaleMap;

	if ( this.map ) {

		uvScaleMap = this.map;

	} else if ( this.specularMap ) {

		uvScaleMap = this.specularMap;

	} else if ( this.normalMap ) {

		uvScaleMap = this.normalMap;

	} else if ( this.bumpMap ) {

		uvScaleMap = this.bumpMap;

	}

	if ( uvScaleMap !== undefined ) {

		var offset = uvScaleMap.offset;
		var repeat = uvScaleMap.repeat;

		uniforms.offsetRepeat.value.set( offset.x, offset.y, repeat.x, repeat.y );

	}

	uniforms.envMap.value = this.envMap;
	uniforms.flipEnvMap.value = ( this.envMap instanceof THREE.WebGLRenderTargetCube ) ? 1 : -1;

	if ( renderer.gammaInput ) {

		//uniforms.reflectivity.value = this.reflectivity * this.reflectivity;
		uniforms.reflectivity.value = this.reflectivity;

	} else {

		uniforms.reflectivity.value = this.reflectivity;

	}

	uniforms.refractionRatio.value = this.refractionRatio;
	uniforms.combine.value = this.combine;
	uniforms.useRefract.value = this.envMap && this.envMap.mapping instanceof THREE.CubeRefractionMapping;

// --- Phong ---
// based on refreshUniformsPhong() @ WebGLRenderer.js
	uniforms.shininess.value = this.shininess;

	if ( renderer.gammaInput ) {

		uniforms.ambient.value.copyGammaToLinear( this.ambient );
		uniforms.emissive.value.copyGammaToLinear( this.emissive );
		uniforms.specular.value.copyGammaToLinear( this.specular );

	} else {

		uniforms.ambient.value = this.ambient;
		uniforms.emissive.value = this.emissive;
		uniforms.specular.value = this.specular;

	}

	if ( this.wrapAround ) {

		uniforms.wrapRGB.value.copy( this.wrapRGB );

	}

// --- MMD ---
	if (this.mmdToonMap) {
		uniforms.mmdToonMap.value = this.mmdToonMap;
	}
	if (this.mmdSphereMap) {
		uniforms.mmdSphereMap.value = this.mmdSphereMap;
	}
	//uniforms.mmdEdgeThick.value = this.mmdEdgeThick;
// AT: uniforms
const model_index = mesh._model_index;
const model = THREE.MMD.getModels()[model_index];
const shadow_darkness = MMD_SA_options.model_para_obj_all[model_index].shadow_darkness || MMD_SA_options.shadow_darkness;
if (self.MMD_SA) {
  if (!this._MME_uniforms_updated_ || ((model_index == 0) && (MMD_SA._MME_uniforms_updated_ && (MMD_SA._MME_uniforms_updated_ > this._MME_uniforms_updated_)))) {
var MME = (model_index == 0) ? MMD_SA_options.MME : MMD_SA_options.model_para_obj_all[model_index].MME

var mme

mme = MME.self_overlay
uniforms.self_overlay_opacity.value = mme.opacity || 0.5
uniforms.self_overlay_brightness.value = (mme.brightness == null) ? 0.5 : mme.brightness
var color_adjust = mme.color_adjust || [1.5,1,1]
uniforms.self_overlay_color_adjust.value.set(color_adjust[0], color_adjust[1], color_adjust[2])

mme = MME.HDR
uniforms.HDR_opacity.value = mme.opacity || 0.5

mme = MME.serious_shader
uniforms.serious_shader_shadow_opacity.value = (mme.shadow_opacity || 0.5) * Math.min(1, ((mme.material && mme.material[this.name] && mme.material[this.name].shadow_opacity_scale) || 1) * ((MMD_SA_options.use_shadowMap)?1+shadow_darkness:1))
uniforms.OverBright.value = (mme.OverBright || ((mme.type == "AdultShaderS2") ? 1.15 : 1.2)) + MMD_SA_options.SeriousShader_OverBright_adjust
uniforms.ShadowDarkness.value = mme.ShadowDarkness || ((mme.type == "SeriousShader") ? 0.6 : 1)// セルフシャドウの最大暗さ
uniforms.ToonPower.value = mme.ToonPower || ((mme.type == "SeriousShader") ? 1.5 : ((mme.type == "AdultShaderS2") ? 1.1 : 1))// 影の暗さ
uniforms.EyeLightPower.value = mme.EyeLightPower || ((mme.type == "AdultShaderS2") ? 0.7 : 2)// 視線方向での色合いの変化
uniforms.serious_shader_mode.value = (mme.type == "AdultShaderS") ? 2 : ((mme.type == "AdultShaderS2") ? 1 : 0)

if (MMD_SA.MME_shader_inline_switch_mode) {
  ["self_overlay", "HDR", "serious_shader"].forEach(function (name) {
    mme = MME[name]
    uniforms[name.toUpperCase()].value = (mme.enabled==null || mme.enabled)?1:0
  });
}

this._MME_uniforms_updated_ = Date.now()
  }
  else if ((model_index == 0) && MMD_SA._MME_uniforms_updated_) {
    DEBUG_show("(MMD shader updated)", 2)
    MMD_SA._MME_uniforms_updated_ = 0
  }

  if (this._xray_pass) {
    var xray = MMD_SA_options.mesh_obj_by_id["XrayMESH"]
    if (xray && xray.visible) {
      uniforms.xray_center.value.copy(xray._obj.position)
      var opacity_ratio = (Date.now() - xray._start_time)/1000
      uniforms.xray_opacity.value = MMD_SA_options._xray_opacity + (1-MMD_SA_options._xray_opacity) * (1-((opacity_ratio > 1) ? 1 : opacity_ratio))
    }
    else
      uniforms.xray_center.value.set(999, 999, 999)
  }
}
uniforms.MMDShadow.value = shadow_darkness;
	uniforms.mmdEdgeColor.value = this.mmdEdgeColor;
	uniforms.mmdShadowDark.value = this.mmdShadowDark;
};

(function() { // MMDIK
// !!! bone.visible を内部的なフラグとして流用しているので注意。!!!
var targetPos, targetVec, effectorVec, axis/*, tv*/, q, inv,
	getMatrix, setGlobalPosition, setGlobalMatrixInverse;

targetPos = new THREE.Vector3();
targetVec = new THREE.Vector3();
effectorVec = new THREE.Vector3();
axis = new THREE.Vector3();
//tv = new THREE.Vector3();
q = new THREE.Quaternion();
inv = new THREE.Matrix4();
getMatrix = function(bone) {
	var m = bone.matrix;
	if (bone.visible) {
		// matrixを更新。
		bone.visible = false;
		m.makeRotationFromQuaternion(bone.quaternion);
		m.setPosition(bone.position);
	}
	return m;
};
setGlobalPosition = function(mesh, bone, pos) {
	pos.copy(bone.position);
	while (bone.parent !== mesh) {
		bone = bone.parent;
		pos.applyMatrix4(getMatrix(bone));
	}
};
setGlobalMatrixInverse = function(mesh, bone, inv) {
	inv.copy(getMatrix(bone));
	while (bone.parent !== mesh) {
		bone = bone.parent;
		inv.multiplyMatrices(getMatrix(bone), inv);
	}
	inv.getInverse(inv);
};

// inverse kinematic solver
MMDIK = function( mesh ) {
	this.mesh = mesh;
};
// AT: para
MMDIK.prototype.update = function(para) {
	var mesh,iks,bones,a,al,ik,ikl,i,j,il,jl,target,effector,link,angle,t;
	mesh = this.mesh;
	bones = mesh.bones;
	iks = mesh.geometry.MMDIKs;
// AT: IK toggle
var model, model_para, mm, para_SA
var link_sign = []
var a_ini = 0
var a_end = iks.length
var ik_iteration_factor = 1
if (self.MMD_SA) {
  model = THREE.MMD.getModels()[mesh._model_index]
  model_para = MMD_SA_options.model_para_obj_all[mesh._model_index]
  mm = model.skin && MMD_SA.motion[model.skin._motion_index]
  ik_iteration_factor = model_para.ik_iteration_factor || ((MMD_SA_options.Dungeon && mesh._model_index) ? MMD_SA_options.Dungeon_options.ik_iteration_factor||0.5 : 1)
//ik_iteration_factor=0.25
  para_SA = mm && mm.para_SA
  if (para) {
    a_ini = para.ini
    a_end = para.end || a_ini
  }
}
	for (a=a_ini,al=a_end; a<=al; a++) {
		ik = mesh._IK_and_AddTrans[a].pmxBone.IK
//	for (a=0,al=iks.length; a<al; a++) {
//		ik = iks[a];
		target = bones[ik.target];
// AT: IK toggle
//if (mesh._IK_and_AddTrans[a].pmxBone.name.indexOf("ひざ下IK") != -1) { DEBUG_show(Date.now()); continue; }
//DEBUG_show(mesh._IK_and_AddTrans[a].pmxBone.name,0,1)
let bones_for_pose_conversion;
if (mm) {
  let use_default_IK_disabled;
  if ((mesh._model_index == 0) && System._browser.camera.ML_enabled) {
    const IK_disabled = System._browser.camera.poseNet.IK_disabled_check(target.name);
    if (IK_disabled === null) {
      use_default_IK_disabled = true;
    }
    else if (IK_disabled) {
      continue;
    }
  }
  else {
    use_default_IK_disabled = true;
  }

  if (use_default_IK_disabled && para_SA.IK_disabled && para_SA.IK_disabled.test(target.name)) {
    continue
  }

  const result = {};
// NOTE: always an one-time event
  window.dispatchEvent(new CustomEvent('SA_IK_' + target.name + '_onupdate', { detail:{ result:result } }));

  if (result.links) {
    a--;

    const IK_target = result.links.target;
    const pos = MMD_SA.TEMP_v3.copy(target.position);
    target.position.copy(IK_target);
    IK_target.copy(pos);

    const effector = bones[ik.effector];
    const IK_effector = result.links.effector;
    const e_rot = MMD_SA.TEMP_q.copy(effector.quaternion);
    effector.quaternion.copy(IK_effector);
    IK_effector.copy(e_rot);

    const links = result.links.links;
    const links_result = result.links_result;
    const jl = ik.links.length;
    for (let j=0; j<jl; j++) {
      const ikl = ik.links[j];
      const link = bones[ikl.bone];
      const rot = MMD_SA.TEMP_q.copy(link.quaternion);
      link.quaternion.copy(links[j]);
      links[j].copy(rot);
    }
    window.addEventListener('SA_IK_' + target.name + '_onupdate', (e)=>{
      target.position.copy(IK_target);
// needed to update matrix
      effector.visible = true;
      effector.quaternion.copy(IK_effector);
      
      for (let j=0; j<jl; j++) {
        const ikl = ik.links[j];
        const link = bones[ikl.bone];
        links_result.links[j].copy(link.quaternion);
        links_result.updated = RAF_timestamp;
// needed to update matrix
        link.visible = true;
        link.quaternion.copy(links[j]);
      }
    }, {once:true});
  }

// arm IK
  if (/\u8155\uFF29\uFF2B/.test(target.name)) {
    let _vmd = MMD_SA.vmd_by_filename[mm.filename]
    if (!System._browser.camera.use_armIK && _vmd && !_vmd.use_armIK && !para_SA.use_armIK) { continue }
//DEBUG_show( THREE.MMD.getModels()[0].mesh.bones_by_name["左腕ＩＫ"].position.toArray() )

    const t = target.name;
    const d = t.charAt(0);
    const frames = System._browser.camera.poseNet.frames;
    const bones_by_name = mesh.bones_by_name;

    const mocap_IK = (System._browser.camera.poseNet.enabled || System._browser.camera.facemesh.enabled) && (frames.skin[d+'腕ＩＫ'] || (System._browser.camera.poseNet.IK_disabled_check(target.name) === false));
// save some headaches and discard any non-arm-IK motion when arm IK mocap is not used, as even when arm-IK is at default, any shoulder rotation will still affect the output
    if (!_vmd.use_armIK && !mocap_IK) {
      continue;
    }

    if (mocap_IK) {
      for (const name of [d+'腕', d+'ひじ']) {
        bones_by_name[name+'+'].quaternion.copy(bones_by_name[name].quaternion);
        bones_by_name[name].quaternion.set(0,0,0,1);
      }
    }

    if (MMD_SA.THREEX.get_model(mesh._model_index).is_T_pose) {
// MMD IK operates on A pose, and returns A pose
// arm IK operates on bones+, and grants the rotations to the original bones

// always convert shoulder, as it will affect arm IK calculation
      bones_for_pose_conversion = [d+'肩'];

      if (mocap_IK) {
        bones_for_pose_conversion.push(d+'腕+', d+'ひじ+');
      }
      else if (_vmd.use_armIK) {
// save some headaches and just assume that bones+ are not used
      }

      for (const name of bones_for_pose_conversion) {
        const q = bones_by_name[name].quaternion;
        const rot = q.toArray();
        MMD_SA.THREEX.utils.convert_T_pose_rotation_to_A_pose(name.replace(/\+/, ''), rot);
        q.fromArray(rot);
      }

      if (mocap_IK) {
        bones_for_pose_conversion = [d+'肩', d+'腕+', d+'ひじ+'];
      }
      else if (_vmd.use_armIK) {
// assuming shoulder rotation is never zero for T-posed model, there is always a non-zero output for arm IK
        bones_for_pose_conversion = [d+'肩', d+'腕+', d+'ひじ+'];
      }
    }
  }
}
		effector = bones[ik.effector];
		//if (effector.omitIK) {
		//	continue; // cancel
		//}
		setGlobalPosition(mesh, target, targetPos);
//if (target.name.indexOf("左腕WIK") != -1 && System._browser.camera.poseNet.enabled) console.log(targetPos.toArray())
		il = ik.iteration;
// AT: ik_iteration_factor
il = Math.max(Math.floor(il * ik_iteration_factor), 1);
		jl = ik.links.length;
		// リンクの回転を初期化。
		for (j=0; j<jl; j++) {
			ikl = ik.links[j];
			link = bones[ikl.bone];
// AT: comment out quaternion.set(0,0,0,1) for independent rotations on linked bones to work
// limiting rotation from 足首 looks more natural
if (link.name.indexOf("足首") != -1) link.quaternion.slerp(MMD_SA.TEMP_q.set(0,0,0,1), 0.5);
//			link.quaternion.set(0,0,0,1);
// AT: link sign
link_sign[j] = (ikl.limits && model_para && model_para.IK_link_inverted && model_para.IK_link_inverted.test(link.name))?-1:1
		}
//if (mesh._IK_and_AddTrans[a].pmxBone.name.indexOf("ひざ下IK") != -1) { for (j=0; j<jl; j++) { ikl = ik.links[j]; link = bones[ikl.bone]; link.quaternion.setFromEuler(MMD_SA.TEMP_v3.set(Math.PI/2,0,0)); }; DEBUG_show(Date.now()); continue; }
		loop:
		for (i=0; i<il; i++) {
// AT: from CCDIKSolver - save some calculations
var rotated = false
			for (j=0; j<jl; j++) {
				ikl = ik.links[j];
				link = bones[ikl.bone];
				if (link.omitIK) {
					//continue; // cancel
					break loop; // cancel
				}
				setGlobalMatrixInverse(mesh, link, inv);
				setGlobalPosition(mesh, effector, effectorVec); // === effectorPos
				effectorVec.applyProjection(inv).normalize();
				targetVec.copy(targetPos);
				targetVec.applyProjection(inv).normalize();
				angle = targetVec.dot(effectorVec);
				if (angle > 1) { // 誤差対策。
					angle = 1;
				}
				angle = Math.acos(angle);
				if (angle < 1.0e-5) { // 発散対策。
					continue; // 微妙に振動することになるから抜ける方が無難かな。
					//angle = 1.0e-5;
				}
				if (angle > ik.control) {
					angle = ik.control;
				}
				q.setFromAxisAngle((axis.crossVectors(effectorVec, targetVec)).normalize(), angle);
				link.quaternion.multiplyQuaternions(link.quaternion, q);
				if (ikl.limits) { // 実質的に「ひざ」限定。
					// 簡易版
					t = link.quaternion.w;
					link.quaternion.set(link_sign[j]* Math.sqrt(1 - t * t), 0, 0, t); // X軸回転に限定。
/*
					var tv = MMD_SA.TEMP_v3.setEulerFromQuaternion(link.quaternion);
					if (tv.x < ikl.limits[0][0]) {
						tv.x = ikl.limits[0][0];
link.quaternion.setFromEuler(tv).normalize()
					} else
					if (tv.x > ikl.limits[1][0]) {
						tv.x = ikl.limits[1][0]
link.quaternion.setFromEuler(tv).normalize()
					}
*/
					/* // オイラー角制限版。しかし回転順序はどうすべきか・・・。
					tv.setEulerFromQuaternion(link.quaternion);
					if (tv.x < ikl.limits[0][0]) {
						tv.x = ikl.limits[0][0];
					} else
					if (tv.x > ikl.limits[1][0]) {
						tv.x = ikl.limits[1][0]
					}
					if (tv.y < ikl.limits[0][1]) {
						tv.y = ikl.limits[0][1];
					} else
					if (tv.y > ikl.limits[1][1]) {
						tv.y = ikl.limits[1][1]
					}
					if (tv.z < ikl.limits[0][2]) {
						tv.z = ikl.limits[0][2];
					} else
					if (tv.z > ikl.limits[1][2]) {
						tv.z = ikl.limits[1][2]
					}
					link.quaternion.setFromEuler(tv); */
				}
				//link.quaternion.normalize();
				link.visible = true; // matrixの更新を指示。
rotated = true
			}
if (!rotated) { /*DEBUG_show(i,0,1);*/break; }
		}

// MMD IK operates on A pose. Convert it back to T pose for T-posed model
const bones_by_name = mesh.bones_by_name;
if (bones_for_pose_conversion) {
  for (const name of bones_for_pose_conversion) {
    const q = bones_by_name[name].quaternion;
    const rot = q.toArray();
    MMD_SA.THREEX.utils.convert_A_pose_rotation_to_T_pose(name.replace(/\+/, ''), rot);
    q.fromArray(rot);
  }
}

	}

	bones.forEach(function(v) {
		v.visible = true; // 元に戻す。
	});
};

}()); // MMDIK

(function() { // physics

// AT: ammo proxy
var AP = self.MMD_SA && MMD_SA.ammo_proxy;

var btConfiguration, btDispatcher, btSolver, btBroadphase,
	_btransform, _bv, _bq,
	_v, _v2, _v3, _q, _q2, _q3, _mtx, _mtx2,
	getLocalRigidPos;
if ( window.Ammo ) {//mod by jThree

// AT: ammo.js async
jThree._ammo_async_init_ = []
jThree._ammo_async_init_.push(function () {

	// create physics world
	btConfiguration = new Ammo.btDefaultCollisionConfiguration();
	btDispatcher = new Ammo.btCollisionDispatcher( btConfiguration );
	btSolver = new Ammo.btSequentialImpulseConstraintSolver();
	btBroadphase = new Ammo.btDbvtBroadphase();
	btWorld = new Ammo.btDiscreteDynamicsWorld( btDispatcher, btBroadphase, btSolver, btConfiguration );

	// physics temporary
	_btransform = new Ammo.btTransform();
	_bv = new Ammo.btVector3();
	_bq = new Ammo.btQuaternion();
	tmpBV = function( x,y,z ) {
		_bv.setValue( x,y,z );
		return _bv;
	};
	tmpBQ = function( x,y,z,w ) {
		_bq.setValue( x,y,z,w );
		return _bq;
	};

// AT: ammo proxy
self.MMD_SA && AP && AP.update_worker("TEST");

});

}

// temporary
_v = new THREE.Vector3();
_v2 = new THREE.Vector3();
_v3 = new THREE.Vector3();
_q = new THREE.Quaternion();
_q2 = new THREE.Quaternion();
_q3 = new THREE.Quaternion();
_mtx = new THREE.Matrix4();
_mtx2 = new THREE.Matrix4();

// 剛体の座標をワールドからローカルへ
getLocalRigidPos = function(joint, rigid) {
//	_v.set( rigid.rot[0], rigid.rot[1], rigid.rot[2] );
//	_mtx.makeRotationFromEuler( _v );
_q.copy(rigid.q);
_mtx.makeRotationFromQuaternion(_q);
	_mtx.getInverse(_mtx);
	_v.set( joint.pos[0] - rigid.pos[0], joint.pos[1] - rigid.pos[1], joint.pos[2] - rigid.pos[2] );
	return _v.applyProjection(_mtx); // 逆行列の場合は applyMatrix4() ではなく applyProjection() で。
};

MMDPhysi = function( mesh ) {
	this.create( mesh );
};
MMDPhysi.prototype.create = function( mesh ) {
// AT: bitwise operation
function bitwise(L, R, op) {
  switch (op) {
    case "OR":
      if (!self.MMD_SA || !AP)
        return (L | R);
      L = (L._v_index && (((Ammo_local)?"L.":"")+L._v_index)) || L;
      R = (R._v_index && (((Ammo_local)?"L.":"")+R._v_index)) || R;
      if (AP.use_text_command)
        return (((typeof L === "string")?"v['"+L+"']":L) + "|" + ((typeof R === "string")?"v['"+R+"']":R));
      return {L:L, R:R, op:"OR"};
  }
}

// AT: for simplicity, physics are skipped for external models
if (MMD_SA.MMD_started) { mesh.MMDrigids.length = 0; mesh.geometry.MMDjoints.length = 0; }
	var rigids = mesh.MMDrigids,
		joints = mesh.geometry.MMDjoints;

	this.mesh = mesh;

// AT: model_para_obj
var model_para_obj = MMD_SA_options.model_para_obj_all[mesh._model_index]

// AT: find rigids to be excluded for .setActivationState
var setActivationState_exclusion = {};
joints.forEach(function(v) {
  var ra = rigids[v.rigidA], rb = rigids[v.rigidB];
  if ((ra.type == 0) && (rb.type > 0))
    setActivationState_exclusion[v.rigidA] = true
});

	// setup rigid bodies
// AT: idx
	rigids.forEach(function(v, idx) {
		var bone, shape, mass, localInertia, motionState, rbInfo, body;

		// バインドポーズ時の回転量を求める。
		v.q = new THREE.Quaternion();
// AT: 'YXZ' is the KEY to do the correct rotation for ammo.js
//v.rot[0] = -v.rot[0]
//v.rot[1] = -v.rot[1]
//v.rot[2] = -v.rot[2]
//'YXZ'
		v.q.setFromEuler(new THREE.Vector3(v.rot[0], v.rot[1], v.rot[2]), 'YXZ');

// AT: rigid_default / skip physics for specified parts (eg. skirt)
var rigid_default = (model_para_obj.rigid_default && (model_para_obj.rigid_default[v.name] || model_para_obj.rigid_default._all_)) || {}
if (rigid_default.type != null) {
  if (rigid_default.type == -1) {
// practically disable a rigid
    v.type = 0
    v.size = [0,0,0]
  }
  else
    v.type = rigid_default.type
}
//if (v.type == 2) v.type = 1
var _RE = self.MMD_SA && model_para_obj.rigid_filter
if (_RE && !_RE.test(v.name)) { v.type = 0; /*DEBUG_show(v.name,0,1)*/ }
		if (v.bone >= 0) {
			bone = mesh.bones[v.bone];
			if (v.type > 0) {
				// 動的剛体に対応しているボーンはIK対象から除外。
				bone.omitIK = true;
			}
		} else {
			if (v.type === 2) {
				// 関連ボーンが無いのでボーン位置合わせはできない。
				v.type = 1;
				//console.log(v.name + ' type 2 -> 1');
			}
		}

		switch(v.shape) {
		case 0:
			shape = new Ammo.btSphereShape(v.size[0]);
			break;
		case 1:
			shape = new Ammo.btBoxShape(tmpBV(v.size[0], v.size[1], v.size[2]));
			break;
		case 2:
			shape = new Ammo.btCapsuleShape(v.size[0], v.size[1]);
			break;
		default:
			return;
		}
		mass = (v.type === 0 ? 0 : v.mass);
		localInertia = new Ammo.btVector3(0, 0, 0);
		shape.calculateLocalInertia( mass, localInertia );
		_btransform.setIdentity();
		_btransform.setOrigin(tmpBV( v.pos[0] + mesh.position.x, v.pos[1] + mesh.position.y, v.pos[2] + mesh.position.z ));
		_btransform.setRotation(tmpBQ( v.q.x, v.q.y, v.q.z, v.q.w ));
		motionState = new Ammo.btDefaultMotionState( _btransform );
		rbInfo = new Ammo.btRigidBodyConstructionInfo( mass, motionState, shape, localInertia );
		rbInfo.set_m_friction( v.friction );
		rbInfo.set_m_restitution( v.restitution );
		body = new Ammo.btRigidBody( rbInfo );
		if (v.type === 0) {
// AT: bitwise
			body.setCollisionFlags( bitwise(body.getCollisionFlags(), 2, "OR") ); // KINEMATIC
// AT: From MMDPhysics - using .setActivationState seems to fix some physics glitches (eg. skirts)
if (!setActivationState_exclusion[idx])
			body.setActivationState( 4 ); // DISABLE_DEACTIVATION
//		} else {
//			body.setActivationState( 4 ); // DISABLE_DEACTIVATION
		}
// AT: rigid_default
		body.setDamping(v.posDamping *(rigid_default.posDamping_scale||1), v.rotDamping *(rigid_default.rotDamping_scale||1));
		body.setSleepingThresholds(0, 0);
		btWorld.addRigidBody(body, 1 << v.group, v.mask);
//console.log([1 << v.group, v.group, v.mask])
		Ammo.destroy(rbInfo);
		Ammo.destroy(localInertia);
		v.body = body;
	});

	// setup constraints
	joints.forEach(function(v) {
		var p, r, c, i, ba, bb, //namea, nameb, 
			ra = rigids[v.rigidA],
			rb = rigids[v.rigidB],
			ta = new Ammo.btTransform(),
			tb = new Ammo.btTransform();

		/* if (ra.bone > 0) {
			namea = mesh.bones[ra.bone].name;
		}
		if (rb.bone > 0) {
			nameb = mesh.bones[rb.bone].name;
		}
		console.log(namea + ':' + ra.type + ' -> ' + nameb + ':' + rb.type); */
		if (ra.type !== 0 && rb.type === 2) {
			// 親側が静的剛体で無い場合は、子側のボーン位置合わせは無効にしないといけないようだ。
			if (ra.bone > 0) {
				ba = mesh.bones[ra.bone];
			}
			if (rb.bone > 0) {
				bb = mesh.bones[rb.bone];
			}
			if (ba && bb && bb.parent === ba) {
// AT: update skin matrix from parent which has been modified by physics
// for simplicity, use the default rb.type = 1 treatment for now.
if (0) //(ba._index < bb._index)
  rb._skin_parent = ba
else {
//  console.log(ra.name+'/'+rb.name+': rigid type 2 -> 1')
				rb.type = 1; // 通常の動的剛体。
				//console.log('!!! ' + nameb + ' type 2 -> 1');
}
			}
		}

		ta.setIdentity();
		p = getLocalRigidPos(v,ra);
		ta.setOrigin(tmpBV( p.x, p.y, p.z ));
//		r = ta.getRotation();
//		r.setEulerZYX( -ra.rot[2], -ra.rot[1], -ra.rot[0] );
r = tmpBQ( -ra.q.x, -ra.q.y, -ra.q.z, ra.q.w );
		ta.setRotation( r );

		tb.setIdentity();
		p = getLocalRigidPos(v,rb);
		tb.setOrigin(tmpBV( p.x, p.y, p.z ));
//		r = tb.getRotation();
//		r.setEulerZYX( -rb.rot[2], -rb.rot[1], -rb.rot[0] );
r = tmpBQ( -rb.q.x, -rb.q.y, -rb.q.z, rb.q.w );
		tb.setRotation( r );

// AT: joint_default
var joint_default = (model_para_obj.joint_default && model_para_obj.joint_default[v.name]) || {}

		c = new Ammo.btGeneric6DofSpringConstraint(
			ra.body,
			rb.body,
			ta,
			tb
// AT: in newer versions of ammo.js, the following parameter needs to be defined
,true
		);
// AT: joint_default
		c.setLinearLowerLimit(tmpBV( v.posLower[0], v.posLower[1], v.posLower[2] ));
		c.setLinearUpperLimit(tmpBV( v.posUpper[0], v.posUpper[1], v.posUpper[2] ));
		c.setAngularLowerLimit(tmpBV( v.rotLower[0] *((joint_default.rotLower_scale&&joint_default.rotLower_scale[0])||1), v.rotLower[1] *((joint_default.rotLower_scale&&joint_default.rotLower_scale[1])||1), v.rotLower[2] *((joint_default.rotLower_scale&&joint_default.rotLower_scale[2])||1) ));
		c.setAngularUpperLimit(tmpBV( v.rotUpper[0] *((joint_default.rotUpper_scale&&joint_default.rotUpper_scale[0])||1), v.rotUpper[1] *((joint_default.rotUpper_scale&&joint_default.rotUpper_scale[1])||1), v.rotUpper[2] *((joint_default.rotUpper_scale&&joint_default.rotUpper_scale[2])||1) ));
// AT: joint_default
		for (i=0;i<3;i++) {
			if (v.posSpring[i] > 0) {
// AT: From MMDPhysics
c.enableSpring(i, true);
				c.setStiffness(i, v.posSpring[i] *((joint_default.posSpring_scale&&joint_default.posSpring_scale[i])||1));
//				c.enableSpring(i, true);
			}
			if (v.rotSpring[i] > 0) {
// AT: From MMDPhysics
c.enableSpring(i+3, true);
				c.setStiffness(i+3, v.rotSpring[i]);
//				c.enableSpring(i+3, true);
			}
		}
		//c.setEquilibriumPoint(); // バネの復元基準。
		//c.enableFeedback();
			//enableFeedback will allow to read the applied linear and angular impulse
			//use getAppliedImpulse, getAppliedLinearImpulse and getAppliedAngularImpulse to read feedback information
		for (i=0; i<6; i++) {
			//c.setParam( 1, 0.45, i); // BT_CONSTRAINT_ERP (6DOFSpringではやっても意味ないぽい)
// AT: setParam is not defined in newer version of ammo.js
if (!self.MMD_SA || c.setParam)
			c.setParam( 2, MMD.STOP_ERP, i); // BT_CONSTRAINT_STOP_ERP (default=0.2)
			//c.setParam( 3, 0.0, i); // BT_CONSTRAINT_CFM
			//c.setParam( 4, 0.0, i); // BT_CONSTRAINT_STOP_CFM
		}
		btWorld.addConstraint( c, true ); // disableCollisionsBetweenLinkedBodies
		Ammo.destroy(ta);
		Ammo.destroy(tb);
		v.constraint = c;
	});

// AT: ammo proxy
self.MMD_SA && AP && AP.update_worker()

};
MMDPhysi.prototype.dispose = function() {
	this.mesh.geometry.MMDjoints.forEach( function(v) {
		btWorld.removeConstraint( v.constraint );
		Ammo.destroy( v.constraint );
		delete v.constraint;
	});
	this.mesh.MMDrigids.forEach( function(v) {
		btWorld.removeRigidBody( v.body );
		Ammo.destroy( v.body );
		delete v.body;
	});

// AT: ammo proxy
self.MMD_SA && AP && AP.update_worker()

};
MMDPhysi.prototype.preSimulate = function() { // ボーン→静的剛体
	var mesh;
	mesh = this.mesh;
// AT: matrixWorld_physics
if (mesh.matrixWorld_physics) mesh.matrixWorld_physics.update()
var matrixWorld_physics = (mesh.matrixWorld_physics && mesh.matrixWorld_physics.m4) || mesh.matrixWorld;
_q2.setFromRotationMatrix(matrixWorld_physics)
//	_q2.setFromRotationMatrix( mesh.matrixWorld );
// AT: ammo proxy
var use_optimized_command = false
if (AP) {
  AP.cache_by_model.set_enabled(mesh._model_index, !mesh._reset_rigid_body_physics_);
  use_optimized_command = AP.use_optimized_command && !AP.use_text_command;
  use_optimized_command && AP.add_optimized_command({ o:2, _btransform_v_index:_btransform._v_index, _bv_v_index:_bv._v_index, _bq_v_index:_bq._v_index });
}
	mesh.MMDrigids.forEach(function(v) {
		var skin, body;
// AT: treat all rigids as "static" when reseting physics
if ((mesh._reset_rigid_body_physics_>0 || (v._reset_physics_ && (!AP || !AP.data_id_locked["stepSimulation"])) || v.type === 0) && v.bone >= 0) {
  v._reset_physics_ = null
//		if (v.type === 0 && v.bone >= 0) {
			skin = mesh.bones[v.bone].skinMatrix;

			// ボーンの位置と回転を剛体へ変換
			_v.set( v.ofs[0], v.ofs[1], v.ofs[2] );
			_v.applyMatrix4( skin ); // ボーンorigin→剛体origin
// AT: matrixWorld_physics
_v.applyMatrix4(matrixWorld_physics);
//			_v.applyMatrix4( mesh.matrixWorld ); // モデルローカル→ワールド
			_q.setFromRotationMatrix( skin ); // ボーンのグローバル回転量。
			_q.multiplyQuaternions( _q, v.q ); // バインドポーズ時の回転量を加える。
			_q.multiplyQuaternions( _q2, _q ); // モデルローカル→ワールド

			// 剛体のワールド位置と回転。
			body = v.body;
// AT: ammo proxy
if (!use_optimized_command) {
// AT: probably not necessary for MMDPhysics
//			body.getMotionState().getWorldTransform( _btransform );
			//body.getWorldTransform( _btransform );
			_btransform.setOrigin( tmpBV( _v.x, _v.y, _v.z ) );
			_btransform.setRotation( tmpBQ( _q.x, _q.y, _q.z, _q.w ) );
// AT: From MMDPhysics
body.setCenterOfMassTransform( _btransform );
body.getMotionState().setWorldTransform( _btransform );
//			body.setWorldTransform( _btransform );
			//body.activate();
}
else {
  AP.add_optimized_command({ o:3, body_v_index:body._v_index, _v:_v, _q:_q });
}

		}
	});
};
MMDPhysi.prototype.postSimulate = function() { // 動的剛体→ボーン
// AT: afterPhysics
function update_afterPhysics(p) {
  for (var i = 0, i_max = p.children.length; i < i_max; i++) {
    var child = p.children[i]
    if (child instanceof THREE.Bone) {
      if (child.pmxBone.afterPhysics) {//mesh._bone_update_afterPhysics[child._index]) {
//DEBUG_show(Date.now())
        child.update( p.skinMatrix, false )
      }
      else
        update_afterPhysics(child)
    }
  }
}

	var mesh, b, bl;
	mesh = this.mesh;
// AT: ammo proxy
var model_index = mesh._model_index
var use_ammo_proxy = self.MMD_SA && AP && !Ammo_local;

var matrixWorld_physics = (mesh.matrixWorld_physics && mesh.matrixWorld_physics.m4) || mesh.matrixWorld;

var cache, cache_temp, ammo_proxy_cache_enabled
var use_optimized_command = false
if (use_ammo_proxy) {
  use_optimized_command = AP.use_optimized_command && !AP.use_text_command;
  cache = use_ammo_proxy && AP.cache_by_model.list[model_index]
  cache_temp = use_ammo_proxy && AP.cache_by_model_temp.list[model_index]
  ammo_proxy_cache_enabled = use_ammo_proxy && AP.cache_by_model.get_enabled(model_index)

  AP.cache_by_model_temp.set_matrixWorld(model_index, matrixWorld_physics)
  AP.cache_by_model_temp.set_skin(model_index, mesh.bones, ammo_proxy_cache_enabled)
}
// AT: matrixWorld_physics
_mtx2.getInverse(matrixWorld_physics)
//	_mtx2.getInverse( mesh.matrixWorld );
	_q3.setFromRotationMatrix( _mtx2 );
// AT: bone constraint, physics check, group rigid reset
var bc, ignore_physics
var bc_reset_group = {}
var model, model_para_obj, motion_name, motion_para, motion_para_per_model
var skin_filter
if (self.MMD_SA) {
  model = THREE.MMD.getModels()[model_index]
  model_para_obj = MMD_SA_options.model_para_obj_all[model_index]
  motion_name = (model.skin && MMD_SA.motion[model.skin._motion_index].filename) || ""
  motion_para = MMD_SA_options.motion_para[motion_name] || {}
  motion_para_per_model = (motion_para.adjustment_per_model && (motion_para.adjustment_per_model[MMD_SA.THREEX.get_model(model_index).model_path.replace(/^.+[\/\\]/, '')] || motion_para.adjustment_per_model[model_para_obj._filename_cleaned] || motion_para.adjustment_per_model._default_)) || motion_para;
  skin_filter = (model_para_obj.skin_filter_by_motion && (model_para_obj.skin_filter_by_motion.find(function (filter) { return filter.motion.test(motion_name); })||{}).skin) || motion_para_per_model.skin_filter || motion_para.skin_filter
//if (motion_name!="standby") DEBUG_show(motion_name+'/'+!!MMD_SA_options.motion_para[motion_name]+'/'+Date.now())
  bc = model_para_obj.bone_constraint
  if (bc) {
    if (bc.motion_filter && !bc.motion_filter.test(motion_name)) { bc = null; }
  }
  if (bc) {
    if (bc.group_skip) {
      for (var name in bc.group_skip) {
        if (bc.group_skip[name].motion_match.test(motion_name))
          bc_reset_group[name] = true
      }
    }
/*
    if (!bc._reset_group)
      bc._reset_group = {}
    for (var name in bc._reset_group) {
      if (bc._reset_group[name]) {
        bc_reset_group[name] = true
        if (--bc._reset_group[name] == 0)
          delete bc._reset_group[name]
//DEBUG_show(name,0,1)
      }
    }
*/
  }
//mesh._reset_rigid_body_physics_=0
  if (mesh._reset_rigid_body_physics_ > 0) {
    ignore_physics = true
    mesh._reset_rigid_body_physics_ = Math.max(mesh._reset_rigid_body_physics_ - Math.min(RAF_timestamp_delta/1000*30, 1), 0)
  }
//ignore_physics = false
//if (ignore_physics) DEBUG_show(9,0,1)
}
	mesh.MMDrigids.forEach(function(v) {
		var skin,tr,o,r,body;
		if ( v.type !== 0 && v.bone >= 0 ) {
			skin = mesh.bones[v.bone].skinMatrix;

// AT: update skin matrix from parent which has been modified by physics
if (v._skin_parent) {
  mesh.bones[v.bone].update(v._skin_parent.skinMatrix, false)//, true)//
//  mesh.bones[v.bone].updateMatrix(true)
//  skin.multiplyMatrices( v._skin_parent.skinMatrix, mesh.bones[v.bone].matrix );
}
		}
// AT: reset rigid bodies
if (v.bone == -1) return
var b_name = mesh.bones[v.bone].name
var skin_filtered = !ignore_physics && skin_filter && !skin_filter.test(b_name) && (!model_para_obj.skin_weight || !model_para_obj.skin_weight[b_name])
if (use_ammo_proxy && ignore_physics && (mesh._reset_rigid_body_physics_ <= 2)) {
// forced update of ammo_proxy physics, before ignore_physics ends.
  skin_filtered = true
}
if (ignore_physics || skin_filtered) {
  if (use_ammo_proxy && skin_filtered && ( v.type !== 0 && v.bone >= 0 )) {
if (use_optimized_command && !AP.locked) AP._locked = true;
tr = v.body.getCenterOfMassTransform();
r = tr.getRotation();
r.x(); r.y(); r.z(); r.w();
if (use_optimized_command && !AP.locked) { AP._locked = false; AP.add_optimized_command({ o:5, body_v_index:v.body._v_index }); }
if (v.type === 1) {
  if (use_optimized_command && !AP.locked) AP._locked = true;
  o = tr.getOrigin();
  o.x(); o.y(); o.z();
  if (use_optimized_command && !AP.locked) { AP._locked = false; AP.add_optimized_command({ o:6, body_v_index:v.body._v_index }); }
}
else {

				_v.set( v.ofs[0], v.ofs[1], v.ofs[2] );
				_v.applyMatrix4( skin ); // ボーンorigin→剛体origin
// AT: matrixWorld_physics
_v.applyMatrix4(matrixWorld_physics)
//				_v.applyMatrix4( mesh.matrixWorld ); // モデルローカル→ワールド

if (!use_optimized_command) {
				body = v.body;
				body.getMotionState().getWorldTransform( _btransform );
//console.log(body);//console.log(body.getMotionState());
				//body.getWorldTransform( _btransform );
				_btransform.setOrigin(tmpBV( _v.x, _v.y, _v.z ));
// AT: From MMDPhysics
body.setCenterOfMassTransform( _btransform );
body.getMotionState().setWorldTransform( _btransform );
}
else {
  AP.add_optimized_command({ o:4, body_v_index:v.body._v_index, _v:_v });
}

}
  }
//  return
}
else
		if ( v.type !== 0 && v.bone >= 0 ) {
			if (v.type === 2) {
				// ボーンの位置を覚えておく。
				_v3.getPositionFromMatrix(skin);
			}
// AT: ammo proxy
if (use_optimized_command && !AP.locked) AP._locked = true;
//tr = self._btransform2  = self._btransform2 || new Ammo.btTransform(); v.body.getMotionState().getWorldTransform(tr);
			tr = v.body.getCenterOfMassTransform();
			r = tr.getRotation();
			_q.set( r.x(), r.y(), r.z(), r.w() );
// AT: ammo proxy
if (use_optimized_command && !AP.locked) { AP._locked = false; AP.add_optimized_command({ o:5, body_v_index:v.body._v_index }); }
_q2.copy( v.q ).conjugate(); // _q2.copy( v.q ).inverse();
let _skip;
if (use_ammo_proxy) {
  if (!ammo_proxy_cache_enabled) {
    _q.multiplyQuaternions(MMD_SA.TEMP_q.setFromRotationMatrix(mesh.matrixWorld), _q.multiplyQuaternions(MMD_SA._q1.setFromRotationMatrix(skin), v.q));
  }
  else {
// NOTE: _q from physics is a relative rotation from bind pose and should have nothing to do with the rotation from "skin".
    _q.multiplyQuaternions( cache.q_matrixWorld_inv, _q );
    _skip = true
  }
}
if (!_skip)
			_q.multiplyQuaternions( _q3, _q ); // ワールド→モデルローカル
// moved
//			_q2.copy( v.q ).conjugate(); // _q2.copy( v.q ).inverse();
			_q.multiplyQuaternions( _q, _q2 ); // バインドポーズ時の回転量を減じる。

// AT: bone constraint
var _bc = bc && bc[b_name]
if (_bc) {
  var r_bc = _bc.rotation;
  var _q4 = r_bc._q
  if (!_q4)
    _q4 = r_bc._q = new THREE.Quaternion()
  _q2.setFromRotationMatrix(_mtx.extractRotation(skin)); // bone rotation (including parent bones' rotation) 
  _q4.copy(_q).multiply(_q2.conjugate()); // get local rotation relative to bone
  _v.setEulerFromQuaternion(_q4.normalize());
  var mod, reset
  if (bc_reset_group[_bc.group || "ALL"]) {
    reset = true
//DEBUG_show(b_name,0,1)
  }
  var _x = r_bc.x
  var _y = r_bc.y
  var _z = r_bc.z
  var limit = 45

  if (!reset && _x) {
    var _x0 = _x[0][0] - -_v.x
    var _x1 = -_v.x - _x[1][0]
    if (_x0 > 0) {
      mod = true
      if (_x0 > limit || _x[0][1]==true)
        reset = true
      else
        _v.x = (_x[0].length == 1) ? _x[0][0] : _x[0][1]
    }
    else if (_x1 > 0) {
      mod = true
      if (_x1 > limit || _x[1][1]==true)
        reset = true
      else
        _v.x = (_x[1].length == 1) ? _x[1][0] : _x[1][1]
    }
//_v.x = ((_x[0][0] < -59*Math.PI/180) ? -60*Math.PI/180 : ((_x[1][0] > 59*Math.PI/180) ? 60*Math.PI/180 : 0))*_t
    _v.x = -_v.x
  }
  if (!reset && _y) {
    var _y0 = _y[0][0] - _v.y
    var _y1 = _v.y - _y[1][0]
    if (_y0 > 0) {
      mod = true
      if (_y0 > limit || _y[0][1]==true)
        reset = true
      else
        _v.y = (_y[0].length == 1) ? _y[0][0] : _y[0][1]
    }
    else if (_y1 > 0) {
      mod = true
      if (_y1 > limit || _y[1][1]==true)
        reset = true
      else
        _v.y = (_y[1].length == 1) ? _y[1][0] : _y[1][1]
    }
//_v.y=0
  }
  if (!reset && _z) {
    var _z0 = _z[0][0] - -_v.z
    var _z1 = -_v.z - _z[1][0]
    if (_z0 > 0) {
      mod = true
      if (_z0 > limit || _z[0][1]==true)
        reset = true
      else
        _v.z = (_z[0].length == 1) ? _z[0][0] : _z[0][1]
    }
    else if (_z1 > 0) {
      mod = true
      if (_z1 > limit || _z[1][1]==true)
        reset = true
      else
        _v.z = (_z[1].length == 1) ? _z[1][0] : _z[1][1]
    }
//_v.z = ((_z[0][0] < -59*Math.PI/180) ? -60*Math.PI/180 : ((_z[1][0] > 59*Math.PI/180) ? 60*Math.PI/180 : 0))*_t
    _v.z = -_v.z
  }
//reset=false;mod=true;
/*
  if (mod) {
    if (!_bc._mod_count)
      _bc._mod_count = 0
    if (++_bc._mod_count >= 30) {
      bc._reset_group[_bc.group || "ALL"] = 10
      _bc._mod_count = 0
//DEBUG_show(b_name,0,1)
    }
  }
  else
    _bc._mod_count = 0
*/
  if (reset) {
    v._reset_physics_ = true
//DEBUG_show(b_name,0,1)
    return
  }

  if (mod) {
    _q2.conjugate()
/*
if (0&&mesh.bones[v.bone].name=="右前スカート") {
  _v2.setEulerFromQuaternion(_q2.normalize())
  DEBUG_show([parseInt(_v2.x*180/Math.PI),parseInt(_v2.y*180/Math.PI),parseInt(_v2.z*180/Math.PI)]+'/'+[parseInt(_v.x*180/Math.PI),parseInt(_v.y*180/Math.PI),parseInt(_v.z*180/Math.PI)],0,1)
}
*/
    _q2.multiply(_q4.setFromEuler(_v))
    _q.copy(_q2)

			_q4.copy(_q2)

// AT: matrixWorld_physics
_q2.setFromRotationMatrix(matrixWorld_physics)
//			_q2.setFromRotationMatrix( mesh.matrixWorld );

			// ボーンの位置と回転を剛体へ変換
			_v.set( v.ofs[0], v.ofs[1], v.ofs[2] );
			_v.applyMatrix4( skin ); // ボーンorigin→剛体origin
// AT: matrixWorld_physics
_v.applyMatrix4(matrixWorld_physics)
//			_v.applyMatrix4( mesh.matrixWorld ); // モデルローカル→ワールド
			_q.setFromRotationMatrix( skin ); // ボーンのグローバル回転量。
			_q.multiplyQuaternions( _q, v.q ); // バインドポーズ時の回転量を加える。
			_q.multiplyQuaternions( _q2, _q ); // モデルローカル→ワールド

			// 剛体のワールド位置と回転。
			body = v.body;
// AT: ammo proxy
if (!use_optimized_command) {
// AT: probably not necessary for MMDPhysics
//			body.getMotionState().getWorldTransform( _btransform );
			//body.getWorldTransform( _btransform );
			_btransform.setOrigin( tmpBV( _v.x, _v.y, _v.z ) );
			_btransform.setRotation( tmpBQ( _q.x, _q.y, _q.z, _q.w ) );
// AT: From MMDPhysics
body.setCenterOfMassTransform( _btransform );
body.getMotionState().setWorldTransform( _btransform );
//			body.setWorldTransform( _btransform );
}
else {
//DEBUG_show(9,0,1)
  AP.add_optimized_command({ o:3, body_v_index:body._v_index, _v:_v, _q:_q });
}

			_q.copy(_q4);

  }
}

//_q.setFromRotationMatrix(skin)
var skin_pos = MMD_SA.TEMP_v3.getPositionFromMatrix(skin);
//var skin_m4 = MMD_SA._m4b.copy(skin);
			skin.makeRotationFromQuaternion(_q);
// NOTE: skin will just be a rotation for a while.
			if (v.type === 1) {
// AT: ammo proxy
if (use_optimized_command && !AP.locked) AP._locked = true;
				o = tr.getOrigin();
				_v.set( o.x(), o.y(), o.z() );
// AT: ammo proxy
if (use_optimized_command && !AP.locked) { AP._locked = false; AP.add_optimized_command({ o:6, body_v_index:v.body._v_index }); }
let _skip;
if (use_ammo_proxy) {
  if (!ammo_proxy_cache_enabled) {
    _v.copy(MMD_SA._v3a.set(v.ofs[0], v.ofs[1], v.ofs[2]).applyMatrix4(skin)).add(skin_pos).applyMatrix4(matrixWorld_physics);
  }
  else {
    _v.applyProjection(cache.matrixWorld_inv);
    _skip = true
  }
}
if (!_skip)
				_v.applyProjection( _mtx2 ); // ワールド→モデルローカル
				_v2.set( v.ofs[0], v.ofs[1], v.ofs[2] ).negate();
				_v2.applyMatrix4( skin ); // 剛体origin→ボーンorigin
				_v.add( _v2 );
				skin.setPosition( _v );

// AT: ammo proxy
ammo_proxy_cache_enabled && skin.setPosition(_v.sub(MMD_SA._v3a_.getPositionFromMatrix(cache.skin[v.bone])).add(MMD_SA._v3b_.getPositionFromMatrix(cache_temp._skin[v.bone])));

			} else {

				// type=2は剛体の回転のみ適用して位置はボーンのをそのまま使う。
				// したがって剛体側の位置をボーンのに合わせるようにする。
				skin.setPosition( _v3 );

				_v.set( v.ofs[0], v.ofs[1], v.ofs[2] );
				_v.applyMatrix4( skin ); // ボーンorigin→剛体origin
// AT: matrixWorld_physics
_v.applyMatrix4(matrixWorld_physics)
//				_v.applyMatrix4( mesh.matrixWorld ); // モデルローカル→ワールド

				body = v.body;
// AT: ammo proxy
if (!use_optimized_command) {
				body.getMotionState().getWorldTransform( _btransform );
//console.log(body);//console.log(body.getMotionState());
				//body.getWorldTransform( _btransform );
				_btransform.setOrigin(tmpBV( _v.x, _v.y, _v.z ));
// AT: From MMDPhysics
body.setCenterOfMassTransform( _btransform );
body.getMotionState().setWorldTransform( _btransform );
//				body.setWorldTransform( _btransform );
				//body.activate();
}
else {
  AP.add_optimized_command({ o:4, body_v_index:body._v_index, _v:_v });
}

			}

		}

// AT: ammo proxy
use_ammo_proxy && AP.register([r,o])

	});

// AT: afterPhysics
if (self.MMD_SA && MMD_SA.use_afterPhysics) {
  for (var b_index in mesh._bone_update_afterPhysics) {
    var bone = mesh.bones[b_index]
    if (bone.parent instanceof THREE.Bone) {
      _mtx.multiplyMatrices(MMD_SA.TEMP_m4.getInverse(bone.parent.skinMatrix), bone.skinMatrix)
    }
    else {
      _mtx.copy(bone.skinMatrix)
    }
    bone.position.getPositionFromMatrix(_mtx)
    bone.quaternion.setFromRotationMatrix(_mtx)
  }

  model._update_IK_and_AddTrans(true)

  for ( var i = 0, l = mesh.children.length; i < l; i ++ ) {
    child = mesh.children[ i ];
    if ( child instanceof THREE.Bone) {
      if (child.pmxBone.afterPhysics) {// mesh._bone_update_afterPhysics[child._index]) {
        child.update( mesh.identityMatrix, false )
      }
      else
        update_afterPhysics(child)
    }
  }
}

	// skinMatrixを書き換えたのでboneMatricesを更新。
	for (b = 0, bl = mesh.bones.length; b < bl; b ++ ) {
		_mtx.multiplyMatrices(mesh.bones[b].skinMatrix, mesh.boneInverses[b] );
		_mtx.flattenToArrayOffset( mesh.boneMatrices, b*16 );
	}
	if (mesh.useVertexTexture) {
		mesh.boneTexture.needsUpdate = true;
	}
};
MMDPhysi.prototype.reset = function() { // 初期位置と回転を剛体に設定してリセット。
	var mesh;
	mesh = this.mesh;
	mesh.updateMatrixWorld( true ); // いつ呼ばれるか分からないからこれ必要。
// AT: matrixWorld_physics
if (mesh.matrixWorld_physics) mesh.matrixWorld_physics.update()
var matrixWorld_physics = (mesh.matrixWorld_physics && mesh.matrixWorld_physics.m4) || mesh.matrixWorld;
_q2.setFromRotationMatrix(matrixWorld_physics)
//	_q2.setFromRotationMatrix( mesh.matrixWorld );
	mesh.MMDrigids.forEach( function( v ) {
		var body;
// AT: matrixWorld_physics
_v.set( v.pos[0], v.pos[1], v.pos[2] ).applyMatrix4(matrixWorld_physics)
//		_v.set( v.pos[0], v.pos[1], v.pos[2] ).applyMatrix4( mesh.matrixWorld );
		_q.multiplyQuaternions( _q2, v.q );
		body = v.body;
		body.getMotionState().getWorldTransform( _btransform );
		_btransform.setOrigin( tmpBV( _v.x, _v.y, _v.z ) );
		_btransform.setRotation( tmpBQ( _q.x, _q.y, _q.z, _q.w ) );
		body.setWorldTransform( _btransform );
	});

// AT: ammo proxy
self.MMD_SA && AP && AP.update_worker()

};

}()); // physics

// cubic bezier solver : p0=(0,0), p1=(x1,y1), p2=(x2,y2), p3=(1,1)
cubicBezier = (function() {
	var ax, bx, cx, ay, by, cy, epsilon,
		getX = function(t) {
			return ((ax * t + bx) * t + cx) * t;
		},
		getY = function(t) {
			return ((ay * t + by) * t + cy) * t;
		},
		getXD = function(t) {
			return (3 * ax * t + 2 * bx) * t + cx;
		},
		x2t = function(x) { // x に対応するベジェ曲線上の t を求める。
			var t0, t1, t2, x2, d2, i;

			// まずニュートン法でやる。
			// 収束は早いが安定しない（振動する）ことがあるので、ある一定回数だけ試行させる。
			t2 = x;
			for (i = 0; i < 8; i++) {
				x2 = getX(t2) - x;
				if (Math.abs(x2) < epsilon) {
					return t2;
				}
				d2 = getXD(t2);
				if (Math.abs(d2) < 1e-6) {
					break;
				}
				t2 -= x2 / d2;
			}

			// ニュートン法でうまく行かなかった場合は２分法でやり直す。
			// ニュートン法よりは収束は遅いが、安定的に求まる。
			t0 = 0;
			t1 = 1;
			t2 = x;
			if (t2 < t0) {
				return t0;
			}
			if (t2 > t1) {
				return t1;
			}
			while (t0 < t1) {
				x2 = getX(t2);
				if (Math.abs(x2 - x) < epsilon) {
					return t2;
				}
				if (x > x2) {
					t0 = t2;
				} else {
					t1 = t2;
				}
				t2 = (t1 - t0) * 0.5 + t0;
			}
			return t2;
		},
		solver = function( x, x1, y1, x2, y2, eps ) {
			epsilon = eps;
			cx = 3 * x1;
			bx = 3 * (x2 - x1) - cx;
			ax = 1 - cx - bx;
			cy = 3 * y1;
			by = 3 * (y2 - y1) - cy;
			ay = 1 - cy - by;
			return getY(x2t(x));
		};
	return solver;
}());

// key animation handler
Animation = function( targets, duration ) {
	// 基本的には、このクラスを継承し、onupdate をオーバーライドして使うこと。
	// 各ターゲットには keys 、各キーには time のプロパテイが存在している前提なので注意！
	// 補間するには最低２個のキーが必要。そうなってない場合は対象外にする。
	// 各ターゲットの最終キーの time が同じになってないと、
	// ループするたびに各ターゲット間のタイミングがずれて行くことになるので注意！
	if ( !(targets instanceof Array) ) {
		targets = [ targets ]; // convert to array
	}
	this.targets = targets;
	this.duration = duration;
// AT: duration_default
this.duration_default = duration
	this.loop = false;
	this.playing = false;
	/* this.resetOnLoop = false; */
	this.minKeyDelta = 0;
	this.reset();
};
Animation.prototype.reset = function() {
	this.time = 0;
	this.targets.forEach( function( v ) {
		v.k = 0;
	});
};
Animation.prototype.seek = function( time, forceUpdate ) {
	var dt;
	dt = time - this.time;
	if ( dt >= 0 ) {
		this.update( dt, forceUpdate );
	} else {
		this.reset();
		this.update( time, forceUpdate );
	}
};
Animation.prototype.play = function( loop ) {
	// 引数なしの場合は以前のloop設定に従う。
	if ( loop !== undefined ) {
		this.loop = loop;
	}
	this.playing = true;
};
Animation.prototype.pause = function() {
	this.playing = false;
};
Animation.prototype.update = function( dt, force ) {
	var that, now, ended;
	if ( /*!force && (remove by jThree)*/ !this.playing ) {
		return;
	}
	//if ( dt < 0 ) {
	//	return;
	//}
	that = this;
	now = this.time + dt;
	this.time = now % this.duration;
	ended = false;

	if ( this.time < 0 ) return;//add by jThree

// AT: freeze_onended_finished, morph_to_skip, MMDmorphs
var freeze_onended_finished;
var morph_to_skip = {};
var MMDmorphs = (this._model_index != null) && THREE.MMD.getModels()[this._model_index].pmx.morphs;
var ca_index = (this._motion_index_MMD_SA_extra != null) ? this._motion_index_MMD_SA_extra : this._motion_index-MMD_SA.custom_action_index;

	this.targets.forEach( function( v, idx ) {
// AT: bone index
if (v.i != null) idx = v.i;

		var currKey, nextKey, ratio;
		if ( v.keys.length < 2 ) {
// AT: Special case for single-frame animation
if ((v.keys.length==1) && that._is_MMD_SA_animation) {
  currKey = v.keys[ 0 ]; //getKey( v, 0 );
  ratio = 0
  that.onupdate( currKey, currKey, ratio, idx );
}
			return; // skip
		}
		currKey = v.keys[ v.k ]; //getKey( v, v.k );
		nextKey = v.keys[ v.k+1 ]; //getKey( v, v.k+1 );
// AT: morph skip for childs of group morph
if (morph_to_skip[nextKey.name]) {
//DEBUG_show(nextKey.name,0,1)
  return
}
if (nextKey.morph_type == 0) {
//if (!MMDmorphs[nextKey.morph_index]) console.log(nextKey,MMDmorphs)
  MMDmorphs[nextKey.morph_index].items.forEach(function (m) {
    morph_to_skip[MMDmorphs[m.target].name] = true
  });
}
		if ( nextKey.time <= now ) {
			if ( that.time < now ) {
				ended = true;
// AT: Freeze on end
if (that.freeze_onended) {
  ended = false; //skip default loop/onended handle
  if (that._is_MMD_SA_custom_animation && that._is_skin && !freeze_onended_finished) {
    freeze_onended_finished = true
    MMD_SA_options.custom_action[ca_index].onFinish(that._model_index)
  }
  that.time = that.duration - (1/59)/1000
  ratio = 1
  if (!that._MMD_SA_animation_check || that._MMD_SA_animation_check(idx)) {
    that.onupdate( currKey, nextKey, ratio, idx );
    return
  }
}
else
				if ( that.loop /* && !that.resetOnLoop */ ) {
					jThree.MMD._onLoop = true;
					v.k = 0;
					currKey = v.keys[ v.k ]; //getKey( v, v.k );
					nextKey = v.keys[ v.k+1 ]; //getKey( v, v.k+1 );
					while ( nextKey.time < that.time ) {
						v.k++;
						currKey = v.keys[ v.k ]; //getKey( v, v.k );
						nextKey = v.keys[ v.k+1 ]; //getKey( v, v.k+1 );
					}
				} else {
					that.time = nextKey.time;
				}
			} else {
				do {
					v.k++;
					currKey = v.keys[ v.k ]; //getKey( v, v.k );
					nextKey = v.keys[ v.k+1 ]; //getKey( v, v.k+1 );
				} while ( nextKey.time < that.time );
			}
		}
		if ( nextKey.time - currKey.time <= that.minKeyDelta ) {
			// VMDではタイミングはフレーム番号で管理されており、
			// １フレーム＝1/30秒、つまり30fpsを想定している。
			// 本実装ではフレームではなく秒で管理している。
			// 例えばVMD的にはカメラを１フレームで瞬時に切り替える設定になっていても、
			// 1/60秒で駆動すると２フレームを生成することになるため、
			// 中間フレームの挿入によって瞬時に切り替わった感じがしない。
			// 処理上は間違っているわけではないのだが、視覚的には少々見苦しくなる(^_^;)
			// そこで２つのキーの間隔がある一定時間以下の場合は
			// ratioをゼロに固定してこの現象を回避する。
			// 基本的にはカメラとライトモーションだけに適用すればよいと思う。
			ratio = 0;
		} else {
// AT: bug?
if (that.time < currKey.time) { ratio = 0; } else
			ratio = ( that.time - currKey.time ) / ( nextKey.time - currKey.time );
		}
// AT: custom animation check
if (!that._MMD_SA_animation_check || that._MMD_SA_animation_check(idx))
		that.onupdate( currKey, nextKey, ratio, idx );
	});
// AT: special case for "empty" skin animation
if (that.freeze_onended && (that._is_MMD_SA_custom_animation && that._is_skin && !freeze_onended_finished) && (now > that.duration)) {
  MMD_SA_options.custom_action[ca_index].onFinish(that._model_index)
}
	if ( ended ) {
		if ( !this.loop ) {
			this.pause();
		}
		if ( this.onended ) {
			this.onended( this );
		}
		/* if ( this.loop && this.resetOnLoop ) {
			this.reset();
		} */
	}
};
Animation.prototype.adjustDuration = function( duration ) {
	// アニメーション時間を調整する（引き伸ばす）。
	// 複数のアニメーション間におけるループタイミングを一致させるために使われることを想定している。
// AT: duration_default
if ( this.duration_default > duration ) {
  duration = this.duration_default
//	if ( this.duration >= duration ) {
		return;
	}
	this.duration = duration;
	this.targets.forEach( function( v ) {
		var keys, last;
		keys = v.keys;
		if ( keys.length < 2 ) {
			return;
		}
		last = keys[ keys.length - 1 ];
		if ( last.time < duration ) {
			last = cloneKey( last );
			last.time = duration;
			keys.push( last );
			//console.log( 'extend duration = ' + duration);
		}
	});
};
/* Animation.prototype.onupdate = function( currKey, nextKey, ratio, targetIdx ) {
	// need to override
}; */

// vertex morphing animaion
MMDMorph = function( mesh, animation ) { // extend Animation
	var geo, targets;
	this.mesh = mesh;
	Animation.call( this, animation.targets, animation.duration );

	// setup morph targets
	targets = animation.targets;
	geo = mesh.geometry;
// AT: Make morphs from extra motions work, by rearranging "targets" to match the existing "morphTargets", to avoid unnecessary mesh updates, which may cause errors.
//	geo.morphTargets = [];//
//DEBUG_show(targets.length,0,1)
var that = this;
var _morphTargets_new = [];
var _morphTargets_used = 0;
var _targets_arranged = [];
var _targets_new = [];
var _idx = 0;
var idx_new = (geo.morphTargets) ? geo.morphTargets.length : 0;
if (!geo._morphTargets_index) { geo._morphTargets_index = {}; }
	geo.MMDmorphs.forEach( function( v ) {
if (v.type != 1) { return; }
		var target, vertices, idx;
//		idx = geo.morphTargets.length;
idx = _idx;
		if ( idx < targets.length && v.name === targets[ idx ].keys[0].name ) {
_idx++;
if (geo._morphTargets_index[v.name] != null) {
//DEBUG_show(v.name,0,1)
  _morphTargets_used++;
  _targets_arranged[geo._morphTargets_index[v.name]] = targets[ idx ]
  return;
}
geo._morphTargets_index[v.name] = idx_new++;
_targets_new.push(targets[ idx ]);
//DEBUG_show(v.name,0,1)
}
else { return }
			vertices = [];
			geo.vertices.forEach( function( w ) {
				vertices.push( w.clone() );
			});
			v.items.forEach( function( w ) {
				var p = vertices[ w.target ];
				p.x += w.offset[0];
				p.y += w.offset[1];
				p.z += w.offset[2];
			});
			target = {};
			target.name = v.name;
			target.vertices = vertices;
//			geo.morphTargets.push( target );
_morphTargets_new.push( target );
//		}
	});
// NOTE: The targets of the very first VMD motion (ie. _morphTargets_used == false) doesn't need to be rearranged.
if (_morphTargets_used) {
// simple MorphMaterial support, and other non-vertex morphs
// NOTE: non-vertex morphs are always behind vertex morphs, so they don't and shouldn't affect vertex morphs processing.
  while (_idx < targets.length) {
    if (targets[_idx].keys[0].morph_type != 1) {
      _targets_new.push(targets[_idx]);
    }
    _idx++;
  }
  geo.morphTargets.forEach(function (v, idx) {
    if (!_targets_arranged[idx])
      _targets_arranged[idx] = { keys:[{name:v.name, weight:0, morph_type:1}] }
  });
  this.targets = _targets_arranged.concat(_targets_new);
}
if (_morphTargets_new.length) {
  geo.morphTargets = (geo.morphTargets) ? geo.morphTargets.concat(_morphTargets_new) : _morphTargets_new;
}
// NOTE: to make the model cloning system works, morphTargets has to be updated every time even if _morphTargets_new is empty.
//else return
//console.log(mesh._model_index+':'+targets.length+'/'+_morphTargets_used+'/'+geo.morphTargets.length)

	if ( geo.morphTargets.length > 0 ) {
		geo.morphTargetsNeedUpdate = true;
		mesh.updateMorphTargets();
		mesh.material.materials.forEach( function( v ) {
			v.morphTargets = true;
			v.needsUpdate = true;
		});
	}

	//this.update(0);
};
MMDMorph.prototype = Object.create( Animation.prototype );
MMDMorph.prototype.constructor = MMDMorph;

MMDMorph.prototype.onupdate = function( currKey, nextKey, ratio, idx) {
// AT: simple MorphMaterial support, and other non-vertex morphs
// jThree.js | line:18377 | if ( activeInfluenceIndices.length > material.numSupportedMorphTargets )
var that = this
var weight = currKey.weight + ( nextKey.weight - currKey.weight ) * ratio;
var mesh = this.mesh
var geo = mesh.geometry
var weight_last = geo.morphs_weight_by_name[currKey.name]
geo.morphs_weight_by_name[currKey.name] = weight
//if (currKey.morph_type==1 && mesh.morphTargetInfluences[idx]) DEBUG_show(currKey.name,0,1)
//if (mesh._model_index==1 && currKey.name=="band4") DEBUG_show(weight+'/'+mesh.morphTargetInfluences[idx]+'\n'+Date.now())

if (currKey.morph_type == 0) {
  var morph_index = currKey.morph_index
  var pmx_morph = geo.MMDmorphs[morph_index]

  pmx_morph.items.forEach(function (m) {
    var cm = geo.MMDmorphs[m.target]
    var child_key = { name:cm.name, weight:weight*m.weight, morph_type:cm.type, morph_index:m.target }
    that.onupdate(child_key, child_key, 0, geo._morphTargets_index[cm.name]||0)
  });
}
// bone morph
else if (currKey.morph_type == 2) {
  var morph_index = currKey.morph_index
  var pmx_morph = geo.MMDmorphs[morph_index]

  pmx_morph.items.forEach(function (m) {
    var bone_name = mesh.bones[m.target].name
    var bm = mesh._bone_morph
    bm = bm[bone_name] = bm[bone_name] || {};
    bm = bm[morph_index] = bm[morph_index] || { weight:0, pos_v3:new THREE.Vector3(), rot_q:new THREE.Quaternion() };

    if (bm.weight >= Math.abs(weight))
      return
    bm.weight = Math.abs(weight)

    if (m.pos_v3) {
      bm.pos_v3.copy(m.pos_v3).multiplyScalar(weight)
    }
    else
      bm.pos_v3.set(0,0,0)

    if (m.rot_q) {
//      var axis_angle = m.rot_q.toAxisAngle()
//      bm.rot_q.setFromAxisAngle(axis_angle[0], axis_angle[1]*weight)
      bm.rot_q.set(0,0,0,1).slerp(m.rot_q, weight)
//console.log(bone_name, that.time, weight, currKey.weight, nextKey.weight, ratio)
    }
    else
      bm.rot_q.set(0,0,0,1)
  });
}
// material morph
else if (currKey.morph_type == 8) {
  var morph_index = currKey.morph_index
  var pmx_morph = geo.MMDmorphs[morph_index]
  pmx_morph.items.forEach(function (m) {
    if (m.target == -1)
      return

    var material = mesh.material.materials[m.target]
// to ensure that .refreshUniforms (where ._material_morph is processed) is executed once (especially when opacity is changed from 0 to other value)
    material._render_once = true

    var m_name = material.name
    var m_obj = mesh._material_morph[m_name]
    if (!m_obj)
      m_obj = mesh._material_morph[m_name] = {}
    m_obj[morph_index] = { weight:weight, morph_obj:m }
  });
}
// UV morph support
else if ( currKey.morph_type >= 3 && currKey.morph_type <= 7 ) {
  if (weight_last == weight)
    return

  var morph_index = currKey.morph_index
  var pmx_morph = geo.MMDmorphs[morph_index]

  if (!geo._faceVertexUvs)
    geo._faceVertexUvs = [[]]

  pmx_morph.items.forEach(function (m, idx) {
var v = m.target
var faces = geo._face_index_by_vertex[v]
if (!faces)
  return
//if (idx==0) DEBUG_show(m.uv,0,1)
faces.forEach(function (f) {
  var fi = f[0]
  var f_uv  = geo.faceVertexUvs[0][fi]
  var _f_uv = geo._faceVertexUvs[0][fi]
  if (!_f_uv)
    _f_uv = geo._faceVertexUvs[0][fi] = [f_uv[0].clone(), f_uv[1].clone(), f_uv[2].clone()]

  var _i = f[1]
  f_uv[_i].x = _f_uv[_i].x + m.uv[0] * weight
  f_uv[_i].y = _f_uv[_i].y + m.uv[1] * weight
});
  });

  geo.uvsNeedUpdate = true;
//  geo.buffersNeedUpdate = true;
//  DEBUG_show(pmx_morph.name,0,1)
}
else if ((weight > mesh.morphTargetInfluences[idx]) || currKey.override_weight)
	this.mesh.morphTargetInfluences[idx] = weight//currKey.weight + ( nextKey.weight - currKey.weight ) * ratio;
};

(function() { // MMDSkin

var slerp, bezierp, _q;

slerp = function( qa, qb, qm, t ) {
	var cosHalfTheta, halfTheta, sinHalfTheta, ratioA, ratioB;
	cosHalfTheta =  qa[0] * qb[0] + qa[1] * qb[1] + qa[2] * qb[2] + qa[3] * qb[3];
	if ( cosHalfTheta < 0 ) {
		qm[0] = -qb[0];
		qm[1] = -qb[1];
		qm[2] = -qb[2];
		qm[3] = -qb[3];
		cosHalfTheta = -cosHalfTheta;
	} else {
		qm[0] = qb[0];
		qm[1] = qb[1];
		qm[2] = qb[2];
		qm[3] = qb[3];
	}
	if ( Math.abs( cosHalfTheta ) >= 1.0 ) {
		qm[0] = qa[0];
		qm[1] = qa[1];
		qm[2] = qa[2];
		qm[3] = qa[3];
		return;
	}
	halfTheta = Math.acos( cosHalfTheta );
	sinHalfTheta = Math.sqrt( 1.0 - cosHalfTheta * cosHalfTheta );
	if ( Math.abs( sinHalfTheta ) < 0.001 ) {
		qm[0] = 0.5 * ( qa[0] + qm[0] );
		qm[1] = 0.5 * ( qa[1] + qm[1] );
		qm[2] = 0.5 * ( qa[2] + qm[2] );
		qm[3] = 0.5 * ( qa[3] + qm[3] );
		return;
	}
	ratioA = Math.sin( ( 1 - t ) * halfTheta ) / sinHalfTheta;
	ratioB = Math.sin( t * halfTheta ) / sinHalfTheta;
	qm[0] = qa[0] * ratioA + qm[0] * ratioB;
	qm[1] = qa[1] * ratioA + qm[1] * ratioB;
	qm[2] = qa[2] * ratioA + qm[2] * ratioB;
	qm[3] = qa[3] * ratioA + qm[3] * ratioB;
};

bezierp = function( x, interp, which ) {
	// which: 0=x, 1=y, 2=z, 3=rot
	return cubicBezier( x, interp[ which ] / 127, interp[ which + 4 ] / 127, interp[ which + 8 ] / 127, interp[ which + 12 ] / 127, 1 / 128 );
};

_q = [0,0,0,1];

// bone skinning animation
MMDSkin = function( mesh, animation ) { // extend Animation
	this.mesh = mesh;
	Animation.call( this, animation.targets, animation.duration );
	//this.update(0);

// AT: _timeMax
this._timeMax = animation._timeMax;
};
MMDSkin.prototype = Object.create( Animation.prototype );
MMDSkin.prototype.constructor = MMDSkin;

// AT: motion_blending support
MMDSkin.prototype.onupdate = (function () {
  var pos = new THREE.Vector3()
  var rot = new THREE.Quaternion()
  var scale1 = {x:1,y:1,z:1}

  return function( currKey, nextKey, ratio, idx ) {
	var bone = this.mesh.bones[ idx ],
		gbone = this.mesh.geometry.bones[ idx ],
		interp;
// AT: geometry bone custom adjustment
let motion_para
if (self.MMD_SA) {
  let model_para_obj = MMD_SA_options.model_para_obj_all[this.mesh._model_index];
  let motion_name
  if ((this._motion_index != null) && MMD_SA.motion[this._motion_index]) {
    motion_name = MMD_SA.motion[this._motion_index].filename
  }
  else {
    let model_skin = THREE.MMD.getModels()[this.mesh._model_index].skin
    if (model_skin) {
      motion_name = MMD_SA.motion[model_skin._motion_index].filename
    }
  }
  motion_para = MMD_SA_options.motion_para[motion_name];
  let motion_sd = motion_para && motion_para.adjustment_per_model && (motion_para.adjustment_per_model[MMD_SA.THREEX.get_model(this.mesh._model_index).model_path.replace(/^.+[\/\\]/, '')] || motion_para.adjustment_per_model[model_para_obj._filename_cleaned] || motion_para.adjustment_per_model._default_);
  motion_sd = (motion_sd && motion_sd.skin_default) || {};
  let sd = motion_sd[gbone.name] || model_para_obj.skin_default[gbone.name]
  if (sd && sd.gpos_add) {
    let pos_new = []
    gbone.pos.forEach(function (v, idx) {
      pos_new[idx] = v + sd.gpos_add[idx]
    });
    gbone = { name:gbone.name, pos:pos_new }
  }
}
	//if (nextKey.interp) { // curr ではなく next 側を参照のこと。
		interp = nextKey.interp;
		// cubic bezier
// AT: motion_blending support
pos.x = gbone.pos[0] + currKey.pos[0] + ( nextKey.pos[0] - currKey.pos[0] ) * bezierp( ratio, interp, 0 );
pos.y = gbone.pos[1] + currKey.pos[1] + ( nextKey.pos[1] - currKey.pos[1] ) * bezierp( ratio, interp, 1 );
pos.z = gbone.pos[2] + currKey.pos[2] + ( nextKey.pos[2] - currKey.pos[2] ) * bezierp( ratio, interp, 2 );
slerp( currKey.rot, nextKey.rot, _q, bezierp( ratio, interp, 3) );
rot.x = _q[0];
rot.y = _q[1];
rot.z = _q[2];
rot.w = _q[3];

if (this._blending_ratio_ == null) {
  bone.position.copy(pos)
  bone.quaternion.copy(rot)
}
else {
  let ratio = this._blending_ratio_
/*
  if (gbone.name == "左足ＩＫ")
    ratio = Math.pow(ratio, 2)
  else if (gbone.name == "右足ＩＫ")
    ratio = Math.pow(ratio, 0.5)
*/
  let pos_updated = false
  if (motion_para && motion_para.bone_to_position) {
    let b_name = (gbone.name.indexOf("足ＩＫ") != -1) ? "センター" : gbone.name;
    let b_target = motion_para.bone_to_position.find(b=>b.name==b_name);
    if (b_target) {
      let scale = b_target.scale || scale1
      bone.position.x += (pos.x - bone.position.x) * ratio * (1-scale.x)
      bone.position.y += (pos.y - bone.position.y) * ratio * (1-scale.y)
      bone.position.z += (pos.z - bone.position.z) * ratio * (1-scale.z)
      pos_updated = true
    }
  }
  if (!pos_updated)
    bone.position.lerp(pos, ratio)

  bone.quaternion.slerp(rot, this._blending_ratio_)
}
/*
		bone.position.x = gbone.pos[0] + currKey.pos[0] + ( nextKey.pos[0] - currKey.pos[0] ) * bezierp( ratio, interp, 0 );
		bone.position.y = gbone.pos[1] + currKey.pos[1] + ( nextKey.pos[1] - currKey.pos[1] ) * bezierp( ratio, interp, 1 );
		bone.position.z = gbone.pos[2] + currKey.pos[2] + ( nextKey.pos[2] - currKey.pos[2] ) * bezierp( ratio, interp, 2 );
		slerp( currKey.rot, nextKey.rot, _q, bezierp( ratio, interp, 3) );
		bone.quaternion.x = _q[0];
		bone.quaternion.y = _q[1];
		bone.quaternion.z = _q[2];
		bone.quaternion.w = _q[3];
*/
	//} else {
	//	// linear
	//	bone.position.x = currKey.pos[0] + ( nextKey.pos[0] - currKey.pos[0] ) * ratio;
	//	bone.position.y = currKey.pos[1] + ( nextKey.pos[1] - currKey.pos[1] ) * ratio;
	//	bone.position.z = currKey.pos[2] + ( nextKey.pos[2] - currKey.pos[2] ) * ratio;
	//	slerp( currKey.rot, nextKey.rot, _q, ratio );
	//	bone.quaternion.x = _q[0];
	//	bone.quaternion.y = _q[1];
	//	bone.quaternion.z = _q[2];
	//	bone.quaternion.w = _q[3];
	//}
  };
})();

// AT: make skin.onupdate portable (mainly for ._custom_skin)
MMD_SA._skin_onupdate = MMDSkin.prototype.onupdate

}()); // MMDSkin

(function() { // MMDAddTrans
// 「付与」による変形。

var dv, dq, _v, _v2, _q, _q2;

// delta transform
dv = new THREE.Vector3();
dq = new THREE.Quaternion();

// temporary
_v = new THREE.Vector3();
_v2 = new THREE.Vector3();
_q = new THREE.Quaternion();
_q2 = new THREE.Quaternion();

// additional transform
MMDAddTrans = function( pmx, mesh ) {
	var bones;
	this.mesh = mesh;
	bones = []; // 対象ボーン
	mesh.bones.forEach( function( v, i ) {
		var at, ref;
// AT: defined elsewhere
//		v.pmxBone = pmx.bones[i]; // meshのboneからpmxのboneを参照できるようにする。
		at = v.pmxBone.additionalTransform;
		if ( at && at[0] >= 0 && at[1] !== 0 ) {
			// 付与で参照されるボーンには、変形量の差分を求めるためのプロパティを追加。
			ref = mesh.bones[ at[0] ];
			ref.basePosition = ref.position.clone();
			ref.baseQuaternion = ref.quaternion.clone();
			ref.baseSkinMatrix = ref.skinMatrix.clone();
			/* とりあえず考慮しない。
			if ( ( v.pmxBone.flags & 0x1000 ) !== 0 ) {
				// 物理演算後変形。
				return;
			} */
			bones.push( v );
		}
	});
	bones.sort( function( a, b ) {
		// 変形階層で昇順にソート。
		return a.pmxBone.deformHierachy - b.pmxBone.deformHierachy;
	});
	this.hasGlobal = bones.some( function( v ) { 
		// boneローカルな変形量ではなく、グローバルなskinMatrixを参照するかどうか。
		return ( (v.pmxBone.flags & 0x80) !== 0 );
	});
// AT: treat all transforms as local
this.hasGlobal = false
	this.bones = bones;
};
// AT: para
MMDAddTrans.prototype.update = function(para) {
	var mesh;
	mesh = this.mesh;
	if ( this.hasGlobal ) {
		mesh.updateMatrixWorld(); // bone の skinMatrix を更新させる。
	}
// AT: para
var a_ini = 0
var a_end = this.bones.length-1
if (para) {
  a_ini = para.ini
  a_end = para.end || a_ini
}
for (var i = a_ini, i_max = a_end; i <= i_max; i++) {
  var v = mesh._IK_and_AddTrans[i]
//	this.bones.forEach( function( v ) {
		var at, ref, weight;
		at = v.pmxBone.additionalTransform;
		ref = mesh.bones[ at[0] ];
		// get delta transform
		// deltaPosition = position - basePosition
		// deltaQuaternion = quaternion - baseQuaternion
// AT: treat all transforms as local (false&&)
		if (false&&(v.pmxBone.flags & 0x80 ) !== 0 ) {
			// 未検証。
			_v.getPositionFromMatrix( ref.skinMatrix );
			_v2.getPositionFromMatrix( ref.baseSkinMatrix );
			dv.subVectors( _v, _v2 );
			_q.setFromRotationMatrix( ref.skinMatrix );
			_q2.setFromRotationMatrix( ref.baseSkinMatrix );
			dq.multiplyQuaternions( _q2.conjugate() , _q );
//dq = _q2.clone()
//if (ref.name=="右中指３") DEBUG_show(_q.toArray()+'\n\n'+ref.quaternion.toArray())
		} else {
			dv.subVectors( ref.position, ref.basePosition );
			//dq.multiplyQuaternions( _q.copy( ref.baseQuaternion ).conjugate() , ref.quaternion );
			dq.copy( ref.quaternion ); // 実際には baseQuaternion = (0,0,0,1) なので簡略。
		}
		weight = at[1];
		if ( ( v.pmxBone.flags & 0x100) !== 0 ) {
			// 回転付与。
			_q.set(0,0,0,1);
			if ( weight >= 0) {
				// 順回転。
				_q.slerp( dq, weight );
			} else {
				// 逆回転。
				_q.slerp( dq.conjugate(), -weight );
			}
//continue
//if (ref.name=="左足") DEBUG_show(v.name+'\n'+((v.pmxBone.flags & 0x80 ) !== 0 )+'\n'+ref.quaternion.toArray()+'\n'+(i+'/'+i_max)+'\n'+Date.now())
			v.quaternion.multiplyQuaternions( v.quaternion, _q );
		}
		if ( ( v.pmxBone.flags & 0x200) !== 0 ) {
			// 移動付与。
//if (mesh._model_index==1){DEBUG_show(v.name+'/'+v.position.toArray()); }
//dv.set(0,10,0)
			v.position.addVectors( v.position, dv.multiplyScalar(weight) );
		}
//	});
}

};

}()); // MMDAddTrans

(function() { // MMDCamera

var bezierp, _v;

bezierp = function( x, interp, which ) {
	// which: 0=x, 1=y, 2=z, 3=rot, 4=distance, 5=fov
	which *= 4;
	return cubicBezier( x, interp[ which ] / 127, interp[ which + 2 ] / 127, interp[ which + 1 ] / 127, interp[ which + 3 ] / 127, 1 / 128 );
};

// temporary
_v = new THREE.Vector3();

// camera motion
MMDCamera = function( persepectiveCamera, animation ) { // extend Animation
	// ※平行投影(orthograph)カメラは未対応。
	if ( !(persepectiveCamera instanceof THREE.PerspectiveCamera) ) {
		console.error('not PerspectiveCamera');
		return;
	}
	this.persepectiveCamera = persepectiveCamera;
	Animation.call( this, animation, animation.duration );
	this.minKeyDelta = MMD.minKeyDelta;
	this.offset = new THREE.Vector3(); // モデルによる身長差とかに対応。
	this.target = new THREE.Vector3(); // for trackball control
	//this.update(0);

// AT: height reference
const model = MMD_SA.THREEX.get_model(0);
this.head_y = (MMD_SA.THREEX.enabled) ? model.para.pos0['head'][1] * model.model_scale : model.mesh.bones_by_name["頭"].pmxBone.origin[1];

};
MMDCamera.prototype = Object.create( Animation.prototype );
MMDCamera.prototype.constructor = MMDCamera;

MMDCamera.prototype.play = function( loop ) {
	Animation.prototype.play.call( this, loop );
	// matrix の更新は自前でやるので autoUpdate は無効にする。
	// そのため trackball control とかで影響でるので要注意！
// AT: not needed for MMD_SA.Camera_MOD.adjust_camera()
//	this.persepectiveCamera.rotationAutoUpdate = false;
//	this.persepectiveCamera.matrixAutoUpdate = false;
};

MMDCamera.prototype.pause = function() {
	Animation.prototype.pause.call( this );
// AT: not needed for MMD_SA.Camera_MOD.adjust_camera()
//	this.persepectiveCamera.rotationAutoUpdate = true;
//	this.persepectiveCamera.matrixAutoUpdate = true;
};

MMDCamera.prototype.onupdate = function( currKey, nextKey, ratio ) {
	var persepectiveCamera = this.persepectiveCamera,
		interp = nextKey.interp,
		t, pos, rot, distance, prevFov, mtx;
//	pos = persepectiveCamera.position;
pos = MMD_SA._v3a_.set(0,0,0);
	pos.x = currKey.target[0] + ( nextKey.target[0] - currKey.target[0] ) * bezierp( ratio, interp, 0 );
	pos.y = currKey.target[1] + ( nextKey.target[1] - currKey.target[1] ) * bezierp( ratio, interp, 1 );
	pos.z = currKey.target[2] + ( nextKey.target[2] - currKey.target[2] ) * bezierp( ratio, interp, 2 );
	pos.addVectors( pos, this.offset );
//pos.add(THREE.MMD.getModels()[0].mesh.position); persepectiveCamera.rotationAutoUpdate = persepectiveCamera.matrixAutoUpdate = false;
	this.target.copy( pos );

const c_target = MMD_SA._v3a.copy(pos);

	t = bezierp( ratio, interp, 3 );
//	rot = persepectiveCamera.rotation;
rot = MMD_SA._v3b_.set(0,0,0);
	rot.x = currKey.rot[0] + ( nextKey.rot[0] - currKey.rot[0] ) * t;
	rot.y = currKey.rot[1] + ( nextKey.rot[1] - currKey.rot[1] ) * t;
	rot.z = currKey.rot[2] + ( nextKey.rot[2] - currKey.rot[2] ) * t;
	distance = currKey.distance + ( nextKey.distance - currKey.distance ) * bezierp( ratio, interp, 4 );

	prevFov = persepectiveCamera.fov;
	persepectiveCamera.fov = currKey.fov + ( nextKey.fov - currKey.fov ) * bezierp( ratio, interp, 5 );
	if ( persepectiveCamera.fov !== prevFov ) {
		persepectiveCamera.updateProjectionMatrix();
	}

	mtx = persepectiveCamera.matrix;
	//mtx.identity();
	mtx.makeRotationFromEuler( rot );

	pos.add( _v.getColumnFromMatrix(2,mtx).multiplyScalar( distance ) );
	mtx.setPosition( pos );

const c_pos = MMD_SA._v3b.copy(pos);

if (1) {
  const head_y_ref = 17.19686;
  let ratio = THREE.Math.clamp((1 - Math.abs(head_y_ref - c_pos.y)/head_y_ref), 0,1);
  ratio = (1-ratio) + ratio * this.head_y/head_y_ref;
  if (c_pos.y < head_y_ref) {
    c_pos.y *= ratio;
  }
  else {
    c_pos.y = this.head_y + (c_pos.y - head_y_ref) * ratio;
  }
}

const c_base = MMD_SA.TEMP_v3.fromArray(MMD_SA_options.camera_position_base)
c_pos.sub(c_base);
// Calculate the target directly from rotation, as the usual camera update routine (.lookAt) can't get the rotation if distance is 0. Also this gives better flexibility for mouse control
const c_distance = MMD_SA._trackball_camera.position0.distanceTo(MMD_SA._trackball_camera.target0);
c_target.set(0,0,-1).applyEuler(rot).multiplyScalar((Math.abs(distance)) ? Math.sign(distance) * Math.max(Math.abs(distance), c_distance) : c_distance);
c_target.add(c_pos).add(c_base.setY(0));

MMD_SA.Camera_MOD.adjust_camera('MMDCamera_onupdate', c_pos,c_target);


	persepectiveCamera.up.copy( _v.getColumnFromMatrix(1,mtx) ); // for trackball control
	persepectiveCamera.matrixWorldNeedsUpdate = true; // 自前でやったのでワールド更新要求も自前で出す。

//DEBUG_show(persepectiveCamera.fov+'/'+distance+'\n\n'+rot.toArray().concat(c_pos.toArray()).concat(c_target.toArray()).join('\n'))
};

}()); // MMDCamera

// light motion
MMDLight = function( directionalLight, animation ) { // extend Animation
	if ( !(directionalLight instanceof THREE.DirectionalLight) ) {
		console.error('not DirectionalLight');
		return;
	}
	this.directionalLight = directionalLight;
	Animation.call( this, animation, animation.duration );
	this.minKeyDelta = MMD.minKeyDelta;
	//this.update(0);
};
MMDLight.prototype = Object.create( Animation.prototype );
MMDLight.prototype.constructor = MMDLight;

MMDLight.prototype.onupdate = function( currKey, nextKey, ratio ) {
	var directionalLight = this.directionalLight,
		color = directionalLight.color,
		position = directionalLight.position,
		target = directionalLight.target.position;
	color.r = currKey.color[0] + ( nextKey.color[0] - currKey.color[0] ) * ratio;
	color.g = currKey.color[1] + ( nextKey.color[1] - currKey.color[1] ) * ratio;
	color.b = currKey.color[2] + ( nextKey.color[2] - currKey.color[2] ) * ratio;
	position.x = 0;
	position.y = 0;
	position.z = 0;
	target.x = currKey.dir[0] + ( nextKey.dir[0] - currKey.dir[0] ) * ratio;
	target.y = currKey.dir[1] + ( nextKey.dir[1] - currKey.dir[1] ) * ratio;
	target.z = currKey.dir[2] + ( nextKey.dir[2] - currKey.dir[2] ) * ratio;
};

//↓replaceVmdのために外に出す
var skinnedMesh_updateMatrixWorld = function( force ) {
	var i, l, child;
	this.matrixAutoUpdate && this.updateMatrix();
	if ( this.matrixWorldNeedsUpdate || force ) {
		if ( this.parent ) {
			this.matrixWorld.multiplyMatrices( this.parent.matrixWorld, this.matrix );
		} else {
			this.matrixWorld.copy( this.matrix );
		}
		this.matrixWorldNeedsUpdate = false;
		force = true;
	}
// AT: prevent duplicated updates for clones
if (this._mesh_parent && this._mesh_parent._RAF_timestamp_) { if (this._mesh_parent._RAF_timestamp_ == RAF_timestamp) return; this._mesh_parent._RAF_timestamp_ = RAF_timestamp; }
	for ( i = 0, l = this.children.length; i < l; i ++ ) {
		child = this.children[ i ];
		if ( child instanceof THREE.Bone ) {
// AT: afterPhysics
// .pmxBone can be undefined if the model is a clone
// don't update if this.matrixAutoUpdate is false
if ((this.matrixAutoUpdate || force) && (!child.pmxBone || !child.pmxBone.afterPhysics))
			child.update( this.identityMatrix, false );
		} else {
			child.updateMatrixWorld( true );
		}
	}
};

(function() { // MODEL

function hasAdditionalTransform( pmx ) {
	return pmx.bones.some( function( v ) {
		return !!v.additionalTransform; //return ( ( v.flags & 0x300) !== 0 );
	});
}

Model = function( pmx, vmd ) {
	this.init( pmx, vmd );
};
Model.prototype.init = function( pmx, vmd ) {
	this.pmx = pmx;
	this.vmd = vmd;
	this.ik = null;
	this.physi = null;
	this.skin = null;
	this.morph = null;
	this.addTrans = null;
	this.mesh = null; // THREE.SkinnedMesh
	this.simulateCallback = null;
	this.boundingCenterOffset = null;
	this._onmotionended = null;
// AT: Cache skin and morph.
this._MMD_SA_cache = []
};
Model.prototype.load = function( modelUrl, motionUrl, onload ) {
	var that;
	that = this;
	( new PMX() ).load( modelUrl, function( pmx ) {
		if ( motionUrl ) {
			( new VMD() ).load( motionUrl, function( vmd ) {
				success( pmx, vmd );
			});
		} else {
			success( pmx );
		}
	});

	function success( pmx, vmd ) {
		Model.call( that, pmx, vmd );
		onload( that );
	}
};

// AT: _update_IK_and_AddTrans
Model.prototype._update_IK_and_AddTrans = function (afterPhysics, bone_name, include_hierarchy, reset_transformer) {
  var that = this;

  var _IK_and_AddTrans;
  var IK_and_AddTrans = _IK_and_AddTrans = this.mesh._IK_and_AddTrans;
  var is_IK;
  var a_ini, a_end, idx_last;

  let p_name;
  if (bone_name) {
    const bone = this.mesh.bones_by_name[bone_name];
    p_name = (include_hierarchy) ? '_IK_and_AddTrans_hierarchy' : '_IK_and_AddTrans';
    IK_and_AddTrans = bone[p_name];
    if (!IK_and_AddTrans) {
      let d = bone_name.charAt(0);
      if ((d != '左') && (d != '右'))
        d = '';

      const t_list = {};
      t_list[bone._index] = true;

      bone[p_name+'_reset_list'] = {};

      const bone_parent = ((typeof include_hierarchy == 'string') && this.mesh.bones_by_name[include_hierarchy]) || bone.parent;
      IK_and_AddTrans = bone[p_name] = _IK_and_AddTrans.filter((b)=>{
if (d && (d != b.name.charAt(0))) return false;

var return_value = false;

// include all bones that rely on transforms that share the same parent, and all IKs that share the same parent
if (include_hierarchy) {
  const b_transformer = (b.pmxBone.additionalTransform && this.mesh.bones[b.pmxBone.additionalTransform[0]]) || (b.pmxBone.IK && b);
  let p = b_transformer;
  do {
    p = p.parent;
    if (p == bone_parent) {
      t_list[b_transformer._index] = true;
      return_value = true;
      break;
    }
  }
  while (p && p.isBone);
}

// include all bones that rely on this transform and the bones themselves
if (b.pmxBone.additionalTransform && (!b.pmxBone.IK || b._additionalTransform_only)) {
  const transformer = b.pmxBone.additionalTransform[0];
  if (t_list[transformer]) {
    t_list[b._index] = true;
// top-level transformer only (i.e. not depending on another transformer)
    bone[p_name+'_reset_list'][transformer] = true;
// just reset all transformed bones for simplicity
//    bone[p_name+'_reset_list'][b._index] = true;

    return true;
  }
}

return return_value;
      });

      bone[p_name+'_reset_list'] = Object.keys(bone[p_name+'_reset_list']).map(i=>{
return { bone:this.mesh.bones[i], pos:new THREE.Vector3(), rot:new THREE.Quaternion() };
      });
    }

    if (reset_transformer) {
      bone[p_name+'_reset_list'].forEach(obj=>{
        const b = obj.bone;
        obj.pos.copy(b.position);
        obj.rot.copy(b.quaternion);
        b.position.negate();
        b.quaternion.conjugate();
      });
// process in reversed order so that nested transformers work
      const IK_and_AddTrans_reversed = [];
      IK_and_AddTrans = IK_and_AddTrans.filter(b=>!b.pmxBone.IK);
      IK_and_AddTrans.forEach(b=>{IK_and_AddTrans_reversed.unshift(b)});
      IK_and_AddTrans = IK_and_AddTrans_reversed;
    }

    this.mesh._IK_and_AddTrans = IK_and_AddTrans;
    a_ini = 0;
    idx_last = IK_and_AddTrans.length - 1;
  }
  else {
    if (afterPhysics) {
      a_ini = this.mesh._IK_and_AddTrans_afterPhysics_index
      idx_last = IK_and_AddTrans.length - 1
    }
    else {
      a_ini = 0
      idx_last = (this.mesh._IK_and_AddTrans_afterPhysics_index || IK_and_AddTrans.length) - 1
    }
  }
  a_end = -1

//var str=''
  for (var idx = a_ini; idx <= idx_last; idx++) {
    var b = IK_and_AddTrans[idx]
    if (is_IK) {
      if (b.pmxBone.IK && !b._additionalTransform_only) {
        a_end = idx
      }
      else {
//for (var i = a_ini; i <= a_end; i++) str += 'IK:'+that.mesh._IK_and_AddTrans[i].name+'\n';
        that.ik.update({ini:a_ini, end:a_end})
        is_IK = false
        a_ini = a_end = idx
      }
    }
    else {
      if (b.pmxBone.additionalTransform && (!b.pmxBone.IK || b._additionalTransform_only)) {
        a_end = idx
      }
      else {
        if (a_end != -1) {
//for (var i = a_ini; i <= a_end; i++) str += 'AT:'+that.mesh._IK_and_AddTrans[i].name+'\n';
          that.addTrans.update({ini:a_ini, end:a_end})
        }
        is_IK = true
        a_ini = a_end = idx
      }
    }

    if (idx == idx_last) {
      if (is_IK) {
//for (var i = a_ini; i <= a_end; i++) str += 'IK:'+that.mesh._IK_and_AddTrans[i].name+'\n';
        that.ik.update({ini:a_ini, end:a_end})
     }
      else {
//for (var i = a_ini; i <= a_end; i++) str += 'AT:'+that.mesh._IK_and_AddTrans[i].name+'\n';
        that.addTrans.update({ini:a_ini, end:a_end})
      }
    }
  }
//if (str) DEBUG_show(str+'\n'+Date.now())

  if (bone_name && reset_transformer) {
    this.mesh.bones_by_name[bone_name][p_name+'_reset_list'].forEach(obj=>{
      const b = obj.bone;
      b.position.add(obj.pos).add(obj.pos);
      b.quaternion.premultiply(obj.rot).premultiply(obj.rot);
    });
  }

  this.mesh._IK_and_AddTrans = _IK_and_AddTrans;
}

Model.prototype.create = function( param, oncreate ) {
	var that;
	that = this;

// AT: dummy canvas
var _canvas, _ctx, _canvas2, _ctx2;
if (self.MMD_SA) {
  _canvas = document.createElement("canvas");
  _ctx = _canvas.getContext("2d");
  _canvas2 = document.createElement("canvas");
  _ctx2 = _canvas2.getContext("2d");
/*
_canvas2.style.position = "absolute"
_canvas2.style.zIndex = 9999
document.body.appendChild(_canvas2)
*/
}

	if ( this.pmx ) {
		this.pmx.createMesh( param, function( mesh ) {
// AT: find_physics_parent
function find_physics_parent(bone) {
  var _bone = bone//.parent
  var parent_index = -1
  while (_bone !== mesh) {
    var rigid_index = that.pmx.rigid_index_by_bone[_bone._index]
    if ((rigid_index != null) && (mesh.MMDrigids[rigid_index].type > 0)) {
      parent_index = _bone._index
      break
    }
    _bone = _bone.parent
  }
  return parent_index
}

// AT: temp stuff (reset on mesh.updateMotion)
mesh._bone_morph = {}

// AT: bound .MMDrigids = pmx.rigids to mesh, instead of geometry
mesh.MMDrigids = that.pmx.rigids

// AT: model index, simple MorphMaterial support, castShadow, etc
var model_para
if (self.MMD_SA) {
  mesh._model_index = mesh._model_index_default = that.pmx._model_index
  mesh._material_morph = {};
  model_para = self.MMD_SA && MMD_SA_options.model_para_obj_all[mesh._model_index]
//  mesh.castShadow = !!MMD_SA_options.use_shadowMap
// deformHierachy
  mesh.bones_by_name = {}
  mesh._IK_and_AddTrans = []
  var IK_child = {}
  mesh.geometry.bones.forEach(function (gbone, idx) {
    var bone = mesh.bones[idx]
    mesh.bones_by_name[gbone.name] = bone
    bone._index = idx
// define .pmxbone here, instead of in MMDAddTrans, since MMDAddTrans can be empty
    var pbone = bone.pmxBone = that.pmx.bones[idx];

    if (pbone.IK) {
      mesh._IK_and_AddTrans.push(bone)

      var ik = pbone.IK
      IK_child[ik.effector] = idx
      ik.links.forEach(function (link) {
        IK_child[link.bone] = idx
      });
    }
  });

// AT: auto-adjust "dummy" center bone for some models
if ((mesh.bones_by_name['センター'] && (mesh.bones_by_name['センター'].pmxBone.origin[1] == 0)) && (mesh.bones_by_name['グルーブ'])) {
  let y_center = mesh.bones_by_name['グルーブ'].pmxBone.origin[1]
  mesh.bones_by_name['センター'].pmxBone.origin[1] = y_center

  let y_offset = y_center - mesh.bones_by_name['センター'].parent.pmxBone.origin[1]
  let index_center = mesh.bones_by_name['センター']._index
  mesh.geometry.bones[index_center].pos[1] = y_offset
  mesh.geometry.bones.forEach(function (gbone, idx) {
    if (gbone.parent == index_center)
      gbone.pos[1] -= y_offset
  });
}

  mesh.geometry.bones.forEach(function (gbone, idx) {
    var bone = mesh.bones[idx]
    var pbone = bone.pmxBone

    var at = pbone.additionalTransform;
    if ( at && at[0] >= 0 && at[1] !== 0 ) {
// "clone" the bone if it has both IK and additionalTransform, so that the IK version and the additionalTransform version of this bone can be treated independently
if (pbone.IK) {
  let bone_clone = Object.assign({}, bone)
  bone_clone._additionalTransform_only = true
  mesh._IK_and_AddTrans.push(bone_clone)
}
else
      mesh._IK_and_AddTrans.push(bone)

      if (IK_child[idx]) {
        const b = mesh.bones[IK_child[idx]]
        const p = b.pmxBone
//        pbone._index_IKAT = pbone._index_IKAT || (p.deformHierachy - pbone.deformHierachy) * 1024 + b._index + idx/1000;
        p._index_IKAT = Math.min(p._index_IKAT||99999, 8192 + (pbone.deformHierachy - p.deformHierachy) * 1024 + idx - 0.5);
//console.log(bone.name, b.name, pbone._index_IKAT)
      }
    }
  });
//console.log(IK_child)
  mesh._bone_update_afterPhysics = {}
  mesh._IK_and_AddTrans.forEach(function (bone) {
    if (!bone.pmxBone.afterPhysics)
      return

    var parent_index
    if (bone.pmxBone.IK) {
      parent_index = find_physics_parent(bone)
      if (parent_index != -1) mesh._bone_update_afterPhysics[parent_index] = true;
//console.log(parent_index)
    }
    else {
      parent_index = find_physics_parent(bone)
      if (parent_index != -1) mesh._bone_update_afterPhysics[parent_index] = true;
//console.log(parent_index)
      parent_index = find_physics_parent(mesh.bones[bone.pmxBone.additionalTransform[0]])
      if (parent_index != -1) mesh._bone_update_afterPhysics[parent_index] = true;
//console.log(parent_index)
    }
  });
//console.log(mesh._bone_update_afterPhysics)
  mesh._IK_and_AddTrans.sort(function (a, b) {
    var pbone_a = a.pmxBone
    var pbone_b = b.pmxBone
// in general, process IK first and then additionalTransform
// for additionalTransforms that are parts of a IK, process the IK just before the first associated additionalTransform
    return (((pbone_a.afterPhysics&&32768)||0)+((pbone_a.additionalTransform&&(!pbone_a.IK||a._additionalTransform_only)&&8192)||0)+pbone_a.deformHierachy*1024+(pbone_a._index_IKAT||a._index)) - (((pbone_b.afterPhysics&&32768)||0)+((pbone_b.additionalTransform&&(!pbone_b.IK||b._additionalTransform_only)&&8192)||0)+pbone_b.deformHierachy*1024+(pbone_b._index_IKAT||b._index));

//    return (((pbone_a.afterPhysics&&32768)||0)+pbone_a.deformHierachy*1024+(pbone_a._index_IKAT||a._index)) - (((pbone_b.afterPhysics&&32768)||0)+pbone_b.deformHierachy*1024+(pbone_b._index_IKAT||b._index));
//    return (((pbone_a.afterPhysics&&32768)||0)+((pbone_a.additionalTransform&&(!pbone_a.IK||a._additionalTransform_only)&&(!IK_child[a._index])&&8192)||0)+pbone_a.deformHierachy*1024+(pbone_a._index_IKAT||a._index)) - (((pbone_b.afterPhysics&&32768)||0)+((pbone_b.additionalTransform&&(!pbone_b.IK||b._additionalTransform_only)&&(!IK_child[b._index])&&8192)||0)+pbone_b.deformHierachy*1024+(pbone_b._index_IKAT||b._index));
  });
//console.log(mesh._IK_and_AddTrans)
  if (MMD_SA.use_afterPhysics) {
    mesh._IK_and_AddTrans.some(function (a, idx) {
      if (a.pmxBone.afterPhysics) {
mesh._IK_and_AddTrans_afterPhysics_index = idx
console.log(mesh._model_index, "._IK_and_AddTrans_afterPhysics_index", idx)
return true
      }
    });
  }
}
// AT: ,idx, auto_detect_material_para
var auto_detect_material_para, material_para
var opaque_material_count = 0
if (self.MMD_SA) {
  auto_detect_material_para = self.MMD_SA && (that.pmx._clone_index == -1)// && !model_para.material_para;
  material_para = model_para.material_para = model_para.material_para || {};
}
mesh.material.materials.forEach( function( v ,idx ) {
  function uv_correct(v) { return ((v >= 0) ? (v % 1) : (v % 1) + 1); }

  v.mesh = mesh;

// AT: material para
//console.log(v)
  if (self.MMD_SA) {
    let img, w, h;
    let m = material_para[v.name] || (material_para._default_ && Object.assign({}, material_para._default_)) || {};
    if (m.depthWrite != null) { v.depthWrite = m.depthWrite; }
    let auto_detect = auto_detect_material_para && (m.transparent == null)// && !material_para[v.name]
    if (auto_detect) {
      if (v.opacity < 1) {
        m.transparent = true
      }
      else if (!v.map) {
        m.transparent = false
      }
      else if (v.map instanceof THREE.CompressedTexture) {
        m.transparent = true
      }
      else if (v.map.image.src && /\.jpg$/i.test(v.map.image.src) && !/\.jpga\.jpg$/i.test(v.map.image.src)) {
        m.transparent = false
      }
      else {
img = v.map.image;
w = _canvas.width  = _canvas2.width  = Math.ceil(img.width  * 0.5);
h = _canvas.height = _canvas2.height = Math.ceil(img.height * 0.5);

_ctx.drawImage(img, 0,0,w,h);

let faceVertexUvs = mesh.geometry.faceVertexUvs[0];
_ctx2 = _canvas2.getContext("2d");
_ctx2.fillStyle = "white"
//_ctx2.beginPath();
for (var f = v._uv_bbox.face_ini, f_max = v._uv_bbox.face_end; f < f_max; f++) {
  let uv = faceVertexUvs[f]
  _ctx2.beginPath();
  _ctx2.moveTo(uv_correct(uv[0].x)*w, uv_correct(uv[0].y)*h)
  _ctx2.lineTo(uv_correct(uv[1].x)*w, uv_correct(uv[1].y)*h)
  _ctx2.lineTo(uv_correct(uv[2].x)*w, uv_correct(uv[2].y)*h)
  _ctx2.closePath()
  _ctx2.fill()
}
//_ctx2.fill()
//_ctx2.fillRect(0,0,w,h)

let idata =  _ctx.getImageData(0,0,w,h).data
let imask = _ctx2.getImageData(0,0,w,h).data
let is_transparent = false
for (var i = 0, i_length = idata.length; i < i_length; i+=4) {
  if (idata[i+3] < 192) {//230)) {
    is_transparent = true
    break
  }
}
m.transparent = is_transparent

idata = imask = undefined;
      }
      if (m.transparent != null)
        v.transparent = m.transparent
    }
//console.log(idx + '/' + v.transparent + ((img) ? '/'+[w,h].join('x') : ''))//+'\n'+idata.length)
    v._material_para = (material_para[v.name] || material_para._default_) || null;
    if (!v.transparent) opaque_material_count++
  }
});
console.log("model-" + mesh._model_index + ":auto_detect_material_para-" + !!auto_detect_material_para + ",opaque/total material count-" + opaque_material_count + "/" + mesh.material.materials.length)
// AT: clear dummy canvas
if (self.MMD_SA) {
  _canvas.width = _canvas.height = _canvas2.width = _canvas2.height = 0;
  _canvas = _ctx = _canvas2 = _ctx2 = undefined;
}
//console.log(mesh.material.materials)
			var animation;
			that.mesh = mesh;

			mesh.identityMatrix = null; // 少し速くなるかも。
			mesh.useQuaternion = true;
			if ( param.position ) {
				mesh.position.copy( param.position );
			}
			if ( param.rotation ) {
				mesh.rotation.copy( param.rotation );
				mesh.useQuaternion = false;
			}
			if ( param.quaternion ) {
				mesh.quaternion.copy( param.quaternion );
				mesh.useQuaternion = true;
			}
			that.boundingCenterOffset = mesh.geometry.boundingSphere.center.clone().sub( mesh.bones[0].position ); // offset from skeleton center
			if ( mesh.geometry.MMDIKs.length ) {
				that.ik = new MMDIK( mesh );
			} else {
				that.ik = null;
			}
// AT: postSimulate must be run to have skin mesh updated properly, so always enable .physi here even for models without rigids
			if ( window.Ammo/* && mesh.MMDrigids.length */) {//mod by jThree
				that.physi = new MMDPhysi( mesh );
			} else {
				that.physi = null;
			}
			if ( that.vmd ) {
				animation = that.vmd.generateSkinAnimation( that.pmx );
				if ( animation ) {
					that.skin = new MMDSkin( mesh, animation );
					that.skin.onended = function( skin ) {
						if ( skin.loop ) {
							if ( that.physi ) {
								that.physi.reset();
							}
						}
						that._onmotionended = that.onmotionended; // mark
					};
					if ( that.physi ) {
						// 物理演算をやる場合は、
						// boneMatrices の更新は自前でやるので updateMatrixWorld を override する。
						// override しなくても動作するが、無駄な計算を減らすため。
						mesh.updateMatrixWorld = skinnedMesh_updateMatrixWorld;
					}
				} else {
					that.skin = null;
				}
				animation = that.vmd.generateMorphAnimation( that.pmx );
				if ( animation  ) {
					that.morph = new MMDMorph( mesh, animation );
				} else {
					that.morph = null;
				}
// AT: Cache
if (self.MMD_SA) that._MMD_SA_cache[toLocalPath(that.vmd.url)] = { skin:that.skin, morph:that.morph };
			}
// AT: needed for physics to work in some cases (eg. when mirror material is used), when no preloaded motion is defined in GOML
else if (self.MMD_SA) { mesh.updateMatrixWorld = skinnedMesh_updateMatrixWorld; }
			if ( hasAdditionalTransform( that.pmx ) ) {
				that.addTrans = new MMDAddTrans( that.pmx, mesh );
			} else {
				that.addTrans = null;
			}
			oncreate( that );

// AT: event
window.dispatchEvent(new CustomEvent('SA_MMD_model' + that.pmx._model_index + '_onload'));

// AT: hidden during loading
if (self.MMD_SA) {
  if (model_para.hidden_before_start || model_para.hidden_on_start || MMD_SA_options.hidden_before_start || MMD_SA_options.hidden_on_start)
    mesh.scale.set(0.0,0.0,0.0)
}
		});
	}
};

Model.prototype.resetBones = function() {
	var mesh, bones;
	mesh = this.mesh;
	if ( mesh ) {
		bones = mesh.bones;
		mesh.geometry.bones.forEach( function( v, i ) {
			var bone;
			bone = bones[i];
			bone.position.set( v.pos[0], v.pos[1], v.pos[2] );
			bone.quaternion.set( v.rotq[0], v.rotq[1], v.rotq[2], v.rotq[3] );
		});
		/* if ( mesh.morphTargetInfluences ) {
			// reset morphTargetInfluences
			mesh.morphTargetInfluences.forEach( function( v, i, a ) {
				a[i] = 0;
			});
		} */
	}
};

// AT: extra motions for System Animator
Model.prototype.setupMotion_MMD_SA = function( vmd, match, use_dummy ) {
  if (!match)
    match = { skin_jThree:true, morph_jThree:true }

  var sa = (match.skin_jThree)  ? vmd.generateSkinAnimation(this.pmx,  ((match.skin_jThree ===true)?null:match.skin_jThree))  : null
  var ma = (match.morph_jThree) ? (vmd._morph_component||vmd).generateMorphAnimation(this.pmx, ((match.morph_jThree===true)?null:match.morph_jThree)) : null

  var skin  = (sa) ? new MMDSkin(this.mesh, sa)  : ((use_dummy) ? MMD_SA.Animation_dummy : null)
  var morph = (ma) ? new MMDMorph(this.mesh, ma) : ((use_dummy) ? MMD_SA.Animation_dummy : null)

  if (skin) {
    skin._model_index  = this._model_index
    skin._motion_index = vmd._index
  }
  if (morph) {
    morph._model_index  = this._model_index
    morph._motion_index = vmd._index
  }

  var camera = vmd._camera_component && new MMDCamera(MMD_SA._trackball_camera.object, vmd._camera_component.generateCameraAnimation());

  var obj = { skin:skin, morph:morph, camera:camera }

  if (morph && !use_dummy) {
    morph.target_index_by_name = {}
    morph.targets.forEach(function (target, idx) {
      morph.target_index_by_name[target.keys[0].name] = idx
    });
    if ("まばたき" in morph.target_index_by_name)
      obj._blink_target_index = morph.target_index_by_name["まばたき"]
  }

  return obj
}
// a trick to export VMD for outside use
Model.prototype._VMD = function (url, onload) { (new VMD()).load(url, onload) }

// AT: Ignore physics reset, mainly for looping motion
Model.prototype.resetMotion = function(ignore_physics_reset) {
	this.resetBones();
	if ( this.morph ) {
		this.morph.reset();
// AT: System Animator
if (this.morph_MMD_SA_extra) {
  this.morph_MMD_SA_extra.forEach(function (morph) {
if (!morph.time || morph._MMD_SA_disabled) {
/*if (!morph._MMD_SA_disabled) */morph.reset();
}
  })
}
	}
	if ( this.skin ) {
		this.skin.reset();
// AT: System Animator
if (this.skin_MMD_SA_extra) {
  this.skin_MMD_SA_extra.forEach(function (skin) {
if (!skin.time || skin._MMD_SA_disabled) {
/*if (!skin._MMD_SA_disabled) */skin.reset();
}
  })
}
	}

	if ( this.physi ) {
// AT: physics check, gravity
//DEBUG_show(this._model_index+"/"+ignore_physics_reset,0,1)
if (ignore_physics_reset) return;
if (self.MMD_SA) {
  let para_SA = ((this._model_index > 0) ? MMD_SA.motion[this.skin._motion_index] : MMD_SA.MMD.motionManager).para_SA
// a trick to reset rigid body physics on motion seek/change
  this.resetPhysics()
// custom gravity
  if (this._model_index == 0) {
    let gravity = para_SA.gravity || [0,-1,0]
    if ((gravity[0] != MMD_SA.gravity[0]) || (gravity[1] != MMD_SA.gravity[1]) || (gravity[2] != MMD_SA.gravity[2])) {
      THREE.MMD.setGravity( gravity[0]*9.8*10, gravity[1]*9.8*10, gravity[2]*9.8*10 )
      MMD_SA.gravity = gravity
//DEBUG_show(gravity)
    }
  }
}
		this.physi.reset();
	}
};

// AT: reset physics (practically reset rigid body physics) for a certain number of frames
Model.prototype.resetPhysics = function (f) {
  if (!self.MMD_SA) return;

  if (f === 0) {
    this.mesh._reset_rigid_body_physics_ = 0
    return
  }

  if (f == null) {
    const para_SA = ((this._model_index > 0) ? ((this.skin && MMD_SA.motion[this.skin._motion_index]) || {}) : MMD_SA.MMD.motionManager).para_SA || {};
    f = para_SA.reset_rigid_body_physics_step || MMD_SA_options.reset_rigid_body_physics_step;
  }
  this.mesh._reset_rigid_body_physics_ = Math.max(this.mesh._reset_rigid_body_physics_||0, f);

  if (MMD_SA.THREEX.enabled && this.mesh._reset_rigid_body_physics_) MMD_SA.THREEX.models[this._model_index].resetPhysics();
};

// AT: check model visibility
if (self.MMD_SA) {
  Object.defineProperty(Model.prototype, "visible", {
    get: function () {
if (this._visible_RAF_timestamp == RAF_timestamp)
  return this._visible

var v
if (this.mesh.visible)
  v = true
else if (this._clone_cache) {
  v = this._clone_cache.list.some(function (c) {
    return c.visible
  });
//if (!v) DEBUG_show(Date.now())
}
else
  v = false

this._visible_RAF_timestamp = RAF_timestamp
this._visible = v
return v
    }
  });
}
else {
  Model.prototype.visible = true
}

Model.prototype.updateMotion = function( dt, force ) {
// AT: check model visibility
if (!this.visible) return;

	this.resetBones();

var mesh = this.mesh
var that = this

// AT: stuff
var meter_motion_disabled
var model_para, para_SA
var look_at_screen_ratio, look_at_mouse_disabled
if (self.MMD_SA) {
// This allows disabling meter motion/look_at_mouse/custom look_at_screen_ratio when certain extra motion is running.
  meter_motion_disabled = self.MMD_SA && MMD_SA.meter_motion_disabled
  model_para = MMD_SA_options.model_para_obj_all[this._model_index]
  para_SA = MMD_SA.motion[(this.skin||this.morph||{})._motion_index]
  para_SA = (para_SA && para_SA.para_SA) || {}
  mesh._bone_morph = {}
// playbackRate
  let playbackRate = ((para_SA.playbackRate_by_model_index && para_SA.playbackRate_by_model_index[this._model_index]) || 1) * (model_para._playbackRate || 1)
// for Dungeon multiplayer
  if (this._model_index == 0)
    model_para._playbackRate_OPC_ = MMD_SA._playbackRate * playbackRate
  else if (model_para._playbackRate_OPC_)
    playbackRate = model_para._playbackRate_OPC_ / MMD_SA._playbackRate
//DEBUG_show((MMD_SA._playbackRate * playbackRate)+'\n'+Date.now())
  dt *= playbackRate
}

	if ( this.morph ) {
// AT: extra morph START
var morph_extra_played = false
// save some headaches
if (self.MMD_SA) {
  let m = mesh.morphTargetInfluences
// m can be undefined for models with no morph transform
// no need to reset if it isn't playing (especiialy for the case when the morph animation is paused by MMD_SA._freeze_onended)
  if (m) {
    if (this.morph.playing) {
      for (var i = 0, len = m.length; i < len; i++)
        m[i] = 0
    }
    else if (para_SA.auto_blink) {
      m[this.morph.target_index_by_name["まばたき"]] = 0
      if (this.morph.target_index_by_name["笑い"] != null)
        m[this.morph.target_index_by_name["笑い"]] = 0
    }
//for (var i = 0, len = m.length; i < len; i++) m[i] = 0;
  }
}
if (this.morph_MMD_SA_extra) {
  this.morph_MMD_SA_extra.forEach(function (morph, _idx) {
if (morph._is_dummy || !morph.targets.length)
  return
var idx = (morph._motion_index_MMD_SA_extra != null) ? morph._motion_index_MMD_SA_extra : morph._motion_index - MMD_SA.custom_action_index//_idx//
if (idx < MMD_SA_options.custom_action.length) {
  var ca = MMD_SA_options.custom_action[idx]
  var frame = ca.frame = ca.para_by_model_index[that._model_index].frame = (morph._MMD_SA_disabled) ? 0 : ~~(((morph.time < morph.duration) ? morph.time : morph.duration) * 30)
  if (ca.condition(false, morph)) {
    morph_extra_played = true

    if (morph._MMD_SA_disabled) {
      morph._MMD_SA_disabled = false
      morph.reset()
      morph.play()
    }
  }
  else {
    if (!morph._MMD_SA_disabled) {
      morph.pause()
      morph._MMD_SA_disabled = true
    }
  }
}

if (!morph._MMD_SA_disabled) {
  morph.update( dt )
/*
// not blending morph for now
  if (morph._seek_time_ != null) {
    morph.seek(morph._seek_time_)
    morph._seek_time_ = null
  }
  else
    morph.update( dt )
  morph._blending_ratio_ = null
*/
}
  })
}
if (morph_extra_played) { this.morph.time += dt } else// extra morph END
		this.morph.update( dt, force );

// AT: process_morphs
if (self.MMD_SA) {
  if (!para_SA.process_morphs || !para_SA.process_morphs(this, this.morph)) {
    model_para.process_morphs && model_para.process_morphs(this, this.morph)
    window.dispatchEvent(new CustomEvent("SA_MMD_model" + this._model_index + "_process_morphs", { detail:{ model:this, morph:this.morph } }));
  }
}

// AT: custom_morph, auto blink - START
if (self.MMD_SA) {
  if (para_SA.morph_noise) {
    para_SA.morph_noise.forEach(function (noise) {
if (!noise._count) {
  noise._count = ~~(noise.time_range[0] + Math.random() * ((noise.time_range[1]-noise.time_range[0])+1))
  noise.morph_list.forEach(function (m) {
    m._weight = m.weight_range[0] + Math.random() * (m.weight_range[1]-m.weight_range[0])
  });
}
noise._count--

var targets = that.morph.targets
noise.morph_list.forEach(function (m) {
  var name = m.name
  var morph_index = that.morph.target_index_by_name[name]
  var target = targets[morph_index]
  var key0 = target.keys[0]
  var key_new = { name:name, weight:that.pmx.morphs_weight_by_name[name]+m._weight, morph_type:key0.morph_type, morph_index:key0.morph_index }
  that.morph.onupdate(key_new, key_new, 0, morph_index)
});
    });
  }
  var _custom_morph = model_para._custom_morph || MMD_SA._custom_morph
  _custom_morph.forEach(function (m) {
if (!m.condition || m.condition(that)) {
//if (that._model_index==1 && m.key.name=="band4") DEBUG_show(m.idx+'/'+that.morph.target_index_by_name[m.key.name]+'\n'+Date.now())
  that.morph.onupdate(m.key, m.key, 0, m.idx)
}
  });
  model_para._custom_morph = null
  MMD_SA._custom_morph = []
}
if (self.MMD_SA && MMD_SA_options.auto_blink && !morph_extra_played && (this.pmx.morphs_index_by_name["まばたき"] != null)) {
  let targets = this.morph.targets
  let _cache = this._MMD_SA_cache_current
  let target = targets[_cache._blink_target_index]

  if (this._blink_countdown == null)
    this._blink_countdown = -9999

  if (para_SA.auto_blink || (para_SA.auto_blink==null && target.keys.length<=2 && !target.keys[0].weight && !target.keys[target.keys.length-1].weight)) {
//DEBUG_show(PC_count_absolute+"/"+target.keys[0].morph_index+"/"+_cache._blink_target_index+"/"+this.pmx.morphs_index_by_name["まばたき"])
    let m, blink_morph_name = "まばたき", blink_target_index = _cache._blink_target_index;
// NOTE: this.morph.playing is false when MMD_SA._freeze_onended
    if (para_SA.auto_blink && this.morph.playing) {
      m = this.pmx.morphs_weight_by_name["まばたき"]
      let m_smile = this.pmx.morphs_weight_by_name["笑い"]
      if (m && m_smile) {
        m = null
      }
      else if (m_smile) {
        m = m_smile
        blink_morph_name = "笑い"
        blink_target_index = this.morph.target_index_by_name[blink_morph_name]
      }
    }
    else {
      m = 0
    }

    if (m == null) {
      this._blink_countdown = null
    }
    else {
      let countdown = this._blink_countdown
      let blink_weight = -1
      let blink_scale = 2
      if (countdown <= -1-blink_scale*3) {
        this._blink_countdown = ~~(20 * (Math.random()*8 + 4))
        blink_weight = m || 0
      }
      else if (countdown <= -1-blink_scale*2)
        blink_weight = m + (1-m)*(Math.abs(blink_scale*3+countdown)+1)/(blink_scale+1)
      else if (countdown <= -1-blink_scale*1)
        blink_weight = 1
      else if (countdown <= -1)
        blink_weight = m + (1-m)*(Math.abs(1+countdown)+1)/(blink_scale+1)
//blink_weight=1
      if (blink_weight >= 0) {
        let key0 = target.keys[0]
        let blink_key = { name:blink_morph_name, weight:blink_weight, morph_type:key0.morph_type, morph_index:key0.morph_index }
        this.morph.onupdate(blink_key, blink_key, 0, blink_target_index)
//DEBUG_show(blink_morph_name+":"+blink_weight)
//DEBUG_show(blink_weight,0,1)
      }
      this._blink_countdown -= RAF_timestamp_delta/1000*60;
    }
  }
}
// custom_morph, auto blink - END
	}
	if ( this.skin ) {
// AT: SFX (sound, etc)
self.MMD_SA && MMD_SA_options.Dungeon && MMD_SA_options.Dungeon.SFX_check(this, para_SA, this.skin, dt)
// AT: before skin
window.dispatchEvent(new CustomEvent("SA_MMD_model" + this._model_index + "_before_process_bones", { detail:{ model:this, skin:this.skin } }));
		this.skin.update( dt, force );
// AT: moved to somewhere near the end of this function, after all custom skin calculations
//		this.mesh.geometry.boundingSphere.center.addVectors( this.mesh.bones[0].position, this.boundingCenterOffset );
    }

// AT: process_bones (before skin_MMD_SA_extra)
if (self.MMD_SA) {
  if (!para_SA.process_bones || !para_SA.process_bones(this, this.skin)) {
    model_para.process_bones && model_para.process_bones(this, this.skin)
    window.dispatchEvent(new CustomEvent("SA_MMD_model" + this._model_index + "_process_bones", { detail:{ model:this, skin:this.skin } }));
  }
  if (this._model_index > 0) {
    let pos_delta = MMD_SA.bone_to_position.call(this, para_SA)
    if (pos_delta)
      mesh.position.add(mesh._bone_to_position_last.pos_delta_rotated)
  }
}

	if ( this.skin ) {

// AT: extra skin START
if (this.skin_MMD_SA_extra) {
  this.skin_MMD_SA_extra.forEach(function (skin, _idx) {
if (skin._is_dummy)
  return
var idx = (skin._motion_index_MMD_SA_extra != null) ? skin._motion_index_MMD_SA_extra : skin._motion_index - MMD_SA.custom_action_index//_idx//
//DEBUG_show(_idx+'/'+idx+'/'+MMD_SA_options.custom_action.length,0,1)
if (idx < MMD_SA_options.custom_action.length) {
//if (that._model_index==4) DEBUG_show('444-'+that.skin_MMD_SA_extra.length+'/'+Date.now())
  var ca = MMD_SA_options.custom_action[idx]
  var frame = ca.frame = ca.para_by_model_index[that._model_index].frame = (skin._MMD_SA_disabled) ? 0 : ~~(((skin.time < skin.duration) ? skin.time : skin.duration) * 30)
  if (ca.condition(true, skin)) {
    if (ca.meter_motion_disabled != false)
      meter_motion_disabled = true
    var v = ca.look_at_screen_ratio
    if (v != null)
      look_at_screen_ratio = v
    look_at_mouse_disabled = look_at_mouse_disabled || ca.look_at_mouse_disabled

    if (skin._MMD_SA_disabled) {
      skin._MMD_SA_disabled = false
      skin.reset()
      skin.play()
    }
//DEBUG_show(skin.time,0,1)
  }
  else {
    if (!skin._MMD_SA_disabled) {
      skin.pause()
      skin._MMD_SA_disabled = true
    }
  }
}

if (!skin._MMD_SA_disabled) {
  if (skin._seek_time_ != null) {
    skin.seek(skin._seek_time_)
    skin._seek_time_ = null
  }
  else
    skin.update( dt )
  skin._blending_ratio_ = null
}
  })
}
// extra skin END

// AT: bone morph
if (self.MMD_SA) {
  for (var b_name in mesh._bone_morph) {
    var bm = mesh._bone_morph[b_name]
    var b = mesh.bones_by_name[b_name]
    for (var morph_index in bm) {
      b.position.add(bm[morph_index].pos_v3)
      b.quaternion.multiply(bm[morph_index].rot_q)
    }
  }
//if (this._model_index==3) DEBUG_show(JSON.stringify(mesh._bone_morph))
}

// AT: adjustment for "look at screen" - START
// always get head position, because it may be needed elsewhere (eg. speech bubble)
var head_name = "頭"//"首"//
var _head_pos = null
if (self.MMD_SA) {
  if (!model_para.is_object) {
    _head_pos = MMD_SA.THREEX.get_model(this._model_index).get_bone_position_by_MMD_name(head_name);
//DEBUG_show(this._model_index,0,1)
  }
  if (this._model_index == 0) {
    MMD_SA._head_pos = _head_pos
//DEBUG_show(MMD_SA._head_pos.toArray())
    MMD_SA.SpeechBubble.update_placement()

    if (MMD_SA_options.Dungeon) {
      var bb_translate = MMD_SA_options.Dungeon.character.bb_translate
      bb_translate && bb_translate.update && bb_translate.update()
    }
  }
}

//if (this._model_index == 1) { DEBUG_show(MMD_SA._head_pos.toArray()+'\n'+_head_pos.toArray()) }

System._browser.camera.poseNet.frames.set_upper_body_rotation(this._model_index, 0);

var look_at_screen
if (self.MMD_SA && _head_pos && (mesh.bones_by_name[head_name]) && (look_at_screen_ratio != 0) && MMD_SA_options.look_at_screen_by_model(this) && (model_para.look_at_screen != false)) {
  var cam = MMD_SA.camera_position

  if ((para_SA && para_SA.center_view_lookAt) || MMD_SA_options.center_view_lookAt)
    look_at_screen = true
  else {
    var cp = MMD_SA_options.camera_position.slice(0)
    var cv = MMD_SA.center_view
    var _cp = mesh.position.toArray()
    for (var i = 0; i < 3; i++)
      _cp[i] += cp[i] + cv[i]
    var _r = [cam.x, cam.y, cam.z]

    for (var i = 0; i < 3; i++) {
      if (Math.abs(_cp[i] - _r[i]) > 0.01) {
        look_at_screen = true
        break
      }
    }
  }

  let look_at_mouse = (!look_at_mouse_disabled && MMD_SA_options.look_at_mouse) || (model_para.look_at_character != null) || model_para.look_at_target || para_SA.look_at_target || para_SA.look_at_mouse;

if (look_at_screen || look_at_mouse) {
// not using MMD_SA.get_bone_rotation_parent here as it includes the look-at-screen rotation from the previous frame
  const p_rotation_inversed = (MMD_SA_options.look_at_screen_parent_rotation_by_model(this) || (System._browser.camera.facemesh.enabled && mesh.bones_by_name["全ての親"].quaternion) || MMD_SA.get_bone_rotation_parent(mesh, head_name)).conjugate();
  let r = MMD_SA.face_camera(_head_pos, p_rotation_inversed);

  const angle_x_limit = para_SA.look_at_screen_angle_x_limit || [Math.PI*0.5, -Math.PI*0.5];
  const angle_y_limit = para_SA.look_at_screen_angle_y_limit || [Math.PI*0.5, -Math.PI*0.5];

  const ratio = (look_at_screen_ratio != null) ? look_at_screen_ratio : MMD_SA_options.look_at_screen_ratio_by_model(this);
  r.x = Math.min(Math.max(MMD_SA.normalize_angle(r.x * ratio), angle_x_limit[1]), angle_x_limit[0])
  r.y = Math.min(Math.max(MMD_SA.normalize_angle(r.y * ratio), angle_y_limit[1]), angle_y_limit[0])
/*
  if (MMD_SA._ry_last != null) {
    var _ry_diff = r.y - MMD_SA._ry_last
    if (Math.abs(_ry_diff) > Math.PI/10) {
      r.y = MMD_SA._ry_last + ((_ry_diff<0)?-1:1) * Math.PI/10
    }
  }
*/

  const _cam = MMD_SA.TEMP_v3.copy(cam).sub(_head_pos);
  if (this._model_index == 0) {
    MMD_SA._rx = Math.atan2(-_cam.y, Math.sqrt(Math.pow(_cam.x,2) + Math.pow(_cam.z,2)))
    MMD_SA._ry = r.y
    MMD_SA._rx_last = r.x
    MMD_SA._ry_last = r.y
  }

if (look_at_mouse) {
  let _pos;
  if (para_SA.look_at_target) {
    _pos = para_SA.look_at_target();
  }
  else if (model_para.look_at_character!= null) {
    _pos = THREE.MMD.getModels()[model_para.look_at_character].mesh.position.clone()
    _pos.y += 15
  }
  else if (model_para.look_at_target) {
    _pos = model_para.look_at_target()
  }
  else {
    _pos = MMD_SA.mouse_to_ray(true);
    _pos.y += MMD_SA._trackball_camera.position0.y - _head_pos.y;
  }

  if (!MMD_SA._mouse_pos_3D[this._model_index])
    MMD_SA._mouse_pos_3D[this._model_index] = _pos
  else {
    const limit = 500 * RAF_timestamp_delta/1000;
    ["x", "y", "z"].forEach(function (axis) {
let diff = _pos[axis] - MMD_SA._mouse_pos_3D[that._model_index][axis];
if (Math.abs(diff) > limit)  diff = Math.sign(diff) * limit;
MMD_SA._mouse_pos_3D[that._model_index][axis] += diff;
    });
//DEBUG_show(_pos.toArray()+'\n'+MMD_SA._mouse_pos_3D[0].toArray())
  }

  MMD_SA._camera_position_ = MMD_SA._mouse_pos_3D[this._model_index]
  r = MMD_SA.face_camera(_head_pos, p_rotation_inversed)
  MMD_SA._camera_position_ = null

//DEBUG_show([r.x,r.y]+'\n'+MMD_SA._mouse_pos_3D[this._model_index].toArray()+'\n'+_head_pos.toArray())
  r.x = Math.min(Math.max(MMD_SA.normalize_angle(r.x * ratio), angle_x_limit[1]), angle_x_limit[0])
  r.y = Math.min(Math.max(MMD_SA.normalize_angle(r.y * ratio), angle_y_limit[1]), angle_y_limit[0])
//DEBUG_show(r.x*180/Math.PI+'\n'+r.y*180/Math.PI)
}

  var ws_ratio_x, ws_ratio_y, ws_max_x, ws_max_y
  ws_max_x = angle_x_limit[(r.x<0)?1:0]
  ws_max_y = angle_y_limit[(r.y<0)?1:0]
  ws_ratio_x = Math.abs(r.x/ws_max_x)
  ws_ratio_y = Math.abs(r.y/ws_max_y)

  var bone_list = MMD_SA_options.look_at_screen_bone_list_by_model(this);
  for (var i = 0, i_length = bone_list.length; i < i_length; i++) {
    let b = bone_list[i]
    let bone = mesh.bones_by_name[b.name]
    if (!bone)
      continue

    let weight_screen = b.weight_screen
    let pos_scale = MMD_SA_options.model_para_obj.skin_default[b.name] && MMD_SA_options.model_para_obj.skin_default[b.name].pos_scale
    if (pos_scale)
      weight_screen *= Math.min(pos_scale.x, pos_scale.y, pos_scale.z)

    let rx, ry
    if (b.weight_screen_pow != null) {
      rx = ws_max_x * Math.pow(ws_ratio_x, b.weight_screen_pow)
      ry = ws_max_y * Math.pow(ws_ratio_y, b.weight_screen_pow)
    }
    else {
      rx = r.x
      ry = r.y
    }

    let weight_motion = b.weight_motion
    let _ratio = weight_motion + (1 - ratio) * (1 - weight_motion)
    let sx = (b.weight_screen_x != null) ? b.weight_screen_x : 1
    let sy = (b.weight_screen_y != null) ? b.weight_screen_y : 1
    MMD_SA.process_bone(bone, MMD_SA.TEMP_v3.set(rx * weight_screen * sx, ry * weight_screen * sy, 0), [_ratio+(1-_ratio)*(1-sx),_ratio+(1-_ratio)*(1-sy),1])
  }

  if (MMD_SA._update_with_look_at_screen_) {
    var b_list = MMD_SA._update_with_look_at_screen_.bone_list
    var p_list = MMD_SA._update_with_look_at_screen_.parent_list

    var p_rotation = MMD_SA.TEMP_q.set(0,0,0,1)
    for (var j = 0, j_length = p_list.length; j < j_length; j++) {
      var bone = mesh.bones_by_name[p_list[j]]
      if (bone)
        p_rotation.multiply(bone.quaternion, p_rotation)
    }
    p_rotation.inverse()

    for (var j = 0, j_length = b_list.length; j < j_length; j++) {
      let obj = b_list[j]
      let rot
      for (var k = 0, k_length = obj.name.length; k < k_length; k++) {
        let bone = mesh.bones_by_name[obj.name[k]]
        if (bone) {
          if (!rot) {
            rot = MMD_SA._q1.copy(p_rotation)
            let ratio = obj.ratio
            if (ratio < 1) {
              rot.inverse()
              ratio = -ratio
            }
            rot.slerp(MMD_SA._q2.set(0,0,0,1), 1-ratio/3)
          }
          bone.quaternion.multiply(rot)
        }
      }
    }
 
    MMD_SA._update_with_look_at_screen_ = null
  }
}
}

if (!look_at_screen && (this._model_index == 0)) {
  MMD_SA._rx = MMD_SA._rx_last = 0
  MMD_SA._ry = MMD_SA._ry_last = 0
}
// adjustment for "look at screen" - END

/*
// AT: process x_object with parent_bone
// moved to model.simulateCallback in index.js
*/

// meter motion START
if (self.MMD_SA && (this._model_index == 0)) {
  var model = this
  var motion_meter_index = MMD_SA_options.custom_action.length

  if (!meter_motion_disabled && (self.EV_usage > 9)) {
//DEBUG_show(self.EV_usage)
    var meter_motion = []
    if (EV_usage < 60)
      meter_motion.push(~~(EV_usage/10)-1)
    else
      meter_motion.push(4, ~~(EV_usage/10-1))

    for (var i = 0, i_len = model.skin_MMD_SA_extra.length-motion_meter_index; i < i_len; i++) {
      var skin = model.skin_MMD_SA_extra[i+motion_meter_index]

      var matched = false
      for (var k = 0, k_len = meter_motion.length; k < k_len; k++) {
        if (i == meter_motion[k]) {
          matched = true
          break
        }
      }

      if (matched) {
        if (skin._MMD_SA_disabled) {
          skin._MMD_SA_disabled = false
          skin.reset()
          skin.play()
        }
      }
      else {
        if (!skin._MMD_SA_disabled) {
          skin.pause()
          skin._MMD_SA_disabled = true
        }
      }
    }
  }
  else {
//if (!model.skin_MMD_SA_extra) console.log(model)
    for (var i = 0, i_len = model.skin_MMD_SA_extra.length-motion_meter_index; i < i_len; i++) {
      var skin = model.skin_MMD_SA_extra[i+motion_meter_index]
      if (!skin._MMD_SA_disabled) {
        skin.pause()
        skin._MMD_SA_disabled = true
      }
    }
  }
}
// meter motion END
	}

System._browser.camera.poseNet.frames.set_upper_body_rotation(this._model_index, 1);

// AT: custom skin (before IK update)
if (self.MMD_SA) {
//model_para._custom_skin = [{ key:{ name:"右腕ＩＫ", pos:[0,1,0] ,rot:[0,0,0,1] ,interp:MMD_SA._skin_interp_default }, idx:mesh.bones_by_name["右腕ＩＫ"]._index }]
  var _custom_skin = model_para._custom_skin || MMD_SA._custom_skin
  _custom_skin.forEach(function (s) {
if (!s.condition || s.condition(that)) {
//  that.skin.onupdate(s.key, s.key, 0, s.idx)
// to make it work on models that don't have .skin
    MMD_SA._skin_onupdate.call({mesh:mesh}, s.key, s.key, 0, s.idx)
}
  });
  model_para._custom_skin = null
  MMD_SA._custom_skin = []

// auto_adjust
  var motion_sd = para_SA.adjustment_per_model && (para_SA.adjustment_per_model[model_para._filename] || para_SA.adjustment_per_model[model_para._filename_cleaned] || para_SA.adjustment_per_model._default_);
  if (motion_sd && motion_sd.skin_default) {
    for (var b_name in motion_sd.skin_default) {
      var b = motion_sd.skin_default[b_name]
      if (b.pos_scale && b.pos_scale.auto_adjust && (b_name.indexOf("足ＩＫ") != -1) && model_para._ref_length && model_para._ref_length[b_name]) {
        var IK_pos = MMD_SA.get_bone_position(mesh, b_name)
        var leg_pos = MMD_SA.get_bone_position(mesh, b_name.substring(0,2))
        var pos_diff = leg_pos.sub(IK_pos).setY(0).multiplyScalar(1 - (((model_para._ref_length[b_name] / b.pos_scale.auto_adjust.ref_length) - 1) * (b.pos_scale.auto_adjust.scale||1) + 1))
        mesh.bones_by_name[b_name].position.sub(pos_diff)
//DEBUG_show([model_para._ref_length[b_name],b.pos_scale.auto_adjust.ref_length,Date.now()].join("\n"))
//DEBUG_show(pos_diff.toArray().join("\n")+"\n"+Date.now())
      }
    }
  }
}

// AT: process_bones (before IK)
if (self.MMD_SA) {
  if (!para_SA.process_bones_before_IK || !para_SA.process_bones_before_IK(this, this.skin)) {
    model_para.process_bones_before_IK && model_para.process_bones_before_IK(this, this.skin)
    window.dispatchEvent(new CustomEvent("SA_MMD_model" + this._model_index + "_process_bones_before_IK", { detail:{ model:this, skin:this.skin } }));
  }
}

// AT: mesh._IK_and_AddTrans
this._update_IK_and_AddTrans()
/*
	if ( this.ik ) {
// AT: deformHierachy
		this.ik.update([0,1]);
	}

	if ( this.addTrans ) {
		this.addTrans.update();
	}

// AT: deformHierachy
if ( this.ik ) {
	this.ik.update([2]);
}
*/

// AT: process_bones (after IK)
if (self.MMD_SA) {
  if (!para_SA.process_bones_after_IK || !para_SA.process_bones_after_IK(this, this.skin)) {
    model_para.process_bones_after_IK && model_para.process_bones_after_IK(this, this.skin)
    window.dispatchEvent(new CustomEvent("SA_MMD_model" + this._model_index + "_process_bones_after_IK", { detail:{ model:this, skin:this.skin } }));
  }
}

// AT: bone connection
if (self.MMD_SA) {
  MMD_SA_options.model_para_obj_all.forEach(function (model_para, idx) {
if (idx == that._model_index)
  return
var bone_connection = model_para.bone_connection
if (!bone_connection || (bone_connection.target_model_index != that._model_index))
  return

var pos = MMD_SA.get_bone_position(mesh, bone_connection.target_bone_name)
var rot = MMD_SA.get_bone_rotation(mesh, bone_connection.target_bone_name)

if (bone_connection.position) {
  pos.add(MMD_SA.TEMP_v3.set(-bone_connection.position.x, bone_connection.position.y, -bone_connection.position.z).applyQuaternion(rot))
}

if (bone_connection.rotation) {
  if (!bone_connection.rotation._quaternion)
    bone_connection.rotation._quaternion = new THREE.Quaternion().setFromEuler(MMD_SA.TEMP_v3.set(bone_connection.rotation.x*Math.PI/180, -bone_connection.rotation.y*Math.PI/180, bone_connection.rotation.z*Math.PI/180))
  rot.multiply(bone_connection.rotation._quaternion)
}

model_para._custom_skin = [{ key:{ name:bone_connection.self_bone_name, pos:pos.toArray() ,rot:rot.toArray(), interp:MMD_SA._skin_interp_default }, idx:THREE.MMD.getModels()[idx].mesh.bones_by_name[bone_connection.self_bone_name]._index }]
  });
}

// AT: moved from the end of "if (this.skin) {...}" to here, to make sure that it is behind all custom skin calculations
// AT: skip boundingCenterOffset-related for MMD_SA
//this.mesh.geometry.boundingSphere.center.addVectors( this.mesh.bones[0].position, this.boundingCenterOffset );

// AT: event
//window.dispatchEvent(new CustomEvent("SA_MMD_updateMotion", { detail:{ model:this } }));

	this.checkCallback();
};
Model.prototype.seekMotion = function( time, forceUpdate ) {
	this.resetBones();
	if ( this.morph ) {
		this.morph.seek( time, forceUpdate );
	}
	if ( this.skin ) {
		this.skin.seek( time, forceUpdate );
// AT: skip boundingCenterOffset-related for MMD_SA
//		this.mesh.geometry.boundingSphere.center.addVectors( this.mesh.bones[0].position, this.boundingCenterOffset );
	}
// AT: _update_IK_and_AddTrans
this._update_IK_and_AddTrans()
/*
	if ( this.ik ) {
		this.ik.update();
	}
	if ( this.addTrans ) {
		this.addTrans.update();
	}
*/
	this.checkCallback();
};
Model.prototype.playMotion = function( loop ) {
	if ( this.morph ) {
		this.morph.play( loop );
// AT: System Animator
if (this.morph_MMD_SA_extra) {
  this.morph_MMD_SA_extra.forEach(function (morph) {
if (!morph._MMD_SA_disabled) morph.play( loop );
  });
}
	}
	if ( this.skin ) {
		this.skin.play( loop );
// AT: System Animator
if (this.skin_MMD_SA_extra) {
  this.skin_MMD_SA_extra.forEach(function (skin) {
if (!skin._MMD_SA_disabled) skin.play( loop );
  });
}
	}
// AT: System Animator
if (this.camera) this.camera.play(loop);
};
Model.prototype.pauseMotion = function() {
	if ( this.morph ) {
		this.morph.pause();
// AT: System Animator
if (this.morph_MMD_SA_extra) {
  this.morph_MMD_SA_extra.forEach(function (morph) {
if (!morph._MMD_SA_disabled) morph.pause();
  });
}
	}
	if ( this.skin ) {
		this.skin.pause();
// AT: System Animator
if (this.skin_MMD_SA_extra) {
  this.skin_MMD_SA_extra.forEach(function (skin) {
if (!skin._MMD_SA_disabled) skin.pause();
  });
}
	}
// AT: System Animator
if (this.camera) this.camera.pause();
};
Model.prototype.preSimulate = function() {
	if ( this.physi ) {
		this.physi.preSimulate();
	}
};
Model.prototype.postSimulate = function() {
	if ( this.physi ) {
		this.physi.postSimulate();
	}
};
Model.prototype.dispose = function() {
	if ( this.physi ) {
		this.physi.dispose();
	}
	if ( this.mesh ) {
		this.mesh.dispose();
	}
	this.init();
};
Model.prototype.checkCallback = function() {
	if ( this._onmotionended ) {
		this._onmotionended( this );
		this._onmotionended = null;
	}
};

}()); // MODEL

var models, cameraMotion = [], lightMotion;//for jThree

(function() { // MMD

var motionPlaying, motionLoop, motionDelta, motionTime, tickPhysics, updatePhysicsDuringPause,
	targetRenderer, plugin,
	onended, checkCallback;

models = [];
motionPlaying = false;
motionLoop = false;
motionDelta = 0;
motionTime = 0;
tickPhysics = false;
updatePhysicsDuringPause = true; // モーション開始前に物理演算を更新させることで初期の安定を試みる。数秒間やるのが望ましいかも。
plugin = {
	render: function( _scene ) {
		var delta;
		if ( !MMD.targetScene || MMD.targetScene === _scene ) {
			if ( MMD.motionPlaying || tickPhysics || updatePhysicsDuringPause ) {
				tickPhysics = false;
				delta = motionDelta;
			} else {
				delta = 0;
			}
			MMD.simulate( delta );
		}
	}
};
checkCallback = function() {
	if ( onended ) {
		onended();
		onended = undefined;
	}
};

MMD = {
	addModel: function( model ) {
// AT: model index
model._model_index = model.pmx._model_index
		models.push( model );
	},
	removeModel: function( model ) {
		var idx;
		idx = models.indexOf( model );
		if ( idx >= 0 ) {
if (idx < models.length-1) {
  this.swapModels(idx, models.length-1, null, true);
}
models.length--;
MMD_SA_options.model_para_obj_all.length--;
for (const c of ["cache_by_model", "cache_by_model_next", "cache_by_model_temp"])
  MMD_SA.ammo_proxy[c].list.length--;
MMD_SA.THREEX.models.length--;
//			models.splice( idx, 1 );
		}
	},
	getModels: function() {
		return models;
	},

// AT: swap model
swapModels: function (i0, i1, func, no_transform) {
/*
Model
  _model_index

  mesh
    _model_index

  pmx
    _model_index

  morph_MMD_SA_extra
    MMDMorph
      _model_index

  skin_MMD_SA_extra
    MMDSkin
      _model_index

  _MMD_SA_cache
    morph
      _model_index
    skin
      _model_index

MMD_SA_options.model_para_obj_all
  _model_index

MMD_SA_options.model_para_obj

MMD_SA_options.mesh_obj_by_id

MMD_SA.ammo_proxy
  cache_by_model
    list
  cache_by_model_next
    list
  cache_by_model_temp
    list
*/
  [i0, i1].forEach(function (model_index) {
    var model = models[model_index]
    var model_index_new = (model_index == i0) ? i1 : i0

    model._model_index = model.mesh._model_index = model.pmx._model_index = model_index_new

    if (model.morph_MMD_SA_extra) {
      model.morph_MMD_SA_extra.forEach(function (obj) {
        obj._model_index = model_index_new
      });
    }
    if (model.skin_MMD_SA_extra) {
      model.skin_MMD_SA_extra.forEach(function (obj) {
        obj._model_index = model_index_new
      });
    }

    for (var path in model._MMD_SA_cache) {
      var obj = model._MMD_SA_cache[path]
      if (obj.morph)
        obj.morph._model_index = model_index_new
      if (obj.skin)
        obj.skin._model_index = model_index_new
    }
  });

  var obj0, obj1

  obj0 = models[i0]
  obj1 = models[i1]
  models[i0] = obj1
  models[i1] = obj0

  obj0 = MMD_SA_options.model_para_obj_all[i0]
  obj1 = MMD_SA_options.model_para_obj_all[i1]
  MMD_SA_options.model_para_obj_all[i0] = obj1
  MMD_SA_options.model_para_obj_all[i1] = obj0
  MMD_SA_options.model_para_obj_all[i0]._model_index = i0
  MMD_SA_options.model_para_obj_all[i1]._model_index = i1

  obj0 = MMD_SA_options.mesh_obj_by_id["mikuPmx" + i0]
  obj1 = MMD_SA_options.mesh_obj_by_id["mikuPmx" + i1]
  MMD_SA_options.mesh_obj_by_id["mikuPmx" + i0] = obj1
  MMD_SA_options.mesh_obj_by_id["mikuPmx" + i1] = obj0

  if (MMD_SA.ammo_proxy) {
    ["cache_by_model", "cache_by_model_next", "cache_by_model_temp"].forEach(function (p) {
      obj0 = MMD_SA.ammo_proxy[p].list[i0]
      obj1 = MMD_SA.ammo_proxy[p].list[i1]
      MMD_SA.ammo_proxy[p].list[i0] = obj1
      MMD_SA.ammo_proxy[p].list[i1] = obj0
    });
  }

  var loc0 = {}
  var loc1 = {}
  var p_list = ["position", "rotation", "quaternion"]
  if (!no_transform) {
    p_list.forEach(function (p) {
      loc0[p] = models[i0].mesh[p].clone()
      loc1[p] = models[i1].mesh[p].clone()
    });
  }

  func && func(i0, i1);

  if (!no_transform) {
    p_list.forEach(function (p) {
      models[i0].mesh[p].copy(loc1[p])
      models[i1].mesh[p].copy(loc0[p])
    });
  }

  if (i0 == 0) {
    MMD_SA_options.model_para_obj = MMD_SA_options.model_para_obj_all[0]

    models[0].mesh.visible = true
    models[0].mesh.children.forEach(function (c) { c.visible = true; });
  }
},

	setupCameraMotion: function( vmd, camera ) {

// AT: vmd is MMDCamera
if (cameraMotion.length) {
  cameraMotion[0].reset();
}

if (vmd) {
  cameraMotion = [vmd];
}
else {
  if (cameraMotion.length) {
    const c = cameraMotion[0].persepectiveCamera
    if (c.fov != MMD_SA_options.camera_fov) {
      c.fov = MMD_SA_options.camera_fov;
      c.updateProjectionMatrix();
    }
    MMD_SA.Camera_MOD.adjust_camera('MMDCamera_onupdate', MMD_SA._v3a_.set(0,0,0), MMD_SA._v3b_.set(0,0,0));
	c.rotationAutoUpdate = true;
	c.matrixAutoUpdate = true;
  }
  cameraMotion.length = 0;
}

/*
		var animation = vmd.generateCameraAnimation(),motion,index;

		cameraMotion.forEach( function( m, i ) {
			if ( m.persepectiveCamera === camera ) index = i;
		} );

		isFinite( index ) && cameraMotion.splice( index, 1 );

		//MOD by jThree
		if ( animation ) {
			motion = new MMDCamera( camera, animation );
			cameraMotion.push( motion );
			motion.vmd = vmd;//for jThree attrChange
		}
*/
	},
	getCameraMotion: function() {
		return cameraMotion;
	},
	setupLightMotion: function( vmd, light ) {
		var animation;
		animation = vmd.generateLightAnimation();
		if ( animation ) {
			lightMotion = new MMDLight( light, animation );
			lightMotion.vmd = vmd;//for jThree attrChange
		} else {
			lightMotion = undefined;
		}
	},
	getLightMotion: function() {
		return lightMotion;
	},
	adjustMotionDuration: function() {
		var duration = jThree.MMD._duration;//MOD by jThree

		// pass 1
		cameraMotion.forEach( function( m ) {
			duration = Math.max( duration, m.duration );
		} );
		if ( lightMotion ) {
			duration = Math.max( duration, lightMotion.duration );
		}
		models.forEach( function( v ) {
// AT: first model only
if (v._model_index > 0) return
			if ( v.skin ) {
// AT: duration_default
				duration = Math.max( duration, v.skin.duration_default );
			}
			if ( v.morph ) {
// AT: duration_default
				duration = Math.max( duration, v.morph.duration_default );
			}
		});

		// pass 2
		cameraMotion.forEach( function( m ) {
			m.adjustDuration( duration );
		} );
		if ( lightMotion ) {
			lightMotion.adjustDuration( duration );
		}
		models.forEach( function( v ) {
// AT: first model only
if (v._model_index > 0) return
			if ( v.skin ) {
				v.skin.adjustDuration( duration );
			}
			if ( v.morph ) {
				v.morph.adjustDuration( duration );
			}
		});
	},
	resetMotion: function() {
		cameraMotion.forEach( function( m ) {
			m.reset();
		} );
		if ( lightMotion ) {
			lightMotion.reset();
		}
		models.forEach( function( v ) {
			v.resetMotion();
		});
		motionTime = 0;
	},
	updateMotion: function( dt, force ) {
		// この関数はデルタ時間を更新する機能も兼ねているので、状況に関わらずこれを毎tick呼ぶこと！
		motionDelta = dt; // 最新のdeltaは常に覚えておく。
		if ( !force && !motionPlaying ) {
			return;
		}
		//MOD by jThree
		cameraMotion.forEach( function( m ) {
			m.update( dt, force );
		} );
		if ( lightMotion ) {
			lightMotion.update( dt, force );
		}
		models.forEach( function( v ) {
			v.updateMotion( dt, force );
		});
// AT: event after .updateMotion for all models
window.dispatchEvent(new CustomEvent("SA_MMD_model_all_process_bones"));
		checkCallback();
		motionTime += dt;
// AT: event for stuff that have to be LAST after updateMotion
window.dispatchEvent(new CustomEvent("SA_MMD_after_updateMotion"));
	},
	seekMotion: function( time, forceUpdate ) {
		if ( !forceUpdate && !motionPlaying ) {
			return;
		}
		//MOD by jThree
		cameraMotion.forEach( function( m ) {
			m.seek( time, forceUpdate );
		} );
		if ( lightMotion ) {
			lightMotion.seek( time, forceUpdate );
		}
		models.forEach( function( v ) {
			v.seekMotion( time, forceUpdate );
		});
		checkCallback();
		tickPhysics = true; // seekした時は物理演算を更新させる。
		motionTime = time;
	},
	playMotion: function( loop ) {
		var that;
		that = this;
		if ( loop !== undefined ) {
			motionLoop = loop;
		}
		//MOD by jThree
		cameraMotion.forEach( function( m ) {
			m.play( motionLoop );
		} );
		if ( lightMotion ) {
			lightMotion.play( motionLoop );
		}
		models.forEach( function( v ) {
			v.playMotion( motionLoop );
		});
		if ( models.length > 0 ) {
			// 先頭で代表させる。
			models[0].onmotionended = function( model ) {
				// skinアニメーションの完了時またはループ時に呼ばれる。
				//if ( model.skin.loop ) {
				if ( motionLoop ) {
					motionTime = 0;
				} else {
					that.pauseMotion();
				}
				onended = MMD.onmotionended; // mark
			};
		}
		motionPlaying = true;
	},
	pauseMotion: function( updatePhysics ) {
		updatePhysicsDuringPause = updatePhysics; // ポーズ中に物理演算を更新するかどうか。
		//MOD by jThree
		cameraMotion.forEach( function( m ) {
			m.pause();
		} );
		if ( lightMotion ) {
			lightMotion.pause();
		}
		models.forEach( function( v ) {
			v.pauseMotion();
		});
		motionPlaying = false;
	},
	adjustCameraOffset: function( param ) { // カメラの位置を調整。
		var model, offset, size;
		if ( cameraMotion ) {
			if ( param ) {
				model = param.model;
				offset = param.offset;
			} else {
				if ( models.length > 0 ) {
					model = models[0]; // 最初のモデルを対象にする。
				}
			}
			if ( model ) {
				// モデルの大きさに応じて調整。
				size = model.mesh.geometry.boundingBox.size();
			}
			cameraMotion.offset.set(0,0,0);
			if ( size ) {
				cameraMotion.offset.y = size.y - 20; // 標準ミクさんの高さは約20。
			}
			if ( offset ) {
				cameraMotion.offset.addVectors( cameraMotion.offset, offset );
			}
		}
	},
	getWorld: function() {
		return btWorld;
	},
	setGravity: function( x,y,z ) {
		btWorld.setGravity( tmpBV( x,y,z ) );

if (!MMD_SA.MMD_started || !MMD_SA.THREEX.enabled) return;

const gravity = MMD_SA.THREEX.v1.set(x,y,z);
const gravityPower = gravity.length()/5;
const gravityDir = gravity.normalize();

MMD_SA.THREEX.models.forEach(model=>{
  if ((model.type == 'VRM') && model.model.springBoneManager) {
// Set.forEach has no index
    let i = 0;
    model.model.springBoneManager.joints.forEach( e => {
      e.settings.gravityDir.copy(gravityDir);
      e.settings.gravityPower = model._joints_settings[i].gravityPower * gravityPower;
      i++;
    });
  }
});
	},
	simulate: function( timeStep, maxSubSteps ) {
// AT: ammo proxy
var _timeStep = timeStep
self.MMD_SA && MMD_SA.ammo_proxy && MMD_SA.ammo_proxy.lock("stepSimulation")
//EV_sync_update.fps_count_func()
var _t = performance.now()
		// ワールド行列計算後かつレンダリングする前にこれを呼ぶこと。
		if ( models.length === 0 ) {
			return;
		}

		if ( timeStep <= 0 ) {
			// pause
			//models.forEach( function( v ) {
			//	v.postSimulate();
			//});
		}
		else {
// AT: fix redundant physics simulations
if (self.MMD_SA) {
  if (MMD_SA._motionTime_last == THREE.MMD.motionTime)
    return
  MMD_SA._motionTime_last = THREE.MMD.motionTime
//DEBUG_show(THREE.MMD.motionTime)
// AT: ammo proxy
  timeStep += (MMD_SA.ammo_proxy && MMD_SA.ammo_proxy._timeStep) || 0
}
			//if ( !timeStep ) {
			//	if ( lastSimulateTime ) {
			//		timeStep = 0;
			//		while ( timeStep + lastSimulateDuration <= fixedTimeStep ) {
			//			timeStep = ( Date.now() - lastSimulateTime ) / 1000; // time since last simulation
			//		}
			//	} else {
			//		timeStep = fixedTimeStep; // handle first frame
			//	}
			//} else {
				if ( timeStep < fixedTimeStep ) {
					timeStep = fixedTimeStep;
				}
			//}
			maxSubSteps = maxSubSteps || Math.ceil( timeStep / fixedTimeStep ); // If maxSubSteps is not defined, keep the simulation fully up to date
			//lastSimulateDuration = Date.now();
// AT: limit maxSubSteps to reduce CPU usage
if (self.MMD_SA) {
//  DEBUG_show(maxSubSteps+'/'+MMD_SA_options.model_para_obj.physics_maxSubSteps+'/'+MMD_SA_options.physics_maxSubSteps)
  maxSubSteps = Math.min(Math.ceil( timeStep / fixedTimeStep ), MMD_SA_options.model_para_obj.physics_maxSubSteps||MMD_SA_options.physics_maxSubSteps||9)
//DEBUG_show(maxSubSteps)
//timeStep=fixedTimeStep;maxSubSteps=2;
}

			models.forEach( function( v ) {
// AT: check model visibility
if (!v.visible) return;
				v.preSimulate();
			});
//var _cb0=MMD_SA.ammo_proxy.command_buffer_count//DEBUG_show(timeStep)
			btWorld && btWorld.stepSimulation( timeStep, maxSubSteps, fixedTimeStep );//mod by jThree
			//btWorld.clearForces();
//console.log([timeStep, maxSubSteps, fixedTimeStep].join(","))
			models.forEach( function( v ) {
// AT: check model visibility
if (!v.visible) return;
				v.postSimulate();
			});
//if (_cb0) DEBUG_show(_cb0+'/'+MMD_SA.ammo_proxy.command_buffer_count+'/'+MMD_SA.ammo_proxy.command_buffer_index+'\n'+Date.now())
// AT: ammo proxy
if (self.MMD_SA) {
  if (MMD_SA.ammo_proxy) {
    if (MMD_SA.ammo_proxy.update_worker("stepSimulation")) {
      MMD_SA.ammo_proxy.cache_by_model_temp.transfer_to("cache_by_model_next")
      MMD_SA.ammo_proxy._timeStep = 0
    }
    else {
      MMD_SA.ammo_proxy._timeStep += _timeStep
      MMD_SA.ammo_proxy.reset()
//      console.log("(ammo worker update skipped/"+MMD_SA.ammo_proxy._timeStep+")")
    }
  }
  MMD_SA.physicsHelper && MMD_SA.physicsHelper.update()
}
//console.log(parseInt(performance.now()-_t))

			//lastSimulateDuration = ( Date.now() - lastSimulateDuration ) / 1000;
			//lastSimulateTime = Date.now();
		}
		models.forEach( function( v ) {
			if ( v.simulateCallback ) {
				v.simulateCallback();
			}
		});
//try{DEBUG_show(Math.round((performance.now()-_t)*100)/100)}catch(err){try{DEBUG_show(err)}catch(err2){}}
	},
	init: function( renderer, scene ) {
		MMD.targetScene = scene;
		MMD.targetRenderer = renderer;
	},
	targetScene: null,
	get targetRenderer() { return targetRenderer; },
	set targetRenderer( renderer ) {
		if ( targetRenderer !== renderer ) {
			targetRenderer = renderer;
			if ( renderer.renderPluginsPre.indexOf( plugin ) === -1 ) {
				// 物理演算更新はプリレンダーなプラグインとして登録。
				// 一番目に実行されるようにリストの先頭へ追加すること！
				renderer.renderPluginsPre.unshift( plugin );
			}
		}
	},
	get motionPlaying() { return motionPlaying; },
	get motionLoop() { return motionLoop; },
	get motionDelta() { return motionDelta; },
	get motionTime() { return motionTime; },
	onmotionended: null,
	minKeyDelta: 1/30 + 1/60, // カメラとライトモーション向け。誤差対策(+epsilon)
	STOP_ERP: 0.475, // 0.45,
	PMX: PMX,
	VMD: VMD,
	Model: Model
};

}()); // MMD

THREE.MMD = MMD;

// 試験的。
THREE.Mesh.prototype.dispose = function() { // delete webgl objects
	if ( this.material.materials ) {
		this.material.materials.forEach( function( v ) {
			disposeTextures( v );
			v.dispose();
		});
	} else {
		disposeTextures( this.material );
		this.material.dispose();
	}
	this.geometry.dispose();

	function disposeTextures( material ) {
		var o, p;
		for ( p in material ) {
			o = material[p];
			if ( o instanceof THREE.Texture ) {
				o.dispose();
				//console.log(p);
			}
		}
	}
};

// AT: ammo.js async
jThree._ammo_async_init_.push(function () {

window.Ammo && MMD.setGravity( 0, -9.8*10, 0 );//mod by jThree

//add by jThree
if ( window.Ammo ) {

	var _vec = new Ammo.btVector3(),
		trans = new Ammo.btTransform(),
		shape, localInertia, rbInfo, ground;
	_vec.setValue(0, 1, 0);
	shape = new Ammo.btStaticPlaneShape(_vec, 0);
	localInertia = new Ammo.btVector3(0, 0, 0);
	shape.calculateLocalInertia(0, localInertia);
	trans.setIdentity();

	rbInfo = new Ammo.btRigidBodyConstructionInfo(
		0,
		new Ammo.btDefaultMotionState(trans),
		shape,
		localInertia
	);
// AT: disable ground, ammo_proxy
if (self.MMD_SA && !MMD_SA_options.ground_physics_disabled) {
	ground = new Ammo.btRigidBody(rbInfo);
	btWorld.addRigidBody( ground );
	jThree.MMD._ground = ground.getWorldTransform().getOrigin();
    if (MMD_SA_options.ground_y)
      jThree.MMD._ground.setY(MMD_SA_options.ground_y)
}
	Ammo.destroy(rbInfo);
	Ammo.destroy(localInertia);
	Ammo.destroy(trans);
	Ammo.destroy(_vec);

}

// AT: ammo proxy
self.MMD_SA && MMD_SA.ammo_proxy && MMD_SA.ammo_proxy.update_worker();

});
if (!self.MMD_SA || !MMD_SA_options.ammo_version || MMD_SA._ammo_async_loaded_) { /*console.log(jThree._ammo_async_init_);*/ jThree._ammo_async_init_.forEach(function (func) { func() }); jThree._ammo_async_init_=[]; }

jThree.modelHooks.pmx = function( url, loaded ) {
	new PMX().load( url, function( pmx ) {
		loaded( pmx );
		loaded = null;
	} );

};

jThree.motionHooks.vmd = function( url, loaded ) {
	new VMD().load( url, function( vmd ) {
		loaded( vmd );
		loaded = null;
	} );

};

function removed() {
	models.splice( this.__mmd, 1 )[ 0 ].dispose();
}

jThree.mmdHook = function( pmx, motion, loaded ) {

	var frame = jThree.three( this );
// AT: model index
var _idx
if (/(\d+)$/.test(this.getAttribute("model"))) _idx = parseInt(RegExp.$1)
	if ( !motion ) {
// AT: a trick to delay the model creation AFTER everything else (mainly motions) is loaded, to prevent possible model corruption during some certain morph animations
(function () {
  var idx = _idx
  MMD_SA.fn._model_creation_timerID[idx] = setInterval(function(){ if (!MMD_SA.fn._ready_for_model_creation[idx]) return;
		new THREE.MMD.Model( pmx ).create( jThree.MMD, function( model ) {
			var mesh = model.mesh;
			frame.__mmd = model;
			mesh.material.materials.forEach( function(v) {
				v.fog = true; // use scene fog
				v.lights = true; // use scene light
				//v.parPixel = true;
				//v.wrapAround = true;
			});
			frame.addEventListener( "removed", removed );
			THREE.MMD.addModel( model );

			loaded( mesh );
			frame = loaded = null;
// AT: temp positioning for display during loading
var model_para = MMD_SA_options.model_para_obj_all[pmx._model_index]
var pos = model_para.position_loading
if (!pos) {
  var p_all = model_para.skin_default["全ての親"]
  pos = p_all && (p_all.pos || p_all.pos_add || p_all.pos_add_absolute)
  if (pos) {
    if ((pos==p_all.pos || pos==p_all.pos_add) && p_all.pos_add_absolute) {
      pos = {x:pos.x+p_all.pos_add_absolute.x, y:pos.y+p_all.pos_add_absolute.y, z:pos.z+p_all.pos_add_absolute.z}
    }
  }
}
if (pos) {
  mesh.position.set(pos.x, pos.y, pos.z)
}
		});
  clearInterval(MMD_SA.fn._model_creation_timerID[idx]); MMD_SA.fn._model_creation_timerID[idx]=null; setTimeout("MMD_SA.fn.setupUI()", 0);}, 500)
})();
	} else {

		var that = this;

		function successFn( e ) {

// AT: a trick to fix that "jThree.three( this )._srcObj" returns null in some cases, by storing obj in "MMD_SA._j3_obj_by_id" (eg. <mmd model="#m01" vmd="#v01".../>, the vmd part returns null)
var _srcObj = (jThree.three( this )._srcObj || ((self.MMD_SA && this._id) ? MMD_SA._j3_obj_by_id[this._id] : null));
// AT: a trick to delay the model creation AFTER everything else (mainly motions) is loaded, to prevent possible model corruption during some certain morph animations
(function () {
  var idx = _idx
  MMD_SA.fn._model_creation_timerID[idx] = setInterval(function(){ if (!MMD_SA.fn._ready_for_model_creation[idx]) return;
			new THREE.MMD.Model( pmx, _srcObj ).create( jThree.MMD, function( model ) {
				var mesh = model.mesh;
				frame.__mmd = model;
				mesh.material.materials.forEach( function(v) {
					v.fog = true; // use scene fog
					v.lights = true; // use scene light
					//v.parPixel = true;
					//v.wrapAround = true;
				});
				frame.addEventListener( "removed", removed );
				THREE.MMD.addModel( model );
				THREE.MMD.adjustMotionDuration();

				loaded( mesh );
				frame = loaded = null;
// AT: temp positioning for display during loading
var model_para = MMD_SA_options.model_para_obj_all[pmx._model_index]
var p_all = model_para.skin_default["全ての親"]
var pos = model_para.position_loading || (p_all && (p_all.pos || p_all.pos_add))
if (pos) {
  mesh.position.set(pos.x, pos.y, pos.z)
}
			});
  clearInterval(MMD_SA.fn._model_creation_timerID[idx]); MMD_SA.fn._model_creation_timerID[idx]=null; setTimeout("MMD_SA.fn.setupUI()", 0);}, 500)
})();
			if ( e ) {
				$.event.remove( this, "load", successFn );
				$.event.remove( this, "error", errorFn );
			}

			that = null;

		}

		function errorFn() {
			$.event.remove( this, "load", successFn );
			$.event.remove( this, "error", errorFn );
			$.event.trigger( "error", undefined, that );
			that = frame = loaded = null;
		}

		switch ( motion.attr( "loadStates" ) ) {
		case "loading":
			motion.load( successFn );
			motion.error( errorFn );
			break;
		case "success":
			successFn.call( motion );
			break;
		default:
			$.event.trigger( "error", undefined, this );
			break;
		}

	}
};

jThree.otherMmdHook = function( motion ) {

	var that = this;

	function successFn( e ) {

		var fn = THREE.MMD[ "setup" + ( that.tagName === "CAMERA" ? "Camera" : "Light" ) + "Motion" ],
			obj = jThree.three( that ),
			vmd = jThree.three( this )._srcObj;

		fn( vmd, obj );
		THREE.MMD.adjustMotionDuration();

		$.event.trigger( "load", undefined, that );

		if ( e ) {
			$.event.remove( this, "load", successFn );
			$.event.remove( this, "error", errorFn );
		}

		that = null;

	}

	function errorFn() {
		$.event.remove( this, "load", successFn );
		$.event.remove( this, "error", errorFn );
		$.event.trigger( "error", undefined, that );
		that = null;
	}

	switch ( motion.attr( "loadStates" ) ) {
	case "loading":
		motion.load( successFn );
		motion.error( errorFn );
		break;
	case "success":
		successFn.call( motion[ 0 ] );
		break;
	default:
		if ( this.tagName === "CAMERA" ) {
			var cam = jThree.three( this );
			cameraMotion.forEach( function( m, index ) {
				m.persepectiveCamera === cam && cameraMotion.splice( index, 1 );
			} );
			cam = null;
		} else {
			lightMotion = null;
		}
		$.event.trigger( "load", undefined, this );
		break;
	}
};

jThree.MMD._simulate = {
	render: function() {
		motionSeek = false;
// AT: ._playbackRate, model_para_obj.physics_maxSubSteps
if (self.MMD_SA) {
//EV_sync_update.fps_count_func()
// /playbackRate (not *playbackRate) to restore the correct MMD.motionDelta that has been adjusted.
  MMD.simulate( MMD.motionPlaying || motionSeek ? MMD.motionDelta/(MMD_SA._playbackRate * MMD_SA.playbackRate) : 0 )//, MMD_SA_options.model_para_obj.physics_maxSubSteps)
}
else
		MMD.simulate( MMD.motionPlaying || motionSeek ? MMD.motionDelta : 0 );
	}
};

jThree.MMD.seek = THREE.MMD.seekMotion;

}());


// MMDPhysics visualizer START
THREE.MMDPhysicsHelper = function ( mesh ) {
/*
	if ( mesh.physics === undefined || mesh.geometry.rigidBodies === undefined ) {

		throw 'THREE.MMDPhysicsHelper requires physics in mesh and rigidBodies in mesh.geometry.';

	}
*/
	THREE.Object3D.call( this );

	this.root = mesh;

	this.matrix = mesh.matrixWorld.clone();
	this.matrixAutoUpdate = false;

	this.materials = [];

	this.materials.push(
		new THREE.MeshBasicMaterial( {
			color: new THREE.Color( 0xff8888 ),
			wireframe: true,
			depthTest: false,
			depthWrite: false,
			opacity: 0.25,
			transparent: true
		} )
	);

	this.materials.push(
		new THREE.MeshBasicMaterial( {
			color: new THREE.Color( 0x88ff88 ),
			wireframe: true,
			depthTest: false,
			depthWrite: false,
			opacity: 0.25,
			transparent: true
		} )
	);

	this.materials.push(
		new THREE.MeshBasicMaterial( {
			color: new THREE.Color( 0x8888ff ),
			wireframe: true,
			depthTest: false,
			depthWrite: false,
			opacity: 0.25,
			transparent: true
		} )
	);

	this._init();
	this.update();

};

THREE.MMDPhysicsHelper.prototype = Object.create( THREE.Object3D.prototype );
THREE.MMDPhysicsHelper.prototype.constructor = THREE.MMDPhysicsHelper;

THREE.MMDPhysicsHelper.prototype._init = function () {

	var mesh = this.root;
	var rigidBodies = mesh.MMDrigids;

/*
		case 0:
			shape = new Ammo.btSphereShape(v.size[0]);
			break;
		case 1:
			shape = new Ammo.btBoxShape(tmpBV(v.size[0], v.size[1], v.size[2]));
			break;
		case 2:
			shape = new Ammo.btCapsuleShape(v.size[0], v.size[1]);
			break;
*/

	function createGeometry( param ) {

		switch ( param.shape ) {

			case 0:
				return new THREE.SphereGeometry( param.size[0], 16, 8 );

			case 1:
				return new THREE.CubeGeometry( param.size[0] * 2, param.size[1] * 2, param.size[2] * 2, 8, 8, 8);

			case 2:
				return createCapsuleGeometry( param.size[0], param.size[1], 16, 8 );

			default:
				return null;

		}

	}

	// copy from http://www20.atpages.jp/katwat/three.js_r58/examples/mytest37/mytest37.js?ver=20160815
	function createCapsuleGeometry( radius, cylinderHeight, segmentsRadius, segmentsHeight ) {

		var geometry = new THREE.CylinderGeometry( radius, radius, cylinderHeight, segmentsRadius, segmentsHeight, true );
/*
		var upperSphere = new THREE.Mesh( new THREE.SphereBufferGeometry( radius, segmentsRadius, segmentsHeight, 0, Math.PI * 2, 0, Math.PI / 2 ) );
		var lowerSphere = new THREE.Mesh( new THREE.SphereBufferGeometry( radius, segmentsRadius, segmentsHeight, 0, Math.PI * 2, Math.PI / 2, Math.PI / 2 ) );

		upperSphere.position.set( 0, cylinderHeight / 2, 0 );
		lowerSphere.position.set( 0, -cylinderHeight / 2, 0 );

		upperSphere.updateMatrix();
		lowerSphere.updateMatrix();

		geometry.merge( upperSphere.geometry, upperSphere.matrix );
		geometry.merge( lowerSphere.geometry, lowerSphere.matrix );
*/
		return geometry;

	}

	for ( var i = 0, il = rigidBodies.length; i < il; i ++ ) {

		var param = rigidBodies[ i ];
let mesh = new THREE.Mesh( createGeometry( param ), this.materials[ param.type ] )
mesh.useQuaternion = true
		this.add( mesh );

	}

};

THREE.MMDPhysicsHelper.prototype.update = function () {

	var mesh = this.root;
	var rigidBodies = mesh.MMDrigids;
//	var bodies = mesh.physics.bodies;

	var matrixWorldInv = new THREE.Matrix4().getInverse( mesh.matrixWorld );
	var vector = new THREE.Vector3();
	var quaternion = new THREE.Quaternion();
	var quaternion2 = new THREE.Quaternion();

	function getPosition( origin ) {

		vector.set( origin.x(), origin.y(), origin.z() );
//		vector.applyMatrix4( matrixWorldInv );

		return vector;

	}

	function getQuaternion( rotation ) {

		quaternion.set( rotation.x(), rotation.y(), rotation.z(), rotation.w() );
		quaternion2.setFromRotationMatrix( matrixWorldInv );
		quaternion2.multiply( quaternion );

		return quaternion2;

	}

	for ( var i = 0, il = rigidBodies.length; i < il; i ++ ) {

		let body = rigidBodies[i].body;
		let mesh = this.children[ i ];

		let tr = body.getCenterOfMassTransform();

		mesh.position.copy( getPosition( tr.getOrigin() ) );
		mesh.quaternion.copy( getQuaternion( tr.getRotation() ) );

	}

this.matrix.copy(this.root.matrix)
this.updateMatrix()

};
// MMDPhysics visualizer END


(function () {
'use strict';

var UTF8_UNKNOWN = '?'.charCodeAt(0),

/**
 * Encoding.
 *
 * @type {Object}
 * @public
 * @static
 */
Encoding = {
  /**
   * Joins a character code array to string.
   *
   * @param  {Array|TypedArray}  data  The data being joined.
   * @return {String}                  The joined string.
   *
   * @public
   * @function
   */
  /**
   * SJIS To UTF8
   *
   * @private
   * @ignore
   */
  SJISToUTF8 : function(data) {
    var r = [], len = data.length, i = 0,
        b1, b2, u2, u3, jis, utf8;

    for (; i < len; i++) {
      if (0xA1 <= data[i] && data[i] <= 0xDF) {
        b2 = data[i] - 0x40;
        u2 = 0xBC | ((b2 >> 6) & 0x03);
        u3 = 0x80 | (b2 & 0x3F);
        r[r.length] = 0xEF;
        r[r.length] = u2;
        r[r.length] = u3;
      } else if (data[i] >= 0x80) {
        b1 = data[i] << 1;
        b2 = data[++i];
        if (b2 < 0x9F) {
          if (b1 < 0x13F) {
            b1 -= 0xE1;
          } else {
            b1 -= 0x61;
          }
          if (b2 > 0x7E) {
            b2 -= 0x20;
          } else {
            b2 -= 0x1F;
          }
        } else {
          if (b1 < 0x13F) {
            b1 -= 0xE0;
          } else {
            b1 -= 0x60;
          }
          b2 -= 0x7E;
        }
        b1 &= 0xFF;
        jis = (b1 << 8) + b2;
        if (ENCODING_JIS_TO_UTF8_MAPS[jis] === void 0) {
          r[r.length] = UTF8_UNKNOWN;
        } else {
          utf8 = ENCODING_JIS_TO_UTF8_MAPS[jis];
          if (utf8 < 0xFFFF) {
            r[r.length] = utf8 >> 8 & 0xFF;
            r[r.length] = utf8 & 0xFF;
          } else {
            r[r.length] = utf8 >> 16 & 0xFF;
            r[r.length] = utf8 >> 8 & 0xFF;
            r[r.length] = utf8 & 0xFF;
          }
        }
      } else {
        r[r.length] = data[i];
      }
    }
    return r;
  },
  /**
   * UTF-8 to UTF-16 (JavaScript Unicode array)
   *
   * @private
   * @ignore
   * based: Pot.js (UTF8.js)
   */
  UTF8ToUNICODE : function(data) {
    var r = [], i = 0, len = data.length,
        n, c, c2, c3, c4, code;

    while (i < len) {
      c = data[i++];
      n = (c >> 4);
      if (0 <= n && n <= 7) {
        // 0xxx xxxx
        r[r.length] = c;
      } else if (12 <= n && n <= 13) {
        // 110x xxxx
        // 10xx xxxx
        c2 = data[i++];
        r[r.length] = ((c & 0x1F) << 6) | (c2 & 0x3F);
      } else if (n === 14) {
        // 1110 xxxx
        // 10xx xxxx
        // 10xx xxxx
        c2 = data[i++];
        c3 = data[i++];
        r[r.length] = ((c  & 0x0F) << 12) |
                      ((c2 & 0x3F) <<  6) |
                      ((c3 & 0x3F) <<  0);
      } else if (i + 2 < len) {
        // 1111 0xxx ...
        c2 = data[i++];
        c3 = data[i++];
        c4 = data[i++];
        r[r.length] = (((c  & 0x07) << 18) |
                       ((c2 & 0x3F) << 12) |
                       ((c3 & 0x3F) <<  6) |
                       ((c4 & 0x3F) <<  0));
      }
    }
    return r;
  },
  /**
   * SJIS to UTF-16 (JavaScript Unicode array)
   *
   * @private
   * @ignore
   */
  SJISToUNICODE : function(data) {
    return Encoding.UTF8ToUNICODE(Encoding.SJISToUTF8(data));
  }
},

/**
 * Encoding maps JIS to UTF8.
 *
 * @ignore
 */
ENCODING_JIS_TO_UTF8_MAPS = {
0x2D21:0xE291A0,0x2D22:0xE291A1,0x2D23:0xE291A2,0x2D24:0xE291A3,0x2D25:0xE291A4,
0x2D26:0xE291A5,0x2D27:0xE291A6,0x2D28:0xE291A7,0x2D29:0xE291A8,0x2D2A:0xE291A9,
0x2D2B:0xE291AA,0x2D2C:0xE291AB,0x2D2D:0xE291AC,0x2D2E:0xE291AD,0x2D2F:0xE291AE,
0x2D30:0xE291AF,0x2D31:0xE291B0,0x2D32:0xE291B1,0x2D33:0xE291B2,0x2D34:0xE291B3,
0x2D35:0xE285A0,0x2D36:0xE285A1,0x2D37:0xE285A2,0x2D38:0xE285A3,0x2D39:0xE285A4,
0x2D3A:0xE285A5,0x2D3B:0xE285A6,0x2D3C:0xE285A7,0x2D3D:0xE285A8,0x2D3E:0xE285A9,
0x2D40:0xE38D89,0x2D41:0xE38C94,0x2D42:0xE38CA2,0x2D43:0xE38D8D,0x2D44:0xE38C98,
0x2D45:0xE38CA7,0x2D46:0xE38C83,0x2D47:0xE38CB6,0x2D48:0xE38D91,0x2D49:0xE38D97,
0x2D4A:0xE38C8D,0x2D4B:0xE38CA6,0x2D4C:0xE38CA3,0x2D4D:0xE38CAB,0x2D4E:0xE38D8A,
0x2D4F:0xE38CBB,0x2D50:0xE38E9C,0x2D51:0xE38E9D,0x2D52:0xE38E9E,0x2D53:0xE38E8E,
0x2D54:0xE38E8F,0x2D55:0xE38F84,0x2D56:0xE38EA1,0x2D5F:0xE38DBB,0x2D60:0xE3809D,
0x2D61:0xE3809F,0x2D62:0xE28496,0x2D63:0xE38F8D,0x2D64:0xE284A1,0x2D65:0xE38AA4,
0x2D66:0xE38AA5,0x2D67:0xE38AA6,0x2D68:0xE38AA7,0x2D69:0xE38AA8,0x2D6A:0xE388B1,
0x2D6B:0xE388B2,0x2D6C:0xE388B9,0x2D6D:0xE38DBE,0x2D6E:0xE38DBD,0x2D6F:0xE38DBC,
0x2D73:0xE288AE,0x2D74:0xE28891,0x2D78:0xE2889F,0x2D79:0xE28ABF,

0x2121:0xE38080,0x2122:0xE38081,0x2123:0xE38082,0x2124:0xEFBC8C,0x2125:0xEFBC8E,
0x2126:0xE383BB,0x2127:0xEFBC9A,0x2128:0xEFBC9B,0x2129:0xEFBC9F,0x212A:0xEFBC81,
0x212B:0xE3829B,0x212C:0xE3829C,0x212D:0xC2B4,0x212E:0xEFBD80,0x212F:0xC2A8,
0x2130:0xEFBCBE,0x2131:0xEFBFA3,0x2132:0xEFBCBF,0x2133:0xE383BD,0x2134:0xE383BE,
0x2135:0xE3829D,0x2136:0xE3829E,0x2137:0xE38083,0x2138:0xE4BB9D,0x2139:0xE38085,
0x213A:0xE38086,0x213B:0xE38087,0x213C:0xE383BC,0x213D:0xE28095,0x213E:0xE28090,
0x213F:0xEFBC8F,0x2140:0xEFBCBC,0x2141:0xEFBD9E,0x2142:0xE28096,0x2143:0xEFBD9C,
0x2144:0xE280A6,0x2145:0xE280A5,0x2146:0xE28098,0x2147:0xE28099,0x2148:0xE2809C,
0x2149:0xE2809D,0x214A:0xEFBC88,0x214B:0xEFBC89,0x214C:0xE38094,0x214D:0xE38095,
0x214E:0xEFBCBB,0x214F:0xEFBCBD,0x2150:0xEFBD9B,0x2151:0xEFBD9D,0x2152:0xE38088,
0x2153:0xE38089,0x2154:0xE3808A,0x2155:0xE3808B,0x2156:0xE3808C,0x2157:0xE3808D,
0x2158:0xE3808E,0x2159:0xE3808F,0x215A:0xE38090,0x215B:0xE38091,0x215C:0xEFBC8B,
0x215D:0xEFBC8D,0x215E:0xC2B1,0x215F:0xC397,0x2160:0xC3B7,0x2161:0xEFBC9D,
0x2162:0xE289A0,0x2163:0xEFBC9C,0x2164:0xEFBC9E,0x2165:0xE289A6,0x2166:0xE289A7,
0x2167:0xE2889E,0x2168:0xE288B4,0x2169:0xE29982,0x216A:0xE29980,0x216B:0xC2B0,
0x216C:0xE280B2,0x216D:0xE280B3,0x216E:0xE28483,0x216F:0xEFBFA5,0x2170:0xEFBC84,
0x2171:0xEFBFA0,0x2172:0xEFBFA1,0x2173:0xEFBC85,0x2174:0xEFBC83,0x2175:0xEFBC86,
0x2176:0xEFBC8A,0x2177:0xEFBCA0,0x2178:0xC2A7,0x2179:0xE29886,0x217A:0xE29885,
0x217B:0xE2978B,0x217C:0xE2978F,0x217D:0xE2978E,0x217E:0xE29787,0x2221:0xE29786,
0x2222:0xE296A1,0x2223:0xE296A0,0x2224:0xE296B3,0x2225:0xE296B2,0x2226:0xE296BD,
0x2227:0xE296BC,0x2228:0xE280BB,0x2229:0xE38092,0x222A:0xE28692,0x222B:0xE28690,
0x222C:0xE28691,0x222D:0xE28693,0x222E:0xE38093,0x223A:0xE28888,0x223B:0xE2888B,
0x223C:0xE28A86,0x223D:0xE28A87,0x223E:0xE28A82,0x223F:0xE28A83,0x2240:0xE288AA,
0x2241:0xE288A9,0x224A:0xE288A7,0x224B:0xE288A8,0x224C:0xC2AC,0x224D:0xE28792,
0x224E:0xE28794,0x224F:0xE28880,0x2250:0xE28883,0x225C:0xE288A0,0x225D:0xE28AA5,
0x225E:0xE28C92,0x225F:0xE28882,0x2260:0xE28887,0x2261:0xE289A1,0x2262:0xE28992,
0x2263:0xE289AA,0x2264:0xE289AB,0x2265:0xE2889A,0x2266:0xE288BD,0x2267:0xE2889D,
0x2268:0xE288B5,0x2269:0xE288AB,0x226A:0xE288AC,0x2272:0xE284AB,0x2273:0xE280B0,
0x2274:0xE299AF,0x2275:0xE299AD,0x2276:0xE299AA,0x2277:0xE280A0,0x2278:0xE280A1,
0x2279:0xC2B6,0x227E:0xE297AF,0x2330:0xEFBC90,0x2331:0xEFBC91,0x2332:0xEFBC92,
0x2333:0xEFBC93,0x2334:0xEFBC94,0x2335:0xEFBC95,0x2336:0xEFBC96,0x2337:0xEFBC97,
0x2338:0xEFBC98,0x2339:0xEFBC99,0x2341:0xEFBCA1,0x2342:0xEFBCA2,0x2343:0xEFBCA3,
0x2344:0xEFBCA4,0x2345:0xEFBCA5,0x2346:0xEFBCA6,0x2347:0xEFBCA7,0x2348:0xEFBCA8,
0x2349:0xEFBCA9,0x234A:0xEFBCAA,0x234B:0xEFBCAB,0x234C:0xEFBCAC,0x234D:0xEFBCAD,
0x234E:0xEFBCAE,0x234F:0xEFBCAF,0x2350:0xEFBCB0,0x2351:0xEFBCB1,0x2352:0xEFBCB2,
0x2353:0xEFBCB3,0x2354:0xEFBCB4,0x2355:0xEFBCB5,0x2356:0xEFBCB6,0x2357:0xEFBCB7,
0x2358:0xEFBCB8,0x2359:0xEFBCB9,0x235A:0xEFBCBA,0x2361:0xEFBD81,0x2362:0xEFBD82,
0x2363:0xEFBD83,0x2364:0xEFBD84,0x2365:0xEFBD85,0x2366:0xEFBD86,0x2367:0xEFBD87,
0x2368:0xEFBD88,0x2369:0xEFBD89,0x236A:0xEFBD8A,0x236B:0xEFBD8B,0x236C:0xEFBD8C,
0x236D:0xEFBD8D,0x236E:0xEFBD8E,0x236F:0xEFBD8F,0x2370:0xEFBD90,0x2371:0xEFBD91,
0x2372:0xEFBD92,0x2373:0xEFBD93,0x2374:0xEFBD94,0x2375:0xEFBD95,0x2376:0xEFBD96,
0x2377:0xEFBD97,0x2378:0xEFBD98,0x2379:0xEFBD99,0x237A:0xEFBD9A,0x2421:0xE38181,
0x2422:0xE38182,0x2423:0xE38183,0x2424:0xE38184,0x2425:0xE38185,0x2426:0xE38186,
0x2427:0xE38187,0x2428:0xE38188,0x2429:0xE38189,0x242A:0xE3818A,0x242B:0xE3818B,
0x242C:0xE3818C,0x242D:0xE3818D,0x242E:0xE3818E,0x242F:0xE3818F,0x2430:0xE38190,
0x2431:0xE38191,0x2432:0xE38192,0x2433:0xE38193,0x2434:0xE38194,0x2435:0xE38195,
0x2436:0xE38196,0x2437:0xE38197,0x2438:0xE38198,0x2439:0xE38199,0x243A:0xE3819A,
0x243B:0xE3819B,0x243C:0xE3819C,0x243D:0xE3819D,0x243E:0xE3819E,0x243F:0xE3819F,
0x2440:0xE381A0,0x2441:0xE381A1,0x2442:0xE381A2,0x2443:0xE381A3,0x2444:0xE381A4,
0x2445:0xE381A5,0x2446:0xE381A6,0x2447:0xE381A7,0x2448:0xE381A8,0x2449:0xE381A9,
0x244A:0xE381AA,0x244B:0xE381AB,0x244C:0xE381AC,0x244D:0xE381AD,0x244E:0xE381AE,
0x244F:0xE381AF,0x2450:0xE381B0,0x2451:0xE381B1,0x2452:0xE381B2,0x2453:0xE381B3,
0x2454:0xE381B4,0x2455:0xE381B5,0x2456:0xE381B6,0x2457:0xE381B7,0x2458:0xE381B8,
0x2459:0xE381B9,0x245A:0xE381BA,0x245B:0xE381BB,0x245C:0xE381BC,0x245D:0xE381BD,
0x245E:0xE381BE,0x245F:0xE381BF,0x2460:0xE38280,0x2461:0xE38281,0x2462:0xE38282,
0x2463:0xE38283,0x2464:0xE38284,0x2465:0xE38285,0x2466:0xE38286,0x2467:0xE38287,
0x2468:0xE38288,0x2469:0xE38289,0x246A:0xE3828A,0x246B:0xE3828B,0x246C:0xE3828C,
0x246D:0xE3828D,0x246E:0xE3828E,0x246F:0xE3828F,0x2470:0xE38290,0x2471:0xE38291,
0x2472:0xE38292,0x2473:0xE38293,0x2521:0xE382A1,0x2522:0xE382A2,0x2523:0xE382A3,
0x2524:0xE382A4,0x2525:0xE382A5,0x2526:0xE382A6,0x2527:0xE382A7,0x2528:0xE382A8,
0x2529:0xE382A9,0x252A:0xE382AA,0x252B:0xE382AB,0x252C:0xE382AC,0x252D:0xE382AD,
0x252E:0xE382AE,0x252F:0xE382AF,0x2530:0xE382B0,0x2531:0xE382B1,0x2532:0xE382B2,
0x2533:0xE382B3,0x2534:0xE382B4,0x2535:0xE382B5,0x2536:0xE382B6,0x2537:0xE382B7,
0x2538:0xE382B8,0x2539:0xE382B9,0x253A:0xE382BA,0x253B:0xE382BB,0x253C:0xE382BC,
0x253D:0xE382BD,0x253E:0xE382BE,0x253F:0xE382BF,0x2540:0xE38380,0x2541:0xE38381,
0x2542:0xE38382,0x2543:0xE38383,0x2544:0xE38384,0x2545:0xE38385,0x2546:0xE38386,
0x2547:0xE38387,0x2548:0xE38388,0x2549:0xE38389,0x254A:0xE3838A,0x254B:0xE3838B,
0x254C:0xE3838C,0x254D:0xE3838D,0x254E:0xE3838E,0x254F:0xE3838F,0x2550:0xE38390,
0x2551:0xE38391,0x2552:0xE38392,0x2553:0xE38393,0x2554:0xE38394,0x2555:0xE38395,
0x2556:0xE38396,0x2557:0xE38397,0x2558:0xE38398,0x2559:0xE38399,0x255A:0xE3839A,
0x255B:0xE3839B,0x255C:0xE3839C,0x255D:0xE3839D,0x255E:0xE3839E,0x255F:0xE3839F,
0x2560:0xE383A0,0x2561:0xE383A1,0x2562:0xE383A2,0x2563:0xE383A3,0x2564:0xE383A4,
0x2565:0xE383A5,0x2566:0xE383A6,0x2567:0xE383A7,0x2568:0xE383A8,0x2569:0xE383A9,
0x256A:0xE383AA,0x256B:0xE383AB,0x256C:0xE383AC,0x256D:0xE383AD,0x256E:0xE383AE,
0x256F:0xE383AF,0x2570:0xE383B0,0x2571:0xE383B1,0x2572:0xE383B2,0x2573:0xE383B3,
0x2574:0xE383B4,0x2575:0xE383B5,0x2576:0xE383B6,0x2621:0xCE91,0x2622:0xCE92,
0x2623:0xCE93,0x2624:0xCE94,0x2625:0xCE95,0x2626:0xCE96,0x2627:0xCE97,
0x2628:0xCE98,0x2629:0xCE99,0x262A:0xCE9A,0x262B:0xCE9B,0x262C:0xCE9C,
0x262D:0xCE9D,0x262E:0xCE9E,0x262F:0xCE9F,0x2630:0xCEA0,0x2631:0xCEA1,
0x2632:0xCEA3,0x2633:0xCEA4,0x2634:0xCEA5,0x2635:0xCEA6,0x2636:0xCEA7,
0x2637:0xCEA8,0x2638:0xCEA9,0x2641:0xCEB1,0x2642:0xCEB2,0x2643:0xCEB3,
0x2644:0xCEB4,0x2645:0xCEB5,0x2646:0xCEB6,0x2647:0xCEB7,0x2648:0xCEB8,
0x2649:0xCEB9,0x264A:0xCEBA,0x264B:0xCEBB,0x264C:0xCEBC,0x264D:0xCEBD,
0x264E:0xCEBE,0x264F:0xCEBF,0x2650:0xCF80,0x2651:0xCF81,0x2652:0xCF83,
0x2653:0xCF84,0x2654:0xCF85,0x2655:0xCF86,0x2656:0xCF87,0x2657:0xCF88,
0x2658:0xCF89,0x2721:0xD090,0x2722:0xD091,0x2723:0xD092,0x2724:0xD093,
0x2725:0xD094,0x2726:0xD095,0x2727:0xD081,0x2728:0xD096,0x2729:0xD097,
0x272A:0xD098,0x272B:0xD099,0x272C:0xD09A,0x272D:0xD09B,0x272E:0xD09C,
0x272F:0xD09D,0x2730:0xD09E,0x2731:0xD09F,0x2732:0xD0A0,0x2733:0xD0A1,
0x2734:0xD0A2,0x2735:0xD0A3,0x2736:0xD0A4,0x2737:0xD0A5,0x2738:0xD0A6,
0x2739:0xD0A7,0x273A:0xD0A8,0x273B:0xD0A9,0x273C:0xD0AA,0x273D:0xD0AB,
0x273E:0xD0AC,0x273F:0xD0AD,0x2740:0xD0AE,0x2741:0xD0AF,0x2751:0xD0B0,
0x2752:0xD0B1,0x2753:0xD0B2,0x2754:0xD0B3,0x2755:0xD0B4,0x2756:0xD0B5,
0x2757:0xD191,0x2758:0xD0B6,0x2759:0xD0B7,0x275A:0xD0B8,0x275B:0xD0B9,
0x275C:0xD0BA,0x275D:0xD0BB,0x275E:0xD0BC,0x275F:0xD0BD,0x2760:0xD0BE,
0x2761:0xD0BF,0x2762:0xD180,0x2763:0xD181,0x2764:0xD182,0x2765:0xD183,
0x2766:0xD184,0x2767:0xD185,0x2768:0xD186,0x2769:0xD187,0x276A:0xD188,
0x276B:0xD189,0x276C:0xD18A,0x276D:0xD18B,0x276E:0xD18C,0x276F:0xD18D,
0x2770:0xD18E,0x2771:0xD18F,0x2821:0xE29480,0x2822:0xE29482,0x2823:0xE2948C,
0x2824:0xE29490,0x2825:0xE29498,0x2826:0xE29494,0x2827:0xE2949C,0x2828:0xE294AC,
0x2829:0xE294A4,0x282A:0xE294B4,0x282B:0xE294BC,0x282C:0xE29481,0x282D:0xE29483,
0x282E:0xE2948F,0x282F:0xE29493,0x2830:0xE2949B,0x2831:0xE29497,0x2832:0xE294A3,
0x2833:0xE294B3,0x2834:0xE294AB,0x2835:0xE294BB,0x2836:0xE2958B,0x2837:0xE294A0,
0x2838:0xE294AF,0x2839:0xE294A8,0x283A:0xE294B7,0x283B:0xE294BF,0x283C:0xE2949D,
0x283D:0xE294B0,0x283E:0xE294A5,0x283F:0xE294B8,0x2840:0xE29582,0x3021:0xE4BA9C,
0x3022:0xE59496,0x3023:0xE5A883,0x3024:0xE998BF,0x3025:0xE59380,0x3026:0xE6849B,
0x3027:0xE68CA8,0x3028:0xE5A7B6,0x3029:0xE980A2,0x302A:0xE891B5,0x302B:0xE88C9C,
0x302C:0xE7A990,0x302D:0xE682AA,0x302E:0xE68FA1,0x302F:0xE6B8A5,0x3030:0xE697AD,
0x3031:0xE891A6,0x3032:0xE88AA6,0x3033:0xE9AFB5,0x3034:0xE6A293,0x3035:0xE59CA7,
0x3036:0xE696A1,0x3037:0xE689B1,0x3038:0xE5AE9B,0x3039:0xE5A790,0x303A:0xE899BB,
0x303B:0xE9A3B4,0x303C:0xE7B5A2,0x303D:0xE7B6BE,0x303E:0xE9AE8E,0x303F:0xE68896,
0x3040:0xE7B29F,0x3041:0xE8A2B7,0x3042:0xE5AE89,0x3043:0xE5BAB5,0x3044:0xE68C89,
0x3045:0xE69A97,0x3046:0xE6A188,0x3047:0xE99787,0x3048:0xE99E8D,0x3049:0xE69D8F,
0x304A:0xE4BBA5,0x304B:0xE4BC8A,0x304C:0xE4BD8D,0x304D:0xE4BE9D,0x304E:0xE58189,
0x304F:0xE59BB2,0x3050:0xE5A4B7,0x3051:0xE5A794,0x3052:0xE5A881,0x3053:0xE5B089,
0x3054:0xE6839F,0x3055:0xE6848F,0x3056:0xE685B0,0x3057:0xE69893,0x3058:0xE6A485,
0x3059:0xE782BA,0x305A:0xE7958F,0x305B:0xE795B0,0x305C:0xE7A7BB,0x305D:0xE7B6AD,
0x305E:0xE7B7AF,0x305F:0xE88383,0x3060:0xE8908E,0x3061:0xE8A1A3,0x3062:0xE8AC82,
0x3063:0xE98195,0x3064:0xE981BA,0x3065:0xE58CBB,0x3066:0xE4BA95,0x3067:0xE4BAA5,
0x3068:0xE59F9F,0x3069:0xE882B2,0x306A:0xE98381,0x306B:0xE7A3AF,0x306C:0xE4B880,
0x306D:0xE5A3B1,0x306E:0xE6BAA2,0x306F:0xE980B8,0x3070:0xE7A8B2,0x3071:0xE88CA8,
0x3072:0xE88A8B,0x3073:0xE9B0AF,0x3074:0xE58581,0x3075:0xE58DB0,0x3076:0xE592BD,
0x3077:0xE593A1,0x3078:0xE59BA0,0x3079:0xE5A7BB,0x307A:0xE5BC95,0x307B:0xE9A3B2,
0x307C:0xE6B7AB,0x307D:0xE883A4,0x307E:0xE894AD,0x3121:0xE999A2,0x3122:0xE999B0,
0x3123:0xE99AA0,0x3124:0xE99FBB,0x3125:0xE5908B,0x3126:0xE58FB3,0x3127:0xE5AE87,
0x3128:0xE7838F,0x3129:0xE7BEBD,0x312A:0xE8BF82,0x312B:0xE99BA8,0x312C:0xE58DAF,
0x312D:0xE9B59C,0x312E:0xE7AABA,0x312F:0xE4B891,0x3130:0xE7A293,0x3131:0xE887BC,
0x3132:0xE6B8A6,0x3133:0xE59898,0x3134:0xE59484,0x3135:0xE6AC9D,0x3136:0xE8949A,
0x3137:0xE9B0BB,0x3138:0xE5A7A5,0x3139:0xE58EA9,0x313A:0xE6B5A6,0x313B:0xE7939C,
0x313C:0xE9968F,0x313D:0xE59982,0x313E:0xE4BA91,0x313F:0xE9818B,0x3140:0xE99BB2,
0x3141:0xE88D8F,0x3142:0xE9A48C,0x3143:0xE58FA1,0x3144:0xE596B6,0x3145:0xE5ACB0,
0x3146:0xE5BDB1,0x3147:0xE698A0,0x3148:0xE69BB3,0x3149:0xE6A084,0x314A:0xE6B0B8,
0x314B:0xE6B3B3,0x314C:0xE6B4A9,0x314D:0xE7919B,0x314E:0xE79B88,0x314F:0xE7A98E,
0x3150:0xE9A0B4,0x3151:0xE88BB1,0x3152:0xE8A19B,0x3153:0xE8A9A0,0x3154:0xE98BAD,
0x3155:0xE6B6B2,0x3156:0xE796AB,0x3157:0xE79B8A,0x3158:0xE9A785,0x3159:0xE682A6,
0x315A:0xE8AC81,0x315B:0xE8B68A,0x315C:0xE996B2,0x315D:0xE6A68E,0x315E:0xE58EAD,
0x315F:0xE58686,0x3160:0xE59C92,0x3161:0xE5A0B0,0x3162:0xE5A584,0x3163:0xE5AEB4,
0x3164:0xE5BBB6,0x3165:0xE680A8,0x3166:0xE68EA9,0x3167:0xE68FB4,0x3168:0xE6B2BF,
0x3169:0xE6BC94,0x316A:0xE7828E,0x316B:0xE78494,0x316C:0xE78599,0x316D:0xE78795,
0x316E:0xE78CBF,0x316F:0xE7B881,0x3170:0xE889B6,0x3171:0xE88B91,0x3172:0xE89697,
0x3173:0xE981A0,0x3174:0xE9899B,0x3175:0xE9B49B,0x3176:0xE5A1A9,0x3177:0xE696BC,
0x3178:0xE6B19A,0x3179:0xE794A5,0x317A:0xE587B9,0x317B:0xE5A4AE,0x317C:0xE5A5A5,
0x317D:0xE5BE80,0x317E:0xE5BF9C,0x3221:0xE68ABC,0x3222:0xE697BA,0x3223:0xE6A8AA,
0x3224:0xE6ACA7,0x3225:0xE6AEB4,0x3226:0xE78E8B,0x3227:0xE7BF81,0x3228:0xE8A596,
0x3229:0xE9B4AC,0x322A:0xE9B48E,0x322B:0xE9BB84,0x322C:0xE5B2A1,0x322D:0xE6B296,
0x322E:0xE88DBB,0x322F:0xE58484,0x3230:0xE5B18B,0x3231:0xE686B6,0x3232:0xE88786,
0x3233:0xE6A1B6,0x3234:0xE789A1,0x3235:0xE4B999,0x3236:0xE4BFBA,0x3237:0xE58DB8,
0x3238:0xE681A9,0x3239:0xE6B8A9,0x323A:0xE7A98F,0x323B:0xE99FB3,0x323C:0xE4B88B,
0x323D:0xE58C96,0x323E:0xE4BBAE,0x323F:0xE4BD95,0x3240:0xE4BCBD,0x3241:0xE4BEA1,
0x3242:0xE4BDB3,0x3243:0xE58AA0,0x3244:0xE58FAF,0x3245:0xE59889,0x3246:0xE5A48F,
0x3247:0xE5AB81,0x3248:0xE5AEB6,0x3249:0xE5AFA1,0x324A:0xE7A791,0x324B:0xE69A87,
0x324C:0xE69E9C,0x324D:0xE69EB6,0x324E:0xE6AD8C,0x324F:0xE6B2B3,0x3250:0xE781AB,
0x3251:0xE78F82,0x3252:0xE7A68D,0x3253:0xE7A6BE,0x3254:0xE7A8BC,0x3255:0xE7AE87,
0x3256:0xE88AB1,0x3257:0xE88B9B,0x3258:0xE88C84,0x3259:0xE88DB7,0x325A:0xE88FAF,
0x325B:0xE88F93,0x325C:0xE89DA6,0x325D:0xE8AAB2,0x325E:0xE598A9,0x325F:0xE8B2A8,
0x3260:0xE8BFA6,0x3261:0xE9818E,0x3262:0xE99C9E,0x3263:0xE89A8A,0x3264:0xE4BF84,
0x3265:0xE5B3A8,0x3266:0xE68891,0x3267:0xE78999,0x3268:0xE794BB,0x3269:0xE887A5,
0x326A:0xE88ABD,0x326B:0xE89BBE,0x326C:0xE8B380,0x326D:0xE99B85,0x326E:0xE9A493,
0x326F:0xE9A795,0x3270:0xE4BB8B,0x3271:0xE4BC9A,0x3272:0xE8A7A3,0x3273:0xE59B9E,
0x3274:0xE5A18A,0x3275:0xE5A38A,0x3276:0xE5BBBB,0x3277:0xE5BFAB,0x3278:0xE680AA,
0x3279:0xE68294,0x327A:0xE681A2,0x327B:0xE68790,0x327C:0xE68892,0x327D:0xE68B90,
0x327E:0xE694B9,0x3321:0xE9AD81,0x3322:0xE699A6,0x3323:0xE6A2B0,0x3324:0xE6B5B7,
0x3325:0xE781B0,0x3326:0xE7958C,0x3327:0xE79A86,0x3328:0xE7B5B5,0x3329:0xE88AA5,
0x332A:0xE89FB9,0x332B:0xE9968B,0x332C:0xE99A8E,0x332D:0xE8B29D,0x332E:0xE587B1,
0x332F:0xE58ABE,0x3330:0xE5A496,0x3331:0xE592B3,0x3332:0xE5AEB3,0x3333:0xE5B496,
0x3334:0xE685A8,0x3335:0xE6A682,0x3336:0xE6B6AF,0x3337:0xE7A28D,0x3338:0xE8938B,
0x3339:0xE8A197,0x333A:0xE8A9B2,0x333B:0xE98EA7,0x333C:0xE9AAB8,0x333D:0xE6B5AC,
0x333E:0xE9A6A8,0x333F:0xE89B99,0x3340:0xE59EA3,0x3341:0xE69FBF,0x3342:0xE89B8E,
0x3343:0xE9888E,0x3344:0xE58A83,0x3345:0xE59A87,0x3346:0xE59084,0x3347:0xE5BB93,
0x3348:0xE68BA1,0x3349:0xE692B9,0x334A:0xE6A0BC,0x334B:0xE6A0B8,0x334C:0xE6AEBB,
0x334D:0xE78DB2,0x334E:0xE7A2BA,0x334F:0xE7A9AB,0x3350:0xE8A69A,0x3351:0xE8A792,
0x3352:0xE8B5AB,0x3353:0xE8BC83,0x3354:0xE983AD,0x3355:0xE996A3,0x3356:0xE99A94,
0x3357:0xE99DA9,0x3358:0xE5ADA6,0x3359:0xE5B2B3,0x335A:0xE6A5BD,0x335B:0xE9A18D,
0x335C:0xE9A18E,0x335D:0xE68E9B,0x335E:0xE7ACA0,0x335F:0xE6A8AB,0x3360:0xE6A9BF,
0x3361:0xE6A2B6,0x3362:0xE9B08D,0x3363:0xE6BD9F,0x3364:0xE589B2,0x3365:0xE5969D,
0x3366:0xE681B0,0x3367:0xE68BAC,0x3368:0xE6B4BB,0x3369:0xE6B887,0x336A:0xE6BB91,
0x336B:0xE8919B,0x336C:0xE8A490,0x336D:0xE8BD84,0x336E:0xE4B894,0x336F:0xE9B0B9,
0x3370:0xE58FB6,0x3371:0xE6A49B,0x3372:0xE6A8BA,0x3373:0xE99E84,0x3374:0xE6A0AA,
0x3375:0xE5859C,0x3376:0xE7AB83,0x3377:0xE892B2,0x3378:0xE9879C,0x3379:0xE98E8C,
0x337A:0xE5999B,0x337B:0xE9B4A8,0x337C:0xE6A0A2,0x337D:0xE88C85,0x337E:0xE890B1,
0x3421:0xE7B2A5,0x3422:0xE58888,0x3423:0xE88B85,0x3424:0xE793A6,0x3425:0xE4B9BE,
0x3426:0xE4BE83,0x3427:0xE586A0,0x3428:0xE5AF92,0x3429:0xE5888A,0x342A:0xE58B98,
0x342B:0xE58BA7,0x342C:0xE5B7BB,0x342D:0xE5969A,0x342E:0xE5A0AA,0x342F:0xE5A7A6,
0x3430:0xE5AE8C,0x3431:0xE5AE98,0x3432:0xE5AF9B,0x3433:0xE5B9B2,0x3434:0xE5B9B9,
0x3435:0xE682A3,0x3436:0xE6849F,0x3437:0xE685A3,0x3438:0xE686BE,0x3439:0xE68F9B,
0x343A:0xE695A2,0x343B:0xE69F91,0x343C:0xE6A193,0x343D:0xE6A3BA,0x343E:0xE6ACBE,
0x343F:0xE6AD93,0x3440:0xE6B197,0x3441:0xE6BCA2,0x3442:0xE6BE97,0x3443:0xE6BD85,
0x3444:0xE792B0,0x3445:0xE79498,0x3446:0xE79BA3,0x3447:0xE79C8B,0x3448:0xE7ABBF,
0x3449:0xE7AEA1,0x344A:0xE7B0A1,0x344B:0xE7B7A9,0x344C:0xE7BCB6,0x344D:0xE7BFB0,
0x344E:0xE8829D,0x344F:0xE889A6,0x3450:0xE88E9E,0x3451:0xE8A6B3,0x3452:0xE8AB8C,
0x3453:0xE8B2AB,0x3454:0xE98284,0x3455:0xE99191,0x3456:0xE99693,0x3457:0xE99691,
0x3458:0xE996A2,0x3459:0xE999A5,0x345A:0xE99F93,0x345B:0xE9A4A8,0x345C:0xE88898,
0x345D:0xE4B8B8,0x345E:0xE590AB,0x345F:0xE5B2B8,0x3460:0xE5B78C,0x3461:0xE78EA9,
0x3462:0xE7998C,0x3463:0xE79CBC,0x3464:0xE5B2A9,0x3465:0xE7BFAB,0x3466:0xE8B48B,
0x3467:0xE99B81,0x3468:0xE9A091,0x3469:0xE9A194,0x346A:0xE9A198,0x346B:0xE4BC81,
0x346C:0xE4BC8E,0x346D:0xE58DB1,0x346E:0xE5969C,0x346F:0xE599A8,0x3470:0xE59FBA,
0x3471:0xE5A587,0x3472:0xE5AC89,0x3473:0xE5AF84,0x3474:0xE5B290,0x3475:0xE5B88C,
0x3476:0xE5B9BE,0x3477:0xE5BF8C,0x3478:0xE68FAE,0x3479:0xE69CBA,0x347A:0xE69797,
0x347B:0xE697A2,0x347C:0xE69C9F,0x347D:0xE6A38B,0x347E:0xE6A384,0x3521:0xE6A99F,
0x3522:0xE5B8B0,0x3523:0xE6AF85,0x3524:0xE6B097,0x3525:0xE6B1BD,0x3526:0xE795BF,
0x3527:0xE7A588,0x3528:0xE5ADA3,0x3529:0xE7A880,0x352A:0xE7B480,0x352B:0xE5BEBD,
0x352C:0xE8A68F,0x352D:0xE8A898,0x352E:0xE8B2B4,0x352F:0xE8B5B7,0x3530:0xE8BB8C,
0x3531:0xE8BC9D,0x3532:0xE9A3A2,0x3533:0xE9A88E,0x3534:0xE9ACBC,0x3535:0xE4BA80,
0x3536:0xE581BD,0x3537:0xE58480,0x3538:0xE5A693,0x3539:0xE5AE9C,0x353A:0xE688AF,
0x353B:0xE68A80,0x353C:0xE693AC,0x353D:0xE6ACBA,0x353E:0xE78AA0,0x353F:0xE79691,
0x3540:0xE7A587,0x3541:0xE7BEA9,0x3542:0xE89FBB,0x3543:0xE8AABC,0x3544:0xE8ADB0,
0x3545:0xE68EAC,0x3546:0xE88F8A,0x3547:0xE99EA0,0x3548:0xE59089,0x3549:0xE59083,
0x354A:0xE596AB,0x354B:0xE6A194,0x354C:0xE6A998,0x354D:0xE8A9B0,0x354E:0xE7A0A7,
0x354F:0xE69DB5,0x3550:0xE9BB8D,0x3551:0xE58DB4,0x3552:0xE5AEA2,0x3553:0xE8849A,
0x3554:0xE89990,0x3555:0xE98086,0x3556:0xE4B898,0x3557:0xE4B985,0x3558:0xE4BB87,
0x3559:0xE4BC91,0x355A:0xE58F8A,0x355B:0xE590B8,0x355C:0xE5AEAE,0x355D:0xE5BC93,
0x355E:0xE680A5,0x355F:0xE69591,0x3560:0xE69CBD,0x3561:0xE6B182,0x3562:0xE6B1B2,
0x3563:0xE6B3A3,0x3564:0xE781B8,0x3565:0xE79083,0x3566:0xE7A9B6,0x3567:0xE7AAAE,
0x3568:0xE7AC88,0x3569:0xE7B49A,0x356A:0xE7B3BE,0x356B:0xE7B5A6,0x356C:0xE697A7,
0x356D:0xE7899B,0x356E:0xE58EBB,0x356F:0xE5B185,0x3570:0xE5B7A8,0x3571:0xE68B92,
0x3572:0xE68BA0,0x3573:0xE68C99,0x3574:0xE6B8A0,0x3575:0xE8999A,0x3576:0xE8A8B1,
0x3577:0xE8B79D,0x3578:0xE98BB8,0x3579:0xE6BC81,0x357A:0xE7A6A6,0x357B:0xE9AD9A,
0x357C:0xE4BAA8,0x357D:0xE4BAAB,0x357E:0xE4BAAC,0x3621:0xE4BE9B,0x3622:0xE4BEA0,
0x3623:0xE58391,0x3624:0xE58587,0x3625:0xE7ABB6,0x3626:0xE585B1,0x3627:0xE587B6,
0x3628:0xE58D94,0x3629:0xE58CA1,0x362A:0xE58DBF,0x362B:0xE58FAB,0x362C:0xE596AC,
0x362D:0xE5A283,0x362E:0xE5B3A1,0x362F:0xE5BCB7,0x3630:0xE5BD8A,0x3631:0xE680AF,
0x3632:0xE68190,0x3633:0xE681AD,0x3634:0xE68C9F,0x3635:0xE69599,0x3636:0xE6A98B,
0x3637:0xE6B381,0x3638:0xE78B82,0x3639:0xE78BAD,0x363A:0xE79FAF,0x363B:0xE883B8,
0x363C:0xE88485,0x363D:0xE88888,0x363E:0xE8958E,0x363F:0xE983B7,0x3640:0xE98FA1,
0x3641:0xE99FBF,0x3642:0xE9A597,0x3643:0xE9A99A,0x3644:0xE4BBB0,0x3645:0xE5879D,
0x3646:0xE5B0AD,0x3647:0xE69A81,0x3648:0xE6A5AD,0x3649:0xE5B180,0x364A:0xE69BB2,
0x364B:0xE6A5B5,0x364C:0xE78E89,0x364D:0xE6A190,0x364E:0xE7B281,0x364F:0xE58385,
0x3650:0xE58BA4,0x3651:0xE59D87,0x3652:0xE5B7BE,0x3653:0xE98CA6,0x3654:0xE696A4,
0x3655:0xE6ACA3,0x3656:0xE6ACBD,0x3657:0xE790B4,0x3658:0xE7A681,0x3659:0xE7A6BD,
0x365A:0xE7AD8B,0x365B:0xE7B78A,0x365C:0xE88AB9,0x365D:0xE88F8C,0x365E:0xE8A1BF,
0x365F:0xE8A59F,0x3660:0xE8ACB9,0x3661:0xE8BF91,0x3662:0xE98791,0x3663:0xE5909F,
0x3664:0xE98A80,0x3665:0xE4B99D,0x3666:0xE580B6,0x3667:0xE58FA5,0x3668:0xE58CBA,
0x3669:0xE78B97,0x366A:0xE78E96,0x366B:0xE79FA9,0x366C:0xE88BA6,0x366D:0xE8BAAF,
0x366E:0xE9A786,0x366F:0xE9A788,0x3670:0xE9A792,0x3671:0xE585B7,0x3672:0xE6849A,
0x3673:0xE8999E,0x3674:0xE596B0,0x3675:0xE7A9BA,0x3676:0xE581B6,0x3677:0xE5AF93,
0x3678:0xE98187,0x3679:0xE99A85,0x367A:0xE4B8B2,0x367B:0xE6AB9B,0x367C:0xE987A7,
0x367D:0xE5B191,0x367E:0xE5B188,0x3721:0xE68E98,0x3722:0xE7AA9F,0x3723:0xE6B293,
0x3724:0xE99DB4,0x3725:0xE8BDA1,0x3726:0xE7AAAA,0x3727:0xE7868A,0x3728:0xE99A88,
0x3729:0xE7B282,0x372A:0xE6A097,0x372B:0xE7B9B0,0x372C:0xE6A191,0x372D:0xE98DAC,
0x372E:0xE58BB2,0x372F:0xE5909B,0x3730:0xE896AB,0x3731:0xE8A893,0x3732:0xE7BEA4,
0x3733:0xE8BB8D,0x3734:0xE983A1,0x3735:0xE58DA6,0x3736:0xE8A288,0x3737:0xE7A581,
0x3738:0xE4BF82,0x3739:0xE582BE,0x373A:0xE58891,0x373B:0xE58584,0x373C:0xE59593,
0x373D:0xE59CAD,0x373E:0xE78FAA,0x373F:0xE59E8B,0x3740:0xE5A591,0x3741:0xE5BDA2,
0x3742:0xE5BE84,0x3743:0xE681B5,0x3744:0xE685B6,0x3745:0xE685A7,0x3746:0xE686A9,
0x3747:0xE68EB2,0x3748:0xE690BA,0x3749:0xE695AC,0x374A:0xE699AF,0x374B:0xE6A182,
0x374C:0xE6B893,0x374D:0xE795A6,0x374E:0xE7A8BD,0x374F:0xE7B3BB,0x3750:0xE7B58C,
0x3751:0xE7B699,0x3752:0xE7B98B,0x3753:0xE7BDAB,0x3754:0xE88C8E,0x3755:0xE88D8A,
0x3756:0xE89B8D,0x3757:0xE8A888,0x3758:0xE8A9A3,0x3759:0xE8ADA6,0x375A:0xE8BBBD,
0x375B:0xE9A09A,0x375C:0xE9B68F,0x375D:0xE88AB8,0x375E:0xE8BF8E,0x375F:0xE9AFA8,
0x3760:0xE58A87,0x3761:0xE6889F,0x3762:0xE69283,0x3763:0xE6BF80,0x3764:0xE99A99,
0x3765:0xE6A181,0x3766:0xE58291,0x3767:0xE6ACA0,0x3768:0xE6B1BA,0x3769:0xE6BD94,
0x376A:0xE7A9B4,0x376B:0xE7B590,0x376C:0xE8A180,0x376D:0xE8A8A3,0x376E:0xE69C88,
0x376F:0xE4BBB6,0x3770:0xE580B9,0x3771:0xE580A6,0x3772:0xE581A5,0x3773:0xE585BC,
0x3774:0xE588B8,0x3775:0xE589A3,0x3776:0xE596A7,0x3777:0xE59C8F,0x3778:0xE5A085,
0x3779:0xE5AB8C,0x377A:0xE5BBBA,0x377B:0xE686B2,0x377C:0xE687B8,0x377D:0xE68BB3,
0x377E:0xE68DB2,0x3821:0xE6A49C,0x3822:0xE6A8A9,0x3823:0xE789BD,0x3824:0xE78AAC,
0x3825:0xE78CAE,0x3826:0xE7A094,0x3827:0xE7A1AF,0x3828:0xE7B5B9,0x3829:0xE79C8C,
0x382A:0xE882A9,0x382B:0xE8A68B,0x382C:0xE8AC99,0x382D:0xE8B3A2,0x382E:0xE8BB92,
0x382F:0xE981A3,0x3830:0xE98DB5,0x3831:0xE999BA,0x3832:0xE9A195,0x3833:0xE9A893,
0x3834:0xE9B9B8,0x3835:0xE58583,0x3836:0xE58E9F,0x3837:0xE58EB3,0x3838:0xE5B9BB,
0x3839:0xE5BCA6,0x383A:0xE6B89B,0x383B:0xE6BA90,0x383C:0xE78E84,0x383D:0xE78FBE,
0x383E:0xE7B583,0x383F:0xE888B7,0x3840:0xE8A880,0x3841:0xE8ABBA,0x3842:0xE99990,
0x3843:0xE4B98E,0x3844:0xE5808B,0x3845:0xE58FA4,0x3846:0xE591BC,0x3847:0xE59BBA,
0x3848:0xE5A791,0x3849:0xE5ADA4,0x384A:0xE5B7B1,0x384B:0xE5BAAB,0x384C:0xE5BCA7,
0x384D:0xE688B8,0x384E:0xE69585,0x384F:0xE69EAF,0x3850:0xE6B996,0x3851:0xE78B90,
0x3852:0xE7B38A,0x3853:0xE8A2B4,0x3854:0xE882A1,0x3855:0xE883A1,0x3856:0xE88FB0,
0x3857:0xE8998E,0x3858:0xE8AA87,0x3859:0xE8B7A8,0x385A:0xE988B7,0x385B:0xE99B87,
0x385C:0xE9A1A7,0x385D:0xE9BC93,0x385E:0xE4BA94,0x385F:0xE4BA92,0x3860:0xE4BC8D,
0x3861:0xE58D88,0x3862:0xE59189,0x3863:0xE590BE,0x3864:0xE5A8AF,0x3865:0xE5BE8C,
0x3866:0xE5BEA1,0x3867:0xE6829F,0x3868:0xE6A2A7,0x3869:0xE6AA8E,0x386A:0xE7919A,
0x386B:0xE7A281,0x386C:0xE8AA9E,0x386D:0xE8AAA4,0x386E:0xE8ADB7,0x386F:0xE98690,
0x3870:0xE4B99E,0x3871:0xE9AF89,0x3872:0xE4BAA4,0x3873:0xE4BDBC,0x3874:0xE4BEAF,
0x3875:0xE58099,0x3876:0xE58096,0x3877:0xE58589,0x3878:0xE585AC,0x3879:0xE58A9F,
0x387A:0xE58AB9,0x387B:0xE58BBE,0x387C:0xE58E9A,0x387D:0xE58FA3,0x387E:0xE59091,
0x3921:0xE5908E,0x3922:0xE59689,0x3923:0xE59D91,0x3924:0xE59EA2,0x3925:0xE5A5BD,
0x3926:0xE5AD94,0x3927:0xE5AD9D,0x3928:0xE5AE8F,0x3929:0xE5B7A5,0x392A:0xE5B7A7,
0x392B:0xE5B7B7,0x392C:0xE5B9B8,0x392D:0xE5BA83,0x392E:0xE5BA9A,0x392F:0xE5BAB7,
0x3930:0xE5BC98,0x3931:0xE68192,0x3932:0xE6858C,0x3933:0xE68A97,0x3934:0xE68B98,
0x3935:0xE68EA7,0x3936:0xE694BB,0x3937:0xE69882,0x3938:0xE69983,0x3939:0xE69BB4,
0x393A:0xE69DAD,0x393B:0xE6A0A1,0x393C:0xE6A297,0x393D:0xE6A78B,0x393E:0xE6B19F,
0x393F:0xE6B4AA,0x3940:0xE6B5A9,0x3941:0xE6B8AF,0x3942:0xE6BA9D,0x3943:0xE794B2,
0x3944:0xE79A87,0x3945:0xE7A1AC,0x3946:0xE7A8BF,0x3947:0xE7B3A0,0x3948:0xE7B485,
0x3949:0xE7B498,0x394A:0xE7B59E,0x394B:0xE7B6B1,0x394C:0xE88095,0x394D:0xE88083,
0x394E:0xE882AF,0x394F:0xE882B1,0x3950:0xE88594,0x3951:0xE8868F,0x3952:0xE888AA,
0x3953:0xE88D92,0x3954:0xE8A18C,0x3955:0xE8A1A1,0x3956:0xE8AC9B,0x3957:0xE8B2A2,
0x3958:0xE8B3BC,0x3959:0xE9838A,0x395A:0xE985B5,0x395B:0xE989B1,0x395C:0xE7A0BF,
0x395D:0xE98BBC,0x395E:0xE996A4,0x395F:0xE9998D,0x3960:0xE9A085,0x3961:0xE9A699,
0x3962:0xE9AB98,0x3963:0xE9B4BB,0x3964:0xE5899B,0x3965:0xE58AAB,0x3966:0xE58FB7,
0x3967:0xE59088,0x3968:0xE5A395,0x3969:0xE68BB7,0x396A:0xE6BFA0,0x396B:0xE8B1AA,
0x396C:0xE8BD9F,0x396D:0xE9BAB9,0x396E:0xE5858B,0x396F:0xE588BB,0x3970:0xE5918A,
0x3971:0xE59BBD,0x3972:0xE7A980,0x3973:0xE985B7,0x3974:0xE9B5A0,0x3975:0xE9BB92,
0x3976:0xE78D84,0x3977:0xE6BC89,0x3978:0xE885B0,0x3979:0xE79491,0x397A:0xE5BFBD,
0x397B:0xE6839A,0x397C:0xE9AAA8,0x397D:0xE78B9B,0x397E:0xE8BEBC,0x3A21:0xE6ADA4,
0x3A22:0xE9A083,0x3A23:0xE4BB8A,0x3A24:0xE59BB0,0x3A25:0xE59DA4,0x3A26:0xE5A2BE,
0x3A27:0xE5A99A,0x3A28:0xE681A8,0x3A29:0xE68787,0x3A2A:0xE6988F,0x3A2B:0xE69886,
0x3A2C:0xE6A0B9,0x3A2D:0xE6A2B1,0x3A2E:0xE6B7B7,0x3A2F:0xE79795,0x3A30:0xE7B4BA,
0x3A31:0xE889AE,0x3A32:0xE9AD82,0x3A33:0xE4BA9B,0x3A34:0xE4BD90,0x3A35:0xE58F89,
0x3A36:0xE59486,0x3A37:0xE5B5AF,0x3A38:0xE5B7A6,0x3A39:0xE5B7AE,0x3A3A:0xE69FBB,
0x3A3B:0xE6B299,0x3A3C:0xE791B3,0x3A3D:0xE7A082,0x3A3E:0xE8A990,0x3A3F:0xE98E96,
0x3A40:0xE8A39F,0x3A41:0xE59D90,0x3A42:0xE5BAA7,0x3A43:0xE68CAB,0x3A44:0xE582B5,
0x3A45:0xE582AC,0x3A46:0xE5868D,0x3A47:0xE69C80,0x3A48:0xE59389,0x3A49:0xE5A19E,
0x3A4A:0xE5A6BB,0x3A4B:0xE5AEB0,0x3A4C:0xE5BDA9,0x3A4D:0xE6898D,0x3A4E:0xE68EA1,
0x3A4F:0xE6A0BD,0x3A50:0xE6ADB3,0x3A51:0xE6B888,0x3A52:0xE781BD,0x3A53:0xE98787,
0x3A54:0xE78A80,0x3A55:0xE7A095,0x3A56:0xE7A0A6,0x3A57:0xE7A5AD,0x3A58:0xE6968E,
0x3A59:0xE7B4B0,0x3A5A:0xE88F9C,0x3A5B:0xE8A381,0x3A5C:0xE8BC89,0x3A5D:0xE99A9B,
0x3A5E:0xE589A4,0x3A5F:0xE59CA8,0x3A60:0xE69D90,0x3A61:0xE7BDAA,0x3A62:0xE8B2A1,
0x3A63:0xE586B4,0x3A64:0xE59D82,0x3A65:0xE998AA,0x3A66:0xE5A0BA,0x3A67:0xE6A68A,
0x3A68:0xE882B4,0x3A69:0xE592B2,0x3A6A:0xE5B48E,0x3A6B:0xE59FBC,0x3A6C:0xE7A295,
0x3A6D:0xE9B7BA,0x3A6E:0xE4BD9C,0x3A6F:0xE5898A,0x3A70:0xE5928B,0x3A71:0xE690BE,
0x3A72:0xE698A8,0x3A73:0xE69C94,0x3A74:0xE69FB5,0x3A75:0xE7AA84,0x3A76:0xE7AD96,
0x3A77:0xE7B4A2,0x3A78:0xE98CAF,0x3A79:0xE6A19C,0x3A7A:0xE9AEAD,0x3A7B:0xE7ACB9,
0x3A7C:0xE58C99,0x3A7D:0xE5868A,0x3A7E:0xE588B7,0x3B21:0xE5AF9F,0x3B22:0xE68BB6,
0x3B23:0xE692AE,0x3B24:0xE693A6,0x3B25:0xE69CAD,0x3B26:0xE6AEBA,0x3B27:0xE896A9,
0x3B28:0xE99B91,0x3B29:0xE79A90,0x3B2A:0xE9AF96,0x3B2B:0xE68D8C,0x3B2C:0xE98C86,
0x3B2D:0xE9AEAB,0x3B2E:0xE79ABF,0x3B2F:0xE69992,0x3B30:0xE4B889,0x3B31:0xE58298,
0x3B32:0xE58F82,0x3B33:0xE5B1B1,0x3B34:0xE683A8,0x3B35:0xE69292,0x3B36:0xE695A3,
0x3B37:0xE6A19F,0x3B38:0xE787A6,0x3B39:0xE78F8A,0x3B3A:0xE794A3,0x3B3B:0xE7AE97,
0x3B3C:0xE7BA82,0x3B3D:0xE89A95,0x3B3E:0xE8AE83,0x3B3F:0xE8B39B,0x3B40:0xE985B8,
0x3B41:0xE9A490,0x3B42:0xE696AC,0x3B43:0xE69AAB,0x3B44:0xE6AE8B,0x3B45:0xE4BB95,
0x3B46:0xE4BB94,0x3B47:0xE4BCBA,0x3B48:0xE4BDBF,0x3B49:0xE588BA,0x3B4A:0xE58FB8,
0x3B4B:0xE58FB2,0x3B4C:0xE597A3,0x3B4D:0xE59B9B,0x3B4E:0xE5A3AB,0x3B4F:0xE5A78B,
0x3B50:0xE5A789,0x3B51:0xE5A7BF,0x3B52:0xE5AD90,0x3B53:0xE5B18D,0x3B54:0xE5B882,
0x3B55:0xE5B8AB,0x3B56:0xE5BF97,0x3B57:0xE6809D,0x3B58:0xE68C87,0x3B59:0xE694AF,
0x3B5A:0xE5AD9C,0x3B5B:0xE696AF,0x3B5C:0xE696BD,0x3B5D:0xE697A8,0x3B5E:0xE69E9D,
0x3B5F:0xE6ADA2,0x3B60:0xE6ADBB,0x3B61:0xE6B08F,0x3B62:0xE78D85,0x3B63:0xE7A589,
0x3B64:0xE7A781,0x3B65:0xE7B3B8,0x3B66:0xE7B499,0x3B67:0xE7B4AB,0x3B68:0xE882A2,
0x3B69:0xE88482,0x3B6A:0xE887B3,0x3B6B:0xE8A696,0x3B6C:0xE8A99E,0x3B6D:0xE8A9A9,
0x3B6E:0xE8A9A6,0x3B6F:0xE8AA8C,0x3B70:0xE8ABAE,0x3B71:0xE8B387,0x3B72:0xE8B39C,
0x3B73:0xE99B8C,0x3B74:0xE9A3BC,0x3B75:0xE6ADAF,0x3B76:0xE4BA8B,0x3B77:0xE4BCBC,
0x3B78:0xE4BE8D,0x3B79:0xE58590,0x3B7A:0xE5AD97,0x3B7B:0xE5AFBA,0x3B7C:0xE68588,
0x3B7D:0xE68C81,0x3B7E:0xE69982,0x3C21:0xE6ACA1,0x3C22:0xE6BB8B,0x3C23:0xE6B2BB,
0x3C24:0xE788BE,0x3C25:0xE792BD,0x3C26:0xE79794,0x3C27:0xE7A381,0x3C28:0xE7A4BA,
0x3C29:0xE8808C,0x3C2A:0xE880B3,0x3C2B:0xE887AA,0x3C2C:0xE89294,0x3C2D:0xE8BE9E,
0x3C2E:0xE6B190,0x3C2F:0xE9B9BF,0x3C30:0xE5BC8F,0x3C31:0xE8AD98,0x3C32:0xE9B4AB,
0x3C33:0xE7ABBA,0x3C34:0xE8BBB8,0x3C35:0xE5AE8D,0x3C36:0xE99BAB,0x3C37:0xE4B883,
0x3C38:0xE58FB1,0x3C39:0xE59FB7,0x3C3A:0xE5A4B1,0x3C3B:0xE5AB89,0x3C3C:0xE5AEA4,
0x3C3D:0xE68289,0x3C3E:0xE6B9BF,0x3C3F:0xE6BC86,0x3C40:0xE796BE,0x3C41:0xE8B3AA,
0x3C42:0xE5AE9F,0x3C43:0xE89480,0x3C44:0xE7AFA0,0x3C45:0xE581B2,0x3C46:0xE69FB4,
0x3C47:0xE88A9D,0x3C48:0xE5B1A1,0x3C49:0xE8958A,0x3C4A:0xE7B89E,0x3C4B:0xE8888E,
0x3C4C:0xE58699,0x3C4D:0xE5B084,0x3C4E:0xE68DA8,0x3C4F:0xE8B5A6,0x3C50:0xE6969C,
0x3C51:0xE785AE,0x3C52:0xE7A4BE,0x3C53:0xE7B497,0x3C54:0xE88085,0x3C55:0xE8AC9D,
0x3C56:0xE8BB8A,0x3C57:0xE981AE,0x3C58:0xE89B87,0x3C59:0xE982AA,0x3C5A:0xE5809F,
0x3C5B:0xE58BBA,0x3C5C:0xE5B0BA,0x3C5D:0xE69D93,0x3C5E:0xE781BC,0x3C5F:0xE788B5,
0x3C60:0xE9858C,0x3C61:0xE98788,0x3C62:0xE98CAB,0x3C63:0xE88BA5,0x3C64:0xE5AF82,
0x3C65:0xE5BCB1,0x3C66:0xE683B9,0x3C67:0xE4B8BB,0x3C68:0xE58F96,0x3C69:0xE5AE88,
0x3C6A:0xE6898B,0x3C6B:0xE69CB1,0x3C6C:0xE6AE8A,0x3C6D:0xE78BA9,0x3C6E:0xE78FA0,
0x3C6F:0xE7A8AE,0x3C70:0xE885AB,0x3C71:0xE8B6A3,0x3C72:0xE98592,0x3C73:0xE9A696,
0x3C74:0xE58492,0x3C75:0xE58F97,0x3C76:0xE591AA,0x3C77:0xE5AFBF,0x3C78:0xE68E88,
0x3C79:0xE6A8B9,0x3C7A:0xE7B6AC,0x3C7B:0xE99C80,0x3C7C:0xE59B9A,0x3C7D:0xE58F8E,
0x3C7E:0xE591A8,0x3D21:0xE5AE97,0x3D22:0xE5B0B1,0x3D23:0xE5B79E,0x3D24:0xE4BFAE,
0x3D25:0xE68481,0x3D26:0xE68BBE,0x3D27:0xE6B4B2,0x3D28:0xE7A780,0x3D29:0xE7A78B,
0x3D2A:0xE7B582,0x3D2B:0xE7B98D,0x3D2C:0xE7BF92,0x3D2D:0xE887AD,0x3D2E:0xE8889F,
0x3D2F:0xE89290,0x3D30:0xE8A186,0x3D31:0xE8A5B2,0x3D32:0xE8AE90,0x3D33:0xE8B9B4,
0x3D34:0xE8BCAF,0x3D35:0xE980B1,0x3D36:0xE9858B,0x3D37:0xE985AC,0x3D38:0xE99B86,
0x3D39:0xE9869C,0x3D3A:0xE4BB80,0x3D3B:0xE4BD8F,0x3D3C:0xE58585,0x3D3D:0xE58D81,
0x3D3E:0xE5BE93,0x3D3F:0xE6888E,0x3D40:0xE69F94,0x3D41:0xE6B181,0x3D42:0xE6B88B,
0x3D43:0xE78DA3,0x3D44:0xE7B8A6,0x3D45:0xE9878D,0x3D46:0xE98A83,0x3D47:0xE58F94,
0x3D48:0xE5A499,0x3D49:0xE5AEBF,0x3D4A:0xE6B791,0x3D4B:0xE7A59D,0x3D4C:0xE7B8AE,
0x3D4D:0xE7B29B,0x3D4E:0xE5A1BE,0x3D4F:0xE7869F,0x3D50:0xE587BA,0x3D51:0xE8A193,
0x3D52:0xE8BFB0,0x3D53:0xE4BF8A,0x3D54:0xE5B3BB,0x3D55:0xE698A5,0x3D56:0xE79EAC,
0x3D57:0xE7ABA3,0x3D58:0xE8889C,0x3D59:0xE9A7BF,0x3D5A:0xE58786,0x3D5B:0xE5BEAA,
0x3D5C:0xE697AC,0x3D5D:0xE6A5AF,0x3D5E:0xE6AE89,0x3D5F:0xE6B7B3,0x3D60:0xE6BA96,
0x3D61:0xE6BDA4,0x3D62:0xE79BBE,0x3D63:0xE7B494,0x3D64:0xE5B7A1,0x3D65:0xE981B5,
0x3D66:0xE98687,0x3D67:0xE9A086,0x3D68:0xE587A6,0x3D69:0xE5889D,0x3D6A:0xE68980,
0x3D6B:0xE69A91,0x3D6C:0xE69B99,0x3D6D:0xE6B89A,0x3D6E:0xE5BAB6,0x3D6F:0xE7B792,
0x3D70:0xE7BDB2,0x3D71:0xE69BB8,0x3D72:0xE896AF,0x3D73:0xE897B7,0x3D74:0xE8ABB8,
0x3D75:0xE58AA9,0x3D76:0xE58F99,0x3D77:0xE5A5B3,0x3D78:0xE5BA8F,0x3D79:0xE5BE90,
0x3D7A:0xE68195,0x3D7B:0xE98BA4,0x3D7C:0xE999A4,0x3D7D:0xE582B7,0x3D7E:0xE5849F,
0x3E21:0xE58B9D,0x3E22:0xE58CA0,0x3E23:0xE58D87,0x3E24:0xE58FAC,0x3E25:0xE593A8,
0x3E26:0xE59586,0x3E27:0xE594B1,0x3E28:0xE59897,0x3E29:0xE5A5A8,0x3E2A:0xE5A6BE,
0x3E2B:0xE5A8BC,0x3E2C:0xE5AEB5,0x3E2D:0xE5B086,0x3E2E:0xE5B08F,0x3E2F:0xE5B091,
0x3E30:0xE5B09A,0x3E31:0xE5BA84,0x3E32:0xE5BA8A,0x3E33:0xE5BBA0,0x3E34:0xE5BDB0,
0x3E35:0xE689BF,0x3E36:0xE68A84,0x3E37:0xE68B9B,0x3E38:0xE68E8C,0x3E39:0xE68DB7,
0x3E3A:0xE69887,0x3E3B:0xE6988C,0x3E3C:0xE698AD,0x3E3D:0xE699B6,0x3E3E:0xE69DBE,
0x3E3F:0xE6A2A2,0x3E40:0xE6A89F,0x3E41:0xE6A8B5,0x3E42:0xE6B2BC,0x3E43:0xE6B688,
0x3E44:0xE6B889,0x3E45:0xE6B998,0x3E46:0xE784BC,0x3E47:0xE784A6,0x3E48:0xE785A7,
0x3E49:0xE79787,0x3E4A:0xE79C81,0x3E4B:0xE7A19D,0x3E4C:0xE7A481,0x3E4D:0xE7A5A5,
0x3E4E:0xE7A7B0,0x3E4F:0xE7ABA0,0x3E50:0xE7AC91,0x3E51:0xE7B2A7,0x3E52:0xE7B4B9,
0x3E53:0xE88296,0x3E54:0xE88F96,0x3E55:0xE8928B,0x3E56:0xE89589,0x3E57:0xE8A19D,
0x3E58:0xE8A3B3,0x3E59:0xE8A89F,0x3E5A:0xE8A8BC,0x3E5B:0xE8A994,0x3E5C:0xE8A9B3,
0x3E5D:0xE8B1A1,0x3E5E:0xE8B39E,0x3E5F:0xE986A4,0x3E60:0xE989A6,0x3E61:0xE98DBE,
0x3E62:0xE99098,0x3E63:0xE99A9C,0x3E64:0xE99E98,0x3E65:0xE4B88A,0x3E66:0xE4B888,
0x3E67:0xE4B89E,0x3E68:0xE4B997,0x3E69:0xE58697,0x3E6A:0xE589B0,0x3E6B:0xE59F8E,
0x3E6C:0xE5A0B4,0x3E6D:0xE5A38C,0x3E6E:0xE5ACA2,0x3E6F:0xE5B8B8,0x3E70:0xE68385,
0x3E71:0xE693BE,0x3E72:0xE69DA1,0x3E73:0xE69D96,0x3E74:0xE6B584,0x3E75:0xE78AB6,
0x3E76:0xE795B3,0x3E77:0xE7A9A3,0x3E78:0xE892B8,0x3E79:0xE8ADB2,0x3E7A:0xE986B8,
0x3E7B:0xE98CA0,0x3E7C:0xE598B1,0x3E7D:0xE59FB4,0x3E7E:0xE9A3BE,0x3F21:0xE68BAD,
0x3F22:0xE6A48D,0x3F23:0xE6AE96,0x3F24:0xE787AD,0x3F25:0xE7B994,0x3F26:0xE881B7,
0x3F27:0xE889B2,0x3F28:0xE8A7A6,0x3F29:0xE9A39F,0x3F2A:0xE89D95,0x3F2B:0xE8BEB1,
0x3F2C:0xE5B0BB,0x3F2D:0xE4BCB8,0x3F2E:0xE4BFA1,0x3F2F:0xE4BEB5,0x3F30:0xE59487,
0x3F31:0xE5A8A0,0x3F32:0xE5AF9D,0x3F33:0xE5AFA9,0x3F34:0xE5BF83,0x3F35:0xE6858E,
0x3F36:0xE68CAF,0x3F37:0xE696B0,0x3F38:0xE6998B,0x3F39:0xE6A3AE,0x3F3A:0xE6A69B,
0x3F3B:0xE6B5B8,0x3F3C:0xE6B7B1,0x3F3D:0xE794B3,0x3F3E:0xE796B9,0x3F3F:0xE79C9F,
0x3F40:0xE7A59E,0x3F41:0xE7A7A6,0x3F42:0xE7B4B3,0x3F43:0xE887A3,0x3F44:0xE88AAF,
0x3F45:0xE896AA,0x3F46:0xE8A6AA,0x3F47:0xE8A8BA,0x3F48:0xE8BAAB,0x3F49:0xE8BE9B,
0x3F4A:0xE980B2,0x3F4B:0xE9879D,0x3F4C:0xE99C87,0x3F4D:0xE4BABA,0x3F4E:0xE4BB81,
0x3F4F:0xE58883,0x3F50:0xE5A1B5,0x3F51:0xE5A3AC,0x3F52:0xE5B08B,0x3F53:0xE7949A,
0x3F54:0xE5B0BD,0x3F55:0xE8858E,0x3F56:0xE8A88A,0x3F57:0xE8BF85,0x3F58:0xE999A3,
0x3F59:0xE99DAD,0x3F5A:0xE7ACA5,0x3F5B:0xE8AB8F,0x3F5C:0xE9A088,0x3F5D:0xE985A2,
0x3F5E:0xE59BB3,0x3F5F:0xE58EA8,0x3F60:0xE98097,0x3F61:0xE590B9,0x3F62:0xE59E82,
0x3F63:0xE5B8A5,0x3F64:0xE68EA8,0x3F65:0xE6B0B4,0x3F66:0xE7828A,0x3F67:0xE79DA1,
0x3F68:0xE7B28B,0x3F69:0xE7BFA0,0x3F6A:0xE8A1B0,0x3F6B:0xE98182,0x3F6C:0xE98594,
0x3F6D:0xE98C90,0x3F6E:0xE98C98,0x3F6F:0xE99A8F,0x3F70:0xE7919E,0x3F71:0xE9AB84,
0x3F72:0xE5B487,0x3F73:0xE5B5A9,0x3F74:0xE695B0,0x3F75:0xE69EA2,0x3F76:0xE8B6A8,
0x3F77:0xE99B9B,0x3F78:0xE68DAE,0x3F79:0xE69D89,0x3F7A:0xE6A499,0x3F7B:0xE88F85,
0x3F7C:0xE9A097,0x3F7D:0xE99B80,0x3F7E:0xE8A3BE,0x4021:0xE6BE84,0x4022:0xE691BA,
0x4023:0xE5AFB8,0x4024:0xE4B896,0x4025:0xE780AC,0x4026:0xE7959D,0x4027:0xE698AF,
0x4028:0xE58784,0x4029:0xE588B6,0x402A:0xE58BA2,0x402B:0xE5A793,0x402C:0xE5BE81,
0x402D:0xE680A7,0x402E:0xE68890,0x402F:0xE694BF,0x4030:0xE695B4,0x4031:0xE6989F,
0x4032:0xE699B4,0x4033:0xE6A3B2,0x4034:0xE6A096,0x4035:0xE6ADA3,0x4036:0xE6B885,
0x4037:0xE789B2,0x4038:0xE7949F,0x4039:0xE79B9B,0x403A:0xE7B2BE,0x403B:0xE88196,
0x403C:0xE5A3B0,0x403D:0xE8A3BD,0x403E:0xE8A5BF,0x403F:0xE8AAA0,0x4040:0xE8AA93,
0x4041:0xE8AB8B,0x4042:0xE9809D,0x4043:0xE98692,0x4044:0xE99D92,0x4045:0xE99D99,
0x4046:0xE69689,0x4047:0xE7A88E,0x4048:0xE88486,0x4049:0xE99ABB,0x404A:0xE5B8AD,
0x404B:0xE6839C,0x404C:0xE6889A,0x404D:0xE696A5,0x404E:0xE69894,0x404F:0xE69E90,
0x4050:0xE79FB3,0x4051:0xE7A98D,0x4052:0xE7B18D,0x4053:0xE7B8BE,0x4054:0xE8848A,
0x4055:0xE8B2AC,0x4056:0xE8B5A4,0x4057:0xE8B7A1,0x4058:0xE8B99F,0x4059:0xE7A2A9,
0x405A:0xE58887,0x405B:0xE68B99,0x405C:0xE68EA5,0x405D:0xE69182,0x405E:0xE68A98,
0x405F:0xE8A8AD,0x4060:0xE7AA83,0x4061:0xE7AF80,0x4062:0xE8AAAC,0x4063:0xE99BAA,
0x4064:0xE7B5B6,0x4065:0xE8888C,0x4066:0xE89D89,0x4067:0xE4BB99,0x4068:0xE58588,
0x4069:0xE58D83,0x406A:0xE58DA0,0x406B:0xE5AEA3,0x406C:0xE5B082,0x406D:0xE5B096,
0x406E:0xE5B79D,0x406F:0xE688A6,0x4070:0xE68987,0x4071:0xE692B0,0x4072:0xE6A093,
0x4073:0xE6A0B4,0x4074:0xE6B389,0x4075:0xE6B585,0x4076:0xE6B497,0x4077:0xE69F93,
0x4078:0xE6BD9C,0x4079:0xE7858E,0x407A:0xE785BD,0x407B:0xE6978B,0x407C:0xE7A9BF,
0x407D:0xE7AEAD,0x407E:0xE7B79A,0x4121:0xE7B98A,0x4122:0xE7BEA8,0x4123:0xE885BA,
0x4124:0xE8889B,0x4125:0xE888B9,0x4126:0xE896A6,0x4127:0xE8A9AE,0x4128:0xE8B38E,
0x4129:0xE8B7B5,0x412A:0xE981B8,0x412B:0xE981B7,0x412C:0xE98AAD,0x412D:0xE98A91,
0x412E:0xE99683,0x412F:0xE9AEAE,0x4130:0xE5898D,0x4131:0xE59684,0x4132:0xE6BCB8,
0x4133:0xE784B6,0x4134:0xE585A8,0x4135:0xE7A685,0x4136:0xE7B995,0x4137:0xE886B3,
0x4138:0xE7B38E,0x4139:0xE5998C,0x413A:0xE5A191,0x413B:0xE5B2A8,0x413C:0xE68EAA,
0x413D:0xE69BBE,0x413E:0xE69BBD,0x413F:0xE6A59A,0x4140:0xE78B99,0x4141:0xE7968F,
0x4142:0xE7968E,0x4143:0xE7A48E,0x4144:0xE7A596,0x4145:0xE7A79F,0x4146:0xE7B297,
0x4147:0xE7B4A0,0x4148:0xE7B584,0x4149:0xE89887,0x414A:0xE8A8B4,0x414B:0xE998BB,
0x414C:0xE981A1,0x414D:0xE9BCA0,0x414E:0xE583A7,0x414F:0xE589B5,0x4150:0xE58F8C,
0x4151:0xE58FA2,0x4152:0xE58089,0x4153:0xE596AA,0x4154:0xE5A3AE,0x4155:0xE5A58F,
0x4156:0xE788BD,0x4157:0xE5AE8B,0x4158:0xE5B1A4,0x4159:0xE58C9D,0x415A:0xE683A3,
0x415B:0xE683B3,0x415C:0xE68D9C,0x415D:0xE68E83,0x415E:0xE68CBF,0x415F:0xE68EBB,
0x4160:0xE6938D,0x4161:0xE697A9,0x4162:0xE69BB9,0x4163:0xE5B7A3,0x4164:0xE6A78D,
0x4165:0xE6A7BD,0x4166:0xE6BC95,0x4167:0xE787A5,0x4168:0xE4BA89,0x4169:0xE797A9,
0x416A:0xE79BB8,0x416B:0xE7AA93,0x416C:0xE7B39F,0x416D:0xE7B78F,0x416E:0xE7B69C,
0x416F:0xE881A1,0x4170:0xE88D89,0x4171:0xE88D98,0x4172:0xE891AC,0x4173:0xE892BC,
0x4174:0xE897BB,0x4175:0xE8A385,0x4176:0xE8B5B0,0x4177:0xE98081,0x4178:0xE981AD,
0x4179:0xE98E97,0x417A:0xE99C9C,0x417B:0xE9A892,0x417C:0xE5838F,0x417D:0xE5A297,
0x417E:0xE6868E,0x4221:0xE88793,0x4222:0xE894B5,0x4223:0xE8B488,0x4224:0xE980A0,
0x4225:0xE4BF83,0x4226:0xE581B4,0x4227:0xE58987,0x4228:0xE58DB3,0x4229:0xE681AF,
0x422A:0xE68D89,0x422B:0xE69D9F,0x422C:0xE6B8AC,0x422D:0xE8B6B3,0x422E:0xE9809F,
0x422F:0xE4BF97,0x4230:0xE5B19E,0x4231:0xE8B38A,0x4232:0xE6978F,0x4233:0xE7B69A,
0x4234:0xE58D92,0x4235:0xE8A296,0x4236:0xE585B6,0x4237:0xE68F83,0x4238:0xE5AD98,
0x4239:0xE5ADAB,0x423A:0xE5B08A,0x423B:0xE6908D,0x423C:0xE69D91,0x423D:0xE9819C,
0x423E:0xE4BB96,0x423F:0xE5A49A,0x4240:0xE5A4AA,0x4241:0xE6B1B0,0x4242:0xE8A991,
0x4243:0xE594BE,0x4244:0xE5A095,0x4245:0xE5A6A5,0x4246:0xE683B0,0x4247:0xE68993,
0x4248:0xE69F81,0x4249:0xE888B5,0x424A:0xE6A595,0x424B:0xE99980,0x424C:0xE9A784,
0x424D:0xE9A8A8,0x424E:0xE4BD93,0x424F:0xE5A086,0x4250:0xE5AFBE,0x4251:0xE88090,
0x4252:0xE5B2B1,0x4253:0xE5B8AF,0x4254:0xE5BE85,0x4255:0xE680A0,0x4256:0xE6858B,
0x4257:0xE688B4,0x4258:0xE69BBF,0x4259:0xE6B3B0,0x425A:0xE6BB9E,0x425B:0xE8838E,
0x425C:0xE885BF,0x425D:0xE88B94,0x425E:0xE8A28B,0x425F:0xE8B2B8,0x4260:0xE98080,
0x4261:0xE980AE,0x4262:0xE99A8A,0x4263:0xE9BB9B,0x4264:0xE9AF9B,0x4265:0xE4BBA3,
0x4266:0xE58FB0,0x4267:0xE5A4A7,0x4268:0xE7ACAC,0x4269:0xE9868D,0x426A:0xE9A18C,
0x426B:0xE9B7B9,0x426C:0xE6BB9D,0x426D:0xE780A7,0x426E:0xE58D93,0x426F:0xE59584,
0x4270:0xE5AE85,0x4271:0xE68998,0x4272:0xE68A9E,0x4273:0xE68B93,0x4274:0xE6B2A2,
0x4275:0xE6BFAF,0x4276:0xE790A2,0x4277:0xE8A897,0x4278:0xE990B8,0x4279:0xE6BF81,
0x427A:0xE8ABBE,0x427B:0xE88CB8,0x427C:0xE587A7,0x427D:0xE89BB8,0x427E:0xE58FAA,
0x4321:0xE58FA9,0x4322:0xE4BD86,0x4323:0xE98194,0x4324:0xE8BEB0,0x4325:0xE5A5AA,
0x4326:0xE884B1,0x4327:0xE5B7BD,0x4328:0xE7ABAA,0x4329:0xE8BEBF,0x432A:0xE6A39A,
0x432B:0xE8B0B7,0x432C:0xE78BB8,0x432D:0xE9B188,0x432E:0xE6A8BD,0x432F:0xE8AAB0,
0x4330:0xE4B8B9,0x4331:0xE58D98,0x4332:0xE59886,0x4333:0xE59DA6,0x4334:0xE68B85,
0x4335:0xE68EA2,0x4336:0xE697A6,0x4337:0xE6AD8E,0x4338:0xE6B7A1,0x4339:0xE6B99B,
0x433A:0xE782AD,0x433B:0xE79FAD,0x433C:0xE7ABAF,0x433D:0xE7AEAA,0x433E:0xE7B6BB,
0x433F:0xE880BD,0x4340:0xE88386,0x4341:0xE89B8B,0x4342:0xE8AA95,0x4343:0xE98D9B,
0x4344:0xE59BA3,0x4345:0xE5A387,0x4346:0xE5BCBE,0x4347:0xE696AD,0x4348:0xE69A96,
0x4349:0xE6AA80,0x434A:0xE6AEB5,0x434B:0xE794B7,0x434C:0xE8AB87,0x434D:0xE580A4,
0x434E:0xE79FA5,0x434F:0xE59CB0,0x4350:0xE5BC9B,0x4351:0xE681A5,0x4352:0xE699BA,
0x4353:0xE6B1A0,0x4354:0xE797B4,0x4355:0xE7A89A,0x4356:0xE7BDAE,0x4357:0xE887B4,
0x4358:0xE89C98,0x4359:0xE98185,0x435A:0xE9A6B3,0x435B:0xE7AF89,0x435C:0xE7959C,
0x435D:0xE7ABB9,0x435E:0xE7AD91,0x435F:0xE89384,0x4360:0xE98090,0x4361:0xE7A7A9,
0x4362:0xE7AA92,0x4363:0xE88CB6,0x4364:0xE5ABA1,0x4365:0xE79D80,0x4366:0xE4B8AD,
0x4367:0xE4BBB2,0x4368:0xE5AE99,0x4369:0xE5BFA0,0x436A:0xE68ABD,0x436B:0xE698BC,
0x436C:0xE69FB1,0x436D:0xE6B3A8,0x436E:0xE899AB,0x436F:0xE8A1B7,0x4370:0xE8A8BB,
0x4371:0xE9858E,0x4372:0xE98BB3,0x4373:0xE9A790,0x4374:0xE6A897,0x4375:0xE780A6,
0x4376:0xE78CAA,0x4377:0xE88BA7,0x4378:0xE89197,0x4379:0xE8B2AF,0x437A:0xE4B881,
0x437B:0xE58586,0x437C:0xE5878B,0x437D:0xE5968B,0x437E:0xE5AFB5,0x4421:0xE5B896,
0x4422:0xE5B8B3,0x4423:0xE5BA81,0x4424:0xE5BC94,0x4425:0xE5BCB5,0x4426:0xE5BDAB,
0x4427:0xE5BEB4,0x4428:0xE687B2,0x4429:0xE68C91,0x442A:0xE69AA2,0x442B:0xE69C9D,
0x442C:0xE6BDAE,0x442D:0xE78992,0x442E:0xE794BA,0x442F:0xE79CBA,0x4430:0xE881B4,
0x4431:0xE884B9,0x4432:0xE885B8,0x4433:0xE89DB6,0x4434:0xE8AABF,0x4435:0xE8AB9C,
0x4436:0xE8B685,0x4437:0xE8B7B3,0x4438:0xE98A9A,0x4439:0xE995B7,0x443A:0xE9A082,
0x443B:0xE9B3A5,0x443C:0xE58B85,0x443D:0xE68D97,0x443E:0xE79BB4,0x443F:0xE69C95,
0x4440:0xE6B288,0x4441:0xE78F8D,0x4442:0xE8B383,0x4443:0xE98EAE,0x4444:0xE999B3,
0x4445:0xE6B4A5,0x4446:0xE5A29C,0x4447:0xE6A48E,0x4448:0xE6A78C,0x4449:0xE8BFBD,
0x444A:0xE98E9A,0x444B:0xE7979B,0x444C:0xE9809A,0x444D:0xE5A19A,0x444E:0xE6A082,
0x444F:0xE68EB4,0x4450:0xE6A7BB,0x4451:0xE4BD83,0x4452:0xE6BCAC,0x4453:0xE69F98,
0x4454:0xE8BEBB,0x4455:0xE894A6,0x4456:0xE7B6B4,0x4457:0xE98D94,0x4458:0xE6A4BF,
0x4459:0xE6BDB0,0x445A:0xE59DAA,0x445B:0xE5A3B7,0x445C:0xE5ACAC,0x445D:0xE7B4AC,
0x445E:0xE788AA,0x445F:0xE5908A,0x4460:0xE987A3,0x4461:0xE9B6B4,0x4462:0xE4BAAD,
0x4463:0xE4BD8E,0x4464:0xE5819C,0x4465:0xE581B5,0x4466:0xE58983,0x4467:0xE8B29E,
0x4468:0xE59188,0x4469:0xE5A0A4,0x446A:0xE5AE9A,0x446B:0xE5B89D,0x446C:0xE5BA95,
0x446D:0xE5BAAD,0x446E:0xE5BBB7,0x446F:0xE5BC9F,0x4470:0xE6828C,0x4471:0xE68AB5,
0x4472:0xE68CBA,0x4473:0xE68F90,0x4474:0xE6A2AF,0x4475:0xE6B180,0x4476:0xE7A287,
0x4477:0xE7A68E,0x4478:0xE7A88B,0x4479:0xE7B7A0,0x447A:0xE88987,0x447B:0xE8A882,
0x447C:0xE8ABA6,0x447D:0xE8B984,0x447E:0xE98093,0x4521:0xE982B8,0x4522:0xE984AD,
0x4523:0xE98798,0x4524:0xE9BC8E,0x4525:0xE6B3A5,0x4526:0xE69198,0x4527:0xE693A2,
0x4528:0xE695B5,0x4529:0xE6BBB4,0x452A:0xE79A84,0x452B:0xE7AC9B,0x452C:0xE981A9,
0x452D:0xE98F91,0x452E:0xE6BABA,0x452F:0xE593B2,0x4530:0xE5BEB9,0x4531:0xE692A4,
0x4532:0xE8BD8D,0x4533:0xE8BFAD,0x4534:0xE98984,0x4535:0xE585B8,0x4536:0xE5A1AB,
0x4537:0xE5A4A9,0x4538:0xE5B195,0x4539:0xE5BA97,0x453A:0xE6B7BB,0x453B:0xE7BA8F,
0x453C:0xE7949C,0x453D:0xE8B2BC,0x453E:0xE8BBA2,0x453F:0xE9A19B,0x4540:0xE782B9,
0x4541:0xE4BC9D,0x4542:0xE6AEBF,0x4543:0xE6BEB1,0x4544:0xE794B0,0x4545:0xE99BBB,
0x4546:0xE5858E,0x4547:0xE59090,0x4548:0xE5A0B5,0x4549:0xE5A197,0x454A:0xE5A6AC,
0x454B:0xE5B1A0,0x454C:0xE5BE92,0x454D:0xE69697,0x454E:0xE69D9C,0x454F:0xE6B8A1,
0x4550:0xE799BB,0x4551:0xE88F9F,0x4552:0xE8B3AD,0x4553:0xE98094,0x4554:0xE983BD,
0x4555:0xE98D8D,0x4556:0xE7A0A5,0x4557:0xE7A0BA,0x4558:0xE58AAA,0x4559:0xE5BAA6,
0x455A:0xE59C9F,0x455B:0xE5A5B4,0x455C:0xE68092,0x455D:0xE58092,0x455E:0xE5859A,
0x455F:0xE586AC,0x4560:0xE5878D,0x4561:0xE58880,0x4562:0xE59490,0x4563:0xE5A194,
0x4564:0xE5A198,0x4565:0xE5A597,0x4566:0xE5AE95,0x4567:0xE5B3B6,0x4568:0xE5B68B,
0x4569:0xE682BC,0x456A:0xE68A95,0x456B:0xE690AD,0x456C:0xE69DB1,0x456D:0xE6A183,
0x456E:0xE6A2BC,0x456F:0xE6A39F,0x4570:0xE79B97,0x4571:0xE6B798,0x4572:0xE6B9AF,
0x4573:0xE6B69B,0x4574:0xE781AF,0x4575:0xE78788,0x4576:0xE5BD93,0x4577:0xE79798,
0x4578:0xE7A5B7,0x4579:0xE7AD89,0x457A:0xE7AD94,0x457B:0xE7AD92,0x457C:0xE7B396,
0x457D:0xE7B5B1,0x457E:0xE588B0,0x4621:0xE891A3,0x4622:0xE895A9,0x4623:0xE897A4,
0x4624:0xE8A88E,0x4625:0xE8AC84,0x4626:0xE8B186,0x4627:0xE8B88F,0x4628:0xE98083,
0x4629:0xE9808F,0x462A:0xE99099,0x462B:0xE999B6,0x462C:0xE9A0AD,0x462D:0xE9A8B0,
0x462E:0xE99798,0x462F:0xE5838D,0x4630:0xE58B95,0x4631:0xE5908C,0x4632:0xE5A082,
0x4633:0xE5B08E,0x4634:0xE686A7,0x4635:0xE6929E,0x4636:0xE6B49E,0x4637:0xE79EB3,
0x4638:0xE7ABA5,0x4639:0xE883B4,0x463A:0xE89084,0x463B:0xE98193,0x463C:0xE98A85,
0x463D:0xE5B3A0,0x463E:0xE9B487,0x463F:0xE58CBF,0x4640:0xE5BE97,0x4641:0xE5BEB3,
0x4642:0xE6B69C,0x4643:0xE789B9,0x4644:0xE79DA3,0x4645:0xE7A6BF,0x4646:0xE7AFA4,
0x4647:0xE6AF92,0x4648:0xE78BAC,0x4649:0xE8AAAD,0x464A:0xE6A083,0x464B:0xE6A9A1,
0x464C:0xE587B8,0x464D:0xE7AA81,0x464E:0xE6A4B4,0x464F:0xE5B18A,0x4650:0xE9B3B6,
0x4651:0xE88BAB,0x4652:0xE5AF85,0x4653:0xE98589,0x4654:0xE7809E,0x4655:0xE599B8,
0x4656:0xE5B1AF,0x4657:0xE68387,0x4658:0xE695A6,0x4659:0xE6B28C,0x465A:0xE8B19A,
0x465B:0xE98181,0x465C:0xE9A093,0x465D:0xE59191,0x465E:0xE69B87,0x465F:0xE9888D,
0x4660:0xE5A588,0x4661:0xE982A3,0x4662:0xE58685,0x4663:0xE4B98D,0x4664:0xE587AA,
0x4665:0xE89699,0x4666:0xE8AC8E,0x4667:0xE78198,0x4668:0xE68DBA,0x4669:0xE98D8B,
0x466A:0xE6A5A2,0x466B:0xE9A6B4,0x466C:0xE7B884,0x466D:0xE795B7,0x466E:0xE58D97,
0x466F:0xE6A5A0,0x4670:0xE8BB9F,0x4671:0xE99BA3,0x4672:0xE6B19D,0x4673:0xE4BA8C,
0x4674:0xE5B0BC,0x4675:0xE5BC90,0x4676:0xE8BFA9,0x4677:0xE58C82,0x4678:0xE8B391,
0x4679:0xE88289,0x467A:0xE899B9,0x467B:0xE5BBBF,0x467C:0xE697A5,0x467D:0xE4B9B3,
0x467E:0xE585A5,0x4721:0xE5A682,0x4722:0xE5B0BF,0x4723:0xE99FAE,0x4724:0xE4BBBB,
0x4725:0xE5A68A,0x4726:0xE5BF8D,0x4727:0xE8AA8D,0x4728:0xE6BFA1,0x4729:0xE7A6B0,
0x472A:0xE7A5A2,0x472B:0xE5AFA7,0x472C:0xE891B1,0x472D:0xE78CAB,0x472E:0xE786B1,
0x472F:0xE5B9B4,0x4730:0xE5BFB5,0x4731:0xE68DBB,0x4732:0xE6929A,0x4733:0xE78783,
0x4734:0xE7B298,0x4735:0xE4B983,0x4736:0xE5BBBC,0x4737:0xE4B98B,0x4738:0xE59F9C,
0x4739:0xE59AA2,0x473A:0xE682A9,0x473B:0xE6BF83,0x473C:0xE7B48D,0x473D:0xE883BD,
0x473E:0xE884B3,0x473F:0xE886BF,0x4740:0xE8BEB2,0x4741:0xE8A697,0x4742:0xE89AA4,
0x4743:0xE5B7B4,0x4744:0xE68A8A,0x4745:0xE692AD,0x4746:0xE8A687,0x4747:0xE69DB7,
0x4748:0xE6B3A2,0x4749:0xE6B4BE,0x474A:0xE790B6,0x474B:0xE7A0B4,0x474C:0xE5A986,
0x474D:0xE7BDB5,0x474E:0xE88AAD,0x474F:0xE9A6AC,0x4750:0xE4BFB3,0x4751:0xE5BB83,
0x4752:0xE68B9D,0x4753:0xE68E92,0x4754:0xE69597,0x4755:0xE69DAF,0x4756:0xE79B83,
0x4757:0xE7898C,0x4758:0xE8838C,0x4759:0xE882BA,0x475A:0xE8BCA9,0x475B:0xE9858D,
0x475C:0xE5808D,0x475D:0xE59FB9,0x475E:0xE5AA92,0x475F:0xE6A285,0x4760:0xE6A5B3,
0x4761:0xE785A4,0x4762:0xE78BBD,0x4763:0xE8B2B7,0x4764:0xE5A3B2,0x4765:0xE8B3A0,
0x4766:0xE999AA,0x4767:0xE98099,0x4768:0xE89DBF,0x4769:0xE7A7A4,0x476A:0xE79FA7,
0x476B:0xE890A9,0x476C:0xE4BCAF,0x476D:0xE589A5,0x476E:0xE58D9A,0x476F:0xE68B8D,
0x4770:0xE69F8F,0x4771:0xE6B38A,0x4772:0xE799BD,0x4773:0xE7AE94,0x4774:0xE7B295,
0x4775:0xE888B6,0x4776:0xE89684,0x4777:0xE8BFAB,0x4778:0xE69B9D,0x4779:0xE6BCA0,
0x477A:0xE78886,0x477B:0xE7B89B,0x477C:0xE88EAB,0x477D:0xE9A781,0x477E:0xE9BAA6,
0x4821:0xE587BD,0x4822:0xE7AEB1,0x4823:0xE7A1B2,0x4824:0xE7AEB8,0x4825:0xE88287,
0x4826:0xE7AD88,0x4827:0xE6ABA8,0x4828:0xE5B9A1,0x4829:0xE8828C,0x482A:0xE79591,
0x482B:0xE795A0,0x482C:0xE585AB,0x482D:0xE989A2,0x482E:0xE6BA8C,0x482F:0xE799BA,
0x4830:0xE98697,0x4831:0xE9ABAA,0x4832:0xE4BC90,0x4833:0xE7BDB0,0x4834:0xE68A9C,
0x4835:0xE7AD8F,0x4836:0xE996A5,0x4837:0xE9B3A9,0x4838:0xE599BA,0x4839:0xE5A199,
0x483A:0xE89BA4,0x483B:0xE99ABC,0x483C:0xE4BCB4,0x483D:0xE588A4,0x483E:0xE58D8A,
0x483F:0xE58F8D,0x4840:0xE58F9B,0x4841:0xE5B886,0x4842:0xE690AC,0x4843:0xE69691,
0x4844:0xE69DBF,0x4845:0xE6B0BE,0x4846:0xE6B18E,0x4847:0xE78988,0x4848:0xE78AAF,
0x4849:0xE78FAD,0x484A:0xE79594,0x484B:0xE7B981,0x484C:0xE888AC,0x484D:0xE897A9,
0x484E:0xE8B2A9,0x484F:0xE7AF84,0x4850:0xE98786,0x4851:0xE785A9,0x4852:0xE9A092,
0x4853:0xE9A3AF,0x4854:0xE68CBD,0x4855:0xE699A9,0x4856:0xE795AA,0x4857:0xE79BA4,
0x4858:0xE7A390,0x4859:0xE89583,0x485A:0xE89BAE,0x485B:0xE58CAA,0x485C:0xE58D91,
0x485D:0xE590A6,0x485E:0xE5A683,0x485F:0xE5BA87,0x4860:0xE5BDBC,0x4861:0xE682B2,
0x4862:0xE68989,0x4863:0xE689B9,0x4864:0xE68AAB,0x4865:0xE69690,0x4866:0xE6AF94,
0x4867:0xE6B38C,0x4868:0xE796B2,0x4869:0xE79AAE,0x486A:0xE7A291,0x486B:0xE7A798,
0x486C:0xE7B78B,0x486D:0xE7BDB7,0x486E:0xE882A5,0x486F:0xE8A2AB,0x4870:0xE8AAB9,
0x4871:0xE8B2BB,0x4872:0xE981BF,0x4873:0xE99D9E,0x4874:0xE9A39B,0x4875:0xE6A88B,
0x4876:0xE7B0B8,0x4877:0xE58299,0x4878:0xE5B0BE,0x4879:0xE5BEAE,0x487A:0xE69E87,
0x487B:0xE6AF98,0x487C:0xE790B5,0x487D:0xE79C89,0x487E:0xE7BE8E,0x4921:0xE9BCBB,
0x4922:0xE69F8A,0x4923:0xE7A897,0x4924:0xE58CB9,0x4925:0xE7968B,0x4926:0xE9ABAD,
0x4927:0xE5BDA6,0x4928:0xE8869D,0x4929:0xE88FB1,0x492A:0xE88298,0x492B:0xE5BCBC,
0x492C:0xE5BF85,0x492D:0xE795A2,0x492E:0xE7AD86,0x492F:0xE980BC,0x4930:0xE6A1A7,
0x4931:0xE5A7AB,0x4932:0xE5AA9B,0x4933:0xE7B490,0x4934:0xE799BE,0x4935:0xE8ACAC,
0x4936:0xE4BFB5,0x4937:0xE5BDAA,0x4938:0xE6A899,0x4939:0xE6B0B7,0x493A:0xE6BC82,
0x493B:0xE793A2,0x493C:0xE7A5A8,0x493D:0xE8A1A8,0x493E:0xE8A995,0x493F:0xE8B1B9,
0x4940:0xE5BB9F,0x4941:0xE68F8F,0x4942:0xE79785,0x4943:0xE7A792,0x4944:0xE88B97,
0x4945:0xE98CA8,0x4946:0xE98BB2,0x4947:0xE8929C,0x4948:0xE89BAD,0x4949:0xE9B0AD,
0x494A:0xE59381,0x494B:0xE5BDAC,0x494C:0xE6968C,0x494D:0xE6B59C,0x494E:0xE78095,
0x494F:0xE8B2A7,0x4950:0xE8B393,0x4951:0xE9A0BB,0x4952:0xE6958F,0x4953:0xE793B6,
0x4954:0xE4B88D,0x4955:0xE4BB98,0x4956:0xE59FA0,0x4957:0xE5A4AB,0x4958:0xE5A9A6,
0x4959:0xE5AF8C,0x495A:0xE586A8,0x495B:0xE5B883,0x495C:0xE5BA9C,0x495D:0xE68096,
0x495E:0xE689B6,0x495F:0xE695B7,0x4960:0xE696A7,0x4961:0xE699AE,0x4962:0xE6B5AE,
0x4963:0xE788B6,0x4964:0xE7ACA6,0x4965:0xE88590,0x4966:0xE8869A,0x4967:0xE88A99,
0x4968:0xE8AD9C,0x4969:0xE8B2A0,0x496A:0xE8B3A6,0x496B:0xE8B5B4,0x496C:0xE9989C,
0x496D:0xE99984,0x496E:0xE4BEAE,0x496F:0xE692AB,0x4970:0xE6ADA6,0x4971:0xE8889E,
0x4972:0xE891A1,0x4973:0xE895AA,0x4974:0xE983A8,0x4975:0xE5B081,0x4976:0xE6A593,
0x4977:0xE9A2A8,0x4978:0xE891BA,0x4979:0xE89597,0x497A:0xE4BC8F,0x497B:0xE589AF,
0x497C:0xE5BEA9,0x497D:0xE5B985,0x497E:0xE69C8D,0x4A21:0xE7A68F,0x4A22:0xE885B9,
0x4A23:0xE8A487,0x4A24:0xE8A686,0x4A25:0xE6B7B5,0x4A26:0xE5BC97,0x4A27:0xE68995,
0x4A28:0xE6B2B8,0x4A29:0xE4BB8F,0x4A2A:0xE789A9,0x4A2B:0xE9AE92,0x4A2C:0xE58886,
0x4A2D:0xE590BB,0x4A2E:0xE599B4,0x4A2F:0xE5A2B3,0x4A30:0xE686A4,0x4A31:0xE689AE,
0x4A32:0xE7849A,0x4A33:0xE5A5AE,0x4A34:0xE7B289,0x4A35:0xE7B39E,0x4A36:0xE7B49B,
0x4A37:0xE99BB0,0x4A38:0xE69687,0x4A39:0xE8819E,0x4A3A:0xE4B899,0x4A3B:0xE4BDB5,
0x4A3C:0xE585B5,0x4A3D:0xE5A180,0x4A3E:0xE5B9A3,0x4A3F:0xE5B9B3,0x4A40:0xE5BC8A,
0x4A41:0xE69F84,0x4A42:0xE4B8A6,0x4A43:0xE894BD,0x4A44:0xE99689,0x4A45:0xE9999B,
0x4A46:0xE7B1B3,0x4A47:0xE9A081,0x4A48:0xE583BB,0x4A49:0xE5A381,0x4A4A:0xE79996,
0x4A4B:0xE7A2A7,0x4A4C:0xE588A5,0x4A4D:0xE79EA5,0x4A4E:0xE89491,0x4A4F:0xE7AE86,
0x4A50:0xE5818F,0x4A51:0xE5A489,0x4A52:0xE78987,0x4A53:0xE7AF87,0x4A54:0xE7B7A8,
0x4A55:0xE8BEBA,0x4A56:0xE8BF94,0x4A57:0xE9818D,0x4A58:0xE4BEBF,0x4A59:0xE58B89,
0x4A5A:0xE5A8A9,0x4A5B:0xE5BC81,0x4A5C:0xE99EAD,0x4A5D:0xE4BF9D,0x4A5E:0xE88897,
0x4A5F:0xE98BAA,0x4A60:0xE59C83,0x4A61:0xE68D95,0x4A62:0xE6ADA9,0x4A63:0xE794AB,
0x4A64:0xE8A39C,0x4A65:0xE8BC94,0x4A66:0xE7A982,0x4A67:0xE58B9F,0x4A68:0xE5A293,
0x4A69:0xE68595,0x4A6A:0xE6888A,0x4A6B:0xE69AAE,0x4A6C:0xE6AF8D,0x4A6D:0xE7B0BF,
0x4A6E:0xE88FA9,0x4A6F:0xE580A3,0x4A70:0xE4BFB8,0x4A71:0xE58C85,0x4A72:0xE59186,
0x4A73:0xE5A0B1,0x4A74:0xE5A589,0x4A75:0xE5AE9D,0x4A76:0xE5B3B0,0x4A77:0xE5B3AF,
0x4A78:0xE5B4A9,0x4A79:0xE5BA96,0x4A7A:0xE68AB1,0x4A7B:0xE68DA7,0x4A7C:0xE694BE,
0x4A7D:0xE696B9,0x4A7E:0xE69C8B,0x4B21:0xE6B395,0x4B22:0xE6B3A1,0x4B23:0xE783B9,
0x4B24:0xE7A0B2,0x4B25:0xE7B8AB,0x4B26:0xE8839E,0x4B27:0xE88AB3,0x4B28:0xE8908C,
0x4B29:0xE893AC,0x4B2A:0xE89C82,0x4B2B:0xE8A492,0x4B2C:0xE8A8AA,0x4B2D:0xE8B18A,
0x4B2E:0xE982A6,0x4B2F:0xE98B92,0x4B30:0xE9A3BD,0x4B31:0xE9B3B3,0x4B32:0xE9B5AC,
0x4B33:0xE4B98F,0x4B34:0xE4BAA1,0x4B35:0xE5828D,0x4B36:0xE58996,0x4B37:0xE59D8A,
0x4B38:0xE5A6A8,0x4B39:0xE5B8BD,0x4B3A:0xE5BF98,0x4B3B:0xE5BF99,0x4B3C:0xE688BF,
0x4B3D:0xE69AB4,0x4B3E:0xE69C9B,0x4B3F:0xE69F90,0x4B40:0xE6A392,0x4B41:0xE58692,
0x4B42:0xE7B4A1,0x4B43:0xE882AA,0x4B44:0xE886A8,0x4B45:0xE8AC80,0x4B46:0xE8B28C,
0x4B47:0xE8B2BF,0x4B48:0xE989BE,0x4B49:0xE998B2,0x4B4A:0xE590A0,0x4B4B:0xE9A0AC,
0x4B4C:0xE58C97,0x4B4D:0xE58395,0x4B4E:0xE58D9C,0x4B4F:0xE5A2A8,0x4B50:0xE692B2,
0x4B51:0xE69CB4,0x4B52:0xE789A7,0x4B53:0xE79DA6,0x4B54:0xE7A986,0x4B55:0xE987A6,
0x4B56:0xE58B83,0x4B57:0xE6B2A1,0x4B58:0xE6AE86,0x4B59:0xE5A080,0x4B5A:0xE5B98C,
0x4B5B:0xE5A594,0x4B5C:0xE69CAC,0x4B5D:0xE7BFBB,0x4B5E:0xE587A1,0x4B5F:0xE79B86,
0x4B60:0xE691A9,0x4B61:0xE7A3A8,0x4B62:0xE9AD94,0x4B63:0xE9BABB,0x4B64:0xE59F8B,
0x4B65:0xE5A6B9,0x4B66:0xE698A7,0x4B67:0xE69E9A,0x4B68:0xE6AF8E,0x4B69:0xE593A9,
0x4B6A:0xE6A799,0x4B6B:0xE5B995,0x4B6C:0xE8869C,0x4B6D:0xE69E95,0x4B6E:0xE9AEAA,
0x4B6F:0xE69FBE,0x4B70:0xE9B192,0x4B71:0xE6A19D,0x4B72:0xE4BAA6,0x4B73:0xE4BFA3,
0x4B74:0xE58F88,0x4B75:0xE68AB9,0x4B76:0xE69CAB,0x4B77:0xE6B2AB,0x4B78:0xE8BF84,
0x4B79:0xE4BEAD,0x4B7A:0xE7B9AD,0x4B7B:0xE9BABF,0x4B7C:0xE4B887,0x4B7D:0xE685A2,
0x4B7E:0xE6BA80,0x4C21:0xE6BCAB,0x4C22:0xE89493,0x4C23:0xE591B3,0x4C24:0xE69CAA,
0x4C25:0xE9AD85,0x4C26:0xE5B7B3,0x4C27:0xE7AE95,0x4C28:0xE5B2AC,0x4C29:0xE5AF86,
0x4C2A:0xE89C9C,0x4C2B:0xE6B98A,0x4C2C:0xE89391,0x4C2D:0xE7A894,0x4C2E:0xE88488,
0x4C2F:0xE5A699,0x4C30:0xE7B28D,0x4C31:0xE6B091,0x4C32:0xE79CA0,0x4C33:0xE58B99,
0x4C34:0xE5A4A2,0x4C35:0xE784A1,0x4C36:0xE7899F,0x4C37:0xE79F9B,0x4C38:0xE99CA7,
0x4C39:0xE9B5A1,0x4C3A:0xE6A48B,0x4C3B:0xE5A9BF,0x4C3C:0xE5A898,0x4C3D:0xE586A5,
0x4C3E:0xE5908D,0x4C3F:0xE591BD,0x4C40:0xE6988E,0x4C41:0xE79B9F,0x4C42:0xE8BFB7,
0x4C43:0xE98A98,0x4C44:0xE9B3B4,0x4C45:0xE5A7AA,0x4C46:0xE7899D,0x4C47:0xE6BB85,
0x4C48:0xE5858D,0x4C49:0xE6A389,0x4C4A:0xE7B6BF,0x4C4B:0xE7B7AC,0x4C4C:0xE99DA2,
0x4C4D:0xE9BABA,0x4C4E:0xE691B8,0x4C4F:0xE6A8A1,0x4C50:0xE88C82,0x4C51:0xE5A684,
0x4C52:0xE5AD9F,0x4C53:0xE6AF9B,0x4C54:0xE78C9B,0x4C55:0xE79BB2,0x4C56:0xE7B6B2,
0x4C57:0xE88097,0x4C58:0xE89299,0x4C59:0xE584B2,0x4C5A:0xE69CA8,0x4C5B:0xE9BB99,
0x4C5C:0xE79BAE,0x4C5D:0xE69DA2,0x4C5E:0xE58BBF,0x4C5F:0xE9A485,0x4C60:0xE5B0A4,
0x4C61:0xE688BB,0x4C62:0xE7B1BE,0x4C63:0xE8B2B0,0x4C64:0xE5958F,0x4C65:0xE682B6,
0x4C66:0xE7B48B,0x4C67:0xE99680,0x4C68:0xE58C81,0x4C69:0xE4B99F,0x4C6A:0xE586B6,
0x4C6B:0xE5A49C,0x4C6C:0xE788BA,0x4C6D:0xE880B6,0x4C6E:0xE9878E,0x4C6F:0xE5BCA5,
0x4C70:0xE79FA2,0x4C71:0xE58E84,0x4C72:0xE5BDB9,0x4C73:0xE7B484,0x4C74:0xE896AC,
0x4C75:0xE8A8B3,0x4C76:0xE8BA8D,0x4C77:0xE99D96,0x4C78:0xE69FB3,0x4C79:0xE896AE,
0x4C7A:0xE99193,0x4C7B:0xE68489,0x4C7C:0xE68488,0x4C7D:0xE6B2B9,0x4C7E:0xE79992,
0x4D21:0xE8ABAD,0x4D22:0xE8BCB8,0x4D23:0xE594AF,0x4D24:0xE4BD91,0x4D25:0xE584AA,
0x4D26:0xE58B87,0x4D27:0xE58F8B,0x4D28:0xE5AEA5,0x4D29:0xE5B9BD,0x4D2A:0xE682A0,
0x4D2B:0xE68682,0x4D2C:0xE68F96,0x4D2D:0xE69C89,0x4D2E:0xE69F9A,0x4D2F:0xE6B9A7,
0x4D30:0xE6B68C,0x4D31:0xE78CB6,0x4D32:0xE78CB7,0x4D33:0xE794B1,0x4D34:0xE7A590,
0x4D35:0xE8A395,0x4D36:0xE8AA98,0x4D37:0xE9818A,0x4D38:0xE98291,0x4D39:0xE983B5,
0x4D3A:0xE99B84,0x4D3B:0xE89E8D,0x4D3C:0xE5A495,0x4D3D:0xE4BA88,0x4D3E:0xE4BD99,
0x4D3F:0xE4B88E,0x4D40:0xE8AA89,0x4D41:0xE8BCBF,0x4D42:0xE9A090,0x4D43:0xE582AD,
0x4D44:0xE5B9BC,0x4D45:0xE5A696,0x4D46:0xE5AEB9,0x4D47:0xE5BAB8,0x4D48:0xE68F9A,
0x4D49:0xE68FBA,0x4D4A:0xE69381,0x4D4B:0xE69B9C,0x4D4C:0xE6A58A,0x4D4D:0xE6A798,
0x4D4E:0xE6B48B,0x4D4F:0xE6BAB6,0x4D50:0xE78694,0x4D51:0xE794A8,0x4D52:0xE7AAAF,
0x4D53:0xE7BE8A,0x4D54:0xE88080,0x4D55:0xE89189,0x4D56:0xE89389,0x4D57:0xE8A681,
0x4D58:0xE8ACA1,0x4D59:0xE8B88A,0x4D5A:0xE981A5,0x4D5B:0xE999BD,0x4D5C:0xE9A48A,
0x4D5D:0xE685BE,0x4D5E:0xE68A91,0x4D5F:0xE6ACB2,0x4D60:0xE6B283,0x4D61:0xE6B5B4,
0x4D62:0xE7BF8C,0x4D63:0xE7BFBC,0x4D64:0xE6B780,0x4D65:0xE7BE85,0x4D66:0xE89EBA,
0x4D67:0xE8A3B8,0x4D68:0xE69DA5,0x4D69:0xE88EB1,0x4D6A:0xE9A0BC,0x4D6B:0xE99BB7,
0x4D6C:0xE6B49B,0x4D6D:0xE7B5A1,0x4D6E:0xE890BD,0x4D6F:0xE985AA,0x4D70:0xE4B9B1,
0x4D71:0xE58DB5,0x4D72:0xE5B590,0x4D73:0xE6AC84,0x4D74:0xE6BFAB,0x4D75:0xE8978D,
0x4D76:0xE898AD,0x4D77:0xE8A6A7,0x4D78:0xE588A9,0x4D79:0xE5908F,0x4D7A:0xE5B1A5,
0x4D7B:0xE69D8E,0x4D7C:0xE6A2A8,0x4D7D:0xE79086,0x4D7E:0xE79283,0x4E21:0xE797A2,
0x4E22:0xE8A38F,0x4E23:0xE8A3A1,0x4E24:0xE9878C,0x4E25:0xE99BA2,0x4E26:0xE999B8,
0x4E27:0xE5BE8B,0x4E28:0xE78E87,0x4E29:0xE7AB8B,0x4E2A:0xE8918E,0x4E2B:0xE68EA0,
0x4E2C:0xE795A5,0x4E2D:0xE58A89,0x4E2E:0xE6B581,0x4E2F:0xE6BA9C,0x4E30:0xE79089,
0x4E31:0xE79599,0x4E32:0xE7A1AB,0x4E33:0xE7B292,0x4E34:0xE99A86,0x4E35:0xE7AB9C,
0x4E36:0xE9BE8D,0x4E37:0xE4BEB6,0x4E38:0xE685AE,0x4E39:0xE69785,0x4E3A:0xE8999C,
0x4E3B:0xE4BA86,0x4E3C:0xE4BAAE,0x4E3D:0xE5839A,0x4E3E:0xE4B8A1,0x4E3F:0xE5878C,
0x4E40:0xE5AFAE,0x4E41:0xE69699,0x4E42:0xE6A281,0x4E43:0xE6B6BC,0x4E44:0xE78C9F,
0x4E45:0xE79982,0x4E46:0xE79EAD,0x4E47:0xE7A89C,0x4E48:0xE7B3A7,0x4E49:0xE889AF,
0x4E4A:0xE8AB92,0x4E4B:0xE981BC,0x4E4C:0xE9878F,0x4E4D:0xE999B5,0x4E4E:0xE9A098,
0x4E4F:0xE58A9B,0x4E50:0xE7B791,0x4E51:0xE580AB,0x4E52:0xE58E98,0x4E53:0xE69E97,
0x4E54:0xE6B78B,0x4E55:0xE78790,0x4E56:0xE790B3,0x4E57:0xE887A8,0x4E58:0xE8BCAA,
0x4E59:0xE99AA3,0x4E5A:0xE9B197,0x4E5B:0xE9BA9F,0x4E5C:0xE791A0,0x4E5D:0xE5A181,
0x4E5E:0xE6B699,0x4E5F:0xE7B4AF,0x4E60:0xE9A19E,0x4E61:0xE4BBA4,0x4E62:0xE4BCB6,
0x4E63:0xE4BE8B,0x4E64:0xE586B7,0x4E65:0xE58AB1,0x4E66:0xE5B6BA,0x4E67:0xE6809C,
0x4E68:0xE78EB2,0x4E69:0xE7A4BC,0x4E6A:0xE88B93,0x4E6B:0xE988B4,0x4E6C:0xE99AB7,
0x4E6D:0xE99BB6,0x4E6E:0xE99C8A,0x4E6F:0xE9BA97,0x4E70:0xE9BDA2,0x4E71:0xE69AA6,
0x4E72:0xE6ADB4,0x4E73:0xE58897,0x4E74:0xE58AA3,0x4E75:0xE78388,0x4E76:0xE8A382,
0x4E77:0xE5BB89,0x4E78:0xE6818B,0x4E79:0xE68690,0x4E7A:0xE6BCA3,0x4E7B:0xE78589,
0x4E7C:0xE7B0BE,0x4E7D:0xE7B7B4,0x4E7E:0xE881AF,0x4F21:0xE893AE,0x4F22:0xE980A3,
0x4F23:0xE98CAC,0x4F24:0xE59182,0x4F25:0xE9ADAF,0x4F26:0xE6AB93,0x4F27:0xE78289,
0x4F28:0xE8B382,0x4F29:0xE8B7AF,0x4F2A:0xE99CB2,0x4F2B:0xE58AB4,0x4F2C:0xE5A981,
0x4F2D:0xE5BB8A,0x4F2E:0xE5BC84,0x4F2F:0xE69C97,0x4F30:0xE6A5BC,0x4F31:0xE6A694,
0x4F32:0xE6B5AA,0x4F33:0xE6BC8F,0x4F34:0xE789A2,0x4F35:0xE78BBC,0x4F36:0xE7AFAD,
0x4F37:0xE88081,0x4F38:0xE881BE,0x4F39:0xE89D8B,0x4F3A:0xE9838E,0x4F3B:0xE585AD,
0x4F3C:0xE9BA93,0x4F3D:0xE7A684,0x4F3E:0xE8828B,0x4F3F:0xE98CB2,0x4F40:0xE8AB96,
0x4F41:0xE580AD,0x4F42:0xE5928C,0x4F43:0xE8A9B1,0x4F44:0xE6ADAA,0x4F45:0xE8B384,
0x4F46:0xE88487,0x4F47:0xE68391,0x4F48:0xE69EA0,0x4F49:0xE9B7B2,0x4F4A:0xE4BA99,
0x4F4B:0xE4BA98,0x4F4C:0xE9B090,0x4F4D:0xE8A9AB,0x4F4E:0xE89781,0x4F4F:0xE895A8,
0x4F50:0xE6A480,0x4F51:0xE6B9BE,0x4F52:0xE7A297,0x4F53:0xE88595,0x5021:0xE5BC8C,
0x5022:0xE4B890,0x5023:0xE4B895,0x5024:0xE4B8AA,0x5025:0xE4B8B1,0x5026:0xE4B8B6,
0x5027:0xE4B8BC,0x5028:0xE4B8BF,0x5029:0xE4B982,0x502A:0xE4B996,0x502B:0xE4B998,
0x502C:0xE4BA82,0x502D:0xE4BA85,0x502E:0xE8B1AB,0x502F:0xE4BA8A,0x5030:0xE88892,
0x5031:0xE5BC8D,0x5032:0xE4BA8E,0x5033:0xE4BA9E,0x5034:0xE4BA9F,0x5035:0xE4BAA0,
0x5036:0xE4BAA2,0x5037:0xE4BAB0,0x5038:0xE4BAB3,0x5039:0xE4BAB6,0x503A:0xE4BB8E,
0x503B:0xE4BB8D,0x503C:0xE4BB84,0x503D:0xE4BB86,0x503E:0xE4BB82,0x503F:0xE4BB97,
0x5040:0xE4BB9E,0x5041:0xE4BBAD,0x5042:0xE4BB9F,0x5043:0xE4BBB7,0x5044:0xE4BC89,
0x5045:0xE4BD9A,0x5046:0xE4BCB0,0x5047:0xE4BD9B,0x5048:0xE4BD9D,0x5049:0xE4BD97,
0x504A:0xE4BD87,0x504B:0xE4BDB6,0x504C:0xE4BE88,0x504D:0xE4BE8F,0x504E:0xE4BE98,
0x504F:0xE4BDBB,0x5050:0xE4BDA9,0x5051:0xE4BDB0,0x5052:0xE4BE91,0x5053:0xE4BDAF,
0x5054:0xE4BE86,0x5055:0xE4BE96,0x5056:0xE58498,0x5057:0xE4BF94,0x5058:0xE4BF9F,
0x5059:0xE4BF8E,0x505A:0xE4BF98,0x505B:0xE4BF9B,0x505C:0xE4BF91,0x505D:0xE4BF9A,
0x505E:0xE4BF90,0x505F:0xE4BFA4,0x5060:0xE4BFA5,0x5061:0xE5809A,0x5062:0xE580A8,
0x5063:0xE58094,0x5064:0xE580AA,0x5065:0xE580A5,0x5066:0xE58085,0x5067:0xE4BC9C,
0x5068:0xE4BFB6,0x5069:0xE580A1,0x506A:0xE580A9,0x506B:0xE580AC,0x506C:0xE4BFBE,
0x506D:0xE4BFAF,0x506E:0xE58091,0x506F:0xE58086,0x5070:0xE58183,0x5071:0xE58187,
0x5072:0xE69C83,0x5073:0xE58195,0x5074:0xE58190,0x5075:0xE58188,0x5076:0xE5819A,
0x5077:0xE58196,0x5078:0xE581AC,0x5079:0xE581B8,0x507A:0xE58280,0x507B:0xE5829A,
0x507C:0xE58285,0x507D:0xE582B4,0x507E:0xE582B2,0x5121:0xE58389,0x5122:0xE5838A,
0x5123:0xE582B3,0x5124:0xE58382,0x5125:0xE58396,0x5126:0xE5839E,0x5127:0xE583A5,
0x5128:0xE583AD,0x5129:0xE583A3,0x512A:0xE583AE,0x512B:0xE583B9,0x512C:0xE583B5,
0x512D:0xE58489,0x512E:0xE58481,0x512F:0xE58482,0x5130:0xE58496,0x5131:0xE58495,
0x5132:0xE58494,0x5133:0xE5849A,0x5134:0xE584A1,0x5135:0xE584BA,0x5136:0xE584B7,
0x5137:0xE584BC,0x5138:0xE584BB,0x5139:0xE584BF,0x513A:0xE58580,0x513B:0xE58592,
0x513C:0xE5858C,0x513D:0xE58594,0x513E:0xE585A2,0x513F:0xE7ABB8,0x5140:0xE585A9,
0x5141:0xE585AA,0x5142:0xE585AE,0x5143:0xE58680,0x5144:0xE58682,0x5145:0xE59B98,
0x5146:0xE5868C,0x5147:0xE58689,0x5148:0xE5868F,0x5149:0xE58691,0x514A:0xE58693,
0x514B:0xE58695,0x514C:0xE58696,0x514D:0xE586A4,0x514E:0xE586A6,0x514F:0xE586A2,
0x5150:0xE586A9,0x5151:0xE586AA,0x5152:0xE586AB,0x5153:0xE586B3,0x5154:0xE586B1,
0x5155:0xE586B2,0x5156:0xE586B0,0x5157:0xE586B5,0x5158:0xE586BD,0x5159:0xE58785,
0x515A:0xE58789,0x515B:0xE5879B,0x515C:0xE587A0,0x515D:0xE89995,0x515E:0xE587A9,
0x515F:0xE587AD,0x5160:0xE587B0,0x5161:0xE587B5,0x5162:0xE587BE,0x5163:0xE58884,
0x5164:0xE5888B,0x5165:0xE58894,0x5166:0xE5888E,0x5167:0xE588A7,0x5168:0xE588AA,
0x5169:0xE588AE,0x516A:0xE588B3,0x516B:0xE588B9,0x516C:0xE5898F,0x516D:0xE58984,
0x516E:0xE5898B,0x516F:0xE5898C,0x5170:0xE5899E,0x5171:0xE58994,0x5172:0xE589AA,
0x5173:0xE589B4,0x5174:0xE589A9,0x5175:0xE589B3,0x5176:0xE589BF,0x5177:0xE589BD,
0x5178:0xE58A8D,0x5179:0xE58A94,0x517A:0xE58A92,0x517B:0xE589B1,0x517C:0xE58A88,
0x517D:0xE58A91,0x517E:0xE8BEA8,0x5221:0xE8BEA7,0x5222:0xE58AAC,0x5223:0xE58AAD,
0x5224:0xE58ABC,0x5225:0xE58AB5,0x5226:0xE58B81,0x5227:0xE58B8D,0x5228:0xE58B97,
0x5229:0xE58B9E,0x522A:0xE58BA3,0x522B:0xE58BA6,0x522C:0xE9A3AD,0x522D:0xE58BA0,
0x522E:0xE58BB3,0x522F:0xE58BB5,0x5230:0xE58BB8,0x5231:0xE58BB9,0x5232:0xE58C86,
0x5233:0xE58C88,0x5234:0xE794B8,0x5235:0xE58C8D,0x5236:0xE58C90,0x5237:0xE58C8F,
0x5238:0xE58C95,0x5239:0xE58C9A,0x523A:0xE58CA3,0x523B:0xE58CAF,0x523C:0xE58CB1,
0x523D:0xE58CB3,0x523E:0xE58CB8,0x523F:0xE58D80,0x5240:0xE58D86,0x5241:0xE58D85,
0x5242:0xE4B897,0x5243:0xE58D89,0x5244:0xE58D8D,0x5245:0xE58796,0x5246:0xE58D9E,
0x5247:0xE58DA9,0x5248:0xE58DAE,0x5249:0xE5A498,0x524A:0xE58DBB,0x524B:0xE58DB7,
0x524C:0xE58E82,0x524D:0xE58E96,0x524E:0xE58EA0,0x524F:0xE58EA6,0x5250:0xE58EA5,
0x5251:0xE58EAE,0x5252:0xE58EB0,0x5253:0xE58EB6,0x5254:0xE58F83,0x5255:0xE7B092,
0x5256:0xE99B99,0x5257:0xE58F9F,0x5258:0xE69BBC,0x5259:0xE787AE,0x525A:0xE58FAE,
0x525B:0xE58FA8,0x525C:0xE58FAD,0x525D:0xE58FBA,0x525E:0xE59081,0x525F:0xE590BD,
0x5260:0xE59180,0x5261:0xE590AC,0x5262:0xE590AD,0x5263:0xE590BC,0x5264:0xE590AE,
0x5265:0xE590B6,0x5266:0xE590A9,0x5267:0xE5909D,0x5268:0xE5918E,0x5269:0xE5928F,
0x526A:0xE591B5,0x526B:0xE5928E,0x526C:0xE5919F,0x526D:0xE591B1,0x526E:0xE591B7,
0x526F:0xE591B0,0x5270:0xE59292,0x5271:0xE591BB,0x5272:0xE59280,0x5273:0xE591B6,
0x5274:0xE59284,0x5275:0xE59290,0x5276:0xE59286,0x5277:0xE59387,0x5278:0xE592A2,
0x5279:0xE592B8,0x527A:0xE592A5,0x527B:0xE592AC,0x527C:0xE59384,0x527D:0xE59388,
0x527E:0xE592A8,0x5321:0xE592AB,0x5322:0xE59382,0x5323:0xE592A4,0x5324:0xE592BE,
0x5325:0xE592BC,0x5326:0xE59398,0x5327:0xE593A5,0x5328:0xE593A6,0x5329:0xE5948F,
0x532A:0xE59494,0x532B:0xE593BD,0x532C:0xE593AE,0x532D:0xE593AD,0x532E:0xE593BA,
0x532F:0xE593A2,0x5330:0xE594B9,0x5331:0xE59580,0x5332:0xE595A3,0x5333:0xE5958C,
0x5334:0xE594AE,0x5335:0xE5959C,0x5336:0xE59585,0x5337:0xE59596,0x5338:0xE59597,
0x5339:0xE594B8,0x533A:0xE594B3,0x533B:0xE5959D,0x533C:0xE59699,0x533D:0xE59680,
0x533E:0xE592AF,0x533F:0xE5968A,0x5340:0xE5969F,0x5341:0xE595BB,0x5342:0xE595BE,
0x5343:0xE59698,0x5344:0xE5969E,0x5345:0xE596AE,0x5346:0xE595BC,0x5347:0xE59683,
0x5348:0xE596A9,0x5349:0xE59687,0x534A:0xE596A8,0x534B:0xE5979A,0x534C:0xE59785,
0x534D:0xE5979F,0x534E:0xE59784,0x534F:0xE5979C,0x5350:0xE597A4,0x5351:0xE59794,
0x5352:0xE59894,0x5353:0xE597B7,0x5354:0xE59896,0x5355:0xE597BE,0x5356:0xE597BD,
0x5357:0xE5989B,0x5358:0xE597B9,0x5359:0xE5998E,0x535A:0xE59990,0x535B:0xE7879F,
0x535C:0xE598B4,0x535D:0xE598B6,0x535E:0xE598B2,0x535F:0xE598B8,0x5360:0xE599AB,
0x5361:0xE599A4,0x5362:0xE598AF,0x5363:0xE599AC,0x5364:0xE599AA,0x5365:0xE59A86,
0x5366:0xE59A80,0x5367:0xE59A8A,0x5368:0xE59AA0,0x5369:0xE59A94,0x536A:0xE59A8F,
0x536B:0xE59AA5,0x536C:0xE59AAE,0x536D:0xE59AB6,0x536E:0xE59AB4,0x536F:0xE59B82,
0x5370:0xE59ABC,0x5371:0xE59B81,0x5372:0xE59B83,0x5373:0xE59B80,0x5374:0xE59B88,
0x5375:0xE59B8E,0x5376:0xE59B91,0x5377:0xE59B93,0x5378:0xE59B97,0x5379:0xE59BAE,
0x537A:0xE59BB9,0x537B:0xE59C80,0x537C:0xE59BBF,0x537D:0xE59C84,0x537E:0xE59C89,
0x5421:0xE59C88,0x5422:0xE59C8B,0x5423:0xE59C8D,0x5424:0xE59C93,0x5425:0xE59C98,
0x5426:0xE59C96,0x5427:0xE59787,0x5428:0xE59C9C,0x5429:0xE59CA6,0x542A:0xE59CB7,
0x542B:0xE59CB8,0x542C:0xE59D8E,0x542D:0xE59CBB,0x542E:0xE59D80,0x542F:0xE59D8F,
0x5430:0xE59DA9,0x5431:0xE59F80,0x5432:0xE59E88,0x5433:0xE59DA1,0x5434:0xE59DBF,
0x5435:0xE59E89,0x5436:0xE59E93,0x5437:0xE59EA0,0x5438:0xE59EB3,0x5439:0xE59EA4,
0x543A:0xE59EAA,0x543B:0xE59EB0,0x543C:0xE59F83,0x543D:0xE59F86,0x543E:0xE59F94,
0x543F:0xE59F92,0x5440:0xE59F93,0x5441:0xE5A08A,0x5442:0xE59F96,0x5443:0xE59FA3,
0x5444:0xE5A08B,0x5445:0xE5A099,0x5446:0xE5A09D,0x5447:0xE5A1B2,0x5448:0xE5A0A1,
0x5449:0xE5A1A2,0x544A:0xE5A18B,0x544B:0xE5A1B0,0x544C:0xE6AF80,0x544D:0xE5A192,
0x544E:0xE5A0BD,0x544F:0xE5A1B9,0x5450:0xE5A285,0x5451:0xE5A2B9,0x5452:0xE5A29F,
0x5453:0xE5A2AB,0x5454:0xE5A2BA,0x5455:0xE5A39E,0x5456:0xE5A2BB,0x5457:0xE5A2B8,
0x5458:0xE5A2AE,0x5459:0xE5A385,0x545A:0xE5A393,0x545B:0xE5A391,0x545C:0xE5A397,
0x545D:0xE5A399,0x545E:0xE5A398,0x545F:0xE5A3A5,0x5460:0xE5A39C,0x5461:0xE5A3A4,
0x5462:0xE5A39F,0x5463:0xE5A3AF,0x5464:0xE5A3BA,0x5465:0xE5A3B9,0x5466:0xE5A3BB,
0x5467:0xE5A3BC,0x5468:0xE5A3BD,0x5469:0xE5A482,0x546A:0xE5A48A,0x546B:0xE5A490,
0x546C:0xE5A49B,0x546D:0xE6A2A6,0x546E:0xE5A4A5,0x546F:0xE5A4AC,0x5470:0xE5A4AD,
0x5471:0xE5A4B2,0x5472:0xE5A4B8,0x5473:0xE5A4BE,0x5474:0xE7AB92,0x5475:0xE5A595,
0x5476:0xE5A590,0x5477:0xE5A58E,0x5478:0xE5A59A,0x5479:0xE5A598,0x547A:0xE5A5A2,
0x547B:0xE5A5A0,0x547C:0xE5A5A7,0x547D:0xE5A5AC,0x547E:0xE5A5A9,0x5521:0xE5A5B8,
0x5522:0xE5A681,0x5523:0xE5A69D,0x5524:0xE4BD9E,0x5525:0xE4BEAB,0x5526:0xE5A6A3,
0x5527:0xE5A6B2,0x5528:0xE5A786,0x5529:0xE5A7A8,0x552A:0xE5A79C,0x552B:0xE5A68D,
0x552C:0xE5A799,0x552D:0xE5A79A,0x552E:0xE5A8A5,0x552F:0xE5A89F,0x5530:0xE5A891,
0x5531:0xE5A89C,0x5532:0xE5A889,0x5533:0xE5A89A,0x5534:0xE5A980,0x5535:0xE5A9AC,
0x5536:0xE5A989,0x5537:0xE5A8B5,0x5538:0xE5A8B6,0x5539:0xE5A9A2,0x553A:0xE5A9AA,
0x553B:0xE5AA9A,0x553C:0xE5AABC,0x553D:0xE5AABE,0x553E:0xE5AB8B,0x553F:0xE5AB82,
0x5540:0xE5AABD,0x5541:0xE5ABA3,0x5542:0xE5AB97,0x5543:0xE5ABA6,0x5544:0xE5ABA9,
0x5545:0xE5AB96,0x5546:0xE5ABBA,0x5547:0xE5ABBB,0x5548:0xE5AC8C,0x5549:0xE5AC8B,
0x554A:0xE5AC96,0x554B:0xE5ACB2,0x554C:0xE5AB90,0x554D:0xE5ACAA,0x554E:0xE5ACB6,
0x554F:0xE5ACBE,0x5550:0xE5AD83,0x5551:0xE5AD85,0x5552:0xE5AD80,0x5553:0xE5AD91,
0x5554:0xE5AD95,0x5555:0xE5AD9A,0x5556:0xE5AD9B,0x5557:0xE5ADA5,0x5558:0xE5ADA9,
0x5559:0xE5ADB0,0x555A:0xE5ADB3,0x555B:0xE5ADB5,0x555C:0xE5ADB8,0x555D:0xE69688,
0x555E:0xE5ADBA,0x555F:0xE5AE80,0x5560:0xE5AE83,0x5561:0xE5AEA6,0x5562:0xE5AEB8,
0x5563:0xE5AF83,0x5564:0xE5AF87,0x5565:0xE5AF89,0x5566:0xE5AF94,0x5567:0xE5AF90,
0x5568:0xE5AFA4,0x5569:0xE5AFA6,0x556A:0xE5AFA2,0x556B:0xE5AF9E,0x556C:0xE5AFA5,
0x556D:0xE5AFAB,0x556E:0xE5AFB0,0x556F:0xE5AFB6,0x5570:0xE5AFB3,0x5571:0xE5B085,
0x5572:0xE5B087,0x5573:0xE5B088,0x5574:0xE5B08D,0x5575:0xE5B093,0x5576:0xE5B0A0,
0x5577:0xE5B0A2,0x5578:0xE5B0A8,0x5579:0xE5B0B8,0x557A:0xE5B0B9,0x557B:0xE5B181,
0x557C:0xE5B186,0x557D:0xE5B18E,0x557E:0xE5B193,0x5621:0xE5B190,0x5622:0xE5B18F,
0x5623:0xE5ADB1,0x5624:0xE5B1AC,0x5625:0xE5B1AE,0x5626:0xE4B9A2,0x5627:0xE5B1B6,
0x5628:0xE5B1B9,0x5629:0xE5B28C,0x562A:0xE5B291,0x562B:0xE5B294,0x562C:0xE5A69B,
0x562D:0xE5B2AB,0x562E:0xE5B2BB,0x562F:0xE5B2B6,0x5630:0xE5B2BC,0x5631:0xE5B2B7,
0x5632:0xE5B385,0x5633:0xE5B2BE,0x5634:0xE5B387,0x5635:0xE5B399,0x5636:0xE5B3A9,
0x5637:0xE5B3BD,0x5638:0xE5B3BA,0x5639:0xE5B3AD,0x563A:0xE5B68C,0x563B:0xE5B3AA,
0x563C:0xE5B48B,0x563D:0xE5B495,0x563E:0xE5B497,0x563F:0xE5B59C,0x5640:0xE5B49F,
0x5641:0xE5B49B,0x5642:0xE5B491,0x5643:0xE5B494,0x5644:0xE5B4A2,0x5645:0xE5B49A,
0x5646:0xE5B499,0x5647:0xE5B498,0x5648:0xE5B58C,0x5649:0xE5B592,0x564A:0xE5B58E,
0x564B:0xE5B58B,0x564C:0xE5B5AC,0x564D:0xE5B5B3,0x564E:0xE5B5B6,0x564F:0xE5B687,
0x5650:0xE5B684,0x5651:0xE5B682,0x5652:0xE5B6A2,0x5653:0xE5B69D,0x5654:0xE5B6AC,
0x5655:0xE5B6AE,0x5656:0xE5B6BD,0x5657:0xE5B690,0x5658:0xE5B6B7,0x5659:0xE5B6BC,
0x565A:0xE5B789,0x565B:0xE5B78D,0x565C:0xE5B793,0x565D:0xE5B792,0x565E:0xE5B796,
0x565F:0xE5B79B,0x5660:0xE5B7AB,0x5661:0xE5B7B2,0x5662:0xE5B7B5,0x5663:0xE5B88B,
0x5664:0xE5B89A,0x5665:0xE5B899,0x5666:0xE5B891,0x5667:0xE5B89B,0x5668:0xE5B8B6,
0x5669:0xE5B8B7,0x566A:0xE5B984,0x566B:0xE5B983,0x566C:0xE5B980,0x566D:0xE5B98E,
0x566E:0xE5B997,0x566F:0xE5B994,0x5670:0xE5B99F,0x5671:0xE5B9A2,0x5672:0xE5B9A4,
0x5673:0xE5B987,0x5674:0xE5B9B5,0x5675:0xE5B9B6,0x5676:0xE5B9BA,0x5677:0xE9BABC,
0x5678:0xE5B9BF,0x5679:0xE5BAA0,0x567A:0xE5BB81,0x567B:0xE5BB82,0x567C:0xE5BB88,
0x567D:0xE5BB90,0x567E:0xE5BB8F,0x5721:0xE5BB96,0x5722:0xE5BBA3,0x5723:0xE5BB9D,
0x5724:0xE5BB9A,0x5725:0xE5BB9B,0x5726:0xE5BBA2,0x5727:0xE5BBA1,0x5728:0xE5BBA8,
0x5729:0xE5BBA9,0x572A:0xE5BBAC,0x572B:0xE5BBB1,0x572C:0xE5BBB3,0x572D:0xE5BBB0,
0x572E:0xE5BBB4,0x572F:0xE5BBB8,0x5730:0xE5BBBE,0x5731:0xE5BC83,0x5732:0xE5BC89,
0x5733:0xE5BD9D,0x5734:0xE5BD9C,0x5735:0xE5BC8B,0x5736:0xE5BC91,0x5737:0xE5BC96,
0x5738:0xE5BCA9,0x5739:0xE5BCAD,0x573A:0xE5BCB8,0x573B:0xE5BD81,0x573C:0xE5BD88,
0x573D:0xE5BD8C,0x573E:0xE5BD8E,0x573F:0xE5BCAF,0x5740:0xE5BD91,0x5741:0xE5BD96,
0x5742:0xE5BD97,0x5743:0xE5BD99,0x5744:0xE5BDA1,0x5745:0xE5BDAD,0x5746:0xE5BDB3,
0x5747:0xE5BDB7,0x5748:0xE5BE83,0x5749:0xE5BE82,0x574A:0xE5BDBF,0x574B:0xE5BE8A,
0x574C:0xE5BE88,0x574D:0xE5BE91,0x574E:0xE5BE87,0x574F:0xE5BE9E,0x5750:0xE5BE99,
0x5751:0xE5BE98,0x5752:0xE5BEA0,0x5753:0xE5BEA8,0x5754:0xE5BEAD,0x5755:0xE5BEBC,
0x5756:0xE5BF96,0x5757:0xE5BFBB,0x5758:0xE5BFA4,0x5759:0xE5BFB8,0x575A:0xE5BFB1,
0x575B:0xE5BF9D,0x575C:0xE682B3,0x575D:0xE5BFBF,0x575E:0xE680A1,0x575F:0xE681A0,
0x5760:0xE68099,0x5761:0xE68090,0x5762:0xE680A9,0x5763:0xE6808E,0x5764:0xE680B1,
0x5765:0xE6809B,0x5766:0xE68095,0x5767:0xE680AB,0x5768:0xE680A6,0x5769:0xE6808F,
0x576A:0xE680BA,0x576B:0xE6819A,0x576C:0xE68181,0x576D:0xE681AA,0x576E:0xE681B7,
0x576F:0xE6819F,0x5770:0xE6818A,0x5771:0xE68186,0x5772:0xE6818D,0x5773:0xE681A3,
0x5774:0xE68183,0x5775:0xE681A4,0x5776:0xE68182,0x5777:0xE681AC,0x5778:0xE681AB,
0x5779:0xE68199,0x577A:0xE68281,0x577B:0xE6828D,0x577C:0xE683A7,0x577D:0xE68283,
0x577E:0xE6829A,0x5821:0xE68284,0x5822:0xE6829B,0x5823:0xE68296,0x5824:0xE68297,
0x5825:0xE68292,0x5826:0xE682A7,0x5827:0xE6828B,0x5828:0xE683A1,0x5829:0xE682B8,
0x582A:0xE683A0,0x582B:0xE68393,0x582C:0xE682B4,0x582D:0xE5BFB0,0x582E:0xE682BD,
0x582F:0xE68386,0x5830:0xE682B5,0x5831:0xE68398,0x5832:0xE6858D,0x5833:0xE68495,
0x5834:0xE68486,0x5835:0xE683B6,0x5836:0xE683B7,0x5837:0xE68480,0x5838:0xE683B4,
0x5839:0xE683BA,0x583A:0xE68483,0x583B:0xE684A1,0x583C:0xE683BB,0x583D:0xE683B1,
0x583E:0xE6848D,0x583F:0xE6848E,0x5840:0xE68587,0x5841:0xE684BE,0x5842:0xE684A8,
0x5843:0xE684A7,0x5844:0xE6858A,0x5845:0xE684BF,0x5846:0xE684BC,0x5847:0xE684AC,
0x5848:0xE684B4,0x5849:0xE684BD,0x584A:0xE68582,0x584B:0xE68584,0x584C:0xE685B3,
0x584D:0xE685B7,0x584E:0xE68598,0x584F:0xE68599,0x5850:0xE6859A,0x5851:0xE685AB,
0x5852:0xE685B4,0x5853:0xE685AF,0x5854:0xE685A5,0x5855:0xE685B1,0x5856:0xE6859F,
0x5857:0xE6859D,0x5858:0xE68593,0x5859:0xE685B5,0x585A:0xE68699,0x585B:0xE68696,
0x585C:0xE68687,0x585D:0xE686AC,0x585E:0xE68694,0x585F:0xE6869A,0x5860:0xE6868A,
0x5861:0xE68691,0x5862:0xE686AB,0x5863:0xE686AE,0x5864:0xE6878C,0x5865:0xE6878A,
0x5866:0xE68789,0x5867:0xE687B7,0x5868:0xE68788,0x5869:0xE68783,0x586A:0xE68786,
0x586B:0xE686BA,0x586C:0xE6878B,0x586D:0xE7BDB9,0x586E:0xE6878D,0x586F:0xE687A6,
0x5870:0xE687A3,0x5871:0xE687B6,0x5872:0xE687BA,0x5873:0xE687B4,0x5874:0xE687BF,
0x5875:0xE687BD,0x5876:0xE687BC,0x5877:0xE687BE,0x5878:0xE68880,0x5879:0xE68888,
0x587A:0xE68889,0x587B:0xE6888D,0x587C:0xE6888C,0x587D:0xE68894,0x587E:0xE6889B,
0x5921:0xE6889E,0x5922:0xE688A1,0x5923:0xE688AA,0x5924:0xE688AE,0x5925:0xE688B0,
0x5926:0xE688B2,0x5927:0xE688B3,0x5928:0xE68981,0x5929:0xE6898E,0x592A:0xE6899E,
0x592B:0xE689A3,0x592C:0xE6899B,0x592D:0xE689A0,0x592E:0xE689A8,0x592F:0xE689BC,
0x5930:0xE68A82,0x5931:0xE68A89,0x5932:0xE689BE,0x5933:0xE68A92,0x5934:0xE68A93,
0x5935:0xE68A96,0x5936:0xE68B94,0x5937:0xE68A83,0x5938:0xE68A94,0x5939:0xE68B97,
0x593A:0xE68B91,0x593B:0xE68ABB,0x593C:0xE68B8F,0x593D:0xE68BBF,0x593E:0xE68B86,
0x593F:0xE69394,0x5940:0xE68B88,0x5941:0xE68B9C,0x5942:0xE68B8C,0x5943:0xE68B8A,
0x5944:0xE68B82,0x5945:0xE68B87,0x5946:0xE68A9B,0x5947:0xE68B89,0x5948:0xE68C8C,
0x5949:0xE68BAE,0x594A:0xE68BB1,0x594B:0xE68CA7,0x594C:0xE68C82,0x594D:0xE68C88,
0x594E:0xE68BAF,0x594F:0xE68BB5,0x5950:0xE68D90,0x5951:0xE68CBE,0x5952:0xE68D8D,
0x5953:0xE6909C,0x5954:0xE68D8F,0x5955:0xE68E96,0x5956:0xE68E8E,0x5957:0xE68E80,
0x5958:0xE68EAB,0x5959:0xE68DB6,0x595A:0xE68EA3,0x595B:0xE68E8F,0x595C:0xE68E89,
0x595D:0xE68E9F,0x595E:0xE68EB5,0x595F:0xE68DAB,0x5960:0xE68DA9,0x5961:0xE68EBE,
0x5962:0xE68FA9,0x5963:0xE68F80,0x5964:0xE68F86,0x5965:0xE68FA3,0x5966:0xE68F89,
0x5967:0xE68F92,0x5968:0xE68FB6,0x5969:0xE68F84,0x596A:0xE69096,0x596B:0xE690B4,
0x596C:0xE69086,0x596D:0xE69093,0x596E:0xE690A6,0x596F:0xE690B6,0x5970:0xE6949D,
0x5971:0xE69097,0x5972:0xE690A8,0x5973:0xE6908F,0x5974:0xE691A7,0x5975:0xE691AF,
0x5976:0xE691B6,0x5977:0xE6918E,0x5978:0xE694AA,0x5979:0xE69295,0x597A:0xE69293,
0x597B:0xE692A5,0x597C:0xE692A9,0x597D:0xE69288,0x597E:0xE692BC,0x5A21:0xE6939A,
0x5A22:0xE69392,0x5A23:0xE69385,0x5A24:0xE69387,0x5A25:0xE692BB,0x5A26:0xE69398,
0x5A27:0xE69382,0x5A28:0xE693B1,0x5A29:0xE693A7,0x5A2A:0xE88889,0x5A2B:0xE693A0,
0x5A2C:0xE693A1,0x5A2D:0xE68AAC,0x5A2E:0xE693A3,0x5A2F:0xE693AF,0x5A30:0xE694AC,
0x5A31:0xE693B6,0x5A32:0xE693B4,0x5A33:0xE693B2,0x5A34:0xE693BA,0x5A35:0xE69480,
0x5A36:0xE693BD,0x5A37:0xE69498,0x5A38:0xE6949C,0x5A39:0xE69485,0x5A3A:0xE694A4,
0x5A3B:0xE694A3,0x5A3C:0xE694AB,0x5A3D:0xE694B4,0x5A3E:0xE694B5,0x5A3F:0xE694B7,
0x5A40:0xE694B6,0x5A41:0xE694B8,0x5A42:0xE7958B,0x5A43:0xE69588,0x5A44:0xE69596,
0x5A45:0xE69595,0x5A46:0xE6958D,0x5A47:0xE69598,0x5A48:0xE6959E,0x5A49:0xE6959D,
0x5A4A:0xE695B2,0x5A4B:0xE695B8,0x5A4C:0xE69682,0x5A4D:0xE69683,0x5A4E:0xE8AE8A,
0x5A4F:0xE6969B,0x5A50:0xE6969F,0x5A51:0xE696AB,0x5A52:0xE696B7,0x5A53:0xE69783,
0x5A54:0xE69786,0x5A55:0xE69781,0x5A56:0xE69784,0x5A57:0xE6978C,0x5A58:0xE69792,
0x5A59:0xE6979B,0x5A5A:0xE69799,0x5A5B:0xE697A0,0x5A5C:0xE697A1,0x5A5D:0xE697B1,
0x5A5E:0xE69DB2,0x5A5F:0xE6988A,0x5A60:0xE69883,0x5A61:0xE697BB,0x5A62:0xE69DB3,
0x5A63:0xE698B5,0x5A64:0xE698B6,0x5A65:0xE698B4,0x5A66:0xE6989C,0x5A67:0xE6998F,
0x5A68:0xE69984,0x5A69:0xE69989,0x5A6A:0xE69981,0x5A6B:0xE6999E,0x5A6C:0xE6999D,
0x5A6D:0xE699A4,0x5A6E:0xE699A7,0x5A6F:0xE699A8,0x5A70:0xE6999F,0x5A71:0xE699A2,
0x5A72:0xE699B0,0x5A73:0xE69A83,0x5A74:0xE69A88,0x5A75:0xE69A8E,0x5A76:0xE69A89,
0x5A77:0xE69A84,0x5A78:0xE69A98,0x5A79:0xE69A9D,0x5A7A:0xE69B81,0x5A7B:0xE69AB9,
0x5A7C:0xE69B89,0x5A7D:0xE69ABE,0x5A7E:0xE69ABC,0x5B21:0xE69B84,0x5B22:0xE69AB8,
0x5B23:0xE69B96,0x5B24:0xE69B9A,0x5B25:0xE69BA0,0x5B26:0xE698BF,0x5B27:0xE69BA6,
0x5B28:0xE69BA9,0x5B29:0xE69BB0,0x5B2A:0xE69BB5,0x5B2B:0xE69BB7,0x5B2C:0xE69C8F,
0x5B2D:0xE69C96,0x5B2E:0xE69C9E,0x5B2F:0xE69CA6,0x5B30:0xE69CA7,0x5B31:0xE99CB8,
0x5B32:0xE69CAE,0x5B33:0xE69CBF,0x5B34:0xE69CB6,0x5B35:0xE69D81,0x5B36:0xE69CB8,
0x5B37:0xE69CB7,0x5B38:0xE69D86,0x5B39:0xE69D9E,0x5B3A:0xE69DA0,0x5B3B:0xE69D99,
0x5B3C:0xE69DA3,0x5B3D:0xE69DA4,0x5B3E:0xE69E89,0x5B3F:0xE69DB0,0x5B40:0xE69EA9,
0x5B41:0xE69DBC,0x5B42:0xE69DAA,0x5B43:0xE69E8C,0x5B44:0xE69E8B,0x5B45:0xE69EA6,
0x5B46:0xE69EA1,0x5B47:0xE69E85,0x5B48:0xE69EB7,0x5B49:0xE69FAF,0x5B4A:0xE69EB4,
0x5B4B:0xE69FAC,0x5B4C:0xE69EB3,0x5B4D:0xE69FA9,0x5B4E:0xE69EB8,0x5B4F:0xE69FA4,
0x5B50:0xE69F9E,0x5B51:0xE69F9D,0x5B52:0xE69FA2,0x5B53:0xE69FAE,0x5B54:0xE69EB9,
0x5B55:0xE69F8E,0x5B56:0xE69F86,0x5B57:0xE69FA7,0x5B58:0xE6AA9C,0x5B59:0xE6A09E,
0x5B5A:0xE6A186,0x5B5B:0xE6A0A9,0x5B5C:0xE6A180,0x5B5D:0xE6A18D,0x5B5E:0xE6A0B2,
0x5B5F:0xE6A18E,0x5B60:0xE6A2B3,0x5B61:0xE6A0AB,0x5B62:0xE6A199,0x5B63:0xE6A1A3,
0x5B64:0xE6A1B7,0x5B65:0xE6A1BF,0x5B66:0xE6A29F,0x5B67:0xE6A28F,0x5B68:0xE6A2AD,
0x5B69:0xE6A294,0x5B6A:0xE6A29D,0x5B6B:0xE6A29B,0x5B6C:0xE6A283,0x5B6D:0xE6AAAE,
0x5B6E:0xE6A2B9,0x5B6F:0xE6A1B4,0x5B70:0xE6A2B5,0x5B71:0xE6A2A0,0x5B72:0xE6A2BA,
0x5B73:0xE6A48F,0x5B74:0xE6A28D,0x5B75:0xE6A1BE,0x5B76:0xE6A481,0x5B77:0xE6A38A,
0x5B78:0xE6A488,0x5B79:0xE6A398,0x5B7A:0xE6A4A2,0x5B7B:0xE6A4A6,0x5B7C:0xE6A3A1,
0x5B7D:0xE6A48C,0x5B7E:0xE6A38D,0x5C21:0xE6A394,0x5C22:0xE6A3A7,0x5C23:0xE6A395,
0x5C24:0xE6A4B6,0x5C25:0xE6A492,0x5C26:0xE6A484,0x5C27:0xE6A397,0x5C28:0xE6A3A3,
0x5C29:0xE6A4A5,0x5C2A:0xE6A3B9,0x5C2B:0xE6A3A0,0x5C2C:0xE6A3AF,0x5C2D:0xE6A4A8,
0x5C2E:0xE6A4AA,0x5C2F:0xE6A49A,0x5C30:0xE6A4A3,0x5C31:0xE6A4A1,0x5C32:0xE6A386,
0x5C33:0xE6A5B9,0x5C34:0xE6A5B7,0x5C35:0xE6A59C,0x5C36:0xE6A5B8,0x5C37:0xE6A5AB,
0x5C38:0xE6A594,0x5C39:0xE6A5BE,0x5C3A:0xE6A5AE,0x5C3B:0xE6A4B9,0x5C3C:0xE6A5B4,
0x5C3D:0xE6A4BD,0x5C3E:0xE6A599,0x5C3F:0xE6A4B0,0x5C40:0xE6A5A1,0x5C41:0xE6A59E,
0x5C42:0xE6A59D,0x5C43:0xE6A681,0x5C44:0xE6A5AA,0x5C45:0xE6A6B2,0x5C46:0xE6A6AE,
0x5C47:0xE6A790,0x5C48:0xE6A6BF,0x5C49:0xE6A781,0x5C4A:0xE6A793,0x5C4B:0xE6A6BE,
0x5C4C:0xE6A78E,0x5C4D:0xE5AFA8,0x5C4E:0xE6A78A,0x5C4F:0xE6A79D,0x5C50:0xE6A6BB,
0x5C51:0xE6A783,0x5C52:0xE6A6A7,0x5C53:0xE6A8AE,0x5C54:0xE6A691,0x5C55:0xE6A6A0,
0x5C56:0xE6A69C,0x5C57:0xE6A695,0x5C58:0xE6A6B4,0x5C59:0xE6A79E,0x5C5A:0xE6A7A8,
0x5C5B:0xE6A882,0x5C5C:0xE6A89B,0x5C5D:0xE6A7BF,0x5C5E:0xE6AC8A,0x5C5F:0xE6A7B9,
0x5C60:0xE6A7B2,0x5C61:0xE6A7A7,0x5C62:0xE6A885,0x5C63:0xE6A6B1,0x5C64:0xE6A89E,
0x5C65:0xE6A7AD,0x5C66:0xE6A894,0x5C67:0xE6A7AB,0x5C68:0xE6A88A,0x5C69:0xE6A892,
0x5C6A:0xE6AB81,0x5C6B:0xE6A8A3,0x5C6C:0xE6A893,0x5C6D:0xE6A984,0x5C6E:0xE6A88C,
0x5C6F:0xE6A9B2,0x5C70:0xE6A8B6,0x5C71:0xE6A9B8,0x5C72:0xE6A987,0x5C73:0xE6A9A2,
0x5C74:0xE6A999,0x5C75:0xE6A9A6,0x5C76:0xE6A988,0x5C77:0xE6A8B8,0x5C78:0xE6A8A2,
0x5C79:0xE6AA90,0x5C7A:0xE6AA8D,0x5C7B:0xE6AAA0,0x5C7C:0xE6AA84,0x5C7D:0xE6AAA2,
0x5C7E:0xE6AAA3,0x5D21:0xE6AA97,0x5D22:0xE89897,0x5D23:0xE6AABB,0x5D24:0xE6AB83,
0x5D25:0xE6AB82,0x5D26:0xE6AAB8,0x5D27:0xE6AAB3,0x5D28:0xE6AAAC,0x5D29:0xE6AB9E,
0x5D2A:0xE6AB91,0x5D2B:0xE6AB9F,0x5D2C:0xE6AAAA,0x5D2D:0xE6AB9A,0x5D2E:0xE6ABAA,
0x5D2F:0xE6ABBB,0x5D30:0xE6AC85,0x5D31:0xE89896,0x5D32:0xE6ABBA,0x5D33:0xE6AC92,
0x5D34:0xE6AC96,0x5D35:0xE9ACB1,0x5D36:0xE6AC9F,0x5D37:0xE6ACB8,0x5D38:0xE6ACB7,
0x5D39:0xE79B9C,0x5D3A:0xE6ACB9,0x5D3B:0xE9A3AE,0x5D3C:0xE6AD87,0x5D3D:0xE6AD83,
0x5D3E:0xE6AD89,0x5D3F:0xE6AD90,0x5D40:0xE6AD99,0x5D41:0xE6AD94,0x5D42:0xE6AD9B,
0x5D43:0xE6AD9F,0x5D44:0xE6ADA1,0x5D45:0xE6ADB8,0x5D46:0xE6ADB9,0x5D47:0xE6ADBF,
0x5D48:0xE6AE80,0x5D49:0xE6AE84,0x5D4A:0xE6AE83,0x5D4B:0xE6AE8D,0x5D4C:0xE6AE98,
0x5D4D:0xE6AE95,0x5D4E:0xE6AE9E,0x5D4F:0xE6AEA4,0x5D50:0xE6AEAA,0x5D51:0xE6AEAB,
0x5D52:0xE6AEAF,0x5D53:0xE6AEB2,0x5D54:0xE6AEB1,0x5D55:0xE6AEB3,0x5D56:0xE6AEB7,
0x5D57:0xE6AEBC,0x5D58:0xE6AF86,0x5D59:0xE6AF8B,0x5D5A:0xE6AF93,0x5D5B:0xE6AF9F,
0x5D5C:0xE6AFAC,0x5D5D:0xE6AFAB,0x5D5E:0xE6AFB3,0x5D5F:0xE6AFAF,0x5D60:0xE9BABE,
0x5D61:0xE6B088,0x5D62:0xE6B093,0x5D63:0xE6B094,0x5D64:0xE6B09B,0x5D65:0xE6B0A4,
0x5D66:0xE6B0A3,0x5D67:0xE6B19E,0x5D68:0xE6B195,0x5D69:0xE6B1A2,0x5D6A:0xE6B1AA,
0x5D6B:0xE6B282,0x5D6C:0xE6B28D,0x5D6D:0xE6B29A,0x5D6E:0xE6B281,0x5D6F:0xE6B29B,
0x5D70:0xE6B1BE,0x5D71:0xE6B1A8,0x5D72:0xE6B1B3,0x5D73:0xE6B292,0x5D74:0xE6B290,
0x5D75:0xE6B384,0x5D76:0xE6B3B1,0x5D77:0xE6B393,0x5D78:0xE6B2BD,0x5D79:0xE6B397,
0x5D7A:0xE6B385,0x5D7B:0xE6B39D,0x5D7C:0xE6B2AE,0x5D7D:0xE6B2B1,0x5D7E:0xE6B2BE,
0x5E21:0xE6B2BA,0x5E22:0xE6B39B,0x5E23:0xE6B3AF,0x5E24:0xE6B399,0x5E25:0xE6B3AA,
0x5E26:0xE6B49F,0x5E27:0xE8A18D,0x5E28:0xE6B4B6,0x5E29:0xE6B4AB,0x5E2A:0xE6B4BD,
0x5E2B:0xE6B4B8,0x5E2C:0xE6B499,0x5E2D:0xE6B4B5,0x5E2E:0xE6B4B3,0x5E2F:0xE6B492,
0x5E30:0xE6B48C,0x5E31:0xE6B5A3,0x5E32:0xE6B693,0x5E33:0xE6B5A4,0x5E34:0xE6B59A,
0x5E35:0xE6B5B9,0x5E36:0xE6B599,0x5E37:0xE6B68E,0x5E38:0xE6B695,0x5E39:0xE6BFA4,
0x5E3A:0xE6B685,0x5E3B:0xE6B7B9,0x5E3C:0xE6B895,0x5E3D:0xE6B88A,0x5E3E:0xE6B6B5,
0x5E3F:0xE6B787,0x5E40:0xE6B7A6,0x5E41:0xE6B6B8,0x5E42:0xE6B786,0x5E43:0xE6B7AC,
0x5E44:0xE6B79E,0x5E45:0xE6B78C,0x5E46:0xE6B7A8,0x5E47:0xE6B792,0x5E48:0xE6B785,
0x5E49:0xE6B7BA,0x5E4A:0xE6B799,0x5E4B:0xE6B7A4,0x5E4C:0xE6B795,0x5E4D:0xE6B7AA,
0x5E4E:0xE6B7AE,0x5E4F:0xE6B8AD,0x5E50:0xE6B9AE,0x5E51:0xE6B8AE,0x5E52:0xE6B899,
0x5E53:0xE6B9B2,0x5E54:0xE6B99F,0x5E55:0xE6B8BE,0x5E56:0xE6B8A3,0x5E57:0xE6B9AB,
0x5E58:0xE6B8AB,0x5E59:0xE6B9B6,0x5E5A:0xE6B98D,0x5E5B:0xE6B89F,0x5E5C:0xE6B983,
0x5E5D:0xE6B8BA,0x5E5E:0xE6B98E,0x5E5F:0xE6B8A4,0x5E60:0xE6BBBF,0x5E61:0xE6B89D,
0x5E62:0xE6B8B8,0x5E63:0xE6BA82,0x5E64:0xE6BAAA,0x5E65:0xE6BA98,0x5E66:0xE6BB89,
0x5E67:0xE6BAB7,0x5E68:0xE6BB93,0x5E69:0xE6BABD,0x5E6A:0xE6BAAF,0x5E6B:0xE6BB84,
0x5E6C:0xE6BAB2,0x5E6D:0xE6BB94,0x5E6E:0xE6BB95,0x5E6F:0xE6BA8F,0x5E70:0xE6BAA5,
0x5E71:0xE6BB82,0x5E72:0xE6BA9F,0x5E73:0xE6BD81,0x5E74:0xE6BC91,0x5E75:0xE7818C,
0x5E76:0xE6BBAC,0x5E77:0xE6BBB8,0x5E78:0xE6BBBE,0x5E79:0xE6BCBF,0x5E7A:0xE6BBB2,
0x5E7B:0xE6BCB1,0x5E7C:0xE6BBAF,0x5E7D:0xE6BCB2,0x5E7E:0xE6BB8C,0x5F21:0xE6BCBE,
0x5F22:0xE6BC93,0x5F23:0xE6BBB7,0x5F24:0xE6BE86,0x5F25:0xE6BDBA,0x5F26:0xE6BDB8,
0x5F27:0xE6BE81,0x5F28:0xE6BE80,0x5F29:0xE6BDAF,0x5F2A:0xE6BD9B,0x5F2B:0xE6BFB3,
0x5F2C:0xE6BDAD,0x5F2D:0xE6BE82,0x5F2E:0xE6BDBC,0x5F2F:0xE6BD98,0x5F30:0xE6BE8E,
0x5F31:0xE6BE91,0x5F32:0xE6BF82,0x5F33:0xE6BDA6,0x5F34:0xE6BEB3,0x5F35:0xE6BEA3,
0x5F36:0xE6BEA1,0x5F37:0xE6BEA4,0x5F38:0xE6BEB9,0x5F39:0xE6BF86,0x5F3A:0xE6BEAA,
0x5F3B:0xE6BF9F,0x5F3C:0xE6BF95,0x5F3D:0xE6BFAC,0x5F3E:0xE6BF94,0x5F3F:0xE6BF98,
0x5F40:0xE6BFB1,0x5F41:0xE6BFAE,0x5F42:0xE6BF9B,0x5F43:0xE78089,0x5F44:0xE7808B,
0x5F45:0xE6BFBA,0x5F46:0xE78091,0x5F47:0xE78081,0x5F48:0xE7808F,0x5F49:0xE6BFBE,
0x5F4A:0xE7809B,0x5F4B:0xE7809A,0x5F4C:0xE6BDB4,0x5F4D:0xE7809D,0x5F4E:0xE78098,
0x5F4F:0xE7809F,0x5F50:0xE780B0,0x5F51:0xE780BE,0x5F52:0xE780B2,0x5F53:0xE78191,
0x5F54:0xE781A3,0x5F55:0xE78299,0x5F56:0xE78292,0x5F57:0xE782AF,0x5F58:0xE783B1,
0x5F59:0xE782AC,0x5F5A:0xE782B8,0x5F5B:0xE782B3,0x5F5C:0xE782AE,0x5F5D:0xE7839F,
0x5F5E:0xE7838B,0x5F5F:0xE7839D,0x5F60:0xE78399,0x5F61:0xE78489,0x5F62:0xE783BD,
0x5F63:0xE7849C,0x5F64:0xE78499,0x5F65:0xE785A5,0x5F66:0xE78595,0x5F67:0xE78688,
0x5F68:0xE785A6,0x5F69:0xE785A2,0x5F6A:0xE7858C,0x5F6B:0xE78596,0x5F6C:0xE785AC,
0x5F6D:0xE7868F,0x5F6E:0xE787BB,0x5F6F:0xE78684,0x5F70:0xE78695,0x5F71:0xE786A8,
0x5F72:0xE786AC,0x5F73:0xE78797,0x5F74:0xE786B9,0x5F75:0xE786BE,0x5F76:0xE78792,
0x5F77:0xE78789,0x5F78:0xE78794,0x5F79:0xE7878E,0x5F7A:0xE787A0,0x5F7B:0xE787AC,
0x5F7C:0xE787A7,0x5F7D:0xE787B5,0x5F7E:0xE787BC,0x6021:0xE787B9,0x6022:0xE787BF,
0x6023:0xE7888D,0x6024:0xE78890,0x6025:0xE7889B,0x6026:0xE788A8,0x6027:0xE788AD,
0x6028:0xE788AC,0x6029:0xE788B0,0x602A:0xE788B2,0x602B:0xE788BB,0x602C:0xE788BC,
0x602D:0xE788BF,0x602E:0xE78980,0x602F:0xE78986,0x6030:0xE7898B,0x6031:0xE78998,
0x6032:0xE789B4,0x6033:0xE789BE,0x6034:0xE78A82,0x6035:0xE78A81,0x6036:0xE78A87,
0x6037:0xE78A92,0x6038:0xE78A96,0x6039:0xE78AA2,0x603A:0xE78AA7,0x603B:0xE78AB9,
0x603C:0xE78AB2,0x603D:0xE78B83,0x603E:0xE78B86,0x603F:0xE78B84,0x6040:0xE78B8E,
0x6041:0xE78B92,0x6042:0xE78BA2,0x6043:0xE78BA0,0x6044:0xE78BA1,0x6045:0xE78BB9,
0x6046:0xE78BB7,0x6047:0xE5808F,0x6048:0xE78C97,0x6049:0xE78C8A,0x604A:0xE78C9C,
0x604B:0xE78C96,0x604C:0xE78C9D,0x604D:0xE78CB4,0x604E:0xE78CAF,0x604F:0xE78CA9,
0x6050:0xE78CA5,0x6051:0xE78CBE,0x6052:0xE78D8E,0x6053:0xE78D8F,0x6054:0xE9BB98,
0x6055:0xE78D97,0x6056:0xE78DAA,0x6057:0xE78DA8,0x6058:0xE78DB0,0x6059:0xE78DB8,
0x605A:0xE78DB5,0x605B:0xE78DBB,0x605C:0xE78DBA,0x605D:0xE78F88,0x605E:0xE78EB3,
0x605F:0xE78F8E,0x6060:0xE78EBB,0x6061:0xE78F80,0x6062:0xE78FA5,0x6063:0xE78FAE,
0x6064:0xE78F9E,0x6065:0xE792A2,0x6066:0xE79085,0x6067:0xE791AF,0x6068:0xE790A5,
0x6069:0xE78FB8,0x606A:0xE790B2,0x606B:0xE790BA,0x606C:0xE79195,0x606D:0xE790BF,
0x606E:0xE7919F,0x606F:0xE79199,0x6070:0xE79181,0x6071:0xE7919C,0x6072:0xE791A9,
0x6073:0xE791B0,0x6074:0xE791A3,0x6075:0xE791AA,0x6076:0xE791B6,0x6077:0xE791BE,
0x6078:0xE7928B,0x6079:0xE7929E,0x607A:0xE792A7,0x607B:0xE7938A,0x607C:0xE7938F,
0x607D:0xE79394,0x607E:0xE78FB1,0x6121:0xE793A0,0x6122:0xE793A3,0x6123:0xE793A7,
0x6124:0xE793A9,0x6125:0xE793AE,0x6126:0xE793B2,0x6127:0xE793B0,0x6128:0xE793B1,
0x6129:0xE793B8,0x612A:0xE793B7,0x612B:0xE79484,0x612C:0xE79483,0x612D:0xE79485,
0x612E:0xE7948C,0x612F:0xE7948E,0x6130:0xE7948D,0x6131:0xE79495,0x6132:0xE79493,
0x6133:0xE7949E,0x6134:0xE794A6,0x6135:0xE794AC,0x6136:0xE794BC,0x6137:0xE79584,
0x6138:0xE7958D,0x6139:0xE7958A,0x613A:0xE79589,0x613B:0xE7959B,0x613C:0xE79586,
0x613D:0xE7959A,0x613E:0xE795A9,0x613F:0xE795A4,0x6140:0xE795A7,0x6141:0xE795AB,
0x6142:0xE795AD,0x6143:0xE795B8,0x6144:0xE795B6,0x6145:0xE79686,0x6146:0xE79687,
0x6147:0xE795B4,0x6148:0xE7968A,0x6149:0xE79689,0x614A:0xE79682,0x614B:0xE79694,
0x614C:0xE7969A,0x614D:0xE7969D,0x614E:0xE796A5,0x614F:0xE796A3,0x6150:0xE79782,
0x6151:0xE796B3,0x6152:0xE79783,0x6153:0xE796B5,0x6154:0xE796BD,0x6155:0xE796B8,
0x6156:0xE796BC,0x6157:0xE796B1,0x6158:0xE7978D,0x6159:0xE7978A,0x615A:0xE79792,
0x615B:0xE79799,0x615C:0xE797A3,0x615D:0xE7979E,0x615E:0xE797BE,0x615F:0xE797BF,
0x6160:0xE797BC,0x6161:0xE79881,0x6162:0xE797B0,0x6163:0xE797BA,0x6164:0xE797B2,
0x6165:0xE797B3,0x6166:0xE7988B,0x6167:0xE7988D,0x6168:0xE79889,0x6169:0xE7989F,
0x616A:0xE798A7,0x616B:0xE798A0,0x616C:0xE798A1,0x616D:0xE798A2,0x616E:0xE798A4,
0x616F:0xE798B4,0x6170:0xE798B0,0x6171:0xE798BB,0x6172:0xE79987,0x6173:0xE79988,
0x6174:0xE79986,0x6175:0xE7999C,0x6176:0xE79998,0x6177:0xE799A1,0x6178:0xE799A2,
0x6179:0xE799A8,0x617A:0xE799A9,0x617B:0xE799AA,0x617C:0xE799A7,0x617D:0xE799AC,
0x617E:0xE799B0,0x6221:0xE799B2,0x6222:0xE799B6,0x6223:0xE799B8,0x6224:0xE799BC,
0x6225:0xE79A80,0x6226:0xE79A83,0x6227:0xE79A88,0x6228:0xE79A8B,0x6229:0xE79A8E,
0x622A:0xE79A96,0x622B:0xE79A93,0x622C:0xE79A99,0x622D:0xE79A9A,0x622E:0xE79AB0,
0x622F:0xE79AB4,0x6230:0xE79AB8,0x6231:0xE79AB9,0x6232:0xE79ABA,0x6233:0xE79B82,
0x6234:0xE79B8D,0x6235:0xE79B96,0x6236:0xE79B92,0x6237:0xE79B9E,0x6238:0xE79BA1,
0x6239:0xE79BA5,0x623A:0xE79BA7,0x623B:0xE79BAA,0x623C:0xE898AF,0x623D:0xE79BBB,
0x623E:0xE79C88,0x623F:0xE79C87,0x6240:0xE79C84,0x6241:0xE79CA9,0x6242:0xE79CA4,
0x6243:0xE79C9E,0x6244:0xE79CA5,0x6245:0xE79CA6,0x6246:0xE79C9B,0x6247:0xE79CB7,
0x6248:0xE79CB8,0x6249:0xE79D87,0x624A:0xE79D9A,0x624B:0xE79DA8,0x624C:0xE79DAB,
0x624D:0xE79D9B,0x624E:0xE79DA5,0x624F:0xE79DBF,0x6250:0xE79DBE,0x6251:0xE79DB9,
0x6252:0xE79E8E,0x6253:0xE79E8B,0x6254:0xE79E91,0x6255:0xE79EA0,0x6256:0xE79E9E,
0x6257:0xE79EB0,0x6258:0xE79EB6,0x6259:0xE79EB9,0x625A:0xE79EBF,0x625B:0xE79EBC,
0x625C:0xE79EBD,0x625D:0xE79EBB,0x625E:0xE79F87,0x625F:0xE79F8D,0x6260:0xE79F97,
0x6261:0xE79F9A,0x6262:0xE79F9C,0x6263:0xE79FA3,0x6264:0xE79FAE,0x6265:0xE79FBC,
0x6266:0xE7A08C,0x6267:0xE7A092,0x6268:0xE7A4A6,0x6269:0xE7A0A0,0x626A:0xE7A4AA,
0x626B:0xE7A185,0x626C:0xE7A28E,0x626D:0xE7A1B4,0x626E:0xE7A286,0x626F:0xE7A1BC,
0x6270:0xE7A29A,0x6271:0xE7A28C,0x6272:0xE7A2A3,0x6273:0xE7A2B5,0x6274:0xE7A2AA,
0x6275:0xE7A2AF,0x6276:0xE7A391,0x6277:0xE7A386,0x6278:0xE7A38B,0x6279:0xE7A394,
0x627A:0xE7A2BE,0x627B:0xE7A2BC,0x627C:0xE7A385,0x627D:0xE7A38A,0x627E:0xE7A3AC,
0x6321:0xE7A3A7,0x6322:0xE7A39A,0x6323:0xE7A3BD,0x6324:0xE7A3B4,0x6325:0xE7A487,
0x6326:0xE7A492,0x6327:0xE7A491,0x6328:0xE7A499,0x6329:0xE7A4AC,0x632A:0xE7A4AB,
0x632B:0xE7A580,0x632C:0xE7A5A0,0x632D:0xE7A597,0x632E:0xE7A59F,0x632F:0xE7A59A,
0x6330:0xE7A595,0x6331:0xE7A593,0x6332:0xE7A5BA,0x6333:0xE7A5BF,0x6334:0xE7A68A,
0x6335:0xE7A69D,0x6336:0xE7A6A7,0x6337:0xE9BD8B,0x6338:0xE7A6AA,0x6339:0xE7A6AE,
0x633A:0xE7A6B3,0x633B:0xE7A6B9,0x633C:0xE7A6BA,0x633D:0xE7A789,0x633E:0xE7A795,
0x633F:0xE7A7A7,0x6340:0xE7A7AC,0x6341:0xE7A7A1,0x6342:0xE7A7A3,0x6343:0xE7A888,
0x6344:0xE7A88D,0x6345:0xE7A898,0x6346:0xE7A899,0x6347:0xE7A8A0,0x6348:0xE7A89F,
0x6349:0xE7A680,0x634A:0xE7A8B1,0x634B:0xE7A8BB,0x634C:0xE7A8BE,0x634D:0xE7A8B7,
0x634E:0xE7A983,0x634F:0xE7A997,0x6350:0xE7A989,0x6351:0xE7A9A1,0x6352:0xE7A9A2,
0x6353:0xE7A9A9,0x6354:0xE9BE9D,0x6355:0xE7A9B0,0x6356:0xE7A9B9,0x6357:0xE7A9BD,
0x6358:0xE7AA88,0x6359:0xE7AA97,0x635A:0xE7AA95,0x635B:0xE7AA98,0x635C:0xE7AA96,
0x635D:0xE7AAA9,0x635E:0xE7AB88,0x635F:0xE7AAB0,0x6360:0xE7AAB6,0x6361:0xE7AB85,
0x6362:0xE7AB84,0x6363:0xE7AABF,0x6364:0xE98283,0x6365:0xE7AB87,0x6366:0xE7AB8A,
0x6367:0xE7AB8D,0x6368:0xE7AB8F,0x6369:0xE7AB95,0x636A:0xE7AB93,0x636B:0xE7AB99,
0x636C:0xE7AB9A,0x636D:0xE7AB9D,0x636E:0xE7ABA1,0x636F:0xE7ABA2,0x6370:0xE7ABA6,
0x6371:0xE7ABAD,0x6372:0xE7ABB0,0x6373:0xE7AC82,0x6374:0xE7AC8F,0x6375:0xE7AC8A,
0x6376:0xE7AC86,0x6377:0xE7ACB3,0x6378:0xE7AC98,0x6379:0xE7AC99,0x637A:0xE7AC9E,
0x637B:0xE7ACB5,0x637C:0xE7ACA8,0x637D:0xE7ACB6,0x637E:0xE7AD90,0x6421:0xE7ADBA,
0x6422:0xE7AC84,0x6423:0xE7AD8D,0x6424:0xE7AC8B,0x6425:0xE7AD8C,0x6426:0xE7AD85,
0x6427:0xE7ADB5,0x6428:0xE7ADA5,0x6429:0xE7ADB4,0x642A:0xE7ADA7,0x642B:0xE7ADB0,
0x642C:0xE7ADB1,0x642D:0xE7ADAC,0x642E:0xE7ADAE,0x642F:0xE7AE9D,0x6430:0xE7AE98,
0x6431:0xE7AE9F,0x6432:0xE7AE8D,0x6433:0xE7AE9C,0x6434:0xE7AE9A,0x6435:0xE7AE8B,
0x6436:0xE7AE92,0x6437:0xE7AE8F,0x6438:0xE7AD9D,0x6439:0xE7AE99,0x643A:0xE7AF8B,
0x643B:0xE7AF81,0x643C:0xE7AF8C,0x643D:0xE7AF8F,0x643E:0xE7AEB4,0x643F:0xE7AF86,
0x6440:0xE7AF9D,0x6441:0xE7AFA9,0x6442:0xE7B091,0x6443:0xE7B094,0x6444:0xE7AFA6,
0x6445:0xE7AFA5,0x6446:0xE7B1A0,0x6447:0xE7B080,0x6448:0xE7B087,0x6449:0xE7B093,
0x644A:0xE7AFB3,0x644B:0xE7AFB7,0x644C:0xE7B097,0x644D:0xE7B08D,0x644E:0xE7AFB6,
0x644F:0xE7B0A3,0x6450:0xE7B0A7,0x6451:0xE7B0AA,0x6452:0xE7B09F,0x6453:0xE7B0B7,
0x6454:0xE7B0AB,0x6455:0xE7B0BD,0x6456:0xE7B18C,0x6457:0xE7B183,0x6458:0xE7B194,
0x6459:0xE7B18F,0x645A:0xE7B180,0x645B:0xE7B190,0x645C:0xE7B198,0x645D:0xE7B19F,
0x645E:0xE7B1A4,0x645F:0xE7B196,0x6460:0xE7B1A5,0x6461:0xE7B1AC,0x6462:0xE7B1B5,
0x6463:0xE7B283,0x6464:0xE7B290,0x6465:0xE7B2A4,0x6466:0xE7B2AD,0x6467:0xE7B2A2,
0x6468:0xE7B2AB,0x6469:0xE7B2A1,0x646A:0xE7B2A8,0x646B:0xE7B2B3,0x646C:0xE7B2B2,
0x646D:0xE7B2B1,0x646E:0xE7B2AE,0x646F:0xE7B2B9,0x6470:0xE7B2BD,0x6471:0xE7B380,
0x6472:0xE7B385,0x6473:0xE7B382,0x6474:0xE7B398,0x6475:0xE7B392,0x6476:0xE7B39C,
0x6477:0xE7B3A2,0x6478:0xE9ACBB,0x6479:0xE7B3AF,0x647A:0xE7B3B2,0x647B:0xE7B3B4,
0x647C:0xE7B3B6,0x647D:0xE7B3BA,0x647E:0xE7B486,0x6521:0xE7B482,0x6522:0xE7B49C,
0x6523:0xE7B495,0x6524:0xE7B48A,0x6525:0xE7B585,0x6526:0xE7B58B,0x6527:0xE7B4AE,
0x6528:0xE7B4B2,0x6529:0xE7B4BF,0x652A:0xE7B4B5,0x652B:0xE7B586,0x652C:0xE7B5B3,
0x652D:0xE7B596,0x652E:0xE7B58E,0x652F:0xE7B5B2,0x6530:0xE7B5A8,0x6531:0xE7B5AE,
0x6532:0xE7B58F,0x6533:0xE7B5A3,0x6534:0xE7B693,0x6535:0xE7B689,0x6536:0xE7B59B,
0x6537:0xE7B68F,0x6538:0xE7B5BD,0x6539:0xE7B69B,0x653A:0xE7B6BA,0x653B:0xE7B6AE,
0x653C:0xE7B6A3,0x653D:0xE7B6B5,0x653E:0xE7B787,0x653F:0xE7B6BD,0x6540:0xE7B6AB,
0x6541:0xE7B8BD,0x6542:0xE7B6A2,0x6543:0xE7B6AF,0x6544:0xE7B79C,0x6545:0xE7B6B8,
0x6546:0xE7B69F,0x6547:0xE7B6B0,0x6548:0xE7B798,0x6549:0xE7B79D,0x654A:0xE7B7A4,
0x654B:0xE7B79E,0x654C:0xE7B7BB,0x654D:0xE7B7B2,0x654E:0xE7B7A1,0x654F:0xE7B885,
0x6550:0xE7B88A,0x6551:0xE7B8A3,0x6552:0xE7B8A1,0x6553:0xE7B892,0x6554:0xE7B8B1,
0x6555:0xE7B89F,0x6556:0xE7B889,0x6557:0xE7B88B,0x6558:0xE7B8A2,0x6559:0xE7B986,
0x655A:0xE7B9A6,0x655B:0xE7B8BB,0x655C:0xE7B8B5,0x655D:0xE7B8B9,0x655E:0xE7B983,
0x655F:0xE7B8B7,0x6560:0xE7B8B2,0x6561:0xE7B8BA,0x6562:0xE7B9A7,0x6563:0xE7B99D,
0x6564:0xE7B996,0x6565:0xE7B99E,0x6566:0xE7B999,0x6567:0xE7B99A,0x6568:0xE7B9B9,
0x6569:0xE7B9AA,0x656A:0xE7B9A9,0x656B:0xE7B9BC,0x656C:0xE7B9BB,0x656D:0xE7BA83,
0x656E:0xE7B795,0x656F:0xE7B9BD,0x6570:0xE8BEAE,0x6571:0xE7B9BF,0x6572:0xE7BA88,
0x6573:0xE7BA89,0x6574:0xE7BA8C,0x6575:0xE7BA92,0x6576:0xE7BA90,0x6577:0xE7BA93,
0x6578:0xE7BA94,0x6579:0xE7BA96,0x657A:0xE7BA8E,0x657B:0xE7BA9B,0x657C:0xE7BA9C,
0x657D:0xE7BCB8,0x657E:0xE7BCBA,0x6621:0xE7BD85,0x6622:0xE7BD8C,0x6623:0xE7BD8D,
0x6624:0xE7BD8E,0x6625:0xE7BD90,0x6626:0xE7BD91,0x6627:0xE7BD95,0x6628:0xE7BD94,
0x6629:0xE7BD98,0x662A:0xE7BD9F,0x662B:0xE7BDA0,0x662C:0xE7BDA8,0x662D:0xE7BDA9,
0x662E:0xE7BDA7,0x662F:0xE7BDB8,0x6630:0xE7BE82,0x6631:0xE7BE86,0x6632:0xE7BE83,
0x6633:0xE7BE88,0x6634:0xE7BE87,0x6635:0xE7BE8C,0x6636:0xE7BE94,0x6637:0xE7BE9E,
0x6638:0xE7BE9D,0x6639:0xE7BE9A,0x663A:0xE7BEA3,0x663B:0xE7BEAF,0x663C:0xE7BEB2,
0x663D:0xE7BEB9,0x663E:0xE7BEAE,0x663F:0xE7BEB6,0x6640:0xE7BEB8,0x6641:0xE8ADB1,
0x6642:0xE7BF85,0x6643:0xE7BF86,0x6644:0xE7BF8A,0x6645:0xE7BF95,0x6646:0xE7BF94,
0x6647:0xE7BFA1,0x6648:0xE7BFA6,0x6649:0xE7BFA9,0x664A:0xE7BFB3,0x664B:0xE7BFB9,
0x664C:0xE9A39C,0x664D:0xE88086,0x664E:0xE88084,0x664F:0xE8808B,0x6650:0xE88092,
0x6651:0xE88098,0x6652:0xE88099,0x6653:0xE8809C,0x6654:0xE880A1,0x6655:0xE880A8,
0x6656:0xE880BF,0x6657:0xE880BB,0x6658:0xE8818A,0x6659:0xE88186,0x665A:0xE88192,
0x665B:0xE88198,0x665C:0xE8819A,0x665D:0xE8819F,0x665E:0xE881A2,0x665F:0xE881A8,
0x6660:0xE881B3,0x6661:0xE881B2,0x6662:0xE881B0,0x6663:0xE881B6,0x6664:0xE881B9,
0x6665:0xE881BD,0x6666:0xE881BF,0x6667:0xE88284,0x6668:0xE88286,0x6669:0xE88285,
0x666A:0xE8829B,0x666B:0xE88293,0x666C:0xE8829A,0x666D:0xE882AD,0x666E:0xE58690,
0x666F:0xE882AC,0x6670:0xE8839B,0x6671:0xE883A5,0x6672:0xE88399,0x6673:0xE8839D,
0x6674:0xE88384,0x6675:0xE8839A,0x6676:0xE88396,0x6677:0xE88489,0x6678:0xE883AF,
0x6679:0xE883B1,0x667A:0xE8849B,0x667B:0xE884A9,0x667C:0xE884A3,0x667D:0xE884AF,
0x667E:0xE8858B,0x6721:0xE99A8B,0x6722:0xE88586,0x6723:0xE884BE,0x6724:0xE88593,
0x6725:0xE88591,0x6726:0xE883BC,0x6727:0xE885B1,0x6728:0xE885AE,0x6729:0xE885A5,
0x672A:0xE885A6,0x672B:0xE885B4,0x672C:0xE88683,0x672D:0xE88688,0x672E:0xE8868A,
0x672F:0xE88680,0x6730:0xE88682,0x6731:0xE886A0,0x6732:0xE88695,0x6733:0xE886A4,
0x6734:0xE886A3,0x6735:0xE8859F,0x6736:0xE88693,0x6737:0xE886A9,0x6738:0xE886B0,
0x6739:0xE886B5,0x673A:0xE886BE,0x673B:0xE886B8,0x673C:0xE886BD,0x673D:0xE88780,
0x673E:0xE88782,0x673F:0xE886BA,0x6740:0xE88789,0x6741:0xE8878D,0x6742:0xE88791,
0x6743:0xE88799,0x6744:0xE88798,0x6745:0xE88788,0x6746:0xE8879A,0x6747:0xE8879F,
0x6748:0xE887A0,0x6749:0xE887A7,0x674A:0xE887BA,0x674B:0xE887BB,0x674C:0xE887BE,
0x674D:0xE88881,0x674E:0xE88882,0x674F:0xE88885,0x6750:0xE88887,0x6751:0xE8888A,
0x6752:0xE8888D,0x6753:0xE88890,0x6754:0xE88896,0x6755:0xE888A9,0x6756:0xE888AB,
0x6757:0xE888B8,0x6758:0xE888B3,0x6759:0xE88980,0x675A:0xE88999,0x675B:0xE88998,
0x675C:0xE8899D,0x675D:0xE8899A,0x675E:0xE8899F,0x675F:0xE889A4,0x6760:0xE889A2,
0x6761:0xE889A8,0x6762:0xE889AA,0x6763:0xE889AB,0x6764:0xE888AE,0x6765:0xE889B1,
0x6766:0xE889B7,0x6767:0xE889B8,0x6768:0xE889BE,0x6769:0xE88A8D,0x676A:0xE88A92,
0x676B:0xE88AAB,0x676C:0xE88A9F,0x676D:0xE88ABB,0x676E:0xE88AAC,0x676F:0xE88BA1,
0x6770:0xE88BA3,0x6771:0xE88B9F,0x6772:0xE88B92,0x6773:0xE88BB4,0x6774:0xE88BB3,
0x6775:0xE88BBA,0x6776:0xE88E93,0x6777:0xE88C83,0x6778:0xE88BBB,0x6779:0xE88BB9,
0x677A:0xE88B9E,0x677B:0xE88C86,0x677C:0xE88B9C,0x677D:0xE88C89,0x677E:0xE88B99,
0x6821:0xE88CB5,0x6822:0xE88CB4,0x6823:0xE88C96,0x6824:0xE88CB2,0x6825:0xE88CB1,
0x6826:0xE88D80,0x6827:0xE88CB9,0x6828:0xE88D90,0x6829:0xE88D85,0x682A:0xE88CAF,
0x682B:0xE88CAB,0x682C:0xE88C97,0x682D:0xE88C98,0x682E:0xE88E85,0x682F:0xE88E9A,
0x6830:0xE88EAA,0x6831:0xE88E9F,0x6832:0xE88EA2,0x6833:0xE88E96,0x6834:0xE88CA3,
0x6835:0xE88E8E,0x6836:0xE88E87,0x6837:0xE88E8A,0x6838:0xE88DBC,0x6839:0xE88EB5,
0x683A:0xE88DB3,0x683B:0xE88DB5,0x683C:0xE88EA0,0x683D:0xE88E89,0x683E:0xE88EA8,
0x683F:0xE88FB4,0x6840:0xE89093,0x6841:0xE88FAB,0x6842:0xE88F8E,0x6843:0xE88FBD,
0x6844:0xE89083,0x6845:0xE88F98,0x6846:0xE8908B,0x6847:0xE88F81,0x6848:0xE88FB7,
0x6849:0xE89087,0x684A:0xE88FA0,0x684B:0xE88FB2,0x684C:0xE8908D,0x684D:0xE890A2,
0x684E:0xE890A0,0x684F:0xE88EBD,0x6850:0xE890B8,0x6851:0xE89486,0x6852:0xE88FBB,
0x6853:0xE891AD,0x6854:0xE890AA,0x6855:0xE890BC,0x6856:0xE8959A,0x6857:0xE89284,
0x6858:0xE891B7,0x6859:0xE891AB,0x685A:0xE892AD,0x685B:0xE891AE,0x685C:0xE89282,
0x685D:0xE891A9,0x685E:0xE89186,0x685F:0xE890AC,0x6860:0xE891AF,0x6861:0xE891B9,
0x6862:0xE890B5,0x6863:0xE8938A,0x6864:0xE891A2,0x6865:0xE892B9,0x6866:0xE892BF,
0x6867:0xE8929F,0x6868:0xE89399,0x6869:0xE8938D,0x686A:0xE892BB,0x686B:0xE8939A,
0x686C:0xE89390,0x686D:0xE89381,0x686E:0xE89386,0x686F:0xE89396,0x6870:0xE892A1,
0x6871:0xE894A1,0x6872:0xE893BF,0x6873:0xE893B4,0x6874:0xE89497,0x6875:0xE89498,
0x6876:0xE894AC,0x6877:0xE8949F,0x6878:0xE89495,0x6879:0xE89494,0x687A:0xE893BC,
0x687B:0xE89580,0x687C:0xE895A3,0x687D:0xE89598,0x687E:0xE89588,0x6921:0xE89581,
0x6922:0xE89882,0x6923:0xE8958B,0x6924:0xE89595,0x6925:0xE89680,0x6926:0xE896A4,
0x6927:0xE89688,0x6928:0xE89691,0x6929:0xE8968A,0x692A:0xE896A8,0x692B:0xE895AD,
0x692C:0xE89694,0x692D:0xE8969B,0x692E:0xE897AA,0x692F:0xE89687,0x6930:0xE8969C,
0x6931:0xE895B7,0x6932:0xE895BE,0x6933:0xE89690,0x6934:0xE89789,0x6935:0xE896BA,
0x6936:0xE8978F,0x6937:0xE896B9,0x6938:0xE89790,0x6939:0xE89795,0x693A:0xE8979D,
0x693B:0xE897A5,0x693C:0xE8979C,0x693D:0xE897B9,0x693E:0xE8988A,0x693F:0xE89893,
0x6940:0xE8988B,0x6941:0xE897BE,0x6942:0xE897BA,0x6943:0xE89886,0x6944:0xE898A2,
0x6945:0xE8989A,0x6946:0xE898B0,0x6947:0xE898BF,0x6948:0xE8998D,0x6949:0xE4B995,
0x694A:0xE89994,0x694B:0xE8999F,0x694C:0xE899A7,0x694D:0xE899B1,0x694E:0xE89A93,
0x694F:0xE89AA3,0x6950:0xE89AA9,0x6951:0xE89AAA,0x6952:0xE89A8B,0x6953:0xE89A8C,
0x6954:0xE89AB6,0x6955:0xE89AAF,0x6956:0xE89B84,0x6957:0xE89B86,0x6958:0xE89AB0,
0x6959:0xE89B89,0x695A:0xE8A0A3,0x695B:0xE89AAB,0x695C:0xE89B94,0x695D:0xE89B9E,
0x695E:0xE89BA9,0x695F:0xE89BAC,0x6960:0xE89B9F,0x6961:0xE89B9B,0x6962:0xE89BAF,
0x6963:0xE89C92,0x6964:0xE89C86,0x6965:0xE89C88,0x6966:0xE89C80,0x6967:0xE89C83,
0x6968:0xE89BBB,0x6969:0xE89C91,0x696A:0xE89C89,0x696B:0xE89C8D,0x696C:0xE89BB9,
0x696D:0xE89C8A,0x696E:0xE89CB4,0x696F:0xE89CBF,0x6970:0xE89CB7,0x6971:0xE89CBB,
0x6972:0xE89CA5,0x6973:0xE89CA9,0x6974:0xE89C9A,0x6975:0xE89DA0,0x6976:0xE89D9F,
0x6977:0xE89DB8,0x6978:0xE89D8C,0x6979:0xE89D8E,0x697A:0xE89DB4,0x697B:0xE89D97,
0x697C:0xE89DA8,0x697D:0xE89DAE,0x697E:0xE89D99,0x6A21:0xE89D93,0x6A22:0xE89DA3,
0x6A23:0xE89DAA,0x6A24:0xE8A085,0x6A25:0xE89EA2,0x6A26:0xE89E9F,0x6A27:0xE89E82,
0x6A28:0xE89EAF,0x6A29:0xE89F8B,0x6A2A:0xE89EBD,0x6A2B:0xE89F80,0x6A2C:0xE89F90,
0x6A2D:0xE99B96,0x6A2E:0xE89EAB,0x6A2F:0xE89F84,0x6A30:0xE89EB3,0x6A31:0xE89F87,
0x6A32:0xE89F86,0x6A33:0xE89EBB,0x6A34:0xE89FAF,0x6A35:0xE89FB2,0x6A36:0xE89FA0,
0x6A37:0xE8A08F,0x6A38:0xE8A08D,0x6A39:0xE89FBE,0x6A3A:0xE89FB6,0x6A3B:0xE89FB7,
0x6A3C:0xE8A08E,0x6A3D:0xE89F92,0x6A3E:0xE8A091,0x6A3F:0xE8A096,0x6A40:0xE8A095,
0x6A41:0xE8A0A2,0x6A42:0xE8A0A1,0x6A43:0xE8A0B1,0x6A44:0xE8A0B6,0x6A45:0xE8A0B9,
0x6A46:0xE8A0A7,0x6A47:0xE8A0BB,0x6A48:0xE8A184,0x6A49:0xE8A182,0x6A4A:0xE8A192,
0x6A4B:0xE8A199,0x6A4C:0xE8A19E,0x6A4D:0xE8A1A2,0x6A4E:0xE8A1AB,0x6A4F:0xE8A281,
0x6A50:0xE8A1BE,0x6A51:0xE8A29E,0x6A52:0xE8A1B5,0x6A53:0xE8A1BD,0x6A54:0xE8A2B5,
0x6A55:0xE8A1B2,0x6A56:0xE8A282,0x6A57:0xE8A297,0x6A58:0xE8A292,0x6A59:0xE8A2AE,
0x6A5A:0xE8A299,0x6A5B:0xE8A2A2,0x6A5C:0xE8A28D,0x6A5D:0xE8A2A4,0x6A5E:0xE8A2B0,
0x6A5F:0xE8A2BF,0x6A60:0xE8A2B1,0x6A61:0xE8A383,0x6A62:0xE8A384,0x6A63:0xE8A394,
0x6A64:0xE8A398,0x6A65:0xE8A399,0x6A66:0xE8A39D,0x6A67:0xE8A3B9,0x6A68:0xE8A482,
0x6A69:0xE8A3BC,0x6A6A:0xE8A3B4,0x6A6B:0xE8A3A8,0x6A6C:0xE8A3B2,0x6A6D:0xE8A484,
0x6A6E:0xE8A48C,0x6A6F:0xE8A48A,0x6A70:0xE8A493,0x6A71:0xE8A583,0x6A72:0xE8A49E,
0x6A73:0xE8A4A5,0x6A74:0xE8A4AA,0x6A75:0xE8A4AB,0x6A76:0xE8A581,0x6A77:0xE8A584,
0x6A78:0xE8A4BB,0x6A79:0xE8A4B6,0x6A7A:0xE8A4B8,0x6A7B:0xE8A58C,0x6A7C:0xE8A49D,
0x6A7D:0xE8A5A0,0x6A7E:0xE8A59E,0x6B21:0xE8A5A6,0x6B22:0xE8A5A4,0x6B23:0xE8A5AD,
0x6B24:0xE8A5AA,0x6B25:0xE8A5AF,0x6B26:0xE8A5B4,0x6B27:0xE8A5B7,0x6B28:0xE8A5BE,
0x6B29:0xE8A683,0x6B2A:0xE8A688,0x6B2B:0xE8A68A,0x6B2C:0xE8A693,0x6B2D:0xE8A698,
0x6B2E:0xE8A6A1,0x6B2F:0xE8A6A9,0x6B30:0xE8A6A6,0x6B31:0xE8A6AC,0x6B32:0xE8A6AF,
0x6B33:0xE8A6B2,0x6B34:0xE8A6BA,0x6B35:0xE8A6BD,0x6B36:0xE8A6BF,0x6B37:0xE8A780,
0x6B38:0xE8A79A,0x6B39:0xE8A79C,0x6B3A:0xE8A79D,0x6B3B:0xE8A7A7,0x6B3C:0xE8A7B4,
0x6B3D:0xE8A7B8,0x6B3E:0xE8A883,0x6B3F:0xE8A896,0x6B40:0xE8A890,0x6B41:0xE8A88C,
0x6B42:0xE8A89B,0x6B43:0xE8A89D,0x6B44:0xE8A8A5,0x6B45:0xE8A8B6,0x6B46:0xE8A981,
0x6B47:0xE8A99B,0x6B48:0xE8A992,0x6B49:0xE8A986,0x6B4A:0xE8A988,0x6B4B:0xE8A9BC,
0x6B4C:0xE8A9AD,0x6B4D:0xE8A9AC,0x6B4E:0xE8A9A2,0x6B4F:0xE8AA85,0x6B50:0xE8AA82,
0x6B51:0xE8AA84,0x6B52:0xE8AAA8,0x6B53:0xE8AAA1,0x6B54:0xE8AA91,0x6B55:0xE8AAA5,
0x6B56:0xE8AAA6,0x6B57:0xE8AA9A,0x6B58:0xE8AAA3,0x6B59:0xE8AB84,0x6B5A:0xE8AB8D,
0x6B5B:0xE8AB82,0x6B5C:0xE8AB9A,0x6B5D:0xE8ABAB,0x6B5E:0xE8ABB3,0x6B5F:0xE8ABA7,
0x6B60:0xE8ABA4,0x6B61:0xE8ABB1,0x6B62:0xE8AC94,0x6B63:0xE8ABA0,0x6B64:0xE8ABA2,
0x6B65:0xE8ABB7,0x6B66:0xE8AB9E,0x6B67:0xE8AB9B,0x6B68:0xE8AC8C,0x6B69:0xE8AC87,
0x6B6A:0xE8AC9A,0x6B6B:0xE8ABA1,0x6B6C:0xE8AC96,0x6B6D:0xE8AC90,0x6B6E:0xE8AC97,
0x6B6F:0xE8ACA0,0x6B70:0xE8ACB3,0x6B71:0xE99EAB,0x6B72:0xE8ACA6,0x6B73:0xE8ACAB,
0x6B74:0xE8ACBE,0x6B75:0xE8ACA8,0x6B76:0xE8AD81,0x6B77:0xE8AD8C,0x6B78:0xE8AD8F,
0x6B79:0xE8AD8E,0x6B7A:0xE8AD89,0x6B7B:0xE8AD96,0x6B7C:0xE8AD9B,0x6B7D:0xE8AD9A,
0x6B7E:0xE8ADAB,0x6C21:0xE8AD9F,0x6C22:0xE8ADAC,0x6C23:0xE8ADAF,0x6C24:0xE8ADB4,
0x6C25:0xE8ADBD,0x6C26:0xE8AE80,0x6C27:0xE8AE8C,0x6C28:0xE8AE8E,0x6C29:0xE8AE92,
0x6C2A:0xE8AE93,0x6C2B:0xE8AE96,0x6C2C:0xE8AE99,0x6C2D:0xE8AE9A,0x6C2E:0xE8B0BA,
0x6C2F:0xE8B181,0x6C30:0xE8B0BF,0x6C31:0xE8B188,0x6C32:0xE8B18C,0x6C33:0xE8B18E,
0x6C34:0xE8B190,0x6C35:0xE8B195,0x6C36:0xE8B1A2,0x6C37:0xE8B1AC,0x6C38:0xE8B1B8,
0x6C39:0xE8B1BA,0x6C3A:0xE8B282,0x6C3B:0xE8B289,0x6C3C:0xE8B285,0x6C3D:0xE8B28A,
0x6C3E:0xE8B28D,0x6C3F:0xE8B28E,0x6C40:0xE8B294,0x6C41:0xE8B1BC,0x6C42:0xE8B298,
0x6C43:0xE6889D,0x6C44:0xE8B2AD,0x6C45:0xE8B2AA,0x6C46:0xE8B2BD,0x6C47:0xE8B2B2,
0x6C48:0xE8B2B3,0x6C49:0xE8B2AE,0x6C4A:0xE8B2B6,0x6C4B:0xE8B388,0x6C4C:0xE8B381,
0x6C4D:0xE8B3A4,0x6C4E:0xE8B3A3,0x6C4F:0xE8B39A,0x6C50:0xE8B3BD,0x6C51:0xE8B3BA,
0x6C52:0xE8B3BB,0x6C53:0xE8B484,0x6C54:0xE8B485,0x6C55:0xE8B48A,0x6C56:0xE8B487,
0x6C57:0xE8B48F,0x6C58:0xE8B48D,0x6C59:0xE8B490,0x6C5A:0xE9BD8E,0x6C5B:0xE8B493,
0x6C5C:0xE8B38D,0x6C5D:0xE8B494,0x6C5E:0xE8B496,0x6C5F:0xE8B5A7,0x6C60:0xE8B5AD,
0x6C61:0xE8B5B1,0x6C62:0xE8B5B3,0x6C63:0xE8B681,0x6C64:0xE8B699,0x6C65:0xE8B782,
0x6C66:0xE8B6BE,0x6C67:0xE8B6BA,0x6C68:0xE8B78F,0x6C69:0xE8B79A,0x6C6A:0xE8B796,
0x6C6B:0xE8B78C,0x6C6C:0xE8B79B,0x6C6D:0xE8B78B,0x6C6E:0xE8B7AA,0x6C6F:0xE8B7AB,
0x6C70:0xE8B79F,0x6C71:0xE8B7A3,0x6C72:0xE8B7BC,0x6C73:0xE8B888,0x6C74:0xE8B889,
0x6C75:0xE8B7BF,0x6C76:0xE8B89D,0x6C77:0xE8B89E,0x6C78:0xE8B890,0x6C79:0xE8B89F,
0x6C7A:0xE8B982,0x6C7B:0xE8B8B5,0x6C7C:0xE8B8B0,0x6C7D:0xE8B8B4,0x6C7E:0xE8B98A,
0x6D21:0xE8B987,0x6D22:0xE8B989,0x6D23:0xE8B98C,0x6D24:0xE8B990,0x6D25:0xE8B988,
0x6D26:0xE8B999,0x6D27:0xE8B9A4,0x6D28:0xE8B9A0,0x6D29:0xE8B8AA,0x6D2A:0xE8B9A3,
0x6D2B:0xE8B995,0x6D2C:0xE8B9B6,0x6D2D:0xE8B9B2,0x6D2E:0xE8B9BC,0x6D2F:0xE8BA81,
0x6D30:0xE8BA87,0x6D31:0xE8BA85,0x6D32:0xE8BA84,0x6D33:0xE8BA8B,0x6D34:0xE8BA8A,
0x6D35:0xE8BA93,0x6D36:0xE8BA91,0x6D37:0xE8BA94,0x6D38:0xE8BA99,0x6D39:0xE8BAAA,
0x6D3A:0xE8BAA1,0x6D3B:0xE8BAAC,0x6D3C:0xE8BAB0,0x6D3D:0xE8BB86,0x6D3E:0xE8BAB1,
0x6D3F:0xE8BABE,0x6D40:0xE8BB85,0x6D41:0xE8BB88,0x6D42:0xE8BB8B,0x6D43:0xE8BB9B,
0x6D44:0xE8BBA3,0x6D45:0xE8BBBC,0x6D46:0xE8BBBB,0x6D47:0xE8BBAB,0x6D48:0xE8BBBE,
0x6D49:0xE8BC8A,0x6D4A:0xE8BC85,0x6D4B:0xE8BC95,0x6D4C:0xE8BC92,0x6D4D:0xE8BC99,
0x6D4E:0xE8BC93,0x6D4F:0xE8BC9C,0x6D50:0xE8BC9F,0x6D51:0xE8BC9B,0x6D52:0xE8BC8C,
0x6D53:0xE8BCA6,0x6D54:0xE8BCB3,0x6D55:0xE8BCBB,0x6D56:0xE8BCB9,0x6D57:0xE8BD85,
0x6D58:0xE8BD82,0x6D59:0xE8BCBE,0x6D5A:0xE8BD8C,0x6D5B:0xE8BD89,0x6D5C:0xE8BD86,
0x6D5D:0xE8BD8E,0x6D5E:0xE8BD97,0x6D5F:0xE8BD9C,0x6D60:0xE8BDA2,0x6D61:0xE8BDA3,
0x6D62:0xE8BDA4,0x6D63:0xE8BE9C,0x6D64:0xE8BE9F,0x6D65:0xE8BEA3,0x6D66:0xE8BEAD,
0x6D67:0xE8BEAF,0x6D68:0xE8BEB7,0x6D69:0xE8BF9A,0x6D6A:0xE8BFA5,0x6D6B:0xE8BFA2,
0x6D6C:0xE8BFAA,0x6D6D:0xE8BFAF,0x6D6E:0xE98287,0x6D6F:0xE8BFB4,0x6D70:0xE98085,
0x6D71:0xE8BFB9,0x6D72:0xE8BFBA,0x6D73:0xE98091,0x6D74:0xE98095,0x6D75:0xE980A1,
0x6D76:0xE9808D,0x6D77:0xE9809E,0x6D78:0xE98096,0x6D79:0xE9808B,0x6D7A:0xE980A7,
0x6D7B:0xE980B6,0x6D7C:0xE980B5,0x6D7D:0xE980B9,0x6D7E:0xE8BFB8,0x6E21:0xE9818F,
0x6E22:0xE98190,0x6E23:0xE98191,0x6E24:0xE98192,0x6E25:0xE9808E,0x6E26:0xE98189,
0x6E27:0xE980BE,0x6E28:0xE98196,0x6E29:0xE98198,0x6E2A:0xE9819E,0x6E2B:0xE981A8,
0x6E2C:0xE981AF,0x6E2D:0xE981B6,0x6E2E:0xE99AA8,0x6E2F:0xE981B2,0x6E30:0xE98282,
0x6E31:0xE981BD,0x6E32:0xE98281,0x6E33:0xE98280,0x6E34:0xE9828A,0x6E35:0xE98289,
0x6E36:0xE9828F,0x6E37:0xE982A8,0x6E38:0xE982AF,0x6E39:0xE982B1,0x6E3A:0xE982B5,
0x6E3B:0xE983A2,0x6E3C:0xE983A4,0x6E3D:0xE68988,0x6E3E:0xE9839B,0x6E3F:0xE98482,
0x6E40:0xE98492,0x6E41:0xE98499,0x6E42:0xE984B2,0x6E43:0xE984B0,0x6E44:0xE9858A,
0x6E45:0xE98596,0x6E46:0xE98598,0x6E47:0xE985A3,0x6E48:0xE985A5,0x6E49:0xE985A9,
0x6E4A:0xE985B3,0x6E4B:0xE985B2,0x6E4C:0xE9868B,0x6E4D:0xE98689,0x6E4E:0xE98682,
0x6E4F:0xE986A2,0x6E50:0xE986AB,0x6E51:0xE986AF,0x6E52:0xE986AA,0x6E53:0xE986B5,
0x6E54:0xE986B4,0x6E55:0xE986BA,0x6E56:0xE98780,0x6E57:0xE98781,0x6E58:0xE98789,
0x6E59:0xE9878B,0x6E5A:0xE98790,0x6E5B:0xE98796,0x6E5C:0xE9879F,0x6E5D:0xE987A1,
0x6E5E:0xE9879B,0x6E5F:0xE987BC,0x6E60:0xE987B5,0x6E61:0xE987B6,0x6E62:0xE9889E,
0x6E63:0xE987BF,0x6E64:0xE98894,0x6E65:0xE988AC,0x6E66:0xE98895,0x6E67:0xE98891,
0x6E68:0xE9899E,0x6E69:0xE98997,0x6E6A:0xE98985,0x6E6B:0xE98989,0x6E6C:0xE989A4,
0x6E6D:0xE98988,0x6E6E:0xE98A95,0x6E6F:0xE988BF,0x6E70:0xE9898B,0x6E71:0xE98990,
0x6E72:0xE98A9C,0x6E73:0xE98A96,0x6E74:0xE98A93,0x6E75:0xE98A9B,0x6E76:0xE9899A,
0x6E77:0xE98B8F,0x6E78:0xE98AB9,0x6E79:0xE98AB7,0x6E7A:0xE98BA9,0x6E7B:0xE98C8F,
0x6E7C:0xE98BBA,0x6E7D:0xE98D84,0x6E7E:0xE98CAE,0x6F21:0xE98C99,0x6F22:0xE98CA2,
0x6F23:0xE98C9A,0x6F24:0xE98CA3,0x6F25:0xE98CBA,0x6F26:0xE98CB5,0x6F27:0xE98CBB,
0x6F28:0xE98D9C,0x6F29:0xE98DA0,0x6F2A:0xE98DBC,0x6F2B:0xE98DAE,0x6F2C:0xE98D96,
0x6F2D:0xE98EB0,0x6F2E:0xE98EAC,0x6F2F:0xE98EAD,0x6F30:0xE98E94,0x6F31:0xE98EB9,
0x6F32:0xE98F96,0x6F33:0xE98F97,0x6F34:0xE98FA8,0x6F35:0xE98FA5,0x6F36:0xE98F98,
0x6F37:0xE98F83,0x6F38:0xE98F9D,0x6F39:0xE98F90,0x6F3A:0xE98F88,0x6F3B:0xE98FA4,
0x6F3C:0xE9909A,0x6F3D:0xE99094,0x6F3E:0xE99093,0x6F3F:0xE99083,0x6F40:0xE99087,
0x6F41:0xE99090,0x6F42:0xE990B6,0x6F43:0xE990AB,0x6F44:0xE990B5,0x6F45:0xE990A1,
0x6F46:0xE990BA,0x6F47:0xE99181,0x6F48:0xE99192,0x6F49:0xE99184,0x6F4A:0xE9919B,
0x6F4B:0xE991A0,0x6F4C:0xE991A2,0x6F4D:0xE9919E,0x6F4E:0xE991AA,0x6F4F:0xE988A9,
0x6F50:0xE991B0,0x6F51:0xE991B5,0x6F52:0xE991B7,0x6F53:0xE991BD,0x6F54:0xE9919A,
0x6F55:0xE991BC,0x6F56:0xE991BE,0x6F57:0xE99281,0x6F58:0xE991BF,0x6F59:0xE99682,
0x6F5A:0xE99687,0x6F5B:0xE9968A,0x6F5C:0xE99694,0x6F5D:0xE99696,0x6F5E:0xE99698,
0x6F5F:0xE99699,0x6F60:0xE996A0,0x6F61:0xE996A8,0x6F62:0xE996A7,0x6F63:0xE996AD,
0x6F64:0xE996BC,0x6F65:0xE996BB,0x6F66:0xE996B9,0x6F67:0xE996BE,0x6F68:0xE9978A,
0x6F69:0xE6BFB6,0x6F6A:0xE99783,0x6F6B:0xE9978D,0x6F6C:0xE9978C,0x6F6D:0xE99795,
0x6F6E:0xE99794,0x6F6F:0xE99796,0x6F70:0xE9979C,0x6F71:0xE997A1,0x6F72:0xE997A5,
0x6F73:0xE997A2,0x6F74:0xE998A1,0x6F75:0xE998A8,0x6F76:0xE998AE,0x6F77:0xE998AF,
0x6F78:0xE99982,0x6F79:0xE9998C,0x6F7A:0xE9998F,0x6F7B:0xE9998B,0x6F7C:0xE999B7,
0x6F7D:0xE9999C,0x6F7E:0xE9999E,0x7021:0xE9999D,0x7022:0xE9999F,0x7023:0xE999A6,
0x7024:0xE999B2,0x7025:0xE999AC,0x7026:0xE99A8D,0x7027:0xE99A98,0x7028:0xE99A95,
0x7029:0xE99A97,0x702A:0xE99AAA,0x702B:0xE99AA7,0x702C:0xE99AB1,0x702D:0xE99AB2,
0x702E:0xE99AB0,0x702F:0xE99AB4,0x7030:0xE99AB6,0x7031:0xE99AB8,0x7032:0xE99AB9,
0x7033:0xE99B8E,0x7034:0xE99B8B,0x7035:0xE99B89,0x7036:0xE99B8D,0x7037:0xE8A58D,
0x7038:0xE99B9C,0x7039:0xE99C8D,0x703A:0xE99B95,0x703B:0xE99BB9,0x703C:0xE99C84,
0x703D:0xE99C86,0x703E:0xE99C88,0x703F:0xE99C93,0x7040:0xE99C8E,0x7041:0xE99C91,
0x7042:0xE99C8F,0x7043:0xE99C96,0x7044:0xE99C99,0x7045:0xE99CA4,0x7046:0xE99CAA,
0x7047:0xE99CB0,0x7048:0xE99CB9,0x7049:0xE99CBD,0x704A:0xE99CBE,0x704B:0xE99D84,
0x704C:0xE99D86,0x704D:0xE99D88,0x704E:0xE99D82,0x704F:0xE99D89,0x7050:0xE99D9C,
0x7051:0xE99DA0,0x7052:0xE99DA4,0x7053:0xE99DA6,0x7054:0xE99DA8,0x7055:0xE58B92,
0x7056:0xE99DAB,0x7057:0xE99DB1,0x7058:0xE99DB9,0x7059:0xE99E85,0x705A:0xE99DBC,
0x705B:0xE99E81,0x705C:0xE99DBA,0x705D:0xE99E86,0x705E:0xE99E8B,0x705F:0xE99E8F,
0x7060:0xE99E90,0x7061:0xE99E9C,0x7062:0xE99EA8,0x7063:0xE99EA6,0x7064:0xE99EA3,
0x7065:0xE99EB3,0x7066:0xE99EB4,0x7067:0xE99F83,0x7068:0xE99F86,0x7069:0xE99F88,
0x706A:0xE99F8B,0x706B:0xE99F9C,0x706C:0xE99FAD,0x706D:0xE9BD8F,0x706E:0xE99FB2,
0x706F:0xE7AB9F,0x7070:0xE99FB6,0x7071:0xE99FB5,0x7072:0xE9A08F,0x7073:0xE9A08C,
0x7074:0xE9A0B8,0x7075:0xE9A0A4,0x7076:0xE9A0A1,0x7077:0xE9A0B7,0x7078:0xE9A0BD,
0x7079:0xE9A186,0x707A:0xE9A18F,0x707B:0xE9A18B,0x707C:0xE9A1AB,0x707D:0xE9A1AF,
0x707E:0xE9A1B0,0x7121:0xE9A1B1,0x7122:0xE9A1B4,0x7123:0xE9A1B3,0x7124:0xE9A2AA,
0x7125:0xE9A2AF,0x7126:0xE9A2B1,0x7127:0xE9A2B6,0x7128:0xE9A384,0x7129:0xE9A383,
0x712A:0xE9A386,0x712B:0xE9A3A9,0x712C:0xE9A3AB,0x712D:0xE9A483,0x712E:0xE9A489,
0x712F:0xE9A492,0x7130:0xE9A494,0x7131:0xE9A498,0x7132:0xE9A4A1,0x7133:0xE9A49D,
0x7134:0xE9A49E,0x7135:0xE9A4A4,0x7136:0xE9A4A0,0x7137:0xE9A4AC,0x7138:0xE9A4AE,
0x7139:0xE9A4BD,0x713A:0xE9A4BE,0x713B:0xE9A582,0x713C:0xE9A589,0x713D:0xE9A585,
0x713E:0xE9A590,0x713F:0xE9A58B,0x7140:0xE9A591,0x7141:0xE9A592,0x7142:0xE9A58C,
0x7143:0xE9A595,0x7144:0xE9A697,0x7145:0xE9A698,0x7146:0xE9A6A5,0x7147:0xE9A6AD,
0x7148:0xE9A6AE,0x7149:0xE9A6BC,0x714A:0xE9A79F,0x714B:0xE9A79B,0x714C:0xE9A79D,
0x714D:0xE9A798,0x714E:0xE9A791,0x714F:0xE9A7AD,0x7150:0xE9A7AE,0x7151:0xE9A7B1,
0x7152:0xE9A7B2,0x7153:0xE9A7BB,0x7154:0xE9A7B8,0x7155:0xE9A881,0x7156:0xE9A88F,
0x7157:0xE9A885,0x7158:0xE9A7A2,0x7159:0xE9A899,0x715A:0xE9A8AB,0x715B:0xE9A8B7,
0x715C:0xE9A985,0x715D:0xE9A982,0x715E:0xE9A980,0x715F:0xE9A983,0x7160:0xE9A8BE,
0x7161:0xE9A995,0x7162:0xE9A98D,0x7163:0xE9A99B,0x7164:0xE9A997,0x7165:0xE9A99F,
0x7166:0xE9A9A2,0x7167:0xE9A9A5,0x7168:0xE9A9A4,0x7169:0xE9A9A9,0x716A:0xE9A9AB,
0x716B:0xE9A9AA,0x716C:0xE9AAAD,0x716D:0xE9AAB0,0x716E:0xE9AABC,0x716F:0xE9AB80,
0x7170:0xE9AB8F,0x7171:0xE9AB91,0x7172:0xE9AB93,0x7173:0xE9AB94,0x7174:0xE9AB9E,
0x7175:0xE9AB9F,0x7176:0xE9ABA2,0x7177:0xE9ABA3,0x7178:0xE9ABA6,0x7179:0xE9ABAF,
0x717A:0xE9ABAB,0x717B:0xE9ABAE,0x717C:0xE9ABB4,0x717D:0xE9ABB1,0x717E:0xE9ABB7,
0x7221:0xE9ABBB,0x7222:0xE9AC86,0x7223:0xE9AC98,0x7224:0xE9AC9A,0x7225:0xE9AC9F,
0x7226:0xE9ACA2,0x7227:0xE9ACA3,0x7228:0xE9ACA5,0x7229:0xE9ACA7,0x722A:0xE9ACA8,
0x722B:0xE9ACA9,0x722C:0xE9ACAA,0x722D:0xE9ACAE,0x722E:0xE9ACAF,0x722F:0xE9ACB2,
0x7230:0xE9AD84,0x7231:0xE9AD83,0x7232:0xE9AD8F,0x7233:0xE9AD8D,0x7234:0xE9AD8E,
0x7235:0xE9AD91,0x7236:0xE9AD98,0x7237:0xE9ADB4,0x7238:0xE9AE93,0x7239:0xE9AE83,
0x723A:0xE9AE91,0x723B:0xE9AE96,0x723C:0xE9AE97,0x723D:0xE9AE9F,0x723E:0xE9AEA0,
0x723F:0xE9AEA8,0x7240:0xE9AEB4,0x7241:0xE9AF80,0x7242:0xE9AF8A,0x7243:0xE9AEB9,
0x7244:0xE9AF86,0x7245:0xE9AF8F,0x7246:0xE9AF91,0x7247:0xE9AF92,0x7248:0xE9AFA3,
0x7249:0xE9AFA2,0x724A:0xE9AFA4,0x724B:0xE9AF94,0x724C:0xE9AFA1,0x724D:0xE9B0BA,
0x724E:0xE9AFB2,0x724F:0xE9AFB1,0x7250:0xE9AFB0,0x7251:0xE9B095,0x7252:0xE9B094,
0x7253:0xE9B089,0x7254:0xE9B093,0x7255:0xE9B08C,0x7256:0xE9B086,0x7257:0xE9B088,
0x7258:0xE9B092,0x7259:0xE9B08A,0x725A:0xE9B084,0x725B:0xE9B0AE,0x725C:0xE9B09B,
0x725D:0xE9B0A5,0x725E:0xE9B0A4,0x725F:0xE9B0A1,0x7260:0xE9B0B0,0x7261:0xE9B187,
0x7262:0xE9B0B2,0x7263:0xE9B186,0x7264:0xE9B0BE,0x7265:0xE9B19A,0x7266:0xE9B1A0,
0x7267:0xE9B1A7,0x7268:0xE9B1B6,0x7269:0xE9B1B8,0x726A:0xE9B3A7,0x726B:0xE9B3AC,
0x726C:0xE9B3B0,0x726D:0xE9B489,0x726E:0xE9B488,0x726F:0xE9B3AB,0x7270:0xE9B483,
0x7271:0xE9B486,0x7272:0xE9B4AA,0x7273:0xE9B4A6,0x7274:0xE9B6AF,0x7275:0xE9B4A3,
0x7276:0xE9B49F,0x7277:0xE9B584,0x7278:0xE9B495,0x7279:0xE9B492,0x727A:0xE9B581,
0x727B:0xE9B4BF,0x727C:0xE9B4BE,0x727D:0xE9B586,0x727E:0xE9B588,0x7321:0xE9B59D,
0x7322:0xE9B59E,0x7323:0xE9B5A4,0x7324:0xE9B591,0x7325:0xE9B590,0x7326:0xE9B599,
0x7327:0xE9B5B2,0x7328:0xE9B689,0x7329:0xE9B687,0x732A:0xE9B6AB,0x732B:0xE9B5AF,
0x732C:0xE9B5BA,0x732D:0xE9B69A,0x732E:0xE9B6A4,0x732F:0xE9B6A9,0x7330:0xE9B6B2,
0x7331:0xE9B784,0x7332:0xE9B781,0x7333:0xE9B6BB,0x7334:0xE9B6B8,0x7335:0xE9B6BA,
0x7336:0xE9B786,0x7337:0xE9B78F,0x7338:0xE9B782,0x7339:0xE9B799,0x733A:0xE9B793,
0x733B:0xE9B7B8,0x733C:0xE9B7A6,0x733D:0xE9B7AD,0x733E:0xE9B7AF,0x733F:0xE9B7BD,
0x7340:0xE9B89A,0x7341:0xE9B89B,0x7342:0xE9B89E,0x7343:0xE9B9B5,0x7344:0xE9B9B9,
0x7345:0xE9B9BD,0x7346:0xE9BA81,0x7347:0xE9BA88,0x7348:0xE9BA8B,0x7349:0xE9BA8C,
0x734A:0xE9BA92,0x734B:0xE9BA95,0x734C:0xE9BA91,0x734D:0xE9BA9D,0x734E:0xE9BAA5,
0x734F:0xE9BAA9,0x7350:0xE9BAB8,0x7351:0xE9BAAA,0x7352:0xE9BAAD,0x7353:0xE99DA1,
0x7354:0xE9BB8C,0x7355:0xE9BB8E,0x7356:0xE9BB8F,0x7357:0xE9BB90,0x7358:0xE9BB94,
0x7359:0xE9BB9C,0x735A:0xE9BB9E,0x735B:0xE9BB9D,0x735C:0xE9BBA0,0x735D:0xE9BBA5,
0x735E:0xE9BBA8,0x735F:0xE9BBAF,0x7360:0xE9BBB4,0x7361:0xE9BBB6,0x7362:0xE9BBB7,
0x7363:0xE9BBB9,0x7364:0xE9BBBB,0x7365:0xE9BBBC,0x7366:0xE9BBBD,0x7367:0xE9BC87,
0x7368:0xE9BC88,0x7369:0xE79AB7,0x736A:0xE9BC95,0x736B:0xE9BCA1,0x736C:0xE9BCAC,
0x736D:0xE9BCBE,0x736E:0xE9BD8A,0x736F:0xE9BD92,0x7370:0xE9BD94,0x7371:0xE9BDA3,
0x7372:0xE9BD9F,0x7373:0xE9BDA0,0x7374:0xE9BDA1,0x7375:0xE9BDA6,0x7376:0xE9BDA7,
0x7377:0xE9BDAC,0x7378:0xE9BDAA,0x7379:0xE9BDB7,0x737A:0xE9BDB2,0x737B:0xE9BDB6,
0x737C:0xE9BE95,0x737D:0xE9BE9C,0x737E:0xE9BEA0,0x7421:0xE5A0AF,0x7422:0xE6A787,
0x7423:0xE98199,0x7424:0xE791A4,0x7425:0xE5879C,0x7426:0xE78699
};

THREE.MMD.Encoding = Encoding;

}());
