export default function PrivacyImpactAssessment() {
  return (
    <section id="privacy-impact-assessment" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">개인정보 영향평가(PIA)</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <h3 className="text-xl font-semibold mt-2 mb-3">PIA란 무엇인가</h3>
        <p>
          PIA(Privacy Impact Assessment, 개인정보 영향평가)는 새로운 정보시스템을 도입하거나 기존 시스템을 대규모 변경할 때, 개인정보 침해 위험을 사전에 분석하고 개선 방안을 도출하는 체계적 절차.<br />
          사고가 발생한 후 대응하는 것이 아니라, 시스템 구축 단계에서 미리 위험을 식별하여 설계에 반영하는 "Privacy by Design(설계 단계부터 프라이버시 보호)" 접근법의 핵심 도구.
        </p>
        <p>
          EU의 GDPR(General Data Protection Regulation)에서는 이를 DPIA(Data Protection Impact Assessment)로 부르며, 고위험 처리 활동에 대해 의무적으로 수행하도록 규정한다(GDPR 제35조).
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">법적 근거: 개인정보보호법 제33조</h3>
        <p>
          개인정보보호법 제33조 — "공공기관의 장은 대통령령으로 정하는 기준에 해당하는 개인정보파일의 운용으로 인하여 정보주체의 개인정보 침해가 우려되는 경우에는 그 위험요인의 분석과 개선 사항 도출을 위한 평가를 하고 그 결과를 개인정보보호위원회에 제출하여야 한다."
        </p>
        <ul>
          <li><strong>공공기관</strong> — PIA 수행이 법적 의무. 평가 결과를 개인정보보호위원회에 제출해야 한다</li>
          <li><strong>민간기업</strong> — 법적 의무는 아니지만 권고사항. ISMS-P 인증 심사에서는 민간기업에도 PIA 수행 여부를 확인한다</li>
          <li><strong>VASP</strong> — 법적으로는 민간이므로 의무 대상이 아니지만, ISMS-P 인증의 3.x 영역 충족과 KYC/AML 시스템의 위험 관리를 위해 자발적으로 수행하는 것이 바람직하다</li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">평가 대상 기준</h3>
        <p>
          개인정보보호법 시행령 제35조가 정하는 영향평가 대상 기준. 다음 중 하나에 해당하면 평가를 수행해야 한다:
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">기준</th>
                <th className="text-left px-3 py-2 border-b border-border">조건</th>
                <th className="text-left px-3 py-2 border-b border-border">VASP 해당 여부</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">5만건 기준</td>
                <td className="px-3 py-1.5 border-b border-border/30">민감정보 또는 고유식별정보 5만건 이상 처리</td>
                <td className="px-3 py-1.5 border-b border-border/30">KYC에서 주민등록번호(고유식별정보) 수집 시 해당 가능</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">50만건 기준</td>
                <td className="px-3 py-1.5 border-b border-border/30">다른 개인정보파일과 연계하여 정보주체 50만명 이상</td>
                <td className="px-3 py-1.5 border-b border-border/30">KYC DB와 거래 DB 연계 시 해당 가능</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">100만건 기준</td>
                <td className="px-3 py-1.5 border-b border-border/30">정보주체 100만명 이상의 개인정보 처리</td>
                <td className="px-3 py-1.5 border-b border-border/30">대형 거래소 수준에서 해당</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">변경 기준</td>
                <td className="px-3 py-1.5">기존 평가 대상 시스템의 운용체계 중대 변경</td>
                <td className="px-3 py-1.5">KYC 시스템 전면 개편, DB 마이그레이션 시</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">평가 절차: 5단계</h3>
        <p>
          PIA는 다음 5단계로 수행된다. 각 단계에서 산출물을 작성하고, 최종적으로 영향평가서를 완성한다.
        </p>
        <ol>
          <li>
            <strong>1단계: 대상 선정</strong><br />
            평가 대상 시스템(또는 사업)을 확정하고, 평가 범위를 설정.<br />
            VASP의 경우 주요 대상: KYC/본인확인 시스템, 거래 모니터링 시스템, 고객정보 관리 시스템.
          </li>
          <li>
            <strong>2단계: 자료 수집</strong><br />
            대상 시스템의 개인정보 처리 현황을 파악. 수집 항목, 처리 흐름, 저장 위치, 접근 권한, 제3자 제공 현황 등을 조사.<br />
            시스템 구성도, 데이터 흐름도(DFD, Data Flow Diagram), 접근 권한 목록 등을 수집.
          </li>
          <li>
            <strong>3단계: 위험 분석</strong><br />
            수집된 자료를 바탕으로 개인정보 침해 위험을 식별하고 평가.<br />
            위험 = 발생 가능성 x 영향도. 높은 위험 항목에 대해 우선적으로 개선안을 마련.
          </li>
          <li>
            <strong>4단계: 개선 계획 수립</strong><br />
            식별된 위험에 대한 기술적·관리적 개선 방안을 수립.<br />
            예: "KYC 신분증 이미지 저장 시 AES-256 암호화 적용", "거래 모니터링 DB 접근 권한을 AML팀 3명으로 제한".
          </li>
          <li>
            <strong>5단계: 이행 및 후속 관리</strong><br />
            개선 계획을 실행하고 이행 결과를 확인. 미이행 항목은 차기 계획에 반영.<br />
            공공기관은 평가 결과를 개인정보보호위원회에 제출하고, 일정 사항을 공개해야 한다.
          </li>
        </ol>

        <h3 className="text-xl font-semibold mt-6 mb-3">평가 항목</h3>
        <p>
          PIA에서 점검하는 주요 평가 항목을 4개 영역으로 분류:
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">영역</th>
                <th className="text-left px-3 py-2 border-b border-border">점검 항목</th>
                <th className="text-left px-3 py-2 border-b border-border">VASP 중점 사항</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">수집 적정성</td>
                <td className="px-3 py-1.5 border-b border-border/30">최소 수집 원칙, 동의 절차, 수집 항목 타당성</td>
                <td className="px-3 py-1.5 border-b border-border/30">KYC에서 수집하는 항목이 법적 근거(특금법)에 부합하는가</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">이용 적정성</td>
                <td className="px-3 py-1.5 border-b border-border/30">목적 외 이용 여부, 접근 권한 적정성</td>
                <td className="px-3 py-1.5 border-b border-border/30">AML 모니터링 목적으로 수집한 정보를 마케팅에 사용하지 않는가</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">제공 적정성</td>
                <td className="px-3 py-1.5 border-b border-border/30">제3자 제공 동의, 위탁 관리, 국외 이전 보호조치</td>
                <td className="px-3 py-1.5 border-b border-border/30">Travel Rule 이행 시 상대 VASP에 제공하는 항목이 최소한인가</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">기술적 보호조치</td>
                <td className="px-3 py-1.5">암호화, 접근통제, 로그 관리, 백업, 파기 절차</td>
                <td className="px-3 py-1.5">KYC 이미지 암호화, DB 접근 로그 2년 보관, 파기 자동화</td>
              </tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">VASP 적용: 주요 평가 대상 시스템</h3>
        <p>
          VASP가 PIA를 수행할 때 중점적으로 평가해야 할 시스템:
        </p>
        <ul>
          <li>
            <strong>KYC/본인확인 시스템</strong> — 가장 민감한 개인정보를 처리하는 시스템.<br />
            신분증 이미지 OCR(Optical Character Recognition, 광학 문자 인식), 얼굴 인식, 제재 목록(Sanctions List) 조회 등 외부 서비스와의 데이터 교환이 빈번하여 침해 위험이 높다.
          </li>
          <li>
            <strong>거래 모니터링 시스템</strong> — FDS(Fraud Detection System)와 연동하여 고객의 전체 거래 이력을 실시간 분석.<br />
            민감한 금융 거래 정보를 대량으로 처리하며, AML 솔루션 업체(수탁자)와 데이터를 공유하는 경우가 많다.
          </li>
          <li>
            <strong>고객정보 관리 시스템(CRM)</strong> — 회원 가입 정보, 문의 내역, 마케팅 동의 이력 등을 종합 관리.<br />
            고객센터 대행 업체(수탁자)가 접근하는 경우가 있어 접근 통제 적정성을 평가해야 한다.
          </li>
        </ul>

        <h3 className="text-xl font-semibold mt-6 mb-3">평가 결과 보고와 공개</h3>
        <p>
          PIA 완료 후의 후속 조치:
        </p>
        <ul>
          <li>
            <strong>공공기관</strong> — 영향평가서를 개인정보보호위원회(PIPC, Personal Information Protection Commission)에 제출해야 한다.<br />
            개인정보보호위원회는 평가서를 검토하여 보완을 권고할 수 있으며, 평가 결과의 주요 내용은 공개 의무 대상.
          </li>
          <li>
            <strong>민간기업</strong> — 법적 제출·공개 의무는 없으나, ISMS-P 심사 시 PIA 수행 사실과 결과를 증적으로 제출하면 3.x 영역 적합 판정에 유리하다.
          </li>
        </ul>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} PIA의 실질적 가치</strong><br />
          PIA는 법적 의무 이행을 넘어 실질적인 보안 강화 효과를 제공한다.<br />
          시스템 구축 단계에서 개인정보 침해 위험을 미리 식별하면, 이후 수정하는 것보다 비용이 훨씬 적다 — "사전 예방의 비용 {'<'} 사후 대응의 비용" 원칙.<br />
          특히 VASP는 KYC 시스템의 침해가 발생하면 이용자 신분증 유출이라는 치명적 사고로 이어지므로, PIA를 통한 사전 위험 제거가 매우 중요하다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">PIA vs ISMS-P 심사: 차이점</h3>
        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">구분</th>
                <th className="text-left px-3 py-2 border-b border-border">PIA (영향평가)</th>
                <th className="text-left px-3 py-2 border-b border-border">ISMS-P 심사</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">시점</td>
                <td className="px-3 py-1.5 border-b border-border/30">시스템 구축·변경 전</td>
                <td className="px-3 py-1.5 border-b border-border/30">운영 중 (연 1회 사후심사)</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">범위</td>
                <td className="px-3 py-1.5 border-b border-border/30">특정 시스템 또는 사업</td>
                <td className="px-3 py-1.5 border-b border-border/30">조직 전체 (인증 범위)</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">목적</td>
                <td className="px-3 py-1.5 border-b border-border/30">개인정보 침해 위험 사전 분석</td>
                <td className="px-3 py-1.5 border-b border-border/30">관리체계 전반의 적합성 검증</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">수행 주체</td>
                <td className="px-3 py-1.5 border-b border-border/30">내부 또는 외부 평가기관</td>
                <td className="px-3 py-1.5 border-b border-border/30">KISA 또는 인증기관 심사원</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">결과</td>
                <td className="px-3 py-1.5">영향평가서, 개선 계획</td>
                <td className="px-3 py-1.5">적합/부적합, 결함 보고서</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          PIA와 ISMS-P 심사는 상호보완적 관계. PIA는 새 시스템 도입 시 위험을 사전에 제거하고, ISMS-P 심사는 운영 중인 관리체계의 지속적 적합성을 검증한다.<br />
          VASP는 양쪽 모두를 수행하여 개인정보 보호의 전체 생명주기를 관리하는 것이 이상적.
        </p>

      </div>
    </section>
  );
}
