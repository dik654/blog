import M from '@/components/ui/math';
import OverviewViz from './viz/OverviewViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">GBM vs 딥러닝: 테이블에서의 대결</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          테이블(tabular) 데이터 — 행이 샘플, 열이 피처인 가장 전통적인 데이터 형식<br />
          이미지·텍스트에서 딥러닝이 압도적이지만, 테이블에서는 <strong>GBM(Gradient Boosted
          Machine)</strong>이 여전히 지배적 위치를 유지하고 있다
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold text-amber-800 dark:text-amber-200 mb-1">핵심 질문</p>
          <p className="text-sm text-amber-700 dark:text-amber-300">
            "Do we really need deep learning models for tabular data?" — Shwartz-Ziv & Armon (2022)<br />
            45개 벤치마크 데이터셋 실험 결과, 중간 규모(10K~50K)에서 XGBoost가 DL 모델을 일관되게 능가
          </p>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">테이블 데이터가 특별한 이유</h3>
        <p>
          이미지: 인접 픽셀 간 공간 상관관계 존재 → CNN이 이를 활용<br />
          텍스트: 단어 간 순서 의존성 → RNN/Transformer가 이를 활용<br />
          테이블: <strong>피처 간 공간적·시간적 관계 없음</strong> — 열 순서를 바꿔도 의미 동일
        </p>
        <p>
          이 "불규칙 피처(irregular features)" 특성 때문에 DL의 귀납 편향(inductive bias)이
          오히려 방해가 된다.
          GBM은 결정 경계를 split으로 직접 학습하므로 적은 데이터에서도 강건한 성능을 보인다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">GBM이 유리한 구조적 이유</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">요인</th>
                <th className="border border-border px-4 py-2 text-left">GBM</th>
                <th className="border border-border px-4 py-2 text-left">DL</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['이질적 피처', '수치+범주 자연 처리', '인코딩 필요 (원핫/임베딩)'],
                ['피처 수 대비 샘플', '적은 데이터에 강건', '과적합 위험'],
                ['학습 속도', 'CPU에서 수 분', 'GPU 필요, 수 시간'],
                ['하이퍼파라미터', '상대적 적음', '아키텍처+옵티마이저 조합 폭발'],
                ['해석 가능성', 'SHAP/feature importance 내장', '별도 기법 필요'],
              ].map(([factor, gbm, dl]) => (
                <tr key={factor}>
                  <td className="border border-border px-4 py-2 font-medium">{factor}</td>
                  <td className="border border-border px-4 py-2">{gbm}</td>
                  <td className="border border-border px-4 py-2">{dl}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">DL이 접근하는 3가지 조건</h3>
        <p>
          그럼에도 DL이 GBM에 근접하거나 추월하는 조건이 존재한다.
        </p>
        <p>
          <strong>① 대규모 데이터</strong> — 100K 샘플 이상에서 DL의 파라미터 용량이 빛을 발한다.
          GBM은 트리 깊이·개수 한계로 복잡한 패턴 포착에 한계가 있다.
        </p>
        <p>
          <strong>② 멀티모달 입력</strong> — 텍스트(상품 설명) + 이미지(상품 사진) + 테이블(가격, 카테고리)을
          하나의 모델로 결합할 때 DL이 유일한 선택지.
          GBM은 비정형 데이터를 직접 처리할 수 없다.
        </p>
        <p>
          <strong>③ 고카디널리티 범주형</strong> — 유니크 값 10,000개 이상인 범주형 피처(사용자 ID,
          상품 코드 등)에 엔티티 임베딩(entity embedding)을 적용하면 GBM 대비 표현력이 확대된다.
        </p>
      </div>

      <div className="not-prose my-8"><OverviewViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">테이블 DL 모델의 진화</h3>
        <p>
          Wide&Deep(2016) — 추천 시스템에서 선형 + DNN 결합의 시초<br />
          DeepFM(2017) — FM(Factorization Machine) + DNN으로 피처 교차 자동화<br />
          TabNet(2019) — 어텐션 기반 피처 선택, 해석 가능한 DL<br />
          FT-Transformer(2021) — 각 피처를 토큰으로 취급, self-attention 적용<br />
          TabPFN(2022) — prior-data fitted network, 학습 없이 추론 시점에 적응
        </p>
        <p>
          이 아티클에서는 가장 영향력 있는 두 모델 — <strong>TabNet</strong>과 <strong>FT-Transformer</strong>의
          구조를 깊이 분석하고, DL이 GBM을 이기는 구체적 조건을 정리한다.
        </p>
      </div>
    </section>
  );
}
