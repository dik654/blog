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
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 아이디어: 서로 가격이 비슷한 자산들 간에는 높은 LTV 허용
// 예: ETH/stETH/rETH 모두 ETH 가격 추종 → 청산 위험 낮음

E-Mode 카테고리 예시:
- ETH Correlated: WETH, wstETH, rETH, cbETH
- Stablecoins: USDC, USDT, DAI, FRAX
- BTC Correlated: WBTC, tBTC

// 일반 모드 vs E-Mode
일반 모드:
  wstETH LTV: 72%
  wstETH LT: 75%

ETH E-Mode:
  wstETH LTV: 93%
  wstETH LT: 95%
  (단, 같은 카테고리 자산만 담보로)`}</pre>
        <p>
          <strong>93% LTV</strong>: 1 ETH 담보로 0.93 stETH 차입 가능<br />
          레버리지 staking(looping) 전략에 최적<br />
          트레이드오프: 다른 카테고리 자산 담보 사용 불가
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">E-Mode 활성화</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`function setUserEMode(uint8 categoryId) external {
    // 1) 현재 포지션 확인
    // 2) 모든 담보가 해당 카테고리?
    // 3) 모든 부채가 해당 카테고리?
    // 4) HF > 1 (E-Mode 파라미터 기준)

    require(
        allCollateralInCategory && allDebtInCategory,
        "INCONSISTENT_EMODE_CATEGORY"
    );

    _usersEModeCategory[msg.sender] = categoryId;
    emit UserEModeSet(msg.sender, categoryId);
}

// E-Mode 해제
function setUserEMode(0); // categoryId 0 = 해제`}</pre>
        <p>
          <strong>사용자 단위 설정</strong>: 전체 포지션이 하나의 카테고리여야 함<br />
          활성화 시 HF 재계산 — E-Mode 파라미터 적용<br />
          해제 시 일반 파라미터 복원 → HF 체크 후 허용
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">E-Mode 실제 활용 — Leveraged Staking</h3>

        <LoopingViz />
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Looping 전략 (10 ETH 시작)
1. 10 ETH → stETH 전환 (Lido 스테이킹)
2. 10 stETH Aave 예치 (E-Mode)
3. 9.3 ETH 차입 (93% LTV)
4. 9.3 ETH → stETH 전환
5. 9.3 stETH 추가 예치
6. 반복... (보통 5-7 iteration)

최종 포지션:
- 담보: 49 stETH ($146,000)
- 부채: 39 ETH ($117,000)
- Net: 10 ETH 시작 → 49 stETH 노출 = 4.9x 레버리지

수익 계산 (연 단위):
- stETH staking yield: 3.5%
- ETH borrow rate: 2.5%
- Net yield on $146K: $1,460
- Starting capital: $30K
- Effective APY: 4.87%`}</pre>
        <p>
          <strong>E-Mode의 대표 사용 사례</strong>: LSD 레버리지 staking<br />
          일반 모드(75% LTV)로는 불가 — E-Mode(93%)로 효율적 레버리지<br />
          수익 = (staking yield - borrow rate) × 레버리지 배수
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Isolation Mode — 위험 자산 격리</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 아이디어: 검증 안 된 신규 자산을 기존 자산과 격리
// 예: 새로 상장된 토큰이 exploit 당해도 전체 시스템 영향 없게

Isolated Asset 특징:
- 담보로 사용 시 다른 담보와 함께 사용 불가
- 특정 stablecoin만 차입 가능 (USDC, DAI 등)
- Debt Ceiling 존재 (총 차입 상한)
- 격리 가능 (exploit 시 해당 자산만 영향)

예시: MKR as Isolated Collateral
- Debt Ceiling: $10M
- 차입 가능: USDC only
- User MKR 담보 사용 시 → 다른 담보 비활성`}</pre>
        <p>
          <strong>새 자산 점진적 통합</strong>: 바로 full collateral 안 되고 isolation부터<br />
          검증 기간 후 full collateral로 승격 — 단계적 리스크 관리<br />
          Debt Ceiling으로 <strong>시스템 리스크 상한 설정</strong>
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Isolation Mode 규칙</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`function validateSetUseReserveAsCollateral(...) internal {
    uint256 userIsolationModeAsset = userConfig.getIsolationModeStateAccount(...);

    if (isolationModeActive) {
        // 이미 다른 isolated asset 사용 중이면 새 담보 추가 불가
        require(!userConfig.isUsingAsCollateralAny(), "USER_ALREADY_COLLATERAL");
    }

    if (reserveIsIsolated) {
        // Isolated asset을 담보로 추가하려면 다른 담보 없어야
        require(
            userConfig.getActiveCollateralCount() == 0,
            "USER_HAS_OTHER_COLLATERAL"
        );
    }
}

// 차입 제한
function validateBorrow(...) internal view {
    if (userInIsolationMode) {
        // Isolation 자산의 허용된 차입만
        require(
            isBorrowableInIsolation[debtAsset],
            "ASSET_NOT_BORROWABLE_IN_ISOLATION"
        );

        // Debt Ceiling 체크
        require(
            currentIsolationDebt + newBorrow <= debtCeiling,
            "DEBT_CEILING_EXCEEDED"
        );
    }
}`}</pre>

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
