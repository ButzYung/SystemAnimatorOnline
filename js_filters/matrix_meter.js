// Matrix meter core (v1.1.0)

MM_enabled = true

var up_arrow = "▲"
var down_arrow = "▼"

var MM_grid_mark = []
var MM_meter_obj = {
  CPU: {v:0},
  RAM: {v:0},

  NET: {v_ul:0, v_dl:0}
}

if (!self.MM_grid_white_lvl)
  self.MM_grid_white_lvl = 0.6
if (!self.MM_meter_enabled)
  self.MM_meter_enabled = { CPU:true, RAM:true, NET:true }

function MM_init() {
  var temp_txt, temp_startX, temp_startY

  for (var x = 0; x < matrix_x_max; x++)
    MM_grid_mark[x] = []

  if (MM_meter_enabled.CPU) {
var xul_init_dummy = System.Machine.CPUs.count
    temp_txt = "CPU00"
    temp_startX = 0
    temp_startY = 1
    for (var x = 0; x < temp_txt.length; x++) {
      matrix_grid[x + temp_startX][temp_startY] = temp_txt.charAt(x)
      MM_grid_mark[x + temp_startX][temp_startY] = true
    }
  }

  if (MM_meter_enabled.RAM) {
var xul_init_dummy = System.Machine.availableMemory
    temp_txt = "RAM00"
    temp_startX = 0
    temp_startY = 4
    for (var x = 0; x < temp_txt.length; x++) {
      matrix_grid[x + temp_startX][temp_startY] = temp_txt.charAt(x)
      MM_grid_mark[x + temp_startX][temp_startY] = true
    }
  }

  if (MM_meter_enabled.NET) {
try {
  MM_meter_obj.NET.WMI_ev_obj = new WMI_Refresher("Win32_PerfFormattedData_Tcpip_NetworkInterface", "EV_MM")
  MM_meter_obj.NET.WMI_ev_obj.init()
}
catch (ex) {}

    temp_txt = down_arrow + "000K"
    temp_startX = (matrix_x_max) - 5
    temp_startY = (matrix_y_max) - 5
    for (var x = 0; x < temp_txt.length; x++) {
      matrix_grid[x + temp_startX][temp_startY] = temp_txt.charAt(x)
      MM_grid_mark[x + temp_startX][temp_startY] = true
    }

    temp_txt = up_arrow + "000K"
    temp_startX = (matrix_x_max) - 5
    temp_startY = (matrix_y_max) - 2
    for (var x = 0; x < temp_txt.length; x++) {
      matrix_grid[x + temp_startX][temp_startY] = temp_txt.charAt(x)
      MM_grid_mark[x + temp_startX][temp_startY] = true
    }
  }

  Seq.item("MM_update").At(0.5, "MM_update", -1, 1)
  Seq.item("MM_update").Play()
}

function MM_update() {
  var usage
  var meter

if (MM_meter_enabled.CPU) {
  usage = 0
  meter = MM_meter_obj.CPU

  var max = System.Machine.CPUs.count
  for (var i = 0; i < max; i++) {
    var u = System.Machine.CPUs.item(i).usagePercentage
    usage += u
  }

  usage = parseInt(usage/max)
  if (usage < 0)
    usage = 0
  if (usage > 99)
    usage = 99

  if (meter.v != usage) {
    meter.v = usage
    meter.update = true
  }
}

if (MM_meter_enabled.RAM) {
  usage = 0
  meter = MM_meter_obj.RAM

  usage = parseInt((1 - System.Machine.availableMemory / System.Machine.totalMemory) * 100)
  if (usage > 99)
    usage = 99

  if (meter.v != usage) {
    meter.v = usage
    meter.update = true
  }
}

if (MM_meter_enabled.NET) {
  usage = 0
  meter = MM_meter_obj.NET

  var o = meter.WMI_ev_obj.update()
  var dl = 0
  var ul = 0
  for (var n = 0, n_max = o.length; n < n_max; n++) {
    dl = Math.max(dl, parseInt(o[n].BytesReceivedPerSec*8/1024))
    ul = Math.max(ul, parseInt(o[n].BytesSentPerSec*8/1024))
  }

  if (meter.v_dl != dl) {
    meter.v_dl = dl
    meter.update_dl = true
  }
  if (meter.v_ul != ul) {
    meter.v_ul = ul
    meter.update_ul = true
  }
}

}

function MM_show() {
  var meter
  var temp_txt, temp_startX, temp_startY

  meter = MM_meter_obj.CPU
  if (meter.update) {
    meter.update = false

    temp_txt = addZero(meter.v)
    temp_startX = 0
    temp_startY = 1
    for (var x = 3; x < 5; x++)
      document.getElementById("Cmatrix_" + (x + temp_startX) + "_" + temp_startY).innerText = temp_txt.charAt(x-3)
  }

  meter = MM_meter_obj.RAM
  if (meter.update) {
    meter.update = false

    temp_txt = addZero(meter.v)
    temp_startX = 0
    temp_startY = 4
    for (var x = 3; x < 5; x++)
      document.getElementById("Cmatrix_" + (x + temp_startX) + "_" + temp_startY).innerText = temp_txt.charAt(x-3)
  }

  meter = MM_meter_obj.NET
  if (meter.update_dl) {
    meter.update_dl = false

    var v = meter.v_dl
    var v_str = (v > 9999) ? addZero(parseInt(v/1024), 3) + "M" : addZero(v, 3) + "K"

    temp_txt = v_str
    temp_startX = (matrix_x_max) - 5
    temp_startY = (matrix_y_max) - 5
    for (var x = 1; x < 5; x++)
      document.getElementById("Cmatrix_" + (x + temp_startX) + "_" + temp_startY).innerText = temp_txt.charAt(x-1)
  }
  if (meter.update_ul) {
    meter.update_ul = false

    var v = meter.v_ul
    var v_str = (v > 9999) ? addZero(parseInt(v/1024), 3) + "M" : addZero(v, 3) + "K"

    temp_txt = v_str
    temp_startX = (matrix_x_max) - 5
    temp_startY = (matrix_y_max) - 2
    for (var x = 1; x < 5; x++)
      document.getElementById("Cmatrix_" + (x + temp_startX) + "_" + temp_startY).innerText = temp_txt.charAt(x-1)
  }
}

