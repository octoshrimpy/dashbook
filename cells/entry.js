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

  return Text.filterOrder(text, options, function() {
    return this.name
  })
}
Entry.prototype.path = function() {
  var generation = this
  var path_arr = []

  while (generation) {
    path_arr.push(generation.name)
    generation = generation.parent
  }

  return path_arr.reverse().join("/")
}

var omnisearch = function() {
  $(".drop-item").remove()
  Entry.search($(this).val()).forEach(function(entry) {
    var item_name = $("<span>", { class: "name" }).text(entry.path())
    var drop_item = $("<div>", { class: "drop-item" }).append(item_name)
    var summary = $("<div>", { class: "summary" }).text(entry.summary)
    if (entry.summary && entry.summary.length > 0) { drop_item.append(summary) }

    $(".dropup").append(drop_item)
  })
}

$(".ctr-dashboard").ready(function() {
  $(".dashboard-omnibar input").on("keyup", function() {
    omnisearch.call(this)
  }).blur(function() {
    $(".drop-item").remove()
  }).focus(function() {
    omnisearch.call(this)
  })
  $(document).on("mouseover", ".drop-item", function() {
    $(".drop-item").removeClass("selected")
    $(this).addClass("selected")
  }).on("mousedown", ".drop-item", function() {
    $(".dashboard-omnibar input").val($(this).children(".name").text())
    $(".dashboard-omnibar input").focus()
  })
})
