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

        <div className="not-prose space-y-3 mb-4">
          <div className="rounded-lg border border-sky-500/30 bg-sky-500/5 p-4">
            <p className="font-semibold text-sm mb-2"><code>UniswapV2Pair</code> — 핵심 상태 변수</p>
            <div className="grid gap-2 sm:grid-cols-2">
              <div className="space-y-1 text-sm">
                <p><code>address factory</code> — Factory 컨트랙트 주소</p>
                <p><code>address token0</code> — 주소 순 더 작은 토큰</p>
                <p><code>address token1</code> — 나머지 토큰</p>
              </div>
              <div className="space-y-1 text-sm">
                <p><code>uint112 reserve0</code> — token0 준비금</p>
                <p><code>uint112 reserve1</code> — token1 준비금</p>
                <p><code>uint32 blockTimestampLast</code> — 마지막 업데이트 블록</p>
              </div>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border p-4">
              <p className="font-semibold text-sm mb-1"><code>price0CumulativeLast</code></p>
              <p className="text-sm">TWAP 누적 가격</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="font-semibold text-sm mb-1"><code>price1CumulativeLast</code></p>
              <p className="text-sm">TWAP 누적 가격 (역방향)</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="font-semibold text-sm mb-1"><code>kLast</code></p>
              <p className="text-sm">마지막 mint/burn 시점의 <code>reserve0 * reserve1</code></p>
            </div>
          </div>
        </div>
        <p>
          <strong>uint112 reserve</strong>: 2개 reserve + timestamp를 32바이트 1 슬롯에 packing<br />
          112+112+32 = 256비트 — SSTORE 가스 절감 (1회 쓰기로 3개 변수 업데이트)<br />
          <code>token0 &lt; token1</code> 정렬 — 같은 페어의 2개 컨트랙트 중복 방지
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">초기화 — Factory에서 배포</h3>

        <Create2PairViz />

        <div className="not-prose space-y-3 mb-4">
          <div className="rounded-lg border border-sky-500/30 bg-sky-500/5 p-4">
            <p className="font-semibold text-sm mb-2"><code>createPair(tokenA, tokenB)</code> — Factory 함수</p>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li><code>require(tokenA != tokenB)</code> — 동일 토큰 방지</li>
              <li><code>token0 &lt; token1</code>로 정렬 — 중복 페어 방지</li>
              <li><code>require(getPair[token0][token1] == address(0))</code> — 이미 존재하면 revert</li>
            </ol>
          </div>
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
            <p className="font-semibold text-sm mb-2">CREATE2 결정론적 배포</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li><code>bytecode</code> = <code>type(UniswapV2Pair).creationCode</code></li>
              <li><code>salt</code> = <code>keccak256(abi.encodePacked(token0, token1))</code></li>
              <li>assembly: <code>create2(0, add(bytecode, 32), mload(bytecode), salt)</code></li>
            </ul>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">초기화 및 매핑 등록</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li><code>UniswapV2Pair(pair).initialize(token0, token1)</code></li>
              <li><code>getPair[token0][token1] = pair</code> — 정방향</li>
              <li><code>getPair[token1][token0] = pair</code> — 역방향도 저장</li>
            </ul>
          </div>
        </div>
        <p>
          <strong>CREATE2</strong>: 배포 주소를 미리 계산 가능 — Router가 pair 주소를 찾는 데 활용<br />
          salt는 <code>keccak256(token0, token1)</code> — 정렬된 주소 쌍<br />
          배포 후 <code>getPair</code> 양방향 매핑 — <code>pairFor(tokenA, tokenB)</code>를 정렬 없이 호출 가능
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">mint — 유동성 공급</h3>

        <MintLpViz />

        <div className="not-prose space-y-3 mb-4">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2"><code>mint(to)</code> — 입금량 계산</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li><code>getReserves()</code>로 현재 reserve 조회</li>
              <li><code>balanceOf(address(this))</code>로 실제 잔액 확인</li>
              <li><code>amount = balance - reserve</code> — 사용자가 방금 입금한 양</li>
            </ul>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
              <p className="font-semibold text-sm mb-2">최초 LP (<code>totalSupply == 0</code>)</p>
              <p className="text-sm font-mono">liquidity = sqrt(amount0 * amount1) - MINIMUM_LIQUIDITY</p>
              <p className="text-sm mt-1"><code>_mint(address(0), MINIMUM_LIQUIDITY)</code> — 1000 wei 영구 잠금</p>
            </div>
            <div className="rounded-lg border border-sky-500/30 bg-sky-500/5 p-4">
              <p className="font-semibold text-sm mb-2">기존 LP — 비율 유지</p>
              <p className="text-sm font-mono">liquidity = min(amount0 * totalSupply / reserve0, amount1 * totalSupply / reserve1)</p>
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">최종 처리</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li><code>require(liquidity &gt; 0)</code> — 0 발행 방지</li>
              <li><code>_mint(to, liquidity)</code> — LP 토큰 발행</li>
              <li><code>_update()</code> — reserve 갱신</li>
            </ul>
          </div>
        </div>
        <p>
          <strong>최초 LP만 특별 처리</strong>: <code>sqrt(x·y)</code> 공식으로 LP 토큰 발행<br />
          MINIMUM_LIQUIDITY(1000 wei) 영구 잠금 → <code>totalSupply</code>가 절대 0이 안 됨<br />
          "공격 방지" 역할: 악의적 공격자가 price ratio 조작 어렵게
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">burn — 유동성 출금</h3>
        <div className="not-prose space-y-3 mb-4">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2"><code>burn(to)</code> — 유동성 출금</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li><code>liquidity = balanceOf[address(this)]</code> — Router가 전송한 LP 토큰</li>
              <li><code>balance0/1</code> = 현재 Pair의 토큰 잔액</li>
            </ul>
          </div>
          <div className="rounded-lg border border-sky-500/30 bg-sky-500/5 p-4">
            <p className="font-semibold text-sm mb-2">지분 비례 (pro-rata) 분배</p>
            <p className="text-sm font-mono">amount0 = liquidity * balance0 / totalSupply</p>
            <p className="text-sm font-mono">amount1 = liquidity * balance1 / totalSupply</p>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">실행 순서</p>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li><code>_burn(address(this), liquidity)</code> — LP 소각</li>
              <li><code>_safeTransfer(token0, to, amount0)</code> — token0 전송</li>
              <li><code>_safeTransfer(token1, to, amount1)</code> — token1 전송</li>
              <li><code>_update()</code> — reserve 갱신</li>
            </ol>
          </div>
        </div>
        <p>
          <strong>pull 모델</strong>: Router가 LP 토큰을 Pair에 보낸 후 burn 호출<br />
          pro-rata 분배: <code>(liquidity / totalSupply) × balance</code><br />
          수수료 누적분도 자동 반환 — balance &gt; reserve이기 때문
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">swap — 핵심 로직</h3>

        <SwapFlowViz />

        <div className="not-prose space-y-3 mb-4">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2"><code>swap(amount0Out, amount1Out, to, data)</code> — 파라미터</p>
            <div className="grid gap-2 sm:grid-cols-2 text-sm">
              <p><code>amount0Out</code> / <code>amount1Out</code> — 요청 출력량</p>
              <p><code>to</code> — 수신 주소, <code>data</code> — Flash Swap 콜백용</p>
            </div>
          </div>
          <div className="rounded-lg border border-sky-500/30 bg-sky-500/5 p-4">
            <p className="font-semibold text-sm mb-2">실행 흐름 — "먼저 송금 후 검증"</p>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li><code>_safeTransfer</code>로 출력 토큰 전송</li>
              <li><code>data.length &gt; 0</code>이면 <code>IUniswapV2Callee(to).uniswapV2Call()</code> 콜백 실행</li>
              <li><code>balanceOf(address(this))</code>로 현재 잔액 확인</li>
              <li>입력량 역산: <code>amountIn = balance - (reserve - amountOut)</code></li>
            </ol>
          </div>
          <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
            <p className="font-semibold text-sm mb-2">k 불변식 검증 (0.3% 수수료 포함)</p>
            <p className="text-sm font-mono">balance0Adjusted = balance0 * 1000 - amount0In * 3</p>
            <p className="text-sm font-mono">balance1Adjusted = balance1 * 1000 - amount1In * 3</p>
            <p className="text-sm font-mono mt-1">require(adjusted0 * adjusted1 &gt;= reserve0 * reserve1 * 1000^2)</p>
            <p className="text-xs text-muted-foreground mt-2">실패 시 "K" 에러로 전체 트랜잭션 revert</p>
          </div>
        </div>
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
