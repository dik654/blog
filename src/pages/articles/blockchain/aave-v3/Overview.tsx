import PoolModelViz from './viz/PoolModelViz';
import SupplyFlowViz from './viz/SupplyFlowViz';
import HealthFactorViz from './viz/HealthFactorViz';
import SystemArchViz from './viz/SystemArchViz';
import UserPerspectiveViz from './viz/UserPerspectiveViz';
import MainContractsViz from './viz/MainContractsViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">개요 &amp; Pool 모델</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <PoolModelViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">Aave의 비전 — Peer-to-Pool Lending</h3>
        <p>
          Compound와 Aave의 핵심 혁신: <strong>P2P 대출 → P2Pool 대출</strong><br />
          전통 P2P 대출(ETHLend, Aave v1 이전): 대출자와 차입자 개별 매칭 — 유동성 부족, UX 복잡<br />
          Pool 모델: 공유 풀에 예치, 풀에서 차입 — <strong>즉시 매칭 + 유동적</strong>
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">시스템 구조</h3>

        <SystemArchViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">사용자 관점 — 4단계 흐름</h3>

        <UserPerspectiveViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">주요 컨트랙트</h3>

        <MainContractsViz />
        <p>
          <strong>Pool이 단일 진입점</strong>: 모든 사용자 operation은 Pool을 통함<br />
          토큰마다 별도 aToken/DebtToken 배포 — Pool은 이들의 발행·소각만 관리<br />
          "fat protocol" 피하고 모듈화된 컴포넌트
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">supply — 예치 흐름</h3>

        <SupplyFlowViz />
        <div className="not-prose grid gap-3 sm:grid-cols-2 lg:grid-cols-3 my-4">
          <div className="rounded-lg border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950 p-3">
            <p className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-1">supply() 진입점</p>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              <code>Pool.supply(asset, amount, onBehalfOf, referralCode)</code> 호출 — 내부적으로 <code>SupplyLogic.executeSupply()</code>에 위임
            </p>
          </div>
          <div className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 p-3">
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">1단계: 상태 갱신</p>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              <code>reserve.updateState(reserveCache)</code> — 마지막 상호작용 이후 누적 이자를 <code>liquidityIndex</code>에 반영
            </p>
          </div>
          <div className="rounded-lg border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950 p-3">
            <p className="text-xs font-semibold text-violet-600 dark:text-violet-400 mb-1">2단계: 검증</p>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              <code>ValidationLogic.validateSupply()</code> — 공급 한도(supply cap) 초과 여부 확인
            </p>
          </div>
          <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 p-3">
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">3단계: aToken 발행</p>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              <code>IAToken(aToken).mint(msg.sender, onBehalfOf, amount, nextLiquidityIndex)</code> — scaled amount로 발행
            </p>
          </div>
          <div className="rounded-lg border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950 p-3">
            <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 mb-1">4단계: 담보 설정</p>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              첫 공급(<code>isFirstSupply</code>)이면 <code>userConfig.setUsingAsCollateral(reserve.id, true)</code> 자동 활성화
            </p>
          </div>
          <div className="rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 p-3">
            <p className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1">5단계: 토큰 이동</p>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              <code>IERC20(asset).safeTransferFrom(msg.sender, aToken, amount)</code> — 실제 토큰을 aToken 컨트랙트로 전송
            </p>
          </div>
        </div>
        <p>
          <strong>5단계 supply</strong>: 상태 갱신 → 검증 → aToken mint → 담보 설정 → 토큰 이동<br />
          <code>updateState</code>: 마지막 상호작용 이후 누적 이자 반영<br />
          aToken amount는 실제 받는 토큰 양이 아님 — scaled amount (나중 설명)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">borrow — 차입 흐름</h3>

        <HealthFactorViz />
        <div className="not-prose grid gap-3 sm:grid-cols-2 my-4">
          <div className="rounded-lg border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950 p-3">
            <p className="text-xs font-semibold text-sky-600 dark:text-sky-400 mb-1">borrow() 진입점</p>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              <code>Pool.borrow(asset, amount, interestRateMode, referralCode, onBehalfOf)</code> — <code>interestRateMode</code>: 1=Stable, 2=Variable
            </p>
          </div>
          <div className="rounded-lg border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 p-3">
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">검증 1: 차입 허용</p>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              <code>getBorrowingEnabled()</code> — 해당 자산이 차입 가능 상태인지 확인
            </p>
          </div>
          <div className="rounded-lg border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950 p-3">
            <p className="text-xs font-semibold text-violet-600 dark:text-violet-400 mb-1">검증 2: 차입 캡</p>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              <code>totalBorrow + amount &lt;= borrowCap</code> — 자산별 차입 상한 초과 방지
            </p>
          </div>
          <div className="rounded-lg border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 p-3">
            <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">검증 3: Health Factor</p>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              <code>GenericLogic.calculateUserAccountData()</code> 결과로 HF &gt; 1 확인 — 담보 충분성 검증
            </p>
          </div>
          <div className="rounded-lg border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-950 p-3 sm:col-span-2">
            <p className="text-xs font-semibold text-rose-600 dark:text-rose-400 mb-1">검증 4: LTV 한도</p>
            <p className="text-sm text-neutral-700 dark:text-neutral-300">
              <code>(totalDebtInETH + amount) &lt;= collateralBalanceETH * avgLtv / 100</code> — 새 차입 포함 총부채가 LTV 한도 이내여야 허용
            </p>
          </div>
        </div>
        <p>
          <strong>4단계 검증</strong>: 허용 → 캡 → Health Factor → LTV<br />
          Health Factor = 담보가치 × LiquidationThreshold / 부채<br />
          &gt; 1이어야 안전, &lt; 1이면 청산 대상
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Reserve Data — 자산별 상태</h3>
        <div className="not-prose my-4 rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800/60 p-4">
          <p className="font-semibold text-sm mb-3">ReserveData 구조체 — 자산별 상태</p>
          <div className="grid gap-2 sm:grid-cols-2">
            <div className="rounded border border-sky-200 dark:border-sky-800 bg-sky-50 dark:bg-sky-950 p-2">
              <p className="text-xs font-semibold text-sky-600 dark:text-sky-400">이자 인덱스</p>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                <code>liquidityIndex</code> (예치), <code>variableBorrowIndex</code> (차입) — 1e27 RAY 스케일 누적 계수
              </p>
            </div>
            <div className="rounded border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950 p-2">
              <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">현재 이자율</p>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                <code>currentLiquidityRate</code> (예치 APY), <code>currentVariableBorrowRate</code>, <code>currentStableBorrowRate</code>
              </p>
            </div>
            <div className="rounded border border-violet-200 dark:border-violet-800 bg-violet-50 dark:bg-violet-950 p-2">
              <p className="text-xs font-semibold text-violet-600 dark:text-violet-400">토큰 주소</p>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                <code>aTokenAddress</code>, <code>stableDebtTokenAddress</code>, <code>variableDebtTokenAddress</code> — 자산별 파생 토큰
              </p>
            </div>
            <div className="rounded border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950 p-2">
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">설정 & 프로토콜</p>
              <p className="text-sm text-neutral-700 dark:text-neutral-300">
                <code>configuration</code> (LTV, LT 등), <code>accruedToTreasury</code> (수수료 누적), <code>isolationModeTotalDebt</code>
              </p>
            </div>
          </div>
        </div>
        <p>
          <strong>핵심 필드 2개</strong>: <code>liquidityIndex</code>, <code>variableBorrowIndex</code><br />
          인덱스는 <strong>누적 이자 계수</strong> — 사용자별 저장 없이 이자 계산<br />
          aToken 양 × 현재 인덱스 / 저장된 인덱스 = 실제 토큰 양
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Pool 모델의 트레이드오프</p>
          <p>
            <strong>Pool 모델 장점</strong>:<br />
            ✓ 즉시 유동성 (주문 매칭 불필요)<br />
            ✓ 모든 예치자가 같은 이자율 (공평)<br />
            ✓ 부분 상환/추가 예치 유연<br />
            ✓ 복리 자동 적용
          </p>
          <p className="mt-2">
            <strong>Pool 모델 단점</strong>:<br />
            ✗ 이자율 최적화 불가 (P2P는 협상 가능)<br />
            ✗ Pool 유동성 위기 가능 (bank run)<br />
            ✗ 시장금리 대비 비효율 (spread 존재)
          </p>
          <p className="mt-2">
            <strong>현대 DeFi는 hybrid</strong>:<br />
            - Morpho: Aave pool 위에 P2P 매칭 레이어<br />
            - Euler: pool + risk isolation<br />
            - Pool + 금리 집계 = 유동성 ∩ 최적 이자율
          </p>
        </div>

      </div>
    </section>
  );
}
