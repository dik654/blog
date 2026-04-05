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

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 예시: USDC/ETH 페어, 현재 가격 $3000

V2 방식:
  $100 LP가 제공하는 유동성이 $0 ~ $∞ 전 구간에 분산
  $2500~$3500 구간에 실제 사용되는 유동성: 약 $2

V3 방식:
  LP가 $2500~$3500 구간만 집중
  같은 $100으로 해당 구간에 $100 전부 제공
  자본 효율: 50배

// 좁을수록 효율 ↑
V3 좁은 구간 ($2950~$3050):
  자본 효율: 200배
  단, 가격 이탈 시 100% 한 쪽 자산으로 전환`}</pre>
        <p>
          <strong>구간이 좁을수록 효율 ↑, 위험 ↑</strong><br />
          가격이 구간 밖으로 나가면 100% 한 쪽 토큰으로 변환됨 — 수수료 수익 중단<br />
          LP는 구간 재조정(rebalancing)으로 대응 — 적극적 관리 필요
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">V2 vs V3 유동성 수학 비교</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`V2: x · y = k (전 구간)
    √k = L (liquidity)

V3: (x + L/√P_upper) · (y + L·√P_lower) = L²
    여기서 P는 현재 가격, P_lower/P_upper는 구간 경계

    가격이 구간 내: 양쪽 토큰 보유
    가격 < P_lower: 100% x (base) 보유
    가격 > P_upper: 100% y (quote) 보유`}</pre>
        <p>
          V3는 <strong>"가상 reserve"</strong> 개념 도입<br />
          실제 보유량 + 구간 경계로부터 계산된 가상 reserve가 곡선 형성<br />
          차이: V2는 reserve 물리적 존재, V3는 수학적 모델
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">유동성 제공자 포지션 — NFT</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// V2: LP 토큰은 ERC20 (fungible)
// V3: 각 포지션이 고유 NFT (non-fungible)

struct Position {
    uint96 nonce;
    address operator;
    uint80 poolId;        // 어느 풀
    int24 tickLower;      // 구간 하한 tick
    int24 tickUpper;      // 구간 상한 tick
    uint128 liquidity;    // 유동성 양 L
    uint256 feeGrowthInside0LastX128;  // 수수료 누적 (token0)
    uint256 feeGrowthInside1LastX128;
    uint128 tokensOwed0;  // 청구 가능 수수료
    uint128 tokensOwed1;
}`}</pre>
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
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`얻는 것:
  ✓ 4000배 자본 효율
  ✓ LP가 market maker 역할 (가격 예측 가능)
  ✓ Stable 페어 1bp 수수료로 효율적 거래
  ✓ Range order — limit order 유사 기능

잃는 것:
  ✗ Fungibility 상실 (NFT 기반)
  ✗ LP 능동 관리 필요 (구간 재조정)
  ✗ 복잡도 ↑ (일반 사용자 진입장벽)
  ✗ 가스 비용 ↑ (tick 크로싱)`}</pre>

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
