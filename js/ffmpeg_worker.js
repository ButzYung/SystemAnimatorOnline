// FFmpeg WASM worker

importScripts('ffmpeg.js');
//importScripts('https://unpkg.com/@ffmpeg/ffmpeg@0.11.6/dist/ffmpeg.min.js');

var ffmpeg;
var ffmpeg_loaded;

onmessage = async (e)=>{
  if (!ffmpeg_loaded)
    await ffmpeg.load();

// https://github.com/ffmpegwasm/ffmpeg.wasm/discussions/291
// https://superuser.com/questions/277642/how-to-merge-audio-and-video-file-in-ffmpeg
  let para_i = [], para = [];
  let output_name, output_type;
  for (const input of e.data.inputs) {
    if (input.name == 'video') {
      ffmpeg.FS('writeFile', input.name, new Uint8Array(input.blob));
      para_i.push('-i', input.name);
      para.push('-c:v', 'copy');
      output_name = 'output.mp4';
      output_type = 'video/mp4';
    }
    else if (input.name == 'audio') {
      if (input.blob) {
        ffmpeg.FS('writeFile', input.name, new Uint8Array(input.blob));
        para_i.push('-i', input.name);
      }
      para.push('-c:a', 'aac');
    }
  }

  await ffmpeg.run(...para_i, ...para, output_name);

  const _data = ffmpeg.FS('readFile', output_name);

  postMessage({ buffer:_data.buffer, output_type:output_type }, [_data.buffer]);

// need to exit, or ffmpeg cannot be reused
  ffmpeg.exit();
  ffmpeg_loaded = false;
};

(async ()=>{
  const { createFFmpeg } = FFmpeg;
  ffmpeg = createFFmpeg({
//    mainName: 'main',
    corePath: 'https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js',
    log: true,
  });

  await ffmpeg.load();
  ffmpeg_loaded = true;

  console.log('FFmpeg loaded');

  postMessage('OK');
})();

