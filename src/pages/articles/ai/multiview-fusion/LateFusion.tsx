import LateFusionViz from './viz/LateFusionViz';

export default function LateFusion() {
  return (
    <section id="late-fusion" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Late Fusion: 피처 결합</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          Late Fusion — 각 뷰를 <strong>독립적인 백본</strong>으로 인코딩한 뒤 피처 벡터를 결합하여 분류<br />
          각 백본이 뷰 고유의 특성을 자유롭게 학습 → 정면은 형태, 측면은 깊이 등 서로 다른 표현 가능<br />
          ImageNet pretrained 모델을 <strong>수정 없이</strong> 그대로 사용 가능 — 실무에서 가장 많이 사용되는 기본선(baseline)
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">기본 구조: 독립 인코딩 → Concat → FC</h3>
        <p>
          View 1 → Backbone A → f1 (2048-d for ResNet-50)<br />
          View 2 → Backbone B → f2 (2048-d)<br />
          f = [f1 ; f2] → FC(4096, num_classes) → softmax → 예측<br />
          Backbone A와 B는 같은 아키텍처일 수도, 다른 아키텍처일 수도 있다<br />
          같은 아키텍처 + 다른 가중치(독립 학습)가 일반적 — Siamese와의 차이점
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">가중 결합 (Weighted Late Fusion)</h3>
        <p>
          단순 concat 대신 <strong>학습 가능한 가중치</strong>로 피처를 선형 결합:<br />
          <code>f = w1 * f1 + w2 * f2</code> (w1, w2는 softmax로 정규화)<br />
          유용한 뷰에 높은 가중치를 자동 부여 — 정면이 유용하면 w1이 커지고 측면이 유용하면 w2가 커짐<br />
          concat 대비 파라미터 절약: 4096→2048로 FC 입력 차원 감소<br />
          변형: 샘플별로 다른 가중치를 예측하는 <strong>Gating Network</strong> — 입력에 따라 동적 결합
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Late Fusion의 한계</h3>
        <p>
          각 뷰가 독립적으로 인코딩되므로 <strong>저수준 피처 간 상호작용이 불가</strong><br />
          예: 정면의 균열 패턴과 측면의 변형 패턴이 같은 위치에서 발생하는지 파악하려면 고수준 피처 결합 후에만 가능<br />
          파라미터 수 = 백본 × 뷰 수 → 2뷰면 2배, 6뷰면 6배 (Siamese와 대조적)<br />
          정보 병목: 각 뷰가 d차원 벡터로 압축된 후 결합 → 공간 정보(어디에서 무엇이 보이는지) 손실
        </p>
      </div>

      <div className="not-prose my-8"><LateFusionViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <p className="leading-7">
          요약 1: Late Fusion은 <strong>pretrained 모델을 그대로 활용</strong>할 수 있어 구현이 간편하고 baseline으로 적합<br />
          요약 2: 가중 결합(Weighted Fusion)으로 <strong>뷰별 중요도</strong>를 학습 가능하지만 저수준 상호작용은 여전히 불가<br />
          요약 3: 파라미터 효율과 뷰 간 상호작용 사이의 <strong>트레이드오프</strong> — Attention Fusion이 이 한계를 해소
        </p>
      </div>
    </section>
  );
}
