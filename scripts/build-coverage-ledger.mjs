#!/usr/bin/env node
/**
 * docs/concept-coverage-input.json (세션에서 받은 개념 목록 + 초기 대조 결과) 과
 * docs/concept-coverage-plan.json (글 단위 배정) 을 합쳐
 * docs/concept-coverage-ledger.json 을 만든다.
 *
 * 이미 ledger 에 있는 row 의 status 가 done/defer 이면 보존하고, planned 만 계획으로 갱신한다.
 * `--report` 는 배정 누락·중복과 글별 진행률을 출력한다.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const INPUT = path.join(ROOT, "docs", "concept-coverage-input.json");
const PLAN = path.join(ROOT, "docs", "concept-coverage-plan.json");
const LEDGER = path.join(ROOT, "docs", "concept-coverage-ledger.json");
const report = process.argv.includes("--report");

const input = JSON.parse(fs.readFileSync(INPUT, "utf8"));
const plan = JSON.parse(fs.readFileSync(PLAN, "utf8"));
const existing = fs.existsSync(LEDGER) ? JSON.parse(fs.readFileSync(LEDGER, "utf8")) : { rows: [] };
const rowKey = (row) => `${row.batch}::${row.sourceIndex ?? ""}::${row.term}`;
const existingByKey = new Map(existing.rows.map((row) => [rowKey(row), row]));

const byIndex = new Map();
const byName = new Map();
for (const term of input.terms) {
  if (term.batch === "1560") byIndex.set(String(term.n), term);
  else byName.set(`${term.batch}:${term.term}`, term);
}

function expand(spec) {
  if (/^\d+-\d+$/.test(spec)) {
    const [a, b] = spec.split("-").map(Number);
    return Array.from({ length: b - a + 1 }, (_, i) => String(a + i));
  }
  return [spec];
}

const assignment = new Map();
const duplicates = [];
for (const article of plan.articles) {
  for (const spec of article.terms) {
    for (const ref of expand(spec)) {
      const term = /^\d+$/.test(ref) ? byIndex.get(ref) : byName.get(ref);
      if (!term) {
        duplicates.push(`알 수 없는 term 참조: ${article.slug} → ${ref}`);
        continue;
      }
      const key = `${term.batch}::${term.n ?? ""}::${term.term}`;
      if (assignment.has(key) && assignment.get(key).slug !== article.slug) {
        duplicates.push(`중복 배정: ${key} → ${assignment.get(key).slug}, ${article.slug}`);
      }
      assignment.set(key, article);
    }
  }
}

const rows = [];
const unassigned = [];
for (const term of input.terms) {
  const key = `${term.batch}::${term.n ?? ""}::${term.term}`;
  const prior = existingByKey.get(key);
  const article = assignment.get(key);
  let row;
  if (prior && ["done", "defer", "existing", "alias"].includes(prior.status)) {
    row = prior;
  } else if (term.match !== "none") {
    row = {
      batch: term.batch,
      sourceIndex: term.n ?? null,
      term: term.term,
      status: "existing",
      action: "existing",
      conceptId: term.cids?.[0] ?? null,
      candidates: term.cids ?? [],
      owner: null,
      plannedArticle: article?.slug ?? null,
      reason: "지식 그래프에 같은 label/alias 의 canonical node 가 이미 있음",
    };
  } else if (article) {
    row = {
      batch: term.batch,
      sourceIndex: term.n ?? null,
      term: term.term,
      status: article.mode === "defer" ? "defer" : "planned",
      action: article.mode === "defer" ? "defer" : article.mode === "new" ? "new" : "enrich",
      conceptId: null,
      owner: null,
      plannedArticle: article.slug,
      plannedRoute: article.mode === "defer" ? null : `${article.category}/${article.slug}`,
      inProse: Boolean(term.in_prose),
      reason: article.mode === "defer" ? article.note ?? "관찰 원장 보존" : term.in_prose ? "본문 언급은 있으나 canonical node 없음" : "그래프·본문 모두 없음",
    };
  } else {
    unassigned.push(key);
    row = {
      batch: term.batch,
      sourceIndex: term.n ?? null,
      term: term.term,
      status: "unassigned",
      action: null,
      conceptId: null,
      owner: null,
      plannedArticle: null,
    };
  }
  rows.push(row);
}

const ledger = {
  $comment:
    "세션 입력 개념 목록의 처리 원장. status: existing(이미 node) · planned(배정됨) · done(글에 반영, conceptId·owner 확정) · alias(기존 node 에 별칭만) · defer(관찰 원장). 작업자는 registration module 의 LEDGER export 로 row 를 갱신한다.",
  generatedAt: new Date().toISOString().slice(0, 10),
  rows,
};
fs.writeFileSync(LEDGER, JSON.stringify(ledger, null, 1) + "\n");

const counts = {};
for (const row of rows) counts[row.status] = (counts[row.status] ?? 0) + 1;
console.log("ledger rows:", rows.length, counts);
if (duplicates.length) console.log("경고:\n- " + duplicates.join("\n- "));
if (unassigned.length) console.log(`배정되지 않은 term ${unassigned.length}개:\n- ` + unassigned.join("\n- "));

if (report) {
  const perArticle = new Map();
  for (const row of rows) {
    if (!row.plannedArticle) continue;
    const entry = perArticle.get(row.plannedArticle) ?? { total: 0, done: 0 };
    entry.total += 1;
    if (["done", "alias", "existing", "defer"].includes(row.status)) entry.done += 1;
    perArticle.set(row.plannedArticle, entry);
  }
  for (const article of plan.articles) {
    const entry = perArticle.get(article.slug) ?? { total: 0, done: 0 };
    console.log(`${article.mode.padEnd(6)} ${article.slug.padEnd(48)} ${entry.done}/${entry.total}`);
  }
}
