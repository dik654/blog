import OverviewViz from './viz/OverviewViz';
import CddTimingViz from './viz/CddTimingViz';
import CddLegalFrameworkViz from './viz/CddLegalFrameworkViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">고객확인의무의 법적 근거</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <p>
          CDD(Customer Due Diligence, 고객확인의무)는 금융회사가 고객의 신원과 거래 목적을 확인하여
          자금세탁 및 테러자금조달에 악용되는 것을 막는 핵심 절차.<br />
          "이 돈이 어디서 왔고, 누구에게 가는가"를 파악하는 것이 본질이다.
        </p>

        <OverviewViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">특금법 제5조의2 — 고객확인의무 조문</h3>
        <p>
          특정금융거래정보의 보고 및 이용 등에 관한 법률(이하 특금법) 제5조의2는
          금융회사등의 고객 확인의무를 규정하는 핵심 조항.<br />
          "금융회사등은 금융거래등을 이용한 자금세탁행위 및 공중협박자금조달행위를 방지하기 위하여
          합당한 주의로서 다음 각 호의 조치를 하여야 한다"라고 명시한다.
        </p>

        <p>
          여기서 "금융회사등"에는 은행, 증권사뿐 아니라 가상자산사업자(VASP)도 포함된다.<br />
          2021년 3월 특금법 개정으로 VASP가 명시적으로 적용 대상에 추가되었고,
          이후 모든 가상자산사업자는 금융회사와 동일한 수준의 고객확인의무를 이행해야 한다.
        </p>

        <CddLegalFrameworkViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">CDD의 목적</h3>
        <p>
          자금세탁(Money Laundering)은 범죄 수익의 출처를 숨기는 행위.<br />
          테러자금조달(Terrorist Financing)은 테러 활동에 자금을 공급하는 행위.<br />
          CDD는 이 두 가지를 사전에 차단하기 위한 1차 방어선 역할을 한다.
        </p>

        <p>
          가상자산은 전통 금융과 비교해 이체 속도가 빠르고, 가명성(pseudonymity)이 존재하며,
          국경 간 이동이 즉각적이라는 특성 때문에 세탁 위험이 높다.<br />
          따라서 VASP의 CDD는 은행보다 더 엄격한 실무 기준이 적용되는 추세.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">고객확인 이행 시점 4가지</h3>
        <p>
          특금법 제5조의2에 따라 CDD를 수행해야 하는 시점은 명확하게 정해져 있다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">시점</th>
                <th className="text-left px-3 py-2 border-b border-border">설명</th>
                <th className="text-left px-3 py-2 border-b border-border">예시</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">1. 계좌 신규 개설</td>
                <td className="px-3 py-1.5 border-b border-border/30">고객이 새 계정을 만들 때</td>
                <td className="px-3 py-1.5 border-b border-border/30">거래소 회원가입, 법인 계정 생성</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">2. 일회성 고액 거래</td>
                <td className="px-3 py-1.5 border-b border-border/30">대통령령이 정하는 금액 이상의 단발 거래</td>
                <td className="px-3 py-1.5 border-b border-border/30">기존 고객이 아닌 자의 대규모 환전</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">3. 자금세탁 의심</td>
                <td className="px-3 py-1.5 border-b border-border/30">고객이 실제 소유자가 아닌 것으로 의심될 때</td>
                <td className="px-3 py-1.5 border-b border-border/30">차명 거래 징후, 대포 계좌 의심</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">4. 기존 정보 의심</td>
                <td className="px-3 py-1.5">이미 확보한 고객 정보의 진위가 의심될 때</td>
                <td className="px-3 py-1.5">주소 불일치, 신분증 위변조 의심</td>
              </tr>
            </tbody>
          </table>
        </div>

        <CddTimingViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">CDD 3요소</h3>
        <p>
          CDD는 단순히 "이름과 주민번호를 받는 것"이 아니다.<br />
          3가지 요소가 모두 충족되어야 적법한 CDD로 인정된다.
        </p>

        <p>
          <strong>1. 신원확인(Identification)</strong><br />
          고객이 "누구인지" 정보를 수집하는 단계.<br />
          개인: 성명, 주민등록번호, 주소, 연락처, 직업.<br />
          법인: 법인명, 사업자등록번호, 본점 소재지, 대표자 정보, 실제소유자.
        </p>

        <p>
          <strong>2. 신원검증(Verification)</strong><br />
          수집한 정보가 "진짜인지" 확인하는 단계.<br />
          신분증 원본 대조, 정부 DB 조회, 안면인식 등 독립적 출처(independent source)를 통해 검증.<br />
          정보를 수집만 하고 검증하지 않으면 CDD를 이행한 것으로 인정되지 않는다.
        </p>

        <p>
          <strong>3. 거래목적 확인(Purpose of Transaction)</strong><br />
          "왜 이 거래를 하는지" 파악하는 단계.<br />
          투자, 송금, 결제 등 거래 목적을 확인하고, 향후 거래 패턴의 비교 기준(baseline)으로 활용.<br />
          거래 목적과 실제 이용 패턴이 불일치하면 의심거래 보고(STR) 검토 대상이 된다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">미이행 시 제재</h3>
        <p>
          CDD를 이행하지 않거나 부실하게 수행하면 다단계 제재가 적용된다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">제재 유형</th>
                <th className="text-left px-3 py-2 border-b border-border">내용</th>
                <th className="text-left px-3 py-2 border-b border-border">근거</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">과태료</td>
                <td className="px-3 py-1.5 border-b border-border/30">최대 3천만 원 (위반 건별)</td>
                <td className="px-3 py-1.5 border-b border-border/30">특금법 제17조</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">영업정지</td>
                <td className="px-3 py-1.5 border-b border-border/30">6개월 이내 업무 일부 또는 전부 정지</td>
                <td className="px-3 py-1.5 border-b border-border/30">특금법 제13조</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">신고 취소</td>
                <td className="px-3 py-1.5 border-b border-border/30">VASP 신고수리 자체를 취소 → 사실상 폐업</td>
                <td className="px-3 py-1.5 border-b border-border/30">특금법 제7조의3</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">형사처벌</td>
                <td className="px-3 py-1.5">5년 이하 징역 또는 5천만 원 이하 벌금</td>
                <td className="px-3 py-1.5">특금법 제17조의2</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 가상자산이용자보호법 추가 제재</strong><br />
          2024년 7월 시행된 가상자산이용자보호법은 불공정거래(시세조종, 미공개정보 이용)에 대해
          부당이득의 1~1.5배 과징금을 부과할 수 있는 별도 제재 체계를 두고 있다.<br />
          CDD 미이행 자체가 불공정거래는 아니지만, CDD 부실 → 불법 자금 유입 → 시세조종 연루 시
          양쪽 법률의 제재를 동시에 받게 된다.
        </p>

        <p>
          FATF 권고사항 R.10이 CDD의 국제 기준을 제시하고, 한국 특금법 제5조의2가 이를 국내법으로 구현한 구조.<br />
          FATF 상호평가에서 CDD 이행 수준은 핵심 평가 항목이며,
          불이행 판정을 받으면 해당 국가 전체의 국제 금융거래에 제약이 생긴다.<br />
          VASP 차원의 CDD 부실이 국가 리스크로 확대될 수 있다는 점에서
          규제 당국의 감독 강도는 계속 높아지고 있다.
        </p>

      </div>
    </section>
  );
}
