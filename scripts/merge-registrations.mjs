#!/usr/bin/env node
/**
 * Registration module merger.
 *
 * 여러 작업자가 knowledge-graph.ts · article-learning.ts · article-evidence.ts ·
 * editorial-ownership.ts · article-topology-decisions.ts · category catalog를 동시에
 * 편집하면 read-modify-write 경쟁으로 서로의 변경을 지운다. 그래서 각 글은
 * `src/content/registrations/<slug>.ts` 하나에 자기 등록 데이터를 쓰고, 이 스크립트가
 * 잠금 아래에서 정본 파일에 upsert한다. 같은 모듈을 여러 번 병합해도 결과는 같다.
 *
 * 사용법:
 *   node scripts/merge-registrations.mjs src/content/registrations/<slug>.ts [...more]
 *   node scripts/merge-registrations.mjs --all          # registrations/ 전체
 *   node scripts/merge-registrations.mjs --dry-run <module>
 *
 * 모듈이 export할 수 있는 이름 (모두 선택):
 *   CONCEPTS         Record<id, KnowledgeConcept>        → KNOWLEDGE_CONCEPTS (id로 upsert)
 *   EDGES            KnowledgeEdge[]                     → KNOWLEDGE_EDGES ((from,to,relation)로 upsert)
 *   LEARNING         Record<route, ArticleLearningContract> → ARTICLE_LEARNING (route 전체 교체)
 *   LEARNING_PATCH   Record<route, Partial<contract>>    → 기존 route에 병합
 *                      introducedHere/assumedKnowledge/conceptExplanations: id로 upsert
 *                      papers: title로 upsert · conceptStages/exercises: 배열 전체 교체
 *                      coreIdea/entryNote/entryLevel: 값 교체
 *   EVIDENCE         Record<route, ArticleEvidenceItem[]> → ARTICLE_EVIDENCE (route 전체 교체)
 *   EVIDENCE_PATCH   Record<route, ArticleEvidenceItem[]> → 기존 배열에 label로 upsert
 *   OWNERSHIP        Record<slug, EditorialBoundary>     → EDITORIAL_BOUNDARIES (slug 전체 교체)
 *   OWNERSHIP_PATCH  Record<slug, { owns?, reuses?, evidence? }> → 문자열/href/rule 기준 append-if-missing
 *   TOPOLOGY         Record<route, ArticleTopologyDecision> → ARTICLE_TOPOLOGY_DECISIONS (route upsert)
 *   CATALOG          { file, after?, entry }             → 해당 catalog 배열에 slug로 upsert
 *   LEDGER           CoverageLedgerRow[]                 → docs/concept-coverage-ledger.json (batch+sourceIndex+term upsert)
 */
import fs from "node:fs";
import path from "node:path";
import ts from "typescript";

const ROOT = process.cwd();
const LOCK_DIR = path.join(ROOT, ".merge-registrations.lock");
const REGISTRATION_DIR = path.join(ROOT, "src", "content", "registrations");
const LEDGER_PATH = path.join(ROOT, "docs", "concept-coverage-ledger.json");

const TARGETS = {
  CONCEPTS: { file: "src/content/knowledge-graph.ts", name: "KNOWLEDGE_CONCEPTS" },
  EDGES: { file: "src/content/knowledge-graph.ts", name: "KNOWLEDGE_EDGES" },
  LEARNING: { file: "src/content/article-learning.ts", name: "ARTICLE_LEARNING" },
  LEARNING_PATCH: { file: "src/content/article-learning.ts", name: "ARTICLE_LEARNING" },
  EVIDENCE: { file: "src/content/article-evidence.ts", name: "ARTICLE_EVIDENCE" },
  EVIDENCE_PATCH: { file: "src/content/article-evidence.ts", name: "ARTICLE_EVIDENCE" },
  OWNERSHIP: { file: "src/content/editorial-ownership.ts", name: "EDITORIAL_BOUNDARIES" },
  OWNERSHIP_PATCH: { file: "src/content/editorial-ownership.ts", name: "EDITORIAL_BOUNDARIES" },
  TOPOLOGY: { file: "src/content/article-topology-decisions.ts", name: "ARTICLE_TOPOLOGY_DECISIONS" },
};

