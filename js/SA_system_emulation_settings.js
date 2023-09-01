// Gadget settings emulation
// 2023-08-29

var use_SA_browser_mode
var use_SA_system_emulation, use_SA_gimage_emulation

var xul_mode, webkit_mode

var SA_HTA_folder

var return_window, parent_window

var form_updated = false;

if (!self.System) {
  use_SA_browser_mode = true
  use_SA_system_emulation = true

  return_window = (use_inline_dialog) ? self : ((opener) ? opener : self)
  self.returnValue = return_window.returnValue = false

  parent_window = (use_inline_dialog) ? parent : ((xul_mode) ? opener : self.dialogArguments)
  self.System    = parent_window.System
  self.SystemEXT = parent_window.SystemEXT

  System.Gadget.settings_window = self

  window.addEventListener('load', ()=>{
    function update_form() {
      form_updated = true;
    }

    const inputs = document.getElementsByTagName('input');
    for (let i = 0, i_max = inputs.length; i < i_max; i++) {
      inputs[i].addEventListener('change', update_form);
    }
  });
}
else {
  parent_window = System.Gadget.document.parentWindow
  self.SystemEXT = parent_window.SystemEXT
}

function SA_alert(msg) {
  if (xul_mode || use_inline_dialog)
    parent_window.alert(msg)
  else
    alert(msg)
}

function title_onmouseover(event) {
  DEBUG_show(this.getAttribute("data-title").replace(/\\n/g, "\n"))
}

function title_onmouseout(event) {
  Ldebug.style.visibility = "hidden"
}

function SA_Settings_OK() {
  if (!form_updated) {
    SA_Settings_Cancel()
    return;
  }

  if (use_inline_dialog) {
    self.returnValue = true
    self.location.replace("z_blank2.html")
  }
  else {
    self.returnValue = return_window.returnValue = true
    self.close()
  }
}

function SA_Settings_Cancel() {
  if (use_inline_dialog) {
// use parent.focus()
    self.location.replace("z_blank.html")
  }
  else
    self.close()
}

function SA_Settings_writeButtons(w, h) {
  if (!use_SA_browser_mode)
    return

  if (self.DEBUG_show) {
    var all = document.body.getElementsByTagName("*")
    for (var i = 0, i_max = all.length; i < i_max; i++) {
      var d = all[i]
      if (!d.title)
        continue

      d.setAttribute("data-title", d.title)
      d.title = ""
      d.onmouseover = title_onmouseover
      d.onmouseout  = title_onmouseout
    }
  }

  if (parent_window.WallpaperEngine_mode) {
    var c = document.getElementsByTagName("SELECT")
    for (var i = 0, i_max = c.length; i < i_max; i++) {
      var s = c[i]
      s.addEventListener("click", function (e) {
var index = parseInt(this.selectedIndex)
if (++index >= this.length)
  index = 0
this.selectedIndex = index
if (this.onchange)
  this.onchange()
      });
    }
/*
try {
    HTMLSelectElement.prototype.addEventListener("click", function (e) {
    });
} catch (err) { parent_window.DEBUG_show(JSON.stringify(err)) }
//parent_window.DEBUG_show(HTMLSelectElement.prototype.addEventListener)
*/
  }

  document.write(
  '<div style="position:absolute; top:' + h + 'px; width:' + w + 'px">\n'
+ '<hr size=1 noshade/>\n'
+ '<table style="width:100%;"><tr valign="top">\n'
+ '<td style="width:50%; font-size:10px">\n'
+ ((webkit_mode) ? ((webkit_nwjs_mode) ? "NW.js v": "Electron v") + webkit_version + " (v" + ((webkit_electron_mode) ? top.process.versions.chrome : process.versions['chromium']) + ")" : ((xul_mode) ? 'XUL mode (v' + xul_version + ')' : ((ie9_native) ? 'HTA mode (v' + parent_window.document.documentMode + ')' : 'Gadget mode')))
+ '</td>\n'
+ '<td style="width:50%">\n'
+ '<div style="width:100%; text-align:right">\n'
+ '<input type="button" style="width:60px" value="OK" onclick="SA_Settings_OK()" class="textBox" />\n'
+ '<input type="button" style="width:60px" value="Cancel" onclick="SA_Settings_Cancel()" class="textBox" />&nbsp;\n'
+ '</div>\n'
+ '</td>\n'
+ '</tr></table>\n'
+ '</div>\n'
  )
}
