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
