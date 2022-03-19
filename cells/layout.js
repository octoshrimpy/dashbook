$(".ctr-dashboard").ready(function() {
  Cell.init({
    title: "Upcoming Notes",
    x: 1,
    y: 1,
    w: 1,
    h: 4,
    reloader: function(cell) {
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
    title: "Audio",
    x: 4,
    y: 1,
    w: 1,
    h: 2,
  })
  Cell.init({
    title: "Generators",
    x: 4,
    y: 3,
    w: 1,
    h: 2,
  })
  Cell.init({
    title: "Notes",
    x: 2,
    y: 1,
    w: 2,
    h: 4,
    command: function(msg, cell) {
      if (msg == "-") {
        cell.lines(entries.map(function(entry) { return entry.name }))
      } else {
        cell.lines(Entry.search(msg))
      }
    }
  })
})
