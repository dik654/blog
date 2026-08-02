import X402FlowViz from './viz/X402FlowViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">x402 — HTTP 402 + 온체인 micropayment</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <p className="leading-7">
          x402 는 HTTP 의 잠자던 status code <strong>402 Payment Required</strong> 를 살린 결제 프로토콜.
          <br />
          Coinbase 가 2024 ~ 2025 에 표준화 + 오픈소스 공개. AI 에이전트가 API 호출 단위로 결제 가능한 형태.
          <br />
          API key + 월 구독의 시대를 미들웨어 기반 micropayment 로 바꾸려는 시도.
        </p>
      </div>

      <X402FlowViz />

      <div className="prose prose-neutral dark:prose-invert max-w-none mt-10">
        <h3 className="text-xl font-semibold mt-8 mb-3">왜 x402 인가</h3>
        <ul className="leading-7">
          <li><strong>AI 에이전트 시대</strong> — Claude / GPT 같은 에이전트가 동적으로 외부 API 호출. API key 발급 / 정산 / 한도 관리가 사람 개입 없는 자동화 필요.</li>
          <li><strong>Micropayment 의 부활</strong> — 옛 micropayment 는 결제 인프라 (Visa) 가 max $0.30 transaction fee 로 막힘. L2 (Base · Optimism) 는 $0.001 fee 로 가능.</li>
          <li><strong>Coinbase 의 사업 의도</strong> — USDC 결제망 표준화 + Base L2 trafifc 증대 + facilitator 수익.</li>
          <li><strong>HTTP 표준</strong> — 402 가 RFC 7231 에 예약돼 있었지만 사용 사례 없음. x402 가 첫 표준 케이스.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">목차</h3>
        <ol className="leading-7">
          <li><strong>프로토콜</strong> — HTTP 402 + payment header + retry. EIP-3009 transferWithAuthorization.</li>
          <li><strong>Facilitator 의 역할</strong> — 서명 검증 + on-chain settle. self-host vs Coinbase 사용.</li>
          <li><strong>구현</strong> — Express / Next.js middleware 통합. 서버 측 코드 ~10 줄.</li>
          <li><strong>운영 고려</strong> — replay 방지 (nonce) · 가격 정책 · 부분 환불 · audit · 한도.</li>
          <li><strong>유스 케이스</strong> — AI 에이전트 API 호출 · 콘텐츠 unlock · IoT 디바이스 결제 · LLM 추론 marketplace.</li>
        </ol>
      </div>
    </section>
  );
}
