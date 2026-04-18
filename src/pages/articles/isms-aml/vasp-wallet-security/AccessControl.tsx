import AccessControlViz from './viz/AccessControlViz';
import NetworkSegmentViz from './viz/NetworkSegmentViz';
import DbSecurityPolicyViz from './viz/DbSecurityPolicyViz';

export default function AccessControl() {
  return (
    <section id="access-control" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">접근통제와 DB 보안</h2>
      <AccessControlViz />
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-8 mb-4">망분리 원칙</h3>
        <p className="leading-7">
          VASP 인프라는 최소 세 개의 네트워크 영역으로 분리 운영한다: 개발망, 서비스망, 관리망.
          <br />
          개발망은 소스코드 작성과 테스트가 이루어지는 환경이고, 서비스망은 이용자 요청을 처리하는 프로덕션 환경이며,
          관리망은 내부 관리 도구와 DB 접근이 허용되는 영역이다.
        </p>
        <p className="leading-7">
          각 망 사이에는 방화벽(firewall)과 접근제어목록(ACL, Access Control List)을 두어 허용된 트래픽만 통과시킨다.
          <br />
          개발망에서 서비스망 DB에 직접 접근하는 것은 원천 차단되며, 관리망을 경유하더라도 별도 승인이 필요하다.
          <br />
          이렇게 분리하면 개발 환경이 침해되더라도 프로덕션 데이터와 이용자 자산에 도달하는 경로가 차단된다.
          <br />
          클라우드 환경에서는 VPC(Virtual Private Cloud) 분리와 보안 그룹(Security Group) 설정으로 동일한 효과를 구현한다.
        </p>

        <NetworkSegmentViz />

        <h3 className="text-xl font-semibold mt-8 mb-4">DB 접근제어 소프트웨어</h3>
        <p className="leading-7">
          데이터베이스는 가상자산 거래 내역, 이용자 개인정보, 지갑 주소 등 가장 민감한 정보가 집중된 곳이다.
          <br />
          DB 접근제어 소프트웨어(PETRA, Chakra 등)를 도입하여 세션, 쿼리, IP 세 가지 차원에서 통제한다.
        </p>
        <p className="leading-7">
          <strong>세션 통제</strong>: DB 접속 세션 자체를 제어한다.
          접근제어 소프트웨어를 경유하지 않은 직접 접속은 차단되며,
          모든 세션의 시작 시각, 종료 시각, 접속자 정보가 자동 기록된다.
          <br />
          <strong>쿼리 통제</strong>: 실행 가능한 SQL 명령어를 계정별로 제한한다.
          서비스 계정이 DROP TABLE이나 TRUNCATE를 실행하려 하면 차단되고 경보가 발생한다.
          대량 SELECT(예: LIMIT 없는 전체 조회)도 탐지 대상이다.
          <br />
          <strong>IP 통제</strong>: 허용된 IP 대역에서만 DB 접속을 허용한다.
          관리망 내부 IP가 아니면 접속 자체가 거부되며, VPN을 통해 관리망에 진입한 후에야 DB에 도달할 수 있다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">DB 계정 분리 체계</h3>
        <p className="leading-7">
          하나의 DB에 모든 작업을 처리하는 만능 계정을 두는 것은 보안상 가장 위험한 구조다.
          <br />
          VASP는 역할별로 DB 계정을 분리하여 각 계정이 수행 가능한 작업 범위를 명확히 제한한다.
        </p>
        <p className="leading-7">
          <strong>서비스 계정</strong>은 애플리케이션 서버가 사용하는 계정이다.
          특정 데이터베이스에 대해 readWrite 권한만 부여하고, 다른 데이터베이스에는 접근 자체가 불가능하다.
          스키마 변경(DDL, Data Definition Language) 권한은 없으므로 테이블 구조를 변경할 수 없다.
          <br />
          <strong>관리자 계정</strong>은 DBA(Database Administrator)가 유지보수 작업 시 사용한다.
          작업 기간을 한정하여 발급하며, 신청서에 작업 목적, 대상 테이블, 예상 소요 시간을 기재하고 팀장 승인을 받아야 한다.
          작업 완료 후에는 계정을 즉시 비활성화하거나 삭제한다.
          <br />
          <strong>백업 계정</strong>은 SELECT 권한만 보유한 읽기 전용 계정이다.
          백업 스크립트가 사용하며, 데이터 변경이 불가능하므로 이 계정이 침해되어도 데이터 위변조 위험이 없다.
          <br />
          <strong>슈퍼관리자 계정</strong>은 비상 상황에서만 사용하는 최고 권한 계정이다.
          팀장급 이상만 접근 가능하고, 사용 시 CISO에게 사전 통보해야 한다.
          비상 상황 종료 후 해당 세션에서 실행한 모든 쿼리를 감사 로그로 별도 보관한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">월간 DB 로그 검토</h3>
        <p className="leading-7">
          DB 접근 로그는 매월 정기적으로 검토한다.
          <br />
          비인가 접근 시도(허용되지 않은 IP에서의 접속, 권한 밖 쿼리 실행 시도), 비정상적 대량 조회,
          업무 시간 외 접속, 퇴직자 계정 접속 시도 등을 중점 점검한다.
          <br />
          이상 징후가 발견되면 해당 계정을 즉시 잠금 처리하고, 보안팀이 원인을 조사한다.
          <br />
          검토 결과는 보고서로 작성하여 CISO에게 보고하며, 반복적으로 발생하는 패턴은 접근 정책 개선에 반영한다.
        </p>

        <DbSecurityPolicyViz />

        <h3 className="text-xl font-semibold mt-8 mb-4">비밀번호 정책</h3>
        <p className="leading-7">
          시스템 계정과 관리자 계정 모두에 강력한 비밀번호 정책을 적용한다.
          <br />
          최소 8자 이상, 영문 대소문자 + 숫자 + 특수문자를 모두 포함해야 하며,
          이전에 사용한 비밀번호 재사용은 최소 5세대까지 금지한다.
        </p>
        <p className="leading-7">
          비밀번호 변경 주기는 90일이다. 90일이 경과하면 시스템에서 강제로 변경을 요구하고, 변경 전까지 접근을 차단한다.
          <br />
          6개월 이상 접속 이력이 없는 계정은 자동으로 잠금 처리한다.
          장기 미사용 계정은 이미 퇴직했거나 부서 이동한 인원의 계정일 가능성이 높으므로,
          잠금 해제 시 소속 부서 확인과 권한 재검토를 거친다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">관리자 페이지 보안</h3>
        <p className="leading-7">
          VASP 내부 관리자 페이지(Admin Panel)는 거래 승인, 이용자 정보 조회, 시스템 설정 변경 등
          민감한 기능이 집중된 인터페이스다.
          <br />
          접근 시 2차 인증(OTP, 인증서 등)을 필수로 적용하며, 비밀번호만으로는 진입할 수 없다.
        </p>
        <p className="leading-7">
          중복 로그인은 제한한다. 동일 계정이 두 곳 이상에서 동시에 접속하면 이전 세션을 강제 종료하거나 접속을 차단한다.
          <br />
          이는 계정 탈취 시 공격자와 정당한 사용자가 동시에 접속하는 상황을 방지하고,
          세션 하이재킹(session hijacking)의 피해를 최소화하기 위함이다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">nginx 보안 설정</h3>
        <p className="leading-7">
          웹 서버(nginx 등)는 외부에 노출되는 첫 번째 관문이므로 보안 설정을 세밀하게 적용한다.
          <br />
          <code>server_tokens off</code> 설정으로 응답 헤더에서 서버 버전 정보를 숨긴다.
          공격자가 버전 정보를 알면 해당 버전의 알려진 취약점(CVE)을 바로 시도할 수 있기 때문이다.
        </p>
        <p className="leading-7">
          기본 에러 페이지(404, 500 등)를 커스텀 페이지로 교체한다.
          기본 에러 페이지에는 서버 소프트웨어 이름과 버전이 포함되어 정보 유출의 원인이 된다.
          <br />
          API 응답에서 인증 토큰이나 세션 ID가 URL 파라미터나 에러 메시지에 노출되지 않도록 점검한다.
          토큰은 반드시 HTTP 헤더(Authorization)나 암호화된 쿠키로만 전달해야 한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">UUID 적용: 열거공격 방지</h3>
        <p className="leading-7">
          데이터베이스의 순차 ID(auto-increment)를 외부에 그대로 노출하면 열거공격(enumeration attack)에 취약해진다.
          <br />
          열거공격이란 공격자가 ID를 1, 2, 3, ... 순서로 요청하여 존재하는 모든 레코드를 수집하는 기법이다.
          이용자 수, 거래 건수, 지갑 주소 목록 등 비즈니스 기밀이 유출될 수 있다.
        </p>
        <p className="leading-7">
          이를 방지하기 위해 외부에 노출되는 식별자는 UUID(Universally Unique Identifier, 범용 고유 식별자)를 사용한다.
          <br />
          UUID v4는 122비트 랜덤 값으로 생성되므로 다음 ID를 추측하는 것이 사실상 불가능하다.
          <br />
          내부적으로는 순차 ID를 유지하되(인덱싱 성능), API 응답에는 UUID만 반환하는 이중 구조를 적용한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">AWS Secrets Manager: 시크릿 외부 주입</h3>
        <p className="leading-7">
          DB 접속 정보, API 키, 암호화 키 등 시크릿(secret)을 소스코드나 설정 파일에 하드코딩하면
          Git 저장소 유출, 로그 노출, 배포 파이프라인 침해 시 키가 함께 탈취된다.
        </p>
        <p className="leading-7">
          AWS Secrets Manager나 동등한 시크릿 관리 서비스를 사용하여 시크릿을 외부에서 주입(injection)하는 구조로 전환한다.
          <br />
          애플리케이션은 시작 시 Secrets Manager API를 호출하여 필요한 시크릿을 메모리에 로드하고,
          디스크에는 일절 기록하지 않는다.
          <br />
          시크릿 교체(rotation)도 Secrets Manager에서 자동화할 수 있다.
          교체 주기를 설정하면 주기적으로 새 시크릿이 생성되고, 이전 시크릿은 유예 기간 후 폐기된다.
          <br />
          누가 언제 어떤 시크릿에 접근했는지 감사 로그가 자동으로 남으므로,
          비인가 접근 시도를 실시간으로 탐지할 수 있다.
        </p>
      </div>
    </section>
  );
}
