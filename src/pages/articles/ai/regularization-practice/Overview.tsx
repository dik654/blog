import OverfittingDiagnosisViz from './viz/OverfittingDiagnosisViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">오버피팅 진단법</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          모델이 훈련 데이터에서는 완벽한 성능을 보이지만 새 데이터에서 무력한 현상 — <strong>오버피팅</strong>(Overfitting)<br />
          반대로 훈련 데이터조차 제대로 학습하지 못하면 <strong>언더피팅</strong>(Underfitting)
        </p>
        <p>
          진단법은 단순: <strong>학습 곡선</strong>(Learning Curve) 하나면 충분<br />
          Train Loss ↓ + Val Loss ↓ = 정상 학습<br />
          Train Loss ↓ + Val Loss ↑ = 오버피팅 — 학습 데이터의 노이즈까지 암기 중<br />
          Train Loss ↔ + Val Loss ↔ = 언더피팅 — 모델 용량 부족 또는 학습률 문제
        </p>
        <p>
          <strong>정규화</strong>(Regularization) — 모델의 복잡도를 의도적으로 제한하여 일반화 성능을 끌어올리는 기법의 총칭<br />
          핵심 원리: 학습 데이터에 "완벽히 맞추지 마라"는 제약을 부여 → 단순하고 견고한 패턴만 학습
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">오버피팅 발생 조건</h3>
        <p>
          데이터 부족 — 샘플 수 대비 모델 파라미터가 과다 (파라미터 &gt; 샘플 수이면 거의 확실)<br />
          모델 과대 — 층이 깊고 넓을수록 암기 능력 증가. ResNet-152로 CIFAR-10 학습하면 100% 맞추지만 일반화 약화<br />
          학습 과다 — 에폭을 너무 많이 돌리면 노이즈까지 학습. Early Stopping이 여기서 필요<br />
          노이즈 — 라벨 오류, 측정 잡음이 많을수록 모델이 엉뚱한 패턴을 잡아냄
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">정규화 기법 4가지</h3>
        <p>
          <strong>Dropout</strong> — 뉴런을 무작위로 비활성화하여 co-adaptation 방지<br />
          <strong>Weight Decay</strong> — 가중치 크기를 억제하여 단순한 모델로 유도<br />
          <strong>Early Stopping</strong> — Val Loss가 나빠지기 시작하면 학습 종료<br />
          <strong>Label Smoothing</strong> — 정답 라벨을 부드럽게 만들어 과신(overconfidence) 방지
        </p>
        <p>
          이 네 가지는 서로 독립적으로 적용 가능하며, 실전에서는 대부분 <strong>조합</strong>해서 사용<br />
          예: AdamW(Weight Decay) + Dropout 0.1 + Early Stopping + Label Smoothing 0.1 → 현대 Transformer 학습의 표준 조합
        </p>
      </div>
      <div className="not-prose my-8">
        <OverfittingDiagnosisViz />
      </div>
    </section>
  );
}
