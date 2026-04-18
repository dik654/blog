import ThreeLinesViz from './viz/ThreeLinesViz';
import DefenseLineFlowViz from './viz/DefenseLineFlowViz';
import ReportingChainViz from './viz/ReportingChainViz';

export default function ThreeLines() {
  return (
    <section id="three-lines" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">3선 방어 모델과 조직</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <ThreeLinesViz />

        <p>
          3선 방어 모델(Three Lines of Defense)은 AML/CFT 조직 체계의 표준 프레임워크.<br />
          "위험을 관리하는 사람"과 "관리가 적절한지 검증하는 사람"을 분리하여
          내부 통제의 독립성과 견제 기능을 확보하는 구조다.
        </p>

        <p>
          원래 은행업에서 발전한 모델이지만,
          FATF 권고사항 R.18(내부 통제 및 해외 지점)과 R.26(금융기관 감독)이
          이 구조를 기반으로 설계되어 있어 VASP에도 동일하게 적용된다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">1선 — 현업(First Line: Business Operations)</h3>
        <p>
          고객과 직접 접촉하는 부서.<br />
          영업, 고객지원(CS), 온보딩 팀 등이 해당하며,
          일상적인 위험관리와 CDD 실행을 담당한다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">역할</th>
                <th className="text-left px-3 py-2 border-b border-border">구체 업무</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">CDD 실행</td>
                <td className="px-3 py-1.5 border-b border-border/30">신규 고객 신원확인·검증, 기존 고객 정보 갱신</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">거래 초기 검토</td>
                <td className="px-3 py-1.5 border-b border-border/30">고객 요청 거래의 합리성 1차 판단</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">이상 징후 보고</td>
                <td className="px-3 py-1.5 border-b border-border/30">의심스러운 행동 패턴 발견 시 2선에 내부 보고</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">교육 이수</td>
                <td className="px-3 py-1.5">AML/CFT 정기 교육 참여, 최신 유형 학습</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          1선의 핵심 역량은 "위험 감지 능력".<br />
          시스템이 탐지하지 못하는 미묘한 이상 징후 — 고객의 비협조적 태도,
          반복적인 소액 분할 거래, 설명과 다른 거래 패턴 — 를 감지하는 것은
          현장 경험이 있는 1선 직원의 몫이다.
        </p>

        <p>
          1선의 한계도 명확하다.<br />
          영업 실적과 AML 통제 사이에 이해 충돌이 발생할 수 있다.<br />
          고위험 고객의 거래를 거절하면 매출이 줄어들기 때문에
          1선 단독으로 의사결정을 하면 위험을 과소평가할 유인이 존재한다.<br />
          이 이해 충돌을 견제하는 것이 2선의 역할.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">2선 — 준법감시/위험관리(Second Line: Compliance & Risk)</h3>
        <p>
          AML/CFT 정책을 수립하고, 1선의 이행 상태를 모니터링하며,
          위반 사항을 조사하는 부서.<br />
          CCO(내부통제책임자), 준법감시팀, AML팀, FDS(이상거래탐지시스템) 운영팀이 해당.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">역할</th>
                <th className="text-left px-3 py-2 border-b border-border">구체 업무</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">정책 수립</td>
                <td className="px-3 py-1.5 border-b border-border/30">AML/CFT 내부 규정, CDD 절차서, 위험평가 방법론 작성</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">모니터링</td>
                <td className="px-3 py-1.5 border-b border-border/30">FDS 알림 검토, 거래 패턴 분석, 제재 리스트 스크리닝</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">조사</td>
                <td className="px-3 py-1.5 border-b border-border/30">의심거래 심층 분석, 고객 면담, 증거 수집</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">보고</td>
                <td className="px-3 py-1.5 border-b border-border/30">STR(의심거래보고) 작성·FIU 제출, 경영진 보고</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">교육</td>
                <td className="px-3 py-1.5">1선 대상 AML/CFT 교육 기획·실시</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          2선의 핵심 가치는 "독립적 시각".<br />
          1선이 수행한 CDD의 품질을 사후적으로 검토(quality assurance)하고,
          미흡한 부분을 보완하도록 시정 조치를 요구한다.<br />
          2선은 영업 실적에 대한 책임이 없으므로 이해 충돌 없이 판단할 수 있다.
        </p>

        <p>
          실무에서 2선이 가장 많이 수행하는 업무는 FDS 알림 검토.<br />
          시스템이 자동 생성한 알림(alert)을 분석가가 검토하여
          진짜 의심거래인지, 오탐(false positive)인지 판단하는 과정이다.<br />
          오탐률을 낮추기 위한 FDS 규칙 튜닝(rule tuning)도 2선의 책임.
        </p>

        <DefenseLineFlowViz />

        <h3 className="text-xl font-semibold mt-8 mb-3">3선 — 내부감사(Third Line: Internal Audit)</h3>
        <p>
          1선과 2선의 AML/CFT 체계가 적절히 작동하고 있는지를
          독립적으로 평가하는 감사 기능.<br />
          내부감사팀 또는 외부 감사 법인이 수행한다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">역할</th>
                <th className="text-left px-3 py-2 border-b border-border">구체 업무</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">체계 적정성 평가</td>
                <td className="px-3 py-1.5 border-b border-border/30">AML/CFT 정책, 절차, 시스템의 설계 적정성 검토</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">운영 효과성 평가</td>
                <td className="px-3 py-1.5 border-b border-border/30">정책이 실제로 이행되고 있는지 샘플 검사</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">개선 권고</td>
                <td className="px-3 py-1.5 border-b border-border/30">미흡 사항에 대한 개선안 제시 및 이행 추적</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">이사회 보고</td>
                <td className="px-3 py-1.5">감사 결과를 이사회(또는 감사위원회)에 직접 보고</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          3선의 핵심 원칙은 "독립성".<br />
          감사 대상(1선, 2선)으로부터 인사·예산 영향을 받지 않아야 하며,
          보고 라인은 이사회 또는 감사위원회로 직통이어야 한다.<br />
          CCO나 CEO에게만 보고하면 경영진의 위법 행위를 견제할 수 없으므로
          독립적 보고 라인은 3선 방어의 생명선이다.
        </p>

        <p>
          소규모 VASP의 경우 전담 내부감사 인력을 확보하기 어려울 수 있으며,
          이때는 외부 감사 법인에 위탁하는 것이 일반적.<br />
          다만, 감사 법인이 VASP의 다른 업무(회계 감사, 컨설팅)를 동시에 수행하면
          독립성이 훼손될 수 있으므로 이해 충돌 관리가 필요하다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">ML/TF 위험관리 위원회</h3>
        <p>
          3선 방어를 총괄하는 최상위 의사결정 기구.<br />
          "위원회"라는 별도 기구를 설치하는 이유는
          AML/CFT가 단일 부서의 업무가 아니라 전사적(enterprise-wide) 과제이기 때문.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">항목</th>
                <th className="text-left px-3 py-2 border-b border-border">내용</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">구성원</td>
                <td className="px-3 py-1.5 border-b border-border/30">CEO(또는 대리인), CCO, CISO, 법무담당, 영업부서장, 내부감사 옵저버</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">회의 주기</td>
                <td className="px-3 py-1.5 border-b border-border/30">정기: 분기 1회 / 수시: 중대 사고, 법규 변경 시</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">의결 사항</td>
                <td className="px-3 py-1.5 border-b border-border/30">위험평가 결과 승인, 위험 수용 수준(risk appetite) 결정, 정책 개정, 예산 배분</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">보고 사항</td>
                <td className="px-3 py-1.5">STR 건수 및 추이, FDS 탐지율, CDD 이행률, 교육 이수율, 감사 지적사항 현황</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">보고 체계</h3>
        <p>
          3선 방어 모델의 보고 체계는 "위로 올라가되, 중간을 건너뛰지 않는" 구조.
        </p>

        <div className="not-prose my-4 p-3 bg-muted/20 rounded border border-border/30 text-sm">
          <p className="font-medium mb-2">보고 흐름</p>
          <p className="mb-1"><strong>1선 → 2선:</strong> 이상 징후 발견 시 내부 보고(일상 보고)</p>
          <p className="mb-1"><strong>2선 → 위원회:</strong> STR 현황, 위험평가 결과, 정책 개정 안(분기 보고)</p>
          <p className="mb-1"><strong>3선 → 이사회:</strong> 감사 결과, 1-2선 효과성 평가(연 1회 + 수시)</p>
          <p><strong>위원회 → 이사회:</strong> 전사 위험 현황, 중대 의사결정 사항(분기 보고)</p>
        </div>

        <p>
          3선(내부감사)이 이사회에 직접 보고하는 것은 2선(CCO) 자체의 부적절한 행위를
          견제하기 위한 설계.<br />
          만약 CCO가 특정 고위험 거래를 은폐하더라도
          내부감사가 이를 발견하여 이사회에 직접 보고할 수 있는 구조가 유지되어야 한다.
        </p>

        <ReportingChainViz />

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 소규모 VASP의 현실적 적용</strong><br />
          직원 수가 30명 미만인 소규모 VASP에서 3선을 완전히 분리하기는 어렵다.<br />
          FIU 가이드라인은 소규모 사업자에 대해 "기능적 분리"를 허용한다 —
          동일 인물이 1선과 2선을 겸하더라도 감사(3선)만큼은 반드시 독립적이어야 한다는 원칙.<br />
          최소한 연 1회 외부 감사를 통해 3선 기능을 확보하고,
          감사 결과를 대표이사가 아닌 이사회(또는 주주)에게 보고하는 체계가 필요하다.
        </p>

      </div>
    </section>
  );
}
