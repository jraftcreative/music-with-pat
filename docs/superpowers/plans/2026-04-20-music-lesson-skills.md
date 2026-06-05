# Music Lesson Materials Skill Suite — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Install four globally-available Claude skills (`music-sheet-music`, `music-worksheet`, `music-lesson-plan`, `music-lesson-package`) that together let Claude produce music lesson materials (lesson plans, worksheets, engraved sheet music) for piano / violin / theory at all levels.

**Architecture:** Three specialist skills each wrap a clean toolchain (LilyPond for notation, Typst for worksheets, Markdown for plans) and write output to `music-with-pat/lessons/`. A fourth orchestrator skill invokes all three to produce full lesson packages. Skills live at `~/.claude/skills/<name>/SKILL.md` matching the existing `jraft-*` skill pattern.

**Tech Stack:** LilyPond (music engraving), Typst (typesetting), Markdown, Bash. Claude-authored SKILL.md files with YAML frontmatter.

**Spec:** `music-with-pat/docs/superpowers/specs/2026-04-20-music-lesson-skills-design.md`

---

## File Structure

**Toolchain installs (system-wide, Homebrew):**
- LilyPond — `/opt/homebrew/bin/lilypond` (Apple Silicon) or `/usr/local/bin/lilypond`
- Typst — `/opt/homebrew/bin/typst` or `/usr/local/bin/typst`

**Repo changes (`music-with-pat/`):**
- Modify: `.gitignore` — add `lessons/`
- Directory: `lessons/` — gitignored output root, populated on demand

**New skill files (`~/.claude/skills/`):**

```
~/.claude/skills/
  music-sheet-music/
    SKILL.md
    examples/
      scales.ly
      piano-grand-staff.ly
      violin-exercise.ly
      simple-piece.ly
  music-worksheet/
    SKILL.md
    templates/
      worksheet-template.typ
    examples/
      rhythm-counting.typ
      interval-identification.typ
  music-lesson-plan/
    SKILL.md
    examples/
      piano-beginner-rhythm.md
      violin-intermediate-vibrato.md
  music-lesson-package/
    SKILL.md
```

Each SKILL.md begins with YAML frontmatter (`name`, `description`) that Claude Code reads to surface the skill in the available-skills list.

---

## Task 1: Toolchain setup and repo preparation

**Files:**
- Modify: `music-with-pat/.gitignore`

- [ ] **Step 1: Verify Homebrew is available**

Run: `which brew`
Expected: `/opt/homebrew/bin/brew` or `/usr/local/bin/brew`. If missing, user must install Homebrew first.

- [ ] **Step 2: Install LilyPond**

Run: `brew install lilypond`
Expected: Install completes, or "already installed" message.
Verify: `lilypond --version` prints a version like `GNU LilyPond 2.24.x`.

- [ ] **Step 3: Install Typst**

Run: `brew install typst`
Expected: Install completes, or "already installed".
Verify: `typst --version` prints `typst 0.x.y`.

- [ ] **Step 4: Smoke-test LilyPond on a trivial input**

Run in a temp dir:
```bash
cd /tmp && cat > smoke.ly <<'EOF'
\version "2.24.0"
\relative c' { c d e f g a b c }
EOF
lilypond smoke.ly
ls smoke.pdf
```
Expected: `smoke.pdf` exists. Delete the temp files after.

- [ ] **Step 5: Smoke-test Typst on a trivial input**

Run:
```bash
cd /tmp && cat > smoke.typ <<'EOF'
= Hello
This is a Typst test.
EOF
typst compile smoke.typ
ls smoke.pdf
```
Expected: `smoke.pdf` exists. Delete temp files after.

- [ ] **Step 6: Add lessons/ to .gitignore**

