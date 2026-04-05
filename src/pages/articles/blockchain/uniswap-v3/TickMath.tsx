import TickViz from './viz/TickViz';
import SqrtPriceViz from './viz/SqrtPriceViz';
import TokenAmountViz from './viz/TokenAmountViz';
import TickBitmapViz from './viz/TickBitmapViz';

export default function TickMath() {
  return (
    <section id="tick-math" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Tick &amp; √P 수학</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <TickViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">왜 √P인가</h3>

        <SqrtPriceViz />

        <p>
          V3는 모든 가격 계산에 <strong>√P (sqrt price)</strong>를 사용<br />
          이유: 유동성 수학이 <code>√P</code>로 표현하면 선형이 됨<br />
          L (liquidity) = √(x · y) 관계에서 자연스럽게 도출
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Tick — 가격 이산화</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 가격을 이산적 인덱스(tick)로 표현
P(i) = 1.0001^i

// 각 tick이 1 basis point(0.01%) 차이
tick 0:    P = 1.0000
tick 1:    P = 1.0001
tick 10:   P = 1.0010
tick 100:  P = 1.0101
tick 1000: P = 1.1052

// 역변환: tick = log_{1.0001}(P) = ln(P) / ln(1.0001)

// 범위: [-887272, 887272]
// 최소 가격: 1.0001^(-887272) ≈ 2.9e-39
// 최대 가격: 1.0001^887272 ≈ 3.4e38`}</pre>
        <p>
          <strong>1 tick = 0.01% 가격 변화</strong> — 충분히 세밀하면서 계산 효율적<br />
          가격 범위가 극단적으로 넓음 (2e-39 ~ 3e38) — 어떤 토큰 페어도 수용<br />
          이산화로 gas 절감 — 연속적 가격 대신 정수 인덱스로 관리
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">√P 고정소수점 표현 — Q64.96</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Q64.96: 64비트 정수부 + 96비트 소수부
// √P를 2^96배로 표현 (정수 연산 유지하면서 정밀도 확보)

sqrtPriceX96 = √P · 2^96

// 예시: P = 1.5 (ETH = 1.5 BTC 같은 비율)
// √1.5 ≈ 1.22474
// sqrtPriceX96 = 1.22474 × 2^96 ≈ 9.7e28

// tick ↔ sqrtPriceX96 변환
function getSqrtRatioAtTick(int24 tick) external pure returns (uint160) {
    // 2^n 부분곱을 사용한 고정밀 계산
    uint256 absTick = uint256(tick < 0 ? -int256(tick) : int256(tick));
    uint256 ratio = absTick & 0x1 != 0 ? 0xfffcb933bd6fad37aa2d162d1a594001 : 0x100000000000000000000000000000000;
    if (absTick & 0x2 != 0) ratio = (ratio * 0xfff97272373d413259a46990580e213a) >> 128;
    // ... 각 비트마다 상수 곱 (20개 상수)
    if (tick > 0) ratio = type(uint256).max / ratio;
    return uint160((ratio >> 32) + (ratio % (1 << 32) == 0 ? 0 : 1));
}`}</pre>
        <p>
          <strong>Q64.96</strong>: 160비트 고정소수점 — uint160 주소 크기와 일치<br />
          <code>getSqrtRatioAtTick</code>: 20개 상수 곱으로 tick→√P 변환 — O(log n) 대신 O(1)<br />
          각 상수는 <code>1.0001^(2^k)</code>를 Q128.128 형식으로 인코딩
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">유동성 L과 토큰 양 관계</h3>

        <TokenAmountViz />

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 가격 구간 [P_a, P_b]에 L 유동성 예치 시 필요 토큰 양

// Case 1: 현재 가격 P < P_a (구간 아래)
x = L · (1/√P_a - 1/√P_b)
y = 0  (모두 token0)

// Case 2: P_a ≤ P ≤ P_b (구간 내)
x = L · (1/√P - 1/√P_b)
y = L · (√P - √P_a)

// Case 3: P > P_b (구간 위)
x = 0
y = L · (√P_b - √P_a)  (모두 token1)`}</pre>
        <p>
          <strong>3가지 case</strong>: 가격이 구간 아래/안/위 중 어디인지에 따라 분기<br />
          구간 내: 양쪽 토큰 모두 필요<br />
          구간 밖: 한 쪽 토큰만 필요 (가격이 이미 지나감)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Swap 가격 계산 — √P 증분</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 일정 구간 내에서 Δx 입력 시 √P 변화
new_√P = L · √P / (L + Δx · √P)

// 또는 Δy 입력 시
new_√P = √P + Δy / L

// 토큰 변화량
Δx = L · (1/√P_new - 1/√P)
Δy = L · (√P_new - √P)`}</pre>
        <p>
          <strong>L 고정, √P 업데이트</strong>: 스왑은 유동성 L을 변화시키지 않음<br />
          가격 변화 = reserve 비율 변화 = √P 변화<br />
          구간 내에서는 V2의 x·y=k와 동일한 수학 적용
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Tick Bitmap — 초기화된 tick 추적</h3>

        <TickBitmapViz />

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 각 풀은 어느 tick에 유동성이 있는지 비트맵으로 관리
mapping(int16 => uint256) public tickBitmap;

// tick 인덱스를 16비트(word) + 8비트(bit) 분할
// tick 200이면: word = 0, bit = 200
// tick 500이면: word = 1, bit = 244 (500 - 256)

// 다음 초기화된 tick 찾기 (swap 진행 중 사용)
function nextInitializedTickWithinOneWord(
    int24 tick,
    int24 tickSpacing,
    bool lte  // 아래 방향 검색 여부
) external view returns (int24 next, bool initialized) {
    int24 compressed = tick / tickSpacing;
    if (lte) {
        (int16 wordPos, uint8 bitPos) = position(compressed);
        uint256 mask = (1 << bitPos) - 1 + (1 << bitPos);
        uint256 masked = tickBitmap[wordPos] & mask;
        // 가장 가까운 하위 비트 찾기 (bit manipulation)
        initialized = masked != 0;
        next = initialized
            ? (compressed - int24(bitPos - mostSignificantBit(masked))) * tickSpacing
            : (compressed - int24(bitPos)) * tickSpacing;
    } else {
        // 상위 방향 검색
    }
}`}</pre>
        <p>
          <strong>Tick Bitmap</strong>: 2560개 tick을 256비트 word 하나에 packing<br />
          bit 연산으로 다음 초기화된 tick 찾기 — O(1) with bit tricks<br />
          Swap이 "비어있는" tick을 빠르게 건너뛰기 가능 → gas 절감
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Tick Spacing 선택</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Tier별 tick spacing
0.01%:   spacing = 1      (모든 tick 허용)
0.05%:   spacing = 10     (tick 10, 20, 30, ...)
0.3%:    spacing = 60
1%:      spacing = 200

