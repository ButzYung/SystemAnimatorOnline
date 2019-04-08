// Facebook API for System Animator (v1.0.0)

var use_Facebook_API

var Facebook_SA_options
var FB_module

var Facebook_SA = {
  user: {}

 ,objects: {
    res: null
   ,last_updated: parseInt(Date.now()/1000 - 60*60*24*7)

   ,feed_index: -1
   ,feed: []

   ,sort_func: function(a, b) {
if (!!a._read != !!b._read)
  return ((!a._read) ? -1 : 1)
return b._time - a._time
   }

   ,updated_once: false
   ,update: function () {
var msg_max = Math.max(parseInt(100/Facebook_SA_options.object_name_list.length), 10)

console.log('(retrieving FB feed)')
FB_module.api('/?ids=' + Facebook_SA_options.object_name_list.join(','), { fields:['name', 'feed' + ((Facebook_SA.objects.last_updated) ? '.since(' + (Facebook_SA.objects.last_updated+1) + ')' : '') + '.limit(' + (msg_max) + '){from, message, story, created_time, permalink_url, type, source, link, full_picture, reactions.limit(0).summary(true)}'] }, function (res) {
  if (res.error) {
    Facebook_SA.onerror(res.error)
    return
  }

  if (!Facebook_SA.objects.res) {
    Facebook_SA.objects.res = res
    DEBUG_show("(FB feed retrieved)", 3)
  }
  else {
    Facebook_SA_options.object_name_list.forEach(function (name) {
      if (res[name].feed)
        Facebook_SA.objects.res[name].feed.data = res[name].feed.data.concat(Facebook_SA.objects.res[name].feed.data)
    });
    DEBUG_show("(FB feed updated)", 3)
  }

  var feed = Facebook_SA.objects.feed = []
  Facebook_SA_options.object_name_list.forEach(function (name) {
    var obj = Facebook_SA.objects.res[name]
    obj.feed.data = obj.feed.data.slice(0, msg_max-1)

    obj.feed.data.forEach(function (post) {
      post._name = obj.name
      post._time = parseInt((new Date(post.created_time)).getTime() / 1000)
      feed.push(post)
    });
  });

  feed.sort(Facebook_SA.objects.sort_func)

  Facebook_SA.objects.feed_index = -1
  if (feed.length) {
    var time = feed[0]._time
    if (Facebook_SA.objects.last_updated < time)
      Facebook_SA.objects.last_updated = time
    console.log('feed length: ' + feed.length + ' (last updated on ' + new Date(Facebook_SA.objects.last_updated*1000).toUTCString() + ')')
  }

  if (!this.updated_once) {
    this.updated_once = true
    Seq.item("FB_Post_Display").At(0, function () { Facebook_SA.onpost() }, -1, 30+5);
    Seq.item("FB_Post_Display").Play()
  }

//  console.log(JSON.stringify(Facebook_SA.objects.res))

//console.log(res.caption)
//console.log(res.error)
//console.log(JSON.stringify(res))
});
    }
  }

 ,onerror: function (error) {
if (error.code == 190) {
  DEBUG_show("FB access token expired, refreshing...", 5)
  webkit_electron_remote.getGlobal("FB_login")(true)
  return
}

Facebook_SA_options.onerror(error)
  }

 ,onstart: function (res) {
this.user.name = res.name

Seq.item("FB_Update_Feed").At(60*5, function () { Facebook_SA.objects.update() }, -1, 60*5);
Seq.item("FB_Update_Feed").Play()

Facebook_SA_options.onstart(res)
  }

 ,onpost: function(index_mod, overwrite_bubble) {
if (MMD_SA.SpeechBubble.visible && !overwrite_bubble)
  return

var objs = Facebook_SA.objects
var feed = objs.feed

var post
if (feed.length) {
  if (index_mod)
    objs.feed_index += index_mod
  else
    objs.feed_index++
  if (objs.feed_index < 0) {
    objs.feed_index = 0
  }
  else if (objs.feed_index >= objs.feed.length) {
    objs.feed_index = 0
    objs.feed.shuffle()
  }

  objs.post = post = feed[objs.feed_index]
  post._read = true

  var time_diff = (Date.now()/1000 - post._time) / 60
  var time_msg
  if (time_diff < 10)
    time_msg = 'Just now'
  else if (time_diff < 60)
    time_msg = parseInt(time_diff) + ' mins'
  else if (time_diff < 60*24) {
    time_msg = parseInt(time_diff/60)
    time_msg += ' hour' + ((time_msg > 1) ? 's' : '')
  }
  else {
    time_msg = parseInt(time_diff/(60*24))
    time_msg += ' day' + ((time_msg > 1) ? 's' : '')
  }

  var name = (post["from"] && (post["from"].name != post._name)) ? post["from"].name + '/' + post._name : post._name

  post._message = name + '(' + time_msg + '/\u{1f44d}' + ((post.reactions)?post.reactions.summary.total_count:0) + '):\n' + (post.message||post.story||'')

  post._context_menu_para = { visit_post:true, visit_link:(post.type=="link"), next_post:true }
}

Facebook_SA_options.onpost(post)

if (post)
  System._browser.update_tray({ Facebook:post._context_menu_para })
  }

 ,IPC_Facebook: function (para) {
switch (para[0]) {
  case "LOGIN_RESULT":
//DEBUG_show(decodeURI(para[1]))
    if (!FB_module)
      FB_module = SA_require("fb")

    var access_token = para[2]
    FB_module.setAccessToken(access_token);

    if (Facebook_SA.user.name) {
      DEBUG_show("(FB access token refreshed)", 3)
      Facebook_SA.objects.update()
      return
    }

    FB_module.api('/me', { fields: ['name'] }, function (res) {
      if (res.error) {
        Facebook_SA.onerror(res.error)
        return
      }

      Facebook_SA.onstart(res)
//      console.log(res.name);
//      console.log(res.id);
//'picture.width(800).height(800)'
//console.log(res.picture.data.url);
      DEBUG_show("(FB user info retrieved)", 3)
//passiontimes
//420361564693683

      Facebook_SA.objects.update()
    });
    break
}
  }

 ,tray_menu_func: function (para) {
var post = this.objects.post

switch (para[0]) {
  case "visit_post":
    if (post.permalink_url)
      window.open(post.permalink_url)
    break
  case "visit_link":
    if (post.link)
      window.open(post.link)
    break
  case "play_video":
    var w = ((is_SA_child_animation)?parent:self).document.getElementById("Ichild_animation" + 0)
    if (!w)
      break
    w = w.contentWindow
//DEBUG_show(post.source,0,1)
    if (w.SL_MC_video_obj) {
//DEBUG_show(w.SL_MC_video_obj.currentTime,0,1)
      w.SL_MC_Play()
    }
    else if (post.type == "video") {
      w.EQP_ps[w.Facebook_SA_icon_index].load(w.Settings.f_path+'\\parts\\_dummy_img.png')
      w.DragDrop.onDrop_finish({ isFileSystem:true, path:post.source })
    }
    break
  case "stop_video":
    var w = ((is_SA_child_animation)?parent:self).document.getElementById("Ichild_animation" + 0)
    if (!w)
      break
    w = w.contentWindow

    if (w.SL_MC_video_obj) {
      w.SL_MC_Stop()
    }
    break
  case "next_post":
    this.onpost(1, true)
    break
  case "previous_post":
    this.onpost(-1, true)
    break
  case "shuffle_feed":
    this.objects.feed.shuffle()
    this.objects.feed_index = -1
    this.onpost(1, true)
    break
  case "reset_feed":
    this.objects.feed.forEach(function (p) { p._read=false })
    this.objects.feed.sort(this.objects.sort_func)
    this.objects.feed_index = -1
    this.onpost(1, true)
    break
}
  }
};

