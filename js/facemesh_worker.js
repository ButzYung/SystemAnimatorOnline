// (2021-01-20)

var param = new URLSearchParams(self.location.search.substring(1));

var use_human_facemesh = param.get('use_human_facemesh');
var use_faceLandmarksDetection = param.get('use_face_landmarks');
var facemesh_version = (use_human_facemesh || use_faceLandmarksDetection) ? '' : '@0.0.3';

var human;

var use_SIMD;

// https://github.com/GoogleChromeLabs/wasm-feature-detect
importScripts('https://unpkg.com/wasm-feature-detect/dist/umd/index.js');

wasmFeatureDetect.simd().then(simdSupported => {
  use_SIMD = simdSupported;

  if (use_human_facemesh) {
importScripts('./human/dist/human.js');
human = new Human.default();

human.load({
  backend: 'wasm',//(use_SIMD) ? 'wasm' : 'webgl',
  wasmPath: './human/assets/', // path for wasm binaries

  filter: {
    enabled: false
  },

  gesture: {
    enabled: false
  },

  face: {
    enabled: true,

    detector: {
      modelPath: './human/models/blazeface-back.json',
      rotation: use_faceLandmarksDetection,
      maxFaces: 1,
      skipFrames: 15
    },

    mesh: {
      enabled: true,
      modelPath: './human/models/facemesh.json',
      returnRawData: true
    },

    iris: {
      enabled: use_faceLandmarksDetection,
      modelPath: './human/models/iris.json'
    },

    age: {
      enabled: false
    },

    gender: {
      enabled: false
    },

    emotion: {
      enabled: true,
      modelPath: './human/models/emotion-large.json' // can be 'mini', 'large'
    }

  },

  body: {
    enabled: false
  },

  hand: {
    enabled: false
  }
});

postMessage('(Use Human Facemesh/' + ((human.config.backend=='wasm') ? 'WASM'+((use_SIMD && '-SIMD')||'') : human.config.backend) + ')')
postMessage('OK')
  }
  else {
// https://blog.tensorflow.org/2020/03/face-and-hand-tracking-in-browser-with-mediapipe-and-tensorflowjs.html
// https://blog.tensorflow.org/2020/03/introducing-webassembly-backend-for-tensorflow-js.html

// temporary fix for issues when loading the latest TFJS WASM on certain platforms
let tfjs_version = '@2.8.2';//(self.location.protocol == "file:") ? '@2.1.0' : '';

importScripts('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs' + tfjs_version);

if (1) {
  importScripts('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm' + tfjs_version + '/dist/tf-backend-wasm.js');

// https://github.com/tensorflow/tfjs/tree/master/tfjs-backend-wasm
  if (tfjs_version == '@2.1.0') {
/*
// https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm/dist/tf-backend-wasm.js
// https://github.com/GoogleChromeLabs/wasm-feature-detect
  use_SIMD = WebAssembly.validate(new Uint8Array([
      0, 97, 115, 109, 1, 0, 0, 0, 1, 4, 1, 96, 0, 0, 3,
      2, 1, 0, 10, 9, 1, 7, 0, 65, 0, 253, 15, 26, 11
  ])) || new URLSearchParams(self.location.search.substring(1)).get('simd');
*/
    tf.wasm.setWasmPath('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm' + tfjs_version + '/dist/tfjs-backend-wasm' + ((use_SIMD)?'-simd':'') + '.wasm');
  }
  else {
    tf.wasm.setWasmPaths('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm' + tfjs_version + '/dist/');
  }

  tf.setBackend("wasm").then(function () {
    console.log('Facemesh: TFJS WASM' + ((use_SIMD)?'-SIMD':'') + ' backend')
    init()
  }).catch(function (err) {
    postMessage('Facemesh: TFJS WASM ERROR:' + err)
  });
}
else {
  console.log('Facemesh: TFJS WebGL backend')
  init()
}

/*
var tf = require('@tensorflow/tfjs-node')
tf.setBackend("tensorflow").then(function () {
  console.log("TFJS node.js backend")
  init()
});
*/
  }
});

var canvas, context, RAF_timerID;

var model;
var face_cover;

var gray, gray_w, gray_h;
var eyes;
var eyes_xy_last = [[0,0],[0,0]];
var do_puploc;