const args = process.argv.slice(2);
const dryRun = args.includes("--dry-run");
const all = args.includes("--all");
const moduleArgs = args.filter((arg) => !arg.startsWith("--"));

function parse(file, text = fs.readFileSync(file, "utf8")) {
  return ts.createSourceFile(file, text, ts.ScriptTarget.Latest, true, ts.ScriptKind.TS);
}

function exportedInitializers(sf, { includeUnexported = false } = {}) {
  const out = new Map();
  for (const statement of sf.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    const exported = statement.modifiers?.some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
    if (!exported && !includeUnexported) continue;
    for (const decl of statement.declarationList.declarations) {
      if (ts.isIdentifier(decl.name) && decl.initializer) {
        out.set(decl.name.text, unwrap(decl.initializer));
      }
    }
  }
  return out;
}

/** `{...} as const satisfies X` 같은 감싸기를 벗겨 실제 literal node를 돌려준다. */
function unwrap(node) {
  while (
    ts.isAsExpression(node) ||
    ts.isSatisfiesExpression?.(node) ||
    ts.isParenthesizedExpression(node) ||
    ts.isTypeAssertionExpression(node)
  ) {
    node = node.expression;
  }
  return node;
}

function propertyKey(prop) {
  if (!ts.isPropertyAssignment(prop) && !ts.isShorthandPropertyAssignment(prop)) return undefined;
  const name = prop.name;
  if (ts.isStringLiteral(name) || ts.isNoSubstitutionTemplateLiteral(name)) return name.text;
  if (ts.isIdentifier(name)) return name.text;
  if (ts.isNumericLiteral(name)) return name.text;
  return undefined;
}

function objectProps(obj) {
  const map = new Map();
  for (const prop of obj.properties) {
    const key = propertyKey(prop);
    if (key !== undefined) map.set(key, prop);
  }
  return map;
}

function literalValue(node) {
  node = unwrap(node);
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  if (ts.isArrayLiteralExpression(node)) return node.elements.map(literalValue);
  if (ts.isObjectLiteralExpression(node)) {
    const out = {};
    for (const [key, prop] of objectProps(node)) {
      if (ts.isPropertyAssignment(prop)) out[key] = literalValue(prop.initializer);
    }
    return out;
  }
  return node.getText();
}

function dedent(text) {
  const lines = text.split("\n");
  const indents = lines
    .slice(1)
    .filter((line) => line.trim())
    .map((line) => line.match(/^\s*/)[0].length);
  const min = indents.length ? Math.min(...indents) : 0;
  return lines.map((line, index) => (index === 0 ? line : line.slice(Math.min(min, line.match(/^\s*/)[0].length)))).join("\n");
}

function reindent(text, indent) {
  const pad = " ".repeat(indent);
  return dedent(text)
    .split("\n")
    .map((line, index) => (index === 0 ? line : line.trim() ? pad + line : line))
    .join("\n");
}

/** 정본 파일에 그대로 복사되므로 값은 순수 literal 이어야 한다. 식별자·template literal·호출식은 거부한다. */
function assertPureLiteral(node, where, allowFunction = false) {
  node = unwrap(node);
  if (
    ts.isStringLiteral(node) ||
    ts.isNoSubstitutionTemplateLiteral(node) ||
    ts.isNumericLiteral(node) ||
    node.kind === ts.SyntaxKind.TrueKeyword ||
    node.kind === ts.SyntaxKind.FalseKeyword ||
    node.kind === ts.SyntaxKind.NullKeyword
  )
    return;
  if (ts.isPrefixUnaryExpression(node) && ts.isNumericLiteral(node.operand)) return;
  if (ts.isArrayLiteralExpression(node)) {
    node.elements.forEach((el, i) => assertPureLiteral(el, `${where}[${i}]`, allowFunction));
    return;
  }
  if (ts.isObjectLiteralExpression(node)) {
    for (const prop of node.properties) {
      const key = propertyKey(prop);
      if (!ts.isPropertyAssignment(prop)) throw new Error(`${where}.${key ?? "?"}: shorthand/spread 는 지원하지 않습니다.`);
      assertPureLiteral(prop.initializer, `${where}.${key}`, allowFunction || key === "component");
    }
    return;
  }
  if (allowFunction && ts.isArrowFunction(node)) return;
  throw new Error(
    `${where}: 순수 literal 이 아닙니다 (${ts.SyntaxKind[node.kind]}: ${node.getText().slice(0, 60)}). ` +
      "template literal(${...})·변수·함수 호출은 정본 파일에서 깨지므로 문자열 literal 로 바꾸세요.",
  );
}

