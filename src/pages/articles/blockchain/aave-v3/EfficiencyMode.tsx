import EModeViz from './viz/EModeViz';
import LoopingViz from './viz/LoopingViz';

export default function EfficiencyMode() {
  return (
    <section id="efficiency-mode" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">E-Mode &amp; Isolation Mode</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <EModeViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">V3의 2가지 새 모드</h3>
        <p>
          Aave V3의 주요 혁신:<br />
          1. <strong>E-Mode (Efficiency Mode)</strong>: correlated 자산 간 높은 LTV<br />
          2. <strong>Isolation Mode</strong>: 위험 자산의 리스크 격리
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">E-Mode — Efficiency Mode</h3>
        <div className="not-prose my-4 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 p-4">
          <p className="font-semibold text-sm mb-3">E-Mode 카테고리 & LTV 비교</p>
          <div className="grid gap-2 sm:grid-cols-3 mb-3">
            <div className="rounded border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950 p-2">
              <p className="text-xs font-semibold text-sky-600 dark:text-sky-400">ETH Correlated</p>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">WETH, wstETH, rETH, cbETH</p>
            </div>
            <div className="rounded border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 p-2">
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Stablecoins</p>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">USDC, USDT, DAI, FRAX</p>
            </div>
            <div className="rounded border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 p-2">
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">BTC Correlated</p>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">WBTC, tBTC</p>
            </div>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 p-2">
              <p className="text-xs font-semibold text-neutral-500 dark:text-neutral-400">일반 모드 (wstETH)</p>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">LTV 72%, LT 75%</p>
            </div>
            <div className="rounded border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950 p-2">
              <p className="text-xs font-semibold text-violet-600 dark:text-violet-400">ETH E-Mode (wstETH)</p>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">LTV <strong>93%</strong>, LT <strong>95%</strong> (같은 카테고리만)</p>
            </div>
          </div>
        </div>
        <p>
          <strong>93% LTV</strong>: 1 ETH 담보로 0.93 stETH 차입 가능<br />
          레버리지 staking(looping) 전략에 최적<br />
          트레이드오프: 다른 카테고리 자산 담보 사용 불가
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">E-Mode 활성화</h3>
        <div className="not-prose grid gap-3 sm:grid-cols-2 my-4">
          <div className="rounded-lg border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950 p-3">
            <p className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-1">setUserEMode() 활성화</p>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              <code>setUserEMode(categoryId)</code> 호출 — 모든 담보/부채가 해당 카테고리인지 확인 후 <code>_usersEModeCategory[msg.sender]</code> 저장
            </p>
          </div>
          <div className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 p-3">
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">검증 & 해제</p>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              담보/부채 카테고리 일치 + HF &gt; 1 검증 — 해제: <code>setUserEMode(0)</code> (일반 파라미터 복원 후 HF 재확인)
            </p>
          </div>
        </div>
        <p>
          <strong>사용자 단위 설정</strong>: 전체 포지션이 하나의 카테고리여야 함<br />
          활성화 시 HF 재계산 — E-Mode 파라미터 적용<br />
          해제 시 일반 파라미터 복원 → HF 체크 후 허용
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">E-Mode 실제 활용 — Leveraged Staking</h3>

        <LoopingViz />
        <div className="not-prose my-4 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 p-4">
          <p className="font-semibold text-sm mb-3">Looping 전략 (10 ETH 시작)</p>
          <div className="grid gap-2 sm:grid-cols-3 mb-3">
            <div className="rounded border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950 p-2">
              <p className="text-xs font-semibold text-sky-600 dark:text-sky-400">1-2회차</p>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">10 ETH → stETH → Aave 예치 → 9.3 ETH 차입 (93% LTV)</p>
            </div>
            <div className="rounded border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 p-2">
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">반복 (5-7회)</p>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">차입 ETH → stETH 전환 → 추가 예치 → 재차입 반복</p>
            </div>
            <div className="rounded border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950 p-2">
              <p className="text-xs font-semibold text-violet-600 dark:text-violet-400">최종 포지션</p>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">담보 49 stETH / 부채 39 ETH = <strong>4.9x 레버리지</strong></p>
            </div>
          </div>
          <div className="rounded border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 p-2">
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">수익 계산</p>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              staking yield 3.5% - borrow rate 2.5% = net 1% x 4.9배 → effective APY <strong>4.87%</strong> ($30K 자본 기준)
            </p>
          </div>
        </div>
        <p>
          <strong>E-Mode의 대표 사용 사례</strong>: LSD 레버리지 staking<br />
          일반 모드(75% LTV)로는 불가 — E-Mode(93%)로 효율적 레버리지<br />
          수익 = (staking yield - borrow rate) × 레버리지 배수
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Isolation Mode — 위험 자산 격리</h3>
        <div className="not-prose grid gap-3 sm:grid-cols-2 my-4">
          <div className="rounded-lg border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950 p-3">
            <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 mb-1">Isolated Asset 제약</p>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              다른 담보와 함께 사용 불가, 지정 stablecoin만 차입 가능, Debt Ceiling(총 차입 상한) 존재
            </p>
          </div>
          <div className="rounded-lg border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950 p-3">
            <p className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-1">MKR Isolation 예시</p>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              Debt Ceiling $10M, USDC만 차입 가능 — MKR 담보 사용 시 다른 담보 비활성화
            </p>
          </div>
        </div>
        <p>
          <strong>새 자산 점진적 통합</strong>: 바로 full collateral 안 되고 isolation부터<br />
          검증 기간 후 full collateral로 승격 — 단계적 리스크 관리<br />
          Debt Ceiling으로 <strong>시스템 리스크 상한 설정</strong>
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Isolation Mode 규칙</h3>
        <div className="not-prose grid gap-3 sm:grid-cols-2 my-4">
          <div className="rounded-lg border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950 p-3">
            <p className="text-xs font-semibold text-violet-600 dark:text-violet-400 mb-1">담보 설정 검증</p>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              <code>validateSetUseReserveAsCollateral()</code> — isolation 활성 시 다른 담보 추가 불가(<code>USER_ALREADY_COLLATERAL</code>), isolated 자산 추가 시 기존 담보 0이어야 함
            </p>
          </div>
          <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 p-3">
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">차입 제한 검증</p>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              <code>validateBorrow()</code> — <code>isBorrowableInIsolation[debtAsset]</code> 허용 자산 확인 + <code>currentIsolationDebt + newBorrow &lt;= debtCeiling</code> 상한 체크
            </p>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">기능 비교 요약</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">기능</th>
                <th className="border border-border px-3 py-2 text-left">일반 모드</th>
                <th className="border border-border px-3 py-2 text-left">E-Mode</th>
                <th className="border border-border px-3 py-2 text-left">Isolation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">다중 담보</td>
                <td className="border border-border px-3 py-2">O</td>
                <td className="border border-border px-3 py-2">같은 카테고리만</td>
                <td className="border border-border px-3 py-2">X</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">LTV</td>
                <td className="border border-border px-3 py-2">표준</td>
                <td className="border border-border px-3 py-2">높음 (~93%)</td>
                <td className="border border-border px-3 py-2">보수적</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">차입 자산</td>
                <td className="border border-border px-3 py-2">전부</td>
                <td className="border border-border px-3 py-2">전부</td>
                <td className="border border-border px-3 py-2">지정된 stable</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Debt Ceiling</td>
                <td className="border border-border px-3 py-2">없음</td>
                <td className="border border-border px-3 py-2">없음</td>
                <td className="border border-border px-3 py-2">있음</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">목적</td>
                <td className="border border-border px-3 py-2">범용 대출</td>
                <td className="border border-border px-3 py-2">자본 효율</td>
                <td className="border border-border px-3 py-2">리스크 격리</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: V3의 "전문화" 전략</p>
          <p>
            V1/V2는 <strong>"one size fits all"</strong> — 모든 자산에 동일 정책<br />
            V3는 <strong>자산 특성별 최적화</strong>:
          </p>
          <p className="mt-2">
            - Correlated 자산 → E-Mode (자본 효율)<br />
            - 위험/신규 자산 → Isolation (리스크 격리)<br />
            - 일반 자산 → Standard Mode
          </p>
          <p className="mt-2">
            이 전문화가 가능하게 한 것:<br />
            ✓ 더 많은 자산 지원 (risk 격리로 안전)<br />
            ✓ 더 높은 자본 효율 (E-Mode 93% LTV)<br />
            ✓ 더 다양한 전략 (leveraged staking 등)
          </p>
          <p className="mt-2">
            <strong>V3의 메시지</strong>: "lending은 자산별 설계가 필요하다"<br />
            이는 성숙한 금융 시스템으로의 진화 — DeFi의 다음 단계
          </p>
        </div>

      </div>
    </section>
  );
}
