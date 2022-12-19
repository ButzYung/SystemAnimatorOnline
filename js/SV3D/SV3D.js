// 3D Sound-Visualizer v1.0.1
// Credits:
// - some concepts and stuff from https://github.com/srchea/Sound-Visualizer/

var SV3D = {
  initialized: false

 ,width:  800
 ,height: 600

 ,resize: function () {
var w = EV_width  = Math.round(this.width  * SA_zoom)
var h = EV_height = Math.round(this.height * SA_zoom)
this.renderer.setSize(w,h)
SA_zoom = 1
  }

 ,init: function () {
if (this.initialized) {
  this.resize()
  return
}
this.initialized = true

var c_host = (returnBoolean("CSSTransform3DDisabledForContent")) ? document.getElementById("Lbody_host") : document.getElementById("Lbody")

//c_host.ondblclick = function (e) {}

var d = document.createElement("div")
var ds = d.style
d.id = "SL_Host_Parent"
ds.position = "absolute"
ds.left = ds.top = "0px"
ds.zIndex = 10
c_host.appendChild(d)

var d = document.createElement("div")
var ds = d.style
d.id = "SL_Host"
ds.position = "absolute"
ds.left = ds.top = "0px"
ds.zIndex = 2
SL_Host_Parent.appendChild(d)

var c = document.createElement("canvas")
c.id = "SL"
c.width  = self.EV_width  = this.width
c.height = self.EV_height = this.height
var cs = c.style
cs.position = "absolute"
cs.left = cs.top = "0px"
cs.zIndex = 1
SL_Host.appendChild(c)


// media control START
SL._mouseout_timerID = null

SL._mouse_event_main = function () {
  if (SL_MC_video_obj) {
    if (SL._mouseout_timerID) {
      clearTimeout(SL._mouseout_timerID)
      SL._mouseout_timerID = null
    }
    return true
  }

  return false
}

var m = {}

Lbody_host.onmouseover = m.onmouseover = C_media_control.onmouseover = function () {
  if (!SL._mouse_event_main())
    return

  SL_Media_MouseEnter(SL_MC_video_obj)
}

Lbody_host.onmouseout = m.onmouseout = function () {
  if (!SL._mouse_event_main())
    return

  SL._mouseout_timerID = setTimeout('C_media_control.style.visibility="hidden"', 100)
}
// END


DragDrop_RE = eval('/\\.(' + DragDrop_RE_default_array.concat(["mp3", "wav", "aac", "mp4"]).join("|") + ')$/i')

DragDrop.onDrop_finish = function (item) {
  var src = item.path

  if (item.isFileSystem && /\.(mp3|wav|aac|mp4)$/i.test(src)) {
    var is_audio = /\.(mp3|wav|aac)$/i.test(src)
    var ao = (is_audio) ? SV3D.audio_obj : SV3D.video_obj
    if (!ao) {
      if (is_audio) {
        ao = SV3D.audio_obj = document.createElement("audio")
      }
      else {
        ao = SV3D.video_obj = document.createElement("video")
        ao.loop = true
        SV3D.image_source = ao
        if (SV3D.gallery_path)
          Seq.item("SV3D_Gallery").Stop()
      }

      ao.ontimeupdate = function (e) {
if (this.currentTime) {
  DEBUG_show('Media:START(' + (parseInt(this.currentTime*1000)/1000) + 's)', 2)
  this.ontimeupdate = null
}
      }
      ao.autoplay = true
//ao.volume=0.25
      ao.addEventListener("canplaythrough", function (e) {
if (SV3D.image_source == SV3D.video_obj) {
  SV3D.update_image()
}
if (self.AudioFFT) {
  SV3D.AudioFFT = ((is_SA_child_animation) ? parent.AudioFFT_active : self.AudioFFT_active) || AudioFFT
  if (!SV3D.AudioFFT.initialized) {
    SV3D.AudioFFT.power_spectrum_divider = 256
    SV3D.AudioFFT.input_gain = SV3D.input_gain || 0
//    SV3D.AudioFFT.fftSize = 2048
/*
    SV3D.AudioFFT.smoothingTimeConstant = 0.6
    SV3D.AudioFFT.fftSize = 512
    SV3D.AudioFFT.getFreqDataB = true
*/
  }
  SV3D._fft_last256 = []
  SV3D.AudioFFT.connect(this)
}
      }, true)

      ao.addEventListener("playing", function (e) {
SL_MC_simple_mode = true
SL_MC_video_obj = ao
SL_MC_Place()
      }, true)

      ao.addEventListener("ended", function (e) {
SL_MC_Place(-1)
      }, true)
    }

    ao.src = toFileProtocol(src)
  }
  else if (item.isFileSystem && /\.(bmp|gif|jpg|jpeg|png)$/i.test(src)) {
    SV3D.gallery_update(src)
    if (SV3D.gallery_path)
      Seq.item("SV3D_Gallery").Stop()
  }
  else if (item.isFolder) {
    System.Gadget.Settings.writeString("SA_SV3D_Gallery_Path", src)
    if (SV3D.gallery_init()) {
      SV3D.gallery_update(SV3D.gallery[0].path)
      if (Seq.item("SV3D_Gallery").paused)
        Seq.item("SV3D_Gallery").Play()
    }
  }
  else {
    DragDrop_install(item)
  }
}

// handle live input
  SV3D.AudioFFT = ((is_SA_child_animation) ? parent.AudioFFT_active : self.AudioFFT_active) || AudioFFT
  if (SV3D.AudioFFT.use_live_input) {
    if (!SV3D.AudioFFT.initialized) {
      SV3D.AudioFFT.power_spectrum_divider = 256
      SV3D.AudioFFT.input_gain = SV3D.input_gain || 0
    }
    SV3D._fft_last256 = []
  }


// main

var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(50, this.width/this.height, 1, 1000);
var renderer = this.renderer = new THREE.WebGLRenderer({canvas:c, antialias:true});
var cubes = this.cubes = new Array();
var controls;


var canvas = this.canvas = document.createElement("canvas")
var texture = this.texture = new THREE.Texture(canvas)
var m0 = new THREE.MeshBasicMaterial({
//			color: randomFairColor(),
//			ambient: 0x808080,
//			specular: 0xffffff,
map: texture//,
//			shininess: 20,
//			reflectivity: 5.5 
		});

for(var x = 0; x < 15; x++) {
	cubes[x] = new Array();
	for(var y = 0; y < 15; y++) {
		var geometry = new THREE.CubeGeometry(1, 1, 1);

		var mesh = new THREE.Mesh(geometry, m0);
		scene.add(mesh);

		cubes[x][y] = { mesh:mesh, scale:{x:2, y:2, z:2}, UV_width:[] }
	}
}

this.update_image()
if (this.gallery_path)
  Seq.item("SV3D_Gallery").Play()

var light = new THREE.AmbientLight(0x505050);
scene.add(light);
/*
var directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
directionalLight.position.set(0, 1, 1);
scene.add(directionalLight);

directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
directionalLight.position.set(1, 1, 0);
scene.add(directionalLight);


directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
directionalLight.position.set(0, -1, -1);
scene.add(directionalLight);

directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
directionalLight.position.set(-1, -1, 0);
scene.add(directionalLight);
*/
camera.position.z = 50;

controls = new THREE.OrbitControls(camera);
controls.addEventListener('change', render);

for(var i = 0; i < 7; i++) {
	controls.pan(new THREE.Vector3( 1, 0, 0 ));
	controls.pan(new THREE.Vector3( 0, 1, 0 ));
}

var render = function () {
  var ao_FFT = SV3D.AudioFFT
  if (ao_FFT && (ao_FFT._fft256 || (ao_FFT.freqDataB && ao_FFT.freqDataB.length))) {
    var boost = 0;
	var k = 0;
    var freqDataB
    if (ao_FFT._fft256) {
      k = 15
      freqDataB = []
      var _fft = ao_FFT._fft256
      var _fft_last = SV3D._fft_last256
      for (var i = 0, i_max = _fft.length; i < i_max; i++) {
        var v = _fft[i]
        var v_last = _fft_last[i] || 0
        if (v > 100)
          v = 100
        if (v < v_last - 10)
          v = v_last - 10
        _fft_last[i] = v

        freqDataB[i] = v * 2.55
      }
    }
    else
      freqDataB = ao_FFT.freqDataB;

    var f_length = freqDataB.length;
    for (var i = 0; i < f_length; i++) {
      boost += freqDataB[i];
    }
    boost = boost / f_length;

	for( var x = 0; x < 15; x++) {
		for (var y = 0; y < 15; y++) {
			var z_scale = (freqDataB[k] + boost) / 30;

			var cube = cubes[x][y]
			cube.mesh.scale.z = (z_scale < 1 ? 1 : z_scale) * cube.scale.z;

var _z = (z_scale < 1 ? 1 : z_scale) / 15
if (_z > 1)
  _z = 1

var geometry = cube.mesh.geometry
for (var ii = 0; ii < 2; ii++) {
// 0=right, 1=left
  var face_UV = geometry.faceVertexUvs[0][ii]
  var _w = cube.UV_width[ii]
  face_UV[0].x = _w * (0.5 - _z/2)
  face_UV[1].x = _w * (0.5 - _z/2)
  face_UV[2].x = _w * (0.5 + _z/2)
  face_UV[3].x = _w * (0.5 + _z/2)
}

geometry.uvsNeedUpdate = true;
geometry.buffersNeedUpdate = true;

			k += (k < f_length ? 1 : 0);
		}
	}
  }

  if (SV3D.image_source == SV3D.video_obj) {
    SV3D.canvas.getContext("2d").drawImage(SV3D.video_obj, 0,0,SV3D.video_obj.videoWidth,SV3D.video_obj.videoHeight, 0,0,SV3D.w_img,SV3D.h_img)
    SV3D.texture.needsUpdate = true
  }

//	requestAnimationFrame(render);
	controls.update();
	renderer.render(scene, camera);
};

render();

self.EV_animate_full = function () {
  render();
}

this.resize();

function randomFairColor() {
	var min = 64;
	var max = 224;
	var r = (Math.floor(Math.random() * (max - min + 1)) + min) * 65536;
	var g = (Math.floor(Math.random() * (max - min + 1)) + min) * 256;
	var b = (Math.floor(Math.random() * (max - min + 1)) + min);
	return r + g + b;
}
  }

  ,gallery_update: function (src) {
if (this.image_source == this.video_obj) {
  this.video_obj.pause()
}
this.image_source = this.image_obj

if (!this.image_obj.onload)
  this.image_obj.onload = function () { SV3D.update_image() }
this.image_obj.src = toFileProtocol(src)
  }

  ,gallery_init: function () {
var _path = System.Gadget.Settings.readString("SA_SV3D_Gallery_Path")
if (!_path)
  return false

var _gallery = Shell_ReturnItemsFromFolder(_path)
if (!_gallery.length)
  return false

this.gallery_path = _path
this.gallery = _gallery
this.gallery.shuffle()

this.gallery_index = 0
if (!Seq.item("SV3D_Gallery").initialized) {
  Seq.item("SV3D_Gallery").At(30, function () {
if (++SV3D.gallery_index >= SV3D.gallery.length) { SV3D.gallery_index = 0 }
SV3D.gallery_update(SV3D.gallery[SV3D.gallery_index].path)
  }, -1, 30)

// only if everything is initialzed (ie. loaded == true)
  Seq.item("SV3D_Gallery").Play()
}

return true
  }

  ,update_image: function () {
var img = this.image_source
var iw, ih
if (img == this.video_obj) {
  iw = img.videoWidth
  ih = img.videoHeight
}
else {
  iw = img.width
  ih = img.height
}

var tw = 512

var scale = (iw > 1280) ? 1280 / iw : ((iw < tw) ? tw / iw : 1)

var w_img = parseInt(iw * scale)
var h_img = parseInt(ih * scale)
w_img -= w_img % 4
h_img -= h_img % 4
if (w_img < 4)
  w_img = 4
if (h_img < 4)
  h_img = 4
this.w_img = w_img
this.h_img = h_img

var canvas = this.canvas
canvas.width  = w_img
canvas.height = h_img+16+tw

var context = canvas.getContext("2d")
context.drawImage(this._wood, 0,0,this._wood.width,this._wood.height, 0,0,w_img,h_img)
if (scale == 1)
  context.drawImage(img, 0,0)
else
  context.drawImage(img, 0,0,iw,ih, 0,0,w_img,h_img)
context.drawImage(this._wood, 0,0,this._wood.width,this._wood.height, 0,h_img+16,tw,tw)

this.texture.needsUpdate = true;

var w, h
if (w_img >= h_img) {
  w = 2
  h = 2 * h_img/w_img
}
else {
  w = 2 * w_img/h_img
  h = 2
}

var cubes = this.cubes
for (var x = 0; x < 15; x++) {
	for (var y = 0; y < 15; y++) {
/*
if (x==0 && y==0) DEBUG_show(
  geometry.faceVertexUvs[0][5][0].x+','+geometry.faceVertexUvs[0][5][0].y
+ '/' + geometry.faceVertexUvs[0][5][1].x+','+geometry.faceVertexUvs[0][5][1].y
+ '/' + geometry.faceVertexUvs[0][5][2].x+','+geometry.faceVertexUvs[0][5][2].y
+ '/' + geometry.faceVertexUvs[0][5][3].x+','+geometry.faceVertexUvs[0][5][3].y
,0,1)
*/

var cube = cubes[x][y]
var scale = cube.scale
scale.x = scale.z = w
scale.y = h
var geometry = cube.mesh.geometry

var h0 = h_img/(h_img+16+tw)
var h1 = 1 - h0

var _h = tw/(h_img+16+tw)
var _w = tw/w_img
var _z = 1/15

for (var ii = 0; ii < 2; ii++) {
// 0=right, 1=left
  var face_UV = geometry.faceVertexUvs[0][ii]
  var UV_processed = false

  if ((x==0 && ii==1) || (x==14 && ii==0)) {
    var y_mod = 0
/*
    if (w_img > h_img) {
      y_mod = parseInt((1 - h_img/w_img) * (scale.y/scale.z) * 7.5)
      if ((y_mod > y) || (y_mod > 14-y))
        UV_processed = true
    }
*/
    if (!UV_processed) {
      UV_processed = true
      cube.UV_width[ii] = 1
      face_UV[0].x = (0.5 - _z/2)
      face_UV[0].y = (y+1-y_mod)/(15-y_mod*2)*h0+h1
      face_UV[1].x = (0.5 - _z/2)
      face_UV[1].y = (y-y_mod)/(15-y_mod*2)*h0+h1
      face_UV[2].x = (0.5 + _z/2)
      face_UV[2].y = (y-y_mod)/(15-y_mod*2)*h0+h1
      face_UV[3].x = (0.5 + _z/2)
      face_UV[3].y = (y+1-y_mod)/(15-y_mod*2)*h0+h1
    }
    else
      UV_processed = false
  }

  if (!UV_processed) {
    cube.UV_width[ii] = _w
    face_UV[0].x = _w * (0.5 - _z/2)
    face_UV[0].y = _h * (y+1)/15
    face_UV[1].x = _w * (0.5 - _z/2)
    face_UV[1].y = _h * y/15
    face_UV[2].x = _w * (0.5 + _z/2)
    face_UV[2].y = _h * y/15
    face_UV[3].x = _w * (0.5 + _z/2)
    face_UV[3].y = _h * (y+1)/15
  }
}

for (var ii = 2; ii < 4; ii++) {
// 0=right, 1=left
  var face_UV = geometry.faceVertexUvs[0][ii]
  face_UV[0].x = 0
  face_UV[0].y = _h
  face_UV[1].x = 0
  face_UV[1].y = 0
  face_UV[2].x = _w
  face_UV[2].y = 0
  face_UV[3].x = _w
  face_UV[3].y = _h
}

var face_UV = geometry.faceVertexUvs[0][4]
face_UV[0].x = x/15
face_UV[0].y = (y+1)/15*h0+h1
face_UV[1].x = x/15
face_UV[1].y = y/15*h0+h1
face_UV[2].x = (x+1)/15
face_UV[2].y = y/15*h0+h1
face_UV[3].x = (x+1)/15
face_UV[3].y = (y+1)/15*h0+h1

face_UV = geometry.faceVertexUvs[0][5]
face_UV[0].x = (14-x)/15
face_UV[0].y = (y+1)/15*h0+h1
face_UV[1].x = (14-x)/15
face_UV[1].y = y/15*h0+h1
face_UV[2].x = (14-x+1)/15
face_UV[2].y = y/15*h0+h1
face_UV[3].x = (14-x+1)/15
face_UV[3].y = (y+1)/15*h0+h1

geometry.uvsNeedUpdate = true;
geometry.buffersNeedUpdate = true;

/*
		materials[4] = new THREE.MeshPhongMaterial({
			color: 0x000000,
			ambient: 0x808080,
//			specular: 0xffffff,
//map: texture,
			shininess: 20,
			reflectivity: 5.5 
		});
*/

		var mesh = cube.mesh
		mesh.position = new THREE.Vector3(x*w + 7.5*(2-w), y*h + 7.5*(2-h), 0);
		mesh.scale.x = w
		mesh.scale.y = h
	}
}
  }
};


(function () {
  use_full_fps_registered = true

  self.EV_init = function () { SV3D.init(); }

  SV3D.image_source = SV3D.image_obj = document.createElement("img")
  SV3D.image_obj.src = toFileProtocol((SV3D.gallery_init()) ? SV3D.gallery[0].path : Settings.f_path + '\\TEMP\\00.jpg')

  SV3D._wood = new Image()
  SV3D._wood.src = toFileProtocol(Settings.f_path + '\\TEMP\\wood.jpg')

  SV3D.input_gain = 1

  // media control
  document.write('<script language="JavaScript" src="js/SA_media_control.js"></scr'+'ipt>');
})();
