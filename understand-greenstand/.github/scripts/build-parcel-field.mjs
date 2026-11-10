#!/usr/bin/env node
// Draw the parcel field of the site look (DESIGN.md) into <site-dir>/art/parcel-field.svg: the
// boundaries of made-up field parcels, seen from above, and rows of points (planting rows) in some
// parcels. The file is a mask: black marks on no ground. The pages color it with the ink color
// (site-html.mjs), so one file serves light and dark. A seeded random source draws it, so each run
// writes the same file, byte for byte.
// The deploy workflow runs it before build-landing.mjs, which fails if the file is missing.
// Usage: node build-parcel-field.mjs <site-dir>
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { PARCEL_FIELD } from "./site-html.mjs";

const site = process.argv[2];
if (!site) {
  console.error("usage: node build-parcel-field.mjs <site-dir>");
  process.exit(2);
}

// The size of the field. The pages cover their layer with it and cut the sides that do not fit.
const WIDTH = 1600;
const HEIGHT = 1000;
// The seed of the field that the user chose (site-look ticket 08: Background 2b).
const SEED = 20261103;

// A seeded random source (mulberry32): numbers from 0 to 1.
function random(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// A coordinate with one decimal and no trailing zero.
const coordinate = (v) => (Math.round(v * 10) / 10).toString();

const area = (p) => Math.abs(p.reduce((s, [x, y], i) => {
  const [u, v] = p[(i + 1) % p.length];
  return s + x * v - u * y;
}, 0)) / 2;
const centre = (p) => [p.reduce((s, q) => s + q[0], 0) / p.length, p.reduce((s, q) => s + q[1], 0) / p.length];
// The box around a polygon: [left, top, right, bottom].
const bounds = (p) => [
  Math.min(...p.map(([x]) => x)), Math.min(...p.map(([, y]) => y)),
  Math.max(...p.map(([x]) => x)), Math.max(...p.map(([, y]) => y)),
];

// Cut a convex polygon in two along the line through (px, py) with the normal (nx, ny).
function cut(poly, px, py, nx, ny) {
  const side = ([x, y]) => (x - px) * nx + (y - py) * ny;
  const a = [];
  const b = [];
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i];
    const q = poly[(i + 1) % poly.length];
    const sp = side(p);
    const sq = side(q);
    (sp >= 0 ? a : b).push(p);
    if ((sp >= 0) !== (sq >= 0)) {
      // The point where the cut line crosses the edge p-q, at the share "along" from p.
      const along = sp / (sp - sq);
      const c = [p[0] + along * (q[0] - p[0]), p[1] + along * (q[1] - p[1])];
      a.push(c);
      b.push(c);
    }
  }
  return [a, b];
}

// Is the point (x, y) inside the polygon p (even-odd rule)?
function inside(p, x, y) {
  let c = false;
  for (let i = 0, j = p.length - 1; i < p.length; j = i++) {
    const [xi, yi] = p[i];
    const [xj, yj] = p[j];
    if ((yi > y) !== (yj > y) && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) c = !c;
  }
  return c;
}

// The parcels: a rectangle a little larger than the field is cut again and again by straight
// lines, nearly across the longer side of each piece, until each piece is small.
function parcels(next) {
  const done = [];
  const queue = [[[-40, -40], [WIDTH + 40, -40], [WIDTH + 40, HEIGHT + 40], [-40, HEIGHT + 40]]];
  while (queue.length) {
    const piece = queue.pop();
    if (area(piece) < 9000 + next() * 16000) {
      done.push(piece);
      continue;
    }
    const [left, top, right, bottom] = bounds(piece);
    const [cx, cy] = centre(piece);
    const across = right - left > bottom - top ? 0 : Math.PI / 2;
    const angle = across + Math.PI / 2 + (next() - 0.5) * 0.5;
    const nx = Math.cos(angle + Math.PI / 2);
    const ny = Math.sin(angle + Math.PI / 2);
    const offset = (next() - 0.5) * 0.4 * Math.min(right - left, bottom - top);
    const [a, b] = cut(piece, cx + nx * offset, cy + ny * offset, nx, ny);
    if (a.length < 3 || b.length < 3 || area(a) < 2500 || area(b) < 2500) {
      done.push(piece);
      continue;
    }
    queue.push(a, b);
  }
  return done;
}

// The points that are 7 units or more from the edge of a parcel: all 4 neighbors at that distance
// are inside it (a parcel is convex).
const INSET = [[7, 0], [-7, 0], [0, 7], [0, -7]];
const farFromEdge = (p, x, y) => INSET.every(([dx, dy]) => inside(p, x + dx, y + dy));

// The planting rows of about one parcel in five: rows of points in one direction, 9 units apart,
// 7 units or more from the edge of the parcel. Each point is a path of length 0 with a round cap.
function rows(next, all) {
  let d = "";
  for (const p of all) {
    if (next() > 0.22) continue;
    const angle = next() * Math.PI;
    const ux = Math.cos(angle);
    const uy = Math.sin(angle);
    const gap = 9;
    const [cx, cy] = centre(p);
    for (let v = -260; v <= 260; v += gap) {
      for (let u = -260; u <= 260; u += gap) {
        const x = cx + u * ux - v * uy;
        const y = cy + u * uy + v * ux;
        if (farFromEdge(p, x, y)) d += `M${coordinate(x)} ${coordinate(y)}h0`;
      }
    }
  }
  return d;
}

function parcelField() {
  const next = random(SEED);
  const all = parcels(next);
  // Each boundary is on 2 parcels and is drawn twice: in a mask, the overlap does not show.
  const boundaries = all.map((p) => "M" + p.map(([x, y]) => `${coordinate(x)} ${coordinate(y)}`).join("L") + "Z").join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${WIDTH} ${HEIGHT}" width="${WIDTH}" height="${HEIGHT}" preserveAspectRatio="xMidYMid slice">` +
    `<path d="${boundaries}" fill="none" stroke="#000" stroke-width="1.1" stroke-linejoin="round"/>` +
    `<path d="${rows(next, all)}" stroke="#000" stroke-width="2.4" stroke-linecap="round" stroke-opacity=".8"/></svg>\n`;
}

const file = join(site, PARCEL_FIELD);
mkdirSync(dirname(file), { recursive: true });
writeFileSync(file, parcelField());
console.log(`wrote ${file}`);
