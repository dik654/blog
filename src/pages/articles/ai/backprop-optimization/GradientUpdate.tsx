import GradientUpdateViz from './viz/GradientUpdateViz';
import SGDVariantsViz from './viz/SGDVariantsViz';
import LRSchedulingViz from './viz/LRSchedulingViz';
import GradTrainViz from './viz/GradTrainViz';

export default function GradientUpdate() {
  return (
    <section id="gradient-update" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">경사 하강법 업데이트</h2>
      <p className="text-muted-foreground mb-6 leading-relaxed">
        θ_new = θ_old - η × ∇L — 기울기 반대 방향으로 파라미터 이동.<br />
        학습률 η로 이동 크기를 제어한다.
      </p>
      <GradientUpdateViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">

        <h3 className="text-xl font-semibold mt-6 mb-3">SGD 변형 계열</h3>
        <p>
          GD(전체) → SGD(샘플 1개) → Mini-batch(B=32~512) → Momentum(관성) → NAG(예측)<br />
          각 변형이 이전의 단점을 해결하며 진화
        </p>
      </div>
      <SGDVariantsViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-8 mb-3">Learning Rate Scheduling</h3>
        <p>
          η 너무 크면 발산, 너무 작으면 수렴 느림 — 동적 조절이 필수<br />
          2023~ 표준: <strong>Warmup + Cosine decay</strong> (LLM 훈련 기본)
        </p>
      </div>
      <LRSchedulingViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">훈련 루프 · Momentum · Gradient Clipping</h3>
        <p>
          Forward → Backward → Update 루프부터 momentum, gradient clipping까지 전체 흐름.
        </p>
      </div>
      <GradTrainViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Momentum이 왜 효과적인가</p>
          <p>
            <strong>물리적 직관</strong>:<br />
            - 공이 경사면을 구를 때 관성(momentum) 가짐<br />
            - 작은 bump나 noise에 덜 흔들림<br />
            - 경사 방향으로 가속
          </p>
          <p className="mt-2">
            <strong>수학적 효과</strong>:<br />
            - Gradient의 exponential moving average<br />
            - Noise cancellation (반대 방향 상쇄)<br />
            - Ravines/saddle points 탈출<br />
            - 수렴 속도 증가 (보통 2-3배)
          </p>
          <p className="mt-2">
            <strong>β 값 선택</strong>:<br />
            - β = 0: momentum 없음 (vanilla SGD)<br />
            - β = 0.9: 표준 (약 10 step 평균)<br />
            - β = 0.99: longer memory (LLM 훈련)<br />
            - β = 1: overshooting 위험
          </p>
        </div>

      </div>
    </section>
  );
}
