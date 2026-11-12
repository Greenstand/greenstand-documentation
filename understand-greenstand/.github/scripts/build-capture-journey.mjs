#!/usr/bin/env node
// Build the capture journey from capture-journey.json (edited text). The data file holds a list of
// chapters; each chapter has a text copy for GitHub (built text) and an illustrated page of the
// Pages site (built by the deploy; its render is capture-journey-page.mjs). Chapter 1 has
// docs/capture-journey.md and capture-journey.html; a later chapter has the files of its id
// (chapterFiles of estate.mjs), for example docs/capture-journey-web-map.md and
// capture-journey-web-map.html. A later chapter starts at a stage of an earlier chapter; each copy
// and each page links the other chapters. The images of all chapters are in docs/capture-journey/:
// the copies link them there, and the deploy copies them beside the pages.
// The data file holds the words of each stage, its flags ("Best guess" with the question it stands
// for, "Not working today" with its public issue), its images, and its evidence: each entry cites
// lines of a file of a public Greenstand repo at a commit, with 1 to 3 names that the lines hold
// (a Capture journey fact). A repo of estate.json links to its viewer and onboarding guide; a repo
// outside the estate links to GitHub.
// A drawing in the site look is an SVG of the image directory with the site color block (see
// site-drawings.mjs). Its colors come from site-colors.mjs. The default mode writes the current
// block into the drawing. --check fails when the block is stale. --site copies the drawing with the
// current block. Each mode fails when such a drawing uses another color. Each mode also fails when
// its drawing font has no glyph for a character of its text.
// Usage: node build-capture-journey.mjs                  check the data, rewrite the copy of each
//          chapter, and write the current color block into each drawing in the site look
//        node build-capture-journey.mjs --check          exit 1 on a data error, a stale copy, a
//          copy of no chapter, or a stale color block (CI)
//        node build-capture-journey.mjs --evidence       exit 1 when GitHub does not hold a fact.
//          It reads each repo, cited file, issue, and image source through the GitHub API
//          (GITHUB_TOKEN, if set). CI runs it only when the data, the images, or the code changes.
//        node build-capture-journey.mjs --site <dir>     write the page of each chapter into <dir>
//          and copy the images into <dir>/capture-journey/ (the deploy). The pages are in the site
//          look: <dir> must hold the font and the parcel field.
import { createHash } from "node:crypto";
import { copyFileSync, existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { CAPTURE_JOURNEY_DATA as DATA, CAPTURE_JOURNEY_IMAGES as IMAGES, CHAPTER_COPY, CHAPTER_ID, CHAPTER_PAGE, EM_DASH, answerStatus, chapterFiles, citedLines, docsBlobUrl, githubApi, NO_GUIDE, isObject, isRepoPath, lineAnchor, linesLink, loadEstate, missingNames, parseJson, parseLines, plural, readDocsFile, root, urlPath, wordList } from "./estate.mjs";
import { CHAPTERS_SENTENCE, FLAGS, ICONS, NO_ISSUE, creditText, pageHtml, seeText } from "./capture-journey-page.mjs";
import { slugger } from "./slug.mjs";
import { SITE_LOOK_FILES, undefinedProperties } from "./site-html.mjs";
import { checkSubsetScript, drawingCheck } from "./site-drawings.mjs";

const SCRIPT = ".github/scripts/build-capture-journey.mjs";
const USAGE = `use: node ${SCRIPT} [--check | --evidence | --site <dir>]`;

const args = process.argv.slice(2);
let mode = "write";
let siteDir = null;
if (args.length === 1 && (args[0] === "--check" || args[0] === "--evidence")) mode = args[0].slice(2);
else if (args.length === 2 && args[0] === "--site") [mode, siteDir] = ["site", args[1]];
else if (args.length) {
  console.error(`error: ${USAGE}`);
  process.exit(2);
}
// Every error at once: the estate, the directory of --site and the files of the site look that the
// page loads (the font and the parcel field), then the data file.
const { estate, repos, errors } = loadEstate();
if (mode === "site" && !(existsSync(siteDir) && statSync(siteDir).isDirectory())) errors.push(`${siteDir} is not a directory`);
else if (mode === "site") {
  for (const f of SITE_LOOK_FILES) if (!existsSync(join(siteDir, f))) errors.push(`${chapterFiles(null, 0).page} needs ${join(siteDir, f)}, but it is missing`);
}
const estateRepos = new Set(repos.map((r) => r.name));

// The fields of each object of the data file, in the order of their checks. A flag has the fields
// of its kind.
const FIELDS = {
  top: ["title", "legend", "chapters", "later"],
  legend: ["guess", "broken", "dev"],
  chapter: ["id", "subtitle", "start", "intro", "stages"],
  start: ["chapter", "stage"],
  stage: ["id", "short", "title", "icon", "story", "flags", "note", "seeChapter", "seeLink", "images", "evidence", "issues", "moreRepos"],
  guess: ["kind", "text", "question"],
  broken: ["kind", "text", "issue"],
  image: ["file", "frame", "alt", "caption", "source"],
  source: ["repo", "path", "commit", "license"],
  evidence: ["repo", "path", "lines", "commit", "names", "what"],
  issue: ["repo", "number", "what"],
  seeLink: ["text", "url"],
  moreRepo: ["repo", "what"],
};
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;
const REPO = /^[A-Za-z0-9_-][A-Za-z0-9_.-]*$/;
const COMMIT = /^[0-9a-f]{7}$/;
const IMAGE_FILE = /^[a-z0-9]+(-[a-z0-9]+)*\.(png|svg)$/;
const shown = (v) => (v === undefined ? "missing" : JSON.stringify(v));

// The width and the height of an image of the image directory, for the page (so the layout does not move
// when an image loads): a PNG (its IHDR chunk), or an SVG with a viewBox. null if not readable.
function imageSize(file) {
  const bytes = readFileSync(join(root, IMAGES, file));
  if (file.endsWith(".png")) {
    const png = bytes.length >= 24 && bytes.readUInt32BE(0) === 0x89504e47 && bytes.toString("latin1", 12, 16) === "IHDR";
    const size = png && { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
    return size && size.width && size.height ? size : null;
  }
  const box = bytes.toString("utf8").match(/<svg\b[^>]*?\sviewBox="\s*-?[\d.]+[\s,]+-?[\d.]+[\s,]+([\d.]+)[\s,]+([\d.]+)\s*"/);
  const size = box && { width: Math.round(Number(box[1])), height: Math.round(Number(box[2])) };
  return size && size.width && size.height ? size : null;
}
// The size of each image of the data file, read once by validData.
const sizeOf = new Map();
// The index of each chapter with a valid id (a later chapter), filled once by validData: the check
// and the view of "seeChapter" use it.
const chapterById = new Map();

// The objects of a stage that have their own place in an error ("stage <id>, image 2"), and the
// lists of plain strings, with the word of one item ("story paragraph 2", "name 1").
const PLACES = { flags: "flag", images: "image", evidence: "evidence", issues: "issue", moreRepos: "more repo" };
const ITEMS = { intro: "intro paragraph", story: "story paragraph", names: "name" };

// Check capture-journey.json, and return it only if it is valid. Every error is recorded at once,
// with its place. Every string of the file (a text, a path, a name) is on one line, with no em
// dash: one pass checks them all, in the order of the file. Then the checks of each field.
function validData(data) {
  if (data === null) return null; // readDocsFile recorded the error
  const before = errors.length;
  const fail = (where, message) => errors.push(`${DATA}: ${where ? `${where}: ` : ""}${message}`);
  const checkString = (where, label, value) => {
    if (typeof value === "string") {
      if (/[\r\n]/.test(value)) fail(where, `${label} must be on one line`);
      if (value.includes(EM_DASH)) fail(where, `${label} has an em dash; use a colon, a comma, or two sentences`);
    } else if (Array.isArray(value)) value.forEach((item, i) => checkString(where, `${ITEMS[label] ?? label} ${i + 1}`, item));
    else if (isObject(value)) for (const [key, inner] of Object.entries(value)) checkString(where, label ? `${label}.${key}` : key, inner);
  };
  const checkObjectStrings = (where, object) => {
    for (const [key, value] of Object.entries(object)) {
      if (PLACES[key] && Array.isArray(value)) {
        value.forEach((item, i) => (isObject(item) ? checkObjectStrings(`${where}, ${PLACES[key]} ${i + 1}`, item) : checkString(where, `${PLACES[key]} ${i + 1}`, item)));
      } else if (key === "source" && isObject(value)) checkObjectStrings(`${where}, source`, value);
      else checkString(where, key, value);
    }
  };
  const checkText = (where, label, value) => {
    if (typeof value !== "string" || !value.trim()) return fail(where, `${label} must be text that is not empty`);
    if (/^[^\S\r\n]|[^\S\r\n]$/.test(value)) fail(where, `${label} has a space at its start or end`);
  };
  // The prose of the page (the story, the flags, the note, the intro, the later text, and the
  // subtitle) uses the curly apostrophe, as the curly quotes of the page. A name, a path, or the
  // "what" of an evidence entry keeps its own text.
  const checkProse = (where, label, value) => {
    if (typeof value === "string" && value.includes("'")) fail(where, `${label} has a straight apostrophe: use ’ (U+2019)`);
  };
  const checkFields = (where, object, allowed) => {
    for (const key of Object.keys(object)) if (!allowed.includes(key)) fail(where, `unknown field "${key}" (use: ${allowed.join(", ")})`);
  };
  const checkParagraphs = (where, label, list, max) => {
    if (!Array.isArray(list) || !list.length || list.length > max) {
      return fail(where, `${label} must be a list of ${max === Infinity ? "1 or more" : `1 or ${max}`} paragraphs`);
    }
    list.forEach((p, i) => {
      checkText(where, `${label} paragraph ${i + 1}`, p);
      checkProse(where, `${label} paragraph ${i + 1}`, p);
    });
  };
  const checkRepoName = (where, repo) => {
    if (typeof repo !== "string" || !REPO.test(repo)) fail(where, `repo must be a repo name; it is ${shown(repo)}`);
  };
  const checkRepoPath = (where, path) => {
    if (!isRepoPath(path) || path.includes("`")) fail(where, `path must be a path in the repo, with no "\`"; it is ${shown(path)}`);
  };
  const checkCommit = (where, value) => {
    if (typeof value !== "string" || !COMMIT.test(value)) fail(where, `commit must be the first 7 characters of a commit, in lowercase; it is ${shown(value)}`);
  };

  if (!isObject(data)) {
    fail("", `must be an object with the fields ${FIELDS.top.join(", ")}`);
    return null;
  }
  const chapters = Array.isArray(data.chapters) ? data.chapters : [];
  const chapterAt = (n) => `chapter ${n}`;
  // The place of a stage in an error: its id (unique in the whole file), or its chapter and its
  // number when the id is not valid or not unique.
  const stageAt = [];
  const ids = new Set();
  // Check one stage at its place in an error (at). cited and imageAt are the maps of its chapter
  // (an evidence entry and an image are unique in a chapter); seenIds holds the ids of the whole
  // file. Returns true when the id of the stage is valid and new.
  const checkStage = (stage, at, cited, imageAt) => {
    const { id } = stage;
    const idOk = typeof id === "string" && SLUG.test(id) && !seenIds.has(id);
    checkFields(at, stage, FIELDS.stage);
    if (typeof id !== "string" || !SLUG.test(id)) fail(at, `the id ${shown(id)} must be lowercase words joined by "-"`);
    else if (seenIds.has(id)) fail(at, `the id ${id} is used twice`);
    seenIds.add(id);
    checkText(at, "short", stage.short);
    checkText(at, "title", stage.title);
    if (!Object.hasOwn(ICONS, stage.icon)) fail(at, `unknown icon ${shown(stage.icon)} (use one of: ${Object.keys(ICONS).join(", ")})`);
    checkParagraphs(at, "story", stage.story, 2);

    if (stage.flags !== undefined && !Array.isArray(stage.flags)) fail(at, "flags must be a list");
    (Array.isArray(stage.flags) ? stage.flags : []).forEach((flag, j) => {
      const where = `${at}, flag ${j + 1}`;
      if (!isObject(flag)) return errors.push(`${DATA}: ${where} must be an object`);
      if (!Object.hasOwn(FLAGS, flag.kind)) return fail(where, `unknown kind ${shown(flag.kind)} (use ${Object.keys(FLAGS).join(" or ")})`);
      checkFields(where, flag, FIELDS[flag.kind]);
      checkText(where, "text", flag.text);
      checkProse(where, "text", flag.text);
      if (FLAGS[flag.kind].issue) {
        const { issue } = flag;
        const valid = issue === null || (isObject(issue) && Object.keys(issue).length === 2 && typeof issue.repo === "string" && REPO.test(issue.repo) && Number.isInteger(issue.number) && issue.number >= 1);
        if (!valid) fail(where, 'issue must be null (no public issue yet) or { "repo": a repo name, "number": a whole number from 1 }');
      } else if (typeof flag.question !== "string" || !flag.question.trim().endsWith("?")) {
        fail(where, 'a guess needs a question that ends with "?" (the question for the maintainer review)');
      } else {
        checkText(where, "question", flag.question);
        checkProse(where, "question", flag.question);
      }
    });
    if (stage.note !== undefined) {
      checkText(at, "note", stage.note);
      checkProse(at, "note", stage.note);
    }
    // "seeLink": a link at the end of the note to a public page, for a claim that no file of a repo
    // holds. A note ends with one link at most.
    if (stage.seeLink !== undefined) {
      const link = stage.seeLink;
      if (stage.seeChapter !== undefined) fail(at, "a note ends with one link: use seeChapter or seeLink");
      if (!isObject(link)) fail(at, `seeLink must be an object with the fields ${FIELDS.seeLink.join(", ")}`);
      else {
        checkFields(`${at}, seeLink`, link, FIELDS.seeLink);
        checkText(`${at}, seeLink`, "text", link.text);
        if (typeof link.url !== "string" || !/^https:\/\/[^\s"<>]+$/.test(link.url)) fail(`${at}, seeLink`, `url must be an https address; it is ${shown(link.url)}`);
      }
      if (stage.note === undefined) fail(at, "seeLink needs a note: the link ends the note");
    }

    // An image with a source comes from another repo (the credit line names it); an image with no
    // source was made for this page.
    if (stage.images !== undefined && !Array.isArray(stage.images)) fail(at, "images must be a list");
    (Array.isArray(stage.images) ? stage.images : []).forEach((image, j) => {
      const where = `${at}, image ${j + 1}`;
      if (!isObject(image)) return errors.push(`${DATA}: ${where} must be an object`);
      checkFields(where, image, FIELDS.image);
      if (typeof image.file !== "string" || !IMAGE_FILE.test(image.file)) fail(where, `file must be lowercase words joined by "-", with .png or .svg; it is ${shown(image.file)}`);
      else if (imageAt.has(image.file)) fail(where, `${image.file} is also ${imageAt.get(image.file)}: use each image once in a chapter`);
      else {
        imageAt.set(image.file, `image ${j + 1} of ${at}`);
        usedImages.add(image.file);
        const size = imageFiles.has(image.file) && imageSize(image.file);
        if (!imageFiles.has(image.file)) fail(where, `${IMAGES}/${image.file} is missing`);
        else if (!size) fail(where, `cannot read the size of ${IMAGES}/${image.file} (a PNG, or an SVG with a viewBox)`);
        else sizeOf.set(image.file, size);
      }
      if (image.frame !== undefined && image.frame !== "phone") fail(where, `frame must be "phone" or absent; it is ${shown(image.frame)}`);
      checkText(where, "alt", image.alt);
      checkText(where, "caption", image.caption);
      if (image.source === undefined) return;
      if (!isObject(image.source)) return fail(where, `source must be an object with the fields ${FIELDS.source.join(", ")}`);
      const from = `${where}, source`;
      checkFields(from, image.source, FIELDS.source);
      checkRepoName(from, image.source.repo);
      checkRepoPath(from, image.source.path);
      checkCommit(from, image.source.commit);
      checkText(from, "license", image.source.license);
    });

    if (!Array.isArray(stage.evidence) || !stage.evidence.length) fail(at, "evidence must be a list with at least one entry");
    (Array.isArray(stage.evidence) ? stage.evidence : []).forEach((entry, j) => {
      const where = `${at}, evidence ${j + 1}`;
      if (!isObject(entry)) return errors.push(`${DATA}: ${where} must be an object`);
      checkFields(where, entry, FIELDS.evidence);
      checkRepoName(where, entry.repo);
      checkRepoPath(where, entry.path);
      if (!parseLines(entry.lines)) fail(where, `lines must be "<n>" or "<first>-<last>", with 1 <= first < last; it is ${shown(entry.lines)}`);
      checkCommit(where, entry.commit);
      if (!Array.isArray(entry.names) || entry.names.length < 1 || entry.names.length > 3) fail(where, "names must be a list of 1 to 3 names");
      else {
        entry.names.forEach((name, k) => checkText(where, `name ${k + 1}`, name));
        const seen = new Set();
        for (const name of entry.names) {
          if (seen.has(name)) fail(where, `the name ${shown(name)} is there twice`);
          seen.add(name);
        }
      }
      checkText(where, "what", entry.what);
      const key = `${entry.repo} ${entry.path} ${entry.lines}`;
      if (cited.has(key)) fail(where, `the same repo, path, and lines as ${cited.get(key)}`);
      else cited.set(key, where);
    });

    // An issue backs a sentence of the story: an open issue of a public repo (--evidence checks it),
    // linked in "For developers" under its repo.
    if (stage.issues !== undefined && !Array.isArray(stage.issues)) fail(at, "issues must be a list");
    const issueAt = new Map(); // "<repo> #<number>" -> its number in the list
    (Array.isArray(stage.issues) ? stage.issues : []).forEach((issue, j) => {
      const where = `${at}, issue ${j + 1}`;
      if (!isObject(issue)) return errors.push(`${DATA}: ${where} must be an object`);
      checkFields(where, issue, FIELDS.issue);
      checkRepoName(where, issue.repo);
      if (!Number.isInteger(issue.number) || issue.number < 1) fail(where, `number must be a whole number from 1; it is ${shown(issue.number)}`);
      checkText(where, "what", issue.what);
      const key = `${issue.repo} #${issue.number}`;
      if (issueAt.has(key)) fail(where, `${key} is also issue ${issueAt.get(key)}`);
      else issueAt.set(key, j + 1);
    });

    if (stage.moreRepos !== undefined && !Array.isArray(stage.moreRepos)) fail(at, "moreRepos must be a list");
    const evidenceRepos = new Set((Array.isArray(stage.evidence) ? stage.evidence : []).map((entry) => entry?.repo));
    const issueRepos = new Set((Array.isArray(stage.issues) ? stage.issues : []).map((issue) => issue?.repo));
    const seenMore = new Set();
    (Array.isArray(stage.moreRepos) ? stage.moreRepos : []).forEach((more, j) => {
      const where = `${at}, more repo ${j + 1}`;
      if (!isObject(more)) return errors.push(`${DATA}: ${where} must be an object`);
      checkFields(where, more, FIELDS.moreRepo);
      if (evidenceRepos.has(more.repo)) fail(where, `${more.repo} has an evidence entry on this stage: remove it here`);
      else if (issueRepos.has(more.repo)) fail(where, `${more.repo} has an issue on this stage: remove it here`);
      else if (seenMore.has(more.repo)) fail(where, `${more.repo} is there twice`);
      else checkRepoName(where, more.repo);
      seenMore.add(more.repo);
      checkText(where, "what", more.what);
    });
    return idOk;
  };
  chapters.forEach((chapter, c) => {
    stageAt.push([]);
    (isObject(chapter) && Array.isArray(chapter.stages) ? chapter.stages : []).forEach((stage, i) => {
      const id = stage?.id;
      stageAt[c].push(typeof id === "string" && SLUG.test(id) && !ids.has(id) ? `stage ${id}` : `chapter ${c + 1}, stage ${i + 1}`);
      ids.add(id);
    });
  });
  for (const [key, value] of Object.entries(data)) {
    if (key !== "chapters" || !Array.isArray(value)) checkString("", key, value);
    else {
      value.forEach((chapter, c) => {
        if (!isObject(chapter)) return checkString("", chapterAt(c + 1), chapter);
        for (const [k, v] of Object.entries(chapter)) {
          if (k !== "stages" || !Array.isArray(v)) checkString(chapterAt(c + 1), k, v);
          else v.forEach((stage, i) => (isObject(stage) ? checkObjectStrings(stageAt[c][i], stage) : checkString(chapterAt(c + 1), `stage ${i + 1}`, stage)));
        }
      });
    }
  }

  checkFields("", data, FIELDS.top);
  checkText("", "title", data.title);
  if (!isObject(data.legend)) fail("", `legend must be an object with the fields ${FIELDS.legend.join(", ")}`);
  else {
    checkFields("legend", data.legend, FIELDS.legend);
    for (const key of FIELDS.legend) checkText("", `legend.${key}`, data.legend[key]);
  }
  if (data.later !== undefined) {
    checkText("", "later", data.later);
    checkProse("", "later", data.later);
  }
  if (!chapters.length) fail("", "chapters must be a list of 1 or more chapters");

  // The image directory holds only the images of the data file. A chapter uses each image once; an
  // image can show in more than one chapter.
  const entries = existsSync(join(root, IMAGES)) ? readdirSync(join(root, IMAGES), { withFileTypes: true }) : [];
  const imageFiles = new Set(entries.filter((f) => f.isFile()).map((f) => f.name));
  const usedImages = new Set();
  const seenIds = new Set();
  const chapterIds = new Set();
  // The stages with a "seeChapter" field, checked when every chapter id is known.
  const seeChapterStages = [];
  // The stage ids of each valid chapter, for the start of a later chapter.
  const stageIds = [];
  chapters.forEach((chapter, c) => {
    const n = c + 1;
    const at = chapterAt(n);
    stageIds.push(new Set());
    if (!isObject(chapter)) return errors.push(`${DATA}: ${at} must be an object`);
    checkFields(at, chapter, FIELDS.chapter);
    // Chapter 1 is the first page of the journey (chapterFiles): it has no id and no start. A later
    // chapter has an id for its file names, and the stage of chapter 1 where it starts (CONTEXT.md,
    // Chapter).
    if (n === 1) {
      if (chapter.id !== undefined) fail(at, "chapter 1 has no id: its page is capture-journey.html");
      if (chapter.start !== undefined) fail(at, "chapter 1 has no start: it is the start of the journey");
    } else {
      if (typeof chapter.id !== "string" || !CHAPTER_ID.test(chapter.id)) fail(at, `the id ${shown(chapter.id)} must be lowercase words joined by "-"`);
      else if (chapterIds.has(chapter.id)) fail(at, `the id ${chapter.id} is used twice`);
      else chapterById.set(chapter.id, c);
      chapterIds.add(chapter.id);
      const { start } = chapter;
      if (!isObject(start)) fail(at, `start must be an object with the fields ${FIELDS.start.join(", ")} (the stage of chapter 1 where this chapter starts)`);
      else {
        checkFields(`${at}, start`, start, FIELDS.start);
        if (start.chapter !== 1) fail(at, `start.chapter must be 1 (a later chapter starts at a stage of chapter 1); it is ${shown(start.chapter)}`);
        else if (!stageIds[0].has(start.stage)) fail(at, `start.stage must be the id of a stage of chapter 1; it is ${shown(start.stage)}`);
      }
    }
    checkText(at, "subtitle", chapter.subtitle);
    checkProse(at, "subtitle", chapter.subtitle);
    checkParagraphs(at, "intro", chapter.intro, Infinity);
    const stages = Array.isArray(chapter.stages) ? chapter.stages : [];
    if (!stages.length) fail(at, "stages must be a list of 1 or more stages");
    const cited = new Map(); // "<repo> <path> <lines>" -> the place of its first entry in the chapter
    const imageAt = new Map(); // file name -> its place in the chapter
    stages.forEach((stage, i) => {
      if (!isObject(stage)) return errors.push(`${DATA}: ${chapterAt(n)}, stage ${i + 1} must be an object`);
      if (checkStage(stage, stageAt[c][i], cited, imageAt)) stageIds[c].add(stage.id);
      if (stage.seeChapter !== undefined) seeChapterStages.push({ at: stageAt[c][i], stage, c });
    });
  });
  // "seeChapter": a link at the end of the note of a stage to another chapter (by its id). Chapter 1
  // has no id: another chapter links it with its start line.
  for (const { at, stage, c } of seeChapterStages) {
    if (stage.note === undefined) fail(at, "seeChapter needs a note: the link ends the note");
    else if (!chapterById.has(stage.seeChapter)) fail(at, `seeChapter must be the id of another chapter; it is ${shown(stage.seeChapter)}`);
    else if (chapterById.get(stage.seeChapter) === c) fail(at, "seeChapter names the chapter of this stage: link another chapter");
  }
  for (const f of entries) {
    if (!f.isFile()) errors.push(`${IMAGES}/${f.name} is a directory: the image directory holds only the image files`);
    else if (!usedImages.has(f.name)) errors.push(`${IMAGES}/${f.name} is in no stage of ${DATA}: add it to a stage, or remove it`);
  }
  // Each text copy in docs/ is the copy of a chapter (both directions: build writes the copy of
  // each chapter, and a copy of a removed chapter must go).
  const copies = new Set(chapters.map((chapter, c) => chapterFiles(chapter, c).copy));
  const docs = existsSync(join(root, "docs")) ? readdirSync(join(root, "docs"), { withFileTypes: true }) : [];
  for (const f of docs) {
    const at = `docs/${f.name}`;
    if (f.isFile() && CHAPTER_COPY.test(at) && !copies.has(at)) errors.push(`${at} is the text copy of no chapter of ${DATA}: remove it, or add its chapter`);
  }
  return errors.length > before ? null : data;
}

const data = validData(readDocsFile(DATA, errors, parseJson));

// The drawings in the site look: each SVG of the image directory with the site color block, its
// text, and its text with the current color block. The check reads the directory, not the data, so
// its errors show with the data errors.
const drawings = [];
if (existsSync(join(root, IMAGES)) && statSync(join(root, IMAGES)).isDirectory()) {
  const svgs = readdirSync(join(root, IMAGES), { withFileTypes: true }).filter((f) => f.isFile() && f.name.endsWith(".svg")).map((f) => f.name).sort();
  for (const file of svgs) {
    const at = `${IMAGES}/${file}`;
    const svg = readFileSync(join(root, at), "utf8");
    const next = drawingCheck(at, svg, errors);
    if (next !== null) drawings.push({ file, at, svg, next });
  }
}
if (drawings.length) checkSubsetScript(errors);
const stale = drawings.filter((d) => d.next !== d.svg);
// --check: a stale color block is an error. It shows with the other errors; with none, it shows with
// a stale copy (the copy needs valid data, so its check comes last).
const staleErrors = mode === "check" ? stale.map((d) => `${d.at}: the site colors are stale. Run: node ${SCRIPT}`) : [];

// ---------- The view: the data with its links, for both outputs ----------

// The directory of the images, as a relative path from the copy and from the page.
const imageDir = IMAGES.split("/").pop();
const fileLink = (e) => linesLink(estate.sourceOrg, e.repo, e.commit, e.path, parseLines(e.lines));
const repoLink = (repo) => `https://github.com/${estate.sourceOrg}/${repo}`;
const issueLink = ({ repo, number }) => `https://github.com/${estate.sourceOrg}/${repo}/issues/${number}`;
const commitLink = (repo, commit) => `https://github.com/${estate.sourceOrg}/${repo}/commit/${commit}`;
const linesText = ({ first, last }) => (first === last ? `line ${first}` : `lines ${first} to ${last}`);

// The view of a chapter: the data of the chapter, with the links of each repo, file, issue, and
// image source, and the size of each image. A repo of the estate gets the path of its viewer on the
// Pages site; a repo outside the estate gets its GitHub link. The developers of a stage are its
// repos in the order of their first evidence entry or issue, each with its files and its issues,
// then the repos with nothing cited. The link text of a file is its name and its lines, and of an
// issue its number: unique in the stage, so each link has its own name for a screen reader (one
// repo can have two entries in one file).
// The chapters part lists every chapter (the links between the pages): it is null when the data
// file has one chapter and no later text. A later chapter has its start: the stage of an earlier
// chapter where it starts.
function viewOf(chapter, c) {
  const repoView = (repo) => (estateRepos.has(repo) ? { repo, site: `${repo}/` } : { repo, github: repoLink(repo) });
  const fileView = (e) => ({ name: e.path.split("/").pop(), lines: linesText(parseLines(e.lines)), url: fileLink(e), what: e.what });
  const filesOf = (k) => chapterFiles(data.chapters[k], k);
  // The link at the end of a note: its text, and its target from the text copy and from the page.
  const seeOf = (stage) => {
    if (stage.seeLink) return { text: stage.seeLink.text, copy: stage.seeLink.url, page: stage.seeLink.url };
    if (stage.seeChapter === undefined) return null;
    const k = chapterById.get(stage.seeChapter);
    const { copy, page } = filesOf(k);
    return { text: `chapter ${k + 1}: ${data.chapters[k].subtitle}`, copy: copyName(copy), page };
  };
  const images = chapter.stages.flatMap((s) => s.images ?? []);
  const groups = new Map(); // "<repo> <commit> <license>" -> a group of the credit line
  for (const { source } of images.filter((image) => image.source)) {
    const key = `${source.repo} ${source.commit} ${source.license}`;
    const group = groups.get(key) ?? { ...source, repoUrl: repoLink(source.repo), commitUrl: commitLink(source.repo, source.commit), count: 0 };
    group.count++;
    groups.set(key, group);
  }
  let start = null;
  if (chapter.start) {
    const k = chapter.start.chapter - 1;
    const stages = data.chapters[k].stages;
    const i = stages.findIndex((s) => s.id === chapter.start.stage);
    // The anchor of the stage heading in the text copy, as GitHub makes it.
    const anchor = slugger()(`${i + 1}. ${stages[i].title}`);
    start = { chapter: k + 1, number: i + 1, id: stages[i].id, short: stages[i].short, anchor, ...filesOf(k) };
  }
  const hasChapterList = data.chapters.length > 1 || data.later !== undefined;
  return {
    title: data.title,
    chapter: c + 1,
    subtitle: chapter.subtitle,
    intro: chapter.intro,
    legend: data.legend,
    // The kinds of flag that the chapter has, in the order of the legend: the legend explains
    // only these.
    flagKinds: Object.keys(FLAGS).filter((kind) => chapter.stages.some((s) => (s.flags ?? []).some((f) => f.kind === kind))),
    imageDir,
    ...filesOf(c),
    start,
    chapters: hasChapterList ? { list: data.chapters.map((ch, k) => ({ number: k + 1, subtitle: ch.subtitle, current: k === c, ...filesOf(k) })), later: data.later ?? null } : null,
    stages: chapter.stages.map((stage) => ({
      id: stage.id,
      short: stage.short,
      title: stage.title,
      icon: stage.icon,
      story: stage.story,
      note: stage.note,
      // The link at the end of the note, or null.
      see: seeOf(stage),
      flags: (stage.flags ?? []).map((flag) => ({
        kind: flag.kind,
        text: flag.text,
        issue: flag.issue && { label: `${flag.issue.repo} #${flag.issue.number}`, url: issueLink(flag.issue) },
      })),
      images: (stage.images ?? []).map((image) => ({ ...image, ...sizeOf.get(image.file) })),
      // The repos of the evidence entries, then the repos of the issues, each with its files and
      // its issues; then the repos with nothing cited.
      developers: [
        ...[...new Set([...stage.evidence, ...(stage.issues ?? [])].map((e) => e.repo))].map((repo) => ({
          ...repoView(repo),
          files: stage.evidence.filter((e) => e.repo === repo).map(fileView),
          issues: (stage.issues ?? []).filter((i) => i.repo === repo).map((i) => ({ label: `issue #${i.number}`, url: issueLink(i), what: i.what })),
        })),
        ...(stage.moreRepos ?? []).map(({ repo, what }) => ({ ...repoView(repo), what, files: [], issues: [] })),
      ],
    })),
    credits: { groups: [...groups.values()], own: images.some((image) => !image.source) },
  };
}

// ---------- The text copy (GitHub) ----------

// Data text is plain text, on one line. In the copy it gets no Markdown meaning (t06cj renders the
// copy to prove it):
// - each mark that can start an inline format or HTML gets a backslash: \ ` * _ ~ [ ] < >. This also
//   covers the block starts "*", ">", "<", a fence of "`" or "~", and a thematic break of "*" or "_";
// - "&" becomes "&amp;", so no entity;
// - a text that starts with "-", "+", "=", or "#" gets a backslash: a list item, a thematic break
//   ("---"), a setext line, a heading;
// - a text that starts with a number and "." or ")" gets a backslash before the mark: an ordered
//   list item;
// - a text that ends with a space and "#" marks gets a backslash before them: in a heading they
//   would be its closing sequence, and the heading would lose them.
// A text never starts with 4 spaces (no indented code): the data check refuses a leading space.
const mdText = (s) =>
  s
    .replace(/[\\`*_~[\]<>]/g, "\\$&")
    .replace(/&/g, "&amp;")
    .replace(/^(\d+)([.)])(?=\s|$)/, "$1\\$2")
    .replace(/^[-+=#]/, "\\$&")
    .replace(/(\s)(#+)$/, "$1\\$2");
// A label of the Mermaid flow, in double quotes: "#" and '"' as Mermaid entity codes.
const mermaidLabel = (s) => s.replace(/#/g, "#35;").replace(/"/g, "#quot;");
// A small HTML escape for the HTML blocks of the copy (the images).
const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

// A repo of the estate links to its viewer and its onboarding guide on the Pages site; a repo
// outside the estate links to GitHub.
function repoMd(dev) {
  if (dev.github) return `[${dev.repo}](${dev.github}) (${NO_GUIDE})`;
  return `${dev.repo} ([viewer](${estate.siteUrl}${dev.site}), [onboarding guide](${estate.siteUrl}${dev.site}onboarding.html))`;
}

function developersMd(stage) {
  const lines = stage.developers.flatMap((dev) => [
    `- ${repoMd(dev)}${dev.what ? `: ${mdText(dev.what)}` : ""}`,
    ...dev.files.map((file) => `  - [\`${file.name}\` ${file.lines}](${file.url}): ${mdText(file.what)}`),
    ...dev.issues.map((issue) => `  - [${issue.label}](${issue.url}): ${mdText(issue.what)}`),
  ]);
  return ["<details>", "<summary>For developers</summary>", "", ...lines, "", "</details>"];
}

// The flags of a stage as quotes, in their order. The question of a guess is not on the page.
function flagsMd(stage) {
  return stage.flags.flatMap((flag) => {
    const { label, issue } = FLAGS[flag.kind];
    const named = !issue ? "" : flag.issue ? ` See [${flag.issue.label}](${flag.issue.url}).` : ` ${NO_ISSUE}`;
    return [`> **${label}:** ${mdText(flag.text)}${named}`, ""];
  });
}

// The images of a stage in one line: a phone screen at 160 px, a drawing at 360 px. The captions
// follow in the order of the images. HTML block: the texts get HTML escapes, not Markdown ones.
function imagesMd(stage) {
  if (!stage.images.length) return [];
  const imgs = stage.images.map((image) => `<img src="${imageDir}/${esc(image.file)}" width="${image.frame === "phone" ? 160 : 360}" alt="${esc(image.alt)}">`);
  return [`<p>${imgs.join(" ")}<br><sub>${stage.images.map((image) => esc(image.caption)).join(" · ")}</sub></p>`, ""];
}

// The file name of a text copy: the copies are in one directory, so a copy links another one by
// its file name.
const copyName = (copy) => copy.split("/").pop();

// The chapters part of a copy: the sentence on the chapters (on chapter 1 only: a later chapter
// has it in its start line), each chapter with a link to its copy (this page without a link), and
// the later text.
function chaptersMd(view) {
  if (!view.chapters) return [];
  const items = view.chapters.list.map((ch) => {
    const name = `Chapter ${ch.number}: ${mdText(ch.subtitle)}`;
    return ch.current ? `- ${name} (this page)` : `- [${name}](${copyName(ch.copy)})`;
  });
  return ["## Chapters", "", ...(view.start ? [] : [CHAPTERS_SENTENCE, ""]), ...items, "", ...(view.chapters.later ? [mdText(view.chapters.later), ""] : [])];
}

function copyText(view) {
  const { start } = view;
  const out = [
    `<!-- Built by ${SCRIPT} from ${DATA}. Do not edit. -->`,
    "",
    `# ${mdText(view.title)}`,
    "",
    `**Chapter ${view.chapter}: ${mdText(view.subtitle)}**`,
    "",
    `This is the text copy of the page for GitHub. The illustrated page is on the [Pages site](${estate.siteUrl}${view.page}).`,
    "",
    ...(start ? [`This chapter starts at [stage ${start.number} of chapter ${start.chapter}: ${mdText(start.short)}](${copyName(start.copy)}#${start.anchor}). ${CHAPTERS_SENTENCE}`, ""] : []),
    ...view.intro.flatMap((p) => [mdText(p), ""]),
    "How to read this page:",
    "",
    ...view.flagKinds.map((kind) => `- **${FLAGS[kind].label}:** ${mdText(view.legend[kind])}`),
    `- **For developers:** ${mdText(view.legend.dev)}`,
    "",
    "```mermaid",
    // Top to bottom: the stages are a chain, and a chain from left to right is too small to read
    // on a phone.
    "flowchart TB",
    ...view.stages.map((s, i) => `  s${i + 1}["${i + 1}. ${mermaidLabel(s.short)}"]`),
    ...(view.stages.length > 1 ? [`  ${view.stages.map((_, i) => `s${i + 1}`).join(" --> ")}`] : []),
    "```",
    "",
  ];
  view.stages.forEach((stage, i) => {
    out.push(`## ${i + 1}. ${mdText(stage.title)}`, "", ...imagesMd(stage), ...stage.story.flatMap((p) => [mdText(p), ""]), ...flagsMd(stage));
    if (stage.note) out.push(`${mdText(stage.note)}${stage.see ? seeText(stage.see, (text, see) => `[${mdText(text)}](${see.copy})`) : ""}`, "");
    out.push(...developersMd(stage), "");
  });
  out.push(...chaptersMd(view));
  const credit = creditText(view.credits, {
    repo: (g) => `[${g.repo}](${g.repoUrl})`,
    commit: (g) => `[\`${g.commit}\`](${g.commitUrl})`,
    text: mdText,
  });
  if (credit) out.push(credit, "");
  return out.join("\n");
}

// A guard of the page renders: in each page, each link to an anchor of the page or of another
// chapter page has its id, each link to another chapter page has its page, each id is unique, each
// image of the page is an image of the data file, and each custom property that the page uses has a
// definition (undefinedProperties of site-html.mjs). The data checks cannot see a defect of the
// render.
function checkPages(pages) {
  const idsOf = new Map([...pages].map(([page, html]) => [page, [...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])]));
  for (const [page, html] of pages) {
    const where = `${page} (built in memory)`;
    const ids = idsOf.get(page);
    for (const id of new Set(ids.filter((id, i) => ids.indexOf(id) !== i))) errors.push(`${where}: the id ${id} is used twice`);
    for (const [, id] of html.matchAll(/href="#([^"]*)"/g)) if (!ids.includes(id)) errors.push(`${where}: a link to #${id}, but no id ${id}`);
    for (const [, target, id] of html.matchAll(/href="([^"#:/]+\.html)(?:#([^"]*))?"/g)) {
      if (!CHAPTER_PAGE.test(target)) continue;
      if (!idsOf.has(target)) errors.push(`${where}: a link to ${target}, but no chapter has that page`);
      else if (id !== undefined && !idsOf.get(target).includes(id)) errors.push(`${where}: a link to ${target}#${id}, but no id ${id} there`);
    }
    for (const [, src] of html.matchAll(/\ssrc="([^"]*)"/g)) if (!sizeOf.has(src.replace(`${imageDir}/`, ""))) errors.push(`${where}: an image ${src} that is not in ${DATA}`);
    for (const n of undefinedProperties(html)) errors.push(`${where}: the page uses var(--${n}), but nothing defines --${n}`);
  }
}

// ---------- The evidence (GitHub) ----------

// Read each fact on GitHub, once for each repo, file, image, and issue (githubApi of estate.mjs):
// each repo is public; each cited file is in its repo at its commit, has the cited lines, and holds
// each name in them, by the name rule of estate.mjs (missingNames); each issue of a flag is an open
// issue; each image with a source is the same file (git blob SHA) as its source at its commit. An
// error never names a repo that GitHub does not show: it may be private now.
async function checkEvidence() {
  const api = githubApi(estate.sourceOrg, process.env.GITHUB_TOKEN);
  const fail = (where, message) => errors.push(`${DATA}: ${where}: ${message}`);
  // True if the repo is public; else record why at this place, with no repo name.
  const repoSet = new Set();
  const publicRepo = async (where, repo) => {
    repoSet.add(repo);
    const answer = await api.get(repo);
    if (answer.body) return answer.body.private === false ? true : (fail(where, "the repo is private: the page names only public repos"), false);
    if (answer.status === 404) fail(where, "the repo is not found (HTTP 404): it may be private now");
    else fail(where, `cannot read the repo (${answerStatus(answer)})`);
    return false;
  };
  const counts = { entries: 0, names: 0, images: 0, issues: 0 };
  const files = new Set(); // "<repo>@<commit>:<path>"

  for (const stage of data.chapters.flatMap((ch) => ch.stages)) {
    const at = `stage ${stage.id}`;
    for (const [j, flag] of (stage.flags ?? []).entries()) {
      if (!FLAGS[flag.kind].issue || !flag.issue) continue;
      const where = `${at}, flag ${j + 1}`;
      if (!(await publicRepo(where, flag.issue.repo))) continue;
      counts.issues++;
      const name = `${flag.issue.repo} #${flag.issue.number}`;
      const answer = await api.get(`${flag.issue.repo}/issues/${flag.issue.number}`);
      if (!answer.body) fail(where, `${name} is not found (${answerStatus(answer)})`);
      else if (answer.body.pull_request) fail(where, `${name} is a pull request, not an issue`);
      else if (answer.body.state !== "open") fail(where, `${name} is closed: check the flag, then remove the issue or the flag`);
    }
    for (const [j, image] of (stage.images ?? []).entries()) {
      if (!image.source) continue;
      const where = `${at}, image ${j + 1}`;
      const { repo, path, commit } = image.source;
      if (!(await publicRepo(where, repo))) continue;
      counts.images++;
      const answer = await api.file(repo, path, commit, "application/vnd.github+json");
      const bytes = readFileSync(join(root, IMAGES, image.file));
      const local = createHash("sha1").update(Buffer.concat([Buffer.from(`blob ${bytes.length}\0`), bytes])).digest("hex");
      if (!answer.body) fail(where, `${repo} ${path} is not in the repo at ${commit} (${answerStatus(answer)})`);
      else if (answer.body.sha !== local) fail(where, `${IMAGES}/${image.file} is not the file ${repo} ${path} at ${commit}`);
    }
    for (const [j, entry] of stage.evidence.entries()) {
      if (!(await publicRepo(`${at}, evidence ${j + 1}`, entry.repo))) continue;
      const range = parseLines(entry.lines);
      const where = `${at}, evidence ${j + 1} (${entry.repo} ${entry.path}${lineAnchor(range)} at ${entry.commit})`;
      counts.entries++;
      files.add(`${entry.repo}@${entry.commit}:${entry.path}`);
      const answer = await api.file(entry.repo, entry.path, entry.commit);
      if (answer.body === undefined) {
        fail(where, `the file is not in the repo at the commit (${answerStatus(answer)})`);
        continue;
      }
      const cited = citedLines(answer.body, range);
      if (cited.text === undefined) {
        fail(where, `the file has ${plural(cited.count, "line")}`);
        continue;
      }
      counts.names += entry.names.length;
      for (const name of missingNames(cited.text, entry.names)) fail(where, `${name} is not in the cited lines`);
    }
    for (const [j, issue] of (stage.issues ?? []).entries()) {
      const where = `${at}, issue ${j + 1}`;
      if (!(await publicRepo(where, issue.repo))) continue;
      counts.issues++;
      const name = `${issue.repo} #${issue.number}`;
      const answer = await api.get(`${issue.repo}/issues/${issue.number}`);
      if (!answer.body) fail(where, `${name} is not found (${answerStatus(answer)})`);
      else if (answer.body.pull_request) fail(where, `${name} is a pull request, not an issue`);
      else if (answer.body.state !== "open") fail(where, `${name} is closed: check the story, then remove the issue or its sentence`);
    }
    for (const [j, { repo }] of (stage.moreRepos ?? []).entries()) await publicRepo(`${at}, more repo ${j + 1}`, repo);
  }
  return `${plural(counts.entries, "evidence entry", "evidence entries")}, ${plural(counts.names, "name")}, ${plural(files.size, "file")}, ${plural(counts.images, "image")}, ${plural(counts.issues, "issue")}, ${plural(repoSet.size, "repo")}`;
}

// ---------- The modes ----------

function exitOnErrors() {
  if (!errors.length) return;
  errors.push(...staleErrors.splice(0));
  for (const e of errors) console.error(`error: ${e}`);
  process.exit(1);
}

exitOnErrors();
if (mode === "evidence") {
  const counts = await checkEvidence();
  exitOnErrors();
  console.log(`each capture journey fact holds (${counts})`);
  process.exit(0);
}
const { GITHUB_SHA: githubSha } = process.env;
const views = data.chapters.map(viewOf);
const copies = views.map((view) => ({ at: view.copy, text: copyText(view) }));
const pages = new Map(views.map((view) => [view.page, pageHtml(view, githubSha ? docsBlobUrl(estate, githubSha, view.copy) : null, estate.areas)]));
checkPages(pages);
exitOnErrors();

// The image files of all chapters, once each, in the order of the data file.
const imageFiles = [...new Set(data.chapters.flatMap((ch) => ch.stages.flatMap((s) => (s.images ?? []).map((image) => image.file))))];
const stages = data.chapters.flatMap((ch) => ch.stages);
const summary = [
  ...(data.chapters.length > 1 ? [plural(data.chapters.length, "chapter")] : []),
  plural(stages.length, "stage"),
  plural(stages.flatMap((s) => s.evidence).length, "evidence entry", "evidence entries"),
  plural(imageFiles.length, "image"),
].join(", ");
if (mode === "check") {
  const staleNow = [...copies.filter((c) => readDocsFile(c.at, []) !== c.text).map((c) => `${c.at} is stale. Run: node ${SCRIPT}`), ...staleErrors];
  if (staleNow.length) {
    for (const s of staleNow) console.error(`error: ${s}`);
    process.exit(1);
  }
  const current = [...copies.map((c) => c.at), ...(drawings.length ? [plural(drawings.length, "drawing")] : [])];
  console.log(`${wordList(current)} ${current.length === 1 ? "is" : "are"} current (${summary})`);
} else if (mode === "site") {
  for (const [page, html] of pages) writeFileSync(join(siteDir, page), html);
  mkdirSync(join(siteDir, imageDir), { recursive: true });
  const current = new Map(drawings.map((d) => [d.file, d.next]));
  for (const file of imageFiles) {
    const to = join(siteDir, imageDir, file);
    if (current.has(file)) writeFileSync(to, current.get(file));
    else copyFileSync(join(root, IMAGES, file), to);
  }
  console.log(`wrote ${wordList([...[...pages.keys()].map((page) => join(siteDir, page)), plural(imageFiles.length, "image")])} (${summary})`);
} else {
  for (const c of copies) writeFileSync(join(root, c.at), c.text);
  for (const d of stale) writeFileSync(join(root, d.at), d.next);
  console.log(`wrote ${wordList([...copies.map((c) => c.at), ...(stale.length ? [plural(stale.length, "drawing")] : [])])} (${summary})`);
}
