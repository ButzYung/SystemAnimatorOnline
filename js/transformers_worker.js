// 2025-06-15

// https://huggingface.co/onnx-community/depth-anything-v2-small
// https://github.com/xenova/transformers.js
// https://huggingface.co/docs/transformers.js/en/tutorials/vanilla-js

// npm i @huggingface/transformers
import { pipeline, env, RawImage, AutoProcessor, AutoModelForDepthEstimation } from './@huggingface/transformers/dist/transformers.js';

env.allowLocalModels = false;

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
await webgpu_check();

const use_low_res_depth_map = !webgpu || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
console.log('Use low-res depth map:' + !!use_low_res_depth_map);

class Transformers_pipeline {
  constructor(task, model, para={ dtype:undefined, device:webgpu }, options={}) {
    this.task_default = task;
    this.model_default = model;
    this.para_default = para;
    this.options = options;

    this.model = null;
    this._pipeline = null;
  }

  async init(model=this.model_default, para) {
//model='onnx-community/depth-anything-v2-large';//'onnx-community/DepthPro-ONNX';
    if (this.model == model) return this.pipeline;
    this.model = model;

    if (this.options.loading_message)
      postMessage(this.options.loading_message);

// https://huggingface.co/docs/transformers.js/main/en/api/pipelines#module_pipelines.Pipeline+dispose
    if (this._pipeline) {
      console.log('(disposing old pipeline...)');
      await this._pipeline.dispose();
    }

    if (model == 'onnx-community/DepthPro-ONNX') {
      this._pipeline = await AutoModelForDepthEstimation.from_pretrained(model, { dtype: 'q4' });//{ dtype:'fp16', device:'webgpu' });//
      this._processor = await AutoProcessor.from_pretrained(model);
    }
    else {
      this._pipeline = await pipeline(this.task_default, model, para||this.para_default);
    }

    return this.pipeline;
  }

  async pipeline(img) {
    if (this.model == 'onnx-community/DepthPro-ONNX') {
// https://huggingface.co/onnx-community/DepthPro-ONNX

const inputs = await this._processor(img);

// Run depth estimation model
const { predicted_depth, focallength_px } = await this._pipeline(inputs);

// Normalize the depth map to [0, 1]
const depth_map_data = predicted_depth.data;
let minDepth = Infinity;
let maxDepth = -Infinity;
for (let i = 0; i < depth_map_data.length; ++i) {
  minDepth = Math.min(minDepth, depth_map_data[i]);
  maxDepth = Math.max(maxDepth, depth_map_data[i]);
}
const depth_tensor = predicted_depth
  .sub_(minDepth)
  .div_(-(maxDepth - minDepth)) // Flip for visualization purposes
  .add_(1)
  .clamp_(0, 1)
  .mul_(255)
  .round_()
  .to("uint8");

// Save the depth map
return RawImage.fromTensor(depth_tensor);
    }
    else {
      return await this._pipeline(img);
    }
  }
}

const depth_estimator = new Transformers_pipeline('depth-estimation', 'onnx-community/depth-anything-v2-small', undefined);//, { loading_message:'(🌐Loading Depth Estimation AI...)' });
const upscaler = new Transformers_pipeline('image-to-image', 'Xenova/swin2SR-lightweight-x2-64', undefined, { loading_message:'(🌐Loading Super Resolution AI...)' });

const SR_model_settings = {
  'Xenova/swin2SR-lightweight-x2-64': { scale:2 },
  'Xenova/swin2SR-classical-sr-x4-64': { scale:4 },
  'Xenova/swin2SR-realworld-sr-x4-64-bsrgan-psnr': { scale:4 },
}

//await depth_estimator.init();

let canvas, ctx;
canvas = new OffscreenCanvas(1, 1);
ctx = canvas.getContext('2d');

let canvas2, ctx2;
canvas2 = new OffscreenCanvas(1, 1);
ctx2 = canvas2.getContext('2d');

postMessage('OK');

