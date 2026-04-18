import M from '@/components/ui/math';
import WhenDLWinsViz from './viz/WhenDLWinsViz';

export default function WhenDLWins() {
  return (
    <section id="when-dl-wins" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">딥러닝이 이기는 조건</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          "테이블 데이터에 DL을 써야 하는가?" — 정답은 <strong>조건부</strong>다.
          모든 상황에서 GBM이 이기는 것도, DL이 이기는 것도 아니다.
          실무에서는 데이터 특성과 제약 조건에 따라 선택해야 한다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">조건 1: 데이터 크기 (100K+ 샘플)</h3>
        <p>
          Shwartz-Ziv & Armon (2022) 실험에서 데이터 크기별 승률:
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-4 py-2 text-left">데이터 크기</th>
                <th className="border border-border px-4 py-2 text-left">GBM 승률</th>
                <th className="border border-border px-4 py-2 text-left">DL 승률</th>
                <th className="border border-border px-4 py-2 text-left">분석</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['~10K', '85%', '15%', 'DL 과적합 위험 높음'],
                ['10K~50K', '70%', '30%', 'DL 접근, 앙상블 시 유리'],
                ['50K~100K', '55%', '45%', '거의 동등, 도메인 의존'],
                ['100K+', '40%', '60%', 'DL 우세, 특히 범주형 풍부 시'],
              ].map(([size, gbm, dl, note]) => (
                <tr key={size}>
                  <td className="border border-border px-4 py-2 font-medium">{size}</td>
                  <td className="border border-border px-4 py-2">{gbm}</td>
                  <td className="border border-border px-4 py-2">{dl}</td>
                  <td className="border border-border px-4 py-2 text-muted-foreground">{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          DL의 파라미터 용량은 데이터가 많을수록 빛을 발한다.
          XGBoost는 트리 1,000개 × 깊이 8 = 약 200K 리프노드가 상한 — 이를 넘는 복잡도의 패턴은 포착하기 어렵다.
          반면 FT-Transformer는 L=3, d=192, H=8 설정에서도 수백만 파라미터 → 복잡한 피처 상호작용 모델링 가능.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">조건 2: 고카디널리티 범주형 + 엔티티 임베딩</h3>
        <p>
          범주형 피처의 카디널리티(고유 값 수)가 높을수록 DL의 이점이 커진다.
        </p>
        <p>
          <strong>GBM 접근</strong> — 원핫 인코딩 → 차원 폭발 / 타겟 인코딩 → 과적합 위험 / CatBoost의 순서형 인코딩이 최선이지만 한계 존재<br />
          <strong>DL 접근</strong> — 엔티티 임베딩(Entity Embedding, Guo & Berkhahn, 2016): 범주를 저차원 밀집 벡터로 학습<br />
          "서울"과 "경기"가 가까운 벡터, "서울"과 "제주"가 먼 벡터로 학습 — 지리적·의미적 유사도를 자동 포착
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold text-amber-800 dark:text-amber-200 mb-1">실전 팁: 임베딩 차원 공식</p>
          <p className="text-sm text-amber-700 dark:text-amber-300">
            <M>{'d_j = \\min(600, \\; \\text{round}(1.6 \\times C_j^{0.56}))'}</M><br />
            fastai 라이브러리의 경험적 공식. 카디널리티 <M>{'C_j'}</M>가 높을수록 임베딩 차원도 커지되 600을 상한으로 제한.
            예: 도시(100개) → d=16, 사용자 ID(100K) → d=600
          </p>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">조건 3: 멀티모달 입력</h3>
        <p>
          상품 추천: 상품 테이블(가격, 카테고리) + 상품 이미지 + 리뷰 텍스트<br />
          의료 진단: 환자 정보(나이, 혈압) + CT 이미지 + 의사 소견<br />
          이런 멀티모달 시나리오에서 GBM은 비정형 데이터를 직접 처리할 수 없다.
          DL은 각 모달리티에 적합한 인코더(ResNet, BERT)를 결합하여 end-to-end 학습이 가능하다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">조건 4: 사전학습 데이터 풍부</h3>
        <p>
          TabNet의 자기지도 사전학습, FT-Transformer의 전이 학습 —
          레이블 없는 대규모 데이터가 존재할 때 DL이 유리하다.
          GBM은 사전학습 개념 자체가 부재 — 항상 주어진 레이블 데이터에서 scratch 학습.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">실전 전략: GBM + DL 하이브리드</h3>
        <p>
          대부분의 Kaggle 상위 솔루션은 GBM과 DL을 <strong>대립이 아닌 협업</strong>으로 사용한다.
        </p>
        <p>
          <strong>전략 A: 앙상블</strong> — GBM 예측 + DL 예측을 가중 평균 또는 스태킹(stacking).
          오차 패턴이 상이하여 상호 보완 → 단독 대비 1~3% 향상이 일반적.
        </p>
        <p>
          <strong>전략 B: 임베딩 → GBM</strong> — DL(특히 엔티티 임베딩)을 피처 추출기로 사용.
          고카디널리티 범주형을 밀집 벡터로 변환 → 이 벡터를 LightGBM 입력에 추가.
          원핫 인코딩 대비 차원이 작고 의미적 유사도를 반영하여 GBM 성능 향상.
        </p>
        <p>
          <strong>전략 C: pseudo-labeling</strong> — DL의 softmax 출력(확률)을 unlabeled 데이터의
          pseudo label로 생성 → GBM 학습 데이터에 추가. 준지도 학습(semi-supervised) 효과.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">미래 방향: 학습 없는 추론</h3>
        <p>
          <strong>TabPFN</strong> (Hollmann et al., 2022) — Prior-Data Fitted Network<br />
          대규모 합성 데이터셋으로 사전학습된 Transformer.
          새 데이터셋을 context로 입력하면 학습 없이(zero-shot) 예측 — in-context learning.
          소규모(~10K) 데이터에서 XGBoost와 동등한 성능을 학습 시간 0으로 달성.
        </p>
        <p>
          <strong>TabR</strong> (Gorishniy et al., 2023) — Retrieval-augmented 접근<br />
          학습 데이터에서 유사 샘플을 검색(retrieval)하여 예측에 활용.
          kNN의 아이디어를 DL에 결합 — 비모수적(non-parametric) 요소 추가로 robustness 향상.
        </p>
      </div>

      <div className="not-prose my-8"><WhenDLWinsViz /></div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold text-amber-800 dark:text-amber-200 mb-1">최종 판단 기준</p>
          <p className="text-sm text-amber-700 dark:text-amber-300">
            ① 피처 엔지니어링이 모델 선택보다 중요 — 어떤 모델이든 좋은 피처가 성능의 70%를 결정<br />
            ② 교차 검증(cross-validation)으로 공정하게 비교 — 단일 split 결과는 편향될 수 있음<br />
            ③ 확신이 없으면 앙상블 — GBM + DL 조합이 단일 모델보다 항상 안전한 선택
          </p>
        </div>

        <p className="leading-7">
          요약 1: 데이터 <strong>100K+, 고카디널리티, 멀티모달</strong> 중 하나라도 해당 → DL 고려<br />
          요약 2: 임베딩 → GBM 파이프라인이 실전에서 가장 빈번한 <strong>하이브리드 전략</strong><br />
          요약 3: TabPFN·TabR 등 차세대 모델은 학습 없이 추론 — <strong>테이블 DL의 새로운 패러다임</strong>
        </p>
      </div>
    </section>
  );
}
