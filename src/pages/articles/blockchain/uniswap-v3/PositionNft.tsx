import PositionViz from './viz/PositionViz';
import FeeGrowthViz from './viz/FeeGrowthViz';
import CollectFlowViz from './viz/CollectFlowViz';

export default function PositionNft() {
  return (
    <section id="position-nft" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Position NFT &amp; 수수료 회계</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <PositionViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">NonfungiblePositionManager</h3>
        <p>
          V3의 포지션은 <strong>ERC-721 NFT</strong>로 표현<br />
          <code>NonfungiblePositionManager</code> 컨트랙트가 모든 사용자 포지션 관리<br />
          각 포지션: 특정 pool × 특정 구간 × 특정 liquidity 조합
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Position 구조</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`struct Position {
    uint96 nonce;               // 향후 기능용
    address operator;           // 승인된 관리자
    uint80 poolId;              // 풀 식별자
    int24 tickLower;            // 구간 하한
    int24 tickUpper;            // 구간 상한
    uint128 liquidity;          // 유동성 L

    // 수수료 회계용 스냅샷
    uint256 feeGrowthInside0LastX128;
    uint256 feeGrowthInside1LastX128;

    uint128 tokensOwed0;        // 청구 대기 수수료
    uint128 tokensOwed1;
}`}</pre>
        <p>
          <strong>10개 필드</strong>: 포지션 식별 + 상태 + 수수료 회계<br />
          <code>liquidity</code>는 L 단위 (토큰 양이 아닌 "유동성 양")<br />
          실제 토큰 양은 √P 변화에 따라 동적 계산됨
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">mint — 새 포지션 생성</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`function mint(MintParams calldata params)
    external payable returns (
        uint256 tokenId, uint128 liquidity,
        uint256 amount0, uint256 amount1
    )
{
    IUniswapV3Pool pool;
    (liquidity, amount0, amount1, pool) = addLiquidity(AddLiquidityParams({
        token0: params.token0, token1: params.token1, fee: params.fee,
        recipient: address(this),
        tickLower: params.tickLower, tickUpper: params.tickUpper,
        amount0Desired: params.amount0Desired,
        amount1Desired: params.amount1Desired,
        amount0Min: params.amount0Min, amount1Min: params.amount1Min
    }));

    _mint(params.recipient, (tokenId = _nextId++));

    bytes32 positionKey = keccak256(abi.encodePacked(
        address(this), params.tickLower, params.tickUpper
    ));
    (, uint256 feeGrowthInside0LastX128, uint256 feeGrowthInside1LastX128, , ) =
        pool.positions(positionKey);

    _positions[tokenId] = Position({
        nonce: 0, operator: address(0),
        poolId: cachePoolKey(address(pool), poolKey),
        tickLower: params.tickLower, tickUpper: params.tickUpper,
        liquidity: liquidity,
        feeGrowthInside0LastX128: feeGrowthInside0LastX128,
        feeGrowthInside1LastX128: feeGrowthInside1LastX128,
        tokensOwed0: 0, tokensOwed1: 0
    });
}`}</pre>
        <p>
          <strong>2단계</strong>: Pool의 <code>mint()</code> 호출 → NFT 발행<br />
          Pool 레벨에서는 <code>(tickLower, tickUpper)</code>가 포지션 키<br />
          여러 사용자가 같은 구간 공유 가능 — Pool이 합산 관리, NFT가 개별 지분 표현
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">수수료 누적 — feeGrowthGlobal</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Pool 컨트랙트
uint256 public feeGrowthGlobal0X128;  // token0 수수료 / L 누적
uint256 public feeGrowthGlobal1X128;

// Swap마다 업데이트
function _updateFees(uint256 feeAmount, bool zeroForOne) internal {
    if (zeroForOne) {
        feeGrowthGlobal0X128 += FullMath.mulDiv(
            feeAmount, FixedPoint128.Q128, liquidity
        );
    } else {
        feeGrowthGlobal1X128 += FullMath.mulDiv(
            feeAmount, FixedPoint128.Q128, liquidity
        );
    }
}

// 의미: 전체 수수료 누적 / 활성 L
// 각 LP는 "자신의 L × 경과한 feeGrowthGlobal 차이"만큼 수수료 수령`}</pre>
        <p>
          <strong>feeGrowthGlobal = Σ (수수료 / L)</strong><br />
          단위: 토큰 per 유동성 L — LP가 자기 L 곱하면 수수료 계산 가능<br />
          Q128 고정소수점 — 누적 값이 작은 수수료도 정밀 표현
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">구간 수수료 추적 — feeGrowthInside</h3>

        <FeeGrowthViz />

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 각 tick마다 "바깥쪽" 수수료 추적
struct Tick {
    uint128 liquidityGross;
    int128 liquidityNet;
    uint256 feeGrowthOutside0X128;
    uint256 feeGrowthOutside1X128;
    // ...
}

