import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { loadPublicArticleCatalog } from "./lib/public-article-catalog.mjs";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const auditDir = path.join(repoRoot, "docs", "teach-system-audit");
const outputPath = path.join(auditDir, "current-coverage.json");
const strict = process.argv.includes("--strict");
const write = process.argv.includes("--write");

const groupFiles = ["ai-theory.json", "ai-systems.json", "chains.json", "world-systems.json"];

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function checkpointNumber(name) {
  return Number(name.match(/^checkpoint-(\d+)\.json$/)?.[1] ?? -1);
}

const catalog = await loadPublicArticleCatalog({ root: repoRoot });
const catalogByRoute = new Map(catalog.map((article) => [article.route, article]));
const routeByPublicPath = new Map(catalog.map((article) => [article.publicPath, article.route]));

function normalizeRoute(value) {
  if (typeof value !== "string") return undefined;
  const withoutHash = value.split("#", 1)[0].replace(/^\/+|\/+$/g, "");
  if (catalogByRoute.has(withoutHash)) return withoutHash;
  if (routeByPublicPath.has(withoutHash)) return routeByPublicPath.get(withoutHash);
  const tail = withoutHash.split("/").filter(Boolean).slice(-2).join("/");
  return catalogByRoute.has(tail) ? tail : undefined;
}

const errors = [];
const warnings = [];
const assignmentOwner = new Map();
const assignments = readJson(path.join(auditDir, "assignments.json"));
for (const [owner, routes] of Object.entries(assignments)) {
  for (const route of routes) {
    if (!catalogByRoute.has(route)) errors.push(`assignment의 route가 public catalog에 없습니다: ${owner} → ${route}`);
    if (assignmentOwner.has(route)) errors.push(`assignment가 중복됐습니다: ${route}`);
    assignmentOwner.set(route, owner);
  }
}

const groupRecord = new Map();
for (const name of groupFiles) {
  const group = readJson(path.join(auditDir, name));
  for (const article of group.articles ?? []) {
    const route = normalizeRoute(article.route);
    if (!route) {
      errors.push(`${name}의 route가 public catalog에 없습니다: ${article.route}`);
      continue;
    }
    if (groupRecord.has(route)) errors.push(`그룹 감사 기록이 중복됐습니다: ${route}`);
    groupRecord.set(route, { file: name, status: article.status });
  }
}

for (const [route, owner] of assignmentOwner) {
  if (!groupRecord.has(route)) errors.push(`assignment에 있지만 그룹 감사 기록이 없습니다: ${owner} → ${route}`);
}
for (const route of groupRecord.keys()) {
  if (!assignmentOwner.has(route)) errors.push(`그룹 감사 기록에 있지만 assignment에 없습니다: ${route}`);
}

const checkpointFiles = fs.readdirSync(auditDir)
  .filter((name) => /^checkpoint-\d+\.json$/.test(name))
  .sort((a, b) => checkpointNumber(a) - checkpointNumber(b));
const checkpointReviewed = new Set();
const checkpointEvents = new Map();
const historicalCountAnomalies = [];

function addCheckpointEvent(rawRoute, file, field, addsCoverage) {
  const route = normalizeRoute(rawRoute);
  if (!route) {
    errors.push(`${file} ${field}의 route가 public catalog에 없습니다: ${rawRoute}`);
    return;
  }
  if (!checkpointEvents.has(route)) checkpointEvents.set(route, []);
  checkpointEvents.get(route).push({ checkpoint: file, field });
  if (addsCoverage) checkpointReviewed.add(route);
}

for (const name of checkpointFiles) {
  const checkpoint = readJson(path.join(auditDir, name));
  for (const route of checkpoint.routes ?? []) addCheckpointEvent(route, name, "routes", true);
  for (const route of checkpoint.addedRoutes ?? []) addCheckpointEvent(route, name, "addedRoutes", true);
  for (const route of checkpoint.rewrittenRoutes ?? []) addCheckpointEvent(route, name, "rewrittenRoutes", false);
  for (const route of checkpoint.touchedRoutes ?? []) addCheckpointEvent(route, name, "touchedRoutes", false);

  const claimedReviewed = checkpoint.reviewed ?? checkpoint.reviewedArticles;
  if (Number.isInteger(claimedReviewed) && claimedReviewed !== checkpointReviewed.size) {
    historicalCountAnomalies.push({
      checkpoint: name,
      claimedReviewed,
      uniqueReviewedAtCheckpoint: checkpointReviewed.size,
      difference: claimedReviewed - checkpointReviewed.size,
    });
  }
}

