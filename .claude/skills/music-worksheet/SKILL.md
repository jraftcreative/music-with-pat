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