// 구간 내부 수수료 계산 (3 케이스)
function getFeeGrowthInside(
    int24 tickLower, int24 tickUpper, int24 tickCurrent,
    uint256 feeGrowthGlobal0X128, uint256 feeGrowthGlobal1X128
) internal view returns (uint256 feeGrowthInside0X128, uint256 feeGrowthInside1X128) {
    TickInfo memory lower = ticks[tickLower];
    TickInfo memory upper = ticks[tickUpper];

    // feeGrowthBelow: 구간 아래 누적된 수수료
    uint256 feeGrowthBelow0X128 = tickCurrent >= tickLower
        ? lower.feeGrowthOutside0X128
        : feeGrowthGlobal0X128 - lower.feeGrowthOutside0X128;

    // feeGrowthAbove: 구간 위 누적된 수수료
    uint256 feeGrowthAbove0X128 = tickCurrent < tickUpper
        ? upper.feeGrowthOutside0X128
        : feeGrowthGlobal0X128 - upper.feeGrowthOutside0X128;

    // Inside = Global - Below - Above
    feeGrowthInside0X128 = feeGrowthGlobal0X128 - feeGrowthBelow0X128 - feeGrowthAbove0X128;
}`}</pre>
        <p>
          <strong>포함-배제 원리</strong>: Global - (아래 누적) - (위 누적) = 구간 내 누적<br />
          tick마다 <strong>"어느 방향 수수료가 축적됐는지"</strong>만 저장 — O(1) 계산<br />
          LP가 구간 생성 시 초기값 저장, 수거 시 차이 계산
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">수수료 수거 — collect()</h3>

        <CollectFlowViz />

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`function collect(CollectParams calldata params)
    external payable returns (uint256 amount0, uint256 amount1)
{
    Position storage position = _positions[params.tokenId];

    // 1) 최신 feeGrowthInside 조회
    (uint256 feeGrowthInside0X128, uint256 feeGrowthInside1X128) =
        getFeeGrowthInside(/* ... */);

    // 2) 누적 수수료 증분 계산
    position.tokensOwed0 += uint128(
        FullMath.mulDiv(
            feeGrowthInside0X128 - position.feeGrowthInside0LastX128,
            position.liquidity,
            FixedPoint128.Q128
        )
    );
    position.tokensOwed1 += uint128(/* same for token1 */);

    // 3) 스냅샷 업데이트
    position.feeGrowthInside0LastX128 = feeGrowthInside0X128;
    position.feeGrowthInside1LastX128 = feeGrowthInside1X128;

    // 4) 실제 토큰 전송
    amount0 = params.amount0Max < position.tokensOwed0 ? params.amount0Max : position.tokensOwed0;
    amount1 = /* ... */;
    position.tokensOwed0 -= uint128(amount0);
    position.tokensOwed1 -= uint128(amount1);

    pool.collect(params.recipient, tickLower, tickUpper, amount0, amount1);
}`}</pre>
        <p>
          <strong>4단계</strong>: feeGrowthInside 조회 → 증분 계산 → 스냅샷 갱신 → 전송<br />
          마지막 collect 이후 누적된 수수료만 계산 — 이중 청구 방지<br />
          부분 수거 가능 — <code>amount0Max/amount1Max</code>로 금액 제한
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Position NFT의 활용</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 2차 시장: OpenSea, Blur에서 LP 포지션 거래
// 전략 1: 고수익 범위 포지션 매수 (이미 수수료 누적된 포지션)
// 전략 2: 특정 구간 포지션 프리미엄 매도

// 담보 활용: Aave 등에서 V3 포지션을 담보로 대출
// → LP 자산 유동화

// LP 매니저 vault: 여러 포지션을 NFT 번들로 관리
// → 일반 사용자는 ERC20으로 여러 포지션 간접 소유

// 예시: Charm/Alpha Vault
contract PassiveVault {
    uint256[] public positionIds;  // 소유한 NFT들

    function rebalance() external {
        // 모든 포지션 수거 → 재분배
    }
}`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: NFT 기반 LP의 확장 효과</p>
          <p>
            V2 LP 토큰(ERC20) vs V3 포지션(NFT):
          </p>
          <p className="mt-2">
            <strong>NFT의 부작용 (의외의 가치)</strong>:<br />
            ✓ 2차 시장 형성 (OpenSea LP 거래)<br />
            ✓ 담보로 활용 (Aave, Morpho)<br />
            ✓ 시각적 표현 가능 (포지션 카드 이미지)<br />
            ✓ NFT 자체 분석 툴 재사용
          </p>
          <p className="mt-2">
            <strong>NFT의 단점</strong>:<br />
            ✗ Fungibility 상실 — DEX·AMM으로 직접 거래 어려움<br />
            ✗ 수수료 재투자 복잡 — 각 포지션 개별 관리<br />
            ✗ 가스 비용 ↑ — NFT 연산이 ERC20보다 비쌈
          </p>
          <p className="mt-2">
            <strong>결과</strong>: "wrapped NFT" 생태계 — Arrakis·Gamma가 여러 NFT를 ERC20 토큰으로 래핑<br />
            V3는 raw primitives, 상위 레이어가 fungibility 제공 — 유연한 확장
          </p>
        </div>

      </div>
    </section>
  );
}
