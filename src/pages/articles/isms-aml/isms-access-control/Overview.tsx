import OverviewViz from './viz/OverviewViz';
import LeastPrivilegeViz from './viz/LeastPrivilegeViz';
import DefenseDepthViz from './viz/DefenseDepthViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">접근통제 원칙</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <OverviewViz />

        <h3 className="text-xl font-semibold mt-2 mb-3">ISMS 2.6 요구사항</h3>
        <p>
          ISMS 보호대책 2.6(접근통제)는 "네트워크, 서버, 데이터베이스 등 정보시스템에 대한 접근을 통제하라"는 요구사항.<br />
          인증(Authentication)이 "누구인가"를 확인하는 것이라면, 접근통제(Access Control)는 "어디까지 갈 수 있는가"를 제한하는 것.<br />
          인증을 통과한 사용자라도 자신의 업무 범위를 벗어난 자원에는 접근할 수 없어야 한다.
        </p>

        <p>
          2.6 영역은 7개 세부 항목으로 구성:
        </p>
        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">항목</th>
                <th className="text-left px-3 py-2 border-b border-border">주제</th>
                <th className="text-left px-3 py-2 border-b border-border">핵심 내용</th>
              </tr>
            </thead>
            <tbody>
              <tr><td className="px-3 py-1.5 border-b border-border/30">2.6.1</td><td className="px-3 py-1.5 border-b border-border/30">네트워크 접근</td><td className="px-3 py-1.5 border-b border-border/30">망분리, 방화벽 정책, DMZ 설계</td></tr>
              <tr><td className="px-3 py-1.5 border-b border-border/30">2.6.2</td><td className="px-3 py-1.5 border-b border-border/30">정보시스템 접근</td><td className="px-3 py-1.5 border-b border-border/30">서버 접근 제한, SSH 키 관리</td></tr>
              <tr><td className="px-3 py-1.5 border-b border-border/30">2.6.3</td><td className="px-3 py-1.5 border-b border-border/30">응용프로그램 접근</td><td className="px-3 py-1.5 border-b border-border/30">관리자 페이지 접근 제한, API 인증</td></tr>
              <tr><td className="px-3 py-1.5 border-b border-border/30">2.6.4</td><td className="px-3 py-1.5 border-b border-border/30">데이터베이스 접근</td><td className="px-3 py-1.5 border-b border-border/30">접근제어 소프트웨어, 쿼리 감사</td></tr>
              <tr><td className="px-3 py-1.5 border-b border-border/30">2.6.5</td><td className="px-3 py-1.5 border-b border-border/30">무선 네트워크 접근</td><td className="px-3 py-1.5 border-b border-border/30">Wi-Fi 보안, 비인가 AP 탐지</td></tr>
              <tr><td className="px-3 py-1.5 border-b border-border/30">2.6.6</td><td className="px-3 py-1.5 border-b border-border/30">원격 접근</td><td className="px-3 py-1.5 border-b border-border/30">VPN, 원격 근무 보안 정책</td></tr>
              <tr><td className="px-3 py-1.5">2.6.7</td><td className="px-3 py-1.5">인터넷 접속</td><td className="px-3 py-1.5">업무용 인터넷 제한, 유해 사이트 차단</td></tr>
            </tbody>
          </table>
        </div>

        <p>
          이 아티클에서는 VASP에 특히 중요한 네트워크 접근(2.6.1)과 데이터베이스 접근(2.6.4)을 중점적으로 다룬다.
        </p>

        <h3 className="text-xl font-semibold mt-6 mb-3">최소 권한 원칙 (Least Privilege)</h3>
        <p>
          접근통제의 가장 기본적인 원칙.<br />
          "업무 수행에 필요한 최소한의 자원에만 접근할 수 있어야 한다."<br />
          이 원칙이 깨지면 한 명의 계정 탈취로 전체 시스템이 위험에 처한다.
        </p>
        <ul>
          <li><strong>기본 거부(Default Deny)</strong> — 명시적으로 허용되지 않은 모든 접근은 차단. 방화벽, 서버, DB 모두 동일 원칙 적용</li>
          <li><strong>Need-to-Know</strong> — 정보 접근은 해당 정보가 업무에 직접 필요한 사람에게만 허용. "알 필요가 없는 정보는 접근할 수 없다"</li>
          <li><strong>시간 제한</strong> — 상시 접근이 불필요한 자원은 접근 시간대를 제한. 예: 업무 시간 외 관리자 페이지 접근 차단</li>
        </ul>

        <LeastPrivilegeViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">직무 분리 (Separation of Duties)</h3>
        <p>
          하나의 중요한 업무를 한 사람이 단독으로 수행하지 못하도록 역할을 분리하는 원칙.<br />
          내부자 위협(Insider Threat)과 실수를 동시에 방지한다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">업무</th>
                <th className="text-left px-3 py-2 border-b border-border">분리 대상</th>
                <th className="text-left px-3 py-2 border-b border-border">이유</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30">출금 승인</td>
                <td className="px-3 py-1.5 border-b border-border/30">요청자 / 승인자 / 실행자</td>
                <td className="px-3 py-1.5 border-b border-border/30">한 사람이 출금을 요청하고 승인까지 하면 내부 횡령 가능</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30">코드 배포</td>
                <td className="px-3 py-1.5 border-b border-border/30">개발자 / 코드 리뷰어 / 배포 담당자</td>
                <td className="px-3 py-1.5 border-b border-border/30">악의적 코드 삽입 후 자가 승인·배포 방지</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30">DB 변경</td>
                <td className="px-3 py-1.5 border-b border-border/30">변경 요청자 / DBA(Database Administrator, 데이터베이스 관리자)</td>
                <td className="px-3 py-1.5 border-b border-border/30">직접 DB 수정 시 데이터 무결성 훼손 위험</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5">감사 로그 관리</td>
                <td className="px-3 py-1.5">시스템 운영자 / 로그 관리자</td>
                <td className="px-3 py-1.5">운영자가 로그를 수정/삭제하면 감사 추적 불가</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} VASP에서의 직무 분리</strong><br />
          거래소 운영에서 직무 분리가 가장 중요한 영역은 "출금 프로세스"와 "상장 심사".
          출금은 멀티시그(Multi-signature)로 기술적 분리를 구현하고, 상장 심사는 심사위원회 합의제로 운영.
          한 사람이 상장 결정 + 선행매수(Front-running, 미공개 정보를 이용한 사전 거래)를 할 수 없도록 제도적 장치를 마련해야 한다.
        </p>

        <DefenseDepthViz />

        <h3 className="text-xl font-semibold mt-6 mb-3">심층 방어 (Defense in Depth)</h3>
        <p>
          단일 보안 계층에 의존하지 않고, 여러 계층에서 독립적으로 접근을 통제하는 전략.<br />
          한 계층이 뚫려도 다음 계층에서 공격을 차단할 수 있다.
        </p>

        <div className="not-prose overflow-x-auto my-4">
          <table className="w-full text-sm border border-border">
            <thead>
              <tr className="bg-muted/30">
                <th className="text-left px-3 py-2 border-b border-border">계층</th>
                <th className="text-left px-3 py-2 border-b border-border">통제 수단</th>
                <th className="text-left px-3 py-2 border-b border-border">차단 대상</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">네트워크</td>
                <td className="px-3 py-1.5 border-b border-border/30">방화벽, IPS(침입방지시스템), 망분리</td>
                <td className="px-3 py-1.5 border-b border-border/30">비인가 네트워크 접근, 포트 스캔</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">서버</td>
                <td className="px-3 py-1.5 border-b border-border/30">SSH 키 인증, 접근 IP 제한, 호스트 방화벽</td>
                <td className="px-3 py-1.5 border-b border-border/30">비인가 서버 로그인, 측면 이동(Lateral Movement)</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 border-b border-border/30 font-medium">애플리케이션</td>
                <td className="px-3 py-1.5 border-b border-border/30">WAF(웹 애플리케이션 방화벽), 세션 관리, API 인증</td>
                <td className="px-3 py-1.5 border-b border-border/30">SQL 인젝션, XSS, 무단 API 호출</td>
              </tr>
              <tr>
                <td className="px-3 py-1.5 font-medium">데이터베이스</td>
                <td className="px-3 py-1.5">접근제어 소프트웨어, 쿼리 필터링, 암호화</td>
                <td className="px-3 py-1.5">비인가 데이터 조회, 대량 유출, 권한 밖 수정</td>
              </tr>
            </tbody>
          </table>
        </div>

        <p>
          각 계층은 독립적으로 작동해야 한다 — "방화벽이 있으니 DB 접근제어는 안 해도 된다"는 논리는 심층 방어의 정반대.<br />
          공격자가 VPN을 통해 내부망에 진입하더라도(네트워크 계층 돌파), 서버 인증(서버 계층)과 DB 접근제어(데이터베이스 계층)가 독립적으로 작동하여 데이터 유출을 방지해야 한다.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 제로 트러스트(Zero Trust) 관점</strong><br />
          전통적 경계 보안(Perimeter Security)은 "내부망은 안전하다"를 전제.
          제로 트러스트는 이 전제를 폐기하고, 네트워크 위치에 관계없이 모든 접근을 검증한다.
          ISMS 자체가 제로 트러스트를 명시하지는 않지만, 심층 방어 원칙을 철저히 적용하면 자연스럽게 제로 트러스트에 가까워진다.
        </p>

      </div>
    </section>
  );
}
