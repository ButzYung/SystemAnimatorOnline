// ripple effect (v1.2.0)

var use_EQP_ripple

var EQP_Ripple = {
  name: "Ripple"

 ,_init: function () {
CanvasEffect_Inherit(this)
this.load_options()

for (var i = 0; i < 7; i++) {
  this.ripple_source[i] = {
    eq: [i*2+1, i*2+2]
   ,u_last: -1
   ,color: this.ripple_color[i]
   ,count: this.ripple_source_count_max - 50
  }
}

Canvas_Effect = this
  }


 ,opacity_mod: 1
 ,radius_mod: 1

 ,ripple_color: [[255,0,0], [255,127,0], [255,255,0], [0,255,0], [0,0,255], [75,0,130], [127,0,255]]
 ,ripple_source_count_max: 250
 ,ripple_source: []
 ,ripple_count_max: 10
 ,ripple: []

 ,_ripple_filter: function (v) {
return (--v.count > 0)
  }

 ,draw: function (clear_before_drawing) {
var canvas = this.canvas
if (!canvas)
  return

// using "2/EV_sync_update.count_to_10fps_" instead of 0.5 generates error
var mod = (use_full_fps) ? 0.5 : 1

// update START
this.ripple = this.ripple.filter(this._ripple_filter)

var rs = this.ripple_source
var opacity_mod = (this.opacity_mod)// ? this.opacity_mod : 1 + (Settings.BDOpacity-1)/3
for (var i = 0; i < rs.length; i++) {
  var r = rs[i]

  var u = 0
  var eq = r.eq
  for (var k = 0; k < eq.length; k++)
    u += EV_usage_sub.sound_raw[eq[k]].usage_raw * Sound_EQBand_mod
  u /= eq.length
  u = EV_usage_PROCESS(null, u)

  var u_peak = 0
  if (u) {
    u_peak = u + (u - r.u_last)
    var u_max = this.ripple_source_count_max/2
    if (u_peak < 1)
      u_peak = 1
    else if (u_peak > u_max)
      u_peak = u_max
  }
  r.u_last = u

  r.count += ((u_peak) ? u_peak*0.9 + 10 : 0) * mod
  if (r.count < this.ripple_source_count_max)
    continue
  r.count = 0

  u /= 100
  var ripple = {
    count: this.ripple_count_max / mod
   ,color: r.color
   ,radius: 1/3 + u*2/3
   ,opacity: (1/3 + u*1/3) * opacity_mod
   ,x: Math.random()
   ,y: Math.random()
  }

  this.ripple.push(ripple)
}

var cw = canvas.width
var ch = canvas.height
var context = canvas.getContext("2d")

if (clear_before_drawing)
  context.clearRect(0,0, cw,ch)

if (!this.ripple.length) {
  this.drawn = false
  return
}
// END

// draw
this.drawn = true

var rx,ry, rw,rh, rd, dim
if (this.mask_absolute_mapping && this.mask_canvas_source && !this._use_default_canvas) {
  var cs = this.mask_canvas_source
  rw = (this.width)  ? this.width  : cs.width
  rh = (this.height) ? this.height : cs.height
  dim = this.resize(rw,rh, document.body.style.pixelWidth)
}
else
  dim = [0,0, cw,ch]
rx = dim[0]
ry = dim[1]
rw = dim[2]
rh = dim[3]
rd = (rw < rh) ? rw : rh

var PI = Math.PI


context.save()

context.globalAlpha = 1
context.globalCompositeOperation = 'source-over'

var _context
var cb = this.canvas_buffer
if (cb) {
  cb.width  = canvas.width
  cb.height = canvas.height
  _context = cb.getContext("2d")
  _context.globalCompositeOperation = 'source-over'
}
else
  _context = context

var beat = (EV_usage_sub && EV_usage_sub.BD) ? EV_usage_sub.BD.beat2 : 0
_context.lineWidth = rd / 50 * (1+beat*(Settings.BDScale+1))

var radius_mod = this.radius_mod

for (var i = 0, i_max = this.ripple.length; i < i_max; i++) {
  var r = this.ripple[i]
  var c = r.count / this.ripple_count_max

  var x = Math.round(r.x * rw + rx)
  var y = Math.round(r.y * rh + ry)
  var radius = Math.round((r.radius * rd) * 0.2 * radius_mod * (2-c))

  _context.strokeStyle = "rgba(" + r.color.join(",") + "," + (r.opacity * (c)) + ")"

  _context.beginPath()
  _context.moveTo(x+radius, y)
  _context.arc(x,y, radius, 0,PI*2)
  _context.stroke()
}

if (this.mask_canvas_source) {
  this.mask_resize()

  _context.globalCompositeOperation = 'destination-in'
  _context.drawImage(this.mask_canvas, rx,ry)
}

if (cb)
  context.drawImage(cb, 0,0)

context.restore()

if (canvas._WebGL_2D) {
  if (canvas.id == "SL")
    WebGL_2D_must_redraw = true
  else
    canvas._WebGL_2D.draw()
}
  }
}


EQP_Ripple._init()
