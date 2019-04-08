/* Gadget HTA/XUL/Chromium launcher JS (v2.0.0) */
var f = WScript.ScriptFullName.replace(/\\[^\\]+$/, "");
var hta = "C:\\Program Files (x86)\\Steam\\steamapps\\common\\wallpaper_engine\\projects\\myprojects\\SA_v00\\AT_SystemAnimator_v0001.gadget";

try {
var gadget_found;
var fso = new ActiveXObject("Scripting.FileSystemObject");
var oShell = new ActiveXObject("Shell.Application");
gadget_found = fso.FolderExists(hta);
if (!gadget_found) {
  var f_obj = oShell.NameSpace(hta.replace(/\\[^\\]+$/, "")).Items();
  for (var i = 0; i < f_obj.Count; i++) {
    hta = f_obj.Item(i).Path;
    if (!fso.FileExists(hta + "\\" + "SystemAnimator_ie.hta")) continue;
    gadget_found = true;
    WScript.Echo("Gadget version updated!");
    break;
  }
}
}
catch (err) {};
if (!gadget_found) {
  WScript.Echo("Error: Gadget not found");
  WScript.Quit();
};

var XUL_path;
var temp_config_xul_path = hta + "\\TEMP\\_config_xul_path.tmp";
if (fso.FileExists(temp_config_xul_path)) {
  var temp_file = fso.OpenTextFile(temp_config_xul_path, 1);
  XUL_path = temp_file.ReadLine();
  temp_file.Close();
}

if (!XUL_path || !fso.FileExists(XUL_path)) {
  XUL_path = "C:\\Program Files (x86)\\Mozilla Firefox\\firefox.exe";
  if (!XUL_path || !fso.FileExists(XUL_path)) {
    XUL_path = hta + "\\xulrunner\\xulrunner.exe";
    if (!fso.FileExists(XUL_path)) {
      WScript.Echo("Error: Firefox/XULRunner not found");
      WScript.Quit();
    }
  }
}

oShell.ShellExecute(XUL_path, ((/firefox.exe/i.test(XUL_path)) ? "-app " : "") + '"' + hta + '\\_xul_gadget\\application.ini" "' + f + '"');
