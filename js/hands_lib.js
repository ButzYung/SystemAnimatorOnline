// (2023-08-14)

var HandsAT = (function () {

  var is_worker = (typeof window !== "object");

  var postMessageAT = (is_worker) ? postMessage : function (msg, transfer) {
    _HandsAT._worker.onmessage({data:msg})
  };

  function path_adjusted(url) {
    if (!is_worker && !/^\w+\:/i.test(url)) {
      url = url.replace(/^(\.?\/?)([\w\@])/, "$1js/$2")
    }
    return url
  }

  async function load_scripts(url) {
if (is_worker) {
  importScripts(url)
}
else {
  return new Promise((resolve, reject) => {
    let script = document.createElement('script');
    script.onload = () => { resolve() };
    script.src = path_adjusted(url);
    document.head.appendChild(script);
  });
}
  }


  async function init(_worker, param) {
_HandsAT._worker = _worker;

if (param) {
  param = (function () {
    var _param = {};
    param.forEach((p)=>{
      if (/(\w+)\=(\w+)/.test(p))
        _param[RegExp.$1] = RegExp.$2
    });
    return {
      get: function (id) {
        return _param[id]
      }
    };
  })();
}
else {
  param = new URLSearchParams(self.location.search.substring(1));
}

if (is_worker) importScripts('./one_euro_filter.js');

postMessageAT('(Hands worker initialized)')
postMessageAT('OK')
  }

  var handpose_initialized;
  async function load_lib(options) {
if (!handpose_initialized) {
  await load_scripts('@mediapipe/tasks/tasks-vision/XRA_module_loader.js');

  await new Promise((resolve)=>{
const timerID = setInterval(()=>{
  if ('FilesetResolver' in self) {
    clearInterval(timerID);
    resolve();
  }
}, 100);
  });

  const vision = await FilesetResolver.forVisionTasks(
// path/to/wasm/root
//"https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
path_adjusted('@mediapipe/tasks/tasks-vision/wasm')
  );

  const f = await HandLandmarker.createFromOptions(
vision,
{
  baseOptions: {
    modelAssetPath: path_adjusted('@mediapipe/tasks/hand_landmarker.task'),
    delegate: "GPU"
  },
  runningMode: 'VIDEO',
  numHands: 2
}
  );

    data_filter[1] = {
      Left: {
        landmarks: [],
      },
      Right: {
        landmarks: [],
      },
    };
    for (const d of ['Left', 'Right']) {
      for (let i = 0; i < 21; i++) {
        data_filter[1][d].landmarks[i] = new OneEuroFilter(30, 1,1/1000,1, 3);
      }
    }

  handpose_model = {
estimateHands: function (video, nowInMs) {
  const result = f.detectForVideo(video, nowInMs);
//console.log(result)
  return Promise.resolve(Object.assign({ multiHandLandmarks:result.landmarks, multiHandedness:result.handednesses?.map(h=>h[0]) }, result));
}
  };

  console.log('(Mediapipe Hand Landmarker initialized)')
  postMessageAT('(Mediapipe Hand Landmarker initialized)')

  console.log('(Mediapipe hands initialized)')
  postMessageAT('(Mediapipe hands initialized)')
}

handpose_initialized = true
  }


var use_human_hands;

var handpose_model;

var fps = 0, fps_count = 0, fps_ms = 0;

function _onmessage(e) {
  let t = performance.now()
  let data = (typeof e.data === "string") ? JSON.parse(e.data) : e.data;

  if (data.canvas) {
    canvas = data.canvas
    context = canvas.getContext("2d")
  }
  if (data.canvas_hands)
    _canvas_hands = data.canvas_hands;
  canvas_hands = (data.options.use_canvas_hands) ? _canvas_hands : null;
  if (data.canvas_hands) console.log('(Transferred - canvas_hands_workers)');

  if (data.rgba) {
    process_video_buffer(data.rgba, data.w,data.h, data.options);

    data.rgba = undefined
    data = undefined
  }
}

var vt, vt_offset=0, vt_last=-1;

let _canvas_hands;
let canvas_hands;// = new OffscreenCanvas(1,1);

let shoulder_width;

let data_filter = [];

async function process_video_buffer(rgba, w,h, options) {
  function hands_adjust(hands, nowInMs) {
    function landmark_adjust(h, clip) {
const scale = clip[8];
const cw = canvas_hands.width;

return [
  (h.x*cw - clip[4])/scale + clip[0],
  (h.y*cw - clip[5])/scale + clip[1],
  h.z*cw/scale,
];
    }

    if (!hands || use_human_hands) return hands

   if (options.use_holistic) {
      const _result = hands
      hands = { image:_result.image, multiHandedness:[], multiHandLandmarks:[] }
      if (_result.leftHandLandmarks && _result.leftHandLandmarks.length) {
        hands.multiHandLandmarks.push(_result.leftHandLandmarks)
// LR inverted
        hands.multiHandedness.push({score:1, categoryName:'Right'})
      }
      if (_result.rightHandLandmarks && _result.rightHandLandmarks.length) {
        hands.multiHandLandmarks.push(_result.rightHandLandmarks)
        hands.multiHandedness.push({score:1, categoryName:'Left'})
      }
    }

    if (!hands.multiHandedness || !hands.multiHandedness.length)
      return []

    var _hands = []
    var iw = hands.image?.width  || w;
    var ih = hands.image?.height || h;

    const adjust_handedness = !options.use_holistic && canvas_hands && (hands.multiHandedness.length > 1) && (hands.multiHandedness[0].categoryName == hands.multiHandedness[1].categoryName) && hands.multiHandedness[0].categoryName;
    if (adjust_handedness) {
      clip_index = hand_clip.findIndex(c=>(adjust_handedness=='Left') ? c[9]==1 : c[9]==-1);
      if (clip_index != -1) {
        let clip = hand_clip[clip_index];

        const dis = hands.multiHandLandmarks.map(h=>{
const palm = landmark_adjust(h[0], clip);
const x = clip[10] - palm[0];
const y = clip[11] - palm[1];
return Math.sqrt(x*x + y*y);
        });

        const idx_to_flip = (dis[0] > dis[1]) ? 0 : 1;
        hands.multiHandedness[idx_to_flip].categoryName = (adjust_handedness=='Left') ? 'Right' : 'Left';
        const h = hands.multiHandLandmarks[idx_to_flip];
        hands.multiHandLandmarks[idx_to_flip] = [
h[0],
h[17],h[18],h[19],h[20],
h[13],h[14],h[15],h[16],
h[9], h[10],h[11],h[12],
h[5], h[6], h[7], h[8],
h[1], h[2], h[3], h[4],
        ];
//console.log(adjust_handedness, dis.join(','));
      }
    }

    for (let i = 0, i_max = Math.min(hands.multiHandedness.length,2); i < i_max; i++) {
      const label = hands.multiHandedness[i].label || hands.multiHandedness[i].categoryName;
//options.video_flipped
      let clip;
      if (!options.use_holistic && canvas_hands) {
        clip = hand_clip.find(c=>(label=='Left') ? c[9]==1 : c[9]==-1);
        if (!clip) continue;
      }

      const h = hands.multiHandLandmarks[i].map(_h=>{
if (options.use_holistic || !canvas_hands) {
  return [
_h.x*iw,
_h.y*ih,
_h.z*iw,
  ];
}
else {
  return landmark_adjust(_h, clip);
}
      });

      _hands.push({
score: hands.multiHandedness[i].score,
label: hands.multiHandedness[i].label || hands.multiHandedness[i].categoryName,
keypoints: h,
      });
    }
//console.log(_hands)


    _hands.forEach(hand=>{
const h = hand.keypoints;

//[0,1,5,9,13,17]
let palm_width, palm_height;
palm_width  = [h[1][0]-h[17][0], h[1][1]-h[17][1], h[1][2]-h[17][2]];
palm_height = [h[0][0]-h[9][0],  h[0][1]-h[9][1],  h[0][2]-h[9][2]];

const w_palm = Math.sqrt(palm_width[0]*palm_width[0] + palm_width[1]*palm_width[1] + palm_width[2]*palm_width[2]);
const h_palm = Math.sqrt(palm_height[0]*palm_height[0] + palm_height[1]*palm_height[1] + palm_height[2]*palm_height[2]);

let _adjust_ratio = h_palm / w_palm;

_adjust_ratio = (_adjust_ratio < 1.25) ? 1.25 : ((_adjust_ratio > 1.75) ? 1.75 : 1);
if (_adjust_ratio != 1) {
  const adjust_max = Math.max(Math.abs(palm_height[2]/h_palm), Math.abs(palm_width[2]/w_palm));

  const s = _adjust_ratio * _adjust_ratio;
  palm_width  = [h[1][0]-h[17][0], h[1][1]-h[17][1], h[1][2]-h[17][2]];
  palm_height = [h[0][0]-h[9][0],  h[0][1]-h[9][1],  h[0][2]-h[9][2]];
/*
1.5 * (x1*x1 + y1*y1 + (z1*s)*(z1*s)) = x2*x2 + y2*y2 + (z2*s)*(z2*s)
(z1*s)*(z1*s) - (z2*s)*(z2*s)/1.5 = (x2*x2 + y2*y2)/1.5 - (x1*x1 + y1*y1)
s*s = ((x2*x2 + y2*y2)/1.5 - (x1*x1 + y1*y1))/(z1*z1 - z2*z2/1.5)
*/
  _adjust_ratio = Math.min(Math.sqrt(Math.abs(((palm_height[0]*palm_height[0] + palm_height[1]*palm_height[1])/s - (palm_width[0]*palm_width[0] + palm_width[1]*palm_width[1])) / (palm_width[2]*palm_width[2] - palm_height[2]*palm_height[2]/s))), 1.5 + 1.5*adjust_max);
//console.log(adjust_max)
  h.forEach(j=>{j[2] *= _adjust_ratio});
}

if (data_filter[1]) {
  const d = hand.label;
  const palm0 = h[0].slice();
  h.forEach((j,idx)=>{
    j.forEach((v,i)=>{j[i] -= palm0[i]});
    const j_new = data_filter[1][d].landmarks[idx].filter(j, nowInMs);
    j.forEach((v,i)=>{j[i] = j_new[i] + palm0[i]});
  });
}

// ["thumb", "index", "middle", "ring", "pinky"]
hand.annotations = {
  "palm":   [h[0]],
  "thumb":  [h[1], h[2], h[3], h[4]],
  "index":  [h[5], h[6], h[7], h[8]],
  "middle": [h[9], h[10],h[11],h[12]],
  "ring":   [h[13],h[14],h[15],h[16]],
  "pinky":  [h[17],h[18],h[19],h[20]]
};
    });

    return _hands;
  }

  const hand_clip = [];
  function get_hand_canvas(pose) {
//return rgba;
if (!canvas_hands) return rgba;

const ctx = canvas_hands.getContext('2d');
ctx.save();

//ctx.beginPath();

hand_clip.length = 0;
let clip = [];
const radius = shoulder_width * (1 + Math.max(shoulder_width/Math.min(w,h)*3-0.5, 0.1)) /2;
for (const id of [9,10]) {
  const kp = pose.keypoints[get_pose_index(id)];
  if (kp.score < score_threshold) continue;

  let cw = radius * 2;
  let ch = radius * 2;
  let x = kp.position.x - radius;
  if (x < 0) {
    cw += x;
    x = 0;
  }
  let y = kp.position.y - radius;
  if (y < 0) {
    ch += y;
    y = 0;
  }
  if (x + cw > w)
    cw -= (x + cw) - w;
  if (y + ch > h)
    ch -= (y + ch) - h;

  if ((cw <= 0) || (ch <= 0)) continue;

//console.log(id+':',x,y, cw,ch)
  clip.push([x,y, cw,ch, (id==9)?-1:1, kp.position.x,kp.position.y]);
}

if (clip.length) {
  ctx.fillStyle = 'black';
  ctx.fillRect(0,0, canvas_hands.width,canvas_hands.height);

  let x = Math.min(...clip.map(v=>v[0]));
  let y = Math.min(...clip.map(v=>v[1]));
  let cw = Math.max(...clip.map(v=>v[0]+v[2])) - x;
  let ch = Math.max(...clip.map(v=>v[1]+v[3])) - y;

  const c_radius = canvas_hands.width/2;
  let scale;
  if ((cw < radius*4) && (ch < radius*4)) {
    scale = canvas_hands.width / Math.max(cw,ch);
    let x_offset, y_offset;
    if (cw > ch) {
      x_offset = 0;
      y_offset = (canvas_hands.width-ch*scale)/2;
    }
    else {
      x_offset = (canvas_hands.width-cw*scale)/2;
      y_offset = 0;
    }
    clip.forEach(c=>{
      const x2 = x_offset + (c[0]-x)*scale;
      const y2 = y_offset + (c[1]-y)*scale;
      hand_clip.push([c[0],c[1],c[2],c[3], x2,y2,cw*scale,ch*scale, scale, c[4], c[5],c[6]]);
    });
    ctx.drawImage(rgba, x,y,cw,ch, x_offset,y_offset,cw*scale,ch*scale);
  }
  else {
    scale = c_radius / (radius*2);
    clip.forEach((c,i)=>{
      const y2 = Math.max(Math.min( (((c[1] - y + c[3]/2) / ch) - 0.5) * 4, 1), -1) * c_radius/4 + c_radius/2;
//((options.video_flipped)?1:-1)
      const x2 = (c[4] == 1) ? 0 : c_radius;
      hand_clip[i] = [c[0],c[1],c[2],c[3], x2,y2,c[2]/(radius*2)*c_radius,c[3]/(radius*2)*c_radius];
      ctx.drawImage(rgba, ...hand_clip[i]);
      hand_clip[i].push(scale, c[4], c[5],c[6]);
    });
  }
}

ctx.restore();

return (clip.length) ? canvas_hands : rgba;
  }

  try {
    await load_lib(options)
  }
  catch (err) {
    console.error(err);
    postMessageAT('PoseNet/Handpose ERROR:' + err);
    return
  }

  let _t = performance.now();

  if (options.timestamp != null) {
    vt = options.timestamp + vt_offset;
    if (vt <= vt_last) {
      vt_offset = (vt_last - options.timestamp) + 16.6667;
      vt = options.timestamp + vt_offset;;
    }
    vt_last = vt;
  }
  else {
    vt = _t;
  }
//console.log(vt)

  if (rgba instanceof ArrayBuffer)
    rgba = await createImageBitmap(new ImageData(new Uint8ClampedArray(rgba), w,h));
//rgba = tf.browser.fromPixels(rgba)

  let pose, hands;
  let score_threshold = 0.5;

  pose = options.pose;
  shoulder_width = options.shoulder_width;

  hands = await handpose_model.estimateHands(get_hand_canvas(pose), vt);
  hands = hands_adjust(hands, vt);

  _t = performance.now() - _t +(options._t||0);

  fps_ms += _t
  if (++fps_count >= 20) {
    fps = 1000 / (fps_ms/fps_count)
    fps_count = fps_ms = 0
  }

  if (hands) {
    hands = hands.filter((h)=>h.annotations&&Object.keys(h.annotations).length);
  }

  postMessageAT(JSON.stringify({ handpose:hands, _t:_t, fps:fps }));

  if (rgba instanceof ImageBitmap) rgba.close();
//rgba.dispose();

  rgba = undefined;
}

// https://github.com/tensorflow/tfjs-models/blob/master/pose-detection/src/constants.ts
const BLAZEPOSE_KEYPOINTS = [
  'nose',
  'left_eye_inner',
  'left_eye',
  'left_eye_outer',
  'right_eye_inner',
  'right_eye',
  'right_eye_outer',
  'left_ear',
  'right_ear',
  'mouth_left',
  'mouth_right',
  'left_shoulder',
  'right_shoulder',
  'left_elbow',
  'right_elbow',
  'left_wrist',
  'right_wrist',
  'left_pinky',
  'right_pinky',
  'left_index',
  'right_index',
  'left_thumb',
  'right_thumb',
  'left_hip',
  'right_hip',
  'left_knee',
  'right_knee',
  'left_ankle',
  'right_ankle',
  'left_heel',
  'right_heel',
  'left_foot_index',
  'right_foot_index'
];

const blazepose_translated = [
0, 2,5, 7,8, 11,12,13,14,15,16, 23,24,25,26,27,28
];

function get_pose_index(id) {
  return blazepose_translated[id];
}

  var _HandsAT = {
    init,
    path_adjusted,
  };

  if (is_worker) {
    onmessage = _onmessage
  }
  else {
    _HandsAT.onmessage = _onmessage
  }

  return _HandsAT;
})();
