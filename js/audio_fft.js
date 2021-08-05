// Audio FFT (2021-08-06)

var AudioFFT = {
/*
  SAMPLE_SIZE: 2048
 ,SAMPLE_RATE: 44100
 ,
*/
  smoothingTimeConstant: 0
 ,fftSize: 512*2

 ,_fft: []
 ,spectrum: null
 ,power_spectrum_divider: []

 ,use_live_input: Settings.UseAudioFFTLiveInput

 ,initialized: false
 ,init: function () {
if (this.initialized)
  return
this.initialized = true

if (this.use_live_input && (!WallpaperEngine_CEF_mode || !SA_topmost_window.wallpaperRegisterAudioListener))
  this.init_live()

DEBUG_show("Use audio FFT" + ((this.use_live_input) ? " (LIVE)" : ""), 2)

if (is_SA_child_animation)
  parent.AudioFFT_active = this
else
  self.AudioFFT_active = this

var w = (is_SA_child_animation) ? parent : self
var w_list = [w]
for (var i = 0; i < SA_child_animation_max; i++) {
  if (w.SA_child_animation[i])
    w_list.push(w.document.getElementById("Ichild_animation" + i).contentWindow)
}

for (var i = 0, i_max = w_list.length; i < i_max; i++) {
  var w = w_list[i]
  if (w.AudioFFT && (w.MMD_SA && w.MMD_SA_options.use_CircularSpectrum)) {
    w.MMD_SA.AudioFFT = this
    if (this.power_spectrum_divider.indexOf(128) == -1)
      this.power_spectrum_divider.push(128)
    this._fft_last128 = []
    break
  }
}

var EQbands = 16
BeatDetektor.config_default.BD_DETECTION_RANGES = EQbands
this.bd = new BeatDetektor();
this.kick_det = new BeatDetektor.modules.vis.BassKick();
this.vu = new BeatDetektor.modules.vis.VU();

if (WallpaperEngine_CEF_mode && SA_topmost_window.wallpaperRegisterAudioListener) {
  this.restartCaptureAudioWE = (function () {
var updated = false

var pinkNoise = [
1.1760367470305,0.85207379418243,0.68842437227852,0.63767902570829,
0.5452348949654,0.50723325864167,0.4677726234682,0.44204182748767,0.41956517802157,
0.41517375040002,0.41312118577934,0.40618363960446,0.39913707474975,0.38207008614508,
0.38329789106488,0.37472136606245,0.36586428412968,0.37603017335105,0.39762590761573,
0.39391828858591,0.37930603769622,0.39433365764563,0.38511504613859,0.39082579241834,
0.3811852720504,0.40231453727161,0.40244151133175,0.39965366884521,0.39761103827545,
0.51136400422212,0.66151212038954,0.66312205226679,0.7416276690995,0.74614971301133,
0.84797007577483,0.8573583910469,0.96382997811663,0.99819377577185,1.0628692615814,
1.1059083969751,1.1819808497335,1.257092297208,1.3226521464753,1.3735992532905,
1.4953223705889,1.5310064942373,1.6193923584808,1.7094805527135,1.7706604552218,
1.8491987941428,1.9238418849406,2.0141596921333,2.0786429508827,2.1575522518646,
2.2196355526005,2.2660112509705,2.320762171749,2.3574848254513,2.3986127976537,
2.4043566176474,2.4280476777842,2.3917477397336,2.4032522546622,2.3614180150678
];

var capture_audio = function () {
  updated = true

  SA_topmost_window.wallpaperRegisterAudioListener(function(data) {
/* data is an array with 128 floats */
//DEBUG_show(data)
    updated = true

    var has_audio = 0
    var f = (Settings_WE.SA_visualizer_scale||1) * 100
    for( var i = 0; i < 64; i++ ) {
      data[i]    = ~~(data[i]    / pinkNoise[i] * f);
      data[i+64] = ~~(data[i+64] / pinkNoise[i] * f);
      if (data[i] || data[i+64])
        has_audio = 30
    }

    if (!has_audio) {
      if (AudioFFT._has_audio)
        AudioFFT._has_audio--
    }
    else
      AudioFFT._has_audio = has_audio

    AudioFFT.WE_audio_data = data
  });
};
/*
var audio_capture_restart_timerID

Seq.item("WE_CheckAudioCapture").At(1, function () {
  if (updated) {
    updated = false

    if (audio_capture_restart_timerID)
      clearTimeout(audio_capture_restart_timerID)

    audio_capture_restart_timerID = setTimeout(function () {
audio_capture_restart_timerID = null
if (!updated) {
  DEBUG_show("(WE audio capture restarted)", 2)
  capture_audio()
}
    }, 5000);
  }
}, -1, 1);
Seq.item("WE_CheckAudioCapture").Play()
*/

// Always delay it to (hopefully) reduce possibility of startup hanging.
setTimeout(function () {
  DEBUG_show("(WE audio capture started)", 2)
  capture_audio()
}, 500);

return function () {
  setTimeout(function () {
    DEBUG_show("(WE audio capture restarted)", 2)
    capture_audio()
  }, 500);
};
  })();

  return
}

var bin_factor = 1//(xul_mode) ? 0.45 : 1

//http://en.wikipedia.org/wiki/Decibel#Definition
//http://stackoverflow.com/questions/14169317/interpreting-web-audio-api-fft-results
var dB_gain = ((this.use_live_input) ? Settings.UseAudioFFTLiveInputGain : 1) + (this.input_gain || 0)
dB_gain = (Math.log(dB_gain) / Math.LN10) * 10 / 0.5
if (bin_factor < 1)
  dB_gain /= Math.pow(bin_factor, 2/10)

//http://documentation.apple.com/en/soundtrackpro/usermanual/index.html#chapter=B%26section=1%26tasks=true
// 20-20k Hz, mid = 1k, exponential graph (when x=0, it's mid 1k(y=1))
var e_max = Math.log(20*bin_factor)

this.bin_factor = bin_factor
this.dB_gain = dB_gain
this.e_max = e_max

var audio_context = (self.AudioContext || self.webkitAudioContext || self.mozAudioContext);
this.context = new audio_context();

this.analyser = this.context.createAnalyser();
this.analyser.smoothingTimeConstant = this.smoothingTimeConstant;
this.analyser.fftSize = this.fftSize;
  }

 ,initialized_live: false
 ,init_live: function () {
if (this.initialized_live)
  return
this.initialized_live = true

if (WallpaperEngine_CEF_mode && window.wallpaperRegisterAudioListener) {
  this.live_stream = this.source = {}
  this.connect()
  return
}

var that = this

navigator.mediaDevices.getUserMedia({video: false, audio: true}).then(function(stream) {
//DEBUG_show(stream.getAudioTracks()[0].readyState,0,1)
  AudioFFT.live_stream = stream
  AudioFFT.connect()
}).catch(function(err) {
//  DEBUG_show("getUserMedia ERROR:" + err,0,1)
  DEBUG_show("(getUserMedia for live audio failed)", 5)
  that.use_live_input = false
  console.error(err)
});

  }

 ,connect: function (media_obj) {
if (media_obj) {
  if (WallpaperEngine_CEF_mode && !browser_native_mode)
    return

  var ao = (is_SA_child_animation) ? parent.AudioFFT_active : self.AudioFFT_active
  if (ao && ao.use_live_input)
    return

  if (this.media_obj == media_obj)
    return
  this.media_obj = media_obj
}

this.init()

if (this.live_stream) {
  if (this.source)
    return

  this.source = this.context.createMediaStreamSource(this.live_stream);
/*
  var gain = this.context.createGain()
//gain.gain.value = Settings.UseAudioFFTLiveInputGain
  this.source.connect(gain)

  this.source = gain
*/
}
else {
  var source_new = this.context.createMediaElementSource(media_obj);
  if (this.source) {
    this.source.disconnect();
    this.analyser.disconnect();
  }
  this.source = source_new;
}

this.source.connect(this.analyser);

if (!this.live_stream) {
  this.analyser.connect(this.context.destination);
}
  }

 ,bin_table: []
 ,process: function () {
var m = this.media_obj
if (m) {
  if (m.paused || m.ended || !m.currentTime) {
    this.rEQBand = this.rBD = null
    if (m.ended || !m.currentTime) {
      var rHost = (is_SA_child_animation) ? parent : self
      rHost._rEQBand = rHost._rBD = null
    }
    return
  }
}
else {
  this.init_live()
  if (!this.source)
    return
}

var fft, fft16, fft32
fft = fft16 = []

var divider_list = (Settings.Use32BandSpectrum) ? [16,32] : [16]
divider_list = divider_list.concat(this.power_spectrum_divider)

var getFreqDataB = this.getFreqDataB
var getTimeDomainB
var music_canvas

var w_MMD = (self.MMD_SA && self) || (parent.MMD_SA && parent)
if (w_MMD) {
  var EC = w_MMD.MMD_SA_options.MME && w_MMD.MMD_SA_options.MME.PostProcessingEffects
  music_canvas = EC && EC._music_canvas
  if (music_canvas) {
    getFreqDataB = true
    getTimeDomainB = true
    EC._texture_common['[music canvas]'].needsUpdate = true
  }
}

if (WallpaperEngine_CEF_mode && SA_topmost_window.wallpaperRegisterAudioListener) {
  var data = this.WE_audio_data
  if (!data)
    return

  if (music_canvas) {
    var ctx = music_canvas.getContext("2d")
    var imgData = ctx.getImageData(0,0, 512,2)

    var _data = imgData.data
    var _d, _v

    var da = []
    for (var d = 0; d < 64; d++) {
      var f_new, f_old, f

      f_new = ~~(Math.min(data[d+64]*2.56, 255))
      f_old = _data[(512+d*4+3)*4]
      if (f_new >= f_old)
        f = f_new
      else {
        f = Math.max(f_old-10, f_new)
      }
      da[d+64] = f

      f_new = ~~(Math.min(data[63-d]*2.56, 255))
      f_old = _data[(512+256+d*4+3)*4]
      if (f_new >= f_old)
        f = f_new
      else {
        f = Math.max(f_old-10, f_new)
      }
      da[63-d] = f
    }

    for (var d = 0; d < 64; d++) {
      var f0, f1

      f0 = (d == 0) ? 0 : da[(d-1)+64]
      f1 = da[d+64]
      _d = 512+d*4
      _v = ~~(f0*0.75 + f1*0.25)
      for (var i = 0; i < 4; i++)
        _data[(_d)*4+i]   = _v
      _v = ~~(f0*0.5  + f1*0.5)
      for (var i = 0; i < 4; i++)
        _data[(_d+1)*4+i] = _v
      _v = ~~(f0*0.25 + f1*0.75)
      for (var i = 0; i < 4; i++)
        _data[(_d+2)*4+i] = _v
      _v = f1
      for (var i = 0; i < 4; i++)
        _data[(_d+3)*4+i] = _v

      f0 = da[63-(d-1)]
      f1 = da[63-d]
      _d = 512+256+d*4
      _v = ~~(f0*0.75 + f1*0.25)
      for (var i = 0; i < 4; i++)
        _data[(_d)*4+i]   = _v
      _v = ~~(f0*0.5  + f1*0.5)
      for (var i = 0; i < 4; i++)
        _data[(_d+1)*4+i] = _v
      _v = ~~(f0*0.25 + f1*0.75)
      for (var i = 0; i < 4; i++)
        _data[(_d+2)*4+i] = _v
      _v = f1
      for (var i = 0; i < 4; i++)
        _data[(_d+3)*4+i] = _v
    }

    if (this._AV_buffer) {
      var _buffer = this._AV_buffer
      var f = ~~(_buffer.length/512)
      for (var d = 0; d < 512; d++) {
        _d = (0+d)*4
        _data[_d] = _data[_d+1] = _data[_d+2] = _data[_d+3] = ~~(_buffer[d*f]*128+128)
      }
    }
    else {
      for (var d = 0; d < 512; d++) {
        _d = (0+d)*4
        _data[_d] = _data[_d+1] = _data[_d+2] = _data[_d+3] = _data[(512+d)*4]
      }
    }

    ctx.putImageData(imgData, 0,0)
  }

  for (var _d = 0, _d_max = divider_list.length; _d < _d_max; _d++) {
    var divider = divider_list[_d]
    var _fft = []
    if (divider == 128) {
      for (var d = 0; d < 64; d++) {
        _fft[d] = data[d+64]
        _fft[d+64] = data[63-d]
      }
    }
    else {
      for (var d = 0, d_max = divider; d < d_max; d++) {
        var v = 0
        var r_max = 64/divider
        for (var r = 0; r < r_max; r++)
          v += data[d+r]
        _fft[d] = v / r_max
      }
    }

    if (_d == 0)
      fft = _fft
    self["fft" + divider] = this["_fft" + divider] = _fft
  }
}
// Web Audio API processing START
else {

var length = this.analyser.frequencyBinCount
var freqData = new Float32Array(length);
this.analyser.getFloatFrequencyData(freqData);

var length_fftSize = this.analyser.fftSize

if (getTimeDomainB) {
  this.timeDomainB = new Uint8Array(length_fftSize)
  this.analyser.getByteTimeDomainData(this.timeDomainB);
}

if (getFreqDataB) {
//DEBUG_show(length)
  this.freqDataB = new Uint8Array(length)
  this.analyser.getByteFrequencyData(this.freqDataB);
}

if (music_canvas) {
  var ctx = music_canvas.getContext("2d")
  var imgData = ctx.getImageData(0,0, 512,2)

  var _data = imgData.data
  var _freqDataB = this.freqDataB
  var _timeDomainB = this.timeDomainB

  var _scale

  _scale = length_fftSize/512
  for (var i = 0; i < 512; i++) {
    _data[i*4] = _data[i*4+1] = _data[i*4+2] = _data[i*4+3] = _timeDomainB[~~(i * _scale)]
  }


  _scale = length/512 * 0.65
  for (var i = 0; i < 512; i++) {
    var _i = 512+i

    var f_old = _data[_i*4]
    var f_new = _freqDataB[~~(i * _scale)]
    var f
    if (f_new >= f_old)
      f = f_new
    else {
      f = Math.max(f_old-10, f_new)
    }

    _data[_i*4] = _data[_i*4+1] = _data[_i*4+2] = _data[_i*4+3] = f
  }

  ctx.putImageData(imgData, 0,0)
}

var bin_factor = this.bin_factor
var dB_gain = this.dB_gain
var e_max = this.e_max

length = ~~(length * bin_factor)
// -0.0001 at the end to prevent accessing bins beyond the end due to round-up issue
var bin_mid = length/(20*bin_factor) - 0.0001

var powerData = []
//var peak_dB=0
for (var i = 0; i < length; i++) {
  var dB = freqData[i] + dB_gain + 100
//if (peak_dB < dB) peak_dB = dB
  powerData[i] = Math.pow(10, (dB) / 10)
}
//DEBUG_show(peak_dB)

for (var _d = 0, _d_max = divider_list.length; _d < _d_max; _d++) {
  var divider = divider_list[_d]
  var _fft = []

  var b_tag = bin_mid + "x" + divider
  var b_table = this.bin_table[b_tag]
  if (!b_table) {
//DEBUG_show(b_tag,0,1)
    b_table = this.bin_table[b_tag] = []

    var d1 = divider/2-1
    var d2 = divider/2
    var b_end = 0
    var power_factor = 2/3
    if (bin_factor < 1)
      power_factor += (1-power_factor) * (1-bin_factor)
    for (var i = 0; i < divider; i++) {
      var bb
      bb = b_table[i] = {}

      var f = Math.pow(Math.E, (i-d1)/d2 * e_max)
      bb.power_factor = Math.pow(f, power_factor)
      bb.ini = b_end
      bb.end = b_end = f * bin_mid
    }
//if (divider==8) console.log(b_table)
  }

  var b_ini, b_end, b_ini_i, b_end_i
  var b_counter = 0
  for (var i = 0; i < divider; i++) {
    var bb = b_table[i]
    b_ini = bb.ini
    b_end = bb.end
    b_ini_i = ~~(b_ini)
    b_end_i = ~~(b_end)

    var power_total = 0
    var run_flag = true
    while (run_flag) {
      var scale = 1
      var counter_inc = false
      if (b_counter == b_ini_i)
        scale -= b_ini - b_ini_i
      if (b_counter == b_end_i) {
        run_flag = false
        scale -= (b_end_i+1) - b_end
        if (!scale)
          break
      }
      else
        counter_inc = true

      power_total += powerData[b_counter] * scale

      if (counter_inc)
        b_counter++
    }

    power_total *= bb.power_factor

    var dB = (Math.log(power_total) / Math.LN10) * 10
    dB = (dB < 30) ? 0 : (dB - 30) / 0.7
    dB = Math.pow(dB, 3)/2000

    _fft[i] = ~~(dB)
  }

  if (_d == 0)
    fft = _fft
  self["fft" + divider] = this["_fft" + divider] = _fft
}

}
// Web Audio API processing END

// Beat detection START
var EQbands = 16
var BD_mod = 500

var EQ_for_bd = []
for (var i = 0; i < EQbands; i++) {
  EQ_for_bd[i] = fft[i] / BD_mod
}

this.bd.process((Date.now())/1000, EQ_for_bd);
this.kick_det.process(this.bd);
this.vu.process(this.bd);

var vu_levels = (this.vu.vu_levels.length) ? this.vu.vu_levels.slice(0,EQbands) : [0,0,0,0,0, 0,0,0,0,0, 0,0,0,0,0, 0];
for (var i = 0; i < EQbands; i++)
  vu_levels[i] = ~~(vu_levels[i] * 100 * 10/7)
/*
if (!this._vu_max) this._vu_max = 0
for (var i = 0; i < 16; i++) { if (this._vu_max < vu_levels[i]) this._vu_max = vu_levels[i] }
DEBUG_show(this._vu_max)
*/
var bass_kicked = this.kick_det.isKick()
// END

var rHost = (is_SA_child_animation) ? parent : self
this.rEQBand = rHost._rEQBand = '[' + fft.join(',') + ']'
this.rBD = rHost._rBD = '{"bass_kicked":' + bass_kicked + ',"vu_levels":[' + vu_levels.join(',') + ']}'

for (var _d = 1, _d_max = divider_list.length; _d < _d_max; _d++) {
  var divider = divider_list[_d]
  this["rEQBand" + divider] = rHost["_rEQBand" + divider] = '[' + self["fft" + divider].join(',') + ']'
}
  }
};


(function () {
  if (AudioFFT.use_live_input) {
    if (is_SA_child_animation && !parent.AudioFFT_active)
      parent.AudioFFT_active = AudioFFT
    else
      self.AudioFFT_active = AudioFFT
  }
})();


// beat detection
var AT_bass_band = 0
document.write('<script language="JavaScript" src="js/beatdetektor.js"></scr'+'ipt>')
