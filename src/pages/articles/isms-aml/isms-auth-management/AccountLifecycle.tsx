import AccountLifecycleViz from './viz/AccountLifecycleViz';
import AccountIssuanceViz from './viz/AccountIssuanceViz';
import RetirementViz from './viz/RetirementViz';

export default function AccountLifecycle() {
  return (
    <section id="account-lifecycle" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">계정 생명주기 관리</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <AccountLifecycleViz />

        <h3 className="text-xl font-semibold mt-2 mb-3">생명주기란</h3>
        <p>
          계정은 생성되는 순간부터 폐기될 때까지 하나의 생명주기(Lifecycle)를 가진다.<br />
          각 단계마다 보안 통제가 필요하며, 어느 한 단계라도 관리되지 않으면 전체 인증 체계에 구멍이 생긴다.<br />
          ISMS 2.5.4는 "계정 발급, 이용, 변경, 폐기의 절차를 수립하고 이행하라"는 요구사항.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">신규 발급: 최소 권한 원칙</h3>
        <p>
          계정 발급의 첫 번째 원칙은 최소 권한(Least Privilege) — 업무 수행에 필요한 최소한의 권한만 부여.<br />
          "일단 넓게 주고 나중에 줄인다"는 접근은 보안 사고의 주요 원인 중 하나.
        </p>
        <ul>
          <li><strong>계정 신청서</strong> — 신청자, 소속 부서, 필요 시스템, 요청 권한, 사유를 명시. 전자 결재 또는 이메일 승인</li>
          <li><strong>승인 체계</strong> — 부서장 1차 승인 → 정보보호팀 2차 승인. 관리자급 권한은 CISO 승인 추가</li>
          <li><strong>권한 매핑</strong> — RBAC(역할 기반 접근제어) 기반으로 역할에 매핑. 개별 권한을 직접 부여하지 않음</li>
          <li><strong>발급 확인</strong> — 신청자에게 계정 정보(아이디 + 임시 비밀번호)를 별도 채널로 전달. 아이디와 비밀번호를 같은 채널로 보내지 않는 것이 원칙</li>
          <li><strong>초기 로그인</strong> — 첫 접속 시 임시 비밀번호 변경 강제, 보안 서약서 동의, MFA 등록 안내</li>
        </ul>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 개발 환경과 운영 환경 분리</strong><br />
          개발자에게 운영 DB 접근 권한을 부여하는 것은 대표적인 과다 권한 사례.
          개발 환경(Development)과 운영 환경(Production)의 계정을 완전히 분리하고, 운영 환경 접근은 별도 승인 절차를 거쳐야 한다.
          VASP에서는 운영 DB에 고객 자산 잔고와 개인정보가 모두 존재하므로 분리가 더욱 중요.
        </p>

        <AccountIssuanceViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">권한 변경: 임시 권한과 자동 회수</h3>
        <p>
          업무 변경, 프로젝트 투입, 장애 대응 등으로 기존 권한 외의 접근이 필요한 경우가 발생한다.<br />
          이때 영구적 권한 추가가 아닌 임시 권한 부여가 원칙.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">상황</th>
                <th className="text-left px-3 py-2 border-b border-border">권한 유형</th>
                <th className="text-left px-3 py-2 border-b border-border">부여 기간</th>
                <th className="text-left px-3 py-2 border-b border-border">회수 방법</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30">부서 이동</td>
                <td className="px-3 py-1.5 border-b border-border/30">역할 재배정</td>
                <td className="px-3 py-1.5 border-b border-border/30">영구 (이전 역할 즉시 해제)</td>
                <td className="px-3 py-1.5 border-b border-border/30">인사 연동 자동 처리</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30">프로젝트 투입</td>
                <td className="px-3 py-1.5 border-b border-border/30">추가 역할 부여</td>
                <td className="px-3 py-1.5 border-b border-border/30">프로젝트 종료일까지</td>
                <td className="px-3 py-1.5 border-b border-border/30">만료일 자동 회수</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30">장애 대응</td>
                <td className="px-3 py-1.5 border-b border-border/30">긴급 특권 접근</td>
                <td className="px-3 py-1.5 border-b border-border/30">최대 24시간</td>
                <td className="px-3 py-1.5 border-b border-border/30">타이머 자동 회수 + 사후 검토</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5">외부 감사/점검</td>
                <td className="px-3 py-1.5">읽기 전용 임시 계정</td>
                <td className="px-3 py-1.5">감사 기간 종료일까지</td>
                <td className="px-3 py-1.5">기간 만료 자동 비활성화</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          임시 권한의 핵심은 자동 회수(Auto-revocation).<br />
          사람에게 "기간 끝나면 회수해 주세요"라고 위임하면 잊혀지는 것이 현실이다.<br />
          시스템 수준에서 만료일을 설정하고, 만료 시 자동으로 권한을 비활성화하는 구현이 필수.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">공용 계정 관리</h3>
        <p>
          "admin", "root", "service" 같은 공용 계정(Shared Account)은 원칙적으로 사용을 지양.<br />
          행위 추적이 불가능하기 때문이다 — 사고 발생 시 "누가 했는가"를 특정할 수 없다.<br />
          그러나 레거시 시스템이나 일부 네트워크 장비에서는 공용 계정이 불가피한 경우 존재.
        </p>
        <ul>
          <li><strong>사용대장 운영</strong> — 공용 계정 사용 시 사용자명, 사용 일시, 사유를 기록. 사용 전후 비밀번호 변경이 이상적이나 현실적으로 어려우면 월 1회 변경</li>
          <li><strong>접속 IP 제한</strong> — 특정 관리 단말(점프서버)에서만 접속 가능하도록 IP 바인딩</li>
          <li><strong>세션 녹화</strong> — 공용 계정 세션은 전체 녹화하여 사후 검토 가능하게 유지. 접근제어 소프트웨어가 이 기능을 제공</li>
          <li><strong>감축 계획</strong> — 공용 계정 수를 점진적으로 줄이는 계획을 수립하고 ISMS 심사에 제출. 현재 수량, 목표 수량, 일정을 명시</li>
        </ul>

        <RetirementViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">퇴직/이직 처리</h3>
        <p>
          퇴직자 계정 처리는 시간이 생명.<br />
          퇴직 당일 모든 시스템 접근을 차단해야 하며, 지연될수록 내부 정보 유출 위험이 증가한다.
        </p>
        <ul>
          <li><strong>즉시 비활성화</strong> — 인사팀 퇴직 처리와 동시에 계정 비활성화 실행. 자동 연동이 이상적이나 수동이라면 당일 처리를 SLA(Service Level Agreement, 서비스 수준 계약)로 설정</li>
          <li><strong>접근 이력 보관</strong> — 퇴직자의 최근 접근 이력(최소 6개월)을 보관. 퇴직 전 비정상적 데이터 다운로드나 대량 조회가 없었는지 사후 검토</li>
          <li><strong>연관 자원 회수</strong> — VPN 인증서 폐기, 보안 토큰 회수, 공유 폴더 접근 해제, 이메일 포워딩 설정 제거</li>
          <li><strong>공유 비밀번호 변경</strong> — 퇴직자가 알고 있던 공용 계정의 비밀번호를 즉시 변경</li>
          <li><strong>삭제가 아닌 비활성화</strong> — 감사 추적을 위해 계정을 삭제하지 않고 비활성화 상태로 유지. 보관 기간은 내부 정책에 따르되 최소 1년</li>
        </ul>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} VASP 특수 고려사항</strong><br />
          월렛 서명 권한을 가진 직원의 퇴직은 특히 민감. 멀티시그(Multi-sig) 구성원에서 즉시 제외하고,
          필요 시 서명 임계값(Threshold)을 재조정해야 한다.
          예: 3-of-5 멀티시그에서 1명 퇴직 시 3-of-4로 변경하거나 신규 서명자를 추가하여 3-of-5를 유지.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">정기 점검: 분기별 계정 리뷰</h3>
        <p>
          계정 관리는 발급/변경/퇴직 시점의 즉각적 처리만으로는 불충분.<br />
          시간이 지나면 권한 누적(Privilege Creep, 역할 변경 시 이전 권한을 회수하지 않아 권한이 점점 늘어나는 현상)이 발생한다.<br />
          분기별(최소 반기) 전수 점검이 ISMS 2.5 요구사항의 핵심:
        </p>
        <ul>
          <li><strong>미사용 계정 정리</strong> — 최근 90일간 로그인 이력이 없는 계정 목록 추출 → 소속 부서에 사용 여부 확인 → 미사용 확인 시 비활성화</li>
          <li><strong>권한 적정성 검토</strong> — 각 사용자의 현재 권한이 현재 직무에 필요한 수준인지 확인. 부서 이동 후 이전 권한이 남아 있는 경우 회수</li>
          <li><strong>관리자 계정 재확인</strong> — 관리자급 이상 권한 보유자 목록을 CISO에게 보고. 불필요한 관리자 권한 회수</li>
          <li><strong>공용 계정 현황</strong> — 공용 계정 수, 사용 빈도, 사용대장 기록 상태를 점검</li>
          <li><strong>서비스 계정 점검</strong> — 더 이상 사용하지 않는 서비스 계정(폐기된 시스템의 연동 계정 등) 식별 및 삭제</li>
        </ul>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">점검 항목</th>
                <th className="text-left px-3 py-2 border-b border-border">주기</th>
                <th className="text-left px-3 py-2 border-b border-border">담당</th>
                <th className="text-left px-3 py-2 border-b border-border">산출물</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30">미사용 계정 정리</td>
                <td className="px-3 py-1.5 border-b border-border/30">분기</td>
                <td className="px-3 py-1.5 border-b border-border/30">IT운영팀</td>
                <td className="px-3 py-1.5 border-b border-border/30">미사용 계정 처리 내역서</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30">권한 적정성 검토</td>
                <td className="px-3 py-1.5 border-b border-border/30">분기</td>
                <td className="px-3 py-1.5 border-b border-border/30">정보보호팀 + 각 부서장</td>
                <td className="px-3 py-1.5 border-b border-border/30">권한 검토 보고서</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30">관리자 계정 점검</td>
                <td className="px-3 py-1.5 border-b border-border/30">분기</td>
                <td className="px-3 py-1.5 border-b border-border/30">정보보호팀 → CISO 보고</td>
                <td className="px-3 py-1.5 border-b border-border/30">관리자 계정 현황표</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5">전체 계정 대장 갱신</td>
                <td className="px-3 py-1.5">반기</td>
                <td className="px-3 py-1.5">IT운영팀</td>
                <td className="px-3 py-1.5">계정 관리 대장</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          점검 결과 발견된 이상 사항은 즉시 조치하고, 조치 이력을 증적으로 보관.<br />
          ISMS 사후심사에서 "분기별 계정 점검을 실시했는가, 미사용 계정을 실제로 처리했는가"를 반드시 확인한다.<br />
          정책서만 존재하고 실행 증적이 없으면 부적합 판정.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 자동화의 중요성</strong><br />
          계정 수가 100개를 넘어가면 수동 점검은 현실적으로 불가능하다.
          IAM(Identity and Access Management, 계정/권한 통합 관리 시스템) 도구를 도입하여 계정 생성/변경/비활성화를 자동화하고,
          정기 점검 보고서를 자동 생성하는 것이 운영 효율과 보안 모두를 확보하는 방법.
        </p>

      </div>
    </section>
  );
}
