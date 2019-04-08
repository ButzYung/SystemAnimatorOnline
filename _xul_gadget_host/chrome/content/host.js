// System Animator - Host (v1.0.1)

var is_chrome_window = true
var is_SA_host = true

var xul_mode

var hosted_SA_max = 10
var hosted_SA = []

var enforce_WSH, xul_cmdLine

//"C:\\Users\\User\\Pictures\\_\\Vocaloids - Miku x Luka - Yuri - Silverlight - EQP_v4"

var FSO_OBJ = new ActiveXObject("Scripting.FileSystemObject");

function openSA(path) {
  if (!path)
    path = ""

  var free_id = -1
  for (var i = 0; i < hosted_SA_max; i++) {
    if (hosted_SA[i] == null) {
      free_id = i
      break
    }
  }
  if (free_id == -1) {
    alert("No more than " + hosted_SA_max + " animations running at the same time!")
    return
  }

  hosted_SA[free_id] = encodeURIComponent(path)
  writeSAList()

  openSAWindow(path, free_id)
}

function writeSAList() {
  var file = FSO_OBJ.OpenTextFile(gadget_path + '\\TEMP\\_hosted_SA.txt', 2, true);
  file.Write(JSON.stringify(hosted_SA));
  file.Close();
}

function openSAWindow(path, i) {
  if (!i)
    i = 0

  var paras = []
  if (path)
    paras.push("f=" + encodeURIComponent(path))
  if (i)
    paras.push("id=" + i)
  var para = paras.join("&")
  para = (para) ? "?" + para : ""

  setTimeout('open("chrome://saxul/content/main.xul' + para + '", "SA' + i + '", "chrome,dependent");', 0);
}

var new_animation_path

function closeSA(id) {
  if (!id)
    id = 0

  hosted_SA[id] = null

  if (new_animation_path) {
    openSA(new_animation_path)
    new_animation_path = null
    return
  }

  writeSAList()

  var has_active_window
  for (var i = 0; i < hosted_SA_max; i++) {
    if (hosted_SA[i] != null) {
      has_active_window = true
      break
    }
  }

  if (!has_active_window)
    setTimeout("window.close()", 100)
}

window.onunload = function () {
  self.closeSA = function () {}
}

window.onload = function () {
  xul_cmdLine = window.arguments[0].QueryInterface(Components.interfaces.nsICommandLine);
  if (xul_cmdLine.length && (xul_cmdLine.getArgument(xul_cmdLine.length-1) == "wsh"))
    enforce_WSH = true

  var host_path = gadget_path + '\\TEMP\\_hosted_SA.txt'
  if (FSO_OBJ.FileExists(host_path)) {
    try {
      var file = FSO_OBJ.OpenTextFile(host_path, 1);
      var txt = file.ReadAll()
      file.Close()

      if (txt)
        hosted_SA = JSON.parse(txt)
    }
    catch (err) {}
  }

  var opened_window = 0
  for (var i = 0; i < hosted_SA_max; i++) {
    var path = hosted_SA[i]
    if (path == null)
      continue

    opened_window++
    openSAWindow(decodeURIComponent(path), i)
  }

  if (!opened_window) {
    hosted_SA = [""]
    openSAWindow("")
  }
}


var gadget_path

(function () {
  gadget_path = XPCOM_object._SA_root;
})();
