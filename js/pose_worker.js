// (2020-12-05)

// https://blog.tensorflow.org/2020/03/face-and-hand-tracking-in-browser-with-mediapipe-and-tensorflowjs.html

var tfjs_version = '';//'@2.4.0';

importScripts('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs' + tfjs_version);

var posenet_model, handpose_model;

var use_mobilenet = new URLSearchParams(self.location.search.substring(1)).get('use_mobilenet');

async function process_video_buffer(rgba, w,h, options) {
  let _t = performance.now()

  rgba = new ImageData(new Uint8ClampedArray(rgba), w,h);

  let pose, hands;

  pose = await posenet_model.estimateSinglePose(rgba, {});

  if (options.use_handpose && (pose.score > 0.1) && ((pose.keypoints[9].score > 0.5) || (pose.keypoints[10].score > 0.5))) {
    hands = await handpose_model.estimateHands(rgba);
  }

  _t = performance.now() - _t;

  postMessage(JSON.stringify({ posenet:pose, handpose:hands, _t:_t }));
}

onmessage = function (e) {
  var t = performance.now()
  var data = (typeof e.data === "string") ? JSON.parse(e.data) : e.data;

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
  try {
    if (1) {
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

    if (1) {
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
