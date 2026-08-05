import { useState } from 'react';
import { Braces, Grid3X3, ShieldCheck, TriangleAlert } from 'lucide-react';

type Scenario = 'valid' | 'missing' | 'collision' | 'overflow';

const SCENARIOS = {
  valid: { label: '정상 병합', html: '<tr><th rowspan="2">지역</th><th colspan="2">매출</th></tr>\n<tr><th>Q1</th><th>Q2</th></tr>', verdict: '모든 slot이 정확히 한 origin cell을 가리킨다.', status: 'pass', evidence: { origin: 'cell:p47:r0:c0', source: 'page 47 · [86, 312, 184, 402]', crop: 'crop://report/p47/cell-r0-c0', neighbor: null } },
  missing: { label: '셀 누락', html: '<tr><td rowspan="2">A</td><td>Q1</td><td>Q2</td></tr>\n<tr><td>9</td></tr>', verdict: '둘째 행의 첫 slot은 이전 rowspan이 점유하고, row-major 배치로 9는 둘째 slot에 놓인다. 따라서 빈 위치는 마지막 slot로 확정되지만, 그 자리에 어떤 cell 값이 있었는지는 source 근거가 없어 review 상태로 둔다.', status: 'warn', evidence: { origin: '∅ · unresolved', source: 'missing slot에는 source region 없음', crop: 'missing slot에는 crop 없음', neighbor: '이웃 9 · cell:p48:r1:c1 · page 48 [206, 146, 294, 192]' } },
  collision: { label: 'slot 충돌', html: 'cells = [\n  {text:"지역", r:0, c:0, rowspan:2},\n  {text:"매출", r:0, c:1, colspan:2},\n  {text:"Q1", r:1, c:0},\n  {text:"9", r:1, c:1},\n  {text:"12", r:1, c:2}\n]', verdict: 'Q1의 origin (1,0)은 이미 지역 rowspan이 점유한다. 같은 slot을 두 origin cell이 주장하므로 자동 이동시키지 않고 충돌로 거절한다.', status: 'fail', evidence: { origin: 'cell:p48:r1:c0', source: 'page 48 · [88, 146, 184, 192]', crop: 'crop://report/p48/cell-r1-c0', neighbor: null } },
  overflow: { label: '열 초과', html: '<tr><th rowspan="2">지역</th><th colspan="2">매출</th></tr>\n<tr><td colspan="2">Q1</td><td>Q2</td></tr>', verdict: '이전 rowspan을 건너뛴 뒤 남은 폭은 2칸인데 새로 시작한 cell들의 폭 합은 Q1 2칸 + Q2 1칸 = 3칸이다. Q2는 고정 schema C=3 밖으로 나간 열 초과이며 slot 충돌과는 다른 오류다.', status: 'fail', evidence: { origin: 'cell:p48:r1:c3', source: 'page 48 · [386, 146, 474, 192]', crop: 'crop://report/p48/cell-r1-c3', neighbor: null } },
} as const;

const GRID = {
  valid: [['지역↘', '매출→', '매출→'], ['지역↘', 'Q1', 'Q2']],
  missing: [['A↘', 'Q1', 'Q2'], ['A↘', '9', '∅ ?']],
  collision: [['지역↘', '매출→', '매출→'], ['지역↘ / Q1 !', '9', '12']],
  overflow: [['지역↘', '매출→', '매출→'], ['지역↘', 'Q1→', 'Q1→', 'Q2 !']],
} as const;

