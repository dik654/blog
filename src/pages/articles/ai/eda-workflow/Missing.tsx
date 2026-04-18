import MissingViz from './viz/MissingViz';

export default function Missing() {
  return (
    <section id="missing" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">결측치 패턴 분석</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          결측치(missing value)는 단순한 빈 칸이 아니다 — <strong>왜 비어 있는가</strong>가 핵심 정보<br />
          결측 메커니즘(mechanism)에 따라 처리 전략이 완전히 다르다
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">3가지 결측 메커니즘</h3>
        <p>
          <strong>MCAR(Missing Completely At Random)</strong> — 결측이 완전히 무작위. 센서 일시 오작동 등<br />
          <strong>MAR(Missing At Random)</strong> — 관측된 다른 변수에 의존. 특정 로봇 타입에 센서가 없는 경우<br />
          <strong>MNAR(Missing Not At Random)</strong> — 결측값 자체에 의존. 배터리가 낮으면 배터리 센서가 꺼지는 경우
        </p>
        <p>
          MNAR일 때 결측 여부 자체가 예측 변수 — <code>is_missing</code> 이진 피처를 만들면 성능이 오르는 이유
        </p>
      </div>

      <div className="not-prose my-8">
        <MissingViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">결측 처리 실전 전략</h3>
        <p>
          결측률 50% 이상 — 피처 자체를 제거하되, <code>is_missing</code> 피처만 남길 수 있음<br />
          결측률 10~50% — 메커니즘에 따라 대체 방법 선택:
        </p>
        <ul>
          <li><strong>중앙값/평균 대체</strong> — 가장 단순. MCAR이고 결측이 적을 때 적합</li>
          <li><strong>KNN Imputer</strong> — 유사한 샘플의 값으로 대체. MAR에 효과적</li>
          <li><strong>Iterative Imputer</strong> — 다른 피처를 입력으로 결측을 예측. MICE 알고리즘 기반</li>
          <li><strong>-999 대체</strong> — GBM 전용. 트리가 결측을 별도 분기로 학습</li>
        </ul>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="font-semibold mb-2">실전 팁: LightGBM의 결측 처리</p>
        <p className="text-sm">
          LightGBM은 결측값을 별도로 처리하는 로직이 내장 — NaN을 그대로 넣어도 학습 가능<br />
          트리 분할 시 결측 샘플을 왼쪽/오른쪽 중 손실이 작은 쪽으로 보내는 방식<br />
          그래서 -999 대체보다 NaN 유지가 더 나은 경우가 많다 (불필요한 정보 주입 방지)
        </p>
      </div>
    </section>
  );
}