if (!use_faceLandmarksDetection) {
// https://tehnokv.com/posts/puploc-with-trees/demo/
  importScripts("lploc.js");

  do_puploc = function(r, c, s, nperturbs, pixels, nrows, ncols, ldim) {return [-1.0, -1.0];};
			const puplocurl = 'https://drone.nenadmarkus.com/data/blog-stuff/puploc.bin';
//'https://f002.backblazeb2.com/file/tehnokv-www/posts/puploc-with-trees/demo/puploc.bin';
			fetch(puplocurl).then(function(response) {
				response.arrayBuffer().then(function(buffer) {
					var bytes = new Int8Array(buffer);
					do_puploc = lploc.unpack_localizer(bytes);
					console.log('* puploc loaded');
postMessage('(Use lploc.js)');
				})
			});
}

var TRIANGULATION;
fetch("facemesh_triangulation.json").then(response => response.json()).then(data => {TRIANGULATION=data});

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

var use_pose_worker;
var pose_worker, pose_worker_ready;

async function init() {
  try {
    if (use_faceLandmarksDetection) {
      importScripts('https://cdn.jsdelivr.net/npm/@tensorflow-models/face-landmarks-detection/dist/face-landmarks-detection.js');

      model = await faceLandmarksDetection.load(faceLandmarksDetection.SupportedPackages.mediapipeFacemesh, {maxFaces:1});

      postMessage('(Face-landmarks-detection initialized)')
    }
    else {
// https://github.com/tensorflow/tfjs-models/tree/master/facemesh
      importScripts('https://cdn.jsdelivr.net/npm/@tensorflow-models/facemesh' + facemesh_version);

      model = await facemesh.load({maxFaces:1});
      console.log('(Facemesh initialized)')

      postMessage('(Facemesh initialized' + ((use_SIMD)?'/use SIMD':'') + ')')
    }
/*
// https://dev.to/trezy/loading-images-with-web-workers-49ap
  const response = await fetch("../images/laughing_man_134x120.png");
  const blob = await response.blob();
  face_cover = await createImageBitmap(blob);
  console.log("face cover OK")
*/
    postMessage('OK')
  }
  catch (err) { postMessage('Facemesh ERROR:' + err) }
}

