// Regread (v1.0.0)

var objArgs = WScript.Arguments;
var oShell = new ActiveXObject("WScript.Shell");

try {
  var temp_path = oShell.ExpandEnvironmentStrings("%TEMP%")
  var temp_filename = temp_path + '\\' + decodeURIComponent(objArgs(0))
  var key = decodeURIComponent(objArgs(1))
}
catch (err) {
  WScript.Echo("Invalid arguments!\n" + objArgs.length)
  WScript.Quit()
}


// main

var Shell_OBJ = new ActiveXObject("Shell.Application");
var FSO_OBJ = new ActiveXObject("Scripting.FileSystemObject");

try {
  var file = FSO_OBJ.OpenTextFile(temp_filename + '.txt', 2, true);
  file.Write(oShell.RegRead(key));
  file.Close();
}
catch (err) {}

//WScript.Sleep(100);
