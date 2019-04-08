// Canvas effects CORE (v1.3.0)

var CanvasEffect_options

function CanvasEffect_Inherit(child) {
  child.options_length = 0

  child.load_options = function (options) {
if (!options) {
  if (CanvasEffect_options)
    options = CanvasEffect_options
  else
    options = {}
}

CanvasEffect_options = options

for (var p in options) {
  this[p] = options[p]
  this.options_length++
}

if (!this.x)
  this.x = 0
if (!this.y)
  this.y = 0

if (this.mask) {
  var that = this
  if (this.mask == "(SVG Clock)") {
    if (self.use_SVG_Clock) {
      // dummy
      this.mask_canvas_source = document.createElement("canvas")
    }
    else
      this.mask = null
  }
  else if (/^\((\d+)x(\d+)\)$/.test(this.mask)) {
    var w = parseInt(RegExp.$1)
    var h = parseInt(RegExp.$2)
    this.mask_canvas_source = System._browser.BGMask_CreateCanvas('(feather|' + w + '|' + h + ')')
  }
  else {
    var mask = new Image()
    mask.onload = function () { that.mask_onload(this) }
console.log(this.mask)
    mask.src = toFileProtocol(Settings.f_path_folder + "\\" + this.mask + ((/\.png$/i.test(this.mask)) ? "" : ".png"))
  }

  if (this.WMP_mask_disabled == null)
    this.WMP_mask_disabled = CanvasEffect_options.WMP_mask_disabled = true
  if (this.canvas_buffer == null)
    this.canvas_buffer = CanvasEffect_options.canvas_buffer = use_HTML5
}

if (this.canvas_buffer) {
  this.canvas_buffer = document.createElement("canvas")
}
  }

  child.mask_onload = function (img) {
var c = this.mask_canvas_source = document.createElement("canvas")
var w = img.width
var h = img.height
c.width  = w
c.height = h

var context = c.getContext("2d")
context.drawImage(img, 0,0)

var mask_inverted = this.mask_inverted
var mask_alpha_base = this.mask_alpha_base
var mask_alpha_base_feather = this.mask_alpha_base_feather
var mask_alpha_mod = this.mask_alpha_mod
if (mask_inverted || mask_alpha_base || mask_alpha_mod) {
  if (!mask_alpha_base)
    mask_alpha_base = 0
  if (!mask_alpha_base_feather)
    mask_alpha_base_feather = 0
  else if (mask_alpha_base_feather == -1)
    mask_alpha_base_feather = parseInt(Math.sqrt(w*w + h*h) / 50)

  var image_data = context.getImageData(0,0, w,h)

  var data = image_data.data
  for (var a = 3, a_max = data.length; a < a_max; a+=4) {
    var alpha = data[a]
    if (mask_inverted)
      alpha = 255 - alpha
    if (mask_alpha_mod) {
      alpha = Math.round(alpha * mask_alpha_mod)
      if (alpha > 255)
        alpha = 255
    }
    if (alpha < mask_alpha_base) {
      var pixel = (a - 3) / 4
      var x = pixel % w
      var y = parseInt(pixel / w)

      var mod_x = 1
      if (x < mask_alpha_base_feather)
        mod_x = (x+1) / (mask_alpha_base_feather+1)
      else if (x >= w - mask_alpha_base_feather)
        mod_x = (w-x) / (mask_alpha_base_feather+1)

      var mod_y = 1
      if (y < mask_alpha_base_feather)
        mod_y = (y+1) / (mask_alpha_base_feather+1)
      else if (y >= h - mask_alpha_base_feather)
        mod_y = (h-y) / (mask_alpha_base_feather+1)

      alpha = Math.round(mask_alpha_base * ((mod_x < mod_y) ? mod_x : mod_y))
    }
    data[a] = alpha
  }

  context.putImageData(image_data, 0,0)
}
  }

  child._mask_width_last = -1
  child.mask_resize = function () {
var c = this.mask_canvas
if (!c)
  c = this.mask_canvas = document.createElement("canvas")

var cc = this.canvas
var w = cc.width
var h = cc.height
if (this._mask_width_last == w)
  return
this._mask_width_last = w

var cs = this.mask_canvas_source
var context = c.getContext("2d")
if (this.mask == "(SVG Clock)") {
//DEBUG_show(w+'x'+h+','+cc.id,0,1)
  var x = 0
  var y = 0
  if (cc.id != "CR") {
    var dim = this.resize(w,h)
    x = dim[0]
    y = dim[1]
    w = dim[2]
    h = dim[3]
  }

  c.width  = w
  c.height = h

  var dim_half = w / 2

  context.beginPath()
  context.arc(x+dim_half,y+dim_half, dim_half, 0,Math.PI*2)

  context.fill()
}
else if (this.mask_absolute_mapping) {
  var bw = document.body.style.pixelWidth
  var cw = (this.width)  ? this.width  : cs.width
  var ch = (this.height) ? this.height : cs.height
  var dim = this.resize(cw,ch, bw)

  var dim_scale = this.resize(cs.width,cs.height, bw)
  c.width  = dim_scale[2]
  c.height = dim_scale[3]

  context.drawImage(cs, 0,0,dim_scale[2],dim_scale[3])
  var image_data = context.getImageData(dim[0],dim[1],dim[2],dim[3])

  c.width  = dim[2]
  c.height = dim[3]
  context.putImageData(image_data, 0,0)
}
else {
  c.width  = w
  c.height = h
  context.drawImage(cs, 0,0,w,h)
}
  }

  child.resize_func = null
  child.resize = function (w,h, w_ref) {
if (this.resize_func)
  return this.resize_func(w,h, w_ref)

if (this.mask == "(SVG Clock)") {
  var dim = (w < h) ? w : h
  dim *= SVG_Clock.scale

  var x = parseInt((w - dim) * 0.5 * (1+SVG_Clock.x_center))
  var y = parseInt((h - dim) * 0.5 * (1+SVG_Clock.y_center))

  dim = parseInt(dim)
  return [x,y, dim,dim]
}

if (this.width_reference) {
  var ratio = w_ref / this.width_reference
  return [this.x*ratio,this.y*ratio, w*ratio,h*ratio]
}

return [0,0, w,h]
  }

  Object.defineProperty(child, "canvas",
{
  get: function () {
if (!this._canvas)
  this._canvas = (this._canvas_id) ? (document.getElementById(this._canvas_id) || self[this._canvas_id]) : null;
return this._canvas
  }

 ,set: function(v) {
if (typeof v == "string") {
  this._canvas_id = v
  this._canvas = null
}
else {
  this._canvas = v
  if (!v)
    this._canvas_id = null
}
  }
});
}


// scripts
if (use_EQP_ripple)
  document.write('<script language="JavaScript" src="js/EQP_ripple.js"></scr'+'ipt>')
else if (use_EQP_fireworks)
  document.write('<script language="JavaScript" src="js/EQP_fireworks.js"></scr'+'ipt>')
