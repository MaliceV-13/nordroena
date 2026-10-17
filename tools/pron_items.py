"""Reconstructed pronunciation items for Norðrœna (Classical Old West Norse, c. 1200, normalized spelling).

IPA conventions (mainstream reconstruction, cf. Haugen, Gordon/Taylor, Barnes):
  * stress on the first syllable of every lexical word
  * long vowels written ː and held clearly longer: á [aː], é [eː], í [iː], ó [oː], ú [uː], ý [yː], æ [ɛː], œ [øː]
  * ǫ [ɔ]; ø [ø]; y [y]; diphthongs ei [ei], ey [øy], au [ɔu]
  * þ [θ] (word-initial), ð [ð]; s always [s]; f between vowels / finally [v]; medial and final g [ɣ]
  * r rolled/tapped [r]; final -r after a consonant syllabic [r̩] (maðr, Baldr, Miðgarðr)
  * double consonants held long: nn [nː], tt [tː], rr [rː]
  * v written [w] throughout (an equally mainstream choice is [v]; this course uses [w] consistently); hv [hw]
  * hl [hl] (initial h before l/n/r still pronounced c. 1200)
The reconstruction follows mainstream scholarly conventions such as those taught by Old Norse
specialists like Dr. Jackson Crawford; no endorsement is implied, and no recording of any person was used.
"""

# (text exactly as the app shows it, file slug, IPA, kind, short learner note)
ITEMS = [
    ("maðr", "madr", "ˈmaðr̩", "word", "ð as in 'this'; final -r syllabic after the consonant"),
    ("kona", "kona", "ˈkona", "word", "short o, both vowels full"),
    ("land", "land", "ˈland", "word", "short a as in 'father' but short"),
    ("vera", "vera", "ˈwera", "word", "v as [w]; short e; tapped r"),
    ("heita", "heita", "ˈheita", "word", "ei is a diphthong [ei]"),
    ("þ", "thorn", "θ", "sound", "þ = [θ] as in 'thin'"),
    ("ð", "eth", "ð", "sound", "ð = [ð] as in 'this'"),
    ("ǫ", "o-ogonek", "ɔ", "sound", "ǫ = open [ɔ] as in British 'lot'"),
    ("a — á", "a-vs-aa", "a — aː", "pair", "short a, then long á (length is meaning)"),
    ("Þórr", "thorr", "ˈθoːrː", "word", "long ó; rr held long and rolled"),
    ("Óðinn", "odinn", "ˈoːðinː", "word", "long ó; ð voiced; nn held long"),
    # reference / spot-check words
    ("þú", "thu", "ˈθuː", "word", "long ú"),
    ("ðér", "ther", "ˈðeːr", "word", "unstressed-pronoun spelling with ð; long é"),
    ("hǫnd", "hond", "ˈhɔnd", "word", "ǫ = [ɔ]"),
    ("guð", "gud", "ˈɡuð", "word", "short u; final ð"),
    ("fjǫrðr", "fjordr", "ˈfjɔrðr̩", "word", "ǫ [ɔ]; syllabic final -r"),
    ("hlæja", "hlaeja", "ˈhlɛːja", "word", "initial h still sounded before l; æ = long [ɛː]"),
    ("skógr", "skogr", "ˈskoːɣr̩", "word", "medial g = [ɣ]; syllabic final -r"),
    ("øx", "ox", "ˈøks", "word", "ø rounded front vowel; x = [ks]"),
    ("ætt", "aett", "ˈɛːtː", "word", "long æ; tt held long (no pre-aspiration)"),
    ("nótt", "nott", "ˈnoːtː", "word", "long ó; tt held long"),
    ("bróðir", "brodir", "ˈbroːðir", "word", "long ó; ð voiced"),
    ("mjǫk", "mjok", "ˈmjɔk", "word", "ǫ = [ɔ]"),
    ("dagr", "dagr", "ˈdaɣr̩", "word", "g = [ɣ] after a vowel; syllabic final -r"),
    ("Ek heiti Óðinn. Hvat heitir þú?", "phrase-ek-heiti", "ek ˈheiti ˈoːðinː ‖ ˈhwat ˈheitir ˈθuː", "phrase", "'I am called Óðinn. What are you called?'"),
    ("Deyr fé, deyja frændr", "phrase-deyr-fe", "ˈdøyr ˈfeː ‖ ˈdøyja ˈfrɛːndr̩", "phrase", "Hávamál 76: 'Cattle die, kinsmen die'"),
]
APP_KEYS = {"maðr", "kona", "land", "vera", "heita", "þ", "ð", "ǫ", "a — á", "Þórr", "Óðinn"}
