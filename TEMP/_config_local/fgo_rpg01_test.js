/* Gadget local config (v1.2.0) */
SystemEXT._default._settings = {
"Folder":"$SA_HTA_folder$",
"EventToMonitor":"SOUND_ALL",
"Display":"-1",
"MMDShadow":"0.5",
"Use30FPS":"non_default",
"WallpaperAsBG":"non_default",
"DisableTransparency":"non_default",
"CSSTransformFullscreen":"non_default",
"_screenLeft":"0",
"_screenTop":"0",
"LABEL_Folder":"$SA_HTA_folder$"
};
if (use_SA_browser_mode) { System.Gadget.Settings._settings = SystemEXT._default._settings; } else if (!System.Gadget.path) { System.Gadget.path = "F:\\Programs Portable\\node-webkit\\AT_SystemAnimator_v0001.gadget"; };
