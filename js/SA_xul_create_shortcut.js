// XUL create shortcut (v1.1.0)

var objArgs = WScript.Arguments;

if (objArgs.length < 4) {
  WScript.Echo("Invalid arguments!\n" + objArgs.length)
  WScript.Quit()
}


// main

var oShell = new ActiveXObject("WScript.Shell");

var wscript_path = decodeURIComponent(objArgs(0))
var shortcut = oShell.CreateShortcut(decodeURIComponent(objArgs(1)))
shortcut.TargetPath = wscript_path
shortcut.WorkingDirectory = (objArgs(2) == "null") ? "" : decodeURIComponent(objArgs(2))
shortcut.Arguments = (objArgs(3) == "null") ? "" : decodeURIComponent(objArgs(3))
shortcut.IconLocation = (objArgs(4) == "null") ? "" : decodeURIComponent(objArgs(4))
shortcut.Save()
