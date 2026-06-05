# Music Lesson Materials — Skill Suite Design

**Date:** 2026-04-20
**Project:** `music-with-pat`
**Operator:** Jeremy (generates materials, hands to Pat)

## Purpose

Equip Claude with the capability to produce music lesson materials for Pat's teaching practice — piano, violin, and music theory, across beginner / intermediate / advanced levels. Output artifacts are printable PDFs (worksheets), Markdown lesson plans, and engraved sheet music.

## Non-goals

- Not publishing materials to the Music With Pat website. (The site is separate Astro content.)
- Not tracking student progress, scheduling, or managing a student database.
- Not matching an existing Pat-specific curriculum or style guide (start generic, refine over time).
- Not building web-based notation renderers or interactive tools.

## The four skills

| Skill name | Purpose | Output |
|---|---|---|
| `music-lesson-plan` | Structured single-session lesson plans | `lesson-plan.md` |
| `music-worksheet` | Printable theory / practice worksheets | `worksheet.pdf` (+ `.typ` source) |
| `music-sheet-music` | Engraved scales, exercises, pieces | `*.pdf` (+ `.ly` source) |
| `music-lesson-package` | Orchestrator — bundles the three above for a full lesson | folder containing all three + `index.md` |

All four installed at `~/.claude/skills/<skill-name>/SKILL.md`, following the existing pattern used by `jraft-linkedin`, `jraft-social-content`, etc.

## Toolchain

**Required installs (Homebrew, one-time):**

- `brew install lilypond` — text-based music notation engraver → PDF. Claude authors `.ly` files directly.
- `brew install typst` — modern LaTeX alternative for worksheet PDFs. Simpler syntax than LaTeX, fast compile.

Markdown lesson plans need no tooling.

## Output location

Generated materials live in `music-with-pat/lessons/` (inside the Astro repo, but gitignored so they don't pollute site history).

Folder structure:

```
music-with-pat/
  lessons/                                  ← gitignored
    piano/
      beginner/
        2026-04-20-rhythm-basics/
          lesson-plan.md
          worksheet.pdf
          worksheet.typ
          scale-c-major.pdf
          scale-c-major.ly
          index.md                          ← only for packages
      intermediate/
      advanced/
    violin/
      beginner/
      intermediate/
      advanced/
    theory/
      beginner/
      intermediate/
      advanced/
```

Source files (`.ly`, `.typ`) are kept alongside their PDFs so materials can be regenerated or edited later.

A single line added to `music-with-pat/.gitignore`: `lessons/`.

## Skill contents

### `music-lesson-plan`

**Knowledge encoded:**

- Standard lesson-plan structure: warmup → concept introduction → guided practice → independent practice → assignment.
- Age-appropriate pacing (kids vs. adult learners; shorter attention spans, more kinesthetic activity for children).
- Progression norms for beginner / intermediate / advanced across piano, violin, and theory.
- What makes a practice assignment actionable (specific, time-bounded, measurable).

**Behavior:**

1. Accept input: instrument, level, topic, session length. Ask only if missing or ambiguous.
2. Produce a Markdown file with sections:
   - Objective (one sentence, student-observable outcome)
   - Materials needed
   - Step-by-step flow with per-step timings
   - Practice assignment for the coming week
   - Teacher notes (common pitfalls, adaptations)
3. Write to `lessons/<instrument>/<level>/<YYYY-MM-DD>-<slug>/lesson-plan.md`.

### `music-worksheet`

**Knowledge encoded:**

- Worksheet types: note identification, rhythm counting, interval identification, scale writing, key signature drills, sight-reading fragments, ear-training prompts, chord building.
- Level-appropriate difficulty (e.g., beginner rhythm = quarter/half/whole; intermediate = adds eighth/dotted; advanced = syncopation, mixed meters).
- Page-layout conventions: clear instructions box, answer space, answer key on separate page.

**Behavior:**

1. Accept input: topic, level, number of exercises (default sensible per level).
2. Author a `.typ` file using a reusable `worksheet-template.typ` shipped inside the skill (handles header, instructions, exercise grid, answer key page).
3. Run `typst compile worksheet.typ worksheet.pdf`.
4. Keep both files side-by-side in the target folder.

**Skill files:**

- `SKILL.md`
- `templates/worksheet-template.typ`
- `examples/` — 2–3 reference worksheets Claude can use as models

### `music-sheet-music`

**Knowledge encoded:**

- LilyPond syntax for the cases that actually come up: single-staff melodies, piano grand staff, violin part, scales, arpeggios, exercises, tempo / dynamics / articulation markings, fingerings (piano and violin).
- Engraving conventions: key signatures, time signatures, barlines, repeat marks, page layout.

**Behavior:**

1. Accept input: what to engrave (scale / exercise / piece description), instrument(s), key, any specific markings (fingering, dynamics, tempo).
2. Author a `.ly` file using one of the example templates as a starting point.
3. Run `lilypond *.ly` to produce PDF.
4. Keep source and PDF together.

**Skill files:**

- `SKILL.md`
- `examples/scales.ly`
- `examples/piano-grand-staff.ly`
- `examples/violin-exercise.ly`
- `examples/simple-piece.ly`

### `music-lesson-package` (orchestrator)

**Knowledge encoded:**

- How to decompose a lesson topic into its three artifacts — what belongs in the plan, what a matching worksheet looks like, which short example makes sense to engrave.
- Default timings and proportions for 30 / 45 / 60-minute sessions.

**Behavior:**

1. Accept input: instrument, level, topic, session length.
2. Create the dated session folder: `lessons/<instrument>/<level>/<YYYY-MM-DD>-<slug>/`.
3. Invoke `music-lesson-plan`, `music-worksheet`, `music-sheet-music` in sequence, feeding each the relevant piece of the topic.
4. Write `index.md` listing the three artifacts with one-line summaries and how they connect.

## Example end-to-end

**Input:** "Full lesson package on quarter notes and rests for a beginner piano student, 30-minute session."

**Result:** `music-with-pat/lessons/piano/beginner/2026-04-20-quarter-notes-rests/` containing:

- `lesson-plan.md` — 30-minute plan with warmup (3 min), concept (7 min), guided practice (10 min), worksheet (5 min), assignment (5 min)
- `worksheet.pdf` (+ `.typ`) — 8 rhythm lines to clap/count, 4 fill-in-the-bar-line exercises, answer key
- `rhythm-exercise.pdf` (+ `.ly`) — one-line piano staff, 8 bars of quarter notes/rests on middle C
- `index.md` — summary and how the artifacts connect

**Single-skill invocations:**

- "Engrave a G major scale for violin, one octave, with fingering" → just `music-sheet-music`, one PDF.
- "Write a lesson plan for ABRSM Grade 2 theory, intervals chapter" → just `music-lesson-plan`, one markdown file.

## Open questions / deferred decisions

- Pat-specific style refinement: start generic, refine after reviewing first real outputs.
- Multi-session curriculum planning (e.g., "12-week beginner piano course"): out of scope for v1; could become a fifth skill later if useful.
- Student-specific personalization (name, prior lessons): out of scope for v1.

## Success criteria

- All four skills installed and discoverable via the `Skill` tool.
- LilyPond and Typst both installed and runnable from the shell.
- A test run of `music-lesson-package` for a sample topic produces a valid folder with all three artifact types, all PDFs compile cleanly, markdown reads sensibly.
- Single-skill invocations (`music-sheet-music` alone, etc.) work and produce files in the correct location.
