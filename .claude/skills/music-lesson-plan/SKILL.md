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
