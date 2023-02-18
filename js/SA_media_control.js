// Media control for Silverlight and HTML5 Canvas
// (2023-02-18)

var EV_SL_MediaEnded, EV_SL_MediaOpened

var SL_MC_simple_mode

function SL_MediaOpened(sender, args) {
  if (EV_SL_MediaOpened && EV_SL_MediaOpened(sender, args))
    return
}

function SL_MediaEnded(sender, args) {
  if (EV_SL_MediaEnded && EV_SL_MediaEnded(sender, args))
    return

  sender.Stop()
  sender.Play()
}

var SL_MC_timerID
var SL_MC_timeout = 10*1000
var EV_SL_Media_MouseEnter

function SL_Media_MouseEnter(sender, args) {
  SL_MC_MouseEnter()

  var mc = SL_root.FindName("C_media_control")
  if (mc.Visibility == "Visible")
    return
  if (EV_SL_Media_MouseEnter && EV_SL_Media_MouseEnter(sender, args))
    return

  if (self.EQP_use_HTML5_video && (!self.EQP_video_options || !EQP_video_options.use_overlay_video)) {
    if (!EQP_gallery_obj_active.imgs[0].video_loaded)
      return

    SL_MC_video_obj = EQP_gallery_obj_active.imgs[0].img_obj_v
  }
  else
    SL_MC_video_obj = sender

  SL_MC_Update()

  mc.Visibility = "Visible"

  SL_MC_timerID = setTimeout('SL_MC_timerID=null; SL_root.FindName("C_media_control").Visibility = "Collapsed";', SL_MC_timeout)
}

var SL_tooltip_msg_custom

function SL_MC_MouseEnter(sender, args) {
  if (SL_MC_timerID) {
    clearTimeout(SL_MC_timerID)
    SL_MC_timerID = null
  }

  if (!sender)
    return

  var name = sender.Name
  if (!/^MC_(.+)$/.test(name))
    return

  name = RegExp.$1

  var options = (SL_MC_video_obj && self.EQP_use_HTML5_video) ? SL_MC_video_obj._EQP_obj.EQP_video_options : null

switch (name) {
  case "play":
    SL_tooltip_msg_custom = 'Play / Pause'
    break
  case "stop":
    SL_tooltip_msg_custom = 'Stop' + ((SL_MC_simple_mode || self.MMD_SA || (use_WMP && WMP.in_use) || (!EQP_dragdrop_target || !EQP_dragdrop_target.is_video || !EQP_dragdrop_target.img_obj_i)) ? '' : ' (click again to hide video)')
    break
  case "forward":
    SL_tooltip_msg_custom = (SL_MC_simple_mode || !self.MMD_SA || SL_MC_video_obj.vo.motion_by_song_name_mode) ? 'Seek forward' : 'Speed+'//(options && options.BPM_mode) ? 'BPM sync+' : 'Seek forward'
    break
  case "backward":
    SL_tooltip_msg_custom = (SL_MC_simple_mode || !self.MMD_SA || SL_MC_video_obj.vo.motion_by_song_name_mode) ? 'Seek backward' : 'Speed-'//(options && options.BPM_mode) ? 'BPM sync-' : 'Seek backward'
    break
  case "sound":
    SL_tooltip_msg_custom = (!SL_MC_simple_mode && !self.MMD_SA && ((options && options.BPM_mode && options.beat_reference && !SL_MC_video_obj.paused) || (use_WMP && WMP.in_use && WMP.audio_child_list))) ? 'Click on a beat to sync BPM.' : 'Mute / Unmute'
    break
  case "seek":
    SL_tooltip_msg_custom = "Seek"
    break
}

  if (SL_tooltip_msg_custom) {
    if (use_HTML5)
      document.getElementById("MC_" + name).setAttribute("data-title", SL_tooltip_msg_custom)
    else
      SL_Tooltip_Show(SL_tooltip_msg_custom)
  }
}

function SL_MC_Timeupdate(media_obj) {
  MC_seek._media_obj = media_obj
  if (MC_seek._update_disabled)
    return

  var v_now = parseInt(MC_seek.value)
  var v = parseInt(media_obj.currentTime / media_obj.duration * 100)
  if (v_now != v)
    MC_seek.value = v
}