onmessage = async (e)=>{
  const w = e.data.width;
  const h = e.data.height;

  let data = {};
  let transferred = [];

  let t;

  let msg_final;

  if (e.data.options.SR?.enabled) {
    let upscaled, t_upscaled;

    canvas.width  = w;
    canvas.height = h;

    const settings = SR_model_settings[e.data.options.SR.model] || { scale:2 };

    const scale = settings.scale;
    const mod = (scale == 2) ? 196 : 128;//160;
    const padding = 2;

// Create image-to-image pipeline
    await upscaler.init(e.data.options.SR.model);

    canvas2.width  = w*scale;
    canvas2.height = h*scale;
    ctx.drawImage(e.data.rgba, 0,0);

    t = performance.now();

    const x_max = Math.round(w/mod);
    const y_max = Math.round(h/mod);
    for (let x = 0; x < x_max; x++) {
      for (let y = 0; y < y_max; y++) {
        let x0_p = (x == 0) ? 0 : padding;
        let x1_p = (x == x_max-1) ? 0 : padding;
        let w0 = (x < x_max-1) ? mod : w - (x_max-1) * mod;

        let y0_p = (y == 0) ? 0 : padding;
        let y1_p = (y == y_max-1) ? 0 : padding;
        let h0 = (y < y_max-1) ? mod : h - (y_max-1) * mod;

        let sx = x * mod - x0_p;
        let sy = y * mod - y0_p;
        let sw = w0 + x0_p + x1_p;
        let sh = h0 + y0_p + y1_p;

        postMessage('(⏳Upscaling image block-' + (x+'x'+y) + '...)');

        console.log('Image block', x,y, sx,sy, sw,sh);

        upscaled = await upscaler.pipeline(new RawImage(ctx.getImageData(sx,sy,sw,sh).data, sw,sh, 4));

// NOTE: upscaled.width seems to be always a multiple of 16, which can be greater than sw*scale
        const w2 = upscaled.width;
        const w_scaled = w0 * scale;
        const h_scaled = h0 * scale;

        let image_data = new ImageData(w_scaled, h_scaled);
        let img_raw = new Uint8ClampedArray(upscaled.data);
        const x2_ini = x0_p*scale;
        const y2_ini = y0_p*scale;
        for (let y2 = y2_ini, y2_max = y2_ini + h_scaled; y2 < y2_max; y2++) {
          for (let x2 = x2_ini, x2_max = x2_ini + w_scaled; x2 < x2_max; x2++) {
            let i_raw = y2*w2 + x2;
            let i = (y2-y2_ini)*(w_scaled) + (x2-x2_ini);
            image_data.data[i*4]   = img_raw[i_raw*3];
            image_data.data[i*4+1] = img_raw[i_raw*3+1];
            image_data.data[i*4+2] = img_raw[i_raw*3+2];
            image_data.data[i*4+3] = 255;
          }
        }
        console.log(w_scaled+'x'+h_scaled);

        ctx2.putImageData(image_data, x*mod*scale, y*mod*scale);
      }
    }

    t_upscaled = performance.now() - t;

    data.upscaled_rgba = ctx2.getImageData(0,0,canvas2.width,canvas2.height).data.buffer;
    data.upscaled_width  = canvas2.width;
    data.upscaled_height = canvas2.height;
    data.t_upscaled = t_upscaled;
    transferred.push(data.upscaled_rgba);

    upscaled = undefined;

    msg_final = '(✅Image super upscaled x' + scale + ' - ' + Math.round(t_upscaled) + 'ms)';
  }

  if (e.data.options.depth?.enabled) {
    postMessage('(⏳Analyzing image depth...)');

    let sw, sh;
    if (use_low_res_depth_map && (w*h > 512*512)) {
      sh = 512;
      sw = 512;

      canvas.width  = sw;
      canvas.height = sh;
      ctx.drawImage(e.data.rgba, 0,0,w,h, 0,0,sw,sh);
    }
    else if (w*h > 1920*1080) {
// sh*ar * sh = 1920*1080
      const ar = w/h;
      sh = Math.round(Math.sqrt(1920*1080/ar));
      sw = Math.round(sh * ar);

      canvas.width  = sw;
      canvas.height = sh;
      ctx.drawImage(e.data.rgba, 0,0,w,h, 0,0,sw,sh);
    }
    else {
      sh = h;
      sw = w;

      canvas.width  = w;
      canvas.height = h;
      ctx.drawImage(e.data.rgba, 0,0);
    }

    await depth_estimator.init(e.data.options.depth.model);

    t = performance.now();

// Predict depth of an image
    let { depth } = await depth_estimator.pipeline(RawImage.fromCanvas(canvas));//new RawImage(ctx.getImageData(0,0,sw,sh).data, sw, sh, 4));

    const t_depth = performance.now() - t;

    data.depth_rgba = depth.data.buffer;
    data.depth_width = depth.width;
    data.depth_height = depth.height;
    data.t_depth = t_depth;
    data.get_map_only = e.data.options.depth.get_map_only;
    transferred.push(data.depth_rgba);

    depth = undefined;

    msg_final = '(✅3D mesh generated - ' + Math.round(t_depth) + 'ms)';
  }

// BEFORE data transfer as worker may be closed afterwards
  if (msg_final)
    postMessage(msg_final);

  postMessage(data, transferred);

  data = data.depth_rgba = data.upscaled_rgba = transferred = undefined;
};
