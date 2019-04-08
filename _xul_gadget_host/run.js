var WshShell = new ActiveXObject("WScript.Shell");

var path = 'C:\\Program Files\\Mozilla Firefox\\firefox.exe';
new ActiveXObject("Shell.Application").ShellExecute(path, '-app application.ini');

//WScript.Echo(WshShell.ExpandEnvironmentStrings("%PATH%"))

//var path = 'C:\\Temp\\Downloads\\xulrunner-2.0.en-US.win32\\xulrunner\\xulrunner.exe application.ini';
//WshShell.Run(path);
