import DeathSpiralViz from './viz/DeathSpiralViz';
import TerraTimelineViz from './viz/TerraTimelineViz';

export default function Algorithmic() {
  return (
    <section id="algorithmic" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">알고리드믹 (Terra, FRAX)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <DeathSpiralViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">알고리드믹 스테이블코인이란</h3>
        <p>
          담보 없이 <strong>알고리즘만으로 페그 유지</strong><br />
          공급량 조절 → 수요-공급 법칙으로 가격 $1 수렴<br />
          "Holy grail": 탈중앙 + 자본효율 + 페그 — but 실패율 높음
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Terra/UST — 가장 유명한 실패</h3>
        <div className="bg-muted/50 border border-border rounded-lg p-5 my-4">
          <p className="font-semibold text-sm mb-3">Terra 시스템 (2022년 5월 붕괴) — 2 토큰 시스템</p>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-background rounded px-3 py-2 text-sm text-center">
              <p className="font-semibold">UST</p>
              <p className="text-xs text-muted-foreground">스테이블코인 ($1 목표)</p>
            </div>
            <div className="bg-background rounded px-3 py-2 text-sm text-center">
              <p className="font-semibold">LUNA</p>
              <p className="text-xs text-muted-foreground">거버넌스·변동성 흡수 토큰</p>
            </div>
          </div>
          <div className="space-y-3 text-sm">
            <div className="bg-green-50 dark:bg-green-900/20 rounded px-3 py-2">
              <p className="font-semibold text-xs mb-1">UST &gt; $1 (공급 부족)</p>
              <p>User: $1 LUNA burn → 1 UST mint (차익거래) → UST 공급 증가 → 가격 하락</p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded px-3 py-2">
              <p className="font-semibold text-xs mb-1">UST &lt; $1 (공급 과잉)</p>
              <p>User: 1 UST burn → $1 상당 LUNA mint → UST 공급 감소 → 가격 상승</p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">이론: 차익거래자가 페그 유지 / 현실: 죽음의 나선 (death spiral)</p>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Death Spiral — Terra 붕괴 시나리오</h3>

        <TerraTimelineViz />
        <div className="bg-muted/50 border border-border rounded-lg p-5 my-4">
          <p className="font-semibold text-sm mb-3">2022년 5월 10일-13일: 붕괴 타임라인</p>
          <div className="space-y-2 text-sm mb-4">
            <div className="bg-background rounded px-3 py-2">
              <p className="font-semibold text-xs text-muted-foreground">Day 1 (May 10)</p>
              <p>UST: <strong>$0.985</strong> (minor depeg, Anchor withdrawals)</p>
              <p className="text-xs">공격자: 대규모 UST 매도 → LUNA mint → LUNA 가격 하락</p>
            </div>
            <div className="bg-background rounded px-3 py-2">
              <p className="font-semibold text-xs text-muted-foreground">Day 2 (May 11)</p>
              <p>UST: <strong>$0.67</strong> (심각한 depeg), 공황 매도 시작</p>
              <p className="text-xs">더 많은 UST 소각 → 더 많은 LUNA mint / LUNA: $80 → $30</p>
            </div>
            <div className="bg-background rounded px-3 py-2">
              <p className="font-semibold text-xs text-muted-foreground">Day 3 (May 12)</p>
              <p>UST: <strong>$0.30</strong>, LUNA 공급 hyperinflation</p>
              <p className="text-xs">LUNA: $30 → $0.10 (99% 하락)</p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded px-3 py-2">
              <p className="font-semibold text-xs text-muted-foreground">Day 4 (May 13)</p>
              <p>UST: <strong>$0.10</strong>, LUNA: $0.000001</p>
              <p className="text-xs text-red-600">시스템 중단 → $40B 증발</p>
            </div>
          </div>
          <div className="bg-red-50 dark:bg-red-900/20 rounded px-3 py-2 text-sm">
            <p className="font-semibold text-xs mb-1">Death Spiral 메커니즘</p>
            <p>UST 하락 → 신뢰 상실 → 더 많은 burn (더 많은 LUNA mint) → LUNA 가격 하락 → UST burn 인센티브 감소 → UST 가격 더 하락 → ...</p>
          </div>
        </div>
        <p>
          <strong>근본 결함</strong>: 담보 없음 → 신뢰 잃으면 zero 가치<br />
          LUNA 발행량 무제한 → hyperinflation → LUNA 가치 상실<br />
          Terra 실패는 <strong>알고리드믹 스테이블의 "왜 안 되는가" 증명</strong>
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">FRAX — Fractional-Algorithmic</h3>
        <div className="bg-muted/50 border border-border rounded-lg p-5 my-4">
          <p className="font-semibold text-sm mb-2">FRAX — "부분 담보" 접근 (2021 출시)</p>
          <p className="text-xs text-muted-foreground mb-3">Collateral Ratio (CR) 동적 조정</p>
          <div className="grid grid-cols-3 gap-2 text-sm mb-4">
            <div className="bg-background rounded px-3 py-2 text-center">
              <p className="text-xs text-muted-foreground">CR = 100%</p>
              <p className="font-semibold">완전 담보</p>
              <p className="text-xs">(DAI와 유사)</p>
            </div>
            <div className="bg-background rounded px-3 py-2 text-center">
              <p className="text-xs text-muted-foreground">CR = 50%</p>
              <p className="font-semibold">하이브리드</p>
              <p className="text-xs">50% 담보 + 50% algo</p>
            </div>
            <div className="bg-background rounded px-3 py-2 text-center">
              <p className="text-xs text-muted-foreground">CR = 0%</p>
              <p className="font-semibold">완전 algo</p>
              <p className="text-xs">(실패 사례)</p>
            </div>
          </div>
          <div className="space-y-2 text-sm mb-3">
            <div className="bg-green-50 dark:bg-green-900/20 rounded px-3 py-2">
              <p>FRAX &gt; $1 → CR 감소 (algo 비중 상승)</p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 rounded px-3 py-2">
              <p>FRAX &lt; $1 → CR 증가 (담보 비중 상승)</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="bg-background rounded px-3 py-2">
              <p className="font-semibold text-xs text-muted-foreground mb-1">발행 (CR=90%)</p>
              <p>0.9 USDC + 0.1 FXS → 1 FRAX mint</p>
              <p className="text-xs text-muted-foreground">FXS = FRAX의 거버넌스·변동성 토큰</p>
            </div>
            <div className="bg-background rounded px-3 py-2">
              <p className="font-semibold text-xs text-muted-foreground mb-1">환급</p>
              <p>1 FRAX burn → 0.9 USDC + 0.1 USD 상당 FXS</p>
            </div>
          </div>
        </div>
        <p>
          <strong>동적 담보 비율</strong>: 시장 반응에 따라 조정<br />
          CR이 증가 방향으로 조정 — Terra 실패 후 더 보수적<br />
          2023년부터 FRAX는 <strong>100% 담보화</strong> — 알고리드믹 포기
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">USDe (Ethena) — Delta-Neutral Synthetic</h3>
        <div className="bg-muted/50 border border-border rounded-lg p-5 my-4">
          <p className="font-semibold text-sm mb-2">USDe (2024) — "Synthetic Dollar"</p>
          <p className="text-xs text-muted-foreground mb-3">알고리드믹도 담보도 아닌 델타 중립 파생상품 구조</p>
          <div className="space-y-2 text-sm mb-4">
            <div className="flex items-start gap-2">
              <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded px-2 py-0.5 text-xs font-semibold shrink-0">1</span>
              <span>User: 1 ETH 예치 ($3,000)</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded px-2 py-0.5 text-xs font-semibold shrink-0">2</span>
              <span>Ethena: ETH를 현물 매수</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded px-2 py-0.5 text-xs font-semibold shrink-0">3</span>
              <div>
                <span>Ethena: ETH perp 숏 (파생상품)</span>
                <p className="text-xs text-muted-foreground">가격 상승: 현물 이익 + 파생 손실 = 0 / 가격 하락: 현물 손실 + 파생 이익 = 0</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded px-2 py-0.5 text-xs font-semibold shrink-0">4</span>
              <span>순 노출 0 (delta-neutral) → $3,000 가치 유지</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 rounded px-2 py-0.5 text-xs font-semibold shrink-0">5</span>
              <span>USDe 3,000 발행</span>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="bg-background rounded px-3 py-2">
              <p className="font-semibold text-xs text-muted-foreground mb-1">수익 원천</p>
              <p>Funding rate (숏 포지션에 대한 롱들의 지불)</p>
              <p>ETH staking yield (stETH 사용 시)</p>
            </div>
            <div className="bg-background rounded px-3 py-2">
              <p className="font-semibold text-xs text-muted-foreground mb-1">리스크</p>
              <p>Funding rate 음수 전환 (베어마켓)</p>
              <p>CEX counterparty risk (Binance, Bybit 등)</p>
              <p>파생상품 거래소 의존</p>
            </div>
          </div>
        </div>
        <p>
          <strong>새로운 모델</strong>: 담보 없지만 파생상품으로 노출 상쇄<br />
          "yield-bearing stablecoin" — 8-30% APY 제공 (funding rate 시즌별)<br />
          리스크: CEX·파생상품 의존 → <strong>분산화 부족</strong>
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">알고리드믹 스테이블의 역사 — 실패 모음</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">프로젝트</th>
                <th className="border border-border px-3 py-2 text-left">메커니즘</th>
                <th className="border border-border px-3 py-2 text-left">결과</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border border-border px-3 py-2">NuBits (2014)</td><td className="border border-border px-3 py-2">Seigniorage</td><td className="border border-border px-3 py-2">2016 디페그 → 0</td></tr>
              <tr><td className="border border-border px-3 py-2">Basis Cash (2020)</td><td className="border border-border px-3 py-2">3-token rebase</td><td className="border border-border px-3 py-2">2021 실패</td></tr>
              <tr><td className="border border-border px-3 py-2">Empty Set Dollar</td><td className="border border-border px-3 py-2">Bonded debt</td><td className="border border-border px-3 py-2">2021 실패</td></tr>
              <tr><td className="border border-border px-3 py-2">UST (Terra)</td><td className="border border-border px-3 py-2">Dual-token burn</td><td className="border border-border px-3 py-2">2022 $40B 손실</td></tr>
              <tr><td className="border border-border px-3 py-2">USDD (Tron)</td><td className="border border-border px-3 py-2">USDT 담보 + algo</td><td className="border border-border px-3 py-2">간헐적 디페그</td></tr>
              <tr><td className="border border-border px-3 py-2">AMPL</td><td className="border border-border px-3 py-2">Rebase</td><td className="border border-border px-3 py-2">페그 실패, 실험적</td></tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 알고리드믹의 구조적 한계</p>
          <p>
            알고리드믹 스테이블은 <strong>"공격에 대한 내구성 부족"</strong>
          </p>
          <p className="mt-2">
            문제:<br />
            ✗ 신뢰 기반 (담보 없음) → 신뢰 잃으면 회복 불가<br />
            ✗ 시장 스트레스에 취약 (bank run)<br />
            ✗ 공격자 유리 (short squeeze 가능)<br />
            ✗ "reflexivity" — 가격 하락이 더 많은 하락 유발
          </p>
          <p className="mt-2">
            <strong>교훈</strong>:<br />
            - Terra 이후 시장은 알고리드믹에 신뢰 상실<br />
            - 부분 담보(FRAX) → 완전 담보로 이동<br />
            - 순수 알고리드믹은 <strong>실험실 프로젝트</strong>로 간주
          </p>
          <p className="mt-2">
            <strong>미래</strong>: USDe 같은 synthetic 모델이 "알고리드믹 계승자"<br />
            담보 없지만 수학적·헷징으로 페그 유지 — 아직 검증 중
          </p>
        </div>

      </div>
    </section>
  );
}
