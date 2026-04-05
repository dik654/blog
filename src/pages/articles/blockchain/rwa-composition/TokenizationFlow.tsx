import { ModuleBox, DataBox, ActionBox, AlertBox } from '@/components/viz/boxes';

export default function TokenizationFlow() {
  return (
    <section id="tokenization-flow" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">토큰화 프로세스 — SPV, legal wrapper</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">RWA 토큰화의 핵심 과제</h3>
        <p>
          "실물 자산 → 온체인 토큰" 변환은 <strong>법적·기술적 복잡성</strong> 해결 필요:
        </p>
        <p>
          1. <strong>법적 구조</strong>: 토큰 보유자가 실제 자산 소유권 주장 가능?<br />
          2. <strong>신뢰</strong>: 발행사가 자산을 실제 보유하는지 보장?<br />
          3. <strong>유동성</strong>: 환매(redemption) 메커니즘<br />
          4. <strong>규제</strong>: 증권법·자금세탁방지 준수
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">SPV — Special Purpose Vehicle</h3>
        <p>
          SPV: 토큰화 목적만을 위해 설립된 <strong>법인 격리체</strong><br />
          - 원본 회사(Issuer)와 분리 → 발행사 파산 시 자산 보호<br />
          - 자산만 보유, 다른 사업 금지<br />
          - 통상 Cayman, BVI, Delaware 등에 설립
        </p>

        <div className="not-prose my-6 rounded-lg border border-border bg-card p-4">
          <svg viewBox="0 0 480 260" className="w-full h-auto" style={{ maxWidth: 640 }}>
            <text x={240} y={18} textAnchor="middle" fontSize={11} fontWeight={700}
              fill="var(--foreground)">RWA 토큰화 4계층 구조</text>

            <defs>
              <marker id="rwa-arr" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                <path d="M0,0 L5,3 L0,6" fill="#3b82f6" />
              </marker>
            </defs>

            {/* Layer 1: 실물 자산 */}
            <ModuleBox x={30} y={40} w={130} h={40}
              label="Layer 1: 실물 자산"
              sub="T-bills, Real Estate"
              color="#6b7280" />

            {/* Layer 2: SPV */}
            <ModuleBox x={175} y={40} w={130} h={40}
              label="Layer 2: SPV"
              sub="법적 소유권 격리"
              color="#f59e0b" />

            {/* Layer 3: Issuer */}
            <ModuleBox x={320} y={40} w={130} h={40}
              label="Layer 3: Issuer"
              sub="Ondo, BlackRock 등"
              color="#8b5cf6" />

            {/* 화살표 */}
            <line x1={160} y1={60} x2={175} y2={60} stroke="#3b82f6" strokeWidth={1.2} markerEnd="url(#rwa-arr)" />
            <line x1={305} y1={60} x2={320} y2={60} stroke="#3b82f6" strokeWidth={1.2} markerEnd="url(#rwa-arr)" />

            <text x={168} y={56} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">보유</text>
            <text x={313} y={56} textAnchor="middle" fontSize={7} fill="var(--muted-foreground)">운용</text>

            {/* Layer 4: Tokens */}
            <DataBox x={30} y={120} w={420} h={40}
              label="Layer 4: On-chain Tokens"
              sub="ERC-20 / ERC-1400 (security token)"
              color="#10b981" />

            <line x1={385} y1={80} x2={240} y2={120} stroke="#10b981" strokeWidth={1.5} markerEnd="url(#rwa-arr)" />
            <text x={310} y={102} textAnchor="middle" fontSize={7}
              fill="var(--muted-foreground)">mint</text>

            {/* 사용자 */}
            <ActionBox x={30} y={190} w={420} h={40}
              label="사용자 / DeFi 프로토콜"
              sub="구매 · 거래 · 담보 활용"
              color="#3b82f6" />

            <line x1={240} y1={160} x2={240} y2={190} stroke="#3b82f6" strokeWidth={1.2} markerEnd="url(#rwa-arr)" />

            <text x={240} y={250} textAnchor="middle" fontSize={7}
              fill="var(--muted-foreground)">SPV 격리 → Issuer 파산해도 토큰 보유자 자산 보호</text>
          </svg>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Legal Wrapper — 토큰 = 소유권 증명</h3>
        <p>
          Legal Wrapper: 토큰 보유 = SPV 지분 보유를 <strong>법적으로 보장</strong>하는 계약<br />
          구조:
        </p>
        <p>
          <strong>1. 발행 계약 (Subscription Agreement)</strong><br />
          투자자가 SPV 지분 매수 시 서명<br />
          토큰은 SPV 지분의 <strong>digital representation</strong>
        </p>
        <p>
          <strong>2. Trust Deed / Custody Agreement</strong><br />
          커스터디언(BNY Mellon, State Street 등)이 실물 자산 보관<br />
          SPV와 커스터디언 간 계약 — 자산 이동 제한
        </p>
        <p>
          <strong>3. Token Offering Memorandum</strong><br />
          토큰 보유자의 권리 명시: 수익 분배, 환매권, 청산 시 우선순위<br />
          SEC Reg D, Reg S 등 증권법 제출
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">토큰 표준 — ERC-20 vs ERC-1400</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">표준</th>
                <th className="border border-border px-3 py-2 text-left">특징</th>
                <th className="border border-border px-3 py-2 text-left">사용</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">ERC-20</td>
                <td className="border border-border px-3 py-2">Fungible, transfer 자유</td>
                <td className="border border-border px-3 py-2">USDC, USDT (stablecoin)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">ERC-1400</td>
                <td className="border border-border px-3 py-2">Security token, KYC 강제</td>
                <td className="border border-border px-3 py-2">Ondo OUSG, Franklin BENJI</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">ERC-3643 (T-REX)</td>
                <td className="border border-border px-3 py-2">Permissioned, on-chain identity</td>
                <td className="border border-border px-3 py-2">Polymath, Tokeny</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">ERC-4626</td>
                <td className="border border-border px-3 py-2">Tokenized vault</td>
                <td className="border border-border px-3 py-2">sDAI, yield-bearing RWA</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">환매(Redemption) 메커니즘</h3>
        <p>
          <strong>T+0 즉시 환매</strong> (BUIDL, BENJI):<br />
          - 온체인에서 토큰 burn → 스테이블코인 전송<br />
          - 최소 금액 제한 있음 ($100K+ 기관용)
        </p>
        <p>
          <strong>T+1 일일 환매</strong> (OUSG, USTB):<br />
          - 발행사에 요청 → 다음 영업일 USD 지급<br />
          - 자산이 MMF이므로 일일 환매 가능
        </p>
        <p>
          <strong>T+N 주기적 환매</strong> (부동산, private credit):<br />
          - 월별 또는 분기별 환매 창구<br />
          - 자산 유동성 낮아서 즉시 불가
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: RWA = "법적 fiction + 기술적 인프라"</p>
          <p>
            RWA 토큰의 본질: <strong>법적 권리의 디지털 표현</strong><br />
            - 토큰 자체는 가치 없음 — 법적 계약이 가치 원천<br />
            - 스마트 컨트랙트 = 소유권 이전 도구일 뿐<br />
            - 실제 자산 회수는 여전히 전통 법 시스템 의존
          </p>
          <p className="mt-2">
            <strong>리스크</strong>:<br />
            ✗ SPV 관할국 법 변경<br />
            ✗ 커스터디언 파산<br />
            ✗ 토큰-법적 권리 불일치 (계약 공백)<br />
            ✗ 규제 변경 (Reg D → 새 규제)
          </p>
          <p className="mt-2">
            "RWA는 crypto가 아니라 <strong>crypto-wrapped TradFi</strong>" — 모든 기존 리스크 상속
          </p>
        </div>

      </div>
    </section>
  );
}
