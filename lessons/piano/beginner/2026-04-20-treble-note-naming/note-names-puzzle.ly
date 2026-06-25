\version "2.24.0"
\header {
  tagline = ##f
}

\paper {
  indent = 0
  print-page-number = ##f
  top-margin = 0.6\cm
  bottom-margin = 0.6\cm
  left-margin = 1\cm
  right-margin = 1\cm
}

\score {
  \new Staff \with { \remove "Time_signature_engraver" } {
    \clef treble
    \key c \major
    c'1_\markup{\bold\large "1"}
    e'_\markup{\bold\large "2"}
    g'_\markup{\bold\large "3"}
    d'_\markup{\bold\large "4"}
    f'_\markup{\bold\large "5"}
    \break
    e'_\markup{\bold\large "6"}
    c'_\markup{\bold\large "7"}
    g'_\markup{\bold\large "8"}
    f'_\markup{\bold\large "9"}
    d'_\markup{\bold\large "10"}
    \bar "|."
  }
  \layout { }
}
