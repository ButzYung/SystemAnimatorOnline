// CANVAS Matrix Rain Effect
// (2022-11-20)

function random(num) {
  return Math.floor(Math.random() * num)
}

function MatrixRain(width,height, para) {
  this.width  = width
  this.height = height

  if (para) {
    Object.assign(this, para)
  }

  this.grid_size_fixed = this.grid_size
  this.font_fixed = this.font || (this.grid_size && (this.grid_size + "px Arial"))

  if (this.mask_divider == null)
    this.mask_divider = 0
  if (this.mask_always_redraw == null)
    this.mask_always_redraw = true

// .greenness is now the best choce to determine Matrix color (.full_color is obsolete for this purpose), especially in 3D mode in which .full_color is always true
  if (this.full_color == null) {
    const full_color = returnBoolean("MatrixRainColor");
    this.full_color = (self.MMD_SA) ? true : full_color;
    if (this.greenness == null)
      this.greenness = (full_color) ? 0 : 1;
  }
  else {
    if (this.greenness == null)
      this.greenness = (this.full_color) ? 0 : 1;
  }

  if (this.play_on_idle == null)
    this.play_on_idle = returnBoolean("MatrixRainPlayOnIdle")
  if (this.use_AudioFFT == null)
    this.use_AudioFFT = returnBoolean("MatrixRainMusical")
  if (this.bg_opacity == null)
    this.bg_opacity = (self.MMD_SA) ? 0.125 : 0.25
  if (this.fadeout_opacity == null)
    this.fadeout_opacity = (self.MMD_SA) ? 1/3 : 0.4
  if (this.tail_ini == null)
    this.tail_ini = (self.MMD_SA) ? 0.5 : 0.25
  if (this.tail_end == null)
    this.tail_end = (self.MMD_SA) ? 0.25 : 0.25
  if (this.transparent_bg == null)
    this.transparent_bg = (self.MMD_SA) ? this.draw_bg : this.full_color;
  if (this.no_clipping == null)
    this.no_clipping = !!self.MMD_SA;

  this.rain_canvas = []
  this.rain = []
  this.rain_speed = []
  this.rain_head = []
  this.rain_tail = []

  this.canvas = document.createElement("canvas")
  this.canvas_mask = document.createElement("canvas")

// use WebGL 2D for processing green matrix rain
  if (use_WebGL_2D || (use_WebGL && !this.full_color && self.WebGL_2D)) {
    DEBUG_show("Use WebGL 2D - Matrix Rain", 2)
    WebGL_2D.createObject(this.canvas_mask, {})
    this.canvas_mask._WebGL_2D.fshader_2d_main +=
  '   gl_FragColor = vec4(gl_FragColor.rgb, (0.3* gl_FragColor.r + 0.59 * gl_FragColor.g + 0.11 * gl_FragColor.b));\n'
//  '   gl_FragColor = vec4(vec3(1.0), (0.3* gl_FragColor.r + 0.59 * gl_FragColor.g + 0.11 * gl_FragColor.b));\n'
  }

  if (this.char_list.indexOf(" ") != -1)
    this.word_list = this.char_list.split(" ")

  //misc, System Animator specific
  this._SA_active_count = 0
  this._SA_active_delay = 10
  this._SA_idle_count = this._SA_idle_count_max = 30
}

MatrixRain.prototype.char_list = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ' + 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲ';
MatrixRain.prototype.char_list_ini = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲ';