// Media control

function SL_MC_MouseLeave(timeout) {
  SL_MC_MouseEnter()
  SL_MC_timerID = setTimeout('SL_MC_timerID=null; SL_root.FindName("C_media_control").Visibility = "Collapsed";', timeout||SL_MC_timeout)
}

var SL_MC_video_obj

function SL_MC_Update() {
  if (!SL_MC_video_obj)
    return

  if (SL_MC_simple_mode) {
    SL_root.FindName("MC_sound").Text = (SL_MC_video_obj.muted) ? "\ud83d\udd07" : "\ud83d\udd0a"
  }
  else if (self.MMD_SA) {
    SL_root.FindName("MC_sound").Text = (SL_MC_video_obj.vo.audio_obj.muted) ? "\ud83d\udd07" : "\ud83d\udd0a"
  }
  else if (use_WMP && WMP.in_use) {
    if (!use_HTML5)
      SL_root.FindName("MC_play").Text  = (WMP.player.playState == 3) ? ";" : "4"
    SL_root.FindName("MC_sound").Text = (WMP.player.settings.mute) ? ((use_HTML5)?"\ud83d\udd07":"U") : ((use_HTML5)?"\ud83d\udd0a":"V")
  }
  else if (self.EQP_use_HTML5_video && (!self.EQP_video_options || !EQP_video_options.use_overlay_video)) {
    if (!use_HTML5)
      SL_root.FindName("MC_play").Text  = (!SL_MC_video_obj.paused) ? ";" : "4"
    SL_root.FindName("MC_sound").Text = (SL_MC_video_obj.muted) ? ((use_HTML5)?"\ud83d\udd07":"U") : ((use_HTML5)?"\ud83d\udd0a":"V")
  }
  else {
    if (!use_HTML5)
      SL_root.FindName("MC_play").Text  = (SL_MC_video_obj.CurrentState == "Playing") ? ";" : "4"
    SL_root.FindName("MC_sound").Text = (SL_MC_video_obj.IsMuted) ? ((use_HTML5)?"\ud83d\udd07":"U") : ((use_HTML5)?"\ud83d\udd0a":"V")
  }
}

var SL_MC_Place = (function () {
  var scale_last, x_offset_last, y_offset_last;

  return function (scale=scale_last||1, x_offset=x_offset_last||0, y_offset=y_offset_last||0) {
    System._browser.update_tray()

    if (scale == -1) {
      SL_MC_video_obj = null
      C_media_control.style.visibility = "hidden"
      return
    }

    scale_last = scale
    x_offset_last = x_offset
    y_offset_last = y_offset

    var w = 150 * scale
    var h = 45  * scale

    setTimeout(function () {
C_media_control.style.posLeft = Math.round((((browser_native_mode) ? screen.availWidth : B_content_width) - w) / 2) + x_offset;
C_media_control.style.posTop  = (((browser_native_mode) ? screen.availHeight: B_content_height) - h) - 20 - ((B_content_height > screen.availHeight-45) ? B_content_height - (screen.availHeight-45) : 0) + y_offset;
    }, 0);

    var mcs = C_media_control.style
    if (scale == 1) {
      mcs.transform = mcs.transformOrigin = "none";
    }
    else {
      mcs.transform = "scale(" + scale + ")";
      mcs.transformOrigin = "0% 0%";
    }
  };
})();

function SL_MC_Linked_Control(func_name) {
  var ao = Audio_BPM.audio_obj
  if (!ao)
    return false

  if (ao._ao_linked) {
    try {
      Audio_BPM.vo._ao_linked_window[func_name]()
    }
    catch (err) {}
    return true
  }

  if (ao._ao_linked_list) {
    ao._ao_linked_list.forEach(function (w) {
try {
  w[func_name](true)
}
catch (err) {}
    });
  }
}

