import { useId, useMemo, useState } from 'react';
import { ArrowRight, Copy, Equal, Move3D, RotateCw } from 'lucide-react';

type SegmentOption<T extends string> = {
  value: T;
  label: string;
};

function Segmented<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div
      role="group"
      aria-label={label}
      className="grid min-w-0 gap-1 rounded-md border border-border bg-background p-1 sm:w-auto"
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className={`min-h-11 rounded px-3 py-2 text-xs font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
            value === option.value
              ? 'bg-foreground text-background'
              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function formatNumber(value: number, digits = 2) {
  const rounded = Number(value.toFixed(digits));
  return Object.is(rounded, -0) ? '0' : String(rounded);
}

function MetricStrip({ items }: { items: Array<{ label: string; value: string; note?: string; accent?: boolean }> }) {
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border">
      {items.map((item) => (
        <div key={item.label} className="min-w-0 bg-background p-3">
          <dt className="text-xs font-semibold leading-relaxed text-muted-foreground">{item.label}</dt>
          <dd className={`mt-1 break-words font-mono text-base font-bold ${item.accent ? 'text-teal-700 dark:text-teal-300' : ''}`}>{item.value}</dd>
          {item.note && <dd className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.note}</dd>}
        </div>
      ))}
    </dl>
  );
}

type CoordinateMode = 'basis' | 'vector';

export function CoordinateFrameLab() {
  const [mode, setMode] = useState<CoordinateMode>('basis');
  const [angle, setAngle] = useState(30);
  const arrowId = useId().replace(/:/g, '');
  const radians = angle * Math.PI / 180;
  const baseVector = { x: 3.2, y: 1.6 };
  const world = mode === 'basis'
    ? baseVector
    : {
        x: baseVector.x * Math.cos(radians) - baseVector.y * Math.sin(radians),
        y: baseVector.x * Math.sin(radians) + baseVector.y * Math.cos(radians),
      };
  const basisAngle = mode === 'basis' ? radians : 0;
  const e1 = { x: Math.cos(basisAngle), y: Math.sin(basisAngle) };
  const e2 = { x: -Math.sin(basisAngle), y: Math.cos(basisAngle) };
  const coordinate = {
    x: world.x * e1.x + world.y * e1.y,
    y: world.x * e2.x + world.y * e2.y,
  };
  const reconstructed = {
    x: coordinate.x * e1.x + coordinate.y * e2.x,
    y: coordinate.x * e1.y + coordinate.y * e2.y,
  };
  const center = { x: 205, y: 155 };
  const scale = 43;
  const point = (vector: { x: number; y: number }, length = scale) => ({
    x: center.x + vector.x * length,
    y: center.y - vector.y * length,
  });
  const vectorPoint = point(world);
  const e1Point = point(e1, 112);
  const e2Point = point(e2, 112);
  const e1Label = point({
    x: 0.72 * e1.x + 0.16 * e2.x,
    y: 0.72 * e1.y + 0.16 * e2.y,
  }, 112);
  const e2Label = point({
    x: 0.72 * e2.x - 0.16 * e1.x,
    y: 0.72 * e2.y - 0.16 * e1.y,
  }, 112);
  const firstLeg = point({ x: coordinate.x * e1.x, y: coordinate.x * e1.y });

  return (
    <figure
      data-coordinate-frame-lab
      data-coordinate-mode={mode}
      data-coordinate-x={formatNumber(coordinate.x, 4)}
      data-coordinate-y={formatNumber(coordinate.y, 4)}
      data-world-x={formatNumber(world.x, 4)}
      data-world-y={formatNumber(world.y, 4)}
      className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border"
    >
      <figcaption className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-4 py-4 sm:pl-6 sm:pr-16">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Coordinate frame lab</p>
          <p className="mt-1 text-base font-bold">숫자가 바뀐 것과 대상이 움직인 것을 분리한다</p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 dark:text-teal-300">
          {mode === 'basis' ? <RotateCw className="h-4 w-4" aria-hidden="true" /> : <Move3D className="h-4 w-4" aria-hidden="true" />}
          {mode === 'basis' ? 'world vector 고정' : 'basis 고정'}
        </span>
      </figcaption>

      <div className="grid gap-4 border-b border-border bg-muted/20 p-4 sm:grid-cols-[auto_minmax(0,1fr)] sm:items-end sm:px-6">
        <Segmented
          label="회전시킬 대상"
          options={[
            { value: 'basis', label: '기준축을 회전' },
            { value: 'vector', label: '벡터를 회전' },
          ]}
          value={mode}
          onChange={setMode}
        />
        <label htmlFor="coordinate-frame-angle" className="block min-w-0 text-xs font-semibold text-muted-foreground">
          회전 각도 · <span className="font-mono text-foreground">{angle}°</span>
          <input
            id="coordinate-frame-angle"
            type="range"
            min="-75"
            max="75"
            step="5"
            value={angle}
            onChange={(event) => setAngle(Number(event.target.value))}
            className="mt-2 block min-h-11 w-full accent-teal-700"
          />
        </label>
      </div>

      <div className="grid min-w-0 gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(16rem,0.85fr)] lg:items-center">
        <div className="min-w-0">
          <svg viewBox="0 0 410 310" className="h-auto w-full" role="img" aria-label={`기준축 각도 ${mode === 'basis' ? angle : 0}도, world vector 좌표 ${formatNumber(world.x)}, ${formatNumber(world.y)}`}>
            <defs>
              <marker id={`${arrowId}-neutral`} markerWidth="8" markerHeight="8" refX="6.5" refY="3.5" orient="auto">
                <path d="M0 0 L7 3.5 L0 7Z" fill="currentColor" />
              </marker>
              <marker id={`${arrowId}-teal`} markerWidth="8" markerHeight="8" refX="6.5" refY="3.5" orient="auto">
                <path d="M0 0 L7 3.5 L0 7Z" fill="#0f766e" />
              </marker>
            </defs>
            {[45, 85, 125, 165, 205, 245, 285, 325, 365].map((x) => <line key={`vx-${x}`} x1={x} y1="28" x2={x} y2="282" stroke="var(--border)" strokeOpacity="0.55" />)}
            {[35, 75, 115, 155, 195, 235, 275].map((y) => <line key={`hy-${y}`} x1="26" y1={y} x2="385" y2={y} stroke="var(--border)" strokeOpacity="0.55" />)}
            <line x1="26" y1={center.y} x2="385" y2={center.y} stroke="var(--muted-foreground)" strokeOpacity="0.55" />
            <line x1={center.x} y1="282" x2={center.x} y2="28" stroke="var(--muted-foreground)" strokeOpacity="0.55" />

            <line
              x1={center.x}
              y1={center.y}
              x2={e1Point.x}
              y2={e1Point.y}
              stroke="var(--foreground)"
              strokeWidth="1.5"
              markerEnd={`url(#${arrowId}-neutral)`}
            />
            <line
              x1={center.x}
              y1={center.y}
              x2={e2Point.x}
              y2={e2Point.y}
              stroke="var(--foreground)"
              strokeWidth="1.5"
              markerEnd={`url(#${arrowId}-neutral)`}
            />
            <text x={e1Label.x} y={e1Label.y} textAnchor="middle" fontSize="15" fontWeight="700" fill="var(--foreground)">e′₁</text>
            <text x={e2Label.x} y={e2Label.y} textAnchor="middle" fontSize="15" fontWeight="700" fill="var(--foreground)">e′₂</text>

            <line x1={center.x} y1={center.y} x2={firstLeg.x} y2={firstLeg.y} stroke="#0f766e" strokeWidth="1.5" strokeDasharray="5 5" />
            <line x1={firstLeg.x} y1={firstLeg.y} x2={vectorPoint.x} y2={vectorPoint.y} stroke="#0f766e" strokeWidth="1.5" strokeDasharray="5 5" />
            <line
              x1={center.x}
              y1={center.y}
              x2={vectorPoint.x}
              y2={vectorPoint.y}
              stroke="#0f766e"
              strokeWidth="2.5"
              strokeLinecap="round"
              markerEnd={`url(#${arrowId}-teal)`}
              className="transition-all duration-300 motion-reduce:transition-none"
            />
            <circle cx={vectorPoint.x} cy={vectorPoint.y} r="4.5" fill="#0f766e" />
            <text x={vectorPoint.x - 7} y={vectorPoint.y - 12} fontSize="16" fontWeight="800" fill="#0f766e">v</text>
          </svg>
        </div>

        <div className="min-w-0 border-t border-border pt-5 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <p className="text-xs font-semibold text-muted-foreground">같은 끝점을 두 단계로 복원</p>
          <div className="mt-3 space-y-3">
            <div className="border-l-2 border-teal-600 px-3 py-2">
              <p className="text-xs text-muted-foreground">새 basis에서 읽은 coordinate</p>
              <p className="mt-1 font-mono text-lg font-bold">[v]E′ = [{formatNumber(coordinate.x)}, {formatNumber(coordinate.y)}]</p>
            </div>
            <div className="flex min-w-0 items-center gap-2 text-xs leading-relaxed text-muted-foreground">
              <Equal className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="break-words font-mono">({formatNumber(coordinate.x)})e′₁ + ({formatNumber(coordinate.y)})e′₂</span>
            </div>
            <div className="border-l-2 border-foreground px-3 py-2">
              <p className="text-xs text-muted-foreground">복원된 world vector</p>
              <p className="mt-1 font-mono text-lg font-bold">({formatNumber(reconstructed.x)}, {formatNumber(reconstructed.y)})</p>
            </div>
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {mode === 'basis'
              ? '기준축만 움직였으므로 좌표 숫자는 달라져도 청록색 화살표의 끝점은 움직이지 않는다.'
              : '기준축은 그대로인데 화살표 자체를 돌렸으므로 world 좌표와 끝점이 함께 바뀐다.'}
          </p>
        </div>
      </div>
    </figure>
  );
}

