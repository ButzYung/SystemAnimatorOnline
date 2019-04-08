// Simple launcher (v1.1.0)

var objArgs = WScript.Arguments;

if (!objArgs.length) {
  WScript.Echo("Invalid arguments!");
  WScript.Quit();
}

WScript.Sleep(2*1000);
//WScript.Echo("(Restarting System Animator)");

var args = decodeURIComponent(objArgs(0)).split("|");
var Shell_OBJ = new ActiveXObject("Shell.Application");
if (args.length == 1) {
  Shell_OBJ.ShellExecute(args[0]);
}
else {
  var launcher, para

  if (/\.js$/i.test(args[0])) {
    launcher = (new ActiveXObject("WScript.Shell").ExpandEnvironmentStrings("%SystemRoot%")) + "\\System32\\WScript.exe";
    para = '"' + args[0] + '"';
  }
  else {
    launcher = args[0];
    para = '"' + args.slice(1).join('" "') + '"';
  }
//WScript.Echo(para);
  Shell_OBJ.ShellExecute(launcher, para);
}
