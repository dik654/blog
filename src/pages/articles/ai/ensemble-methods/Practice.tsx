import PracticeViz from './viz/PracticeViz';

export default function Practice() {
  return (
    <section id="practice" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">실전: 최적 조합 찾기</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>"같은 GBM + 다른 피처"</strong> vs <strong>"다른 모델 + 같은 피처"</strong><br />
          같은 GBM + 다른 피처: 피처 엔지니어링 관점 다양성 확보. 예측 상관 ~0.85<br />
          다른 모델 + 같은 피처: 알고리즘 편향 다양성 확보. 예측 상관 ~0.75<br />
          최적: <strong>다른 모델 + 다른 피처</strong> (상관 ~0.65) → 다양성 극대화
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">최적 가중치 탐색</h3>
        <p>
          scipy.optimize.minimize 활용 — objective: -cv_score(weighted_pred)<br />
          제약: sum(weights) = 1, bounds: 0 &lt;= w[i] &lt;= 1<br />
          Nelder-Mead 또는 Powell method — gradient 불필요한 최적화<br />
          CV fold 평균 점수로 평가 → holdout에서 최종 검증으로 과적합 방지
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">수확 체감 (Diminishing Returns)</h3>
        <p>
          앙상블 모델 수와 개선폭은 로그 관계 — 초반 급상승, 후반 정체<br />
          1 → 3개: 큰 개선 (AUC +4~6%). 3 → 5개: 중간 개선 (+2%). 5 → 10개: 작은 개선 (+0.8%)<br />
          10개 이상: 미미한 개선 (+0.3%) — 계산 비용만 증가<br />
          <strong>실전 권장: 3~7개</strong> — 비용 대비 효과가 최적인 구간
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">앙상블 구성 순서</h3>
        <p>
          1. 기본 모델 3~5개 학습 후 개별 CV 점수 확인<br />
          2. 예측 상관 행렬 확인 → 상관 0.95 이상인 모델 쌍은 하나 제거<br />
          3. Simple Average 먼저 시도 → Weighted Average → Stacking 순서<br />
          4. CV-LB 상관 확인 — CV가 불안정(shake)하면 Simple Average가 안전<br />
          5. 최종 제출: Safe(Simple Avg) + Risky(Stacking) 두 개 제출
        </p>
      </div>
      <div className="not-prose my-8">
        <PracticeViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <div className="bg-red-50 dark:bg-red-950/30 border-l-4 border-red-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">실전 함정 3가지</p>
          <p>
            <strong>함정 1: CV 과적합</strong> — 가중치를 CV에 맞추다 LB에서 하락. 해결: holdout 검증 추가.<br />
            <strong>함정 2: 같은 모델 N개</strong> — seed만 다른 GBM 10개는 상관 0.98 → 효과 없음.<br />
            <strong>함정 3: 복잡한 메타 모델</strong> — Stacking의 Level-1에 GBM 사용 → 과적합. Ridge가 안전.
          </p>
        </div>
        <p className="leading-7 mt-4">
          요약 1: 앙상블의 효과는 <strong>다양성</strong>에서 나온다 — 다른 모델 + 다른 피처.<br />
          요약 2: <strong>단순 → 복잡</strong> 순서로 시도: Average → Weighted → Stacking.<br />
          요약 3: <strong>3~7개 모델</strong>이 비용 대비 최적 — 그 이상은 수확 체감.
        </p>
      </div>
    </section>
  );
}
