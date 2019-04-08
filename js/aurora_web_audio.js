// Aurora HTML5 Audio emulation (v1.0.0)

var Aurora = AV
AV = null

Aurora.WebAudio = (function () {

  var _files = {}

  var WebAudio = function () {
  }

  WebAudio.prototype = {

    constructor: WebAudio

   ,AV_player: null
   ,AV_asset: null

   ,_event: {}
   ,addEventListener: function (event_name, func, useCapture) {
var that = this

if (!this._event[event_name]) {
  this._event[event_name] = (function () {
    var _that = that
    return {
  run: function () {
this.event_list.forEach(function (obj) {
  obj.func.call(_that)
});
  }
 ,event_list: []
    };
  })();
}

this._event[event_name].event_list.push({event_name:event_name, func:func, useCapture:useCapture})

if (this.AV_player)
  this._loadEvent(event_name)
    }

   ,_loadEvent: function (event_name) {
if (!this._event[event_name])
  return

var that = this
switch (event_name) {
  case "canplaythrough":
    this.AV_player.on("ready", function () {
      that._event["canplaythrough"].run()
      if (that._autoplay)
        that.play()
    })
    break
  case "playing":
// run after .play()
    break
  case "ended":
    this.AV_player.on("end", function () {
      that._event["ended"].run()
      if (self.AudioFFT_active)
        AudioFFT_active._AV_buffer = null
    })
    break
  case "timeupdate":
    this.AV_player.on("progress", function (msecs) {
      that._event["timeupdate"].run()
    })
    break
}
    }

   ,get ontimeupdate()  { return this._ontimeupdate }
   ,set ontimeupdate(f) {
this._ontimeupdate = f
this.addEventListener("timeupdate", f)
   }

   ,get currentTime()  { return this.AV_player.currentTime/1000 }
   ,set currentTime(t) {
this.AV_player.seek(t*1000)
/*
var that = this
if (this._event["seeked"])
  setTimeout(function () { that._event["seeked"].run() }, 0)
*/
    }

   ,get autoplay()  { return this._autoplay }
   ,set autoplay(b) { this._autoplay = b }

   ,get duration() { return this.AV_player.duration/1000 }

   ,get volume()  { return this.AV_player.volume }
   ,set volume(v) { this.AV_player.volume = v }

   ,get muted()  { return this._muted }
   ,set muted(b) {
this._muted = b
if (b) {
  this._volume = this.volume
  this.volume = 0
}
else {
  if (this._volume != null)
    this.volume = this._volume
}
    }

   ,play: function () {
this._paused = false
this.AV_player.play()
this._event["playing"].run()
    }

   ,get paused() { return !this.AV_player.playing }

   ,pause: function () {
this._paused = true
this.AV_player.pause()
    }

   ,get src() { return this._src }
   ,set src(p) {
this._src = p

p = toLocalPath(p)
if (p == this._file.name) {
//    this.AV_player = (this.AV_asset) ? new Aurora.Player(this.AV_asset) : Aurora.Player.fromFile(this._file)
  this.AV_player = Aurora.Player.fromFile(this._file)

  if (self.AudioFFT_active) {
    this.AV_player.asset.on("data", function (buffer) {
//console.log(buffer)
      AudioFFT_active._AV_buffer = buffer
    });
  }
}
else {
  var file = _files[p]
  if (!file) {
    DEBUG_show("ERROR: No such file loaded\n" + p, 0,1)
    return
  }

  this._file = file
  this.AV_asset = null
  this.AV_player = Aurora.Player.fromFile(file)
}

//console.log(this.AV_player)
//console.log(this._event)
//return

if (this.AV_player._event_initialized) {
  this._autoplay && this._event["canplaythrough"] && this._event["canplaythrough"].run()
  this.play()
}
else {
  this.AV_player._event_initialized = true
  for (var e_name in this._event) {
    this._loadEvent(e_name)
  }

  this.AV_player.preload()
}
    }

   ,AV_init: function (file) { this._file = _files[file.name] = file }
  }

  return WebAudio

})();