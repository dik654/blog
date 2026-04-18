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
        <div className="bg-muted/50 border border-border rounded-lg p-5 my-4">
          <p className="font-semibold text-sm mb-3">Comet USDC 컨트랙트 구성</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground mb-1">Base (이자 발생 · 차입 대상)</p>
              <p className="font-mono">USDC</p>
            </div>
            <div>
              <p className="text-muted-foreground mb-1">Collateral (이자 없음, 담보만)</p>
              <p className="font-mono">WETH, WBTC, LINK, UNI, COMP</p>
            </div>
          </div>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-sm border border-border">
              <thead>
                <tr className="bg-muted">
                  <th className="border border-border px-3 py-1.5 text-left">Collateral</th>
                  <th className="border border-border px-3 py-1.5 text-left">LTV (Borrow)</th>
                  <th className="border border-border px-3 py-1.5 text-left">LT (Liquidate)</th>
                </tr>
              </thead>
              <tbody>
                <tr><td className="border border-border px-3 py-1">WETH</td><td className="border border-border px-3 py-1">83%</td><td className="border border-border px-3 py-1">90%</td></tr>
                <tr><td className="border border-border px-3 py-1">WBTC</td><td className="border border-border px-3 py-1">70%</td><td className="border border-border px-3 py-1">77%</td></tr>
                <tr><td className="border border-border px-3 py-1">LINK</td><td className="border border-border px-3 py-1">67%</td><td className="border border-border px-3 py-1">73%</td></tr>
                <tr><td className="border border-border px-3 py-1">UNI</td><td className="border border-border px-3 py-1">64%</td><td className="border border-border px-3 py-1">71%</td></tr>
                <tr><td className="border border-border px-3 py-1">COMP</td><td className="border border-border px-3 py-1">60%</td><td className="border border-border px-3 py-1">67%</td></tr>
              </tbody>
            </table>
          </div>
          <div className="mt-3 text-sm text-muted-foreground">
            여러 market 동시 존재: <code className="text-xs">Comet USDC (Ethereum)</code>, <code className="text-xs">Comet ETH (Ethereum)</code>, <code className="text-xs">Comet USDbC (Base)</code>
          </div>
        </div>
        <p>
          <strong>Market마다 별도 Comet</strong>: USDC market, ETH market 등<br />
          각 market은 독립 운영 — risk isolation<br />
          담보 자산은 이자 없음 — "순수 담보"
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">V2의 복잡성 제거</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <p className="font-semibold text-sm mb-2">V2 — 다중 역할 혼재</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li><code className="text-xs">cUSDC</code> 1000 (예치)</li>
              <li><code className="text-xs">cETH</code> 2 (예치)</li>
              <li>부채: <code className="text-xs">DAI</code> 500 + <code className="text-xs">USDT</code> 300</li>
            </ul>
            <div className="mt-2 text-sm text-muted-foreground">
              담보: cUSDC + cETH / 부채: DAI + USDT<br />
              복잡한 HF 계산 (다중 자산 x 다중 부채)
            </div>
          </div>
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <p className="font-semibold text-sm mb-2">V3 — 역할 단순화</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li><code className="text-xs">USDC</code> supplied: 1000 (이자 발생)</li>
              <li><code className="text-xs">WETH</code> deposited: 2 (담보, 이자 없음)</li>
              <li>USDC borrowed: 300</li>
            </ul>
            <div className="mt-2 text-sm text-muted-foreground">
              담보: WETH / 부채: USDC only<br />
              단순 HF 계산
            </div>
          </div>
        </div>
        <p>
          <strong>V3의 단순함</strong>: 사용자가 base asset 동시 예치·차입 안 함<br />
          예치자: base만 공급 → 이자 받음<br />
          차입자: collateral 예치 + base 차입<br />
          동시 역할 불가 (같은 address에서)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Gas 효율성</h3>

        <GasEfficiencyViz />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <p className="font-semibold text-sm mb-2">V2 Gas 비용</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm font-mono">
              <span>supply cUSDC</span><span>~150K</span>
              <span>borrow DAI</span><span>~250K</span>
              <span>liquidate</span><span>~300K</span>
              <span>repay</span><span>~150K</span>
            </div>
          </div>
          <div className="bg-muted/50 border border-border rounded-lg p-4">
            <p className="font-semibold text-sm mb-2">V3 Gas 비용</p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm font-mono">
              <span>supply USDC</span><span>~100K <span className="text-green-600 dark:text-green-400">(-33%)</span></span>
              <span>borrow USDC</span><span>~150K <span className="text-green-600 dark:text-green-400">(-40%)</span></span>
              <span>absorb</span><span>~200K</span>
              <span>supply collateral</span><span>~120K</span>
            </div>
          </div>
        </div>
        <div className="bg-muted/50 border border-border rounded-lg p-4 my-4">
          <p className="font-semibold text-sm mb-2">절감 이유</p>
          <ol className="text-sm space-y-1 list-decimal list-inside">
            <li>단일 컨트랙트 — 계정 상태 조회 단순</li>
            <li>Packed storage — 여러 변수를 하나의 slot에 저장</li>
            <li>최적화된 수학 — 필요한 계산만 수행</li>
            <li>복잡한 fallback 로직 제거</li>
          </ol>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">리스크 모델 간소화</h3>

        <RiskModelViz />
        <div className="bg-muted/50 border border-border rounded-lg p-5 my-4">
          <p className="font-semibold text-sm mb-3">Collateral Supply Cap (프로토콜 위험 제한)</p>
          <div className="grid grid-cols-3 gap-3 text-sm font-mono mb-3">
            <div className="bg-background border border-border rounded p-2 text-center">
              <div className="text-muted-foreground text-xs mb-1">WETH</div>
              <div>500,000</div>
            </div>
            <div className="bg-background border border-border rounded p-2 text-center">
              <div className="text-muted-foreground text-xs mb-1">WBTC</div>
              <div>5,000</div>
            </div>
            <div className="bg-background border border-border rounded p-2 text-center">
              <div className="text-muted-foreground text-xs mb-1">LINK</div>
              <div>1,000,000</div>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Base asset (USDC)에는 cap 없음 — 무제한 예치 가능. Borrowing은 utilization에 따라 제한.
          </p>
          <ol className="text-sm space-y-1 list-decimal list-inside">
            <li>exploit 발생해도 단일 collateral 영향</li>
            <li>새 자산 추가 시 낮은 cap으로 시작 — 검증 기간</li>
            <li>DAO가 cap 조정으로 리스크 제어</li>
          </ol>
        </div>

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
