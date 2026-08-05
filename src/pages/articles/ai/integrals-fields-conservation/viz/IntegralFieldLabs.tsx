import { useId, useMemo, useState } from 'react';
import { ArrowRight, Box, Gauge, Grid3X3, MoveRight, Sigma } from 'lucide-react';

type SegmentOption<T extends string> = {
  value: T;
  label: string;
};

function formatNumber(value: number, digits = 3) {
  const rounded = Number(value.toFixed(digits));
  return Object.is(rounded, -0) ? '0' : String(rounded);
}

function markerId(prefix: string, reactId: string) {
  return `${prefix}-${reactId.replace(/:/g, '')}`;
}

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
      className="grid min-w-0 gap-1 rounded-md border border-border bg-background p-1"
      style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          aria-pressed={value === option.value}
          onClick={() => onChange(option.value)}
          className={`min-h-11 rounded px-2 py-2 text-xs font-semibold leading-snug transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:px-3 ${
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

function RangeControl({
  id,
  label,
  value,
  valueLabel,
  min,
  max,
  step,
  accentClass,
  onChange,
}: {
  id: string;
  label: string;
  value: number;
  valueLabel: string;
  min: number;
  max: number;
  step: number;
  accentClass: string;
  onChange: (value: number) => void;
}) {
  return (
    <label htmlFor={id} className="block min-w-0 text-xs font-semibold text-muted-foreground">
      <span className="flex items-center justify-between gap-3">
        <span>{label}</span>
        <strong className="font-mono text-foreground">{valueLabel}</strong>
      </span>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className={`mt-2 block min-h-11 w-full ${accentClass}`}
      />
    </label>
  );
}

function MetricStrip({
  items,
}: {
  items: Array<{ label: string; value: string; note?: string; accent?: string }>;
}) {
  return (
    <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border">
      {items.map((item) => (
        <div key={item.label} className="min-w-0 bg-background p-3">
          <dt className="text-xs font-semibold leading-relaxed text-muted-foreground">{item.label}</dt>
          <dd className={`mt-1 break-words font-mono text-base font-bold ${item.accent ?? ''}`}>
            {item.value}
          </dd>
          {item.note && <dd className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.note}</dd>}
        </div>
      ))}
    </dl>
  );
}

type DensityProfile = 'uniform' | 'ramp' | 'piecewise';

export function PartitionRefinementLab() {
  const [partitions, setPartitions] = useState(4);
  const [profile, setProfile] = useState<DensityProfile>('ramp');
  const domainLength = 3;
  const density = (x: number) => {
    if (profile === 'uniform') return 2;
    if (profile === 'piecewise') return x < 1.2 ? 1.2 : 2.8;
    return 1 + 0.5 * x;
  };
  const exact = profile === 'uniform'
    ? 6
    : profile === 'piecewise'
      ? 1.2 * 1.2 + 2.8 * 1.8
      : 3 + 0.25 * 9;
  const width = domainLength / partitions;
  const cells = Array.from({ length: partitions }, (_, index) => {
    const left = index * width;
    const sample = density(left);
    return { left, width, sample, contribution: sample * width };
  });
  const approximate = cells.reduce((sum, cell) => sum + cell.contribution, 0);
  const error = Math.abs(exact - approximate);
  const plot = { left: 38, right: 432, top: 24, bottom: 232 };
  const xPx = (x: number) => plot.left + (x / domainLength) * (plot.right - plot.left);
  const yPx = (y: number) => plot.bottom - (y / 3.2) * (plot.bottom - plot.top);
  const curve = Array.from({ length: 121 }, (_, index) => {
    const x = (index / 120) * domainLength;
    return `${xPx(x)},${yPx(density(x))}`;
  }).join(' ');

  return (
    <figure
      data-partition-refinement-lab
      data-partitions={partitions}
      data-profile={profile}
      data-approximate={formatNumber(approximate, 6)}
      data-exact={formatNumber(exact, 6)}
      data-error={formatNumber(error, 6)}
      className="foundation-viz-explorer not-prose my-8 scroll-mt-24 overflow-hidden rounded-md border border-border"
    >
      <figcaption className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-4 py-4 sm:pl-6 sm:pr-28">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Partition refinement lab</p>
          <p className="mt-1 text-base font-bold">작은 조각마다 density와 길이를 곱한 뒤 더한다</p>
        </div>
        <span className="text-xs font-semibold text-cyan-700 dark:text-cyan-300">
          오차 {formatNumber(error, 4)}
        </span>
      </figcaption>

      <div className="grid min-w-0 gap-4 border-b border-border bg-cyan-500/[0.035] p-4 sm:grid-cols-2 sm:p-5">
        <Segmented
          label="밀도 모양"
          options={[
            { value: 'uniform', label: '일정한 밀도' },
            { value: 'ramp', label: '오른쪽으로 증가' },
            { value: 'piecewise', label: '구간별 밀도' },
          ]}
          value={profile}
          onChange={setProfile}
        />
        <RangeControl
          id="integrals-partitions"
          label="조각 수 N"
          value={partitions}
          valueLabel={`${partitions}개`}
          min={2}
          max={12}
          step={1}
          accentClass="accent-cyan-700"
          onChange={setPartitions}
        />
      </div>

      <div className="grid min-w-0 gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(15rem,0.85fr)] lg:items-center">
        <svg viewBox="0 0 470 260" className="h-auto w-full" role="img" aria-label={`${partitions}개 조각으로 근사한 밀도 적분`}>
          {[0, 1, 2, 3].map((value) => (
            <line key={value} x1={plot.left} x2={plot.right} y1={yPx(value)} y2={yPx(value)} stroke="var(--border)" strokeOpacity="0.65" />
          ))}
          {cells.map((cell, index) => (
            <rect
              key={`${index}-${partitions}`}
              x={xPx(cell.left)}
              y={yPx(cell.sample)}
              width={Math.max(1, xPx(cell.left + cell.width) - xPx(cell.left))}
              height={plot.bottom - yPx(cell.sample)}
              fill="#0891b2"
              fillOpacity={0.1 + (index % 2) * 0.045}
              stroke="#0891b2"
              strokeOpacity="0.42"
              className="transition-all duration-300 motion-reduce:transition-none"
            />
          ))}
          <polyline points={curve} fill="none" stroke="#0e7490" strokeWidth="2.75" strokeLinecap="round" strokeLinejoin="round" />
          <line x1={plot.left} x2={plot.right} y1={plot.bottom} y2={plot.bottom} stroke="var(--foreground)" strokeOpacity="0.55" />
          <text x={plot.left} y="252" fontSize="11" fill="var(--muted-foreground)">0 m</text>
          <text x={plot.right} y="252" textAnchor="end" fontSize="11" fill="var(--muted-foreground)">3 m</text>
          <text x={plot.left + 6} y={plot.top + 10} fontSize="11" fontWeight="700" fill="#0e7490">density ρ(x)</text>
        </svg>
        <MetricStrip items={[
          { label: '조각 폭 Δx', value: `${formatNumber(width, 3)} m` },
          { label: '첫 조각 기여', value: `${formatNumber(cells[0].contribution, 3)} kg`, note: 'ρ(x₀) × Δx' },
          { label: 'Riemann 합', value: `${formatNumber(approximate, 4)} kg`, accent: 'text-cyan-700 dark:text-cyan-300' },
          { label: '연속 적분', value: `${formatNumber(exact, 4)} kg` },
        ]} />
      </div>
      <p className="border-t border-border px-4 py-3 text-xs leading-relaxed text-muted-foreground sm:px-6">
        각 사각형의 높이만 더하면 단위가 kg/m에 머문다. 높이에 조각 폭을 곱해야 kg이 되고, 조각을 나눌수록 왼쪽 표본이 놓친 영역이 줄어든다.
      </p>
    </figure>
  );
}

type LoadProfile = 'uniform' | 'triangular' | 'trapezoid';
type EquivalenceMode = 'force-moment' | 'force-only';

type DomainKind = 'line' | 'surface' | 'volume';
type FieldShape = 'scalar' | 'vector';

export function DomainMeasureLab() {
  const [domain, setDomain] = useState<DomainKind>('surface');
  const [fieldShape, setFieldShape] = useState<FieldShape>('scalar');
  const contract = {
    line: { measure: 3, symbol: 'ds', measureUnit: 'm', densityUnit: 'kg/m', label: '선 길이' },
    surface: { measure: 6, symbol: 'dA', measureUnit: 'm²', densityUnit: 'kg/m²', label: '면적' },
    volume: { measure: 12, symbol: 'dV', measureUnit: 'm³', densityUnit: 'kg/m³', label: '부피' },
  }[domain];
  const scalarDensity = 2;
  const scalarTotal = scalarDensity * contract.measure;
  const vectorDensity = [2, 1];
  const vectorTotal = vectorDensity.map((value) => value * contract.measure);
  const totalLabel = fieldShape === 'scalar'
    ? `${formatNumber(scalarTotal, 1)} kg`
    : `[${vectorTotal.map((value) => formatNumber(value, 1)).join(', ')}] kg`;

  return (
    <figure
      data-domain-measure-lab
      data-domain={domain}
      data-field-shape={fieldShape}
      data-measure={formatNumber(contract.measure, 6)}
      data-total={fieldShape === 'scalar'
        ? formatNumber(scalarTotal, 6)
        : vectorTotal.map((value) => formatNumber(value, 6)).join(',')}
      className="foundation-viz-explorer not-prose my-8 scroll-mt-24 overflow-hidden rounded-md border border-border"
    >
      <figcaption className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-4 py-4 sm:pl-6 sm:pr-28">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Domain and measure lab</p>
          <p className="mt-1 text-base font-bold">어디에 분포했는지가 미소 조각과 density 단위를 정한다</p>
        </div>
        <span className="text-xs font-semibold text-violet-700 dark:text-violet-300">
          결과 shape {fieldShape === 'scalar' ? 'scalar' : 'vector'}
        </span>
      </figcaption>

      <div className="grid min-w-0 gap-4 border-b border-border bg-violet-500/[0.035] p-4 sm:grid-cols-2 sm:p-5">
        <Segmented
          label="적분 domain"
          options={[
            { value: 'line', label: '선 · ds' },
            { value: 'surface', label: '면 · dA' },
            { value: 'volume', label: '부피 · dV' },
          ]}
          value={domain}
          onChange={setDomain}
        />
        <Segmented
          label="Field 출력"
          options={[
            { value: 'scalar', label: 'Scalar field' },
            { value: 'vector', label: 'Vector field' },
          ]}
          value={fieldShape}
          onChange={setFieldShape}
        />
      </div>

      <div className="grid min-w-0 gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(15rem,0.95fr)] lg:items-center">
        <svg viewBox="0 0 440 270" className="h-auto w-full" role="img" aria-label={`${domain} domain의 ${fieldShape} field 적분`}>
          {domain === 'line' && (
            <g>
              <line x1="70" x2="370" y1="142" y2="142" stroke="#7c3aed" strokeWidth="8" strokeLinecap="round" />
              {Array.from({ length: 7 }, (_, index) => (
                <circle key={index} cx={70 + index * 50} cy="142" r="5" fill="var(--background)" stroke="#7c3aed" strokeWidth="2" />
              ))}
              <text x="220" y="102" textAnchor="middle" fontSize="12" fontWeight="700" fill="#6d28d9">길이 3 m</text>
              <text x="220" y="176" textAnchor="middle" fontSize="11" fill="var(--muted-foreground)">작은 선분 ds</text>
            </g>
          )}
          {domain === 'surface' && (
            <g>
              <rect x="105" y="68" width="230" height="140" rx="4" fill="#7c3aed" fillOpacity="0.1" stroke="#7c3aed" strokeWidth="2.5" />
              {[1, 2].map((index) => <line key={`v-${index}`} x1={105 + index * (230 / 3)} x2={105 + index * (230 / 3)} y1="68" y2="208" stroke="#7c3aed" strokeOpacity="0.28" />)}
              {[1, 2].map((index) => <line key={`h-${index}`} x1="105" x2="335" y1={68 + index * (140 / 3)} y2={68 + index * (140 / 3)} stroke="#7c3aed" strokeOpacity="0.28" />)}
              <text x="220" y="48" textAnchor="middle" fontSize="12" fontWeight="700" fill="#6d28d9">면적 6 m²</text>
              <text x="220" y="235" textAnchor="middle" fontSize="11" fill="var(--muted-foreground)">작은 면 조각 dA</text>
            </g>
          )}
          {domain === 'volume' && (
            <g>
              <path d="M 118 92 L 300 92 L 342 62 L 160 62 Z" fill="#7c3aed" fillOpacity="0.06" stroke="#7c3aed" strokeWidth="2" />
              <path d="M 300 92 L 342 62 L 342 190 L 300 220 Z" fill="#7c3aed" fillOpacity="0.13" stroke="#7c3aed" strokeWidth="2" />
              <rect x="118" y="92" width="182" height="128" fill="#7c3aed" fillOpacity="0.09" stroke="#7c3aed" strokeWidth="2" />
              <line x1="118" x2="160" y1="92" y2="62" stroke="#7c3aed" strokeWidth="2" />
              <line x1="118" x2="160" y1="220" y2="190" stroke="#7c3aed" strokeWidth="2" />
              <line x1="160" x2="342" y1="190" y2="190" stroke="#7c3aed" strokeOpacity="0.35" />
              <text x="220" y="42" textAnchor="middle" fontSize="12" fontWeight="700" fill="#6d28d9">부피 12 m³</text>
              <text x="220" y="248" textAnchor="middle" fontSize="11" fill="var(--muted-foreground)">작은 부피 조각 dV</text>
            </g>
          )}
          {fieldShape === 'vector' && (
            <g stroke="#0e7490" strokeWidth="2" strokeLinecap="round">
              {[[170, 120], [220, 146], [270, 112]].map(([x, y], index) => (
                <g key={index}>
                  <line x1={x} y1={y} x2={x + 28} y2={y - 18} />
                  <path d={`M ${x + 28} ${y - 18} l -10 1 l 5 8`} fill="none" />
                </g>
              ))}
            </g>
          )}
        </svg>
        <MetricStrip items={[
          { label: '선택한 measure', value: contract.symbol, accent: 'text-violet-700 dark:text-violet-300' },
          { label: contract.label, value: `${formatNumber(contract.measure, 1)} ${contract.measureUnit}` },
          { label: 'Density 단위', value: contract.densityUnit, note: fieldShape === 'scalar' ? '값 2' : '값 [2, 1]' },
          { label: '적분 결과', value: totalLabel, note: `${contract.densityUnit} × ${contract.measureUnit}` },
        ]} />
      </div>
      <p className="border-t border-border px-4 py-3 text-xs leading-relaxed text-muted-foreground sm:px-6">
        같은 숫자 2라도 kg/m, kg/m², kg/m³는 서로 다른 density다. Domain의 measure를 곱하면 모두 kg으로 돌아오며, vector field는 component를 잃지 않고 vector total로 남는다.
      </p>
    </figure>
  );
}

export function ResultantLineOfActionLab() {
  const reactId = useId();
  const loadArrowId = markerId('load-arrow', reactId);
  const resultantArrowId = markerId('resultant-arrow', reactId);
  const [profile, setProfile] = useState<LoadProfile>('triangular');
  const [mode, setMode] = useState<EquivalenceMode>('force-moment');
  const [peak, setPeak] = useState(6);
  const [span, setSpan] = useState(3);
  const startRatio = profile === 'uniform' ? 1 : profile === 'trapezoid' ? 0.35 : 0;
  const resultant = peak * span * (startRatio + 1) / 2;
  const moment = peak * span * span * (startRatio / 2 + (1 - startRatio) / 3);
  const trueLine = resultant === 0 ? span / 2 : moment / resultant;
  const shownLine = mode === 'force-moment' ? trueLine : span / 4;
  const momentResidual = resultant * shownLine - moment;
  const xPx = (x: number) => 48 + (x / span) * 362;
  const beamY = 184;
  const samples = Array.from({ length: 9 }, (_, index) => {
    const ratio = index / 8;
    const local = peak * (startRatio + (1 - startRatio) * ratio);
    return { ratio, local };
  });
  const areaPath = `M ${xPx(0)} ${beamY - startRatio * 94} L ${xPx(span)} ${beamY - 94} L ${xPx(span)} ${beamY} L ${xPx(0)} ${beamY} Z`;

  return (
    <figure
      data-resultant-line-lab
      data-load-profile={profile}
      data-equivalence-mode={mode}
      data-resultant={formatNumber(resultant, 6)}
      data-moment={formatNumber(moment, 6)}
      data-line-of-action={formatNumber(shownLine, 6)}
      data-moment-residual={formatNumber(momentResidual, 6)}
      className="foundation-viz-explorer not-prose my-8 scroll-mt-24 overflow-hidden rounded-md border border-border"
    >
      <figcaption className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-4 py-4 sm:pl-6 sm:pr-28">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Resultant and moment lab</p>
          <p className="mt-1 text-base font-bold">분포하중을 같은 힘과 같은 모멘트의 화살표로 바꾼다</p>
        </div>
        <span className={`text-xs font-semibold ${Math.abs(momentResidual) < 1e-8 ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}`}>
          moment residual {formatNumber(momentResidual, 2)} kN·m
        </span>
      </figcaption>

      <div className="grid min-w-0 gap-4 border-b border-border bg-amber-500/[0.035] p-4 sm:grid-cols-2 sm:p-5">
        <Segmented
          label="분포하중 모양"
          options={[
            { value: 'uniform', label: '균일' },
            { value: 'triangular', label: '삼각형' },
            { value: 'trapezoid', label: '사다리꼴' },
          ]}
          value={profile}
          onChange={setProfile}
        />
        <Segmented
          label="등가 조건"
          options={[
            { value: 'force-moment', label: '힘 + 모멘트 일치' },
            { value: 'force-only', label: '힘만 일치' },
          ]}
          value={mode}
          onChange={setMode}
        />
        <RangeControl id="integrals-resultant-peak" label="최대 하중" value={peak} valueLabel={`${formatNumber(peak, 1)} kN/m`} min={2} max={10} step={0.5} accentClass="accent-amber-600" onChange={setPeak} />
        <RangeControl id="integrals-resultant-span" label="보 길이" value={span} valueLabel={`${formatNumber(span, 1)} m`} min={2} max={5} step={0.25} accentClass="accent-cyan-700" onChange={setSpan} />
      </div>

      <div className="grid min-w-0 gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(15rem,0.8fr)] lg:items-center">
        <svg viewBox="0 0 460 255" className="h-auto w-full" role="img" aria-label={`${profile} 분포하중과 등가 합력의 작용선`}>
          <defs>
            <marker id={loadArrowId} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 Z" fill="#d97706" />
            </marker>
            <marker id={resultantArrowId} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 Z" fill="#0e7490" />
            </marker>
          </defs>
          <path d={areaPath} fill="#f59e0b" fillOpacity="0.1" stroke="#d97706" strokeWidth="1.5" strokeLinejoin="round" />
          {samples.map(({ ratio, local }) => {
            const x = xPx(ratio * span);
            const top = beamY - (local / peak) * 94;
            return <line key={ratio} x1={x} x2={x} y1={top} y2={beamY - 4} stroke="#d97706" strokeWidth="1.5" markerEnd={`url(#${loadArrowId})`} />;
          })}
          <line x1={xPx(0)} x2={xPx(span)} y1={beamY} y2={beamY} stroke="var(--foreground)" strokeWidth="5" strokeLinecap="round" />
          <line x1={xPx(shownLine)} x2={xPx(shownLine)} y1={54} y2={beamY - 6} stroke="#0e7490" strokeWidth="3" markerEnd={`url(#${resultantArrowId})`} />
          <circle cx={xPx(shownLine)} cy={beamY} r="5" fill="var(--background)" stroke="#0e7490" strokeWidth="2.5" />
          <text x={xPx(0)} y="218" fontSize="11" fill="var(--muted-foreground)">O</text>
          <text x={xPx(span)} y="218" textAnchor="end" fontSize="11" fill="var(--muted-foreground)">{formatNumber(span, 2)} m</text>
          <rect x={Math.max(60, Math.min(330, xPx(shownLine) - 48))} y="25" width="96" height="24" rx="4" fill="var(--background)" stroke="#0e7490" strokeOpacity="0.35" />
          <text x={Math.max(108, Math.min(378, xPx(shownLine)))} y="41" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0e7490">등가 합력 {formatNumber(resultant, 1)} kN</text>
        </svg>
        <MetricStrip items={[
          { label: '합력 R', value: `${formatNumber(resultant, 2)} kN`, accent: 'text-amber-700 dark:text-amber-300' },
          { label: 'O점 모멘트', value: `${formatNumber(moment, 2)} kN·m` },
          { label: '실제 작용선', value: `${formatNumber(trueLine, 3)} m` },
          { label: '표시한 작용선', value: `${formatNumber(shownLine, 3)} m`, accent: Math.abs(momentResidual) < 1e-8 ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300' },
        ]} />
      </div>
      <p className="border-t border-border px-4 py-3 text-xs leading-relaxed text-muted-foreground sm:px-6">
        힘만 일치시키면 어느 위치에 두어도 같은 것처럼 보인다. 하지만 기준점 O에 대한 모멘트까지 맞춰야 원래 분포와 같은 회전 효과를 낸다.
      </p>
    </figure>
  );
}