// 의미: 유동성 공급 시 사용 가능한 tick 간격
// 예: 0.3% tier에서 tickLower=0이면 tickUpper는 60, 120, 180...

// 트레이드오프
spacing 작음: 세밀한 구간 가능, tick crossing 빈번 → 가스 ↑
spacing 큼:   구간 거칠어짐, tick crossing 드묾 → 가스 ↓`}</pre>
        <p>
          <strong>스왑 가스 비용이 tick spacing과 반비례</strong><br />
          Stable 페어는 가격 변동 적음 → spacing=1 허용 (0.01% tier)<br />
          변동성 큰 페어는 spacing 커도 OK — 어차피 가격 대폭 변동
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: √P 사용의 우아함</p>
          <p>
            V3 수학의 아름다움은 <strong>√P 변수 선택</strong>에서 나옴:
          </p>
          <p className="mt-2">
            ✓ <strong>선형 관계</strong>: Δy = L·Δ(√P), Δx = L·Δ(1/√P)<br />
            ✓ <strong>가산성</strong>: 인접 구간 유동성을 선형 합산 가능<br />
            ✓ <strong>정밀도</strong>: 가격의 제곱근이 극단값에서 덜 왜곡
          </p>
          <p className="mt-2">
            <strong>대안 (P 직접 사용)</strong>:<br />
            - 비선형 관계 — 구간별 계산 복잡<br />
            - 정밀도 손실 — 가격이 극단적으로 클 때 overflow
          </p>
          <p className="mt-2">
            √P는 <strong>수학적 필연</strong> — Concentrated Liquidity의 가장 깔끔한 표현<br />
            이 선택이 V3의 gas 효율과 정밀도를 모두 가능하게 함
          </p>
        </div>

      </div>
    </section>
  );
}
