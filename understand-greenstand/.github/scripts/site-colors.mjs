// The colors of the site look: the pages read as a land-cover map of the code estate (DESIGN.md).
// The pages follow the color scheme of the reader, so each color is a pair: [light, dark].
// site-html.mjs makes the CSS custom properties from them (--<name>, and --c-<name> for an area
// color). estate.mjs checks the area color of each area of estate.json. check-site-colors.mjs
// checks the colors.

// The backgrounds of text: the ground (the page) and the surface (a field on the page, for
// example the Start here box).
export const BACKGROUNDS = {
  ground: ["#f3f5f0", "#131915"],
  surface: ["#e8ece5", "#1b231e"],
};

// The text colors. Water blue is for links only.
export const TEXTS = {
  ink: ["#1b2420", "#e2e8e0"],
  muted: ["#56625a", "#9aa79e"],
  link: ["#2c5d84", "#8fb9d9"],
  "best-guess": ["#7a5a12", "#d9b25c"],
  "not-working": ["#9e3f4b", "#e08a93"],
};

// The state colors: the text colors of a best guess and of a part that does not work (or is
// gone). A state never shows by its color alone: a best guess also has a hatch, and a part that
// does not work also has a cross.
export const STATES = ["best-guess", "not-working"];

// The hairline rules.
export const LINES = {
  line: ["#c5cec3", "#2e3a33"],
};

// The area colors: the land-cover class of each area (the "color" of an area in estate.json).
// They fill the cells of the estate strip and the estate mark, the chips, the rules, and the tints
// of an area; they never color text. Organization has the ink color; Start here has no repos and
// no color.
export const AREA_COLORS = {
  ink: TEXTS.ink,
  evergreen: ["#35614e", "#33634d"],
  cropland: ["#92600d", "#916618"],
  shrub: ["#bba25b", "#b49e56"],
  wetland: ["#6f9db3", "#7fb0c6"],
  deciduous: ["#6c8951", "#49854f"],
  "mixed-forest": ["#b1bd97", "#b1b38e"],
  "bare-ground": ["#7c796e", "#858377"],
};

// The ink share of the parcel field (DESIGN.md): the percent of the ink color in the color of its
// boundaries and rows, [light, dark]. The field lies on the ground, under the title and the estate
// strip. check-site-colors.mjs keeps the field at a contrast of 1.25:1 or less with the ground, and
// each text color at 4.5:1 or more on the field.
export const PARCEL_FIELD_INK_SHARE = [11.5, 9.1];

// The diagram node tint (DESIGN.md): the percent of the area color in the fill of a repo node of a
// Mermaid diagram, mixed with the ground. The node labels are ink. check-site-colors.mjs keeps the
// ink at 4.5:1 or more on the tint of each area color.
export const DIAGRAM_NODE_TINT = 30;
