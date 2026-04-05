import PairStateViz from './viz/PairStateViz';
import Create2PairViz from './viz/Create2PairViz';
import MintLpViz from './viz/MintLpViz';
import SwapFlowViz from './viz/SwapFlowViz';

export default function PairContract() {
  return (
    <section id="pair-contract" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Pair Contract 내부</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">UniswapV2Pair — 핵심 상태</h3>

        <PairStateViz />

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`contract UniswapV2Pair is UniswapV2ERC20 {
    address public factory;      // Factory 컨트랙트 주소
    address public token0;       // 주소 순 더 작은 토큰
    address public token1;

    uint112 private reserve0;    // token0 준비금
    uint112 private reserve1;    // token1 준비금
    uint32  private blockTimestampLast;  // 마지막 업데이트 블록

    uint public price0CumulativeLast;  // TWAP용
    uint public price1CumulativeLast;
    uint public kLast;  // reserve0 * reserve1 (마지막 mint/burn 시점)
}`}</pre>
        <p>
          <strong>uint112 reserve</strong>: 2개 reserve + timestamp를 32바이트 1 슬롯에 packing<br />
          112+112+32 = 256비트 — SSTORE 가스 절감 (1회 쓰기로 3개 변수 업데이트)<br />
          <code>token0 &lt; token1</code> 정렬 — 같은 페어의 2개 컨트랙트 중복 방지
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">초기화 — Factory에서 배포</h3>

        <Create2PairViz />

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// UniswapV2Factory.createPair()
function createPair(address tokenA, address tokenB) external returns (address pair) {
    require(tokenA != tokenB, "IDENTICAL_ADDRESSES");
    (address token0, address token1) = tokenA < tokenB
        ? (tokenA, tokenB) : (tokenB, tokenA);

    // 중복 생성 방지
    require(getPair[token0][token1] == address(0), "PAIR_EXISTS");

    // CREATE2로 결정론적 주소 생성
    bytes memory bytecode = type(UniswapV2Pair).creationCode;
    bytes32 salt = keccak256(abi.encodePacked(token0, token1));
    assembly {
        pair := create2(0, add(bytecode, 32), mload(bytecode), salt)
    }

    UniswapV2Pair(pair).initialize(token0, token1);
    getPair[token0][token1] = pair;
    getPair[token1][token0] = pair;  // 역방향도 저장
}`}</pre>
        <p>
          <strong>CREATE2</strong>: 배포 주소를 미리 계산 가능 — Router가 pair 주소를 찾는 데 활용<br />
          salt는 <code>keccak256(token0, token1)</code> — 정렬된 주소 쌍<br />
          배포 후 <code>getPair</code> 양방향 매핑 — <code>pairFor(tokenA, tokenB)</code>를 정렬 없이 호출 가능
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">mint — 유동성 공급</h3>

        <MintLpViz />

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`function mint(address to) external returns (uint liquidity) {
    (uint112 _reserve0, uint112 _reserve1,) = getReserves();
    uint balance0 = IERC20(token0).balanceOf(address(this));
    uint balance1 = IERC20(token1).balanceOf(address(this));
    uint amount0 = balance0 - _reserve0;  // 사용자가 방금 입금한 양
    uint amount1 = balance1 - _reserve1;

    uint _totalSupply = totalSupply;
    if (_totalSupply == 0) {
        // 최초 LP: sqrt(x·y) 공식
        liquidity = sqrt(amount0 * amount1) - MINIMUM_LIQUIDITY;
        _mint(address(0), MINIMUM_LIQUIDITY);  // 영구 잠금
    } else {
        // 기존 LP: 비율 유지
        liquidity = min(
            amount0 * _totalSupply / _reserve0,
            amount1 * _totalSupply / _reserve1
        );
    }

    require(liquidity > 0, "INSUFFICIENT_LIQUIDITY_MINTED");
    _mint(to, liquidity);
    _update(balance0, balance1, _reserve0, _reserve1);
}`}</pre>
        <p>
          <strong>최초 LP만 특별 처리</strong>: <code>sqrt(x·y)</code> 공식으로 LP 토큰 발행<br />
          MINIMUM_LIQUIDITY(1000 wei) 영구 잠금 → <code>totalSupply</code>가 절대 0이 안 됨<br />
          "공격 방지" 역할: 악의적 공격자가 price ratio 조작 어렵게
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">burn — 유동성 출금</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`function burn(address to) external returns (uint amount0, uint amount1) {
    uint liquidity = balanceOf[address(this)];  // Router가 transfer한 LP 토큰
    uint balance0 = IERC20(token0).balanceOf(address(this));
    uint balance1 = IERC20(token1).balanceOf(address(this));
    uint _totalSupply = totalSupply;

    // 지분 비례로 token 계산
    amount0 = liquidity * balance0 / _totalSupply;
    amount1 = liquidity * balance1 / _totalSupply;
    require(amount0 > 0 && amount1 > 0, "INSUFFICIENT_LIQUIDITY_BURNED");

    _burn(address(this), liquidity);
    _safeTransfer(token0, to, amount0);
    _safeTransfer(token1, to, amount1);

    _update(balance0 - amount0, balance1 - amount1, _reserve0, _reserve1);
}`}</pre>
        <p>
          <strong>pull 모델</strong>: Router가 LP 토큰을 Pair에 보낸 후 burn 호출<br />
          pro-rata 분배: <code>(liquidity / totalSupply) × balance</code><br />
          수수료 누적분도 자동 반환 — balance &gt; reserve이기 때문
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">swap — 핵심 로직</h3>

        <SwapFlowViz />

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`function swap(
    uint amount0Out,
    uint amount1Out,
    address to,
    bytes calldata data
) external lock {
    require(amount0Out > 0 || amount1Out > 0, "INSUFFICIENT_OUTPUT_AMOUNT");
    (uint112 _reserve0, uint112 _reserve1,) = getReserves();
    require(amount0Out < _reserve0 && amount1Out < _reserve1, "INSUFFICIENT_LIQUIDITY");

    uint balance0; uint balance1;
    {
        if (amount0Out > 0) _safeTransfer(token0, to, amount0Out);
        if (amount1Out > 0) _safeTransfer(token1, to, amount1Out);
        if (data.length > 0) IUniswapV2Callee(to).uniswapV2Call(msg.sender, amount0Out, amount1Out, data);
        //                                        ↑ Flash Swap 콜백
        balance0 = IERC20(token0).balanceOf(address(this));
        balance1 = IERC20(token1).balanceOf(address(this));
    }

    uint amount0In = balance0 > _reserve0 - amount0Out
        ? balance0 - (_reserve0 - amount0Out) : 0;
    uint amount1In = balance1 > _reserve1 - amount1Out
        ? balance1 - (_reserve1 - amount1Out) : 0;
    require(amount0In > 0 || amount1In > 0, "INSUFFICIENT_INPUT_AMOUNT");

    // k 불변식 검증 (0.3% 수수료 포함)
    uint balance0Adjusted = balance0 * 1000 - amount0In * 3;
    uint balance1Adjusted = balance1 * 1000 - amount1In * 3;
    require(balance0Adjusted * balance1Adjusted >= uint(_reserve0) * _reserve1 * 1000**2, "K");

    _update(balance0, balance1, _reserve0, _reserve1);
}`}</pre>
        <p>
          <strong>먼저 송금 후 검증</strong>: 전통적 방식(입금→검증→송금)과 반대<br />
          이유: Flash Swap 지원 — 사용자가 토큰 먼저 받아서 활용 후 갚기<br />
          <code>balance0Adjusted × balance1Adjusted ≥ reserve0 × reserve1 × 1000²</code>: 수수료 포함 k 검증
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 단순성의 극치</p>
          <p>
            UniswapV2Pair 전체 컨트랙트는 <strong>약 200줄</strong><br />
            이 200줄이:<br />
            - 유동성 풀 관리<br />
            - 스왑 실행 (xyk 불변식 강제)<br />
            - Flash Swap 지원<br />
            - TWAP 오라클 제공<br />
            - LP 토큰 발행/소각
          </p>
          <p className="mt-2">
            "복잡한 UI는 Router가, 코어는 단순하게" — 관심사 분리의 모범<br />
            이 단순성이 <strong>보안·감사·포크 용이성</strong>의 원천<br />
            Uniswap V2는 수백 개 프로젝트가 포크 — 검증된 코어 재사용
          </p>
        </div>

      </div>
    </section>
  );
}
