// (2021-08-06)

var param = new URLSearchParams(self.location.search.substring(1));

var use_human
var use_mixed_human
var use_tfjs, use_tfjs_posenet, use_blazepose, use_blazepose_upper, use_movenet

if (use_human || param.get('use_human')) {
  use_human = true
  use_tfjs = false
  use_tfjs_posenet = false
  use_blazepose = param.get('use_blazepose')
  use_blazepose_upper = param.get('use_blazepose_upper')
}
else if (use_mixed_human || param.get('use_mixed_human')) {
  use_mixed_human = true

  use_human = true
  use_tfjs = true
  use_tfjs_posenet = true
}
else {
  use_human = false
  use_tfjs = true
  use_tfjs_posenet = true
}

if (use_movenet || param.get('use_movenet')) {
  use_movenet = true
}

var human;

if (use_tfjs) {
// https://blog.tensorflow.org/2020/03/face-and-hand-tracking-in-browser-with-mediapipe-and-tensorflowjs.html
  let tfjs_version = '@3.8.0';//'@3.5.0';//'@3.3.0';//@2.8.5';
  importScripts('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs' + tfjs_version);
}

if (use_human) {
  importScripts('./human/dist/human.js');
  human = new Human.default();
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

    body: (use_blazepose) ? {
      enabled: true,
modelPath: './human/models/blazepose'+((use_blazepose_upper)?'-upper':'') + '.json',modelType:'blazepose',
    } : {
      enabled: !use_tfjs_posenet,
      modelPath: './human/models/' + ((use_movenet) ? 'movenet-lightning' : 'posenet') + '.json',
//modelType: 'posenet-resnet', modelPath: 'https://storage.googleapis.com/tfjs-models/savedmodel/posenet/resnet50/quant2/model-stride16.json', outputStride: 16,
//      modelType: 'ResNet', modelPath: 'https://storage.googleapis.com/tfjs-models/savedmodel/posenet/resnet50/quant2/model-stride16.json', outputStride: 16,
maxDetections: 1,
//scoreThreshold: 0.1,
    },

    hand: {
      enabled: true,
      maxHands: 2,
      rotation: true,
      detector: {
        modelPath: './human/models/handdetect.json'
      },
      skeleton: {
        modelPath: './human/models/handskeleton.json'
      },
//iouThreshold:0.3, scoreThreshold:0.75,
//skipFrames:2

iouThreshold: 0.3,
scoreThreshold:0.5,
minConfidence: 0.25,
skipFrames:5,
    }
  });
//human.warmup().then(()=>{console.log('OK')});
}

var posenet_model, handpose_model;

var use_mobilenet = param.get('use_mobilenet');

var no_hand_countdown = 0, no_hand_countdown_max = 3;

var fps = 0, fps_count = 0, fps_ms = 0;

async function process_video_buffer(rgba, w,h, options) {
  function pose_adjust(pose) {
    if (!use_movenet) return

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

    return { score:pose[0].score, keypoints:keypoints_movenet };
  }

  let _t = performance.now()

  rgba = new ImageData(new Uint8ClampedArray(rgba), w,h);
//rgba = tf.browser.fromPixels(rgba)

  let pose, hands;
  let score_threshold = (use_movenet) ? 0.3 : 0.5;

  if (use_human && !use_tfjs) {
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
    pose = await ((use_movenet) ? posenet.estimatePoses(rgba, {}, _t) : posenet_model.estimateSinglePose(rgba, {}));
    pose = pose_adjust(pose)

    if (options.use_handpose) {
      if ((pose.score > 0.1) && ((pose.keypoints[9].score > score_threshold) || (pose.keypoints[10].score > score_threshold))) {
        if (handpose_model) {
          hands = await handpose_model.estimateHands(rgba);
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
    let p_list = [((use_movenet) ? posenet.estimatePoses(rgba, {}, _t) : posenet_model.estimateSinglePose(rgba, {})).then(_pose=>_pose)]
    if (options.use_handpose) {
      p_list.push((handpose_model) ? handpose_model.estimateHands(rgba).then(_hands=>_hands) : human.detect(rgba).then(result=>result.hand));
    }

    const values = await Promise.all(p_list);

    pose = values[0]
    pose = pose_adjust(pose)
    if (p_list.length > 1) {
      if ((pose.score > 0.1) && ((pose.keypoints[9].score > score_threshold) || (pose.keypoints[10].score > score_threshold))) {
        hands = values[1]
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

  postMessage(JSON.stringify({ posenet:pose, handpose:hands, _t:_t, fps:fps }));

//rgba.dispose();
  rgba = undefined;
}

onmessage = function (e) {
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
};

(async function () {
  if (use_human && !use_tfjs) {
    postMessage('OK')
    return
  }

  try {
    if (use_tfjs_posenet) {
      if (use_movenet) {
        importScripts('https://cdn.jsdelivr.net/npm/@tensorflow-models/pose-detection');

        const detectorConfig = {modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER};//{modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING};//
        posenet = await poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, detectorConfig);
        console.log('(MoveNet initialized)')

        postMessage('(MoveNet initialized)')
      }
      else {
        importScripts('https://cdn.jsdelivr.net/npm/@tensorflow-models/posenet');

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

        postMessage('(PoseNet initialized)')
      }
    }

    if (!use_human) {
//      importScripts('https://cdn.jsdelivr.net/npm/@tensorflow-models/handpose@0.0.6/dist/handpose.js');
importScripts('handpose.js');

      handpose_model = await handpose.load()
      console.log('(Handpose initialized)')

      postMessage('(Handpose initialized)')
    }

    postMessage('OK')
  }
  catch (err) { postMessage('PoseNet/Handpose ERROR:' + err) }
})();
