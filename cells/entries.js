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
            children: [
              {
                name: "Tilted Anvil",
                summary: "Blacksmith shop owned by  Nathaniel",
                type: "place",
                subtype: "shop",
              },
              {
                name: "The Book Worm",
                summary: "town library & bookstore",
                type: "place",
                subtype: ["shop", "service"],
              },
              {
                name: "Gruggenheim",
                summary: "tavern. blackened stone, ran by goblins",
                type: "place",
                subtype: "shop",
              }
            ],
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
            children: [
              {
                name: "Ginger-Vitae",
                summary: "cybernetic body enhancement parlor",
                type: "place",
                subtype: "shop",
              },
              {
                name: "duck pond",
                summary: "a medium sized pond. it has ducks.",
                type: "place",
                subtype: "service",
              },
              {
                name: "Chapel of the fifth sky",
                summary: "church ran by an underground cult. they pay taxes.",
                type: "place",
                subtype: "entertainment",
              }
            ],
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
            children: [
              {
                name: "tictockery",
                summary: "shop filled with gizmos run by local artificer",
                type: "place",
                subtype: "shop",
              },
              {
                name: "sheriff's office",
                summary: "sheriff Cunningham works here",
                type: "place",
                subtype: "service",
              },
              {
                name: "a bard's tail",
                summary: "the town's local theatre, run by tiny dragons. also used for magic duels",
                type: "place",
                subtype: "entertainment",
              }
            ],
          }
        ]
      }
    ]
  }
])
