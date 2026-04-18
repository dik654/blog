import EdaFlowViz from './viz/EdaFlowViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">탐색적 데이터 분석이란</h2>

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          대회 데이터를 받으면 가장 먼저 하는 일 — <strong>모델을 돌리는 것이 아니라 데이터를 보는 것</strong><br />
          EDA(Exploratory Data Analysis)는 데이터의 구조, 분포, 관계, 품질을 파악하고<br />
          "어떤 피처가 타겟에 영향을 주는가"에 대한 가설을 세우는 과정
        </p>
        <p>
          EDA 없이 모델을 돌리면 — 90개 피처 중 절반이 결측이어도 모르고,
          타겟이 극단적으로 치우쳐 있어도 RMSE가 왜 높은지 모른다<br />
          Kaggle/Dacon 상위권은 공통적으로 "EDA에 첫 24시간을 투자한다"고 말한다
        </p>
      </div>

      <div className="not-prose my-8">
        <EdaFlowViz />
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-6">
        <h3 className="text-xl font-semibold mt-6 mb-3">EDA의 목적</h3>
        <p>
          단순한 시각화가 아니다 — EDA의 진짜 목적은 세 가지:<br />
        </p>
        <ul>
          <li><strong>데이터 품질 진단</strong> — 결측, 이상치, 중복, 타입 오류를 조기에 발견</li>
          <li><strong>피처-타겟 관계 파악</strong> — 어떤 변수가 예측에 유용한지 1차 필터링</li>
          <li><strong>파생 피처 아이디어 도출</strong> — 원본 피처의 패턴에서 새 피처를 발상</li>
        </ul>
        <p>
          "창고 출고 지연 예측" 대회를 예로 들면 — 90개 피처(로봇 상태, 주문량, 배터리, 혼잡도)를 받고,
          각 피처의 분포와 타겟과의 관계를 파악한 뒤, "혼잡도 × 배터리 잔량" 같은 인터랙션 피처를 만들어내는 것까지가 EDA
        </p>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
        <p className="font-semibold mb-2">실전 팁: pandas profiling 자동 EDA</p>
        <p className="text-sm">
          <code>ydata-profiling</code> (구 pandas-profiling)을 쓰면 한 줄로 전체 리포트 생성 가능<br />
          하지만 자동 리포트만으로는 "왜"를 알 수 없다 — 자동 리포트로 전체를 훑고, 의심 가는 부분을 수동 EDA로 파고드는 2단계 접근이 효과적
        </p>
      </div>
    </section>
  );
}
