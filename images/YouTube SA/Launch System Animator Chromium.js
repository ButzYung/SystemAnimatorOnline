/* Gadget HTA/XUL/Chromium launcher JS (v2.0.0) */
var f = WScript.ScriptFullName.replace(/\\[^\\]+$/, "");

(new ActiveXObject("Shell.Application")).ShellExecute("system-animator://" + encodeURIComponent(f));
