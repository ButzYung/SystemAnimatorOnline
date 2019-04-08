// Sequencer emulation 3.4.0
// Homepage: http://www.animetheme.com

if (!Date.now) {
  Date.now = function now() {
    return new Date().getTime();
  };
}

// SEQ main

var seq_items = []

function Seq_object() {
  this.item = Seq_item

  this.JS_timer_used = []
  this.JS_timer_active = []
  this.setInterval = Seq_setInterval
  this.clearInterval = Seq_clearInterval
  this.clearTimeout = Seq_clearInterval
}

function Seq_item(str) {
  if (!seq_items[str])
    seq_items[str] = new Seq_core(str)
  return seq_items[str]
}

function Seq_core(str) {
  this.name = str
  this.count = 0
  this.At = Seq_at
  this.Play  = this.play  = Seq_play
  this.Pause = this.pause = Seq_pause
  this.Stop = Seq_stop
  this.exec = Seq_exec
}

function Seq_at(init_delay, func, max_count, interval) {
  this.initialized = true

  this.init_delay = parseInt(init_delay * 1000) + 1

  if (typeof func == "string")
    eval('this.func = function () {' + (func + ((/^\s*\w+$/.test(func)) ? "()" : "")) + '}')
  else
    this.func = func

//  this.func = (typeof func == "string") ? (new Function(func + ((/^\s*\w+$/.test(func)) ? "()" : ""))) : func
  this.max_count = max_count
  this.interval = this.interval_current = parseInt(interval * 1000)

  this.update_time_last = 0
}

function Seq_play() {
  if (!this.initialized/* || !self.loaded*/)
    return

  this.paused = false

  if (this.count) {
    if (this.timerID)
      return

    seq_items[this.name].exec()
  }
  else {
    if (this.timerID)
      clearTimeout(this.timerID)

//    this.timerID = setTimeout('seq_items["' + this.name + '"].exec()', this.init_delay)
    var this_name = this.name
    this.timerID = setTimeout(function () { seq_items[this_name].exec(); this_name=null; }, this.init_delay)
  }
}

var Seq_interval_current_min = 10

function Seq_exec() {
  if (this.paused)
    return
  if (this.count++ == this.max_count) {
    this.Stop()
    return
  }

  var t = Date.now()
  var t_last = this.update_time_last
  var t_current = this.interval_current

//DEBUG_show(t_current)

  this.interval_current = null
  if ((this.interval > Seq_interval_current_min) && (t_last > 0)) {
    var t_real = (t - t_last) - t_current
    if (t_real > 0) {
      t_current = this.interval - t_real
      if (t_current < Seq_interval_current_min)
        t_current = Seq_interval_current_min
      this.interval_current = t_current
    }
  }
  this.update_time_last = t
  if (this.interval_current == null)
    this.interval_current = this.interval

//this.timerID = setTimeout('seq_items["' + this.name + '"].exec()', this.interval_current)
  var this_name = this.name
  this.timerID = setTimeout(function () { seq_items[this_name].exec(); this_name=null; }, this.interval_current)

/*
  if (this.use_SA_RAF) {
    top.EV_sync_update.Seq_func[this_name] = this.func
  }
  else
*/
    this.func()
}

function Seq_stop() {
  this.Pause()
  this.count = 0
  if (Seq.onstop)
    Seq.onstop(this.name)
}

function Seq_pause() {
  this.paused = true

  if (!this.timerID)
    return

  clearTimeout(this.timerID)

  this.timerID = null
}

// For simple setInterval/setTimeout support

function Seq_setInterval(func, ms) {
  var timer_num = -1
  for (var i = 0; i < this.JS_timer_used.length; i++) {
    if (!this.JS_timer_used[i]) {
      timer_num = i
      break
    }
  }
  if (timer_num == -1)
    timer_num = this.JS_timer_used.length

  var timerID = "T" + Date.now()
  while (this.JS_timer_active[timerID]) {
    timerID += "-0"
  }

  this.JS_timer_active[timerID] = timer_num + 1
  this.JS_timer_used[timer_num] = true

  ms /= 1000
  var s = Seq.item("JS-timer" + timer_num)
  s.At(ms, func, -1, ms)
  s.Play()

DEBUG_show('SI:' + timer_num, 2)
  return timerID
}

function Seq_clearInterval(timerID) {
  var timer_num = this.JS_timer_active[timerID]
  if (!timer_num) {
    return
  }

  timer_num--
  this.JS_timer_active[timerID] = null
  this.JS_timer_used[timer_num] = null

  Seq.item("JS-timer" + timer_num).Stop()

DEBUG_show('CI:' + timer_num, 2)
}

// END

var Seq, SeqOBJ
Seq = SeqOBJ = new Seq_object()
