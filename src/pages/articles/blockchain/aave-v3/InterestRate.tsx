import InterestCurveViz from './viz/InterestCurveViz';
import UtilizationRateViz from './viz/UtilizationRateViz';

export default function InterestRate() {
  return (
    <section id="interest-rate" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">이자율 모델 — Utilization 곡선</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <InterestCurveViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">Utilization의 의미</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`Utilization = totalBorrowed / totalDeposited

// 예시
예치: $10M USDC
차입: $6M USDC
Utilization = 60%

// 의미
0%: 아무도 차입 안 함 (대출자 수익 없음)
100%: 모든 예치가 차입됨 (인출 불가 위험)
최적점: 80~90% (효율 ↑, 안전 마진 유지)`}</pre>
        <p>
          <strong>Utilization이 핵심 시그널</strong>: 이자율 결정의 1차 입력<br />
          높은 utilization → 수요 &gt; 공급 → 이자율 ↑ (차입 억제, 예치 유도)<br />
          낮은 utilization → 공급 &gt; 수요 → 이자율 ↓
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">2단계 이자율 곡선</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Aave의 2단계 이자율 공식

// Utilization < U_optimal:
rate = R_0 + slope1 × (U / U_optimal)

// Utilization >= U_optimal:
rate = R_0 + slope1 + slope2 × ((U - U_optimal) / (1 - U_optimal))

// 곡선 특성
- R_0: 기본 이자율 (보통 0%)
- slope1: 완만한 증가 구간 (U < U_optimal)
- slope2: 급격한 증가 구간 (U > U_optimal, bank run 방지)
- U_optimal: 최적 이용률 (보통 80-90%)`}</pre>
        <p>
          <strong>2단계 설계 목표</strong>: 최적점 근처는 완만, 초과 시 급격한 증가<br />
          급격한 증가가 <strong>bank run 방지</strong> — 이자 무서워서 빨리 상환 유도<br />
          최적점은 보통 80% — 적당한 유동성 버퍼 유지
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">자산별 파라미터 — USDC 예시</h3>

        <UtilizationRateViz />
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Aave V3 USDC (Ethereum mainnet)
baseVariableBorrowRate (R_0): 0%
variableRateSlope1:           4%
variableRateSlope2:           60%
optimalUtilizationRate:       90%

// 계산 예시
U = 50%:
  rate = 0 + 4% × (50 / 90) = 2.22%

U = 90% (optimal):
  rate = 0 + 4% = 4%

U = 95%:
  rate = 0 + 4% + 60% × (5 / 10) = 34%  (급증!)

U = 100%:
  rate = 0 + 4% + 60% = 64%`}</pre>
        <p>
          <strong>95% → 34% 이자율</strong>: 단 5% utilization 증가로 8배 이상<br />
          이 구조가 LPs·차입자에게 "최적점 유지" 동기 제공<br />
          차입자는 high rate 피하려 상환 / LP는 high rate 노리고 예치
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">자산 유형별 파라미터</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">자산</th>
                <th className="border border-border px-3 py-2 text-left">R_0</th>
                <th className="border border-border px-3 py-2 text-left">slope1</th>
                <th className="border border-border px-3 py-2 text-left">slope2</th>
                <th className="border border-border px-3 py-2 text-left">U_optimal</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">USDC/USDT</td>
                <td className="border border-border px-3 py-2">0%</td>
                <td className="border border-border px-3 py-2">4%</td>
                <td className="border border-border px-3 py-2">60%</td>
                <td className="border border-border px-3 py-2">90%</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">WETH</td>
                <td className="border border-border px-3 py-2">0%</td>
                <td className="border border-border px-3 py-2">3%</td>
                <td className="border border-border px-3 py-2">80%</td>
                <td className="border border-border px-3 py-2">80%</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">WBTC</td>
                <td className="border border-border px-3 py-2">0%</td>
                <td className="border border-border px-3 py-2">4%</td>
                <td className="border border-border px-3 py-2">300%</td>
                <td className="border border-border px-3 py-2">45%</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">stETH (volatile)</td>
                <td className="border border-border px-3 py-2">0%</td>
                <td className="border border-border px-3 py-2">7%</td>
                <td className="border border-border px-3 py-2">300%</td>
                <td className="border border-border px-3 py-2">45%</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          <strong>변동성 큰 자산은 낮은 optimal + 높은 slope2</strong> — 보수적 운용<br />
          Stablecoin은 높은 optimal + 낮은 slope2 — 효율 우선
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Supply Rate 계산</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 예치자 이자율 = 차입자 이자율 × utilization × (1 - reserve_factor)

function calculateSupplyRate(
    uint256 borrowRate,
    uint256 utilization,
    uint256 reserveFactor
) internal pure returns (uint256) {
    return borrowRate
        .rayMul(utilization)
        .rayMul(RAY - reserveFactor);
}

// 예시 (USDC)
borrowRate = 4%
utilization = 90%
reserveFactor = 10%

supplyRate = 4% × 90% × 90% = 3.24%

// 이자 흐름
100% 차입자 이자 → 풀
  → 90% (utilization) × 90% (after reserve factor) → 예치자
  → 10% (reserve factor) × 90% (utilization) → treasury
  → 10% (unutilized) → 아무도 안 받음`}</pre>
        <p>
          <strong>3요소 곱</strong>: borrowRate × utilization × (1 - reserveFactor)<br />
          Utilization이 1보다 작으면 예치자 이자는 차입자 이자의 일부만<br />
          Reserve Factor: Treasury 비율 (보통 10-30%)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">동적 조정 — 거버넌스</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 파라미터는 거버넌스 투표로 조정 가능
// Aave DAO가 주기적으로 조정

// 조정 시나리오
1. 변동성 급증 → slope2 상향 (차입 억제)
2. 유동성 부족 → U_optimal 하향 (더 보수적)
3. 시장 금리 변동 → base rate 조정
4. 새 자산 추가 → 초기 파라미터 설정

// 거버넌스 절차
1. Temperature Check (Snapshot, 오프체인)
2. ARFC (Aave Request for Final Comment)
3. AIP (Aave Improvement Proposal) 온체인 투표
4. 3일 타임락 후 실행`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 이자율 모델의 진화</p>
          <p>
            Aave의 2단계 곡선은 <strong>10년간 검증된 패턴</strong>:<br />
            - Compound, MakerDAO 모두 유사 구조<br />
            - "최적점 + 급격 증가" 보편 공식
          </p>
          <p className="mt-2">
            최근 혁신:<br />
            - <strong>Morpho</strong>: 이자율을 P2P 매칭으로 타이트하게<br />
            - <strong>Euler</strong>: risk isolation + dynamic rate<br />
            - <strong>Compound V3</strong>: 단일 base asset 모델
          </p>
          <p className="mt-2">
            <strong>Aave의 가치</strong>: "시간 검증된 보수적 모델"<br />
            극한 시장 상황(COVID, Terra, FTX)에서도 안정 작동<br />
            스타트업이 "Aave보다 나아야" 할 수준의 기준선
          </p>
        </div>

      </div>
    </section>
  );
}
