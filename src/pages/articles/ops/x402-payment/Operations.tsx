export default function Operations() {
  return (
    <section id="operations" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">2. 운영 — Facilitator · 가격 정책 · 보안</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-8 mb-3">2-1. Facilitator 의 역할</h3>
        <ul className="leading-7">
          <li><strong>책임</strong> — EIP-3009 서명 검증, on-chain 제출, settle 추적, replay 방지.</li>
          <li><strong>옵션 1 — Coinbase CDP facilitator</strong> — 무료 (Coinbase 의 Base 트래픽 늘리기 사업). 서명 검증 + 제출 위임.</li>
          <li><strong>옵션 2 — 자가 호스팅</strong> — 의존성 0 + 검증 가능. 직접 RPC 노드 + indexer 운영.</li>
          <li><strong>옵션 3 — 다중 facilitator</strong> — 한 곳 다운 시 fallback. 신뢰 모델 분산.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">2-2. 가격 정책</h3>
        <ul className="leading-7">
          <li><strong>고정 가격</strong> — endpoint 별 단일 가격. 단순.</li>
          <li><strong>tier 가격</strong> — 호출량에 따라 할인. on-chain reputation 또는 off-chain credit.</li>
          <li><strong>dynamic pricing</strong> — 부하 / 시간대 / 클라이언트 reputation 기반. 더 복잡.</li>
          <li><strong>Bid auction</strong> — 클라이언트가 입찰 (peak 시 자동 가격 조정).</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">2-3. Replay 방지 (nonce 관리)</h3>
        <ul className="leading-7">
          <li><strong>EIP-3009 nonce</strong> — 사용자가 직접 생성한 unique 값. 이미 사용된 nonce 의 transferWithAuthorization 은 chain 이 거부.</li>
          <li><strong>서버 측 처리</strong> — nonce 사용 이력을 DB 에 기록. 같은 nonce 재요청 즉시 거부.</li>
          <li><strong>validBefore</strong> — 서명 만료 시간 (예: 5 분). 클라이언트 시계 어긋남 고려해 약간 여유.</li>
          <li><strong>chain reorg 대응</strong> — 결제 트랜잭션이 reorg 로 사라질 수 있음. 12 confirmation 후 settle 처리.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">2-4. 부분 환불 / 실패 처리</h3>
        <ul className="leading-7">
          <li><strong>API 실패 시</strong> — 서버가 응답 못 하면 결제도 환불. settle 전에 결과 보장.</li>
          <li><strong>옵션 A — settle 후 실패</strong> — 환불 트랜잭션 별도 (비용 추가).</li>
          <li><strong>옵션 B — escrow 패턴</strong> — 결제 받고 hold, 응답 성공 후 release.</li>
          <li><strong>옵션 C — 정산 큐</strong> — 일정 시간 후 batch settle. 그 사이 실패 케이스 자동 환불.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">2-5. 보안 — 클라이언트 wallet 노출</h3>
        <ul className="leading-7">
          <li><strong>위험</strong> — AI 에이전트 / browser 가 hot wallet 보유 시 침해 위험.</li>
          <li><strong>Spend limit</strong> — wallet 에 daily / weekly 한도. on-chain (Safe module) 또는 off-chain (정책 enforce).</li>
          <li><strong>Approve 한도</strong> — 무제한 approve 금지. 매 transferWithAuthorization 으로 정확한 amount.</li>
          <li><strong>Wallet hierarchy</strong> — 콜드 wallet → hot wallet 단방향 자동 충전. hot wallet 침해 시 손실 한도 명확.</li>
          <li><strong>MPC wallet</strong> — Privy · Magic 같은 솔루션. 사용자 측 키 + 서버 측 키 분산.</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">2-6. Audit 와 회계</h3>
        <ul className="leading-7">
          <li><strong>모든 결제 on-chain</strong> — 회계 / 세금 보고 자동화 가능.</li>
          <li><strong>endpoint 별 매출</strong> — facilitator 의 dashboard 또는 자가 indexer.</li>
          <li><strong>한국 부가세</strong> — 기업 운영 시 USDC 결제도 매출. 환산 + 신고 필요.</li>
          <li><strong>고객 ID 매칭</strong> — wallet address ↔ 고객 ID 의 mapping (KYC 가 필요한 사업이면).</li>
        </ul>

        <h3 className="text-xl font-semibold mt-8 mb-3">2-7. 흔한 함정</h3>
        <ul className="leading-7">
          <li><strong>nonce 충돌</strong> — 클라이언트가 random nonce 안 만들고 sequential 사용 → 충돌. 표준 라이브러리 사용 권장.</li>
          <li><strong>가스 보전 미스</strong> — facilitator 가 가스 내고 환불 못 받음. business model 명확히.</li>
          <li><strong>chain congestion</strong> — Base 도 가끔 congestion 으로 fee 폭증. fallback 가격 정책.</li>
          <li><strong>USDC depeg 위험</strong> — 옛 SVB 사태 같은 케이스. 결제 후 즉시 settle 또는 환산 정책.</li>
          <li><strong>regulatory uncertainty</strong> — 한국에서 USDC 결제 = 가상자산 거래로 분류. 사업자 등록 영향.</li>
        </ul>
      </div>
    </section>
  );
}
