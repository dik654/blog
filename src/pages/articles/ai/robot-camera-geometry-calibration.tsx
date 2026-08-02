import { useMemo, useState } from 'react';
import { Check, CircleX, Clock3 } from 'lucide-react';
import MathFormula from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import {
  BeginnerOpening,
  CapabilityCheck,
  ConceptPrimer,
  LearningHandoff,
  Misconception,
  QuestionLead,
  SourceNotes,
} from '@/components/learning/ArticleLearning';
import { MetricGrid, NlpSection, SegmentedControl, Takeaway } from './nlp-shared';

const raw = String.raw;
const clamp = (value: number, low: number, high: number) => Math.min(high, Math.max(low, value));

type Point = { x: number; y: number };
type ImageMode = 'correct' | 'stale';
type PoseMode = 'parallel' | 'diverse';
type ResidualMode = 'train' | 'holdout';

function linePath(points: Point[]) {
  return points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(' ');
}

function VizFrame({
  eyebrow,
  title,
  status,
  statusTone = 'text-blue-700 dark:text-blue-300',
  children,
}: {
  eyebrow: string;
  title: string;
  status?: string;
  statusTone?: string;
  children: React.ReactNode;
}) {
  return (
    <figure className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border bg-background">
      <figcaption className="flex flex-wrap items-center gap-x-3 gap-y-2 border-b border-border px-4 py-4 !pr-24">
        <span className="font-mono text-xs font-black text-blue-700 dark:text-blue-300">{eyebrow}</span>
        <strong className="basis-full text-sm leading-snug sm:min-w-60 sm:flex-1 sm:basis-60">{title}</strong>
        {status && <span className={`basis-full text-xs font-black sm:basis-auto ${statusTone}`}>{status}</span>}
      </figcaption>
      {children}
    </figure>
  );
}

function PinholeRayLab() {
  const [pixelU, setPixelU] = useState(890);
  const [pixelV, setPixelV] = useState(260);
  const [focal, setFocal] = useState(760);
  const [depth, setDepth] = useState(1.4);
  const cx = 640;
  const cy = 360;
  const x = (pixelU - cx) / focal;
  const y = (pixelV - cy) / focal;
  const point = { x: x * depth, y: y * depth, z: depth };
  const angle = Math.atan(Math.hypot(x, y)) * 180 / Math.PI;
  const depths = [0.55, 1.05, 1.55, 2.05];
  const imageX = 508;
  const opticalY = 154;
  const rayEnd = { x: 470, y: opticalY + y * 170 };
  const screenY = clamp(48 + pixelV / 720 * 212, 48, 260);
  return (
    <VizFrame eyebrow="PIXEL → RAY LAB" title="같은 pixel을 만드는 무한한 3D 점 중 depth 하나를 선택한다" status={`ray ${angle.toFixed(1)}°`}>
      <div className="grid gap-4 border-b border-border bg-blue-500/[0.025] p-4 md:grid-cols-2">
        <label className="text-xs font-semibold text-muted-foreground">pixel u · {pixelU}<input className="mt-3 block w-full accent-blue-700" type="range" min="40" max="1240" value={pixelU} onChange={(event) => setPixelU(Number(event.target.value))} /></label>
        <label className="text-xs font-semibold text-muted-foreground">pixel v · {pixelV}<input className="mt-3 block w-full accent-blue-700" type="range" min="30" max="690" value={pixelV} onChange={(event) => setPixelV(Number(event.target.value))} /></label>
        <label className="text-xs font-semibold text-muted-foreground">focal length · {focal} px<input className="mt-3 block w-full accent-violet-700" type="range" min="420" max="1200" step="10" value={focal} onChange={(event) => setFocal(Number(event.target.value))} /></label>
        <label className="text-xs font-semibold text-muted-foreground">optical-axis depth Z · {depth.toFixed(2)} m<input className="mt-3 block w-full accent-emerald-700" type="range" min="0.4" max="2.4" step="0.05" value={depth} onChange={(event) => setDepth(Number(event.target.value))} /></label>
      </div>
      <div className="p-4 sm:p-6">
        <svg viewBox="0 0 340 260" className="block h-auto w-full sm:hidden" role="img" aria-label="모바일 pinhole ray와 depth ambiguity">
          <line x1="28" y1="130" x2="240" y2="130" stroke="currentColor" strokeOpacity="0.16" strokeWidth="1.5" />
          <circle cx="42" cy="130" r="8" fill="#7c3aed" stroke="white" strokeWidth="2" />
          <path d={`M 42 130 L 255 ${130 + y * 88}`} fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" />
          {depths.map((zValue) => <circle key={zValue} cx={42 + zValue * 90} cy={130 + y * zValue * 38} r={Math.abs(zValue - depth) < 0.28 ? 7 : 4} fill={Math.abs(zValue - depth) < 0.28 ? '#059669' : '#93c5fd'} stroke="white" strokeWidth="2" />)}
          <line x1="276" y1="32" x2="276" y2="228" stroke="currentColor" strokeOpacity="0.38" strokeWidth="2" />
          <circle cx="276" cy={clamp(42 + pixelV / 720 * 178, 42, 220)} r="6" fill="#2563eb" stroke="white" strokeWidth="2" />
          <text x="28" y="246" fontSize="11" fill="currentColor" opacity="0.58">한 pixel · 여러 depth · 같은 ray</text>
        </svg>
        <svg viewBox="0 0 700 300" className="hidden h-auto w-full sm:block" role="img" aria-label="pinhole camera projection과 depth ambiguity">
          <line x1="52" y1={opticalY} x2="650" y2={opticalY} stroke="currentColor" strokeOpacity="0.13" strokeWidth="1.5" />
          <circle cx="80" cy={opticalY} r="10" fill="#7c3aed" stroke="white" strokeWidth="3" />
          <text x="54" y={opticalY - 20} fontSize="12" fontWeight="800" fill="#6d28d9">optical center</text>
          <path d={`M 80 ${opticalY} L ${rayEnd.x} ${rayEnd.y}`} fill="none" stroke="#2563eb" strokeWidth="3.2" strokeLinecap="round" />
          {depths.map((zValue) => {
            const px = 80 + zValue * 172;
            const py = opticalY + y * zValue * 74;
            const active = Math.abs(zValue - depth) < 0.28;
            return <circle key={zValue} cx={px} cy={py} r={active ? 8 : 5} fill={active ? '#059669' : '#93c5fd'} stroke="white" strokeWidth="2.5" />;
          })}
          <line x1={imageX} y1="38" x2={imageX} y2="268" stroke="currentColor" strokeOpacity="0.42" strokeWidth="2" />
          <circle cx={imageX} cy={screenY} r="7" fill="#2563eb" stroke="white" strokeWidth="2.5" />
          <line x1={imageX - 7} y1={screenY} x2={imageX + 7} y2={screenY} stroke="#1d4ed8" strokeWidth="1.5" />
          <line x1={imageX} y1={screenY - 7} x2={imageX} y2={screenY + 7} stroke="#1d4ed8" strokeWidth="1.5" />
          <text x={imageX + 16} y={screenY + 4} fontSize="12" fontWeight="800" fill="#1d4ed8">({pixelU}, {pixelV})</text>
          <text x="52" y="287" fontSize="12" fill="currentColor" opacity="0.58">projective ray: K⁻¹ [u v 1]ᵀ · green point: depth가 선택한 metric point</text>
        </svg>
        <MetricGrid mobileColumns={2} items={[
          { label: 'normalized x', value: x.toFixed(4), note: '(u-cx)/fx' },
          { label: 'normalized y', value: y.toFixed(4), note: '(v-cy)/fy' },
          { label: 'camera point', value: `x ${point.x.toFixed(3)} m`, note: `y ${point.y.toFixed(3)} m · z ${point.z.toFixed(2)} m`, accent: true },
          { label: 'depth contract', value: 'Z축 깊이', note: '직선거리가 아님' },
        ]} />
      </div>
    </VizFrame>
  );
}

