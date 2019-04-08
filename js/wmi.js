// WMI JS library (v2.7.1)
// NOTE: "SWbemRefresher" can be used ONLY on "Win32_Perf" data. Using it on other objects causes MEMORY LEAK.

var WMI_obj
var WMI_objs_count = 0
var WMI_refreshers = []
var WMI_refreshers_count = 0

var PC_count_absolute = 0

var xul_mode, webkit_mode

var WMI_AL_mode//=true
if (xul_mode || webkit_mode) WMI_AL_mode=true
var WMI_AL_timerID
var WMI_AL_js_path, WMI_AL_temp_path, WMI_AL_temp_filename
var WMI_AL_WSH_result_obj
var WMI_AL_refresher_id = []

var Shell_OBJ, FSO_OBJ, oShell

function WMI_CreateObject(always_create_WMI) {
  if (WMI_AL_mode) {
    if (!Shell_OBJ)
      Shell_OBJ = new ActiveXObject("Shell.Application");
    if (!FSO_OBJ)
      FSO_OBJ = new ActiveXObject("Scripting.FileSystemObject");
    if (!oShell)
      oShell = new ActiveXObject("WScript.Shell");

    if (!always_create_WMI || xul_mode || webkit_mode)
      return
  }

  if (WMI_obj)
    return

  WMI_obj = (self.GetObject) ? GetObject("winmgmts:") : new ActiveXObject("WbemScripting.SWbemLocator").ConnectServer();
}

function WMI_Refresher(WMI_class, refresher_id) {
  this.loaded = false
  this.refresher = null
  this.objs = null
  this.collection = []

  this.WMI_class = WMI_class
  this.refresher_id = (refresher_id) ? refresher_id : null

  this.init = WMI_Refresher_init
  this.update = WMI_Refresher_update
  this.refresh = WMI_Refresher_refresh
}

function WMI_Refresher_init() {
  if (this.loaded)
    return
  this.loaded = true

  if (this.refresher_id)
    WMI_objs_count++

try {
  WMI_CreateObject(!this.refresher_id)

  if (WMI_AL_mode) {
// for debug, basically stopping all WMI functions and returning default values
//return
    if (!this.refresher_id)
      return

if (WMI_perfmon.init(this)) {
  return
}

    WMI_AL_refresher_id[this.WMI_class] = this.refresher_id
    WMI_AL_run_timer()
    return
  }

  if (!this.refresher_id)
    return

  var r = WMI_refreshers[this.refresher_id]
  if (!r) {
    r = { obj:new ActiveXObject("WbemScripting.SWbemRefresher"), WMI_class_objs:{} }
    WMI_refreshers[this.refresher_id] = r
    WMI_refreshers_count++
  }
  this.refresher = r

  var r_objs = r.WMI_class_objs[this.WMI_class]
  if (r_objs)
    this.objs = r_objs
  else
    this.objs = r.WMI_class_objs[this.WMI_class] = r.obj.AddEnum(WMI_obj, this.WMI_class)
}
catch (err) {alert(err.toString())}

}

function WMI_Refresher_refresh() {

try {
  if (!this.refresher_id)
    return
  if (WMI_AL_mode)
    return

  var r = this.refresher
  if (r.refreshed_count_last == PC_count_absolute)
    return true

  r.refreshed_count_last = PC_count_absolute
  r.obj.Refresh()
}
catch (ex) {}

}

