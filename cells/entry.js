var entries = []
Entry = function() {
  this.name = ""
  this.summary = ""
  this.description = ""
  this.type = "" // ["npc", "monster", "place", "item"]
  this.sub_type = "" // ["food", "weapon", "key", ...]
  this.children = []

  // "search" - Searches name, summary, description, type, sub_type
  // >type "search" - Searches only by Entries by type OR sub_type
  // exact/name/nested/down - Each word must match exactly (and automcomplete last one)
  // .gen
}
Entry.search(function(text) {
})
// Entry.prototype.to_json(function() {
// })
