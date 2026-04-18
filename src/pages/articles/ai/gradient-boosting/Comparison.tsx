import GBMComparisonViz from './viz/GBMComparisonViz';

export default function Comparison() {
  return (
    <section id="comparison" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">3대 GBM 비교 &amp; 선택 기준</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none mb-6">
        <p>
          XGBoost, LightGBM, CatBoost — 모두 Gradient Boosting 기반이지만 설계 철학이 다르다<br />
          어떤 것이 "최고"라기보다 <strong>데이터 특성에 따른 최적 선택</strong>이 존재
        </p>
      </div>

      {/* 비교표 */}
      <div className="not-prose overflow-x-auto rounded-xl border mb-6">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b bg-muted/30">
              {['항목', 'XGBoost', 'LightGBM', 'CatBoost'].map(h => (
                <th key={h} className="px-3 py-2 text-left font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              ['트리 성장', 'Level-wise', 'Leaf-wise (Best-first)', 'Symmetric (Oblivious)'],
              ['핵심 혁신', '2차 테일러 + 정규화', 'GOSS + EFB', 'Ordered Boosting'],
              ['범주형 처리', 'One-hot 필요', '직접 지원 (Fisher)', 'Ordered TS (최강)'],
              ['결측 처리', '자동 (최적 방향)', '자동', '자동'],
              ['GPU 지원', '지원 (hist)', '지원', '네이티브 최적화'],
              ['학습 속도', '중간', '가장 빠름', '빠름 (대칭 트리)'],
              ['메모리', '보통', '효율적 (EFB)', '높음 (순열 유지)'],
              ['기본 성능', '안정적', '좋음', '매우 좋음 (튜닝 적음)'],
              ['과적합 제어', 'γ, λ, α 정규화', 'num_leaves 제한', 'Ordered + 대칭 정규화'],
              ['생태계', '가장 풍부', '풍부', '성장 중'],
            ].map((row, i) => (
              <tr key={i} className="border-b last:border-0 hover:bg-muted/20">
                <td className="px-3 py-2 font-semibold">{row[0]}</td>
                <td className="px-3 py-2">{row[1]}</td>
                <td className="px-3 py-2">{row[2]}</td>
                <td className="px-3 py-2">{row[3]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <GBMComparisonViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">언제 무엇을 쓸 것인가</h3>
        <p>
          <strong>대용량 수치 데이터 (100만+ 행)</strong> → LightGBM<br />
          GOSS + EFB + histogram subtraction으로 속도 우위 압도적<br />
          leaf-wise 성장이 같은 시간 내 더 낮은 오차 달성
        </p>
        <p>
          <strong>범주형 피처 비율 높은 데이터</strong> → CatBoost<br />
          Ordered Target Statistics가 target encoding + 기타 인코딩보다 안정적<br />
          클릭 예측, 추천, 광고 CTR 등에서 검증된 성능
        </p>
        <p>
          <strong>범용/소규모/안정성 우선</strong> → XGBoost<br />
          가장 오래되고 문서가 풍부, 디버깅과 해석이 가장 쉬움<br />
          exact split이 소규모 데이터에서 오히려 유리할 수 있음
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">앙상블에서의 다양성 확보</h3>
        <p>
          대회 상위권 솔루션의 패턴: <strong>3가지 GBM을 모두 사용</strong>하여 블렌딩<br />
          각 GBM의 트리 성장 방식·샘플링 전략이 다르므로 오차 패턴도 다름<br />
          동일 모델 3개 블렌딩보다 이종 모델 3개 블렌딩이 항상 우수 — 다양성이 핵심<br />
          실전 블렌딩: 각 모델의 OOF(Out-of-Fold) 예측을 메타 피처로, 스태킹으로 최종 결합
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">하이퍼파라미터 대응표</h3>
        <p>
          같은 개념이 라이브러리마다 이름이 다름 — 혼동 주의<br />
          학습률: eta / learning_rate / learning_rate<br />
          트리 수: n_estimators / n_estimators / iterations<br />
          리프 수: max_leaves / num_leaves / num_leaves<br />
          최대 깊이: max_depth / max_depth / depth<br />
          L2 정규화: reg_lambda / lambda_l2 / l2_leaf_reg<br />
          서브샘플링: subsample / bagging_fraction / subsample
        </p>
      </div>
      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="text-sm">
          <strong>실전 전략:</strong> 시간이 충분하면 3가지 GBM + Optuna 튜닝 + OOF 스태킹이 거의 항상 최적.
          시간이 부족하면 LightGBM 단일 모델 + early stopping이 가장 효율적인 선택.
        </p>
      </div>
    </section>
  );
}
