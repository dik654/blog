import AuditRemediationViz from './viz/AuditRemediationViz';
import AuditStagesViz from './viz/AuditStagesViz';
import RemediationProcessViz from './viz/RemediationProcessViz';
import PostCertViz from './viz/PostCertViz';

export default function AuditRemediation() {
  return (
    <section id="audit-remediation" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">인증심사와 보완조치</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <AuditRemediationViz />

        <p>
          보호대책을 모두 구현했다고 끝이 아니다 — 심사원이 "실제로 동작하는가"를 검증하는 단계가 남아있다.<br />
          서면심사에서 문서의 논리적 완결성을, 현장심사에서 문서와 현실의 일치를 확인.<br />
          결함이 도출되면 보완조치 기간 내에 개선하고, 증적을 첨부하여 결함 해소를 증명해야 인증이 부여된다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">심사 단계</h3>
        <AuditStagesViz />

        <h4 className="text-lg font-semibold mt-4 mb-2">1. 서면심사</h4>
        <p>
          인증 신청 시 제출한 문서(정보보호 정책서, 위험평가서, 보호대책 이행 내역 등)를 심사원이 검토.<br />
          문서가 102개 인증 기준을 모두 다루는지, 각 항목의 이행 내용이 논리적으로 타당한지 확인.<br />
          서면심사에서 중대한 누락이 발견되면 현장심사 진행 전에 보완을 요청하는 경우도 있다.
        </p>
        <p>
          서면심사의 핵심 포인트:
        </p>
        <ul>
          <li>정보보호 정책서가 조직의 실제 환경을 반영하는가 (템플릿 복사 여부를 심사원이 판별)</li>
          <li>위험평가서의 자산 목록이 인증 범위 내 모든 자산을 포함하는가</li>
          <li>보호대책과 위험평가 결과가 연결되어 있는가 (미수용 위험 → 대응 보호대책의 추적성)</li>
          <li>문서 간 버전·날짜가 일관성을 유지하는가 (정책 승인일이 이행 완료일보다 뒤인 경우 = 결함)</li>
        </ul>

        <h4 className="text-lg font-semibold mt-4 mb-2">2. 현장심사</h4>
        <p>
          심사원이 사업장을 방문하여 문서에 기재된 보호대책이 실제로 운영되고 있는지 검증.<br />
          통상 3~5일 소요되며, 심사원 2~4명이 팀을 이루어 영역별로 분담 심사.
        </p>
        <p>
          현장심사에서 자주 확인하는 항목:
        </p>
        <ul>
          <li>서버실/월렛룸 출입통제 장치가 실제로 작동하는지 심사원이 직접 시도</li>
          <li>DB 접근제어 소프트웨어에서 특정 일자의 접근 로그를 추출하여 검증</li>
          <li>임의의 직원을 선정하여 MFA 적용 여부를 현장에서 확인</li>
          <li>퇴사자 계정이 실제로 비활성화되었는지 시스템에서 직접 조회</li>
          <li>비밀번호 정책(복잡도, 변경 주기)이 시스템에 강제 설정되어 있는지 확인</li>
          <li>백업 복구 테스트 결과 보고서의 실제 존재 여부와 내용 확인</li>
          <li>교육 수료 증적(출석부, 수료증)의 실제 존재 여부</li>
        </ul>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 심사원의 "랜덤 샘플링"</strong><br />
          심사원은 모든 항목을 전수 검사하지 않고, 랜덤으로 샘플을 추출하여 검증.
          예: 전 직원 200명 중 10명을 무작위 선정하여 교육 이수 여부 확인,
          DB 서버 20대 중 3대를 선정하여 접근제어 로그 확인.
          따라서 "일부만 준비하면 될 것"이라는 접근은 위험 — 샘플에 걸리면 즉시 결함.
        </p>

        <h4 className="text-lg font-semibold mt-4 mb-2">3. 결함 도출</h4>
        <p>
          현장심사 종료 후 심사원이 결함 보고서를 작성. 각 결함에는 해당 인증 기준 번호가 부여된다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">결함 항목 번호 체계</h3>
        <p>
          결함 번호는 ISMS-P 인증 기준의 3자리 번호 체계를 그대로 따른다.<br />
          예: "결함 2.5.6" = 보호대책(2) {'>'} 인증 및 권한관리(5) {'>'} 6번째 세부항목(특권 계정 관리)에 대한 결함.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">결함 유형</th>
                <th className="text-left px-3 py-2 border-b border-border">정의</th>
                <th className="text-left px-3 py-2 border-b border-border">영향</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium text-red-600">중결함</td>
                <td className="px-3 py-1.5 border-b border-border/30">인증 기준을 전혀 이행하지 않았거나, 이행 내용이 심각하게 부적합</td>
                <td className="px-3 py-1.5 border-b border-border/30">보완 미완료 시 인증 불가</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium text-amber-600">경결함</td>
                <td className="px-3 py-1.5">부분적으로 이행했으나 일부 미흡한 사항 존재</td>
                <td className="px-3 py-1.5">보완조치 후 인증 가능</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          결함 보고서에는 각 결함의 번호, 유형(중/경), 심사 소견(어떤 점이 미흡한지), 관련 증거를 기재.<br />
          심사 소견을 정확히 이해하는 것이 보완조치의 출발점 — 소견과 다른 방향으로 보완하면 재보완 요청을 받는다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">보완조치 프로세스</h3>
        <RemediationProcessViz />
        <p>
          결함 도출 후 통상 40일 이내에 보완조치를 완료하고 결과를 제출해야 한다.<br />
          보완조치는 다음 4단계로 진행:
        </p>

        <ol>
          <li>
            <strong>결함 정리</strong> — 도출된 결함을 스프레드시트(보완조치 대장)에 정리.<br />
            각 결함별로 담당자, 예상 완료일, 보완 방향을 기재. 결함 간 우선순위를 설정하여 중결함부터 착수.
          </li>
          <li>
            <strong>보완 내역서 작성</strong> — 각 결함에 대해 "현재 상태 → 조치 내용 → 조치 후 상태"를 구체적으로 기술.<br />
            예: "2.5.3 결함 — 비밀번호 변경 주기가 시스템에 미설정 → Active Directory GPO(Group Policy Object)에서 90일 주기 강제 설정 적용 → 설정 스크린샷 증적 첨부"<br />
            추상적 서술("보안을 강화했음") 금지 — 무엇을, 어떻게, 어디에 적용했는지 구체적으로 서술해야 한다.
          </li>
          <li>
            <strong>증적 첨부</strong> — 보완 내역을 입증하는 증거 자료 첨부.<br />
            증적의 유형은 결함 내용에 따라 다양:
          </li>
        </ol>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">결함 유형</th>
                <th className="text-left px-3 py-2 border-b border-border">증적 예시</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="px-3 py-1.5 border-b border-border/30">비밀번호 정책 미설정</td><td className="px-3 py-1.5 border-b border-border/30">시스템 설정 화면 스크린샷 + 변경 전후 비교</td></tr>
              <tr><td className="px-3 py-1.5 border-b border-border/30">교육 미실시</td><td className="px-3 py-1.5 border-b border-border/30">교육 자료 + 출석부 + 수료증 (날짜 확인 가능해야)</td></tr>
              <tr><td className="px-3 py-1.5 border-b border-border/30">접근 로그 미검토</td><td className="px-3 py-1.5 border-b border-border/30">월간 로그 검토 보고서 + 이상 징후 처리 이력</td></tr>
              <tr><td className="px-3 py-1.5 border-b border-border/30">퇴사자 계정 미삭제</td><td className="px-3 py-1.5 border-b border-border/30">계정 비활성화 처리 화면 + 처리 일자 확인</td></tr>
              <tr><td className="px-3 py-1.5 border-b border-border/30">DB 접근제어 미적용</td><td className="px-3 py-1.5 border-b border-border/30">접근제어 솔루션 설정 화면 + 정책 적용 대상 목록</td></tr>
              <tr><td className="px-3 py-1.5 border-b border-border/30">백업 복구 미테스트</td><td className="px-3 py-1.5 border-b border-border/30">복구 훈련 결과 보고서 + RTO/RPO 측정 결과</td></tr>
              <tr><td className="px-3 py-1.5">서버 정보 노출</td><td className="px-3 py-1.5">nginx 설정 파일 + 응답 헤더 캡처 (server_tokens off 확인)</td></tr>
            </tbody>
          </table>
        </div>

        <ol start={4}>
          <li>
            <strong>완료 공문 제출</strong> — 보완조치 완료 후 인증기관에 공식 공문과 함께 보완 내역서 + 증적을 일괄 제출.<br />
            공문에는 결함 목록, 조치 완료 일자, 추가 설명이 필요한 항목에 대한 부연을 포함.
          </li>
        </ol>

        <h3 className="text-xl font-semibold mt-6 mb-3">기간 연장</h3>
        <p>
          40일 이내에 보완을 완료하기 어려운 경우 기간 연장을 신청할 수 있다.<br />
          연장 신청 시 제출 서류:
        </p>
        <ul>
          <li><strong>연장 사유서</strong> — 왜 기간 내 완료가 불가능한지 구체적 사유 기술 (솔루션 도입 소요 기간, 조직 변경 등)</li>
          <li><strong>보완 진행 현황 요약서</strong> — 현재까지 완료된 항목과 미완료 항목의 진행률</li>
          <li><strong>연장 기간 내 완료 계획서</strong> — 미완료 항목별 예상 완료일과 담당자</li>
        </ul>
        <p>
          연장은 통상 1회, 최대 40일 추가 부여. 연장 기간까지 완료하지 못하면 인증 불가 판정을 받을 수 있다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">산출물 목록</h3>
        <p>
          ISMS-P 인증 전 과정에서 생성·관리해야 하는 주요 문서를 정리.<br />
          심사 시 이 문서들의 존재 여부와 내용의 적정성을 확인한다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">영역</th>
                <th className="text-left px-3 py-2 border-b border-border">산출물</th>
                <th className="text-left px-3 py-2 border-b border-border">갱신 주기</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="px-3 py-1.5 border-b border-border/30">1.x 관리체계</td><td className="px-3 py-1.5 border-b border-border/30">정보보호 정책서, 조직도, CISO/CPO 지정 문서</td><td className="px-3 py-1.5 border-b border-border/30">연 1회 또는 변경 시</td></tr>
              <tr><td className="px-3 py-1.5 border-b border-border/30">1.x 위험관리</td><td className="px-3 py-1.5 border-b border-border/30">자산 목록, 위험평가서, 위험 처리 계획서, DoA 승인서</td><td className="px-3 py-1.5 border-b border-border/30">연 1회</td></tr>
              <tr><td className="px-3 py-1.5 border-b border-border/30">2.2 인적보안</td><td className="px-3 py-1.5 border-b border-border/30">보안 서약서, 교육 계획/결과 보고서, 퇴사자 체크리스트</td><td className="px-3 py-1.5 border-b border-border/30">입/퇴사 시 + 연 1회</td></tr>
              <tr><td className="px-3 py-1.5 border-b border-border/30">2.4 물리보안</td><td className="px-3 py-1.5 border-b border-border/30">출입 대장, 작업계획서/완료서, CCTV 운영 대장</td><td className="px-3 py-1.5 border-b border-border/30">수시</td></tr>
              <tr><td className="px-3 py-1.5 border-b border-border/30">2.5 인증/권한</td><td className="px-3 py-1.5 border-b border-border/30">계정 관리 대장, 공용계정 대장, 권한 검토 보고서</td><td className="px-3 py-1.5 border-b border-border/30">월 1회 + 변경 시</td></tr>
              <tr><td className="px-3 py-1.5 border-b border-border/30">2.6 접근통제</td><td className="px-3 py-1.5 border-b border-border/30">방화벽 정책서, 접근 로그 검토 보고서</td><td className="px-3 py-1.5 border-b border-border/30">월 1회</td></tr>
              <tr><td className="px-3 py-1.5 border-b border-border/30">2.7 암호화</td><td className="px-3 py-1.5 border-b border-border/30">암호화 적용 현황표, 키 관리 절차서</td><td className="px-3 py-1.5 border-b border-border/30">연 1회 또는 변경 시</td></tr>
              <tr><td className="px-3 py-1.5 border-b border-border/30">2.11 사고대응</td><td className="px-3 py-1.5 border-b border-border/30">사고 대응 계획서, 모의 훈련 결과서, 사고 보고서</td><td className="px-3 py-1.5 border-b border-border/30">연 1회 + 사고 시</td></tr>
              <tr><td className="px-3 py-1.5">2.12 재해복구</td><td className="px-3 py-1.5">백업 정책서, 복구 훈련 결과서, 소산 백업 현황</td><td className="px-3 py-1.5">반기 1회</td></tr>
            </tbody>
          </table>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-3">사후관리</h3>
        <PostCertViz />
        <p>
          인증 취득 후에도 지속적인 관리가 필수. 인증은 "특정 시점의 보안 수준 확인"이 아니라 "지속적 보안 관리 능력의 증명"이기 때문.
        </p>
        <ul>
          <li>
            <strong>연 1회 사후심사</strong> — 인증 유지 기간(3년) 동안 매년 사후심사를 받아야 한다.<br />
            사후심사는 최초 심사보다 범위가 좁지만, 핵심 항목은 반드시 재확인.<br />
            특히 "변경 관리"가 중점 — 신규 시스템 도입, 조직 변경, 서비스 변경 등이 ISMS 관리체계에 반영되었는지 확인.
          </li>
          <li>
            <strong>3년 유효기간</strong> — 인증 유효기간은 최초 인증일로부터 3년.<br />
            3년 후 갱신 심사(재인증)를 받아야 한다. 갱신 심사는 최초 심사와 동일한 수준으로 진행.
          </li>
          <li>
            <strong>수시 보고</strong> — 중대한 보안 사고, 대규모 조직 변경, 인증 범위 변경 등이 발생하면 인증기관에 수시 보고.<br />
            미보고 시 사후심사에서 "관리체계 운영 미흡"으로 결함 도출 가능.
          </li>
          <li>
            <strong>내부 감사</strong> — 연 1회 이상 내부 정보보호 감사를 수행하여 자체적으로 관리체계를 점검.<br />
            내부 감사 결과를 경영진에 보고하고, 발견된 미흡 사항을 자체 보완. 내부 감사 증적은 사후심사에서 필수 확인 대상.
          </li>
        </ul>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 인증 취소 사유</strong><br />
          거짓 서류 제출, 중대한 보안 사고 후 미보고, 사후심사 거부, 보완조치 미이행 등은 인증 취소 사유.
          인증이 취소되면 VASP 신고 요건 미충족으로 영업 정지에 이를 수 있으므로,
          "인증 취득"보다 "인증 유지"가 실질적으로 더 중요하고 어려운 과제.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">실무 팁: 증적 관리 체계</h3>
        <p>
          ISMS-P 인증의 성패는 "증적 관리"에 달려 있다고 해도 과언이 아니다.<br />
          보안 조치를 아무리 잘 이행해도 증적이 없으면 심사원에게 증명할 수 없다.
        </p>
        <ul>
          <li>
            <strong>증적 저장소 일원화</strong> — 모든 증적을 하나의 저장소(공유 드라이브, 위키 등)에 집중 관리.<br />
            폴더 구조를 인증 기준 번호 체계와 동일하게 구성 — 예: <code>/2.5 인증및권한/2.5.3 비밀번호정책/</code>
          </li>
          <li>
            <strong>자동 수집 가능한 증적은 자동화</strong> — 접근 로그, 백업 완료 알림, MFA 적용 현황 등은 스크립트로 자동 수집하여 증적 저장소에 적재.<br />
            수동 수집은 누락과 지연의 원인 — 월간 로그 검토를 매달 1일에 자동 리포트 생성하도록 설정하면 누락 방지 + 심사 대비 동시 해결.
          </li>
          <li>
            <strong>날짜가 핵심</strong> — 모든 증적에 작성일/수행일/승인일이 명확히 기록되어야 한다.<br />
            "언제" 수행했는지 확인할 수 없는 증적은 증적으로서의 가치가 없다. 스크린샷에는 시스템 시계가 포함되도록 캡처.
          </li>
        </ul>

      </div>
    </section>
  );
}
