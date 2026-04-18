import FinalStrategyViz from './viz/FinalStrategyViz';

export default function Final() {
  return (
    <section id="final" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">마감 전략: 앙상블 & 선택</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          마감 2~3일 전부터는 새로운 실험을 멈추고 <strong>앙상블 구성 + 제출 선택</strong>에 집중한다<br />
          목표: 다양한 모델을 조합하여 0.001~0.01의 추가 개선 + shake-up 대비 안전한 제출 확보
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">앙상블의 핵심: 다양성(Diversity)</h3>
        <p>
          <strong>앙상블</strong>(Ensemble) — 여러 모델의 예측을 결합하여 단일 모델보다 높은 성능을 달성하는 기법<br />
          같은 LightGBM 5개를 평균하는 것보다, LightGBM + XGBoost + CatBoost + NN 조합이 훨씬 강력<br />
          다양성 확보 축: 모델 아키텍처, 피처셋, 랜덤 시드, 전처리 방법을 각각 다르게 구성
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">앙상블 방법</h3>
        <p>
          <strong>Simple Average</strong>: 가장 안전한 방법, 동일 가중치 평균<br />
          <strong>Weighted Average</strong>: CV OOF(Out-of-Fold) 기반으로 최적 가중치 산출 (scipy.minimize)<br />
          <strong>Stacking</strong>: OOF 예측을 피처로 메타 모델(주로 Linear/Ridge) 학습 — 가장 강력하지만 과적합 위험
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">제출 선택과 Shake-up 대비</h3>
        <p>
          대부분의 대회는 최종 제출 <strong>2개</strong>를 선택<br />
          제출 1: CV 기준 Best — <strong>shake-up</strong> 대비 보수적 선택<br />
          제출 2: LB 기준 Best — Public LB에 최적화된 공격적 선택
        </p>
        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="text-sm leading-relaxed m-0">
            <strong>Shake-up</strong>: Public LB(테스트 데이터의 ~30%)와 Private LB(나머지 ~70%)의 순위 변동.
            Public LB에만 최적화하면 Private LB에서 순위가 급락할 수 있다.
            강건한 CV + 다양한 앙상블이 shake-up 방어의 핵심.
          </p>
        </div>
      </div>
      <div className="not-prose my-8">
        <FinalStrategyViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          최종 체크리스트: 앙상블 구성 완료 + 제출 2개 선택 + CV/LB 점수 기록 + OOF 예측 저장<br />
          마감 후에도 OOF 예측이 있으면 — 다른 대회에서 비슷한 문제를 만났을 때 참고 자산이 된다
        </p>
      </div>
    </section>
  );
}
