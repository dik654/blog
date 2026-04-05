export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">RWA란 &amp; 시장 규모</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">Real World Assets (RWA) 정의</h3>
        <p>
          RWA: <strong>오프체인 실물 자산을 블록체인 토큰으로 표현</strong>한 것<br />
          예: 미국 국채, 기업 대출, 부동산, 금, 아트, 인보이스 등<br />
          DeFi 유동성·컴포저빌리티 + 전통 금융 자산의 수익·안정성 결합
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">시장 규모 (2025년 기준)</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">자산 유형</th>
                <th className="border border-border px-3 py-2 text-right">온체인 TVL</th>
                <th className="border border-border px-3 py-2 text-left">주요 프로토콜</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">미국 국채 (T-bills)</td>
                <td className="border border-border px-3 py-2 text-right">$7B+</td>
                <td className="border border-border px-3 py-2">Ondo, Superstate, Franklin</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Private Credit</td>
                <td className="border border-border px-3 py-2 text-right">$14B+</td>
                <td className="border border-border px-3 py-2">Maple, Centrifuge, Goldfinch</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">부동산</td>
                <td className="border border-border px-3 py-2 text-right">$300M+</td>
                <td className="border border-border px-3 py-2">RealT, Propy, Tangible</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">금/원자재</td>
                <td className="border border-border px-3 py-2 text-right">$1.2B+</td>
                <td className="border border-border px-3 py-2">PAXG, XAUT, Tether Gold</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Stablecoin (Tokenized USD)</td>
                <td className="border border-border px-3 py-2 text-right">$200B+</td>
                <td className="border border-border px-3 py-2">USDC, USDT, USDS</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          * 총 RWA TVL (스테이블코인 제외): $25B+ · 스테이블 포함: $225B+
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">RWA의 세 가지 이점</h3>
        <p>
          <strong>1. DeFi에 안정적 수익원 제공</strong><br />
          크립토 yield는 market dynamics 의존 (perp funding, staking) — 변동성 ↑<br />
          국채 금리는 안정적 (Fed rate 기반) — 5-6% 꾸준함<br />
          DeFi 프로토콜이 RWA로 treasury 운용 — 지속 가능한 yield
        </p>
        <p>
          <strong>2. TradFi에 새 유동성 창출</strong><br />
          비유동 자산(부동산, private credit)의 토큰화 → 분할 소유·거래 가능<br />
          기존: 부동산 거래 수주일, 최소 $100K+<br />
          RWA: 24/7 거래, $10+ 부분 소유
        </p>
        <p>
          <strong>3. 크로스보더 결제 &amp; 투자</strong><br />
          신흥국 투자자도 온체인으로 미국 국채 접근<br />
          전통 금융 장벽(은행 계좌, KYC) 우회 (일부 규제 이슈)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">RWA 생태계 계층</h3>
        <p>
          <strong>Layer 1: 원자산 보유 기관</strong><br />
          BlackRock, Franklin Templeton, Fidelity — 실제 T-bills·부동산 보유<br />
          SPV (Special Purpose Vehicle) 설립하여 자산 격리
        </p>
        <p>
          <strong>Layer 2: 토큰화 발행사</strong><br />
          Ondo, Superstate, Backed — SPV 자산을 토큰으로 래핑<br />
          법적 소유권 보장 + 블록체인 인터페이스
        </p>
        <p>
          <strong>Layer 3: DeFi 프로토콜</strong><br />
          MakerDAO, Aave, Morpho — RWA 토큰을 담보/수익 자산으로 통합<br />
          유저는 토큰화된 RWA를 DeFi에서 직접 활용
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: RWA의 패러다임 전환</p>
          <p>
            "Crypto가 TradFi를 대체한다"에서 <strong>"Crypto가 TradFi를 포용한다"</strong>로 전환<br />
            과거 (2020-2022): DeFi가 TradFi 대비 우위 강조 → crypto-native 자산만<br />
            현재 (2023-2025): <strong>RWA가 crypto의 성숙 단계</strong> — 전통 자산과 공존
          </p>
          <p className="mt-2">
            <strong>시사점</strong>:<br />
            - 규제 준수 점증 (KYC, AML 필수)<br />
            - 전통 금융 기관과의 파트너십 확대<br />
            - CBDC와의 경쟁·협력 구도 형성
          </p>
        </div>

      </div>
    </section>
  );
}
