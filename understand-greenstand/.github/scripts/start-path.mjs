// The Start here path: the numbered steps for a new volunteer, in the Start here box of the
// landing page (build-landing.mjs) and in the Start here section of the README estate index
// (build-index.mjs). Both scripts take the steps from here, so the two copies show the same path.
// Most steps link a page of the docs repo: the page on the Pages site (page) and its file in the
// docs repo (file). A step with links (links) goes to other sites: its name is not a link, and a
// links line follows its description.
// The name of the capture journey step is the title in capture-journey.json. This module reads
// only that title; build-capture-journey.mjs checks the rest of the file.
import { existsSync } from "node:fs";
import { join } from "node:path";
import { CAPTURE_JOURNEY_COPY, CAPTURE_JOURNEY_DATA, ROADMAP_COPY, SHARED_RESOURCES_PAGE, isObject, parseJson, readDocsFile, root } from "./estate.mjs";

// The steps, in order: the story first, then the maps, the shared resources, the roadmap, and
// Greenstand itself. Records each problem in errors. The page and the file of a page step are
// always set. The name of the capture journey step is null if capture-journey.json has no title:
// then errors names the problem, and the caller must print the errors and exit before it shows a
// step.
export function startPath(errors) {
  const journeyTitle = readDocsFile(CAPTURE_JOURNEY_DATA, errors, (text) => {
    const data = parseJson(text);
    if (!isObject(data) || typeof data.title !== "string" || !data.title.trim()) {
      throw new Error("must have a title (a text). Run: node .github/scripts/build-capture-journey.mjs --check");
    }
    return data.title;
  });
  const steps = [
    {
      name: journeyTitle,
      description: "How one capture travels from the grower's phone to the grower's reward, step by step, with pictures.",
      page: "capture-journey.html",
      file: CAPTURE_JOURNEY_COPY,
    },
    {
      name: "Ecosystem maps",
      description: "How the code repos work together at run time: which app calls which API, and which data they share.",
      page: "architecture.html",
      file: "ARCHITECTURE.md",
    },
    {
      name: "Shared resources",
      description: "What the code repos share to build, deploy, and run, for example the container registry, the clusters, and the shared database.",
      page: "shared-resources.html",
      file: SHARED_RESOURCES_PAGE,
    },
    {
      name: "Roadmap",
      description: "What Greenstand plans to build next: the milestones and the work for each area.",
      page: "roadmap.html",
      file: ROADMAP_COPY,
    },
    {
      name: "Greenstand and the live map",
      description: "The Greenstand website: the mission, how Treetracker works, and how to help. The live Treetracker map: the trees that growers around the world captured.",
      links: [
        { text: "Website", url: "https://greenstand.org" },
        { text: "Live map", url: "https://map.treetracker.org" },
      ],
    },
  ];
  for (const { file } of steps) if (file && !existsSync(join(root, file))) errors.push(`${file} is missing: a step of the Start here path links to it`);
  return steps;
}
