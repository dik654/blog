export default function Protocol() {
  return (
    <section id="protocol" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">1. 프로토콜 — HTTP 402 + EIP-3009 결합</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          x402 는 두 표준의 결합 — HTTP 402 + EIP-3009.
          <br />
          서버는 결제 요구를 표준 응답에 박고, 클라이언트는 off-chain 서명으로 즉시 응답.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">1-1. 1 차 요청 + 402 응답</h3>
        <p className="leading-7">
          클라이언트가 평소처럼 GET / POST. 서버는 결제 안 됐으면 402 + payment header.
        </p>
        <ul className="leading-7">
          <li><code>HTTP/1.1 402 Payment Required</code></li>
          <li><code>X-Accept-Payment: ...</code> — 받을 수 있는 결제 종류 (chain · asset · price · recipient · nonce)</li>
          <li>응답 본문에 사람이 읽을 수 있는 안내 (선택)</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">1-2. EIP-3009 transferWithAuthorization</h3>
        <p className="leading-7">
          USDC / DAI 같은 토큰의 표준. 사용자가 <strong>off-chain 으로 서명</strong>하면 누구든 그 서명을 on-chain 에 제출해 transfer 실행 가능.
        </p>
        <ul className="leading-7">
          <li><strong>사용자 입장</strong> — 가스 직접 안 냄. 서명만.</li>
          <li><strong>서버 / facilitator 입장</strong> — 서명 받아 on-chain 에 제출하고 가스 부담 (또는 사용자가 별도 보전).</li>
          <li><strong>nonce</strong> — replay 방지. 사용자별 + asset별 unique nonce 관리.</li>
          <li><strong>validBefore / validAfter</strong> — 서명 유효 기간.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">1-3. 2 차 요청 + X-PAYMENT</h3>
        <p className="leading-7">
          클라이언트가 같은 endpoint 에 X-PAYMENT 헤더로 서명 첨부.
        </p>
        <ul className="leading-7">
          <li><code>X-PAYMENT: base64(payment_payload)</code></li>
          <li>payload 에 EIP-3009 서명 + recipient + amount + nonce + sig.</li>
          <li>서버는 facilitator 에 검증 요청 → 통과 시 200 응답.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">1-4. Settlement 모드</h3>
        <ul className="leading-7">
          <li><strong>즉시 settle</strong> — 매 호출마다 on-chain. 가장 명확, 가스 비용 누적.</li>
          <li><strong>Batch settle</strong> — 여러 결제를 모아 한 번에 on-chain. 가스 절약, 정산 지연.</li>
          <li><strong>Off-chain credit</strong> — 서명만 받고 후일정 settle. 신뢰 모델 추가됨.</li>
          <li><strong>Streaming payment</strong> — Sablier / Superfluid 같은 흐름 결제. 시간당 누적.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">1-5. 지원 chain · asset</h3>
        <ul className="leading-7">
          <li><strong>표준 — Base + USDC</strong>. 가스 $0.001 수준 micropayment 가능.</li>
          <li>Optimism · Arbitrum · Polygon 도 EIP-3009 지원 토큰이면 가능.</li>
          <li>Solana 는 다른 메커니즘 (BPay 같은 표준 시도 중) — 같은 컨셉, 다른 구현.</li>
          <li>Ethereum L1 은 가스 비용으로 micropayment 부적합.</li>
        </ul>
      </div>
    </section>
  );
}