type NormalOrientation = 'outward' | 'inward';

export function FluxOrientationLab() {
  const reactId = useId();
  const fieldArrow = markerId('field-arrow', reactId);
  const normalArrow = markerId('normal-arrow', reactId);
  const [fieldAngle, setFieldAngle] = useState(20);
  const [surfaceAngle, setSurfaceAngle] = useState(-20);
  const [orientation, setOrientation] = useState<NormalOrientation>('outward');
  const magnitude = 4;
  const surfaceLength = 2;
  const toRadians = (degrees: number) => degrees * Math.PI / 180;
  const tangent = { x: Math.cos(toRadians(surfaceAngle)), y: Math.sin(toRadians(surfaceAngle)) };
  const outwardDegrees = surfaceAngle - 90;
  const normalDegrees = outwardDegrees + (orientation === 'inward' ? 180 : 0);
  const normal = { x: Math.cos(toRadians(normalDegrees)), y: Math.sin(toRadians(normalDegrees)) };
  const field = { x: magnitude * Math.cos(toRadians(fieldAngle)), y: magnitude * Math.sin(toRadians(fieldAngle)) };
  const fluxDensity = field.x * normal.x + field.y * normal.y;
  const totalFlux = fluxDensity * surfaceLength;
  const tangentComponent = field.x * tangent.x + field.y * tangent.y;
  const center = { x: 230, y: 145 };
  const screen = (vector: { x: number; y: number }, scale: number) => ({
    x: center.x + vector.x * scale,
    y: center.y - vector.y * scale,
  });
  const surfaceA = screen({ x: -tangent.x, y: -tangent.y }, 100);
  const surfaceB = screen(tangent, 100);
  const fieldEnd = screen(field, 29);
  const normalEnd = screen(normal, 82);
  const normalProjectionEnd = screen({ x: normal.x * fluxDensity, y: normal.y * fluxDensity }, 29);

  return (
    <figure
      data-flux-orientation-lab
      data-orientation={orientation}
      data-field-angle={fieldAngle}
      data-surface-angle={surfaceAngle}
      data-flux-density={formatNumber(fluxDensity, 6)}
      data-total-flux={formatNumber(totalFlux, 6)}
      className="foundation-viz-explorer not-prose my-8 scroll-mt-24 overflow-hidden rounded-md border border-border"
    >
      <figcaption className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-4 py-4 sm:pl-6 sm:pr-28">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Flux orientation lab</p>
          <p className="mt-1 text-base font-bold">경계를 뚫는 법선 성분만 signed flux로 센다</p>
        </div>
        <span className={`text-xs font-semibold ${totalFlux >= 0 ? 'text-blue-700 dark:text-blue-300' : 'text-rose-700 dark:text-rose-300'}`}>
          Φ {formatNumber(totalFlux, 2)}
        </span>
      </figcaption>

      <div className="grid min-w-0 gap-4 border-b border-border bg-blue-500/[0.035] p-4 sm:grid-cols-2 sm:p-5">
        <Segmented
          label="법선 방향"
          options={[
            { value: 'outward', label: '바깥 법선' },
            { value: 'inward', label: '안쪽 법선' },
          ]}
          value={orientation}
          onChange={setOrientation}
        />
        <RangeControl id="integrals-flux-angle" label="Field 방향" value={fieldAngle} valueLabel={`${fieldAngle}°`} min={-180} max={180} step={5} accentClass="accent-blue-700" onChange={setFieldAngle} />
        <div className="sm:col-span-2">
          <RangeControl id="integrals-surface-angle" label="경계 기울기" value={surfaceAngle} valueLabel={`${surfaceAngle}°`} min={-70} max={70} step={5} accentClass="accent-amber-600" onChange={setSurfaceAngle} />
        </div>
      </div>

      <div className="grid min-w-0 gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(15rem,0.9fr)] lg:items-center">
        <svg viewBox="0 0 460 285" className="h-auto w-full" role="img" aria-label={`벡터장과 ${orientation === 'outward' ? '바깥' : '안쪽'} 법선의 투영`}>
          <defs>
            <marker id={fieldArrow} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 Z" fill="#2563eb" />
            </marker>
            <marker id={normalArrow} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 Z" fill="#d97706" />
            </marker>
          </defs>
          <line x1={surfaceA.x} y1={surfaceA.y} x2={surfaceB.x} y2={surfaceB.y} stroke="var(--foreground)" strokeWidth="8" strokeLinecap="round" opacity="0.78" />
          <line x1={center.x} y1={center.y} x2={fieldEnd.x} y2={fieldEnd.y} stroke="#2563eb" strokeWidth="3" markerEnd={`url(#${fieldArrow})`} />
          <line x1={center.x} y1={center.y} x2={normalEnd.x} y2={normalEnd.y} stroke="#d97706" strokeWidth="2.5" markerEnd={`url(#${normalArrow})`} />
          <line x1={fieldEnd.x} y1={fieldEnd.y} x2={normalProjectionEnd.x} y2={normalProjectionEnd.y} stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="5 5" />
          <line x1={center.x} y1={center.y} x2={normalProjectionEnd.x} y2={normalProjectionEnd.y} stroke="#0e7490" strokeWidth="4" strokeLinecap="round" />
          <circle cx={center.x} cy={center.y} r="5" fill="var(--background)" stroke="var(--foreground)" strokeWidth="2" />
          <rect x="18" y="20" width="98" height="24" rx="4" fill="var(--background)" stroke="#2563eb" strokeOpacity="0.35" />
          <text x="67" y="36" textAnchor="middle" fontSize="11" fontWeight="700" fill="#1d4ed8">Field F · 파랑</text>
          <rect x="344" y="20" width="98" height="24" rx="4" fill="var(--background)" stroke="#d97706" strokeOpacity="0.35" />
          <text x="393" y="36" textAnchor="middle" fontSize="11" fontWeight="700" fill="#b45309">법선 n · 주황</text>
        </svg>
        <MetricStrip items={[
          { label: 'Field 크기', value: formatNumber(magnitude, 1) },
          { label: '접선 성분', value: formatNumber(tangentComponent, 3), note: '경계를 따라 흐름' },
          { label: '법선 성분 F·n', value: formatNumber(fluxDensity, 3), accent: totalFlux >= 0 ? 'text-blue-700 dark:text-blue-300' : 'text-rose-700 dark:text-rose-300' },
          { label: '총 flux', value: formatNumber(totalFlux, 3), note: '(F·n) × 경계 길이' },
        ]} />
      </div>
      <p className="border-t border-border px-4 py-3 text-xs leading-relaxed text-muted-foreground sm:px-6">
        Field를 경계와 나란히 놓으면 통과량은 0에 가까워진다. 같은 경계에서 법선만 뒤집으면 geometry는 그대로이고 signed flux만 정확히 반전한다.
      </p>
    </figure>
  );
}

