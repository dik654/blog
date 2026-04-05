export default function Regulatory() {
  return (
    <section id="regulatory" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">한국 규제 환경 &amp; 전략</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-6 mb-3">한국 가상자산 규제 타임라인</h3>
        <pre className="bg-muted p-4 rounded-lg overflow-x-auto text-sm">{`2017-2018: 규제 공백기
  - ICO 금지 (2017.09)
  - 거래소 폭발적 성장
  - 스테이블코인 논의 없음

2021: 특정금융정보법 (특금법) 시행
  - VASP 신고제 도입
  - 은행 실명계좌 필수
  - 거래소 대대적 구조조정

2024: 가상자산이용자보호법 시행
  - 이용자 자산 보호 강화
  - 불공정거래 규제
  - 거래소 보유 코인 80% 콜드월렛 의무

2025 (예상): 2단계 규제
  - 스테이블코인 전용 규제
  - 발행사 자격 요건
  - DeFi 규제 프레임워크`}</pre>

        <h3 className="text-xl font-semibold mt-8 mb-3">스테이블코인 관련 주요 법률</h3>
        <p>
          <strong>1. 전자금융거래법 (전자금융업자)</strong><br />
          - 전자지급수단 발행·관리 업자 허가<br />
          - 자본금 요건: 선불전자지급수단 30억+<br />
          - 은행 예치 의무, 지준율 100%
        </p>
        <p>
          <strong>2. 특정금융정보법 (VASP)</strong><br />
          - 가상자산사업자 신고 필수<br />
          - ISMS 인증, 실명확인 계좌 은행 계약<br />
          - AML/KYC 의무
        </p>
        <p>
          <strong>3. 가상자산이용자보호법 (2024)</strong><br />
          - 가상자산 정의 포함 (스테이블코인)<br />
          - 거래 감시·불공정거래 조사<br />
          - 이용자 자산 분리 보관
        </p>
        <p>
          <strong>4. 자본시장법 (증권형 토큰)</strong><br />
          - RWA 담보 스테이블의 증권성 판정<br />
          - 공모·사모 분류 규제<br />
          - 증권사 라이센스 필요 가능성
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">글로벌 스테이블코인 규제 비교</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted">
                <th className="border border-border px-3 py-2 text-left">국가/지역</th>
                <th className="border border-border px-3 py-2 text-left">프레임워크</th>
                <th className="border border-border px-3 py-2 text-left">특징</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-border px-3 py-2">EU</td>
                <td className="border border-border px-3 py-2">MiCA (2024)</td>
                <td className="border border-border px-3 py-2">EMT·ART 구분, 100% 예치금</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Singapore</td>
                <td className="border border-border px-3 py-2">MAS Guidelines</td>
                <td className="border border-border px-3 py-2">SSP 라이센스, 1:1 백업</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Japan</td>
                <td className="border border-border px-3 py-2">Payment Services Act</td>
                <td className="border border-border px-3 py-2">은행·신탁만 발행 가능</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">USA</td>
                <td className="border border-border px-3 py-2">GENIUS Act (제안)</td>
                <td className="border border-border px-3 py-2">Payment stablecoin 전용 규제</td>
              </tr>
              <tr>
                <td className="border border-border px-3 py-2">Korea</td>
                <td className="border border-border px-3 py-2">2단계 입법 (2025)</td>
                <td className="border border-border px-3 py-2">발행사 자격·투명성</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">한국 스테이블코인 발행사의 도전</h3>
        <p>
          <strong>1. 은행과의 관계</strong><br />
          실명계좌 발급 거부 사례 다수<br />
          국내 은행은 crypto 관련 리스크 보수적<br />
          → 대만·싱가포르 우회 설립 가능성
        </p>
        <p>
          <strong>2. 한국은행의 CBDC</strong><br />
          한은은 CBDC 파일럿 진행 (2024)<br />
          민간 스테이블코인과 경쟁 구도 가능성<br />
          정부는 "CBDC 우선" 노선 선호할 가능성
        </p>
        <p>
          <strong>3. 외환 거래법</strong><br />
          KRW 스테이블이 해외로 유출 시 외환 통제 이슈<br />
          "사실상 자본 이동" 규제 대상 가능성
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">GIWA의 잠재 규제 전략</h3>
        <p>
          <strong>Option 1: 본사 해외 설립, 한국 지사</strong><br />
          싱가포르/스위스 재단 → 한국은 마케팅·개발<br />
          라이센스 유연성 확보
        </p>
        <p>
          <strong>Option 2: 한국 금융위 협력</strong><br />
          규제 샌드박스 참여<br />
          정식 라이센스 신청 (장기전)<br />
          먼저 기관 대상 B2B 서비스
        </p>
        <p>
          <strong>Option 3: 하이브리드 접근</strong><br />
          토큰 발행: 해외 재단<br />
          유동성 제공: 국내 VASP 파트너<br />
          사용자: 글로벌 (한국 중심)
        </p>

        <div className="bg-amber-50 dark:bg-amber-950/30 border-l-4 border-amber-400 p-4 my-6 rounded-r-lg">
          <p className="font-semibold mb-2">인사이트: 한국 스테이블코인의 역사적 타이밍</p>
          <p>
            2025년은 한국 스테이블코인의 <strong>critical juncture</strong>:
          </p>
          <p className="mt-2">
            <strong>긍정적 요인</strong>:<br />
            ✓ 2단계 가상자산법 준비 — 규제 명확화<br />
            ✓ 글로벌 RWA 트렌드 — 한국 자산 토큰화 수요<br />
            ✓ 핀테크 생태계 성숙 (Toss, Kakao 등)<br />
            ✓ 미국·EU의 스테이블코인 규제 확립 → 한국 모델 참고
          </p>
          <p className="mt-2">
            <strong>부정적 요인</strong>:<br />
            ✗ 한은 CBDC 우선주의<br />
            ✗ 은행의 crypto 불신<br />
            ✗ Terra 사태(Do Kwon)의 여파<br />
            ✗ 외환 거래 통제 충돌
          </p>
          <p className="mt-2">
            GIWA가 성공하려면 <strong>규제와의 협력</strong> 필수 — 기술적 혁신만으로는 부족<br />
            한국 법률·정책 환경에 깊은 이해를 가진 팀이 결정적 역할
          </p>
        </div>

      </div>
    </section>
  );
}
