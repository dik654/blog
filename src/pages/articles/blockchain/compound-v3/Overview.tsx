import BaseAssetViz from './viz/BaseAssetViz';
import V2vsV3Viz from './viz/V2vsV3Viz';
import CometMarketViz from './viz/CometMarketViz';
import GasEfficiencyViz from './viz/GasEfficiencyViz';
import RiskModelViz from './viz/RiskModelViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">개요 &amp; V2 대비 차이점</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <BaseAssetViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">Compound V3 (Comet)의 철학 전환</h3>
        <p>
          Compound V2: Aave와 유사한 <strong>다자산 차입 모델</strong><br />
          Compound V3(Comet, 2022): <strong>"단일 base asset" 단순화 모델</strong><br />
          목표: 복잡성 ↓, 안전성 ↑, 가스 ↓
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">V2 vs V3 핵심 차이</h3>

        <V2vsV3Viz />
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">특징</th>
                <th className="border border-border px-3 py-2 text-left">Compound V2</th>
                <th className="border border-border px-3 py-2 text-left">Compound V3</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">차입 자산</td>
                <td className="border border-border px-3 py-2">모든 풀 자산</td>
                <td className="border border-border px-3 py-2">1개 base asset만</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">예치 자산</td>
                <td className="border border-border px-3 py-2">모든 자산</td>
                <td className="border border-border px-3 py-2">base asset만 이자 발생</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">담보</td>
                <td className="border border-border px-3 py-2">예치 = 담보</td>
                <td className="border border-border px-3 py-2">담보 자산은 이자 없음</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">배포 단위</td>
                <td className="border border-border px-3 py-2">1개 컨트랙트 (전체 자산)</td>
                <td className="border border-border px-3 py-2">Base asset마다 Comet 배포</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">계정 구조</td>
                <td className="border border-border px-3 py-2">복잡 (여러 cToken)</td>
                <td className="border border-border px-3 py-2">단순 (base + collateral)</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Comet 시스템 구조</h3>

        <CometMarketViz />
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// USDC Market = "Comet USDC" 컨트랙트
// Base: USDC (이자 발생·차입 대상)
// Collateral: WETH, WBTC, LINK, UNI, COMP (이자 없음, 담보만)

// Collateral별 파라미터
WETH: LTV 83%, LT 90%
WBTC: LTV 70%, LT 77%
LINK: LTV 67%, LT 73%
UNI:  LTV 64%, LT 71%
COMP: LTV 60%, LT 67%

// 여러 market 동시 존재
Comet USDC (Ethereum)
Comet ETH (Ethereum)
Comet USDbC (Base)`}</pre>
        <p>
          <strong>Market마다 별도 Comet</strong>: USDC market, ETH market 등<br />
          각 market은 독립 운영 — risk isolation<br />
          담보 자산은 이자 없음 — "순수 담보"
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">V2의 복잡성 제거</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// V2: 모든 예치가 담보이자 차입 가능
User A:
- cUSDC 1000 (예치)
- cETH 2 (예치)
- Borrows: DAI 500, USDT 300

  → 담보: cUSDC + cETH
  → 부채: DAI + USDT
  → 복잡한 HF 계산 (다중 자산 × 다중 부채)

// V3: 단순화
User A in Comet USDC:
- USDC supplied: 1000 (base asset, earns interest)
- WETH deposited: 2 (collateral, no interest)
- USDC borrowed: 300

  → 담보: WETH
  → 부채: USDC only
  → 단순 HF 계산`}</pre>
        <p>
          <strong>V3의 단순함</strong>: 사용자가 base asset 동시 예치·차입 안 함<br />
          예치자: base만 공급 → 이자 받음<br />
          차입자: collateral 예치 + base 차입<br />
          동시 역할 불가 (같은 address에서)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Gas 효율성</h3>

        <GasEfficiencyViz />
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// V2 gas 비용
supply cUSDC:    ~150K
borrow DAI:      ~250K
liquidate:       ~300K
repay:           ~150K

// V3 gas 비용
supply USDC:     ~100K (33% 절감)
borrow USDC:     ~150K (40% 절감)
absorb liquidation: ~200K
supply collateral: ~120K

// 절감 이유
1. 단일 컨트랙트 (계정 상태 조회 단순)
2. Packed storage (여러 변수 하나의 slot)
3. 최적화된 수학 (필요한 계산만)
4. 복잡한 fallback 로직 제거`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">리스크 모델 간소화</h3>

        <RiskModelViz />
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// V3: 각 collateral마다 supply cap
// 총 collateral 한도 설정 → 프로토콜 위험 제한

WETH supply cap: 500,000 WETH
WBTC supply cap: 5,000 WBTC
LINK supply cap: 1,000,000 LINK

// Base asset (USDC)에는 cap 없음 — 무제한 예치 가능
// Borrowing은 utilization에 따라 제한

// 이점
1. exploit 발생해도 단일 collateral 영향
2. 새 자산 추가 시 낮은 cap으로 시작 → 검증 기간
3. DAO가 cap 조정으로 리스크 제어`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Compound V3의 "극도의 단순화"</p>
          <p>
            Aave V3는 <strong>기능 확장</strong> (E-Mode, Isolation, Portal 등)<br />
            Compound V3는 <strong>기능 축소</strong> (단일 base, 명확한 역할)
          </p>
          <p className="mt-2">
            <strong>단순화의 효과</strong>:<br />
            ✓ 감사 단순 — 공격 벡터 축소<br />
            ✓ 가스 절감 — 사용자 UX ↑<br />
            ✓ 리스크 파라미터 명확 — DAO 관리 쉬움<br />
            ✗ 기능 제한 — 복잡한 전략 불가
          </p>
          <p className="mt-2">
            <strong>시장 포지션</strong>:<br />
            - Aave: 기능 풍부, 고급 사용자<br />
            - Compound V3: 안정적이고 예측 가능, 기관 투자자<br />
            - Morpho: Aave 위에 P2P 레이어 추가<br />
            - Spark: MakerDAO 기반 fork
          </p>
          <p className="mt-2">
            "단순함이 안전함" — 이것이 Compound V3의 시장 차별화
          </p>
        </div>

      </div>
    </section>
  );
}
