/*======================================================
Heavily inspired by Seb Lee-Delisle' talk @fullfrontal 2010
Ref - http://bit.ly/fgUay5

modified by Butz Yung for System Animator
// (2021-11-23)
========================================================*/

var use_EQP_fireworks

var EQP_Fireworks = {
  name: "Fireworks"

 ,start_x_default: null
 ,start_y_default: null
 ,setup: null
 ,render: null

 ,vector_x_func_default: function () {
var f = this.start_x - this.start_x_default
return ((Math.random() * this.vector_x_seed) + this.vector_x_mod) * ((Math.random() < (f+1)/2) ? -(f+1) : 1-f) * this.vector_x_scale
  }
 ,vector_y_func_default: function () {
var y_scale, y_mod
if (this.start_y < this.start_y_default) {
  y_scale = ((1 + (this.start_y - this.start_y_default) / (1 + this.start_y_default)) - 0.25) / 0.75
  y_mod   = 0
}
else {
  y_scale = 1 + (this.start_y - this.start_y_default)
  y_mod   = (this.start_y - this.start_y_default) * 0.75 * this.vector_y_seed
}
return ((Math.random() * this.vector_y_seed) + this.vector_y_mod + y_mod) * y_scale * this.vector_y_scale
  }
 ,vector_z_func_default: function () { return (Math.random() * 20) - 10 }

// customizable
 ,start_x: null
 ,start_y: null
 ,chosen_gravity: 1
 ,image_type: -1

 ,scale_mod: 1
 ,opacity_mod: 1

 ,new_particles_per_update: (RAF_animation_frame_unlimited) ? 2 : 3
 ,particle_is_invalid: function (particle, HALF_WIDTH,HALF_HEIGHT) {
return (Math.abs(particle.pos.x) > HALF_WIDTH) || (Math.abs(particle.pos.y) > HALF_HEIGHT)
  }

 ,vector_x_mod_default: 0
 ,vector_y_mod_default: 0

 ,vector_x_seed: 10
 ,vector_x_mod: null
 ,vector_x_scale: 1
 ,vector_y_seed: -5
 ,vector_y_mod: null
 ,vector_y_scale: 1

 ,vector_x_func: null
 ,vector_y_func: null
 ,vector_z_func: null

 ,_custom_flag: {}

 ,_custom_default: {}
 ,_custom_WE: {}

 ,goCanvas: function () {
CanvasEffect_Inherit(this)
if (!CanvasEffect_options || (/\_gimage\.png$/i.test(Settings.f_path) && !CanvasEffect_options.mask)) {
  if (!CanvasEffect_options)
    CanvasEffect_options = {}
  var w, h
  if (self.EQP_ref_width) {
    w = EQP_ref_width
    h = EQP_ref_height
  }
  else {
    var dim = loadImageDim(Settings.f_path)
    w = dim.w
    h = dim.h
  }
  CanvasEffect_options.mask = '(' + w + 'x' + h + ')'
  CanvasEffect_options.mask_alpha_base_feather = -1
}
this.load_options()


var custom_flag_list = ["vector_x_func","vector_y_func","vector_z_func", "start_x","start_y", "vector_x_mod","vector_y_mod"]
custom_flag_list.forEach(function (p) {
  EQP_Fireworks._custom_flag[p]    = (EQP_Fireworks[p] != null)
  EQP_Fireworks._custom_default[p] = EQP_Fireworks[p]
});
EQP_Fireworks._custom_default.chosen_gravity = EQP_Fireworks.chosen_gravity

var drag, gravity
var icon, imgs


this.setup = function () {
  drag = 0.99
  gravity = 0.5

  switch(this.chosen_gravity) {
case 0:
  drag = 1;
  gravity = 0.01;

  this.vector_x_mod = 0.1
  this.vector_y_seed = Math.abs(this.vector_y_seed)
  this.vector_y_func_default = function () {
var f = this.start_y - this.start_y_default
return ((Math.random() * this.vector_y_seed) + this.vector_y_mod) * ((Math.random() < (f+1)/2) ? -(f+1) : 1-f) * this.vector_y_scale
  }

  if (!this._custom_flag.start_y && !this._custom_flag.vector_y_mod) {
    this.vector_y_mod = this.vector_y_seed * Math.abs(this.start_y) * 0.5
  }

  this.start_x_default = 0
  this.start_y_default = 0
  break;

case 1:
  drag = 0.99;
  gravity = 0.5;

  this.start_x_default = 0
  this.start_y_default = -0.5
  break;

case 2:
  drag = 0.99;
  gravity = 1;

  this.start_x_default = 0
  this.start_y_default = -0.6
  break;

case 3:
  drag = 0.99;
  gravity = 1.5;

  this.start_x_default = 0
  this.start_y_default = -0.7
  break;
  }

  custom_flag_list.forEach(function (p) {
    if (!EQP_Fireworks._custom_flag[p] && (!EQP_Fireworks._WE_customized || (EQP_Fireworks._custom_WE[p] == null)))
      EQP_Fireworks[p] = EQP_Fireworks[p + "_default"]
  });
}

this.setup()


var HALF_WIDTH, HALF_HEIGHT
var scale_base

var lastMouseX = 0;

function Vector3(x, y, z) {

this.x = x;
this.y = y;
this.z = z;

this.tx = 0;
this.ty = 0;
this.tz = 0;
this.cosRY = 0;
this.sinRY = 0;
this.cosRZ = 0;
this.sinRZ = 0;

this.rotateY = function(angle) {
this.tx = this.x;
this.tz = this.z;

cosRY = Math.cos(angle);
sinRY = Math.sin(angle);

this.x = (this.tx * cosRY)  + (this.tz * sinRY);
this.z = (this.tx * -sinRY) + (this.tz * cosRY);
}

this.rotateZ = function(angle) {
this.ty = this.y;
this.tx = this.x;

cosRZ = Math.cos(angle);
sinRZ = Math.sin(angle);

this.y = (this.ty * cosRZ)  + (this.tx * sinRZ);
this.x = (this.ty * -sinRZ) + (this.tx * cosRZ);
}

this.reset = function(x, y, z) {
this.x = x;
this.y = y;
this.z = z;
}

this.plusEq = function(v) {
this.x += v.x;
this.y += v.y;
this.z += v.z;
}

this.multiplyEq = function(s) {
this.x *= s;
this.y *= s;
this.z *= s;
}

}

var Particle_count = 0

function Particle() {

this.pos = new Vector3(0, 0, 0);
this.vel = new Vector3(0, 0, 0);
this.enabled = true;

// SA mod
this.index = Particle_count++
if (EQP_Fireworks.rotate_ini)
  EQP_Fireworks.rotate_ini(this)

this.reset = function() {
var mod = (use_full_fps) ? ((RAF_animation_frame_unlimited)?1:2)/EV_sync_update.count_to_10fps_ : 1

var x = EQP_Fireworks.start_x * HALF_WIDTH
var y = EQP_Fireworks.start_y * HALF_HEIGHT
this.pos.reset(x, y, 0);

this.vel.reset(EQP_Fireworks.vector_x_func(this) * mod, EQP_Fireworks.vector_y_func(this) * mod, EQP_Fireworks.vector_z_func(this)) * mod;
this.enabled = true;

// SA mod
this.u_last = 0
}

this.reset();
this.update = function(skip_gravity) {
  if (this.enabled) {
    var mod = (use_full_fps) ? ((RAF_animation_frame_unlimited)?1:2)/EV_sync_update.count_to_10fps_ : 1

    this.pos.plusEq(this.vel);
    this.vel.multiplyEq(drag);

    if (!skip_gravity)
      this.vel.y += gravity * EQP_Fireworks.vector_y_scale * mod
  }
}

}

this.setup_icon = function () {
  icon = this.icon = this.icon_set.icon[this.icon_index]
  imgs = this.icon_set.imgs[this.icon_index]
}

function setup() {
var fov = 250;

var numPoints = 100;

var mouseX = 0;
var mouseY = -200;

var isMouseDown = false;

EQP_Fireworks.icon_set = { icon:[], icon_custom_index:5, imgs:[], _imgs_cache:{} }

EQP_Fireworks.icon_set.icon[0] = [
  { path:System.Gadget.path + "\\images\\_fireworks\\fireworks_electric.png", opacity:1.0, EQ_range:[0,4] }
 ,{ path:System.Gadget.path + "\\images\\_fireworks\\fireworks_spark.png",    opacity:0.9, EQ_range:[5,10] }
 ,{ path:System.Gadget.path + "\\images\\_fireworks\\fireworks_star.png",     opacity:0.9, EQ_range:[11,15] }
]

EQP_Fireworks.icon_set.icon[1] = [
  { path:System.Gadget.path + "\\images\\_fireworks\\fireworks_music_red.png",   opacity:0.8, EQ_range:[0,4] }
 ,{ path:System.Gadget.path + "\\images\\_fireworks\\fireworks_music_green.png", opacity:0.8, EQ_range:[5,10] }
 ,{ path:System.Gadget.path + "\\images\\_fireworks\\fireworks_music_blue.png",  opacity:0.8, EQ_range:[11,15] }
]

EQP_Fireworks.icon_set.icon[2] = [
  { path:System.Gadget.path + "\\images\\_fireworks\\fireworks_star_red.png",   opacity:0.75, EQ_range:[0,4] }
 ,{ path:System.Gadget.path + "\\images\\_fireworks\\fireworks_star_green.png", opacity:0.75, EQ_range:[5,10] }
 ,{ path:System.Gadget.path + "\\images\\_fireworks\\fireworks_star_blue.png",  opacity:0.75, EQ_range:[11,15] }
]

EQP_Fireworks.icon_set.icon[3] = [
  { path:System.Gadget.path + "\\images\\_fireworks\\fireworks_heart_green.png", opacity:2/3, EQ_range:[0,4-1] }
 ,{ path:System.Gadget.path + "\\images\\_fireworks\\fireworks_heart_red.png",   opacity:2/3, EQ_range:[5-1,10+1] }
 ,{ path:System.Gadget.path + "\\images\\_fireworks\\fireworks_heart_blue.png",  opacity:2/3, EQ_range:[11+1,15] }
]

EQP_Fireworks.icon_set.icon[4] = [
  { path:System.Gadget.path + "\\images\\_fireworks\\fireworks_electric_red.png", opacity:0.9, EQ_range:[0,4] }
 ,{ path:System.Gadget.path + "\\images\\_fireworks\\fireworks_spark.png",        opacity:1.0, EQ_range:[5,10] }
 ,{ path:System.Gadget.path + "\\images\\_fireworks\\fireworks_electric.png",     opacity:0.9, EQ_range:[11,15] }
]

EQP_Fireworks.icon_index = EQP_Fireworks.icon || 0
if (typeof(EQP_Fireworks.icon_index) != "number") {
  EQP_Fireworks.icon_index = EQP_Fireworks.icon_set.icon_custom_index
  EQP_Fireworks.icon_set.icon[EQP_Fireworks.icon_index] = EQP_Fireworks.icon
}

var opacity_base = EQP_Fireworks.opacity_mod
EQP_Fireworks.icon_set.icon.forEach(function (icons, idx) {
  var _imgs = []

  icons.forEach(function (icon, idx) {
    icon.opacity *= opacity_base

    var src = (icon.path.indexOf(0) == "\\") ? Settings.f_path_folder + icon.path : icon.path
    var img = EQP_Fireworks.icon_set._imgs_cache[src]
    if (!img) {
      img = EQP_Fireworks.icon_set._imgs_cache[src] = new Image();
      img.src = toFileProtocol(src)
    }
    _imgs[idx] = img
  });

  EQP_Fireworks.icon_set.imgs[idx] = _imgs
});

EQP_Fireworks.setup_icon()


var c, _c

function draw3Din2D(particle) {
var mod = (use_full_fps) ? ((RAF_animation_frame_unlimited)?1:2)/EV_sync_update.count_to_10fps_ : 1

x3d = particle.pos.x;
y3d = particle.pos.y;
z3d = particle.pos.z;
var scale = fov / (fov + z3d);
var x2d = (x3d * scale) + HALF_WIDTH  + rx;
var y2d = (y3d * scale) + HALF_HEIGHT + ry;
scale *= scale_base

// ignore EV_usage_float, which may cause flashing
if ((scale > 0)/* && (EV_usage_float > 0)*/) {
  var u
  var img = EQP_Fireworks.image_type
  if (EV_usage_sub) {
    var eq = particle.index % 16
    u = EV_usage_sub.sound_raw[eq].usage_raw * Sound_EQBand_mod
    if (u > 100)
      u = 100
    u /= 100

    if (img == -1) {
      for (var i = 0; i < icon.length; i++) {
        var range = icon[i].EQ_range
        if ((eq >= range[0]) && (eq <= range[1])) {
          img = i
          break
        }
      }
    }
  }
  else {
    u = EV_usage_float / 100
    if (img == -1)
      img = particle.index % icon.length
  }

  var decay = 0.5 * mod
  var u_min = particle.u_last - decay
  if (u < u_min)
    u = u_min
  particle.u_last = u

  if (EQP_Fireworks.rotate)
    EQP_Fireworks.rotate(particle)

//u=0.5
  if (u) {
    EQP_Fireworks.drawn = true

    scale *= 6 * (0.5+u*1.5);
    _c.globalAlpha = (0.5 + u*0.5) * icon[img].opacity

    var x = x2d-scale
    var y = y2d-scale
    if (particle.rotation) {
      var a = particle.rotation/180 * Math.PI
      var canvas = EQP_Fireworks.canvas
      var cw_half = canvas.width/2
      var ch_half = canvas.height/2

      _c.save()

      _c.translate(cw_half, ch_half)
      _c.rotate(a)

      x = -cw_half + x+scale
      y = -ch_half + y+scale
      var r = Math.sqrt(x*x + y*y)
      var a = Math.atan2(y,x) - a

      x = Math.cos(a) * r
      y = Math.sin(a) * r
      _c.translate(x,y)

      _c.drawImage(imgs[img], -scale,-scale, scale*2,scale*2)

      _c.restore()
    }
    else
      _c.drawImage(imgs[img], x,y, scale*2,scale*2);
  }
}

}

/*
var canvas = document.getElementById('fireworks');
var c = canvas.getContext('2d');
canvas.onmousedown = function(a) {
isMouseDown = true;
lastMouseX = mouseX;
}

document.onmouseup = function(a) {
isMouseDown = false;
}

document.onmousemove = updateMouse;
*/

var particles = [];
var spareParticles = [];

var rx,ry, rw,rh

function render(clear_before_drawing) {
var canvas = EQP_Fireworks.canvas
if (!canvas)
  return
c = canvas.getContext('2d');
c.globalCompositeOperation = 'source-over'

var mod = (use_full_fps) ? ((RAF_animation_frame_unlimited)?1:2)/EV_sync_update.count_to_10fps_ : 1

var cb = EQP_Fireworks.canvas_buffer
if (cb) {
  cb.width  = canvas.width
  cb.height = canvas.height
  _c = cb.getContext("2d")
  _c.globalCompositeOperation = 'source-over'
}
else
  _c = c

var cw = canvas.width
var ch = canvas.height
var dim
if (EQP_Fireworks.mask_absolute_mapping && EQP_Fireworks.mask_canvas_source && !EQP_Fireworks._use_default_canvas) {
  var cs = EQP_Fireworks.mask_canvas_source
  rw = (EQP_Fireworks.width)  ? EQP_Fireworks.width  : cs.width
  rh = (EQP_Fireworks.height) ? EQP_Fireworks.height : cs.height
  dim = EQP_Fireworks.resize(rw,rh, document.body.style.pixelWidth)
}
else
  dim = [0,0, cw,ch]
rx = dim[0]
ry = dim[1]
rw = dim[2]
rh = dim[3]

HALF_WIDTH  = rw / 2
HALF_HEIGHT = rh / 2
EQP_Fireworks.vector_x_scale = HALF_WIDTH  / 250
EQP_Fireworks.vector_y_scale = HALF_HEIGHT / 250

var diag = Math.sqrt(HALF_WIDTH*HALF_WIDTH + HALF_HEIGHT*HALF_HEIGHT)
var scale = diag / 300
if (scale > 1)
  scale = 1
if (self.EQP_size_scale && (EQP_size_scale > 1))
  scale = EQP_size_scale
scale_base = EQP_Fireworks.scale_mod * scale


var particle;

if (!isMouseDown) {
  for (var i = 0; i < EQP_Fireworks.new_particles_per_update; i++) {
    if (spareParticles.length == 0) {
      particle = new Particle();
      particles.push(particle);
    } else {
      particle = spareParticles.shift();
      particle.reset();
    }
  }
}


if (clear_before_drawing)
  c.clearRect(0, 0, canvas.width, canvas.height);

EQP_Fireworks.drawn = false


var skip_drawing
if (EQP_Fireworks.render_core_custom)
  skip_drawing = EQP_Fireworks.render_core_custom()

//DEBUG_show(particles.length)
particles.sort(compareZPos);

var skip_gravity = !EV_sync_update.frame_changed("fireworks gravity")
for (var i = 0, i_max=particles.length; i < i_max; i++) {
  particle = particles[i];

  if (!isMouseDown) {
    if (EQP_Fireworks.z_angle_mod) {
      var angle_mod = EQP_Fireworks.z_angle_mod * mod
      particle.pos.rotateZ(angle_mod * 0.01);
      particle.vel.rotateZ(angle_mod * 0.01);
    }

    particle.update(skip_gravity);
    if (particle.enabled && EQP_Fireworks.particle_is_invalid(particle, HALF_WIDTH,HALF_HEIGHT)) {
      particle.enabled = false;
      spareParticles.push(particle);
    }
  }
  else {
    particle.pos.rotateY((lastMouseX - mouseX) * 0.01);
    particle.vel.rotateY((lastMouseX - mouseX) * 0.01);
  }

  if (!skip_drawing && particle.enabled) {
    draw3Din2D(particle);
  }
}
lastMouseX = mouseX;


if (EQP_Fireworks.mask_canvas_source) {
  EQP_Fireworks.mask_resize()

  _c.globalAlpha = 1
  _c.globalCompositeOperation = 'destination-in'
  _c.drawImage(EQP_Fireworks.mask_canvas, rx,ry)
}

if (cb) {
  c.globalAlpha = 1
  c.drawImage(cb, 0,0)
}

if (canvas._WebGL_2D) {
  if (canvas.id == "SL")
    WebGL_2D_must_redraw = true
  else
    canvas._WebGL_2D.draw()
}
}

function compareZPos(a, b) {
return (b.pos.z - a.pos.z)
}

function updateMouse(e) {
mouseX = e.pageX - canvas.offsetLeft - HALF_WIDTH;
mouseY = e.pageY - canvas.offsetTop - HALF_HEIGHT;;
}

EQP_Fireworks.draw = render;

Canvas_Effect = EQP_Fireworks
}

setup();

  }

}

EQP_Fireworks.goCanvas()
