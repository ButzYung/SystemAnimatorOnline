// https://blog.tensorflow.org/2020/03/face-and-hand-tracking-in-browser-with-mediapipe-and-tensorflowjs.html

// https://blog.tensorflow.org/2020/03/introducing-webassembly-backend-for-tensorflow-js.html
importScripts("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs");
importScripts("https://cdn.jsdelivr.net/npm/@tensorflow-models/facemesh");

var model;
var face_cover;

importScripts("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm/dist/tf-backend-wasm.js");
tf.wasm.setWasmPath("https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm/dist/tfjs-backend-wasm.wasm");
tf.setBackend("wasm").then(function () {
  console.log("TFJS WASM backend")
  init()
});

var TRIANGULATION;
fetch("facemesh_triangulation.json").then(response => response.json()).then(data => {TRIANGULATION=data});

// https://tehnokv.com/posts/puploc-with-trees/demo/
importScripts("lploc.js");
var gray, gray_w, gray_h;
var eyes;
var eyes_xy_last = [[0,0],[0,0]]
var do_puploc = function(r, c, s, nperturbs, pixels, nrows, ncols, ldim) {return [-1.0, -1.0];};
			var puplocurl = 'https://f002.backblazeb2.com/file/tehnokv-www/posts/puploc-with-trees/demo/puploc.bin';
			fetch(puplocurl).then(function(response) {
				response.arrayBuffer().then(function(buffer) {
					var bytes = new Int8Array(buffer);
					do_puploc = lploc.unpack_localizer(bytes);
					console.log('* puploc loaded');
				})
			});

function rgba_to_grayscale(rgba, center, radius) {
  radius *= 1.2
  const ncols = gray_w

  var r_min = parseInt(center[1]-radius)
  var c_min = parseInt(center[0]-radius)
  var r_max = parseInt(center[1]+radius)+r_min
  var c_max = parseInt(center[0]+radius)+c_min
  if (r_min < 0) {
    r_max += r_min
    r_min = 0
  }
  if (r_max >= gray_h) {
    r_max = gray_h-1
  }
  if (c_min < 0) {
    c_max += c_min
    c_min = 0
  }
  if (c_max >= gray_w) {
    c_max = gray_w-1
  }
/*
// https://stackoverflow.com/questions/10521978/html5-canvas-image-contrast/37714937
  var contrast = 100/8
  contrast = (contrast/100) + 1;  //convert to decimal & shift range: [0..2]
  var intercept = 128 * (1 - contrast);
*/
  for(var r=r_min; r<r_max; ++r) {
    for(var c=c_min; c<c_max; ++c) {
    // gray = 0.2*red + 0.7*green + 0.1*blue
      const idx = r*4*ncols+4*c
      gray[r*ncols + c] = ((2*rgba[idx+0]+7*rgba[idx+1]+1*rgba[idx+2])/10)// +32)*contrast+intercept;
    }
  }
  return gray;
}

var canvas, context, RAF_timerID;

async function init() {
// https://github.com/tensorflow/tfjs-models/tree/master/facemesh
  model = await facemesh.load({maxFaces:1});
  console.log('(Facemesh initialized)')
/*
// https://dev.to/trezy/loading-images-with-web-workers-49ap
  const response = await fetch("../images/laughing_man_134x120.png");
  const blob = await response.blob();
  face_cover = await createImageBitmap(blob);
  console.log("face cover OK")
*/
  postMessage('(Facemesh initialized)')
}

