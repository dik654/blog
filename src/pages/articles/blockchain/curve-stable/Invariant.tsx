import InvariantViz from './viz/InvariantViz';
import NewtonIterationViz from './viz/NewtonIterationViz';

export default function Invariant() {
  return (
    <section id="invariant" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">A·n^n·Σx + D = A·D·n^n + D^(n+1)/(n^n·Πx)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <InvariantViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">공식 유도 — 직관</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Constant Sum: Σx = D (페그)
// Constant Product: Πx = (D/n)^n (균형)

// StableSwap = 두 곡선의 가중 합
// "잔액이 균형에서 멀수록 CP로 수렴"

// 수학적 표현
χ · Σx + Πx_normalized = χ · D + (D/n)^n

// χ (chi)는 가중치 — 잔액 균형도에 따라 변화
// χ = A · Πx_normalized / (D/n)^n 로 설정

// 대입 후 정리
A · n^n · Σx + D = A · D · n^n + D^(n+1) / (n^n · Πx)`}</pre>
        <p>
          <strong>핵심 아이디어</strong>: 균형 상태(<code>x_i = D/n</code>)에서 CS로 작동, 이탈하면 CP로 전환<br />
          가중치 χ가 자동 조정 — <strong>부드러운 전환</strong><br />
          2개 파라미터 (A, D)로 전체 곡선 정의
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">2-coin 풀 간소화</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// n=2 (USDC, USDT 같은 2-coin 풀)
A · 4 · (x + y) + D = A · D · 4 + D³ / (4 · x · y)

// 재정리하여 y를 x로 표현
// Newton's method로 근 찾기

// 스왑 계산: x → x + Δx, y → y' 새 값
// invariant 유지: y'를 찾아 Δy = y - y' 계산`}</pre>
        <p>
          <strong>스왑 로직</strong>: 입력 후 새 invariant 만족하는 출력 계산<br />
          D는 고정 (swap 시 변화 없음)<br />
          y 해를 Newton&apos;s method로 수치 해
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">get_y — 스왑 후 잔액 계산</h3>

        <NewtonIterationViz />
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`def get_y(i: int, j: int, x: uint256, xp: List[uint256]) -> uint256:
    """
    Given reserves xp[] and new xp[i]=x, find xp[j].
    """
    D = get_D(xp, amp)
    c = D
    S = 0
    Ann = amp * N_COINS

    for k in range(N_COINS):
        if k != j:
            if k == i:
                _x = x
            else:
                _x = xp[k]
            S += _x
            c = c * D / (_x * N_COINS)

    c = c * D / (Ann * N_COINS)
    b = S + D / Ann  # bn = b

    y_prev = 0
    y = D
    for _ in range(255):
        y_prev = y
        y = (y*y + c) / (2 * y + b - D)
        if abs(y - y_prev) <= 1:
            return y
    raise

# Newton's method for: y² + b·y + c = D·y`}</pre>
        <p>
          <strong>2차방정식 수치 해</strong>: <code>y² + b·y + c = D·y</code><br />
          b, c는 다른 토큰들의 잔액·invariant로 결정<br />
          수렴까지 평균 5-10 iteration
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">exchange() — Curve 핵심 함수</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`@external
def exchange(
    i: int128,       # 입력 토큰 인덱스
    j: int128,       # 출력 토큰 인덱스
    dx: uint256,     # 입력 양
    min_dy: uint256  # 최소 출력 (슬리피지 보호)
) -> uint256:
    xp: uint256[N_COINS] = self._xp()
    x: uint256 = xp[i] + dx * self.RATES[i] / PRECISION

    y: uint256 = self._get_y(i, j, x, xp)
    dy: uint256 = xp[j] - y - 1  # -1은 rounding error 대응

    # 수수료 차감
    dy_fee: uint256 = dy * self.fee / FEE_DENOMINATOR
    dy = (dy - dy_fee) * PRECISION / self.RATES[j]

    assert dy >= min_dy, "Exchange: slippage"

    # 토큰 이동
    self.balances[i] += dx
    self.balances[j] -= dy

    ERC20(self.coins[i]).transferFrom(msg.sender, self, dx)
    ERC20(self.coins[j]).transfer(msg.sender, dy)

    return dy`}</pre>
        <p>
          <strong>Vyper 언어 사용</strong>: Curve의 주요 컨트랙트는 Vyper로 작성<br />
          Vyper는 Solidity보다 <strong>간결하고 읽기 쉬움</strong> — 수학 중심 컨트랙트에 적합<br />
          Python 유사 문법 + 엄격한 보안 기본값
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">정밀도 조정 — RATES</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 토큰마다 decimals 다름 → 정규화 필요
// USDC: 6 decimals, DAI: 18 decimals

RATES = [
    10**18 * 10**12,  // USDC (6 decimals) × 10^12 = 18 decimals
    10**18,            // DAI (18 decimals)
    10**18 * 10**12,   // USDT (6 decimals)
]

// 내부 계산은 모두 18 decimals 기준
// 외부 입출력 시 RATES로 변환`}</pre>
        <p>
          <strong>decimals 통일</strong>: 모든 계산은 18 decimals 기준<br />
          USDC (6) → 18로 scale up, 사용자 인터페이스에서는 다시 6으로 scale down<br />
          이 정규화 없으면 각 토큰 비율 계산 복잡
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">수수료 구조</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Curve 3pool 수수료 (USDC/USDT/DAI)
Swap fee: 0.04% (4 bps)   // LP에게
Admin fee: 50% of swap fee // 프로토콜로
→ Net LP fee: 0.02%

// Imbalance fee (deposit/withdraw 시)
balanced_amount = ideal deposit
imbalance = actual - balanced_amount
fee = imbalance × 0.02%

// 의미: LP가 풀 균형 깨면 페널티`}</pre>
        <p>
          <strong>스테이블 페어라 낮은 수수료</strong>: 0.04% (Uniswap V2의 1/7)<br />
          Imbalance fee: LP가 풀 편향 유발 시 추가 수수료<br />
          이 메커니즘이 <strong>균형 유지 인센티브</strong> 제공
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 수치 해의 현실성</p>
          <p>
            StableSwap은 <strong>닫힌 형식 해 없음</strong> — Newton&apos;s method 필수<br />
            우려: 수렴 실패·가스 폭증·정밀도 손실
          </p>
          <p className="mt-2">
            Curve의 대응:<br />
            ✓ 255회 상한 — 무한 루프 방지<br />
            ✓ <code>abs(diff) ≤ 1</code> 수렴 조건 — 1 wei 정밀도 충분<br />
            ✓ 평균 5-10회 수렴 — 가스 예측 가능
          </p>
          <p className="mt-2">
            <strong>교훈</strong>: DeFi 수학이 항상 닫힌 형식일 필요 없음<br />
            반복 계산이 실용적이고 예측 가능하면 괜찮음<br />
            Curve가 증명함 — 복잡한 수학도 안전하게 온체인 구현 가능
          </p>
        </div>

      </div>
    </section>
  );
}
