#import "worksheet-template.typ": worksheet, exercise, answer-key

#show: worksheet.with(
  title: "My Piano Practice Page",
  subtitle: "For a Super-Star Piano Friend",
  level: "Beginner",
  instructions: [
    Hi superstar! This is your practice page for the week. Every day you practice,
    tick a box. Try all the fun tasks below. Ask a grown-up if you need help —
    you can do this!
  ],
)

== This Week I Practiced On...

#grid(
  columns: (1fr,) * 7,
  column-gutter: 0.5em,
  row-gutter: 0.5em,
  ..("Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun").map(day =>
    align(center)[
      *#day* \
      #box(width: 1.7cm, height: 1.7cm, stroke: 1.5pt + black, radius: 4pt)
    ]
  )
)

#v(1.5em)

== Note-Naming Fun

Look at each note on the music line. Write its letter name in the matching box below.
The notes are *C*, *D*, *E*, *F*, or *G*.

#align(center)[
  #image("note-names-puzzle.pdf", width: 95%)
]

#v(0.3em)

#grid(
  columns: (1fr,) * 5,
  column-gutter: 0.5em,
  row-gutter: 0.8em,
  ..range(1, 11).map(i =>
    align(center)[
      #text(size: 14pt, weight: "bold")[#i.] \
      #box(width: 1.6cm, height: 1.6cm, stroke: 1pt + black, radius: 4pt)
    ]
  )
)

#v(1.5em)

== At the Piano

Tick each box when you finish!

#let piano-task(content) = [
  #grid(
    columns: (1em, 1fr),
    column-gutter: 0.6em,
    box(width: 0.9em, height: 0.9em, stroke: 1pt + black, radius: 2pt),
    content,
  )
]

#piano-task[Find and play *Middle C* — five times!]
#piano-task[Say *"C, D, E, F, G"* out loud while playing each white key in order.]
#piano-task[Play your favorite piece all the way through.]
#piano-task[Hum along while you play a line — make it sing!]

#v(1em)

== My Practice Star

When I finish everything on this page, I color in my star!

#align(center)[
  #box(
    width: 4cm,
    height: 4cm,
    stroke: 2pt + rgb("d4a017"),
    fill: rgb("fffbe6"),
    radius: 8pt,
  )[
    #align(center + horizon)[
      #text(size: 40pt, weight: "bold", fill: rgb("d4a017"))[★]
    ]
  ]
]

#answer-key[
  == Teacher / Parent Guide

  *Note-naming answers* (left-to-right, row by row):

  1. C  2. E  3. G  4. D  5. F \
  6. E  7. C  8. G  9. F  10. D

  *Target practice time* for age 6–8:
  10 minutes per day, 5–6 days per week. Consistency beats duration at this stage.

  *If the child struggles with note-naming:*
  Use treble-clef mnemonics. Lines (bottom to top): "Every Good Boy Deserves Fudge"
  — the first letter of each word is a line name (E, G, B, D, F). Spaces (bottom to top): F–A–C–E.
  Work on one line or space per practice session.

  *If the child gets bored at the piano:*
  - Skip to the "hum along" task first — it's the most playful and builds musicality.
  - Try duets: you clap a steady beat while they play the notes.
  - Use stickers instead of ticks on the practice-day boxes for extra motivation.
  - Celebrate effort, not perfection. Every ticked box is a win.
]
