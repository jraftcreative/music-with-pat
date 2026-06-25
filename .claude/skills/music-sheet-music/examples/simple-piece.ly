\version "2.24.0"
\header {
  title = "Simple Melody"
  composer = "For teaching use"
  tagline = ##f
}
\score {
  \relative c' {
    \clef treble
    \key g \major
    \time 3/4
    \tempo "Waltz" 4 = 120
    g4 b d | c2 a4 | b4 g e | d2. |
    g4 b d | c2 a4 | b4 g fis | g2. \bar "|."
  }
  \layout { }
}
