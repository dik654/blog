import DutchAuctionViz from './viz/DutchAuctionViz';
import BlackThursdayViz from './viz/BlackThursdayViz';
import ClipperViz from './viz/ClipperViz';
import PriceDecayViz from './viz/PriceDecayViz';
import KeeperIncentiveViz from './viz/KeeperIncentiveViz';
import LiquidationPenaltyViz from './viz/LiquidationPenaltyViz';

export default function LiquidationAuction() {
  return (
    <section id="liquidation-auction" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">청산 경매 (Liquidations 2.0)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <DutchAuctionViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">블랙서스데이 (2020.03.12) — 역사적 실패</h3>

        <BlackThursdayViz />

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`2020년 3월 12일 시나리오:
  ETH 가격: $200 → $90 (50% 하락, 하루)
  네트워크 혼잡: gas price 1000+ gwei
  Oracle 지연: 가격 업데이트 실패

기존 Liquidations 1.0 (English Auction):
  1. 담보 경매 시작 (3일 지속)
  2. 입찰자가 점진적으로 가격 올림
  3. 최고가 입찰자가 낙찰

문제:
  - Gas 경쟁으로 입찰 불가
  - 일부 경매에 "0 DAI" 입찰로 낙찰
  - $4.5M 손실 (bad debt)
  - User는 담보 전액 손실`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Liquidations 2.0 — Dutch Auction</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 2020년 10월 배포 - 네덜란드식 경매

흐름:
  1. 시작 가격: 현재 시장가 × (1 + buf)  (buf = 10-20% 프리미엄)
  2. 시간 경과에 따라 가격 선형/지수 감소
  3. 첫 매수자가 낙찰
  4. step (가격 감소 단위): 매 X초마다

예시 (ETH-A 청산):
  시장가: $3,000
  buf: 10%
  시작: $3,300/ETH
  step: 매 1분마다 1% 감소

  t=0min: $3,300
  t=5min: $3,135
  t=10min: $2,970 → 누군가 매수!
  낙찰: 10 ETH × $2,970 = $29,700 지불`}</pre>
        <p>
          <strong>Dutch auction의 장점</strong>:<br />
          ✓ 단일 트랜잭션으로 완료 (gas 경쟁 완화)<br />
          ✓ 자동 가격 발견 (시장이 적정가 결정)<br />
          ✓ 짧은 경매 시간 (수 분 ~ 수 시간)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Clipper.sol — 경매 컨트랙트</h3>

        <ClipperViz />

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`contract Clipper {
    struct Sale {
        uint256 pos;    // 경매 index
        uint256 tab;    // 회수 대상 DAI (부채)
        uint256 lot;    // 담보 양
        address usr;    // 원 Vault 소유자
        uint96 tic;     // 시작 시각
        uint256 top;    // 시작 가격
    }

    mapping(uint256 => Sale) public sales;

    // 경매 시작 (Dog.sol이 호출)
    function kick(
        uint256 tab, uint256 lot, address usr, address kpr
    ) external auth returns (uint256 id) {
        id = ++kicks;
        sales[id] = Sale({
            pos: nonce++,
            tab: tab, lot: lot, usr: usr,
            tic: uint96(block.timestamp),
            top: rmul(calc.price(tab, lot), buf)
        });
        // kpr(keeper, 호출자)에게 bounty 지급
    }

    // 매수 실행
    function take(
        uint256 id, uint256 amt, uint256 max, address who, bytes calldata data
    ) external {
        Sale memory sale = sales[id];
        uint256 price = getPrice(id);
        require(price <= max, "price-exceeded-max");

        uint256 slice = min(amt, sale.lot);
        uint256 owe = mul(slice, price);

        // 담보 → 매수자
        vat.flux(ilk, address(this), who, slice);

        // DAI → vow (system)
        vat.move(msg.sender, vow, owe);

        // Sale 업데이트
        sale.tab -= owe;
        sale.lot -= slice;

        // 완료 조건 체크
        if (sale.lot == 0 || sale.tab == 0) {
            delete sales[id];
        }
    }
}`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">가격 감소 곡선 — StairstepExponentialDecrease</h3>

        <PriceDecayViz />

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 지수 감소 계단식 모델

function price(uint256 top, uint256 dur) external view returns (uint256) {
    return rmul(top, rpow(cut, dur / step, RAY));
}

// cut: 각 step의 감소율 (예: 0.99 = 1% 감소)
// step: step 간격 (예: 60초)
// dur: 경매 시작 후 경과 시간

// 예시
top = 3300, cut = 0.99, step = 60s
t=0:     3300
t=60:    3300 × 0.99 = 3267
t=120:   3267 × 0.99 = 3234
t=300:   3300 × 0.99^5 = 3138
t=600:   3300 × 0.99^10 = 2983 → 시장가 도달`}</pre>
        <p>
          <strong>파라미터 선택</strong>:<br />
          - cut 낮음: 빠른 하락 → 빠른 낙찰 (하지만 싼 가격)<br />
          - cut 높음: 천천히 하락 → 더 비싸게 낙찰<br />
          ETH-A: cut=0.99, step=90s → ~10분에 10% 하락
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Keeper 인센티브</h3>

        <KeeperIncentiveViz />

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Keeper = 경매 시작 호출자 (MEV bot 등)

Incentives:
  flatTip: 고정 DAI 보상 (예: 100 DAI)
  chip: tab 비율 (예: 0.001 = 0.1%)

  reward = flatTip + chip × tab

예시:
  tab = 15,000 DAI (부채)
  flatTip = 100
  chip = 0.001

  reward = 100 + 0.001 × 15,000 = 115 DAI

  Keeper는 이 보상 노리고 청산 경매 시작

// Redo 인센티브
경매가 tail 시간 지나도 완료 안 되면:
  Keeper가 redo() 호출 → 가격 재설정
  redo 호출자에게도 tip 지급`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">청산 페널티 & 남은 담보</h3>

        <LiquidationPenaltyViz />

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 청산 시 사용자 손실

// 부채: 15,000 DAI
// 페널티: 13% (ETH-A)
// 회수 목표: 15,000 × 1.13 = 16,950 DAI

// 담보 매각 결과
담보: 10 ETH 매각 → 30,000 DAI 회수 (시장가 $3,000)

16,950 DAI → Vow (system)
13,050 DAI → User (refund)

환산: 4.35 ETH equivalent refund

// 사용자 순 손실
원래 담보: 10 ETH
반환: 4.35 ETH
손실: 5.65 ETH (청산 당시 가격 기준)

// 중요
부채 상환 + 페널티만 매각
→ 나머지 담보는 user에게 반환
→ 전통 margin call과 유사`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Liquidations 2.0의 학습</p>
          <p>
            블랙서스데이는 MakerDAO에게 <strong>근본적 교훈</strong>:
          </p>
          <p className="mt-2">
            1. <strong>시장 극한에 대응 설계</strong>: Gas 경쟁 환경 가정<br />
            2. <strong>단일 트랜잭션 청산</strong>: 여러 블록 거치면 실패<br />
            3. <strong>네트워크 지연 버퍼</strong>: Oracle 업데이트 지연 대비<br />
            4. <strong>Keeper 인센티브 다양화</strong>: flat + 비례 조합
          </p>
          <p className="mt-2">
            결과: Liquidations 2.0은 <strong>Terra 붕괴(2022), FTX(2022), Silicon Valley Bank(2023)</strong> 모두 견뎌냄
          </p>
          <p className="mt-2">
            <strong>배운 것</strong>: 경매 설계는 극한 시나리오 먼저 고려<br />
            평소에는 간단하지만, 위기에는 강건해야<br />
            이것이 "battle-tested DeFi" 의 진정한 의미
          </p>
        </div>

      </div>
    </section>
  );
}
