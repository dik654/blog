import PostprocessViz from './viz/PostprocessViz';

export default function Postprocess() {
  return (
    <section id="postprocess" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">후처리: Threshold, Ensemble</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          모델 학습이 끝나면 <strong>후처리</strong>에서 추가 성능을 뽑아낸다<br />
          Threshold 최적화, 앙상블(Soft/Hard Voting), Rank Averaging — 세 가지 핵심 기법<br />
          후처리만으로 0.5~2% 향상 가능 — 대회 상위권과 중위권의 분기점
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Threshold 최적화</h3>
        <p>
          이진/다중라벨 분류에서 기본 threshold는 0.5 — 그러나 최적은 데이터에 따라 다름<br />
          Validation set에서 threshold를 0.3~0.7 구간, 0.01 단위로 스캔<br />
          F1 = 2·Precision·Recall / (Precision + Recall)을 최대화하는 지점 선택<br />
          불균형 데이터일수록 최적 threshold가 0.5에서 크게 벗어남 — 양성 비율이 5%라면 threshold 0.3~0.4가 최적일 수 있음<br />
          반드시 Validation set에서 탐색 후 Test에 적용 — Test로 직접 튜닝하면 과적합
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Soft Voting vs Hard Voting</h3>
        <p>
          <strong>Hard Voting</strong> — 각 모델이 예측한 클래스를 수집하고 다수결<br />
          Model A: cat, Model B: cat, Model C: dog → 2:1로 cat 선택<br />
          단순하지만 확률 정보를 버림 — A가 cat에 99%인지 51%인지 구분 불가
        </p>
        <p>
          <strong>Soft Voting</strong> — 각 모델의 확률 출력(softmax)을 평균한 뒤 argmax<br />
          A: [cat:0.7], B: [cat:0.6], C: [cat:0.3] → 평균 0.53 → cat<br />
          신뢰도(confidence)가 반영되어 거의 항상 Hard보다 우수<br />
          모델 수는 3~5개가 최적. 7개 이상은 수확 체감(diminishing returns), 추론 비용만 증가
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Cross-Model + Cross-Fold 앙상블</h3>
        <p>
          <strong>Cross-Model</strong>: 서로 다른 아키텍처(EfficientNet + ConvNeXt + ViT)를 앙상블<br />
          각 모델의 귀납 편향(inductive bias)이 달라 실수 패턴이 다름 → 보완 효과<br />
          CNN은 로컬 패턴에 강하고, ViT는 글로벌 구조에 강함 — 두 관점을 합산
        </p>
        <p>
          <strong>Cross-Fold</strong>: 동일 모델을 5-Fold CV로 학습 → 5개 예측 평균<br />
          각 fold가 다른 20% 데이터를 validation으로 사용 → 5개 모델이 서로 다른 패턴 학습<br />
          분산(variance) 감소가 주 효과 — 단일 모델의 운(randomness)을 제거
        </p>
        <p>
          <strong>최강 조합</strong>: 3모델 × 5Fold = 15개 예측 앙상블<br />
          주의: 상관관계가 높은 모델끼리(EfficientNet-B4 + EfficientNet-B5) 앙상블은 효과 미미<br />
          다양성(diversity)이 앙상블의 핵심 — 서로 다른 계열의 모델을 조합
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">Rank Averaging</h3>
        <p>
          <strong>문제</strong>: 모델마다 확률 출력의 스케일이 다름 — calibration이 안 된 모델의 0.9와 잘 된 모델의 0.7은 비교 불가<br />
          <strong>해법</strong>: 확률 대신 순위(rank)를 사용<br />
          각 모델의 예측값을 0~1 구간의 rank로 변환 → rank 평균 → 최종 순서 결정<br />
          Rank = (해당 샘플의 순위) / (전체 샘플 수)<br />
          AUC, Precision@K 등 순위 기반 메트릭에서 특히 효과적<br />
          확률 평균이 잘 안 맞을 때의 안전망 — 대회 마지막 제출에서 보험으로 사용
        </p>
      </div>
      <div className="not-prose my-8">
        <PostprocessViz />
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="text-sm font-semibold text-amber-800 dark:text-amber-200 mb-1">후처리 체크리스트</p>
        <p className="text-sm text-amber-700 dark:text-amber-300">
          1) Threshold 탐색: F1/AUC 기준, Val set에서 최적 threshold 찾기<br />
          2) 단일 모델 TTA 적용 — 추론 비용 2× 이내<br />
          3) Cross-Model 앙상블 (2~3개 다른 아키텍처)<br />
          4) Cross-Fold 앙상블 (5-Fold 기본)<br />
          5) Soft Voting 기본 + Rank Averaging 백업 제출<br />
          6) 최종 제출: Soft Voting과 Rank Averaging 중 Val 성능 좋은 쪽 선택
        </p>
      </div>
    </section>
  );
}