type CancellationMode = 'opposite' | 'same';

type DivergencePreset = 'source' | 'mixed' | 'balanced';

const DIVERGENCE_FIELDS: Record<
  DivergencePreset,
  { label: string; a: number; b: number; note: string }
> = {
  source: {
    label: '두 방향으로 퍼짐',
    a: 1,
    b: 0.5,
    note: '오른쪽과 위쪽 face로 모두 나간다.',
  },
  mixed: {
    label: '위아래는 수축',
    a: 1.4,
    b: -0.25,
    note: '위쪽으로는 들어오지만 오른쪽 outflow가 더 크다.',
  },
  balanced: {
    label: '순상쇄',
    a: 0.75,
    b: -0.75,
    note: '오른쪽 outflow와 위쪽 inflow가 정확히 상쇄된다.',
  },
};

export function DivergenceFieldLab() {
  const [preset, setPreset] = useState<DivergencePreset>('source');
  const reactId = useId();
  const arrow = markerId('divergence-arrow', reactId);
  const { a, b, note } = DIVERGENCE_FIELDS[preset];
  const width = 2.5;
  const height = 1.5;
  const area = width * height;
  const divergence = a + b;
  const faceFluxes = {
    left: 0,
    right: a * width * height,
    bottom: 0,
    top: b * height * width,
  };
  const boundaryNet = Object.values(faceFluxes).reduce((sum, value) => sum + value, 0);
  const volumeIntegral = divergence * area;
  const residual = boundaryNet - volumeIntegral;
  const plot = { left: 76, right: 374, top: 62, bottom: 222 };
  const points = Array.from({ length: 20 }, (_, index) => {
    const column = index % 5;
    const row = Math.floor(index / 5);
    const x = (column / 4) * width;
    const y = (row / 3) * height;
    const screenX = plot.left + (x / width) * (plot.right - plot.left);
    const screenY = plot.bottom - (y / height) * (plot.bottom - plot.top);
    const fx = a * x;
    const fy = b * y;
    const scale = 8.5;
    return {
      x1: screenX,
      y1: screenY,
      x2: screenX + fx * scale,
      y2: screenY - fy * scale,
    };
  });
  const faceTone = (value: number) => (
    value > 1e-8 ? '#047857' : value < -1e-8 ? '#be123c' : 'var(--muted-foreground)'
  );

  return (
    <figure
      data-divergence-field-lab
      data-field-preset={preset}
      data-divergence={formatNumber(divergence, 6)}
      data-boundary-net={formatNumber(boundaryNet, 6)}
      data-volume-integral={formatNumber(volumeIntegral, 6)}
      data-residual={formatNumber(residual, 6)}
      data-face-fluxes={[
        faceFluxes.left,
        faceFluxes.right,
        faceFluxes.bottom,
        faceFluxes.top,
      ].map((value) => formatNumber(value, 6)).join(',')}
      className="foundation-viz-explorer not-prose my-8 scroll-mt-24 overflow-hidden rounded-md border border-border"
    >
      <figcaption className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-4 py-4 sm:pl-6 sm:pr-28">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Divergence field lab</p>
          <p className="mt-1 text-base font-bold">공간 안의 퍼짐률을 네 면의 signed flux로 검산한다</p>
        </div>
        <span className={`text-xs font-semibold ${Math.abs(residual) < 1e-8 ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}`}>
          theorem residual {formatNumber(residual, 3)}
        </span>
      </figcaption>

      <div className="border-b border-border bg-emerald-500/[0.035] p-4 sm:p-5">
        <Segmented
          label="Vector field pattern"
          options={(Object.entries(DIVERGENCE_FIELDS) as Array<
            [DivergencePreset, (typeof DIVERGENCE_FIELDS)[DivergencePreset]]
          >).map(([value, field]) => ({ value, label: field.label }))}
          value={preset}
          onChange={setPreset}
        />
      </div>

      <div className="grid min-w-0 gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(15rem,0.85fr)] lg:items-center">
        <svg
          viewBox="0 0 470 300"
          className="h-auto w-full"
          role="img"
          aria-label={`${DIVERGENCE_FIELDS[preset].label} field에서 divergence와 네 경계 flux 비교`}
        >
          <defs>
            <marker id={arrow} viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 Z" fill="#0e7490" />
            </marker>
          </defs>
          {[0, 1, 2, 3, 4].map((column) => {
            const x = plot.left + (column / 4) * (plot.right - plot.left);
            return <line key={`v-${column}`} x1={x} x2={x} y1={plot.top} y2={plot.bottom} stroke="var(--border)" strokeOpacity="0.55" />;
          })}
          {[0, 1, 2, 3].map((row) => {
            const y = plot.top + (row / 3) * (plot.bottom - plot.top);
            return <line key={`h-${row}`} x1={plot.left} x2={plot.right} y1={y} y2={y} stroke="var(--border)" strokeOpacity="0.55" />;
          })}
          <rect
            x={plot.left}
            y={plot.top}
            width={plot.right - plot.left}
            height={plot.bottom - plot.top}
            rx="4"
            fill="#10b981"
            fillOpacity="0.035"
            stroke="var(--foreground)"
            strokeOpacity="0.5"
            strokeWidth="1.5"
          />
          {points.map((point, index) => (
            <line
              key={index}
              x1={point.x1}
              y1={point.y1}
              x2={point.x2}
              y2={point.y2}
              stroke="#0e7490"
              strokeWidth="1.8"
              strokeLinecap="round"
              markerEnd={`url(#${arrow})`}
            />
          ))}

          <g>
            <rect x="10" y="128" width="56" height="28" rx="4" fill="var(--background)" stroke={faceTone(faceFluxes.left)} strokeOpacity="0.45" />
            <text x="38" y="140" textAnchor="middle" fontSize="9" fontWeight="700" fill="var(--muted-foreground)">왼쪽</text>
            <text x="38" y="151" textAnchor="middle" fontSize="10" fontWeight="700" fill={faceTone(faceFluxes.left)}>{formatNumber(faceFluxes.left, 2)}</text>
          </g>
          <g>
            <rect x="394" y="128" width="66" height="28" rx="4" fill="var(--background)" stroke={faceTone(faceFluxes.right)} strokeOpacity="0.45" />
            <text x="427" y="140" textAnchor="middle" fontSize="9" fontWeight="700" fill="var(--muted-foreground)">오른쪽</text>
            <text x="427" y="151" textAnchor="middle" fontSize="10" fontWeight="700" fill={faceTone(faceFluxes.right)}>{formatNumber(faceFluxes.right, 2)}</text>
          </g>
          <g>
            <rect x="192" y="14" width="66" height="30" rx="4" fill="var(--background)" stroke={faceTone(faceFluxes.top)} strokeOpacity="0.45" />
            <text x="225" y="26" textAnchor="middle" fontSize="9" fontWeight="700" fill="var(--muted-foreground)">위쪽</text>
            <text x="225" y="39" textAnchor="middle" fontSize="10" fontWeight="700" fill={faceTone(faceFluxes.top)}>{formatNumber(faceFluxes.top, 2)}</text>
          </g>
          <g>
            <rect x="192" y="238" width="66" height="30" rx="4" fill="var(--background)" stroke={faceTone(faceFluxes.bottom)} strokeOpacity="0.45" />
            <text x="225" y="250" textAnchor="middle" fontSize="9" fontWeight="700" fill="var(--muted-foreground)">아래쪽</text>
            <text x="225" y="263" textAnchor="middle" fontSize="10" fontWeight="700" fill={faceTone(faceFluxes.bottom)}>{formatNumber(faceFluxes.bottom, 2)}</text>
          </g>
          <text x="225" y="291" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="var(--foreground)">
            가로 2.5 × 세로 1.5 · area {formatNumber(area, 2)}
          </text>
        </svg>

        <div className="min-w-0 space-y-3">
          <div className="rounded-md border border-border bg-muted/30 px-3 py-3 text-xs leading-relaxed text-muted-foreground">
            <strong className="text-foreground">F(x,y) = ({formatNumber(a, 2)}x, {formatNumber(b, 2)}y)</strong>
            <span className="mt-1 block">{note}</span>
          </div>
          <MetricStrip items={[
            { label: 'Local divergence a+b', value: formatNumber(divergence, 3), accent: divergence === 0 ? 'text-foreground' : 'text-emerald-700 dark:text-emerald-300' },
            { label: 'Rectangle area', value: formatNumber(area, 3) },
            { label: '네 face의 net flux', value: formatNumber(boundaryNet, 3) },
            { label: '∫ divergence dA', value: formatNumber(volumeIntegral, 3), accent: 'text-emerald-700 dark:text-emerald-300' },
          ]} />
        </div>
      </div>
      <p className="border-t border-border px-4 py-3 text-xs leading-relaxed text-muted-foreground sm:px-6">
        Face 값이 각각 0일 필요는 없다. 순상쇄 preset에서는 오른쪽으로 나가는 양과 위쪽으로 들어오는 양이 같아 net flux와 divergence integral만 0이 된다.
      </p>
    </figure>
  );
}

