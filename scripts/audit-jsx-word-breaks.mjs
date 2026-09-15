#!/usr/bin/env node
/**
 * JSX 텍스트 줄바꿈이 단어 가운데서 일어난 곳을 찾는다.
 *
 * JSX 는 텍스트 노드의 줄바꿈을 공백 하나로 바꾼다. 그래서
 *
 *     ... 세울 수 없으므로 실제
 *     로는 다른 방식으로 나뉩니다.
 *
 * 는 화면에 "실제 로는" 으로 렌더된다. tsc·eslint·기존 감사 8종·스크린샷
 * sweep 어디에도 걸리지 않는 결함이라 별도 감사가 필요하다.
 *
 * 판정은 보수적으로 한다. 앞 줄이 한글로 끝나고 다음 줄이 **단어 첫머리에
 * 올 수 없는 조사·어미 조각**으로 시작할 때만 잡는다. 보조용언으로 띄어
 * 쓰는 것이 정상인 "합니다"·"됩니다" 류는 목록에서 뺐다.
 *
 *   node scripts/audit-jsx-word-breaks.mjs [--strict]
 */
import { readFileSync } from "node:fs";
import { globSync } from "node:fs";

/** 앞에 공백이 올 수 없는 조각들 */
const SUFFIXES = [
  "으로는", "으로도", "에게서", "에게도", "에서는", "이라도", "이라고", "습니다",
  "로는", "로도", "로서", "로써", "으로", "에게", "에서", "에는", "에도",
  "부터", "까지", "마저", "조차", "처럼", "지만", "면서", "인데", "이며", "이고", "라서",
  "입니다", "니다",
];

const pattern = new RegExp(
  "^\\s*(" + [...SUFFIXES].sort((a, b) => b.length - a.length).join("|") + ")",
);
const hangulEnd = /[가-힣]$/;

const files = globSync("src/pages/articles/**/*.tsx");
const findings = [];

for (const file of files.sort()) {
  const lines = readFileSync(file, "utf8").split("\n");
  for (let i = 0; i < lines.length - 1; i += 1) {
    const prev = lines[i].replace(/\s+$/, "");
    const next = lines[i + 1];
    if (!hangulEnd.test(prev)) continue;
    if (!pattern.test(next)) continue;
    const joined =
      prev.trim().slice(-14) + " ⟵⟶ " + next.trim().slice(0, 14);
    findings.push({ file, line: i + 1, joined });
  }
}

const strict = process.argv.includes("--strict");
for (const f of findings) {
  console.log(`${f.file}:${f.line}  ${f.joined}`);
}
console.log(
  `\nJSX 단어 중간 줄바꿈 검사: 파일 ${files.length}개 · 발견 ${findings.length}건`,
);
if (findings.length === 0) {
  console.log("JSX 단어 중간 줄바꿈 검사 통과");
} else if (strict) {
  process.exit(1);
}
