// main (v1.0.4)

var is_chrome_window = true;
var is_SA_hosted = (window.opener && window.opener.is_SA_host);

var SA_HTA_folder, SA_child_animation_id;
var enforce_WSH, xul_cmdLine;
var xul_transparent_mode;

(function () {

Object.defineProperty(window, "screenLeft",
{
  get: function () {
return this.screenX;
  }
});

Object.defineProperty(window, "screenTop",
{
  get: function () {
return this.screenY;
  }
});


if (is_SA_hosted) {
  xul_cmdLine = window.opener.xul_cmdLine;
  if (window.opener.enforce_WSH)
    enforce_WSH = true
}
else {
  xul_cmdLine = window.arguments[0].QueryInterface(Components.interfaces.nsICommandLine);
  if (xul_cmdLine.length && (xul_cmdLine.getArgument(xul_cmdLine.length-1) == "wsh"))
    enforce_WSH = true
}

var para_ani = -1
var para_length = xul_cmdLine.length
if (para_length) {
// in some cases, the state of FireFox is "stuck" (eg. a clean "ShellExecute" of FireFox with no parameter may still be an XUL app),
// and the first parameter may not always be the animation folder path
  for (var i = 0; i < para_length; i++) {
    var p = xul_cmdLine.getArgument(i)
    if (/\\/.test(p) && !/application\.ini$/.test(p)) {
      para_ani = i
      break
    }
  }
}

if (/(f|id)\=/.test(window.location.search)) {
  SA_HTA_folder = (/f\=([^\&]+)/.test(window.location.search)) ? decodeURIComponent(RegExp.$1) : "";
  SA_child_animation_id = (/id\=(\d+)/.test(window.location.search)) ? parseInt(RegExp.$1) : 0;
}
else if (para_ani != -1) {
  SA_HTA_folder = xul_cmdLine.getArgument(para_ani);
}
else {
// obsolete
  var temp_path = Components.classes["@mozilla.org/file/directory_service;1"].getService(Components.interfaces.nsIProperties).get("TmpD", Components.interfaces.nsIFile).path;
  for (var i = 9; i >= 0; i--) {
    var path_startup = temp_path + "\\_SA_startup" + i + ".tmp";
    var temp_file = FileIO.open(path_startup)
    if (!temp_file || !temp_file.exists())
      continue

    try {
      var txt = FileIO.readText(temp_file);

      try { FileIO.unlink(temp_file) } catch (err) {}

      if (txt) {
        var paras = txt.split("|")
        var timestamp = paras[1]
        if (!timestamp || (Date.now() < parseInt(timestamp) + 30*1000)) {
          SA_HTA_folder = decodeURIComponent(paras[0])
          break
        }
      }
    }
    catch (err) {}
  }

  var temp_file = FileIO.open(temp_path + "\\_SA_enforce_WSH.tmp")
  if (temp_file && temp_file.exists()) {
    enforce_WSH = true
    try { FileIO.unlink(temp_file) } catch (err) {}
  }
}

if (SA_HTA_folder) {
  var config_js = FileIO.open(SA_HTA_folder + '\\_config_local.js');
  if (!config_js || !config_js.exists()) {
    if (!/AT_SystemAnimator.+\\images\\[^\\]+$/.test(SA_HTA_folder))
      return

    config_js = FileIO.open(SA_HTA_folder.replace(/\\images\\[^\\]+$/, "") + '\\TEMP\\_config_local\\' + SA_HTA_folder.replace(/^.+\\/, "") + '.js');
    if (!config_js || !config_js.exists())
      return
  }

  var js = FileIO.readText(config_js);
  if (!js || !/(\{[^\}]+\})/.test(js))
    return

  var settings
  try { settings = JSON.parse(RegExp.$1) } catch (err) {}

  if (settings) {
    xul_transparent_mode = (settings.XULTransparentBG)// || (settings.Opacity && (parseFloat(settings.Opacity) < 1)))
  }

//about:support
//about:config

  if (xul_transparent_mode)
    document.getElementById("main").style.backgroundColor = "transparent"
}

/*
var Ci = Components.interfaces
var xulWin = window.QueryInterface(Ci.nsIInterfaceRequestor)
   .getInterface(Ci.nsIWebNavigation).QueryInterface(Ci.nsIDocShellTreeItem)
   .treeOwner.QueryInterface(Ci.nsIInterfaceRequestor)
   .getInterface(Ci.nsIXULWindow);
xulWin.zLevel = xulWin.highestZ;
*/

})();