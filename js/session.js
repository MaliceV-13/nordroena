/**
 * Norðrœna — path session runner
 * One exercise at a time · progress bar · check · hearts · celebration
 */
(function (global) {
  const N = () => global.NORDRONA;

  let session = null;

  function escapeHtml(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function labelClass(label) {
    const L = String(label || "").toUpperCase();
    if (L === "ATTESTED") return "attested";
    if (L === "NORMALIZED") return "normalized";
    if (L === "RECONSTRUCTED") return "reconstructed";
    return "uncertain";
  }

  function start(levelId) {
    const found = N().path.findLevel(levelId);
    if (!found || !found.level.exercises || !found.level.exercises.length) {
      return { ok: false, reason: "missing" };
    }
    if (!N().progress.isLevelUnlocked(levelId)) {
      return { ok: false, reason: "locked" };
    }
    const heartsMax = N().path.heartsMax || 5;
    session = {
      levelId,
      level: found.level,
      unit: found.unit,
      section: found.section,
      exercises: found.level.exercises.slice(),
      index: 0,
      hearts: heartsMax,
      heartsMax,
      mistakes: 0,
      checked: false,
      lastCorrect: null,
      finished: false,
      skipIntro: false
    };
    N().progress.touchStreak();
    return { ok: true, session };
  }

  function getSession() {
    return session;
  }

  function currentExercise() {
    if (!session || session.finished) return null;
    // optional intro card as index -1 conceptually: handled by app via intro flag
    return session.exercises[session.index] || null;
  }

  function progressFraction() {
    if (!session) return 0;
    return session.exercises.length
      ? session.index / session.exercises.length
      : 0;
  }

  function ttsMini(form, clearSpeak) {
    const T = N().tts;
    const pron = T && T.getPron ? T.getPron(form) : null;
    if (!T || (!T.available() && !(pron && pron.src))) {
      return `<p class="muted">TTS unavailable — use clear cue: <code>${escapeHtml(clearSpeak || form)}</code></p>`;
    }
    const clear = clearSpeak || (T.buildClearCue && T.buildClearCue(form)) || form;
    if (pron && pron.src) {
      return `
      <div class="tts-box compact has-recon" data-speak-text="${escapeHtml(form)}" data-speak-clear="${escapeHtml(clear)}">
        <p class="tts-ipa"><span class="label reconstructed">Reconstructed</span> <span class="ipa" lang="und-fonipa">[${escapeHtml(pron.ipa)}]</span></p>
        ${T.RECON_NOTE_HTML || ""}
        <p class="tts-cue muted"><strong>Clear cue:</strong> <code>${escapeHtml(clear)}</code></p>
        <div class="tts-actions">
          <button type="button" class="btn play tts-play-clear">▶ Play reconstructed</button>
          <button type="button" class="btn ghost tts-slow">Play slow (0.7×)</button>
          <button type="button" class="btn ghost tts-ortho">Orthography</button>
          <button type="button" class="btn ghost tts-stop">Stop</button>
        </div>
      </div>`;
    }
    return `
      <div class="tts-box compact" data-speak-text="${escapeHtml(form)}" data-speak-clear="${escapeHtml(clear)}">
        ${T.DISCLAIMER_HTML || '<p class="tts-disclaimer">MODERN APPROXIMATION — NOT historical Old Norse speech</p>'}
        <p class="tts-cue muted"><strong>Clear cue:</strong> <code>${escapeHtml(clear)}</code></p>
        <div class="tts-actions">
          <button type="button" class="btn play tts-play-clear">▶ Play clear</button>
          <button type="button" class="btn ghost tts-slow">Play slow</button>
          <button type="button" class="btn ghost tts-ortho">Orthography</button>
          <button type="button" class="btn ghost tts-stop">Stop</button>
        </div>
      </div>`;
  }

  function renderExerciseHtml(ex) {
    if (!ex) return "";
    const type = ex.type;

    if (type === "lore") {
      return `
        <div class="sess-ex" data-type="lore">
          <h2>${escapeHtml(ex.title || "Reading")}</h2>
          <div class="lore-body">${ex.html || ""}</div>
          <p class="muted">Tap Continue when you have read this.</p>
        </div>`;
    }

    if (type === "speak") {
      const cues = (ex.historicalCues || [])
        .map(
          (c, i) =>
            `<label class="check-item"><input type="checkbox" class="self-rate" data-cue="${i}" /><span>${escapeHtml(c)}</span></label>`
        )
        .join("");
      const tips = (ex.rubricTips || []).map((t) => `<li>${escapeHtml(t)}</li>`).join("");
      return `
        <div class="sess-ex speak-block" data-type="speak" data-ex="${escapeHtml(ex.id)}">
          <p class="sess-prompt">${ex.prompt || "Say:"}</p>
          <p class="speak-target"><span class="lemma">${escapeHtml(ex.target)}</span>
            <span class="label ${labelClass(ex.label)}">${escapeHtml(ex.label || "NORMALIZED")}</span></p>
          <p class="gloss">${escapeHtml(ex.gloss || "")}</p>
          ${ex.clearSpeak ? `<p class="tts-cue muted"><strong>Clear speak:</strong> <code>${escapeHtml(ex.clearSpeak)}</code></p>` : ""}
          ${ex.reconstructedNotes ? `<div class="recon-notes callout info"><strong>Reconstructed notes</strong><p>${escapeHtml(ex.reconstructedNotes)}</p></div>` : ""}
          ${ttsMini(ex.target, ex.clearSpeak)}
          <div class="mic-panel" data-ex="${escapeHtml(ex.id)}">
            <p class="mic-explain">Record → playback → self-rate. Nothing is uploaded. ASR is never historical ground truth.</p>
            <div class="mic-status muted" data-role="status">Mic: not requested yet</div>
            <div class="mic-actions">
              <button type="button" class="btn primary mic-enable">Enable microphone</button>
              <button type="button" class="btn record-btn" disabled>Record</button>
              <button type="button" class="btn ghost playback-btn" disabled>Play my recording</button>
            </div>
            <div class="mic-denied callout warn" hidden>
              <strong>Microphone permission denied</strong>
              <p>Allow mic for this site, prefer localhost/HTTPS.</p>
            </div>
            <audio class="playback" controls hidden></audio>
          </div>
          <div class="self-rate-box">
            <h4>Self-rate</h4>
            ${cues}
            <ul class="rubric">${tips}</ul>
          </div>
        </div>`;
    }

    if (type === "tap_hear" || type === "listen_choice") {
      return `
        <div class="sess-ex" data-type="${type}">
          <p class="sess-prompt">${ex.prompt || "Tap what you hear"}</p>
          ${ttsMini(ex.audioForm, ex.clearSpeak)}
          <div class="choices big">
            ${(ex.choices || [])
              .map(
                (c) =>
                  `<button type="button" class="choice-btn" data-val="${escapeHtml(c.id)}">${c.text}</button>`
              )
              .join("")}
          </div>
        </div>`;
    }

    if (type === "multiple" || type === "truefalse" || type === "translate_on_en" || type === "matching-note") {
      return `
        <div class="sess-ex" data-type="${type}">
          <p class="sess-prompt">${ex.prompt}</p>
          <div class="choices big">
            ${(ex.choices || [])
              .map(
                (c) =>
                  `<button type="button" class="choice-btn" data-val="${escapeHtml(c.id)}">${c.text}</button>`
              )
              .join("")}
          </div>
        </div>`;
    }

    if (type === "text" || (type === "fill" && !ex.choices)) {
      return `
        <div class="sess-ex" data-type="${type}">
          <p class="sess-prompt">${ex.prompt}</p>
          <input type="text" class="text-answer sess-text" autocomplete="off" spellcheck="false" placeholder="Type answer…" />
        </div>`;
    }

    if (type === "fill" && ex.choices) {
      return `
        <div class="sess-ex" data-type="fill">
          <p class="sess-prompt">${ex.prompt}</p>
          <div class="choices big">
            ${(ex.choices || [])
              .map(
                (c) =>
                  `<button type="button" class="choice-btn" data-val="${escapeHtml(c.id)}" data-text="${escapeHtml(c.text)}">${c.text}</button>`
              )
              .join("")}
          </div>
        </div>`;
    }

    if (type === "tiles") {
      return `
        <div class="sess-ex" data-type="tiles">
          <p class="sess-prompt">${escapeHtml(ex.prompt)}</p>
          <div class="tile-answer muted" data-role="tile-out">(tap a tile)</div>
          <div class="tile-bank">
            ${(ex.tiles || [])
              .map(
                (t) =>
                  `<button type="button" class="tile-btn" data-val="${escapeHtml(t)}">${escapeHtml(t)}</button>`
              )
              .join("")}
          </div>
        </div>`;
    }

    if (type === "match") {
      const rights = (ex.pairs || []).map((p) => p.right);
      // shuffle copy
      const shuffled = rights.slice().sort(() => Math.random() - 0.5);
      return `
        <div class="sess-ex" data-type="match">
          <p class="sess-prompt">${escapeHtml(ex.prompt || "Match pairs")}</p>
          <div class="match-grid">
            ${(ex.pairs || [])
              .map(
                (p, i) => `
              <div class="match-row" data-left="${escapeHtml(p.left)}">
                <span class="match-left">${escapeHtml(p.left)}</span>
                <select class="match-select">
                  <option value="">—</option>
                  ${shuffled
                    .map((r) => `<option value="${escapeHtml(r)}">${escapeHtml(r)}</option>`)
                    .join("")}
                </select>
              </div>`
              )
              .join("")}
          </div>
        </div>`;
    }

    return `<div class="sess-ex"><p>Unsupported type: ${escapeHtml(type)}</p></div>`;
  }

  function collectAnswer(root, ex) {
    if (!ex) return null;
    const type = ex.type;
    if (type === "lore" || type === "speak") return "__continue__";
    if (type === "tiles") {
      const out = root.querySelector("[data-role='tile-out']");
      const v = out && out.getAttribute("data-val");
      return v || "";
    }
    if (type === "match") {
      const map = {};
      root.querySelectorAll(".match-row").forEach((row) => {
        const left = row.getAttribute("data-left");
        const sel = row.querySelector("select");
        map[left] = sel ? sel.value : "";
      });
      return map;
    }
    if (type === "text" || (type === "fill" && !ex.choices)) {
      const inp = root.querySelector(".sess-text");
      return inp ? inp.value : "";
    }
    const selected = root.querySelector(".choice-btn.selected");
    if (!selected) return null;
    if (type === "fill" && ex.choices) {
      return selected.getAttribute("data-val");
    }
    return selected.getAttribute("data-val");
  }

  function check(root) {
    if (!session || session.finished) return { ok: false };
    const ex = currentExercise();
    if (!ex) return { ok: false };

    if (ex.type === "lore") {
      session.checked = true;
      session.lastCorrect = true;
      return { ok: true, correct: true, explanation: "", auto: true };
    }

    if (ex.type === "speak") {
      // require at least one self-rate OR allow continue after viewing
      const checks = root.querySelectorAll(".self-rate:checked");
      const had = checks.length > 0;
      N().progress.markVoice(ex.id, {
        selfRatings: {},
        hadRecording: !!(N().voice && N().voice.getLastUrl && N().voice.getLastUrl()),
        checklistSubmitted: had || true
      });
      session.checked = true;
      session.lastCorrect = true;
      return { ok: true, correct: true, explanation: "Self-rate saved. Continue.", speak: true };
    }

    const answer = collectAnswer(root, ex);
    if (answer == null || answer === "") {
      return { ok: false, reason: "empty" };
    }

    const result = N().exercises.gradeWritten(ex, answer);
    session.checked = true;
    session.lastCorrect = !!result.correct;

    if (!result.correct) {
      session.mistakes += 1;
      session.hearts = Math.max(0, session.hearts - 1);
      N().progress.addToReview({
        id: ex.id,
        levelId: session.levelId,
        prompt: ex.prompt,
        answer: result.expected,
        explanation: result.explanation
      });
    }

    return {
      ok: true,
      correct: result.correct,
      explanation: result.explanation,
      hint: result.hint,
      expected: result.expected,
      hearts: session.hearts,
      dead: session.hearts <= 0
    };
  }

  function advance() {
    if (!session) return { done: true };
    if (session.hearts <= 0) {
      session.finished = true;
      return { done: true, failed: true, mistakes: session.mistakes };
    }
    session.index += 1;
    session.checked = false;
    session.lastCorrect = null;
    if (session.index >= session.exercises.length) {
      session.finished = true;
      const perfect = session.mistakes === 0;
      N().progress.completeLevel(session.levelId, {
        perfect,
        mistakes: session.mistakes
      });
      return {
        done: true,
        perfect,
        mistakes: session.mistakes,
        xp: perfect ? N().path.xpPerPerfect || 15 : N().path.xpPerLevel || 10,
        nextId: N().progress.getContinueLevelId()
      };
    }
    return { done: false, index: session.index };
  }

  function abandon() {
    session = null;
  }

  function renderShell(showIntro) {
    if (!session) return "";
    const lv = session.level;
    const frac = progressFraction();
    const pct = Math.round(frac * 100);
    const hearts = "♥".repeat(session.hearts) + "♡".repeat(Math.max(0, session.heartsMax - session.hearts));

    if (showIntro && lv.intro && session.index === 0 && !session.skipIntro && !session._introDone) {
      return `
        <div class="session-view">
          <div class="sess-top">
            <button type="button" class="btn ghost sess-quit" title="Quit">✕</button>
            <div class="sess-bar"><div class="sess-bar-fill" style="width:${pct}%"></div></div>
            <div class="sess-hearts" title="Mistake budget">${hearts}</div>
          </div>
          <div class="sess-body intro-card">
            <p class="eyebrow">${escapeHtml(lv.type)} · ${escapeHtml(session.unit.title)}</p>
            <h1>${escapeHtml(lv.intro.title || lv.title)}</h1>
            <div class="intro-html">${lv.intro.html || ""}</div>
            <button type="button" class="btn primary sess-start-ex">Start exercises</button>
          </div>
        </div>`;
    }

    if (session.finished) {
      return ""; // app shows celebration
    }

    const ex = currentExercise();
    return `
      <div class="session-view">
        <div class="sess-top">
          <button type="button" class="btn ghost sess-quit" title="Quit">✕</button>
          <div class="sess-bar"><div class="sess-bar-fill" style="width:${pct}%"></div></div>
          <div class="sess-hearts" title="Mistake budget">${hearts}</div>
        </div>
        <div class="sess-body" id="sess-exercise">
          ${renderExerciseHtml(ex)}
        </div>
        <div class="sess-feedback" id="sess-feedback" hidden></div>
        <div class="sess-footer">
          <button type="button" class="btn primary sess-check" id="sess-check">Check</button>
          <button type="button" class="btn primary sess-continue" id="sess-continue" hidden>Continue</button>
        </div>
      </div>`;
  }

  function markIntroDone() {
    if (session) session._introDone = true;
  }

  global.NORDRONA = global.NORDRONA || {};
  global.NORDRONA.session = {
    start,
    getSession,
    currentExercise,
    progressFraction,
    renderShell,
    renderExerciseHtml,
    collectAnswer,
    check,
    advance,
    abandon,
    markIntroDone,
    ttsMini,
    escapeHtml,
    labelClass
  };
})(window);