MatrixRain.prototype.matrixCreate = function (w,h) {
  if (!w)
    w = this.width
  if (!h)
    h = this.height
  this.width  = w
  this.height = h

  var canvas = this.canvas_matrix = document.createElement("canvas")
  canvas.width  = w
  canvas.height = h

  if (this.transparent_bg) {
    this.canvas_matrix_copy = document.createElement("canvas")
    this.canvas_matrix_copy.width  = w
    this.canvas_matrix_copy.height = h
  }
  else {
    var context = canvas.getContext("2d")
    context.fillStyle = 'rgb(0,' + Math.round(255*this.bg_opacity) + ',0)'
    context.fillRect(0,0,w,h)
  }

  var grid_size_old = this.grid_size
  var grid_size = this.grid_size = this.grid_size_fixed || Math.max(Math.ceil(w/128), 8)
//DEBUG_show([grid_size,w,h],0,1)
  this.font = this.font_fixed || (this.grid_size + "px Arial")

  var mw = this.matrix_width  = Math.ceil(w/grid_size)
  var mh = this.matrix_height = Math.ceil(h/grid_size)
  var char_list = this.char_list
  var char_list_ini = this.char_list_ini
  var word_list = this.word_list

  if (this.use_AudioFFT) {
    let f = (is_SA_child_animation) ? parent : self
    this.AudioFFT = f.AudioFFT_active
    if (this.AudioFFT) {
      this.matrixDraw_no_skip = true
/*
      if (grid_size_old && (grid_size_old != 128))
        this.AudioFFT.power_spectrum_divider = this.AudioFFT.power_spectrum_divider.filter(function (v) { return (v != grid_size_old) })
      if (this.AudioFFT.power_spectrum_divider.indexOf(mw) == -1)
        this.AudioFFT.power_spectrum_divider.push(mw)
*/
    }
    else {
// delayed AudioFFT connection (i.e. from media player)
      Object.defineProperty(this, "AudioFFT", {
  get: function () {
if (f.AudioFFT_active) {
  this.matrixDraw_no_skip = true
  return f.AudioFFT_active
}
return null
  }
      });
    }
  }
  else {
    this.AudioFFT = null
    this.matrixDraw_no_skip = false
  }

  var word = []
  var word_index = []

  var y_tail_ini = ~~(mh*this.tail_ini)
  var y_tail_end = ~~(mh*this.tail_end)

  for (var x = 0; x < mw; x++) {
    let c = document.createElement("canvas")
    c.width  = grid_size
    c.height = mh * grid_size

    let context = c.getContext("2d")
    context.font = this.font

    for (var y = mh-1; y > 0; y--) {
      let a = (y >= y_tail_ini) ? 1 : 1 - (y_tail_ini-y) / y_tail_end
      if (a < 0) continue

      context.globalAlpha = a
      context.strokeStyle = (y == mh-1) ? "#FFFFFF" : "#00FF00"

      let py = (y+0.8) * grid_size
      let txt
      if (word_list) {
        if (!word[x] || (word_index[x] < 0)) {
          word[x] = word_list[random(word_list.length)]
          word_index[x] = word[x].length-1
        }
        txt = word[x].charAt(word_index[x]--)
      }
      else
        txt = ((y==mh-1)?char_list_ini:char_list).charAt(random(char_list.length))
   
      context.strokeText(txt, 0,py)
    }

    this.rain_canvas[x] = c
  }

  if (self.MMD_SA) {
    let tex = this.matrix_texture = new THREE.Texture((this.draw_bg) ? this.canvas : this.canvas_matrix);
    tex.needsUpdate = true
//    tex.repeat.x = 10
    tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  }

  this.matrixReset()
}

MatrixRain.prototype.matrixReset = function () {
  // will become 'true' when all rains have fallen completely
  this.matrix_entered = false

  // will become 'true' when rains begin fading away
  this.matrix_leaving = false

  var mw = this.matrix_width
  var mh = this.matrix_height
  for (var x = 0; x < mw; x++) {
    let y1 = -(random(mh/5)+1)//random(mh) + mh - 1
    let y2 = y1 - mh - (random(mh/5)+1)
    this.rain[x] = [y1, y2]
    this.rain_head[x] = y1

    let speed// = random(3)+1
    switch (random(4)) {
case 0:
  speed = 3
  break
case 1:
  speed = 2
  break
case 2:
  speed = 1
  break
case 3:
  speed = 0.5
  break
    }

    this.rain_speed[x] = speed
  }
}

