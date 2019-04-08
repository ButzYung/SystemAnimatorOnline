/* Gadget local config (v1.2.0) */
SystemEXT._default._settings = {
"Folder":"demo16",
"EventToMonitor":"SOUND_ALL",
"Display":"-1",
"Use30FPS":"non_default",
"WallpaperAsBG":"non_default",
"CSSTransformFullscreen":"non_default",
"_screenLeft":"256",
"_screenTop":"0",
"LABEL_Folder":"$SA_HTA_folder$"
};
if (use_SA_browser_mode) { System.Gadget.Settings._settings = SystemEXT._default._settings; } else if (!System.Gadget.path) { System.Gadget.path = "F:\\Programs Portable\\node-webkit\\AT_SystemAnimator_v0001.gadget"; };
