$(".ctr-dashboard").ready(function() {
  var dashboard_history = [], history_idx = -1, history_hold = ""
  cells = []
  Cell = function() {}
  Cell.init = function(init_data) {
    var cell = new Cell()
    var dash_cell = $("<div>", { class: "dash-cell" })
    dash_cell.append($("<div>", { class: "dash-title" }).append("<span></span>"))
    dash_cell.append($("<div>", { class: "dash-content" }))
    cell.ele = dash_cell

    cell.name = (init_data.name || init_data.title).replace(/^\s*|\s*$/ig, "").replace(/\s+/ig, "-").replace(/[^a-z\-]/ig, "").toLowerCase()
    cell.title(init_data.title || "")
    cell.text(init_data.text || "")
    cell.should_flash = init_data.flash == false ? false : true
    cell.x = init_data.x
    cell.y = init_data.y
    cell.w = init_data.w
    cell.h = init_data.h
    cell.init_data = init_data
    cell.data = init_data.data || {}
    cell.commands = init_data.commands || {}
    cell.autocomplete_options = init_data.autocomplete_options || cell.command_list
    cell.interval = init_data.interval
    if (init_data.socket) {
      cell.ws = new CellWS(cell, init_data.socket)
    }
    cell.command(init_data.command)
    cell.reloader(init_data.reloader, cell.interval)
    cell.setGridArea()

    $(".dashboard").append(dash_cell)
    cells.push(cell)
    return cell
  }
  Cell.prototype.title = function(new_title) {
    if (new_title == undefined) {
      return this.my_title
    } else {
      this.my_title = new_title
      this.ele.children(".dash-title").children("span").text(new_title)
      return this
    }
  }
  Cell.prototype.text = function(new_text) {
    if (new_text == undefined) {
      return this.my_text
    } else {
      new_text = Text.escape(new_text)
      this.my_text = new_text
      this.ele.children(".dash-content").html(Text.markup(new_text))
      return this
    }
  }
  Cell.prototype.lines = function(new_lines) {
    if (new_lines == undefined) {
      return this.text().split("\n")
    } else {
      this.text(new_lines.join("\n"))
      return this
    }
  }
  Cell.prototype.line = function(idx, new_line) {
    if (new_line == undefined) {
      return this.text().split("\n")[idx]
    } else {
      var lines = this.text().split("\n")
      lines[idx] = new_line
      this.lines(lines)
      return this
    }
  }
  Cell.prototype.data = function(new_data) {
    if (new_data == undefined) {
      return this.my_data
    } else {
      this.my_data = new_data
      return this
    }
  }
  Cell.prototype.setGridArea = function() {
    var area = {
      rowStart: this.y || "auto",
      colStart: this.x || "auto",
      rowEnd: this.h ? "span " + this.h : "auto",
      colEnd: this.w ? "span " + this.w : "auto",
    }

    var pieces = [area.rowStart, area.colStart, area.rowEnd, area.colEnd]

    this.ele.css({ gridArea: pieces.join(" / ") })
  }
  Cell.prototype.flash = function() {
    var cell = this

    cell.ele.addClass("flash")
    setTimeout(function() {
      cell.ele.removeClass("flash")
    }, 1000)

    return this
  }
  Cell.prototype.resetTimer = function(new_interval) {
    var cell = this
    clearTimeout(cell.timer)
    cell.timer = undefined
    cell.interval = new_interval

    if (new_interval != undefined) {
      cell.timer = setTimeout(function() {
        cell.reload()
      }, cell.interval)
    }
  }
  Cell.prototype.reload = function() {
    var cell = this
    if (cell.my_reloader && typeof(cell.my_reloader) === "function") {
      cell.my_reloader(cell)
    }

    cell.resetTimer(cell.interval)

    if (cell.should_flash) { cell.flash() }

    return cell
  }
  Cell.prototype.reloader = function(callback, interval) {
    var cell = this

    clearTimeout(cell.timer)
    cell.my_reloader = callback

    cell.reload()

    return cell
  }
  Cell.prototype.command_list = function() {
    var commands = [
      ".reload",
      ".debug",
      ".start",
      ".stop",
      ".hide",
      ".show",
    ]
    return Object.keys(this.commands).forEach(function(cmd) {
      if (!commands.includes("." + cmd)) {
        commands.push("." + cmd)
      }
    })
  }
  Cell.prototype.autocomplete = function(text) {
    var options = []
    if (this.autocomplete_options && typeof(this.autocomplete_options) === "function") {
      options = this.autocomplete_options()
    } else {
      options = autocomplete_options
    }

    return Text.filterOrder(text, options)
  }
  Cell.prototype.execute = function(text) {
    if (this.my_command && typeof(this.my_command) === "function") { this.my_command(text, this) }

    return this
  }
  Cell.prototype.command = function(command) {
    if (command && typeof(command) === "function") { this.my_command = command }

    return this
  }
  Cell.prototype.debug = function() {
    var cell = this
    console.log(cell)
  }
  Cell.prototype.stop = function() {
    var cell = this
    clearTimeout(cell.timer)
    if (cell.ws) { cell.ws.close() }
  }
  Cell.prototype.start = function() {
    var cell = this
    if (cell.ws) { cell.ws.reopen() }
    cell.reload()
  }
  Cell.prototype.hide = function(a, b, c, d) {
    var cell = this
    cell.ele.addClass("hide")
  }
  Cell.prototype.show = function() {
    var cell = this
    cell.ele.removeClass("hide")
  }
  Cell.prototype.active = function(reset_omnibar) {
    $(".dash-cell").removeClass("active")
    this.ele.addClass("active")
    if (!reset_omnibar) { return }

    var prev = $(".dashboard-omnibar input").val()
    prev = prev.replace(/\:(\w|\-)+ ?/i, "")
    $(".dashboard-omnibar input").val(":" + this.name + " " + prev)
  }
  Cell.inactive = function() {
    $(".dash-cell").removeClass("active")
  }
  Cell.from_selector = function(selector) {
    return cells.find(function(cell) {
      return cell.name.toLowerCase() == selector.toLowerCase()
    })
  }
  Cell.from_ele = function(ele) {
    var $ele = $(ele)

    return cells.find(function(cell) {
      return cell.ele.get(0) == $ele.get(0)
    })
  }

  CellWS = function(cell, init_data) {
    var cell_ws = this
    cell_ws.cell = cell
    cell_ws.open = false
    cell_ws.reload = false
    cell_ws.presend = init_data.presend
    // cell_ws.socket = new WebSocket(init_data.url)
    cell_ws.socket = new ReconnectingWebSocket(init_data.url)
    // cell_ws.send = init_data.send || function(packet) { cell_ws.push(packet) }

    cell_ws.socket.onopen = function() {
      cell_ws.open = true

      if (init_data.authentication && typeof(init_data.authentication) === "function") {
        init_data.authentication(cell_ws)
      }

      if (init_data.onopen && typeof(init_data.onopen) === "function") { init_data.onopen() }
      if (cell_ws.reload) {
        cell_ws.cell.reload()
        cell_ws.reload = false
      }
    }

    cell_ws.socket.onclose = function() {
      cell_ws.open = false
      cell_ws.reload = true
      if (init_data.onclose && typeof(init_data.onclose) === "function") { init_data.onclose() }
    }

    cell_ws.socket.onerror = function(msg, a, b, c) {
    }

    cell_ws.socket.onmessage = function(msg) {
      if (init_data.receive && typeof(init_data.receive) === "function") {
        if (cell_ws.should_flash) { cell_ws.cell.flash() }
        init_data.receive(cell_ws.cell, msg)
      }
    }
  }
  CellWS.prototype.reopen = function() {
    var cell_ws = this
    cell_ws.cell.ws = new CellWS(cell_ws.cell, cell_ws.cell.init_data.socket)
  }
  CellWS.prototype.close = function() {
    var cell_ws = this
    cell_ws.open = false
    cell_ws.socket.close()
  }
  // Packet data should be another function on WS that can be defined for pre-formatting ws messages
  CellWS.prototype.send = function(packet) {
    var cell_ws = this
    if (cell_ws.open) {
      if (cell_ws.presend && typeof(cell_ws.presend) === "function") {
        packet = cell_ws.presend(packet)
      }

      cell_ws.socket.send(JSON.stringify(packet))
    } else {
      setTimeout(function() {
        cell_ws.send(packet)
      }, 500)
    }
  }

  $(document).on("click", ".dash-cell", function() {
    var cell = Cell.from_ele(this)

    if (cell) { cell.active(true) }
  }).on("keyup", function(evt) {
    var raw = $(".dashboard-omnibar input").val()
    var selector = raw.match(/(?:\:)(\w|\-)+/i)
    selector = selector ? selector[0].slice(1) : ""

    var cell = Cell.from_selector(selector)
    if (cell) {
      cell.active()
    } else {
      Cell.inactive()
    }
  }).on("keydown", function(evt) {
    if (!evt.metaKey) {
      $(".dashboard-omnibar input").focus()
    } else if (evt.key == "Tab") {
      evt.preventDefault()

      // current cell . autocomplete(raw - selector)
      // Open up autocomplete. Cell can define a function here, but default to aggregating the list of avaialble functions
    }
    // evt.key == ">"
    // Enter cell. Add a new class for the cell that makes it "focused"
    // `Esc` will break out of focus mode.
    // During Focus, all key events are sent directly to the cell.
    // Can be used for inline editing or live key events.
  }).on("keydown", ".dashboard-omnibar input", function(evt) {
    var raw = $(".dashboard-omnibar input").val()
    var selector = raw.match(/\:(\w|\-)+ /i)
    selector = selector ? selector[0] : ""
    var cmd = raw.replace(/\:(\w|\-)+ /i, "")

    if (evt.key == "Enter") {
      if (dashboard_history[dashboard_history.length - 1] != raw.trim()) {
        dashboard_history.unshift(raw.trim())
      }
      history_hold = ""
      history_idx = -1
      if (raw == ".reload") {
        cells.forEach(function(cell) {
          cell.reload()
        })

        $(".dashboard-omnibar input").val(selector)
      }

      var cell = Cell.from_ele($(".dash-cell.active"))
      if (!cell) { return console.log("No cell selected") }

      var func_regex = /^ *\.\w+ */
      if (func_regex.test(cmd)) {
        var raw_func = cmd.match(func_regex)[0].slice(1).trim()
        var cmd = cmd.replace(func_regex, "")
        var func = cell.commands[raw_func]
        if (func && typeof(func) == "function") {
          func.call(cell, cell, cmd)
        } else {
          func = cell[raw_func]
          if (func && typeof(func) == "function") {
            func.call(cell, cell, cmd)
          } else {
            cell.execute("." + raw_func + " " + cmd)
          }
        }
      } else {
        cell.execute(cmd)
      }

      $(".dashboard-omnibar input").val(selector)
    } else if (evt.key == "Tab") {
      evt.preventDefault()
    } else if (evt.key == "ArrowUp") {
      evt.preventDefault()
      if (history_idx == -1 && dashboard_history.length > 0) {
        history_hold = raw
        history_idx = 0
        $(".dashboard-omnibar input").val(dashboard_history[0])
      } else if (history_idx < dashboard_history.length - 1) {
        history_idx += 1
        $(".dashboard-omnibar input").val(dashboard_history[history_idx])
      }
    } else if (evt.key == "ArrowDown") {
      evt.preventDefault()
      if (history_idx <= 0 && history_hold.length > 0) {
        history_idx = -1
        $(".dashboard-omnibar input").val(history_hold)
        history_hold = ""
      } else if (history_idx > 0) {
        history_idx -= 1
        $(".dashboard-omnibar input").val(dashboard_history[history_idx])
      }
    }
  })
})
