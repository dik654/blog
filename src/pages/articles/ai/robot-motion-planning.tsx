import { useMemo, useState } from 'react';
import { RotateCcw, StepForward } from 'lucide-react';
import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import {
  CapabilityCheck,
  ConceptPrimer,
  LearningHandoff,
  Misconception,
  QuestionLead,
  SourceNotes,
} from '@/components/learning/ArticleLearning';
import { NlpSection, SegmentedControl, Takeaway } from './nlp-shared';

const RAD = Math.PI / 180;
const L1 = 0.68;
const L2 = 0.52;
const START = [-60, 100] as const;
const GOAL = [100, -100] as const;
const SHELF = { x0: 0.22, x1: 0.48, y0: 0.18, y1: 0.62 };

type Point = { x: number; y: number };

function armPoints(q1Deg: number, q2Deg: number): [Point, Point, Point] {
  const q1 = q1Deg * RAD;
  const q2 = q2Deg * RAD;
  return [
    { x: 0, y: 0 },
    { x: L1 * Math.cos(q1), y: L1 * Math.sin(q1) },
    {
      x: L1 * Math.cos(q1) + L2 * Math.cos(q1 + q2),
      y: L1 * Math.sin(q1) + L2 * Math.sin(q1 + q2),
    },
  ];
}

function orientation(a: Point, b: Point, c: Point) {
  return (b.x - a.x) * (c.y - a.y) - (b.y - a.y) * (c.x - a.x);
}

function segmentIntersects(a: Point, b: Point, c: Point, d: Point) {
  const o1 = orientation(a, b, c);
  const o2 = orientation(a, b, d);
  const o3 = orientation(c, d, a);
  const o4 = orientation(c, d, b);
  return o1 * o2 <= 0 && o3 * o4 <= 0;
}

function insideShelf(point: Point) {
  return point.x >= SHELF.x0 && point.x <= SHELF.x1 && point.y >= SHELF.y0 && point.y <= SHELF.y1;
}

function armCollides(q1Deg: number, q2Deg: number) {
  const points = armPoints(q1Deg, q2Deg);
  const corners: Point[] = [
    { x: SHELF.x0, y: SHELF.y0 },
    { x: SHELF.x1, y: SHELF.y0 },
    { x: SHELF.x1, y: SHELF.y1 },
    { x: SHELF.x0, y: SHELF.y1 },
  ];
  return [0, 1].some((link) => {
    const a = points[link];
    const b = points[link + 1];
    return insideShelf(a) || insideShelf(b) || corners.some((corner, index) => (
      segmentIntersects(a, b, corner, corners[(index + 1) % corners.length])
    ));
  });
}

function interpolateConfig(t: number): [number, number] {
  return [
    START[0] + (GOAL[0] - START[0]) * t,
    START[1] + (GOAL[1] - START[1]) * t,
  ];
}

function ArmWorkspace({ q, collision }: { q: [number, number]; collision: boolean }) {
  const points = armPoints(q[0], q[1]);
  const sx = (x: number) => 255 + x * 175;
  const sy = (y: number) => 205 - y * 175;
  return (
    <svg viewBox="0 0 520 310" className="block h-auto w-full" role="img" aria-label="선반 주위 두 관절 로봇 팔의 현재 자세">
      <rect x={sx(SHELF.x0)} y={sy(SHELF.y1)} width={(SHELF.x1 - SHELF.x0) * 175} height={(SHELF.y1 - SHELF.y0) * 175} rx="4" fill="#f59e0b" opacity="0.18" stroke="#b45309" strokeWidth="2" />
      <g transform={`translate(${sx(SHELF.x0)},${sy(SHELF.y1) - 22})`}><rect width="45" height="18" rx="4" fill="white" stroke="#f59e0b" strokeOpacity="0.45" /><text x="22.5" y="13" textAnchor="middle" fontSize="11" fontWeight="700" fill="#92400e">shelf</text></g>
      <line x1="32" x2="490" y1={sy(0)} y2={sy(0)} stroke="currentColor" opacity="0.12" />
      <line x1={sx(0)} x2={sx(0)} y1="24" y2="282" stroke="currentColor" opacity="0.08" />
      <line x1={sx(points[0].x)} y1={sy(points[0].y)} x2={sx(points[1].x)} y2={sy(points[1].y)} stroke={collision ? '#dc2626' : '#2563eb'} strokeWidth="9" strokeLinecap="round" />
      <line x1={sx(points[1].x)} y1={sy(points[1].y)} x2={sx(points[2].x)} y2={sy(points[2].y)} stroke={collision ? '#dc2626' : '#7c3aed'} strokeWidth="8" strokeLinecap="round" />
      {points.map((point, index) => <circle key={index} cx={sx(point.x)} cy={sy(point.y)} r={index === 2 ? 7 : 9} fill={collision ? '#dc2626' : index === 2 ? '#059669' : '#1d4ed8'} stroke="white" strokeWidth="3" />)}
      <text x="28" y="291" fontSize="12" fill="currentColor" opacity="0.55">workspace · extended body</text>
      <text x="350" y="291" fontSize="12" fontWeight="700" fill={collision ? '#b91c1c' : '#047857'}>{collision ? 'collision' : 'free configuration'}</text>
    </svg>
  );
}

function WorkspaceCspaceLab() {
  const [progress, setProgress] = useState(0);
  const t = progress / 100;
  const q = interpolateConfig(t);
  const collision = armCollides(q[0], q[1]);
  const cells = useMemo(() => {
    const result: Array<{ q1: number; q2: number }> = [];
    for (let row = 0; row < 36; row += 1) {
      const q2 = -150 + (row / 35) * 300;
      for (let column = 0; column < 44; column += 1) {
        const q1 = -180 + (column / 43) * 360;
        if (armCollides(q1, q2)) result.push({ q1, q2 });
      }
    }
    return result;
  }, []);
  const cx = (q1: number) => 38 + ((q1 + 180) / 360) * 438;
  const cy = (q2: number) => 264 - ((q2 + 150) / 300) * 224;
  return (
    <figure className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border">
      <figcaption className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-border px-4 py-4 !pr-24">
        <span className="font-mono text-xs font-black text-blue-700 dark:text-blue-300">WORKSPACE / C-SPACE LAB</span>
        <strong className="basis-full text-sm leading-snug sm:min-w-60 sm:flex-1 sm:basis-60">팔 전체의 충돌을 joint-angle 공간의 점 하나로 읽는다</strong>
        <span className={`basis-full font-mono text-xs font-black sm:basis-auto ${collision ? 'text-red-700 dark:text-red-300' : 'text-emerald-700 dark:text-emerald-300'}`}>q = [{q[0].toFixed(0)}, {q[1].toFixed(0)}] deg</span>
      </figcaption>
      <div className="border-b border-border bg-blue-500/[0.025] p-4">
        <label className="text-xs font-semibold text-muted-foreground">Start에서 goal까지 직선 보간 · {progress}%<input className="mt-3 block w-full accent-blue-700" type="range" min="0" max="100" step="1" value={progress} onChange={(event) => setProgress(Number(event.target.value))} /></label>
      </div>
      <div className="grid min-w-0 gap-px bg-border lg:grid-cols-2">
        <div className="min-w-0 bg-background p-3 sm:p-5"><ArmWorkspace q={q} collision={collision} /></div>
        <div className="min-w-0 bg-background p-3 sm:p-5">
          <svg viewBox="0 0 520 310" className="block h-auto w-full" role="img" aria-label="두 관절 로봇의 충돌 configuration을 표시한 C-space">
            <rect x="38" y="40" width="438" height="224" rx="4" fill="currentColor" opacity="0.025" stroke="currentColor" strokeOpacity="0.15" />
            {cells.map((cell) => <rect key={`${cell.q1}-${cell.q2}`} x={cx(cell.q1) - 5.1} y={cy(cell.q2) - 3.5} width="10.2" height="7" fill="#f59e0b" opacity="0.34" />)}
            <line x1={cx(START[0])} y1={cy(START[1])} x2={cx(GOAL[0])} y2={cy(GOAL[1])} stroke="#64748b" strokeWidth="2" strokeDasharray="6 5" />
            <circle cx={cx(START[0])} cy={cy(START[1])} r="6" fill="#2563eb" stroke="white" strokeWidth="2" />
            <circle cx={cx(GOAL[0])} cy={cy(GOAL[1])} r="6" fill="#7c3aed" stroke="white" strokeWidth="2" />
            <circle cx={cx(q[0])} cy={cy(q[1])} r="8" fill={collision ? '#dc2626' : '#059669'} stroke="white" strokeWidth="3" />
            <text x={cx(START[0]) + 9} y={cy(START[1]) - 8} fontSize="12" fontWeight="700" fill="#1d4ed8">start</text>
            <text x={cx(GOAL[0]) - 36} y={cy(GOAL[1]) - 9} fontSize="12" fontWeight="700" fill="#6d28d9">goal</text>
            <text x="38" y="289" fontSize="12" fill="currentColor" opacity="0.55">q1: -180 to 180 deg</text>
            <text x="312" y="289" fontSize="12" fontWeight="700" fill="#92400e">amber = C_obstacle</text>
            <text x="10" y="38" fontSize="12" fill="currentColor" opacity="0.55">q2</text>
          </svg>
        </div>
      </div>
    </figure>
  );
}

