import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
import {
  collectArticleSourceClosure,
  loadPublicArticleCatalog,
} from "./lib/public-article-catalog.mjs";

const strict = process.argv.includes("--strict");
const routeFilter = process.argv
  .find((argument) => argument.startsWith("--route="))
  ?.slice("--route=".length);

// This CI guard adapts the deterministic subset of douinc/agent-skills'
// ko-natural skill (MIT): https://github.com/douinc/agent-skills/tree/main/skills/ko-natural
// teach-system runs the full skill. Context-sensitive warnings still need a
// person to read the sentence; only expressions with a safe, direct rewrite
// fail --strict here.
const rules = [
  {
    id: "T03",
    severity: "error",
    pattern: /(?:는 데|함에) 있어(?:서)?(?:는|의)?(?=[ ,])/gu,
    message: "‘~하는 데 있어’ 대신 ‘~할 때/하려면’처럼 바로 씁니다.",
  },
  {
    id: "T06",
    severity: "error",
    pattern: /(?:보여|되어|쓰여|불려|믿겨|잊혀|담겨|모아|읽혀|나뉘어|짜여|놓여|쌓여|열려|닫혀|잡혀|바뀌어)(?:지|진|져|집|짐)/gu,
    message: "이중 피동을 한 번의 피동이나 능동문으로 바꿉니다.",
  },
  {
    id: "T08",
    severity: "error",
    pattern: /것[을이] 가능하게|하는 것이 가능/gu,
    message: "‘~하는 것을 가능하게 한다’ 대신 실제 동작을 바로 씁니다.",
  },
  {
    id: "T09",
    severity: "error",
    pattern: /(?:의미|중요성|특징|장점|효과|가치)[를을] (?:가지|가진|가집|가져|갖)/gu,
    message: "‘~을 가진다’ 대신 ‘~이 있다’처럼 자연스럽게 씁니다.",
  },
  {
    id: "T12",
    severity: "error",
    pattern: /(?:검토|분석|개선|논의|테스트|개발|작업|확인|점검|조사|업데이트|배포|설치|수정|검증|평가)[를을] (?:진행|수행|실시)(?:하|해|한|할|합|했)/gu,
    message: "‘검토를 수행합니다’ 대신 ‘검토합니다’처럼 동사를 바로 씁니다.",
  },
  {
    id: "T13",
    severity: "error",
    pattern: /[을를] 필요로 (?:하|해|한|할|합|했)/gu,
    message: "‘~을 필요로 한다’ 대신 ‘~이 필요하다’로 씁니다.",
  },
  {
    id: "G02",
    severity: "error",
    pattern: /(?:중요한|핵심적인|결정적인|중추적인) 역할을 (?:하|해|한|할|합|했|담당)/gu,
    message: "막연한 ‘중요한 역할’ 대신 무엇을 어떻게 하는지 씁니다.",
  },
  {
    id: "E02",
    severity: "error",
    pattern: /수반(?:하|해|한|할|합|했|되|돼|된|될|됐|됩)/gu,
    message: "‘수반하다’ 대신 ‘따르다/함께 생기다’로 풉니다.",
  },
  {
    id: "E03",
    severity: "error",
    pattern: /기재(?:하|해|한|할|합|했|되|돼|된|될|됐|됩)/gu,
    message: "‘기재하다’ 대신 ‘쓰다/적다’로 풉니다.",
  },
  {
    id: "E04",
    severity: "error",
    pattern: /소요(?:되|돼|된|될|됐|됩|시간)/gu,
    message: "‘소요되다/소요 시간’ 대신 ‘걸리다/걸리는 시간’으로 풉니다.",
  },
  {
    id: "E05",
    severity: "error",
    pattern: /숙지(?:하|해|한|할|합|했)/gu,
    message: "‘숙지하다’ 대신 ‘잘 알아두다/미리 읽다’로 풉니다.",
  },
  {
    id: "E06",
    severity: "error",
    pattern: /취합(?:하|해|한|할|합|했|되|돼|된|될|됐|됩)/gu,
    message: "‘취합하다’ 대신 ‘모으다/합치다’로 풉니다.",
  },
  {
    id: "E07",
    severity: "error",
    pattern: /(?<![가-힣])(?:송부|회신 바랍니다)(?![가-힣])/gu,
    message: "‘송부/회신’ 대신 ‘보내다/답장하다’로 풉니다.",
  },
  {
    id: "E08",
    severity: "error",
    pattern: /필히|유관 부서|제반 /gu,
    message: "공문 표현을 ‘꼭/관련 부서/여러’처럼 익숙한 말로 풉니다.",
  },
  {
    id: "T05",
    severity: "review",
    pattern: /에 의(?:해서?|하여|한)(?=[\s,])/gu,
    message: "피동 번역투인지, 법령·수학의 정확한 표현인지 문맥에서 확인합니다.",
  },
  {
    id: "E01",
    severity: "review",
    pattern: /도출(?:하|해|한|할|합|했|되|돼|된|될|됐|됩)/gu,
    message: "일반 문장에서는 ‘얻다/찾다’로 풀고, 수학의 정확한 용어면 설명 뒤에 남깁니다.",
  },
];

