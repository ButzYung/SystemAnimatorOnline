import('./vision_bundle.js').then((m)=>{
//  console.log(m);
  for (const name of ['FilesetResolver', 'FaceLandmarker', 'PoseLandmarker', 'HandLandmarker'])
    self[name] = m[name];
});
