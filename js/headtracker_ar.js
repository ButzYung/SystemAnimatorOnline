// System Animator - Head Tracker AR (v1.0.5)

var HeadTrackerAR = {
  initialized: false
 ,init: function () {
if (this.initialized)
  return
this.initialized = true

var v = this.video_input = document.createElement("video")
v.width  = 320
v.height = 240
v.autoplay = v.loop = true

var c = this.canvas_input = document.createElement("canvas")
c.width  = 320
c.height = 240

var cc = this.canvas_camera = document.createElement("canvas")
cc.width  = 160
cc.height = 120
var ccs = cc.style
ccs.position = "absolute"
ccs.posLeft = 25
ccs.posTop  = 25
ccs.zIndex = 50
ccs.border = "1px solid black"
ccs.opacity = 0.75
document.body.appendChild(cc)

var img = this.laughing_man = new Image()
img.src = "images/laughing_man_134x120.png"

/*
this.scene_width  = Lbody_host.style.pixelWidth
this.scene_height = Lbody_host.style.pixelHeight

var scene  = this.scene  = new THREE.Scene();
var camera = this.camera = new THREE.PerspectiveCamera( 23, this.scene_width / this.scene_height, 1, 100000 );
//camera.position.z = 6000;
scene.add( camera );
*/

/*
// Planes
				
				//top wall
				plane1 = new THREE.Mesh( new THREE.PlaneGeometry( 500, 3000, 5, 15 ), new THREE.MeshBasicMaterial( { color: 0xcccccc, wireframe : true } ) );
				plane1.rotation.x = Math.PI/2;
				plane1.position.y = 250;
				plane1.position.z = 50-1500;
				scene.add( plane1 );
				
				//left wall
				plane2 = new THREE.Mesh( new THREE.PlaneGeometry( 3000, 500, 15, 5 ), new THREE.MeshBasicMaterial( { color: 0xcccccc, wireframe : true } ) );
				plane2.rotation.y = Math.PI/2;
				plane2.position.x = -250;
				plane2.position.z = 50-1500;
				scene.add( plane2 );
				
				//right wall
				plane3 = new THREE.Mesh( new THREE.PlaneGeometry( 3000, 500, 15, 5 ), new THREE.MeshBasicMaterial( { color: 0xcccccc, wireframe : true	} ) );
				plane3.rotation.y = -Math.PI/2;
				plane3.position.x = 250;
				plane3.position.z = 50-1500;
				scene.add( plane3 );
				
				//bottom wall
				plane4 = new THREE.Mesh( new THREE.PlaneGeometry( 500, 3000, 5, 15 ), new THREE.MeshBasicMaterial( { color: 0xcccccc, wireframe : true	} ) );
				plane4.rotation.x = -Math.PI/2;
				plane4.position.y = -250;
				plane4.position.z = 50-1500;
				scene.add( plane4 );
				
				// Create sprites with lines
				
				var placeTarget = function(x,y,z) {
						
						// Cylinder
						var cylinder = new THREE.Mesh( new THREE.CylinderGeometry(30,30,1,20,1,false), new THREE.MeshBasicMaterial( { color : 0xeeeeee} ) );
						cylinder.position.x = x;
						cylinder.rotation.x = Math.PI/2;
						cylinder.position.y = y;
						cylinder.position.z = z;
						scene.add( cylinder );
						
						var geometry = new THREE.Geometry();
						geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( 0, 0, -80000 ) ) );
						geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( 0, 0, z ) ) );
						var line = new THREE.Line( geometry, new THREE.LineBasicMaterial( { color: 0xeeeeee } ) );
						line.position.x = x;
						line.position.y = y;
						scene.add( line );
				}
								
				placeTarget(-150,-150,-550);
				placeTarget(0,-150,-200);
				placeTarget(100,0,500);
				placeTarget(-150,100,0);
				placeTarget(150,-100,-1050);
				placeTarget(50,0,1100);
				placeTarget(-50,-50,600);
				placeTarget(0,150,-2100);
				placeTarget(-130,0,-700);
*/

/*
var renderer = this.renderer = new THREE.WebGLRenderer();
renderer.setSize(this.scene_width, this.scene_height);
*/

/*
var d = document.createElement("div")
d.style.position = "absolute"
d.style.zIndex = 999
Lbody_host.appendChild(d)
d.appendChild(renderer.domElement);

var d = document.createElement("div")
d.style.position = "absolute"
d.style.zIndex = 999
d.style.pixelWidth  = 500
d.style.pixelHeight = 3000
d.style.posLeft = (800-500)/2
d.style.posTop  = (600-3000)/2
d.style.backgroundColor = "rgba(0,0,0,0.5)"
d.style.msTransform = "translate3D(0px, 250px, -1450px) rotateX(90deg)"
Lbody3D_camera.style.msTransform = "translateZ(0px)"
Lbody3D_camera.appendChild(d)
*/

// set up camera controller
//headtrackr.controllers.three.realisticAbsoluteCameraControl(camera, 27, [0,0,50], new THREE.Vector3(0,0,0), {screenHeight:20, damping:0.5});

this.htracker = new headtrackr.Tracker({
  ui: false
 ,altVideo: {mp4:"js/headtrackr.mp4"}
 ,detectionInterval: 50
 ,calcAngles: true
});

document.addEventListener("headtrackrStatus", function(event) {
  var s = event.status
  switch (s) {
case "no camera":
  DEBUG_show("(no camera detected... using fallback video)", 2)
  break
case "found":
  DEBUG_show("(face detected, tracking initialized)", 2)
  break
case "lost":
  HeadTrackerAR.face_event = {}
  DEBUG_show("(lost tracking of face)", 2)
  break
case "redetecting":
  HeadTrackerAR.face_event = {}
  DEBUG_show("(trying to redetect face)", 2)
  break
case "hints":
  break
default:
  if (HeadTrackerAR._status_last != s) {
    HeadTrackerAR._status_last = s
    DEBUG_show("(" + s + ")", 2)
  }
  }
}, false);

document.addEventListener("facetrackingEvent", function(event) {
  HeadTrackerAR.ea = Math.abs(90-event.angle/Math.PI*180)

  if (event.detection == "CS") {
    var e = HeadTrackerAR.face_event
    e.x = (320-event.x)/2
    e.y = event.y/2
    e.width  = event.width/2
    e.height = event.height/2
    e.angle  = -event.angle
  }
}, false);

document.addEventListener('headtrackingEvent', function(event) {
  HeadTrackerAR.ex = event.x
  HeadTrackerAR.ey = event.y
  HeadTrackerAR.ez = event.z
}, false);

this.htracker.init(v, c);
  }

 ,ex: 0
 ,ey: 0
 ,ez: 0
 ,ea: 0
 ,_ey_tilt: 0
 ,_cx: 50
 ,_cy: 50
 ,_cz: 1
 ,_cz_mod: 1
 ,face_event: {}

 ,start: function () {
this.init()

this.htracker.start()
this.running = true
if (Lbody3D_navigation._3d_navigation_mode && Settings.CSSTransform3DBoxAnimate) {
  Lbody3D_navigation._transformed = true
  Lbody3D_navigation._translate3d = [0, 0, -(Lbody3D_navigation._z_view + Settings.CSSTransform3DBoxAnimate)]
}
this.canvas_camera.style.display = "block"

DEBUG_show("(HeadTracker AR - START)", 2)
  }

 ,stop: function () {
this.htracker.stop()
this.running = false
Lbody3D.style.msPerspectiveOrigin = "50% 50%"
this.canvas_camera.style.display = "none"
HeadTrackerAR.face_event = {}

DEBUG_show("(HeadTracker AR - STOP)", 2)
  }

 ,getCameraXY: function () {
/*
HeadTrackerAR.renderer.render(HeadTrackerAR.scene, HeadTrackerAR.camera);

var mi = []
HeadTrackerAR.camera.matrixWorldInverse.flattenToArray(mi)

HeadTrackerAR.scene_width  = Lbody_host.style.pixelWidth
HeadTrackerAR.scene_height = Lbody_host.style.pixelHeight
var fovValue = 0.5 / Math.tan(HeadTrackerAR.camera.fov * Math.PI / 360) * HeadTrackerAR.scene_height;

var cssStyle = "";
cssStyle += "translate3d(0,0," + HeadTrackerAR.epsilon(fovValue) + "px) ";
cssStyle += HeadTrackerAR.toCSSMatrix(mi, false);
//cssStyle += " translate3d(" + 0 + "px," + HeadTrackerAR.scene_height/2 + "px, 0)";

Lbody3D.style.msPerspective = fovValue + "px";
Lbody3D_camera.style.msTransform = cssStyle;
*/

var mod = 1

var e = HeadTrackerAR.face_event
if (e.width && e.height) {
  var ratio = Math.max(e.width, e.height) / 120
  mod = ratio / (1/2)
  if (mod > 2)
    mod = 2
/*
  // size gain for an object that is (perspective x 1) into the screen, assuming the default distance between viewer and screen is also (perspective x 1)
  var size_gain_on_screen = 1 / (1+1/mod) * 2
  size_gain_on_screen /= mod

  Lbody3D.style.msPerspective = Lbody3D._perspective * size_gain_on_screen
*/
}

var x = 50 + HeadTrackerAR.ex * 2// * mod
if (x < -25)
  x = -25
else if (x > 125)
  x = 125

var y = 66.667 - HeadTrackerAR.ey * 2 * 4/3
var ya = HeadTrackerAR.ea - 10
if ((ya > 0) && (y > 25)) {
  y += (100-y) * ((ya > 35) ? 35 : ya)/35 * 2/3
}
if (y < -25)
  y = -25
else if (y > 125)
  y = 125

HeadTrackerAR._cx = x
HeadTrackerAR._cy = y
HeadTrackerAR._cz = mod
  }

 ,toCSSMatrix: function (a, b) {
var f;
if (b) {
  f = [a[0], -a[1], a[2], a[3], a[4], -a[5], a[6], a[7], a[8], -a[9], a[10], a[11], a[12], -a[13], a[14], a[15]]
} else {
  f = a
}
for (var e = 0; e < 16; e++) {
  f[e] = this.epsilon(f[e])
}
return "matrix3d(" + f.join(",") + ")"
  }

 ,epsilon: function (a) {
if (Math.abs(a) < 0.000001) {
  return 0
}
return a;
  }
}

// core
document.write('<script language="JavaScript" src="js/headtrackr.js"></scr'+'ipt>')
//document.write('<script language="JavaScript" src="js/three.min.js"></scr'+'ipt>')