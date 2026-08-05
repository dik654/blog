import { useState } from 'react';
import Math from '@/components/ui/math';
import FormulaNote from '@/components/ui/formula-note';
import { CapabilityCheck } from '@/components/learning/ArticleLearning';

const stages = [
  {
    id: 'forward',
    label: '1. 순전파',
    tex: [String.raw`\hat{y}=wx+b=1\cdot2+0=2`],
    result: '현재 모델은 입력 2에 대해 2를 예측한다. 정답 5보다 작다.',
    values: [['입력 x', '2'], ['정답 y', '5'], ['가중치 w', '1.0'], ['편향 b', '0.0']],
  },
  {
    id: 'loss',
    label: '2. 손실',
    tex: [String.raw`\mathcal{L}=\frac{1}{2}(\hat{y}-y)^2=\frac{1}{2}(2-5)^2=4.5`],
    result: '예측 차이를 제곱해 부호를 없애고 하나의 오차 숫자로 만든다.',
    values: [['예측 ŷ', '2'], ['정답 y', '5'], ['오차 ŷ-y', '-3'], ['손실 L', '4.5']],
  },
  {
    id: 'gradient',
    label: '3. 기울기',
    tex: [String.raw`\frac{\partial\mathcal{L}}{\partial w}=(\hat{y}-y)x=-6`, String.raw`\frac{\partial\mathcal{L}}{\partial b}=\hat{y}-y=-3`],
    result: '두 기울기가 음수이므로 w와 b를 키우면 이 예제의 손실이 줄어든다.',
    values: [['오차 신호', '-3'], ['입력 x', '2'], ['∂L/∂w', '-6'], ['∂L/∂b', '-3']],
  },
  {
    id: 'update',
    label: '4. 업데이트',
    tex: [String.raw`w'=1-0.1(-6)=1.6`, String.raw`b'=0-0.1(-3)=0.3`],
    result: "새 예측은 1.6×2+0.3=3.5다. 한 번의 업데이트로 정답 5에 가까워졌다.",
    values: [['학습률 η', '0.1'], ['새 w', '1.6'], ['새 b', '0.3'], ['새 예측', '3.5']],
  },
];

function LearningLoopViz() {
  const [activeId, setActiveId] = useState(stages[0].id);
  const active = stages.find((stage) => stage.id === activeId) ?? stages[0];

  return (
    <div className="not-prose my-8 overflow-hidden rounded-md border border-border">
      <div className="grid grid-cols-2 border-b border-border bg-muted/20 sm:grid-cols-4" role="tablist" aria-label="학습 단계">
        {stages.map((stage) => (
          <button
            key={stage.id}
            type="button"
            role="tab"
            aria-selected={stage.id === active.id}
            onClick={() => setActiveId(stage.id)}
            className={`min-h-11 border-b-2 px-2 py-2 text-xs font-semibold transition-colors sm:text-sm ${stage.id === active.id ? 'border-foreground bg-background text-foreground' : 'border-transparent text-muted-foreground hover:bg-background/70 hover:text-foreground'}`}
          >
            {stage.label}
          </button>
        ))}
      </div>
      <div className="p-4 sm:p-6">
        <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-md border border-border bg-border sm:grid-cols-4">
          {active.values.map(([label, value]) => (
            <div key={label} className="min-w-0 bg-background px-3 py-3 text-center">
              <dt className="text-[11px] text-muted-foreground">{label}</dt>
              <dd className="mt-1 font-mono text-sm font-bold">{value}</dd>
            </div>
          ))}
        </dl>
        <div className={`mt-5 grid min-w-0 gap-2 ${active.tex.length > 1 ? 'sm:grid-cols-2' : ''}`}>
          {active.tex.map((tex) => (
            <div key={tex} className="min-w-0 rounded-md bg-muted/20 px-2 py-3 sm:px-4">
              <Math display className="my-0 text-sm sm:text-base">{tex}</Math>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{active.result}</p>
      </div>
    </div>
  );
}

export default function LearningLoop() {
  return (
    <section id="learning-loop" data-formula-pair className="mb-16 scroll-mt-20">
      <h2 className="mb-6 text-2xl font-bold">한 번의 학습에서는 실제로 무슨 일이 일어날까?</h2>
      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <p>
          가장 작은 예제로 학습의 한 바퀴를 계산해 보자. 모델은 입력 하나를 받는 직선 <strong>ŷ = wx + b</strong>이고,
          입력 2의 정답은 5라고 하자. 시작 파라미터는 w=1, b=0이다. 아래 탭을 순서대로 누르면 같은 숫자가
          순전파, 손실, 기울기, 업데이트에서 어떤 역할로 바뀌는지 볼 수 있다.
        </p>
      </div>

      <LearningLoopViz />
      <FormulaNote
        meaning="이 계산은 한 데이터와 단순한 제곱 손실을 사용한 학습의 최소 예다. 실제 신경망도 층과 파라미터가 많을 뿐 순전파, 손실, 역전파, 업데이트의 순서는 같다."
        symbols={[
          ['x, y', '입력 2와 정답 5'],
          ['w, b', '학습할 가중치와 편향'],
          ['∂L/∂w, ∂L/∂b', '각 파라미터를 조금 바꿀 때 손실이 얼마나 변하는지'],
          ['η = 0.1', '기울기의 10%만큼 이동시키는 학습률'],
          ["w', b'", '한 번의 업데이트가 끝난 새 파라미터'],
        ]}
      />

      <div className="prose prose-neutral max-w-none dark:prose-invert">
        <h3>한 번 가까워졌다고 학습이 끝난 것은 아니다</h3>
        <p>
          실제 훈련에서는 여러 샘플을 mini-batch로 묶어 평균 손실을 계산하고, 이 과정을 수천에서 수백만 번 반복한다.
          한 샘플에만 맞춰 계속 업데이트하면 그 샘플은 외울 수 있지만 새로운 입력에 잘 작동한다는 보장은 없다.
          따라서 훈련 루프에는 데이터 섞기, 검증, checkpoint, 학습률 조절과 같은 운영 단계도 함께 들어간다.
        </p>
      </div>

      <CapabilityCheck
        items={[
          '순전파가 현재 파라미터의 예측을 만든다는 것을 설명한다.',
          '손실과 기울기가 서로 다른 숫자라는 것을 구분한다.',
          '기울기의 부호와 학습률이 업데이트 방향과 크기를 정한다는 것을 설명한다.',
          '한 샘플의 손실 감소와 일반화 성능 향상을 구분한다.',
        ]}
      />
    </section>
  );
}
