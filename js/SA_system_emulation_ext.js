// System object emultaion - extension
// (2021-11-09)

var xul_mode

var oShell
var Shell_OBJ, FSO_OBJ

var is_SA_child_animation = parent && (parent != self) && !parent.is_chrome_window && parent.SA_child_animation_max;
var SA_topmost_window = (is_SA_child_animation) ? parent : self;
// obsolete, mainly for XUL mode only
var SA_top_window = (xul_mode && !is_SA_child_animation) ? parent : self;

var SystemEXT = {
  _default: {
    gadget_name: "System Animator"
   ,config_folder: ""
   ,HTA_path: "SystemAnimator_ie.hta"
   ,HTA_folder_as_config_folder: true

   ,XUL_path_default: null
   ,XUL_path_user: null

   ,ie_version: null
   ,ff_version: null
  }

 ,_temp_folder: null
 ,GetTempFolder: function () {
if (this._temp_folder)
  return this._temp_folder

try {
  var temp_path = System.Environment.getEnvironmentVariable("TEMP") + toLocalPath('\\_' + this._default.gadget_name + '.tmp');

  if (!FSO_OBJ.FolderExists(temp_path))
    FSO_OBJ.CreateFolder(temp_path)
  this._temp_folder = temp_path

  return this._temp_folder
}
catch (err) {
  alert("ERROR: Failed to create TEMP folder")
}
  }

 ,ReadJS: function (path, parse) {
if (!xul_mode)
  return '<script type="text/javascript" language="javascript" src="' + toFileProtocol(path) + '"></scr'+'ipt>\n'

var file = FileIO.open(path)
if (!file || !file.exists())
  return '\n'

try {
  var txt = FileIO.readText(file)
  txt = txt.replace(/^[^\w\{\(\/]+/, "")

  if (parse) {
    try {
      eval.call(window, txt);
    }
    catch (err) {
return '<script type="text/javascript" language="javascript" src="' + toFileProtocol(path) + '"></scr'+'ipt>\n'
//      parse = false
    }

    if (parse)
      return ""
  }

  var temp_name = path.replace(/\W/g, "_")
  var temp_path = this.GetTempFolder() + toLocalPath('\\' + temp_name + '.js')
  FileIO.write(FileIO.open(temp_path), txt)

  return '<script type="text/javascript" language="javascript" src="' + toFileProtocol(temp_path) + '"></scr'+'ipt>\n'
}
catch (err) {
  return '<script type="text/javascript" language="javascript" src="' + toFileProtocol(path) + '"></scr'+'ipt>\n'
}
  }

 ,GetIEVersion: function () {
if (this._default.ie_version != null)
  return this._default.ie_version

if (!oShell)
  oShell = new ActiveXObject("WScript.Shell");

var version
try { version = oShell.RegRead('HKLM\\Software\\Microsoft\\Internet Explorer\\Version'); } catch (err) {}

this._default.ie_version = (version) ? version : "0.0.0.0";

return this._default.ie_version
  }

 ,GetFirefoxVersion: function () {
if (this._default.ff_version != null)
  return this._default.ff_version

if (!oShell)
  oShell = new ActiveXObject("WScript.Shell");

var version
try { version = oShell.RegRead('HKLM\\Software\\Mozilla\\Mozilla Firefox\\CurrentVersion'); } catch (err) { console.error(err) }

this._default.ff_version = (version) ? version : "0.0.0.0";
console.log(version)
return this._default.ff_version
  }

 ,GetXULPath_USER: function (path) {
if (!FSO_OBJ)
  FSO_OBJ = new ActiveXObject("Scripting.FileSystemObject");

var temp_config_xul_path = System.Gadget.path + toLocalPath('\\TEMP\\_config_xul_path.tmp')
try {
  if (path) {
    var f = FSO_OBJ.OpenTextFile(temp_config_xul_path, 2, true);
    f.Write(path)
    f.Close()
    this._default.XUL_path_user = path
  }
  else if (this._default.XUL_path_user == null) {
    if (FSO_OBJ.FileExists(temp_config_xul_path)) {
      var f = FSO_OBJ.OpenTextFile(temp_config_xul_path, 1);
      this._default.XUL_path_user = f.ReadLine()
      f.Close()
    }
  }
}
catch (err) {}

if (!this._default.XUL_path_user)
  this._default.XUL_path_user = ""

return this._default.XUL_path_user
  }

 ,GetXULPath_DEFAULT: function (path) {
if (!oShell)
  oShell = new ActiveXObject("WScript.Shell");

if (this._default.XUL_path_default == null) {
  var version = this.GetFirefoxVersion()
  if (parseInt(version) >= 4) {
    try { this._default.XUL_path_default = oShell.RegRead('HKLM\\Software\\Mozilla\\Mozilla Firefox\\' + version + '\\Main\\PathToExe'); } catch (err) {}
  }

  if (!this._default.XUL_path_default) {
    if (!FSO_OBJ)
      FSO_OBJ = new ActiveXObject("Scripting.FileSystemObject");

    this._default.XUL_path_default = System.Gadget.path + toLocalPath('\\xulrunner\\xulrunner.exe')
    if (!FSO_OBJ.FileExists(this._default.XUL_path_default))
      this._default.XUL_path_default = ""
  }
}

return this._default.XUL_path_default
  }

 ,GetXULPath: function (path) {
return (this.GetXULPath_USER(path) || this.GetXULPath_DEFAULT(path))
  }

 ,GetWebKitPath_USER: function (path) {
if (!FSO_OBJ)
  FSO_OBJ = new ActiveXObject("Scripting.FileSystemObject");

var path_user = "WebKit_path_user"

var temp_config_webkit_path = System.Gadget.path + toLocalPath('\\TEMP\\_config_webkit_path.tmp')
try {
  if (path) {
    var f = FSO_OBJ.OpenTextFile(temp_config_webkit_path, 2, true);
    f.Write(path)
    f.Close()
    this._default[path_user] = path
  }
  else if (this._default[path_user] == null) {
    if (FSO_OBJ.FileExists(temp_config_webkit_path)) {
      var f = FSO_OBJ.OpenTextFile(temp_config_webkit_path, 1);
      this._default[path_user] = f.ReadLine()
      f.Close()
    }
  }
}
catch (err) {}

if (!this._default[path_user])
  this._default[path_user] = ""

return this._default[path_user]
  }

 ,GetWebKitPath_DEFAULT: function (path) {
if (!FSO_OBJ)
  FSO_OBJ = new ActiveXObject("Scripting.FileSystemObject");

var path_default = "WebKit_path_default";
if (!(path_default in this._default))
  this._default[path_default] = webkit_path;

if (path && (path != this._default[path_default])) {
  this._default[path_default] = null
}

if ((this._default[path_default] == null) && webkit_electron_mode) {
  let registered
  try {
    registered = webkit_electron_remote.app.isDefaultProtocolClient("system-animator")
  }
  catch (err) {}
  if (registered)
    this._default[path_default] = webkit_path
}

if (this._default[path_default] == null) {
  var SA_parent = System.Gadget.path.replace(/[\/\\][^\/\\]+$/, "")
  this._default[path_default] = SA_parent + toLocalPath('\\electron.exe')
  if (!FSO_OBJ.FileExists(this._default[path_default])) {
    try {
      var NW_list = []
      var EE_list = []

      var f = FSO_OBJ.OpenTextFile(System.Gadget.path + '\\config_webkit_path_default.txt', 1);
      while (!f.AtEndOfStream) {
        var p = f.ReadLine()
        if (!/\.exe$/i.test(p))
          continue
        var list = (/electron/i.test(p)) ? EE_list : NW_list
        if (path && (path == SA_parent + toLocalPath('\\' + p))) {
          list.unshift(p)
        }
        else {
          list.push(p)
        }
      }
      var path_list = (webkit_nwjs_mode) ? NW_list.concat(EE_list) : EE_list.concat(NW_list)
      f.Close()

      for (var i = 0, i_max = path_list.length; i < i_max; i++) {
        this._default[path_default] = SA_parent + toLocalPath('\\' + path_list[i])
        if (FSO_OBJ.FileExists(this._default[path_default]))
          break
        this._default[path_default] = ""
      }
    } catch (err) {}
  }
}

return this._default[path_default] || path || webkit_path || ""
  }

 ,GetWebKitPath: function (path) {
return (this.GetWebKitPath_USER(null) || this.GetWebKitPath_DEFAULT(path))
  }

 ,CheckGadgetJS: function (gadget_path) {
if (!gadget_path)
  gadget_path = '"' + System.Gadget.path + '"'

var rn = '\r\n'
var js_check_gadget =
  'var hta = ' + gadget_path + ';' + rn
+ rn
+ 'try {' + rn
+ 'var gadget_found;' + rn
+ 'var fso = new ActiveXObject("Scripting.FileSystemObject");' + rn
+ 'var oShell = new ActiveXObject("Shell.Application");' + rn
+ 'gadget_found = fso.FolderExists(hta);' + rn
+ 'if (!gadget_found) {' + rn
+ '  var f_obj = oShell.NameSpace(hta.replace(/[\/\\][^\/\\]+$/, "")).Items();' + rn
+ '  for (var i = 0; i < f_obj.Count; i++) {' + rn
+ '    hta = f_obj.Item(i).Path;' + rn
+ '    if (!fso.FileExists(hta + "\\" + "' + this._default.HTA_path + '")) continue;' + rn
+ '    gadget_found = true;' + rn
+ '    WScript.Echo("Gadget version updated!");' + rn
+ '    break;' + rn
+ '  }' + rn
+ '}' + rn
+ '}' + rn
+ 'catch (err) {};' + rn
+ 'if (!gadget_found) {' + rn
+ '  WScript.Echo("Error: Gadget not found");' + rn
+ '  WScript.Quit();' + rn
+ '};' + rn

return js_check_gadget
  }

 ,CheckXULJS: function () {
var rn = '\r\n'
var js =
  'var XUL_path;' + rn
+ 'var temp_config_xul_path = hta + "\\TEMP\\_config_xul_path.tmp";' + rn
+ 'if (fso.FileExists(temp_config_xul_path)) {' + rn
+ '  var temp_file = fso.OpenTextFile(temp_config_xul_path, 1);' + rn
+ '  XUL_path = temp_file.ReadLine();' + rn
+ '  temp_file.Close();' + rn
+ '}' + rn
+ rn
+ 'if (!XUL_path || !fso.FileExists(XUL_path)) {' + rn
+ '  XUL_path = "' + this.GetXULPath_DEFAULT() + '";' + rn
+ '  if (!XUL_path || !fso.FileExists(XUL_path)) {' + rn
+ '    XUL_path = hta + "\\xulrunner\\xulrunner.exe";' + rn
+ '    if (!fso.FileExists(XUL_path)) {' + rn
+ '      WScript.Echo("Error: Firefox/XULRunner not found");' + rn
+ '      WScript.Quit();' + rn
+ '    }' + rn
+ '  }' + rn
+ '}' + rn

return js
  }

 ,CheckWebKitJS: function () {
var rn = '\r\n'
var js =
  'var WebKit_path;' + rn
+ 'var temp_config_webkit_path = hta + "\\TEMP\\_config_webkit_path.tmp";' + rn
+ 'if (fso.FileExists(temp_config_webkit_path)) {' + rn
+ '  var temp_file = fso.OpenTextFile(temp_config_webkit_path, 1);' + rn
+ '  WebKit_path = temp_file.ReadLine();' + rn
+ '  temp_file.Close();' + rn
+ '}' + rn
+ rn
+ 'if (!WebKit_path || !fso.FileExists(WebKit_path)) {' + rn
+ '  WebKit_path = "' + this.GetWebKitPath_DEFAULT() + '";' + rn
+ '  if (!WebKit_path || !fso.FileExists(WebKit_path)) {' + rn
+ '    WebKit_path = hta + "\\node-webkit\\nw.exe";' + rn
+ '    if (!fso.FileExists(WebKit_path)) {' + rn
+ '      WScript.Echo(\'Error: Electron/NW.js not found\');' + rn
+ '      WScript.Quit();' + rn
+ '    }' + rn
+ '  }' + rn
+ '}' + rn

return js
  }

 ,CreateShortcut: function (para) {
var _null = (xul_mode || webkit_mode) ? "null" : ""
for (var i = 2; i <= 4; i++) {
  if (!para[i])
    para[i] = _null
}

if (xul_mode) {
  XPCOM_object["Shell.Application"]._run(System.Gadget.path + '\\js\\SA_xul_create_shortcut.js', encodeURIComponent(para[0])+' '+encodeURIComponent(para[1])+' '+encodeURIComponent(para[2])+' '+encodeURIComponent(para[3])+' '+encodeURIComponent(para[4]), true, true)
}
else if (webkit_mode) {
  WebKit_object["Shell.Application"]._run(System.Gadget.path + '\\js\\SA_xul_create_shortcut.js', encodeURIComponent(para[0])+' '+encodeURIComponent(para[1])+' '+encodeURIComponent(para[2])+' '+encodeURIComponent(para[3])+' '+encodeURIComponent(para[4]), null, true)
}
else {
  shortcut = oShell.CreateShortcut(para[1])
  shortcut.TargetPath = para[0]
  shortcut.WorkingDirectory = para[2]
  shortcut.Arguments = para[3]
  shortcut.IconLocation = para[4]
  shortcut.Save()
}
  }

 ,SaveLocalSettings: function (saved_settings, cf, cf_full) {
function electronRegisterCheck() {
  if (!webkit_electron_mode || linux_mode)
    return false

  var registered
  try {
    registered = webkit_electron_remote.app.isDefaultProtocolClient("system-animator")
  }
  catch (err) {}

  return registered
}

if (!cf) {
  cf = this._default.config_folder
  cf_full = this._default.config_folder_full
}

if (!cf && (this._save_settings_only || !this._default.HTA_path)) {
  //for other gadgets
  cf = System.Gadget.path
}
/*
else if (cf.indexOf(System.Gadget.path) != -1)
  return
*/

try {
if (!FSO_OBJ)
  FSO_OBJ = new ActiveXObject("Scripting.FileSystemObject");

var config_folder = (cf) ? toLocalPath(cf + '\\') : ''

var rn = '\r\n'

var WScript_folder = 'WScript.ScriptFullName.replace(/[\/\\][^\/\\]+$/, "")'
var gadget_path
if (this._default.HTA_folder_as_config_folder && (cf || self.SA_HTA_folder)) {
  var _cf = (cf) ? cf : SA_HTA_folder
  if (System.Gadget.path.indexOf(_cf) == 0) {
    gadget_path = System.Gadget.path
    gadget_path = WScript_folder + ' + "' + gadget_path.substr(_cf.length, gadget_path.length) + '"'
  }
  else if (System.Gadget._path_folder() == _cf.replace(/[\/\\][^\/\\]+$/, "")) {
    gadget_path = WScript_folder + '.replace(/[\/\\][^\/\\]+$/, "")' + ' + ' + '"\\' + System.Gadget.path.replace(/^.+[\/\\]/, "") + '"'
  }
}
if (!gadget_path)
  gadget_path = '"' + System.Gadget.path + '"'

var js

var SA_demo = (self.path_demo_by_url && path_demo_by_url[cf]) || (cf.indexOf(System.Gadget.path) != -1)
var use_config_local = webkit_mode && cf_full && (cf != cf_full)

if (saved_settings) {
  js =
  '/* Gadget local config (v1.2.0) */' + rn
+ ((use_config_local) ? '/* ' + cf_full + ' */' + rn : '')
+ 'SystemEXT._default._settings = {' + rn
+ saved_settings.join(',\r\n') + rn
+ '};' + rn
+ 'if (use_SA_browser_mode) { System.Gadget.Settings._settings = SystemEXT._default._settings; } else if (!System.Gadget.path) { System.Gadget.path = ' + gadget_path + '; };' + rn

  js = js.replace(/\\/g, "\\\\");

  var c_js = (SA_demo) ? System.Gadget.path + toLocalPath('\\TEMP\\_config_local\\' + cf.replace(/^.+[\/\\]/, "") + '.js') : ((use_config_local) ? System.Gadget.path + toLocalPath('\\TEMP\\_config_local\\_SA_' + System._hash_sha256.hash(cf_full) + '.js') : config_folder + '_config_local.js')

  var f = FSO_OBJ.OpenTextFile(c_js, 2, true);
  f.Write(js)
  f.Close()
}

if (SA_demo || use_config_local || this._save_settings_only || !this._default.HTA_path || non_windows_native_mode) {
  return
}

var js_check_gadget_base =
  '/* Gadget HTA/XUL/Chromium launcher JS (v2.0.0) */' + rn
+ 'var f = ' + ((cf) ? ((this._default.HTA_folder_as_config_folder) ? WScript_folder : '"' + cf + '"') : '') + ';' + rn

var js_check_gadget =
  js_check_gadget_base
+ this.CheckGadgetJS(gadget_path)

js =
  js_check_gadget
+ rn
+ 'oShell.ShellExecute(hta + "\\' + this._default.HTA_path + '", \'"\' + f + \'"\');' + rn

js = js.replace(/\\/g, "\\\\");

var script_name = 'Launch ' + this._default.gadget_name
var f = FSO_OBJ.OpenTextFile(config_folder + script_name + '.js', 2, true);
f.Write(js)
f.Close()

var para

var shortcut_path = config_folder + script_name + " - WSH.lnk"
if (SystemEXT.enforce_WSH) {
  para = [
  System.Environment.getEnvironmentVariable("SystemRoot") + toLocalPath("\\System32\\WScript.exe")
 ,shortcut_path
 ,(config_folder) ? config_folder.replace(/\\$/, "") : Settings.f_path_folder
 ,'"' + script_name + '.js"'
  ]

  this.CreateShortcut(para)
}
else {
  if (FSO_OBJ.FileExists(shortcut_path)) {
    try {
      FSO_OBJ.DeleteFile(shortcut_path)
    }
    catch (err) {}
  }
}

// XUL
if (this.GetXULPath()) {
  js =
    js_check_gadget
+ rn
+ this.CheckXULJS()
+ rn
+ 'oShell.ShellExecute(XUL_path, ((/firefox.exe/i.test(XUL_path)) ? "-app " : "") + \'"\' + hta + \'\\_xul_gadget\\application.ini" "\' + f + \'"\');' + rn

  js = js.replace(/\\/g, "\\\\");

  script_name = 'Launch ' + this._default.gadget_name + ' XUL'
  f = FSO_OBJ.OpenTextFile(config_folder + script_name + '.js', 2, true);
  f.Write(js)
  f.Close()

  shortcut_path = config_folder + script_name + " - WSH.lnk"
  if (SystemEXT.enforce_WSH) {
    para = [
  System.Environment.getEnvironmentVariable("SystemRoot") + toLocalPath("\\System32\\WScript.exe")
 ,shortcut_path
 ,(config_folder) ? config_folder.replace(/\\$/, "") : Settings.f_path_folder
 ,'"' + script_name + '.js"'
    ]

    this.CreateShortcut(para)
  }
  else {
    if (FSO_OBJ.FileExists(shortcut_path)) {
      try {
        FSO_OBJ.DeleteFile(shortcut_path)
      }
      catch (err) {}
    }
  }
}

// WebKit
if (this.GetWebKitPath()) {
  if (electronRegisterCheck()) {
    js =
  js_check_gadget_base
+ rn
+ '(new ActiveXObject("Shell.Application")).ShellExecute("system-animator://" + encodeURIComponent(f));' + rn
  }
  else {
    js =
  js_check_gadget
+ rn
+ this.CheckWebKitJS()
+ rn
+ 'oShell.ShellExecute(WebKit_path, \'"\' + hta + \'" "\' + f + \'"\');' + rn
  }

  js = js.replace(/\\/g, "\\\\");

  script_name = 'Launch ' + this._default.gadget_name + ' Chromium'
  f = FSO_OBJ.OpenTextFile(config_folder + script_name + '.js', 2, true);
  f.Write(js)
  f.Close()

  shortcut_path = config_folder + script_name + " - WSH.lnk"
  if (SystemEXT.enforce_WSH) {
    para = [
  System.Environment.getEnvironmentVariable("SystemRoot") + toLocalPath("\\System32\\WScript.exe")
 ,shortcut_path
 ,(config_folder) ? config_folder.replace(/\\$/, "") : Settings.f_path_folder
 ,'"' + script_name + '.js"'
    ]

    this.CreateShortcut(para)
  }
  else {
    if (FSO_OBJ.FileExists(shortcut_path)) {
      try {
        FSO_OBJ.DeleteFile(shortcut_path)
      }
      catch (err) {}
    }
  }
}
}
catch (err) {}
  }
}
