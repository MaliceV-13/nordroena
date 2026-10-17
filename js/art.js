/**
 * Norðrœna — original inline SVG art (decorative only).
 * All drawings are original stylisations made for this app; nothing is copied or hotlinked.
 * Every SVG is aria-hidden; captions live in the "About the art & symbols" panel.
 */
(function (global) {
  "use strict";

  const r2 = (n) => Math.round(n * 100) / 100;
  const svg = (vb, inner, cls, extra) =>
    `<svg class="nr-svg ${cls || ""}" viewBox="${vb}" aria-hidden="true" focusable="false" ${extra || ""}>${inner}</svg>`;

  /* ── Elder Futhark, drawn as straight carved strokes (box 8 × 16) ──
     Shapes follow the conventional attested forms (Kylver-stone order). */
  const RUNES = {
    f: "M1 0V16M1 5L7 1M1 9L7 5",
    u: "M1 16V0L7 5V16",
    th: "M1 0V16M1 4L6 8L1 12",
    a: "M1 0V16M1 1L7 5M1 6L7 10",
    r: "M1 16V0L6 4L1 8L7 16",
    k: "M6 4L1 8L6 12",
    g: "M1 2L7 14M7 2L1 14",
    w: "M1 16V0L6 4L1 8",
    h: "M1 0V16M7 0V16M1 6L7 10",
    n: "M4 0V16M1 6L7 10",
    i: "M4 0V16",
    j: "M4 1L1 5L4 9M4 7L7 11L4 15",
    ei: "M4 0V16M4 0L7 3M4 16L1 13",
    p: "M1 0V16M1 0L5 4L7 2M1 16L5 12L7 14",
    z: "M4 16V0M4 6L1 1M4 6L7 1",
    s: "M6 0L2 5L6 11L2 16",
    t: "M4 0V16M1 4L4 0L7 4",
    b: "M1 0V16M1 0L6 4L1 8L6 12L1 16",
    e: "M1 16V0L4 4L7 0V16",
    m: "M1 16V0M7 16V0M1 0L7 8M7 0L1 8",
    l: "M1 16V0L6 5",
    ng: "M4 4L7 8L4 12L1 8Z",
    d: "M1 0V16M7 0V16M1 0L7 16M7 0L1 16",
    o: "M4 2L7 6L1 14M4 2L1 6L7 14"
  };
  const FUTHARK = ["f","u","th","a","r","k","g","w","h","n","i","j","ei","p","z","s","t","b","e","m","l","ng","d","o"];

  function runeGlyph(key, x, y, s) {
    return `<path d="${RUNES[key]}" transform="translate(${r2(x)} ${r2(y)}) scale(${s})"/>`;
  }

  /** Horizontal strip of the 24 Elder Futhark runes (in futhark order). */
  function runeStrip(cls) {
    const gap = 13;
    let inner = "";
    FUTHARK.forEach((k, i) => (inner += runeGlyph(k, 4 + i * gap, 2, 0.75)));
    const w = 4 + FUTHARK.length * gap;
    return svg(`0 0 ${w} 16`, `<g fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${inner}</g>`, "nr-runestrip " + (cls || ""), 'preserveAspectRatio="xMidYMid meet"');
  }

  /** Runes set around a circle (used on the celebration medallion). */
  function runeRing(cx, cy, rad, s) {
    let inner = "";
    FUTHARK.forEach((k, i) => {
      const ang = (i / FUTHARK.length) * 360;
      inner += `<g transform="rotate(${r2(ang)} ${cx} ${cy}) translate(${r2(cx - 4 * s)} ${r2(cy - rad - 8 * s)})"><path d="${RUNES[k]}" transform="scale(${s})"/></g>`;
    });
    return `<g fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${inner}</g>`;
  }

  /* ── Interlace band (Ringerike/Urnes-inspired two-strand ribbon with over/under) ── */
  function wave(x0, x1, mid, amp, period, phase) {
    const pts = [];
    for (let x = x0; x <= x1 + 0.01; x += 3) {
      pts.push(`${r2(x)} ${r2(mid + amp * Math.sin(((x - x0) / period) * Math.PI * 2 + phase))}`);
    }
    return "M" + pts.join("L");
  }
  function ribbon(d) {
    return `<path d="${d}" class="rb-o"/><path d="${d}" class="rb-g"/><path d="${d}" class="rb-c"/>`;
  }
  function knotBand(width, opts) {
    const o = opts || {};
    const h = 24, mid = 12, amp = 7, period = 48;
    const x0 = o.medallion ? 0 : 8, x1 = width - x0;
    const cxM = width / 2;
    let base = "", over;
    const segs = o.medallion
      ? [[x0 + 8, cxM - 22], [cxM + 22, x1 - 8]]
      : [[x0 + 6, x1 - 6]];
    segs.forEach(([a, b]) => {
      base += ribbon(wave(a, b, mid, amp, period, 0)) + ribbon(wave(a, b, mid, amp, period, Math.PI));
    });
    // Re-sample overlays with absolute phase so they lie exactly on the strands
    over = "";
    segs.forEach(([a, b]) => {
      let k = 0;
      for (let xc = a + period / 2; xc < b - 4; xc += period / 2, k++) {
        const s0 = Math.max(a, xc - period / 6), s1 = Math.min(b, xc + period / 6);
        const ph = k % 2 ? 0 : Math.PI;
        const pts = [];
        for (let x = s0; x <= s1 + 0.01; x += 2) {
          pts.push(`${r2(x)} ${r2(mid + amp * Math.sin(((x - a) / period) * Math.PI * 2 + ph))}`);
        }
        over += ribbon("M" + pts.join("L"));
      }
    });
    let ends = "";
    segs.forEach(([a, b]) => {
      ends += `<circle cx="${a - 3}" cy="${mid}" r="3.2" class="rb-dot"/><circle cx="${b + 3}" cy="${mid}" r="3.2" class="rb-dot"/>`;
    });
    const med = o.medallion
      ? `<g transform="translate(${cxM} ${mid})">${triquetraInner(10.5)}</g>`
      : "";
    return svg(`0 0 ${width} ${h}`, `<g class="knot">${base}${over}${ends}${med}</g>`, "nr-knot " + (o.cls || ""), 'preserveAspectRatio="xMidYMid meet"');
  }

  /* ── Triquetra: three lenses (vesicae) from three circles ── */
  function triquetraInner(R) {
    const a = R * 0.62;
    const C = [-90, 30, 150].map((d) => [a * Math.cos((d * Math.PI) / 180), a * Math.sin((d * Math.PI) / 180)]);
    const rr = R * 0.86;
    let paths = "";
    [[0, 1], [1, 2], [2, 0]].forEach(([i, j]) => {
      const [x1, y1] = C[i], [x2, y2] = C[j];
      const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
      const dx = x2 - x1, dy = y2 - y1, D = Math.hypot(dx, dy);
      const hh = Math.sqrt(Math.max(0, rr * rr - (D / 2) * (D / 2)));
      const ux = -dy / D, uy = dx / D;
      const P = [mx + ux * hh, my + uy * hh], Q = [mx - ux * hh, my - uy * hh];
      const d = `M${r2(P[0])} ${r2(P[1])}A${r2(rr)} ${r2(rr)} 0 0 1 ${r2(Q[0])} ${r2(Q[1])}A${r2(rr)} ${r2(rr)} 0 0 1 ${r2(P[0])} ${r2(P[1])}Z`;
      paths += `<path d="${d}" class="tq-o"/><path d="${d}" class="tq-g"/>`;
    });
    return `<g class="triq" fill="none"><circle r="${r2(R * 0.5)}" class="tq-o"/><circle r="${r2(R * 0.5)}" class="tq-g"/>${paths}</g>`;
  }
  function triquetra(cls) {
    return svg("-24 -24 48 48", triquetraInner(19), "nr-triq " + (cls || ""));
  }

  /* ── Valknut: three interlocking triangles ── */
  function valknut(cls) {
    const L = 30, s = 5.5;
    let inner = "";
    [-90, 30, 150].forEach((deg) => {
      const ox = s * Math.cos((deg * Math.PI) / 180), oy = s * Math.sin((deg * Math.PI) / 180);
      const pts = [-90, 30, 150]
        .map((d) => `${r2(ox + (L / Math.sqrt(3)) * Math.cos((d * Math.PI) / 180))},${r2(oy + 4 + (L / Math.sqrt(3)) * Math.sin((d * Math.PI) / 180))}`)
        .join(" ");
      inner += `<polygon points="${pts}"/>`;
    });
    return svg("-24 -24 48 48", `<g fill="none" stroke="currentColor" stroke-width="2.6" stroke-linejoin="miter">${inner}</g>`, "nr-valknut " + (cls || ""));
  }

  /* ── Mjǫllnir pendant (loop, shaft, flared head, punched dots) ── */
  function mjolnir(cls) {
    const head = "M42 50H58C60 68 74 84 93 94L91 108C64 101 36 101 9 108L7 94C26 84 40 68 42 50Z";
    return svg("0 0 100 116",
      `<g fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round">
        <circle cx="50" cy="11" r="7.5"/>
        <path d="M44 19H56L58 50H42Z"/>
        <path d="${head}" fill="currentColor" fill-opacity="0.14"/>
        <path d="M50 56V100M20 98C30 90 40 82 46 70M80 98C70 90 60 82 54 70" stroke-width="1.5"/>
      </g>
      <g fill="currentColor">
        <circle cx="30" cy="99" r="2"/><circle cx="70" cy="99" r="2"/><circle cx="40" cy="90" r="1.7"/><circle cx="60" cy="90" r="1.7"/><circle cx="50" cy="30" r="2"/><circle cx="50" cy="40" r="2"/>
      </g>`, "nr-mjolnir " + (cls || ""));
  }

  /* ── Raven (flying) — Huginn & Muninn ── */
  const RAVEN_FLY =
    "M2 24C9 20 16 19 23 21C26 13 33 6 44 3C39 9 36 14 35 19C38 17 41 16 44 17L47 15L46 18C49 19 52 21 56 22C52 23 49 23 47 24C45 27 41 29 37 29L41 36L34 30C30 31 25 30 21 28C14 28 8 27 2 24Z";
  const RAVEN_PERCH =
    "M18 6C22 3 28 4 30 8L36 10L30 12C31 16 31 20 34 26C38 30 44 34 50 40L44 39L46 44L39 38C33 37 26 35 21 31C16 27 14 21 15 15C15 11 16 8 18 6ZM24 40L23 46M28 40L28 46M20 47H32";
  function raven(cls, flip) {
    return svg("0 0 58 40", `<path d="${RAVEN_FLY}" fill="currentColor" ${flip ? 'transform="translate(58 0) scale(-1 1)"' : ""}/><circle cx="${flip ? 13 : 45}" cy="20" r="0.9" fill="#d9b25f"/>`, "nr-raven " + (cls || ""));
  }
  function ravens(cls) {
    return svg("0 0 64 48",
      `<path d="${RAVEN_PERCH}" fill="currentColor" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round" transform="translate(-6 0) scale(0.95)"/>
       <path d="${RAVEN_PERCH}" fill="currentColor" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round" opacity="0.7" transform="translate(70 2) scale(-0.95 0.95)"/>`,
      "nr-ravens " + (cls || ""));
  }

  /* ── Longship (dragon prow, striped sail, shields, oars) ── */
  function longship(cls) {
    let shields = "", oars = "";
    for (let x = 30; x <= 92; x += 12) {
      shields += `<circle cx="${x}" cy="47" r="4.6" class="ls-shield"/><circle cx="${x}" cy="47" r="1.2" fill="currentColor"/>`;
      oars += `<path d="M${x + 4} 50L${x - 4} 62"/>`;
    }
    return svg("0 0 124 72",
      `<g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M62 44V6"/>
        <path d="M40 9H84L87 38C76 42 48 42 37 38Z" fill="currentColor" fill-opacity="0.1"/>
        <path d="M51 9.5L48.5 40.5M62 9V41.5M73 9.5L75.5 40.5" stroke-width="1.4"/>
        <g stroke-width="1.6">${oars}</g>
        <path d="M14 44C26 57 98 57 110 44L113 40C116 30 120 22 115 15C111 11 106 14 108 18C110 21 113 19 112 17" />
        <path d="M14 44L11 40C8 31 5 26 9 20C12 16 16 19 14 22"/>
        <path d="M16 46C30 53 94 53 108 46" stroke-width="1.4"/>
        ${shields}
        <path d="M4 66C12 62 20 70 28 66S44 62 52 66S68 70 76 66S92 62 100 66S116 70 122 66" stroke-width="1.5" opacity="0.7"/>
      </g>`, "nr-longship " + (cls || ""));
  }

  /* ── Bifrǫst: three-coloured arch (Snorri's "þrílitr") ── */
  function bifrost(cls) {
    return svg("0 0 64 40",
      `<g fill="none" stroke-linecap="round" stroke-width="4">
        <path d="M6 36A26 26 0 0 1 58 36" stroke="#c0643a"/>
        <path d="M12 36A20 20 0 0 1 52 36" stroke="#d9b25f"/>
        <path d="M18 36A14 14 0 0 1 46 36" stroke="#6f9a8a"/>
      </g>
      <path d="M2 37H62" stroke="currentColor" stroke-width="1.6"/>`, "nr-bifrost " + (cls || ""));
  }

  /* ── Runestone (with ochre serpent band, as on painted Viking-Age stones) ── */
  function runestone(cls) {
    return svg("0 0 48 64",
      `<path d="M8 62C6 40 6 22 12 12C17 4 31 2 37 9C43 17 43 40 41 62Z" fill="#4a4f52" stroke="currentColor" stroke-width="1.6"/>
       <path d="M13 58C11 40 12 24 16 16C20 9 29 8 33 13C37 19 37 38 36 58" fill="none" stroke="#b5562e" stroke-width="3" stroke-linecap="round"/>
       <g fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${runeGlyph("n", 20, 26, 1)}</g>`,
      "nr-runestone " + (cls || ""));
  }

  /* ── Shield (round, with boss) ── */
  function shield(cls) {
    return svg("0 0 48 48",
      `<g fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="24" cy="24" r="20" fill="currentColor" fill-opacity="0.1"/><circle cx="24" cy="24" r="6" fill="currentColor" fill-opacity="0.35"/>
       <path d="M24 4V18M24 30V44M4 24H18M30 24H44" stroke-width="1.4"/></g>`, "nr-shield " + (cls || ""));
  }

  /* ── Horn (speak drills) ── */
  function horn(cls) {
    return svg("0 0 48 48",
      `<g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
        <path d="M6 14C14 12 30 18 40 36L44 34C38 18 22 6 6 8Z" fill="currentColor" fill-opacity="0.15"/>
        <path d="M14 11.5L13 15.5M24 14L22 18.5M33 21L30 25" stroke-width="1.6"/>
        <path d="M40 36C41 39 44 39 44 34" />
      </g>`, "nr-horn " + (cls || ""));
  }

  /* ── Manuscript (notes / lore) ── */
  function manuscript(cls) {
    return svg("0 0 48 48",
      `<g fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round">
        <path d="M24 12C18 8 10 8 5 10V40C10 38 18 38 24 42C30 38 38 38 43 40V10C38 8 30 8 24 12Z" fill="currentColor" fill-opacity="0.1"/>
        <path d="M24 12V42"/><path d="M10 17H19M10 22H19M10 27H17M29 17H38M29 22H38M29 27H36" stroke-width="1.3"/>
      </g>`, "nr-manuscript " + (cls || ""));
  }

  /* ── Padlock in iron (locked shells) ── */
  function ironLock(cls) {
    return svg("0 0 48 48",
      `<g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round"><path d="M15 22V15C15 9 33 9 33 15V22"/><rect x="10" y="22" width="28" height="20" rx="3" fill="currentColor" fill-opacity="0.12"/><path d="M24 29V35" stroke-linecap="round"/></g>`,
      "nr-lock " + (cls || ""));
  }

  /* ── Warning (ON vs MI trap) — iron triangle ── */
  function warnMark(cls) {
    return svg("0 0 48 48",
      `<g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"><path d="M24 7L43 40H5Z" fill="currentColor" fill-opacity="0.1"/><path d="M24 19V29"/><circle cx="24" cy="34.5" r="0.6" fill="currentColor"/></g>`,
      "nr-warn " + (cls || ""));
  }

  /* ── Yggdrasil (seeded recursive branches, three roots) ── */
  function treeLines(x, y, len, ang, depth, w, out, tips, rnd, dir) {
    const x2 = x + len * Math.cos(ang), y2 = y + len * Math.sin(ang);
    out.push(`<path d="M${r2(x)} ${r2(y)}L${r2(x2)} ${r2(y2)}" stroke-width="${r2(w)}"/>`);
    if (depth <= 0) { tips.push([x2, y2]); return; }
    const spread = 0.42 + rnd() * 0.12;
    const k = 0.7 + rnd() * 0.06;
    treeLines(x2, y2, len * k, ang - spread, depth - 1, w * 0.68, out, tips, rnd, dir);
    treeLines(x2, y2, len * k, ang + spread, depth - 1, w * 0.68, out, tips, rnd, dir);
    if (depth === 4 && dir < 0) treeLines(x2, y2, len * k * 0.8, ang, depth - 2, w * 0.6, out, tips, rnd, dir);
  }
  function seeded(seed) {
    let s = seed;
    return () => ((s = (s * 16807) % 2147483647) / 2147483647);
  }
  function yggdrasilInner(cx, cy, scale, depth) {
    const rnd = seeded(7);
    const out = [], tips = [], roots = [], rtips = [];
    const trunkTop = cy - 22 * scale;
    out.push(`<path d="M${cx - 5 * scale} ${cy + 6 * scale}C${cx - 3 * scale} ${cy - 6 * scale} ${cx - 3 * scale} ${cy - 14 * scale} ${cx} ${trunkTop}C${cx + 3 * scale} ${cy - 14 * scale} ${cx + 3 * scale} ${cy - 6 * scale} ${cx + 5 * scale} ${cy + 6 * scale}Z" fill="currentColor" stroke="none"/>`);
    treeLines(cx, trunkTop, 12.5 * scale, -Math.PI / 2 - 0.5, depth, 3.4 * scale, out, tips, rnd, -1);
    treeLines(cx, trunkTop, 12.5 * scale, -Math.PI / 2 + 0.5, depth, 3.4 * scale, out, tips, rnd, -1);
    treeLines(cx, trunkTop + 4 * scale, 11 * scale, -Math.PI / 2, depth - 2, 2.6 * scale, out, tips, rnd, -1);
    // three roots (Grímnismál 31; Gylfaginning 15)
    [Math.PI / 2 + 0.9, Math.PI / 2, Math.PI / 2 - 0.9].forEach((a) =>
      treeLines(cx, cy + 4 * scale, 11 * scale, a, Math.max(1, depth - 3), 2.6 * scale, roots, rtips, rnd, 1)
    );
    const leaves = tips.map(([x, y]) => `<circle cx="${r2(x)}" cy="${r2(y)}" r="${r2(1.5 * scale)}"/>`).join("");
    return `<g class="ygg" fill="none" stroke="currentColor" stroke-linecap="round">${out.join("")}${roots.join("")}</g><g class="ygg-leaves" fill="#d9b25f">${leaves}</g>`;
  }
  function yggdrasil(cls) {
    return svg("0 0 100 100", `<circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" stroke-width="1.6" opacity="0.6"/>${yggdrasilInner(50, 66, 1.02, 5)}`, "nr-ygg " + (cls || ""));
  }

  /** Hero banner: Yggdrasil under the night sky, ravens either side, rune arch. */
  function heroArt() {
    const stars = [];
    const rnd = seeded(42);
    for (let i = 0; i < 28; i++) {
      stars.push(`<circle cx="${r2(rnd() * 360)}" cy="${r2(rnd() * 120)}" r="${r2(0.4 + rnd() * 0.9)}" opacity="${r2(0.35 + rnd() * 0.6)}"/>`);
    }
    let arch = "";
    FUTHARK.forEach((k, i) => {
      const t = Math.PI + (i + 0.5) * (Math.PI / FUTHARK.length);
      const x = 180 + 150 * Math.cos(t), y = 196 + 150 * Math.sin(t);
      const rot = (t * 180) / Math.PI + 90;
      arch += `<g transform="translate(${r2(x)} ${r2(y)}) rotate(${r2(rot)}) translate(-3 -6)"><path d="${RUNES[k]}" transform="scale(0.75)"/></g>`;
    });
    return svg("0 0 360 210",
      `<defs>
        <radialGradient id="nrHeroGlow" cx="50%" cy="62%" r="55%"><stop offset="0" stop-color="#d9b25f" stop-opacity="0.22"/><stop offset="1" stop-color="#d9b25f" stop-opacity="0"/></radialGradient>
      </defs>
      <rect width="360" height="210" fill="url(#nrHeroGlow)"/>
      <g fill="#f3e7c7">${stars.join("")}</g>
      <path d="M296 30A14 14 0 1 0 310 50A11 11 0 1 1 296 30Z" fill="#e9d9b0" opacity="0.85"/>
      <path d="M30 196A150 150 0 0 1 330 196" fill="none" stroke="#d9b25f" stroke-opacity="0.35" stroke-width="1"/>
      <path d="M44 196A136 136 0 0 1 316 196" fill="none" stroke="#d9b25f" stroke-opacity="0.25" stroke-width="1"/>
      <g fill="none" stroke="#d9b25f" stroke-opacity="0.75" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">${arch}</g>
      <g color="#e0c071">${yggdrasilInner(180, 168, 2.3, 6)}</g>
      <g transform="translate(56 74) scale(0.9)" color="#14110d" class="hero-raven hr-1"><path d="${RAVEN_FLY}" fill="#0b0a09" stroke="#8a7a55" stroke-width="0.8"/></g>
      <g transform="translate(304 96) scale(-0.8 0.8)" class="hero-raven hr-2"><path d="${RAVEN_FLY}" fill="#0b0a09" stroke="#8a7a55" stroke-width="0.8"/></g>
      <path d="M0 200C60 190 120 196 180 192S300 190 360 200V210H0Z" fill="#0b0d0c"/>`,
      "nr-hero-art", 'preserveAspectRatio="xMidYMid meet"');
  }

  /** Brand / app emblem: Yggdrasil in a runestone-shaped frame. */
  function emblem(cls) {
    return svg("0 0 64 64",
      `<path d="M12 60C9 38 10 20 18 11C25 3 40 3 46 11C54 20 55 38 52 60Z" fill="#1d2320" stroke="#d9b25f" stroke-width="2.2"/>
       <path d="M17 56C15 38 16 23 22 15C27 9 37 9 42 15C48 23 49 38 47 56" fill="none" stroke="#b5562e" stroke-width="2.2" stroke-linecap="round"/>
       <g color="#e0c071">${yggdrasilInner(32, 47, 0.56, 4)}</g>`, "nr-emblem " + (cls || ""));
  }

  /** Celebration medallion: rune ring around a triquetra, with gold rays. */
  function medallion() {
    let rays = "";
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2;
      rays += `<path d="M${r2(60 + 46 * Math.cos(a))} ${r2(60 + 46 * Math.sin(a))}L${r2(60 + (i % 2 ? 54 : 58) * Math.cos(a))} ${r2(60 + (i % 2 ? 54 : 58) * Math.sin(a))}"/>`;
    }
    return svg("0 0 120 120",
      `<g class="med-rays" stroke="#d9b25f" stroke-width="2" stroke-linecap="round">${rays}</g>
       <circle cx="60" cy="60" r="43" fill="#15120d" stroke="#d9b25f" stroke-width="2"/>
       <circle cx="60" cy="60" r="27" fill="none" stroke="#d9b25f" stroke-width="1" opacity="0.6"/>
       <g class="med-ring" color="#e0c071">${runeRing(60, 60, 28, 0.62)}</g>
       <g transform="translate(60 60)" class="med-core">${triquetraInner(15)}</g>`, "nr-medallion");
  }

  /** Small falling gold runes for the celebration (pure CSS animation). */
  function runeShower() {
    const rnd = seeded(11);
    let out = "";
    for (let i = 0; i < 14; i++) {
      const k = FUTHARK[Math.floor(rnd() * FUTHARK.length)];
      out += `<span class="rs" style="left:${r2(rnd() * 94)}%;animation-delay:${r2(rnd() * 1.6)}s;animation-duration:${r2(2.4 + rnd() * 1.6)}s">${svg("-1 -1 10 18", `<path d="${RUNES[k]}" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/>`)}</span>`;
    }
    return `<div class="rune-shower" aria-hidden="true">${out}</div>`;
  }

  /* ── Mapping: sections, units and level types → themed icons ── */
  const SECTION_ICON = { s1: yggdrasil, s2: bifrost, s3: longship };
  const UNIT_ICON = { u1: runestone, u2: ravens, u3: manuscript, u4: mjolnir, u5: shield, u6: triquetra, u7: valknut, u8: longship };
  function sectionIcon(id) { return (SECTION_ICON[id] || yggdrasil)("sec-icon"); }
  function unitIcon(id) { return (UNIT_ICON[id] || runestone)("unit-icon"); }

  const EMOJI_ICON = {
    "🎤": horn, "🎧": () => raven("node-svg"), "📜": manuscript, "🔒": ironLock, "★": shield, "⚠": warnMark, "↻": triquetra
  };
  /** Returns themed SVG for emoji-style level icons, or null to keep the text glyph. */
  function nodeIcon(icon) {
    const f = EMOJI_ICON[icon];
    if (f) return f("node-svg");
    return runeSvg(icon, "node-svg node-rune");
  }

  /** Fixed backdrop: starfield + aurora bands (motion disabled for reduced-motion users in CSS). */
  function backdrop() {
    return `<div class="nr-sky" aria-hidden="true"><div class="nr-stars"></div><div class="nr-aurora a1"></div><div class="nr-aurora a2"></div></div>`;
  }



  /* Unicode rune → stroke drawing (fonts on many phones lack the Runic block) */
  const RUNE_CHAR = {
    "ᚠ": "f", "ᚢ": "u", "ᚦ": "th", "ᚨ": "a", "ᚱ": "r", "ᚲ": "k", "ᚷ": "g", "ᚹ": "w", "ᚺ": "h", "ᚾ": "n", "ᛁ": "i", "ᛃ": "j",
    "ᛇ": "ei", "ᛈ": "p", "ᛉ": "z", "ᛊ": "s", "ᛏ": "t", "ᛒ": "b", "ᛖ": "e", "ᛗ": "m", "ᛚ": "l", "ᛜ": "ng", "ᛞ": "d", "ᛟ": "o"
  };
  function runeSvg(ch, cls) {
    const k = RUNE_CHAR[String(ch || "").trim()];
    if (!k) return null;
    return svg("-2 -2 12 20", `<path d="${RUNES[k]}" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>`, "nr-rune " + (cls || ""));
  }

  /** Round runic emblem: gold rings, rune ring, icy n-rune (ᚾ) at the centre. */
  function roundEmblem(cls) {
    let dots = "";
    for (let i = 0; i < 16; i++) {
      const a = (i / 16) * Math.PI * 2;
      dots += `<circle cx="${r2(32 + 25.5 * Math.cos(a))}" cy="${r2(32 + 25.5 * Math.sin(a))}" r="1.1"/>`;
    }
    return svg("0 0 64 64",
      `<circle cx="32" cy="32" r="30" fill="#141416" stroke="#d9b25f" stroke-width="2.2"/>
       <circle cx="32" cy="32" r="22.5" fill="#0d0d0f" stroke="#a9adb3" stroke-width="1"/>
       <g fill="#d9b25f">${dots}</g>
       <g class="rune-glow-svg" fill="none" stroke="#bfe6ff" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round">
         <path d="M32 16V48M25 27L39 37M25 37L39 27" />
       </g>`, "nr-round-emblem " + (cls || ""));
  }

  /* Tab-bar icons */
  const TAB_ICON = {
    home: `<path d="M8 40C8 32 18 32 24 28S36 18 28 14S14 10 18 6" fill="none" stroke-dasharray="1 4.2" stroke-width="3"/><circle cx="8" cy="40" r="3.4"/><circle cx="18" cy="6" r="3.4"/>`,
    lesson: `<path d="M24 12C18 8 10 8 5 10V40C10 38 18 38 24 42C30 38 38 38 43 40V10C38 8 30 8 24 12Z"/><path d="M24 12V42"/>`,
    charter: `<path d="M12 6H36V42H12Z"/><path d="M8 6H40M8 42H40"/><path d="M22 14V34M22 14L28 18L22 22L28 34" stroke-width="2"/>`,
    futhark: `<path d="M12 44C10 28 11 16 16 10C20 5 30 5 33 10C38 16 38 28 36 44Z"/><path d="M24 16V36M24 21L29 25L24 29" stroke-width="2"/>`,
    review: `<path d="M24 4L40 10V22C40 33 33 40 24 44C15 40 8 33 8 22V10Z"/><path d="M24 14V34M17 22H31" stroke-width="2"/>`
  };
  function tabIcon(view) {
    return svg("0 0 48 48", `<g fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">${TAB_ICON[view] || ""}</g>`, "tab-icon");
  }
  function flame(cls) {
    return svg("0 0 24 24", `<path d="M12 2C13 7 18 9 18 15A6 6 0 0 1 6 15C6 11 9 10 9 6C11 8 11 9 12 2Z" fill="currentColor"/><path d="M12 12C13 14 15 15 15 17A3 3 0 0 1 9 17C9 15 11 15 12 12Z" fill="#141416"/>`, "pill-icon " + (cls || ""));
  }
  function star(cls) {
    return svg("0 0 24 24", `<path d="M12 2L14.9 8.6L22 9.3L16.6 14L18.2 21L12 17.3L5.8 21L7.4 14L2 9.3L9.1 8.6Z" fill="currentColor"/>`, "pill-icon " + (cls || ""));
  }
  /** Section medallion: copper disc with the section's emblem. */
  function sectionMedallion(id) {
    const f = { s1: longship, s2: bifrost, s3: yggdrasil }[id] || longship;
    return `<span class="sec-medallion" aria-hidden="true">${f("sec-med-svg")}</span>`;
  }

  /* ── User-supplied artwork (compressed copies in img/; build inlines them) ── */
  const IMG = {
    "yggdrasil-tinted": ["img/yggdrasil-tinted.webp", "img/yggdrasil-tinted.jpg", 614, 858],
    "horn-warrior": ["img/horn-warrior.webp", "img/horn-warrior.jpg", 399, 501],
    "mjolnir-knotwork": ["img/mjolnir-knotwork.webp", "img/mjolnir-knotwork.jpg", 476, 1000],
    "odin-throne": ["img/odin-throne.webp", "img/odin-throne.jpg", 566, 1000],
    "cliff-god": ["img/cliff-god.webp", "img/cliff-god.jpg", 588, 393],
    "serpent-eye": ["img/serpent-eye.webp", "img/serpent-eye.jpg", 371, 554],
    "forest-sage": ["img/forest-sage.webp", "img/forest-sage.jpg", 526, 698],
    "odin-ravens-bw": ["img/odin-ravens-bw.webp", "img/odin-ravens-bw.jpg", 225, 225],
    "odin-ravens-storm": ["img/odin-ravens-storm.webp", "img/odin-ravens-storm.jpg", 168, 300],
    "odin-wolves": ["img/odin-wolves.webp", "img/odin-wolves.jpg", 189, 267]
  };
  /** <picture> with WebP source + JPEG fallback. Decorative (alt=""). */
  function picture(key, cls, opts) {
    const im = IMG[key];
    if (!im) return "";
    const o = opts || {};
    const pos = o.pos ? ` style="object-position:${o.pos}"` : "";
    return `<picture class="nr-pic ${cls || ""}"><source type="image/webp" srcset="${im[0]}"><img src="${im[1]}" alt="" width="${im[2]}" height="${im[3]}" decoding="async" ${o.eager ? "" : 'loading="lazy"'}${pos}></picture>`;
  }
  const SECTION_ART = {
    s1: ["odin-throne", "50% 16%"],
    s2: ["cliff-god", "62% 40%"],
    s3: ["horn-warrior", "50% 30%"]
  };
  function sectionArt(id, cls) {
    const a = SECTION_ART[id];
    return a ? picture(a[0], cls, { pos: a[1] }) : "";
  }

  const memo = {};
  const cached = (key, fn) => (...args) => {
    const k = key + JSON.stringify(args);
    return memo[k] || (memo[k] = fn(...args));
  };

  global.NORDRONA = global.NORDRONA || {};
  global.NORDRONA.art = {
    RUNES, FUTHARK, runeStrip: cached("rs", runeStrip), knotBand: cached("kb", knotBand), triquetra, valknut, mjolnir,
    raven, ravens, longship, bifrost, runestone, shield, horn, manuscript, ironLock, warnMark,
    yggdrasil: cached("yg", yggdrasil), heroArt: cached("hero", heroArt), emblem: cached("em", emblem),
    medallion: cached("med", medallion), runeShower: cached("shower", runeShower),
    sectionIcon, unitIcon, nodeIcon, backdrop, picture, sectionArt, IMG,
    runeSvg, roundEmblem: cached("re", roundEmblem), tabIcon, flame, star, sectionMedallion
  };
})(window);
