import StepExpViz from './viz/StepExpViz';

export default function StepExponential() {
  return (
    <section id="step-exponential" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">StepLR & ExponentialLR</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          가장 직관적인 스케줄링 — <strong>시간이 지나면 LR을 줄인다</strong>.
          초반에 큰 LR로 빠르게 탐색하고, 후반에 작은 LR로 세밀하게 수렴하는 단순 전략
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">StepLR: 계단식 감소</h3>
        <p>
          N 에포크마다 현재 LR에 γ를 곱해 감소 — η_t = η₀ × γ^(floor(t/step_size)).
          ResNet 원 논문에서 사용한 방식: 160 에포크 중 [80, 120]에서 0.1배.
          구현이 간단하고 디버깅이 쉬워 baseline 실험에 자주 사용
        </p>
        <p>
          단점: step_size와 γ를 수동 설정해야 하고, 감소 시점에서 LR이 급변하여 학습이 일시적으로 불안정해질 수 있음.
          validation loss를 보며 마일스톤을 정하는 <strong>MultiStepLR</strong>이 더 유연한 대안
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">ExponentialLR: 부드러운 감소</h3>
        <p>
          매 에포크마다 η_t = η₀ × γ^t — 지수적으로 부드럽게 감소.
          StepLR의 급격한 계단 없이 연속적으로 줄어들어 gradient 충격이 적다.
          γ=0.95일 때 10 에포크 후 0.6배, 50 에포크 후 0.077배
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">ReduceLROnPlateau: 반응형 감소</h3>
        <p>
          validation loss가 patience 에포크 동안 개선되지 않으면 LR을 factor배 감소.
          사전에 마일스톤을 정할 필요가 없어 데이터셋과 모델에 <strong>적응적</strong>.
          patience=10, factor=0.5가 일반적 — 10 에포크 정체 시 LR 절반
        </p>

        <div className="bg-blue-50 dark:bg-blue-950/30 border-l-4 border-blue-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">실전 선택 가이드</p>
          <p>
            빠른 baseline → StepLR (step_size=30, γ=0.1)<br />
            부드러운 학습 → ExponentialLR (γ=0.95)<br />
            데이터셋 모르는 상황 → ReduceLROnPlateau (patience=10)
          </p>
        </div>
      </div>
      <div className="not-prose my-8">
        <StepExpViz />
      </div>
    </section>
  );
}
