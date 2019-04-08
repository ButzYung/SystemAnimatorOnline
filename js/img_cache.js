// IMG cache (v1.8.2)

var use_gallery_img_cache
var use_native_img
var native_img_objs = []

function imgCache_Object(img_id, img_parent_id, _use_native_img) {
  self[img_id] = null
  this.img_id = img_id
  this.img_parent_id = img_parent_id

  this.use_native_img = !!_use_native_img
  if (_use_native_img)
    native_img_objs.push(this)

  this.path_last = ""
  this.img_cache = []

  this.SS_mode = false
  this.img_for_preload = null
  this.SS_preload = imgCache_SS_Preload

  this.SS_path_list_lvl = 0
  this.SS_path_list_index = -1
  this.SS_path_list = [null, null]
  this.SS_path = null

  this.load = imgCache_Load
  this.show = imgCache_Show
  this.clear = imgCache_Clear
  this.createIMG = imgCache_CreateIMG
  this.styleUpdate = imgCache_StyleUpdate
}

function imgCache_Clear() {
  self[this.img_id] = null
  this.img_cache = []
}

function imgCache_StyleObject() {
  this.posLeft = null
  this.posTop = null
  this.pixelWidth = null
  this.pixelHeight = null
}

function imgCache_StyleUpdate() {
  if (!this.use_native_img)
    return

  var obj = self[this.img_id]
  var img = obj.img

  var w_org = obj.width
  var h_org = obj.height
  var w = img.width
  var h = img.height

  var s = obj.style
  if (s.pixelWidth != null)
    img.width = w = s.pixelWidth
  if (s.pixelHeight != null)
    img.height = h = s.pixelHeight
  if (s.posLeft != null)
    img.left = s.posLeft + (w-w_org)/2
  if (s.posTop != null)
    img.top = s.posTop + (h-h_org)/2
}

function imgCache_CreateIMG(path) {
  var img
  if (this.use_native_img) {
    var path_URI = toLocalPath(path)
    img = {
  img: BG.addImageObject(path_URI, 0,0)
 ,src: path
 ,style: new imgCache_StyleObject()
    };

    img.width = img.img.width
    img.height = img.img.height
  }
  else {
    img = document.createElement("img")
    img.style.position = "absolute"
    img.src = path
    document.getElementById(this.img_parent_id).appendChild(img)
  }

  img.docked = System.Gadget.docked
  return img
}

function imgCache_Show(visible) {
  var img = self[this.img_id]
  if (!img)
    return

  if (this.use_native_img)
    img.img.opacity = (visible) ? 100 : 0
  else {
    if (use_gallery_img_cache || this.img_for_preload)
      img.style.display = (visible) ? "block" : "none"
    else
      img.style.visibility = (visible) ? "inherit" : "hidden"
  }
}

function imgCache_Load(path) {
  var img
  var img_initialized = false
  if (!this.use_native_img && !use_gallery_img_cache && (!this.img_for_preload || !this.img_cache[path])) {
    img = self[this.img_id]
    if (img) {
      if (this.path_last == path)
        img_initialized = true
      else {
        img.src = path
        this.path_last = path
      }

      img.style.visibility = "inherit"
    }
    else
      self[this.img_id] = this.createIMG(path)

    return img_initialized
  }

  img = this.img_cache[path]
  if (img) {
    if (img.docked == System.Gadget.docked)
      img_initialized = img.initialized
    else {
      img.docked = System.Gadget.docked
      img_initialized = false
    }
  }
  else {
    img = this.img_cache[path] = this.createIMG(path)
    img_initialized = false
  }

  if (self[this.img_id])
    this.show(false)

  if (this.img_for_preload) {
    this.img_for_preload = self[this.img_id]
    this.img_cache = []
  }

  self[this.img_id] = img

  this.show(true)
  return img_initialized
}

function imgCache_SS_Preload() {
  var path = this.SS_path_list[this.SS_path_list_lvl][++this.SS_path_list_index]

  if (++this.SS_path_list_index >= this.SS_path_list[this.SS_path_list_lvl].length) {
    this.SS_path_list_index = -1

    if (this.SS_path_list_lvl == 0) {
      var gallery_obj = SEQ_gallery_all[SEQ_gallery_index]
      if (gallery_obj.count+1 >= gallery_obj.loop)
        this.SS_path_list_lvl = 1
    }
  }

// main
  var img = this.img_cache[path]
  if (img) {
    img.initialized = false
    return
  }

  if (!use_gallery_img_cache && this.img_for_preload) {
    this.img_for_preload.src = path
    img = this.img_cache[path] = this.img_for_preload
  }
  else {
    img = this.img_cache[path] = this.createIMG(path)
    if (!use_gallery_img_cache)
      this.img_for_preload = img
  }

  img.style.visibility = "inherit"
  img.style.display = "none"
  img.initialized = false
}
