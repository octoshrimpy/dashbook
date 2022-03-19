$(".ctr-dashboard").ready(function() {
  var idx = 0
  var populateKeeb = function(cell) {
    $(cell.ele).children(".keeb").remove()
    $(cell.ele).prepend(
      $("<span>", {
        class: "keeb",
        dataIdx: cell.data.idx,
        dataSelector: cell.name,
      }).text(cell.data.idx)
    )
  }

  Cell.init({
    title: "Upcoming Notes",
    x: 1,
    y: 1,
    w: 1,
    h: 4,
    data: { idx: idx += 1 },
    reloader: function(cell) {
      populateKeeb(cell)
      cell.text(localStorage.getItem("notes"))
    },
    commands: {
      clear: function(cell) {
        localStorage.removeItem("notes")
        cell.text("")
      }
    },
    command: function(text, cell) {
      if (/^-\d+$/.test(text)) {
        var num = parseInt(text.match(/\d+/)[0])
        var lines = cell.text().split("\n")
        lines.splice(num-1, 1)
      } else {
        var lines = cell.text() ? cell.text().split("\n") : []
        lines.push(text)
      }

      var note = Text.numberedList(lines).join("\n")

      localStorage.setItem("notes", note)
      cell.text(note)
    }
  })


  Cell.init({
    title: "Notes",
    x: 2,
    y: 1,
    w: 2,
    h: 4,
    data: { idx: idx += 1 },
    reloader: function(cell) {
      populateKeeb(cell)
    },
    command: function(msg, cell) {
      if (msg == "-") {
        cell.lines(entries.map(function(entry) { return entry.name }))
      } else {
        cell.lines(Entry.search(msg))
      }
    }
  })

  Cell.init({
    title: "Audio",
    x: 4,
    y: 1,
    w: 1,
    h: 2,
    data: { idx: idx += 1 },
    reloader: function(cell) {
      populateKeeb(cell)
    },
  })

  Cell.init({
    title: "Generators",
    x: 4,
    y: 3,
    w: 1,
    h: 2,
    data: { idx: idx += 1 },
    reloader: function(cell) {
      populateKeeb(cell)
    },
  })
})
