#!/usr/bin/env node
/**
 * Registration module 을 정본에서 다시 만든다.
 *
 * `src/content/registrations/*.ts` 는 git 에 들어가지 않는 작업용 사본이라, 정본(article-learning.ts 등)을
 * 직접 고친 뒤에는 사본이 낡는다. 낡은 사본을 `merge-registrations.mjs` 가 병합하면 정본의 최신 내용이
 * 되돌아간다(2026-10-09 측정: 전체 병합 시 26,000줄 되돌림). 이 스크립트는 모듈이 가리키는 key 만 유지하고
 * 값은 정본의 소스 텍스트로 바꾼다. 실행 뒤 `merge-registrations.mjs --all` 이 정본을 바꾸지 않아야 한다.
 *
 * 사용법: node scripts/sync-registrations-from-canonical.mjs [--dry-run] [module.ts ...]
 */
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const ROOT = process.cwd();
const REG = path.join(ROOT, "src/content/registrations");
const dryRun = process.argv.includes("--dry-run");
const files = process.argv.slice(2).filter((a) => !a.startsWith("--"));
const modules = files.length ? files : fs.readdirSync(REG).filter((f) => f.endsWith(".ts")).map((f) => path.join(REG, f));

const parse = (file, text) => ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
const unwrap = (n) => {
  while (n && (ts.isAsExpression(n) || ts.isSatisfiesExpression?.(n) || ts.isParenthesizedExpression(n) || ts.isTypeAssertionExpression?.(n))) n = n.expression;
  return n;
};
const keyOf = (p) => (p.name && (ts.isStringLiteral(p.name) || ts.isIdentifier(p.name) || ts.isNoSubstitutionTemplateLiteral(p.name)) ? p.name.text : undefined);
function exportsOf(sf, includeUnexported = false) {
  const out = new Map();
  for (const st of sf.statements) {
    if (!ts.isVariableStatement(st)) continue;
    const exported = st.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
    if (!exported && !includeUnexported) continue;
    for (const d of st.declarationList.declarations) if (d.initializer) out.set(d.name.getText(sf), { decl: d, init: unwrap(d.initializer) });
  }
  return out;
}
// merge-registrations.mjs 의 assertPureLiteral 과 같은 기준이다. 이 기준을 넘지 못하는 정본 항목은
// 평가한 값을 JSON 으로 옮기지 않고 모듈에서 뺀다(정본의 함수 호출·상수 참조 형태를 지키기 위해).
function isPure(node, allowFunction = false) {
  node = unwrap(node);
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node) || ts.isNumericLiteral(node)) return true;
  if ([ts.SyntaxKind.TrueKeyword, ts.SyntaxKind.FalseKeyword, ts.SyntaxKind.NullKeyword].includes(node.kind)) return true;
  if (ts.isPrefixUnaryExpression(node) && ts.isNumericLiteral(node.operand)) return true;
  if (ts.isArrayLiteralExpression(node)) return node.elements.every((el) => isPure(el, allowFunction));
  if (ts.isObjectLiteralExpression(node))
    return node.properties.every((p) => ts.isPropertyAssignment(p) && isPure(p.initializer, allowFunction || keyOf(p) === "component"));
  return allowFunction && ts.isArrowFunction(node);
}
// merge 는 값 텍스트를 dedent 한 뒤 정본 column 만큼 다시 들여쓴다. 정본 텍스트를 그대로 넘기면 줄 하나가
// column 0 에 있을 때(이전 병합이 남긴 들여쓰기) 나머지 줄이 모두 밀린다. 그래서 둘째 줄부터 정본 column 만큼
// 미리 빼 둔다. 그러면 병합 결과가 정본 텍스트와 같아진다.
function shiftLeft(text, n) {
  return text
    .split("\n")
    .map((line, i) => (i === 0 ? line : line.replace(new RegExp(`^ {0,${n}}`), "")))
    .join("\n");
}
const columnOf = (node, sf) => node.getStart(sf) - sf.text.lastIndexOf("\n", node.getStart(sf) - 1) - 1;
const impure = new Set();
function objectMap(obj, sf, valuesOf) {
  const m = new Map();
  for (const p of obj.properties) {
    if (!ts.isPropertyAssignment(p) || keyOf(p) === undefined) continue;
    const k = keyOf(p);
    if (!valuesOf || isPure(p.initializer)) m.set(k, valuesOf ? shiftLeft(p.initializer.getText(sf), columnOf(p, sf)) : p.initializer.getText(sf));
    else impure.add(k);
  }
  return m;
}
const strProp = (node, name) => {
  node = unwrap(node);
  if (!node || !ts.isObjectLiteralExpression(node)) return undefined;
  for (const p of node.properties) if (ts.isPropertyAssignment(p) && keyOf(p) === name) {
    const v = unwrap(p.initializer);
    if (ts.isStringLiteralLike(v)) return v.text;
  }
  return undefined;
};

