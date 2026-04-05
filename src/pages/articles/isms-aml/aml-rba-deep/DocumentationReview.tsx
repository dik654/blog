export default function DocumentationReview() {
  return (
    <section id="documentation-review" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">문서화와 정기 점검</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <p>
          AML/CFT 체계가 아무리 잘 설계되어 있어도 문서화되지 않으면 증명할 수 없다.<br />
          규제 당국의 검사, 외부 감사, FATF 상호평가 모두 "문서"를 기반으로
          이행 여부를 판단한다.<br />
          문서화는 체계를 만드는 것만큼이나 중요한 컴플라이언스의 핵심 요소다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-3">문서화 대상</h3>
        <p>
          AML/CFT 관련 문서화 대상은 크게 5가지 범주로 나뉜다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">범주</th>
                <th className="text-left px-3 py-2 border-b border-border">문서 유형</th>
                <th className="text-left px-3 py-2 border-b border-border">상세 내용</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">위험평가</td>
                <td className="px-3 py-1.5 border-b border-border/30">위험평가 계획서, 수행 결과 보고서</td>
                <td className="px-3 py-1.5 border-b border-border/30">평가 범위, 방법론, 위험 매트릭스, 잔여위험, 개선 계획</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">정책·절차</td>
                <td className="px-3 py-1.5 border-b border-border/30">AML/CFT 내부 규정, CDD 절차서, STR 매뉴얼</td>
                <td className="px-3 py-1.5 border-b border-border/30">버전 관리, 승인 이력, 개정 사유</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">CDD 기록</td>
                <td className="px-3 py-1.5 border-b border-border/30">고객 신원확인 자료, 검증 결과, 위험등급 판정</td>
                <td className="px-3 py-1.5 border-b border-border/30">신분증 사본, eKYC 결과, EDD 보고서</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">거래·보고</td>
                <td className="px-3 py-1.5 border-b border-border/30">거래 기록, STR 보고 내역, CTR</td>
                <td className="px-3 py-1.5 border-b border-border/30">거래 일시, 금액, 상대방, 보고 일자, 접수 번호</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">교육·감사</td>
                <td className="px-3 py-1.5">교육 기록, 감사 보고서, 개선 조치 이력</td>
                <td className="px-3 py-1.5">교육 일자, 참석자, 내용, 감사 지적사항, 조치 결과</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">보관 기간 — 5년 이상</h3>
        <p>
          특금법 제5조의3은 CDD 자료와 거래 기록의 보관 기간을 5년으로 규정한다.<br />
          기산점은 "거래 관계 종료일" 또는 "일회성 거래의 거래일" 중 늦은 날.
        </p>

        <p>
          고객이 2024년에 계정을 개설하고 2027년에 탈퇴하면
          해당 고객의 모든 CDD 자료와 거래 기록은 2032년까지 보관해야 한다.<br />
          5년은 최소 기간이며, 수사 진행 중인 경우에는 수사 종결 시까지 보관 의무가 연장된다.
        </p>

        <p>
          보관 형태에 대해서도 요건이 있다.<br />
          수사기관이나 FIU의 요청 시 "즉시 제공할 수 있는 형태"여야 하며,
          이는 데이터가 검색 가능하고, 무결성이 보장되며,
          물리적 또는 전자적으로 추출 가능한 상태를 의미한다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">자료 유형</th>
                <th className="text-left px-3 py-2 border-b border-border">보관 기간</th>
                <th className="text-left px-3 py-2 border-b border-border">기산점</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">CDD 자료</td>
                <td className="px-3 py-1.5 border-b border-border/30">5년 이상</td>
                <td className="px-3 py-1.5 border-b border-border/30">거래 관계 종료일</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">거래 기록</td>
                <td className="px-3 py-1.5 border-b border-border/30">5년 이상</td>
                <td className="px-3 py-1.5 border-b border-border/30">거래일 또는 거래 관계 종료일 중 늦은 날</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">STR 보고</td>
                <td className="px-3 py-1.5 border-b border-border/30">5년 이상</td>
                <td className="px-3 py-1.5 border-b border-border/30">보고일</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">Travel Rule 정보</td>
                <td className="px-3 py-1.5">5년 이상</td>
                <td className="px-3 py-1.5">거래 관계 종료일</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">분기별 의무이행 점검</h3>
        <p>
          보고책임자(CCO 또는 그 대리인)는 분기마다 AML/CFT 의무 이행 현황을 점검해야 한다.<br />
          이 점검은 3선 방어의 2선 기능에 해당하며,
          내부 감사(3선)와는 별개의 자체 점검이다.
        </p>

        <p>
          분기 점검의 주요 항목은 다음과 같다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">점검 항목</th>
                <th className="text-left px-3 py-2 border-b border-border">점검 내용</th>
                <th className="text-left px-3 py-2 border-b border-border">판단 기준</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">CDD 이행률</td>
                <td className="px-3 py-1.5 border-b border-border/30">신규 고객 중 CDD 완료 비율</td>
                <td className="px-3 py-1.5 border-b border-border/30">100% 목표 (미완료 건은 사유 기록)</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">EDD 적시성</td>
                <td className="px-3 py-1.5 border-b border-border/30">EDD 대상 식별 후 완료까지 소요 시간</td>
                <td className="px-3 py-1.5 border-b border-border/30">내부 규정 기한 준수 여부</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">STR 보고 적시성</td>
                <td className="px-3 py-1.5 border-b border-border/30">의심거래 인지 후 FIU 보고까지 소요 일수</td>
                <td className="px-3 py-1.5 border-b border-border/30">3영업일 이내 (법정 기한)</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">FDS 오탐률</td>
                <td className="px-3 py-1.5 border-b border-border/30">자동 탐지 알림 중 실제 의심거래 비율</td>
                <td className="px-3 py-1.5 border-b border-border/30">오탐률 추이 개선 여부</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">교육 이수율</td>
                <td className="px-3 py-1.5">전 직원 대상 AML/CFT 교육 완료율</td>
                <td className="px-3 py-1.5">연 1회 이상 100% 이수</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">연 1회 외부 감사</h3>
        <p>
          FATF 권고사항 R.18과 FIU 가이드라인은 연 1회 이상 독립적인 외부 감사를 요구한다.<br />
          내부 점검(2선)은 자기 평가의 한계가 있으므로,
          외부 전문가가 체계의 설계 적정성과 운영 효과성을 객관적으로 평가해야 한다.
        </p>

        <p>
          <strong>감사 주체 선정 기준</strong><br />
          외부 감사인은 다음 조건을 충족해야 한다.
        </p>

        <div className="not-prose my-4 p-3 bg-muted/20 rounded border border-border/30 text-sm">
          <p className="mb-1"><strong>독립성:</strong> VASP와 이해관계가 없는 자 (자문 계약, 지분 관계 부재)</p>
          <p className="mb-1"><strong>전문성:</strong> AML/CFT 감사 경험, 가상자산 산업 이해</p>
          <p className="mb-1"><strong>자격:</strong> 공인회계사, 법률전문가, AML 인증(CAMS 등) 보유</p>
          <p><strong>교체 주기:</strong> 동일 감사인 연속 3년 이상 시 교체 또는 파트너 로테이션 권장</p>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">AML 세부 감사 항목</h3>
        <p>
          외부 감사에서 점검하는 세부 항목은 다음과 같다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">감사 영역</th>
                <th className="text-left px-3 py-2 border-b border-border">세부 항목</th>
                <th className="text-left px-3 py-2 border-b border-border">검증 방법</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">CDD 이행</td>
                <td className="px-3 py-1.5 border-b border-border/30">고객 파일 샘플링 → 확인·검증 완료 여부</td>
                <td className="px-3 py-1.5 border-b border-border/30">무작위 추출(최소 30건), 고위험 고객 전수 검사</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">STR 보고</td>
                <td className="px-3 py-1.5 border-b border-border/30">보고 건수, 적시성, 보고서 품질</td>
                <td className="px-3 py-1.5 border-b border-border/30">FIU 접수 확인서 대조, 보고 내용 충실성 평가</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">FDS 운영</td>
                <td className="px-3 py-1.5 border-b border-border/30">탐지 규칙 적정성, 오탐률, 알림 처리 속도</td>
                <td className="px-3 py-1.5 border-b border-border/30">규칙 목록 검토, 알림 처리 이력 분석</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">위험평가</td>
                <td className="px-3 py-1.5 border-b border-border/30">평가 방법론, 결과 정확성, 갱신 여부</td>
                <td className="px-3 py-1.5 border-b border-border/30">매트릭스 검토, 전년 대비 변경 사유 확인</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">교육</td>
                <td className="px-3 py-1.5 border-b border-border/30">교육 계획 수립, 실시 여부, 내용 적절성</td>
                <td className="px-3 py-1.5 border-b border-border/30">교육 자료·참석자 명부 확인, 테스트 결과 검토</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">기록 보관</td>
                <td className="px-3 py-1.5">보관 기간 준수, 검색 가능성, 무결성</td>
                <td className="px-3 py-1.5">5년 경과 자료 존재 여부, 복원 테스트</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-8 mb-3">지적사항 사후관리</h3>
        <p>
          감사에서 지적된 사항은 개선 기한을 정하고 이행 상태를 추적해야 한다.<br />
          미이행 시 에스컬레이션(escalation) 절차가 작동하여
          상위 의사결정 기구에 보고된다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">지적 등급</th>
                <th className="text-left px-3 py-2 border-b border-border">개선 기한</th>
                <th className="text-left px-3 py-2 border-b border-border">미이행 시 조치</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">중대(Critical)</td>
                <td className="px-3 py-1.5 border-b border-border/30">30일 이내</td>
                <td className="px-3 py-1.5 border-b border-border/30">이사회 긴급 보고 → 업무 중단 검토</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">주요(Major)</td>
                <td className="px-3 py-1.5 border-b border-border/30">60일 이내</td>
                <td className="px-3 py-1.5 border-b border-border/30">위원회 보고 → 시정 계획 수립 재요구</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">경미(Minor)</td>
                <td className="px-3 py-1.5">90일 이내</td>
                <td className="px-3 py-1.5">CCO 보고 → 차기 점검 시 이행 확인</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          에스컬레이션은 "개선 기한을 놓쳤다"는 사실 자체가 트리거.<br />
          30일 경과 후 자동으로 상위 보고가 이루어지는 시스템을 구축하는 것이 바람직하며,
          수동 에스컬레이션에 의존하면 담당자의 은폐 가능성을 배제할 수 없다.
        </p>

        <p>
          지적사항과 개선 이력은 그 자체로 문서화 대상이다.<br />
          "어떤 문제가 있었고, 언제까지 어떻게 개선했는가"를 기록해 두면
          다음 감사 시 개선 추이를 확인할 수 있고,
          동일 지적이 반복되는지 여부도 판단할 수 있다.
        </p>

        <p>
          동일 지적이 2회 연속 반복되면 "체계적 미흡(systemic deficiency)"으로 분류하여
          근본 원인 분석(root cause analysis)을 수행하고,
          단순 보완이 아닌 프로세스 재설계를 검토해야 한다.
        </p>

        <p className="text-sm border-l-2 border-blue-500/50 pl-3 mt-4">
          <strong>{'💡'} 문서화의 실질적 가치</strong><br />
          문서화는 "규제 당국을 위한 것"만이 아니다.<br />
          체계적인 문서화는 조직의 학습 기반이 된다 —
          과거 위험평가 결과를 축적하면 위험 추이를 파악할 수 있고,
          STR 보고 이력을 분석하면 자사의 취약 영역이 어디인지 데이터로 확인할 수 있다.<br />
          감사 지적 이력은 "우리가 반복적으로 실패하는 영역"을 드러내며,
          이를 기반으로 교육 내용을 개선하고 시스템을 보강할 수 있다.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 디지털 기록 관리</strong><br />
          가상자산 거래의 특성상 대부분의 기록이 디지털 형태로 생성된다.<br />
          전자 기록의 무결성을 보장하기 위해 타임스탬프, 해시값 보관, 접근 로그 기록이 필요하며,
          데이터베이스 백업과 재해복구 계획에 AML/CFT 기록이 포함되어야 한다.<br />
          개인정보보호법과의 충돌(보관 기간 vs 파기 의무)에 대해서는
          "특금법이 우선 적용된다"는 해석이 FIU 가이드라인에 명시되어 있으나,
          보관 기간 경과 후에는 지체 없이 파기해야 한다.
        </p>

      </div>
    </section>
  );
}
