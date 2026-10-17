/**
 * Norðrœna — exercise grading for path session types
 */
(function (global) {
  function normalizeAnswer(s) {
    return String(s || "")
      .trim()
      .toLowerCase()
      .normalize("NFC")
      .replace(/\s+/g, " ");
  }

  function gradeWritten(exercise, userInput) {
    const type = exercise.type;

    if (
      type === "multiple" ||
      type === "matching-note" ||
      type === "truefalse" ||
      type === "tap_hear" ||
      type === "listen_choice" ||
      type === "translate_on_en" ||
      type === "fill"
    ) {
      if (type === "fill" && exercise.accept && !exercise.choices) {
        const norm = normalizeAnswer(userInput);
        const accept = (exercise.accept || []).map(normalizeAnswer);
        const correct = accept.indexOf(norm) !== -1;
        return {
          correct,
          expected: exercise.accept[0],
          explanation: exercise.explanation || "",
          hint: exercise.hint || ""
        };
      }
      // fill with choices, or MC-like: userInput is choice id
      if (type === "fill" && exercise.choices && exercise.accept) {
        // user may send choice id or typed text
        const byId = (exercise.choices || []).find((c) => c.id === userInput);
        const textVal = byId ? byId.text : userInput;
        const norm = normalizeAnswer(textVal);
        const accept = (exercise.accept || []).map(normalizeAnswer);
        const correct =
          accept.indexOf(norm) !== -1 ||
          (exercise.answer && userInput === exercise.answer);
        // also allow matching choice whose text is accept
        let ok = correct;
        if (!ok && byId) ok = accept.indexOf(normalizeAnswer(byId.text)) !== -1;
        return {
          correct: ok,
          expected: exercise.accept[0],
          explanation: exercise.explanation || "",
          hint: exercise.hint || ""
        };
      }
      const correct = userInput === exercise.answer;
      return {
        correct,
        expected: exercise.answer,
        explanation: exercise.explanation || "",
        hint: exercise.hint || ""
      };
    }

    if (type === "text") {
      const norm = normalizeAnswer(userInput);
      const accept = (exercise.accept || []).map(normalizeAnswer);
      const correct = accept.indexOf(norm) !== -1;
      return {
        correct,
        expected: (exercise.accept && exercise.accept[0]) || "",
        explanation: exercise.explanation || "",
        hint: exercise.hint || ""
      };
    }

    if (type === "tiles") {
      const norm = normalizeAnswer(userInput);
      const ans = normalizeAnswer(exercise.answer);
      return {
        correct: norm === ans,
        expected: exercise.answer,
        explanation: exercise.explanation || "",
        hint: exercise.hint || ""
      };
    }

    if (type === "match") {
      // userInput: { left: right, ... } or JSON string
      let map = userInput;
      if (typeof userInput === "string") {
        try {
          map = JSON.parse(userInput);
        } catch (e) {
          map = {};
        }
      }
      const pairs = exercise.pairs || [];
      let correct = true;
      const expected = {};
      pairs.forEach((p) => {
        expected[p.left] = p.right;
        if (normalizeAnswer(map[p.left]) !== normalizeAnswer(p.right)) correct = false;
      });
      if (Object.keys(map || {}).length !== pairs.length) correct = false;
      return {
        correct,
        expected,
        explanation: exercise.explanation || "",
        hint: exercise.hint || ""
      };
    }

    if (type === "speak" || type === "lore" || type === "listen") {
      // handled in session UI (self-complete)
      return { correct: true, expected: "", explanation: "", hint: "" };
    }

    return { correct: false, expected: "", explanation: "Unknown exercise type: " + type };
  }

  global.NORDRONA = global.NORDRONA || {};
  global.NORDRONA.exercises = { normalizeAnswer, gradeWritten };
})(window);
