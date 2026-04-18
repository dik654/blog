import M from '@/components/ui/math';
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

        <div className="not-prose space-y-3 mb-4">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border p-4">
              <p className="font-semibold text-sm mb-1">x</p>
              <p className="text-sm"><code>token0</code> 준비금</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="font-semibold text-sm mb-1">y</p>
              <p className="text-sm"><code>token1</code> 준비금</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="font-semibold text-sm mb-1">k</p>
              <p className="text-sm">상수 (유동성 변화 시에만 변경)</p>
            </div>
          </div>
          <div className="rounded-lg border border-sky-500/30 bg-sky-500/5 p-4">
            <p className="font-semibold text-sm mb-2">불변식</p>
            <M display>{'x \\cdot y = k'}</M>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">스왑 시: <M>{'\\Delta x'}</M> 입력 → <M>{'\\Delta y'}</M> 출력</p>
            <M display>{'(x + \\Delta x)(y - \\Delta y) = k'}</M>
            <M display>{'\\Delta y = \\frac{y \\cdot \\Delta x}{x + \\Delta x} \\quad \\text{(수수료 제외)}'}</M>
          </div>
        </div>
        <p>
          k는 <strong>풀의 "깊이"</strong>를 나타냄 — k가 클수록 슬리피지 작음<br />
          스왑이 일어나도 k는 일정 유지 — 단 수수료(0.3%)가 별도로 reserve에 추가되어 k 증가<br />
          LP 입금/출금 시에만 k 비례 변경
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">가격 계산 — marginal price</h3>

        <SwapSimulatorViz />

        <div className="not-prose space-y-3 mb-4">
          <div className="rounded-lg border border-sky-500/30 bg-sky-500/5 p-4">
            <p className="font-semibold text-sm mb-2">가격 공식</p>
            <M display>{'P = \\frac{y}{x} \\quad \\text{(token0 단위의 token1 가격)}'}</M>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">예시: USDC/ETH 풀</p>
            <div className="grid gap-2 sm:grid-cols-3 text-sm font-mono mb-2">
              <div>x (USDC) = 3,000,000</div>
              <div>y (ETH) = 1,000</div>
              <div>P = 1/3000</div>
            </div>
            <p className="text-sm">1 USDC = 0.000333 ETH / 역수: <strong>3,000 USDC/ETH</strong></p>
          </div>
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
            <p className="font-semibold text-sm mb-2">거래 후 가격 변화 — 1 ETH 구매</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li><M>{'\\Delta y = 1'}</M>, <M>{'\\Delta x = \\frac{x \\cdot \\Delta y}{y - \\Delta y} = \\frac{3{,}000{,}000 \\times 1}{999} = 3{,}003'}</M> USDC</li>
              <li>새 reserve: <code>x=3,003,003</code>, <code>y=999</code></li>
              <li>새 가격: <M>{"P' = 999 / 3{,}003{,}003 = 0.0003327"}</M></li>
              <li>1 ETH = <strong>3,006 USDC</strong> (0.2% 상승)</li>
            </ul>
          </div>
        </div>
        <p>
          가격은 <strong>reserve 비율의 도함수</strong> — <code>P = dy/dx = -y/x</code><br />
          거래 크기가 클수록 슬리피지 ↑ — x·y=k 곡선이 쌍곡선이기 때문<br />
          무한대 스왑은 불가능 — reserve를 0으로 만들려면 무한 토큰 필요
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">수수료 모델 — 0.3%</h3>

        <FeeModelViz />

        <div className="not-prose space-y-3 mb-4">
          <div className="rounded-lg border border-sky-500/30 bg-sky-500/5 p-4">
            <p className="font-semibold text-sm mb-2">수수료 포함 swap 공식</p>
            <M display>{"\\Delta x' = \\Delta x \\times 0.997 \\quad \\text{(0.3\\% 수수료 차감)}"}</M>
            <M display>{"\\Delta y = \\frac{y \\cdot \\Delta x'}{x + \\Delta x'}"}</M>
          </div>
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">k 불변식 검증 (수수료 포함)</p>
            <ul className="text-sm space-y-1 list-disc list-inside">
              <li><M>{"x_{new} = x + \\Delta x"}</M> — 수수료 포함 입금</li>
              <li><M>{"y_{new} = y - \\Delta y"}</M></li>
              <li><M>{"k_{new} = x_{new} \\cdot y_{new} > k_{old}"}</M> — k가 증가</li>
            </ul>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
              <p className="font-semibold text-sm mb-1">0.25% → LP</p>
              <p className="text-sm">풀 reserve에 누적</p>
            </div>
            <div className="rounded-lg border p-4">
              <p className="font-semibold text-sm mb-1">0.05% → 프로토콜</p>
              <p className="text-sm">나중에 토글 가능</p>
            </div>
          </div>
        </div>
        <p>
          수수료는 <strong>reserve에 통합</strong> — 별도 fee pool 없음<br />
          LP 수익 = reserve 증가분 + 임퍼머넌트 로스 복구<br />
          0.3%는 고정 — V3에서 가변 tier 도입
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">임퍼머넌트 로스(IL) — LP의 기회비용</h3>

        <ImpermanentLossViz />

        <div className="not-prose space-y-3 mb-4">
          <div className="rounded-lg border p-4">
            <p className="font-semibold text-sm mb-2">초기 예치: 50/50 비율 $1000</p>
            <p className="text-sm">500 USDC + 0.1 ETH (ETH = $5,000 가정)</p>
          </div>
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 p-4">
            <p className="font-semibold text-sm mb-2">ETH 가격 2배 상승 ($10,000)</p>
            <p className="text-sm mb-2">AMM은 차익거래자가 가격을 맞추도록 유도 — <M>{'x \\cdot y = k'}</M> 유지하면서 <M>{'y/x = 1/10000'}</M></p>
            <div className="text-sm font-mono space-y-1">
              <p><M>{'k = 500 \\times 0.1 = 50'}</M></p>
              <p><M>{'x = 10000y \\Rightarrow 10000y^2 = 50 \\Rightarrow y = 0.0707'}</M></p>
              <p><M>{'x = 707.1 \\text{ USDC}'}</M></p>
            </div>
            <p className="text-sm mt-2">LP 보유 가치: 707.1 + 0.0707 × 10,000 = <strong>$1,414.2</strong></p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/5 p-4">
              <p className="font-semibold text-sm mb-1">HODL</p>
              <p className="text-sm">500 + 0.1 × 10,000 = <strong>$1,500</strong></p>
            </div>
            <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
              <p className="font-semibold text-sm mb-1">LP</p>
              <p className="text-sm"><strong>$1,414.2</strong></p>
            </div>
            <div className="rounded-lg border border-red-500/30 bg-red-500/5 p-4">
              <p className="font-semibold text-sm mb-1">IL</p>
              <p className="text-sm"><strong>-$85.8 (-5.7%)</strong></p>
            </div>
          </div>
        </div>
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
