import OverviewViz from './viz/OverviewViz';
import OwaspFlowViz from './viz/OwaspFlowViz';
import EnvSeparationViz from './viz/EnvSeparationViz';

export default function Overview() {
  return (
    <section id="overview" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">개발 보안이 필요한 이유</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <OverviewViz />

        <h3 className="text-xl font-semibold mt-8 mb-4">ISMS 2.8: 정보시스템 도입 및 개발 보안</h3>
        <p className="leading-7">
          ISMS-P 인증 기준 2.8(정보시스템 도입 및 개발 보안)은 시스템을 새로 도입하거나 개발할 때
          보안 요구사항을 설계 단계부터 반영하도록 의무화한다.
          <br />
          운영 중인 시스템에 보안을 덧붙이는 것보다 설계 시점에 반영하는 비용이 수십 배 낮다.
          <br />
          개발 완료 후 취약점을 발견하면 코드 수정, 재테스트, 재배포 전 과정을 반복해야 하므로 시간과 비용이 급격히 증가한다.
        </p>
        <p className="leading-7">
          이 기준이 요구하는 핵심은 세 가지다.
          <br />
          첫째, 시큐어코딩(secure coding) 기준을 수립하고 개발자가 준수하도록 교육한다.
          <br />
          둘째, 개발/테스트/운영 환경을 분리하여 각 환경 간 데이터와 접근을 통제한다.
          <br />
          셋째, 배포 전 보안 검수(코드 리뷰, 취약점 스캔)를 수행하여 알려진 취약점이 운영 환경에 도달하지 않도록 한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">OWASP Top 10: 가장 흔한 웹 취약점</h3>
        <p className="leading-7">
          OWASP(Open Web Application Security Project)는 웹 애플리케이션 보안에 관한 국제 커뮤니티로,
          주기적으로 가장 빈번하고 위험한 취약점 10가지를 선정하여 발표한다.
          <br />
          이 목록은 개발 보안의 체크리스트 역할을 하며, 대부분의 시큐어코딩 가이드라인이 OWASP Top 10을 기반으로 작성된다.
        </p>
        <p className="leading-7">
          주요 항목을 요약하면 다음과 같다.
          <br />
          접근 제어 취약점(Broken Access Control)은 인가되지 않은 사용자가 다른 사용자의 데이터에 접근하는 것이다.
          URL 파라미터의 ID를 변경하여 타인의 정보를 조회하는 IDOR(Insecure Direct Object Reference, 안전하지 않은 직접 객체 참조)이 대표적이다.
          <br />
          인젝션(Injection)은 공격자가 입력값에 악성 코드를 삽입하여 서버에서 실행시키는 것이다.
          SQL Injection, Command Injection, LDAP Injection이 이 범주에 속한다.
          <br />
          암호화 실패(Cryptographic Failures)는 민감 데이터를 평문으로 저장하거나, 약한 알고리즘을 사용하거나, 키 관리를 소홀히 하는 경우다.
        </p>
        <p className="leading-7">
          취약한 인증(Identification and Authentication Failures)은 약한 비밀번호 정책, 세션 고정, 무제한 로그인 시도 등이다.
          <br />
          보안 설정 오류(Security Misconfiguration)는 기본 계정 미변경, 불필요한 서비스 활성화, 디버그 모드 방치 등이다.
          <br />
          서버사이드 요청 위조(SSRF, Server-Side Request Forgery)는 서버가 공격자가 지정한 내부 URL로 요청을 보내게 만드는 것이다.
          <br />
          이 목록을 개발 단계에서 체계적으로 점검하면 실제 공격의 80% 이상을 사전에 차단할 수 있다.
        </p>

        <OwaspFlowViz />

        <h3 className="text-xl font-semibold mt-8 mb-4">시큐어코딩: 입력값 검증과 출력값 인코딩</h3>
        <p className="leading-7">
          시큐어코딩의 핵심 원칙은 "모든 입력은 신뢰하지 않는다(Never Trust User Input)"이다.
          <br />
          클라이언트에서 전달되는 모든 데이터 -- 폼 필드, URL 파라미터, HTTP 헤더, 쿠키 -- 는 조작 가능하다.
          <br />
          서버 측에서 반드시 검증(validation)하여 허용된 형식과 범위만 통과시킨다.
        </p>
        <p className="leading-7">
          입력값 검증의 원칙은 화이트리스트(whitelist, 허용 목록) 방식이다.
          <br />
          허용할 문자, 길이, 형식을 정의하고 그 외는 모두 거부한다.
          블랙리스트(blacklist, 차단 목록)는 알려진 악성 패턴만 차단하므로 우회가 가능하여 근본적 방어가 되지 않는다.
          <br />
          예를 들어 이메일 필드는 정규표현식으로 이메일 형식만 허용하고, 나이 필드는 1~150 범위의 정수만 허용한다.
        </p>
        <p className="leading-7">
          출력값 인코딩(output encoding)은 서버가 브라우저에 데이터를 출력할 때 HTML 특수문자를 이스케이프하는 것이다.
          <br />
          이용자가 입력한 값에 &lt;script&gt; 태그가 포함되어 있을 때,
          인코딩 없이 그대로 출력하면 브라우저가 자바스크립트를 실행하여 XSS(Cross-Site Scripting) 공격이 성립한다.
          <br />
          &lt;를 &amp;lt;로, &gt;를 &amp;gt;로 변환하면 브라우저는 이를 태그가 아닌 텍스트로 해석한다.
          <br />
          현대 프론트엔드 프레임워크(React, Vue)는 기본적으로 출력 인코딩을 수행하지만,
          dangerouslySetInnerHTML 같은 우회 API를 사용하면 인코딩이 무시되므로 주의해야 한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">환경 분리: 개발/테스트/운영</h3>
        <p className="leading-7">
          개발(development), 테스트(staging), 운영(production) 환경은 물리적 또는 논리적으로 분리해야 한다.
          <br />
          분리의 목적은 세 가지다.
          <br />
          첫째, 개발 중인 불안정한 코드가 운영 시스템에 영향을 주지 않도록 한다.
          <br />
          둘째, 운영 데이터(실제 이용자 개인정보)가 개발 환경에 존재하지 않도록 한다.
          개발 환경에는 가명처리(pseudonymization)된 테스트 데이터만 사용한다.
          <br />
          셋째, 각 환경별로 접근 권한을 다르게 설정한다.
          개발자는 개발 환경에 전체 권한을 가지지만, 운영 환경에는 읽기 전용 또는 접근 불가로 설정한다.
        </p>
        <p className="leading-7">
          환경 간 코드 이동은 반드시 정해진 파이프라인을 통해서만 이루어져야 한다.
          <br />
          개발 환경에서 기능 개발 → 테스트 환경에서 통합 테스트 및 보안 검수 → 승인 후 운영 환경에 배포.
          <br />
          개발자가 운영 서버에 직접 SSH 접속하여 코드를 수정하는 행위는 변경 추적이 불가능하고 롤백도 어려우므로 절대 허용하지 않는다.
        </p>

        <EnvSeparationViz />

        <h3 className="text-xl font-semibold mt-8 mb-4">보안 검수: 코드 리뷰와 취약점 스캔</h3>
        <p className="leading-7">
          코드가 운영 환경에 배포되기 전에 보안 검수(security review)를 거쳐야 한다.
          <br />
          보안 검수는 두 가지 축으로 구성된다: 사람에 의한 코드 리뷰와 자동화 도구에 의한 취약점 스캔.
        </p>
        <p className="leading-7">
          코드 리뷰(code review)는 PR(Pull Request) 기반으로 수행한다.
          <br />
          리뷰어는 기능 정확성뿐 아니라 보안 체크리스트(입력값 검증, 권한 확인, 민감정보 노출, SQL 쿼리 안전성)를 함께 확인한다.
          <br />
          보안 전문 지식이 있는 리뷰어가 최소 1명 포함되는 것이 이상적이다.
        </p>
        <p className="leading-7">
          SAST(Static Application Security Testing, 정적 분석)는 소스코드를 실행하지 않고 분석하여 취약 패턴을 탐지한다.
          <br />
          DAST(Dynamic Application Security Testing, 동적 분석)는 실행 중인 애플리케이션에 모의 공격을 수행하여 실제 취약점을 발견한다.
          <br />
          SAST는 개발 초기에, DAST는 테스트 환경 배포 후에 수행하여 서로 보완한다.
          <br />
          CI/CD 파이프라인에 두 도구를 모두 통합하면 매 배포마다 자동으로 보안 검수가 이루어진다.
        </p>
      </div>
    </section>
  );
}
