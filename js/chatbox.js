// Chatbox

var Chatbox_no_auto_open, Chatbox_no_drag, Chatbox_no_scroll_adjust, Chatbox_no_auto_place;
var Chatbox_intro_msg;

var Chatbox_online_mode = /^http/i.test(self.location.href) || true;

var Chatbox_enabled = true;

(function () {
var SystemAnimator_mode = !!self.System

// backward compatibility
var _w3c_dom, _w3c_ie8
if (SystemAnimator_mode) {
  _w3c_dom = true
  _w3c_ie8 = true
}
else {
  _w3c_dom = w3c_dom
  _w3c_ie8 = w3c_ie8
}


var Chatbox_version = "2.1.6"

function w3c_chatDisplay(state) {
  if (!_w3c_dom)
    return

  document.getElementById("CB_Lwindow_content0").style.display = (state) ? "inline" : "none"
}

// old functions START

function chatW_dimension(obj) {
  var s = obj.style

  var min = { w:s.pixelWidth, h:s.pixelHeight }
  if (obj.min_width)
    min.w = (obj.min_width > 0) ? obj.min_width : sw + obj.min_width
  if (obj.min_height)
    min.h = (obj.min_height > 0) ? obj.min_height : sh + obj.min_height

  var max = { w:s.pixelWidth, h:s.pixelHeight }
  if (obj.max_width)
    max.w = (obj.max_width > 0) ? obj.max_width : sw + obj.max_width
  if (obj.max_height)
    max.h = (obj.max_height > 0) ? obj.max_height : sh + obj.max_height

  if (min.h < 100)
    min.h = 100
  if (min.w < 100)
    min.w = 100
  if (max.h < 100)
    max.h = 100
  if (max.w < 100)
    max.w = 100

  return { min:min, max:max }
}

var chatW_state = 1

function chatW_minimize(n, forced_minimize) {
  Chatbox_zoom(1)

  var minB = document.getElementById("CB_SminimizeB" + n)
  var c_content = document.getElementById("CB_Lchat_content" + n)

  if (minB.innerText == Chatbox_buttons.normal) {
    if (forced_minimize)
      return

    minB.innerText = Chatbox_buttons.min
    chatW_resize(n, Chatbox_buttons.normal)
  }
  else {
    chatW_state = 0

    minB.innerText = Chatbox_buttons.normal
    document.getElementById("CB_SresizeB" + n).innerText = Chatbox_buttons.max

    document.getElementById("CB_Lwindow_content" + n).style.visibility = "hidden"
w3c_chatDisplay(0)
    c_content.style.pixelWidth = chatW_dimension(c_content).min.w

    chatW_fix(n)
    chatW_place(n)

    CB_Lchat_title.innerText = "Anime Theme Chatbox Mini"

    Chatbox_EnableUpdate(false)
  }
}

function chatW_resize(n, b) {
  Chatbox_zoom(1)

  var resizeB = document.getElementById("CB_SresizeB" + n)
  var w_content = document.getElementById("CB_Lwindow_content" + n)
  var c_content = document.getElementById("CB_Lchat_content" + n)

  if (!b)
    b = resizeB.innerText

  var h
  if (b == Chatbox_buttons.normal) {
    chatW_state = 1
    h = chatW_dimension(c_content).min.h
    resizeB.innerText = Chatbox_buttons.max
  }
  else {
    chatW_state = 2
    h = chatW_dimension(c_content).max.h
    resizeB.innerText = Chatbox_buttons.normal
  }
  c_content.style.pixelHeight = h

  if (w_content.style.visibility == "hidden") {
    document.getElementById("CB_SminimizeB" + n).innerText = Chatbox_buttons.min
    w_content.style.visibility = "inherit"
w3c_chatDisplay(1)

    c_content.style.pixelWidth = chatW_dimension(c_content).max.w

    Chatbox_EnableUpdate(true)
  }

  chatW_fix(n)
}

var _w3c_dom_left_mod = ((_w3c_ie8) ? 4 : 0)

function chatW_place(n) {
  if (Chatbox_no_auto_place)
    return

  var win = document.getElementById("CB_Lwindow" + n)
  if (win.bottom)
    win.style.bottom = win.bottom + "px"
  else
    win.style.posTop = ((win.top) ? win.top : ((/animetheme\.html/i.test(self.location.href) || (document.body.scrollTop > 242)) ? 0 : 242-document.body.scrollTop) + 5) + document.body.scrollTop
  win.style.posLeft = ((win.left > 0) ? win.left : sw - win.style.pixelWidth + win.left) + document.body.scrollLeft - _w3c_dom_left_mod
}

function chatW_fix(n) {
  var w_content = document.getElementById("CB_Lwindow_content" + n)

  var w = w_content.offsetWidth
if (!w) { w = 414 }
  var h = (w_content.style.visibility == "hidden") ? 0 : w_content.offsetHeight

  var win = document.getElementById("CB_Lwindow" + n)
  var s = win.style
  s.pixelWidth = w + 8 - ((_w3c_ie8) ? 4 : 0)
  s.pixelHeight = h + 28 - ((_w3c_ie8) ? 4 : 0)
  if (win.left < 0) {
    var left = sw - s.pixelWidth + win.left
    if (s.posLeft > left)
      s.posLeft = left
  }

  document.getElementById("CB_Lcaption" + n).style.pixelWidth = w
  document.getElementById("CB_Lmenu_upper" + n).style.pixelWidth = w + 2*2
  document.getElementById("CB_Lmenu_lower" + n).style.pixelWidth = w - 2*2

  var x_offset = 0
  if (document.getElementById("CB_LcloseB" + n)) {
    document.getElementById("CB_LcloseB" + n).style.posLeft = w - 18
    x_offset = -16
  }

  document.getElementById("CB_LminimizeB" + n).style.posLeft = w - 34 + x_offset
  document.getElementById("CB_LresizeB" + n).style.posLeft = w - 18 + x_offset
}

var drag_timerID, drag_obj, drag_num, drag_eX, drag_eY

function chatW_dragStart(ev, n, o) {
  if (Chatbox_no_drag)
    return

  if (!ev)
    ev = event

  drag_obj = o
  drag_num = n

  var win = document.getElementById("CB_Lwindow" + n)
  o.org_left = win.style.posLeft
  if (win.bottom)
    o.org_bottom = parseInt(win.style.bottom)
  else
    o.org_top = win.style.posTop
  o.org_x = ev.clientX
  o.org_y = ev.clientY

  document.getElementById("CB_Lwindow_content" + n).style.visibility = "hidden"
}

if (!Chatbox_no_drag) {

document.addEventListener("mousemove", function (ev) {
  game_idle_count = 0

  if (drag_obj) {
    drag_eX = ev.clientX
    drag_eY = ev.clientY

    if (!drag_timerID) {
      var s = document.getElementById("CB_Lwindow" + drag_num).style
      drag_timerID = setTimeout(function () {
s.posLeft = drag_eX + (drag_obj.org_left - drag_obj.org_x)
if (drag_obj.org_bottom != null)
  s.bottom = ((drag_obj.org_y - drag_eY) + drag_obj.org_bottom) + "px"
else
  s.posTop = drag_eY + (drag_obj.org_top - drag_obj.org_y)
drag_timerID = null
      }, 100);
    }
  }
});

document.addEventListener("mouseup", function () {
  if (drag_obj) {
    drag_obj = null

    if (document.getElementById("CB_SminimizeB" + drag_num).innerText != Chatbox_buttons.normal)
      document.getElementById("CB_Lwindow_content" + drag_num).style.visibility = "inherit"

    if (drag_timerID) {
      clearTimeout(drag_timerID)
      drag_timerID = null
    }
  }
});

}

var sw, sh

function Chatbox_scroll_adjust() {
  var b = document.body
  sw = b.clientWidth
  sh = b.clientHeight
}

// old functions END


var Chatbox_buttons = (_w3c_dom) ? { min:"_", max:"m", normal:"s" } : { min:0, max:1, normal:2 }

var w3c_button_map = []
w3c_button_map[Chatbox_buttons.min] = "button_min"
w3c_button_map[Chatbox_buttons.max] = "button_max"
w3c_button_map[Chatbox_buttons.normal] = "button_normal"

function w3c_button_write(str) {
  this.innerText_v = str
  this.innerHTML = '<img src="' + status_imgs[w3c_button_map[str]].src + '">'
}

function w3c_button_read() {
  return this.innerText_v
}

function Chatbox_Write() {
  function css_color(code, id) {
    var color = ChatboxAT.css[code].join(",")
    var opacity
    if (id) {
      opacity = ChatboxAT.css.opacity[id] || 0
    }
    if (!opacity)
      return "rgb(" + color + ")"
    return "rgba(" + color + "," + opacity + ")"
  }

  if (!Chatbox_enabled)
    return

  if (!Chatbox_intro_msg) {
    Chatbox_intro_msg =
  '<p>Anime Theme World Online - Chatbox Mini (' + Chatbox_version + ')</p>\n'
+ '<p>For bug reports and comments, <a href="/cgi-bin/ikonboard/topic.cgi?forum=4&topic=502" class=AutoChatCommand>visit this topic.</a></p>\n'
+ '<p>Not a member? <a href="http://www.animetheme.com/cgi-bin/ikonboard/register.cgi" class=AutoChatCommand>Register now!</a></p>';
  }

  var button_color = [css_color("BUTTONHIGHLIGHT"), css_color("BUTTONSHADOW"), css_color("BUTTONSHADOW"), css_color("BUTTONHIGHLIGHT")].join(" ")

  var cursor = (_w3c_ie8) ? "pointer" : "hand"

  var id = ""
  var pass = ""

  if (/amembernamecookie=([^;]+)/.exec(document.cookie))
    id = unescape(RegExp.$1)
  else if (self.member_name)
    id = member_name

  if (/apasswordcookie=([^;]+)/.exec(document.cookie))
    pass = unescape(RegExp.$1)
  else if (self.member_pass)
    id = member_pass

  document.write(
  '<style>\n'
+ '.Taskbar { overflow:hidden; background-color:' + css_color("MENU") + '; border-style:outset; border-width:2px; border-color:' + button_color + ' }\n'
+ '.SmallButton { position:relative; top:-5px; left:0px; font-size:12px; font-family:Webdings, Comic Sans MS }\n'
+ '.Msg_Default { margin:2px; font-style:italic }\n'
+ '.Chat_Default { margin:2px }\n'

+ '.Chat_Default_darkblue { margin:2px; font-weight:bold; color:darkblue }\n'
+ '.Chat_Default_darkred  { margin:2px; font-weight:bold; color:darkred }\n'

+ '.AutoChatCommand { color:blue }\n'
+ '.AutoChatCommand:hover { color:blue }\n'
+ '</style>\n'

+ '<DIV id=CB_Lwindow0 class=Taskbar style="background-color:transparent; position:absolute; color:black; font-family:Arial; font-size:12px; z-index:99; visibility:hidden">\n'

+ '<DIV id=CB_Lmenu_upper0 style="position:absolute; top:0px; left:0px; background-color:' + css_color("MENU","CB_Lmenu") + '; height:' + (18+2*2) + 'px; overflow:hidden">\n'
+ '<DIV id=CB_Lcaption0 style="position:absolute; top:2px; left:2px; background-color:' + css_color("ACTIVECAPTION") + '; height:18px; overflow:hidden" onSelectStart="return false">\n'
+ '<img id=CB_Lchat_status_img style="position:absolute; top:1px; left:1px">\n'
+ '<span id=CB_Lchat_title style="position:absolute; left:20px; top:1px; color:white; cursor:default">Ready</span>\n'
+ '<div id=CB_LminimizeB0 class=Taskbar style="position:absolute; top:2px; width:16px; height:14px; padding:0px; overflow:hidden; cursor:'+cursor+'" onMouseDown="event.cancelBubble=true"><span class=SmallButton id=CB_SminimizeB0>'+Chatbox_buttons.min+'</span></div>\n'
+ '<div id=CB_LresizeB0 class=Taskbar style="position:absolute; top:2px; width:16px; height:14px; padding:0px; overflow:hidden; cursor:'+cursor+'" onMouseDown="event.cancelBubble=true"><span class=SmallButton id=CB_SresizeB0>'+Chatbox_buttons.max+'</span></div>\n'
+ '</DIV>\n'
+ '</DIV>\n'

+ '<DIV id=CB_Lwindow_content0 style="position:absolute; top:22px; left:2px; border-style:inset; border-width:2px; border-color:' + button_color + '">\n'

+ '<div id=CB_Lchat_content0 style="background-color:' + css_color("WHITE","CB_Lchat_content") + '; padding:5px; width:400px; height:100px; overflow:auto"' + ((self.isDesktop) ? ' onClick="var rv_dummy = autoRun(event); if (rv_dummy != null) return rv_dummy"' : '') + '>\n'
+ Chatbox_intro_msg
+ '</div>\n'

+ '<DIV id=CB_Lmenu_lower0 style="background-color:' + css_color("MENU","CB_Lmenu") + '; overflow:hidden">\n'
+ '<div style="width:400px; height:28px; overflow:hidden">\n'
+ '<form id=Fchat>\n'
+ '<table style="width:100%">\n'
+ '<tr>\n'
+ '<td align=left><INPUT id=Fchat_msg style="font-family:Arial; font-size:12px; width:' + ((_w3c_ie8) ? 330 : 340) + 'px" TYPE=TEXT NAME=msg placeholder="Type your message."></td>\n'
+ '<td align=right><INPUT style="font-family:Arial; font-size:12px; font-weight:bold" TYPE=SUBMIT VALUE="Send"></td>\n'
+ '</tr>\n'
+ '</table>\n'
+ '</form>\n'
+ '</div>\n'

+ '<div style="width:400px; height:28px; overflow:hidden">\n'
+ '<form id=Flogin>\n'
+ '<table style="width:100%">\n'
+ '<tr>\n'
+ '<td align=left style="color:black;font-family:Arial; font-size:12px; font-weight:bold">ID: <INPUT id=Flogin_id style="font-family:Arial; font-size:12px; width:160px" TYPE=TEXT NAME=id value="' + id + '"></td>\n'
+ '<td align=right style="color:black;font-family:Arial; font-size:12px; font-weight:bold">Pass: <INPUT id=Flogin_pass style="font-family:Arial; font-size:12px; width:160px" TYPE=password NAME=pass value="' + pass + '"></td>\n'
+ '</tr>\n'
+ '</table>\n'
+ '</form>\n'
+ '</div>\n'
+ '</DIV>\n'

+ '</DIV>\n'
+ '</DIV>\n'
  )
}

function Chatbox_zoom(zoom) {
  if (!SystemAnimator_mode) return;

  if ((zoom == 1) && (window.devicePixelRatio > 2))
    zoom *= 1.5
  zoom /= window.devicePixelRatio
  document.getElementById("CB_Lwindow0").style.transform = (zoom == 1) ? 'none' : 'scale(' + zoom + ')';
}

function Chatbox_Init() {
  if (!Chatbox_enabled)
    return

  document.all


// save some global exports
document.getElementById("CB_Lcaption0").addEventListener("mousedown", function (event) {
  event.preventDefault();
  event.stopPropagation();
  if (SystemAnimator_mode) {
    chatW_minimize(0)
  }
  else {
    chatW_dragStart(event, 0, this);
  }
});
document.getElementById("CB_LminimizeB0").addEventListener("click", function (event) {
  event.preventDefault();
  event.stopPropagation();
  chatW_minimize(0);
});
document.getElementById("CB_LresizeB0").addEventListener("click", function (event) {
  event.preventDefault();
  event.stopPropagation();
  chatW_resize(0);
});
document.getElementById("Fchat").addEventListener("submit", function (event) {
  event.preventDefault();
  event.stopPropagation();
  SendData_ChatSend();
  Chatbox_zoom(1)
});

  document.getElementById("Fchat").addEventListener("keydown", function (event) {
//event.preventDefault();
event.stopPropagation();
  });
  document.getElementById("Fchat").addEventListener("focusin", function (event) {
//event.preventDefault();
event.stopPropagation();
document.getElementById("Fchat_msg").style.color = "black"
Chatbox_zoom(2)
  });
  document.getElementById("Fchat").addEventListener("focusout", function (event) {
//event.preventDefault();
event.stopPropagation();
document.getElementById("Fchat_msg").style.color = "gray"
Chatbox_zoom(1)
  });
  document.getElementById("Flogin").addEventListener("keydown", function (event) {
//event.preventDefault();
event.stopPropagation();
  });

  (document.getElementById("Lbody_host")||document.body).addEventListener("mousedown", function (event) {
    document.getElementById("Fchat_msg").blur()
  });
  document.getElementById("CB_Lwindow0").style.transformOrigin = "top right";

  if (SystemAnimator_mode) {
    document.getElementById("CB_Lwindow0").addEventListener("mousedown", function (event) {
      //event.preventDefault();
      event.stopPropagation();
    });
    document.getElementById("Flogin_id").placeholder = "arbitrary id for in-game chat"
    document.getElementById("Flogin_pass").placeholder = "blank for in-game chat"

    window.addEventListener("SA_SpeechBubble_show", function () {
      document.getElementById("CB_Lwindow0").style.opacity = 0.4
      Chatbox_zoom(1)
    });
    window.addEventListener("SA_SpeechBubble_hide", function () {
      document.getElementById("CB_Lwindow0").style.opacity = 1
    });

    CB_Lchat_content0.addEventListener("click", function (e) {
var target = e.target

if ((target.tagName != "A") && target.parentElement)
  target = target.parentElement

if ((target.tagName == "A") && !target.onclick) {
  if (webkit_electron_mode) {
    webkit_electron_remote.shell.openExternal(target.href)
    e.preventDefault()
    e.stopPropagation()
  }
}
    }, true)
  }

  Chatbox_scroll_adjust()

  if (!Chatbox_no_scroll_adjust) {
    window.addEventListener("resize", function () {
      Chatbox_scroll_adjust();
      chatW_place(0);
    });

    window.addEventListener("scroll", function () {
      chatW_place(0);
    });
  }

  if (!CB_Lwindow0.left)
    CB_Lwindow0.left = (Chatbox_no_scroll_adjust || SystemAnimator_mode) ? -5 : -20
  CB_Lchat_content0.max_height = 300
  CB_Lchat_content0.min_height = 100

if (_w3c_ie8) {
  CB_LminimizeB0.style.pixelWidth -= 4
  CB_LminimizeB0.style.pixelHeight -= 4
  CB_LresizeB0.style.pixelWidth -= 4
  CB_LresizeB0.style.pixelHeight -= 4

  CB_SminimizeB0.style.top = ((ie8_mode) ? -2 : -1) + "px"
  CB_SresizeB0.style.top = ((ie8_mode) ? -2 : -1) + "px"
}

if (_w3c_dom) {
  status_imgs["button_min"] = new Image()
  status_imgs["button_min"].src = "data:image/gif;base64,R0lGODlhDAAKAIAAAAAAAP///yH5BAEAAAEALAAAAAAMAAoAAAINjI+py+0PIwO0qmpNAQA7";//"/w3c_button_min.gif"
  status_imgs["button_max"] = new Image()
  status_imgs["button_max"].src = "data:image/gif;base64,R0lGODlhDAAKAIAAAAAAAP///yH5BAEAAAEALAAAAAAMAAoAAAIVjI8Iy3wNXzJAzkpnwFtzrljJBzkFADs=";//"/w3c_button_max.gif"
  status_imgs["button_normal"] = new Image()
  status_imgs["button_normal"].src = " data:image/gif;base64,R0lGODlhDAAKAIAAAAAAAP///yH5BAEAAAEALAAAAAAMAAoAAAIWjI8ZwK3tEkDzQLbozVZX83HUKG1HAQA7";//"/w3c_button_normal.gif"

  CB_SminimizeB0.__defineSetter__("innerText", w3c_button_write)
  CB_SminimizeB0.__defineGetter__("innerText", w3c_button_read)

  CB_SresizeB0.__defineSetter__("innerText", w3c_button_write)
  CB_SresizeB0.__defineGetter__("innerText", w3c_button_read)

  CB_SminimizeB0.innerText = Chatbox_buttons.min
  CB_SresizeB0.innerText = Chatbox_buttons.max
}

  Chatbox_zoom(1)
  if (Chatbox_no_auto_open || (/chatbox_minimized=1|chatbox_opened=1/.test(document.cookie) && !SystemAnimator_mode))
    chatW_minimize(0)
  else {
    chatW_fix(0)
    chatW_place(0)

    server_update_timerID = setTimeout(function () { SendData_Main(); }, 100)
  }

  status_imgs["ready"] = new Image()
  status_imgs["ready"].src = CB_Lchat_status_img.src = "data:image/gif;base64,R0lGODlhEAAQAPeNAKHalbfgr0ySj7Hfqo/Xe43WeluxXTyJ1xFgtlSEvXu/+1yr+unu6Fmo+YfF/s7svLDc/5zcizF9lJjai1elnG+9/1aJmVikhmW6RFGuR3HIVV2fcaPfl0eCqnnOZWOu9pPXgXXGbEqKjly5i1mm9kiiVezy6nu9/ujw4/Tx9qHUoT6Hn1mzbazeo0iY6nmzmW2vpna3mhxXmcfowGy4/8/pzD+CyEmbUmu1/7zhqjF7ymGy/1Se5zl7lUKO3GCp7svoxanclleZZqjdnVKVzKTdmKvjmoLTcLHfqdfv/tfu/1y0XD2I0xJgumev91qBjrLf/lCmRHS8tIrVe1OucXTDj1KedV+OvZvQ/lyq9mia1dzr+sDkuiFwxHO/YkB7tlOCuYrPlNHryKDcjSFsw0R5wZ7ZkWus2F2h5bfgrkWWbpbTiFmgm0h4q43NgGa6SpLBnMfnvpXRgh91jS19zzWLi9rq13ay7ZzR/nfA/7HjpVZ/qeby00J2rFW2qGWk5HHKXdPo0p/W/zuK3nSp6Y3WdB5wx7rb/FOBjT+eR1WNyEqe8ZHdeAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAI0ALAAAAAAQABAAAAi/ABsJHEiwIMErewwqXCTISROBUsKwEFGwjYskELSQ8fMAxZhEiAp2UXCC0BcDYlLMeFOnIAI6WQY1ukGASxFAAggquoPmw4EyKzIUADGi4A8lWw5B+UMhhJs1VAjaWJAHDxYHMfiYAJImRxULAg35IEFjxxk5cQIxsFMjiBqBMnQ0qIADRiEAAwIgaRGhxMA+TIjwsKJhCoAhZiYcidKjIBgJSxgZ0cPBiwcMcxIYfMLmBRwVQjZc6KCwtGnTAQEAOw==";//"/_at_messenger.gif"
  status_imgs["busy"] = new Image()
  status_imgs["busy"].src = "data:image/gif;base64,R0lGODlhEAAQAPQAAAAAAP///wYGBsbGxnp6evj4+NjY2CgoKFZWVujo6IiIiJiYmBoaGmZmZjg4OLa2tqioqAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAEAAQAAAFUCAgjmRpnqUwFGwhKoRgqq2YFMaRGjWA8AbZiIBbjQQ8AmmFUJEQhQGJhaKOrCksgEla+KIkYvC6SJKQOISoNSYdeIk1ayA8ExTyeR3F749CACH5BAkKAAAALAAAAAAQABAAAAVoICCKR9KMaCoaxeCoqEAkRX3AwMHWxQIIjJSAZWgUEgzBwCBAEQpMwIDwY1FHgwJCtOW2UDWYIDyqNVVkUbYr6CK+o2eUMKgWrqKhj0FrEM8jQQALPFA3MAc8CQSAMA5ZBjgqDQmHIyEAIfkECQoAAAAsAAAAABAAEAAABWAgII4j85Ao2hRIKgrEUBQJLaSHMe8zgQo6Q8sxS7RIhILhBkgumCTZsXkACBC+0cwF2GoLLoFXREDcDlkAojBICRaFLDCOQtQKjmsQSubtDFU/NXcDBHwkaw1cKQ8MiyEAIfkECQoAAAAsAAAAABAAEAAABVIgII5kaZ6AIJQCMRTFQKiDQx4GrBfGa4uCnAEhQuRgPwCBtwK+kCNFgjh6QlFYgGO7baJ2CxIioSDpwqNggWCGDVVGphly3BkOpXDrKfNm/4AhACH5BAkKAAAALAAAAAAQABAAAAVgICCOZGmeqEAMRTEQwskYbV0Yx7kYSIzQhtgoBxCKBDQCIOcoLBimRiFhSABYU5gIgW01pLUBYkRItAYAqrlhYiwKjiWAcDMWY8QjsCf4DewiBzQ2N1AmKlgvgCiMjSQhACH5BAkKAAAALAAAAAAQABAAAAVfICCOZGmeqEgUxUAIpkA0AMKyxkEiSZEIsJqhYAg+boUFSTAkiBiNHks3sg1ILAfBiS10gyqCg0UaFBCkwy3RYKiIYMAC+RAxiQgYsJdAjw5DN2gILzEEZgVcKYuMJiEAOwAAAAAAAAAAAA==";//"/_ajax-loader.gif"

  document.cookie = (Chatbox_no_auto_open) ? "chatbox_minimized=0" : "chatbox_opened=1"

  CB_Lwindow0.style.visibility = "inherit"

  window.addEventListener("unload", function () {
    document.cookie = "chatbox_opened=0"
  });
}

var Last_Msgs = []
var Last_Msg, Lchat_timerID
var Last_Msg_color = "#000080"
var Chat_colors = ["darkblue", "darkred"]
var Chat_colors_default = ["darkblue", "darkred"]

var status_imgs = []

// MAIN

var Chatbox_class = (_w3c_dom) ? "class" : "className"

function Chatbox_MessageAppend(msg, className) {
  var c = document.getElementById("CB_Lchat_content0")

  var p = document.createElement("P")
  if (!className) {
    Last_Msg_color = (Last_Msg_color == Chat_colors[0]) ? Chat_colors[1] : Chat_colors[0]
    className = "Chat_Default_" + Last_Msg_color
  }
  p.setAttribute(Chatbox_class, className)

  if (className == "Msg_Default") {
status=msg
    p.innerHTML = msg
  }
  else {
    var txt = document.createTextNode(msg)
    p.appendChild(txt)
  }

  c.appendChild(p)
}

// MAIN

var isGM, system_is_busy, account_id, server_update_timerID, CGI_timerID
var resend_interval = 30
var server_update_interval = 30
var od = {}

var msg_warning_quota = 3
var msg_warning_banned = "You have been BANNED from typing any message in this session."

function checkChatCommand(v) {
  var command = null
  var para1 = null
  var para2 = null

  var r = /^\/(\w+)/
  r.exec(v)
  command = RegExp.$1

  r = /^\/\w+ \[([^\]]+)\]/
  if (r.exec(v)) {
    para1 = RegExp.$1
    r = /^\/\w+ \[[^\]]+\] (.+)$/
    if (r.exec(v))
      para2 = RegExp.$1
  }
  else {
    r = /^\/\w+ (.+)$/
    if (r.exec(v))
      para1 = RegExp.$1
  }

  return { command:command, para1:para1, para2:para2 }
}

