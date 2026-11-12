// The drawings in the site look (DESIGN.md, Stage: Images). A drawing in the site look is an SVG of
// the image directory of the capture journey with the site color block:
//   /* BEGIN site colors: ... */ ... /* END site colors */
// The block holds the 5 neutral colors (ground, surface, ink, muted, line) as CSS custom
// properties, light and dark. build-capture-journey.mjs writes the block from site-colors.mjs. An
// SVG in an <img> cannot read the custom properties of the page. Thus the drawing holds its own
// copy. A drawing with no block keeps its own colors, for example a drawing of a screen of a
// Greenstand app.
// The text of a drawing in the site look is in Archivo. An SVG in an <img> cannot load the font of
// the page. Thus the drawing font block holds a subset of Archivo. subset-drawing-font.py writes it.
// drawingCheck checks a drawing. It returns the text of the drawing with the current color block.
import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { brotliDecompressSync } from "node:zlib";
import { markedSpan, replaceMarked, root } from "./estate.mjs";
import { BACKGROUNDS, LINES, TEXTS } from "./site-colors.mjs";

export const COLOR_MARKERS = {
  begin: "/* BEGIN site colors: built by .github/scripts/build-capture-journey.mjs from site-colors.mjs. Do not edit. */",
  end: "/* END site colors */",
  what: "site colors",
  optional: true,
};
export const FONT_MARKERS = {
  begin: "/* BEGIN drawing font: built by .github/scripts/subset-drawing-font.py from Archivo 5.3.0. Do not edit. */",
  end: "/* END drawing font */",
  what: "drawing font",
  optional: true,
};
// The script that writes the drawing font. It has its own copy of the marker strings, because it is
// Python. checkSubsetScript keeps the copy the same as the strings above.
export const SUBSET_SCRIPT = ".github/scripts/subset-drawing-font.py";
const SUBSET = `run python3 ${SUBSET_SCRIPT} (see its usage)`;
const FIX = "run node .github/scripts/build-capture-journey.mjs";

// The colors of a drawing in the site look: the neutral colors only. An area color marks an area,
// a state color marks a state, and water blue marks a link (the One Color, One Job Rule). A drawing
// shows none of them.
export const DRAWING_COLORS = { ground: BACKGROUNDS.ground, surface: BACKGROUNDS.surface, ink: TEXTS.ink, muted: TEXTS.muted, line: LINES.line };
const props = (i) => Object.entries(DRAWING_COLORS).map(([name, pair]) => `--${name}: ${pair[i]};`).join(" ");
export const colorBlock = () => `svg { ${props(0)} }\n@media (prefers-color-scheme: dark) { svg { ${props(1)} } }`;

// The marker strings in the subset script: the font markers in full, and the start of the color
// BEGIN marker (the script finds a drawing in the site look by it). Each missing string is an error.
export function checkSubsetScript(errors) {
  const at = join(root, SUBSET_SCRIPT);
  if (!existsSync(at)) return void errors.push(`${SUBSET_SCRIPT} is missing: it writes the drawing font`);
  const script = readFileSync(at, "utf8");
  const colorStart = COLOR_MARKERS.begin.slice(0, COLOR_MARKERS.begin.indexOf(":") + 1);
  for (const s of [FONT_MARKERS.begin, FONT_MARKERS.end, colorStart]) {
    if (!script.includes(`"${s}"`)) errors.push(`${SUBSET_SCRIPT} lacks the marker string ${JSON.stringify(s)} of site-drawings.mjs: use the same strings`);
  }
}

// The text without the marked blocks (they hold the colors and the font data) and without the
// words of the text elements (a word such as "#100" is not a color).
function bodyOf(svg) {
  let t = svg;
  for (const markers of [COLOR_MARKERS, FONT_MARKERS]) {
    const span = markedSpan("", t, markers, []);
    if (span) t = t.slice(0, span.start) + t.slice(span.stop);
  }
  return t;
}
const withoutWords = (body) => body.replace(TEXT, (m, attrs) => `<text${attrs}></text>`);

