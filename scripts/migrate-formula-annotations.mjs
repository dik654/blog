import fs from "node:fs";
import katex from "katex";
import ts from "typescript";
import {
  collectArticleSourceClosure,
  loadPublicArticleCatalog,
} from "./lib/public-article-catalog.mjs";

const write = process.argv.includes("--write");
const migrateConfigs = process.argv.includes("--configs");
const catalog = await loadPublicArticleCatalog();
const files = [
  ...new Set(
    catalog.flatMap((article) => collectArticleSourceClosure(article.sourcePath)),
  ),
];

function attribute(node, name, ast) {
  return node.attributes.properties.find(
    (property) =>
      ts.isJsxAttribute(property) && property.name.getText(ast) === name,
  );
}

function expressionOf(property) {
  if (!property?.initializer) return undefined;
  if (ts.isStringLiteral(property.initializer)) return property.initializer;
  if (!ts.isJsxExpression(property.initializer)) return undefined;
  return property.initializer.expression;
}

function staticString(property) {
  const expression = expressionOf(property);
  if (!expression) return undefined;
  if (ts.isStringLiteralLike(expression)) return expression.text;
  if (
    ts.isTaggedTemplateExpression(expression) &&
    ts.isNoSubstitutionTemplateLiteral(expression.template)
  ) {
    return expression.template.rawText ?? expression.template.text;
  }
  return undefined;
}

function plainText(node) {
  if (!node) return "";
  if (
    ts.isStringLiteralLike(node) ||
    ts.isNoSubstitutionTemplateLiteral(node) ||
    ts.isJsxText(node)
  ) {
    return node.text;
  }
  let value = "";
  node.forEachChild((child) => {
    value += ` ${plainText(child)}`;
  });
  return value.replace(/\s+/g, " ").trim();
}

