// 2024-03-25

const is_worker = (typeof window !== "object");

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

function Core(AT) {

  var postMessageAT;

function init_common(_worker, param, _onmessage) {
  this.AT._worker = _worker;

  if (is_worker) {
    onmessage = (e)=>{ _onmessage.call(this, e); }
  }
  else {
    this.AT.onmessage = (e)=>{ _onmessage.call(this, e); }
  }

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

  return param;
}

async function PoseAT_init(_worker, param) {

function _onmessage(e) {
  let t = performance.now()
  let data = (typeof e.data === "string") ? JSON.parse(e.data) : e.data;

  if (data.canvas) {
    canvas = data.canvas
    context = canvas.getContext("2d")
  }
  if (data.canvas_hands)
    _canvas_hands = data.canvas_hands;
  canvas_hands = (data.options.use_canvas_hands && !data.options.use_holistic) ? _canvas_hands : null;
  if (data.canvas_hands) console.log('(Transferred - canvas_hands)');

  if (data.canvas_hands_worker)
    _canvas_hands_worker = data.canvas_hands_worker;

  if (data.rgba) {
    process_video_buffer.call(this, data.rgba, data.w,data.h, data.options);

    data.rgba = undefined
    data = undefined
  }
}

// common
param = init_common.call(this, _worker, param, _onmessage);

//if (is_worker) this.AT._canvas_for_imagedata = new OffscreenCanvas(1,1);

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

//if (use_mediapipe || use_mediapipe_hands) process=undefined;

if (use_movenet || param.get('use_movenet')) {
  use_movenet = true
}

use_mediapipe_hand_landmarker = use_mediapipe_pose_landmarker = use_mediapipe;

use_mobilenet = param.get('use_mobilenet');

if (is_worker) {
  importScripts('./one_euro_filter.js');
}

postMessageAT('(Pose worker initialized)')
postMessageAT('OK')
}

async function HandsAT_init(_worker, param) {

function _onmessage(e) {
  let t = performance.now()
  let data = (typeof e.data === "string") ? JSON.parse(e.data) : e.data;

  if (data.canvas) {
    canvas = data.canvas
    context = canvas.getContext("2d")
  }
  if (data.canvas_hands)
    _canvas_hands = data.canvas_hands;
  canvas_hands = (data.options.use_canvas_hands && !data.options.use_holistic) ? _canvas_hands : null;
  if (data.canvas_hands) console.log('(Transferred - canvas_hands_workers)');

  if (data.rgba) {
    process_video_buffer.call(this, data.rgba, data.w,data.h, data.options);

    data.rgba = undefined
    data = undefined
  }
}

// common
  param = init_common.call(this, _worker, param, _onmessage);

  if (is_worker) importScripts('./one_euro_filter.js');

  postMessageAT('(Hands worker initialized)');
  postMessageAT('OK');
}

  var posenet_initialized, handpose_initialized, holistic_initialized, human_initialized;
  async function PoseAT_load_lib(options) {
if (options.use_holistic_legacy && !holistic_initialized) {
  await load_scripts('@mediapipe/holistic/holistic.js');

  await (async ()=>{
    var holistic = new Holistic({locateFile: (file) => {
return this.AT.path_adjusted('@mediapipe/holistic/' + file);
//return `https://cdn.jsdelivr.net/npm/@mediapipe/holistic/${file}`;
    }});

    pose_model_quality = options.model_quality || '';
    holistic.setOptions({
modelComplexity: (pose_model_quality == 'Best') ? 2 : 1,
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
predict: async function (img, config, timestamp) {
  await holistic.send({image:img}, timestamp);
  return holistic_results;
}
    };

    holistic_initialized = true
  })();

  console.log('(Mediapipe Holistic initialized)')
  postMessageAT('(Mediapipe Holistic initialized)')
}

if (!use_mediapipe_pose_landmarker && !options.use_holistic && use_tfjs && !posenet_initialized) {
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

if (use_human && !human_initialized) {
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

  human_initialized = true
}

if (!options.use_holistic_legacy && !use_human_pose) {

if ((options.use_holistic_landmarker) ? !holistic_initialized : !posenet_initialized) {
/*
  await load_scripts('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm/dist/tf-backend-wasm.js');
  tf.wasm.setWasmPaths('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs-backend-wasm/dist/');
  await tf.setBackend("wasm")
*/
  if (use_mediapipe_pose_landmarker) {
    const vision = await load_vision_common();

    if (options.use_holistic_landmarker) {
      holistic_landmarker = await HolisticLandmarker.createFromOptions(
vision,
{
  baseOptions: {
    modelAssetPath: path_adjusted('@mediapipe/tasks/' + 'holistic_landmarker' + '.task'),
//    delegate: "GPU"
  },
  runningMode: 'VIDEO',

  outputFaceBlendshapes: true
}
      );

      mediapipe_hand_landmarker.setup();
    }
    else {
      pose_model_quality = options.model_quality || '';
      pose_landmarker = await PoseLandmarker.createFromOptions(
vision,
{
  baseOptions: {
    modelAssetPath: path_adjusted('@mediapipe/tasks/' + 'pose_landmarker_' + ((pose_model_quality == 'Best') ? 'heavy' : 'full') + '.task'),
    delegate: "GPU"
  },
  runningMode: 'VIDEO',
//minPoseDetectionConfidence:0.8, minPosePresenceConfidence:0.8, minTrackingConfidence:0.8,
  numPoses: 1
}
      );
      console.log('Pose model quality:' + (pose_model_quality||'Normal'));
    }

    data_filter[0] = {
      landmarks: [],
      worldLandmarks: [],
    };
    for (let i = 0; i < 33; i++) {
      data_filter[0].landmarks[i] = new OneEuroFilter(30, 1,1,2, 3);
      data_filter[0].worldLandmarks[i] = new OneEuroFilter(30, 1,1,2, 3);
    }
    data_filter[0].poseLandmarks = data_filter[0].landmarks;
    data_filter[0].poseWorldLandmarks = data_filter[0].worldLandmarks;

    posenet = {
estimatePoses: function (video, dummy, nowInMs) {
  const landmarker = (options.use_holistic_landmarker) ? holistic_landmarker : pose_landmarker;
  let result = landmarker.detectForVideo(video, nowInMs);
//console.log(result)

  let pose_names;
  let result_hands, result_face;
  if (options.use_holistic_landmarker) {
// https://github.com/google/mediapipe/blob/master/mediapipe/tasks/web/vision/holistic_landmarker/holistic_landmarker_result.ts
    pose_names = ['poseLandmarks', 'poseWorldLandmarks'];
    result_face = { multiFaceLandmarks:result.faceLandmarks };

    const multiHandLandmarks = [];
    const multiHandedness = [];
    [result.leftHandLandmarks, result.rightHandLandmarks].forEach((hand,i)=>{
      if (hand.length) {
        multiHandLandmarks.push(hand[0]);
// swapped label since v0.10.5
        const label = (i==1)?'Left':'Right';
        multiHandedness.push({ index:i, score:1, categoryName:label, displayName:label });
      }
    });
    result_hands = { multiHandLandmarks:multiHandLandmarks, multiHandedness:multiHandedness };
  }
  else {
    pose_names = ['landmarks', 'worldLandmarks'];
  }

  for (const p of pose_names) {
    const c = result[p]?.[0];
    if (!c) continue;

    for (let i = 0; i < 33; i++) {
      const v = c[i];

//      const v3 = data_filter[0][p][i].filter([v.x, v.y, v.z], nowInMs);
//      v.x = v3[0];
//      v.y = v3[1];

      const v3 = data_filter[0][p][i].filter([0, 0, v.z], nowInMs);
      v.z = v3[2];
   }
  }

//console.log(Object.assign(result, { poseLandmarks:result[pose_names[0]][0], za:result[pose_names[1]][0] }, result_face, result_hands))
  return Promise.resolve(Object.assign(result, { poseLandmarks:result[pose_names[0]][0], za:result[pose_names[1]][0] }, result_face, result_hands));
}
    };

    if (options.use_holistic_landmarker) {
      console.log('(Mediapipe Holistic Landmarker initialized)');
    }
    else {
      console.log('(Mediapipe Pose Landmarker initialized)');
      postMessageAT('(Mediapipe Pose Landmarker initialized)');
    }
  }
  else if (use_movenet) {
    await load_scripts((use_mediapipe && use_blazepose)?'@mediapipe/pose-detection.js':'https://cdn.jsdelivr.net/npm/@tensorflow-models/pose-detection');

    if (use_blazepose) {
      const detectorConfig = (use_mediapipe) ?
{
  runtime: 'mediapipe',
//  modelType: 'heavy'
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

  if (options.use_holistic_landmarker) {
    holistic_initialized = true;
  }
  else {
    posenet_initialized = true;
  }
}
else {
  if (!options.use_holistic_landmarker && use_mediapipe_pose_landmarker && (options.model_quality != null) && (pose_model_quality != options.model_quality)) {
    pose_model_quality = options.model_quality;
    pose_landmarker.setOptions({
      baseOptions: {
        modelAssetPath: path_adjusted('@mediapipe/tasks/pose_landmarker_' + ((pose_model_quality == 'Best') ? 'heavy' : 'full') + '.task'),
        delegate: "GPU"
      },
    });
    console.log('Pose model quality:' + (pose_model_quality||'Normal'));
  }
}

}

use_hands_worker = options.use_hands_worker;// = true;
if (use_hands_worker) {
  if (!hands_worker)
    handpose_initialized = false;
}
else {
  hands_worker_data = null;
  if (!handpose_model)
    handpose_initialized = false;
}

if (!options.use_holistic && !use_human_hands && options.use_handpose && !handpose_initialized) {
  if (use_hands_worker) {
    await new Promise((resolve)=>{
      hands_worker = new Worker('hands_worker.js');
      hands_worker.onmessage = function (e) {
var data = ((typeof e.data == "string") && (e.data.charAt(0) === "{")) ? JSON.parse(e.data) : e.data;

if (typeof data === "string") {
  if (data == 'OK') {
    hands_worker_ready = true;
    resolve();
  }
  else {
    postMessageAT(data);
  }
}
else {
  hands_worker_ready = true;
  hands_worker_data = data;
}
      };
    });
  }
  else if (use_mediapipe_hand_landmarker) {
    handpose_model = await mediapipe_hand_landmarker.load();
  }
  else {
    await load_scripts('@mediapipe/hands/hands.js');//'https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js');//

    await (async ()=>{
      var hands = new Hands({locateFile: (file) => {
return this.AT.path_adjusted('@mediapipe/hands/' + file);
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

  handpose_initialized = true
}
  }

  async function HandsAT_load_lib(options) {
if (!handpose_initialized) {
  handpose_model = await mediapipe_hand_landmarker.load();

  console.log('(Mediapipe hands initialized)')
  postMessageAT('(Mediapipe hands initialized)')
}

handpose_initialized = true
  }

async function load_vision_common() {
  await load_scripts('@mediapipe/tasks/tasks-vision/XRA_module_loader.js');

  await new Promise((resolve)=>{
const timerID = setInterval(()=>{
  if ('FilesetResolver' in self) {
    clearInterval(timerID);
    resolve();
  }
}, 100);
  });

  const vision = await FilesetResolver.forVisionTasks(
// path/to/wasm/root
//"https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
path_adjusted('@mediapipe/tasks/tasks-vision/wasm')
  );

  return vision;
}

const mediapipe_hand_landmarker = (()=>{
  return {

    load: async function () {
  const vision = await load_vision_common();

  const f = [];
  const score_list = [0.5, 0.1];//0.3, 0.1];
  for (let i = 0; i < score_list.length; i++) {
    const score = score_list[i];
    f[i] = await HandLandmarker.createFromOptions(
vision,
{
  baseOptions: {
    modelAssetPath: path_adjusted('@mediapipe/tasks/hand_landmarker.task'),
    delegate: "GPU"
  },
  runningMode: 'VIDEO',

  numHands: 2,
  minHandDetectionConfidence: score,
  minHandPresenceConfidence: 0.5,//score,
  minTrackingConfidence: score,
}
    );
  }

  let f_index = 0;

  this.setup();

  console.log('(Mediapipe Hand Landmarker initialized)');
  postMessageAT('(Mediapipe Hand Landmarker initialized)');

  return {
set_score: (()=>{
  let timestamp = 0;
  return function (w,h, options) {
//f_index=1;return;
//    let s = Math.min(Math.max(Math.max(w,h)/shoulder_width-5, 0)/5, 2);
    let s = Math.min(Math.max(Math.max(w,h)/shoulder_width-7.5, 0), 1);
    let index = (options.minHandDetectionConfidence != null) ? ((options.minHandDetectionConfidence < 0.5) ? 1 : 0) : Math.ceil(s);
//console.log(s, index);
    if (index != f_index) {
      const t = Date.now();
      if (t > timestamp + 1000) {
        f_index = index;
        timestamp = t;
//console.log(f_index, timestamp);
      }
    }
  };
})(),

estimateHands: (()=>{
  let initialized;
  return function (video, nowInMs) {
    let result;
    if (!initialized) {
      initialized = true;
      f.forEach(d=>{
        result = d.detectForVideo(video, nowInMs);
      });
    }
    else {
      result = f[f_index].detectForVideo(video, nowInMs);
    }
//console.log(result)

// left and right hand labels swapped/handednesses=>handedness in v0.10.5
    result.handedness?.forEach(hand=>{hand.forEach(h=>{
const label = (h.categoryName == 'Left') ? 'Right' : 'Left';
h.categoryName = h.displayName = label;
    })});

//    result.worldLandmarks?.forEach((hand,i)=>{ result.worldLandmarks[i] = hand.map(f=>[f.x,f.y,f.z]); });

    return Promise.resolve(Object.assign({ multiHandLandmarks:result.landmarks, multiHandedness:result.handedness?.map(h=>h[0]) }, result));

//    return Promise.resolve(Object.assign({ multiHandLandmarks:result.landmarks, multiHandedness:result.handednesses?.map(h=>h[0]) }, result));
  };
})(),
  };
    },

    setup: function () {
data_filter[1] = {
  Left: {
    landmarks: [],
  },
  Right: {
    landmarks: [],
  },
};
for (const d of ['Left', 'Right']) {
  for (let i = 0; i < 21; i++) {
    data_filter[1][d].landmarks[i] = new OneEuroFilter(30, 1,1/1000,1, 3);
  }
}
    },

  };
})();

var use_human;
var use_mixed_human;
var use_tfjs, use_tfjs_posenet, use_mediapipe, use_blazepose, use_movenet, use_holistic, use_mediapipe_hands;

var use_mediapipe_hand_landmarker, use_mediapipe_pose_landmarker;
var pose_landmarker;
var pose_model_quality, pose_model_z_depth_scale;

var holistic_landmarker;

var hands_worker, hands_worker_data, hands_worker_pose;
var hands_worker_ready;
var use_hands_worker// = true;

var use_human_only, use_human_pose, use_human_hands;

var human;

var posenet;
var posenet_model, handpose_model;
var holistic_model;

var use_mobilenet;

var no_hand_countdown = 0, no_hand_countdown_max = 3;

var fps = 0, fps_count = 0, fps_ms = 0;


var skip_hand_countdown = 0

var eyes;
var eyes_xy_last = [[0,0],[0,0]];

var vt, vt_offset=0, vt_last=-1;

let _canvas_hands, _canvas_hands_worker;
let canvas_hands;// = new OffscreenCanvas(1,1);

let shoulder_width;

let data_filter = [];

const hand_clip = [];

async function process_video_buffer(rgba, w,h, options) {
  function pose_adjust(pose) {
    shoulder_width = Math.max(w,h)/7;

    if (!pose || !use_movenet) return pose

// latest human
    if (use_human_pose) {
      pose.keypoints.forEach((kp) => {
        if (kp.position.length)
          kp.position = {x:kp.position[0], y:kp.position[1]}
      });
      return pose;
    }

    let _keypoints3D;
    let assign_keypoints3D;
    if (options.use_holistic || use_mediapipe_pose_landmarker) {
      const _result = pose
//console.log(_result)
      _keypoints3D = _result.ea || _result.za;
      if (_keypoints3D?.length && _result.poseLandmarks?.length) {
// https://github.com/tensorflow/tfjs-models/blob/master/pose-detection/src/blazepose_mediapipe/detector.ts

        const iw = _result.image?.width  || w;
        const ih = _result.image?.height || h

        pose  = [{
  score: 1,
  keypoints: _result.poseLandmarks.map((landmark, i) => ({
x: landmark.x * iw,
y: landmark.y * ih,
z: landmark.z * iw,
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

    const armL_pos = pose[0].keypoints[get_pose_index(5)];
    const armR_pos = pose[0].keypoints[get_pose_index(6)];
    const arm_diff = [armL_pos.x-armR_pos.x, armL_pos.y-armR_pos.y, (armL_pos.z-armR_pos.z)/3];
    shoulder_width = Math.sqrt(arm_diff[0]*arm_diff[0] + arm_diff[1]*arm_diff[1] + arm_diff[2]*arm_diff[2]);

    if (data_filter[0]) {
      let filter_factor = Math.max(w,h)/shoulder_width;
      filter_factor = (filter_factor < 5) ? 1 : Math.min(filter_factor/5, 3);
//console.log(filter_factor)
      for (const p of ['landmarks', 'worldLandmarks']) {
        for (let i = 0; i < 33; i++) {
          const f = data_filter[0][p][i];
//          f.minCutOff = 1 * (1 + (filter_factor-1)/2);
//          f.minCutOff = filter_factor;
          f.beta = filter_factor;
          f.dCutOff = 2 * filter_factor;
        }
      }
    }

    if (pose[0].keypoints[0].score == null) {
      const score = pose[0].keypoints.map(landmark=>{
if (landmark.visibility != null) return landmark.visibility;

let score = 1;
for (const d of ['x','y']) {
  const dim = (d == 'x') ? w : h;
  const v = landmark[d]/dim;
  const limit = (shoulder_width/1)/dim;
  if (v < 0) {
    score *= Math.max(1 + v/limit, 0);
  }
  else if (v > 1) {
    score *= Math.max(1 - (v-1)/limit, 0);
  }
}

return score;
      });

      pose[0].keypoints.forEach((p,i)=>{p.score=score[i]});

      if (_keypoints3D) {
        if (pose_model_quality == 'Best') {
const z_scale = 1 / pose_model_z_depth_scale;

const hipL = pose[0].keypoints[23];
const hipR = pose[0].keypoints[24];
const hip = {
  x:(hipL.x+hipR.x)/2,
  y:(hipL.y+hipR.y)/2,
  z:(hipL.z+hipR.z)/2
};
const hip_dis = {
  x:(hipL.x-hipR.x),
  y:(hipL.y-hipR.y),
  z:(hipL.z-hipR.z)*z_scale
};
const hip3D_dis = {
  x:(_keypoints3D[23].x-_keypoints3D[24].x),
  y:(_keypoints3D[23].y-_keypoints3D[24].y),
  z:(_keypoints3D[23].z-_keypoints3D[24].z)
};
const scale = Math.sqrt(Math.sqrt(hip3D_dis.x*hip3D_dis.x + hip3D_dis.y*hip3D_dis.y + hip3D_dis.z*hip3D_dis.z)) / Math.sqrt(hip_dis.x*hip_dis.x + hip_dis.y*hip_dis.y + hip_dis.z*hip_dis.z);

pose[0].keypoints3D = pose[0].keypoints.map((landmark, i)=>({
  x: (landmark.x - hip.x) * scale,
  y: (landmark.y - hip.y) * scale,
  z: (landmark.z - hip.z) * scale * z_scale,
  name: BLAZEPOSE_KEYPOINTS[i]
}));

//console.log((pose[0].keypoints3D[23].z-pose[0].keypoints3D[24].z)/(_keypoints3D[23].z-_keypoints3D[24].z), hipL.name,hipR.name);

pose[0].keypoints3D_raw = _keypoints3D.map((landmark, i) => ({
  x: landmark.x,
  y: landmark.y,
  z: landmark.z,
  name: BLAZEPOSE_KEYPOINTS[i]
}));
        }
        else {
          pose[0].keypoints3D = _keypoints3D.map((landmark, i) => ({
x: landmark.x,
y: landmark.y,
z: landmark.z,
name: BLAZEPOSE_KEYPOINTS[i]
          }));
        }
      }

      pose[0].keypoints3D?.forEach((p,i)=>{p.score=score[i]});
    }

    let keypoints_movenet = []
    pose[0].keypoints.forEach((kp) => {
      keypoints_movenet.push({
  position: {x:kp.x, y:kp.y, z:kp.z},
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
    if (pose[0].keypoints3D_raw)
      result.keypoints3D_raw = pose[0].keypoints3D_raw

//console.log(result)
    return result;
  }

  function hands_adjust(hands, nowInMs, pose) {
    function landmark_adjust(h, clip) {
const scale = clip[8];
const cw = canvas_hands.width;

return [
  (h.x*cw - clip[4])/scale + clip[0],
  (h.y*cw - clip[5])/scale + clip[1],
  h.z*cw/scale,
];
    }

    function process_handedness(i) {
if (discard_wrong_handedness) {
  hands.multiHandedness = hands.multiHandedness.filter((h,idx)=>idx != i);
  hands.multiHandLandmarks = hands.multiHandLandmarks.filter((h,idx)=>idx != i);
}
else {
  const h = hands.multiHandLandmarks[i];
  const label = hands.multiHandedness[i].categoryName;

  hands.multiHandedness[i].categoryName = hands.multiHandedness[i].label = (label == 'Left') ? 'Right' : 'Left';

  hands.multiHandLandmarks[i] = [
    h[0],
    h[17],h[18],h[19],h[20],
    h[13],h[14],h[15],h[16],
    h[9], h[10],h[11],h[12],
    h[5], h[6], h[7], h[8],
    h[1], h[2], h[3], h[4],
  ];

}
    }

    function palm_distance_squared(side) {
function get_wrist(i) {
  if (side && wrist) return true;

  let _side = hands.multiHandedness[i].categoryName;
  if (canvas_hands) {
    let clip_index = hand_clip.findIndex(c=>(_side=='Left') ? c[9]==1 : c[9]==-1);
    if (clip_index == -1) return false;

    clip = hand_clip[clip_index];
    wrist = [clip[10], clip[11]];
    return true;
  }
  else {
// assumed mirrored
    const kp = pose.keypoints[get_pose_index((_side=='Left')?10:9)];
    if (kp.score < score_threshold) return false;

    wrist = [kp.position.x, kp.position.y];
    return true;
  }
}

let clip, wrist;
let dis;
dis = hands.multiHandLandmarks.map((hand,i)=>{
  if (!get_wrist(i)) return 9999*9999;

  const palm = (canvas_hands) ? landmark_adjust(hand[0], clip) : [hand[0].x*w, hand[0].y*h];
  const x = wrist[0] - palm[0];
  const y = wrist[1] - palm[1];
//console.log(i, wrist.slice(), palm.slice())
  return x*x + y*y;
});

return dis;
    }

    function index_to_flip_by_distance(flip_side) {
let side = hands.multiHandedness[0].categoryName;
if (flip_side)
  side = (side == 'Left') ? 'Right' : 'Left';

const dis = palm_distance_squared(side);
//console.log((((dis[0] > dis[1]) ? hands.multiHandedness[0].score > hands.multiHandedness[1].score : hands.multiHandedness[0].score < hands.multiHandedness[1].score)?'higher':'lower')+' score discarded');

return (dis[0] > dis[1]) ? 0 : 1;
    }

    function clipped(i, flip_side) {
const h = hands.multiHandLandmarks[i];
const label = hands.multiHandedness[i].categoryName;

const side = (flip_side) ? 'Right' : 'Left';
let clip_index = hand_clip.findIndex(c=>(label==side) ? c[9]==1 : c[9]==-1);
if (clip_index == -1) return false;

let clip = hand_clip[clip_index];
const h_list = [landmark_adjust(h[0], clip), landmark_adjust(h[9], clip)];

return h_list.some(_h=>(_h[0] >= clip[0]) && (_h[1] >= clip[1]) && (_h[0] <= clip[0]+clip[2]) && (_h[1] <= clip[1]+clip[3]));
    }

    if (!hands || use_human_hands) return hands

    if (options.use_holistic_legacy) {
      const _result = hands
      hands = { image:_result.image, multiHandedness:[], multiHandLandmarks:[] }
      if (_result.leftHandLandmarks && _result.leftHandLandmarks.length) {
        hands.multiHandLandmarks.push(_result.leftHandLandmarks)
// LR flipped
        hands.multiHandedness.push({score:1, categoryName:'Right'})
      }
      if (_result.rightHandLandmarks && _result.rightHandLandmarks.length) {
        hands.multiHandLandmarks.push(_result.rightHandLandmarks)
        hands.multiHandedness.push({score:1, categoryName:'Left'})
      }
    }

    if (!hands.multiHandedness || !hands.multiHandedness.length)
      return [];

// legacy version of mediapipe hands may return more than 2 detections
//if (hands.multiHandedness.length > 2) console.log(hands.multiHandedness.length);
    hands.multiHandedness = hands.multiHandedness.slice(0,2);
    hands.multiHandLandmarks = hands.multiHandLandmarks.slice(0,2);
    

    var _hands = [];
    var iw = hands.image?.width  || w;
    var ih = hands.image?.height || h;

    const adjust_handedness = [];
    let discard_wrong_handedness = true;

    if (options.use_holistic) {}
    else if (canvas_hands) {
      if (hands.multiHandedness.length == 1) {
        if (!clipped(0)) {
          if (discard_wrong_handedness || clipped(0,true)) {
            adjust_handedness[0] = true;
//console.log('One side');
          }
        }
      }
      else {
        const idx_list = [0,1];
        if (hands.multiHandedness[0].categoryName != hands.multiHandedness[1].categoryName) {
          if (idx_list.every(i=>!clipped(i))) {
            if (discard_wrong_handedness || idx_list.some(i=>clipped(i,true))) {
              adjust_handedness[0] = adjust_handedness[1] = true;
//console.log('Both sides');
            }
          }
        }
        else {
          if (idx_list.every(i=>clipped(i))) {
            adjust_handedness[index_to_flip_by_distance()] = true;
//console.log('By dstance');
          }
          else if (idx_list.every(i=>clipped(i,true))) {
            if (discard_wrong_handedness) {
              adjust_handedness[0] = adjust_handedness[1] = true;
//console.log('Discarded');
            }
            else {
              adjust_handedness[index_to_flip_by_distance(true)] = true;
            }
//console.log('By dstance, flipped');
          }
          else {
            const idx_correct = idx_list.findIndex(i=>clipped(i));
            if (idx_correct != -1) {
              adjust_handedness[(idx_correct==0)?1:0] = true;
//console.log('Flip the wrong side');
            }
            else if (discard_wrong_handedness) {
              adjust_handedness[0] = adjust_handedness[1] = true;
//console.log('Discarded');
            }
          }
        }
      }
    }
    else {
      if ((hands.multiHandedness.length > 1) && (hands.multiHandedness[0].categoryName == hands.multiHandedness[1].categoryName)) {
        adjust_handedness[index_to_flip_by_distance()] = true;
//console.log('By dstance');
      }
    }

    for (let i = 0; i < 2; i++) {
      if (adjust_handedness[i]) {
        process_handedness(i);
      }
    }

    const _multiHandedness = [];
    const _multiHandLandmarks = [];
    const dis_to_palm = shoulder_width*shoulder_width*0.25;
    palm_distance_squared().forEach((dis,i)=>{
      if (dis < dis_to_palm) {
        _multiHandedness.push(hands.multiHandedness[i]);
        _multiHandLandmarks.push(hands.multiHandLandmarks[i]);
      }
    });
    hands.multiHandedness = _multiHandedness;
    hands.multiHandLandmarks = _multiHandLandmarks;

    for (let i = 0; i < hands.multiHandedness.length; i++) {
      const label = hands.multiHandedness[i].label || hands.multiHandedness[i].categoryName;
//options.video_flipped
      let clip;
      if (!options.use_holistic && canvas_hands) {
        clip = hand_clip.find(c=>(label=='Left') ? c[9]==1 : c[9]==-1);
        if (!clip) continue;
      }

      const h = hands.multiHandLandmarks[i].map(_h=>{
if (options.use_holistic || !canvas_hands) {
  return [
_h.x*iw,
_h.y*ih,
_h.z*iw,
  ];
}
else {
  return landmark_adjust(_h, clip);
}
      });

      const worldLandmarks = (hands.worldLandmarks?.[i][0].x == null) ? hands.worldLandmarks?.[i] : null;

      _hands.push({
score: hands.multiHandedness[i].score,
label: hands.multiHandedness[i].label || hands.multiHandedness[i].categoryName,
keypoints: h,

worldLandmarks: worldLandmarks && {
  keypoints: worldLandmarks,
  annotations: {
    "palm":   [worldLandmarks[0]],
    "thumb":  [worldLandmarks[1], worldLandmarks[2], worldLandmarks[3], worldLandmarks[4]],
    "index":  [worldLandmarks[5], worldLandmarks[6], worldLandmarks[7], worldLandmarks[8]],
    "middle": [worldLandmarks[9], worldLandmarks[10],worldLandmarks[11],worldLandmarks[12]],
    "ring":   [worldLandmarks[13],worldLandmarks[14],worldLandmarks[15],worldLandmarks[16]],
    "pinky":  [worldLandmarks[17],worldLandmarks[18],worldLandmarks[19],worldLandmarks[20]]
  }
},
      });
    }
//console.log(_hands)


    _hands.forEach(hand=>{
const h = hand.keypoints;

//[0,1,5,9,13,17]
let palm_width, palm_height;
palm_width  = [h[1][0]-h[17][0], h[1][1]-h[17][1], h[1][2]-h[17][2]];
palm_height = [h[0][0]-h[9][0],  h[0][1]-h[9][1],  h[0][2]-h[9][2]];

const w_palm = Math.sqrt(palm_width[0]*palm_width[0] + palm_width[1]*palm_width[1] + palm_width[2]*palm_width[2]);
const h_palm = Math.sqrt(palm_height[0]*palm_height[0] + palm_height[1]*palm_height[1] + palm_height[2]*palm_height[2]);

let _adjust_ratio = h_palm / w_palm;

_adjust_ratio = (_adjust_ratio < 1.25) ? 1.25 : ((_adjust_ratio > 1.75) ? 1.75 : 1);
if (_adjust_ratio != 1) {
  const adjust_max = Math.max(Math.abs(palm_height[2]/h_palm), Math.abs(palm_width[2]/w_palm));

  const s = _adjust_ratio * _adjust_ratio;
  palm_width  = [h[1][0]-h[17][0], h[1][1]-h[17][1], h[1][2]-h[17][2]];
  palm_height = [h[0][0]-h[9][0],  h[0][1]-h[9][1],  h[0][2]-h[9][2]];
/*
1.5 * (x1*x1 + y1*y1 + (z1*s)*(z1*s)) = x2*x2 + y2*y2 + (z2*s)*(z2*s)
(z1*s)*(z1*s) - (z2*s)*(z2*s)/1.5 = (x2*x2 + y2*y2)/1.5 - (x1*x1 + y1*y1)
s*s = ((x2*x2 + y2*y2)/1.5 - (x1*x1 + y1*y1))/(z1*z1 - z2*z2/1.5)
*/
  _adjust_ratio = Math.min(Math.sqrt(Math.abs(((palm_height[0]*palm_height[0] + palm_height[1]*palm_height[1])/s - (palm_width[0]*palm_width[0] + palm_width[1]*palm_width[1])) / (palm_width[2]*palm_width[2] - palm_height[2]*palm_height[2]/s))), 1.5 + 1.5*adjust_max);
//console.log(_adjust_ratio)
  h.forEach(j=>{j[2] *= _adjust_ratio});
}
//hand.z_adjust_ratio = _adjust_ratio;


const palm0 = h[0];
for (let f_idx = 0; f_idx < 5; f_idx++) {
  const finger = [];
  for (let idx = 0; idx < 4; idx++)
    finger[idx] = h[f_idx*4+1+idx];

  let dx = finger[0][0] - palm0[0];
  let dy = finger[0][1] - palm0[1];
  let dz = finger[0][1] - palm0[1];
  const ref_length = Math.sqrt(dx*dx + dy*dy + dz*dz) * ((f_idx == 0) ? 2 : 0.75) * 0.5;

  for (let i = 0; i < 3; i++) {
    const f1 = [];
    for (let idx = 0; idx < 3; idx++)
      f1[idx] = finger[i+1][idx] - finger[i][idx];
    const min_length = ref_length * ((i < 2) ? 0.4 : 0.2);// * ((f_idx == 4) ? 0.75 : 1);
    if (f1[0]*f1[0] + f1[1]*f1[1] + f1[2]*f1[2] < min_length*min_length) {
      const z_mod = Math.sign(f1[2]) * Math.sqrt(min_length*min_length - (f1[0]*f1[0] + f1[1]*f1[1]));
//console.log(hand.label+f_idx+':'+z_mod);
      for (let j = i+1; j < 4; j++)
        finger[j][2] += z_mod;
    }
  }
}


if (data_filter[1]) {
  const d = hand.label;
  const palm0 = h[0].slice();
  h.forEach((j,idx)=>{
    j.forEach((v,i)=>{j[i] -= palm0[i]});
    const j_new = data_filter[1][d].landmarks[idx].filter(j, nowInMs);
    j.forEach((v,i)=>{j[i] = j_new[i] + palm0[i]});
  });
}

// ["thumb", "index", "middle", "ring", "pinky"]
hand.annotations = {
  "palm":   [h[0]],
  "thumb":  [h[1], h[2], h[3], h[4]],
  "index":  [h[5], h[6], h[7], h[8]],
  "middle": [h[9], h[10],h[11],h[12]],
  "ring":   [h[13],h[14],h[15],h[16]],
  "pinky":  [h[17],h[18],h[19],h[20]]
};
    });

    return _hands;
  }

  function is_hand_visible(pose) {
    if (!pose || (pose.score < 0.1)) return false;

    const limit = shoulder_width/Math.max(w,h)/1.7;

    return [9,10].some((id)=>{
      var kp = pose.keypoints[get_pose_index(id)];
      return (kp.score > score_threshold) && (kp.position.x > -w*limit) && (kp.position.x < w*(1+limit)) && (kp.position.y > -h*limit) && (kp.position.y < h*(1+limit));
    });
  }

  hand_clip.length = 0;
  function get_hand_canvas(pose) {
//return rgba;
if (!canvas_hands) return rgba;

const ctx = canvas_hands.getContext('2d');
ctx.save();

//ctx.beginPath();

hand_clip.length = 0;
let clip = [];
const radius = shoulder_width * (1 + Math.max(shoulder_width/Math.max(w,h)*5-0.5, 0.1)) /2;
for (const id of [9,10]) {
  const kp = pose.keypoints[get_pose_index(id)];
  if (kp.score < score_threshold) continue;

  let cw = radius * 2;
  let ch = radius * 2;
  let x = kp.position.x - radius;
  if (x < 0) {
    cw += x;
    x = 0;
  }
  let y = kp.position.y - radius;
  if (y < 0) {
    ch += y;
    y = 0;
  }
  if (x + cw > w)
    cw -= (x + cw) - w;
  if (y + ch > h)
    ch -= (y + ch) - h;

  if ((cw <= 0) || (ch <= 0)) continue;

//console.log(id+':',x,y, cw,ch)
// assumed mirrored
  clip.push([x,y, cw,ch, (id==9)?-1:1, kp.position.x,kp.position.y]);
}

if (clip.length) {
  ctx.fillStyle = 'black';
  ctx.fillRect(0,0, canvas_hands.width,canvas_hands.height);

  let x = Math.min(...clip.map(v=>v[0]));
  let y = Math.min(...clip.map(v=>v[1]));
  let cw = Math.max(...clip.map(v=>v[0]+v[2])) - x;
  let ch = Math.max(...clip.map(v=>v[1]+v[3])) - y;

  const c_radius = canvas_hands.width/2;
  let scale;
  if ((cw < radius*4) && (ch < radius*4)) {
    scale = canvas_hands.width / Math.max(cw,ch);
    let x_offset, y_offset;
    if (cw > ch) {
      x_offset = 0;
      y_offset = (canvas_hands.width-ch*scale)/2;
    }
    else {
      x_offset = (canvas_hands.width-cw*scale)/2;
      y_offset = 0;
    }
    clip.forEach(c=>{
      const x2 = x_offset + (c[0]-x)*scale;
      const y2 = y_offset + (c[1]-y)*scale;
      hand_clip.push([c[0],c[1],c[2],c[3], x2,y2,cw*scale,ch*scale, scale, c[4], c[5],c[6]]);
    });
    ctx.drawImage(rgba, x,y,cw,ch, x_offset,y_offset,cw*scale,ch*scale);
  }
  else {
    scale = c_radius / (radius*2);
    clip.forEach((c,i)=>{
      const y2 = Math.max(Math.min( (((c[1] - y + c[3]/2) / ch) - 0.5) * 4, 1), -1) * c_radius/4 + c_radius/2;
//((options.video_flipped)?1:-1)
      const x2 = (c[4] == 1) ? 0 : c_radius;
      hand_clip[i] = [c[0],c[1],c[2],c[3], x2,y2,c[2]/(radius*2)*c_radius,c[3]/(radius*2)*c_radius];
      ctx.drawImage(rgba, ...hand_clip[i]);
      hand_clip[i].push(scale, c[4], c[5],c[6]);
    });
  }
}

ctx.restore();

return (clip.length) ? canvas_hands : rgba;
  }


let use_mediapipe_facemesh = true;
let use_faceLandmarksDetection = true;

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
    yx = (sm[473]) ? ((LR == ((use_mediapipe_facemesh)?"R":"L")) ? [sm[473][1], sm[473][0]] : [sm[468][1], sm[468][0]]) : [];
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


let score_threshold;

try {
  await this.load_lib(options);
}
catch (err) {
  console.error(err);
  postMessageAT('Facemesh/PoseNet/Handpose ERROR:' + err);
  return;
}

async function PoseAT_process_video_buffer() {
  let _t = performance.now();

  if (options.timestamp != null) {
    vt = options.timestamp + vt_offset;
    if (vt <= vt_last + 1) {
      vt_offset = (vt_last - options.timestamp) + 16.6667;
      vt = options.timestamp + vt_offset;;
    }
    vt_last = vt;
  }
  else {
    vt = _t;
  }
//console.log(vt)

  if (rgba instanceof ArrayBuffer)
    rgba = new ImageData(new Uint8ClampedArray(rgba), w,h)
//rgba = tf.browser.fromPixels(rgba)

  let pose, hands, facemesh;
  score_threshold = (use_movenet) ? 0.3 : 0.5;

//  use_mediapipe_facemesh = true
//  use_faceLandmarksDetection = true

  pose_model_z_depth_scale = options.z_depth_scale || 3;

  if (options.use_holistic_legacy) {
    const result = await holistic_model.predict(rgba, {}, vt);
//console.log(result)

    pose = pose_adjust(result);
    hands = hands_adjust(result, vt, pose);

    if (result.faceLandmarks && result.faceLandmarks.length) {
      let faces = process_facemesh({multiFaceLandmarks:[result.faceLandmarks]}, w,h, {x:0, y:0, w:w, h:h, ratio:0, scale:1});

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
  else {//if (no_hand_countdown <= 0) {
    const result = await ((use_human_pose) ? human.detect(rgba) : ((use_movenet) ? posenet.estimatePoses(rgba, {}, vt) : posenet_model.estimateSinglePose(rgba, {})));
    pose = pose_adjust((use_human_pose) ? result.body[0] : result);

    if (options.use_holistic_landmarker) {
      hands = hands_adjust(result, vt, pose);

      if (result.faceLandmarks && result.faceLandmarks.length) {
        let faces = process_facemesh({multiFaceLandmarks:result.faceLandmarks}, w,h, {x:0, y:0, w:w, h:h, ratio:0, scale:1});

        let face = faces[0]
        let sm = face.scaledMesh;
// NOTE: pass the full scaledMesh as it is needed to be passed and drawn on the facemesh worker
        facemesh = { faces:[{ faceInViewConfidence:face.faceScore||face.faceInViewConfidence||0, scaledMesh:sm, mesh:face.mesh, eyes:eyes, bb_center:face.bb_center, emotion:face.emotion, rotation:face.rotation, faceBlendshapes:result.faceBlendshapes?.[0] }] };
//console.log(facemesh)
      }
    }
    else if (options.use_handpose && (use_hands_worker || ((handpose_model || use_human_hands) && (use_hands_worker || (skip_hand_countdown-- <= 0))))) {
      skip_hand_countdown = options.skip_hand_countdown_max||0;
      if (is_hand_visible(pose)) {
        if (use_hands_worker) {
          if (!hands_worker_ready) await new Promise((resolve)=>{ setTimeout(resolve, 0); });

          if (hands_worker_ready) {
hands_worker_pose = pose;

options.pose = pose;
options.shoulder_width = shoulder_width;

if (!(rgba instanceof ImageBitmap)) rgba = rgba.data.buffer;

let data_to_transfer = [rgba];
let data = { w:w, h:h, options:options, rgba:rgba };
if (_canvas_hands_worker) {
  data.canvas_hands = _canvas_hands_worker;
  data_to_transfer.push(_canvas_hands_worker);
}

hands_worker.postMessage(data, data_to_transfer);

_canvas_hands_worker = null;

data_to_transfer.length = 0;
data_to_transfer = undefined;
data.rgba = rgba = undefined;

hands_worker_ready = false;
          }
        }
        else if (handpose_model) {
          handpose_model.set_score?.(w,h, options);
          hands = await handpose_model.estimateHands(get_hand_canvas(pose), vt);
          hands = hands_adjust(hands, vt, pose);
        }
        else {
          const result = await human.detect(rgba)
          hands = result.hand
        }
        no_hand_countdown = no_hand_countdown_max
      }
      else {
        no_hand_countdown--;
// discard outdated data when hands are hidden
        hands_worker_data = null;
      }
    }
  }
/*
  else {
    let p_list = [(use_human_pose) ? human.detect(rgba).then(result=>result.body[0]) : ((use_movenet) ? posenet.estimatePoses(rgba, {}, vt) : posenet_model.estimateSinglePose(rgba, {})).then(_pose=>_pose)]
    if (options.use_handpose && (handpose_model || use_human_hands) && (skip_hand_countdown-- <= 0)) {
      skip_hand_countdown = options.skip_hand_countdown_max||0
      p_list.push((handpose_model) ? handpose_model.estimateHands(get_hand_canvas(), vt).then(_hands=>_hands) : human.detect(rgba).then(result=>result.hand));
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
*/

  _t = performance.now() - _t +(options._t||0);

  fps_ms += _t
  if (++fps_count >= 20) {
    fps = 1000 / (fps_ms/fps_count)
    fps_count = fps_ms = 0
  }

  let _t_hands, fps_hands;

  if (hands_worker_data) {
//console.log(hands_worker_data)
    _t_hands = hands_worker_data._t;
    fps_hands = hands_worker_data.fps;

    hands = hands_worker_data.handpose;
    for (const id of [9,10]) {
      const hand = hands.find(h=>h.label==((id==9)?'Left':'Right'));
      if (!hand) continue;

      const kp = pose.keypoints[get_pose_index(id)];
      if (kp.score < score_threshold) continue;

      const kp_hands = hands_worker_pose.keypoints[get_pose_index(id)];
      if (kp_hands.score < score_threshold) continue;

      const x_offset = kp.position.x - kp_hands.position.x;
      const y_offset = kp.position.y - kp_hands.position.y;
      hand.keypoints.forEach(k=>{
        k[0] += x_offset;
        k[1] += y_offset;
      });
    }

    hands_worker_data = null;
  }
  else if (hands) {
    _t_hands = _t;
    fps_hands = fps;
    hands = hands.filter((h)=>h.annotations&&Object.keys(h.annotations).length);
  }
 
  if (facemesh) {
    facemesh._t = _t
    facemesh.fps = fps
  }

  postMessageAT(JSON.stringify({ posenet:pose, handpose:hands, facemesh:facemesh, _t:_t, fps:fps, _t_hands:_t_hands, fps_hands:fps_hands }));
}

async function HandsAT_process_video_buffer() {
  let _t = performance.now();

  if (options.timestamp != null) {
    vt = options.timestamp + vt_offset;
    if (vt <= vt_last + 1) {
      vt_offset = (vt_last - options.timestamp) + 16.6667;
      vt = options.timestamp + vt_offset;;
    }
    vt_last = vt;
  }
  else {
    vt = _t;
  }
//console.log(vt)

  if (rgba instanceof ArrayBuffer)
    rgba = await createImageBitmap(new ImageData(new Uint8ClampedArray(rgba), w,h));
//rgba = tf.browser.fromPixels(rgba)

  let pose, hands;
  let score_threshold = 0.5;

  pose = options.pose;
  shoulder_width = options.shoulder_width;

  handpose_model.set_score?.(w,h, options);
  hands = await handpose_model.estimateHands(get_hand_canvas(pose), vt);
  hands = hands_adjust(hands, vt, pose);

  _t = performance.now() - _t +(options._t||0);

  fps_ms += _t
  if (++fps_count >= 20) {
    fps = 1000 / (fps_ms/fps_count)
    fps_count = fps_ms = 0
  }

  if (hands) {
    hands = hands.filter((h)=>h.annotations&&Object.keys(h.annotations).length);
  }

  postMessageAT(JSON.stringify({ handpose:hands, _t:_t, fps:fps }));
}

  if (this.AT.type == 'PoseAT') {
    await PoseAT_process_video_buffer();
  }
  else if (this.AT.type == 'HandsAT') {
    await HandsAT_process_video_buffer();
  }

  if (rgba instanceof ImageBitmap) rgba.close();
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

const blazepose_translated = [
0, 2,5, 7,8, 11,12,13,14,15,16, 23,24,25,26,27,28
];

function get_pose_index(id) {
  return blazepose_translated[id];
}



// core START
this.AT = AT;

AT.path_adjusted = path_adjusted;

postMessageAT = (is_worker) ? postMessage : function (msg, transfer) {
  AT._worker.onmessage({data:msg});
};

if (AT.type == 'PoseAT') {
  this.init = PoseAT_init;
  this.load_lib = PoseAT_load_lib;
}
else if (AT.type == 'HandsAT') {
  this.init = HandsAT_init;
  this.load_lib = HandsAT_load_lib;
}

// core END

}

export { Core };