function ImageGeometryLab() {
  const [mode, setMode] = useState<ImageMode>('stale');
  const [cropX, setCropX] = useState(160);
  const [scale, setScale] = useState(0.5);
  const source = { fx: 920, fy: 900, cx: 640, cy: 360 };
  const correct = { fx: source.fx * scale, fy: source.fy * scale, cx: (source.cx - cropX) * scale, cy: source.cy * scale };
  const used = mode === 'correct' ? correct : { fx: source.fx, fy: source.fy, cx: source.cx, cy: source.cy };
  const pixel = { u: 410, v: 214 };
  const correctRay = { x: (pixel.u - correct.cx) / correct.fx, y: (pixel.v - correct.cy) / correct.fy };
  const usedRay = { x: (pixel.u - used.cx) / used.fx, y: (pixel.v - used.cy) / used.fy };
  const miss = Math.hypot(correctRay.x - usedRay.x, correctRay.y - usedRay.y) * 1.8;
  const ox = 78;
  const oy = 246;
  const endpoint = (ray: Point) => ({ x: ox + 430, y: oy - ray.y * 300 - 85 });
  const correctEnd = endpoint(correctRay);
  const usedEnd = endpoint(usedRay);
  return (
    <VizFrame eyebrow="IMAGE GEOMETRY LAB" title="Resize와 crop 뒤 K를 갱신하지 않으면 같은 pixel이 다른 공간 방향을 가리킨다" status={`${(miss * 100).toFixed(1)} cm · 1.8 m 거리`} statusTone={miss > 0.02 ? 'text-red-700 dark:text-red-300' : 'text-emerald-700 dark:text-emerald-300'}>
      <div className="flex flex-wrap items-end gap-4 border-b border-border bg-violet-500/[0.025] p-4">
        <SegmentedControl label="intrinsic update" options={[{ value: 'correct', label: '갱신한 K' }, { value: 'stale', label: '원본 K 오용' }]} value={mode} onChange={setMode} />
        <label className="min-w-44 flex-1 text-xs font-semibold text-muted-foreground">crop origin x · {cropX} px<input className="mt-3 block w-full accent-violet-700" type="range" min="0" max="320" step="8" value={cropX} onChange={(event) => setCropX(Number(event.target.value))} /></label>
        <label className="min-w-44 flex-1 text-xs font-semibold text-muted-foreground">resize scale · {scale.toFixed(2)}<input className="mt-3 block w-full accent-blue-700" type="range" min="0.4" max="0.8" step="0.05" value={scale} onChange={(event) => setScale(Number(event.target.value))} /></label>
      </div>
      <div className="p-4 sm:p-6">
        <svg viewBox="0 0 340 230" className="block h-auto w-full sm:hidden" role="img" aria-label="모바일 crop resize 뒤 intrinsic matrix 갱신 오류">
          <line x1="28" y1="190" x2="312" y2="190" stroke="currentColor" strokeOpacity="0.16" strokeWidth="1.5" />
          <circle cx="28" cy="190" r="7" fill="#7c3aed" stroke="white" strokeWidth="2.5" />
          <path d={`M 28 190 L 306 ${145 - correctRay.y * 100}`} fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round" />
          <path d={`M 28 190 L 306 ${145 - usedRay.y * 100}`} fill="none" stroke={mode === 'stale' ? '#dc2626' : '#059669'} strokeWidth="3" strokeLinecap="round" strokeDasharray={mode === 'stale' ? '7 5' : undefined} />
          <circle cx="306" cy={145 - correctRay.y * 100} r="6" fill="#059669" stroke="white" strokeWidth="2" />
          <circle cx="306" cy={145 - usedRay.y * 100} r="5" fill={mode === 'stale' ? '#dc2626' : '#059669'} stroke="white" strokeWidth="2" />
          <rect x="168" y="18" width="148" height="80" rx="4" fill="none" stroke="currentColor" strokeOpacity="0.22" strokeWidth="1.5" />
          <rect x={168 + cropX * 0.16} y="18" width={148 - cropX * 0.16} height="80" rx="3" fill="#2563eb" fillOpacity="0.04" stroke="#2563eb" strokeOpacity="0.6" strokeWidth="2" />
          <circle cx={168 + correct.cx * 0.16} cy={18 + correct.cy * 0.18} r="4.5" fill="#2563eb" />
          <text x="168" y="12" fontSize="11" fontWeight="800" fill="#1d4ed8">crop 뒤 영상</text>
        </svg>
        <svg viewBox="0 0 620 290" className="hidden h-auto w-full sm:block" role="img" aria-label="crop resize 뒤 intrinsic matrix 갱신 오류">
          <line x1={ox} y1={oy} x2="558" y2={oy} stroke="currentColor" strokeOpacity="0.16" strokeWidth="1.5" />
          <circle cx={ox} cy={oy} r="8" fill="#7c3aed" stroke="white" strokeWidth="2.5" />
          <path d={`M ${ox} ${oy} L ${correctEnd.x} ${correctEnd.y}`} fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round" />
          <path d={`M ${ox} ${oy} L ${usedEnd.x} ${usedEnd.y}`} fill="none" stroke={mode === 'stale' ? '#dc2626' : '#059669'} strokeWidth="3" strokeLinecap="round" strokeDasharray={mode === 'stale' ? '8 6' : undefined} />
          <circle cx={correctEnd.x} cy={correctEnd.y} r="7" fill="#059669" stroke="white" strokeWidth="2" />
          <circle cx={usedEnd.x} cy={usedEnd.y} r="6" fill={mode === 'stale' ? '#dc2626' : '#059669'} stroke="white" strokeWidth="2" />
          <line x1={correctEnd.x} y1={correctEnd.y} x2={usedEnd.x} y2={usedEnd.y} stroke={mode === 'stale' ? '#dc2626' : '#059669'} strokeWidth="2" strokeDasharray="4 4" />
          <rect x="355" y="32" width="210" height="112" rx="5" fill="none" stroke="currentColor" strokeOpacity="0.22" strokeWidth="1.5" />
          <rect x={355 + cropX * 0.24} y="32" width={210 - cropX * 0.24} height="112" rx="3" fill="#2563eb" fillOpacity="0.04" stroke="#2563eb" strokeOpacity="0.55" strokeWidth="2" />
          <circle cx={355 + correct.cx * 0.23} cy={32 + correct.cy * 0.25} r="5" fill="#2563eb" />
          <text x="355" y="24" fontSize="11" fontWeight="800" fill="#1d4ed8">crop → resize image</text>
          <text x="70" y="278" fontSize="11" fill="currentColor" opacity="0.58">solid green = correct ray · dashed red = stale K가 만든 ray</text>
        </svg>
        <p className="mb-3 mt-2 text-xs leading-relaxed text-muted-foreground sm:hidden"><span className="font-semibold text-emerald-700">초록 실선</span>은 갱신한 K, <span className="font-semibold text-red-700">빨간 점선</span>은 원본 K를 오용한 ray다.</p>
        <MetricGrid mobileColumns={2} items={[
          { label: 'used fx', value: used.fx.toFixed(1), note: 'resize와 함께 scale' },
          { label: 'used cx', value: used.cx.toFixed(1), note: 'crop 원점 이동 반영' },
          { label: 'correct ray x', value: correctRay.x.toFixed(4) },
          { label: 'used ray x', value: usedRay.x.toFixed(4), accent: mode === 'stale' },
        ]} />
      </div>
    </VizFrame>
  );
}

function DistortionLab() {
  const [k1, setK1] = useState(-0.28);
  const [radius, setRadius] = useState(0.78);
  const fx = 760;
  const radialScale = 1 + k1 * radius ** 2;
  const distortedRadius = radius * radialScale;
  const pixelShift = Math.abs(distortedRadius - radius) * fx;
  const angleShift = Math.abs(Math.atan(distortedRadius) - Math.atan(radius)) * 180 / Math.PI;
  const center = { x: 330, y: 145 };
  const scale = 142;
  const grid = [-0.8, -0.4, 0, 0.4, 0.8];
  const distort = (x: number, y: number) => {
    const r2 = x * x + y * y;
    const s = 1 + k1 * r2;
    return { x: center.x + x * s * scale, y: center.y + y * s * scale };
  };
  const testIdeal = { x: center.x + radius * scale, y: center.y };
  const testDistorted = { x: center.x + distortedRadius * scale, y: center.y };
  return (
    <VizFrame eyebrow="DISTORTION FIELD" title="왜곡은 중심보다 가장자리에서 커지므로 residual의 위치 분포를 봐야 한다" status={`${pixelShift.toFixed(1)} px shift`} statusTone={pixelShift > 12 ? 'text-amber-700 dark:text-amber-300' : 'text-emerald-700 dark:text-emerald-300'}>
      <div className="grid gap-4 border-b border-border bg-amber-500/[0.025] p-4 md:grid-cols-2">
        <label className="text-xs font-semibold text-muted-foreground">radial k1 · {k1.toFixed(2)}<input className="mt-3 block w-full accent-amber-700" type="range" min="-0.45" max="0.35" step="0.01" value={k1} onChange={(event) => setK1(Number(event.target.value))} /></label>
        <label className="text-xs font-semibold text-muted-foreground">normalized radius · {radius.toFixed(2)}<input className="mt-3 block w-full accent-blue-700" type="range" min="0.05" max="0.95" step="0.01" value={radius} onChange={(event) => setRadius(Number(event.target.value))} /></label>
      </div>
      <div className="p-4 sm:p-6">
        <svg viewBox="155 0 350 290" className="block h-auto w-full sm:hidden" role="img" aria-label="모바일 radial distortion grid와 edge pixel displacement">
          <rect x="184" y="10" width="292" height="270" rx="5" fill="#2563eb" fillOpacity="0.018" stroke="currentColor" strokeOpacity="0.13" />
          {grid.map((value) => {
            const horizontal = Array.from({ length: 41 }, (_, index) => distort(-0.9 + index * 0.045, value));
            const vertical = Array.from({ length: 41 }, (_, index) => distort(value, -0.9 + index * 0.045));
            return <g key={value}>
              <path d={linePath(horizontal)} fill="none" stroke="#2563eb" strokeOpacity={value === 0 ? 0.7 : 0.34} strokeWidth={value === 0 ? 2 : 1.4} />
              <path d={linePath(vertical)} fill="none" stroke="#2563eb" strokeOpacity={value === 0 ? 0.7 : 0.34} strokeWidth={value === 0 ? 2 : 1.4} />
            </g>;
          })}
          <circle cx={center.x} cy={center.y} r="5" fill="#7c3aed" stroke="white" strokeWidth="2" />
          <circle cx={testIdeal.x} cy={testIdeal.y} r="7" fill="#059669" stroke="white" strokeWidth="2" />
          <circle cx={testDistorted.x} cy={testDistorted.y} r="7" fill="#d97706" stroke="white" strokeWidth="2" />
          <line x1={testIdeal.x} y1={testIdeal.y} x2={testDistorted.x} y2={testDistorted.y} stroke="#d97706" strokeWidth="3" strokeLinecap="round" />
        </svg>
        <svg viewBox="0 0 660 300" className="hidden h-auto w-full sm:block" role="img" aria-label="radial distortion grid와 edge pixel displacement">
          <rect x="184" y="10" width="292" height="270" rx="5" fill="#2563eb" fillOpacity="0.018" stroke="currentColor" strokeOpacity="0.13" />
          {grid.map((value) => {
            const horizontal = Array.from({ length: 41 }, (_, index) => distort(-0.9 + index * 0.045, value));
            const vertical = Array.from({ length: 41 }, (_, index) => distort(value, -0.9 + index * 0.045));
            return <g key={value}>
              <path d={linePath(horizontal)} fill="none" stroke="#2563eb" strokeOpacity={value === 0 ? 0.55 : 0.28} strokeWidth={value === 0 ? 1.8 : 1.2} />
              <path d={linePath(vertical)} fill="none" stroke="#2563eb" strokeOpacity={value === 0 ? 0.55 : 0.28} strokeWidth={value === 0 ? 1.8 : 1.2} />
            </g>;
          })}
          <circle cx={center.x} cy={center.y} r="5" fill="#7c3aed" stroke="white" strokeWidth="2" />
          <circle cx={testIdeal.x} cy={testIdeal.y} r="6" fill="#059669" stroke="white" strokeWidth="2" />
          <circle cx={testDistorted.x} cy={testDistorted.y} r="6" fill="#d97706" stroke="white" strokeWidth="2" />
          <line x1={testIdeal.x} y1={testIdeal.y} x2={testDistorted.x} y2={testDistorted.y} stroke="#d97706" strokeWidth="2.5" strokeLinecap="round" />
          <text x="20" y="278" fontSize="11" fill="currentColor" opacity="0.58">blue = distorted grid · green = ideal point · amber = observed point</text>
        </svg>
        <p className="mb-3 mt-2 text-xs leading-relaxed text-muted-foreground sm:hidden"><span className="font-semibold text-blue-700">파란 격자</span>는 왜곡된 영상, 초록 점은 이상적 위치, 주황 점은 실제 관측 위치다.</p>
        <MetricGrid mobileColumns={2} items={[
          { label: 'radial scale', value: radialScale.toFixed(4), note: '1 + k1 r²' },
          { label: 'center shift', value: '0.0 px', note: 'r = 0' },
          { label: 'test shift', value: `${pixelShift.toFixed(1)} px`, accent: pixelShift > 12 },
          { label: 'ray angle bias', value: `${angleShift.toFixed(2)}°` },
        ]} />
      </div>
    </VizFrame>
  );
}