Read `music-with-pat/.gitignore` first. Append a single line:
```
lessons/
```
(Add a blank line before if the file doesn't end with one.)

- [ ] **Step 7: Commit gitignore change**

Run from `music-with-pat/`:
```bash
git add .gitignore
git commit -m "chore: gitignore lessons/ output folder for generated materials"
```
Expected: commit succeeds.

- [ ] **Step 8: Create skills root directory**

Run: `mkdir -p ~/.claude/skills/music-sheet-music/examples ~/.claude/skills/music-worksheet/templates ~/.claude/skills/music-worksheet/examples ~/.claude/skills/music-lesson-plan/examples ~/.claude/skills/music-lesson-package`
Expected: all four skill directories exist with their subfolders.

---

## Task 2: Build `music-sheet-music` skill

**Files:**
- Create: `~/.claude/skills/music-sheet-music/SKILL.md`
- Create: `~/.claude/skills/music-sheet-music/examples/scales.ly`
- Create: `~/.claude/skills/music-sheet-music/examples/piano-grand-staff.ly`
- Create: `~/.claude/skills/music-sheet-music/examples/violin-exercise.ly`
- Create: `~/.claude/skills/music-sheet-music/examples/simple-piece.ly`

- [ ] **Step 1: Write `examples/scales.ly`**

```lilypond
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
```

(Fingerings for right hand: `-N` after each note.)

- [ ] **Step 2: Write `examples/piano-grand-staff.ly`**

```lilypond
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
```

- [ ] **Step 3: Write `examples/violin-exercise.ly`**

```lilypond
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
```

(Open string = `-0`; fingers 1–3 for first position.)

- [ ] **Step 4: Write `examples/simple-piece.ly`**

```lilypond
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
```

- [ ] **Step 5: Write `SKILL.md`**

```markdown
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
```

- [ ] **Step 6: Verify the skill compiles its examples end-to-end**

Run:
```bash
cd ~/.claude/skills/music-sheet-music/examples
for f in *.ly; do lilypond "$f" || echo "FAILED: $f"; done
ls *.pdf
```
Expected: four PDFs produced (`scales.pdf`, `piano-grand-staff.pdf`, `violin-exercise.pdf`, `simple-piece.pdf`), no FAILED lines.

- [ ] **Step 7: Clean up generated PDFs from examples folder**

Run: `cd ~/.claude/skills/music-sheet-music/examples && rm -f *.pdf`
Expected: only `.ly` files remain. (Examples stay as source-only — we regenerate on demand.)

---

## Task 3: Build `music-worksheet` skill

**Files:**
- Create: `~/.claude/skills/music-worksheet/SKILL.md`
- Create: `~/.claude/skills/music-worksheet/templates/worksheet-template.typ`
- Create: `~/.claude/skills/music-worksheet/examples/rhythm-counting.typ`
- Create: `~/.claude/skills/music-worksheet/examples/interval-identification.typ`

- [ ] **Step 1: Write `templates/worksheet-template.typ`**

```typst
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
    footer: [
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
```

- [ ] **Step 2: Write `examples/rhythm-counting.typ`**

```typst
#import "../templates/worksheet-template.typ": worksheet, exercise, answer-key

#show: worksheet.with(
  title: "Rhythm Counting — Quarter Notes and Rests",
  subtitle: "Beginner Piano",
  level: "Beginner",
  instructions: [
    Count out loud while clapping each rhythm. Use "1, 2, 3, 4" for quarter
    notes and whisper "(rest)" for quarter rests. Then circle any rhythm
    you found tricky.
  ],
)

#exercise("1")[♩ ♩ ♩ ♩]
#exercise("2")[♩ ♩ 𝄽 ♩]
#exercise("3")[𝄽 ♩ ♩ ♩]
#exercise("4")[♩ 𝄽 ♩ 𝄽]
#exercise("5")[𝄽 𝄽 ♩ ♩]
#exercise("6")[♩ ♩ 𝄽 𝄽]
#exercise("7")[♩ 𝄽 𝄽 ♩]
#exercise("8")[𝄽 ♩ 𝄽 ♩]

#v(1em)
*Fill-in the bar line:* Draw a bar line after every 4 beats. (Each ♩ = 1 beat, each 𝄽 = 1 beat.)

#exercise("9")[♩ ♩ ♩ ♩ ♩ 𝄽 ♩ ♩ ♩ ♩ ♩ ♩]
#exercise("10")[𝄽 ♩ ♩ ♩ ♩ ♩ 𝄽 ♩]

#answer-key[
  Exercises 1–8: clap and count — no written answer.
  Exercise 9: ♩ ♩ ♩ ♩ *|* ♩ 𝄽 ♩ ♩ *|* ♩ ♩ ♩ ♩
  Exercise 10: 𝄽 ♩ ♩ ♩ *|* ♩ ♩ 𝄽 ♩
]
```

- [ ] **Step 3: Write `examples/interval-identification.typ`**

```typst
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

#exercise("1")[C → E   _________________]
#exercise("2")[D → A   _________________]
#exercise("3")[F → B   _________________]
#exercise("4")[G → F   _________________]
#exercise("5")[A → C   _________________]
#exercise("6")[E → G#  _________________]
#exercise("7")[B♭ → F  _________________]
#exercise("8")[C → A   _________________]

#answer-key[
  1. major 3rd  2. perfect 5th  3. augmented 4th (tritone)  4. minor 7th
  5. minor 3rd  6. major 3rd    7. perfect 5th               8. major 6th
]
```

- [ ] **Step 4: Write `SKILL.md`**

```markdown
---
name: music-worksheet
description: Generate printable music theory and practice worksheets as PDFs using Typst. Use this skill when the user asks for a theory worksheet, practice sheet, drill, or exercise handout — topics include note identification, rhythm counting, interval identification, scale writing, key signatures, sight-reading fragments, and ear-training prompts. Output is a PDF and a .typ source file written to music-with-pat/lessons/.
---

# Music Worksheet Generator

Produce printable theory and practice worksheets with consistent layout, answer key, and clean typography.

## When to use

Invoke when the user asks for any printable exercise handout: rhythm drills, interval ID, note naming, scale writing, key signature tests, sight-reading, ear-training prompts, chord building.

## What to produce

Two files side-by-side in the target folder:
1. `<slug>.typ` — Typst source
2. `<slug>.pdf` — compiled PDF

## Workflow

1. **Clarify inputs if missing:** topic, level (beginner / intermediate / advanced), number of exercises (default 8–12 for beginner, 10–15 for intermediate, 12–20 for advanced).
2. **Determine target folder.** Caller-specified, or `music-with-pat/lessons/<instrument-or-theory>/<level>/<YYYY-MM-DD>-<slug>/`. Create with `mkdir -p`.
3. **Copy the template into the target folder.** Typst imports resolve relative to the source file, so the cleanest portable approach is to copy the template alongside the worksheet:

   ```bash
   cp ~/.claude/skills/music-worksheet/templates/worksheet-template.typ <target-folder>/
   ```

   This also makes each lesson folder self-contained — the worksheet can be regenerated later even if the skill has evolved.

4. **Author the .typ file** using this pattern:

   ```typst
   #import "worksheet-template.typ": worksheet, exercise, answer-key

   #show: worksheet.with(
     title: "...",
     subtitle: "...",
     level: "...",
     instructions: [...],
   )

   #exercise("1")[...]
   #exercise("2")[...]

   #answer-key[ ... ]
   ```

5. **Compile:** `cd <target-folder> && typst compile <slug>.typ`. Typst writes `<slug>.pdf` alongside the source.
6. **Verify:** PDF exists, open it if possible to sanity-check layout.

## Writing good worksheets

- **Always include an answer key** on a separate page, even for simple exercises — teachers need it.
- **Scale difficulty with level.** Beginner = single concept, 8–12 exercises, large font. Advanced = mixed topics, 15+ exercises, compact.
- **Instructions first, then exercises.** The instructions box should tell the student exactly what to do without needing a teacher present.
- **Leave writing room.** Use `#box(width: 5cm, repeat[.])` or similar to create blanks for written answers.

