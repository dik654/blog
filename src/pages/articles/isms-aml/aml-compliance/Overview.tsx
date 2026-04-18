import OverviewViz from './viz/OverviewViz';
import FatfFlowViz from './viz/FatfFlowViz';
import VaspObligationsViz from './viz/VaspObligationsViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">AML/CFT 컴플라이언스란</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <OverviewViz />

        <p>
          가상자산 거래소를 운영하려면 "돈세탁을 막을 수 있는 체계"를 갖춰야 한다.<br />
          이 체계를 총칭하는 용어가 AML/CFT 컴플라이언스.<br />
          AML(Anti-Money Laundering)은 자금세탁방지, CFT(Combating the Financing of Terrorism)는 공중협박자금조달 금지를 뜻한다.
        </p>

        <p>
          자금세탁은 범죄 수익의 출처를 숨기는 행위.<br />
          마약 거래, 횡령, 사기 등으로 얻은 돈을 "깨끗한 돈"처럼 보이게 만드는 과정이 핵심.<br />
          가상자산은 이체가 빠르고, 익명성이 높으며, 국경을 넘기 쉬워 세탁 수단으로 악용될 위험이 크다.<br />
          CFT는 자금세탁과 구조가 유사하지만 목적이 다르다 — 테러 활동에 자금을 공급하는 행위를 차단하는 것.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">법적 근거</h3>
        <p>
          한국에서 VASP(Virtual Asset Service Provider, 가상자산사업자)의 AML/CFT 의무를 규정하는 법률은 두 가지.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">법률</th>
                <th className="text-left px-3 py-2 border-b border-border">핵심 내용</th>
                <th className="text-left px-3 py-2 border-b border-border">적용 대상</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">특정금융정보법(특금법)</td>
                <td className="px-3 py-1.5 border-b border-border/30">VASP 신고 의무, CDD, STR, 기록 보관</td>
                <td className="px-3 py-1.5 border-b border-border/30">금융회사 + 가상자산사업자</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">가상자산이용자보호법</td>
                <td className="px-3 py-1.5">이용자 자산 보호, 불공정거래 금지, 시세조종 제재</td>
                <td className="px-3 py-1.5">가상자산사업자</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          특금법은 자금세탁 방지에 초점을 맞추고, 가상자산이용자보호법은 투자자 보호와 시장 건전성에 초점을 맞춘다.<br />
          두 법률이 겹치는 영역도 있지만, VASP는 양쪽 모두 준수해야 한다.
        </p>

        <FatfFlowViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">FATF — 국제 기준의 출발점</h3>
        <p>
          FATF(Financial Action Task Force)는 자금세탁·테러자금 방지를 위한 국제 기준 설정 기구.<br />
          1989년 G7 정상회의에서 설립되었고, 현재 39개 회원국이 참여한다.<br />
          FATF가 제시하는 40개 권고사항(Recommendations)이 각국 AML/CFT 법률의 뼈대 역할을 한다.
        </p>

        <p>
          특히 2019년 FATF는 "권고사항 15"를 개정해 가상자산과 VASP를 명시적으로 포함시켰다.<br />
          이 개정이 한국 특금법 개정의 직접적 계기 — FATF 회원국은 권고사항을 국내법에 반영할 의무가 있고,
          이행하지 않으면 상호평가(Mutual Evaluation)에서 불이행 판정을 받아 국제 금융 거래에 불이익을 받는다.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} Travel Rule도 FATF 기준</strong><br />
          VASP 간 가상자산 이전 시 송·수신인 정보를 함께 전달해야 하는 Travel Rule(권고사항 16)도 FATF에서 유래.<br />
          한국에서는 특금법 시행령으로 100만 원 이상 이전 시 적용된다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">VASP의 핵심 의무 5가지</h3>

        <p>
          <strong>1. FIU 신고</strong><br />
          영업을 시작하기 전에 금융정보분석원(FIU, Financial Intelligence Unit)에 가상자산사업자 신고를 완료해야 한다.<br />
          신고 요건: ISMS 인증 획득, 실명계좌 확보, 대표자·임원 결격사유 없음.<br />
          신고 없이 영업하면 5년 이하 징역 또는 5천만 원 이하 벌금.
        </p>

        <p>
          <strong>2. 고객확인(CDD)</strong><br />
          CDD(Customer Due Diligence)는 "이 고객이 누구인지, 왜 거래하는지"를 확인하는 절차.<br />
          계정 개설 시점부터 적용되며, 고위험 고객에게는 강화된 확인(EDD)을 수행한다.<br />
          다음 섹션에서 상세히 다룬다.
        </p>

        <p>
          <strong>3. 의심거래 보고(STR)</strong><br />
          STR(Suspicious Transaction Report)은 자금세탁이 의심되는 거래를 FIU에 보고하는 의무.<br />
          보고 기한은 의심 거래 인지 후 3영업일 이내.<br />
          보고 사실을 고객에게 알리면("tipping-off") 형사처벌 대상.
        </p>

        <p>
          <strong>4. 기록 보관</strong><br />
          CDD 자료, 거래 기록, STR 보고 내역을 최소 5년간 보관해야 한다.<br />
          5년의 기산점은 거래 관계 종료일 또는 거래일 중 늦은 날.<br />
          수사기관·FIU 요청 시 즉시 제공할 수 있는 형태로 보관해야 한다.
        </p>

        <p>
          <strong>5. 내부 통제</strong><br />
          AML/CFT 의무를 실행하기 위한 조직·절차·시스템을 갖춰야 한다.<br />
          문서화된 정책, 정기 교육, 독립적인 감사가 핵심 요소.
        </p>

        <VaspObligationsViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">조직 체계</h3>
        <p>
          VASP의 AML/CFT 조직은 다음과 같은 역할로 구성된다.<br />
          규모에 따라 한 사람이 여러 역할을 겸할 수 있지만, 감사 기능은 반드시 독립적이어야 한다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">역할</th>
                <th className="text-left px-3 py-2 border-b border-border">책임</th>
                <th className="text-left px-3 py-2 border-b border-border">근거</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">CCO(내부통제책임자)</td>
                <td className="px-3 py-1.5 border-b border-border/30">AML/CFT 정책 수립·이행 총괄, 이사회 보고</td>
                <td className="px-3 py-1.5 border-b border-border/30">특금법 시행령</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">CISO(정보보호 최고책임자)</td>
                <td className="px-3 py-1.5 border-b border-border/30">정보보호 정책, FDS 운영, 기술적 보안 총괄</td>
                <td className="px-3 py-1.5 border-b border-border/30">정보통신망법, ISMS-P</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">AML 담당자</td>
                <td className="px-3 py-1.5 border-b border-border/30">CDD 실행, STR 작성·제출, 거래 모니터링</td>
                <td className="px-3 py-1.5 border-b border-border/30">내부규정</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">준법감시인</td>
                <td className="px-3 py-1.5 border-b border-border/30">법규 준수 감시, 위반 사항 보고, 시정 권고</td>
                <td className="px-3 py-1.5 border-b border-border/30">가상자산이용자보호법</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">독립 감사</td>
                <td className="px-3 py-1.5">AML/CFT 체계 적정성 평가, 개선 권고</td>
                <td className="px-3 py-1.5">FATF 권고사항 18</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          이 구조가 왜 필요한가 — 자금세탁 방지는 "한 부서의 업무"가 아니라 "전사적 통제".<br />
          고객을 만나는 1선(영업/CS), 정책을 설계하는 2선(준법감시/AML팀), 독립적으로 검증하는 3선(감사)이 분리되어야
          내부 공모나 단일 장애점을 방지할 수 있다.<br />
          이 3선 방어 모델은 RBA 섹션에서 상세히 다룬다.
        </p>

        <p className="text-sm border-l-2 border-blue-500/50 pl-3 mt-4">
          <strong>{'💡'} VASP 특유의 난제</strong><br />
          전통 금융과 달리 가상자산은 24/7 거래, 실시간 국경 간 이전, 온체인 믹싱이 가능하다.<br />
          은행의 AML 체계를 그대로 가져오면 부족 — 블록체인 분석(on-chain analytics), 지갑 클러스터링,
          DeFi 프로토콜 추적 같은 기술적 역량이 추가로 필요하다.
        </p>

      </div>
    </section>
  );
}
