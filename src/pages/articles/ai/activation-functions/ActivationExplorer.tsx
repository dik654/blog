import { useState } from 'react';
import FormulaNote from '@/components/ui/formula-note';

type FnKey = 'sigmoid' | 'tanh' | 'relu' | 'silu';

const definitions: Record<FnKey, {
  label: string;
  range: [number, number];
  fn: (x: number) => number;
  derivative: (x: number) => number;
  note: string;
}> = {
  sigmoid: { label: 'Sigmoid', range: [-0.2, 1.2], fn: (x) => 1 / (1 + Math.exp(-x)), derivative: (x) => { const y = 1 / (1 + Math.exp(-x)); return y * (1 - y); }, note: '출력이 0~1이라 gate와 binary 확률에 유용하지만 |z|가 크면 gradient가 0에 가까워진다.' },
  tanh: { label: 'Tanh', range: [-1.2, 1.2], fn: (x) => Math.tanh(x), derivative: (x) => 1 - Math.tanh(x) ** 2, note: '출력이 -1~1이고 0 중심이지만 양끝에서 sigmoid처럼 포화한다.' },
  relu: { label: 'ReLU', range: [-1, 8], fn: (x) => Math.max(0, x), derivative: (x) => x > 0 ? 1 : 0, note: '양수 영역의 gradient가 1이라 단순하고 빠르지만 음수 영역은 0이다.' },
  silu: { label: 'SiLU', range: [-1.5, 8], fn: (x) => x / (1 + Math.exp(-x)), derivative: (x) => { const s = 1 / (1 + Math.exp(-x)); return s + x * s * (1 - s); }, note: 'ReLU를 부드럽게 만든 형태로 음수 영역도 작은 신호를 전달한다.' },
};