## Musical symbols in Typst

For note/rest glyphs inline, you can use Unicode musical symbols:
- ♩ quarter note (U+2669)
- ♪ eighth note (U+266A)
- 𝄽 quarter rest (U+1D13D)
- 𝄾 eighth rest (U+1D13E)
- 𝅗𝅥 half note (U+1D15E)
- 𝅝 whole note (U+1D15D)
- 𝄼 half rest (U+1D13C)

For anything more complex (actual staves, notes on a staff), use the `music-sheet-music` skill to generate a PDF, then embed it into the worksheet with `#image("notation.pdf")`.

## Output conventions

- File name: lowercase, hyphen-separated, describes content (`rhythm-counting-beginner.typ`, `key-signatures-sharps.typ`).
- Always output both `.typ` and `.pdf` — no deleting the source.
- Template itself is never modified by this skill — import it, don't copy-edit it.
```

- [ ] **Step 5: Verify the template and examples compile**

Run:
```bash
cd ~/.claude/skills/music-worksheet/examples
typst compile rhythm-counting.typ
typst compile interval-identification.typ
ls *.pdf
```
Expected: two PDFs produced. If compilation fails on the `#import "../templates/..."` path, verify the relative path resolves correctly from the examples folder.

- [ ] **Step 6: Clean up generated PDFs**

