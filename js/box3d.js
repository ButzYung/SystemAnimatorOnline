// Box 3D (v1.0.6)

var Box3D_speed_mod, Box3D_decay_factor, Box3D_animate

var Box3D = {
  disabled: false
 ,u_last: 0
 ,speed_mod: 1
 ,decay_factor: 0.1
 ,rotate3d: [0,0,0]
 ,rotate3d_mod: null
 ,rotate3d_raw: [((Math.random() > 0.5) ? 1 : -1),((Math.random() > 0.5) ? 1 : -1),((Math.random() > 0.5) ? 1 : -1)]

 ,init: function () {
use_full_fps_registered = true
if (!EV_usage_sub)
  EV_usage_sub = EV_object[0].EV_usage_sub = EV_usage_sub_CREATE(null, "sound", 3)

if (Box3D_speed_mod)
  this.speed_mod = Box3D_speed_mod

if (Box3D_decay_factor)
  this.decay_factor = Box3D_decay_factor

if (Box3D_animate)
  this.animate_custom = Box3D_animate

Lbody._rotate3d = this.rotate3d
Lbody.style.msTransformOrigin = "50% 50% " + (Settings.CSSTransform3DBoxAnimate/2) + "px"

this.init = null
  }

 ,animate: function () {
if (SA_child_animation[5]) {
  var d = document.getElementById("Ichild_animation5")
  if (d._is_face == null)
    d._is_face = (d.style.msTransform.indexOf("translateZ(-" + Settings.CSSTransform3DBoxAnimate + "px)") != -1) ? 1 : 0

  if (d._is_face) {
    var vis = d.style.visibility
    if (this.disabled) {
      if (vis != "hidden")
        this.disabled = false
    }
    else {
      if (vis == "hidden") {
        this.disabled = true
        this.u_last = 0
        Lbody._rotate3d = this.rotate3d = [0,0,0]
        this.rotate3d_mod = null
        Lbody.style.msTransform = ""
      }
    }
  }
}

if (this.disabled)
  return

var u = EV_usage_float / 100

// decay control START
var decay_factor = this.decay_factor
if (use_full_fps)
  decay_factor *= 0.5

if (Settings.ReverseAnimation) {
  if (u - decay_factor > this.u_last)
    u = this.u_last + decay_factor
}
else {
  if (u + decay_factor < this.u_last)
    u = this.u_last - decay_factor
}
this.u_last = u
// END

if (!u)
  return

var beat = (EV_usage_sub && EV_usage_sub.BD) ? EV_usage_sub.BD.beat : 0
var bass_kicked = (beat && EV_usage_sub.BD.bass_kicked)

if (this.animate_custom) {
  var r3d = this.animate_custom(u, beat, bass_kicked)
  if (!r3d)
    return

  for (var i = 0; i < 3; i++)
    this.rotate3d[i] = r3d[i]
  r3d = this.rotate3d
}
else {
  var r = u * 10 * this.speed_mod * (beat+1)

  var r3d_mod = this.rotate3d_mod
  var r3d_reset
  if (!r3d_mod)
    r3d_reset = [1,1,1]
  else if (bass_kicked) {
    r3d_reset = [1,1,1]
//    r3d_reset[Math.floor(Math.random() * 3)] = 1
  }

  if (r3d_reset) {
    var r3d_raw = this.rotate3d_raw
    var length = 0
    for (var i = 0; i < 3; i++) {
      if (r3d_reset[i])
        r3d_raw[i] = (Math.random() + 0.000001) * ((r3d_raw[i] > 0) ? 1 : -1)//((Math.random() > 0.5) ? 1 : -1)

      var a = Math.abs(r3d_raw[i])
      length += a * a
    }

    if (length) {
      length = Math.sqrt(length)
      r3d_mod = this.rotate3d_mod = [r3d_raw[0]/length, r3d_raw[1]/length, r3d_raw[2]/length]
    }
    else
      r3d_mod = this.rotate3d_mod = [0,0,0]
  }

  var r3d = this.rotate3d
  for (var i = 0; i < 3; i++)
    r3d[i] = (r3d[i] + r3d_mod[i] * r) % 360
}

//if (EV_usage_sub.BD) DEBUG_show([EV_usage_sub.BD.beat])
Lbody.style.msTransform = "rotateX(" + r3d[0] + "deg) rotateY(" + r3d[1] + "deg) rotateZ(" + r3d[2] + "deg)"
  }
}