/* 정본 소스 텍스트 색인 */
function canonObject(rel, name) {
  const file = path.join(ROOT, rel);
  const sf = parse(file, fs.readFileSync(file, "utf8"));
  const e = exportsOf(sf, true).get(name);
  if (!e || !ts.isObjectLiteralExpression(e.init)) throw new Error(`${rel}:${name} 객체를 찾지 못했습니다`);
  return objectMap(e.init, sf, true);
}
const CANON = {
  LEARNING: canonObject("src/content/article-learning.ts", "ARTICLE_LEARNING"),
  EVIDENCE: canonObject("src/content/article-evidence.ts", "ARTICLE_EVIDENCE"),
  OWNERSHIP: canonObject("src/content/editorial-ownership.ts", "EDITORIAL_BOUNDARIES"),
  TOPOLOGY: canonObject("src/content/article-topology-decisions.ts", "ARTICLE_TOPOLOGY_DECISIONS"),
  CONCEPTS: canonObject("src/content/knowledge-graph.ts", "KNOWLEDGE_CONCEPTS"),
};
const edgeIndex = (() => {
  const file = path.join(ROOT, "src/content/knowledge-graph.ts");
  const sf = parse(file, fs.readFileSync(file, "utf8"));
  const arr = exportsOf(sf).get("KNOWLEDGE_EDGES").init;
  const m = new Map();
  for (const el of arr.elements) m.set(`${strProp(el, "from")}|${strProp(el, "to")}|${strProp(el, "relation")}`, shiftLeft(el.getText(sf), columnOf(el, sf)));
  return m;
})();
const ledger = JSON.parse(fs.readFileSync(path.join(ROOT, "docs/concept-coverage-ledger.json"), "utf8"));
const ledgerKey = (r) => (r.sourceIndex !== undefined && r.sourceIndex !== null ? `sourceIndex::${r.sourceIndex}::${r.term}` : `term::${r.term}`);
const ledgerIndex = new Map(ledger.rows.map((r) => [ledgerKey(r), r]));
const catalogCache = new Map();
function catalogEntryText(file, slug) {
  if (!catalogCache.has(file)) {
    const abs = path.join(ROOT, file);
    catalogCache.set(file, fs.existsSync(abs) ? parse(abs, fs.readFileSync(abs, "utf8")) : null);
  }
  const sf = catalogCache.get(file);
  if (!sf) return undefined;
  let found;
  const visit = (n) => {
    if (found) return;
    if (ts.isArrayLiteralExpression(n)) for (const el of n.elements) if (strProp(el, "slug") === slug) { found = shiftLeft(el.getText(sf), columnOf(el, sf)); return; }
    ts.forEachChild(n, visit);
  };
  visit(sf);
  return found;
}

