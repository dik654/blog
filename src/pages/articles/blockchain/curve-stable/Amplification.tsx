import AmplificationViz from './viz/AmplificationViz';
import ARampingViz from './viz/ARampingViz';

export default function Amplification() {
  return (
    <section id="amplification" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">증폭 계수 A &amp; 슬리피지 곡선</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <AmplificationViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">A 파라미터의 수학적 의미</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// StableSwap invariant 재표현
A · n^n · Σx + D = A · D · n^n + D^(n+1) / (n^n · Πx)

// 좌변: Constant Sum 기여
// 우변 첫 항: Constant Sum 타겟
// 우변 둘째 항: Constant Product 기여

// A → 0: 오직 CP만 작동 (Uniswap 동일)
// A → ∞: 오직 CS만 작동 (완전 페그)
// 0 < A < ∞: 혼합 곡선

// A의 실질적 의미: "균형 이탈 벌점"
// A 크면: 조금만 이탈해도 강한 복원력
// A 작으면: 큰 이탈도 허용`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">슬리피지와 A 관계</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 풀 크기 $10M, 균형 상태 ($5M each)
// 다양한 A 값에서 거래 크기별 슬리피지

거래 크기 $100K (1% of pool):
  A=10:    0.10% slippage
  A=100:   0.012% slippage
  A=1000:  0.002% slippage

거래 크기 $1M (10% of pool):
  A=10:    1.5% slippage
  A=100:   0.3% slippage
  A=1000:  0.06% slippage

거래 크기 $5M (50% of pool, 풀 소진 시작):
  A=10:    3% slippage
  A=100:   2% slippage
  A=1000:  1.5% slippage
  → A 클수록 이점 감소 (이미 CP 영역 진입)`}</pre>
        <p>
          <strong>A가 클수록 페그 근처에서 효율 ↑</strong><br />
          하지만 <strong>큰 거래에서는 A 효과 감소</strong> — 결국 CP로 전환되기 때문<br />
          A=100 ~ 1000이 대부분 풀의 최적점
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">실제 풀의 A 값</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">풀</th>
                <th className="border border-border px-3 py-2 text-left">A</th>
                <th className="border border-border px-3 py-2 text-left">이유</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">3pool (USDC/USDT/DAI)</td>
                <td className="border border-border px-3 py-2">2000</td>
                <td className="border border-border px-3 py-2">주요 스테이블, 강한 페그 가정</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">stETH/ETH</td>
                <td className="border border-border px-3 py-2">50</td>
                <td className="border border-border px-3 py-2">rebase 자산, 약간 변동성</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">FRAX/USDC</td>
                <td className="border border-border px-3 py-2">1000</td>
                <td className="border border-border px-3 py-2">algo stable, 중간 신뢰</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">UST 풀 (과거)</td>
                <td className="border border-border px-3 py-2">200 → 10 → 5</td>
                <td className="border border-border px-3 py-2">Terra 붕괴 시 단계적 하향</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">A 동적 조정 — ramp_A()</h3>

        <ARampingViz />
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// A는 시간에 따라 점진적 변경 가능
@external
def ramp_A(_future_A: uint256, _future_time: uint256):
    assert msg.sender == self.owner
    assert block.timestamp >= self.initial_A_time + MIN_RAMP_TIME
    assert _future_time >= block.timestamp + MIN_RAMP_TIME

    _initial_A: uint256 = self._A()

    # 변경 범위 제한 (최대 10배)
    assert _future_A > 0 and _future_A < MAX_A
    assert _future_A <= _initial_A * MAX_A_CHANGE
    assert _future_A * MAX_A_CHANGE >= _initial_A

    self.initial_A = _initial_A
    self.future_A = _future_A
    self.initial_A_time = block.timestamp
    self.future_A_time = _future_time

# 조회 시 선형 보간
@view
def _A() -> uint256:
    t1: uint256 = self.future_A_time
    A1: uint256 = self.future_A

    if block.timestamp < t1:
        A0: uint256 = self.initial_A
        t0: uint256 = self.initial_A_time
        # 선형 보간
        if A1 > A0:
            return A0 + (A1 - A0) * (block.timestamp - t0) / (t1 - t0)
        else:
            return A0 - (A0 - A1) * (block.timestamp - t0) / (t1 - t0)
    return A1`}</pre>
        <p>
          <strong>점진적 변경</strong>: 즉시 변경 금지 — LP 충격 완화<br />
          최대 10배 변경 + 최소 ramp time — 안전 장치<br />
          Terra 붕괴 시 3pool A를 2000→200 점진적 하향 — 시스템 보호
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">A 선택 가이드라인</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`페어 유형별 권장 A:

A = 1-10 (약한 페그):
  - LSD 페어 (stETH/ETH) — rebase, 유동성 유출 가능
  - LRT 페어 (eETH/ETH) — 점수 기반 변동

A = 50-200 (중간):
  - 새 stablecoin (FRAX 초기)
  - 페그 증명 안 된 자산

A = 200-1000 (강한):
  - 검증된 stablecoin (USDC/USDT)
  - 중앙화 백업 stable

A = 1000-5000 (매우 강한):
  - 핵심 stable 3pool
  - CEX와 연결된 stable
  - 시스템 위험 저

> 5000 (사용 안 함):
  - 너무 공격적, 작은 디페그에도 LP 대규모 손실`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: A가 시장 구조를 결정</p>
          <p>
            A 선택은 단순 숫자가 아닌 <strong>"이 페어는 얼마나 stable한가" 믿음의 정량화</strong>
          </p>
          <p className="mt-2">
            높은 A의 결과:<br />
            ✓ Stable 거래자에게 최고 경험 (슬리피지 낮음)<br />
            ✓ LP는 효율적 수수료 수익<br />
            ✗ 디페그 시 LP 대규모 손실 (한쪽으로 쏠림)
          </p>
          <p className="mt-2">
            낮은 A의 결과:<br />
            ✓ 디페그 시 LP 보호 (Uniswap처럼 복원)<br />
            ✗ 일상 거래 슬리피지 ↑<br />
            ✗ 자본 효율 ↓
          </p>
          <p className="mt-2">
            <strong>Terra 교훈</strong>: A 조정을 미리 준비해야<br />
            정상 시 A=200, 위기 시 A=5 같은 비상 플랜<br />
            "페그는 영원하지 않다" — Curve가 얻은 쓰라린 교훈
          </p>
        </div>

      </div>
    </section>
  );
}
