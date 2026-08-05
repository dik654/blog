import M from '@/components/ui/math';
import StepFunctionViz from './viz/StepFunctionViz';
import StepHistoryViz from './viz/StepHistoryViz';

export default function StepFunction() {
  return (
    <section id="step-function" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">계단 함수 (Step Function)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          역사적 출발점 — 1943년 McCulloch-Pitts 뉴런 모델.
          입력의 가중합 <M>{'z = \\sum_i w_i x_i'}</M> 이 임계값을 넘으면 1, 아니면 0 을 출력하는 이진 분류의 가장 단순한 형태:
        </p>
        <M display>{'f(x) = \\begin{cases} 1 & x \\ge 0 \\\\ 0 & x < 0 \\end{cases}'}</M>
        <p>
          여기서 <M>{'x \\in \\mathbb{R}'}</M> 는 뉴런의 pre-activation (가중합),
          출력은 <M>{'\\{0, 1\\}'}</M> 의 두 값만 — "발화 / 비발화" 의 생물학적 뉴런 비유에서 출발.
          임계값을 0 이 아닌 <M>{'\\theta'}</M> 로 두면 <M>{'f(x) = \\mathbb{1}[x \\ge \\theta]'}</M> 형태 (heaviside step).
        </p>
        <p>
          <strong>치명적 문제 — 학습 불가능</strong>. 미분이 거의 모든 점에서 0:
        </p>
        <M display>{"\\underbrace{f'(x) = 0}_{x \\ne 0 \\text{ 모든 점}} \\qquad \\underbrace{f'(0) \\text{ 정의 불가}}_{\\text{불연속점}}"}</M>
        <p>
          <M>{"f'(x)"}</M> 는 <M>{'f'}</M> 의 도함수 (입력에 대한 출력 변화율).
          경사 하강법은 <M>{'\\theta_{t+1} = \\theta_t - \\eta \\cdot \\nabla L'}</M> 로 가중치를 갱신하는데,
          <M>{"f'(x) = 0"}</M> 이면 chain rule 로 흘러 들어오는 모든 gradient 가 <M>{'\\partial L / \\partial \\theta = (\\cdots) \\cdot 0 = 0'}</M> 으로 사라진다 →
          학습 신호 0 → 가중치 업데이트 없음. 불연속점 <M>{'x = 0'}</M> 에서는 미분 자체가 정의되지 않아 sub-gradient 도 의미가 없다.
        </p>
      </div>
      <div className="not-prose my-8">
        <StepFunctionViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">역사 · 한계 · 미분 불가 해결</h3>
        <p>
          McCulloch-Pitts(1943) → Perceptron(1958) → XOR 한계 → 미분 불가 문제와 4가지 해결법.
          XOR 한계의 본질은 step function 으로 만든 단일 perceptron 이 선형 분리 가능한 경우만 풀 수 있다는 점이다.
          XOR 의 진리표 <M>{'(0,0) \\to 0,\\, (0,1) \\to 1,\\, (1,0) \\to 1,\\, (1,1) \\to 0'}</M> 은 어떤 직선
          <M>{'w_1 x_1 + w_2 x_2 + b = 0'}</M> 으로도 두 클래스를 분리할 수 없다 (Minsky &amp; Papert 1969) — 이게 첫 AI winter 의 직접적 원인.
          해결의 방향은 두 가지였다 — (1) 다층 + (2) 미분 가능한 활성화. 그래서 다음 절의 sigmoid 가 등장한다.
        </p>
      </div>
      <StepHistoryViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          요약 1: Step function은 <strong>학습 불가</strong>지만 역사적 출발점.<br />
          요약 2: <strong>Sigmoid가 smooth 버전</strong>으로 대체 — backprop 가능.<br />
          요약 3: 현대에도 <strong>양자화·스파이킹 NN</strong> 등에서 응용.
        </p>
      </div>
    </section>
  );
}
