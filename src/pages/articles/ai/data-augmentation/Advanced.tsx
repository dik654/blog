import AdvancedViz from './viz/AdvancedViz';

export default function Advanced() {
  return (
    <section id="advanced" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">고급 기법: Mixup, CutMix, Mosaic</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          기하학적·색상 변환은 <strong>단일 이미지</strong>를 변형한다 — 한계가 있다<br />
          고급 증강은 <strong>여러 이미지를 조합</strong>하여 완전히 새로운 학습 샘플을 만든다<br />
          라벨까지 혼합(soft label)하므로 모델이 더 부드러운 결정 경계를 학습
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Mixup (2017)</h3>
        <p>
          두 이미지를 픽셀 단위로 선형 보간 — x̃ = λ·x₁ + (1-λ)·x₂<br />
          λ는 Beta(α, α) 분포에서 샘플링. α=0.2~0.4가 일반적<br />
          α가 클수록 혼합 비율이 0.5에 가까워져 강한 정규화 효과<br />
          라벨도 동일 비율로 혼합: ỹ = λ·y₁ + (1-λ)·y₂ → soft label이 과적합을 억제
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">CutMix (2019)</h3>
        <p>
          Mixup의 단점 — 전체가 투명하게 겹쳐 비현실적인 이미지가 생성된다<br />
          CutMix는 한 이미지에서 직사각형 패치를 잘라내 다른 이미지에 붙여넣기<br />
          라벨 비율 = 패치 면적 비율: λ = 1 - (w×h)/(W×H)<br />
          지역적 특징을 보존하면서 혼합하므로 분류·탐지 모두에서 Mixup보다 효과적
        </p>
      </div>

      <div className="not-prose my-8">
        <AdvancedViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">CutOut vs CutMix</h3>
        <p>
          <strong>CutOut</strong>(2017) — 랜덤 영역을 검정으로 마스킹. 정보가 완전히 손실된다<br />
          <strong>CutMix</strong> — 마스킹 영역을 다른 이미지로 채움. 정보 손실 없이 혼합 효과<br />
          CutMix는 CutOut의 상위호환이라 할 수 있다
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">Mosaic (2020, YOLOv4)</h3>
        <p>
          4장의 이미지를 2×2로 배치하고 랜덤 비율로 분할<br />
          한 배치에서 4배의 컨텍스트를 학습 — 작은 객체 탐지에 특히 효과적<br />
          BN(배치 정규화) 통계가 4장 정보를 반영하여 미니배치 크기 의존성 감소<br />
          바운딩 박스 좌표도 자동으로 변환해야 하므로 구현이 복잡하지만, Albumentations/YOLO에 내장
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="font-semibold mb-2">실전 팁: Mixup vs CutMix 선택 기준</p>
        <p className="text-sm">
          분류 전용 → Mixup이 간편하고 효과적. CutMix와 성능 차이가 크지 않다<br />
          탐지·세그멘테이션 → CutMix 또는 Mosaic. 공간 정보 보존이 필수인 태스크에서 Mixup은 부적합<br />
          두 기법을 50:50으로 섞어 쓰는 것도 흔한 전략
        </p>
      </div>
    </section>
  );
}