Run: `cd ~/.claude/skills/music-worksheet/examples && rm -f *.pdf`
Expected: only `.typ` files remain in examples.

---

## Task 4: Build `music-lesson-plan` skill

**Files:**
- Create: `~/.claude/skills/music-lesson-plan/SKILL.md`
- Create: `~/.claude/skills/music-lesson-plan/examples/piano-beginner-rhythm.md`
- Create: `~/.claude/skills/music-lesson-plan/examples/violin-intermediate-vibrato.md`

- [ ] **Step 1: Write `examples/piano-beginner-rhythm.md`**

```markdown
# Lesson Plan — Rhythm Basics (Quarter Notes & Rests)

**Instrument:** Piano
**Level:** Beginner
**Session length:** 30 minutes
**Topic:** Quarter notes and quarter rests — counting, clapping, playing

## Objective

By the end of this lesson, the student can clap, count aloud, and play a 4-bar rhythm combining quarter notes and quarter rests on a single note.

## Materials needed

- Metronome (phone or physical)
- Rhythm-counting worksheet (see `worksheet.pdf` in this folder)
- Rhythm exercise sheet (see `rhythm-exercise.pdf` in this folder)
- Pencil

## Flow

### 1. Warmup — Steady pulse (3 min)

- Set metronome to ♩ = 80.
- Student claps on every beat for 8 bars, then continues clapping silently (internal pulse) for 4 bars, then resumes aloud.
- If pulse drifts, slow to ♩ = 70 and try again.

### 2. Concept introduction (7 min)

- Show flashcards or draw on paper: quarter note (♩) = 1 beat of sound; quarter rest (𝄽) = 1 beat of silence.
- Demonstrate by clapping a 4-bar pattern. Ask student to echo-clap.
- Walk through the top row of the worksheet together — student counts "1-2-3-4" and claps or whispers "(rest)".

### 3. Guided practice (10 min)

- Open `rhythm-exercise.pdf`. It has 8 bars on middle C.
- Student counts aloud and plays middle C for each quarter note, hand hovering over the key for each rest.
- First pass: no metronome, slow.
- Second pass: with metronome at ♩ = 70.
- Third pass: ♩ = 80, aim for steady.

### 4. Worksheet (5 min)

- Student completes exercises 9 and 10 from `worksheet.pdf` (the fill-in-the-bar-line exercises) independently while teacher observes.
- Review answers together.

### 5. Practice assignment (5 min)

**For the week:**
1. Clap and count exercises 1–8 on the worksheet, twice daily (5 min each).
2. Play the `rhythm-exercise.pdf` on middle C with metronome at ♩ = 80, once daily (3 min).
3. Find one song you like at home — clap along to its steady beat for 1 minute.

**Goal for next lesson:** perform the 8-bar rhythm exercise with metronome at ♩ = 90, no pauses.

## Teacher notes

- **Common pitfall:** students speed up during rests. If this happens, have them tap their foot on every beat while clapping only the notes.
- **Adaptation for younger students:** skip the worksheet fill-in-the-bar-line section; instead, use rhythm flashcards as a matching game.
- **Extension for faster learners:** introduce half notes (♩ held for 2 beats) in the last 5 minutes as a teaser for next lesson.
```

