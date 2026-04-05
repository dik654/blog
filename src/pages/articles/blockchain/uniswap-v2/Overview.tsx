import CurveViz from './viz/CurveViz';
import SwapSimulatorViz from './viz/SwapSimulatorViz';
import FeeModelViz from './viz/FeeModelViz';
import ImpermanentLossViz from './viz/ImpermanentLossViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">개요 &amp; x·y=k 불변식</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">Uniswap V2의 역사적 위치</h3>
        <p>
          Uniswap V2(2020년 5월 출시): 이더리움 DEX의 패러다임 전환<br />
          이전: 오더북 DEX(0x, EtherDelta) — 유동성 부족·MEV 취약<br />
          V2: <strong>Constant Product AMM</strong>으로 유동성 공급자(LP)와 거래자 분리
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">x·y=k 불변식 — 핵심 수학</h3>

        <CurveViz />

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Pair 컨트랙트의 reserve 관계
x: token0 준비금
y: token1 준비금
k: 상수 (유동성 변화 시에만 변경)

불변식: x · y = k

// 스왑 시: Δx 입력 → Δy 출력
(x + Δx) · (y - Δy) = k

=> Δy = y - k / (x + Δx)
       = y · Δx / (x + Δx)   (수수료 제외)`}</pre>
        <p>
          k는 <strong>풀의 "깊이"</strong>를 나타냄 — k가 클수록 슬리피지 작음<br />
          스왑이 일어나도 k는 일정 유지 — 단 수수료(0.3%)가 별도로 reserve에 추가되어 k 증가<br />
          LP 입금/출금 시에만 k 비례 변경
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">가격 계산 — marginal price</h3>

        <SwapSimulatorViz />

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Uniswap V2에서 token0/token1 가격
P = y / x  (token0 단위의 token1 가격)

// 예시: USDC/ETH 풀
x (USDC) = 3,000,000
y (ETH)  = 1,000
P = 1,000 / 3,000,000 = 1/3000  (1 USDC = 0.000333 ETH)
역수: 3,000 USDC/ETH

// 거래 후 가격 변화
사용자가 1 ETH 구매:
Δy = 1, Δx = x·Δy/(y-Δy) = 3,000,000 · 1 / 999 = 3,003 USDC
새 reserve: x=3,003,003, y=999
새 가격: P' = 999 / 3,003,003 = 0.0003327
=> 1 ETH = 3,006 USDC (0.2% 상승)`}</pre>
        <p>
          가격은 <strong>reserve 비율의 도함수</strong> — <code>P = dy/dx = -y/x</code><br />
          거래 크기가 클수록 슬리피지 ↑ — x·y=k 곡선이 쌍곡선이기 때문<br />
          무한대 스왑은 불가능 — reserve를 0으로 만들려면 무한 토큰 필요
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">수수료 모델 — 0.3%</h3>

        <FeeModelViz />

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 수수료를 포함한 실제 swap 공식
Δx' = Δx · 0.997   // 0.3% 수수료 차감
Δy = y · Δx' / (x + Δx')

// k 불변식 검증 (수수료 포함)
x_new = x + Δx       // 수수료 포함 입금
y_new = y - Δy
k_new = x_new · y_new > k_old  // k가 증가

// 0.3%의 분배
0.25% → LP (풀 reserve에 누적)
0.05% → 프로토콜 (나중에 토글 가능)`}</pre>
        <p>
          수수료는 <strong>reserve에 통합</strong> — 별도 fee pool 없음<br />
          LP 수익 = reserve 증가분 + 임퍼머넌트 로스 복구<br />
          0.3%는 고정 — V3에서 가변 tier 도입
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">임퍼머넌트 로스(IL) — LP의 기회비용</h3>

        <ImpermanentLossViz />

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// LP가 50/50 비율로 $1000 예치
초기: 500 USDC + 0.1 ETH (ETH = $5000 가정)

// ETH 가격이 $10000으로 2배 상승
AMM은 차익거래자가 ETH 가격 맞추도록 유도
새 reserve: x·y = k 유지하면서 y/x = 1/10000

계산:
500·0.1 = 50 = k
y/x = 1/10000 => x = 10000y
10000y² = 50 => y = 0.0707
x = 707.1 USDC

LP 보유 가치: 707.1 USDC + 0.0707 ETH × 10000 = $1414.2

// HODL 대비 비교
HODL: 500 + 0.1·10000 = $1500
LP:   $1414.2
IL:   -$85.8 (-5.7%)`}</pre>
        <p>
          <strong>IL</strong>: 가격 변동 시 LP 보유 가치가 단순 HODL보다 낮아지는 현상<br />
          2배 변동 → -5.7% IL, 5배 변동 → -25.5% IL<br />
          수수료 수익이 IL을 상회해야 LP가 이익 — LP 진입 결정의 핵심 지표
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">왜 Constant Product인가 — 다른 AMM 비교</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">AMM 종류</th>
                <th className="border border-border px-3 py-2 text-left">불변식</th>
                <th className="border border-border px-3 py-2 text-left">특징</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">Constant Product (Uniswap)</td>
                <td className="border border-border px-3 py-2"><code>x·y=k</code></td>
                <td className="border border-border px-3 py-2">범용, 무한 가격 범위</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Constant Sum</td>
                <td className="border border-border px-3 py-2"><code>x+y=k</code></td>
                <td className="border border-border px-3 py-2">페그 자산, 유동성 소진 위험</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">StableSwap (Curve)</td>
                <td className="border border-border px-3 py-2">혼합형</td>
                <td className="border border-border px-3 py-2">스테이블코인 페어 최적화</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Concentrated (Uniswap V3)</td>
                <td className="border border-border px-3 py-2">가격 구간별 x·y=k</td>
                <td className="border border-border px-3 py-2">자본 효율 ↑, 복잡도 ↑</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: x·y=k의 본질적 가치</p>
          <p>
            <strong>단순성</strong>: 전체 컨트랙트 로직이 100줄 미만<br />
            <strong>무허가</strong>: 누구나 새 풀 생성 가능, 상장 심사 없음<br />
            <strong>무한 가격 범위</strong>: 토큰 가격이 0 또는 무한대가 되지 않는 한 작동<br />
            <strong>온체인 오라클</strong>: TWAP(시간 가중 평균 가격) 제공 가능
          </p>
          <p className="mt-2">
            트레이드오프: 자본 효율 낮음 — 대부분 유동성이 "사용되지 않는 가격 구간"에 잠김<br />
            이것이 V3 Concentrated Liquidity의 동기 — 같은 자본으로 4000배 효율 달성 가능
          </p>
        </div>

      </div>
    </section>
  );
}
