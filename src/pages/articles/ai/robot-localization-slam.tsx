import { useMemo, useState } from 'react';
import { Activity, CircleAlert, MapPinned, RefreshCw, Route, ScanLine } from 'lucide-react';
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

type EstimationProblem = 'odometry' | 'localization' | 'mapping' | 'slam';

function ProblemContractLab() {
  const [problem, setProblem] = useState<EstimationProblem>('slam');
  const contract = {
    odometry: { known: 'motion observations', unknown: 'local pose change', output: 'continuous local pose', gauge: '시작 pose를 임의로 둠' },
    localization: { known: 'map + observations', unknown: 'robot pose', output: 'pose in known map', gauge: 'map이 기준을 정함' },
    mapping: { known: 'poses + observations', unknown: 'environment map', output: 'map in pose frame', gauge: '주어진 poses가 기준' },
    slam: { known: 'relative observations', unknown: 'poses + map', output: 'joint posterior', gauge: 'global origin·heading 자유' },
  }[problem];
  const gaugeDanger = problem === 'slam';
  return (
    <VizFrame eyebrow="ESTIMATION CONTRACT" title="먼저 무엇이 주어지고 무엇을 추정하는지 분리한다" status={gaugeDanger ? 'anchor 없으면 해가 움직임' : '기준 frame 결정'} danger={gaugeDanger}>
      <div className="border-b border-border bg-blue-500/[0.025] p-4">
        <SegmentedControl label="problem" options={[
          { value: 'odometry', label: 'Odometry' },
          { value: 'localization', label: 'Localization' },
          { value: 'mapping', label: 'Mapping' },
          { value: 'slam', label: 'SLAM' },
        ]} value={problem} onChange={setProblem} />
      </div>
      <div className="grid gap-px bg-border sm:grid-cols-3">
        {[
          ['KNOWN', contract.known, '입력으로 신뢰하는 상태'],
          ['UNKNOWN', contract.unknown, '확률분포로 추정할 상태'],
          ['OUTPUT', contract.output, contract.gauge],
        ].map(([label, value, note]) => <div key={label} className="min-w-0 bg-background p-4 sm:p-5"><p className="font-mono text-[10px] font-black text-muted-foreground">{label}</p><p className="mt-3 text-sm font-black leading-snug">{value}</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">{note}</p></div>)}
      </div>
      <div className="border-t border-border px-4 py-3 text-xs leading-relaxed text-muted-foreground"><strong className="text-foreground">공통 pose packet:</strong> 값만 보내지 않고 parent/child frame, acquisition time, covariance, source lineage와 estimator revision을 함께 보낸다.</div>
    </VizFrame>
  );
}

type DeskewMode = 'single' | 'deskew';

function DeskewLab() {
  const [mode, setMode] = useState<DeskewMode>('single');
  const [rotation, setRotation] = useState(36);
  const scanDuration = 0.1;
  const angularRate = rotation * Math.PI / 180;
  const wallError = mode === 'single' ? 4 * Math.sin(angularRate * scanDuration / 2) * 100 : 1.2;
  const points = useMemo(() => Array.from({ length: 21 }, (_, index) => {
    const y = 28 + index * 7.2;
    const phase = index / 20 - .5;
    const bow = mode === 'single' ? Math.sin(phase * Math.PI) * rotation * .34 : Math.sin(phase * Math.PI) * .8;
    return { x: 210 + bow, y };
  }), [mode, rotation]);
  const accepted = wallError < 5;
  return (
    <VizFrame eyebrow="ACQUISITION-TIME DESKEW" title="움직이며 얻은 scan은 한 시각의 rigid snapshot이 아니다" status={accepted ? `wall error ${wallError.toFixed(1)} cm` : `왜곡 ${wallError.toFixed(1)} cm`} danger={!accepted}>
      <div className="grid gap-4 border-b border-border bg-cyan-500/[0.025] p-4 sm:grid-cols-2">
        <SegmentedControl label="transform policy" options={[{ value: 'single', label: '끝 시각 pose 1개' }, { value: 'deskew', label: 'beam별 deskew' }]} value={mode} onChange={setMode} />
        <label className="text-xs font-semibold text-muted-foreground">회전 속도 · {rotation}°/s<input className="mt-3 block w-full accent-cyan-700" type="range" min="0" max="90" value={rotation} onChange={(event) => setRotation(Number(event.target.value))} /></label>
      </div>
      <div className="grid gap-5 p-4 sm:p-6 md:grid-cols-[1.1fr_.9fr]">
        <svg viewBox="0 0 330 210" className="mx-auto block h-auto w-full max-w-xl" role="img" aria-label="회전 중 LiDAR scan의 deskew 여부에 따른 벽 형상">
          <path d="M 42 180 C 83 152 90 93 57 47" fill="none" stroke="#2563eb" strokeWidth="2.4" strokeLinecap="round" />
          <circle cx="54" cy="175" r="10" fill="#2563eb" stroke="white" strokeWidth="3" />
          <path d="M 58 168 Q 77 145 84 123" fill="none" stroke="#2563eb" strokeWidth="2" strokeDasharray="4 4" />
          <line x1="210" y1="24" x2="210" y2="186" stroke="currentColor" strokeOpacity="0.16" strokeWidth="1.5" />
          {points.map((point, index) => <circle key={index} cx={point.x} cy={point.y} r="3.3" fill={accepted ? '#059669' : '#e11d48'} opacity={.9} />)}
          <text x="224" y="34" fontSize="11" fontWeight="800" fill="currentColor">실제 평면 벽</text>
          <text x="26" y="202" fontSize="10" fontWeight="700" fill="currentColor">100 ms 동안 회전하며 beam 획득</text>
        </svg>
        <div className="flex flex-col justify-center gap-3 text-xs leading-relaxed">
          <div className="border-l-2 border-blue-600 pl-3"><strong>stamp는 한 점이 아니라 interval이다.</strong><p className="mt-1 text-muted-foreground">각 beam의 acquisition time에 pose를 보간하고 sensor extrinsic을 적용한다.</p></div>
          <div className="border-l-2 border-amber-600 pl-3"><strong>도착 시각은 측정 시각이 아니다.</strong><p className="mt-1 text-muted-foreground">Network/driver delay를 pose time으로 쓰면 정지 중에는 숨고 motion에서 bias가 된다.</p></div>
        </div>
      </div>
    </VizFrame>
  );
}

function DriftLab() {
  const [slip, setSlip] = useState(6);
  const [gyroBias, setGyroBias] = useState(0.8);
  const distance = 30;
  const yawError = gyroBias * 12 + slip * .14;
  const lateral = distance * Math.sin(yawError * Math.PI / 180);
  const sigmaMajor = 18 + slip * 2.2 + gyroBias * 16;
  const sigmaMinor = 8 + slip * .45;
  const danger = Math.abs(lateral) > 0.8;
  const desktopEndY = clamp(174 - lateral * 22, 48, 176);
  const mobileEndY = clamp(42 - lateral * 12, 30, 128);
  return (
    <VizFrame eyebrow="DEAD RECKONING" title="작은 heading 오차는 전진할수록 큰 횡방향 위치 오차가 된다" status={`${Math.abs(lateral).toFixed(2)} m cross-track`} danger={danger}>
      <div className="grid gap-4 border-b border-border bg-amber-500/[0.025] p-4 sm:grid-cols-2">
        <label className="text-xs font-semibold text-muted-foreground">wheel slip · {slip}%<input className="mt-3 block w-full accent-amber-700" type="range" min="0" max="18" value={slip} onChange={(event) => setSlip(Number(event.target.value))} /></label>
        <label className="text-xs font-semibold text-muted-foreground">gyro bias · {gyroBias.toFixed(1)}°/s<input className="mt-3 block w-full accent-amber-700" type="range" min="0" max="2" step=".1" value={gyroBias} onChange={(event) => setGyroBias(Number(event.target.value))} /></label>
      </div>
      <div className="p-4 sm:p-6">
        <svg viewBox="0 0 700 230" className="hidden h-auto w-full sm:block" role="img" aria-label="dead reckoning drift와 방향성 covariance ellipse">
          <path d="M 54 174 C 238 174 456 174 642 174" fill="none" stroke="currentColor" strokeOpacity=".18" strokeWidth="2" strokeDasharray="7 7" />
          <path d={`M 54 174 C 235 174 470 ${(174 + desktopEndY) / 2} 642 ${desktopEndY}`} fill="none" stroke={danger ? '#e11d48' : '#2563eb'} strokeWidth="3" strokeLinecap="round" />
          <ellipse cx="642" cy={desktopEndY} rx={sigmaMajor} ry={sigmaMinor} transform={`rotate(${-yawError} 642 ${desktopEndY})`} fill="#d97706" fillOpacity=".1" stroke="#d97706" strokeWidth="1.8" />
          <circle cx="54" cy="174" r="8" fill="#2563eb" /><circle cx="642" cy={desktopEndY} r="8" fill={danger ? '#e11d48' : '#2563eb'} />
          <text x="54" y="204" fontSize="11" fontWeight="800" fill="currentColor">start</text><text x="420" y="28" fontSize="11" fontWeight="800" fill="currentColor">방향성 covariance ellipse</text>
        </svg>
        <div className="sm:hidden">
          <svg viewBox="0 0 330 230" className="block h-auto w-full" role="img" aria-label="mobile dead reckoning drift">
            <path d="M 35 195 C 102 154 195 101 298 42" fill="none" stroke="currentColor" strokeOpacity=".18" strokeWidth="2" strokeDasharray="6 6" />
            <path d={`M 35 195 C 110 160 205 ${(104 + mobileEndY) / 2} 296 ${mobileEndY}`} fill="none" stroke={danger ? '#e11d48' : '#2563eb'} strokeWidth="3" strokeLinecap="round" />
            <ellipse cx="286" cy={mobileEndY + 8} rx={Math.min(42, sigmaMajor)} ry={sigmaMinor} transform={`rotate(-28 286 ${mobileEndY + 8})`} fill="#d97706" fillOpacity=".1" stroke="#d97706" strokeWidth="1.6" />
            <circle cx="35" cy="195" r="8" fill="#2563eb" /><circle cx="286" cy={mobileEndY + 8} r="8" fill={danger ? '#e11d48' : '#2563eb'} />
          </svg>
        </div>
        <MetricGrid mobileColumns={2} items={[
          { label: 'travel', value: `${distance} m` },
          { label: 'yaw error', value: `${yawError.toFixed(1)}°`, accent: yawError > 8 },
          { label: 'lateral drift', value: `${lateral.toFixed(2)} m`, accent: danger },
          { label: 'uncertainty axes', value: `${sigmaMajor.toFixed(0)}:${sigmaMinor.toFixed(0)}`, note: 'major : minor' },
        ]} />
      </div>
    </VizFrame>
  );
}

type FusionPolicy = 'naive' | 'lineage';

function FusionLineageLab() {
  const [policy, setPolicy] = useState<FusionPolicy>('naive');
  const [absoluteSigma, setAbsoluteSigma] = useState(.4);
  const [outlier, setOutlier] = useState(1.6);
  const repeated = policy === 'naive' ? 3 : 1;
  const priorSigma = 1.2;
  const priorInformation = 1 / (priorSigma ** 2);
  const observationInformation = repeated / (absoluteSigma ** 2);
  const posteriorSigma = Math.sqrt(1 / (priorInformation + observationInformation));
  const innovationSigma = Math.sqrt(priorSigma ** 2 + absoluteSigma ** 2);
  const nis = (outlier / innovationSigma) ** 2;
  const overconfident = policy === 'naive' && posteriorSigma < .28;
  const accepted = nis < 5.99;
  return (
    <VizFrame eyebrow="PREDICT → INNOVATE → ACCOUNT" title="같은 wheel evidence가 파생 pipeline을 통해 돌아오면 새 정보가 아니다" status={overconfident ? '상관 무시 · 과신' : accepted ? 'lineage 보존 · correction' : 'innovation reject'} danger={overconfident || !accepted}>
      <div className="grid gap-4 border-b border-border bg-violet-500/[0.025] p-4 md:grid-cols-3">
        <SegmentedControl label="source policy" options={[{ value: 'naive', label: '모두 독립' }, { value: 'lineage', label: 'lineage dedupe' }]} value={policy} onChange={setPolicy} />
        <label className="text-xs font-semibold text-muted-foreground">reported σ · {absoluteSigma.toFixed(1)} m<input className="mt-3 block w-full accent-violet-700" type="range" min=".2" max="1.2" step=".1" value={absoluteSigma} onChange={(event) => setAbsoluteSigma(Number(event.target.value))} /></label>
        <label className="text-xs font-semibold text-muted-foreground">absolute residual · {outlier.toFixed(1)} m<input className="mt-3 block w-full accent-violet-700" type="range" min="0" max="4" step=".1" value={outlier} onChange={(event) => setOutlier(Number(event.target.value))} /></label>
      </div>
      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[1.15fr_.85fr]">
        <div className="grid gap-2 sm:grid-cols-3">
          {[
            ['wheel odom', 'source W', true],
            ['visual odom', 'contains W + camera', policy === 'naive'],
            ['fused odom', 'contains W + IMU', policy === 'naive'],
          ].map(([label, note, counted]) => <div key={String(label)} className={`rounded-sm border p-3 ${counted ? 'border-violet-500/45 bg-violet-500/[0.05]' : 'border-border bg-muted/15 opacity-55'}`}><p className="text-sm font-black">{label}</p><p className="mt-2 text-xs text-muted-foreground">{note}</p><p className="mt-3 font-mono text-[10px] font-black">{counted ? 'COUNTED' : 'CORRELATED'}</p></div>)}
        </div>
        <div className="space-y-2 text-xs">
          <div className="flex justify-between border-b border-border pb-2"><span>normalized innovation d²</span><strong className="font-mono">{nis.toFixed(2)}</strong></div>
          <div className="flex justify-between border-b border-border pb-2"><span>posterior σ</span><strong className="font-mono">{posteriorSigma.toFixed(2)} m</strong></div>
          <div className="flex justify-between border-b border-border pb-2"><span>measurement gate</span><strong>{accepted ? '통과' : '기각'}</strong></div>
          <p className="pt-1 leading-relaxed text-muted-foreground">Residual이 작아도 covariance가 거짓이면 과신한다. Residual이 커도 uncertainty가 큰 방향이면 정규화 gate는 다르게 판단한다.</p>
        </div>
      </div>
    </VizFrame>
  );
}

type FramePolicy = 'single' | 'split';

function FrameSplitLab() {
  const [policy, setPolicy] = useState<FramePolicy>('single');
  const [correction, setCorrection] = useState(.8);
  const localStep = .12;
  const commandJump = policy === 'single' ? correction / localStep : 0;
  const safe = policy === 'split';
  return (
    <VizFrame eyebrow="MAP → ODOM → BASE_LINK" title="Global correction을 local control pose에 직접 쓰면 controller가 순간 이동을 본다" status={safe ? 'local continuity 유지' : `${commandJump.toFixed(1)}× step jump`} danger={!safe}>
      <div className="grid gap-4 border-b border-border bg-blue-500/[0.025] p-4 sm:grid-cols-2">
        <SegmentedControl label="frame policy" options={[{ value: 'single', label: 'Pose 한 개' }, { value: 'split', label: 'map / odom 분리' }]} value={policy} onChange={setPolicy} />
        <label className="text-xs font-semibold text-muted-foreground">loop correction · {correction.toFixed(1)} m<input className="mt-3 block w-full accent-blue-700" type="range" min="0" max="1.6" step=".1" value={correction} onChange={(event) => setCorrection(Number(event.target.value))} /></label>
      </div>
      <div className="p-4 sm:p-6">
        <div className="grid gap-3 sm:grid-cols-[1fr_auto_1fr_auto_1fr] sm:items-center">
          <div className="rounded-sm border border-violet-500/35 bg-violet-500/[0.04] p-4"><p className="font-mono text-[10px] font-black text-violet-700">MAP</p><p className="mt-2 text-sm font-black">global consistency</p><p className="mt-1 text-xs text-muted-foreground">loop closure에서 바뀔 수 있음</p></div>
          <span className="hidden text-muted-foreground sm:block">→</span>
          <div className="rounded-sm border border-blue-500/35 bg-blue-500/[0.04] p-4"><p className="font-mono text-[10px] font-black text-blue-700">ODOM</p><p className="mt-2 text-sm font-black">local continuity</p><p className="mt-1 text-xs text-muted-foreground">drift하지만 jump 금지</p></div>
          <span className="hidden text-muted-foreground sm:block">→</span>
          <div className="rounded-sm border border-border p-4"><p className="font-mono text-[10px] font-black text-muted-foreground">BASE_LINK</p><p className="mt-2 text-sm font-black">robot body</p><p className="mt-1 text-xs text-muted-foreground">controller의 current state</p></div>
        </div>
        <MetricGrid mobileColumns={2} items={[
          { label: 'map correction', value: `${correction.toFixed(1)} m`, note: policy === 'split' ? 'map→odom에 반영' : 'pose에 직접 반영' },
          { label: 'odom local step', value: `${localStep.toFixed(2)} m` },
          { label: 'controller jump', value: `${commandJump.toFixed(1)}×`, accent: !safe },
          { label: 'global plan', value: correction ? 'invalidate' : 'keep', accent: correction > 0 },
        ]} />
      </div>
    </VizFrame>
  );
}

type GeometryMode = 'corridor' | 'corner';

function ObservabilityLab() {
  const [geometry, setGeometry] = useState<GeometryMode>('corridor');
  const [overlap, setOverlap] = useState(72);
  const weakEigenvalue = geometry === 'corridor' ? .04 + overlap / 2500 : .48 + overlap / 250;
  const strongEigenvalue = .9 + overlap / 75;
  const condition = strongEigenvalue / weakEigenvalue;
  const degenerate = condition > 20;
  return (
    <VizFrame eyebrow="FRONT-END OBSERVABILITY" title="점이 많이 맞아도 환경 geometry가 어떤 motion을 보지 못할 수 있다" status={degenerate ? `condition ${condition.toFixed(0)} · 약한 축` : `condition ${condition.toFixed(1)} · 관측 가능`} danger={degenerate}>
      <div className="grid gap-4 border-b border-border bg-amber-500/[0.025] p-4 sm:grid-cols-2">
        <SegmentedControl label="scene geometry" options={[{ value: 'corridor', label: '평행 aisle' }, { value: 'corner', label: 'corner' }]} value={geometry} onChange={setGeometry} />
        <label className="text-xs font-semibold text-muted-foreground">scan overlap · {overlap}%<input className="mt-3 block w-full accent-amber-700" type="range" min="20" max="95" value={overlap} onChange={(event) => setOverlap(Number(event.target.value))} /></label>
      </div>
      <div className="grid gap-5 p-4 sm:p-6 md:grid-cols-[1fr_.85fr]">
        <svg viewBox="0 0 360 230" className="mx-auto block h-auto w-full max-w-lg" role="img" aria-label="parallel corridor와 corner의 scan matching observability">
          {geometry === 'corridor' ? <>
            <path d="M 25 45 C 120 43 245 47 335 44" fill="none" stroke="currentColor" strokeOpacity=".3" strokeWidth="3" />
            <path d="M 25 186 C 130 188 245 184 335 187" fill="none" stroke="currentColor" strokeOpacity=".3" strokeWidth="3" />
            {Array.from({ length: 9 }, (_, i) => <g key={i}><circle cx={46 + i * 34} cy={48 + (i % 2) * 2} r="3" fill="#2563eb" /><circle cx={48 + i * 34} cy={184 - (i % 2) * 2} r="3" fill="#2563eb" /></g>)}
            <path d="M 110 116 C 160 116 212 116 270 116" fill="none" stroke="#d97706" strokeWidth="2.5" strokeDasharray="6 5" /><path d="M 260 108 L 274 116 L 260 124" fill="none" stroke="#d97706" strokeWidth="2.5" />
            <text x="105" y="101" fontSize="11" fontWeight="800" fill="currentColor">이 방향 translation은 비슷하게 맞음</text>
          </> : <>
            <path d="M 38 42 L 38 190 L 326 190" fill="none" stroke="currentColor" strokeOpacity=".32" strokeWidth="3" strokeLinejoin="round" />
            {Array.from({ length: 8 }, (_, i) => <circle key={`v-${i}`} cx={41} cy={58 + i * 16} r="3" fill="#2563eb" />)}
            {Array.from({ length: 13 }, (_, i) => <circle key={`h-${i}`} cx={58 + i * 19} cy={187} r="3" fill="#059669" />)}
            <path d="M 146 98 L 196 98 M 187 89 L 198 98 L 187 107" fill="none" stroke="#059669" strokeWidth="2.3" /><path d="M 146 98 L 146 148 M 138 139 L 146 150 L 154 139" fill="none" stroke="#059669" strokeWidth="2.3" />
            <text x="110" y="76" fontSize="11" fontWeight="800" fill="currentColor">두 normal이 2D motion을 묶음</text>
          </>}
        </svg>
        <div className="flex flex-col justify-center">
          <p className="text-xs font-bold text-muted-foreground">information eigenvalues</p>
          <div className="mt-4 space-y-4">
            <div><div className="mb-1 flex justify-between text-xs"><span>강하게 보이는 축</span><strong>{strongEigenvalue.toFixed(2)}</strong></div><div className="h-2 rounded-sm bg-muted"><div className="h-full rounded-sm bg-blue-600" style={{ width: `${clamp(strongEigenvalue / 2.2 * 100, 4, 100)}%` }} /></div></div>
            <div><div className="mb-1 flex justify-between text-xs"><span>약하게 보이는 축</span><strong>{weakEigenvalue.toFixed(2)}</strong></div><div className="h-2 rounded-sm bg-muted"><div className={`h-full rounded-sm ${degenerate ? 'bg-amber-600' : 'bg-emerald-600'}`} style={{ width: `${clamp(weakEigenvalue / 2.2 * 100, 3, 100)}%` }} /></div></div>
          </div>
          <p className="mt-5 text-xs leading-relaxed text-muted-foreground">Residual 평균만 보면 degeneracy를 놓친다. Hessian의 작은 eigenvalue는 그 방향의 pose 변화가 cost를 거의 바꾸지 않는다는 뜻이다.</p>
        </div>
      </div>
    </VizFrame>
  );
}

function PoseGraphLab() {
  const [loopClosure, setLoopClosure] = useState(false);
  const [drift, setDrift] = useState(34);
  const correction = loopClosure ? drift * .82 : 0;
  const poses = useMemo(() => Array.from({ length: 8 }, (_, index) => {
    const angle = index / 7 * Math.PI * 1.82;
    const radius = 78;
    const baseX = 165 + Math.cos(angle) * radius;
    const baseY = 112 + Math.sin(angle) * radius;
    const accumulated = index / 7 * drift;
    const corrected = loopClosure ? accumulated * .18 : accumulated;
    return { x: baseX + corrected, y: baseY - corrected * .22 };
  }), [drift, loopClosure]);
  return (
    <VizFrame eyebrow="POSE GRAPH BACK-END" title="새 closure는 마지막 pose만 당기는 게 아니라 모든 관계의 타협점을 다시 푼다" status={loopClosure ? `${correction.toFixed(0)} px drift 회수` : 'open chain · drift 누적'} danger={!loopClosure}>
      <div className="grid gap-4 border-b border-border bg-violet-500/[0.025] p-4 sm:grid-cols-2">
        <label className="flex min-h-11 items-center gap-2 text-xs font-semibold"><input type="checkbox" checked={loopClosure} onChange={(event) => setLoopClosure(event.target.checked)} /> verified loop factor 추가</label>
        <label className="text-xs font-semibold text-muted-foreground">odometry drift · {drift}<input className="mt-3 block w-full accent-violet-700" type="range" min="5" max="55" value={drift} onChange={(event) => setDrift(Number(event.target.value))} /></label>
      </div>
      <div className="grid gap-5 p-4 sm:p-6 md:grid-cols-[1fr_.85fr]">
        <svg viewBox="0 0 360 230" className="mx-auto block h-auto w-full max-w-lg" role="img" aria-label="odometry factors와 loop closure가 있는 pose graph">
          {poses.slice(0, -1).map((pose, index) => <path key={index} d={`M ${pose.x} ${pose.y} C ${(pose.x + poses[index + 1].x) / 2} ${pose.y} ${(pose.x + poses[index + 1].x) / 2} ${poses[index + 1].y} ${poses[index + 1].x} ${poses[index + 1].y}`} fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" opacity=".68" />)}
          {loopClosure && <path d={`M ${poses[7].x} ${poses[7].y} Q 165 18 ${poses[0].x} ${poses[0].y}`} fill="none" stroke="#7c3aed" strokeWidth="3" strokeDasharray="7 5" strokeLinecap="round" />}
          {poses.map((pose, index) => <g key={index}><circle cx={pose.x} cy={pose.y} r={index === 0 ? 8 : 6} fill={index === 0 ? '#059669' : '#2563eb'} stroke="white" strokeWidth="2" /><text x={pose.x + 8} y={pose.y - 7} fontSize="9" fontWeight="800" fill="currentColor">x{index}</text></g>)}
          <text x="18" y="216" fontSize="10" fontWeight="700" fill="currentColor">x0 prior가 global gauge를 고정</text>
        </svg>
        <div className="flex flex-col justify-center gap-3 text-xs leading-relaxed">
          {[
            ['1', 'residual 구성', '각 factor의 예측 상대 pose와 측정을 비교'],
            ['2', 'whiten', 'covariance inverse로 신뢰 방향을 반영'],
            ['3', 'linearize · solve', '현재 estimate 주변 sparse system을 풂'],
            ['4', 'retract · repeat', 'manifold pose를 갱신하고 다시 선형화'],
          ].map(([number, label, note]) => <div key={number} className="grid grid-cols-[1.75rem_minmax(0,1fr)] gap-2 border-b border-border pb-2"><span className="font-mono font-black text-violet-700">{number}</span><p><strong>{label}</strong><span className="block text-muted-foreground">{note}</span></p></div>)}
        </div>
      </div>
    </VizFrame>
  );
}

type RobustPolicy = 'gaussian' | 'huber' | 'switch';

function LoopRobustnessLab() {
  const [policy, setPolicy] = useState<RobustPolicy>('gaussian');
  const [closure, setClosure] = useState<'true' | 'false'>('false');
  const residual = closure === 'true' ? .35 : 3.8;
  const k = 1.2;
  const weight = policy === 'gaussian' ? 1 : policy === 'huber' ? Math.min(1, k / residual) : residual > 2 ? .04 : .94;
  const deformation = closure === 'true' ? Math.abs(1 - weight) * .16 : weight * 2.4;
  const safe = closure === 'true' ? weight > .7 : weight < .2;
  return (
    <VizFrame eyebrow="LOOP CLOSURE HYPOTHESIS" title="Nonlocal edge 하나는 정보를 크게 주지만 잘못되면 map 전체를 접는다" status={safe ? `weight ${weight.toFixed(2)} · 일관` : `deformation ${deformation.toFixed(2)} m`} danger={!safe}>
      <div className="grid gap-4 border-b border-border bg-rose-500/[0.025] p-4 sm:grid-cols-2">
        <SegmentedControl label="closure candidate" options={[{ value: 'true', label: '실제 재방문' }, { value: 'false', label: '닮은 다른 aisle' }]} value={closure} onChange={setClosure} />
        <SegmentedControl label="graph loss" options={[{ value: 'gaussian', label: 'Gaussian' }, { value: 'huber', label: 'Huber' }, { value: 'switch', label: 'Switchable' }]} value={policy} onChange={setPolicy} />
      </div>
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-border bg-border lg:grid-cols-4">
          {[
            ['01', 'Place proposal', closure === 'true' ? 'same place .86' : 'same place .94'],
            ['02', 'Geometry', closure === 'true' ? 'residual .35σ' : 'residual 3.8σ'],
            ['03', 'Robust weight', weight.toFixed(2)],
            ['04', 'Graph action', safe ? 'accept / retain' : 'map deforms'],
          ].map(([number, label, value]) => <div key={number} className="min-w-0 bg-background p-4"><p className="font-mono text-[10px] font-black text-muted-foreground">{number}</p><p className="mt-3 text-xs font-bold">{label}</p><p className={`mt-2 text-sm font-black ${!safe && number === '04' ? 'text-red-700' : ''}`}>{value}</p></div>)}
        </div>
        <p className="mt-4 text-xs leading-relaxed text-muted-foreground">Semantic confidence는 candidate를 제안할 뿐이다. Geometric verification, whitened residual, cycle consistency와 robust policy를 통과하기 전까지 graph의 강한 edge로 승격하지 않는다.</p>
      </div>
    </VizFrame>
  );
}

type RebasePolicy = 'baked' | 'partial' | 'atomic';

function RebaseLab() {
  const [policy, setPolicy] = useState<RebasePolicy>('baked');
  const [correction, setCorrection] = useState(.8);
  const state = {
    baked: { map: false, tracks: false, path: false, version: 42, decision: '실행 금지', errors: 4 },
    partial: { map: true, tracks: false, path: false, version: 43, decision: 'revision 혼합', errors: 2 },
    atomic: { map: true, tracks: true, path: true, version: 43, decision: 'replan 후 실행', errors: 0 },
  }[policy];
  const safe = state.errors === 0;
  return (
    <VizFrame eyebrow="GLOBAL REBASE TRANSACTION" title="Loop correction은 pose 하나의 변경이 아니라 모든 global artifact의 revision 변경이다" status={safe ? `revision ${state.version} 일치` : `${state.errors} consistency violations`} danger={!safe}>
      <div className="grid gap-4 border-b border-border bg-emerald-500/[0.025] p-4 sm:grid-cols-2">
        <SegmentedControl label="rebase policy" options={[{ value: 'baked', label: 'Baked 유지' }, { value: 'partial', label: 'Map만' }, { value: 'atomic', label: 'Atomic' }]} value={policy} onChange={setPolicy} />
        <label className="text-xs font-semibold text-muted-foreground">global correction · {correction.toFixed(1)} m<input className="mt-3 block w-full accent-emerald-700" type="range" min=".1" max="1.5" step=".1" value={correction} onChange={(event) => setCorrection(Number(event.target.value))} /></label>
      </div>
      <div className="p-4 sm:p-6">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {[
            ['submaps / occupancy', state.map, state.map ? 'pose provenance로 재배치' : `${correction.toFixed(1)} m ghost wall`],
            ['semantic tracks', state.tracks, state.tracks ? 'revision 43' : 'revision 42'],
            ['goal / global path', state.path, state.path ? 'invalidate · replan' : 'old geometry'],
            ['local controller', true, 'odom continuity 유지'],
          ].map(([label, ok, note]) => <div key={String(label)} className={`min-w-0 rounded-sm border p-3 ${ok ? 'border-emerald-500/35 bg-emerald-500/[0.04]' : 'border-red-500/35 bg-red-500/[0.04]'}`}><p className="text-xs font-black leading-snug">{label}</p><p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">{note}</p></div>)}
        </div>
        <MetricGrid mobileColumns={2} items={[
          { label: 'scene revision', value: String(state.version), accent: state.version === 42 },
          { label: 'revision agreement', value: safe ? 'all 43' : 'mixed', accent: !safe },
          { label: 'local continuity', value: 'preserved', accent: true },
          { label: 'execution gate', value: state.decision, accent: !safe },
        ]} />
      </div>
    </VizFrame>
  );
}

export default function RobotLocalizationSlamArticle() {
  return (
    <>
      <BeginnerOpening
        title="걸음 수만 세어 간 위치는 오래 걸을수록 실제 위치와 어긋난다"
        description={<>로봇의 위치와 방향을 합친 값을 <strong>pose</strong>라고 한다. 바퀴 회전처럼 바로 전 순간부터 얼마나 움직였는지를 계속 더한 결과가 <strong>odometry</strong>다. 이미 있는 지도에서 현재 pose를 찾는 일은 <strong>localization</strong>, pose와 지도를 함께 추정하는 일이 <strong>SLAM</strong>이다.</>}
        familiarScene={<>눈을 감고 앞으로 열 걸음씩 걷는다고 하자. 매 걸음의 길이와 방향이 조금씩 틀리면 머릿속 위치는 계속 밀린다. 문이나 기둥처럼 다시 알아볼 수 있는 장소를 만나면 전체 위치를 고칠 수 있지만, 그 단서를 다른 문으로 착각하면 오히려 지도가 크게 접힐 수 있다.</>}
        steps={[
          { label: '짧은 움직임을 누적한다', detail: '바퀴와 관성 센서로 부드럽지만 조금씩 흐르는 위치를 만든다.' },
          { label: '주변과의 관계를 측정한다', detail: '벽·특징점·이미 방문한 장소를 상대 위치의 단서로 바꾼다.' },
          { label: '모든 단서를 함께 맞춘다', detail: '현재와 과거 위치, 지도가 서로 가장 일관되도록 조정한다.' },
        ]}
      />
      <QuestionLead label="이제 확인할 질문" question="바퀴와 여러 센서 값을 섞어 지도를 그리기만 하면 로봇의 현재 위치도 자동으로 정확해질까?" answer="아니다. 바퀴로 누적한 움직임, 이미 있는 지도에서 찾는 위치, 새 지도를 만드는 일은 서로 다른 문제다. 무엇을 이미 알고 무엇을 추정할지 먼저 나눈 뒤, 같은 시각과 좌표를 가리키는 센서 관계로 로봇의 이동 경로와 지도를 함께 맞춰야 한다." />

      <NlpSection id="problem-contract" marker="01" tone="blue" question="로봇은 움직이는 동안 지금 어디에 있는지 어떻게 계속 알아낼까?" title="움직임을 누적한 위치와 주변 단서로 고친 위치는 맡은 역할이 다르다">
        <ConceptPrimer title="다섯 단어를 state contract로 구분한다" items={[
          { term: 'Motion / control', meaning: '입력과 dynamics로 다음 상태를 의도하거나 예측한다. 실제 pose를 직접 측정하지 않는다.', why: '명령과 관측을 구분해야 control input을 위치의 정답처럼 쓰지 않는다.' },
          { term: 'Odometry', meaning: '인접 시각 사이의 motion을 누적해 locally smooth pose를 만든다. 시작 기준은 임의이고 drift가 쌓인다.', why: '짧은 구간의 움직임에는 강하지만 global 기준을 보장하지 않는다는 한계를 정한다.' },
          { term: 'Localization', meaning: '이미 알려진 map에서 현재 robot pose를 추정한다.', why: '추정할 unknown이 pose인지 map까지 포함하는지 먼저 고정한다.' },
          { term: 'Mapping', meaning: 'Pose가 주어졌다고 보고 observations를 environment representation에 배치한다.', why: 'Pose uncertainty를 무시하면 같은 벽이 번지거나 겹쳐 그려지는 이유를 찾을 수 있다.' },
          { term: 'SLAM', meaning: 'Poses와 map이 모두 unknown일 때 상대 observations로 joint posterior를 푼다.', why: 'Pose와 map의 오차가 서로 얽히므로 두 문제를 따로 푼다고 가정할 수 없다.' },
        ]} />
        <MathFormula display>{raw`\underbrace{(X^*,M^*)}_{\text{최적 poses와 map}}=\underbrace{\operatorname*{argmax}_{X,M}p(X,M\mid Z,U)}_{\text{관측 뒤 posterior 최대화}}`}</MathFormula>
        <MathFormula display>{raw`\underbrace{(X^*,M^*)}_{\text{같은 최적해}}=\underbrace{\operatorname*{argmin}_{X,M}\sum_k\lVert r_k(X,M)\rVert_{\Omega_k}^{2}}_{\text{whitened relation 오차 합 최소화}}`}</MathFormula>
        <FormulaNote meaning="SLAM posterior를 구현할 때는 sensor/control observations를 residual factors로 바꾸고 information Ω로 whiten한다. 이 식은 association이 맞고 noise model이 적절하다는 보장을 포함하지 않으며, 상대 관측만 있으면 global origin과 heading은 gauge freedom으로 남는다." symbols={[[raw`X=\{x_0,\ldots,x_T\}`, '시간에 따른 robot poses'], [raw`M`, 'landmarks, submaps, occupancy 등 environment variables'], [raw`Z,U`, 'sensor observations와 motion/control evidence'], [raw`\Omega_k=\Sigma_k^{-1}`, 'k번째 residual의 information matrix']]} />
        <ProblemContractLab />
        <Misconception>Pose 숫자 세 개만 같으면 같은 상태가 아니다. `map`에서의 pose와 `odom`에서의 pose, acquisition time과 arrival time, 서로 다른 estimator revision의 pose는 값이 비슷해도 직접 섞을 수 없다.</Misconception>
      </NlpSection>

      <NlpSection id="measurement-time" marker="02" tone="teal" question="100 ms 동안 회전하며 얻은 LiDAR scan 전체를 마지막 pose로 변환하면 벽은 왜 휘어질까?" title="Measurement는 callback 시각이 아니라 acquisition-time state에 연결한다">
        <p>Sensor message는 단일 숫자가 아니라 관측이 생성된 시간 구간과 좌표계의 계약이다. Wheel·IMU는 높은 빈도의 point samples에 가깝지만 spinning LiDAR, rolling-shutter camera와 radar sweep은 한 frame 안에서도 각 sample 시각이 다르다. Robot이 움직이면 하나의 transform을 전체 frame에 적용하는 순간 정적인 세계가 휘거나 이중으로 보인다.</p>
        <MathFormula display>{raw`\begin{aligned}\underbrace{z_i^{m}}_{\text{i번째 raw sample}}&=\underbrace{h_i\!\left(x(\tau_i),T_{bs},m\right)}_{\text{실제 획득 시각에서 생성}}+\underbrace{v_i}_{\text{sensor noise}}\\[5pt]\underbrace{p_b(\tau_i)}_{\text{획득 시각 body 점}}&=\underbrace{T_{bs}p_s(\tau_i)}_{\text{sensor extrinsic 적용}}\\[5pt]\underbrace{p_b(\tau_r)}_{\text{기준 시각 body 점}}&=\underbrace{T_{b(\tau_r)b(\tau_i)}p_b(\tau_i)}_{\text{획득 중 motion 보정}}\end{aligned}`}</MathFormula>
        <FormulaNote meaning="각 sample을 reference time τr의 body frame으로 옮기는 deskew 식이다. Motion interpolation이 부정확하거나 sensor-clock offset과 extrinsic Tbs가 틀리면 deskew 자체가 systematic distortion을 만든다." symbols={[[raw`\tau_i,\tau_r`, 'sample acquisition time과 chosen reference time'], [raw`T_{bs}`, 'sensor frame에서 body frame으로의 calibrated transform'], [raw`T_{b(\tau_r)b(\tau_i)}`, '획득 구간의 body motion'], [raw`h_i`, '해당 sensor의 measurement model']]} />
        <DeskewLab />
        <Takeaway>Transport latency는 늦게 도착한 정도이고, acquisition skew는 서로 다른 과거 state를 한 frame으로 묶은 정도다. 둘은 buffer와 state interpolation 정책이 다르다.</Takeaway>
      </NlpSection>

      <NlpSection id="dead-reckoning" marker="03" tone="amber" question="Wheel distance 오차보다 작은 gyro bias가 긴 aisle 끝에서 더 큰 위치 오차를 만드는 이유는 무엇일까?" title="Dead reckoning은 motion을 적분하고 uncertainty를 방향성 있게 키운다">
        <p>Planar robot에서 forward velocity는 현재 heading 방향으로 위치를 바꾼다. 따라서 heading이 조금 틀리면 이후의 모든 translation이 잘못된 방향으로 적분된다. Wheel slip은 distance와 yaw를 모두 바꾸고, IMU bias는 시간에 따라 angle을 누적한다. 평균 pose만 적분하면 이 coupling이 숨고, covariance를 Jacobian으로 전파해야 어느 방향을 믿지 말아야 하는지가 드러난다.</p>
        <MathFormula display>{raw`\begin{aligned}\underbrace{p_{x,k+1}}_{\text{다음 x}}&=\underbrace{p_{x,k}+v_k\cos\theta_k\Delta t}_{\text{heading의 x 방향으로 적분}}\\[4pt]\underbrace{p_{y,k+1}}_{\text{다음 y}}&=\underbrace{p_{y,k}+v_k\sin\theta_k\Delta t}_{\text{heading의 y 방향으로 적분}}\\[4pt]\underbrace{\theta_{k+1}}_{\text{다음 heading}}&=\underbrace{\theta_k+\omega_k\Delta t}_{\text{angular rate 적분}}\end{aligned}`}</MathFormula>
        <MathFormula display>{raw`\begin{aligned}\underbrace{P_{k+1}^{-}}_{\text{예측 covariance}}&=\underbrace{F_kP_kF_k^T}_{\text{기존 uncertainty 전달}}\\[3pt]&\quad+\underbrace{G_kQ_kG_k^T}_{\text{slip·bias uncertainty 추가}}\end{aligned}`}</MathFormula>
        <FormulaNote meaning="F의 position-heading 항 때문에 yaw variance가 lateral position covariance로 회전해 들어간다. Q를 작게 둔다고 robot이 정확해지는 것이 아니라 estimator가 실제 slip을 인정하지 않아 innovation reject와 과신을 만들 수 있다." symbols={[[raw`x_k=[p_x,p_y,\theta]^T`, '시간 k의 planar robot pose'], [raw`v_k,\omega_k`, 'forward와 angular velocity'], [raw`F_k,G_k`, 'state와 noise에 대한 motion Jacobian'], [raw`Q_k`, 'wheel slip, gyro bias, unmodeled acceleration의 process covariance']]} />
        <DriftLab />
      </NlpSection>

      <NlpSection id="fusion" marker="04" tone="violet" question="Wheel, IMU, visual odometry를 모두 넣었는데 covariance가 작아지고 실제 오차는 더 커지는 일이 왜 생길까?" title="Fusion은 sensor 수가 아니라 독립된 information을 올바른 시각·frame·단위로 회계하는 일이다">
        <p>Filter는 motion model로 state를 predict하고, measurement가 예측한 값과 실제 measurement의 차이인 innovation을 계산한다. Innovation을 그 분산으로 whiten한 뒤 gate하고, 통과한 정보만 correction에 사용한다. 여기서 visual odometry가 wheel-fused pose를 초기값이나 입력으로 이미 사용했다면 wheel message와 완전히 독립인 두 번째 증거가 아니다.</p>
        <MathFormula display>{raw`\begin{aligned}\underbrace{e_k}_{\text{innovation}}&=\underbrace{z_k-h(\widehat x_k^-)}_{\text{실제 관측에서 예측 관측을 뺌}}\\[4pt]\underbrace{S_k}_{\text{innovation covariance}}&=\underbrace{H_kP_k^-H_k^T}_{\text{state 예측 uncertainty}}+\underbrace{R_k}_{\text{sensor uncertainty}}\\[4pt]\underbrace{d_k^2}_{\text{정규화한 surprise}}&=\underbrace{e_k^TS_k^{-1}e_k}_{\text{단위와 불확실성을 제거한 거리}}\end{aligned}`}</MathFormula>
        <FormulaNote meaning="Mahalanobis/NIS gate는 m와 rad, 잘 보이는 축과 약한 축을 같은 기준으로 비교한다. 하지만 S가 잘못 보고되거나 correlation을 생략하면 d²와 gate도 잘못된다. 지속적인 NIS 분포는 covariance calibration 진단에 사용한다." symbols={[[raw`z_k,h(\widehat x_k^-)`, '실제 measurement와 predicted measurement'], [raw`H_k`, 'measurement Jacobian'], [raw`P_k^-,R_k`, 'predicted-state와 sensor covariance'], [raw`d_k^2`, 'measurement dimension에 맞는 χ² gate와 비교할 통계량']]} />
        <MathFormula display>{raw`\begin{aligned}\underbrace{K_k}_{\text{correction 비율}}&=\underbrace{P_k^-H_k^TS_k^{-1}}_{\text{state와 observation uncertainty의 타협}}\\[4pt]\underbrace{\widehat x_k^+}_{\text{수정된 state}}&=\underbrace{\widehat x_k^-}_{\text{motion prediction}}+\underbrace{K_ke_k}_{\text{검증된 innovation correction}}\end{aligned}`}</MathFormula>
        <FormulaNote meaning="Kalman gain은 sensor를 무조건 평균내는 비율이 아니다. 어떤 state component가 measurement와 연결되는지와 두 uncertainty가 결정한다. Nonlinear model에서는 update 후 재선형화, angle wrapping, numerically stable covariance update가 필요하다." symbols={[[raw`K_k`, 'Kalman gain matrix'], [raw`\widehat x_k^-,\widehat x_k^+`, 'measurement 전 prediction과 후 correction'], [raw`e_k`, 'gate를 통과한 innovation'], [raw`S_k^{-1}`, 'innovation을 information 단위로 바꾸는 연산']]} />
        <FusionLineageLab />
      </NlpSection>

      <NlpSection id="frame-split" marker="05" tone="blue" question="Loop closure가 robot의 global 위치를 0.8 m 고쳤다면 controller pose도 즉시 0.8 m 뛰어야 할까?" title="`odom`은 연속성을, `map`은 global consistency를 맡는다">
        <p>한 transform에 두 요구를 동시에 걸 수 없다. Local controller는 millisecond-scale motion이 연속이어야 하지만, global localization은 과거 drift를 발견하면 현재와 과거 poses를 바꿔야 한다. ROS navigation convention은 이 충돌을 `map &rarr; odom &rarr; base_link`로 분리한다. Odometry system은 `odom &rarr; base_link`를 smooth하게 내고, SLAM/localization은 global correction을 `map &rarr; odom`에 반영한다.</p>
        <MathFormula display>{raw`\underbrace{T_{mb}(t)}_{\text{global body pose}}=\underbrace{T_{mo}(t)}_{\text{drift correction}}\underbrace{T_{ob}(t)}_{\text{continuous odometry}}`}</MathFormula>
        <MathFormula display>{raw`\begin{aligned}\underbrace{\Delta T_{ob}}_{\text{local pose step}}&\approx\underbrace{f(u,\Delta t)}_{\text{실제 motion 크기}}\\[4pt]\underbrace{T_{mo}^{+}\ne T_{mo}^{-}}_{\text{global correction jump}}&\quad\underbrace{\text{loop closure에서 허용}}_{\text{local odometry에는 넣지 않음}}\end{aligned}`}</MathFormula>
        <FormulaNote meaning="Global pose가 바뀌어도 local odometry increment는 물리 motion을 따라 연속이어야 한다. Frame split은 correction을 숨기는 것이 아니라 correction의 책임 범위를 분리한다. Global goals, maps와 plans는 새 map revision에 맞춰 갱신해야 한다." symbols={[[raw`T_{mb}`, 'map frame에서 body/base_link로 가는 transform'], [raw`T_{mo}`, 'map에서 odom으로 가는 global correction'], [raw`T_{ob}`, 'odom에서 body로 가는 locally continuous pose'], [raw`+,-`, 'global optimization 직후와 직전 revision']]} />
        <FrameSplitLab />
      </NlpSection>

      <NlpSection id="front-end" marker="06" tone="amber" question="Scan matching residual이 작고 대응점이 많으면 relative pose는 모든 방향에서 정확할까?" title="Front-end는 correspondence를 uncertain relative constraint로 바꿀 뿐 truth를 만들지 않는다">
        <p>Front-end는 candidate association을 찾고, source points를 relative transform으로 옮겼을 때 target geometry와 맞는지 residual을 최소화한다. 결과는 pose 하나가 아니라 estimate, covariance/information, overlap, residual diagnostics와 observability다. 평행한 aisle에서는 벽 normal 방향과 yaw는 잘 보이지만 aisle을 따라 미끄러져도 residual이 거의 변하지 않을 수 있다.</p>
        <MathFormula display>{raw`\begin{aligned}\underbrace{r_i(\xi)}_{\text{i번째 point-to-plane 오차}}&=\underbrace{n_i^T\!\left(T(\xi)p_i-q_i\right)}_{\text{변환한 점과 대응 surface의 normal 거리}}\\[5pt]\underbrace{\widehat\xi}_{\text{relative pose estimate}}&=\underbrace{\operatorname*{argmin}_{\xi}\sum_i w_i r_i(\xi)^2}_{\text{대응 residual의 weighted local minimum}}\\[5pt]\underbrace{\Lambda}_{\text{관측 information}}&\approx\underbrace{J^TWJ}_{\text{geometry가 pose 변화를 구속하는 정도}}\end{aligned}`}</MathFormula>
        <FormulaNote meaning="작은 eigenvalue의 eigenvector는 scan geometry가 거의 보지 못하는 motion 방향이다. 대응점 수나 평균 residual만으로 covariance를 작게 만들면 corridor degeneracy에서 pose가 과신된다. Local minimum은 correspondence가 실제 같은 장소라는 보장도 아니다." symbols={[[raw`p_i,q_i,n_i`, 'source point, target point와 target surface normal'], [raw`T(\xi)`, 'SE(2)/SE(3) relative-pose perturbation'], [raw`J,W`, 'residual Jacobian과 correspondence weights'], [raw`\Lambda`, 'relative-pose information/Hessian approximation']]} />
        <ObservabilityLab />
      </NlpSection>

      <NlpSection id="factor-graph" marker="07" tone="violet" question="마지막 scan을 첫 scan에 맞추면 왜 중간 poses까지 다시 움직여야 할까?" title="Back-end는 raw relations를 보존하고 모든 poses의 일관된 타협점을 푼다">
        <p>Incremental map baking은 새 scan을 당시 global model에 합친 뒤 원래 local frame을 버리기 쉽다. 나중에 loop inconsistency를 발견해도 어느 measurement가 어느 pose에서 왔는지 없으면 과거 geometry를 고칠 수 없다. Lu와 Milios의 핵심은 scan local frames와 odometry/scan-match relations를 보존하고, node poses를 free variables로 두어 모든 constraints를 동시에 만족시키는 것이다.</p>
        <MathFormula display>{raw`\begin{aligned}\underbrace{r_{ij}(X)}_{\text{factor residual}}&=\underbrace{\operatorname{Log}\!\left(z_{ij}^{-1}(X_i^{-1}X_j)\right)}_{\text{측정 relative pose와 graph 예측의 차이}}\\[5pt]\underbrace{X^*}_{\text{globally consistent poses}}&=\underbrace{\operatorname*{argmin}_{X}\sum_{(i,j)\in\mathcal E}r_{ij}^T\Omega_{ij}r_{ij}}_{\text{모든 relation의 whitened energy 최소화}}\\[5pt]\underbrace{X_0=I}_{\text{reference anchor}}&\Longrightarrow\underbrace{\text{global gauge 제거}}_{\text{상대 측정만으로 정할 수 없는 원점·방향 고정}}\end{aligned}`}</MathFormula>
        <FormulaNote meaning="한 pose를 고정하는 것은 robot이 그 absolute world pose를 정확히 측정했다는 뜻이 아니라 좌표 표현의 자유도를 제거하는 선택이다. Modern solver는 current estimate에서 residual을 linearize하고 sparse normal equations를 푼 뒤 manifold에 retract한다." symbols={[[raw`X_i,X_j`, 'graph의 두 pose variables'], [raw`z_{ij}`, 'odometry, scan matching 또는 loop closure가 준 relative pose'], [raw`\operatorname{Log}`, 'group difference를 tangent residual vector로 변환'], [raw`\mathcal E,\Omega_{ij}`, 'factor edge set과 각 relation information']]} />
        <PoseGraphLab />
        <QuestionLead question="Optimization cost가 낮으면 map이 맞다는 뜻인가?" answer="아니다. 주어진 factors와 noise model을 잘 만족한다는 뜻이다. 틀린 correspondence가 강한 factor로 들어가면 solver는 그 잘못된 graph를 매우 낮은 cost로 일관되게 만들 수 있다." />
      </NlpSection>

      <NlpSection id="loop-closure" marker="08" tone="amber" question="닮은 aisle을 같은 장소라고 한 edge 하나가 왜 수백 개의 정확한 odometry factors를 이길 수 있을까?" title="Loop closure는 measurement가 아니라 검증 전 high-impact hypothesis다">
        <p>Loop closure는 멀리 떨어진 graph nodes를 직접 연결해 오래 누적된 drift를 짧은 relation 하나로 관측한다. 그래서 true closure는 강력하지만 false closure도 같은 leverage를 가진다. Place recognition score는 proposal에만 쓰고, geometry, covariance, cycle consistency와 post-fit residual을 거쳐야 한다. Robust loss는 큰 residual의 influence를 줄이지만 threshold와 initialization이 나쁘면 false closure를 완전히 막지 못한다.</p>
        <MathFormula display>{raw`\underbrace{s_{ij}}_{\text{whitened residual}}=\underbrace{\sqrt{r_{ij}^T\Omega_{ij}r_{ij}}}_{\text{noise 단위로 정규화}}`}</MathFormula>
        <MathFormula display>{raw`\underbrace{\rho_H(s)}_{\text{Huber penalty}}=\begin{cases}\underbrace{\tfrac12s^2}_{\text{작은 residual}},&|s|\le k\\[3pt]\underbrace{k|s|-\tfrac12k^2}_{\text{큰 residual 제한}},&|s|>k\end{cases}`}</MathFormula>
        <FormulaNote meaning="Robust kernel은 residual을 whitening한 뒤 적용해야 k를 표준편차 단위로 해석할 수 있다. True closure도 초기 graph가 너무 멀면 큰 residual로 downweight될 수 있고, false closure가 스스로 graph를 당겨 residual을 줄이면 살아남을 수 있으므로 proposal 검증과 graph monitoring을 함께 쓴다." symbols={[[raw`s_{ij}`, 'covariance로 정규화한 scalar residual magnitude'], [raw`\rho_H`, 'Huber robust penalty'], ['k', 'quadratic에서 linear penalty로 바뀌는 whitened threshold'], [raw`\Omega_{ij}`, 'measurement information matrix']]} />
        <LoopRobustnessLab />
      </NlpSection>

      <NlpSection id="rebase-health" marker="09" tone="green" question="과거 trajectory가 바뀌었는데 occupancy와 object tracks만 옛 좌표에 남아 있으면 planner는 어느 세계를 보는가?" title="Global correction을 map·scene·goal·path에 하나의 revision으로 commit한다">
        <p>SLAM 결과를 point cloud 하나로 계속 구워버리면 과거 pose가 바뀔 때 각 point의 출처를 되찾기 어렵다. Raw scans, keyframes 또는 submaps를 local coordinates와 source pose ID로 보존하면 optimized poses로 다시 배치할 수 있다. 같은 correction은 occupancy, semantic tracks, map-frame goals, global path와 PlanningScene에 원자적으로 적용한다. Local controller의 odom state는 계속 연속이어야 한다.</p>
        <RebaseLab />
        <MathFormula display>{raw`\begin{aligned}\underbrace{C_t}_{\text{freshness}}&:\ \underbrace{t_{now}-t_{estimate}\le\Delta t_{max}}_{\text{허용 age 안}}\\[3pt]\underbrace{C_u}_{\text{uncertainty}}&:\ \underbrace{\lambda_{max}(P_{pose})\le\lambda_{max}^{safe}}_{\text{약한 pose 축도 한계 안}}\\[3pt]\underbrace{C_i}_{\text{innovation}}&:\ \underbrace{d_k^2\le\gamma}_{\text{prediction과 관측 일관}}\end{aligned}`}</MathFormula>
        <MathFormula display>{raw`\begin{aligned}\underbrace{C_r}_{\text{revision}}&:\ \underbrace{v_{map}=v_{scene}=v_{plan}}_{\text{global revision 일치}}\\[4pt]\underbrace{C_h}_{\text{health aggregate}}&=\underbrace{C_t\land C_u\land C_i\land C_{obs}}_{\text{시간·불확실성·관측 검사}}\\[4pt]\underbrace{\operatorname{execute}}_{\text{경로 실행}}&\Longrightarrow\underbrace{C_h\land C_r}_{\text{health와 revision 모두 통과}}\end{aligned}`}</MathFormula>
        <FormulaNote meaning="Localization health는 pose covariance 하나가 아니라 freshness, innovations, observability, loop state와 downstream revision agreement의 conjunction이다. Gate가 실패하면 원인과 braking margin에 따라 속도 제한, local-only mode, relocalization 또는 stop으로 degrade한다." symbols={[[raw`P_{pose}`, '현재 pose marginal covariance'], [raw`d_k^2,\gamma`, 'normalized innovation과 dimension별 gate'], [raw`v_{map},v_{scene},v_{plan}`, 'map, planning scene와 path revision'], [raw`C_{obs}`, 'minimum information eigenvalue, inlier support와 unresolved loop hypotheses를 포함한 상태']]} />
        <div className="not-prose my-6 flex items-start gap-3 border-y border-border bg-muted/15 px-4 py-4 text-sm leading-relaxed">
          <CircleAlert className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" />
          <p><strong>운영 규칙.</strong> `localized=true` 같은 boolean 하나로 실행을 허용하지 않는다. Health ledger에 timestamp, covariance axes, NIS window, degeneracy, last accepted closure와 global revision을 남기고 threshold를 넘은 이유에 맞는 fallback을 선택한다.</p>
        </div>
      </NlpSection>

      <section className="my-12 border-y border-border py-8">
        <div className="mb-5 flex items-center gap-3"><RefreshCw className="h-5 w-5 text-blue-700" /><h2 className="m-0 text-xl font-black">이 글로 도달해야 하는 구현 판단</h2></div>
        <CapabilityCheck items={[
          'Odometry·localization·mapping·SLAM의 known, unknown, output과 gauge를 구분한다.',
          'Sensor acquisition interval, clock offset, extrinsic과 motion interpolation으로 deskew 필요성을 판단한다.',
          'Unicycle prediction과 Jacobian covariance propagation으로 heading bias가 lateral drift가 되는 과정을 설명한다.',
          'Innovation, covariance, NIS gate와 source lineage로 bad measurement와 double counting을 진단한다.',
          '`map -> odom -> base_link`에서 global correction과 local continuity를 분리한다.',
          'Scan residual, information eigenvalues와 geometry로 corridor degeneracy를 판정한다.',
          'Prior·odometry·scan·loop factors와 gauge anchor로 pose graph objective를 구성한다.',
          'True/false loop closure를 proposal, geometry, robust weighting과 post-fit monitoring으로 다룬다.',
          'Loop correction 뒤 map·tracks·goal·path·PlanningScene을 atomic revision으로 rebase하고 health gate를 적용한다.',
        ]} />
      </section>

      <div className="not-prose my-8 grid gap-3 sm:grid-cols-3">
        {[
          { icon: ScanLine, label: '다음 원 논문', value: 'Lu & Milios 1997', note: 'pose relation network가 global consistency를 만드는 과정을 수식과 증거로 복원' },
          { icon: MapPinned, label: '입력으로 연결', value: 'Camera · Perception', note: 'time-aligned observation과 source provenance를 상대-pose·map evidence로 사용' },
          { icon: Route, label: '출력으로 연결', value: 'Scene · Planning', note: 'versioned map correction과 localization health를 planner acceptance contract로 전달' },
        ].map(({ icon: Icon, label, value, note }) => <div key={label} className="rounded-md border border-border p-4"><Icon className="h-5 w-5 text-blue-700" /><p className="mt-4 text-[10px] font-black text-muted-foreground">{label}</p><p className="mt-2 text-sm font-black">{value}</p><p className="mt-2 text-xs leading-relaxed text-muted-foreground">{note}</p></div>)}
      </div>

      <LearningHandoff
        description="SLAM의 산출물은 pose 하나가 아니라 locally smooth odometry, globally corrected map, covariance와 health 상태다. 이 네 값을 소비하는 경계로만 이동한다."
        items={[
          { label: '막히면', slug: 'rl-pomdp-state-estimation', title: 'POMDP·Belief·State Estimation', reason: 'Observation과 latent state, predict·correct와 covariance consistency를 먼저 분리한다.' },
          { label: '이어 읽기', slug: 'robot-perception-scene-construction', title: 'Robot Perception & Scene Construction', reason: 'Map correction과 localization health를 track·occupancy·scene revision에 원자적으로 반영한다.' },
          { label: '적용하기', slug: 'robot-ros2-runtime-communication', title: 'ROS 2 Runtime & Communication', reason: 'Sensor acquisition time, TF lookup, QoS queue와 restart epoch가 state estimate를 오염시키는 경계를 검증한다.' },
        ]}
      />

      <SourceNotes sources={[
        { label: 'Cadena et al. · Past, Present, and Future of SLAM (TRO 2016)', href: 'https://arxiv.org/abs/1606.05830', note: 'SLAM 정의, front-end/back-end 구조, robustness와 scalability 쟁점을 정리한 원 survey/position paper.' },
        { label: 'Smith, Self & Cheeseman · Estimating Uncertain Spatial Relationships (1990)', href: 'https://robotics.usc.edu/~maja/teaching/cs584/papers/smith90stochastic.pdf', note: 'Spatial relationship의 covariance와 correlation을 보존·전파하는 기초 논문.' },
        { label: 'Lu & Milios · Globally Consistent Range Scan Alignment (1997)', href: 'https://doi.org/10.1023/A:1008854305733', note: 'Local scan frames와 uncertain pose relations를 보존하고 모든 poses를 동시에 최적화하는 원 논문.' },
        { label: 'Nav2 · Navigation Concepts', href: 'https://docs.nav2.org/concepts/index.html', note: '`map -> odom`과 `odom -> base_link`, globally accurate correction과 locally smooth odometry 역할을 확인하는 현재 공식 문서.' },
        { label: 'GTSAM · Factor Graphs and GTSAM', href: 'https://gtsam.org/tutorials/intro.html', note: 'PoseSLAM variables, odometry와 loop factors, batch·filtering·fixed-lag 관점을 연결하는 공식 tutorial.' },
        { label: 'GTSAM · Robust noise models', href: 'https://gtsam.org/doxygen/a04491.html', note: 'Residual whitening 뒤 robust M-estimator weight를 적용하는 현재 공식 API 의미.' },
      ]} />
      <p className="mt-5 text-xs leading-relaxed text-muted-foreground"><Activity className="mr-1 inline h-3.5 w-3.5" />Viz의 수치는 causal trade-off를 드러내기 위한 교육용이다. 실제 acceptance thresholds는 sensor rate, environment geometry, stopping distance, estimator delay와 covariance calibration dataset으로 정해야 한다.</p>
    </>
  );
}
