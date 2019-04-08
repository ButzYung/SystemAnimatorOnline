// Spotlight core (v.1.6.4)

var Spotlight = {
   filter_name: "Spotlight"
  ,filter_enabled: false
  ,filter_css: "progid:DXImageTransform.Microsoft.Light(enabled=0)"

  ,u_decay_factor: 0.2
  ,EV_usage_PROCESS: Filter_EV_usage_PROCESS

// Misc
  ,width: 0
  ,height: 0
  ,ambient_base: 25
  ,light_z_factor: 1.1
  ,light_color: [[255,30,30], [30,255,30], [30,30,255]]
  ,light: []
  ,random: function (a,b) { return Math.random() - 0.5 }
  ,use_full_spectrum: true
}


// Core
Spotlight.init = function () {
  Spotlight.width = EV_width
  Spotlight.height = EV_height
}

Spotlight.frame = function () {
  if (!Spotlight.filter_enabled)
    return

  var d = new Date()
  var t = d.getTime()
/*
  var t_diff = t - EV_last_update_time
  if (t_diff > 1000)
    t_diff = 1000
*/
  EV_last_update_time = t


  var u = Spotlight.EV_usage_PROCESS(self)
  var uu = (filter_fps_fixed) ? u*0.9+0.1 : (10+1)/(SEQ_fps_end+SEQ_fps_ini)

  var usage = []
  if (EV_usage_sub && Spotlight.use_full_spectrum) {
    for (var i = 0; i < 3; i++)
      usage[i] = Spotlight.EV_usage_PROCESS(EV_usage_sub.sound[i])
  }
  else
    usage = [u,u,u]


  var light = document.getElementById(filter_id).filters.item("DXImageTransform.Microsoft.Light")

if (!filter_initialized) {
  light.enabled = 1
  light.clear()

  if (filter_id != "Lmain_animation")
    document.getElementById(filter_id).style.backgroundColor = "gray"

  var z = Math.round((Spotlight.width + Spotlight.height) / 5 * Spotlight.light_z_factor * 0.5)

  for (var k = 0; k < 3; k++) {
    var addXY = Spotlight.randomMove()
    var obj = {addX:addXY[0], addY:addXY[1]}

    Spotlight.light[k] = obj

    var x = random(Spotlight.width)
    var y = random(Spotlight.height)
    obj.x = x
    obj.y = y

    var color = Spotlight.light_color[k]
    light.addPoint(x,y,z, color[0],color[1],color[2], 100)
  }
  light.addAmbient(255,255,255, Spotlight.ambient_base)
  filter_initialized = true
}
else {
  var dim = [Spotlight.width, Spotlight.height]
  var abs = [false,false]
  var sign = [1,1]
  for (var i = 0; i < 3; i++) {
    var activeLight = Spotlight.light[i]

    var xy = [activeLight.x, activeLight.y]
    var isNewLoc = false
    for (var k = 0; k < 2; k++) {
      var num = xy[k]
      if (num <= 0) {
        abs[k] = true
        isNewLoc = true
      }
      else if (num >= dim[k]) {
        abs[k] = true
        sign[k] = -1
        isNewLoc = true
      }
    }
    if (isNewLoc) {
      var addXY = Spotlight.randomMove(abs)

      addXY[0] *= sign[0]
      addXY[1] *= sign[1]
      activeLight.addX = addXY[0]
      activeLight.addY = addXY[1]
    }
    activeLight.x += activeLight.addX * uu
    activeLight.y += activeLight.addY * uu

    var u = usage[i]
    var z = (dim[0] + dim[1]) / 5 * Spotlight.light_z_factor * (u*0.75+0.25)
    light.MoveLight(i, Math.round(activeLight.x),Math.round(activeLight.y),Math.round(z), true)
    light.changeStrength(i, Math.round((u*0.5+0.5)*100), true)
  }
}

}

Spotlight.onfinish = function () {
  if (filter_id != "Lmain_animation")
    document.getElementById(filter_id).style.backgroundColor = "black"
}


// Misc
Spotlight.randomMove = function (abs) {
  if (!abs)
    abs = []

  var speed = (Spotlight.width + Spotlight.height) / 15
  var xy = []
  var a = 0.1 + Math.random() * 0.8
  xy[0] = Math.cos(Math.PI/4 * a) * speed
  xy[1] = Math.sin(Math.PI/4 * a) * speed
  for (var i = 0; i < 2; i++)
    if ((!abs[i]) && (Math.random() > 0.5))
      xy[i] = -xy[i]

  return xy
}
