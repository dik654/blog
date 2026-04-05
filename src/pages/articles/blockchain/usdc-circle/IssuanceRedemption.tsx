import MintBurnViz from './viz/MintBurnViz';

export default function IssuanceRedemption() {
  return (
    <section id="issuance-redemption" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">Mint · Burn &amp; 1:1 백업</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <MintBurnViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">Mint 프로세스 상세</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 기관/파트너 mint 흐름 (Circle Mint 서비스)

Step 1: Onboarding
  - KYC/AML 검증
  - Circle Mint 계정 생성
  - API 키 발급
  - 법인 은행 계좌 연결

Step 2: USD 입금
  - Wire transfer or ACH
  - 최소 금액: 보통 $100K (기관용)
  - Circle 은행 계좌(BNY Mellon)로 전송

Step 3: Mint 요청
  POST /v1/businessAccount/mints
  {
    "amount": "1000000",
    "chain": "ETH",
    "destination": "0x..."
  }

Step 4: Verification
  - Circle 컴플라이언스 체크
  - 자금 출처 확인
  - 평균 처리 시간: 1-24시간

Step 5: On-chain mint
  - USDC contract.mint() 호출
  - 해당 주소에 USDC 발행
  - 확인 후 파트너 통보`}</pre>
        <p>
          <strong>T+0 ~ T+1</strong>: 자금 입금 당일 또는 다음날 mint 완료<br />
          Compliance 통과 필수 — 의심스러운 자금 거부<br />
          대형 mint는 $10M+ 단위 — 기관 트레이딩 데스크용
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Redemption 프로세스</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Burn 흐름 (USDC → USD 환급)

Step 1: USDC 전송
  - Circle burn address로 USDC 전송
  - 또는 Circle Mint API로 요청

Step 2: 자동 burn
  - USDC contract.burn() 호출
  - 총공급량 감소

Step 3: USD 지급
  - Wire transfer to 연결된 은행 계좌
  - T+1 ~ T+2 (은행 처리 시간)
  - 수수료: 보통 무료 (기관), 소액은 일부 수수료

// 긴급 상황 (FUD, bank run)
- Circle은 T+2 지급 약속
- 준비금 100% 유동성 — 이론상 모두 환급 가능
- 실제: 1일 환급량 상한 가능성 있음`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">1:1 백업 검증 메커니즘</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 온체인 총 공급량
totalSupply = sum(USDC on Ethereum, Solana, Base, Arbitrum, ...)
           ≈ $60B

// 오프체인 준비금
reserves = BlackRock USDXX MMF + Cash in banks
        ≈ $60B+

// 대응 관계
totalSupply ≤ reserves 유지 필수
(Circle은 "순 자산" 기준으로 초과분 인정 — 운영비 등)

// 월간 보고서
- Total USDC in circulation: $60,143,219,840
- Total reserves: $60,427,891,234
- Backing ratio: 100.47%`}</pre>
        <p>
          <strong>Over-collateralization</strong>: 준비금이 공급량보다 약간 많음<br />
          Buffer ~0.5% — 운영비, 잘못된 보고 방지<br />
          매월 attestation 공개 — 투명성 유지
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">2023 SVB 사태 — 실제 테스트</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`2023년 3월 10일-13일 사건:

Day 1 (Fri Mar 10):
  - SVB 파산 발표
  - Circle: $3.3B를 SVB에 예치 (준비금의 8%)
  - USDC 가격: $1.00 → $0.98

Day 2 (Sat Mar 11):
  - USDC: $0.88 최저가
  - Circle: "USDC는 완전 담보" 성명
  - 대규모 redemption 요청 접수 (시장 공황)

Day 3 (Sun Mar 12):
  - 미 재무부/연준: SVB 예금 전액 보증 발표
  - USDC: $0.97로 회복
  - Circle: redemption 처리 재개 (은행 영업 전)

Day 4 (Mon Mar 13):
  - USDC: $1.00 완전 회복
  - Total redemptions: ~$3B (5일 동안)
  - Circle이 처리 불가한 상황은 없었음

// 교훈
1. 은행 리스크가 실질적 위험
2. 분산 예치 중요성 (Circle은 이후 여러 은행으로 분산)
3. Weekend banking hours 문제
4. Market panic이 페그 흔들 수 있음`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">예치 은행 다각화</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// SVB 사태 이후 Circle의 대응

이전 (2023 초):
  SVB: $3.3B (8%)
  기타 은행: $1B 미만

현재 (2024):
  BlackRock USDXX MMF: $48B (80%)
  BNY Mellon: $6B (10%)
  Cross River Bank: $2B (3.3%)
  Customers Bank: $2B (3.3%)
  기타: $2B (3.4%)

// 장점
- 단일 은행 파산 영향 최소화
- Money market fund는 시스템적 보호 (SEC 규제)

// 여전한 리스크
- 미국 은행 시스템 전반 위기
- MMF 환매 제한 가능성`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 백업의 본질</p>
          <p>
            "1:1 백업"은 <strong>완벽한 보장이 아님</strong>
          </p>
          <p className="mt-2">
            리스크 계층:<br />
            1. <strong>법적 리스크</strong>: Circle이 실제로 소유권 행사 가능한가<br />
            2. <strong>운영 리스크</strong>: 환급 시스템 장애, 사기<br />
            3. <strong>은행 리스크</strong>: 예치 은행 파산<br />
            4. <strong>시장 리스크</strong>: Treasury bills 가격 변동 (미미)<br />
            5. <strong>규제 리스크</strong>: 당국의 자산 동결
          </p>
          <p className="mt-2">
            <strong>"USDC = USD"</strong>는 약속, 보장 아님<br />
            실제로는 <strong>Circle의 신용</strong>에 의존 — 전통 은행과 유사<br />
            SVB 사태가 이를 증명 — 디페그 가능성 실제 존재
          </p>
        </div>

      </div>
    </section>
  );
}
