// video iframe player (v1.0.0)

var Video_IFRAME_Player_options

use_full_fps_registered = true

var Video_IFRAME_Player = {
  initialized: false
 ,EV_init: function () {
if (this.initialized) {
  VIP_border.style.pixelWidth  = EV_width  - 2
  VIP_border.style.pixelHeight = EV_height - 2
  VIP_drop_msg.style.posLeft = (EV_width -240)/2
  VIP_drop_msg.style.posTop  = (EV_height-240)/2
  return
}
this.initialized = true

HTML5_Init()

EV_width  = 640
EV_height = 360
EV_width  += 2
EV_height += 2
SL_Host_Parent.style.posTop = SL_Host_Parent.style.posLeft = 1

var d = document.createElement("div")
var ds = d.style
d.id = "VIP_Host"
ds.position = "absolute"
ds.posLeft = 0
ds.posTop = 0
//ds.bottom = "10px"
ds.border = "1px solid rgba(0,0,0,0.5)"
ds.paddingBottom = "10px"
ds.width = 200 + "px"
ds.height = (113+10) + "px"
ds.resize = "both"
ds.overflow = "auto"
ds.zIndex = 3
d.onmousedown = function (e) { e.stopPropagation(); }
d.ondblclick = function (e) { e.stopPropagation(); VIP_IFRAME.style.visibility=(VIP_IFRAME.style.visibility=="hidden")?"inherit":"hidden"; }
SL_Host_Parent.appendChild(d)

d = document.createElement("iframe")
ds = d.style
d.id = "VIP_IFRAME"
d.width = "100%"
d.height = "100%"
d.frameBorder = "0"
d.setAttribute('allowFullScreen', '')
ds.position = "relative"
ds.posTop =  0
ds.posLeft = 0
ds.zIndex = 2
d.src = LABEL_LoadSettings("LABEL_VIP_URL", "https://www.youtube.com/embed/" + "lQGCHMNJeXs" + "?rel=0&amp;showinfo=0")
VIP_Host.appendChild(d)

d = document.createElement("div")
ds = d.style
d.id = "VIP_border"
ds.position = "absolute"
ds.posLeft = 0
ds.posTop = 0
ds.pixelWidth = EV_width - 2
ds.pixelHeight = EV_height - 2
ds.border = "1px solid black"
L_EV_content.appendChild(d)

d = document.createElement("div")
ds = d.style
d.id = "VIP_drop_msg"
d.innerHTML = 'Drop YouTube<br/>URL here.'
VIP_border.appendChild(d)

DragDrop.accept_URL = true
DragDrop.onDrop_finish = function (item) {
  if (item.url) {
    if (/^http.+youtube\.com\/watch\?v\=(\w+)/.test(item.url)) {
      DEBUG_show("URL accepted:"+item.url, 5)
      var VIP_url = "https://www.youtube.com/embed/" + RegExp.$1 + "?rel=0&amp;showinfo=0"
      System.Gadget.Settings.writeString("LABEL_VIP_URL", VIP_url)
      VIP_IFRAME.src = VIP_url
    }
    else {
      DEBUG_show("URL rejected:"+item.url, 5)
    }
    return
  }

  DragDrop_install(item)
}
  }

 ,_msg_last: ""
 ,videoWidth: 0
 ,videoHeight: 0
 ,EV_animate_full: function (timestamp) {
var w = VIP_IFRAME.contentWindow
var d = w.document
if (d.readyState != "complete") {
  if (this._msg_last != d.readyState) {
    this._msg_last = d.readyState
    DEBUG_show("player status:" + this._msg_last, 2)
  }
  return
}

var videos = d.getElementsByTagName("video")
if (!videos.length) {
  if (this._msg_last != "player status:starting") {
    this._msg_last = "player status:starting"
    DEBUG_show(this._msg_last, 5)
  }
  return
}

var v = videos[0]
var vw = v.videoWidth
var vh = v.videoHeight
if (!vw || !vh) {
  if (this._msg_last != "(video player ready)") {
    this._msg_last = "(video player ready)"
    DEBUG_show(this._msg_last, 2)
  }
  return
}

if ((this.videoWidth != v.videoWidth) || (this.videoHeight != v.videoHeight)) {
  this.videoWidth = vw
  this.videoHeight = vh

  SL.width = EV_width = vw
  SL.height = EV_height = vh

  if (returnBoolean("UseMatrixRain") && !this.matrix_rain) {
    this.matrix_rain = new MatrixRain(EV_width, EV_height)
    this.matrix_rain.full_color = returnBoolean("MatrixRainColor")
    this.matrix_rain.matrixCreate()

    this.matrix_rain._SA_draw = function(skip_matrix) {
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

  EV_width  += 2
  EV_height += 2

  resize()

  DEBUG_show("video size:" + vw+"x"+vh, 2)
}

var context = SL.getContext("2d")
context.drawImage(v, 0,0)

if (this.matrix_rain)
  this.matrix_rain._SA_draw()

if (use_HTML5 && SL._WebGL_2D)
  SL._WebGL_2D.draw()
  }
};

(function () {
  self.EV_init = function () { Video_IFRAME_Player.EV_init() }
  self.EV_animate_full = function (timestamp) { Video_IFRAME_Player.EV_animate_full(timestamp) }

  if (!Video_IFRAME_Player_options)
    Video_IFRAME_Player_options = {}

  document.write(
  '<style>\n'
+ '#VIP_drop_msg {\n'
+ '	font-family:Segoe UI;\n'
+ '	overflow:hidden;\n'

+ '	-moz-user-select: none;\n'
+ '	-webkit-user-select: none;\n'
+ '	-ms-user-select: none;\n'

+ '	position:absolute;\n'
+ '	left:' + ((640-224)/2) + 'px;\n'
+ '	top:'  + ((360-168)/2) + 'px;\n'
+ '	width:224px;\n'
+ '	height:168px;\n'
+ '	background-color:white;\n'
+ '	display:flex;\n'
+ '	justify-content:center;\n'
+ '	flex-direction:column;\n'
+ '	text-align:center;\n'
+ '	font-size:32px;\n'
+ '	font-weight:bold;\n'
+ '	color:black;\n'
+ '	border:8px dashed black;\n'
+ '	border-radius: 24px;\n'
+ '	opacity:0.5;\n'
+ '</style>\n'
  );
})();


// HTML5
document.write('<script language="JavaScript" src="js/html5.js"></scr'+'ipt>');
