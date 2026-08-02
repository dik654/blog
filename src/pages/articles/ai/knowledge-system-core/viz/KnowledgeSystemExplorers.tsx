import { useMemo, useState, type ReactNode } from 'react';
import {
  Braces,
  CheckCircle2,
  CircleDot,
  Clock3,
  Code2,
  FileText,
  Film,
  GitBranch,
  Layers3,
  Link2,
  ListFilter,
  Network,
  PackageCheck,
  ScanText,
  Search,
  ShieldCheck,
  Table2,
  Tags,
  TriangleAlert,
} from 'lucide-react';

function Figure({ eyebrow, title, children, footer, data }: { eyebrow: string; title: string; children: ReactNode; footer?: ReactNode; data: Record<string, string> }) {
  return (
    <figure {...data} className="foundation-viz-explorer not-prose my-8 min-w-0 overflow-hidden rounded-md border border-border bg-background">
      <figcaption className="border-b border-border px-4 py-4 sm:px-5">
        <p className="text-xs font-bold uppercase text-muted-foreground">{eyebrow}</p>
        <h3 className="mt-1 text-base font-bold leading-snug sm:text-lg">{title}</h3>
      </figcaption>
      {children}
      {footer && <div className="border-t border-border px-4 py-4 sm:px-5">{footer}</div>}
    </figure>
  );
}

