// Heading anchors that match GitHub's, so one "#anchor" link works on GitHub and on the Pages
// site. build-glossary.mjs uses it to write links; render-md.mjs uses it to write heading ids.
// Like github-slugger: lowercase, drop punctuation and symbols (keep letters, numbers, "-",
// "_", and spaces), turn each space into "-", and number repeats ("x", "x-1", "x-2").
export function slugger() {
  const seen = new Map();
  return (text) => {
    const base = text.toLowerCase().replace(/[^\p{L}\p{M}\p{N}\p{Pc} -]/gu, "").replace(/ /g, "-");
    let slug = base;
    while (seen.has(slug)) {
      seen.set(base, seen.get(base) + 1);
      slug = `${base}-${seen.get(base)}`;
    }
    seen.set(slug, 0);
    return slug;
  };
}
