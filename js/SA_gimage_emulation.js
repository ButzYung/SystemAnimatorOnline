// G:IMAGE emulatio(v1.1.0)

var use_SA_gimage_emulation = true

var SA_gimage_skip_document_write

var BG = {
  src: "0.png"
 ,opacity: 100

 ,removeObjects: function () {
Lgimage_BG.innerHTML = ""
  }

 ,addImageObject: function (src, left,top, width,height) {
return new this._G_IMAGE(src, left,top, width,height)
  }

 ,_G_IMAGE: function (src, left,top, width,height) {
if (!this._constructor_initialized) {
  this.constructor.prototype._constructor_initialized = true

  this.constructor.prototype.left = 0
  this.constructor.prototype.top  = 0
  this.constructor.prototype.opacity = 0

  Object.defineProperty(this.constructor.prototype, "left",
{
  get: function () {
return this._left
  }
 ,set: function (v) {
this._left = v
this._img.style.posLeft = v + (this._width_org - this._width) / 2
  }
});
  Object.defineProperty(this.constructor.prototype, "top",
{
  get: function () {
return this._top
  }
 ,set: function (v) {
this._top = v
this._img.style.posTop = v + (this._height_org - this._height) / 2
  }
});
  Object.defineProperty(this.constructor.prototype, "width",
{
  get: function () {
return this._width
  }
 ,set: function (v) {
this._width = v
this._img.style.pixelWidth = v
this.left = this.left
  }
});
  Object.defineProperty(this.constructor.prototype, "height",
{
  get: function () {
return this._height
  }
 ,set: function (v) {
this._height = v
this._img.style.pixelHeight = v
this.top = this.top
  }
});

  Object.defineProperty(this.constructor.prototype, "src",
{
  get: function () {
return this._src
  }
 ,set: function (v) {
if (!/^(\/|[\w\-]+\:)/.test(v))
  v = System.Gadget.path + toLocalPath('\\' + v.replace(/\//g, "\\"))

if (!this._src) {
  var dim

  var item = System.Shell.itemFromPath(v)
  if (item) {
    var w,h
    dim = item.metadata("Dimensions")

    if (dim && /(\d+)\D+(\d+)/.test(dim)) {
      w = parseInt(RegExp.$1)
      h = parseInt(RegExp.$2)
    }
    else {
      w = 130
      h = 130
    }

    dim = { w:w, h:h }
  }
  else
    dim = { w:0, h:0 }

  this._width_org  = this._width  = dim.w
  this._height_org = this._height = dim.h
}
this._src = v

this._img.style.visibility = "inherit"
this._img.src = "file:///" + v.replace(/^(\w)\:/, "$1|").replace(/\\/g, "/");
  }
});

  Object.defineProperty(this.constructor.prototype, "opacity",
{
  get: function () {
return this._opacity
  }
 ,set: function (v) {
//DEBUG_show((pic_last)?pic_last.path.replace(/.+\\/, "").replace(/\.png$/, ""):" ",0,1)
this._opacity = v
this._img.style.opacity = v/100
//this._img.style.display = "none"
  }
});

  this.constructor.prototype.addShadow = function () {
//Lgimage_BG.style.zIndex = 2
  }
}

// main
var img
this._img = img = document.createElement("img")
img.style.position = "absolute"

if (src) {
  this.src = src

  if (width)
    this._width  = width
  if (height)
    this._height = height

  this.left = left
  this.top  = top
}
else
  img.style.visibility = "hidden"

Lgimage_BG.appendChild(img)
  }

 ,_init: function () {
Object.defineProperty(this, "style",
{
  get: function() {
return Lgimage_BG.style
  }
});

if (!SA_gimage_skip_document_write)
  document.write('<div id="Lgimage_BG" style="position:absolute; top:0px; left:0px"></div>\n')
  }
}

BG._init()
