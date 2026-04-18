import EdaChecklistViz from './viz/EdaChecklistViz';

export default function EdaPhase() {
  return (
    <section id="eda-phase" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">EDA 단계: 첫 24시간</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          <strong>EDA</strong>(Exploratory Data Analysis, 탐색적 데이터 분석) — 데이터를 처음 받고 24시간 안에 핵심을 파악하는 단계<br />
          목표: 데이터 구조 이해 + 타겟 특성 파악 + 핵심 가설 3개 수립
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">데이터 크기와 타입</h3>
        <p>
          <code>df.shape</code>로 행/열 수, <code>df.info()</code>로 dtype과 메모리 확인<br />
          행 10K 이하 → 간단한 모델로 충분, 1M+ → 메모리 최적화(float32, Parquet)와 샘플링 전략 필요<br />
          피처 10개 → 수동 EDA 가능, 500+ → 자동화 파이프라인 필수
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">타겟 분포와 결측 패턴</h3>
        <p>
          분류: 클래스 비율 확인 — 90:10 불균형이면 Focal Loss / SMOTE / threshold 최적화 검토<br />
          회귀: 분포 왜도(skewness) 확인 — 로그정규분포면 <code>np.log1p</code> 변환이 RMSE를 크게 줄임<br />
          결측: 80%+ 결측 피처는 제거 후보, 결측 패턴 자체가 유의미한 피처일 수 있음
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">커뮤니티 인사이트 수집</h3>
        <p>
          Kaggle Discussion에서 호스트 Q&A, 데이터 오류 리포트, 외부 데이터 허용 여부 확인<br />
          상위 공개 노트북에서 검증된 피처/전처리 방법을 빠르게 흡수 — 바퀴를 재발명하지 않는다<br />
          핵심: 복붙이 아니라 <strong>"왜 이렇게 했는지"</strong>를 이해해야 변형/개선이 가능
        </p>
      </div>
      <div className="not-prose my-8">
        <EdaChecklistViz />
      </div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p>
          EDA 완료 기준: 데이터 크기/타입 파악 + 타겟 분포 이해 + 결측/상관 분석 + 가설 3개 수립<br />
          이 기준을 충족하면 — 다음 단계(베이스라인)로 즉시 이동. EDA에 3일 쓰는 건 시간 낭비
        </p>
      </div>
    </section>
  );
}
