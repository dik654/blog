import M from '@/components/ui/math';
import ConcentratedViz from './viz/ConcentratedViz';
import CapitalEfficiencyViz from './viz/CapitalEfficiencyViz';
import FeeTierViz from './viz/FeeTierViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">개요 &amp; 가격 구간 유동성</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">V3의 핵심 혁신 — Concentrated Liquidity</h3>

        <ConcentratedViz />

        <p>
          Uniswap V2: 유동성이 <strong>[0, ∞]</strong> 전체 가격 범위에 분산<br />
          V3: LP가 <strong>특정 가격 구간</strong>에 유동성 집중 가능<br />
          결과: 같은 자본으로 <strong>최대 4000배</strong> 자본 효율
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">자본 효율 비교</h3>

        <CapitalEfficiencyViz />

        <div className="not-prose my-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-muted/50 rounded-xl p-5 border border-border">
            <p className="text-sm font-semibold text-muted-foreground mb-2">V2 방식</p>
            <p className="text-sm">USDC/ETH, 현재 가격 $3000 기준</p>
            <p className="text-sm mt-2">$100 LP 유동성이 <code className="text-xs bg-muted px-1 rounded">$0 ~ $∞</code> 전 구간에 분산</p>
            <p className="text-sm mt-1">$2500~$3500 구간에 실제 사용 유동성: <strong>약 $2</strong></p>
          </div>
          <div className="bg-muted/50 rounded-xl p-5 border border-border">
            <p className="text-sm font-semibold text-muted-foreground mb-2">V3 방식</p>
            <p className="text-sm">LP가 $2500~$3500 구간만 집중</p>
            <p className="text-sm mt-2">같은 $100으로 해당 구간에 <strong>$100 전부 제공</strong></p>
            <p className="text-sm mt-1">자본 효율: <strong>50배</strong></p>
          </div>
          <div className="md:col-span-2 bg-muted/50 rounded-xl p-5 border border-border">
            <p className="text-sm font-semibold text-muted-foreground mb-2">V3 좁은 구간 ($2950~$3050)</p>
            <p className="text-sm">자본 효율: <strong>200배</strong> — 구간이 좁을수록 효율 상승</p>
            <p className="text-sm mt-1 text-muted-foreground">단, 가격 이탈 시 100% 한 쪽 자산으로 전환</p>
          </div>
        </div>
        <p>
          <strong>구간이 좁을수록 효율 ↑, 위험 ↑</strong><br />
          가격이 구간 밖으로 나가면 100% 한 쪽 토큰으로 변환됨 — 수수료 수익 중단<br />
          LP는 구간 재조정(rebalancing)으로 대응 — 적극적 관리 필요
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">V2 vs V3 유동성 수학 비교</h3>
        <div className="not-prose my-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-muted/50 rounded-xl p-5 border border-border">
            <p className="text-sm font-semibold text-muted-foreground mb-2">V2 수식</p>
            <M display>{'x \\cdot y = k \\quad \\text{(전 구간)}'}</M>
            <p className="text-sm mt-2"><M>{'\\sqrt{k} = L'}</M> — L은 유동성(liquidity)</p>
          </div>
          <div className="bg-muted/50 rounded-xl p-5 border border-border">
            <p className="text-sm font-semibold text-muted-foreground mb-2">V3 수식</p>
            <M display>{'\\left(x + \\frac{L}{\\sqrt{P_{upper}}}\\right) \\cdot \\left(y + L \\cdot \\sqrt{P_{lower}}\\right) = L^2'}</M>
            <p className="text-xs text-muted-foreground mt-2">P: 현재 가격, P_lower/P_upper: 구간 경계</p>
          </div>
          <div className="md:col-span-2 bg-muted/50 rounded-xl p-5 border border-border">
            <p className="text-sm font-semibold text-muted-foreground mb-2">가격 위치별 보유 토큰</p>
            <div className="grid grid-cols-3 gap-3 text-sm mt-1">
              <div className="text-center">
                <p className="font-mono text-xs text-muted-foreground">P &lt; P_lower</p>
                <p className="mt-1">100% <code className="text-xs bg-muted px-1 rounded">token0</code> (base)</p>
              </div>
              <div className="text-center border-x border-border px-3">
                <p className="font-mono text-xs text-muted-foreground">P_lower &le; P &le; P_upper</p>
                <p className="mt-1">양쪽 토큰 보유</p>
              </div>
              <div className="text-center">
                <p className="font-mono text-xs text-muted-foreground">P &gt; P_upper</p>
                <p className="mt-1">100% <code className="text-xs bg-muted px-1 rounded">token1</code> (quote)</p>
              </div>
            </div>
          </div>
        </div>
        <p>
          V3는 <strong>"가상 reserve"</strong> 개념 도입<br />
          실제 보유량 + 구간 경계로부터 계산된 가상 reserve가 곡선 형성<br />
          차이: V2는 reserve 물리적 존재, V3는 수학적 모델
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">유동성 제공자 포지션 — NFT</h3>
        <div className="not-prose my-4 bg-muted/50 rounded-xl border border-border overflow-hidden">
          <div className="bg-muted px-5 py-2 border-b border-border flex items-center gap-2">
            <span className="text-sm font-semibold">Position 구조체</span>
            <span className="text-xs text-muted-foreground">V2: ERC20 (fungible) &rarr; V3: NFT (non-fungible)</span>
          </div>
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm">
            <div>
              <p className="text-xs text-muted-foreground mb-1">식별 정보</p>
              <p><code className="text-xs bg-muted px-1 rounded">uint96 nonce</code> — 향후 기능용</p>
              <p><code className="text-xs bg-muted px-1 rounded">address operator</code> — 승인된 관리자</p>
              <p><code className="text-xs bg-muted px-1 rounded">uint80 poolId</code> — 어느 풀</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">구간 &amp; 유동성</p>
              <p><code className="text-xs bg-muted px-1 rounded">int24 tickLower</code> — 구간 하한 tick</p>
              <p><code className="text-xs bg-muted px-1 rounded">int24 tickUpper</code> — 구간 상한 tick</p>
              <p><code className="text-xs bg-muted px-1 rounded">uint128 liquidity</code> — 유동성 양 L</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">수수료 누적 스냅샷</p>
              <p><code className="text-xs bg-muted px-1 rounded">uint256 feeGrowthInside0LastX128</code> — token0</p>
              <p><code className="text-xs bg-muted px-1 rounded">uint256 feeGrowthInside1LastX128</code> — token1</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">청구 가능 수수료</p>
              <p><code className="text-xs bg-muted px-1 rounded">uint128 tokensOwed0</code> — token0</p>
              <p><code className="text-xs bg-muted px-1 rounded">uint128 tokensOwed1</code> — token1</p>
            </div>
          </div>
        </div>
        <p>
          <strong>포지션마다 구간 다름 → NFT로 개별 관리</strong><br />
          V2처럼 ERC20으로 fungible화 불가능 — 각 포지션 고유함<br />
          NFT로 포지션 전송·매매 가능 — 2차 시장 형성
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">수수료 Tier — 4단계</h3>

        <FeeTierViz />
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">Tier</th>
                <th className="border border-border px-3 py-2 text-left">Tick Spacing</th>
                <th className="border border-border px-3 py-2 text-left">용도</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">0.01%</td>
                <td className="border border-border px-3 py-2">1</td>
                <td className="border border-border px-3 py-2">USDC/USDT 같은 stable 페어</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">0.05%</td>
                <td className="border border-border px-3 py-2">10</td>
                <td className="border border-border px-3 py-2">ETH/stETH, correlated 페어</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">0.3%</td>
                <td className="border border-border px-3 py-2">60</td>
                <td className="border border-border px-3 py-2">ETH/USDC 등 일반 페어 (V2 동등)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">1%</td>
                <td className="border border-border px-3 py-2">200</td>
                <td className="border border-border px-3 py-2">변동성 높은 exotic 페어</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          <strong>Tick Spacing</strong>: 유효 가격 틱 간격 — tier 높을수록 간격 넓음<br />
          Tier마다 별도 Pool 배포 — ETH/USDC에 3개 풀 공존 가능 (0.05%, 0.3%, 1%)<br />
          시장이 자연스럽게 유동성 몰리는 tier 결정
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">V3로 얻는 것 / 잃는 것</h3>
        <div className="not-prose my-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-emerald-50 dark:bg-emerald-950/30 rounded-xl p-5 border border-emerald-200 dark:border-emerald-800">
            <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-300 mb-3">얻는 것</p>
            <ul className="text-sm space-y-1.5">
              <li>4000배 자본 효율</li>
              <li>LP가 market maker 역할 (가격 예측 가능)</li>
              <li>Stable 페어 1bp 수수료로 효율적 거래</li>
              <li>Range order — limit order 유사 기능</li>
            </ul>
          </div>
          <div className="bg-red-50 dark:bg-red-950/30 rounded-xl p-5 border border-red-200 dark:border-red-800">
            <p className="text-sm font-semibold text-red-700 dark:text-red-300 mb-3">잃는 것</p>
            <ul className="text-sm space-y-1.5">
              <li>Fungibility 상실 (NFT 기반)</li>
              <li>LP 능동 관리 필요 (구간 재조정)</li>
              <li>복잡도 상승 (일반 사용자 진입장벽)</li>
              <li>가스 비용 상승 (tick 크로싱)</li>
            </ul>
          </div>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: "Professional LP"의 등장</p>
          <p>
            V2는 "수동 LP" — 예치하고 방치해도 수수료 누적<br />
            V3는 "능동 LP" — 구간 관리, 재조정, tier 선택 필수
          </p>
          <p className="mt-2">
            결과: <strong>전문 LP 시장 형성</strong><br />
            - Gamma, Arrakis, Visor 같은 LP 매니저 프로토콜 등장<br />
            - 알고리즘 기반 자동 재조정<br />
            - 일반 사용자는 "LP 매니저 vault"에 예치
          </p>
          <p className="mt-2">
            V3는 LP를 <strong>passive → active</strong>로 전환<br />
            이는 전통 시장의 <strong>"market maker"</strong>와 유사 — DEX의 성숙 과정
          </p>
        </div>

      </div>
    </section>
  );
}