function nodeText(node, sf) {
  return sf.text.slice(node.getStart(sf), node.end);
}

class Editor {
  constructor(file) {
    this.file = path.join(ROOT, file);
    this.text = fs.readFileSync(this.file, "utf8");
    this.dirty = false;
  }
  sf() {
    return parse(this.file, this.text);
  }
  exportInit(name) {
    const init = exportedInitializers(this.sf()).get(name);
    if (!init) throw new Error(`${this.file}: export ${name} 를 찾지 못했습니다.`);
    return init;
  }
  replaceRange(start, end, replacement) {
    this.text = this.text.slice(0, start) + replacement + this.text.slice(end);
    this.dirty = true;
  }
  /** object literal에 key 항목을 upsert. text는 초기값 literal 텍스트. */
  upsertObjectEntry(exportName, key, valueText, { indent = 2, keyQuote = true, after } = {}) {
    const obj = this.exportInit(exportName);
    if (!ts.isObjectLiteralExpression(obj)) throw new Error(`${exportName} 는 object literal이 아닙니다.`);
    const sf = this.sf();
    const keyText = keyQuote ? JSON.stringify(key) : key;
    const entry = `${" ".repeat(indent)}${keyText}: ${reindent(valueText, indent)},`;
    const existing = objectProps(obj).get(key);
    if (existing) {
      // 항목 전체(줄 시작부터 뒤 쉼표까지)를 교체하되, 같은 줄 앞에 다른 코드(예: 한 줄짜리
      // 컨테이너의 여는 괄호나 이전 형제 항목)가 있으면 줄 시작까지 삼키지 않는다 — 그러면
      // 그 앞 코드까지 지워버려 구조가 깨진다(단일 원소 한 줄 배열/객체에서 실제로 발생했던 사고).
      const start = safeReplaceStart(this.text, existing.getStart(sf));
      let end = existing.end;
      if (this.text[end] === ",") end += 1;
      this.replaceRange(start, end, entry);
      return "replaced";
    }
    const afterProp = after ? objectProps(obj).get(after) : undefined;
    if (afterProp) {
      let end = afterProp.end;
      if (this.text[end] === ",") end += 1;
      this.replaceRange(end, end, `\n${entry}`);
      return "inserted";
    }
    const closeBrace = obj.end - 1; // '}'
    const before = this.text.slice(0, closeBrace);
    const trimmed = before.replace(/\s+$/, "");
    const needsComma = !/[{,]$/.test(trimmed);
    this.replaceRange(trimmed.length, closeBrace, `${needsComma ? "," : ""}\n${entry}\n`);
    return "appended";
  }
  /** 배열 literal에 element를 upsert. matcher(elementNode) → boolean */
  upsertArrayElement(arrayNode, valueText, matcher, { indent = 2, afterMatcher } = {}) {
    const sf = this.sf();
    const entry = `${" ".repeat(indent)}${reindent(valueText, indent)},`;
    const existing = arrayNode.elements.find((el) => matcher(el));
    if (existing) {
      const start = safeReplaceStart(this.text, existing.getStart(sf));
      let end = existing.end;
      if (this.text[end] === ",") end += 1;
      this.replaceRange(start, end, entry);
      return "replaced";
    }
    const afterEl = afterMatcher ? arrayNode.elements.find((el) => afterMatcher(el)) : undefined;
    if (afterEl) {
      let end = afterEl.end;
      if (this.text[end] === ",") end += 1;
      this.replaceRange(end, end, `\n${entry}`);
      return "inserted";
    }
    const closeBracket = arrayNode.end - 1;
    const before = this.text.slice(0, closeBracket);
    const trimmed = before.replace(/\s+$/, "");
    const needsComma = !/[\[,]$/.test(trimmed);
    this.replaceRange(trimmed.length, closeBracket, `${needsComma ? "," : ""}\n${entry}\n`);
    return "appended";
  }
  save() {
    if (this.dirty && !dryRun) fs.writeFileSync(this.file, this.text);
  }
}

function lineStart(text, position) {
  const index = text.lastIndexOf("\n", position - 1);
  return index === -1 ? 0 : index + 1;
}

/**
 * "항목 전체(줄 시작부터)를 교체" 최적화는 그 항목이 자기 줄을 혼자 쓸 때만 안전하다.
 * 한 줄짜리 컨테이너(`introducedHere: [{ id: "x" }],`처럼 key·여는 괄호·원소가 같은 줄)에서는
 * lineStart 가 그 key·괄호까지 삼켜 구조를 깨뜨린다. lineStart 부터 실제 원소 시작 사이에
 * 공백이 아닌 문자가 있으면(=같은 줄에 이미 다른 코드가 있으면) 줄 시작으로 확장하지 않고
 * 원소 자신의 시작 위치만 쓴다 — 들여쓰기 재포맷을 조금 포기하는 대신 구조 손상을 막는다.
 */
function safeReplaceStart(text, elementStart) {
  const candidate = lineStart(text, elementStart);
  const between = text.slice(candidate, elementStart);
  return between.trim() === "" ? candidate : elementStart;
}

function propValue(objNode, key) {
  objNode = unwrap(objNode);
  // `...hwArticles` 같은 spread element 는 object literal 이 아니므로 slug 비교 대상에서 제외한다.
  if (!ts.isObjectLiteralExpression(objNode)) return undefined;
  const prop = objectProps(objNode).get(key);
  if (!prop || !ts.isPropertyAssignment(prop)) return undefined;
  return literalValue(prop.initializer);
}

const editors = new Map();
function editor(file) {
  if (!editors.has(file)) editors.set(file, new Editor(file));
  return editors.get(file);
}

const summary = [];
function log(module, message) {
  summary.push(`${path.basename(module)}: ${message}`);
}

function mergeConcepts(module, obj) {
  const ed = editor(TARGETS.CONCEPTS.file);
  const sf = parse(module.file, module.text);
  for (const [id, prop] of objectProps(obj)) {
    const result = ed.upsertObjectEntry("KNOWLEDGE_CONCEPTS", id, nodeText(prop.initializer, sf));
    log(module.file, `concept ${id} ${result}`);
  }
}

function edgeKey(el) {
  return `${propValue(el, "from")}→${propValue(el, "to")}:${propValue(el, "relation")}`;
}

function mergeEdges(module, arr) {
  const ed = editor(TARGETS.EDGES.file);
  const sf = parse(module.file, module.text);
  for (const el of arr.elements) {
    const key = edgeKey(el);
    const target = ed.exportInit("KNOWLEDGE_EDGES");
    const result = ed.upsertArrayElement(target, nodeText(el, sf), (node) => edgeKey(node) === key);
    log(module.file, `edge ${key} ${result}`);
  }
}

function mergeWholeEntries(module, obj, target, exportName, label) {
  const ed = editor(target.file);
  const sf = parse(module.file, module.text);
  for (const [key, prop] of objectProps(obj)) {
    const result = ed.upsertObjectEntry(exportName, key, nodeText(prop.initializer, sf));
    log(module.file, `${label} ${key} ${result}`);
  }
}

const LEARNING_ARRAY_KEYS = {
  introducedHere: "id",
  assumedKnowledge: "id",
  conceptExplanations: "id",
  papers: "title",
};
const LEARNING_REPLACE_KEYS = new Set(["conceptStages", "exercises"]);

function mergeLearningPatch(module, obj) {
  const ed = editor(TARGETS.LEARNING_PATCH.file);
  const sf = parse(module.file, module.text);
  for (const [route, routeProp] of objectProps(obj)) {
    if (!ts.isPropertyAssignment(routeProp) || !ts.isObjectLiteralExpression(unwrap(routeProp.initializer))) continue;
    const patch = unwrap(routeProp.initializer);
    for (const [field, fieldProp] of objectProps(patch)) {
      if (!ts.isPropertyAssignment(fieldProp)) continue;
      const contract = objectProps(ed.exportInit("ARTICLE_LEARNING")).get(route);
      if (!contract) throw new Error(`LEARNING_PATCH: ${route} 가 ARTICLE_LEARNING에 없습니다.`);
      const contractObj = unwrap(contract.initializer);
      const targetProp = objectProps(contractObj).get(field);
      const valueText = nodeText(fieldProp.initializer, sf);
      const arrayKey = LEARNING_ARRAY_KEYS[field];
      if (arrayKey && targetProp && ts.isArrayLiteralExpression(unwrap(targetProp.initializer))) {
        const elements = unwrap(fieldProp.initializer).elements;
        for (const el of elements) {
          const key = propValue(el, arrayKey);
          const current = objectProps(unwrap(objectProps(ed.exportInit("ARTICLE_LEARNING")).get(route).initializer)).get(field);
          const arr = unwrap(current.initializer);
          const result = ed.upsertArrayElement(arr, nodeText(el, sf), (node) => propValue(node, arrayKey) === key, { indent: 6 });
          log(module.file, `learning ${route}.${field}[${key}] ${result}`);
        }
        continue;
      }
      if (targetProp && !LEARNING_REPLACE_KEYS.has(field) && !arrayKey && ts.isArrayLiteralExpression(unwrap(targetProp.initializer))) {
        throw new Error(`LEARNING_PATCH: ${route}.${field} 는 지원하지 않는 배열 필드입니다.`);
      }
      const targetSf = ed.sf();
      if (targetProp) {
        const start = lineStart(ed.text, targetProp.getStart(targetSf));
        let end = targetProp.end;
        if (ed.text[end] === ",") end += 1;
        ed.replaceRange(start, end, `    ${field}: ${reindent(valueText, 4)},`);
        log(module.file, `learning ${route}.${field} replaced`);
      } else {
        const closeBrace = contractObj.end - 1;
        const trimmed = ed.text.slice(0, closeBrace).replace(/\s+$/, "");
        const needsComma = !/[{,]$/.test(trimmed);
        ed.replaceRange(trimmed.length, closeBrace, `${needsComma ? "," : ""}\n    ${field}: ${reindent(valueText, 4)},\n  `);
        log(module.file, `learning ${route}.${field} added`);
      }
    }
  }
}

function mergeEvidencePatch(module, obj) {
  const ed = editor(TARGETS.EVIDENCE_PATCH.file);
  const sf = parse(module.file, module.text);
  for (const [route, routeProp] of objectProps(obj)) {
    const items = unwrap(routeProp.initializer);
    if (!ts.isArrayLiteralExpression(items)) continue;
    for (const el of items.elements) {
      const label = propValue(el, "label");
      const entry = objectProps(ed.exportInit("ARTICLE_EVIDENCE")).get(route);
      if (!entry) throw new Error(`EVIDENCE_PATCH: ${route} 가 ARTICLE_EVIDENCE에 없습니다.`);
      const arr = unwrap(entry.initializer);
      const result = ed.upsertArrayElement(arr, nodeText(el, sf), (node) => propValue(node, "label") === label, { indent: 4 });
      log(module.file, `evidence ${route}[${label}] ${result}`);
    }
  }
}

function mergeOwnershipPatch(module, obj) {
  const ed = editor(TARGETS.OWNERSHIP_PATCH.file);
  const sf = parse(module.file, module.text);
  const keys = { owns: (node) => literalValue(node), reuses: (node) => propValue(node, "href"), evidence: (node) => propValue(node, "rule") };
  for (const [slug, slugProp] of objectProps(obj)) {
    const patch = unwrap(slugProp.initializer);
    for (const [field, fieldProp] of objectProps(patch)) {
      const keyOf = keys[field];
      if (!keyOf) throw new Error(`OWNERSHIP_PATCH: ${slug}.${field} 는 지원하지 않습니다.`);
      for (const el of unwrap(fieldProp.initializer).elements) {
        const key = keyOf(el);
        const entry = objectProps(ed.exportInit("EDITORIAL_BOUNDARIES")).get(slug);
        if (!entry) throw new Error(`OWNERSHIP_PATCH: ${slug} 가 EDITORIAL_BOUNDARIES에 없습니다.`);
        const arrProp = objectProps(unwrap(entry.initializer)).get(field);
        const arr = unwrap(arrProp.initializer);
        const result = ed.upsertArrayElement(arr, nodeText(el, sf), (node) => keyOf(node) === key, { indent: 6 });
        log(module.file, `ownership ${slug}.${field}[${String(key).slice(0, 40)}] ${result}`);
      }
    }
  }
}

function mergeCatalog(module, obj) {
  const sf = parse(module.file, module.text);
  const file = propValue(obj, "file");
  const after = propValue(obj, "after");
  const entryProp = objectProps(obj).get("entry");
  if (!file || !entryProp) throw new Error("CATALOG 는 file 과 entry 가 필요합니다.");
  const entryNode = unwrap(entryProp.initializer);
  const slug = propValue(entryNode, "slug");
  const ed = editor(file);
  const exports = exportedInitializers(ed.sf());
  let arrayName;
  let arrayNode;
  for (const [name, init] of exports) {
    if (ts.isArrayLiteralExpression(init)) {
      arrayName = name;
      arrayNode = init;
      break;
    }
  }
  if (!arrayNode) {
    // category index (gpu/index.ts 처럼 `const gpu: Category = { articles: [ ... ] }; export default gpu;` 인 경우 —
    // export default 로 내보내는 정의는 exported variable statement 가 아니므로 미수출 top-level const 도 본다)
    for (const [name, init] of exportedInitializers(ed.sf(), { includeUnexported: true })) {
      if (ts.isObjectLiteralExpression(init)) {
        const articles = objectProps(init).get("articles");
        if (articles && ts.isArrayLiteralExpression(unwrap(articles.initializer))) {
          arrayName = `${name}.articles`;
          arrayNode = unwrap(articles.initializer);
          break;
        }
      }
    }
  }
  if (!arrayNode) throw new Error(`${file}: Article 배열을 찾지 못했습니다.`);
  const indent = arrayName.includes(".") ? 4 : 2;
  const result = ed.upsertArrayElement(
    arrayNode,
    nodeText(entryNode, sf),
    (node) => propValue(node, "slug") === slug,
    { indent, afterMatcher: after ? (node) => propValue(node, "slug") === after : undefined },
  );
  log(module.file, `catalog ${file} ${slug} ${result}`);
}

function mergeLedger(module, arr) {
  const rows = literalValue(arr);
  const ledger = fs.existsSync(LEDGER_PATH) ? JSON.parse(fs.readFileSync(LEDGER_PATH, "utf8")) : { rows: [] };
  const rowKey = (row) => `${row.batch ?? "1560"}::${row.sourceIndex ?? ""}::${row.term}`;
  const index = new Map(ledger.rows.map((row, i) => [rowKey(row), i]));
  let updated = 0;
  let added = 0;
  for (const row of rows) {
    const key = rowKey(row);
    const existing = index.get(key);
    const merged = { ...(existing !== undefined ? ledger.rows[existing] : { batch: row.batch ?? "1560" }), ...row, updatedAt: new Date().toISOString().slice(0, 10) };
    if (existing !== undefined) {
      ledger.rows[existing] = merged;
      updated += 1;
    } else {
      ledger.rows.push(merged);
      index.set(key, ledger.rows.length - 1);
      added += 1;
    }
  }
  if (!dryRun) fs.writeFileSync(LEDGER_PATH, JSON.stringify(ledger, null, 1) + "\n");
  log(module.file, `ledger ${updated} updated · ${added} added`);
}

function mergeModule(file) {
  const text = fs.readFileSync(file, "utf8");
  const module = { file, text };
  const exports = exportedInitializers(parse(file, text));
  if (exports.size === 0) throw new Error(`${file}: export된 등록 데이터가 없습니다.`);
  const order = [
    "CONCEPTS",
    "EDGES",
    "LEARNING",
    "LEARNING_PATCH",
    "EVIDENCE",
    "EVIDENCE_PATCH",
    "OWNERSHIP",
    "OWNERSHIP_PATCH",
    "TOPOLOGY",
    "CATALOG",
    "LEDGER",
  ];
  for (const name of order) {
    const node = exports.get(name);
    if (!node) continue;
    assertPureLiteral(node, `${path.basename(file)}:${name}`, name === "CATALOG");
    switch (name) {
      case "CONCEPTS":
        mergeConcepts(module, node);
        break;
      case "EDGES":
        mergeEdges(module, node);
        break;
      case "LEARNING":
        mergeWholeEntries(module, node, TARGETS.LEARNING, "ARTICLE_LEARNING", "learning");
        break;
      case "LEARNING_PATCH":
        mergeLearningPatch(module, node);
        break;
      case "EVIDENCE":
        mergeWholeEntries(module, node, TARGETS.EVIDENCE, "ARTICLE_EVIDENCE", "evidence");
        break;
      case "EVIDENCE_PATCH":
        mergeEvidencePatch(module, node);
        break;
      case "OWNERSHIP":
        mergeWholeEntries(module, node, TARGETS.OWNERSHIP, "EDITORIAL_BOUNDARIES", "ownership");
        break;
      case "OWNERSHIP_PATCH":
        mergeOwnershipPatch(module, node);
        break;
      case "TOPOLOGY":
        mergeWholeEntries(module, node, TARGETS.TOPOLOGY, "ARTICLE_TOPOLOGY_DECISIONS", "topology");
        break;
      case "CATALOG":
        mergeCatalog(module, node);
        break;
      case "LEDGER":
        mergeLedger(module, node);
        break;
      default:
        break;
    }
  }
  for (const name of exports.keys()) {
    if (!order.includes(name)) log(file, `경고: 알 수 없는 export ${name} 은 무시했습니다.`);
  }
}

async function withLock(fn) {
  const deadline = Date.now() + 120_000;
  for (;;) {
    try {
      fs.mkdirSync(LOCK_DIR);
      break;
    } catch (error) {
      if (error.code !== "EEXIST") throw error;
      if (Date.now() > deadline) throw new Error("merge lock 대기 시간이 초과됐습니다: " + LOCK_DIR);
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
  }
  try {
    return await fn();
  } finally {
    fs.rmSync(LOCK_DIR, { recursive: true, force: true });
  }
}

const modules = all
  ? fs.existsSync(REGISTRATION_DIR)
    ? fs
        .readdirSync(REGISTRATION_DIR)
        .filter((name) => name.endsWith(".ts") && !name.endsWith(".d.ts"))
        .map((name) => path.join(REGISTRATION_DIR, name))
    : []
  : moduleArgs.map((arg) => path.resolve(ROOT, arg));

if (modules.length === 0) {
  console.error("병합할 registration module이 없습니다.");
  process.exit(1);
}

await withLock(async () => {
  for (const file of modules) {
    if (!fs.existsSync(file)) throw new Error(`module이 없습니다: ${file}`);
    mergeModule(file);
  }
  for (const ed of editors.values()) ed.save();
});

console.log(summary.join("\n"));
console.log(dryRun ? "(dry-run: 파일을 쓰지 않았습니다)" : `병합 완료: ${modules.length}개 module`);