- [ ] **Step 2: Write `examples/violin-intermediate-vibrato.md`**

```markdown
# Lesson Plan — Introduction to Vibrato

**Instrument:** Violin
**Level:** Intermediate
**Session length:** 45 minutes
**Topic:** Arm vibrato — setup, motion, first application

## Objective

By the end of this lesson, the student can demonstrate a slow, controlled arm-vibrato motion on a sustained note (no wobble, no collapsed first knuckle), and apply it to one long note in a familiar piece.

## Materials needed

- Violin and bow
- Metronome
- A familiar piece the student knows well (e.g., current etude or a learned melody)
- Mirror (or phone video) for self-observation

## Flow

### 1. Warmup — Tone production check (5 min)

- Long bows on open D and A strings, full bow, metronome at ♩ = 60.
- Check: bow parallel to bridge, consistent weight, no crunch.

### 2. Setting up the vibrato motion (off the instrument, 5 min)

- Student holds left forearm horizontal, palm up.
- Teacher demonstrates waving motion from the elbow — forearm rocks about 2 cm back and forth.
- Student mimics, slow and controlled.
- Critical: motion comes from the forearm, NOT the wrist or finger. Wrist stays soft but passive.

### 3. Vibrato motion on the instrument, without bow (10 min)

- Student places 2nd finger on A string (C#).
- Keep thumb relaxed, base knuckle of index off the neck.
- Slide the finger *backward* (toward the scroll) in a slow, rhythmic pulse — 4 pulses per second, then slower.
- Critical check: the first knuckle of the finger must NOT collapse. If it does, stop and reset.

### 4. Vibrato with bow (10 min)

- Continue the slow vibrato motion, now bow open long notes on C# (2nd finger, A string).
- Metronome at ♩ = 60, one pulse per beat.
- Increase to 2 pulses per beat, then 3, then 4. Back down if control breaks.
- Repeat on 2nd finger G (D string) and 2nd finger F# (E string).

### 5. Application in a familiar piece (10 min)

- Pick one long note in a piece the student already plays fluently.
- Apply slow vibrato (2 pulses per beat at ♩ = 60) to that one note only.
- Iterate: record on phone, watch back, adjust.

### 6. Practice assignment (5 min)

**For the week:**
1. Off-instrument forearm waving — 2 min daily, slow and controlled.
2. On-instrument, no bow, 2nd finger on A string — 3 min daily, building from 2 pulses/sec to 4 pulses/sec.
3. With bow, long notes on 2nd finger (each string) with slow vibrato — 5 min daily.
4. Apply vibrato to one long note in current piece — once per practice session.

**Goal for next lesson:** controlled slow vibrato (3–4 pulses/sec at ♩ = 60) on 2nd finger, all strings.

## Teacher notes

- **Collapsed first knuckle is the #1 issue.** If it happens, the student isn't ready for vibrato yet — back off and do more shifting / finger-strength exercises for a week or two.
- **Avoid wrist vibrato for now.** It has its place but arm-first is a better foundation.
- **Don't rush to fast vibrato.** A slow, even, controlled pulse looks and sounds more musical than a fast but uneven one.
- **Adaptation for younger students (under 10):** introduce the motion concept but don't expect controlled output for several weeks.
```

