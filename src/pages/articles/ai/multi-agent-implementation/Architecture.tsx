import ArchitectureViz from './viz/ArchitectureViz';

export default function Architecture() {
  return (
    <section id="architecture" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">아키텍처 패턴: 계층형, 수평형, 파이프라인</h2>
      <div className="not-prose mb-8"><ArchitectureViz /></div>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-6 mb-3">계층형 (Hierarchical)</h3>
        <p className="leading-7">
          <strong>Orchestrator Agent</strong>가 사용자 요청을 분석하고, 하위 Worker Agent에게 작업을 위임한다.<br />
          Worker 간 직접 통신은 없으며 모든 결과가 Orchestrator를 경유한다.<br />
          장점: 흐름 추적이 명확하고 디버그가 용이. 책임 소재가 분명.<br />
          단점: Orchestrator가 병목이 될 수 있으며, 단일 실패 지점(SPOF)이 된다.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">수평형 (Peer-to-Peer)</h3>
        <p className="leading-7">
          모든 에이전트가 동등한 권한으로 메시지를 주고받는다.<br />
          토론(debate), 합의(consensus) 패턴에 적합. 예: 코드 리뷰에서 여러 에이전트가 의견을 교환.<br />
          장점: 유연하고 분산적. 한 에이전트 실패가 전체에 영향이 적다.<br />
          단점: 대화가 발산할 위험이 크고, 명시적 종료 조건을 설정해야 한다.
        </p>
        <h3 className="text-xl font-semibold mt-6 mb-3">파이프라인형 (Pipeline)</h3>
        <p className="leading-7">
          Agent A 출력이 Agent B 입력이 되고, Agent B 출력이 Agent C 입력이 되는 순차 구조.<br />
          ETL(Extract-Transform-Load)과 유사한 데이터 변환 흐름에 적합.<br />
          장점: 각 단계의 입출력이 명확하여 디버그가 가장 쉽다.<br />
          단점: 앞 단계 오류를 뒤에서 수정할 수 없다. 피드백 루프가 없다.
        </p>
        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>제조 현장 권장</strong> — 대부분 <strong>계층형</strong>이 적합하다.<br />
          이유: 제조 공정은 책임 추적(audit trail)이 필수이며, Orchestrator가 모든 판단 근거를 로깅할 수 있다.<br />
          예외: 단순 데이터 변환(센서 → 전처리 → 저장)은 파이프라인형이 더 경제적.
        </p>
      </div>
    </section>
  );
}
