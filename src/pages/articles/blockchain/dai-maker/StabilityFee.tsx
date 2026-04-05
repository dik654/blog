import StabilityFeeViz from './viz/StabilityFeeViz';
import RateAccumulatorViz from './viz/RateAccumulatorViz';
import JugDripViz from './viz/JugDripViz';
import PotDsrViz from './viz/PotDsrViz';
import SDaiViz from './viz/SDaiViz';
import DsrHistoryViz from './viz/DsrHistoryViz';

export default function StabilityFee() {
  return (
    <section id="stability-fee" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">안정성 수수료 &amp; DSR</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <StabilityFeeViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">Stability Fee (SF) — DAI 차입 이자</h3>

        <RateAccumulatorViz />

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Stability Fee 계산
rate[t] = rate[t-1] × (1 + duty)^(dt/year)

// duty: 연간 이자율 (거버넌스 설정)
// rate: 누적 이자 곱셈 계수

// 예시 (ETH-A, SF = 5%)
초기: 15,000 DAI 발행
rate = RAY (1.0)

6개월 후: rate = RAY × (1.05)^0.5 = 1.0247 × RAY
1년 후:   rate = RAY × 1.05 = 1.05 × RAY
2년 후:   rate = RAY × 1.05² = 1.1025 × RAY

// 사용자 부채 (실제)
debt = urn.art × ilk.rate / RAY

// urn.art는 고정 (15000), ilk.rate만 증가
// 시간 지나면 갚을 DAI 증가`}</pre>
        <p>
          <strong>rate는 곱셈 계수</strong>: 사용자 잔고 수정 없이 전체 누적<br />
          Maker의 <strong>"rate accumulator" 패턴</strong><br />
          Aave의 liquidityIndex와 동일 개념
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Jug.sol — 이자 모듈</h3>

        <JugDripViz />

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`contract Jug {
    struct Ilk {
        uint256 duty;  // 초당 이자 rate (compound 준비)
        uint256 rho;   // 마지막 drip 시각
    }

    mapping(bytes32 => Ilk) public ilks;
    uint256 public base;  // 전역 기본 이자

    function drip(bytes32 ilk) external returns (uint256 rate) {
        require(block.timestamp >= ilks[ilk].rho, "Jug/invalid-rho");

        // 이자 rate 계산 (복리)
        rate = _rmul(
            _rpow(base + ilks[ilk].duty, block.timestamp - ilks[ilk].rho, RAY),
            vat.ilks(ilk).rate
        );

        // Vat 업데이트
        int256 delta = _diff(rate, vat.ilks(ilk).rate);
        vat.fold(ilk, vow, delta);

        ilks[ilk].rho = block.timestamp;
    }
}`}</pre>
        <p>
          <strong>drip() 함수</strong>: rate 업데이트 + Vat.fold() 호출<br />
          rpow (rmul to power): 복리 계산<br />
          사용자 상호작용 전에 drip 필수 — 최신 rate 반영
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">SF 수익 흐름</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Stability Fee 수익 → Protocol Surplus

drip() 실행:
  rate_new = rate_old × (1 + SF)^dt
  delta = rate_new - rate_old

  Vat.fold(ilk, vow, delta):
    // 모든 vault의 부채 증가
    ilk.rate += delta
    // 증가분을 "vow" 주소로 누적
    vow.dai += ilk.Art × delta

// Vow (Debt Engine):
// - Protocol의 "balance sheet"
// - Surplus: SF 수익
// - Deficit: bad debt (청산 손실)

// Surplus 분배
1. Buffer까지 축적 (기본 $60M)
2. 초과분 → Flap Auction
3. MKR을 DAI로 매입 → 소각
4. MKR 공급 감소 → 가치 상승 (이론)`}</pre>
        <p>
          <strong>MKR은 deflationary</strong>: SF 수익으로 MKR 소각<br />
          예시: $10M surplus → $10M DAI로 MKR 매입 → 소각<br />
          MKR 보유자에게 간접 수익 — "buyback and burn"
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">DSR — Dai Savings Rate</h3>

        <PotDsrViz />

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// DAI 보유자에게 이자 지급
// SF 수익의 일부를 예치자에게 배분

contract Pot {
    uint256 public dsr;  // DAI Saving Rate (초당)
    uint256 public chi;  // 누적 rate

    mapping(address => uint256) public pie;  // 개별 지분

    function join(uint256 wad) external {
        drip();
        pie[msg.sender] += wad;
        totalPie += wad;
        vat.move(msg.sender, address(this), wad × chi);
    }

    function drip() public returns (uint256) {
        chi = rmul(rpow(dsr, block.timestamp - rho, RAY), chi);
        rho = block.timestamp;
    }

    function balanceOf(address user) external view returns (uint256) {
        return pie[user] × chi / RAY;  // 이자 포함 잔액
    }
}`}</pre>
        <p>
          <strong>Pot = DAI 예금 컨트랙트</strong><br />
          DSR은 SF보다 낮게 설정 — 프로토콜 spread 유지<br />
          예: SF 5%, DSR 3.5%, 나머지 1.5% → treasury
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">sDAI — 유동 DSR 토큰</h3>

        <SDaiViz />

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// ERC-4626 vault: Pot을 wrapping