function staticTerms(property) {
  const expression = expressionOf(property);
  if (!expression || !ts.isArrayLiteralExpression(expression)) return [];
  return expression.elements.flatMap((element) => {
    if (!ts.isObjectLiteralExpression(element)) return [];
    const result = {};
    for (const item of element.properties) {
      if (!ts.isPropertyAssignment(item)) continue;
      const key = item.name.getText().replace(/["']/g, "");
      if (!["symbol", "name", "description"].includes(key)) continue;
      if (ts.isStringLiteralLike(item.initializer)) {
        result[key] = item.initializer.text;
      } else if (
        ts.isTaggedTemplateExpression(item.initializer) &&
        ts.isNoSubstitutionTemplateLiteral(item.initializer.template)
      ) {
        result[key] =
          item.initializer.template.rawText ?? item.initializer.template.text;
      }
    }
    return result.symbol && result.name ? [result] : [];
  });
}

function objectProperty(node, name) {
  return node.properties.find(
    (property) =>
      ts.isPropertyAssignment(property) &&
      property.name.getText().replace(/["']/g, "") === name,
  );
}

function staticInitializer(property) {
  if (!property || !ts.isPropertyAssignment(property)) return undefined;
  const { initializer } = property;
  if (ts.isStringLiteralLike(initializer)) return initializer.text;
  if (
    ts.isTaggedTemplateExpression(initializer) &&
    ts.isNoSubstitutionTemplateLiteral(initializer.template)
  ) {
    return initializer.template.rawText ?? initializer.template.text;
  }
  return undefined;
}

function staticObjectTerms(property) {
  if (
    !property ||
    !ts.isPropertyAssignment(property) ||
    !ts.isArrayLiteralExpression(property.initializer)
  ) {
    return [];
  }
  return property.initializer.elements.flatMap((element) => {
    if (!ts.isObjectLiteralExpression(element)) return [];
    const result = {};
    for (const item of element.properties) {
      if (!ts.isPropertyAssignment(item)) continue;
      const key = item.name.getText().replace(/["']/g, "");
      if (!["symbol", "name", "description"].includes(key)) continue;
      result[key] = staticInitializer(item);
    }
    return result.symbol && result.name ? [result] : [];
  });
}

function cleanFormulaLine(line) {
  return line
    .replace(/^\s*\\begin\{(?:aligned|gathered)\}/, "")
    .replace(/\\end\{(?:aligned|gathered)\}\s*$/, "")
    .trim();
}

function rhsOf(line) {
  const markers = ["&=", "=", String.raw`&\le`, String.raw`\le`, String.raw`&\ge`, String.raw`\ge`, String.raw`&<`, "<", String.raw`&>`, ">"];
  for (const marker of markers) {
    const index = line.indexOf(marker);
    if (index < 0) continue;
    const rhs = line.slice(index + marker.length).trim();
    if (rhs && !rhs.includes("&")) {
      return {
        lhs: line.slice(0, index).replace(/&/g, "").trim(),
        expression: rhs,
        relation: marker.replace("&", ""),
      };
    }
  }
  if (!line.includes("&") && !/\\begin\{|\\end\{/.test(line)) {
    return { lhs: "", expression: line, relation: "" };
  }
  return undefined;
}

function operationCandidates(formula, terms) {
  const candidates = formula
    .split(/\\\\(?:\[[^\]]*\])?/)
    .map(cleanFormulaLine)
    .filter(Boolean)
    .map(rhsOf)
    .filter(Boolean)
    .filter(({ expression }) => expression.length <= 240)
    .slice(0, 3);
  if (candidates.length) return candidates;

  const term = terms.find(({ symbol }) => formula.includes(symbol));
  if (term) {
    return [{ lhs: "", expression: term.symbol, relation: "", term }];
  }
  if (!/\\begin\{|\\end\{|&/.test(formula) && formula.length <= 240) {
    return [{ lhs: "", expression: formula, relation: "" }];
  }
  return [];
}

function matchingTerm(candidate, terms) {
  const ordered = [...terms].sort((a, b) => b.symbol.length - a.symbol.length);
  return ordered.find(
    ({ symbol }) =>
      symbolIndex(candidate.lhs, symbol) >= 0 ||
      symbolIndex(candidate.expression, symbol) >= 0,
  );
}

function symbolIndex(source, symbol) {
  if (!/^[A-Za-z0-9]$/.test(symbol)) return source.indexOf(symbol);
  const expression = new RegExp(
    `(^|[^A-Za-z])${symbol.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}([^A-Za-z]|$)`,
  );
  const match = expression.exec(source);
  if (!match) return -1;
  return match.index + match[1].length;
}

function termCandidates(formula, terms) {
  return [...terms]
    .sort((a, b) => b.symbol.length - a.symbol.length)
    .filter(({ symbol }) => symbolIndex(formula, symbol) >= 0)
    .slice(0, 3)
    .map((term) => ({
      lhs: "",
      expression: term.symbol,
      relation: "",
      term,
      symbolMatch: true,
    }));
}

function operationLabel(candidate, term) {
  const source = `${candidate.lhs} ${candidate.expression}`;
  if (/\\mathbb\s*\{?E\}?|\\operatorname\{E\}/.test(source)) return "확률 가중 평균";
  if (/\\operatorname\{Var\}|\\mathrm\{Var\}/.test(source)) return "분산 규모";
  if (/\\operatorname\{Cov\}|\\mathrm\{Cov\}/.test(source)) return "lag별 공분산";
  if (/\\operatorname\{softmax\}|softmax/i.test(source)) return "선택 비율 정규화";
  if (/\\sum\b/.test(source)) return "항별 기여 누적";
  if (/\\prod\b/.test(source)) return "단계별 요인 누적";
  if (/\\frac\s*\{/.test(source) || /\//.test(candidate.expression)) return "기준량당 비율";
  if (/\\log|\\ln/.test(source)) return "로그 비용 변환";
  if (/\\min|\\max|\\arg/.test(source)) return "경계 후보 선택";
  if (/\\land|\\lor|\\wedge|\\vee/.test(source)) return "판정 조건 결합";
  if (/\\le|\\ge|[<>]/.test(source)) return "허용 경계 판정";
  if (/\\Delta|1-B/.test(source)) return "변화량 계산";
  if (term?.name) {
    const words = term.name.split(/\s+/);
    let concise = "";
    for (const word of words) {
      if (`${concise} ${word}`.trim().length > 24) break;
      concise = `${concise} ${word}`.trim();
    }
    return `${concise || words[0]} 계산`;
  }
  return candidate.relation ? "오른쪽 항으로 결과 계산" : "입력에서 결과 계산";
}

function operationPurpose(candidate, term) {
  const source = candidate.expression;
  if (/\\operatorname\{softmax\}|softmax/i.test(source)) return "score를 합이 1인 선택 비율로 정규화합니다.";
  if (/\\sum\b/.test(source)) return "index마다 만든 기여를 지정 범위 전체에 누적합니다.";
  if (/\\prod\b/.test(source)) return "각 단계의 요인을 곱해 joint contribution을 만듭니다.";
  if (/\\frac\s*\{/.test(source) || /\//.test(source)) return "분자에 둔 관심량을 분모의 기준량으로 정규화합니다.";
  if (/\\log|\\ln/.test(source)) return "확률이나 곱셈 규모를 더할 수 있는 log 비용으로 바꿉니다.";
  if (/\\min|\\max|\\arg/.test(source)) return "허용 후보 중 목적에 맞는 경계값을 선택합니다.";
  if (/\\land|\\wedge/.test(source)) return "필요한 gate가 모두 참일 때만 전체 조건을 통과시킵니다.";
  if (/\\lor|\\vee/.test(source)) return "대안 gate 중 하나라도 참이면 조건을 통과시킵니다.";
  if (/\\le|\\ge|[<>]/.test(source)) return "계산한 양을 허용 경계와 비교해 상태를 판정합니다.";
  if (/\\Delta|1-B/.test(source)) return "인접한 level의 차이를 남겨 변화량을 계산합니다.";
  if (term?.name) return `${term.name}이(가) 식의 결과에 기여하는 방식을 계산합니다.`;
  return candidate.relation
    ? "왼쪽 결과를 오른쪽의 실제 항으로 계산합니다."
    : "이 식의 입력을 결합해 필요한 결과를 계산합니다.";
}

function annotationLines(text, limit = 34, maxLines = 3) {
  const clean = text
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!clean) return [];
  const firstSentence = clean.split(/(?<=[.!?다요])\s+/)[0];
  const words = firstSentence.split(" ");
  const lines = [];
  for (const word of words) {
    const last = lines.at(-1);
    if (!last || `${last} ${word}`.length > limit) {
      if (lines.length === maxLines) break;
      lines.push(word);
    } else {
      lines[lines.length - 1] = `${last} ${word}`;
    }
  }
  return lines;
}

function escapeKatexText(value) {
  return value
    .replace(/\\/g, String.raw`\textbackslash{}`)
    .replace(/([{}%#$&_])/g, String.raw`\$1`)
    .replace(/\^/g, String.raw`\textasciicircum{}`)
    .replace(/~/g, String.raw`\textasciitilde{}`);
}

function annotateFormula(formula, candidates, terms) {
  let annotated = formula;
  const operations = [];
  for (const candidate of candidates) {
    const term = candidate.term ?? matchingTerm(candidate, terms);
    const label = operationLabel(candidate, term);
    const index = candidate.symbolMatch
      ? symbolIndex(annotated, candidate.expression)
      : annotated.indexOf(candidate.expression);
    if (index < 0) continue;
    const wrapped = String.raw`\underbrace{${candidate.expression}}_{\text{${escapeKatexText(label)}}}`;
    annotated = `${annotated.slice(0, index)}${wrapped}${annotated.slice(index + candidate.expression.length)}`;
    operations.push({ ...candidate, term });
  }
  return { annotated, operations };
}

function rawTemplate(value) {
  return `String.raw\`${value.replace(/`/g, "\\`").replace(/\$\{/g, "\\${")}\``;
}

function validateKatex(formula) {
  try {
    katex.renderToString(formula, { throwOnError: true, strict: false });
    return undefined;
  } catch (error) {
    return error instanceof Error ? error.message : String(error);
  }
}

const summary = {
  files: 0,
  migrated: 0,
  dynamic: 0,
  noCandidate: 0,
  katexFailure: 0,
};
const examples = [];
const failures = [];

for (const file of files) {
  const source = fs.readFileSync(file, "utf8");
  const ast = ts.createSourceFile(
    file,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TSX,
  );
  const insertions = [];

  const visit = (node) => {
    if (
      ts.isJsxSelfClosingElement(node) &&
      node.tagName.getText(ast) === "ExplainedFormula"
    ) {
      if (attribute(node, "annotatedFormula", ast) && attribute(node, "operations", ast)) return;
      const formulaProperty = attribute(node, "formula", ast);
      const formula = staticString(formulaProperty);
      if (!formula) {
        summary.dynamic += 1;
        return;
      }
      const terms = staticTerms(attribute(node, "terms", ast));
      const primaryCandidates = operationCandidates(formula, terms);
      const fallbackCandidates = termCandidates(formula, terms);
      const candidateSets = [
        primaryCandidates,
        ...primaryCandidates.map((candidate) => [candidate]),
        fallbackCandidates,
        ...fallbackCandidates.map((candidate) => [candidate]),
      ].filter((candidates) => candidates.length);
      if (!candidateSets.length) {
        summary.noCandidate += 1;
        failures.push(`${file}: no safe formula fragment`);
        return;
      }
      let generated;
      let lastFailure;
      for (const candidates of candidateSets) {
        const attempt = annotateFormula(formula, candidates, terms);
        if (!attempt.operations.length) continue;
        const katexFailure = validateKatex(attempt.annotated);
        const operationFailure = attempt.operations
          .map(({ expression }) => validateKatex(String.raw`\underbrace{${expression}}_{\text{operation}}`))
          .find(Boolean);
        if (!katexFailure && !operationFailure) {
          generated = attempt;
          break;
        }
        lastFailure = katexFailure ?? operationFailure;
      }
      if (!generated) {
        summary.katexFailure += 1;
        failures.push(`${file}: ${lastFailure ?? "formula fragment was not found"}`);
        return;
      }
      const { annotated, operations } = generated;

      const question = staticString(attribute(node, "question", ast)) ?? "";
      const idea = plainText(expressionOf(attribute(node, "idea", ast)));
      const contextLines = annotationLines(idea || question);
      const { line } = ast.getLineAndCharacterOfPosition(formulaProperty.getStart(ast));
      const lineStart = ast.getLineStarts()[line];
      const indent = source.slice(lineStart, formulaProperty.getStart(ast)).match(/^\s*/)?.[0] ?? "";
      const operationSource = operations
        .map((candidate) => {
          const purpose = operationPurpose(candidate, candidate.term);
          const lines = [...annotationLines(purpose, 34, 2), ...contextLines].slice(0, 4);
          return `{ expression: ${rawTemplate(candidate.expression)}, annotation: ${JSON.stringify(lines)} }`;
        })
        .join(",\n" + indent + "  ");
      const insertion =
        `\n${indent}annotatedFormula={${rawTemplate(annotated)}}` +
        `\n${indent}operations={[\n${indent}  ${operationSource},\n${indent}]}`;
      insertions.push({ at: formulaProperty.end, text: insertion });
      summary.migrated += 1;
      if (examples.length < 8) examples.push({ file, formula, annotated, operations });
    }
    ts.forEachChild(node, visit);
  };
  visit(ast);

  if (insertions.length && write) {
    let next = source;
    for (const insertion of insertions.sort((a, b) => b.at - a.at)) {
      next = `${next.slice(0, insertion.at)}${insertion.text}${next.slice(insertion.at)}`;
    }
    fs.writeFileSync(file, next);
    summary.files += 1;
  } else if (insertions.length) {
    summary.files += 1;
  }
}

const configSummary = { files: 0, migrated: 0, skipped: 0 };
if (migrateConfigs) {
  const configFiles = [
    "src/pages/articles/isms-aml/aml-controls-article.tsx",
    "src/pages/articles/isms-aml/compliance-evidence-article.tsx",
    "src/pages/articles/isms-aml/isms-operations-article.tsx",
    "src/pages/articles/tee/security-release-article.tsx",
    "src/pages/articles/isms-aml/vasp-operations-article.tsx",
    "src/pages/articles/tee/platform-tee-article.tsx",
  ];
  for (const file of configFiles) {
    const source = fs.readFileSync(file, "utf8");
    const ast = ts.createSourceFile(
      file,
      source,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TSX,
    );
    const insertions = [];
    const visitConfig = (node) => {
      if (ts.isObjectLiteralExpression(node)) {
        const formulaProperty = objectProperty(node, "formula");
        const annotatedProperty = objectProperty(node, "annotatedFormula");
        const operationsProperty = objectProperty(node, "operations");
        if (formulaProperty && !annotatedProperty && !operationsProperty) {
          const formula = staticInitializer(formulaProperty);
          const terms = staticObjectTerms(objectProperty(node, "terms"));
          const idea =
            staticInitializer(objectProperty(node, "idea")) ??
            staticInitializer(objectProperty(node, "formulaIdea")) ??
            "";
          if (formula) {
            const primary = operationCandidates(formula, terms);
            const fallback = termCandidates(formula, terms);
            const sets = [
              primary,
              ...primary.map((candidate) => [candidate]),
              fallback,
              ...fallback.map((candidate) => [candidate]),
            ].filter((candidates) => candidates.length);
            let generated;
            for (const candidates of sets) {
              const attempt = annotateFormula(formula, candidates, terms);
              if (
                attempt.operations.length &&
                !validateKatex(attempt.annotated) &&
                !attempt.operations.some(({ expression }) =>
                  validateKatex(String.raw`\underbrace{${expression}}_{\text{operation}}`),
                )
              ) {
                generated = attempt;
                break;
              }
            }
            if (generated) {
              const { line } = ast.getLineAndCharacterOfPosition(
                formulaProperty.getStart(ast),
              );
              const lineStart = ast.getLineStarts()[line];
              const indent =
                source
                  .slice(lineStart, formulaProperty.getStart(ast))
                  .match(/^\s*/)?.[0] ?? "";
              const contextLines = annotationLines(idea);
              const operationSource = generated.operations
                .map((candidate) => {
                  const purpose = operationPurpose(candidate, candidate.term);
                  const lines = [
                    ...annotationLines(purpose, 34, 2),
                    ...contextLines,
                  ].slice(0, 4);
                  return `{ expression: ${rawTemplate(candidate.expression)}, annotation: ${JSON.stringify(lines)} }`;
                })
                .join(",\n" + indent + "  ");
              let at = formulaProperty.end;
              while (/\s/.test(source[at] ?? "")) at += 1;
              if (source[at] === ",") at += 1;
              insertions.push({
                at,
                text:
                  `\n${indent}annotatedFormula: ${rawTemplate(generated.annotated)},` +
                  `\n${indent}operations: [\n${indent}  ${operationSource},\n${indent}],`,
              });
              configSummary.migrated += 1;
            } else {
              configSummary.skipped += 1;
            }
          }
        }
      }
      ts.forEachChild(node, visitConfig);
    };
    visitConfig(ast);
    if (insertions.length) {
      configSummary.files += 1;
      if (write) {
        let next = source;
        for (const insertion of insertions.sort((a, b) => b.at - a.at)) {
          next = `${next.slice(0, insertion.at)}${insertion.text}${next.slice(insertion.at)}`;
        }
        fs.writeFileSync(file, next);
      }
    }
  }
}

console.log(`Formula annotation migration ${write ? "write" : "dry-run"}: ${JSON.stringify(summary)}`);
if (migrateConfigs) console.log(`Formula config migration: ${JSON.stringify(configSummary)}`);
for (const example of examples) {
  console.log(`\n${example.file}`);
  console.log(`  formula:   ${example.formula}`);
  console.log(`  annotated: ${example.annotated}`);
  for (const operation of example.operations) console.log(`  operation: ${operation.expression}`);
}
if (failures.length) {
  console.log(`\nSkipped ${failures.length} formula(s):`);
  for (const failure of failures.slice(0, 30)) console.log(`- ${failure}`);
  if (failures.length > 30) console.log(`- … ${failures.length - 30} more`);
}
