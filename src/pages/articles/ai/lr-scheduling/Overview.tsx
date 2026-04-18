import OverviewViz from './viz/OverviewViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">학습률이 왜 중요한가</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          딥러닝에서 튜닝할 하이퍼파라미터는 수십 개지만, 그중 <strong>학습률(Learning Rate, η)</strong>이 단연 1위.
          η 하나만 잘못 잡아도 모델이 아예 학습을 못 하거나, 수렴에 수십 배 더 걸린다
        </p>
        <p>
          θ_new = θ_old − η × ∇L(θ) — 매 업데이트에서 gradient 반대 방향으로 <strong>얼마나 이동할지</strong>를 η가 결정.
          η가 크면 큰 보폭으로 빠르게 탐색하지만 최솟값을 넘어 튕길 위험이 있고,
          η가 작으면 안정적이지만 수렴이 느리고 saddle point에 갇힐 수 있다
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">고정 LR의 한계</h3>
        <p>
          훈련 초반과 후반의 loss 지형(landscape)은 전혀 다름.
          초반에는 loss가 높아 큰 보폭이 효율적이고, 최솟값 근처에서는 작은 보폭이 필요.
          고정 LR은 이 변화에 대응하지 못한다
        </p>
        <p>
          실전에서 η=0.1로 시작하면 초반 10 에포크는 잘 내려가지만,
          90 에포크 이후에는 같은 0.1이 너무 커서 loss가 진동.
          반대로 처음부터 η=0.0001을 쓰면 100 에포크를 돌려도 loss가 거의 안 줄어든다
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">학습률 스케줄링이란</h3>
        <p>
          훈련 진행에 따라 η를 <strong>동적으로 변경</strong>하는 전략.
          초반 큰 LR → 빠르게 loss 지형 탐색 / 후반 작은 LR → 최솟값 근처에서 세밀한 수렴
        </p>
        <p>
          2024 기준 표준 패턴: <strong>Warmup(0→η_max) + Cosine Decay(η_max→η_min)</strong>.
          LLaMA, GPT-4, ViT 등 거의 모든 대규모 모델이 이 조합을 사용.
          다음 섹션에서 Step, Exponential, Cosine, OneCycle, Warmup 전략을 각각 분석한다
        </p>
      </div>
      <div className="not-prose my-8">
        <OverviewViz />
      </div>
    </section>
  );
}
