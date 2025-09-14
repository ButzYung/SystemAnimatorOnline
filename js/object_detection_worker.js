// 2024-12-15

class Object_Detector {
  constructor(options) {
this.framework = options.framework || 'MediaPipe';

this.detector_class = {
  'ImageClassifier': {},
  'ObjectDetector': {}
};

if (this.framework == 'MediaPipe') {
  this.model_base_path = '@mediapipe/tasks/';

  for (const c in this.detector_class) {
    this.detector_class[c].base_options = {
      baseOptions: {},
      runningMode: 'VIDEO',
      scoreThreshold: 0.2,
    };
  }
}
else {
  for (const c in this.detector_class) {
    this.detector_class[c].base_options = {
//      model: 'onnx-community/yolov10s',//'Xenova/yolos-tiny',//'Xenova/detr-resnet-50',//'onnx-community/rtdetr_r50vd',//
    };
  }

  this.rgba_canvas = new OffscreenCanvas(1,1);
}
  }

  get_delegate(model) {
return (/INT8/.test(model)) ? 'CPU' : 'GPU';
  }

  get base_options() {
return this.detector_class[this._detector_label].base_options;
  }

  get model() {
return this.detector_class[this._detector_label].model;
  }

  set model(v) {
this.detector_class[this._detector_label].model = v;
  }

  get detector_object() {
return this.detector_class[this._detector_label].detector;
  }

  set detector_object(v) {
this.detector_class[this._detector_label].detector = v;
  }

  detector(v) {
this._detector_label = v;
return this;
  }

  async init(options) {
if (this.framework == 'MediaPipe') {
  if (this.detector_object) {
    const categoryAllowlist = options.categoryAllowlist;
    if ((this.base_options.categoryAllowlist.toString() != categoryAllowlist.toString()) || (this.model != options.model)) {
      this.base_options.categoryAllowlist = categoryAllowlist;
      this.model = options.model;
      this.base_options.baseOptions.modelAssetPath = this.model_base_path + options.model;
      this.base_options.baseOptions.delegate = this.get_delegate(this.model);

      await this.detector_object.setOptions(this.base_options);
console.log('model:' + options.model, 'object detection list:' + categoryAllowlist.toString());
    }
  }
  else {
    if (!this.vision) {
      importScripts('@mediapipe/tasks/tasks-vision/XRA_module_loader.js');

      await new Promise((resolve)=>{
const timerID = setInterval(()=>{
  if ('FilesetResolver' in self) {
    clearInterval(timerID);
    resolve();
  }
}, 100);
      });

      this.vision = await FilesetResolver.forVisionTasks(
        '@mediapipe/tasks/tasks-vision/wasm'
      );
    }

    this.base_options.baseOptions.modelAssetPath = this.model_base_path + options.model;
    this.base_options.baseOptions.delegate = this.get_delegate(this.model);
    this.base_options.categoryAllowlist = options.categoryAllowlist;

    this.detector_object = await self[this._detector_label].createFromOptions(this.vision, this.base_options);
  }
}
else {
  await webgpu_check();

  this.base_options.categoryAllowlist = options.categoryAllowlist;
  if (!this.detector_object || (this.model != options.model)) {
    if (this.detector_object) {
      await this.detector_object.dispose();
    }
    else {
      this.module = await import('./@huggingface/transformers/dist/transformers.js');// 'https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.0-alpha.22'); //
      this.module.env.allowLocalModels = false;
    }

    this.model = this.base_options.model = options.model;

// https://huggingface.co/onnx-community/yolov10s
// https://viso.ai/deep-learning/yolov10/
    if (/yolov10/.test(this.base_options.model)) {
this.detector_object = await this.module.AutoModel.from_pretrained(this.base_options.model, { dtype:undefined, device:webgpu });
this._processor = await this.module.AutoProcessor.from_pretrained(this.base_options.model);
    }
    else {
      this.detector_object = await this.module.pipeline('object-detection', this.base_options.model, { dtype:undefined, device:webgpu });
    }
  }
}
  }

