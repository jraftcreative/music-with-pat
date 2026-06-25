#import "../templates/worksheet-template.typ": worksheet, exercise, answer-key

#show: worksheet.with(
  title: "Interval Identification",
  subtitle: "Intermediate Theory",
  level: "Intermediate",
  instructions: [
    For each interval below, write the name (e.g., "major 3rd", "perfect 5th",
    "minor 2nd"). All intervals are within one octave, ascending, starting
    from the note given.
  ],
)

#exercise("1")[C to E: #box(width: 3cm, repeat[.])]
#exercise("2")[D to A: #box(width: 3cm, repeat[.])]
#exercise("3")[F to B: #box(width: 3cm, repeat[.])]
#exercise("4")[G to F: #box(width: 3cm, repeat[.])]
#exercise("5")[A to C: #box(width: 3cm, repeat[.])]
#exercise("6")[E to G\#: #box(width: 3cm, repeat[.])]
#exercise("7")[B♭ to F: #box(width: 3cm, repeat[.])]
#exercise("8")[C to A: #box(width: 3cm, repeat[.])]

#answer-key[
  1. major 3rd  2. perfect 5th  3. augmented 4th (tritone)  4. minor 7th
  5. minor 3rd  6. major 3rd    7. perfect 5th               8. major 6th
]
