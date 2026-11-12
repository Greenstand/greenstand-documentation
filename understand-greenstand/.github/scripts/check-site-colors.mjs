#!/usr/bin/env node
// Check the colors of the site look (site-colors.mjs), in light and in dark mode:
// - The colors that the pages use by name are there.
// - Each color is a pair [light, dark] of 6-digit hex colors, because the pages use them as they
//   are.
// - Each text color has a contrast of 4.5:1 or more on each background (WCAG 2.2 AA).
// - The parcel field (the ink color at PARCEL_FIELD_INK_SHARE on the ground) has a contrast of
//   1.25:1 or less with the ground, so the field stays in the background. Each text color has a
//   contrast of 4.5:1 or more on the field, because the title and the estate strip lie on it. The
//   ink share is more than 0, so the field shows.
// - The ink labels of the diagram nodes have a contrast of 4.5:1 or more on the node of each area
//   color: the area color at DIAGRAM_NODE_TINT on the ground.
// - Each area color is 10 or more (CIE76) from each state color. Thus an area color does not
//   look like the color of a state.
// - Each two area colors are 10 or more apart (CIEDE2000) for normal vision, and for simulated
//   protanopia and deuteranopia (red-green color blindness; Machado 2009, severity 1). Thus
//   readers with red-green color blindness can tell the areas apart too.
// It shows every error at once.
// Usage: node check-site-colors.mjs   exit 1 and show each error (CI)
import { AREA_COLORS, BACKGROUNDS, DIAGRAM_NODE_TINT, LINES, PARCEL_FIELD_INK_SHARE, STATES, TEXTS } from "./site-colors.mjs";

const SCHEMES = ["light", "dark"];
const MIN_CONTRAST = 4.5;
const MAX_FIELD_CONTRAST = 1.25;
const MIN_STATE_DISTANCE = 10; // CIE76
const MIN_AREA_DISTANCE = 10; // CIEDE2000

// Each kind of color, its colors, and the names that the pages use (var(--<name>)). The area
// colors have no fixed names: estate.mjs checks the color of each area of estate.json.
const KINDS = [
  ["background", BACKGROUNDS, ["ground", "surface"]],
  ["text color", TEXTS, ["ink", "muted", "link", ...STATES]],
  ["line color", LINES, ["line"]],
  ["area color", AREA_COLORS, []],
];

