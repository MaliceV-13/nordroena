/**
 * Norðrœna — path progress (XP, streak, completed levels)
 * localStorage key v2 for Duolingo-style path.
 */
(function (global) {
  const KEY = "nordrona_progress_v2";
  const LEGACY = "nordrona_progress_v1";

  function todayKey() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return y + "-" + m + "-" + day;
  }

  function yesterdayKey() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return y + "-" + m + "-" + day;
  }

  function defaultState() {
    return {
      version: 2,
      completedLevels: {},
      currentLevelId: null,
      xp: 0,
      streak: 0,
      lastActiveDay: null,
      reviewQueue: [],
      voiceRecordings: {},
      hearts: 5,
      lastUpdated: null
    };
  }

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        return Object.assign(defaultState(), JSON.parse(raw));
      }
    } catch (e) {}
    return defaultState();
  }

  function save(state) {
    state.lastUpdated = new Date().toISOString();
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {}
    return state;
  }

  function touchStreak() {
    const s = load();
    const today = todayKey();
    if (s.lastActiveDay === today) {
      return s;
    }
    if (s.lastActiveDay === yesterdayKey()) {
      s.streak = (s.streak || 0) + 1;
    } else if (!s.lastActiveDay) {
      s.streak = 1;
    } else {
      s.streak = 1;
    }
    s.lastActiveDay = today;
    return save(s);
  }

  function isLevelComplete(levelId) {
    const s = load();
    return !!(s.completedLevels && s.completedLevels[levelId]);
  }

  function getCompletedSet() {
    return load().completedLevels || {};
  }

  function getLinearIds() {
    const path = global.NORDRONA && global.NORDRONA.path;
    if (!path || !path.getLinearPlayable) return [];
    return path.getLinearPlayable().map((x) => x.level.id);
  }

  function isLevelUnlocked(levelId) {
    const found = global.NORDRONA.path.findLevel(levelId);
    // Study-notes / classic lesson nodes: available whenever the section is playable
    if (found && (found.level.notesOnly || found.level.type === "notes")) {
      if (found.level.lockedShell || found.section.comingSoon || !found.section.unlocked) return false;
      return true;
    }
    const ids = getLinearIds();
    const idx = ids.indexOf(levelId);
    if (idx === -1) {
      if (!found) return false;
      if (found.level.lockedShell || found.section.comingSoon) return false;
      return false;
    }
    if (idx === 0) return true;
    for (let i = 0; i < idx; i++) {
      if (!isLevelComplete(ids[i])) return false;
    }
    return true;
  }

  function getContinueLevelId() {
    const ids = getLinearIds();
    for (let i = 0; i < ids.length; i++) {
      if (!isLevelComplete(ids[i])) return ids[i];
    }
    return ids.length ? ids[ids.length - 1] : null;
  }

  function completeLevel(levelId, opts) {
    opts = opts || {};
    const s = touchStreak();
    s.completedLevels[levelId] = {
      at: new Date().toISOString(),
      perfect: !!opts.perfect,
      mistakes: opts.mistakes || 0
    };
    const path = global.NORDRONA.path;
    const base = (path && path.xpPerLevel) || 10;
    const bonus = opts.perfect ? (path && path.xpPerPerfect) || 15 : base;
    s.xp = (s.xp || 0) + (opts.perfect ? bonus : base);
    save(s);
    s.currentLevelId = getContinueLevelId();
    return save(s);
  }

  function getStats() {
    const s = load();
    // refresh streak break if missed a day
    const today = todayKey();
    let streak = s.streak || 0;
    if (s.lastActiveDay && s.lastActiveDay !== today && s.lastActiveDay !== yesterdayKey()) {
      streak = 0;
    }
    return {
      xp: s.xp || 0,
      streak,
      completedCount: Object.keys(s.completedLevels || {}).length,
      currentLevelId: s.currentLevelId || getContinueLevelId(),
      heartsMax: (global.NORDRONA.path && global.NORDRONA.path.heartsMax) || 5
    };
  }

  function addToReview(item) {
    const s = load();
    if (!s.reviewQueue.some((q) => q.id === item.id)) {
      s.reviewQueue.push({
        id: item.id,
        levelId: item.levelId,
        prompt: item.prompt,
        answer: item.answer,
        explanation: item.explanation || "",
        addedAt: new Date().toISOString()
      });
      save(s);
    }
    return s.reviewQueue;
  }

  function getReviewQueue() {
    return load().reviewQueue || [];
  }

  function removeFromReview(id) {
    const s = load();
    s.reviewQueue = (s.reviewQueue || []).filter((q) => q.id !== id);
    save(s);
    return s.reviewQueue;
  }

  function markVoice(exerciseId, payload) {
    const s = load();
    s.voiceRecordings[exerciseId] = {
      savedAt: new Date().toISOString(),
      selfRatings: payload.selfRatings || {},
      hadRecording: !!payload.hadRecording,
      checklistSubmitted: !!payload.checklistSubmitted
    };
    return save(s);
  }

  function resetAll() {
    try {
      localStorage.removeItem(KEY);
      localStorage.removeItem(LEGACY);
    } catch (e) {}
    return defaultState();
  }

  // Legacy stubs so old review/app bits don't crash
  function isLessonComplete() { return false; }
  function isLessonUnlocked(id) { return id === 1; }
  function lessonState() {
    return { writtenComplete: false, voiceComplete: false, writtenAnswers: {}, voiceDone: {} };
  }

  global.NORDRONA = global.NORDRONA || {};
  global.NORDRONA.progress = {
    load,
    save,
    touchStreak,
    isLevelComplete,
    isLevelUnlocked,
    getContinueLevelId,
    completeLevel,
    getStats,
    getCompletedSet,
    addToReview,
    getReviewQueue,
    removeFromReview,
    markVoice,
    resetAll,
    // legacy
    isLessonComplete,
    isLessonUnlocked,
    lessonState,
    KEY
  };
})(window);
