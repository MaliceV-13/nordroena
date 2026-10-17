"""Generate reconstructed-pronunciation audio for Norðrœna from IPA (not spelling).

Engine: Piper VITS neural TTS, voice is_IS-steinn-medium (generic synthetic male voice; native θ ð ɣ and rolled r),
driven directly by phoneme input. For each item, a few phoneme spellings x takes are synthesized and the clearest is
chosen with a wav2vec2 phoneme recogniser (/workspace/nr_voice/harness.py; optional — without it the canonical
spelling and default take are used).
Post-processing (ffmpeg): highpass 70 Hz; rubberband pitch -1 semitone (formants preserved); EQ +2.5 dB @140 Hz
(warmth), +1.5 dB @3.2 kHz (articulation); de-esser; silence trim; ~-17 dBFS speech RMS, peak <= -1 dBFS;
mono 22.05 kHz 48 kbps MP3. Slow version = the same take time-stretched to 0.7x speed (pitch preserved).

Usage: python3 tools/gen_audio.py [--no-asr] [--only slug,slug]
Writes audio/<slug>.mp3, audio/<slug>-slow.mp3, audio/manifest.json, data/pronunciation.js.
"""
import argparse, itertools, json, re, subprocess, sys, tempfile, wave
from pathlib import Path
import numpy as np
from piper import PiperVoice
from piper.config import SynthesisConfig

ROOT = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(ROOT / "tools"))
from pron_items import ITEMS, APP_KEYS

MODEL = "/workspace/nr_voice/models/is_IS-steinn-medium.onnx"
LENGTH_SCALE = 1.35          # slightly slow, careful delivery
PITCH = 0.944                # -1 semitone
VOWELS = "aeiouyøɛɔæœɪʏ"  # nucleus starts

def stress_before_vowel(s):
    """IPA puts ˈ before the syllable onset; the model (espeak-style) wants it before the vowel nucleus."""
    return re.sub(r"ˈ([^" + VOWELS + r"\s,.]*)", r"\1ˈ", s)

# Choices tried per item (first = canonical). The recogniser picks among them.
OPTIONS = {
    "r̩": ["ər", "ʏr"],          # syllabic final r
    "øy": ["øy", "œy"],
    "ø": ["ø", "œ"],
    "o": ["o", "ɔ"],             # short o (the Icelandic voice only knows ɔ natively)
    "eː": ["eː", "ɛː"],
}
DEFAULT = {"e": "ɛ", "ei": "eɪ", "‖": ","}
MULTI = ["r̩", "øy", "ei", "aː", "eː", "iː", "oː", "uː", "yː", "ɛː", "øː", "rː", "nː", "tː", "lː", "kː"]

def tokens(ipa):
    out, i = [], 0
    while i < len(ipa):
        for m in MULTI:
            if ipa.startswith(m, i): out.append(m); i += len(m); break
        else:
            out.append(ipa[i]); i += 1
    return out

def variants(ipa, kind):
    if kind == "sound":
        return [f"{ipa}ː, {ipa}ː." if ipa in "θð" else f"ˈ{ipa}ː, ˈ{ipa}ː."]
    if kind == "pair":
        return ["ˈa, ˈaːː.", "ˈa. ˈaːː."]
    toks = tokens(ipa)
    keys = [k for k in OPTIONS if k in toks]
    out = []
    for combo in itertools.product(*[OPTIONS[k] for k in keys]):
        choice = dict(zip(keys, combo))
        s = "".join(choice.get(t, DEFAULT.get(t, t)) for t in toks).replace(" ,", ",")
        out.append(stress_before_vowel(s).strip() + ".")
    return list(dict.fromkeys(out))

# Hand-tuned extra spellings for words the recogniser found weak in earlier rounds.
EXTRA = {
    "thorr": ["θˈoːrr.", "θˈoːːr.", "θˈoːrː!"],
    "aett": ["ˈɛːtt.", "ˈɛːːtː.", "ʔˈɛːtː."],
    "fjordr": ["fjˈɔːrðər.", "fjˈɔrːðər.", "fjˈɔrðr."],
    "hlaeja": ["hˈlɛːja.", "hlˈɛːːja.", "hlˈæːja.", "hˈlːɛːja.", "hllˈɛːja."],
    "odinn": ["ˈoːðɪnː.", "ˈoːːðinː.", "ˈoːðinn.", "ʔˈoːðinː."],
    "gud": ["ɡˈuðː.", "ɡɡˈuð.", "ɡˈʊð."],
    "land": ["lˈand!", "llˈand.", "lˈandː."],
    "thu": ["θˈuːː.", "θθˈuː."],
    "brodir": ["bbrˈoːðir.", "brˈoːðɪr.", "bɾˈoːðir."],
    "mjok": ["mmjˈɔk.", "mjˈɔkː."],
    "dagr": ["ddˈaɣər.", "dˈaɣɣər."],
    "skogr": ["skˈoːɣɣər.", "skˈoːɣʏr."],
}

