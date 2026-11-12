// The parser of the roadmap source (the pinned copy of Roadmap.md): its sections under ATX
// headings, the body of each section with its words as in the source, and the item count of each
// body. No CLI: build-roadmap.mjs reads the files and checks the data. The functions have no side
// effects, so a test or another script can import them.
import { plural } from "./estate.mjs";

// An ATX heading (CommonMark): 1 to 6 "#" after at most 3 spaces, then a space or the end, and an
// optional closing sequence of "#".
const HEADING = /^ {0,3}(#{1,6})(?:[ \t]+(.*?))?(?:[ \t]+#+)?[ \t]*$/;
const FENCE = /^ {0,3}(`{3,}|~{3,})/;
// A thematic break: 3 or more "-", "*", or "_", with spaces between them.
const BREAK = /^ {0,3}([-*_])(?:[ \t]*\1){2,}[ \t]*$/;
// The list markers at the start of a line: one or more. A space or the end of the line follows each
// marker. "+ * x" is an item in an item, as GitHub shows it.
const MARKERS = /^[ \t]*((?:(?:[-*+]|\d{1,9}[.)])(?:[ \t]+|$))+)/;

// The heading text as the data file names it: spaces collapsed, one closing ":" dropped.
const headingText = (raw) => raw.replace(/\s+/g, " ").trim().replace(/\s*:$/, "");

// The number of items of a body: each list marker at the start of a line, outside fenced code.
export function countItems(body) {
  let n = 0;
  let fence = null;
  for (const line of body.split("\n")) {
    const f = line.match(FENCE);
    if (f) {
      if (!fence) fence = f[1][0];
      else if (f[1][0] === fence) fence = null;
      continue;
    }
    if (fence || BREAK.test(line)) continue;
    const m = line.match(MARKERS);
    if (m) n += m[1].match(/[-*+]|\d{1,9}[.)]/g).length;
  }
  return n;
}

// The number of list items that marked finds in a body, nested items too: the items that the page
// shows. lexer is the lexer of marked.
export function markedItems(lexer, body) {
  const walk = (tokens) =>
    tokens.reduce((n, t) => n + (t.type === "list" ? t.items.reduce((k, it) => k + 1 + walk(it.tokens ?? []), 0) : t.tokens ? walk(t.tokens) : 0), 0);
  return walk(lexer(body));
}

// The body of a section: its lines with their common indent removed (a list indented by 2 spaces
// stays a list), with no blank line at the start or the end. The words stay.
function bodyOf(lines) {
  const indents = lines.filter((l) => l.trim()).map((l) => l.match(/^ */)[0].length);
  const cut = indents.length ? Math.min(...indents) : 0;
  return lines
    .map((l) => l.slice(Math.min(cut, l.match(/^ */)[0].length)))
    .join("\n")
    .replace(/^\n+|\n+$/g, "")
    .replace(/^\s+$/, "");
}

// The sections of a source text: { heading, body, items, complete }, in source order, and the
// problems that stop the page (each a phrase after "<path> at <commit> "). An empty heading with no
// text under it is skipped.
export function parseSource(text) {
  const parts = [];
  let cur = { heading: null, lines: [] };
  let fence = null;
  for (const line of text.replace(/\r\n?/g, "\n").split("\n")) {
    const f = line.match(FENCE);
    if (f && !fence) fence = f[1][0];
    else if (f && f[1][0] === fence) fence = null;
    const h = fence || f ? null : line.match(HEADING);
    if (h) {
      parts.push(cur);
      cur = { heading: headingText(h[2] ?? ""), lines: [] };
    } else cur.lines.push(line);
  }
  parts.push(cur);
  const above = countItems(bodyOf(parts.shift().lines));
  const sections = [];
  const problems = [];
  if (above) problems.push(`has ${plural(above, "item")} above its first heading: the page cannot place it`);
  parts.forEach((p, i) => {
    const body = bodyOf(p.lines);
    if (p.heading) sections.push({ heading: p.heading, body, items: countItems(body), complete: (body.match(/\(complete\)/gi) ?? []).length });
    else if (body) {
      const next = parts.slice(i + 1).find((q) => q.heading);
      problems.push(`has text under an empty heading${next ? ` (before ${JSON.stringify(next.heading)})` : " (at the end)"}: the page cannot place it`);
    }
  });
  const seen = new Map();
  for (const s of sections) seen.set(s.heading, (seen.get(s.heading) ?? 0) + 1);
  for (const [heading, n] of seen) if (n > 1) problems.push(`has the section ${JSON.stringify(heading)} ${n} times: an entry cannot tell them apart`);
  return { sections, problems };
}
