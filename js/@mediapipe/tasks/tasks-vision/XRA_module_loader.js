// 2023-07-11

(()=>{
  function load_module(m) {
//    console.log(m);
    for (const name of ['FilesetResolver', 'FaceLandmarker', 'PoseLandmarker', 'HandLandmarker', 'HolisticLandmarker'])
      self[name] = m[name];
  }

  if (typeof window !== "object") {
    import('./vision_bundle.mjs').then(load_module);
  }
  else {
    import('./vision_bundle.mjs').then(load_module);
//https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.1
//    System._browser.load_script('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/vision_bundle.js');//, true).then(load_module);
  }
})();