export function InternalFaceCancellationLab() {
  const [cellCount, setCellCount] = useState(3);
  const [selectedFace, setSelectedFace] = useState(1);
  const [selectedFlux, setSelectedFlux] = useState(1.5);
  const [mode, setMode] = useState<CancellationMode>('opposite');
  const safeSelectedFace = Math.min(selectedFace, cellCount - 1);
  const faces = Array.from({ length: cellCount + 1 }, (_, index) => {
    if (index === 0) return -2;
    if (index === cellCount) return 5;
    if (index === safeSelectedFace) return selectedFlux;
    return 0.7 + index * 0.65;
  });
  const physicalWidths = Array.from({ length: cellCount }, (_, index) => 0.8 + index * 0.35);
  const leftContributions = Array.from({ length: cellCount }, (_, index) => (
    mode === 'same' && index === safeSelectedFace
      ? faces[index]
      : -faces[index]
  ));
  const rightContributions = Array.from({ length: cellCount }, (_, index) => faces[index + 1]);
  const cellNet = leftContributions.map((left, index) => left + rightContributions[index]);
  const cellAverageDivergence = cellNet.map((net, index) => net / physicalWidths[index]);
  const volumeWeightedContributions = cellAverageDivergence.map(
    (divergence, index) => divergence * physicalWidths[index],
  );
  const unweightedDivergenceSum = cellAverageDivergence.reduce(
    (sum, divergence) => sum + divergence,
    0,
  );
  const globalTotal = volumeWeightedContributions.reduce((sum, value) => sum + value, 0);
  const boundaryTotal = faces[cellCount] - faces[0];
  const residual = globalTotal - boundaryTotal;
  const pairSum = mode === 'opposite' ? 0 : 2 * selectedFlux;
  const totalPhysicalWidth = physicalWidths.reduce((sum, width) => sum + width, 0);
  let cellCursor = 50;
  const cells = physicalWidths.map((width, index) => {
    const pixelWidth = width / totalPhysicalWidth * 340;
    const cell = { index, x: cellCursor, pixelWidth };
    cellCursor += pixelWidth;
    return cell;
  });

  return (
    <figure
      data-internal-face-cancellation-lab
      data-cell-count={cellCount}
      data-selected-face={safeSelectedFace}
      data-selected-flux={formatNumber(selectedFlux, 6)}
      data-normal-mode={mode}
      data-global-total={formatNumber(globalTotal, 6)}
      data-boundary-total={formatNumber(boundaryTotal, 6)}
      data-pair-sum={formatNumber(pairSum, 6)}
      data-residual={formatNumber(residual, 6)}
      data-cell-widths={physicalWidths.map((value) => formatNumber(value, 6)).join(',')}
      data-cell-divergence={cellAverageDivergence.map((value) => formatNumber(value, 6)).join(',')}
      data-unweighted-divergence-sum={formatNumber(unweightedDivergenceSum, 6)}
      data-volume-weighted={volumeWeightedContributions.map((value) => formatNumber(value, 6)).join(',')}
      className="foundation-viz-explorer not-prose my-8 scroll-mt-24 overflow-hidden rounded-md border border-border"
    >
      <figcaption className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-4 py-4 sm:pl-6 sm:pr-28">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Internal face cancellation lab</p>
          <p className="mt-1 text-base font-bold">한 face를 두 cell이 반대 법선으로 공유한다</p>
        </div>
        <span className={`text-xs font-semibold ${Math.abs(residual) < 1e-8 ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}`}>
          global residual {formatNumber(residual, 2)}
        </span>
      </figcaption>

      <div className="grid min-w-0 gap-4 border-b border-border bg-emerald-500/[0.035] p-4 sm:grid-cols-2 sm:p-5">
        <Segmented
          label="내부 face 법선"
          options={[
            { value: 'opposite', label: '반대 법선 · 보존' },
            { value: 'same', label: '같은 법선 · 오류' },
          ]}
          value={mode}
          onChange={setMode}
        />
        <RangeControl
          id="integrals-cancellation-cells"
          label="Cell 수"
          value={cellCount}
          valueLabel={`${cellCount}개`}
          min={2}
          max={5}
          step={1}
          accentClass="accent-emerald-700"
          onChange={(value) => {
            setCellCount(value);
            setSelectedFace((current) => Math.min(current, value - 1));
          }}
        />
        <RangeControl id="integrals-cancellation-face" label="선택한 내부 face" value={safeSelectedFace} valueLabel={`face ${safeSelectedFace}`} min={1} max={cellCount - 1} step={1} accentClass="accent-amber-600" onChange={setSelectedFace} />
        <RangeControl id="integrals-cancellation-flux" label="선택 face flux" value={selectedFlux} valueLabel={formatNumber(selectedFlux, 1)} min={-4} max={4} step={0.25} accentClass="accent-blue-700" onChange={setSelectedFlux} />
      </div>

      <div className="grid min-w-0 gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(15rem,0.8fr)] lg:items-center">
        <svg viewBox="0 0 440 255" className="h-auto w-full" role="img" aria-label={`${cellCount}개 cell의 내부 face flux 상쇄`}>
          {cells.map(({ index, x, pixelWidth }) => {
            const selected = index === safeSelectedFace - 1 || index === safeSelectedFace;
            return (
              <g key={index}>
                <rect x={x} y="82" width={pixelWidth} height="104" fill={selected ? '#10b981' : 'var(--muted)'} fillOpacity={selected ? 0.09 : 0.38} stroke="var(--border)" />
                <text x={x + pixelWidth / 2} y="117" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--foreground)">Cell {index + 1}</text>
                <text x={x + pixelWidth / 2} y="140" textAnchor="middle" fontSize="9.5" fill="var(--muted-foreground)">Δx {formatNumber(physicalWidths[index], 2)}</text>
                <text x={x + pixelWidth / 2} y="160" textAnchor="middle" fontSize="9.5" fill="var(--muted-foreground)">div {formatNumber(cellAverageDivergence[index], 2)}</text>
              </g>
            );
          })}
          {faces.map((face, index) => {
            const x = index === cellCount ? 390 : cells[index].x;
            const selected = index === safeSelectedFace;
            return (
              <g key={index}>
                <line x1={x} x2={x} y1="68" y2="198" stroke={selected ? '#d97706' : 'var(--muted-foreground)'} strokeWidth={selected ? 3 : 1.25} strokeOpacity={selected ? 0.9 : 0.55} />
                <rect x={Math.max(7, Math.min(393, x - 21))} y="40" width="42" height="20" rx="3" fill="var(--background)" stroke={selected ? '#d97706' : 'var(--border)'} />
                <text x={Math.max(28, Math.min(414, x))} y="54" textAnchor="middle" fontSize="10" fontWeight="700" fill={selected ? '#b45309' : 'var(--muted-foreground)'}>{formatNumber(face, 1)}</text>
              </g>
            );
          })}
          <text x="50" y="224" fontSize="10" fill="var(--muted-foreground)">외부 left</text>
          <text x="390" y="224" textAnchor="end" fontSize="10" fill="var(--muted-foreground)">외부 right</text>
          <text x="220" y="22" textAnchor="middle" fontSize="11" fontWeight="700" fill={mode === 'opposite' ? '#047857' : '#be123c'}>
            선택 face 쌍의 합 {formatNumber(pairSum, 2)}
          </text>
        </svg>
        <div className="min-w-0 space-y-3">
          <div className="overflow-hidden rounded-md border border-border">
            {cells.map(({ index }) => (
              <div
                key={index}
                className="grid min-w-0 grid-cols-[3.25rem_minmax(0,1fr)_minmax(0,1fr)] gap-x-2 border-b border-border px-3 py-2 text-xs last:border-b-0"
              >
                <strong className="row-span-2 self-center">Cell {index + 1}</strong>
                <span className="min-w-0 text-muted-foreground">left {formatNumber(leftContributions[index], 2)}</span>
                <span className="min-w-0 text-muted-foreground">right {formatNumber(rightContributions[index], 2)}</span>
                <span className="col-span-2 min-w-0 font-mono">
                  div {formatNumber(cellAverageDivergence[index], 2)} × Δx {formatNumber(physicalWidths[index], 2)}
                  {' = '}
                  {formatNumber(volumeWeightedContributions[index], 2)}
                </span>
              </div>
            ))}
            <div className="grid min-w-0 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-t border-border bg-rose-500/[0.045] px-3 py-2 text-xs">
              <span className="min-w-0 leading-relaxed text-muted-foreground">
                폭을 빼고 divergence average만 더한 잘못된 값
              </span>
              <strong className="font-mono text-rose-700 dark:text-rose-300">
                {formatNumber(unweightedDivergenceSum, 3)}
              </strong>
            </div>
          </div>
          <MetricStrip items={[
            { label: 'Σ(div × Δx)', value: formatNumber(globalTotal, 3) },
            { label: '외부 경계 flux', value: formatNumber(boundaryTotal, 3) },
            { label: '내부 face 쌍', value: formatNumber(pairSum, 3), accent: Math.abs(pairSum) < 1e-8 ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300' },
            { label: '남은 residual', value: formatNumber(residual, 3) },
          ]} />
        </div>
      </div>
      <p className="border-t border-border px-4 py-3 text-xs leading-relaxed text-muted-foreground sm:px-6">
        선택한 내부 flux를 바꿔도 보존 모드의 global total은 바뀌지 않는다. 이웃 cell의 outward normal이 반대라 같은 값이 한쪽에는 나가고 다른 쪽에는 들어오기 때문이다.
      </p>
    </figure>
  );
}