- [ ] **Step 3: Write `SKILL.md`**

```markdown
---
name: music-lesson-plan
description: Write structured single-session music lesson plans in Markdown. Use this skill when the user asks for a lesson plan, session plan, or teaching outline for piano, violin, or music theory at any level. Covers objectives, materials, timed step-by-step flow, practice assignment, and teacher notes. Output is a Markdown file written to music-with-pat/lessons/.
---

# Music Lesson Plan Writer

Produce structured, teacher-ready lesson plans for a single session.

## When to use

Invoke when the user asks for a lesson plan, teaching outline, or session structure for piano, violin, or music theory.

## What to produce

A single Markdown file: `lesson-plan.md` in the target folder.

## Workflow

1. **Clarify inputs if missing:** instrument, level (beginner / intermediate / advanced), topic, session length (default 30 min for beginner, 45 min for intermediate/advanced). Ask only what's ambiguous.
2. **Determine target folder.** Caller-specified, or `music-with-pat/lessons/<instrument>/<level>/<YYYY-MM-DD>-<topic-slug>/`. Create with `mkdir -p`.
3. **Author `lesson-plan.md`** using the required section structure below.
4. **Reference existing examples** at `~/.claude/skills/music-lesson-plan/examples/` for style and depth.

## Required section structure

```markdown
# Lesson Plan — <Title>

**Instrument:** ...
**Level:** ...
**Session length:** ...
**Topic:** ...

## Objective
<One sentence, student-observable, action verb — "student can clap and count..." not "understand...">

## Materials needed
- Bullet list, includes worksheets / sheet music if part of the package.

## Flow

### 1. Warmup (<time>)
### 2. Concept introduction (<time>)
### 3. Guided practice (<time>)
### 4. Independent practice / worksheet (<time>)
### 5. Practice assignment (<time>)

(Times must sum to the session length.)

## Teacher notes
- Common pitfalls and how to spot them
- Adaptations for younger / older students
- Extension ideas for faster learners
```

## Pedagogy rules

- **Objectives are observable.** "Student understands rhythm" is not an objective. "Student can clap a 4-bar rhythm with quarter notes and rests at ♩ = 80" is.
- **Time each section.** Sums to the full session length.
- **Warmup → Concept → Guided → Independent → Assignment.** This arc reliably works. Don't skip warmup even in 30-min lessons.
- **Assignment is specific.** Include: what to do, how long, how often, and the goal for next lesson.
- **Age-appropriate pacing:** children under 10 = more movement and games, shorter concept blocks. Adults = can handle 10+ min conceptual introduction.

## Level conventions

- **Beginner:** one concept per lesson, concrete and kinesthetic, immediate application, short assignment.
- **Intermediate:** build on prior sessions, introduce one nuance per lesson, start connecting concepts.
- **Advanced:** student-driven where possible, technique + interpretation, longer conceptual blocks OK.

## Output conventions

- File name is always `lesson-plan.md`.
- One lesson plan per file. For multi-session curricula, produce multiple folders (one per session).
```

- [ ] **Step 4: Verify the skill**

Read back both example files and confirm they render correctly as Markdown (headers, bold, lists). No compilation needed — Markdown is just text.

Run: `ls ~/.claude/skills/music-lesson-plan/examples/`
Expected: `piano-beginner-rhythm.md` and `violin-intermediate-vibrato.md`.

---

## Task 5: Build `music-lesson-package` orchestrator

**Files:**
- Create: `~/.claude/skills/music-lesson-package/SKILL.md`

- [ ] **Step 1: Write `SKILL.md`**

