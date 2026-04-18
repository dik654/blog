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
        <div className="not-prose my-4 bg-muted/50 rounded-xl border border-border overflow-hidden">
          <div className="bg-muted px-5 py-2 border-b border-border">
            <span className="text-sm font-semibold">Position 구조체</span>
            <span className="text-xs text-muted-foreground ml-2">10개 필드</span>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <div>
              <p className="text-xs text-muted-foreground mb-1">식별 &amp; 관리</p>
              <p><code className="text-xs bg-muted px-1 rounded">uint96 nonce</code> — 향후 기능용</p>
              <p><code className="text-xs bg-muted px-1 rounded">address operator</code> — 승인된 관리자</p>
              <p><code className="text-xs bg-muted px-1 rounded">uint80 poolId</code> — 풀 식별자</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">구간 &amp; 유동성</p>
              <p><code className="text-xs bg-muted px-1 rounded">int24 tickLower</code> — 구간 하한</p>
              <p><code className="text-xs bg-muted px-1 rounded">int24 tickUpper</code> — 구간 상한</p>
              <p><code className="text-xs bg-muted px-1 rounded">uint128 liquidity</code> — 유동성 L</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">수수료 회계 스냅샷</p>
              <p><code className="text-xs bg-muted px-1 rounded">uint256 feeGrowthInside0LastX128</code></p>
              <p><code className="text-xs bg-muted px-1 rounded">uint256 feeGrowthInside1LastX128</code></p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">청구 대기 수수료</p>
              <p><code className="text-xs bg-muted px-1 rounded">uint128 tokensOwed0</code> — token0</p>
              <p><code className="text-xs bg-muted px-1 rounded">uint128 tokensOwed1</code> — token1</p>
            </div>
          </div>
        </div>
        <p>
          <strong>10개 필드</strong>: 포지션 식별 + 상태 + 수수료 회계<br />
          <code>liquidity</code>는 L 단위 (토큰 양이 아닌 "유동성 양")<br />
          실제 토큰 양은 √P 변화에 따라 동적 계산됨
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">mint — 새 포지션 생성</h3>
        <div className="not-prose my-4 bg-muted/50 rounded-xl border border-border overflow-hidden">
          <div className="bg-muted px-5 py-2 border-b border-border">
            <span className="text-sm font-semibold">mint() — 새 포지션 생성 흐름</span>
          </div>
          <div className="p-5 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div className="bg-muted rounded-lg p-3">
                <p className="text-xs font-semibold text-muted-foreground mb-1">1. 유동성 추가</p>
                <p className="text-xs"><code className="bg-background px-1 rounded">addLiquidity()</code> &rarr; Pool에 토큰 예치</p>
                <p className="text-xs text-muted-foreground mt-1">token0, token1, fee, tickLower/Upper, amount0/1Desired/Min</p>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <p className="text-xs font-semibold text-muted-foreground mb-1">2. NFT 발행</p>
                <p className="text-xs"><code className="bg-background px-1 rounded">_mint(recipient, _nextId++)</code></p>
                <p className="text-xs text-muted-foreground mt-1">ERC-721 토큰 발행, 고유 tokenId 부여</p>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <p className="text-xs font-semibold text-muted-foreground mb-1">3. 포지션 저장</p>
                <p className="text-xs"><code className="bg-background px-1 rounded">_positions[tokenId] = Position{'{...}'}</code></p>
                <p className="text-xs text-muted-foreground mt-1">feeGrowthInside 초기 스냅샷 저장</p>
              </div>
            </div>
            <div className="bg-muted rounded-lg p-3 text-sm border border-border">
              <p className="text-xs font-semibold text-muted-foreground mb-1">positionKey 계산</p>
              <p className="text-xs"><code className="bg-background px-1 rounded">keccak256(abi.encodePacked(address(this), tickLower, tickUpper))</code></p>
              <p className="text-xs text-muted-foreground mt-1">Pool 레벨에서는 (address, tickLower, tickUpper)로 포지션 식별 &mdash; 여러 사용자 같은 구간 공유 가능</p>
            </div>
          </div>
        </div>
        <p>
          <strong>2단계</strong>: Pool의 <code>mint()</code> 호출 → NFT 발행<br />
          Pool 레벨에서는 <code>(tickLower, tickUpper)</code>가 포지션 키<br />
          여러 사용자가 같은 구간 공유 가능 — Pool이 합산 관리, NFT가 개별 지분 표현
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">수수료 누적 — feeGrowthGlobal</h3>
        <div className="not-prose my-4 bg-muted/50 rounded-xl border border-border overflow-hidden">
          <div className="bg-muted px-5 py-2 border-b border-border">
            <span className="text-sm font-semibold">feeGrowthGlobal — 전역 수수료 누적</span>
          </div>
          <div className="p-5 space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Pool 컨트랙트 상태 변수</p>
                <p><code className="text-xs bg-muted px-1 rounded">uint256 feeGrowthGlobal0X128</code> — token0 누적</p>
                <p><code className="text-xs bg-muted px-1 rounded">uint256 feeGrowthGlobal1X128</code> — token1 누적</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Swap마다 업데이트 로직</p>
                <p className="text-xs"><code className="bg-muted px-1 rounded">feeGrowthGlobal += feeAmount &times; Q128 / liquidity</code></p>
                <p className="text-xs text-muted-foreground mt-1"><code className="bg-muted px-1 rounded">FullMath.mulDiv()</code>로 오버플로우 방지</p>
              </div>
            </div>
            <div className="bg-muted rounded-lg p-3 text-sm border border-border">
              <p className="text-xs font-semibold text-muted-foreground mb-1">의미</p>
              <p className="text-xs">feeGrowthGlobal = &Sigma; (수수료 / L) — 토큰 per 유동성 단위 누적</p>
              <p className="text-xs text-muted-foreground mt-1">각 LP의 수수료 = 자신의 L &times; (현재 feeGrowthGlobal - 마지막 스냅샷)</p>
            </div>
          </div>
        </div>
        <p>
          <strong>feeGrowthGlobal = Σ (수수료 / L)</strong><br />
          단위: 토큰 per 유동성 L — LP가 자기 L 곱하면 수수료 계산 가능<br />
          Q128 고정소수점 — 누적 값이 작은 수수료도 정밀 표현
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">구간 수수료 추적 — feeGrowthInside</h3>

        <FeeGrowthViz />

        <div className="not-prose my-4 bg-muted/50 rounded-xl border border-border overflow-hidden">
          <div className="bg-muted px-5 py-2 border-b border-border">
            <span className="text-sm font-semibold">getFeeGrowthInside() — 구간 수수료 추적</span>
          </div>
          <div className="p-5 space-y-3">
            <div className="text-sm">
              <p className="text-xs text-muted-foreground mb-1">Tick 구조체 (각 tick마다 저장)</p>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <p><code className="text-xs bg-muted px-1 rounded">uint128 liquidityGross</code></p>
                <p><code className="text-xs bg-muted px-1 rounded">int128 liquidityNet</code></p>
                <p><code className="text-xs bg-muted px-1 rounded">uint256 feeGrowthOutside0X128</code></p>
                <p><code className="text-xs bg-muted px-1 rounded">uint256 feeGrowthOutside1X128</code></p>
              </div>
            </div>
            <div className="border-t border-border pt-3">
              <p className="text-xs font-semibold text-muted-foreground mb-2">포함-배제 원리 (3단계 계산)</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-xs font-semibold mb-1">feeGrowthBelow</p>
                  <p className="text-xs"><code className="bg-background px-1 rounded">tickCurrent &ge; tickLower</code></p>
                  <p className="text-xs text-muted-foreground mt-1">&rarr; lower.feeGrowthOutside</p>
                  <p className="text-xs"><code className="bg-background px-1 rounded">tickCurrent &lt; tickLower</code></p>
                  <p className="text-xs text-muted-foreground mt-1">&rarr; global - lower.feeGrowthOutside</p>
                </div>
                <div className="bg-muted rounded-lg p-3">
                  <p className="text-xs font-semibold mb-1">feeGrowthAbove</p>
                  <p className="text-xs"><code className="bg-background px-1 rounded">tickCurrent &lt; tickUpper</code></p>
                  <p className="text-xs text-muted-foreground mt-1">&rarr; upper.feeGrowthOutside</p>
                  <p className="text-xs"><code className="bg-background px-1 rounded">tickCurrent &ge; tickUpper</code></p>
                  <p className="text-xs text-muted-foreground mt-1">&rarr; global - upper.feeGrowthOutside</p>
                </div>
                <div className="bg-muted rounded-lg p-3 ring-1 ring-primary/30">
                  <p className="text-xs font-semibold mb-1">Inside (결과)</p>
                  <p className="text-xs font-mono">Global - Below - Above</p>
                  <p className="text-xs text-muted-foreground mt-1">O(1) 계산 &mdash; tick마다 outside만 저장</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>포함-배제 원리</strong>: Global - (아래 누적) - (위 누적) = 구간 내 누적<br />
          tick마다 <strong>"어느 방향 수수료가 축적됐는지"</strong>만 저장 — O(1) 계산<br />
          LP가 구간 생성 시 초기값 저장, 수거 시 차이 계산
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">수수료 수거 — collect()</h3>

        <CollectFlowViz />

        <div className="not-prose my-4 bg-muted/50 rounded-xl border border-border overflow-hidden">
          <div className="bg-muted px-5 py-2 border-b border-border">
            <span className="text-sm font-semibold">collect() — 수수료 수거 4단계</span>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="bg-muted rounded-lg p-3">
                <p className="text-xs font-semibold text-muted-foreground mb-1">1. feeGrowthInside 조회</p>
                <p className="text-xs"><code className="bg-background px-1 rounded">getFeeGrowthInside(tickLower, tickUpper, ...)</code></p>
                <p className="text-xs text-muted-foreground mt-1">현재 구간 내 누적 수수료 조회</p>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <p className="text-xs font-semibold text-muted-foreground mb-1">2. 증분 계산</p>
                <p className="text-xs"><code className="bg-background px-1 rounded">tokensOwed += (feeGrowthInside - last) &times; L / Q128</code></p>
                <p className="text-xs text-muted-foreground mt-1">마지막 collect 이후 누적분만 계산</p>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <p className="text-xs font-semibold text-muted-foreground mb-1">3. 스냅샷 갱신</p>
                <p className="text-xs"><code className="bg-background px-1 rounded">feeGrowthInsideLastX128 = 현재값</code></p>
                <p className="text-xs text-muted-foreground mt-1">이중 청구 방지</p>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <p className="text-xs font-semibold text-muted-foreground mb-1">4. 토큰 전송</p>
                <p className="text-xs"><code className="bg-background px-1 rounded">pool.collect(recipient, ...)</code></p>
                <p className="text-xs text-muted-foreground mt-1"><code className="bg-background px-1 rounded">amount0Max/amount1Max</code>로 부분 수거 가능</p>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>4단계</strong>: feeGrowthInside 조회 → 증분 계산 → 스냅샷 갱신 → 전송<br />
          마지막 collect 이후 누적된 수수료만 계산 — 이중 청구 방지<br />
          부분 수거 가능 — <code>amount0Max/amount1Max</code>로 금액 제한
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Position NFT의 활용</h3>
        <div className="not-prose my-4 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-muted/50 rounded-xl p-5 border border-border">
            <p className="text-sm font-semibold mb-2">2차 시장 거래</p>
            <p className="text-sm text-muted-foreground">OpenSea, Blur에서 LP 포지션 거래</p>
            <ul className="text-xs text-muted-foreground mt-2 space-y-1">
              <li>고수익 범위 포지션 매수 (수수료 누적분 포함)</li>
              <li>특정 구간 포지션 프리미엄 매도</li>
            </ul>
          </div>
          <div className="bg-muted/50 rounded-xl p-5 border border-border">
            <p className="text-sm font-semibold mb-2">담보 활용</p>
            <p className="text-sm text-muted-foreground">Aave, Morpho에서 V3 포지션을 담보로 대출</p>
            <p className="text-xs text-muted-foreground mt-2">LP 자산 유동화 — 포지션 유지하면서 자본 활용</p>
          </div>
          <div className="bg-muted/50 rounded-xl p-5 border border-border">
            <p className="text-sm font-semibold mb-2">LP 매니저 Vault</p>
            <p className="text-sm text-muted-foreground">Charm/Alpha Vault 패턴</p>
            <p className="text-xs text-muted-foreground mt-2">여러 NFT를 ERC20 vault로 래핑 &rarr; 일반 사용자가 간접 소유</p>
            <p className="text-xs text-muted-foreground mt-1"><code className="text-xs bg-muted px-1 rounded">rebalance()</code>로 포지션 자동 재분배</p>
          </div>
        </div>

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
