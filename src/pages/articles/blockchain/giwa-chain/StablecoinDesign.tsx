export default function StablecoinDesign() {
  return (
    <section id="stablecoin-design" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">한국형 스테이블코인 설계</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">KRW 스테이블코인의 필요성</h3>
        <p>
          현재 Korean crypto 시장은 <strong>USDT/USDC 의존</strong>:<br />
          - 모든 거래가 USD 표기 — 환율 노출<br />
          - Kimchi Premium (한국 vs 글로벌 가격 차이) 존재<br />
          - 원화 직접 연동 스테이블코인 부재
        </p>
        <p>
          <strong>KRW 스테이블코인의 가치</strong>:<br />
          ✓ 원화 직접 표기 (환율 리스크 제거)<br />
          ✓ 국내 가맹점 결제 가능성<br />
          ✓ Crypto ↔ KRW 단절 해소<br />
          ✓ 한국 DeFi 생태계 기축 통화
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">KRW 스테이블코인의 역사</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">프로젝트</th>
                <th className="border border-border px-3 py-2 text-left">연도</th>
                <th className="border border-border px-3 py-2 text-left">상태</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">KRWb (BXB)</td>
                <td className="border border-border px-3 py-2">2019</td>
                <td className="border border-border px-3 py-2">중단</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">KRWP (MiL.k)</td>
                <td className="border border-border px-3 py-2">2020</td>
                <td className="border border-border px-3 py-2">제한적 운영</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">KRWT (Tether)</td>
                <td className="border border-border px-3 py-2">제안됨</td>
                <td className="border border-border px-3 py-2">출시 안 됨</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">GIWA KRW Stable (가칭)</td>
                <td className="border border-border px-3 py-2">2025+</td>
                <td className="border border-border px-3 py-2">개발 중 (추정)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          * 이전 KRW 스테이블코인들은 규제·유동성·신뢰 문제로 성공 못 함
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">GIWA 잠재 KRW 스테이블 모델 추정</h3>
        <div className="not-prose rounded-lg border border-border bg-card p-4 my-4">
          <p className="font-semibold text-sm mb-3">Model A: Fiat-backed (USDC/USDT 방식)</p>
          <div className="mb-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">구조</p>
            <p className="text-sm text-muted-foreground">
              GIWA Foundation → 국내 은행 계좌 (국민/신한 등) → 은행 예치금과 1:1 KRW 스테이블 토큰 교환
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-3 mb-3">
            <div>
              <p className="text-xs font-semibold text-green-600 mb-1">장점</p>
              <ul className="text-sm text-muted-foreground space-y-0.5 list-none pl-0">
                <li>안정성 최고</li>
                <li>1:1 환급 명확</li>
                <li>전통 금융과 호환</li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-red-500 mb-1">단점</p>
              <ul className="text-sm text-muted-foreground space-y-0.5 list-none pl-0">
                <li>중앙화</li>
                <li>한국 규제 강함 (전자금융거래법, 가상자산법)</li>
                <li>은행 파트너십 필요</li>
              </ul>
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">적합한 라이센스</p>
            <p className="text-sm text-muted-foreground">
              <code className="text-xs">전자금융업자 (PG)</code> / <code className="text-xs">가상자산사업자 (VASP)</code>
            </p>
          </div>
        </div>

        <div className="not-prose rounded-lg border border-border bg-card p-4 my-4">
          <p className="font-semibold text-sm mb-3">Model B: Crypto-collateralized (DAI 방식)</p>
          <div className="mb-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">구조</p>
            <p className="text-sm text-muted-foreground">
              Users: ETH/BTC 담보 예치 → KRW 스테이블 발행 (150%+ 과담보) → KRW 원화 가격 peg 유지
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <p className="text-xs font-semibold text-green-600 mb-1">장점</p>
              <ul className="text-sm text-muted-foreground space-y-0.5 list-none pl-0">
                <li>탈중앙</li>
                <li>전통 금융 의존 없음</li>
                <li>은행 파트너십 불필요</li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-red-500 mb-1">단점</p>
              <ul className="text-sm text-muted-foreground space-y-0.5 list-none pl-0">
                <li>자본 효율 낮음</li>
                <li>KRW 환율 오라클 필요 (조작 위험)</li>
                <li>Kimchi Premium 이슈</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="not-prose rounded-lg border border-border bg-card p-4 my-4">
          <p className="font-semibold text-sm mb-3">Model C: RWA-backed (한국 국채/회사채)</p>
          <div className="mb-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase mb-1">구조</p>
            <p className="text-sm text-muted-foreground">
              GIWA SPV → 한국 국채/회사채 매입 → KRW 스테이블 1:1 토큰 발행 → 국채 이자 = 보유자 수익 (DSR 방식)
            </p>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            <div>
              <p className="text-xs font-semibold text-green-600 mb-1">장점</p>
              <ul className="text-sm text-muted-foreground space-y-0.5 list-none pl-0">
                <li>수익 발생 (yield-bearing)</li>
                <li>한국 금융 시장에 실물 연결</li>
                <li>RWA 트렌드 부합</li>
              </ul>
            </div>
            <div>
              <p className="text-xs font-semibold text-red-500 mb-1">단점</p>
              <ul className="text-sm text-muted-foreground space-y-0.5 list-none pl-0">
                <li>한국 자본시장법 규제 복잡</li>
                <li>증권형 토큰 분류 위험</li>
                <li>KYC 필수</li>
              </ul>
            </div>
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">한국 시장 특수성</h3>
        <p>
          <strong>1. Kimchi Premium</strong><br />
          한국 거래소(업비트, 빗썸) 가격 &gt; 글로벌 가격 (2-10%)<br />
          원인: 자본 통제, 차익거래 제한<br />
          KRW 스테이블이 이 gap 해소 가능?
        </p>
        <p>
          <strong>2. 원화 거래쌍 위주</strong><br />
          Upbit의 거의 모든 거래 KRW pair<br />
          하지만 온체인에서는 USD 기반 — 불일치
        </p>
        <p>
          <strong>3. 엄격한 규제</strong><br />
          특정금융정보법 (2021) — VASP 신고 필수<br />
          가상자산이용자보호법 (2024) — 유저 보호 강화<br />
          스테이블코인 별도 규제 준비 중
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">GIWA의 전략적 포지션</h3>
        <p>
          GIWA가 KRW 스테이블을 성공시키려면:<br />
          <strong>1. 규제 preemptive 준수</strong> — 라이센스 선제 취득<br />
          <strong>2. 은행 파트너십</strong> — 신뢰할 수 있는 custodian<br />
          <strong>3. 유동성 구축</strong> — 초기 거래소 상장, LP 인센티브<br />
          <strong>4. 사용 사례 개척</strong> — 결제, 송금, DeFi 통합
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: KRW 스테이블의 chicken-and-egg</p>
          <p>
            KRW 스테이블이 성공하지 못한 이유:
          </p>
          <p className="mt-2">
            <strong>유동성 문제</strong>: 사용처 없음 → 거래량 없음 → LP 없음 → 사용처 없음 (순환)<br />
            <strong>규제 불확실성</strong>: 법적 위치 애매 → 기관 참여 꺼림<br />
            <strong>USDC/USDT 지배</strong>: 글로벌 네트워크 효과
          </p>
          <p className="mt-2">
            GIWA의 접근이 성공하려면 <strong>"사용 사례 우선"</strong>:<br />
            ✓ 국내 P2P 결제 (Toss, 카카오페이 대체)<br />
            ✓ 게임 내 통화 (GIWA 기반 게임)<br />
            ✓ 해외 송금 (Western Union 대체)<br />
            ✓ 국내 NFT·RWA 생태계 기축
          </p>
          <p className="mt-2">
            단순 "KRW 버전 USDC" 접근은 이전 시도들처럼 실패 가능성 높음<br />
            <strong>차별화된 가치 제안</strong>이 결정적
          </p>
        </div>

      </div>
    </section>
  );
}
