import M from '@/components/ui/math';
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
        <div className="not-prose space-y-3 mb-4">
          <div className="rounded-lg border border-sky-500/30 bg-sky-500/5 p-4">
            <p className="font-semibold text-sm mb-2"><code>swapExactTokensForTokens()</code> — 파라미터</p>
            <div className="grid gap-2 sm:grid-cols-2 text-sm">
              <div className="space-y-1">
                <p><code>uint amountIn</code> — 입력 토큰 양 (정확)</p>
                <p><code>uint amountOutMin</code> — 최소 출력 (슬리피지 보호)</p>
                <p><code>address[] path</code> — 경로: [tokenA, tokenB, ...]</p>
              </div>
              <div className="space-y-1">
                <p><code>address to</code> — 출력 수신 주소</p>
                <p><code>uint deadline</code> — 트랜잭션 만료 시각</p>
                <p className="text-muted-foreground"><code>ensure(deadline)</code> modifier 적용</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">3단계 실행 흐름</p>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li><code>getAmountsOut(amountIn, path)</code> — 경로별 출력량 미리 계산</li>
              <li><code>safeTransferFrom(path[0], msg.sender, pairFor(...))</code> — 첫 Pair로 입력 전송</li>
              <li><code>_swap(amounts, path, to)</code> — 경로 따라 swap 연쇄 실행</li>
            </ol>
          </div>
        </div>
        <p>
          <strong>3단계 흐름</strong>: 출력 계산 → 입력 전송 → 연쇄 swap<br />
          <code>amountOutMin</code>: 프론트엔드가 예상 출력 × (1 - slippage) 계산<br />
          <code>deadline</code>: MEV 대응 — 오래된 트랜잭션이 유리한 가격에 실행되는 것 방지
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">_swap — 다중 홉 연쇄 실행</h3>

        <MultiHopViz />

        <div className="not-prose space-y-3 mb-4">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2"><code>_swap()</code> — 다중 홉 루프</p>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li>각 홉마다 <code>(input, output)</code> 페어 결정</li>
              <li><code>sortTokens</code>로 token0/token1 정렬 → <code>amount0Out</code> / <code>amount1Out</code> 배정</li>
              <li>수신 주소 결정: 중간 홉이면 <strong>다음 Pair</strong>, 마지막이면 <code>_to</code></li>
              <li><code>pair.swap(amount0Out, amount1Out, to, "")</code> 호출</li>
            </ol>
          </div>
          <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
            <p className="font-semibold text-sm mb-1">연쇄 전송 최적화</p>
            <p className="text-sm">중간 단계 결과를 <strong>다음 Pair로 직접 전송</strong> — Router 경유 없이 가스 절감</p>
          </div>
        </div>
        <p>
          <strong>연쇄 전송 최적화</strong>: 중간 단계 결과를 다음 Pair로 직접 전송<br />
          ex: A→B→C 경로 시, A→B의 출력을 B→C Pair로 바로 보냄 — Router 경유 없음<br />
          이 패턴으로 3홉 swap도 단일 트랜잭션, 최소 가스
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">getAmountsOut — 경로 따라 출력 계산</h3>

        <GetAmountsOutViz />

        <div className="not-prose space-y-3 mb-4">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2"><code>getAmountsOut(amountIn, path)</code> — view 함수</p>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li><code>amounts[0] = amountIn</code></li>
              <li>각 홉마다 <code>getReserves</code> 조회 → <code>getAmountOut</code> 계산</li>
              <li>결과 배열: <code>[amountIn, hop1Out, hop2Out, ...]</code></li>
            </ol>
          </div>
          <div className="rounded-lg border border-sky-500/30 bg-sky-500/5 p-4">
            <p className="font-semibold text-sm mb-2"><code>getAmountOut</code> — 0.3% 수수료 포함 공식</p>
            <p className="text-sm font-mono mb-2">amountInWithFee = amountIn * 997</p>
            <p className="text-sm font-mono">amountOut = (amountInWithFee * reserveOut) / (reserveIn * 1000 + amountInWithFee)</p>
            <div className="mt-3">
              <M display>{'\\Delta y = \\frac{997 \\cdot \\Delta x \\cdot y}{1000 \\cdot x + 997 \\cdot \\Delta x}'}</M>
            </div>
          </div>
        </div>
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

        <div className="not-prose space-y-3 mb-4">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2"><code>addLiquidity()</code> — 파라미터</p>
            <div className="grid gap-2 sm:grid-cols-2 text-sm">
              <div className="space-y-1">
                <p><code>tokenA</code>, <code>tokenB</code> — 페어 토큰 주소</p>
                <p><code>amountADesired</code>, <code>amountBDesired</code> — 희망 입금량</p>
              </div>
              <div className="space-y-1">
                <p><code>amountAMin</code>, <code>amountBMin</code> — 최소 허용치</p>
                <p><code>to</code> — LP 수신 주소, <code>deadline</code> — 만료 시각</p>
              </div>
            </div>
          </div>
          <div className="rounded-lg border border-sky-500/30 bg-sky-500/5 p-4">
            <p className="font-semibold text-sm mb-2">4단계 실행</p>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li><code>_addLiquidity()</code> — 현재 reserve 비율에 맞춰 최적 비율 계산</li>
              <li><code>pairFor(tokenA, tokenB)</code> — Pair 주소 결정론적 계산</li>
              <li><code>safeTransferFrom</code> × 2 — 두 토큰을 Pair로 전송</li>
              <li><code>pair.mint(to)</code> — LP 토큰 발행</li>
            </ol>
          </div>
        </div>
        <p>
          <strong>최적 비율 자동 계산</strong>: 사용자가 원하는 양과 현재 reserve 비율 맞춤<br />
          예: 500 USDC + 1 ETH 원하는데 시장가 $3000이면 → 500 USDC + 0.167 ETH 자동 조정<br />
          amountAMin/BMin: 조정 후 최소 허용치 — 프론트에서 보호 장치 설정
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">MEV & 슬리피지 보호</h3>

        <SandwichAttackViz />

        <div className="not-prose space-y-3 mb-4">
          <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
            <p className="font-semibold text-sm mb-2">샌드위치 공격 시나리오</p>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li><strong>사용자</strong>: 10 ETH → 30,000 USDC 스왑 (<code>amountOutMin=29700</code>)</li>
              <li><strong>봇 (프론트런)</strong>: 100 ETH → USDC 선매수 — 가격 상승 유도</li>
              <li><strong>사용자 실행</strong>: 원하는 양보다 적게 받음 → <code>amountOutMin</code> 29,700이 보호 (28,000이면 revert)</li>
              <li><strong>봇 (백런)</strong>: USDC → ETH 매도 — 차익 실현</li>
            </ol>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2"><code>amountOutMin</code> 계산 (프론트엔드)</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li><code>expectedOut = getAmountsOut(10e18, [WETH, USDC])[1]</code></li>
              <li><code>slippage = 0.01</code> (1%)</li>
              <li><code>amountOutMin = expectedOut * (1 - slippage)</code></li>
            </ul>
          </div>
        </div>
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
