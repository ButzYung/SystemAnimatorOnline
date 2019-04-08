// Audio object with custom source (eg. audio buffer) - (v0.0)

var AudioCustomSource = (function () {

  var _files = {}

  var AudioObject = function () {}

  AudioObject.prototype = {

    constructor: AudioObject

   ,_context: null
   ,_buffer: null
   ,_source: null

   ,_initialized: false
   ,_init: function () {
if (this._initialized)
  return
this._initialized = true

for (var e_name in this._event) {
  this._loadEvent(e_name)
}
    }

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
    setTimeout(function () {
      that._event["canplaythrough"].run()
      if (that._autoplay)
        that.play()
    }, 100);
    break
  case "playing":
// run after .play()
    break
  case "ended":
    this._source.addEventListener("ended", function () {
      that._event["ended"].run()
      if (Seq.item("AudioCustomSource_on_timeupdate"))
        Seq.item("AudioCustomSource_on_timeupdate").Stop()
    }, true);
    break
  case "timeupdate":
    Seq.item("AudioCustomSource_on_timeupdate").At(0.2, function () {
      that._event["timeupdate"].run()
    }, -1, 0.2);
    Seq.item("AudioCustomSource_on_timeupdate").Play()
    break
}
    }

   ,get ontimeupdate()  { return this._ontimeupdate }
   ,set ontimeupdate(f) {
this._ontimeupdate = f
this.addEventListener("timeupdate", f)
   }

   ,get currentTime()  { return this._context.currentTime }
   ,set currentTime(t) {
    }

   ,get autoplay()  { return this._autoplay }
   ,set autoplay(b) { this._autoplay = b }

   ,get duration() { return this.AV_player.duration }

   ,get volume()  { return 1 }
   ,set volume(v) { }

   ,get muted()  { return this._muted }
   ,set muted(b) {
this._muted = b
/*
if (b) {
  this._volume = this.volume
  this.volume = 0
}
else {
  if (this._volume != null)
    this.volume = this._volume
}
*/
    }

   ,play: function () {
this._paused = false
this._source.start()
this._event["playing"].run()
    }

   ,get paused() { return this._paused }

   ,pause: function () {
this._paused = true
this._source.stop()
    }

   ,get src() { return this._src }
   ,set src(p) {
this._src = p

this._init()
    }

   ,AV_init: function (file) { this._file = _files[file.name] = file }
  }

  return AudioObject

})();