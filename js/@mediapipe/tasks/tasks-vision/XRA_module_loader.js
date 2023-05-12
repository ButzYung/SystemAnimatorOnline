// 2023-05-12

if (typeof window !== "object") {
  import('./vision_bundle.js').then((m)=>{
//    console.log(m);
    for (const name of ['FilesetResolver', 'FaceLandmarker', 'PoseLandmarker', 'HandLandmarker'])
      self[name] = m[name];
  });
}
else {
  System._browser.load_script('js/@mediapipe/tasks/tasks-vision/vision_bundle.js');
}