function CurveExplorer() {
  const [fnKey, setFnKey] = useState<FnKey>('relu');
  const [input, setInput] = useState(1);
  const def = definitions[fnKey];
  const width = 600;
  const height = 260;
  const plot = { left: 44, right: 580, top: 24, bottom: 220 };
  const xToPx = (x: number) => plot.left + ((x + 8) / 16) * (plot.right - plot.left);
  const yToPx = (y: number) => plot.bottom - ((y - def.range[0]) / (def.range[1] - def.range[0])) * (plot.bottom - plot.top);
  const curvePath = Array.from({ length: 161 }, (_, i) => {
    const x = -8 + i * 0.1;
    return `${i === 0 ? 'M' : 'L'} ${xToPx(x).toFixed(2)} ${yToPx(def.fn(x)).toFixed(2)}`;
  }).join(' ');
  const output = def.fn(input);
  const derivative = def.derivative(input);
  const zone = fnKey === 'relu'
    ? { x: plot.left, width: xToPx(0) - plot.left, label: 'dead zone' }
    : fnKey === 'sigmoid' || fnKey === 'tanh'
      ? { x: plot.left, width: xToPx(-4) - plot.left, label: 'saturation' }
      : null;

  return (
    <div className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="grid grid-cols-2 border-b border-border bg-muted/20 sm:grid-cols-4" role="tablist" aria-label="활성화 함수 선택">
        {(Object.keys(definitions) as FnKey[]).map((key) => <button key={key} type="button" role="tab" aria-selected={fnKey === key} onClick={() => setFnKey(key)} className={`min-h-11 border-b-2 px-2 text-xs font-semibold sm:text-sm ${fnKey === key ? 'border-foreground bg-background' : 'border-transparent text-muted-foreground hover:bg-background/70'}`}>{definitions[key].label}</button>)}
      </div>
      <div className="grid gap-5 p-4 lg:grid-cols-[minmax(0,1fr)_14rem] lg:items-center lg:p-6">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full" role="img" aria-label={`${def.label} 함수 곡선과 현재 입력`}>
          {zone && <><rect x={zone.x} y={plot.top} width={zone.width} height={plot.bottom - plot.top} rx="5" fill="color-mix(in oklch, #e11d48 5%, var(--background))" /><line x1={zone.x + zone.width} y1={plot.top} x2={zone.x + zone.width} y2={plot.bottom} stroke="#e11d48" strokeOpacity="0.28" strokeWidth="1" /><text x={zone.x + zone.width / 2} y={plot.top + 17} textAnchor="middle" fontSize="11" fontWeight="700" fill="#a8173b">{zone.label}</text></>}
          {(fnKey === 'sigmoid' || fnKey === 'tanh') && <><rect x={xToPx(4)} y={plot.top} width={plot.right - xToPx(4)} height={plot.bottom - plot.top} rx="5" fill="color-mix(in oklch, #e11d48 5%, var(--background))" /><line x1={xToPx(4)} y1={plot.top} x2={xToPx(4)} y2={plot.bottom} stroke="#e11d48" strokeOpacity="0.28" strokeWidth="1" /><text x={(xToPx(4) + plot.right) / 2} y={plot.top + 17} textAnchor="middle" fontSize="11" fontWeight="700" fill="#a8173b">saturation</text></>}
          {[-4, 0, 4].map((value) => <g key={value}><line x1={xToPx(value)} y1={plot.top} x2={xToPx(value)} y2={plot.bottom} stroke="var(--border)" strokeWidth="0.75" strokeDasharray="2 6" /><text x={xToPx(value)} y="246" textAnchor="middle" fontSize="11" fill="var(--muted-foreground)">{value}</text></g>)}
          <line x1={plot.left} y1={yToPx(0)} x2={plot.right} y2={yToPx(0)} stroke="var(--border)" />
          <line x1={xToPx(0)} y1={plot.top} x2={xToPx(0)} y2={plot.bottom} stroke="var(--border)" />
          <path d={curvePath} fill="none" stroke="#058c67" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          <line x1={xToPx(input)} y1={plot.top} x2={xToPx(input)} y2={plot.bottom} stroke="#7c3aed" strokeWidth="1.25" strokeDasharray="4 5" />
          <circle cx={xToPx(input)} cy={yToPx(output)} r="5.5" fill="#7c3aed" stroke="var(--background)" strokeWidth="2" />
          <text x={Math.min(plot.right - 26, xToPx(input) + 9)} y={plot.top + 14} fontSize="11" fontWeight="700" fill="#6d28d9">z={input.toFixed(1)}</text>
          <text x={plot.left} y="246" fontSize="11" fill="var(--muted-foreground)">-8</text><text x={plot.right} y="246" textAnchor="end" fontSize="11" fill="var(--muted-foreground)">8</text>
        </svg>
        <div className="min-w-0 border-t border-border pt-4 lg:border-l lg:border-t-0 lg:py-2 lg:pl-5">
          <label className="block text-xs font-semibold text-muted-foreground" htmlFor="activation-input">입력 z · {input.toFixed(1)}</label>
          <input id="activation-input" type="range" min="-8" max="8" step="0.1" value={input} onChange={(event) => setInput(Number(event.target.value))} className="mt-3 w-full accent-foreground" />
          <dl className="mt-5 grid grid-cols-2 gap-4 lg:grid-cols-1">
            <div className="border-l-2 border-emerald-600 pl-3"><dt className="text-xs text-muted-foreground">출력 φ(z)</dt><dd className="mt-1 font-mono text-base font-bold">{output.toFixed(4)}</dd></div>
            <div className="border-l-2 border-violet-600 pl-3"><dt className="text-xs text-muted-foreground">도함수 φ′(z)</dt><dd className="mt-1 font-mono text-base font-bold">{derivative.toFixed(4)}</dd></div>
          </dl>
          <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{def.note}</p>
        </div>
      </div>
    </div>
  );
}

export default function ActivationExplorer() {
  return (
    <section id="function-and-gradient" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">출력 곡선과 gradient를 함께 보면 무엇이 보일까?</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          Forward에서는 함수값 φ(z)가 다음 층으로 전달되고, backward에서는 같은 위치의 도함수 φ′(z)가 upstream gradient에
          곱해진다. 따라서 곡선의 모양만 비교하면 절반만 보는 셈이다. 입력 slider를 양끝으로 움직여 출력과 도함수가 함께
          어떻게 변하는지 확인해 보자.
        </p>
      </div>
      <CurveExplorer />
      <FormulaNote
        meaning="활성화 함수는 forward 값과 backward 도함수를 한 쌍으로 가진다. 도함수가 0에 가까운 구간을 여러 층이 연속해서 통과하면 앞층으로 가는 gradient가 빠르게 작아진다."
        symbols={[
          ['z', '선형층이 만든 pre-activation'],
          ['φ(z)', '다음 층으로 전달하는 activation'],
          ["φ′(z)", 'backward에서 upstream gradient에 곱하는 local derivative'],
          ['포화', '입력이 변해도 출력이 거의 변하지 않아 도함수가 0에 가까운 영역'],
        ]}
      />
    </section>
  );
}
