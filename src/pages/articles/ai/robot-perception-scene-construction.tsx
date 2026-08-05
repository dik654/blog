import { useMemo, useState } from 'react';
import { Check, CircleX, EyeOff, Layers3, RefreshCw, ShieldAlert } from 'lucide-react';
import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import {
  BeginnerOpening,
  CapabilityCheck,
  ConceptPrimer,
  InternalLink,
  LearningHandoff,
  Misconception,
  QuestionLead,
  SourceNotes,
} from '@/components/learning/ArticleLearning';
import { MetricGrid, NlpSection, SegmentedControl, Takeaway } from './nlp-shared';

const raw = String.raw;
const clamp = (value: number, low: number, high: number) => Math.min(high, Math.max(low, value));
const logistic = (logOdds: number) => 1 / (1 + Math.exp(-logOdds));

function VizFrame({
  eyebrow,
  title,
  status,
  danger = false,
  children,
}: {
  eyebrow: string;
  title: string;
  status: string;
  danger?: boolean;
  children: React.ReactNode;
}) {
  return (
    <figure className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border bg-background">
      <figcaption className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-border px-4 py-4 !pr-24">
        <span className="font-mono text-xs font-black text-blue-700 dark:text-blue-300">{eyebrow}</span>
        <strong className="basis-full text-sm leading-snug sm:min-w-60 sm:flex-1 sm:basis-60">{title}</strong>
        <span className={`basis-full text-xs font-black sm:basis-auto ${danger ? 'text-red-700 dark:text-red-300' : 'text-emerald-700 dark:text-emerald-300'}`}>{status}</span>
      </figcaption>
      {children}
    </figure>
  );
}

type ObservationMode = 'box' | 'semantic' | 'instance' | 'metric';

function ObservationContractLab() {
  const [mode, setMode] = useState<ObservationMode>('box');
  const capabilities = {
    box: [true, false, false, false],
    semantic: [true, true, false, false],
    instance: [true, true, true, false],
    metric: [true, true, true, true],
  }[mode];
  const labels = ['종류', 'pixel support', '개체 분리', 'metric geometry'];
  const accepted = capabilities.every(Boolean);
  return (
    <VizFrame eyebrow="OBSERVATION CONTRACT" title="모델 출력이 보존한 정보만 다음 단계에서 사용할 수 있다" status={accepted ? '3D 관측 후보' : 'PlanningScene 직접 입력 금지'} danger={!accepted}>
      <div className="border-b border-border bg-blue-500/[0.025] p-4">
        <SegmentedControl label="model output" options={[
          { value: 'box', label: 'Box' },
          { value: 'semantic', label: 'Semantic mask' },
          { value: 'instance', label: 'Instance mask' },
          { value: 'metric', label: 'Mask + depth' },
        ]} value={mode} onChange={setMode} />
      </div>
      <div className="grid gap-5 p-4 sm:p-6 md:grid-cols-[1.15fr_.85fr]">
        <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-border bg-slate-950">
          <div className="absolute inset-x-0 bottom-0 h-[38%] bg-slate-800" />
          <div className="absolute left-[18%] top-[25%] h-[38%] w-[29%] rounded-[46%] bg-red-400/90" />
          <div className="absolute left-[43%] top-[32%] h-[34%] w-[27%] rounded-[46%] bg-red-500/85" />
          {mode === 'box' && <div className="absolute left-[14%] top-[20%] h-[51%] w-[60%] border-2 border-amber-300"><span className="bg-amber-300 px-1 text-[10px] font-black text-black">mug .93</span></div>}
          {mode === 'semantic' && <div className="absolute left-[14%] top-[20%] h-[51%] w-[60%] rounded-[42%] bg-blue-400/35 ring-2 ring-blue-300"><span className="absolute left-1 top-1 text-[10px] font-bold text-white">mug pixels</span></div>}
          {(mode === 'instance' || mode === 'metric') && <>
            <div className="absolute left-[17%] top-[24%] h-[40%] w-[31%] rounded-[46%] ring-2 ring-cyan-300"><span className="absolute -top-5 text-[10px] font-bold text-cyan-200">mug #17</span></div>
            <div className="absolute left-[42%] top-[31%] h-[36%] w-[29%] rounded-[46%] ring-2 ring-violet-300"><span className="absolute -top-5 right-0 text-[10px] font-bold text-violet-200">mug #42</span></div>
          </>}
          {mode === 'metric' && <div className="absolute inset-0 bg-[radial-gradient(circle_at_35%_45%,rgba(16,185,129,.48)_0_1px,transparent_2px)] bg-[length:13px_13px]" />}
        </div>
        <div className="flex flex-col justify-center gap-2">
          {labels.map((label, index) => <div key={label} className="flex items-center justify-between border-b border-border py-2 text-xs"><span className="font-semibold">{label}</span>{capabilities[index] ? <Check className="h-4 w-4 text-emerald-600" /> : <CircleX className="h-4 w-4 text-red-600" />}</div>)}
          <p className="pt-2 text-xs leading-relaxed text-muted-foreground">Confidence는 관측의 model score다. 영속 ID, 정확한 3D shape, 미래 위치 또는 collision 안전성을 자동으로 의미하지 않는다.</p>
        </div>
      </div>
    </VizFrame>
  );
}

function DepthSupportLab() {
  const [validDepth, setValidDepth] = useState(78);
  const [edgeTrim, setEdgeTrim] = useState(1);
  const [selfFilter, setSelfFilter] = useState(true);
  const total = 96;
  const invalid = Math.round(total * (100 - validDepth) / 100);
  const boundary = edgeTrim * 8;
  const robot = selfFilter ? 0 : 13;
  const support = Math.max(0, total - invalid - boundary - robot);
  const contamination = Math.round((boundary * 0.7 + robot) / Math.max(1, support + boundary + robot) * 100);
  const accepted = support >= 35 && contamination <= 15;
  const points = useMemo(() => Array.from({ length: total }, (_, index) => ({
    x: 34 + (index % 12) * 22,
    y: 32 + Math.floor(index / 12) * 20,
    boundary: index % 12 < edgeTrim || index % 12 >= 12 - edgeTrim || Math.floor(index / 12) < edgeTrim || Math.floor(index / 12) >= 8 - edgeTrim,
    invalid: index % Math.max(2, Math.round(100 / Math.max(1, 100 - validDepth))) === 0,
    robot: index % 11 === 0,
  })), [edgeTrim, validDepth]);
  return (
    <VizFrame eyebrow="MASK × DEPTH SUPPORT" title="Box center 하나가 아니라 유효한 내부 pixel들의 3D 지지 집합을 만든다" status={accepted ? `${support} points · geometry 채택` : `${support} points · 재관측 필요`} danger={!accepted}>
      <div className="grid gap-4 border-b border-border bg-violet-500/[0.025] p-4 md:grid-cols-3">
        <label className="text-xs font-semibold text-muted-foreground">valid depth · {validDepth}%<input className="mt-3 block w-full accent-violet-700" type="range" min="35" max="98" value={validDepth} onChange={(event) => setValidDepth(Number(event.target.value))} /></label>
        <label className="text-xs font-semibold text-muted-foreground">mask erosion · {edgeTrim}px<input className="mt-3 block w-full accent-blue-700" type="range" min="0" max="2" value={edgeTrim} onChange={(event) => setEdgeTrim(Number(event.target.value))} /></label>
        <label className="flex min-h-11 cursor-pointer items-center gap-2 text-xs font-semibold"><input type="checkbox" checked={selfFilter} onChange={(event) => setSelfFilter(event.target.checked)} /> robot self-filter</label>
      </div>
      <div className="p-4 sm:p-6">
        <svg viewBox="0 0 330 210" className="mx-auto block h-auto w-full max-w-xl" role="img" aria-label="instance mask 내부 valid depth, boundary, robot self points 시각화">
          <rect x="22" y="18" width="280" height="172" rx="5" fill="#2563eb" fillOpacity="0.025" stroke="currentColor" strokeOpacity="0.15" />
          {points.map((point, index) => {
            const removed = point.invalid || point.boundary || (selfFilter && point.robot);
            const fill = point.invalid ? '#94a3b8' : point.robot ? '#d97706' : point.boundary ? '#e11d48' : '#059669';
            return <circle key={index} cx={point.x} cy={point.y} r={removed ? 2.4 : 3.6} fill={fill} opacity={removed ? 0.28 : 0.9} />;
          })}
          <path d="M 272 20 C 245 72 245 135 294 186" fill="none" stroke="#d97706" strokeWidth="8" strokeLinecap="round" opacity="0.34" />
        </svg>
        <p className="mt-2 text-xs leading-relaxed text-muted-foreground"><span className="font-semibold text-emerald-700">초록</span> retained support · <span className="font-semibold text-red-700">빨강</span> mixed boundary · <span className="font-semibold text-amber-700">주황</span> robot self · 회색 invalid depth</p>
        <MetricGrid mobileColumns={2} items={[
          { label: 'retained support', value: `${support} / ${total}`, accent: accepted },
          { label: 'contamination', value: `${contamination}%`, accent: contamination > 15 },
          { label: 'shape center', value: support ? 'robust median' : '없음', note: 'single pixel 아님' },
          { label: 'decision', value: accepted ? 'accept' : 'reobserve', accent: !accepted },
        ]} />
      </div>
    </VizFrame>
  );
}