function PoseDiversityLab() {
  const [mode, setMode] = useState<PoseMode>('parallel');
  const [views, setViews] = useState(5);
  const independent = mode === 'diverse' ? Math.min(6, 2 + Math.floor(views * 0.9)) : Math.min(3, 2 + Math.floor(views * 0.12));
  const condition = mode === 'diverse' ? 18 + 55 / views : 680 - views * 16;
  const expectedEdge = mode === 'diverse' ? 0.42 + 1.8 / views : 2.8 - Math.min(0.4, views * 0.03);
  const cards = Array.from({ length: views }, (_, index) => ({
    x: 40 + (index % 4) * 150,
    y: 36 + Math.floor(index / 4) * 116,
    angle: mode === 'diverse' ? [-25, 18, -12, 31, -34, 10, 24, -20][index % 8] : [-2, 1, 0, 2, -1, 1, -2, 0][index % 8],
  }));
  return (
    <VizFrame eyebrow="POSE DIVERSITY LAB" title="평면 영상을 더 찍는 것보다 독립적인 기울기로 intrinsic constraint를 늘린다" status={`독립 제약 ${independent}/6`} statusTone={independent >= 5 ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'}>
      <div className="flex flex-wrap items-end gap-4 border-b border-border bg-emerald-500/[0.025] p-4">
        <SegmentedControl label="calibration poses" options={[{ value: 'parallel', label: '거의 평행' }, { value: 'diverse', label: '다양한 기울기' }]} value={mode} onChange={setMode} />
        <label className="min-w-56 flex-1 text-xs font-semibold text-muted-foreground">usable views · {views}<input className="mt-3 block w-full accent-emerald-700" type="range" min="3" max="8" value={views} onChange={(event) => setViews(Number(event.target.value))} /></label>
      </div>
      <div className="p-4 sm:p-6">
        <svg viewBox={`0 0 340 ${Math.ceil(views / 2) * 112 + 12}`} className="block h-auto w-full sm:hidden" role="img" aria-label="모바일 planar calibration target pose diversity와 constraint conditioning">
          {cards.map((card, index) => {
            const x = 22 + (index % 2) * 176;
            const y = 14 + Math.floor(index / 2) * 112;
            return <g key={index} transform={`translate(${x} ${y}) rotate(${card.angle} 60 32)`}>
              <rect width="120" height="64" rx="4" fill="#2563eb" fillOpacity="0.025" stroke={mode === 'diverse' ? '#059669' : '#94a3b8'} strokeWidth="2" />
              {Array.from({ length: 6 }, (_, column) => <line key={`v${column}`} x1={10 + column * 20} y1="7" x2={10 + column * 20} y2="57" stroke="currentColor" strokeOpacity="0.14" />)}
              {Array.from({ length: 4 }, (_, row) => <line key={`h${row}`} x1="10" y1={7 + row * 17} x2="110" y2={7 + row * 17} stroke="currentColor" strokeOpacity="0.14" />)}
            </g>;
          })}
        </svg>
        <svg viewBox="0 0 650 270" className="hidden h-auto w-full sm:block" role="img" aria-label="planar calibration target pose diversity와 constraint conditioning">
          {cards.map((card, index) => <g key={index} transform={`translate(${card.x} ${card.y}) rotate(${card.angle} 55 38)`}>
            <rect width="110" height="76" rx="4" fill="#2563eb" fillOpacity="0.025" stroke={mode === 'diverse' ? '#059669' : '#94a3b8'} strokeWidth="1.8" />
            {Array.from({ length: 6 }, (_, column) => <line key={`v${column}`} x1={10 + column * 18} y1="8" x2={10 + column * 18} y2="68" stroke="currentColor" strokeOpacity="0.13" />)}
            {Array.from({ length: 4 }, (_, row) => <line key={`h${row}`} x1="10" y1={8 + row * 20} x2="100" y2={8 + row * 20} stroke="currentColor" strokeOpacity="0.13" />)}
          </g>)}
          <text x="38" y="258" fontSize="11" fill="currentColor" opacity="0.58">각 homography는 두 제약을 주지만 같은 orientation은 새 방향 정보를 거의 주지 않는다</text>
        </svg>
        <p className="mb-3 mt-2 text-xs leading-relaxed text-muted-foreground sm:hidden">평행한 판을 반복 촬영하면 같은 제약 방향만 정밀해진다. 여러 축으로 기울여야 새로운 방향 정보가 생긴다.</p>
        <MetricGrid mobileColumns={2} items={[
          { label: 'views', value: String(views) },
          { label: 'independent constraints', value: `${independent} / 6`, accent: independent < 5 },
          { label: 'condition proxy', value: condition.toFixed(0), note: '낮을수록 안정' },
          { label: 'edge holdout', value: `${expectedEdge.toFixed(2)} px`, note: '예상 residual' },
        ]} />
      </div>
    </VizFrame>
  );
}

function CalibrationValidationLab() {
  const [mode, setMode] = useState<ResidualMode>('train');
  const [flatness, setFlatness] = useState(100);
  const points = useMemo(() => Array.from({ length: 63 }, (_, index) => {
    const column = index % 9;
    const row = Math.floor(index / 9);
    const x = 70 + column * 62;
    const y = 42 + row * 35;
    const nx = (column - 4) / 4;
    const ny = (row - 3) / 3;
    const radius = Math.hypot(nx, ny);
    const holdout = mode === 'holdout';
    const bend = (100 - flatness) / 100;
    const dx = (holdout ? 1.2 : 0.18) * nx * radius * 5 + bend * nx * Math.abs(nx) * 10;
    const dy = (holdout ? 0.9 : 0.16) * ny * radius * 4 + bend * ny * 5;
    return { x, y, dx, dy, magnitude: Math.hypot(dx, dy) };
  }), [mode, flatness]);
  const rms = Math.sqrt(points.reduce((sum, point) => sum + point.magnitude ** 2, 0) / points.length);
  const edge = points.filter((point) => point.x < 150 || point.x > 485).reduce((sum, point) => sum + point.magnitude, 0) / 28;
  const passes = rms < 1 && edge < 1.2 && flatness >= 96;
  return (
    <VizFrame eyebrow="CALIBRATION VALIDATION" title="평균 RMS를 residual vector의 위치·holdout·물리 검증으로 분해한다" status={passes ? '검증 통과' : 'calibration 거부'} statusTone={passes ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'}>
      <div className="flex flex-wrap items-end gap-4 border-b border-border bg-blue-500/[0.025] p-4">
        <SegmentedControl label="residual split" options={[{ value: 'train', label: '학습 views' }, { value: 'holdout', label: '미사용 view' }]} value={mode} onChange={setMode} />
        <label className="min-w-56 flex-1 text-xs font-semibold text-muted-foreground">target flatness · {flatness}%<input className="mt-3 block w-full accent-amber-700" type="range" min="88" max="100" value={flatness} onChange={(event) => setFlatness(Number(event.target.value))} /></label>
      </div>
      <div className="p-4 sm:p-6">
        <svg viewBox="0 0 650 300" className="block h-auto w-full" role="img" aria-label="calibration reprojection residual vector field">
          <rect x="46" y="22" width="558" height="246" rx="5" fill="#2563eb" fillOpacity="0.018" stroke="currentColor" strokeOpacity="0.15" />
          {points.map((point, index) => <g key={index}>
            <circle cx={point.x} cy={point.y} r="2.4" fill="#2563eb" fillOpacity="0.55" />
            <line x1={point.x} y1={point.y} x2={point.x + point.dx * 3.2} y2={point.y + point.dy * 3.2} stroke={point.magnitude > 1.2 ? '#dc2626' : '#d97706'} strokeWidth="1.6" strokeLinecap="round" />
          </g>)}
          <rect x="46" y="22" width="96" height="246" fill="#dc2626" fillOpacity="0.025" />
          <rect x="508" y="22" width="96" height="246" fill="#dc2626" fillOpacity="0.025" />
          <text x="46" y="288" fontSize="11" fill="currentColor" opacity="0.58">dot = observed corner · line = projected residual × 3.2 · shaded = edge validation zone</text>
        </svg>
        <p className="mb-3 mt-2 text-xs leading-relaxed text-muted-foreground sm:hidden">점은 관측 corner, 짧은 선은 3.2배 확대한 residual이다. 양쪽 음영은 별도로 확인할 영상 가장자리다.</p>
        <MetricGrid mobileColumns={2} items={[
          { label: 'global RMS', value: `${rms.toFixed(2)} px`, note: '전체 평균' },
          { label: 'edge mean', value: `${edge.toFixed(2)} px`, accent: edge >= 1.2 },
          { label: 'target plane', value: `${flatness}% flat`, accent: flatness < 96 },
          { label: 'decision', value: passes ? 'PASS' : 'REJECT', accent: !passes },
        ]} />
      </div>
    </VizFrame>
  );
}

function HandEyeLab() {
  const [rotationSpread, setRotationSpread] = useState(12);
  const [pairs, setPairs] = useState(5);
  const strong = rotationSpread >= 35 && pairs >= 4;
  const condition = Math.max(7, 560 / (rotationSpread + 3) * 5 / Math.sqrt(pairs));
  const closure = strong ? 0.8 + 4 / pairs : 7.5 + (35 - Math.min(35, rotationSpread)) * 0.24;
  const axes = Array.from({ length: pairs }, (_, index) => {
    const theta = strong ? (-rotationSpread / 2 + index * rotationSpread / Math.max(1, pairs - 1)) * Math.PI / 180 : (index - 2) * 2 * Math.PI / 180;
    return { x: 164 + Math.cos(theta) * 92, y: 140 + Math.sin(theta) * 92 };
  });
  return (
    <VizFrame eyebrow="HAND–EYE AX = XB" title="같은 상대 motion을 robot과 camera frame에서 관측해 고정 mount X를 찾는다" status={strong ? 'motion set 관측 가능' : '회전 다양성 부족'} statusTone={strong ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'}>
      <div className="grid gap-4 border-b border-border bg-violet-500/[0.025] p-4 md:grid-cols-2">
        <label className="text-xs font-semibold text-muted-foreground">rotation-axis spread · {rotationSpread}°<input className="mt-3 block w-full accent-violet-700" type="range" min="2" max="85" value={rotationSpread} onChange={(event) => setRotationSpread(Number(event.target.value))} /></label>
        <label className="text-xs font-semibold text-muted-foreground">relative pose pairs · {pairs}<input className="mt-3 block w-full accent-blue-700" type="range" min="2" max="8" value={pairs} onChange={(event) => setPairs(Number(event.target.value))} /></label>
      </div>
      <div className="grid gap-5 p-4 sm:p-6 md:grid-cols-[0.9fr_1.1fr]">
        <svg viewBox="0 0 320 280" className="block h-auto w-full" role="img" aria-label="hand eye calibration rotation axis diversity">
          <circle cx="164" cy="140" r="96" fill="#7c3aed" fillOpacity="0.025" stroke="currentColor" strokeOpacity="0.13" />
          <circle cx="164" cy="140" r="8" fill="#7c3aed" stroke="white" strokeWidth="2.5" />
          {axes.map((axis, index) => <g key={index}>
            <line x1="164" y1="140" x2={axis.x} y2={axis.y} stroke={strong ? '#059669' : '#dc2626'} strokeWidth="2.3" strokeLinecap="round" />
            <circle cx={axis.x} cy={axis.y} r="4" fill={strong ? '#059669' : '#dc2626'} />
          </g>)}
          <text x="42" y="262" fontSize="11" fill="currentColor" opacity="0.58">relative rotation axes · 넓게 벌어져야 X가 관측된다</text>
        </svg>
        <div className="min-w-0">
          <div className="grid gap-2 text-sm">
            {[
              ['Aᵢ', 'gripper의 i→j relative motion', '#2563eb'],
              ['X', 'camera→gripper fixed transform', '#7c3aed'],
              ['Bᵢ', 'camera의 i→j relative motion', '#059669'],
            ].map(([label, note, color]) => <div key={label} className="grid grid-cols-[2.5rem_minmax(0,1fr)] items-center gap-3 border-b border-border/70 py-3">
              <strong className="font-mono text-base" style={{ color }}>{label}</strong><span className="text-muted-foreground">{note}</span>
            </div>)}
          </div>
          <MetricGrid mobileColumns={2} items={[
            { label: 'pose pairs', value: String(pairs) },
            { label: 'condition proxy', value: condition.toFixed(1), accent: !strong },
            { label: 'loop closure', value: `${closure.toFixed(1)} mm`, accent: closure > 3 },
            { label: 'returned X', value: 'camera → gripper', note: 'OpenCV contract' },
          ]} />
        </div>
      </div>
    </VizFrame>
  );
}

function TimeAlignmentLab() {
  const [delay, setDelay] = useState(80);
  const [linearSpeed, setLinearSpeed] = useState(0.35);
  const [angularSpeed, setAngularSpeed] = useState(55);
  const [row, setRow] = useState(620);
  const readout = 18;
  const timeOffset = delay / 1000;
  const translationError = linearSpeed * timeOffset;
  const rotationErrorRad = angularSpeed * Math.PI / 180 * timeOffset;
  const targetRange = 1.1;
  const rotationalPointError = 2 * targetRange * Math.sin(rotationErrorRad / 2);
  const total = translationError + rotationalPointError;
  const rowOffset = row / 720 * readout;
  const passes = total < 0.015;
  const acquisitionX = 120;
  const latestX = acquisitionX + clamp(total * 2500, 0, 390);
  const mobileLatestX = 58 + clamp(total * 1500, 0, 190);
  return (
    <VizFrame eyebrow="SPACE × TIME LAB" title="image acquisition 시각 대신 latest TF를 쓰면 robot motion이 point error로 바뀐다" status={`${(total * 100).toFixed(1)} cm 점 오차`} statusTone={passes ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'}>
      <div className="grid gap-4 border-b border-border bg-amber-500/[0.025] p-4 sm:grid-cols-2">
        <label className="text-xs font-semibold text-muted-foreground">processing / stamp delay · {delay} ms<input className="mt-3 block w-full accent-amber-700" type="range" min="0" max="160" step="2" value={delay} onChange={(event) => setDelay(Number(event.target.value))} /></label>
        <label className="text-xs font-semibold text-muted-foreground">linear speed · {linearSpeed.toFixed(2)} m/s<input className="mt-3 block w-full accent-blue-700" type="range" min="0" max="0.8" step="0.02" value={linearSpeed} onChange={(event) => setLinearSpeed(Number(event.target.value))} /></label>
        <label className="text-xs font-semibold text-muted-foreground">angular speed · {angularSpeed}°/s<input className="mt-3 block w-full accent-violet-700" type="range" min="0" max="140" step="2" value={angularSpeed} onChange={(event) => setAngularSpeed(Number(event.target.value))} /></label>
        <label className="text-xs font-semibold text-muted-foreground">rolling-shutter row · {row}/720<input className="mt-3 block w-full accent-emerald-700" type="range" min="0" max="719" value={row} onChange={(event) => setRow(Number(event.target.value))} /></label>
      </div>
      <div className="p-4 sm:p-6">
        <svg viewBox="0 0 340 230" className="block h-auto w-full sm:hidden" role="img" aria-label="모바일 camera acquisition timestamp와 latest transform의 spatial error">
          <line x1="28" y1="142" x2="312" y2="142" stroke="currentColor" strokeOpacity="0.16" strokeWidth="2" />
          <circle cx="58" cy="142" r="9" fill="#059669" stroke="white" strokeWidth="3" />
          <circle cx={mobileLatestX} cy="142" r="9" fill={passes ? '#059669' : '#dc2626'} stroke="white" strokeWidth="3" />
          <line x1="58" y1="142" x2={mobileLatestX} y2="142" stroke={passes ? '#059669' : '#dc2626'} strokeWidth="4" strokeLinecap="round" />
          <text x="58" y="118" textAnchor="middle" fontSize="11" fontWeight="800" fill="#047857">촬영 시각 TF</text>
          <text x={mobileLatestX} y="170" textAnchor="middle" fontSize="11" fontWeight="800" fill={passes ? '#047857' : '#b91c1c'}>최신 TF</text>
          <rect x="238" y="28" width="74" height="62" rx="4" fill="#2563eb" fillOpacity="0.025" stroke="currentColor" strokeOpacity="0.22" />
          <line x1="238" y1={28 + row / 720 * 62} x2="312" y2={28 + row / 720 * 62} stroke="#7c3aed" strokeWidth="3" />
          <text x="275" y="17" textAnchor="middle" fontSize="10" fontWeight="800" fill="#6d28d9">선택 row +{rowOffset.toFixed(1)} ms</text>
        </svg>
        <svg viewBox="0 0 660 260" className="hidden h-auto w-full sm:block" role="img" aria-label="camera acquisition timestamp와 latest transform의 spatial error">
          <line x1="62" y1="130" x2="598" y2="130" stroke="currentColor" strokeOpacity="0.16" strokeWidth="2" />
          <circle cx={acquisitionX} cy="130" r="11" fill="#059669" stroke="white" strokeWidth="3" />
          <circle cx={latestX} cy="130" r="11" fill={passes ? '#059669' : '#dc2626'} stroke="white" strokeWidth="3" />
          <line x1={acquisitionX} y1="130" x2={latestX} y2="130" stroke={passes ? '#059669' : '#dc2626'} strokeWidth="4" strokeLinecap="round" />
          <text x={acquisitionX} y="104" textAnchor="middle" fontSize="11" fontWeight="800" fill="#047857">acquisition TF</text>
          <text x={latestX} y="162" textAnchor="middle" fontSize="11" fontWeight="800" fill={passes ? '#047857' : '#b91c1c'}>latest TF</text>
          <rect x="510" y="28" width="88" height="72" rx="4" fill="#2563eb" fillOpacity="0.025" stroke="currentColor" strokeOpacity="0.22" />
          <line x1="510" y1={28 + row / 720 * 72} x2="598" y2={28 + row / 720 * 72} stroke="#7c3aed" strokeWidth="3" />
          <text x="554" y="18" textAnchor="middle" fontSize="10" fontWeight="800" fill="#6d28d9">row +{rowOffset.toFixed(1)} ms</text>
          <text x="62" y="238" fontSize="11" fill="currentColor" opacity="0.58">같은 frame도 rolling shutter에서는 row마다 exposure time이 다르다</text>
        </svg>
        <p className="mb-3 mt-2 text-xs leading-relaxed text-muted-foreground sm:hidden">빨간 선은 촬영 시각의 TF 대신 처리 시점의 최신 TF를 조회해 생긴 공간 오차다. Rolling shutter에서는 선택 row의 노출 시각도 더해진다.</p>
        <MetricGrid mobileColumns={2} items={[
          { label: 'translation term', value: `${(translationError * 100).toFixed(1)} cm` },
          { label: 'rotation term', value: `${(rotationalPointError * 100).toFixed(1)} cm` },
          { label: 'selected row time', value: `+${rowOffset.toFixed(1)} ms` },
          { label: 'TF query', value: passes ? 'ACCEPT' : 'REJECT latest', accent: !passes },
        ]} />
      </div>
    </VizFrame>
  );
}

function RayPlaneGate() {
  const [angle, setAngle] = useState(32);
  const [pixelNoise, setPixelNoise] = useState(0.8);
  const [depthNoise, setDepthNoise] = useState(18);
  const sin = Math.sin(angle * Math.PI / 180);
  const planeAmplification = 1 / Math.max(0.08, sin);
  const planeSigma = pixelNoise * 0.00135 * planeAmplification * 1000;
  const fusedSigma = 1 / Math.sqrt(1 / Math.max(1, depthNoise) ** 2 + 1 / Math.max(1, planeSigma) ** 2);
  const passes = angle >= 18 && fusedSigma < 12;
  const origin = { x: 80, y: 56 };
  const groundY = 240;
  const t = (groundY - origin.y) / Math.max(0.12, Math.sin(angle * Math.PI / 180));
  const hitX = clamp(origin.x + Math.cos(angle * Math.PI / 180) * t, 130, 600);
  const mobileOrigin = { x: 28, y: 34 };
  const mobileGroundY = 196;
  const mobileT = (mobileGroundY - mobileOrigin.y) / Math.max(0.12, Math.sin(angle * Math.PI / 180));
  const mobileHitX = clamp(mobileOrigin.x + Math.cos(angle * Math.PI / 180) * mobileT, 92, 318);
  return (
    <VizFrame eyebrow="RAY → METRIC POINT" title="depth 또는 plane constraint로 scale을 정하고 uncertainty와 함께 planning scene에 넣는다" status={passes ? 'scene 입력 통과' : '불확실성 한도 초과'} statusTone={passes ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'}>
      <div className="grid gap-4 border-b border-border bg-emerald-500/[0.025] p-4 sm:grid-cols-3">
        <label className="text-xs font-semibold text-muted-foreground">ray-plane angle · {angle}°<input className="mt-3 block w-full accent-emerald-700" type="range" min="5" max="70" value={angle} onChange={(event) => setAngle(Number(event.target.value))} /></label>
        <label className="text-xs font-semibold text-muted-foreground">pixel noise · {pixelNoise.toFixed(1)} px<input className="mt-3 block w-full accent-blue-700" type="range" min="0.1" max="3" step="0.1" value={pixelNoise} onChange={(event) => setPixelNoise(Number(event.target.value))} /></label>
        <label className="text-xs font-semibold text-muted-foreground">depth sigma · {depthNoise} mm<input className="mt-3 block w-full accent-amber-700" type="range" min="4" max="55" value={depthNoise} onChange={(event) => setDepthNoise(Number(event.target.value))} /></label>
      </div>
      <div className="p-4 sm:p-6">
        <svg viewBox="0 0 340 225" className="block h-auto w-full sm:hidden" role="img" aria-label="모바일 ray plane intersection과 uncertainty amplification">
          <line x1="18" y1={mobileGroundY} x2="322" y2={mobileGroundY} stroke="#059669" strokeWidth="3" strokeLinecap="round" />
          <circle cx={mobileOrigin.x} cy={mobileOrigin.y} r="8" fill="#7c3aed" stroke="white" strokeWidth="2.5" />
          <line x1={mobileOrigin.x} y1={mobileOrigin.y} x2={mobileHitX} y2={mobileGroundY} stroke="#2563eb" strokeWidth="3.2" strokeLinecap="round" />
          <ellipse cx={mobileHitX} cy={mobileGroundY} rx={clamp(fusedSigma * 1.2, 8, 56)} ry="11" fill={passes ? '#059669' : '#dc2626'} fillOpacity="0.13" stroke={passes ? '#059669' : '#dc2626'} strokeWidth="2" />
          <circle cx={mobileHitX} cy={mobileGroundY} r="6" fill={passes ? '#059669' : '#dc2626'} stroke="white" strokeWidth="2" />
          <path d={`M ${mobileOrigin.x + 38} ${mobileOrigin.y} A 38 38 0 0 1 ${mobileOrigin.x + 38 * Math.cos(angle * Math.PI / 180)} ${mobileOrigin.y + 38 * Math.sin(angle * Math.PI / 180)}`} fill="none" stroke="#d97706" strokeWidth="2" />
        </svg>
        <svg viewBox="0 0 660 285" className="hidden h-auto w-full sm:block" role="img" aria-label="ray plane intersection과 uncertainty amplification">
          <line x1="42" y1={groundY} x2="618" y2={groundY} stroke="#059669" strokeWidth="3" strokeLinecap="round" />
          <circle cx={origin.x} cy={origin.y} r="9" fill="#7c3aed" stroke="white" strokeWidth="2.5" />
          <line x1={origin.x} y1={origin.y} x2={hitX} y2={groundY} stroke="#2563eb" strokeWidth="3.2" strokeLinecap="round" />
          <ellipse cx={hitX} cy={groundY} rx={clamp(fusedSigma * 1.4, 8, 76)} ry="12" fill={passes ? '#059669' : '#dc2626'} fillOpacity="0.13" stroke={passes ? '#059669' : '#dc2626'} strokeWidth="2" />
          <circle cx={hitX} cy={groundY} r="6" fill={passes ? '#059669' : '#dc2626'} stroke="white" strokeWidth="2" />
          <path d={`M ${origin.x + 42} ${origin.y} A 42 42 0 0 1 ${origin.x + 42 * Math.cos(angle * Math.PI / 180)} ${origin.y + 42 * Math.sin(angle * Math.PI / 180)}`} fill="none" stroke="#d97706" strokeWidth="2" />
          <text x="42" y="274" fontSize="11" fill="currentColor" opacity="0.58">shallow angle → denominator 작음 → intersection과 covariance가 path 방향으로 확대</text>
        </svg>
        <p className="mb-3 mt-2 text-xs leading-relaxed text-muted-foreground sm:hidden">얕은 입사각에서는 분모가 작아져 교점과 공분산이 ray 방향으로 크게 늘어난다.</p>
        <MetricGrid mobileColumns={2} items={[
          { label: 'plane amplification', value: `${planeAmplification.toFixed(2)}×`, accent: angle < 18 },
          { label: 'plane sigma', value: `${planeSigma.toFixed(1)} mm` },
          { label: 'depth sigma', value: `${depthNoise} mm` },
          { label: 'fused sigma', value: `${fusedSigma.toFixed(1)} mm`, accent: !passes },
        ]} />
        <div className="mt-5 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-4">
          {[
            ['calibration ID', true],
            ['acquisition TF', true],
            ['depth / plane', angle >= 12],
            ['covariance gate', passes],
          ].map(([label, valid]) => <div key={String(label)} className="flex min-w-0 items-center gap-2 bg-background p-3 text-xs font-semibold">
            {valid ? <Check className="h-4 w-4 shrink-0 text-emerald-600" /> : <CircleX className="h-4 w-4 shrink-0 text-red-600" />}
            <span>{label}</span>
          </div>)}
        </div>
      </div>
    </VizFrame>
  );
}

export default function RobotCameraGeometryCalibrationArticle() {
  return (
    <>
      <BeginnerOpening
        title="사진에서 물체를 찾았다는 것만으로 로봇이 닿을 위치까지 알 수는 없다"
        description={<>사진을 이루는 가로·세로 칸 하나를 <strong>pixel</strong>이라고 한다. 사진 속 pixel은 카메라에서 어느 방향을 바라봐야 하는지는 알려 주지만, 그 방향으로 얼마나 멀리 가야 하는지는 알려 주지 않는다. 그 거리가 <strong>depth</strong>다. 마지막에는 카메라 기준 위치를 로봇 몸체 기준 위치로 옮겨야 한다.</>}
        familiarScene={<>사진에서 같은 크기로 보이는 공 하나가 카메라 가까이에 있을 수도 있고, 더 큰 공이 멀리 있을 수도 있다. 화면의 같은 점을 가리켜도 실제 거리는 여러 개다. 움직이는 로봇이라면 사진을 찍은 순간 카메라가 어디를 향했는지도 함께 알아야 한다.</>}
        steps={[
          { label: '화면에서 방향을 찾는다', detail: '물체가 놓인 pixel을 카메라에서 나가는 한 줄의 방향으로 바꾼다.' },
          { label: '거리 정보를 붙인다', detail: '깊이 센서나 평면 조건으로 그 줄 위의 한 점을 고른다.' },
          { label: '로봇 기준으로 옮긴다', detail: '사진을 찍은 시각의 카메라 위치와 방향을 사용한다.' },
        ]}
      />
      <QuestionLead
        label="이제 확인할 질문"
        question="사진에서 과일 중심의 화면 위치를 찾기만 하면 로봇 팔이 움직일 3차원 위치도 바로 정해질까?"
        answer="아직 정해지지 않는다. 화면 위치는 카메라에서 나가는 방향 하나만 정한다. 카메라의 영상 기하로 그 방향을 복원하고, 거리 또는 알려진 평면으로 한 점을 고른 뒤, 사진을 찍은 시각의 카메라 위치를 사용해 로봇 몸체 기준으로 옮겨야 한다."
      />

      <ConceptPrimer items={[
        { term: 'Projection', meaning: '3D camera point를 2D pixel로 보내며 depth scale 하나를 잃는 mapping이다.', why: 'Detection box의 center를 곧바로 robot XYZ로 쓰는 오류를 막는다.' },
        { term: 'Intrinsic calibration', meaning: 'Focal length, principal point, skew, distortion이 pixel과 camera ray를 어떻게 연결하는지 추정한다.', why: '같은 pixel도 camera model과 image crop이 다르면 다른 공간 방향이다.' },
        { term: 'Extrinsic / hand-eye', meaning: '한 calibration target pose와 camera의 관계, 또는 camera와 robot gripper 사이의 고정 rigid transform이다.', why: 'Intrinsics와 달리 좌표계 사이의 위치·방향을 결정한다.' },
        { term: 'Reprojection residual', meaning: '추정한 camera model로 3D target point를 다시 투영했을 때 관측 pixel과의 vector 차이다.', why: 'Calibration이 image 전체와 미사용 pose에도 일반화되는지 검사한다.' },
        { term: 'Acquisition timestamp', meaning: 'Sensor가 장면을 실제로 노출한 시각이다.', why: '움직이는 robot에서는 처리 완료 시각의 transform이 다른 물리 자세를 뜻한다.' },
        { term: 'Uncertainty', meaning: 'Pixel, depth, calibration, time 오차가 metric point의 방향별 분산으로 전파된 결과다.', why: 'Planner가 point estimate 하나를 확실한 장애물이나 grasp pose로 오해하지 않게 한다.' },
      ]} />

      <NlpSection id="pixel-ray" marker="01" tone="blue" question="한 pixel을 알면 3D 좌표 세 개 중 무엇이 아직 사라져 있을까?" title="Pixel은 3D 점이 아니라 camera optical center에서 나가는 ray다">
        <p>Camera frame의 점 <code>(X, Y, Z)</code>는 focal length와 principal point를 거쳐 pixel <code>(u, v)</code>로 투영된다. X, Y, Z를 모두 같은 배수로 늘려도 비율 X/Z와 Y/Z는 변하지 않는다. 이 때문에 한 영상은 ray 방향은 보존하지만 metric depth는 잃는다.</p>
        <MathFormula display>{raw`\underbrace{s\begin{bmatrix}u\\v\\1\end{bmatrix}}_{\text{깊이 비율을 잃은 영상점}}=\underbrace{K}_{\text{카메라 내부 기하}}\underbrace{\begin{bmatrix}X_c\\Y_c\\Z_c\end{bmatrix}}_{\text{카메라 좌표계의 3차원 점}}`}</MathFormula>
        <FormulaNote meaning="동차 scale s는 pinhole projection이 절대 깊이를 버린다는 표시다. K는 meter 단위 camera coordinate를 pixel 축으로 바꾸며, 동일 ray 위의 모든 점은 normalization 뒤 같은 (u,v)를 만든다." symbols={[["s", 'Projection 뒤 사라지는 nonzero scale'], ["K", 'fx, fy, cx, cy와 skew를 담은 intrinsic matrix'], ["X_c,Y_c,Z_c", 'Camera optical frame에서의 metric coordinate'], ["u,v", 'Image array의 pixel coordinate']]} />
        <MathFormula display>{raw`\underbrace{r_c}_{\text{크기 없는 카메라 광선}}\propto\underbrace{K^{-1}}_{\text{영상 좌표 눈금 제거}}\underbrace{\begin{bmatrix}u\\v\\1\end{bmatrix}}_{\text{관측 영상점}},\qquad \underbrace{p_c}_{\text{실제 단위의 카메라 점}}=\underbrace{Z_c}_{\text{광축 방향 깊이}}\begin{bmatrix}(u-c_x)/f_x\\(v-c_y)/f_y\\1\end{bmatrix}`}</MathFormula>
        <FormulaNote meaning="K inverse는 pixel을 normalized image plane의 방향으로 되돌린다. 두 번째 식의 Zc는 z축 depth다. Sensor가 Euclidean range를 준다면 unit ray에 range를 곱해야 하므로 depth 정의를 API 계약에서 확인해야 한다." symbols={[["r_c", 'Camera frame의 scale 없는 ray direction'], [raw`K^{-1}`, 'Pixel coordinate를 normalized coordinate로 unproject하는 inverse'], ["Z_c", 'Optical axis를 따라 잰 depth'], ["p_c", 'Depth가 붙은 metric camera point']]} />
        <PinholeRayLab />
        <Misconception>Monocular detector가 만든 box center와 class confidence는 depth가 아니다. Object size prior, stereo, RGB-D, multi-view triangulation, learned depth, 또는 known plane 중 하나가 추가되어야 metric point를 정할 수 있다.</Misconception>
      </NlpSection>

      <NlpSection id="image-geometry" marker="02" tone="violet" question="원본 image를 crop하고 절반으로 줄였는데 calibration YAML을 그대로 써도 될까?" title="Intrinsic matrix는 camera 이름이 아니라 정확한 image geometry에 묶인다">
        <p><code>f_x</code>와 <code>f_y</code>는 pixel 단위 focal length이고 <code>c_x, c_y</code>는 현재 image array의 원점을 기준으로 한 principal point다. Resize는 pixel 단위를 바꾸고 crop은 원점을 옮긴다. 따라서 model input에 맞춘 preprocessing은 K도 같은 방식으로 변환해야 한다.</p>
        <MathFormula display>{raw`\underbrace{f'_x,f'_y}_{\text{크기 변경 뒤 초점거리}}=\underbrace{\alpha f_x,\beta f_y}_{\text{축별 영상 눈금 적용}},\qquad \underbrace{c'_x,c'_y}_{\text{새 광학 중심}}=\underbrace{\alpha(c_x-x_0),\beta(c_y-y_0)}_{\text{잘라낸 원점을 빼고 크기 변경}}`}</MathFormula>
        <FormulaNote meaning="Crop을 먼저 적용하면 principal point에서 crop origin을 빼고, resize를 적용하면 남은 모든 pixel coordinate와 focal length를 같은 축별 scale로 곱한다. Letterbox padding이 추가되면 그 offset을 principal point에 다시 더해야 한다." symbols={[[raw`\alpha,\beta`, '가로·세로 resize scale'], [raw`x_0,y_0`, '원본 image에서 crop이 시작한 pixel'], [raw`f'_x,f'_y`, 'Processed image의 focal lengths'], [raw`c'_x,c'_y`, 'Processed image 원점 기준 principal point']]} />
        <ImageGeometryLab />
        <p>ROS <code>CameraInfo</code>는 raw intrinsic K, rectification R, processed projection P, binning과 ROI를 구분한다. Unrectified detection에 rectified P를 쓰거나, detector의 letterboxed coordinate를 원본 coordinate로 되돌리지 않고 K inverse에 넣는 것도 같은 종류의 geometry contract 위반이다.</p>
        <Takeaway>Calibration file의 camera serial만 맞는지 확인해서는 부족하다. Resolution, ROI, binning, crop, resize, padding, rectification 상태가 관측 pixel과 같은 pipeline에 속해야 한다.</Takeaway>
      </NlpSection>

      <NlpSection id="distortion" marker="03" tone="amber" question="화면 중앙은 맞는데 가장자리 grasp가 계속 빗나가면 무엇을 먼저 볼까?" title="Lens distortion은 pinhole ray를 해석하기 전에 normalized coordinate에서 제거한다">
        <p>이상적인 pinhole model은 직선을 직선으로 투영한다. 실제 lens는 normalized radius가 커질수록 radial displacement를 만들고, lens와 sensor 정렬 오차는 tangential displacement를 만든다. 가장자리 관측일수록 작은 coefficient 오차가 큰 pixel shift로 확대된다.</p>
        <MathFormula display>{raw`\underbrace{r^2}_{\text{광축에서의 거리}}=x^2+y^2,\qquad \underbrace{x_d}_{\text{왜곡된 가로 좌표}}=\underbrace{x(1+k_1r^2+k_2r^4+k_3r^6)}_{\text{반지름 방향 이동}}+\underbrace{2p_1xy+p_2(r^2+2x^2)}_{\text{렌즈 중심 이탈에 의한 이동}}`}</MathFormula>
        <FormulaNote meaning="Radial polynomial은 optical center에서 멀수록 displacement를 키운다. Tangential 항은 lens와 image plane의 decentering을 근사한다. 관측 (xd,yd)에서 ideal (x,y)를 얻는 역문제는 보통 반복 undistortion 또는 미리 계산한 rectification map으로 푼다." symbols={[["x,y", 'Ideal normalized pinhole coordinate'], ["x_d", 'Lens를 통과해 관측된 distorted coordinate'], ["k_1,k_2,k_3", 'Radial distortion coefficients'], ["p_1,p_2", 'Tangential distortion coefficients']]} />
        <DistortionLab />
        <p>Coefficient를 더 많이 넣는다고 항상 좋아지지 않는다. 관측 coverage가 부족하면 고차항이 training corners에는 맞고 image 바깥 또는 edge에서 비단조적인 mapping을 만들 수 있다. OpenCV 문서도 calibration이 center에서는 좋아 보이면서 edge에서 실패할 수 있음을 경고한다.</p>
      </NlpSection>

      <NlpSection id="planar-calibration" marker="04" tone="green" question="평면 checkerboard 사진만으로 3D camera intrinsic을 어떻게 분리할 수 있을까?" title="서로 다른 plane orientation이 homography의 회전 직교 제약을 누적한다">
        <p>Calibration target 좌표계를 평면 <code>Z=0</code>에 놓으면 3D projection에서 rotation의 세 번째 column이 사라지고, target plane에서 image로 가는 3 x 3 homography H가 남는다. Homography의 첫 두 column은 K가 변형한 rotation columns다.</p>
        <MathFormula display>{raw`\underbrace{s\widetilde m}_{\text{영상에서 관측한 점}}=\underbrace{H}_{\text{평면을 영상으로 옮기는 변환}}\underbrace{\widetilde M}_{\text{평면 표적의 점}},\qquad \underbrace{H}_{[h_1\ h_2\ h_3]}=\underbrace{K}_{\text{모든 영상이 공유하는 내부 기하}}\underbrace{[r_1\ r_2\ t]}_{\text{그 영상의 표적 자세}}`}</MathFormula>
        <FormulaNote meaning="Target가 planar이므로 M의 Z coordinate는 항상 0이고 r3 column은 projection에 나타나지 않는다. 각 image에서 H는 다르지만 같은 camera setting이라면 K는 모든 view가 공유한다." symbols={[[raw`\widetilde M`, 'Target plane의 homogeneous 2D coordinate'], ["H", '한 calibration view의 projective mapping'], [raw`r_1,r_2`, 'Camera rotation의 첫 두 orthonormal columns'], ["t", '그 view의 target-to-camera translation']]} />
        <MathFormula display>{raw`\underbrace{h_1^TK^{-T}K^{-1}h_2}_{\text{두 회전축이 서로 수직}}=0,\qquad \underbrace{h_1^TK^{-T}K^{-1}h_1}_{\text{첫 회전축의 제곱 길이}}=\underbrace{h_2^TK^{-T}K^{-1}h_2}_{\text{둘째 회전축의 제곱 길이}}`}</MathFormula>
        <FormulaNote meaning="Rotation matrix의 r1과 r2는 직교하고 unit length가 같다. H에서 K를 제거하면 이 두 성질이 intrinsic parameters에 대한 제약 두 개가 된다. 같은 plane orientation을 translation만 바꿔 반복하면 본질적으로 같은 constraint directions를 재측정할 뿐이다." symbols={[[raw`h_1,h_2`, 'Homography의 첫 두 columns'], [raw`K^{-T}K^{-1}`, 'Intrinsics를 여섯 symmetric coefficients로 묶은 matrix'], ["0", 'Orthogonality가 요구하는 dot product'], ["equal norm", '두 unit rotation columns가 공유하는 scale constraint']]} />
        <MathFormula display>{raw`\underbrace{Vb}_{\text{모든 영상의 내부 기하 제약}}=0,\qquad \underbrace{b^*}_{\text{닫힌 형태로 구한 초기값}}=\underbrace{\operatorname*{argmin}_{\lVert b\rVert=1}\lVert Vb\rVert_2}_{\text{잔차가 가장 작은 특이벡터 선택}}`}</MathFormula>
        <FormulaNote meaning="각 homography의 두 식을 V의 rows로 쌓고, trivial zero solution을 막기 위해 b의 norm을 1로 고정한다. Smallest right singular vector는 algebraic residual이 가장 작은 intrinsic initialization을 준다. 이후 실제 pixel reprojection error로 전체 parameters를 함께 refine한다." symbols={[["V", '여러 view에서 쌓은 2n x 6 constraint matrix'], ["b", 'K inverse의 symmetric quadratic form coefficients'], [raw`\lVert b\rVert=1`, 'Homogeneous scale ambiguity를 제거하는 normalization'], ["SVD", 'V가 가장 덜 제약하는 null direction을 찾는 decomposition']]} />
        <PoseDiversityLab />
        <Misconception>Zhang 논문 simulation에서 약 45도 orientation이 가장 좋았다는 결과는 universal magic angle이 아니다. 그 simulation은 큰 tilt에서 foreshortening 때문에 corner detection이 나빠지는 효과를 포함하지 않았다. 실제 수집은 여러 축의 tilt, 전체 image coverage, sharp corners와 안전한 working distance를 함께 만족해야 한다.</Misconception>
      </NlpSection>

      <NlpSection id="validation" marker="05" tone="blue" question="Reprojection RMS가 0.35 px이면 calibration은 배포해도 되는가?" title="Calibration 품질은 fitting score가 아니라 공간과 pose에 대한 generalization으로 검증한다">
        <p>Zhang의 closed-form solution은 물리 의미가 없는 algebraic distance를 최소화하므로 시작점일 뿐이다. 최종 단계는 모든 corners의 observed pixel과 model projection 사이 제곱 거리를 최소화한다. 하지만 같은 data의 평균 오차는 parameter bias가 deployment에 미치는 효과를 완전히 말해주지 않는다.</p>
        <MathFormula display>{raw`\begin{aligned}
\underbrace{e_{ij}}_{\text{모서리점별 영상 오차}}
&=m_{ij}-\pi(\theta,R_i,t_i,M_j)\\
\underbrace{\mathcal L_{reproj}(\theta)}_{\text{전체 재투영 오차}}
&=\sum_{i=1}^{n}\sum_{j=1}^{m}\|e_{ij}\|_2^2\\
\underbrace{\theta^*}_{\text{다듬어진 보정값}}
&=\operatorname*{argmin}_{\theta}\mathcal L_{reproj}(\theta)
\end{aligned}`}</MathFormula>
        <FormulaNote meaning="theta에는 intrinsics와 distortion이, Ri와 ti에는 각 view의 target pose가 들어간다. Pixel noise가 independent Gaussian이라는 가정 아래 이 objective는 maximum-likelihood estimate에 대응한다. Residual vector를 평균하기 전에 view, image region, direction과 holdout split으로 분해해야 systematic pattern을 볼 수 있다." symbols={[[raw`m_{ij}`, 'View i의 target corner j에서 관측한 pixel'], [raw`\pi`, 'Intrinsics, distortion, extrinsic을 모두 적용한 projection'], [raw`R_i,t_i`, 'View마다 달라지는 target-to-camera pose'], [raw`\theta`, '모든 view가 공유하는 camera parameters']]} />
        <CalibrationValidationLab />
        <p>검증에는 최소한 per-view RMS, edge/center residual vector, 사용하지 않은 holdout pose, calibration subset을 바꾼 parameter stability, known distance 또는 robot touch point의 metric error가 필요하다. Target가 휘었거나 focus·zoom·temperature·mount가 바뀌면 training RMS가 낮아도 다른 물리 camera가 된 것이다.</p>
        <Takeaway>Reprojection residual은 image model의 self-consistency를 측정한다. Robot task의 최종 오차는 depth, hand-eye, robot kinematic calibration과 time alignment까지 포함한 independent metric check로 따로 측정해야 한다.</Takeaway>
      </NlpSection>

      <NlpSection id="hand-eye" marker="06" tone="violet" question="각 image의 target pose를 알면 wrist camera와 gripper의 고정 관계도 자동으로 아는 것일까?" title="Hand-eye calibration은 여러 상대 motion에서 고정 camera-to-gripper transform을 푼다">
        <p>Camera calibration이 반환하는 extrinsic은 calibration target에서 camera로 가는 pose이며 view마다 바뀐다. Hand-eye X는 camera에서 gripper로 가는 rigid mount transform이며 모든 pose에서 고정이다. 두 값을 섞으면 matrix shape는 맞아도 frame chain이 틀린다.</p>
        <MathFormula display>{raw`\underbrace{A_i}_{\text{그리퍼에서 본 상대 운동}}\underbrace{X}_{\text{카메라에서 그리퍼로 가는 고정 장착}}=\underbrace{X}_{\text{모든 자세가 공유하는 장착}}\underbrace{B_i}_{\text{카메라에서 본 상대 운동}}`}</MathFormula>
        <FormulaNote meaning="Robot가 pose i에서 j로 움직인 같은 물리 motion을 gripper coordinates에서는 Ai, camera coordinates에서는 Bi로 표현한다. X는 두 coordinate descriptions 사이의 basis change이므로 어느 쪽으로 먼저 motion을 적용해도 같은 loop endpoint에 도착해야 한다." symbols={[["A_i", 'Robot kinematics에서 얻은 gripper-to-base poses의 relative transform'], ["B_i", 'Target-to-camera observations에서 얻은 camera relative transform'], ["X", '모든 pose pairs가 공유하는 camera-to-gripper transform'], ["AX=XB", 'Closed frame loop가 요구하는 consistency equation']]} />
        <HandEyeLab />
        <p>Tsai와 Lenz는 최소 세 station과 서로 평행하지 않은 두 rotation-axis motion이 full solution에 필요함을 분석했다. Translation이 크더라도 rotation axes가 거의 같으면 X의 일부 방향은 약하게 관측된다. Modern API에 pose arrays를 넣기 전에 transform direction과 eye-in-hand/eye-to-hand setup을 명시해야 한다.</p>
        <Misconception>Hand-eye solve는 robot absolute accuracy를 고쳐주지 않는다. Input robot relative poses, target pose estimates, mount rigidity와 time synchronization의 오차가 X로 전파된다. 결과는 independent poses에서 base-frame target point가 얼마나 일치하는지 검증해야 한다.</Misconception>
      </NlpSection>

      <NlpSection id="time-alignment" marker="07" tone="amber" question="Transform 식과 calibration이 맞는데 움직일 때만 point가 밀리는 이유는 무엇일까?" title="Camera point는 처리 시각이 아니라 image acquisition 시각의 robot pose로 옮긴다">
        <p>Image가 sensor에 들어온 시각, driver가 message를 publish한 시각, inference가 끝난 시각, planner가 읽는 시각은 모두 다르다. Robot가 움직이면 <code>latest</code> transform은 image 안의 장면이 촬영될 때 존재하지 않았던 camera pose다.</p>
        <MathFormula display>{raw`\underbrace{p_b(t_{img})}_{\text{촬영 시각의 기준 좌표계 점}}=\underbrace{T_{bg}(t_{img})}_{\text{시간 버퍼에서 찾은 로봇 자세}}\underbrace{T_{gc}}_{\text{고정 카메라 장착 변환}}\underbrace{p_c(t_{img})}_{\text{카메라 측정점}},\qquad \underbrace{\lVert\delta p\rVert}_{\text{시간 오차의 공간 영향}}\lesssim \underbrace{\lVert v\rVert\Delta t}_{\text{직선 이동 오차}}+\underbrace{\omega\Delta t\,\lVert p_c\rVert}_{\text{회전 이동 오차}}`}</MathFormula>
        <FormulaNote meaning="Tbg는 image acquisition stamp에서 tf2 buffer를 query해야 한다. 오른쪽 bound는 작은 회전과 constant velocity의 1차 근사로, latency budget을 mm 단위 task tolerance로 바꾸는 빠른 진단식이다." symbols={[[raw`t_{img}`, 'Image sensor의 acquisition timestamp'], [raw`T_{bg}(t)`, 'Time-varying gripper-to-base transform'], [raw`T_{gc}`, 'Fixed camera-to-gripper hand-eye transform'], [raw`v,\omega,\Delta t`, 'Linear speed, angular speed, timestamp error']]} />
        <TimeAlignmentLab />
        <p>Global shutter는 모든 rows를 같은 exposure interval에 잡지만 rolling shutter는 row마다 다른 시각에 노출한다. 빠른 motion에서 하나의 frame stamp만 쓰면 image 위·아래가 서로 다른 camera pose를 가진다. Oth 등의 연구는 line delay와 continuous-time camera trajectory까지 함께 추정해야 하는 경우를 보여준다.</p>
        <div className="not-prose my-6 flex items-start gap-3 border-y border-border bg-muted/15 px-4 py-4 text-sm leading-relaxed">
          <Clock3 className="mt-0.5 h-4 w-4 shrink-0 text-amber-600" />
          <p><strong>운영 규칙.</strong> <code>CameraInfo.header.stamp</code>와 image stamp는 acquisition time이어야 한다. TF extrapolation, transform age, exposure/readout metadata와 time-source synchronization을 로그로 남긴다.</p>
        </div>
      </NlpSection>

      <NlpSection id="metric-uncertainty" marker="08" tone="green" question="Ray에 depth를 붙인 점 하나를 바로 obstacle 또는 grasp pose로 확정해도 될까?" title="Metric point와 covariance, calibration provenance를 함께 planning scene에 전달한다">
        <p>Known plane을 쓰면 camera origin <code>o</code>에서 ray <code>r</code>를 따라가며 plane equation을 만족하는 scale을 푼다. Ray가 plane과 거의 평행하면 denominator가 작아져 pixel과 plane-normal의 작은 오차가 교점 위치를 크게 흔든다.</p>
        <MathFormula display>{raw`\begin{aligned}
p_{\text{광선}}(\lambda)&=o+\lambda r\\
a_{\text{평면값}}&=n^To+d\\
b_{\text{교차각}}&=n^Tr\\
\lambda^*_{\text{거리}}&=-\frac{a}{b}
\end{aligned}`}</MathFormula>
        <FormulaNote meaning="Plane의 nTp+d=0에 ray를 대입해 lambda를 푼다. nTr가 0에 가까우면 ray가 plane과 거의 평행해 교점이 멀리 이동하고 uncertainty가 폭발한다. 따라서 수치적으로 점이 나오더라도 angle과 covariance gate가 필요하다." symbols={[["o", 'Intersection을 시작하는 camera origin'], ["r", 'Undistorted, normalized unit ray'], ["n,d", 'Metric frame에서 정의한 plane normal과 offset'], [raw`n^Tr`, 'Ray가 plane을 안정적으로 가로지르는 정도']]} />
        <MathFormula display>{raw`\underbrace{\Sigma_{p_b}}_{\text{기준 좌표계 점의 방향별 불확실성}}\approx\underbrace{J_z\Sigma_zJ_z^T}_{\text{영상점과 깊이 오차 전파}}+\underbrace{J_\xi\Sigma_\xi J_\xi^T}_{\text{보정값과 자세 오차 전파}}`}</MathFormula>
        <FormulaNote meaning="Nonlinear unprojection과 transform을 current estimate 주변에서 선형화한 first-order covariance propagation이다. Pixel/depth noise와 extrinsic/robot pose uncertainty를 분리해 어느 축이 불확실한지 보존한다. 큰 비선형 구간이나 multi-modal depth에는 sampling 또는 richer belief가 필요하다." symbols={[[raw`\Sigma_z`, 'Pixel과 depth 또는 plane measurement covariance'], [raw`J_z`, 'Measurement에서 base point로 가는 local Jacobian'], [raw`\Sigma_\xi`, 'Extrinsic과 robot pose perturbation covariance'], [raw`\Sigma_{p_b}`, 'Planner에 전달할 3D positional uncertainty']]} />
        <RayPlaneGate />
        <p>Production message에는 point만 넣지 않는다. Camera serial과 calibration hash, raw/rectified mode, image size·ROI, acquisition stamp, depth semantics, TF lookup time, frame chain, covariance, source observation ID와 scene version을 묶는다. 어느 gate가 실패했는지 남겨야 재보정, 재관측, 속도 저감, 또는 grasp 취소를 구분할 수 있다.</p>
        <CapabilityCheck items={[
          '한 pixel이 metric point가 아니라 projective ray임을 식과 geometry로 설명한다.',
          'Resize, crop, padding과 rectification 뒤 K를 올바르게 갱신한다.',
          'Distortion을 제거한 normalized point로 ray를 만들고 edge residual을 별도로 검증한다.',
          'Planar homography가 intrinsic constraint 두 개를 주는 이유와 parallel-pose degeneracy를 설명한다.',
          'Per-view extrinsic과 fixed hand-eye X를 구분하고 AX=XB motion diversity를 설계한다.',
          'Acquisition-time TF, rolling-shutter row time, depth/plane uncertainty를 scene acceptance gate로 묶는다.',
        ]} />
        <Takeaway>Camera calibration의 목적은 예쁜 undistorted image가 아니다. 관측 pixel을 robot가 실행할 수 있는 metric frame으로 옮길 때 생기는 scale, direction, time과 uncertainty를 명시적으로 관리하는 것이다. 다음 글은 이 계약 위에서 detection, segmentation, depth와 temporal fusion을 planning scene으로 조립한다.</Takeaway>
        <LearningHandoff
          description="이 글의 산출물은 좌표계·시각·불확실성이 붙은 metric observation이다. 그 산출물을 실제 장면과 경로로 넘길 때만 다음 글을 연다."
          items={[
            { label: '막히면', slug: 'robot-kinematics-coordinate-frames', title: 'Robot Kinematics & Coordinate Frames', reason: 'Homogeneous transform의 방향, frame composition과 acquisition-time 좌표 변환을 먼저 검산한다.' },
            { label: '이어 읽기', slug: 'robot-perception-scene-construction', title: 'Robot Perception & Scene Construction', reason: 'Metric point·mask·depth를 persistent track, occupancy와 versioned PlanningScene으로 조립한다.' },
            { label: '적용하기', slug: 'robot-localization-slam', title: 'Robot Localization & SLAM', reason: '움직이는 camera의 pose와 covariance를 전역 frame에서 계속 갱신해야 할 때 연결한다.' },
          ]}
        />
        <SourceNotes sources={[
          { label: 'OpenCV Camera Calibration and 3D Reconstruction', href: 'https://docs.opencv.org/4.x/d9/d0c/group__calib3d.html', note: 'Pinhole projection, distortion, intrinsic scaling과 calibrateHandEye frame 계약을 확인하는 공식 문서다.' },
          { label: 'Zhang, A Flexible New Technique for Camera Calibration', href: 'https://www.microsoft.com/en-us/research/wp-content/uploads/2016/02/tr98-71.pdf', note: 'Planar homography constraints, closed-form initialization, maximum-likelihood refinement, degeneracy와 target non-planarity 실험의 원문이다.' },
          { label: 'Tsai & Lenz, 3D Robotics Hand/Eye Calibration (1989)', href: 'https://doi.org/10.1109/70.34770', note: 'Relative robot/camera motions에서 fixed hand-eye transform을 구하고 rotation-axis diversity를 분석한 원 논문이다.' },
          { label: 'ROS 2 sensor_msgs/CameraInfo', href: 'https://docs.ros.org/en/ros2_packages/rolling/api/sensor_msgs/msg/CameraInfo.html', note: 'Acquisition stamp, optical frame, K·R·P, ROI와 binning의 current message contract다.' },
          { label: 'ROS 2 tf2 Architecture', href: 'https://docs.ros.org/en/rolling/p/tf2/generated/doxygen/html/', note: 'Frame tree를 시간에 따라 buffer하고 requested time에서 transform하는 공식 설계 문서다.' },
          { label: 'ROS REP-103', href: 'https://www.ros.org/reps/rep-0103.html', note: 'Body와 optical frame의 axis convention을 정의한다.' },
          { label: 'Oth et al., Rolling Shutter Camera Calibration (CVPR 2013)', href: 'https://www.cv-foundation.org/openaccess/content_cvpr_2013/html/Oth_Rolling_Shutter_Camera_2013_CVPR_paper.html', note: 'Moving rolling-shutter camera에서 line delay와 continuous-time pose model이 필요한 근거다.' },
        ]} />
      </NlpSection>
    </>
  );
}
