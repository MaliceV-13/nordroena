/**
 * Norðrœna — path SPA (Duolingo-style pedagogy, scholarly ON content)
 */
(function () {
  const $ = (sel, el) => (el || document).querySelector(sel);
  const $$ = (sel, el) => Array.from((el || document).querySelectorAll(sel));

  const state = {
    view: "home",
    levelId: null,
    sessionActive: false,
    showIntro: true,
    celebrate: null,
    failed: null
  };

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

  function navigate(view, levelId) {
    state.view = view;
    state.levelId = levelId || null;
    if (view !== "session") {
      state.sessionActive = false;
      state.celebrate = null;
      state.failed = null;
    }
    const hash = levelId ? `#/${view}/${levelId}` : `#/${view}`;
    if (location.hash !== hash) location.hash = hash;
    else render();
  }

  function parseHash() {
    const h = (location.hash || "#/home").replace(/^#\/?/, "");
    const parts = h.split("/");
    state.view = parts[0] || "home";
    state.levelId = parts[1] || null;
  }

  function bindTts(root) {
    const T = NORDRONA.tts;
    if (!T) return;
    $$(".tts-box", root).forEach((box) => {
      const text = box.getAttribute("data-speak-text");
      const clear = box.getAttribute("data-speak-clear") || "";
      const playClear = $(".tts-play-clear", box);
      if (playClear) {
        playClear.addEventListener("click", async () => {
          T.setMode("clear");
          await T.speakClear(text, clear);
        });
      }
      const slow = $(".tts-slow", box);
      if (slow) {
        slow.addEventListener("click", async () => {
          T.setMode("clear");
          await T.speakSlow(text, clear);
        });
      }
      const ortho = $(".tts-ortho", box);
      if (ortho) {
        ortho.addEventListener("click", async () => {
          T.setMode("ortho");
          await T.speakOrtho(text);
        });
      }
      const stop = $(".tts-stop", box);
      if (stop) stop.addEventListener("click", () => T.stop());
    });
  }

  function bindMic(root) {
    const V = NORDRONA.voice;
    if (!V) return;
    $$(".mic-panel", root).forEach((panel) => {
      const status = $('[data-role="status"]', panel);
      const denied = $(".mic-denied", panel);
      const enable = $(".mic-enable", panel);
      const record = $(".record-btn", panel);
      const playback = $(".playback-btn", panel);
      const audio = $(".playback", panel);
      let recording = false;

      if (enable) {
        enable.addEventListener("click", async () => {
          const res = await V.requestMic();
          if (res.ok) {
            if (status) status.textContent = "Mic: ready";
            if (record) record.disabled = false;
            if (denied) denied.hidden = true;
          } else {
            if (status) status.textContent = "Mic: " + (res.reason || "denied");
            if (denied) denied.hidden = false;
          }
        });
      }
      if (record) {
        record.addEventListener("click", async () => {
          if (!recording) {
            const res = await V.startRecording();
            if (!res.ok) {
              if (status) status.textContent = "Mic: " + (res.reason || "error");
              return;
            }
            recording = true;
            record.classList.add("recording");
            record.textContent = "Stop";
            if (status) status.textContent = "Recording…";
          } else {
            const res = await V.stopRecording();
            recording = false;
            record.classList.remove("recording");
            record.textContent = "Record";
            if (res.ok && audio) {
              audio.src = res.url;
              audio.hidden = false;
              if (playback) playback.disabled = false;
              if (status) status.textContent = "Recorded — play back & self-rate";
            }
          }
        });
      }
      if (playback) {
        playback.addEventListener("click", () => {
          if (audio && audio.src) audio.play();
        });
      }
    });
  }

  function typeIcon(type) {
    const map = {
      learn: "◆",
      practice: "↻",
      speak: "◈",
      listen: "◎",
      checkpoint: "★",
      lore: "❧",
      notes: "§"
    };
    return map[type] || "●";
  }

  const A = () => NORDRONA.art;

  function renderHeader() {
    const stats = NORDRONA.progress.getStats();
    return `
      <header class="site-header path-header">
        <a href="#/home" class="brand" data-nav="home">
          <span class="brand-mark">${A().roundEmblem("brand-emblem")}</span>
          <span class="brand-text">
            <strong>Norðrœna</strong>
            <small>Old Norse Path</small>
          </span>
        </a>
        <div class="stat-pills">
          <span class="pill streak" title="Day streak">${A().flame()}<b>${stats.streak}</b> <small>day streak</small></span>
          <span class="pill xp" title="Experience">${A().star()}<b>${stats.xp}</b> <small>XP</small></span>
        </div>
        <nav class="nav tabbar" aria-label="Main">
          <a href="#/home" data-nav="home">${A().tabIcon("home")}<span>Path</span></a>
          <a href="#/lesson/1" data-nav="lesson">${A().tabIcon("lesson")}<span>Lesson 1</span></a>
          <a href="#/charter" data-nav="charter">${A().tabIcon("charter")}<span>Charter</span></a>
          <a href="#/futhark" data-nav="futhark">${A().tabIcon("futhark")}<span>Futhark</span></a>
          <a href="#/review" data-nav="review">${A().tabIcon("review")}<span>Review</span></a>
        </nav>
      </header>`;
  }

  function renderPathHome() {
    const path = NORDRONA.path;
    const P = NORDRONA.progress;
    const stats = P.getStats();
    const continueId = P.getContinueLevelId();
    const continueFound = continueId ? path.findLevel(continueId) : null;

    let pathHtml = "";
    path.sections.forEach((sec, si) => {
      const lockedSec = sec.comingSoon || !sec.unlocked;
      pathHtml += `
        <section class="path-section ${lockedSec ? "coming-soon" : ""}" id="sec-${escapeHtml(sec.id)}">
          <header class="path-section-head">
            <div class="sec-banner" aria-hidden="true">${A().sectionArt(sec.id, "sec-banner-img")}<span class="sec-banner-shade"></span><span class="sec-ravens">${A().raven("sr-1")}${A().raven("sr-2", true)}</span></div>
            ${A().sectionMedallion(sec.id)}
            <p class="eyebrow">Section ${si + 1}</p>
            <h2>${escapeHtml(sec.title)}</h2>
            <p class="muted">${escapeHtml(sec.subtitle || "")}</p>
            ${lockedSec ? '<span class="chip lock">Coming soon</span>' : ""}
          </header>
          ${A().knotBand(340, { medallion: true, cls: "sec-knot" })}`;

      (sec.units || []).forEach((unit, ui) => {
        pathHtml += `
          <div class="path-unit ${unit.comingSoon ? "coming-soon" : ""}">
            <div class="unit-banner">
              <span class="unit-badge" aria-hidden="true">${unit.id === "u3" ? A().picture("odin-wolves", "unit-badge-pic") : A().unitIcon(unit.id)}</span>
              <strong>Unit ${ui + 1}</strong>
              <span>${escapeHtml(unit.title)}</span>
              ${unit.comingSoon ? '<em class="muted"> — locked</em>' : ""}
              ${
                unit.studyNotes && !unit.comingSoon
                  ? `<a class="btn small ghost unit-notes-btn" href="#/notes/${escapeHtml(unit.id)}">Full notes</a>`
                  : ""
              }
            </div>
            <div class="path-track">`;

        (unit.levels || []).forEach((lv, li) => {
          const done = P.isLevelComplete(lv.id);
          const unlocked = !lv.lockedShell && !sec.comingSoon && P.isLevelUnlocked(lv.id);
          const isCurrent = continueId === lv.id && !lv.notesOnly && lv.type !== "notes";
          const zigzag = (li % 2 === 0 ? "left" : "right") + " wind-" + (li % 4);
          let cls = `path-node type-${lv.type} ${zigzag}`;
          if (done) cls += " done";
          if (!unlocked || lv.lockedShell) cls += " locked";
          if (isCurrent && unlocked) cls += " current";

          let href = "#";
          if (unlocked && !lv.lockedShell) {
            if (lv.notesOnly || lv.type === "notes" || lv.route) {
              href = lv.route || `#/notes/${unit.id}`;
            } else {
              href = `#/session/${lv.id}`;
            }
          }
          const label = lv.lockedShell ? "Coming soon" : lv.title;

          pathHtml += `
            <div class="path-node-wrap ${zigzag}">
              ${li > 0 ? '<div class="path-connector" aria-hidden="true"></div>' : ""}
              <a class="${cls}" href="${href}" data-level="${escapeHtml(lv.id)}"
                 title="${escapeHtml(label)}" ${!unlocked || lv.lockedShell ? 'aria-disabled="true"' : ""}>
                <span class="node-icon">${A().nodeIcon(lv.icon) || (lv.icon && lv.icon.length <= 2 ? escapeHtml(lv.icon) : typeIcon(lv.type))}</span>
                <span class="node-type">${escapeHtml(lv.type)}</span>
                <span class="node-title">${escapeHtml(label)}</span>
                ${done ? '<span class="node-check">✓</span>' : ""}
                ${isCurrent && unlocked ? '<span class="node-cta">Start</span>' : ""}
              </a>
            </div>`;
        });

        pathHtml += `</div></div>`;
      });

      pathHtml += `</section>`;
    });

    // Side path
    const side = (path.sidePaths || [])
      .map(
        (sp) => `
      <a class="side-path-card" href="${escapeHtml(sp.route)}">
        <span class="side-glyph" aria-hidden="true">${sp.id === "futhark" ? A().runestone("side-svg") : A().manuscript("side-svg")}</span>
        <div>
          <strong>${escapeHtml(sp.title)}</strong>
          <p class="muted">${escapeHtml(sp.subtitle)}</p>
          <p class="muted small">${escapeHtml(sp.note || "")}</p>
        </div>
      </a>`
      )
      .join("");

    return `
      <section class="path-home">
        <div class="path-hero">
          <div class="hero-frame" aria-hidden="true">
            <div class="hero-art">${A().picture("yggdrasil-tinted", "hero-img", { eager: true, pos: "50% 38%" })}<span class="hero-shade"></span></div>
            ${A().runeStrip("hero-runes")}
          </div>
          <p class="eyebrow">Historical Old West Norse</p>
          <h1>${escapeHtml(path.title)}</h1>
          <p class="lede">A winding path through Classical <em>normalized</em> Old Norse — sounds, first words, and philological honesty. Not Modern Icelandic. Not a green-owl clone.</p>
          <div class="hero-actions">
            ${
              continueFound
                ? `<a class="btn primary continue-cta" href="#/session/${escapeHtml(continueId)}">${A().triquetra("cta-icon")}<span>Continue · ${escapeHtml(continueFound.level.title)}</span></a>`
                : `<span class="btn primary" disabled>Path complete (Section 1)</span>`
            }
            <a class="btn ghost" href="#/charter">Charter</a>
            <a class="btn ghost" href="#/lesson/1">Classic Lesson 1</a>
          </div>
          <p class="progress-line">✦ ${stats.xp} XP · 🔥 ${stats.streak}-day streak · ${stats.completedCount} levels done</p>
        </div>
        ${pathHtml}
        <section class="side-paths">
          <h2>Side paths &amp; full notes</h2>
          ${side}
        </section>
        ${renderArtNotes()}
        <p class="center"><button type="button" class="btn ghost" id="reset-progress">Reset all progress</button></p>
      </section>`;
  }


  function labelClassHtml(label) {
    return `<span class="label ${labelClass(label)}">${escapeHtml(label)}</span>`;
  }

  function renderVocabCard(v) {
    if (!v) return "";
    const compare = v.compare
      ? `<aside class="callout warn tight"><strong>${escapeHtml(v.compare.label)}</strong><p>${escapeHtml(v.compare.text)}</p></aside>`
      : "";
    const tts =
      NORDRONA.session && NORDRONA.session.ttsMini
        ? NORDRONA.session.ttsMini(v.form, v.clearSpeak)
        : v.clearSpeak
          ? `<p class="tts-cue muted"><strong>Clear cue:</strong> <code>${escapeHtml(v.clearSpeak)}</code></p>`
          : "";
    return `
      <article class="vocab-card">
        <header>
          <span class="lemma">${escapeHtml(v.form)}</span>
          ${labelClassHtml(v.label || "ATTESTED")}
        </header>
        <p class="gloss">${escapeHtml(v.gloss || "")}</p>
        <p class="pos muted">${escapeHtml(v.pos || "")}</p>
        ${v.labelNote ? `<p class="label-note muted"><em>Label note:</em> ${escapeHtml(v.labelNote)}</p>` : ""}
        ${v.grammar ? `<p class="grammar">${escapeHtml(v.grammar)}</p>` : ""}
        ${tts}
        ${compare}
      </article>`;
  }

  function renderLessonSections(lesson, sectionIds) {
    if (!lesson || !lesson.sections) return "<p>No sections.</p>";
    const wanted = sectionIds && sectionIds.length ? new Set(sectionIds) : null;
    return lesson.sections
      .filter((s) => !wanted || wanted.has(s.id))
      .map((sec) => {
        let body = sec.html || "";
        let vocab = "";
        if (sec.vocab && sec.vocab.length) {
          vocab = `<div class="vocab-grid">${sec.vocab.map(renderVocabCard).join("")}</div>`;
        }
        return `
          <section class="lesson-section" id="sec-${escapeHtml(sec.id)}">
            <h2>${escapeHtml(sec.title)}</h2>
            <div class="section-html">${body}</div>
            ${vocab}
          </section>`;
      })
      .join("");
  }

  function renderClassicExercises(lesson) {
    const written = (lesson.exercises || []).filter((e) => e.type !== "speak");
    const speak = (lesson.exercises || []).filter((e) => e.type === "speak");
    const S = NORDRONA.session;
    let html = "";
    if (written.length) {
      html += `<section class="exercises-section panel"><h2>Written exercises (Lesson 1)</h2>`;
      written.forEach((ex) => {
        if (ex.type === "multiple" || ex.type === "matching-note") {
          html += `
            <fieldset class="ex-block" data-ex="${escapeHtml(ex.id)}">
              <legend>${ex.prompt}</legend>
              <div class="choices">
                ${(ex.choices || [])
                  .map(
                    (c) =>
                      `<label class="choice"><input type="radio" name="${escapeHtml(ex.id)}" value="${escapeHtml(c.id)}" /><span>${c.text}</span></label>`
                  )
                  .join("")}
              </div>
              <div class="ex-actions"><button type="button" class="btn primary classic-check" data-ex="${escapeHtml(ex.id)}">Check</button></div>
              <div class="ex-feedback" hidden></div>
            </fieldset>`;
        } else if (ex.type === "text") {
          html += `
            <fieldset class="ex-block" data-ex="${escapeHtml(ex.id)}">
              <legend>${ex.prompt}</legend>
              <input type="text" class="text-answer classic-text" data-ex="${escapeHtml(ex.id)}" autocomplete="off" spellcheck="false" />
              <div class="ex-actions"><button type="button" class="btn primary classic-check" data-ex="${escapeHtml(ex.id)}">Check</button></div>
              <div class="ex-feedback" hidden></div>
            </fieldset>`;
        }
      });
      html += `</section>`;
    }
    if (speak.length) {
      html += `<section class="exercises-section panel"><h2>Speak drills (Lesson 1)</h2>
        <p class="muted">Full clearSpeak + reconstructedNotes from lesson1.js. Mic + self-rate; TTS clear / slow / orthography.</p>`;
      speak.forEach((ex) => {
        const cues = (ex.historicalCues || [])
          .map((c) => `<label class="check-item"><input type="checkbox" /><span>${escapeHtml(c)}</span></label>`)
          .join("");
        const tips = (ex.rubricTips || []).map((x) => `<li>${escapeHtml(x)}</li>`).join("");
        html += `
          <div class="speak-block panel" data-ex="${escapeHtml(ex.id)}">
            <p class="sess-prompt">${ex.prompt || "Say:"}</p>
            <p class="speak-target"><span class="lemma">${escapeHtml(ex.target)}</span> ${labelClassHtml(ex.label || "NORMALIZED")}</p>
            <p class="gloss">${escapeHtml(ex.gloss || "")}</p>
            ${ex.clearSpeak ? `<p class="tts-cue muted"><strong>Clear speak:</strong> <code>${escapeHtml(ex.clearSpeak)}</code></p>` : ""}
            ${ex.reconstructedNotes ? `<div class="recon-notes callout info"><strong>Reconstructed notes</strong><p>${escapeHtml(ex.reconstructedNotes)}</p></div>` : ""}
            ${S && S.ttsMini ? S.ttsMini(ex.target, ex.clearSpeak) : ""}
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
      });
      html += `</section>`;
    }
    return html;
  }

  function renderStudyNotes() {
    const unitId = state.levelId;
    const path = NORDRONA.path;
    let unit = null;
    (path.sections || []).forEach((sec) => {
      (sec.units || []).forEach((u) => {
        if (u.id === unitId) unit = u;
      });
    });
    if (!unit || !unit.studyNotes) {
      return `
        <section class="panel">
          <h1>Study notes</h1>
          <p>No study notes for this unit.</p>
          <a class="btn" href="#/home">Back to path</a>
        </section>`;
    }
    const sn = unit.studyNotes;
    const lesson = NORDRONA.lessons && NORDRONA.lessons[sn.lessonId];
    return `
      <article class="prose study-notes-view">
        <p class="eyebrow">Reference · Deep dive</p>
        <h1>${escapeHtml(sn.title || unit.title + " — Study notes")}</h1>
        <p class="lede">Full scholarly prose from <code>lesson${sn.lessonId}.js</code> — not shortened. Path micro-lessons remain available on the map.</p>
        <p class="hero-actions">
          <a class="btn ghost" href="#/home">← Path</a>
          <a class="btn" href="#/lesson/1">Classic Lesson 1 (full)</a>
        </p>
        ${renderLessonSections(lesson, sn.sectionIds)}
        <p class="lesson-foot">
          <a class="btn primary" href="#/home">Back to path</a>
          <a class="btn" href="#/lesson/1">Open full Classic Lesson 1</a>
        </p>
      </article>`;
  }

  function renderClassicLesson() {
    const lesson = NORDRONA.lessons && NORDRONA.lessons[1];
    if (!lesson) {
      return `<section class="panel"><h1>Lesson 1 missing</h1><a class="btn" href="#/home">Path</a></section>`;
    }
    return `
      <article class="prose classic-lesson-view">
        <p class="eyebrow">Classic Lesson 1 · full scholarly view</p>
        <h1>${escapeHtml(lesson.title)}</h1>
        <p class="lede">${escapeHtml(lesson.subtitle || "")}</p>
        <aside class="callout info">
          <strong>Path + full notes</strong>
          <p>This screen renders <em>all</em> sections, vocabulary fields (gloss, pos, label, labelNote, grammar), written exercises, and speak drills from <code>data/lesson1.js</code> verbatim. The Duolingo-style path remains the primary practice UX.</p>
        </aside>
        <p class="hero-actions">
          <a class="btn ghost" href="#/home">← Path</a>
          <a class="btn" href="#/notes/u1">Unit 1 notes</a>
          <a class="btn" href="#/notes/u2">Unit 2 notes</a>
          <a class="btn" href="#/notes/u3">Unit 3 notes</a>
        </p>
        ${renderLessonSections(lesson, null)}
        ${renderClassicExercises(lesson)}
        <p class="lesson-foot">
          <a class="btn primary" href="#/home">Back to path</a>
          <a class="btn" href="#/charter">Charter</a>
          <a class="btn" href="#/futhark">Elder Futhark</a>
        </p>
      </article>`;
  }


  function renderCharter() {
    const ch = NORDRONA.course.charter;
    return `
      <article class="prose charter">
        <h1>Course charter</h1>
        <section>
          <h2>Target language</h2>
          <p><strong>${escapeHtml(ch.targetLanguage.name)}</strong> — ${escapeHtml(ch.targetLanguage.period)}</p>
          <p>${escapeHtml(ch.targetLanguage.description)}</p>
        </section>
        <aside class="callout warn">
          <strong>${escapeHtml(ch.notModernIcelandic.warning)}</strong>
          <ul>${ch.notModernIcelandic.points.map((p) => `<li>${escapeHtml(p)}</li>`).join("")}</ul>
        </aside>
        <section>
          <h2>${escapeHtml(ch.oldNorwegian.title)}</h2>
          <p>${escapeHtml(ch.oldNorwegian.text)}</p>
        </section>
        <section>
          <h2>${escapeHtml(ch.sources.title)}</h2>
          <ul>${ch.sources.items.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>
        </section>
        <section>
          <h2>${escapeHtml(ch.pronunciationHonesty.title)}</h2>
          <p>${escapeHtml(ch.pronunciationHonesty.text)}</p>
        </section>
        <section>
          <h2>${escapeHtml(ch.labels.title)}</h2>
          <ul class="label-legend">
            ${ch.labels.items
              .map(
                (i) =>
                  `<li><span class="label ${labelClass(i.code)}">${escapeHtml(i.code)}</span> ${escapeHtml(i.meaning)}</li>`
              )
              .join("")}
          </ul>
        </section>
        <section>
          <h2>Path roadmap</h2>
          <ol class="roadmap">
            ${ch.roadmap
              .map(
                (r) =>
                  `<li><span class="rm-num">L${r.id}</span> ${escapeHtml(r.title)} <em>(${escapeHtml(r.status)})</em></li>`
              )
              .join("")}
          </ol>
          <p class="muted">Section 1 Foundations is playable as path units; later sections are locked shells.</p>
        </section>
        <p><a class="btn primary" href="#/home">Back to path</a></p>
      </article>`;
  }

  function renderFuthark() {
    const F = NORDRONA.futhark;
    const chron = F.chronology.points
      .map(
        (p) => `
        <article class="chrono-card">
          <h3>${escapeHtml(p.name)}</h3>
          <p class="muted">${escapeHtml(p.period)} · ${escapeHtml(p.script)}</p>
          <p>${escapeHtml(p.use)}</p>
        </article>`
      )
      .join("");
    const warns = F.chronology.warnings.map((w) => `<li>${escapeHtml(w)}</li>`).join("");
    const runes = F.row
      .map(
        (r) => `
        <div class="rune-card">
          <span class="rune-glyph" aria-hidden="true">${r.glyph}</span>
          <span class="rune-name">${escapeHtml(r.name)}</span>
          <span class="rune-value">${escapeHtml(r.value)}</span>
          <span class="rune-note muted">${escapeHtml(r.note)}</span>
        </div>`
      )
      .join("");
    const corr = F.correlations.items
      .map((i) => `<li><strong>${escapeHtml(i.title)}</strong> — ${escapeHtml(i.text)}</li>`)
      .join("");
    const quiz = (F.quiz || [])
      .map(
        (q) => `
        <fieldset class="ex-block" data-ex="${q.id}">
          <legend>${q.prompt}</legend>
          <div class="choices">
            ${(q.choices || [])
              .map(
                (c) =>
                  `<label class="choice"><input type="radio" name="${q.id}" value="${c.id}" /><span>${c.text}</span></label>`
              )
              .join("")}
          </div>
          <button type="button" class="btn primary futhark-check" data-ex="${q.id}">Check</button>
          <div class="ex-feedback" hidden></div>
        </fieldset>`
      )
      .join("");

    return `
      <article class="prose futhark-view">
        <p class="eyebrow">Side path · not Latin ON</p>
        <h1>${escapeHtml(F.title)}</h1>
        <p class="lede">${escapeHtml(F.subtitle)}</p>
        <aside class="callout warn"><strong>Not saga orthography</strong><ul>${warns}</ul></aside>
        <h2>${escapeHtml(F.chronology.title)}</h2>
        <div class="chrono-grid">${chron}</div>
        <h2>24-rune row (conventional names)</h2>
        <div class="rune-grid">${runes}</div>
        <h2>${escapeHtml(F.correlations.title)}</h2>
        <ul class="scholar-list">${corr}</ul>
        <h2>Quiz</h2>
        ${quiz}
        <p><a class="btn" href="#/home">← Back to ON path</a></p>
      </article>`;
  }

  function renderReview() {
    return `
      <section class="panel">
        <h1>Spaced review</h1>
        <p class="muted">Missed written items from path sessions.</p>
        <div id="review-root"></div>
        <p><a class="btn" href="#/home">Back to path</a></p>
      </section>`;
  }

  function renderCelebrate(payload) {
    return `
      <div class="celebrate">
        ${A().runeShower()}
        <div class="celebrate-medallion" aria-hidden="true">${A().medallion()}</div>
        <p class="eyebrow">Level complete</p>
        <h1>${payload.perfect ? "Flawless!" : "Well done!"}</h1>
        <p class="lede">+${payload.xp} XP${payload.perfect ? " (perfect bonus)" : ""} · ${payload.mistakes} mistake${payload.mistakes === 1 ? "" : "s"}</p>
        <div class="hero-actions">
          ${
            payload.nextId
              ? `<a class="btn primary" href="#/session/${escapeHtml(payload.nextId)}">Continue</a>`
              : ""
          }
          <a class="btn" href="#/home">Path map</a>
        </div>
      </div>`;
  }

  function renderFailed() {
    return `
      <div class="celebrate failed">
        <div class="celebrate-medallion failed-mark" aria-hidden="true">${A().shield()}</div>
        <p class="eyebrow">Out of hearts</p>
        <h1>Rest &amp; retry</h1>
        <p class="lede">You used the mistake budget. Review missed items, then try the level again — progress on this node is not saved until you finish.</p>
        <div class="hero-actions">
          <a class="btn primary" href="#/session/${escapeHtml(state.levelId)}">Retry level</a>
          <a class="btn" href="#/review">Review queue</a>
          <a class="btn ghost" href="#/home">Path map</a>
        </div>
      </div>`;
  }

  function renderSession() {
    const S = NORDRONA.session;
    if (state.celebrate) return renderCelebrate(state.celebrate);
    if (state.failed) return renderFailed();

    if (!state.sessionActive) {
      const res = S.start(state.levelId);
      if (!res.ok) {
        return `
          <section class="panel">
            <h1>${res.reason === "locked" ? "Level locked" : "Level unavailable"}</h1>
            <p>Complete earlier nodes on the path first, or this shell is coming soon.</p>
            <a class="btn" href="#/home">Back to path</a>
          </section>`;
      }
      state.sessionActive = true;
      state.showIntro = true;
    }
    return S.renderShell(state.showIntro);
  }

  function artCredit() {
    return `<span class="art-credit">Art: illustrations supplied by the user; knotwork, rune and emblem ornaments are original SVG. <a href="#/home" data-art-notes>About the art &amp; symbols</a></span>`;
  }

  /** "About the art & symbols" — captions kept historically careful. */
  function renderArtNotes() {
    return `
      <details class="art-notes panel" id="art-notes">
        <summary>About the art &amp; symbols</summary>
        <p class="muted">Decoration only — none of it is lesson content. Captions note what is historical and what is modern.</p>
        <h3>Ornaments (original SVG drawings)</h3>
        <ul class="scholar-list">
          <li><strong>Knotwork bands</strong> — simplified, original interlace inspired by the Ringerike (c. 990–1050) and Urnes (c. 1050–1150) styles; Urnes is named after carvings on Urnes stave church, Norway.</li>
          <li><strong>Yggdrasil</strong> — the world-ash of Eddic myth (<em>Vǫluspá</em>, <em>Grímnismál</em>; Snorri’s <em>Gylfaginning</em>), with three roots. Our tree is a modern stylisation.</li>
          <li><strong>Huginn &amp; Muninn</strong> — Óðinn’s ravens, ‘thought’ and ‘mind/memory’ (<em>Grímnismál</em> 20).</li>
          <li><strong>Mjǫllnir</strong> (modern spelling Mjölnir) — Þórr’s hammer. Hammer-shaped pendants are a genuine Viking-Age find type, mostly 10th century.</li>
          <li><strong>Valknut</strong> — a modern name; interlaced-triangle motifs appear on Gotlandic picture stones (e.g. Stora Hammars I, Tängelgårda I). The original name and meaning are unknown.</li>
          <li><strong>Triquetra</strong> — a three-lobed interlace found widely in early medieval art (Insular, Scandinavian and Christian contexts); no fixed Viking-Age meaning is recorded.</li>
          <li><strong>Longship</strong> — loosely after ships known from burials such as Oseberg and Gokstad (9th–early 10th century).</li>
          <li><strong>Bifrǫst</strong> — the bridge to the gods’ realm; Snorri describes it as a three-coloured rainbow (<em>Gylfaginning</em>).</li>
          <li><strong>Runestone path nodes</strong> — after late Viking-Age raised stones (mainly 10th–11th c.), which were originally painted; the red band echoes the serpent bands that carry inscriptions.</li>
          <li><strong>Rune strips</strong> — the 24 Elder Futhark runes in futhark order, drawn as attested stave shapes. They spell nothing. Esoteric “rune meanings” are modern and are not used here.</li>
        </ul>
        <h3>Illustrations (supplied by the user)</h3>
        <ul class="scholar-list">
          <li><strong>Yggdrasil</strong> (home) — modern ornamental illustration of the world-tree, hand-tinted for this app in the manner of early colour photographs.</li>
          <li><strong>Óðinn enthroned</strong> (Section 1) — with ravens, Valknut and Mjǫllnir motifs inside a serpent border. The winged helmet is a 19th-century romantic convention, not Viking-Age gear; the rune ring is decorative, not a verified inscription. The compass-like sign at lower right is the <em>Vegvísir</em>, an early-modern Icelandic magical stave known from 19th-century manuscripts — not a Viking-Age symbol.</li>
          <li><strong>Horned figure on a cliff</strong> (Section 2) and <strong>horn-blowing warrior</strong> (Section 3) — modern fantasy art. Horned helmets are a modern/romantic depiction; no Viking-Age warrior helmet with horns is known.</li>
          <li><strong>Mjǫllnir pendants with dragons</strong> (Charter) — modern designs. The winged helmet is romantic; the sign on the lower hammer is the <em>Vegvísir</em>, an early-modern Icelandic stave, not Viking Age.</li>
          <li><strong>Serpent eye in a knotwork ring</strong> (Elder Futhark) — modern tattoo-style drawing, shown here as a sepia duotone.</li>
          <li><strong>Forest sage</strong> (Review) — an artistic interpretation of a wise old wanderer with ravens, a fox and fly agaric; not a depiction of any specific god.</li>
          <li><strong>Óðinn with ravens</strong> (guide portraits) — modern artistic interpretations; the horned helmet is a modern depiction.</li>
          <li><strong>Horned god with two wolves</strong> (Unit 3 badge) — modern interpretation evoking Óðinn’s wolves Geri and Freki (<em>Grímnismál</em> 19); the horns are a modern depiction.</li>
        </ul>
        <p class="muted small">Art credits: all illustrations above were supplied by the user for this app. Ornaments and icons are original drawings made for Norðrœna; nothing is hotlinked.</p>
      </details>`;
  }

  /** Visual-only decoration added after render (no content changes). */
  function drawWindingPaths(app) {
    $$(".path-track", app).forEach((track) => {
      const old = $(".wind-svg", track);
      if (old) old.remove();
      const nodes = $$(".path-node .node-icon", track);
      if (nodes.length < 2) return;
      const tb = track.getBoundingClientRect();
      const pts = nodes.map((n) => {
        const r = n.getBoundingClientRect();
        return [r.left - tb.left + r.width / 2, r.top - tb.top + r.height / 2];
      });
      let d = `M${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
      for (let i = 1; i < pts.length; i++) {
        const [x0, y0] = pts[i - 1], [x1, y1] = pts[i];
        const my = (y0 + y1) / 2;
        d += `C${x0.toFixed(1)} ${my.toFixed(1)} ${x1.toFixed(1)} ${my.toFixed(1)} ${x1.toFixed(1)} ${y1.toFixed(1)}`;
      }
      track.insertAdjacentHTML("afterbegin",
        `<svg class="wind-svg" aria-hidden="true" width="${tb.width.toFixed(0)}" height="${tb.height.toFixed(0)}"><path d="${d}" class="wind-glow"/><path d="${d}" class="wind-dots"/></svg>`);
    });
  }
  let windTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(windTimer);
    windTimer = setTimeout(() => { if (state.view === "home") drawWindingPaths(document); }, 150);
  });

  function decorate(app) {
    const art = A();
    if (!art) return;
    const main = $("main", app);
    if (!main) return;
    const view = state.view;
    document.body.classList.toggle("in-session", view === "session");
    const navKey = view === "notes" ? "lesson" : view;
    $$(".tabbar a", app).forEach((a) => {
      const on = a.getAttribute("data-nav") === navKey;
      a.classList.toggle("active", on);
      if (on) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    if (view === "home") requestAnimationFrame(() => drawWindingPaths(app));
    const firstH1 = $("main > article > h1, main > section.panel > h1", app);
    const banners = {
      charter: ["mjolnir-knotwork", "50% 46%"],
      futhark: null,
      review: ["forest-sage", "50% 30%"]
    };
    if (firstH1 && view !== "session") {
      const b = banners[view];
      if (b) {
        firstH1.insertAdjacentHTML("beforebegin", `<div class="page-banner" aria-hidden="true">${art.picture(b[0], "page-banner-img", { pos: b[1] })}<span class="page-banner-shade"></span></div>`);
      } else if (view === "futhark") {
        firstH1.insertAdjacentHTML("beforebegin", `<div class="page-medallion" aria-hidden="true">${art.picture("serpent-eye", "medallion-img")}</div>`);
      } else if (view === "notes" || view === "lesson") {
        firstH1.insertAdjacentHTML("beforebegin", `<div class="page-banner svg-banner" aria-hidden="true">${art.heroArt()}</div>`);
      }
      firstH1.insertAdjacentHTML("afterend", art.knotBand(340, { medallion: true, cls: "h1-knot" }));
    }
    if (view === "futhark") {
      const grid = $(".rune-grid", app);
      if (grid) grid.insertAdjacentHTML("beforebegin", art.runeStrip("futhark-strip"));
      // Draw each rune as strokes (Runic font coverage is patchy on phones); the text glyph stays in the DOM.
      $$(".rune-card .rune-glyph", app).forEach((g) => {
        const drawn = art.runeSvg(g.textContent, "rune-card-svg");
        if (drawn) { g.classList.add("has-svg"); g.insertAdjacentHTML("afterend", drawn); }
      });
    }
    if (view === "session") {
      const intro = $(".intro-card", app);
      if (intro) {
        const found = state.levelId && NORDRONA.path.findLevel ? NORDRONA.path.findLevel(state.levelId) : null;
        const secId = found && found.section ? found.section.id : "s1";
        intro.insertAdjacentHTML("afterbegin", `<div class="intro-banner" aria-hidden="true">${art.sectionArt(secId, "intro-banner-img")}<span class="page-banner-shade"></span></div>`);
        const h1 = $("h1", intro);
        if (h1) h1.insertAdjacentHTML("afterend", art.knotBand(340, { cls: "h1-knot" }));
      }
      const fb = $("#sess-feedback", app);
      if (fb) fb.insertAdjacentHTML("beforebegin", `<div class="guide" aria-hidden="true">${art.picture("odin-ravens-bw", "guide-pic")}</div>`);
      const speak = $(".speak-block .mic-panel", app);
      if (speak) speak.insertAdjacentHTML("beforebegin", `<div class="guide-inline" aria-hidden="true">${art.picture("odin-ravens-storm", "guide-pic")}<span>Huginn &amp; Muninn are listening.</span></div>`);
    }
    $$(".mic-panel", app).forEach((p) => p.classList.add("carved"));
    const notesLink = $("[data-art-notes]", app);
    if (notesLink) {
      notesLink.addEventListener("click", (e) => {
        const d = $("#art-notes");
        if (d) { e.preventDefault(); d.open = true; d.scrollIntoView({ block: "start" }); }
        else window.__nrOpenArtNotes = true;
      });
    }
    if (window.__nrOpenArtNotes && view === "home") {
      window.__nrOpenArtNotes = false;
      const d = $("#art-notes");
      if (d) { d.open = true; setTimeout(() => d.scrollIntoView({ block: "start" }), 30); }
    }
  }

  function render() {
    const app = $("#app");
    if (!app) return;

    if (state.view === "session") {
      app.innerHTML = `
        ${renderHeader()}
        <main class="main session-main">${renderSession()}</main>
        <footer class="site-footer">${A().knotBand(300, { cls: "foot-knot" })}Norðrœna · Classical Old Norse · scholarly labels · not Modern Icelandic${artCredit()}</footer>`;
      decorate(app);
      bindSessionHandlers(app);
      return;
    }

    let main = "";
    if (state.view === "charter") main = renderCharter();
    else if (state.view === "futhark") main = renderFuthark();
    else if (state.view === "review") main = renderReview();
    else if (state.view === "notes") main = renderStudyNotes();
    else if (state.view === "lesson") main = renderClassicLesson();
    else main = renderPathHome();

    app.innerHTML = `
      ${renderHeader()}
      <main class="main">${main}</main>
      <footer class="site-footer">${A().knotBand(300, { cls: "foot-knot" })}Norðrœna · Classical Old Norse path · ATTESTED / NORMALIZED / RECONSTRUCTED · not Modern Icelandic${artCredit()}</footer>`;

    decorate(app);
    bindTts(app);
    bindMic(app);

    const reset = $("#reset-progress");
    if (reset) {
      reset.addEventListener("click", () => {
        if (confirm("Reset all path progress, XP, and streak?")) {
          NORDRONA.progress.resetAll();
          render();
        }
      });
    }

    if (state.view === "review") {
      const root = $("#review-root");
      if (root && NORDRONA.review) NORDRONA.review.renderQueue(root);
    }

    if (state.view === "lesson") {
      $$(".classic-check", app).forEach((btn) => {
        btn.addEventListener("click", () => {
          const id = btn.getAttribute("data-ex");
          const lesson = NORDRONA.lessons[1];
          const ex = (lesson.exercises || []).find((x) => x.id === id);
          const field = btn.closest("fieldset");
          const fb = field && $(".ex-feedback", field);
          if (!ex || !fb) return;
          let user = null;
          if (ex.type === "text") {
            const inp = field.querySelector(".classic-text");
            user = inp ? inp.value : "";
          } else {
            const picked = field.querySelector(`input[name="${id}"]:checked`);
            if (!picked) {
              fb.hidden = false;
              fb.className = "ex-feedback bad";
              fb.textContent = "Pick an answer.";
              return;
            }
            user = picked.value;
          }
          const result = NORDRONA.exercises.gradeWritten(ex, user);
          fb.hidden = false;
          fb.className = "ex-feedback " + (result.correct ? "ok" : "bad");
          fb.innerHTML = result.correct
            ? "Correct. " + (result.explanation || "")
            : "Not quite. " +
              (result.explanation || "") +
              (result.hint ? `<p class="hint">Hint: ${escapeHtml(result.hint)}</p>` : "");
        });
      });
    }

    if (state.view === "futhark") {
      $$(".futhark-check").forEach((btn) => {
        btn.addEventListener("click", () => {
          const id = btn.getAttribute("data-ex");
          const q = (NORDRONA.futhark.quiz || []).find((x) => x.id === id);
          const field = btn.closest("fieldset");
          const picked = field && field.querySelector(`input[name="${id}"]:checked`);
          const fb = field && $(".ex-feedback", field);
          if (!q || !fb) return;
          if (!picked) {
            fb.hidden = false;
            fb.className = "ex-feedback bad";
            fb.textContent = "Pick an answer.";
            return;
          }
          const ok = picked.value === q.answer;
          fb.hidden = false;
          fb.className = "ex-feedback " + (ok ? "ok" : "bad");
          fb.innerHTML = ok
            ? "Correct. " + (q.explanation || "")
            : "Not quite. " + (q.explanation || "") + (q.hint ? `<p class="hint">Hint: ${q.hint}</p>` : "");
        });
      });
    }

    // Prevent locked node navigation
    $$(".path-node.locked").forEach((a) => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
      });
    });
  }

  function bindSessionHandlers(app) {
    const S = NORDRONA.session;
    bindTts(app);
    bindMic(app);

    const quit = $(".sess-quit", app);
    if (quit) {
      quit.addEventListener("click", () => {
        S.abandon();
        state.sessionActive = false;
        navigate("home");
      });
    }

    const startEx = $(".sess-start-ex", app);
    if (startEx) {
      startEx.addEventListener("click", () => {
        S.markIntroDone();
        state.showIntro = false;
        render();
      });
    }

    // choice buttons
    $$(".choice-btn", app).forEach((btn) => {
      btn.addEventListener("click", () => {
        $$(".choice-btn", app).forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");
      });
    });

    // tiles
    $$(".tile-btn", app).forEach((btn) => {
      btn.addEventListener("click", () => {
        const out = $("[data-role='tile-out']", app);
        const val = btn.getAttribute("data-val");
        if (out) {
          out.textContent = val;
          out.setAttribute("data-val", val);
          out.classList.remove("muted");
        }
        $$(".tile-btn", app).forEach((b) => b.classList.remove("selected"));
        btn.classList.add("selected");
      });
    });

    const checkBtn = $("#sess-check", app);
    const contBtn = $("#sess-continue", app);
    const feedback = $("#sess-feedback", app);
    const sessBody = $("#sess-exercise", app);

    function showContinue() {
      if (checkBtn) checkBtn.hidden = true;
      if (contBtn) contBtn.hidden = false;
    }

    if (checkBtn) {
      checkBtn.addEventListener("click", () => {
        const sess = S.getSession();
        const ex = S.currentExercise();
        if (!ex) return;

        // lore / speak: Check acts as continue-prep
        if (ex.type === "lore" || ex.type === "speak") {
          const result = S.check(app);
          if (feedback) {
            feedback.hidden = false;
            feedback.className = "sess-feedback ok";
            feedback.textContent =
              ex.type === "speak"
                ? "Checklist noted. Continue when ready."
                : "Continue when ready.";
          }
          showContinue();
          return;
        }

        const result = S.check(app);
        if (!result.ok && result.reason === "empty") {
          if (feedback) {
            feedback.hidden = false;
            feedback.className = "sess-feedback bad";
            feedback.textContent = "Select or type an answer first.";
          }
          return;
        }
        if (!result.ok) return;

        if (feedback) {
          feedback.hidden = false;
          feedback.className = "sess-feedback " + (result.correct ? "ok" : "bad");
          let msg = result.correct ? "Correct!" : "Not quite.";
          if (result.explanation) msg += " " + result.explanation;
          if (!result.correct && result.hint) msg += " Hint: " + result.hint;
          if (!result.correct && result.expected != null) {
            const exp =
              typeof result.expected === "object"
                ? JSON.stringify(result.expected)
                : String(result.expected);
            msg += " Expected: " + exp;
          }
          feedback.textContent = msg;
        }

        // update hearts display
        const heartsEl = $(".sess-hearts", app);
        if (heartsEl && sess) {
          heartsEl.textContent =
            "♥".repeat(sess.hearts) + "♡".repeat(Math.max(0, sess.heartsMax - sess.hearts));
        }

        if (result.dead) {
          showContinue();
          contBtn.textContent = "See result";
          return;
        }
        showContinue();
      });
    }

    if (contBtn) {
      contBtn.addEventListener("click", () => {
        const sess = S.getSession();
        if (sess && sess.hearts <= 0 && sess.checked && !sess.finished) {
          // fail out
          S.advance(); // may mark finished
          state.failed = true;
          state.sessionActive = false;
          S.abandon();
          render();
          return;
        }
        const adv = S.advance();
        if (adv.done) {
          if (adv.failed) {
            state.failed = true;
            state.sessionActive = false;
            render();
            return;
          }
          state.celebrate = adv;
          state.sessionActive = false;
          render();
          return;
        }
        state.showIntro = false;
        render();
      });
    }
  }

  function init() {
    parseHash();
    // #/lesson/1 → Classic Lesson 1 full view; #/lessons → path
    if (state.view === "lessons") {
      state.view = "home";
      location.hash = "#/home";
    }
    if (state.view === "lesson" && !state.levelId) {
      state.levelId = "1";
    }
    render();
    window.addEventListener("hashchange", () => {
      const prev = state.view;
      parseHash();
      if (state.view !== "session") {
        state.sessionActive = false;
        state.celebrate = null;
        state.failed = null;
        if (NORDRONA.session) NORDRONA.session.abandon();
      } else if (prev !== "session" || !state.sessionActive) {
        state.sessionActive = false;
        state.showIntro = true;
        state.celebrate = null;
        state.failed = null;
      }
      render();
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