type AssociationMode = 'nearest' | 'gated';

function AssociationLab() {
  const [mode, setMode] = useState<AssociationMode>('nearest');
  const [crossing, setCrossing] = useState(64);
  const separation = Math.abs(crossing - 50) * 0.8;
  const ambiguous = separation < 18;
  const idSwitches = mode === 'nearest' && ambiguous ? 2 : 0;
  const ax = 48 + crossing * 2.25;
  const bx = 278 - crossing * 2.25;
  const progress = crossing / 100;
  const desktopA = { x: 70 + progress * 560, y: 55 + progress * 135 };
  const desktopB = { x: 630 - progress * 560, y: 190 - progress * 135 };
  return (
    <VizFrame eyebrow="PREDICT → GATE → ASSIGN" title="가까운 detection부터 붙이면 교차 순간에 object identity가 바뀐다" status={idSwitches ? `${idSwitches} ID switches` : 'identity 유지'} danger={idSwitches > 0}>
      <div className="flex flex-wrap items-end gap-4 border-b border-border bg-amber-500/[0.025] p-4">
        <SegmentedControl label="association" options={[{ value: 'nearest', label: '최근접만' }, { value: 'gated', label: '예측 + gate' }]} value={mode} onChange={setMode} />
        <label className="min-w-56 flex-1 text-xs font-semibold text-muted-foreground">crossing time · {crossing}<input className="mt-3 block w-full accent-amber-700" type="range" min="8" max="92" value={crossing} onChange={(event) => setCrossing(Number(event.target.value))} /></label>
      </div>
      <div className="p-4 sm:p-6">
        <svg viewBox="0 0 330 200" className="block h-auto w-full sm:hidden" role="img" aria-label="두 객체가 교차할 때 예측과 gate를 사용하는 association">
          <path d="M 42 54 C 120 54 208 146 288 146" fill="none" stroke="#2563eb" strokeWidth="2" strokeDasharray="5 5" opacity="0.5" />
          <path d="M 42 146 C 120 146 208 54 288 54" fill="none" stroke="#e11d48" strokeWidth="2" strokeDasharray="5 5" opacity="0.5" />
          {mode === 'gated' && <><ellipse cx={ax} cy={54 + crossing * .92} rx="30" ry="18" fill="#2563eb" fillOpacity="0.08" stroke="#2563eb" strokeOpacity="0.42" /><ellipse cx={bx} cy={146 - crossing * .92} rx="30" ry="18" fill="#e11d48" fillOpacity="0.08" stroke="#e11d48" strokeOpacity="0.42" /></>}
          <circle cx={ax} cy={54 + crossing * .92} r="9" fill="#2563eb" stroke="white" strokeWidth="3" />
          <circle cx={bx} cy={146 - crossing * .92} r="9" fill="#e11d48" stroke="white" strokeWidth="3" />
          <text x="18" y="28" fontSize="11" fontWeight="800" fill="currentColor">track A · right/down</text>
          <text x="18" y="190" fontSize="11" fontWeight="800" fill="currentColor">track B · left/up</text>
        </svg>
        <svg viewBox="0 0 700 240" className="hidden h-auto w-full sm:block" role="img" aria-label="넓은 화면에서 두 객체가 교차할 때의 association trajectory">
          <path d="M 70 55 C 240 55 455 190 630 190" fill="none" stroke="#2563eb" strokeWidth="2.2" strokeDasharray="6 6" opacity="0.52" />
          <path d="M 70 190 C 240 190 455 55 630 55" fill="none" stroke="#e11d48" strokeWidth="2.2" strokeDasharray="6 6" opacity="0.52" />
          {mode === 'gated' && <><ellipse cx={desktopA.x} cy={desktopA.y} rx="38" ry="22" fill="#2563eb" fillOpacity="0.08" stroke="#2563eb" strokeOpacity="0.42" /><ellipse cx={desktopB.x} cy={desktopB.y} rx="38" ry="22" fill="#e11d48" fillOpacity="0.08" stroke="#e11d48" strokeOpacity="0.42" /></>}
          <circle cx={desktopA.x} cy={desktopA.y} r="10" fill="#2563eb" stroke="white" strokeWidth="3" />
          <circle cx={desktopB.x} cy={desktopB.y} r="10" fill="#e11d48" stroke="white" strokeWidth="3" />
          <text x="42" y="28" fontSize="12" fontWeight="800" fill="currentColor">track A · right/down</text>
          <text x="510" y="225" fontSize="12" fontWeight="800" fill="currentColor">track B · left/up</text>
        </svg>
        <MetricGrid mobileColumns={2} items={[
          { label: 'prediction', value: mode === 'gated' ? 'velocity + covariance' : '없음' },
          { label: 'one-to-one', value: mode === 'gated' ? 'Hungarian' : 'greedy' },
          { label: 'ambiguity', value: ambiguous ? '높음' : '낮음', accent: ambiguous },
          { label: 'ID switches', value: String(idSwitches), accent: idSwitches > 0 },
        ]} />
      </div>
    </VizFrame>
  );
}

type TrackPolicy = 'single' | 'two-stage';

