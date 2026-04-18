import OverviewViz from './viz/OverviewViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">멀티 에이전트가 왜 필요한가</h2>
      <div className="not-prose mb-8"><OverviewViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          단일 LLM에 10개 이상의 도구를 부여하면 <strong>프롬프트 길이 폭발 + 도구 혼선</strong>이 발생한다.<br />
          "장비 매뉴얼 검색 + 센서 분석 + 조치 판단"을 하나의 에이전트에 맡기면, 도구 설명만으로 context window의 30% 이상을 소모한다.
          나머지 70%로 실제 추론을 해야 하므로 hallucination 빈도가 급증.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">왜 역할을 나누는가</h3>
        <p className="leading-7">
          각 에이전트에 <strong>하나의 역할 + 2-3개 전문 도구</strong>만 부여하면 프롬프트가 단순해진다.<br />
          검색 에이전트는 VectorDB만, 분석 에이전트는 pandas만, 판단 에이전트는 보고서 생성만 담당.<br />
          결과: 도구 혼선 제거, 프롬프트 길이 50% 이하로 축소, 각 에이전트의 정확도 향상.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">제조 현장의 3대 과제</h3>
        <p className="leading-7">
          <strong>품질 관리</strong> — 불량 탐지 후 원인 분석까지 자동화. 이미지 검사 + 공정 파라미터 상관분석.<br />
          <strong>예지 보전</strong>(Predictive Maintenance) — 센서 이상 징후를 조기에 탐지하여 계획 정비. 비계획 정지 시간 감소.<br />
          <strong>공정 최적화</strong> — 수율(yield) 최대화를 위한 파라미터 조정. 실시간 피드백 루프.
        </p>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>왜 멀티 에이전트가 제조에 적합한가</strong> — 제조 현장은 매뉴얼(비정형 텍스트) + 센서(정형 시계열) + 규정(룰 기반)이 혼합된 도메인.<br />
          하나의 LLM으로 세 종류의 데이터를 모두 처리하기보다, 각 데이터 유형에 특화된 에이전트를 두는 것이 효과적.
        </p>
      </div>
    </section>
  );
}
