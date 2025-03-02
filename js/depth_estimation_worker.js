// 2024-10-02

// https://huggingface.co/onnx-community/depth-anything-v2-small
// https://github.com/xenova/transformers.js
// https://huggingface.co/docs/transformers.js/en/tutorials/vanilla-js

import { pipeline, env, RawImage } from './@huggingface/transformers/dist/transformers.js'; //'https://cdn.jsdelivr.net/npm/@xenova/transformers@2.17.2'; // 
//const { pipeline, env } = await import('./@huggingface/transformers/dist/transformers.js');

env.allowLocalModels = false;

// Create depth estimation pipeline
// https://v2.scrimba.com/s0lmm0qh1q
const depth_estimator = await pipeline('depth-estimation', 'onnx-community/depth-anything-v2-small', { dtype:undefined, device:'webgpu' });

postMessage('OK');

onmessage = async (e)=>{
  let t = performance.now();

// Predict depth of an image
  const { depth } = await depth_estimator(new RawImage(new Uint8ClampedArray(e.data.rgba), e.data.width, e.data.height, 4));

// Visualize the output
//  console.log(depth);
//depth.save('depth.png');

  let data = { rgba:depth.data.buffer, width:depth.width, height:depth.height, t:performance.now()-t };
  postMessage(data, [data.rgba]);
};
