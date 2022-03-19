Entry.loadFromJSON([
  {
    name: "WorldA",
    summary: "one of 3 goldilocks planets in the system",
    type: "place",
    subtypes: ["world"],
    children: [
      {
        name: "platheon",
        summary: "continent filled with jungles",
        type: "place",
        subtypes: ["region"],
        children: [
          {
            name: "Johnny Slinger",
            summary: "ruthless mercenary from the jungles",
            description: "",
            type: "npc",
            subtypes: ["bad]"
          },
          {
            name: "Crash",
            summary: "Underling for Johnny Slinger",
            description: "",
            type: "npc",
            subtypes: ["bad]"
          },
          {
            name: "Cooper",
            summary: "Underling for Johnny Slinger",
            description: "",
            type: "npc",
            subtypes: ["bad]"
          },
          {
            name: "jurgaen",
            summary: "treehouse town just below the high canopies",
            type: "place",
            subtypes: ["city"],
            children: [
              {
                name: "Nathaniel Blacke",
                summary: "thin, but muscled. clean-shaven",
                description: "younger brother killed by Johnny Slinger",
                type: "npc",
                subtypes: ["good]"
              },
              {
                name: "Tilted Anvil",
                summary: "Blacksmith shop owned by  Nathaniel",
                type: "place",
                subtypes: ["shop"],
              },
              {
                name: "The Book Worm",
                summary: "town library & bookstore",
                type: "place",
                subtypes: [["shop", "service"]],
              },
              {
                name: "Gruggenheim",
                summary: "tavern. blackened stone, ran by goblins",
                type: "place",
                subtypes: ["shop"],
              }
            ],
          }
        ]
      },
      {
        name: "u'thruk",
        summary: "Volcanic land surrounded by lava flows",
        type: "place",
        subtypes: ["region"],
        children: [
          {
            name: "th'rom",
            summary: "city deep underground, filling old empty lava tubes",
            type: "place",
            subtypes: ["city"],
            children: [
              {
                name: "Ginger-Vitae",
                summary: "cybernetic body enhancement parlor",
                type: "place",
                subtypes: ["shop"],
              },
              {
                name: "duck pond",
                summary: "a medium sized pond. it has ducks.",
                type: "place",
                subtypes: ["service"],
              },
              {
                name: "Chapel of the fifth sky",
                summary: "church ran by an underground cult. they pay taxes.",
                type: "place",
                subtypes: ["entertainment"],
              }
            ],
          }
        ]
      },
      {
        name: "grethen",
        summary: "north-most region of planet. usually covered in snow",
        type: "place",
        subtypes: ["region"],
        children: [
          {
            name: "wryze-all",
            summary: "town of nomads, traversing the icy plains following the seals",
            type: "place",
            subtypes: ["city"],
            children: [
              {
                name: "tictockery",
                summary: "shop filled with gizmos run by local artificer",
                type: "place",
                subtypes: ["shop"],
              },
              {
                name: "sheriff's office",
                summary: "sheriff Cunningham works here",
                type: "place",
                subtypes: ["service"],
              },
              {
                name: "a bard's tail",
                summary: "the town's local theatre, run by tiny dragons. also used for magic duels",
                type: "place",
                subtypes: ["entertainment"],
              }
            ],
          }
        ]
      }
    ]
  }
])
