// 2024-10-31

class Object_Detector {
  constructor(options) {
this.framework = options.framework || 'MediaPipe';

if (this.framework == 'MediaPipe') {
  this.model_base_path = '@mediapipe/tasks/';
  this.model = 'efficientdet_lite2_FP32.tflite';

  this.base_options = {
    baseOptions: {
      modelAssetPath: this.model_base_path + this.model,
    },
    runningMode: 'VIDEO',
    scoreThreshold: 0.2,
//    categoryAllowlist: ['cell phone']
  };
}
else {
  this.base_options = {
    model: 'onnx-community/yolov10s',//'Xenova/yolos-tiny',//'Xenova/detr-resnet-50',//'onnx-community/rtdetr_r50vd',//
  };

  this.rgba_canvas = new OffscreenCanvas(1,1);
}
  }

  get_delegate(model) {
return (/INT8/.test(model)) ? 'CPU' : 'GPU';
  }

  async init(options) {
if (this.framework == 'MediaPipe') {
  if (this.objectDetector) {
    const categoryAllowlist = options.categoryAllowlist;
    if ((this.base_options.categoryAllowlist.toString() != categoryAllowlist.toString()) || (this.model != options.model)) {
      this.base_options.categoryAllowlist = categoryAllowlist;
      this.model = options.model;
      this.base_options.baseOptions.modelAssetPath = this.model_base_path + options.model;
      this.base_options.baseOptions.delegate = this.get_delegate(this.model);

      await this.objectDetector.setOptions(this.base_options);
console.log('(object detection list: ' + categoryAllowlist.toString() + ')')
    }
  }
  else {
    importScripts('@mediapipe/tasks/tasks-vision/XRA_module_loader.js');

    await new Promise((resolve)=>{
const timerID = setInterval(()=>{
  if ('FilesetResolver' in self) {
    clearInterval(timerID);
    resolve();
  }
}, 100);
    });

    const vision = await FilesetResolver.forVisionTasks(
      '@mediapipe/tasks/tasks-vision/wasm'
    );

    this.base_options.baseOptions.modelAssetPath = this.model_base_path + options.model;
    this.base_options.baseOptions.delegate = this.get_delegate(this.model);
    this.base_options.categoryAllowlist = options.categoryAllowlist;

    this.objectDetector = await ObjectDetector.createFromOptions(vision, this.base_options);
  }
}
else {
  this.base_options.categoryAllowlist = options.categoryAllowlist;
  if (!this.objectDetector || (this.model != options.model)) {
    if (this.objectDetector) {
      await this.objectDetector.dispose();
    }
    else {
      this.module = await import('./@huggingface/transformers/dist/transformers.js');// 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.0-alpha.22'); //
      this.module.env.allowLocalModels = false;
    }

    this.model = this.base_options.model = options.model;

// https://huggingface.co/onnx-community/yolov10s
// https://viso.ai/deep-learning/yolov10/
    if (/yolov10/.test(this.base_options.model)) {
this.objectDetector = await this.module.AutoModel.from_pretrained(this.base_options.model, { dtype:undefined, device:'webgpu' });//'uint8' });//
this._processor = await this.module.AutoProcessor.from_pretrained(this.base_options.model);
    }
    else {
      this.objectDetector = await this.module.pipeline('object-detection', this.base_options.model, { dtype:undefined, device:'webgpu' });
    }
  }
}
  }

  async detect(data) {
if (this.framework == 'MediaPipe') {
  return this.objectDetector.detectForVideo(data.rgba, data.options.vt);
}
else {
  const w = data.w;
  const h = data.h;

  this.rgba_canvas.width  = w;
  this.rgba_canvas.height = h;
  const ctx = this.rgba_canvas.getContext('2d');
  ctx.drawImage(data.rgba, 0,0);

  let output;
// https://huggingface.co/onnx-community/yolov10s
  if (/yolov10/.test(this.base_options.model)) {
const image = await this.module.RawImage.fromCanvas(this.rgba_canvas);
const { pixel_values, reshaped_input_sizes } = await this._processor(image);
// Run object detection
const { output0 } = await this.objectDetector({ images: pixel_values });
const predictions = output0.tolist()[0];

const [newHeight, newWidth] = reshaped_input_sizes[0]; // Reshaped height and width
const [xs, ys] = [image.width / newWidth, image.height / newHeight]; // x and y resize scales

output = [];
for (const [xmin, ymin, xmax, ymax, score, id] of predictions) {
  // Convert to original image coordinates
  const box = { xmin:xmin * xs, ymin:ymin * ys, xmax:xmax * xs, ymax:ymax * ys };
  output.push({ box:box, score:score, label:this.objectDetector.config.id2label[id] });
}
//console.log(output)
  }
  else {
    output = await this.objectDetector(this.module.RawImage.fromCanvas(this.rgba_canvas), { threshold:0.2 });//new this.module.RawImage(ctx.getImageData(0,0,w,h).data, w,h, 4)
  }

  output = output.filter(d=>{
    return this.base_options.categoryAllowlist.indexOf(d.label) != -1;
  }).map(d=>{
    return {
      boundingBox: {
        originX: d.box.xmin,
        originY: d.box.ymin,
        width:  d.box.xmax-d.box.xmin,
        height: d.box.ymax-d.box.ymin,
      },
      categories: [{
        score: d.score,
        categoryName: d.label,
      }],
    };
  });

  return { detections: output };
}
  }
}

let object_detector = {
  'MediaPipe': null,
  'Transformers.js': null,
};

onmessage = async function (e) {
  let data = ((typeof e.data == "string") && (e.data.charAt(0) === "{")) ? JSON.parse(e.data) : e.data;

  if (typeof data === "string") {
  }
  else {
    const od_options = data.options.object_detection;

    const framework = od_options.framework;
    let od = object_detector[framework];
    if (!od) {
      od = object_detector[framework] = new Object_Detector(od_options);
      await od.init(od_options);
      postMessage('READY');
      return;
    }

    await od.init(od_options);

    let t = performance.now();
    const detections = await od.detect(data);
//console.log(detections, data, od.base_options)
    t = performance.now() - t;

    const hand_visible = data.options.hand_visible;
    const pose = data.options.pose;
//console.log(pose)
    detections.detections.forEach(obj=>{
      const bb = obj.boundingBox;

      const center = [bb.originX + bb.width/2, bb.originY + bb.height/2];
      const dis = { 'left':9999, 'right':9999 };
      hand_visible.forEach(side=>{
        const h = (side == 'left') ? 9 : 10;
        const kp = pose.keypoints[h+6].position;
//console.log(side,h+6,JSON.stringify(kp));
        const x = kp.x - center[0];
        const y = kp.y - center[1];
        dis[side] = Math.sqrt(x*x + y*y);
      });
// flipped (default)
      obj._hand = (dis.left < dis.right) ? 'right' : 'left';
//console.log(JSON.stringify(dis));

      bb.originX = data.w - (bb.originX + bb.width);
    });

    postMessage({ detections:detections.detections, t:t, detection_id:Date.now(), hand_visible:hand_visible.map(h=>(h=='left')?'right':'left') });

    setTimeout(()=>{ postMessage('READY'); }, od_options.detection_interval);
  }
};

postMessage('OK');
