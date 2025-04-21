// (2024-10-14)

var MMD_SA_options = {
  MMD_disabled: true
};

(()=>{

  MMD_SA_options.width  = 960
  MMD_SA_options.height = 540

  Settings_default._custom_.EventToMonitor = "SOUND_ALL";//"FIXED_VALUE_50";//
  Settings_default._custom_.UseAudioFFT = "non_default"
  Settings_default._custom_.Use30FPS = "non_default"
  Settings_default._custom_.Use60FPS = "non_default"
//  Settings_default._custom_.Use32BandSpectrum = "non_default"
  Settings_default._custom_.UpdateInterval = "1"
  Settings_default._custom_.Display = "-1"
  Settings_default._custom_.DisableTransparency = "non_default"

  MMD_SA_options.use_THREEX = true;

  let camera_rotation_factor;

  window.addEventListener('load', ()=>{
//    System._restart_full = true;

    System._browser.on_animation_update.add(()=>{
      MMD_SA.THREEX.enabled = true;
    },0,0);

//    camera_rotation_factor = parseInt(LABEL_LoadSettings('LABEL_Wallpaper3D_camera_rotation_factor', 2));
    MMD_SA.Wallpaper3D.options_general.depth_shift_percent = parseInt(LABEL_LoadSettings('LABEL_Wallpaper3D_depth_shift_percent', 10));
    MMD_SA.Wallpaper3D.options_general.depth_contrast_percent = parseInt(LABEL_LoadSettings('LABEL_Wallpaper3D_depth_contrast_percent', -10));
    MMD_SA.Wallpaper3D.options_general.depth_blur = parseInt(LABEL_LoadSettings('LABEL_Wallpaper3D_depth_blur', 2));
    MMD_SA.Wallpaper3D.options_general.depth_model = LABEL_LoadSettings('LABEL_Wallpaper3D_depth_model', null);
    MMD_SA.Wallpaper3D.options_general.SR_mode = parseInt(LABEL_LoadSettings('LABEL_Wallpaper3D_SR_mode', 0));
    MMD_SA.Wallpaper3D.options_general.SR_model = LABEL_LoadSettings('LABEL_Wallpaper3D_SR_model', null);

    System._browser.tray_menu_custom = {
      para: {
        name: '3D Wallpaper',
        menu: [
{ label:'Follow mouse', type:'checkbox', click:'CUSTOM:3D Wallpaper|Follow mouse' },
//{ label:'Camera rotation', submenu:['No rotation','Small rotation','Normal rotation'].map((rotation,i)=>{ return { label:rotation, type:'radio', click:'CUSTOM:3D Wallpaper|Camera rotation|'+i }; }) },
{ label:'Depth shift', submenu:[-300,-250,-200,-150,-100,-50,10,50,100,150,200,250,300].map(percent=>{ return { label:'S'+((percent>1)?'+':'')+percent+'%', type:'radio', click:'CUSTOM:3D Wallpaper|Depth shift|'+percent }; }) },
{ label:'Depth contrast', submenu:[-50,-40,-30,-20,-10,50,100,150,200,250,300].map(percent=>{ return { label:'C'+((percent>1)?'+':'')+percent+'%', type:'radio', click:'CUSTOM:3D Wallpaper|Depth contrast|'+percent }; }) },
{ label:'Depth blur', submenu:[0,1,2,4,6,8,10,12,14,16].map(px=>{ return { label:px+'px', type:'radio', click:'CUSTOM:3D Wallpaper|Depth blur|'+px }; }) },
{ label:'Depth estimation model', submenu:Object.values(MMD_SA.Wallpaper3D.depth_model_name).map((name,i)=>{ return { label:name, type:'radio', click:'CUSTOM:3D Wallpaper|Depth estimation model|'+i }; }) },
{ label:'Super resolution model', submenu:[
    { label:'None', type:'radio', click:'CUSTOM:3D Wallpaper|Super resolution model|-1' },
    ...Object.values(MMD_SA.Wallpaper3D.SR_model_name).map((name,i)=>{ return { label:name, type:'radio', click:'CUSTOM:3D Wallpaper|Super resolution model|'+i }; })
  ]
}
        ]
      },

      update_tray: function (para) {
if (!MMD_SA.MMD_started)
  return;

const s = {};
s['Follow mouse'] = { checked:MMD_SA_options.look_at_mouse };
//s[['No rotation','Small rotation','Normal rotation'][camera_rotation_factor]] = { checked:true };
s['S'+((MMD_SA.Wallpaper3D.options_general.depth_shift_percent>1)?'+':'')+MMD_SA.Wallpaper3D.options_general.depth_shift_percent+'%'] = { checked:true };
s['C'+((MMD_SA.Wallpaper3D.options_general.depth_contrast_percent>1)?'+':'')+MMD_SA.Wallpaper3D.options_general.depth_contrast_percent+'%'] = { checked:true };
s[MMD_SA.Wallpaper3D.options_general.depth_blur+'px'] = { checked:true };
s[MMD_SA.Wallpaper3D.depth_model_name[MMD_SA.Wallpaper3D.options.depth_model]] = { checked:true };
s[MMD_SA.Wallpaper3D.SR_model_name[(MMD_SA.Wallpaper3D.options.SR_mode) ? MMD_SA.Wallpaper3D.options.SR_model : 'None']] = { checked:true };

para.custom_menu_status = {
  name: "3D Wallpaper",
//  status: [{ checked:true }]
  status: s
};
      },

      process_func: function (para) {
//console.log(para)
if (para[0] != "3D Wallpaper")
  return

let v = para[2];

switch (para[1]) {
  case 'Follow mouse':
    MMD_SA.tray_menu_func(['look_at_mouse',v]);
    break;
  case "Camera rotation":
    camera_rotation_factor = parseInt(v);
    System.Gadget.Settings.writeString('LABEL_Wallpaper3D_camera_rotation_factor', camera_rotation_factor);
    break
  case "Depth shift":
    MMD_SA.Wallpaper3D.options_general.depth_shift_percent = MMD_SA.Wallpaper3D.options.depth_shift_percent = parseInt(v);
    System.Gadget.Settings.writeString('LABEL_Wallpaper3D_depth_shift_percent', MMD_SA.Wallpaper3D.options_general.depth_shift_percent);
    break
  case "Depth contrast":
    MMD_SA.Wallpaper3D.options_general.depth_contrast_percent = MMD_SA.Wallpaper3D.options.depth_contrast_percent = parseInt(v);
    System.Gadget.Settings.writeString('LABEL_Wallpaper3D_depth_contrast_percent', MMD_SA.Wallpaper3D.options_general.depth_contrast_percent);
    break
  case "Depth blur":
    MMD_SA.Wallpaper3D.options_general.depth_blur = MMD_SA.Wallpaper3D.options.depth_blur = parseInt(v);
    System.Gadget.Settings.writeString('LABEL_Wallpaper3D_depth_blur', MMD_SA.Wallpaper3D.options_general.depth_blur);
    break
  case "Depth estimation model":
    MMD_SA.Wallpaper3D.options.depth_model = Object.keys(MMD_SA.Wallpaper3D.depth_model_name)[v];
    System.Gadget.Settings.writeString('LABEL_Wallpaper3D_depth_model', MMD_SA.Wallpaper3D.options.depth_model);
    break
  case "Super resolution model":
    v = parseInt(v);
    if (v == -1) {
      MMD_SA.Wallpaper3D.options.SR_mode = 0;
    }
    else {
      MMD_SA.Wallpaper3D.options.SR_mode = 1;
      MMD_SA.Wallpaper3D.options.SR_model = Object.keys(MMD_SA.Wallpaper3D.SR_model_name)[v];
    }
    System.Gadget.Settings.writeString('LABEL_Wallpaper3D_SR_mode', MMD_SA.Wallpaper3D.options.SR_mode);
    System.Gadget.Settings.writeString('LABEL_Wallpaper3D_SR_model', MMD_SA.Wallpaper3D.options.SR_model);
    break
}
      }
    };
  });

  window.addEventListener('MMDStarted', ()=>{
    MMD_SA.reset_camera();
    MMD_SA.THREEX.camera.control.enabled = false;

    DragDrop.onDrop_finish = (()=>{
      const _onDrop_finish = DragDrop._ondrop_finish;
      return function (item) {
        const src = item.path;
        if (item.isFileSystem && /([^\/\\]+)\.(bmp|jpg|jpeg|png|webp)$/i.test(src)) {
          System._browser.updateWallpaper(src, 10);
          MMD_SA.Wallpaper3D.load(src);
          System.Gadget.Settings.writeString('LABEL_Wallpaper3D_src', src);
        }
        else if (item.isFileSystem && /([^\/\\]+)\.(mp4|mkv|webm)$/i.test(src)) {
          MMD_SA.Wallpaper3D.depth_effect.load(src);
        }
        else {
          if (!item._winamp_JSON)
            _onDrop_finish.call(DragDrop, item);
        }
      };
    })();

    const cam_offset = new THREE.Vector3();
    const target_offset = new THREE.Vector3();
    let mov_offset = [0,0,0];
    const mov_offset_smoothed = new THREE.Vector3();
    const beta = 0;//0.01/5;
    const cam_smoother = new System._browser.data_filter([{ type:'one_euro', id:'cam_smoother', transition_time:0.5, para:[30, 1,beta,1, 3] }]);
    const mov_smoother = new System._browser.data_filter([{ type:'one_euro', id:'mov_smoother', transition_time:0.5, para:[30, 1,beta,1, 3] }]);

    let x_last, y_last;
    let idle_time = 0;
    let idle_timestamp = 0;
    const idle_time_threshold = 10*1000;

    const animation_path = [[0,0], [1,0], [0,1], [1,1], [0,0], [0,1], [1,0], [1,1]];
    const animation_node_duration = 5*1000;
    let animation_time = 0;

    MMD_SA.Wallpaper3D.depth_effect.enabled = true;
//    MMD_SA.Wallpaper3D.depth_effect.load('C:\\Users\\user\\Downloads\\fog-overlay-free.jpg');

    System._browser.on_animation_update.add(()=>{
if (!MMD_SA.Wallpaper3D.visible) {
  DEBUG_show(MMD_SA_options._Wallpaper3D_status_);
  return;
}

DEBUG_show();

const ar_img = MMD_SA.Wallpaper3D.ar;
const ar_cam = MMD_SA.THREEX.SL.width/MMD_SA.THREEX.SL.height;
let ar = ar_img / ar_cam;

let x, y, z;
let idled;
if (MMD_SA_options.look_at_mouse) {
  const cp = System._browser._electron_cursor_pos;
  const wp = System._browser._electron_window_pos;

  x = cp.x - wp[0];
  y = cp.y - wp[1];
//DEBUG_show(x+','+y)

  if ((x == x_last) && (y == y_last)) {
    idle_time += RAF_timestamp_delta;
  }
  else {
    idle_time = 0;
  }
  x_last = x;
  y_last = y;

  idled = idle_time > idle_time_threshold;
}
else {
  idled = true;
}

if (idled) {
  animation_time += RAF_timestamp_delta;
  idle_timestamp = RAF_timestamp;

  let duration = ((((ar > 1) ? ar : 1/ar)-1) * 0.5 + 1) * animation_node_duration;

  let a_index = ~~(animation_time / duration);
  let a_alpha = (animation_time - a_index * duration) / duration;
  if (a_index >= animation_path.length) {
    animation_time -= a_index * duration;
    a_index = 0;
  }
  let a_index_next = (a_index == animation_path.length-1) ? 0 : a_index+1;

  const n0 = animation_path[a_index];
  const n1 = animation_path[a_index_next];
  x = (n0[0] * (1-a_alpha) + n1[0] * a_alpha) * MMD_SA.THREEX.SL.width;
  y = (n0[1] * (1-a_alpha) + n1[1] * a_alpha) * MMD_SA.THREEX.SL.height;
//DEBUG_show([animation_time, a_index, a_alpha, x, y, Date.now()].join('\n'));
}
else {
  animation_time = 0;
}

//MMD_SA.Wallpaper3D.options.scale_xy_percent=150
const scale_xy = MMD_SA.Wallpaper3D.options.scale_xy_percent/100;
const scale_z = MMD_SA.Wallpaper3D.options.scale_z_percent/100;

const s = Math.max(scale_xy-1, 0.1) * MMD_SA.Wallpaper3D.d_to_full_screen * MMD_SA.Wallpaper3D.camera_factor;

x = -(THREE.Math.clamp(x/MMD_SA.THREEX.SL.width,  0,1) - 0.5);
y =  (THREE.Math.clamp(y/MMD_SA.THREEX.SL.height, 0,1) - 0.5);
z =  (0 - Math.max(Math.abs(x), Math.abs(y))) * MMD_SA.Wallpaper3D.scale_base * scale_z * 0.1;
//DEBUG_show([x,y,z].join('\n'))

//cam_smoother.filters[0].filter.beta = (idled) ? 0 : beta * Math.min((RAF_timestamp - idle_timestamp)/500, 1);
cam_offset.fromArray(cam_smoother.filter([x*s, y*s, z]));
//DEBUG_show(cam_offset.toArray().join('\n'))

//MMD_SA.Wallpaper3D.options.pos_z_offset_percent = z/(MMD_SA.Wallpaper3D.scale_base * scale_z) * 100; cam_offset.z = 0;

const s_target = (s - MMD_SA_options.camera_position_base[2]*0.1) / s;
//const c_target = (s - MMD_SA_options.camera_position_base[2]*((2-camera_rotation_factor)*0.05)) / s;

const cz = cam_offset.z;
target_offset.copy(cam_offset).multiplyScalar(s_target).setZ(cz);
//cam_offset.multiplyScalar(c_target).setZ(cz);

MMD_SA._trackball_camera.object.position.fromArray(MMD_SA_options.camera_position_base).add(cam_offset);
MMD_SA._trackball_camera.target.set(0,MMD_SA_options.camera_position_base[1],0).add(target_offset);

if (ar < 1) {
  let y_target = (1-ar) * y;
  let y_current = MMD_SA.Wallpaper3D.options.pos_y_offset_percent/100;
  let y_diff = y_target - y_current;
  y_diff = Math.sign(y_diff) * Math.min(Math.abs(y_diff), 0.5) * Math.min(RAF_timestamp_delta/1000,0.1) * 0.5;
  mov_offset = [0, y_diff, 0];
//DEBUG_show([(1/ar-1)/ar_cam, y, mov_offset[1], MMD_SA.Wallpaper3D.options.pos_y_offset_percent].join('\n'))
}
else if (ar > 1) {
  let x_target = (1-1/ar) * x;
  let x_current = MMD_SA.Wallpaper3D.options.pos_x_offset_percent/100;
  let x_diff = x_target - x_current;
  x_diff = Math.sign(x_diff) * Math.min(Math.abs(x_diff), 0.5) * Math.min(RAF_timestamp_delta/1000,0.1) * 0.5;
  mov_offset = [x_diff, 0, 0];
}
else {
  mov_offset = [0,0,0];
}
mov_offset_smoothed.fromArray(mov_smoother.filter(mov_offset));

MMD_SA.Wallpaper3D.options.pos_x_offset_percent += mov_offset_smoothed.x * 100;
MMD_SA.Wallpaper3D.options.pos_y_offset_percent += mov_offset_smoothed.y * 100;
    },0,0,-1);

    DEBUG_show();
    DEBUG_show('Loading 3D wallpaper...', 5);

    let wallpaper_src = LABEL_LoadSettings('LABEL_Wallpaper3D_src', null);
    if (wallpaper_src) {}
    else if (/url\((.+)\)/.test(LdesktopBG.style.backgroundImage)) {
      wallpaper_src = RegExp.$1.replace(/[\'\"]/g, '');
      wallpaper_src = toLocalPath(wallpaper_src);
    }
    else {
      const desktop_reg = 'HKCU\\Control Panel\\Desktop\\';
      wallpaper_src = oShell.RegRead(desktop_reg + 'Wallpaper');
    }
//wallpaper_src = System.Gadget.path + '/images/zhen-yao-2bG6fFQDLLQ-unsplash.png';
//wallpaper_src = 'C:\\Users\\user\\Downloads\\Vtuber BG\\Ellen Joe - wallhaven-85mqj1.png';
    console.log(wallpaper_src);

    System._browser.updateWallpaper(wallpaper_src, 10);

    const SR_mode = MMD_SA.Wallpaper3D.options.SR_mode;
    MMD_SA.Wallpaper3D.options.SR_mode = 0;
    MMD_SA.Wallpaper3D.load(wallpaper_src).then(()=>{
      MMD_SA.Wallpaper3D.options.SR_mode = SR_mode;
      DEBUG_show('✅3D wallpaper ready', 3);
    });
  });

})();

// main js
document.write('<script language="JavaScript" src="MMD.js/MMD_SA.js"></scr'+'ipt>');