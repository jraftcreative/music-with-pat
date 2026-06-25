\version "2.24.0"
\header {
  title = "Piano Grand Staff Example"
  tagline = ##f
}
upper = \relative c' {
  \clef treble
  \key c \major
  \time 4/4
  c4 e g e | f a g2 | e4 d c2 \bar "|."
}
lower = \relative c {
  \clef bass
  \key c \major
  \time 4/4
  c4 g' c, g' | f, a' c, a' | c,, g' c2 \bar "|."
}
\score {
  \new PianoStaff <<
    \new Staff = "RH" \upper
    \new Staff = "LH" \lower
  >>
  \layout { }
}
