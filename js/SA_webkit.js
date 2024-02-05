// Webkit-to-IE emulation
// 2024-02-05

var webkit_mode = true

function SA_require(name) {
  return (webkit_nwjs_mode || WallpaperEngine_CEF_mode) ? require(name) : webkit_electron_remote.require(name)
}

function ActiveXObject(obj_id) {
  var obj = WebKit_object[obj_id]
  return (obj._CONSTRUCTOR) ? new obj._CONSTRUCTOR() : obj
}

var WebKit_object = {
  _init: function () {
WebKit_InitIEDOM()

if (WallpaperEngine_CEF_mode) {
  self.require = (function () {
var module_cache = {}
return function (name) {
  if (name != "fs")
    return {}

  if (name == "fs") {
    if (!module_cache["fs"]) {
      module_cache["fs"] = {
        existsSync: function (path) {
var existed = false
path = System._returnRelativePath(path)

if (browser_native_mode) {
// SA_project.json should always exist for online version
  if (/SA_project\.json/.test(path))
    return true

  var is_SA_relative = (path.indexOf(System.Gadget.path) == 0) || !/^((file|https?|\w)\:|\/)/i.test(path)
  if (SA_project_JSON) {
    var f_path = SA_HTA_folder
    if (f_path.indexOf(System.Gadget.path + "/") == 0)
      f_path = f_path.substr(System.Gadget.path.length+1)
//console.log(f_path+','+path)
    var path_relative = path
    if (path_relative.indexOf(f_path) == 0) {
      path_relative = path_relative.substr(f_path.length)

// testing the animation folder itself, simply return false for folders
      if (!path_relative.length)
        return false

      path_relative = path_relative.substr(1)
      if (SA_project_JSON.folder_list && SA_project_JSON.folder_list.some(function(p){ return ((p.charAt(p.length-1)=="/") ? (path_relative.indexOf(p)==0) : (path_relative==p)); })) {
//        console.log(((is_SA_child_animation)?(SA_child_animation_id+1):0) + ':SA_project_JSON-' + path_relative + ',' + true)
        return true
      }
      else {
        console.error(((is_SA_child_animation)?(SA_child_animation_id+1):0) + ':SA_project_JSON-' + path_relative + ',' + existed)
        return false
      }
    }
    else {
      if (!is_SA_relative || /TEMP[\/\\]SA_wallpaper/.test(path)) {
        console.error(((is_SA_child_animation)?(SA_child_animation_id+1):0) + ':OFF-SA_project_JSON-' + path + ',' + existed)
//console.error(System.Gadget.path)
        return false
      }
// return true for all other files that are within SA itself
//      console.log(((is_SA_child_animation)?(SA_child_animation_id+1):0) + ':OFF-SA_project_JSON-' + path + ',' + true)
      return true
    }
  }
  else {
    if (/\.(css|js|txt|json|bmp|gif|jpg|jpeg|png|wmv|webm|mp4|mkv|wav|mp3|aac|pmx|vmd)$/i.test(path)) {
console.log(((is_SA_child_animation)?(SA_child_animation_id+1):0) + ':PRE-SA_project_JSON-' + path + ',' + true)
      return true
    }
// probably testing the animation folder itself, simply return false for folders
    console.error(((is_SA_child_animation)?(SA_child_animation_id+1):0) + ':PRE-SA_project_JSON-' + path + ',' + existed)
    return false
  }
}

var xhr = new XMLHttpRequest;
try {
  xhr.open("GET", path, false);
// https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/Sending_and_Receiving_Binary_Data
  xhr.overrideMimeType('text\/plain; charset=x-user-defined');
  xhr.send();
  existed = !!xhr.responseText && xhr.responseText.length
}
catch (err) {}
if (!existed) console.error(((is_SA_child_animation)?(SA_child_animation_id+1):0) + ':' + path + ',' + existed)
return existed
        }

       ,readFileSync: function (path, encoding) {
var txt
var xhr = new XMLHttpRequest;
try {
  xhr.open("GET", System._returnRelativePath(path), false);
  xhr.send();
  txt = xhr.responseText
}
catch (err) {}
//console.log(txt)
return (txt || "")
        }

       ,lstatSync: function (path) {
return (function () {
  // assumed to be a folder if AJAX fails here
  var isFile = SA_require('fs').existsSync(path)
  return {
    isFile: function () { return isFile }
   ,isDirectory: function () { return !isFile }
//   ,size: (isFile||0) * 2
  };
})();
        }

       ,readdirSync: function (path) {
var list = SA_project_JSON.folder_list || []
console.log("LIST:"+path)
if (!list.length) {
  if (SA_require('fs').existsSync(toLocalPath(path + '\\animate.js'))) {
    list.push('animate.js')
  }
}
return list
        }

       ,openSync: function (path, mode) {
var txt
var xhr = new XMLHttpRequest;
try {
  xhr.open("GET", System._returnRelativePath(path), false);
  xhr.overrideMimeType('text\/plain; charset=x-user-defined');
  xhr.send();
  txt = xhr.responseText
}
catch (err) {}
//console.log(xhr.response)
return ((txt) ? { text:txt } : null)
        }

       ,readSync: function (fd, buf, offset, length, pos) {
// https://developers.google.com/web/updates/2012/06/How-to-convert-ArrayBuffer-to-and-from-String
// https://developer.mozilla.org/en-US/docs/Web/API/TextEncoder

//var _buf8 = new TextEncoder('utf-16be', { NONSTANDARD_allowLegacyEncoding: true }).encode(fd.text.substr(pos, length));
//var _buf8 = new TextEncoder().encode(fd.text.substr(pos, length))
//console.log(_buf8)

  var _buf = new ArrayBuffer(length*2); // 2 bytes for each char
  var _buf16 = new Uint16Array(_buf);
  for (var i=0; i < length; i++) {
    _buf16[i] = fd.text.charCodeAt(pos+i);
  }

  var _buf8 = new Uint8Array(_buf)
  for (var i = 0; i < length; i++) {
    buf[i+offset] = _buf8[i*2]
  }
//  console.log(_buf8)
//  console.log(buf)
        }

       ,closeSync: function (fd) {
delete fd.text
fd = undefined
        }
      }
    }
  }

  return module_cache["fs"]
};
  })();
}
else if (webkit_electron_mode) {
  window.confirm = function (msg) {
    try { webkit_window.setAlwaysOnTop(false) } catch (err) {}
    var confirmed = !webkit_electron_dialog.showMessageBox(null, {type:"question", buttons:["OK", "Cancel"], defaultId:1, message:msg})
    try { webkit_window.setAlwaysOnTop(SA_topmost_window.returnBoolean("AutoItAlwaysOnTop")) } catch (err) {}
    return confirmed
  }
}
else {
  var _confirm = window.confirm
  window.confirm = function (msg) {
    try { webkit_window.setAlwaysOnTop(false) } catch (err) {}
    var confirmed = _confirm(msg) 
    try { webkit_window.setAlwaysOnTop(SA_topmost_window.returnBoolean("AutoItAlwaysOnTop")) } catch (err) {}
    return confirmed
  }
}
  }

 ,_init2: function () {
try {
  Object.defineProperty(screen, "_width",  Object.getOwnPropertyDescriptor(screen.constructor.prototype, "width"));
  Object.defineProperty(screen, "_height", Object.getOwnPropertyDescriptor(screen.constructor.prototype, "height"));
}
catch (err) {
  console.error(err)
}

if (WallpaperEngine_CEF_mode && (browser_native_mode && !webkit_window)) {
  Object.defineProperty(screen, "width", {
  get: function () { return SA_topmost_window.innerWidth }
  });
  Object.defineProperty(screen, "availWidth", {
  get: function () { return SA_topmost_window.innerWidth }
  });
  Object.defineProperty(screen, "height", {
  get: function () { return SA_topmost_window.innerHeight }
  });
  Object.defineProperty(screen, "availHeight", {
  get: function () { return SA_topmost_window.innerHeight }
  });
}
else if (is_SA_child_animation_host && is_SA_child_animation) {
  Object.defineProperty(screen, "width", {
  get: function () { return SA_topmost_window.document.body.style.pixelWidth }
  });
  Object.defineProperty(screen, "availWidth", {
  get: function () { return SA_topmost_window.document.body.style.pixelWidth }
  });
  Object.defineProperty(screen, "height", {
  get: function () { return SA_topmost_window.document.body.style.pixelHeight }
  });
  Object.defineProperty(screen, "availHeight", {
  get: function () { return SA_topmost_window.document.body.style.pixelHeight }
  });
}
  }

// dragdrop START
 ,_dragCancelDefault: function (e) {
e.stopPropagation();
e.preventDefault();
  }

 ,_dragEnter: function (e) {
WebKit_object._dragCancelDefault(e)
  }

 ,_dragExit: function (e) {
WebKit_object._dragCancelDefault(e)
  }

 ,_dragOver: function (e) {
var types = e.dataTransfer.types
if ((types.length == 1) && (types[0] == "text/plain"))
  return

WebKit_object._dragCancelDefault(e)
  }

 ,_drop: function (e) {
WebKit_object._dragCancelDefault(e)

var item
var files = e.dataTransfer.files
//DEBUG_show(e.dataTransfer.getData("URL"))
if (files.length) {
  if (parent.WallpaperEngine_CEF_mode || /\.zip$/i.test(files[0].name)) {
    SA_DragDropEMU(files[0])
    return
  }
  item = new System.Shell._FolderItem(new WebKit_object["Shell.Application"]._FolderItem({path:files[0].path}))
//  DEBUG_show("file/folder:"+item.path)
}
else {
  var url = e.dataTransfer.getData("URL")
//  DEBUG_show("URL:"+url)
  if (DragDrop.accept_URL) {
    DragDrop.onDrop_finish({ url:url })
  }
  else {
    DEBUG_show("URL:"+url, 5)
  }
  return
}

if (DragDrop.validate_func(item))
  DragDrop.onDrop_finish(item)
  }
// END

 ,"Shell.Application": {
    NameSpace: function (path) {
return new this._Folder({path:toLocalPath(path)});
    }

   ,ShellExecute: function (path, para, working_dir, callback) {
return this._run(path, para, working_dir, false, callback);
    }

   ,_run: function (path, para, working_dir, blocking, callback) {
path = toLocalPath(path)
// (START command) http://www.robvanderwoude.com/ntstart.php
var command
if (windows_mode)
  command = (/\.(js|wsf)$/i.test(path)) ? 'wscript ' : (/\.exe$/i.test(path)) ? '' : 'start "" '
else if (linux_mode) {
  var fs = SA_require('fs')
  command = (!fs.existsSync(path) || (fs.lstatSync(path).isFile() && !/\.(\w+)$/.test(path))) ? "" : "xdg-open "
}
command += '"' + path + '"' + ((para) ? ' ' + para : '')

var options = (working_dir) ? {cwd:working_dir} : null

return (blocking) ? this._execSync(command, options) : SA_require('child_process').exec(command, options, callback);
    }

    ,_execSync: function (command, options) {
//console.log(command)
var result = SA_require('child_process').execSync(command, options)
//console.log(result.toString())
return (result && result.toString())
/*
var f, f_org
f = f_org = 'sync' + Math.random();
SA_require('child_process').exec(command+' /low 1>'+f+' 2>&1 & ren '+f+' '+f+'_', options);

var fs = SA_require('fs');
var exists = fs.existsSync;
f += '_';
var time = Date.now();
while (!exists(f)) {
  if (Date.now() > time + 10*1000)
    break
}

if (exists(f)) {
  var output = fs.readFileSync(f, 'utf8');
  fs.unlinkSync(f);
  return output;
}

if (exists(f_org)) {
  fs.unlinkSync(f_org);
  return null;
}
*/
    }

   ,BrowseForFolder: function (hwnd, title, iOptions) {
var url = "SystemAnimator_browse.html?title=" + encodeURIComponent(title)
if (use_inline_dialog) {
  if (document.getElementById("Idialog").style.visibility == "hidden") {
    document.getElementById("Idialog").contentWindow.location.replace(url)
  }
  return true
}

var v = showModalDialog(url)
v = (xul_mode || webkit_mode) ? self.returnValue : v

return (v) ? new this._Folder({path:v}) : null;
    }

   ,folder_scan_depth: 2
   ,_FolderItem: function (obj) {
if (!this._constructor_initialized) {
  this.constructor.prototype._constructor_initialized = true

  this.constructor.prototype.ExtendedProperty = function (name) {
var path = this.obj.path;

//general case
if (name != "Dimensions") {
  if (non_windows_native_mode)
    return ""

  var js_path = System.Gadget.path + toLocalPath('\\js\\SA_extendedproperty.js');
  var temp_path = oShell.ExpandEnvironmentStrings("%TEMP%");
  var temp_filename = path.replace(/^.+[\/\\]/, '').replace(/\s/g, "_") + ("_" + Date.now()) + ("-" + Math.random()).replace(/0\./, "");

  WebKit_object["Shell.Application"]._run(js_path, encodeURIComponent(temp_filename) + " " + encodeURIComponent(path) + " " + encodeURIComponent(name), null, true);

  temp_path += toLocalPath('\\' + temp_filename + '.txt');
  var result
  try {
    var fs = SA_require('fs')
    if (fs.existsSync(temp_path)) {
      result = fs.readFileSync(temp_path)
      fs.unlinkSync(temp_path)
    }
  }
  catch (err) {}

  return result
}

//"Dimensions"
var dim = GetImageSize(path)
return ((dim) ? dim.join("x") : "130x130")
  }

  Object.defineProperty(this.constructor.prototype, "_stats",
{
  get: function() {
var stats
if (this.obj.file) {
  stats = {
    isDirectory: function () { return false }
   ,isFile: function () { return true }
  }
}
else {
  stats = this.obj.stats
  if (!stats)
    stats = this.obj.stats = SA_require('fs').lstatSync(this.obj.path)
}
return stats
  }
});

  Object.defineProperty(this.constructor.prototype, "ModifyDate",
{
  get: function() {
return this._stats.mtime;
  }

 ,set: function(timestamp) {
var d = new Date(timestamp)
SA_require('fs').utimesSync(this.obj.path, d, d)
  }
});

  Object.defineProperty(this.constructor.prototype, "IsFolder",
{
  get: function() {
return this._stats.isDirectory();
  }
});

  Object.defineProperty(this.constructor.prototype, "IsFileSystem",
{
  get: function() {
return this._stats.isFile();
  }
});

  Object.defineProperty(this.constructor.prototype, "IsLink",
{
  get: function() {
return /\.lnk$/i.test(this.obj.path);
  }
});

  Object.defineProperty(this.constructor.prototype, "GetLink",
{
  get: function() {
var path = this.obj.path;

var link_target
var list = WebKit_object._link_target_list
if (list) {
  for (var i = 0; i < list.length; i++) {
    var target = list[i][encodeURIComponent(path)]
    if (target) {
      link_target = target
      break
    }
  }
}
else {
  list = WebKit_object._link_target_list = []
}

var temp_file

if (!link_target) {
  var js_path = System.Gadget.path + toLocalPath('\\js\\SA_xul_link_target.js');
  var temp_path = oShell.ExpandEnvironmentStrings("%TEMP%"); //js_path.replace(/[\/\\][^\/\\]+$/, '\\TEMP');
  var temp_filename = path.replace(/^.+[\/\\]/, '').replace(/\s/g, "_") + ("_" + Date.now()) + ("-" + Math.random()).replace(/0\./, "");
  WebKit_object["Shell.Application"]._run(js_path, encodeURIComponent(temp_filename) + " " + encodeURIComponent(path.replace(/[\/\\][^\/\\]+$/, "")+'|'+WebKit_object["Shell.Application"].folder_scan_depth), null, true);

  temp_path += toLocalPath('\\' + temp_filename + '.txt')
  try {
    var fs = SA_require('fs')
    if (fs.existsSync(temp_path)) {
      var txt = fs.readFileSync(temp_path)
      fs.unlinkSync(temp_path)
      if (txt) {
        list.push(JSON.parse(txt))
        link_target = list[list.length-1][encodeURIComponent(path)]
      }
    }
  }
  catch (err) {}
}

link_target = (link_target) ? decodeURIComponent(link_target) : path

return new WebKit_object["Shell.Application"]._FolderItem({path:link_target});
  }
});

  Object.defineProperty(this.constructor.prototype, "Type",
{
  get: function() {
return (this.IsFileSystem) ? "File" : "Folder";
  }
});

  Object.defineProperty(this.constructor.prototype, "GetFolder",
{
  get: function() {
return new WebKit_object["Shell.Application"]._Folder(this.obj);
  }
});
}

//main
this.obj = obj
this.Path = obj.path
    }

   ,_Folder: function (obj) {
if (!this._constructor_initialized) {
  this.constructor.prototype._constructor_initialized = true

  this.constructor.prototype.ParseName = function (name) {
var path = this.obj.path + toLocalPath('\\') + name;
// AJAX fails in WallpaperEngine_CEF_mode if the path is a folder. Return an object as usual if it is not a known file.
return ((WallpaperEngine_CEF_mode && !/\.(css|js|txt|json|bmp|gif|jpg|jpeg|png|wmv|webm|mp4|mkv|wav|mp3|aac|pmx|vmd)$/i.test(name)) || SA_require('fs').existsSync(path)) ? new WebKit_object["Shell.Application"]._FolderItem({path:path}) : null;
  }

  this.constructor.prototype.Items = function () {
var path = this.obj.path
return new WebKit_object["Shell.Application"]._FolderItems({path:path, list:SA_require('fs').readdirSync(path)});
  }

  Object.defineProperty(this.constructor.prototype, "Self",
{
  get: function() {
return new WebKit_object["Shell.Application"]._FolderItem(this.obj);
  }
});
}

//main
this.obj = obj
    }

   ,_FolderItems: function (obj) {
if (!this._constructor_initialized) {
  this.constructor.prototype._constructor_initialized = true

  this.constructor.prototype.Item = function (index) {
return new WebKit_object["Shell.Application"]._FolderItem({path:this.obj.path + toLocalPath('\\') + this.obj.list[index]});
  }

  Object.defineProperty(this.constructor.prototype, "Count",
{
  get: function() {
return this.obj.list.length;
  }
});
}

//main
this.obj = obj
    }
  }

 ,"Microsoft.XMLDOM": {
    _CONSTRUCTOR: function () {
if (!this._constructor_initialized) {
  this.constructor.prototype._constructor_initialized = true

  this.constructor.prototype.load = function (url) {
if (/^(\/|[\w\-]+\:)/.test(url))
  url = toFileProtocol(url)

var xmlhttp = new XMLHttpRequest();
xmlhttp.open("GET",url,false);
xmlhttp.send();
this.xmlDoc = xmlhttp.responseXML;
  }

  this.constructor.prototype.save = function  (path) {
var xml = (new XMLSerializer()).serializeToString(this.xmlDoc);

if (!/^(\/|[\w\-]+\:)/.test(path))
  path = System.Gadget.path + toLocalPath('\\' + path.replace(/\//g, "\\"))

var f = FSO_OBJ.OpenTextFile(path, 2, true);
f.Write(xml)
f.Close()
  }

  this.constructor.prototype.selectSingleNode = XMLDocument.prototype.selectSingleNode = Element.prototype.selectSingleNode = function (elementPath) {
var xmlDoc = (this.xmlDoc || this);

var xpe = new XPathEvaluator();
var nsResolver = xpe.createNSResolver((xmlDoc.ownerDocument == null) ? xmlDoc.documentElement : xmlDoc.ownerDocument.documentElement);
var results = xpe.evaluate(elementPath,xmlDoc,nsResolver,XPathResult.FIRST_ORDERED_NODE_TYPE, null);

var node = results.singleNodeValue
if (node) {
  node.text = node.textContent
}

return node; 
  }

// XMLDocument functions and properties START
  Object.defineProperty(this.constructor.prototype, "documentElement",
{
  get: function() {
return this.xmlDoc.documentElement;
  }
});

  this.constructor.prototype.createElement  = function (name) { return this.xmlDoc.createElement(name) }
  this.constructor.prototype.createTextNode = function (name) { return this.xmlDoc.createTextNode(name) }
//END
}

// main
this.xmlDoc = null
    }
  }

 ,"WScript.Shell": {
    ExpandEnvironmentStrings: function (name) {
// fix an issue in opening settings on child animation as accessing process on that frame would crash the app
if (is_SA_child_animation) return SA_topmost_window.System.Environment.getEnvironmentVariable(name);

name = name.replace(/\%/g, "");
return process.env[name];
    }

   ,RegRead: function (key) {
var result

if (non_windows_native_mode) {
// https://ubuntuforums.org/showthread.php?t=2076097
// https://github.com/GNOME/gsettings-desktop-schemas/blob/master/schemas/org.gnome.desktop.background.gschema.xml.in

  if (key == 'HKCU\\Control Panel\\Colors\\Background') {
    if (linux_mode) {
      try { result = SA_require('child_process').execSync('gsettings get org.gnome.desktop.background primary-color') } catch (err) { console.error(key) }
      if (result) {
        result = result.toString().replace(/\s+$/, "").replace(/['"]|\&quot\;/g, "")
console.log(result)
        if (/^\#/.test(result))
          return result
      }
    }
    return ((windows_mode) ? "0 0 0" : "255 255 255")
  }
  if (key == 'HKCU\\Control Panel\\Desktop\\Wallpaper') {
    if (linux_mode) {
      try { result = SA_require('child_process').execSync('gsettings get org.gnome.desktop.background picture-uri') } catch (err) { console.error(key) }
      if (result) {
        result = result.toString().replace(/\s+$/, "").replace(/['"]|\&quot\;/g, "")
console.log(result)
        if (/^[\w\-]+\:/.test(result))
          return result
      }
    }
    return Settings_WE.SA_BG_url || ""
  }
  if (key == 'HKCU\\Control Panel\\Desktop\\WallpaperStyle') {
    if (linux_mode) {
      try { result = SA_require('child_process').execSync('gsettings get org.gnome.desktop.background picture-options') } catch (err) { console.error(key) }
      if (result) {
        result = result.toString().replace(/\s+$/, "").replace(/['"]|\&quot\;/g, "")
console.log(result)
        switch (result) {
case "centered":
  return "0"
case "scaled":
  return "2"
case "stretched":
  return "6"
case "zoom":
default:
  return "10"
        }
      }
    }
    return Settings_WE.SA_BG_style || "10"
  }
  if (key == 'HKCU\\Control Panel\\Desktop\\TileWallpaper') {
    return "0"
  }
  return ""
}

var key_head, key_body, key_name
if (!/^([^\\]+)\\(.+)\\([^\\]+)$/.test(key.replace(/\\$/, ""))) {
  console.error(key)
  return ""
}

key_head = RegExp.$1
key_body = RegExp.$2
key_name = RegExp.$3

var cmd = 'REG QUERY "' + key_head+'\\'+key_body + '" /v "' + key_name + '"'
// use require instead of SA_require to fix error in later versions of electron
try { result = require('child_process').execSync(cmd) } catch (err) {}
if (result) {
  result = result.toString().replace(/\s+$/, "").trim().replace(/^HKEY\w+\\/, "")
  if (result.indexOf(key_body) == 0)
    result = result.substr(key_body.length).replace(/^\s+/, "")
//console.log(result)
  if ((result.indexOf(key_name) == 0) && /^REG\w+\s+(.+)$/.test(result.substr(key_name.length).trim())) {
    return RegExp.$1
  }
}

console.error(cmd)
return ""

/*
var js_path = System.Gadget.path + toLocalPath('\\js\\SA_regread.js');
var temp_path = oShell.ExpandEnvironmentStrings("%TEMP%");
var temp_filename = js_path.replace(/^.+[\/\\]/, '').replace(/\s/g, "_") + ("_" + Date.now()) + ("-" + Math.random()).replace(/0\./, "");

//if (/EQBand/i.test(key)) alert(key)

WebKit_object["Shell.Application"]._run(js_path, encodeURIComponent(temp_filename) + " " + encodeURIComponent(key), null, true);

temp_path += toLocalPath('\\' + temp_filename + '.txt');
var result = ""
try {
  var fs = SA_require('fs')
  if (fs.existsSync(temp_path)) {
    result = fs.readFileSync(temp_path).toString()
    fs.unlinkSync(temp_path)
  }
}
catch (err) {
  console.error(err)
}

return result
*/
   }

   ,CreateShortcut: function (path) {
return new this._shortcut(path)
    }
   ,_shortcut: function (path) {
function Save() {
  SystemEXT.CreateShortcut([this.TargetPath, this._path, this.WorkingDirectory, this.Arguments, this.IconLocation])
}

this._path = path
this.Save = Save
    }
  }

 ,"Scripting.FileSystemObject": {
    FileExists: function (path) {
if (/\.zip\#/i.test(path))
  return true
return SA_require('fs').existsSync(toLocalPath(path))
    }

   ,FolderExists: function (path) {
return this.FileExists(toLocalPath(path))
    }

   ,CreateFolder: function (path) {
SA_require('fs').mkdirSync(toLocalPath(path))
    }

   ,GetFile: function (path) {
return new this._File_FSO(toLocalPath(path));
    }

   ,OpenTextFile: function (path, mode, create) {
return new this._File(toLocalPath(path), mode, create);
    }

   ,DeleteFile: function (path) {
var fs = SA_require('fs')
if (fs.existsSync(toLocalPath(path)))
  fs.unlinkSync(path)
    }

   ,CopyFolder: function (source, destination) {
var fs = SA_require('fs-extra')
fs.copySync(toLocalPath(source), toLocalPath(destination))
    }

   ,_File: function (path, mode, create) {
if (!this._constructor_initialized) {
  this.constructor.prototype._constructor_initialized = true

  this.constructor.prototype.ReadAll = function () {
return SA_require('fs').readFileSync(this.path)
  }

  this.constructor.prototype.ReadLine = function () {
if (!this._lines) {
  var lines = this._lines = this.ReadAll().toString().split(/[\n\r]+/)
  if (!lines[0])
    lines.shift()
  if (!lines[lines.length-1])
    lines.pop()
}

var line = this._lines.shift()
if (!this._lines.length)
  this.AtEndOfStream = true

return line
/*
if (/^(.+)[\n\r]+(.+)$/m.test(this._data)) {
  this._data = RegExp.$2
alert(this._data)
  return RegExp.$1
}

var RE = /^(.+)$/
if (RE.test(this._data)) {
  var str = RegExp.$1
  this._data = str.substr(, str.length)
  return str
}
else {
  this.AtEndOfStream = true
  return this._data
}
*/
  }

  this.constructor.prototype.Write = function (data) {
if (WallpaperEngine_CEF_mode)
  return

var fs = SA_require('fs')
if (this.mode==8)
  fs.appendFileSync(this.path, data)
else
  fs.writeFileSync(this.path, data)
return this;
  }

  this.constructor.prototype.Close = function () {
this._lines = null
  }
}

//main
this.path = path
this.mode = mode
this.create = create

if (create && !WallpaperEngine_CEF_mode) {
  var fs = SA_require('fs')
  fs.closeSync(fs.openSync(path, "w"))
}
    }

   ,_File_FSO: function (path) {
if (!this._constructor_initialized) {
  this.constructor.prototype._constructor_initialized = true

  this.constructor.prototype.Copy = function (path, overwrite) {
if (overwrite)
  WebKit_object["Scripting.FileSystemObject"].DeleteFile(path)

if (/^(.+)\\([^\\]+)$/.test(path)) {
  var fs = SA_require('fs');
  fs.createReadStream(this.path).pipe(fs.createWriteStream(path));
}
  }
}

//main
this.path = path
    }
  }

 ,use_electron_as_wallpaper: true
 ,stay_on_desktop: function (stay, onended) {
if (SA_topmost_window.WebKit_object.use_electron_as_wallpaper) {
  webkit_electron_remote.getGlobal("electron_as_wallpaper")(!!stay);
  if (onended) setTimeout(()=>{onended()}, 500);
  return;
}

if (!FSO_OBJ.FileExists(System.Gadget.path + '\\au3\\on_desktop.exe') && !returnBoolean("AutoItRunAsAU3")) {
  alert('This feature is not available for XR Animator. For details, please refer to the following file.\n\nAT_SystemAnimator_v' + System.Gadget.version.replace(/\./g, '') + '.gadget/au3/note.txt');
  System.Gadget.Settings.writeString("AutoItStayOnDesktop", "");
  return;
}

var handle = webkit_electron_remote.getGlobal("mainWindow_handle")
if (!handle) {
  console.error('"Stay on desktop" feature requires the latest version of Electron.')
  return
}
/*
if (!W8_or_above) {
  console.error('"Stay on desktop" feature requires Windows 8 or above.')
  return
}
*/
if (stay) {
  AutoIt_Execute(System.Gadget.path + '\\au3\\on_desktop', handle.self_handle, 100, function (error, stdout, stderr) {
if (error) {
  console.error(error)
  return
}

if (!handle.parent_handle)
  handle.parent_handle = stdout
//console.log(typeof stdout)

if (onended)
  onended()
  });
}
else {
  if (!handle.parent_handle) {
    alert("ERROR: Missing parent handle")
    return
  }

  AutoIt_Execute(System.Gadget.path + '\\au3\\on_desktop', handle.self_handle + ' ' + handle.parent_handle, 100, function (error, stdout, stderr) {
if (error) {
  console.error(error)
  return
}

if (onended)
  onended()
  });
}
  }

 ,monitor_winstate: {
    enabled: false
   ,process: null
   ,init: function () {
if (SA_topmost_window.WebKit_object.use_electron_as_wallpaper) return;

if ((self.MMD_SA && MMD_SA.MMD_started) || (!self.MMD_SA && loaded)) {
  this.run()
}
else {
  window.addEventListener(((self.MMD_SA)?"MMDStarted":"load"), function () { WebKit_object.monitor_winstate.run() })
}
    }
   ,run: function () {
this.enabled = true
if (loaded)
  DEBUG_show("Auto pause:ON", 2)
if (this.process)
  return

// http://stackoverflow.com/questions/18334181/spawn-on-node-js-windows-server-2012
// /s /c
var p = this.process = require('child_process').spawn('cmd', ['/s', '/c', 'monitor_winstate'], { 
  cwd: System.Gadget.path + toLocalPath('\\au3')
});

//setTimeout(function () {monitor_winstate.kill(); monitor_winstate=null; clearInterval(monitor_winstate_timerID); }, 500)

// http://stackoverflow.com/questions/13230370/nodejs-child-process-write-to-stdin-from-an-already-initialised-process
// \n
//var monitor_winstate_timerID = setInterval(function () {monitor_winstate.stdin.write("123\n")}, 1000)

p.stdout.on('data', (data) => {
  if (!WebKit_object.monitor_winstate.enabled)
    return
//  console.log('stdout:' + data);
  var para = data.toString().split("|")
  if (para[0] != "NORMAL") {
//DEBUG_show(para[0] + ',' + para[1])
    System._gadget_pause(true)
    return
  }

  System._gadget_resume(true)
  System._browser._wallpaper_mousekey = parseInt(para[para.length-1]) || 0
//  DEBUG_show(System._browser._wallpaper_mousekey)
});

p.stderr.on('data', (data) => {
  console.log('stderr:' + data);
});
/*
p.on('close', (code) => {
  console.log('child process exited with code ' + code);
});
*/
Seq.item("MonitorWinstateSTDIN").At(0, function () { WebKit_object.monitor_winstate.process.stdin.write("1\n"); }, -1, 1)
Seq.item("MonitorWinstateSTDIN")._gadget_pause_disabled = true
Seq.item("MonitorWinstateSTDIN").Play()
    }
  }

 ,monitor_winamp: {
    enabled: false
   ,process: null
   ,_json: {}
   ,init: function () {
if ((self.MMD_SA && MMD_SA.MMD_started) || (!self.MMD_SA && loaded)) {
  this.run()
}
else {
  window.addEventListener(((self.MMD_SA)?"MMDStarted":"load"), function () { WebKit_object.monitor_winamp.run() })
}
    }
   ,run: function () {
this.enabled = true
if (loaded)
  DEBUG_show("Winamp monitor:ON", 2)
if (this.process)
  return

// http://stackoverflow.com/questions/18334181/spawn-on-node-js-windows-server-2012
// /s /c
var p = this.process = require('child_process').spawn('cmd', ['/s', '/c', '_winamp'], { 
  cwd: System.Gadget.path + toLocalPath('\\au3\\BASS')
});

p.stdout.on('data', (data) => {
  if (!WebKit_object.monitor_winamp.enabled)
    return
//  console.log('stdout:' + data);
let data_str = data.toString()
let para = data_str.split("}{")
if (para.length > 1) {
  para = "{" + para.pop()
}
else {
  para = para[0]
}
try {
  let json = WebKit_object.monitor_winamp._json = JSON.parse(para)
//  console.log(!!json.playing)
} catch (err) { console.error(err, data_str, para) }

  self.Audio_BPM && Audio_BPM._CheckWinamp()
});

p.stderr.on('data', (data) => {
  console.log('stderr:' + data);
});
/*
p.on('close', (code) => {
  console.log('child process exited with code ' + code);
});
*/
Seq.item("MonitorWinampSTDIN").At(0, function () { WebKit_object.monitor_winamp.process.stdin.write("1\n"); }, -1, 1)
Seq.item("MonitorWinampSTDIN")._gadget_pause_disabled = true
Seq.item("MonitorWinampSTDIN").Play()
    }

  }
}

WebKit_object._init()


// others
function WebKit_onload() {
//  DEBUG_show(webkit_version, 10)
}

function WebKit_InitIEDOM() {
  var p = document.body
//  p.__defineGetter__("scrollLeft", function () { return window.scrollX })
//  p.__defineGetter__("scrollTop", function () { return window.scrollY })
//  p.__defineGetter__("clientWidth", function () { return window.innerWidth })
//  p.__defineGetter__("clientHeight", function () { return window.innerHeight })

  p = CSSStyleDeclaration.prototype
//  p = p.style.constructor.prototype
  p.__defineGetter__("posLeft",
function () {
  var num = parseInt(this.left)
  if (!num)
    num = 0
  return num
}
  )

  p.__defineSetter__("posLeft",
function (num) {
  this.left = num + "px"
}
  )

  p.__defineGetter__("posTop",
function () {
  var num = parseInt(this.top)
  if (!num)
    num = 0
  return num
}
  )

  p.__defineSetter__("posTop",
function (num) {
  this.top = num + "px"
}
  )


Object.defineProperty(p, "pixelWidth",
{
  get: function () {
var num = parseInt(this.width)
if (!num)
  num = 0
return num
  }

 ,set: function (num) {
//if (this._set)
//  this._set()
this.width = num + "px"
  }
});

Object.defineProperty(p, "pixelHeight",
{
  get: function () {
var num = parseInt(this.height)
if (!num)
  num = 0
return num
  }

 ,set: function (num) {
//if (this._set)
//  this._set()
this.height = num + "px"
  }
});

Object.defineProperty(p, "msTransform",
{
  get: function () {
return this.webkitTransform
  }

 ,set: function (v) {
this.webkitTransform = v
  }
});

Object.defineProperty(p, "msTransformOrigin",
{
  get: function () {
return this.webkitTransformOrigin
  }

 ,set: function (v) {
this.webkitTransformOrigin = v
  }
});

Object.defineProperty(p, "msPerspective",
{
  get: function () {
return this.webkitPerspective
  }

 ,set: function (v) {
this.webkitPerspective = v
  }
});

Object.defineProperty(p, "msPerspectiveOrigin",
{
  get: function () {
return this.webkitPerspectiveOrigin
  }

 ,set: function (v) {
this.webkitPerspectiveOrigin = v
  }
});

Object.defineProperty(p, "msBackfaceVisibility",
{
  get: function () {
return this.webkitBackfaceVisibility
  }

 ,set: function (v) {
this.webkitBackfaceVisibility = v
  }
});

/*
Object.defineProperty(HTMLElement.prototype, "innerText",
{
  get: function () {
return this.textContent;
  }

 ,set: function (v) {
this.textContent = v;
  }
});
*/
     HTMLElement.prototype.insertAdjacentElement = function(where,parsedNode)
     {
        switch (where)
        {
            case 'beforeBegin':
                this.parentNode.insertBefore(parsedNode,this)
                break;
            case 'afterBegin':
                this.insertBefore(parsedNode,this.firstChild);
                break;
            case 'beforeEnd':
                this.appendChild(parsedNode);
                break;
            case 'afterEnd':
                if (this.nextSibling) this.parentNode.insertBefore(parsedNode,this.nextSibling);
                    else this.parentNode.appendChild(parsedNode);
                break;
         }
     }

     HTMLElement.prototype.insertAdjacentHTML = function (where,htmlStr)
     {
         var r = this.ownerDocument.createRange();
         r.setStartBefore(this);
         var parsedHTML = r.createContextualFragment(htmlStr);
         this.insertAdjacentElement(where,parsedHTML)
     }

     HTMLElement.prototype.insertAdjacentText = function (where,txtStr)
     {
         var parsedText = document.createTextNode(txtStr)
         this.insertAdjacentElement(where,parsedText)
     }

Object.defineProperty(HTMLDocument.prototype, "parentWindow",
{
  get: function () {
return this.defaultView;
  }
});

  var Ep=Event.prototype;
  Ep.__defineSetter__("returnValue", function(b){if(!b)this.preventDefault();  return b;});
  Ep.__defineSetter__("cancelBubble",function(b){if(b) this.stopPropagation(); return b;});
  Ep.__defineGetter__("offsetX", function(){return this.layerX;});
  Ep.__defineGetter__("offsetY", function(){return this.layerY;});
  Ep.__defineGetter__("srcElement", function(){var n=this.target; while (n.nodeType!=1)n=n.parentNode;return n;});
}


// SVG Filter
var SVG_Filter = {
  svg_xmlns: "http://www.w3.org/2000/svg"

 ,init: function (filters) {
var d = document.createElementNS(this.svg_xmlns, "svg");

var filter = document.createElementNS(this.svg_xmlns, "filter");
filter.id = "SVG_Filter"
filter.setAttributeNS(null, "x", "0%");
filter.setAttributeNS(null, "y", "0%");
filter.setAttributeNS(null, "width", "100%");
filter.setAttributeNS(null, "height", "100%");

for (var i = 0; i < filters.length; i++)
  filter.appendChild(filters[i])
d.appendChild(filter)
document.body.appendChild(d)

return "url(#SVG_Filter)"
  }

  ,chroma_key: function (matrix) {
var feColorMatrix = document.createElementNS(this.svg_xmlns, "feColorMatrix");
feColorMatrix.setAttributeNS(null, "type", "matrix");

if (matrix == "blue")
  matrix = "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  4 4 -2 0 1"
else if (matrix == "green")
  matrix = "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  4 -2 4 0 1"

feColorMatrix.setAttributeNS(null, "values", matrix);

return feColorMatrix
  }
}


// http://www.wischik.com/lu/programmer/get-image-size.html
// http://stackoverflow.com/questions/10111784/get-image-resolution-from-image-file#comment12969712_10111784

function GetImageSize(filename) {
  if (webkit_electron_mode) { return webkit_electron_remote.getGlobal('GetImageSize')(filename); }

  var fs, fd, x, y, buf
  fs = SA_require('fs')
  if (WallpaperEngine_CEF_mode) {
    fd = fs.openSync(filename, "r")
    if (!fd)
      return null

    buf = new Uint8Array(new ArrayBuffer(24))
    fs.readSync(fd, buf, 0, 24, 0)
  }
  else {
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
    buf = new Uint8Array(new ArrayBuffer(24))//new Buffer(24)//

    fd = fs.openSync(filename, "r")
    fs.readSync(fd, buf, 0, 24, 0)
//console.log(buf)
  }

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


/*
try {
(function () {
var max = navigator.plugins.length;
var list = []
for (var i = 0; i < max; i++)
  list.push(navigator.plugins[i].name)
alert(list)
})();
}
catch (err) {}
*/
