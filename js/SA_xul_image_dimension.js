// XUL image dimension request (v1.0.1)

var objArgs = WScript.Arguments;
var oShell = new ActiveXObject("WScript.Shell");

try {
  var temp_path = oShell.ExpandEnvironmentStrings("%TEMP%"); //WScript.ScriptFullName.replace(/\\[^\\]+$/, "\\TEMP")
  var temp_filename = temp_path + '\\' + decodeURIComponent(objArgs(0))
  var paras = decodeURIComponent(objArgs(1)).split("|")
}
catch (err) {
  WScript.Echo("Invalid arguments!\n" + objArgs.length)
  WScript.Quit()
}


// main

var Shell_OBJ = new ActiveXObject("Shell.Application");
var FSO_OBJ = new ActiveXObject("Scripting.FileSystemObject");

function readFolder(f, lvl) {
  if (!lvl)
    lvl = 0

  var items = Shell_OBJ.NameSpace(f).Items()
  for (var i = 0, i_max = items.Count; i < i_max; i++) {
    var item = items.Item(i)
    var path = item.Path
    if (item.IsFolder) {
      if (lvl+1 < folder_lvl_max)
        readFolder(path, lvl+1)
    }
    else if (item.IsFileSystem) {
      if (/\.(bmp|gif|jpg|jpeg|png)$/i.test(path))
        target_list.push('"' + encodeURIComponent(path.substr(path_root.length+1, path.length)) + '":' + getImageDimension(path))
    }
  }
}

function getImageDimension(path) {
  var f = path.replace(/\\[^\\]+$/, "")
  var p = path.replace(/^.+\\/, "")
  var dir = Shell_OBJ.NameSpace(f)
  var obj = dir.ParseName(p)

  var meta_dim = obj.ExtendedProperty("Dimensions");
  if (!meta_dim)
    meta_dim = dir.GetDetailsOf(obj, 26);

  if (!meta_dim)
    meta_dim = "130x130"

  return (meta_dim && /(\d+)\D+(\d+)/.test(meta_dim)) ? '{"w":' + RegExp.$1 + ',"h":' + RegExp.$2 + '}' : {"w":130,"h":130};
}

var path_root = paras[0]
var folder_lvl_max = (paras[1]) ? parseInt(paras[1]) : 0

var target_list = []

var js = ""
if (folder_lvl_max) {
  readFolder(path_root, 0)

  var rn = '\r\n'
  js = '{' + rn + target_list.join(rn + ',') + rn + '}'
}
else {
  js = getImageDimension(path_root);
}

//WScript.Sleep(100);

var file = FSO_OBJ.OpenTextFile(temp_filename + '.txt', 2, true);
file.Write(js);
file.Close();

//WScript.Sleep(100);
