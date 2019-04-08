// SVG (v1.0.2)

var svg_xmlns = "http://www.w3.org/2000/svg";
var svg_xlink_xmlns = "http://www.w3.org/1999/xlink";

var use_SVG

// For Silverlight compatibility
var SL_loaded

var SL_windowless = true

var SL_PP_is_reset = true
var SL_PP_enabled

var SL_ST_enabled
// END


function SVG_Object(img_id, ps) {
  var d = document.createElementNS(svg_xmlns, "image");
  d.id = "SVG_" + img_id

  if (ps)
    d.ps = ps
  d.img_id = img_id
  d.Opacity = 1

// getter and setter work only on DOM objects (IE9 beta)
  Object.defineProperty(d, "Source", {
		set: function(src) {
this.setAttributeNS(svg_xlink_xmlns, "xlink:href", src);
var ps = this.ps
this.setAttributeNS(null, "width", ps.w_org);
this.setAttributeNS(null, "height", ps.h_org);
this.setAttributeNS(null, "x", ps.x_org);
this.setAttributeNS(null, "y", ps.y_org);
		}
	}
  )

  Object.defineProperty(d, "Opacity", {
		set: function(opacity) {
this.style.opacity = opacity
		}
	}
  )

  return d
}

function SVG_Mask(name) {
  var mask = document.createElementNS(svg_xmlns, "mask");
  mask.id = 'SVG_mask_' + name
//  mask.setAttributeNS(null, "maskUnits", "userSpaceOnUse");

  var img = document.createElementNS(svg_xmlns, "image");
  mask.img_mask = img

  mask.appendChild(img)
  SL.defs_obj.appendChild(mask)

  Object.defineProperty(mask, "ImageSource", {
		set: function(src) {
this.Mask_src = src

if (src) {
  var dim = loadImageDim(toLocalPath(src))
  var img = this.img_mask
  img.setAttributeNS(null, "width", dim.w);
  img.setAttributeNS(null, "height", dim.h);
  img.setAttributeNS(svg_xlink_xmlns, "xlink:href", src);
}

var mask_src = (src) ? 'url(#' + this.id + ')' : 'none'
var mask_name = this.id.replace(/^SVG_mask_/, '')
if (mask_name == 'content_mask') {
  SL.g_obj.style.mask = mask_src
//DEBUG_show('mask:' + mask_src)
}
		}
	}
  )

  return mask
}


// Silverlight emulation START

var SL_mask = {}

var SL_root = {
   FindName: function (name) {
if (/mask/.test(name)) {
  if (!SL_mask[name])
    SL_mask[name] = SVG_Mask(name)
  return SL_mask[name]
}

return {}
   }
}

// END


function SVG_Init(svg_objs) {
  SL_loaded = true

DEBUG_show('Use SVG', 2, true)

  var d = document.createElement("div")
  var ds = d.style
  d.id = "SL_Host_Parent"
  ds.position = "absolute"
  ds.posLeft = 0
  ds.posTop = 0
  ds.zIndex = 10
  document.body.appendChild(d)

  var d = document.createElement("div")
  var ds = d.style
  d.id = "SL_Host"
  ds.position = "absolute"
  ds.posLeft = 0
  ds.posTop = 0
  SL_Host_Parent.appendChild(d)

  var d = document.createElementNS(svg_xmlns, "svg");
  d.setAttributeNS(null, "width", EQP_SL_w);
  d.setAttributeNS(null, "height", EQP_SL_h);
  var ds = d.style
  d.id = "SL"
  ds.position = "absolute"
  ds.posLeft = 0
  ds.posTop = 0

  var defs = document.createElementNS(svg_xmlns, "defs");
  d.defs_obj = defs
  d.appendChild(defs)

  var g = document.createElementNS(svg_xmlns, "g");
  g.setAttributeNS(null, "width", EQP_SL_w);
  g.setAttributeNS(null, "height", EQP_SL_h);
  for (var i = 0; i < svg_objs.length; i++)
    g.appendChild(svg_objs[i])
  d.g_obj = g
  d.appendChild(g)

  SL_Host.appendChild(d)

  SL_object = SL

// WMP
if (self.WMP)
  WMP.dragdrop_init()

// Enforce proper resizing
  EQP_resize()
}