function cleanMessage(msg, basic_check) {
  if (isGM)
    return msg

  if (msg.length > 200) {
    msg = msg.substring(0, 200)

    alert("Your message is too long. Please use less than 200 characters in a single message.")
    return msg
  }

  var org_msg = msg

  msg = msg.replace(/f.?u.?c.?k/gi, "love").replace(/b.?i.?t.?c.?h|cunt/gi, "cutie").replace(/m.?[o0].?r.?[o0].?n|a.?s.?s.?h.?[o0].?l.?e|d.?u.?m.?b[^ ]{3,}/gi, "smartie").replace(/damn you/gi, "bless you").replace(/gay|fag/gi, "man")

  if (msg != org_msg)
    alert("WARNING: NO foul or discriminatory words are allowed. Repeated offenders will be BANNED.")

  if (basic_check)
    return msg

  var warning_msg = ""

  var letters_only = msg.replace(/\W/g, "")
  var letters_length = letters_only.length
  var caps_ratio = letters_only.replace(/[^A-Z]/g, "").length / letters_length
  var caps_warning

  if (letters_length <= 10) {
    if ((letters_length >= 5) && (caps_ratio > 0.7))
      caps_warning = true
  }
  else {
    if (caps_ratio > 0.5)
      caps_warning = true
  }

  if (caps_warning) {
    msg = msg.toLowerCase()

    warning_msg += "WARNING: NO abuse of caps lock is allowed.\n"
  }

  var spam_warning

  if (msg.length > 10) {
    var r = /(.)\1{6,}/i
    while (r.exec(msg)) {
      msg = msg.replace(r, "$1")
      spam_warning = true
    }
  }
  if (msg.length > 20) {
    var letters_ratio = msg.replace(/\W/g, "").length / msg.length
    if (letters_ratio < 0.5) {
      msg = "(message deleted)"
      spam_warning = true
    }
  }

  if (spam_warning)
    warning_msg += "WARNING: NO spam message is allowed.\n"

  if (msg != org_msg) {
    msg_warning_quota--
    warning_msg += "\nRepeated offenders will be BANNED from typing any message in this session."
    alert(warning_msg)
  }

  return msg
}