```markdown
---
name: music-lesson-package
description: Produce a complete music lesson bundle — lesson plan, worksheet, and sheet music — by orchestrating the music-lesson-plan, music-worksheet, and music-sheet-music skills. Use this skill when the user asks for a full lesson, lesson package, complete lesson, or bundle covering a topic for piano, violin, or theory. Output is a dated folder under music-with-pat/lessons/ containing all three artifacts plus an index.
---

# Music Lesson Package Orchestrator

Build a complete, ready-to-teach lesson by producing the plan, worksheet, and sheet music in one coordinated pass.

## When to use

Invoke when the user asks for a "full lesson", "lesson package", "complete lesson", "lesson bundle", or anything that implies they want more than one artifact at once.

## What to produce

A folder at `music-with-pat/lessons/<instrument>/<level>/<YYYY-MM-DD>-<topic-slug>/` containing:

- `lesson-plan.md` — from `music-lesson-plan`
- `worksheet.pdf` + `worksheet.typ` — from `music-worksheet`
- `<exercise-name>.pdf` + `<exercise-name>.ly` — from `music-sheet-music`
- `index.md` — written by this skill, summarizes the package

## Workflow

1. **Clarify inputs if missing:** instrument, level, topic, session length. Default session length: 30 min beginner, 45 min intermediate/advanced. Ask only if ambiguous.

2. **Plan the three artifacts.** Before invoking sub-skills, decide:
   - What the lesson plan covers (the full arc)
   - What the worksheet reinforces (usually the conceptual piece — notation reading, rhythm counting, interval ID, key signature recognition, etc.)
   - What the sheet music provides (usually the playable exercise — scale, arpeggio, or short pattern the student practices)

3. **Create the target folder:**
   ```bash
   mkdir -p music-with-pat/lessons/<instrument>/<level>/<YYYY-MM-DD>-<topic-slug>
   ```

4. **Invoke the three specialist skills in order, directing each to the same target folder:**
   - Invoke `music-lesson-plan` with the topic → produces `lesson-plan.md`
   - Invoke `music-worksheet` with the matching topic angle → produces `worksheet.typ` + `worksheet.pdf`
   - Invoke `music-sheet-music` with the matching exercise → produces `<slug>.ly` + `<slug>.pdf`

5. **Reference artifacts in the lesson plan.** The lesson plan should mention the worksheet and sheet music by filename (e.g., "see `worksheet.pdf` in this folder"). Either produce the plan last and reference the actual filenames, or produce the plan first with known target filenames and produce the others to match.

6. **Write `index.md`:**

   ```markdown
   # Lesson Package — <Title>

   **Instrument:** <...>  **Level:** <...>  **Session:** <N> min
   **Topic:** <...>
   **Created:** <YYYY-MM-DD>

   ## Artifacts

   - **Lesson plan** — `lesson-plan.md`. <One-line summary of the lesson arc.>
   - **Worksheet** — `worksheet.pdf` (source: `worksheet.typ`). <One-line summary of what it drills.>
   - **Sheet music** — `<exercise>.pdf` (source: `<exercise>.ly`). <One-line summary of the exercise.>

   ## How these fit together

   <2–3 sentences explaining how the plan uses the worksheet and sheet music, and what the student takes away.>
   ```

7. **Verify:** list the folder contents. All four file types must exist. Report the folder path to the user.

## Coherence rules

- All three artifacts point at the same concept. If the plan introduces quarter notes and rests, the worksheet drills rhythm counting and the sheet music is a quarter-note/rest exercise — not a C major scale.
- Level alignment: all three artifacts match the stated level. A beginner package doesn't ship an advanced worksheet.
- Filenames match the topic. Slug the topic (lowercase, hyphens) and use variations consistently.

## When to skip an artifact

- If the topic is pure theory (e.g., "circle of fifths"), the sheet music piece may be thin. Produce a small notation example anyway — a demonstration staff is often more useful than prose alone.
- If the topic is pure technique with no written content to drill (e.g., "bow hold"), the worksheet may be a self-assessment checklist rather than a drill. Produce it anyway — students benefit from structured review.

Never skip an artifact silently — if genuinely unnecessary, mention it in `index.md` with a one-line explanation.
```

- [ ] **Step 2: Verify the skill file is well-formed**

