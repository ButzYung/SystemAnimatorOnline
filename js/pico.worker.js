// pico.js worker
// https://github.com/tehnokv/picojs
// view-source:https://tehnokv.com/posts/picojs-intro/demo/

importScripts("pico.js");

var face_cover;

var update_memory = pico.instantiate_detection_memory(5); // we will use the detecions of the last 5 frames
var facefinder_classify_region = function(r, c, s, pixels, ldim) {return -1.0;};
var cascadeurl = 'https://raw.githubusercontent.com/nenadmarkus/pico/c2e81f9d23cc11d1a612fd21e4f9de0921a5d0d9/rnt/cascades/facefinder';
fetch(cascadeurl).then(function(response) {
	response.arrayBuffer().then(function(buffer) {
		var bytes = new Int8Array(buffer);
		facefinder_classify_region = pico.unpack_cascade(bytes);
		console.log('pico.js cascade loaded');

// https://dev.to/trezy/loading-images-with-web-workers-49ap
fetch("../images/laughing_man_134x120.png").then(function (response) {
//console.log(response)
  response.blob().then(function (blob) {
    createImageBitmap(blob).then(function (img) {
//console.log(face_cover)
      face_cover = img
      console.log("face cover OK")
      postMessage('pico.js cascade loaded');
    });
  });
}).catch(function (err) {
  console.log("ERROR: face cover FAILED")
});

	})
});

var canvas, context, RAF_timerID;

function rgba_to_grayscale(rgba, nrows, ncols) {
  var gray = new Uint8Array(nrows*ncols);
  for(var r=0; r<nrows; ++r) {
    for(var c=0; c<ncols; ++c) {
    // gray = 0.2*red + 0.7*green + 0.1*blue
      const idx = r*4*ncols+4*c
      gray[r*ncols + c] = (2*rgba[idx+0]+7*rgba[idx+1]+1*rgba[idx+2])/10;
    }
  }
  return gray;
}

function process_video_buffer(rgba, w,h, threshold) {
  if (!face_cover)
    return

var _t=performance.now()

  rgba = new Uint8ClampedArray(rgba);
				// prepare input to `run_cascade`
				const image = {
					"pixels": rgba_to_grayscale(rgba, h, w),
					"nrows": h,
					"ncols": w,
					"ldim": w
				}
				const params = {
					"shiftfactor": 0.1, // move the detection window by 10% of its size
					"minsize": 50,//100,     // minimum size of a face
					"maxsize": 1000,    // maximum size of a face
					"scalefactor": 1.1  // for multiscale processing: resize the detection window by 10% when moving to the higher scale
				}
				// run the cascade over the frame and cluster the obtained detections
				// dets is an array that contains (r, c, s, q) quadruplets
				// (representing row, column, scale and detection score)
				let dets = pico.run_cascade(image, facefinder_classify_region, params);
				dets = update_memory(dets);
				dets = pico.cluster_detections(dets, 0.2); // set IoU threshold to 0.2

_t=performance.now()-_t

  dets = dets.filter((d)=>(d[3]>threshold));
  postMessage(JSON.stringify({ dets:dets, _t:_t }));

  if (canvas) {
    if (RAF_timerID)
      cancelAnimationFrame(RAF_timerID)
    RAF_timerID = requestAnimationFrame(function () {
      RAF_timerID = null
      draw_dets(dets, w,h)
    });
  }
}

function draw_dets(dets, ww,hh) {
  let cw = face_cover.width
  let ch = face_cover.height

  if ((canvas.width != ww) || (canvas.height != hh)) {
    canvas.width  = ww
    canvas.height = hh
  }

  context.clearRect(0,0,ww,hh)
  let h,w,x,y;
  if (dets.length) {
    let scale = 1
    dets.forEach(function (det) {
      h = det[2] * scale
      w = h * cw/ch
      x = det[1] * scale - w/2
      y = det[0] * scale - h/2
      context.drawImage(face_cover, 0,0,cw,ch, x,y,w,h)
    });
  }
  else {
    h = Math.min(ww,hh)
    w = h * cw/ch
    x = (ww - w)/2
    y = (hh - h)/2
    context.drawImage(face_cover, 0,0,cw,ch, x,y,w,h)
  }
}

onmessage = function (e) {
  var t = performance.now()
  var data = (typeof e.data === "string") ? JSON.parse(e.data) : e.data;

  if (data.canvas) {
    canvas = data.canvas
    context = canvas.getContext("2d")
  }

  if (data.rgba) {
    process_video_buffer(data.rgba, data.w,data.h, data.threshold||50);

    data.rgba = undefined
    data = undefined
  }
};
