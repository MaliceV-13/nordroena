/**
 * Elder Futhark module — parallel writing-system track
 * NOT the script of medieval ON manuscripts (those use Latin).
 * Scholarly / epigraphic tone — no New-Age “rune magic”.
 */
window.NORDRONA = window.NORDRONA || {};

window.NORDRONA.futhark = {
  title: "Elder Futhark",
  subtitle: "Migration-Period runes — a parallel track, not saga orthography",

  chronology: {
    title: "Critical chronology",
    points: [
      {
        name: "Elder Futhark",
        period: "c. 2nd–8th centuries",
        script: "24-rune row",
        use: "Migration Period / early Proto-Norse (Northwest Germanic) inscriptions on stone, metal, bone, etc."
      },
      {
        name: "Younger Futhark",
        period: "Viking Age (c. 8th–12th c.)",
        script: "Reduced 16-rune system",
        use: "Scandinavian runic inscriptions of the Viking Age; many phonemic distinctions collapsed into fewer graphs."
      },
      {
        name: "Medieval runes",
        period: "High/Late Middle Ages",
        script: "Expanded inventories building on Younger Futhark",
        use: "Later medieval Scandinavian runic literacy alongside Latin script."
      },
      {
        name: "Classical Old Norse (literary)",
        period: "Manuscript culture c. 12th–14th c. (normalized editions)",
        script: "Latin alphabet (+ þ ð ǫ æ œ, etc.)",
        use: "Sagas, Eddaic and skaldic poetry as we read them in scholarly editions — primarily Latin orthography, NOT Elder Futhark."
      }
    ],
    warnings: [
      "Elder Futhark ≠ the writing system of medieval Icelandic/Norwegian manuscripts.",
      "Heimskringla, the Poetic Edda manuscripts, Family Sagas, etc. are Latin-script books (with þ, ð, etc.). Writing Eddaic Old Norse in Elder Futhark and calling that historically typical for those texts is anachronistic.",
      "Rune names below are scholarly conventional (often from later tradition); early name forms are partly reconstructed or known from later sources — treat names as conventional labels, not magic."
    ]
  },

  row: [
    { glyph: "ᚠ", name: "fehu", value: "/f/", note: "Conventional name; f-sound." },
    { glyph: "ᚢ", name: "uruz", value: "/u/", note: "u-vowel; later developments interact with ON ú/u." },
    { glyph: "ᚦ", name: "thurisaz", value: "/θ/ (þ-lineage)", note: "Dental fricative lineage → ON þ / ð distinction in Latin orthography." },
    { glyph: "ᚨ", name: "ansuz", value: "/a/", note: "a-vowel; important for later North Germanic vowel history." },
    { glyph: "ᚱ", name: "raidho", value: "/r/", note: "r-sound." },
    { glyph: "ᚲ", name: "kenaz", value: "/k/", note: "Also seen as kaunan in some traditions; k-sound." },
    { glyph: "ᚷ", name: "gebo", value: "/ɡ/", note: "g-sound." },
    { glyph: "ᚹ", name: "wunjo", value: "/w/", note: "w-approximant — contrast later ON v (Latin orthography)." },
    { glyph: "ᚺ", name: "hagalaz", value: "/h/", note: "h-sound (shape variants exist)." },
    { glyph: "ᚾ", name: "naudiz", value: "/n/", note: "n-sound." },
    { glyph: "ᛁ", name: "isaz", value: "/i/", note: "i-vowel." },
    { glyph: "ᛃ", name: "jera", value: "/j/", note: "j-approximant — correlates with later ON j." },
    { glyph: "ᛇ", name: "eihwaz", value: "/iː/~/æː/ (debated)", note: "Value debated in runology; do not overclaim." },
    { glyph: "ᛈ", name: "perthro", value: "/p/", note: "p-sound; name traditional/conventional." },
    { glyph: "ᛉ", name: "algiz", value: "/z/ (→ ON -r lineage)", note: "Often linked to Proto-Germanic *z; North Germanic rhotacism is a later story told in grammars, not by this glyph alone." },
    { glyph: "ᛊ", name: "sowilo", value: "/s/", note: "s-sound (variants ᛋ)." },
    { glyph: "ᛏ", name: "tiwaz", value: "/t/", note: "t-sound." },
    { glyph: "ᛒ", name: "berkano", value: "/b/", note: "b-sound." },
    { glyph: "ᛖ", name: "ehwaz", value: "/e/", note: "e-vowel." },
    { glyph: "ᛗ", name: "mannaz", value: "/m/", note: "m-sound." },
    { glyph: "ᛚ", name: "laguz", value: "/l/", note: "l-sound." },
    { glyph: "ᛜ", name: "ingwaz", value: "/ŋ/", note: "velar nasal ŋ — not a separate Latin letter in ON, but relevant phonetically in clusters." },
    { glyph: "ᛞ", name: "dagaz", value: "/d/", note: "d-sound." },
    { glyph: "ᛟ", name: "othala", value: "/o/", note: "o-vowel; conventional name othala/odal." }
  ],

  correlations: {
    title: "Significant correlations for later Old Norse learners",
    items: [
      {
        title: "ᚦ thurisaz ↔ þ / ð",
        text: "Elder Futhark has a dedicated dental-fricative rune (thurisaz). Classical ON Latin orthography distinguishes voiceless þ and voiced ð. The rune shows that a þ-like fricative was already worth writing in the Proto-Norse period; the later þ/ð split and Latin spelling conventions are a manuscript-age story (see Lesson 1)."
      },
      {
        title: "ᚨ ansuz ↔ a-vowels",
        text: "Ansuz writes an a-quality vowel in early inscriptions. Old Norse later has a rich short/long and umlauted vowel system (a á ǫ æ œ …) that Latin orthography can mark more finely than a 16-rune Viking-Age row."
      },
      {
        title: "Why Younger Futhark loses distinctions",
        text: "Younger Futhark compresses ~24 graphs to 16. Several vowels and consonants share runes. That is why Viking-Age runic spelling is often ambiguous — and why normalized Latin Old Norse (with length marks, þ/ð, ǫ, etc.) preserves more phonological information for learners than a 16-rune inventory can."
      },
      {
        title: "*w (wunjo ᚹ) vs later ON v",
        text: "Proto-Norse/early NWGmc had a w-approximant written with wunjo. In Old Norse Latin orthography the corresponding historical segment is typically written v (e.g. in words descending from *w-). Do not read modern English w into every ON v, and do not pretend Elder Futhark wunjo is how saga manuscripts spell."
      },
      {
        title: "*j (jera ᛃ) vs ON j",
        text: "Jera correlates with a j-glide. Classical ON writes j in Latin script (e.g. jǫrð). Continuity of the approximant is real; the writing system changed."
      },
      {
        title: "ŋ / ingwaz ᛜ",
        text: "Ingwaz is conventionally linked to the velar nasal /ŋ/. Old Norse has no separate ŋ letter; nasals assimilate in clusters (n before g/k, etc.). The rune is a reminder that early epigraphy sometimes encoded nasality more explicitly than ON Latin spelling does."
      },
      {
        title: "Do not write Eddaic ON in Elder Futhark as ‘typical’",
        text: "The Poetic Edda and prose sagas survive in Latin-script manuscripts. Transliterating normalized ON into Elder Futhark may be a classroom cipher exercise, but it is not historically how those texts were written. Label any such exercise as anachronistic practice, not manuscript fact."
      }
    ]
  },

  sideBySide: {
    title: "Side-by-side: early runic vs NORMALIZED Old Norse",
    intro: "Famous correlations exist between early runic inscriptions (Proto-Norse / early NWGmc) and later Old Norse forms. Where the early form is reconstructed or debated, it is labelled.",
    rows: [
      {
        topic: "‘Horn’ formula (type)",
        runic: "ek … hlewagastiz holtijaz horna tawido (type of early inscriptional formula)",
        runicLabel: "ATTESTED (inscriptional; normalized scholarly transcription)",
        onLatin: "Related later lexicon includes ON horn ‘horn’ (n.) — NORMALIZED classical form.",
        onLabel: "ATTESTED",
        note: "The Gallehus-type formula is Proto-Norse, centuries before Classical ON manuscripts. Cognate vocabulary ≠ same language stage."
      },
      {
        topic: "Dental fricative continuity",
        runic: "ᚦ (thurisaz) in Elder Futhark inventories / inscriptions",
        runicLabel: "ATTESTED (as graph)",
        onLatin: "ON þ / ð in maðr, Þórr, Óðinn (Lesson 1)",
        onLabel: "ATTESTED",
        note: "Graph continuity for a dental fricative; voicing split and Latin þ/ð are taught in the sound-system lesson."
      },
      {
        topic: "Divine name (illustration)",
        runic: "Early theonyms appear in runic sources in period-appropriate forms (not Classical ON spelling).",
        runicLabel: "uncertain / period-specific",
        onLatin: "Óðinn, Þórr — NORMALIZED Classical ON Latin forms used in editions",
        onLabel: "ATTESTED",
        note: "Do not paste Elder Futhark over normalized Óðinn and call it a Heimskringla manuscript reading."
      },
      {
        topic: "‘Guest’ etymon (schematic)",
        runic: "Proto-Norse *-gastiz (as in name-elements; RECONSTRUCTED citation form for the stem)",
        runicLabel: "RECONSTRUCTED (stem shape; elements ATTESTED in compounds)",
        onLatin: "ON gestr ‘guest’ — NORMALIZED",
        onLabel: "ATTESTED",
        note: "Illustrates sound change and morphological trimming over centuries — not interchangeable spellings of one stage."
      }
    ]
  },

  linkToLesson1: {
    title: "Link to Lesson 1 (sound system)",
    text: "Lesson 1 teaches þ, ð, vowel length (a vs á), and stress in Latin-script Classical ON. Elder Futhark could mark a dental fricative (ᚦ) and various vowels, but it does not give you the manuscript þ/ð orthographic split, acute length marks, or ǫ/æ/œ of normalized editions. Younger Futhark is even more underspecified. Use runes to understand prehistory; use Latin normalized ON to read sagas."
  },

  quiz: [
    {
      id: "ef-q1",
      type: "multiple",
      prompt: "True or false: Elder Futhark is the normal writing system of medieval Icelandic saga manuscripts (e.g. Heimskringla).",
      choices: [
        { id: "a", text: "True" },
        { id: "b", text: "False" }
      ],
      answer: "b",
      hint: "Re-read the chronology: manuscripts use Latin script.",
      explanation: "False. Medieval Icelandic/Norwegian literary manuscripts use Latin orthography. Elder Futhark belongs to Migration-Period / early Proto-Norse epigraphy."
    },
    {
      id: "ef-q2",
      type: "multiple",
      prompt: "Which script is primarily used for Classical Old Norse as taught in normalized editions?",
      choices: [
        { id: "a", text: "Elder Futhark (24 runes)" },
        { id: "b", text: "Latin alphabet with þ ð and vowel marks" },
        { id: "c", text: "Only Younger Futhark (16 runes)" },
        { id: "d", text: "Emojis" }
      ],
      answer: "b",
      hint: "Think sagas and dictionaries like Zoëga.",
      explanation: "Normalized Classical ON is learned in Latin orthography (þ, ð, ǫ, length, etc.)."
    },
    {
      id: "ef-q3",
      type: "multiple",
      prompt: "Which rune is conventionally linked to the dental-fricative lineage relevant to ON þ/ð?",
      choices: [
        { id: "a", text: "ᚨ ansuz" },
        { id: "b", text: "ᚦ thurisaz" },
        { id: "c", text: "ᛜ ingwaz" },
        { id: "d", text: "ᚹ wunjo" }
      ],
      answer: "b",
      hint: "Looks like a thorn-related shape family.",
      explanation: "ᚦ thurisaz ↔ þ-lineage dental fricative. ON Latin spelling later distinguishes þ and ð."
    },
    {
      id: "ef-q4",
      type: "multiple",
      prompt: "Younger Futhark reduces the row to about how many runes, making Viking-Age spelling often ambiguous?",
      choices: [
        { id: "a", text: "32" },
        { id: "b", text: "24" },
        { id: "c", text: "16" },
        { id: "d", text: "5" }
      ],
      answer: "c",
      hint: "Compression is the key Viking-Age runic story.",
      explanation: "Younger Futhark ≈ 16 runes. Latin normalized ON can preserve more contrasts than those 16 graphs."
    },
    {
      id: "ef-q5",
      type: "multiple",
      prompt: "Wunjo (ᚹ) is most relevant as a correlate of which early sound, versus later ON Latin v?",
      choices: [
        { id: "a", text: "/w/ approximant" },
        { id: "b", text: "/ŋ/" },
        { id: "c", text: "Only /f/" },
        { id: "d", text: "Click consonants" }
      ],
      answer: "a",
      hint: "See correlations: *w vs later v.",
      explanation: "/w/ written with wunjo in Elder Futhark; later ON typically writes historical *w as v in Latin script."
    },
    {
      id: "ef-q6",
      type: "multiple",
      prompt: "For a Heimskringla manuscript page, which is historically appropriate?",
      choices: [
        { id: "a", text: "Entire text in Elder Futhark as the normal book hand" },
        { id: "b", text: "Latin script (medieval book hand), not Elder Futhark" },
        { id: "c", text: "Only ogham" },
        { id: "d", text: "Only Modern Icelandic SMS abbreviations" }
      ],
      answer: "b",
      hint: "Charter + chronology.",
      explanation: "Heimskringla manuscripts are Latin-script medieval books. Elder Futhark is the wrong century and medium for ‘typical’ saga text."
    }
  ]
};
