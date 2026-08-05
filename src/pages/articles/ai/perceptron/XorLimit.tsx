import { ArrowDown, ArrowRight } from 'lucide-react';
import Math from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { Misconception } from '@/components/learning/ArticleLearning';

const inputPoints = [
  { key: '00', x: 0, y: 0, target: 0 },
  { key: '01', x: 0, y: 1, target: 1 },
  { key: '10', x: 1, y: 0, target: 1 },
  { key: '11', x: 1, y: 1, target: 0 },
];

function PlotPoint({ x, y, label, target }: { x: number; y: number; label: string; target: number }) {
  return (
    <g>
      <circle cx={x} cy={y} r="13" fill={target ? '#0f766e' : 'var(--background)'} stroke={target ? '#0f766e' : '#e11d48'} strokeWidth="2" />
      <text x={x} y={y + 4} textAnchor="middle" fontSize="10" fontWeight="800" fill={target ? 'white' : '#be123c'}>{label}</text>
    </g>
  );
}

function XorRepresentationViz() {
  const x = (value: number) => 46 + value * 176;
  const y = (value: number) => 210 - value * 160;
  const hx = (value: number) => 46 + value * 88;
  const hy = (value: number) => 210 - value * 160;

  return (
    <figure className="not-prose my-8 overflow-hidden rounded-md border border-border" data-xor-representation>
      <figcaption className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3 !pr-24 sm:px-5">
        <span className="text-sm font-semibold">직선으로 섞인 입력을 은닉층이 분리 가능한 좌표로 다시 그린다</span>
        <span className="font-mono text-[10px] font-bold text-blue-700 dark:text-blue-300">INPUT → REPRESENTATION</span>
      </figcaption>
      <div className="grid items-stretch bg-border md:grid-cols-[minmax(0,1fr)_2.5rem_minmax(0,1fr)] md:gap-px">
        <div className="min-w-0 bg-background p-4 sm:p-5" data-xor-panel="input">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-sm font-bold">입력 공간 (x₁, x₂)</p>
            <p className="text-xs font-semibold text-rose-700 dark:text-rose-300">직선 하나로 분리 불가</p>
          </div>
          <svg viewBox="0 0 270 250" className="mx-auto mt-3 h-auto w-full max-w-sm" role="img" aria-label="XOR 입력 공간에서 대각선으로 섞인 두 클래스">
            <rect x="46" y="50" width="176" height="160" rx="7" fill="var(--background)" stroke="var(--border)" />
            <line x1="46" y1="210" x2="235" y2="210" stroke="var(--muted-foreground)" strokeWidth="1" />
            <line x1="46" y1="220" x2="46" y2="38" stroke="var(--muted-foreground)" strokeWidth="1" />
            <line x1="62" y1="210" x2="206" y2="50" stroke="#c76a08" strokeWidth="1.25" strokeDasharray="5 5" opacity="0.78" />
            <text x="139" y="127" textAnchor="middle" fontSize="11" fontWeight="700" fill="#9a4f06">후보 직선 · 두 class가 양쪽에 섞임</text>
            {inputPoints.map((point) => <PlotPoint key={point.key} x={x(point.x)} y={y(point.y)} label={point.key} target={point.target} />)}
            <text x="238" y="229" fontSize="11" fontWeight="700" fill="var(--muted-foreground)">x₁</text>
            <text x="28" y="40" fontSize="11" fontWeight="700" fill="var(--muted-foreground)">x₂</text>
          </svg>
        </div>

        <div className="flex min-h-12 items-center justify-center bg-background text-muted-foreground" aria-hidden="true" data-xor-flow-arrow>
          <ArrowDown className="h-4 w-4 md:hidden" data-arrow-down />
          <span className="hidden h-px flex-1 bg-border md:block" />
          <ArrowRight className="hidden h-4 w-4 shrink-0 md:block" data-arrow-right />
        </div>

        <div className="min-w-0 bg-background p-4 sm:p-5" data-xor-panel="hidden">
          <div className="flex items-baseline justify-between gap-3">
            <p className="text-sm font-bold">은닉 공간 (h₁, h₂)</p>
            <p className="text-xs font-semibold text-teal-700 dark:text-teal-300">출력층 직선으로 분리</p>
          </div>
          <svg viewBox="0 0 270 250" className="mx-auto mt-3 h-auto w-full max-w-sm" role="img" aria-label="은닉 특징 공간에서 직선으로 분리되는 XOR">
            <rect x="46" y="50" width="176" height="160" rx="7" fill="var(--background)" stroke="var(--border)" />
            <polygon points={`${hx(0.5)},${hy(0)} ${hx(2)},${hy(0.75)} ${hx(2)},${hy(0)} `} fill="color-mix(in oklch, #0f766e 13%, var(--background))" />
            <line x1="46" y1="210" x2="235" y2="210" stroke="var(--muted-foreground)" strokeWidth="1" />
            <line x1="46" y1="220" x2="46" y2="38" stroke="var(--muted-foreground)" strokeWidth="1" />
            <line x1={hx(0.5)} y1={hy(0)} x2={hx(2)} y2={hy(0.75)} stroke="#c76a08" strokeWidth="2" strokeLinecap="round" />
            <text x="158" y="78" textAnchor="middle" fontSize="11" fontWeight="700" fill="#9a4f06">h₁−2h₂=0.5</text>
            <PlotPoint x={hx(0)} y={hy(0)} label="00" target={0} />
            <PlotPoint x={hx(1)} y={hy(0)} label="1" target={1} />
            <text x={hx(1)} y={hy(0) + 29} textAnchor="middle" fontSize="10" fontWeight="700" fill="var(--muted-foreground)">01 · 10</text>
            <PlotPoint x={hx(2)} y={hy(1)} label="11" target={0} />
            <text x="238" y="229" fontSize="11" fontWeight="700" fill="var(--muted-foreground)">h₁</text>
            <text x="28" y="40" fontSize="11" fontWeight="700" fill="var(--muted-foreground)">h₂</text>
          </svg>
        </div>
      </div>
      <div className="grid gap-px border-t border-border bg-border sm:grid-cols-3">
        <div className="bg-background px-4 py-3"><p className="text-[10px] font-semibold text-muted-foreground">00</p><p className="mt-1 text-xs font-bold">(0,0) → (0,0)</p></div>
        <div className="bg-background px-4 py-3"><p className="text-[10px] font-semibold text-muted-foreground">01 · 10</p><p className="mt-1 text-xs font-bold">서로 다른 두 입력 → (1,0)</p></div>
        <div className="bg-background px-4 py-3"><p className="text-[10px] font-semibold text-muted-foreground">11</p><p className="mt-1 text-xs font-bold">(1,1) → (2,1)</p></div>
      </div>
    </figure>
  );
}