function Segmented<T extends string>({ label, options, value, onChange }: { label: string; options: readonly { value: T; label: string }[]; value: T; onChange: (value: T) => void }) {
  return (
    <div className="min-w-0">
      <p className="mb-2 text-xs font-bold uppercase text-muted-foreground">{label}</p>
      <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border" style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}>
        {options.map((option) => (
          <button key={option.value} type="button" aria-pressed={option.value === value} onClick={() => onChange(option.value)} className={`min-h-11 min-w-0 bg-background px-2 text-xs font-bold leading-tight ${option.value === value ? 'shadow-[inset_0_-2px_0_0_currentColor]' : 'text-muted-foreground hover:bg-muted/35'}`}>
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Metric({ label, value, note, tone = 'normal' }: { label: string; value: string; note: string; tone?: 'normal' | 'good' | 'warn' }) {
  const color = tone === 'good' ? 'text-emerald-700 dark:text-emerald-300' : tone === 'warn' ? 'text-rose-700 dark:text-rose-300' : '';
  return <div className="min-w-0 bg-background p-3"><p className="text-xs font-bold uppercase text-muted-foreground">{label}</p><p className={`mt-1 break-words font-mono text-lg font-black ${color}`}>{value}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{note}</p></div>;
}

const contracts = {
  source: { label: 'Source', icon: FileText, input: 'URL · file · access policy', output: 'immutable raw + version envelope', failure: '무엇을 읽었는지 다시 재현할 수 없다', next: 'Source Ingestion' },
  structure: { label: 'Structure', icon: ScanText, input: 'page · frame · syntax tree', output: 'ordered blocks + source address', failure: '표·수식·caption 관계가 text에서 끊긴다', next: 'Structure Recovery' },
  meaning: { label: 'Meaning', icon: Braces, input: 'blocks · artifacts · relations', output: 'claim · scope · evidence lineage', failure: '인용은 있어도 어느 조건을 지지하는지 모른다', next: 'Knowledge IR' },
  retrieval: { label: 'Retrieval', icon: Search, input: 'question · tenant · time · budget', output: 'evidence context package', failure: 'Top-k가 질문의 모든 하위 근거를 덮지 못한다', next: 'RAG Pipeline' },
  maintenance: { label: 'Maintenance', icon: GitBranch, input: 'source events · revisions', output: 'promotion · impact · rebuild queue', failure: '새 글은 늘고 오래된 claim은 남는다', next: 'Research Watcher' },
} as const;

export function KnowledgeSystemContractExplorer() {
  const [mode, setMode] = useState<keyof typeof contracts>('structure');
  const active = contracts[mode];
  const Icon = active.icon;
  return (
    <Figure data={{ 'data-knowledge-contract': '' }} eyebrow="KNOWLEDGE SYSTEM CONTRACT LAB" title="한 번의 답은 다섯 계약을 통과해야 원문으로 돌아갈 수 있다" footer={<p className="text-xs font-semibold leading-relaxed">학습 순서는 source 하나를 정확히 처리한 뒤 Watcher로 올라간다. 실제 운영에서는 Watcher가 source event를 먼저 발견하고 ingestion queue에 넣을 수 있다.</p>}>
      <div className="grid grid-cols-2 gap-px border-b border-border bg-border lg:grid-cols-5">
        {(Object.keys(contracts) as Array<keyof typeof contracts>).map((key) => {
          const ItemIcon = contracts[key].icon;
          return <button key={key} type="button" aria-pressed={mode === key} onClick={() => setMode(key)} className={`min-h-20 min-w-0 bg-background p-3 text-left ${mode === key ? 'shadow-[inset_0_-3px_0_0_currentColor]' : 'text-muted-foreground'}`}><ItemIcon className="h-4 w-4" /><strong className="mt-2 block break-words text-xs">{contracts[key].label}</strong></button>;
        })}
      </div>
      <div className="grid min-w-0 gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_15rem]">
        <div className="grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
          <Metric label="input" value={active.input} note="이 단계가 받는 contract" />
          <Metric label="output" value={active.output} note="다음 단계가 소비하는 artifact" />
          <div className="min-w-0 bg-background p-4 sm:col-span-2"><p className="text-xs font-bold uppercase text-muted-foreground">이 계약이 빠졌을 때</p><p className="mt-2 text-sm font-bold leading-relaxed text-rose-700 dark:text-rose-300">{active.failure}</p></div>
        </div>
        <aside className="min-w-0 border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          <Icon className="h-5 w-5" />
          <p className="mt-3 text-xs font-bold uppercase text-muted-foreground">다음 읽을 글</p>
          <p className="mt-1 text-xl font-black leading-tight">{active.next}</p>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">모델 이름보다 손실된 객체를 먼저 찾는다. 같은 답 오류라도 source, structure, meaning, retrieval 중 수정할 층이 다르다.</p>
        </aside>
      </div>
    </Figure>
  );
}

const sourceModes = {
  pdf: { label: 'PDF', icon: FileText, native: 'glyph + page geometry', specialist: 'layout · OCR · table', address: 'p.41 · bbox · charspan', risk: '2단 reading order와 cross-page table' },
  video: { label: 'Video', icon: Film, native: 'audio + frame stream', specialist: 'ASR · slide OCR · shot', address: '00:31:24 · frame 47,102', risk: '말과 slide가 다른 시간에 바뀜' },
  repo: { label: 'Repository', icon: Code2, native: 'Git object + source files', specialist: 'parser · AST · symbol graph', address: 'commit · file · line · symbol', risk: 'default branch와 release commit drift' },
} as const;

export function IngestionStructureExplorer() {
  const [mode, setMode] = useState<keyof typeof sourceModes>('pdf');
  const [recoverStructure, setRecoverStructure] = useState(true);
  const active = sourceModes[mode];
  const Icon = active.icon;
  const recovered = recoverStructure ? (mode === 'pdf' ? 96 : mode === 'video' ? 91 : 99) : 63;
  return (
    <Figure data={{ 'data-ingestion-structure': '' }} eyebrow="SOURCE INGESTION LAB" title="Text만 뽑지 말고 다음 단계가 다시 찾을 주소까지 복구한다" footer={<p className="text-xs font-semibold leading-relaxed">Native parser를 먼저 쓰고 구조가 없는 page·frame에 specialist model을 붙인다. VLM fallback도 원문에 없는 문장을 생성하지 못하도록 address와 validator를 통과시킨다.</p>}>
      <div className="grid gap-4 border-b border-border bg-muted/15 p-4 sm:grid-cols-[minmax(0,1fr)_13rem] sm:items-end sm:p-5">
        <Segmented label="Source artifact" options={(Object.keys(sourceModes) as Array<keyof typeof sourceModes>).map((value) => ({ value, label: sourceModes[value].label }))} value={mode} onChange={setMode} />
        <button type="button" aria-pressed={recoverStructure} onClick={() => setRecoverStructure((value) => !value)} className={`min-h-11 rounded-md border px-3 text-xs font-bold ${recoverStructure ? 'border-emerald-600/40 bg-emerald-500/[0.07] text-emerald-800 dark:text-emerald-200' : 'border-rose-600/40 bg-rose-500/[0.07] text-rose-800 dark:text-rose-200'}`}>{recoverStructure ? 'Structure recovery on' : 'Text-only extraction'}</button>
      </div>
      <div className="grid min-w-0 gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_15rem]">
        <div className="min-w-0">
          <div className="grid gap-3 sm:grid-cols-3">
            {[
              ['01 · NATIVE', active.native, Icon],
              ['02 · SPECIALIST', recoverStructure ? active.specialist : 'skip', ScanText],
              ['03 · ADDRESS', recoverStructure ? active.address : 'plain text offset only', Tags],
            ].map(([label, value, StageIcon]) => {
              const SIcon = StageIcon as typeof Icon;
              return <div key={label as string} className="min-w-0 rounded-md border border-border p-4"><SIcon className="h-4 w-4" /><p className="mt-3 text-xs font-bold text-muted-foreground">{label as string}</p><p className="mt-2 break-words text-xs font-bold leading-relaxed">{value as string}</p></div>;
            })}
          </div>
          <div className="mt-3 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
            <Metric label="required structure" value={`${recovered}%`} note="illustrative fixture coverage" tone={recoverStructure ? 'good' : 'warn'} />
            <Metric label="stable address" value={recoverStructure ? 'yes' : 'no'} note="원문 위치 재탐색" tone={recoverStructure ? 'good' : 'warn'} />
            <Metric label="largest risk" value={active.risk} note="source-specific regression" />
          </div>
        </div>
        <aside className="min-w-0 border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          {recoverStructure ? <CheckCircle2 className="h-5 w-5 text-emerald-700" /> : <TriangleAlert className="h-5 w-5 text-rose-700" />}
          <p className="mt-3 text-sm font-bold">{recoverStructure ? '검색 가능한 구조' : '읽을 수 있지만 검증 불가'}</p>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{recoverStructure ? 'Block의 순서, 유형과 주소를 함께 넘겨 table row·formula·caption을 다시 묶을 수 있다.' : '문장은 남아도 행·열, 수식 적용 조건, caption 대상과 source 위치가 사라진다.'}</p>
        </aside>
      </div>
    </Figure>
  );
}

export function StructureRecoveryGate() {
  const [crossPage, setCrossPage] = useState(true);
  const [formulaScope, setFormulaScope] = useState(true);
  const [captionAnchor, setCaptionAnchor] = useState(true);
  const score = [crossPage, formulaScope, captionAnchor].filter(Boolean).length;
  const items = [
    { key: 'table', label: 'Cross-page table', detail: 'p.41 행과 p.42 continuation을 같은 grid로 연결', value: crossPage, set: setCrossPage, icon: Table2 },
    { key: 'formula', label: 'Formula + qualifier', detail: '식과 “T ≤ 80°C에서만” 조건을 같은 anchor group으로 보존', value: formulaScope, set: setFormulaScope, icon: Braces },
    { key: 'caption', label: 'Figure + caption', detail: '본문 Figure 7 참조를 실제 image와 caption으로 연결', value: captionAnchor, set: setCaptionAnchor, icon: Link2 },
  ];
  return (
    <Figure data={{ 'data-structure-gate': '' }} eyebrow="STRUCTURE RECOVERY GATE" title="문자 정확도와 관계 정확도는 다른 평가다" footer={<p className="text-xs font-semibold leading-relaxed">세 관계가 모두 살아 있어야 IR이 claim scope와 evidence pointer를 만들 수 있다. OCR character error rate만으로는 이 연결 손실을 찾지 못한다.</p>}>
      <div className="divide-y divide-border">
        {items.map((item) => {
          const Icon = item.icon;
          return <button key={item.key} type="button" aria-pressed={item.value} onClick={() => item.set(!item.value)} className="grid w-full min-w-0 gap-3 p-4 text-left hover:bg-muted/25 sm:grid-cols-[2.5rem_minmax(0,11rem)_minmax(0,1fr)_5rem] sm:items-center sm:px-5"><span className={`flex h-9 w-9 items-center justify-center rounded-md border ${item.value ? 'border-emerald-600/35 bg-emerald-500/[0.07]' : 'border-rose-600/35 bg-rose-500/[0.07]'}`}><Icon className="h-4 w-4" /></span><strong className="text-xs">{item.label}</strong><span className="text-xs leading-relaxed text-muted-foreground">{item.detail}</span><span className={`font-mono text-xs font-black ${item.value ? 'text-emerald-700' : 'text-rose-700'}`}>{item.value ? 'linked' : 'broken'}</span></button>;
        })}
      </div>
      <div className="grid gap-px border-t border-border bg-border sm:grid-cols-3">
        <Metric label="relations intact" value={`${score}/3`} note="structure fixture" tone={score === 3 ? 'good' : 'warn'} />
        <Metric label="text coverage" value="99.2%" note="관계 손실과 별개" />
        <Metric label="handoff" value={score === 3 ? 'IR ready' : 'review queue'} note="다음 단계 허용" tone={score === 3 ? 'good' : 'warn'} />
      </div>
    </Figure>
  );
}

const irViews = {
  document: { label: 'Document', focus: 'Manual rev 1.3', relation: 'wasRevisionOf rev 1.2', address: 'source hash + access policy' },
  claim: { label: 'Claim', focus: '허용 torque는 42 N·m', relation: 'qualifiedBy T ≤ 80°C', address: 'p.42 · row 8 · cells 2-4' },
  artifact: { label: 'Artifact', focus: 'controller implementation', relation: 'implements claim C-17', address: 'commit a91f · limit.rs:84' },
  transform: { label: 'Transform', focus: '한국어 technical review', relation: 'wasDerivedFrom C-17', address: 'run 7f2a · prompt v4' },
} as const;

export function KnowledgeIrLineageExplorer() {
  const [view, setView] = useState<keyof typeof irViews>('claim');
  const active = irViews[view];
  return (
    <Figure data={{ 'data-ir-lineage': '' }} eyebrow="KNOWLEDGE IR LAB" title="같은 문장을 저장하지 말고 무엇이 무엇에서 왔는지 저장한다" footer={<p className="text-xs font-semibold leading-relaxed">Source literal은 번역하지 않은 원문으로 보존하고, Concept label만 언어별로 둔다. Claim의 수치와 Scope가 분리되어야 식만 검색되는 오류를 막는다.</p>}>
      <div className="border-b border-border bg-muted/15 p-4 sm:p-5">
        <Segmented label="Inspect object" options={(Object.keys(irViews) as Array<keyof typeof irViews>).map((value) => ({ value, label: irViews[value].label }))} value={view} onChange={setView} />
      </div>
      <div className="grid min-w-0 gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_15rem]">
        <div className="min-w-0">
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_2.5rem_minmax(0,1fr)] sm:items-center">
            <div className="rounded-md border border-border p-4"><p className="text-xs font-bold uppercase text-muted-foreground">selected object</p><p className="mt-2 text-sm font-black leading-relaxed">{active.focus}</p><p className="mt-4 break-words font-mono text-xs text-muted-foreground">{active.address}</p></div>
            <Link2 className="mx-auto h-5 w-5 rotate-90 text-muted-foreground sm:rotate-0" />
            <div className="rounded-md border border-violet-600/30 bg-violet-500/[0.045] p-4"><p className="text-xs font-bold uppercase text-muted-foreground">typed relation</p><p className="mt-2 text-sm font-black leading-relaxed">{active.relation}</p><p className="mt-4 text-xs leading-relaxed text-muted-foreground">relation type과 target id가 validator를 통과한다.</p></div>
          </div>
          <div className="mt-3 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-4">
            {['Source span', 'Block / Artifact', 'Claim + Scope', 'Rendered answer'].map((label, index) => <div key={label} className={`min-h-20 bg-background p-3 ${index <= (view === 'document' ? 0 : view === 'artifact' ? 1 : view === 'claim' ? 2 : 3) ? '' : 'opacity-40'}`}><span className="font-mono text-xs font-black text-muted-foreground">0{index + 1}</span><p className="mt-2 text-xs font-bold leading-relaxed">{label}</p></div>)}
          </div>
        </div>
        <aside className="min-w-0 border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          <Network className="h-5 w-5" />
          <p className="mt-3 text-sm font-bold">Build-time lineage</p>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">이 graph는 index를 만들 때 형성된다. 실제 질문에서 어떤 후보가 검색되고 prompt에 들어갔는지는 별도의 runtime trace다.</p>
        </aside>
      </div>
    </Figure>
  );
}

export function RevisionImpactExplorer() {
  const [revision, setRevision] = useState<'v12' | 'v13'>('v13');
  const corrected = revision === 'v13';
  const nodes = [
    { label: 'source span S-41', state: corrected ? 'changed' : 'current' },
    { label: 'claim C-17', state: corrected ? 'rebuild' : 'valid' },
    { label: 'retrieval chunk K-9', state: corrected ? 'reindex' : 'valid' },
    { label: 'article A-3', state: corrected ? 'review' : 'published' },
    { label: 'unrelated claim C-22', state: 'valid' },
  ];
  return (
    <Figure data={{ 'data-revision-impact': '' }} eyebrow="REVISION IMPACT LAB" title="새 version을 저장하는 일과 낡은 claim을 무효화하는 일은 다르다" footer={<p className="text-xs font-semibold leading-relaxed">Watcher가 revision event를 발견하고, ingestion이 immutable DocumentVersion을 만들며, IR이 changed span에서 도달 가능한 claim·index·article만 rebuild queue에 넣는다.</p>}>
      <div className="border-b border-border bg-muted/15 p-4 sm:p-5"><Segmented label="Manual version" options={[{ value: 'v12', label: 'rev 1.2' }, { value: 'v13', label: 'rev 1.3 corrected' }]} value={revision} onChange={setRevision} /></div>
      <div className="grid gap-px bg-border sm:grid-cols-5">
        {nodes.map((node) => {
          const affected = ['changed', 'rebuild', 'reindex', 'review'].includes(node.state);
          return <div key={node.label} className="min-w-0 bg-background p-4"><span className={`flex h-8 w-8 items-center justify-center rounded-full border ${affected ? 'border-rose-600/35 bg-rose-500/[0.07]' : 'border-emerald-600/35 bg-emerald-500/[0.07]'}`}>{affected ? <TriangleAlert className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}</span><p className="mt-3 break-words text-xs font-bold leading-relaxed">{node.label}</p><p className={`mt-2 font-mono text-xs font-black ${affected ? 'text-rose-700' : 'text-emerald-700'}`}>{node.state}</p></div>;
        })}
      </div>
    </Figure>
  );
}

const retrievalModes = {
  sparse: { label: 'Sparse', match: 'TS-999 · exact id', score: 'BM25 11.8', strength: '제품명·코드·희귀 용어', miss: '의역된 증상 설명' },
  dense: { label: 'Dense', match: '과열 시 torque 제한', score: 'cos 0.82', strength: '동의어·의미 유사성', miss: '정확한 revision id' },
  late: { label: 'Late interaction', match: 'temperature ↔ 80°C · torque ↔ limit', score: 'MaxSim 7.4', strength: 'query token별 세밀한 대응', miss: 'index storage·latency budget' },
  hybrid: { label: 'Hybrid', match: 'exact id + semantic + rerank', score: 'RRF 0.057', strength: '서로 다른 recall 보완', miss: '잘못된 후보를 많이 넣는 비용' },
} as const;

export function RetrievalStrategyExplorer() {
  const [mode, setMode] = useState<keyof typeof retrievalModes>('hybrid');
  const active = retrievalModes[mode];
  return (
    <Figure data={{ 'data-retrieval-strategy': '' }} eyebrow="RETRIEVAL LAB" title="한 점수로 검색하지 않고 서로 다른 실패를 가진 신호를 결합한다" footer={<p className="text-xs font-semibold leading-relaxed">Fusion은 서로 다른 score scale을 단순히 더하지 않고 rank를 결합할 수 있다. Reranker는 좁은 candidate set에서 query와 evidence를 함께 읽어 precision을 높인다.</p>}>
      <div className="border-b border-border bg-muted/15 p-4 sm:p-5"><Segmented label="Retriever" options={(Object.keys(retrievalModes) as Array<keyof typeof retrievalModes>).map((value) => ({ value, label: retrievalModes[value].label }))} value={mode} onChange={setMode} /></div>
      <div className="grid min-w-0 gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_15rem]">
        <div className="min-w-0">
          <div className="rounded-md border border-border p-4"><p className="text-xs font-bold uppercase text-muted-foreground">query</p><p className="mt-2 text-sm font-black leading-relaxed">“TS-999은 80°C에서 torque를 얼마로 제한하나?”</p></div>
          <div className="mt-3 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
            <Metric label="best match" value={active.match} note="선택 mode가 본 신호" />
            <Metric label="example score" value={active.score} note="다른 score와 직접 비교 금지" />
            <Metric label="strength" value={active.strength} note="recall ownership" tone="good" />
          </div>
        </div>
        <aside className="min-w-0 border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0"><ListFilter className="h-5 w-5" /><p className="mt-3 text-sm font-bold">남는 실패</p><p className="mt-3 text-xs leading-relaxed text-muted-foreground">{active.miss}</p></aside>
      </div>
    </Figure>
  );
}

type EvidenceKey = 'table' | 'formula' | 'code' | 'duplicate';
const evidence = {
  table: { label: 'Table row', tokens: 240, need: 'torque value', icon: Table2 },
  formula: { label: 'Formula + scope', tokens: 330, need: 'validity condition', icon: Braces },
  code: { label: 'Release code', tokens: 420, need: 'implementation version', icon: Code2 },
  duplicate: { label: 'Repeated summary', tokens: 310, need: 'no new evidence', icon: Layers3 },
} as const;

export function ContextPackingExplorer() {
  const [dependency, setDependency] = useState(72);
  const [budget, setBudget] = useState(900);
  const [includeDuplicate, setIncludeDuplicate] = useState(false);
  const route = dependency >= 65 ? 'structure-preserving / full context' : 'decompose + retrieve';
  const required: EvidenceKey[] = ['table', 'formula', 'code'];
  const ordered: EvidenceKey[] = includeDuplicate ? ['table', 'duplicate', 'formula', 'code'] : required;
  let used = 0;
  const selected = ordered.filter((key) => {
    if (used + evidence[key].tokens > budget) return false;
    used += evidence[key].tokens;
    return true;
  });
  const coverage = required.filter((key) => selected.includes(key)).length;
  const release = coverage === 3;
  return (
    <Figure data={{ 'data-context-packing': '' }} eyebrow="CONTEXT PACKING LAB" title="Top-k 순서가 아니라 질문을 증명할 evidence set을 budget 안에 조립한다" footer={<p className="text-xs font-semibold leading-relaxed">Dependency score는 routing signal이지 truth score가 아니다. 실제 시스템은 document type과 golden queries에서 full-context와 decomposition을 함께 평가해 threshold를 정한다.</p>}>
      <div className="grid gap-4 border-b border-border bg-muted/15 p-4 sm:grid-cols-3 sm:p-5">
        <label className="text-xs font-semibold text-muted-foreground">Context dependency · {dependency}%<input aria-label="context dependency" type="range" min="10" max="90" step="5" value={dependency} onChange={(event) => setDependency(Number(event.target.value))} className="mt-3 block w-full accent-blue-700" /></label>
        <label className="text-xs font-semibold text-muted-foreground">Token budget · {budget}<input aria-label="context token budget" type="range" min="500" max="1400" step="100" value={budget} onChange={(event) => setBudget(Number(event.target.value))} className="mt-3 block w-full accent-blue-700" /></label>
        <button type="button" aria-pressed={includeDuplicate} onClick={() => setIncludeDuplicate((value) => !value)} className={`min-h-10 rounded-md border px-3 text-xs font-bold ${includeDuplicate ? 'border-rose-600/40 bg-rose-500/[0.07]' : 'border-border bg-background'}`}>{includeDuplicate ? 'Repeated summary included' : 'No redundant context'}</button>
      </div>
      <div className="grid min-w-0 gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_15rem]">
        <div className="min-w-0">
          <div className="grid gap-2 sm:grid-cols-2">
            {ordered.map((key) => {
              const item = evidence[key]; const Icon = item.icon; const included = selected.includes(key);
              return <div key={key} className={`min-w-0 rounded-md border p-3 ${included ? 'border-emerald-600/30 bg-emerald-500/[0.045]' : 'border-border opacity-50'}`}><div className="flex items-center justify-between gap-2"><Icon className="h-4 w-4" /><span className="font-mono text-xs font-black">{item.tokens} tok</span></div><p className="mt-3 text-xs font-bold">{item.label}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.need}</p></div>;
            })}
          </div>
          <div className="mt-3 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
            <Metric label="routing" value={route} note="dependency-aware choice" />
            <Metric label="evidence coverage" value={`${coverage}/3`} note={`${used}/${budget} tokens`} tone={release ? 'good' : 'warn'} />
            <Metric label="runtime gate" value={release ? 'answer' : 'abstain'} note="세 claim 모두 source span 필요" tone={release ? 'good' : 'warn'} />
          </div>
        </div>
        <aside className="min-w-0 border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">{release ? <PackageCheck className="h-5 w-5 text-emerald-700" /> : <TriangleAlert className="h-5 w-5 text-rose-700" />}<p className="mt-3 text-sm font-bold">{release ? '검증 가능한 package' : '근거가 빠진 답'}</p><p className="mt-3 text-xs leading-relaxed text-muted-foreground">{release ? '표 값, 수식 조건, code version이 각 source id와 함께 들어간다.' : '더 높은 retrieval score가 있어도 질문의 필수 하위 claim 하나가 빠지면 답을 보류한다.'}</p></aside>
      </div>
    </Figure>
  );
}

export function RagReleaseGate() {
  const [recall, setRecall] = useState(92);
  const [support, setSupport] = useState(96);
  const [freshness, setFreshness] = useState(100);
  const [latency, setLatency] = useState(780);
  const release = recall >= 90 && support >= 95 && freshness === 100 && latency <= 900;
  const checks = useMemo(() => [
    { label: 'Recall@20', value: `${recall}%`, pass: recall >= 90 },
    { label: 'Claim support', value: `${support}%`, pass: support >= 95 },
    { label: 'Current source', value: `${freshness}%`, pass: freshness === 100 },
    { label: 'p95 latency', value: `${latency} ms`, pass: latency <= 900 },
  ], [freshness, latency, recall, support]);
  return (
    <Figure data={{ 'data-rag-release': '' }} eyebrow="RAG RELEASE GATE" title="최종 정답률 하나가 아니라 실패 층과 운영 예산을 함께 막는다" footer={<p className="text-xs font-semibold leading-relaxed">Threshold는 예시다. 실제 값은 risk tier와 golden set에서 정한다. LLM judge는 넓은 탐색에 쓰고 배포 차단은 사람이 검토한 fixture와 실행 가능한 규칙에 묶는다.</p>}>
      <div className="grid gap-4 border-b border-border bg-muted/15 p-4 sm:grid-cols-2 sm:p-5 lg:grid-cols-4">
        <label className="text-xs font-semibold text-muted-foreground">Recall@20 · {recall}%<input aria-label="retrieval recall" type="range" min="70" max="100" value={recall} onChange={(event) => setRecall(Number(event.target.value))} className="mt-3 block w-full accent-blue-700" /></label>
        <label className="text-xs font-semibold text-muted-foreground">Claim support · {support}%<input aria-label="claim support" type="range" min="80" max="100" value={support} onChange={(event) => setSupport(Number(event.target.value))} className="mt-3 block w-full accent-blue-700" /></label>
        <label className="text-xs font-semibold text-muted-foreground">Current source · {freshness}%<input aria-label="source freshness" type="range" min="80" max="100" value={freshness} onChange={(event) => setFreshness(Number(event.target.value))} className="mt-3 block w-full accent-blue-700" /></label>
        <label className="text-xs font-semibold text-muted-foreground">p95 latency · {latency} ms<input aria-label="rag p95 latency" type="range" min="400" max="1400" step="20" value={latency} onChange={(event) => setLatency(Number(event.target.value))} className="mt-3 block w-full accent-blue-700" /></label>
      </div>
      <div className="grid gap-px bg-border sm:grid-cols-4">
        {checks.map((check) => <div key={check.label} className="min-w-0 bg-background p-4">{check.pass ? <CheckCircle2 className="h-4 w-4 text-emerald-700" /> : <CircleDot className="h-4 w-4 text-rose-700" />}<p className="mt-3 text-xs font-bold uppercase text-muted-foreground">{check.label}</p><p className={`mt-1 font-mono text-lg font-black ${check.pass ? 'text-emerald-700' : 'text-rose-700'}`}>{check.value}</p></div>)}
      </div>
      <div className={`border-t border-border p-5 ${release ? 'bg-emerald-500/[0.045]' : 'bg-rose-500/[0.045]'}`}><div className="flex items-start gap-3">{release ? <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" /> : <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-rose-700" />}<div><p className="text-sm font-black">{release ? 'release' : 'hold and localize'}</p><p className="mt-1 text-xs leading-relaxed text-muted-foreground">{release ? '검색·근거·freshness·latency contract가 같은 versioned run에서 통과했다.' : '실패한 층 하나만 바꾸고 같은 query·corpus·model snapshot으로 다시 실행한다.'}</p></div></div></div>
    </Figure>
  );
}

const ragDocuments = [
  { id: 'z1', label: '문서 A', weight: 0.58, fact: 'A Farewell to Arms · 1929' },
  { id: 'z2', label: '문서 B', weight: 0.31, fact: 'The Sun Also Rises · 1926' },
  { id: 'z3', label: '문서 C', weight: 0.11, fact: '관련 없는 작가 소개' },
] as const;

export function RagLatentDocumentLab() {
  const [mode, setMode] = useState<'sequence' | 'token'>('sequence');
  const [step, setStep] = useState(0);
  const tokens = ['이', '작가는', '두', '소설을', '썼다'];
  const active = mode === 'sequence'
    ? ragDocuments
    : ragDocuments.map((document, index) => ({
      ...document,
      weight: step < 2
        ? [0.58, 0.31, 0.11][index]
        : step < 4
          ? [0.20, 0.72, 0.08][index]
          : [0.42, 0.44, 0.14][index],
    }));
  return (
    <Figure
      data={{ 'data-rag-latent-document': '' }}
      eyebrow="RAG 2020 · LATENT DOCUMENT LAB"
      title="검색 문서 하나를 정답으로 고르지 않고, 여러 문서가 만든 생성 확률을 합친다"
      footer={<p className="text-xs font-semibold leading-relaxed">막대는 논문의 확률 결합을 설명하기 위한 작은 예시다. 논문 실험의 실제 posterior 값이 아니다.</p>}
    >
      <div className="grid gap-4 border-b border-border bg-muted/15 p-4 sm:grid-cols-[minmax(0,1fr)_15rem] sm:items-end sm:p-5">
        <Segmented
          label="Marginalization unit"
          options={[{ value: 'sequence', label: 'RAG-Sequence' }, { value: 'token', label: 'RAG-Token' }]}
          value={mode}
          onChange={setMode}
        />
        <label className={`text-xs font-semibold text-muted-foreground ${mode === 'sequence' ? 'opacity-40' : ''}`}>
          생성 위치 · {step + 1}/{tokens.length}
          <input
            aria-label="RAG 생성 token 위치"
            type="range"
            min="0"
            max={tokens.length - 1}
            value={step}
            disabled={mode === 'sequence'}
            onChange={(event) => setStep(Number(event.target.value))}
            className="mt-3 block w-full accent-blue-700"
          />
        </label>
      </div>
      <div className="grid min-w-0 gap-5 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_15rem]">
        <div className="min-w-0 space-y-3">
          {active.map((document) => (
            <div key={document.id} className="grid min-w-0 gap-2 sm:grid-cols-[5rem_minmax(0,1fr)_4rem] sm:items-center">
              <p className="text-xs font-bold">{document.label}</p>
              <div className="min-w-0">
                <div className="h-2 overflow-hidden rounded-sm bg-muted">
                  <div className="h-full bg-blue-600 transition-[width] duration-300" style={{ width: `${document.weight * 100}%` }} />
                </div>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{document.fact}</p>
              </div>
              <p className="font-mono text-sm font-black tabular-nums">{document.weight.toFixed(2)}</p>
            </div>
          ))}
        </div>
        <aside className="min-w-0 border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-5 lg:pt-0">
          <Search className="h-5 w-5" />
          <p className="mt-3 text-sm font-bold">{mode === 'sequence' ? '문서 하나를 전체 답에 유지' : `“${tokens[step]}”에서 다시 결합`}</p>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            {mode === 'sequence'
              ? '각 문서로 답 전체의 확률을 계산한 뒤 retriever 확률로 가중합한다.'
              : '각 token 위치마다 문서별 다음-token 확률을 다시 합하므로 생성 중 근거 비중이 달라질 수 있다.'}
          </p>
        </aside>
      </div>
    </Figure>
  );
}

type DependencyKind = '정보' | '지시어' | '논리' | '독립';

type DependencyRow = {
  current: number;
  dependencies: readonly {
    from: number;
    kind: DependencyKind;
    reason: string;
  }[];
};

const dependencyScenarios = {
  dense: {
    label: '연속 안전 문서',
    note: '정의, 적용 조건, 지시 대상과 결론이 여러 chunk를 건너 이어진다.',
    chunks: [
      { marker: '정의', text: '모터의 연속 허용 토크는 42 N·m다.' },
      { marker: '적용 조건', text: '단, 이 값은 권선 온도 80°C 이하에서만 유효하다.' },
      { marker: '지시 대상', text: '그 한계를 넘으면 표 7의 derating curve를 적용한다.' },
      { marker: '계산 전제', text: '따라서 controller는 현재 온도와 표 7을 함께 읽는다.' },
      { marker: '중간 결론', text: '그 결과 이번 조건의 허용 토크는 31 N·m로 낮아진다.' },
      { marker: '최종 행동', text: '이 제한을 actuator command에 반영해야 한다.' },
    ],
    rows: [
      {
        current: 3,
        dependencies: [
          { from: 2, kind: '논리', reason: '“따라서”가 앞의 derating 규칙을 전제로 한다.' },
          { from: 1, kind: '정보', reason: '온도 80°C라는 적용 조건이 계산 범위를 정한다.' },
          { from: 0, kind: '정보', reason: '42 N·m가 무엇의 한계인지 정의가 필요하다.' },
        ],
      },
      {
        current: 4,
        dependencies: [
          { from: 3, kind: '논리', reason: 'controller 계산 결과를 받아 결론을 낸다.' },
          { from: 2, kind: '정보', reason: '표 7의 derating 규칙이 31 N·m를 만든다.' },
          { from: 1, kind: '정보', reason: '80°C 적용 조건이 빠지면 수치의 scope가 사라진다.' },
        ],
      },
      {
        current: 5,
        dependencies: [
          { from: 4, kind: '지시어', reason: '“이 제한”은 바로 앞의 31 N·m를 가리킨다.' },
          { from: 3, kind: '논리', reason: '계산값을 command에 반영한다는 실행 순서를 잇는다.' },
          { from: 2, kind: '독립', reason: 'c6 자체 해석에는 표 이름보다 확정된 제한값이 직접 필요하다.' },
        ],
      },
    ] satisfies readonly DependencyRow[],
  },
  sparse: {
    label: '독립 사양 묶음',
    note: '서로 다른 장비 사양이 모여 있어 대부분의 chunk가 단독으로 해석된다.',
    chunks: [
      { marker: 'GPU A', text: 'GPU A의 HBM 용량은 80GB다.' },
      { marker: 'Switch B', text: 'Switch B의 link 속도는 400GbE다.' },
      { marker: 'Rack C', text: 'Rack C의 최대 전력은 42kW다.' },
      { marker: 'GPU D', text: 'GPU D는 FP8 연산을 지원한다.' },
      { marker: 'Switch B', text: '이 switch는 64개의 physical port를 제공한다.' },
      { marker: 'Rack F', text: 'Rack F는 direct liquid cooling을 사용한다.' },
    ],
    rows: [
      {
        current: 3,
        dependencies: [
          { from: 2, kind: '독립', reason: 'GPU D의 FP8 지원은 Rack C 전력과 무관하다.' },
          { from: 1, kind: '독립', reason: 'GPU D와 Switch B는 서로 다른 항목이다.' },
          { from: 0, kind: '독립', reason: 'GPU A의 메모리가 GPU D 기능을 정의하지 않는다.' },
        ],
      },
      {
        current: 4,
        dependencies: [
          { from: 3, kind: '독립', reason: '바로 앞 GPU D가 “이 switch”의 지시 대상은 아니다.' },
          { from: 2, kind: '독립', reason: 'Rack C도 지시 대상이 아니다.' },
          { from: 1, kind: '지시어', reason: '“이 switch”가 세 칸 앞의 Switch B를 가리킨다.' },
        ],
      },
      {
        current: 5,
        dependencies: [
          { from: 4, kind: '독립', reason: 'Rack F 냉각과 Switch B port 수는 별도 사양이다.' },
          { from: 3, kind: '독립', reason: 'GPU D 기능은 Rack F 냉각을 설명하지 않는다.' },
          { from: 2, kind: '독립', reason: '서로 다른 rack의 사양이다.' },
        ],
      },
    ] satisfies readonly DependencyRow[],
  },
} as const;

export function ContextDependencyRoutingLab() {
  const [scenario, setScenario] = useState<keyof typeof dependencyScenarios>('dense');
  const [threshold, setThreshold] = useState(0.5);
  const [selectedRow, setSelectedRow] = useState(0);
  const active = dependencyScenarios[scenario];
  const rows: readonly DependencyRow[] = active.rows;
  const row = rows[selectedRow] ?? rows[0];
  const dependentCount = rows.reduce(
    (sum, item) => sum + item.dependencies.filter((dependency) => dependency.kind !== '독립').length,
    0,
  );
  const score = dependentCount / (rows.length * 3);
  const chunkScore = row.dependencies.filter((dependency) => dependency.kind !== '독립').length / 3;
  const route = score < threshold ? '분해형 방법' : 'Full-Context';
  const relatedSources = new Set(
    row.dependencies
      .filter((dependency) => dependency.kind !== '독립')
      .map((dependency) => dependency.from),
  );

  const chooseScenario = (next: keyof typeof dependencyScenarios) => {
    setScenario(next);
    setSelectedRow(0);
  };

  return (
    <Figure
      data={{ 'data-context-dependency-routing': '' }}
      eyebrow="CODAR 2026 · ROUTING LAB"
      title="문장을 실제로 짝지어 보며 어떤 관계가 분해에서 끊기는지 찾는다"
      footer={<p className="text-xs font-semibold leading-relaxed">화면의 문장은 계산 구조를 설명하기 위한 안전 매뉴얼·사양 fixture다. 원문 실험은 512-word chunk, 앞의 세 chunk와 GPT-4o-mini evaluator를 사용했다.</p>}
    >
      <div className="grid gap-5 border-b border-border bg-muted/15 p-4 sm:grid-cols-[minmax(0,1fr)_15rem] sm:items-end sm:p-5">
        <Segmented
          label="Document shape"
          options={(Object.keys(dependencyScenarios) as Array<keyof typeof dependencyScenarios>).map((value) => ({ value, label: dependencyScenarios[value].label }))}
          value={scenario}
          onChange={chooseScenario}
        />
        <label className="text-xs font-semibold leading-relaxed text-muted-foreground">
          Routing threshold τ · {threshold.toFixed(2)}
          <input
            aria-label="CoDaR routing threshold"
            type="range"
            min="0.2"
            max="0.95"
            step="0.05"
            value={threshold}
            onChange={(event) => setThreshold(Number(event.target.value))}
            className="mt-3 block h-11 w-full accent-blue-700"
          />
        </label>
      </div>
      <div className="grid min-w-0 gap-6 p-4 sm:p-5 lg:grid-cols-[minmax(0,1fr)_minmax(18rem,0.9fr)]">
        <div className="min-w-0">
          <div className="flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase text-muted-foreground">순서가 있는 document</p>
              <p className="mt-1 text-sm font-bold leading-relaxed">{active.note}</p>
            </div>
            <span className="shrink-0 font-mono text-xs font-black text-muted-foreground">N=6 · k=3</span>
          </div>
          <div className="relative mt-4 space-y-2 before:absolute before:bottom-5 before:left-[1.06rem] before:top-5 before:w-px before:bg-border">
            {active.chunks.map((chunk, index) => {
              const current = index === row.current;
              const source = relatedSources.has(index);
              return (
                <article
                  key={`${scenario}-chunk-${index}`}
                  data-active-chunk={current ? `c${index + 1}` : undefined}
                  className={`relative grid min-w-0 grid-cols-[2.15rem_minmax(0,1fr)] items-start gap-3 rounded-md border p-3 ${
                    current
                      ? 'border-foreground bg-foreground/[0.035]'
                      : source
                        ? 'border-blue-600/35 bg-blue-500/[0.045]'
                        : 'border-border bg-background'
                  }`}
                >
                  <span className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full border bg-background font-mono text-xs font-black ${
                    current ? 'border-foreground' : source ? 'border-blue-600/50 text-blue-700 dark:text-blue-300' : 'border-border text-muted-foreground'
                  }`}>c{index + 1}</span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <p className="text-xs font-bold text-muted-foreground">{chunk.marker}</p>
                      {current && <span className="rounded-sm bg-foreground px-1.5 py-0.5 text-xs font-bold text-background">현재 판정</span>}
                      {source && !current && <span className="text-xs font-bold text-blue-700 dark:text-blue-300">앞 문맥</span>}
                    </div>
                    <p className="mt-1 break-words text-sm font-semibold leading-relaxed">{chunk.text}</p>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
        <div className="min-w-0 border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <p className="text-xs font-bold uppercase text-muted-foreground">평가할 현재 chunk</p>
          <div className="mt-3 grid grid-cols-3 gap-px overflow-hidden rounded-md border border-border bg-border">
            {rows.map((item, index) => (
              <button
                key={item.current}
                type="button"
                aria-pressed={selectedRow === index}
                onClick={() => setSelectedRow(index)}
                className={`min-h-11 bg-background px-2 text-xs font-black ${selectedRow === index ? 'shadow-[inset_0_-2px_0_0_currentColor]' : 'text-muted-foreground'}`}
              >
                c{item.current + 1}
              </button>
            ))}
          </div>

          <div className="mt-4 space-y-2">
            {row.dependencies.map((dependency) => {
              const dependent = dependency.kind !== '독립';
              return (
                <article
                  key={`${row.current}-${dependency.from}`}
                  data-dependency-kind={dependency.kind}
                  className={`min-w-0 rounded-md border p-3 ${dependent ? 'border-blue-600/35 bg-blue-500/[0.045]' : 'border-border bg-background'}`}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-mono text-xs font-black">c{row.current + 1} ← c{dependency.from + 1}</p>
                    <span className={`text-xs font-black ${dependent ? 'text-blue-700 dark:text-blue-300' : 'text-muted-foreground'}`}>
                      {dependency.kind}
                    </span>
                  </div>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{dependency.reason}</p>
                </article>
              );
            })}
          </div>

          <div className="mt-4 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <Metric label={`S(c${row.current + 1})`} value={chunkScore.toFixed(2)} note="현재 chunk의 앞 3개 관계 평균" />
            <Metric label="DCDS" value={score.toFixed(2)} note="c4·c5·c6 score의 평균" />
          </div>
        </div>
      </div>
      <div className="grid gap-px border-t border-border bg-border sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1.25fr)]">
        <Metric label="threshold" value={threshold.toFixed(2)} note="작은 validation set에서 선택" />
        <Metric label="route" value={route} note={score < threshold ? '약한 의존: 검색·압축 후보' : '강한 의존: 구조를 보존'} tone={score < threshold ? 'good' : 'warn'} />
        <div className="min-w-0 bg-background p-3">
          <Network className="h-5 w-5" />
          <p data-context-route className="mt-2 text-sm font-black">{route}</p>
          <p data-context-score className="mt-1 text-xs leading-relaxed text-muted-foreground">
            DCDS {score.toFixed(2)} {score < threshold ? '<' : '≥'} τ {threshold.toFixed(2)}. 정답 확률이 아니라 관계 보존 경로를 고르는 신호다.
          </p>
        </div>
      </div>
    </Figure>
  );
}
