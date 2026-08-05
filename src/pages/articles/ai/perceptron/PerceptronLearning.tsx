import { useState } from 'react';
import Math from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';

const learningSteps = [
  {
    id: 'start',
    label: '0. 시작',
    values: [['x', '[-1,1]'], ['w⁰', '[0.2,-0.4]'], ['b⁰', '0'], ['score⁰', '-0.6']],
    text: 'score가 음수라 ŷ=0이지만 정답은 y=1이다. 첫 업데이트가 필요하다.',
    equation: String.raw`0.2x_1-0.4x_2=0`,
    line: [-1.2, -0.6, 1.2, 0.6],
    result: '오분류 · update 필요',
    tone: '#64748b',
  },
  {
    id: 'update-1',
    label: '1. Update',
    values: [['y-ŷ', '1'], ['w¹', '[0.1,-0.3]'], ['b¹', '0.1'], ['score¹', '-0.3']],
    text: 'η=0.1로 한 번 수정했지만 score는 아직 음수다. 새 경계에서도 같은 샘플은 0으로 분류된다.',
    equation: String.raw`0.1x_1-0.3x_2+0.1=0`,
    line: [-1.2, -0.0667, 1.2, 0.7333],
    result: '아직 오분류 · 한 번 더',
    tone: '#d97706',
  },
  {
    id: 'update-2',
    label: '2. Update',
    values: [['y-ŷ', '1'], ['w²', '[0,-0.2]'], ['b²', '0.2'], ['score²', '0']],
    text: '같은 규칙으로 두 번째 수정하면 score가 0에 도달해 ŷ=1이 된다. 이제 이 샘플에서는 update를 멈춘다.',
    equation: String.raw`-0.2x_2+0.2=0`,
    line: [-1.2, 1, 1.2, 1],
    result: '정답 · 이 샘플은 종료',
    tone: '#0f766e',
  },
] as const;