export default function XorLimit() {
  return (
    <section id="xor-limit" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">XOR은 왜 직선 하나로 나눌 수 없을까?</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          XOR은 두 입력이 다를 때만 1이다. 좌표평면에서 양성 점 (0,1), (1,0)은 대각선으로 떨어져 있고 음성 점 (0,0),
          (1,1)이 그 사이를 차지한다. 어떤 직선을 그어도 두 양성 점만 같은 쪽에 놓고 두 음성 점을 반대쪽에 놓을 수 없다.
          따라서 단일 퍼셉트론의 파라미터를 아무리 학습해도 loss가 0인 분류 경계는 존재하지 않는다.
        </p>
      </div>

      <XorRepresentationViz />

      <div className="not-prose my-5 grid gap-2 sm:grid-cols-3">
        <div className="min-w-0 rounded-md border border-border bg-muted/15 p-3"><Math display className="my-0 text-sm">{String.raw`\underbrace{h_1}_{\text{합 특징}}=\operatorname{ReLU}(x_1+x_2)`}</Math></div>
        <div className="min-w-0 rounded-md border border-border bg-muted/15 p-3"><Math display className="my-0 text-sm">{String.raw`\underbrace{h_2}_{\text{둘 다 1 보정}}=\operatorname{ReLU}(x_1+x_2-1)`}</Math></div>
        <div className="min-w-0 rounded-md border border-border bg-muted/15 p-3"><Math display className="my-0 text-sm">{String.raw`\underbrace{\hat{y}}_{\text{XOR 출력}}=h_1-2h_2`}</Math></div>
      </div>
      <FormulaNote
        meaning="은닉층이 입력을 h₁, h₂라는 새 좌표로 바꾸면 출력층의 선형 결합으로 XOR을 표현할 수 있다. 다층 신경망의 핵심은 입력 공간에서 불가능한 경계를 유용한 표현 공간에서 가능하게 만드는 것이다."
        symbols={[
          [String.raw`h_1`, '두 입력의 합이 양수인 정도'],
          [String.raw`h_2`, '두 입력이 모두 1일 때 활성화되는 보정 특징'],
          [String.raw`\operatorname{ReLU}`, '음수는 0, 양수는 그대로 통과시키는 비선형 함수'],
          [String.raw`h_1-2h_2`, '두 입력이 다를 때만 1이 되는 출력 조합'],
        ]}
      />

      <Misconception>
        XOR 한계는 “퍼셉트론이 아무것도 못 한다”는 뜻이 아니다. 단일 선형 경계로 분리할 수 없는 문제를 해결하려면 특징 변환이나 여러 층이 필요하다는 정확한 경계다.
      </Misconception>
    </section>
  );
}
