---
name: music-sheet-music
description: Engrave scales, exercises, or pieces as publication-grade sheet music PDFs using LilyPond. Use this skill when the user asks to write out, engrave, notate, or produce sheet music for any instrument (piano, violin, etc.) including scales, arpeggios, exercises, and short pieces. Output is a PDF and a .ly source file written to music-with-pat/lessons/.
---

# Music Sheet Music Engraver

Produce publication-quality sheet music PDFs from plain-text LilyPond source.

## When to use

Invoke when the user asks for any of:
- A scale, arpeggio, or exercise written out
- A short piece engraved from a description
- Sheet music with specific fingerings, dynamics, or articulations
- A practice exercise for a specific instrument and level

## What to produce

For each request, write two files side-by-side in the target folder:
1. `<slug>.ly` — LilyPond source (kept so materials can be regenerated or tweaked)
2. `<slug>.pdf` — compiled output

## Workflow

1. **Clarify inputs if missing:** instrument, key, level, what to engrave, any specific markings (fingering, dynamics, tempo). Ask only what's ambiguous.
2. **Determine target folder.** If the caller specified one, use it. Otherwise: `music-with-pat/lessons/<instrument>/<level>/<YYYY-MM-DD>-<topic-slug>/`. Create it with `mkdir -p`.
3. **Pick a starting example** from `examples/` in this skill:
   - `scales.ly` — single-staff scales with fingering
   - `piano-grand-staff.ly` — two-staff piano
   - `violin-exercise.ly` — violin with open-string and finger markings
   - `simple-piece.ly` — short melodic piece
4. **Author the .ly file.** Copy the closest example as a starting point, then modify the notes, key, time, markings. Always include the header (`title`, `tagline = ##f`). Always start with `\version "2.24.0"`.
5. **Compile:** `cd <target-folder> && lilypond <slug>.ly`. LilyPond writes `<slug>.pdf` alongside the source. If compilation prints errors, read them (LilyPond errors are specific — wrong note names, unbalanced braces, missing version), fix, rerun.
6. **Verify:** confirm the PDF exists. Report the path to the user.

## LilyPond cheat sheet

- **Pitches (Dutch default):** `c d e f g a b`; sharp = `cis`, flat = `ces`. Relative octaves: `c'` = middle C and above; `c,` = below. Inside `\relative c' { ... }`, each next note moves to the nearest octave.
- **Duration:** `c4` quarter, `c8` eighth, `c2` half, `c1` whole, `c4.` dotted quarter.
- **Key signature:** `\key g \major`, `\key d \minor`.
- **Time signature:** `\time 4/4`, `\time 3/4`, `\time 6/8`.
- **Clef:** `\clef treble`, `\clef bass`, `\clef alto`.
- **Tempo:** `\tempo "Andante" 4 = 80` (quarter note = 80 bpm).
- **Fingering:** `-1` `-2` `-3` `-4` `-5` after the note (e.g. `c4-1`). Violin open string = `-0`.
- **Dynamics:** `\p` `\mp` `\mf` `\f` `\ff` `\pp` after a note.
- **Articulations:** `-.` staccato, `->` accent, `--` tenuto, `\staccato`, `\accent`.
- **Slur:** `c4( d8 e)`. Tie: `c4~ c4`.
- **Barlines:** `\bar "|."` final, `\bar "||"` double.
- **Headers:** set `tagline = ##f` to hide the LilyPond footer.

## Output conventions

- File name: lowercase, hyphen-separated, describes content (`g-major-scale-violin.ly`, `rhythm-exercise-1.ly`).
- One piece per file. If asked for multiple scales, produce multiple files.
- Keep the examples from this skill as reference only — never overwrite them.

## If the user hasn't told you where to save

Default to: `music-with-pat/lessons/<instrument>/<level>/<YYYY-MM-DD>-<slug>/`.
Confirm the path in your response so the user can relocate if needed.