function TrackLifecycleLab() {
  const [policy, setPolicy] = useState<TrackPolicy>('single');
  const [misses, setMisses] = useState(1);
  const scores = [0.92, 0.88, 0.34, 0, 0.27, 0.81];
  const survives = policy === 'two-stage' ? misses <= 3 : misses === 0;
  const states = ['tentative', 'confirmed', 'occluded', survives ? 'occluded' : 'deleted', survives ? 'confirmed' : 'new ID', survives ? 'confirmed' : 'confirmed'];
  return (
    <VizFrame eyebrow="TRACK LIFECYCLE" title="낮은 score를 새 객체로 만들지 않고 기존 track의 occlusion 증거로만 쓴다" status={survives ? 'ID #17 유지' : 'track 파편화'} danger={!survives}>
      <div className="flex flex-wrap items-end gap-4 border-b border-border bg-rose-500/[0.025] p-4">
        <SegmentedControl label="confidence policy" options={[{ value: 'single', label: '단일 threshold' }, { value: 'two-stage', label: '2단계 association' }]} value={policy} onChange={setPolicy} />
        <label className="min-w-48 flex-1 text-xs font-semibold text-muted-foreground">allowed misses · {misses}<input className="mt-3 block w-full accent-rose-700" type="range" min="0" max="4" value={misses} onChange={(event) => setMisses(Number(event.target.value))} /></label>
      </div>
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
          {scores.map((score, index) => <div key={index} className="min-w-0 border-t-2 p-2 text-center" style={{ borderColor: score >= .5 ? '#059669' : score > 0 ? '#d97706' : '#94a3b8' }}>
            <div className="font-mono text-xs font-black">t{index + 1}</div>
            <div className="mt-2 text-lg font-black">{score ? score.toFixed(2) : 'miss'}</div>
            <div className="mt-1 text-[10px] font-semibold text-muted-foreground">{states[index]}</div>
          </div>)}
        </div>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">1차 단계는 high-score detections와 모든 tracks를 연관한다. 2차 단계는 남은 confirmed tracks에만 low-score observations를 제한해 붙이며, unmatched low-score box로 새 track을 만들지 않는다.</p>
      </div>
    </VizFrame>
  );
}

type SceneQuery = 'inspect' | 'surface' | 'collision' | 'semantic';

function RepresentationLab() {
  const [query, setQuery] = useState<SceneQuery>('collision');
  const selected = {
    inspect: ['Point cloud', '관측 sample과 raw residual', 'free/unknown 없음'],
    surface: ['TSDF', '연속 surface와 normal', '동적 identity 없음'],
    collision: ['Occupancy', 'free·occupied·unknown', 'semantic identity 약함'],
    semantic: ['Object tracks', 'ID·pose·velocity·class', 'unknown obstacle 누락'],
  }[query];
  return (
    <VizFrame eyebrow="REPRESENTATION = QUERY" title="Point cloud·TSDF·occupancy·object track은 서로 다른 질문을 보존한다" status={`${selected[0]} 선택`}>
      <div className="border-b border-border bg-emerald-500/[0.025] p-4">
        <SegmentedControl label="planner query" options={[
          { value: 'inspect', label: '관측 디버깅' }, { value: 'surface', label: '표면 재구성' }, { value: 'collision', label: '충돌 여부' }, { value: 'semantic', label: '물체 조작' },
        ]} value={query} onChange={setQuery} />
      </div>
      <div className="grid gap-px bg-border sm:grid-cols-4">
        {['Point cloud', 'TSDF', 'Occupancy', 'Object tracks'].map((label) => <div key={label} className={`min-h-32 bg-background p-4 ${label === selected[0] ? 'ring-2 ring-inset ring-emerald-600' : ''}`}>
          <Layers3 className={`h-5 w-5 ${label === selected[0] ? 'text-emerald-600' : 'text-muted-foreground'}`} />
          <div className="mt-4 text-sm font-black">{label}</div>
          <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{label === selected[0] ? selected[1] : '다른 query를 위한 정보 구조'}</p>
        </div>)}
      </div>
      <div className="border-t border-border px-4 py-3 text-xs text-muted-foreground"><strong className="text-foreground">선택의 손실:</strong> {selected[2]}. Production scene은 보통 여러 표현을 함께 유지하고 source stamp와 provenance로 연결한다.</div>
    </VizFrame>
  );
}

type RayMode = 'endpoint' | 'ray';

function RayUpdateLab() {
  const [mode, setMode] = useState<RayMode>('endpoint');
  const [endpoint, setEndpoint] = useState(8);
  const cells = Array.from({ length: 12 }, (_, index) => index);
  const pathClear = mode === 'ray';
  return (
    <VizFrame eyebrow="INVERSE SENSOR MODEL" title="Range는 endpoint의 occupied뿐 아니라 그 앞을 통과한 free evidence도 제공한다" status={pathClear ? '경로 관측 free' : '경로 unknown'} danger={!pathClear}>
      <div className="flex flex-wrap items-end gap-4 border-b border-border bg-cyan-500/[0.025] p-4">
        <SegmentedControl label="map update" options={[{ value: 'endpoint', label: 'Endpoint만' }, { value: 'ray', label: 'Ray + endpoint' }]} value={mode} onChange={setMode} />
        <label className="min-w-48 flex-1 text-xs font-semibold text-muted-foreground">range cell · {endpoint}<input className="mt-3 block w-full accent-cyan-700" type="range" min="4" max="10" value={endpoint} onChange={(event) => setEndpoint(Number(event.target.value))} /></label>
      </div>
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-12 gap-1" aria-label="sensor ray voxel states">
          {cells.map((cell) => {
            const occupied = cell === endpoint;
            const free = mode === 'ray' && cell > 0 && cell < endpoint;
            return <div key={cell} className={`flex aspect-square items-center justify-center rounded-[2px] border text-[9px] font-black ${occupied ? 'border-red-600 bg-red-500/25 text-red-800 dark:text-red-200' : free ? 'border-emerald-600 bg-emerald-500/15 text-emerald-800 dark:text-emerald-200' : cell === 0 ? 'border-blue-600 bg-blue-500/15 text-blue-800 dark:text-blue-200' : 'border-border bg-muted/25 text-muted-foreground'}`}>{cell === 0 ? 'S' : occupied ? 'O' : free ? 'F' : '?'}</div>;
          })}
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {[['F', 'free', 'ray가 실제로 지나감'], ['O', 'occupied', 'valid range endpoint'], ['?', 'unknown', '아직 관측하지 않음']].map(([mark, label, note]) => <div key={mark} className="border-l-2 border-border pl-3"><strong className="text-xs">{label}</strong><p className="mt-1 text-xs text-muted-foreground">{note}</p></div>)}
        </div>
        <MetricGrid mobileColumns={2} items={[
          { label: 'cleared cells', value: String(mode === 'ray' ? endpoint - 1 : 0), accent: mode === 'ray' },
          { label: 'occupied cells', value: '1' },
          { label: 'unknown cells', value: String(mode === 'ray' ? 11 - endpoint : 10), accent: mode === 'endpoint' },
          { label: 'straight path', value: pathClear ? '검사 가능' : '증거 부족', accent: !pathClear },
        ]} />
      </div>
    </VizFrame>
  );
}

