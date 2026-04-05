import MultiHopViz from './viz/MultiHopViz';
import GetAmountsOutViz from './viz/GetAmountsOutViz';
import AddLiquidityViz from './viz/AddLiquidityViz';
import SandwichAttackViz from './viz/SandwichAttackViz';

export default function RouterSwap() {
  return (
    <section id="router-swap" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Router &amp; swap 실행</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">UniswapV2Router02 — 사용자 진입점</h3>
        <p>
          Pair 컨트랙트는 저수준 swap API만 제공 — 사용자가 직접 호출하기 어려움<br />
          <strong>Router</strong>가 사용자 친화적 래퍼 역할:<br />
          - 다중 홉 경로 실행<br />
          - 슬리피지 보호<br />
          - Deadline 체크<br />
          - 편의 함수 (swapExactTokensForTokens 등)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">swapExactTokensForTokens — 가장 일반적 함수</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`function swapExactTokensForTokens(
    uint amountIn,          // 입력 토큰 양 (정확)
    uint amountOutMin,      // 최소 출력 (슬리피지 보호)
    address[] calldata path, // 경로: [tokenA, tokenB, tokenC]
    address to,             // 출력 수신 주소
    uint deadline           // 트랜잭션 만료 시각
) external ensure(deadline) returns (uint[] memory amounts) {
    // 1) 경로별 출력량 미리 계산
    amounts = getAmountsOut(amountIn, path);
    require(amounts[amounts.length - 1] >= amountOutMin, "INSUFFICIENT_OUTPUT_AMOUNT");

    // 2) 첫 번째 Pair로 입력 토큰 전송
    TransferHelper.safeTransferFrom(
        path[0], msg.sender, pairFor(path[0], path[1]), amounts[0]
    );

    // 3) 경로 따라 swap 연쇄 실행
    _swap(amounts, path, to);
}`}</pre>
        <p>
          <strong>3단계 흐름</strong>: 출력 계산 → 입력 전송 → 연쇄 swap<br />
          <code>amountOutMin</code>: 프론트엔드가 예상 출력 × (1 - slippage) 계산<br />
          <code>deadline</code>: MEV 대응 — 오래된 트랜잭션이 유리한 가격에 실행되는 것 방지
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">_swap — 다중 홉 연쇄 실행</h3>

        <MultiHopViz />

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`function _swap(uint[] memory amounts, address[] memory path, address _to) internal {
    for (uint i; i < path.length - 1; i++) {
        (address input, address output) = (path[i], path[i + 1]);
        (address token0,) = sortTokens(input, output);

        uint amountOut = amounts[i + 1];
        (uint amount0Out, uint amount1Out) = input == token0
            ? (uint(0), amountOut)
            : (amountOut, uint(0));

        // 다음 홉의 Pair(있으면)를 수신 주소로 — 중간 단계 gas 절감
        address to = i < path.length - 2
            ? pairFor(output, path[i + 2])
            : _to;

        IUniswapV2Pair(pairFor(input, output)).swap(
            amount0Out, amount1Out, to, new bytes(0)
        );
    }
}`}</pre>
        <p>
          <strong>연쇄 전송 최적화</strong>: 중간 단계 결과를 다음 Pair로 직접 전송<br />
          ex: A→B→C 경로 시, A→B의 출력을 B→C Pair로 바로 보냄 — Router 경유 없음<br />
          이 패턴으로 3홉 swap도 단일 트랜잭션, 최소 가스
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">getAmountsOut — 경로 따라 출력 계산</h3>

        <GetAmountsOutViz />

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`function getAmountsOut(uint amountIn, address[] memory path)
    public view returns (uint[] memory amounts)
{
    require(path.length >= 2, "INVALID_PATH");
    amounts = new uint[](path.length);
    amounts[0] = amountIn;
    for (uint i; i < path.length - 1; i++) {
        (uint reserveIn, uint reserveOut) = getReserves(path[i], path[i + 1]);
        amounts[i + 1] = getAmountOut(amounts[i], reserveIn, reserveOut);
    }
}

function getAmountOut(uint amountIn, uint reserveIn, uint reserveOut)
    internal pure returns (uint amountOut)
{
    require(amountIn > 0, "INSUFFICIENT_INPUT_AMOUNT");
    require(reserveIn > 0 && reserveOut > 0, "INSUFFICIENT_LIQUIDITY");

    // 0.3% 수수료 포함 공식
    uint amountInWithFee = amountIn * 997;
    uint numerator = amountInWithFee * reserveOut;
    uint denominator = reserveIn * 1000 + amountInWithFee;
    amountOut = numerator / denominator;
}`}</pre>
        <p>
          <strong>공식 유도</strong>:<br />
          (x + 0.997·Δx) · (y - Δy) = x · y<br />
          Δy = y · 0.997·Δx / (x + 0.997·Δx)<br />
          = 997·Δx · y / (1000·x + 997·Δx)
        </p>
        <p>
          <code>getAmountOut</code>는 pure 함수 — 프론트엔드에서 수십만 번 호출해도 오프체인 실행<br />
          슬리피지 계산·경로 비교에 필수
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">addLiquidity — LP 편의 함수</h3>

        <AddLiquidityViz />

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`function addLiquidity(
    address tokenA, address tokenB,
    uint amountADesired, uint amountBDesired,
    uint amountAMin, uint amountBMin,
    address to, uint deadline
) external ensure(deadline) returns (uint amountA, uint amountB, uint liquidity) {
    // 1) 최적 비율 계산
    (amountA, amountB) = _addLiquidity(
        tokenA, tokenB,
        amountADesired, amountBDesired,
        amountAMin, amountBMin
    );

    // 2) Pair 주소 계산
    address pair = pairFor(tokenA, tokenB);

    // 3) 토큰 이동
    TransferHelper.safeTransferFrom(tokenA, msg.sender, pair, amountA);
    TransferHelper.safeTransferFrom(tokenB, msg.sender, pair, amountB);

    // 4) LP 토큰 발행
    liquidity = IUniswapV2Pair(pair).mint(to);
}`}</pre>
        <p>
          <strong>최적 비율 자동 계산</strong>: 사용자가 원하는 양과 현재 reserve 비율 맞춤<br />
          예: 500 USDC + 1 ETH 원하는데 시장가 $3000이면 → 500 USDC + 0.167 ETH 자동 조정<br />
          amountAMin/BMin: 조정 후 최소 허용치 — 프론트에서 보호 장치 설정
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">MEV & 슬리피지 보호</h3>

        <SandwichAttackViz />

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 샌드위치 공격 시나리오
1. 사용자: 10 ETH → 30000 USDC 스왑 트랜잭션 (amountOutMin=29700)
2. 봇 (프론트런): 100 ETH → USDC 선매수 (가격 상승 유도)
3. 사용자 트랜잭션 실행: 원하는 양보다 적게 받음 (28000 USDC라면 revert)
   → amountOutMin 29700이 보호
4. 봇 (백런): USDC → ETH 매도 (차익 실현)

// amountOutMin 계산 (프론트엔드)
expectedOut = getAmountsOut(10 * 1e18, [WETH, USDC])[1]
slippage = 0.01  // 1%
amountOutMin = expectedOut * (1 - slippage)`}</pre>
        <p>
          <strong>슬리피지 1%가 표준</strong>: 일반 거래는 1%, 스테이블코인 페어는 0.1%<br />
          너무 낮으면 트랜잭션 revert, 너무 높으면 MEV 취약<br />
          MEV 완전 방어는 <strong>Flashbots/Private Mempool</strong> 필요 (V2만으로는 불가)
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Router의 존재 이유</p>
          <p>
            Uniswap V2는 <strong>Pair(코어) + Router(주변) 2단 설계</strong><br />
            이 분리의 가치:
          </p>
          <p className="mt-2">
            ✓ <strong>Pair 업그레이드 불필요</strong>: Router만 새 버전 배포<br />
            ✓ <strong>Router 다양화</strong>: 1inch, 0x 등이 각자 Router 구현 가능<br />
            ✓ <strong>가스 최적화</strong>: Router가 경로·슬리피지 로직 담당, Pair는 순수 swap만<br />
            ✓ <strong>감사 단순화</strong>: Pair 코어 보안 ≠ Router UX 버그
          </p>
          <p className="mt-2">
            이 2단 패턴은 <strong>DeFi 인프라의 표준</strong>이 됨 — Aave, Compound 등도 유사 구조<br />
            "변하지 않는 코어 + 교체 가능한 UX" 철학
          </p>
        </div>

      </div>
    </section>
  );
}
