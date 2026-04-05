export default function BackupPolicy() {
  return (
    <section id="backup-policy" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">백업 정책과 절차</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <h3 className="text-xl font-semibold mt-8 mb-4">DB 백업</h3>
        <p className="leading-7">
          데이터베이스는 서비스의 핵심 자산이므로 가장 높은 빈도와 가장 긴 보관 기간을 적용한다.
          <br />
          mysqldump(또는 pg_dump) 같은 논리 백업 도구를 사용하여 매일 자동 백업을 수행한다.
          크론(cron) 스케줄러로 새벽 시간대에 실행하면 서비스 부하를 최소화할 수 있다.
        </p>
        <p className="leading-7">
          백업 파일은 클라우드 오브젝트 스토리지(S3 등)에 즉시 업로드한다.
          <br />
          S3 버킷에는 버전 관리(versioning)를 활성화하여 실수로 덮어쓰거나 삭제하는 것을 방지한다.
          수명 주기 규칙(lifecycle rule)으로 30일 이상 지난 백업은 저렴한 스토리지 클래스(Glacier 등)로 자동 이전하거나 삭제한다.
          <br />
          개인정보가 포함된 DB 덤프는 반드시 AES-256 암호화를 적용한 후 업로드한다.
          암호화 키는 백업 파일과 분리된 별도의 키 관리 서비스(KMS, Key Management Service)에서 관리한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">서버 설정 백업</h3>
        <p className="leading-7">
          서버 설정 파일은 /etc(시스템 설정), /opt(애플리케이션), /home(사용자 환경)을 주요 대상으로 한다.
          <br />
          설정 파일의 변경 빈도는 DB보다 낮으므로, 분기별 수동 전체백업이 현실적이다.
          다만 중요 설정 변경(방화벽 룰, 네트워크 설정 등)이 있을 때는 변경 전후로 즉시 백업을 수행한다.
        </p>
        <p className="leading-7">
          서버 설정 백업은 물리 금고에 보관하는 외장 HDD에 저장한다.
          <br />
          클라우드에도 복사본을 두되, 물리 매체를 별도로 유지하는 이유는 클라우드 서비스 자체의 장애나 계정 침해에 대비하기 위함이다.
          보관 기간은 1년으로 설정하여, 최소 4개의 분기별 스냅샷을 유지한다.
          <br />
          전체 서버 이미지(OS + 설정 + 애플리케이션)는 Clonezilla 같은 디스크 이미징 도구로 별도 생성한다.
          이미지 백업이 있으면 하드웨어 교체 시 OS 재설치 없이 동일 환경을 빠르게 복원할 수 있다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">애플리케이션 로그 백업</h3>
        <p className="leading-7">
          /var/log 디렉토리에 쌓이는 애플리케이션 로그는 매일 증분백업을 수행한다.
          <br />
          로그는 용량이 빠르게 증가하므로 전체백업 대신 증분백업으로 저장 효율을 높인다.
          백업 대상에는 웹 서버 접근 로그, 에러 로그, 보안 이벤트 로그, DB 쿼리 로그가 포함된다.
        </p>
        <p className="leading-7">
          로그 백업은 S3에 저장하되, 장기 보관분은 Glacier(저비용 아카이브 스토리지)로 이전한다.
          <br />
          기본 보관 기간은 6개월이며, 침해사고 조사나 법적 분쟁에 필요한 경우 개별 연장한다.
          <br />
          로그의 무결성은 보안 감사에서 핵심적으로 검증하는 항목이다.
          백업 시 로그 파일의 해시값(SHA-256)을 함께 기록하여, 추후 변조 여부를 확인할 수 있게 한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">백업 절차</h3>
        <p className="leading-7">
          백업 절차의 첫 단계는 NTP(Network Time Protocol) 동기화다.
          <br />
          모든 서버의 시스템 시간을 단일 NTP 서버에 맞추어야 백업 파일의 타임스탬프가 일관되고, 증분백업의 기준 시점이 정확해진다.
          시간이 어긋나면 증분백업에서 변경 파일을 누락하거나 중복 포함하는 오류가 발생할 수 있다.
        </p>
        <p className="leading-7">
          NTP 동기화 후 최초 전체백업을 수행한다.
          <br />
          이후부터는 크론 스케줄러를 이용하여 설정된 주기에 따라 자동으로 증분백업이 실행된다.
          <br />
          개인정보가 포함된 백업 파일에는 AES-256 암호화를 적용한다.
          암호화는 백업 스크립트 내에서 자동으로 수행되도록 구성하여, 사람의 실수로 암호화가 누락되는 것을 방지한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">소산백업</h3>
        <p className="leading-7">
          소산백업(Off-site Backup)은 지리적으로 분리된 장소에 복사본을 보관하는 것이다.
          <br />
          같은 건물, 같은 데이터센터에만 백업을 두면 화재, 침수, 지진, 정전 같은 물리적 재해에 원본과 백업이 동시에 파괴될 수 있다.
          <br />
          클라우드 환경에서는 서로 다른 리전(region)에 복제하는 방식으로 구현한다.
          예를 들어 주 백업은 서울 리전, 소산백업은 도쿄 리전에 두면 한반도 전체에 영향을 미치는 재해에도 대비할 수 있다.
          <br />
          물리 매체(외장 HDD, 테이프)를 사용하는 경우 전용 금고가 있는 별도 사무실이나 전문 보관 업체에 위탁한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">백업 실패 알림</h3>
        <p className="leading-7">
          백업은 자동화되어 있으므로 실패했을 때 즉시 인지하지 못하면 며칠간 백업 공백이 발생할 수 있다.
          <br />
          백업 스크립트에 종료 코드(exit code) 검사를 넣고, 실패 시 Slack Webhook이나 이메일로 즉시 알림을 발송한다.
          알림에는 실패한 백업 대상, 실패 시각, 에러 메시지를 포함하여 담당자가 바로 원인을 파악할 수 있게 한다.
          <br />
          주간 단위로 백업 성공/실패 현황 리포트를 생성하여 관리자가 전체 상태를 한눈에 파악할 수 있도록 한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">접근통제</h3>
        <p className="leading-7">
          백업 데이터에 대한 접근통제는 원본 데이터와 동일한 수준으로 적용해야 한다.
          <br />
          백업 파일에 민감한 정보(개인정보, 인증 정보, 금융 데이터)가 포함되어 있으므로, 접근이 허술하면 백업이 유출 경로가 된다.
        </p>
        <p className="leading-7">
          클라우드 스토리지(S3 등)에는 IAM(Identity and Access Management) 역할 기반으로 접근을 제한한다.
          <br />
          백업 쓰기 권한은 백업 전용 서비스 계정에만 부여하고, 읽기 권한은 복구 담당자에게만 한정한다.
          퍼블릭 액세스 차단(Block Public Access)을 필수로 활성화하여 외부 노출을 원천 차단한다.
          <br />
          물리 매체는 시건장치가 있는 금고에 보관하고, 출입 기록과 반출/반입 대장을 관리한다.
          금고 열쇠(또는 비밀번호)는 최소 2인 이상의 승인을 거쳐야 접근할 수 있도록 이중 통제(dual control)를 적용한다.
        </p>
      </div>
    </section>
  );
}
