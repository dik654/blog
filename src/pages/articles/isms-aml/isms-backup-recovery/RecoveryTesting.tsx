import RecoveryTestingViz from './viz/RecoveryTestingViz';
import RecoveryProcedureInline from './viz/RecoveryProcedureInline';
import RetentionDrillInline from './viz/RetentionDrillInline';

export default function RecoveryTesting() {
  return (
    <section id="recovery-testing" className="mb-16 scroll-mt-20">
      <h2 className="text-2xl font-bold mb-6">복구 절차와 테스트</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <RecoveryTestingViz />
        <h3 className="text-xl font-semibold mt-8 mb-4">DB 복구 절차</h3>
        <p className="leading-7">
          DB 복구는 가장 빈번하게 수행되는 복구 유형이다.
          <br />
          S3에서 해당 시점의 백업 덤프 파일을 다운로드하는 것에서 시작한다.
          암호화된 백업이면 복호화 키를 KMS(Key Management Service)에서 가져와 복호화를 먼저 수행한다.
        </p>
        <p className="leading-7">
          복원 대상 서버에 원본과 동일한 버전의 DB 엔진을 설치한다.
          <br />
          버전이 다르면 덤프 파일의 SQL 문법이나 데이터 타입 호환성 문제가 발생할 수 있으므로, 백업 시 DB 버전을 함께 기록해 두는 것이 중요하다.
          <br />
          덤프 파일을 import하여 데이터를 복원한 후, 테이블 수와 레코드 수를 원본과 대조한다.
          주요 설정값(문자셋, 타임존, max_connections 등)이 원본과 일치하는지 확인한다.
        </p>
        <p className="leading-7">
          마지막으로 애플리케이션을 연결하여 실제 서비스가 정상 동작하는지 점검한다.
          <br />
          읽기/쓰기 쿼리를 모두 테스트하고, API 응답이 기대값과 일치하는지 검증한다.
          이상이 없으면 복구 완료로 판정하고, 복구 소요 시간을 기록하여 RTO 준수 여부를 확인한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">시스템 복구 절차</h3>
        <p className="leading-7">
          시스템 복구는 OS와 애플리케이션 환경 전체를 복원하는 작업이다.
          <br />
          Clonezilla(오픈소스 디스크 이미징 도구) 같은 이미징 소프트웨어로 생성한 전체 디스크 이미지를 사용한다.
          외장 HDD 또는 네트워크 스토리지에서 이미지를 가져와 대상 디스크에 복원한다.
        </p>
        <p className="leading-7">
          복원 후 첫 번째로 부팅이 정상적으로 완료되는지 확인한다.
          <br />
          부팅 실패의 흔한 원인은 부트로더(bootloader) 손상, 하드웨어 변경으로 인한 드라이버 불일치, 디스크 UUID 변경이다.
          이런 경우 복구 모드(recovery mode)로 진입하여 부트로더를 재설치하거나 설정을 수정한다.
        </p>
        <p className="leading-7">
          부팅 확인 후 설정 파일을 하나씩 검토한다.
          <br />
          네트워크 설정(IP, 게이트웨이, DNS)이 현재 환경에 맞는지, 방화벽 규칙이 올바른지, 크론 스케줄이 정상 등록되어 있는지 점검한다.
          서비스(nginx, mysql, application daemon 등)를 하나씩 시작하면서 각각의 정상 동작을 확인한다.
        </p>

        <RecoveryProcedureInline />

        <h3 className="text-xl font-semibold mt-8 mb-4">복구 테스트</h3>
        <p className="leading-7">
          백업이 실제로 복원 가능한지는 테스트하기 전까지 확신할 수 없다.
          <br />
          백업 파일이 손상되었거나, 백업 과정에서 일부 데이터가 누락되었거나, 복원 절차서가 현재 환경과 맞지 않는 경우가 빈번하다.
          복구 테스트 없이 "백업이 있으니 안전하다"고 판단하는 것은 위험한 착각이다.
        </p>
        <p className="leading-7">
          복구 테스트는 백업 직후에 수행하는 것이 가장 효과적이다.
          <br />
          매번 전체 복원을 수행하면 시간과 자원이 많이 드므로, 샘플링 기법을 허용한다.
          월별로 주요 DB 테이블 5~10개를 선정하여 복원하고, 분기별로 전체 시스템 복원을 1회 수행하는 방식이다.
          <br />
          테스트 환경은 프로덕션과 분리된 별도의 서버나 VM(Virtual Machine)에서 수행하여 실 서비스에 영향을 주지 않도록 한다.
        </p>

        <RetentionDrillInline />

        <h3 className="text-xl font-semibold mt-8 mb-4">보존 기간</h3>
        <p className="leading-7">
          백업 데이터의 보존 기간은 법적 요구와 업무 필요에 따라 차등 설정한다.
          <br />
          일반 운영 데이터는 6개월을 기본 보존 기간으로 설정한다.
          6개월이면 대부분의 운영 이슈를 추적할 수 있고, 저장 비용도 적정 수준으로 관리된다.
        </p>
        <p className="leading-7">
          법적 의무가 있는 데이터는 3~5년간 보존한다.
          <br />
          전자금융거래법은 전자금융거래 기록을 5년간 보존하도록 규정하고, 개인정보보호법은 처리 목적 달성 후 지체 없이 파기하되 다른 법령에서 보존을 요구하는 경우 해당 기간만큼 보관하도록 한다.
          <br />
          CCTV 영상은 별도의 보존 규정이 적용되며, 설치 목적에 따라 30일~1년 등 다양하다.
          CCTV 백업은 용량이 크므로 전용 NAS(Network Attached Storage)나 별도 스토리지에 보관하는 것이 일반적이다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">복구 시나리오별 절차서</h3>
        <p className="leading-7">
          사고 유형마다 복구 절차가 다르므로, 시나리오별 절차서를 사전에 작성해 둔다.
          <br />
          DB 장애 시나리오: 마지막 정상 백업에서 복원 → 바이너리 로그(binlog)로 장애 직전까지 재생(point-in-time recovery) → 데이터 정합성 검증 → 서비스 재개.
          <br />
          서버 장애 시나리오: 디스크 이미지에서 OS 복원 → 네트워크/방화벽 설정 확인 → 서비스 데몬 시작 → 모니터링 정상 여부 확인.
        </p>
        <p className="leading-7">
          랜섬웨어 시나리오: 감염 시스템 네트워크 격리 → 감염 범위 파악 → 클린 환경에서 OS 재설치 → 감염 이전 시점의 백업에서 복원 → 감염 경로에 해당하는 취약점 패치 → 서비스 재개.
          <br />
          자연재해 시나리오: 주 사이트 접근 불가 판정 → DR(Disaster Recovery) 사이트 활성화 → 소산백업에서 최신 데이터 복원 → DNS/로드밸런서를 DR 사이트로 전환 → 서비스 재개.
          <br />
          각 절차서는 담당자, 예상 소요 시간, 필요 도구, 연락처를 포함하여 사고 현장에서 즉시 참조할 수 있게 작성한다.
        </p>

        <h3 className="text-xl font-semibold mt-8 mb-4">정기 훈련</h3>
        <p className="leading-7">
          연 1회 이상 복구 모의훈련을 실시하여 절차서의 실효성과 복구 역량을 검증한다.
          <br />
          훈련은 가상의 장애 시나리오를 설정하고, 실제로 백업에서 복원을 수행하는 방식으로 진행한다.
          "DB가 랜섬웨어로 암호화되었다"는 시나리오라면, 실제로 테스트 환경에서 백업 복원부터 서비스 재개까지 전 과정을 수행한다.
        </p>
        <p className="leading-7">
          훈련에서 측정하는 핵심 지표는 복구 소요 시간(실제 RTO)과 데이터 손실량(실제 RPO)이다.
          <br />
          목표 RTO/RPO를 초과했다면 백업 빈도를 높이거나, 복구 절차를 간소화하거나, 인프라를 보강해야 한다.
          <br />
          훈련 종료 후 결과 보고서를 작성한다.
          보고서에는 시나리오 내용, 참여 인원, 각 단계별 소요 시간, 발견된 문제점, 개선 조치 계획을 포함한다.
          경영진에게 보고하여 예산과 인력 확보의 근거로 활용한다.
          <br />
          훈련 미실시는 ISMS 인증 심사에서 결함으로 판정될 수 있으므로 연간 계획에 포함하여 일정을 관리한다.
        </p>
      </div>
    </section>
  );
}
