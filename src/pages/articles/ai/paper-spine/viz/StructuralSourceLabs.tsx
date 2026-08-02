import { useMemo, useState } from 'react';
import { Bolt, ChartSpline } from 'lucide-react';
import { MetricGrid, SegmentedControl } from '../../nlp-shared';

const clamp = (value: number, low: number, high: number) => Math.min(high, Math.max(low, value));
const fmt = (value: number, digits = 2) => Number.isFinite(value) ? value.toFixed(digits) : 'n/a';

function Range({ label, value, min, max, step = 1, unit, onChange }: { label: string; value: number; min: number; max: number; step?: number; unit: string; onChange: (value: number) => void }) {
  return <label className="block min-w-0"><span className="mb-2 flex items-center justify-between gap-3 text-xs font-semibold"><span>{label}</span><span className="shrink-0 font-mono">{value}{unit}</span></span><input className="h-2 w-full cursor-pointer accent-blue-600" type="range" min={min} max={max} step={step} value={value} onChange={(event) => onChange(Number(event.target.value))} /></label>;
}

type Plane = 'near' | 'middle' | 'far';

export function NasaBoltLoadIntroductionLab() {
  const [plane, setPlane] = useState<Plane>('middle');
  const [preload, setPreload] = useState(30);
  const [external, setExternal] = useState(24);
  const [relieving, setRelieving] = useState(5);
  const [compressed, setCompressed] = useState(8);
  const [deltaT, setDeltaT] = useState(32);
  const geometryN = plane === 'near' ? 0.2 : plane === 'middle' ? 0.5 : 0.8;
  const stiffnessScale = 100;
  const boltStiffness = 2.4 * stiffnessScale;
  const relievingStiffness = relieving * stiffnessScale;
  const compressedStiffness = compressed * stiffnessScale;
  const sblif = compressedStiffness / (relievingStiffness + compressedStiffness);
  const tensilePathStiffness = relievingStiffness / sblif;
  const phi = boltStiffness / (tensilePathStiffness + boltStiffness);
  const thermal = phi * tensilePathStiffness * 32 * deltaT * (23 - 12) * 1e-6;
  const boltIncrement = sblif * phi * external;
  const boltLoad = preload + thermal + boltIncrement;
  const geometricPrediction = preload + thermal + geometryN * phi * external;
  const clampRemaining = preload + thermal - (1 - sblif * phi) * external;
  const danger = clampRemaining <= 0 || boltLoad > 43;
  return <figure className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border bg-background">
    <figcaption className="grid min-w-0 gap-2 border-b border-border py-4 pl-4 pr-16 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:pr-20"><span className="flex items-center gap-2 font-mono text-xs font-black text-blue-700 dark:text-blue-300"><Bolt className="h-4 w-4" /> NASA TM 2025</span><strong className="text-sm">Load introduction을 geometry가 아니라 stiffness path로 읽기</strong><span className={`text-xs font-black ${danger ? 'text-red-700 dark:text-red-300' : 'text-emerald-700 dark:text-emerald-300'}`}>{danger ? 'GAP / LOAD LIMIT' : 'PATHS COMPATIBLE'}</span></figcaption>
    <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]"><div className="space-y-5"><SegmentedControl label="External load plane" value={plane} onChange={setPlane} options={[{ value: 'near', label: 'Faying surface 근처' }, { value: 'middle', label: '중간' }, { value: 'far', label: '바깥쪽' }]} /><Range label="Preload" value={preload} min={10} max={45} unit=" kN" onChange={setPreload} /><Range label="External tension" value={external} min={0} max={48} unit=" kN" onChange={setExternal} /><Range label="Relieving-path stiffness" value={relieving} min={1} max={14} step={0.5} unit=" ×100 kN/mm" onChange={setRelieving} /><Range label="Compressed-region stiffness" value={compressed} min={1} max={14} step={0.5} unit=" ×100 kN/mm" onChange={setCompressed} /><Range label="Joint temperature change" value={deltaT} min={-45} max={80} unit=" K" onChange={setDeltaT} /></div><div><div className="grid gap-5 sm:grid-cols-[minmax(10rem,0.75fr)_minmax(0,1.25fr)]"><div className="relative mx-auto h-72 w-44"><div className="absolute left-5 right-5 top-14 h-20 rounded-sm border border-border bg-muted/25" /><div className="absolute bottom-14 left-5 right-5 h-20 rounded-sm border border-border bg-muted/25" /><div className="absolute bottom-6 left-1/2 top-6 w-7 -translate-x-1/2 rounded-sm bg-blue-600/75" /><div className="absolute left-1/2 top-5 h-5 w-20 -translate-x-1/2 rounded-sm bg-blue-600" /><div className="absolute bottom-5 left-1/2 h-5 w-20 -translate-x-1/2 rounded-sm bg-blue-600" /><div className="absolute left-5 right-5 top-1/2 h-px bg-emerald-500" /><div className="absolute w-px bg-violet-600" style={{ left: `${plane === 'near' ? 37 : plane === 'middle' ? 24 : 10}px`, top: '29px', bottom: '29px' }} /><span className="absolute left-0 top-1/2 -translate-y-1/2 -rotate-90 text-[9px] font-black text-violet-700 dark:text-violet-300">LOAD PLANE</span></div><div className="grid content-start gap-px overflow-hidden rounded-md border border-border bg-border"><div className="bg-background p-4"><p className="text-[10px] font-black text-blue-700 dark:text-blue-300">STIFFNESS SHARE</p><p className="mt-2 text-xs leading-relaxed">Bolt stiffness와 도출한 tensile-path stiffness Kₐ가 external load share `φ`를 만든다. 압축 강성 Kc로 바꾸지 않는다.</p></div><div className="bg-background p-4"><p className="text-[10px] font-black text-violet-700 dark:text-violet-300">REPORT CONTRIBUTION</p><p className="mt-2 text-xs leading-relaxed">Eq.46으로 `n`을 구하고 Eq.45가 같은 값을 내도록 Kₐ를 도출한다. 따라서 `n`, `φ`, thermal load가 같은 path ledger를 공유한다.</p></div><div className="bg-background p-4"><p className="text-[10px] font-black text-amber-700 dark:text-amber-300">COMPARISON</p><p className="mt-2 text-xs leading-relaxed">Geometry-only bolt load {fmt(geometricPrediction, 1)} kN · stiffness-path load {fmt(boltLoad, 1)} kN.</p></div><div className="bg-background p-4"><p className={`text-xs leading-relaxed ${danger ? 'text-red-700 dark:text-red-300' : 'text-muted-foreground'}`}>{danger ? 'Linear attached-state assumption을 벗어났다. Contact/gap, prying and nonlinear FEA or test로 넘어간다.' : 'Interface가 붙어 있는 범위에서 load paths의 displacement compatibility가 유지된다.'}</p></div></div></div></div></div><div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[{ label: 'SBLIF n', value: fmt(sblif, 3) }, { label: 'Derived tensile Kₐ', value: `${fmt(tensilePathStiffness, 0)} kN/mm` }, { label: 'Stiffness factor φ', value: fmt(phi, 3) }, { label: 'Thermal bolt load', value: `${fmt(thermal, 2)} kN` }, { label: 'Remaining clamp', value: `${fmt(clampRemaining, 2)} kN`, accent: !danger }]} /><p className="mt-3 text-[11px] leading-relaxed text-muted-foreground">수치는 원문 joint의 재현값이 아니라 Eq.25·34·45·46의 결합 방향을 확인하는 교육용 fixture다. Kb=240 kN/mm, grip length=32 mm, CTE difference=11 µm/(m·K)를 고정했다.</p></div>
  </figure>;
}

