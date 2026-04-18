import LockViz from './viz/LockViz';
import V4GasComparisonViz from './viz/V4GasComparisonViz';

export default function PoolManagerSection() {
  return (
    <section id="pool-manager" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">PoolManager &amp; lock() 진입점</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <LockViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">PoolManager — 모든 풀의 집</h3>
        <div className="bg-muted/50 border border-border rounded-lg p-5 my-4">
          <p className="font-semibold text-sm mb-3">PoolManager 컨트랙트 구조</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm mb-3">
            <div className="bg-background rounded-md p-3 border border-border">
              <code className="text-xs font-mono">IPoolManager</code>
              <p className="text-muted-foreground mt-1">외부 인터페이스</p>
            </div>
            <div className="bg-background rounded-md p-3 border border-border">
              <code className="text-xs font-mono">ProtocolFees</code>
              <p className="text-muted-foreground mt-1">프로토콜 수수료 관리</p>
            </div>
            <div className="bg-background rounded-md p-3 border border-border">
              <code className="text-xs font-mono">NoDelegateCall</code>
              <p className="text-muted-foreground mt-1">delegatecall 차단</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div className="bg-background rounded-md p-3 border border-border">
              <p className="font-semibold">상태</p>
              <p className="text-muted-foreground"><code>mapping(PoolId =&gt; Pool.State) internal _pools</code></p>
            </div>
            <div className="bg-background rounded-md p-3 border border-border">
              <p className="font-semibold">라이브러리 바인딩</p>
              <p className="text-muted-foreground"><code>using Pool for *</code>, <code>using Hooks for IHooks</code>, <code>using CurrencyLibrary for Currency</code></p>
            </div>
          </div>
        </div>
        <p>
          <strong>NoDelegateCall</strong>: delegatecall 방지 — V2가 Pair를 delegate로 호출했던 취약점 대응<br />
          <code>using Pool for *</code>: Pool 라이브러리의 모든 함수를 Pool.State에 바인딩<br />
          내부 함수 접근 단순화
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">initialize() — 풀 생성</h3>
        <div className="bg-muted/50 border border-border rounded-lg p-5 my-4">
          <p className="font-semibold text-sm mb-3">initialize() — 6단계 풀 생성</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div className="bg-background rounded-md p-3 border border-border">
              <p className="font-semibold">1. tickSpacing 검증</p>
              <p className="text-muted-foreground"><code>MIN_TICK_SPACING</code> ~ <code>MAX_TICK_SPACING</code> 범위 확인</p>
            </div>
            <div className="bg-background rounded-md p-3 border border-border">
              <p className="font-semibold">2. Fee 검증</p>
              <p className="text-muted-foreground"><code>key.fee &lt; 1_000_000</code> (0 ~ 100%)</p>
            </div>
            <div className="bg-background rounded-md p-3 border border-border">
              <p className="font-semibold">3. Hook 주소 검증</p>
              <p className="text-muted-foreground"><code>validateHookAddress(key)</code> — 플래그와 selector 일치 확인</p>
            </div>
            <div className="bg-background rounded-md p-3 border border-border">
              <p className="font-semibold">4. beforeInitialize hook</p>
              <p className="text-muted-foreground">Hook 컨트랙트의 pre-hook 실행</p>
            </div>
            <div className="bg-background rounded-md p-3 border border-border">
              <p className="font-semibold">5. 풀 상태 초기화</p>
              <p className="text-muted-foreground"><code>_pools[id].initialize(sqrtPriceX96, protocolFee, lpFee)</code></p>
            </div>
            <div className="bg-background rounded-md p-3 border border-border">
              <p className="font-semibold">6. afterInitialize hook</p>
              <p className="text-muted-foreground">Post-hook 실행 + <code>Initialize</code> 이벤트 emit</p>
            </div>
          </div>
        </div>
        <p>
          <strong>6단계 초기화</strong>: 검증 → hook 검증 → Pre-hook → 상태 생성 → Post-hook<br />
          Hook 주소의 플래그와 실제 구현 함수 selector 비교 — 잘못된 hook 방지<br />
          풀 생성 가스: ~200K (V3는 ~5M) — 25배 절감
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">unlock() — 모든 operation 진입점</h3>
        <div className="bg-muted/50 border border-border rounded-lg p-5 my-4">
          <p className="font-semibold text-sm mb-3">unlock() — 5단계 실행 흐름</p>
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              <div className="bg-background rounded-md p-3 border border-border">
                <p className="font-semibold">1. 재진입 확인</p>
                <p className="text-muted-foreground text-xs"><code>Lock.isUnlocked()</code> → revert <code>AlreadyUnlocked</code></p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-950/30 rounded-md p-3 border border-blue-200 dark:border-blue-800">
                <p className="font-semibold text-blue-700 dark:text-blue-400">2. unlock</p>
                <p className="text-muted-foreground text-xs"><code>Lock.unlock()</code> 플래그 설정</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-950/30 rounded-md p-3 border border-blue-200 dark:border-blue-800">
                <p className="font-semibold text-blue-700 dark:text-blue-400">3. 콜백 실행</p>
                <p className="text-muted-foreground text-xs"><code>msg.sender.unlockCallback(data)</code></p>
              </div>
              <div className="bg-orange-50 dark:bg-orange-950/30 rounded-md p-3 border border-orange-200 dark:border-orange-800">
                <p className="font-semibold text-orange-700 dark:text-orange-400">4. delta 검증</p>
                <p className="text-muted-foreground text-xs"><code>NonzeroDeltaCount != 0</code> → revert</p>
              </div>
              <div className="bg-background rounded-md p-3 border border-border">
                <p className="font-semibold">5. Lock 해제</p>
                <p className="text-muted-foreground text-xs"><code>Lock.lock()</code></p>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>5단계 실행</strong>: unlock 체크 → 잠금 → 콜백 → delta 검증 → 잠금 해제<br />
          <code>msg.sender</code>가 <code>IUnlockCallback</code> 구현 필수 — Router 등 주체<br />
          delta 잔여 시 <strong>CurrencyNotSettled</strong> — 사용자가 토큰 정산 안 함
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">swap() 내부 — Pool 라이브러리 호출</h3>
        <div className="bg-muted/50 border border-border rounded-lg p-5 my-4">
          <p className="font-semibold text-sm mb-3">swap() 내부 — <code>onlyWhenUnlocked</code> 수식어</p>
          <div className="space-y-2 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="bg-background rounded-md p-3 border border-border">
                <p className="font-semibold">1. beforeSwap hook</p>
                <p className="text-muted-foreground"><code>key.hooks.beforeSwap(msg.sender, key, params, hookData)</code> → <code>BeforeSwapDelta</code> + <code>lpFeeOverride</code> 반환</p>
              </div>
              <div className="bg-background rounded-md p-3 border border-border">
                <p className="font-semibold">2. pool.swap() 실행</p>
                <p className="text-muted-foreground"><code>tickSpacing</code>, <code>zeroForOne</code>, <code>amountSpecified</code>, <code>sqrtPriceLimitX96</code>, <code>lpFeeOverride</code> 전달</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="bg-background rounded-md p-3 border border-border">
                <p className="font-semibold">3. beforeSwapDelta 적용</p>
                <p className="text-muted-foreground">hook 결과를 swap delta에 합산</p>
              </div>
              <div className="bg-background rounded-md p-3 border border-border">
                <p className="font-semibold">4. delta 기록</p>
                <p className="text-muted-foreground"><code>_accountPoolBalanceDelta</code> — 실제 토큰 이동 없음</p>
              </div>
              <div className="bg-background rounded-md p-3 border border-border">
                <p className="font-semibold">5. afterSwap hook</p>
                <p className="text-muted-foreground">후처리 + <code>Swap</code> 이벤트 emit</p>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>onlyWhenUnlocked 수식어</strong>: unlock() 안에서만 호출 가능<br />
          <strong>hook 실행 결과 반영</strong>: <code>beforeSwapDelta</code>로 swap 파라미터 변경 가능<br />
          <code>lpFeeOverride</code>로 dynamic fee 적용 가능
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">modifyLiquidity() — V3 mint/burn 대체</h3>
        <div className="bg-muted/50 border border-border rounded-lg p-5 my-4">
          <p className="font-semibold text-sm mb-3">modifyLiquidity() — V3 mint/burn 통합</p>
          <div className="bg-background rounded-md p-3 border border-border text-sm mb-3">
            <p className="text-muted-foreground"><code>liquidityDelta &gt; 0</code>: 유동성 추가 / <code>liquidityDelta &lt; 0</code>: 유동성 제거 — 하나의 함수로 통합</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            <div className="bg-background rounded-md p-3 border border-border">
              <p className="font-semibold">1. beforeModifyLiquidity hook</p>
              <p className="text-muted-foreground">Add 또는 Remove에 따라 해당 pre-hook 실행</p>
            </div>
            <div className="bg-background rounded-md p-3 border border-border">
              <p className="font-semibold">2. pool.modifyLiquidity()</p>
              <p className="text-muted-foreground"><code>owner</code>, <code>tickLower</code>, <code>tickUpper</code>, <code>liquidityDelta</code>, <code>tickSpacing</code>, <code>salt</code> 전달</p>
            </div>
            <div className="bg-background rounded-md p-3 border border-border">
              <p className="font-semibold">3. delta 합산 &amp; 기록</p>
              <p className="text-muted-foreground"><code>callerDelta = principalDelta + feeDelta</code> → <code>_accountPoolBalanceDelta</code></p>
            </div>
            <div className="bg-background rounded-md p-3 border border-border">
              <p className="font-semibold">4. afterModifyLiquidity hook</p>
              <p className="text-muted-foreground">후처리 hook에 <code>callerDelta</code> + <code>feesAccrued</code> 전달</p>
            </div>
          </div>
        </div>
        <p>
          <strong>통합 API</strong>: V3의 mint/burn 구분 없이 delta 부호로 결정<br />
          <code>salt</code>: 같은 소유자가 여러 포지션 구분 가능 (V3의 NFT tokenId 대체)<br />
          수수료 누적분도 함께 반환 — 별도 collect 호출 불필요
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">V3 대비 가스 절감</h3>

        <V4GasComparisonViz />

        <div className="bg-muted/50 border border-border rounded-lg p-5 my-4">
          <p className="font-semibold text-sm mb-3">V3 vs V4 가스 비교</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
            <div className="bg-background rounded-lg p-4 border border-border">
              <p className="font-semibold mb-2">단일 swap</p>
              <div className="flex justify-between text-muted-foreground"><span>V3: ~140K gas</span><span>V4: ~100K gas</span></div>
              <p className="text-green-600 dark:text-green-400 font-semibold text-right">30% 절감</p>
            </div>
            <div className="bg-background rounded-lg p-4 border border-border">
              <p className="font-semibold mb-2">2홉 swap</p>
              <div className="flex justify-between text-muted-foreground"><span>V3: ~260K gas</span><span>V4: ~150K gas</span></div>
              <p className="text-green-600 dark:text-green-400 font-semibold text-right">42% 절감</p>
            </div>
            <div className="bg-background rounded-lg p-4 border border-border">
              <p className="font-semibold mb-2">LP mint (새 포지션)</p>
              <div className="flex justify-between text-muted-foreground"><span>V3: ~400K gas</span><span>V4: ~250K gas</span></div>
              <p className="text-green-600 dark:text-green-400 font-semibold text-right">ERC-6909, NFT 없음</p>
            </div>
            <div className="bg-background rounded-lg p-4 border border-border">
              <p className="font-semibold mb-2">새 풀 생성</p>
              <div className="flex justify-between text-muted-foreground"><span>V3: ~5.2M gas</span><span>V4: ~180K gas</span></div>
              <p className="text-green-600 dark:text-green-400 font-semibold text-right">storage write만</p>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
            <div className="bg-green-50 dark:bg-green-950/30 rounded-md p-2 border border-green-200 dark:border-green-800 text-center">
              <p className="text-green-700 dark:text-green-400 text-xs font-semibold">Singleton</p>
              <p className="text-muted-foreground text-xs">deploy 제거</p>
            </div>
            <div className="bg-green-50 dark:bg-green-950/30 rounded-md p-2 border border-green-200 dark:border-green-800 text-center">
              <p className="text-green-700 dark:text-green-400 text-xs font-semibold">Flash Accounting</p>
              <p className="text-muted-foreground text-xs">중간 transfer 제거</p>
            </div>
            <div className="bg-green-50 dark:bg-green-950/30 rounded-md p-2 border border-green-200 dark:border-green-800 text-center">
              <p className="text-green-700 dark:text-green-400 text-xs font-semibold">ERC-6909</p>
              <p className="text-muted-foreground text-xs">NFT 오버헤드 제거</p>
            </div>
            <div className="bg-green-50 dark:bg-green-950/30 rounded-md p-2 border border-green-200 dark:border-green-800 text-center">
              <p className="text-green-700 dark:text-green-400 text-xs font-semibold">Transient Storage</p>
              <p className="text-muted-foreground text-xs">가드 비용 1/200</p>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: V4의 "혁신 없이 최적화"</p>
          <p>
            V3 → V4 변화는 알고리즘적 혁신 없음:<br />
            - Concentrated liquidity 그대로<br />
            - tick·√P 수학 동일<br />
            - fee tier 유사
          </p>
          <p className="mt-2">
            대신 <strong>엔지니어링 최적화</strong> 극대화:<br />
            ✓ Singleton으로 배포 비용 절감<br />
            ✓ Flash Accounting으로 transfer 제거<br />
            ✓ Transient Storage로 정적 상태 최소화<br />
            ✓ Hooks로 확장성 확보
          </p>
          <p className="mt-2">
            V4는 <strong>"V3의 성숙형"</strong> — 검증된 수학 위에 엔지니어링 레이어<br />
            새 알고리즘 대신 기존 알고리즘의 효율적 구현에 집중<br />
            이는 성숙한 프로토콜의 전형적 진화 패턴
          </p>
        </div>

      </div>
    </section>
  );
}