const PATCH_TO_WHOLE = { LEARNING_PATCH: "LEARNING", EVIDENCE_PATCH: "EVIDENCE", OWNERSHIP_PATCH: "OWNERSHIP" };
const objText = (entries) => (entries.length ? `{\n${entries.map(([k, v]) => `  ${JSON.stringify(k)}: ${v}`).join(",\n")}\n}` : "{}");
let changed = 0;
const report = [];
for (const file of modules) {
  const text = fs.readFileSync(file, "utf8");
  const sf = parse(file, text);
  const exp = exportsOf(sf);
  const edits = []; // [start, end, replacement]
  const notes = [];
  for (const [name, { decl, init }] of exp) {
    const whole = PATCH_TO_WHOLE[name] ?? name;
    if (CANON[whole]) {
      if (!ts.isObjectLiteralExpression(init)) continue;
      const keys = [...objectMap(init, sf).keys()];
      const kept = keys.filter((k) => CANON[whole].has(k)).map((k) => [k, CANON[whole].get(k)]);
      const dropped = keys.filter((k) => !CANON[whole].has(k) && !impure.has(k));
      const skipped = keys.filter((k) => impure.has(k));
      if (dropped.length) notes.push(`${name}: 정본에 없는 key ${dropped.length}개 제거(${dropped.slice(0, 3).join(", ")})`);
      if (skipped.length) notes.push(`${name}: 정본이 literal 이 아닌 key ${skipped.length}개 제거(${skipped.slice(0, 3).join(", ")})`);
      // PATCH 는 정본 전체 값으로 바꾸므로 whole export 로 이름을 바꾼다.
      const nameNode = decl.name;
      if (whole !== name) edits.push([nameNode.getStart(sf), nameNode.getEnd(), whole]);
      edits.push([decl.initializer.getStart(sf), decl.initializer.getEnd(), objText(kept)]);
    } else if (name === "EDGES" && ts.isArrayLiteralExpression(init)) {
      const kept = [];
      for (const el of init.elements) {
        const t = edgeIndex.get(`${strProp(el, "from")}|${strProp(el, "to")}|${strProp(el, "relation")}`);
        if (t) kept.push(t);
      }
      if (kept.length !== init.elements.length) notes.push(`EDGES: 정본에 없는 edge ${init.elements.length - kept.length}개 제거`);
      edits.push([decl.initializer.getStart(sf), decl.initializer.getEnd(), kept.length ? `[\n  ${kept.join(",\n  ")}\n]` : "[]"]);
    } else if (name === "CATALOG" && ts.isObjectLiteralExpression(init)) {
      const catFile = strProp(init, "file");
      const entryProp = init.properties.find((p) => ts.isPropertyAssignment(p) && keyOf(p) === "entry");
      const slug = entryProp && strProp(entryProp.initializer, "slug");
      const t = catFile && slug ? catalogEntryText(catFile, slug) : undefined;
      if (t) edits.push([entryProp.initializer.getStart(sf), entryProp.initializer.getEnd(), t]);
      else notes.push(`CATALOG: ${catFile} 에서 ${slug} 를 찾지 못해 그대로 둠`);
    } else if (name === "LEDGER" && ts.isArrayLiteralExpression(init)) {
      // 행 key 만 읽어 현재 ledger 행으로 바꾼다(updatedAt 은 병합 때 다시 찍히므로 뺀다).
      let rows;
      try { rows = new Function(`return (${init.getText(sf)})`)(); } catch { notes.push("LEDGER: 리터럴 평가 실패, 그대로 둠"); continue; }
      const kept = rows.map((r) => ledgerIndex.get(ledgerKey(r))).filter(Boolean).map(({ updatedAt, ...rest }) => rest);
      edits.push([decl.initializer.getStart(sf), decl.initializer.getEnd(), JSON.stringify(kept, null, 2)]);
    }
  }
  let out = text;
  for (const [s, e, r] of edits.sort((a, b) => b[0] - a[0])) out = out.slice(0, s) + r + out.slice(e);
  if (out !== text) {
    changed++;
    if (!dryRun) fs.writeFileSync(file, out);
  }
  if (notes.length) report.push(`${path.basename(file)}: ${notes.join(" / ")}`);
}
console.log(report.join("\n"));
console.log(`${dryRun ? "(dry-run) " : ""}다시 쓴 module ${changed}/${modules.length}`);
