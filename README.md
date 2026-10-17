# Norðrœna (Old Norse Path)

A mobile-first static web course in **historical Old West Norse / Classical normalized Old Norse** — the language of scholarly saga editions — **not** Modern Icelandic.

Pedagogy mirrors a **Duolingo-style learning path** (sections → units → levels → short sessions) without copying Duolingo’s trademark art, owl, or green brand. Visual language is parchment/ink scholarly.

## Path structure

| Layer | Role |
|-------|------|
| **Section** | Big chunk (e.g. Foundations, Beginner grammar) |
| **Unit** | Themed group of ~5–10 levels |
| **Level** | Node on a vertical winding path — Learn / Practice / Speak / Listen / Lore / Checkpoint |
| **Lesson session** | ~8–12 micro-exercises inside a level |

- Unlock linearly; locked nodes ahead cannot be skipped
- Practice nodes recycle earlier material
- End-of-unit checkpoint
- Home = path map + streak / XP + **Continue** CTA
- Session UI: one exercise at a time, progress bar, Check, hearts (mistake budget), celebration on complete

## Content (v0.2)

**Section 1 — Foundations** (fully unlocked)

1. **Unit 1** — Sound system & letters (þ ð ǫ æ, length, stress): Learn + Speak + Practice  
2. **Unit 2** — First vocabulary (*maðr kona land vera heita*): Learn / Listen / Practice / Speak + recycle  
3. **Unit 3** — Mini readings, ON vs Modern Icelandic awareness, True/False philology, **Checkpoint**

**Section 2+** — locked “coming soon” shells (nouns, verbs, case…) matching the L2–L7 roadmap.

**Elder Futhark** — side path / tab (Migration Period / Proto-Norse), **not** mixed in as Latin ON.

Vocabulary keeps labels **ATTESTED / NORMALIZED / RECONSTRUCTED** and **MODERN ICELANDIC — NOT OLD NORSE** warnings.

### Full scholarly notes (not shortened)

- Each Unit has a **Full notes** button + **Study notes** path node embedding verbatim `lesson1.js` section HTML.
- **Classic Lesson 1** (`#/lesson/1`) keeps the complete lesson1 view (sections, vocab fields, exercises, speak drills).
- See [VERIFY.md](VERIFY.md).

## Exercise types

1. Tap what you hear (TTS clear mode)  
2. Match pairs (ON ↔ English)  
3. Translate ON → EN  
4. Translate EN → ON (tiles / word bank)  
5. Fill blank  
6. Speak (mic + self-rate) — existing voice system  
7. Listen clear / slow — existing TTS  
8. True/False philology (ON vs MI traps)

## Quick start

See [INSTALL.md](INSTALL.md).

```bash
cd OldNorseCourse
python3 -m http.server 8080
# open http://localhost:8080
```

Or open `nordroena-standalone.html` (single-file bundle). Rebuild with:

```bash
python3 build_standalone.py
# writes nordroena-standalone.html and ../OldNorseCourse.zip
```

## Progress

Stored in `localStorage` key `nordrona_progress_v2`: completed levels, XP, streak day, review queue. Reset from the path home footer.

## Clear vs Orthography (TTS)

- **Clear mode (default):** English-friendly phonetic cues — pedagogical approximations, **not** historical ON.  
- **Orthography mode:** raw ON with a modern Nordic/English voice — still a modern approximation.  
- Always compare with reconstructed notes in Speak drills.

## License / scholarly honesty

Educational static site. Phonology follows conventional academic reconstruction for Classical ON. Prefer attested/normalized forms; never present Modern Icelandic as Old Norse unmarked.
