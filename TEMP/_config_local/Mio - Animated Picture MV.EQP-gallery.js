/* Gadget local config (v1.2.0) */
SystemEXT._default._settings = {
"Folder":"demo9",
"EventToMonitor":"SOUND_ALL",
"UpdateInterval":"1",
"Display":"-1",
"UseAudioFFT":"non_default",
"Use32BandSpectrum":"non_default",
"_screenLeft":"100",
"_screenTop":"100",
"LABEL_Folder":"$SA_HTA_folder$",
"SA_docked":"0"
};
if (use_SA_browser_mode) { System.Gadget.Settings._settings = SystemEXT._default._settings; } else if (!System.Gadget.path) { System.Gadget.path = "F:\\Programs Portable\\node-webkit\\AT_SystemAnimator_v0001.gadget"; };
