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
    commands: {
      clear: function(cell) {
        localStorage.removeItem("secondary_notes")
        cell.text("")
      }
    },
    reloader: function(cell) {
      populateKeeb(cell)
      if (localStorage.getItem("secondary_notes") == null) {
        var lines = []
        lines.push("Click on this cell to select Notes")
        lines.push("Enter any text to add as an item to the list.")
        lines.push("Type - followed by a number to remove that item from the list. For example: '-3' will remove this item")
        lines.push("Use '.clear' to completely empty all notes.")
        lines.push("This message will reappear after a reload if '.clear' is used, but not if you remove the lines one by one.")
        lines.push("Cells can be positioned specifically and resized, but will default to 1x1 and left-right top-bottom.")
        lines = Text.numberedList(lines)
        localStorage.setItem("secondary_notes", lines.join("\n"))
        cell.lines(lines)
      } else {
        cell.text(localStorage.getItem("secondary_notes"))
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

      localStorage.setItem("secondary_notes", note)
      cell.text(note)
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
