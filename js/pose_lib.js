// (2021-11-23)

var PoseAT = (function () {

  var is_worker = (typeof window !== "object");

  var use_human;
  var use_mixed_human;
  var use_tfjs, use_tfjs_posenet, use_mediapipe, use_blazepose, use_movenet, use_holistic, use_mediapipe_hands;

  var use_human_only, use_human_pose, use_human_hands;

  var human;

  var posenet_model, handpose_model;
  var holistic_model;

  var use_mobilenet;

  var no_hand_countdown = 0, no_hand_countdown_max = 3;

  var fps = 0, fps_count = 0, fps_ms = 0;

  var postMessageAT = (is_worker) ? postMessage : function (msg, transfer) {
    _PoseAT._worker.onmessage({data:msg})
  };

  function path_adjusted(url) {
    if (!is_worker && !/^\w+\:/i.test(url)) {
      url = url.replace(/^(\.?\/?)([\w\@])/, "$1js/$2")
    }
    return url
  }

  async function load_scripts(url) {
if (is_worker) {
  importScripts(url)
}
else {
  return new Promise((resolve, reject) => {
    let script = document.createElement('script');
    script.onload = () => { resolve() };
    script.src = path_adjusted(url);
    document.head.appendChild(script);
  });
}
  }

  function _onmessage(e) {
    let t = performance.now()
    let data = (typeof e.data === "string") ? JSON.parse(e.data) : e.data;

    if (data.canvas) {
      canvas = data.canvas
      context = canvas.getContext("2d")
    }

    if (data.rgba) {
      process_video_buffer(data.rgba, data.w,data.h, data.options);

      data.rgba = undefined
      data = undefined
    }
  }

  async function init(_worker, param) {
_PoseAT._worker = _worker;

if (param) {
  param = (function () {
    var _param = {};
    param.forEach((p)=>{
      if (/(\w+)\=(\w+)/.test(p))
        _param[RegExp.$1] = RegExp.$2
    });
    return {
      get: function (id) {
        return _param[id]
      }
    };
  })();
}
else {
  param = new URLSearchParams(self.location.search.substring(1));
}

if (is_worker) {
  _PoseAT._canvas_for_imagedata = new OffscreenCanvas(1,1);
}

if (use_human || param.get('use_human')) {
  use_human_only = true

  use_human = true
  use_tfjs = false
  use_tfjs_posenet = false

  use_human_pose = true
  use_human_hands = true
}
else if (use_mixed_human || param.get('use_mixed_human')) {
  use_mixed_human = true

  use_human = true
  use_tfjs = true
  use_tfjs_posenet = true

  use_human_hands = true
}
else {
  use_human = false
  use_tfjs = true
  use_tfjs_posenet = true
}

if (use_blazepose || param.get('use_blazepose')) {
  use_blazepose = true
//use_mediapipe=true
//use_holistic=true
}

if (use_tfjs && (use_mediapipe || param.get('use_mediapipe'))) {
  use_mediapipe = true
  if (use_human) {
// use human for pose, mediapipe for hands
    use_tfjs = false
    use_tfjs_posenet = false

    use_human_pose = true
    use_human_hands = false
  }
  else if (use_holistic || param.get('use_holistic')) {
    use_holistic = true
  }
}

// new hand-pose-detection
// assumed mediapipe version for now
if (!use_human || !use_human_hands) use_mediapipe_hands = true;

if (use_mediapipe || use_mediapipe_hands) process=undefined;

if (use_movenet || param.get('use_movenet')) {
  use_movenet = true
}

use_mobilenet = param.get('use_mobilenet');

if (use_holistic) {
  await load_scripts('@mediapipe/holistic/holistic.js');

  await (async function () {
    var holistic = new Holistic({locateFile: (file) => {
return _PoseAT.path_adjusted('@mediapipe/holistic/' + file);
//return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
    }});

    holistic.setOptions({
modelComplexity: 1,
smoothLandmarks: true,
minDetectionConfidence: 0.5,
minTrackingConfidence: 0.5,
refineFaceLandmarks: true,
    });

    var holistic_results;
    holistic.onResults((results)=>{
holistic_results = results;
    });

    await holistic.initialize();

    holistic_model = {
predict: async function (img, config) {
  await holistic.send({image:img});
  return holistic_results;
}
    };
  })();

  console.log('(Mediapipe Holistic initialized)')
  postMessageAT('(Mediapipe Holistic initialized)')
}
else if (use_tfjs) {
  if (use_mediapipe && use_blazepose) {
    await load_scripts('@mediapipe/pose/pose.js');//'https://cdn.jsdelivr.net/npm/@mediapipe/pose');
  }

  if (!(((use_mediapipe && use_blazepose) || use_human_pose) && use_mediapipe_hands)) {
// https://blog.tensorflow.org/2020/03/face-and-hand-tracking-in-browser-with-mediapipe-and-tensorflowjs.html
    let tfjs_version = '';//'@3.9.0';//'@3.5.0';//'@3.3.0';//@2.8.5';
    await load_scripts('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs' + tfjs_version);
    console.log('Use TFJS (pose/hands)')
  }
}

if (use_human) {
  await load_scripts('./human/dist/human.js');

  human = new Human.default();//(is_worker) ? new Human.default() : new Human();
//import Human from './human/dist/human.esm.js';
//human = new Human();

  human.load({
    backend: 'webgl',
//warmup: 'full',

    filter: {
      enabled: false
    },

    gesture: {
      enabled: false
    },

    face: {
      enabled: false
    },

    body: {
      enabled: use_human_pose,
//      maxDetections: 1,
      maxDetected: 1,
      modelPath: path_adjusted('./human/models/' + ((use_blazepose) ? 'blazepose' : ((use_movenet) ? 'movenet-thunder' : 'posenet')) + '.json'),
//modelType: 'posenet-resnet', modelPath: 'https://storage.googleapis.com/tfjs-models/savedmodel/posenet/resnet50/quant2/model-stride16.json', outputStride: 16,
//      modelType: 'ResNet', modelPath: 'https://storage.googleapis.com/tfjs-models/savedmodel/posenet/resnet50/quant2/model-stride16.json', outputStride: 16,
//scoreThreshold: 0.1,
    },

    hand: {
      enabled: use_human_hands,
//      maxHands: 2,
      maxDetected: 2,
      rotation: true,
      detector: {
        modelPath: path_adjusted('./human/models/handtrack.json')//handdetect.json')//
      },
      skeleton: {
        modelPath: path_adjusted('./human/models/handskeleton.json')
      },
//iouThreshold:0.3, scoreThreshold:0.75, skipFrames:2
/*
iouThreshold: 0.3,
scoreThreshold:0.5,
*/
skipFrames:5,
minConfidence: 0.2
    }
  });
//human.warmup().then(()=>{console.log('OK')});

  console.log('(Human - body:' + !!use_human_pose + '/hand:' + !!use_human_hands + ')')
}


try {
  if (!use_holistic && !use_human_pose) {
/*
    await load_scripts('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm/dist/tf-backend-wasm.js');
    tf.wasm.setWasmPaths('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm/dist/');
    await tf.setBackend("wasm")
*/
    if (use_movenet) {
      await load_scripts((use_mediapipe && use_blazepose)?'@mediapipe/pose-detection.js':'https://cdn.jsdelivr.net/npm/@tensorflow-models/pose-detection');

      if (use_blazepose) {
        const detectorConfig = (use_mediapipe) ?
{
  runtime: 'mediapipe',
//  solutionPath: 'base/node_modules/@mediapipe/pose'
}
:
{
  runtime: 'tfjs',
  enableSmoothing: true,
  modelType: 'full'
};
        posenet = await poseDetection.createDetector(poseDetection.SupportedModels.BlazePose, detectorConfig);

        let msg = '(' + ((use_mediapipe) ? 'Mediapipe' : 'TFJS') + ' BlazePose initialized)';
        console.log(msg)
        postMessageAT(msg)
      }
      else {
        const detectorConfig = {modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER};//{modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING};//
        posenet = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig);

        console.log('(MoveNet initialized)')
        postMessageAT('(MoveNet initialized)')
      }
    }
    else {
      await load_scripts('https://cdn.jsdelivr.net/npm/@tensorflow-models/posenet');

      posenet_model = await posenet.load((use_mobilenet) ?
{
  architecture: 'MobileNetV1',
  outputStride: 16,
//  inputResolution: { width: 640, height: 480 },
  multiplier: 0.75
}
:
{
  architecture: 'ResNet50',
  outputStride: 32,
//  inputResolution: { width: 257, height: 200 },
  quantBytes: 2/2
}
      );

      console.log('(PoseNet initialized)')
      postMessageAT('(PoseNet initialized)')
    }
  }

  if (!use_holistic && !use_human_hands) {
    if (1) {
      await load_scripts('@mediapipe/hands/hands.js');//'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js');//

      await (async function () {
        var hands = new Hands({locateFile: (file) => {
return _PoseAT.path_adjusted('@mediapipe/hands/' + file);
//return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
        }});

        hands.setOptions({
maxNumHands: 2,
minDetectionConfidence: 0.5,
minTrackingConfidence: 0.5,
modelComplexity: 1,
        });

        var hands_results;
        hands.onResults((results)=>{
hands_results = results;
        });

        await hands.initialize();

        handpose_model = {
estimateHands: async function (img, config) {
  await hands.send({image:img});
  return hands_results;
}
        };
      })();

      console.log('(Mediapipe hands initialized)')
      postMessageAT('(Mediapipe hands initialized)')
    }
// obsolete
/*
    else {
//    await load_scripts('https://cdn.jsdelivr.net/npm/@tensorflow-models/handpose@0.0.6/dist/handpose.js');
await load_scripts('handpose.js');

      handpose_model = await handpose.load()

      console.log('(Handpose initialized)')
      postMessageAT('(Handpose initialized)')
    }
*/
  }

  postMessageAT('OK')
}
catch (err) { postMessageAT('PoseNet/Handpose ERROR:' + err) }

  }

var skip_hand_countdown = 0

var eyes;
var eyes_xy_last = [[0,0],[0,0]];

async function process_video_buffer(rgba, w,h, options) {
  function pose_adjust(pose) {
    if (!pose || !use_movenet) return pose

// latest human
    if (use_human_pose) {
      pose.keypoints.forEach((kp) => {
        if (kp.position.length)
          kp.position = {x:kp.position[0], y:kp.position[1]}
      });
      return pose;
    }

    if (use_holistic) {
      const _result = pose
      if (_result.ea && _result.ea.length && _result.poseLandmarks && _result.poseLandmarks.length) {
// https://github.com/tensorflow/tfjs-models/blob/master/pose-detection/src/blazepose_mediapipe/detector.ts

        const iw = _result.image.width
        const ih = _result.image.height
        
        pose  = [{
  score: 1,
  keypoints: _result.poseLandmarks.map((landmark, i) => ({
x: landmark.x * iw,
y: landmark.y * ih,
z: landmark.z,
score: landmark.visibility,
name: BLAZEPOSE_KEYPOINTS[i]
  })),
  keypoints3D: _result.ea.map((landmark, i) => ({
x: landmark.x,
y: landmark.y,
z: landmark.z,
score: landmark.visibility,
name: BLAZEPOSE_KEYPOINTS[i]
   })),
        }];
      }
      else {
        pose = []
      }
    }

    if (!pose.length)
      return {score:0,keypoints:[]}

    let keypoints_movenet = []
    pose[0].keypoints.forEach((kp) => {
      keypoints_movenet.push({
  position: {x:kp.x, y:kp.y},
  score: kp.score,
  part: kp.name.replace(/\_(\w)/, (match, p1)=>p1.toUpperCase()),
      });
    });

    if (use_blazepose && use_mediapipe && pose[0].keypoints && pose[0].keypoints.length) {
// temp fix for undefined .score
      pose[0].score = 1
    }

    let result = { score:pose[0].score, keypoints:keypoints_movenet };
    if (pose[0].keypoints3D)
      result.keypoints3D = pose[0].keypoints3D

    return result;
  }

  function hands_adjust(hands) {
    if (!hands || use_human_hands) return hands

    if (use_holistic) {
      const _result = hands
      hands = { image:_result.image, multiHandedness:[], multiHandLandmarks:[] }
      if (_result.leftHandLandmarks && _result.leftHandLandmarks.length) {
        hands.multiHandLandmarks.push(_result.leftHandLandmarks)
        hands.multiHandedness.push({score:1})
      }
      if (_result.rightHandLandmarks && _result.rightHandLandmarks.length) {
        hands.multiHandLandmarks.push(_result.rightHandLandmarks)
        hands.multiHandedness.push({score:1})
      }
    }

    if (!hands.multiHandedness || !hands.multiHandedness.length)
      return []

    var _hands = []
    var iw = hands.image.width
    var ih = hands.image.height
    for (var i = 0, i_max = Math.min(hands.multiHandedness.length,2); i < i_max; i++) {
      let h = hands.multiHandLandmarks[i].map((_h)=>[_h.x*iw, _h.y*ih, _h.z*iw]);
      _hands[i] = {
score: hands.multiHandedness[i].score,
keypoints: h,
// ["thumb", "index", "middle", "ring", "pinky"]
annotations: {
  "palm":   [h[0]],
  "thumb":  [h[1], h[2], h[3], h[4]],
  "index":  [h[5], h[6], h[7], h[8]],
  "middle": [h[9], h[10],h[11],h[12]],
  "ring":   [h[13],h[14],h[15],h[16]],
  "pinky":  [h[17],h[18],h[19],h[20]]
}
      };
    }

//console.log(_hands)
    return _hands;
  }

  function is_hand_visible(pose) {
    if (!pose || (pose.score < 0.1)) return false;

    return [9,10].some((id)=>{
      var kp = pose.keypoints[id]
      return (kp.score > score_threshold) && (kp.position.x > -w*0.05) && (kp.position.x < w*1.05) && (kp.position.y > -h*0.05) && (kp.position.x < h*1.05);
    });
  }


function process_facemesh(faces, w,h, bb) {
  let sx = bb.x
  let sy = bb.y
  let cw = bb.w
  let ch = bb.h

  eyes = []

  let face;
  if (use_mediapipe_facemesh) {
    face = {}
    face.faceInViewConfidence = 1
    let min_x=9999, min_y=9999, max_x=-9999, max_y=-9999;
    let mesh=[], scaledMesh=[];
    faces.multiFaceLandmarks[0].forEach((f)=>{
      var x = f.x * cw
      var y = f.y * ch
      var z = f.z * cw

      min_x = Math.min(min_x, x)
      min_y = Math.min(min_y, y)
      max_x = Math.max(max_x, x)
      max_y = Math.max(max_y, y)

      mesh.push([f.x, f.y, f.z])
      scaledMesh.push([x, y, z])
    });
    face.boundingBox = { topLeft:[min_x,min_y], bottomRight:[max_x,max_y] }
    face.scaledMesh = scaledMesh
    face.mesh = mesh
    const size = Math.max(max_x-min_x, max_y-min_y);
    face.mesh.forEach(coords=>{
      coords[0] *= 256 * cw / size;
      coords[1] *= 256 * ch / size;
      coords[2] *= 256 * cw / size;
    });
    faces = [face]
//console.log(face)
  }
  else {
    face = faces[0]
    if (use_human_facemesh) {
      face.faceInViewConfidence = face.confidence
      face.scaledMesh = face.mesh
      face.mesh = face.meshRaw
      face.boundingBox = face.boxRaw
// human v1.1.9+
      face.boundingBox = { topLeft:[face.boxRaw[0]*cw,face.boxRaw[1]*ch], bottomRight:[(face.boxRaw[0]+face.boxRaw[2])*cw,(face.boxRaw[1]+face.boxRaw[3])*ch] }
      const size = Math.max(face.boxRaw[2]*cw, face.boxRaw[3]*ch) / 1.5;
      face.mesh.forEach(coords=>{
        coords[0] *= 256 * cw / size;
        coords[1] *= 256 * ch / size;
        coords[2] *= 256;
      });
    }
    else if (facemesh_version == '@0.0.3') {
      face.boundingBox = { topLeft:face.boundingBox.topLeft[0], bottomRight:face.boundingBox.bottomRight[0]}
    }
  }

//  let bb = face.boundingBox;
//  let face_radius = Math.min(bb.bottomRight[0][0]-bb.topLeft[0][0], bb.bottomRight[0][1]-bb.topLeft[0][1])/2;

  let sm = face.scaledMesh;

  let eye_bb, eye_center, eye_w, eye_h, eye_radius;

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

  let r,c,s;
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
  faces[0].bb_center = [(face.boundingBox.topLeft[0]+(face.boundingBox.bottomRight[0]-face.boundingBox.topLeft[0])/2+sx)/w, (face.boundingBox.topLeft[1]+(face.boundingBox.bottomRight[1]-face.boundingBox.topLeft[1])/2+sy)/h]

  return faces
}


  let _t = performance.now()

  if (rgba instanceof ArrayBuffer)
    rgba = new ImageData(new Uint8ClampedArray(rgba), w,h)
//rgba = tf.browser.fromPixels(rgba)

  let pose, hands, facemesh;
  let score_threshold = (use_movenet) ? 0.3 : 0.5;

  let use_mediapipe_facemesh = true
  let use_faceLandmarksDetection = true

  if (use_holistic) {
    const result = await holistic_model.predict(rgba);
//console.log(result)

    pose = pose_adjust(result)
    hands = hands_adjust(result)

    if (result.faceLandmarks && result.faceLandmarks.length) {
      faces = process_facemesh({multiFaceLandmarks:[result.faceLandmarks]}, w,h, {x:0, y:0, w:w, h:h, ratio:0, scale:1});

      let face = faces[0]
      let sm = face.scaledMesh;
// NOTE: pass the full scaledMesh as it is needed to be passed and drawn on the facemesh worker
      facemesh = { faces:[{ faceInViewConfidence:face.faceScore||face.faceInViewConfidence||0, scaledMesh:sm, mesh:face.mesh, eyes:eyes, bb_center:face.bb_center, emotion:face.emotion, rotation:face.rotation }] };
//console.log(facemesh)
    }
  }
  else if (use_human_only) {
    const result = await human.detect(rgba, {hand:{enabled:options.use_handpose}})
//    console.log(result)

    pose = result.body[0]
    hands = result.hand

// human v2.0+
    if (pose.keypoints && pose.keypoints.length && Array.isArray(pose.keypoints[0].position)) {
      pose.keypoints.forEach((kp)=>{
        kp.position = {x:kp.position[0], y:kp.position[1]}
      });
    }
  }
  else if (no_hand_countdown <= 0) {
    pose = await ((use_human_pose) ? human.detect(rgba) : ((use_movenet) ? posenet.estimatePoses(rgba, {}, _t) : posenet_model.estimateSinglePose(rgba, {})));
    pose = pose_adjust((use_human_pose) ? pose.body[0] : pose)

    if (options.use_handpose && (handpose_model || use_human_hands) && (skip_hand_countdown-- <= 0)) {
      skip_hand_countdown = options.skip_hand_countdown_max||0
      if (is_hand_visible(pose)) {
        if (handpose_model) {
          hands = await handpose_model.estimateHands(rgba);
          hands = hands_adjust(hands)
        }
        else {
          const result = await human.detect(rgba)
          hands = result.hand
        }
        no_hand_countdown = no_hand_countdown_max
      }
      else {
        no_hand_countdown--
      }
    }
  }
  else {
    let p_list = [(use_human_pose) ? human.detect(rgba).then(result=>result.body[0]) : ((use_movenet) ? posenet.estimatePoses(rgba, {}, _t) : posenet_model.estimateSinglePose(rgba, {})).then(_pose=>_pose)]
    if (options.use_handpose && (handpose_model || use_human_hands) && (skip_hand_countdown-- <= 0)) {
      skip_hand_countdown = options.skip_hand_countdown_max||0
      p_list.push((handpose_model) ? handpose_model.estimateHands(rgba).then(_hands=>_hands) : human.detect(rgba).then(result=>result.hand));
    }

    const values = await Promise.all(p_list);

    pose = pose_adjust(values[0])
    if (p_list.length > 1) {
      if (is_hand_visible(pose)) {
        hands = hands_adjust(values[1])
        no_hand_countdown = no_hand_countdown_max
      }
      else {
        no_hand_countdown--
      }
    }
  }

  _t = performance.now() - _t +(options._t||0);

  fps_ms += _t
  if (++fps_count >= 20) {
    fps = 1000 / (fps_ms/fps_count)
    fps_count = fps_ms = 0
  }

  if (hands) {
    hands = hands.filter((h)=>h.annotations&&Object.keys(h.annotations).length);
  }

  if (facemesh) {
    facemesh._t = _t
    facemesh.fps = fps
  }

  postMessageAT(JSON.stringify({ posenet:pose, handpose:hands, facemesh:facemesh, _t:_t, fps:fps }));

//rgba.dispose();
  rgba = undefined;
}

// https://github.com/tensorflow/tfjs-models/blob/master/pose-detection/src/constants.ts
const BLAZEPOSE_KEYPOINTS = [
  'nose',
  'left_eye_inner',
  'left_eye',
  'left_eye_outer',
  'right_eye_inner',
  'right_eye',
  'right_eye_outer',
  'left_ear',
  'right_ear',
  'mouth_left',
  'mouth_right',
  'left_shoulder',
  'right_shoulder',
  'left_elbow',
  'right_elbow',
  'left_wrist',
  'right_wrist',
  'left_pinky',
  'right_pinky',
  'left_index',
  'right_index',
  'left_thumb',
  'right_thumb',
  'left_hip',
  'right_hip',
  'left_knee',
  'right_knee',
  'left_ankle',
  'right_ankle',
  'left_heel',
  'right_heel',
  'left_foot_index',
  'right_foot_index'
];

  var _PoseAT = {
    init,
    path_adjusted,
  };

  if (is_worker) {
    onmessage = _onmessage
  }
  else {
    _PoseAT.onmessage = _onmessage
  }

  return _PoseAT;
})();