MatrixRain.prototype.matrixDraw = function (skip) {
  var canvas = this.canvas_matrix
  var w = canvas.width
  var h = canvas.height

  var context = canvas.getContext("2d")
  context.globalCompositeOperation = 'copy'

  if (skip && !this.matrixDraw_no_skip) {
    if (this.transparent_bg) {
      context.globalAlpha = 1
      context.drawImage(this.canvas_matrix_copy, 0,0)
    }
    return
  }

// draw from the previous frame to create a fading effect
  if (!this.matrixDraw_no_skip) {
    context.globalAlpha = this.fadeout_opacity
    context.drawImage(canvas, 0,0)
  }
  else
    context.clearRect(0,0,w,h)

  context.globalAlpha = 1
  if (!this.transparent_bg) {
    context.globalCompositeOperation = 'destination-over'
    context.fillStyle = 'rgb(0,' + Math.round(255*this.bg_opacity) + ',0)'
    context.fillRect(0,0,w,h)
  }

/*
  if (this.transparent_bg) {
    context.clearRect(0,0,w,h)
  }
  else {
    context.fillStyle = "#004000"
    context.fillRect(0,0,w,h)
  }
*/
  context.globalCompositeOperation = 'source-over'

  var grid_size = this.grid_size
  var mw = this.matrix_width
  var mw_fit = mw//Math.ceil(SL.width/grid_size)
  var mh = this.matrix_height
  var mhh = mh * grid_size

  var rain_still_falling = 0
  var rain_gone = 0

  var speed_update = !this.matrixDraw_no_skip || EV_sync_update.frame_changed("matrixDrawing")
  var _fft, _fft_last, _fft_size
  var aFFT = this.AudioFFT
  if (aFFT) {
    var size_list = [32, 16]//[mw_fit, mw, 128, 32, 16]
    for (var i = 0, i_max = size_list.length; i < i_max; i++) {
      _fft_size = size_list[i]
      _fft = aFFT["_fft" + _fft_size]
      if (_fft)
        break
      _fft_size = null
    }
//DEBUG_show(_fft_size+','+_fft.length+'/'+mw_fit)
    if (_fft_size) {
      _fft_last = aFFT["_fft_last" + _fft_size]
      if (!_fft_last)
        _fft_last = aFFT["_fft_last" + _fft_size] = []
    }
  }

  var decay_factor = (RAF_animation_frame_unlimited) ? 1 : 2;
  for (var x = 0; x < mw_fit; x++) {
    var rain = this.rain[x]
    var speed = (speed_update) ? this.rain_speed[x] : 0
    var head = this.rain_head
    var tail = this.rain_tail
//if (!rain) DEBUG_show(x+'/'+this.rain.length+'/'+mw_fit+'/'+mw,0,1)
    rain[0] += speed
    rain[1] += speed

    if (_fft) {
      var fft_index = ~~(x * (_fft_size/mw_fit))

      var v = _fft[fft_index]
      var v_last = _fft_last[fft_index] || 0
      if (v > 100)
        v = 100

      if (v < v_last - decay_factor)
        v = v_last - decay_factor
      _fft_last[fft_index] = v

      v = v/100
      if (Settings.MonitorSensitivity != 1)
        v = Math.pow(v, Settings.MonitorSensitivity)
      context.globalAlpha = v*0.9+0.1
    }
    else
      context.globalAlpha = 1

    var rain_c = this.rain_canvas[x]
    for (var i = 0; i < 2; i++) {
      var i_opposite = (i) ? 0 : 1
      if (~~(rain[i]) >= mh*2-1)
        rain[i] = (this.matrix_leaving) ? -9999 : rain[i_opposite] - mh - (random(mh/5)+1)

      var y = ~~(rain[i])
      if (this.matrix_leaving) {
        if (y < -999)
          rain_gone++
        if (rain[i_opposite] < -999) {
          if (y < -999)
            tail[x] = mh-1
          else {
            var r = tail[x]
            if (!r)
              r = 0
            if (r < y-(mh-1))
              tail[x] = y-(mh-1)
          }
        }
      }
      else if (!this.matrix_entered) {
        if (head[x] < y)
          head[x] = y
        if (head[x] < mh)
          rain_still_falling++
      }

      if ((y >= mh*2-3) || (y < 1))
        continue

      var sy

      var px = x * grid_size
      var py = (y - (mh-2)) * grid_size

      var pw = (px + grid_size > w) ? w - px : grid_size

      var ph = (mh-1) * grid_size
      if (py < 0) {
        ph += py
        py = 0
      }
      if (py + ph > h)
        ph = h - py

      var sy = (y <= mh-1) ? mhh - ph : 0

      context.drawImage(rain_c, 0,sy,pw,ph, px,py,pw,ph)
    }
  }

  context.globalAlpha = 1

  if (this.transparent_bg && !this.matrixDraw_no_skip) {
    context = this.canvas_matrix_copy.getContext("2d")
    context.globalCompositeOperation = 'copy'
    context.globalAlpha = 1
    context.drawImage(canvas, 0,0)
  }

  if (this.matrix_texture) {
    this.matrix_texture.needsUpdate = true
  }

  if (this.matrix_leaving) {
    if (rain_gone == mw*2)
      this.raining = false
  }
  else if (!rain_still_falling)
    this.matrix_entered = true
}