function SL_MC_Play(ignore_linked_control) {
  if (!ignore_linked_control && self.Audio_BPM) {
    if (SL_MC_Linked_Control("SL_MC_Play"))
      return
  }

  var vo = self.EQP_video_options

//play=52,4, pause=59,;
  if (SL_MC_simple_mode) {
    if (SL_MC_video_obj.paused) {
      SL_MC_video_obj.play();

      System._browser.video_capture.resume();
    }
    else {
      SL_MC_video_obj.pause()
      var m = parseInt(SL_MC_video_obj.currentTime/60)
      var s = parseInt((SL_MC_video_obj.currentTime - m*60)*1000)/1000
      DEBUG_show('PAUSED(' + m + 'm' + s + 's)', 2)

      System._browser.video_capture.pause();
    }
  }
  else if (self.MMD_SA) {
    var ao = SL_MC_video_obj.vo.audio_obj
    if (ao.paused) {
      ao._MMD_SA_on_playing_skipped = (ao.currentTime > 0)
      ao.play()
      jThree.MMD.play(true)

      System._browser.video_capture.resume();
    }
    else {
      ao.pause()
      jThree.MMD.pause()
      var m = parseInt(ao.currentTime/60)
      var s = parseInt((ao.currentTime - m*60)*1000)/1000
      DEBUG_show('PAUSED(' + m + 'm' + s + 's)', 2)

      System._browser.video_capture.pause();
    }
  }
  else if (use_WMP && WMP.in_use) {
    WMP.play()
  }
  else if (self.EQP_use_HTML5_video && (!vo || !vo.use_overlay_video)) {
    if (SL_MC_video_obj)
      SL_MC_video_obj.poster_mode = false

    var ao = (vo && vo.BPM_mode) ? vo.audio_obj : null
    if (ao && ao.is_linked)
      ao.linked_play()
    else {
      // for Winamp, just in case SL_MC_Play is called before SL_MC_video_obj is assigned.
      if (!SL_MC_video_obj)
        SL_MC_video_obj = EQP_gallery_obj_active.imgs[0].img_obj_v

      if (SL_MC_video_obj.paused) {
        if (vo)
          vo.poster_frame_ignored = true

        SL_MC_video_obj.play()
        if (ao) {
          ao.play()

          if (ao.is_winamp && vo.BPM_mode && vo.beat_reference) {
var time_reference = (ao.beat_reference - ao.currentTime) * ao.BPM/vo.BPM + SL_MC_video_obj.currentTime
setTimeout(function () {EQP_SyncBPM_Auto(SL_MC_video_obj, vo, time_reference)}, 1000)
          }
        }
      }
      else {
        if (vo)
          vo.poster_frame_ignored = false

        SL_MC_video_obj.pause()
        if (ao)
          ao.pause()
      }
    }
  }
  else {
    if (SL_MC_video_obj.CurrentState == "Playing")
      SL_MC_video_obj.Pause()
    else
      SL_MC_video_obj.Play()
  }

  setTimeout('SL_MC_Update()', 0)
}

function SL_MC_Stop(ignore_linked_control) {
  if (!ignore_linked_control && self.Audio_BPM) {
    if (SL_MC_Linked_Control("SL_MC_Stop"))
      return
  }

  var vo = self.EQP_video_options

  if (SL_MC_simple_mode) {
    SL_MC_video_obj.pause()
    SL_MC_video_obj.currentTime = 0
  }
  else if (self.MMD_SA) {
    var ao = SL_MC_video_obj.vo.audio_obj
    if (ao.paused && !ao.currentTime) {
      jThree.MMD.play(true)
      SL_MC_video_obj.vo.audio_onended()
    }
    else {
      if (!ao.paused) {
        ao.pause()
        jThree.MMD.pause()
      }
      if (ao.paused) { MMD_SA.MMD.frame_time_ref=0 } else if (SL_MC_video_obj.vo.motion_by_song_name_mode) { ao._MMD_SA_on_playing_skipped=true }
      if (SL_MC_video_obj.vo.motion_by_song_name_mode) { MMD_SA.seek_motion(0, true) }
    }
    ao.currentTime = 0
  }
  else if (use_WMP && WMP.in_use)
    WMP.stop()
  else if (self.EQP_use_HTML5_video && (!vo || !vo.use_overlay_video)) {
    var ao = (vo && vo.BPM_mode) ? vo.audio_obj : null
    if (ao && ao.is_linked)
      ao.linked_stop()
    else {
      // for Winamp, just in case SL_MC_Play is called before SL_MC_video_obj is assigned.
      if (!SL_MC_video_obj)
        SL_MC_video_obj = EQP_gallery_obj_active.imgs[0].img_obj_v

      if (ao && ao.is_winamp) {
        SL_MC_Play()
        return
      }

      if (SL_MC_video_obj)
        SL_MC_video_obj.pause()

      var vo = vo
      if (vo) {
        vo.poster_frame_ignored = false

        if ((vo.poster_frame >= 0) && !vo.BPM_mode) {
          SL_MC_video_obj.poster_mode = true
          SL_MC_video_obj.currentTime = vo.poster_frame
        }
        else if (vo.SEQ_mode && vo.SEQ_gallery)
          SL_MC_Seek(-1, true)
        else
          SL_MC_video_obj.currentTime = 0

        if (vo.BPM_mode) {
          ao.pause()
          vo.audio_onended()
        }
      }
    }
  }
  else {
    SL_MC_video_obj.Stop()

    if (SL_MC_video_obj.CurrentState == "Stopped") {
      EQP_Hide_Video()
      return
    }
  }

  setTimeout('SL_MC_Update()', 0)
}

