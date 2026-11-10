// The contributors page of the Pages site (contributors.html): the recognition (CONTEXT.md) of the
// last full quarter and of the quarter to date. Its style, its script, and its render. No CLI:
// build-contributors.mjs fetches the data, counts it (contributors.mjs), and writes the page.
// The page is a Read page in the site look (site-html.mjs, DESIGN.md), the design of the ticket
// "Design the recognition page": the title and the lede; a switch between the 2 windows (the last
// quarter first); for each window the count line, the welcome field (the newcomers, each with a
// thank-you line), and the names of everyone who contributed with the figures of each kind; then
// "How we count" and "About this data". Without JavaScript the switch does not show, and both
// windows show, one after the other. The page shows the login only (no avatar), linked to the
// GitHub profile.
import { plural } from "./estate.mjs";
import { CODE_CHIP, PLATE_EDGE, READING_COLUMN, WIDE, esc, masthead, mastheadStyle, siteHead, siteStyle } from "./site-html.mjs";

// The removal form of the contributors page. GitHub reads issue forms only from .github/ISSUE_TEMPLATE/
// at the top of the docs repo, so the form has the prefix of our files there.
export const REMOVAL_FORM = "understand-greenstand-remove-me.yml";

// Each part of the page (the text, the welcome plate, the grid of names, the heading rules) is in the
// reading column (READING_COLUMN), so the page has one right edge, as the text pages do (site-look
// ticket 07).

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
// A date (UTC) in words: "3 November 2026", or "3 November" without the year.
const day = (t, { year = true } = {}) => `${t.getUTCDate()} ${MONTHS[t.getUTCMonth()]}${year ? ` ${t.getUTCFullYear()}` : ""}`;
// The last day of a window: the window ends before its end time.
const lastDay = (end) => new Date(end.getTime() - 1);

// The words of each window (the keys of windowsAt in contributors.mjs): its name (the switch and
// the title), its name in a sentence (build-contributors.mjs prints it), the line of a window with
// no contribution, and its dates.
export const WINDOWS = {
  last: {
    name: "Last quarter",
    inText: "the last quarter",
    empty: "No contributions in the last quarter.",
    dates: ({ start, end }) => `${MONTHS[start.getUTCMonth()]} to ${MONTHS[lastDay(end).getUTCMonth()]} ${start.getUTCFullYear()}`,
  },
  now: {
    name: "This quarter so far",
    inText: "the quarter to date",
    empty: "No contributions yet in this quarter.",
    dates: ({ start, end }) => {
      const to = lastDay(end);
      return to.getUTCDate() === start.getUTCDate() && to.getUTCMonth() === start.getUTCMonth() ? day(start) : `${day(start, { year: false })} to ${day(to)}`;
    },
  },
};

// The labels of the figures of a contributor, in the order of the kinds (contributors.mjs).
const FIGURES = [
  ["raised", "raised"],
  ["merged", "merged"],
  ["reviewed", "reviewed"],
  ["commented", "commented on"],
];

// The words of the first contribution of a newcomer, by its kind (contributors.mjs).
const FIRST_KIND = { raised: "a pull request to", review: "a review of", comment: "a comment on", merging: "the merge of" };

const profile = (login) => `<a class="login" href="https://github.com/${esc(encodeURIComponent(login))}">${esc(login)}</a>`;

// The count line: the people on the list (each with a count above 0), and how many of them are new.
function countLine(w) {
  const n = w.contributors.length;
  const m = w.newcomers.length;
  if (!m) return `${plural(n, "contributor")}.`;
  if (n === 1) return "1 contributor, who is new.";
  return `${plural(n, "contributor")}, ${m} of them new.`;
}

const thanks = ({ login, first }) =>
  `<li>${profile(login)} made a first contribution on ${day(new Date(first.time), { year: false })}: ${FIRST_KIND[first.kind]} <a href="${esc(first.url)}">${esc(first.repo)}&nbsp;#${first.number}</a>, “${esc(first.title)}”. Thank you, and welcome.</li>`;

const figures = (c) =>
  FIGURES.filter(([k]) => c[k])
    .map(([k, label]) => `<span><b>${c[k]}</b> ${label}</span>`)
    .join("");

const CAVEAT = `A count does not measure the value of a contribution. One careful review can help more than many small
pull requests. Many people also help in ways that GitHub does not count: in Slack, in meetings, and with designs and
translations. Thank you to them too.`;

