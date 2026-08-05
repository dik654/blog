import { useState } from 'react';
import { Activity, Compass, Gauge, Magnet, RotateCw } from 'lucide-react';
import { MetricGrid, SegmentedControl } from '../../nlp-shared';

const rad = (degrees: number) => (degrees * Math.PI) / 180;
const wrapDeg = (degrees: number) => ((degrees + 180) % 360 + 360) % 360 - 180;
const clamp = (value: number, low: number, high: number) => Math.min(high, Math.max(low, value));

function RangeControl({ label, value, min, max, step = 1, unit, onChange }: { label: string; value: number; min: number; max: number; step?: number; unit: string; onChange: (value: number) => void }) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 flex items-center justify-between gap-3 text-xs font-semibold"><span>{label}</span><span className="shrink-0 font-mono">{value}{unit}</span></span>
      <input type="range" className="h-2 w-full cursor-pointer accent-violet-600" value={value} min={min} max={max} step={step} onChange={(event) => onChange(Number(event.target.value))} />
    </label>
  );
}

type FieldMode = 'measured' | 'model';
type Machine = 'synchronous' | 'induction';

export default function BlaschkeFieldOrientationLab() {
  const [mode, setMode] = useState<FieldMode>('model');
  const [machine, setMachine] = useState<Machine>('induction');
  const [fieldAngle, setFieldAngle] = useState(32);
  const [currentAngle, setCurrentAngle] = useState(108);
  const [current, setCurrent] = useState(18);
  const [detuning, setDetuning] = useState(24);
  const trueRelative = wrapDeg(currentAngle - fieldAngle);
  const modelError = mode === 'measured' ? detuning * 0.08 : detuning * (machine === 'induction' ? 0.72 : 0.22);
  const usedField = fieldAngle + modelError;
  const estimatedRelative = wrapDeg(currentAngle - usedField);
  const trueParallel = current * Math.cos(rad(trueRelative));
  const truePerpendicular = current * Math.sin(rad(trueRelative));
  const estimatedParallel = current * Math.cos(rad(estimatedRelative));
  const estimatedPerpendicular = current * Math.sin(rad(estimatedRelative));
  const coupling = Math.hypot(estimatedParallel - trueParallel, estimatedPerpendicular - truePerpendicular);
  const quality = clamp(100 - Math.abs(modelError) * 3.2, 0, 100);
  const cx = 150;
  const cy = 118;
  const radius = 82;
  const point = (angle: number, length: number) => ({ x: cx + Math.cos(rad(angle)) * radius * length, y: cy - Math.sin(rad(angle)) * radius * length });
  const fieldEnd = point(fieldAngle, 0.86);
  const usedEnd = point(usedField, 0.96);
  const currentEnd = point(currentAngle, 1);
  const qEnd = point(usedField + 90, 1.08);
  const dEnd = point(usedField, 1.08);
  const safe = Math.abs(modelError) < 5;

  return (
    <figure className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border bg-background">
      <figcaption className="grid min-w-0 gap-2 border-b border-border px-4 py-4 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-center">
        <span className="font-mono text-xs font-black text-violet-700 dark:text-violet-300">PRIMARY SOURCE LAB</span>
        <strong className="min-w-0 text-sm leading-snug">Field coordinate가 current channel을 어떻게 직접 보이게 하는가</strong>
        <span className={`text-xs font-black ${safe ? 'text-emerald-700 dark:text-emerald-300' : 'text-red-700 dark:text-red-300'}`}>{safe ? 'FIELD AXIS ALIGNED' : 'MODEL FIELD DETUNED'}</span>
      </figcaption>

      <div className="grid gap-5 p-4 sm:p-6 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)]">
        <div className="min-w-0 space-y-5">
          <SegmentedControl label="Field orientation source" value={mode} onChange={setMode} options={[{ value: 'measured', label: 'Original field measured' }, { value: 'model', label: 'Model field computed' }]} />
          <SegmentedControl label="Machine specialization" value={machine} onChange={setMachine} options={[{ value: 'synchronous', label: 'Synchronous' }, { value: 'induction', label: 'Induction' }]} />
          <RangeControl label="True field angle" value={fieldAngle} min={0} max={180} unit="°" onChange={setFieldAngle} />
          <RangeControl label="Stator-current angle" value={currentAngle} min={0} max={180} unit="°" onChange={setCurrentAngle} />
          <RangeControl label="Stator-current magnitude" value={current} min={2} max={30} unit=" A" onChange={setCurrent} />
          <RangeControl label="Sensor/model mismatch" value={detuning} min={0} max={45} unit="%" onChange={setDetuning} />
        </div>

        <div className="min-w-0 rounded-md border border-border bg-muted/[0.08] p-3">
          <svg viewBox="0 0 300 240" role="img" aria-label="True field, used field and stator current vectors" className="mx-auto block aspect-[300/240] w-full max-w-[32rem]">
            <circle cx={cx} cy={cy} r={radius} fill="none" className="stroke-border" strokeWidth="1" />
            <line x1="32" y1={cy} x2="268" y2={cy} className="stroke-border" strokeWidth="1" />
            <line x1={cx} y1="12" x2={cx} y2="224" className="stroke-border" strokeWidth="1" />
            <line x1={cx} y1={cy} x2={dEnd.x} y2={dEnd.y} stroke="#7c3aed" strokeWidth="1.2" strokeDasharray="5 4" />
            <line x1={cx} y1={cy} x2={qEnd.x} y2={qEnd.y} stroke="#8b5cf6" strokeWidth="1" strokeDasharray="2 5" />
            <line x1={cx} y1={cy} x2={fieldEnd.x} y2={fieldEnd.y} stroke="#2563eb" strokeWidth="2" strokeLinecap="round" />
            <circle cx={fieldEnd.x} cy={fieldEnd.y} r="3.5" fill="#2563eb" />
            {Math.abs(modelError) > 0.2 && <><line x1={cx} y1={cy} x2={usedEnd.x} y2={usedEnd.y} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5 4" /><circle cx={usedEnd.x} cy={usedEnd.y} r="3" fill="#f59e0b" /></>}
            <line x1={cx} y1={cy} x2={currentEnd.x} y2={currentEnd.y} stroke="#0f766e" strokeWidth="2.2" strokeLinecap="round" />
            <circle cx={currentEnd.x} cy={currentEnd.y} r="4" fill="#0f766e" />
            <text x={dEnd.x} y={dEnd.y} textAnchor="middle" className="fill-violet-700 text-[10px] font-bold">d</text>
            <text x={qEnd.x} y={qEnd.y} textAnchor="middle" className="fill-violet-700 text-[10px] font-bold">q</text>
            <circle cx={cx} cy={cy} r="3" className="fill-foreground" />
          </svg>
          <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 px-2 pb-3 text-[10px] font-semibold text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="h-0 w-4 border-t-2 border-blue-600" />원래 field</span>
            {Math.abs(modelError) > 0.2 && <span className="flex items-center gap-1.5"><span className="h-0 w-4 border-t-2 border-dashed border-amber-500" />제어에 쓴 field</span>}
            <span className="flex items-center gap-1.5"><span className="h-0 w-4 border-t-2 border-teal-700" />stator current</span>
            <span className="flex items-center gap-1.5"><span className="h-0 w-4 border-t border-dashed border-violet-500" />d-q 기준축</span>
          </div>
          <div className="grid gap-2 sm:grid-cols-3">
            {[
              { icon: Magnet, label: 'field-parallel', value: `${trueParallel.toFixed(1)} A` },
              { icon: RotateCw, label: 'perpendicular', value: `${truePerpendicular.toFixed(1)} A` },
              { icon: Activity, label: 'channel error', value: `${coupling.toFixed(1)} A` },
            ].map((item) => <div key={item.label} className="rounded-md border border-border bg-background p-3"><item.icon className="h-4 w-4 text-violet-600" /><p className="mt-2 text-[10px] font-black text-muted-foreground">{item.label}</p><p className="mt-1 font-mono text-sm font-bold">{item.value}</p></div>)}
          </div>
        </div>
      </div>

      <div className="border-t border-border px-4 py-4 sm:px-6">
        <div className="grid gap-2 sm:grid-cols-3">
          {[
            { index: '01', icon: Compass, label: 'field reference', note: mode === 'measured' ? 'actual field is observed' : 'field is reconstructed by model', ok: true },
            { index: '02', icon: RotateCw, label: 'coordinate transform', note: `rotate inputs by ${usedField.toFixed(1)}°`, ok: safe },
            { index: '03', icon: Gauge, label: 'direct channels', note: safe ? 'field and torque commands stay separated' : 'one command leaks into the other', ok: safe },
          ].map((item) => <div key={item.label} className={`min-w-0 rounded-md border p-3 ${item.ok ? 'border-border bg-muted/[0.1]' : 'border-red-500/30 bg-red-500/[0.04]'}`}><div className="flex items-center justify-between"><item.icon className="h-4 w-4 text-violet-600" /><span className="font-mono text-[10px] font-black text-muted-foreground">{item.index}</span></div><p className="mt-2 text-xs font-black">{item.label}</p><p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">{item.note}</p></div>)}
        </div>
      </div>

      <div className="border-t border-border p-4 sm:p-6"><MetricGrid mobileColumns={2} items={[
        { label: 'True field angle', value: `${fieldAngle.toFixed(0)}°` },
        { label: 'Used field angle', value: `${usedField.toFixed(1)}°` },
        { label: 'Orientation error', value: `${Math.abs(modelError).toFixed(1)}°` },
        { label: 'Decoupling quality', value: `${quality.toFixed(0)}%`, accent: safe },
      ]} /></div>
      <p className="border-t border-border px-4 py-3 text-[11px] leading-relaxed text-muted-foreground sm:px-6">교육용 재구성입니다. Thesis의 구조와 measured/model-field tradeoff를 현대적인 두 축 vector로 번역했으며, 원문 실험 data를 digitize한 그래프가 아닙니다.</p>
    </figure>
  );
}
