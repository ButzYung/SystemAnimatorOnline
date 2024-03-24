// System Animator core - EXTRA (2024-03-25)

var use_SA_gimage_emulation

var SA_HTA_folder, SA_HTA_folder_parent
var SA_project_JSON
var is_SA_child_animation_host

// moved from SA_system_emulation.js
var use_SA_system_emulation = true
var use_SA_browser_mode

var PC_count_absolute = 0

var xul_mode, webkit_mode

var HTA_use_GPU_acceleration

var oShell
var Shell_OBJ, FSO_OBJ

var is_SA_child_animation = parent && (parent != self) && !parent.is_chrome_window && parent.SA_child_animation_max;
var SA_topmost_window = (is_SA_child_animation) ? parent : self;
// obsolete, mainly for XUL mode only
var SA_top_window = (xul_mode && !is_SA_child_animation) ? parent : self;

var absolute_screen_mode

// for all gadgets
var SA_child_animation_id = 99
var ie9_native = /Trident.[5-9]/i.test(navigator.userAgent)

document.write('<script type="text/javascript" language="javascript" src="js/SA_system_emulation_ext.js"></scr'+'ipt>\n')
if (!self.System) {
  use_SA_system_emulation = true
  document.write('<script type="text/javascript" language="javascript" src="' + ((localhost_mode || (webkit_electron_mode && /AT_SystemAnimator_v0001\.gadget/.test(toLocalPath(self.location.href).replace(/[\/\\][^\/\\]+$/, "")))) ? "_private/js/SA_system_emulation.js" : "js/SA_system_emulation.min.js") + '"></scr'+'ipt>\n')
}
if (WallpaperEngine_CEF_mode && !browser_native_mode) {
  document.write('<script src="js/settings_WE.js"></scr'+'ipt>\n')
}

var path_demo, path_demo_by_url

