export default function KeyManagement() {
  return (
    <section id="key-management" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">키 관리와 시크릿 관리</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-8 mb-4">소스코드 하드코딩 금지</h3>
        <p className="leading-7">
          암호화 키, DB 비밀번호, API 토큰을 소스코드에 직접 작성하는 것은 가장 흔하면서도 가장 위험한 실수다.
          <br />
          코드가 Git 저장소에 커밋되는 순간, 해당 키는 이력(history)에 영구적으로 남는다.
          커밋을 삭제해도 reflog와 백업에 흔적이 남으므로 사실상 영구 유출과 같다.
        </p>
        <p className="leading-7">
          오픈소스 저장소에 실수로 푸시한 경우 수 분 내에 자동 스캐너(봇)가 키를 수집하여 악용한다.
          <br />
          비공개 저장소라 해도 내부 직원 전체가 키에 접근할 수 있으므로 최소권한 원칙에 위배된다.
          <br />
          git-secrets나 pre-commit hook으로 커밋 전에 키 패턴을 감지하여 차단하는 것이 1차 방어선이다.
          <br />
          이미 유출된 키는 즉시 폐기(revoke)하고 새 키를 발급해야 하며, 폐기하지 않으면 과거 커밋에서 추출하여 악용할 수 있다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">환경변수 주입</h3>
        <p className="leading-7">
          하드코딩의 대안으로 환경변수(environment variable)를 사용한다.
          <br />
          애플리케이션은 코드에 키를 포함하지 않고 실행 시점에 환경변수에서 읽어온다.
          <br />
          .env 파일에 키를 저장하고 .gitignore에 추가하여 저장소에 포함되지 않도록 한다.
        </p>
        <p className="leading-7">
          .env 파일의 파일 권한은 600(소유자만 읽기/쓰기)으로 설정한다.
          <br />
          644나 755로 두면 같은 서버의 다른 계정이 파일을 읽을 수 있으므로 다중 사용자 환경에서 위험하다.
          <br />
          서버에 직접 .env 파일을 두는 방식은 단일 서버에서는 간단하지만, 서버가 수십 대로 늘어나면 관리가 어렵다.
          각 서버에 파일을 배포하는 과정에서 평문 전송이 발생할 수 있고, 키 변경 시 전체 서버를 순회해야 한다.
        </p>
        <p className="leading-7">
          컨테이너 환경(Docker, Kubernetes)에서는 환경변수를 Secret 오브젝트로 관리한다.
          <br />
          Kubernetes Secret은 etcd에 Base64 인코딩으로 저장되므로, 기본 상태에서는 평문과 다를 바 없다.
          etcd 암호화(encryption at rest)를 활성화해야 실질적 보호가 된다.
          <br />
          환경변수 방식의 한계는 프로세스 메모리에 평문 키가 상주한다는 점이다.
          /proc 파일시스템이나 코어 덤프(core dump)에서 추출할 수 있으므로 더 강력한 방법이 필요한 경우 시크릿 매니저를 도입한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">시크릿 매니저: 중앙 집중 키 관리</h3>
        <p className="leading-7">
          시크릿 매니저(Secrets Manager)는 암호화 키, 인증 정보, API 토큰 등 민감 정보를 중앙에서 저장하고 접근을 통제하는 전용 시스템이다.
          <br />
          대표적으로 클라우드 기반의 Secrets Manager 서비스와 오픈소스인 HashiCorp Vault가 있다.
        </p>
        <p className="leading-7">
          클라우드 Secrets Manager는 시크릿을 암호화하여 저장하고, IAM(Identity and Access Management) 정책으로 접근 권한을 세밀하게 제어한다.
          <br />
          애플리케이션은 API 호출로 시크릿을 조회하며, 호출 시마다 접근 로그가 남아 누가 언제 어떤 시크릿을 읽었는지 추적할 수 있다.
          <br />
          시크릿 값 변경 시 애플리케이션 재배포 없이 즉시 반영되므로 키 교체(rotation)가 용이하다.
        </p>
        <p className="leading-7">
          HashiCorp Vault는 자체 호스팅이 가능한 시크릿 관리 도구로, 클라우드 종속성을 피하고 싶을 때 선택한다.
          <br />
          Vault의 핵심 개념은 봉인(seal)/개봉(unseal)이다. Vault가 재시작되면 마스터 키로 봉인된 상태이고,
          Shamir's Secret Sharing 방식으로 분할된 키 조각 중 일정 수를 모아야 개봉된다.
          <br />
          이 구조 덕분에 단일 관리자가 Vault의 모든 시크릿에 접근하는 것이 불가능하다.
          <br />
          동적 시크릿(dynamic secrets) 기능은 요청 시마다 일회용 DB 자격증명을 생성하고 TTL(Time To Live) 후 자동 폐기하여 자격증명 탈취 피해를 최소화한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">키 회전(Rotation)</h3>
        <p className="leading-7">
          키 회전은 암호화 키를 주기적으로 새 키로 교체하는 절차다.
          <br />
          동일한 키를 장기간 사용하면 키가 유출되었으나 인지하지 못한 기간(exposure window)이 길어지고,
          해당 기간 동안 암호화된 모든 데이터가 위험에 노출된다.
          <br />
          주기적 회전은 이 exposure window를 제한하는 효과가 있다.
        </p>
        <p className="leading-7">
          자동 키 회전의 기본 흐름은 다음과 같다.
          <br />
          새 키 생성 후 "활성(active)" 상태로 지정하고 기존 키는 "비활성(inactive)"으로 전환한다.
          신규 데이터는 새 키로 암호화하고, 기존 데이터는 읽기 시 이전 키로 복호화한다.
          <br />
          배경 작업(background job)으로 기존 데이터를 새 키로 재암호화(re-encryption)하면 이전 키를 완전히 폐기할 수 있다.
          <br />
          클라우드 KMS(Key Management Service)는 이 전체 과정을 자동화하며, 키 버전 관리와 감사 로그를 기본 제공한다.
        </p>
        <p className="leading-7">
          회전 주기는 보안 요구 수준에 따라 달라진다.
          <br />
          데이터 암호화 키(DEK, Data Encryption Key)는 90일~1년, 키 암호화 키(KEK, Key Encryption Key)는 1~3년이 일반적이다.
          <br />
          DEK는 실제 데이터를 암호화하는 키이고, KEK는 DEK를 암호화하여 보호하는 상위 키다.
          이 구조를 키 래핑(key wrapping) 또는 봉투 암호화(envelope encryption)라 한다.
          <br />
          봉투 암호화를 사용하면 DEK 교체 시 데이터 전체를 재암호화하는 대신 DEK만 새 KEK로 다시 래핑하면 되므로 대규모 데이터에서도 회전 비용이 낮다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">백업 데이터 암호화</h3>
        <p className="leading-7">
          백업 파일은 운영 DB의 복제본이므로 동일한 수준의 암호화가 적용되어야 한다.
          <br />
          백업을 평문으로 저장하면 운영 DB를 아무리 철저히 보호해도 백업 파일 한 건이 유출될 때 전체 데이터가 노출된다.
        </p>
        <p className="leading-7">
          백업 암호화에는 AES-256을 사용하며, 암호화 키는 백업 파일과 반드시 별도 위치에 보관한다.
          <br />
          백업 파일과 키를 같은 서버에 두면 서버 침해 시 둘 다 유출되어 암호화가 무의미해진다.
          <br />
          키는 시크릿 매니저나 HSM(Hardware Security Module, 하드웨어 보안 모듈)에 보관하고,
          복구 시 키를 별도 경로로 가져와 복호화하는 절차를 수립한다.
        </p>
        <p className="leading-7">
          소산백업(off-site backup)은 원격지에 백업 복사본을 보관하여 화재, 홍수 등 물리적 재해에 대비하는 것이다.
          <br />
          소산백업 전송 시에도 TLS 또는 VPN으로 전송 구간을 암호화하고, 원격지에 도착한 파일 자체도 암호화 상태를 유지해야 한다.
          <br />
          복구 테스트를 정기적으로(분기 1회 이상) 수행하여 백업 파일이 실제로 복호화·복원 가능한지 검증한다.
          암호화된 백업이 복호화 키 분실로 복원 불가능해지면 백업이 존재하지 않는 것과 동일하다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">인증서 관리</h3>
        <p className="leading-7">
          TLS 인증서는 HTTPS 통신의 신뢰 기반이다.
          <br />
          인증서에는 유효 기간(validity period)이 있으며, 만료되면 브라우저가 경고를 표시하고 이용자 신뢰가 무너진다.
          API 서버 간 통신에서 인증서가 만료되면 서비스 전체가 중단될 수 있다.
        </p>
        <p className="leading-7">
          인증서 만료를 방지하려면 모니터링과 자동갱신이 필수다.
          <br />
          certbot(Let's Encrypt 클라이언트)은 인증서 발급부터 갱신까지 자동화하는 도구다.
          기본적으로 90일 유효 인증서를 발급하고, 만료 30일 전에 자동 갱신 스크립트가 실행된다.
          <br />
          자동갱신이 설정되어 있어도 모니터링은 별도로 유지해야 한다.
          DNS 설정 변경, 서버 이전, 방화벽 규칙 변경으로 갱신이 실패할 수 있기 때문이다.
          만료 14일 전, 7일 전, 1일 전에 알림을 발송하는 단계별 경고를 설정한다.
        </p>
        <p className="leading-7">
          인증서 개인키의 보관도 중요하다.
          <br />
          개인키가 유출되면 공격자가 해당 도메인을 사칭(impersonation)하여 중간자 공격(MITM, Man-in-the-Middle)을 수행할 수 있다.
          <br />
          개인키 파일 권한은 600으로 설정하고, 가능하면 HSM에 저장하여 디스크에 평문으로 존재하지 않도록 한다.
          <br />
          인증서 투명성(Certificate Transparency, CT) 로그를 모니터링하면 해당 도메인에 대해
          예상치 못한 인증서가 발급되었는지 탐지할 수 있어 사칭 공격 조기 발견에 유용하다.
        </p>
      </div>
    </section>
  );
}