function SL_MC_Forward(ignore_linked_control) {
/*
  if (!ignore_linked_control && self.Audio_BPM) {
    if (SL_MC_Linked_Control("SL_MC_Forward"))
      return
  }
*/
  SL_MC_Seek(1, true)
}

function SL_MC_Backward(ignore_linked_control) {
/*
  if (!ignore_linked_control && self.Audio_BPM) {
    if (SL_MC_Linked_Control("SL_MC_Backward"))
      return
  }
*/
  SL_MC_Seek(-1, true)
}

function SL_MC_Seek(mod, forced_seek, from_seek_bar) {
  if (SL_MC_simple_mode) {
    SL_MC_video_obj.currentTime += ((!from_seek_bar && self.MMD_SA && MMD_SA_options.user_camera.ML_models.enabled) ? 1 : 30) * mod
    return
  }

  if (self.MMD_SA) {
    var vo = SL_MC_video_obj.vo
    if (vo.motion_by_song_name_mode) {
      var ao = vo.audio_obj
      ao.currentTime += 30 * mod
      if (ao.paused) { MMD_SA.MMD.frame_time_ref=0 } else if (vo.motion_by_song_name_mode) { ao._MMD_SA_on_playing_skipped=true }
      if (vo.motion_by_song_name_mode) { MMD_SA.seek_motion(ao.currentTime, true) }
    }
    else {
      MMD_SA.MMD.frame_time_ref = 0
      if (from_seek_bar) {
        var ao = vo.audio_obj
        ao._MMD_SA_on_playing_skipped = true
        ao.currentTime += 30 * mod
      }
      else {
        var ps = parseInt((vo.playbackRate_scale || 1) * 10) / 10
        switch (ps) {
case 0.5:
  ps = (mod > 0) ? 2/3 : 0.5
  break
case 0.6:
  ps = (mod > 0) ? 1 : 0.5
  break
case 1:
  ps = (mod > 0) ? 1.5 : 2/3
  break
case 1.5:
  ps = (mod > 0) ? 2 : 1
  break
case 2:
  ps = (mod > 0) ? 2 : 1.5
  break
        }
        vo.playbackRate_scale = ps
        DEBUG_show("Speed x " + (Math.round(ps*100)/100), 3)
      }
    }
    return
  }

  if (use_WMP && WMP.in_use) {
    try {
      WMP.player.controls.currentPosition += 30 * mod
    }
    catch (err) {
      DEBUG_show('(media seek failed)', 2)
    }
    return
  }

  if (self.EQP_use_HTML5_video && (!self.EQP_video_options || !EQP_video_options.use_overlay_video)) {
    // for Winamp, just in case SL_MC_Play is called before SL_MC_video_obj is assigned.
    if (!SL_MC_video_obj)
      SL_MC_video_obj = EQP_gallery_obj_active.imgs[0].img_obj_v

    try {
      if (SL_MC_video_obj.seeking)
        return

      SL_MC_video_obj.poster_mode = false

      var options = SL_MC_video_obj._EQP_obj.EQP_video_options
      if (options && (forced_seek || !options.BPM_mode) && options.SEQ_mode && options.SEQ_gallery && SL_MC_video_obj.muted) {
        options._gallery_change = (mod > 0)
        options._gallery_loop   = (mod < 0)
      }
      else {
if (options && options.BPM_mode) {
  if (!options.BPM_syncing) {
    if (from_seek_bar)
      mod = (mod > 0) ? 1 : -1
    if (options.BPM_syncing_timerID) {
      clearTimeout(options.BPM_syncing_timerID)
      options.BPM_syncing_timerID = null

      EQP_SyncBPM(SL_MC_video_obj, 60/options.audio_obj.BPM*mod, 'beat')
    }
    else {
      options.BPM_syncing_timerID = setTimeout(
  'SL_MC_video_obj._EQP_obj.EQP_video_options.BPM_syncing_timerID = null; '
+ 'EQP_SyncBPM(SL_MC_video_obj, ' + (mod/10) + ');'
      , 300);
    }
  }
}
else
  SL_MC_video_obj.currentTime += 30 * mod
      }
    }
    catch (err) {}
    return
  }

  if (!SL_MC_video_obj.CanSeek || (SL_MC_video_obj.CurrentState == "Stopped"))
    return

  var s = parseInt(SL_MC_video_obj.Position.Seconds) + 30 * mod
  if ((s < 0) || (s > SL_MC_video_obj.NaturalDuration.Seconds))
    return

  var m = parseInt(s/60)
  var h = parseInt(m/60)
  s = s % 60
  m = m % 60

  var p = h+':'+m+':'+s
  SL_MC_video_obj.Position = p
  DEBUG_show(p, 2)
}