const unique = (list) => [...new Set(list)];
const ENTITIES = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'" };
const unescapeXml = (s) =>
  s.replace(/&(?:#x([0-9a-f]+)|#(\d+)|(amp|lt|gt|quot|apos));/gi, (m, hex, dec, name) =>
    hex ? String.fromCodePoint(parseInt(hex, 16)) : dec ? String.fromCodePoint(Number(dec)) : ENTITIES[name.toLowerCase()],
  );
// A text element and its content, with the tags inside it (a <tspan>). subset-drawing-font.py reads
// the words with the same pattern.
const TEXT = /<text\b([^>]*)>([^]*?)<\/text>/g;
// The words of the text elements, after the XML escapes, without the tags and the control characters.
const words = (body) => [...body.matchAll(TEXT)].map((m) => unescapeXml(m[2].replace(/<[^>]*>/g, ""))).join("").replace(/[\u0000-\u001f]/g, "");
const codeName = (c) => `"${c}" (U+${c.codePointAt(0).toString(16).toUpperCase().padStart(4, "0")})`;
const usedVars = (body) => unique([...body.matchAll(/var\(\s*--([\w-]+)/g)].map((m) => m[1]));

// Each color that is not a site color: a color function or a hex color anywhere (not a link to an
// id, not an XML escape), and each value of a paint (fill, stroke, and the other color properties,
// as an attribute or in CSS) that is not none, transparent, var(--name), or url(#id). Thus a named
// color (white) and currentColor are errors too.
const COLOR_FUNCTION = /\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color|color-mix)\([^)]*\)/gi;
const HEX = /(?<![&\w])(?<!url\(['"]?)(?<!href="|href=')#(?:[0-9a-f]{8}|[0-9a-f]{6}|[0-9a-f]{3,4})\b/gi;
const PAINT = /(?<![\w-])(?:fill|stroke|stop-color|flood-color|lighting-color|color)(?:\s*=\s*"([^"]*)"|\s*:\s*([^;}"]+))/g;
const NOT_A_COLOR = /^(?:none|transparent|var\(--[\w-]+\)|url\(['"]?#[^)]*\))$/i;
function colorValues(body) {
  const found = [
    ...[...body.matchAll(COLOR_FUNCTION), ...body.matchAll(HEX)].map((m) => [m.index, m[0]]),
    ...[...body.matchAll(PAINT)].map((m) => [m.index, (m[1] ?? m[2]).trim()]).filter(([, v]) => !NOT_A_COLOR.test(v)),
  ];
  return unique(found.sort((a, b) => a[0] - b[0]).map(([, v]) => v));
}

// Check the drawing at (its path) with the text svg. Return the text with the current color block,
// or null for a drawing that is not in the site look (no color block). Each error goes to errors.
export function drawingCheck(at, svg, errors) {
  // Broken color markers: only their error (the other checks need the block).
  if (markedSpan(at, svg, COLOR_MARKERS, errors) === undefined) return null;
  const next = replaceMarked(at, svg, COLOR_MARKERS, colorBlock(), []);
  const body = bodyOf(svg);
  const font = markedSpan(at, svg, FONT_MARKERS, errors);
  // A drawing with no block must not use the site colors or the drawing font: without the block
  // the colors are not defined, and the drawing shows black (for example when someone deleted the
  // block by mistake).
  if (next === null) {
    const vars = usedVars(body);
    if (vars.length) errors.push(`${at}: uses ${vars.map((n) => `var(--${n})`).join(", ")} but has no site color block: add the site color markers, then ${FIX}`);
    if (font) errors.push(`${at}: has a drawing font but no site color block: add the site color markers, then ${FIX}`);
    return null;
  }
  const allowed = new Set(Object.keys(DRAWING_COLORS));
  const vars = usedVars(body).filter((n) => !allowed.has(n));
  if (vars.length) {
    errors.push(`${at}: uses ${vars.map((n) => `var(--${n})`).join(", ")}: a drawing in the site look takes only the colors ${Object.keys(DRAWING_COLORS).join(", ")}`);
  }
  const colors = colorValues(withoutWords(body));
  if (colors.length) errors.push(`${at}: has the color ${colors.join(", ")}: use a site color, for example var(--ink)`);
  const chars = unique([...words(body)]);
  if (font === null) {
    if (chars.some((c) => c.trim())) errors.push(`${at}: has text but no drawing font (the drawing font markers); ${SUBSET}`);
  } else if (font) {
    const block = svg.slice(font.start, font.stop);
    const faces = [...block.matchAll(/url\(data:font\/woff2;base64,([A-Za-z0-9+/=]+)\)/g)].map((m) => woff2Characters(Buffer.from(m[1], "base64")));
    if (!faces.length) errors.push(`${at}: the drawing font has no face; ${SUBSET}`);
    faces.forEach((face, i) => face || errors.push(`${at}: the drawing font, face ${i + 1}, is not a readable WOFF2 font; ${SUBSET}`));
    if (faces.length && faces.every(Boolean)) {
      const missing = chars.filter((c) => faces.some((face) => !face.has(c.codePointAt(0)))).sort((a, b) => a.codePointAt(0) - b.codePointAt(0));
      if (missing.length) errors.push(`${at}: the drawing font has no glyph for ${missing.map(codeName).join(", ")}; ${SUBSET}`);
    }
  }
  return next;
}

// ---------- The characters of a WOFF2 font: its cmap table ----------

// The table tags of the WOFF2 table directory, by their index (WOFF2 specification, 5.1).
const KNOWN_TAGS = ["cmap", "head", "hhea", "hmtx", "maxp", "name", "OS/2", "post", "cvt ", "fpgm", "glyf", "loca", "prep", "CFF ", "VORG", "EBDT", "EBLC",
  "gasp", "hdmx", "kern", "LTSH", "PCLT", "VDMX", "vhea", "vmtx", "BASE", "GDEF", "GPOS", "GSUB", "EBSC", "JSTF", "MATH", "CBDT", "CBLC", "COLR", "CPAL",
  "SVG ", "sbix", "acnt", "avar", "bdat", "bloc", "bsln", "cvar", "fdsc", "feat", "fmtx", "fvar", "gvar", "hsty", "just", "lcar", "mort", "morx", "opbd",
  "prop", "trak", "Zapf", "Silf", "Glat", "Gloc", "Feat", "Sill"];

// The code points that a WOFF2 font maps to a glyph (not glyph 0), from its cmap subtables of
// format 4 and 12. null if the bytes are not a readable WOFF2 font (one font, not a collection).
export function woff2Characters(buf) {
  try {
    if (buf.length < 48 || buf.toString("latin1", 0, 4) !== "wOF2" || buf.toString("latin1", 4, 8) === "ttcf") return null;
    const numTables = buf.readUInt16BE(12);
    const compressed = buf.readUInt32BE(20);
    let p = 48;
    const base128 = () => {
      let value = 0;
      for (let i = 0; i < 5; i++) {
        const b = buf[p++];
        if (b === undefined || (i === 0 && b === 0x80)) throw new Error("bad UIntBase128");
        value = value * 128 + (b & 0x7f);
        if (value > 0xffffffff) throw new Error("UIntBase128 above 2^32 - 1");
        if (!(b & 0x80)) return value;
      }
      throw new Error("long UIntBase128");
    };
    const tables = [];
    for (let i = 0; i < numTables; i++) {
      const flags = buf[p++];
      const tag = (flags & 0x3f) === 63 ? buf.toString("latin1", p, (p += 4)) : KNOWN_TAGS[flags & 0x3f];
      const version = flags >> 6;
      const length = base128();
      const transformed = tag === "glyf" || tag === "loca" ? version !== 3 : version !== 0;
      tables.push({ tag, length: transformed ? base128() : length });
    }
    const data = brotliDecompressSync(buf.subarray(p, p + compressed));
    let offset = 0;
    for (const { tag, length } of tables) {
      if (tag === "cmap") return cmapCharacters(data.subarray(offset, offset + length));
      offset += length;
    }
    return null;
  } catch {
    return null;
  }
}

function cmapCharacters(t) {
  const chars = new Set();
  const count = t.readUInt16BE(2);
  for (let i = 0; i < count; i++) {
    const at = t.readUInt32BE(4 + i * 8 + 4);
    const format = t.readUInt16BE(at);
    if (format === 4) {
      const segs = t.readUInt16BE(at + 6) / 2;
      const ends = at + 14;
      const starts = ends + segs * 2 + 2;
      const deltas = starts + segs * 2;
      const ranges = deltas + segs * 2;
      for (let s = 0; s < segs; s++) {
        const start = t.readUInt16BE(starts + s * 2);
        const end = t.readUInt16BE(ends + s * 2);
        const delta = t.readUInt16BE(deltas + s * 2);
        const range = t.readUInt16BE(ranges + s * 2);
        for (let c = start; c <= end && c !== 0xffff; c++) {
          let glyph = range === 0 ? c : t.readUInt16BE(ranges + s * 2 + range + (c - start) * 2);
          if (range !== 0 && glyph === 0) continue;
          glyph = (glyph + delta) & 0xffff;
          if (glyph) chars.add(c);
        }
      }
    } else if (format === 12) {
      const groups = t.readUInt32BE(at + 12);
      for (let g = 0; g < groups; g++) {
        const [start, end, glyph] = [0, 4, 8].map((k) => t.readUInt32BE(at + 16 + g * 12 + k));
        for (let c = start; c <= end; c++) if (glyph + (c - start)) chars.add(c);
      }
    }
  }
  return chars;
}
