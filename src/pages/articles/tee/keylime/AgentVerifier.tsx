import AgentVerifierViz from './viz/AgentVerifierViz';

export default function AgentVerifier() {
  return (
    <section id="agent-verifier" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">에이전트-검증자 아키텍처</h2>
      <p className="leading-7 mb-4">
        Keylime 핵심 — Agent/Verifier 간 지속적 검증 루프<br />
        Verifier — Tornado 웹 프레임워크 기반 비동기 서버<br />
        SQLAlchemy ORM으로 에이전트 상태 영속 관리
      </p>

      <AgentVerifierViz />

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded-xl border p-4">
          <h4 className="font-semibold text-sm mb-2">Agent 핵심 구조</h4>
          <ul className="space-y-1 text-sm">
            <li><strong>AgentAttestState</strong>: 증분 증명 상태 관리</li>
            <li><strong>TPMState</strong>: PCR 번호별 해시값 모델링</li>
            <li><strong>TPMClockInfo</strong>: 단조 클록으로 재생 공격 방지</li>
            <li><strong>ImaKeyrings</strong>: IMA 서명 검증용 키링</li>
          </ul>
        </div>
        <div className="rounded-xl border p-4">
          <h4 className="font-semibold text-sm mb-2">Verifier 핵심 구조</h4>
          <ul className="space-y-1 text-sm">
            <li><strong>AgentsHandler</strong>: REST API (GET/POST/DELETE/PUT)</li>
            <li><strong>VerfierMain</strong>: 에이전트별 정책/상태 DB 테이블</li>
            <li><strong>process_quote_response()</strong>: Quote 응답 검증</li>
            <li><strong>prepare_get_quote()</strong>: nonce 생성 & 요청 준비</li>
          </ul>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold mb-3">통신 보안</h3>
        <p className="leading-7">
          모든 컴포넌트 간 통신 — mTLS(상호 TLS 인증)로 보호<br />
          Agent — 자체 서명 인증서 생성<br />
          Verifier — Registrar에서 조회한 인증서로 Agent 인증<br />
          API 버전 협상으로 클라이언트-서버 간 호환성 보장
        </p>
      </div>
    </section>
  );
}
