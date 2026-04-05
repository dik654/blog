import WebAppViz from './viz/WebAppViz';

export default function WebAppSecurity() {
  return (
    <section id="webapp-security" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">웹 보안 — 노출되면 안 되는 것들</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">

        <p>
          웹 애플리케이션 보안은 심사원이 가장 "눈으로 직접 확인"하기 쉬운 영역이다.<br />
          브라우저에서 URL을 몇 번 쳐보면 바로 결함이 드러나기 때문.<br />
          우리 거래소에서 실제로 지적받은 항목들을 정리한다.
        </p>

        <div className="my-8">
          <WebAppViz />
        </div>

        {/* ── nginx 버전 노출 ── */}
        <h3 className="text-xl font-semibold mt-6 mb-3">nginx 버전 노출 — 에러 페이지의 함정</h3>

        <h4 className="text-lg font-semibold mt-4 mb-2">BEFORE</h4>
        <p>
          심사원이 브라우저에 존재하지 않는 URL을 입력했다. <code>https://우리도메인/asdf</code> 같은 것.<br />
          nginx 기본 404 페이지가 나왔는데, 페이지 하단에 <code>nginx/1.18.0</code> 버전 정보가 그대로 노출되고 있었다.<br />
          500 에러 페이지도 마찬가지 — 서버 내부 오류 발생 시 nginx 버전뿐 아니라 경우에 따라 스택 트레이스(Stack Trace, 에러 발생 위치를 추적한 로그)까지 노출되었다.
        </p>
        <p>
          서버 소프트웨어와 버전 정보가 노출되면, 공격자가 해당 버전의 알려진 취약점(CVE, Common Vulnerabilities and Exposures)을 검색하여 타겟 공격이 가능하다.
        </p>

        <h4 className="text-lg font-semibold mt-4 mb-2">AFTER</h4>
        <p>
          두 가지 조치를 동시에 적용했다:
        </p>
        <ol>
          <li>
            <strong>server_tokens off</strong> — nginx 설정에 <code>server_tokens off;</code> 를 추가.
            이 설정은 에러 페이지와 응답 헤더에서 nginx 버전 정보를 제거한다.
            <code>Server: nginx</code> 헤더 자체는 남지만 버전 번호는 사라진다.
          </li>
          <li>
            <strong>커스텀 에러 페이지</strong> — 404, 500 등 주요 에러 코드에 대해 자체 제작한 에러 페이지를 연결.
            "요청하신 페이지를 찾을 수 없습니다" 같은 안내 문구만 표시하고, 서버 정보나 경로 정보는 일절 포함하지 않음.
          </li>
        </ol>
        <p>
          이 설정을 테스트 서버와 운영 서버 모두에 적용했다.<br />
          테스트 서버만 적용하고 운영 서버를 빼먹는 실수를 방지하기 위해, Ansible(서버 설정 자동화 도구) 플레이북에 포함시켜 일괄 배포했다.
        </p>

        {/* ── nginx 실행 권한 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">nginx 실행 권한 — root로 돌리면 안 된다</h3>

        <h4 className="text-lg font-semibold mt-4 mb-2">BEFORE</h4>
        <p>
          심사원이 서버에서 <code>ps aux | grep nginx</code> 를 치라고 했다.<br />
          nginx 마스터 프로세스가 root로 실행되고 있었는데, 이것 자체는 정상이다 — nginx는 80/443 포트를 바인딩하기 위해 마스터 프로세스가 root로 시작된다.<br />
          문제는 워커 프로세스(Worker Process, 실제 요청을 처리하는 프로세스)도 root로 실행되고 있었다는 점.
        </p>

        <h4 className="text-lg font-semibold mt-4 mb-2">AFTER</h4>
        <p>
          nginx 설정에서 워커 프로세스가 전용 유저(<code>www-data</code> 또는 <code>nginx</code>)로 실행되도록 확인.<br />
          <code>user nginx;</code> 설정이 nginx.conf 최상단에 명시되어야 한다.<br />
          워커 프로세스가 root로 실행되면, 웹 애플리케이션 취약점을 통해 공격자가 root 권한을 획득할 수 있으므로 반드시 분리해야 한다.
        </p>

        {/* ── 순차 ID → UUID ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">순차 ID에서 UUID로 — 열거 공격 차단</h3>

        <h4 className="text-lg font-semibold mt-4 mb-2">BEFORE</h4>
        <p>
          API 응답에 순차적 숫자 ID가 노출되고 있었다.<br />
          예를 들어 회원 상세 API가 <code>/api/users/1</code>, <code>/api/users/2</code>, <code>/api/users/3</code> 형태였다.<br />
          공격자가 숫자를 1부터 순차적으로 올리며 호출하면 전체 회원 정보를 수집할 수 있다 — 이것을 열거 공격(Enumeration Attack)이라고 한다.<br />
          주문, 거래, 입출금 등 다른 리소스도 모두 순차 ID를 사용.
        </p>

        <h4 className="text-lg font-semibold mt-4 mb-2">AFTER</h4>
        <p>
          모든 외부 노출 ID를 UUID(Universally Unique Identifier, 범용 고유 식별자)로 교체했다.<br />
          <code>/api/users/550e8400-e29b-41d4-a716-446655440000</code> 형태로 변경.<br />
          UUID는 128비트 랜덤 값이므로 추측이 사실상 불가능하다.
        </p>
        <p>
          내부 DB에서는 성능을 위해 기존 순차 정수 PK(Primary Key, 기본키)를 유지하고, 별도 <code>uuid</code> 컬럼을 추가하여 외부 노출용으로 사용했다.<br />
          API 요청은 UUID로 받고, 서버 내부에서 UUID → 정수 PK 변환 후 DB 조회.<br />
          API 키 등 외부에 노출되는 모든 키 값도 UUID로 교체했다.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 교훈: 내부 ID를 외부에 그대로 노출하지 마라</strong><br />
          순차 ID 노출은 열거 공격뿐 아니라 비즈니스 정보 유추(가입자 수, 거래 건수 등)에도 악용된다.
          UUID 전환은 초기에 하면 간단하지만, 서비스 운영 중에 하면 마이그레이션 비용이 크다.
          처음부터 외부 노출 ID는 UUID를 사용하는 것이 좋다.
        </p>

        {/* ── 시크릿 하드코딩 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">시크릿 하드코딩 제거 — 소스코드에 비밀번호가?</h3>

        <h4 className="text-lg font-semibold mt-4 mb-2">BEFORE</h4>
        <p>
          Spring Boot의 <code>application.properties</code> 파일에 DB 비밀번호, 외부 API 키 등이 평문으로 하드코딩되어 있었다.<br />
          Git 저장소에 이 파일이 포함되어 있었으므로, 저장소 접근 권한이 있는 모든 개발자가 운영 DB 비밀번호를 볼 수 있는 상태였다.<br />
          심사원이 소스코드 관리 현황을 확인하면서 이 부분을 지적했다.
        </p>

        <h4 className="text-lg font-semibold mt-4 mb-2">AFTER</h4>
        <p>
          AWS Secrets Manager를 도입하여 모든 시크릿을 중앙 관리하도록 변경했다.
        </p>
        <ol>
          <li>
            <strong>시크릿 등록</strong> — DB 비밀번호, API 키, JWT 시크릿 등을 AWS Secrets Manager에 등록.
            각 시크릿에 이름(키)을 부여하고, 접근 권한을 IAM(Identity and Access Management)으로 제한
          </li>
          <li>
            <strong>Python 시크릿 로더</strong> — 서버 시작 전에 실행되는 Python 스크립트 작성.
            이 스크립트가 Secrets Manager에서 시크릿 값을 조회하여 환경변수로 설정.
            <code>application.properties</code>에서는 <code>${'${DB_PASSWORD}'}</code> 같은 환경변수 참조만 사용
          </li>
          <li>
            <strong>소스코드 정리</strong> — 기존 <code>application.properties</code>에서 평문 시크릿 전부 제거.
            Git 히스토리에도 시크릿이 남아있으므로, BFG Repo-Cleaner로 히스토리 정리 후 강제 푸시
          </li>
        </ol>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 교훈: Git 히스토리도 증적이다</strong><br />
          소스코드에서 시크릿을 삭제해도, Git 히스토리를 뒤지면 이전 커밋에 남아있다.
          심사원이 Git 히스토리까지 확인하는 경우는 드물지만, 시크릿이 유출된 적이 있는지 질문할 수 있다.
          시크릿을 코드에 절대 커밋하지 않는 문화를 만들고, .gitignore와 pre-commit hook으로 방지해야 한다.
        </p>

        {/* ── 출금/대출 2차 승인 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">출금/대출 2차 승인 — 프록시 공격 방어</h3>

        <h4 className="text-lg font-semibold mt-4 mb-2">BEFORE</h4>
        <p>
          관리자 페이지에서 출금 요청이나 대출 승인을 처리할 때, 1차 승인만 있었다.<br />
          담당자 한 명이 승인 버튼을 누르면 즉시 처리되는 구조.<br />
          내부자 공모나 계정 탈취 시 단일 승인만으로 자산 유출이 가능한 상태.
        </p>

        <h4 className="text-lg font-semibold mt-4 mb-2">AFTER</h4>
        <p>
          2차 승인 체계를 추가했다:
        </p>
        <ol>
          <li><strong>1차 승인</strong> — 담당자가 출금/대출 요청을 검토하고 1차 승인</li>
          <li><strong>2차 승인</strong> — 다른 권한자(상급자 또는 교차 담당자)가 내용을 확인하고 2차 승인. 1차 승인자와 2차 승인자는 반드시 다른 사람이어야 함</li>
          <li><strong>처리</strong> — 1차 + 2차 승인이 모두 완료된 건만 실제 출금/대출 실행</li>
        </ol>
        <p>
          보안의 핵심은 <code>second_auth</code> 값의 서버 사이드 검증이다.<br />
          프록시 도구(Burp Suite 등)로 HTTP 요청을 가로채서 <code>second_auth</code> 파라미터를 <code>true</code>로 변조하더라도, 서버에서 세션을 직접 확인한다.<br />
          세션에 2차 승인 완료 기록이 없으면 요청을 거부하므로, 클라이언트 사이드 조작으로는 우회가 불가능하다.
        </p>

        {/* ── 커스텀 에러 페이지 상세 ── */}
        <h3 className="text-xl font-semibold mt-8 mb-3">커스텀 에러 페이지 — 정보 차단의 마지막 방어선</h3>

        <h4 className="text-lg font-semibold mt-4 mb-2">BEFORE</h4>
        <p>
          nginx 기본 에러 페이지뿐 아니라, Spring Boot 기본 에러 페이지도 문제였다.<br />
          Spring Boot의 Whitelabel Error Page가 활성화되어 있어서, 에러 발생 시 스택 트레이스, 클래스 경로, 패키지 구조가 노출되었다.<br />
          공격자에게 "이 서비스는 Spring Boot를 쓰고, 이런 패키지 구조를 가지고 있다"는 정보를 무료로 제공한 셈.
        </p>

        <h4 className="text-lg font-semibold mt-4 mb-2">AFTER</h4>
        <p>
          Spring Boot의 <code>server.error.include-stacktrace=never</code> 설정으로 스택 트레이스 노출 차단.<br />
          <code>server.error.whitelabel.enabled=false</code>로 기본 에러 페이지 비활성화.<br />
          커스텀 <code>ErrorController</code>를 구현하여 모든 에러 응답을 통일된 JSON 형식으로 반환하되, 내부 정보는 포함하지 않음.<br />
          운영 환경에서는 에러 로그만 서버에 기록하고, 클라이언트에는 "서비스 처리 중 오류가 발생했습니다" 메시지만 반환.
        </p>

        <p className="text-sm border-l-2 border-amber-500/50 pl-3 mt-4">
          <strong>{'💡'} 교훈 종합</strong><br />
          웹 보안의 기본 원칙은 "불필요한 정보를 노출하지 않는 것"이다.
          서버 버전, 스택 트레이스, 순차 ID, 소스코드 내 시크릿 — 모두 "몰라도 되는 정보"가 외부에 노출된 사례.
          심사원은 브라우저에서 URL 몇 번 쳐보는 것만으로 이런 취약점을 즉시 발견한다.
          nginx 설정, 에러 페이지, API 설계, 시크릿 관리를 심사 전에 반드시 점검해야 한다.
        </p>

      </div>
    </section>
  );
}
