/**
 * Norðrœna — Text-to-speech / listen mode
 *
 * Clear mode (default): speaks English-friendly phonetic cue strings with
 * clear English voices — pedagogical approximations for intelligibility.
 * Orthography mode: speaks raw ON letters with a Nordic/Icelandic voice
 * when available — still a MODERN APPROXIMATION, not historical ON.
 *
 * Clear cues are NOT historical Old Norse pronunciation.
 */
(function (global) {
  const RATE_KEY = "nordrona_tts_rate_v1";
  const MODE_KEY = "nordrona_tts_mode_v1";
  const VOICE_KEY = "nordrona_tts_voice_v1";

  const MIN_RATE = 0.4;
  const MAX_RATE = 1.5;
  const DEFAULT_RATE = 0.68;
  const SLOW_RATE = 0.45;
  const DEFAULT_PITCH = 1.05;
  const DEFAULT_MODE = "clear"; // "clear" | "ortho"

  let lastVoiceInfo = { name: null, lang: null, mode: DEFAULT_MODE };

  function available() {
    return !!(global.speechSynthesis && global.SpeechSynthesisUtterance);
  }

  function clampRate(r) {
    const n = Number(r);
    if (Number.isNaN(n)) return DEFAULT_RATE;
    return Math.min(MAX_RATE, Math.max(MIN_RATE, n));
  }

  function getRate() {
    try {
      const v = localStorage.getItem(RATE_KEY);
      if (v == null) return DEFAULT_RATE;
      return clampRate(v);
    } catch (e) {
      return DEFAULT_RATE;
    }
  }

  function setRate(r) {
    const rate = clampRate(r);
    try {
      localStorage.setItem(RATE_KEY, String(rate));
    } catch (e) {}
    return rate;
  }

  function getMode() {
    try {
      const m = localStorage.getItem(MODE_KEY);
      if (m === "ortho" || m === "clear") return m;
    } catch (e) {}
    return DEFAULT_MODE;
  }

  function setMode(m) {
    const mode = m === "ortho" ? "ortho" : "clear";
    try {
      localStorage.setItem(MODE_KEY, mode);
    } catch (e) {}
    return mode;
  }

  function getPreferredVoiceName() {
    try {
      return localStorage.getItem(VOICE_KEY) || "";
    } catch (e) {
      return "";
    }
  }

  function setPreferredVoiceName(name) {
    try {
      if (name) localStorage.setItem(VOICE_KEY, String(name));
      else localStorage.removeItem(VOICE_KEY);
    } catch (e) {}
    return name || "";
  }

  function ensureVoicesLoaded() {
    return new Promise((resolve) => {
      if (!available()) {
        resolve([]);
        return;
      }
      const existing = speechSynthesis.getVoices();
      if (existing && existing.length) {
        resolve(existing);
        return;
      }
      const onVoices = () => {
        speechSynthesis.removeEventListener("voiceschanged", onVoices);
        resolve(speechSynthesis.getVoices() || []);
      };
      speechSynthesis.addEventListener("voiceschanged", onVoices);
      setTimeout(() => resolve(speechSynthesis.getVoices() || []), 600);
    });
  }

  function scoreClearVoice(v) {
    const name = v.name || "";
    const lang = (v.lang || "").toLowerCase();
    let score = 0;
    // Strong prefer clear English voices
    if (/google/i.test(name) && /en(-|_|$)/i.test(lang)) score += 100;
    if (/Samantha/i.test(name)) score += 95;
    if (/Microsoft\s+(Aria|Zira|David|Guy|Jenny)/i.test(name)) score += 90;
    if (/Enhanced/i.test(name) && /^en/i.test(lang)) score += 85;
    if (/Siri|Alex|Daniel|Karen|Moira|Tessa|Fiona|Victoria/i.test(name) && /^en/i.test(lang))
      score += 80;
    if (/^en(-us)/i.test(lang)) score += 40;
    if (/^en(-gb)/i.test(lang)) score += 38;
    if (/^en/i.test(lang)) score += 30;
    // Penalize muffled compact / Nordic for Clear mode
    if (/compact|premium compact/i.test(name)) score -= 50;
    if (/icelandic|^is(-|$)/i.test(name + " " + lang)) score -= 80;
    if (/norwegian|swedish|danish|^nb|^nn|^sv|^da/i.test(name + " " + lang)) score -= 20;
    return score;
  }

  function scoreOrthoVoice(v) {
    const name = v.name || "";
    const lang = (v.lang || "").toLowerCase();
    let score = 0;
    if (/^is(-|$)/i.test(lang) || /icelandic/i.test(name)) score += 100;
    if (/^nb|^nn/i.test(lang) || /norwegian/i.test(name)) score += 70;
    if (/^sv/i.test(lang) || /swedish/i.test(name)) score += 60;
    if (/^da/i.test(lang) || /danish/i.test(name)) score += 55;
    if (/^de/i.test(lang)) score += 30;
    if (/^en/i.test(lang)) score += 10;
    if (/compact/i.test(name)) score -= 15;
    return score;
  }

  function pickVoice(mode) {
    if (!available()) return null;
    const voices = speechSynthesis.getVoices() || [];
    if (!voices.length) return null;
    const preferred = getPreferredVoiceName();
    if (preferred) {
      const hit = voices.find((v) => v.name === preferred);
      if (hit) {
        // Still respect mode preference loosely: if user saved a voice, use it
        return hit;
      }
    }
    const scorer = mode === "ortho" ? scoreOrthoVoice : scoreClearVoice;
    let best = null;
    let bestScore = -Infinity;
    for (const v of voices) {
      const s = scorer(v);
      if (s > bestScore) {
        bestScore = s;
        best = v;
      }
    }
    return best || voices[0] || null;
  }

  /**
   * Fallback transliterator: ON orthography → English-friendly phonetic cue.
   * Pedagogical only — NOT historical ON.
   */
  function buildClearCue(onText) {
    if (onText == null) return "";
    let s = String(onText).trim();
    if (!s) return "";

    // Single-letter drills
    const singles = {
      þ: "th as in thin",
      Þ: "th as in thin",
      ð: "th as in this",
      Ð: "th as in this",
      ǫ: "aw as in law, short",
      Ǫ: "aw as in law, short",
      æ: "ai as in fair, or eh",
      Æ: "ai as in fair, or eh",
      œ: "ur as in French peu, rounded",
      Œ: "ur as in French peu, rounded",
      á: "aa, long ah",
      Á: "aa, long ah",
      a: "ah, short",
      A: "ah, short",
      é: "eh, long",
      É: "eh, long",
      í: "ee, long",
      Í: "ee, long",
      ó: "oh, long",
      Ó: "oh, long",
      ú: "oo, long",
      Ú: "oo, long",
      ý: "ee, long front",
      Ý: "ee, long front",
      ø: "ur rounded",
      Ø: "ur rounded",
      ö: "ur rounded short"
    };
    if (singles[s] != null && s.length === 1) return singles[s];

    // Contrast pair a — á
    if (/^a\s*[—–\-]\s*á$/i.test(s) || /^a\s+á$/i.test(s)) {
      return "ah, short — then aa, long ah (hold longer, no ow diphthong)";
    }

    // Known multi-char map (case-insensitive keys normalized)
    const known = {
      maðr: "MAHTH-r (th as in this)",
      kona: "KOH-nah",
      land: "LAHND",
      vera: "VEH-rah",
      heita: "HAY-tah",
      þórr: "THOR (th as in thin, long o)",
      óðinn: "OH-thin (th as in this)",
      lǫnd: "LAWND",
      þing: "THING (th as in thin)",
      þú: "THOO (th as in thin)"
    };
    const key = s.toLowerCase();
    if (known[key]) return known[key];

    // Generic transliteration
    let out = "";
    const chars = Array.from(s);
    for (let i = 0; i < chars.length; i++) {
      const c = chars[i];
      const lower = c.toLowerCase();
      const map = {
        þ: "th",
        ð: "dh",
        ǫ: "aw",
        æ: "ai",
        œ: "ur",
        á: "aa",
        é: "eh",
        í: "ee",
        ó: "oh",
        ú: "oo",
        ý: "ee",
        ø: "ur",
        ö: "ur",
        j: "y",
        "—": " — ",
        "–": " — ",
        "-": "-"
      };
      if (map[lower] != null) {
        const piece = map[lower];
        // Preserve rough casing for first letter of word
        out += c === c.toUpperCase() && /[a-z]/i.test(piece) ? piece.toUpperCase() : piece;
      } else {
        out += c;
      }
    }

    // Heuristic syllable spacing: insert spaces around vowel clusters
    out = out
      .replace(/([bcdfghjklmnpqrstvwxzBCDFGHJKLMNPQRSTVWXZ])([aeiouyAEIOUY])/g, "$1 $2")
      .replace(/([aeiouyAEIOUY]{1,3})([bcdfghjklmnpqrstvwxzBCDFGHJKLMNPQRSTVWXZ]{1,2})(?=[aeiouyAEIOUY])/g, "$1$2, ")
      .replace(/\s+/g, " ")
      .trim();

    // Soften dh → "th(this)" cue hint in parentheses once if present
    if (/\bdh\b/i.test(out) || /dh/i.test(out)) {
      out = out.replace(/dh/gi, "th") + " (th as in this)";
    } else if (/\bth\b/i.test(out) || /^th/i.test(out) || / th/i.test(out)) {
      // leave; caller may have thorn
    }

    return out || s;
  }

  /** Split cue into syllable-ish chunks for slow playback. */
  function splitSyllables(cue) {
    const s = String(cue || "").trim();
    if (!s) return [];
    // Pull trailing parenthetical gloss into its own final chunk
    let main = s;
    let gloss = "";
    const gm = s.match(/^(.*?)\s*(\([^)]*\))\s*$/);
    if (gm) {
      main = gm[1].trim();
      gloss = gm[2].trim();
    }
    let parts = [];
    if (main) {
      // Split on commas, em/en dashes, or hyphens between syllable tokens
      parts = main
        .split(/\s*[—,;]\s*|\s+-\s+|-(?=[A-Za-zÀ-ÖØ-öø-ÿ])/)
        .map((p) => p.trim())
        .filter(Boolean);
      if (parts.length <= 1 && /\s/.test(main)) {
        parts = main.split(/\s+/).filter(Boolean);
      }
    }
    if (gloss) parts.push(gloss);
    return parts.length ? parts : [s];
  }

  function pause(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  function speakUtterance(text, opts) {
    opts = opts || {};
    return new Promise((resolve) => {
      const u = new SpeechSynthesisUtterance(String(text));
      u.rate = clampRate(opts.rate != null ? opts.rate : getRate());
      u.pitch = opts.pitch != null ? opts.pitch : DEFAULT_PITCH;
      u.volume = opts.volume != null ? opts.volume : 1;
      const voice = opts.voice || null;
      if (voice) {
        u.voice = voice;
        u.lang = voice.lang || opts.lang || "en-US";
      } else {
        u.lang = opts.lang || "en-US";
      }
      u.onend = () => resolve({ ok: true });
      u.onerror = () => resolve({ ok: false, reason: "error" });
      speechSynthesis.speak(u);
    });
  }

  /**
   * @param {object} opts
   *   text / onText — raw ON orthography
   *   clearCue — phonetic cue string (preferred in clear mode)
   *   mode — "clear" | "ortho" (default getMode())
   *   rate — override rate
   *   slow — if true, use SLOW_RATE and syllable-by-syllable in clear mode
   *   syllables — force syllable-by-syllable
   */
  async function speak(textOrOpts, maybeOpts) {
    let opts;
    if (textOrOpts && typeof textOrOpts === "object" && !Array.isArray(textOrOpts)) {
      opts = Object.assign({}, textOrOpts);
    } else {
      opts = Object.assign({}, maybeOpts || {}, { text: textOrOpts });
    }

    if (!available()) {
      return {
        ok: false,
        reason: "unavailable",
        message:
          "speechSynthesis is not available in this browser. Use the reconstructed IPA/notes beside each item, or try Chrome/Firefox/Safari on a desktop."
      };
    }

    await ensureVoicesLoaded();
    speechSynthesis.cancel();
    await pause(80);

    const mode = opts.mode || getMode();
    const onText = opts.onText != null ? opts.onText : opts.text;
    let clearCue =
      opts.clearCue != null && String(opts.clearCue).trim()
        ? String(opts.clearCue).trim()
        : buildClearCue(onText);

    const slow = !!opts.slow;
    const useSyllables = slow || !!opts.syllables;
    const rate = clampRate(
      opts.rate != null ? opts.rate : slow ? SLOW_RATE : getRate()
    );

    const voice = pickVoice(mode);
    lastVoiceInfo = {
      name: voice ? voice.name : null,
      lang: voice ? voice.lang : mode === "clear" ? "en-US" : "is-IS",
      mode
    };
    if (voice && voice.name) setPreferredVoiceName(voice.name);

    const speakText = mode === "ortho" ? String(onText || "") : clearCue;
    if (!speakText) {
      return { ok: false, reason: "empty", message: "Nothing to speak." };
    }

    const disclaimer =
      "MODERN APPROXIMATION — NOT historical Old Norse speech. Clear cues are English phonetic approximations for ear training; Orthography mode uses modern browser voices on raw letters. Neither is a medieval recording.";

    try {
      if (mode === "clear" && useSyllables) {
        const parts = splitSyllables(clearCue);
        for (let i = 0; i < parts.length; i++) {
          if (!available()) break;
          // Cancel-check: if user hit stop, speechSynthesis.pending/speaking may be false after cancel
          const r = await speakUtterance(parts[i], {
            rate,
            pitch: DEFAULT_PITCH,
            volume: 1,
            voice,
            lang: voice ? voice.lang : "en-US"
          });
          if (!r.ok) break;
          if (i < parts.length - 1) await pause(220);
        }
      } else {
        await speakUtterance(speakText, {
          rate,
          pitch: DEFAULT_PITCH,
          volume: 1,
          voice,
          lang:
            voice && voice.lang
              ? voice.lang
              : mode === "ortho"
                ? "is-IS"
                : "en-US"
        });
      }

      if (opts.onend) opts.onend();
      return {
        ok: true,
        rate,
        mode,
        voiceName: lastVoiceInfo.name,
        voiceLang: lastVoiceInfo.lang,
        spokenText: speakText,
        disclaimer
      };
    } catch (e) {
      if (opts.onerror) opts.onerror(e);
      return {
        ok: false,
        reason: "error",
        message: "TTS playback failed. Rely on reconstructed notes."
      };
    }
  }

  function stop() {
    if (available()) speechSynthesis.cancel();
  }

  function speakClear(onText, clearCue, opts) {
    return speak(
      Object.assign({}, opts || {}, {
        onText,
        clearCue,
        mode: "clear",
        slow: false
      })
    );
  }

  function speakSlow(onText, clearCue, opts) {
    return speak(
      Object.assign({}, opts || {}, {
        onText,
        clearCue,
        mode: "clear",
        slow: true,
        syllables: true
      })
    );
  }

  function speakOrtho(onText, opts) {
    return speak(
      Object.assign({}, opts || {}, {
        onText,
        text: onText,
        mode: "ortho"
      })
    );
  }

  function getLastVoiceInfo() {
    return Object.assign({}, lastVoiceInfo);
  }

  const DISCLAIMER_HTML =
    '<p class="tts-disclaimer"><strong>MODERN APPROXIMATION — NOT historical Old Norse speech.</strong> Clear playback uses English phonetic cues for intelligibility (not historical ON). Orthography mode reads raw letters with a modern Nordic/English voice. Compare with reconstructed IPA/notes.</p>';

  const CLEAR_NOTE_HTML =
    '<p class="tts-clear-note muted">Clear playback uses English phonetic cues for intelligibility; compare with reconstructed notes. Cues are pedagogical approximations — not claims of historical Old Norse speech.</p>';

  global.NORDRONA = global.NORDRONA || {};
  global.NORDRONA.tts = {
    available,
    getRate,
    setRate,
    clampRate,
    getMode,
    setMode,
    getPreferredVoiceName,
    setPreferredVoiceName,
    pickVoice,
    ensureVoicesLoaded,
    buildClearCue,
    splitSyllables,
    speak,
    speakClear,
    speakSlow,
    speakOrtho,
    stop,
    getLastVoiceInfo,
    DISCLAIMER_HTML,
    CLEAR_NOTE_HTML,
    MIN_RATE,
    MAX_RATE,
    DEFAULT_RATE,
    SLOW_RATE,
    DEFAULT_PITCH,
    RATE_KEY,
    MODE_KEY,
    VOICE_KEY
  };
})(window);