(function () {
  if (!Facebook_SA_options)
    Facebook_SA_options = {}

  if (!Facebook_SA_options.object_name_list) {
    Facebook_SA_options.object_name_list = [/*'AnimeThemeGadgets',*/ 'passiontimes', '168124786616323']
  }

  if (!Facebook_SA_options.onerror) {
    Facebook_SA_options.onerror = function (error) {
if (!self.MMD_SA)
  return

MMD_SA.SpeechBubble.message(0, 'Ooops, error~! >_<\n' + error.message, 30*1000)
    }
  }

  if (!Facebook_SA_options.onpost) {
    Facebook_SA_options.onpost = function (post) {
if (MMD_SA.music_mode)
  return

if (!post) {
  MMD_SA.SpeechBubble.message(0, 'Ooops... there is no update from your favorite pages/groups in the last 7 days~!', 10*1000)
  return
}

MMD_SA.SpeechBubble.message(0, post._message, 30*1000)
//DEBUG_show(post.source,0,1)

var w = ((is_SA_child_animation)?parent:self).document.getElementById("Ichild_animation" + 0)
if (!w)
  return
w = w.contentWindow

if (!w.Facebook_SA_frame_mode)
  return

if (w.SL_MC_video_obj && !w.SL_MC_video_obj.paused) {
  post._context_menu_para.play_video = post._context_menu_para.stop_video = true
  return
}

var g = w.EQP_dragdrop_target
if (!g)
  return

if (g.gallery)
  g.gallery.gallery_obj.disabled = true
g.load(post.full_picture||w.Settings.f_path+'\\gallery\\00.png', g.gallery.para)

var icon
if (w.Facebook_SA_icon_index != null)
  icon = w.EQP_ps[w.Facebook_SA_icon_index]

switch (post.type) {
  case "video":
    icon.load(System.Gadget.path+'\\images\\icon_film_64x64.png')
    if (/\.(mp4)[\?$]/.test(post.source))
      post._context_menu_para.play_video = true
    else
      post._context_menu_para.visit_link = true
    break
  case "link":
    icon.load(System.Gadget.path+'\\images\\icon_link_64x64.png')
    break
  default:
    icon.load(w.Settings.f_path+'\\parts\\_dummy_img.png')
}
    }
  }

  if (!Facebook_SA_options.onstart) {
    Facebook_SA_options.onstart = function (res) {
if (!self.MMD_SA)
  return

MMD_SA.SpeechBubble.message(0, 'Welcome back, ' + res.name + '~! ^o^', 10*1000)
    }
  }
})();
