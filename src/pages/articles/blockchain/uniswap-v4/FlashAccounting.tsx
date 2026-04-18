import FlashAccountingViz from './viz/FlashAccountingViz';
import BalanceDeltaViz from './viz/BalanceDeltaViz';
import HopComparisonViz from './viz/HopComparisonViz';
import TransientStorageViz from './viz/TransientStorageViz';

export default function FlashAccounting() {
  return (
    <section id="flash-accounting" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Flash Accounting — EIP-1153 Transient Storage</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <FlashAccountingViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">Flash Accounting란</h3>
        <p>
          V2/V3: 각 swap마다 <strong>즉시 토큰 전송</strong> — 여러 operation 시 여러 번 SLOAD/SSTORE<br />
          V4: 연산 중 <strong>balance delta</strong>만 기록, 마지막에 정산 1회<br />
          결과: 다중 swap 가스 대폭 절감
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">EIP-1153 — Transient Storage</h3>

        <TransientStorageViz />
        <div className="bg-muted/50 border border-border rounded-lg p-5 my-4">
          <p className="font-semibold text-sm mb-3">EIP-1153 Opcode (Cancun upgrade, 2024)</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm mb-4">
            <div className="bg-background rounded-md p-3 border border-border">
              <code className="text-xs font-mono">TSTORE(key, value)</code>
              <p className="text-muted-foreground mt-1">트랜잭션 동안만 유지되는 storage 쓰기</p>
            </div>
            <div className="bg-background rounded-md p-3 border border-border">
              <code className="text-xs font-mono">TLOAD(key)</code>
              <p className="text-muted-foreground mt-1">transient storage 읽기</p>
            </div>
          </div>
          <p className="text-sm mb-2">트랜잭션 종료 시 자동 초기화 / 배포 비용 없음</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm">
            <div className="bg-red-50 dark:bg-red-950/30 rounded-md p-3 border border-red-200 dark:border-red-800">
              <p className="font-semibold text-red-700 dark:text-red-400">SSTORE</p>
              <p className="text-muted-foreground">20,000 gas (new) / 2,900 gas (modify)</p>
            </div>
            <div className="bg-orange-50 dark:bg-orange-950/30 rounded-md p-3 border border-orange-200 dark:border-orange-800">
              <p className="font-semibold text-orange-700 dark:text-orange-400">SLOAD</p>
              <p className="text-muted-foreground">2,100 gas (cold) / 100 gas (warm)</p>
            </div>
            <div className="bg-green-50 dark:bg-green-950/30 rounded-md p-3 border border-green-200 dark:border-green-800">
              <p className="font-semibold text-green-700 dark:text-green-400">TSTORE</p>
              <p className="text-muted-foreground">100 gas (항상)</p>
            </div>
          </div>
        </div>
        <p>
          <strong>영구 저장 없이 트랜잭션 내 상태 공유</strong><br />
          주요 사용: reentrancy guard, callback 파라미터 전달, flash accounting<br />
          V4가 이 opcode 최대 활용
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">lock() 패턴 — 진입점 강제</h3>
        <div className="bg-muted/50 border border-border rounded-lg p-5 my-4">
          <p className="font-semibold text-sm mb-3">lock() — PoolManager 진입 함수</p>
          <div className="space-y-2 text-sm">
            <div className="bg-background rounded-md p-3 border border-border">
              <code className="text-xs font-mono">lock(address lockTarget, bytes calldata data)</code>
              <p className="text-muted-foreground mt-1"><code>lockTarget</code>이 <code>IUnlockCallback</code> 구현 필수</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div className="bg-blue-50 dark:bg-blue-950/30 rounded-md p-3 border border-blue-200 dark:border-blue-800">
                <p className="font-semibold text-blue-700 dark:text-blue-400">1. Lock.push</p>
                <p className="text-muted-foreground">호출자를 lock stack에 추가</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-950/30 rounded-md p-3 border border-blue-200 dark:border-blue-800">
                <p className="font-semibold text-blue-700 dark:text-blue-400">2. unlockCallback</p>
                <p className="text-muted-foreground">lockTarget의 콜백 실행 (swap/mint/burn 호출)</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-950/30 rounded-md p-3 border border-blue-200 dark:border-blue-800">
                <p className="font-semibold text-blue-700 dark:text-blue-400">3. require delta=0</p>
                <p className="text-muted-foreground">모든 balance delta가 0이 아니면 revert</p>
              </div>
            </div>
          </div>
          <div className="bg-background rounded-md p-3 border border-border mt-3">
            <p className="text-xs text-muted-foreground">인터페이스: <code>IUnlockCallback.unlockCallback(bytes calldata data) → bytes memory</code></p>
          </div>
        </div>
        <p>
          <strong>모든 operation은 lock() 내부에서만 가능</strong><br />
          사용자 컨트랙트가 <code>unlockCallback</code> 구현 → 여기서 swap/mint/burn 호출<br />
          lock 종료 전 모든 delta를 0으로 만들지 못하면 revert
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">BalanceDelta — 부채 추적</h3>

        <BalanceDeltaViz />

        <div className="bg-muted/50 border border-border rounded-lg p-5 my-4">
          <p className="font-semibold text-sm mb-3">BalanceDelta 구조 &amp; _accountDelta()</p>
          <div className="bg-background rounded-md p-3 border border-border mb-3">
            <p className="text-sm"><code>type BalanceDelta is int256</code> — <code>int128</code> 2개를 하나의 <code>int256</code>에 pack</p>
          </div>
          <div className="space-y-2 text-sm">
            <p className="font-medium"><code>_accountDelta(Currency currency, int128 delta)</code></p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div className="bg-background rounded-md p-3 border border-border">
                <p className="font-semibold">누적 계산</p>
                <p className="text-muted-foreground"><code>currencyDelta[currency]</code>에 delta를 더해 net 변화량 갱신 (transient storage)</p>
              </div>
              <div className="bg-background rounded-md p-3 border border-border">
                <p className="font-semibold">zero 카운터 추적</p>
                <p className="text-muted-foreground">0 → non-zero 전환 시 <code>nonZeroDeltaCount++</code>, 역방향 시 <code>--</code></p>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>delta 기록만</strong>: 실제 토큰 이동 없음<br />
          음수 delta = PoolManager에 빚진 토큰 양<br />
          양수 delta = PoolManager가 사용자에게 줄 토큰 양
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">3홉 스왑 비교 — V3 vs V4</h3>

        <HopComparisonViz />

        <div className="bg-muted/50 border border-border rounded-lg p-5 my-4">
          <p className="font-semibold text-sm mb-3">시나리오: A → B → C → D (3홉)</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="border border-red-200 dark:border-red-800 rounded-lg p-4 bg-red-50 dark:bg-red-950/30">
              <p className="font-semibold text-red-700 dark:text-red-400 mb-2">V3 방식</p>
              <div className="space-y-1 text-muted-foreground">
                <p>1. A→B swap: A 전송, B 수령 (ERC20 transfer x2)</p>
                <p>2. B→C swap: B 전송, C 수령 (ERC20 transfer x2)</p>
                <p>3. C→D swap: C 전송, D 수령 (ERC20 transfer x2)</p>
              </div>
              <p className="mt-2 font-semibold text-red-700 dark:text-red-400">총 6번 ERC20 transfer</p>
            </div>
            <div className="border border-green-200 dark:border-green-800 rounded-lg p-4 bg-green-50 dark:bg-green-950/30">
              <p className="font-semibold text-green-700 dark:text-green-400 mb-2">V4 방식</p>
              <div className="space-y-1 text-muted-foreground">
                <p>1. <code>unlock</code> 진입</p>
                <p>2. A→B swap: delta 기록만</p>
                <p>3. B→C swap: delta 기록만</p>
                <p>4. C→D swap: delta 기록만</p>
                <p>5. <code>settle</code>: A 전송 1회, D 수령 1회</p>
              </div>
              <p className="mt-2 font-semibold text-green-700 dark:text-green-400">총 2번 ERC20 transfer</p>
            </div>
          </div>
          <p className="text-center text-sm font-semibold mt-3">가스 절감: ~60-70%</p>
        </div>
        <p>
          <strong>중간 토큰 이동 제거</strong>: B, C는 PoolManager 내 이동 불필요<br />
          사용자는 시작 토큰 A만 지불, 최종 토큰 D만 수령<br />
          ERC20 transfer 가스(~50K) 여러 번 절감
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">정산 — settle() &amp; take()</h3>
        <div className="bg-muted/50 border border-border rounded-lg p-5 my-4">
          <p className="font-semibold text-sm mb-3">정산 함수 — lock 내부에서 호출</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="bg-background rounded-lg p-4 border border-border">
              <p className="font-semibold mb-2">settle(Currency currency) → <code>uint256 paid</code></p>
              <p className="text-muted-foreground">토큰 입금으로 <strong>음수 delta 해소</strong></p>
              <p className="text-muted-foreground mt-1">사용자가 미리 토큰을 PoolManager에 전송 → <code>balanceOf</code> 차이 계산 → <code>_accountDelta</code>에 양수 delta 기록 (부채 감소)</p>
            </div>
            <div className="bg-background rounded-lg p-4 border border-border">
              <p className="font-semibold mb-2">take(Currency, address to, uint256 amount)</p>
              <p className="text-muted-foreground">토큰 출금으로 <strong>양수 delta 해소</strong></p>
              <p className="text-muted-foreground mt-1"><code>_accountDelta</code>에 음수 delta 기록 → <code>currency.transfer(to, amount)</code>로 실제 토큰 전송</p>
            </div>
          </div>
        </div>
        <p>
          <strong>settle/take 대응</strong>: delta를 0으로 만드는 2가지 방법<br />
          lock 종료 시 모든 currency delta = 0이어야 성공<br />
          그렇지 않으면 "delta imbalance" revert
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">실제 swap 흐름</h3>
        <div className="bg-muted/50 border border-border rounded-lg p-5 my-4">
          <p className="font-semibold text-sm mb-3">실제 swap 흐름 — MyRouter (IUnlockCallback 구현)</p>
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-background rounded-md p-3 border border-border">
                <p className="font-semibold">1. swap() 진입</p>
                <p className="text-muted-foreground"><code>poolManager.unlock(abi.encode(key, params))</code> 호출 — PoolManager가 콜백을 트리거</p>
              </div>
              <div className="bg-background rounded-md p-3 border border-border">
                <p className="font-semibold">2. unlockCallback — swap 실행</p>
                <p className="text-muted-foreground"><code>poolManager.swap(key, params, "")</code> → <code>BalanceDelta</code> 반환, <code>amount0</code> / <code>amount1</code> 추출</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-orange-50 dark:bg-orange-950/30 rounded-md p-3 border border-orange-200 dark:border-orange-800">
                <p className="font-semibold text-orange-700 dark:text-orange-400">3. settle — 음수 delta 해소</p>
                <p className="text-muted-foreground"><code>amount0 &lt; 0</code>이면 ERC20 transfer로 토큰 입금 후 <code>poolManager.settle(currency0)</code></p>
              </div>
              <div className="bg-green-50 dark:bg-green-950/30 rounded-md p-3 border border-green-200 dark:border-green-800">
                <p className="font-semibold text-green-700 dark:text-green-400">4. take — 양수 delta 해소</p>
                <p className="text-muted-foreground"><code>amount1 &gt; 0</code>이면 <code>poolManager.take(currency1, msg.sender, amount)</code>로 토큰 수령</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Flash Accounting의 제약과 능력</p>
          <p>
            <strong>Flash Accounting = 원자적 다중 operation</strong><br />
            lock 내부에서 <strong>어떤 순서로든</strong> 연산 가능:
          </p>
          <p className="mt-2">
            - swap → mint → swap → donate → burn → settle<br />
            - 각 단계마다 delta 누적<br />
            - 끝에 한 번만 실제 transfer
          </p>
          <p className="mt-2">
            <strong>고급 활용</strong>:<br />
            ✓ JIT (Just-In-Time) 유동성: swap 직전 mint, 직후 burn<br />
            ✓ Atomic Arbitrage: 여러 풀 간 가격 차익 1트랜잭션<br />
            ✓ Complex Collateral Swap: Aave 청산 + V4 swap 조합
          </p>
          <p className="mt-2">
            이 유연성이 <strong>"DEX가 DeFi Legos의 조합 도구"</strong>되게 함<br />
            가스 효율 + 표현력 = V4의 핵심 가치
          </p>
        </div>

      </div>
    </section>
  );
}
