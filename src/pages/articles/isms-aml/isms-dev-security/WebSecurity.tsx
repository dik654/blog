import WebSecurityViz from './viz/WebSecurityViz';
import XssDefenseViz from './viz/XssDefenseViz';
import SqlSessionViz from './viz/SqlSessionViz';

export default function WebSecurity() {
  return (
    <section id="web-security" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">웹 애플리케이션 보안 조치</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <WebSecurityViz />

        <h3 className="text-xl font-semibold mt-8 mb-4">서버 정보 노출 방지</h3>
        <p className="leading-7">
          웹 서버가 응답 헤더에 자신의 버전 정보를 노출하면 공격자가 해당 버전의 알려진 취약점을 즉시 활용할 수 있다.
          <br />
          nginx의 경우 기본 설정에서 "Server: nginx/1.24.0" 같은 헤더를 전송한다.
          <br />
          nginx.conf에 server_tokens off; 를 추가하면 버전 번호가 제거되어 "Server: nginx"만 노출된다.
          <br />
          더 철저하게 방어하려면 헤더 자체를 제거하거나, 리버스 프록시에서 Server 헤더를 덮어쓰는 방법도 있다.
        </p>
        <p className="leading-7">
          에러 페이지도 정보 노출의 주요 경로다.
          <br />
          기본 에러 페이지는 스택 트레이스(stack trace), 프레임워크 버전, DB 쿼리 오류 메시지를 그대로 보여준다.
          <br />
          운영 환경에서는 반드시 커스텀 에러 페이지를 설정하여 "요청을 처리할 수 없습니다" 같은 일반 메시지만 표시한다.
          <br />
          상세 에러 정보는 서버 로그에만 기록하고, 로그 파일의 접근 권한을 운영팀으로 제한한다.
          개발 환경에서만 상세 에러를 표시하도록 환경변수로 분기하는 것이 표준 패턴이다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">UUID 적용: 열거 공격 방지</h3>
        <p className="leading-7">
          순차적 정수 ID(auto-increment)를 URL에 노출하면 열거 공격(enumeration attack)에 취약하다.
          <br />
          /users/1, /users/2, /users/3을 순서대로 요청하면 전체 이용자 목록을 추출할 수 있다.
          <br />
          이를 IDOR(Insecure Direct Object Reference, 안전하지 않은 직접 객체 참조)이라 하며,
          OWASP Top 10의 접근 제어 취약점 범주에 해당한다.
        </p>
        <p className="leading-7">
          UUID(Universally Unique Identifier)는 128비트의 무작위 식별자로, 예측이 불가능하다.
          <br />
          /users/550e8400-e29b-41d4-a716-446655440000 형태가 되므로 다음 ID를 추측하여 접근하는 것이 사실상 불가능하다.
          <br />
          UUID v4는 122비트의 랜덤 값을 사용하므로 충돌 확률이 무시할 수 있는 수준이다.
        </p>
        <p className="leading-7">
          UUID만으로 보안이 완성되는 것은 아니다.
          <br />
          서버 측에서 반드시 "이 요청자가 이 리소스에 접근할 권한이 있는가"를 검증해야 한다.
          UUID는 ID 추측을 어렵게 만드는 보조 수단이고, 근본적 방어는 접근 권한 검증(authorization check)이다.
          <br />
          두 가지를 병행하면 UUID를 어떤 경로로 알아내더라도 권한 없이는 접근할 수 없다.
        </p>

        <XssDefenseViz />

        <h3 className="text-xl font-semibold mt-8 mb-4">XSS 방지</h3>
        <p className="leading-7">
          XSS(Cross-Site Scripting)는 공격자가 웹 페이지에 악성 자바스크립트를 삽입하여 다른 이용자의 브라우저에서 실행시키는 공격이다.
          <br />
          Stored XSS는 악성 스크립트가 DB에 저장되어 페이지를 열 때마다 실행되고,
          Reflected XSS는 URL 파라미터에 스크립트를 삽입하여 해당 링크를 클릭한 이용자에게 실행된다.
          <br />
          XSS가 성공하면 이용자의 세션 쿠키 탈취, 키 입력 가로채기, 피싱 페이지 표시가 가능하다.
        </p>
        <p className="leading-7">
          방어 계층은 세 가지다.
          <br />
          첫째, 입력 이스케이프(escaping)를 통해 HTML 특수문자를 무력화한다.
          &lt;script&gt; 태그가 텍스트로 표시되도록 &amp;lt;script&amp;gt;로 변환한다.
          <br />
          둘째, CSP(Content-Security-Policy) 헤더를 설정하여 허용된 출처의 스크립트만 실행되도록 브라우저에 지시한다.
          script-src 'self'로 설정하면 동일 도메인의 스크립트만 허용하고 인라인 스크립트는 차단된다.
          <br />
          셋째, HttpOnly 플래그를 쿠키에 설정하면 자바스크립트에서 document.cookie로 쿠키를 읽을 수 없어
          XSS가 성공하더라도 세션 쿠키 탈취를 방지한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">CSRF 방지</h3>
        <p className="leading-7">
          CSRF(Cross-Site Request Forgery, 사이트 간 요청 위조)는 이용자가 인증된 상태에서
          공격자가 만든 페이지를 방문하면, 이용자의 권한으로 의도하지 않은 요청이 전송되는 공격이다.
          <br />
          예를 들어 은행 사이트에 로그인한 상태에서 악성 사이트를 방문하면,
          이용자 모르게 송금 요청이 은행 서버로 전송될 수 있다.
        </p>
        <p className="leading-7">
          방어 방법은 CSRF 토큰(anti-CSRF token)이다.
          <br />
          서버가 폼을 생성할 때 랜덤 토큰을 함께 발급하고, 폼 제출 시 이 토큰을 검증한다.
          공격자의 사이트에서는 이 토큰 값을 알 수 없으므로 유효한 요청을 만들 수 없다.
          <br />
          SameSite 쿠키 속성을 Strict 또는 Lax로 설정하면 다른 도메인에서의 요청에 쿠키가 포함되지 않아 CSRF를 추가 방어한다.
          <br />
          API 서버에서 POST/PUT/DELETE 같은 상태 변경 요청에는 반드시 CSRF 검증을 적용하고,
          GET 요청은 조회 전용으로만 사용하여 부작용(side effect)이 없도록 설계한다.
        </p>

        <SqlSessionViz />

        <h3 className="text-xl font-semibold mt-8 mb-4">SQL Injection 방지</h3>
        <p className="leading-7">
          SQL Injection은 입력값에 SQL 구문을 삽입하여 DB를 직접 조작하는 공격이다.
          <br />
          로그인 폼의 비밀번호 필드에 ' OR '1'='1 을 입력하면, 쿼리가 SELECT * FROM users WHERE password='' OR '1'='1' 로 변형되어 모든 레코드가 반환된다.
          <br />
          공격자는 이를 통해 인증 우회, 데이터 유출, 데이터 삭제, 심지어 OS 명령 실행까지 가능하다.
        </p>
        <p className="leading-7">
          근본적 방어는 Prepared Statement(매개변수화 쿼리)다.
          <br />
          SQL 쿼리의 구조와 데이터를 분리하여 DB에 전달한다.
          SELECT * FROM users WHERE id = ? 에서 ? 자리에 값이 바인딩되며,
          DB 엔진이 이 값을 순수 데이터로만 처리하므로 SQL 구문으로 해석되지 않는다.
          <br />
          ORM(Object-Relational Mapping)을 사용하면 Prepared Statement가 자동 적용된다.
          그러나 ORM에서도 raw query를 직접 작성하면 Injection에 노출되므로 raw query 사용 시 반드시 매개변수 바인딩을 확인한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">세션 관리</h3>
        <p className="leading-7">
          세션(session)은 이용자의 인증 상태를 서버 측에서 유지하는 메커니즘이다.
          <br />
          세션 ID를 쿠키에 저장하고, 요청마다 이 ID로 서버의 세션 데이터를 조회한다.
          <br />
          세션 ID가 탈취되면 공격자가 이용자를 사칭할 수 있으므로 세션 관리의 보안이 중요하다.
        </p>
        <p className="leading-7">
          HttpOnly 플래그는 자바스크립트에서 쿠키 접근을 차단하여 XSS로 인한 세션 탈취를 방지한다.
          <br />
          Secure 플래그는 HTTPS 연결에서만 쿠키를 전송하여 네트워크 도청으로 인한 탈취를 차단한다.
          <br />
          세션 고정 공격(session fixation)은 공격자가 미리 생성한 세션 ID를 이용자에게 주입하는 것이다.
          이를 방지하려면 로그인 성공 시 기존 세션 ID를 폐기하고 새 세션 ID를 발급(session regeneration)한다.
          <br />
          세션 만료 시간(timeout)을 설정하여 일정 시간 미활동 시 자동 로그아웃한다.
          금융 시스템은 보통 10~15분, 일반 서비스는 30분~1시간이 적절하다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">CORS 설정</h3>
        <p className="leading-7">
          CORS(Cross-Origin Resource Sharing, 교차 출처 리소스 공유)는 브라우저의 동일 출처 정책(Same-Origin Policy)을 제어하는 메커니즘이다.
          <br />
          동일 출처 정책은 도메인, 프로토콜, 포트가 모두 같아야 리소스 접근을 허용한다.
          <br />
          API 서버와 프론트엔드 서버의 도메인이 다르면 CORS 설정이 필요하다.
        </p>
        <p className="leading-7">
          Access-Control-Allow-Origin 헤더에 허용할 도메인을 명시한다.
          <br />
          와일드카드(*)를 사용하면 모든 도메인에서 접근 가능하므로 API가 공개용이 아닌 한 사용하지 않는다.
          <br />
          허용 도메인을 화이트리스트로 관리하고, 요청의 Origin 헤더와 대조하여 허용 여부를 결정한다.
          <br />
          Access-Control-Allow-Credentials: true를 설정할 때는 특히 주의가 필요하다.
          이 헤더가 활성화되면 쿠키가 교차 출처 요청에 포함되므로,
          Allow-Origin에 와일드카드를 사용하면 보안 정책 위반이 되어 브라우저가 요청을 차단한다.
          <br />
          preflight 요청(OPTIONS 메서드)에 대한 응답도 올바르게 설정하여 실제 요청 전에 허용 여부를 정확히 알려줘야 한다.
        </p>
      </div>
    </section>
  );
}
