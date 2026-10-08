import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (file) => fs.readFileSync(path.join(root, file), "utf8");
const failures = [];

const structuredFiles = [
  "src/pages/articles/cloud/commonData.ts",
  "src/pages/articles/cloud/systemsData.ts",
  "src/pages/articles/cloud/awsData.ts",
  "src/pages/articles/cloud/azureData.ts",
  "src/pages/articles/hw/ai-infrastructure-study/data.ts",
  "src/pages/articles/hw/ai-infrastructure-study/ncaAiioData.ts",
];

let structuredCount = 0;
for (const file of structuredFiles) {
  const source = read(file);
  const overviews = [...source.matchAll(/\{\s*id: "overview",\s*level: "S",[\s\S]*?paragraphs: \[\s*"([^"]+)"/g)];
  structuredCount += overviews.length;
  for (const match of overviews) {
    if (!match[1].startsWith("(가정)")) {
      failures.push(`${file}: overview가 (가정) 사건으로 시작하지 않습니다: ${match[1].slice(0, 48)}`);
    }
    if (match[1].includes("한 문장 답")) {
      failures.push(`${file}: 결론 선언이 사건보다 먼저 나옵니다.`);
    }
  }
}

if (structuredCount !== 21) {
  failures.push(`구조화 HW·Cloud 글 수가 21이 아닙니다: ${structuredCount}`);
}

const legacyEntries = [
  "gpu-comparison",
  "ai-accelerator-vendor-comparison",
  "server-vs-desktop",
  "server-cpu-lineup-comparison",
  "nvme-storage",
  "storage-comparison",
  "memory",
  "power-cooling",
  "datacenter-site-readiness",
  "network",
  "gpu-interconnects",
  "rdma-roce",
  "gpu-collective-network",
  "modded-rtx4090-moe-serving",
  "b300-switchless-network",
];

for (const entry of legacyEntries) {
  const file = `src/pages/articles/hw/${entry}.tsx`;
  const source = read(file);
  if (!source.includes("<HardwareTeachOpening data=")) {
    failures.push(`${file}: 사건→검은 상자→작은 수치 입구가 없습니다.`);
  }
  if (!source.includes("<HardwareTeachMechanism data=")) {
    failures.push(`${file}: 이름 붙이기 뒤 내부 구조(4)로 이어지는 연결부가 없습니다.`);
  }
  if (!source.includes("<HardwareFieldLab data=")) {
    failures.push(`${file}: 실제 명령→정상 경로→실패 판독(5~7) 현장 드릴이 없습니다.`);
  }
}

const cases = read("src/pages/articles/hw/hardwareTeachCases.ts");
const caseCount = [...cases.matchAll(/^  [a-zA-Z0-9]+: \{/gm)].length;
if (caseCount !== legacyEntries.length) {
  failures.push(`레거시 HW 사례 수가 ${legacyEntries.length}이 아닙니다: ${caseCount}`);
}
const assumptionCount = [...cases.matchAll(/"\(가정\)/g)].length;
if (assumptionCount < legacyEntries.length) {
  failures.push(`레거시 HW 작은 사례의 (가정) 표시가 부족합니다: ${assumptionCount}/${legacyEntries.length}`);
}

const depthFiles = [
  "src/pages/articles/cloud/cloudEngineeringDepth.ts",
  "src/pages/articles/hw/ai-infrastructure-study/depthData.ts",
];
for (const file of depthFiles) {
  const source = read(file);
  const earlyLedgers = [...source.matchAll(/section: "(case|picture|need)",\s*\n\s*title:/g)];
  if (earlyLedgers.length > 0) {
    failures.push(`${file}: 이름 붙이기 전에 표·원장이 ${earlyLedgers.length}개 배치돼 있습니다.`);
  }
}

const depthBlocks = read("src/pages/articles/cloud/EngineeringDepthBlocks.tsx");
const depthLevelSignals = [
  ['ledger.section === "mechanism" ? "4"', "내부 구조 4"],
  ['data-teach-level="5"', "실제 명령 5"],
  ['tone === "normal" ? "6" : "7"', "정상·실패 판독 6~7"],
];
for (const [signal, label] of depthLevelSignals) {
  if (!depthBlocks.includes(signal)) failures.push(`EngineeringDepthBlocks.tsx: ${label} 표시가 없습니다.`);
}

if (failures.length > 0) {
  console.error("HW·Infra·Cloud teach-system 검사 실패");
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`HW·Infra·Cloud teach-system 흐름 검사 통과: 구조화 ${structuredCount}편 + 레거시 HW ${legacyEntries.length}편`);