def synth(voice, phon, noise):
    a = voice.phoneme_ids_to_audio(voice.phonemes_to_ids(list(phon)),
                                   SynthesisConfig(length_scale=LENGTH_SCALE, noise_scale=noise, noise_w_scale=0.55))
    a = np.asarray(a, np.float32)
    return a / 32768 if np.abs(a).max() > 2 else a

def process(a, sr, out_mp3, tempo=None):
    rb = f"rubberband=pitch={PITCH}:formant=preserved" + (f":tempo={tempo}" if tempo else "")
    filt = ",".join(["highpass=f=70", rb, "equalizer=f=140:t=q:w=1.0:g=2.5", "equalizer=f=3200:t=q:w=1.2:g=1.5",
                     "deesser=i=0.4:m=0.5:f=0.5",
                     "silenceremove=start_periods=1:start_threshold=-45dB:stop_periods=-1:stop_threshold=-45dB:stop_duration=0.35",
                     "adelay=120", "apad=pad_dur=0.25"])
    with tempfile.TemporaryDirectory() as td:
        raw, proc = Path(td, "raw.wav"), Path(td, "proc.wav")
        with wave.open(str(raw), "wb") as w:
            w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes((np.clip(a, -1, 1) * 32767).astype(np.int16).tobytes())
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", str(raw), "-af", filt, "-ar", "22050", str(proc)], check=True)
        with wave.open(str(proc)) as w:
            x = np.frombuffer(w.readframes(w.getnframes()), np.int16).astype(np.float32) / 32768
        loud = np.abs(x) > 0.01
        rms = np.sqrt(np.mean(x[loud] ** 2)) if loud.any() else 0.1
        x = x * min(10 ** (-17 / 20) / rms, 0.89 / max(1e-6, np.abs(x).max()))
        with wave.open(str(proc), "wb") as w:
            w.setnchannels(1); w.setsampwidth(2); w.setframerate(22050); w.writeframes((x * 32767).astype(np.int16).tobytes())
        subprocess.run(["ffmpeg", "-loglevel", "error", "-y", "-i", str(proc), "-ac", "1", "-c:a", "libmp3lame", "-b:a", "48k", str(out_mp3)], check=True)
    return len(x) / 22050

def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--no-asr", action="store_true"); ap.add_argument("--only", default="")
    ap.add_argument("--takes", type=int, default=4); args = ap.parse_args()
    scorer = None
    if not args.no_asr:
        sys.path.insert(0, "/workspace/nr_voice"); import harness as scorer
    voice = PiperVoice.load(MODEL); sr = voice.config.sample_rate
    out_dir = ROOT / "audio"; out_dir.mkdir(exist_ok=True)
    man_path = out_dir / "manifest.json"
    manifest = json.loads(man_path.read_text()) if man_path.exists() else {}
    only = set(filter(None, args.only.split(",")))
    for text, slug, ipa, kind, note in ITEMS:
        if only and slug not in only: continue
        cands = []
        for phon in variants(ipa, kind) + EXTRA.get(slug, []):
            for t in range(args.takes if scorer and kind not in ("sound",) else 1):
                a = synth(voice, phon, 0.39 + 0.09 * t)
                hyp, score = "", 0.0
                if scorer and kind != "sound":
                    hyp = scorer.recognize(a, sr); score = scorer.per(ipa.replace("—", " "), hyp)
                cands.append((round(score, 3), len(cands), phon, hyp, a))
        cands.sort(key=lambda c: (c[0], c[1]))
        score, _, phon, hyp, a = cands[0]
        d1 = process(a, sr, out_dir / f"{slug}.mp3")
        d2 = process(a, sr, out_dir / f"{slug}-slow.mp3", tempo=0.7)
        manifest[text] = {"slug": slug, "ipa": ipa, "modelPhonemes": phon, "asrHeard": hyp, "asrPER": score,
                          "durNormal": round(d1, 2), "durSlow": round(d2, 2), "app": text in APP_KEYS}
        print(f"{text:32} [{ipa}] -> {phon!r:40} heard {hyp!r:28} PER={score:.2f} {d1:.2f}s/{d2:.2f}s", flush=True)
    man_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=1))
    items = {t: {"ipa": i, "note": n, "kind": k, "src": f"audio/{s}.mp3", "slow": f"audio/{s}-slow.mp3"} for t, s, i, k, n in ITEMS}
    js = ("/**\n * Norðrœna — reconstructed pronunciation (synthesized). Generated by tools/gen_audio.py — do not edit by hand.\n"
          " * IPA: Classical Old West Norse, c. 1200 (normalized). Audio: Piper VITS, generic synthetic voice is_IS-steinn-medium, from IPA.\n */\n"
          "window.NORDRONA = window.NORDRONA || {};\nwindow.NORDRONA.pron = " +
          json.dumps({"engine": "Piper VITS (is_IS-steinn-medium, generic synthetic voice) driven by reconstructed IPA; pitch -1 st",
                      "items": items}, ensure_ascii=False, indent=1) + ";\n")
    (ROOT / "data" / "pronunciation.js").write_text(js, encoding="utf-8")

if __name__ == "__main__":
    main()
