import { useState } from 'react';
import Math from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';

const gates = {
  AND: { w1: 1, w2: 1, b: -1.5, label: '둘 다 1일 때만 양성', line: [[0.5, 1], [1, 0.5]] },
  OR: { w1: 1, w2: 1, b: -0.5, label: '하나라도 1이면 양성', line: [[0, 0.5], [0.5, 0]] },
  NAND: { w1: -1, w2: -1, b: 1.5, label: '둘 다 1일 때만 음성', line: [[0.5, 1], [1, 0.5]] },
};

const points = [[0, 0], [0, 1], [1, 0], [1, 1]] as const;

function GateBoundaryViz() {
  const [name, setName] = useState<keyof typeof gates>('AND');
  const gate = gates[name];
  const toX = (x: number) => 50 + x * 220;
  const toY = (y: number) => 240 - y * 190;
  const predict = (x1: number, x2: number) => gate.w1 * x1 + gate.w2 * x2 + gate.b >= 0 ? 1 : 0;
  const positiveRegion = name === 'AND'
    ? [[0.5, 1], [1, 0.5], [1, 1]]
    : name === 'OR'
      ? [[0, 0.5], [0.5, 0], [1, 0], [1, 1], [0, 1]]
      : [[0, 0], [1, 0], [1, 0.5], [0.5, 1], [0, 1]];

  return (
    <div className="foundation-viz-explorer not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="grid grid-cols-3 border-b border-border bg-muted/20" role="tablist" aria-label="논리 게이트 결정 경계">
        {(Object.keys(gates) as Array<keyof typeof gates>).map((gateName) => (
          <button key={gateName} type="button" role="tab" aria-selected={name === gateName} onClick={() => setName(gateName)} className={`min-h-11 border-b-2 px-3 text-sm font-semibold ${name === gateName ? 'border-foreground bg-background' : 'border-transparent text-muted-foreground hover:bg-background/70'}`}>{gateName}</button>
        ))}
      </div>
      <div className="grid gap-5 p-4 sm:grid-cols-[minmax(0,1fr)_13rem] sm:items-center sm:p-6">
        <svg viewBox="0 0 340 286" className="mx-auto h-auto w-full max-w-md" role="img" aria-label={`${name} 퍼셉트론의 결정 경계`}>
          <rect x="50" y="50" width="220" height="190" rx="8" fill="color-mix(in oklch, #e11d48 7%, var(--background))" stroke="color-mix(in oklch, #e11d48 22%, var(--border))" />
          <polygon points={positiveRegion.map(([x, y]) => `${toX(x)},${toY(y)}`).join(' ')} fill="color-mix(in oklch, #0f766e 16%, var(--background))" />
          {[0.25, 0.5, 0.75].map((value) => <line key={`x-${value}`} x1={toX(value)} y1="50" x2={toX(value)} y2="240" stroke="var(--border)" strokeOpacity="0.45" strokeWidth="0.75" strokeDasharray="2 6" />)}
          {[0.25, 0.5, 0.75].map((value) => <line key={`y-${value}`} x1="50" y1={toY(value)} x2="270" y2={toY(value)} stroke="var(--border)" strokeOpacity="0.45" strokeWidth="0.75" strokeDasharray="2 6" />)}
          <line x1="50" y1="240" x2="282" y2="240" stroke="var(--muted-foreground)" strokeWidth="1" />
          <line x1="50" y1="250" x2="50" y2="40" stroke="var(--muted-foreground)" strokeWidth="1" />
          <line x1={toX(gate.line[0][0])} y1={toY(gate.line[0][1])} x2={toX(gate.line[1][0])} y2={toY(gate.line[1][1])} stroke="#c76a08" strokeWidth="2.25" strokeLinecap="round" />
          {points.map(([x1, x2]) => {
            const y = predict(x1, x2);
            return <g key={`${x1}-${x2}`}><circle cx={toX(x1)} cy={toY(x2)} r="10.5" fill={y ? '#0f766e' : 'var(--background)'} stroke={y ? '#0f766e' : '#e11d48'} strokeWidth="2" /><text x={toX(x1)} y={toY(x2) + 4} textAnchor="middle" fontSize="11" fontWeight="800" fill={y ? 'white' : '#be123c'}>{y}</text><text x={toX(x1) + (x1 ? -13 : 13)} y={toY(x2) + (x2 ? -12 : 18)} textAnchor={x1 ? 'end' : 'start'} fontSize="10.5" fill="var(--muted-foreground)">({x1},{x2})</text></g>;
          })}
          <text x="282" y="262" fontSize="12" fontWeight="700" fill="var(--muted-foreground)">x₁</text>
          <text x="31" y="43" fontSize="12" fontWeight="700" fill="var(--muted-foreground)">x₂</text>
          <text x="160" y="25" textAnchor="middle" fontSize="12" fontWeight="800" fill="#9a4f06">score = 0 · decision boundary</text>
          <text x="235" y="75" textAnchor="middle" fontSize="11" fontWeight="700" fill="#0f766e">score ≥ 0</text>
          <text x="90" y="219" textAnchor="middle" fontSize="11" fontWeight="700" fill="#be123c">score &lt; 0</text>
        </svg>
        <div className="min-w-0 border-t border-border pt-4 sm:border-l sm:border-t-0 sm:py-2 sm:pl-5">
          <p className="text-xs font-semibold text-muted-foreground">{name} 파라미터</p>
          <dl className="mt-3 space-y-2 font-mono text-sm"><div className="flex justify-between"><dt>w₁</dt><dd>{gate.w1}</dd></div><div className="flex justify-between"><dt>w₂</dt><dd>{gate.w2}</dd></div><div className="flex justify-between"><dt>b</dt><dd>{gate.b}</dd></div></dl>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{gate.label}</p>
          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 text-xs text-muted-foreground"><span className="h-2.5 w-2.5 rounded-full bg-teal-700" /> 예측 1 <span className="h-2.5 w-2.5 rounded-full border border-rose-600" /> 예측 0</div>
        </div>
      </div>
    </div>
  );
}

export default function DecisionBoundary() {
  return (
    <section id="decision-boundary" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">Weight와 bias는 경계를 어떻게 움직일까?</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          입력 특징이 두 개라면 score가 정확히 0인 점들이 직선을 만든다. 직선 위에서는 두 클래스의 결정이 바뀌고,
          직선의 한쪽은 예측 1, 다른 쪽은 예측 0이 된다. Weight의 비율은 경계의 기울기를, bias는 경계의 위치를 바꾼다.
        </p>
      </div>
      <GateBoundaryViz />
      <Math display>{String.raw`
\underbrace{w_1x_1+w_2x_2}_{\text{입력 위치에 따른 score}}
+
\underbrace{b}_{\text{경계의 평행 이동}}
=0
`}</Math>
      <FormulaNote
        meaning="두 입력 특징에서 score가 0이 되는 모든 점의 집합이 결정 경계다. 입력 차원이 세 개면 평면, 더 높으면 hyperplane이 된다."
        symbols={[
          [String.raw`w_1,w_2`, '경계의 방향과 기울기를 정하는 weight'],
          [String.raw`b`, '경계를 평행 이동시키는 bias'],
          [String.raw`s>0`, '예측 1이 되는 경계의 한쪽'],
          [String.raw`s<0`, '예측 0이 되는 경계의 다른 쪽'],
        ]}
      />
    </section>
  );
}