export function SimilarityProjectionLab() {
  const [angle, setAngle] = useState(55);
  const [length, setLength] = useState(1.4);
  const arrowId = useId().replace(/:/g, '');
  const radians = angle * Math.PI / 180;
  const dot = length * Math.cos(radians);
  const cosine = length === 0 ? null : Math.cos(radians);
  const center = { x: 210, y: 235 };
  const scale = 82;
  const endpoint = {
    x: center.x + length * scale * Math.cos(radians),
    y: center.y - length * scale * Math.sin(radians),
  };
  const foot = { x: endpoint.x, y: center.y };

  return (
    <figure
      data-similarity-projection-lab
      data-dot={formatNumber(dot, 4)}
      data-cosine={cosine === null ? 'undefined' : formatNumber(cosine, 4)}
      className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border"
    >
      <figcaption className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-4 py-4 sm:pl-6 sm:pr-16">
        <div>
          <p className="text-xs font-semibold uppercase text-muted-foreground">Similarity & projection lab</p>
          <p className="mt-1 text-base font-bold">길이와 방향을 따로 바꾸며 어떤 점수가 움직이는지 본다</p>
        </div>
        <span className="font-mono text-xs font-bold text-violet-700 dark:text-violet-300">a = unit vector</span>
      </figcaption>

      <div className="grid gap-4 border-b border-border bg-muted/20 p-4 sm:grid-cols-2 sm:px-6">
        <label htmlFor="similarity-angle" className="block text-xs font-semibold text-muted-foreground">
          b의 방향 · <span className="font-mono text-foreground">{angle}°</span>
          <input id="similarity-angle" type="range" min="0" max="180" step="5" value={angle} onChange={(event) => setAngle(Number(event.target.value))} className="mt-2 block min-h-11 w-full accent-violet-700" />
        </label>
        <label htmlFor="similarity-length" className="block text-xs font-semibold text-muted-foreground">
          b의 길이 · <span className="font-mono text-foreground">{length.toFixed(1)}</span>
          <input id="similarity-length" type="range" min="0" max="2.2" step="0.1" value={length} onChange={(event) => setLength(Number(event.target.value))} className="mt-2 block min-h-11 w-full accent-violet-700" />
        </label>
      </div>

      <div className="grid min-w-0 gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,1fr)_minmax(17rem,0.8fr)] lg:items-center">
        <svg viewBox="0 0 420 300" className="h-auto w-full" role="img" aria-label={`unit vector a와 각도 ${angle}도, 길이 ${length.toFixed(1)}인 vector b의 projection`}>
          <defs>
            <marker id={`${arrowId}-a`} markerWidth="8" markerHeight="8" refX="6.5" refY="3.5" orient="auto"><path d="M0 0 L7 3.5 L0 7Z" fill="#2563eb" /></marker>
            <marker id={`${arrowId}-b`} markerWidth="8" markerHeight="8" refX="6.5" refY="3.5" orient="auto"><path d="M0 0 L7 3.5 L0 7Z" fill="#7c3aed" /></marker>
          </defs>
          <line x1="20" y1={center.y} x2="400" y2={center.y} stroke="var(--border)" strokeWidth="1.5" />
          <line x1={center.x} y1="25" x2={center.x} y2="275" stroke="var(--border)" strokeWidth="1.5" />
          <line x1={center.x} y1={center.y} x2={center.x + scale} y2={center.y} stroke="#2563eb" strokeWidth="2.5" markerEnd={`url(#${arrowId}-a)`} />
          <text x={center.x + scale + 10} y={center.y + 5} fontSize="16" fontWeight="800" fill="#2563eb">a</text>
          {length > 0 && (
            <>
              <line x1={center.x} y1={center.y} x2={endpoint.x} y2={endpoint.y} stroke="#7c3aed" strokeWidth="2.5" markerEnd={`url(#${arrowId}-b)`} className="transition-all duration-300 motion-reduce:transition-none" />
              <line x1={endpoint.x} y1={endpoint.y} x2={foot.x} y2={foot.y} stroke="#7c3aed" strokeWidth="1.5" strokeDasharray="5 5" />
              <circle cx={foot.x} cy={foot.y} r="4" fill="#7c3aed" />
              <text x={endpoint.x + 7} y={endpoint.y - 8} fontSize="16" fontWeight="800" fill="#7c3aed">b</text>
              <text x={(center.x + foot.x) / 2 - 18} y={center.y + 24} fontSize="14" fontWeight="700" fill="#7c3aed">compₐ(b)</text>
            </>
          )}
          {length === 0 && <circle cx={center.x} cy={center.y} r="7" fill="#7c3aed" />}
        </svg>

        <div className="min-w-0">
          <MetricStrip items={[
            { label: 'dot · 길이와 방향', value: formatNumber(dot, 3), accent: true },
            { label: 'cosine · 방향만', value: cosine === null ? '정의 안 됨' : formatNumber(cosine, 3) },
            { label: 'scalar projection', value: formatNumber(dot, 3), note: 'a가 unit이므로 dot과 같음' },
            { label: 'vector projection', value: `[${formatNumber(dot, 3)}, 0]`, note: 'a=(1,0)이므로 compₐ(b)·a' },
          ]} />
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {length === 0
              ? '길이가 0인 vector에는 방향이 없다. 분모가 0이므로 cosine similarity도 정의할 수 없다.'
              : '길이 slider만 움직이면 dot과 projection은 같이 변하지만 cosine은 그대로다. 방향만 비교할지, 크기까지 score에 남길지를 먼저 선택해야 한다.'}
          </p>
        </div>
      </div>
    </figure>
  );
}

