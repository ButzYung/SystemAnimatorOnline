// mouseover tracking (v1.0.0)

var MT_enabled = true
var MT_initialized
var MT_is_mouseover
var MT_onmouseover, MT_onmouseout

function MT_init() {
  document.onclick = MT_onclick

  if (MT_initialized)
    return
  MT_initialized = true

DEBUG_show('(Mouseover tracking: default)')
  Seq.item("Mouse Tracking").At(0.1, "document.fireEvent('onclick')", -1, 0.1)
  Seq.item("Mouse Tracking").Play()
}

function MT_onclick(e) {
  if (!MT_enabled)
    return

  if (!e)
    e = event

  var x = e.clientX
  var y = e.clientY

  if ((x > 0) && (x < EV_width) && (y > 0) && (y < EV_height)) {
    if (!MT_is_mouseover) {
      MT_is_mouseover = true
      MT_onmouseover()
    }
  }
  else {
    if (MT_is_mouseover) {
      MT_is_mouseover = false
      MT_onmouseout()
    }
  }
}
