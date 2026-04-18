import CometPackedViz from './viz/CometPackedViz';
import UserBasicPackedViz from './viz/UserBasicPackedViz';
import AccrueInternalViz from './viz/AccrueInternalViz';
import KinkModelViz from './viz/KinkModelViz';

export default function CometArchitecture() {
  return (
    <section id="comet-architecture" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Comet 컨트랙트 구조</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <CometPackedViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">Comet 주요 상태</h3>
        <div className="bg-muted/50 border border-border rounded-lg p-5 my-4 space-y-4">
          <div>
            <p className="font-semibold text-sm mb-2">Comet 핵심 상태 변수</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="bg-background border border-border rounded p-3">
                <p className="text-xs text-muted-foreground mb-1">Base asset (immutable)</p>
                <p><code className="text-xs">address baseToken</code></p>
                <p><code className="text-xs">address baseTokenPriceFeed</code></p>
                <p><code className="text-xs">uint64 baseScale</code></p>
              </div>
              <div className="bg-background border border-border rounded p-3">
                <p className="text-xs text-muted-foreground mb-1">이자율 파라미터 (immutable)</p>
                <p><code className="text-xs">uint64 supplyKink</code></p>
                <p><code className="text-xs">uint64 supplyPerSecondInterestRateSlopeLow</code></p>
                <p><code className="text-xs">uint64 supplyPerSecondInterestRateSlopeHigh</code></p>
                <p className="text-xs text-muted-foreground">Borrow도 동일 구조</p>
              </div>
              <div className="bg-background border border-border rounded p-3">
                <p className="text-xs text-muted-foreground mb-1">누적 이자 index</p>
                <p><code className="text-xs">uint64 baseSupplyIndex_</code></p>
                <p><code className="text-xs">uint64 baseBorrowIndex_</code></p>
                <p><code className="text-xs">uint40 lastAccrualTime_</code></p>
              </div>
              <div className="bg-background border border-border rounded p-3">
                <p className="text-xs text-muted-foreground mb-1">총 잔액 · 사용자 계정</p>
                <p><code className="text-xs">uint104 totalSupplyBase</code></p>
                <p><code className="text-xs">uint104 totalBorrowBase</code></p>
                <p><code className="text-xs">{"mapping(address => UserBasic)"}</code></p>
              </div>
            </div>
          </div>
          <div>
            <p className="font-semibold text-sm mb-2">UserBasic 구조체</p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-sm">
              <div className="bg-background border border-border rounded p-2 text-center">
                <div className="text-xs text-muted-foreground">principal</div>
                <code className="text-xs">int104</code>
                <div className="text-xs text-muted-foreground">양수=예치, 음수=차입</div>
              </div>
              <div className="bg-background border border-border rounded p-2 text-center">
                <div className="text-xs text-muted-foreground">baseTrackingIndex</div>
                <code className="text-xs">uint64</code>
              </div>
              <div className="bg-background border border-border rounded p-2 text-center">
                <div className="text-xs text-muted-foreground">assetsIn</div>
                <code className="text-xs">uint16</code>
                <div className="text-xs text-muted-foreground">담보 bitmap</div>
              </div>
              <div className="bg-background border border-border rounded p-2 text-center">
                <div className="text-xs text-muted-foreground">_reserved</div>
                <code className="text-xs">uint8</code>
              </div>
            </div>
          </div>
          <div>
            <p className="font-semibold text-sm mb-2">UserCollateral 구조체</p>
            <div className="grid grid-cols-2 gap-2 text-sm max-w-xs">
              <div className="bg-background border border-border rounded p-2 text-center">
                <div className="text-xs text-muted-foreground">balance</div>
                <code className="text-xs">uint128</code>
              </div>
              <div className="bg-background border border-border rounded p-2 text-center">
                <div className="text-xs text-muted-foreground">_reserved</div>
                <code className="text-xs">uint128</code>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>principal은 signed int</strong>: 양수=예치, 음수=차입<br />
          한 address가 동시 supply·borrow 불가 — 부호로 상태 구분<br />
          <code>assetsIn</code> bitmap: 어떤 담보 자산 보유 중인지 O(1) 조회
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">packed storage 최적화</h3>

        <UserBasicPackedViz />
        <div className="bg-muted/50 border border-border rounded-lg p-5 my-4">
          <p className="font-semibold text-sm mb-3">UserBasic Storage Layout — 1 Slot (32 bytes)</p>
          <div className="flex flex-wrap gap-1 text-xs font-mono mb-3">
            <div className="bg-blue-100 dark:bg-blue-900/40 border border-blue-300 dark:border-blue-700 rounded px-2 py-1"><code>int104 principal</code> <span className="text-muted-foreground">13B</span></div>
            <div className="bg-green-100 dark:bg-green-900/40 border border-green-300 dark:border-green-700 rounded px-2 py-1"><code>uint64 baseTrackingIndex</code> <span className="text-muted-foreground">8B</span></div>
            <div className="bg-green-100 dark:bg-green-900/40 border border-green-300 dark:border-green-700 rounded px-2 py-1"><code>uint64 baseTrackingAccrued</code> <span className="text-muted-foreground">8B</span></div>
            <div className="bg-amber-100 dark:bg-amber-900/40 border border-amber-300 dark:border-amber-700 rounded px-2 py-1"><code>uint16 assetsIn</code> <span className="text-muted-foreground">2B</span></div>
            <div className="bg-neutral-200 dark:bg-neutral-700 border border-neutral-300 dark:border-neutral-600 rounded px-2 py-1"><code>uint8 _reserved</code> <span className="text-muted-foreground">1B</span></div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-background border border-border rounded p-2 text-center">
              <div className="text-xs text-muted-foreground">Cold SLOAD</div>
              <div className="font-mono">2,100 gas</div>
            </div>
            <div className="bg-background border border-border rounded p-2 text-center">
              <div className="text-xs text-muted-foreground">Warm SLOAD</div>
              <div className="font-mono">100 gas</div>
            </div>
          </div>
        </div>
        <p>
          <strong>1 slot = 1 SLOAD</strong>: 사용자 상태 조회 가스 최소화<br />
          int104로 base asset 표현 — USDC 최대 10^31 (충분)<br />
          uint64 index — 시간에 따른 이자 누적 추적
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">supply() — base asset 공급</h3>
        <div className="bg-muted/50 border border-border rounded-lg p-5 my-4">
          <p className="font-semibold text-sm mb-3"><code className="text-xs">supply()</code> — base asset 공급 흐름</p>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">1</span>
              <div><code className="text-xs">supply(asset, amount)</code> 호출 — base면 <code className="text-xs">_supplyBase()</code>, 아니면 <code className="text-xs">_supplyCollateral()</code></div>
            </div>
            <div className="flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">2</span>
              <div><code className="text-xs">accrueInternal()</code> — 이자 index 갱신</div>
            </div>
            <div className="flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">3</span>
              <div><code className="text-xs">doTransferIn(baseToken, from, amount)</code> — 토큰 수신</div>
            </div>
            <div className="flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">4</span>
              <div><code className="text-xs">presentValue(principal) + amount</code> — 현재 잔액에 합산</div>
            </div>
            <div className="flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center text-xs font-bold">5</span>
              <div><code className="text-xs">updateBasePrincipal(dst, newPrincipal)</code> — principal이 signed이므로 부채 감소 or 예치 증가를 같은 함수로 처리</div>
            </div>
          </div>
        </div>
        <p>
          <strong>accrueInternal()</strong>: 이자 index 업데이트 먼저<br />
          <strong>presentValue/principalValue</strong>: index 곱/나눔으로 변환<br />
          양수 principal → 이자 받음, 음수 → 이자 지불
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">이자 누적 — accrueInternal()</h3>

        <AccrueInternalViz />
        <div className="bg-muted/50 border border-border rounded-lg p-5 my-4">
          <p className="font-semibold text-sm mb-3"><code className="text-xs">accrueInternal()</code> — 이자 누적 흐름</p>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 flex items-center justify-center text-xs font-bold">1</span>
              <div><code className="text-xs">timeElapsed = now_ - lastAccrualTime_</code> — 경과 시간 계산, 0이면 조기 반환</div>
            </div>
            <div className="flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 flex items-center justify-center text-xs font-bold">2</span>
              <div><code className="text-xs">utilization = totalBorrowBase / totalSupplyBase</code> — 자금 이용률</div>
            </div>
            <div className="flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 flex items-center justify-center text-xs font-bold">3</span>
              <div><code className="text-xs">getSupplyRate(utilization)</code>, <code className="text-xs">getBorrowRate(utilization)</code> — kink 모델로 이자율 결정</div>
            </div>
            <div className="flex items-start gap-3">
              <span className="shrink-0 w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 flex items-center justify-center text-xs font-bold">4</span>
              <div>
                Index 갱신 (선형 복리 근사):<br />
                <code className="text-xs">baseSupplyIndex_ *= (1 + supplyRate * timeElapsed)</code><br />
                <code className="text-xs">baseBorrowIndex_ *= (1 + borrowRate * timeElapsed)</code>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>lazy accrual</strong>: 사용자 상호작용 시에만 index 갱신<br />
          Gas 효율 — 매 블록 업데이트하지 않음<br />
          Utilization은 totalBorrowBase / totalSupplyBase — 단순 계산
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">이자율 곡선 — Kink 모델</h3>

        <KinkModelViz />
        <div className="bg-muted/50 border border-border rounded-lg p-5 my-4 space-y-4">
          <div>
            <p className="font-semibold text-sm mb-2"><code className="text-xs">getBorrowRate()</code> — Kink 분기</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              <div className="bg-background border border-border rounded p-3">
                <p className="text-xs text-muted-foreground mb-1">utilization &le; kink (완만)</p>
                <code className="text-xs">base + slopeLow * utilization</code>
              </div>
              <div className="bg-background border border-border rounded p-3">
                <p className="text-xs text-muted-foreground mb-1">utilization &gt; kink (급경사)</p>
                <code className="text-xs">base + slopeLow * kink + slopeHigh * (util - kink)</code>
              </div>
            </div>
          </div>
          <div>
            <p className="font-semibold text-sm mb-2">Comet USDC 파라미터</p>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border border-border">
                <thead>
                  <tr className="bg-muted">
                    <th className="border border-border px-3 py-1.5 text-left">파라미터</th>
                    <th className="border border-border px-3 py-1.5 text-left">Borrow</th>
                    <th className="border border-border px-3 py-1.5 text-left">Supply</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-border px-3 py-1">Kink</td>
                    <td className="border border-border px-3 py-1 font-mono">90%</td>
                    <td className="border border-border px-3 py-1 font-mono">90%</td>
                  </tr>
                  <tr>
                    <td className="border border-border px-3 py-1">Base rate</td>
                    <td className="border border-border px-3 py-1 font-mono">1.5%/yr</td>
                    <td className="border border-border px-3 py-1 font-mono">0%</td>
                  </tr>
                  <tr>
                    <td className="border border-border px-3 py-1">At kink</td>
                    <td className="border border-border px-3 py-1 font-mono">4.5%</td>
                    <td className="border border-border px-3 py-1 font-mono">3.3%</td>
                  </tr>
                  <tr>
                    <td className="border border-border px-3 py-1">At 100%</td>
                    <td className="border border-border px-3 py-1 font-mono">24.5%</td>
                    <td className="border border-border px-3 py-1 font-mono">20.5%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <p>
          <strong>Aave와 유사한 kink 모델</strong>: 최적점 근처 완만, 초과 시 급격<br />
          Supply rate &lt; Borrow rate — 프로토콜이 spread 획득<br />
          Spread = Treasury(reserve factor 역할)
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Compound V3의 엔지니어링 철학</p>
          <p>
            "Do less, do it well" — <strong>기능 최소화로 완성도 극대화</strong>
          </p>
          <p className="mt-2">
            선택한 것:<br />
            ✓ Packed storage (가스 최적화)<br />
            ✓ 단일 base asset (복잡도 제거)<br />
            ✓ Lazy accrual (필요할 때만 계산)<br />
            ✓ Immutable 설정 (배포 후 변경 없음)
          </p>
          <p className="mt-2">
            포기한 것:<br />
            ✗ 다중 차입 자산<br />
            ✗ Stable borrow rate 옵션<br />
            ✗ aToken-style ERC20 (대신 단일 계정 상태)
          </p>
          <p className="mt-2">
            이 trade-off가 <strong>"보수적 안정성"</strong> 브랜딩<br />
            기관·고빈도 사용자에게 어필 — "믿을 수 있는 단순함"
          </p>
        </div>

      </div>
    </section>
  );
}