type ContractionMode = 'linear' | 'batched' | 'attention';
type StorageConvention = 'math' | 'pytorch';

const linearX = [
  [1, 2, -1],
  [0, 3, 2],
];
const linearW = [
  [2, -1],
  [0.5, 1],
  [-2, 0.25],
];
const batchedX = [
  [[1, 2], [-1, 3], [2, 0]],
  [[0, 1], [2, -2], [1, 4]],
];
const batchedW = [
  [1, -1, 0.5],
  [2, 0.25, -0.5],
];
const attentionQ = [
  [[1, 0], [0.5, 1], [-1, 0.5]],
  [[0, 1], [1, 1], [0.5, -0.5]],
];
const attentionK = [
  [[1, 1], [0, 1], [-1, 0]],
  [[1, 0], [0.5, 1], [-0.5, 1]],
];

function TermRow({ terms, total }: { terms: Array<{ left: number; right: number; index: string }>; total: number }) {
  return (
    <div className="min-w-0">
      <p className="mb-2 text-xs font-semibold text-muted-foreground">선택한 출력 한 칸의 실제 합</p>
      <div className="flex min-w-0 flex-wrap items-center gap-2">
        {terms.map((term, index) => (
          <div key={term.index} className="contents">
            <span className="inline-flex min-h-11 items-center gap-1.5 rounded border border-border bg-background px-3 font-mono text-sm font-bold">
              <span className="text-sky-700 dark:text-sky-300">{formatNumber(term.left)}</span>
              <span aria-hidden="true">×</span>
              <span className="text-violet-700 dark:text-violet-300">{formatNumber(term.right)}</span>
            </span>
            {index < terms.length - 1 && <span className="font-mono text-muted-foreground" aria-hidden="true">+</span>}
          </div>
        ))}
        <span className="font-mono text-muted-foreground" aria-hidden="true">=</span>
        <strong className="font-mono text-lg">{formatNumber(total, 3)}</strong>
      </div>
    </div>
  );
}

