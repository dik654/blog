export default function DefiIntegration() {
  return (
    <section id="defi-integration" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">DeFi 통합 — MakerDAO, Ondo, Centrifuge</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">MakerDAO — RWA 도입의 선구자</h3>
        <p>
          2021년부터 RWA 담보 도입 — <strong>DAI 수익률 제공의 핵심</strong><br />
          2024년 기준: DAI 담보의 30%+ 가 RWA<br />
          주요 파트너: Monetalis, BlockTower, Centrifuge
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">MakerDAO RWA Vault 구조</h3>
        <p>
          <strong>Monetalis Clydesdale</strong> (가장 큰 RWA vault):<br />
          - 규모: $1B+ (단일 vault)<br />
          - 자산: 미국 단기 국채 ETF (SHV, CLTL 등)<br />
          - 구조: UK LLP → 브로커리지 계좌 → ETF 보유<br />
          - 수익: ~5% APY → DAI Stability Fee로 유입
        </p>
        <p>
          <strong>BlockTower Andromeda</strong>:<br />
          - 규모: $1.2B<br />
          - 자산: 미국 국채 직접 보유 (Ally Bank 커스터디)<br />
          - 활성 운용 — duration 관리
        </p>
        <p>
          <strong>Centrifuge-based Vaults</strong>:<br />
          - 규모: 약 $50M<br />
          - 자산: New Silver (fix-and-flip 부동산), Harbor Trade 등<br />
          - 수익: 8-12% APY (Private Credit)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">MakerDAO RWA 통합 흐름</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// MakerDAO의 RWA Vault 통합

Step 1: SubDAO 파트너 선정 (거버넌스 투표)
  - 파트너: 기존 금융 회사 (Monetalis, BlockTower)
  - 실사: audit, legal review
  - 파라미터 설정: debt ceiling, fee

Step 2: Vault 설립
  - SPV 설립 (UK LLP, Cayman 등)
  - 커스터디언 계약
  - MakerDAO가 SPV에 DAI 대출

Step 3: 자산 매수
  - SPV가 국채/ETF 매수
  - 수익 발생 시작

Step 4: 수익 분배
  - 국채 이자 → SPV → MakerDAO
  - Stability Fee 형태로 protocol surplus 기여
  - 일부 → DSR (DAI 보유자 이자)

Step 5: 환매 시
  - DAI 상환 → SPV 청산
  - 자산 매도 후 원금 + 이익 정산`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Ondo Finance — TradFi to DeFi Bridge</h3>
        <p>
          Ondo의 상품:<br />
          - <strong>USDY</strong>: 단기 국채 담보 yield-bearing stablecoin ($600M+)<br />
          - <strong>OUSG</strong>: 전문 투자자용 BlackRock ETF 노출 ($600M+)
        </p>
        <p>
          <strong>USDY 구조</strong>:
        </p>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// USDY (Ondo US Dollar Yield)
담보: 미국 단기 국채 + 은행 예치금
수익: 약 5% APY (Fed rate 추종)
이자 지급: rebase 형태 (토큰 수량 증가)
KYC: 필수 (미국인 제외, 인증된 투자자만)

// 구조
User → USD 입금 → Ondo SPV
SPV → BlackRock USDXX MMF 매수
SPV → USDY mint (User 수신)

// USDY는 전송 가능 (transferable)
→ Uniswap에서 거래
→ Morpho에서 담보로 사용
→ DeFi legos 통합`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Centrifuge — SME 대출 토큰화</h3>
        <p>
          Centrifuge: 실물 담보 기반 대출을 <strong>온체인 투자 가능 자산</strong>으로 변환<br />
          구조:
        </p>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Centrifuge 풀 구조 (예: New Silver)

Asset Originator (New Silver):
  - 부동산 개발자에게 단기 대출
  - 대출 계약서를 NFT로 발행 (asset tokenization)

Pool (Tinlake):
  - NFT들을 풀에 예치
  - 투자자들이 Pool 토큰 구매
  - 2 tranches: Senior (안전) + Junior (고수익)

Investor:
  - Senior Tranche: 5-7% APY (안정)
  - Junior Tranche: 15-20% APY (risk buffer)

  DAI 예치 → DROP (Senior) 또는 TIN (Junior) 받음

MakerDAO 통합:
  - DROP을 담보로 사용 가능
  - MakerDAO가 Centrifuge에 DAI 공급
  - Centrifuge가 SME 대출 집행`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Aave ARC / GHO RWA</h3>
        <p>
          <strong>Aave ARC</strong> (지금은 deprecated): 기관 전용 permissioned pool<br />
          <strong>GHO RWA</strong>: Aave의 stablecoin GHO를 RWA로 백업하는 실험<br />
          Spark Protocol (Aave fork) — sDAI(Maker DSR) 담보 → RWA 수익 우회 노출
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">RWA 통합 시 DeFi 프로토콜의 이점</h3>
        <p>
          <strong>1. Treasury Yield</strong><br />
          크립토 yield는 시장 의존적 — 베어마켓엔 저조<br />
          RWA는 일정 수익 (국채 금리) → 프로토콜 지속가능성 ↑
        </p>
        <p>
          <strong>2. 사용자에게 실제 수익 분배</strong><br />
          sDAI, USDY 등 yield-bearing 토큰 제공<br />
          "DeFi 보유 = 이자" 표준화
        </p>
        <p>
          <strong>3. 시장 확장</strong><br />
          기관 투자자가 DeFi 진입 장벽 낮아짐<br />
          "crypto에 exposure 없는" 사용자도 참여 가능
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: RWA가 DeFi에 미치는 구조적 영향</p>
          <p>
            <strong>장기적 변화</strong>:
          </p>
          <p className="mt-2">
            1. <strong>DeFi 수익률의 RWA 수렴</strong><br />
            크립토 yield ≈ Fed 금리 + 리스크 프리미엄<br />
            "무위험 DeFi"의 벤치마크가 국채 금리로 고정
          </p>
          <p className="mt-2">
            2. <strong>규제의 온체인 침투</strong><br />
            RWA 통합 = KYC/AML 필수<br />
            permissioned DeFi 풀 증가 — 비허가 이상에 대한 도전
          </p>
          <p className="mt-2">
            3. <strong>기관 자본 유입</strong><br />
            BlackRock, Fidelity, Franklin이 DeFi 참여<br />
            생태계 전문화·제도화 가속
          </p>
          <p className="mt-2">
            <strong>찬반 논쟁</strong>: "DeFi가 TradFi에 흡수되는가" vs "DeFi가 TradFi를 개편하는가"<br />
            실제로는 <strong>공존 시스템</strong> — 각자 장점 활용
          </p>
        </div>

      </div>
    </section>
  );
}
