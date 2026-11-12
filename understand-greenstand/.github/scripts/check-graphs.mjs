#!/usr/bin/env node
// Check these rules for each graph (repos/<name>/knowledge-graph.json). docs/regenerating.md,
// step 2, tells why a regeneration can break them.
// - No node is for a file of .ua/, the data directory of Understand-Anything.
// - Each reference to a node (an edge, a layer, a tour step) names a node of the graph. A hand
//   edit that removes a node can leave such a reference.
// - The project block of the graph and of the domain graph (domain-graph.json) is correct. The
//   viewer shows project.name as its title. It shows project.description in its info panel.
//   The name is the repo name. The description has no note of the project scanner.
// Usage: node check-graphs.mjs   exit 1 and show each problem (CI)
import { existsSync } from "node:fs";
import { join } from "node:path";
import { isObject, loadEstate, parseJson, readDocsFile, readGraph, root } from "./estate.mjs";

const IS_DATA = `is a node for a file of .ua/, the data directory of Understand-Anything. Regenerate the repo with --exclude ".ua/" (docs/regenerating.md, step 2).`;
// A path in .ua/ at the root of the source repo: the filePath of a node, or the path in its ID
// after the prefix and the colon ("file:.ua/.understandignore").
const IN_DATA_FILE_PATH = /^(\.\/)?\.ua\//;
const IN_DATA_ID = /^[^:]*:(\.\/)?\.ua\//;
const inData = ({ id, filePath }) =>
  (typeof filePath === "string" && IN_DATA_FILE_PATH.test(filePath)) || (typeof id === "string" && IN_DATA_ID.test(id));
// The note of the project scanner: "Note: this project has over 100 source files; consider
// scoping analysis to a subdirectory for faster results." An LLM writes it, so the words can vary.
const SCANNER_NOTE = /note:\s*this project has (over|more than) 100 (source )?files/i;

const { repos, errors } = loadEstate();

// Check the project block of the graph or the domain graph at the path at.
function checkProject(at, project, name) {
  if (!isObject(project)) return errors.push(`${at}: project must be a JSON object`);
  const { name: projectName, description } = project;
  if (projectName !== name) errors.push(`${at}: project.name is ${JSON.stringify(projectName)}; correct it to the repo name, ${name}`);
  if (typeof description !== "string" || !description.trim()) {
    errors.push(`${at}: project.description must be one or two sentences about the repo`);
  } else if (SCANNER_NOTE.test(description)) {
    errors.push(`${at}: project.description has the note of the project scanner ("Note: this project has over 100 source files; ..."); delete the note`);
  }
}

for (const { name } of repos) {
  const at = `repos/${name}/knowledge-graph.json`;
  const graph = readGraph(name, errors);
  if (graph === null) continue;
  for (const node of graph.nodes) if (inData(node)) errors.push(`${at}: ${node.id} ${IS_DATA}`);

  const ids = new Set(graph.nodes.map((n) => n.id));
  const references = [
    ...(graph.edges ?? []).flatMap((e, i) => [e.source, e.target].map((id) => [`edge ${i}`, id])),
    ...(graph.layers ?? []).flatMap((l, i) => l.nodeIds.map((id) => [`layer ${l.id ?? i}`, id])),
    ...(graph.tour ?? []).flatMap((s, i) => s.nodeIds.map((id) => [`tour step ${s.order ?? i}`, id])),
  ];
  for (const [where, id] of references) {
    if (!ids.has(id)) errors.push(`${at}: ${where} names the node ${id}, which does not exist`);
  }

  checkProject(at, graph.project, name);

  // A repo can lack a domain graph. Wrap the value: readDocsFile returns null for an error.
  const domainAt = `repos/${name}/domain-graph.json`;
  if (!existsSync(join(root, domainAt))) continue;
  const domain = readDocsFile(domainAt, errors, (text) => ({ graph: parseJson(text) }));
  if (domain === null) continue;
  if (!isObject(domain.graph)) errors.push(`${domainAt}: the domain graph must be a JSON object`);
  else checkProject(domainAt, domain.graph.project, name);
}

if (errors.length) {
  for (const e of errors) console.error(`error: ${e}`);
  process.exit(1);
}
console.log(`the graphs pass the rules of check-graphs.mjs (${repos.length} graphs)`);