export function ShapeContractionLab() {
  const [mode, setMode] = useState<ContractionMode>('linear');
  const [convention, setConvention] = useState<StorageConvention>('math');
  const [row, setRow] = useState(0);
  const [column, setColumn] = useState(0);
  const [batch, setBatch] = useState(0);
  const [token, setToken] = useState(0);
  const [head, setHead] = useState(0);
  const safeRow = mode === 'linear' ? row % 2 : token % 3;
  const safeColumn = mode === 'attention' ? column % 3 : column % (mode === 'linear' ? 2 : 3);

  const calculation = useMemo(() => {
    if (mode === 'linear') {
      const terms = linearX[safeRow].map((left, d) => ({ left, right: linearW[d][safeColumn], index: `d${d}` }));
      return {
        shapes: ['X [2,3]', convention === 'math' ? 'W [3,2]' : 'A 저장 [2,3]', 'Y [2,2]'],
        labels: ['sample', '입력 특징 D', '출력 특징 O'],
        index: `Y[${safeRow},${safeColumn}]`,
        terms,
        total: terms.reduce((sum, term) => sum + term.left * term.right, 0),
        equation: convention === 'math' ? 'Y = XW' : 'Y = XAᵀ',
      };
    }
    if (mode === 'batched') {
      const terms = batchedX[batch][safeRow].map((left, d) => ({ left, right: batchedW[d][safeColumn], index: `d${d}` }));
      return {
        shapes: ['X [2,3,2]', convention === 'math' ? 'W [2,3]' : 'A 저장 [3,2]', 'Y [2,3,3]'],
        labels: ['B,T는 보존', '입력 특징 D', '출력 특징 O'],
        index: `Y[${batch},${safeRow},${safeColumn}]`,
        terms,
        total: terms.reduce((sum, term) => sum + term.left * term.right, 0),
        equation: convention === 'math' ? 'Y[b,t,o] = Σd X[b,t,d]W[d,o]' : 'Y[b,t,o] = Σd X[b,t,d]A[o,d]',
      };
    }
    const terms = attentionQ[head][safeRow].map((left, d) => ({ left, right: attentionK[head][safeColumn][d], index: `d${d}` }));
    return {
      shapes: ['Q [1,2,3,2]', 'Kᵀ [1,2,2,3]', 'S [1,2,3,3]'],
      labels: ['B,H,Tq,Dh', 'B,H,Dh,Tk', 'B,H,Tq,Tk'],
      index: `S[0,${head},${safeRow},${safeColumn}]`,
      terms,
      total: terms.reduce((sum, term) => sum + term.left * term.right, 0),
      equation: 'S[b,h,t,s] = Σd Q[b,h,t,d]K[b,h,s,d]',
    };
  }, [batch, convention, head, mode, safeColumn, safeRow]);

  return (
    <figure
      data-shape-contraction-lab
      data-contraction-mode={mode}
      data-contraction-index={calculation.index}
      data-contraction-total={formatNumber(calculation.total, 4)}
      className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border"
    >
      <figcaption className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-4 py-4 sm:pl-6 sm:pr-16">
        <div>
          <p className="text-xs font-semibold uppercase text-muted-foreground">Shape contraction lab</p>
          <p className="mt-1 text-base font-bold">출력 한 칸은 사라진 축을 모두 더한 결과다</p>
        </div>
        <span className="font-mono text-xs font-bold text-sky-700 dark:text-sky-300">{calculation.index}</span>
      </figcaption>

      <div className="grid gap-3 border-b border-border bg-muted/20 p-4 sm:px-6 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
        <div role="group" aria-label="tensor contraction 예제" className="grid grid-cols-3 gap-1 rounded-md border border-border bg-background p-1">
          {([
            ['linear', '2D Linear'],
            ['batched', 'Batch Linear'],
            ['attention', 'Attention'],
          ] as Array<[ContractionMode, string]>).map(([value, label]) => (
            <button key={value} type="button" aria-pressed={mode === value} onClick={() => setMode(value)} className={`min-h-11 rounded px-2 py-2 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${mode === value ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>{label}</button>
          ))}
        </div>
        {mode !== 'attention' ? (
          <Segmented
            label="weight 표기 규약"
            options={[
              { value: 'math', label: '교재 W[D,O]' },
              { value: 'pytorch', label: 'PyTorch A[O,D]' },
            ]}
            value={convention}
            onChange={setConvention}
          />
        ) : (
          <div className="flex min-h-11 items-center rounded-md border border-border bg-background px-3 text-xs leading-relaxed text-muted-foreground">
            K의 마지막 두 축만 바꿔 D<sub>h</sub>를 합한다.
          </div>
        )}
      </div>

      <div className="p-4 sm:p-6">
        <div className="grid min-w-0 gap-2 lg:grid-cols-[minmax(0,1fr)_1.75rem_minmax(0,1fr)_1.75rem_minmax(0,1fr)] lg:items-stretch">
          {calculation.shapes.map((shape, index) => (
            <div key={shape} className="contents">
              <div className={`min-w-0 border px-4 py-4 ${index === 2 ? 'border-sky-500/40 bg-sky-500/[0.05]' : 'border-border bg-background'}`}>
                <p className="font-mono text-base font-bold">{shape}</p>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{calculation.labels[index]}</p>
                {index === 1 && <p className="mt-2 text-xs font-semibold text-violet-700 dark:text-violet-300">청록 입력과 곱해 합산할 축</p>}
              </div>
              {index < 2 && (
                <span className="flex items-center justify-center py-1 text-muted-foreground" aria-hidden="true">
                  <ArrowRight className="h-4 w-4 rotate-90 lg:rotate-0" />
                </span>
              )}
            </div>
          ))}
        </div>

        <div className="mt-5 grid gap-4 border-y border-border py-5 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:items-end">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {mode === 'batched' && (
              <button type="button" onClick={() => setBatch((value) => (value + 1) % 2)} className="min-h-11 rounded-md border border-border px-3 py-2 text-xs font-semibold hover:bg-muted">batch b={batch}</button>
            )}
            {mode === 'attention' && (
              <button type="button" onClick={() => setHead((value) => (value + 1) % 2)} className="min-h-11 rounded-md border border-border px-3 py-2 text-xs font-semibold hover:bg-muted">head h={head}</button>
            )}
            <button type="button" onClick={() => (mode === 'linear' ? setRow((value) => (value + 1) % 2) : setToken((value) => (value + 1) % 3))} className="min-h-11 rounded-md border border-border px-3 py-2 text-xs font-semibold hover:bg-muted">{mode === 'linear' ? `row i=${safeRow}` : `query t=${safeRow}`}</button>
            <button type="button" onClick={() => setColumn((value) => value + 1)} className="min-h-11 rounded-md border border-border px-3 py-2 text-xs font-semibold hover:bg-muted">{mode === 'attention' ? `key s=${safeColumn}` : `output o=${safeColumn}`}</button>
          </div>
          <p className="break-words text-left font-mono text-xs font-bold leading-relaxed text-muted-foreground lg:text-right">{calculation.equation}</p>
        </div>

        <div className="mt-5">
          <TermRow terms={calculation.terms} total={calculation.total} />
        </div>
      </div>
    </figure>
  );
}

type LayoutStage = 'original' | 'permuted' | 'reshaped' | 'contiguous';
type DType = 'fp32' | 'bf16' | 'int8';

const dtypeBytes: Record<DType, number> = {
  fp32: 4,
  bf16: 2,
  int8: 1,
};

const layoutStages: Record<LayoutStage, { label: string; operation: string; shape: string; stride: string; storage: string; contiguous: string }> = {
  original: { label: '원본', operation: 'x', shape: '[3,2,5]', stride: '[10,5,1]', storage: '원본 storage', contiguous: '예' },
  permuted: { label: '축 교환', operation: 'x.permute(0,2,1)', shape: '[3,5,2]', stride: '[10,1,5]', storage: '원본과 공유', contiguous: '아니오' },
  reshaped: { label: '평탄화', operation: 'permuted.reshape(3,10)', shape: '[3,10]', stride: '[10,1]', storage: '이 예제는 copy', contiguous: '예' },
  contiguous: { label: '연속화', operation: 'permuted.contiguous()', shape: '[3,5,2]', stride: '[10,2,1]', storage: '새 storage', contiguous: '예' },
};

function formatBytes(bytes: number) {
  if (bytes >= 1024 ** 3) return `${formatNumber(bytes / 1024 ** 3, 2)} GiB`;
  if (bytes >= 1024 ** 2) return `${formatNumber(bytes / 1024 ** 2, 2)} MiB`;
  if (bytes >= 1024) return `${formatNumber(bytes / 1024, 2)} KiB`;
  return `${bytes} B`;
}

export function TensorLayoutMemoryLab() {
  const [stage, setStage] = useState<LayoutStage>('original');
  const [dtype, setDtype] = useState<DType>('bf16');
  const [tokens, setTokens] = useState(2048);
  const current = layoutStages[stage];
  const kvBytes = 1 * tokens * 24 * 2 * 8 * 64 * dtypeBytes[dtype];
  const perToken = 1 * 24 * 2 * 8 * 64 * dtypeBytes[dtype];

  return (
    <figure
      data-tensor-layout-memory-lab
      data-layout-stage={stage}
      data-kv-bytes={String(kvBytes)}
      className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border"
    >
      <figcaption className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-4 py-4 sm:pl-6 sm:pr-16">
        <div>
          <p className="text-xs font-semibold uppercase text-muted-foreground">Layout & memory lab</p>
          <p className="mt-1 text-base font-bold">같은 30개 값도 읽는 순서와 byte 비용은 다르다</p>
        </div>
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-300">
          {current.storage.includes('공유') || current.storage.includes('원본') ? <Equal className="h-4 w-4" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
          {current.storage}
        </span>
      </figcaption>

      <div className="border-b border-border bg-muted/20 p-4 sm:px-6">
        <div role="group" aria-label="tensor layout operation" className="grid grid-cols-2 gap-1 rounded-md border border-border bg-background p-1 sm:grid-cols-4">
          {(Object.entries(layoutStages) as Array<[LayoutStage, typeof layoutStages[LayoutStage]]>).map(([value, item]) => (
            <button key={value} type="button" aria-pressed={stage === value} onClick={() => setStage(value)} className={`min-h-11 rounded px-2 py-2 text-xs font-semibold focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${stage === value ? 'bg-foreground text-background' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`}>{item.label}</button>
          ))}
        </div>
      </div>

      <div className="grid min-w-0 gap-7 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(18rem,1.1fr)]">
        <div className="min-w-0">
          <p className="text-xs font-semibold text-muted-foreground">현재 operation</p>
          <p className="mt-2 break-words font-mono text-sm font-bold [overflow-wrap:anywhere]">{current.operation}</p>
          <dl className="mt-5 divide-y divide-border border-y border-border">
            {[
              ['shape · 축마다 보이는 원소 수', current.shape],
              ['stride · 한 칸 갈 때 storage 이동량', current.stride],
              ['contiguous', current.contiguous],
              ['storage', current.storage],
            ].map(([label, value]) => (
              <div key={label} className="grid min-h-12 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-2 text-sm">
                <dt className="leading-relaxed text-muted-foreground">{label}</dt>
                <dd className="font-mono font-bold">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            <code className="font-mono">permute</code>는 원소를 옮기지 않고 index 해석을 바꿀 수
            있다. 반면 이 non-contiguous 예제를 <code className="font-mono">[3,10]</code>으로
            <code className="font-mono"> reshape</code>하면 순서를 보존하려고 copy가 필요하다.
            일반 <code className="font-mono">reshape</code>는 view일 수도 copy일 수도 있으므로
            호출자가 둘 중 하나로 가정하지 않는다.
          </p>
        </div>

        <div className="min-w-0 border-t border-border pt-6 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">
          <p className="text-xs font-semibold text-muted-foreground">KV cache 1차 byte budget</p>
          <div className="mt-3 grid gap-3">
            <Segmented
              label="KV cache dtype"
              options={[
                { value: 'fp32', label: 'FP32 · 4B' },
                { value: 'bf16', label: 'BF16 · 2B' },
                { value: 'int8', label: 'INT8 · 1B' },
              ]}
              value={dtype}
              onChange={setDtype}
            />
            <label htmlFor="layout-token-count" className="block text-xs font-semibold text-muted-foreground">
              sequence length · <span className="font-mono text-foreground">{tokens.toLocaleString()} tokens</span>
              <input id="layout-token-count" type="range" min="128" max="8192" step="128" value={tokens} onChange={(event) => setTokens(Number(event.target.value))} className="mt-2 block min-h-11 w-full accent-amber-700" />
            </label>
          </div>

          <div className="mt-4 border-l-2 border-amber-600 bg-amber-500/[0.05] px-4 py-3">
            <p className="text-xs leading-relaxed text-muted-foreground">B=1 · L=24 · K/V=2 · Hkv=8 · Dh=64</p>
            <p className="mt-1 font-mono text-2xl font-bold">{formatBytes(kvBytes)}</p>
            <p className="mt-1 break-words font-mono text-xs leading-relaxed text-muted-foreground">
              {tokens.toLocaleString()} × {formatBytes(perToken)}/token
            </p>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">이 값은 tensor payload만 센 하한이다. allocator, padding, temporary workspace, fragmentation과 batch 증가는 별도로 더해야 한다.</p>
        </div>
      </div>
    </figure>
  );
}
