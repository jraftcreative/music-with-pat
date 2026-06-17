// One-off rollout: rewrite every in-body wa.me/<number> link's prefill to the
// page-context-aware message, mirroring src/lib/whatsapp.ts so inline CTAs match
// the floating button + sticky bar. Idempotent — safe to re-run.
import { readFileSync, writeFileSync, readdirSync } from 'node:fs'
import { join } from 'node:path'

const NUMBER = '6583898853'

const CONTEXT_RULES = [
  { test: (p) => p.includes('adult-piano'), type: 'adult piano lessons' },
  { test: (p) => p.includes('adult-violin'), type: 'adult violin lessons' },
  { test: (p) => p.includes('childrens-piano') || p.includes('piano-lessons-for-beginners'), type: 'piano lessons for my child' },
  { test: (p) => p.includes('childrens-violin'), type: 'violin lessons for my child' },
  { test: (p) => p.includes('abrsm-piano'), type: 'ABRSM piano lessons' },
  { test: (p) => p.includes('abrsm-violin'), type: 'ABRSM violin lessons' },
  { test: (p) => p.includes('music-theory'), type: 'music theory lessons' },
  { test: (p) => p.includes('dsa-piano'), type: 'DSA piano lessons' },
  { test: (p) => p.includes('graded-piano'), type: 'graded piano lessons' },
  { test: (p) => p.includes('music-lessons-for-children') || p.includes('lessons-for-children'), type: 'music lessons for my child' },
  { test: (p) => p.includes('piano-lessons') || p.includes('piano-teacher'), type: 'piano lessons' },
  { test: (p) => p.includes('violin-lessons') || p.includes('violin-teacher'), type: 'violin lessons' },
]

function lessonType(slug) {
  const p = slug.toLowerCase()
  for (const r of CONTEXT_RULES) if (r.test(p)) return r.type
  return 'music lessons'
}

const dir = 'src/pages'
const files = readdirSync(dir).filter((f) => f.endsWith('.astro'))
// Skip pages already converted to the component or with bespoke CTAs.
const SKIP = new Set(['index.astro', 'contact.astro', 'adult-piano-lessons.astro', 'thank-you.astro'])

let changedFiles = 0
let changedLinks = 0
for (const file of files) {
  if (SKIP.has(file)) continue
  const slug = file.replace(/\.astro$/, '')
  const msg = `Hi Ms Pat, I'd like to enquire about ${lessonType(slug)}.`
  const encoded = encodeURIComponent(msg)
  const path = join(dir, file)
  const before = readFileSync(path, 'utf8')
  // Match the wa.me link (with optional existing ?text=...) up to the closing quote.
  const re = new RegExp(`https://wa\\.me/${NUMBER}(\\?text=[^"]*)?`, 'g')
  let n = 0
  const after = before.replace(re, () => { n++; return `https://wa.me/${NUMBER}?text=${encoded}` })
  if (after !== before) {
    writeFileSync(path, after)
    changedFiles++
    changedLinks += n
  }
}
console.log(`Rewrote ${changedLinks} links across ${changedFiles} files.`)