function EvidenceLab() {
  const [hits, setHits] = useState(4);
  const [misses, setMisses] = useState(3);
  const [clampMax, setClampMax] = useState(3.5);
  const [coarse, setCoarse] = useState(false);
  const rawOdds = hits * .85 - misses * .4;
  const bounded = clamp(rawOdds, -2, clampMax);
  const probability = logistic(bounded);
  const flips = Math.ceil((bounded + .01) / .4);
  return (
    <VizFrame eyebrow="BOUNDED LOG-ODDS" title="반복 증거는 더하지만 clamp로 과거가 영원히 지도를 잠그지 못하게 한다" status={`${(probability * 100).toFixed(1)}% ${probability >= .5 ? 'occupied' : 'free'}`} danger={coarse && probability >= .5}>
      <div className="grid gap-4 border-b border-border bg-indigo-500/[0.025] p-4 sm:grid-cols-2">
        <label className="text-xs font-semibold text-muted-foreground">occupied hits · {hits}<input className="mt-3 block w-full accent-red-700" type="range" min="0" max="8" value={hits} onChange={(event) => setHits(Number(event.target.value))} /></label>
        <label className="text-xs font-semibold text-muted-foreground">free rays · {misses}<input className="mt-3 block w-full accent-emerald-700" type="range" min="0" max="10" value={misses} onChange={(event) => setMisses(Number(event.target.value))} /></label>
        <label className="text-xs font-semibold text-muted-foreground">upper clamp · {clampMax.toFixed(1)}<input className="mt-3 block w-full accent-indigo-700" type="range" min="1" max="5" step=".5" value={clampMax} onChange={(event) => setClampMax(Number(event.target.value))} /></label>
        <label className="flex min-h-11 cursor-pointer items-center gap-2 text-xs font-semibold"><input type="checkbox" checked={coarse} onChange={(event) => setCoarse(event.target.checked)} /> coarse collision query</label>
      </div>
      <div className="p-4 sm:p-6">
        <div className="relative h-6 overflow-hidden rounded-sm bg-gradient-to-r from-emerald-500/20 via-muted to-red-500/20 ring-1 ring-inset ring-border">
          <div className="absolute inset-y-0 w-1 bg-foreground transition-all" style={{ left: `${clamp(probability * 100, 1, 99)}%` }} />
          <span className="absolute left-2 top-1 text-[10px] font-black">free</span><span className="absolute right-2 top-1 text-[10px] font-black">occupied</span>
        </div>
        {coarse && <div className="mt-4 grid grid-cols-4 gap-1"><div className="aspect-square bg-red-500/25 ring-1 ring-red-500" /><div className="aspect-square bg-muted/30 ring-1 ring-border" /><div className="aspect-square bg-muted/30 ring-1 ring-border" /><div className="aspect-square bg-muted/30 ring-1 ring-border" /><div className="col-span-4 border border-red-500/50 bg-red-500/10 p-2 text-center text-xs font-bold">부모 node는 max child occupancy로 보수적 충돌</div></div>}
        <MetricGrid mobileColumns={2} items={[
          { label: 'raw log odds', value: rawOdds.toFixed(2) },
          { label: 'clamped', value: bounded.toFixed(2), accent: bounded !== rawOdds },
          { label: 'probability', value: `${(probability * 100).toFixed(1)}%` },
          { label: 'free rays to flip', value: String(Math.max(0, flips)), note: '현재 설정의 근사' },
        ]} />
      </div>
    </VizFrame>
  );
}

type LayerMode = 'monolithic' | 'delete' | 'layered';

