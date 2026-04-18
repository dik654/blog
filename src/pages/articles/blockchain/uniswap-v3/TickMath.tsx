import M from '@/components/ui/math';
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
        <div className="not-prose my-4 bg-muted/50 rounded-xl border border-border overflow-hidden">
          <div className="bg-muted px-5 py-2 border-b border-border">
            <span className="text-sm font-semibold">Tick &rarr; 가격 이산화</span>
          </div>
          <div className="p-5 space-y-3">
            <M display>{'P(i) = 1.0001^i'}</M>
            <p className="text-sm text-muted-foreground">각 tick이 1 basis point(0.01%) 가격 차이</p>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-sm">
              <div className="bg-muted rounded-lg px-3 py-2 text-center">
                <p className="font-mono text-xs text-muted-foreground">tick 0</p>
                <p className="font-semibold">1.0000</p>
              </div>
              <div className="bg-muted rounded-lg px-3 py-2 text-center">
                <p className="font-mono text-xs text-muted-foreground">tick 1</p>
                <p className="font-semibold">1.0001</p>
              </div>
              <div className="bg-muted rounded-lg px-3 py-2 text-center">
                <p className="font-mono text-xs text-muted-foreground">tick 10</p>
                <p className="font-semibold">1.0010</p>
              </div>
              <div className="bg-muted rounded-lg px-3 py-2 text-center">
                <p className="font-mono text-xs text-muted-foreground">tick 100</p>
                <p className="font-semibold">1.0101</p>
              </div>
              <div className="bg-muted rounded-lg px-3 py-2 text-center">
                <p className="font-mono text-xs text-muted-foreground">tick 1000</p>
                <p className="font-semibold">1.1052</p>
              </div>
            </div>
            <div className="text-sm space-y-1 pt-2 border-t border-border">
              <p>역변환: <M>{'\\text{tick} = \\log_{1.0001}(P) = \\frac{\\ln P}{\\ln 1.0001}'}</M></p>
              <p>범위: <code className="text-xs bg-muted px-1 rounded">[-887272, 887272]</code> — 최소 <M>{'\\approx 2.9 \\times 10^{-39}'}</M>, 최대 <M>{'\\approx 3.4 \\times 10^{38}'}</M></p>
            </div>
          </div>
        </div>
        <p>
          <strong>1 tick = 0.01% 가격 변화</strong> — 충분히 세밀하면서 계산 효율적<br />
          가격 범위가 극단적으로 넓음 (2e-39 ~ 3e38) — 어떤 토큰 페어도 수용<br />
          이산화로 gas 절감 — 연속적 가격 대신 정수 인덱스로 관리
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">√P 고정소수점 표현 — Q64.96</h3>
        <div className="not-prose my-4 bg-muted/50 rounded-xl border border-border overflow-hidden">
          <div className="bg-muted px-5 py-2 border-b border-border">
            <span className="text-sm font-semibold">Q64.96 고정소수점</span>
            <span className="text-xs text-muted-foreground ml-2">64비트 정수부 + 96비트 소수부</span>
          </div>
          <div className="p-5 space-y-3">
            <M display>{'\\texttt{sqrtPriceX96} = \\sqrt{P} \\cdot 2^{96}'}</M>
            <div className="bg-muted rounded-lg p-3 text-sm">
              <p className="text-muted-foreground text-xs mb-1">예시: P = 1.5</p>
              <p><M>{'\\sqrt{1.5} \\approx 1.22474'}</M></p>
              <p className="mt-1"><code className="text-xs bg-background px-1 rounded">sqrtPriceX96</code> = 1.22474 &times; 2<sup>96</sup> &asymp; 9.7 &times; 10<sup>28</sup></p>
            </div>
            <div className="border-t border-border pt-3">
              <p className="text-sm font-semibold mb-2">tick &harr; sqrtPriceX96 변환</p>
              <p className="text-sm"><code className="text-xs bg-muted px-1 rounded">getSqrtRatioAtTick(int24 tick)</code> &rarr; <code className="text-xs bg-muted px-1 rounded">uint160</code></p>
              <ul className="text-sm mt-2 space-y-1 text-muted-foreground">
                <li>절대값 tick을 비트 분해 &rarr; 20개 상수 부분곱으로 <M>{'1.0001^{2^k}'}</M> 계산</li>
                <li>Q128.128 형식 상수 사용 &rarr; O(1) 연산으로 고정밀 변환</li>
                <li>양수 tick이면 역수 변환: <code className="text-xs bg-muted px-1 rounded">type(uint256).max / ratio</code></li>
              </ul>
            </div>
          </div>
        </div>
        <p>
          <strong>Q64.96</strong>: 160비트 고정소수점 — uint160 주소 크기와 일치<br />
          <code>getSqrtRatioAtTick</code>: 20개 상수 곱으로 tick→√P 변환 — O(log n) 대신 O(1)<br />
          각 상수는 <code>1.0001^(2^k)</code>를 Q128.128 형식으로 인코딩
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">유동성 L과 토큰 양 관계</h3>

        <TokenAmountViz />

        <div className="not-prose my-4 bg-muted/50 rounded-xl border border-border overflow-hidden">
          <div className="bg-muted px-5 py-2 border-b border-border">
            <span className="text-sm font-semibold">가격 구간 [P_a, P_b]에 L 예치 시 필요 토큰 양</span>
          </div>
          <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-muted rounded-lg p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Case 1: P &lt; P_a (구간 아래)</p>
              <M display>{'x = L \\cdot \\left(\\frac{1}{\\sqrt{P_a}} - \\frac{1}{\\sqrt{P_b}}\\right)'}</M>
              <p className="text-sm text-center mt-1"><code className="text-xs bg-background px-1 rounded">y = 0</code> — 모두 token0</p>
            </div>
            <div className="bg-muted rounded-lg p-4 ring-1 ring-primary/30">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Case 2: P_a &le; P &le; P_b (구간 내)</p>
              <M display>{'x = L \\cdot \\left(\\frac{1}{\\sqrt{P}} - \\frac{1}{\\sqrt{P_b}}\\right)'}</M>
              <M display>{'y = L \\cdot \\left(\\sqrt{P} - \\sqrt{P_a}\\right)'}</M>
            </div>
            <div className="bg-muted rounded-lg p-4">
              <p className="text-xs font-semibold text-muted-foreground mb-2">Case 3: P &gt; P_b (구간 위)</p>
              <M display>{'y = L \\cdot \\left(\\sqrt{P_b} - \\sqrt{P_a}\\right)'}</M>
              <p className="text-sm text-center mt-1"><code className="text-xs bg-background px-1 rounded">x = 0</code> — 모두 token1</p>
            </div>
          </div>
        </div>
        <p>
          <strong>3가지 case</strong>: 가격이 구간 아래/안/위 중 어디인지에 따라 분기<br />
          구간 내: 양쪽 토큰 모두 필요<br />
          구간 밖: 한 쪽 토큰만 필요 (가격이 이미 지나감)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Swap 가격 계산 — √P 증분</h3>
        <div className="not-prose my-4 bg-muted/50 rounded-xl border border-border overflow-hidden">
          <div className="bg-muted px-5 py-2 border-b border-border">
            <span className="text-sm font-semibold">Swap 시 &radic;P 증분 공식</span>
          </div>
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">&Delta;x 입력 시 &radic;P 변화</p>
              <M display>{'\\sqrt{P_{new}} = \\frac{L \\cdot \\sqrt{P}}{L + \\Delta x \\cdot \\sqrt{P}}'}</M>
            </div>
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-2">&Delta;y 입력 시 &radic;P 변화</p>
              <M display>{'\\sqrt{P_{new}} = \\sqrt{P} + \\frac{\\Delta y}{L}'}</M>
            </div>
            <div className="md:col-span-2 border-t border-border pt-3">
              <p className="text-xs font-semibold text-muted-foreground mb-2">토큰 변화량</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <M display>{'\\Delta x = L \\cdot \\left(\\frac{1}{\\sqrt{P_{new}}} - \\frac{1}{\\sqrt{P}}\\right)'}</M>
                <M display>{'\\Delta y = L \\cdot \\left(\\sqrt{P_{new}} - \\sqrt{P}\\right)'}</M>
              </div>
            </div>
          </div>
        </div>
        <p>
          <strong>L 고정, √P 업데이트</strong>: 스왑은 유동성 L을 변화시키지 않음<br />
          가격 변화 = reserve 비율 변화 = √P 변화<br />
          구간 내에서는 V2의 x·y=k와 동일한 수학 적용
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Tick Bitmap — 초기화된 tick 추적</h3>

        <TickBitmapViz />

        <div className="not-prose my-4 bg-muted/50 rounded-xl border border-border overflow-hidden">
          <div className="bg-muted px-5 py-2 border-b border-border">
            <span className="text-sm font-semibold">Tick Bitmap 구조</span>
          </div>
          <div className="p-5 space-y-3">
            <p className="text-sm"><code className="text-xs bg-muted px-1 rounded">mapping(int16 =&gt; uint256) public tickBitmap</code></p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-muted rounded-lg p-3 text-sm">
                <p className="text-xs text-muted-foreground mb-1">인덱스 분할</p>
                <p>tick &rarr; 16비트 <strong>word</strong> + 8비트 <strong>bit</strong></p>
                <p className="mt-1 text-muted-foreground text-xs">tick 200: word=0, bit=200</p>
                <p className="text-muted-foreground text-xs">tick 500: word=1, bit=244</p>
              </div>
              <div className="bg-muted rounded-lg p-3 text-sm">
                <p className="text-xs text-muted-foreground mb-1">다음 초기화 tick 탐색</p>
                <p><code className="text-xs bg-background px-1 rounded">nextInitializedTickWithinOneWord()</code></p>
                <p className="mt-1 text-muted-foreground text-xs">swap 진행 중 다음 유동성 틱 탐색</p>
              </div>
            </div>
            <div className="border-t border-border pt-3 text-sm space-y-1">
              <p className="font-semibold text-xs text-muted-foreground">탐색 알고리즘 (하한 방향 lte=true)</p>
              <ol className="list-decimal list-inside text-sm space-y-1 text-muted-foreground">
                <li><code className="text-xs bg-muted px-1 rounded">compressed = tick / tickSpacing</code> &rarr; word/bit 위치 계산</li>
                <li>마스크 생성: <code className="text-xs bg-muted px-1 rounded">(1 &lt;&lt; bitPos) - 1 + (1 &lt;&lt; bitPos)</code></li>
                <li>비트맵 AND 마스크 &rarr; <code className="text-xs bg-muted px-1 rounded">mostSignificantBit(masked)</code>로 최근접 tick 도출</li>
              </ol>
            </div>
          </div>
        </div>
        <p>
          <strong>Tick Bitmap</strong>: 2560개 tick을 256비트 word 하나에 packing<br />
          bit 연산으로 다음 초기화된 tick 찾기 — O(1) with bit tricks<br />
          Swap이 "비어있는" tick을 빠르게 건너뛰기 가능 → gas 절감
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Tick Spacing 선택</h3>
        <div className="not-prose my-4 bg-muted/50 rounded-xl border border-border overflow-hidden">
          <div className="bg-muted px-5 py-2 border-b border-border">
            <span className="text-sm font-semibold">Tier별 Tick Spacing</span>
          </div>
          <div className="p-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div className="bg-muted rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground">0.01%</p>
                <p className="font-semibold text-lg">1</p>
                <p className="text-xs text-muted-foreground">모든 tick 허용</p>
              </div>
              <div className="bg-muted rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground">0.05%</p>
                <p className="font-semibold text-lg">10</p>
                <p className="text-xs text-muted-foreground">10, 20, 30...</p>
              </div>
              <div className="bg-muted rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground">0.3%</p>
                <p className="font-semibold text-lg">60</p>
                <p className="text-xs text-muted-foreground">60, 120, 180...</p>
              </div>
              <div className="bg-muted rounded-lg p-3 text-center">
                <p className="text-xs text-muted-foreground">1%</p>
                <p className="font-semibold text-lg">200</p>
                <p className="text-xs text-muted-foreground">200, 400, 600...</p>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 text-sm">
              <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-lg p-3 border border-emerald-200 dark:border-emerald-800">
                <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300">spacing 작음</p>
                <p className="text-sm mt-1">세밀한 구간 가능, tick crossing 빈번 &rarr; 가스 상승</p>
              </div>
              <div className="bg-amber-50 dark:bg-amber-950/30 rounded-lg p-3 border border-amber-200 dark:border-amber-800">
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-300">spacing 큼</p>
                <p className="text-sm mt-1">구간 거칠어짐, tick crossing 드묾 &rarr; 가스 절감</p>
              </div>
            </div>
          </div>
        </div>
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
