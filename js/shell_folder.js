// SA_ReturnItemsFromFolder (v1.0.4)
/*
Required:
	toFileProtocol()
*/

function Shell_ReturnItemsFromFolder(path, para_obj, is_subfolder) {
  if (!para_obj)
    para_obj = {}
  if (!para_obj.RE_items)
    para_obj.RE_items = /\.(bmp|gif|jpg|jpeg|png)$/i
  if (!para_obj.gallery)
    para_obj.gallery = []
  if (!is_subfolder)
    para_obj._shell_item_count = 0

  var f

  try {
    f = System.Shell.itemFromPath(path)
  }
  catch (ex) {}

  if (!f)
    return ((is_subfolder) ? null : [])

  var items = f.SHFolder.Items
  for (var i = 0, i_max = items.count; i < i_max; i++) {
    if (++para_obj._shell_item_count > 9999) {
      if (is_subfolder)
        return null
      else
        break
    }

    var item = items.item(i)

    if (item.isLink) {
      var item_linked
      try {
        item_linked = System.Shell.itemFromPath(item.link.path)
      }
      catch (ex) {}

      if (!item_linked)
        continue

      item = item_linked
    }

    if (item.isFolder) {
      if (!Shell_ReturnItemsFromFolder(item.path, para_obj, true)) {
        if (is_subfolder)
          return null
      }
    }
    else if (item.isFileSystem) {
      var path = item.path

      if (!para_obj.RE_items.test(path))
        continue

      var obj = { index:para_obj.gallery.length, path:path, path_file:toFileProtocol(path) }
      para_obj.gallery.push(obj)
/*
      if (para_obj.gallery.length > 9999) {
        if (is_subfolder)
          return null
        else
          break
      }
*/
    }
  }

  return para_obj.gallery
}
