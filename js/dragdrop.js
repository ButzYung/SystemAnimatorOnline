// Drag drop (2023-01-30)

var xul_mode, webkit_mode

var DragDrop = {
  init: function (obj, ondrop_finish, validate_func) {
    if (xul_mode) {
      obj.addEventListener("dragover", XPCOM_object._dragOver, true);
//      obj.addEventListener("dragdrop", XPCOM_object._dragDrop, true);
      obj.addEventListener("drop", XPCOM_object._dragDrop, true);
    }
    else if (webkit_mode) {
      obj.addEventListener("dragenter", WebKit_object._dragEnter, false);
      obj.addEventListener("dragexit",  WebKit_object._dragExit, false);
      obj.addEventListener("dragover",  WebKit_object._dragOver, false);
      obj.addEventListener("drop",      WebKit_object._drop, false);
    }
    else {
      obj.ondragenter = function (e) { DragDrop.onDragEnter(e) }
      obj.ondragover  = function (e) { DragDrop.onDragOver(e) }
      obj.ondrop      = function (e) { DragDrop.onDrop(e) }
    }

    this.onDrop_finish = ondrop_finish

    this.validate_func = (validate_func) ? validate_func : function (item) { return item.isFolder }

    if (!ie9_mode)
      return

    this._ondrop_finish = ondrop_finish
    this._ondrop_finish_process = async function (item, para1) { await DragDrop.drop_target(item.isFolder)._ondrop_finish(item, para1); }

    Object.defineProperty(this, "onDrop_finish",
{
  get: function () { return this._ondrop_finish_process; }
 ,set: function (func) { this._ondrop_finish = func; }
});

    this._validate_func = this.validate_func
    this._validate_func_process = function (item, para1) { return DragDrop.drop_target(item.isFolder)._validate_func(item, para1); }
    Object.defineProperty(this, "validate_func",
{
  get: function () { return this._validate_func_process; }
 ,set: function (func) { this._validate_func = func; }
});

    this.drop_target = function (no_relay) {
var dd
if (!no_relay && !this._no_relay) {
  var p = (self.is_SA_child_animation) ? parent : self
  var relay_id = p.DragDrop.relay_id
  if ((relay_id != null) && p.SA_child_animation[relay_id])
    dd = p.document.getElementById("Ichild_animation" + relay_id).contentWindow.DragDrop
}

if (!dd) {
  dd = (self.is_SA_child_animation && (self.ChildMirror_id != null) && parent.SA_child_animation[ChildMirror_id]) ? parent.document.getElementById("Ichild_animation" + ChildMirror_id).contentWindow.DragDrop : this;
}

return dd;
    }
  }

  ,validateDropItem: function (dataTransfer) {
    try {
      var item = System.Shell.itemFromFileDrop(dataTransfer, 0);
      return this.validate_func(item);
    }
    catch (err) {
      return false;
    }
  }

  ,_dragAccepted: false

  ,onDragEnter: function (e) {
    event.returnValue = false;

    if (this.validateDropItem(event.dataTransfer)) {
      event.dataTransfer.dropEffect = "link";
      this._dragAccepted = true;
    }
    else {
      event.dataTransfer.dropEffect = "none";
      this._dragAccepted = false;
    }
  }
    
  ,onDragOver: function (e) {
    if (this._dragAccepted) {
      event.returnValue = false;
      event.dataTransfer.dropEffect = "link";
    }
  }
    
  ,onDrop: function (e) {
    event.returnValue = false;

    var item = System.Shell.itemFromFileDrop(event.dataTransfer, 0);
    if (item == null) return;

    this.onDrop_finish(item)
  }
}