function LayeredSceneLab() {
  const [mode, setMode] = useState<LayerMode>('monolithic');
  const [moved, setMoved] = useState(true);
  const [missed, setMissed] = useState(true);
  const ghost = mode === 'monolithic' && moved;
  const unsafeDelete = mode === 'delete' && missed;
  const safe = mode === 'layered';
  return (
    <VizFrame eyebrow="STATIC + DYNAMIC LAYERS" title="움직이는 물체를 static map에 태우면 과거 위치가 ghost obstacle로 남는다" status={safe ? '현재 물체 + 정적 공간 분리' : ghost ? 'ghost obstacle' : '가림 중 장애물 삭제'} danger={!safe}>
      <div className="flex flex-wrap gap-4 border-b border-border bg-fuchsia-500/[0.025] p-4">
        <SegmentedControl label="scene policy" options={[{ value: 'monolithic', label: '모두 fuse' }, { value: 'delete', label: 'miss 즉시 삭제' }, { value: 'layered', label: '정적 + track' }]} value={mode} onChange={setMode} />
        <label className="flex min-h-11 cursor-pointer items-center gap-2 text-xs font-semibold"><input type="checkbox" checked={moved} onChange={(event) => setMoved(event.target.checked)} /> mug 이동</label>
        <label className="flex min-h-11 cursor-pointer items-center gap-2 text-xs font-semibold"><input type="checkbox" checked={missed} onChange={(event) => setMissed(event.target.checked)} /> 1 frame miss</label>
      </div>
      <div className="p-4 sm:p-6">
        <div className="relative mx-auto h-44 max-w-2xl overflow-hidden rounded-sm border border-border bg-[linear-gradient(to_right,rgba(100,116,139,.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(100,116,139,.12)_1px,transparent_1px)] bg-[size:32px_32px]">
          <div className="absolute bottom-6 left-5 right-5 h-3 rounded-sm bg-slate-500/30" />
          {(!moved || ghost) && <div className={`absolute bottom-9 left-[25%] h-14 w-10 rounded-t-lg ${ghost ? 'border-2 border-dashed border-red-500 bg-red-500/10' : 'bg-blue-500/75'}`} />}
          {moved && !(unsafeDelete && missed) && <div className="absolute bottom-9 left-[68%] h-14 w-10 rounded-t-lg bg-blue-500/75 ring-2 ring-blue-600"><span className="absolute -top-6 -left-3 whitespace-nowrap text-[10px] font-black text-blue-700">track #17</span></div>}
          {missed && mode === 'layered' && <div className="absolute bottom-7 left-[64%] h-20 w-20 rounded-full border border-dashed border-amber-500 bg-amber-500/5" />}
        </div>
        <MetricGrid mobileColumns={2} items={[
          { label: 'old position', value: ghost ? 'occupied' : 'free/cleared', accent: ghost },
          { label: 'current object', value: unsafeDelete ? '누락' : 'track #17', accent: unsafeDelete },
          { label: 'occlusion', value: mode === 'layered' ? 'covariance 증가' : '정책 없음' },
          { label: 'planner risk', value: safe ? '보수적 추적' : ghost ? 'false block' : 'collision', accent: !safe },
        ]} />
      </div>
    </VizFrame>
  );
}

function SceneVersionLab() {
  const [changed, setChanged] = useState(true);
  const [revalidate, setRevalidate] = useState(false);
  const planVersion = 41;
  const currentVersion = changed ? 42 : 41;
  const execute = currentVersion === planVersion || revalidate;
  return (
    <VizFrame eyebrow="ATOMIC SCENE SNAPSHOT" title="계획한 장면 version과 실행 직전 장면이 다르면 암묵적으로 계속 실행하지 않는다" status={execute ? (changed ? '재검증 후 실행' : 'version 일치') : '실행 중지 · 재계획'} danger={!execute}>
      <div className="flex flex-wrap gap-4 border-b border-border bg-orange-500/[0.025] p-4">
        <label className="flex min-h-11 cursor-pointer items-center gap-2 text-xs font-semibold"><input type="checkbox" checked={changed} onChange={(event) => setChanged(event.target.checked)} /> planning 뒤 world update</label>
        <label className="flex min-h-11 cursor-pointer items-center gap-2 text-xs font-semibold"><input type="checkbox" checked={revalidate} onChange={(event) => setRevalidate(event.target.checked)} /> 새 version에서 path 재검증</label>
      </div>
      <div className="p-4 sm:p-6">
        <div className="grid gap-2 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-stretch">
          {[
            ['SNAPSHOT', `scene v${planVersion}`, 'robot + octomap + objects'],
            ['PLAN', `against v${planVersion}`, 'path와 source stamps 기록'],
            ['EXECUTE GATE', `current v${currentVersion}`, execute ? '통과' : 'version invalidated'],
          ].map(([label, value, note], index) => <div className="contents" key={label}><div className={`min-w-0 border p-4 ${index === 2 && !execute ? 'border-red-500 bg-red-500/5' : 'border-border bg-muted/10'}`}><span className="font-mono text-[10px] font-black text-muted-foreground">{label}</span><div className="mt-3 text-lg font-black">{value}</div><p className="mt-2 text-xs text-muted-foreground">{note}</p></div>{index < 2 && <div className="flex items-center justify-center py-1 text-muted-foreground sm:px-1">→</div>}</div>)}
        </div>
        <div className="mt-5 grid gap-px overflow-hidden rounded-sm border border-border bg-border sm:grid-cols-4">
          {[
            ['TF/source stamp', true], ['world + attached', true], ['covariance padding', true], ['version gate', execute],
          ].map(([label, valid]) => <div key={String(label)} className="flex items-center gap-2 bg-background p-3 text-xs font-semibold">{valid ? <Check className="h-4 w-4 shrink-0 text-emerald-600" /> : <CircleX className="h-4 w-4 shrink-0 text-red-600" />}<span>{label}</span></div>)}
        </div>
      </div>
    </VizFrame>
  );
}

export default function RobotPerceptionSceneConstructionArticle() {
  return (
    <>
      <BeginnerOpening
        title="사진 속 네모를 로봇이 피할 실제 물체로 바꾸기"
        description="카메라는 컵이 보인 한순간의 색과 거리 일부만 알려 줍니다. 로봇이 안전하게 움직이려면 컵이 지금 어디에 있는지, 그 앞 공간이 비었는지, 조금 전의 컵과 같은 물체인지까지 시간에 따라 이어 붙여야 합니다."
        familiarScene={<>휴대폰 사진에서 얼굴 둘레에 네모가 생겼다고 해도 그 사람이 카메라에서 몇 m 떨어졌는지, 다음 순간 어디로 움직였는지까지 알 수는 없습니다. 로봇의 물체 인식도 먼저 <strong>보인 것</strong>과 <strong>실제로 존재한다고 누적한 것</strong>을 나눠 읽어야 합니다.</>}
        steps={[
          { label: '무엇이 보였는지 나눈다', detail: '네모, 물체별 윤곽과 거리값이 각각 어디까지 알려 주는지 구분합니다.' },
          { label: '로봇 기준의 위치로 옮긴다', detail: '촬영한 시각과 카메라 자세를 붙여 유효한 점들만 3차원 공간에 놓습니다.' },
          { label: '시간에 따라 세계를 갱신한다', detail: '같은 물체의 움직임과 빈 공간의 증거를 이어 붙여 한 시점의 안전한 장면으로 묶습니다.' },
        ]}
      />
      <QuestionLead
        question="Detector가 mug를 0.93 confidence로 찾았고 RGB-D depth도 있다면 planner에 obstacle 하나를 바로 넣어도 될까?"
        answer="아니다. Score와 box는 한 frame의 관측일 뿐이다. Instance support에서 유효 depth를 모으고 robot self-points를 제거한 뒤, 기존 track과 시간·불확실성에 맞게 연관하고, free·occupied·unknown 증거와 동적 lifecycle을 분리해 하나의 versioned PlanningScene snapshot으로 게시해야 한다."
      />

      <ConceptPrimer items={[
        { term: 'Observation', meaning: '특정 sensor frame과 acquisition time에서 얻은 box, mask, depth 또는 points다.', why: '관측을 영속 object identity나 확정 geometry로 오해하지 않게 한다.' },
        { term: '3D support', meaning: 'Instance mask와 유효 aligned depth가 함께 지지하는 metric points 집합이다.', why: 'Box center 한 pixel의 depth와 mixed boundary가 shape 전체를 대표하지 못한다.' },
        { term: 'Data association', meaning: '예측한 tracks와 새 observations 사이의 one-to-one correspondence를 정한다.', why: 'Crossing과 occlusion에서 ID switch, duplicate와 teleport를 막는다.' },
        { term: 'Inverse sensor model', meaning: 'Range ray가 각 voxel에 free 또는 occupied evidence를 주는 규칙이다.', why: '관측하지 않은 unknown과 실제로 통과한 free를 구분한다.' },
        { term: 'Static/dynamic layers', meaning: '오래 유지되는 공간과 움직이는 identity의 update·decay 정책을 분리한다.', why: '이동한 물체의 ghost와 한 번 miss한 장애물의 조기 삭제를 동시에 피한다.' },
        { term: 'Scene snapshot', meaning: '같은 version에 속한 robot state, transforms, octomap, world/attached objects와 collision policy다.', why: 'Planner가 서로 다른 시각의 부분 상태를 섞지 않게 한다.' },
      ]} />

      <NlpSection id="observation-contract" marker="01" tone="blue" question="Box, semantic mask, instance mask와 point cloud는 각각 어떤 사실까지 말할 수 있을까?" title="모델 출력은 세계 상태가 아니라 정보가 제한된 sensor observation이다">
        <p>Bounding box는 class와 대략적 image extent를 주지만 내부의 background를 포함한다. Semantic segmentation은 pixel class를 주지만 같은 class의 두 물체를 하나로 합친다. Instance mask는 개체별 pixel support를 주지만 metric scale은 없다. Depth나 point cloud가 붙어도 그것은 특정 시각·좌표계에서 보인 surface sample이지, 보이지 않은 뒷면이나 영속 ID까지 자동으로 만들지 않는다.</p>
        <ObservationContractLab />
        <Misconception>Detector confidence 0.93은 “이 3D obstacle의 pose가 93% 정확하다”는 뜻이 아니다. Training objective에서 나온 class/objectness score이고, depth validity·calibration·association·shape completeness·scene freshness는 별도 불확실성이다.</Misconception>
      </NlpSection>

      <NlpSection id="metric-support" marker="02" tone="violet" question="Glossy mug의 depth가 비고 mask 가장자리에 table depth가 섞이면 3D shape를 어떻게 만들까?" title="Instance mask를 valid aligned depth와 교차해 robust 3D support를 만든다">
        <p>Color pixel과 depth pixel이 같은 ray를 가리키는지 먼저 확인한다. Instance mask를 조금 erosion해 mixed foreground/background boundary를 줄이고, zero·NaN·sensor range 밖 depth를 버린다. 남은 각 pixel을 camera ray로 unproject한 뒤 acquisition-time transform으로 같은 world frame에 옮긴다. Robot link model이 설명하는 points는 self-filter하되, arm 근처라는 이유만으로 object points까지 지우지 않는다.</p>
        <MathFormula display>{raw`\begin{aligned}\underbrace{p_c(u,v)}_{\text{카메라의 3차원 점}}&=\underbrace{d(u,v)K^{-1}\widetilde p}_{\text{pixel 광선에 깊이를 붙임}}\\[5pt]\underbrace{p_{b,k}(u,v)}_{\text{기준 좌표계 점}}&=\underbrace{T_{bc}(t_k)}_{\text{촬영 시각 변환}}p_c(u,v)\\[5pt]\underbrace{\mathcal V_i}_{\text{유효 pixel}}&=\underbrace{\{M_i=1\}}_{\text{개체 내부}}\cap\underbrace{\{d_{min}<d<d_{max}\}}_{\text{깊이 유효}}\\[5pt]\underbrace{\mathcal P_i}_{\text{최종 지지점}}&=\{p_{b,k}(u,v)\mid(u,v)\in\mathcal V_i\}\setminus\underbrace{\mathcal R(q_k)}_{\text{로봇 자체 점}}\end{aligned}`}</MathFormula>
        <FormulaNote meaning="집합 조건은 단일 box center가 아니라 mask 안의 모든 유효 pixel을 사용한다. T는 반드시 image acquisition time의 transform이다. 마지막 차집합은 현재 joint state에서 렌더링한 robot geometry와 일치하는 points를 제거하며, 별도 margin과 object protection rule이 필요하다." symbols={[[raw`\mathcal P_i`, 'Instance i의 metric surface samples'], [raw`M_i`, 'Instance-specific binary mask'], [raw`d(u,v)`, 'Color pixel에 정렬된 valid depth'], [raw`\mathcal R(q_k)`, '현재 robot configuration이 점유하는 self geometry']]} />
        <DepthSupportLab />
        <Takeaway>Support 수, spatial spread, invalid-depth 비율, boundary contamination과 covariance를 geometry와 함께 저장한다. 점이 적거나 한쪽에 몰리면 큰 box를 억지로 만들지 말고 재관측 또는 conservative unknown 처리로 넘긴다.</Takeaway>
      </NlpSection>

      <NlpSection id="association" marker="03" tone="amber" question="두 사람이 든 같은 종류의 mug가 화면에서 교차하면 nearest center가 identity를 보존할까?" title="기존 state를 현재 시각으로 예측하고 gate 안의 후보만 one-to-one assignment한다">
        <p>Association 전에는 각 track의 position과 covariance를 observation time으로 predict한다. 후보 detection과의 innovation이 motion uncertainty에 비해 지나치게 크면 gate 밖으로 버린다. 남은 후보에는 3D Mahalanobis distance, mask/box IoU, appearance와 class consistency를 비용으로 결합하고 bipartite assignment를 푼다. Greedy nearest는 두 tracks가 같은 detection을 탐내거나 crossing 뒤 identity를 바꾸기 쉽다.</p>
        <MathFormula display>{raw`\begin{aligned}\underbrace{e_{ij}}_{\text{예측과 관측의 차이}}&=\underbrace{z_j-H\widehat x_i}_{\text{관측에서 예측 위치를 뺌}}\\[5pt]\underbrace{S_{ij}}_{\text{차이가 가질 수 있는 분산}}&=\underbrace{H P_iH^T}_{\text{track 예측 불확실성}}+\underbrace{R_j}_{\text{관측 불확실성}}\\[5pt]\underbrace{d^2_{ij}}_{\text{정규화한 연관 거리}}&=\underbrace{e_{ij}^TS_{ij}^{-1}e_{ij}}_{\text{불확실한 방향은 덜 벌점}},\qquad \underbrace{d^2_{ij}\le\gamma}_{\text{후보 gate}}\end{aligned}`}</MathFormula>
        <FormulaNote meaning="같은 meter 차이라도 covariance가 큰 방향에서는 가능한 observation이고, 정밀한 방향에서는 gate 밖일 수 있다. Gamma는 state dimension과 허용 false association에 맞춘 chi-square threshold로 정하며, appearance가 motion gate를 무시하게 해서는 안 된다." symbols={[[raw`\widehat x_i,P_i`, '현재 acquisition time으로 예측한 track state와 covariance'], [raw`z_j,R_j`, '새 3D observation과 measurement covariance'], ['H', 'State에서 observation 좌표를 꺼내는 matrix'], [raw`\gamma`, '후보를 제한하는 통계적 gate']]} />
        <MathFormula display>{raw`\begin{aligned}\underbrace{C_{ij}}_{\text{한 pair의 비용}}&=\underbrace{\alpha d^2_{ij}}_{\text{운동 불일치}}+\underbrace{\beta(1-\operatorname{IoU}_{ij})}_{\text{겹침 불일치}}+\underbrace{\eta c^{app}_{ij}}_{\text{외형 불일치}}\\[5pt]\underbrace{\pi^*}_{\text{일대일 대응 결과}}&=\underbrace{\operatorname*{argmin}_{\pi}\sum_{(i,j)\in\pi}C_{ij}}_{\text{전체 연관 비용을 최소화}}\end{aligned}`}</MathFormula>
        <FormulaNote meaning="Assignment는 각 track과 detection을 최대 한 번만 사용한다. 서로 다른 비용은 scale을 보정한 뒤 결합해야 하며, impossible pairs는 큰 비용을 주는 대신 gate 단계에서 제거하는 편이 명확하다." symbols={[[raw`\pi`, '허용된 track-detection pair 집합'], [raw`\operatorname{IoU}`, 'Predicted와 observed image support의 overlap'], [raw`c^{app}`, 'Appearance embedding distance'], [raw`\alpha,\beta,\eta`, '검증 data로 정한 cost weights']]} />
        <AssociationLab />
      </NlpSection>

      <NlpSection id="track-lifecycle" marker="04" tone="amber" question="가림 때문에 confidence가 한 번 0.34로 떨어졌다고 기존 mug를 삭제해야 할까?" title="Confidence threshold와 track lifecycle은 서로 다른 정책이다">
        <p>Tentative track은 연속 hits를 얻어 confirmed가 되고, confirmed track이 miss되면 곧바로 사라지는 대신 predicted state와 커지는 covariance를 가진 occluded 상태로 남는다. 일정 age나 uncertainty budget을 넘은 뒤에만 stale/deleted로 전이한다. ByteTrack의 핵심은 low-score detections를 모두 믿는 것이 아니라, high-score association 뒤 남은 기존 tracks가 가림 중인 물체의 low-score evidence를 회수하도록 2차 association을 제한하는 데 있다.</p>
        <TrackLifecycleLab />
        <Misconception>Detection miss는 free-space measurement가 아니다. 물체가 사라졌다는 결론에는 sensor ray가 과거 위치를 통과했다는 음의 공간 증거, track age, 다른 sensor 또는 task-specific disappearance policy가 필요하다.</Misconception>
      </NlpSection>

      <NlpSection id="scene-representations" marker="05" tone="green" question="Point cloud를 저장했다면 collision checking과 object manipulation에 필요한 세계 모델이 모두 생긴 것일까?" title="표현은 파일 형식이 아니라 downstream query에 맞춰 선택한다">
        <p>Point cloud는 sensor가 실제로 반환한 samples와 outlier를 검사하기 좋지만 ray가 지나간 free space와 아직 보지 못한 unknown을 직접 표현하지 않는다. TSDF는 여러 depth frames에서 smooth surface와 normals를 복원하기 좋다. Occupancy는 공간을 free·occupied·unknown으로 나눠 conservative collision query에 적합하다. Object track은 class, identity, pose, velocity와 grasp affordance를 보존하지만 class 없는 unknown obstacle을 놓칠 수 있다.</p>
        <RepresentationLab />
        <Takeaway>Production scene은 하나를 승자로 고르지 않는다. Raw observation, volumetric occupancy, reconstructed surface와 dynamic object belief를 provenance로 연결하고, 각 planner가 요구한 query에 맞는 view를 게시한다.</Takeaway>
      </NlpSection>

      <NlpSection id="inverse-sensor-model" marker="06" tone="teal" question="Depth endpoint 하나만 occupied로 찍으면 sensor와 물체 사이 공간은 free인가 unknown인가?" title="Range observation은 ray의 free evidence와 endpoint의 occupied evidence를 함께 갱신한다">
        <p>Valid range가 z라면 sensor origin부터 endpoint 직전까지 ray가 통과한 voxels는 observed free이고 endpoint voxel은 occupied evidence를 받는다. Ray가 닿지 않은 공간은 unknown으로 남는다. Max range return, invalid depth와 transparent surface에는 서로 다른 policy가 필요하며, “detector가 아무것도 못 찾음”을 모든 공간의 free ray로 바꾸면 안 된다.</p>
        <MathFormula display>{raw`\begin{aligned}\underbrace{\ell(n\mid z_t)=\ell_{free}<0}_{\text{free 증거}}&\quad\text{if }\underbrace{n\in\operatorname{ray}(o,z_t)}_{\text{endpoint 전에 통과}}\\[5pt]\underbrace{\ell(n\mid z_t)=\ell_{occ}>0}_{\text{occupied 증거}}&\quad\text{if }\underbrace{n=\operatorname{end}(o,z_t)}_{\text{측정 surface 위치}}\\[5pt]\underbrace{\ell(n\mid z_t)=0}_{\text{이번에는 모름}}&\quad\text{otherwise}\end{aligned}`}</MathFormula>
        <FormulaNote meaning="Inverse sensor model은 raw range를 map evidence로 바꾼다. 한 scan에서 discretization 때문에 어떤 ray의 endpoint와 다른 ray의 free cells가 충돌하면 OctoMap은 occupied endpoint를 우선해 얇은 surface에 hole이 생기는 것을 막는다." symbols={[[raw`\ell_{free}`, 'Traversed voxel에 더하는 negative log-odds evidence'], [raw`\ell_{occ}`, 'Endpoint voxel에 더하는 positive evidence'], ['o', 'Sensor origin in map frame'], [raw`z_t`, '시간 t의 valid range endpoint']]} />
        <RayUpdateLab />
      </NlpSection>

      <NlpSection id="occupancy-fusion" marker="07" tone="violet" question="한 번 보인 벽은 얼마나 많은 free ray를 받아야 없어져야 할까?" title="Log-odds를 더하고 clamp해 noise에는 안정적이면서 변화에는 열려 있게 만든다">
        <p>Bayes occupancy update는 log-odds 공간에서 덧셈이 된다. Hit와 miss evidence를 누적하면 반복 관측이 강해지지만 무한히 누적하면 한때 있던 obstacle이 움직인 뒤에도 지워지지 않는다. Lower/upper clamp는 확신의 최대치를 정해 유한한 반대 evidence로 state가 뒤집히게 한다. 이 구조의 원문·수치·압축 경계는 <InternalLink slug="paper-octomap-2013">OctoMap 2013 원문 읽기</InternalLink>에서 따로 검산한다.</p>
        <MathFormula display>{raw`\begin{aligned}\underbrace{L(n)}_{\text{점유 확률의 log odds}}&=\log\frac{\underbrace{P(n)}_{\text{점유 확률}}}{\underbrace{1-P(n)}_{\text{비점유 확률}}}\\[5pt]\underbrace{L_t(n)}_{\text{누적된 현재 믿음}}&=\underbrace{L_{t-1}(n)}_{\text{이전 믿음}}+\underbrace{\ell(n\mid z_t)}_{\text{새 sensor 증거}}\end{aligned}`}</MathFormula>
        <FormulaNote meaning="Prior가 0.5이면 초기 log-odds는 0이다. Conditional independence와 fixed inverse sensor model이라는 근사가 숨어 있다. Correlated frames를 독립 증거처럼 너무 빠르게 더하면 confidence가 과장될 수 있다." symbols={[[raw`P(n)`, 'Voxel n의 occupancy probability'], [raw`L_t(n)`, '시간 t까지 누적한 occupancy log odds'], [raw`\ell(n\mid z_t)`, '현재 measurement의 additive evidence'], ['0', '50% prior의 log odds']]} />
        <MathFormula display>{raw`\begin{aligned}\underbrace{\widetilde L_t(n)}_{\text{clamp 전 믿음}}&=\underbrace{L_{t-1}(n)}_{\text{이전 믿음}}+\underbrace{\ell(n\mid z_t)}_{\text{새 증거}}\\[5pt]\underbrace{L_t(n)}_{\text{저장할 믿음}}&=\underbrace{\operatorname{clip}_{[L_{min},L_{max}]}\!\left(\widetilde L_t(n)\right)}_{\text{free 하한과 occupied 상한 안으로 제한}}\end{aligned}`}</MathFormula>
        <FormulaNote meaning="큰 clamp 범위는 noise에 강하지만 오래된 obstacle을 바꾸는 데 더 많은 반대 observations가 필요하다. 작은 범위는 빠르게 적응하지만 flicker가 늘 수 있다. OctoMap 논문의 수치는 해당 sensors와 use cases의 예이지 universal parameter가 아니다." symbols={[[raw`L_{min},L_{max}`, 'Map confidence를 제한하는 운영 parameters'], [raw`L_{t-1}+\ell`, 'Clamp 전 evidence update'], ['max/min', '하한과 상한 안으로 자르는 연산'], [raw`L_t`, '다음 query와 update가 사용할 저장값']]} />
        <EvidenceLab />
        <p>Octree의 안정된 같은-state children은 parent로 prune해 memory를 줄이고, 새 반대 evidence가 오면 다시 expand할 수 있다. Coarse level에서 collision을 질의할 때 max-child occupancy를 쓰면 한 occupied child가 parent 전체를 보수적으로 차지하므로 빠르지만 obstacle이 resolution만큼 부풀어 보인다.</p>
      </NlpSection>

      <NlpSection id="static-dynamic-layers" marker="08" tone="violet" question="사람이 mug를 옮긴 뒤 옛 위치와 새 위치 중 어느 쪽이 collision scene에 남아야 할까?" title="Static occupancy와 dynamic track은 서로 다른 증거와 수명을 가진다">
        <p>벽·바닥 같은 static layer는 ray evidence를 장기 누적한다. 사람, mug, cart와 robot body는 motion state와 identity가 있는 dynamic layer에서 predict·associate·age한다. Dynamic object를 static occupancy에 무조건 fuse하면 옛 위치에 ghost가 남고, detector miss만으로 지우면 가림 중 실제 obstacle이 사라진다. 과거 위치는 실제 free ray로 clear하고 현재 track은 covariance와 staleness에 따라 collision margin을 키운다.</p>
        <LayeredSceneLab />
        <MathFormula display>{raw`\begin{aligned}\underbrace{r_{unc}(t)}_{\text{불확실성 여유}}&=\underbrace{k\sqrt{\lambda_{max}(\Sigma_p(t))}}_{\text{가장 불확실한 위치 방향}}\\[5pt]\underbrace{r_{safe}(t)}_{\text{충돌 검사 팽창 반경}}&=\underbrace{r_{shape}}_{\text{추정 물체 크기}}+r_{unc}(t)+\underbrace{v_{rel}\Delta t}_{\text{반응 중 이동 거리}}\end{aligned}`}</MathFormula>
        <FormulaNote meaning="Pose point estimate를 exact geometry로 쓰지 않고 covariance의 가장 큰 축과 perception-to-stop latency를 margin으로 바꾼 간단한 conservative rule이다. Non-Gaussian belief, articulated human motion과 방향성 shape에는 ellipsoid나 reachable set이 더 적합하다." symbols={[[raw`r_{shape}`, 'Object shape의 nominal collision radius'], [raw`\lambda_{max}(\Sigma_p)`, 'Position covariance의 가장 큰 eigenvalue'], ['k', '허용 tail probability에 맞춘 안전 배수'], [raw`v_{rel}\Delta t`, '상대 속도와 총 reaction delay가 만드는 이동 여유']]} />
      </NlpSection>

      <NlpSection id="planning-scene-snapshot" marker="09" tone="amber" question="Planner가 path를 계산하는 동안 perception이 mug를 갱신하면 어느 장면에 대해 실행해야 할까?" title="PlanningScene은 부분 message 모음이 아니라 원자적 safety snapshot이다">
        <p>Snapshot에는 robot state, fixed transforms, octomap, world collision objects, attached objects, allowed collision matrix, link padding, source timestamps, calibration/track provenance와 scene ID/version이 함께 있어야 한다. Grasp 순간 mug는 world object에서 사라지고 같은 transaction 안에서 gripper의 attached object가 되며, 지정한 touch links만 collision exception을 얻는다.</p>
        <MathFormula display>{raw`\begin{aligned}\underbrace{C_v}_{\text{version 조건}}&:\ \underbrace{v_{plan}=v_{current}}_{\text{같은 장면을 사용}}\\[4pt]\underbrace{C_t}_{\text{freshness 조건}}&:\ \underbrace{t_{now}-t_{source}\le\Delta t_{max}}_{\text{허용 age 안}}\\[4pt]\underbrace{C_p}_{\text{path 조건}}&:\ \underbrace{\operatorname{valid}(\tau,\mathcal S_{current})}_{\text{현재 snapshot에서 재검증}}\\[5pt]\underbrace{\operatorname{execute}(\tau)}_{\text{경로를 실제로 보냄}}&\Longrightarrow C_v\land C_t\land C_p\end{aligned}`}</MathFormula>
        <FormulaNote meaning="세 조건 중 하나라도 거짓이면 silent execution 대신 stop/replan한다. Version equality만으로 충분하지 않고 snapshot을 만든 source observations와 transforms의 age, covariance, calibration provenance도 acceptance contract에 포함해야 한다." symbols={[[raw`\tau`, 'Planner가 scene version에 대해 만든 timed path'], [raw`v_{plan},v_{current}`, '계획 시와 실행 직전의 scene version'], [raw`t_{source}`, 'Snapshot 구성 evidence 중 task에 중요한 source time'], [raw`\mathcal S_{current}`, '원자적으로 읽은 current planning scene']]} />
        <SceneVersionLab />
        <div className="not-prose my-6 flex items-start gap-3 border-y border-border bg-muted/15 px-4 py-4 text-sm leading-relaxed">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" />
          <p><strong>운영 규칙.</strong> Perception callback이 octomap, object와 ACM을 따로 쓰는 동안 planner가 중간 상태를 읽게 하지 않는다. Snapshot을 immutable하게 조립한 뒤 version을 한 번 증가시키고, 실행 monitor가 invalidation을 구독한다.</p>
        </div>
      </NlpSection>

      <section className="my-12 border-y border-border py-8">
        <div className="mb-5 flex items-center gap-3"><RefreshCw className="h-5 w-5 text-blue-700" /><h2 className="m-0 text-xl font-black">이 글로 도달해야 하는 구현 판단</h2></div>
        <CapabilityCheck items={[
          'Box·semantic mask·instance mask·depth/point cloud가 보존하거나 잃는 정보를 구분한다.',
          'Instance mask, valid depth, boundary rejection와 robot self-filter로 3D support를 만든다.',
          'Prediction, covariance gate와 one-to-one assignment로 crossing·occlusion의 ID switch를 진단한다.',
          'Detector miss와 free-space ray evidence를 구분하고 track lifecycle을 명시한다.',
          'Point cloud·TSDF·occupancy·object tracks를 downstream query에 맞춰 조합한다.',
          'Ray의 free/occupied/unknown과 bounded log-odds update를 계산한다.',
          'Static occupancy와 dynamic object의 수명·clearing·uncertainty policy를 분리한다.',
          'Version, freshness, covariance와 provenance가 붙은 atomic PlanningScene만 실행 gate에 넘긴다.',
        ]} />
      </section>

      <LearningHandoff
        description="이 글이 넘기는 것은 box 목록이 아니라 source time과 scene version이 고정된 safety snapshot이다. 좌표·map revision·경로 검증 중 실제로 막힌 경계만 연다."
        items={[
          { label: '막히면', slug: 'robot-camera-geometry-calibration', title: 'Robot Camera Geometry & Calibration', reason: 'Mask와 depth를 metric ray·point로 바꾸는 frame, timestamp와 covariance 계약을 복습한다.' },
          { label: '막히면', slug: 'robot-localization-slam', title: 'Robot Localization & SLAM', reason: 'Loop closure 뒤 map·track·goal·PlanningScene을 같은 revision으로 rebase해야 할 때 읽는다.' },
          { label: '이어 읽기', slug: 'robot-motion-planning', title: 'Robot Motion Planning', reason: '현재 scene version에서 state와 edge를 재검증해 collision-free path를 찾는다.' },
        ]}
      />

      <SourceNotes sources={[
        { label: 'Mask R-CNN · ICCV 2017', href: 'https://openaccess.thecvf.com/content_ICCV_2017/html/He_Mask_R-CNN_ICCV_2017_paper.html', note: 'Detection과 parallel instance-mask branch의 원 논문. 이 글은 backbone 성능이 아니라 output contract만 사용한다.' },
        { label: 'SORT · 2016', href: 'https://arxiv.org/abs/1602.00763', note: 'Kalman prediction과 Hungarian association으로 단순 online tracking baseline을 구성한 원 논문.' },
        { label: 'ByteTrack · ECCV 2022', href: 'https://www.ecva.net/papers/eccv_2022/papers_ECCV/html/315_ECCV_2022_paper.php', note: 'Low-score detections를 기존 tracks의 2차 association에 활용하는 근거. 모든 low-score box를 채택한다는 뜻은 아니다.' },
        { label: 'OctoMap · Autonomous Robots 2013', href: 'https://doi.org/10.1007/s10514-012-9321-0', note: 'Free·occupied·unknown, probabilistic ray fusion, log-odds clamping과 octree compression의 원 논문.' },
        { label: 'ROS 2 PointCloud2', href: 'https://docs.ros.org/en/rolling/p/sensor_msgs/msg/PointCloud2.html', note: 'Point fields, dimensions, point/row step와 acquisition frame contract를 확인하는 공식 message 문서.' },
        { label: 'MoveIt Planning Scene Monitor', href: 'https://moveit.picknik.ai/main/doc/examples/planning_scene_monitor/planning_scene_monitor_tutorial.html', note: 'Robot state, world geometry와 scene monitor를 결합하는 현재 공식 문서. 구체 동시성 정책은 본문의 system design 확장이다.' },
        { label: 'MoveIt PlanningScene messages', href: 'https://docs.ros.org/en/rolling/p/moveit_msgs/msg/PlanningScene.html', note: 'World, robot state, transforms, allowed-collision matrix, padding과 scene identity 필드의 공식 message contract.' },
      ]} />
      <p className="mt-5 text-xs leading-relaxed text-muted-foreground"><EyeOff className="mr-1 inline h-3.5 w-3.5" />수치 예시는 상호작용으로 trade-off를 드러내기 위한 교육용이다. Sensor noise, voxel resolution, object speed와 stopping distance에 맞춰 validation data에서 threshold와 clamp를 다시 정해야 한다.</p>
    </>
  );
}
