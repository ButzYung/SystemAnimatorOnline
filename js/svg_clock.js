// SVG Clock
// (2021-11-23)

var SVG_Clock_scale, SVG_Clock_x_center, SVG_Clock_y_center, SVG_Clock_x_center_absolute, SVG_Clock_y_center_absolute, SVG_Clock_opacity_mod, SVG_Clock_custom_hands

var SVG_Clock = {
  second_last: -1
 ,minute_last: -1
 ,hour_last: -1

 ,scale: 1
 ,x_center: 0
 ,y_center: 0
 ,x_center_absolute: 0
 ,y_center_absolute: 0
 ,opacity_mod: 1

 ,dim_last: -1

 ,draw: function () {
if (SVG_Clock_scale)
  this.scale = SVG_Clock_scale
if (SVG_Clock_x_center)
  this.x_center = SVG_Clock_x_center
if (SVG_Clock_y_center)
  this.y_center = SVG_Clock_y_center
if (SVG_Clock_x_center_absolute)
  this.x_center_absolute = SVG_Clock_x_center_absolute
if (SVG_Clock_y_center_absolute)
  this.y_center_absolute = SVG_Clock_y_center_absolute
if (SVG_Clock_opacity_mod)
  this.opacity_mod = SVG_Clock_opacity_mod

var opacity_mod = this.opacity_mod

var c_host = (returnBoolean("CSSTransform3DDisabledForContent")) ? document.getElementById("Lbody_host") : document.getElementById("Lbody")

var d = document.createElement("div")
d.id = "Vclock_host"
var ds = d.style
ds.position = "absolute"
ds.posLeft = ds.posTop = 0
ds.zIndex = 99
c_host.appendChild(d)

var html
html =
  '<svg id="Vclock_parent" xmlns="http://www.w3.org/2000/svg" version="1.1" style="position:absolute; top:0px; left:0px">\n'

+ '<defs>\n'
+ '    <linearGradient\n'
+ '       id="linearGradient9076">\n'
+ '      <stop\n'
+ '         style="stop-color:#ff1c1c;stop-opacity:1;"\n'
+ '         offset="0"\n'
+ '         id="stop9078" />\n'
+ '      <stop\n'
+ '         style="stop-color:#ffffff;stop-opacity:1;"\n'
+ '         offset="1"\n'
+ '         id="stop9080" />\n'
+ '    </linearGradient>\n'
+ '    <linearGradient\n'
+ '       xlink:href="#linearGradient9076"\n'
+ '       id="linearGradient3406"\n'
+ '       gradientUnits="userSpaceOnUse"\n'
+ '       x1="365.71429"\n'
+ '       y1="326.84134"\n'
+ '       x2="365.71429"\n'
+ '       y2="962.93036"\n'
+ '       gradientTransform="translate(13.42857,-196)" />\n'
+ '    <path id="Heart" d="M 379.14286,136.36218 C 599.14285,-120.78067 819.14286,159.21932 696.28571,304.93361 L 379.14286,627.79075 M 379.14285,136.36218 C 159.14286,-120.78067 -60.857149,159.21932 62.000001,304.93361 L 379.14285,627.79075"/>\n'
+ '  </defs>\n'

+ '<g id="Vclock">\n'

for (var i = 0; i < 4; i++) {
  html += '<rect x="58" y="1" width="4" height="10" transform="rotate(' + (i*90) + ', 60,60)" style="fill:rgba(255,255,255,' + (0.5 * opacity_mod) + '); stroke:rgba(85,85,85,' + (0.75 * opacity_mod) + '); stroke-width:0.5"/>\n'
  for (var k = 0; k < 2; k++)
    html += '<polygon points="58,1 62,1 60,6" transform="rotate(' + (i*90+(k+1)*30) + ', 60,60)" style="fill:rgba(255,255,255,' + (0.5 * opacity_mod) + '); stroke:rgba(85,85,85,' + (0.75 * opacity_mod) + '); stroke-width:0.5"/>\n'
}

html += SVG_Clock_custom_hands ||
  '<polygon id="Vclock_s" points="60,2  58,64 62,64" style="fill:rgba(255,128,128,' + (0.5 * opacity_mod) + '); stroke:rgba(0,0,0,' + (0.75 * opacity_mod) + '); stroke-width:0.5"/>\n'
+ '<polygon id="Vclock_m" points="60,8  56,66 64,66" style="fill:rgba(128,255,128,' + (0.5 * opacity_mod) + '); stroke:rgba(0,0,0,' + (0.75 * opacity_mod) + '); stroke-width:0.5"/>\n'
+ '<polygon id="Vclock_h" points="60,20 54,68 66,68" style="fill:rgba(128,128,255,' + (0.5 * opacity_mod) + '); stroke:rgba(0,0,0,' + (0.75 * opacity_mod) + '); stroke-width:0.5"/>\n'

+ '<circle cx="60" cy="60" r="2" style="fill:rgba(255,255,255,' + (0.5 * opacity_mod) + '); stroke:rgba(0,0,0,' + (0.75 * opacity_mod) + '); stroke-width:0.5"/>\n';

html += ''
/*
+ '<g id="Vclock_heart" transform="translate(' + (60-760/40) + ',' + (60-650/40) + ') scale(' + (1/20) + ')" style="opacity:' + (0.5 * opacity_mod) + '">\n'
+ '<use xlink:href="#Heart" x="8.57145" y="9.43185" \n'
+ '     style="opacity:0.1;fill:none;fill-opacity:1;fill-rule:evenodd;stroke:#000000;stroke-width:11.5;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/>\n'
+ '  <use xlink:href="#Heart" \n'
+ '     style="fill:url(#linearGradient3406);fill-opacity:1;fill-rule:evenodd;stroke:#ff1c1c;stroke-width:11.5;stroke-linecap:round;stroke-linejoin:miter;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:1"/>\n'
+ '</g>\n'
*/
+ '</g>\n'
+ '</svg> '

d.innerHTML = html
  }

 ,rotate: function (p, v) {
p.setAttribute("transform", "rotate(" + v + ", 60,60)");
  }

 ,resize: function (w,h) {
var dim = (w < h) ? w : h
dim *= this.scale

if (this.dim_last == dim)
  return
this.dim_last = dim

var cs = Vclock_host.style
cs.posLeft = parseInt((w - dim) * 0.5 * (1+this.x_center) + w*0.5*this.x_center_absolute)
cs.posTop  = parseInt((h - dim) * 0.5 * (1+this.y_center) + h*0.5*this.y_center_absolute)

var vs = Vclock_parent.style
vs.pixelWidth = vs.pixelHeight = dim

Vclock.setAttribute("transform", "scale(" + (dim/120) + ")");

this.update()
  }

 ,update: function () {
var now = new Date();

var second  = now.getSeconds();
var msecond = 0//now.getMilliseconds();
var ratio = 1
if ((this.second_last != second) || (!this.half_second && (msecond >= 500))) {
  var hour = now.getHours();
  if (this.hour_last != hour)
    this.hour_last = hour

  var minute = now.getMinutes();
  if (this.minute_last != minute) {
    this.minute_last = minute
    this.rotate(Vclock_m, minute * 6)
    this.rotate(Vclock_h, hour * 30 + minute / 2)
  }

  var sec_for_display = second
  if (this.second_last != second) {
    this.half_second = false
    this.second_last = second
  }
  else {
    this.half_second = true
    sec_for_display += 0.5
  }
  this.rotate(Vclock_s, sec_for_display * 6)
}

var heart = document.getElementById("Vclock_heart")
if (!heart)
  return

var ms = now.getMilliseconds()
ratio = 1 - ((ms < 500) ? ms/500 : (ms-500)/500)
ratio = ratio * ratio + 0.5
//if (ms > 500) ms-=500; ratio = (ms < 100) ? 1 : 0.1;
//ratio = (1 - ((ms < 500) ? ms/500 : 1)) + 0.5
//DEBUG_show(ratio,0,1)
heart.setAttribute("transform", 'translate(' + (60-760/40*ratio) + ',' + (60-650/40*ratio) + ') scale(' + (1/20*ratio) + ')');
  }
}