function LearningRuleViz() {
  const [activeId, setActiveId] = useState<(typeof learningSteps)[number]['id']>('start');
  const active = learningSteps.find((step) => step.id === activeId) ?? learningSteps[0];
  const toX = (x: number) => 50 + ((x + 1.2) / 2.4) * 260;
  const toY = (y: number) => 225 - ((y + 1.2) / 2.4) * 190;

  return (
    <div className="not-prose my-8 overflow-hidden rounded-md border border-border" data-boundary-redraw data-formula-pair>
      <div className="grid grid-cols-3 border-b border-border bg-muted/20" role="tablist" aria-label="퍼셉트론 학습 단계">
        {learningSteps.map((step) => <button key={step.id} type="button" role="tab" aria-selected={activeId === step.id} onClick={() => setActiveId(step.id)} className={`min-h-11 border-b-2 px-2 text-xs font-semibold sm:text-sm ${activeId === step.id ? 'border-foreground bg-background' : 'border-transparent text-muted-foreground hover:bg-background/70'}`}>{step.label}</button>)}
      </div>
      <dl className="grid grid-cols-2 gap-px bg-border sm:grid-cols-4">
        {active.values.map(([key, value]) => <div key={key} className="bg-background p-4 text-center"><dt className="text-xs text-muted-foreground">{key}</dt><dd className="mt-1 font-mono text-sm font-bold">{value}</dd></div>)}
      </dl>

      <div className="grid min-w-0 gap-px border-t border-border bg-border sm:grid-cols-[minmax(0,1fr)_15rem]">
        <div className="min-w-0 bg-background p-3 sm:p-5">
          <svg viewBox="0 0 360 260" className="mx-auto h-auto w-full max-w-lg" role="img" aria-label="두 번의 퍼셉트론 업데이트로 다시 그려지는 결정 경계">
            <rect x="50" y="35" width="260" height="190" rx="6" fill="color-mix(in oklch, var(--muted) 28%, var(--background))" stroke="var(--border)" />
            {[-0.8, -0.4, 0.4, 0.8].map((value) => (
              <g key={value}>
                <line x1={toX(value)} y1="35" x2={toX(value)} y2="225" stroke="var(--border)" strokeWidth="0.75" strokeDasharray="2 6" />
                <line x1="50" y1={toY(value)} x2="310" y2={toY(value)} stroke="var(--border)" strokeWidth="0.75" strokeDasharray="2 6" />
              </g>
            ))}
            <line x1={toX(0)} y1="35" x2={toX(0)} y2="230" stroke="var(--muted-foreground)" strokeWidth="1" />
            <line x1="45" y1={toY(0)} x2="315" y2={toY(0)} stroke="var(--muted-foreground)" strokeWidth="1" />
            {learningSteps.map((step) => (
              <line
                key={step.id}
                data-boundary-line={step.id}
                x1={toX(step.line[0])}
                y1={toY(step.line[1])}
                x2={toX(step.line[2])}
                y2={toY(step.line[3])}
                stroke={step.tone}
                strokeWidth={activeId === step.id ? 3 : 1.5}
                strokeOpacity={activeId === step.id ? 1 : 0.28}
                strokeDasharray={activeId === step.id ? undefined : '5 6'}
                strokeLinecap="round"
              />
            ))}
            <circle cx={toX(-1)} cy={toY(1)} r="9" fill="#2563eb" stroke="var(--background)" strokeWidth="3" />
            <text x={toX(-1) + 13} y={toY(1) - 10} fontSize="12" fontWeight="700" fill="#1d4ed8">학습 샘플 (−1,1), y=1</text>
            <text x="314" y={toY(0) + 18} fontSize="12" fontWeight="700" fill="var(--muted-foreground)">x₁</text>
            <text x={toX(0) + 8} y="30" fontSize="12" fontWeight="700" fill="var(--muted-foreground)">x₂</text>
          </svg>
        </div>
        <div className="min-w-0 bg-muted/[0.08] p-4 sm:p-5">
          <p className="text-xs font-bold text-muted-foreground">현재 다시 그린 경계</p>
          <Math display className="my-4 text-sm">{active.equation}</Math>
          <p className="text-xs font-semibold" style={{ color: active.tone }}>{active.result}</p>
          <div className="mt-5 space-y-2 border-t border-border pt-4 text-xs leading-relaxed text-muted-foreground">
            {learningSteps.map((step, index) => (
              <button
                key={step.id}
                type="button"
                onClick={() => setActiveId(step.id)}
                className="flex w-full items-center gap-2 text-left"
                aria-label={`${step.label} 경계 보기`}
              >
                <span className="h-0.5 w-6 shrink-0" style={{ backgroundColor: step.tone, opacity: activeId === step.id ? 1 : 0.35 }} />
                <span className={activeId === step.id ? 'font-semibold text-foreground' : ''}>{index === 0 ? '초기 경계' : `${index}차 update 경계`}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <p
        className="border-t border-border px-4 py-4 text-sm leading-relaxed text-muted-foreground"
        data-formula-note
      >
        {active.text}
      </p>
    </div>
  );
}

export default function PerceptronLearning() {
  return (
    <section id="learning-rule" className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">퍼셉트론은 틀린 샘플에서 어떻게 배울까?</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          학습 데이터 하나를 예측하고 정답과 다를 때만 weight와 bias를 수정한다. 양성 샘플을 0으로 틀렸다면 입력 벡터
          방향으로 weight를 늘리고, 음성 샘플을 1로 틀렸다면 반대 방향으로 줄인다. 올바르게 분류한 샘플은 수정하지 않는다.
        </p>
        <p>
          아래 예제는 한 번 수정하면 곧바로 끝나는 쉬운 숫자를 피한다. 같은 양성 샘플 <Math>{String.raw`x=[-1,1]`}</Math>의
          score가 <Math>{String.raw`-0.6\rightarrow-0.3\rightarrow0`}</Math>으로 바뀌는 두 번의 update를 따라가며,
          파라미터가 바뀔 때마다 score=0 직선도 반드시 다시 그린다.
        </p>
      </div>
      <LearningRuleViz />
      <div className="not-prose my-5 grid gap-2 sm:grid-cols-2">
        <div className="min-w-0 rounded-md border border-border bg-muted/15 p-3"><Math display className="my-0 text-sm sm:text-base">{String.raw`w'=w+\underbrace{\eta(y-\hat{y})x}_{\text{틀린 샘플 방향으로 수정}}`}</Math></div>
        <div className="min-w-0 rounded-md border border-border bg-muted/15 p-3"><Math display className="my-0 text-sm sm:text-base">{String.raw`b'=b+\underbrace{\eta(y-\hat{y})}_{\text{경계 위치 수정}}`}</Math></div>
      </div>
      <FormulaNote
        meaning="예측 오차의 부호에 따라 입력 방향으로 weight를 더하거나 뺀다. 학습률 η는 한 번의 오분류가 경계를 얼마나 움직일지 정한다."
        symbols={[
          [String.raw`y-\hat{y}`, '양성 누락이면 +1, 음성 오탐이면 -1, 정답이면 0'],
          [String.raw`x`, '틀린 샘플이 놓인 특징 방향'],
          [String.raw`\eta`, '업데이트 크기를 조절하는 양수 learning rate'],
          [String.raw`w',b'`, '오분류를 반영한 새 파라미터'],
        ]}
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>언제 수렴할까?</h3>
        <p>
          데이터가 하나의 직선 또는 hyperplane으로 완전히 분리 가능하면 퍼셉트론 학습은 유한한 업데이트 뒤 분리 경계를
          찾는다는 수렴 정리가 있다. 분리할 수 없는 데이터에서는 오분류가 계속 남아 파라미터가 진동할 수 있다. 이 한계가
          다음 XOR 문제에서 드러난다.
        </p>
      </div>
    </section>
  );
}
