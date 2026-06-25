\version "2.24.0"
\header {
  title = "C Major Scale"
  subtitle = "One octave, right hand"
  tagline = ##f
}
\score {
  \relative c' {
    \clef treble
    \key c \major
    \time 4/4
    \tempo "Moderato" 4 = 96
    c4-1 d-2 e-3 f-1 g-2 a-3 b-4 c-5 |
    c-5 b-4 a-3 g-2 f-1 e-3 d-2 c-1 \bar "|."
  }
  \layout { }
  \midi { }
}