  async detect(data) {
if (this.framework == 'MediaPipe') {
  if (this._detector_label == 'ObjectDetector') {
    return this.detector_object.detectForVideo(data.rgba, data.options.vt);
  }

  const detections = this.detector_object.classifyForVideo(data.rgba, data.options.vt);
//console.log(detections);
  return {
    detections:detections.classifications[0]?.categories?.map(d=>{
      return {
        boundingBox: {
          originX: 0,
          originY: 0,
          width:  data.w,
          height: data.h,
        },
        categories: [{
          score: d.score,
          categoryName: d.categoryName,
        }],
      };
    }) || [],
  };
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
const { output0 } = await this.detector_object({ images: pixel_values });
const predictions = output0.tolist()[0];

const [newHeight, newWidth] = reshaped_input_sizes[0]; // Reshaped height and width
const [xs, ys] = [image.width / newWidth, image.height / newHeight]; // x and y resize scales

output = [];
for (const [xmin, ymin, xmax, ymax, score, id] of predictions) {
  // Convert to original image coordinates
  const box = { xmin:xmin * xs, ymin:ymin * ys, xmax:xmax * xs, ymax:ymax * ys };
  output.push({ box:box, score:score, label:this.detector_object.config.id2label[id] });
}
//console.log(output)
  }
  else {
    output = await this.detector_object(this.module.RawImage.fromCanvas(this.rgba_canvas), { threshold:0.2 });//new this.module.RawImage(ctx.getImageData(0,0,w,h).data, w,h, 4)
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

let webgpu;
const webgpu_check = (()=>{
  let initialized;
  return async ()=>{
    if (!initialized) {
      webgpu = (await navigator.gpu?.requestAdapter()) ? 'webgpu' : undefined;
      console.log('WebGPU supported:' + !!webgpu);
      initialized = true;
    }
  };
})();

let object_detector = {
  'MediaPipe': null,
  'Transformers.js': null,
};

let is_classifier = /violin|flute/;

onmessage = async function (e) {
  let data = ((typeof e.data == "string") && (e.data.charAt(0) === "{")) ? JSON.parse(e.data) : e.data;

  if (typeof data === "string") {
  }
  else {
    const od_options = data.options.object_detection;

    const categoryAllowlist = {};
    categoryAllowlist.ImageClassifier = od_options.categoryAllowlist.filter(a =>  is_classifier.test(a));
    categoryAllowlist.ObjectDetector  = od_options.categoryAllowlist.filter(a => !is_classifier.test(a));

    let return_ready;
    const framework_by_class = {};
    for (const label of ['ObjectDetector','ImageClassifier']) {
      if (!categoryAllowlist[label].length) continue;

      const options = Object.assign({}, od_options);
      options.categoryAllowlist = categoryAllowlist[label];

      if (label == 'ImageClassifier') {
        options.framework = 'MediaPipe';
        options.model = (/efficient.+lite(\d)/.test(options.model)) ? 'efficientnet_lite' + RegExp.$1 + '_INT8.tflite' : 'efficientnet_lite2_INT8.tflite';
      }
      framework_by_class[label] = options.framework;

      let od = object_detector[options.framework];
      if (!od) {
        od = object_detector[options.framework] = new Object_Detector(options);
        return_ready = true;
      }
      else if (!od.detector(label).detector_object) {
        return_ready = true;
      }

      await od.detector(label).init(options);
    }

    if (return_ready) {
      postMessage('READY');
      return;
    }

    let t = performance.now();

    const detections = { detections:[] };
    for (const label of ['ObjectDetector','ImageClassifier']) {
      if (!categoryAllowlist[label].length) continue;

      const _detections = await object_detector[framework_by_class[label]].detector(label).detect(data);
      detections.detections.push(..._detections.detections);
    }
//console.log(detections, data)

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
