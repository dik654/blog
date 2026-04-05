import CdpViz from './viz/CdpViz';

export default function CryptoBacked() {
  return (
    <section id="crypto-backed" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">암호자산 담보 (DAI)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <CdpViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">DAI — 최초의 탈중앙 스테이블코인</h3>
        <p>
          DAI (2017년 출시, MakerDAO): <strong>암호자산 담보로 발행되는 USD-pegged 토큰</strong><br />
          특징: 은행 없음, 중앙 권한 없음 (DAO 거버넌스만), ETH 등 크립토로 담보<br />
          2024년: Sky Protocol로 리브랜딩 (DAI → USDS)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">CDP — Collateralized Debt Position</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// CDP = "과담보 대출 포지션"
// 사용자가 ETH 담보 예치 → DAI 발행

흐름:
1. User: 10 ETH 예치 ($30,000 at $3000/ETH)
2. System: CDP 생성, DAI 발행 (예: 15,000 DAI)
3. User: 15,000 DAI 받음 (USD처럼 사용)

// 과담보 필수
Collateralization Ratio = 담보 가치 / 부채 가치
ETH CDP 최소 비율: 150% (MakerDAO 초기)
현재 $30,000 담보 / $15,000 부채 = 200%

// ETH 가격 하락 시
가격 $2,250으로 하락 → 담보 $22,500
비율: 22,500 / 15,000 = 150% (임계치)
더 하락 → 청산 대상`}</pre>
        <p>
          <strong>과담보 150%+</strong>: 담보 가치 급락 버퍼<br />
          Fiat-backed의 1:1과 다름 — 자본 효율 낮음<br />
          but 탈중앙화 보장
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Multi-Collateral DAI (MCD)</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 초기 SAI (Single Collateral DAI): ETH only
// 2019년 MCD: 여러 담보 지원

현재 지원 담보:
- ETH (stETH 포함)
- WBTC
- USDC, USDT (PSM 통해)
- Real World Assets (국채 등)

// 각 담보마다 파라미터
struct IlkData {
    uint256 Art;       // 총 발행 DAI
    uint256 rate;      // 안정성 수수료
    uint256 spot;      // 청산 가격
    uint256 line;      // 담보 최대 부채 한도
    uint256 dust;      // 최소 부채
}

// Vault 구조
struct Urn {
    uint256 ink;  // 담보 양
    uint256 art;  // 부채 (rate 곱하면 DAI)
}`}</pre>
        <p>
          <strong>담보별 독립 파라미터</strong>: ETH-A, WBTC-A, USDC-A 등<br />
          각 담보 유형은 <strong>Ilk</strong>(잉크)라 부름 — 독립 리스크 관리<br />
          RWA(Real World Assets) 담보 추가 — 국채, 기업 대출 등
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Stability Fee — 차입 이자</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 사용자가 DAI 발행 시 누적 이자
Stability Fee: 연 2-15% (담보 유형별)

// 계산
rate[t] = rate[t-1] × (1 + SF)^(dt/year)

// 예시: 15,000 DAI 차입, SF 5%/year
1년 후 부채: 15,000 × 1.05 = 15,750 DAI
2년 후 부채: 15,000 × 1.05² = 16,537.5 DAI

// 상환 시
User repays 15,750 DAI → CDP closed
750 DAI는 시스템에 귀속 (protocol surplus)`}</pre>
        <p>
          <strong>변동 금리</strong>: MakerDAO 거버넌스가 조정<br />
          이자는 <strong>DAI로 지불</strong> — 순환 구조<br />
          누적된 수수료 → protocol surplus → MKR 소각 (버퍼)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">청산 경매</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// CDP가 청산 임계치 이하로 떨어지면
ETH 가격 $1,800으로 하락
담보: 10 × $1,800 = $18,000
부채: 15,750 DAI
비율: 18,000 / 15,750 = 114% < 150% → 청산!

// Liquidations 2.0 (Dutch Auction)
1. Auction 시작 가격: 현재 가격 × 1.1 (10% 할증)
2. 시간 경과에 따라 가격 선형 감소 (step down)
3. 첫 구매자가 담보 획득
4. 구매자 DAI → system burn
5. 나머지 담보 → user에게 환급

// 예시
Auction 초기: $1,980/ETH
5분 후: $1,850
10분 후: $1,720 → 누군가 매수
구매자: 15,750 DAI 지불 → 9.16 ETH 획득
User: 10 - 9.16 = 0.84 ETH 남은 담보 환급`}</pre>
        <p>
          <strong>Dutch Auction</strong>: 가격 하락하며 첫 매수자 승리<br />
          기존 영어 경매(올라가는)보다 속도 빠름·투명<br />
          Penalty: user는 13% 벌금 + 나머지 담보만 반환
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Peg Stability Module (PSM)</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// PSM: USDC ↔ DAI 1:1 즉시 교환
// 디페그 방어 메커니즘

contract PsmUSDC {
    // USDC → DAI
    function sellGem(address dst, uint256 amt) external {
        USDC.transferFrom(msg.sender, address(this), amt);
        DAI.mint(dst, amt * 1e12);  // decimals 조정
    }

    // DAI → USDC
    function buyGem(address dst, uint256 amt) external {
        DAI.burn(msg.sender, amt * 1e12);
        USDC.transfer(dst, amt);
    }
}

// 효과: DAI 가격이 $1 이상이면 USDC → DAI (차익거래)
//       DAI 가격이 $1 이하면 DAI → USDC (차익거래)
// → 자연스럽게 $1로 수렴`}</pre>
        <p>
          <strong>PSM은 MakerDAO의 "배신"</strong>: USDC에 의존해서 페그 유지<br />
          현재 DAI 담보의 50%+ 가 USDC → <strong>간접 중앙화</strong><br />
          완전 탈중앙화 DAI는 이상이고, 실용적 타협이 현실
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">DAI Savings Rate (DSR)</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// DAI 보유자에게 이자 지급
// Stability Fee - 운영비 = DSR로 분배

현재 DSR: 5-8% APY

// 메커니즘
User: 1000 DAI → DSR contract 예치
1년 후: ~1080 DAI 수령

// 수익 원천
Stability Fee 수익 + RWA 국채 수익
→ protocol surplus → DSR 분배

// sDAI: DSR 예치 영수증 (ERC4626 vault)`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: DAI의 진화와 타협</p>
          <p>
            DAI는 <strong>"탈중앙 이상" vs "실용성" 사이 끊임없는 줄타기</strong>
          </p>
          <p className="mt-2">
            타임라인:<br />
            2017: SAI (ETH only) — 순수 탈중앙<br />
            2019: MCD (다중 담보) — 확장성<br />
            2020: USDC를 담보로 추가 — "임시 조치"<br />
            2023: RWA 도입 (국채) — 수익률 확보<br />
            2024: Sky 리브랜딩 (DAI → USDS) — 새 출발
          </p>
          <p className="mt-2">
            <strong>교훈</strong>:<br />
            - 순수 탈중앙 스테이블코인은 아직 증명 안 됨<br />
            - 사용자는 <strong>안정성을 위해 중앙화 수용</strong><br />
            - "탈중앙" 강조보다 <strong>리스크 투명성</strong>이 더 중요
          </p>
        </div>

      </div>
    </section>
  );
}
