// dialog (v1.2.0)

var parent_body_w_extra = 0
var parent_body_h_extra = 0

function SA_dialog_restore_parent_size() {
  var resized
  if (parent_body_w_extra) {
    resized = true
    parent.document.body.style.pixelWidth  -= parent_body_w_extra
  }
  if (parent_body_h_extra) {
    resized = true
    parent.document.body.style.pixelHeight -= parent_body_h_extra
  }

  if (resized) { parent.System._browser.resize(); }
}

function SA_dialog_resize(w, h) {
  var ds = document.body.style
  if (parent.use_inline_dialog) {
    var ww = w
    var hh = h

    var parent_body = parent.document.body.style
    var pw = parent_body.pixelWidth
    var ph = parent_body.pixelHeight

var resized
var v = Math.round(ww/1.5)
if (v > pw) {
  resized = true
  parent_body_w_extra = v - pw
  pw = parent_body.pixelWidth = parent_body.pixelWidth + parent_body_w_extra
}
v = Math.round(hh/1.5)
if (v > ph) {
  resized = true
  parent_body_h_extra = v - ph
  ph = parent_body.pixelHeight = parent_body.pixelHeight + parent_body_h_extra
}
if (resized) { parent.System._browser.resize(); }

    var w_ratio = pw / ww
    var h_ratio = ph / hh
    var ratio = (w_ratio < h_ratio) ? w_ratio : h_ratio
    if (ratio < 1) {
      var ss = document.getElementById("Lsettings_main").style
      ss.transform = "scale(" + (ratio*0.9) + ")"
      ss.left = -parseInt((w * (1-ratio))/2) + "px"
      ss.top  = -parseInt((h * (1-ratio))/2) + "px"
      ss.width  = ww + "px"
      ss.height = hh + "px"

      ww = parseInt(ww * ratio)
      hh = parseInt(hh * ratio)
    }

    var ws = parent.document.getElementById("Idialog").style
    ws.left = (pw - ww) / 2 + "px"
    ws.top  = (ph - hh) / 2 + "px"
    ws.width  = ds.width  = ww + "px"
    ws.height = ds.height = hh + "px"
    ws.visibility = "inherit"
  }
  else {
    ds.width  = self.dialogWidth  = w + "px";
    ds.height = self.dialogHeight = h + "px";
    if (webkit_mode)
      self.resizeTo(w, h)
  }
}
