import PsmViz from './viz/PsmViz';
import PsmTimelineViz from './viz/PsmTimelineViz';
import SellGemFlowViz from './viz/SellGemFlowViz';
import PsmArbitrageViz from './viz/PsmArbitrageViz';
import CollateralMixViz from './viz/CollateralMixViz';
import EndgameViz from './viz/EndgameViz';
import EsmViz from './viz/EsmViz';

export default function PegStability() {
  return (
    <section id="peg-stability" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PSM — 페그 안정성 모듈</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <PsmViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">PSM 도입 배경</h3>

        <PsmTimelineViz />

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`2020년 3월 이전:
  DAI 페그: $0.97 ~ $1.05 (불안정)
  이유: ETH 담보만 — 담보 자체가 변동성

2020년 3월 블랙서스데이:
  DAI 가격 $1.10까지 상승
  이유: DAI 공급 부족, 수요 급증

해결책: USDC 담보 추가 (2020년 4월)
  - USDC = $1 고정
  - DAI의 "stability anchor" 역할

2020년 12월: PSM 런칭
  - USDC ↔ DAI 1:1 교환 (수수료 0%)
  - 즉시 페그 회복 가능`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">PSM 컨트랙트</h3>

        <SellGemFlowViz />

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// PSM-USDC-A 컨트랙트 (간소화)
contract DssPsm {
    VatLike public immutable vat;
    GemJoinLike public immutable gemJoin;  // USDC 어댑터
    DaiJoinLike public immutable daiJoin;
    uint256 public tin;   // USDC → DAI 수수료
    uint256 public tout;  // DAI → USDC 수수료

    // USDC 입금 → DAI 출금
    function sellGem(address usr, uint256 gemAmt) external {
        uint256 gemAmt18 = mul(gemAmt, 10**12);  // 6→18 decimals
        uint256 fee = mul(gemAmt18, tin) / WAD;
        uint256 daiAmt = gemAmt18 - fee;

        // USDC 받기
        gemJoin.gem().transferFrom(msg.sender, address(this), gemAmt);
        gemJoin.join(address(this), gemAmt);

        // DAI 발행 (Vat.frob)
        vat.frob(ilk, address(this), address(this), address(this),
                 int256(gemAmt18), int256(gemAmt18));

        // DAI 사용자에게 전송
        vat.move(address(this), address(daiJoin), mul(daiAmt, RAY));
        daiJoin.exit(usr, daiAmt);

        // 수수료는 vow(system)으로
        vat.move(address(this), vow, mul(fee, RAY));
    }

    // DAI 입금 → USDC 출금
    function buyGem(address usr, uint256 gemAmt) external {
        // 역방향 로직
    }
}`}</pre>
        <p>
          <strong>내부는 여전히 CDP</strong>: USDC 담보 + DAI 발행<br />
          차이: 사용자는 즉시 교환 경험 — 수수료 0 ~ 0.01%<br />
          담보 비율: 101% (minimum overcollateralization)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">PSM 흐름 예시</h3>

        <PsmArbitrageViz />

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 시나리오 1: DAI 가격 $1.02 (페그 초과)
// → 차익거래자가 USDC로 DAI 발행 → 매도

1. Arbitrageur: USDC 100,000 → PSM
2. PSM: 100,000 DAI mint → arbitrageur
3. Arbitrageur: 100,000 DAI → DEX에서 $1.02에 매도
4. 수익: $2,000 (2%)
5. DAI 공급 증가 → 가격 $1로 회귀

// 시나리오 2: DAI 가격 $0.98 (페그 이하)
// → 차익거래자가 DAI 매수 → PSM에서 USDC 환급

1. Arbitrageur: $98,000 USDC → DEX → 100,000 DAI 매수
2. Arbitrageur: 100,000 DAI → PSM
3. PSM: USDC 100,000 → arbitrageur
4. 수익: $2,000
5. DAI 수요 증가 → 가격 $1로 회귀

// 효과
- PSM이 "무한한 1:1 liquidity" 제공
- 차익거래 기회 즉시 해소
- 페그 $1 근처 유지 (±0.1%)`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">PSM의 부작용 — 중앙화</h3>

        <CollateralMixViz />

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 시간에 따른 DAI 담보 구성 변화

2020년 초 (PSM 이전):
  ETH: 90%
  BAT, WBTC: 10%
  → 탈중앙 담보

2021년:
  ETH: 40%
  USDC: 50%
  기타: 10%
  → 절반이 중앙화 자산

2022년 (FTX 붕괴 후):
  USDC: 60%+
  → "USDC 래퍼" 비판

2023년 (SVB 사태):
  USDC 일시 디페그 → DAI도 $0.95로 하락
  MakerDAO: USDC 비중 감축 결의

현재 (2024):
  USDC: 30%
  RWA: 25%
  ETH/stETH: 30%
  기타: 15%
  → 다각화 진행`}</pre>
        <p>
          <strong>SVB 사태가 전환점</strong>: USDC 의존의 위험 현실화<br />
          이후 RWA 담보 확대 — 미국 국채, 민간 대출 등<br />
          하지만 여전히 <strong>중앙화 자산 비중 50%+</strong>
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">MakerDAO Endgame — 탈중앙화 회귀</h3>

        <EndgameViz />

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Rune Christensen의 Endgame 계획 (2022)

Phase 1: Free-Float DAI (2024-2026)
  - DAI를 USD 페그에서 점진적 분리
  - USDC 담보 제거
  - "crypto-native" stable 지향

Phase 2: SubDAO 시스템
  - 여러 specialized SubDAO로 분할
  - Spark: DAI 기반 lending
  - 각 SubDAO 자체 토큰 & 거버넌스

Phase 3: New Stable Token
  - DAI → USDS (2024 리브랜딩)
  - 장기적으로 USD-agnostic 방향

목표:
- USDC 담보 0%
- ETH + RWA + 암호자산 담보만
- 진정한 탈중앙 스테이블`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Emergency Shutdown Module (ESM)</h3>

        <EsmViz />

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 극한 상황 대비 최후 장치

trigger 조건:
  - Oracle 동작 불가
  - 심각한 거버넌스 공격
  - 해킹/버그 탐지

실행 방법:
  1. MKR 보유자 50K MKR 예치 → ESM.fire() 호출
  2. 모든 Vault 중단
  3. 마지막 가격으로 담보 청산 가치 고정
  4. DAI 보유자에게 pro-rata 담보 환급

예시:
  Total DAI: 5B
  Total collateral: 8B (이상적)

  User A: 1000 DAI 보유
  A의 환급: 1000 × 8/5 = 1600 USD 상당 자산

// 단 한 번도 실행된 적 없음
// "최후 보루"로만 존재`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: MakerDAO의 진화 방향</p>
          <p>
            MakerDAO는 <strong>"이상과 현실 사이 끊임없는 줄다리기"</strong>:
          </p>
          <p className="mt-2">
            이상 (2017):<br />
            - 순수 탈중앙 스테이블코인<br />
            - 암호자산 담보만<br />
            - 중앙 권한 0
          </p>
          <p className="mt-2">
            현실 (2024):<br />
            - USDC 담보 50% (과거)<br />
            - RWA 담보 도입 (국채)<br />
            - MKR 보유 집중<br />
            - PSM이 페그의 핵심
          </p>
          <p className="mt-2">
            미래 (Endgame):<br />
            - USDC 의존 제거<br />
            - ETH + RWA 중심<br />
            - Free-float DAI (USD에서 분리)
          </p>
          <p className="mt-2">
            <strong>교훈</strong>: 7년 운영 후에도 <strong>탈중앙 스테이블은 미완성</strong><br />
            Maker가 증명하는 것: "안정성과 탈중앙화는 tension 관계"<br />
            사용자는 각 순간의 트레이드오프 이해 후 선택해야
          </p>
        </div>

      </div>
    </section>
  );
}
