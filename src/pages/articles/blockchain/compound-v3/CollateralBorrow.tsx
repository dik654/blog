import SignedPrincipalViz from './viz/SignedPrincipalViz';

export default function CollateralBorrow() {
  return (
    <section id="collateral-borrow" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Base Asset vs Collateral — 단일 차입 자산</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <SignedPrincipalViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">역할 분리의 의미</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <p className="font-semibold text-sm mb-2">Base Asset (예: USDC)</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>예치 — 이자 수령</li>
              <li>차입 — 이자 지불</li>
            </ul>
            <p className="text-xs text-red-500 dark:text-red-400 mt-2">담보 역할 없음 (예치 중에는 차입 불가)</p>
          </div>
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <p className="font-semibold text-sm mb-2">Collateral Assets (예: WETH, WBTC)</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>담보만 제공</li>
            </ul>
            <p className="text-xs text-red-500 dark:text-red-400 mt-2">이자 없음 (순수 담보) / 차입 불가 (base만 차입)</p>
          </div>
        </div>
        <p>
          <strong>명확한 역할 분리</strong>: 사용자가 헷갈릴 여지 없음<br />
          담보 자산은 이자 없지만 <strong>차입 자산 제공</strong>으로 가치 실현<br />
          전통 금융의 "마진 계정"과 유사 — 담보는 lock, base로 차입
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">차입 흐름</h3>
        <div className="bg-muted/50 border border-border rounded-lg p-5 my-4">
          <p className="font-semibold text-sm mb-3">시나리오: 10 WETH 담보로 20,000 USDC 차입</p>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">1</span>
              <div>
                담보 예치: <code className="text-xs">comet.supply(WETH, 10e18)</code><br />
                <span className="text-muted-foreground text-xs"><code>userCollateral[user][WETH].balance = 10e18</code>, <code>assetsIn</code> bitmap에 WETH bit set</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">2</span>
              <div>
                USDC 차입: <code className="text-xs">comet.withdraw(USDC, 20000e6)</code><br />
                <span className="text-muted-foreground text-xs"><code>principal</code>이 음수로 전환 — 차입 상태 진입</span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">3</span>
              <div>
                <code className="text-xs">validateBorrow()</code>: <code className="text-xs">newPrincipal &lt; 0</code>이면 <code className="text-xs">collateralValue &ge; borrowAmount</code> 확인<br />
                <span className="text-muted-foreground text-xs">미달 시 <code>"NotCollateralized"</code> revert</span>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>single-call borrow</strong>: <code>withdraw()</code>로 차입 수행<br />
          internal: principal이 음수로 전환 → 차입 상태 진입<br />
          담보 가치 &lt; 차입 요청 시 revert
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">담보 가치 계산</h3>
        <div className="bg-muted/50 border border-border rounded-lg p-5 my-4">
          <p className="font-semibold text-sm mb-3"><code className="text-xs">getCollateralValue()</code> — 담보 가치 산출</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 flex items-center justify-center text-xs font-bold">1</span>
              <div><code className="text-xs">assetsIn</code> bitmap 순회 — 보유 담보만 조회 (O(1) 판별)</div>
            </div>
            <div className="flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 flex items-center justify-center text-xs font-bold">2</span>
              <div>각 담보: <code className="text-xs">balance * price / scale * borrowCollateralFactor / FACTOR_SCALE</code></div>
            </div>
            <div className="flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 flex items-center justify-center text-xs font-bold">3</span>
              <div>모든 담보의 가치 합산 후 반환</div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
            <div className="bg-background border border-border rounded p-2 text-center">
              <div className="text-xs text-muted-foreground">borrowCollateralFactor</div>
              <div>차입 가능 비율 (WETH 83%)</div>
            </div>
            <div className="bg-background border border-border rounded p-2 text-center">
              <div className="text-xs text-muted-foreground">liquidateCollateralFactor</div>
              <div>청산 임계치 (WETH 90%)</div>
            </div>
          </div>
        </div>
        <p>
          <strong>2가지 factor</strong>: borrow(LTV), liquidate(LT)<br />
          borrow factor &lt; liquidate factor → 안전 마진<br />
          WETH: 차입 가능 83%, 청산 기준 90%
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">withdrawCollateral — 담보 회수</h3>
        <div className="bg-muted/50 border border-border rounded-lg p-5 my-4">
          <p className="font-semibold text-sm mb-3"><code className="text-xs">_withdrawCollateral()</code> — 담보 회수 흐름</p>
          <div className="space-y-2 text-sm">
            <div className="flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 flex items-center justify-center text-xs font-bold">1</span>
              <div><code className="text-xs">withdraw(asset, amount)</code> — base면 <code className="text-xs">_withdrawBase()</code>, 아니면 <code className="text-xs">_withdrawCollateral()</code></div>
            </div>
            <div className="flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 flex items-center justify-center text-xs font-bold">2</span>
              <div>담보 차감: <code className="text-xs">userCollateral[src][asset].balance -= amount</code></div>
            </div>
            <div className="flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 flex items-center justify-center text-xs font-bold">3</span>
              <div>잔액 0이면 <code className="text-xs">assetsIn</code> bitmap에서 bit 해제</div>
            </div>
            <div className="flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 flex items-center justify-center text-xs font-bold">4</span>
              <div>차입 중이면 <code className="text-xs">isCollateralized(src)</code> 확인 — 미달 시 revert</div>
            </div>
            <div className="flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 flex items-center justify-center text-xs font-bold">5</span>
              <div><code className="text-xs">doTransferOut(asset, to, amount)</code> — 토큰 전송</div>
            </div>
          </div>
        </div>
        <p>
          <strong>담보 회수 안전 체크</strong>: 차입 중이면 HF &gt; 1 필수<br />
          차입 없으면 자유롭게 회수 가능<br />
          bitmap 정리 — 담보 0 된 자산 제거
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">다중 담보 지원</h3>
        <div className="bg-muted/50 border border-border rounded-lg p-5 my-4">
          <p className="font-semibold text-sm mb-3">다중 담보 예시 — 담보 가치 합산</p>
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm border border-border">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border px-3 py-1.5 text-left">담보</th>
                  <th className="border border-border px-3 py-1.5 text-left">수량</th>
                  <th className="border border-border px-3 py-1.5 text-left">가격</th>
                  <th className="border border-border px-3 py-1.5 text-left">Factor</th>
                  <th className="border border-border px-3 py-1.5 text-left">담보 가치</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-border px-3 py-1 font-mono">WETH</td>
                  <td className="border border-border px-3 py-1">5</td>
                  <td className="border border-border px-3 py-1">$3,000</td>
                  <td className="border border-border px-3 py-1">83%</td>
                  <td className="border border-border px-3 py-1 font-mono">$12,450</td>
                </tr>
                <tr>
                  <td className="border border-border px-3 py-1 font-mono">WBTC</td>
                  <td className="border border-border px-3 py-1">0.1</td>
                  <td className="border border-border px-3 py-1">$60,000</td>
                  <td className="border border-border px-3 py-1">70%</td>
                  <td className="border border-border px-3 py-1 font-mono">$4,200</td>
                </tr>
                <tr>
                  <td className="border border-border px-3 py-1 font-mono">LINK</td>
                  <td className="border border-border px-3 py-1">1,000</td>
                  <td className="border border-border px-3 py-1">$15</td>
                  <td className="border border-border px-3 py-1">67%</td>
                  <td className="border border-border px-3 py-1 font-mono">$10,050</td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="bg-muted font-semibold">
                  <td className="border border-border px-3 py-1.5" colSpan={4}>Total borrow capacity</td>
                  <td className="border border-border px-3 py-1.5 font-mono">$26,700</td>
                </tr>
              </tfoot>
            </table>
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            일부 담보 출금 시 남은 담보로 HF 체크 / 전체 출금 시 차입 모두 상환 필요
          </p>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">V2 vs V3 사용자 경험 비교</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <p className="font-semibold text-sm mb-2">V2 — 다중 role 혼재</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li><code className="text-xs">cUSDC</code> (supply + collateral)</li>
              <li><code className="text-xs">cETH</code> (supply + collateral)</li>
              <li>debt: <code className="text-xs">DAI</code> + <code className="text-xs">USDT</code></li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">어느 자산이 담보인지, 이자 받는지 혼란</p>
          </div>
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <p className="font-semibold text-sm mb-2">V3 — 역할 명확</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li>USDC balance: 0 (not supplying)</li>
              <li>WETH collateral: 5</li>
              <li>USDC debt: 10,000</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">역할 100% 명확</p>
            <p className="text-xs text-red-500 dark:text-red-400 mt-1">제한: USDC 동시 공급 &amp; 차입 불가 (다른 market에서만 가능)</p>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: "역할 분리"의 위력</p>
          <p>
            Compound V3의 단일 base asset 모델은 <strong>금융공학적으로 우아</strong>:
          </p>
          <p className="mt-2">
            ✓ <strong>계정 상태 단순</strong>: principal 하나로 supply/borrow 표현<br />
            ✓ <strong>HF 계산 단순</strong>: collateral 값 / 단일 debt 값<br />
            ✓ <strong>청산 단순</strong>: 단일 asset만 청산<br />
            ✓ <strong>감사 단순</strong>: 공격 시나리오 축소
          </p>
          <p className="mt-2">
            트레이드오프:<br />
            ✗ 크로스 마켓 전략 불가 (여러 Comet 조합 필요)<br />
            ✗ "한 market에서 모든 것" 경험 상실
          </p>
          <p className="mt-2">
            <strong>시장 반응</strong>: "보수적 고유동성 자산"에 이상적<br />
            USDC, ETH 같은 blue-chip에는 V3 적합<br />
            exotic 자산은 여전히 Aave 선호<br />
            두 모델이 공존 — DeFi 다양성
          </p>
        </div>

      </div>
    </section>
  );
}
