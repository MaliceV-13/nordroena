# VERIFY — Full scholarly content restored (path UX kept)

Date: 2026-09-16 PT

## Restored / re-linked (learner-accessible)

1. **Study notes (per unit)** — Path unit banners have **Full notes**; each unit also has a **Study notes (full)** path node (`#/notes/u1|u2|u3`) embedding **verbatim** `lesson1.js` section HTML:
   - Unit 1: `what-is-on`, `alphabet`, `length-stress`, `consonants`
   - Unit 2: `vocab` (full cards)
   - Unit 3: `practice-tips`, `what-is-on`
2. **Classic Lesson 1 (full)** — Nav **Lesson 1**, hero link, side path, and path node `s1-classic-l1` → `#/lesson/1` renders **all** sections, **all** vocab fields, **all** written exercises, **all** speak drills from `data/lesson1.js`.
3. **Vocab fields** — Every item shows **gloss, pos, label, labelNote, grammar** (+ compare / clearSpeak / TTS). Path bank `V.*` and Unit 2 intros restored to full lesson1 text (not shortened glosses).
4. **Speak drills** — Path speak levels restored to full `reconstructedNotes` / cues / tips from lesson1; session UI now **displays reconstructedNotes**; Classic Lesson 1 includes all `l1-v1`…`l1-v8` with mic + clearSpeak.
5. **TTS** — Clear / slow / **orthography** + stop on session + classic/study vocab/speak TTS boxes.
6. **Mic voice** — Unchanged panels on path speak sessions and Classic Lesson 1 speak drills.

## Not dropped

| Asset | Status |
|-------|--------|
| `data/lesson1.js` | Loaded in `index.html` + standalone; linked from path/nav |
| `data/course.js` charter | `#/charter` full render |
| `data/futhark.js` | `#/futhark` full module |
| TTS clear/ortho | `js/tts.js` + ortho button in `ttsMini` |
| Mic voice | `js/voice.js` bound on path + classic views |
| Duolingo-style path | Sections → units → levels → sessions unchanged (16 playable levels) |

## How to check quickly

1. Open path → Unit 1 **Full notes** → see full alphabet / length-stress / consonants prose.
2. Open **Lesson 1** in nav → scroll vocab cards (labelNote + grammar) → written checks → speak with reconstructed notes + Play clear / Orthography / mic.
3. Charter + Futhark tabs still work.
4. Complete a path level session (hearts / Check) still works.

