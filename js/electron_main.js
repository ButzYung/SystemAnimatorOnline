// SA Electron - Main EXTENDED
// (2024-04-02)

/*
eval on Electron v1.6.x has some scope issues/bugs which makes the global variables on this script inaccessible inside functions.
As a workaround, use anonymous self-invoking function to create its own scope.
*/

(function () {

// re-defined here for backward compatibility
if (windows_mode == undefined) {
  var windows_mode = (process.platform == "win32");
  var linux_mode   = (process.platform == "linux");
  var toLocalPath = function (url) {
    return decodeURIComponent(url.replace(/^file\:\/+/i, ((windows_mode)?"":"/")).replace(/^(\w)[\|\:]/i, "$1:").replace(/[\/\\]/g, ((windows_mode)?"\\":"/")).replace(/\?.+$/, ""));
  };
}


// https://stackoverflow.com/questions/54464276/how-to-force-discrete-gpu-in-electron-js
const { spawn } = require('child_process');

// Restart with force using the dedicated GPU
if (windows_mode && process.env.GPUSET !== 'true') {
  spawn(process.execPath, process.argv.slice(1), {
    env: {
      ...process.env,
      SHIM_MCCOMPAT: '0x800000001', // this forces windows to use the dedicated GPU for the process
      GPUSET: 'true'
    },
    detached: true,
  });
  process.exit(0);
}


const icon_name = (windows_mode) ? "icon_SA.ico" : "icon_SA_512x512.png";

// Module to control application life.
const app = electron.app

// https://stackoverflow.com/questions/55898000/blocked-a-frame-with-origin-file-from-accessing-a-cross-origin-frame
app.commandLine.appendSwitch('disable-site-isolation-trials');

app.commandLine.appendSwitch('enable-features','SharedArrayBuffer');

app.commandLine.appendSwitch("ignore-gpu-blocklist");

// https://github.com/electron/electron/issues/9842
// https://www.electronjs.org/docs/latest/api/command-line-switches
app.commandLine.appendSwitch('force_high_performance_gpu');

//app.commandLine.appendSwitch('js-flags', '--experimental-wasm-simd');

// https://github.com/electron/electron/issues/2170
// transparency on Linux is broken, disabled for now
// NOTE: It seems the latest version electron supports transparent window without any flags
/*
if (linux_mode) {
//  app.disableHardwareAcceleration()
//  app.commandLine.appendSwitch("disable-gpu")
//  app.commandLine.appendSwitch("enable-transparent-visuals")
//  app.commandLine.appendSwitch("force-cpu-draw")
}
*/
//app.commandLine.appendSwitch("enable-native-gpu-memory-buffers");


// Module to create native browser window.
const BrowserWindow = electron.BrowserWindow

const Tray = electron.Tray
const Menu = electron.Menu
const MenuItem = electron.MenuItem


// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

let webContents
let tray, contextMenuHost, contextMenu, contextMenu_opacity, contextMenu_size, contextMenu_active_window, contextMenu_media_control
let contextMenu_MMD, contextMenu_MMD_visual_effects, contextMenu_MMD_model, contextMenu_MMD_model_list, contextMenu_MMD_OSC_VMC, contextMenu_MMD_OSC_VMC_client;
let contextMenu_MMD_visual_effects_SelfOverlay, contextMenu_MMD_visual_effects_SelfOverlay_color_adjust, contextMenu_MMD_visual_effects_SelfOverlay_color_adjust_RGB, contextMenu_MMD_visual_effects_SelfOverlay_brightness
let contextMenu_MMD_visual_effects_HDR
let contextMenu_MMD_visual_effects_SeriousShader, contextMenu_MMD_visual_effects_SeriousShader_shadow_opacity, contextMenu_MMD_visual_effects_SeriousShader_shadow_opacity_material_x050
let contextMenu_MMD_visual_effects_PostProcessing, contextMenu_MMD_visual_effects_PostProcessing_SAO, contextMenu_MMD_visual_effects_PostProcessing_SAO_disabled_by_material, contextMenu_MMD_visual_effects_PostProcessing_Diffusion, contextMenu_MMD_visual_effects_PostProcessing_BloomPostProcess, contextMenu_MMD_visual_effects_PostProcessing_BloomPostProcess_blur_size, contextMenu_MMD_visual_effects_PostProcessing_BloomPostProcess_intensity, contextMenu_MMD_visual_effects_PostProcessing_BloomPostProcess_threshold
let contextMenu_MMD_visual_effects_Shadow, contextMenu_MMD_visual_effects_Light, contextMenu_MMD_visual_effects_Light_color, contextMenu_MMD_visual_effects_Light_color_RGB, contextMenu_MMD_visual_effects_Light_position, contextMenu_MMD_visual_effects_Light_position_XYZ
let contextMenu_Custom, contextMenu_Custom_submenu_by_name = {}
let contextMenu_click_thru

let MMD_model_material_index, MMD_model_material_label, MMD_model_list

let menu_item_index


const webPreferences_default = {
  nodeIntegration: true,
  enableRemoteModule: true,
// https://www.electronjs.org/docs/breaking-changes#default-changed-contextisolation-defaults-to-true
  contextIsolation: false,
//  nodeIntegrationInWorker: true,
//  preload: toLocalPath(SA_path + '\\' + 'js\\electron_preload.js'),
};


// Quit when all windows are closed.
/*
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform != 'darwin') {
    app.quit();
  }
});
*/

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.on('ready', function() {

  var path_demo_obj = global.path_demo()
  if (!path_demo_obj) {
    app.quit()
    return
  }

  if (windows_mode && !electron.systemPreferences.isAeroGlassEnabled()) {
    global.is_natural_opaque = true
    global.is_transparent = false
  }

  if (linux_mode) {
//    global.is_natural_opaque = true
//    global.is_transparent = false
  }

  var p = process.argv.slice(1)
  if (p) {
    if (p[0] == "-parentHWND") {
      global.WallpaperEngine_mode = true
      global.is_natural_opaque = true
      global.is_transparent = false
    }

    var wsh_index, hta_index
    wsh_index = hta_index = p.length - 1
    if (p[wsh_index] == "wsh") {
      hta_index -= 1
    }

    const _animation_path_default_ = toLocalPath(SA_path + '/TEMP/animation_path_default.txt');
    let animation_path_default;
    if (fs.existsSync(_animation_path_default_)) {
      try {
        animation_path_default = fs.readFileSync(_animation_path_default_, 'utf8').trim();
        if (/^[\/\\]/.test(animation_path_default))
          animation_path_default = SA_path + animation_path_default;
      }
      catch (err) {}
    }

    if (animation_path_default || ((hta_index >= 0) && /^(\/|[\w\-]+\:|demo\d+$)/.test(p[hta_index]))) {
      let SA_HTA_folder = p[hta_index] || animation_path_default;
      if (/^system-animator\:\/+/.test(SA_HTA_folder)) {
        SA_HTA_folder = decodeURIComponent(SA_HTA_folder.replace(/^system-animator\:\/+/, "")).replace(/[\/\\]$/, "")
      }
      SA_HTA_folder = path_demo_obj.path_demo[SA_HTA_folder] || SA_HTA_folder

var SA_HTA_folder_full = SA_HTA_folder
var isFile = fs.lstatSync(SA_HTA_folder).isFile()
if (isFile) {
  SA_HTA_folder = SA_HTA_folder.replace(/[\/\\][^\/\\]+$/, "")
}

if (isFile && /\.(mp4|mkv|webm)$/i.test(SA_HTA_folder_full)) {
  global.is_natural_opaque = true
  global.is_transparent = false
}

var SA_project_JSON
var p_js = toLocalPath(SA_HTA_folder + '\\SA_project.json')
if (fs.existsSync(p_js)) {
  try {
    SA_project_JSON = JSON.parse(fs.readFileSync(p_js, 'utf8'))
  }
  catch (err) {}
}

var c_js
if (path_demo_obj.path_demo_by_url[SA_HTA_folder]) {
  c_js = toLocalPath(SA_path + '\\TEMP\\_config_local\\' + SA_HTA_folder.replace(/^.+[\/\\]/, "") + '.js')
  if (!fs.existsSync(c_js))
    c_js = ""
}
else if (isFile) {
  c_js = toLocalPath(SA_path + '\\TEMP\\_config_local\\_SA_' + global.HASH_SHA256.hash(SA_HTA_folder_full) + '.js')
  if (!fs.existsSync(c_js))
    c_js = ""
}

if (!c_js) {
  c_js = toLocalPath(SA_HTA_folder + '\\_config_local.js')
  if (!fs.existsSync(c_js))
    c_js = ""
}

var c_json
if (c_js) {
  try {
    var txt = fs.readFileSync(c_js, 'utf8')
    if (/(\{[^\}]+})/.test(txt)) {
      c_json = JSON.parse(RegExp.$1)
    }
    if (c_json && SA_project_JSON && SA_project_JSON.config_default) {
      for (var s_name in SA_project_JSON.config_default)
        c_json[s_name] = SA_project_JSON.config_default[s_name]
    }
  }
  catch (err) {}
}

if (!c_json)
  c_json = SA_project_JSON && SA_project_JSON.config_default

if (c_json) {
//electron.dialog.showMessageBox(null, {type:"question", buttons:["OK", "Cancel"], defaultId:1, message:SA_HTA_folder+'\n\n'+c_js+'|'+!!c_js+'\n'+JSON.stringify(c_json)+'\n'+JSON.stringify(SA_project_JSON) });
// NOTE: .is_transparent should always be false for "Stay on desktop" mode, even when electron-as-wallpaper is used (.transparent doesn't help as the background is still black)
  if (c_json.DisableTransparency || c_json.AutoItStayOnDesktop) {
    global.is_transparent = false
  }
  if (c_json.DisableBackgroundThrottling) {
    global.is_backgroundThrottling_disabled = true;
    webPreferences_default.backgroundThrottling = false;
  }
}
    }
  }


  // Create the browser window.

//.workAreaSize
  const {width, height} = (global.WallpaperEngine_mode) ? electron.screen.getPrimaryDisplay().size : {width:160,height:160}

  if (1) {
    mainWindow = new BrowserWindow({icon:__dirname + toLocalPath("\\") + icon_name, width:width, height:height, resizable:false, frame:false, transparent:global.is_transparent, show:false,
webPreferences: webPreferences_default,
    });
    mainWindow.setIgnoreMouseEvents(true)
    mainWindow.loadURL((SA_path && toFileProtocol(SA_path + '\\' + 'SystemAnimator_webkit.html')) || 'file://' + __dirname + '/index.html');
  }
  else {
    mainWindow = new BrowserWindow({icon:__dirname + toLocalPath("\\") + icon_name, width: 1280, height: 720});
    mainWindow.loadURL('https://vladmandic.github.io/human/demo/index.html'); //'https://code.mediapipe.dev/codepen/holistic'); //toFileProtocol("F:\\Programs Portable\\node-webkit\\_TEMP\\test.html"));//
  }

//(SA_path && toFileProtocol(SA_path + '\\' + 'SystemAnimator_webkit.html')) || 'file://' + __dirname + '/index.html');
//toFileProtocol("F:\\Programs Portable\\node-webkit\\AT_SystemAnimator_v8402.gadget\\audio_BPM_detection_portable.html") + "?file=" + encodeURIComponent("C:\\Users\\user\\Desktop\\Youthful Days' Graffiti (Extended Mix).mp3"));
//"http://www.animetheme.com/temp/_tooltip.html");
//toFileProtocol("F:\\Programs Portable\\node-webkit\\_TEMP\\test.html"));

  mainWindow.on("ready-to-show", function () {
    mainWindow.show()

    mainWindow.on("hide", function () {
      webContents.send('window_hidden', true);
    });
    mainWindow.on("minimize", function () {
      webContents.send('window_hidden', true);
    });

    mainWindow.on("show", function () {
      webContents.send('window_hidden', false);
    });
    mainWindow.on("restore", function () {
      webContents.send('window_hidden', false);
    });
  });

  mainWindow.on("close", function () {
    global.electron_as_wallpaper();
  });

  // Open the DevTools.
//  mainWindow.openDevTools();


  webContents = mainWindow.webContents;

// https://www.electronjs.org/docs/breaking-changes#removed-remote-module
// https://www.npmjs.com/package/@electron/remote
if (parseInt(process.versions.electron) >= 14) {
  const e_main = require('@electron/remote/main');
  e_main.initialize();
  e_main.enable(webContents);
}

  webContents.on('new-window', function(event, url){
    event.preventDefault();
    electron.shell.openExternal(url);
  });
  webContents.on('crashed', function () {
    try {
      mainWindow.setAlwaysOnTop(false)
    }
    catch (err) {}

    var options = {type:"question", buttons:["OK", "Cancel"], defaultId:1, message:"ERROR: System Animator has crashed. Press OK to restart, or Cancel to quit."}
    if ((parseInt(process.versions['electron']) >= 6) ? !electron.dialog.showMessageBoxSync(null, options) : !electron.dialog.showMessageBox(null, options)) {
      app.relaunch()
      app.exit(0)
    }
    else {
      mainWindow.close()
    }
  });


  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null;
    webContents = null;
// in case any other window is still open
    app.quit()
  });


// tray and menu
  menu_item_index = {
// 1st level
  'Click-thru': 3
 ,'Always on top': 4
 ,'Stay on desktop': 5
 ,'Auto pause': 6
 ,'Active window': 8
 ,'Media control': 11
 ,'MMD/3D': 12

 ,'Custom': 13

 ,'Show drop area': 14
 ,'DevTools': 17
 ,'Pause/Resume': 18
 ,'Close': 21

// 2nd level
 ,'50% on hover': 4
 ,'Apply to child': 5

 ,'OSC/VMC Protocol': 7

 ,'Send camera data': 2
 ,'Hide 3D Avatar': 5
  };

  var _items;

  contextMenu_opacity = Menu.buildFromTemplate([
    {label: '100%', type: 'radio', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'OPACITY:opacity|1') }}
   ,{label: '75%', type: 'radio',  click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'OPACITY:opacity|0.75') }}
   ,{label: '50%', type: 'radio',  click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'OPACITY:opacity|0.5') }}
   ,{label: '25%', type: 'radio',  click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'OPACITY:opacity|0.25') }}
   ,{label: '50% on hover', type: 'checkbox', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'OPACITY:opacity_on_hover|' + ((menuItem.checked)?0.5:1)) }}
   ,{label: 'Apply to child', type: 'checkbox', click: function (menuItem, browserWindow) {
// a trick to reset the check status
menuItem.checked = !menuItem.checked
webContents.send('tray_menu', 'OPACITY:apply_to_child')
    }}
  ]);

  contextMenu_size = Menu.buildFromTemplate([
    {label: 'x 1', type: 'radio',    click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'SIZE:1') }}
   ,{label: 'x 1.5', type: 'radio',  click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'SIZE:1.5') }}
   ,{label: 'x 2', type: 'radio',    click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'SIZE:2') }}
   ,{label: 'Custom', type: 'radio', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'SIZE:-1') }}
   ,{label: 'Fullscreen', type: 'radio', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'SIZE:fullscreen') }}
  ]);

  contextMenu_media_control = Menu.buildFromTemplate([
    {label: 'Play/Pause', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'MEDIA_CONTROL:Play') }}
   ,{label: 'Stop', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'MEDIA_CONTROL:Stop') }}
   ,{label: 'Seek/Speed-', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'MEDIA_CONTROL:Backward') }}
   ,{label: 'Seek/Speed+', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'MEDIA_CONTROL:Forward') }}
   ,{label: 'Mute/Unmute', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'MEDIA_CONTROL:Sound') }}
  ]);

  contextMenu_MMD_visual_effects_SelfOverlay_color_adjust_RGB = []

  _items = []
  for (var i = 200; i >= 0; i-=25) {
    _items.push({label: i+'%', type: 'radio', click: function () { var p=i/100; return function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:VISUAL_EFFECTS|SelfOverlay|color_adjust|red|' + p) }; }() })
  }
  _items.push({label: 'Custom', type: 'radio', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:VISUAL_EFFECTS|SelfOverlay|color_adjust|red|-1') }})
  contextMenu_MMD_visual_effects_SelfOverlay_color_adjust_RGB[0] = Menu.buildFromTemplate(_items);

  _items = []
  for (var i = 200; i >= 0; i-=25) {
    _items.push({label: i+'%', type: 'radio', click: function () { var p=i/100; return function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:VISUAL_EFFECTS|SelfOverlay|color_adjust|green|' + p) }; }() })
  }
  _items.push({label: 'Custom', type: 'radio', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:VISUAL_EFFECTS|SelfOverlay|color_adjust|green|-1') }})
  contextMenu_MMD_visual_effects_SelfOverlay_color_adjust_RGB[1] = Menu.buildFromTemplate(_items);

  _items = []
  for (var i = 200; i >= 0; i-=25) {
    _items.push({label: i+'%', type: 'radio', click: function () { var p=i/100; return function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:VISUAL_EFFECTS|SelfOverlay|color_adjust|blue|' + p) }; }() })
  }
  _items.push({label: 'Custom', type: 'radio', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:VISUAL_EFFECTS|SelfOverlay|color_adjust|blue|-1') }})
  contextMenu_MMD_visual_effects_SelfOverlay_color_adjust_RGB[2] = Menu.buildFromTemplate(_items);

  contextMenu_MMD_visual_effects_SelfOverlay_color_adjust = Menu.buildFromTemplate([
    {label: 'Red', submenu: contextMenu_MMD_visual_effects_SelfOverlay_color_adjust_RGB[0]}
   ,{label: 'Green', submenu: contextMenu_MMD_visual_effects_SelfOverlay_color_adjust_RGB[1]}
   ,{label: 'Blue', submenu: contextMenu_MMD_visual_effects_SelfOverlay_color_adjust_RGB[2]}
  ]);

  _items = []
  for (var i = 100; i >= 0; i-=10) {
    _items.push({label: i+'%', type: 'radio', click: function () { var p=i/100; return function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:VISUAL_EFFECTS|SelfOverlay|brightness|' + p) }; }() })
  }
  _items.push({label: 'Custom', type: 'radio', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:VISUAL_EFFECTS|SelfOverlay|brightness|-1') }})
  contextMenu_MMD_visual_effects_SelfOverlay_brightness = Menu.buildFromTemplate(_items);

  _items = [{label: 'Use default', type: 'checkbox', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:VISUAL_EFFECTS|SelfOverlay|use_default|' + ((menuItem.checked)?1:0)) }}]
  for (var i = 100; i >= 0; i-=10) {
    _items.push({label: ((i)?i+'%':'OFF'), type: 'radio', click: function () { var p=i/100; return function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:VISUAL_EFFECTS|SelfOverlay|opacity|' + p) }; }() })
  }
  _items.push(
  {label: 'Custom', type: 'radio', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:VISUAL_EFFECTS|SelfOverlay|opacity|-1') }}
 ,{label: 'Brightness', submenu: contextMenu_MMD_visual_effects_SelfOverlay_brightness}
 ,{label: 'Color adjust', submenu: contextMenu_MMD_visual_effects_SelfOverlay_color_adjust}
  );
  contextMenu_MMD_visual_effects_SelfOverlay = Menu.buildFromTemplate(_items);

  _items = [{label: 'Use default', type: 'checkbox', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:VISUAL_EFFECTS|HDR|use_default|' + ((menuItem.checked)?1:0)) }}]
  for (var i = 100; i >= 0; i-=10) {
    _items.push({label: ((i)?i+'%':'OFF'), type: 'radio', click: function () { var p=i/100; return function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:VISUAL_EFFECTS|HDR|opacity|' + p) }; }() })
  }
  _items.push(
  {label: 'Custom', type: 'radio', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:VISUAL_EFFECTS|HDR|opacity|-1') }}
  );
  contextMenu_MMD_visual_effects_HDR = Menu.buildFromTemplate(_items);

  contextMenu_MMD_visual_effects_SeriousShader_shadow_opacity_material_x050 = []
  for (var i = 0; i < 2; i++) {
    contextMenu_MMD_visual_effects_SeriousShader_shadow_opacity_material_x050[i] = Menu.buildFromTemplate([
    ]);
  }

  _items = []
  for (var i = 100; i >= 10; i-=10) {
    _items.push({label: i+'%', type: 'radio', click: function () { var p=i/100; return function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:VISUAL_EFFECTS|SeriousShader|shadow_opacity|' + p) }; }() })
  }
  _items.push(
    {label: 'Custom', type: 'radio', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:VISUAL_EFFECTS|SeriousShader|shadow_opacity|-1') }}
  );
  for (var i = 0; i < 2; i++) {
    _items.push(
      {label: 'Material x 0.5', submenu: contextMenu_MMD_visual_effects_SeriousShader_shadow_opacity_material_x050[i]}
    );
  }
  contextMenu_MMD_visual_effects_SeriousShader_shadow_opacity = Menu.buildFromTemplate(_items);

  _items = []
  for (var i = 130; i >= 90; i-=5) {
    _items.push({label: i/100+'', type: 'radio', click: function () { var p=i/100; return function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:VISUAL_EFFECTS|SeriousShader|OverBright|' + p) }; }() })
  }
  _items.push(
    {label: 'Custom', type: 'radio', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:VISUAL_EFFECTS|SeriousShader|OverBright|-1') }}
  );
  contextMenu_MMD_visual_effects_SeriousShader_OverBright = Menu.buildFromTemplate(_items);

  contextMenu_MMD_visual_effects_SeriousShader = Menu.buildFromTemplate([
    {label: 'Use default', type: 'checkbox', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:VISUAL_EFFECTS|SeriousShader|use_default|' + ((menuItem.checked)?1:0)) }}
   ,{label: 'OFF', type: 'radio', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:VISUAL_EFFECTS|SeriousShader|OFF') }}
   ,{label: 'SeriousShader', type: 'radio', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:VISUAL_EFFECTS|SeriousShader|mode|0') }}
   ,{label: 'AdultS2', type: 'radio', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:VISUAL_EFFECTS|SeriousShader|mode|1') }}
   ,{label: 'AdultS', type: 'radio', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:VISUAL_EFFECTS|SeriousShader|mode|2') }}
   ,{label: 'Shadow opacity', submenu: contextMenu_MMD_visual_effects_SeriousShader_shadow_opacity}
   ,{label: 'OverBright', submenu: contextMenu_MMD_visual_effects_SeriousShader_OverBright}
  ]);

  contextMenu_MMD_visual_effects_PostProcessing_SAO_disabled_by_material = []
  for (var i = 0; i < 2; i++) {
    contextMenu_MMD_visual_effects_PostProcessing_SAO_disabled_by_material[i] = Menu.buildFromTemplate([
    ]);
  }

  _items = [
    {label: 'Enabled', type: 'checkbox', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:VISUAL_EFFECTS|PPE|SAO|' + ((menuItem.checked)?1:0)) }}
  ];
  for (var i = 0; i < 2; i++) {
    _items.push(
      {label: 'Disabled by material', submenu: contextMenu_MMD_visual_effects_PostProcessing_SAO_disabled_by_material[i]}
    );
  }
  contextMenu_MMD_visual_effects_PostProcessing_SAO = Menu.buildFromTemplate(_items);

  contextMenu_MMD_visual_effects_PostProcessing_Diffusion = Menu.buildFromTemplate([
    {label: 'Enabled', type: 'checkbox', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:VISUAL_EFFECTS|PPE|Diffusion|' + ((menuItem.checked)?1:0)) }}
  ]);

  _items = []
  for (var i = 100; i >= 10; i-=10) {
    _items.push({label: i+'%', type: 'radio', click: function () { var p=i/100; return function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:VISUAL_EFFECTS|PPE|BloomPostProcess|blur_size|' + p) }; }() })
  }
  _items.push(
    {label: 'Custom', type: 'radio', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:VISUAL_EFFECTS|PPE|BloomPostProcess|blur_size|-1') }}
  );
  contextMenu_MMD_visual_effects_PostProcessing_BloomPostProcess_blur_size = Menu.buildFromTemplate(_items);

  _items = []
  for (var i = 100; i >= 10; i-=10) {
    _items.push({label: i+'%', type: 'radio', click: function () { var p=i/100; return function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:VISUAL_EFFECTS|PPE|BloomPostProcess|threshold|' + p) }; }() })
  }
  _items.push(
    {label: 'Custom', type: 'radio', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:VISUAL_EFFECTS|PPE|BloomPostProcess|threshold|-1') }}
  );
  contextMenu_MMD_visual_effects_PostProcessing_BloomPostProcess_threshold = Menu.buildFromTemplate(_items);

  _items = []
  for (var i = 100; i >= 10; i-=10) {
    _items.push({label: i+'%', type: 'radio', click: function () { var p=i/100; return function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:VISUAL_EFFECTS|PPE|BloomPostProcess|intensity|' + p) }; }() })
  }
  _items.push(
    {label: 'Custom', type: 'radio', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:VISUAL_EFFECTS|PPE|BloomPostProcess|intensity|-1') }}
  );
  contextMenu_MMD_visual_effects_PostProcessing_BloomPostProcess_intensity = Menu.buildFromTemplate(_items);

  contextMenu_MMD_visual_effects_PostProcessing_BloomPostProcess = Menu.buildFromTemplate([
    {label: 'Enabled', type: 'checkbox', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:VISUAL_EFFECTS|PPE|BloomPostProcess|' + ((menuItem.checked)?1:0)) }}
   ,{label: 'Blur size', submenu: contextMenu_MMD_visual_effects_PostProcessing_BloomPostProcess_blur_size}
   ,{label: 'Threshold', submenu: contextMenu_MMD_visual_effects_PostProcessing_BloomPostProcess_threshold}
   ,{label: 'Intensity', submenu: contextMenu_MMD_visual_effects_PostProcessing_BloomPostProcess_intensity}
  ]);

  contextMenu_MMD_visual_effects_PostProcessing = Menu.buildFromTemplate([
    {label: 'Enabled', type: 'checkbox', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:VISUAL_EFFECTS|PPE|enabled|' + ((menuItem.checked)?1:0)) }}
   ,{label: 'SAO', submenu:contextMenu_MMD_visual_effects_PostProcessing_SAO}
   ,{label: 'Diffusion', submenu:contextMenu_MMD_visual_effects_PostProcessing_Diffusion}
   ,{label: 'Bloom', submenu:contextMenu_MMD_visual_effects_PostProcessing_BloomPostProcess}
  ]);

  contextMenu_MMD_visual_effects_Light_color_RGB = []

  _items = []
  for (var i = 256; i >= 0; i-=16) {
    var _i = Math.min(255, i)
    _items.push({label: _i+'', type: 'radio', click: function () { var dec=_i; return function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:VISUAL_EFFECTS|Light|color|red|' + dec) }; }() })
  }
  _items.push({label: 'Custom', type: 'radio', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:VISUAL_EFFECTS|Light|color|red|-1') }})
  contextMenu_MMD_visual_effects_Light_color_RGB[0] = Menu.buildFromTemplate(_items);

  _items = []
  for (var i = 256; i >= 0; i-=16) {
    var _i = Math.min(255, i)
    _items.push({label: _i+'', type: 'radio', click: function () { var dec=_i; return function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:VISUAL_EFFECTS|Light|color|green|' + dec) }; }() })
  }
  _items.push({label: 'Custom', type: 'radio', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:VISUAL_EFFECTS|Light|color|green|-1') }})
  contextMenu_MMD_visual_effects_Light_color_RGB[1] = Menu.buildFromTemplate(_items);

  _items = []
  for (var i = 256; i >= 0; i-=16) {
    var _i = Math.min(255, i)
    _items.push({label: _i+'', type: 'radio', click: function () { var dec=_i; return function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:VISUAL_EFFECTS|Light|color|blue|' + dec) }; }() })
  }
  _items.push({label: 'Custom', type: 'radio', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:VISUAL_EFFECTS|Light|color|blue|-1') }})
  contextMenu_MMD_visual_effects_Light_color_RGB[2] = Menu.buildFromTemplate(_items);

  contextMenu_MMD_visual_effects_Light_color = Menu.buildFromTemplate([
    {label: 'Red', submenu: contextMenu_MMD_visual_effects_Light_color_RGB[0]}
   ,{label: 'Green', submenu: contextMenu_MMD_visual_effects_Light_color_RGB[1]}
   ,{label: 'Blue', submenu: contextMenu_MMD_visual_effects_Light_color_RGB[2]}
  ]);

  contextMenu_MMD_visual_effects_Light_position_XYZ = []

  _items = []
  for (var i = 100; i >= -100; i-=10) {
    _items.push({label: i/100+'', type: 'radio', click: function () { var v=i/100; return function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:VISUAL_EFFECTS|Light|position|X|' + v) }; }() })
  }
  _items.push({label: 'Custom', type: 'radio', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:VISUAL_EFFECTS|Light|position|X|-99') }})
  contextMenu_MMD_visual_effects_Light_position_XYZ[0] = Menu.buildFromTemplate(_items);

  _items = []
  for (var i = 100; i >= -100; i-=10) {
    _items.push({label: i/100+'', type: 'radio', click: function () { var v=i/100; return function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:VISUAL_EFFECTS|Light|position|Y|' + v) }; }() })
  }
  _items.push({label: 'Custom', type: 'radio', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:VISUAL_EFFECTS|Light|position|Y|-99') }})
  contextMenu_MMD_visual_effects_Light_position_XYZ[1] = Menu.buildFromTemplate(_items);

  _items = []
  for (var i = 100; i >= -100; i-=10) {
    _items.push({label: i/100+'', type: 'radio', click: function () { var v=i/100; return function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:VISUAL_EFFECTS|Light|position|Z|' + v) }; }() })
  }
  _items.push({label: 'Custom', type: 'radio', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:VISUAL_EFFECTS|Light|position|Z|-99') }})
  contextMenu_MMD_visual_effects_Light_position_XYZ[2] = Menu.buildFromTemplate(_items);

  contextMenu_MMD_visual_effects_Light_position = Menu.buildFromTemplate([
    {label: 'X', submenu: contextMenu_MMD_visual_effects_Light_position_XYZ[0]}
   ,{label: 'Y', submenu: contextMenu_MMD_visual_effects_Light_position_XYZ[1]}
   ,{label: 'Z', submenu: contextMenu_MMD_visual_effects_Light_position_XYZ[2]}
  ]);

  contextMenu_MMD_visual_effects_Light = Menu.buildFromTemplate([
    {label: 'Color', submenu: contextMenu_MMD_visual_effects_Light_color}
   ,{label: 'Position', submenu: contextMenu_MMD_visual_effects_Light_position}
   ,{label: 'Reset', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:VISUAL_EFFECTS|Light|reset') }}
  ]);

  _items = []
  for (var i = 100; i >= 0; i-=10) {
    _items.push({label: ((i)?i+'%':'OFF'), type: 'radio', click: function () { var v=i/100; return function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:VISUAL_EFFECTS|Shadow|' + v) }; }() })
  }
  _items.push({label: 'Custom', type: 'radio', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:VISUAL_EFFECTS|Shadow|-99') }})
  contextMenu_MMD_visual_effects_Shadow = Menu.buildFromTemplate(_items);

  contextMenu_MMD_visual_effects = Menu.buildFromTemplate([
    {label: 'SelfOverlay', submenu: contextMenu_MMD_visual_effects_SelfOverlay}
   ,{label: 'HDR', submenu: contextMenu_MMD_visual_effects_HDR}
   ,{label: 'SeriousShader', submenu: contextMenu_MMD_visual_effects_SeriousShader}
   ,{label: 'Load default', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:VISUAL_EFFECTS|load_default') }}
   ,{label: 'Save default', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:VISUAL_EFFECTS|save_default') }}
   ,{label: 'Delete default', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:VISUAL_EFFECTS|delete_default') }}
   ,{type: 'separator'}
   ,{label: 'Light', submenu: contextMenu_MMD_visual_effects_Light}
   ,{label: 'Shadow', submenu: contextMenu_MMD_visual_effects_Shadow}
   ,{label: 'Post-processing', submenu: contextMenu_MMD_visual_effects_PostProcessing}
   ,{type: 'separator'}
   ,{label: 'Reset effects', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:VISUAL_EFFECTS|reset') }}
   ,{label: 'Disable effects', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:VISUAL_EFFECTS|OFF') }}
  ]);

  contextMenu_MMD_model_list = Menu.buildFromTemplate([]);

  contextMenu_MMD_model = Menu.buildFromTemplate([
    {label: 'List saved', submenu: contextMenu_MMD_model_list}
   ,{label: 'Override default', type: 'checkbox', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:MODEL|override_default|' + ((menuItem.checked)?1:0)) }}
  ]);

  contextMenu_MMD_OSC_VMC_app_mode = Menu.buildFromTemplate([
    {label: 'Warudo', type: 'radio', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:OSC_VMC_CLIENT|app_mode|Warudo') }},
    {label: 'VNyan', type: 'radio', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:OSC_VMC_CLIENT|app_mode|VNyan') }},
    {label: 'VNyan(+Z)', type: 'radio', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:OSC_VMC_CLIENT|app_mode|VNyan(+Z)') }},
    {label: 'VSeeFace', type: 'radio', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:OSC_VMC_CLIENT|app_mode|VSeeFace') }},
    {label: 'Others', type: 'radio', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:OSC_VMC_CLIENT|app_mode|Others') }},
  ]);

  contextMenu_MMD_OSC_VMC_client = Menu.buildFromTemplate([
    {label: 'Enabled', type: 'checkbox', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:OSC_VMC_CLIENT|enabled|' + ((menuItem.checked)?1:0)) }}
   ,{type: 'separator'}
   ,{label: 'Send camera data', type: 'checkbox', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:OSC_VMC_CLIENT|send_camera_data|' + ((menuItem.checked)?1:0)) }}
   ,{label: 'App mode', submenu: contextMenu_MMD_OSC_VMC_app_mode}
   ,{type: 'separator'}
   ,{label: 'Hide 3D avatar', type: 'checkbox', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:OSC_VMC_CLIENT|hide_3D_avatar|' + ((menuItem.checked)?1:0)) }}
  ]);

  contextMenu_MMD_OSC_VMC = Menu.buildFromTemplate([
    {label: 'OSC Client (Sender)', submenu: contextMenu_MMD_OSC_VMC_client}
  ]);

  contextMenu_MMD = Menu.buildFromTemplate([
    {label: 'Look at camera', type: 'checkbox',   click: function (menuItem, browserWindow) { if (!menuItem.checked) { contextMenu_MMD.items[1].checked=false }; webContents.send('tray_menu', 'MMD:look_at_camera|' + ((menuItem.checked)?1:0)) }}
   ,{label: 'Look at mouse', type: 'checkbox',    click: function (menuItem, browserWindow) { if  (menuItem.checked) { contextMenu_MMD.items[0].checked=true };  webContents.send('tray_menu', 'MMD:look_at_mouse|' + ((menuItem.checked)?1:0)) }}
   ,{label: 'Trackball camera', type: 'checkbox', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:trackball_camera|' + ((menuItem.checked)?1:0)) }}
   ,{label: 'Random camera', type: 'checkbox', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:random_camera|' + ((menuItem.checked)?1:0)) }}
   ,{label: 'Visual effects', submenu: contextMenu_MMD_visual_effects}
   ,{label: 'Model', submenu: contextMenu_MMD_model}
   ,{type: 'separator'}
   ,{label: 'OSC/VMC Protocol', submenu: contextMenu_MMD_OSC_VMC}

  ]);

  _items = [{label: 'Top', type: 'radio', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'ACTIVE_WINDOW:-1') }}]
  for (var i = 0; i < 10; i++) {
    _items.push({label: 'Child' + (i+1), type: 'radio', click: function () { var v=i; return function (menuItem, browserWindow) { webContents.send('tray_menu', 'ACTIVE_WINDOW:' + v) }; }() })
  }
  _items.push({label: 'Lock child dragging', type: 'checkbox', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'LOCK_CHILD_DRAGGING:' + ((menuItem.checked)?1:0)) }})
  contextMenu_active_window = Menu.buildFromTemplate(_items);

  contextMenu_click_thru = Menu.buildFromTemplate([
    {label: 'Full', type: 'checkbox', click: function (menuItem, browserWindow) { DropArea_hide(menuItem.checked); contextMenu_click_thru.items[1].checked=false; webContents.send('tray_menu', 'CLICK_THRU:1') }}
   ,{label: 'Partial', enabled:global.is_transparent, type: 'checkbox', click: function (menuItem, browserWindow) { contextMenu_click_thru.items[0].checked=false; webContents.send('tray_menu', 'CLICK_THRU_PARTIAL:1') }}
  ]);

  contextMenu_Custom = Menu.buildFromTemplate([]);


  var W8_or_above = windows_mode// && /^(6\.[2-9]|[7-9]|1\d)/.test(require("os").release())

  contextMenu = Menu.buildFromTemplate([
    {label: 'Show gadget', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'SHOW_GADGET:1') }}
   ,{label: 'Hide gadget', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'HIDE_GADGET:1') }}
   ,{type: 'separator'}
   ,{label: 'Click-thru', submenu: contextMenu_click_thru}
   ,{label: 'Always on top', type: 'checkbox', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'ALWAYS_ON_TOP:1') }}
   ,{label: 'Stay on desktop', enabled:W8_or_above, type: 'checkbox', click: function (menuItem, browserWindow) { DropArea_hide(menuItem.checked); webContents.send('tray_menu', 'STAY_ON_DESKTOP:1') }}
   ,{label: 'Auto pause', enabled:W8_or_above, type: 'checkbox', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'AUTO_PAUSE:1') }}
   ,{type: 'separator'}
   ,{label: 'Active window', submenu: contextMenu_active_window}
   ,{label: 'Opacity', submenu: contextMenu_opacity}
   ,{label: 'Size', submenu: contextMenu_size}
   ,{label: 'Media control', submenu: contextMenu_media_control}
   ,{label: 'MMD/3D', submenu: contextMenu_MMD}
   ,{label: 'Custom', submenu: contextMenu_Custom, visible:false}
   ,{label: 'Show drop area', type: 'checkbox', click: function (menuItem, browserWindow) { DropArea_show(menuItem.checked) }}
   ,{label: 'Settings', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'SETTINGS:1') }}
   ,{type: 'separator'}
   ,{label: 'DevTools', click: function () { if (!webContents.isDevToolsOpened()) webContents.openDevTools({mode:((global.WallpaperEngine_mode)?"right":"detach")}) }}
   ,{label: 'Pause/Resume', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'PAUSE_RESUME:1') }}
   ,{label: 'Restart', click: function (menuItem, browserWindow) { webContents.send('tray_menu', 'RESTART:1') }}
   ,{type: 'separator'}
   ,{label: 'Close', click: function () { webContents.send('tray_menu', 'CLOSE:1') }}
  ]);

  tray = new Tray(__dirname + toLocalPath("\\") + icon_name)
  tray.setToolTip('System Animator')

  tray.setContextMenu(contextMenu)
  tray.on('click', function () {
    if (global.WallpaperEngine_mode) {
      contextMenu.popup(mainWindow)
    }
    else
      tray.popUpContextMenu(contextMenu)
  });

  if (linux_mode) {
    contextMenuHost = Menu.buildFromTemplate([
      {label: 'System Animator', submenu:contextMenu}
    ]);
    Menu.setApplicationMenu(contextMenuHost);
  }
//electron.dialog.showMessageBox(null, {type:"question", buttons:["OK", "Cancel"], defaultId:1, message:"999"});
});


let DropArea_window

// define functions as variables (constants in this case), because directly declaring functions here don't seem to work on eval-ed script for some unknown reasons.
const DropArea_hide = function (visible) {
  contextMenu.items[menu_item_index['Show drop area']].enabled = contextMenu_click_thru.items[0].checked || contextMenu.items[menu_item_index['Stay on desktop']].checked
  if (visible || !DropArea_window)
    return

  DropArea_window.close()
}

const DropArea_show = function (visible) {
  if (!visible) {
    DropArea_hide(false)
    return
  }

  contextMenu.items[menu_item_index['Show drop area']].enabled = true

  var win_options = {width:256, height:256, focusable:false, webPreferences:webPreferences_default, resizable:false, frame:false, transparent:true}
  if ('getChildWindows' in mainWindow) {
    win_options.parent = mainWindow
  }
  else {
    win_options.alwaysOnTop = true
  }

  DropArea_window = new BrowserWindow(win_options);
  DropArea_window.loadURL(toFileProtocol(SA_path + "\\drop_area.html"));
  DropArea_window.on('closed', function() {
    contextMenu.items[menu_item_index['Show drop area']].checked = false
    DropArea_window = null
  });
  DropArea_window.webContents.on('did-finish-load', function() {
    var win_pos, win_dim
    if (global.WallpaperEngine_mode) {
// window position can't be set in Wallpaper Engine mode, so the following setup is practically meaningless anyways
      win_pos = [0,0]
      win_dim = electron.screen.getPrimaryDisplay().size
      win_dim = [win_dim.width, win_dim.height]
    }
    else {
      win_pos = mainWindow.getPosition()
      win_dim = mainWindow.getSize()
    }
// parameters must be integers. floats return error.
    DropArea_window.setPosition(Math.max(parseInt(win_pos[0]+(win_dim[0]-256)/2),0), 0/*parseInt(win_pos[1]+(win_dim[1]-256)/2)*/)

    if (!global.WallpaperEngine_mode)
      mainWindow.focus()
  });
}


// global, for remote.getGlobal(name)

const { ipcMain } = require('electron')
ipcMain.on('getGlobal', (event, name, arg1) => {
  switch (name) {
    case "DropArea_drop":
      global[name](arg1)
      break
  }
})

global.is_transparent = true;
global.is_natural_opaque = false;
global.WallpaperEngine_mode = false;

global.electron_as_wallpaper = (function () {
  const e = {};

  let attached;

  let initialized;
  function init() {
    if (initialized) return;
    initialized = true;

    const {attach, detach, refresh} = require('electron-as-wallpaper/node_modules/electron-as-wallpaper/dist/index');
    e.attach = attach;
    e.detach = detach;
    e.refresh = refresh;
  }

  return function (attach) {
    if (!attach && !attached) return;

try {
    init();

    if (attach === true) {
      if (!attached) {
        attached = true;
        e.attach(mainWindow, { transparent:global.is_transparent });
      }
    }
    else if (attach === false) {
      if (attached) {
        attached = false;
        e.detach(mainWindow);
        e.refresh();
      }
    }
    else {
      e.refresh();
    }
} catch (err) {};
  }
})();

global.path_demo = (function () {
  var path_demo, path_demo_by_url

  return function () {
    if (!path_demo) {
      try {
        path_demo = JSON.parse(fs.readFileSync(toLocalPath(SA_path + '\\js\\path_demo.json'), 'utf8'))
      }
      catch (err) {}
//electron.dialog.showErrorBox("",toLocalPath(SA_path + '\\js\\path_demo.json'))
      if (!path_demo) {
        electron.dialog.showMessageBox(null, {type:"question", buttons:["OK", "Cancel"], defaultId:1, message:'ERROR: "path_demo.json" not found/readable/parsable\n'+err });
        return null
      }

      path_demo_by_url = {}
      for (var demo_name in path_demo) {
        path_demo[demo_name] = toLocalPath(SA_path + '\\images\\' + path_demo[demo_name])
        path_demo_by_url[path_demo[demo_name]] = demo_name
      }
    }

    return { path_demo:path_demo, path_demo_by_url:path_demo_by_url }
  }
})()

global.HASH_SHA256 = {
  _hash_cache: {}

 ,hash: function (str) {
var cache = this._hash_cache[str]
if (cache)
  return cache

var hash = require('crypto').createHash('sha256')
hash.update(str)
cache = this._hash_cache[str] = hash.digest('hex')

return cache
  }
}

global.mainWindow_handle = {
  _self_handle: null
 ,get self_handle() {
    if (!this._self_handle) {
      var hWindow_buf = mainWindow.getNativeWindowHandle()
      var hWindow_str = "0x"
      for (var i = hWindow_buf.length-1; i >= 0; i--)
        hWindow_str += hWindow_buf.toString("hex", i,i+1).toUpperCase()
      this._self_handle = hWindow_str
    }
    return this._self_handle
  }
 ,parent_handle: null
}

global.DropArea_drop = function (path) {
  webContents.send("DragDrop", path)
  DropArea_window.close()
}

global.update_tray = function (para) {
  if ("click_thru" in para) {
    contextMenu_click_thru.items[0].checked = para.click_thru
//    contextMenu.items[menu_item_index['Active window']].enabled = para.click_thru
  }
  if ("click_thru_partial" in para) {
    contextMenu_click_thru.items[1].checked = para.click_thru_partial
  }

  if ("always_on_top" in para)
    contextMenu.items[menu_item_index['Always on top']].checked = para.always_on_top

  if ("stay_on_desktop" in para) {
    contextMenu.items[menu_item_index['Stay on desktop']].checked = para.stay_on_desktop
    contextMenu.items[menu_item_index['Click-thru']].enabled = !para.stay_on_desktop// || global.WallpaperEngine_mode
    contextMenu.items[menu_item_index['Always on top']].enabled = !para.stay_on_desktop
    if (para.use_electron_as_wallpaper) {
      contextMenu.items[menu_item_index['Auto pause']].visible = false;
    }
    else {
      contextMenu.items[menu_item_index['Auto pause']].enabled = para.stay_on_desktop;
    }
    contextMenu_opacity.items[menu_item_index['50% on hover']].enabled = !para.stay_on_desktop
  }
  if ("auto_pause" in para)
    contextMenu.items[menu_item_index['Auto pause']].checked = para.auto_pause

  if ("opacity" in para) {
    var index = 0
    if (para.opacity == 0.75)
      index = 1
    else if (para.opacity == 0.5)
      index = 2
    else if (para.opacity == 0.25)
      index = 3
    contextMenu_opacity.items[index].checked = true
  }

  if ("opacity_on_hover" in para)
    contextMenu_opacity.items[menu_item_index['50% on hover']].checked = (para.opacity_on_hover == 0.5)

  if ("apply_to_child" in para) {
    var apply_to_child = contextMenu_opacity.items[menu_item_index['Apply to child']]
    if (para.apply_to_child == null) {
      apply_to_child.enabled = apply_to_child.checked = false
    }
    else {
      apply_to_child.enabled = true
      apply_to_child.checked = para.apply_to_child
    }
  }

  if ("size" in para) {
    var index = 3
    if (para.size == 1)
      index = 0
    else if (para.size == 1.5)
      index = 1
    else if (para.size == 2)
      index = 2
    else if (para.size == -1)
      index = 4
    contextMenu_size.items[index].checked = true
  }

  if ("animation_path" in para)
    tray.setToolTip('System Animator\n' + para.animation_path.replace(/^.+[\/\\]/, ""))

  if ("active_window" in para) {
    for (var i = 0; i < 11; i++) {
      contextMenu_active_window.items[i].visible = para.active_window[i]
    }
    contextMenu_active_window.items[para.active_window_id+1].checked = true
  }

  if ("lock_child_dragging" in para) {
    contextMenu_active_window.items[11].checked = para.lock_child_dragging
    contextMenu_active_window.items[11].enabled = contextMenu_active_window.items[0].checked
  }

  if ("media_control" in para)
    contextMenu.items[menu_item_index['Media control']].enabled = para.media_control && mainWindow.isVisible()

  if ("custom_menu_para" in para) {
    var custom_menu_para = para.custom_menu_para
    var name = custom_menu_para.name
    if (name && (para.active_window_id == -1)) {
      var menu_existed
      for (var i = 0, i_max = contextMenu_Custom.items.length; i < i_max; i++) {
        var menu_item = contextMenu_Custom.items[i]
        if (menu_item.label == name) {
          menu_existed = true
          menu_item.visible = true
        }
        else {
          menu_item.visible = false
        }
      }

      if (!menu_existed) {
        custom_menu_para.menu.forEach(function (menu) {
          if (!menu.click)
            return
          menu.click = (function () {
var click = menu.click
var type  = menu.type
return function (menuItem, browserWindow) {
  var result = "";
  if (type == "checkbox") {
    result = "|" + ((menuItem.checked) ? 1 : 0);
  }
  webContents.send('tray_menu', click + result)
};
          })();
        });

        contextMenu_Custom_submenu_by_name[name] = Menu.buildFromTemplate(custom_menu_para.menu)
        contextMenu_Custom.append(new MenuItem({ label:name, submenu:contextMenu_Custom_submenu_by_name[name] }));
      }
      contextMenu.items[menu_item_index['Custom']].visible = true
//      contextMenu.items[menu_item_index['Custom']].enabled = true
    }
    else {
      contextMenu.items[menu_item_index['Custom']].visible = false
//      contextMenu.items[menu_item_index['Custom']].enabled = false
    }
  }

  if ("custom_menu_status" in para) {
    var custom_menu_status = para.custom_menu_status
    var name = custom_menu_status.name
    for (var i = 0, i_max = contextMenu_Custom.items.length; i < i_max; i++) {
      if (contextMenu_Custom.items[i].label != name)
        continue

      var submenu = contextMenu_Custom_submenu_by_name[name]
      for (var k = 0, k_max = submenu.items.length; k < k_max; k++) {
        var submenu_item = submenu.items[k]
        var sta = custom_menu_status.status[k]
        for (var key_name in sta)
          submenu_item[key_name] = sta[key_name]
      }
      break
    }
  }

  if ("MMD" in para) {
    var _MMD = para.MMD
    contextMenu.items[menu_item_index['MMD/3D']].enabled = !!_MMD
    if (_MMD) {
      contextMenu_MMD.items[0].checked = _MMD.look_at_camera
      contextMenu_MMD.items[1].checked = _MMD.look_at_mouse
      contextMenu_MMD.items[2].checked = _MMD.trackball_camera
      contextMenu_MMD.items[3].checked = _MMD.random_camera && _MMD.random_camera_available
      contextMenu_MMD.items[3].enabled = _MMD.random_camera_available
      contextMenu_MMD.items[5].enabled = !_MMD.use_dungeon;
      contextMenu_MMD_model.items[1].checked = _MMD.override_default_for_external_model

      for (const index of [0,1,2,3,4,5,6,9])
        contextMenu_MMD_visual_effects.items[index].enabled = !_MMD.use_THREEX;

      contextMenu_MMD.items[menu_item_index['OSC/VMC Protocol']].enabled = _MMD.use_THREEX;
      if (_MMD.use_THREEX) {
        contextMenu_MMD_OSC_VMC_client.items[0].checked = _MMD.VMC_sender_enabled;
        contextMenu_MMD_OSC_VMC_client.items[menu_item_index['Send camera data']].checked = _MMD.VMC_send_camera_data;

        const app_mode = [
  'Warudo',
  'VNyan',
  'VNyan(+Z)',
  'VSeeFace',
  'Others',
        ];
        let app_index = app_mode.indexOf(_MMD.VMC_app_mode);
        if (app_index == -1)
          app_index = app_mode.length - 1;
        contextMenu_MMD_OSC_VMC_app_mode.items[app_index].checked = true;

        contextMenu_MMD_OSC_VMC_client.items[menu_item_index['Hide 3D Avatar']].checked = _MMD.VMC_hide_3D_avatar;
      }

      var MME = _MMD.MME
      var mme, opacity, index
      var use_default_count = 0

      var PPE = MME.PostProcessingEffects
      contextMenu_MMD_visual_effects_PostProcessing.items[0].checked = PPE.enabled
      contextMenu_MMD_visual_effects_PostProcessing.items[1].enabled = contextMenu_MMD_visual_effects_PostProcessing.items[2].enabled = PPE.enabled
      contextMenu_MMD_visual_effects_PostProcessing_SAO.items[0].checked = PPE.use_SAO
      contextMenu_MMD_visual_effects_PostProcessing_Diffusion.items[0].checked = PPE.use_Diffusion

      contextMenu_MMD_visual_effects_PostProcessing.items[3].enabled = PPE.enabled && _MMD.use_webgl2
      contextMenu_MMD_visual_effects_PostProcessing_BloomPostProcess.items[0].checked = PPE.use_BloomPostProcess
      contextMenu_MMD_visual_effects_PostProcessing_BloomPostProcess.items[1].enabled = contextMenu_MMD_visual_effects_PostProcessing_BloomPostProcess.items[2].enabled = contextMenu_MMD_visual_effects_PostProcessing_BloomPostProcess.items[3].enabled = PPE.use_BloomPostProcess

      opacity = PPE.use_BloomPostProcess_blur_size
      index = ((opacity * 100) % 10) ? 10 : 10 - ((opacity * 100) / 10)
      contextMenu_MMD_visual_effects_PostProcessing_BloomPostProcess_blur_size.items[index].checked = true

      opacity = PPE.use_BloomPostProcess_threshold
      index = ((opacity * 100) % 10) ? 10 : 10 - ((opacity * 100) / 10)
      contextMenu_MMD_visual_effects_PostProcessing_BloomPostProcess_threshold.items[index].checked = true

      opacity = PPE.use_BloomPostProcess_intensity
      index = ((opacity * 100) % 10) ? 10 : 10 - ((opacity * 100) / 10)
      contextMenu_MMD_visual_effects_PostProcessing_BloomPostProcess_intensity.items[index].checked = true

      for (var i = 0; i < 3; i++) {
        var color = _MMD.light.color[i]
        index = (color == 255) ? 0 : ((color % 16) ? 17 : 16 - (color / 16))
        contextMenu_MMD_visual_effects_Light_color_RGB[i].items[index].checked = true
      }

      for (var i = 0; i < 3; i++) {
        var pos = Math.round(_MMD.light.position[i])
        index = ((pos * 100) % 10) ? 21 : 10 - ((pos * 100) / 10)
        contextMenu_MMD_visual_effects_Light_position_XYZ[i].items[index].checked = true
      }

      var shadow_darkness = Math.round(_MMD.shadow_darkness * 100)
      index = (shadow_darkness % 10) ? 11 : 10-shadow_darkness/10
      contextMenu_MMD_visual_effects_Shadow.items[index].checked = true

      mme = MME.self_overlay
      if (mme.use_default)
        use_default_count++
      contextMenu_MMD_visual_effects_SelfOverlay.items[0].checked = (mme.use_default != false)
      opacity = mme.opacity || 0.5
      if (mme.enabled==false || mme.enabled==0)
        index = 10
      else
        index = ((opacity * 100) % 10) ? 11 : 10 - ((opacity * 100) / 10)
      contextMenu_MMD_visual_effects_SelfOverlay.items[1+index].checked = true

      var brightness = (mme.brightness == null) ? 0.5 : mme.brightness
      index = ((brightness * 100) % 10) ? 11 : 10 - ((brightness * 100) / 10)
      contextMenu_MMD_visual_effects_SelfOverlay_brightness.items[index].checked = true

      var color_adjust = mme.color_adjust || [1.5,1,1]
      for (var i = 0; i < 3; i++) {
        var c = color_adjust[i]
        index = ((c * 100) % 25) ? 9 : 8 - ((c * 100) / 25)
        contextMenu_MMD_visual_effects_SelfOverlay_color_adjust_RGB[i].items[index].checked = true        
      }

      mme = MME.HDR
      if (mme.use_default)
        use_default_count++
      contextMenu_MMD_visual_effects_HDR.items[0].checked = (mme.use_default != false)
      opacity = mme.opacity || 0.5
      if (mme.enabled==false || mme.enabled==0)
        index = 10
      else
        index = ((opacity * 100) % 10) ? 11 : 10 - ((opacity * 100) / 10)
      contextMenu_MMD_visual_effects_HDR.items[1+index].checked = true

      if (_MMD._model_list) {
        MMD_model_list = _MMD._model_list
        var menu_length = contextMenu_MMD_model_list.items.length
        MMD_model_list.forEach(function (obj, idx) {
if (idx < menu_length)
  return

var model_path = obj.path

contextMenu_MMD_model_list.append(
  new MenuItem({
    label: ((idx == 0) ? "Default" : model_path.replace(/^.+[\/\\]/, ""))
   ,type: 'checkbox'
   ,click: function () {
      var path = encodeURIComponent(model_path);
      return function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:MODEL|' + path) };
    }()
  })
);
        });

        MMD_model_list.forEach(function (obj, idx) {
var item = contextMenu_MMD_model_list.items[idx]
item.checked = obj.in_use
item.enabled = !obj.in_use
        });
      }

// material list START
      for (var i = 0; i < 2; i++)
        contextMenu_MMD_visual_effects_SeriousShader_shadow_opacity.items[11+i].visible = false
//webContents.send('tray_menu', 'DEBUG:'+para.active_window)

      var w_id
      var label = _MMD._material_list.join("|")
      if (!MMD_model_material_label || (MMD_model_material_label == label)) {
        MMD_model_material_label = label
        w_id = 0
      }
      else {
        w_id = 1
      }

      var menu = contextMenu_MMD_visual_effects_SeriousShader_shadow_opacity_material_x050[w_id]
      var menu_length = menu.items.length
      contextMenu_MMD_visual_effects_SeriousShader_shadow_opacity.items[11+w_id].visible = true

      MMD_model_material_index = {}
      _MMD._material_list.forEach(function (name, idx) {
MMD_model_material_index[name] = idx

if (idx < menu_length) {
  menu.items[idx].visible = true
  return
}

menu.append(
  new MenuItem({
    label: ((w_id == 0) ? name : 'Material ' + idx)
   ,type: 'checkbox'
   ,click: function () {
      var m_idx = idx;
      return function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:VISUAL_EFFECTS|SeriousShader|shadow_opacity|material_x_0.5|' + m_idx + '|' + ((menuItem.checked)?1:0)) };
    }()
  })
);
      });

      for (var i = _MMD._material_list.length; i < menu_length; i++)
        menu.items[i].visible = false

// contextMenu_MMD_visual_effects_PostProcessing_SAO_disabled_by_material
      for (var i = 0; i < 2; i++)
        contextMenu_MMD_visual_effects_PostProcessing_SAO.items[1+i].visible = false

      menu = contextMenu_MMD_visual_effects_PostProcessing_SAO_disabled_by_material[w_id]
      menu_length = menu.items.length
      contextMenu_MMD_visual_effects_PostProcessing_SAO.items[1+w_id].visible = true

      _MMD._material_list.forEach(function (name, idx) {
if (idx < menu_length) {
  menu.items[idx].visible = true
  return
}

menu.append(
  new MenuItem({
    label: ((w_id == 0) ? name : 'Material ' + idx)
   ,type: 'checkbox'
   ,click: function () {
      var _name = name;
      return function (menuItem, browserWindow) { webContents.send('tray_menu', 'MMD:VISUAL_EFFECTS|PPE|SAO|disabled_by_material|' + _name + '|' + ((menuItem.checked)?1:0)) };
    }()
  })
);
      });
// material list END

      menu = contextMenu_MMD_visual_effects_PostProcessing_SAO_disabled_by_material[w_id]
      menu.items.forEach(function (menuItem) {
menuItem.checked = false
      });
      MME.SAO.disabled_by_material.forEach(function (name) {
var index = MMD_model_material_index[name]
if (index != null)
  menu.items[index].checked = true
      });

      mme = MME.serious_shader
      if (mme.use_default)
        use_default_count++
      contextMenu_MMD_visual_effects_SeriousShader.items[0].checked = (mme.use_default != false)
      if (mme.enabled==false || mme.enabled==0)
        index = 1
      else {
        var mode = (mme.type == "AdultShaderS") ? 2 : ((mme.type == "AdultShaderS2") ? 1 : 0)
        index = mode + 2
      }
      contextMenu_MMD_visual_effects_SeriousShader.items[index].checked = true

      opacity = mme.shadow_opacity || 0.5
      index = ((opacity * 100) % 10) ? 10 : 10 - ((opacity * 100) / 10)
      contextMenu_MMD_visual_effects_SeriousShader_shadow_opacity.items[index].checked = true

      menu = contextMenu_MMD_visual_effects_SeriousShader_shadow_opacity_material_x050[w_id]
      menu.items.forEach(function (menuItem) {
menuItem.checked = false
      });
      if (mme.material) {
        for (var name in mme.material) {
var index = MMD_model_material_index[name]
if (index == null)
  continue
var shadow_opacity_scale = mme.material[name].shadow_opacity_scale
if (shadow_opacity_scale == 0.5)
  menu.items[index].checked = true
        }
      }

      var over_bright = mme.OverBright || ((mme.type == "AdultShaderS2") ? 1.15 : 1.2)
      index = (Math.round(over_bright * 100) % 5) ? 9 : 26 - (Math.round(over_bright * 100) / 5)
      contextMenu_MMD_visual_effects_SeriousShader_OverBright.items[index].checked = true

//      contextMenu_MMD_visual_effects.items[3].enabled = contextMenu_MMD_visual_effects.items[4].enabled = (use_default_count < 3)
//      contextMenu_MMD_visual_effects.items[5].enabled = _MMD.MME_saved

//electron.dialog.showMessageBox(null, {type:"question", buttons:["OK", "Cancel"], defaultId:1, message:""+index});
    }
  }

  if (global.WallpaperEngine_mode) {
    [0,1, menu_item_index['Stay on desktop'],menu_item_index['Auto pause'], menu_item_index['Pause/Resume'], menu_item_index['Close']].forEach(function (index) {
      contextMenu.items[index].enabled = false
    });
  }

  if (!DropArea_window)
    DropArea_hide(false)

  if (linux_mode)
    Menu.setApplicationMenu(contextMenuHost);
}

let capturePage_in_process
global.capturePage = function (x,y) {
  var win_dim = mainWindow.getSize()
  if (capturePage_in_process || (x >= win_dim[0]) || (y >= win_dim[1])) {
    webContents.send('capturePage', 'FAILED')
    return
  }

//var screen_size = electron.screen.getPrimaryDisplay().workAreaSize
  capturePage_in_process = true
  webContents.capturePage({x:x,y:y,width:1,height:1}).then(function(image) {
var buffer = image.getBitmap()
//webContents.send('tray_menu', encodeURIComponent([buffer[0],buffer[1],buffer[2],buffer[3]]) + ':0')
webContents.send('capturePage', 'RESULT|' + [buffer[0],buffer[1],buffer[2],buffer[3]])
// delay to reduce CPU usage
setTimeout(function () {capturePage_in_process = false}, 200)
  });
}

// For backward compatibility only. Use ipcRenderer instead.
// https://www.npmjs.com/package/@electron/remote
// https://www.electronjs.org/docs/latest/api/ipc-renderer
global.mainWindow_postMessage = function (channel, msg) {
  webContents.send(channel, msg)
}

global.relaunch = function (args, execPath) {
  var options = { args:args }
  if (execPath)
    options.execPath = execPath
  app.relaunch(options)
  app.quit()
//  mainWindow.close()
}

global.GetImageSize = function (filename) {
  if (!fs.existsSync(filename))
    return null
  var len = fs.lstatSync(filename).size
  if (len < 24)
    return null

  // Strategy:
  // reading GIF dimensions requires the first 10 bytes of the file
  // reading PNG dimensions requires the first 24 bytes of the file
  // reading JPEG dimensions requires scanning through jpeg chunks
  // In all formats, the file is at least 24 bytes big, so we'll read that always
  var x,y
  var buf = Buffer.alloc(24)//new Buffer(24)//

  var fd = fs.openSync(filename, "r")
  fs.readSync(fd, buf, 0, 24, 0)

  // For JPEGs, we need to read the first 12 bytes of each chunk.
  // We'll read those 12 bytes at buf+2...buf+14, i.e. overwriting the existing buf.
  if ((buf[0]==0xFF && buf[1]==0xD8 && buf[2]==0xFF && buf[3]==0xE0 && buf[6]=='J'.charCodeAt(0) && buf[7]=='F'.charCodeAt(0) && buf[8]=='I'.charCodeAt(0) && buf[9]=='F'.charCodeAt(0)) ||
        (buf[0]==0xFF && buf[1]==0xD8 && buf[2]==0xFF && buf[3]==0xE1 && buf[6]=='E'.charCodeAt(0) && buf[7]=='x'.charCodeAt(0) && buf[8]=='i'.charCodeAt(0) && buf[9]=='f'.charCodeAt(0)))
  {
    var pos=2;
    while (buf[2]==0xFF)
    {
      if (buf[3]==0xC0 || buf[3]==0xC1 || buf[3]==0xC2 || buf[3]==0xC3 || buf[3]==0xC9 || buf[3]==0xCA || buf[3]==0xCB) 
        break;

      pos += 2+(buf[4]<<8)+buf[5];
      if (pos+12>len) break;

      fs.readSync(fd, buf, 2, 12, pos)
    }
  }

  fs.closeSync(fd)

  // JPEG: (first two bytes of buf are first two bytes of the jpeg file; rest of buf is the DCT frame
  if (buf[0]==0xFF && buf[1]==0xD8 && buf[2]==0xFF)
  {
    y = (buf[7]<<8) + buf[8];
    x = (buf[9]<<8) + buf[10];
    return [x,y];
  }

  // GIF: first three bytes say "GIF", next three give version number. Then dimensions
  if (buf[0]=='G'.charCodeAt(0) && buf[1]=='I'.charCodeAt(0) && buf[2]=='F'.charCodeAt(0))
  {
    var x = buf[6] + (buf[7]<<8);
    var y = buf[8] + (buf[9]<<8);
    return [x,y];
  }

  if ( buf[0]==0x89 && buf[1]=='P'.charCodeAt(0) && buf[2]=='N'.charCodeAt(0) && buf[3]=='G'.charCodeAt(0) && buf[4]==0x0D && buf[5]==0x0A && buf[6]==0x1A && buf[7]==0x0A
    && buf[12]=='I'.charCodeAt(0) && buf[13]=='H'.charCodeAt(0) && buf[14]=='D'.charCodeAt(0) && buf[15]=='R'.charCodeAt(0))
  {
    x = (buf[16]<<24) + (buf[17]<<16) + (buf[18]<<8) + (buf[19]<<0);
    y = (buf[20]<<24) + (buf[21]<<16) + (buf[22]<<8) + (buf[23]<<0);
    return [x,y];
  }

  return null
}

})();