type LedgerMode = 'full' | 'steady';

export function ControlVolumeLedgerLab() {
  const [inflow, setInflow] = useState(5);
  const [outflow, setOutflow] = useState(3);
  const [source, setSource] = useState(0.5);
  const [elapsed, setElapsed] = useState(4);
  const [mode, setMode] = useState<LedgerMode>('full');
  const initial = 10;
  const storageRate = inflow - outflow + source;
  const amount = Math.max(0, initial + storageRate * elapsed);
  const netOutflow = outflow - inflow;
  const fullResidual = storageRate + netOutflow - source;
  const shownResidual = mode === 'full' ? fullResidual : netOutflow - source;
  const fillHeight = Math.max(8, Math.min(150, (amount / 35) * 150));

  return (
    <figure
      data-control-volume-ledger-lab
      data-ledger-mode={mode}
      data-inflow={formatNumber(inflow, 6)}
      data-outflow={formatNumber(outflow, 6)}
      data-source={formatNumber(source, 6)}
      data-storage-rate={formatNumber(storageRate, 6)}
      data-amount={formatNumber(amount, 6)}
      data-residual={formatNumber(shownResidual, 6)}
      className="foundation-viz-explorer not-prose my-8 scroll-mt-24 overflow-hidden rounded-md border border-border"
    >
      <figcaption className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-4 py-4 sm:pl-6 sm:pr-28">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Control-volume ledger lab</p>
          <p className="mt-1 text-base font-bold">들어오고 나가고 생긴 차이는 저장량의 변화가 된다</p>
        </div>
        <span className={`text-xs font-semibold ${Math.abs(shownResidual) < 1e-8 ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}`}>
          ledger residual {formatNumber(shownResidual, 2)}
        </span>
      </figcaption>

      <div className="grid min-w-0 gap-4 border-b border-border bg-teal-500/[0.035] p-4 sm:grid-cols-2 sm:p-5">
        <Segmented
          label="Balance model"
          options={[
            { value: 'full', label: 'Storage 포함' },
            { value: 'steady', label: 'Storage를 지움' },
          ]}
          value={mode}
          onChange={setMode}
        />
        <RangeControl id="integrals-ledger-time" label="경과 시간" value={elapsed} valueLabel={`${elapsed} s`} min={0} max={8} step={1} accentClass="accent-teal-700" onChange={setElapsed} />
        <RangeControl id="integrals-ledger-inflow" label="유입률" value={inflow} valueLabel={`${formatNumber(inflow, 1)} kg/s`} min={0} max={8} step={0.25} accentClass="accent-blue-700" onChange={setInflow} />
        <RangeControl id="integrals-ledger-outflow" label="유출률" value={outflow} valueLabel={`${formatNumber(outflow, 1)} kg/s`} min={0} max={8} step={0.25} accentClass="accent-amber-600" onChange={setOutflow} />
        <div className="sm:col-span-2">
          <RangeControl id="integrals-ledger-source" label="내부 source / sink" value={source} valueLabel={`${formatNumber(source, 1)} kg/s`} min={-2} max={2} step={0.25} accentClass="accent-rose-600" onChange={setSource} />
        </div>
      </div>

      <div className="grid min-w-0 gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.85fr)_minmax(16rem,1.15fr)] lg:items-center">
        <div className="relative mx-auto h-[230px] w-full max-w-[330px]" aria-label={`현재 저장량 ${formatNumber(amount, 2)} kg`}>
          <div className="absolute left-1/2 top-8 h-[170px] w-[150px] -translate-x-1/2 overflow-hidden rounded-b-md border-2 border-foreground/55 border-t-0">
            <div className="absolute inset-x-0 bottom-0 bg-cyan-500/25 transition-[height] duration-500 motion-reduce:transition-none" style={{ height: `${fillHeight}px` }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="rounded bg-background/90 px-2 py-1 font-mono text-sm font-bold">{formatNumber(amount, 2)} kg</span>
            </div>
          </div>
          <div className="absolute left-0 top-[86px] flex items-center gap-1 text-xs font-semibold text-blue-700 dark:text-blue-300">
            유입 {formatNumber(inflow, 1)} <ArrowRight className="h-5 w-5" />
          </div>
          <div className="absolute right-0 top-[132px] flex items-center gap-1 text-xs font-semibold text-amber-700 dark:text-amber-300">
            <ArrowRight className="h-5 w-5" /> 유출 {formatNumber(outflow, 1)}
          </div>
          <div className="absolute inset-x-0 bottom-0 text-center text-xs font-semibold text-rose-700 dark:text-rose-300">
            내부 source {source >= 0 ? '+' : ''}{formatNumber(source, 1)} kg/s
          </div>
        </div>
        <MetricStrip items={[
          { label: '현재 storage rate', value: `${formatNumber(storageRate, 2)} kg/s`, accent: 'text-teal-700 dark:text-teal-300' },
          { label: 'Net outward flux', value: `${formatNumber(netOutflow, 2)} kg/s` },
          { label: '경과 뒤 저장량', value: `${formatNumber(amount, 2)} kg` },
          { label: mode === 'full' ? '전체 ledger residual' : '가짜 정상상태 residual', value: formatNumber(shownResidual, 3), accent: Math.abs(shownResidual) < 1e-8 ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300' },
        ]} />
      </div>
      <p className="border-t border-border px-4 py-3 text-xs leading-relaxed text-muted-foreground sm:px-6">
        Storage를 포함하면 유입·유출이 달라도 ledger가 닫힌다. Storage를 지우는 것은 정상상태를 증명한 뒤에만 가능한 가정이다.
      </p>
    </figure>
  );
}

type GridGeometry = 'uniform' | 'nonuniform';
type FluxMode = 'shared' | 'split';

export function ConservativeGridLab() {
  const [geometry, setGeometry] = useState<GridGeometry>('nonuniform');
  const [fluxMode, setFluxMode] = useState<FluxMode>('shared');
  const [selectedFace, setSelectedFace] = useState<'face-1' | 'face-2'>('face-1');
  const widths = geometry === 'uniform' ? [1, 1, 1] : [0.8, 1.1, 1.6];
  const density = [1.5, 2.5, 3.25];
  const sourceDensity = [0.15, -0.2, 0.35];
  const sharedFaces = [-0.8, 1.1, 0.6, 2.4];
  const splitLeftFaces = [
    sharedFaces[0],
    selectedFace === 'face-1' ? 0.85 : sharedFaces[1],
    selectedFace === 'face-2' ? 0.9 : sharedFaces[2],
  ];
  const leftFaces = fluxMode === 'shared' ? sharedFaces.slice(0, 3) : splitLeftFaces;
  const rightFaces = sharedFaces.slice(1);
  const stored = density.map((value, index) => value * widths[index]);
  const integratedSources = sourceDensity.map((value, index) => value * widths[index]);
  const storageRates = integratedSources.map((source, index) => source - (rightFaces[index] - leftFaces[index]));
  const storedTotal = stored.reduce((sum, value) => sum + value, 0);
  const sourceTotal = integratedSources.reduce((sum, value) => sum + value, 0);
  const actualStorageRate = storageRates.reduce((sum, value) => sum + value, 0);
  const expectedStorageRate = sourceTotal - (sharedFaces[3] - sharedFaces[0]);
  const ghostSource = actualStorageRate - expectedStorageRate;
  const totalWidth = widths.reduce((sum, value) => sum + value, 0);
  const cells = useMemo(() => {
    let cursor = 54;
    return widths.map((width, index) => {
      const pixelWidth = (width / totalWidth) * 338;
      const cell = { index, x: cursor, pixelWidth };
      cursor += pixelWidth;
      return cell;
    });
  }, [totalWidth, widths.join(',')]);

  return (
    <figure
      data-conservative-grid-lab
      data-grid-geometry={geometry}
      data-flux-mode={fluxMode}
      data-selected-face={selectedFace}
      data-stored-total={formatNumber(storedTotal, 6)}
      data-source-total={formatNumber(sourceTotal, 6)}
      data-storage-rate={formatNumber(actualStorageRate, 6)}
      data-expected-storage-rate={formatNumber(expectedStorageRate, 6)}
      data-ghost-source={formatNumber(ghostSource, 6)}
      className="foundation-viz-explorer not-prose my-8 scroll-mt-24 overflow-hidden rounded-md border border-border"
    >
      <figcaption className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-4 py-4 sm:pl-6 sm:pr-28">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase text-muted-foreground">Conservative grid lab</p>
          <p className="mt-1 text-base font-bold">Cell 크기와 shared face flux가 discrete 보존을 결정한다</p>
        </div>
        <span className={`text-xs font-semibold ${Math.abs(ghostSource) < 1e-8 ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300'}`}>
          ghost source {formatNumber(ghostSource, 3)}
        </span>
      </figcaption>

      <div className="grid min-w-0 gap-4 border-b border-border bg-violet-500/[0.035] p-4 sm:grid-cols-2 sm:p-5">
        <Segmented
          label="Grid geometry"
          options={[
            { value: 'uniform', label: 'Uniform cell' },
            { value: 'nonuniform', label: 'Nonuniform cell' },
          ]}
          value={geometry}
          onChange={setGeometry}
        />
        <Segmented
          label="Internal face flux"
          options={[
            { value: 'shared', label: '한 값을 공유' },
            { value: 'split', label: '양쪽이 다른 값' },
          ]}
          value={fluxMode}
          onChange={setFluxMode}
        />
        <div className="sm:col-span-2">
          <Segmented
            label="검사할 internal face"
            options={[
              { value: 'face-1', label: 'Cell 1 ↔ 2' },
              { value: 'face-2', label: 'Cell 2 ↔ 3' },
            ]}
            value={selectedFace}
            onChange={setSelectedFace}
          />
        </div>
      </div>

      <div className="grid min-w-0 gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(15rem,0.8fr)] lg:items-center">
        <svg viewBox="0 0 450 270" className="h-auto w-full" role="img" aria-label={`${geometry} grid의 ${fluxMode} flux 보존 계산`}>
          {cells.map(({ index, x, pixelWidth }) => (
            <g key={index}>
              <rect x={x} y="72" width={pixelWidth} height="120" fill={index === 0 ? '#06b6d4' : index === 1 ? '#8b5cf6' : '#f59e0b'} fillOpacity="0.09" stroke="var(--border)" strokeWidth="1.5" />
              <text x={x + pixelWidth / 2} y="106" textAnchor="middle" fontSize="11" fontWeight="700" fill="var(--foreground)">Cell {index + 1}</text>
              <text x={x + pixelWidth / 2} y="130" textAnchor="middle" fontSize="10" fill="var(--muted-foreground)">Δx {formatNumber(widths[index], 2)}</text>
              <text x={x + pixelWidth / 2} y="151" textAnchor="middle" fontSize="10" fill="var(--muted-foreground)">qΔx {formatNumber(stored[index], 2)}</text>
              <text x={x + pixelWidth / 2} y="176" textAnchor="middle" fontSize="10" fontWeight="700" fill={storageRates[index] >= 0 ? '#047857' : '#be123c'}>rate {formatNumber(storageRates[index], 3)}</text>
            </g>
          ))}
          {sharedFaces.map((face, index) => {
            const x = index === 0 ? 54 : index === 3 ? 392 : cells[index - 1].x + cells[index - 1].pixelWidth;
            const leftValue = index > 0 && index < 3 ? leftFaces[index] : face;
            const mismatch = index > 0 && index < 3 && Math.abs(leftValue - face) > 1e-8;
            return (
              <g key={index}>
                <line x1={x} x2={x} y1="58" y2="204" stroke={mismatch ? '#e11d48' : '#0e7490'} strokeWidth={mismatch ? 3 : 1.75} />
                <rect x={Math.max(9, Math.min(399, x - 20))} y="30" width="40" height="20" rx="3" fill="var(--background)" stroke={mismatch ? '#e11d48' : '#0e7490'} strokeOpacity="0.5" />
                <text x={Math.max(29, Math.min(419, x))} y="44" textAnchor="middle" fontSize="10" fontWeight="700" fill={mismatch ? '#be123c' : '#0e7490'}>{formatNumber(face, 1)}</text>
                {mismatch && <text x={x} y="222" textAnchor="middle" fontSize="9" fontWeight="700" fill="#be123c">반대쪽 {formatNumber(leftValue, 1)}</text>}
              </g>
            );
          })}
          <text x="223" y="252" textAnchor="middle" fontSize="11" fontWeight="700" fill={Math.abs(ghostSource) < 1e-8 ? '#047857' : '#be123c'}>
            local 식의 합 − global boundary 식 = {formatNumber(ghostSource, 3)}
          </text>
        </svg>
        <MetricStrip items={[
          { label: '저장된 총량 ΣqΔx', value: formatNumber(storedTotal, 3), accent: 'text-violet-700 dark:text-violet-300' },
          { label: '적분한 source', value: formatNumber(sourceTotal, 3) },
          { label: 'Cell rate 합', value: formatNumber(actualStorageRate, 3) },
          { label: 'Boundary가 요구한 rate', value: formatNumber(expectedStorageRate, 3), accent: Math.abs(ghostSource) < 1e-8 ? 'text-emerald-700 dark:text-emerald-300' : 'text-rose-700 dark:text-rose-300' },
        ]} />
      </div>
      <p className="border-t border-border px-4 py-3 text-xs leading-relaxed text-muted-foreground sm:px-6">
        Nonuniform cell에서는 density를 그냥 더할 수 없다. 각 cell measure를 곱하고, 같은 internal face에는 한 numerical flux만 써야 local 식을 더한 결과가 global ledger와 같다.
      </p>
    </figure>
  );
}

export function IntegralFieldLabLegend() {
  return (
    <div className="not-prose my-8 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-4">
      {[
        { icon: Sigma, label: '누적', note: 'density × measure' },
        { icon: MoveRight, label: '합력', note: 'force + moment' },
        { icon: Box, label: 'Control volume', note: 'storage + boundary' },
        { icon: Grid3X3, label: 'Discrete 보존', note: 'shared face flux' },
      ].map(({ icon: Icon, label, note }) => (
        <div key={label} className="min-w-0 bg-background p-4">
          <Icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
          <p className="mt-3 text-sm font-bold">{label}</p>
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{note}</p>
        </div>
      ))}
      <span className="sr-only"><Gauge />적분과 보존법칙의 네 연결 단계</span>
    </div>
  );
}
