import fs from "node:fs";
import path from "node:path";

const roots = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
const strict = process.argv.includes("--strict");
const targets = roots.length ? roots : ["src/components/viz", "src/pages/articles"];
const extensions = new Set([".tsx", ".ts", ".jsx", ".js"]);

function collect(target, files = []) {
  if (!fs.existsSync(target)) return files;
  const stat = fs.statSync(target);
  if (stat.isFile()) {
    if (extensions.has(path.extname(target))) files.push(target);
    return files;
  }
  for (const entry of fs.readdirSync(target)) collect(path.join(target, entry), files);
  return files;
}

const rules = [
  { label: "gradient", severity: "error", pattern: /(?:bg-\[?(?:linear|radial)-gradient|bg-gradient|<linearGradient|<radialGradient)/g },
  { label: "thick SVG stroke", severity: "error", pattern: /strokeWidth=\{?(?:["']?[2-9]|["']?1\.(?:[3-9]\d*|2[6-9]))/g },
  { label: "heavy shadow", severity: "error", pattern: /shadow-(?:lg|xl|2xl)|shadow-\[[^\]]*(?:18px|24px|32px|40px|55px)/g },
  { label: "oversized radius", severity: "error", pattern: /rounded-(?:3xl|\[1\.(?:5|75|8|9)[^\]]*\])/g },
  { label: "SVG text (브라우저에서 overflow 확인)", severity: "review", pattern: /<text\b/g },
];

const findings = [];
for (const file of [...new Set(targets.flatMap((target) => collect(target)))]) {
  const source = fs.readFileSync(file, "utf8");
  for (const { label, severity, pattern } of rules) {
    pattern.lastIndex = 0;
    for (const match of source.matchAll(pattern)) {
      const line = source.slice(0, match.index).split("\n").length;
      findings.push({ message: `${file}:${line}  ${severity.toUpperCase()}  ${label}`, severity });
    }
  }
}

if (findings.length) {
  console.log(findings.map(({ message }) => message).join("\n"));
  console.log(`\n${findings.length}개의 Viz 검토 항목이 있습니다.`);
  if (strict && findings.some(({ severity }) => severity === "error")) process.exitCode = 1;
} else {
  console.log("Viz 정적 스타일 검사 통과");
}
