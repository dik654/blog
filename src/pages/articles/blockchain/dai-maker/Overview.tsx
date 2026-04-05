import SystemViz from './viz/SystemViz';
import VaultLifecycleViz from './viz/VaultLifecycleViz';
import MultiCollateralViz from './viz/MultiCollateralViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">개요 &amp; Multi-Collateral DAI</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">MakerDAO의 역사</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`2017: SAI (Single Collateral DAI) 출시 — ETH only
2019: MCD (Multi-Collateral DAI) 전환
2020: 블랙서스데이 위기 (3월 12일 ETH 가격 폭락)
2021: RWA (Real World Assets) 담보 도입
2022: Endgame 계획 발표 (Rune Christensen)
2024: Sky Protocol 리브랜딩 (DAI → USDS, MKR → SKY)

// 결과: 약 $5-8B 시총, 가장 오래된 탈중앙 스테이블`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">시스템 컴포넌트</h3>

        <SystemViz />

        <p>
          <strong>CDP 관리 분산</strong>: 여러 컨트랙트가 각자 역할<br />
          Vat는 <strong>"중앙 원장"</strong> — 모든 담보·부채 상태 저장<br />
          각 컴포넌트는 Vat에 권한만 가짐 → 모듈화
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Vault 라이프사이클</h3>

        <VaultLifecycleViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">Multi-Collateral 구조</h3>

        <MultiCollateralViz />

        <p>
          <strong>Ilk별 독립 파라미터</strong>: 담보 유형마다 다른 리스크 관리<br />
          같은 ETH 담보도 A/B/C 구분 — 리스크 선호도 따라 선택<br />
          RWA 담보 — 국채, 기업대출 등 전통 금융 자산
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">주요 토큰 역할</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">토큰</th>
                <th className="border border-border px-3 py-2 text-left">역할</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">DAI (→ USDS)</td>
                <td className="border border-border px-3 py-2">스테이블코인 (USD 페그)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">MKR (→ SKY)</td>
                <td className="border border-border px-3 py-2">거버넌스 · 시스템 보험 (bad debt 발생 시 소각)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">sDAI (→ sUSDS)</td>
                <td className="border border-border px-3 py-2">DSR 예치 토큰 (이자 누적)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Vault NFT</td>
                <td className="border border-border px-3 py-2">CDP 포지션 소유권</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: DAI의 "탈중앙 스테이블" 위치</p>
          <p>
            DAI는 7년간 운영된 <strong>가장 성공적인 탈중앙 스테이블코인</strong><br />
            But 진정한 탈중앙화는 아직 미완성
          </p>
          <p className="mt-2">
            <strong>탈중앙적 요소</strong>:<br />
            ✓ 코드 오픈소스<br />
            ✓ MKR 토큰 거버넌스<br />
            ✓ 스마트 컨트랙트 기반 자동화<br />
            ✓ 중앙 권한의 mint 불가
          </p>
          <p className="mt-2">
            <strong>중앙화 요소</strong>:<br />
            ✗ USDC 담보 50%+ → Circle 의존<br />
            ✗ RWA 담보 → 전통 금융 기관 의존<br />
            ✗ MKR 보유 집중 (top 5가 30%+)<br />
            ✗ 긴급 shutdown 시스템 (ESM)
          </p>
          <p className="mt-2">
            <strong>현실적 평가</strong>: USDC보다 탈중앙, LUSD보다 중앙화<br />
            "Good enough decentralization" — 시장 점유율과 안정성 유지
          </p>
        </div>

      </div>
    </section>
  );
}
