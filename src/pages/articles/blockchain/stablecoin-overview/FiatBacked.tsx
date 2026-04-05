import FiatBackedViz from './viz/FiatBackedViz';
import IssuerStructureViz from './viz/IssuerStructureViz';
import ReserveCompositionViz from './viz/ReserveCompositionViz';

export default function FiatBacked() {
  return (
    <section id="fiat-backed" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">법정화폐 담보 (USDC, USDT)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <FiatBackedViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">구조 — "금 본위제 디지털 버전"</h3>

        <IssuerStructureViz />
        <p>
          <strong>1:1 백업 원칙</strong>: 발행된 토큰마다 동일 달러 보유<br />
          온체인 토큰은 <strong>IOU</strong> (I Owe You) — issuer가 USD 지급 약속<br />
          발행·환급은 KYC 필수 — issuer와 직접 거래
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">USDC vs USDT 비교</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">항목</th>
                <th className="border border-border px-3 py-2 text-left">USDC (Circle)</th>
                <th className="border border-border px-3 py-2 text-left">USDT (Tether)</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">시총</td>
                <td className="border border-border px-3 py-2">$60B+</td>
                <td className="border border-border px-3 py-2">$130B+</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">규제</td>
                <td className="border border-border px-3 py-2">미국 주 단위 라이선스</td>
                <td className="border border-border px-3 py-2">유럽·아시아 중심</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">감사</td>
                <td className="border border-border px-3 py-2">월간 (Deloitte/Grant Thornton)</td>
                <td className="border border-border px-3 py-2">분기별 (BDO Italia)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">준비금 투명성</td>
                <td className="border border-border px-3 py-2">높음 (월간 공개)</td>
                <td className="border border-border px-3 py-2">중간 (attestation만)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">블랙리스트</td>
                <td className="border border-border px-3 py-2">가능 (OFAC 제재 준수)</td>
                <td className="border border-border px-3 py-2">가능 (선별적)</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">사용처</td>
                <td className="border border-border px-3 py-2">기관, DeFi</td>
                <td className="border border-border px-3 py-2">CEX, P2P</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">스마트 컨트랙트 구조 — 중앙화된 ERC20</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`contract USDC is ERC20 {
    address public owner;
    mapping(address => bool) public blacklisted;
    bool public paused;

    function mint(address to, uint256 amount) external onlyOwner {
        // Issuer가 USD 입금 확인 후 호출
        require(!paused, "Contract paused");
        _mint(to, amount);
    }

    function burn(uint256 amount) external {
        // 환급 시 사용자가 호출 후 issuer가 USD 지급
        _burn(msg.sender, amount);
    }

    function blacklist(address account) external onlyOwner {
        blacklisted[account] = true;
        // 해당 주소의 토큰 동결
    }

    function transfer(address to, uint256 amount) public override returns (bool) {
        require(!blacklisted[msg.sender] && !blacklisted[to], "Blacklisted");
        require(!paused, "Paused");
        return super.transfer(to, amount);
    }
}`}</pre>
        <p>
          <strong>중앙 권한 3가지</strong>: mint, blacklist, pause<br />
          각 기능은 issuer가 <strong>규제 준수를 위해 필요</strong><br />
          사용자 입장에서는 <strong>검열 위험</strong> — USDC 동결 사례 존재 (Tornado Cash)
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">준비금 구성 — USDC 예시</h3>

        <ReserveCompositionViz />

        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 특징
- 고유동성 (빠른 환급 가능)
- 저위험 (미국 국채)
- 수익 발생 (Circle 수익원)

// 우려
- 은행 파산 리스크 (2023 SVB 사태: USDC 일시 디페그)
- 국채 금리 변동
- 감사인 신뢰도`}</pre>
        <p>
          <strong>SVB 사태(2023년 3월)</strong>: Circle이 SVB에 $3.3B 예치<br />
          은행 파산 뉴스 → USDC 일시 $0.88까지 하락<br />
          미국 정부 FDIC 보증 확장 후 페그 회복 → <strong>은행 리스크 현실화</strong>
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">체인 지원 — 멀티체인 발행</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// USDC는 15+ 체인에 발행
Ethereum, Polygon, Arbitrum, Optimism, Base, Solana,
Avalanche, Near, Tron, Stellar, Algorand, ...

// 각 체인의 USDC는 별도 컨트랙트
// 발행량 합계 = Circle 준비금과 일치해야

// Cross-chain 전환
Native USDC: 각 체인의 "진짜" USDC (Circle 발행)
Bridged USDC: 다른 체인에서 넘어온 래핑된 USDC (USDC.e)
  예: Arbitrum USDC.e (Ethereum USDC를 bridged)

// Circle의 CCTP (다음 섹션)
- Native USDC 간 직접 전환
- Burn on chain A → Mint on chain B`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: Fiat-backed의 근본적 한계</p>
          <p>
            <strong>Fiat-backed 스테이블코인 = 크립토가 아님</strong><br />
            은행·정부·규제에 완전 의존 — 탈중앙화 0
          </p>
          <p className="mt-2">
            장점:<br />
            ✓ 페그 안정 (은행 예치금 = 직접 1:1 백업)<br />
            ✓ 대규모 수용 (USDC $60B+)<br />
            ✓ 규제 준수 → 기관 투자 가능
          </p>
          <p className="mt-2">
            단점:<br />
            ✗ 검열 가능 (블랙리스트)<br />
            ✗ 은행 리스크 (SVB)<br />
            ✗ 규제 변경 리스크 (MiCA, 미국 스테이블코인 법)<br />
            ✗ 크립토 철학에 반 (중앙화 수용)
          </p>
          <p className="mt-2">
            <strong>현실</strong>: "DeFi의 기축통화"로 쓰이지만 <strong>진정한 crypto primitives 아님</strong><br />
            DAI, LUSD 같은 탈중앙 대안과 공존하는 생태계 필요
          </p>
        </div>

      </div>
    </section>
  );
}
