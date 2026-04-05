import ReservesViz from './viz/ReservesViz';

export default function ReservesAttestation() {
  return (
    <section id="reserves-attestation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">준비금 증명 &amp; 감사</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <ReservesViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">Attestation vs Audit</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Attestation (월간)
목적: 특정 시점의 잔액 확인
범위: 지정된 절차에 대한 "합리적 확신"
발행: 공인회계사(CPA) 서명
내용:
- 보고일의 준비금 총액
- USDC 총 공급량과 대응 관계
- 자산 구성 (Treasury, Cash 등)

// Audit (연간, SEC 공시 시)
목적: 재무제표 전체 적정성
범위: 모든 거래, 내부 통제, 지속 운영
발행: Big 4 회계법인
내용:
- 전체 Circle 재무상태
- 회계 처리 방식
- 내부 통제 평가
- Going concern 의견`}</pre>
        <p>
          <strong>Attestation ≠ Audit</strong>: 범위·깊이 크게 다름<br />
          USDC는 <strong>월간 attestation</strong> 공개 — 2018년부터 지속<br />
          Audit는 Circle IPO(2025년) 준비 과정에서 강화
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">Deloitte Attestation 샘플 (2024)</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`Independent Accountant's Report
Deloitte & Touche LLP

We have examined Circle's assertion that as of [date]:
- Fair Value of Reserve Assets: $60,427,891,234
- Total USDC in Circulation: $60,143,219,840
- Ratio: 100.47%

Reserve Composition:
- Circle Reserve Fund (BlackRock USDXX): $48,342,312,987 (80.0%)
- Cash held at banks: $6,042,789,123 (10.0%)
- Bank repurchase agreements: $3,025,394,561 (5.0%)
- Treasury bills held directly: $3,017,394,563 (5.0%)

Banking relationships:
- BNY Mellon
- Customers Bank
- Cross River Bank
- [Additional regulated US banks]

We conclude that Circle's assertion is fairly stated.`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">BlackRock USDXX Money Market Fund</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Circle Reserve Fund (USDXX) - BlackRock 운용
SEC 규제: 2a-7 Money Market Fund 규정 준수

포트폴리오:
- US Treasury Bills (만기 < 3개월)
- Treasury Notes (만기 < 13개월)
- Repurchase Agreements (overnight, secured by Treasuries)

특징:
✓ NAV $1 고정 목표 (SEC 규제)
✓ 일일 유동성 (same-day redemption)
✓ Ticker: USDXX (일반 투자자도 거래 가능)
✓ 등급: AAAm (S&P)

// 중요성
USDC 공급량의 80%가 이 펀드에 예치
→ Circle의 실질적 "은행"
→ BlackRock 신뢰가 USDC 백업의 핵심`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">Proof of Reserves — 암호학적 증명?</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// 이상적인 PoR 시스템
1. 은행 잔액 증명 (은행 → 실시간 signed statement)
2. 블록체인 supply 증명 (온체인에서 자동 계산)
3. Merkle tree 개별 예치자 확인

// 현실
Circle: 월간 attestation만 (오프체인 문서)
Tether: 분기별 (attestation만)
Paxos: 월간 attestation

// 암호학적 PoR 어려운 이유
- 은행 데이터는 privacy 필요
- 실시간 연결은 보안 위험
- 국가 간 은행 통신 표준 없음
- 감사·회계 기준 지역별 차이

// 제한적 발전
Coinbase: zk-proof로 customer 잔액 증명 (2023)
Kraken: Merkle tree로 고객 예치금 증명

// 미래
CBDC 발행 시 실시간 온체인 연결 가능성`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">규제 준수 — 주요 라이선스</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Circle의 규제 라이선스 (2024)

미국:
- Money Transmitter License (49개 주)
- NY BitLicense (2015년 최초 취득)
- Nevada Trust Company (Circle Internet Financial Inc.)

국제:
- UK FCA 등록 (Electronic Money Institution)
- Singapore MAS MPI License
- France ACPR (EMI)
- EU MiCA 준수 준비 중

// 2024 MiCA (EU 스테이블코인 규제)
Circle은 MiCA-compliant 버전 준비:
- 예치금의 60%+ 를 EU 은행에 보관
- 일일 발행 한도
- 엄격한 공시 요구사항`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">투명성 향상 로드맵</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`// Circle의 투명성 개선 (2022-2025)

2022:
- 월간 attestation 시작 (Grant Thornton)
- 은행 명단 공개

2023:
- Portfolio holdings 상세 공개
- USDC Reserve Fund 출시 (BlackRock)
- SVB 사태 후 은행 다각화

2024:
- Weekly reserve updates (비공식)
- CCTP 온체인 검증 데이터

2025 (IPO 준비):
- SEC 공시 의무 (S-1 filing)
- 연간 audit 공개
- Full 재무제표 공개

// 목표
"가장 투명한 스테이블코인 발행사"`}</pre>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 투명성의 한계와 진화</p>
          <p>
            USDC의 투명성은 <strong>전통 금융보다 높고, 암호학적 이상보다 낮음</strong>
          </p>
          <p className="mt-2">
            비교:<br />
            - 전통 은행: 분기별 10-K filing, 고객 잔액 비공개<br />
            - USDC: 월간 attestation, 총 공급량 온체인 가시<br />
            - 이상적 PoR: 실시간 + 개별 암호학적 증명
          </p>
          <p className="mt-2">
            <strong>USDC의 포지션</strong>:<br />
            - "Good enough" 투명성 — 규제 수용 가능<br />
            - 기관 투자자 신뢰 획득<br />
            - DeFi 생태계 기축통화 역할
          </p>
          <p className="mt-2">
            <strong>트레이드오프</strong>:<br />
            - 진정한 "무신뢰" 스테이블코인은 아직<br />
            - 탈중앙 대안(DAI, LUSD)과의 긴장 지속<br />
            - 규제 강화 시 Circle 우위 유지 가능
          </p>
        </div>

      </div>
    </section>
  );
}
