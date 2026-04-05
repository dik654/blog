export default function EnhancedDueDiligence() {
  return (
    <section id="enhanced-due-diligence" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">강화된 고객확인 (EDD)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <p>
          EDD(Enhanced Due Diligence, 강화된 고객확인)는 고위험 고객에 대해
          일반 CDD보다 더 깊은 수준의 확인을 수행하는 절차.<br />
          "위험이 높으면 확인도 강화한다"는 위험기반 접근법(RBA)의 핵심 원리가
          CDD 영역에서 구체화된 형태다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">EDD 대상</h3>
        <p>
          FATF 권고사항 R.10, R.12, R.19와 특금법 시행령이 정하는 EDD 의무 대상은 크게 세 범주.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">범주</th>
                <th className="text-left px-3 py-2 border-b border-border">대상</th>
                <th className="text-left px-3 py-2 border-b border-border">근거</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">PEP</td>
                <td className="px-3 py-1.5 border-b border-border/30">정치적 주요인물 + 가족 + 측근</td>
                <td className="px-3 py-1.5 border-b border-border/30">FATF R.12</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">고위험 국가</td>
                <td className="px-3 py-1.5 border-b border-border/30">FATF가 지정한 고위험 국가(이란, 북한 등)의 거주자·국적자</td>
                <td className="px-3 py-1.5 border-b border-border/30">FATF R.19</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">고위험 거래</td>
                <td className="px-3 py-1.5">비정상적 고액 거래, 복잡한 구조의 거래, 경제적 합리성 부족 거래</td>
                <td className="px-3 py-1.5">특금법 제5조의2 제2호</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">PEP(Politically Exposed Person) 정의</h3>
        <p>
          PEP(정치적 주요인물)는 정부 또는 국제기구에서 주요한 공적 기능을 수행하거나 수행한 자.<br />
          부패 범죄, 뇌물, 탈세, 공금 횡령 등에 노출될 가능성이 높아
          FATF가 별도의 강화 확인 대상으로 지정한 범주다.
        </p>

        <p>
          FATF 권고사항 R.12가 정의하는 PEP의 범위는 다음과 같다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">PEP 유형</th>
                <th className="text-left px-3 py-2 border-b border-border">해당자</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">국가원수·정부수반</td>
                <td className="px-3 py-1.5 border-b border-border/30">대통령, 총리, 왕실 구성원</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">고위 공무원</td>
                <td className="px-3 py-1.5 border-b border-border/30">장관, 차관, 중앙부처·지방자치단체 고위직</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">입법부·사법부</td>
                <td className="px-3 py-1.5 border-b border-border/30">국회의원, 대법관, 헌법재판관</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">군·경·정보기관</td>
                <td className="px-3 py-1.5 border-b border-border/30">군 장성, 경찰 고위간부, 정보기관 수장</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">국영기업 임원</td>
                <td className="px-3 py-1.5 border-b border-border/30">공기업 CEO, 이사</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">국제기구 고위직</td>
                <td className="px-3 py-1.5 border-b border-border/30">UN 사무차장 이상, IMF·World Bank 이사</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">가족·측근</td>
                <td className="px-3 py-1.5">배우자, 자녀, 부모, 형제자매 + 가까운 사업 파트너</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          2003년에는 외국 PEP(Foreign PEP)만 EDD 대상이었으나,
          2012년 FATF 新권고 개정으로 내국인 PEP(Domestic PEP)도 포함되었다.<br />
          한국에서도 국내 고위 공직자가 VASP에 계정을 개설하면 EDD를 적용해야 한다.
        </p>

        <p>
          PEP의 직위가 종료된 후에도 일정 기간(통상 12~24개월) EDD를 유지한다.<br />
          퇴직 직후 축적한 부정 자금을 세탁할 가능성이 있기 때문.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">EDD 절차</h3>
        <p>
          EDD는 일반 CDD의 모든 항목을 포함하면서 다음 추가 조치를 요구한다.
        </p>

        <p>
          <strong>1. 자금 출처 소명(Source of Funds)</strong><br />
          고객이 거래에 사용하는 자금의 출처를 구체적으로 확인.<br />
          급여 명세서, 사업 소득 증빙, 부동산 매각 계약서, 상속 문서 등
          객관적인 증빙 자료를 요구한다.<br />
          "투자 수익"이라는 구두 설명만으로는 부족 — 수익을 발생시킨 투자의 증빙까지 추적한다.
        </p>

        <p>
          <strong>2. 자산 출처 소명(Source of Wealth)</strong><br />
          자금 출처가 "이번 거래의 돈이 어디서 왔나"라면,
          자산 출처는 "이 고객의 전체 재산이 어떻게 축적되었나"를 확인하는 더 넓은 범위의 검토.<br />
          PEP의 경우 공직 보수만으로 설명되지 않는 자산이 발견되면 의심거래 보고 대상이 된다.
        </p>

        <p>
          <strong>3. 거래 목적 심층 확인</strong><br />
          일반 CDD에서는 "투자" "송금" 수준의 거래 목적으로 충분하지만,
          EDD에서는 "왜 이 시점에, 이 규모로, 이 상대방과 거래하는가"까지 확인.<br />
          거래의 경제적 합리성(economic rationale)이 핵심 판단 기준이다.
        </p>

        <p>
          <strong>4. 경영진 승인(Senior Management Approval)</strong><br />
          EDD 대상 고객과의 거래 개시 또는 지속은 경영진(CCO 또는 그 이상)의 사전 승인을 받아야 한다.<br />
          담당자 단독 판단이 아니라 조직적 의사결정을 거치게 함으로써
          고위험 거래의 수용 여부에 대한 책임을 명확히 한다.
        </p>

        <p>
          <strong>5. 강화된 모니터링</strong><br />
          EDD 고객의 거래는 일반 고객보다 낮은 임계값(threshold)으로 모니터링된다.<br />
          예: 일반 고객은 일 5천만 원 이상 거래 시 알림이 발생하지만,
          EDD 고객은 일 1천만 원 이상으로 기준을 낮추는 식.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">간소화 CDD (Simplified Due Diligence)</h3>
        <p>
          모든 고객에게 동일한 수준의 CDD를 적용하면 비효율적이다.<br />
          FATF 권고사항 R.10은 저위험 고객에 대해 간소화된 CDD(SDD)를 허용한다.<br />
          단, SDD는 CDD를 "생략"하는 것이 아니라 "일부 절차를 간소화"하는 것.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">저위험 고객 유형</th>
                <th className="text-left px-3 py-2 border-b border-border">간소화 가능 항목</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">정부 기관</td>
                <td className="px-3 py-1.5 border-b border-border/30">실제소유자 확인 생략 가능</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">상장 법인</td>
                <td className="px-3 py-1.5 border-b border-border/30">공시 정보로 실제소유자 대체 가능</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">규제 금융기관</td>
                <td className="px-3 py-1.5">이미 감독을 받고 있으므로 일부 검증 축소 가능</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          간소화 CDD를 적용하더라도 의심스러운 거래가 감지되면
          즉시 일반 CDD 또는 EDD로 전환해야 한다.<br />
          "저위험으로 분류했으니 끝"이 아니라 지속적 모니터링은 동일하게 적용된다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">지속적 고객확인 (Ongoing CDD)</h3>
        <p>
          CDD는 계정 개설 시점에만 수행하는 일회성 절차가 아니다.<br />
          FATF 권고사항 R.10과 특금법은 기존 고객에 대한 지속적 확인을 요구한다.
        </p>

        <p>
          <strong>정기 갱신</strong> — 고객 정보를 주기적으로 업데이트.<br />
          고위험 고객은 연 1회, 중위험은 2년 1회, 저위험은 3년 1회가 일반적 기준.<br />
          주소 변경, 직업 변경, 법인 구조 변경 등을 반영해야 하며,
          갱신을 거부하는 고객은 거래 제한 또는 계정 정지 대상이 된다.
        </p>

        <p>
          <strong>위험등급 재평가</strong> — 거래 패턴, 거래 상대방, 이상거래 탐지 결과 등을 종합하여
          고객의 위험등급을 재산정.<br />
          저위험이었던 고객이 고위험 국가와 빈번하게 거래하기 시작하면 등급이 상향된다.
        </p>

        <p>
          <strong>트리거 기반 갱신</strong> — 정기 갱신과 별개로,
          특정 이벤트(고액 거래, 제재 리스트 변경, 부정적 언론 보도)가 발생하면
          즉시 CDD를 재수행하는 방식.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} CDD 거부 시 대응</strong><br />
          고객이 CDD 정보 제공을 거부하면 금융회사는 해당 거래를 거절해야 한다.<br />
          이미 거래 관계가 성립된 상태에서 갱신을 거부하면 기존 거래 관계를 종료(off-boarding)해야 하며,
          거부 사실 자체가 의심거래 보고의 사유가 될 수 있다.
        </p>

      </div>
    </section>
  );
}