Run: `head -6 ~/.claude/skills/music-lesson-package/SKILL.md`
Expected: YAML frontmatter with `name: music-lesson-package` and a `description:` line.

Run: `ls ~/.claude/skills/music-lesson-package/`
Expected: `SKILL.md` (nothing else — orchestrator needs no examples or templates of its own).

---

## Task 6: End-to-end verification

**Files:** none modified — this is a manual verification task using the real skills in a fresh Claude Code session.

- [ ] **Step 1: Restart Claude Code session**

The four new skills are read from `~/.claude/skills/` at session start. Restart the current CC session (or start a new one in the same project) so the skills appear in the available-skills list.

- [ ] **Step 2: Confirm skills are discovered**

In the new session, verify all four appear in the system reminder listing available skills:
- `music-sheet-music`
- `music-worksheet`
- `music-lesson-plan`
- `music-lesson-package`

If any are missing, check its SKILL.md frontmatter for malformed YAML.

- [ ] **Step 3: Run a single-skill smoke test — sheet music**

Type to Claude: "Engrave a C major scale for piano, one octave, with fingering. Put it in `lessons/_smoke-test/`."

Expected:
- Claude invokes `music-sheet-music`.
- `music-with-pat/lessons/_smoke-test/c-major-scale.ly` and `c-major-scale.pdf` exist.
- PDF opens and shows a C major scale, one octave, with fingering.

- [ ] **Step 4: Run a single-skill smoke test — worksheet**

Type to Claude: "Make a beginner rhythm-counting worksheet with 10 exercises. Put it in `lessons/_smoke-test/`."

Expected:
- Claude invokes `music-worksheet`.
- `worksheet.typ` and `worksheet.pdf` exist in `lessons/_smoke-test/`.
- PDF has title, instructions, 10 exercises, answer key page.

- [ ] **Step 5: Run a single-skill smoke test — lesson plan**

Type to Claude: "Write a 30-min beginner piano lesson plan on quarter notes and rests. Put it in `lessons/_smoke-test/`."

Expected:
- Claude invokes `music-lesson-plan`.
- `lesson-plan.md` exists in `lessons/_smoke-test/`.
- File has all required sections: objective, materials, flow (timed), assignment, teacher notes.

- [ ] **Step 6: Run the orchestrator end-to-end**

Type to Claude: "Full lesson package on quarter notes and rests for a beginner piano student, 30-minute session."

Expected:
- Claude invokes `music-lesson-package`.
- A new folder `music-with-pat/lessons/piano/beginner/<YYYY-MM-DD>-quarter-notes-rests/` is created.
- Folder contains: `lesson-plan.md`, `worksheet.pdf`, `worksheet.typ`, `<exercise>.pdf`, `<exercise>.ly`, `index.md`.
- All three artifacts are coherent — they reference the same topic at the same level.
- The lesson plan references the worksheet and sheet music by filename.

- [ ] **Step 7: Clean up smoke-test folder**

Run: `rm -rf "/Users/jeremy/Desktop/Jraft Creative (Claude)/Agents/music-with-pat/lessons/_smoke-test"`
Expected: folder removed.

- [ ] **Step 8: Commit the plan itself (if not already)**

The plan is living documentation. Confirm it's committed:
```bash
cd "/Users/jeremy/Desktop/Jraft Creative (Claude)/Agents/music-with-pat"
git status
```
Expected: `lessons/` changes are untracked (correct — gitignored); the plan doc should already be committed when this file was created.

---

## Post-implementation notes

- **Skill discovery:** Custom skills in `~/.claude/skills/` surface automatically in new Claude Code sessions via the available-skills listing. No registration step.
- **Source files are kept:** `.ly` and `.typ` source files live beside their PDFs so outputs can be regenerated after tweaks.
- **The `lessons/` folder is gitignored** — generated materials don't pollute the Astro site's git history.
- **Iteration plan:** first real lesson will probably expose pedagogy gaps. Expected; refine SKILL.md content and example files as Pat uses the materials.