function WMI_Refresher_update(query_str) {
  var objs = []
try {
  if (this.refresh() && (this.refreshed_count_last == PC_count_absolute))
    objs = this.collection
  else {
    if (WMI_AL_mode && this.refresher_id) {
      var filename = WMI_AL_temp_path+'\\'+WMI_AL_temp_filename + '.txt'

      var WSH_result_obj
      if (WMI_AL_WSH_result_obj && (this.refreshed_count_last == PC_count_absolute))
        WSH_result_obj = WMI_AL_WSH_result_obj
      else {
        try {
          if (FSO_OBJ.FileExists(filename)) {
            var f = FSO_OBJ.OpenTextFile(filename, 1)

var txt = f.ReadLine()
WMI_AL_WSH_result_obj = WSH_result_obj = JSON.parse(txt)

            f.Close()
          }
        }
        catch (err) { WMI_AL_WSH_result_obj = WSH_result_obj = null }
      }

      var c = this.WMI_class

      if (!WSH_result_obj || !WSH_result_obj[c]) {
        var c_ref = WMI_AL_ref[c]

        for (var i = 0; i < c_ref.collection_length_default; i++)
          objs.push(c_ref.properties)
      }
      else
        objs = WSH_result_obj[c]

// a trick to make sure that the AL script always stops if the modified date of the temp file is 60 seconds behind (for cases such as when SA is closed improperly)
// timestamp conversion - https://gist.github.com/hanji/3729693
try {
  if (!this.tmp_file_update_count_last)
    this.tmp_file_update_count_last = this.refreshed_count_last
  // update modification date every 10 seconds
  if (this.tmp_file_update_count_last < this.refreshed_count_last - 100) {
    this.tmp_file_update_count_last = this.refreshed_count_last
    if (xul_mode) {
      var f = FSO_OBJ.OpenTextFile(WMI_AL_temp_path+'\\'+WMI_AL_temp_filename + '.tmp', 2, false)
      f.Write("")
      f.Close()
    }
    else {
      var d = new Date();
      var timestamp = (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear()
		+ ' ' + ((d.getHours() + 11) % 12 + 1) + ':' + ('00' + d.getMinutes()).slice(-2) + ':' + ('00' + d.getSeconds()).slice(-2)
		+ ' ' + (d.getHours() < 12 && 'AM' || 'PM');

      var _obj = Shell_OBJ.NameSpace(WMI_AL_temp_path).ParseName(WMI_AL_temp_filename + '.tmp')
      _obj.ModifyDate = d
//DEBUG_show(new Date(timestamp).toUTCString())
    }
  }
}
catch (err) {
//  DEBUG_show(err.message,0,1)
}
    }
    else {
      var need_enum = true
      var en_objs
      if (this.refresher_id)
        en_objs = this.objs.ObjectSet
      else {
        if (xul_mode || webkit_mode) {

// XUL one-time special
need_enum = false

var c = this.WMI_class
var para = c + ",(),0"

var js_path = System.Gadget.path + '\\js\\wmi_al.wsf';
var temp_path = oShell.ExpandEnvironmentStrings("%TEMP%"); //js_path.replace(/\\[^\\]+$/, '\\TEMP');
var temp_filename = "TEMP_WMI_one-time" + ("_" + Date.now()) + ("-" + Math.random()).replace(/0\./, "");

var txt, WSH_result_obj

if (xul_mode) {
  XPCOM_object["Shell.Application"]._run(js_path, encodeURIComponent(temp_filename) + " " + encodeURIComponent(para), true, SystemEXT.enforce_WSH);
  try {
    var temp_file = FileIO.open(temp_path + '\\' + temp_filename + '.txt');
    txt = FileIO.readText(temp_file);
    FileIO.unlink(temp_file);
  }
  catch (err) { DEBUG_show(err.toString()) }
}
else {
  WebKit_object["Shell.Application"]._run(js_path, encodeURIComponent(temp_filename) + " " + encodeURIComponent(para), null, true);
  temp_path += '\\' + temp_filename + '.txt';
  try {
    var fs = require('fs')
    if (fs.existsSync(temp_path)) {
      txt = fs.readFileSync(temp_path)
      fs.unlinkSync(temp_path)
    }
  }
  catch (err) { DEBUG_show(err.toString()) }
}

if (txt)
  WSH_result_obj = JSON.parse(txt)

if (!WSH_result_obj || !WSH_result_obj[c]) {
  var c_ref = WMI_AL_ref[c]

  for (var i = 0; i < c_ref.collection_length_default; i++)
    objs.push(c_ref.properties)
}
else
  objs = WSH_result_obj[c]

        }
        else if (!query_str) {
          en_objs = WMI_obj.InstancesOf(this.WMI_class)
        }
        else {
          en_objs = WMI_obj.ExecQuery('SELECT * FROM ' + this.WMI_class + ' WHERE ' + query_str)
        }
      }

      if (need_enum) {
        var en = new Enumerator(en_objs)
        for (; !en.atEnd(); en.moveNext())
          objs.push(en.item())
      }
    }

    this.refreshed_count_last = PC_count_absolute
  }
}
catch (ex) {}

  this.collection = objs
  return objs
}


// WMI Anit-leak functions

function WMI_AL_stop() {
  try {
    if (WMI_AL_script_running) {
      FSO_OBJ.DeleteFile(WMI_AL_temp_path+'\\'+WMI_AL_temp_filename + '.tmp')
    }
  }
  catch (err) {alert(err.toString())}
}

var WMI_AL_script_running

function WMI_AL_run_timer() {
  if (WMI_AL_script_running)
    return

  if (WMI_AL_timerID) {
    clearTimeout(WMI_AL_timerID)
    WMI_AL_timerID = null
  }

  WMI_AL_timerID = setTimeout(WMI_AL_run_command, 10)
}

function WMI_AL_run_command() {
  var paras = []
  var c
  for (c in WMI_AL_refresher_id) {
    if (c && !/shuffle/.test(c)) {
      paras.push(c + "," + WMI_AL_refresher_id[c] + "," + eval(WMI_AL_ref[c].timer_interval))
    }
  }

  if (!paras.length)
    return

  if (!WMI_AL_js_path)
    WMI_AL_js_path = System.Gadget.path + '\\js\\wmi_al.wsf'
  if (!WMI_AL_temp_path)
    WMI_AL_temp_path = oShell.ExpandEnvironmentStrings("%TEMP%"); //WMI_AL_js_path.replace(/\\[^\\]+$/, '\\TEMP')
  if (!WMI_AL_temp_filename)
    WMI_AL_temp_filename = ((self.Settings && Settings.f_path) ? Settings.f_path.replace(/^.+\\/, '').replace(/\s/g, "_") : "TEMP") + ("_" + Date.now()) + ("-" + Math.random()).replace(/0\./, "")

  FSO_OBJ.OpenTextFile(WMI_AL_temp_path+'\\'+WMI_AL_temp_filename + '.txt', 2, true).Close()
  FSO_OBJ.OpenTextFile(WMI_AL_temp_path+'\\'+WMI_AL_temp_filename + '.tmp', 2, true).Close()

  WMI_AL_script_running = true
  Shell_OBJ.ShellExecute(WMI_AL_js_path, encodeURIComponent(WMI_AL_temp_filename) + " " + encodeURIComponent(paras.join("|")))

  DEBUG_show("Use WMI", 2)
}


// perfmon

var WMI_perfmon
if (is_SA_child_animation) {
  WMI_perfmon = parent.WMI_perfmon
}
else {
  WMI_perfmon = {
    perfmon: null

   ,counter: {}
   ,counter_list: []

   ,loaded: false
   ,init: function (obj) {
if (!webkit_electron_mode)
  return false

if (!windows_mode)
  return true

if (!this.loaded) {
  this.loaded = true
  this.perfmon = SA_require('perfmon')
}

switch (obj.WMI_class) {
  case "Win32_PerfFormattedData_PerfDisk_LogicalDisk":
    obj.update = WMI_perfmon.update_func("LogicalDisk")

    if (!WMI_perfmon.LogicalDisk_counter_list) {
      WMI_perfmon.perfmon.list("LogicalDisk", function (err, data) {
WMI_perfmon.LogicalDisk_init(err, data)
      });
    }
    break
  case "Win32_PerfFormattedData_Tcpip_NetworkInterface":
    obj.update = WMI_perfmon.update_func("Network Interface")

    if (!WMI_perfmon.NetworkInterface_counter_list) {
      WMI_perfmon.perfmon.list("Network Interface", function (err, data) {
WMI_perfmon.NetworkInterface_init(err, data)
      });
    }
    break
  case "Win32_PerfFormattedData_PerfOS_Memory":
    obj.update = WMI_perfmon.update_func("Memory")

    WMI_perfmon.run(["Memory\\Pages Input/sec", "Memory\\Pages Output/sec"])
    break
  default:
    return false
}

return true
    }

   ,update_func: function (performance_id) {
return function () {
  this.collection = WMI_perfmon.counter_result[performance_id]
  return this.collection
};
    }

   ,run_timerID: null
   ,run: function (id_list) {
if (this.run_timerID) {
  clearTimeout(this.run_timerID)
}

id_list.forEach(function (id) {
  WMI_perfmon.counter[id] = true
});

for (var id in this.counter)
  this.counter_list.push(id)

this.run_timerID = setTimeout(function () { WMI_perfmon.run_timerID=null; WMI_perfmon.counter_start() }, 1000)
    }

   ,counter_result: {
  "LogicalDisk": []
 ,"Network Interface": []
 ,"Memory": []
    }

   ,counter_start: function () {
DEBUG_show("Use Perfmon", 2)

this.perfmon(this.counter_list, function (err, data) {
  WMI_perfmon.counter_process(err, data)
});
    }

   ,counter_process: function (err, data) {
if (err) {
//  DEBUG_show("Perfmon ERROR:" + err.message)
  return
}

this.counter_result.LogicalDisk = []
this.counter_result["Network Interface"] = []
this.counter_result.Memory = []

var _NetworkInterface = {}

for (var name in data.counters) {
  var v = data.counters[name]
  if (/LogicalDisk\(([^\)]+)\)/.test(name)) {
    this.counter_result.LogicalDisk.push({ Name:RegExp.$1, PercentDiskTime:v })
  }
  else if (/Network Interface\(([^\)]+)\)/.test(name)) {
    var net_name = RegExp.$1
    var obj = _NetworkInterface[net_name]
    if (!obj)
      obj = _NetworkInterface[net_name] = {}

    if (/Bytes Received\/sec/.test(name)) {
      obj.BytesReceivedPerSec = v
    }
    else if (/Bytes Sent\/sec/.test(name)) {
      obj.BytesSentPerSec = v
    }
  }
  else if (/Memory/.test(name)) {
    var m = this.counter_result.Memory
    if (!m[0])
      m = this.counter_result.Memory = [{}]
    if (name == "Memory\\Pages Input/sec") {
      m[0].PagesInputPerSec = v
    }
    else if (name == "Memory\\Pages Output/sec") {
      m[0].PagesOutputPerSec = v
    }
  }
}

for (var net_name in _NetworkInterface) {
  this.counter_result["Network Interface"].push(_NetworkInterface[net_name])
}
    }

   ,LogicalDisk_drive_list: null
   ,LogicalDisk_counter_list: null
   ,LogicalDisk_init: function (err, data) {
if (err) {
  DEBUG_show(err.message)
  return
}

this.LogicalDisk_drive_list = []
this.LogicalDisk_counter_list = []

data.counters.forEach(function (counter) {
  if (!/LogicalDisk\(([^\)]+)\)\\\% Disk Time/.test(counter))
    return

  var d = RegExp.$1
  if (d == "_Total") {
    WMI_perfmon.LogicalDisk_counter_list.push(counter)
  }
  else if (/^\w\:$/.test(d)) {
    WMI_perfmon.LogicalDisk_drive_list.push(d)
    WMI_perfmon.LogicalDisk_counter_list.push(counter)
  }
});

//DEBUG_show(WMI_perfmon.LogicalDisk_counter_list)
this.run(this.LogicalDisk_counter_list)
    }

   ,NetworkInterface_counter_list: null
   ,NetworkInterface_init: function (err, data) {
if (err) {
  DEBUG_show(err.message)
  return
}

this.NetworkInterface_counter_list = []

data.counters.forEach(function (counter) {
  if (!/Network Interface\(([^\)]+)\)\\Bytes (Received|Sent)\/sec/.test(counter))
    return

  WMI_perfmon.NetworkInterface_counter_list.push(counter)
});

this.run(this.NetworkInterface_counter_list)
    }
  }
}


// scripts
if (WMI_AL_mode)
  document.write('<script type="text/javascript" language="javascript" src="js/wmi_al_core.js"></scr'+'ipt>\n')
