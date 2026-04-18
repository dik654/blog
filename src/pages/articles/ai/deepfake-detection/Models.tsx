import ModelsViz from './viz/ModelsViz';

export default function Models() {
  return (
    <section id="models" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">탐지 모델: XceptionNet, EfficientNet, CLIP</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          딥페이크 탐지에서 가장 많이 사용되는 백본 모델 3가지<br />
          각각의 강점이 다르기 때문에 — 앙상블로 결합했을 때 최고 성능
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">XceptionNet: de facto 베이스라인</h3>
        <p>
          <strong>Depthwise Separable Convolution</strong> — Inception 구조의 극단적 변형<br />
          일반 Conv: 공간 + 채널을 동시에 처리 (파라미터 많음)<br />
          Depthwise Separable: 공간(depthwise) → 채널(pointwise) 분리 → 파라미터 약 8배 감소<br />
          FaceForensics++ 벤치마크에서 de facto 베이스라인으로 자리잡음 (2019~)
        </p>
        <p>
          구조: Entry Flow(Conv + MaxPool) → Middle Flow(DW Sep Conv x8) → Exit Flow(Global AvgPool)<br />
          입력: 299x299 RGB, 출력: binary classification (real/fake)<br />
          <strong>왜 딥페이크에 효과적인가</strong> — 채널별 독립 필터가 미세한 텍스처 차이를 포착<br />
          딥페이크의 경계 아티팩트, 색상 불일치가 채널별로 다르게 나타나기 때문
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">EfficientNet-B4: Compound Scaling</h3>
        <p>
          <strong>Compound Scaling</strong> — 너비(채널 수), 깊이(레이어 수), 해상도(입력 크기)를 동시에 확대<br />
          B0(224x224) → B7(600x600): 스케일에 따라 정확도-효율 트레이드오프<br />
          <strong>B4(380x380)</strong>가 딥페이크 탐지의 최적 지점 — B5 이상은 과적합 위험 증가
        </p>
        <p>
          MBConv 블록: Squeeze-and-Excite(SE) 모듈 + 역병목(inverted bottleneck) 구조<br />
          SE — 채널 간 상호 의존성을 학습하여 중요 채널에 가중치 부여<br />
          딥페이크의 미세한 채널 패턴을 잡아내는 데 SE의 채널 어텐션이 효과적
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">CLIP 기반 제로샷 탐지</h3>
        <p>
          <strong>CLIP</strong>(Contrastive Language-Image Pretraining) — 4억 쌍의 이미지-텍스트로 사전학습<br />
          프롬프트 기반: "a real photo of a person" vs "a deepfake photo of a person"<br />
          이미지 인코더(ViT-L/14)의 출력과 텍스트 인코더의 출력 간 코사인 유사도로 판별
        </p>
        <p>
          <strong>제로샷</strong>: 딥페이크 학습 데이터 없이도 유의미한 탐지 성능 달성<br />
          한계: fine-tuned 전용 모델 대비 정확도가 낮음 — 보조 신호로 활용<br />
          CLIP fine-tuning: 마지막 레이어만 학습하면 전용 모델 수준까지 성능 향상 가능
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">앙상블 전략</h3>
        <p>
          <strong>다양성</strong>이 앙상블의 핵심 — 같은 백본 3개보다 서로 다른 백본 3개가 효과적<br />
          XceptionNet(텍스처 포착) + EfficientNet-B4(채널 어텐션) + CLIP(의미적 이해)<br />
          전처리도 다양화: 크롭 크기, 해상도, 주파수 피처 유무를 모델별로 다르게<br />
          결합: 확률 평균(단순), 가중 평균(검증 성능 기반), 스태킹(meta learner)<br />
          대회 상위권은 예외 없이 3~5개 모델 앙상블 — 단일 모델로 우승한 사례는 거의 없다
        </p>
      </div>
      <div className="not-prose my-8">
        <ModelsViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          요약 1: XceptionNet은 딥페이크 벤치마크의 베이스라인 — depthwise separable conv가 핵심<br />
          요약 2: EfficientNet-B4가 정확도-과적합 균형의 최적 지점<br />
          요약 3: 3~5개 백본 앙상블이 대회 상위권의 공통 전략
        </p>
      </div>
    </section>
  );
}
