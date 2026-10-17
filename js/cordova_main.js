// (2025-08-24)

System._browser.cordova = (()=>{
  let insomnia_state = false;
  let insomnia_busy = false;

  let background_mode_enabled = false;
  let background_mode = false;
  let background_running = false;

  const _cordova = {
    get background_running() { return background_running; },
    set background_running(v) {
background_running = System._browser.hidden = v;
    },

    init: function () {
document.addEventListener('deviceready', ()=>{
  MixedContentMode.AlwaysAllow();

//  init_background_mode();

  System._browser.on_animation_update.add((()=>{
    let state_check_countdown = 0;

    return ()=>{
      if (++state_check_countdown < 60) return;
      state_check_countdown = 0;

      if (!insomnia_busy) {
        let keep_awake = !!(System._browser.camera.mocap_enabled || MMD_SA.OSC.VMC.sender_enabled || MMD_SA_options.Dungeon?.item_base.hand_camera?._mobile_hand_camera.enabled);
        if (insomnia_state != keep_awake) {
          insomnia_state = keep_awake;

          insomnia_busy = true;
          if (insomnia_state) {
            window.plugins.insomnia.keepAwake(
              function() { insomnia_busy = false; console.log('Insomnia success'); },
              function() { insomnia_busy = false; console.error('Insomnia error'); }
            );
          }
          else {
            window.plugins.insomnia.allowSleepAgain(
              function() { insomnia_busy = false; console.log('Insomnia allow sleep success'); },
              function() { insomnia_busy = false; console.error('Insomnia allow sleep error'); }
            );
          }
        }
      }

      if (!background_mode_enabled) return;

      let keep_background = !!(MMD_SA.OSC.VMC.sender_enabled);
      if (background_mode != keep_background) {
        background_mode = keep_background;

        cordova.plugins.backgroundMode.setEnabled(background_mode);
        console.log('Cordova - Background mode: ' + ((background_mode) ? 'ON' : 'OFF'));
      }

// not using background mode for now, as there is no confirmed way to ensure that deviceorientation event works in background
/*
      if (background_running && MMD_SA_options.Dungeon.item_base.hand_camera?._mobile_hand_camera_enabled) {
        const orientation_timestamp = MMD_SA_options.Dungeon.item_base.hand_camera._mobile_hand_camera.orientation_timestamp;
        if (orientation_timestamp && (orientation_timestamp < Date.now() - 1000*5))
          MMD_SA_options.Dungeon.item_base.hand_camera._mobile_hand_camera.restore_deviceorientation();
      }
*/
    };
  })(), 0,0,-1);

  console.log('(Cordova ready)');
}, false);
    },

    init_background_mode: function () {
background_mode_enabled = true;

cordova.plugins.backgroundMode.on('activate', ()=>{
  if (!background_mode) return;

// activate setter
  this.background_running = true;
  console.log('Cordova - Running in background');

  cordova.plugins.backgroundMode.disableWebViewOptimizations(); 
//  cordova.plugins.backgroundMode.disableBatteryOptimizations();
});

// may be necessary for background mode to work
//cordova.plugins.backgroundMode.overrideBackButton();

// prevent app close/crash when entering background mode
cordova.plugins.backgroundMode.setDefaults({ silent: true });

cordova.plugins.backgroundMode.on('deactivate', ()=>{
  if (background_running)
    console.log('Cordova - Returning to foreground');
// activate setter
  this.background_running = false;
});
    },

    requestAnimationFrame: function (func) {
function process() {
  const timestamp = document.timeline.currentTime;
  func(timestamp);
//console.log(999);
}

return (background_running) ? setTimeout(process, 1000/60) : requestAnimationFrame(func);
    },

    request_camera: function () {
// https://www.npmjs.com/package/cordova-plugin-android-permissions
const permissions = cordova.plugins.permissions;

return new Promise((resolve)=>{
  permissions.requestPermission(permissions.CAMERA, (status)=>{
    console.log('CAMERA', status);
    resolve();
  }, ()=>{
    console.error('CAMERA');
    DEBUG_show('ERROR: Camera access failed', 5);
    resolve();
  });
});
    },

    save_file: function (blob, fileName) {
function errorCallback(e) {
  console.error("Failed to write file: " + e.toString());
  DEBUG_show("Failed to write file: " + e.toString(), 10);
}

    // Request file system access
    window.resolveLocalFileSystemURL(
        cordova.file.externalDataDirectory, // Use appropriate directory (e.g., cordova.file.documentsDirectory for iOS)
        function (dirEntry) {
            // Create a file in the directory
            dirEntry.getFile(
                fileName,
                { create: true, exclusive: false },
                function (fileEntry) {
                    // Write the Blob to the file
                    fileEntry.createWriter(function (fileWriter) {
                        fileWriter.onwriteend = function () {
                            DEBUG_show("File saved successfully: " + fileEntry.nativeURL, 10);
                        };
                        fileWriter.onerror = function (e) {
                            errorCallback(e);
                        };
                        fileWriter.write(blob);
                    }, errorCallback);
                },
                errorCallback
            );
        },
        errorCallback
    );

    },
  };

  return _cordova;
})();
