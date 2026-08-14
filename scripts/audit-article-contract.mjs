import fs from "node:fs";
import path from "node:path";
import {
  collectArticleSourceClosure,
  loadPublicArticleCatalog,
} from "./lib/public-article-catalog.mjs";

const roots = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
const json = process.argv.includes("--json");
const strict = process.argv.includes("--strict");
const allArticles = process.argv.includes("--all-articles");
const sourceExtensions = new Set([".tsx", ".ts"]);

function collect(target, files = []) {
  if (!fs.existsSync(target)) return files;
  const stat = fs.statSync(target);
  if (stat.isFile()) {
    if (sourceExtensions.has(path.extname(target))) files.push(target);
    return files;
  }
  for (const entry of fs.readdirSync(target)) collect(path.join(target, entry), files);
  return files;
}

const articleFiles = collect("src/pages/articles");
const fileSet = new Set(articleFiles.map((file) => path.resolve(file)));

function resolveImport(from, specifier) {
  if (!specifier.startsWith(".")) return undefined;
  const base = path.resolve(path.dirname(from), specifier);
  for (const candidate of [base, `${base}.tsx`, `${base}.ts`, path.join(base, "index.tsx"), path.join(base, "index.ts")]) {
    if (fileSet.has(candidate)) return candidate;
  }
  return undefined;
}

function trace(entry, seen = new Set()) {
  const absolute = path.resolve(entry);
  if (!fileSet.has(absolute) || seen.has(absolute)) return seen;
  seen.add(absolute);
  const source = fs.readFileSync(absolute, "utf8");
  const importPattern = /(?:import|export)\s+(?:[^"']+?\s+from\s+)?["']([^"']+)["']/g;
  for (const match of source.matchAll(importPattern)) {
    const resolved = resolveImport(absolute, match[1]);
    if (resolved) trace(resolved, seen);
  }
  return seen;
}

const groups = new Map();
if (allArticles) {
  const catalog = await loadPublicArticleCatalog();
  for (const article of catalog) {
    groups.set(article.route, collectArticleSourceClosure(article.sourcePath));
  }
} else {
  const files = [...new Set((roots.length ? roots : ["src/pages/articles"]).flatMap((root) => collect(root)))];
  for (const file of files) {
    const relative = path.relative("src/pages/articles", file);
    const parts = relative.split(path.sep);
    const article =
      parts.length >= 3
        ? parts[1]
        : path.basename(parts[1] ?? "index", path.extname(parts[1] ?? ""));
    const group = path.join("src/pages/articles", parts[0], article);
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group).push(file);
  }
}

const rows = [];
for (const [group, groupFiles] of groups) {
  const entry = allArticles ? undefined : `${group}.tsx`;
  const reachable = entry && fs.existsSync(entry) ? [...trace(entry)] : groupFiles;
  const source = reachable.map((file) => fs.readFileSync(file, "utf8")).join("\n");
  const sectionCount = (source.match(/<section\b/g) ?? []).length;
  // `ExplainedFormula` owns its own display math.  Anything still rendered
  // directly through Math/M or a raw TeX display is a migration candidate:
  // one explained formula elsewhere in the article must not hide it.
  const displayMath = (source.match(/<Math\s+display|<M\s+display/g) ?? []).length;
  const explained = (source.match(/<ExplainedFormula\b/g) ?? []).length;
  const viz = (source.match(/<StepViz\b|data-viz=|<VizFrame\b/g) ?? []).length;
  const gradients = (source.match(/bg-gradient|<linearGradient|<radialGradient/g) ?? []).length;
  const thickStroke = (source.match(/strokeWidth=\{?(?:["']?[2-9]|["']?1\.(?:[3-9]\d*|2[6-9]))/g) ?? []).length;
  const awkward = (source.match(/시킨 말|검사를 닫|결과(?:물)?을 버렸|결과(?:물)?를 버렸/g) ?? []).length;
  let score = 0;
  if (sectionCount > 0 && !/id=["']overview["']/.test(source)) score += 2;
  if (displayMath > 0) score += Math.min(8, displayMath * 2);
  score += Math.min(6, gradients * 2);
  score += Math.min(6, thickStroke);
  score += awkward * 3;
  if (sectionCount > 0 && viz === 0) score += 1;
  if (score > 0) rows.push({ group, score, sectionCount, displayMath, explained, viz, gradients, thickStroke, awkward });
}

rows.sort((a, b) => b.score - a.score || a.group.localeCompare(b.group));
if (json) {
  console.log(JSON.stringify(rows, null, 2));
} else {
  console.log("score  formula  explained  viz  gradient  thick  article");
  for (const row of rows) {
    console.log(
      `${String(row.score).padStart(5)}  ${String(row.displayMath).padStart(7)}  ${String(row.explained).padStart(9)}  ${String(row.viz).padStart(3)}  ${String(row.gradients).padStart(8)}  ${String(row.thickStroke).padStart(5)}  ${row.group}`,
    );
  }
  console.log(`\n계약 이관 후보 ${rows.length}개 그룹 / 감사 범위 ${groups.size}개 글`);
}

// A text-only article can legitimately have no Viz.  Keep that as a migration
// hint (score 1), but strict mode fails only material contract violations.
if (strict && rows.some((row) => row.score >= 2)) process.exitCode = 1;