// index is the place of the window on the page (the first one shows first). The first window with
// contributors holds the note on counts with the id "caveat" (the link of "About this data").
function windowPart(w, index, caveatAt) {
  const words = WINDOWS[w.key];
  const id = `window-${w.key}`;
  const lines = [
    `<section class="window${index ? "" : " shown"}" id="${id}" data-window="${w.key}" aria-labelledby="${id}-title">`,
    `<h2 class="window-title" id="${id}-title">${words.name} <span class="dates">${words.dates(w)}</span></h2>`,
  ];
  if (!w.contributors.length) {
    lines.push(`<p class="count">${words.empty}</p>`, "</section>");
    return lines.join("\n");
  }
  lines.push(`<p class="count">${countLine(w)}</p>`);
  if (w.newcomers.length) {
    lines.push(
      '<div class="welcome">',
      `<h3>Welcome to ${plural(w.newcomers.length, "new contributor")}</h3>`,
      '<ul class="welcomes">',
      ...w.newcomers.map(thanks),
      "</ul>",
      "</div>",
    );
  }
  lines.push(
    "<h3>Everyone who contributed</h3>",
    `<p class="caveat"${index === caveatAt ? ' id="caveat"' : ""}>${CAVEAT}</p>`,
    '<ul class="names">',
    ...w.contributors.map((c) => `<li>${profile(c.login)}${c.isNew ? '<span class="new">new</span>' : ""}<span class="figures">${figures(c)}</span></li>`),
    "</ul>",
    "</section>",
  );
  return lines.join("\n");
}

// The rules after siteStyle and mastheadStyle (site-html.mjs). The colors are the custom properties
// of siteStyle (site-colors.mjs). Before JavaScript runs (and without it), the switch does not show
// and both windows show with their titles. With JavaScript (the class "js" on html) the switch
// shows, only the chosen window shows, and its title is for screen readers only.
const STYLE = `  main { padding: 1.5rem 1.25rem 5rem; }
  main > * { box-sizing: border-box; max-width: ${READING_COLUMN}; margin-inline: auto; }
  @media ${WIDE} { main { padding: 1.25rem clamp(1.5rem, 4vw, 4.5rem) 5rem; } main > * { margin-inline: 0; } }
  h1 { margin-block: 1.5rem 1.1rem; font-size: clamp(1.9rem, 1.5rem + 1.8vw, 2.6rem); font-weight: 720; letter-spacing: -.02em; }
  h2 { margin-block: 2.9rem .8rem; padding-top: .75rem; border-top: 2px solid var(--ink); font-size: 1.5rem; font-weight: 660;
    scroll-margin-top: 1.5rem; }
  h3 { margin-block: 2.2rem .6rem; font-size: 1.2rem; font-weight: 660; }
  p, ul, dl { margin-block: 0 1rem; }
${CODE_CHIP}
  .lede { font-size: 1.06rem; }
  .caveat { color: var(--muted); font-size: .92rem; scroll-margin-top: 1.5rem; }
  .count { font: 500 1rem/1.4 var(--display); font-stretch: 87.5%; font-variant-numeric: tabular-nums; }
  a.login { color: var(--ink); text-decoration-color: var(--line); }
  a.login:hover { text-decoration-color: currentColor; }

  .switch { display: none; }
  .js .switch { display: grid; grid-template-columns: repeat(2, minmax(0, 15rem)); width: fit-content; max-width: 100%;
    margin-block: 1.5rem 0; border: 1px solid var(--line); }
  .switch button { appearance: none; margin: 0; padding: .55rem 1rem; border: 0; border-radius: 0; text-align: left;
    cursor: pointer; color: var(--ink); background: transparent; font: 600 .98rem/1.3 var(--display); font-stretch: 87.5%; }
  .switch button + button { border-left: 1px solid var(--line); }
  .switch .dates { display: block; color: var(--muted); font: 400 .82rem/1.3 system-ui, sans-serif; font-variant-numeric: tabular-nums; }
  .switch button[aria-pressed="true"] { color: var(--ground); background: var(--ink); }
  .switch button[aria-pressed="true"] .dates { color: var(--ground); }
  .switch button:focus-visible { outline-offset: -4px; outline-color: currentColor; }
  @media (forced-colors: active) {
    .switch button[aria-pressed="true"] { forced-color-adjust: none; color: HighlightText; background: Highlight; }
    .switch button[aria-pressed="true"] .dates { forced-color-adjust: none; color: HighlightText; } }

  .window-title .dates { display: block; margin-top: .35rem; color: var(--muted); font: 400 .92rem/1.4 system-ui, sans-serif;
    font-variant-numeric: tabular-nums; }
  .js .window:not(.shown) { display: none; }
  .js .window-title { position: absolute; width: 1px; height: 1px; margin: 0; padding: 0; border: 0; overflow: hidden;
    clip-path: inset(50%); white-space: nowrap; }
  .js .window > .count { margin-top: 1.5rem; }

  .welcome { box-sizing: border-box; margin-block: 1.25rem 0; padding: 1.4rem 1.75rem 1rem; border: ${PLATE_EDGE};
    background: var(--surface); }
  .welcome h3 { margin: 0 0 .6rem; font-size: 1.5rem; font-weight: 680; }
  .welcomes { margin: 0; padding: 0; list-style: none; }
  .welcomes li { padding: .85rem 0 .9rem; border-top: 1px solid var(--line); }
  @media (max-width: 30rem) { .welcome { padding-inline: 1.1rem; } }

  .names { display: grid; grid-template-columns: repeat(auto-fill, minmax(min(15rem, 100%), 1fr)); gap: 0 2rem; padding: 0;
    list-style: none; }
  .names li { padding: .6rem 0 .65rem; border-top: 1px solid var(--line); overflow-wrap: anywhere; }
  .names .new { margin-left: .5rem; padding: 0 .3rem; border: 1px solid var(--ink); font: 600 .75rem/1.4 var(--display);
    font-stretch: 87.5%; }
  .figures { display: flex; flex-wrap: wrap; gap: .1rem .9rem; margin-top: .15rem; color: var(--muted);
    font: 500 .85rem/1.35 var(--display); font-stretch: 87.5%; font-variant-numeric: tabular-nums; }
  .figures b { color: var(--ink); font-weight: 650; }

  .how dt { margin-top: .9rem; font: 600 .98rem/1.3 var(--display); font-stretch: 87.5%; }
  .how dd { margin: .2rem 0 0; }
  @media print { .js .window:not(.shown) { display: block; } .js .window-title { position: static; width: auto; height: auto;
    overflow: visible; clip-path: none; white-space: normal; } .switch { display: none !important; } }`;