async function process_video_buffer(rgba, w,h, draw_canvas) {
//  if (!face_cover) return

let _t_list = []
let _t, t_now
_t = _t_now = performance.now()

  eyes = []

  rgba = new Uint8ClampedArray(rgba);

  const faces = await model.estimateFaces(new ImageData(rgba, w,h));

/*
  let _dis
  if (faces.length) {
// LR:234,454
// TB:10,152
    let m0 = faces[0].mesh[10]
    let m1 = faces[0].mesh[152]
    let sm0 = faces[0].scaledMesh[10]
    let sm1 = faces[0].scaledMesh[152]
    _dis = Math.sqrt(Math.pow(sm0[0]-sm1[0],2)+Math.pow(sm0[1]-sm1[1],2)) / Math.sqrt(Math.pow(m0[0]-m1[0],2)+Math.pow(m0[1]-m1[1],2))
  }
*/

_t_now = performance.now()
_t_list[0] = _t_now-_t
_t = _t_now

  if (!faces.length) {
    postMessage(JSON.stringify({ faces:[], _t:_t_list.reduce((a,c)=>a+c) }));
    return
  }

  let face = faces[0]

  if ((gray_w != w) || (gray_h != h)) {
    gray_w = w
    gray_h = h
    gray = new Uint8Array(w*h);
  }

  const image = {
    "pixels": gray,
    "nrows": h,
    "ncols": w,
    "ldim": w
  };

//  let bb = face.boundingBox;
//  let face_radius = Math.min(bb.bottomRight[0][0]-bb.topLeft[0][0], bb.bottomRight[0][1]-bb.topLeft[0][1])/2;

  let sm = face.scaledMesh;

  let eye_bb, eye_center, eye_w, eye_h, eye_radius;
  let r,c,s;

// face LR:234,454
// right eye
// LR: 33,133
// TB: 159,145
// left eye
// LR: 362,263
// TB: 386,374

//  let z_diff = face.mesh[454][2] - face.mesh[234][2]
//  let eye_LR = (z_diff > 0) ? ["L","R"] : ["R","L"]
  let eye_LR = ["L","R"] 

  let m454 = face.mesh[454]
  let m234 = face.mesh[234]
  let dx = m454[0] - m234[0]
  let dy = m454[1] - m234[1]
  let dz = m454[2] - m234[2]
  let dis = Math.sqrt(dx*dx + dy*dy + dz*dz)
  let z_rot = Math.asin(dy / dis)

  for (var i = 0; i < 2; i++) {
    let LR = eye_LR[i]
    if (LR == "L") {
      eye_bb = [[Math.min(sm[33][0],sm[133][0],sm[159][0],sm[145][0]), Math.min(sm[33][1],sm[133][1],sm[159][1],sm[145][1])], [Math.max(sm[33][0],sm[133][0],sm[159][0],sm[145][0]), Math.max(sm[33][1],sm[133][1],sm[159][1],sm[145][1])]];
    }
    else {
      eye_bb = [[Math.min(sm[362][0],sm[263][0],sm[386][0],sm[374][0]), Math.min(sm[362][1],sm[263][1],sm[386][1],sm[374][1])], [Math.max(sm[362][0],sm[263][0],sm[386][0],sm[374][0]), Math.max(sm[362][1],sm[263][1],sm[386][1],sm[374][1])]];
    }

    eye_center = [(eye_bb[0][0] + eye_bb[1][0])/2, (eye_bb[0][1] + eye_bb[1][1])/2]
    eye_w = eye_bb[1][0]-eye_bb[0][0]
    eye_h = eye_bb[1][1]-eye_bb[0][1]
    eye_radius = Math.max(eye_w, eye_h)/2

    r = eye_center[1];
    c = eye_center[0];
    s = eye_radius*2;
    rgba_to_grayscale(rgba, eye_center, eye_radius)
    let yx = do_puploc(r, c, s, 63, image);

    if ((yx[0] >=0) && (yx[1] >= 0)) {
      let confidence = (0.25 + Math.min(Math.max(eye_radius-5,0)/30, 1) * 0.5)
      dx = (eye_center[0] - yx[1]) / eye_radius
      dy = (eye_center[1] - yx[0]) / eye_radius
      dis = Math.sqrt(dx*dx + dy*dy)
      z_rot = Math.atan2(dy, dx) - z_rot
      let eye_x = eyes_xy_last[i][0] = Math.max(Math.min(Math.cos(z_rot)*dis, 1), -1) * confidence + eyes_xy_last[i][0] * (1-confidence)
      let eye_y = eyes_xy_last[i][1] = Math.max(Math.min(Math.sin(z_rot)*dis, 1), -1) * confidence + eyes_xy_last[i][1] * (1-confidence)

      eyes[i] = [yx[1],yx[0], eye_x,eye_y, [LR]]

let r_min = ~~eye_bb[0][1]
let c_min = ~~eye_bb[0][0]
let r_max = ~~eye_bb[1][1]
let c_max = ~~eye_bb[1][0]
let eye_pixel_count = [0,0,0,0]
let R,G,B,S,S_threshold
let S_total = 0
for (let rr = r_min; rr <= r_max; rr++) {
  for (let cc = c_min; cc <= c_max; cc++) {
//    if (gray[rr*gray_w + cc] < 80) { eye_pixel_count++ }

const idx = rr*4*gray_w+4*cc
R = rgba[idx+0]
//let G = rgba[idx+1]
B = rgba[idx+2]
S = (R-B)/R

//if (R > 16) S_total += S;

//let maxColor = Math.max(R,G,B); let minColor = Math.min(R,G,B); S = (maxColor != 0) ? (maxColor - minColor) / maxColor : 0;
if (R > 16) {
  for (let i = 0; i < 4; i++) {
    S_threshold = 0.15 + i*0.05
    eye_pixel_count[i] += (S < S_threshold) ? 1 : Math.max(Math.min(((S_threshold+S_threshold)-S)/S_threshold, 1),0);
  }
}
else {
  eye_pixel_count[i] += 1
}

  }
}
eyes[i][5] = eye_pixel_count.map((count)=>count/(eye_w*eye_h));
/*
// forehead:9,8
// cheek:105,125
let S_list = [];
[9,8,105,125].forEach(function (c) {
  let idx = ~~sm[c][1]*4*gray_w + 4*~~sm[c][0]
  let R = rgba[idx+0]
  let B = rgba[idx+2]
  let S = (R-B)/R
  S_list.push(S)
});
S_list.sort((a,b)=>a-b)
let S_skin_average = (S_list[1]+S_list[2])/2
eyes[i][7] = ~~(S_total/(eye_w*eye_h)*100) + '/' + ~~(S_skin_average*100)
*/
    }
  }

_t_now = performance.now()
_t_list[1] = _t_now-_t
_t = _t_list.reduce((a,c)=>a+c)

  if (eyes.length) {
    if (!eyes[0])
      eyes = [eyes[1]]
//    let score = eyes[0][5] - ((eyes[1] && eyes[1][5])||99999)
//    if (score > 0) eyes = [eyes[1],eyes[0]]
let eye_x=0; eyes.forEach((e)=>{eye_x+=e[2]}); eye_x/=eyes.length;
let eye_y=0; eyes.forEach((e)=>{eye_y+=e[3]}); eye_y/=eyes.length;
eyes.forEach((e)=>{e[2]=eye_x;e[3]=eye_y;})
    eyes[0][4].push(_t_list[1])
  }

  postMessage(JSON.stringify({ faces:[{ faceInViewConfidence:faces[0].faceInViewConfidence, scaledMesh:(canvas)?undefined:sm, mesh:faces[0].mesh, eyes:eyes }], _t:_t }));

//return

  if (canvas && TRIANGULATION && draw_canvas && faces.length) {
    if (RAF_timerID)
      cancelAnimationFrame(RAF_timerID)
    RAF_timerID = requestAnimationFrame(function () {
      RAF_timerID = null
      draw_facemesh(faces, Math.round(w/2),Math.round(h/2))
    });
  }
}

