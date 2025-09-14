// 2024-12-09
/*
Required:
	toFileProtocol()
*/

function Shell_ReturnItemsFromFolder(path, para_obj, is_subfolder) {
  if (!para_obj)
    para_obj = {};
  if (!para_obj.RE_items)
    para_obj.RE_items = /\.(bmp|gif|jpg|jpeg|png)$/i;
  if (!para_obj.gallery)
    para_obj.gallery = [];
  if (!para_obj.item_limit)
    para_obj.item_limit = 9999;

  if (!is_subfolder)
    para_obj._shell_item_count = 0;

  let f;

  try {
    f = System.Shell.itemFromPath(path);
  }
  catch (ex) {}

  if (!f)
    return ((is_subfolder) ? null : []);

  let items = f.SHFolder.Items;
  for (let i = 0, i_max = items.count; i < i_max; i++) {
    if (++para_obj._shell_item_count > para_obj.item_limit) {
      if (is_subfolder)
        return null
      else
        break
    }

    let item = items.item(i);

    if (item.isLink) {
      if (para_obj.skip_link) continue;

      let item_linked;
      try {
        item_linked = System.Shell.itemFromPath(item.link.path);
      }
      catch (ex) {}

      if (!item_linked)
        continue;

      item = item_linked;
    }

    if (item.isFolder) {
      if (para_obj.skip_subfolder) continue;

      if (!Shell_ReturnItemsFromFolder(item.path, para_obj, true)) {
        if (is_subfolder)
          return null;
      }
    }
    else if (item.isFileSystem) {
      let path = item.path;

      if (!para_obj.RE_items.test(path))
        continue;

      let obj = { index:para_obj.gallery.length, path:path, path_file:toFileProtocol(path) };
      para_obj.gallery.push(obj);
    }
  }

  return para_obj.gallery;
}