function SendData_ChatSend(msgs) {
  if (!msgs) {
    var v = Fchat.msg.value
    if (!v)
      return

    var p = "AT Citizen(" + Flogin.id.value + "): "

    v = v.replace(/\|/g, "&#0124;")

    if (SystemAnimator_mode) {
      var _v = System._browser.P2P_network.process_message(v)
      if (!_v)
        return
      v = _v
    }

    if (!/^\//.test(v)) {
if (msg_warning_quota <= 0) {
  alert(msg_warning_banned)
  return
}
      v = p + cleanMessage(v)
      v = "/shout " + v
    }
    else {
      var command, para1, para2
      var obj = checkChatCommand(v)
      command = obj.command
      para1 = obj.para1
      para2 = obj.para2

switch (command) {
  case "chatlog":
    if (!para1 || (para1.length > 50)) {
      smallMsg("A short title with no more than 50 letters is required. Example: /chatlog Guest8 is spamming!")
      return
    }
    v = "/chatlog [" + para1.replace(/\[/g, "(").replace(/\]/g, ")") + "] " + ChatLog()
    break

  case "GM":
    v = "/GM"
    break

  case "js":
    if (!isGM) {
      smallMsg("Unauthorized action")
      return
    }
    if (!para1) {
      smallMsg("Syntax error")
      return
    }
    try { eval(para1) } catch (ex) { alert("JS error!") }
    return

  case "gag1":
  case "gag24":
  case "gag168":
    if (!para1) {
      smallMsg("Syntax error")
      return
    }
    v = "/" + command + " [" + para1 + "] " + ChatLog()
    break

  case "ungag":
    if (!para1) {
      smallMsg("Syntax error")
      return
    }
    break

  case "host":
    if (!SystemAnimator_mode) {
      smallMsg("Unauthorized action")
      return
    }
    break

  default:
    smallMsg("Unknown command")
    return
}
    }

    msgs = [v]

    Fchat.msg.value = ""
  }
//  Fchat.msg.value = ""

  if (system_is_busy) {
    var msgs_str = "["
    for (var i = 0; i < msgs.length; i++) {
      var v = msgs[i]
      v = v.replace(/\\/g, '\\\\')
      v = v.replace(/"/g, '\\"')
      msgs_str += '"' + v + '",'
    }
    msgs_str = msgs_str.replace(/\,$/, "]")

    SendData_CGIQueue("SendData_ChatSend2(" + msgs_str + "); SendData_Main()")
  }
  else {
    SendData_ChatSend2(msgs)
  }
}

function ChatLog() {
  var v = CB_Lchat_content0.innerText.replace(/[\n\r]/g, "&#0124;")
  return v
}

function smallMsg(v) {
  ChatShow(['<p class=Msg_Default>' + v + '</p>'])
}

function updateSystemStatus(state) {
  CB_Lchat_status_img.src = status_imgs[state].src

  var msg

  if (state == "busy") {
    msg = "Updating content..."
    system_is_busy = true

    if (server_update_timerID) {
      clearTimeout(server_update_timerID)
      server_update_timerID = null
    }

    CGI_timerID = setTimeout(function () { CGI_resend(); }, 1000*resend_interval)
  }
  else {
    if (CGI_timerID) {
      clearTimeout(CGI_timerID)
      CGI_timerID = null
    }

    msg = "System is ready (" + server_update_interval + ")."

    if (CB_Lwindow_content0.style.visibility != "hidden")
      server_update_timerID = setTimeout(function () { SendData_Main(); }, 1000*server_update_interval)

    setTimeout(function () { system_is_busy = false; if (od.next_CGI) eval(od.next_CGI); }, 1000)
  }

  if (msg)
    CB_Lchat_title.innerText = msg
}

function Chatbox_EnableUpdate(enabled) {
  if (server_update_timerID) {
    clearTimeout(server_update_timerID)
    server_update_timerID = null
  }

  if (enabled && !system_is_busy)
    server_update_timerID = setTimeout(function () { SendData_Main(); }, 1000*1)

  document.cookie = "chatbox_minimized=" + ((enabled) ? 0 : 1)
}

function CGI_resend() {
  CB_Lchat_title.innerText = "Server busy, retrying..."

//  ajax.abort()
  Chatbox_Update()

  CGI_timerID = setTimeout(function () { CGI_resend(); }, 1000*resend_interval)
}

function SendData() {
  if (!Chatbox_online_mode) {
    status = "Chatbox: OFFLINE mode"
    return
  }

  updateSystemStatus("busy")
//setTimeout('updateSystemStatus("ready"); ChatShow(Chatbox_msg.split("|"))', 1000)
//return

  Chatbox_Update()
}

function SendData_Main() {
  SendData()
}

var Chatbox_msg

function SendData_ChatSend2(msgs) {
  var msg = msgs.join("|")

  Chatbox_msg = msg

  if (!od.next_CGI) {
    SendData_Main()
  }
}

function SendData_CGIQueue(f) {
  f += "; od.next_CGI=null"
  if (!od.next_CGI) {
    od.next_CGI = f
    return
  }
  if (/^SendData_Main/.test(f))
    return

  var r
  if (/SendData_ChatSend2/.test(od.next_CGI)) {
    if (/SendData_ChatSend2/.test(f)) {
      r = /SendData_ChatSend2\(\[(.+)\]\);/
      r.exec(od.next_CGI)
      var org_msgs = RegExp.$1
      r.exec(f)
      new_msgs = org_msgs + "," + RegExp.$1
      od.next_CGI = od.next_CGI.replace(r, "SendData_ChatSend2([" + new_msgs + "]);")
    }
    else {
      if (!/SendData_Main/.test(od.next_CGI)) {
        alert("System error!")
        return
      }
      r = /(SendData_ChatSend2\(\[.+\]\));/
      r.exec(od.next_CGI)
      od.next_CGI = RegExp.$1
      od.next_CGI += "; " + f
    }
  }
  else if (/^SendData_Main/.test(od.next_CGI)) {
    od.next_CGI = f
  }
  else if (/SendData_ChatSend2/.test(f)) {
    r = /(SendData_ChatSend2\(\[.+\]\));/
    r.exec(f)
    od.next_CGI = RegExp.$1 + "; " + od.next_CGI
  }
  else
    alert("System error!")
}

var mute_list = []

function CheckMute(v) {
  return ((/^[\w ]+\(([\w ]+)\):/.exec(v)) && (mute_list.indexOf(RegExp.$1) != -1))
}

var peer_announced = {}

function ChatShow(msgs) {
  var auto_scroll = (CB_Lchat_content0.scrollTop > CB_Lchat_content0.scrollHeight - CB_Lchat_content0.clientHeight - 20)

  if (!msgs.length) {
    if (Chatbox_is_first_msg) {
      msgs = ['<p class=Msg_Default>(No new message in the last 15 minutes)</p>']

      server_update_interval = 60
      document.cookie = "chatbox_minimized=1"
    }
  }
  else {
    if (server_update_interval > 30)
      document.cookie = "chatbox_minimized=0"

    server_update_interval = 30
  }

  Chatbox_is_first_msg = false

  var msg_processed

  for (var i = 0; i < msgs.length; i++) {
    var v = msgs[i]
    var className = ""

    if (!/^\//.test(v)) {
      if (CheckMute(v))
        continue

      if (/^<(\w+).+?class=(\w+).*?>(.+)<\/\1>$/.exec(v)) {
        v = RegExp.$3
        className = RegExp.$2
      }
    }
    else {
      var command, para1, para2
      var obj = checkChatCommand(v)
      command = obj.command
      para1 = obj.para1
      para2 = obj.para2

switch (command) {
  case "shout":
    if (CheckMute(para1))
      continue

    v = para1
    break
  case "js":
    if (para1 != "+chatbox+")
      continue

    try { eval(unescape(para2)) } catch (ex) { alert("JS error!") }
    continue
  case "host":
//$peer_id | $game_id, $game_path, $connection_count, $connection_max, $name
    var paras = decodeURIComponent(para2).split("|");
    if (peer_announced[para1] || (SystemAnimator_mode && parent.System._browser.P2P_network.peer_default && (para1 == parent.System._browser.P2P_network.peer_default.id)))
      continue
    peer_announced[para1] = true

    className = "Msg_Default";
    v = (paras[4] || 'Someone') + ' is hosting a game(' + (paras[0]) + ')! ';
    var game_url = 'https://sao.animetheme.com/?cmd_line=' + (paras[1]) + '&host_peer_id=' + (para1);
    if (SystemAnimator_mode) {
      v += '<a href="' + game_url + '" onclick="try { MMD_SA_options.Dungeon.multiplayer.connect(\'' + (para1) + '\'); } catch (err) { console.error(err); }; return false;">Join now!</a>';
    }
    else {
      v += '<a href="' + game_url + '" target="_top">Join now!</a>';
    }
    break
// Ignore all unknown commands
  default:
    continue
}
    }

    v = v.replace(/\&gt;/g, ">").replace(/\&lt;/g, "<").replace(/\&quot;/g, '"').replace(/\&amp;/g, "&")

    Chatbox_MessageAppend(v, className)

    msg_processed = true
  }

  if (!msg_processed)
    return

  try {
    var cn = CB_Lchat_content0.childNodes
    if (cn.length > 150) {
      for (var i = 0; i < 20; i++)
        CB_Lchat_content0.removeChild(CB_Lchat_content0.firstChild)
    }

    if (!Lchat_timerID && auto_scroll) {
CB_Lchat_content0.scrollTop = CB_Lchat_content0.scrollHeight - CB_Lchat_content0.clientHeight;
/*
      if (SystemAnimator_mode) {
Lchat_timerID = null; CB_Lchat_content0.scrollTop = CB_Lchat_content0.scrollHeight - CB_Lchat_content0.clientHeight;
      }
      else
        Lchat_timerID = setTimeout(function () { Lchat_timerID = null; CB_Lchat_content0.scrollTop = CB_Lchat_content0.scrollHeight - CB_Lchat_content0.clientHeight; }, 0)
*/
    }
  }
  catch (ex) {
    status = "Error updating Chat Window!"
  }
}

// AJAX

function createXMLHttpRequest() {
  var http
  if (window.XMLHttpRequest)
    http = new XMLHttpRequest()
  else if (window.ActiveXObject)
    http = new ActiveXObject("Microsoft.XMLHTTP")
  else
    alert("ERROR: No XMLHttpRequest supported")

  return http
}

var Chatbox_is_first_msg = true
var Chatbox_last_msg_ID = -1

var ajax

function Chatbox_Update() {
  var paras = ["id=" + encodeURIComponent(Flogin.id.value), "pass=" + encodeURIComponent(Flogin.pass.value), "last_msg_ID=" + Chatbox_last_msg_ID]
  if (Chatbox_msg)
    paras[paras.length] = "msg=" + encodeURIComponent(Chatbox_msg)
  if (ChatboxAT.channel)
    paras[paras.length] = "channel=" + ChatboxAT.channel

  var query = paras.join("&")

  if (!ajax)
    ajax = createXMLHttpRequest()

  ajax.open("post", "https://www.animetheme.com/cgi-bin/rpgd_online/chatbox.cgi", true)

// trick to reuse XHR, assigning this event function AFTER open()
  ajax.onreadystatechange = Chatbox_Receive

  ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8")
  ajax.send(query)
}

var Ajax_OK

function Chatbox_Receive() {
  if (ajax.readyState != 4)
    return

  var js = ajax.responseText
  if (!/^Ajax_OK/.test(js)) {
    Chatbox_Error(js)
    return
  }

  Chatbox_msg = ""

  try {
    eval(js)
  }
  catch (ex) {
    Chatbox_Error(js)
  }

  updateSystemStatus("ready")
}

var Ajax_error_met

function Chatbox_Error(js) {
  return

/*
  if (Ajax_error_met)
    return

  Ajax_error_met = true
  alert("Error! Please write down the message below or take a screenshot, and report it to me.\n\n" + js)
*/
}

// global export
/*
self.chatW_dragStart = chatW_dragStart
self.chatW_minimize = chatW_minimize
self.chatW_resize = chatW_resize
self.SendData_Main = SendData_Main
*/
// for animetheme.html
self.Chatbox_buttons = Chatbox_buttons

self.Chatbox_Write = Chatbox_Write
self.Chatbox_Init = Chatbox_Init

self.ChatboxAT = {
  ChatShow: ChatShow
 ,smallMsg: smallMsg
 ,checkChatCommand: checkChatCommand
 ,SendData_ChatSend: SendData_ChatSend
 ,Chatbox_version: Chatbox_version
 ,chatW_place: chatW_place
 ,chatW_minimize: chatW_minimize

 ,Chatbox_online_mode: function () { return Chatbox_online_mode; }

 ,css: {
    MENU: [246,246,246]
   ,BUTTONHIGHLIGHT: [217,217,217]
   ,ACTIVECAPTION: [99,99,99]//[153,180,209]//[198,198,198]
   ,BUTTONSHADOW: [47,47,47]
   ,WHITE: [255,255,255]
   ,opacity: {}
  }
};
/*
ChatboxAT.css = {

// https://www.schemecolor.com/rain-clouds-color-scheme.php
    MENU: [212, 213, 200]
   ,BUTTONHIGHLIGHT: [168, 174, 171]
   ,ACTIVECAPTION: [78, 102, 105]
   ,BUTTONSHADOW: [27, 47, 58]


//https://www.schemecolor.com/dull-gradient-colors.php
    MENU: [210, 208, 197]
   ,BUTTONHIGHLIGHT: [175, 164, 146]
   ,ACTIVECAPTION: [102, 87, 59]
   ,BUTTONSHADOW: [79, 62, 39]

};
*/

//if (SystemAnimator_mode) {
  ChatboxAT.css.opacity = {
      CB_Lmenu: 0.75
     ,CB_Lchat_content: 0.5
  };
//}

})();

