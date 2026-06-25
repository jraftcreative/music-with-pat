// Reusable worksheet template.
// Usage: #import "worksheet-template.typ": worksheet
// Then: #show: worksheet.with(title: "...", instructions: "...", level: "...")

#let worksheet(
  title: "Untitled Worksheet",
  subtitle: none,
  level: "",
  instructions: "",
  student-name-line: true,
  body,
) = {
  set page(
    paper: "us-letter",
    margin: (top: 2.5cm, bottom: 2cm, x: 2cm),
    header: [
      #set text(size: 9pt, fill: gray)
      #grid(
        columns: (1fr, auto),
        align: (left, right),
        [Music With Pat — #level],
        [#title],
      )
      #line(length: 100%, stroke: 0.4pt + gray)
    ],
    footer: context [
      #set text(size: 8pt, fill: gray)
      #align(center)[— #counter(page).display() —]
    ],
  )
  set text(font: "New Computer Modern", size: 11pt)
  set par(justify: true, leading: 0.7em)

  // Title block
  align(center)[
    #text(size: 18pt, weight: "bold")[#title]
    #if subtitle != none [
      \ #text(size: 12pt, style: "italic")[#subtitle]
    ]
  ]

  if student-name-line {
    v(0.8em)
    grid(
      columns: (1fr, 1fr),
      [*Name:* #box(width: 6cm, repeat[.])],
      align(right)[*Date:* #box(width: 4cm, repeat[.])],
    )
  }

  // Instructions box
  if instructions != "" {
    v(0.8em)
    rect(
      width: 100%,
      inset: 10pt,
      stroke: 0.6pt + gray,
      radius: 3pt,
      fill: rgb("f6f6f6"),
    )[
      *Instructions:* #instructions
    ]
  }

  v(1em)
  body
}

// Helper: numbered exercise block
#let exercise(num, content) = {
  block(above: 0.8em, below: 0.8em)[
    *#num.* #content
  ]
}

// Helper: answer key page
#let answer-key(content) = {
  pagebreak()
  align(center)[#text(size: 16pt, weight: "bold")[Answer Key]]
  v(0.8em)
  content
}
