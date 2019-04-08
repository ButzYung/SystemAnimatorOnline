// ExtendedProperty (v1.2.0)

var objArgs = WScript.Arguments;
var oShell = new ActiveXObject("WScript.Shell");

try {
  var temp_path = oShell.ExpandEnvironmentStrings("%TEMP%")
  var temp_filename = temp_path + '\\' + decodeURIComponent(objArgs(0))
  var path = decodeURIComponent(objArgs(1))
  var name = decodeURIComponent(objArgs(2))
}
catch (err) {
  WScript.Echo("Invalid arguments!\n" + objArgs.length)
  WScript.Quit()
}


// main

var Shell_OBJ = new ActiveXObject("Shell.Application");
var FSO_OBJ = new ActiveXObject("Scripting.FileSystemObject");

var f = path.replace(/\\[^\\]+$/, "")
var p = path.replace(/^.+\\/, "")
var dir = Shell_OBJ.NameSpace(f)
var obj = dir.ParseName(p)

try {
  var file = FSO_OBJ.OpenTextFile(temp_filename + '.txt', 2, true);
  file.Write(obj.ExtendedProperty(name));
  file.Close();
}
catch (err) {}

//WScript.Sleep(100);
