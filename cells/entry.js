var notes
entries = []
Entry = function(data) {
  this.name = data.name || ""
  this.summary = data.summary || ""
  this.description = data.description || ""
  this.type = data.type || "" // ["npc", "monster", "place", "item"]
  this.subtype = data.subtype || "" // ["food", "weapon", "key", ...]
  this.children = data.children || []
  this.parent = data.parent || null

  // "d" - Searches name, summary, description, type, sub_type
  // >type "search" - Searches only by Entries by type OR sub_type
  // exact/name/nested/down - Each word must match exactly (and automcomplete last one)
  // .gen
}
Entry.loadFromObj = function(obj, parent) {
  var new_entry = new Entry({
    name: obj.name,
    summary: obj.summary,
    description: obj.description,
    type: obj.type,
    subtype: obj.subtype,
    parent: parent,
  })

  new_entry.children = Entry.loadFromJSON(obj.children, new_entry)
  entries.push(new_entry)

  return new_entry
}

Entry.loadFromJSON = function(data, parent) {
  if (!data || data.length == 0) { return data }

  if (Array.isArray(data)) {
    return data.map(function(nested_data) {
      return Entry.loadFromJSON(nested_data, parent)
    })
  } else {
    return Entry.loadFromObj(data, parent)
  }
}
Entry.search = function(text) {
  var options = entries
  var match_type = "name"

  if (/\".*?\"/.test(text)) {
    match_type = "all"
    var quotes = text.match(/\"(.*?)\"/)
    var query = quotes[1]
    var path = text.replace(quotes[0], "")
  } else {
    var segments = text.split("/")
    var query = segments.pop()
    var path = segments.join("/")
  }
  path = path.trim().replace(/\/$/, "")

  if (path.length > 0) {
    options = options.filter(function(option) {
      return option.ancestors().map(function(entry) { return entry.path() }).includes(path)
    })
  }

  if (match_type == "name") {
    var transformer = function() { return this.name }
  } else if (match_type == "all") {
    var transformer = function() { return this.allContent() }
  }

  return Text.filterOrder(query, options, transformer)
}
Entry.prototype.ancestors = function(include_self) {
  var generation = include_self ? this : this.parent
  var tree = []

  while (generation) {
    tree.push(generation)
    generation = generation.parent
  }

  return tree.reverse()
}
Entry.prototype.path = function() {
  return this.ancestors(true).map(function(entry) { return entry.name }).join("/")
}
Entry.prototype.allContent = function(include_self) {
  return [this.name, this.summary, this.description].join(" ")
}

var omnisearch = function() {
  $(".drop-item").remove()
  if ($(this).val().trim().length == 0) { return }

  Entry.search($(this).val()).slice(0, 10).forEach(function(entry) {
    var item_name = $("<span>", { class: "name" }).text(entry.path())
    var drop_item = $("<div>", { class: "drop-item" }).append(item_name)
    var summary = $("<div>", { class: "summary" }).text(entry.summary)
    if (entry.summary && entry.summary.length > 0) { drop_item.append(summary) }

    $(".dropup").append(drop_item)
  })
  if ($(".drop-item.selected").length == 0) { $(".drop-item").first().addClass("selected") }
}

$(".ctr-dashboard").ready(function() {
  $(".ctr-dashboard").click(function() { $(".dashboard-omnibar input").focus() })

  $(".dashboard-omnibar input").on("keyup", function(evt) {
    if (!["ArrowUp", "ArrowDown"].includes(evt.key)) {
      omnisearch.call(this)
    }
  }).blur(function() {
    $(".drop-item").remove()
  }).focus(function() {
    omnisearch.call(this)
  }).on("keydown", function(evt) {
    if (evt.key == "ArrowUp") {
      evt.preventDefault()
      evt.stopPropagation()

      if ($(".drop-item.selected").length > 0) {
        // next because CSS reverses order
        var next = $(".drop-item.selected").next()
        if (next) {
          $(".drop-item").removeClass("selected")
          next.addClass("selected")
        }
      } else {
        // first because CSS reverses order
        $(".drop-item").first().addClass("selected")
      }
    } else if (evt.key == "ArrowDown") {
      evt.preventDefault()
      evt.stopPropagation()

      if ($(".drop-item.selected").length > 0) {
        // prev because CSS reverses order
        var prev = $(".drop-item.selected").prev()
        if (prev) {
          $(".drop-item").removeClass("selected")
          prev.addClass("selected")
        }
      } else {
        // first because CSS reverses order
        $(".drop-item").last().addClass("selected")
      }
    } else if (evt.key == "Tab" || evt.key == "Enter") {
      if ($(".drop-item.selected").length > 0) {
        $(".dashboard-omnibar input").val($(".drop-item.selected").children(".name").text() + "/")
        $(".dashboard-omnibar input").focus()
      } else if ($(".dashboard-omnibar input").val() == "") {
        $(".dashboard-omnibar input").val("/")
        $(".dashboard-omnibar input").focus()
      }
    } else if (evt.key == "Escape") {
      evt.preventDefault()
      evt.stopPropagation()
      $(".dashboard-omnibar input").blur()
    } else if (evt.altKey && /Digit\d/.test(evt.code)) {
      evt.preventDefault()

      var selector = $(".keeb[dataIdx=" + evt.code.match(/\d/)[0] + "]").attr("dataSelector")

      var raw = $(".dashboard-omnibar input").val()
      var old_selector = raw.match(/\:(\w|\-)+ ?/i)
      old_selector = old_selector ? old_selector[0] : ""
      raw = raw.replace(old_selector, "")

      $(".dashboard-omnibar input").val(":" + selector + " " + raw)
    }
  })

  $(document).on("mouseover", ".drop-item", function() {
    $(".drop-item").removeClass("selected")
    $(this).addClass("selected")
  }).on("mousedown", ".drop-item", function() {
    $(".dashboard-omnibar input").val($(this).children(".name").text())
    $(".dashboard-omnibar input").focus()
  })
})
