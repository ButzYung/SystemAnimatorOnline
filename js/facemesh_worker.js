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

//init()

var canvas, context, RAF_timerID;

async function init() {
// https://github.com/tensorflow/tfjs-models/tree/master/facemesh
  model = await facemesh.load({maxFaces:1});
  console.log('(Facemesh initialized)')

// https://dev.to/trezy/loading-images-with-web-workers-49ap
  const response = await fetch("../images/laughing_man_134x120.png");
  const blob = await response.blob();
  face_cover = await createImageBitmap(blob);
  console.log("face cover OK")

  postMessage('(Facemesh initialized)')
}

async function process_video_buffer(rgba, w,h, draw_canvas) {
  if (!face_cover)
    return
let _t=performance.now()
  rgba = new Uint8ClampedArray(rgba);

  const faces = await model.estimateFaces(new ImageData(rgba, w,h));
_t=performance.now()-_t
  postMessage(JSON.stringify({ faces:faces, _t:_t }));
}

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
