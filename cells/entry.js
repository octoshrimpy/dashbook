var notes
entries = []
Entry = function(data) {
  this.name = data.name || ""
  this.summary = data.summary || ""
  this.description = data.description || ""
  this.type = data.type || "" // ["npc", "monster", "place", "item"]
  this.subtype = data.subtype || "" // ["food", "weapon", "key", ...]
  this.children = data.children || []

  // "d" - Searches name, summary, description, type, sub_type
  // >type "search" - Searches only by Entries by type OR sub_type
  // exact/name/nested/down - Each word must match exactly (and automcomplete last one)
  // .gen
}
Entry.loadFromObj = function(obj) {
  var new_entry = new Entry({
    name: obj.name,
    summary: obj.summary,
    description: obj.description,
    type: obj.type,
    subtype: obj.subtype,
    children: Entry.loadFromJSON(obj.children),
  })
  entries.push(new_entry)
  return new_entry
}

Entry.loadFromJSON = function(data) {
  if (!data || data.length == 0) { return data }

  if (Array.isArray(data)) {
    return data.map(function(nested_data) {
      return Entry.loadFromJSON(nested_data)
    })
  } else {
    return Entry.loadFromObj(data)
  }
}
Entry.search = function(text) {
  var options = entries.map(function(entry) { return entry.name })
  notes.lines(Text.filterOrder(text, options))
}
// Entry.prototype.to_json(function() {
// })


// grandparent/parent/child/grandchild/item
Entry.loadFromJSON([
  {
    name: "WorldA",
    type: "place",
    subtype: "world",
    children: [
      {
        name: "jurgaen",
        type: "place",
        subtype: "region",
        children: [
          {
            name: "city jurgaen",
            type: "place",
            subtype: "city",
            children: [],
          }
        ]
      },
      {
        name: "th'rom",
        type: "place",
        subtype: "region",
        children: [
          {
            name: "city th'rom",
            type: "place",
            subtype: "city",
            children: [],
          }
        ]
      },
      {
        name: "wryze-all",
        type: "place",
        subtype: "region",
        children: [
          {
            name: "city wryze-all",
            type: "place",
            subtype: "city",
            children: [],
          }
        ]
      }
    ]
  }
])
