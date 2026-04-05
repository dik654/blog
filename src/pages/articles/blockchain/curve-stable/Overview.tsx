import StableSwapCurveViz from './viz/StableSwapCurveViz';
import SlippageCompareViz from './viz/SlippageCompareViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">개요 &amp; StableSwap invariant</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <StableSwapCurveViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">Curve Finance의 문제 인식</h3>
        <p>
          Uniswap V2 (x·y=k)의 한계:<br />
          - USDC/USDT 같은 <strong>페그 자산</strong>에는 너무 변동성 큼<br />
          - $1 = $1 교환 시에도 슬리피지 발생<br />
          - 자본 효율 낮음 (대부분 유동성이 "비현실적 가격"에 잠김)
        </p>
        <p>
          Curve(2020)의 해답: <strong>StableSwap AMM</strong><br />
          페그 자산에 최적화된 혼합 곡선 — Constant Sum + Constant Product
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">곡선 비교</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`Constant Sum (x + y = k):
  - 완벽한 1:1 가격 유지
  - 슬리피지 0
  - 문제: 유동성 쉽게 고갈 (한 쪽 토큰 완전 소진 가능)

Constant Product (x · y = k):
  - 유동성 고갈 불가능
  - 문제: 슬리피지 ↑ (페그 자산에 과도함)

StableSwap (혼합):
  - 페그 근처: Constant Sum처럼 작동 (슬리피지 ↓)
  - 페그 이탈: Constant Product로 전환 (유동성 유지)
  - 최고의 두 세계`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">StableSwap invariant (n coins)</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 공식 (n-coin 풀, Σ = 합, Π = 곱)
A · n^n · Σx + D = A · D · n^n + D^(n+1) / (n^n · Πx)

// 용어
x_i: i번째 토큰 reserve
D:   invariant (풀의 "크기" — Constant Sum 해당)
A:   amplification coefficient (증폭 계수)
n:   토큰 개수`}</pre>
        <p>
          <strong>2개 파라미터</strong>: D (풀 크기), A (증폭 계수)<br />
          A = 0: Constant Product (Uniswap 동일)<br />
          A = ∞: Constant Sum (완전 페그)<br />
          실제 Curve 풀: A = 100 ~ 5000 (페그 강도)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">증폭 계수 A의 의미</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// A = 100일 때 (USDC/USDT 전형값)
페그 근처 (x ≈ y): 슬리피지 ≈ 0.01%
페그 이탈 90/10: 슬리피지 ≈ 1%
페그 이탈 99/1:  슬리피지 ≈ 10%+ (급격히 증가)

// A = 1000 (더 강한 페그)
페그 근처: 슬리피지 ≈ 0.001%
90/10:     슬리피지 ≈ 0.5%

// 트레이드오프
A ↑: 페그 근처 효율 ↑, 디페그 시 LP 손실 ↑
A ↓: 페그 근처 효율 ↓, 디페그 회복 더 빠름`}</pre>
        <p>
          <strong>A는 "페그 가정"의 강도</strong><br />
          A 크면 → "이 자산들은 1:1이다" 강한 가정<br />
          A 작으면 → "가격 변동 가능하다" 보수적<br />
          Terra UST 붕괴 시 Curve 3pool의 A값이 재조정됨
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">D 계산 — Newton&apos;s method</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`# Python 의사코드 (Curve 소스)
def get_D(xp: List[uint256], amp: uint256) -> uint256:
    S = sum(xp)  # Σ x_i
    if S == 0: return 0

    D = S
    Ann = amp * N_COINS
    for _ in range(255):  # Newton's method
        D_P = D
        for x in xp:
            D_P = D_P * D / (x * N_COINS)  # Π 계산
        Dprev = D
        D = (Ann * S + D_P * N_COINS) * D / ((Ann - 1) * D + (N_COINS + 1) * D_P)
        if abs(D - Dprev) <= 1:
            return D
    raise ValueError("D calculation: did not converge")`}</pre>
        <p>
          <strong>닫힌 형식 해 없음</strong>: Newton&apos;s method로 수치 해<br />
          보통 4-6회 반복으로 수렴 — 가스 비용 ~50K<br />
          255회 상한 — 극단 상황 방어
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">실제 슬리피지 — USDC/USDT (A=100)</h3>

        <SlippageCompareViz />
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">거래 크기</th>
                <th className="border border-border px-3 py-2 text-left">Uniswap V2</th>
                <th className="border border-border px-3 py-2 text-left">Curve</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">$1,000</td>
                <td className="border border-border px-3 py-2">~0.05%</td>
                <td className="border border-border px-3 py-2">~0.0005%</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">$100,000</td>
                <td className="border border-border px-3 py-2">~5%</td>
                <td className="border border-border px-3 py-2">~0.05%</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">$1,000,000</td>
                <td className="border border-border px-3 py-2">~50% (풀 파괴)</td>
                <td className="border border-border px-3 py-2">~0.5%</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted-foreground mt-2">* $10M USDC/USDT 풀 가정</p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 도메인 특화 AMM의 가치</p>
          <p>
            Uniswap: 범용 AMM — 모든 페어에 작동<br />
            Curve: 특화 AMM — 페그 자산에만 최적
          </p>
          <p className="mt-2">
            트레이드오프:<br />
            - Uniswap은 "exotic token"도 지원하지만 stable 페어에 비효율<br />
            - Curve는 stable에 100배 효율, 변동성 자산은 불가
          </p>
          <p className="mt-2">
            <strong>결과: DeFi는 AMM 다양화</strong><br />
            - Uniswap: 변동성 자산 (ETH, WBTC 등)<br />
            - Curve: stable swap (USDC, DAI, USDT)<br />
            - Balancer: 다중 자산 풀<br />
            - Liquidity Book (TraderJoe): 구간 기반
          </p>
          <p className="mt-2">
            교훈: <strong>"모든 것에 맞는 해결책은 없다"</strong><br />
            사용 사례별 최적화가 생태계 전체 효율 ↑
          </p>
        </div>

      </div>
    </section>
  );
}