async function process_video_buffer(rgba, w,h, options) {
//  if (!face_cover) return

let _t_list = []
let _t, t_now
_t = _t_now = performance.now()

  const bb = options.bb
  let sx = bb.x
  let sy = bb.y
  let cw = bb.w
  let ch = bb.h

  eyes = []

  rgba = new Uint8ClampedArray(rgba);

  let faces
  if (use_human_facemesh) {
    const result = await human.detect(new ImageData(rgba, cw,ch));
    faces = result.face
  }
  else {
    faces = (use_faceLandmarksDetection) ? await model.estimateFaces({input:new ImageData(rgba, cw,ch)}) : await model.estimateFaces(new ImageData(rgba, cw,ch));
  }
//console.log(faces[0])

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

  if (!faces.length || ((faces[0].faceInViewConfidence||faces[0].confidence) < 0.7)) {
    postMessage(JSON.stringify({ faces:[], _t:_t_list.reduce((a,c)=>a+c) }));
    return
  }

  let face = faces[0]
  if (use_human_facemesh) {
    face.faceInViewConfidence = face.confidence
    face.scaledMesh = face.mesh
    face.mesh = face.meshRaw
    face.boundingBox = face.boxRaw
  }
  else if (facemesh_version == '@0.0.3') {
    face.boundingBox = { topLeft:face.boundingBox.topLeft[0], bottomRight:face.boundingBox.bottomRight[0]}
  }

//if (!self._TEST_) {self._TEST_=true;console.log(face);}
  if ((gray_w != cw) || (gray_h != ch)) {
    gray_w = cw
    gray_h = ch
    gray = new Uint8Array(cw*ch);
  }

  const image = {
    "pixels": gray,
    "nrows": ch,
    "ncols": cw,
    "ldim": cw
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

    let yx;
if (use_faceLandmarksDetection) {
// https://github.com/tensorflow/tfjs-models/blob/master/face-landmarks-detection/src/mediapipe-facemesh/keypoints.ts
// NOTE: video source is assumed to be mirrored (eg. video L == landmarks R)
    yx = (LR == "L") ? [sm[473][1], sm[473][0]] : [sm[468][1], sm[468][0]];
}
else {
    r = eye_center[1];
    c = eye_center[0];
    s = eye_radius*2;
    rgba_to_grayscale(rgba, eye_center, eye_radius)
    yx = do_puploc(r, c, s, 63, image);
}

    if ((yx[0] >=0) && (yx[1] >= 0)) {
      let confidence = (0.25 + Math.min(Math.max(eye_radius-5,0)/30, 1) * 0.5)
      dx = (eye_center[0] - yx[1]) / eye_radius
      dy = (eye_center[1] - yx[0]) / eye_radius
      dis = Math.sqrt(dx*dx + dy*dy)
      let eye_z_rot = Math.atan2(dy, dx) - z_rot
      let eye_x = eyes_xy_last[i][0] = Math.max(Math.min(Math.cos(eye_z_rot)*dis, 1), -1) * confidence + eyes_xy_last[i][0] * (1-confidence)
      let eye_y = eyes_xy_last[i][1] = Math.max(Math.min(Math.sin(eye_z_rot)*dis*Math.max(1.5-Math.abs(z_rot)/(Math.PI/4)*0.5,1), 1), -1) * confidence + eyes_xy_last[i][1] * (1-confidence)

      eyes[i] = [yx[1]+sx,yx[0]+sy, eye_x,eye_y, [LR]]

      let eye_pixel_count = [0,0,0,0]
      if (!use_faceLandmarksDetection && options.blink_detection) {
let r_min = ~~eye_bb[0][1]
let c_min = ~~eye_bb[0][0]
let r_max = ~~eye_bb[1][1]
let c_max = ~~eye_bb[1][0]
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
      eyes[i][5] = eye_pixel_count.map((count)=>count/(eye_w*eye_h));

    }
  }

if (!use_faceLandmarksDetection) {
// practically only the first eye data is used
  if (eyes.length) {
    if (!eyes[0])
      eyes = [eyes[1]]
//    let score = eyes[0][5] - ((eyes[1] && eyes[1][5])||99999)
//    if (score > 0) eyes = [eyes[1],eyes[0]]

let eye_x = null
let eye_y = null
//_eyes = (eyes.length==1) ? [eyes[0],eyes[0]] : eyes
//eye_x = (Math.sign(_eyes[0][2]) + Math.sign(_eyes[1][2]) == 0) ? null : ((Math.abs(_eyes[0][2]) > Math.abs(_eyes[1][2])) ? Math.abs(_eyes[0][2]) : Math.abs(_eyes[1][2]));
//eye_y = (Math.sign(_eyes[0][3]) + Math.sign(_eyes[1][3]) == 0) ? null : ((Math.abs(_eyes[0][3]) > Math.abs(_eyes[1][3])) ? Math.abs(_eyes[0][3]) : Math.abs(_eyes[1][3]));
if (eye_x == null) {
  eyes.forEach((e)=>{eye_x+=e[2]})
  eye_x /= eyes.length
}
if (eye_y == null) {
  eyes.forEach((e)=>{eye_y+=e[3]})
  eye_y /= eyes.length
}
eyes.forEach((e)=>{e[2]=eye_x;e[3]=eye_y;})
    eyes[0][4].push(_t_list[1])
  }
}

  if (sx || sy) {
    sm.forEach(xyz => {xyz[0]+=sx; xyz[1]+=sy;});
  }

  faces[0].bb = bb
  faces[0].bb_ratio = bb.ratio
  faces[0].bb_center = [(face.boundingBox.topLeft[0]+(face.boundingBox.bottomRight[0]-face.boundingBox.topLeft[0])/2+sx)/w, (face.boundingBox.topLeft[1]+(face.boundingBox.bottomRight[1]-face.boundingBox.topLeft[1])/2+sy)/h]

_t_now = performance.now()
_t_list[1] = _t_now-_t
_t = _t_list.reduce((a,c)=>a+c)

  let draw_camera// = true;
  if (use_pose_worker && pose_worker_ready) {
    let data = { rgba:rgba.buffer, w:cw, h:ch, options:{ use_handpose:options.use_handpose, _t:_t } };//, threshold:1 };
    pose_worker.postMessage(data, [data.rgba]);
    pose_worker_ready = false
    draw_camera = false
  }

  postMessage(JSON.stringify({ faces:[{ faceInViewConfidence:faces[0].faceInViewConfidence, scaledMesh:(canvas)?{454:sm[454],234:sm[234]}:sm, mesh:faces[0].mesh, eyes:eyes, bb_center:faces[0].bb_center, emotion:face.emotion }], _t:_t }));

  if (draw_camera) {
    if (!canvas_camera) {
      canvas_camera = new OffscreenCanvas(cw,ch);
    }
    else {
      if ((canvas_camera.width != cw) || (canvas_camera.height != ch)) {
        canvas_camera.width  = cw
        canvas_camera.height = ch
      }
    }
    canvas_camera.getContext("2d").putImageData(new ImageData(rgba, cw,ch), 0,0);
  }

  rgba = undefined;

//return

  if (canvas && TRIANGULATION && options.draw_canvas && faces.length) {
    if (RAF_timerID)
      cancelAnimationFrame(RAF_timerID)
    RAF_timerID = requestAnimationFrame(function () {
      RAF_timerID = null
      draw_facemesh(faces, Math.round(w/2),Math.round(h/2));
      draw_pose()
    });
  }
}

var flip_canvas;
var canvas_camera;

function draw_facemesh(faces, w,h, rgba) {
  function distance(a,b) {
return Math.sqrt(Math.pow(a[0]-b[0],2) + Math.pow(a[1]-b[1],2))
  }

  if ((canvas.width != w) || (canvas.height != h)) {
    canvas.width  = w
    canvas.height = h
  }

  context.save()

  if (flip_canvas) {
    context.translate(canvas.width, 0)
    context.scale(-1, 1)
  }

  context.clearRect(0,0,w,h)

  context.globalAlpha = 0.5
  context.fillStyle = 'black'
  context.fillRect(0,0,w,h)

  const bb = faces[0].bb
  if (canvas_camera) {
    context.globalAlpha = 1
    context.drawImage(canvas_camera, bb.x/2, bb.y/2, bb.w/2, bb.h/2)
//    context.globalAlpha = 0.5
  }

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

  if (canvas_camera) {
        const ctx = context;

const NUM_KEYPOINTS = 468;
const NUM_IRIS_KEYPOINTS = 5;
const RED = "#FF2C35";

        ctx.strokeStyle = RED;
        ctx.lineWidth = 1;

        const leftCenter = keypoints[NUM_KEYPOINTS];
        const leftDiameterY = distance(
          keypoints[NUM_KEYPOINTS + 4],
          keypoints[NUM_KEYPOINTS + 2]);
        const leftDiameterX = distance(
          keypoints[NUM_KEYPOINTS + 3],
          keypoints[NUM_KEYPOINTS + 1]);

        ctx.beginPath();
        ctx.ellipse(leftCenter[0]/2, leftCenter[1]/2, leftDiameterX / 2/2, leftDiameterY / 2/2, 0, 0, 2 * Math.PI);
        ctx.stroke();

        if(keypoints.length > NUM_KEYPOINTS + NUM_IRIS_KEYPOINTS) {
          const rightCenter = keypoints[NUM_KEYPOINTS + NUM_IRIS_KEYPOINTS];
          const rightDiameterY = distance(
            keypoints[NUM_KEYPOINTS + NUM_IRIS_KEYPOINTS + 2],
            keypoints[NUM_KEYPOINTS + NUM_IRIS_KEYPOINTS + 4]);
          const rightDiameterX = distance(
            keypoints[NUM_KEYPOINTS + NUM_IRIS_KEYPOINTS + 3],
            keypoints[NUM_KEYPOINTS + NUM_IRIS_KEYPOINTS + 1]);

          ctx.beginPath();
          ctx.ellipse(rightCenter[0]/2, rightCenter[1]/2, rightDiameterX / 2/2, rightDiameterY / 2/2, 0, 0, 2 * Math.PI);
          ctx.stroke();
        }
  }
  else {
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

  context.globalAlpha = 1/3
  context.strokeStyle = 'white';
  context.lineWidth = 3;
  const region = new Path2D();

  region.moveTo(bb.x/2, bb.y/2);
  region.lineTo(bb.x/2+bb.w/2, bb.y/2);
  region.lineTo(bb.x/2+bb.w/2, bb.y/2+bb.h/2);
  region.lineTo(bb.x/2, bb.y/2+bb.h/2);

  region.closePath();
  context.stroke(region);

  context.restore()

  context.globalAlpha = 0.5
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

var posenet, pose_w, pose_h;
var handpose;
var cw, ch;

//https://github.com/tensorflow/tfjs-models/blob/master/posenet/src/keypoints.ts
var pose_connected_pairs = [
  ['leftHip', 'leftShoulder'], ['leftElbow', 'leftShoulder'],
  ['leftElbow', 'leftWrist'], ['leftHip', 'leftKnee'],
  ['leftKnee', 'leftAnkle'], ['rightHip', 'rightShoulder'],
  ['rightElbow', 'rightShoulder'], ['rightElbow', 'rightWrist'],
  ['rightHip', 'rightKnee'], ['rightKnee', 'rightAnkle'],
  ['leftShoulder', 'rightShoulder'], ['leftHip', 'rightHip']
];

function draw_pose() {
  if (!posenet || (posenet.score < 0.1)) return;

  context.save()

  if (flip_canvas) {
    context.translate(canvas.width, 0)
    context.scale(-1, 1)
  }

  var scale = pose_w/cw*2

  var part = {}
  posenet.keypoints.forEach(function (p, idx) {
    part[p.part] = p

    if (idx > 12) p.score = 0;
    if (p.score <= 0) return;
    if (/nose|Eye|Ear/.test(p.part)) return;

    const {y, x} = p.position;

    context.beginPath();
    context.arc(x/scale, y/scale, 3, 0, 2*Math.PI);
    context.fillStyle = 'aqua';
    context.fill();
  });

  pose_connected_pairs.forEach(function (pair) {
    var L = part[pair[0]]
    var R = part[pair[1]]
    if ((L.score <= 0) || (R.score <= 0)) return;

    var ax = L.position.x, ay = L.position.y, bx = R.position.x, by = R.position.y;
    context.beginPath();
    context.moveTo(ax/scale, ay/scale);
    context.lineTo(bx/scale, by/scale);
    context.lineWidth = 2;
    context.strokeStyle = 'aqua';
    context.stroke();
  });

  draw_hand();

  context.restore()
}

// https://github.com/tensorflow/tfjs-models/blob/master/handpose/demo/index.js
var fingerLookupIndices = {
      thumb: [0, 1, 2, 3, 4],
      indexFinger: [0, 5, 6, 7, 8],
      middleFinger: [0, 9, 10, 11, 12],
      ringFinger: [0, 13, 14, 15, 16],
      pinky: [0, 17, 18, 19, 20]
};

function draw_hand() {
  if (!handpose || !handpose.length) return;

  var scale = pose_w/cw*2

  context.strokeStyle = 'pink';
  context.fillStyle = 'pink';

  handpose.forEach(function (hand) {
    const keypoints = hand.landmarks;

    keypoints.forEach(function (p) {
      context.beginPath();
      context.arc((p[0]-2)/scale, (p[1]-2)/scale, 3, 0, 2 * Math.PI);
      context.fill();
    });

    Object.keys(fingerLookupIndices).forEach(function (finger) {
      const points = fingerLookupIndices[finger].map(idx => keypoints[idx]);

      const region = new Path2D();
      region.moveTo(points[0][0]/scale, points[0][1]/scale);
      for (let i = 1; i < points.length; i++) {
        const point = points[i];
        region.lineTo(point[0]/scale, point[1]/scale);
      }
      context.stroke(region);
    });
  });
}

function pose_worker_onmessage(e) {
  var data = ((typeof e.data == "string") && (e.data.charAt(0) === "{")) ? JSON.parse(e.data) : e.data;

  if (typeof data === "string") { 
    if (data == "OK") {
      pose_worker_ready = true
    }
    else {
//      DEBUG_show(data, 2)
//      System._browser.console.log(data)
    }
  }
  else {
    pose_worker_ready = true

    postMessage(data);

    posenet = data.posenet
    pose_w = cw
    pose_h = ch
    handpose = data.handpose
    data.posenet = undefined
    data.handpose = undefined
  }
}

onmessage = function (e) {
  let t = performance.now()
  let data = (typeof e.data === "string") ? JSON.parse(e.data) : e.data;

  if (data.options) {
    use_pose_worker = data.options.use_pose_worker
    flip_canvas = data.options.flip_canvas

    if (use_pose_worker && !pose_worker) {
      pose_worker = new Worker('pose_worker.js?use_mobilenet=1');
      pose_worker.onmessage = pose_worker_onmessage;
    }
  }

  if (data.canvas) {
    canvas = data.canvas
    context = canvas.getContext("2d")
  }

  if (data.rgba) {
    cw = data.w
    ch = data.h
    process_video_buffer(data.rgba, cw,ch, data.options);
    data.rgba = undefined
  }

  if (data.posenet) {
    posenet = data.posenet
    pose_w = data.w
    pose_h = data.h
    handpose = data.handpose
    data.posenet = undefined
    data.handpose = undefined
  }

  data = undefined
};
