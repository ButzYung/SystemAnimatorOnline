// (2021-01-20)

var param = new URLSearchParams(self.location.search.substring(1));

var use_human
var use_mixed_human
var use_tfjs, use_tfjs_posenet

if (use_human || param.get('use_human')) {
  use_human = true
  use_tfjs = false
  use_tfjs_posenet = false
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

var human;

if (use_tfjs) {
// https://blog.tensorflow.org/2020/03/face-and-hand-tracking-in-browser-with-mediapipe-and-tensorflowjs.html
  let tfjs_version = '@2.8.2';
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

    body: {
      enabled: !use_tfjs_posenet,
      modelPath: './human/models/posenet.json',
      modelType: 'ResNet', modelPath: 'https://storage.googleapis.com/tfjs-models/savedmodel/posenet/resnet50/quant2/model-stride16.json', outputStride: 16,
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

async function process_video_buffer(rgba, w,h, options) {
  let _t = performance.now()

  rgba = new ImageData(new Uint8ClampedArray(rgba), w,h);
//rgba = tf.browser.fromPixels(rgba)

  let pose, hands;

  if (use_human && !use_tfjs) {
    const result = await human.detect(rgba, {hand:{enabled:options.use_handpose}})
//    console.log(result)

    pose = result.body[0]
    hands = result.hand
  }
  else if (no_hand_countdown <= 0) {
    pose = await posenet_model.estimateSinglePose(rgba, {});

    if (options.use_handpose) {
      if ((pose.score > 0.1) && ((pose.keypoints[9].score > 0.5) || (pose.keypoints[10].score > 0.5))) {
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
    let p_list = [posenet_model.estimateSinglePose(rgba, {}).then(_pose=>_pose)]
    if (options.use_handpose) {
      p_list.push((handpose_model) ? handpose_model.estimateHands(rgba).then(_hands=>_hands) : human.detect(rgba).then(result=>result.hand));
    }

    const values = await Promise.all(p_list);

    pose = values[0]
    if (p_list.length > 1) {
      if ((pose.score > 0.1) && ((pose.keypoints[9].score > 0.5) || (pose.keypoints[10].score > 0.5))) {
        hands = values[1]
        no_hand_countdown = no_hand_countdown_max
      }
      else {
        no_hand_countdown--
      }
    }
  }

  _t = performance.now() - _t;

  postMessage(JSON.stringify({ posenet:pose, handpose:hands, _t:_t+(options._t||0) }));

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