function EdgeValidityLab() {
  const [sampleCount, setSampleCount] = useState(2);
  const samples = Array.from({ length: sampleCount }, (_, index) => {
    const t = sampleCount === 1 ? 0 : index / (sampleCount - 1);
    const q = interpolateConfig(t);
    return { t, q, collision: armCollides(q[0], q[1]) };
  });
  const caught = samples.some((sample) => sample.collision);
  const groundTruth = Array.from({ length: 201 }, (_, index) => {
    const q = interpolateConfig(index / 200);
    return armCollides(q[0], q[1]);
  }).some(Boolean);
  return (
    <figure className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border">
      <figcaption className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-border px-4 py-4 !pr-24">
        <span className="font-mono text-xs font-black text-amber-700 dark:text-amber-300">EDGE VALIDITY LAB</span>
        <strong className="basis-full text-sm leading-snug sm:min-w-60 sm:flex-1 sm:basis-60">끝점 검사는 통과해도 그 사이 shelf를 건너뛸 수 있다</strong>
        <span className={`basis-full text-xs font-black sm:basis-auto ${caught ? 'text-red-700 dark:text-red-300' : 'text-amber-700 dark:text-amber-300'}`}>{caught ? '충돌 검출' : '거짓 통과'}</span>
      </figcaption>
      <div className="grid gap-5 border-b border-border bg-amber-500/[0.025] p-4 sm:grid-cols-[minmax(0,1fr)_12rem]">
        <label className="text-xs font-semibold text-muted-foreground">Edge 위 검사점 · {sampleCount}개<input className="mt-3 block w-full accent-amber-700" type="range" min="2" max="24" step="1" value={sampleCount} onChange={(event) => setSampleCount(Number(event.target.value))} /></label>
        <div className="rounded-md border border-border bg-background px-3 py-2"><p className="text-xs font-semibold text-muted-foreground">고해상도 기준</p><p className="mt-1 text-sm font-black text-red-700 dark:text-red-300">{groundTruth ? '실제 충돌 있음' : '충돌 없음'}</p></div>
      </div>
      <div className="p-4 sm:p-6">
        <svg viewBox="0 0 320 210" className="block h-auto w-full sm:hidden" role="img" aria-label="모바일 보간 edge의 충돌 검사 해상도 비교">
          <line x1="28" y1="86" x2="292" y2="86" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
          <rect x="174" y="52" width="66" height="68" rx="5" fill="#f59e0b" opacity="0.16" stroke="#b45309" strokeWidth="2" />
          <text x="207" y="143" textAnchor="middle" fontSize="12" fontWeight="700" fill="#92400e">실제 충돌 구간</text>
          {samples.map((sample, index) => {
            const x = 28 + sample.t * 264;
            return <g key={sample.t}><line x1={x} y1="69" x2={x} y2="103" stroke={sample.collision ? '#dc2626' : '#2563eb'} strokeWidth="2" opacity="0.65" /><circle cx={x} cy="86" r="7" fill={sample.collision ? '#dc2626' : '#2563eb'} stroke="white" strokeWidth="2" /><text x={x} y="38" textAnchor="middle" fontSize="12" fill="currentColor" opacity="0.62">{index}</text></g>;
          })}
          <text x="26" y="184" fontSize="12" fontWeight="700" fill="#1d4ed8">q_start</text>
          <text x="246" y="184" fontSize="12" fontWeight="700" fill="#6d28d9">q_goal</text>
        </svg>
        <svg viewBox="0 0 720 170" className="hidden h-auto w-full sm:block" role="img" aria-label="보간 edge의 충돌 검사 해상도 비교">
          <line x1="54" y1="78" x2="666" y2="78" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
          <rect x="392" y="45" width="150" height="66" rx="5" fill="#f59e0b" opacity="0.16" stroke="#b45309" strokeWidth="2" />
          <text x="420" y="136" fontSize="12" fontWeight="700" fill="#92400e">실제 colliding interval</text>
          {samples.map((sample, index) => {
            const x = 54 + sample.t * 612;
            return <g key={sample.t}><line x1={x} y1="62" x2={x} y2="94" stroke={sample.collision ? '#dc2626' : '#2563eb'} strokeWidth="2" opacity="0.6" /><circle cx={x} cy="78" r="7" fill={sample.collision ? '#dc2626' : '#2563eb'} stroke="white" strokeWidth="2" /><text x={x} y="35" textAnchor="middle" fontSize="11" fill="currentColor" opacity="0.62">{index}</text></g>;
          })}
          <text x="48" y="158" fontSize="12" fontWeight="700" fill="#1d4ed8">q_start</text>
          <text x="624" y="158" fontSize="12" fontWeight="700" fill="#6d28d9">q_goal</text>
        </svg>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">검사점 {sampleCount}개에서 {caught ? '중간 collision sample을 발견했다.' : '모든 sample이 free라서 잘못된 edge를 graph에 넣는다.'} Resolution은 단순 성능 옵션이 아니라 safety 결과를 바꾸는 모델 가정이다.</p>
      </div>
    </figure>
  );
}

type HeuristicMode = 'dijkstra' | 'admissible' | 'over';

const GRAPH_NODES = {
  S: { x: 62, y: 150 }, A: { x: 205, y: 72 }, B: { x: 205, y: 224 },
  C: { x: 378, y: 62 }, D: { x: 378, y: 214 }, G: { x: 562, y: 142 },
};

const MOBILE_GRAPH_NODES = {
  S: { x: 38, y: 150 }, A: { x: 125, y: 54 }, B: { x: 125, y: 246 },
  C: { x: 220, y: 48 }, D: { x: 220, y: 242 }, G: { x: 312, y: 148 },
};

const GRAPH_EDGES: Array<[keyof typeof GRAPH_NODES, keyof typeof GRAPH_NODES, number]> = [
  ['S', 'A', 2], ['S', 'B', 4], ['A', 'C', 4], ['A', 'D', 7], ['B', 'D', 2], ['C', 'G', 4], ['D', 'G', 3],
];

