\version "2.24.0"
\header {
  title = "G Major Scale (Violin)"
  subtitle = "One octave, first position"
  tagline = ##f
}
\score {
  \relative g {
    \clef treble
    \key g \major
    \time 4/4
    \tempo "Andante" 4 = 80
    g4-0 a-1 b-2 c-3 | d-0 e-1 fis-2 g-3 |
    g-3 fis-2 e-1 d-0 | c-3 b-2 a-1 g-0 \bar "|."
  }
  \layout { }
}
