# Install / open Norðrœna

## Option A — local static server (recommended)

```bash
cd /path/to/OldNorseCourse
python3 -m http.server 8080
```

Open: [http://localhost:8080](http://localhost:8080)

## Option B — standalone file

Open `nordroena-standalone.html` in a modern browser (good for iPhone Safari). Mic still prefers localhost/HTTPS.

## Option C — open `index.html` directly

Reading and TTS often work; **microphone may fail** outside a secure context.

## Reset progress

Path home → **Reset all progress**, or clear site data (`nordrona_progress_v2`, TTS keys `nordrona_tts_*`).

## Rebuild bundle / zip

```bash
python3 build_standalone.py
```
