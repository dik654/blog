import CircleArchViz from './viz/CircleArchViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">개요 &amp; 발행 구조</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <CircleArchViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">Circle — USDC의 발행사</h3>
        <p>
          Circle Internet Financial (2013년 설립)<br />
          USDC 공동 발행: Circle + Coinbase (Centre Consortium, 2018-2023)<br />
          2023년 Circle 단독 소유권 취득 — Coinbase는 주주로 전환
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">USDC 시스템 구조</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`┌───────────────────────────────────┐
│          Circle Entity            │
│  (regulated money transmitter)    │
├───────────────────────────────────┤
│   Reserve Account (BNY Mellon)    │
│   - US Treasury bills (80%)       │
│   - Cash deposits (20%)           │
│   Total: ~$60B                    │
└───────────────┬───────────────────┘
                │
                ├── Minting (USD in → USDC out)
                ├── Redemption (USDC in → USD out)
                │
                ▼
┌───────────────────────────────────┐
│  USDC Contracts (15+ chains)      │
│  Ethereum, Solana, Base, ...      │
│  Total supply: $60B equivalent    │
└───────────────────────────────────┘`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Mint/Burn 흐름</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Mint (USDC 발행)
1. KYC 기관/파트너: Circle 계좌에 USD 송금
2. Circle: 입금 확인 (ACH/Wire transfer)
3. Circle: USDC 스마트 컨트랙트에서 mint() 호출
4. 해당 주소로 USDC 발행

// Burn (USDC 소각)
1. 파트너: USDC를 Circle 주소로 전송
2. Circle: burn() 호출 → USDC 소각
3. Circle: 은행 계좌에서 USD 송금 (T+1 ~ T+2)

// 일반 사용자
직접 mint/burn 불가능
→ Coinbase, Binance 등 CEX 통해 USD↔USDC 거래
→ Circle Mint (기업용) 서비스 사용`}</pre>
        <p>
          <strong>Mint/Burn은 KYC 필수</strong>: 개인이 Circle과 직접 거래 어려움<br />
          일반 사용자는 CEX 경유 — 거래 수수료 발생<br />
          <strong>Tether도 동일 구조</strong>
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">ERC20 컨트랙트 — 상세 기능</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// USDC는 Upgradeable Proxy 패턴 사용
// FiatTokenProxy → FiatTokenV2_1 (implementation)

contract FiatTokenV2_1 is FiatTokenV2 {
    // 표준 ERC20 + 확장 기능

    // 1. Mint/Burn
    function mint(address _to, uint256 _amount) external {
        require(msg.sender == _masterMinter || isMinter[msg.sender], "NOT_MINTER");
        require(!paused);
        // ... mint 로직
    }

    // 2. Blacklist (regulatory compliance)
    mapping(address => bool) public _blacklist;
    function blacklist(address _account) external onlyBlacklister {
        _blacklist[_account] = true;
    }

    // 3. Pause
    function pause() external onlyPauser { paused = true; }

    // 4. EIP-3009 (Transfer With Authorization)
    // gasless transfer 지원
    function transferWithAuthorization(
        address from, address to, uint256 value,
        uint256 validAfter, uint256 validBefore, bytes32 nonce,
        uint8 v, bytes32 r, bytes32 s
    ) external {
        // EIP-712 서명 검증 후 전송
    }

    // 5. EIP-2612 Permit
    function permit(...) external { /* gasless approval */ }
}`}</pre>
        <p>
          <strong>Upgradeable</strong>: Circle이 구현 컨트랙트 교체 가능<br />
          <strong>EIP-3009/2612</strong>: gasless UX 지원<br />
          <strong>Blacklist</strong>: 규제 준수 — 범죄 자금 동결 기능
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">준비금 투명성</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 월간 Attestation Report (Deloitte/Grant Thornton)
https://www.circle.com/en/transparency

Circle Reserve Fund (BlackRock 운용):
├── US Treasury securities: ~$48B
│     - Maturity < 3 months
│     - Blackrock가 운용하는 money market fund (USDXX)
│
├── Repurchase agreements: ~$8B
│     - Overnight secured by Treasuries
│
├── Cash: ~$4B
│     - BNY Mellon, Cross River Bank, Customers Bank
│
Total: ~$60B

// 감사 아님 (attestation만)
// 특정 시점 잔액 확인 — full audit은 아님`}</pre>
        <p>
          <strong>Attestation ≠ Audit</strong>: 특정 시점 잔액만 확인<br />
          Full audit는 PwC/Deloitte 같은 대형 회계법인이 수행 — 연간<br />
          2025년 Circle IPO 이후 SEC 감사 의무화
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">수익 모델</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Circle 수익 원천

1. Treasury Yield (주수익)
   - 준비금 Treasury bills에서 발생 이자
   - Fed 금리 5% 기준: $60B × 5% = $3B/year
   - 이자 대부분 Circle 귀속 (사용자에 분배 없음)

2. Circle Mint 서비스
   - 기업용 API/플랫폼
   - 수수료 기반

3. CCTP (Cross-Chain Transfer Protocol)
   - 향후 수수료 부과 가능성

// Coinbase와의 수익 분배
이전: 50:50 분배
현재: Circle 대부분 수익, Coinbase는 USDC 플랫폼 노출 수익`}</pre>
        <p>
          <strong>"금리가 수익원"</strong>: 사용자는 USDC 보유해도 이자 없음<br />
          Circle이 $3B+ 연간 이자 수익 — 2023년 최초 흑자<br />
          금리 인하 시 Circle 수익 감소 → 사업 모델 리스크
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: USDC의 "은행" 역할</p>
          <p>
            USDC는 본질적으로 <strong>"디지털 은행 예금"</strong>:
          </p>
          <p className="mt-2">
            ✓ 100% 예금 준비금 (은행은 부분 준비금)<br />
            ✓ 전통 은행보다 투명 (월간 공개)<br />
            ✓ 24/7 이체 가능 (은행은 영업시간 제한)<br />
            ✓ 글로벌 (국경 없음)
          </p>
          <p className="mt-2">
            <strong>은행과의 차이</strong>:<br />
            ✗ FDIC 보험 없음 (SVB 때 문제)<br />
            ✗ 이자 없음 (은행은 savings account 이자)<br />
            ✗ 대출 불가 (은행은 대출로 신용 창조)
          </p>
          <p className="mt-2">
            <strong>결론</strong>: USDC = "narrow bank" (좁은 은행)<br />
            미국에서 narrow bank 허가 거부된 적 있음 — 규제 긴장 존재<br />
            스테이블코인 법안(GENIUS Act 등)이 이 정의 명확화 시도 중
          </p>
        </div>

      </div>
    </section>
  );
}