function runAStar(mode: HeuristicMode) {
  const heuristics: Record<HeuristicMode, Record<keyof typeof GRAPH_NODES, number>> = {
    dijkstra: { S: 0, A: 0, B: 0, C: 0, D: 0, G: 0 },
    admissible: { S: 7, A: 6, B: 5, C: 4, D: 3, G: 0 },
    over: { S: 7, A: 1, B: 8, C: 1, D: 8, G: 0 },
  };
  const h = heuristics[mode];
  const open: Array<keyof typeof GRAPH_NODES> = ['S'];
  const g = Object.fromEntries(Object.keys(GRAPH_NODES).map((node) => [node, Number.POSITIVE_INFINITY])) as Record<keyof typeof GRAPH_NODES, number>;
  const parent: Partial<Record<keyof typeof GRAPH_NODES, keyof typeof GRAPH_NODES>> = {};
  const order: Array<keyof typeof GRAPH_NODES> = [];
  g.S = 0;
  while (open.length) {
    open.sort((left, right) => (g[left] + h[left]) - (g[right] + h[right]));
    const current = open.shift()!;
    if (order.includes(current)) continue;
    order.push(current);
    if (current === 'G') break;
    GRAPH_EDGES.forEach(([from, to, cost]) => {
      const neighbor = from === current ? to : to === current ? from : null;
      if (!neighbor) return;
      const candidate = g[current] + cost;
      if (candidate < g[neighbor]) {
        g[neighbor] = candidate;
        parent[neighbor] = current;
        open.push(neighbor);
      }
    });
  }
  const path: Array<keyof typeof GRAPH_NODES> = [];
  let cursor: keyof typeof GRAPH_NODES | undefined = 'G';
  while (cursor) { path.unshift(cursor); cursor = parent[cursor]; }
  return { h, g, order, path };
}

