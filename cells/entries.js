Entry.loadFromJSON([
  {
    name: "WorldA",
    summary: "one of 3 goldilocks planets in the system",
    type: "place",
    subtype: "world",
    children: [
      {
        name: "platheon",
        summary: "continent filled with jungles",
        type: "place",
        subtype: "region",
        children: [
          {
            name: "jurgaen",
            summary: "treehouse town just below the high canopies",
            type: "place",
            subtype: "city",
            children: [],
          }
        ]
      },
      {
        name: "u'thruk",
        summary: "Volcanic land surrounded by lava flows",
        type: "place",
        subtype: "region",
        children: [
          {
            name: "th'rom",
            summary: "city deep underground, filling old empty lava tubes",
            type: "place",
            subtype: "city",
            children: [],
          }
        ]
      },
      {
        name: "grethen",
        summary: "north-most region of planet. usually covered in snow",
        type: "place",
        subtype: "region",
        children: [
          {
            name: "wryze-all",
            summary: "town of nomads, traversing the icy plains following the seals",
            type: "place",
            subtype: "city",
            children: [],
          }
        ]
      }
    ]
  }
])
