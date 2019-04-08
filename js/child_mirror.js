// Child mirror (v1.2.0)

var is_SA_child_mirror = true

var ChildMirror_id
var EV_width  = 160
var EV_height = 120

var EQP_matrix_rain

var EV_init = function () {
  if (returnBoolean("UseMatrixRain")) {
    EQP_matrix_rain = new MatrixRain(EV_width, EV_height)
    EQP_matrix_rain.full_color = returnBoolean("MatrixRainColor")
    EQP_matrix_rain.matrixCreate()

    EQP_matrix_rain._SA_draw = function(skip_matrix) {
if (!this._SA_active)
  return

if (use_full_fps && !skip_matrix)
  skip_matrix = !EV_sync_update.frame_changed("matrixDraw")

this.matrixDraw(skip_matrix)

this.draw(SL)

var context = SL.getContext("2d")
context.globalAlpha = 1
context.globalCompositeOperation = 'copy'
if (Settings.UseCanvasPPE) {
  WebGL_2D._matrix_rain = this
}
else
  context.drawImage(this.canvas, 0,0)

CANVAS_must_redraw = true
    }

    DEBUG_show("Use Matrix rain", 2)
  }

  HTML5_Init()

  EV_init = null
};

var EV_animate_full = function () {
  if (!is_SA_child_animation)
    return

  var cw, cwSL
  if (ChildMirror_id == -1) {
    cw = parent
    cwSL = cw.V_video || cw.SL
  }
  else {
    var child = parent.document.getElementById("Ichild_animation" + ChildMirror_id)
    if (child) {
      cw = child.contentWindow
      cwSL = cw.V_video || cw.SL
    }
  }

  if (!cw || !cw.loaded || !cwSL)
    return

  var ss   = SL_Host_Parent.style
  var cwss = cw.SL_Host_Parent.style
  if ((SL.width != cwSL.width) || (SL.height != cwSL.height) || (ss.pixelWidth != cwss.pixelWidth) || (ss.pixelHeight != cwss.pixelHeight)) {
    SL.width  = cwSL.width
    SL.height = cwSL.height
    DEBUG_show(SL.width+'x'+SL.height, 2)

    ss.posLeft = cwss.posLeft
    ss.posTop  = cwss.posTop
    ss.pixelWidth  = cwss.pixelWidth
    ss.pixelHeight = cwss.pixelHeight

    var cw_html_bg = cw.document.getElementById("LEQP_html_bg")
    if (cw_html_bg) {
      var html_bg = document.getElementById("LEQP_html_bg")
      if (!html_bg) {
        html_bg = document.createElement("div")
        html_bg.id = "LEQP_html_bg"
        html_bg.style.position = "absolute"
        html_bg.style.posLeft = 0
        html_bg.style.posTop = 0
        html_bg.style.backgroundColor = cw_html_bg.style.backgroundColor
        html_bg.style.border = cw_html_bg.style.border

        L_EV_content.appendChild(html_bg)
      }
      html_bg.style.pixelWidth  = cw_html_bg.style.pixelWidth
      html_bg.style.pixelHeight = cw_html_bg.style.pixelHeight
    }
  }

  if ((EV_width != cw.EV_width) || (EV_height != cw.EV_height)) {
    EV_width  = cw.EV_width
    EV_height = cw.EV_height
    SA_body_offsetX = cw.SA_body_offsetX
    SA_body_offsetY = cw.SA_body_offsetY
    resize()
  }
//EV_sync_update.fps_count_func()
  if (!cwSL._drawn_id || (SL._drawn_id != cwSL._drawn_id))
    SL._drawn_id = cwSL._drawn_id
  else
    return

  var context = SL.getContext("2d")
  context.globalCompositeOperation = 'copy'

  try {
    context.drawImage(cwSL._canvas_for_copy||cwSL, 0,0)

    if (EQP_matrix_rain)
      EQP_matrix_rain._SA_draw()

    if (use_WebGL_2D)
      SL._WebGL_2D.draw()
  }
  catch (err) { DEBUG_show(err.description) }
};


(function () {
  use_full_fps_registered = true
})();


document.write('<script language="JavaScript" src="js/html5.js"></scr'+'ipt>');