const postCheckpoint = readJson(path.join(auditDir, "post-checkpoint-routes.json"));
const postRecord = new Map();
for (const article of postCheckpoint.articles ?? []) {
  const route = normalizeRoute(article.route);
  if (!route) {
    errors.push(`post-checkpoint route가 public catalog에 없습니다: ${article.route}`);
    continue;
  }
  if (assignmentOwner.has(route) || checkpointReviewed.has(route)) {
    errors.push(`post-checkpoint route가 기존 범위와 중복됩니다: ${route}`);
  }
  if (postRecord.has(route)) errors.push(`post-checkpoint route가 중복됐습니다: ${route}`);
  postRecord.set(route, article);
}

const verifiedPostStatuses = new Set(["reviewed-local", "reviewed-production"]);
const articles = [...catalog]
  .sort((a, b) => a.catalogIndex - b.catalogIndex)
  .map((article) => {
    const group = groupRecord.get(article.route);
    const post = postRecord.get(article.route);
    const historicallyReviewed = checkpointReviewed.has(article.route)
      || (group && group.status !== "unreviewed")
      || (post && verifiedPostStatuses.has(post.status));
    const tracked = assignmentOwner.has(article.route) || checkpointReviewed.has(article.route) || Boolean(post);
    const status = historicallyReviewed ? "reviewed" : tracked ? "pending" : "untracked";
    const provenance = checkpointReviewed.has(article.route)
      ? "checkpoint"
      : group
        ? `assignment:${assignmentOwner.get(article.route)}`
        : post
          ? "post-checkpoint-registry"
          : "none";
    return {
      route: article.route,
      publicPath: article.publicPath,
      title: article.title,
      catalogIndex: article.catalogIndex,
      status,
      provenance,
      recordedStatus: post?.status ?? group?.status ?? null,
      evidence: post?.evidence ?? (group ? `docs/teach-system-audit/${group.file}` : null),
    };
  });

const reviewed = articles.filter((article) => article.status === "reviewed");
const pending = articles.filter((article) => article.status === "pending");
const untracked = articles.filter((article) => article.status === "untracked");
const assignedPending = pending.filter((article) => article.provenance.startsWith("assignment:"));
const postCheckpointPending = pending.filter((article) => article.provenance === "post-checkpoint-registry");

if (untracked.length > 0) errors.push(`public catalog ${untracked.length}편이 어떤 검수 장부에도 없습니다.`);
if (articles.length !== catalogByRoute.size) errors.push("coverage 결과에 중복 route가 있습니다.");

const lastCheckpoint = readJson(path.join(auditDir, checkpointFiles.at(-1)));
const report = {
  schemaVersion: 1,
  summary: {
    publicArticles: articles.length,
    reviewed: reviewed.length,
    pending: pending.length,
    untracked: untracked.length,
    assignedPending: assignedPending.length,
    postCheckpointPending: postCheckpointPending.length,
    latestHistoricalClaim: lastCheckpoint.reviewed ?? lastCheckpoint.reviewedArticles ?? null,
    uniqueCheckpointReviewed: checkpointReviewed.size,
    historicalOvercount: (lastCheckpoint.reviewed ?? 0) - checkpointReviewed.size,
  },
  historicalCountAnomalies,
  warnings,
  errors,
  articles,
};
const serialized = `${JSON.stringify(report, null, 2)}\n`;

if (write) fs.writeFileSync(outputPath, serialized);
else if (!fs.existsSync(outputPath) || fs.readFileSync(outputPath, "utf8") !== serialized) {
  errors.push("current-coverage.json이 현재 catalog·장부와 다릅니다. --write로 갱신하세요.");
}

console.log(
  `teach-system 전수 장부: 공개 ${articles.length}편 · 검토 ${reviewed.length}편 · 미검토 ${pending.length}편 · 미등록 ${untracked.length}편`,
);
console.log(
  `과거 checkpoint 고유 완료 ${checkpointReviewed.size}편 · 최신 표기 ${report.summary.latestHistoricalClaim}편 · 중복 가산 ${report.summary.historicalOvercount}편`,
);
console.log(`미검토 구성: 기존 assignment ${assignedPending.length}편 · checkpoint 이후 ${postCheckpointPending.length}편`);
if (historicalCountAnomalies.length > 0) {
  console.log("과거 누적 수 불일치:");
  for (const item of historicalCountAnomalies) {
    console.log(`- ${item.checkpoint}: 표기 ${item.claimedReviewed}, 고유 ${item.uniqueReviewedAtCheckpoint} (${item.difference >= 0 ? "+" : ""}${item.difference})`);
  }
}
if (errors.length > 0) {
  console.error("오류:");
  for (const error of errors) console.error(`- ${error}`);
}

if (strict && errors.length > 0) process.exitCode = 1;