function SA_load_scripts() {
  if (is_SA_child_animation) {
    path_demo = parent.path_demo
    path_demo_by_url = parent.path_demo_by_url
  }
  else if (webkit_electron_mode) {
    var path_demo_obj = webkit_electron_remote.getGlobal("path_demo")()
    if (!path_demo_obj)
      return

    path_demo = path_demo_obj.path_demo
    path_demo_by_url = path_demo_obj.path_demo_by_url
  }
  else {
    try {
      var file = FSO_OBJ.OpenTextFile(System.Gadget.path + '\\js\\path_demo.json', 1);
      path_demo = JSON.parse(file.ReadAll())
      file.Close()
    }
    catch (err) {
      alert('ERROR: "path_demo.json" not found/readable/parsable')
      return
    }

    path_demo_by_url = {}
    for (var demo_name in path_demo) {
      path_demo[demo_name] = System.Gadget.path + toLocalPath('\\images\\' + path_demo[demo_name])
      path_demo_by_url[path_demo[demo_name]] = demo_name
    }
  }

  var html = ''

  if (use_SA_browser_mode) {
    var params = System._browser.url_search_params = {}
    var _re = /[\?\&](\w+)\=([^\&]+)/g;
    var _str = self.location.search;
    var _result;
    while ((_result = _re.exec(_str)) !== null) {
      params[_result[1]] = _result[2];
    }

    if (self._url_search_params_) {
      params = System._browser.url_search_params = Object.assign(_url_search_params_, params)
    }

    var p
    if (is_SA_child_animation && params.f) {
      SA_HTA_folder = decodeURIComponent(params.f)
      SA_child_animation_id = (params.id && parseInt(params.id)) || 0
    }
    else if ((browser_native_mode && !webkit_window) || params.cmd_line) {
      p = (params.cmd_line && params.cmd_line.split("|")) || ["/TEMP/DEMO/miku01"]
      for (var i = 0; i < p.length; i++)
        p[i] = decodeURIComponent(p[i])
    }
    else if (xul_mode && !is_SA_child_animation) {
      SA_HTA_folder = parent.SA_HTA_folder
      if (parent.enforce_WSH)
        SystemEXT.enforce_WSH = true
    }
    else if (webkit_mode && !is_SA_child_animation) {
//alert(webkit_electron_remote.process.argv.slice(0).join("\n\n"))
// TEST mode for Electron
      if (!WallpaperEngine_CEF_mode || webkit_window)
        p = (!WallpaperEngine_CEF_mode && webkit_nwjs_mode) ? require('nw.gui').App.argv : webkit_electron_remote.process.argv.slice(1)
//console.log(p)
    }
    else if (self.oHTA && oHTA.commandLine) {
      var para = oHTA.commandLine
      if (para && /\.hta"\s+(.+)/.test(para)) {
        p = RegExp.$1.split('" "')
        for (var i = 0, i_length = p.length; i < i_length; i++)
          p[i] = p[i].replace(/"/g, "")
      }
    }

    if (is_SA_child_animation)
      WallpaperEngine_mode = parent.WallpaperEngine_mode

    if (p) {
      if ((p[0] == "-parentHWND") || (webkit_electron_mode && webkit_electron_remote.getGlobal("WallpaperEngine_mode")))
        WallpaperEngine_mode = true

      var wsh_index, hta_index
      wsh_index = hta_index = p.length - 1
      if (p[wsh_index] == "wsh") {
        SystemEXT.enforce_WSH = true
        hta_index -= 1
      }
      if ((hta_index >= 0) && /^(\/|[\w\-]+\:|demo\d+$)/.test(p[hta_index])) {
        SA_HTA_folder = p[hta_index]
        if (/^system-animator\:\/+/.test(SA_HTA_folder))
          SA_HTA_folder = decodeURIComponent(SA_HTA_folder.replace(/^system-animator\:\/+/, "")).replace(/[\/\\]$/, "")
        else if ((browser_native_mode || (self._url_search_params_ && self._url_search_params_.cmd_line)) && /^\//.test(SA_HTA_folder))
          SA_HTA_folder = System.Gadget.path + SA_HTA_folder
        SA_HTA_folder = path_demo[SA_HTA_folder] || SA_HTA_folder
//console.log(SA_HTA_folder, self.location.href)
      }
//console.log(params,p,System.Gadget.path)
//else console.log(p[hta_index])
    }

// settings from localStorage
    var Settings_default_by_path, Settings_by_path, update_LS
    if (WallpaperEngine_CEF_mode) {
// reset corrupted config
//localStorage.Settings_default_by_path=""
//localStorage.Settings_by_path=""
      Settings_default_by_path = localStorage.Settings_default_by_path
      update_LS = false
      if (Settings_default_by_path)
        Settings_default_by_path = JSON.parse(Settings_default_by_path)
      else {
        update_LS = true
        Settings_default_by_path = {}
      }
      if (!Settings_default_by_path[System.Gadget.path]) {
        update_LS = true
// "<ALL>" => System.Gadget.path
        Settings_default_by_path[System.Gadget.path] = {}
      }
      if (update_LS)
        localStorage.Settings_default_by_path = JSON.stringify(Settings_default_by_path)
      for (var s_name in Settings_default_by_path[System.Gadget.path])
        Settings_default._custom_[s_name] = Settings_default_by_path[System.Gadget.path][s_name]
    }

    if ((WallpaperEngine_mode||webkit_electron_mode) && !SA_HTA_folder && !is_SA_child_animation) {
      let fs = SA_require('fs')
      let ani_path = WallpaperEngine_CEF_mode && System.Gadget.Settings.readString("animation_path_default.txt")
//setTimeout('DEBUG_show("' + (WallpaperEngine_CEF_mode && System.Gadget.Settings.readString("animation_path_default.txt")) + '",0,1)',1000)
      if (!ani_path) {
        let animation_path_default = System.Gadget.path + toLocalPath('\\TEMP\\animation_path_default.txt')
        if (fs.existsSync(animation_path_default)) {
          try {
            ani_path = fs.readFileSync(animation_path_default, 'utf8').toString().trim()
          }
          catch (err) {}
        }
      }
      if (ani_path) {
        try {
          if (/^demo\d+$/.test(ani_path)) {
            SA_HTA_folder = path_demo[ani_path]
          }
          else {
            if (!/^[\w\-]+\:/.test(ani_path))
              ani_path = System.Gadget.path + toLocalPath('\\' + ani_path)
            if (fs.existsSync(ani_path + ((WallpaperEngine_CEF_mode)?toLocalPath('\\animate.js'):'')))
              SA_HTA_folder = ani_path
          }
        }
        catch (err) {}
      }
      if (!SA_HTA_folder && WallpaperEngine_mode)
        SA_HTA_folder = path_demo["demo11"]
    }

    if (SA_HTA_folder) {
SA_HTA_folder = toLocalPath(SA_HTA_folder)
var SA_HTA_folder_full = SA_HTA_folder
var isFile = System.Shell.itemFromPath(SA_HTA_folder).isFileSystem
if (isFile) {
  SA_HTA_folder = SA_HTA_folder.replace(/[\/\\][^\/\\]+$/, "")
}

SA_HTA_folder_parent = SA_HTA_folder.replace(/[\/\\][^\/\\]+$/, "")

var p_js = toLocalPath(SA_HTA_folder + '\\SA_project.json')
if (FSO_OBJ.FileExists(p_js)) {
  try {
    var file = FSO_OBJ.OpenTextFile(p_js, 1)
    SA_project_JSON  = JSON.parse(file.ReadAll())
    file.Close()
  }
  catch (err) {console.log(err)}
}
if (!SA_project_JSON)
  SA_project_JSON = {}

is_SA_child_animation_host = !!SA_project_JSON.child_animation_host
if (SA_project_JSON.child_animation_host && !is_SA_child_animation) {
  self.w_max = SA_project_JSON.child_animation_host.width  || screen.width
  self.h_max = SA_project_JSON.child_animation_host.height || screen.height
  self.use_full_fps_registered = true
  Settings_default._custom_.Display = "-1"
  Settings_default._custom_.ChildDragDisabled = "non_default"
  Settings_default._custom_.ChildAnimation0 = encodeURIComponent(SA_HTA_folder) + "|0|0|0|1"

  window.addEventListener('DOMContentLoaded', (event) => {
    SA_fullscreen_stretch_to_cover = true
    document.getElementById("Lbody_host").style.visibility = "hidden"

    window.addEventListener("resize", (function () {
      var w, h;

      return function (e) {
var c0 = document.getElementById("Ichild_animation0")
if (!c0) return

var cw0 = c0.contentWindow
// make sure that System Animator page on child animation has loaded and is DOM-content ready
if (!cw0.System) return
if (c0.contentDocument.readyState == "loading") return
/*
if (!cw0.B_content_width) return

if (!w) w = cw0.B_content_width
if (!h) h = cw0.B_content_height

var cbs0 = cw0.document.body.style

var scale = Math.min(screen.width/w, screen.height/h)
cbs0.pixelWidth  = Math.round(w * scale)
cbs0.pixelHeight = Math.round(h * scale)
cw0.Settings.CSSTransformScale = cw0.SA_zoom = scale
cw0.resize(true)
*/

cw0.Settings.CSSTransformFullscreen = true
cw0.SA_zoom = 1
cw0.resize()//null,null,null, true)
      };
    })());
  });

  SA_project_JSON = {
    child_animation_host: SA_project_JSON.child_animation_host
   ,P2P_network: SA_project_JSON.P2P_network
  };
}
if (SA_project_JSON.child_animation_host && is_SA_child_animation) {
  System._browser.P2P_network = parent.System._browser.P2P_network
}

if (SA_project_JSON.config_default) {
  for (var s_name in SA_project_JSON.config_default)
    Settings_default._custom_[s_name] = SA_project_JSON.config_default[s_name]
}
if (SA_project_JSON.config_excluded) {
  for (var s_name in SA_project_JSON.config_excluded)
    Settings_default._excluded_[s_name] = true
}
if (SA_project_JSON.readme_url)
  self._readme_url_ = SA_project_JSON.readme_url
if (SA_project_JSON.wallpaper_url)
  self.SA_wallpaper_src = SA_project_JSON.wallpaper_url

let c_js;
if (!WallpaperEngine_CEF_mode) {
  if (path_demo_by_url[SA_HTA_folder] || (SA_HTA_folder.indexOf(System.Gadget.path) != -1)) {
    c_js = System.Gadget.path + toLocalPath('\\TEMP\\_config_local\\' + SA_HTA_folder.replace(/^.+[\/\\]/, "") + '.js');
    if (!FSO_OBJ.FileExists(c_js))
      c_js = "";
  }
  else if (webkit_mode && isFile) {
    c_js = System.Gadget.path + toLocalPath('\\TEMP\\_config_local\\_SA_' + System._hash_sha256.hash(SA_HTA_folder_full) + '.js');
    if (!FSO_OBJ.FileExists(c_js))
      c_js = "";
  }

  if (!c_js) {
    c_js = toLocalPath(SA_HTA_folder + '\\_config_local.js');
    if (!FSO_OBJ.FileExists(c_js))
      c_js = "";
  }
}

System.Gadget.Settings._settings_default = {
  "Folder": path_demo_by_url[SA_HTA_folder] || ("$SA_HTA_folder$" + ((SA_HTA_folder_full == SA_HTA_folder) ? "" : encodeURIComponent(SA_HTA_folder_full.substr(SA_HTA_folder.length))))
};

if (c_js) {
  // direct eval for XUL
  html += SystemEXT.ReadJS(c_js, true)
//  html += '<script type="text/javascript" language="javascript" src="' + toFileProtocol(SA_HTA_folder) + '/_config_local.js"></scr'+'ipt>\n'
}
else {
  System.Gadget.Settings._settings = SystemEXT._default._settings = Object.assign({}, System.Gadget.Settings._settings_default);
//alert(System.Gadget.Settings._settings.Folder)

// settings from localStorage
  if (WallpaperEngine_CEF_mode) {
    update_LS = false
    if (!Settings_default_by_path[SA_HTA_folder]) {
      update_LS = true
      Settings_default_by_path[SA_HTA_folder] = {}
    }
    if (update_LS)
      localStorage.Settings_default_by_path = JSON.stringify(Settings_default_by_path)
    for (var s_name in Settings_default_by_path[SA_HTA_folder])
      Settings_default._custom_[s_name] = Settings_default_by_path[SA_HTA_folder][s_name] || Settings_default_by_path[System.Gadget.path][s_name] || ""

    Settings_by_path = localStorage.Settings_by_path
    update_LS = false
    if (Settings_by_path)
      Settings_by_path = JSON.parse(Settings_by_path)
    else {
      update_LS = true
      Settings_by_path = {}
    }
    if (!Settings_by_path[SA_HTA_folder]) {
      update_LS = true
      Settings_by_path[SA_HTA_folder] = {}
    }
    if (update_LS)
      localStorage.Settings_by_path = JSON.stringify(Settings_by_path)
    for (var s_name in Settings_by_path[SA_HTA_folder])
      System.Gadget.Settings._settings[s_name] = SystemEXT._default._settings[s_name] = Settings_by_path[SA_HTA_folder][s_name]
//setTimeout('DEBUG_show("' + (WallpaperEngine_CEF_mode && System.Gadget.Settings.readString("animation_path_default.txt")) + '",0,1)',1000)
  }
}

try {
  var css = System.Shell.itemFromPath(SA_HTA_folder + '\\animate.css')
  if (css)
    html += '<link rel="stylesheet" href="' + ((webkit_mode) ? css.path : toFileProtocol(SA_HTA_folder) + '/animate.css') + '" type="text/css" />\n'
}
catch (err) {}

try {
  if (!SystemEXT.enforce_WSH)
    SystemEXT.enforce_WSH = !!System.Shell.itemFromPath(SA_HTA_folder + '\\Launch System Animator - WSH.lnk')
}
catch (err) {}
    }

    webkit_mode && WebKit_object._init2()

    if (ie9_native)
      getHTAUseGPUAcceleration()
  }
  else {
    var f_config

    try {
      var f = System.Gadget.Settings.readString("Folder") || Settings_default.Folder
      if (/^demo\d+/.test(f)) {
        f_config = null
//System.Shell.itemFromPath(System.Gadget.path + '\\TEMP\\_config_local\\' + path_demo[f].replace(/^.+[\/\\]/, "") + '.js')
      }
      else {
        f_config = System.Shell.itemFromPath(f)
        f_config = System.Shell.itemFromPath(((f_config && f_config.isFolder) ? f : f.replace(/\\[^\\]$/, "")) + '\\_config_local.js')
      }
      if (f_config)
        f_config = f_config.path
    }
    catch (err) { f_config=null; }

    if (f_config) {
      html += '<script type="text/javascript" language="javascript" src="' + toFileProtocol(f_config) + '"></scr'+'ipt>\n'
    }
  }

  if (localhost_mode || (webkit_electron_mode && /AT_SystemAnimator_v0001\.gadget/.test(toLocalPath(self.location.href).replace(/[\/\\][^\/\\]+$/, "")))) {
    html +=
  '<script type="text/javascript" language="javascript" src="js/dragdrop.js"></scr'+'ipt>\n'
+ '<script type="text/javascript" language="javascript" src="js/img_cache.js"></scr'+'ipt>\n'
+ '<script type="text/javascript" language="javascript" src="js/seq.js"></scr'+'ipt>\n'
+ '<script type="text/javascript" language="javascript" src="js/shell_folder.js"></scr'+'ipt>\n'
+ '<script type="text/javascript" language="javascript" src="_private/js/wmi.js"></scr'+'ipt>\n'
  }
  else {
console.log("_core.00.min.js")
    html +=
  '<script type="text/javascript" language="javascript" src="js/_core.00.min.js"></scr'+'ipt>\n'
  }

  if (SA_project_JSON && SA_project_JSON.P2P_network && !is_SA_child_animation) {
console.log("Use PeerJS")
    html +=
  '<script type="text/javascript" language="javascript" src="js/peerjs.min.js"></scr'+'ipt>\n'
  }
  if (SA_project_JSON && SA_project_JSON.P2P_network && ((is_SA_child_animation_host) ? is_SA_child_animation : !is_SA_child_animation)) {
console.log("Use Chatbox")
    html +=
  '<script type="text/javascript" language="javascript" src="js/chatbox.js"></scr'+'ipt>\n'
+ '<script>ChatboxAT.channel = SA_project_JSON.P2P_network.chatbox_channel||0;</scr'+'ipt>\n'
  }

  html +=
  '<script type="text/javascript" language="javascript" src="js/_SA.js"></scr'+'ipt>\n'
+ '<script type="text/javascript" language="javascript" src="js/_SA2.js"></scr'+'ipt>\n'

+ '<script language="javascript" for="WMP_player" event="OpenStateChange(NewState)">\n'
+ 'if (self.WMP)\n'
+ '  WMP.OpenStateChange(NewState)\n'
+ '</scr'+'ipt>\n'

+ '<script language="javascript" for="WMP_player" event="PlayStateChange(NewState)">\n'
+ 'if (self.WMP)\n'
+ '  WMP.PlayStateChange(NewState)\n'
+ '</scr'+'ipt>\n'

  document.write(html)
}

function SA_load_body() {
  var content_html = ""
  if (use_SA_browser_mode) {
    use_SA_gimage_emulation = true
    content_html +=
  '<script>var SA_gimage_skip_document_write=true</scr'+'ipt>\n'
+ '<script type="text/javascript" language="javascript" src="js/SA_gimage_emulation.js"></scr'+'ipt>\n'
+ '<div id="Lgimage_BG" style="position:absolute; top:0px; left:0px"></div>\n'

+ '<div id="Ldebug" style="position:absolute; top:0px; left:0px; color:black; font-size:xx-small; visibility:hidden; background-color:white; padding:3px; border-color:black; border-width:1px; border-style:solid; z-index:9999"></div>\n'

+ '<div id="Lnumpad" style="position:absolute; top:64px; left:0px; z-index:599; visibility:hidden; transform-origin:100% 0%;">\n'
+ '  <div id="Lnumpad_container">\n'
+ '    <div>\n'
+ '      <button class="Lnumpad_button">K</button>\n'
+ '<span id="Lnumpad_row0" style="display:none">\n'
+ '      <button class="Lnumpad_button">/</button>\n'
+ '      <button class="Lnumpad_button">*</button>\n'
+ '      <button class="Lnumpad_button">-</button>\n'
+ '</span>\n'
+ '    </div>\n'
+ '<div id="Lnumpad_rows" style="display:none">\n'
+ '    <div>\n'
+ '      <button class="Lnumpad_button">7</button>\n'
+ '      <button class="Lnumpad_button">8</button>\n'
+ '      <button class="Lnumpad_button">9</button>\n'
+ '      <button class="Lnumpad_button">+</button>\n'
+ '    </div>\n'
+ '    <div>\n'
+ '      <button class="Lnumpad_button">4</button>\n'
+ '      <button class="Lnumpad_button">5</button>\n'
+ '      <button class="Lnumpad_button">6</button>\n'
+ '      <button class="Lnumpad_button">↑</button>\n'
+ '    </div>\n'
+ '    <div>\n'
+ '      <button class="Lnumpad_button">1</button>\n'
+ '      <button class="Lnumpad_button">2</button>\n'
+ '      <button class="Lnumpad_button">3</button>\n'
+ '      <button class="Lnumpad_button">↓</button>\n'
+ '    </div>\n'
+ '	   <div>\n'
+ '      <button class="Lnumpad_button">.</button>\n'
+ '	     <button class="Lnumpad_button">←</button>\n'
+ '	     <button class="Lnumpad_button">→</button>\n'
+ '      <button class="Lnumpad_button">S</button>\n'
//+ '      <button class="Lnumpad_button">⏎</button>\n'
+ '    </div>\n'
+ '	   <div>\n'
+ '      <button class="Lnumpad_button" style="width:80px;max-width:80px;min-width:80px;">J</button>\n'
+ '	     <button class="Lnumpad_button" style="width:80px;max-width:80px;min-width:80px;">0</button>\n'
+ '    </div>\n'
+ '</div>\n'
+ '  </div>\n'
+ '</div>\n'
  }

  content_html +=
  ' <div id="LBG_dummy" style="position:absolute; top:0px; left:0px; background-color:black; display:none; z-index:1"></div>\n'
+ ' <div id="Lmain_obj" style="position:absolute; top:0px; left:0px; z-index:2">\n'
+ '  <div id="L_EV_content" style="position:absolute; top:0px; left:0px"></div>\n'
+ '  <div id="Lmain_animation" style="position:absolute; top:0px; left:0px"></div>\n'
+ '  <div id="L_EV_content2" style="position:absolute; top:0px; left:0px; z-index:99"></div>\n'
+ ' </div>\n'

  content_html +=
  ' <div id="LCPU_main0" class="CPU_bar" style="visibility:hidden; z-index:3">\n'
+ '  <div id="LCPU_main0_content" class="CPU_bar_content">\n'
+ '   <div id="LCPU_main0_up" class="CPU_bar_up"></div>\n'
+ '   <div id="LCPU_main0_down" class="CPU_bar_down"></div>\n'
+ '  </div>\n'
+ ' </div>\n'

  var menu_html = ""
  if (use_SA_system_emulation) {
    menu_html +=
  '<div id="Lbrowse_for_file" style="position:absolute; left:10px; top:10px; height:24px; width:380px; background-color:white; z-index:999; padding:5px; border:2px solid black; visibility:hidden">\n'
+ '<span style="font-family:Arial; font-size:12px">Choose an input file.</span>\n'
+ '<input style="font-family:Arial; font-size:12px; width:150px" id="LBFF_browse" type="file" />\n'
+ '<input style="font-family:Arial; font-size:12px" type="button" value="OK" onclick="if (!LBFF_browse.value) return; Lbrowse_for_file.style.visibility=\'hidden\'; SA_DragDropEMU(LBFF_browse.value)">\n'
+ '<input style="font-family:Arial; font-size:12px" type="button" value="Cancel" onclick="Lbrowse_for_file.style.visibility=\'hidden\'">\n'
+ '</div>\n'

+ '<div id="Lmenu_host" style="position:absolute; top:0px; left:0px;">\n'

+ '<div id="C_media_control" onmousedown="event.stopPropagation();" style="position:absolute; width:150px; height:45px; border:1px solid black; font-family:Symbola; font-size:20px; color:black; background-color:rgba(255,255,255,0.5); z-index:498; visibility:hidden">\n'
+ '<div class="MC_button" style="left:0px"  ><span class="MC_button_s" id="MC_play"     onclick="SL_MC_Play()"     onmouseover="SL_MC_MouseEnter({Name:this.id})">&#x23EF;</span></div>\n'
+ '<div class="MC_button" style="left:30px" ><span class="MC_button_s" id="MC_stop"     onclick="SL_MC_Stop()"     onmouseover="SL_MC_MouseEnter({Name:this.id})">&#x25A0;</span></div>\n'
+ '<div class="MC_button" style="left:60px" ><span class="MC_button_s" id="MC_backward" onclick="SL_MC_Backward()" onmouseover="SL_MC_MouseEnter({Name:this.id})">&#x23EA;</span></div>\n'
+ '<div class="MC_button" style="left:90px" ><span class="MC_button_s" id="MC_forward"  onclick="SL_MC_Forward()"  onmouseover="SL_MC_MouseEnter({Name:this.id})">&#x23E9;</span></div>\n'
+ '<div class="MC_button" style="left:120px"><span class="MC_button_s" id="MC_sound"    onclick="SL_MC_Sound()"    onmouseover="SL_MC_MouseEnter({Name:this.id})">&#x1F50A;</span></div>\n'
+ '<div style="position:absolute; top:30px; left:0px;"><input id="MC_seek" class="MC_button_s" style="width:140px; height:20px;" type="range" min="0" max="100" step="1" value="0" onmouseover="SL_MC_MouseEnter({Name:this.id})" onmousedown="this._update_disabled=true" onmouseup="this._update_disabled=false" onchange="try { if (this._media_obj) { var t=parseInt(this.value)/100*this._media_obj.duration; var mod=(t-this._media_obj.currentTime)/30; if (mod) SL_MC_Seek(mod, true, true); } } catch (err) {}" /></div>\n'
+ '</div>\n'

+ '<div id="Lquick_menu" style="position:absolute; visibility:hidden; background-color:rgba(68,79,91, 0.66); left:2px; width:' + (18*((is_mobile)?2:1)*5+2) + 'px; height:20px; z-index:499; border:1px solid gray; border-radius:5px; transform-origin:0% 50%;">\n'
+ ' <div style="position:absolute; top:1px; left:1px">\n'
+ '  <div id="Lquick_menu_close_button" class="QuickMenu_button" style="left:' + ((is_mobile)?'0px;width:36px;':'0px') + '" onclick="System._browser.confirmClose(true)" title="Close">\n'
//+ '   <img src="images/icon_closing.png" class="QuickMenu_image" />\n'
+ '<span' + ((browser_native_mode)?' style="font-weight:bolder;color:white;line-height:18px;">⟳':'>❌') + '</span>'
+ '  </div>\n'
+ '  <div id="Lquick_menu_settings_button" class="QuickMenu_button" style="left:' + ((is_mobile)?'36px;width:36px;':'18px') + '" onclick="System._browser.onSettings()" title="Settings">\n'
//+ '   <img src="images/icon_setting.png" class="QuickMenu_image" />\n'
+ '<span>⚙️</span>'
+ '  </div>\n'
+ '  <div id="Lquick_menu_folder_button" class="QuickMenu_button" style="left:' + ((is_mobile)?'72px;width:36px;':'36px') + '" onclick="SA_OnFolder()" title="Folder input">\n'
//+ '   <img src="images/icon_folder.png" class="QuickMenu_image" />\n'
+ '<span>📁</span>'
+ '  </div>\n'
+ '  <div class="QuickMenu_button" style="left:' + ((is_mobile)?'108px;width:36px;':'54px') + '" onclick="SA_OnDocument()" title="File input">\n'
//+ '   <img src="images/icon_document.png" class="QuickMenu_image" />\n'
+ '<span>📰</span>'
+ '  </div>\n'
+ '  <div id="Lquick_menu_gallery_button" class="QuickMenu_button" style="left:' + ((is_mobile)?'144px;width:36px;':'72px') + '" onclick="SA_OnGallery()" title="Folder (images) input">\n'
//+ '   <img src="images/icon_gallery.png" class="QuickMenu_image" />\n'
+ '<span>🖼️</span>'
+ '  </div>\n'
+ '  <div id="Lquick_menu_ar_button" class="QuickMenu_button" style="left:' + ((is_mobile)?'144px;width:36px;':'72px') + '" onclick="MMD_SA.WebXR.enter_AR()" title="AR mode">\n'
+ '<span>📱️</span>'
+ '  </div>\n'
+ ' </div>\n'
+ '</div>\n'

+ '<style>\n'
+ '#LbuttonMinimize:hover { background-color:rgba(255,255,255,0.5); }\n'
+ '</style>\n'

+ '<div id="LbuttonTL" style="position:absolute; top:0px; left:0px; cursor:pointer; z-index:599; visibility:hidden;">\n'
+ ' <div id="LbuttonFullscreen" style="position:absolute; top:0px; left:12px; width:10px; height:8px; border-color:rgba(0,0,0,0.75); border-style:solid; border-width:1px; border-top-width:3px; background-color:rgba(255,255,255,0.5)" class="Tooltip_TR" title="Maximize"></div>\n'
+ ' <div id="LbuttonRestore" style="position:absolute; top:0px; left:12px; width:10px; height:8px; visibility:hidden;" class="Tooltip_TR" title="Restore">\n'
+ '  <div style="position:absolute; top:0px; left:3px; width:5px; height:5px; border-color:rgba(0,0,0,0.75); border-style:solid; border-width:1px; border-top-width:2px; background-color:rgba(255,255,255,0.5)"></div>\n'
+ '  <div style="position:absolute; top:3px; left:0px; width:5px; height:5px; border-color:rgba(0,0,0,0.75); border-style:solid; border-width:1px; border-top-width:2px; background-color:rgba(255,255,255,0.5)"></div>\n'
+ ' </div>\n'
+ ' <div id="LbuttonMinimize" style="position:absolute; width:12px; height:12px; top:0px; left:0px" class="Tooltip_TR" title="Minimize">\n'
+ '  <div style="position:absolute; top:0px; left:1px; width:10px; height:8px; border-bottom-color:rgba(0,0,0,0.75); border-bottom-style:solid; border-bottom-width:1px;"></div>\n'
+ ' </div>\n'
+ '</div>\n'

+ '<div id="LbuttonLR" style="position:absolute; top:0px; left:0px; cursor:pointer; z-index:599; visibility:hidden;">\n'
+ ' <div id="LbuttonResize" style="position:absolute; top:0px; left:0px; width:12px; height:12px; font-family:Symbola; font-size:12px; color:rgba(0,0,0,0.75);" class="Tooltip_LR" title="Drag to resize. Double-click to switch to rotation mode.">\n'
+ '  <div style="position:absolute; top:0px; left:0px;">&#x25E4;</div>\n'
+ '  <div style="position:absolute; top:2px; left:2px;">&#x25E2;</div>\n'
+ ' </div>\n'
+ ' <div id="LbuttonRotate" style="position:absolute; top:0px; left:0px; width:12px; height:12px; font-family:Symbola; font-size:12px; color:rgba(0,0,0,0.75); visibility:hidden;" class="Tooltip_LR" title="Drag to rotate. Double-click to switch to resize mode.">&#x25D5;</div>\n'
+ '</div>\n'

+ '</div>\n'

// Lnumpad old

+ '<div id="Ljoystick" style="position:absolute; width:256px; height:256px; top:300px; left:16px; z-index:599; visibility:hidden; transform-origin:0% 50%;"></div>\n'

+ '<script>\n'
+ 'self.Chatbox_Write && self.Chatbox_Write();\n'
+ '</scr'+'ipt>\n'

+ '<script>\n'
//document.getElementById("CB_Lwindow0").left=16; document.getElementById("CB_Lwindow0").bottom=72;
+ 'if (self.Chatbox_Init) window.addEventListener("DOMContentLoaded", (event) => { document.getElementById("CB_Lwindow0").top=32; Chatbox_Init(); });\n'
+ '</scr'+'ipt>\n'

window.addEventListener('DOMContentLoaded', function () {
  function cancel_event(e) {
    e.stopPropagation();
    e.stopImmediatePropagation();
    e.preventDefault();
  }
  Lnumpad.addEventListener("touchstart", cancel_event);
  Lnumpad.addEventListener("touchmove", cancel_event);
  Lnumpad.addEventListener("mousedown", cancel_event);

  var buttons = document.getElementsByClassName("Lnumpad_button")
  var ev_start, ev_end
  if (is_mobile) {
    ev_start = "touchstart"
    ev_end = "touchend"
  }
  else {
    ev_start = "mousedown"
    ev_end = "mouseup"
  }

  for (var i = 0; i < buttons.length; i++) {
    var b = buttons[i]
    if (b.textContent == "K") {
      b.addEventListener(ev_start, function (e) {
System._browser.virtual_numpad_toggle()
      }, true);
      continue
    }

    b.addEventListener(ev_start, function (e) {
System._browser.virtual_numpad(e, 'keydown')
    }, true);
    if (!/[S]/.test(b.textContent)) {
      b.addEventListener(ev_end, function (e) {
System._browser.virtual_numpad(e, 'keyup')
      }, true);
    }
  }
});

    if (use_inline_dialog) {
      menu_html +=
  '<iframe id="Idialog" src="z_blank2.html" frameborder="0" style="position:absolute; z-index:999; visibility:hidden;"></iframe>\n'
    }
  }

  var content3d_disabled = returnBoolean("CSSTransform3DDisabledForContent")

  var html =
  '<div id="LdesktopBG_host" style="position:absolute; top:0px; left:0px; width:100%; height:100%; overflow:hidden; display:none"><div id="LdesktopBG" style="position:absolute; top:0px; left:0px"></div></div>\n'
+ ((!use_SA_browser_mode) ? '<g:background id="BG" style="position:absolute; top:0px; left:0px; background-color:transparent;" />\n' : '')

+ '<div id="Lbody_host" style="position:absolute; top:0px; left:0px; z-index:2;">\n'
// Ldebug old
+ '<div id="Lbody3D_control" style="position:absolute; top:0px; left:0px; z-index:999; width:100%; height:100%; visibility:hidden"></div>\n'

if (content3d_disabled)
  html += content_html

  html +=
  '<div id="Lbody3D" style="position:absolute; top:0px; left:0px; z-index:99"><div id="Lbody3D_camera" style="position:absolute; top:0px; left:0px"><div id="Lbody3D_main" style="position:absolute; top:0px; left:0px"><div id="Lbody3D_navigation" style="position:absolute; top:0px; left:0px">\n'
+ '<div id="Lbody" style="position:absolute; top:0px; left:0px">\n'

if (!content3d_disabled)
  html += content_html

  html +=
  '</div>\n'
+ '</div></div></div></div>\n'
//+ menu_html
+ '</div>\n'
+ menu_html;

  html = html.replace(/title\=/g, "data-title=")

  document.write(html)
}

function SA_load_body2() {
  if (WallpaperEngine_CEF_mode) {
    LbuttonMinimize.style.visibility = "hidden"
//    LbuttonLR.style.display = "none"

    Lquick_menu_folder_button.style.opacity = Lquick_menu_gallery_button.style.opacity = 0.5
    Lquick_menu_folder_button.setAttribute("data-title", "N/A")
    Lquick_menu_gallery_button.setAttribute("data-title", "N/A")
    Lquick_menu_folder_button.onclick = Lquick_menu_gallery_button.onclick = null
    Lquick_menu_settings_button.setAttribute("data-title", "About")
    Lquick_menu_settings_button.onclick = function () {
if (browser_native_mode && /^https?\:/.test(location.href)) {
  window.open(self._readme_url_ || 'https://github.com/ButzYung/SystemAnimatorOnline#readme'); //System.Gadget.path + '/readme.txt')
}
else {
  alert('System Animator Lite (' + System.Gadget.version + ')\n\nhttp://www.animetheme.com/sidebar/')
}
    }
    Lquick_menu_close_button.setAttribute("data-title", "Restart")
    if (is_SA_child_animation && !is_SA_child_animation_host) {
      Lquick_menu_close_button.style.opacity = 0.5
      Lquick_menu_close_button.setAttribute("data-title", "N/A")
      Lquick_menu_close_button.onclick = null
    }
  }

  if (!ie9_mode || is_SA_child_animation)
    return

  for (var i = 0; i < SA_child_animation_max; i++) {
    var f = System.Gadget.Settings.readString("ChildAnimation" + i)
    if (!f)
      continue

    var paras = f.split(/\|/)
    var f = paras[0]
    var x = paras[1]
    var y = paras[2]
    var z = paras[3]
    var opacity = paras[4]
    x = (x) ? parseInt(x) : 10
    y = (y) ? parseInt(y) : 10
    z = (z) ? parseInt(z) : 0
    opacity = (opacity) ? parseFloat(opacity) : 1

    if (/^demo\d+$/.test(f))
      f = path_demo[f]

    var obj = ValidatePath(f)
    if (!obj)
      continue

    var f_folder = (obj.isFolder) ? f : f.replace(/[\/\\][^\/\\]+$/, "");

//    var config_js = ValidatePath(f_folder + '\\_config_local.js') || ValidatePath(System.Gadget.path + '\\TEMP\\_config_local\\' + f_folder.replace(/^.+[\/\\]/, "") + '.js')
//    if (config_js)
      SA_child_animation[i] = { f:f, f_folder:f_folder, x:x, y:y, z:z, opacity:opacity }
  }

  if (webkit_electron_mode)
    System._browser.update_tray()

  for (var i = 0; i < SA_child_animation_max; i++) {
    var ani = SA_child_animation[i]
    if (!ani)
      continue

// use encodeURI instead of encodeURIComponent
    var ds = SA_Generate_IChild(i, System._child_html_filename + "?f=" + encodeURI(ani.f)).style
    ds.left = ani.x + "px"
    ds.top  = ani.y + "px"
    ds.zIndex  = ani.z
    if (ani.opacity < 1)
      ds.opacity = ani.opacity
  }

  try {
    if (ie9_native && !is_SA_child_animation && System.Gadget.Settings.readString("HTALoadSpectrumAnalyser")) {
      var hta

      var f_obj = Shell_OBJ.NameSpace(System.Gadget.path.replace(/[\/\\][^\/\\]+$/, "")).Items();

      for (var i = 0; i < f_obj.Count; i++) {
        hta = f_obj.Item(i).Path + "\\" + "gadget_ie.html";
        if (FSO_OBJ.FileExists(hta))
          break;
      }

      if (hta) {
        var sa = SA_Generate_IChild(99, toFileProtocol(hta + '?SA_update_mode=1'))
        var ds = sa.style
        ds.left = 0
        ds.top  = 0
        ds.visibility = "hidden"
      }
    }
  }
  catch (err) {}
}

var SA_Generate_IChild = (function () {

function e_mouseover(d, e, lvl_limit) {
  if (!d || !lvl_limit)
    return
//DEBUG_show(d.id,0,1)
  if (d.onmouseover) {
    d.onmouseover(e)
    return
  }

  d.style.visibility = "hidden"
  e_mouseover(document.elementFromPoint(e.x, e.y), e, --lvl_limit)
  d.style.visibility = "inherit"
}

return function (id, url, para) {
  var window_name = "Ichild_animation"

  var p = document.getElementById("Lchild_animation_parent")
  if (!p) {
    p = document.createElement("div")
    p.id = "Lchild_animation_parent"
    var ps = p.style
    ps.position = "absolute"
    ps.posTop = ps.posLeft = 0
    ps.zIndex = 50

//    ps.pointerEvents = "none"
    p.onmouseover=function (e) {
Lchild_animation_parent.style.visibility = "hidden"
e_mouseover(document.elementFromPoint(e.x, e.y), e, 5)
Lchild_animation_parent.style.visibility = "inherit"

//this.style.pointerEvents = "none"
    }


    if (returnBoolean("CSSTransformToChildAnimation"))
      Lbody.appendChild(p)
    else
      document.body.appendChild(p)

    System._browser.update_tray({ apply_to_child:returnBoolean("CSSTransformToChildAnimation") })
  }

  url = url + ((/\?/.test(url)) ? "&" : "?") + "id=" + id

  var d = document.getElementById(window_name + id)
  if (d) {
    d.contentWindow.location.replace(url)
    d.style.visibility = "inherit"
    return d
  }

  d = document.createElement("iframe")
  d.id = window_name + id
  d.setAttribute("application", "yes")
  d.frameBorder = 0
  d.style.position = "absolute"
  if (w3c_mode)
    d.style.transition = "opacity 0.5s"
  d.src = url

  // XUL only
  if (xul_mode) {
    d.onmousedown = d.onclick = d.ondblclick = d.onkeydown = d.onmousemove = function (e) { e.stopPropagation() }
  }

  p.appendChild(d)
  return d
};

})();