function AStarLab() {
  const [mode, setMode] = useState<HeuristicMode>('admissible');
  const result = runAStar(mode);
  const pathEdges = new Set(result.path.slice(1).map((node, index) => `${result.path[index]}-${node}`));
  const edgeOnPath = (a: string, b: string) => pathEdges.has(`${a}-${b}`) || pathEdges.has(`${b}-${a}`);
  return (
    <figure className="foundation-viz-explorer not-prose my-8 rounded-md border border-border p-4 sm:p-6">
      <SegmentedControl label="A-star heuristic" options={[
        { value: 'dijkstra', label: 'h = 0' },
        { value: 'admissible', label: '낙관적 h' },
        { value: 'over', label: '과대 h' },
      ]} value={mode} onChange={setMode} />
      <div className="mt-5 grid min-w-0 gap-5 lg:grid-cols-[minmax(0,1fr)_14rem]">
        <svg viewBox="0 0 340 300" className="block h-auto w-full sm:hidden" role="img" aria-label="모바일 A-star graph search와 heuristic 비교">
          {GRAPH_EDGES.map(([from, to, cost]) => {
            const a = MOBILE_GRAPH_NODES[from]; const b = MOBILE_GRAPH_NODES[to]; const active = edgeOnPath(from, to);
            return <g key={`${from}-${to}`}><line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={active ? '#2563eb' : '#94a3b8'} strokeWidth={active ? 4 : 2} strokeLinecap="round" opacity={active ? 1 : 0.45} /><rect x={(a.x + b.x) / 2 - 11} y={(a.y + b.y) / 2 - 10} width="22" height="20" rx="4" fill="white" stroke="#cbd5e1" /><text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="#334155">{cost}</text></g>;
          })}
          {(Object.entries(MOBILE_GRAPH_NODES) as Array<[keyof typeof MOBILE_GRAPH_NODES, Point]>).map(([name, point]) => <g key={name}><circle cx={point.x} cy={point.y} r="22" fill={result.path.includes(name) ? '#2563eb' : '#f8fafc'} stroke={result.order.includes(name) ? '#2563eb' : '#94a3b8'} strokeWidth="2" /><text x={point.x} y={point.y + 5} textAnchor="middle" fontSize="15" fontWeight="800" fill={result.path.includes(name) ? 'white' : '#334155'}>{name}</text><text x={point.x} y={point.y + 36} textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.62">g{Number.isFinite(result.g[name]) ? result.g[name] : '-'} · h{result.h[name]}</text></g>)}
        </svg>
        <svg viewBox="0 0 620 290" className="hidden h-auto w-full sm:block" role="img" aria-label="A-star graph search와 heuristic 비교">
          {GRAPH_EDGES.map(([from, to, cost]) => {
            const a = GRAPH_NODES[from]; const b = GRAPH_NODES[to]; const active = edgeOnPath(from, to);
            return <g key={`${from}-${to}`}><line x1={a.x} y1={a.y} x2={b.x} y2={b.y} stroke={active ? '#2563eb' : '#94a3b8'} strokeWidth={active ? 4 : 2} strokeLinecap="round" opacity={active ? 1 : 0.45} /><rect x={(a.x + b.x) / 2 - 11} y={(a.y + b.y) / 2 - 11} width="22" height="20" rx="4" fill="white" stroke="#cbd5e1" /><text x={(a.x + b.x) / 2} y={(a.y + b.y) / 2 + 4} textAnchor="middle" fontSize="11" fontWeight="700" fill="#334155">{cost}</text></g>;
          })}
          {(Object.entries(GRAPH_NODES) as Array<[keyof typeof GRAPH_NODES, Point]>).map(([name, point]) => <g key={name}><circle cx={point.x} cy={point.y} r="24" fill={result.path.includes(name) ? '#2563eb' : '#f8fafc'} stroke={result.order.includes(name) ? '#2563eb' : '#94a3b8'} strokeWidth="2" /><text x={point.x} y={point.y + 4} textAnchor="middle" fontSize="13" fontWeight="800" fill={result.path.includes(name) ? 'white' : '#334155'}>{name}</text><text x={point.x} y={point.y + 40} textAnchor="middle" fontSize="10" fill="currentColor" opacity="0.58">g {Number.isFinite(result.g[name]) ? result.g[name] : '-'} · h {result.h[name]}</text></g>)}
        </svg>
        <dl className="grid content-start gap-px self-start overflow-hidden rounded-md border border-border bg-border">
          <div className="bg-background p-3"><dt className="text-xs font-semibold text-muted-foreground">확장 순서</dt><dd className="mt-1 break-words font-mono text-sm font-black">{result.order.join(' -> ')}</dd></div>
          <div className="bg-background p-3"><dt className="text-xs font-semibold text-muted-foreground">반환 경로</dt><dd className="mt-1 break-words font-mono text-sm font-black text-blue-700 dark:text-blue-300">{result.path.join(' -> ')}</dd></div>
          <div className="bg-background p-3"><dt className="text-xs font-semibold text-muted-foreground">비용</dt><dd className={`mt-1 font-mono text-lg font-black ${result.g.G > 9 ? 'text-red-700 dark:text-red-300' : 'text-emerald-700 dark:text-emerald-300'}`}>{result.g.G}</dd></div>
        </dl>
      </div>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{mode === 'over' ? '과대평가 heuristic은 B를 늦게 보게 만들어 비용 10의 경로에서 종료한다. 빠른 것과 optimal인 것은 같은 주장이 아니다.' : mode === 'admissible' ? '실제 남은 비용을 넘지 않는 heuristic은 최적 비용 9를 유지하면서 불필요한 확장을 줄인다.' : 'h=0이면 Dijkstra다. 정답 비용은 같지만 goal 방향 정보 없이 누적 비용만 본다.'}</p>
    </figure>
  );
}

const SAMPLE_OBSTACLES = [
  { x0: 0.38, x1: 0.62, y0: 0, y1: 0.68 },
  { x0: 0.38, x1: 0.62, y0: 0.84, y1: 1 },
];
const SAMPLE_START = { x: 0.08, y: 0.12 };
const SAMPLE_GOAL = { x: 0.92, y: 0.68 };

function sampleFree(point: Point) {
  return !SAMPLE_OBSTACLES.some((obstacle) => point.x >= obstacle.x0 && point.x <= obstacle.x1 && point.y >= obstacle.y0 && point.y <= obstacle.y1);
}

function sampleEdgeFree(a: Point, b: Point) {
  for (let index = 0; index <= 36; index += 1) {
    const t = index / 36;
    if (!sampleFree({ x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t })) return false;
  }
  return true;
}

function seededPoints(count: number) {
  let state = 918273;
  const random = () => { state = (state * 1664525 + 1013904223) >>> 0; return state / 4294967296; };
  const result: Point[] = [];
  while (result.length < count) {
    const point = { x: 0.03 + random() * 0.94, y: 0.03 + random() * 0.94 };
    if (sampleFree(point)) result.push(point);
  }
  return result;
}

function shortestPath(nodes: Point[], edges: Array<[number, number]>) {
  const distance = nodes.map(() => Number.POSITIVE_INFINITY);
  const parent = nodes.map(() => -1);
  const open = new Set(nodes.map((_, index) => index));
  distance[0] = 0;
  while (open.size) {
    let current = -1;
    open.forEach((index) => { if (current < 0 || distance[index] < distance[current]) current = index; });
    if (current < 0 || !Number.isFinite(distance[current])) break;
    open.delete(current);
    if (current === 1) break;
    edges.forEach(([a, b]) => {
      const neighbor = a === current ? b : b === current ? a : -1;
      if (neighbor < 0 || !open.has(neighbor)) return;
      const candidate = distance[current] + Math.hypot(nodes[current].x - nodes[neighbor].x, nodes[current].y - nodes[neighbor].y);
      if (candidate < distance[neighbor]) { distance[neighbor] = candidate; parent[neighbor] = current; }
    });
  }
  if (!Number.isFinite(distance[1])) return [];
  const path: number[] = [];
  for (let cursor = 1; cursor >= 0; cursor = parent[cursor]) { path.unshift(cursor); if (cursor === 0) break; }
  return path[0] === 0 ? path : [];
}

function buildPrm(iterations: number) {
  const nodes = [SAMPLE_START, SAMPLE_GOAL, ...seededPoints(iterations)];
  const edges: Array<[number, number]> = [];
  nodes.forEach((node, index) => {
    const neighbors = nodes.map((candidate, candidateIndex) => ({ candidateIndex, distance: Math.hypot(node.x - candidate.x, node.y - candidate.y) }))
      .filter((entry) => entry.candidateIndex !== index && entry.distance < 0.25)
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 8);
    neighbors.forEach(({ candidateIndex }) => {
      if (candidateIndex < index && sampleEdgeFree(node, nodes[candidateIndex])) edges.push([index, candidateIndex]);
    });
  });
  return { nodes, edges, path: shortestPath(nodes, edges) };
}

function buildRrt(iterations: number) {
  const samples = seededPoints(iterations + 20);
  const nodes: Point[] = [SAMPLE_START];
  const edges: Array<[number, number]> = [];
  const parents = [-1];
  let goalIndex = -1;
  for (let index = 0; index < iterations; index += 1) {
    const target = index % 12 === 11 ? SAMPLE_GOAL : samples[index];
    let nearest = 0;
    nodes.forEach((node, nodeIndex) => {
      if (Math.hypot(node.x - target.x, node.y - target.y) < Math.hypot(nodes[nearest].x - target.x, nodes[nearest].y - target.y)) nearest = nodeIndex;
    });
    const dx = target.x - nodes[nearest].x;
    const dy = target.y - nodes[nearest].y;
    const length = Math.max(1e-8, Math.hypot(dx, dy));
    const step = Math.min(0.09, length);
    const next = { x: nodes[nearest].x + (dx / length) * step, y: nodes[nearest].y + (dy / length) * step };
    if (!sampleFree(next) || !sampleEdgeFree(nodes[nearest], next)) continue;
    const nextIndex = nodes.length;
    nodes.push(next); parents.push(nearest); edges.push([nearest, nextIndex]);
    if (Math.hypot(next.x - SAMPLE_GOAL.x, next.y - SAMPLE_GOAL.y) < 0.12 && sampleEdgeFree(next, SAMPLE_GOAL)) {
      goalIndex = nodes.length;
      nodes.push(SAMPLE_GOAL); parents.push(nextIndex); edges.push([nextIndex, goalIndex]);
      break;
    }
  }
  const path: number[] = [];
  if (goalIndex >= 0) for (let cursor = goalIndex; cursor >= 0; cursor = parents[cursor]) path.unshift(cursor);
  return { nodes, edges, path };
}

type SamplingMode = 'prm' | 'rrt';

function SamplingPlannerLab() {
  const [mode, setMode] = useState<SamplingMode>('prm');
  const [iterations, setIterations] = useState(100);
  const result = useMemo(() => mode === 'prm' ? buildPrm(iterations) : buildRrt(iterations), [mode, iterations]);
  const pathEdges = new Set(result.path.slice(1).map((node, index) => `${result.path[index]}-${node}`));
  const onPath = (a: number, b: number) => pathEdges.has(`${a}-${b}`) || pathEdges.has(`${b}-${a}`);
  const sx = (x: number) => 42 + x * 636;
  const sy = (y: number) => 326 - y * 280;
  const mobileSx = (x: number) => 18 + x * 304;
  const mobileSy = (y: number) => 274 - y * 248;
  const reset = () => setIterations(mode === 'prm' ? 20 : 20);
  const step = () => setIterations((current) => Math.min(180, current + 10));
  return (
    <figure className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border">
      <figcaption className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-border px-4 py-4 !pr-24">
        <span className="font-mono text-xs font-black text-violet-700 dark:text-violet-300">SEEDED SAMPLING LAB</span>
        <strong className="basis-full text-sm leading-snug sm:min-w-60 sm:flex-1 sm:basis-60">같은 C-space에서 roadmap과 exploration tree의 성장을 비교한다</strong>
        <span className={`basis-full font-mono text-xs font-black sm:basis-auto ${result.path.length ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-700 dark:text-amber-300'}`}>{result.path.length ? `path ${result.path.length} nodes` : '아직 연결 안 됨'}</span>
      </figcaption>
      <div className="grid gap-4 border-b border-border bg-violet-500/[0.025] p-4 lg:grid-cols-[minmax(0,18rem)_minmax(0,1fr)_auto] lg:items-end">
        <SegmentedControl label="Sampling planner" options={[{ value: 'prm', label: 'PRM' }, { value: 'rrt', label: 'RRT' }]} value={mode} onChange={(next) => { setMode(next); setIterations(100); }} />
        <label className="text-xs font-semibold text-muted-foreground">{mode === 'prm' ? 'Roadmap samples' : 'Tree iterations'} · {iterations}<input className="mt-3 block w-full accent-violet-700" type="range" min="20" max="180" step="10" value={iterations} onChange={(event) => setIterations(Number(event.target.value))} /></label>
        <div className="flex gap-2"><button type="button" onClick={reset} className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border bg-background" aria-label="샘플 수 초기화" title="초기화"><RotateCcw size={16} /></button><button type="button" onClick={step} className="inline-flex h-9 w-9 items-center justify-center rounded-md bg-violet-700 text-white" aria-label="10단계 진행" title="10단계 진행"><StepForward size={16} /></button></div>
      </div>
      <div className="p-3 sm:p-6">
        <svg viewBox="0 0 340 310" className="block h-auto w-full sm:hidden" role="img" aria-label="모바일 좁은 통로에서 PRM 또는 RRT가 만드는 graph">
          <rect x="18" y="26" width="304" height="248" rx="5" fill="currentColor" opacity="0.02" stroke="currentColor" strokeOpacity="0.14" />
          {SAMPLE_OBSTACLES.map((obstacle, index) => <rect key={index} x={mobileSx(obstacle.x0)} y={mobileSy(obstacle.y1)} width={(obstacle.x1 - obstacle.x0) * 304} height={(obstacle.y1 - obstacle.y0) * 248} fill="#f59e0b" opacity="0.18" stroke="#b45309" strokeWidth="2" />)}
          {result.edges.map(([a, b], index) => <line key={index} x1={mobileSx(result.nodes[a].x)} y1={mobileSy(result.nodes[a].y)} x2={mobileSx(result.nodes[b].x)} y2={mobileSy(result.nodes[b].y)} stroke={onPath(a, b) ? '#059669' : mode === 'prm' ? '#7c3aed' : '#2563eb'} strokeWidth={onPath(a, b) ? 4 : 1.4} strokeLinecap="round" opacity={onPath(a, b) ? 1 : 0.28} />)}
          {result.nodes.map((node, index) => <circle key={index} cx={mobileSx(node.x)} cy={mobileSy(node.y)} r={index === 0 || (mode === 'prm' && index === 1) || result.path.includes(index) ? 4.5 : 2.3} fill={index === 0 ? '#2563eb' : (mode === 'prm' && index === 1) || node === SAMPLE_GOAL ? '#7c3aed' : result.path.includes(index) ? '#059669' : mode === 'prm' ? '#7c3aed' : '#2563eb'} stroke={index < 2 ? 'white' : 'none'} strokeWidth="2" />)}
          {mode === 'rrt' && <circle cx={mobileSx(SAMPLE_GOAL.x)} cy={mobileSy(SAMPLE_GOAL.y)} r="6" fill="#7c3aed" stroke="white" strokeWidth="2" />}
          <g transform={`translate(${mobileSx(0.5) - 47},${mobileSy(0.76) - 10})`}><rect width="94" height="20" rx="4" fill="white" fillOpacity="0.92" stroke="#f59e0b" strokeOpacity="0.35" /><text x="47" y="14" textAnchor="middle" fontSize="11" fontWeight="800" fill="#92400e">narrow passage</text></g>
          <text x={mobileSx(SAMPLE_START.x) + 8} y={mobileSy(SAMPLE_START.y) + 18} fontSize="12" fontWeight="800" fill="#1d4ed8">start</text>
          <text x={mobileSx(SAMPLE_GOAL.x) - 30} y={mobileSy(SAMPLE_GOAL.y) - 10} fontSize="12" fontWeight="800" fill="#6d28d9">goal</text>
          <text x="18" y="299" fontSize="11" fill="currentColor" opacity="0.55">normalized 2D C-space · seeded</text>
        </svg>
        <svg viewBox="0 0 720 365" className="hidden h-auto w-full sm:block" role="img" aria-label="좁은 통로에서 PRM 또는 RRT가 만드는 graph">
          <rect x="42" y="46" width="636" height="280" rx="5" fill="currentColor" opacity="0.02" stroke="currentColor" strokeOpacity="0.14" />
          {SAMPLE_OBSTACLES.map((obstacle, index) => <rect key={index} x={sx(obstacle.x0)} y={sy(obstacle.y1)} width={(obstacle.x1 - obstacle.x0) * 636} height={(obstacle.y1 - obstacle.y0) * 280} fill="#f59e0b" opacity="0.18" stroke="#b45309" strokeWidth="2" />)}
          <text x={sx(0.5)} y={sy(0.76) + 4} textAnchor="middle" fontSize="15" fontWeight="800" fill="#92400e">narrow passage</text>
          {result.edges.map(([a, b], index) => <line key={index} x1={sx(result.nodes[a].x)} y1={sy(result.nodes[a].y)} x2={sx(result.nodes[b].x)} y2={sy(result.nodes[b].y)} stroke={onPath(a, b) ? '#059669' : mode === 'prm' ? '#7c3aed' : '#2563eb'} strokeWidth={onPath(a, b) ? 4 : 1.4} strokeLinecap="round" opacity={onPath(a, b) ? 1 : 0.28} />)}
          {result.nodes.map((node, index) => <circle key={index} cx={sx(node.x)} cy={sy(node.y)} r={index === 0 || (mode === 'prm' && index === 1) || result.path.includes(index) ? 5 : 2.6} fill={index === 0 ? '#2563eb' : (mode === 'prm' && index === 1) || node === SAMPLE_GOAL ? '#7c3aed' : result.path.includes(index) ? '#059669' : mode === 'prm' ? '#7c3aed' : '#2563eb'} stroke={index < 2 ? 'white' : 'none'} strokeWidth="2" />)}
          {mode === 'rrt' && <circle cx={sx(SAMPLE_GOAL.x)} cy={sy(SAMPLE_GOAL.y)} r="6" fill="#7c3aed" stroke="white" strokeWidth="2" />}
          <text x={sx(SAMPLE_START.x) + 10} y={sy(SAMPLE_START.y) + 20} fontSize="15" fontWeight="800" fill="#1d4ed8">start</text>
          <text x={sx(SAMPLE_GOAL.x) - 36} y={sy(SAMPLE_GOAL.y) - 12} fontSize="15" fontWeight="800" fill="#6d28d9">goal</text>
          <text x="42" y="350" fontSize="14" fill="currentColor" opacity="0.55">normalized 2D C-space · seeded sequence</text>
        </svg>
        <div className="mt-3 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
          <div className="bg-background p-3"><p className="text-xs font-semibold text-muted-foreground">Representation</p><p className="mt-1 text-sm font-bold">{mode === 'prm' ? 'Reusable undirected graph' : 'Start-rooted tree'}</p></div>
          <div className="bg-background p-3"><p className="text-xs font-semibold text-muted-foreground">Local work</p><p className="mt-1 text-sm font-bold">{mode === 'prm' ? 'Neighbor edge validation' : 'Nearest + bounded steer'}</p></div>
          <div className="bg-background p-3"><p className="text-xs font-semibold text-muted-foreground">Failure clue</p><p className="mt-1 text-sm font-bold">{mode === 'prm' ? 'Gap에 node/edge가 부족' : 'Gap 입구로 tree가 안 들어감'}</p></div>
        </div>
      </div>
    </figure>
  );
}

type PipelineStage = 'request' | 'plan' | 'smooth' | 'time' | 'revalidate' | 'execute';

function ExecutionPipeline() {
  const [stage, setStage] = useState<PipelineStage>('plan');
  const stages: Record<PipelineStage, { title: string; input: string; output: string; gate: string }> = {
    request: { title: '요청과 scene snapshot을 고정한다', input: 'q_start, goal, constraints, scene v41', output: 'versioned planning problem', gate: 'Start state와 attached geometry가 scene과 일치' },
    plan: { title: 'Planner는 geometric path를 찾는다', input: 'C_free callbacks + deadline', output: 'q(s), s in [0,1]', gate: '모든 state와 edge가 v41에서 valid' },
    smooth: { title: 'Shortcut과 optimization으로 불필요한 굴곡을 줄인다', input: 'collision-free waypoint path', output: 'shorter, smoother q(s)', gate: '각 shortcut을 다시 검사하고 clearance를 유지' },
    time: { title: '경로에 속도와 가속도 한계를 만족하는 시간을 붙인다', input: 'q(s), velocity/acceleration limits', output: 'q(t), q_dot(t), q_ddot(t)', gate: '모든 joint limit과 controller cycle을 만족' },
    revalidate: { title: '실행 직전 현실이 계획 때와 같은지 확인한다', input: 'scene v43, measured q_now', output: 'execute or replan decision', gate: 'v41 != v43 또는 start drift면 폐기' },
    execute: { title: 'Controller가 timestamped trajectory를 추적한다', input: 'timed joint trajectory', output: 'measured state and tracking error', gate: 'Deviation, collision monitor와 stop policy 활성' },
  };
  const item = stages[stage];
  return (
    <div className="foundation-viz-explorer not-prose my-8 rounded-md border border-border p-4 sm:p-6">
      <SegmentedControl label="Planning pipeline stage" options={[
        { value: 'request', label: '1. Request' }, { value: 'plan', label: '2. Plan' }, { value: 'smooth', label: '3. Smooth' },
        { value: 'time', label: '4. Time' }, { value: 'revalidate', label: '5. Recheck' }, { value: 'execute', label: '6. Execute' },
      ]} value={stage} onChange={setStage} />
      <div className="mt-5 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2">
        <div className="bg-background p-4 sm:col-span-2"><p className="text-xs font-bold text-muted-foreground">현재 책임</p><p className="mt-2 text-base font-bold">{item.title}</p></div>
        <div className="bg-background p-4"><p className="text-xs font-bold text-muted-foreground">입력</p><p className="mt-2 break-words font-mono text-sm font-semibold">{item.input}</p></div>
        <div className="bg-blue-500/[0.035] p-4"><p className="text-xs font-bold text-muted-foreground">출력</p><p className="mt-2 break-words font-mono text-sm font-semibold">{item.output}</p></div>
        <div className="bg-amber-500/[0.04] p-4 sm:col-span-2"><p className="text-xs font-bold text-muted-foreground">다음 단계로 넘기는 조건</p><p className="mt-2 text-sm font-semibold leading-relaxed">{item.gate}</p></div>
      </div>
    </div>
  );
}

export default function RobotMotionPlanningArticle() {
  return (
    <>
      <NlpSection id="pose-not-route" marker="01" tone="teal" question="IK가 충돌하지 않는 start와 goal pose를 찾았다면 그 둘을 바로 보간해도 될까?" title="IK는 자세를 주지만 그 사이의 안전한 길은 주지 않는다">
        <QuestionLead question="시작 자세와 도착 자세가 둘 다 안전한데 로봇이 왜 선반을 때릴까?" answer="충돌 검사는 한 configuration의 성질이고, 이동은 그 사이의 모든 configuration이 만드는 연속 경로의 성질이기 때문이다. 두 끝점만 검사하면 중간에 로봇 link가 차지하는 공간을 전부 놓칠 수 있다." />
        <ConceptPrimer items={[
          { term: 'Configuration q', meaning: '로봇의 모든 자유도를 한 점으로 정하는 좌표다. 2R arm이면 q = (q1, q2)다.', why: 'Planner가 검색하고 연결하는 최소 상태 단위를 정한다.' },
          { term: 'Workspace', meaning: 'Link, tool, shelf가 실제 길이와 부피를 가지고 놓이는 물리 공간이다.', why: 'Tool point만이 아니라 로봇 몸체 전체의 충돌을 검사한다.' },
          { term: 'Configuration space C', meaning: '모든 가능한 q가 놓이는 공간이다. 한 점이 workspace의 로봇 전체 자세를 대표한다.', why: '복잡한 몸체 충돌을 검색 가능한 금지 상태 집합으로 바꾼다.' },
          { term: 'Path q(s)', meaning: 's가 0에서 1로 갈 때 configuration이 이어지는 순수한 기하학적 곡선이다.', why: '어디로 갈지와 얼마나 빨리 갈지를 분리해 계획과 시간화를 혼동하지 않는다.' },
        ]} />
        <WorkspaceCspaceLab />
        <Misconception>Task-space에서 tool point만 장애물을 피한다고 robot 전체가 피하는 것은 아니다. Collision geometry는 base부터 모든 link, gripper와 attached object까지 포함해야 한다.</Misconception>
      </NlpSection>

      <NlpSection id="configuration-space" marker="02" tone="blue" question="복잡한 link와 obstacle의 겹침을 planner가 검색할 수 있는 형태로 어떻게 바꿀까?" title="C-obstacle은 몸체 충돌을 configuration point의 금지 영역으로 바꾼다">
        <p>Lozano-Perez의 핵심 환원은 물체끼리 매번 직접 겹치는 문제를 먼저 구조화하는 것이다. 현재 configuration에서 robot geometry를 배치하는 함수를 R(q), workspace obstacle의 합집합을 O라 하면, 둘이 겹치는 모든 q를 하나의 금지 집합으로 모을 수 있다.</p>
        <MathFormula display>{'\\mathcal C_{obs}=\\{q\\in\\mathcal C\\mid R(q)\\cap O\\neq\\varnothing\\},\\qquad \\mathcal C_{free}=\\mathcal C\\setminus\\mathcal C_{obs}'}</MathFormula>
        <FormulaNote meaning="Workspace에서 extended robot body가 obstacle과 겹치는 모든 configuration을 C-obstacle로 모은다. Planning은 이제 C_free 안에서 start와 goal을 잇는 연속 곡선을 찾는 문제다." symbols={[["\\mathcal C", 'Joint limits와 topology를 포함한 전체 configuration space'], ["R(q)", 'q에서 배치된 모든 robot collision geometry'], ["O", 'Shelf, wall, attached environment object의 합집합'], ["\\mathcal C_{free}", 'State와 path가 머물러야 하는 허용 영역']]} />
        <p>2R arm의 C-space는 단순한 종이가 아니라 두 각도가 주기적으로 이어진 torus다. 화면을 -pi와 +pi에서 잘라 평면으로 그릴 뿐, continuous revolute joint에서는 양쪽 경계가 같은 이웃이다. 따라서 nearest-neighbor와 path length도 topology를 알아야 한다.</p>
        <MathFormula display>{'d_{S^1}(\\theta_a,\\theta_b)=\\min_{k\\in\\mathbb Z}|\\theta_a-\\theta_b+2\\pi k|'}</MathFormula>
        <FormulaNote meaning="Continuous angle의 거리는 숫자축의 단순 차이가 아니라 2pi만큼 감은 후보 중 가장 짧은 이동이다. +179도와 -179도는 358도 떨어진 것이 아니라 2도 떨어져 있다." symbols={[["S^1", '끝이 이어진 회전 joint의 topology'], ["k", '2pi wrap의 정수 횟수'], ["d_{S^1}", 'Planner의 neighbor와 cost에 써야 할 wrapped distance']]} />
        <Takeaway>C-space obstacle이 free space를 여러 connected component로 나누면 어떤 search algorithm도 서로 다른 component의 start와 goal을 연결할 수 없다. Planner 실패와 문제 자체의 infeasibility를 구분해야 한다.</Takeaway>
      </NlpSection>

      <NlpSection id="edge-validity" marker="03" tone="amber" question="StateValid(start)와 StateValid(goal)이 참인데 왜 edge는 거짓일 수 있을까?" title="State validity와 motion validity는 서로 다른 callback이다">
        <MathFormula display>{'\\operatorname{MotionValid}(q_a,q_b)=\\bigwedge_{s\\in[0,1]}\\operatorname{StateValid}((1-s)q_a+s q_b)'}</MathFormula>
        <FormulaNote meaning="직선 local path를 graph edge로 넣으려면 보간 중 모든 configuration이 유효해야 한다. 실제 구현은 연속한 무한 점 대신 adaptive subdivision, conservative distance bound 또는 continuous collision detection을 사용한다." symbols={[["q_a,q_b", 'Edge의 두 endpoint configuration'], ["s", 'Edge 안의 기하학적 진행률'], ["\\bigwedge", '중간 어느 한 점이라도 invalid면 전체 edge를 거부'], ["\\operatorname{StateValid}", 'Joint limit, self-collision, environment collision과 constraint 검사']]} />
        <EdgeValidityLab />
        <p>고정된 간격으로만 검사하면 가장 얇은 obstacle보다 한 step이 길 때 충돌을 뛰어넘는다. 반대로 모든 edge를 매우 촘촘히 검사하면 collision checking이 planning runtime의 대부분을 차지한다. 그래서 geometry distance에 따른 adaptive subdivision, bounding volume hierarchy, continuous check, LazyPRM처럼 후보 path 위 edge를 늦게 검사하는 전략이 생긴다.</p>
        <Misconception>Collision resolution을 낮춘 결과가 “조금 덜 정확한 path”인 것은 아니다. 실제로 충돌하는 edge를 valid로 분류하는 논리 오류이며, robot radius와 calibration uncertainty까지 반영한 margin 없이는 모델상 free와 현실상 safe도 같지 않다.</Misconception>
      </NlpSection>

      <NlpSection id="graph-search" marker="04" tone="violet" question="C_free가 연속 공간이라면 A-star가 검색할 node와 edge는 어디서 생길까?" title="Grid와 roadmap이 free space를 graph로 만들고 A-star가 그 graph를 푼다">
        <p>Graph search는 free space를 발견하지 않는다. Grid, roadmap 또는 tree가 이미 만든 연결 관계 안에서 가장 싼 route를 고른다. A-star는 start에서 지금 node까지 확정된 비용 g와 goal까지의 낙관적 추정 h를 더해 다음 확장을 선택한다.</p>
        <MathFormula display>{'f(n)=g(n)+h(n),\\qquad 0\\le h(n)\\le h^*(n)'}</MathFormula>
        <FormulaNote meaning="h가 실제 남은 최단비용 h*를 넘지 않으면 A-star는 표현된 graph 안에서 optimal path를 보존한다. Heuristic이 완벽해도 narrow passage의 node나 edge가 graph에 없으면 해를 만들 수 없다." symbols={[["g(n)", 'Start에서 n까지 이미 지불한 edge cost'], ["h(n)", 'n에서 goal까지의 추정 cost'], ["h^*(n)", '실제 남은 최단 cost'], ["f(n)", '우선 확장할 node를 정하는 estimated total cost']]} />
        <AStarLab />
        <p>각 joint 축을 N개 cell로 나누면 d자유도 grid는 대략 N^d개의 cell을 가진다. 6 joints를 축마다 40칸만 나눠도 40^6 = 4.096 billion개다. Resolution을 낮추면 계산량은 줄지만 얇은 free passage 자체가 사라질 수 있다. 이것이 low-dimensional grid에서 sampling-based planning으로 넘어가는 이유다.</p>
      </NlpSection>

      <NlpSection id="prm" marker="05" tone="green" question="고차원 C-space 전체를 격자로 채우지 않고 여러 번 재사용할 연결 구조를 어떻게 만들까?" title="PRM은 collision-free samples와 local paths를 reusable roadmap으로 저장한다">
        <p>Kavraki 등의 PRM은 작업을 learning과 query로 나눈다. Learning phase는 free configuration을 뽑아 node로 저장하고, metric상 가까운 node 사이 local path를 collision check해 edge를 만든다. Query phase는 새 start와 goal을 roadmap에 붙인 뒤 graph search를 실행한다.</p>
        <ol>
          <li><strong>Sample:</strong> q를 뽑고 joint bounds와 StateValid를 통과한 것만 남긴다.</li>
          <li><strong>Neighbor:</strong> robot topology와 scale을 반영한 metric으로 후보 이웃을 고른다.</li>
          <li><strong>Local plan:</strong> 후보 사이 보간 또는 robot-specific connector가 MotionValid인지 검사한다.</li>
          <li><strong>Store:</strong> valid edge와 cost를 graph에 저장한다.</li>
          <li><strong>Query:</strong> start와 goal을 검사·연결하고 Dijkstra/A-star로 route를 찾는다.</li>
        </ol>
        <SamplingPlannerLab />
        <p>Narrow passage는 free volume이 작아 uniform sample이 거의 들어가지 않고, 입구 양쪽 sample도 local planner가 연결하지 못할 수 있다. 따라서 “PRM이 실패했다”는 말만으로는 sample coverage, metric, neighbor count, edge resolution, query connection과 search 중 어디가 병목인지 알 수 없다.</p>
        <Takeaway>PRM의 확률적 완전성은 sample 수를 무한히 늘릴 때 존재하는 robust path를 찾을 확률이 1로 간다는 뜻이다. 이번 1초 deadline에 반드시 찾는다는 뜻도, 첫 path가 가장 짧다는 뜻도 아니다.</Takeaway>
      </NlpSection>

      <NlpSection id="rrt" marker="06" tone="blue" question="Roadmap 전체를 만들지 않고 현재 start에서 goal을 향해 빠르게 한 번 탐색하려면?" title="RRT는 random target 쪽으로 tree를 조금씩 확장해 미탐색 영역을 채운다">
        <MathFormula display>{'q_{near}=\\arg\\min_{q\\in T}d(q,q_{rand}),\\qquad q_{new}=\\operatorname{Steer}(q_{near},q_{rand},\\eta)'}</MathFormula>
        <FormulaNote meaning="Random target에 가장 가까운 tree node를 찾고, 한 번에 갈 수 있는 step eta만큼 전진한 q_new와 edge가 valid할 때 tree에 추가한다. 넓게 비어 있는 Voronoi region을 가진 node가 random target의 nearest가 될 확률이 커서 exploration bias가 생긴다." symbols={[["T", 'Start에서 자란 현재 search tree'], ["q_{rand}", 'C-space에서 뽑은 exploration target'], ["q_{near}", 'Metric상 target에 가장 가까운 tree node'], ["\\eta", '한 extension의 최대 길이 또는 steering horizon']]} />
        <p>기본 RRT는 첫 feasible route를 빠르게 찾는 데 초점이 있고 shortest path를 보장하지 않는다. RRT-Connect는 start와 goal에서 두 tree를 공격적으로 잇고, RRT*는 이웃 재연결을 통해 sample 수가 늘수록 optimal cost로 수렴하는 성질을 추가한다. 이름의 별표 하나가 runtime과 보장 질문을 모두 바꾼다.</p>
        <div className="not-prose my-6 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-3">
          <div className="bg-background p-4"><p className="text-xs font-bold text-muted-foreground">PRM</p><p className="mt-2 text-sm font-semibold">Static scene의 여러 query에 roadmap 재사용</p></div>
          <div className="bg-blue-500/[0.035] p-4"><p className="text-xs font-bold text-muted-foreground">RRT / RRTConnect</p><p className="mt-2 text-sm font-semibold">한 start-goal query의 feasible route를 빠르게 탐색</p></div>
          <div className="bg-violet-500/[0.035] p-4"><p className="text-xs font-bold text-muted-foreground">PRM* / RRT*</p><p className="mt-2 text-sm font-semibold">계속 계산할수록 optimal cost로 수렴하는 계열</p></div>
        </div>
        <Misconception>RRT가 random이어서 metric이 중요하지 않은 것이 아니다. Angle wrap, translation과 rotation scale, nearest-neighbor structure와 Steer가 tree의 모양과 도달 가능한 motion을 직접 결정한다.</Misconception>
      </NlpSection>

      <NlpSection id="guarantees" marker="07" tone="amber" question="Planner가 complete 또는 optimal하다는 문장은 실제 실행에서 무엇을 보장하고 무엇을 보장하지 않을까?" title="Guarantee는 해의 존재, 표현 해상도, 확률과 비용 수렴을 각각 답한다">
        <div className="not-prose my-7 overflow-hidden rounded-md border border-border">
          <div className="grid grid-cols-[minmax(8rem,0.8fr)_minmax(0,1.7fr)] border-b border-border bg-muted/40 px-4 py-3 text-xs font-black"><span>용어</span><span>정확한 질문</span></div>
          {[
            ['Complete', '해가 있으면 유한 시간에 찾고, 없으면 없다고 판정하는가?'],
            ['Resolution complete', '선택한 discretization에서 표현 가능한 해가 있으면 찾는가?'],
            ['Probabilistically complete', 'Sample 수가 무한히 늘 때 기존 해를 찾을 확률이 1로 수렴하는가?'],
            ['Asymptotically optimal', '계산을 계속할 때 반환 cost가 optimal cost로 수렴하는가?'],
            ['Satisficing', 'Deadline 안에 constraints를 만족하는 경로 하나를 반환하는가?'],
          ].map(([term, explanation]) => <div key={term} className="grid grid-cols-[minmax(8rem,0.8fr)_minmax(0,1.7fr)] gap-3 border-b border-border px-4 py-3 last:border-b-0"><strong className="text-sm">{term}</strong><span className="text-sm leading-relaxed text-muted-foreground">{explanation}</span></div>)}
        </div>
        <p>Production에서는 theoretical limit뿐 아니라 termination condition, random seed, planning deadline, state-validity resolution과 objective가 결과의 일부다. 같은 RRTConnect라도 50 ms와 5 s, 잘못된 robot radius와 올바른 radius는 전혀 다른 시스템이다.</p>
      </NlpSection>

      <NlpSection id="execution-handoff" marker="08" tone="teal" question="Collision-free waypoint list가 나왔다면 controller에 바로 보내도 될까?" title="Geometric path에 시간과 현실 검증을 붙여야 executable trajectory가 된다">
        <p>Path q(s)는 어디를 지나갈지만 말한다. Controller는 매 control tick에 언제 어느 joint position과 velocity를 추적할지 필요하다. Time scaling s(t)를 붙이면 chain rule로 velocity와 acceleration이 정해진다.</p>
        <MathFormula display>{'\\dot q=\\frac{dq}{ds}\\dot s,\\qquad \\ddot q=\\frac{dq}{ds}\\ddot s+\\frac{d^2q}{ds^2}\\dot s^2'}</MathFormula>
        <FormulaNote meaning="같은 geometric path라도 s(t)를 빠르게 진행하면 joint velocity와 acceleration이 커진다. Time parameterization은 URDF 또는 joint limit 설정의 최대 속도·가속도를 만족하는 timestamped trajectory를 만든다." symbols={[["q(s)", 'Planner와 smoother가 만든 geometric joint path'], ["s(t)", '경로 진행률을 실제 시간에 연결하는 time scaling'], ["\\dot q", 'Controller가 추적할 joint velocity'], ["\\ddot q", 'Actuator와 dynamics가 감당해야 할 joint acceleration']]} />
        <ExecutionPipeline />
        <p>Smoothing은 waypoint 수와 굴곡을 줄이지만 shortcut마다 collision을 다시 검사해야 한다. Length만 줄이면 obstacle 표면에 붙어 model error에 취약할 수 있으므로 minimum clearance, joint-limit margin과 smoothness를 함께 본다. 마지막으로 plan이 scene v41에서 계산됐는데 attached box로 v43이 되었다면 성공한 path도 폐기해야 한다.</p>
        <CapabilityCheck items={[
          'Workspace obstacle이 joint C-space에서 왜 곡선 형태의 forbidden region이 되는지 설명한다.',
          'State-valid endpoint와 motion-valid edge를 구분하고 collision resolution의 실패를 진단한다.',
          'A-star의 graph-search 보장과 roadmap coverage 실패를 분리한다.',
          'PRM과 RRT를 multi-query/single-query, graph/tree, local connector 관점에서 비교한다.',
          'Probabilistic completeness와 asymptotic optimality를 deadline 내 성공 또는 first-path optimality로 오해하지 않는다.',
          'Geometric q(s)를 timed q(s(t))로 바꾸고 scene/start-state 재검증 뒤 controller에 넘긴다.',
        ]} />
        <Takeaway>다음 단계에서는 path에 붙인 시간, robot dynamics와 contact를 더 깊게 내려간다. Planner는 가능한 기하를 제안하고, trajectory generator는 limits를 지키는 시간을 붙이며, feedback controller는 변하는 현실에서 그 trajectory를 추적한다.</Takeaway>
        <LearningHandoff
          description="Planner가 만든 것은 아직 실행 명령이 아니라 scene version에 대해 유효한 geometric path다. 시간 제약과 폐루프 추적은 뒤 단계가 소유한다."
          items={[
            { label: '막히면', slug: 'robot-kinematics-coordinate-frames', title: 'Robot Kinematics & Coordinate Frames', reason: 'Configuration, forward kinematics와 IK branch가 collision geometry를 어떻게 배치하는지 복습한다.' },
            { label: '이어 읽기', slug: 'robot-trajectory-generation', title: 'Robot Trajectory Generation', reason: 'Path q(s)에 velocity·acceleration·torque·jerk limit을 만족하는 time scaling을 붙인다.' },
            { label: '적용하기', slug: 'robot-dynamics-feedback-control', title: 'Robot Dynamics & Feedback Control', reason: 'Timed reference가 disturbance와 saturation 아래에서도 추적되는지 폐루프로 검증한다.' },
          ]}
        />
        <SourceNotes sources={[
          { label: 'T. Lozano-Perez, Spatial Planning: A Configuration Space Approach (1983)', href: 'https://lis.csail.mit.edu/pubs/tlp/spatial-planning.pdf', note: 'Findspace, Findpath와 configuration-space obstacle 환원의 1차 출처다.' },
          { label: 'Lynch & Park, Modern Robotics Chapter 10', href: 'https://modernrobotics.northwestern.edu/chapters/chapter10/', note: 'C-space, graph search, grid, PRM, RRT와 planning 방법의 공식 교재·영상이다.' },
          { label: 'Kavraki et al., Probabilistic Roadmaps (1996)', href: 'https://www.kavrakilab.org/publications/kavraki-svestka1996probabilistic-roadmaps-for.html', note: 'Learning/query phase와 reusable roadmap의 원 논문·공식 저자 페이지다.' },
          { label: 'S. M. LaValle, Rapidly-Exploring Random Trees (1998)', href: 'https://lavalle.pl/papers/Lav98c.pdf', note: 'Random target, nearest extension과 exploration-biased tree의 1차 출처다.' },
          { label: 'OMPL Available Planners', href: 'https://docs.ros.org/en/iron/p/ompl/doc/markdown/planners.html', note: 'PRM, LazyPRM, RRTConnect와 optimal variants의 현재 구현 계열을 확인한다.' },
          { label: 'MoveIt Motion Planning Pipeline', href: 'https://moveit.picknik.ai/main/doc/examples/motion_planning_pipeline/motion_planning_pipeline_tutorial.html', note: 'PlanningScene, planner adapters와 path 후처리의 production 연결을 확인한다.' },
          { label: 'MoveIt Time Parameterization', href: 'https://moveit.picknik.ai/main/doc/examples/time_parameterization/time_parameterization_tutorial.html', note: 'Kinematic path에 velocity·acceleration-constrained timing을 붙이는 책임을 확인한다.' },
        ]} />
      </NlpSection>
    </>
  );
}
