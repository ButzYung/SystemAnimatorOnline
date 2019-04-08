// XUL image dimension request (v1.0.0)

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

    if (item.IsLink) {
      target_list.push('"' + encodeURIComponent(path) + '":"' + encodeURIComponent(item.GetLink.Path) + '"')

      item = item.GetLink
      path = item.Path
    }

    if (item.IsFolder) {
      if (lvl+1 < folder_lvl_max)
        readFolder(path, lvl+1)
    }
  }
}

function getLink(path) {
  var f = path.replace(/\\[^\\]+$/, "")
  var p = path.replace(/^.+\\/, "")
  var dir = Shell_OBJ.NameSpace(f)
  var obj = dir.ParseName(p)

  var path_final
  if (obj.IsLink) {
    obj = obj.GetLink
    path_final = obj.Path
    target_list.push('"' + encodeURIComponent(path) + '":"' + encodeURIComponent(path_final) + '"')
  }
  else
    path_final = path

  if (obj.IsFolder && folder_lvl_max)
    readFolder(path_final, 0)

  return path_final
}

var path_root = paras[0]
var folder_lvl_max = (paras[1]) ? parseInt(paras[1]) : 0

var target_list = []

var js = ""
if (folder_lvl_max) {
  getLink(path_root)

  var rn = '\r\n'
  js = '{' + rn + target_list.join(rn + ',') + rn + '}'
}
else {
  js = encodeURIComponent(getLink(path_root))
}

var file = FSO_OBJ.OpenTextFile(temp_filename + '.txt', 2, true);
file.Write(js);
file.Close();
