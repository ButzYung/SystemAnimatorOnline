// Electron preload v1.0

var e_remote = require('electron').remote
var win = e_remote.getCurrentWindow()
var webContents = win.webContents

webContents.on("dom-ready", function () {

//  window.addEventListener("load", function () {
    document.addEventListener("mouseover", function (e) {
var target_with_text = e.target

try {
var tag_RE = /script|style/i
while (!target_with_text.textContent) {
  while (target_with_text.nextElementSibling) {
    target_with_text = target_with_text.nextElementSibling
    if (target_with_text.textContent && !tag_RE.test(target_with_text.tagName))
      break
  }
  if (target_with_text.textContent && !tag_RE.test(target_with_text.tagName))
    break

  target_with_text = target_with_text.parentElement
  if (!target_with_text || (target_with_text.textContent && !tag_RE.test(target_with_text.tagName)))
    break
}
if (!target_with_text)
  target_with_text = e.target
}
catch (err) { target_with_text = { tagName:'ERROR', textContent:"" } }

e_remote.getGlobal("mainWindow_postMessage")('tray_menu', 'CUSTOM:Web Browser|feedback|' + encodeURIComponent([e.target.tagName,e.target.textContent, target_with_text.tagName,target_with_text.textContent].join(',')))
    }, true)
//  }, true)
  
});