const proseTags = new Set(["p", "h1", "h2", "h3", "h4", "li", "figcaption", "blockquote", "td", "th"]);
const proseAttributes = new Set([
  "application",
  "boundary",
  "description",
  "detail",
  "example",
  "idea",
  "interpretation",
  "label",
  "note",
  "output",
  "preview",
  "question",
  "questions",
  "summary",
  "title",
]);
const excludedTags = new Set(["code", "pre", "math"]);

function tagName(node) {
  return node.getText().replace(/^.*\./, "");
}

function compact(value) {
  return value.replace(/\s+/gu, " ").trim();
}

function textFromJsx(node) {
  if (ts.isJsxText(node)) return node.getText();
  if (ts.isJsxExpression(node)) {
    const expression = node.expression;
    if (expression && (ts.isStringLiteralLike(expression) || ts.isNoSubstitutionTemplateLiteral(expression))) {
      return expression.text;
    }
    return " ";
  }
  if (ts.isJsxElement(node)) {
    if (excludedTags.has(tagName(node.openingElement.tagName))) return " ";
    return node.children.map(textFromJsx).join(" ");
  }
  return " ";
}

function stringLeaves(node, values) {
  if (ts.isStringLiteralLike(node) || ts.isNoSubstitutionTemplateLiteral(node)) {
    values.push({ node, text: node.text });
    return;
  }
  if (ts.isTemplateExpression(node)) {
    values.push({ node, text: [node.head.text, ...node.templateSpans.map((span) => span.literal.text)].join(" ") });
    return;
  }
  ts.forEachChild(node, (child) => stringLeaves(child, values));
}

function collectProseUnits(file) {
  const source = fs.readFileSync(file, "utf8");
  const ast = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
  const units = [];

  function add(node, value, kind) {
    const text = compact(value);
    if (!/[가-힣]/u.test(text)) return;
    const { line } = ast.getLineAndCharacterOfPosition(node.getStart(ast));
    units.push({ file, line: line + 1, kind, text });
  }

  function visit(node) {
    if (ts.isJsxElement(node)) {
      const name = tagName(node.openingElement.tagName);
      if (proseTags.has(name)) add(node, node.children.map(textFromJsx).join(" "), `<${name}>`);
    }
    if (ts.isJsxAttribute(node) && proseAttributes.has(node.name.text)) {
      if (node.initializer && ts.isStringLiteral(node.initializer)) {
        add(node, node.initializer.text, `prop:${node.name.text}`);
      } else if (node.initializer && ts.isJsxExpression(node.initializer) && node.initializer.expression) {
        const values = [];
        stringLeaves(node.initializer.expression, values);
        values.forEach((value) => add(value.node, value.text, `prop:${node.name.text}`));
      }
    }
    ts.forEachChild(node, visit);
  }

  visit(ast);
  return units;
}

const catalog = await loadPublicArticleCatalog();
const findings = [];
const seenFiles = new Map();

for (const article of catalog) {
  if (routeFilter && article.route !== routeFilter) continue;
  for (const file of collectArticleSourceClosure(article.sourcePath)) {
    let units = seenFiles.get(file);
    if (!units) {
      units = collectProseUnits(file);
      seenFiles.set(file, units);
    }
    for (const unit of units) {
      for (const rule of rules) {
        rule.pattern.lastIndex = 0;
        for (const match of unit.text.matchAll(rule.pattern)) {
          findings.push({
            route: article.route,
            file: path.relative(process.cwd(), unit.file),
            line: unit.line,
            kind: unit.kind,
            rule: rule.id,
            severity: rule.severity,
            match: match[0],
            message: rule.message,
            text: unit.text,
          });
        }
      }
    }
  }
}

const errors = findings.filter((finding) => finding.severity === "error");
const reviews = findings.filter((finding) => finding.severity === "review");
const counts = new Map();
for (const finding of findings) {
  const key = `${finding.severity}:${finding.rule}`;
  counts.set(key, (counts.get(key) ?? 0) + 1);
}

console.log(`쉬운 한국어 검사: 공개 글 ${routeFilter ? 1 : catalog.length}개 · 오류 ${errors.length}개 · 문맥 검토 ${reviews.length}개`);
console.log([...counts].sort().map(([rule, count]) => `${rule}=${count}`).join(" · ") || "검출 없음");

const report = routeFilter ? findings : [...errors, ...reviews].slice(0, 80);
for (const finding of report) {
  console.log(`${finding.severity === "error" ? "오류" : "검토"} ${finding.rule} ${finding.route} ${finding.file}:${finding.line} [${finding.match}]`);
  console.log(`  ${finding.message}`);
  console.log(`  ${finding.text.slice(0, 220)}`);
}
if (!routeFilter && findings.length > report.length) {
  console.log(`나머지 ${findings.length - report.length}건은 --route=<category/slug>로 해당 글을 확인하세요.`);
}

if (strict && errors.length > 0) process.exitCode = 1;