MatrixRain.prototype.maskDraw = function (obj, width,height) {
  var mask = this.canvas_mask
  var w = (width)  ? width  : obj.width
  var h = (height) ? height : obj.height

  var wxh = w + 'x' + h
  if (!this.mask_always_redraw && (mask.drawn == wxh))
    return
  mask.drawn = wxh

  var divider = this.mask_divider
  if (!divider) {
    if (this.mask_always_redraw && !mask._WebGL_2D) {
      divider = Math.sqrt(w*h) / 250
      if (divider < 1)
        divider = 1
    }
    else
      divider = 1
  }

  var dw,dh
  if (divider == 1) {
    dw = w
    dh = h
  }
  else {
    dw = ~~(w/divider)
    dh = ~~(h/divider)
//DEBUG_show(dw+'x'+dh)
  }
  mask.width  = dw
  mask.height = dh

  if (mask._WebGL_2D) {
// skip unnecessary canvas copy
// "divider" is practically ignored (ie. obj copied in full size)
    mask._WebGL_2D.draw(obj)
  }

  if (!mask._WebGL_2D) {
    var context = mask.getContext("2d")
    context.globalCompositeOperation = 'copy'
    context.drawImage(obj, 0,0,dw,dh)

    var frame = context.getImageData(0,0,dw,dh)
    var data = frame.data

    for (var i = 0, data_length = data.length; i < data_length; i+=4) {
//http://en.wikipedia.org/wiki/Grayscale#Converting_color_to_grayscale
//(0.3* color.R + 0.59 * color.G + 0.11 * color.B);
      var l = ~~(0.3*data[i] + 0.59*data[i+1] + 0.11*data[i+2])
      if (l < 250)
        data[i+3] = l
    }

    context.putImageData(frame, 0,0)
  }
}

MatrixRain.prototype.draw = function (obj, width,height) {
  var canvas = this.canvas
  var w = (width)  ? width  : obj.width
  var h = (height) ? height : obj.height

  if ((w > this.width) || (h > this.height)) {
    this.matrixCreate(w,h)
  }

  canvas.width  = w
  canvas.height = h

  var context = canvas.getContext("2d")
  if (this.full_color) {
    var m_canvas = this.canvas_matrix
    var m_context = m_canvas.getContext("2d")

    context.globalCompositeOperation = 'copy'
    if (Settings.UseCanvasPPE) {
      context.fillStyle = "#FFFFFF"
      context.fillRect(0,0,w,h)
    }
    else
      context.drawImage(obj, 0,0,w,h)

/*
context.globalCompositeOperation = 'source-over'
context.fillStyle = "rgba(255,255,255, 0.5)"
var grid_size = this.grid_size
var mw = this.matrix_width
for (var x = 0; x < mw; x++) {
  var rain = this.rain[x]
  for (var i = 0; i < 2; i++) {
    var sy = ~~(rain[i]) * grid_size
    if ((sy < 0) || (sy > h))
      continue

    var sx = x * grid_size
    var sw = (sx + grid_size > w) ? w - sx : grid_size
    var sh = (sy + grid_size > h) ? h - sy : grid_size

    context.fillRect(sx,sy,sw,sh)
  }
}
*/

    m_context.globalCompositeOperation = 'source-in'
    m_context.drawImage(canvas, 0,0)

/*
context.globalCompositeOperation = 'copy'
context.drawImage(obj, 0,0,w,h)
*/

    context.globalCompositeOperation = 'source-atop'
    context.fillStyle = 'rgba(0,0,0,' + (1-this.bg_opacity) + ')'
    context.fillRect(0,0,w,h)

    context.globalCompositeOperation = 'source-over'
    context.drawImage(m_canvas, 0,0)
  }
  else {
    context.globalCompositeOperation = 'copy'
    context.drawImage(this.canvas_matrix, 0,0)

    context.globalCompositeOperation = 'destination-in'
    if (Settings.UseCanvasPPE) {
      context.fillStyle = "#FFFFFF"
      context.fillRect(0,0,w,h)
    }
    else {
      this.maskDraw(obj, w,h)
      context.drawImage(((this.canvas_mask._WebGL_2D && this.canvas_mask._WebGL_2D.canvas) || this.canvas_mask), 0,0,w,h)
    }

    context.globalCompositeOperation = 'destination-atop'
    context.fillStyle = "#000000"
    context.fillRect(0,0,w,h)

    context.globalCompositeOperation = 'destination-in'
    if (Settings.UseCanvasPPE) {
      context.fillStyle = "#FFFFFF"
      context.fillRect(0,0,w,h)
    }
    else
      context.drawImage(obj, 0,0,w,h)
  }

  if (this.content_mask) {
    context.globalCompositeOperation = 'destination-in'
    context.drawImage(this.content_mask_load(w,h), 0,0)

    context.globalCompositeOperation = 'destination-over'
    if (Settings.UseCanvasPPE) {
      context.fillStyle = "#FFFFFF"
      context.fillRect(0,0,w,h)
    }
    else
      context.drawImage(obj, 0,0,w,h)
  }

  if (this.matrix_entered || this.no_clipping)
    return

  var grid_size = this.grid_size
  var rain = (this.matrix_leaving) ? this.rain_tail : this.rain_head

  context.save()

  context.beginPath()

  var px,py
  py = rain[0]
  if (!py)
    py = 0
  py *= grid_size
  if (py > h)
    py = h
  var py0 = py
  context.moveTo(0,py0)
  context.lineTo(grid_size,py0)

  for (var x = 1, max = this.matrix_width; x < max; x++) {
    py = rain[x]
    if (!py)
      py = 0
    py *= grid_size
    if (py > h)
      py = h
    px = x * grid_size
    context.lineTo(px,py)

    px += grid_size
    if (px > w)
      px = w
    context.lineTo(px,py)
  }

  var h_edge = (this.matrix_leaving) ? 0 : h
  context.lineTo(w,h_edge)
  context.lineTo(0,h_edge)
  context.lineTo(0,py0)

  context.clip()

  context.globalCompositeOperation = 'source-over'
  if (Settings.UseCanvasPPE) {
    context.fillStyle = "#FFFFFF"
    context.fillRect(0,0,w,h)
  }
  else
    context.drawImage(obj, 0,0,w,h)

  context.restore()
}

