/**
 * Lesson 1 — Historical Old Norse & the sound system
 * Classical normalized Old West Norse
 */
window.NORDRONA = window.NORDRONA || {};
window.NORDRONA.lessons = window.NORDRONA.lessons || {};

window.NORDRONA.lessons[1] = {
  id: 1,
  slug: "lesson-1",
  title: "Historical ON & the sound system",
  subtitle: "Letters, length, stress, and first vocabulary",
  locked: false,
  placeholder: false,

  sections: [
    {
      id: "what-is-on",
      title: "What we mean by Old Norse",
      html: `
        <p><strong>Old Norse</strong> (ON; Old West Norse <em>norrœna</em>) here means the <em>Classical normalized</em> language of the West Norse tradition — roughly the language of the Icelandic sagas and related texts as edited by modern philologists (c. 12th–14th centuries in manuscript form, reflecting an earlier spoken continuum).</p>
        <p>It is <strong>not</strong> Modern Icelandic, not a Hollywood “Viking tongue,” and not a free reconstruction of Proto-Norse. We teach forms that are <span class="label attested">ATTESTED</span> or carefully <span class="label normalized">NORMALIZED</span> from attestation.</p>
        <aside class="callout warn">
          <strong>MODERN ICELANDIC — NOT OLD NORSE</strong>
          <p>Modern Icelandic is a descendant of Old Norse. Cognates look similar (e.g. ON <em>maðr</em> ~ Mod. Icel. <em>maður</em>), but phonology, morphology, and everyday lexicon have changed. Comparison appears only with this label.</p>
        </aside>
      `
    },
    {
      id: "alphabet",
      title: "The classical alphabet & special letters",
      html: `
        <p>Classical normalized Old Norse uses the Latin alphabet plus several letters essential to the sound system:</p>
        <div class="letter-grid">
          <div class="letter-card"><span class="glyph">þ</span><span class="name">thorn</span><span class="ipa">/θ/</span><span class="note">voiceless dental fricative — as in English <em>thin</em></span></div>
          <div class="letter-card"><span class="glyph">ð</span><span class="name">eth</span><span class="ipa">/ð/</span><span class="note">voiced dental fricative — as in English <em>this</em></span></div>
          <div class="letter-card"><span class="glyph">ǫ</span><span class="name">o caudata</span><span class="ipa">/ɔ/</span><span class="note">open rounded back vowel (often written <em>ö</em> in some editions)</span></div>
          <div class="letter-card"><span class="glyph">æ</span><span class="name">ash</span><span class="ipa">/ɛː/ ~ /æː/</span><span class="note">long open front vowel (length marked in careful texts)</span></div>
          <div class="letter-card"><span class="glyph">œ</span><span class="name">oe</span><span class="ipa">/øː/</span><span class="note">long front rounded vowel (u-umlaut product)</span></div>
        </div>
        <p>Vowels may be short or long. In normalized texts, length is often marked with an acute accent: <em>á é í ó ú ý</em> (and sometimes <em>ǽ œ́</em>). Unmarked vowels are short unless context or a dictionary entry indicates otherwise.</p>
        <aside class="callout info">
          <strong>Pronunciation honesty</strong>
          <p>These IPA values are the conventional academic reconstruction for Classical ON. Exact quality varied by time and region. We do not claim to reproduce a single speaker’s voice.</p>
        </aside>
      `
    },
    {
      id: "length-stress",
      title: "Vowel length & stress",
      html: `
        <ul class="scholar-list">
          <li><strong>Stress</strong> falls on the first syllable of the word (primary stress). Compounds keep stress on the first element’s first syllable.</li>
          <li><strong>Length is phonemic</strong>: <em>man</em> vs potential long counterparts — learn each word’s length from a reliable dictionary or marked text.</li>
          <li><strong>Syllable weight</strong> matters for poetry and for later morphology; for now, practice hearing (or imagining) a clear contrast between short and long vowels.</li>
          <li>Do not import Modern Icelandic diphthongization rules wholesale and call them Old Norse.</li>
        </ul>
        <aside class="callout warn">
          <strong>MODERN ICELANDIC — NOT OLD NORSE</strong>
          <p>Modern Icelandic has diphthongized many historically long vowels (e.g. <em>á</em> ≈ [au]). Classical ON <em>á</em> is conventionally taught as a long monophthong /ɑː/. Use the ON values in this course unless a comparison is explicitly labelled.</p>
        </aside>
      `
    },
    {
      id: "consonants",
      title: "Key consonants",
      html: `
        <ul class="scholar-list">
          <li><strong>þ / ð</strong> — dental fricatives; þ typically word-initial or after voiceless sounds; ð medial/final voiced (distribution is orthographic–phonological convention in normalized texts).</li>
          <li><strong>hl-, hn-, hr-</strong> — historically voiceless resonants; often taught as /l n r/ with a preceding /h/-like quality.</li>
          <li><strong>x</strong> — usually /ks/ (as in <em>oxi</em>).</li>
          <li><strong>g, k</strong> — velar stops; palatal colouring before front vowels is debated in detail — beginners may use clear [g]/[k].</li>
          <li><strong>Final -r</strong> in nom. sg. masculines (e.g. <em>maðr</em>) is a real morphological ending, not silent decoration.</li>
        </ul>
        <aside class="callout info">
          <strong>Writing systems</strong>
          <p>þ and ð here are <em>Latin-script</em> Classical ON. Elder Futhark ᚦ (thurisaz) is Migration-Period / Proto-Norse epigraphy — not how Heimskringla was written. Rune rows also do not mark vowel length the way normalized <em>á</em> vs <em>a</em> does. Open the <a href="#/futhark">Elder Futhark</a> module for the full chronology and correlations.</p>
        </aside>
      `
    },
    {
      id: "vocab",
      title: "Core vocabulary (Lesson 1)",
      html: `
        <p>Five high-frequency items. Labels mark scholarly status. Grammar notes prepare Lessons 2–3.</p>
      `,
      vocab: [
        {
          form: "maðr",
          gloss: "man; person; husband (context-dependent)",
          pos: "m. noun (cons. stem)",
          label: "ATTESTED",
          labelNote: "NORMALIZED spelling of a thoroughly attested lemma",
          grammar: "Nom. sg. maðr; gen. manns; dat. manni; acc. mann. Strong masculine. Plural menn (irregular).",
          clearSpeak: "MAHTH-r (th as in this)",
          compare: null
        },
        {
          form: "kona",
          gloss: "woman; wife",
          pos: "f. noun (ōn-stem)",
          label: "ATTESTED",
          labelNote: "NORMALIZED classical form",
          grammar: "Nom. sg. kona; gen. konu; dat. konu; acc. konu. Weak feminine. Pl. konur.",
          clearSpeak: "KOH-nah",
          compare: null
        },
        {
          form: "land",
          gloss: "land; country",
          pos: "n. noun (a-stem)",
          label: "ATTESTED",
          labelNote: "NORMALIZED; widespread in compounds (e.g. Ísland)",
          grammar: "Nom./acc. sg. land; gen. lands; dat. landi. Strong neuter. Pl. lǫnd (u-umlaut).",
          clearSpeak: "LAHND",
          compare: null
        },
        {
          form: "vera",
          gloss: "to be",
          pos: "verb (anomalous)",
          label: "ATTESTED",
          labelNote: "NORMALIZED infinitive of the highly irregular verb ‘to be’",
          grammar: "Pres. ind. em, ert, er, erum, eruð, eru. Past var / váru. Essential copula — full paradigm in Lesson 3.",
          clearSpeak: "VEH-rah",
          compare: null
        },
        {
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
        }
      ]
    },
    {
      id: "practice-tips",
      title: "How to practise this lesson",
      html: `
        <ol class="scholar-list">
          <li>Read each special letter aloud with its conventional value (þ, ð, ǫ, æ, œ).</li>
          <li>Memorise the five vocabulary items with gender/part of speech and label.</li>
          <li>Complete the exercises below; unlock Lesson 2 only after they are marked complete.</li>
          <li>Missed items go to Spaced review for later recall.</li>
        </ol>
      `
    }
  ],

  exercises: [
    {
      id: "l1-e1",
      type: "multiple",
      prompt: "Which letter represents the voiced dental fricative (as in English <em>this</em>) in Classical ON orthography?",
      choices: [
        { id: "a", text: "þ (thorn)" },
        { id: "b", text: "ð (eth)" },
        { id: "c", text: "ǫ (o caudata)" },
        { id: "d", text: "æ (ash)" }
      ],
      answer: "b",
      hint: "Thorn þ is voiceless /θ/; eth ð is voiced /ð/.",
      explanation: "ð (eth) = /ð/. þ (thorn) = /θ/."
    },
    {
      id: "l1-e2",
      type: "multiple",
      prompt: "Where does primary stress fall in a native Old Norse word?",
      choices: [
        { id: "a", text: "On the final syllable" },
        { id: "b", text: "On the first syllable" },
        { id: "c", text: "On the penultimate syllable, as in Latin" },
        { id: "d", text: "Stress is free and unpredictable" }
      ],
      answer: "b",
      hint: "Germanic initial stress is the rule for native vocabulary.",
      explanation: "Primary stress falls on the first syllable."
    },
    {
      id: "l1-e3",
      type: "text",
      prompt: "Write the Classical ON noun meaning ‘man; person’ (nom. sg.), using ð if needed.",
      accept: ["maðr"],
      acceptNormalize: true,
      hint: "Consists of three consonants around a short a — ends in -r.",
      explanation: "maðr (m.) — ATTESTED / NORMALIZED. Not Modern Icelandic maður."
    },
    {
      id: "l1-e4",
      type: "text",
      prompt: "What is the infinitive ‘to be’ in Classical Old Norse?",
      accept: ["vera"],
      acceptNormalize: true,
      hint: "Anomalous verb; four letters.",
      explanation: "vera — ATTESTED / NORMALIZED infinitive."
    },
    {
      id: "l1-e5",
      type: "multiple",
      prompt: "The form <em>kona</em> ‘woman; wife’ is best labelled as:",
      choices: [
        { id: "a", text: "RECONSTRUCTED Proto-Norse only" },
        { id: "b", text: "ATTESTED (NORMALIZED classical form)" },
        { id: "c", text: "A Modern Icelandic word presented as Old Norse" },
        { id: "d", text: "An invented Viking-festival coinage" }
      ],
      answer: "b",
      hint: "Check the vocabulary labels in this lesson.",
      explanation: "kona is ATTESTED and taught in NORMALIZED classical form. We never invent fake Viking words."
    },
    {
      id: "l1-e6",
      type: "text",
      prompt: "Write the ON verb meaning ‘to be called / named’ (infinitive).",
      accept: ["heita"],
      acceptNormalize: true,
      hint: "Used in introductions: Ek … ‘I am called…’.",
      explanation: "heita — ATTESTED / NORMALIZED. Strong verb class VII."
    },
    {
      id: "l1-e7",
      type: "multiple",
      prompt: "True or false for this course: Modern Icelandic pronunciation of á as a diphthong [au] should be taught as Classical Old Norse without a warning label.",
      choices: [
        { id: "a", text: "True — they are the same language" },
        { id: "b", text: "False — that would present Modern Icelandic as Old Norse" }
      ],
      answer: "b",
      hint: "Re-read the charter and the length/stress section.",
      explanation: "False. Classical ON á is conventionally /ɑː/. Mod. Icel. diphthongization must be labelled MODERN ICELANDIC — NOT OLD NORSE."
    },
    {
      id: "l1-e8",
      type: "matching-note",
      prompt: "Match mentally: land — gender?",
      choices: [
        { id: "a", text: "Masculine" },
        { id: "b", text: "Feminine" },
        { id: "c", text: "Neuter" }
      ],
      answer: "c",
      hint: "Strong a-stem; nom. = acc. in the singular.",
      explanation: "land is neuter (n.). Pl. lǫnd shows u-umlaut."
    }
    ,
    {
      id: "l1-v1",
      type: "speak",
      prompt: "Pronounce thorn: þ",
      target: "þ",
      clearSpeak: "th as in thin",
      gloss: "voiceless dental fricative /θ/ (as in English thin)",
      label: "NORMALIZED",
      reconstructedNotes: "Target: clear /θ/ — tongue tip at teeth, continuous fricative, no /t/ or /d/ stop. Word-initial quality as in þing, þú (when you meet them later).",
      historicalCues: [
        "Continuous fricative, not a stop",
        "Voiceless (no vocal-fold buzz like ð)",
        "Dental place (thin, not sin)"
      ],
      rubricTips: [
        "Say English thin then isolate the first sound — that approximates ON þ.",
        "Do not substitute /f/ or /s/.",
        "This is a reconstructed Classical value, not Modern Icelandic coaching disguised as ON."
      ]
    },
    {
      id: "l1-v2",
      type: "speak",
      prompt: "Pronounce eth: ð",
      target: "ð",
      clearSpeak: "th as in this",
      gloss: "voiced dental fricative /ð/ (as in English this)",
      label: "NORMALIZED",
      reconstructedNotes: "Target: voiced /ð/. Contrast with þ. Medial/final eth appears in maðr, Óðinn.",
      historicalCues: [
        "Voiced fricative (vocal fold vibration)",
        "Same place as þ, different voicing",
        "Not a hard /d/ stop"
      ],
      rubricTips: [
        "English this → isolate ð.",
        "In maðr, ð is medial — keep it fricative between vowels/consonants.",
        "ASR will often mishear ð; ignore English ASR as ground truth."
      ]
    },
    {
      id: "l1-v3",
      type: "speak",
      prompt: "Describe and approximate ǫ (o caudata)",
      target: "ǫ",
      clearSpeak: "aw as in law, short and rounded",
      gloss: "open rounded back vowel /ɔ/ (often written ö in some editions)",
      label: "NORMALIZED",
      reconstructedNotes: "Say a short open o (as in many transcriptions of British not /ɒ/–/ɔ/, or roughly aw with lips rounded but short). Not Modern Icelandic ö-quality claimed as historical ON without a label.",
      historicalCues: [
        "Back, rounded, open-mid",
        "Short unless marked long in a given word",
        "Distinct from ó /oː/ and from a /a/"
      ],
      rubricTips: [
        "Practice the sound in isolation, then recall pl. lǫnd from land.",
        "Recording + self-rate is the goal; no historical ON TTS is claimed here."
      ]
    },
    {
      id: "l1-v4",
      type: "speak",
      prompt: "Length contrast: a (short) vs á (long)",
      target: "a — á",
      clearSpeak: "ah, short — then aa, long ah (hold longer, no ow diphthong)",
      gloss: "short /a/ vs long /ɑː/ (conventional Classical values)",
      label: "NORMALIZED",
      reconstructedNotes: "Hold á roughly twice as long as a. Classical á is taught as a long monophthong /ɑː/ — NOT the Modern Icelandic diphthong [au] unless labelled MODERN ICELANDIC — NOT OLD NORSE.",
      historicalCues: [
        "Same vowel quality family, different duration",
        "á held longer (≈ two beats vs one)",
        "No [au] diphthong for Classical ON á in this course"
      ],
      rubricTips: [
        "Tap once for a, twice-length for á.",
        "If you diphthongize, correct toward a steady long vowel for ON practice."
      ]
    },
    {
      id: "l1-v5",
      type: "speak",
      prompt: "Say: maðr",
      target: "maðr",
      clearSpeak: "MAHTH-r (th as in this)",
      gloss: "man; person",
      label: "ATTESTED",
      reconstructedNotes: "Stress on first (only) syllable. Short a. Medial ð as /ð/. Final -r pronounced as a morphological ending (not silent).",
      historicalCues: [
        "Initial stress",
        "ð fricative, not /d/",
        "Audible final -r"
      ],
      rubricTips: [
        "MAÐ-r — avoid Modern Icelandic maður as if it were the ON citation form.",
        "Self-check: length short on a; ð voiced; -r present."
      ]
    },
    {
      id: "l1-v6",
      type: "speak",
      prompt: "Say: kona",
      target: "kona",
      clearSpeak: "KOH-nah",
      gloss: "woman; wife",
      label: "ATTESTED",
      reconstructedNotes: "Two syllables; stress on ko-. Short vowels. Clear n.",
      historicalCues: [
        "Stress on first syllable",
        "Two clear syllables: KO-na",
        "No reduction of the final a to schwa as a required ON rule"
      ],
      rubricTips: [
        "Keep both vowels; do not swallow -a.",
        "ATTESTED / NORMALIZED weak feminine."
      ]
    },
    {
      id: "l1-v7",
      type: "speak",
      prompt: "Say: Þórr",
      target: "Þórr",
      clearSpeak: "THOR (th as in thin, long o)",
      gloss: "Thor (theonym)",
      label: "ATTESTED",
      reconstructedNotes: "Initial þ /θ/. Long ó /oː/. Double rr — hold/trilled or clearly lengthened r-quality per your dialect training; do not drop it. Stress initial.",
      historicalCues: [
        "þ not /t/ or /f/",
        "Long ó (duration)",
        "Final geminate/long r audible"
      ],
      rubricTips: [
        "ÞÓRR — thorn + long o + rr.",
        "Do not use Modern Icelandic citation as unmarked ON pronunciation coaching."
      ]
    },
    {
      id: "l1-v8",
      type: "speak",
      prompt: "Say: Óðinn",
      target: "Óðinn",
      clearSpeak: "OH-thin (th as in this)",
      gloss: "Odin (theonym)",
      label: "ATTESTED",
      reconstructedNotes: "Long Ó /oː/. Medial ð /ð/. Double nn. Stress on first syllable. NORMALIZED classical form of a thoroughly attested name.",
      historicalCues: [
        "Long initial Ó",
        "ð fricative (not /d/)",
        "Geminate nn — hold the n"
      ],
      rubricTips: [
        "Ó-ðinn — length on Ó; ð not d; nn doubled.",
        "ASR may output Odin/Othin; that is not a historical grade."
      ]
    }

  ]
};