type DamageModel = 'miner' | 'double-linear';
type StressOrder = 'high-low' | 'low-high';

export function MansonDoubleLinearFatigueLab() {
  const [model, setModel] = useState<DamageModel>('double-linear');
  const [order, setOrder] = useState<StressOrder>('high-low');
  const [applied, setApplied] = useState(35);
  const [lifeHigh, setLifeHigh] = useState(2200);
  const [lifeLow, setLifeLow] = useState(44000);
  const fraction = applied / 100;
  const minerRemaining = 1 - fraction;
  const propagationHigh = Math.min(14 * lifeHigh ** 0.6 / lifeHigh, 1);
  const propagationLow = Math.min(14 * lifeLow ** 0.6 / lifeLow, 1);
  const initiationHigh = 1 - propagationHigh;
  const initiationLow = 1 - propagationLow;
  const pointB = order === 'high-low' ? initiationHigh : initiationLow;
  const targetPropagation = order === 'high-low' ? propagationLow : propagationHigh;
  const firstSlope = (1 - targetPropagation) / Math.max(pointB, 0.02);
  const secondSlope = targetPropagation / Math.max(1 - pointB, 0.02);
  const doubleRemaining = fraction <= pointB ? 1 - firstSlope * fraction : targetPropagation - secondSlope * (fraction - pointB);
  const remaining = clamp(model === 'miner' ? minerRemaining : doubleRemaining, 0, 1.25);
  const polyline = useMemo(() => {
    if (model === 'miner') return '30,30 570,190';
    const bx = 30 + pointB * 540;
    const by = 30 + (1 - targetPropagation) * 160;
    return `30,30 ${bx},${by} 570,190`;
  }, [model, pointB, targetPropagation]);
  return <figure className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border bg-background">
    <figcaption className="grid min-w-0 gap-2 border-b border-border py-4 pl-4 pr-16 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center sm:pr-20"><span className="flex items-center gap-2 font-mono text-xs font-black text-blue-700 dark:text-blue-300"><ChartSpline className="h-4 w-4" /> NASA TN D-3839</span><strong className="text-sm">한 damage line을 Phase I and II로 분리</strong><span className="text-xs font-black text-violet-700 dark:text-violet-300">SMOOTH 1/4-IN SPECIMEN</span></figcaption>
    <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1.28fr)]"><div className="space-y-5"><SegmentedControl label="Fatigue damage model" value={model} onChange={setModel} options={[{ value: 'miner', label: 'Conventional linear' }, { value: 'double-linear', label: 'Double linear' }]} /><SegmentedControl label="Two-level loading order" value={order} onChange={setOrder} options={[{ value: 'high-low', label: 'High → low' }, { value: 'low-high', label: 'Low → high' }]} /><Range label="First-level life fraction applied" value={applied} min={5} max={95} unit="%" onChange={setApplied} /><Range label="High-stress constant life Nf,1" value={lifeHigh} min={800} max={12000} step={200} unit=" cycles" onChange={setLifeHigh} /><Range label="Low-stress constant life Nf,2" value={lifeLow} min={8000} max={120000} step={2000} unit=" cycles" onChange={setLifeLow} /></div><div><div className="relative h-64 overflow-hidden rounded-md border border-border bg-[linear-gradient(to_right,hsl(var(--border)/.45)_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border)/.45)_1px,transparent_1px)] bg-[size:12.5%_25%]"><svg role="img" aria-label={`${order} two-level fatigue에서 ${model} remaining cycle ratio`} viewBox="0 0 600 220" className="h-full w-full" preserveAspectRatio="none"><line x1="30" y1="30" x2="570" y2="190" stroke="#94a3b8" strokeWidth="2" strokeDasharray="7 6" /><polyline points={polyline} fill="none" stroke={model === 'miner' ? '#64748b' : '#2563eb'} strokeWidth="4" /><line x1={30 + fraction * 540} x2={30 + fraction * 540} y1="25" y2="195" stroke="#d97706" strokeWidth="2" strokeDasharray="5 5" /><circle cx={30 + fraction * 540} cy={30 + (1 - remaining) * 160} r="6" fill="#ffffff" stroke="#dc2626" strokeWidth="3" />{model === 'double-linear' && <circle cx={30 + pointB * 540} cy={30 + (1 - targetPropagation) * 160} r="5" fill="#7c3aed" />}</svg><span className="absolute left-3 top-3 text-[10px] font-black text-muted-foreground">남은 두 번째 수준 수명비 ↑</span><span className="absolute bottom-3 right-3 text-[10px] font-black text-muted-foreground">첫 수준 적용 수명비 →</span></div><div className="mt-4 grid gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-2"><div className="bg-background p-4"><p className="text-[10px] font-black text-blue-700 dark:text-blue-300">MODEL PREDICTION</p><p className="mt-2 text-xs leading-relaxed">첫 수준 {applied}% 뒤 남은 두 번째 수준 수명비: <strong>{fmt(remaining, 3)}</strong></p></div><div className="bg-background p-4"><p className="text-[10px] font-black text-amber-700 dark:text-amber-300">SOURCE BOUNDARY</p><p className="mt-2 text-xs leading-relaxed">14Nf^0.6 separation은 저자들이 사용한 smooth 1/4-inch notch-ductile specimen proposal이다.</p></div></div><div className="mt-4 rounded-md border border-amber-500/30 bg-amber-500/[0.04] p-3 text-xs leading-relaxed">{model === 'miner' ? '하나의 직선은 load order를 지운다. 같은 applied fraction이면 high→low와 low→high가 같은 예측을 낸다.' : '두 직선은 Phase I and II transition B를 도입해 order effect를 표현한다. 저자들은 뒤에서 물리 crack stage 대신 experimentally defined phases로 해석을 완화했다.'}</div></div></div><div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[{ label: 'High-stress propagation fraction', value: fmt(propagationHigh, 3) }, { label: 'Low-stress propagation fraction', value: fmt(propagationLow, 3) }, { label: 'Transition B', value: fmt(pointB, 3) }, { label: 'Remaining ratio', value: fmt(remaining, 3), accent: model === 'double-linear' }]} /></div>
  </figure>;
}
