import ThresholdViz from './viz/ThresholdViz';

export default function Threshold() {
  return (
    <section id="threshold" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">임계값 최적화</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          분류 모델은 확률(probability)을 출력하고, <strong>threshold</strong>(임계값)를 기준으로 클래스를 결정<br />
          기본 threshold 0.5 — 확률이 0.5 이상이면 양성, 미만이면 음성<br />
          그런데 불균형 데이터에서 이 0.5는 거의 항상 최적이 아니다
        </p>
        <p>
          <strong>왜 0.5가 부적절한가</strong> — 불균형 데이터에서 모델의 확률 출력이 다수 클래스 쪽으로 편향<br />
          이상 비율 5%인 데이터 → 대부분의 이상 샘플도 0.1~0.3 범위에서 예측됨<br />
          threshold 0.5 기준이면 이상을 거의 탐지하지 못함 (Recall ≈ 0)<br />
          threshold를 0.2~0.3으로 낮추면 Recall이 크게 상승
        </p>
        <p>
          <strong>PR Curve</strong>(Precision-Recall Curve)로 최적 threshold를 탐색<br />
          threshold를 0에서 1로 변화시키며 각 지점의 Precision과 Recall을 계산<br />
          threshold ↓ → Recall ↑, Precision ↓ (더 많이 양성으로 예측)<br />
          threshold ↑ → Recall ↓, Precision ↑ (확실한 것만 양성으로 예측)<br />
          이 곡선 위에서 <strong>F1이 최대인 점</strong>이 기본적인 최적 threshold
        </p>
      </div>
      <ThresholdViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">비용 기반 threshold와 F-beta</h3>
        <p>
          실전에서 FP(오탐) 비용과 FN(미탐) 비용은 대부분 다르다<br />
          <strong>의료 진단</strong>: FN 비용(암 놓침) {'>'}{'>'}  FP 비용(추가 검사) → threshold를 낮춰 Recall 극대화<br />
          <strong>스팸 필터</strong>: FP 비용(정상 메일 차단) {'>'}{'>'}  FN 비용(스팸 통과) → threshold를 높여 Precision 극대화
        </p>
        <p>
          비용 최적 threshold 근사: <strong>t* = C_FP / (C_FP + C_FN)</strong><br />
          C_FN이 C_FP보다 크면 t*이 낮아지고 (Recall 중시), 반대면 t*이 높아진다 (Precision 중시)
        </p>
        <p>
          <strong>F-beta Score</strong>로 Precision/Recall 가중치를 조절<br />
          F_beta = (1 + beta^2) * P * R / (beta^2 * P + R)<br />
          beta {'>'} 1: Recall에 더 큰 가중치 (beta=2면 Recall이 Precision보다 2배 중요)<br />
          beta {'<'} 1: Precision에 더 큰 가중치 (beta=0.5면 Precision이 2배 중요)
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-1">Threshold 튜닝 주의사항</p>
        <p className="text-sm text-amber-700 dark:text-amber-300">
          threshold 튜닝은 반드시 <strong>검증 세트</strong>에서 수행한다 — 테스트 세트에서 하면 데이터 누수.
          교차 검증의 각 fold에서 최적 threshold를 구하고 평균을 사용하는 것이 안정적.
          모델 재학습 없이 추론 단계에서만 조정하므로 비용이 거의 0이며,
          리샘플링이나 손실 함수 변경 후에도 항상 threshold 재조정이 필요하다.
        </p>
      </div>
    </section>
  );
}