contract SavingsDai {
    // Pot에 예치된 DAI의 ERC20 표현
    // 전송 가능, DEX 거래 가능

    function deposit(uint256 assets) external returns (uint256 shares) {
        shares = assets × RAY / pot.chi();
        pot.join(shares);
        _mint(msg.sender, shares);
    }

    function redeem(uint256 shares) external returns (uint256 assets) {
        assets = shares × pot.chi() / RAY;
        pot.exit(shares);
        _burn(msg.sender, shares);
        dai.transfer(msg.sender, assets);
    }
}

// sDAI 장점
✓ 이자 자동 누적 (DAI로 상환 시 증가)
✓ DeFi 통합 (Aave, Curve에서 담보 사용)
✓ transfer 시 이자 그대로 이전`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">DSR 금리 조정 — 수요·공급 반응</h3>

        <DsrHistoryViz />

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// MakerDAO 거버넌스가 DSR 조정

DAI 가격 > $1 (디페그 상방):
  DSR 하락 → DAI 수요 감소 → 가격 하락

DAI 가격 < $1 (디페그 하방):
  DSR 상승 → DAI 수요 증가 → 가격 상승

// 이력 (DSR 변화)
2020년: 0% (긴급 셧다운 근처)
2021년: 0.01% (낮은 금리 환경)
2023년: 1% → 3% → 5% → 8% (금리 인상 반영)
2024년: 12% 최고점 (Spark subDAO)
2025년: 5-8% (안정화)

// 자금 원천
전통 stable yield: Fed 금리 (~5%)
DSR: 5-8% (프리미엄)
→ DAI 보유자에게 "risk-adjusted" 매력`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: SF와 DSR의 경제학</p>
          <p>
            MakerDAO는 <strong>"중앙은행 유사 역할"</strong>:<br />
            - SF = 대출 금리<br />
            - DSR = 예금 금리<br />
            - Spread = 프로토콜 수익
          </p>
          <p className="mt-2">
            금리 정책:<br />
            - DAI 페그 약화 → SF/DSR 상승 (긴축)<br />
            - DAI 페그 강함 → SF/DSR 하락 (완화)<br />
            - 전통 Fed 금리와 연동 (실세 연동)
          </p>
          <p className="mt-2">
            <strong>MakerDAO는 "탈중앙 중앙은행"</strong>:<br />
            ✓ 금리 정책 결정<br />
            ✓ 화폐 발행 통제<br />
            ✓ 경제 안정 목표<br />
            ✗ 국가 권력 없음 (거버넌스만)
          </p>
          <p className="mt-2">
            이 실험이 성공하면 — <strong>알고리드믹 중앙은행</strong>의 청사진<br />
            하지만 여전히 MKR 보유자·Circle(USDC)에 의존
          </p>
        </div>

      </div>
    </section>
  );
}
