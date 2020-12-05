// BPM detection portable (2020-10-27)

var Audio_BPM_detection_portable = (function () {

  function process_decoded(buffer, para, func_callback) {
//console.log(buffer.sampleRate)
//console.log(buffer.length)
//console.log(buffer.duration)
//console.log(buffer.numberOfChannels)
/*
para._buffer = buffer
var c = para._context = new AudioContext()

var source = para._source = c.createBufferSource();
source.buffer = buffer;
source.connect(c.destination);
source.start()
setTimeout(function () {
DEBUG_show(c.currentTime,0,1)

source.disconnect()

source = para._source = c.createBufferSource();
source.buffer = buffer;
source.connect(c.destination);
source.start(0,20)
setTimeout(function () { DEBUG_show(c.currentTime,0,1) }, 100)

}, 10*1000)

return
*/

    // Create buffer source
    var source = offlineContext.createBufferSource();
    source.buffer = buffer;

    // Create filter
    var filter = offlineContext.createBiquadFilter();
    filter.type = "lowpass";

    // Pipe the song into the filter, and the filter into the offline context
    source.connect(filter);
    filter.connect(offlineContext.destination);
//source.connect(offlineContext.destination);

    // Schedule the song to start playing at time:0
    source.start(0);

/*
buffer.getChannelData(0)
DEBUG_show(buffer.getChannelData(0).length+'/'+(new Float32Array(buffer.getChannelData(0).buffer)).length,0,1)
return
*/

var w = new Worker("js/audio_BPM_detection.js")
//console.log(w)
w.onmessage = function(e) {
//DEBUG_show(e.data)
  if (typeof e.data == "string") {
    if (e.data == "OK") {

if (para.BPM_by_id3) {
  w.postMessage(para.BPM_by_id3)
}

//Passing data by transferring ownership (transferable objects)
//https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API/Using_web_workers
let _buffer = buffer.getChannelData(0).buffer
w.postMessage(_buffer, [_buffer])

_buffer = undefined

return
    }
    DEBUG_show(e.data)
  }
  else {
    func_callback(e.data)
  }
};
  }

  function process_Aurora(para, func_callback) {
// https://github.com/audiocogs/aurora.js/issues/122
var asset = para.AV_asset = Aurora.Asset.fromFile(para._file)
asset.on("error", function (err) { console.log(err) })
/*
//para.AV_player = new Aurora.Player(asset)
para.AV_player = Aurora.Player.fromFile(para._file)
para.AV_player.play()
return
*/
//asset.get("metdadata", function (obj) { console.log(obj) })
//asset.on("data", function (buffer) { DEBUG_show(Date.now()); console.log(buffer); })
//asset.start()
//return
asset.decodeToBuffer(function(buffer) {
//var p = Aurora.Player.fromFile(para._file)
//p.play()
//return
  var channels = asset.format.channelsPerFrame;
  var samples = buffer.length/channels;
//offlineContext = new OfflineAudioContext(channels, samples, asset.format.sampleRate);
  var audioBuf = offlineContext.createBuffer(channels, samples, asset.format.sampleRate);
  var audioChans = [];
  for(var i = 0; i < channels; i++) {
      audioChans.push(audioBuf.getChannelData(i));
  }
  for(var i = 0, i_max = buffer.length; i < i_max; i++) {
      audioChans[i % channels][Math.round(i/channels)] = buffer[i];
  }
  // Do something with your fancy new audioBuffer

  System._gadget_resume()

  process_decoded(audioBuf, para, func_callback)//function (data) {DEBUG_show(999,0,1);console.log(data);})
});
  }

  var offlineContext

  function ajax_decode(filepath, para, func_callback) {
    var request = new XMLHttpRequest();

    request.onload = function() {
      offlineContext.decodeAudioData(request.response, function(buffer) {
        process_decoded(buffer, para, func_callback)
      });
    };

    request.open('GET', filepath, true);
    request.responseType = 'arraybuffer';
    request.send()
  }

  return function (filepath, para, func_callback) {
if (!para)
  para = {}

DEBUG_show("(Loading audio file...)")

// Create offline context
offlineContext = new OfflineAudioContext(1, 2, 44100);
//offlineContext = new AudioContext();

//console.log(filepath)
if (self.browser_native_mode && para._file) {
  if (/\.(mp3|aac)$/i.test(para._file.name)) {
    jsmediatags.read(para._file, {
  onSuccess: function(tag) {
console.log(tag);
if (tag && tag.tags && tag.tags.TBPM) {
  para.BPM_by_id3 = tag.tags.TBPM.data && parseFloat(tag.tags.TBPM.data)
  console.log("BPM_by_id3:" + para.BPM_by_id3)
}

ajax_decode(filepath, para, func_callback)
  },
  onError: function(error) {
console.log(error);

ajax_decode(filepath, para, func_callback)
  }
    });
  }
  else {
    ajax_decode(filepath, para, func_callback)
//    process_Aurora(para, func_callback)
  }
}
else if (self.WallpaperEngine_CEF_mode && para._file) {
/*
id3(para._file, function(err, tags) {
console.log(err)
console.log(tags)
    });
*/
  System._gadget_pause()

  if (/\.(mp3|aac)$/i.test(para._file.name)) {
    jsmediatags.read(para._file, {
  onSuccess: function(tag) {
console.log(tag);
if (tag && tag.tags && tag.tags.TBPM) {
  para.BPM_by_id3 = tag.tags.TBPM.data && parseFloat(tag.tags.TBPM.data)
  console.log("BPM_by_id3:" + para.BPM_by_id3)
}

process_Aurora(para, func_callback)
  },
  onError: function(error) {
console.log(error);

process_Aurora(para, func_callback)
  }
    });
  }
  else {
    process_Aurora(para, func_callback)
  }
}
else {
  ajax_decode(filepath, para, func_callback)
}
  };

})();
