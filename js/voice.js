/**
 * Norðrœna — microphone recording + optional SpeechRecognition aid
 * Historical ON: ASR is NEVER ground truth. Record / playback / self-rate.
 */
(function (global) {
  let mediaStream = null;
  let mediaRecorder = null;
  let chunks = [];
  let lastBlobUrl = null;
  let permissionState = "unknown"; // unknown | granted | denied | unsupported

  function isSecureContextOk() {
    return (
      global.isSecureContext ||
      location.hostname === "localhost" ||
      location.hostname === "127.0.0.1" ||
      location.protocol === "file:"
    );
  }

  function getSpeechRecognitionCtor() {
    return global.SpeechRecognition || global.webkitSpeechRecognition || null;
  }

  async function requestMic() {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      permissionState = "unsupported";
      return { ok: false, reason: "unsupported" };
    }
    if (!isSecureContextOk() && location.protocol !== "file:") {
      permissionState = "unsupported";
      return { ok: false, reason: "insecure" };
    }
    try {
      mediaStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      permissionState = "granted";
      return { ok: true, stream: mediaStream };
    } catch (err) {
      permissionState = "denied";
      return { ok: false, reason: "denied", error: err };
    }
  }

  function stopStream() {
    if (mediaStream) {
      mediaStream.getTracks().forEach((t) => t.stop());
      mediaStream = null;
    }
  }

  function pickMimeType() {
    const candidates = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/ogg;codecs=opus",
      "audio/mp4"
    ];
    for (const c of candidates) {
      if (global.MediaRecorder && MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(c)) {
        return c;
      }
    }
    return "";
  }

  async function startRecording() {
    chunks = [];
    if (!mediaStream) {
      const res = await requestMic();
      if (!res.ok) return res;
    }
    const mime = pickMimeType();
    const opts = mime ? { mimeType: mime } : undefined;
    mediaRecorder = new MediaRecorder(mediaStream, opts);
    mediaRecorder.ondataavailable = (e) => {
      if (e.data && e.data.size > 0) chunks.push(e.data);
    };
    mediaRecorder.start();
    return { ok: true };
  }

  function stopRecording() {
    return new Promise((resolve) => {
      if (!mediaRecorder || mediaRecorder.state === "inactive") {
        resolve({ ok: false, reason: "not-recording" });
        return;
      }
      mediaRecorder.onstop = () => {
        const type = mediaRecorder.mimeType || "audio/webm";
        const blob = new Blob(chunks, { type });
        if (lastBlobUrl) URL.revokeObjectURL(lastBlobUrl);
        lastBlobUrl = URL.createObjectURL(blob);
        resolve({ ok: true, blob, url: lastBlobUrl });
      };
      mediaRecorder.stop();
    });
  }

  /**
   * Optional rough ASR — English/Icelandic models are NOT historical ON.
   */
  function runRoughRecognition(opts) {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      return Promise.resolve({
        available: false,
        note: "Web Speech API not available in this browser."
      });
    }
    return new Promise((resolve) => {
      const rec = new Ctor();
      rec.lang = opts && opts.lang ? opts.lang : "en-US";
      rec.interimResults = false;
      rec.maxAlternatives = 3;
      let done = false;
      const finish = (payload) => {
        if (done) return;
        done = true;
        resolve(payload);
      };
      rec.onresult = (ev) => {
        const alts = [];
        for (let i = 0; i < ev.results[0].length; i++) {
          alts.push(ev.results[0][i].transcript);
        }
        finish({
          available: true,
          transcripts: alts,
          warning:
            "ROUGH AID ONLY — browser speech recognition is trained on modern languages (often English). It is NOT a historical Old Norse evaluator and must never be treated as ground truth. MODERN ICELANDIC ASR/TTS is also NOT Old Norse."
        });
      };
      rec.onerror = (ev) => {
        finish({
          available: true,
          error: ev.error,
          warning:
            "Recognition failed or was blocked. Rely on record + playback + self-rate against historical cues."
        });
      };
      rec.onend = () => {
        finish({
          available: true,
          transcripts: [],
          warning: "No recognition result. Use self-rating checklist."
        });
      };
      try {
        rec.start();
      } catch (e) {
        finish({ available: false, error: String(e) });
      }
    });
  }

  function getPermissionState() {
    return permissionState;
  }

  global.NORDRONA = global.NORDRONA || {};
  global.NORDRONA.voice = {
    requestMic,
    startRecording,
    stopRecording,
    stopStream,
    runRoughRecognition,
    getPermissionState,
    isSecureContextOk,
    getSpeechRecognitionCtor,
    getLastUrl: () => lastBlobUrl
  };
})(window);