const errors = [];
// The valid colors of each kind: name -> [light, dark]. A color of the wrong form gets an error,
// and the other checks skip it.
const valid = new Map(KINDS.map(([kind]) => [kind, new Map()]));
for (const [kind, colors, used] of KINDS) {
  for (const name of used) if (!Object.hasOwn(colors, name)) errors.push(`the ${kind} ${name} is missing: the pages use var(--${name})`);
  for (const [name, pair] of Object.entries(colors)) {
    if (!Array.isArray(pair) || pair.length !== 2) {
      errors.push(`the ${kind} ${name} must be a pair of colors: [light, dark]`);
      continue;
    }
    const wrong = [0, 1].filter((i) => typeof pair[i] !== "string" || !/^#[0-9a-f]{6}$/i.test(pair[i]));
    for (const i of wrong) {
      errors.push(`the ${kind} ${name} (${SCHEMES[i]}) must be a color of 6 hex digits, for example #1b2420; it is ${JSON.stringify(pair[i])}`);
    }
    if (!wrong.length) valid.get(kind).set(name, pair);
  }
}

// The ink share of the parcel field, for each scheme: a percent above 0 and at most 100.
const inkShare = [];
if (!Array.isArray(PARCEL_FIELD_INK_SHARE) || PARCEL_FIELD_INK_SHARE.length !== 2) {
  errors.push("the ink share of the parcel field must be a pair of percents: [light, dark]");
} else {
  SCHEMES.forEach((scheme, i) => {
    const p = PARCEL_FIELD_INK_SHARE[i];
    if (typeof p === "number" && p > 0 && p <= 100) inkShare[i] = p;
    else errors.push(`the ink share of the parcel field (${scheme}) must be a percent above 0 and at most 100; it is ${typeof p === "number" ? p : JSON.stringify(p)}`);
  });
}

// The diagram node tint: a percent above 0 and at most 100.
const nodeTint = typeof DIAGRAM_NODE_TINT === "number" && DIAGRAM_NODE_TINT > 0 && DIAGRAM_NODE_TINT <= 100 ? DIAGRAM_NODE_TINT : undefined;
if (nodeTint === undefined) {
  errors.push(`the diagram node tint must be a percent above 0 and at most 100; it is ${typeof DIAGRAM_NODE_TINT === "number" ? DIAGRAM_NODE_TINT : JSON.stringify(DIAGRAM_NODE_TINT)}`);
}

// The red, green, and blue channels of a hex color (sRGB, 0 to 1), and their linear values.
const channels = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) / 255);
const toLinear = (c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
const fromLinear = (c) => (c <= 0.0031308 ? 12.92 * c : 1.055 * c ** (1 / 2.4) - 0.055);
// The relative luminance and the contrast ratio of WCAG 2.2.
const luminance = (rgb) => {
  const [r, g, b] = rgb.map(toLinear);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const contrast = (a, b) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
};
// CIELAB (D65 white).
function lab(rgb) {
  const [r, g, b] = rgb.map(toLinear);
  const f = (t) => (t > 216 / 24389 ? Math.cbrt(t) : (24389 / 27 * t + 16) / 116);
  const x = f((0.4124 * r + 0.3576 * g + 0.1805 * b) / 0.95047);
  const y = f(0.2126 * r + 0.7152 * g + 0.0722 * b);
  const z = f((0.0193 * r + 0.1192 * g + 0.9505 * b) / 1.08883);
  return [116 * y - 16, 500 * (x - y), 200 * (y - z)];
}
// The CIE76 distance: the straight distance in CIELAB.
const cie76 = (a, b) => Math.hypot(...lab(a).map((v, i) => v - lab(b)[i]));
// The CIEDE2000 distance (Sharma, Wu, and Dalal 2005).
function ciede2000(rgb1, rgb2) {
  const [[L1, a1, b1], [L2, a2, b2]] = [lab(rgb1), lab(rgb2)];
  const rad = Math.PI / 180;
  const Cbar = (Math.hypot(a1, b1) + Math.hypot(a2, b2)) / 2;
  const G = 0.5 * (1 - Math.sqrt(Cbar ** 7 / (Cbar ** 7 + 25 ** 7)));
  const [a1p, a2p] = [(1 + G) * a1, (1 + G) * a2];
  const [C1p, C2p] = [Math.hypot(a1p, b1), Math.hypot(a2p, b2)];
  const hue = (b, a) => (a === 0 && b === 0 ? 0 : (Math.atan2(b, a) / rad + 360) % 360);
  const [h1p, h2p] = [hue(b1, a1p), hue(b2, a2p)];
  let dhp = h2p - h1p;
  if (C1p * C2p === 0) dhp = 0;
  else if (dhp > 180) dhp -= 360;
  else if (dhp < -180) dhp += 360;
  const dLp = L2 - L1;
  const dCp = C2p - C1p;
  const dHp = 2 * Math.sqrt(C1p * C2p) * Math.sin((dhp / 2) * rad);
  const Lbp = (L1 + L2) / 2;
  const Cbp = (C1p + C2p) / 2;
  let hbp = h1p + h2p;
  if (C1p * C2p !== 0) hbp = Math.abs(h1p - h2p) > 180 ? (hbp < 360 ? hbp + 360 : hbp - 360) / 2 : hbp / 2;
  const T = 1 - 0.17 * Math.cos((hbp - 30) * rad) + 0.24 * Math.cos(2 * hbp * rad) +
    0.32 * Math.cos((3 * hbp + 6) * rad) - 0.2 * Math.cos((4 * hbp - 63) * rad);
  const Sl = 1 + (0.015 * (Lbp - 50) ** 2) / Math.sqrt(20 + (Lbp - 50) ** 2);
  const Sc = 1 + 0.045 * Cbp;
  const Sh = 1 + 0.015 * Cbp * T;
  const Rt = -2 * Math.sqrt(Cbp ** 7 / (Cbp ** 7 + 25 ** 7)) * Math.sin(60 * Math.exp(-(((hbp - 275) / 25) ** 2)) * rad);
  return Math.sqrt((dLp / Sl) ** 2 + (dCp / Sc) ** 2 + (dHp / Sh) ** 2 + Rt * (dCp / Sc) * (dHp / Sh));
}
// How a color looks with normal vision and with simulated red-green color blindness (Machado,
// Oliveira, and Fernandes 2009, severity 1: a matrix on the linear channels).
const VISIONS = {
  "normal vision": null,
  protanopia: [[0.152286, 1.052583, -0.204868], [0.114503, 0.786281, 0.099216], [-0.003882, -0.048116, 1.051998]],
  deuteranopia: [[0.367322, 0.860646, -0.227968], [0.280085, 0.672501, 0.047413], [-0.01182, 0.04294, 0.968881]],
};
const seen = (rgb, matrix) => {
  if (!matrix) return rgb;
  const lin = rgb.map(toLinear);
  return matrix.map((row) => fromLinear(Math.min(1, Math.max(0, row[0] * lin[0] + row[1] * lin[1] + row[2] * lin[2]))));
};
// A value next to its limit, rounded away from it: 4.4999 shows as 4.49, not as 4.50, below a
// minimum; 1.2501 shows as 1.26, not as 1.25, above a maximum.
const roundDown = (value, digits) => (Math.floor(value * 10 ** digits) / 10 ** digits).toFixed(digits);
const roundUp = (value, digits) => (Math.ceil(value * 10 ** digits) / 10 ** digits).toFixed(digits);
// color-mix(in srgb, <color> <share>, transparent) over a background, or color-mix(in srgb,
// <color> <share>, <background>): a mix of the sRGB channels. site-html.mjs paints the parcel field
// with this mix, and render-md.mjs the diagram nodes.
const mix = (color, background, share) => color.map((c, k) => c * share + background[k] * (1 - share));

const texts = valid.get("text color");
const backgrounds = valid.get("background");
const areas = [...valid.get("area color")];
SCHEMES.forEach((scheme, i) => {
  for (const [text, pair] of texts) {
    for (const [background, backgroundPair] of backgrounds) {
      const ratio = contrast(channels(pair[i]), channels(backgroundPair[i]));
      if (ratio < MIN_CONTRAST) {
        errors.push(`the text color ${text} (${scheme}, ${pair[i]}) has a contrast of ${roundDown(ratio, 2)}:1 on the ${background} (${backgroundPair[i]}); it needs ${MIN_CONTRAST}:1 or more`);
      }
    }
  }
  const ink = texts.get("ink");
  const ground = backgrounds.get("ground");
  // The color of the parcel field where it is strongest: a boundary or a row at full mask.
  if (inkShare[i] !== undefined && ink && ground) {
    const field = mix(channels(ink[i]), channels(ground[i]), inkShare[i] / 100);
    const ratio = contrast(field, channels(ground[i]));
    if (ratio > MAX_FIELD_CONTRAST) {
      errors.push(`the parcel field (${scheme}, ${inkShare[i]}% ink) has a contrast of ${roundUp(ratio, 2)}:1 with the ground (${ground[i]}); it needs ${MAX_FIELD_CONTRAST}:1 or less`);
    }
    for (const [text, pair] of texts) {
      const onField = contrast(channels(pair[i]), field);
      if (onField < MIN_CONTRAST) {
        errors.push(`the text color ${text} (${scheme}, ${pair[i]}) has a contrast of ${roundDown(onField, 2)}:1 on the parcel field (${inkShare[i]}% ink on the ground); it needs ${MIN_CONTRAST}:1 or more`);
      }
    }
  }
  // A repo node of a diagram: the area color at the node tint on the ground, with an ink label.
  if (nodeTint !== undefined && ink && ground) {
    for (const [area, pair] of areas) {
      const node = mix(channels(pair[i]), channels(ground[i]), nodeTint / 100);
      const ratio = contrast(channels(ink[i]), node);
      if (ratio < MIN_CONTRAST) {
        errors.push(`the ink labels (${scheme}, ${ink[i]}) have a contrast of ${roundDown(ratio, 2)}:1 on the diagram node of the area color ${area} (${nodeTint}% ${pair[i]} on the ground ${ground[i]}); they need ${MIN_CONTRAST}:1 or more`);
      }
    }
  }
  for (const [area, pair] of areas) {
    for (const state of STATES.filter((s) => texts.has(s))) {
      const d = cie76(channels(pair[i]), channels(texts.get(state)[i]));
      if (d < MIN_STATE_DISTANCE) {
        errors.push(`the area color ${area} (${scheme}, ${pair[i]}) is ${roundDown(d, 1)} from the state color ${state} (${texts.get(state)[i]}); it needs ${MIN_STATE_DISTANCE} or more (CIE76)`);
      }
    }
  }
  areas.forEach(([a, pairA], j) => {
    for (const [b, pairB] of areas.slice(j + 1)) {
      // The vision in which the two colors are nearest.
      const [vision, d] = Object.entries(VISIONS)
        .map(([name, matrix]) => [name, ciede2000(seen(channels(pairA[i]), matrix), seen(channels(pairB[i]), matrix))])
        .reduce((near, next) => (next[1] < near[1] ? next : near));
      if (d < MIN_AREA_DISTANCE) {
        errors.push(`the area colors ${a} and ${b} (${scheme}, ${pairA[i]} and ${pairB[i]}) are ${roundDown(d, 1)} apart for ${vision}; they need ${MIN_AREA_DISTANCE} or more (CIEDE2000)`);
      }
    }
  });
});

if (errors.length) {
  for (const e of errors) console.error(`error: ${e}`);
  process.exit(1);
}
const count = (colors) => Object.keys(colors).length;
console.log(`the colors of the site look pass: ${count(TEXTS)} text colors on ${count(BACKGROUNDS)} backgrounds and on the parcel field, the ink labels on the ${DIAGRAM_NODE_TINT}% diagram node tints, and ${count(AREA_COLORS)} area colors, light and dark`);