function SL_MC_Sound(ignore_linked_control) {
/*
  if (!ignore_linked_control && self.Audio_BPM) {
    if (SL_MC_Linked_Control("SL_MC_Sound"))
      return
  }
*/
//sound=85,U, mute=86,V
  if (SL_MC_simple_mode) {
    SL_MC_video_obj.muted = !SL_MC_video_obj.muted
  }
  else if (self.MMD_SA) {
    var ao = SL_MC_video_obj.vo.audio_obj
    ao.muted = !ao.muted
  }
  else if (use_WMP && WMP.in_use)
    WMP.sound()
  else if (self.EQP_use_HTML5_video && self.EQP_video_options && EQP_video_options.BPM_mode && EQP_video_options.beat_reference && !SL_MC_video_obj.paused) {
    var ao = (self.EQP_video_options && EQP_video_options.BPM_mode) ? EQP_video_options.audio_obj : null
    if (ao && ao.is_linked)
      ao.linked_sound()
    else
      EQP_SyncBPM_Auto(SL_MC_video_obj, EQP_video_options)

    return
  }
  else if (self.EQP_use_HTML5_video && (!self.EQP_video_options || !EQP_video_options.use_overlay_video)) {
    SL_MC_video_obj.muted = !SL_MC_video_obj.muted
  }
  else {
    if (SL_MC_video_obj.IsMuted) {
      SL_MC_video_obj.IsMuted = false
      SL_MC_video_obj.Volume = 1
    }
    else
      SL_MC_video_obj.IsMuted = true
  }

  setTimeout('SL_MC_Update()', 0)
}


// Silverlight emulation START
(function () {
  if (!("SL_root" in self)) {
self.SL_root = {
  SL_root_object: {}

 ,FindName: function (name) {
var obj = this.SL_root_object[name]
if (!obj) {
  obj = {}

  if (name == "C_media_control") {
    Object.defineProperty(obj, "Visibility",
{
  get: function () {
return (C_media_control.style.visibility == "hidden") ? "Collapsed" : "Visible";
  }

 ,set: function(v) {
C_media_control.style.visibility = (v == "Collapsed") ? "hidden" : "inherit"
  }
});
  }
  else if (/^MC_/.test(name)) {
    obj.object = document.getElementById(name)
    Object.defineProperty(obj, "Text",
{
  get: function () {
return this.object.innerText;
  }

 ,set: function(v) {
this.object.innerText = v
  }
});
  }

  this.SL_root_object[name] = obj
}

return obj
  }
}
  }
})();
// END