export default function TableGridReconstructionLab() {
  const [scenario, setScenario] = useState<Scenario>('missing');
  const [showOrigins, setShowOrigins] = useState(true);
  const current = SCENARIOS[scenario];
  const schemaColumns = 3;
  const renderedColumns = Math.max(schemaColumns, ...GRID[scenario].map((row) => row.length));

  return (
    <div className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="border-b border-border bg-muted/20 p-4 sm:p-6"><p className="text-[10px] font-black uppercase text-muted-foreground">HTML table reconstruction lab</p><p className="mt-2 text-base font-bold">HTML token을 2차원 점유 격자로 펼쳐 검산한다</p></div>
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" role="group" aria-label="표 구조 오류 선택">
          {(Object.keys(SCENARIOS) as Scenario[]).map((id) => <button key={id} type="button" onClick={() => setScenario(id)} aria-pressed={scenario === id} className={`min-h-11 rounded-md border px-2 text-xs font-bold ${scenario === id ? 'border-foreground bg-foreground text-background' : 'border-border'}`}>{SCENARIOS[id].label}</button>)}
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
          <div className="min-w-0 rounded-md border border-border p-4"><div className="flex items-center justify-between"><div className="flex items-center gap-2"><Braces className="h-4 w-4" aria-hidden="true" /><p className="text-xs font-black">{scenario === 'collision' ? 'AST에서 펼친 origin-cell 목록' : 'Parser structure tokens'}</p></div><button type="button" onClick={() => setShowOrigins((value) => !value)} aria-pressed={showOrigins} className="min-h-11 rounded-md border border-border px-2 text-[11px] font-bold">{showOrigins ? 'origin 표시 중' : 'text만 보기'}</button></div><pre className="mt-4 overflow-x-auto whitespace-pre-wrap break-words rounded-sm bg-muted/35 p-3 text-[11px] leading-relaxed text-muted-foreground">{current.html}</pre>{scenario === 'collision' && <p className="mt-3 text-[10px] leading-relaxed text-muted-foreground">HTML의 rowspan·colspan을 parser가 AST로 읽은 뒤, 각 origin cell에 계산된 좌표를 붙인 중간 표현이다.</p>}</div>
          <div className="min-w-0 rounded-md border border-border p-4"><div className="flex items-center justify-between gap-3"><div className="flex items-center gap-2"><Grid3X3 className="h-4 w-4" aria-hidden="true" /><p className="text-xs font-black">Expanded occupancy grid</p></div><code className="shrink-0 text-[10px] text-muted-foreground">schema C={schemaColumns}</code></div><div className="mt-4 space-y-2">{GRID[scenario].map((row, rowIndex) => <div key={rowIndex} className="grid gap-2" style={{ gridTemplateColumns: `repeat(${renderedColumns}, minmax(0, 1fr))` }}>{row.map((cell, columnIndex) => <div key={`${rowIndex}-${columnIndex}`} className={`flex min-h-12 min-w-0 items-center justify-center rounded-sm border px-1 text-center text-[10px] font-bold ${columnIndex >= schemaColumns || cell.includes('!') ? 'border-rose-500/55 bg-rose-500/[0.07]' : cell.includes('∅') ? 'border-amber-500/55 bg-amber-500/[0.07]' : cell.includes('→') || cell.includes('↘') ? 'border-blue-500/35 bg-blue-500/[0.05]' : 'border-border'}`}>{showOrigins ? cell : cell.replace(/[→↘!]/g, '')}</div>)}</div>)}</div>{scenario === 'missing' && <p className="mt-3 text-[10px] leading-relaxed text-amber-700 dark:text-amber-300">∅는 row-major 규칙으로 마지막 열에 확정된다. 다만 source에 없는 cell 값은 추정하지 않는다.</p>}</div>
        </div>

        <div className="mt-5 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)_minmax(0,1.2fr)]" data-cell-evidence-ledger>
          <div className="min-w-0 bg-background p-3"><p className="font-mono text-[10px] font-black text-muted-foreground">ORIGIN CELL</p><code className="mt-2 block break-all text-[11px] font-bold">{current.evidence.origin}</code></div>
          <div className="min-w-0 bg-background p-3"><p className="font-mono text-[10px] font-black text-muted-foreground">SOURCE REGION</p><p className="mt-2 text-[11px] font-bold">{current.evidence.source}</p></div>
          <div className="min-w-0 bg-background p-3"><p className="font-mono text-[10px] font-black text-muted-foreground">REVIEW CROP</p><code className="mt-2 block break-all text-[11px] font-bold">{current.evidence.crop}</code></div>
        </div>
        {current.evidence.neighbor && <div className="mt-2 border-l-2 border-amber-500 bg-amber-500/[0.04] px-4 py-3 text-[11px] leading-relaxed"><strong>이웃 근거는 별도</strong> · {current.evidence.neighbor}. 이 좌표를 missing slot 자체의 provenance로 복사하지 않는다.</div>}

        <div className={`mt-5 flex gap-3 border-l-2 px-4 py-3 ${current.status === 'pass' ? 'border-emerald-500 bg-emerald-500/[0.04]' : current.status === 'warn' ? 'border-amber-500 bg-amber-500/[0.05]' : 'border-rose-500 bg-rose-500/[0.04]'}`}>
          {current.status === 'pass' ? <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" /> : <TriangleAlert className={`mt-0.5 h-4 w-4 shrink-0 ${current.status === 'warn' ? 'text-amber-600' : 'text-rose-600'}`} aria-hidden="true" />}
          <p className="text-sm leading-relaxed">{current.verdict}</p>
        </div>
      </div>
    </div>
  );
}
