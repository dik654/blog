import MarketShareViz from './viz/MarketShareViz';
import TrilemmaViz from './viz/TrilemmaViz';
import TypesCompareViz from './viz/TypesCompareViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">왜 스테이블코인인가</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">문제 — 크립토의 변동성</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 일일 변동성 (최근 3년 평균)
BTC: ±3.5%
ETH: ±4.2%
SOL: ±6.8%

// 시사점
- 지불 수단으로 부적합: 커피 $5 → 내일 $4.8 or $5.2
- 회계 단위 부적합: 급여·청구서 예측 불가
- 저축 수단 부적합: 월급 받고 1주일 만에 -20% 가능

// 필요성
1. Crypto 생태계 내부 결제 수단
2. DeFi 대출·파생상품의 기준 자산
3. 크로스보더 송금 (USD 대체)
4. 인플레이션 높은 국가의 저축 수단`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">시장 규모 (2025년 기준)</h3>

        <MarketShareViz />
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">스테이블코인</th>
                <th className="border border-border px-3 py-2 text-left">유형</th>
                <th className="border border-border px-3 py-2 text-left">시총</th>
                <th className="border border-border px-3 py-2 text-left">비중</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="border border-border px-3 py-2">USDT (Tether)</td><td className="border border-border px-3 py-2">Fiat-backed</td><td className="border border-border px-3 py-2">$130B+</td><td className="border border-border px-3 py-2">~55%</td></tr>
              <tr><td className="border border-border px-3 py-2">USDC (Circle)</td><td className="border border-border px-3 py-2">Fiat-backed</td><td className="border border-border px-3 py-2">$60B+</td><td className="border border-border px-3 py-2">~25%</td></tr>
              <tr><td className="border border-border px-3 py-2">DAI / USDS</td><td className="border border-border px-3 py-2">Crypto-backed</td><td className="border border-border px-3 py-2">$5B+</td><td className="border border-border px-3 py-2">~2%</td></tr>
              <tr><td className="border border-border px-3 py-2">FRAX</td><td className="border border-border px-3 py-2">Hybrid</td><td className="border border-border px-3 py-2">$0.6B</td><td className="border border-border px-3 py-2">~0.3%</td></tr>
              <tr><td className="border border-border px-3 py-2">USDe (Ethena)</td><td className="border border-border px-3 py-2">Synthetic</td><td className="border border-border px-3 py-2">$5B+</td><td className="border border-border px-3 py-2">~2%</td></tr>
            </tbody>
          </table>
        </div>
        <p>
          <strong>Fiat-backed 독점</strong>: USDT + USDC가 80% 이상 점유<br />
          Algo/synthetic은 소수 — Terra(UST) 붕괴 후 시장 신뢰 회복 중<br />
          전체 시총 $200B+ — 이더리움 전체 시총의 40% 수준
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">4가지 유형</h3>

        <TypesCompareViz />
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`1. Fiat-Collateralized (법정화폐 담보)
   - 예: USDC, USDT, PYUSD
   - 은행 예치 USD를 담보로 온체인 토큰 발행
   - 1:1 백업 (이론적)

2. Crypto-Collateralized (암호자산 담보)
   - 예: DAI (Sky), LUSD (Liquity)
   - ETH·WBTC 등을 과담보로 예치
   - CDP (Collateralized Debt Position)

3. Algorithmic (알고리드믹)
   - 예: UST (붕괴), AMPL, USDD
   - 공급 조절로 가격 유지
   - Seigniorage shares, rebase 등

4. Hybrid / Synthetic
   - 예: FRAX, USDe (Ethena), GHO (Aave)
   - 여러 메커니즘 조합
   - Delta-neutral, fractional reserve 등`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">페그 메커니즘 비교</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">유형</th>
                <th className="border border-border px-3 py-2 text-left">페그 방식</th>
                <th className="border border-border px-3 py-2 text-left">주 리스크</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">Fiat-backed</td>
                <td className="border border-border px-3 py-2">은행 예치금 직접 환급</td>
                <td className="border border-border px-3 py-2">중앙화, 은행 파산, 규제</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Crypto-backed</td>
                <td className="border border-border px-3 py-2">청산 경매, PSM</td>
                <td className="border border-border px-3 py-2">담보 가치 급락, 스마트 컨트랙트</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Algorithmic</td>
                <td className="border border-border px-3 py-2">공급 조절, 쌍토큰 시스템</td>
                <td className="border border-border px-3 py-2">Death spiral (Terra)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Synthetic</td>
                <td className="border border-border px-3 py-2">Delta-neutral 포지션</td>
                <td className="border border-border px-3 py-2">Funding rate, 파생상품 의존</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">Stablecoin Trilemma</h3>

        <TrilemmaViz />
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 3개 꼭짓점 중 2개만 달성 가능 (경험적)

USDC: 안정성 + 자본효율, but 중앙화
DAI:  안정성 + 탈중앙화, but 자본효율 낮음 (150%+ 과담보)
UST:  탈중앙화 + 자본효율, but 안정성 실패 (붕괴)

// 각 스테이블코인은 2가지 선택`}</pre>
        <p>
          <strong>3개 속성 중 2개만</strong>: Crypto Stablecoin Trilemma<br />
          USDC/USDT: 탈중앙화 희생<br />
          DAI: 자본 효율 희생<br />
          UST(Terra): 안정성 희생 → 붕괴
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 스테이블코인의 현실</p>
          <p>
            "탈중앙 스테이블코인"은 <strong>여전히 미완성</strong>:
          </p>
          <p className="mt-2">
            - Terra/UST: 알고리드믹 실패 ($40B 손실)<br />
            - DAI: 담보 중 USDC 비중 높음 (50%+) → 간접 중앙화<br />
            - USDe: Delta-neutral, 하지만 funding rate 의존
          </p>
          <p className="mt-2">
            <strong>시장은 실용 선택</strong>:<br />
            - 일상 거래: USDC/USDT (중앙화 수용)<br />
            - DeFi 탈중앙 강조: DAI, LUSD<br />
            - Yield seeking: USDe, sUSDS (리스크 감수)
          </p>
          <p className="mt-2">
            완벽한 스테이블코인은 아직 없음 — <strong>각자 장단점 이해 후 선택</strong>
          </p>
        </div>

      </div>
    </section>
  );
}
