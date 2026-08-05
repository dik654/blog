import { useMemo, useState } from 'react';
import {
  Braces,
  CheckCircle2,
  FileStack,
  GitMerge,
  Image,
  Link2,
  ListTree,
  ScanLine,
  ShieldAlert,
  Table2,
  TextCursorInput,
  TriangleAlert,
} from 'lucide-react';

function FigureHeader({ eyebrow, title, metric }: { eyebrow: string; title: string; metric: string }) {
  return (
    <figcaption className="grid gap-2 border-b border-border px-4 py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:px-5">
      <span className="font-mono text-xs font-black text-blue-700 dark:text-blue-300">{eyebrow}</span>
      <strong className="min-w-0 text-sm leading-snug">{title}</strong>
      <span className="w-fit rounded-sm border border-border px-2 py-1 font-mono text-xs font-bold text-muted-foreground">{metric}</span>
    </figcaption>
  );
}

function Segmented<T extends string>({ label, options, value, onChange }: {
  label: string;
  options: readonly { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="grid gap-1 rounded-md bg-muted/45 p-1" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }} role="group" aria-label={label}>
      {options.map((option) => (
        <button key={option.value} type="button" aria-pressed={option.value === value} onClick={() => onChange(option.value)} className={`min-h-11 min-w-0 rounded-sm px-2 text-xs font-bold leading-tight transition-colors ${option.value === value ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}>
          {option.label}
        </button>
      ))}
    </div>
  );
}

const fragments = [
  { id: 'p12', page: '12', kind: 'paragraph', label: '운영 비용은 전년보다', detail: '문장이 페이지 아래에서 끊김', icon: TextCursorInput },
  { id: 'p13', page: '13', kind: 'paragraph', label: '18% 감소했다.', detail: '다음 페이지 첫 문장 조각', icon: TextCursorInput },
  { id: 'p47', page: '47', kind: 'table', label: '지역 | Q1 | Q2 | Q3', detail: '마지막 행 다음 페이지로 계속', icon: Table2 },
  { id: 'p48', page: '48', kind: 'table', label: '서울 | 81 | 92 | 104', detail: 'header 없이 수치 행으로 시작', icon: Table2 },
  { id: 'p90', page: '90', kind: 'title', label: '3. 공급망 위험', detail: '페이지 끝에 제목만 존재', icon: TextCursorInput },
  { id: 'p91', page: '91', kind: 'paragraph', label: '올해의 핵심 위험은...', detail: '제목 없는 본문으로 시작', icon: TextCursorInput },
  { id: 'p112', page: '112', kind: 'figure', label: 'Figure 8 · 지도', detail: '페이지 아래에 그림', icon: Image },
  { id: 'p113', page: '113', kind: 'caption', label: '그림 8. 물류 거점', detail: '다음 페이지 상단 caption', icon: Image },
] as const;

const relations = [
  { from: 'p12', to: 'p13', label: 'paragraph continues', tone: 'blue' },
  { from: 'p47', to: 'p48', label: 'table continues', tone: 'blue' },
  { from: 'p90', to: 'p91', label: 'title contains', tone: 'emerald' },
  { from: 'p112', to: 'p113', label: 'caption describes', tone: 'violet' },
] as const;

export function PageToDocumentAssemblyLab() {
  const [mode, setMode] = useState<'pages' | 'assembled'>('pages');

  return (
    <figure data-document-assembly-lab data-mode={mode} className="foundation-viz-explorer not-prose my-8 min-w-0 scroll-mt-20 overflow-hidden rounded-md border border-border">
      <FigureHeader eyebrow="PAGE → DOCUMENT" title="보이는 글자를 다시 쓰지 않고, 페이지 사이 관계만 복원한다" metric={mode === 'pages' ? `${fragments.length} blocks · 0 links` : `${fragments.length} blocks · ${relations.length} links`} />
      <div className="border-b border-border p-4 sm:p-5">
        <Segmented label="문서 보기" options={[{ value: 'pages', label: '페이지별 결과' }, { value: 'assembled', label: '조립된 문서' }]} value={mode} onChange={setMode} />
      </div>

      <div className="grid min-w-0 gap-px bg-border lg:grid-cols-[minmax(0,1.25fr)_minmax(16rem,0.75fr)]">
        <div className="min-w-0 bg-background p-4 sm:p-5">
          <div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
            {fragments.map((fragment) => {
              const Icon = fragment.icon;
              return (
                <div key={fragment.id} className="min-w-0 rounded-md border border-border bg-background p-3">
                  <div className="flex items-center justify-between gap-2">
                    <Icon className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                    <span className="font-mono text-xs font-black text-muted-foreground">PAGE {fragment.page}</span>
                  </div>
                  <p className="mt-3 break-words text-xs font-bold leading-snug">{fragment.label}</p>
                  <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{fragment.detail}</p>
                  {mode === 'assembled' && (
                    <span className="mt-3 inline-flex items-center gap-1 border-l-2 border-blue-500 pl-2 text-xs font-bold text-blue-700 dark:text-blue-300">
                      <Link2 className="h-3 w-3" aria-hidden="true" /> relation 보존
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="min-w-0 bg-background p-4 sm:p-5">
          <div className="flex items-center gap-2"><ListTree className="h-4 w-4" aria-hidden="true" /><p className="text-xs font-black">Document tree</p></div>
          {mode === 'pages' ? (
            <div className="mt-4 border-l-2 border-amber-500 bg-amber-500/[0.05] p-3">
              <p className="text-xs font-bold text-amber-800 dark:text-amber-200">Tree를 만들 근거가 없다</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">페이지 순서만 이어 붙이면 표 header, title path와 caption 대상이 끊긴다.</p>
            </div>
          ) : (
            <div className="mt-4 space-y-3">
              {relations.map((relation, index) => (
                <div key={relation.label} className="grid grid-cols-[1.4rem_minmax(0,1fr)] gap-2">
                  <span className={`mt-0.5 grid h-6 w-6 place-items-center rounded-sm text-xs font-black ${relation.tone === 'blue' ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300' : relation.tone === 'emerald' ? 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300' : 'bg-violet-500/10 text-violet-700 dark:text-violet-300'}`}>{index + 1}</span>
                  <div className="min-w-0">
                    <p className="break-words font-mono text-xs font-bold">{relation.from} → {relation.to}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{relation.label}</p>
                  </div>
                </div>
              ))}
              <div className="border-t border-border pt-3 text-xs leading-relaxed text-muted-foreground">각 node는 원본 page·bbox·parser revision을 그대로 유지한다.</div>
            </div>
          )}
        </div>
      </div>
    </figure>
  );
}

type RelationKind = 'paragraph' | 'table' | 'title' | 'caption';

const relationFixtures = {
  paragraph: {
    label: '문단 이어짐', icon: TextCursorInput, decision: 'accept', score: 0.91, runnerUp: 0.32,
    evidence: [['페이지 인접', 0.98, '앞 page 마지막 → 다음 page 첫 block'], ['문장 연결', 0.94, '종결 부호 없이 문법적으로 이어짐'], ['Style 일치', 0.87, 'font·indent·column 폭 일치'], ['Type 계약', 1, 'paragraph ↔ paragraph']],
    reason: '높은 점수뿐 아니라 차순위 후보와의 margin도 충분하다.',
  },
  table: {
    label: '표 이어짐', icon: Table2, decision: 'review', score: 0.79, runnerUp: 0.72,
    evidence: [['페이지 인접', 0.98, '연속 page'], ['열 signature', 0.38, '4열/5열 parser가 서로 불일치'], ['Header 대응', 0.84, '숫자 type은 대체로 호환'], ['의미 유사도', 0.96, '같은 매출 용어']],
    reason: '의미는 비슷하지만 schema 충돌과 작은 margin 때문에 값을 합치지 않는다.',
  },
  title: {
    label: '제목 계층', icon: ListTree, decision: 'accept', score: 0.88, runnerUp: 0.41,
    evidence: [['번호 규칙', 0.95, '3 → 3.1 heading pattern'], ['Typography', 0.91, '크기·굵기 계층 일치'], ['위치 관계', 0.86, '본문 직전 heading'], ['의미 연속', 0.78, 'section topic 일치']],
    reason: '번호·style·위치가 서로 독립적으로 같은 parent를 지지한다.',
  },
  caption: {
    label: '그림·캡션', icon: Image, decision: 'reject', score: 0.44, runnerUp: 0.42,
    evidence: [['페이지 인접', 0.76, '다음 page 상단'], ['번호 대응', 0.15, 'Figure 8과 그림 9 불일치'], ['위치 관계', 0.62, '가까우나 page 경계'], ['의미 유사도', 0.71, '비슷한 지도 용어']],
    reason: '가깝고 비슷해 보여도 figure 번호가 충돌한다. 자동 연결하지 않는다.',
  },
} satisfies Record<RelationKind, { label: string; icon: typeof Table2; decision: 'accept' | 'review' | 'reject'; score: number; runnerUp: number; evidence: Array<[string, number, string]>; reason: string }>;

export function CrossPageRelationLab() {
  const [kind, setKind] = useState<RelationKind>('table');
  const fixture = relationFixtures[kind];
  const Icon = fixture.icon;
  const verdict = fixture.decision === 'accept' ? { label: '자동 연결', icon: CheckCircle2, tone: 'text-emerald-700 dark:text-emerald-300', border: 'border-emerald-500' } : fixture.decision === 'review' ? { label: '보류 · review', icon: ShieldAlert, tone: 'text-amber-700 dark:text-amber-300', border: 'border-amber-500' } : { label: '연결 거절', icon: TriangleAlert, tone: 'text-rose-700 dark:text-rose-300', border: 'border-rose-500' };
  const VerdictIcon = verdict.icon;

  return (
    <figure data-cross-page-relation data-relation={kind} data-decision={fixture.decision} className="foundation-viz-explorer not-prose my-8 min-w-0 scroll-mt-20 overflow-hidden rounded-md border border-border">
      <FigureHeader eyebrow="RELATION EVIDENCE" title="유사도 하나가 아니라 독립 evidence와 차순위 margin으로 연결을 결정한다" metric={`fixture score ${fixture.score.toFixed(2)}`} />
      <div className="border-b border-border p-4 sm:p-5">
        <Segmented label="관계 종류" options={(Object.keys(relationFixtures) as RelationKind[]).map((value) => ({ value, label: relationFixtures[value].label }))} value={kind} onChange={setKind} />
      </div>
      <div className="grid gap-px bg-border lg:grid-cols-[minmax(0,1.2fr)_minmax(15rem,0.8fr)]">
        <div className="min-w-0 bg-background p-4 sm:p-5">
          <div className="flex items-center gap-2"><Icon className="h-4 w-4" aria-hidden="true" /><p className="text-xs font-black">{fixture.label} evidence</p></div>
          <div className="mt-4 space-y-4">
            {fixture.evidence.map(([label, value, note]) => (
              <div key={label} className="min-w-0">
                <div className="flex items-baseline justify-between gap-3"><span className="text-xs font-bold">{label}</span><span className="font-mono text-xs text-muted-foreground">{value.toFixed(2)}</span></div>
                <div className="mt-1.5 h-1.5 overflow-hidden rounded-sm bg-muted"><div className={`h-full ${value < 0.5 ? 'bg-rose-500' : value < 0.8 ? 'bg-amber-500' : 'bg-blue-600'}`} style={{ width: `${value * 100}%` }} /></div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{note}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="min-w-0 bg-background p-4 sm:p-5">
          <p className="text-xs font-black text-muted-foreground">DECISION</p>
          <div className={`mt-3 border-l-2 ${verdict.border} pl-3`}>
            <div className="flex items-center gap-2"><VerdictIcon className={`h-4 w-4 ${verdict.tone}`} aria-hidden="true" /><strong className={`text-sm ${verdict.tone}`}>{verdict.label}</strong></div>
            <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{fixture.reason}</p>
          </div>
          <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border">
            <div className="bg-background p-3"><p className="text-xs text-muted-foreground">최상 후보</p><p className="mt-1 font-mono text-lg font-black">{fixture.score.toFixed(2)}</p></div>
            <div className="bg-background p-3"><p className="text-xs text-muted-foreground">차순위</p><p className="mt-1 font-mono text-lg font-black">{fixture.runnerUp.toFixed(2)}</p></div>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">편집용 fixture다. 표시한 channel 값에서 score를 다시 계산한 원논문 결과가 아니다. 예시 gate는 score ≥ 0.82, margin ≥ 0.12, critical evidence 충돌 없음이다.</p>
        </div>
      </div>
    </figure>
  );
}

type SyncCase = 'agreement' | 'conflict' | 'missing';

const syncFixtures = {
  agreement: { label: '일치', a: 'R-19: p90 title → p91 body', b: 'R-19: p90 title → p91 body', result: 'merge', note: '같은 relation ID와 endpoints가 반복되어 하나로 병합한다.' },
  conflict: { label: '충돌', a: 'R-42: p47 table → p48 table', b: 'R-42: p47 paragraph → p48 paragraph', result: 'review', note: '같은 경계의 relation type이 다르다. 더 자연스러운 문장을 고르지 않고 review에 보낸다.' },
  missing: { label: '겹침 없음', a: 'chunk A ends at p64', b: 'chunk B starts at p65', result: 'reject', note: '공통 block이 없어 chunk-local ID를 정렬할 수 없다. overlap을 늘려 다시 처리한다.' },
} as const;

export function OverlapSynchronizationLab() {
  const [scenario, setScenario] = useState<SyncCase>('conflict');
  const fixture = syncFixtures[scenario];
  const result = useMemo(() => fixture.result === 'merge' ? { label: '동기화 완료', icon: GitMerge, tone: 'text-emerald-700 dark:text-emerald-300' } : fixture.result === 'review' ? { label: '충돌 보류', icon: ShieldAlert, tone: 'text-amber-700 dark:text-amber-300' } : { label: '재처리 필요', icon: TriangleAlert, tone: 'text-rose-700 dark:text-rose-300' }, [fixture]);
  const ResultIcon = result.icon;

  return (
    <figure data-overlap-sync data-scenario={scenario} data-result={fixture.result} className="foundation-viz-explorer not-prose my-8 min-w-0 scroll-mt-20 overflow-hidden rounded-md border border-border">
      <FigureHeader eyebrow="LONG DOCUMENT SYNC" title="긴 문서는 겹쳐 읽고, 겹친 구간의 relation이 같은지 확인한 뒤 합친다" metric="C 32 · O 6" />
      <div className="border-b border-border p-4 sm:p-5">
        <Segmented label="동기화 상황" options={(Object.keys(syncFixtures) as SyncCase[]).map((value) => ({ value, label: syncFixtures[value].label }))} value={scenario} onChange={setScenario} />
      </div>
      <div className="grid gap-3 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] lg:items-center">
        <div className="min-w-0 rounded-md border border-border p-4">
          <div className="flex items-center justify-between gap-2"><span className="flex items-center gap-2 text-xs font-black"><Braces className="h-4 w-4" />Chunk A</span><code className="text-xs text-muted-foreground">p39–70</code></div>
          <p className="mt-4 break-words font-mono text-xs leading-relaxed">{fixture.a}</p>
          <div className="mt-3 h-2 overflow-hidden rounded-sm bg-muted"><div className="ml-[72%] h-full w-[18%] bg-violet-500" /></div>
        </div>
        <div className="flex items-center justify-center"><ScanLine className="h-5 w-5 rotate-90 text-violet-600 dark:text-violet-300 lg:rotate-0" aria-label="overlap 비교" /></div>
        <div className="min-w-0 rounded-md border border-border p-4">
          <div className="flex items-center justify-between gap-2"><span className="flex items-center gap-2 text-xs font-black"><Braces className="h-4 w-4" />Chunk B</span><code className="text-xs text-muted-foreground">p65–96</code></div>
          <p className="mt-4 break-words font-mono text-xs leading-relaxed">{fixture.b}</p>
          <div className="mt-3 h-2 overflow-hidden rounded-sm bg-muted"><div className="h-full w-[18%] bg-violet-500" /></div>
        </div>
      </div>
      <div className="grid gap-3 border-t border-border bg-muted/15 p-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:p-5">
        <span className="grid h-9 w-9 place-items-center rounded-md border border-border bg-background"><ResultIcon className={`h-4 w-4 ${result.tone}`} aria-hidden="true" /></span>
        <div className="min-w-0"><p className={`text-sm font-black ${result.tone}`}>{result.label}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{fixture.note}</p></div>
      </div>
    </figure>
  );
}

export function DocumentReleaseGate() {
  const gates = [
    ['Source coverage', '모든 node가 page·bbox·parser revision으로 역추적된다.', true],
    ['Critical relations', '표·제목·caption 충돌이 자동 승인 상태에 남지 않는다.', true],
    ['Retrieval answer', '질문 fixture의 값·heading path·citation page가 모두 맞는다.', false],
    ['Regression', 'parser·assembler 변경 전후 golden document diff를 승인했다.', true],
  ] as const;
  return (
    <div data-document-release-gate className="not-prose my-8 grid scroll-mt-20 gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
      {gates.map(([title, detail, pass], index) => (
        <div key={title} className="min-w-0 bg-background p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3"><span className="font-mono text-xs font-black text-muted-foreground">GATE 0{index + 1}</span>{pass ? <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-300" /> : <TriangleAlert className="h-4 w-4 text-rose-600 dark:text-rose-300" />}</div>
          <p className="mt-3 text-sm font-bold">{title}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{detail}</p>
          <p className={`mt-2 text-xs font-bold ${pass ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}`}>{pass ? '통과' : '실패 · release 차단'}</p>
        </div>
      ))}
    </div>
  );
}

export function TypedBlockStrip() {
  const schemas = [
    { value: 'heading', label: 'Heading', fields: 'level · typography · heading_path', example: 'block_id report:p90:h01 · confidence 0.96' },
    { value: 'paragraph', label: 'Paragraph', fields: 'text · language · continuation_hint', example: 'block_id report:p91:p01 · confidence 0.94' },
    { value: 'table', label: 'Table', fields: 'html · cells · column_signature', example: 'block_id report:p48:b03 · confidence 0.93' },
    { value: 'formula', label: 'Formula', fields: 'latex · display_mode · source_crop', example: 'block_id report:p73:f02 · confidence 0.91' },
  ] as const;
  const [kind, setKind] = useState<(typeof schemas)[number]['value']>('table');
  const schema = schemas.find((item) => item.value === kind) ?? schemas[0];
  return (
    <figure data-typed-block-strip className="foundation-viz-explorer not-prose my-8 scroll-mt-20 overflow-hidden rounded-md border border-border">
      <FigureHeader eyebrow="TYPED BLOCK IR" title="공통 provenance는 유지하고 block 종류별 구조만 바꾼다" metric={schema.label} />
      <div className="border-b border-border p-4 sm:p-5"><Segmented label="Block 종류" options={schemas.map(({ value, label }) => ({ value, label }))} value={kind} onChange={setKind} /></div>
      <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
        {[
          [FileStack, 'Identity', 'block_id · document_id'],
          [Braces, 'Content', 'text · html · latex'],
          [ScanLine, 'Source', 'page · bbox · order'],
          [ShieldAlert, 'Evidence', 'confidence · parser revision'],
        ].map(([Icon, label, body]) => {
          const Component = Icon as typeof FileStack;
          return <div key={String(label)} className="min-w-0 bg-background p-4"><Component className="h-4 w-4 text-muted-foreground" /><p className="mt-3 text-xs font-black">{String(label)}</p><p className="mt-1 break-words font-mono text-xs leading-relaxed text-muted-foreground">{String(body)}</p></div>;
        })}
      </div>
      <div className="grid gap-px border-t border-border bg-border sm:grid-cols-2">
        <div className="min-w-0 bg-background p-4"><p className="text-xs font-black text-muted-foreground">TYPE-SPECIFIC FIELDS</p><p className="mt-2 break-words font-mono text-xs leading-relaxed">{schema.fields}</p></div>
        <div className="min-w-0 bg-background p-4"><p className="text-xs font-black text-muted-foreground">EXAMPLE IDENTITY</p><p className="mt-2 break-words font-mono text-xs leading-relaxed">{schema.example}</p></div>
      </div>
    </figure>
  );
}
