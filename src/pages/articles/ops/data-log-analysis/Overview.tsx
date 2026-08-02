import AnalysisFlowViz from './viz/AnalysisFlowViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">개요 — DB / 로그 직접 조회 + AI 행위 분석 역량</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          채용 공고에 자주 나오는 항목 — &quot;데이터 (DB · 로그) 직접 조회 + AI 에이전트 행위 / LLM 이벤트 / 네트워크 로그를 분석할 수 있는 사람&quot;.
          <br />
          이 역량의 본질은 <strong>도구 사용 능력 + 가설 수립 + cross-validation</strong> 이다. 이 글은 실전 분석 패턴을 정리.
        </p>
      </div>

      <AnalysisFlowViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-10">
        <h3 className="text-xl font-semibold mt-8 mb-3">왜 이 역량이 중요한가</h3>
        <ul className="leading-7">
          <li><strong>대시보드의 한계</strong> — 미리 만들어진 차트로 못 보는 영역이 사고의 80%. ad-hoc 쿼리 능력이 필수.</li>
          <li><strong>AI 시스템의 새 영역</strong> — 에이전트 / LLM 의 trace 분석은 기존 SRE 도구가 미흡. 직접 jq · pandas · SQL 로 파야 함.</li>
          <li><strong>비용 영향</strong> — 분석가가 못 하면 매번 엔지니어 호출. response 시간 ↑.</li>
          <li><strong>의사결정 속도</strong> — 데이터 보고 30 분 안에 가설 좁히는 사람이 product 결정도 빠름.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">목차</h3>
        <ol className="leading-7">
          <li><strong>SQL 분석 패턴</strong> — window function · CTE · join 전략 · explain plan 으로 prod query 작성.</li>
          <li><strong>로그 분석 도구</strong> — jq · awk · grep · ripgrep · log stream (Loki · CloudWatch).</li>
          <li><strong>AI 에이전트 trace 분석</strong> — session reconstruction · token / tool 시퀀스 · feedback 신호.</li>
          <li><strong>네트워크 로그 분석</strong> — flow log + 5-tuple · top talker · DNS query · JA3.</li>
          <li><strong>실전 시나리오</strong> — 5 가지 사고 케이스의 단계별 쿼리.</li>
        </ol>
      </div>
    </section>
  );
}
