/**
 * Norðrœna — Duolingo-style learning path (pedagogy only)
 * Scholarly Classical Old Norse content — not a brand clone.
 */
window.NORDRONA = window.NORDRONA || {};

(function (N) {
  /** Shared vocab bank for exercises */
  const V = {
    madr: {
      form: "maðr",
      gloss: "man; person; husband (context-dependent)",
      pos: "m. noun (cons. stem)",
      label: "ATTESTED",
      labelNote: "NORMALIZED spelling of a thoroughly attested lemma",
      grammar: "Nom. sg. maðr; gen. manns; dat. manni; acc. mann. Strong masculine. Plural menn (irregular).",
      clearSpeak: "MAHTH-r (th as in this)",
      compare: null
    },
    kona: {
      form: "kona",
      gloss: "woman; wife",
      pos: "f. noun (ōn-stem)",
      label: "ATTESTED",
      labelNote: "NORMALIZED classical form",
      grammar: "Nom. sg. kona; gen. konu; dat. konu; acc. konu. Weak feminine. Pl. konur.",
      clearSpeak: "KOH-nah",
      compare: null
    },
    land: {
      form: "land",
      gloss: "land; country",
      pos: "n. noun (a-stem)",
      label: "ATTESTED",
      labelNote: "NORMALIZED; widespread in compounds (e.g. Ísland)",
      grammar: "Nom./acc. sg. land; gen. lands; dat. landi. Strong neuter. Pl. lǫnd (u-umlaut).",
      clearSpeak: "LAHND",
      compare: null
    },
    vera: {
      form: "vera",
      gloss: "to be",
      pos: "verb (anomalous)",
      label: "ATTESTED",
      labelNote: "NORMALIZED infinitive of the highly irregular verb ‘to be’",
      grammar: "Pres. ind. em, ert, er, erum, eruð, eru. Past var / váru. Essential copula — full paradigm in Lesson 3.",
      clearSpeak: "VEH-rah",
      compare: null
    },
    heita: {
      form: "heita",
      gloss: "to be called; to be named",
      pos: "verb (strong, VII)",
      label: "ATTESTED",
      labelNote: "NORMALIZED; formulaic in introductions (X heitir…)",
      grammar: "Pres. ind. heiti, heitir, heitir, heitum, heitið, heita. Past hét. Used for names: Ek heiti… ‘I am called…’.",
      clearSpeak: "HAY-tah",
      compare: {
        label: "MODERN ICELANDIC — NOT OLD NORSE",
        text: "Mod. Icel. heita remains cognate and similar in use, but do not assume identical paradigms or pronunciation."
      }
    },
    thorr: {
      form: "Þórr",
      gloss: "Thor (theonym)",
      pos: "m. noun (theonym)",
      label: "ATTESTED",
      labelNote: "NORMALIZED classical form of a thoroughly attested name",
      grammar: "Theonym; initial þ, long ó, geminate rr.",
      clearSpeak: "THOR (th as in thin, long o)",
      compare: null
    },
    odinn: {
      form: "Óðinn",
      gloss: "Odin (theonym)",
      pos: "m. noun (theonym)",
      label: "ATTESTED",
      labelNote: "NORMALIZED classical form of a thoroughly attested name",
      grammar: "Theonym; long Ó, medial ð, geminate nn.",
      clearSpeak: "OH-thin (th as in this)",
      compare: null
    }
  };

  /** Build full vocab card HTML from V entry or plain object */
  function vocabCardHtml(v) {
    const compare = v.compare
      ? `<aside class="callout warn tight"><strong>${v.compare.label}</strong><p>${v.compare.text}</p></aside>`
      : "";
    return `<article class="vocab-card">
      <header><span class="lemma">${v.form}</span> <span class="label attested">${v.label}</span></header>
      <p class="gloss">${v.gloss}</p>
      <p class="pos muted">${v.pos || ""}</p>
      ${v.labelNote ? `<p class="label-note muted"><em>Label note:</em> ${v.labelNote}</p>` : ""}
      ${v.grammar ? `<p class="grammar">${v.grammar}</p>` : ""}
      ${v.clearSpeak ? `<p class="tts-cue muted"><strong>Clear cue:</strong> <code>${v.clearSpeak}</code></p>` : ""}
      ${compare}
    </article>`;
  }

  function mc(id, prompt, choices, answer, extra) {
    return Object.assign({ id, type: "multiple", prompt, choices, answer }, extra || {});
  }
  function text(id, prompt, accept, extra) {
    return Object.assign({ id, type: "text", prompt, accept, acceptNormalize: true }, extra || {});
  }
  function tf(id, prompt, answerTrue, explanation, hint) {
    return {
      id, type: "truefalse", prompt,
      choices: [{ id: "t", text: "True" }, { id: "f", text: "False" }],
      answer: answerTrue ? "t" : "f",
      explanation: explanation || "",
      hint: hint || ""
    };
  }
  function match(id, prompt, pairs, explanation) {
    return { id, type: "match", prompt, pairs, explanation: explanation || "" };
  }
  function tapHear(id, audioForm, clearSpeak, choices, answer, explanation) {
    return {
      id, type: "tap_hear", prompt: "Tap what you hear",
      audioForm, clearSpeak, choices, answer,
      explanation: explanation || ""
    };
  }
  function tiles(id, promptEn, tilesArr, answer, explanation) {
    return {
      id, type: "tiles", prompt: promptEn,
      tiles: tilesArr, answer, explanation: explanation || ""
    };
  }
  function fill(id, prompt, accept, choices, explanation) {
    return {
      id, type: "fill", prompt, accept, choices: choices || null,
      acceptNormalize: true, explanation: explanation || ""
    };
  }
  function speak(id, target, clearSpeak, gloss, label, notes, cues, tips) {
    return {
      id, type: "speak", prompt: "Say: " + target, target, clearSpeak, gloss, label,
      reconstructedNotes: notes,
      historicalCues: cues || [],
      rubricTips: tips || []
    };
  }
  function lore(id, title, html) {
    return { id, type: "lore", title, html };
  }
  function listenSlow(id, form, clearSpeak, gloss, label) {
    return {
      id, type: "listen", prompt: "Listen carefully, then choose the gloss",
      audioForm: form, clearSpeak, gloss, label: label || "ATTESTED",
      choices: null // filled by session from nearby distractors if needed
    };
  }

  N.path = {
    version: "0.2.0",
    title: "Norðrœna",
    subtitle: "Old Norse Path",
    heartsMax: 5,
    xpPerLevel: 10,
    xpPerPerfect: 15,

    sections: [
      {
        id: "s1",
        title: "Foundations",
        subtitle: "Sounds, first words, and ON vs Modern Icelandic awareness",
        unlocked: true,
        units: [
          {
            id: "u1",
            title: "Sound system & letters",
            subtitle: "þ ð ǫ æ · length · stress",
            studyNotes: {
              title: "Unit 1 — Full study notes",
              lessonId: 1,
              sectionIds: ["what-is-on", "alphabet", "length-stress", "consonants"]
            },
            levels: [
              {
                id: "u1-notes",
                type: "notes",
                title: "Study notes (full)",
                icon: "❧",
                notesOnly: true,
                route: "#/notes/u1",
                exercises: []
              },
              {
                id: "u1-l1",
                type: "learn",
                title: "Thorn & eth",
                icon: "þ",
                intro: {
                  title: "þ and ð",
                  html: `<p>Classical normalized Old Norse uses the Latin alphabet plus several letters essential to the sound system. Two dental fricatives:</p>
                  <div class="letter-grid">
                    <div class="letter-card"><span class="glyph">þ</span><span class="name">thorn</span><span class="ipa">/θ/</span><span class="note">voiceless dental fricative — as in English <em>thin</em></span></div>
                    <div class="letter-card"><span class="glyph">ð</span><span class="name">eth</span><span class="ipa">/ð/</span><span class="note">voiced dental fricative — as in English <em>this</em></span></div>
                  </div>
                  <aside class="callout info"><strong>Pronunciation honesty</strong><p>These IPA values are the conventional academic reconstruction for Classical ON. Exact quality varied by time and region. We do not claim to reproduce a single speaker’s voice.</p></aside>
                  <p class="muted">Open <a href="#/notes/u1">Unit 1 study notes</a> for the full alphabet prose (ǫ æ œ, length marking, and more).</p>`
                },
                exercises: [
                  mc("u1l1-1", "Which letter is the <em>voiced</em> dental fricative (as in <em>this</em>)?",
                    [{ id: "a", text: "þ (thorn)" }, { id: "b", text: "ð (eth)" }, { id: "c", text: "ǫ" }, { id: "d", text: "æ" }],
                    "b", { hint: "Thorn is voiceless; eth is voiced.", explanation: "ð (eth) = /ð/. þ (thorn) = /θ/." }),
                  mc("u1l1-2", "Which letter is the <em>voiceless</em> dental fricative (as in <em>thin</em>)?",
                    [{ id: "a", text: "ð" }, { id: "b", text: "þ" }, { id: "c", text: "d" }, { id: "d", text: "t" }],
                    "b", { explanation: "þ = /θ/." }),
                  tapHear("u1l1-3", "þ", "th as in thin",
                    [{ id: "a", text: "þ" }, { id: "b", text: "ð" }, { id: "c", text: "ǫ" }], "a",
                    "Clear-mode cue for thorn. Pedagogical approximation — not historical ON speech."),
                  tapHear("u1l1-4", "ð", "th as in this",
                    [{ id: "a", text: "þ" }, { id: "b", text: "ð" }, { id: "c", text: "æ" }], "b",
                    "Clear-mode cue for eth."),
                  tf("u1l1-5", "þ and ð are the same sound in Classical ON orthography.", false,
                    "False — þ is voiceless /θ/; ð is voiced /ð/.", "Think thin vs this."),
                  mc("u1l1-6", "In normalized texts, eth often appears:",
                    [{ id: "a", text: "Only at the very start of every word" }, { id: "b", text: "Typically medial/final (voiced position)" }, { id: "c", text: "Never in nouns" }, { id: "d", text: "Only in Modern Icelandic" }],
                    "b", { explanation: "Distribution is orthographic–phonological convention: þ often initial; ð medial/final." }),
                  fill("u1l1-7", "Type the letter for voiced dental fricative:", ["ð"],
                    [{ id: "a", text: "þ" }, { id: "b", text: "ð" }, { id: "c", text: "d" }],
                    "ð (eth)."),
                  mc("u1l1-8", "These IPA values are:",
                    [{ id: "a", text: "Exact recordings of saga authors" }, { id: "b", text: "Conventional academic reconstruction" }, { id: "c", text: "Modern Icelandic claimed as ON with no label" }, { id: "d", text: "Invented for games only" }],
                    "b", { explanation: "Scholarly reconstruction — we cannot hear 13th-c. speakers." })
                ]
              },
              {
                id: "u1-l2",
                type: "learn",
                title: "ǫ æ œ & length",
                icon: "ǫ",
                intro: {
                  title: "More letters & vowel length",
                  html: `<div class="letter-grid">
                    <div class="letter-card"><span class="glyph">ǫ</span><span class="name">o caudata</span><span class="ipa">/ɔ/</span><span class="note">open rounded back vowel (often written <em>ö</em> in some editions)</span></div>
                    <div class="letter-card"><span class="glyph">æ</span><span class="name">ash</span><span class="ipa">/ɛː/ ~ /æː/</span><span class="note">long open front vowel (length marked in careful texts)</span></div>
                    <div class="letter-card"><span class="glyph">œ</span><span class="name">oe</span><span class="ipa">/øː/</span><span class="note">long front rounded vowel (u-umlaut product)</span></div>
                  </div>
                  <p>Vowels may be short or long. In normalized texts, length is often marked with an acute accent: <em>á é í ó ú ý</em> (and sometimes <em>ǽ œ́</em>). Unmarked vowels are short unless context or a dictionary entry indicates otherwise.</p>
                  <ul class="scholar-list">
                    <li><strong>Stress</strong> falls on the first syllable of the word (primary stress). Compounds keep stress on the first element’s first syllable.</li>
                    <li><strong>Length is phonemic</strong>: learn each word’s length from a reliable dictionary or marked text.</li>
                    <li><strong>Syllable weight</strong> matters for poetry and for later morphology; for now, practice hearing (or imagining) a clear contrast between short and long vowels.</li>
                    <li>Do not import Modern Icelandic diphthongization rules wholesale and call them Old Norse.</li>
                  </ul>
                  <aside class="callout warn"><strong>MODERN ICELANDIC — NOT OLD NORSE</strong>
                  <p>Modern Icelandic has diphthongized many historically long vowels (e.g. <em>á</em> ≈ [au]). Classical ON <em>á</em> is conventionally taught as a long monophthong /ɑː/. Use the ON values in this course unless a comparison is explicitly labelled.</p></aside>
                  <p class="muted">See also <a href="#/notes/u1">Unit 1 study notes</a> for the complete alphabet section.</p>`
                },
                exercises: [
                  mc("u1l2-1", "Where does primary stress fall in a native ON word?",
                    [{ id: "a", text: "Final syllable" }, { id: "b", text: "First syllable" }, { id: "c", text: "Penult (Latin rule)" }, { id: "d", text: "Free/unpredictable" }],
                    "b", { explanation: "Germanic initial stress." }),
                  mc("u1l2-2", "ǫ (o caudata) is conventionally:",
                    [{ id: "a", text: "Open rounded back /ɔ/" }, { id: "b", text: "A silent letter" }, { id: "c", text: "Identical to Modern English ‘ee’" }, { id: "d", text: "Only a rune" }],
                    "a", { explanation: "/ɔ/ — open rounded back." }),
                  mc("u1l2-3", "In normalized texts, á usually marks:",
                    [{ id: "a", text: "A short vowel" }, { id: "b", text: "A long vowel" }, { id: "c", text: "Stress on the last syllable" }, { id: "d", text: "Modern Icelandic only" }],
                    "b", { explanation: "Acute = length in careful normalized orthography." }),
                  tf("u1l2-4", "Classical ON á should be taught as the Modern Icelandic diphthong [au] with no warning label.", false,
                    "False — that would present Modern Icelandic as Old Norse. ON á ≈ /ɑː/ monophthong in this course.",
                    "Charter: MODERN ICELANDIC — NOT OLD NORSE."),
                  tapHear("u1l2-5", "ǫ", "aw as in law, short and rounded",
                    [{ id: "a", text: "ǫ" }, { id: "b", text: "á" }, { id: "c", text: "í" }], "a"),
                  mc("u1l2-6", "æ (ash) in Classical ON is roughly:",
                    [{ id: "a", text: "A long open front vowel" }, { id: "b", text: "A click consonant" }, { id: "c", text: "Silent" }, { id: "d", text: "Only Elder Futhark" }],
                    "a", { explanation: "/ɛː/ ~ /æː/ conventionally." }),
                  fill("u1l2-7", "Type the o-caudata letter used in pl. lǫnd:", ["ǫ"], null, "ǫ appears in lǫnd (u-umlaut of land)."),
                  mc("u1l2-8", "Length is:",
                    [{ id: "a", text: "Never important" }, { id: "b", text: "Phonemic — learn each word’s length" }, { id: "c", text: "Only for poetry, never prose" }, { id: "d", text: "Marked only with runes" }],
                    "b", { explanation: "Length contrasts matter; learn from marked texts/dictionaries." })
                ]
              },
              {
                id: "u1-l3",
                type: "speak",
                title: "Speak: sounds",
                icon: "🎤",
                exercises: [
                  speak("u1l3-1", "þ", "th as in thin", "voiceless dental fricative /θ/ (as in English thin)", "NORMALIZED",
                    "Target: clear /θ/ — tongue tip at teeth, continuous fricative, no /t/ or /d/ stop. Word-initial quality as in þing, þú (when you meet them later).",
                    ["Continuous fricative, not a stop", "Voiceless (no vocal-fold buzz like ð)", "Dental place (thin, not sin)"],
                    ["Say English thin then isolate the first sound — that approximates ON þ.", "Do not substitute /f/ or /s/.", "This is a reconstructed Classical value, not Modern Icelandic coaching disguised as ON."]),
                  speak("u1l3-2", "ð", "th as in this", "voiced dental fricative /ð/ (as in English this)", "NORMALIZED",
                    "Target: voiced /ð/. Contrast with þ. Medial/final eth appears in maðr, Óðinn.",
                    ["Voiced fricative (vocal fold vibration)", "Same place as þ, different voicing", "Not a hard /d/ stop"],
                    ["English this → isolate ð.", "In maðr, ð is medial — keep it fricative between vowels/consonants.", "ASR will often mishear ð; ignore English ASR as ground truth."]),
                  speak("u1l3-3", "ǫ", "aw as in law, short and rounded", "open rounded back vowel /ɔ/ (often written ö in some editions)", "NORMALIZED",
                    "Say a short open o (as in many transcriptions of British not /ɒ/–/ɔ/, or roughly aw with lips rounded but short). Not Modern Icelandic ö-quality claimed as historical ON without a label.",
                    ["Back, rounded, open-mid", "Short unless marked long in a given word", "Distinct from ó /oː/ and from a /a/"],
                    ["Practice the sound in isolation, then recall pl. lǫnd from land.", "Recording + self-rate is the goal; no historical ON TTS is claimed here."]),
                  speak("u1l3-4", "a — á", "ah, short — then aa, long ah (hold longer, no ow diphthong)", "short /a/ vs long /ɑː/ (conventional Classical values)", "NORMALIZED",
                    "Hold á roughly twice as long as a. Classical á is taught as a long monophthong /ɑː/ — NOT the Modern Icelandic diphthong [au] unless labelled MODERN ICELANDIC — NOT OLD NORSE.",
                    ["Same vowel quality family, different duration", "á held longer (≈ two beats vs one)", "No [au] diphthong for Classical ON á in this course"],
                    ["Tap once for a, twice-length for á.", "If you diphthongize, correct toward a steady long vowel for ON practice."]),
                  speak("u1l3-5", "Þórr", "THOR (th as in thin, long o)", "Thor (theonym)", "ATTESTED",
                    "Initial þ /θ/. Long ó /oː/. Double rr — hold/trilled or clearly lengthened r-quality per your dialect training; do not drop it. Stress initial.",
                    ["þ not /t/ or /f/", "Long ó (duration)", "Final geminate/long r audible"],
                    ["ÞÓRR — thorn + long o + rr.", "Do not use Modern Icelandic citation as unmarked ON pronunciation coaching."]),
                  speak("u1l3-6", "Óðinn", "OH-thin (th as in this)", "Odin (theonym)", "ATTESTED",
                    "Long Ó /oː/. Medial ð /ð/. Double nn. Stress on first syllable. NORMALIZED classical form of a thoroughly attested name.",
                    ["Long initial Ó", "ð fricative (not /d/)", "Geminate nn — hold the n"],
                    ["Ó-ðinn — length on Ó; ð not d; nn doubled.", "ASR may output Odin/Othin; that is not a historical grade."]),
                  mc("u1l3-7", "Self-rating against reconstructed cues is preferred because:",
                    [{ id: "a", text: "Browser ASR is historical ON ground truth" }, { id: "b", text: "ASR is modern-language and never historical ground truth" }, { id: "c", text: "We have saga-author audio" }, { id: "d", text: "TTS is medieval" }],
                    "b", { explanation: "Record → playback → self-rate. ASR is a rough modern aid only." }),
                  tf("u1l3-8", "Clear-mode TTS phonetic cues are historical Old Norse speech.", false,
                    "False — Clear cues are pedagogical English-friendly approximations, labelled as such.",
                    "Always compare with reconstructed notes.")
                ]
              },
              {
                id: "u1-l4",
                type: "practice",
                title: "Practice: sounds",
                icon: "↻",
                exercises: [
                  mc("u1l4-1", "Match: voiced dental fricative →",
                    [{ id: "a", text: "þ" }, { id: "b", text: "ð" }, { id: "c", text: "ǫ" }], "b"),
                  match("u1l4-2", "Match letter ↔ value",
                    [{ left: "þ", right: "/θ/ thin" }, { left: "ð", right: "/ð/ this" }, { left: "ǫ", right: "/ɔ/" }],
                    "Dental fricatives + o caudata."),
                  tapHear("u1l4-3", "þ", "th as in thin",
                    [{ id: "a", text: "þ" }, { id: "b", text: "ð" }], "a"),
                  tapHear("u1l4-4", "ð", "th as in this",
                    [{ id: "a", text: "þ" }, { id: "b", text: "ð" }], "b"),
                  text("u1l4-5", "Type eth (voiced):", ["ð"], { explanation: "ð" }),
                  mc("u1l4-6", "Primary stress:",
                    [{ id: "a", text: "First syllable" }, { id: "b", text: "Last syllable" }], "a"),
                  tf("u1l4-7", "Acute accent in normalized ON often marks vowel length.", true,
                    "True — á é í ó ú ý etc."),
                  mc("u1l4-8", "œ is conventionally:",
                    [{ id: "a", text: "Long front rounded /øː/" }, { id: "b", text: "A pause mark" }, { id: "c", text: "Identical to þ" }],
                    "a")
                ]
              },
              {
                id: "u1-l5",
                type: "learn",
                title: "Key consonants",
                icon: "r",
                intro: {
                  title: "Consonant notes",
                  html: `<ul class="scholar-list">
                    <li><strong>þ / ð</strong> — dental fricatives; þ typically word-initial or after voiceless sounds; ð medial/final voiced (distribution is orthographic–phonological convention in normalized texts).</li>
                    <li><strong>hl-, hn-, hr-</strong> — historically voiceless resonants; often taught as /l n r/ with a preceding /h/-like quality.</li>
                    <li><strong>x</strong> — usually /ks/ (as in <em>oxi</em>).</li>
                    <li><strong>g, k</strong> — velar stops; palatal colouring before front vowels is debated in detail — beginners may use clear [g]/[k].</li>
                    <li><strong>Final -r</strong> in nom. sg. masculines (e.g. <em>maðr</em>) is a real morphological ending, not silent decoration.</li>
                  </ul>
                  <aside class="callout info"><strong>Writing systems</strong><p>þ and ð here are <em>Latin-script</em> Classical ON. Elder Futhark ᚦ (thurisaz) is Migration-Period / Proto-Norse epigraphy — not how Heimskringla was written. Rune rows also do not mark vowel length the way normalized <em>á</em> vs <em>a</em> does. Open the <a href="#/futhark">Elder Futhark</a> module for the full chronology and correlations.</p></aside>
                  <p class="muted">Full prose also in <a href="#/notes/u1">Unit 1 study notes</a>.</p>`
                },
                exercises: [
                  mc("u1l5-1", "Final -r in maðr is:",
                    [{ id: "a", text: "Silent decoration" }, { id: "b", text: "A real morphological ending" }, { id: "c", text: "Only Modern Icelandic" }, { id: "d", text: "A rune" }],
                    "b", { explanation: "Audible morphological -r in nom. sg. masculines." }),
                  tf("u1l5-2", "Elder Futhark is the normal writing system of medieval saga manuscripts.", false,
                    "False — manuscripts use Latin script. Elder Futhark is earlier epigraphy.",
                    "See Futhark side path."),
                  mc("u1l5-3", "Classical ON literary texts in editions use primarily:",
                    [{ id: "a", text: "Elder Futhark" }, { id: "b", text: "Latin alphabet (+ þ ð ǫ …)" }, { id: "c", text: "Only Younger Futhark" }, { id: "d", text: "Ogham" }],
                    "b"),
                  mc("u1l5-4", "x in ON usually represents:",
                    [{ id: "a", text: "/ks/" }, { id: "b", text: "/ʃ/" }, { id: "c", text: "Silence" }],
                    "a", { explanation: "As in oxi." }),
                  match("u1l5-5", "Match",
                    [{ left: "þ", right: "voiceless /θ/" }, { left: "ð", right: "voiced /ð/" }, { left: "-r (nom.)", right: "morphological ending" }]),
                  fill("u1l5-6", "Type thorn:", ["þ"], null, "þ"),
                  mc("u1l5-7", "hl-, hn-, hr- are taught as:",
                    [{ id: "a", text: "Voiceless resonants (h-like + liquid/nasal)" }, { id: "b", text: "Silent digraphs" }, { id: "c", text: "Modern emoji" }],
                    "a"),
                  tf("u1l5-8", "You should import Modern Icelandic diphthong rules wholesale and call them Old Norse.", false,
                    "False — label MI comparisons explicitly.")
                ]
              }
            ]
          },
          {
            id: "u2",
            title: "First vocabulary",
            subtitle: "maðr · kona · land · vera · heita",
            studyNotes: {
              title: "Unit 2 — Full vocabulary notes",
              lessonId: 1,
              sectionIds: ["vocab"]
            },
            levels: [
              {
                id: "u2-notes",
                type: "notes",
                title: "Study notes (full)",
                icon: "❧",
                notesOnly: true,
                route: "#/notes/u2",
                exercises: []
              },
              {
                id: "u2-l1",
                type: "learn",
                title: "maðr, kona, land",
                icon: "ᛗ",
                intro: {
                  title: "Three nouns",
                  html: `<p>Five high-frequency items appear across Unit 2. Labels mark scholarly status. Grammar notes prepare Lessons 2–3.</p>
                  <div class="vocab-grid">
                    ${vocabCardHtml(V.madr)}
                    ${vocabCardHtml(V.kona)}
                    ${vocabCardHtml(V.land)}
                  </div>`
                },
                exercises: [
                  match("u2l1-1", "Match ON ↔ English",
                    [{ left: "maðr", right: "man; person" }, { left: "kona", right: "woman; wife" }, { left: "land", right: "land; country" }],
                    "All ATTESTED / NORMALIZED."),
                  text("u2l1-2", "Write ON ‘man; person’ (nom. sg.):", ["maðr"],
                    { explanation: "maðr — not Mod. Icel. maður as the ON citation form." }),
                  text("u2l1-3", "Write ON ‘woman; wife’:", ["kona"], { explanation: "kona — ATTESTED." }),
                  mc("u2l1-4", "land is which gender?",
                    [{ id: "a", text: "Masculine" }, { id: "b", text: "Feminine" }, { id: "c", text: "Neuter" }],
                    "c", { explanation: "Strong neuter; pl. lǫnd." }),
                  tiles("u2l1-5", "Build: ‘land; country’ in ON",
                    ["land", "maðr", "kona", "vera"], "land", "land (n.)"),
                  mc("u2l1-6", "maðr is best labelled:",
                    [{ id: "a", text: "RECONSTRUCTED only" }, { id: "b", text: "ATTESTED (NORMALIZED)" }, { id: "c", text: "Invented Viking festival word" }, { id: "d", text: "Modern Icelandic presented as ON" }],
                    "b"),
                  fill("u2l1-7", "Plural of land (u-umlaut) is l_nd — type the vowel letter:", ["ǫ"], null,
                    "lǫnd — ǫ from u-umlaut."),
                  mc("u2l1-8", "Mod. Icel. maður vs ON maðr:",
                    [{ id: "a", text: "Identical in every way; ignore labels" }, { id: "b", text: "Related descendant — compare only with MI warning" }, { id: "c", text: "Unrelated" }],
                    "b", { explanation: "Cognate descendant ≠ interchangeable unmarked ON." })
                ]
              },
              {
                id: "u2-l2",
                type: "learn",
                title: "vera & heita",
                icon: "v",
                intro: {
                  title: "Two essential verbs",
                  html: `<div class="vocab-grid">
                    ${vocabCardHtml(V.vera)}
                    ${vocabCardHtml(V.heita)}
                  </div>`
                },
                exercises: [
                  text("u2l2-1", "Infinitive ‘to be’ in Classical ON:", ["vera"]),
                  text("u2l2-2", "Infinitive ‘to be called/named’:", ["heita"]),
                  match("u2l2-3", "Match",
                    [{ left: "vera", right: "to be" }, { left: "heita", right: "to be called" }, { left: "maðr", right: "man; person" }]),
                  tiles("u2l2-4", "Build ON for ‘to be’",
                    ["vera", "heita", "land", "kona"], "vera"),
                  mc("u2l2-5", "Ek heiti… means roughly:",
                    [{ id: "a", text: "I am called…" }, { id: "b", text: "I own land…" }, { id: "c", text: "I am silent…" }],
                    "a"),
                  mc("u2l2-6", "heita is:",
                    [{ id: "a", text: "ATTESTED / NORMALIZED strong VII" }, { id: "b", text: "A fake Viking word" }, { id: "c", text: "Only Elder Futhark" }],
                    "a"),
                  tf("u2l2-7", "You may treat Mod. Icel. heita paradigms as unmarked Classical ON.", false,
                    "False — cognate, but label MI differences."),
                  fill("u2l2-8", "Type vera:", ["vera"], null)
                ]
              },
              {
                id: "u2-l3",
                type: "listen",
                title: "Listen: first words",
                icon: "🎧",
                exercises: [
                  tapHear("u2l3-1", "maðr", "MAHTH-r (th as in this)",
                    [{ id: "a", text: "maðr" }, { id: "b", text: "kona" }, { id: "c", text: "land" }], "a"),
                  tapHear("u2l3-2", "kona", "KOH-nah",
                    [{ id: "a", text: "vera" }, { id: "b", text: "kona" }, { id: "c", text: "heita" }], "b"),
                  tapHear("u2l3-3", "land", "LAHND",
                    [{ id: "a", text: "land" }, { id: "b", text: "maðr" }, { id: "c", text: "ǫ" }], "a"),
                  tapHear("u2l3-4", "vera", "VEH-rah",
                    [{ id: "a", text: "heita" }, { id: "b", text: "vera" }, { id: "c", text: "kona" }], "b"),
                  tapHear("u2l3-5", "heita", "HAY-tah",
                    [{ id: "a", text: "heita" }, { id: "b", text: "land" }, { id: "c", text: "þ" }], "a"),
                  {
                    id: "u2l3-6", type: "listen_choice", prompt: "Listen, then pick the English gloss",
                    audioForm: "maðr", clearSpeak: "MAHTH-r (th as in this)",
                    choices: [{ id: "a", text: "man; person" }, { id: "b", text: "woman; wife" }, { id: "c", text: "to be" }],
                    answer: "a", explanation: "maðr — ATTESTED."
                  },
                  {
                    id: "u2l3-7", type: "listen_choice", prompt: "Listen, then pick the gloss",
                    audioForm: "heita", clearSpeak: "HAY-tah",
                    choices: [{ id: "a", text: "to be" }, { id: "b", text: "to be called" }, { id: "c", text: "land" }],
                    answer: "b"
                  },
                  mc("u2l3-8", "Clear-mode listen audio is:",
                    [{ id: "a", text: "Historical ON speech" }, { id: "b", text: "Pedagogical modern approximation (phonetic cue)" }, { id: "c", text: "Saga manuscript audio" }],
                    "b", { explanation: "Always labelled MODERN APPROXIMATION." })
                ]
              },
              {
                id: "u2-l4",
                type: "practice",
                title: "Translate & match",
                icon: "⇄",
                exercises: [
                  match("u2l4-1", "Match all five",
                    [
                      { left: "maðr", right: "man; person" },
                      { left: "kona", right: "woman; wife" },
                      { left: "land", right: "land; country" },
                      { left: "vera", right: "to be" },
                      { left: "heita", right: "to be called" }
                    ]),
                  {
                    id: "u2l4-2", type: "translate_on_en", prompt: "Translate to English: <em>kona</em>",
                    choices: [{ id: "a", text: "woman; wife" }, { id: "b", text: "man; person" }, { id: "c", text: "to be" }],
                    answer: "a"
                  },
                  {
                    id: "u2l4-3", type: "translate_on_en", prompt: "Translate: <em>vera</em>",
                    choices: [{ id: "a", text: "land" }, { id: "b", text: "to be" }, { id: "c", text: "Thor" }],
                    answer: "b"
                  },
                  tiles("u2l4-4", "English → ON: ‘to be called’",
                    ["heita", "vera", "maðr", "land"], "heita"),
                  tiles("u2l4-5", "English → ON: ‘man; person’",
                    ["kona", "maðr", "land", "ǫ"], "maðr"),
                  text("u2l4-6", "Type ON for ‘land; country’:", ["land"]),
                  mc("u2l4-7", "Which is neuter?",
                    [{ id: "a", text: "maðr" }, { id: "b", text: "kona" }, { id: "c", text: "land" }], "c"),
                  fill("u2l4-8", "Fill: Ek ____ … (‘I am called’)", ["heiti"],
                    [{ id: "a", text: "heiti" }, { id: "b", text: "land" }, { id: "c", text: "maðr" }],
                    "Ek heiti… — present of heita.")
                ]
              },
              {
                id: "u2-l5",
                type: "speak",
                title: "Speak: vocabulary",
                icon: "🎤",
                exercises: [
                  speak("u2l5-1", "maðr", "MAHTH-r (th as in this)", "man; person; husband (context-dependent)", "ATTESTED",
                    "Stress on first (only) syllable. Short a. Medial ð as /ð/. Final -r pronounced as a morphological ending (not silent).",
                    ["Initial stress", "ð fricative, not /d/", "Audible final -r"],
                    ["MAÐ-r — avoid Modern Icelandic maður as if it were the ON citation form.", "Self-check: length short on a; ð voiced; -r present."]),
                  speak("u2l5-2", "kona", "KOH-nah", "woman; wife", "ATTESTED",
                    "Two syllables; stress on ko-. Short vowels. Clear n.",
                    ["Stress on first syllable", "Two clear syllables: KO-na", "No reduction of the final a to schwa as a required ON rule"],
                    ["Keep both vowels; do not swallow -a.", "ATTESTED / NORMALIZED weak feminine."]),
                  speak("u2l5-3", "land", "LAHND", "land; country", "ATTESTED",
                    "Short a; final nd cluster clear.",
                    ["Initial stress", "Clear nd", "Neuter a-stem"],
                    ["Recall pl. lǫnd later."]),
                  speak("u2l5-4", "vera", "VEH-rah", "to be", "ATTESTED",
                    "Two syllables VE-ra.",
                    ["First-syllable stress", "Both vowels audible"],
                    ["Anomalous verb — paradigm later."]),
                  speak("u2l5-5", "heita", "HAY-tah", "to be called", "ATTESTED",
                    "HEI-ta; diphthongal ei quality approximate.",
                    ["Stress first syllable", "Two syllables"],
                    ["Label MI comparisons."]),
                  tapHear("u2l5-6", "maðr", "MAHTH-r (th as in this)",
                    [{ id: "a", text: "maðr" }, { id: "b", text: "kona" }], "a"),
                  mc("u2l5-7", "Final -r in maðr when speaking:",
                    [{ id: "a", text: "Drop it always" }, { id: "b", text: "Pronounce as morphological ending" }],
                    "b"),
                  tf("u2l5-8", "Browser ASR grades historical ON accurately.", false,
                    "False — modern ASR is never historical ground truth.")
                ]
              },
              {
                id: "u2-l6",
                type: "practice",
                title: "Practice: recycle sounds + words",
                icon: "↻",
                exercises: [
                  mc("u2l6-1", "ð is:",
                    [{ id: "a", text: "voiced /ð/" }, { id: "b", text: "voiceless /θ/" }], "a"),
                  text("u2l6-2", "Type maðr:", ["maðr"]),
                  match("u2l6-3", "Quick match",
                    [{ left: "þ", right: "/θ/" }, { left: "kona", right: "woman" }, { left: "vera", right: "to be" }]),
                  tapHear("u2l6-4", "heita", "HAY-tah",
                    [{ id: "a", text: "heita" }, { id: "b", text: "land" }], "a"),
                  tiles("u2l6-5", "‘woman; wife’ →",
                    ["kona", "maðr", "land"], "kona"),
                  tf("u2l6-6", "Stress is on the first syllable.", true, "True for native ON vocabulary."),
                  {
                    id: "u2l6-7", type: "translate_on_en", prompt: "Translate: <em>land</em>",
                    choices: [{ id: "a", text: "land; country" }, { id: "b", text: "to be called" }],
                    answer: "a"
                  },
                  mc("u2l6-8", "lǫnd is:",
                    [{ id: "a", text: "Plural of land (u-umlaut)" }, { id: "b", text: "A Modern Icelandic SMS" }, { id: "c", text: "Elder Futhark only" }],
                    "a")
                ]
              }
            ]
          },
          {
            id: "u3",
            title: "Readings & awareness",
            subtitle: "Mini texts · ON vs MI · Checkpoint",
            studyNotes: {
              title: "Unit 3 — Practice tips & charter awareness",
              lessonId: 1,
              sectionIds: ["practice-tips", "what-is-on"]
            },
            levels: [
              {
                id: "u3-notes",
                type: "notes",
                title: "Study notes (full)",
                icon: "❧",
                notesOnly: true,
                route: "#/notes/u3",
                exercises: []
              },
              {
                id: "u3-l1",
                type: "lore",
                title: "Lore: mini reading",
                icon: "📜",
                intro: {
                  title: "A first formula",
                  html: `<p class="lore-text">In saga style you will often meet naming formulas with <strong>heita</strong>:</p>
                  <blockquote class="on-quote">Ek heiti…</blockquote>
                  <p class="muted">‘I am called…’ — ATTESTED pattern with NORMALIZED classical forms.</p>
                  <p>Another high-frequency noun pair: <em>maðr</em> and <em>kona</em>. Neuter <em>land</em> builds compounds (e.g. Ísland — later geography; treat compound carefully by period).</p>
                  <aside class="callout info"><strong>Philology note</strong><p>We teach Classical normalized ON as in scholarly editions — not tourist “Viking” coinages.</p></aside>`
                },
                exercises: [
                  lore("u3l1-0", "Read", `<p>Skim again: <em>Ek heiti…</em> uses <strong>heita</strong>. Copula ‘to be’ is <strong>vera</strong>.</p>`),
                  mc("u3l1-1", "Ek heiti… uses which verb?",
                    [{ id: "a", text: "vera" }, { id: "b", text: "heita" }, { id: "c", text: "land" }], "b"),
                  {
                    id: "u3l1-2", type: "translate_on_en", prompt: "Sense of <em>Ek heiti…</em>",
                    choices: [{ id: "a", text: "I am called…" }, { id: "b", text: "I own the land…" }, { id: "c", text: "Silence…" }],
                    answer: "a"
                  },
                  text("u3l1-3", "Type the infinitive ‘to be’:", ["vera"]),
                  match("u3l1-4", "Match from the reading",
                    [{ left: "heita", right: "be called" }, { left: "maðr", right: "man" }, { left: "kona", right: "woman" }]),
                  mc("u3l1-5", "This course’s target is:",
                    [{ id: "a", text: "Modern Icelandic as unmarked ON" }, { id: "b", text: "Classical normalized Old West Norse" }, { id: "c", text: "Invented festival slang" }],
                    "b"),
                  tf("u3l1-6", "Every lemma in this path is attested, normalized from attestation, or explicitly labelled reconstructed/uncertain.", true,
                    "True — scholarly honesty labels."),
                  fill("u3l1-7", "Type heita:", ["heita"], null)
                ]
              },
              {
                id: "u3-l2",
                type: "learn",
                title: "ON vs Modern Icelandic",
                icon: "⚠",
                intro: {
                  title: "Do not confuse the stages",
                  html: `<aside class="callout warn"><strong>MODERN ICELANDIC — NOT OLD NORSE</strong>
                  <ul>
                    <li>ON <em>maðr</em> ~ Mod. Icel. <em>maður</em> — related, not identical citation forms.</li>
                    <li>Mod. Icel. <em>á</em> ≈ [au]; Classical ON <em>á</em> taught as /ɑː/.</li>
                    <li>Comparisons appear only with an explicit MI warning label.</li>
                  </ul></aside>
                  <p>Modern Icelandic is a living descendant. This path teaches historical Classical ON.</p>`
                },
                exercises: [
                  tf("u3l2-1", "Modern Icelandic is the same language stage as Classical ON and needs no labels.", false,
                    "False — descendant with changes; always label MI."),
                  mc("u3l2-2", "ON maðr vs Mod. Icel. maður:",
                    [{ id: "a", text: "Present maður as unmarked ON" }, { id: "b", text: "Related forms — compare with MI warning" }, { id: "c", text: "Unrelated random strings" }],
                    "b"),
                  tf("u3l2-3", "Teaching Mod. Icel. á [au] as Classical ON without a warning violates this course’s charter.", true,
                    "True — charter forbids presenting MI as ON unmarked."),
                  mc("u3l2-4", "Best label for kona in this course:",
                    [{ id: "a", text: "ATTESTED / NORMALIZED" }, { id: "b", text: "Invented" }, { id: "c", text: "Only runic" }],
                    "a"),
                  {
                    id: "u3l2-5", type: "truefalse", prompt: "Browser Icelandic TTS/ASR equals medieval ON speech.",
                    choices: [{ id: "t", text: "True" }, { id: "f", text: "False" }],
                    answer: "f",
                    explanation: "False — modern approximation only."
                  },
                  match("u3l2-6", "Label awareness",
                    [{ left: "ATTESTED", right: "manuscript-supported" }, { left: "NORMALIZED", right: "editorial classical spelling" }, { left: "RECONSTRUCTED", right: "comparative inference" }]),
                  mc("u3l2-7", "When is MI comparison allowed?",
                    [{ id: "a", text: "Anytime silently" }, { id: "b", text: "Only with explicit MI warning label" }, { id: "c", text: "Never under any circumstances" }],
                    "b"),
                  text("u3l2-8", "Type the ON form for ‘man; person’ (not maður):", ["maðr"])
                ]
              },
              {
                id: "u3-l3",
                type: "practice",
                title: "Practice: Units 1–2",
                icon: "↻",
                exercises: [
                  mc("u3l3-1", "þ =",
                    [{ id: "a", text: "/θ/" }, { id: "b", text: "/ð/" }], "a"),
                  text("u3l3-2", "Type kona:", ["kona"]),
                  tapHear("u3l3-3", "land", "LAHND",
                    [{ id: "a", text: "land" }, { id: "b", text: "vera" }], "a"),
                  tiles("u3l3-4", "‘to be’ →",
                    ["vera", "heita", "maðr"], "vera"),
                  match("u3l3-5", "Recycle",
                    [{ left: "ð", right: "/ð/" }, { left: "heita", right: "be called" }, { left: "land", right: "land" }]),
                  mc("u3l3-6", "Stress:",
                    [{ id: "a", text: "First syllable" }, { id: "b", text: "Last" }], "a"),
                  {
                    id: "u3l3-7", type: "translate_on_en", prompt: "Translate: <em>heita</em>",
                    choices: [{ id: "a", text: "to be called" }, { id: "b", text: "woman" }],
                    answer: "a"
                  },
                  fill("u3l3-8", "Type eth:", ["ð"], null)
                ]
              },
              {
                id: "u3-l4",
                type: "learn",
                title: "True/False philology",
                icon: "?",
                exercises: [
                  tf("u3l4-1", "Elder Futhark is how Heimskringla was normally written.", false,
                    "False — Latin manuscript orthography."),
                  tf("u3l4-2", "Normalized Classical ON is a scholarly editorial system for teaching/reading.", true,
                    "True — editions regularize orthography from attestation."),
                  tf("u3l4-3", "Invented ‘Viking’ tourist words are fine unmarked as ON.", false,
                    "False — every lemma needs scholarly status."),
                  tf("u3l4-4", "Length contrasts can matter for meaning and morphology.", true,
                    "True — length is phonemic."),
                  tf("u3l4-5", "Clear-mode TTS is historical ON audio.", false,
                    "False — pedagogical approximation."),
                  tf("u3l4-6", "maðr is ATTESTED in the manuscript tradition (NORMALIZED citation).", true,
                    "True."),
                  tf("u3l4-7", "Younger Futhark’s 16 runes preserve more vowel detail than Latin normalized ON.", false,
                    "False — compression makes Viking-Age runic spelling often ambiguous."),
                  mc("u3l4-8", "RECONSTRUCTED means:",
                    [{ id: "a", text: "Guessed for a game with no method" }, { id: "b", text: "Inferred by comparative method; labelled" }, { id: "c", text: "Identical to ATTESTED" }],
                    "b")
                ]
              },
              {
                id: "u3-l5",
                type: "checkpoint",
                title: "Unit checkpoint",
                icon: "★",
                intro: {
                  title: "Foundations checkpoint",
                  html: `<p>Show that sounds, first vocabulary, and ON≠MI awareness stick. Hearts still apply. Pass to finish Section 1 Unit 3.</p>`
                },
                exercises: [
                  mc("u3l5-1", "Voiced dental fricative letter:",
                    [{ id: "a", text: "þ" }, { id: "b", text: "ð" }, { id: "c", text: "ǫ" }], "b"),
                  text("u3l5-2", "ON ‘man; person’:", ["maðr"]),
                  text("u3l5-3", "ON ‘to be’:", ["vera"]),
                  text("u3l5-4", "ON ‘to be called’:", ["heita"]),
                  match("u3l5-5", "Match",
                    [{ left: "kona", right: "woman; wife" }, { left: "land", right: "land; country" }, { left: "þ", right: "/θ/" }]),
                  tf("u3l5-6", "Mod. Icel. pronunciation may be taught as Classical ON with no label.", false,
                    "False."),
                  tiles("u3l5-7", "‘woman; wife’",
                    ["kona", "maðr", "vera", "heita"], "kona"),
                  mc("u3l5-8", "Primary stress:",
                    [{ id: "a", text: "First syllable" }, { id: "b", text: "Final syllable" }], "a"),
                  tapHear("u3l5-9", "maðr", "MAHTH-r (th as in this)",
                    [{ id: "a", text: "maðr" }, { id: "b", text: "kona" }], "a"),
                  mc("u3l5-10", "This course teaches:",
                    [{ id: "a", text: "Classical normalized Old West Norse" }, { id: "b", text: "Unlabelled Modern Icelandic" }, { id: "c", text: "Only Elder Futhark as saga script" }],
                    "a")
                ]
              },
              {
                id: "s1-classic-l1",
                type: "notes",
                title: "Classic Lesson 1 (full)",
                icon: "📜",
                notesOnly: true,
                route: "#/lesson/1",
                exercises: []
              }
            ]
          }
        ]
      },
      {
        id: "s2",
        title: "Beginner grammar",
        subtitle: "Coming soon — cases, nouns, verbs",
        unlocked: false,
        comingSoon: true,
        units: [
          {
            id: "u4",
            title: "Nouns I: strong masculines",
            subtitle: "Coming soon",
            comingSoon: true,
            levels: [
              { id: "u4-l1", type: "learn", title: "Strong masculines", icon: "🔒", lockedShell: true, exercises: [] },
              { id: "u4-l2", type: "practice", title: "Articles", icon: "🔒", lockedShell: true, exercises: [] },
              { id: "u4-l3", type: "checkpoint", title: "Nouns I check", icon: "🔒", lockedShell: true, exercises: [] }
            ]
          },
          {
            id: "u5",
            title: "Verbs I: vera & heita paradigms",
            subtitle: "Coming soon",
            comingSoon: true,
            levels: [
              { id: "u5-l1", type: "learn", title: "vera present", icon: "🔒", lockedShell: true, exercises: [] },
              { id: "u5-l2", type: "learn", title: "heita present", icon: "🔒", lockedShell: true, exercises: [] },
              { id: "u5-l3", type: "checkpoint", title: "Verbs I check", icon: "🔒", lockedShell: true, exercises: [] }
            ]
          },
          {
            id: "u6",
            title: "Nouns II: feminines & neuters",
            subtitle: "Coming soon",
            comingSoon: true,
            levels: [
              { id: "u6-l1", type: "learn", title: "Feminines", icon: "🔒", lockedShell: true, exercises: [] },
              { id: "u6-l2", type: "learn", title: "Neuters", icon: "🔒", lockedShell: true, exercises: [] }
            ]
          }
        ]
      },
      {
        id: "s3",
        title: "Building sentences",
        subtitle: "Coming soon — case & agreement",
        unlocked: false,
        comingSoon: true,
        units: [
          {
            id: "u7",
            title: "Case & simple sentences",
            subtitle: "Coming soon",
            comingSoon: true,
            levels: [
              { id: "u7-l1", type: "learn", title: "Case roles", icon: "🔒", lockedShell: true, exercises: [] },
              { id: "u7-l2", type: "checkpoint", title: "Case check", icon: "🔒", lockedShell: true, exercises: [] }
            ]
          },
          {
            id: "u8",
            title: "Adjectives & agreement",
            subtitle: "Coming soon",
            comingSoon: true,
            levels: [
              { id: "u8-l1", type: "learn", title: "Agreement", icon: "🔒", lockedShell: true, exercises: [] }
            ]
          }
        ]
      }
    ],

    sidePaths: [
      {
        id: "futhark",
        title: "Elder Futhark",
        subtitle: "Parallel track — not saga orthography",
        route: "#/futhark",
        note: "Migration-Period / Proto-Norse runes. Separate from Latin Classical ON path."
      },
      {
        id: "classic-l1",
        title: "Classic Lesson 1 (full)",
        subtitle: "All scholarly prose, vocab, exercises & speak drills",
        route: "#/lesson/1",
        note: "Verbatim lesson1.js view — path micro-lessons unchanged."
      }
    ],

    /** Flatten helpers */
    vocab: V
  };

  /** Ordered list of playable level ids in Section 1 */
  N.path.getAllLevels = function () {
    const out = [];
    (N.path.sections || []).forEach((sec) => {
      (sec.units || []).forEach((unit) => {
        (unit.levels || []).forEach((lv) => {
          out.push({ section: sec, unit, level: lv });
        });
      });
    });
    return out;
  };

  N.path.findLevel = function (levelId) {
    const all = N.path.getAllLevels();
    return all.find((x) => x.level.id === levelId) || null;
  };

  N.path.getLinearPlayable = function () {
    return N.path.getAllLevels().filter(
      (x) =>
        x.section.unlocked &&
        !x.section.comingSoon &&
        !x.level.lockedShell &&
        !x.level.notesOnly &&
        x.level.type !== "notes" &&
        (x.level.exercises || []).length
    );
  };

  N.path.counts = function () {
    const sections = N.path.sections.length;
    let units = 0, levels = 0, playable = 0;
    N.path.sections.forEach((s) => {
      units += (s.units || []).length;
      (s.units || []).forEach((u) => {
        levels += (u.levels || []).length;
        (u.levels || []).forEach((lv) => {
          if (!lv.lockedShell && (lv.exercises || []).length) playable++;
        });
      });
    });
    return { sections, units, levels, playable };
  };
})(window.NORDRONA);