// The script of the switch: a press shows the window of the button. The link to the note on
// counts goes to the note of the window that shows.
const SCRIPT = `const buttons = document.querySelectorAll(".switch button");
const windows = document.querySelectorAll(".window");
for (const b of buttons) b.addEventListener("click", () => {
  for (const o of buttons) o.setAttribute("aria-pressed", String(o === b));
  for (const w of windows) w.classList.toggle("shown", w.dataset.window === b.dataset.window);
});
for (const a of document.querySelectorAll('a[href="#caveat"]')) a.addEventListener("click", (e) => {
  const note = document.querySelector(".window.shown .caveat");
  if (!note) return;
  e.preventDefault();
  note.scrollIntoView();
});`;

// The page. windows: the windows of recognition() (contributors.mjs), the last quarter first.
// built: the build time. docsRepo: the URL of the docs repo on GitHub (the removal form lives there).
// lists: the URL of recognition.json on GitHub (the exclusion list).
export function contributorsPage({ areas, windows, built, docsRepo, lists }) {
  const removal = `${docsRepo}/issues/new?template=${REMOVAL_FORM}`;
  const caveatAt = windows.findIndex((w) => w.contributors.length);
  const caveatLink = caveatAt < 0 ? "" : ` A count does not measure the
value of a contribution: read the <a href="#caveat">note on counts</a>.`;
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Contributors</title>
<script>document.documentElement.classList.add("js");</script>
${siteHead(".")}
<style>
${siteStyle(".")}
${mastheadStyle(READING_COLUMN)}
${STYLE}
</style>
</head>
<body>
${masthead(areas, '<nav><a href="./">&larr; All viewers</a></nav>')}
<main>
<h1>Contributors</h1>
<p class="lede">These people contributed to the public Greenstand repos on GitHub. Thank you to each of them.</p>
<div class="switch" role="group" aria-label="Quarter">
${windows.map((w, i) => `<button type="button" data-window="${w.key}" aria-pressed="${i ? "false" : "true"}" aria-controls="window-${w.key}">${WINDOWS[w.key].name} <span class="dates">${WINDOWS[w.key].dates(w)}</span></button>`).join("\n")}
</div>
${windows.map((w, i) => windowPart(w, i, caveatAt)).join("\n")}
<h2 id="how-we-count">How we count</h2>
<dl class="how">
<dt>Raised</dt><dd>Pull requests that the person opened. A pull request with the label <code>spam</code> or
<code>invalid</code> that is closed or merged does not count, and nothing on it counts.</dd>
<dt>Merged</dt><dd>Pull requests by the person that were merged. If the author merged a pull request with no approval
from another person before the merge, the pull request does not count here. It counts only as raised.</dd>
<dt>Reviewed</dt><dd>Pull requests by other people that the person reviewed with text: a review comment or a comment on
a line. An approval with no text does not count. Each pull request counts once.</dd>
<dt>Commented on</dt><dd>Pull requests by other people where the person wrote a comment in the conversation. Each pull
request counts once.</dd>
<dt>New</dt><dd>The person made a first contribution to a public Greenstand repo in the quarter: a pull request, a
review, a comment, or a merge.</dd>
<dt>Who is on the list</dt><dd>Each person with at least 1 count in the quarter, in the order of the alphabet. The list
has no rank. The page names only the people with at least 1 count: a new contributor with no count is not on the
page. Bots and deleted accounts are not on the list. Each item counts in the quarter of its own date (UTC). A
maintainer can leave out an item, for example spam, with a reason in the <a href="${esc(lists)}">exclusion list</a>.</dd>
</dl>
<h2 id="about-this-data">About this data</h2>
<div class="about">
<p>The data is public GitHub activity in the public repos of the Greenstand organization. This page was last built on
${day(built)}. The page keeps no past quarters, and the repo keeps no copy of the data.${caveatLink}</p>
<p>Do you want your name off this page? Open a <a href="${esc(removal)}">removal request</a> with your GitHub account. We
remove your name within 7 days. You can ask to come back in the same way.</p>
</div>
</main>
<script>
${SCRIPT}
</script>
</body>
</html>
`;
}
