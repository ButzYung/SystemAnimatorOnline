// XUL Gecko-to-IE emulation (v1.6.2)

var xul_mode = true

var is_chrome_window

function ActiveXObject(obj_id) {
  var obj = XPCOM_object[obj_id]
  return (obj._CONSTRUCTOR) ? new obj._CONSTRUCTOR() : obj
}

var XPCOM_object = {
  _init: function () {
/*
// https://developer.mozilla.org/en-US/Add-ons/Code_snippets/Finding_Window_Handles
var baseWindow = window.QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                        .getInterface(Components.interfaces.nsIWebNavigation)
                        .QueryInterface(Components.interfaces.nsIDocShellTreeItem)
                        .treeOwner
                        .QueryInterface(Components.interfaces.nsIInterfaceRequestor)
                        .getInterface(Components.interfaces.nsIBaseWindow);

setTimeout(function () { DEBUG_show(baseWindow.nativeHandle,0,1) }, 1000)
*/

this._SA_root = this._getSpecialPath("CurProcD").replace(/[\/\\][^\/\\]+$/, "");

if (!is_chrome_window)
  XUL_InitIEDOM()
  }

 ,_getSpecialPath: function (id) {
try {
  return Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get(id, Components.interfaces.nsIFile).path;
}
catch (err) {
  DEBUG_show(id,0,1)
  throw err
}
  }


 ,_dragOver: function (e) {
var types = e.dataTransfer.types
if ((types.length == 1) && (types[0] == "text/plain"))
  return

    var dragService = Components.classes["@mozilla.org/widget/dragservice;1"].getService(Components.interfaces.nsIDragService);
    var dragSession = dragService.getCurrentSession();

    var supported = dragSession.isDataFlavorSupported("text/x-moz-url");
    if (!supported)
      supported = dragSession.isDataFlavorSupported("application/x-moz-file");

    if (supported) {
      dragSession.canDrop = true;
    }

//DEBUG_show(e.dataTransfer.dropEffect)
  }

 ,_dragDrop: function (e) {
    var dragService = Components.classes["@mozilla.org/widget/dragservice;1"].getService(Components.interfaces.nsIDragService);
    var dragSession = dragService.getCurrentSession();
    var _ios = Components.classes['@mozilla.org/network/io-service;1'].getService(Components.interfaces.nsIIOService);
    var uris = new Array();


    // If sourceNode is not null, then the drop was from inside the application
    if (dragSession.sourceNode)
      return;

    // Setup a transfer item to retrieve the file data
    var trans = Components.classes["@mozilla.org/widget/transferable;1"].createInstance(Components.interfaces.nsITransferable);
    trans.addDataFlavor("text/x-moz-url");
    trans.addDataFlavor("application/x-moz-file");

    for (var i=0; i<dragSession.numDropItems; i++) {
      var uri = null;

      dragSession.getData(trans, i);
      var flavor = {}, data = {}, length = {};
      trans.getAnyTransferData(flavor, data, length);
      if (data) {
        try {
          var str = data.value.QueryInterface(Components.interfaces.nsISupportsString);
        }
        catch(ex) {
        }

        if (str) {
          uri = _ios.newURI(str.data.split("\n")[0], null, null);
        }
        else {
          var file = data.value.QueryInterface(Components.interfaces.nsIFile);
          if (file)
            uri = _ios.newFileURI(file);
        }
      }

      if (uri)
        uris.push(uri);
    }

// Use the array of file URIs
if (!uris.length)
  return

var file = uris[0]
//DEBUG_show(uri.scheme+"://"+uri.host+uri.path,0,1);return;
var item
if (uri.scheme == "file") {
  var file_path = decodeURIComponent(file.path).replace(/^\W+/, "").replace(/\/$/, "").replace(/\//g, "\\")
  item = new System.Shell._FolderItem(new XPCOM_object["Shell.Application"]._FolderItem(FileIO.open(file_path)))
}
else {
  var url = uri.scheme+"://"+uri.host+uri.path
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


 ,"Shell.Application": {
    NameSpace: function (path) {
return new this._Folder(DirIO.open(toLocalPath(path)));
    }

   ,ShellExecute: function (path, para, working_dir) {
this._run(path, para, false, false, working_dir);
    }

   ,_run: function (path, para, blocking, enforce_WSH, working_dir) {
path = toLocalPath(path)
if (enforce_WSH) {
  para = '"' + path + '"' + ((para) ? ' ' + para : '')
  path = System.Environment.getEnvironmentVariable("SystemRoot") + "\\System32\\WScript.exe"
}

var file = FileIO.open(path);
var process = Components.classes["@mozilla.org/process/util;1"].createInstance(Components.interfaces.nsIProcess);
process.init(file);

var args = []
if (para) {
  para = para.replace(/\"([^\"]+)\"/g, function ($0, $1, $2) { return '"' + encodeURIComponent($1) + '"' })
  var paras = para.split(" ");

  for (var i = 0; i < paras.length; i++) {
    var p = paras[i]
// XUL doesn't need quotes for parameters.
    p = p.replace(/\"([^\"]+)\"/g, function ($0, $1, $2) { return decodeURIComponent($1) })

    if ((i == ((enforce_WSH)?1:0)) && working_dir)
      p = working_dir + '\\' + p

    args.push(p)
  }
}

process.run(blocking, args, args.length);
    }

   ,BrowseForFolder: function (hwnd, title, iOptions) {
var filePicker = Components.classes["@mozilla.org/filepicker;1"].createInstance(Components.interfaces.nsIFilePicker);
filePicker.init(self, title, 2);
var rv = filePicker.show();
return (rv != 1) ? new this._Folder(filePicker.file) : null;
    }

   ,folder_scan_depth: 2
   ,_FolderItem: function (obj) {
if (!this._constructor_initialized) {
  this.constructor.prototype._constructor_initialized = true

  this.constructor.prototype.ExtendedProperty = function (name) {
var path = this.obj.path;

//general case
if (name != "Dimensions") {
  var js_path = System.Gadget.path + '\\js\\SA_extendedproperty.js';
  var temp_path = oShell.ExpandEnvironmentStrings("%TEMP%");
  var temp_filename = path.replace(/^.+[\/\\]/, '').replace(/\s/g, "_") + ("_" + Date.now()) + ("-" + Math.random()).replace(/0\./, "");

  XPCOM_object["Shell.Application"]._run(js_path, encodeURIComponent(temp_filename) + " " + encodeURIComponent(path) + " " + encodeURIComponent(name), true, SystemEXT.enforce_WSH);

  temp_path += '\\' + temp_filename + '.txt';
  var result
  try {
    temp_file = FileIO.open(temp_path);
    result = FileIO.readText(temp_file);
    FileIO.unlink(temp_file);
  }
  catch (err) {}

  return result
}

//"Dimensions"
var dim = GetImageSize(path)
return ((dim) ? dim.join("x") : "130x130")

/*
setTimeout(function () { DEBUG_show("SA_xul_image_dimension.js", 2) }, 1000)

var js_path = System.Gadget.path + '\\js\\SA_xul_image_dimension.js';
var temp_path = oShell.ExpandEnvironmentStrings("%TEMP%"); //js_path.replace(/[\/\\][^\/\\]+$/, '\\TEMP');
var temp_filename = path.replace(/^.+[\/\\]/, '').replace(/\s/g, "_") + ("_" + Date.now()) + ("-" + Math.random()).replace(/0\./, "");

var temp_file

var meta_dim
if (path.indexOf(Settings.f_path_folder) == 0) {
  if (!XPCOM_object._image_dimension_list) {
    XPCOM_object._image_dimension_list = {}

    XPCOM_object["Shell.Application"]._run(js_path, encodeURIComponent(temp_filename) + " " + encodeURIComponent(Settings.f_path_folder+'|'+XPCOM_object["Shell.Application"].folder_scan_depth), true, SystemEXT.enforce_WSH);

    try {
//setTimeout('DEBUG_show(9,0,2)',1000)
      temp_file = FileIO.open(temp_path + '\\' + temp_filename + '.txt');
      var txt = FileIO.readText(temp_file);
      if (txt)
        XPCOM_object._image_dimension_list = JSON.parse(txt)
    }
    catch (err) {}
  }

  meta_dim = XPCOM_object._image_dimension_list[encodeURIComponent(path.substr(Settings.f_path_folder.length+1, path.length))]
}
else {
//if (!meta_dim) {
  XPCOM_object["Shell.Application"]._run(js_path, encodeURIComponent(temp_filename) + " " + encodeURIComponent(path), true, SystemEXT.enforce_WSH);

  try {
//setTimeout('DEBUG_show(3,0,2)',1000)
    temp_file = FileIO.open(temp_path + '\\' + temp_filename + '.txt');
    var txt = FileIO.readText(temp_file);
    if (txt)
      meta_dim = JSON.parse(txt)
  }
  catch (err) {}
}

meta_dim = (meta_dim) ? meta_dim.w + 'x' + meta_dim.h : "130x130";

if (temp_file) {
  FileIO.unlink(temp_file);
}

return meta_dim;
*/
  }

  Object.defineProperty(this.constructor.prototype, "IsFolder",
{
  get: function() {
return this.obj.isDirectory();
  }
});

  Object.defineProperty(this.constructor.prototype, "IsFileSystem",
{
  get: function() {
return this.obj.isFile();
  }
});

  Object.defineProperty(this.constructor.prototype, "IsLink",
{
  get: function() {
return this.obj.isSymlink();
  }
});

  Object.defineProperty(this.constructor.prototype, "GetLink",
{
  get: function() {
var path = this.obj.path;
if (path != this.obj.target) {
  return this.obj.target
}

var link_target
var list = XPCOM_object._link_target_list
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
  list = XPCOM_object._link_target_list = []
}

var temp_file

if (!link_target) {
  var js_path = System.Gadget.path + '\\js\\SA_xul_link_target.js';
  var temp_path = oShell.ExpandEnvironmentStrings("%TEMP%"); //js_path.replace(/[\/\\][^\/\\]+$/, '\\TEMP');
  var temp_filename = path.replace(/^.+[\/\\]/, '').replace(/\s/g, "_") + ("_" + Date.now()) + ("-" + Math.random()).replace(/0\./, "");
  XPCOM_object["Shell.Application"]._run(js_path, encodeURIComponent(temp_filename) + " " + encodeURIComponent(this.obj.parent.path+'|'+XPCOM_object["Shell.Application"].folder_scan_depth), true, SystemEXT.enforce_WSH);

  try {
    temp_file = FileIO.open(temp_path + '\\' + temp_filename + '.txt');
    var txt = FileIO.readText(temp_file);
    FileIO.unlink(temp_file);
    if (txt) {
      list.push(JSON.parse(txt))
      link_target = list[list.length-1][encodeURIComponent(path)]
    }
  }
  catch (err) {}
}

link_target = (link_target) ? decodeURIComponent(link_target) : path

return new XPCOM_object["Shell.Application"]._FolderItem(FileIO.open(link_target));
  }
});

  Object.defineProperty(this.constructor.prototype, "Type",
{
  get: function() {
return (this.obj.isSymlink()) ? "Link" : (this.obj.isFile()) ? "File" : "Folder";
  }
});

  Object.defineProperty(this.constructor.prototype, "GetFolder",
{
  get: function() {
return new XPCOM_object["Shell.Application"]._Folder(this.obj);
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
var file = FileIO.open(this.obj.path + '\\' + name);
return (file && file.exists()) ? new XPCOM_object["Shell.Application"]._FolderItem(file) : null;
  }

  this.constructor.prototype.Items = function () {
return new XPCOM_object["Shell.Application"]._FolderItems(DirIO.read(this.obj));
  }

  Object.defineProperty(this.constructor.prototype, "Self",
{
  get: function() {
return new XPCOM_object["Shell.Application"]._FolderItem(this.obj);
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
return new XPCOM_object["Shell.Application"]._FolderItem(this.obj[index]);
  }

  Object.defineProperty(this.constructor.prototype, "Count",
{
  get: function() {
return this.obj.length;
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
if (/^\w\:/.test(url))
  url = toFileProtocol(url)

var xmlhttp = new XMLHttpRequest();
xmlhttp.open("GET",url,false);
xmlhttp.send();
this.xmlDoc = xmlhttp.responseXML;
  }

  this.constructor.prototype.save = function  (path) {
var xml = (new XMLSerializer()).serializeToString(this.xmlDoc);

//UTF-16(?) to UTF-8
//https://developer.mozilla.org/en-US/docs/Firefox_addons_developer_guide/Using_XPCOM%E2%80%94Implementing_advanced_processes#Writing_preferences
xml = unescape(encodeURIComponent(xml))

if (!/^\w+\:/.test(path))
  path = System.Gadget.path + '\\' + path.replace(/\//g, "\\")

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
    _env_var_list: {
  "SystemRoot" : "WinD"//"Home"
 ,"TEMP" : "TmpD"
    }

   ,ExpandEnvironmentStrings: function (name) {
name = name.replace(/\%/g, "");
return XPCOM_object._getSpecialPath(this._env_var_list[name]);
    }

   ,RegRead: function (key) {
var wrk = Components.classes["@mozilla.org/windows-registry-key;1"].createInstance(Components.interfaces.nsIWindowsRegKey);

var key_head, key_body, key_name
if (!/^([^\\]+)\\(.+)\\([^\\]+)$/.test(key.replace(/\\$/, "")))
  return ""

key_head = RegExp.$1
key_body = RegExp.$2
key_name = RegExp.$3

key_head = (key_head == "HKCU") ? wrk.ROOT_KEY_CURRENT_USER : wrk.ROOT_KEY_LOCAL_MACHINE;

//DEBUG_show(key_body+'\\'+key_name);
var v
try {
  wrk.open(key_head, key_body, wrk.ACCESS_READ);

  if (wrk.hasChild(key_name)) {
    var subkey = wrk.openChild(key_name, wrk.ACCESS_READ);
    v = (subkey.valueCount) ? subkey.readStringValue(subkey.getValueName(0)) : null;
    subkey.close();
  }
  else if (wrk.hasValue(key_name)) {
    v = wrk.readStringValue(key_name);
  }

  wrk.close();
}
catch (err) {
//  DEBUG_show(err.toString());
}

return v||"";
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
var v = FileIO.open(toLocalPath(path))
if (v)
  v = v.exists()

return v
    }

   ,FolderExists: function (path) {
return this.FileExists(toLocalPath(path))
    }

   ,CreateFolder: function (path) {
DirIO.create(DirIO.open(toLocalPath(path)))
    }

   ,GetFile: function (path) {
return new this._File_FSO(toLocalPath(path));
    }

   ,OpenTextFile: function (path, mode, create) {
return new this._File(toLocalPath(path), mode, create);
    }

   ,DeleteFile: function (path) {
var file = FileIO.open(toLocalPath(path));
if (file && file.exists())
  FileIO.unlink(file);
    }

   ,CopyFolder: function (source, destination) {
var dir_destination = DirIO.open(toLocalPath(destination))
if (!DirIO.create(dir_destination))
  return false

var dir_source = DirIO.open(toLocalPath(source))
var file_list = DirIO.read(dir_source)
file_list.forEach(function (file) {
//  DEBUG_show(file.path,0,1)
  file.copyTo(dir_destination, null)
});
    }

   ,_File: function (path, mode, create) {
if (!this._constructor_initialized) {
  this.constructor.prototype._constructor_initialized = true

  this.constructor.prototype.ReadAll = function () {
return FileIO.readText(this.file)
  }

  this.constructor.prototype.ReadLine = function () {
if (!this._stream) {
  var istream = Components.classes["@mozilla.org/network/file-input-stream;1"].createInstance(Components.interfaces.nsIFileInputStream);
  istream.init(this.file, 0x01, 0444, 0);
  istream.QueryInterface(Components.interfaces.nsILineInputStream);

  this._stream = istream
}

var line = {};
this.AtEndOfStream = !this._stream.readLine(line);

return line.value; 
  }

  this.constructor.prototype.Write = function (data) {
FileIO.write(this.file, data, ((this.mode==8)?"a":""));
return this;
  }

  this.constructor.prototype.Close = function () {
if (this._stream) {
  this._stream.close()
  this._stream = null
}
  }
}

//main
var file = FileIO.open(path)
if (!file.exists() && create)
  FileIO.create(file)
this.file = file

this.mode = mode
this.create = create
    }

   ,_File_FSO: function (path) {
if (!this._constructor_initialized) {
  this.constructor.prototype._constructor_initialized = true

  this.constructor.prototype.Copy = function (path, overwrite) {
if (overwrite)
  XPCOM_object["Scripting.FileSystemObject"].DeleteFile(path)

if (/^(.+)\\([^\\]+)$/.test(path))
  this.file.copyTo(DirIO.open(RegExp.$1), RegExp.$2);
  }
}

//main
this.file = FileIO.open(path)
    }
  }
}

XPCOM_object._init()


// others
function XUL_onload() {
//  XUL_RegisterDOM()
}

function XUL_RegisterDOM() {
  var all = document.getElementsByTagName("*")
  for (var i = 0; i < all.length; i++) {
    var d = all[i]
    if (d.id)
      self[d.id] = d
  }
}

function XUL_InitIEDOM() {
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
if (this._set)
  this._set()
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
if (this._set)
  this._set()
this.height = num + "px"
  }
});

Object.defineProperty(p, "msTransform",
{
  get: function () {
return this.MozTransform
  }

 ,set: function (v) {
this.MozTransform = v
  }
});

Object.defineProperty(p, "msTransformOrigin",
{
  get: function () {
return this.MozTransformOrigin
  }

 ,set: function (v) {
this.MozTransformOrigin = v
  }
});

Object.defineProperty(p, "msPerspective",
{
  get: function () {
return this.MozPerspective
  }

 ,set: function (v) {
this.MozPerspective = v
  }
});

Object.defineProperty(p, "msPerspectiveOrigin",
{
  get: function () {
return this.MozPerspectiveOrigin
  }

 ,set: function (v) {
this.MozPerspectiveOrigin = v
  }
});

Object.defineProperty(p, "msBackfaceVisibility",
{
  get: function () {
return this.MozBackfaceVisibility
  }

 ,set: function (v) {
this.MozBackfaceVisibility = v
  }
});


Object.defineProperty(HTMLElement.prototype, "innerText",
{
  get: function () {
return this.textContent;
  }

 ,set: function (v) {
this.textContent = v;
  }
});

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
  var file = FileIO.open(filename);
  if (!file || !file.exists())
    return null
  var len = file.fileSize
  if (len < 24)
    return null

  // Strategy:
  // reading GIF dimensions requires the first 10 bytes of the file
  // reading PNG dimensions requires the first 24 bytes of the file
  // reading JPEG dimensions requires scanning through jpeg chunks
  // In all formats, the file is at least 24 bytes big, so we'll read that always
  var x,y

  var fiStream = Components.classes[FileIO.finstreamCID].createInstance(FileIO.finstreamIID);
  var siStream = Components.classes[FileIO.sinstreamCID].createInstance(FileIO.sinstreamIID);
  fiStream.init(file, 1, 0, false);
  siStream.init(fiStream);
  var si_pos = 24
  var data = siStream.readBytes(si_pos);

  var buf = []
  for (var i = 0; i < 24; i++)
    buf[i] = data.charCodeAt(i)

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

      var bytes_to_read = pos+12 - si_pos
      si_pos = pos+12
      data += siStream.readBytes(bytes_to_read)
      data = data.substr(-12)
      for (var i = 0; i < 12; i++)
        buf[i+2] = data.charCodeAt(i)
    }
  }

  siStream.close();
  fiStream.close();

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