function draw_facemesh(faces, w,h) {
  if ((canvas.width != w) || (canvas.height != h)) {
    canvas.width  = w
    canvas.height = h
  }

  context.clearRect(0,0,w,h)

  context.globalAlpha = 0.5
  context.fillStyle = 'black'
  context.fillRect(0,0,w,h)

  context.fillStyle = '#32EEDB';
  context.strokeStyle = '#32EEDB';
  context.lineWidth = 0.5;
  const keypoints = faces[0].scaledMesh;
  for (let i = 0, i_max=TRIANGULATION.length/3; i < i_max; i++) {
    const points = [
TRIANGULATION[i * 3], TRIANGULATION[i * 3 + 1],
TRIANGULATION[i * 3 + 2]
    ].map(index => keypoints[index]);
    drawPath(context, points, true);
  }

  eyes.forEach(function (eye) {
    var c = eye[0]/2
    var r = eye[1]/2
    context.beginPath();
    context.arc(c, r, 1, 0, 2*Math.PI, false);
    context.lineWidth = 3;
    context.strokeStyle = 'red';
    context.stroke();
  });
}

// https://github.com/tensorflow/tfjs-models/tree/master/facemesh/demo
// START

// https://github.com/tensorflow/tfjs-models/blob/master/facemesh/demo/index.js
function drawPath(ctx, points, closePath) {
  const region = new Path2D();
  region.moveTo(points[0][0]/2, points[0][1]/2);
  for (let i = 1; i < 3; i++) {
    const point = points[i];
    region.lineTo(point[0]/2, point[1]/2);
  }

  if (closePath) {
    region.closePath();
  }
  ctx.stroke(region);
}

// END

onmessage = function (e) {
  var t = performance.now()
  var data = (typeof e.data === "string") ? JSON.parse(e.data) : e.data;

  if (data.canvas) {
    canvas = data.canvas
    context = canvas.getContext("2d")
  }

  if (data.rgba) {
    process_video_buffer(data.rgba, data.w,data.h, data.draw_canvas);

    data.rgba = undefined
    data = undefined
  }
};
