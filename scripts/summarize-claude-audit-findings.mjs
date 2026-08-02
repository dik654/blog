import { createHash } from 'node:crypto';
import { existsSync } from 'node:fs';
import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';

const blogRoot = process.cwd();
const workspaceRoot = path.dirname(blogRoot);
const queue = process.env.CLAUDE_AUDIT_QUEUE
  ?? path.join(blogRoot, '.codex-tmp/claude-ai-learning-closure-audit-2026-07-31');
const outputJson = process.env.CLAUDE_FINDINGS_REPORT
  ?? path.join(queue, 'reconciliation.json');
const outputMarkdown = outputJson.replace(/\.json$/, '.md');

function sha256(value) {
  return createHash('sha256').update(value).digest('hex');
}

async function currentHashReceipt(sources) {
  const rows = [];
  for (const source of sources) {
    const absolute = path.isAbsolute(source) ? source : path.join(workspaceRoot, source);
    if (!existsSync(absolute)) return null;
    rows.push(`${sha256(await readFile(absolute))}  ${source}`);
  }
  return `${rows.join('\n')}\n`;
}

function parseFindings(result) {
  const lines = result.split('\n');
  const heading = /^\s*(?:[#>*-]+\s*)*(?:\*{1,2})?(P[012])(?:\s*(?:[-:—]|\()\s*(.*?))?(?:\*{1,2})?\s*$/i;
  const findings = [];
  let current;

  for (const line of lines.slice(1)) {
    const match = line.match(heading);
    if (match) {
      if (current) findings.push({ ...current, body: current.body.join('\n').trim() });
      current = {
        severity: match[1].toUpperCase(),
        title: (match[2] ?? '').replace(/\*+$/g, '').trim(),
        body: [],
      };
    } else if (current) {
      current.body.push(line);
    }
  }
  if (current) findings.push({ ...current, body: current.body.join('\n').trim() });

  if (findings.length === 0 && result.trimStart().startsWith('REVISE')) {
    findings.push({
      severity: 'UNCLASSIFIED',
      title: '구조화되지 않은 REVISE 응답',
      body: lines.slice(1).join('\n').trim(),
    });
  }
  return findings;
}

const manifest = JSON.parse(await readFile(path.join(queue, 'manifest.json'), 'utf8'));
const progress = (await readFile(path.join(queue, 'progress.jsonl'), 'utf8'))
  .split('\n')
  .filter(Boolean)
  .flatMap((line) => {
    try {
      return [JSON.parse(line)];
    } catch {
      return [];
    }
  });

const progressById = new Map();
for (const row of progress) {
  const rows = progressById.get(row.id) ?? [];
  rows.push(row);
  progressById.set(row.id, rows);
}

const items = [];
for (const entry of manifest) {
  const rows = progressById.get(entry.id) ?? [];
  const completed = rows
    .filter((row) => row.status === 'completed')
    .sort((left, right) => left.attempt - right.attempt);
  const current = await currentHashReceipt(entry.sources);
  let receipt;

  for (const row of completed.toReversed()) {
    if (row.strict_valid !== true || row.source_hash_stable !== true) continue;
    const hashFile = path.join(queue, 'hashes', `${entry.id}.attempt-${row.attempt}.after`);
    const recorded = await readFile(hashFile, 'utf8').catch(() => '');
    if (current && recorded === current) {
      receipt = row;
      break;
    }
  }

  let status = 'PENDING';
  let result = '';
  let findings = [];
  if (receipt) {
    status = receipt.first_line;
    const resultFile = path.join(queue, 'results', `${entry.id}.attempt-${receipt.attempt}.raw.json`);
    const raw = JSON.parse(await readFile(resultFile, 'utf8'));
    result = raw.result ?? '';
    findings = parseFindings(result);
  } else if (completed.length > 0) {
    const latest = completed.at(-1);
    const hashFile = path.join(queue, 'hashes', `${entry.id}.attempt-${latest.attempt}.after`);
    const recorded = await readFile(hashFile, 'utf8').catch(() => '');
    status = current && recorded && current !== recorded ? 'DRIFT' : 'INVALID';
  } else if (rows.some((row) => row.status === 'running')) {
    status = 'RUNNING';
  }

  items.push({
    id: entry.id,
    scope: entry.scope,
    sources: entry.sources,
    status,
    attempt: receipt?.attempt,
    at: receipt?.at,
    findings,
    result,
  });
}

const statusNames = ['ACCEPT', 'REVISE', 'PENDING', 'RUNNING', 'INVALID', 'DRIFT'];
const statusCounts = Object.fromEntries(statusNames.map((status) => [
  status,
  items.filter((item) => item.status === status).length,
]));
const severityCounts = Object.fromEntries(['P0', 'P1', 'P2', 'UNCLASSIFIED'].map((severity) => [
  severity,
  items.flatMap((item) => item.findings).filter((finding) => finding.severity === severity).length,
]));

const report = {
  generatedAt: new Date().toISOString(),
  queue: path.relative(blogRoot, queue),
  policy: {
    currentReceipt: 'strict_valid + source_hash_stable + exact current source SHA-256 receipt',
    reviseHandling: 'P0/P1/P2 are review inputs, not automatic edit commands; verify against article ownership and user learning intent.',
    invalidHandling: 'Wrong first line, empty response, HTTP failure, or stale source hash remains unresolved and must be retried.',
  },
  summary: {
    total: items.length,
    status: statusCounts,
    severity: severityCounts,
  },
  items,
};

const reviseItems = items
  .filter((item) => item.status === 'REVISE')
  .sort((left, right) => {
    const rank = (item) => Math.min(...item.findings.map((finding) => (
      finding.severity === 'P0' ? 0 : finding.severity === 'P1' ? 1 : finding.severity === 'P2' ? 2 : 3
    )));
    return rank(left) - rank(right) || left.id.localeCompare(right.id);
  });

const markdown = [
  '# Claude 현재 소스 감사 조정표',
  '',
  `- 전체: ${items.length}`,
  `- 현재 해시 ACCEPT: ${statusCounts.ACCEPT}`,
  `- 현재 해시 REVISE: ${statusCounts.REVISE}`,
  `- 실행 전/중: ${statusCounts.PENDING + statusCounts.RUNNING}`,
  `- 무효 응답: ${statusCounts.INVALID}`,
  `- 소스 변경: ${statusCounts.DRIFT}`,
  `- 발견 항목: P0 ${severityCounts.P0}, P1 ${severityCounts.P1}, P2 ${severityCounts.P2}, 미분류 ${severityCounts.UNCLASSIFIED}`,
  '',
  '## 적용 원칙',
  '',
  '- Claude의 `REVISE`는 수정 명령이 아니라 반례 후보로 취급한다.',
  '- 사실·수식·출처 경계, 숨은 선행지식, 상태가 변하지 않는 핵심 Viz를 먼저 확인한다.',
  '- 취향 차이, 범위 밖 역사 추가, 이미 다른 장치로 충족한 연습 요구는 자동 반영하지 않는다.',
  '- 수정 뒤에는 새 소스 해시로 다시 검증해야 한다.',
  '',
  '## 현재 REVISE',
  '',
  ...(reviseItems.length > 0
    ? reviseItems.flatMap((item) => [
      `### ${item.id}`,
      '',
      ...item.findings.flatMap((finding) => [
        `- **${finding.severity} ${finding.title || '제목 없음'}**`,
        finding.body ? `  ${finding.body.replace(/\n/g, '\n  ')}` : '',
      ]),
      '',
    ])
    : ['현재 해시 기준 REVISE 없음.', '']),
  '## 미해결 실행',
  '',
  ...items
    .filter((item) => !['ACCEPT', 'REVISE'].includes(item.status))
    .map((item) => `- \`${item.id}\` — ${item.status}`),
  '',
].join('\n');

await writeFile(outputJson, `${JSON.stringify(report, null, 2)}\n`);
await writeFile(outputMarkdown, markdown);

console.log(JSON.stringify({
  outputJson,
  outputMarkdown,
  ...report.summary,
}, null, 2));
