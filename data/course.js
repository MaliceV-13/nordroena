/**
 * Norðrœna — Course metadata & charter
 * Historical Old West Norse / Classical normalized Old Norse
 */
window.NORDRONA = window.NORDRONA || {};

window.NORDRONA.course = {
  title: "Norðrœna",
  subtitle: "Old Norse Course",
  tagline: "A progressive path course in historical Old West Norse",
  version: "0.2.0",

  charter: {
    targetLanguage: {
      name: "Old West Norse (Classical / normalized)",
      period: "c. 1150–1350",
      description:
        "The language of the Icelandic Family Sagas, Eddic and skaldic poetry in manuscript tradition, and early Norwegian diplomas — as reconstructed and normalized by modern philology. We teach Classical Old Norse (norrœna) as used in scholarly editions: normalized orthography reflecting a West Norse dialect continuum, not a living vernacular."
    },
    notModernIcelandic: {
      warning: "MODERN ICELANDIC — NOT OLD NORSE",
      points: [
        "Modern Icelandic (íslenska) is a living language that descends from Old Norse but has changed in phonology, morphology, lexicon, and orthographic convention.",
        "We never present Modern Icelandic forms as Old Norse. Occasional comparisons appear only with an explicit label: MODERN ICELANDIC — NOT OLD NORSE.",
        "Example: ON maðr ‘man’ vs Modern Icelandic maður — related, not identical in form or historical status."
      ]
    },
    oldNorwegian: {
      title: "Old Norwegian & the West Norse continuum",
      text:
        "Old West Norse includes Icelandic and Norwegian manuscript traditions. Classical normalized Old Norse (the ‘saga language’ of textbooks) is largely based on 13th-century Icelandic orthography and morphology, with Norwegian variants noted where pedagogically useful. This course prioritizes the classical normalized system used in Grønbech, Gordon, Zoëga, and Cleasby–Vigfusson conventions."
    },
    sources: {
      title: "Scholarly sources & method",
      items: [
        "Normalized Classical Old Norse as in standard grammars and dictionaries (e.g. Gordon, Noreen, Zoëga).",
        "Manuscript-attested vocabulary preferred; reconstructed or uncertain forms always labelled.",
        "Phonology presented as a scholarly reconstruction of Classical ON sound values — not Modern Icelandic pronunciation dressed as Old Norse.",
        "No invented ‘Viking’ vocabulary. Every lemma is attested, normalized from attestation, or explicitly marked reconstructed/uncertain."
      ]
    },
    pronunciationHonesty: {
      title: "Pronunciation honesty",
      text:
        "We cannot hear 13th-century speakers. Values taught here are the conventional academic reconstruction used in philology classrooms. Length, stress, and key consonants (þ, ð, etc.) are taught carefully. Where Modern Icelandic pronunciation differs, we say so and label it clearly."
    },
    labels: {
      title: "Vocabulary labels (required)",
      items: [
        { code: "ATTESTED", meaning: "Form directly supported by manuscript evidence in the relevant period." },
        { code: "NORMALIZED", meaning: "Spelling regularized to classical editorial orthography from attested variants." },
        { code: "RECONSTRUCTED", meaning: "Form inferred by comparative method; not directly attested in this shape." },
        { code: "uncertain", meaning: "Meaning, form, or status debated; treat with caution." }
      ]
    },
    parallelTracks: [
      {
        id: "futhark",
        title: "Elder Futhark (parallel track)",
        note: "Migration-Period / early Proto-Norse runes. Not the script of saga manuscripts. Open via nav."
      }
    ],
    roadmap: [
      { id: 1, title: "Historical ON & the sound system", status: "available" },
      { id: 2, title: "Nouns I: strong masculines & articles", status: "placeholder" },
      { id: 3, title: "Verbs I: vera, heita & present indicative", status: "placeholder" },
      { id: 4, title: "Nouns II: feminines & neuters", status: "planned" },
      { id: 5, title: "Case & simple sentences", status: "planned" },
      { id: 6, title: "Adjectives & agreement", status: "planned" },
      { id: 7, title: "Past tense & saga reading I", status: "planned" }
    ]
  },

  lessons: [
    { id: 1, slug: "lesson-1", title: "Historical ON & the sound system", file: "lesson1" },
    { id: 2, slug: "lesson-2", title: "Nouns I: strong masculines & articles", file: "lesson2" },
    { id: 3, slug: "lesson-3", title: "Verbs I: vera, heita & present indicative", file: "lesson3" }
  ]
};