Object.defineProperty(MatrixRain.prototype, "content_mask",
{
  get: function () {
return ((this.content_mask_obj) ? this.content_mask_ : "")
  }

 ,set: function (v) {
this.content_mask_ = v
this.content_mask_obj = null

var img = new Image()
img.matrix_rain = this
img.onload = function () {
  var matrix_rain = this.matrix_rain
  matrix_rain.content_mask_obj = this

  var c = matrix_rain.content_mask_canvas
  if (!c)
    c = matrix_rain.content_mask_canvas = document.createElement("canvas")
  c.width = c.height = 0
}

img.src = toFileProtocol(v)
  }
});

MatrixRain.prototype.content_mask_load = function (w,h) {
  var c = this.content_mask_canvas
  if ((c.width == w) && (c.height == h))
    return c

  c.width  = w
  c.height = h

  var context = c.getContext("2d")
  context.globalCompositeOperation = 'copy'

  var obj = this.content_mask_obj
  context.drawImage(obj, 0,0,obj.width,obj.height, 0,0,w,h)

  return c
}


// System Animator specific

var MatrixRain_para

Object.defineProperty(MatrixRain.prototype, "_SA_active",
{
  get: function () {
var count = (!this._PC_count_absolute) ? 1 : PC_count_absolute - this._PC_count_absolute
this._PC_count_absolute = PC_count_absolute

var idle = (this.play_on_idle) ? false : ((this._SA_reversed) ? (EV_usage_float) : (!EV_usage_float))
if (idle) {
  this._SA_active_count = 0

  if (!this._SA_idle_count_max)
    return true
  if (!this.raining)
    return false

  this._SA_idle_count += count
  if (this._SA_idle_count >= this._SA_idle_count_max) {
    if (!this.matrix_leaving) {
      this.matrix_leaving = true
      this.matrix_entered = false
      this.rain_tail = []
    }
  }
}
else {
  this._SA_idle_count = 0

  this._SA_active_count += count
  if (this._SA_active_count == this._SA_active_delay) {
    this.raining = true
    if (this.matrix_leaving) {
      this.matrix_leaving = false
      this.matrixReset()
    }
  }
}

return this.raining
  }
});
