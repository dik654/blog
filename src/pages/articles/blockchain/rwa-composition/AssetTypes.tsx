export default function AssetTypes() {
  return (
    <section id="asset-types" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">자산 유형 — 국채, 부동산, 원자재</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">1. 미국 국채 (T-bills)</h3>
        <p>
          가장 성숙한 RWA 카테고리 — 2023년부터 폭발적 성장<br />
          수익률: 4.5-5.5% APY (Fed funds rate 추종)<br />
          리스크: 최저 (미국 정부 신용)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">주요 국채 RWA 프로젝트</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">프로젝트</th>
                <th className="border border-border px-3 py-2 text-left">토큰</th>
                <th className="border border-border px-3 py-2 text-right">TVL</th>
                <th className="border border-border px-3 py-2 text-left">구조</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">Ondo Finance</td>
                <td className="border border-border px-3 py-2">USDY, OUSG</td>
                <td className="border border-border px-3 py-2 text-right">$1.2B+</td>
                <td className="border border-border px-3 py-2">BlackRock MMF + SPV</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">BlackRock BUIDL</td>
                <td className="border border-border px-3 py-2">BUIDL</td>
                <td className="border border-border px-3 py-2 text-right">$2B+</td>
                <td className="border border-border px-3 py-2">BlackRock 직접 운용</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Franklin Templeton</td>
                <td className="border border-border px-3 py-2">FOBXX / BENJI</td>
                <td className="border border-border px-3 py-2 text-right">$500M+</td>
                <td className="border border-border px-3 py-2">Stellar/Polygon</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Superstate</td>
                <td className="border border-border px-3 py-2">USTB</td>
                <td className="border border-border px-3 py-2 text-right">$400M+</td>
                <td className="border border-border px-3 py-2">SEC 등록 펀드</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">2. Private Credit — 기업 대출</h3>
        <p>
          중소기업·신흥국 기업에 대출, 온체인 유동성 확보<br />
          수익률: 8-15% APY (리스크 프리미엄)<br />
          리스크: 중간-높음 (차입자 default)
        </p>
        <p>
          <strong>주요 프로젝트</strong>:<br />
          - <strong>Centrifuge</strong>: Invoice·SME 대출 토큰화, MakerDAO와 파트너십<br />
          - <strong>Maple Finance</strong>: 기관 대출 (Genesis Trading 등)<br />
          - <strong>Goldfinch</strong>: 신흥국(나이지리아, 인도네시아 등) 대출<br />
          - <strong>Credix</strong>: 라틴아메리카 fintech 대출
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">3. 부동산</h3>
        <p>
          가장 도전적 RWA — 규제·유동성·가격 발견 문제<br />
          부분 소유 가능성 → 소액 투자자 진입<br />
          유동성: 낮음 (24/7 거래 가능하지만 depth 얕음)
        </p>
        <p>
          <strong>주요 프로젝트</strong>:<br />
          - <strong>RealT</strong>: 미국 임대 부동산, 지분 토큰 발행 (월 임대료 분배)<br />
          - <strong>Propy</strong>: 부동산 거래·계약 NFT화<br />
          - <strong>Tangible</strong>: 부동산 담보 스테이블코인(USDR) — 2023 디페그<br />
          - <strong>LABS Protocol</strong>: 아시아 부동산 토큰화
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">4. 귀금속 &amp; 원자재</h3>
        <p>
          가장 단순한 RWA 형태 — 1:1 백업 쉬움<br />
          수요: 인플레이션 헷지, crypto 연관성 낮음
        </p>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">토큰</th>
                <th className="border border-border px-3 py-2 text-left">자산</th>
                <th className="border border-border px-3 py-2 text-right">TVL</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">PAXG (Paxos Gold)</td>
                <td className="border border-border px-3 py-2">1 oz LBMA 금괴</td>
                <td className="border border-border px-3 py-2 text-right">$600M+</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">XAUT (Tether Gold)</td>
                <td className="border border-border px-3 py-2">1 oz 금</td>
                <td className="border border-border px-3 py-2 text-right">$600M+</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">DGX (Digix)</td>
                <td className="border border-border px-3 py-2">1g 금</td>
                <td className="border border-border px-3 py-2 text-right">소규모</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">5. 기타 RWA</h3>
        <p>
          <strong>탄소 크레딧</strong>: KlimaDAO, Toucan (BCT)<br />
          <strong>미술품</strong>: Maecenas, Masterworks (토큰화 NFT 아트)<br />
          <strong>지적재산권</strong>: Royalty tokens (음악, 특허)<br />
          <strong>보험</strong>: Nexus Mutual, InsurAce (탈중앙 보험)<br />
          <strong>에너지</strong>: Powerledger (전력 거래)
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 자산 유형별 성숙도</p>
          <p>
            <strong>Tier 1 (성숙)</strong>: 국채, 금 — 유동성·규제·신뢰 모두 확립<br />
            <strong>Tier 2 (성장)</strong>: Private Credit, 기업 대출 — 수요 증가 중<br />
            <strong>Tier 3 (초기)</strong>: 부동산, 미술, 탄소 — 규제·유동성 도전
          </p>
          <p className="mt-2">
            <strong>성숙 기준</strong>:<br />
            ✓ 가격 발견이 명확한가 (vs 감정평가)<br />
            ✓ 환금성(liquidity) 있는가<br />
            ✓ 규제 프레임워크 확립됐는가<br />
            ✓ 발행사 신뢰 축적됐는가
          </p>
          <p className="mt-2">
            2025년 RWA 대부분 TVL이 <strong>국채·private credit</strong>에 집중<br />
            부동산·원자재는 잠재력 크지만 2-3년 더 시간 필요
          </p>
        </div>

      </div>
    </section>
  );
}
